/* Range-only proxy: sirf header/track padhne ke liye (max 4 MB per request), poori video ke liye nahi */
const dns=require('node:dns').promises,net=require('node:net'),{Readable}=require('node:stream'),MAX=4*1024*1024-1;
const priv=ip=>net.isIPv4(ip)?/^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.test(ip):/^(::1?$|f[cd]|fe80|::ffff:)/i.test(ip);
async function safe(s){const u=new URL(s);if(!/^https?:$/.test(u.protocol))throw 0;
 const a=await dns.lookup(u.hostname,{all:true});if(!a.length||a.some(x=>priv(x.address)))throw 0;return u}
module.exports=async(req,res)=>{
 try{
  if(req.headers['sec-fetch-site']!=='same-origin')return res.status(403).end('Forbidden');
  let u=await safe(req.query.u),rg='bytes=0-'+MAX;
  const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
  if(m)rg=m[1]===''?'bytes=-'+Math.min(+m[2],MAX):'bytes='+m[1]+'-'+Math.min(m[2]===''?Infinity:+m[2],+m[1]+MAX);
  let r;
  for(let i=0;i<4;i++){
   r=await fetch(u,{redirect:'manual',headers:{range:rg,'user-agent':'Mozilla/5.0 Axion'}});
   const l=r.headers.get('location');
   if(r.status>=300&&r.status<400&&l){u=await safe(new URL(l,u));continue}break}
  if(r.status===200&&+r.headers.get('content-length')>MAX){r.body&&r.body.cancel();return res.status(502).end('Range not supported by source')}
  res.statusCode=r.status;
  for(const h of['content-type','content-range','content-length','accept-ranges'])if(r.headers.get(h))res.setHeader(h,r.headers.get(h));
  res.setHeader('cache-control','private, max-age=300');
  r.body?Readable.fromWeb(r.body).pipe(res):res.end()
 }catch{res.status(400).end('Bad request')}};
