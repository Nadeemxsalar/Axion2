/* Axion library.js v6.7: Classic v5 untouched + clean hover padding & spacing in App Mode */
(()=>{
const VID=/\.(mp4|m4v|mkv|webm|mov|avi|wmv|flv|f4v|ts|m2ts|mts|3gp|3g2|mpg|mpeg|mpe|vob|ogv|ogm|asf|divx|xvid|rm|rmvb|mxf|wtv|mp2v|mpv|m2v|dv|y4m|h264|h265|hevc)$/i,
 AUD=/\.(mp3|m4a|m4b|aac|flac|wav|wave|ogg|oga|opus|wma|mka|weba|aiff|aif|aifc|alac|amr|ape|ac3|eac3|ec3|dts|caf|mp2|mp1|mpa|wv|mpc|spx|tta|dsf|dff|ra|ram|au|snd|mid|midi)$/i,
 SUB=/\.(srt|vtt|ass|ssa|sbv|smi|sami|lrc)$/i,
 WANT=n=>VID.test(n)||AUD.test(n)||SUB.test(n),
 SKIP_DIR=/^(node_modules|\$recycle\.bin|system volume information|__macosx|lost\+found|program files|program files \(x86\)|windows|perflogs|recovery)$/i,
 SORT=[['name','Name'],['new','Newest'],['size','Largest'],['small','Smallest']],
 MB=b=>b>=1e9?(b/1e9).toFixed(1)+' GB':Math.max(1,Math.round(b/1e6))+' MB',
 COL=new Intl.Collator(undefined,{numeric:true,sensitivity:'base'}),nat=(a,b)=>COL.compare(a,b),
 tick=()=>new Promise(r=>{const c=new MessageChannel();c.port1.onmessage=r;c.port2.postMessage(0)}),
 hk=f=>'f:'+f.name+':'+f.size,tail=p=>p.split('/').pop(),
 cleanName=s=>!s||s==='\\'?'Selected folder':s;
const P={
 back:'<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
 x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
 folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
 folderOpen:'<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
 play:'<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
 pause:'<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>',
 music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
 film:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
 shuffle:'<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>',
 list:'<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
 grid:'<rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/>',
 tree:'<path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M3 5a2 2 0 0 0 2 2h3"/><path d="M3 3v13a2 2 0 0 0 2 2h3"/>',
 home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
 chev:'<path d="m9 18 6-6-6-6"/>',
 down:'<path d="m6 9 6 6 6-6"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',
 sort:'<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="M3 8 7 4l4 4"/><path d="M7 4v16"/>',
 cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
 phone:'<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
 listVideo:'<path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/><path d="m16 12 5 3-5 3v-6z"/>'},
 ic=n=>'<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P[n]+'</svg>',
 MASK=p=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>')+'")';

const DESK_MQ=matchMedia('(min-width:740px),(pointer:coarse) and (max-height:500px) and (orientation:landscape)');
let L={name:'',root:'',items:[],subs:{},skip:0},view=[],all=[],more=300,hist={},scanId=0,lastP=0,pickClose=0,curH=null,autoTried=0;
const F={q:'',f:'all',s:'name',m:'flat',p:''},AF={tab:'folders',q:'',s:'name',p:''},keyOf=new WeakMap();
let appMode='classic',appView='auto';
try{F.m=localStorage.axlm==='tree'?'tree':'flat'}catch{}
try{appMode=localStorage.axAppMode==='app'?'app':'classic'}catch{}
try{appView=['list','grid'].includes(localStorage.axAppView)?localStorage.axAppView:'auto'}catch{}

function init(){
 document.head.insertAdjacentHTML('beforeend','<style>'+[
 /* ---- Classic Library (#lib) — 100% original v5 (Default on both Laptop & Mobile) ---- */
 '#lib{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;overflow:hidden;color:var(--tx);background:radial-gradient(700px 320px at 85% -8%,color-mix(in srgb,var(--ac) 18%,transparent),transparent),var(--bg);padding:max(8px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))}',
 '#lib[hidden]{display:none!important}#lib>*{width:100%;max-width:1360px;margin-inline:auto;box-sizing:border-box;min-width:0}#lib .i{width:19px;height:19px;flex:none}',
 '#lib .hd{display:flex;align-items:center;gap:8px;margin-bottom:8px}',
 '#lib .ti{flex:1;min-width:0}#lib .ti b{display:block;font-size:16px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#lib .ti small{display:block;color:var(--mut);font-size:12px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
 '#lib .ib{flex:none;width:38px;height:38px;padding:0;display:grid;place-items:center;border-radius:11px}',
 '#libsb.on{background:var(--grad);color:#171000}',
 '#lib .sr{position:relative;margin-bottom:8px;display:none}#lib .sr.open{display:block}#lib .sr>.i{position:absolute;left:12px;top:50%;margin-top:-9px;width:18px;height:18px;color:var(--mut);pointer-events:none}',
 '#lib .sr input{display:block;width:100%;box-sizing:border-box;background:var(--inp);color:var(--tx);border:1px solid var(--line);border-radius:12px;padding:9px 38px 9px 38px;font:inherit}#lib .sr input:focus{outline:0;border-color:var(--ac)}',
 '#libqx{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:30px;height:30px;min-height:0;padding:0;display:grid;place-items:center;border-radius:8px;background:none;color:var(--mut)}#libqx:hover{background:var(--btn);color:var(--tx)}#libqx .i{width:16px;height:16px}',
 '#lib .ct{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:6px}',
 '#lib .sg{display:flex;background:var(--btn);border-radius:10px;padding:3px;min-width:0}',
 '#lib .sg button{flex:1;min-width:0;min-height:0;display:inline-flex;align-items:center;justify-content:center;gap:5px;background:none;padding:5px 10px;border-radius:8px;font-size:12.5px;white-space:nowrap}#lib .sg button .i{width:15px;height:15px}',
 '#lib .sg button.on{background:var(--grad);color:#171000;font-weight:600}',
 '#libm{flex:1 1 100%}#libf{flex:1 1 0;min-width:150px}',
 '#libs{position:relative;flex:0 0 auto;z-index:25}',
 '#libst{display:inline-flex;align-items:center;gap:6px;height:34px;min-height:0;padding:0 11px;border-radius:10px;background:var(--btn);border:1px solid var(--line);color:var(--tx);font-size:12.5px;font-weight:600;white-space:nowrap;transition:border-color .15s,background-color .15s,box-shadow .15s}',
 '#libst:hover{background:var(--btnh);border-color:color-mix(in srgb,var(--ac) 45%,var(--line))}',
 '#libs.open #libst{border-color:var(--ac);background:color-mix(in srgb,var(--ac) 14%,var(--panel));box-shadow:0 0 0 3px color-mix(in srgb,var(--ac) 20%,transparent)}',
 '#libst .i{width:14px;height:14px;color:var(--act)}#libst .ar{width:14px;height:14px;color:var(--mut);margin-left:1px;transition:transform .18s ease}#libs.open #libst .ar{transform:rotate(180deg);color:var(--act)}',
 '#libsm{position:absolute;top:calc(100% + 6px);right:0;min-width:156px;padding:5px;border-radius:14px;background:var(--panel);border:1px solid var(--line);box-shadow:var(--sh);display:none;flex-direction:column;gap:2px;transform-origin:top right;z-index:30}',
 '#libs.open #libsm{display:flex;animation:libpop .16s cubic-bezier(.2,.8,.2,1)}',
 '#libsm button{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:0;padding:8px 10px;border-radius:9px;background:none;color:var(--tx);font-size:13px;font-weight:500;text-align:left;transition:background-color .12s,color .12s}',
 '#libsm button:hover{background:var(--btn)}',
 '#libsm button.on{background:color-mix(in srgb,var(--ac) 16%,transparent);color:var(--act);font-weight:600}',
 '#libsm button .ck{width:15px;height:15px;opacity:0;color:var(--act)}#libsm button.on .ck{opacity:1}',
 '@keyframes libpop{from{opacity:0;transform:translateY(-4px) scale(.96)}to{opacity:1;transform:none}}',
 '#libc{display:flex;align-items:center;gap:2px;overflow-x:auto;scrollbar-width:none;margin-bottom:6px;font-size:12.5px}#libc::-webkit-scrollbar{display:none}#libc:empty{display:none}',
 '#libc button{flex:none;min-height:0;display:inline-flex;align-items:center;background:none;padding:4px 7px;border-radius:8px;color:var(--mut);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#libc button:last-child{color:var(--tx);font-weight:600}#libc button .i{width:15px;height:15px}#libc i{display:inline-flex;color:var(--mut)}#libc i .i{width:13px;height:13px}',
 '#libr{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:8px;align-content:start;padding:2px 1px 10px;overscroll-behavior:contain}',
 '#libr>h6,#libr>.lm,#libr>.rf{grid-column:1/-1}',
 '#libr h6{margin:4px 4px 0;font-size:12px;font-weight:600;color:var(--mut);display:flex;gap:6px;align-items:center;white-space:nowrap;overflow:hidden}#libr h6::before{content:"";width:3px;height:12px;border-radius:2px;background:var(--grad);flex:none}',
 '#libr .li{display:flex;gap:10px;align-items:center;width:100%;min-width:0;box-sizing:border-box;text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:7px;transition:transform .15s,border-color .15s,box-shadow .15s}',
 '#libr .li:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--ac) 55%,var(--line));box-shadow:0 10px 24px #0004}#libr .li.cur{border-color:var(--ac);background:color-mix(in srgb,var(--ac) 14%,var(--panel))}',
 '#libr .th{position:relative;flex:none;width:116px;height:65px;border-radius:8px;overflow:hidden;background:color-mix(in srgb,var(--ac) 10%,var(--inp)) center/cover;display:grid;place-items:center;color:var(--ac)}#libr .th .i{width:24px;height:24px}',
 '#libr .th .du{position:absolute;right:5px;bottom:5px;background:#000c;color:#fff;font:600 10.5px/1 system-ui;padding:3px 5px;border-radius:5px;font-style:normal}#libr .th .du:empty{display:none}',
 '#libr .th .pg{position:absolute;left:0;bottom:0;height:3px;background:var(--grad)}',
 '#libr .fo .th{background:linear-gradient(135deg,color-mix(in srgb,var(--ac) 34%,transparent),color-mix(in srgb,var(--ac) 8%,transparent)),var(--inp)}#libr .fo .th .i{width:32px;height:32px}',
 '#libr .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
 '#libr .nm{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;font-weight:500;font-size:13.5px;line-height:1.28}',
 '#libr .tx small{color:var(--mut);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
 '#libr .lm{text-align:center;color:var(--mut);padding:28px 10px}#libr .lm .big{display:grid;place-items:center;width:72px;height:72px;margin:0 auto 12px;border-radius:50%;color:var(--ac);background:color-mix(in srgb,var(--ac) 14%,transparent)}#libr .lm .big .i{width:34px;height:34px}',
 '#libr .rf{justify-self:center;min-width:200px;padding:10px 18px;border-radius:12px}',
 '#lib .ac{display:flex;gap:8px;padding-top:8px}#lib .ac .ib{width:42px;height:42px}#libp{flex:1;min-width:0;height:42px;display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:12px;font-size:14px;font-weight:600}#libp .i{width:15px;height:15px}',
 '@media(min-width:700px){#libm,#libf{flex:0 0 auto}#lib .sg button{padding:5px 12px}#libsm{left:0;right:auto;transform-origin:top left}#libr{grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}#libr .li{flex-direction:column;align-items:stretch;gap:7px;padding:7px}#libr .th{width:100%;height:auto;aspect-ratio:16/9}#libr .nm{font-size:13px;line-height:1.25}#lib .ac{justify-content:center}#libp{flex:0 1 240px}}',
 '@media(min-width:820px){#lib{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto auto auto auto minmax(0,1fr);column-gap:10px;padding:8px max(16px,calc(50% - 680px)) 6px}#lib>*{max-width:none;margin-inline:0}#lib .hd{grid-column:1/-1;grid-row:1;margin-bottom:6px}#lib .ti{display:flex;align-items:baseline;gap:10px}#lib .ti small{margin-top:0}#lib .sr{grid-column:1/-1;grid-row:2}#lib .ct{grid-column:1;grid-row:3;margin-bottom:6px}#lib .ac{grid-column:2;grid-row:3;width:auto;padding-top:0;margin-bottom:6px;align-items:center;gap:6px}#lib .ac .ib{width:34px;height:34px;border-radius:10px}#libp{flex:none;height:34px;padding:0 14px;border-radius:10px;font-size:13px}#libc{grid-column:1/-1;grid-row:4}#libr{grid-column:1/-1;grid-row:5}}',
 '#lib.emp .sr,#lib.emp .ct,#lib.emp #libc,#lib.emp .ac,#lib.emp #libsb{display:none}',
 '#libr .li{content-visibility:auto;contain-intrinsic-size:auto 80px}@media(min-width:700px){#libr .li{contain-intrinsic-size:auto 200px}}@keyframes libsp{to{transform:rotate(360deg)}}#libr .big.spin{animation:libsp 1.6s linear infinite}@media(prefers-reduced-motion:reduce){#libr .big.spin,#libs.open #libsm{animation:none}}'+
 '#pl{display:none!important}#libb svg{width:20px;height:20px}#obf{display:inline-flex;align-items:center;gap:8px}#obf .i{width:18px;height:18px}',

 /* ---- Switchable App UI Mode (only active when user enables App Mode in Settings) ---- */
 'body.ax-app{padding:0!important;overflow:hidden!important;background:#000!important}',
 'body.ax-app .wrap{width:100%!important;max-width:none!important;height:100vh!important;height:100dvh!important}',
 'body.ax-app .top,body.ax-app .panel,body.ax-app #recw{display:none!important}',
 'body.ax-app #stage,body.ax-app #stage.vert{width:100%!important;height:100vh!important;height:100dvh!important;aspect-ratio:auto!important;border-radius:0!important;margin:0!important;box-shadow:none!important}',
 'body.ax-app #ttl{padding-left:max(56px,calc(48px + env(safe-area-inset-left,0px)))}',
 '#axapp-back{display:none;position:absolute;top:calc(10px + env(safe-area-inset-top,0px));left:calc(10px + env(safe-area-inset-left,0px));z-index:4;width:36px;height:36px;min-height:0;padding:0;border-radius:50%;background:#0009;color:#fff;border:1px solid #ffffff26;align-items:center;justify-content:center;transition:opacity .25s,background-color .15s}',
 '#axapp-back:hover{background:#000d}#axapp-back .i{width:18px;height:18px}',
 'body.ax-app #axapp-back{display:inline-flex}',
 'body.ax-app #stage.idle:not(.failed) #axapp-back{opacity:0;pointer-events:none}',

 /* Mobile App UI base */
 '#axapp{position:fixed;inset:0;z-index:65;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto auto auto minmax(0,1fr) auto auto;overflow:hidden;color:var(--tx);background:radial-gradient(740px 320px at 85% -8%,color-mix(in srgb,var(--ac) 16%,transparent),transparent),var(--bg);padding:max(6px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(6px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left))}',
 '#axapp[hidden]{display:none!important}#axapp>*{min-width:0;box-sizing:border-box}#axapp .i{width:18px;height:18px;flex:none}',
 '#axapp .ahd{grid-column:1/-1;grid-row:1;display:flex;align-items:center;gap:8px;min-height:38px;margin-bottom:6px}',
 '#axapp .alogo{width:32px;height:32px;border-radius:10px;flex:none;box-shadow:0 5px 14px -4px color-mix(in srgb,var(--ac) 65%,transparent)}',
 '#axapp .ati{flex:1;min-width:0}#axapp .ati b{display:block;font-size:16px;font-weight:800;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#axapp .ati small{display:block;color:var(--mut);font-size:11.5px;line-height:1.2;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
 '#axapp .aib{flex:none;width:36px;height:36px;min-height:0;padding:0;display:grid;place-items:center;border-radius:11px}',
 '#axapp .aib.on{background:var(--grad);color:#171000}',
 '#axapp .asr{grid-column:1/-1;grid-row:2;position:relative;margin-bottom:6px;display:none}#axapp .asr.open{display:block}#axapp .asr>.i{position:absolute;left:11px;top:50%;margin-top:-8px;width:16px;height:16px;color:var(--mut);pointer-events:none}',
 '#axapp .asr input{display:block;width:100%;box-sizing:border-box;background:var(--inp);color:var(--tx);border:1px solid var(--line);border-radius:11px;padding:8px 34px;font:inherit;font-size:13.5px}#axapp .asr input:focus{outline:0;border-color:var(--ac)}',
 '#axap-qx{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:28px;height:28px;min-height:0;padding:0;display:grid;place-items:center;border-radius:7px;background:none;color:var(--mut)}#axap-qx:hover{background:var(--btn);color:var(--tx)}#axap-qx .i{width:15px;height:15px}',

 '#axapp .act{grid-column:1/-1;grid-row:3;display:flex;align-items:center;gap:6px;margin-bottom:6px;min-height:32px}',
 '#axapp .asp{flex:1}',
 '#axap-s{position:relative;flex:none;z-index:25}',
 '#axap-st{display:inline-flex;align-items:center;gap:5px;height:32px;min-height:0;padding:0 10px;border-radius:9px;background:var(--btn);border:1px solid var(--line);color:var(--tx);font-size:12px;font-weight:600;white-space:nowrap}',
 '#axap-st:hover{background:var(--btnh);border-color:color-mix(in srgb,var(--ac) 45%,var(--line))}',
 '#axap-s.open #axap-st{border-color:var(--ac);background:color-mix(in srgb,var(--ac) 14%,var(--panel))}',
 '#axap-st .i{width:13px;height:13px;color:var(--act)}#axap-st .ar{width:13px;height:13px;color:var(--mut);transition:transform .18s}#axap-s.open #axap-st .ar{transform:rotate(180deg);color:var(--act)}',
 '#axap-sm{position:absolute;top:calc(100% + 5px);left:0;min-width:148px;padding:4px;border-radius:12px;background:var(--panel);border:1px solid var(--line);box-shadow:var(--sh);display:none;flex-direction:column;gap:2px;transform-origin:top left;z-index:30}',
 '#axap-s.open #axap-sm{display:flex;animation:libpop .16s cubic-bezier(.2,.8,.2,1)}',
 '#axap-sm button{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:0;padding:7px 9px;border-radius:8px;background:none;color:var(--tx);font-size:12.5px;font-weight:500;text-align:left}',
 '#axap-sm button:hover{background:var(--btn)}#axap-sm button.on{background:color-mix(in srgb,var(--ac) 16%,transparent);color:var(--act);font-weight:600}',
 '#axap-sm button .ck{width:14px;height:14px;opacity:0;color:var(--act)}#axap-sm button.on .ck{opacity:1}',
 '#axap-vw,#axap-sh{width:32px;height:32px;min-height:0;padding:0;border-radius:9px;display:grid;place-items:center;flex:none}#axap-vw .i,#axap-sh .i{width:15px;height:15px}',
 '#axap-pl{height:32px;min-height:0;padding:0 12px;border-radius:9px;display:inline-flex;align-items:center;gap:5px;font-size:12.5px;flex:none}#axap-pl .i{width:13px;height:13px}',

 '#axap-c{grid-column:1/-1;grid-row:4;display:flex;align-items:center;gap:2px;overflow-x:auto;scrollbar-width:none;margin-bottom:6px;font-size:12.5px}#axap-c::-webkit-scrollbar{display:none}#axap-c:empty{display:none}',
 '#axap-c button{flex:none;min-height:0;display:inline-flex;align-items:center;gap:5px;background:none;padding:4px 7px;border-radius:8px;color:var(--mut);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#axap-c button:hover{background:var(--btn);color:var(--tx)}#axap-c button:last-child{color:var(--tx);font-weight:600}#axap-c button .i{width:14px;height:14px}#axap-c i{display:inline-flex;color:var(--mut)}#axap-c i .i{width:12px;height:12px}',
 '#axapp.emp .asr,#axapp.emp .act,#axapp.emp #axap-c,#axapp.emp #axap-sb{display:none}',

 /* Mobile list & cards */
 '#axapp-list{grid-column:1/-1;grid-row:5;min-height:0;overflow:auto;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:7px;align-content:start;padding:6px 4px 16px;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--line) transparent}',
 '#axapp-list::-webkit-scrollbar{width:6px}#axapp-list::-webkit-scrollbar-thumb{background:var(--line);border-radius:99px}',
 '#axapp-list>h6,#axapp-list>.ahdr,#axapp-list>.lm,#axapp-list>.rf,#axapp-list>.ahub,#axapp-list>.afg{grid-column:1/-1}',
 '#axapp-list h6{margin:6px 2px 2px;font-size:12px;font-weight:700;color:var(--mut);display:flex;gap:6px;align-items:center;white-space:nowrap;overflow:hidden}#axapp-list h6::before{content:"";width:3px;height:12px;border-radius:2px;background:var(--grad);flex:none}',
 '#axapp-list .ahdr{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:2px 2px 4px}#axapp-list .ahdr h6{margin:0}',
 '#axapp-list .apick{display:inline-flex;align-items:center;gap:5px;height:30px;min-height:0;padding:0 11px;border-radius:9px;background:var(--btn);border:1px solid var(--line);color:var(--tx);font-size:12px;font-weight:600}#axapp-list .apick:hover{background:var(--btnh);border-color:color-mix(in srgb,var(--ac) 45%,var(--line))}#axapp-list .apick .i{width:14px;height:14px;color:var(--act)}',
 '#axapp-list .afg{display:grid;grid-template-columns:minmax(0,1fr);gap:7px}',
 '#axapp-list .li{position:relative;display:flex;gap:10px;align-items:center;width:100%;min-width:0;box-sizing:border-box;text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:6px 8px;transition:transform .16s cubic-bezier(.22,1,.36,1),border-color .16s,box-shadow .16s;content-visibility:auto;contain-intrinsic-size:auto 70px}',
 '#axapp-list .li:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--ac) 58%,var(--line));box-shadow:0 12px 26px -10px #0004}#axapp-list .li.cur{border-color:var(--ac);background:color-mix(in srgb,var(--ac) 13%,var(--panel))}',
 '#axapp-list .th{position:relative;flex:none;width:104px;height:59px;border-radius:8px;overflow:hidden;background:color-mix(in srgb,var(--ac) 11%,var(--inp)) center/cover;display:grid;place-items:center;color:var(--ac)}#axapp-list .th .i{width:22px;height:22px}',
 '#axapp-list .th.au{background:linear-gradient(145deg,#8b5cf62e,#38bdf81a),var(--inp);color:#8b5cf6}',
 '#axapp-list .th .du{position:absolute;right:5px;bottom:5px;background:#0a0d18cc;color:#fff;font:600 10px/1 system-ui;padding:3px 5px;border-radius:5px;font-style:normal;font-variant-numeric:tabular-nums}#axapp-list .th .du:empty{display:none}',
 '#axapp-list .th .pg{position:absolute;left:0;bottom:0;height:3px;background:var(--grad)}',
 /* Folder styling: compact horizontal on mobile, rich 16:9 visual cards on desktop grid */
 '#axapp-list .fo .th{width:46px;height:46px;border-radius:11px;background:linear-gradient(145deg,color-mix(in srgb,var(--ac) 30%,var(--inp)),color-mix(in srgb,var(--ac) 10%,var(--inp)));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ac) 24%,transparent);color:var(--act)}#axapp-list .fo .th .ic .i{width:24px;height:24px}',
 '#axapp-list .fo.au .th{background:linear-gradient(145deg,#8b5cf636,#38bdf818),var(--inp);box-shadow:inset 0 0 0 1px #8b5cf636;color:#7c3aed}',
 ':root[data-theme=dark] #axapp-list .fo.au .th,:root[data-theme=dark] #axapp-list .th.au{color:#a78bfa}',
 '#axapp-list .fo.addf{border-style:dashed;background:color-mix(in srgb,var(--panel) 55%,transparent)}#axapp-list .fo.addf .th{background:color-mix(in srgb,var(--tx) 5%,transparent);box-shadow:none;color:var(--mut)}#axapp-list .fo.addf:hover{background:var(--panel);border-color:var(--ac)}#axapp-list .fo.addf:hover .th{color:var(--act);background:color-mix(in srgb,var(--ac) 14%,transparent)}',
 '#axapp-list .fo .fbg{display:none;position:absolute;left:8px;bottom:8px;padding:3px 8px;border-radius:99px;background:color-mix(in srgb,var(--panel) 84%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid var(--line);color:var(--tx);font-size:11px;font-weight:700;line-height:1.2;font-style:normal}',
 '#axapp-list .fo .fpl{display:none;position:absolute;right:10px;bottom:10px;z-index:2;width:38px;height:38px;border-radius:50%;place-items:center;background:var(--grad);color:#171000;border:2px solid color-mix(in srgb,var(--panel) 88%,transparent);box-shadow:0 8px 20px -4px color-mix(in srgb,var(--ac) 75%,transparent);opacity:0;transform:translateY(8px) scale(.86);transition:opacity .18s ease,transform .22s cubic-bezier(.22,1,.36,1),box-shadow .18s ease}',
 '#axapp-list .fo .fpl .i{width:15px!important;height:15px!important;margin-left:2px;transition:transform .16s ease}',
 '#axapp-list .fo.au .fpl{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff;box-shadow:0 8px 20px -4px #7c3aed99}',
 '#axapp-list .fo:hover .fpl{opacity:1;transform:translateY(0) scale(1)}',
 '#axapp-list .fo .fpl:hover{transform:scale(1.1);box-shadow:0 0 0 4px color-mix(in srgb,var(--ac) 30%,transparent),0 10px 22px -4px color-mix(in srgb,var(--ac) 85%,transparent)}',
 '#axapp-list .fo.au .fpl:hover{box-shadow:0 0 0 4px #8b5cf638,0 10px 22px -4px #7c3aedbb}',
 '#axapp-list .fo .fpl:active{transform:scale(.95)}',
 '#axapp-list .li.fo.sv{padding-right:36px}',
 '#axapp-list .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
 '#axapp-list .nm{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;font-weight:600;font-size:13.5px;line-height:1.28}',
 '#axapp-list .fo .nm{-webkit-line-clamp:1}',
 '#axapp-list .tx small{color:var(--mut);font-size:11.5px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}',
 '#axapp-list .chev{color:var(--mut);flex:none;width:16px;height:16px}',
 '#axapp-list .rmf{position:absolute;top:50%;right:8px;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--btn);color:var(--mut);z-index:2}#axapp-list .rmf:hover{background:#e5484d;color:#fff}#axapp-list .rmf .i{width:12px;height:12px}',
 '#axapp-list .lm{text-align:center;color:var(--mut);padding:28px 10px}#axapp-list .lm .big{display:grid;place-items:center;width:62px;height:62px;margin:0 auto 10px;border-radius:50%;color:var(--ac);background:color-mix(in srgb,var(--ac) 14%,transparent)}#axapp-list .lm .big .i{width:30px;height:30px}#axapp-list .big.spin{animation:libsp 1.6s linear infinite}',
 '#axapp-list .rf{justify-self:center;min-width:190px;padding:9px 18px;border-radius:11px;font-size:13px}',

 /* Grid mode override (works on mobile 2-col and desktop multi-col, including folder cards) */
 '#axapp-list.v-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
 '#axapp-list.v-grid .afg{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
 '#axapp-list.v-grid .li{flex-direction:column;align-items:stretch;gap:6px;padding:6px;contain-intrinsic-size:auto 164px}',
 '#axapp-list.v-grid .li .th{width:100%;height:auto;aspect-ratio:16/9;border-radius:8px}',
 '#axapp-list.v-grid .fo .th .ic .i{width:32px;height:32px}',
 '#axapp-list.v-grid .fo .fbg{display:inline-block}#axapp-list.v-grid .fo .chev{display:none}',
 '#axapp-list.v-grid .li.fo.sv{padding-right:6px}#axapp-list.v-grid .rmf{top:10px;right:10px;transform:none;background:#0a0d18aa;color:#fff}',
 '#axapp-list.v-grid .tx{padding:0 2px 2px}#axapp-list.v-grid .nm{font-size:12.5px}#axapp-list.v-grid .tx small{font-size:11px}',

 /* Compact permission hub (only shown when user has 0 saved folders) */
 '#axapp .ahub{max-width:460px;width:100%;margin:16px auto 6px;padding:18px 16px 16px;border-radius:18px;background:var(--panel);border:1px solid var(--line);box-shadow:0 14px 36px -16px #0007;text-align:center}',
 '#axapp .ahub .ao{width:50px;height:50px;margin:0 auto 10px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,var(--ac) 18%,var(--inp));color:var(--act);border:1px solid color-mix(in srgb,var(--ac) 32%,transparent)}#axapp .ahub .ao .i{width:25px;height:25px}',
 '#axapp .ahub b{display:block;font-size:16px;font-weight:800;margin-bottom:4px}',
 '#axapp .ahub p{margin:0 0 14px;font-size:12.5px;line-height:1.45;color:var(--mut)}',
 '#axapp .ahub .ab{display:grid;grid-template-columns:1fr;gap:8px}',
 '#axapp .ahub .go,#axapp .ahub .ab2{width:100%;height:40px;min-height:0;display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:11px;font-size:13px}',
 '#axapp .ahub .ab2{background:var(--btn);border:1px solid var(--line)}#axapp .ahub .ab2:hover{background:var(--btnh)}#axapp .ahub .ab2 .i{width:15px;height:15px;color:var(--act)}',
 '@media(min-width:440px){#axapp .ahub .ab{grid-template-columns:1.25fr 1fr}}',

 /* Slim Now Playing bar */
 '#axapp-np{grid-column:1/-1;grid-row:6;display:none;align-items:center;gap:9px;margin-top:4px;padding:6px 9px 8px;border-radius:12px;position:relative;overflow:hidden;background:var(--panel);border:1px solid color-mix(in srgb,var(--ac) 42%,var(--line));cursor:pointer}',
 '#axapp-np.on{display:flex}',
 '#axapp-np .npb{width:30px;height:30px;min-height:0;padding:0;border-radius:50%;display:grid;place-items:center;background:var(--grad);color:#171000;flex:none}#axapp-np .npb .i{width:14px;height:14px}',
 '#axapp-np .npt{flex:1;min-width:0}#axapp-np .npt b{display:block;font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#axapp-np .npt small{display:block;font-size:11px;color:var(--mut);font-variant-numeric:tabular-nums}',
 '#axapp-np .npg{position:absolute;left:0;right:0;bottom:0;height:2.5px;background:var(--btn)}#axapp-np .npg i{display:block;height:100%;background:var(--grad);width:0}',

 /* Mobile bottom nav */
 '#axapp-nav{grid-column:1/-1;grid-row:7;display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-top:5px;padding:3px;border-radius:13px;background:var(--panel);border:1px solid var(--line);box-shadow:0 8px 22px -14px #0009}',
 '#axapp-nav button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:38px;padding:4px 4px;border-radius:10px;background:none;color:var(--mut);font-size:10.5px;font-weight:600;transition:background-color .15s,color .15s}',
 '#axapp-nav button .i{width:16px;height:16px}#axapp-nav button:hover{color:var(--tx);background:var(--btn)}',
 '#axapp-nav button.on{background:color-mix(in srgb,var(--ac) 16%,transparent);color:var(--act)}',

 /* Laptop / Desktop App Mode: clean v5 desktop layout + rich 16:9 folder & media cards */
 '@media(min-width:740px),(pointer:coarse) and (max-height:500px) and (orientation:landscape){'+
  '#axapp{grid-template-columns:auto minmax(0,1fr);grid-template-rows:auto auto auto auto minmax(0,1fr) auto;column-gap:8px;padding:10px max(18px,calc(50% - 680px)) 8px}'+
  '#axapp .ahd{margin-bottom:8px}#axapp .ati{display:flex;align-items:baseline;gap:10px}#axapp .ati b{font-size:17px}#axapp .ati small{margin-top:0;font-size:12.5px}'+
  '#axapp-nav{grid-column:1;grid-row:3;display:inline-flex;margin:0 0 8px;padding:3px;gap:2px;height:36px;border-radius:11px;background:var(--btn);border:0;box-shadow:none;align-self:center}'+
  '#axapp-nav button{flex-direction:row;gap:6px;min-height:0;height:30px;padding:0 13px;border-radius:8px;font-size:13px}#axapp-nav button .i{width:15px;height:15px}'+
  '#axapp-nav button.on{background:var(--grad);color:#171000}'+
  '#axapp.emp #axapp-nav{display:none}'+
  '#axapp .act{grid-column:2;grid-row:3;margin-bottom:8px;min-height:36px}'+
  '#axap-st,#axap-vw,#axap-sh,#axap-pl{height:36px;border-radius:10px}#axap-vw,#axap-sh{width:36px}#axap-pl{padding:0 15px;font-size:13px}'+
  '#axap-c{grid-column:1/-1;grid-row:4;margin-bottom:8px;font-size:12.5px}'+
  '#axapp-list{grid-column:1/-1;grid-row:5;padding:8px 4px 18px}'+
  '#axapp-list:not(.v-list){grid-template-columns:repeat(auto-fill,minmax(212px,1fr));gap:12px}'+
  '#axapp-list:not(.v-list) .afg{grid-template-columns:repeat(auto-fill,minmax(224px,1fr));gap:12px;margin-bottom:4px}'+
  '#axapp-list:not(.v-list) .li{flex-direction:column;align-items:stretch;gap:8px;padding:8px;border-radius:15px;contain-intrinsic-size:auto 214px}'+
  '#axapp-list:not(.v-list) .li .th{width:100%;height:auto;aspect-ratio:16/9;border-radius:10px}'+
  '#axapp-list:not(.v-list) .fo .th .ic .i{width:40px;height:40px;transition:transform .2s cubic-bezier(.22,1,.36,1)}'+
  '#axapp-list:not(.v-list) .fo:hover .th .ic .i{transform:scale(1.08)}'+
  '#axapp-list:not(.v-list) .fo .fbg{display:inline-block}'+
  '#axapp-list:not(.v-list) .fo .fpl{display:grid}'+
  '#axapp-list:not(.v-list) .fo .chev{display:none}'+
  '#axapp-list:not(.v-list) .li.fo.sv{padding-right:8px}'+
  '#axapp-list:not(.v-list) .rmf{top:13px;right:13px;transform:none;background:#0a0d18aa;color:#fff}'+
  '#axapp-list:not(.v-list) .tx{padding:0 3px 2px;gap:3px}'+
  '#axapp-list:not(.v-list) .nm{font-size:13.5px;line-height:1.28}'+
  '#axapp-list:not(.v-list) .fo .nm{font-size:14.5px;font-weight:700}'+
  '#axapp-list:not(.v-list) .tx small{font-size:12px}'+
  '#axapp-list.v-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}'+
  '#axapp-list.v-list .afg{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}'+
  '#axapp-np{grid-column:1/-1;grid-row:6}}',

 /* App Settings sheet */
 '#axapp-set{position:fixed;inset:0;z-index:85;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(7,10,19,.6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s ease,visibility .16s ease}',
 '#axapp-set.on{opacity:1;visibility:visible;pointer-events:auto}',
 '#axapp-set .asc{width:100%;max-width:356px;background:var(--panel);color:var(--tx);border:1px solid var(--line);border-radius:20px;padding:15px;box-shadow:0 24px 60px -12px #000c;transform:translateY(10px) scale(.96);transition:transform .2s cubic-bezier(.22,1,.36,1)}',
 '#axapp-set.on .asc{transform:none}',
 '#axapp-set .ash{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}#axapp-set .ash b{font-size:15px;font-weight:750}#axapp-set .ash button{width:30px;height:30px;min-height:0;padding:0;border-radius:50%;display:grid;place-items:center}',
 '#axapp-set .asr2{padding:9px 11px;margin-bottom:7px;border-radius:13px;background:color-mix(in srgb,var(--tx) 5%,transparent)}',
 '#axapp-set .asr2:last-child{margin-bottom:0}',
 '#axapp-set .asr2>span{display:block;font-size:12.5px;font-weight:600;margin-bottom:7px}#axapp-set .asr2 small{display:block;font-size:11px;font-weight:400;color:var(--mut);margin-top:1px}',
 '#axapp-set .assg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:4px;padding:3px;border-radius:10px;background:color-mix(in srgb,var(--tx) 8%,transparent)}',
 '#axapp-set .assg button{min-height:30px;padding:5px 8px;border-radius:7px;background:none;color:var(--mut);font-size:12px;font-weight:600}',
 '#axapp-set .assg button.on{background:var(--grad);color:#171000;box-shadow:0 3px 10px -3px color-mix(in srgb,var(--ac) 65%,transparent)}',
 '@media(max-width:640px){#axapp-set{align-items:flex-end;padding:10px 10px max(12px,env(safe-area-inset-bottom,0px))}#axapp-set .asc{max-width:none;transform:translateY(24px)}#axapp-set.on .asc{transform:none}}',
 '@media(prefers-reduced-motion:reduce){#axapp-set,#axapp-set .asc,#axapp-list .big.spin,#axap-s.open #axap-sm,#axapp-list .li,#axapp-list .fo .fpl,#axapp-list .fo .th .ic .i{transition:none!important;animation:none!important}}'
 ].join('')+'</style>');

 /* ---- Classic Library DOM (#lib) — 100% original v5 ---- */
 const o=document.createElement('div');o.id='lib';o.hidden=true;
 o.innerHTML='<div class="hd"><button id="libx" class="ib" aria-label="Back">'+ic('back')+'</button><div class="ti"><b id="libt">Library</b><small id="libi"></small></div><button id="libsb" class="ib" title="Search (Ctrl+F)" aria-label="Search">'+ic('search')+'</button><button id="libo" class="ib" title="Open another folder" aria-label="Open another folder">'+ic('folderOpen')+'</button></div>'+
  '<div class="sr">'+ic('search')+'<input id="libq" type="search" placeholder="Search videos &amp; audio…" autocomplete="off"><button id="libqx" type="button" title="Close search" aria-label="Close search">'+ic('x')+'</button></div>'+
  '<div class="ct"><div class="sg" id="libm"><button data-m="tree">'+ic('tree')+'<span>Folders</span></button><button data-m="flat">'+ic('list')+'<span>All files</span></button></div>'+
  '<div class="sg" id="libf"><button data-f="all">All</button><button data-f="v">Video</button><button data-f="a">Audio</button></div>'+
  '<div id="libs"><button id="libst" type="button" aria-haspopup="listbox" aria-expanded="false">'+ic('sort')+'<span id="libsl">Name</span><svg class="i ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P.down+'</svg></button>'+
  '<div id="libsm" role="listbox">'+SORT.map(([k,l])=>'<button type="button" role="option" data-s="'+k+'"><span>'+l+'</span><svg class="i ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P.check+'</svg></button>').join('')+'</div></div></div>'+
  '<div id="libc"></div><div id="libr"></div>'+
  '<div class="ac"><button id="libsh" class="ib" title="Shuffle" aria-label="Shuffle">'+ic('shuffle')+'</button><button id="libp" class="go">'+ic('play')+'<span>Play all</span></button></div>';
 document.body.appendChild(o);

 /* ---- Switchable App UI DOM (#axapp + #axapp-set + #axapp-back) ---- */
 const axApp=document.createElement('div');axApp.id='axapp';axApp.hidden=true;
 axApp.innerHTML='<div class="ahd">'+
  '<button id="axap-bk" class="aib" aria-label="Back" hidden>'+ic('back')+'</button>'+
  '<svg id="axap-lg" class="alogo" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="axalg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd36b"/><stop offset="1" stop-color="#f08a24"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="#10131f"/><path d="M23 16 49 32 23 48Z" fill="url(#axalg)" stroke="url(#axalg)" stroke-width="6" stroke-linejoin="round"/></svg>'+
  '<div class="ati"><b id="axap-t">Axion</b><small id="axap-i"></small></div>'+
  '<button id="axap-sb" class="aib" title="Search (Ctrl+F)" aria-label="Search">'+ic('search')+'</button>'+
  '<button id="axap-fo" class="aib" title="Open folder" aria-label="Open folder">'+ic('folderOpen')+'</button>'+
  '<button id="axap-cfg" class="aib" title="Settings" aria-label="Settings">'+ic('cog')+'</button></div>'+
  '<div class="asr">'+ic('search')+'<input id="axap-q" type="search" placeholder="Search videos &amp; audio…" autocomplete="off"><button id="axap-qx" type="button" aria-label="Close search">'+ic('x')+'</button></div>'+
  '<nav id="axapp-nav" aria-label="App navigation"><button type="button" data-tab="folders">'+ic('tree')+'<span>Folders</span></button><button type="button" data-tab="videos">'+ic('film')+'<span>Videos</span></button><button type="button" data-tab="audio">'+ic('music')+'<span>Audio</span></button></nav>'+
  '<div class="act"><div id="axap-s"><button id="axap-st" type="button" aria-haspopup="listbox" aria-expanded="false">'+ic('sort')+'<span id="axap-sl">Name</span><svg class="i ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P.down+'</svg></button>'+
  '<div id="axap-sm" role="listbox">'+SORT.map(([k,l])=>'<button type="button" role="option" data-s="'+k+'"><span>'+l+'</span><svg class="i ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P.check+'</svg></button>').join('')+'</div></div>'+
  '<button id="axap-vw" type="button" title="Switch grid / list view" aria-label="Switch grid or list view">'+ic('list')+'</button>'+
  '<span class="asp"></span>'+
  '<button id="axap-sh" type="button" title="Shuffle" aria-label="Shuffle">'+ic('shuffle')+'</button>'+
  '<button id="axap-pl" type="button" class="go">'+ic('play')+'<span>Play all</span></button></div>'+
  '<div id="axap-c"></div>'+
  '<div id="axapp-list"></div>'+
  '<div id="axapp-np" role="button" tabindex="0" aria-label="Return to player"><button type="button" class="npb" id="axnp-b" aria-label="Play or pause">'+ic('play')+'</button><div class="npt"><b id="axnp-t"></b><small id="axnp-s"></small></div><span class="npg"><i id="axnp-p"></i></span></div>';
 document.body.appendChild(axApp);

 const axSet=document.createElement('div');axSet.id='axapp-set';axSet.setAttribute('role','dialog');axSet.setAttribute('aria-modal','true');
 axSet.innerHTML='<div class="asc"><div class="ash"><b>App Settings</b><button type="button" id="axsx" aria-label="Close">'+ic('x')+'</button></div>'+
  '<div class="asr2"><span>Interface mode<small>Switch back to Classic player anytime</small></span><div class="assg" id="axs-mode"><button type="button" data-v="classic">Classic</button><button type="button" data-v="app">App</button></div></div>'+
  '<div class="asr2"><span>View style<small>Auto uses list on mobile and cards on laptop</small></span><div class="assg" id="axs-view"><button type="button" data-v="auto">Auto</button><button type="button" data-v="list">List</button><button type="button" data-v="grid">Grid</button></div></div>'+
  '<div class="asr2"><span>Theme</span><div class="assg" id="axs-th"><button type="button" data-v="dark">Dark</button><button type="button" data-v="light">Light</button><button type="button" data-v="auto">Auto</button></div></div></div>';
 document.body.appendChild(axSet);

 const appBack=document.createElement('button');appBack.id='axapp-back';appBack.type='button';appBack.title='Back to folders';appBack.setAttribute('aria-label','Back to folders');
 appBack.innerHTML=ic('back');
 st.appendChild(appBack);

 /* ---- App mode setting inside Player Settings > Customize ---- */
 const cPane=document.querySelector('#set .pane[data-p="c"]');
 let appSel=null;
 if(cPane){
  const appRow=document.createElement('label');appRow.className='it ic';appRow.id='ax-appm-row';
  appRow.style.setProperty('--ri',MASK(P.phone));
  appRow.innerHTML='<span>App mode<small>Folder-first UI (stays until changed back)</small></span><select id="ax-appm"><option value="classic">Classic</option><option value="app">App</option></select>';
  const thBtn=cPane.querySelector('[data-th]'),thRow=thBtn&&thBtn.closest('.it');
  if(thRow)thRow.after(appRow);else cPane.append(appRow);
  appSel=document.getElementById('ax-appm');
  if(appSel){appSel.value=appMode;appSel.onchange=()=>setAppMode(appSel.value,true)}}

 const body=$('#libr'),srEl=o.querySelector('.sr'),sbBtn=$('#libsb'),qInp=$('#libq'),sWrap=$('#libs'),sBtn=$('#libst'),sLbl=$('#libsl'),sMenu=$('#libsm');
 const aBody=$('#axapp-list'),aSrEl=axApp.querySelector('.asr'),aSbBtn=$('#axap-sb'),aQInp=$('#axap-q'),aSWrap=$('#axap-s'),aSBtn=$('#axap-st'),aSLbl=$('#axap-sl'),aSMenu=$('#axap-sm'),aCfgBtn=$('#axap-cfg'),aVwBtn=$('#axap-vw');
 const aNp=$('#axapp-np'),aNpBtn=$('#axnp-b'),aNpT=$('#axnp-t'),aNpS=$('#axnp-s'),aNpP=$('#axnp-p');
 const inp=document.createElement('input');inp.type='file';inp.multiple=true;inp.hidden=true;inp.setAttribute('webkitdirectory','');document.body.appendChild(inp);

 const isGridNow=()=>appView==='grid'||(appView==='auto'&&DESK_MQ.matches);
 function setSortMenu(on){sWrap.classList.toggle('open',on);sBtn.setAttribute('aria-expanded',String(on))}
 function setSearch(on){
  srEl.classList.toggle('open',on);sbBtn.classList.toggle('on',on);
  if(on){setSortMenu(false);qInp.focus();qInp.select()}
  else if(F.q){F.q='';qInp.value='';render(1)}}
 function setAppSortMenu(on){aSWrap.classList.toggle('open',on);aSBtn.setAttribute('aria-expanded',String(on))}
 function setAppSearch(on){
  aSrEl.classList.toggle('open',on);aSbBtn.classList.toggle('on',on);
  if(on){setAppSortMenu(false);aQInp.focus();aQInp.select()}
  else if(AF.q){AF.q='';aQInp.value='';renderApp(1)}}
 function setAppSet(on){
  axSet.classList.toggle('on',on);aCfgBtn.classList.toggle('on',on);
  if(on){setAppSortMenu(false);syncAppState()}}
 function syncAppState(){
  document.body.classList.toggle('ax-app',appMode==='app');
  aBody.classList.toggle('v-list',appView==='list');
  aBody.classList.toggle('v-grid',appView==='grid');
  const g=isGridNow();
  aVwBtn.innerHTML=ic(g?'list':'grid');
  aVwBtn.title=g?'Switch to list view':'Switch to grid view';
  if(appSel&&appSel.value!==appMode)appSel.value=appMode;
  $('#axs-mode').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===appMode));
  $('#axs-view').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===appView));
  const curTh=(typeof S==='object'&&S.theme)||'light';
  $('#axs-th').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===curTh));
  $('#axapp-nav').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.tab===AF.tab))}
 DESK_MQ.addEventListener?DESK_MQ.addEventListener('change',syncAppState):DESK_MQ.addListener(syncAppState);

 function syncNP(){
  const active=appMode==='app'&&st.classList.contains('has')&&!!curUrl&&!st.classList.contains('web');
  aNp.classList.toggle('on',active);
  if(!active||axApp.hidden)return;
  aNpT.textContent=($('#ttl')&&$('#ttl').textContent.trim())||(pl[pi]&&pl[pi].name)||'Now playing';
  const d=v.duration;
  aNpS.textContent=(v.paused?'Paused':'Playing')+(isFinite(d)&&d>0?' · '+fmt(v.currentTime)+' / '+fmt(d):'');
  aNpBtn.innerHTML=ic(v.paused?'play':'pause');
  aNpP.style.width=(isFinite(d)&&d>0?Math.min(100,Math.round(100*v.currentTime/d)):0)+'%'}
 function setAppMode(mode,notify){
  appMode=mode==='app'?'app':'classic';
  try{localStorage.axAppMode=appMode}catch{}
  setAppSet(false);el.set.hidden=true;el.qm.hidden=true;
  syncAppState();
  if(appMode==='app'){
   o.hidden=true;
   if(st.classList.contains('has')&&curUrl)axApp.hidden=true;
   else openApp();
  }else{
   axApp.hidden=true;Q.length=0;
  }
  if(notify)say(appMode==='app'?'App mode enabled':'Classic mode enabled',2000)}

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

 /* ---- fast media-only scanning (skips non-media before touching disk) ---- */
 function reset(n){
  L={name:n,root:'',items:[],subs:{},skip:0};curH=null;
  F.q='';F.p='';qInp.value='';srEl.classList.remove('open');sbBtn.classList.remove('on');setSortMenu(false);
  AF.q='';AF.p='';aQInp.value='';aSrEl.classList.remove('open');aSbBtn.classList.remove('on');setAppSortMenu(false)}
 function prog(force){
  const now=performance.now();if(!force&&now-lastP<100)return;lastP=now;
  const txt=L.items.length+' media found'+(L.skip?' · '+L.skip+' non-media skipped':'');
  const e=document.getElementById(appMode==='app'?'axsc':'libsc');if(e)e.textContent=txt}
 function add(f,path){
  const n=f.name,key=(path+n).replace(/\.[^./]+$/,'').toLowerCase();
  if(SUB.test(n)){
   if(!L.subs[key]||/\.vtt$/i.test(n)||(/\.srt$/i.test(n)&&!/\.(vtt|srt)$/i.test(L.subs[key].name)))L.subs[key]=f;
   return true}
  const vi=VID.test(n)||/^video\//i.test(f.type),a=AUD.test(n)||/^audio\//i.test(f.type);
  if(!vi&&!a)return false;
  keyOf.set(f,key);L.items.push({f,a:a&&!vi,dir:path.replace(/^\/+|\/+$/g,'')});
  return true}
 async function walk(h,p,id){
  if(id!==scanId)return;
  const files=[],dirs=[];
  try{
   for await(const [n,e] of h.entries()){
    if(id!==scanId)return;
    if(n[0]==='.')continue;
    if(e.kind==='file'){if(WANT(n))files.push([n,e]);else L.skip++}
    else if(!SKIP_DIR.test(n))dirs.push([n,e])}
  }catch{return}
  for(let i=0;i<files.length;i+=64){
   if(id!==scanId)return;
   await Promise.all(files.slice(i,i+64).map(async([n,e])=>{
    if(id!==scanId)return;
    try{
     const f=await e.getFile();
     if(id!==scanId)return;
     if(add(f,p)&&!SUB.test(f.name))(window.axH||(window.axH=new Map())).set(f.name+':'+f.size,e);
    }catch{}}));
   prog();await tick()}
  if(!files.length&&L.skip)prog();
  for(const [n,e] of dirs){if(id!==scanId)return;await walk(e,p+n+'/',id)}}
 async function walkE(en,p,id){
  if(id!==scanId||en.name[0]==='.')return;
  if(en.isFile){
   if(!WANT(en.name)){L.skip++;return}
   const f=await new Promise(r=>en.file(r,()=>r()));
   if(f&&id===scanId)add(f,p);
   return}
  if(SKIP_DIR.test(en.name))return;
  const rd=en.createReader(),files=[],dirs=[];let b;
  do{b=await new Promise(r=>rd.readEntries(r,()=>r([])));
   for(const c of b){
    if(c.name[0]==='.')continue;
    if(c.isFile){if(WANT(c.name))files.push(c);else L.skip++}
    else if(!SKIP_DIR.test(c.name))dirs.push(c)}}while(b.length&&id===scanId);
  const sub=p+en.name+'/';
  for(let i=0;i<files.length;i+=64){
   if(id!==scanId)return;
   await Promise.all(files.slice(i,i+64).map(c=>new Promise(r=>c.file(f=>{if(f&&id===scanId)add(f,sub);r()},()=>r()))));
   prog();await tick()}
  if(!files.length&&L.skip)prog();
  for(const d of dirs){if(id!==scanId)return;await walkE(d,sub,id)}}
 function collapse(){ /* start inside the chosen folder, skipping empty wrapper folders */
  let p='';
  for(;;){const pre=p?p+'/':'',s=new Set();let own=0;
   for(const x of L.items){
    if(p&&x.dir!==p&&!x.dir.startsWith(pre))continue;
    const r=p?(x.dir===p?'':x.dir.slice(pre.length)):x.dir;
    if(!r)own++;else s.add(r.split('/')[0])}
   if(own||s.size!==1)break;p=pre+[...s][0]}
  L.root=p;F.p=p;AF.p=p}
 function showScan(){
  if(appMode==='app'){axApp.hidden=false;renderApp(1)}
  else{o.hidden=false;render(1)}}
 function done(){
  collapse();
  if(curH){
   const nv=L.items.filter(x=>!x.a).length,na=L.items.length-nv,sz=total(L.items);
   tx('readwrite',s=>s.put({k:curH.name,h:curH,ts:Date.now(),nv,na,sz}))}
  say(L.items.length+' media file'+(L.items.length===1?'':'s')+' found'+(L.skip?' ('+L.skip+' non-media skipped)':''),3000);
  if(appMode==='app')openApp();else showLib()}
 async function fromHandle(h){
  const id=++scanId;reset(h.name);curH=h;L.scan=true;showScan();
  try{await walk(h,h.name+'/',id)}finally{if(id===scanId)L.scan=false}
  if(id===scanId)done()}
 async function tryAutoOpen(){
  if(autoTried||L.items.length||L.scan)return false;
  autoTried=1;
  const rc=((await tx('readonly',s=>s.getAll()))||[]).sort((a,b)=>b.ts-a.ts);
  for(const d of rc){
   if(d.h&&d.h.queryPermission){
    try{
     if((await d.h.queryPermission({mode:'read'}))==='granted'){fromHandle(d.h);return true}
    }catch{}}}
  return false}
 async function pick(){
  if(window.showDirectoryPicker){
   try{const h=await showDirectoryPicker({id:'axion',mode:'read'});tx('readwrite',s=>s.put({k:h.name,h,ts:Date.now()}));await fromHandle(h)}
   catch(e){if(e.name!=='AbortError')say('Could not open folder ('+e.name+')',4000)}}
  else inp.click()}
 inp.onchange=async()=>{
  const a=[...inp.files];inp.value='';if(!a.length)return;
  const id=++scanId,r0=a[0].webkitRelativePath;
  reset(r0?r0.split('/')[0]:'Selected files');
  L.scan=true;showScan();
  try{
   for(let i=0;i<a.length;i++){
    if(id!==scanId)return;
    const f=a[i],n=f.name;
    if(n[0]==='.')continue;
    if(!WANT(n)&&!/^(video|audio)\//i.test(f.type)){L.skip++;if((i&511)===511){prog();await tick()}continue}
    const r=f.webkitRelativePath||n;
    if(/(^|\/)\./.test(r))continue;
    add(f,r.slice(0,r.length-n.length));
    if((i&255)===255){prog();await tick()}}
  }finally{if(id===scanId)L.scan=false}
  if(id===scanId)done()};
 async function openRecent(k){
  const d=await tx('readonly',s=>s.get(k));if(!d)return;
  try{
   let p=d.h.queryPermission?await d.h.queryPermission({mode:'read'}):'prompt';
   if(p!=='granted'&&d.h.requestPermission)p=await d.h.requestPermission({mode:'read'});
   if(p!=='granted')return say('Permission not granted',3000)
  }catch{}
  try{await fromHandle(d.h)}catch{say('Folder is no longer available',4000);tx('readwrite',s=>s.delete(k));appMode==='app'?renderApp(1):render(1)}}

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
  while((!o.hidden||!axApp.hidden)&&run<(COARSE||!v.paused?1:2)&&Q.length){
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
 function watch(rootEl){
  io&&io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(e=>{
   if(!e.isIntersecting)return;io.unobserve(e.target);
   const x=view[+e.target.dataset.i];if(!x)return;
   Q.push({t:e.target,x,k:'v2|'+x.f.name+'|'+x.f.size+'|'+x.f.lastModified});pump()}),{root:rootEl,rootMargin:'300px'});
  rootEl.querySelectorAll('.li .th[data-i]').forEach(t=>{if(view[+t.dataset.i]&&!view[+t.dataset.i].a)io.observe(t)})}

 /* ---- shared row builder ---- */
 const row=(x,i,showDir)=>{
  const hs=hist[hk(x.f)],pg=hs&&hs.dur?Math.min(100,Math.round(100*hs.pos/hs.dur)):0;
  return'<button class="li'+(pl[pi]===x.f?' cur':'')+'" data-i="'+i+'"><span class="th'+(x.a?' au':'')+'" data-i="'+i+'"><span class="ic">'+ic(x.a?'music':'film')+'</span><em class="du"></em>'+(pg>1?'<i class="pg" style="width:'+pg+'%"></i>':'')+'</span>'+
   '<span class="tx"><span class="nm">'+esc(x.f.name)+'</span><small>'+MB(x.f.size)+(showDir?' · '+esc(cleanName(tail(x.dir||L.name))):'')+'</small></span></button>'};
 const total=a=>a.reduce((s,x)=>s+x.f.size,0);
 const cmpMap={name:(a,b)=>nat(a.dir+'/'+a.f.name,b.dir+'/'+b.f.name),new:(a,b)=>b.f.lastModified-a.f.lastModified,size:(a,b)=>b.f.size-a.f.size,small:(a,b)=>a.f.size-b.f.size};

 /* ---- Classic Library Render (#lib) — 100% original v5 ---- */
 async function render(top){
  if(top){more=300;body.scrollTop=0}
  o.classList.toggle('emp',!L.items.length);
  $('#libm').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.m===F.m));
  $('#libf').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.f===F.f));
  const curS=SORT.find(x=>x[0]===F.s)||SORT[0];
  sLbl.textContent=curS[1];
  sMenu.querySelectorAll('button').forEach(b=>{const on=b.dataset.s===F.s;b.classList.toggle('on',on);b.setAttribute('aria-selected',String(on))});
  if(!L.items.length){
   const rc=((await tx('readonly',s=>s.getAll()))||[]).sort((a,b)=>b.ts-a.ts).slice(0,6);
   $('#libt').textContent='Library';$('#libi').textContent='';
   if(L.scan){$('#libt').textContent=cleanName(L.name);$('#libi').textContent='';body.innerHTML='<div class="lm"><div class="big spin">'+ic('folderOpen')+'</div><p>Scanning audio &amp; video…</p><p id="libsc">0 media found</p></div>';return}
   body.innerHTML='<div class="lm"><div class="big">'+ic('folderOpen')+'</div><p>Choose a folder to browse every video and audio file inside it, including subfolders.</p></div><button class="go rf" id="libch">Choose folder</button>'+
    (rc.length?'<h6>Recent folders</h6>'+rc.map(d=>'<button class="li fo" data-r="'+esc(d.k)+'"><span class="th"><span class="ic">'+ic('folder')+'</span></span><span class="tx"><span class="nm">'+esc(cleanName(d.k))+'</span></span></button>').join(''):'');
   return}
  const q=F.q.toLowerCase(),tree=F.m==='tree'&&!q,P=F.p,
   ok=x=>(F.f==='all'||(F.f==='a')===x.a)&&(!q||x.f.name.toLowerCase().includes(q)),
   inP=x=>!P||x.dir===P||x.dir.startsWith(P+'/');
  all=L.items.filter(x=>ok(x)&&(!tree||inP(x))).sort(cmpMap[F.s]);
  let h='';
  if(tree){
   const D=new Map();view=[];
   for(const x of all){
    const r=P?(x.dir===P?'':x.dir.slice(P.length+1)):x.dir;
    if(!r)view.push(x);else{const n=r.split('/')[0],d=D.get(n)||{n,p:(P?P+'/':'')+n,c:0};d.c++;D.set(n,d)}}
   h+=[...D.values()].sort((a,b)=>nat(a.n,b.n)).map(d=>'<button class="li fo" data-d="'+esc(d.p)+'"><span class="th"><span class="ic">'+ic('folder')+'</span></span><span class="tx"><span class="nm">'+esc(cleanName(d.n))+'</span><small>'+d.c+' file'+(d.c>1?'s':'')+'</small></span></button>').join('')}
  else view=all;
  let g;
  view.slice(0,more).forEach((x,i)=>{
   if(!tree&&F.s==='name'&&x.dir!==g){g=x.dir;h+='<h6>'+esc(cleanName(x.dir||L.name))+'</h6>'}
   h+=row(x,i,F.m==='flat'||!!F.q)});
  if(view.length>more)h+='<button class="rf" id="libmore">Show more ('+(view.length-more)+')</button>';
  body.innerHTML=h||'<p class="lm">Nothing here</p>';
  const nv=all.filter(x=>!x.a).length,na=all.length-nv;
  $('#libt').textContent=q?cleanName(L.name)+' · search':(tree&&P?cleanName(tail(P)):cleanName(L.name));
  $('#libi').textContent=nv+' video'+(nv==1?'':'s')+' · '+na+' audio · '+MB(total(all));
  const c=$('#libc');
  if(!tree)c.innerHTML='';
  else{let acc='',s='<button data-d="" aria-label="Top">'+ic('home')+'</button>';
   (P?P.split('/'):[]).forEach(n=>{acc+=(acc?'/':'')+n;s+='<i>'+ic('chev')+'</i><button data-d="'+esc(acc)+'">'+esc(cleanName(n))+'</button>'});
   c.innerHTML=s;c.scrollLeft=c.scrollWidth}
  watch(body)}

 /* ---- Switchable App UI Render (#axapp) ---- */
 async function renderApp(top){
  if(top){more=300;aBody.scrollTop=0}
  axApp.classList.toggle('emp',!L.items.length);
  syncAppState();syncNP();
  const curS=SORT.find(x=>x[0]===AF.s)||SORT[0];
  aSLbl.textContent=curS[1];
  aSMenu.querySelectorAll('button').forEach(b=>{const on=b.dataset.s===AF.s;b.classList.toggle('on',on);b.setAttribute('aria-selected',String(on))});
  const atRoot=!AF.p||AF.p===L.root,canUp=!!(L.items.length&&AF.tab==='folders'&&!AF.q&&!atRoot);
  $('#axap-bk').hidden=!canUp;
  $('#axap-lg').style.display=canUp?'none':'';
  if(!L.items.length){
   const rc=((await tx('readonly',s=>s.getAll()))||[]).sort((a,b)=>b.ts-a.ts).slice(0,12);
   $('#axap-t').textContent='Axion';$('#axap-i').textContent=rc.length?'Tap a folder to open':'Folder & media player';
   $('#axap-c').innerHTML='';
   if(L.scan){$('#axap-t').textContent=cleanName(L.name);$('#axap-i').textContent='Scanning…';aBody.innerHTML='<div class="lm"><div class="big spin">'+ic('folderOpen')+'</div><p>Scanning audio &amp; video…</p><p id="axsc">0 media found</p></div>';return}
   if(rc.length){
    aBody.innerHTML='<div class="ahdr"><h6>Your folders</h6><button type="button" class="apick" id="axap-pf">'+ic('film')+'<span>Pick videos</span></button></div><div class="afg">'+
     rc.map(d=>{
      const auOnly=d.na>0&&!d.nv,
       pill=d.nv&&d.na?(d.nv+' vid · '+d.na+' aud'):d.nv?(d.nv+' video'+(d.nv>1?'s':'')):d.na?(d.na+' audio'):'Saved',
       sub=(d.nv||d.na)?(pill+(d.sz?' · '+MB(d.sz):'')):'Tap to open';
      return'<button class="li fo sv'+(auOnly?' au':'')+'" data-r="'+esc(d.k)+'"><span class="th"><span class="ic">'+ic(auOnly?'music':'folder')+'</span><em class="fbg">'+esc(pill)+'</em></span><span class="tx"><span class="nm">'+esc(cleanName(d.k))+'</span><small>'+esc(sub)+'</small></span><span class="rmf" data-rm="'+esc(d.k)+'" title="Remove">'+ic('x')+'</span></button>'}).join('')+
     '<button type="button" class="li fo addf" id="axap-ch"><span class="th"><span class="ic">'+ic('folderOpen')+'</span></span><span class="tx"><span class="nm">Add folder</span><small>Browse another folder</small></span></button></div>';
    return}
   const canDir=!!window.showDirectoryPicker;
   aBody.innerHTML='<div class="ahub"><div class="ao">'+ic('shield')+'</div><b>Folder &amp; media access</b>'+
    '<p>'+(canDir?'Allow read-only access to browse your folders, videos and audio like a native app. Everything stays on your device.':'Choose a folder or pick videos from your device to browse and play.')+'</p>'+
    '<div class="ab"><button type="button" class="go" id="axap-ch">'+ic('folderOpen')+'<span>'+(canDir?'Allow folder access':'Choose folder')+'</span></button>'+
    '<button type="button" class="ab2" id="axap-pf">'+ic('film')+'<span>Pick videos</span></button></div></div>';
   return}
  const q=AF.q.toLowerCase(),tree=AF.tab==='folders'&&!q,P=AF.p,
   ok=x=>(AF.tab==='folders'||(AF.tab==='audio')===x.a)&&(!q||x.f.name.toLowerCase().includes(q)),
   inP=x=>!P||x.dir===P||x.dir.startsWith(P+'/');
  all=L.items.filter(x=>ok(x)&&(!tree||inP(x))).sort(cmpMap[AF.s]);
  let h='';
  if(tree){
   const D=new Map();view=[];
   for(const x of all){
    const r=P?(x.dir===P?'':x.dir.slice(P.length+1)):x.dir;
    if(!r)view.push(x);
    else{
     const n=r.split('/')[0],d=D.get(n)||{n,p:(P?P+'/':'')+n,c:0,nv:0,na:0,sz:0,mt:0};
     d.c++;if(x.a)d.na++;else d.nv++;d.sz+=x.f.size;if(x.f.lastModified>d.mt)d.mt=x.f.lastModified;D.set(n,d)}}
   const dCmp={name:(a,b)=>nat(a.n,b.n),new:(a,b)=>b.mt-a.mt||nat(a.n,b.n),size:(a,b)=>b.sz-a.sz||nat(a.n,b.n),small:(a,b)=>a.sz-b.sz||nat(a.n,b.n)}[AF.s];
   const dirs=[...D.values()].sort(dCmp);
   if(dirs.length){
    h+='<div class="afg">'+dirs.map(d=>{
     const auOnly=d.na>0&&!d.nv,
      pill=d.nv&&d.na?(d.nv+' vid · '+d.na+' aud'):d.nv?(d.nv+' video'+(d.nv>1?'s':'')):(d.na+' audio');
     return'<button class="li fo'+(auOnly?' au':'')+'" data-d="'+esc(d.p)+'">'+
      '<span class="th"><span class="ic">'+ic(auOnly?'music':'folder')+'</span><em class="fbg">'+esc(pill)+'</em><span class="fpl" data-playd="'+esc(d.p)+'" title="Play folder">'+ic('play')+'</span></span>'+
      '<span class="tx"><span class="nm">'+esc(cleanName(d.n))+'</span><small>'+esc(pill)+' · '+MB(d.sz)+'</small></span>'+
      '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P.chev+'</svg></button>'}).join('')+'</div>';
    if(view.length)h+='<h6>Media ('+view.length+')</h6>'}}
  else view=all;
  let g;
  view.slice(0,more).forEach((x,i)=>{
   if(!tree&&AF.s==='name'&&x.dir!==g){g=x.dir;h+='<h6>'+esc(cleanName(x.dir||L.name))+'</h6>'}
   h+=row(x,i,!tree||!!AF.q)});
  if(view.length>more)h+='<button class="rf" id="axap-more">Show more ('+(view.length-more)+')</button>';
  aBody.innerHTML=h||'<p class="lm">No '+(AF.tab==='audio'?'audio':'media')+' found here</p>';
  const nv=all.filter(x=>!x.a).length,na=all.length-nv;
  $('#axap-t').textContent=q?cleanName(L.name)+' · search':(tree&&P?cleanName(tail(P)):(AF.tab==='videos'?'Videos':AF.tab==='audio'?'Audio':cleanName(L.name)));
  $('#axap-i').textContent=(AF.tab==='videos'?nv+' video'+(nv==1?'':'s'):AF.tab==='audio'?na+' audio':nv+' video'+(nv==1?'':'s')+(na?' · '+na+' audio':''))+' · '+MB(total(all));
  const c=$('#axap-c');
  if(!tree||atRoot)c.innerHTML='';
  else{
   const rel=L.root&&P.startsWith(L.root+'/')?P.slice(L.root.length+1):P;
   let acc=L.root||'',s='<button data-d="'+esc(L.root||'')+'">'+ic('home')+'<span>'+esc(cleanName(L.root?tail(L.root):L.name))+'</span></button>';
   (rel?rel.split('/'):[]).forEach(n=>{acc+=(acc?'/':'')+n;s+='<i>'+ic('chev')+'</i><button data-d="'+esc(acc)+'">'+esc(cleanName(n))+'</button>'});
   c.innerHTML=s;c.scrollLeft=c.scrollWidth}
  watch(aBody)}

 function appUp(){
  if(!AF.p||AF.p===L.root)return false;
  const nx=AF.p.includes('/')?AF.p.slice(0,AF.p.lastIndexOf('/')):'';
  AF.p=(L.root&&nx.length<L.root.length)?L.root:nx;
  renderApp(1);return true}
 function showLib(){o.hidden=false;loadHist().then(()=>render(1))}
 function openLib(){
  if(appMode==='app')return openApp();
  const c=pl[pi];
  if(pl.length>1&&!L.items.some(x=>x.f===c)){reset('Playlist');pl.forEach(f=>add(f,''))}
  const it=L.items.find(x=>x.f===c);
  if(it&&F.m==='tree')F.p=it.dir;
  o.hidden=false;
  loadHist().then(()=>render(1)).then(()=>{const g=body.querySelector('.li.cur');g&&g.scrollIntoView({block:'center'})})}
 async function openApp(){
  const c=pl[pi];
  if(pl.length&&!L.items.some(x=>x.f===c)){reset('Device files');pl.forEach(f=>add(f,''))}
  const it=L.items.find(x=>x.f===c);
  if(it&&AF.tab==='folders')AF.p=it.dir;
  else if(!AF.p&&L.root)AF.p=L.root;
  o.hidden=true;axApp.hidden=false;syncAppState();syncNP();
  if(!L.items.length&&!L.scan&&await tryAutoOpen())return;
  await loadHist();
  await renderApp(1);
  const g=aBody.querySelector('.li.cur');g&&g.scrollIntoView({block:'center'})}
 function close(){if(L.scan){scanId++;L.scan=false}setSortMenu(false);o.hidden=true;Q.length=0}
 function backToApp(){
  if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});
  el.set.hidden=true;el.qm.hidden=true;
  if(v.videoWidth&&!v.paused)v.pause();
  openApp()}
 function play(i,list){
  if(!list.length)return;
  pl=list.map(x=>x.f);playIdx(i);
  if(appMode==='app'){setAppSortMenu(false);setAppSet(false);axApp.hidden=true;Q.length=0}
  else close();
  window.axSave&&window.axSave(pl[pi])}

 /* ---- Classic Library Events (#lib) ---- */
 o.addEventListener('click',e=>{if(!e.target.closest('#libs'))setSortMenu(false)});
 sBtn.onclick=e=>{e.stopPropagation();setSortMenu(!sWrap.classList.contains('open'))};
 sMenu.onclick=e=>{const b=e.target.closest('button[data-s]');if(!b)return;F.s=b.dataset.s;setSortMenu(false);render(1)};
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
 sbBtn.onclick=()=>setSearch(!srEl.classList.contains('open'));
 $('#libqx').onclick=()=>setSearch(false);
 qInp.oninput=e=>{F.q=e.target.value.trim();render(1)};
 $('#libo').onclick=pick;$('#libx').onclick=close;
 $('#libp').onclick=()=>play(0,all);
 $('#libsh').onclick=()=>{const a=[...all];for(let i=a.length;i>1;){const j=Math.random()*i--|0;[a[i],a[j]]=[a[j],a[i]]}play(0,a)};

 /* ---- Switchable App UI Events (#axapp) ---- */
 axApp.addEventListener('click',e=>{if(!e.target.closest('#axap-s'))setAppSortMenu(false)});
 aSBtn.onclick=e=>{e.stopPropagation();setAppSortMenu(!aSWrap.classList.contains('open'))};
 aSMenu.onclick=e=>{const b=e.target.closest('button[data-s]');if(!b)return;AF.s=b.dataset.s;setAppSortMenu(false);renderApp(1)};
 aVwBtn.onclick=()=>{appView=isGridNow()?'list':'grid';try{localStorage.axAppView=appView}catch{}syncAppState()};
 aBody.onclick=async e=>{
  const pd=e.target.closest('[data-playd]');
  if(pd){e.stopPropagation();const dp=pd.dataset.playd,lst=L.items.filter(x=>x.dir===dp||x.dir.startsWith(dp+'/')).sort(cmpMap[AF.s]);return play(0,lst)}
  const rm=e.target.closest('[data-rm]');
  if(rm){e.stopPropagation();await tx('readwrite',s=>s.delete(rm.dataset.rm));return renderApp(1)}
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='axap-ch')return pick();
  if(b.id==='axap-pf'){pickClose=1;const fBtn=$('#of2')||$('#file');fBtn&&fBtn.click();return}
  if(b.id==='axap-more'){more+=300;return renderApp()}
  if(b.dataset.r)return openRecent(b.dataset.r);
  if(b.dataset.d!==undefined){AF.p=b.dataset.d;return renderApp(1)}
  if(b.dataset.i!==undefined)play(+b.dataset.i,view)};
 $('#axap-c').onclick=e=>{const b=e.target.closest('button');if(b){AF.p=b.dataset.d;renderApp(1)}};
 $('#axap-bk').onclick=appUp;
 $('#axap-fo').onclick=pick;
 aSbBtn.onclick=()=>setAppSearch(!aSrEl.classList.contains('open'));
 $('#axap-qx').onclick=()=>setAppSearch(false);
 aQInp.oninput=e=>{AF.q=e.target.value.trim();renderApp(1)};
 $('#axap-pl').onclick=()=>play(0,all);
 $('#axap-sh').onclick=()=>{const a=[...all];for(let i=a.length;i>1;){const j=Math.random()*i--|0;[a[i],a[j]]=[a[j],a[i]]}play(0,a)};
 $('#axapp-nav').onclick=e=>{const b=e.target.closest('button[data-tab]');if(!b)return;AF.tab=b.dataset.tab;renderApp(1)};
 aCfgBtn.onclick=()=>setAppSet(!axSet.classList.contains('on'));
 $('#axsx').onclick=()=>setAppSet(false);
 axSet.onclick=e=>{if(e.target===axSet)setAppSet(false)};
 $('#axs-mode').onclick=e=>{const b=e.target.closest('button[data-v]');if(b)setAppMode(b.dataset.v,true)};
 $('#axs-view').onclick=e=>{const b=e.target.closest('button[data-v]');if(!b)return;appView=b.dataset.v;try{localStorage.axAppView=appView}catch{}syncAppState()};
 $('#axs-th').onclick=e=>{const b=e.target.closest('button[data-v]');if(!b)return;if(typeof S==='object'&&typeof applyS==='function'){S.theme=b.dataset.v;applyS()}syncAppState()};
 aNp.onclick=e=>{
  if(e.target.closest('#axnp-b')){e.stopPropagation();v.paused?v.play().catch(()=>{}):v.pause();syncNP();return}
  axApp.hidden=true;Q.length=0};
 aNp.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();axApp.hidden=true;Q.length=0}};
 appBack.addEventListener('pointerdown',e=>e.stopPropagation());
 appBack.addEventListener('touchstart',e=>e.stopPropagation(),{passive:true});
 appBack.onclick=e=>{e.stopPropagation();backToApp()};

 /* ---- entry points: control-bar button, home button, Alt+L, Ctrl+F, folder drag & drop ---- */
 $('#ob').insertAdjacentHTML('afterend','<button id="obf">'+ic('folderOpen')+'Open folder</button>');
 $('#obf').onclick=openLib;
 const lb=document.createElement('button');lb.id='libb';lb.title='Library / playlist (Alt+L)';
 lb.innerHTML=ic('listVideo');
 $('#pip').before(lb);lb.onclick=openLib;
 addEventListener('keydown',e=>{
  if(e.key==='Escape'&&axSet.classList.contains('on')){e.preventDefault();e.stopPropagation();setAppSet(false);return}
  if(appMode==='app'){
   if(!axApp.hidden&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='f'&&L.items.length){e.preventDefault();setAppSearch(true);return}
   if(!axApp.hidden&&e.key==='/'&&L.items.length&&document.activeElement!==aQInp){e.preventDefault();setAppSearch(true);return}
   if(e.key==='Escape'){
    if(!axApp.hidden){if(aSWrap.classList.contains('open'))setAppSortMenu(false);else if(aSrEl.classList.contains('open'))setAppSearch(false);else if(AF.tab==='folders')appUp()}
    else if(el.set.hidden&&el.qm.hidden&&!document.fullscreenElement){e.preventDefault();backToApp()}
    return}
   if(e.altKey&&e.key.toLowerCase()==='l'){if(axApp.hidden)openApp();else if(st.classList.contains('has')&&curUrl)axApp.hidden=true}
   return}
  if(!o.hidden&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='f'&&L.items.length){e.preventDefault();setSearch(true);return}
  if(!o.hidden&&e.key==='/'&&L.items.length&&document.activeElement!==qInp){e.preventDefault();setSearch(true);return}
  if(e.key==='Escape'&&!o.hidden){if(sWrap.classList.contains('open'))setSortMenu(false);else if(srEl.classList.contains('open'))setSearch(false);else close()}
  else if(e.altKey&&e.key.toLowerCase()==='l'){if(o.hidden)openLib();else close()}});
 st.addEventListener('drop',async e=>{
  const en=[...(e.dataTransfer.items||[])].map(i=>i.webkitGetAsEntry&&i.webkitGetAsEntry()).filter(Boolean);
  if(!en.some(x=>x.isDirectory))return;
  e.preventDefault();e.stopImmediatePropagation();st.classList.remove('drag');
  const id=++scanId;reset(en[0].name);L.scan=true;showScan();
  try{for(const x of en)await walkE(x,'',id)}finally{if(id===scanId)L.scan=false}
  if(id===scanId)done()},true);

 /* ---- auto-attach same-name subtitle & sync App Player state ---- */
 v.addEventListener('loadstart',()=>{
  if(appMode==='app'&&curUrl&&st.classList.contains('has')){
   if(pickClose&&pl.length&&!L.items.some(x=>x.f===pl[0])){reset('Device files');pl.forEach(f=>add(f,''));AF.tab='videos'}
   pickClose=0;axApp.hidden=true}
  syncNP()});
 ['play','pause','ended','emptied','loadedmetadata'].forEach(n=>v.addEventListener(n,syncNP));
 v.addEventListener('timeupdate',()=>{if(appMode==='app'&&!axApp.hidden)syncNP()});
 v.addEventListener('loadedmetadata',()=>{
  const f=pl[pi],s=f&&L.subs[keyOf.get(f)];
  if(!s||!/^blob:/.test(curUrl))return;
  try{const d=new DataTransfer();d.items.add(s);$('#sub').files=d.files;$('#sub').dispatchEvent(new Event('change'))}catch{}});

 syncAppState();
 if(appMode==='app'&&!st.classList.contains('has')&&!/[?&](u|url|link|src|video)=/.test(location.search))openApp();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();