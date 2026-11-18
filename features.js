/* Axion features.js: touch gestures, wake lock, watch history (IndexedDB), audio delay */
(()=>{
const SKIP='#ctl,#set,#qm,#empty,#stats,#err,#wb,#eg,#aud,#aub,#ccb',cl=(x,a,b)=>Math.min(b,Math.max(a,x));

function init(){
 document.head.insertAdjacentHTML('beforeend','<style>#stage{touch-action:none!important}'+
  '#recw{width:100%;max-width:100%;margin-top:6px}#recw small{display:block;color:#b4bcd8;font-size:11.5px;font-weight:600;margin-bottom:4px}'+
  '#rec{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;justify-content:flex-start}'+
  '#rec .rc{flex:none;width:112px;padding:0;border-radius:10px;overflow:hidden;position:relative;font-size:11px;text-align:left;background:#ffffff1a;color:#fff}'+
  '#rec .th{display:block;height:63px;background:#0007 center/cover}'+
  '#rec .pg{position:absolute;left:0;right:0;top:59px;height:4px;background:#0009}#rec .pg i{display:block;height:100%;background:var(--ac)}'+
  '#rec .nm{display:block;padding:4px 6px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
  '#rec .x{position:absolute;top:3px;right:3px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:#000b;font-size:10px}</style>');

 /* ---------- 1. touch gestures: swipe up/down = brightness (left) / volume (right), swipe sideways = seek, long-press = 2x ---------- */
 let g=null,fast=1;
 const end=e=>{
  if(!g||(e&&e.pointerId!==g.id))return;
  clearTimeout(g.lp);
  if(g.m==='h'&&e&&e.type==='pointerup'&&g.d)seekBy(g.d);
  if(g.m==='f'){v.playbackRate=fast;say('Normal speed',700)}
  g=null};
 st.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='touch'||e.target.closest(SKIP)||!st.classList.contains('has')||st.classList.contains('web')||Z>1||ptr.size>1)return;
  const r=st.getBoundingClientRect();
  g={id:e.pointerId,x:e.clientX,y:e.clientY,left:e.clientX<r.left+r.width/2,m:0,d:0,br:S.br,vl:v.volume};
  g.lp=setTimeout(()=>{if(g&&!g.m&&!v.paused){g.m='f';fast=v.playbackRate;v.playbackRate=2;moved=true;say('2× speed',30000)}},450)});
 st.addEventListener('pointermove',e=>{
  if(!g||e.pointerId!==g.id)return;
  if(ptr.size>1||Z>1)return end();
  if(g.m==='f')return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(!g.m){if(Math.hypot(dx,dy)<14)return;clearTimeout(g.lp);g.m=Math.abs(dx)>Math.abs(dy)?'h':'v'}
  moved=true;
  if(g.m==='h'){g.d=Math.round(dx/(st.clientWidth||1)*120);say((g.d>0?'+':'')+g.d+'s',900)}
  else{const k=-dy/(st.clientHeight||1);
   if(g.left){const b=Math.round(cl(g.br+k*100,50,150)/5)*5;if(b!==S.br){S.br=b;applyS()}say('Brightness '+S.br+'%',900)}
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
   if(/^blob:/.test(curUrl)&&F)return{k:'f:'+F.name+':'+F.size,n:F.name};
   if(/^https?:/.test(curUrl)&&!st.classList.contains('web')){const u=curUrl.split('?')[0];return{k:'u:'+u,n:nm(u).slice(0,80),u:curUrl}}};

 const rec=document.createElement('div');rec.id='recw';rec.hidden=true;
 rec.innerHTML='<small>Continue watching</small><div id="rec"></div>';
 $('#empty .chips').after(rec);

 async function render(){
  const a=((await all())||[]).sort((x,y)=>y.ts-x.ts);
  a.slice(12).forEach(o=>del(o.k));
  const L=a.slice(0,12);rec.hidden=!L.length;
  $('#rec').innerHTML=L.map(o=>'<button class="rc" data-k="'+esc(o.k)+'"'+(o.u?' data-u="'+esc(o.u)+'"':'')+' data-p="'+Math.round(o.pos)+'">'+
   '<span class="th"'+(o.th?' style="background-image:url('+o.th+')"':'')+'></span>'+
   '<span class="pg"><i style="width:'+Math.min(100,Math.round(100*o.pos/(o.dur||1)))+'%"></i></span>'+
   '<span class="nm">'+esc(o.n)+'</span><span class="x" data-x="1">✕</span></button>').join('')}

 $('#rec').onclick=async e=>{
  const b=e.target.closest('.rc');if(!b)return;
  if(e.target.closest('.x')){await del(b.dataset.k);return render()}
  if(b.dataset.u){$('#url').value=b.dataset.u;$('#play').click()}
  else{say('Pick the same file to continue from '+fmt(+b.dataset.p),5000);$('#file').click()}};
 new MutationObserver(()=>{if(!el.empty.hidden)render()}).observe(el.empty,{attributes:true,attributeFilter:['hidden']});
 render();

 async function thumb(k){
  let th='';
  try{const c=document.createElement('canvas');c.width=160;c.height=90;c.getContext('2d').drawImage(v,0,0,160,90);th=c.toDataURL('image/jpeg',.6)}catch{}
  const o=await get(k);if(o&&o.th===undefined)put({...o,th})}

 let last=0;
 v.addEventListener('timeupdate',async()=>{
  const c=key();
  if(!c||!isFinite(v.duration)||v.duration<20||Date.now()-last<5000)return;
  last=Date.now();
  const o=(await get(c.k))||{},fin=v.currentTime>v.duration-15;
  await put({...o,...c,pos:fin?0:v.currentTime,dur:v.duration,ts:Date.now()});
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
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();