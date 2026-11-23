/* Axion audioviz.js: animated vinyl + equalizer inside the player for audio files (cover art and title are read from the file) */
(()=>{
const AUD=/\.(mp3|m4a|aac|flac|wav|ogg|oga|opus|wma|mka)$/i,N=32,AL=/\.(mp3|m4a|aac|flac|wav|ogg|oga|opus|wma|mka)(\?|#|&|$)/i,VL=/\.(mp4|m4v|webm|mkv|mov|avi|ts|3gp|mpg|mpeg|wmv|flv|ogv|m3u8|mpd)(\?|#|&|$)/i,u8=b=>new Uint8Array(b),
 syn=(a,i)=>(a[i]&127)<<21|(a[i+1]&127)<<14|(a[i+2]&127)<<7|(a[i+3]&127),
 dec=(a,e)=>new TextDecoder(e===1?'utf-16':e===2?'utf-16be':e===3?'utf-8':'latin1').decode(a),
 S=(a,i,j)=>String.fromCharCode(...a.subarray(i,j)),
 /* title / artist from the song tags is shown only when it is plain English or Hindi text; Chinese, Korean, Arabic, Cyrillic, garbled text etc. is skipped and the file name stays */
 plain=s=>!!s&&/^[\u0020-\u007E\u0900-\u097F\u2010-\u2027\s]+$/.test(s)&&/[A-Za-z0-9\u0900-\u097F]/.test(s);

/* ---- tags: MP3 (ID3v2), M4A/MP4, FLAC ---- */
async function id3(F){
 const h=u8(await F.slice(0,10).arrayBuffer());
 if(h[0]!==73||h[1]!==68||h[2]!==51)return null;
 const ver=h[3],a=u8(await F.slice(0,Math.min(syn(h,6)+10,12<<20)).arrayBuffer()),r={},L=ver===2?3:4;
 let p=10;
 if(h[5]&0x40)p+=ver===4?syn(a,10):(a[10]<<24|a[11]<<16|a[12]<<8|a[13])+4;
 while(p+L+(ver===2?3:6)<=a.length){
  const id=S(a,p,p+L);if(!/^[A-Z0-9]+$/.test(id))break;
  const n=ver===2?(a[p+3]<<16|a[p+4]<<8|a[p+5]):ver===4?syn(a,p+4):(a[p+4]*16777216+(a[p+5]<<16)+(a[p+6]<<8)+a[p+7]),
   d=p+(ver===2?6:10),f=a.subarray(d,d+n);p=d+n;if(!n)continue;
  const k=id==='TIT2'||id==='TT2'?'title':id==='TPE1'||id==='TP1'?'artist':0;
  if(k&&!r[k])r[k]=dec(f.subarray(1),f[0]).split('\0')[0];
  else if((id==='APIC'||id==='PIC')&&!r.art){
   const e=f[0];let i=1,mime='image/jpeg';
   if(id==='PIC'){mime='image/'+S(f,1,4).toLowerCase().replace('jpg','jpeg');i=4}
   else{let j=i;while(j<f.length&&f[j])j++;mime=S(f,i,j)||mime;i=j+1}
   i++;
   if(e===1||e===2){while(i+1<f.length&&(f[i]||f[i+1]))i+=2;i+=2}else{while(i<f.length&&f[i])i++;i++}
   r.art=new Blob([f.subarray(i)],{type:mime.includes('/')?mime:'image/jpeg'})}}
 return r}
async function mp4(F){
 let p=0;
 while(p<F.size){
  const h=u8(await F.slice(p,p+16).arrayBuffer()),dv=new DataView(h.buffer);
  let sz=dv.getUint32(0),hs=8;const t=S(h,4,8);
  if(sz===1){sz=dv.getUint32(8)*4294967296+dv.getUint32(12);hs=16}else if(sz===0)sz=F.size-p;
  if(sz<8)return null;
  if(t==='moov'){
   if(sz>32<<20)return null;
   const m=u8(await F.slice(p+hs,p+sz).arrayBuffer()),d=new DataView(m.buffer),r={};
   const walk=(s,e)=>{while(s+8<=e){
    const z=d.getUint32(s),t2=S(m,s+4,s+8);if(z<8)break;const end=Math.min(e,s+z);
    if(t2==='udta'||t2==='ilst')walk(s+8,end);else if(t2==='meta')walk(s+12,end);
    else if(t2==='\u00a9nam'||t2==='\u00a9ART'||t2==='covr'){
     const ds=s+8,dz=d.getUint32(ds),x=m.subarray(ds+16,ds+dz);
     if(t2==='covr')r.art=new Blob([x],{type:x[0]===0x89?'image/png':'image/jpeg'});else r[t2==='\u00a9nam'?'title':'artist']=new TextDecoder().decode(x)}
    s=end}};
   walk(0,m.length);return r}
  p+=sz}
 return null}
async function flac(F){
 if(S(u8(await F.slice(0,4).arrayBuffer()),0,4)!=='fLaC')return null;
 let p=4;const r={};
 for(;;){
  const b=u8(await F.slice(p,p+4).arrayBuffer()),last=b[0]&128,t=b[0]&127,n=b[1]<<16|b[2]<<8|b[3];
  if(t===4||t===6){
   const dd=u8(await F.slice(p+4,p+4+Math.min(n,12<<20)).arrayBuffer()),dv=new DataView(dd.buffer);
   if(t===4){let i=4+dv.getUint32(0,true);const c=dv.getUint32(i,true);i+=4;
    for(let k=0;k<c&&i+4<=dd.length;k++){const l=dv.getUint32(i,true),m=/^(TITLE|ARTIST)=(.*)$/i.exec(new TextDecoder().decode(dd.subarray(i+4,i+4+l)));i+=4+l;if(m)r[m[1].toLowerCase()]=m[2]}}
   else{let i=4;const ml=dv.getUint32(i);i+=4;const mime=S(dd,i,i+ml);i+=ml;const dl=dv.getUint32(i);i+=4+dl+16;const n2=dv.getUint32(i);i+=4;
    r.art=new Blob([dd.subarray(i,i+n2)],{type:mime||'image/jpeg'})}}
  p+=4+n;if(last||p>=F.size)break}
 return r}
async function tags(F){
 try{
  const h=u8(await F.slice(0,12).arrayBuffer());
  if(h[0]===73&&h[1]===68&&h[2]===51)return await id3(F)||{};
  if(S(h,4,8)==='ftyp')return await mp4(F)||{};
  if(S(h,0,4)==='fLaC')return await flac(F)||{};
 }catch{}
 return{}}
window.axTags=tags;

function init(){
 const st=document.getElementById('stage');if(!st)return;
 const RM=matchMedia('(prefers-reduced-motion:reduce)');
 document.head.insertAdjacentHTML('beforeend','<style>'+[
  '#aviz{position:absolute;inset:0;z-index:0;display:grid;place-items:center;overflow:hidden;pointer-events:none;background:radial-gradient(circle at 50% 40%,color-mix(in srgb,var(--ac) 32%,transparent),transparent 64%),linear-gradient(180deg,#10131f,#07080d);transition:padding .2s}',
  '#aviz[hidden]{display:none}#stage:not(.idle) #aviz{padding-bottom:var(--cb,74px)}',
  '#aviz .in{display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*2);width:100%}',
  '#aviz .disc{width:calc(var(--u)*44);height:calc(var(--u)*44);filter:drop-shadow(0 calc(var(--u)*1.5) calc(var(--u)*3) #000b);animation:avspin 9s linear infinite;animation-play-state:paused}',
  '#aviz.pl .disc{animation-play-state:running}@keyframes avspin{to{transform:rotate(360deg)}}',
  '#aviz .t{text-align:center;max-width:82%;color:#fff}#aviz .t b{display:block;font-size:calc(var(--u)*4);font-weight:600;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
  '#aviz .t small{display:block;font-size:calc(var(--u)*3);opacity:.68;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
  '#aviz .eq{width:calc(var(--u)*80);max-width:80%;height:calc(var(--u)*8)}#aviz .eq rect{fill:var(--ac)}',
  '@media(prefers-reduced-motion:reduce){#aviz .disc{animation:none}}'].join('')+'</style>');
 let bars='';for(let i=0;i<N;i++)bars+='<rect x="'+(i*10+1)+'" y="60" width="7" height="4" rx="3.5"/>';
 const box=document.createElement('div');box.id='aviz';box.hidden=true;
 box.innerHTML='<div class="in"><svg class="disc" viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="avg"><stop offset="0" stop-color="#2b2c36"/><stop offset="1" stop-color="#0b0b10"/></radialGradient><clipPath id="avc"><circle cx="100" cy="100" r="47"/></clipPath></defs>'+
  '<circle cx="100" cy="100" r="97" fill="url(#avg)"/><g fill="none" stroke="#fff" stroke-opacity=".07"><circle cx="100" cy="100" r="90"/><circle cx="100" cy="100" r="82"/><circle cx="100" cy="100" r="74"/><circle cx="100" cy="100" r="66"/><circle cx="100" cy="100" r="58"/></g>'+
  '<path d="M100 100 L100 3 A97 97 0 0 1 184 52Z" fill="#fff" fill-opacity=".05"/><path d="M100 100 L100 197 A97 97 0 0 1 16 148Z" fill="#fff" fill-opacity=".05"/>'+
  '<circle cx="100" cy="100" r="47" fill="var(--ac)"/><path id="avn" d="M92 120V84l26-6v34" fill="none" stroke="#171000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/><circle cx="86" cy="121" r="6.5" fill="#171000" opacity=".55"/><circle cx="112" cy="113" r="6.5" fill="#171000" opacity=".55"/>'+
  '<image id="ava" x="53" y="53" width="94" height="94" clip-path="url(#avc)" preserveAspectRatio="xMidYMid slice" visibility="hidden"/><circle cx="100" cy="100" r="5.5" fill="#0b0e19"/></svg>'+
  '<div class="t"><b id="avt"></b><small id="avs"></small></div><svg class="eq" viewBox="0 0 320 64" preserveAspectRatio="none" aria-hidden="true">'+bars+'</svg></div>';
 st.insertBefore(box,v.nextSibling);
 const rects=[...box.querySelectorAll('.eq rect')],img=box.querySelector('#ava'),note=box.querySelector('#avn');
 const size=()=>box.style.setProperty('--u',Math.max(1,Math.min(st.clientWidth*.9,st.clientHeight))/100+'px');
 new ResizeObserver(size).observe(st);size();

 let raf=0,an=null,data=null,quiet=0,last=0,artUrl='',tok=0;
 function tap(){ /* real music data: only for files opened from the device (same origin) */
  if(an||!/^blob:/.test(curUrl))return;
  try{
   if(!ac){ac=new AudioContext();gn=ac.createGain();ac.createMediaElementSource(v).connect(gn);gn.connect(ac.destination)}
   an=ac.createAnalyser();an.fftSize=128;an.smoothingTimeConstant=.78;gn.connect(an);data=new Uint8Array(an.frequencyBinCount);
   if(ac.state==='suspended')ac.resume()}catch{an=null}}
 ['pointerdown','keydown','touchend'].forEach(e=>addEventListener(e,()=>{if(typeof ac!=='undefined'&&ac&&ac.state==='suspended')ac.resume()},{passive:true}));
 const draw=(h,i)=>{const x=Math.max(4,Math.min(62,h*62));rects[i].setAttribute('y',64-x);rects[i].setAttribute('height',x)};
 function frame(t){
  raf=requestAnimationFrame(frame);
  if(t-last<33)return;last=t;
  let real=false;
  if(an){an.getByteFrequencyData(data);let s=0;for(let i=0;i<data.length;i++)s+=data[i];quiet=s?0:quiet+1;real=quiet<30}
  for(let i=0;i<N;i++){
   const h=real?data[Math.min(data.length-1,Math.floor(Math.pow(i/N,1.5)*data.length*.8))]/255*1.1
    :.22+.5*(.5+.5*Math.sin(t/240+i*.65))*(.6+.4*Math.sin(t/870+i*1.7));
   draw(h,i)}}
 const go=()=>{if(box.hidden||v.paused||document.hidden||RM.matches||raf)return;tap();raf=requestAnimationFrame(frame)};
 const halt=()=>{cancelAnimationFrame(raf);raf=0;box.classList.toggle('pl',!v.paused&&!box.hidden)};
 const sync=()=>{box.classList.toggle('pl',!v.paused&&!box.hidden);v.paused?halt():go()};
 ['playing','play'].forEach(n=>v.addEventListener(n,sync));['pause','ended'].forEach(n=>v.addEventListener(n,()=>{halt();for(let i=0;i<N;i++)draw(.08,i)}));
 document.addEventListener('visibilitychange',sync);
 for(let i=0;i<N;i++)draw(.08,i);

 const nameOf=()=>{const F=/^blob:/.test(curUrl)?pl[pi]:null;let n=F?F.name:decodeURIComponent((curUrl||'').split('?')[0].split('/').pop()||'');return n.replace(/\.[^.]+$/,'').replace(/[._]+/g,' ').trim()};
 const hide=()=>{tok++;box.hidden=true;box.classList.remove('pl');halt();if(artUrl){URL.revokeObjectURL(artUrl);artUrl=''}img.setAttribute('visibility','hidden');note.style.display=''};
 v.addEventListener('loadstart',hide);v.addEventListener('emptied',hide);
 v.addEventListener('resize',()=>{if(!box.hidden&&v.videoWidth&&v.videoHeight)hide()}); /* video size arrived late: it is a movie, not music */
 v.addEventListener('loadedmetadata',async()=>{
  /* a link whose address or type says video (mkv, mp4...) is never shown as music, even when this browser cannot decode its video (HEVC) */
  const link=!/^blob:/.test(curUrl),F=link?null:pl[pi],kind=link?(AL.test(curUrl)||/^audio\//.test(lastType)?'a':VL.test(curUrl)||/^video\//.test(lastType)?'v':''):'',
   audio=!v.videoWidth&&!v.videoHeight&&!st.classList.contains('web')&&(link?kind!=='v':(!F||AUD.test(F.name)||/^audio/.test(F.type)||!v.videoWidth));
  if(!audio){if(link&&kind==='v'&&!v.videoWidth&&!v.videoHeight&&!st.classList.contains('web')){const q=++tok;[1200,10500].forEach(ms=>setTimeout(()=>{if(q===tok&&!v.videoWidth&&!v.videoHeight&&v.readyState>0)say('This browser cannot show the video of this movie (often HEVC/x265). Only the sound plays. Try an H.264 link, or Chrome/Edge on a device with HEVC support.',8000)},ms))}return}
  const my=++tok;
  box.querySelector('#avt').textContent=nameOf();box.querySelector('#avs').textContent='';
  box.hidden=false;size();sync();
  if(F&&/^blob:/.test(curUrl)){
   const t=await tags(F);if(my!==tok)return;
   if(plain(t.title))box.querySelector('#avt').textContent=t.title;
   if(plain(t.artist))box.querySelector('#avs').textContent=t.artist;
   if(t.art&&t.art.size){artUrl=URL.createObjectURL(t.art);img.setAttribute('href',artUrl);img.setAttribute('visibility','visible');note.style.display='none'}}});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();