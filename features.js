/* Axion features.js: touch gestures, wake lock, watch history (IndexedDB), audio delay */
(()=>{
const SKIP='#ctl,#set,#qm,#empty,#stats,#err,#wb,#eg,#aud,#aub,#ccb',cl=(x,a,b)=>Math.min(b,Math.max(a,x));
const DEF_TH='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#191f3a"/><stop offset="1" stop-color="#0b0e1a"/></linearGradient><radialGradient id="gl" cx="50%" cy="46%" r="54%"><stop offset="0" stop-color="#f5b83d" stop-opacity=".35"/><stop offset=".55" stop-color="#6366f1" stop-opacity=".16"/><stop offset="1" stop-color="#0b0e1a" stop-opacity="0"/></radialGradient><linearGradient id="pl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd36b"/><stop offset="1" stop-color="#f08a24"/></linearGradient></defs><rect width="160" height="90" fill="url(#bg)"/><rect width="160" height="90" fill="url(#gl)"/><path d="M0 68 Q40 48 80 62 T160 54 L160 90 L0 90Z" fill="#ffffff" fill-opacity=".045"/><path d="M0 24 Q45 38 90 20 T160 30" fill="none" stroke="#f5b83d" stroke-opacity=".18" stroke-width="1.2"/><circle cx="80" cy="44" r="27" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="1"/><circle cx="80" cy="44" r="18" fill="#ffffff" fill-opacity=".09" stroke="#ffd36b" stroke-opacity=".48" stroke-width="1.2"/><path d="M75.5 36.8 89 44 75.5 51.2Z" fill="url(#pl)" stroke="url(#pl)" stroke-width="2.2" stroke-linejoin="round"/></svg>')+'")';
const DEF_AU='url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><defs><linearGradient id="abg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b1438"/><stop offset="1" stop-color="#0a0d1c"/></linearGradient><radialGradient id="agl" cx="50%" cy="48%" r="55%"><stop offset="0" stop-color="#a855f7" stop-opacity=".42"/><stop offset=".55" stop-color="#38bdf8" stop-opacity=".18"/><stop offset="1" stop-color="#0a0d1c" stop-opacity="0"/></radialGradient><linearGradient id="ant" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#c084fc"/></linearGradient></defs><rect width="160" height="90" fill="url(#abg)"/><rect width="160" height="90" fill="url(#agl)"/><g fill="#38bdf8" fill-opacity=".22"><rect x="20" y="40" width="3" height="10" rx="1.5"/><rect x="27" y="32" width="3" height="26" rx="1.5"/><rect x="34" y="37" width="3" height="16" rx="1.5"/><rect x="41" y="28" width="3" height="34" rx="1.5"/><rect x="116" y="28" width="3" height="34" rx="1.5"/><rect x="123" y="37" width="3" height="16" rx="1.5"/><rect x="130" y="32" width="3" height="26" rx="1.5"/><rect x="137" y="40" width="3" height="10" rx="1.5"/></g><circle cx="80" cy="45" r="24" fill="none" stroke="#c084fc" stroke-opacity=".16" stroke-width="1"/><circle cx="80" cy="45" r="18" fill="#ffffff" fill-opacity=".08" stroke="url(#ant)" stroke-opacity=".6" stroke-width="1.2"/><path d="M77 52V37l11-2.5v14.5" fill="none" stroke="url(#ant)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="74.5" cy="52" r="3" fill="url(#ant)"/><circle cx="85.5" cy="49.5" r="3" fill="url(#ant)"/></svg>')+'")';
const IS_AU=/\.(mp3|m4a|aac|flac|wav|ogg|opus|wma|mka)(\?|#|$)/i;

function init(){
 document.head.insertAdjacentHTML('beforeend','<style>'+
  '#recw{margin:14px 0 0}#recw[hidden]{display:none}@media(max-width:640px){#recw{margin:12px 12px 0}}'+
  '#recw h4{display:flex;align-items:center;gap:8px;margin:0 2px 8px;font-size:14px;font-weight:700;color:var(--tx)}#recw h4::before{content:"";width:3px;height:14px;border-radius:3px;background:var(--grad)}'+
  '#rec{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 8px;scrollbar-width:none}#rec::-webkit-scrollbar{display:none}'+
  '#rec .rc{flex:none;width:150px;padding:0;border-radius:14px;overflow:hidden;position:relative;font-size:12px;text-align:left;background:var(--panel);color:var(--tx);border:1px solid var(--line);transition:transform .15s,border-color .15s,box-shadow .15s}'+
  '#rec .rc:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--ac) 55%,var(--line));box-shadow:0 12px 26px -10px #0007}'+
  '#rec .th{display:block;height:84px;background-color:color-mix(in srgb,var(--ac) 12%,var(--inp));background-image:'+DEF_TH+';background-position:center;background-size:cover;background-repeat:no-repeat}'+
  '#rec .th.au{background-image:'+DEF_AU+'}'+
  '#rec .pg{position:absolute;left:0;right:0;top:80px;height:4px;background:#0006}#rec .pg i{display:block;height:100%;background:var(--grad)}'+
  '#rec .nm{display:block;padding:7px 10px 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500}'+
  '#rec .x{position:absolute;top:5px;right:5px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#000b;color:#fff}</style>');

 /* file handles of files opened with the system picker or the library: lets "Continue watching" reopen them directly */
 window.axDiag=window.axDiag||{last:''};
 const AH=window.axH=window.axH||new Map(),CAN=!!window.showOpenFilePicker,
  V1=['.mp4','.mkv','.webm','.mov','.m4v','.avi','.ts','.3gp','.mpg','.mpeg','.wmv','.flv','.ogv'],A1=['.mp3','.m4a','.aac','.flac','.wav','.ogg','.opus','.wma','.mka'];
 const FAIL={};
 async function saveHandle(f){ /* store the handle right away, not only after some seconds of playback */
  const h=AH.get(f.name+':'+f.size);if(!h)return;
  const k='f:'+f.name+':'+f.size;
  try{const o=(await get(k))||{k,n:f.name,pos:0,dur:0};o.h=h;o.ts=Date.now();await put(o)}catch{}}
 window.axSave=saveHandle;
 async function pickAndOpen(){ /* system file picker that keeps the file handles */
  try{
   const hs=await showOpenFilePicker({multiple:true,types:[{description:'Video and audio',accept:{'video/*':V1,'audio/*':A1}}]}),fs=[];
   for(const h of hs){const f=await h.getFile();AH.set(f.name+':'+f.size,h);fs.push(f)}
   openFiles(fs);fs.forEach(f=>saveHandle(f))}
  catch(err){if(!err||err.name!=='AbortError'){window.axDiag.last='picker: '+(err&&err.name)+' '+((err&&err.message)||'').slice(0,80);$('#file').click()}}}
 if(CAN)['#ob','#of','#of2'].forEach(s=>{const b=$(s);b&&b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();pickAndOpen()},true)});
 st.addEventListener('drop',e=>{ /* dropped files: keep their handles too (Chrome / Edge) */
  try{for(const it of e.dataTransfer.items)if(it.kind==='file'&&it.getAsFileSystemHandle)
   it.getAsFileSystemHandle().then(h=>h&&h.kind==='file'&&h.getFile().then(f=>AH.set(f.name+':'+f.size,h))).catch(()=>0)}catch{}},true);

 /* ---------- 1. touch gestures: left/right edge swipe up/down = brightness / volume, center = page scroll, sideways = seek, long-press = 2x ---------- */
 let g=null,fast=1,edge=0;
 const end=e=>{
  if(!g||(e&&e.pointerId!==g.id))return;
  clearTimeout(g.lp);
  if(g.m==='h'&&e&&e.type==='pointerup'&&g.d)seekBy(g.d);
  if(g.m==='f'){v.playbackRate=fast;say('Normal speed',700)}
  g=null};
 st.addEventListener('touchstart',e=>{
  edge=0;
  if(e.touches.length!==1||e.target.closest(SKIP)||!st.classList.contains('has')||st.classList.contains('web')||Z>1)return;
  const r=st.getBoundingClientRect(),rel=(e.touches[0].clientX-r.left)/(r.width||1);
  if(document.fullscreenElement||rel<.28||rel>.72)edge=1},{passive:true});
 st.addEventListener('touchmove',e=>{
  if(e.target.closest(SKIP)||!st.classList.contains('has')||st.classList.contains('web'))return;
  if(edge||Z>1||e.touches.length>1||(g&&(g.m==='h'||g.m==='f')))if(e.cancelable)e.preventDefault()},{passive:false});
 const endT=()=>{edge=0};
 st.addEventListener('touchend',endT,{passive:true});st.addEventListener('touchcancel',endT,{passive:true});
 st.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='touch'||e.target.closest(SKIP)||!st.classList.contains('has')||st.classList.contains('web')||Z>1||ptr.size>1)return;
  const r=st.getBoundingClientRect(),rel=(e.clientX-r.left)/(r.width||1),fs=!!document.fullscreenElement;
  const zone=fs?(rel<.5?'l':'r'):(rel<.28?'l':rel>.72?'r':'c');
  g={id:e.pointerId,x:e.clientX,y:e.clientY,zone,m:0,d:0,br:S.br,vl:v.volume};
  g.lp=setTimeout(()=>{if(g&&!g.m&&!v.paused){g.m='f';fast=v.playbackRate;v.playbackRate=2;moved=true;say('2× speed',30000)}},450)});
 st.addEventListener('pointermove',e=>{
  if(!g||e.pointerId!==g.id)return;
  if(ptr.size>1||Z>1)return end();
  if(g.m==='f')return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(!g.m){
   if(Math.hypot(dx,dy)<14)return;
   clearTimeout(g.lp);
   const h=Math.abs(dx)>Math.abs(dy);
   if(!h&&g.zone==='c')return end(); /* center vertical swipe: let browser scroll the page */
   g.m=h?'h':'v'}
  moved=true;
  if(g.m==='h'){g.d=Math.round(dx/(st.clientWidth||1)*120);say((g.d>0?'+':'')+g.d+'s',900)}
  else{const k=-dy/(st.clientHeight||1);
   if(g.zone==='l'){const b=Math.round(cl(g.br+k*100,50,150)/5)*5;if(b!==S.br){S.br=b;applyS()}say('Brightness '+S.br+'%',900)}
   else{v.muted=false;v.volume=cl(g.vl+k,0,1);$('#vol').value=v.volume;say('Volume '+Math.round(v.volume*100)+'%',900)}}});
 addEventListener('pointerup',end);addEventListener('pointercancel',end);
 st.addEventListener('contextmenu',e=>{if(g)e.preventDefault()});

 /* ---------- 2. wake lock: screen stays on while playing ---------- */
 let wl=null,busy=0;
 const lock=async()=>{
  if(wl||busy||v.paused||document.visibilityState!=='visible'||!navigator.wakeLock)return;
  busy=1;try{wl=await navigator.wakeLock.request('screen');wl.onrelease=()=>{wl=null}}catch{}busy=0},
  unlock=()=>{try{wl&&wl.release()}catch{}wl=null};
 v.addEventListener('playing',lock);
 ['pause','ended','emptied'].forEach(n=>v.addEventListener(n,unlock));
 document.addEventListener('visibilitychange',()=>document.visibilityState==='visible'&&lock());

 /* ---------- 3. watch history + "Continue watching" on the home screen ---------- */
 const DB=new Promise(r=>{try{const q=indexedDB.open('axion',1);
   q.onupgradeneeded=()=>q.result.createObjectStore('h',{keyPath:'k'});
   q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch{r(null)}}),
  tx=async(m,f)=>{const d=await DB;if(!d)return;
   return new Promise(r=>{const t=d.transaction('h',m),x=f(t.objectStore('h'));t.oncomplete=()=>r(x&&x.result);t.onerror=t.onabort=()=>r()})},
  put=o=>tx('readwrite',s=>s.put(o)),get=k=>tx('readonly',s=>s.get(k)),
  del=k=>tx('readwrite',s=>s.delete(k)),all=()=>tx('readonly',s=>s.getAll()),
  nm=u=>{try{return decodeURIComponent(u.split('/').pop())||u}catch{return u}},
  key=()=>{const F=pl[pi];
   if(/^blob:/.test(curUrl)&&F){const r={k:'f:'+F.name+':'+F.size,n:F.name},h=AH.get(F.name+':'+F.size);if(h)r.h=h;return r}
   if(/^https?:/.test(curUrl)&&!st.classList.contains('web')){const u=curUrl.split('?')[0];return{k:'u:'+u,n:nm(u).slice(0,80),u:curUrl}}};

 const rec=document.createElement('div');rec.id='recw';rec.hidden=true;
 rec.innerHTML='<h4>Continue watching</h4><div id="rec"></div>';
 $('.panel').before(rec);

 let RC={};
 async function render(){
  const a=((await all())||[]).sort((x,y)=>y.ts-x.ts);RC={};a.forEach(o=>RC[o.k]=o);
  a.slice(12).forEach(o=>del(o.k));
  const L=a.slice(0,12);rec.hidden=!L.length||el.empty.hidden;
  $('#rec').innerHTML=L.map(o=>{const au=IS_AU.test(o.n||o.u||'');return'<button class="rc" data-k="'+esc(o.k)+'"'+(o.u?' data-u="'+esc(o.u)+'"':'')+' data-p="'+Math.round(o.pos)+'">'+
   '<span class="th'+(au?' au':'')+'"'+(o.th&&!au?' style="background-image:url('+o.th+')"':'')+'></span>'+
   '<span class="pb'+(o.u||o.h?' ok':'')+'"></span><span class="pg"><i style="width:'+Math.min(100,Math.round(100*o.pos/(o.dur||1)))+'%"></i></span>'+
   '<span class="nm">'+esc(o.n)+'</span><span class="x" data-x="1"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span></button>'}).join('')}

 $('#rec').onclick=async e=>{
  const b=e.target.closest('.rc');if(!b)return;
  if(e.target.closest('.x')){await del(b.dataset.k);return render()}
  if(b.dataset.u){$('#url').value=b.dataset.u;$('#play').click();return}
  const o=RC[b.dataset.k],nm=o?o.n:'the file';
  if(o&&o.h&&!FAIL[o.k]){
   let step='permission';
   try{
    const p=await o.h.requestPermission({mode:'read'});  /* answers 'granted' at once when access is already allowed */
    if(p!=='granted'){FAIL[o.k]=1;say('Access to "'+nm+'" was '+p+'. Tap the card again to pick the file',7000);return}
    step='file';const f=await o.h.getFile();
    pl=[f];playIdx(0);return
   }catch(err){
    FAIL[o.k]=1;window.axDiag.last='tap: '+step+' '+((err&&err.name)||'error');
    if(err&&err.name==='NotFoundError'){delete o.h;put(o).catch(()=>0);render()}
    say('Could not reopen "'+nm+'" ('+step+': '+((err&&err.name)||'error')+'). Tap the card again to pick it',8000);return}}
  if(o)delete FAIL[o.k];
  if(CAN){say('Select "'+nm+'" once: after that it opens with one tap',6000);pickAndOpen()}
  else{say('This browser cannot reopen local files by itself (works in Chrome / Edge). Select "'+nm+'" again',7000);$('#file').click()}};
 new MutationObserver(()=>render()).observe(el.empty,{attributes:true,attributeFilter:['hidden']});
 render();

 async function thumb(k){
  if(!v.videoWidth)return;
  let th='';
  try{const c=document.createElement('canvas');c.width=160;c.height=90;c.getContext('2d').drawImage(v,0,0,160,90);th=c.toDataURL('image/jpeg',.6)}catch{}
  const o=await get(k);if(o&&o.th===undefined)put({...o,th})}

 let last=0;
 v.addEventListener('timeupdate',async()=>{
  const c=key();
  if(!c||!isFinite(v.duration)||v.duration<20||Date.now()-last<5000)return;
  last=Date.now();
  const o=(await get(c.k))||{},fin=v.currentTime>v.duration-15;
  const rec={...o,...c,pos:fin?0:v.currentTime,dur:v.duration,ts:Date.now()};
  try{await put(rec)}catch{delete rec.h;await put(rec)}
  if(o.th===undefined&&v.currentTime>2&&v.readyState>1)thumb(c.k)});
 /* device files: seek back to the saved spot (links are already handled by the main player) */
 v.addEventListener('loadedmetadata',async()=>{
  const c=key();if(!c||!/^blob:/.test(curUrl)||!S.resume)return;
  const o=await get(c.k);
  if(o&&o.pos>5&&o.pos<v.duration-15&&v.currentTime<3){v.currentTime=o.pos;say('Resumed from '+fmt(o.pos),3000)}});

 /* ---------- 4. audio delay (works with alternate audio tracks played through Web Audio, see media.js) ---------- */
 const row=$('#aud')&&$('#aud').closest('.it');
 if(row){
  row.insertAdjacentHTML('afterend','<label class="it"><span>Audio delay<small>Alternate audio tracks only</small></span><span class="rg"><span class="rv" id="adv">0 ms</span><input type="range" id="adl" min="-2000" max="2000" step="50" value="0"></span></label>');
  const a=$('#adl'),show=()=>$('#adv').textContent=(a.value>0?'+':'')+a.value+' ms';
  a.oninput=()=>{window.axAD=a.value/1000;show();dispatchEvent(new Event('axdelay'))};
  a.ondblclick=()=>{a.value=0;a.oninput()};
  v.addEventListener('loadstart',()=>{a.value=0;window.axAD=0;show()})}

 /* ---------- Diagnostics (Settings > General): shows why a file can or cannot be reopened ---------- */
 const dg=document.createElement('div');dg.className='it';dg.innerHTML='<span>Diagnostics<small id="axdt" style="white-space:pre-line">Open Settings to refresh</small></span><button id="axdb">Copy</button>';
 const gpane=document.querySelector('#set .pane[data-p="g"]');gpane&&gpane.append(dg);
 async function diag(){
  const a=(await all())||[],n=a.filter(o=>o.h).length;
  const t=['Reopen local files: '+(CAN?'supported':'NOT supported by this browser'),'Folder picker: '+(window.showDirectoryPicker?'supported':'not supported'),
   '"Open with" launch: '+(window.launchQueue?'supported':'not supported'),'Saved for one-tap: '+n+' of '+a.length+' recent files','Handles in memory: '+AH.size,
   window.axDiag.last?'Last problem: '+window.axDiag.last:'No problems recorded'].join('\n');
  const e=document.getElementById('axdt');if(e)e.textContent=t;return t}
 const db=document.getElementById('axdb');
 if(db)db.onclick=async()=>{const t=await diag();try{await navigator.clipboard.writeText(t);say('Diagnostics copied')}catch{say('Could not copy')}};
 new MutationObserver(()=>{if(!el.set.hidden)diag()}).observe(el.set,{attributes:true,attributeFilter:['hidden']});
 document.head.insertAdjacentHTML('beforeend',`<style>#rec .pb{position:absolute;right:8px;top:56px;width:24px;height:24px;border-radius:50%;background:#000b center/12px no-repeat;box-shadow:0 2px 8px #0006;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2'/%3E%3C/svg%3E")}
#rec .pb.ok{background-color:var(--ac);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23171000'%3E%3Cpath d='M8 5l12 7-12 7z'/%3E%3C/svg%3E")}</style>`);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();