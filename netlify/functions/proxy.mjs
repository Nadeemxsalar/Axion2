import dns from 'node:dns/promises';
import net from 'node:net';

const MAX = 4 * 1024 * 1024 - 1;
const priv = ip => net.isIPv4(ip) ? /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.test(ip) : /^(::1?$|f[cd]|fe80|::ffff:)/i.test(ip);

async function safe(s) {
  const u = new URL(s);
  if (!/^https?:$/.test(u.protocol)) throw 0;
  const a = await dns.lookup(u.hostname, { all: true });
  if (!a.length || a.some(x => priv(x.address))) throw 0;
  return u;
}

export default async (req) => {
  try {
    if (req.headers.get('sec-fetch-site') !== 'same-origin') return new Response('Forbidden', { status: 403 });
    
    const urlObj = new URL(req.url);
    let u = await safe(urlObj.searchParams.get('u'));
    
    let rg = 'bytes=0-' + MAX;
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('range') || '');
    if (m) rg = m[1] === '' ? 'bytes=-' + Math.min(+m[2], MAX) : 'bytes=' + m[1] + '-' + Math.min(m[2] === '' ? Infinity : +m[2], +m[1] + MAX);
    
    let r;
    for (let i = 0; i < 4; i++) {
      r = await fetch(u, { redirect: 'manual', headers: { range: rg, 'user-agent': 'Mozilla/5.0 Axion' } });
      const l = r.headers.get('location');
      if (r.status >= 300 && r.status < 400 && l) { u = await safe(new URL(l, u)); continue; }
      break;
    }
    
    if (r.status === 200 && +(r.headers.get('content-length') || 0) > MAX) {
      if (r.body) r.body.cancel();
      return new Response('Range not supported by source', { status: 502 });
    }
    
    const headers = new Headers();
    for (const h of ['content-type', 'content-range', 'content-length', 'accept-ranges']) {
      if (r.headers.has(h)) headers.set(h, r.headers.get(h));
    }
    headers.set('cache-control', 'private, max-age=300');
    
    return new Response(r.body, { status: r.status, headers });
  } catch {
    return new Response('Bad request', { status: 400 });
  }
};