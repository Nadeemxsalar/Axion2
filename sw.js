const V='axion-v16',MB='https://cdn.jsdelivr.net/npm/mediabunny@1.61.3/dist/bundles/mediabunny.min.mjs',
 DEC=['https://cdn.jsdelivr.net/npm/@mediabunny/ac3@1.66.2/dist/bundles/mediabunny-ac3.min.mjs','https://cdn.jsdelivr.net/npm/@mediabunny/dts@1.66.2/dist/bundles/mediabunny-dts.min.mjs'], /* AC3/DTS audio decoders: saved at install so movies with such audio also play without internet */
 SHELL=['/','/index.html','/media.js','/features.js','/library.js','/settings-ui.js','/subs.js','/audioviz.js','/manifest.webmanifest','/icon-192.png','/icon-512.png'],
 CDN=/(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)$/;
addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.all([c.addAll(SHELL),c.add(MB).catch(()=>{}),...DEC.map(u=>c.add(u).catch(()=>{}))])).then(()=>skipWaiting())));
addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 /* video, Range requests and /api are never cached */
 if(r.method!=='GET'||r.headers.has('range')||u.pathname.startsWith('/api/'))return;
 if(r.mode==='navigate'){
  /* page: network first; with no internet or a dead connection the saved copy opens after 2 s */
  const net=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put('/index.html',y))}return x});
  e.waitUntil(net.catch(()=>0));
  e.respondWith(Promise.race([net,new Promise((_,j)=>setTimeout(j,2000))]).catch(()=>caches.match('/index.html').then(h=>h||net)));return}
 if(u.origin===location.origin){ /* own files: network first (always revalidated); if the network is slow use the cache, and still refresh it in the background */
  const net=fetch(r,{cache:'no-cache'}).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x});
  e.waitUntil(net.catch(()=>0));
  e.respondWith(Promise.race([net,new Promise((_,j)=>setTimeout(j,2000))]).catch(()=>caches.match(r).then(h=>h||net)));return}
 if(CDN.test(u.hostname))
  e.respondWith(caches.open(V).then(async c=>{
   const hit=await c.match(r),net=fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}).catch(()=>hit);
   return hit||net}))});