/* Axion media.js: lazy hls/dash, PWA hooks, audio-track switching (Mediabunny) */
(()=>{
const LIB={
 hls:['https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js',()=>window.Hls],
 dash:['https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.7.4/dash.all.min.js',()=>window.dashjs]},
 MB='https://cdn.jsdelivr.net/npm/mediabunny@1.61.3/dist/bundles/mediabunny.min.mjs',tried={};

/* index.html ke load() ki pehli line isse bulati hai: hls/dash sirf zarurat par load hote hain */
window.axLazy=(url,again)=>{
 const k=/\.m3u8(\?|#|$)/i.test(url)?'hls':/\.mpd(\?|#|$)/i.test(url)?'dash':'';
 if(!k||LIB[k][1]()||tried[k])return false;
 tried[k]=1;const s=document.createElement('script');
 s.src=LIB[k][0];s.onload=s.onerror=again;document.head.append(s);return true};

function init(){
 /* ---- PWA: service worker, install button, "Open with" files ---- */
 if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
 if(window.launchQueue)launchQueue.setConsumer(async p=>{const f=[],H=window.axH||(window.axH=new Map());for(const h of p.files||[]){const x=await h.getFile();H.set(x.name+':'+x.size,h);f.push(x)}f.length&&(openFiles(f),f.forEach(x=>window.axSave&&window.axSave(x)))});
 let ip;addEventListener('beforeinstallprompt',e=>{e.preventDefault();ip=e;
  const b=document.createElement('button');b.textContent='Install app';b.className='go';b.style.cssText='margin:0 10px 0 auto';
  b.onclick=async()=>{ip.prompt();await ip.userChoice.catch(()=>{});b.remove()};
  $('.top').insertBefore(b,$('#th'))});
 addEventListener('offline',()=>say('Offline: local files still play'));

 /* ---- audio tracks: Mediabunny reads the tracks, Web Audio plays the chosen one ---- */
 let A=null,MBp;
 const mbl=()=>MBp||(MBp=import(MB)),
  gain=()=>{if(A&&A.g)A.g.gain.value=A.m?0:v.volume},
  stop=()=>{if(!A)return;A.gen++;A.n.forEach(n=>{try{n.stop()}catch{}});A.n.clear()},
  drop=()=>{const a=A;if(!a)return;A=null;a.gen++;a.n.forEach(n=>{try{n.stop()}catch{}});
   a.g&&a.g.disconnect();a.ctx&&a.ctx.close().catch(()=>{});a.inp.dispose&&a.inp.dispose();
   if(a.web)v.muted=a.m;audUI()};

 /* AC3 / E-AC3 / DTS: browsers cannot decode these, so a small WebAssembly decoder (Mediabunny extension) is downloaded only when a file needs it */
 const EXT={ac3:'https://cdn.jsdelivr.net/npm/@mediabunny/ac3@1.66.2/dist/bundles/mediabunny-ac3.min.mjs',dts:'https://cdn.jsdelivr.net/npm/@mediabunny/dts@1.66.2/dist/bundles/mediabunny-dts.min.mjs'},extP={};
 const loadExt=k=>extP[k]||(extP[k]=(async()=>{
  const code=(await (await fetch(EXT[k])).text()).replace(/from\s*(["'])mediabunny\1/g,'from"'+MB+'"'); /* share the same Mediabunny instance */
  const u=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));
  try{const m=await import(u);(m.registerAc3Decoder||m.registerDtsDecoder)();return true}finally{URL.revokeObjectURL(u)}
 })().catch(()=>{extP[k]=null;return false}));
 async function withExt(t,ok){
  const need=new Set();
  t.forEach((x,i)=>{if(!ok[i]){if(x.codec==='ac3'||x.codec==='eac3')need.add('ac3');else if(x.codec==='dts')need.add('dts')}});
  if(!need.size)return ok;
  for(const k of need){say('Preparing '+(k==='ac3'?'AC3':'DTS')+' audio decoder…',30000);if(!await loadExt(k)){say('Could not load the '+k.toUpperCase()+' decoder (check your internet)',6000);return ok}}
  return Promise.all(t.map(x=>x.canDecode().catch(()=>false)))}

 async function probe(){
  drop();
  const url=curUrl,F=pl[pi];
  if(hls||dash||!url||st.classList.contains('web'))return;
  if(/^https?:/.test(url)&&slowNet())return;
  const M=await mbl().catch(()=>null);if(!M)return;
  const cands=/^blob:/.test(url)?(F?[new M.BlobSource(F)]:[]):/^https?:/.test(url)?
   [new M.UrlSource(url),new M.UrlSource(location.origin+'/api/proxy?u='+encodeURIComponent(url))]:[];
  for(const s of cands){
   const inp=new M.Input({source:s,formats:M.ALL_FORMATS});
   try{const t=await inp.getAudioTracks();
    let vbad='';try{const vt=await inp.getPrimaryVideoTrack();if(vt&&!(await vt.canDecode()))vbad=(vt.codec||'video').toUpperCase()}catch{}
    if(vbad)setTimeout(()=>{if(url===curUrl&&!v.videoWidth)say('No picture: this browser cannot decode '+vbad+' video (VLC has its own decoder). Try Chrome or Edge on a device with hardware '+vbad+' support, or open the file in VLC',12000)},1800);
    if(url!==curUrl||!t.length){inp.dispose&&inp.dispose();return}
    let ok=await Promise.all(t.map(x=>x.canDecode().catch(()=>false)));
    if(url!==curUrl){inp.dispose&&inp.dispose();return}
    if(t.length<2&&ok[0]){inp.dispose&&inp.dispose();return}
    const ok0=ok[0];
    if(ok.some(x=>!x)){window.axAudBusy=true;try{ok=await withExt(t,ok)}finally{window.axAudBusy=false}}
    if(url!==curUrl||(t.length<2&&!ok[0])){inp.dispose&&inp.dispose();return}
    A={inp,t,ok,AB:M.AudioBufferSink,cur:0,web:false,f0:!ok0&&ok[0],n:new Set(),gen:0,m:v.muted,url,last:0};audUI();
    if(A.f0){pick(0);say('Playing '+(t[0].codec||'').toUpperCase()+' audio with the built-in decoder',3500)}
    return
   }catch{inp.dispose&&inp.dispose()}}}

 function pick(i){
  if(!A)return;stop();
  if(i===0&&!A.f0){const m=A.m,was=A.web;A.cur=0;A.web=false;if(was)v.muted=m;return}
  if(!A.ok[i])return say('This browser cannot decode this audio (often AC3/DTS). Try another track',6000);
  if(!A.ctx){A.ctx=new AudioContext();A.g=A.ctx.createGain();A.g.connect(A.ctx.destination)}
  if(!A.web)A.m=v.muted;
  A.cur=i;A.web=true;A.lv=v.volume;A.sink=new A.AB(A.t[i]);v.muted=true;gain();go()}

 async function go(){
  const a=A;if(!a||!a.web)return;stop();
  if(v.paused||v.seeking)return;
  const g=++a.gen;a.last=performance.now();
  try{await a.ctx.resume();
   const m0=v.currentTime,c0=a.ctx.currentTime+.05,r=v.playbackRate;a.m0=m0;a.c0=c0;a.r=r;
   const D=window.axAD||0;
   for await(const {buffer,timestamp:t0} of a.sink.buffers(Math.max(0,m0-D-.5))){const timestamp=t0+D;
    if(g!==a.gen)return;
    let off=Math.max(0,m0-timestamp),when=c0+(timestamp+off-m0)/r;
    const late=a.ctx.currentTime-when;if(late>0){off+=late*r;when=a.ctx.currentTime}
    if(off>=buffer.duration)continue;
    const s=a.ctx.createBufferSource();s.buffer=buffer;s.playbackRate.value=r;s.connect(a.g);s.start(when,off);
    a.n.add(s);s.onended=()=>a.n.delete(s);
    while(g===a.gen&&when-a.ctx.currentTime>4)await new Promise(f=>setTimeout(f,250))}
  }catch{if(g===a.gen&&A===a){say('Could not decode this audio. Back to default track',5000);pick(0);audUI()}}}

 const on=()=>A&&A.web;
 ['playing','seeked','ratechange'].forEach(n=>v.addEventListener(n,()=>on()&&go()));
 ['pause','waiting','seeking'].forEach(n=>v.addEventListener(n,()=>on()&&stop()));
 v.addEventListener('timeupdate',()=>{if(!on()||v.paused||!A.c0||performance.now()-A.last<2000)return;
  if(Math.abs(v.currentTime-(A.m0+(A.ctx.currentTime-A.c0)*A.r))>.2)go()});
 ['loadstart','emptied'].forEach(n=>v.addEventListener(n,drop));
 addEventListener('axdelay',()=>on()&&go());
 v.addEventListener('loadedmetadata',probe);

 /* while Web Audio plays, <video> stays muted; this keeps mute button, slider and M/arrow keys working */
 const ov=v.onvolumechange;
 v.onvolumechange=e=>{
  if(!on())return ov&&ov.call(v,e);
  if(!v.muted){if(v.volume!==A.lv)A.m=false;else A.m=!A.m;v.muted=true}
  A.lv=v.volume;gain();
  $('#mt').innerHTML=A.m||!v.volume?I.off:I.on;$('#vol').value=A.m?0:v.volume};

 /* plug into the existing audio menu (works with the chip, menu and "A" key) */
 const aS=window.audSrc,sA=window.setAud;
 window.audSrc=()=>A&&(A.t.length>1||A.f0)?{k:'m',a:A.t.map((x,i)=>[(x.name||(x.codec?x.codec.toUpperCase()+(x.numberOfChannels?' '+(x.numberOfChannels>5?'5.1':x.numberOfChannels===2?'stereo':x.numberOfChannels+'ch'):''):''))+(A.ok[i]?'':' ✕'),x.languageCode]),c:Math.max(0,A.cur)}:aS();
 window.setAud=i=>{if(!(A&&(A.t.length>1||A.f0)))return sA(i);pick(i);say('Audio: '+audName(window.audSrc().a[i],i),3000);setTimeout(audUI,300)};
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();

/* ---- Embedded MKV subtitles (device files). Mediabunny cannot read subtitle tracks, so this is our own EBML reader ---- */
(()=>{
/*MKV-START*/
const CL=0x1F43B675,DESC=new Set([0x18538067,0x1549A966,0x1654AE6B,0xAE,CL,0xA0]),TXT=/^S_TEXT\/(UTF8|ASCII|ASS|SSA|WEBVTT)$/;
async function mkv(F,live,prog){
 const SZ=F.size,CH=8<<20;let ws=0,we=0,u=new Uint8Array(0);
 const ens=async(p,n)=>{n=Math.min(n,SZ-p);if(p>=ws&&p+n<=we)return;
  ws=p;u=new Uint8Array(await F.slice(p,Math.min(SZ,p+Math.max(n,CH))).arrayBuffer());we=ws+u.length},
 vi=(p,id)=>{const b=u[p-ws];let l=1,m=128;while(l<9&&!(b&m)){l++;m>>=1}if(l>8)return 0;
  let v=id?b:b&(m-1),all=(b&(m-1))===m-1;
  for(let i=1;i<l;i++){const c=u[p-ws+i];v=v*256+c;if(c!==255)all=false}return isNaN(v)?0:[v,l,all]},
 rd=(p,n)=>{let v=0;for(let i=0;i<n;i++)v=v*256+u[p-ws+i];return v},
 str=(p,n)=>new TextDecoder().decode(u.subarray(p-ws,p-ws+n)).replace(/\0+$/,'');
 const T=[],C=[],M={};let sc=1e6,ctc=0,gid=0,cur=null,pd=null,tr=null,p=0,go=0,lp=0;
 while(p<SZ){
  if(!live())return null;
  await ens(p,12);
  const a=vi(p,1);if(!a)break;const b=vi(p+a[1],0);if(!b)break;
  const id=a[0],ds=p+a[1]+b[1],sz=b[2]?SZ-ds:b[0];
  if(go&&prog&&p-lp>SZ/20){lp=p;prog(Math.round(100*p/SZ))}
  if(DESC.has(id)){
   if(id===0xAE)T.push(tr={});
   if(id===0xA0){gid++;pd=null}
   if(id===CL&&!go){go=1;for(const t of T)if(t.t===17&&TXT.test(t.c||''))M[t.n]=t;
    if(!Object.keys(M).length)return{T:T.filter(t=>t.t===17),C,sc}}
   p=ds;continue}
  if(sz<=256&&(id===0x2AD7B1||id===0xE7||id===0x9B||(tr&&(id===0xD7||id===0x83||id===0x88||id===0x86||id===0x22B59C||id===0x536E)))){
   await ens(ds,sz);
   const v=id===0x86||id===0x22B59C||id===0x536E?str(ds,sz):rd(ds,sz);
   if(id===0x2AD7B1)sc=v;else if(id===0xE7)ctc=v;
   else if(id===0x9B){if(cur&&cur.g===gid&&cur.d==null)cur.d=v;else pd=v}
   else if(id===0xD7)tr.n=v;else if(id===0x83)tr.t=v;else if(id===0x86)tr.c=v;
   else if(id===0x22B59C)tr.l=v;else if(id===0x536E)tr.nm=v;else tr.df=v;
  }else if(id===0xA1&&sz>4){
   await ens(ds,Math.min(sz,16));const t=vi(ds,0),k=t&&M[t[0]];
   if(k){await ens(ds,sz);const o=ds+t[1];let r=u[o-ws]*256+u[o+1-ws];if(r>32767)r-=65536;
    cur={n:t[0],s:ctc+r,d:pd,g:gid,x:new TextDecoder().decode(u.subarray(o+3-ws,ds+sz-ws))};pd=null;C.push(cur)}}
  p=ds+sz}
 return{T:T.filter(t=>t.t===17),C,sc}}
const ts=m=>{m=Math.max(0,Math.round(m));const z=(n,l)=>String(n).padStart(l,'0');return z(~~(m/36e5),2)+':'+z(~~(m%36e5/6e4),2)+':'+z(~~(m%6e4/1e3),2)+'.'+z(m%1e3,3)};
function vtt(t,C,sc){const ass=/ASS|SSA/.test(t.c);let o='WEBVTT\n\n';
 for(const c of C.filter(c=>c.n===t.n).sort((a,b)=>a.s-b.s)){
  let x=c.x;if(ass){x=x.split(',').slice(8).join(',');x=window.axSubs?window.axSubs.assText(x):x.replace(/\{[^}]*\}/g,'').replace(/\\N/gi,'\n').replace(/\\h/g,' ')}
  x=x.trim().replace(/\n{2,}/g,'\n');if(!x)continue;
  const s=c.s*sc/1e6,d=(c.d==null?2000:c.d)*sc/1e6;o+=ts(s)+' --> '+ts(s+d)+'\n'+x+'\n\n'}return o}
/*MKV-END*/

function init(){
 let SB={t:[],cur:-1,C:null,sc:1e6},tok=0;
 const lab=(t,i)=>audName([t.nm||'',t.l],i)+(/ASS|SSA/.test(t.c)?' (ASS)':''),
  btn=document.createElement('button');
 btn.id='ccb';btn.className='chip';btn.textContent='CC';btn.title='Subtitles';btn.hidden=true;
 $('#aub').insertAdjacentElement('afterend',btn);
 document.head.insertAdjacentHTML('beforeend','<style>@container ctl (max-width:560px){#ctl #ccb{display:none}}</style>');
 $('#subb').closest('.it').insertAdjacentHTML('beforebegin','<div class="it"><span>Subtitle track<small id="scur">None in this file</small></span><button id="sbt">Choose</button></div>');
 const reset=()=>{tok++;if(SB.cur>=0)v.querySelectorAll('track').forEach(x=>x.remove());
  SB={t:[],cur:-1,C:null,sc:1e6};btn.hidden=true;$('#scur').textContent='None in this file'};
 function use(i){
  v.querySelectorAll('track').forEach(x=>x.remove());sdel=0;$('#sd').value=0;SB.cur=i;
  if(i<0){$('#scur').textContent='Off';return say('Subtitles off')}
  const t=SB.t[i],k=document.createElement('track');k.kind='subtitles';k.label=lab(t,i);
  k.src=URL.createObjectURL(new Blob([vtt(t,SB.C,SB.sc)],{type:'text/vtt'}));k.default=true;v.append(k);k.track.mode='showing';
  $('#scur').textContent=k.label;say('Subtitles: '+k.label)}
 function menu(){el.set.hidden=true;
  el.qm.innerHTML='<div class="mh">Subtitles</div><button data-s="-1"'+(SB.cur<0?' class="on"':'')+'>Off</button>'+
   SB.t.map((t,i)=>'<button data-s="'+i+'"'+(i===SB.cur?' class="on"':'')+'>'+esc(lab(t,i))+'</button>').join('')+'<button data-s="add">+ Add subtitle file</button><button data-s="style">Subtitle style…</button>';
  el.qm.hidden=false}
 btn.onclick=$('#sbt').onclick=menu;
 el.qm.addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;e.stopPropagation();el.qm.hidden=true;
  b.dataset.s==='add'?$('#sub').click():b.dataset.s==='style'?window.axSubStyle&&axSubStyle():use(+b.dataset.s)},true);
 async function scan(){
  const my=++tok,F=pl[pi],L=(...a)=>console.log('[Axion subs]',...a);
  L('media.js v3 | file:',F&&F.name,'|',F&&F.type,'|',/^blob:/.test(curUrl)?'device file':'link');
  if(!/^blob:/.test(curUrl)||!F)return L('skipped: only device files are scanned');
  const h=new Uint8Array(await F.slice(0,4).arrayBuffer());
  if(h[0]!==0x1A||h[1]!==0x45||h[2]!==0xDF||h[3]!==0xA3)return L('skipped: not MKV/WebM (embedded subtitles in MP4 are not supported)');
  await new Promise(r=>setTimeout(r,1500));if(my!==tok)return;
  let R;try{R=await mkv(F,()=>my===tok,n=>say('Reading subtitles… '+n+'%',1500))}catch(e){L('error:',e);return say('Subtitle scan failed: '+e.message,6000)}
  if(!R||my!==tok)return L('cancelled');
  L('subtitle tracks:',JSON.stringify(R.T),'| cues:',R.C.length);
  const t=R.T.filter(x=>TXT.test(x.c||''));
  if(!t.length)return R.T.length?say('Subtitles in this file are image-based (PGS/VobSub) and cannot be shown',6000):0;
  SB={t,cur:-1,C:R.C,sc:R.sc};btn.hidden=false;$('#scur').textContent='Off · '+t.length+' tracks';
  say('Subtitles found: '+t.map(lab).join(', ')+'. Tap CC to choose',6000)}
 v.addEventListener('loadstart',reset);v.addEventListener('loadedmetadata',scan);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();

/* ---- Subtitle style: own renderer + "Subtitles" tab in Settings ---- */
(()=>{
const D={on:true,f:'sans',sz:100,b:false,col:'#ffffff',pos:7,w:80,lift:true,bg:55,ol:'outline'},
 F={sans:'Inter,"Segoe UI",system-ui,-apple-system,"Noto Sans","Noto Sans Devanagari",sans-serif',
  serif:'Georgia,"Times New Roman","Noto Serif","Noto Serif Devanagari",serif',
  mono:'Consolas,"Courier New",monospace',round:'"Trebuchet MS",Verdana,"Noto Sans",sans-serif',
  casual:'"Comic Sans MS","Segoe Print","Chalkboard SE",cursive'},
 E={none:'none',outline:'-.06em -.06em 0 #000,.06em -.06em 0 #000,-.06em .06em 0 #000,.06em .06em 0 #000,0 -.08em 0 #000,0 .08em 0 #000,-.08em 0 0 #000,.08em 0 0 #000',
  shadow:'.05em .07em .12em #000c',glow:'0 0 .2em #000,0 0 .45em #000'},
 U={sz:'%',pos:'%',w:'%',bg:'%'};
function init(){
 let O={...D};try{Object.assign(O,JSON.parse(localStorage.axionSub))}catch{}
 const save=()=>{try{localStorage.axionSub=JSON.stringify(O)}catch{}},cl=(x,a,b)=>Math.min(b,Math.max(a,x));
 document.head.insertAdjacentHTML('beforeend','<style>'+
  '#sov{position:absolute;left:0;right:0;bottom:calc(var(--sp)*1%);z-index:1;display:flex;flex-direction:column;align-items:center;gap:.2em;padding:0 3%;pointer-events:none;text-align:center;transition:bottom .2s;font-family:var(--sfam);font-size:var(--sf);font-weight:var(--sfw);line-height:1.3;color:var(--sc);text-shadow:var(--sts)}'+
  '#stage:not(.idle) #sov.lift{bottom:calc(var(--sp)*1% + var(--cb,74px))}#stage.web #sov,#stage:not(.has) #sov{display:none}'+
  '#sov>span{display:inline-block;max-width:var(--smw);padding:.1em .5em;border-radius:.3em;background:var(--sbg);white-space:pre-wrap}'+
  '#set .tabs .tab{padding:5px 7px;font-size:13px}#set .rv{min-width:44px;text-align:right;color:var(--mut);font-size:12px;font-variant-numeric:tabular-nums}'+
  '#set .sdot{width:24px;height:24px;min-width:0;min-height:0;padding:0;border-radius:50%;border:2px solid transparent}#set .sdot.on{border-color:var(--tx);box-shadow:0 0 0 2px var(--panel) inset}'+
  '#set input[type=color]{width:28px;height:24px;min-height:0;padding:0;border:0;background:none;cursor:pointer}</style>');
 const ov=document.createElement('div');ov.id='sov';v.after(ov);

 const R=(k,l,a,b,t,sm)=>'<label class="it"><span>'+l+(sm?'<small>'+sm+'</small>':'')+'</span><span class="rg"><span class="rv"></span><input type="range" data-o="'+k+'" min="'+a+'" max="'+b+'" step="'+(t||1)+'"></span></label>',
  S=(k,l,o)=>'<label class="it"><span>'+l+'</span><select data-o="'+k+'">'+o.map(x=>'<option value="'+x[0]+'">'+x[1]+'</option>').join('')+'</select></label>',
  T=(k,l,sm)=>'<label class="it"><span>'+l+(sm?'<small>'+sm+'</small>':'')+'</span><input type="checkbox" class="tg" data-o="'+k+'"></label>',
  C=['#ffffff','#ffe14d','#4de1ff','#7dff8a','#ff8ad8'];
 const pane=document.createElement('div');pane.className='pane';pane.dataset.p='s';pane.hidden=true;
 pane.innerHTML=
  '<div class="it"><span>Track<small id="scur2">None in this file</small></span><span class="bt"><button id="sbt2">Choose</button><button id="sad">Add file</button></span></div>'+
  T('on','Show subtitles','Key: C')+
  '<div class="it"><span>Delay<small id="sdv">0 s</small></span><span class="bt"><button id="sdm">−0.5 s</button><button id="sdp">+0.5 s</button></span></div>'+
  '<div class="gh">Text</div>'+
  S('f','Font',[['sans','Sans'],['serif','Serif'],['round','Rounded'],['mono','Mono'],['casual','Casual']])+
  R('sz','Size',50,300,5,'Keys: [ and ]')+T('b','Bold')+
  '<div class="it"><span>Colour</span><span class="dots">'+C.map(c=>'<button class="sdot" data-sc="'+c+'" style="background:'+c+'"></button>').join('')+'<input type="color" data-o="col"></span></div>'+
  '<div class="gh">Position</div>'+
  R('pos','Height from bottom',0,50,1,'Keys: ; and \'')+R('w','Text width',40,100,5)+T('lift','Move up with controls')+
  '<div class="gh">Background and edge</div>'+
  R('bg','Background',0,100,5)+S('ol','Edge',[['outline','Outline'],['shadow','Shadow'],['glow','Glow'],['none','None']])+
  '<div class="it"><span></span><button id="srs">Reset style</button></div>';
 $('#set .body').append(pane);
 const tb=document.createElement('button');tb.className='tab';tb.dataset.t='s';tb.textContent='Subtitles';$('#set .tabs').append(tb);
 tb.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===tb));
  document.querySelectorAll('.pane').forEach(x=>x.hidden=x.dataset.p!=='s');sync()};
 document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>setTimeout(render,0)));
 new MutationObserver(render).observe(el.set,{attributes:true,attributeFilter:['hidden']});
 window.axSubStyle=()=>{el.qm.hidden=true;el.set.hidden=false;tb.click();showCtl()};

 function render(){
  ov.textContent='';let n=0;
  if(O.on)for(const t of v.textTracks){if(t.mode==='showing')t.mode='hidden';
   if(t.mode!=='hidden'||!t.activeCues)continue;
   for(const c of t.activeCues){const s=document.createElement('span');s.append(c.getCueAsHTML());ov.append(s);n++}}
  const on=document.querySelector('.tab.on');
  if(!n&&O.on&&!el.set.hidden&&on&&on.dataset.t==='s'){const s=document.createElement('span');s.textContent='Sample subtitle text\nसब टाइटल का नमूना';ov.append(s)}}
 function apply(){
  const s=ov.style,h=st.clientHeight,w=st.clientWidth;
  s.setProperty('--sf',Math.max(10,Math.min(h*.045,w*.06))*O.sz/100+'px');
  s.setProperty('--sp',O.pos);s.setProperty('--smw',O.w+'%');s.setProperty('--sc',O.col);
  s.setProperty('--sfam',F[O.f]||F.sans);s.setProperty('--sfw',O.b?700:500);s.setProperty('--sts',E[O.ol]||'none');
  s.setProperty('--sbg','rgba(0,0,0,'+O.bg/100+')');ov.classList.toggle('lift',!!O.lift);render()}
 function sync(){
  pane.querySelectorAll('[data-o]').forEach(e=>{const k=e.dataset.o,x=O[k];e.type==='checkbox'?e.checked=x:e.value=x;
   const r=e.previousElementSibling;if(r&&r.classList.contains('rv'))r.textContent=x+(U[k]||'')});
  pane.querySelectorAll('.sdot').forEach(d=>d.classList.toggle('on',d.dataset.sc===O.col));
  const d=+$('#sd').value;$('#sdv').textContent=(d>0?'+':'')+d+' s'}
 const set=(k,x)=>{O[k]=x;save();apply();sync()};
 pane.addEventListener('input',e=>{const t=e.target,k=t.dataset.o;if(k)set(k,t.type==='checkbox'?t.checked:t.type==='range'?+t.value:t.value)});
 pane.addEventListener('click',e=>{const d=e.target.closest('.sdot');if(d)set('col',d.dataset.sc)});
 $('#srs').onclick=()=>{O={...D};save();apply();sync()};
 $('#sbt2').onclick=()=>$('#sbt').click();$('#sad').onclick=()=>$('#sub').click();
 const dl=d=>{const s=$('#sd');s.value=cl(+s.value+d,-5,5);s.dispatchEvent(new Event('input',{bubbles:true}));sync()};
 $('#sdm').onclick=()=>dl(-.5);$('#sdp').onclick=()=>dl(.5);
 $('#sd').addEventListener('input',()=>{sync();setTimeout(render,50)});
 const sc=$('#scur');if(sc)new MutationObserver(()=>$('#scur2').textContent=sc.textContent).observe(sc,{childList:true,characterData:true,subtree:true});

 const hook=t=>{t.mode='hidden';t.oncuechange=render};
 v.textTracks.addEventListener('addtrack',e=>{hook(e.track);const b=$('#ccb');if(b)b.hidden=false;render()});
 v.textTracks.addEventListener('removetrack',render);v.addEventListener('seeked',render);
 addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  const k=e.key;
  if(k==='c')set('on',!O.on),say('Subtitles '+(O.on?'on':'off'));
  else if(k==='['||k===']')set('sz',cl(O.sz+(k===']'?10:-10),50,300)),say('Subtitle size '+O.sz+'%');
  else if(k===';'||k==="'")set('pos',cl(O.pos+(k==="'"?2:-2),0,50)),say('Subtitle height '+O.pos+'%')});
 new ResizeObserver(apply).observe(st);apply();sync();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();