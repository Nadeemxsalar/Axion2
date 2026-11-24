/* Axion settings-ui.js: modern look for the Settings panel and the quality menu (CSS + slider fill) */
(()=>{
const I=(p,c,w)=>'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>')+'")',
 COG=I('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>','#171000'),
 GEN=I('<path d="M21 4h-7"/><path d="M10 4H3"/><path d="M21 12h-9"/><path d="M8 12H3"/><path d="M21 20h-5"/><path d="M12 20H3"/><path d="M14 2v4"/><path d="M8 10v4"/><path d="M16 18v4"/>','#000'),
 PIC=I('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>','#000'),
 PAL=I('<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/>','#000'),
 CC=I('<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M10.5 10.5a2.5 2.5 0 1 0 0 3"/><path d="M17.5 10.5a2.5 2.5 0 1 0 0 3"/>','#000'),
 OK=I('<path d="M20 6 9 17l-5-5"/>','#000',2.6),
 OKD=I('<path d="M20 6 9 17l-5-5"/>','#171000',3),
 CHEV=I('<path d="m6 9 6 6 6-6"/>','#8a93ad',2.4),
 SRCH=I('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>','#8a93ad'),
 CHM=I('<path d="m6 9 6 6 6-6"/>','#000',2.6),
 QPLUS=I('<path d="M12 5v14"/><path d="M5 12h14"/>','#000',2.4),
 QOFF=I('<circle cx="12" cy="12" r="9"/><path d="m4.9 4.9 14.2 14.2"/>','#000',2);
const IC={
 gauge:'<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
 monitor:'<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
 vol:'<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
 music:'<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
 cc:'<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M10.5 10.5a2.5 2.5 0 1 0 0 3"/><path d="M17.5 10.5a2.5 2.5 0 1 0 0 3"/>',
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
 QAUD=I(IC.music,'#171000',2.2),
 QSUB=I(IC.cc,'#171000',2.2),
 QQLT=I(IC.monitor,'#171000',2.2),
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

#set .dots{flex:1 1 100%;justify-content:flex-start;align-items:center;gap:9px}
#set .dots .dot,#set .dots .sdot{width:28px;height:28px;border:2px solid transparent;box-shadow:0 2px 6px #0004;transition:transform .15s,box-shadow .15s}
#set .dots .dot:hover,#set .dots .sdot:hover{transform:scale(1.12)}
#set .dots .dot.on,#set .dots .sdot.on{border-color:var(--panel);box-shadow:0 0 0 2px var(--tx),0 4px 10px #0005}
#set input[type=color]{width:34px;height:28px;border:2px solid var(--line);border-radius:8px}

#set .sf{padding:11px 16px;border-top:1px solid color-mix(in srgb,var(--tx) 10%,transparent);background:color-mix(in srgb,var(--tx) 4%,transparent)}
#set .sf>span{display:inline-flex;align-items:center;gap:7px}
#set .sf>span::before{content:"";width:14px;height:14px;background:#35c27a;-webkit-mask:${OK} center/contain no-repeat;mask:${OK} center/contain no-repeat}
#set .sf button{min-height:30px;padding:5px 12px;border-radius:10px;border:1px solid #ff6b6b45;background:#ff6b6b1a;color:#ff7b7b;font-weight:600;font-size:12.5px}
#set .sf button:hover{background:#ff6b6b2e}

/* --- advanced Audio / Subtitles (CC) / Quality popup (#qm) --- */
#qm{min-width:252px;max-width:min(320px,calc(100% - 24px));border-radius:20px;padding:10px;gap:5px;background:color-mix(in srgb,var(--panel) 92%,transparent);-webkit-backdrop-filter:blur(26px) saturate(1.55);backdrop-filter:blur(26px) saturate(1.55);border:1px solid color-mix(in srgb,var(--tx) 14%,transparent);box-shadow:0 28px 68px -14px #000c,inset 0 1px 0 #ffffff16;transform-origin:100% 100%;scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--tx) 25%,transparent) transparent}
#qm::-webkit-scrollbar{width:5px}#qm::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--tx) 22%,transparent);border-radius:6px}
#qm::before{content:"";position:absolute;left:0;right:0;top:0;height:86px;background:radial-gradient(240px 80px at 85% 0,color-mix(in srgb,var(--ac) 24%,transparent),transparent);pointer-events:none;z-index:0}
#qm>*{position:relative;z-index:1}
#qm .mh{display:flex;align-items:center;gap:9px;padding:4px 6px 10px;margin-bottom:4px;border-bottom:1px solid color-mix(in srgb,var(--tx) 10%,transparent);color:var(--tx);font-size:14px;font-weight:700;letter-spacing:.01em}
#qm .mh::before{content:"";width:28px;height:28px;border-radius:9px;flex:none;background:var(--qi,${QQLT}) center/16px no-repeat,var(--grad);box-shadow:0 5px 14px -4px color-mix(in srgb,var(--ac) 65%,transparent)}
#qm[data-k=aud] .mh{--qi:${QAUD}}
#qm[data-k=sub] .mh{--qi:${QSUB}}
#qm[data-k=qual] .mh{--qi:${QQLT}}
#qm .qcnt{margin-left:auto;padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--tx) 8%,transparent);color:var(--mut);font-size:11px;font-weight:600;letter-spacing:.02em;white-space:nowrap}
#qm button{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:40px;padding:9px 12px;border-radius:12px;border:1px solid transparent;background:color-mix(in srgb,var(--tx) 4.5%,transparent);color:var(--tx);font-size:13.5px;font-weight:500;text-align:left;transition:background .15s,border-color .15s,transform .1s,color .15s}
#qm button:hover{background:color-mix(in srgb,var(--tx) 9%,transparent);border-color:color-mix(in srgb,var(--tx) 10%,transparent)}
#qm button:active{transform:scale(.975)}
#qm button:focus-visible{outline:2px solid var(--ac);outline-offset:1px}
#qm .qlb{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#qm .qtags{display:inline-flex;align-items:center;gap:4px;flex:none}
#qm .qt{font-style:normal;font-size:10.5px;font-weight:700;letter-spacing:.04em;padding:2px 6px;border-radius:6px;background:color-mix(in srgb,var(--tx) 10%,transparent);color:var(--mut);line-height:1.25}
#qm .qt.acc{background:color-mix(in srgb,var(--ac) 18%,transparent);color:var(--act)}
#qm .qt.hi{background:var(--grad);color:#171000}
#qm .qt.bad{background:#ff6b6b26;color:#ff7b7b}
#qm button.on{padding-left:15px;background:color-mix(in srgb,var(--ac) 16%,transparent);border-color:color-mix(in srgb,var(--ac) 42%,transparent);color:var(--act);font-weight:600;box-shadow:0 6px 18px -10px color-mix(in srgb,var(--ac) 75%,transparent)}
#qm button.on::before{content:"";position:absolute;left:4px;top:8px;bottom:8px;width:3.5px;border-radius:4px;background:var(--grad);box-shadow:0 0 8px color-mix(in srgb,var(--ac) 75%,transparent)}
#qm button.on::after{content:"";width:20px;height:20px;border-radius:50%;flex:none;background:${OKD} center/12px no-repeat,var(--grad);box-shadow:0 3px 10px -3px color-mix(in srgb,var(--ac) 80%,transparent)}
#qm button.qoff{color:var(--mut)}
#qm button.qoff::before{content:"";width:15px;height:15px;flex:none;background:currentColor;-webkit-mask:${QOFF} center/contain no-repeat;mask:${QOFF} center/contain no-repeat;opacity:.75}
#qm button.qoff.on{color:var(--act);padding-left:12px}
#qm button.qoff.on::before{position:static;width:15px;height:15px;border-radius:0;background:currentColor;box-shadow:none;-webkit-mask:${QOFF} center/contain no-repeat;mask:${QOFF} center/contain no-repeat;opacity:1}
#qm button.qact{justify-content:flex-start;min-height:36px;padding:8px 12px;border-radius:11px;border:1px dashed color-mix(in srgb,var(--ac) 36%,transparent);background:color-mix(in srgb,var(--ac) 10%,transparent);color:var(--act);font-size:13px;font-weight:600}
#qm button.qact:hover{background:color-mix(in srgb,var(--ac) 20%,transparent);border-style:solid;border-color:color-mix(in srgb,var(--ac) 55%,transparent)}
#qm button.qact::before{content:"";width:15px;height:15px;flex:none;background:currentColor;-webkit-mask:${QPLUS} center/contain no-repeat;mask:${QPLUS} center/contain no-repeat}
#qm button.qact.qst{border-style:solid;border-color:color-mix(in srgb,var(--tx) 12%,transparent);background:color-mix(in srgb,var(--tx) 6%,transparent);color:var(--tx)}
#qm button.qact.qst:hover{background:color-mix(in srgb,var(--tx) 11%,transparent)}
#qm button.qact.qst::before{-webkit-mask:${GEN} center/contain no-repeat;mask:${GEN} center/contain no-repeat}
#qm button.qsep{margin-top:6px;position:relative}
#qm button.qsep::after{content:"";position:absolute;left:2px;right:2px;top:-6px;height:1px;background:color-mix(in srgb,var(--tx) 11%,transparent);pointer-events:none}

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
.lite #set,.lite #qm{-webkit-backdrop-filter:none;backdrop-filter:none;background:var(--panel);box-shadow:0 8px 24px #0008}.lite #set::before,.lite #qm::before{display:none}.lite #libr .li:hover{transform:none;box-shadow:none}
@media(prefers-reduced-motion:reduce){#set:not([hidden]),#qm:not([hidden]),#set .pane:not([hidden]){animation:none}}
#set .it>.pick{display:inline-flex;align-items:center;justify-content:space-between;gap:8px;min-width:92px}
#set .it>.pick[hidden]{display:none}
#set .it>.pick::after{content:"";width:14px;height:14px;flex:none;background:currentColor;-webkit-mask:${CHM} center/contain no-repeat;mask:${CHM} center/contain no-repeat;transition:transform .15s}
#set .it>.pick[aria-expanded=true]::after{transform:rotate(180deg)}
#set>#setpop{position:absolute;z-index:8;min-width:150px;max-width:calc(100% - 20px);padding:8px;border-radius:16px;display:grid;grid-template-columns:repeat(var(--cols,1),minmax(0,1fr));gap:6px;background:color-mix(in srgb,var(--panel) 97%,transparent);border:1px solid color-mix(in srgb,var(--tx) 16%,transparent);box-shadow:0 18px 44px -10px #000c;-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);animation:setPop .16s cubic-bezier(.2,.9,.3,1.1);transform-origin:top right}
#set>#setpop[hidden]{display:none}
#setpop button{min-height:34px;padding:7px 12px;border-radius:11px;border:1px solid transparent;background:color-mix(in srgb,var(--tx) 6%,transparent);color:var(--tx);font-size:13px;font-weight:600;white-space:nowrap;text-align:center;transition:background .12s,transform .1s}
#setpop.list button{text-align:left}
#setpop button:hover{background:color-mix(in srgb,var(--ac) 20%,transparent)}
#setpop button:active{transform:scale(.96)}
#setpop button.on{background:var(--grad);color:#171000;box-shadow:0 4px 12px -4px color-mix(in srgb,var(--ac) 70%,transparent)}
.lite #set>#setpop{-webkit-backdrop-filter:none;backdrop-filter:none;background:var(--panel)}
@media(prefers-reduced-motion:reduce){#set>#setpop{animation:none}}
@media(max-width:640px),(pointer:coarse) and (max-height:500px){
 #set,#qm{border-radius:22px 22px 18px 18px}
 #set::after,#qm::after{content:"";position:absolute;top:7px;left:50%;width:38px;height:4px;margin-left:-19px;border-radius:4px;background:color-mix(in srgb,var(--tx) 25%,transparent);z-index:2}
 #set .sh{padding-top:22px}
 #qm{min-width:0;max-width:none;padding:20px 12px 12px}
}
@media(pointer:coarse) and (max-height:500px) and (orientation:landscape){
 #set,#qm{border-radius:22px 0 0 22px}#set::after,#qm::after{display:none}#set .sh{padding-top:8px}
 #qm{min-width:0;max-width:none;padding:10px}
 #set .tabs .tab{flex-direction:row;justify-content:center;padding:6px 4px}
}`;

function init(){
 const set=document.getElementById('set');if(!set)return;
 if((navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4))document.documentElement.classList.add('lite'); /* weak device: no blur, no heavy shadows */
 const $=q=>set.querySelector(q),st=document.createElement('style');st.id='setui';st.textContent=CSS;document.head.appendChild(st);

 /* --- enhanced Audio / Subtitles (CC) / Quality popup menu (#qm) --- */
 const qm=document.getElementById('qm');
 if(qm){
  const enhanceQM=()=>{
   const mh=qm.querySelector('.mh');
   const ht=(mh?mh.textContent:'').trim().toLowerCase();
   const kind=ht.includes('audio')?'aud':ht.includes('sub')?'sub':'qual';
   qm.dataset.k=kind;
   const btns=[...qm.querySelectorAll('button')];
   let tracks=0,firstAct=false;
   btns.forEach(b=>{
    const isAct=b.hasAttribute('data-add')||b.dataset.s==='add'||b.dataset.s==='style';
    const isOff=b.dataset.s==='-1';
    if(isAct){
     b.classList.add('qact');
     if(!firstAct){firstAct=true;b.classList.add('qsep')}
     if(b.dataset.s==='style')b.classList.add('qst');
     b.textContent=b.textContent.replace(/^\+\s*/,'');
     return;
    }
    const raw=b.textContent.trim();
    if(!raw)return;
    if(isOff){
     b.classList.add('qoff');b.textContent='';
     const lb=document.createElement('span');lb.className='qlb';lb.textContent=raw;b.append(lb);
     return;
    }
    tracks++;
    const tags=[];
    let txt=raw,bad=false;
    if(/✕/.test(txt)){txt=txt.replace(/\s*✕\s*/g,' ').trim();bad=true}
    const ass=/\((ASS|SSA)\)/i.exec(txt);
    if(ass){txt=txt.replace(ass[0],'').trim();tags.push([ass[1].toUpperCase(),'acc'])}
    if(kind==='qual'){
     const k4=/^(4K|8K)\s*·\s*/i.exec(txt);
     if(k4){txt=txt.slice(k4[0].length).trim()||k4[1].toUpperCase();tags.push([k4[1].toUpperCase(),'hi'])}
     else if(/\b(2160|4320)p\b/i.test(txt))tags.push([/4320/.test(txt)?'8K':'4K','hi']);
     else if(/\b1440p\b/i.test(txt))tags.push(['2K','acc']);
     else if(/\b1080p\b/i.test(txt))tags.push(['FHD','acc']);
     else if(/\b720p\b/i.test(txt))tags.push(['HD','']);
    }else if(kind==='aud'){
     const parts=txt.split(/\s*·\s*/);
     if(parts.length>1){
      txt=parts[0];
      parts.slice(1).join(' ').split(/\s+/).forEach(w=>{if(w)tags.push([w,/^(E-?AC3|AC3|DTS|5\.1|7\.1|ATMOS)$/i.test(w)?'acc':''])});
     }else{
      const cd=txt.match(/\b(E-?AC3|AC3|DTS|AAC|OPUS|FLAC|5\.1|7\.1|stereo)\b/gi);
      if(cd){
       const rest=txt.replace(/\b(E-?AC3|AC3|DTS|AAC|OPUS|FLAC|5\.1|7\.1|stereo)\b/gi,'').replace(/\s{2,}/g,' ').trim();
       if(rest){txt=rest;cd.forEach(w=>tags.push([w,/^(E-?AC3|AC3|DTS|5\.1|7\.1)$/i.test(w)?'acc':'']))}
      }
     }
    }
    if(bad)tags.push(['✕','bad']);
    b.textContent='';
    const lb=document.createElement('span');lb.className='qlb';lb.textContent=txt||raw;b.append(lb);
    if(tags.length){
     const tg=document.createElement('span');tg.className='qtags';
     tags.slice(0,3).forEach(([t,c])=>{const i=document.createElement('i');i.className='qt'+(c?' '+c:'');i.textContent=t;tg.append(i)});
     b.append(tg);
    }
   });
   if(mh&&tracks){
    const cnt=document.createElement('span');cnt.className='qcnt';
    cnt.textContent=tracks+' '+(kind==='qual'?(tracks===1?'option':'options'):(tracks===1?'track':'tracks'));
    mh.append(cnt);
   }
  };
  const qmo=new MutationObserver(()=>{qmo.disconnect();enhanceQM();qmo.observe(qm,{childList:true})});
  qmo.observe(qm,{childList:true});
  if(qm.children.length){qmo.disconnect();enhanceQM();qmo.observe(qm,{childList:true})}
 }

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
 $('.tabs').addEventListener('click',()=>{closePop();if(inp.value){inp.value='';filter(false)}},true);

 /* --- row icons --- */
 const URL_=k=>I(IC[k],'#000');
 function icons(){
  set.querySelectorAll('.pane .it:not(.ic)').forEach(r=>{
   const sp=r.querySelector('span'),f=sp&&sp.firstChild,t=f&&f.nodeType===3?f.textContent.trim().toLowerCase():'';
   const m=t&&MAP.find(x=>x[0].test(t));
   if(m){r.classList.add('ic');r.style.setProperty('--ri',URL_(m[1]))}})}

 /* --- selects with few short options become tappable chips (the real select stays, hidden, so the app keeps working) --- */
 const sync=sel=>{if(!sel._box)return;[...sel._box.children].forEach(b=>b.classList.toggle('on',b.dataset.v===sel.value));
  const o=sel.options[sel.selectedIndex];sel._pk.firstChild.textContent=o?o.text:''};
 function chips(){
  set.querySelectorAll('select').forEach(sel=>{
   const o=[...sel.options];
   if(sel._box&&sel._n===o.length){sync(sel);return}
   if(sel._box){sel._box.remove();sel._pk.remove();sel._box=null;sel.hidden=false}
   const tot=o.reduce((a,x)=>a+x.text.length,0),row=sel.closest('.it');
   if(!row||o.length<2||o.length>8||tot>52)return;
   const box=document.createElement('div');box.className='chips';
   o.forEach(x=>{const b=document.createElement('button');b.type='button';b.dataset.v=x.value;b.textContent=x.text;box.append(b)});
   box.onclick=e=>{const b=e.target.closest('button');if(!b)return;e.preventDefault();sel.value=b.dataset.v;
    sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));sync(sel)};
   const pk=document.createElement('button');pk.type='button';pk.className='pick';pk.hidden=true;pk.setAttribute('aria-haspopup','listbox');pk.setAttribute('aria-expanded','false');pk.innerHTML='<span></span>';
   pk.onclick=e=>{e.preventDefault();e.stopPropagation();openPop(sel,pk)};
   sel.hidden=true;sel._box=box;sel._pk=pk;sel._n=o.length;row.append(pk,box);sync(sel)})}

 /* --- a group that does not fit on one line becomes ONE button (current value); tapping it opens the list --- */
 function fit(){
  set.querySelectorAll('.pane:not([hidden]) select').forEach(sel=>{
   const box=sel._box,pk=sel._pk;if(!box)return;
   box.style.display='';                                       /* measure with the chips visible */
   const f=box.firstElementChild,l=box.lastElementChild,wrap=l.offsetTop>f.offsetTop+4;
   box.style.display=wrap?'none':'';if(pk.hidden!==!wrap)pk.hidden=!wrap})}
 let pop=null,popSel=null,popBtn=null;
 function closePop(){if(pop&&!pop.hidden){pop.hidden=true}if(popBtn)popBtn.setAttribute('aria-expanded','false');popSel=popBtn=null}
 function openPop(sel,btn){
  if(!pop){
   pop=document.createElement('div');pop.id='setpop';pop.hidden=true;pop.setAttribute('role','listbox');set.append(pop);
   pop.onclick=e=>{const b=e.target.closest('button');if(!b||!popSel)return;e.stopPropagation();const s=popSel;
    s.value=b.dataset.v;s.dispatchEvent(new Event('input',{bubbles:true}));s.dispatchEvent(new Event('change',{bubbles:true}));sync(s);const b2=popBtn;closePop();b2&&b2.focus()}}
  if(popSel===sel){closePop();return}
  closePop();popSel=sel;popBtn=btn;btn.setAttribute('aria-expanded','true');
  const n=sel.options.length;
  pop.className=n>4?'':'list';pop.style.setProperty('--cols',n>6?4:n>4?3:n>3?2:1);
  pop.innerHTML=[...sel.options].map(x=>'<button type="button" role="option" data-v="'+esc(x.value)+'"'+(x.value===sel.value?' class="on" aria-selected="true"':'')+'>'+esc(x.text)+'</button>').join('');
  pop.hidden=false;
  const sr=set.getBoundingClientRect(),br=btn.getBoundingClientRect(),pw=pop.offsetWidth,ph=pop.offsetHeight;
  let left=br.right-sr.left-pw;left=Math.max(10,Math.min(left,sr.width-pw-10));
  let top=br.bottom-sr.top+6;if(top+ph>sr.height-8)top=Math.max(8,br.top-sr.top-ph-6);
  pop.style.left=left+'px';pop.style.top=top+'px'}
 set.addEventListener('pointerdown',e=>{if(pop&&!pop.hidden&&!e.target.closest('#setpop,.pick'))closePop()},true);
 addEventListener('keydown',e=>{if(e.key==='Escape'&&pop&&!pop.hidden){const b=popBtn;closePop();b&&b.focus();e.stopPropagation();e.preventDefault()}},true);
 $('.body').addEventListener('scroll',closePop,{passive:true});
 addEventListener('resize',()=>{closePop();if(!set.hidden)fit()});

 /* --- filled part of the sliders --- */
 const fill=r=>{const a=+r.min||0,b=r.max===''?100:+r.max;r.style.setProperty('--p',Math.max(0,Math.min(100,(+r.value-a)/((b-a)||1)*100))+'%')},
  all=()=>{icons();chips();fit();set.querySelectorAll('input[type=range]').forEach(fill)};
 set.addEventListener('input',e=>{if(e.target.matches&&e.target.matches('input[type=range]'))fill(e.target)},true);
 set.addEventListener('click',()=>setTimeout(all,0),true);
 new MutationObserver(()=>{if(set.hidden){if(inp.value){inp.value='';filter(false)}sq.hidden=true;closePop()}all()}).observe(set,{attributes:true,attributeFilter:['hidden']});
 all();setTimeout(all,600);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();