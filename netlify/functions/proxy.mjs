/* Axion Range-proxy for Netlify (Functions v2). Same rules as proxy.js (Vercel version):
   only http/https, private addresses refused, max 4 MB per request, only same-origin calls from the app.
   Used by media.js to read audio tracks and embedded subtitles of links that do not allow CORS. */
import dns from 'node:dns/promises';
import net from 'node:net';

const MAX = 4 * 1024 * 1024 - 1;
const priv = ip => net.isIPv4(ip)
  ? /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.test(ip)
  : /^(::1?$|f[cd]|fe80|::ffff:)/i.test(ip);

async function safe(s) {
  const u = new URL(s);
  if (!/^https?:$/.test(u.protocol)) throw 0;
  const a = await dns.lookup(u.hostname, { all: true });
  if (!a.length || a.some(x => priv(x.address))) throw 0;
  return u;
}
const out = (code, text) => new Response(text, { status: code });

/* reads at most `max` bytes of a stream; returns null when there is more (the source ignored our Range) */
async function readUpTo(body, max) {
  const rd = body.getReader(), parts = [];
  let n = 0;
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    n += value.length;
    if (n > max) { rd.cancel().catch(() => 0); return null; }
    parts.push(value);
  }
  return Buffer.concat(parts);
}

export default async (req) => {
  try {
    if (req.headers.get('sec-fetch-site') !== 'same-origin') return out(403, 'Forbidden');
    let u = await safe(new URL(req.url).searchParams.get('u')), rg = 'bytes=0-' + MAX;
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('range') || '');
    if (m && (m[1] || m[2]))
      rg = m[1] === '' ? 'bytes=-' + Math.min(+m[2], MAX)
        : 'bytes=' + m[1] + '-' + Math.min(m[2] === '' ? Infinity : +m[2], +m[1] + MAX);
    let r;
    for (let i = 0; i < 5; i++) {
      r = await fetch(u, { redirect: 'manual', headers: { range: rg, 'user-agent': 'Mozilla/5.0 Axion' } });
      const l = r.headers.get('location');
      if (r.status >= 300 && r.status < 400 && l) {
        if (r.body) r.body.cancel().catch(() => 0);
        if (i === 4) return out(502, 'Too many redirects');
        u = await safe(new URL(l, u));
        continue;
      }
      break;
    }
    const h = new Headers();
    for (const k of ['content-type', 'content-range', 'accept-ranges']) if (r.headers.get(k)) h.set(k, r.headers.get(k));
    h.set('cache-control', 'private, max-age=300');
    if ([204, 205, 304].includes(r.status)) return new Response(null, { status: r.status, headers: h });
    let body = r.body;
    if (r.status === 200) { /* the source ignored Range: allowed only for small files, never stream a whole movie */
      const len = +r.headers.get('content-length');
      if (len > MAX) { r.body && r.body.cancel().catch(() => 0); return out(502, 'Range not supported by source'); }
      if (!len && r.body) {
        const buf = await readUpTo(r.body, MAX);
        if (!buf) return out(502, 'Range not supported by source');
        body = buf; h.set('content-length', String(buf.length));
      }
    }
    if (r.headers.get('content-length') && !h.has('content-length')) h.set('content-length', r.headers.get('content-length'));
    return new Response(body, { status: r.status, headers: h });
  } catch {
    return out(400, 'Bad request');
  }
};