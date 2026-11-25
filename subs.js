/* Axion subs.js: opens every common subtitle format. Everything is converted to WebVTT, which the player already shows. */
(()=>{
const z=(n,l)=>String(n).padStart(l,'0'),
 ts=m=>{m=Math.max(0,Math.round(m));return z(~~(m/36e5),2)+':'+z(~~(m%36e5/6e4),2)+':'+z(~~(m%6e4/1e3),2)+'.'+z(m%1e3,3)},
 tm=(h,m,s,f)=>((+h*60+ +m)*60+ +s)*1000+ +String(f||0).padEnd(3,'0').slice(0,3),
 EXT=/\.(srt|vtt|ass|ssa|sub|smi|sami|sbv|ttml|dfxp|xml|lrc|txt)$/i,
 COL=new Set(),
 NAMED={red:'ff0000',yellow:'ffff00',white:'ffffff',cyan:'00ffff',aqua:'00ffff',lime:'00ff00',green:'008000',blue:'0000ff',magenta:'ff00ff',fuchsia:'ff00ff',orange:'ffa500',pink:'ffc0cb',gray:'808080',grey:'808080',black:'000000'},
 ENT={'&nbsp;':' ','&lt;':'<','&gt;':'>','&amp;':'&','&quot;':'"','&#39;':"'",'&apos;':"'"};

/* ---- text encoding: UTF-8, UTF-16, and a guess between Windows-1252 / 1251 (Cyrillic) / 1256 (Arabic) ---- */
const clean=s=>String(s||'').replace(/\r\n?/g,'\n').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFEFF\uFFFD]/g,'');
function decode(buf){
 const u=new Uint8Array(buf);
 if(u[0]===0xFF&&u[1]===0xFE)return clean(new TextDecoder('utf-16le').decode(u.subarray(2)));
 if(u[0]===0xFE&&u[1]===0xFF)return clean(new TextDecoder('utf-16be').decode(u.subarray(2)));
 try{return clean(new TextDecoder('utf-8',{fatal:true}).decode(u))}catch{}
 let hi=0,ar=0,cy=0;const d=new Set();
 for(let i=0;i<u.length;i++){const b=u[i];if(b>127){hi++;d.add(b);if(b===0xC7||b===0xE1||b===0xE4||b===0xE3||b===0xCA||b===0xCF)ar++;if(b>=0xE0)cy++}}
 const enc=hi&&ar/hi>.25?'windows-1256':hi&&d.size>=18&&cy/hi>.55?'windows-1251':'windows-1252';
 return clean(new TextDecoder(enc).decode(u))}

/* ---- markup helpers ---- */
function col(x){x=(x||'').trim().toLowerCase();x=NAMED[x]||x.replace(/^#/,'');if(/^[0-9a-f]{3}$/.test(x))x=x.replace(/./g,'$&$&');if(!/^[0-9a-f]{6}$/.test(x))return'x';COL.add(x);return'c'+x}
function mk(t){ /* html-ish text -> WebVTT-safe text */
 return t.replace(/\{\\[^}]*\}/g,'').split(/(<[^>]*>)/).map(p=>{
  if(p[0]==='<'&&p[p.length-1]==='>'){
   const m=/^<\s*(\/?)\s*([a-zA-Z]+)([^>]*)>$/.exec(p);if(!m)return'';
   const c=m[1],n=m[2].toLowerCase();
   if(n==='br')return'\n';
   if(n==='b'||n==='i'||n==='u')return'<'+c+n+'>';
   if(n==='font'){if(c)return'</c>';const x=/color\s*=\s*["']?(#?[0-9a-zA-Z]+)/i.exec(m[3]);return'<c.'+(x?col(x[1]):'x')+'>'}
   return''}
  return p.replace(/&(nbsp|lt|gt|amp|quot|#39|apos);/g,m=>ENT[m]).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}).join('')}

/* ---- parsers: every one returns [{s,e,t}] in milliseconds ---- */
function srt(t){const o=[];
 for(const b of t.replace(/\r/g,'').split(/\n{2,}/)){
  const L=b.split('\n'),i=L.findIndex(l=>/-->/.test(l));if(i<0)continue;
  const m=/(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)/.exec(L[i]);if(!m)continue;
  const x=mk(L.slice(i+1).join('\n')).trim();if(x)o.push({s:tm(m[1],m[2],m[3],m[4]),e:tm(m[5],m[6],m[7],m[8]),t:x})}
 return o}

const ac=c=>{const x=(c||'').replace(/[&Hh]/g,'').replace(/^0x/i,'').padStart(6,'0').slice(-6).toLowerCase();return x.slice(4,6)+x.slice(2,4)+x.slice(0,2)}; /* &HBBGGRR -> rrggbb */
function assText(x,st){ /* one ASS line: bold / italic / underline / colour overrides; drawings are skipped */
 x=clean(x);st=st||{};let b=!!st.b,i=!!st.i,u=!!st.u,c=st.c,p=0,out='';
 for(const q of x.split(/(\{[^}]*\})/)){
  if(q[0]==='{'&&q[q.length-1]==='}'){
   for(const m of q.matchAll(/\\(b|i|u|p)(\d*)(?![a-z])|\\(?:1c|c)(&H[0-9a-fA-F]+&?)|\\r/g)){
    if(m[1]==='b')b=m[2]!=='0';else if(m[1]==='i')i=m[2]==='1';else if(m[1]==='u')u=m[2]==='1';else if(m[1]==='p')p=+m[2]||0;
    else if(m[3])c=ac(m[3]);else{b=!!st.b;i=!!st.i;u=!!st.u;c=st.c}}
   continue}
  if(p>0)continue;
  let s=q.replace(/\\N/gi,'\n').replace(/\\h/g,' ').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  if(!s)continue;
  if(c&&c!=='ffffff'){COL.add(c);s='<c.c'+c+'>'+s+'</c>'}
  if(u)s='<u>'+s+'</u>';if(i)s='<i>'+s+'</i>';if(b)s='<b>'+s+'</b>';out+=s}
 return out.replace(/\n{2,}/g,'\n').trim()}
const sp=(s,n)=>{const a=[];let i=0;for(let k=0;k<n-1;k++){const j=s.indexOf(',',i);if(j<0)break;a.push(s.slice(i,j));i=j+1}a.push(s.slice(i));return a};
function ass(t){
 const ST={},o=[];let sec='',fs=null,fe=null;
 for(let l of t.replace(/\r/g,'').split('\n')){
  l=l.trim();const h=/^\[(.+)\]$/.exec(l);if(h){sec=h[1].toLowerCase();continue}
  const k=l.indexOf(':');if(k<0)continue;const key=l.slice(0,k).toLowerCase(),val=l.slice(k+1).trim();
  if(/styles/.test(sec)){
   if(key==='format')fs=val.split(',').map(x=>x.trim().toLowerCase());
   else if(key==='style'&&fs){const a=val.split(','),g=n=>a[fs.indexOf(n)];
    ST[g('name')]={c:ac(g('primarycolour')),b:/^-?[1-9]/.test(g('bold')||'0'),i:/^-?[1-9]/.test(g('italic')||'0'),u:/^-?[1-9]/.test(g('underline')||'0')}}}
  else if(sec==='events'){
   if(key==='format')fe=val.split(',').map(x=>x.trim().toLowerCase());
   else if(key==='dialogue'&&fe){
    const a=sp(val,fe.length),g=n=>a[fe.indexOf(n)],m1=/(\d+):(\d+):(\d+)[.:](\d+)/.exec(g('start')||''),m2=/(\d+):(\d+):(\d+)[.:](\d+)/.exec(g('end')||'');
    if(!m1||!m2)continue;
    const x=assText(g('text')||'',ST[(g('style')||'').replace(/^\*/,'')]);if(x)o.push({s:tm(m1[1],m1[2],m1[3],m1[4]),e:tm(m2[1],m2[2],m2[3],m2[4]),t:x})}}}
 return o.sort((a,b)=>a.s-b.s)}

function mdvd(t,fps){fps=fps||23.976;const o=[];
 for(const l of t.replace(/\r/g,'').split('\n')){
  const m=/^\{(\d+)\}\{(\d+)\}(.*)$/.exec(l);if(!m)continue;
  if(m[1]==='1'&&m[2]==='1'&&/^[\d.]+$/.test(m[3].trim())){fps=parseFloat(m[3])||fps;continue}
  const x=mk(m[3].replace(/\{[yY]:i\}/g,'<i>').replace(/\{[yY]:b\}/g,'<b>').replace(/\{[^}]*\}/g,'').replace(/\|/g,'\n')).trim();
  if(x)o.push({s:m[1]/fps*1000,e:m[2]/fps*1000,t:x})}
 return o}

function sami(t){
 const by={};
 for(const p of t.split(/<sync/i).slice(1)){
  const st=/start\s*=\s*["']?(\d+)/i.exec(p),pm=/<p([^>]*)>([\s\S]*)/i.exec(p);if(!st||!pm)continue;
  const cls=(/class\s*=\s*["']?([\w-]+)/i.exec(pm[1])||[0,'x'])[1];
  const x=mk(pm[2].replace(/<\/?(sync|body|sami)[^>]*>/gi,'').replace(/[\r\n]+/g,' ').replace(/<br\s*\/?>/gi,'\n')).replace(/\s+\n\s+/g,'\n').trim();
  (by[cls]=by[cls]||[]).push({s:+st[1],x})}
 let best=[],bn=-1;
 for(const k in by){const n=by[k].filter(c=>c.x).length;if(n>bn){bn=n;best=by[k]}}
 best.sort((a,b)=>a.s-b.s);
 return best.map((c,i)=>c.x&&{s:c.s,e:best[i+1]?best[i+1].s:c.s+4000,t:c.x}).filter(Boolean)}

function sbv(t){return t.replace(/\r/g,'').split(/\n{2,}/).map(b=>{
 const L=b.trim().split('\n'),m=/(\d+):(\d+):(\d+)\.(\d+),(\d+):(\d+):(\d+)\.(\d+)/.exec(L[0]);if(!m)return null;
 const x=mk(L.slice(1).join('\n')).trim();return x&&{s:tm(m[1],m[2],m[3],m[4]),e:tm(m[5],m[6],m[7],m[8]),t:x}}).filter(Boolean)}

function ttml(t){
 const d=new DOMParser().parseFromString(t,'text/xml');if(d.querySelector('parsererror'))return[];
 const root=d.documentElement,rate=+(root.getAttribute('ttp:tickRate')||10000000),fr=+(root.getAttribute('ttp:frameRate')||30);
 const T=v=>{if(v==null)return null;v=v.trim();let m=/^(\d+):(\d+):(\d+)(?:[.,](\d+)|:(\d+))?$/.exec(v);
  if(m)return tm(m[1],m[2],m[3],m[4])+(m[5]?+m[5]/fr*1000:0);
  m=/^([\d.]+)(h|ms|m|s|f|t)$/.exec(v);if(!m)return null;const n=+m[1];
  return{h:n*36e5,m:n*6e4,s:n*1e3,ms:n,f:n/fr*1e3,t:n/rate*1e3}[m[2]]};
 const A=(e,n)=>e.getAttribute('tts:'+n)||e.getAttribute(n)||'';
 const walk=(n,inh)=>{let s='';for(const c of n.childNodes){
  if(c.nodeType===3)s+=c.nodeValue.replace(/\s+/g,' ').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  else if(c.nodeType===1){const nm=c.localName.toLowerCase();
   if(nm==='br'){s+='\n';continue}
   let x=walk(c);if(!x)continue;
   const color=A(c,'color');if(color)x='<c.'+col(color)+'>'+x+'</c>';
   if(/italic/.test(A(c,'fontStyle')))x='<i>'+x+'</i>';if(/bold/.test(A(c,'fontWeight')))x='<b>'+x+'</b>';if(/underline/.test(A(c,'textDecoration')))x='<u>'+x+'</u>';
   s+=x}}return s};
 const o=[];
 for(const p of d.getElementsByTagName('p')){
  const b=T(p.getAttribute('begin')),e=T(p.getAttribute('end')),du=T(p.getAttribute('dur'));
  if(b==null)continue;const x=walk(p).replace(/[ \t]*\n[ \t]*/g,'\n').trim();if(x)o.push({s:b,e:e!=null?e:b+(du||3000),t:x})}
 return o.sort((a,b)=>a.s-b.s)}

function lrc(t){
 const a=[];let off=0;
 for(const l of t.replace(/\r/g,'').split('\n')){
  const f=/^\[offset:\s*(-?\d+)\]/i.exec(l);if(f){off=+f[1];continue}
  const ts_=[...l.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];if(!ts_.length)continue;
  const x=mk(l.replace(/\[[^\]]*\]/g,'')).trim();
  for(const m of ts_)a.push({s:(+m[1]*60+ +m[2])*1000-off,t:x})}
 a.sort((p,q)=>p.s-q.s);
 return a.map((c,i)=>c.t&&{s:Math.max(0,c.s),e:a[i+1]?Math.max(c.s+300,a[i+1].s):c.s+5000,t:c.t}).filter(Boolean)}

/* ---- detection by content, not by extension ---- */
function detect(t){
 if(/^\s*WEBVTT/.test(t))return'vtt';
 if(/\[script info\]|^\s*\[events\]|^dialogue:/im.test(t))return'ass';
 if(/<sami/i.test(t)||/<sync\s/i.test(t))return'sami';
 if(/<tt[\s>]/.test(t)&&/<p[\s>]/.test(t))return'ttml';
 if(/^\{\d+\}\{\d+\}/m.test(t))return'mdvd';
 if(/^\d+:\d\d:\d\d\.\d+,\d+:\d\d:\d\d\.\d+/m.test(t))return'sbv';
 if(/-->/.test(t))return'srt';
 if(/^\[\d+:\d\d(\.\d+)?\]/m.test(t))return'lrc';
 return''}
const P={srt,ass,mdvd,sami,sbv,ttml,lrc};
function colorCss(){let s=document.getElementById('axsubcol');if(!s){s=document.createElement('style');s.id='axsubcol';document.head.append(s)}
 s.textContent=[...COL].map(h=>'#sov .c'+h+'{color:#'+h+'}').join('')}
function toVtt(text,name,o){
 text=clean(text);
 const f=detect(text);if(!f)return{vtt:'',fmt:'',n:0};
 if(f==='vtt')return{vtt:text,fmt:'vtt',n:(text.match(/-->/g)||[]).length};
 const c=P[f](text,o&&o.fps).filter(x=>x.t&&isFinite(x.s)&&isFinite(x.e));
 if(typeof document!=='undefined'&&COL.size)colorCss();
 return{vtt:'WEBVTT\n\n'+c.map(x=>ts(x.s)+' --> '+ts(Math.max(x.e,x.s+200))+'\n'+x.t+'\n\n').join(''),fmt:f,n:c.length}}

/* ---- zip (subtitle files are often downloaded as .zip) ---- */
async function unzip(buf){
 const dv=new DataView(buf),u=new Uint8Array(buf);let e=-1;
 for(let i=buf.byteLength-22;i>=Math.max(0,buf.byteLength-66000);i--)if(dv.getUint32(i,true)===0x06054b50){e=i;break}
 if(e<0)return[];
 const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out=[];
 for(let k=0;k<n;k++){
  if(dv.getUint32(p,true)!==0x02014b50)break;
  const meth=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true),
   name=new TextDecoder().decode(u.subarray(p+46,p+46+nl));
  p+=46+nl+el+cl;if(!EXT.test(name))continue;
  const ds=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true),raw=u.subarray(ds,ds+cs);
  let data=raw;
  if(meth===8)data=new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
  else if(meth!==0)continue;
  out.push({name,data:data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength)})}
 return out}

async function convertFile(f){
 let name=f.name,buf=await f.arrayBuffer(),u=new Uint8Array(buf),zipped=0;
 if(u[0]===0x50&&u[1]===0x4B){
  const zs=await unzip(buf);if(!zs.length)throw new Error('no subtitle file found inside the zip');
  const vn=((typeof pl!=='undefined'&&pl[pi]&&pl[pi].name)||'').replace(/\.[^.]+$/,'').toLowerCase();
  const sc=n=>{n=n.toLowerCase();return(vn&&n.includes(vn)?100:0)+(/(^|[^a-z])(en|eng|english)([^a-z]|$)/.test(n)?10:0)-n.length/100};
  zs.sort((a,b)=>sc(b.name)-sc(a.name));name=zs[0].name;buf=zs[0].data;u=new Uint8Array(buf);zipped=zs.length}
 if(u[0]===0x50&&u[1]===0x47)throw new Error('PGS (picture) subtitles are not supported yet');
 if(u[0]===0&&u[1]===0&&u[2]===1&&u[3]===0xBA)throw new Error('VobSub (picture) subtitles are not supported yet');
 const r=toVtt(decode(buf),name);
 if(!r.n)throw new Error('could not read this subtitle format');
 return{...r,name,zipped}}

window.axSubs={decode,detect,toVtt,assText,convertFile,unzip};

function init(){
 const inp=document.getElementById('sub');if(!inp)return;
 const sb=document.getElementById('subb'),sm=sb&&sb.closest('.it')&&sb.closest('.it').querySelector('small');if(sm)sm.textContent='SRT, ASS, VTT, SMI, SUB, LRC… or a .zip';
 const stg=document.getElementById('stage');
 stg&&stg.addEventListener('drop',e=>{ /* a subtitle file dropped on the player */
  const fl=[...((e.dataTransfer&&e.dataTransfer.files)||[])];
  if(!fl.length||typeof pl==='undefined'||!pl.length||!fl.every(f=>EXT.test(f.name)))return;
  e.preventDefault();e.stopImmediatePropagation();const dt=new DataTransfer();dt.items.add(fl[0]);inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}))},true);
 inp.accept='.srt,.vtt,.ass,.ssa,.sub,.smi,.sami,.sbv,.ttml,.dfxp,.xml,.lrc,.txt,.zip,text/*,application/zip';
 inp.addEventListener('change',async e=>{
  if(inp._ax){inp._ax=false;return}
  const f=inp.files&&inp.files[0];if(!f)return;
  e.stopImmediatePropagation();
  try{
   const r=await convertFile(f),base=r.name.replace(/\.[^.]+$/,'');
   const dt=new DataTransfer();dt.items.add(new File([r.vtt],base+'.vtt',{type:'text/vtt'}));
   inp.files=dt.files;inp._ax=true;inp.dispatchEvent(new Event('change',{bubbles:true}));
   say(r.fmt.toUpperCase()+' subtitles: '+r.n+' lines'+(r.zipped>1?' (from zip, '+r.zipped+' files)':''),3500)
  }catch(err){say('Subtitles: '+err.message,6000)}},true)}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();