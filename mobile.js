/* Axion mobile.js: better touch experience (everything here is additive, desktop keeps working as before)
1. double-tap left / right to skip, keep tapping to skip more (ripple + running total)
2. animated gesture HUD: volume and brightness bars, big seek time while swiping, 2x speed badge
3. one tap shows / hides the controls at once (setting: tap can still play / pause), centre double-tap = play / pause
4. small vibration on gestures (setting)
5. screen lock: no accidental touches, hold the lock pill to unlock
6. thin progress line while the controls are hidden (setting)
7. auto title for direct links + rotate, audio & subtitle icons below the top title on mobile (XPlayer / PLAYit style) */
(()=>{
const SKIP='#ctl,#bp,#set,#qm,#empty,#stats,#err,#wb,#eg,#aud,#aub,#ccb,#qb,#gear,#qs,#pl,#axlockb,#axlockov,#axunl,#axtr,#axapp-back';
const CSS=`
#stage *{-webkit-tap-highlight-color:transparent}
#msg.axq{opacity:0!important;transition:none!important}
#spin{animation:r .9s linear infinite,axsf .25s ease .35s backwards}
@keyframes axsf{from{opacity:0}}
#stage.paused #bp{animation:axbp .22s cubic-bezier(.2,.8,.2,1)}
@keyframes axbp{from{opacity:0;transform:scale(.7)}}
#axm{position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden;container-type:size}
#axm .rp{position:absolute;top:0;bottom:0;width:38%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#fff;background:rgba(255,255,255,.17);opacity:0;will-change:transform,opacity;font-weight:600;font-size:14px;text-shadow:0 1px 6px #0008}
#axm .rp.l{left:0;border-radius:0 100% 100% 0/0 50% 50% 0}
#axm .rp.r{right:0;border-radius:100% 0 0 100%/50% 0 0 50%}
#axm .ch{display:flex;gap:3px}
#axm .ch i{width:11px;height:19px;background:#fff;opacity:.25;clip-path:polygon(0 0,100% 50%,0 100%);border-radius:2px}
#axm .rp.l .ch i{transform:scaleX(-1)}
#axm .hud{position:absolute;top:50%;display:flex;flex-direction:column;align-items:center;gap:7px;padding:10px 10px;border-radius:18px;background:rgba(14,17,27,.66);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-size:12px;font-weight:600;opacity:0;transform:translateY(-50%) scale(.9);transition:opacity .16s,transform .16s;will-change:transform,opacity}
#axm .hud.on{opacity:1;transform:translateY(-50%) scale(1)}
#axm .hud.v{right:max(14px,env(safe-area-inset-right))}
#axm .hud.b{left:max(14px,env(safe-area-inset-left))}
#axm .hud .bar{position:relative;width:6px;height:clamp(44px,14vh,128px);height:clamp(44px,27cqh,128px);border-radius:3px;background:rgba(255,255,255,.22);overflow:hidden}
#axm .hud .bar i{position:absolute;inset:0;border-radius:3px;background:var(--ac,#f5b83d);transform-origin:bottom;transform:scaleY(.5);transition:transform .09s linear}
#axm .hud svg{width:20px;height:20px}
#axm .sk{position:absolute;top:50%;left:50%;display:flex;flex-direction:column;align-items:center;padding:12px 22px;border-radius:18px;background:rgba(14,17,27,.66);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;opacity:0;transform:translate(-50%,-50%) scale(.92);transition:opacity .16s,transform .16s}
#axm .sk.on{opacity:1;transform:translate(-50%,-50%) scale(1)}
#axm .sk b{font-size:28px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.15}
#axm .sk small{font-size:14px;opacity:.8}
#axm .fast{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));left:50%;padding:6px 14px;border-radius:99px;background:rgba(14,17,27,.7);color:#fff;font-weight:700;font-size:13px;opacity:0;transform:translate(-50%,-8px);transition:opacity .16s,transform .16s}
#axm .fast.on{opacity:1;transform:translate(-50%,0)}
#axm .pop{position:absolute;top:50%;left:50%;width:76px;height:76px;margin:-38px;border-radius:50%;background:rgba(14,17,27,.66);display:grid;place-items:center;color:#fff;opacity:0}
#axm .pop svg{width:30px;height:30px;margin-left:3px}
#axmini{position:absolute;left:0;right:0;bottom:0;height:3px;z-index:3;background:rgba(255,255,255,.2);opacity:0;pointer-events:none;transition:opacity .25s}
#axmini i{display:block;height:100%;background:var(--ac,#f5b83d);transform-origin:left;transform:scaleX(0);transition:transform .35s linear}
#axlockb{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));right:max(12px,env(safe-area-inset-right));z-index:3;width:40px;height:40px;padding:0;border-radius:50%;background:rgba(14,17,27,.62);color:#fff;display:none;place-items:center;opacity:0;pointer-events:none;transition:opacity .25s,transform .12s}
#axlockb:active{transform:scale(.9)}
#axlockb svg{width:20px;height:20px}
#axtr{position:absolute;top:calc(48px + env(safe-area-inset-top,0px));left:max(14px,env(safe-area-inset-left));z-index:3;display:none;align-items:center;gap:8px;opacity:0;pointer-events:none;transition:opacity .25s}
#axtr[hidden],#axtr button[hidden]{display:none!important}
#stage.axnottl #axtr{top:calc(10px + env(safe-area-inset-top,0px))}
body.ax-app #axtr{top:calc(62px + env(safe-area-inset-top,0px))}
body.ax-app #stage.axnottl #axtr{top:calc(13px + env(safe-area-inset-top,0px));left:max(62px,calc(54px + env(safe-area-inset-left,0px)))}
#axtr button{width:36px;height:36px;min-height:0;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:rgba(14,17,27,.64);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:#fff;display:grid;place-items:center;transition:transform .12s,background-color .15s}
#axtr button:active{transform:scale(.9);background:rgba(14,17,27,.86)}
#axtr svg{width:18px;height:18px;display:block}
#axlockov{position:absolute;inset:0;z-index:5;display:none;touch-action:none}
#stage.axlocked #axlockov{display:block}
#axunl{position:absolute;left:50%;bottom:calc(22% + env(safe-area-inset-bottom,0px));transform:translate(-50%,10px);display:flex;align-items:center;gap:10px;padding:12px 20px;border-radius:99px;background:rgba(14,17,27,.82);color:#fff;font-weight:600;font-size:14px;opacity:0;pointer-events:none;overflow:hidden;transition:opacity .2s,transform .2s;user-select:none;-webkit-user-select:none}
#axunl.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}
#axunl svg{width:18px;height:18px;flex:none}
#axunl .rg{position:absolute;left:0;top:0;bottom:0;width:100%;background:color-mix(in srgb,var(--ac,#f5b83d) 55%,transparent);transform:scaleX(0);transform-origin:left;pointer-events:none}
#axunl.hold .rg{transform:scaleX(1);transition:transform .65s linear}
#axunl span{position:relative}
#stage.axmenu #axlockb,#stage.axmenu #axtr{opacity:0!important;pointer-events:none!important} /* Settings / menu open: keep top icons out of the way */
#stage.axhud #ctl,#stage.axhud #ttl,#stage.axhud #axlockb,#stage.axhud #axtr{opacity:0!important;pointer-events:none!important}
#stage.axlocked #ctl,#stage.axlocked #ttl,#stage.axlocked #axlockb,#stage.axlocked #axtr{opacity:0!important;pointer-events:none!important}
@media(pointer:coarse){
 /* the empty gradient above the buttons used to swallow every touch: only the real controls take touches now, so swipes and taps work on the whole picture */
 #ctl{pointer-events:none}#ctl>*{pointer-events:auto}#stage.idle #ctl>*{pointer-events:none}
 #ctl #aub,#ctl #ccb{display:none!important}
 #axlockb{display:grid}
 #axtr{display:flex}
 #stage.has:not(.web):not(.failed):not(.idle):not(.axlocked) #axlockb,#stage.has:not(.web):not(.failed):not(.idle):not(.axlocked) #axtr{opacity:1;pointer-events:auto}
 #stage.has:not(.web):not(.failed) #ttl{padding-right:max(64px,calc(56px + env(safe-area-inset-right,0px)))}
 #bar::before{content:"";position:absolute;left:0;right:0;top:-16px;bottom:-4px}
 #stage.has.idle:not(.web):not(.failed):not(.axmini-off) #axmini,#stage.has.axlocked:not(.web):not(.failed):not(.axmini-off) #axmini{opacity:1}
}
/* keep 9:16 portrait videos & bottom control bar (including Fullscreen button) cleanly inside narrow mobile screens */
@media(pointer:coarse) and (max-width:640px){
 #stage.vert{width:100%!important;max-width:100%!important}
 #ctl{left:0;right:0;width:100%;max-width:100%;box-sizing:border-box;padding-left:max(8px,env(safe-area-inset-left));padding-right:max(8px,env(safe-area-inset-right))}
 #ctl .row{gap:2px;max-width:100%;min-width:0;flex-wrap:nowrap}
 #ctl .row>*{min-width:0}
 #ctl .row button{flex:0 0 auto;min-width:34px;width:34px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center}
 #ctl .row button[hidden]{display:none!important}
 #ctl .row button#qb,#ctl .row button#spb{width:auto;min-width:0;padding:0 7px;font-size:12px}
 #ctl .row .sp{flex:1 1 0;min-width:2px}
 #ctl .row .tm,#ctl .row #tm{font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:0 1 auto;padding:0 2px}
 #ctl .row input[type=range]{display:none!important}
}
@media(pointer:coarse) and (max-width:390px){
 #ctl .row{gap:1px}
 #ctl .row button{min-width:30px;width:30px;height:34px}
 #ctl .row button svg{width:18px;height:18px}
 #ctl .row button#qb,#ctl .row button#spb{width:auto;padding:0 6px;font-size:11px}
 #ctl .row .tm,#ctl .row #tm{font-size:10.5px}
}
@media(pointer:coarse) and (max-height:500px) and (orientation:landscape){
 #axtr{top:calc(42px + env(safe-area-inset-top,0px));left:max(16px,env(safe-area-inset-left))}
 #stage.axnottl #axtr{top:calc(10px + env(safe-area-inset-top,0px))}
 body.ax-app #axtr{top:calc(54px + env(safe-area-inset-top,0px))}
 body.ax-app #stage.axnottl #axtr{top:calc(10px + env(safe-area-inset-top,0px));left:max(56px,calc(48px + env(safe-area-inset-left,0px)))}
}
/* not needed in full screen */
#stage:fullscreen #axmini{opacity:0!important}
#stage:-webkit-full-screen #axmini{opacity:0!important}
@media(prefers-reduced-motion:reduce){#axm .hud,#axm .sk,#axm .fast,#axmini i,#axunl,#axtr{transition:none}#stage.paused #bp{animation:none}}
`;
const SVG={
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
 lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
 rot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3.5a9 9 0 0 1 5 5.5"/><path d="M20.5 5v4h-4"/><path d="M8.5 20.5a9 9 0 0 1-5-5.5"/><path d="M3.5 19v-4h4"/><rect x="8.5" y="6.5" width="7" height="11" rx="1.5" transform="rotate(-45 12 12)"/></svg>',
 aud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
 cc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M10.5 10.5a2.5 2.5 0 1 0 0 3"/><path d="M17.5 10.5a2.5 2.5 0 1 0 0 3"/></svg>',
 vol0:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6m0-6-5 6"/></svg>',
 vol1:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5"/></svg>',
 vol2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
 sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>'};

function init(){
 const st=document.getElementById('stage'),v=document.getElementById('v');if(!st||!v)return;
 const COARSE=matchMedia('(pointer:coarse)').matches,RM=matchMedia('(prefers-reduced-motion:reduce)');
 let P={tap:'controls',hap:true,mini:true};try{Object.assign(P,JSON.parse(localStorage.axionMob))}catch{}
 const save=()=>{try{localStorage.axionMob=JSON.stringify(P)}catch{}};
 let lastTouch=-1e9;const touchy=()=>COARSE||performance.now()-lastTouch<4000;
 const buzz=p=>{if(P.hap&&navigator.vibrate)try{navigator.vibrate(p)}catch{}};
 const F=t=>typeof fmt==='function'?fmt(t):Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
 const has=()=>st.classList.contains('has')&&!st.classList.contains('web')&&!st.classList.contains('failed');
 document.head.insertAdjacentHTML('beforeend','<style>'+CSS+'</style>');

 /* ---------- elements ---------- */
 const chev='<span class="ch"><i></i><i></i><i></i></span>';
 const layer=document.createElement('div');layer.id='axm';layer.setAttribute('aria-hidden','true');
 layer.innerHTML='<div class="rp l">'+chev+'<span>10 seconds</span></div><div class="rp r">'+chev+'<span>10 seconds</span></div>'+
  '<div class="hud v"><span class="ic"></span><div class="bar"><i></i></div><b>50%</b></div>'+
  '<div class="hud b"><span class="ic"></span><div class="bar"><i></i></div><b>100%</b></div>'+
  '<div class="sk"><b>0:00</b><small>+0s</small></div><div class="fast">2× speed</div><div class="pop">'+SVG.play+'</div>';
 const mini=document.createElement('div');mini.id='axmini';mini.innerHTML='<i></i>';
 const lockB=document.createElement('button');lockB.id='axlockb';lockB.type='button';lockB.title='Lock screen';lockB.setAttribute('aria-label','Lock screen');lockB.innerHTML=SVG.lock;
 const trBar=document.createElement('div');trBar.id='axtr';trBar.hidden=true;
 trBar.innerHTML='<button id="axrot" type="button" title="Rotate screen" aria-label="Rotate screen" hidden>'+SVG.rot+'</button>'+
  '<button id="axaub" type="button" title="Audio track" aria-label="Audio track" hidden>'+SVG.aud+'</button>'+
  '<button id="axccb" type="button" title="Subtitles" aria-label="Subtitles" hidden>'+SVG.cc+'</button>';
 const ov=document.createElement('div');ov.id='axlockov';
 ov.innerHTML='<div id="axunl"><i class="rg"></i>'+SVG.lock+'<span>Hold to unlock</span></div>';
 st.append(layer,mini,lockB,trBar,ov);
 const q=s=>layer.querySelector(s),rp={l:q('.rp.l'),r:q('.rp.r')},hud={v:q('.hud.v'),b:q('.hud.b')},skb=q('.sk'),fast=q('.fast'),pop=q('.pop'),unl=ov.firstChild;
 st.classList.toggle('axmini-off',!P.mini);

 /* ---------- settings rows (Settings > General) ---------- */
 const pane=document.querySelector('#set .pane[data-p="g"]');
 if(pane){
  const f=document.createElement('div');
  f.innerHTML='<div class="gh">Touch</div>'+
   '<label class="it"><span>Tap on video<small>Double-tap the sides to skip</small></span><select id="axm-tap"><option value="controls">Show / hide controls</option><option value="play">Play / pause</option></select></label>'+
   '<label class="it"><span>Vibration<small>Small buzz on gestures</small></span><input type="checkbox" class="tg" id="axm-hap"></label>'+
   '<label class="it"><span>Mini progress bar<small>Shown while the controls are hidden</small></span><input type="checkbox" class="tg" id="axm-mini"></label>';
  const first=(document.getElementById('axlb')||document.getElementById('axdb')||{}).closest?.('.it'); /* above "Check this link" / Diagnostics */
  while(f.firstChild)pane.insertBefore(f.firstChild,first||null);
  const t=document.getElementById('axm-tap'),h=document.getElementById('axm-hap'),m=document.getElementById('axm-mini');
  t.value=P.tap;h.checked=!!P.hap;m.checked=!!P.mini;
  t.onchange=()=>{P.tap=t.value;save()};
  h.onchange=()=>{P.hap=h.checked;save();if(P.hap)buzz(20)};
  m.onchange=()=>{P.mini=m.checked;save();st.classList.toggle('axmini-off',!P.mini)}}

 /* ---------- small animation helper ---------- */
 const play=(el,frames,o)=>{el.getAnimations().forEach(a=>a.cancel());return el.animate(frames,o)};

 /* ---------- 1. double-tap skip ---------- */
 function ripple(side,total){
  const el=rp[side],o=rp[side==='l'?'r':'l'];
  o.getAnimations().forEach(a=>a.cancel());
  el.lastChild.textContent=total+' seconds';
  play(el,[{opacity:0},{opacity:1,offset:.1},{opacity:1,offset:.78},{opacity:0}],{duration:780,easing:'ease-out'});
  if(!RM.matches)el.animate([{transform:'scale(.84)'},{transform:'scale(1)'}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'});
  [...el.querySelectorAll('.ch i')].forEach((c,i)=>{const d=(side==='l'?2-i:i)*90;play(c,[{opacity:.25},{opacity:1,offset:.5},{opacity:.25}],{duration:540,delay:d})})}
 let lastTap=null,chain=null,goT=0;
 const hideCtl=()=>{clearTimeout(idle);st.classList.add('idle')};
 function skip(side){
  const step=+S.step||10;chain.t=performance.now();chain.count++;
  seekBy(side==='r'?step:-step);
  clearTimeout(goT);goT=setTimeout(()=>{if(sk!==null)seekGo()},140); /* the picture follows at once, not after the usual 350 ms wait */
  ripple(side,chain.count*step);buzz(10)}
 function popPlay(){
  if(RM.matches)return;
  const a=play(pop,[{opacity:0,transform:'scale(.6)'},{opacity:1,transform:'scale(1)',offset:.35},{opacity:0,transform:'scale(1.25)'}],{duration:520,easing:'ease-out'});return a}
 function center(){
  const was=v.paused;tog();buzz(15);
  if(was){popPlay();hideCtl()}else showCtl()}
 function single(t){
  if(P.tap==='play'){tog();return}
  if(!t.idle&&!v.paused)hideCtl()} /* hidden controls were already shown by the touch itself */
 function onTap(t){
  const r=st.getBoundingClientRect(),fx=(t.x-r.left)/r.width,side=fx<.35?'l':fx>.65?'r':'c',now=performance.now();
  if(chain&&now-chain.t<650&&side!=='c'&&side===chain.side){skip(side);return}
  if(lastTap&&now-lastTap.t<320&&Math.hypot(t.x-lastTap.x,t.y-lastTap.y)<70){
   lastTap=null;
   if(P.tap==='play')tog(); /* take back the pause / play of the first tap */
   if(side==='c'){if(P.tap==='play')fs();else center();return}
   chain={side,count:0,t:now};hideCtl();skip(side);return}
  lastTap={t:now,x:t.x,y:t.y};single(t)}

 let tp=null;const act=new Set();
 st.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='touch')return;
  lastTouch=performance.now();act.add(e.pointerId);
  if(act.size>1&&tp)tp.multi=1;
  const ok=!e.target.closest(SKIP)&&has()&&!st.classList.contains('axlocked')&&act.size===1&&Z===1,now=performance.now();
  tp=ok?{id:e.pointerId,x:e.clientX,y:e.clientY,t:now,idle:st.classList.contains('idle'),d:0}:null;
  /* the second tap of a double-tap (or a tap while skipping) must not flash the controls or start a swipe */
  if(tp&&((lastTap&&now-lastTap.t<320)||(chain&&now-chain.t<650)))e.stopPropagation()},true);
 st.addEventListener('pointermove',e=>{if(tp&&e.pointerId===tp.id)tp.d=Math.max(tp.d,Math.hypot(e.clientX-tp.x,e.clientY-tp.y))});
 const up=e=>{
  act.delete(e.pointerId);if(e.pointerType==='touch')lastTouch=performance.now();
  if(!tp||e.pointerId!==tp.id)return;
  const t=tp;tp=null;
  if(e.type==='pointercancel'||t.multi||t.d>12||performance.now()-t.t>350)return;
  onTap(t)};
 addEventListener('pointerup',up,true);addEventListener('pointercancel',up,true);
 /* the browser's own click / double-click that follows a touch would pause the video again or skip twice */
 const eat=e=>{if(performance.now()-lastTouch<700&&has()&&!e.target.closest(SKIP)){e.stopPropagation();e.preventDefault()}};
 st.addEventListener('click',eat,true);st.addEventListener('dblclick',eat,true);
 ['mousemove','mousedown','mouseup'].forEach(n=>st.addEventListener(n,e=>{if(performance.now()-lastTouch<800&&!e.target.closest(SKIP))e.stopPropagation()},true));

 /* ---------- 2. gesture HUD (replaces the small text toast on touch) ---------- */
 const msg=document.getElementById('msg'),ht={},lim={};
 let ft=0;const flag=ms=>{st.classList.add('axhud');clearTimeout(ft);ft=setTimeout(()=>st.classList.remove('axhud'),ms)}; /* controls step aside while a HUD is up */
 const showHud=(k,val,txt,icon)=>{flag(950);const h=hud[k];h.querySelector('.ic').innerHTML=icon;h.querySelector('i').style.transform='scaleY('+Math.max(0,Math.min(1,val))+')';h.querySelector('b').textContent=txt;
  h.classList.add('on');clearTimeout(ht[k]);ht[k]=setTimeout(()=>h.classList.remove('on'),900)};
 const limit=(k,at)=>{if(at&&!lim[k])buzz(14);lim[k]=at};
 let skT2=0;
 const showSk=d=>{const dur=v.duration,t=Math.max(0,Math.min(isFinite(dur)?dur:1e9,v.currentTime+d));
  flag(750);skb.querySelector('b').textContent=F(t);skb.querySelector('small').textContent=(d>0?'+':d<0?'\u2212':'')+Math.abs(d)+'s';
  skb.classList.add('on');clearTimeout(skT2);skT2=setTimeout(()=>skb.classList.remove('on'),700)};
 if(msg)new MutationObserver(()=>{
  msg.classList.remove('axq');
  if(!touchy())return;
  const m=msg.textContent;let x;
  const quiet=()=>msg.classList.add('axq');
  if(x=/^Volume (\d+)%$/.exec(m)){const p=Math.max(0,Math.min(1,+x[1]/100));showHud('v',p,Math.round(p*100)+'%',p<=0?SVG.vol0:p<.5?SVG.vol1:SVG.vol2);limit('v',p<=0||p>=1);quiet()}
  else if(x=/^Brightness (\d+)%$/.exec(m)){const b=+x[1];showHud('b',(b-50)/100,b+'%',SVG.sun);limit('b',b<=50||b>=150);quiet()}
  else if(x=/^([+\-\u2212]?\d+)s$/.exec(m)){showSk(+x[1].replace('\u2212','-'));quiet()}
  else if(m==='2\u00d7 speed'){fast.classList.add('on');buzz(22);quiet()}
  else if(m==='Normal speed'){fast.classList.remove('on');quiet()}
 }).observe(msg,{childList:true,characterData:true,subtree:true});
 v.addEventListener('emptied',()=>{fast.classList.remove('on');skb.classList.remove('on')});

 /* ---------- 5. screen lock ---------- */
 const setEl=document.getElementById('set'),qmEl=document.getElementById('qm');
 const menuOpen=()=>st.classList.toggle('axmenu',!!((setEl&&!setEl.hidden)||(qmEl&&!qmEl.hidden)));
 [setEl,qmEl].forEach(e=>e&&new MutationObserver(menuOpen).observe(e,{attributes:true,attributeFilter:['hidden']}));menuOpen();
 let utimer=0,hold=0;
 const stop=e=>e.stopPropagation();
 lockB.addEventListener('pointerdown',stop);lockB.addEventListener('pointerup',stop);
 lockB.addEventListener('click',e=>{e.stopPropagation();lock()});
 function lock(){st.classList.add('axlocked');hideCtl();closeMenus();buzz(30);say('Screen locked',1400)}
 function closeMenus(){try{document.getElementById('set').hidden=true;document.getElementById('qm').hidden=true}catch{}}
 function unlock(){clearTimeout(hold);unl.classList.remove('hold','on');st.classList.remove('axlocked');buzz([20,40,20]);showCtl();say('Unlocked',1200)}
 ['pointerdown','pointermove','pointerup','click','dblclick','contextmenu'].forEach(n=>ov.addEventListener(n,e=>{e.stopPropagation();if(n==='contextmenu')e.preventDefault()}));
 ov.addEventListener('pointerdown',e=>{if(e.target.closest('#axunl'))return;unl.classList.add('on');clearTimeout(utimer);utimer=setTimeout(()=>unl.classList.remove('on'),2800)});
 unl.addEventListener('pointerdown',e=>{unl.classList.add('hold');clearTimeout(utimer);clearTimeout(hold);hold=setTimeout(unlock,650)});
 const rel=()=>{clearTimeout(hold);unl.classList.remove('hold');clearTimeout(utimer);utimer=setTimeout(()=>unl.classList.remove('on'),2200)};
 ['pointerup','pointercancel','pointerleave'].forEach(n=>unl.addEventListener(n,rel));
 v.addEventListener('emptied',()=>{if(!st.classList.contains('has')&&st.classList.contains('axlocked'))unlock()});

 /* ---------- 6. mini progress line ---------- */
 const fill=mini.firstChild;
 const upd=()=>{const d=v.duration;fill.style.transform='scaleX('+(d&&isFinite(d)?Math.min(1,v.currentTime/d):0)+')'};
 ['timeupdate','seeked','loadedmetadata','durationchange','emptied'].forEach(n=>v.addEventListener(n,upd));upd();

 /* ---------- 7. auto title for direct links + mobile rotate / audio / subtitle icons below title ---------- */
 const mRot=document.getElementById('axrot'),mAud=document.getElementById('axaub'),mCc=document.getElementById('axccb'),ttlEl=document.getElementById('ttl');
 let srcAud=null,srcCc=null;
 const urlTitle=u=>{
  try{
   const parsed=new URL(u),seg=parsed.pathname.split('/').filter(Boolean).pop()||'';
   let n='';try{n=decodeURIComponent(seg)}catch{n=seg}
   n=n.replace(/\+/g,' ').trim();
   return n||parsed.hostname
  }catch{return''}};
 const syncTtl=()=>st.classList.toggle('axnottl',!!(!ttlEl||ttlEl.style.display==='none'||!ttlEl.textContent.trim()));
 const fillTtl=()=>{
  if(!ttlEl)return;
  if(!ttlEl.textContent.trim()){
   const u=typeof curUrl==='string'?curUrl:'';
   if(/^blob:/.test(u)&&typeof pl!=='undefined'&&pl[pi]&&pl[pi].name)ttlEl.textContent=pl[pi].name;
   else if(/^https?:/.test(u)){const t=urlTitle(u);if(t){ttlEl.textContent=t;if(document.title==='Axion')document.title=t+' · Axion'}}}
  syncTtl()};
 const syncTr=()=>{
  const a=document.getElementById('aub'),c=document.getElementById('ccb');
  if(a&&a!==srcAud){srcAud=a;new MutationObserver(syncTr).observe(a,{attributes:true,attributeFilter:['hidden','title']})}
  if(c&&c!==srcCc){srcCc=c;new MutationObserver(syncTr).observe(c,{attributes:true,attributeFilter:['hidden','title']})}
  mRot.hidden=!v.videoWidth;
  mAud.hidden=!(a&&!a.hidden);if(a&&a.title)mAud.title=a.title;
  mCc.hidden=!(c&&!c.hidden);if(c&&c.title)mCc.title=c.title;
  trBar.hidden=mRot.hidden&&mAud.hidden&&mCc.hidden};
 if(ttlEl)new MutationObserver(syncTtl).observe(ttlEl,{attributes:true,attributeFilter:['style'],childList:true,characterData:true,subtree:true});
 const ctlRow=document.querySelector('#ctl .row');
 if(ctlRow)new MutationObserver(syncTr).observe(ctlRow,{childList:true});
 ['loadstart','loadedmetadata'].forEach(n=>v.addEventListener(n,fillTtl));
 ['loadstart','loadedmetadata','resize','emptied'].forEach(n=>v.addEventListener(n,syncTr));
 document.addEventListener('DOMContentLoaded',()=>{fillTtl();syncTr()});
 fillTtl();syncTr();
 trBar.addEventListener('pointerdown',stop);trBar.addEventListener('pointerup',stop);
 mRot.addEventListener('click',async e=>{
  e.stopPropagation();buzz(15);
  const wasFs=!!document.fullscreenElement,land=innerWidth>innerHeight,want=land?'portrait':'landscape';
  try{
   if(!wasFs&&st.requestFullscreen)await st.requestFullscreen();
   if(screen.orientation&&screen.orientation.lock){
    await screen.orientation.lock(want);
    say(want==='landscape'?'Landscape':'Portrait',1400);
    return}
  }catch{}
  if(!wasFs&&document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  const rb=document.getElementById('rot');
  if(rb){rb.click();say('Rotated',1200)}});
 mAud.addEventListener('click',e=>{e.stopPropagation();const a=document.getElementById('aub');a&&a.click()});
 mCc.addEventListener('click',e=>{e.stopPropagation();const c=document.getElementById('ccb');c&&c.click()});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();