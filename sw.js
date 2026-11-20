const V='axion-v12',MB='https://cdn.jsdelivr.net/npm/mediabunny@1.61.3/dist/bundles/mediabunny.min.mjs',
 SHELL=['/','/index.html','/media.js','/features.js','/library.js','/settings-ui.js','/manifest.webmanifest','/icon-192.png','/icon-512.png'],
 CDN=/(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)$/;
addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.all([c.addAll(SHELL),c.add(MB).catch(()=>{})])).then(()=>skipWaiting())));
addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 /* video, Range requests and /api are never cached */
 if(r.method!=='GET'||r.headers.has('range')||u.pathname.startsWith('/api/'))return;
 if(r.mode==='navigate'){
  e.respondWith(fetch(r).then(x=>{if(x.ok)caches.open(V).then(c=>c.put('/index.html',x.clone()));return x}).catch(()=>caches.match('/index.html')));return}
 if(u.origin===location.origin){
  e.respondWith(Promise.race([fetch(r),new Promise((_,j)=>setTimeout(j,4000))]).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r)));return}
 if(CDN.test(u.hostname))
  e.respondWith(caches.open(V).then(async c=>{
   const hit=await c.match(r),net=fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}).catch(()=>hit);
   return hit||net}))});