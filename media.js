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
 window.axDiag=window.axDiag||{last:''};axDiag.ver='media.js links-4';
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
 const weak=()=>{const c=navigator.connection;return stalls>1||!!(c&&(c.saveData||/2g/.test(c.effectiveType||'')))};
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
  const lnk=/^https?:/.test(url),dg=m=>{axDiag.aud=m};dg('');
  if(lnk&&weak())return dg('skipped (data saver is on, 2G connection, or repeated buffering)');
  const M=await mbl().catch(e=>{dg('Mediabunny library could not be loaded from cdn.jsdelivr.net ('+((e&&e.message)||e)+')');return null});
  if(!M){if(lnk&&url===curUrl)say('Audio / subtitle tracks need cdn.jsdelivr.net, which could not be reached',6000);return}
  const cands=/^blob:/.test(url)?(F?[new M.BlobSource(F)]:[]):/^https?:/.test(url)?
   [new M.UrlSource(url),new M.UrlSource(location.origin+'/api/proxy?u='+encodeURIComponent(url))]:[];
  const errs=[];
  for(const [ci,s] of cands.entries()){
   const inp=new M.Input({source:s,formats:M.ALL_FORMATS});
   try{const t=await inp.getAudioTracks();
    dg((lnk?(ci?'via /api/proxy: ':'direct: '):'')+t.length+' audio track(s): '+t.map(x=>(x.codec||'?')+(x.languageCode&&x.languageCode!=='und'?'/'+x.languageCode:'')).join(', '));
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
   }catch(e){errs.push((lnk?(ci?'proxy':'direct'):'file')+': '+((e&&(e.message||e.name))||'error'));inp.dispose&&inp.dispose()}}
  if(lnk&&url===curUrl){dg('this link cannot be read ('+errs.join(' | ')+')');say('Audio / subtitle tracks: this link cannot be read. Settings > General > Check this link shows why',7000)}}

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
const CL=0x1F43B675,DESC=new Set([0x18538067,0x1549A966,0x1654AE6B,0xAE,CL,0xA0,0x114D9B74,0x4DBB]),TXT=/^S_TEXT\/(UTF8|ASCII|ASS|SSA|WEBVTT)$/;
async function mkv(F,live,prog,part,wait,CH0,init){
 const SZ=F.size,CH=CH0||8<<20;let ws=0,we=0,u=new Uint8Array(0);
 const ens=async(p,n)=>{n=Math.min(n,SZ-p);if(p>=ws&&p+n<=we)return;
  ws=p;u=new Uint8Array(await F.slice(p,Math.min(SZ,p+Math.max(n,CH))).arrayBuffer());we=ws+u.length},
 vi=(p,id)=>{const b=u[p-ws];let l=1,m=128;while(l<9&&!(b&m)){l++;m>>=1}if(l>8)return 0;
  let v=id?b:b&(m-1),all=(b&(m-1))===m-1;
  for(let i=1;i<l;i++){const c=u[p-ws+i];v=v*256+c;if(c!==255)all=false}return isNaN(v)?0:[v,l,all]},
 rd=(p,n)=>{let v=0;for(let i=0;i<n;i++)v=v*256+u[p-ws+i];return v},
 str=(p,n)=>new TextDecoder().decode(u.subarray(p-ws,p-ws+n)).replace(/\0+$/,'');
 const T=init?init.T.slice():[],C=init?init.C:[],M={},seen=init&&init.seen;
 let sc=init?init.sc:1e6,ctc=0,gid=0,cur=null,pd=null,tr=null,p=init?init.p:0,go=init?1:0,lp=0,segStart=0,cuesPos=null,sid=0,first=0;
 if(init)for(const t of T)if(t.t===17&&TXT.test(t.c||''))M[t.n]=t; /* a run that starts in the middle of the file: tracks are already known */
 while(p<SZ){
  if(!live())return null;
  await ens(p,12);
  const a=vi(p,1);if(!a)break;const b=vi(p+a[1],0);if(!b)break;
  const id=a[0],ds=p+a[1]+b[1],sz=b[2]?SZ-ds:b[0];
  if(go&&prog&&p-lp>SZ/20){lp=p;prog(Math.round(100*p/SZ))}
  if(DESC.has(id)){
   if(id===0x18538067)segStart=ds;
   if(id===0xAE)T.push(tr={});
   if(id===0xA0){gid++;pd=null}
   if(id===CL&&!go){go=1;first=p;for(const t of T)if(t.t===17&&TXT.test(t.c||''))M[t.n]=t;
    if(!Object.keys(M).length)return{T:T.filter(t=>t.t===17),C,sc};
    if(part)part({T:T.filter(t=>t.t===17),C,sc,segStart,cuesPos,first})}
   p=ds;continue}
  if(sz<=256&&(id===0x2AD7B1||id===0xE7||id===0x9B||id===0x53AB||id===0x53AC||(tr&&(id===0xD7||id===0x83||id===0x88||id===0x86||id===0x22B59C||id===0x536E)))){
   await ens(ds,sz);
   const v=id===0x86||id===0x22B59C||id===0x536E?str(ds,sz):rd(ds,sz);
   if(id===0x2AD7B1)sc=v;else if(id===0xE7){ctc=v;if(wait)await wait(ctc*sc/1e9)}
   else if(id===0x9B){if(cur&&cur.g===gid&&cur.d==null)cur.d=v;else pd=v}
   else if(id===0x53AB)sid=v;else if(id===0x53AC){if(sid===0x1C53BB6B)cuesPos=v}
   else if(id===0xD7)tr.n=v;else if(id===0x83)tr.t=v;else if(id===0x86)tr.c=v;
   else if(id===0x22B59C)tr.l=v;else if(id===0x536E)tr.nm=v;else tr.df=v;
  }else if(id===0xA1&&sz>4){
   await ens(ds,Math.min(sz,16));const t=vi(ds,0),k=t&&M[t[0]];
   if(k){await ens(ds,sz);const o=ds+t[1];let r=u[o-ws]*256+u[o+1-ws];if(r>32767)r-=65536;
    const x=new TextDecoder().decode(u.subarray(o+3-ws,ds+sz-ws)),key=seen?t[0]+':'+(ctc+r)+':'+x:'';
    if(seen&&seen.has(key)){cur=null;pd=null}else{if(seen)seen.add(key);cur={n:t[0],s:ctc+r,d:pd,g:gid,x};pd=null;C.push(cur)}}}
  p=ds+sz}
 return{T:T.filter(t=>t.t===17),C,sc}}
const ts=m=>{m=Math.max(0,Math.round(m));const z=(n,l)=>String(n).padStart(l,'0');return z(~~(m/36e5),2)+':'+z(~~(m%36e5/6e4),2)+':'+z(~~(m%6e4/1e3),2)+'.'+z(m%1e3,3)};
function vtt(t,C,sc){const ass=/ASS|SSA/.test(t.c);let o='WEBVTT\n\n';
 for(const c of C.filter(c=>c.n===t.n).sort((a,b)=>a.s-b.s)){
  let x=c.x;if(ass){x=x.split(',').slice(8).join(',');x=window.axSubs?window.axSubs.assText(x):x.replace(/\{[^}]*\}/g,'').replace(/\\N/gi,'\n').replace(/\\h/g,' ')}
  x=x.trim().replace(/\n{2,}/g,'\n');if(!x)continue;
  const s=c.s*sc/1e6,d=(c.d==null?2000:c.d)*sc/1e6;o+=ts(s)+' --> '+ts(s+d)+'\n'+x+'\n\n'}return o}
function cueText(t,c){let x=c.x;if(/ASS|SSA/.test(t.c)){x=x.split(',').slice(8).join(',');x=window.axSubs?window.axSubs.assText(x):x.replace(/\{[^}]*\}/g,'').replace(/\\N/gi,'\n').replace(/\\h/g,' ')}
 return x.trim().replace(/\n{2,}/g,'\n')}
/* the Cues element lists [time, cluster position] pairs: lets us jump to the playhead instead of reading the file from its start */
async function cueIndex(F,segStart,cp){
 if(!segStart)return null;
 const SZ=F.size;
 const rv=(u,i,keep)=>{const b=u[i];let l=1,m=128;while(l<9&&!(b&m)){l++;m>>=1}if(l>8||i+l>u.length)return null;let v=keep?b:b&(m-1);for(let k=1;k<l;k++)v=v*256+u[i+k];return[v,l]};
 async function parseAt(p){
  if(p<=0||p>=SZ)return null;
  const h=new Uint8Array(await F.slice(p,Math.min(SZ,p+16)).arrayBuffer()),a=rv(h,0,1),b=a&&rv(h,a[1]);
  if(!a||!b||a[0]!==0x1C53BB6B||b[0]>12<<20)return null;
  const q=p+a[1]+b[1],u=new Uint8Array(await F.slice(q,Math.min(SZ,q+b[0])).arrayBuffer()),out=[];
  const kids=(s,e,f)=>{while(s<e){const x=rv(u,s,1),y=x&&rv(u,s+x[1]);if(!y)return;const ds=s+x[1]+y[1];f(x[0],ds,Math.min(e,ds+y[0]));s=ds+y[0]}},
   num=(s,e)=>{let v=0;for(let i=s;i<e;i++)v=v*256+u[i];return v};
  kids(0,u.length,(id,s,e)=>{if(id!==0xBB)return;let t=null,pos=null;
   kids(s,e,(i2,s2,e2)=>{if(i2===0xB3)t=num(s2,e2);else if(i2===0xB7&&pos==null)kids(s2,e2,(i3,s3,e3)=>{if(i3===0xF1)pos=num(s3,e3)})});
   if(t!=null&&pos!=null)out.push([t,pos])});
  out.sort((x,y)=>x[0]-y[0]);return out.length?out:null}
 if(cp!=null){const r=await parseAt(segStart+cp);if(r)return r}
 /* the SeekHead does not point to the Cues: look for them in the last 3 MB and check that the positions are real clusters */
 const n=Math.min(SZ,3<<20),base=SZ-n,t=new Uint8Array(await F.slice(base,SZ).arrayBuffer());
 for(let i=t.length-8;i>=0;i--)if(t[i]===0x1C&&t[i+1]===0x53&&t[i+2]===0xBB&&t[i+3]===0x6B){
  const r=await parseAt(base+i);if(!r)continue;
  let ok=true;for(const e of[r[0],r[r.length>>1],r[r.length-1]]){const b=new Uint8Array(await F.slice(segStart+e[1],segStart+e[1]+4).arrayBuffer());if(b[0]!==0x1F||b[1]!==0x43||b[2]!==0xB6||b[3]!==0x75){ok=false;break}}
  if(ok)return r}
 return null}
/* a File-like object for a link: slice(a,b).arrayBuffer() = HTTP Range request (direct if the site allows CORS, else through /api/proxy) */
function remote(url){
 const px=location.origin+'/api/proxy?u='+encodeURIComponent(url),act=new Set(),nap=ms=>new Promise(r=>setTimeout(r,ms));
 let base='',size=0,dead=0;const why=[];
 async function get(b,a,z){
  if(dead)throw new Error('stopped');
  const c=new AbortController(),tm=setTimeout(()=>c.abort(),25000);act.add(c);
  try{
   const r=await fetch(b,{headers:{Range:'bytes='+a+'-'+z},signal:c.signal});
   if(r.status!==206){r.body&&r.body.cancel().catch(()=>0);throw new Error('HTTP '+r.status)}
   const m=/\/(\d+)\s*$/.exec(r.headers.get('content-range')||'');
   return{buf:await r.arrayBuffer(),total:m?+m[1]:0}
  }finally{clearTimeout(tm);act.delete(c)}}
 async function read(a,z){
  z=Math.min(z,size);if(z<=a)return new ArrayBuffer(0);
  const out=new Uint8Array(z-a);let o=0,bad=0;
  while(o<out.length){
   try{const r=new Uint8Array((await get(base,a+o,z-1)).buf);if(!r.length)break;out.set(r.subarray(0,out.length-o),o);o+=r.length;bad=0}
   catch(e){if(dead||++bad>3)throw e;await nap(700*bad)}}
  return out.buffer.slice(0,o)}
 return{
  async open(){for(const b of[url,px]){const w=b===url?'direct':'proxy';try{const r=await get(b,0,3);if(r.total>8){base=b;size=r.total;return true}why.push(w+': no Content-Range header')}catch(e){why.push(w+': '+(e&&e.name==='TypeError'?'blocked or unreachable (CORS?)':e&&e.name==='AbortError'?'timeout':(e&&e.message)||'error'));if(dead)return false}}return false},
  why,
  abort(){dead=1;act.forEach(c=>c.abort())},
  file:{get size(){return size},slice:(a,z)=>({arrayBuffer:()=>read(a,z)})}}}
/*MKV-END*/

function init(){
 let SB={t:[],cur:-1,C:null,sc:1e6},tok=0;
 const lab=(t,i)=>audName([t.nm||'',t.l],i)+(/ASS|SSA/.test(t.c)?' (ASS)':''),
  btn=document.createElement('button');
 btn.id='ccb';btn.className='chip';btn.textContent='CC';btn.title='Subtitles';btn.hidden=true;
 $('#aub').insertAdjacentElement('afterend',btn);
 document.head.insertAdjacentHTML('beforeend','<style>@container ctl (max-width:560px){#ctl #ccb{display:none}}</style>');
 $('#subb').closest('.it').insertAdjacentHTML('beforebegin','<div class="it"><span>Subtitle track<small id="scur">None in this file</small></span><button id="sbt">Choose</button></div>');
 const reset=()=>{tok++;clearInterval(SB.iv);SB.r&&SB.r.abort();if(SB.cur>=0)v.querySelectorAll('track').forEach(x=>x.remove());
  SB={t:[],cur:-1,C:null,sc:1e6};btn.hidden=true;$('#scur').textContent='None in this file'};
 function use(i){
  v.querySelectorAll('track').forEach(x=>x.remove());sdel=0;$('#sd').value=0;SB.cur=i;
  if(i<0){$('#scur').textContent='Off';return say('Subtitles off')}
  const t=SB.t[i],k=document.createElement('track');k.kind='subtitles';k.label=lab(t,i);
  if(SB.live){SB.want=1;SB.said=0;SB.warned=0;SB.t0=Date.now();SB.k=k;SB.n=0;SB.ok=0;k.src=URL.createObjectURL(new Blob(['WEBVTT\n\n'],{type:'text/vtt'}));k.default=true;k.addEventListener('load',()=>{if(SB.k===k){SB.ok=1;feed()}}); /* cues are added only after the track has loaded: the browser clears cues added earlier */
  v.append(k);k.track.mode='showing';$('#scur').textContent=k.label;return say('Subtitles: '+k.label+' (loading…)',2500)}
  k.src=URL.createObjectURL(new Blob([vtt(t,SB.C,SB.sc)],{type:'text/vtt'}));k.default=true;v.append(k);k.track.mode='showing';
  $('#scur').textContent=k.label;say('Subtitles: '+k.label)}
 function menu(){el.set.hidden=true;
  el.qm.innerHTML='<div class="mh">Subtitles</div><button data-s="-1"'+(SB.cur<0?' class="on"':'')+'>Off</button>'+
   SB.t.map((t,i)=>'<button data-s="'+i+'"'+(i===SB.cur?' class="on"':'')+'>'+esc(lab(t,i))+'</button>').join('')+'<button data-s="add">+ Add subtitle file</button><button data-s="style">Subtitle style…</button>';
  el.qm.hidden=false}
 btn.onclick=$('#sbt').onclick=menu;
 el.qm.addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;e.stopPropagation();el.qm.hidden=true;
  b.dataset.s==='add'?$('#sub').click():b.dataset.s==='style'?window.axSubStyle&&axSubStyle():use(+b.dataset.s)},true);
 /* links: tracks are listed after a few MB (CC appears); the cues are read in the background only after a track is chosen,
    and never more than ~2.5 min ahead of the playhead, so the extra data stays close to what you actually watch */
 const weak=()=>{const c=navigator.connection;return stalls>1||!!(c&&(c.saveData||/2g/.test(c.effectiveType||'')))},
  NOSCAN=/\.(mp4|m4v|mov|m3u8|mpd|mp3|m4a|aac|flac|wav|ogg|oga|opus|ogv)(\?|#|&|$)/i,nap=ms=>new Promise(r=>setTimeout(r,ms));
 function feed(){
  if(!SB.live||SB.cur<0||!SB.k||!SB.ok)return;
  const t=SB.t[SB.cur],tr=SB.k.track,C=SB.C,end=SB.safe||0; /* cues before the cluster being read are complete */
  for(;SB.n<end;SB.n++){const c=C[SB.n];if(c.n!==t.n)continue;
   const x=cueText(t,c);if(!x)continue;
   const s=c.s*SB.sc/1e9+sdel,d=(c.d==null?2000:c.d)*SB.sc/1e9;
   try{tr.addCue(new VTTCue(s,s+Math.max(d,.2),x))}catch{}}}
 function ready(R,live,r){
  const t=R.T.filter(x=>TXT.test(x.c||''));
  if(!t.length){axDiag.sub=R.T.length?'only image-based subtitles (PGS/VobSub), these cannot be shown':'no subtitle tracks in this file';return R.T.length?say('Subtitles in this file are image-based (PGS/VobSub) and cannot be shown',6000):0}
  axDiag.sub='found '+t.length+' text subtitle track(s)'+(live?'; cues are read once you pick one':'');
  SB={t,cur:-1,C:R.C,sc:R.sc,live:!!live,r,want:0,n:0,k:null,done:0,safe:0,iv:live?setInterval(feed,1000):0};
  btn.hidden=false;$('#scur').textContent='Off · '+t.length+' tracks';
  say('Subtitles found: '+t.map(lab).join(', ')+'. Tap CC to choose',6000)}
 /* reads cues around the playhead (starting at the nearest cluster from the Cues index), never more than ~2 min ahead of it;
    seeking or falling behind restarts the reading at the new position; nothing is read until a subtitle track is chosen */
 const AHEAD=120;
 async function follow(my,R,head,idx,D){
  const seen=new Set(),jump=!!(idx&&idx.length);let run=null,fails=0,lastMsg=0;
  const posAt=t=>{if(!jump)return head.first;let a=head.first;const s=Math.max(0,t-4);
   for(const[c,q]of idx){if(c*head.sc/1e9<=s)a=head.segStart+q;else break}return a};
  const start=t=>{
   const r={stop:0,t0:t,t1:t,began:0,done:0,err:null};
   r.p=mkv(R.file,()=>my===tok&&!r.stop,null,null,async tt=>{
    if(!r.began){r.began=1;r.t0=tt}
    r.t1=Math.max(r.t1,tt);if(my===tok)SB.safe=head.C.length;
    while(my===tok&&!r.stop&&tt>v.currentTime+AHEAD)await nap(500)},3<<20,{p:posAt(t),T:head.T,sc:head.sc,C:head.C,seen})
    .then(()=>{r.done=1;if(my===tok)SB.safe=head.C.length}).catch(e=>{r.done=1;r.err=e});
   return r};
  while(my===tok){
   await nap(600);if(my!==tok)return;
   if(!SB.want)continue;
   const now=v.currentTime;
   if(!run){run=start(now);continue}
   if(run.done){
    if(run.err){if(++fails>3)return D('stopped: '+((run.err&&run.err.message)||run.err));D('retrying after: '+((run.err&&run.err.message)||run.err));run=start(now);continue}
    if(jump&&now<run.t0-1){run=start(now);continue}
   }else if(jump&&(run.began?(now<run.t0-1||now>run.t1+8):Math.abs(now-run.t0)>10)){run.stop=1;run=start(now);continue}
   const lead=run.t1-now;
   if(run.began&&lead>10&&!SB.said){SB.said=1;say('Subtitles ready (loaded up to '+fmt(run.t1)+')',3000)}
   if(!run.began&&!SB.warned&&Date.now()-SB.t0>20000){SB.warned=1;say('Subtitles: this link answers slowly…',4000)}
   if(!jump&&run.began&&lead<5&&!run.done&&Date.now()-lastMsg>3000){lastMsg=Date.now();say('Reading subtitles… '+fmt(run.t1)+' of '+fmt(now),2000)}
   axDiag.sub='reading '+(run.began?fmt(run.t0)+' to '+fmt(run.t1):'(waiting for the link)')+', '+head.C.length+' cues so far'}}
 async function scanLink(my,L){
  const url=curUrl,D=m=>{axDiag.sub=m;L(m)};let on=true;try{on=JSON.parse(localStorage.axionSub).lk!==false}catch{}
  if(!on)return D('skipped: "Read subtitles inside links" is off (Settings > Subtitles)');
  if(weak())return D('skipped (data saver is on, 2G connection, or repeated buffering)');
  if(hls||dash||st.classList.contains('web'))return D('skipped: HLS / DASH / web page');
  if(NOSCAN.test(url))return D('skipped: the address looks like MP4 / audio (embedded subtitles work for MKV / WebM only)');
  D('waiting to read the link…');await nap(2500);if(my!==tok)return;
  const R=remote(url);SB.r=R;
  try{
   const ok=await R.open();if(my!==tok)return;
   if(!ok)return D('cannot read the link ('+R.why.join(' | ')+')');
   const h=new Uint8Array(await R.file.slice(0,4).arrayBuffer());
   if(h[0]!==0x1A||h[1]!==0x45||h[2]!==0xDF||h[3]!==0xA3)return D('not MKV / WebM (file starts with '+[...h].map(x=>x.toString(16).padStart(2,'0')).join(' ')+'); embedded subtitles work for MKV / WebM only');
   let head=null;
   const res=await mkv(R.file,()=>my===tok&&!head,null,p=>{head=p},null,3<<20); /* only reads up to the first cluster */
   if(my!==tok)return;
   if(!head)return ready(res);
   let idx=null;try{idx=await cueIndex(R.file,head.segStart,head.cuesPos)}catch{}
   if(my!==tok)return;
   ready(head,true,R);
   D('MKV ok: '+head.T.length+' subtitle track(s); '+(idx?'jump index with '+idx.length+' points':'no index in this file (subtitles are read from the start)'));
   await follow(my,R,head,idx,D)
  }catch(e){if(my===tok)D('stopped: '+((e&&e.message)||e))}}
 async function scan(){
  const my=++tok,F=pl[pi],L=(...a)=>console.log('[Axion subs]',...a);
  L('media.js v3 | file:',F&&F.name,'|',F&&F.type,'|',/^blob:/.test(curUrl)?'device file':'link');
  if(!/^blob:/.test(curUrl)||!F)return /^https?:/.test(curUrl)?scanLink(my,L):L('skipped: not a device file or link');
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
const D={on:true,lk:true,f:'sans',sz:100,b:false,col:'#ffffff',pos:7,w:80,lift:true,bg:55,ol:'outline'},
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
  T('on','Show subtitles','Key: C')+T('lk','Read subtitles inside links','Uses extra data while watching')+
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

/* ---- Settings > General > "Check this link": shows why audio tracks / subtitles of a link do or do not appear (and copies the text) ---- */
(()=>{
function init(){
 const pane=document.querySelector('#set .pane[data-p="g"]');if(!pane)return;
 const row=document.createElement('div');row.className='it';
 row.innerHTML='<span>Check this link<small id="axlk" style="white-space:pre-line">Play a link, then tap Check</small></span><button id="axlb">Check</button>';
 pane.append(row);
 const kind=n=>!n||n.length<4?'empty answer':n[0]===0x1A&&n[1]===0x45&&n[2]===0xDF&&n[3]===0xA3?'MKV/WebM':String.fromCharCode(...n.slice(4,8))==='ftyp'?'MP4/M4A':String.fromCharCode(...n.slice(0,3))==='ID3'?'MP3':String.fromCharCode(...n.slice(0,4))==='OggS'?'Ogg':'other ('+[...n.slice(0,4)].map(x=>x.toString(16).padStart(2,'0')).join(' ')+')';
 async function get(u){
  try{const c=new AbortController(),t=setTimeout(()=>c.abort(),15000);
   const r=await fetch(u,{headers:{Range:'bytes=0-15'},signal:c.signal});clearTimeout(t);
   let n=new Uint8Array(0);if(r.body){const rd=r.body.getReader(),x=await rd.read();rd.cancel().catch(()=>0);if(x.value)n=x.value.slice(0,16)} /* never downloads more than the first chunk */
   return{s:r.status,cr:r.headers.get('content-range'),n}}
  catch(e){return{err:e&&e.name==='TypeError'?'blocked or unreachable (CORS?)':e&&e.name==='AbortError'?'timeout':(e&&e.message)||'error'}}}
 const fmt=r=>r.err?'FAILED, '+r.err:'HTTP '+r.s+(r.cr?', '+r.cr:', no Content-Range')+', '+kind(r.n)+(r.s===200?' (Range ignored!)':'');
 async function check(){
  const url=typeof curUrl==='string'?curUrl:'';
  if(!/^https?:/.test(url))return'Play a link first, then tap Check';
  let host='';try{host=new URL(url).host+' …'+(url.split('?')[0].match(/\.[a-z0-9]{2,5}$/i)||[''])[0]}catch{}
  const d=await get(url),p=await get(location.origin+'/api/proxy?u='+encodeURIComponent(url)),good=r=>!r.err&&r.s===206&&r.cr,k=good(d)?kind(d.n):good(p)?kind(p.n):'';
  let hint;
  if(k==='MKV/WebM')hint='OK: this link can be read. Audio tracks and subtitles should work.';
  else if(k)hint='The link can be read (looks like '+k+'): audio tracks work, but embedded subtitles only work for MKV/WebM.';
  else if(!p.err&&p.s===404)hint='/api/proxy is not deployed on this host (404), and the site blocks direct reading (CORS). Deploy the proxy function.';
  else if(!p.err&&p.s===403)hint='/api/proxy refused the request (403).';
  else if(!p.err&&p.s===400)hint='/api/proxy rejected the address (bad or private link).';
  else if(!p.err&&(p.s===502||p.s===200))hint='The site does not support Range requests, so tracks cannot be read.';
  else hint='Neither direct reading nor /api/proxy works for this link (the site may need cookies or a referer).';
  const c=navigator.connection||{};
  return['Link: '+host,'Direct: '+fmt(d),'Proxy: '+fmt(p),'Result: '+hint,'Audio tracks: '+(axDiag.aud||'not checked yet'),'Subtitles: '+(axDiag.sub||'not checked yet'),
   'Network: '+(c.effectiveType||'?')+', data saver '+(c.saveData?'ON':'off')+', stalls '+(typeof stalls==='number'?stalls:'?'),axDiag.ver||'media.js: old version'].join('\n')}
 $('#axlb').onclick=async()=>{const e=$('#axlk');e.textContent='Checking…';const t=await check();e.textContent=t;try{await navigator.clipboard.writeText(t);say('Result copied')}catch{}};
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();