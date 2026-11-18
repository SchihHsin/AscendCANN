# -*- coding: utf-8 -*-
CSS_EXTRA = r"""
/* ================= 本报告自定义组件 ================= */
.chip{display:inline-flex;align-items:center;gap:.45em;padding:.38vh .7vw;border-radius:999px;font-size:var(--fs-sm);font-weight:600;white-space:nowrap;border:1px solid transparent}
.chip i{width:7px;height:7px;border-radius:50%;background:currentColor;display:block;flex:none}
.chip.stu{color:#0E7C86;background:rgba(14,124,134,.09);border-color:rgba(14,124,134,.18)}
.chip.emp{color:#4B4BA8;background:rgba(75,75,168,.09);border-color:rgba(75,75,168,.18)}
.chip.warn{color:#A8482C;background:rgba(168,72,44,.09);border-color:rgba(168,72,44,.2)}
.chip.mute{color:var(--ink-2);background:rgba(120,128,145,.09);border-color:rgba(120,128,145,.16)}
.mono{font-family:'JetBrains Mono',monospace;font-size:var(--fs-xs);letter-spacing:.04em;color:var(--ink-3)}

/* ---------- 受访者矩阵 ---------- */
.mtx{width:100%;border-collapse:collapse;table-layout:fixed}
.mtx th{font-size:var(--fs-sm);font-weight:700;color:var(--ink-3);text-align:left;padding:0 0 1.1vh;border-bottom:1px solid rgba(47,61,99,.18)}
.mtx td{padding:1.25vh .5vw 1.25vh 0;border-bottom:1px solid rgba(47,61,99,.1);vertical-align:middle;font-size:var(--fs-sm);color:var(--ink-2);line-height:1.35}
.mtx tr:last-child td{border-bottom:0}
.mtx .who{font-weight:800;font-size:var(--fs-h3);color:var(--ink);display:flex;align-items:center;gap:.5em}
.mtx .who .bar{width:4px;height:22px;border-radius:2px;background:var(--c-teal)}
.mtx .who.e .bar{background:var(--c-indigo)}
.mtx .task{color:var(--ink);font-weight:500}
.mtx .pin{display:inline-block;font-size:var(--fs-xs);color:#8A5A2B;background:rgba(244,180,80,.16);border-radius:5px;padding:.18vh .4vw;margin-left:.35em}

/* ---------- 证据强度 ---------- */
.ev{display:grid;grid-template-columns:1.05fr .95fr;gap:2.4vw;align-items:center;flex:1;min-height:0}
.ev-left{display:flex;flex-direction:column;justify-content:center;gap:1.5vh}
.ev-kick{font-size:11.4px;color:var(--ink-3);line-height:1.45;margin-bottom:.6vh}
.ev-tier{display:grid;grid-template-columns:52px 1fr;gap:.9vw;align-items:stretch}
.ev-tag{display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono';font-size:11px;font-weight:700;color:#fff;background:var(--g-ink);border-radius:9px}
.ev-band{border-radius:10px;padding:1.6vh 1.2vw;display:flex;flex-direction:column;justify-content:center;gap:.65vh;color:#fff;min-height:14.5vh}
.ev-band.b1{background:var(--g-ink)}
.ev-band.b2{background:var(--g-accent)}
.ev-band.b3{background:linear-gradient(120deg,#9AA3B2,#C6CCD7);color:#2B303A;margin-left:5%}
.ev-band b{font-size:clamp(13px,1vw,16px);font-weight:800;letter-spacing:.01em}
.ev-band span{font-size:11.4px;line-height:1.45;opacity:.9}
.ev-right{background:rgba(255,255,255,.52);border:1px solid rgba(255,255,255,.85);border-radius:14px;padding:2.4vh 1.5vw;display:flex;flex-direction:column;justify-content:center;gap:1.3vh;box-shadow:0 14px 34px -26px rgba(30,40,70,.4)}
.ev-right h4{font-size:var(--fs-h3);font-weight:800;color:var(--ink);display:flex;gap:.5em;align-items:center;margin-bottom:.4vh}
.ev-gap{font-size:12px;line-height:1.5;color:var(--ink-2);padding-left:1.1em;position:relative}
.ev-gap::before{content:"!";position:absolute;left:0;top:0;font-family:'JetBrains Mono';font-weight:700;color:#C4693F}
.ev-gap b{color:var(--ink)}

/* ---------- 双角色镜像对照 ---------- */
.mir{flex:1;min-height:0;display:grid;grid-template-columns:1fr 86px 1fr;column-gap:0;row-gap:.5vh;align-content:center}
.mir-head{border-radius:11px;padding:1.7vh 1vw;display:flex;flex-direction:column;gap:.28vh}
.mir-head.a{background:rgba(14,124,134,.1);border:1px solid rgba(14,124,134,.22)}
.mir-head.b{background:rgba(75,75,168,.1);border:1px solid rgba(75,75,168,.22)}
.mir-head .n{font-size:clamp(14px,1.05vw,17px);font-weight:800;color:var(--ink)}
.mir-head .d{font-size:var(--fs-xs);color:var(--ink-2)}
.mir-cell{font-size:12.6px;line-height:1.4;color:var(--ink-2);padding:1.55vh 0;border-bottom:1px dashed rgba(47,61,99,.13);display:flex;align-items:center}
.mir-cell.a{padding-right:1.2vw}
.mir-cell.b{padding-left:1.2vw}
.mir-cell.a{border-bottom-color:rgba(14,124,134,.2)}
.mir-cell.b{border-bottom-color:rgba(75,75,168,.2)}
.mir-dim{display:flex;align-items:center;justify-content:center;font-size:10.2px;font-weight:700;color:var(--ink-3);letter-spacing:.06em;text-align:center;border-bottom:1px dashed rgba(47,61,99,.13)}
.mir-q{font-size:11.6px;font-weight:600;color:var(--ink-2);line-height:1.45;margin-top:.6vh;padding-left:0}
.mir-q.a{border-color:#0E7C86}
.mir-q.b{border-color:#4B4BA8}.mir-col.b .mir-q{border-color:#4B4BA8}

/* ---------- 旅程（jd） ---------- */
.jd{flex:1;min-height:0;display:grid;grid-template-columns:112px minmax(0,1fr);gap:5px}
.jd-rail{display:grid;grid-template-rows:40px .92fr .82fr 1.85fr 1.25fr;gap:5px}
.jd-rail>div{background:#999b9c;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700;font-size:14px;line-height:1.25;padding:0 4px;flex-direction:column}
.jd-rail .sm{font-weight:400;font-size:10.5px;opacity:.9}
.jd-body{display:grid;grid-template-rows:40px .92fr .82fr 1.85fr 1.25fr;gap:5px;min-width:0}
.jd-stages{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.jd-stage{position:relative;display:flex;align-items:center;justify-content:center;background:#989a9b;color:#fff;font-size:13.5px;font-weight:700;letter-spacing:.01em;clip-path:polygon(0 0,calc(100% - 13px) 0,100% 50%,calc(100% - 13px) 100%,0 100%,13px 50%);padding:0 8px 0 14px;text-align:center}
.jd-row{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;min-height:0}
.jd-cell{border:1.5px solid #dbdddd;background:#fff;padding:.9vh .75vw;font-size:11.6px;line-height:1.34;display:flex;flex-direction:column;justify-content:center;min-width:0;color:#3c4145}
.jd-cell b{font-weight:600;color:#1c2023}
.jd-cell.q{color:#5a6165;font-size:11.2px;border-style:dashed;background:rgba(255,255,255,.6)}
.jd-doing{position:relative;border:1.5px solid #d8dada;background:#fff;overflow:hidden;min-height:0}
.jd-seg{position:absolute;inset:0;display:grid;grid-template-columns:repeat(5,1fr);pointer-events:none}
.jd-seg>div{border-right:1.5px solid #d6d9da}
.jd-seg>div:last-child{border-right:0}
.jd-svg{position:absolute;inset:0;width:100%;height:100%;z-index:1;overflow:visible}
.jd-svg .lk{fill:none;stroke:#b9bdbd;stroke-width:1.3;vector-effect:non-scaling-stroke}
.jd-svg .vd{fill:none;stroke:#cf5048;stroke-width:2;stroke-dasharray:5 4;vector-effect:non-scaling-stroke}
.jd-tp{position:absolute;z-index:3;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;background:#f2fbfb;border:2px solid #b6cbcf;display:flex;align-items:center;justify-content:center;color:#0ea8a6}
.jd-tp.red{background:#ed4f43;border-color:#f0786a;color:#fff}
.jd-tp svg{width:20px;height:20px;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;fill:none}
.jd-tl{position:absolute;z-index:2;font-size:10.4px;line-height:1.22;color:#454a4b;text-shadow:0 0 2px #fff,0 0 3px #fff,0 0 4px #fff}
.jd-feel{position:relative;overflow:hidden;min-height:0;background:linear-gradient(to bottom,#eafbfc 0%,#eafafb 49%,#cdeeee 50%,#cdeeee 100%)}
.jd-chart{position:absolute;inset:0;width:100%;height:100%;z-index:1}
.jd-chart .ln{stroke:#9cbec0;stroke-width:1.3;fill:none;vector-effect:non-scaling-stroke}
.jd-chart .ds{fill:none;stroke:#d5534a;stroke-width:1.8;stroke-dasharray:5 4;vector-effect:non-scaling-stroke}
.jd-dot{position:absolute;z-index:2;width:11px;height:11px;border-radius:50%;background:#12a8ab;border:1px solid #06a0a1;transform:translate(-50%,-50%)}
.jd-dot.red{background:#ed554a;border-color:#e2463c}
.jd-em{position:absolute;z-index:2;font-size:10.2px;line-height:1.18;color:#3f4a4b;text-shadow:0 0 3px #eafbfc,0 0 5px #eafbfc,0 0 6px #eafbfc}
.jd-em.pain{font-size:10.8px;font-weight:600;color:#a82d29;text-shadow:0 0 3px #eafbfc,0 0 5px #eafbfc}
.jd-em.c{text-align:center}
/* 学习场景主题：橙 */
.jd.learn .jd-tp:not(.red){background:#fff8ec;border-color:#e5ba84;color:#d17b24}
.jd.learn .jd-feel{background:linear-gradient(to bottom,#fffaf0 0%,#fffaf0 49%,#ffead0 50%,#ffead0 100%)}
.jd.learn .jd-chart .ln{stroke:#d2b69b}
.jd.learn .jd-dot:not(.red){background:#e39443;border-color:#d27e28}
.jd.learn .jd-dot.red,.jd.learn .jd-tp.red{background:#ed4f43;border-color:#e2463c}
.jd-foot{display:flex;justify-content:space-between;align-items:center;margin-top:1vh;font-size:var(--fs-xs);color:var(--ink-3)}

/* ---------- 痛点矩阵（旅程对照） ---------- */
.pm{flex:1;min-height:0;display:grid;grid-template-columns:132px repeat(5,1fr);grid-template-rows:38px repeat(4,1fr);gap:7px}
.pm-h{display:flex;align-items:center;justify-content:center;background:#989a9b;color:#fff;font-size:12.5px;font-weight:700;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%,10px 50%)}
.pm-rl{display:flex;flex-direction:column;justify-content:center;gap:.2em;font-size:12px;font-weight:700;color:var(--ink);padding-left:0}
.pm-rl.e{color:var(--ink)}
.pm-rl small{font-weight:400;font-size:10.5px;color:var(--ink-3)}
.pm-c{border-radius:10px;padding:.8vh .8vw;display:flex;flex-direction:column;gap:.3em;justify-content:center;background:rgba(240,90,104,.09);border:1px solid rgba(240,90,104,.18)}
.pm-c.hi{background:rgba(240,90,104,.16);border-color:rgba(240,90,104,.3)}
.pm-c .t{font-size:11.8px;font-weight:600;color:#8E2F35;line-height:1.3}
.pm-c .s{font-size:10.4px;color:var(--ink-3);line-height:1.25}

/* ---------- 时序图 ---------- */
.seq{flex:1;min-height:0;display:flex;flex-direction:column;gap:0;background:rgba(255,255,255,.42);border:1px solid rgba(255,255,255,.75);border-radius:16px;padding:1.8vh 1.6vw;box-shadow:0 12px 30px -18px rgba(30,40,70,.25)}
.seq-h{display:grid;grid-template-columns:96px repeat(4,1fr);gap:0;margin-bottom:1.2vh}
.seq-h>div{display:flex;align-items:center;justify-content:center;gap:.4em;font-size:var(--fs-sm);font-weight:700;color:#fff;background:var(--g-ink);border-radius:9px;margin:0 4px;padding:.55vh .3vw;height:4.4vh;min-height:34px}
.seq-h>div.p1{background:linear-gradient(120deg,#2C6E6B,#3E9B96)}
.seq-h>div.p2{background:linear-gradient(120deg,#4B4BA8,#6E6ED6)}
.seq-h>div.p3{background:linear-gradient(120deg,#7A6A4F,#A99270)}
.seq-h>div.p4{background:linear-gradient(120deg,#556,#7C8794)}
.seq-body{flex:1;min-height:0;display:flex;flex-direction:column;position:relative}
.seq-lines{position:absolute;inset:0;display:grid;grid-template-columns:96px repeat(4,1fr);z-index:0;pointer-events:none}
.seq-lines i{border-right:1px dashed rgba(120,132,150,.32)}
.seq-lines i:first-child{border-right:0}
.seq-lines i:last-child{border-right:0}
.seq-ph{display:grid;grid-template-columns:96px repeat(4,1fr);align-items:center;gap:0;flex:1;min-height:0;border-top:1px dashed rgba(120,132,150,.16);position:relative;z-index:1}
.seq-ph:first-child{border-top:0}
.seq-no{display:flex;flex-direction:column;gap:.15em;padding-right:.7vw}
.seq-no b{font-family:'JetBrains Mono';font-size:var(--fs-xs);color:#8E2F35;letter-spacing:.1em}
.seq-no span{font-size:11.5px;font-weight:700;color:var(--ink);line-height:1.25}
.seq-note{font-size:10.2px;color:var(--ink-3);line-height:1.2;margin-top:.1em}
.seq-arrows{grid-column:2 / 6;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;align-content:center;min-width:0}
.ar{position:relative;height:26px;grid-column:var(--a) / var(--b)}
.ar .bar{position:absolute;left:10px;right:14px;top:15px;height:2px;background:#8d97a5;border-radius:2px}
.ar .bar::after{content:"";position:absolute;right:-1px;top:-4px;border-left:7px solid #8d97a5;border-top:5px solid transparent;border-bottom:5px solid transparent}
.ar.back .bar::after{left:-1px;right:auto;border-left:0;border-right:7px solid #8d97a5}
.ar.back .lb{left:auto;right:10px;text-align:right}
.ar.key.back .bar::after{border-right-color:#22262F;border-left-color:transparent}
.ar.mut.back .bar::after{border-right-color:#7A8AA0;border-left-color:transparent}
.ar.key.back::before{left:auto;right:2px}
.ar .lb{position:absolute;left:10px;top:0;font-size:10.5px;color:#39424f;background:var(--paper);padding:0 .4em;white-space:nowrap;z-index:2;line-height:1.3}
.ar .lb b{font-weight:700;color:#1d2330}
.ar.key .bar{background:#22262F;height:2.5px}
.ar.key .bar::after{border-left-color:#22262F;border-right-color:#22262F}
.ar.key .lb{color:#1D2330;font-weight:700}
.ar.key::before{content:"";position:absolute;left:2px;top:11px;width:8px;height:8px;background:#22262F;transform:rotate(45deg);border-radius:1px}
.ar.mut .bar{background:#7A8AA0}
.ar.mut .bar::after{border-left-color:#7A8AA0;border-right-color:#7A8AA0}
.ar.mut .lb{color:#4A6076}

/* ---------- 信号 → 动作 ---------- */
.sig{flex:1;min-height:0;display:grid;grid-template-columns:1.4fr 54px 1fr;gap:1.2vw;align-items:center}
.sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.1vh 1vw;align-content:center}
.sig-i{display:flex;gap:.75em;align-items:center;background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.85);border-radius:11px;padding:1vh .8vw}
.sig-i .ic{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex:none;background:rgba(240,90,104,.12);color:#B3403A}
.sig-i .ic svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.sig-i .tx{min-width:0}
.sig-i .tx b{display:block;font-size:12.4px;color:var(--ink);margin-bottom:.15em}
.sig-i .tx span{font-size:11px;color:var(--ink-2);line-height:1.4;display:block}
.sig-i .tx em{font-style:normal;color:#8E2F35}
.sig-mid{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4vh;color:var(--ink-3);align-self:center}
.sig-mid svg{width:44px;height:44px;stroke:currentColor;fill:none;stroke-width:1.2}
.sig-mid span{font-size:10px;letter-spacing:.1em;font-family:'JetBrains Mono'}
.sig-act{display:flex;flex-direction:column;gap:1.4vh;justify-content:center}
.act{border-radius:11px;padding:1.6vh 1vw;display:flex;flex-direction:column;justify-content:center;background:rgba(75,75,168,.09);border:1px solid rgba(75,75,168,.2)}
.act b{display:block;font-size:13px;color:#3B3B85;margin-bottom:.25em}
.act span{font-size:11.2px;color:var(--ink-2);line-height:1.4}

/* ---------- 证据阶梯 + 散点 ---------- */
.lad{flex:1;min-height:0;display:grid;grid-template-columns:1.02fr .98fr;gap:2vw;align-items:center}
.lad-l{display:flex;flex-direction:column;justify-content:center;gap:1vh}
.step{display:grid;grid-template-columns:54px 1fr;gap:.9vw;align-items:stretch}
.step .no{display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono';font-size:11px;font-weight:700;color:#fff;background:var(--g-ink);border-radius:9px 0 0 9px}
.step .bd{background:rgba(255,255,255,.66);border:1px solid rgba(47,61,99,.09);border-radius:0 9px 9px 0;padding:.9vh .9vw;box-shadow:0 8px 20px -20px rgba(30,40,70,.5)}
.step.l2 .no{background:var(--g-accent)}
.step.l3 .no{background:linear-gradient(120deg,#9AA3B2,#C6CCD7);color:#2B303A}
.step b{font-size:12.8px;color:var(--ink)}
.step p{font-size:11.2px;color:var(--ink-2);line-height:1.42;margin-top:.15em}
.step q{font-size:11px;color:#8E2F35;display:block;margin-top:.3em;line-height:1.35}
.scatter{position:relative;background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.8);border-radius:14px;padding:1.4vh 1vw .8vh}
.scatter svg{width:100%;height:100%;display:block;overflow:visible}

/* ---------- 恢复谱系 ---------- */
.spec{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;align-items:end;margin-top:1vh}
.spec-i{display:flex;flex-direction:column;align-items:center;gap:.6vh;text-align:center}
.spec-i .n{font-family:'Inter';font-weight:300;font-size:24px;line-height:1;color:var(--ink)}
.spec-i .bx{width:100%;border-radius:7px 7px 3px 3px;background:linear-gradient(to top,rgba(75,75,168,.16),rgba(75,75,168,.42));border:1px solid rgba(75,75,168,.25);border-bottom:0}
.spec-i .lb{font-size:10.6px;color:var(--ink-2);line-height:1.25}
.ind{display:grid;grid-template-columns:1fr 1fr;gap:1.4vw;margin-top:2vh}
.ind-c{background:rgba(255,255,255,.58);border:1px solid rgba(255,255,255,.85);border-radius:12px;padding:1.3vh 1.1vw}
.ind-c b{font-size:12.6px;color:var(--ink);display:flex;align-items:center;gap:.45em}
.ind-c p{font-size:11.4px;color:var(--ink-2);line-height:1.45;margin-top:.35em}
.ind-c.yes{background:rgba(46,139,110,.07)}
.ind-c.no{background:rgba(179,64,58,.06)}

/* ---------- 习惯三层 ---------- */
.lay{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:1.2vh}
.lay-r{display:grid;grid-template-columns:206px 1fr;gap:1.2vw;align-items:center;height:20vh;min-height:148px;border-radius:14px;background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.82);padding:0 1vw;box-shadow:0 10px 28px -24px rgba(30,40,70,.5)}
.lay-h{display:flex;flex-direction:column;gap:.32em;padding-left:.2vw}
.lay-h b{font-size:15px;color:var(--ink)}
.lay-h span{font-size:10px;color:var(--ink-3);font-family:'JetBrains Mono';letter-spacing:.08em}
.lay-items{display:flex;flex-wrap:wrap;gap:.9vh .55vw}
.lay-i{font-size:12.2px;color:var(--ink-2);line-height:1.38;background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.95);border-radius:8px;padding:.85vh .8vw}
.lay-i b{color:var(--ink);font-weight:600}
.lay-i.q{background:rgba(14,124,134,.09);border-color:rgba(14,124,134,.18)}
.lay-i.x{background:rgba(75,75,168,.09);border-color:rgba(75,75,168,.18)}
.lay-i.x{background:rgba(75,75,168,.08);border-color:rgba(75,75,168,.16)}

/* ---------- 知识流 ---------- */
.kl{flex:1;min-height:0;display:grid;grid-template-columns:1.18fr .82fr;gap:2.4vw;align-items:center}
.kl-left{display:flex;flex-direction:column;gap:1.6vh;min-width:0}
.kl-left svg{width:100%;height:auto;display:block}
.kl-note{font-size:11.6px;color:var(--ink-2);line-height:1.5;max-width:46em}
.kl-right{display:flex;flex-direction:column;gap:1.2vh;min-width:0}
.kl-cap{font-size:11.4px;color:var(--ink-2);line-height:1.5}
.kl-cap b{color:var(--ink)}
.kl-chips{display:flex;flex-direction:column;gap:.7vh;margin-top:.6vh;align-items:flex-start}
.auth{display:flex;flex-direction:column;gap:.75vh}
.auth-i{display:grid;grid-template-columns:22px 1fr;gap:.7em;align-items:center}
.auth-i .k{font-family:'JetBrains Mono';font-size:10px;color:var(--ink-3);text-align:right}
.auth-i .bx{border-radius:8px;padding:.85vh .9vw;font-size:11.8px;font-weight:600;color:#fff}
.auth-i .bx small{display:block;font-weight:400;font-size:10.2px;opacity:.86;margin-top:.15em;line-height:1.3}
.a1 .bx{background:linear-gradient(120deg,#1F4B4A,#2E6E6B)}
.a2 .bx{background:linear-gradient(120deg,#3E4A63,#5B6A85)}
.a3 .bx{background:linear-gradient(120deg,#7A6A4F,#9A8663)}
.a4 .bx{background:linear-gradient(120deg,#8C3A32,#B8564A)}

/* ---------- 发现账本 ---------- */
.led{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center}
.led-r{display:grid;grid-template-columns:52px 1fr;gap:1.1vw;padding:1.9vh 0;border-top:1px solid rgba(47,61,99,.14);align-items:start}
.led-r:first-child{border-top:0}
.led-n{font-family:'Inter';font-weight:200;font-size:30px;line-height:1;color:var(--ink-3)}
.led-b h4{font-size:14.6px;font-weight:800;color:var(--ink);line-height:1.35;display:flex;align-items:center;gap:.6em;flex-wrap:wrap}
.led-b p{font-size:11.4px;color:var(--ink-2);line-height:1.45;margin-top:.35em}
.led-b p b{color:var(--ink);font-weight:600}
.led-b q{font-size:11px;color:#8E2F35;quotes:none}
.stg{font-size:9.6px;font-weight:700;letter-spacing:.06em;padding:.15em .45em;border-radius:4px}
.stg.l2{background:rgba(75,75,168,.12);color:#3B3B85}
.stg.l3{background:rgba(154,163,178,.2);color:#4A5566}

/* ---------- 2x2 ---------- */
.m4{flex:1;min-height:0;display:grid;grid-template-columns:.62fr 1.38fr;gap:1.8vw;align-items:center}
.m4-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:10px;position:relative}
.m4-cell{position:relative;border-radius:14px;padding:1vh .9vw;overflow:hidden}
.m4-cell.tl{background:rgba(35,207,160,.12)}
.m4-cell.tr{background:rgba(91,91,214,.11)}
.m4-cell.bl{background:rgba(244,180,80,.14)}
.m4-cell.br{background:rgba(230,72,77,.1)}
.m4-cell .ct{font-size:12px;font-weight:800;color:var(--ink);display:flex;align-items:baseline;gap:.4em;margin-bottom:.4vh}
.m4-cell .ct small{font-size:9.6px;font-weight:500;color:var(--ink-3)}
.note{display:block;font-size:10.8px;line-height:1.3;background:#fff;border-radius:6px;padding:.38em .55em;margin-bottom:.45vh;box-shadow:0 2px 6px -3px rgba(30,40,70,.35)}
.note b{font-weight:600;color:var(--ink)}
.note em{font-style:normal;font-family:'JetBrains Mono';font-size:9px;color:var(--ink-3);margin-left:.3em}
.note::before{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--c-indigo);margin:0 .45em 1px 0;vertical-align:middle}
.note.g::before{background:#2E8B6E}
.note.a::before{background:#B3403A}
.note.o::before{background:#B07A2A}
.m4-y{display:flex;align-items:center;gap:.4vw;margin-bottom:.6vh}
.ax-tag{font-size:9.6px;color:var(--ink-3);letter-spacing:.12em;font-family:'JetBrains Mono';margin-bottom:.5vh}
.m4-y span{font-size:10px;color:var(--ink-3);font-family:'JetBrains Mono'}
.axx{height:10px;width:100%;background:linear-gradient(to right,rgba(170,176,186,0),#aab0ba);clip-path:polygon(0 0,calc(100% - 7px) 0,100% 50%,calc(100% - 7px) 100%,0 100%)}
.axy{width:10px;height:100%;background:linear-gradient(to top,rgba(170,176,186,0),#aab0ba);clip-path:polygon(0 100%,0 7px,50% 0,100% 7px,100% 100%)}

/* ---------- 边界 ---------- */
.bd2{flex:0 0 auto;display:grid;grid-template-columns:1fr 1fr;gap:1.6vw;align-items:stretch}
.bd2-c{background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.85);border-radius:14px;padding:2.6vh 1.3vw;display:flex;flex-direction:column;gap:1.05vh;min-height:36vh;justify-content:center}
.bd2-c h4{font-size:13.4px;font-weight:800;color:var(--ink);display:flex;align-items:center;gap:.5em}
.bd2-c li{font-size:12.2px;color:var(--ink-2);line-height:1.45;list-style:none;padding-left:1.1em;position:relative}
.bd2-c li::before{content:"";position:absolute;left:0;top:.55em;width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.55}
.bd2-c.ok li::before{background:#2E8B6E}
.bd2-c.no li::before{background:#B3403A}
.hyp{display:flex;gap:1vw;margin-top:1.4vh}
.hyp-i{flex:1;background:rgba(244,180,80,.12);border:1px solid rgba(244,180,80,.3);border-radius:11px;padding:1vh .9vw}
.hyp-i b{font-size:11.6px;color:#7A5417;display:block;margin-bottom:.2em}
.hyp-i span{font-size:10.6px;color:var(--ink-2);line-height:1.35}
"""

CSS_EXTRA += r"""
.body-area{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;padding-bottom:2.6vh}
.contents-directory.contents-6{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));width:min(1240px,100%);gap:.9vw}
.contents-directory.contents-6 .directory-card{min-height:0;padding:1.5vh 1vw 1.2vh}
.contents-directory.contents-6 .directory-no{font-size:clamp(30px,3vw,48px)}
.contents-directory.contents-6 .directory-name{font-size:clamp(15px,1.15vw,19px);margin-top:.7vh}
.contents-directory.contents-6 .directory-items{margin-top:1.2vh;gap:.35vh}
.contents-directory.contents-6 .directory-items span{font-size:clamp(11.5px,.82vw,13.5px)}
.contents-directory.contents-6 .directory-note{font-size:clamp(10.5px,.75vw,12.4px);padding-top:.9vh}
.cx-concl{flex:0 0 auto;display:grid;grid-template-columns:auto 1fr;gap:1vw;align-items:center;background:var(--g-ink);color:#fff;border-radius:12px;padding:1.5vh 1.3vw}
.cx-concl .ck{font-size:12.4px;font-weight:700;color:var(--ink);background:#fff;border-radius:12px;padding:5px 14px;white-space:nowrap}
.cx-concl .cv{font-size:12.2px;line-height:1.55;color:rgba(255,255,255,.86)}
.cx-concl .cv b{color:#fff;font-weight:700}

.jd.learn .jd-em{text-shadow:0 0 3px #fffaf0,0 0 5px #fffaf0,0 0 6px #fffaf0}

.trk-wrap{flex:1;min-height:0;display:flex;flex-direction:column;gap:7px}
.trk-head{display:grid;grid-template-columns:112px 1fr;gap:10px;flex:0 0 auto}
.trk-hs{display:grid;grid-template-columns:repeat(5,1fr);gap:0}
.trk-hs span{display:flex;align-items:center;justify-content:center;background:#989a9b;color:#fff;font-size:12.2px;font-weight:700;height:30px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%,10px 50%);padding:0 8px 0 12px}
.trk{flex:1;min-height:0;display:grid;grid-template-columns:112px 1fr;gap:10px;align-items:center;background:rgba(255,255,255,.42);border:1px solid rgba(255,255,255,.72);border-radius:11px;padding:0 1vw;box-shadow:0 8px 22px -20px rgba(30,40,70,.4)}
.trk-lab{position:relative;display:flex;flex-direction:column;gap:.1em;font-size:12.4px;font-weight:800;color:var(--ink);padding-left:.95em;line-height:1.2}
.trk-lab::before{content:"";position:absolute;left:0;top:.34em;width:6px;height:6px;border-radius:50%;background:#0E7C86}
.trk-lab.e::before{background:#4B4BA8}
.trk-lab small{font-size:9.4px;font-weight:400;color:var(--ink-3);font-family:'JetBrains Mono'}
.trk-line{position:relative;height:100%}
.trk-line::before{content:"";position:absolute;left:0;right:0;top:50%;height:1.5px;background:linear-gradient(90deg,rgba(120,132,150,.12),rgba(120,132,150,.5),rgba(120,132,150,.12))}
.trk-pt{position:absolute;top:50%;transform:translate(-50%,-50%);width:8px;height:8px;border-radius:50%;background:#B3403A;box-shadow:0 0 0 4px rgba(179,64,58,.1);z-index:2}
.trk-lb{position:absolute;transform:translateX(-50%);width:236px;text-align:center;font-size:11px;line-height:1.28;font-weight:600;color:#8E2F35;z-index:2}
.trk-lb.up{bottom:calc(50% + 12px)}
.trk-lb.dn{top:calc(50% + 12px)}

.jd.learn .jd-em.pain{text-shadow:0 0 3px #ffead0,0 0 5px #ffead0}

.frk-head{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:1vw;margin-bottom:.8vh}
.frk-h{font-size:11.4px;font-weight:700;color:#fff;border-radius:8px;padding:.6vh .8vw;text-align:center}
.frk-h.a{background:linear-gradient(120deg,#0E7C86,#2E9AA4)}
.frk-h.b{background:linear-gradient(120deg,#4B4BA8,#6E6ED6)}
.frk{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:1vw;align-items:center;border-top:1px solid rgba(47,61,99,.13);padding:1.5vh 0}
.frk:first-of-type{border-top:0}
.frk-cond b{display:block;font-size:13px;color:var(--ink);margin-bottom:.25em}
.frk-cond span{font-size:10.6px;color:var(--ink-3);line-height:1.35}
.frk-out{font-size:11.8px;line-height:1.4;color:var(--ink-2);padding-left:0}
.frk-out.a{color:#2C5C60}
.frk-out.b{color:#3F3F80}


#deck{counter-reset:pg}
.slide{counter-increment:pg}
.pfoot{position:absolute;left:4vw;right:4vw;bottom:2.2vh;display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono';font-size:9px;letter-spacing:.14em;color:var(--ink-3);text-transform:uppercase;pointer-events:none;z-index:2}
.pfoot::after{content:counter(pg,decimal-leading-zero) " / 23";opacity:.8}

.tflow{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:1.6vh}
.tflow-ends{display:flex;justify-content:space-between;font-family:'JetBrains Mono';font-size:10px;letter-spacing:.1em;color:var(--ink-3);text-transform:uppercase}
.tflow-band{flex:0 0 auto;display:grid;grid-template-columns:repeat(4,1fr);background:rgba(255,255,255,.52);border:1px solid rgba(255,255,255,.86);border-radius:16px;overflow:hidden;box-shadow:0 16px 40px -30px rgba(30,40,70,.5)}
.tstep{padding:3.2vh 1.2vw;display:flex;flex-direction:column;gap:.9vh;border-right:1px dashed rgba(47,61,99,.16);min-width:0}
.tstep:last-child{border-right:0}
.tstep .no{font-family:'Inter';font-weight:200;font-size:clamp(30px,3.2vw,48px);line-height:1;color:rgba(91,91,214,.38);letter-spacing:-.02em}
.tstep h3{font-size:clamp(13.5px,1.05vw,17px);font-weight:800;color:var(--ink);margin-top:.3vh}
.tstep .q{font-size:11.4px;color:var(--ink-3)}
.tstep .tev{margin-top:1.4vh;font-size:12px;color:var(--ink-2);line-height:1.6}
.tstep .tev b{color:var(--ink);font-weight:600}
.tstep .bad{margin-top:2.2vh;padding-top:1.2vh;border-top:1px dashed rgba(47,61,99,.16);font-size:10.6px;line-height:1.45;color:#8E2F35}
.tflow-foot{display:grid;grid-template-columns:1.35fr 1fr;gap:1.2vw;align-items:stretch}
.tf-quote{display:flex;flex-direction:column;gap:.7vh;justify-content:center}
.tf-h{font-size:10.6px;font-weight:700;letter-spacing:.1em;color:var(--ink-3);font-family:'JetBrains Mono';text-transform:uppercase;margin-bottom:.2vh}
.tf-quote p{font-size:11.4px;line-height:1.5;color:var(--ink-2)}
.tf-quote p b{color:var(--ink);font-weight:700}

.seq-foot{display:flex;flex-direction:column;gap:.5vh;margin-top:1.4vh}
.sf-row{display:grid;grid-template-columns:64px 1fr;gap:.7vw;align-items:baseline}
.sf-k{font-family:'JetBrains Mono';font-size:9.6px;letter-spacing:.14em;color:var(--ink-3);text-transform:uppercase;text-align:right}
.sf-v{font-size:11.6px;color:var(--ink-2);line-height:1.5}
.sf-v b{color:var(--ink);font-weight:600}
.cond-wrap{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:2vh}
.cond{flex:0 1 auto;display:grid;grid-template-columns:1.02fr .98fr;gap:2.4vw;align-items:center}
.cond-left,.cond-right{display:flex;flex-direction:column;gap:1.2vh;min-width:0}
.cond-h{font-size:12px;font-weight:800;color:var(--ink);letter-spacing:.02em;margin-bottom:.4vh}
.qrow{display:grid;grid-template-columns:34px 1fr 26px 1.05fr;gap:.6vw;align-items:center;background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.82);border-radius:11px;padding:2vh .9vw}
.qno{font-family:'JetBrains Mono';font-size:10px;font-weight:700;color:#4B4BA8}
.qq b{display:block;font-size:12.6px;color:var(--ink);margin-bottom:.15em}
.qq span{font-size:10.4px;color:var(--ink-3);line-height:1.35}
.qarrow{color:var(--ink-3);text-align:center;font-size:14px}
.qout b{display:block;font-size:12.2px;color:#3B3B85;margin-bottom:.15em}
.qout span{font-size:10.4px;color:var(--ink-2);line-height:1.35}
.xtab{display:grid;grid-template-columns:74px repeat(3,1fr);gap:6px}
.xt-h{font-size:10.6px;font-weight:700;color:var(--ink-2);text-align:center;padding:.4vh .2vw;line-height:1.25}
.xt-r{display:flex;align-items:center;font-size:11.2px;font-weight:700;color:var(--ink);line-height:1.2}
.xt-r.stu{color:#0E7C86}
.xt-r.emp{color:#4B4BA8}
.xt-c{background:rgba(255,255,255,.62);border:1px solid rgba(255,255,255,.9);border-radius:9px;padding:1.9vh .5vw;font-size:11px;color:var(--ink-2);text-align:center;line-height:1.35}
.xt-c.dim{color:var(--ink-3)}
.cond-note{font-size:11px;color:var(--ink-2);line-height:1.5;margin-top:.6vh}
.cond-note b{color:var(--ink)}

.seq2{flex:1;min-height:0;display:flex;flex-direction:column;gap:1vh}
.seq2>svg{width:100%;height:auto;display:block;flex:0 1 auto;min-height:0}
.seq2-foot{display:flex;flex-direction:column;gap:.35vh}
.seq2-legend{display:flex;flex-wrap:wrap;gap:.45vh 1.1vw;align-items:center;font-size:10.2px;color:var(--ink-2);padding-top:.6vh;border-top:1px solid rgba(47,61,99,.1)}
.seq2-legend .li{display:inline-flex;align-items:center;gap:.4em;white-space:nowrap}
.seq2-legend .sw{width:15px;height:9px;border-radius:3px;border:1px solid;display:inline-block}
.seq2-legend .ln{width:20px;height:0;border-top:1.6px solid #8C97A5;display:inline-block;position:relative}
.seq2-legend .ln::after{content:"";position:absolute;right:-1px;top:-3px;border-left:5px solid #8C97A5;border-top:3px solid transparent;border-bottom:3px solid transparent}
.seq2-legend .ln.dash{border-top-style:dashed;border-top-color:#2F5FA8}
.seq2-legend .ln.dash::after{border-left-color:#2F5FA8}
.seq2-legend .ci{width:15px;height:15px;border-radius:50%;border:1.5px solid #2F3D63;color:#2F3D63;font-size:8px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;font-family:'JetBrains Mono'}
"""