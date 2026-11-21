const V='axion-v17',DC='axion-dec-1',MB='https://cdn.jsdelivr.net/npm/mediabunny@1.61.3/dist/bundles/mediabunny.min.mjs',
 DEC=['https://cdn.jsdelivr.net/npm/@mediabunny/ac3@1.66.2/dist/bundles/mediabunny-ac3.min.mjs','https://cdn.jsdelivr.net/npm/@mediabunny/dts@1.66.2/dist/bundles/mediabunny-dts.min.mjs'], /* AC3/DTS audio decoders (~3 MB): kept in their own cache so an app update does not download them again */
 SHELL=['/','/index.html','/media.js','/features.js','/library.js','/settings-ui.js','/subs.js','/audioviz.js','/manifest.webmanifest','/icon-192.png','/icon-512.png'],
 CDN=/(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)$/;
let warmed=0;
/* each file is saved on its own: one missing file (for example an icon) no longer stops the whole update from installing */
addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.all([...SHELL,MB].map(u=>c.add(u).catch(()=>{})))).then(()=>skipWaiting())));
addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==DC).map(x=>caches.delete(x)))).then(()=>clients.claim())));
/* decoders are saved in the background after the first request: never blocks install, skipped on data saver / 2G */
async function warmDec(){
 const n=navigator.connection;if(n&&(n.saveData||/2g$/.test(n.effectiveType||'')))return;
 const c=await caches.open(DC);
 for(const u of DEC)if(!await c.match(u))await c.add(u).catch(()=>{})}
addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 /* video, Range requests and /api are never cached */
 if(r.method!=='GET'||r.headers.has('range')||u.pathname.startsWith('/api/'))return;
 if(!warmed){warmed=1;e.waitUntil(warmDec().catch(()=>0))}
 if(r.mode==='navigate'){
  /* page: network first; with no internet or a dead connection the saved copy opens after 2 s */
  const net=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put('/index.html',y))}return x});
  e.waitUntil(net.catch(()=>0));
  e.respondWith(Promise.race([net,new Promise((_,j)=>setTimeout(j,2000))]).catch(()=>caches.match('/index.html').then(h=>h||net)));return}
 if(u.origin===location.origin){ /* own files: network first (always revalidated); if the network is slow use the cache, and still refresh it in the background */
  const net=fetch(r,{cache:'no-cache'}).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x});
  e.waitUntil(net.catch(()=>0));
  e.respondWith(Promise.race([net,new Promise((_,j)=>setTimeout(j,2000))]).catch(()=>caches.match(r).then(h=>h||net)));return}
 /* CDN files have a version in their address and never change: use the saved copy, download only when missing */
 if(CDN.test(u.hostname))
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x})))});