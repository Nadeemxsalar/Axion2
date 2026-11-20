/* Axion settings-ui.js: modern look for the Settings panel and the quality menu (CSS + slider fill) */
(()=>{
const I=(p,c,w)=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>')+'")',
 COG=I('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>','#171000'),
 GEN=I('<path d="M21 4h-7"/><path d="M10 4H3"/><path d="M21 12h-9"/><path d="M8 12H3"/><path d="M21 20h-5"/><path d="M12 20H3"/><path d="M14 2v4"/><path d="M8 10v4"/><path d="M16 18v4"/>','#000'),
 PIC=I('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>','#000'),
 PAL=I('<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/>','#000'),
 CC=I('<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M7 15h4"/><path d="M15 15h2"/><path d="M7 11h2"/><path d="M13 11h4"/>','#000'),
 OK=I('<path d="M20 6 9 17l-5-5"/>','#000',2.6),
 CHEV=I('<path d="m6 9 6 6 6-6"/>','#8a93ad',2.4),
 SRCH=I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>','#8a93ad');
const IC={
 gauge:'<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
 monitor:'<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
 vol:'<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
 music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
 cc:'<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M7 15h4"/><path d="M15 15h2"/><path d="M7 11h2"/><path d="M13 11h4"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
 hist:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
 contrast:'<circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/>',
 drop:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
 zoom:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>',
 rot:'<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
 pip:'<path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4"/><rect width="10" height="7" x="12" y="13" rx="2"/>',
 pal:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/>',
 type:'<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',
 skip:'<polygon points="5 4 15 12 5 20 5 4"/><path d="M19 5v14"/>',
 eyeoff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>',
 timer:'<path d="M10 2h4"/><path d="m12 14 3-3"/><circle cx="12" cy="14" r="8"/>',
 fit:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
 vmove:'<path d="M12 2v20"/><path d="m8 18 4 4 4-4"/><path d="m8 6 4-4 4 4"/>',
 hmove:'<path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/>',
 sq:'<rect width="18" height="18" x="3" y="3" rx="2"/>'},
 MAP=[[/audio track/,'music'],[/audio delay/,'clock'],[/quality/,'monitor'],[/speed/,'gauge'],[/resume/,'hist'],[/loop video/,'repeat'],[/volume boost/,'vol'],
  [/^subtitles$|^track$|subtitle track|show subtitles/,'cc'],[/delay/,'clock'],[/picture mode/,'fit'],[/zoom/,'zoom'],[/orientation/,'rot'],[/picture in picture/,'pip'],
  [/^theme/,'pal'],[/accent/,'drop'],[/title bar/,'type'],[/skip step/,'skip'],[/hide controls/,'eyeoff'],[/brightness/,'sun'],[/contrast/,'contrast'],
  [/saturation/,'drop'],[/sleep/,'timer'],[/^font|^size|^bold/,'type'],[/colour/,'pal'],[/height from bottom|move up/,'vmove'],[/text width/,'hmove'],[/background|^edge/,'sq']];

const CSS=`
#set{border-radius:22px;background:color-mix(in srgb,var(--panel) 92%,transparent);-webkit-backdrop-filter:blur(24px) saturate(1.5);backdrop-filter:blur(24px) saturate(1.5);border-color:color-mix(in srgb,var(--tx) 13%,transparent);box-shadow:0 28px 70px -14px #000b,inset 0 1px 0 #ffffff12;overflow:hidden;transform-origin:100% 100%}
#set::before{content:"";position:absolute;left:0;right:0;top:0;height:120px;background:radial-gradient(280px 110px at 85% 0,color-mix(in srgb,var(--ac) 24%,transparent),transparent);pointer-events:none;z-index:0}
#set>*{position:relative;z-index:1}
#set:not([hidden]),#qm:not([hidden]){animation:setPop .24s cubic-bezier(.2,.9,.3,1.1)}
@keyframes setPop{from{opacity:0;transform:translateY(12px) scale(.97)}}

#set .sh{padding:16px 12px 12px 18px;font-size:16px;letter-spacing:.01em}
#set .sh b{display:inline-flex;align-items:center;gap:11px;font-weight:700}
#set .sh b::before{content:"";width:32px;height:32px;border-radius:11px;background:${COG} center/18px no-repeat,var(--grad);box-shadow:0 6px 16px -4px color-mix(in srgb,var(--ac) 60%,transparent)}
#set .sh button{width:34px;height:34px;border-radius:50%;background:var(--btn);transition:transform .2s,background .15s}
#set .sh button:hover{background:var(--btnh);transform:rotate(90deg)}

#set .tabs{margin:0 16px 10px;padding:4px;gap:4px;border-radius:16px;background:color-mix(in srgb,var(--tx) 7%,transparent)}
#set .tabs .tab{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;padding:8px 4px 7px;border-radius:12px;font-size:11.5px;font-weight:600;white-space:nowrap;color:var(--mut);transition:background .15s,color .15s,box-shadow .15s}
#set .tabs .tab::before{content:"";width:18px;height:18px;background:currentColor;-webkit-mask:var(--ti) center/contain no-repeat;mask:var(--ti) center/contain no-repeat}
#set .tabs .tab[data-t=g]{--ti:${GEN}}#set .tabs .tab[data-t=p]{--ti:${PIC}}#set .tabs .tab[data-t=c]{--ti:${PAL}}#set .tabs .tab[data-t=s]{--ti:${CC}}
#set .tabs .tab:hover{color:var(--tx)}
#set .tabs .tab.on{background:var(--grad);color:#171000;box-shadow:0 6px 16px -6px color-mix(in srgb,var(--ac) 70%,transparent)}

#set .body{padding:2px 14px 10px;scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--tx) 25%,transparent) transparent}
#set .body::-webkit-scrollbar{width:6px}#set .body::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--tx) 22%,transparent);border-radius:6px}
#set .pane:not([hidden]){animation:setIn .22s ease-out}@keyframes setIn{from{opacity:0;transform:translateY(8px)}}

#set .it{padding:11px 12px;margin-bottom:6px;border:0;border-radius:14px;background:color-mix(in srgb,var(--tx) 5%,transparent);transition:background .15s}
#set .it:hover{background:color-mix(in srgb,var(--tx) 8%,transparent)}
#set .pane>.it:last-child{margin-bottom:0}
#set .it>span:first-child{font-weight:500;font-size:14px}
#set .it small{margin-top:3px;font-size:12px;line-height:1.35}
#set .gh{display:flex;align-items:center;gap:8px;margin:18px 4px 9px;color:var(--mut);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
#set .gh::before{content:"";width:3px;height:12px;border-radius:3px;background:var(--grad)}
#set .pane>.gh:first-child{margin-top:6px}

#set .it>button,#set .it .bt button{min-height:32px;padding:6px 14px;border-radius:10px;border:1px solid color-mix(in srgb,var(--ac) 32%,transparent);background:color-mix(in srgb,var(--ac) 14%,transparent);color:var(--act);font-size:13px;font-weight:600;transition:background .15s,transform .1s}
#set .it>button:hover,#set .it .bt button:hover{background:color-mix(in srgb,var(--ac) 25%,transparent)}
#set .it>button:active,#set .it .bt button:active{transform:scale(.96)}
#set select{-webkit-appearance:none;appearance:none;max-width:55%;padding:7px 30px 7px 12px;border-radius:10px;border:1px solid var(--line);background:var(--inp) ${CHEV} right 10px center/14px no-repeat;color:var(--tx);font-size:13px;font-weight:500;cursor:pointer}
#set button:focus-visible,#set select:focus-visible,#set .tg:focus-visible{outline:2px solid var(--ac);outline-offset:2px}

#set .it .seg{padding:3px;border-radius:12px;background:color-mix(in srgb,var(--tx) 8%,transparent)}
#set .it .seg button{padding:6px 11px;border-radius:9px;font-size:12.5px;font-weight:600;color:var(--mut)}
#set .it .seg button.on{background:var(--grad);color:#171000;box-shadow:0 3px 10px -3px color-mix(in srgb,var(--ac) 70%,transparent)}

#set .tg{width:46px;height:26px;border-radius:13px;background:var(--tgo);box-shadow:inset 0 1px 3px #0003;transition:background .2s}
#set .tg::after{top:3px;left:3px;width:20px;height:20px;transition:transform .25s cubic-bezier(.3,1.4,.5,1)}
#set .tg:checked{background:var(--grad)}#set .tg:checked::after{transform:translateX(20px)}

#set input[type=range]{-webkit-appearance:none;appearance:none;height:22px;background:transparent;cursor:pointer;--p:0%;--rt:color-mix(in srgb,var(--tx) 18%,transparent)}
#set input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:6px;background:linear-gradient(to right,var(--ac) var(--p),var(--rt) var(--p))}
#set input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;margin-top:-6px;border-radius:50%;background:#fff;border:3px solid var(--ac);box-shadow:0 2px 6px #0006;transition:transform .12s}
#set input[type=range]:active::-webkit-slider-thumb{transform:scale(1.2)}
#set input[type=range]::-moz-range-track{height:6px;border-radius:6px;background:var(--rt)}
#set input[type=range]::-moz-range-progress{height:6px;border-radius:6px;background:var(--ac)}
#set input[type=range]::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid var(--ac);box-shadow:0 2px 6px #0006}
#set .rg{gap:10px}#set .rg input[type=range]{width:116px}
#set .rg output,#set .rg .rv{min-width:50px;padding:3px 8px;border-radius:8px;background:color-mix(in srgb,var(--tx) 8%,transparent);color:var(--tx);font-size:12px;font-weight:600;text-align:center}

#set .dots{gap:9px}
#set .dots .dot,#set .dots .sdot{width:28px;height:28px;border:2px solid transparent;box-shadow:0 2px 6px #0004;transition:transform .15s,box-shadow .15s}
#set .dots .dot:hover,#set .dots .sdot:hover{transform:scale(1.12)}
#set .dots .dot.on,#set .dots .sdot.on{border-color:var(--panel);box-shadow:0 0 0 2px var(--tx),0 4px 10px #0005}
#set input[type=color]{width:34px;height:28px;border:2px solid var(--line);border-radius:8px}

#set .sf{padding:11px 16px;border-top:1px solid color-mix(in srgb,var(--tx) 10%,transparent);background:color-mix(in srgb,var(--tx) 4%,transparent)}
#set .sf>span{display:inline-flex;align-items:center;gap:7px}
#set .sf>span::before{content:"";width:14px;height:14px;background:#35c27a;-webkit-mask:${OK} center/contain no-repeat;mask:${OK} center/contain no-repeat}
#set .sf button{min-height:30px;padding:5px 12px;border-radius:10px;border:1px solid #ff6b6b45;background:#ff6b6b1a;color:#ff7b7b;font-weight:600;font-size:12.5px}
#set .sf button:hover{background:#ff6b6b2e}

#qm{border-radius:18px;padding:8px;background:color-mix(in srgb,var(--panel) 92%,transparent);-webkit-backdrop-filter:blur(24px) saturate(1.5);backdrop-filter:blur(24px) saturate(1.5);border-color:color-mix(in srgb,var(--tx) 13%,transparent);box-shadow:0 24px 60px -14px #000b,inset 0 1px 0 #ffffff12;transform-origin:100% 100%}
#qm .mh{padding:6px 10px 8px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
#qm button{align-items:center;padding:9px 12px;border-radius:11px;font-weight:500}
#qm button.on{background:color-mix(in srgb,var(--ac) 16%,transparent);color:var(--act);font-weight:600}
#qm button.on::after{content:"";width:16px;height:16px;background:currentColor;-webkit-mask:${OK} center/contain no-repeat;mask:${OK} center/contain no-repeat}

#set .it{flex-wrap:wrap;row-gap:10px}
#set .it[hidden],#set select[hidden]{display:none}
#set .it.ic{position:relative;padding-left:62px;min-height:58px}
#set .it.ic::before{content:"";position:absolute;left:12px;top:12px;width:34px;height:34px;border-radius:11px;background:linear-gradient(145deg,color-mix(in srgb,var(--ac) 28%,transparent),color-mix(in srgb,var(--ac) 9%,transparent));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ac) 22%,transparent)}
#set .it.ic::after{content:"";position:absolute;left:21px;top:21px;width:16px;height:16px;background:var(--act);-webkit-mask:var(--ri) center/contain no-repeat;mask:var(--ri) center/contain no-repeat}
#set .it .rg{display:contents}
#set .it .rg output,#set .it .rg .rv{order:1}
#set .it .rg input[type=range]{order:8;flex:1 1 100%;width:100%;margin:0}
#set .chips{order:9;flex:1 1 100%;display:flex;flex-wrap:wrap;gap:6px}
#set .chips button{min-height:30px;padding:5px 13px;border-radius:999px;border:1px solid var(--line);background:color-mix(in srgb,var(--tx) 5%,transparent);color:var(--mut);font-size:12.5px;font-weight:600;transition:background .15s,color .15s,border-color .15s,transform .1s}
#set .chips button:hover{color:var(--tx);border-color:color-mix(in srgb,var(--ac) 50%,var(--line))}
#set .chips button:active{transform:scale(.95)}
#set .chips button.on{background:var(--grad);color:#171000;border-color:transparent;box-shadow:0 4px 12px -4px color-mix(in srgb,var(--ac) 70%,transparent)}
#set .sha{display:flex;gap:6px}
#set .sq{padding:0 16px 10px}#set .sq[hidden]{display:none}
#set .sq input{display:block;width:100%;box-sizing:border-box;padding:10px 12px 10px 38px;border-radius:12px;border:1px solid var(--line);background:var(--inp) ${SRCH} left 12px center/16px no-repeat;color:var(--tx);font:inherit;font-size:14px}
#set .sq input:focus{outline:0;border-color:var(--ac)}
#set.searching .tabs{opacity:.35;pointer-events:none}#set.searching .gh{display:none}
#set .none{padding:30px 10px;text-align:center;color:var(--mut)}#set .none[hidden]{display:none}
@media(max-width:640px),(pointer:coarse) and (max-height:500px){
 #set,#qm{border-radius:22px 22px 18px 18px}
 #set::after{content:"";position:absolute;top:7px;left:50%;width:38px;height:4px;margin-left:-19px;border-radius:4px;background:color-mix(in srgb,var(--tx) 25%,transparent);z-index:2}
 #set .sh{padding-top:22px}
}
@media(pointer:coarse) and (max-height:500px) and (orientation:landscape){
 #set,#qm{border-radius:22px 0 0 22px}#set::after{display:none}#set .sh{padding-top:8px}
 #set .tabs .tab{flex-direction:row;justify-content:center;padding:6px 4px}
}`;

function init(){
 const set=document.getElementById('set');if(!set)return;
 const $=q=>set.querySelector(q),st=document.createElement('style');st.id='setui';st.textContent=CSS;document.head.appendChild(st);

 /* --- header: search button + search field --- */
 const sh=$('.sh'),sx=$('#sx'),sha=document.createElement('span'),sb=document.createElement('button'),sq=document.createElement('div');
 sha.className='sha';sb.id='setsb';sb.title='Search settings';sb.setAttribute('aria-label','Search settings');
 sb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';
 sh.append(sha);sha.append(sb);sx&&sha.append(sx);
 sq.className='sq';sq.hidden=true;sq.innerHTML='<input type="search" placeholder="Search settings…" autocomplete="off" aria-label="Search settings">';
 $('.tabs').before(sq);
 const inp=sq.firstChild,none=document.createElement('div');none.className='none';none.hidden=true;none.textContent='No matching settings';$('.body').append(none);
 function filter(restore){
  const q=inp.value.trim().toLowerCase(),rows=set.querySelectorAll('.pane .it');
  if(!q){set.classList.remove('searching');rows.forEach(r=>r.hidden=false);none.hidden=true;if(restore){const t=$('.tab.on');t&&t.click()}return}
  set.classList.add('searching');set.querySelectorAll('.pane').forEach(p=>p.hidden=false);
  let n=0;rows.forEach(r=>{const m=((r.querySelector('span')||r).textContent||'').toLowerCase().includes(q);r.hidden=!m;if(m)n++});
  none.hidden=n>0}
 inp.oninput=()=>filter(true);
 sb.onclick=()=>{sq.hidden=!sq.hidden;if(sq.hidden){inp.value='';filter(true)}else inp.focus()};
 $('.tabs').addEventListener('click',()=>{if(inp.value){inp.value='';filter(false)}},true);

 /* --- row icons --- */
 const URL_=k=>I(IC[k],'#000');
 function icons(){
  set.querySelectorAll('.pane .it:not(.ic)').forEach(r=>{
   const sp=r.querySelector('span'),f=sp&&sp.firstChild,t=f&&f.nodeType===3?f.textContent.trim().toLowerCase():'';
   const m=t&&MAP.find(x=>x[0].test(t));
   if(m){r.classList.add('ic');r.style.setProperty('--ri',URL_(m[1]))}})}

 /* --- selects with few short options become tappable chips (the real select stays, hidden, so the app keeps working) --- */
 const sync=sel=>sel._box&&[...sel._box.children].forEach(b=>b.classList.toggle('on',b.dataset.v===sel.value));
 function chips(){
  set.querySelectorAll('select').forEach(sel=>{
   const o=[...sel.options];
   if(sel._box&&sel._n===o.length){sync(sel);return}
   if(sel._box){sel._box.remove();sel._box=null;sel.hidden=false}
   const tot=o.reduce((a,x)=>a+x.text.length,0),row=sel.closest('.it');
   if(!row||o.length<2||o.length>8||tot>52)return;
   const box=document.createElement('div');box.className='chips';
   o.forEach(x=>{const b=document.createElement('button');b.type='button';b.dataset.v=x.value;b.textContent=x.text;box.append(b)});
   box.onclick=e=>{const b=e.target.closest('button');if(!b)return;e.preventDefault();sel.value=b.dataset.v;
    sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));sync(sel)};
   sel.hidden=true;sel._box=box;sel._n=o.length;row.append(box);sync(sel)})}

 /* --- filled part of the sliders --- */
 const fill=r=>{const a=+r.min||0,b=r.max===''?100:+r.max;r.style.setProperty('--p',Math.max(0,Math.min(100,(+r.value-a)/((b-a)||1)*100))+'%')},
  all=()=>{icons();chips();set.querySelectorAll('input[type=range]').forEach(fill)};
 set.addEventListener('input',e=>{if(e.target.matches&&e.target.matches('input[type=range]'))fill(e.target)},true);
 set.addEventListener('click',()=>setTimeout(all,0),true);
 new MutationObserver(()=>{if(set.hidden){if(inp.value){inp.value='';filter(false)}sq.hidden=true}all()}).observe(set,{attributes:true,attributeFilter:['hidden']});
 all();setTimeout(all,600);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();