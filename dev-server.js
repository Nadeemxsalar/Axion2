/* Axion local test server (Node 18+).
   Chalao:  node dev-server.js          ->  http://localhost:8000
            node dev-server.js 3000     ->  http://localhost:3000
   Ye index.html wale folder ko serve karta hai (Range support ke saath, jo python -m http.server mein nahi hota)
   aur /api/proxy par wahi proxy chalata hai jo deploy par chalegi:
     netlify/functions/proxy.mjs  (Netlify)   <- pehle ye dhoondta hai
     api/proxy.js ya proxy.js     (Vercel)    <- ye na mile to */
const http=require('http'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url'),{Readable}=require('stream');
const root=__dirname,port=+process.argv[2]||8000;
const nf=path.join(root,'netlify','functions','proxy.mjs');
const pf=['api/proxy.js','proxy.js'].map(f=>path.join(root,f)).find(f=>fs.existsSync(f));
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css',
 '.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon',
 '.mp4':'video/mp4','.mkv':'video/x-matroska','.webm':'video/webm','.mp3':'audio/mpeg','.m4a':'audio/mp4','.vtt':'text/vtt'};

async function main(){
 let kind='NOT FOUND',fn=null;
 if(fs.existsSync(nf)){fn=(await import(pathToFileURL(nf).href)).default;kind='netlify/functions/proxy.mjs (Netlify)'}
 else if(pf){fn=require(pf);kind=path.relative(root,pf)+' (Vercel)'}

 async function runProxy(req,res,u){
  if(!fn){res.statusCode=404;return res.end('no proxy found: add netlify/functions/proxy.mjs (or proxy.js) next to dev-server.js')}
  try{
   if(kind.includes('Netlify')){ /* Web-standard Request in, Response out */
    const r=await fn(new Request('http://localhost:'+port+req.url,{method:req.method,headers:req.headers}),{});
    res.statusCode=r.status;r.headers.forEach((v,k)=>res.setHeader(k,v));
    return r.body?Readable.fromWeb(r.body).pipe(res):res.end()}
   req.query=Object.fromEntries(u.searchParams);res.status=c=>{res.statusCode=c;return res};
   await fn(req,res)
  }catch{if(!res.headersSent)res.statusCode=500;res.end('proxy error')}}

 http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost');
  if(u.pathname.startsWith('/api/proxy')||u.pathname.startsWith('/.netlify/functions/proxy'))return runProxy(req,res,u);
  let p;try{p=decodeURIComponent(u.pathname)}catch{res.statusCode=400;return res.end('bad path')}
  if(p.endsWith('/'))p+='index.html';
  const fp=path.normalize(path.join(root,p));
  if(!fp.startsWith(root)){res.statusCode=403;return res.end('forbidden')}
  fs.stat(fp,(e,st)=>{
   if(e||!st.isFile()){res.statusCode=404;return res.end('not found')}
   res.setHeader('Content-Type',MIME[path.extname(fp).toLowerCase()]||'application/octet-stream');
   res.setHeader('Accept-Ranges','bytes');res.setHeader('Cache-Control','no-cache');
   if(p==='/sw.js')res.setHeader('Service-Worker-Allowed','/');
   let a=0,b=st.size-1;const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
   if(m&&(m[1]||m[2])){
    if(m[1]===''){a=Math.max(0,st.size-+m[2])}else{a=+m[1];if(m[2])b=Math.min(b,+m[2])}
    if(a>b||a>=st.size){res.statusCode=416;res.setHeader('Content-Range','bytes */'+st.size);return res.end()}
    res.statusCode=206;res.setHeader('Content-Range','bytes '+a+'-'+b+'/'+st.size)}
   res.setHeader('Content-Length',b-a+1);
   if(req.method==='HEAD')return res.end();
   const rs=fs.createReadStream(fp,{start:a,end:b});
   rs.on('error',()=>res.destroy());res.on('close',()=>rs.destroy());rs.pipe(res)})
 }).listen(port,()=>console.log('Axion: http://localhost:'+port+'   (proxy: '+kind+')'));
}
main();