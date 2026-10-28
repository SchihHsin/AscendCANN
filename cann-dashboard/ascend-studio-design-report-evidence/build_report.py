"""Build the standalone report from the report-ppt-skill runtime and captured UI."""
from pathlib import Path
import base64
import html
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
SKILL = Path("/Users/hsin/.codex/skills/report-ppt-skill")
OUT = HERE.parent / "ascend-studio-design-report.html"
TEMPLATE = (SKILL / "assets/deck-template.html").read_text()

def esc(s):
    return html.escape(s, quote=True)

def asset(name):
    p = HERE / name
    return "data:image/jpeg;base64," + base64.b64encode(p.read_bytes()).decode()

def shot(name, caption, overlay=""):
    return f'<figure class="r-ui"><img src="{asset(name)}" alt="{esc(caption)}">{overlay}<figcaption>{caption}</figcaption><button class="r-enlarge" aria-label="放大界面截图" title="放大界面截图">↗</button></figure>'

def tabs(active):
    names = ["用户旅程", "表达目标", "边做边懂", "自主学习", "移动续学", "知识供给"]
    return '<nav class="section-tabs" aria-label="当前章节">' + "".join(
        f'<span class="{"active" if n == active else ""}">{n}</span>' for n in names
    ) + "</nav>"

def gray(title, sub, content, active="用户旅程", note="", cls=""):
    return f'''<section class="slide s-gray {cls}" data-title="{esc(title)}">
    <header class="head"><div class="head-l"><div class="brand"><h1 class="ttl">{title}</h1></div><div class="subttl">{sub}</div></div>{tabs(active)}</header>
    <main class="body-area">{content}</main><footer class="r-foot">{note}</footer></section>'''

def dark(title, desc, points, visual, chapter, eyebrow, note="", cls=""):
    hues = {"表达目标": (234, 286), "边做边懂": (190, 235), "自主学习": (262, 315), "移动续学": (160, 205)}
    h1, h2 = hues[chapter]
    pts = "".join(f'<div class="point"><div class="dot"></div><div><h3 class="pt-title">{a}</h3><p class="pt-desc">{b}</p></div></div>' for a,b in points)
    return f'''<section class="slide s-glow r-design {cls}" data-title="{esc(re.sub('<[^>]+>','',title))}" style="--glow-h:{h1};--glow-h2:{h2};--glow-sat:82%;--glow-light:38%;--glow-color-int:.40;--glow-white-int:.12;--glow-spread:37">
    <div class="glow"></div><div class="glow-white"></div><div class="chrome"><span>{eyebrow}</span><span>{chapter} · ASCEND STUDIO</span></div>
    <main class="inner"><div class="r-copy"><h1 class="h-title">{title}</h1><p class="body">{desc}</p><div class="points">{pts}</div></div><div class="r-visual">{visual}</div></main>
    <footer class="r-foot">{note}</footer></section>'''

def badge(n, x, y):
    return f'<span class="r-pin" style="left:{x}%;top:{y}%">{n}</span>'

CSS = r"""
/* Report-specific content; base surfaces and complete navigation are inherited. */
:root{--fs-h1:clamp(22px,1.8vw,32px);--fs-h2:clamp(19px,1.4vw,25px);--fs-h3:clamp(17px,1.2vw,21px);--fs-body:clamp(15px,1.12vw,19px)}
.report *{min-width:0;min-height:0}
body.overview.ctrl #deck{width:auto}
.report .head{gap:2vw;margin-bottom:2.4vh}.report .head-l{flex:1}.report .brand .ttl{line-height:1.3}
.report .body-area{padding-bottom:3.4vh}.report a{color:inherit;text-underline-offset:.22em}
.r-foot{position:absolute;bottom:2.2vh;left:4vw;right:4vw;font-size:var(--fs-sm);line-height:1.4;color:#747c89;display:flex;justify-content:space-between;gap:2vw}
.s-glow .r-foot{left:6vw;right:6vw;color:rgba(255,255,255,.43)}
.r-design .inner{grid-template-columns:.65fr 1.45fr;gap:3vw;padding-top:2vh;padding-bottom:2vh}
.r-design .h-title{font-size:clamp(26px,2.65vw,46px);line-height:1.28;margin-bottom:2vh}
.r-design .body{margin-bottom:3vh}.r-design .points{gap:2.3vh}.r-design .pt-desc{font-size:var(--fs-body);line-height:1.6;color:rgba(255,255,255,.59)}
.r-design .pt-title{margin-bottom:.45vh}.r-visual{display:flex;align-items:center;justify-content:center;position:relative;height:100%}
.r-ui{position:relative;width:100%;margin:0;border:1px solid #ffffff30;border-radius:12px;background:#fff;box-shadow:0 28px 70px #0005;overflow:visible}
.r-ui>img{width:100%;height:auto;max-height:64vh;object-fit:contain;display:block;border-radius:11px}
.r-ui figcaption{position:absolute;top:calc(100% + 1.6vh);left:0;right:0;font-size:var(--fs-sm);line-height:1.5;color:#ffffff75}
.r-enlarge{position:absolute;right:10px;bottom:10px;width:30px;height:30px;background:#15151cdb;color:#fff;border:1px solid #fff5;border-radius:8px;font-size:var(--fs-h3);cursor:pointer}
.r-pin{position:absolute;display:grid;place-items:center;width:25px;height:25px;border:2px solid white;border-radius:50%;font-size:var(--fs-sm);font-weight:800;background:#5b5bd6;color:#fff;box-shadow:0 2px 10px #0004;transform:translate(-50%,-50%)}
.r-cover{background:#080a13!important}.r-cover .r-cover-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.29;filter:saturate(.55);transform:scale(1.04)}
.r-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#080a13 3%,#080a13da 38%,#080a1355),linear-gradient(0deg,#080a13,transparent 45%)}
.r-cover-content{position:absolute;inset:9vh 6vw;z-index:2;display:flex;flex-direction:column;justify-content:center;align-items:flex-start}
.r-cover-logo{height:46px;width:auto;filter:brightness(0) invert(1);margin-bottom:5vh}
.r-cover-kicker{font:500 var(--fs-sm)/1.4 'JetBrains Mono',monospace;letter-spacing:.18em;color:#b4b8ca;margin-bottom:2vh}
.r-cover h1{font-size:clamp(44px,5.3vw,90px);line-height:1.18;letter-spacing:-.025em;font-weight:650;color:#fff}
.r-cover h1 span{font-weight:250;color:#c1c5fb}.r-cover-lead{font-size:var(--fs-h2);line-height:1.75;color:#c1c4d1;margin-top:3.2vh}
.r-cover-bottom{position:absolute;z-index:3;bottom:5vh;left:6vw;right:6vw;display:flex;justify-content:space-between;font-size:var(--fs-sm);color:#b5b8c6}
.r-journey .body-area{justify-content:flex-start;padding-top:.2vh}
.r-journey .r-entry{display:flex;gap:2vw;align-items:center;margin-bottom:1.4vh;padding-left:70px;font-size:var(--fs-body);line-height:1.4}
.r-entry b{color:#4947ad}.r-entry span+span{padding-left:2vw;border-left:1px solid #c8cbd5}
.r-journey .jrn-wrap{--jrn-cols:5}.r-journey .jrn-grid{grid-template-columns:70px repeat(5,minmax(0,1fr))}
.r-journey .jrn-ph{min-height:8.1vh;padding:.9vh 1vw}.r-journey .pt{min-height:0;font-size:var(--fs-h3);margin-top:.7vh}.r-journey .pn{font-size:var(--fs-sm);color:#ffffff65}
.r-journey .jrn-tc{min-height:5.4vh;padding:.7vh 1vw}.r-journey .jrn-touch{font-size:var(--fs-body)}
.r-journey .jrn-fc{min-height:18vh;padding:1.1vh 1vw;gap:1vh}.r-journey .r-action{font-size:var(--fs-body);line-height:1.5}
.r-action b{font-size:var(--fs-sm);display:block;color:#6b66ad;margin-bottom:.2vh}.r-action+.r-action{border-top:1px solid #d3d5df;padding-top:.8vh}
.r-journey .jrn-grid.je{height:9vh}.r-journey .jrn-ec .emotion{font:500 var(--fs-sm)/1.3 inherit;bottom:.6vh;color:#737181}
.r-journey .jrn-pc,.r-journey .jrn-oc{min-height:11vh;padding:1vh 1vw;gap:.7vh;justify-content:flex-start}
.r-journey .jrn-text,.r-journey .jrn-ot{font-size:var(--fs-body);line-height:1.48}.r-journey .jrn-rn{font-size:var(--fs-sm)}
.r-journey .jrn-ec svg{overflow:visible}.r-journey .jrn-pw,.r-journey .jrn-tw,.r-journey .jrn-fw,.r-journey .jrn-ew,.r-journey .jrn-pw2,.r-journey .jrn-ow{padding-right:7px}
.r-map{width:100%;border-collapse:separate;border-spacing:0 .9vh;font-size:var(--fs-body)}
.r-map th{text-align:left;color:#7b8290;font-size:var(--fs-sm);font-weight:500;padding:.5vh 1.3vw}
.r-map td{background:#ffffff98;padding:1.8vh 1.3vw;vertical-align:middle;line-height:1.55;border-top:1px solid white;border-bottom:1px solid white}
.r-map td:first-child{border-radius:12px 0 0 12px;width:8%;font:300 2.8vw/1 'Inter',sans-serif;color:#9298b1}
.r-map td:last-child{border-radius:0 12px 12px 0;width:29%;color:#4845a3}.r-map strong{font-size:var(--fs-h3);color:#202331;font-weight:650}
.r-map td:nth-child(2){width:29%}.r-map td:nth-child(3){color:#656a78}
.r-map a{display:inline-flex;gap:.5em;align-items:center;text-decoration:none}
.r-chips{display:flex;gap:.55vw;flex-wrap:wrap;margin-top:1.5vh}.r-chip{display:inline-flex;width:fit-content;align-self:flex-start;border:1px solid #d5d8e0;border-radius:99px;padding:.45vh .7vw;font-size:var(--fs-sm);color:#677080;background:#ffffff66}
.r-sequence{display:flex;gap:.8vw;align-items:center;margin-top:3vh;font-size:var(--fs-body)}
.r-sequence span{padding:1vh 1vw;border:1px solid #ffffff29;background:#ffffff0c;border-radius:8px}.r-sequence i{font-style:normal;color:#a5a2df}
.r-overlay-lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.r-prompt-demo{width:100%;height:60vh;display:grid;grid-template-rows:1fr auto;gap:2vh}
.r-field-map{position:relative;border-radius:14px;background:#f5f5f7;color:#252735;overflow:hidden;min-height:0}
.r-field-map svg{position:absolute;inset:0;width:100%;height:100%}
.r-field{position:absolute;transform:translate(-50%,-50%);background:#fff;padding:1.2vh 1.1vw;border:1px solid #dfdfe8;border-radius:10px;box-shadow:0 8px 18px #1715270c;max-width:38%;font-size:var(--fs-h3);font-weight:650;line-height:1.4}
.r-field small{display:block;color:#89849b;font:500 var(--fs-sm)/1.5 inherit;margin-top:.35vh}
.r-field.purple{background:#efecff;border-color:#d2cafa;color:#5b49ac}
.r-prompt-box{border:1px solid #ffffff36;background:#15141f;border-radius:12px;padding:1.5vh 1.2vw;color:#dedce9;display:grid;grid-template-columns:1fr auto;gap:1vw;align-items:center;font-size:var(--fs-body);line-height:1.7}
.r-prompt-box textarea{width:100%;resize:none;background:transparent;color:inherit;font:inherit;border:0;outline:0;height:6.8em}
.r-send{border:1px solid #ffffff50;border-radius:99px;background:#eeeaff;color:#302452;padding:.7em 1em;font-size:var(--fs-body);cursor:pointer;white-space:nowrap}
.r-prompt-feedback{grid-column:1/-1;color:#bfb5ef;font-size:var(--fs-sm);min-height:1.4em}
.r-cognition{width:100%;height:63vh;border:1px solid #ffffff2d;border-radius:14px;background-color:#f5f5f5;background-image:radial-gradient(#c9c9cf 1px,transparent 1px);background-size:17px 17px;position:relative;overflow:hidden;color:#242631}
.r-cognition>svg{position:absolute;inset:0;width:100%;height:100%}
.r-node{position:absolute;border-radius:10px;border:1px solid #dedee5;background:white;padding:1.5vh 1vw;font-size:var(--fs-body);line-height:1.55;box-shadow:0 8px 24px #1515290a}
.r-node h3{font-size:var(--fs-h3);margin-bottom:1vh}.r-node small{font-size:var(--fs-sm);color:#888697}
.r-node pre{font:500 var(--fs-body)/1.7 'JetBrains Mono',monospace;white-space:pre-wrap}
.r-node.root{left:5%;top:8%;width:31%;background:#ebe8fb;border-color:#cbc4ea}
.r-node.note{left:49%;top:7%;width:43%;background:#fffdf5}
.r-node.code{left:46%;top:65%;width:47%;background:#f7f7ff}
.r-node.draw{left:5%;top:41%;width:33%;height:41%}
.r-node.custom{left:6%;bottom:4%;width:32%;padding:.7vh 1vw;border-style:dashed}
.r-axes{display:flex;align-items:center;gap:.5vw;margin-top:2vh}.r-axes span{border-radius:5px;padding:.5vh .6vw;background:#e9e6fb;color:#5c519e}
.r-axes span:nth-child(2){background:#e2f2f1;color:#39857e}.r-axes span:nth-child(3){background:#f9e8eb;color:#a65c72}
.r-design-note{position:absolute;top:1vh;right:1vw;color:#9c9aa7;font-size:var(--fs-sm)}
.r-transition{display:grid;grid-template-columns:1fr 1fr;gap:2.5vw;align-items:stretch;width:100%;position:relative}
.r-transition .card{padding:3vh 2vw;display:flex;flex-direction:column;gap:1.4vh}
.r-transition h2{font-size:var(--fs-h1)}.r-transition p{font-size:var(--fs-body);line-height:1.7;color:var(--ink-2)}
.r-transition .r-loop{grid-column:1/-1;display:flex;align-items:center;justify-content:center;gap:2vw;padding:1.7vh;border:1px solid #d2d3df;border-radius:12px;background:#ffffff60;font-size:var(--fs-h3)}
.r-transition .r-loop span{color:#5b51b5}.r-transition .r-smallshot{height:25vh;object-fit:contain;object-position:top;width:100%;border-radius:8px;margin-top:1vh}
.r-phones{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5vw;align-items:start;width:100%}
.r-phone{margin:0;position:relative;display:flex;flex-direction:column;align-items:center;gap:1.2vh}
.r-phone img{height:56vh;max-width:100%;object-fit:contain;border:4px solid #25252e;border-radius:22px;background:#fff;box-shadow:0 20px 40px #0005}
.r-phone figcaption{font-size:var(--fs-body);line-height:1.55;color:#e6e4ed;text-align:center}
.r-phone figcaption small{display:block;font-size:var(--fs-sm);color:#aaa8bc;margin-top:.3vh}
.r-mobile-wide .inner{grid-template-columns:.55fr 1.45fr}.r-mobile-wide .points{gap:2vh}
.r-signal{height:62vh;width:100%;display:grid;grid-template-columns:.9fr 1.25fr;gap:2vw;align-items:center}
.r-signal img{width:100%;height:58vh;object-fit:contain;border-radius:18px}
.r-signal-flow{display:flex;flex-direction:column;gap:1.4vh}
.r-signal-flow div{padding:1.6vh 1.2vw;border:1px solid #ffffff28;border-radius:10px;background:#ffffff08;font-size:var(--fs-body);line-height:1.6}
.r-signal-flow b{display:block;font-size:var(--fs-h3);color:#e7fff4;margin-bottom:.3vh}
.r-signal-flow i{font-style:normal;color:#8de0c3;text-align:center}
.r-supply{display:grid;grid-template-columns:.7fr 1.3fr;gap:2.8vw;width:100%;align-items:center}
.r-supply-copy h2{font-size:var(--fs-h1);line-height:1.45;margin-bottom:2vh}
.r-supply-copy p{font-size:var(--fs-body);color:#656b78;line-height:1.8;margin-bottom:2vh}
.r-unit{background:#ffffffb3;border:1px solid #fff;border-radius:18px;padding:2.6vh 2vw;box-shadow:0 14px 42px #1f224f0b}
.r-unit-top{display:flex;justify-content:space-between;gap:1vw;align-items:center;color:#898595;font-size:var(--fs-sm);margin-bottom:1.5vh}
.r-unit h2{font-size:var(--fs-h1);line-height:1.4;margin-bottom:1vh}
.r-unit-diagram{display:flex;align-items:center;gap:1.5vw;padding:2vh 0;margin-bottom:1vh}
.r-unit-diagram span{font:500 var(--fs-h3)/1.5 'JetBrains Mono',monospace;color:#565098}.r-unit-diagram i{font-style:normal;color:#9691ac}
.r-unit-row{display:grid;grid-template-columns:6em 1fr;gap:1vw;border-top:1px solid #e5e5ec;padding:1.3vh 0;font-size:var(--fs-body);line-height:1.6}
.r-unit-row b{font-weight:650;color:#4f4b79}.r-unit-row p{color:#555c69}
.r-supply-strip{padding:1.5vh 1.5vw;border-radius:10px;background:var(--g-ink);color:#fff;font-size:var(--fs-body);line-height:1.7}
.r-supply-strip small{display:block;color:#bec1cd;font-size:var(--fs-sm)}
.r-service{width:100%;height:62vh;display:grid;grid-template-columns:.75fr 1.1fr 1.15fr;gap:4vw;align-items:center;position:relative}
.r-service>svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.r-service-col{display:flex;flex-direction:column;gap:1.5vh;z-index:1}
.r-service-item{padding:2vh 1.3vw;border:1px solid #fff;border-radius:12px;background:#ffffffb0;font-size:var(--fs-body);line-height:1.65}
.r-service-item h3{font-size:var(--fs-h3);margin-bottom:.4vh}.r-service-item p{color:#69707d}
.r-service-core{padding:4vh 1.8vw;border-radius:18px;background:var(--g-accent);color:#fff;z-index:1}
.r-service-core h2{font-size:var(--fs-h1);line-height:1.45;margin-bottom:2vh}.r-service-core p{font-size:var(--fs-body);line-height:1.75;color:#eee9ff}
.r-return{position:absolute;left:0;right:0;bottom:0;text-align:center;font-size:var(--fs-body);color:#526b64}
.r-eval{width:100%;border-collapse:collapse;font-size:var(--fs-body);line-height:1.6}.r-eval th,.r-eval td{text-align:left;padding:1.5vh 1.1vw;border-bottom:1px solid #ccd0da}.r-eval th{font-size:var(--fs-sm);font-weight:500;color:#7b8290}.r-eval td:first-child{font-weight:650}.r-eval td:last-child{color:#655caa}
.r-summary{font-size:var(--fs-h1);line-height:1.6;margin-bottom:2.4vh;color:#383348}
.r-source-grid{display:grid;grid-template-columns:1fr 1fr;gap:2vw}.r-source-grid .card{padding:2.5vh 1.7vw}
.r-source-grid h2{font-size:var(--fs-h2);line-height:1.5;margin-bottom:1.5vh}
.r-source-grid p,.r-source-grid li{font-size:var(--fs-body);line-height:1.8;color:#626977}.r-source-grid ul{padding-left:1.2em}
.r-source-grid p+p{margin-top:1.5vh}
.r-modal{position:fixed;inset:0;z-index:1500;background:#08090eef;display:none;align-items:center;justify-content:center;padding:5vh 4vw}
.r-modal.open{display:flex}.r-modal img{max-width:100%;max-height:90vh;object-fit:contain}
.r-modal button{position:absolute;right:2vw;top:2vh;border:1px solid #ffffff55;border-radius:99px;background:#24252a;color:#fff;padding:.6em 1em;font-size:var(--fs-body);cursor:pointer}
.report button:focus-visible,.report a:focus-visible{outline:3px solid #b3a3ff;outline-offset:4px}
@media(max-height:720px){.r-design .points{gap:1.5vh}.r-design .body{margin-bottom:2vh}.r-journey .jrn-fc{min-height:17vh}.r-journey .jrn-pc,.r-journey .jrn-oc{min-height:12vh}.r-journey .r-entry{font-size:var(--fs-sm)}}
@media print{html,body{height:auto;overflow:visible;background:#fff}#deck{width:100%}.slide{height:210mm;width:297mm;break-after:page;page-break-after:always}#controls,#navDots,#toggle,#panel,.r-enlarge{display:none!important}@page{size:A4 landscape;margin:0}}
"""

# Reuse the actual journey component skeleton and its cell layout, then change data.
j = (SKILL / "assets/user-journey-template.html").read_text()
jcss = j[j.index(".jrn-wrap{"):j.index(".foot{")]
stages = [
    ("形成目标", "AI 对话 · 首页建议", "带着故障或需求，描述目标与现场。", "方向模糊时探索；目标明确时说明想学会什么。", "Prompt 依赖自己发现问题、组织表达。", "主动建议与连线，让线索形成可编辑目标。"),
    ("组织路径", "资料 · 课程 · 路径", "查找步骤、核对条件，选择可执行方案。", "结合基础与时间，决定先学什么、如何学。", "现成内容与个人基础、目标难以贴合。", "按意图形成路径，共同增删和调整。"),
    ("实践与理解", "代码 · 日志 · 图解", "尝试修改与核验；不理解时补学原理。", "看图解、做练习，用结果检查理解。", "得到可用答案，仍可能不懂为什么。", "图解与操作联动，让结果和原理对得上。"),
    ("留下收获", "笔记 · 对话 · 社区", "整理失败、修复与验证，决定分享什么。", "写自己的解释，留下图、代码和认知卡。", "理解与经验留在私人对话，难再次使用。", "个人认知可整理，经验经审阅回到社区。"),
    ("持续成长", "微信 · 知识卡 · 下次任务", "离开电脑后补知识，回到任务继续实践。", "碎片时间续学，将新理解带入后续实践。", "离开工作现场，疑问和学习线索容易中断。", "手机短内容承接关注与存疑，保留接续线索。"),
]

def jrlabel(cn,en):
    return f'<div class="jrn-rl"><div class="jrn-rn">{cn}</div><div class="jrn-re">{en}</div></div>'

def row(label,en,items):
    return '<div class="jrn-grid">'+jrlabel(label,en)+"".join(items)+"</div>"

journey = '<div class="r-entry"><span><b>任务导向</b> · 希望把事做成</span><span><b>学习导向</b> · 希望理解并掌握</span><span>两类用户均可能是新手或有经验者</span></div><div class="jrn-wrap">'
journey += '<div class="jrn-grid"><div></div>'+''.join(f'<div class="jrn-pw"><div class="jrn-ph"><div class="pn">0{i+1}</div><div class="pt">{s[0]}</div></div></div>' for i,s in enumerate(stages))+'</div>'
journey += row("触点","TOUCH",[f'<div class="jrn-tw"><div class="jrn-tc"><div class="jrn-touch">{s[1]}</div></div></div>' for s in stages])
journey += row("行为","ACTION",[f'<div class="jrn-fw"><div class="jrn-fc"><div class="r-action"><b>任务导向</b>{s[2]}</div><div class="r-action"><b>学习导向</b>{s[3]}</div></div></div>' for s in stages])
ys=[25,43,49,34,41]; moods=["难以说清","不知取舍","能做未必懂","收获分散","容易中断"]
em=[]
for i,y in enumerate(ys):
    start=ys[0] if i==0 else (ys[i-1]+y)/2
    end=y if i==4 else (y+ys[i+1])/2
    em.append(f'<div class="jrn-ew"><div class="jrn-ec" style="--stage:#7770b4;--y:{y}%"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="0,{start} 50,{y} 100,{end}" fill="none" stroke="#8780bb" stroke-width="1.5"/></svg><div class="dot"></div><div class="emotion">{moods[i]}</div></div></div>')
journey += '<div class="jrn-grid je">'+jrlabel("感受","示意")+' '.join(em)+'</div>'
journey += row("痛点","PAIN",[f'<div class="jrn-pw2"><div class="jrn-pc"><div class="jrn-text"><b>P{i+1}</b> · {s[4]}</div></div></div>' for i,s in enumerate(stages)])
journey += row("机会","DESIGN",[f'<div class="jrn-ow"><div class="jrn-oc"><div class="jrn-ot">{s[5]}</div></div></div>' for s in stages])+'</div>'

slides=[]
logo="data:image/svg+xml;base64,"+base64.b64encode((ROOT/"ascstudio/assets/ascend-logo.svg").read_bytes()).decode()
slides.append(f'''<section class="slide s-cover r-cover" data-title="让任务推进，也让能力成长"><img class="r-cover-image" src="{asset('04-connected-prompt.jpg')}" alt=""><div class="r-cover-content"><img class="r-cover-logo" src="{logo}" alt="Ascend"><div class="r-cover-kicker">ASCEND STUDIO · EXPERIENCE DESIGN</div><h1>让任务推进<br><span>也让能力成长</span></h1><p class="r-cover-lead">从一次表达，到理解、实践与经验回流<br>电脑端 · 小程序 · 知识供给</p></div><div class="r-cover-bottom"><span>基于现有交互原型的设计提案</span><span>2026.10</span></div></section>''')
slides.append(gray("两类用户从不同起点，进入同一条成长旅程", "用户旅程 · 使用目的区分人群，专业程度影响引导深度",journey,note="基于旧报告 #5 的行为框架与本轮设计讨论重组；痛点及感受为设计推演，非新访谈或测量结果。",cls="r-journey"))

mapping=[
("01","表达目标","自己先发现、观察、组织 Prompt","从空白输入到有依据的起点","主动建议 · 线索串联",4),
("02","组织路径","想学，但不知道怎样适合自己","从接受课程到共同制定路径","意图路径 · 共创编辑",8),
("03","实践与理解","答案可用，原理仍然不清楚","从照着做，到看懂并判断","联动图解 · 理解检查",6),
("04","留下收获","个人理解与排障经验难复用","从私人对话到个人与社区资产","认知卡片 · 经验回流",7),
("05","持续成长","离开电脑，关注与疑问随之中断","从等待回来，到碎片时间续学","口袋新知 · 知识供给",12),
]
table='<table class="r-map"><thead><tr><th></th><th>旅程中的问题</th><th>希望发生的体验转变</th><th>设计响应</th></tr></thead><tbody>'
for no,stage,problem,change,response,page in mapping:
    table+=f'<tr><td>{no}</td><td><strong>{stage}</strong><br>{problem}</td><td>{change}</td><td><a href="#{page}">{response} ↗</a></td></tr>'
table+='</tbody></table>'
slides.append(gray("五个断点，决定后续设计分别解决什么", "问题 → 体验转变 → 设计响应",table,note="问题来自用户提出的设计命题与现有原型；效果需后续体验验证。点击设计响应可跳转。"))

slides.append(dark("从空白输入<br>到有依据的起点","P1 · Prompt 的质量依赖用户先发现问题、回忆现场，再组织成语言。<b>把可讨论的线索主动摆出来。</b>",[
("看见建议从哪里来","历史问题与具体片段形成推荐依据。"),
("从建议进入行动","选择学习、先讨论，或暂不处理。"),
("保留用户的判断","推荐作为候选方向，用户决定下一步。")
],shot("03-proactive-card.jpg","现有 Demo · 展开推荐卡，查看近期记录、推荐理由与下一步。",badge(1,36,32)+badge(2,39,70)),"表达目标","01.1 · PROACTIVE START",note="推荐记录为策划示例；设计重点是建议如何被理解与选择。"))

prompt_visual='''<div class="r-prompt-demo"><div class="r-field-map"><svg viewBox="0 0 700 370" preserveAspectRatio="none"><defs><marker id="r-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" fill="#9a8dcc"/></marker></defs><path d="M170 104 C235 104 228 210 310 210 M400 210 C490 210 470 98 535 98 M535 130 C535 185 502 275 450 290" stroke="#9a8dcc" stroke-width="2" fill="none" marker-end="url(#r-arr)"/></svg><div class="r-field purple" style="left:24%;top:26%">多卡收益不明显<small>当前现象</small></div><div class="r-field" style="left:51%;top:57%">梯度同步<small>排查线索</small></div><div class="r-field" style="left:78%;top:26%">保持精度<small>约束条件</small></div><div class="r-field" style="left:70%;top:81%">对照实验<small>验证方式</small></div><span class="r-design-note">连线交互提炼示意</span></div><div class="r-prompt-box"><textarea aria-label="演示 Prompt 草稿">我想在昇腾上提升训练效率。当前现象：多卡收益不明显。需要保持精度，请重点分析梯度同步，并通过对照实验验证。</textarea><button class="r-send">发送演示</button><div class="r-prompt-feedback" aria-live="polite">连出的关系形成文字，发送前仍可直接修改。</div></div></div>'''
slides.append(dark("把线索连起来<br>把想法说完整","P1 · 用户可能知道几个关键词，却还没形成完整需求。<b>通过关系选择，逐步组织目标、条件与验证方式。</b>",[
("连接可见的线索","从现象出发，连到关注点与约束。"),
("Prompt 同步成形","每次选择都能在文字中核对。"),
("修改后明确发送","用户可以补写、删改，再决定启动。")
],prompt_visual,"表达目标","01.2 · CONNECT TO PROMPT",note="连线交互提炼示意 · 可编辑 Prompt，并体验明确发送后的反馈。"))

slides.append(dark("错误发生时<br>把原理放回现场","P3 · 修改成功并不意味着理解发生。<b>让错误、图解、参数和代码在同一现场相互对应。</b>",[
("看见抽象概念","把 HWC、CHW、batch 变成可观察结构。"),
("操作后看见变化","调整轴顺序，对照输出形状与代码。"),
("回到当前问题判断","理解为什么这样改，再继续核验。")
],shot("01-development-diagram.jpg","现有 Demo · 对话中的形状问题与右侧张量图解联动。",badge(1,77,53)+badge(2,77,37)),"边做边懂","02.1 · LEARN WHILE DEVELOPING",note="用当前错误检验理解，让解释紧贴正在进行的任务。"))

slides.append(dark("调试结束<br>经验有机会回到社区","P4 · 问题与解答进入私人 AI 对话后，<b>社区不再自然获得同一份排障过程。</b>",[
("在完成时轻量邀请","沿当前任务整理，不要求重新写一篇。"),
("草稿保留可复用信息","问题、尝试、环境与验证状态一起呈现。"),
("审阅后决定是否分享","可补充、删改；由用户确认提交。")
],shot("02-community-draft.jpg","现有 Demo · 根据任务对话整理社区草稿，在右侧逐项审阅。",badge(1,36,73)+badge(2,88,45)+badge(3,93,91)),"边做边懂","02.2 · EXPERIENCE RETURNS",note="目标体验：降低整理负担，同时保留适用范围、未决项和用户分享决定。"))

slides.append(dark("学习从意图开始<br>路径随自己形成","P2 · 知道想做什么，也可能不知道先学什么。<b>用目标、已有基础和可用时间组织学习。</b>",[
("模糊意图也能进入","通过主题探索或简短交流明确方向。"),
("明确目标直接成路","把想掌握的能力转成一组学习节点。"),
("先看路径再开始","看清先后关系、实践和检查位置。")
],shot("06-learning-intent.jpg","现有 Demo · 左侧表达目标，右侧保留基础、时间与现成路径入口。",badge(1,31,25)+badge(2,69,36)+badge(3,85,65)),"自主学习","03.1 · INTENT TO PATH",note="目标、已有基础和时间共同组织路径，用户无需先了解完整知识目录。"))

slides.append(dark("路径可以共创<br>用户拥有调整权","P2 · 生成一条路径还不够，<b>它需要容纳已有基础、新问题和学习中的变化。</b>",[
("对话提出调整","补入想学的内容，说明希望跳过的基础。"),
("在路径上审阅变化","新增重点可见，逐项采纳或忽略。"),
("确认后进入学习","草案与正式学习状态明确衔接。")
],shot("05-learning-collaboration.jpg","现有 Demo · 尺寸调整、归一化和输入检查作为待确认建议进入路径。",badge(1,26,25)+badge(2,76,56)+badge(3,84,26)),"自主学习","03.2 · CO-CREATE THE PATH",note="用户与 AI 共同调整路径，在画布上确认学习顺序和重点。"))

cognition='''<div class="r-cognition"><svg viewBox="0 0 700 500" preserveAspectRatio="none"><path d="M215 96 C300 96 310 96 400 96 M150 140L150 245 M250 292 C320 292 310 365 400 365" fill="none" stroke="#b6b1c7" stroke-width="1.5"/></svg><span class="r-design-note">个人认知画布 · 设计示意</span><article class="r-node root"><small>学习节点</small><h3>理解维度顺序</h3>HWC → CHW</article><article class="r-node note"><small>我的解释 · 可编辑</small><h3>换的是轴的位置</h3><div contenteditable="true" role="textbox" aria-label="我的认知笔记">把第 2 轴 C 移到最前。尺寸值和它代表的含义一起移动，不能只改形状数字。</div></article><article class="r-node draw"><small>我的图解</small><div class="r-axes"><span>H</span><span>W</span><span>C</span></div><p style="margin:1vh 0;color:#8e879f">↓ transpose(2,0,1)</p><div class="r-axes"><span>C</span><span>H</span><span>W</span></div></article><article class="r-node code"><small>代码片段</small><pre>chw = image.transpose(2, 0, 1)<br>nchw = chw[None, ...]</pre></article><article class="r-node custom"><small>＋ 自定义节点</small><p>补一个 transpose 与 reshape 对比</p></article></div>'''
slides.append(dark("把学到的内容<br>变成自己的认知","P4 · 跟随内容走完，仍可能只留下“看过”。<b>让学习者主动重述、画图和关联实践。</b>",[
("路径允许自行补充","加入需要比较、复习或深入的节点。"),
("用自己的方式表达","笔记、图解、代码片段关联同一知识点。"),
("形成可回看的认知卡","下次遇到问题，能找回当时的理解。")
],cognition,"自主学习","03.3 · MAKE KNOWLEDGE YOUR OWN",note="目标体验示意 · 个人笔记可编辑；自定义节点、图解与代码片段围绕同一知识点组织。"))

transition=f'''<div class="r-transition"><article class="card"><span class="r-chip">任务导向 → 学习导向</span><h2>遇到不理解的地方，补一段学习</h2><p>“我能按建议改好，但还不理解轴顺序。”<br>携带当前错误与参数进入对应图解和练习。</p><img class="r-smallshot" src="{asset('01-development-diagram.jpg')}" alt="开发中的图解"></article><article class="card"><span class="r-chip">学习导向 → 任务导向</span><h2>把理解带回实践，核对是否会用</h2><p>“我理解了 HWC 与 CHW，试着检查模型输入。”<br>保留学习路径与尝试，再进入实际开发任务。</p><img class="r-smallshot" src="{asset('07-learning-practice.jpg')}" alt="学习路径与实践内容"></article><div class="r-loop"><span>实际问题</span> → 理解与练习 → <span>应用与核验</span> → 新的问题</div></div>'''
slides.append(gray("任务与学习可以相互进入，理解随实践积累", "两类用户的连接 · 按当前诉求切换，保留上下文",transition,active="自主学习",note="目标体验：完成任务与能力增长分别留下可判断的证据，不用浏览进度替代学会。"))

phones='<div class="r-phones">'+''.join(f'<figure class="r-phone"><img src="{asset(n)}" alt="{t}"><figcaption>{t}<small>{s}</small></figcaption></figure>' for n,t,s in [
("09-mini-notification.jpg","通知里先看懂价值","主题 · 本周重点 · 内容形态"),
("10-mini-briefing.jpg","一条重点，接两张短卡","资讯与当前关注建立联系"),
("11-mini-knowledge.jpg","几分钟补一个知识点","图解 · 理解题 · 任务关联")])+'</div>'
slides.append(dark("离开电脑<br>也能接着理解","P5 · 关注和疑问产生在开发现场，学习时间可能在通勤与间隙。<b>手机承接短内容，电脑承接实践。</b>",[
("让内容适合手机","一次聚焦一个概念，减少长文跳转。"),
("从熟悉的消息进入","通知交代价值，用户选择打开。")
],phones,"移动续学","04.1 · KNOWLEDGE IN YOUR POCKET",note="现有小程序交互 Demo · 通知、速览和知识卡。截图为手机视口中的当前阅读位置。",cls="r-mobile-wide"))

signal=f'''<div class="r-signal"><img src="{asset('11-mini-knowledge.jpg')}" alt="知识卡的感兴趣与还没弄懂入口"><div class="r-signal-flow"><div><b>表达关注或存疑</b>“感兴趣”继续拓展；“还没弄懂”补解释。</div><i>↓</i><div><b>收到相关短内容</b>一条重点资讯 + 两张相关知识卡。</div><i>↓</i><div><b>整理后回到任务</b>留下理解与问题，回电脑继续核查。</div></div></div>'''
slides.append(dark("让关注和疑问<br>成为下一次学习的线索","P5 · 定期推送容易变成无关资讯。<b>用明确的兴趣、疑问信号和任务背景连接下一次内容。</b>",[
("用户能表达需要","主动标记，比猜测用户是否理解更明确。"),
("内容有连续性","短知识承接当前问题，并给出延伸入口。"),
("保留接续动作","小结与待核查问题可以带回电脑。")
],signal,"移动续学","04.2 · SIGNAL TO CONTINUITY",note="真实微信送达依赖用户授权与可用订阅模板；当前跨端接续通过复制小结演示。"))

unit='''<div class="r-supply"><div class="r-supply-copy"><h2>先回答四个<br>用户真正会问的问题</h2><p>知识提供方的交付要让人和 AI 判断：是否适用、为什么、怎么做、如何确认。</p><div class="r-supply-strip">一份知识，可被理解，也可被引用。<small>内容表达可变化；适用条件、来源与验证依据保持一致。</small></div></div><article class="r-unit"><div class="r-unit-top"><span>知识单元 · 示例</span><span>图像输入 / 维度转换</span></div><h2>HWC → CHW 应当重排轴</h2><div class="r-unit-diagram"><span>[H, W, C]</span><i>→ (2, 0, 1) →</i><span>[C, H, W]</span></div><div class="r-unit-row"><b>何时用</b><p>图像读入为 HWC，模型输入约定为 CHW / NCHW；同时核对尺寸、dtype 与归一化。</p></div><div class="r-unit-row"><b>为什么</b><p>每个轴代表不同含义；变更布局需要重排轴，不能仅凭目标数字 reshape。</p></div><div class="r-unit-row"><b>怎么做</b><p><code>image.transpose(2, 0, 1)</code>；需要 NCHW 时再加入 batch。</p></div><div class="r-unit-row"><b>如何确认</b><p>核对轴语义与输出形状；形状通过后，仍需核对实际模型的输入要求及运行结果。</p></div><div class="r-chips"><span class="r-chip">来源锚点</span><span class="r-chip">适用版本</span><span class="r-chip">核验状态</span><span class="r-chip">维护人</span></div></article></div>'''
slides.append(gray("知识提供方应交付可判断、可实践的知识单元", "供给 1 / 2 · 用一个具体例子，说明内容需要带什么",unit,active="知识供给",note="知识内容例证参考 NumPy transpose；昇腾相关内容还需携带 CANN、芯片与框架等适用范围。"))

service='''<div class="r-service"><svg viewBox="0 0 1200 560" preserveAspectRatio="none"><path d="M235 170 C285 170 275 270 360 270 M235 350 C285 350 275 270 360 270 M730 270 C800 270 785 105 855 105 M730 270L855 270 M730 270 C800 270 785 435 855 435" stroke="#b3b2c7" stroke-width="2" fill="none"/><path d="M1035 500 L1035 535 L145 535 L145 415" stroke="#7da896" stroke-width="1.5" fill="none" stroke-dasharray="5 5"/></svg><div class="r-service-col"><article class="r-service-item"><h3>官方资料与样例</h3><p>文档、API、课程与参考代码。</p></article><article class="r-service-item"><h3>经过审阅的实践经验</h3><p>环境、失败尝试、修复和验证。</p></article></div><article class="r-service-core"><h2>共同维护<br>同一份知识依据</h2><p>可引用的来源<br>明确的适用条件<br>能跟随的实践步骤<br>可核对的验证与失效状态</p></article><div class="r-service-col"><article class="r-service-item"><h3>电脑端：解释与实践</h3><p>调试图解、学习节点、练习检查。</p></article><article class="r-service-item"><h3>手机端：短读与续学</h3><p>短图解、理解题、相关资讯。</p></article><article class="r-service-item"><h3>AI 助手：检索与引用</h3><p>返回原文、适用范围与检查步骤。</p></article></div><div class="r-return">使用中发现错误或过期 → 补充证据 → 内容维护者审阅更新 → 继续服务下一次任务</div></div>'''
slides.append(gray("同一份知识服务不同入口，使用经验再回到供给端", "供给 2 / 2 · 共享事实依据，按场景组织表达",service,active="知识供给",note="目标服务关系示意。内容维护者负责准确性、适用范围与更新；产品与 AI 入口按场景取用。"))

evals=[
("表达目标","用户能否理解推荐依据，并形成自己愿意发送的 Prompt？","目标表达完整性 · 修改与选择过程"),
("组织路径","用户能否解释为什么这样学，并调整不适合自己的部分？","路径可理解性 · 调整与采纳情况"),
("实践与理解","用户能否解释修改原因，并迁移到一个相似问题？","原因重述 · 相似任务应用"),
("留下收获","个人卡片能否再次使用，社区草稿是否保留必要上下文？","回看复用 · 草稿可复现性"),
("持续成长","手机内容是否相关，回到电脑后能否继续？","内容相关性 · 接续成功情况"),
]
evaluation='<p class="r-summary">让用户更容易开始，在实践中理解，<br>把收获带入下一次任务。</p><table class="r-eval"><thead><tr><th>旅程阶段</th><th>需要验证的体验</th><th>观察信号</th></tr></thead><tbody>'+''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>' for a,b,c in evals)+'</tbody></table>'
slides.append(gray("设计价值回到旅程，用用户能做什么来验证", "验证方向 · 不以功能数量或内容浏览量替代体验成效",evaluation,note="以上为建议的后续验证问题与观察信号；当前没有对应的效果统计。"))

sources='''<div class="r-source-grid"><article class="card"><h2>材料从哪里来</h2><p><a href="https://schihhsin.github.io/AscendCANN/ascstudio/" target="_blank" rel="noopener">电脑端 Ascend Studio ↗</a><br>主动建议、线索串联、开发图解、社区草稿与学习路径共创。</p><p><a href="https://schihhsin.github.io/AscendCANN/ascstudio-mini/" target="_blank" rel="noopener">口袋新知小程序 Demo ↗</a><br>本轮截图来自本地 5217：服务通知、每周速览、知识卡与明确兴趣信号。</p><p><a href="ai-development-behavior-system-report-concise.html#5" target="_blank" rel="noopener">既有 AI 协作开发者旅程 #5 ↗</a><br>沿用从目标、信息、判断到执行的行为框架，本轮扩展学习与经验沉淀。</p></article><article class="card"><h2>如何理解这份设计提案</h2><ul><li>旅程、人群与问题是基于现有材料和本轮讨论的设计组织，尚非新一轮用户研究定稿。</li><li>截图是现有交互原型；连线提炼、个人认知画布与知识供给图为设计示意。</li><li>图解、推荐、AI 草稿和消息送达使用演示状态；不代表真实 AI、微信后台或 NPU 已接入。</li><li>未宣称任务完成率、学习收益或社区回流效果已被验证。</li></ul><p><a href="https://numpy.org/doc/stable/reference/generated/numpy.transpose.html" target="_blank" rel="noopener">知识例证：NumPy transpose ↗</a> · <a href="https://cloud.tencent.cn/document/product/1301/103770" target="_blank" rel="noopener">订阅消息接入参考 ↗</a></p></article></div>'''
slides.append(gray("设计推演与现有原型，各有清楚的依据和边界", "来源与演示范围 · 支撑材料",sources,active="知识供给",note="2026.10.28 · 页面截图与状态记录见 ascend-studio-design-report-evidence/。"))

# Copy the whole template, replace only deck content; preserve controls and runtime.
head = TEMPLATE[:TEMPLATE.index("<body>")]
body_tail = TEMPLATE[TEMPLATE.index('<!-- 调色面板'):] if '<!-- 调色面板' in TEMPLATE else ""
if not body_tail:
    pos=TEMPLATE.index('<div id="panel"')
    body_tail=TEMPLATE[pos:]
head=head.replace("<title>汇报 PPT 模板</title>","<title>Ascend Studio · 让任务推进，也让能力成长</title>")
head=head.replace("</style>",jcss+"\n"+CSS+"\n</style>")
doc=head+'<body class="report"><div id="deck">'+"\n".join(slides)+'</div>\n'+body_tail
# The starter runtime lacks hash support in this version; extend it in place.
doc=doc.replace("function updateCurrent(i){\n  idx=i;", "function updateCurrent(i){\n  idx=i;")
doc=doc.replace("counter.textContent=pad(idx+1)+' / '+pad(slides.length);", "counter.textContent=pad(idx+1)+' / '+pad(slides.length);\n  if(!document.body.classList.contains('overview')) history.replaceState(null,'','#'+(idx+1));")
doc=doc.replace("document.body.classList.remove('overview');balanceHeads();", "document.body.classList.remove('overview');updateCurrent(idx);balanceHeads();")
doc=doc.replace("let idx=0;", "let idx=0; let rOverviewTransition=false;")
doc=doc.replace("const io=new IntersectionObserver(es=>{es.forEach", "const io=new IntersectionObserver(es=>{if(document.body.classList.contains('overview')||rOverviewTransition)return;es.forEach")
doc=doc.replace("function enterOverview(){slides.forEach", "function enterOverview(){rOverviewTransition=true;slides.forEach")
doc=doc.replace("if(CTRL){setActive(idx);}else setTimeout(()=>slides[idx].scrollIntoView({block:'start',behavior:'auto'}),20);", "const destination=idx;if(CTRL){setActive(destination);rOverviewTransition=false;}else setTimeout(()=>{slides[destination].scrollIntoView({block:'start',behavior:'instant'});updateCurrent(destination);requestAnimationFrame(()=>{rOverviewTransition=false;});},20);")
doc=doc.replace("window.scrollTo(0,0);\nslides.forEach(paintSlide);\nupdateCurrent(0);\nif(CTRL) setActive(0);", """const initialPage=Math.min(slides.length,Math.max(1,parseInt(location.hash.slice(1),10)||1))-1;
slides.forEach(paintSlide);
updateCurrent(initialPage);
if(CTRL) setActive(initialPage);
else requestAnimationFrame(()=>slides[initialPage].scrollIntoView({block:'start',behavior:'instant'}));
addEventListener('hashchange',()=>{const n=parseInt(location.hash.slice(1),10);if(n>=1&&n<=slides.length)go(n-1);});
document.fonts.ready.then(()=>{balanceHeads();reanchor();});""")
# Avoid deck keyboard navigation while editing personal notes or viewing a figure.
doc=doc.replace("if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;", "if(e.target.closest('input,textarea,select,[contenteditable=true]')||document.querySelector('.r-modal.open'))return;")
extra=r'''
<div class="r-modal" role="dialog" aria-modal="true" aria-label="界面截图放大" aria-hidden="true"><button>关闭 · Esc</button><img alt="放大的界面截图"></div>
<script>
const rModal=document.querySelector('.r-modal');
let rFocus=null;
function drawService(){
  if(document.body.classList.contains('overview'))return;
  const w=document.querySelector('.r-service'),svg=w.querySelector('svg'),wr=w.getBoundingClientRect();
  const box=e=>{const r=e.getBoundingClientRect();return {x:r.left-wr.left,y:r.top-wr.top,w:r.width,h:r.height};};
  const left=[...w.querySelectorAll('.r-service-col:first-of-type .r-service-item')];
  const cols=w.querySelectorAll('.r-service-col');
  const inputs=[...cols[0].querySelectorAll('.r-service-item')],outputs=[...cols[1].querySelectorAll('.r-service-item')],core=box(w.querySelector('.r-service-core'));
  svg.setAttribute('viewBox','0 0 '+wr.width+' '+wr.height);
  let paths='<defs><marker id="supply-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="#a4a0bd" stroke-width="1.3"/></marker></defs>';
  for(const input of inputs){const b=box(input),x1=b.x+b.w+3,y1=b.y+b.h/2,x2=core.x-5,y2=core.y+core.h/2;paths+='<path d="M'+x1+' '+y1+' C'+(x1+(x2-x1)*.5)+' '+y1+' '+(x1+(x2-x1)*.5)+' '+y2+' '+x2+' '+y2+'" fill="none" stroke="#b3b2c7" stroke-width="1.5" marker-end="url(#supply-arrow)"/>';}
  for(const output of outputs){const b=box(output),x1=core.x+core.w+3,y1=core.y+core.h/2,x2=b.x-5,y2=b.y+b.h/2;paths+='<path d="M'+x1+' '+y1+' C'+(x1+(x2-x1)*.5)+' '+y1+' '+(x1+(x2-x1)*.5)+' '+y2+' '+x2+' '+y2+'" fill="none" stroke="#b3b2c7" stroke-width="1.5" marker-end="url(#supply-arrow)"/>';}
  const a=box(outputs[2]),b=box(inputs[1]),y=wr.height-45;
  paths+='<path d="M'+(a.x+a.w/2)+' '+(a.y+a.h+5)+' V'+y+' H'+(b.x+b.w/2)+' V'+(b.y+b.h+5)+'" fill="none" stroke="#7da896" stroke-width="1.5" stroke-dasharray="5 5" marker-end="url(#supply-arrow)"/>';
  svg.innerHTML=paths;
}
document.fonts.ready.then(drawService);addEventListener('resize',drawService);
function closeFigure(){rModal.classList.remove('open');rModal.setAttribute('aria-hidden','true');document.getElementById('deck').inert=false;document.getElementById('controls').inert=false;document.getElementById('navDots').inert=false;if(rFocus)rFocus.focus();}
document.querySelectorAll('.r-enlarge').forEach(b=>b.addEventListener('click',()=>{rFocus=b;rModal.querySelector('img').src=b.parentElement.querySelector('img').src;rModal.classList.add('open');rModal.setAttribute('aria-hidden','false');document.getElementById('deck').inert=true;document.getElementById('controls').inert=true;document.getElementById('navDots').inert=true;rModal.querySelector('button').focus();}));
rModal.querySelector('button').addEventListener('click',closeFigure);
rModal.addEventListener('click',e=>{if(e.target===rModal)closeFigure();});
document.addEventListener('keydown',e=>{if(rModal.classList.contains('open')&&e.key==='Escape')closeFigure();if(rModal.classList.contains('open')&&e.key==='Tab'){e.preventDefault();rModal.querySelector('button').focus();}});
document.querySelector('.r-send').addEventListener('click',()=>{const t=document.querySelector('.r-prompt-box textarea').value.trim();document.querySelector('.r-prompt-feedback').textContent=t?'已发送此页演示草稿；可以继续修改并再次体验。':'请先写下希望发送的目标。';});
</script>
'''
doc=doc.replace("</body>",extra+"</body>")
OUT.write_text(doc)
# JS extraction for syntax check without a browser.
for i,s in enumerate(re.findall(r"<script(?:\s[^>]*)?>(.*?)</script>",doc,re.S)):
    (HERE/f"runtime-{i}.js").write_text(s)
(HERE/"page-map.json").write_text(json.dumps([{"page":i+1,"title":re.sub("<[^>]+>","",re.search(r'data-title="([^"]+)"',s).group(1))} for i,s in enumerate(slides)],ensure_ascii=False,indent=2))
print(f"{OUT}: {len(slides)} pages, {len(doc):,} bytes")
