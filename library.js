/* Axion library.js v2: folder browser (Folders + All files views), thumbnails, search, responsive UI */
(()=>{
const VID=/\.(mp4|mkv|webm|mov|m4v|avi|ts|3gp|mpg|mpeg|wmv|flv|ogv)$/i,AUD=/\.(mp3|m4a|aac|flac|wav|ogg|oga|opus|wma|mka)$/i,SUB=/\.(srt|vtt)$/i,
 MB=b=>b>=1e9?(b/1e9).toFixed(1)+' GB':Math.max(1,Math.round(b/1e6))+' MB',
 nat=(a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}),
 hk=f=>'f:'+f.name+':'+f.size,tail=p=>p.split('/').pop();
const P={
 back:'<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
 x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
 folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
 folderOpen:'<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
 play:'<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
 music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
 film:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
 shuffle:'<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
 list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
 tree:'<path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M3 5a2 2 0 0 0 2 2h3"/><path d="M3 3v13a2 2 0 0 0 2 2h3"/>',
 home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
 chev:'<path d="m9 18 6-6-6-6"/>',
 sort:'<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
 listVideo:'<path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/><path d="m16 12 5 3-5 3v-6z"/>'},
 ic=n=>'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P[n]+'</svg>';
let L={name:'',items:[],subs:{}},view=[],all=[],more=300,hist={};
const F={q:'',f:'all',s:'name',m:'flat',p:''},keyOf=new WeakMap();
try{F.m=localStorage.axlm==='tree'?'tree':'flat'}catch{}

function init(){
 document.head.insertAdjacentHTML('beforeend','<style>'+[
 '#lib{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;overflow:hidden;color:var(--tx);background:radial-gradient(700px 320px at 85% -8%,color-mix(in srgb,var(--ac) 18%,transparent),transparent),var(--bg);padding:max(10px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))}',
 '#lib[hidden]{display:none}#lib>*{width:100%;max-width:1240px;margin-inline:auto;box-sizing:border-box;min-width:0}#lib .i{width:20px;height:20px;flex:none}',
 '#lib .hd{display:flex;align-items:center;gap:10px;margin-bottom:10px}',
 '#lib .ti{flex:1;min-width:0}#lib .ti b{display:block;font-size:17px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#lib .ti small{display:block;color:var(--mut);font-size:12px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
 '#lib .ib{flex:none;width:42px;height:42px;padding:0;display:grid;place-items:center;border-radius:12px}',
 '#lib .sr{position:relative;margin-bottom:10px}#lib .sr .i{position:absolute;left:13px;top:50%;margin-top:-9px;width:18px;height:18px;color:var(--mut);pointer-events:none}',
 '#lib .sr input{display:block;width:100%;box-sizing:border-box;background:var(--inp);color:var(--tx);border:1px solid var(--line);border-radius:14px;padding:11px 12px 11px 40px;font:inherit}#lib .sr input:focus{outline:0;border-color:var(--ac)}',
 '#lib .ct{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}',
 '#lib .sg{display:flex;background:var(--btn);border-radius:12px;padding:3px;min-width:0}',
 '#lib .sg button{flex:1;min-width:0;display:inline-flex;align-items:center;justify-content:center;gap:6px;background:none;padding:7px 10px;border-radius:9px;font-size:13px;white-space:nowrap}#lib .sg button .i{width:16px;height:16px}',
 '#lib .sg button.on{background:var(--grad);color:#171000;font-weight:600}',
 '#libm{flex:1 1 100%}#libf{flex:1 1 0;min-width:180px}',
 '#lib .sel{position:relative;flex:0 0 auto;display:block}#lib .sel .i{position:absolute;left:11px;top:50%;margin-top:-8px;width:16px;height:16px;color:var(--mut);pointer-events:none}#lib .sel select{display:block;height:100%;padding:8px 12px 8px 34px;border-radius:12px;max-width:100%}',
 '@media(min-width:700px){#libm,#libf{flex:0 0 auto}#lib .sg button{padding:7px 14px}}',
 '#libc{display:flex;align-items:center;gap:2px;overflow-x:auto;scrollbar-width:none;margin-bottom:8px;font-size:13px}#libc::-webkit-scrollbar{display:none}#libc:empty{display:none}',
 '#libc button{flex:none;display:inline-flex;align-items:center;background:none;padding:5px 8px;border-radius:8px;color:var(--mut);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#libc button:last-child{color:var(--tx);font-weight:600}#libc button .i{width:16px;height:16px}#libc i{display:inline-flex;color:var(--mut)}#libc i .i{width:14px;height:14px}',
 '#libr{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:10px;align-content:start;padding:2px 1px 12px;overscroll-behavior:contain}',
 '#libr>h6,#libr>.lm,#libr>.rf{grid-column:1/-1}',
 '#libr h6{margin:8px 4px 0;font-size:12px;font-weight:600;color:var(--mut);display:flex;gap:6px;align-items:center;white-space:nowrap;overflow:hidden}#libr h6::before{content:"";width:3px;height:12px;border-radius:2px;background:var(--grad);flex:none}',
 '#libr .li{display:flex;gap:12px;align-items:center;width:100%;min-width:0;box-sizing:border-box;text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:8px;transition:transform .15s,border-color .15s,box-shadow .15s}',
 '#libr .li:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--ac) 55%,var(--line));box-shadow:0 12px 28px #0005}#libr .li.cur{border-color:var(--ac);background:color-mix(in srgb,var(--ac) 14%,var(--panel))}',
 '#libr .th{position:relative;flex:none;width:122px;height:69px;border-radius:10px;overflow:hidden;background:color-mix(in srgb,var(--ac) 10%,var(--inp)) center/cover;display:grid;place-items:center;color:var(--ac)}#libr .th .i{width:26px;height:26px}',
 '#libr .th .du{position:absolute;right:5px;bottom:6px;background:#000c;color:#fff;font:600 10.5px/1 system-ui;padding:3px 5px;border-radius:6px;font-style:normal}#libr .th .du:empty{display:none}',
 '#libr .th .pg{position:absolute;left:0;bottom:0;height:3px;background:var(--grad)}',
 '#libr .fo .th{background:linear-gradient(135deg,color-mix(in srgb,var(--ac) 34%,transparent),color-mix(in srgb,var(--ac) 8%,transparent)),var(--inp)}#libr .fo .th .i{width:34px;height:34px}',
 '#libr .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}',
 '#libr .nm{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;font-weight:500;line-height:1.3}',
 '#libr .tx small{color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
 '#libr .lm{text-align:center;color:var(--mut);padding:28px 10px}#libr .lm .big{display:grid;place-items:center;width:72px;height:72px;margin:0 auto 12px;border-radius:50%;color:var(--ac);background:color-mix(in srgb,var(--ac) 14%,transparent)}#libr .lm .big .i{width:34px;height:34px}',
 '#libr .rf{justify-self:center;min-width:200px;padding:11px 18px;border-radius:14px}',
 '#lib .ac{display:flex;gap:10px;padding-top:10px}#lib .ac .ib{width:46px;height:46px}#libp{flex:1;min-width:0;height:46px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;font-size:15px;font-weight:600}#libp .i{width:16px;height:16px}',
 '@media(min-width:700px){#libr{grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}#libr .li{flex-direction:column;align-items:stretch;gap:10px;padding:10px}#libr .th{width:100%;height:auto;aspect-ratio:16/9}#lib .ac{justify-content:center}#libp{flex:0 1 280px}}',
 '#lib.emp .sr,#lib.emp .ct,#lib.emp #libc,#lib.emp .ac{display:none}',
 '#pl{display:none!important}#libb svg{width:20px;height:20px}#obf{display:inline-flex;align-items:center;gap:8px}#obf .i{width:18px;height:18px}'].join('')+'</style>');

 const o=document.createElement('div');o.id='lib';o.hidden=true;
 o.innerHTML='<div class="hd"><button id="libx" class="ib" aria-label="Back">'+ic('back')+'</button><div class="ti"><b id="libt">Library</b><small id="libi"></small></div><button id="libo" class="ib" title="Open another folder" aria-label="Open another folder">'+ic('folderOpen')+'</button></div>'+
  '<div class="sr">'+ic('search')+'<input id="libq" type="search" placeholder="Search videos &amp; audio…" autocomplete="off"></div>'+
  '<div class="ct"><div class="sg" id="libm"><button data-m="tree">'+ic('tree')+'<span>Folders</span></button><button data-m="flat">'+ic('list')+'<span>All files</span></button></div>'+
  '<div class="sg" id="libf"><button data-f="all">All</button><button data-f="v">Video</button><button data-f="a">Audio</button></div>'+
  '<label class="sel">'+ic('sort')+'<select id="libs" aria-label="Sort"><option value="name">Name</option><option value="new">Newest</option><option value="size">Largest</option></select></label></div>'+
  '<div id="libc"></div><div id="libr"></div>'+
  '<div class="ac"><button id="libsh" class="ib" title="Shuffle" aria-label="Shuffle">'+ic('shuffle')+'</button><button id="libp" class="go">'+ic('play')+'<span>Play all</span></button></div>';
 document.body.appendChild(o);
 const body=$('#libr'),inp=document.createElement('input');
 inp.type='file';inp.multiple=true;inp.hidden=true;inp.setAttribute('webkitdirectory','');document.body.appendChild(inp);

 /* ---- storage: remembered folders ('d') + thumbnails ('t') ---- */
 const DB=new Promise(r=>{try{const q=indexedDB.open('axion-lib',2);q.onupgradeneeded=()=>{const d=q.result;['d','t'].forEach(n=>d.objectStoreNames.contains(n)||d.createObjectStore(n,{keyPath:'k'}))};q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch{r(null)}}),
  tx=async(m,f,n='d')=>{const d=await DB;if(!d)return;return new Promise(r=>{const t=d.transaction(n,m),x=f(t.objectStore(n));t.oncomplete=()=>r(x&&x.result);t.onerror=t.onabort=()=>r()})};
 let DBH;
 async function loadHist(){ /* watch progress saved by features.js */
  hist={};
  try{DBH=DBH||new Promise(r=>{try{const q=indexedDB.open('axion');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch{r(null)}});
   const d=await DBH;if(!d||!d.objectStoreNames.contains('h'))return;
   const a=await new Promise(r=>{const q=d.transaction('h').objectStore('h').getAll();q.onsuccess=()=>r(q.result);q.onerror=()=>r([])});
   a.forEach(x=>hist[x.k]=x)}catch{}}

 /* ---- scanning ---- */
 function reset(n){L={name:n,items:[],subs:{}};F.q='';F.p='';$('#libq').value=''}
 function add(f,path){
  const key=(path+f.name).replace(/\.[^./]+$/,'').toLowerCase();
  if(SUB.test(f.name)){L.subs[key]=f;return}
  const a=AUD.test(f.name)||/^audio/.test(f.type),vi=VID.test(f.name)||/^video/.test(f.type);
  if(!a&&!vi)return;
  keyOf.set(f,key);L.items.push({f,a:a&&!vi,dir:path.replace(/^\/+|\/+$/g,'')});
  if(L.items.length%40===0)say('Scanning… '+L.items.length+' files',1500)}
 async function walk(h,p){for await(const [n,e] of h.entries()){
  if(n[0]==='.')continue;
  if(e.kind==='file'){try{const f=await e.getFile();add(f,p);(window.axH||(window.axH=new Map())).set(f.name+':'+f.size,e)}catch{}}else await walk(e,p+n+'/')}}
 async function walkE(en,p){
  if(en.isFile){const f=await new Promise(r=>en.file(r,()=>r()));f&&add(f,p)}
  else{const rd=en.createReader();let b;do{b=await new Promise(r=>rd.readEntries(r,()=>r([])));for(const c of b)await walkE(c,p+en.name+'/')}while(b.length)}}
 function collapse(){ /* start inside the chosen folder, skipping empty wrapper folders */
  F.p='';
  for(;;){const pre=F.p?F.p+'/':'',s=new Set();let own=0;
   for(const x of L.items){
    if(F.p&&x.dir!==F.p&&!x.dir.startsWith(pre))continue;
    const r=F.p?(x.dir===F.p?'':x.dir.slice(pre.length)):x.dir;
    if(!r)own++;else s.add(r.split('/')[0])}
   if(own||s.size!==1)break;F.p=pre+[...s][0]}}
 function done(){collapse();say(L.items.length+' files found',2500);showLib()}
 async function fromHandle(h){reset(h.name);say('Scanning '+h.name+'…',2e4);await walk(h,h.name+'/');done()}
 async function pick(){
  if(window.showDirectoryPicker){
   try{const h=await showDirectoryPicker({id:'axion',mode:'read'});tx('readwrite',s=>s.put({k:h.name,h,ts:Date.now()}));await fromHandle(h)}
   catch(e){if(e.name!=='AbortError')say('Could not open folder ('+e.name+')',4000)}}
  else inp.click()}
 inp.onchange=()=>{
  const a=[...inp.files];if(!a.length)return;
  const r0=a[0].webkitRelativePath;reset(r0?r0.split('/')[0]:'Selected files');
  a.forEach(f=>{const r=f.webkitRelativePath||f.name;add(f,r.slice(0,r.length-f.name.length))});
  inp.value='';done()};
 async function openRecent(k){
  const d=await tx('readonly',s=>s.get(k));if(!d)return;
  try{if(d.h.requestPermission&&await d.h.requestPermission({mode:'read'})!=='granted')return say('Permission not granted',3000)}catch{}
  try{await fromHandle(d.h)}catch{say('Folder is no longer available',4000);tx('readwrite',s=>s.delete(k))}}

 /* ---- lazy thumbnails (320x180, cached in memory + IndexedDB); paused while a video is playing on phones ---- */
 const TC=new Map(),Q=[];let run=0,io;
 async function gen(f){
  const u=URL.createObjectURL(f),p=document.createElement('video');
  const w=(ev,fn)=>new Promise((ok,no)=>{p.addEventListener(ev,ok,{once:true});p.addEventListener('error',no,{once:true});setTimeout(no,9000);fn&&fn()});
  p.muted=true;p.playsInline=true;p.preload='metadata';
  try{
   await w('loadedmetadata',()=>{p.src=u});
   const d=p.duration;
   await w('seeked',()=>{p.currentTime=isFinite(d)&&d>0?Math.min(d*.1,120):0});
   const c=document.createElement('canvas');c.width=320;c.height=180;
   const s=Math.max(320/p.videoWidth,180/p.videoHeight);
   c.getContext('2d').drawImage(p,(320-p.videoWidth*s)/2,(180-p.videoHeight*s)/2,p.videoWidth*s,p.videoHeight*s);
   return{t:c.toDataURL('image/jpeg',.7),d:isFinite(d)?d:0}
  }catch{return{t:''}}
  finally{p.removeAttribute('src');p.load();URL.revokeObjectURL(u)}}
 function pump(){
  while(!o.hidden&&run<(COARSE||!v.paused?1:2)&&Q.length){
   const j=Q.shift();if(!j.t.isConnected)continue;
   run++;
   (async()=>{
    let r=TC.get(j.k)||await tx('readonly',s=>s.get(j.k),'t');
    if(!r){r=await gen(j.x.f);r.k=j.k;if(r.t)tx('readwrite',s=>s.put(r),'t')}
    TC.set(j.k,r);
    if(j.t.isConnected){
     if(r.t){j.t.style.backgroundImage='url('+r.t+')';const ic=j.t.querySelector('.ic');ic&&ic.remove()}
     if(r.d)j.t.querySelector('.du').textContent=fmt(r.d)}
   })().finally(()=>{run--;pump()})}}
 function watch(){
  io&&io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(e=>{
   if(!e.isIntersecting)return;io.unobserve(e.target);
   const x=view[+e.target.dataset.i];if(!x)return;
   Q.push({t:e.target,x,k:'v2|'+x.f.name+'|'+x.f.size+'|'+x.f.lastModified});pump()}),{root:body,rootMargin:'300px'});
  body.querySelectorAll('.li .th[data-i]').forEach(t=>{if(!view[+t.dataset.i].a)io.observe(t)})}

 /* ---- render ---- */
 const row=(x,i)=>{
  const hs=hist[hk(x.f)],pg=hs&&hs.dur?Math.min(100,Math.round(100*hs.pos/hs.dur)):0;
  return'<button class="li'+(pl[pi]===x.f?' cur':'')+'" data-i="'+i+'"><span class="th" data-i="'+i+'"><span class="ic">'+ic(x.a?'music':'film')+'</span><em class="du"></em>'+(pg>1?'<i class="pg" style="width:'+pg+'%"></i>':'')+'</span>'+
   '<span class="tx"><span class="nm">'+esc(x.f.name)+'</span><small>'+MB(x.f.size)+(F.m==='flat'||F.q?' · '+esc(tail(x.dir||L.name)):'')+'</small></span></button>'};
 const total=a=>a.reduce((s,x)=>s+x.f.size,0);

 async function render(top){
  if(top){more=300;body.scrollTop=0}
  o.classList.toggle('emp',!L.items.length);
  $('#libm').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.m===F.m));
  $('#libf').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.f===F.f));
  $('#libs').value=F.s;
  if(!L.items.length){
   const rc=((await tx('readonly',s=>s.getAll()))||[]).sort((a,b)=>b.ts-a.ts).slice(0,6);
   $('#libt').textContent='Library';$('#libi').textContent='';
   body.innerHTML='<div class="lm"><div class="big">'+ic('folderOpen')+'</div><p>Choose a folder to browse every video and audio file inside it, including subfolders.</p></div><button class="go rf" id="libch">Choose folder</button>'+
    (rc.length?'<h6>Recent folders</h6>'+rc.map(d=>'<button class="li fo" data-r="'+esc(d.k)+'"><span class="th"><span class="ic">'+ic('folder')+'</span></span><span class="tx"><span class="nm">'+esc(d.k)+'</span></span></button>').join(''):'');
   return}
  const q=F.q.toLowerCase(),tree=F.m==='tree'&&!q,P=F.p,
   ok=x=>(F.f==='all'||(F.f==='a')===x.a)&&(!q||x.f.name.toLowerCase().includes(q)),
   inP=x=>!P||x.dir===P||x.dir.startsWith(P+'/'),
   cmp={name:(a,b)=>nat(a.dir+'/'+a.f.name,b.dir+'/'+b.f.name),new:(a,b)=>b.f.lastModified-a.f.lastModified,size:(a,b)=>b.f.size-a.f.size}[F.s];
  all=L.items.filter(x=>ok(x)&&(!tree||inP(x))).sort(cmp);
  let h='';
  if(tree){
   const D=new Map();view=[];
   for(const x of all){
    const r=P?(x.dir===P?'':x.dir.slice(P.length+1)):x.dir;
    if(!r)view.push(x);else{const n=r.split('/')[0],d=D.get(n)||{n,p:(P?P+'/':'')+n,c:0};d.c++;D.set(n,d)}}
   h+=[...D.values()].sort((a,b)=>nat(a.n,b.n)).map(d=>'<button class="li fo" data-d="'+esc(d.p)+'"><span class="th"><span class="ic">'+ic('folder')+'</span></span><span class="tx"><span class="nm">'+esc(d.n)+'</span><small>'+d.c+' file'+(d.c>1?'s':'')+'</small></span></button>').join('')}
  else view=all;
  let g;
  view.slice(0,more).forEach((x,i)=>{
   if(!tree&&F.s==='name'&&x.dir!==g){g=x.dir;h+='<h6>'+esc(x.dir||L.name)+'</h6>'}
   h+=row(x,i)});
  if(view.length>more)h+='<button class="rf" id="libmore">Show more ('+(view.length-more)+')</button>';
  body.innerHTML=h||'<p class="lm">Nothing here</p>';
  /* header + breadcrumbs */
  const nv=all.filter(x=>!x.a).length,na=all.length-nv;
  $('#libt').textContent=q?L.name+' · search':(tree&&P?tail(P):L.name);
  $('#libi').textContent=nv+' video'+(nv==1?'':'s')+' · '+na+' audio · '+MB(total(all));
  const c=$('#libc');
  if(!tree)c.innerHTML='';
  else{let acc='',s='<button data-d="" aria-label="Top">'+ic('home')+'</button>';
   (P?P.split('/'):[]).forEach(n=>{acc+=(acc?'/':'')+n;s+='<i>'+ic('chev')+'</i><button data-d="'+esc(acc)+'">'+esc(n)+'</button>'});
   c.innerHTML=s;c.scrollLeft=c.scrollWidth}
  watch()}

 function showLib(){o.hidden=false;loadHist().then(()=>render(1))}
 function openLib(){
  const c=pl[pi];
  if(pl.length>1&&!L.items.some(x=>x.f===c)){reset('Playlist');pl.forEach(f=>add(f,''))}
  const it=L.items.find(x=>x.f===c);
  if(it&&F.m==='tree')F.p=it.dir;
  o.hidden=false;
  loadHist().then(()=>render(1)).then(()=>{const g=body.querySelector('.li.cur');g&&g.scrollIntoView({block:'center'})})}
 function close(){o.hidden=true;Q.length=0}
 function play(i,list){if(!list.length)return;pl=list.map(x=>x.f);playIdx(i);close();window.axSave&&window.axSave(pl[pi])}

 body.onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='libch')return pick();
  if(b.id==='libmore'){more+=300;return render()}
  if(b.dataset.r)return openRecent(b.dataset.r);
  if(b.dataset.d!==undefined){F.p=b.dataset.d;return render(1)}
  if(b.dataset.i!==undefined)play(+b.dataset.i,view)};
 $('#libc').onclick=e=>{const b=e.target.closest('button');if(b){F.p=b.dataset.d;render(1)}};
 $('#libm').onclick=e=>{const b=e.target.closest('button');if(!b)return;F.m=b.dataset.m;try{localStorage.axlm=F.m}catch{}render(1)};
 $('#libf').onclick=e=>{const b=e.target.closest('button');if(!b)return;F.f=b.dataset.f;render(1)};
 $('#libs').onchange=e=>{F.s=e.target.value;render(1)};
 $('#libq').oninput=e=>{F.q=e.target.value.trim();render(1)};
 $('#libo').onclick=pick;$('#libx').onclick=close;
 $('#libp').onclick=()=>play(0,all);
 $('#libsh').onclick=()=>{const a=[...all];for(let i=a.length;i>1;){const j=Math.random()*i--|0;[a[i],a[j]]=[a[j],a[i]]}play(0,a)};

 /* ---- entry points: control-bar button, home button, Alt+L, folder drag & drop ---- */
 $('#ob').insertAdjacentHTML('afterend','<button id="obf">'+ic('folderOpen')+'Open folder</button>');
 $('#obf').onclick=openLib;
 const lb=document.createElement('button');lb.id='libb';lb.title='Library / playlist (Alt+L)';
 lb.innerHTML=ic('listVideo');
 $('#pip').before(lb);lb.onclick=openLib;
 addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!o.hidden)close();
  else if(e.altKey&&e.key.toLowerCase()==='l'){if(o.hidden)openLib();else close()}});
 st.addEventListener('drop',async e=>{
  const en=[...(e.dataTransfer.items||[])].map(i=>i.webkitGetAsEntry&&i.webkitGetAsEntry()).filter(Boolean);
  if(!en.some(x=>x.isDirectory))return;
  e.preventDefault();e.stopImmediatePropagation();st.classList.remove('drag');
  reset(en[0].name);say('Scanning…',2e4);
  for(const x of en)await walkE(x,x.isDirectory?x.name+'/':'');
  done()},true);

 /* ---- auto-attach a same-name .srt/.vtt when a library file starts ---- */
 v.addEventListener('loadedmetadata',()=>{
  const f=pl[pi],s=f&&L.subs[keyOf.get(f)];
  if(!s||!/^blob:/.test(curUrl))return;
  try{const d=new DataTransfer();d.items.add(s);$('#sub').files=d.files;$('#sub').dispatchEvent(new Event('change'))}catch{}});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();