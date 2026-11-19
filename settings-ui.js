/* Axion settings-ui.js: modern look for the Settings panel and the quality menu (CSS + slider fill) */
(()=>{
const I=(p,c,w)=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>')+'")',
 COG=I('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>','#171000'),
 GEN=I('<path d="M21 4h-7"/><path d="M10 4H3"/><path d="M21 12h-9"/><path d="M8 12H3"/><path d="M21 20h-5"/><path d="M12 20H3"/><path d="M14 2v4"/><path d="M8 10v4"/><path d="M16 18v4"/>','#000'),
 PIC=I('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>','#000'),
 PAL=I('<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/>','#000'),
 CC=I('<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M7 15h4"/><path d="M15 15h2"/><path d="M7 11h2"/><path d="M13 11h4"/>','#000'),
 OK=I('<path d="M20 6 9 17l-5-5"/>','#000',2.6),
 CHEV=I('<path d="m6 9 6 6 6-6"/>','#8a93ad',2.4);

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
 const s=document.createElement('style');s.id='setui';s.textContent=CSS;document.head.appendChild(s);
 /* filled part of the sliders (CSS can't know the value, so it is set here) */
 const fill=r=>{const a=+r.min||0,b=r.max===''?100:+r.max;r.style.setProperty('--p',Math.max(0,Math.min(100,(+r.value-a)/((b-a)||1)*100))+'%')},
  all=()=>set.querySelectorAll('input[type=range]').forEach(fill);
 set.addEventListener('input',e=>{if(e.target.matches&&e.target.matches('input[type=range]'))fill(e.target)},true);
 set.addEventListener('click',()=>setTimeout(all,0),true);
 new MutationObserver(all).observe(set,{attributes:true,attributeFilter:['hidden']});
 all();setTimeout(all,600);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();