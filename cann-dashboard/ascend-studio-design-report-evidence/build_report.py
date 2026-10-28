# -*- coding: utf-8 -*-
"""Build the standalone report from the report-ppt-skill runtime and captured UI."""
from pathlib import Path
import base64
import html
import json
import re
import subprocess
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
SKILL = Path("/Users/hsin/.codex/skills/report-ppt-skill")
OUT = HERE.parent / "ascend-studio-design-report.html"
TEMPLATE = (SKILL / "assets/deck-template.html").read_text()
DESKTOP_DEMO = "https://schihhsin.github.io/AscendCANN/ascstudio/"
MINI_DEMO = "https://schihhsin.github.io/AscendCANN/ascstudio-mini/"
MINI_DEMO_LOCAL = "http://127.0.0.1:5217/ascstudio-mini/"

def esc(s):
    return html.escape(s, quote=True)

def asset(name):
    p = HERE / name
    return "data:image/jpeg;base64," + base64.b64encode(p.read_bytes()).decode()

def svg_data(name):
    p = HERE / name
    return "data:image/svg+xml;base64," + base64.b64encode(p.read_bytes()).decode()

def demo_button(kind="desktop", label=None):
    if kind == "mini":
        url, fallback, title = MINI_DEMO, MINI_DEMO_LOCAL, "口袋新知 · 小程序 Demo"
        label = label or "打开小程序 Demo"
    else:
        url, fallback, title = DESKTOP_DEMO, "", "Ascend Studio · 电脑端 Demo"
        label = label or "打开电脑端 Demo"
    return (f'<button class="r-demo-launch" type="button" data-demo-url="{esc(url)}" '
            f'data-demo-fallback="{esc(fallback)}" data-demo-title="{esc(title)}">'
            f'{esc(label)} <span aria-hidden="true">↗</span></button>')

def shot(name, caption, overlay=""):
    return f'<figure class="r-ui"><img src="{asset(name)}" alt="{esc(caption)}">{overlay}<figcaption>{caption}</figcaption><button class="r-enlarge" aria-label="放大界面截图" title="放大界面截图">↗</button></figure>'

def tabs(active):
    names = ["用户旅程", "表达目标", "边做边懂", "自主学习", "移动续学", "知识供给"]
    return '<nav class="section-tabs" aria-label="当前章节">' + "".join(
        f'<span class="{"active" if n == active else ""}">{n}</span>' for n in names
    ) + "</nav>"

def copy_editable_journey_markup_and_css():
    """Reuse concise report #5's editable DOM/grid and CSS, never its full-page screenshot."""
    template_html = HERE / "journey-template.html"
    template_css = HERE / "journey-template.css"
    if template_html.exists() and template_css.exists():
        section = template_html.read_text()
        journey_css = template_css.read_text()
    else:
        source = (ROOT / "cann-dashboard/ai-development-behavior-system-report-concise.html").read_text()
        start = source.index('<section class="slide s-gray task-rel-page"')
        end = source.index("</section>", start) + len("</section>")
        section = source[start:end]
        style_start = source.index("<style>") + len("<style>")
        style_end = source.index("</style>", style_start)
        source_style = source[style_start:style_end]
        css_start = source_style.index(".task-rel-page{")
        css_end = source_style.index(".body-area.task-flow-page", css_start)
        journey_css = source_style[css_start:css_end]
    for name in ("need-context.png", "search-fetch.png", "generate.png", "decide.png", "execute.png"):
        image_path = ROOT / "cann-dashboard/assets/agent-stage-3d" / name
        data_url = "data:image/png;base64," + base64.b64encode(image_path.read_bytes()).decode()
        section = section.replace(f'src="assets/agent-stage-3d/{name}"', f'src="{data_url}"')
    return section, journey_css

def div_bounds(markup, class_name):
    match = re.search(r'<div\b[^>]*class="[^"]*\b' + re.escape(class_name) + r'\b[^"]*"[^>]*>', markup)
    if not match:
        raise ValueError(f"missing div class: {class_name}")
    depth = 0
    for tag in re.finditer(r'</?div\b[^>]*>', markup[match.start():], re.S):
        token = tag.group(0)
        depth += -1 if token.startswith("</") else 1
        if depth == 0:
            return match.start(), match.start() + tag.end()
    raise ValueError(f"unclosed div class: {class_name}")

def replace_div_content(markup, class_name, content):
    start, end = div_bounds(markup, class_name)
    opening_end = markup.index(">", start) + 1
    closing_start = markup.rfind("</div>", opening_end, end)
    return markup[:opening_end] + content + markup[closing_start:]

def gray(title, sub, content, active="用户旅程", note="", cls="", demo=None):
    body = (f'<div class="r-gray-demo"><div class="r-gray-demo-content">{content}</div>'
            f'{demo_button(demo)}</div>') if demo else content
    return f'''<section class="slide s-gray {cls}" data-title="{esc(title)}">
    <header class="head"><div class="head-l"><div class="brand"><h1 class="ttl">{title}</h1></div><div class="subttl">{sub}</div></div>{tabs(active)}</header>
    <main class="body-area">{body}</main><footer class="r-foot">{note}</footer></section>'''

def dark(title, desc, points, visual, chapter, eyebrow, note="", cls="", demo=None):
    hues = {"表达目标": (234, 286), "边做边懂": (190, 235), "自主学习": (262, 315), "移动续学": (160, 205)}
    h1, h2 = hues[chapter]
    pts = "".join(f'<div class="point"><div class="dot"></div><div><h3 class="pt-title">{a}</h3><p class="pt-desc">{b}</p></div></div>' for a,b in points)
    return f'''<section class="slide s-glow r-design {cls}" data-title="{esc(re.sub('<[^>]+>','',title))}" style="--glow-h:{h1};--glow-h2:{h2};--glow-sat:82%;--glow-light:38%;--glow-color-int:.40;--glow-white-int:.12;--glow-spread:37">
    <div class="glow"></div><div class="glow-white"></div><div class="chrome"><span>{eyebrow}</span><span>{chapter} · ASCEND STUDIO</span></div>
    <main class="inner"><div class="r-copy"><h1 class="h-title">{title}</h1><p class="body">{desc}</p><div class="points">{pts}</div></div><div class="r-visual">{visual}{demo_button(demo) if demo else ""}</div></main>
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
.r-design .inner{grid-template-columns:.55fr 1.65fr;gap:2vw;padding-top:1.5vh;padding-bottom:1.5vh}
.r-design .h-title{font-size:clamp(26px,2.65vw,46px);line-height:1.28;margin-bottom:2vh}
.r-design .body{margin-bottom:3vh}.r-design .points{gap:2.3vh}.r-design .pt-desc{font-size:var(--fs-body);line-height:1.6;color:rgba(255,255,255,.59)}
.r-design .pt-title{margin-bottom:.45vh}.r-visual{display:flex;align-items:center;justify-content:center;position:relative;height:100%}
.r-ui{position:relative;width:100%;margin:0;border:1px solid #ffffff30;border-radius:12px;background:#fff;box-shadow:0 28px 70px #0005;overflow:visible}
.r-ui>img{width:100%;height:auto;max-height:73vh;object-fit:contain;display:block;border-radius:11px}
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
.r-copy-journey>.slide-inner{position:relative;width:100%;height:100%;min-height:0;padding:3.2vh 3.1vw 4.2vh;display:flex;flex-direction:column}
.r-copy-journey .head{gap:1.4vw;margin-bottom:1vh;align-items:center}.r-copy-journey .head-l{min-width:0}
.r-copy-journey .head-l .ttl{font-size:var(--fs-h1);line-height:1.18}.r-copy-journey .subttl{line-height:1.35}
.r-journey-head-controls{display:flex;align-items:center;gap:.6vw;flex:0 0 auto}
.r-copy-journey .body-area{flex:1;min-height:0;margin:0;display:flex;flex-direction:column;justify-content:center;align-items:stretch;padding:0}
.r-copy-journey .collab-blueprint{height:71vh;grid-template-columns:12.6vw minmax(0,1fr);grid-template-rows:6vh 8.5vh 44vh 10vh;gap:.8vh .36vw}
.r-copy-journey .cb-row-label{padding-left:.18vw}.r-copy-journey .cb-human-label b{font-size:var(--fs-xs)}
.r-persona-row{display:grid;grid-template-columns:5.2vw minmax(0,1fr);gap:.28vw;align-items:start;padding:.18vh 0}
.r-persona-row+.r-persona-row{border-top:1px solid #dfe4ec;margin-top:.35vh;padding-top:.35vh}
.r-persona-row b{font-size:var(--fs-xs);line-height:1.12;color:#4e5e78;white-space:nowrap}
.r-persona-row span{font-size:var(--cb-copy-size);line-height:1.2;color:#536174}
.r-copy-journey .cb-human-label{grid-row:2}.r-copy-journey .cb-human-lane{grid-row:2}
.r-copy-journey .cb-painpoint-label{grid-row:4}.r-copy-journey .cb-painpoint-label small{font-size:var(--fs-xs)}
.r-copy-journey .cb-painpoint-rail{gap:.36vw}
.r-copy-journey .cb-painpoint-rail{grid-row:4}
.r-journey-breakpoint{appearance:none;width:100%;text-align:left;cursor:pointer;position:relative;padding:.55vh .58vw!important;display:flex;flex-direction:column;justify-content:center;gap:.35vh!important;border:1px solid #e8d5d8!important;border-radius:9px!important;background:linear-gradient(145deg,#fff9fa,#fff)!important;color:#4f4346!important;box-shadow:0 5px 14px #7b3b4c0b}
.r-journey-breakpoint:hover{border-color:#d795a1!important;transform:translateY(-1px);box-shadow:0 8px 18px #7b3b4c18}
.r-journey-breakpoint small{font-size:var(--fs-xs);font-weight:780;color:#9b5260;letter-spacing:.02em}
.r-journey-breakpoint span{font-size:var(--cb-copy-size);line-height:1.18;color:#5d5256}
.r-journey-breakpoint i{position:absolute;right:.48vw;top:.4vh;font-style:normal;font-size:var(--fs-sm);color:#a66b76}
.r-copy-journey [hidden]{display:none!important}
.r-sequence-role-label{grid-column:1;grid-row:3;position:relative;min-width:0;min-height:0;border-right:1px solid #dfe3eb}
.r-sequence-plot{grid-column:2;grid-row:3;min-width:0;min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(180deg,#fffdfd 0%,#fff 100%);border:1px solid #e1e5ec}
.r-sequence-plot svg{display:block;width:100%;height:100%;max-width:100%;max-height:100%;overflow:visible}
.r-sequence-role{--role-tone:#596b83;position:absolute;top:var(--lane-y);left:.08vw;right:.2vw;transform:translateY(-50%);display:grid;grid-template-columns:2.3vw minmax(0,1fr);align-items:center;gap:.35vw;min-height:4.4vh;padding:.25vh .3vw;border:1px solid color-mix(in srgb,var(--role-tone) 16%,#fff);border-radius:8px;background:color-mix(in srgb,var(--role-tone) 5%,#fff)}
.r-sequence-role[data-role="task"]{--role-tone:#4c82bd}.r-sequence-role[data-role="learn"]{--role-tone:#8770bf}.r-sequence-role[data-role="studio"]{--role-tone:#5b67bd}.r-sequence-role[data-role="agent"]{--role-tone:#348b83}.r-sequence-role[data-role="environment"]{--role-tone:#538a9b}.r-sequence-role[data-role="community"]{--role-tone:#668967}
.r-sequence-role .role-mark{display:grid;place-items:center;width:2vw;height:2vw;max-width:32px;max-height:32px;border-radius:50%;background:color-mix(in srgb,var(--role-tone) 13%,#fff);color:var(--role-tone)}
.r-sequence-role .role-mark svg{width:1.1vw;height:1.1vw;min-width:15px;min-height:15px;stroke-width:1.8}
.r-sequence-role img.role-mark{display:block;object-fit:cover;border:1px solid color-mix(in srgb,var(--role-tone) 18%,#fff)}
.r-sequence-role b{display:block;font-size:var(--fs-xs);line-height:1.1;color:#384453;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.r-sequence-role small{display:block;margin-top:.16vh;font-size:var(--fs-xs);line-height:1.08;color:#798493;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.r-sequence-credit{position:absolute;right:.55vw;bottom:.35vh;font-size:8.5px;line-height:1;color:#a2a8b2}
.r-bp-dialog,.r-live-demo{border:1px solid #ffffff;border-radius:18px;background:#f5f5f8;color:#242631;box-shadow:0 30px 100px #0005}
.r-bp-dialog{width:min(720px,88vw);max-width:none;max-height:84vh;margin:auto;padding:0;overflow:auto}
.r-bp-dialog::backdrop,.r-live-demo::backdrop{background:#080a13d9;backdrop-filter:blur(5px)}
.r-bp-dialog>header{display:flex;justify-content:space-between;align-items:center;gap:2vw;padding:2.4vh 2.2vw;border-bottom:1px solid #e0e1e8}
.r-bp-dialog>header small,.r-bp-index{font-size:var(--fs-sm);color:#777b89}.r-bp-dialog>header h1{margin-top:.5vh;font-size:var(--fs-h2);line-height:1.3}
.r-bp-close{border:1px solid #d7d8e0;border-radius:999px;background:#fff;padding:.55em 1em;color:#373a48;cursor:pointer}
.r-bp-tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.55vw;padding:1.4vh 2.2vw 0}
.r-bp-tabs button{min-height:38px;border:1px solid #e0e1e9;border-radius:8px;background:#fff;color:#606574;font-size:var(--fs-sm);cursor:pointer}
.r-bp-tabs button.active{background:#4c48ad;color:white;border-color:#4c48ad}
.r-bp-panels{padding:2.2vh 2.2vw 2.8vh}.r-bp-panel h2{font-size:var(--fs-h1);line-height:1.35;margin:.8vh 0 1.1vh}.r-bp-panel>p{font-size:var(--fs-body);line-height:1.75;color:#5d6371}
.r-bp-response{display:grid;gap:.5vh;margin-top:2vh;padding:1.5vh 1.2vw;border:1px solid #e5e3f7;border-radius:10px;background:#eeedfa}.r-bp-response small{font-size:var(--fs-sm);color:#706aa8}.r-bp-response strong{font-size:var(--fs-body);line-height:1.55;font-weight:600}
.r-bp-panel nav{display:flex;gap:.8vw;flex-wrap:wrap;margin-top:1.6vh}.r-bp-panel nav a{display:inline-flex;padding:.65em .9em;border:1px solid #d8d7ed;border-radius:999px;color:#4946a5;text-decoration:none;font-size:var(--fs-sm)}
.r-demo-launch{display:inline-flex;align-items:center;gap:.5em;border:1px solid #ffffff42;border-radius:999px;background:#171820;color:#fff;padding:.65em 1em;font-size:var(--fs-body);cursor:pointer;white-space:nowrap;box-shadow:0 8px 24px #0003}
.r-demo-launch:hover{background:#5149a2}.r-demo-launch span{color:#c3bbff}
.r-design .r-demo-launch{position:absolute;right:0;bottom:1vh;z-index:8}
.r-gray-demo{width:100%;height:100%;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:1.1vh;align-items:center}
.r-gray-demo-content{min-height:0;display:flex;align-items:center;justify-content:center}
.r-gray-demo>.r-demo-launch{justify-self:end;border-color:#d7d8e1;background:#292b35;font-size:var(--fs-sm)}
.r-live-demo{width:94vw;height:92vh;max-width:none;max-height:none;margin:auto;padding:0;overflow:hidden}
.r-live-demo[open]{display:flex;flex-direction:column}
.r-live-demo>header{height:54px;display:flex;align-items:center;justify-content:space-between;gap:1vw;padding:0 1.2vw;background:#fff;border-bottom:1px solid #e6e7eb}
.r-live-demo h1{font-size:var(--fs-h3);font-weight:600}.r-live-demo-actions{display:flex;align-items:center;gap:.7vw}.r-live-demo-actions a,.r-live-demo-actions button{border:1px solid #d8d9e0;border-radius:999px;padding:.45em .85em;background:#fff;color:#333642;text-decoration:none;font-size:var(--fs-sm);cursor:pointer}
.r-live-demo iframe{display:block;width:100%;height:calc(100% - 54px);border:0;background:#f8f8fa}
.r-modal{position:fixed;inset:0;z-index:1500;background:#08090eef;display:none;align-items:center;justify-content:center;padding:5vh 4vw}
.r-modal.open{display:flex}.r-modal img{max-width:100%;max-height:90vh;object-fit:contain}
.r-modal button{position:absolute;right:2vw;top:2vh;border:1px solid #ffffff55;border-radius:99px;background:#24252a;color:#fff;padding:.6em 1em;font-size:var(--fs-body);cursor:pointer}
.r-chips{display:flex;gap:.55vw;flex-wrap:wrap;margin-top:1.5vh}.r-chip{display:inline-flex;width:fit-content;align-self:flex-start;border:1px solid #d5d8e0;border-radius:99px;padding:.45vh .7vw;font-size:var(--fs-sm);color:#677080;background:#ffffff66}
.r-sequence{display:flex;gap:.8vw;align-items:center;margin-top:3vh;font-size:var(--fs-body)}
.r-sequence span{padding:1vh 1vw;border:1px solid #ffffff29;background:#ffffff0c;border-radius:8px}.r-sequence i{font-style:normal;color:#a5a2df}
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
.r-phone-showcase{height:78vh;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.7vh;position:relative}
.r-phone-switch{display:flex;gap:.3vw;padding:.35vh .4vw;border:1px solid #ffffff30;border-radius:999px;background:#11131dd9}
.r-phone-switch button{border:0;border-radius:999px;padding:.48vh .7vw;background:transparent;color:#aaaebe;font-size:var(--fs-sm);white-space:nowrap;cursor:pointer}
.r-phone-switch button[aria-pressed="true"]{background:#f1efff;color:#29273d;font-weight:720}
.r-phone-stage{position:relative;margin:0;width:min(28vw,410px);height:72vh;border:8px solid #25262d;border-radius:34px;background:#fff;overflow:hidden;box-shadow:0 24px 56px #0006}
.r-phone-stage>img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center;background:#f6f6f7}
.r-phone-stage .r-enlarge{right:9px;bottom:9px}
.r-phone-caption{position:absolute;left:10px;right:10px;bottom:9px;z-index:2;padding:.55vh .65vw;border-radius:9px;background:#15151cdb;color:#fff;font-size:var(--fs-xs);line-height:1.25;pointer-events:none}
.r-phone-assets{display:none}
.r-mobile-wide .inner{grid-template-columns:.5fr 1.7fr;gap:2vw}.r-mobile-wide .points{gap:2vh}
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
.r-contract{display:grid;grid-template-columns:1fr 1fr;gap:.65vh .7vw;margin:1vh 0 1.2vh}
.r-contract>div{display:grid;gap:.25vh;padding:.7vh .75vw;border:1px solid #e8e7ef;border-radius:8px;background:#faf9fc}
.r-contract small{font-size:var(--fs-xs);color:#858194}.r-contract strong{font-size:var(--fs-sm);line-height:1.35;font-weight:600;color:#4c4a5b}
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
.report button:focus-visible,.report a:focus-visible{outline:3px solid #b3a3ff;outline-offset:4px}
@media(max-width:1100px){.r-journey-user-ribbon{gap:.5vw;padding:.45vh .65vw}.r-journey-breakpoints{width:94vw;grid-template-columns:repeat(5,minmax(0,1fr))}.r-journey-breakpoints>span,.r-journey-breakpoints small{display:none}.r-journey-breakpoints button{font-size:var(--fs-xs)}}
@media(max-height:720px){.r-design .points{gap:1.5vh}.r-design .body{margin-bottom:2vh}.r-bp-dialog>header{padding:1.8vh 2vw}.r-bp-panels{padding:1.6vh 2vw 2vh}}
@media print{html,body{height:auto;overflow:visible;background:#fff}#deck{width:100%}.slide{height:210mm;width:297mm;break-after:page;page-break-after:always}#controls,#navDots,#toggle,#panel,.r-enlarge{display:none!important}@page{size:A4 landscape;margin:0}}
"""

CSS += r"""
/* Storyboard sequence: five illustrated handoffs replace the empty lifeline field. */
.r-copy-journey .collab-blueprint{height:70.4vh;grid-template-rows:6.5vh 9vh 42vh 10vh;gap:.65vh .36vw}
.r-copy-journey .cb-stage{grid-template-columns:minmax(0,1fr);padding:.42vh .58vw;background:color-mix(in srgb,var(--phase) 9%,#fff);border:1px solid color-mix(in srgb,var(--phase) 18%,#fff);border-radius:10px;box-shadow:0 5px 15px -13px rgba(36,50,79,.35)}
.r-copy-journey .cb-stage-copy{gap:.13vh}.r-copy-journey .cb-stage small{font:760 var(--fs-xs)/1.1 'JetBrains Mono';letter-spacing:.035em;color:color-mix(in srgb,var(--phase) 78%,#34415b)}
.r-copy-journey .cb-stage b{font-size:var(--fs-h3);line-height:1.04;color:#29364a;white-space:normal}
.r-copy-journey .cb-stage span{margin-top:.05vh;font-size:var(--fs-xs);line-height:1.08;color:#718096;white-space:normal}
.r-copy-journey .cb-stage-visual{display:none}
.r-copy-journey .cb-human-step{padding:.25vh .36vw;background:color-mix(in srgb,var(--phase) 4%,#fff);border:1px solid color-mix(in srgb,var(--phase) 12%,#fff);border-radius:9px}
.r-copy-journey .cb-lane-cell:not(:last-child)::after{right:-.48vw;width:.36vw;border-color:#9aa5b5}
.r-copy-journey .cb-lane-cell:not(:last-child)::before{right:-.51vw;border-left-color:#9aa5b5}
.r-copy-journey .cb-human-lane .r-persona-row{display:grid;grid-template-columns:clamp(22px,2.15vw,31px) minmax(0,1fr);gap:.32vw;align-items:center;padding:.14vh 0}
.r-copy-journey .cb-human-lane .r-persona-row+.r-persona-row{margin-top:.18vh;padding-top:.18vh;border-top:1px solid rgba(112,124,147,.12)}
.r-copy-journey .r-persona-avatar{width:clamp(22px,2.15vw,31px);height:clamp(22px,2.15vw,31px);display:block;overflow:hidden;border:1px solid rgba(111,125,151,.18);border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(34,50,76,.08)}
.r-copy-journey .r-persona-avatar img{display:block;width:100%;height:100%;object-fit:cover}
.r-copy-journey .r-persona-bubble{position:relative;min-width:0;padding:.38vh .4vw;border:1px solid rgba(105,122,154,.14);border-radius:8px 8px 8px 3px;background:rgba(255,255,255,.9);color:#4e5d73;font-size:var(--fs-xs);font-weight:580;line-height:1.14}
.r-copy-journey .r-persona-row[data-avatar-ref="task"] .r-persona-avatar{background:#eef5fb}
.r-copy-journey .r-persona-row[data-avatar-ref="learn"] .r-persona-avatar{background:#f4f0fb}
.r-story-role-rail{grid-column:1;grid-row:3;min-width:0;min-height:0;display:flex;flex-direction:column;justify-content:space-around;gap:.22vh;padding:.35vh .35vw .25vh .08vw;border-right:1px solid #dfe3eb}
.r-story-role-rail .r-sequence-role{position:static;transform:none;display:grid;grid-template-columns:clamp(22px,2.15vw,31px) minmax(0,1fr);align-items:center;gap:.32vw;min-height:0;padding:.34vh .32vw;border:0;border-radius:8px;background:transparent;box-shadow:none}
.r-story-role-rail .r-sequence-role[data-role="task"],.r-story-role-rail .r-sequence-role[data-role="learn"]{border:1px solid color-mix(in srgb,var(--role-tone) 16%,#fff);background:color-mix(in srgb,var(--role-tone) 5%,#fff)}
.r-story-role-rail .r-sequence-role[data-role="task"]{--role-tone:#4c82bd}.r-story-role-rail .r-sequence-role[data-role="learn"]{--role-tone:#8770bf}
.r-story-role-rail .r-sequence-role .role-mark{display:grid;place-items:center;width:clamp(20px,1.85vw,27px);height:clamp(20px,1.85vw,27px);max-width:none;max-height:none;border-radius:50%;background:transparent;color:#5d6b83}
.r-story-role-rail .r-sequence-role[data-role="task"] .role-mark,.r-story-role-rail .r-sequence-role[data-role="learn"] .role-mark{width:clamp(22px,2.15vw,31px);height:clamp(22px,2.15vw,31px);border:1px solid rgba(111,125,151,.16);background:#fff}
.r-story-role-rail .r-sequence-role .role-mark svg{display:block;width:clamp(16px,1.3vw,20px);height:clamp(16px,1.3vw,20px);min-width:0;min-height:0;stroke-width:1.7}
.r-story-role-rail .r-sequence-role img.role-mark{object-fit:cover}
.r-story-role-rail .r-sequence-role b{font-size:var(--fs-xs);line-height:1.15;color:#384453;white-space:normal}
.r-story-role-rail .r-sequence-role small{margin-top:.1vh;font-size:var(--fs-xs);line-height:1.12;color:#798493;white-space:normal}
.r-story-scenes{grid-column:2;grid-row:3;min-width:0;min-height:0;overflow:visible;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));align-items:stretch;gap:.36vw;border:0;background:transparent}
.r-story-scene{--scene:#6275bd;position:relative;min-width:0;min-height:0;display:grid;grid-template-rows:4.3vh minmax(0,1fr) 3.5vh;gap:.2vh;padding:.46vh .36vw .38vh;overflow:visible;border:1px solid color-mix(in srgb,var(--scene) 19%,#fff);border-radius:12px;background:linear-gradient(180deg,color-mix(in srgb,var(--scene) 7%,#fff),#fff 82%);box-shadow:0 7px 18px -15px rgba(30,45,74,.25)}
.r-story-scene.is-source{--scene:#4c82bd}.r-story-scene.is-action{--scene:#8770bf}.r-story-scene.is-generate{--scene:#dc8055}.r-story-scene.is-control{--scene:#258e98}.r-story-scene.is-evidence{--scene:#438b69}
.r-story-scene:not(:last-child)::after{content:"";position:absolute;z-index:3;top:50%;right:-.48vw;width:.43vw;border-top:1.5px solid #8e99aa}
.r-story-scene:not(:last-child)::before{content:"";position:absolute;z-index:4;top:calc(50% - 3px);right:-.52vw;border-left:5px solid #8e99aa;border-top:3px solid transparent;border-bottom:3px solid transparent}
.r-story-scene-head{display:flex;align-items:center;gap:.35vw;min-width:0;padding:0 .12vw}
.r-story-scene-head img{display:block;width:clamp(28px,2.8vw,42px);height:100%;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(30,44,69,.12))}
.r-story-scene-head span{min-width:0;font-size:var(--fs-xs);line-height:1.1;color:#667386}
.r-story-flow{display:flex;align-items:center;justify-content:center;min-width:0;min-height:0;overflow:hidden;border-radius:8px;background:rgba(255,255,255,.56)}
.r-story-flow{position:relative;display:block}
.r-story-flow>svg{position:absolute;inset:0;z-index:1;display:block;width:100%;height:100%;max-width:none;max-height:none;overflow:visible}
.r-story-flow>svg .edge{stroke:#8492a7!important;stroke-width:1.6!important;vector-effect:non-scaling-stroke}
.r-story-node{--node-accent:var(--scene);position:absolute;z-index:2;left:var(--node-x);top:var(--node-y);transform:translate(-50%,-50%);width:max(var(--node-w),clamp(66px,5vw,96px));height:max(var(--node-h),clamp(38px,5.2vh,52px));min-width:0;min-height:0;padding:.42vh .42vw;display:flex;flex-direction:column;justify-content:center;gap:.24vh;overflow:hidden;border:1px solid color-mix(in srgb,var(--node-accent) 27%,#dce2ec);border-radius:10px;background:linear-gradient(145deg,#fff,#fbfcff);box-shadow:0 6px 14px -11px rgba(30,45,74,.4)}
.r-story-node-head{display:flex;align-items:center;gap:.28vw;min-width:0}
.r-story-node-head i{display:grid;place-items:center;flex:0 0 auto;width:clamp(17px,1.4vw,22px);height:clamp(17px,1.4vw,22px);color:var(--node-accent)}
.r-story-node-head i svg{display:block;width:100%;height:100%;stroke-width:1.8}
.r-story-node-head b{min-width:0;overflow:hidden;color:#344157;font-size:clamp(9.5px,.72vw,12px);font-weight:750;line-height:1.08;text-overflow:ellipsis;white-space:nowrap}
.r-story-node-head em{margin-left:auto;flex:0 0 auto;padding:.15vh .23vw;border-radius:999px;background:color-mix(in srgb,var(--node-accent) 11%,#fff);color:color-mix(in srgb,var(--node-accent) 78%,#30394a);font-size:clamp(8px,.56vw,9.5px);font-style:normal;font-weight:720;line-height:1.15}
.r-story-node p{margin:0;color:#667386;font-size:clamp(8.5px,.61vw,10.5px);line-height:1.15}
.r-story-node .r-node-tags{display:flex;align-items:center;gap:.18vw;min-width:0;overflow:hidden}
.r-story-node .r-node-tags span{padding:.13vh .22vw;border-radius:4px;background:#f0f2f6;color:#646d7b;font-size:clamp(7.5px,.5vw,8.5px);line-height:1.1;white-space:nowrap}
.r-story-node.kind-studio{--node-accent:#6664ba;background:linear-gradient(145deg,#f4f3ff,#fff);border-color:#c8c7ef}
.r-story-node.kind-agent{--node-accent:#399288;background:linear-gradient(145deg,#effaf8,#fff);border-color:#b9dfd9}
.r-story-node.kind-task{--node-accent:#4c82bd;background:linear-gradient(145deg,#eff5ff,#fff)}
.r-story-node.kind-learn{--node-accent:#8770bf;background:linear-gradient(145deg,#f5f1ff,#fff)}
.r-story-node.kind-output{--node-accent:#71809a}
.r-story-node.kind-source{--node-accent:#538f99}
.r-story-node.kind-error{--node-accent:#d16d62;background:linear-gradient(145deg,#fff2ef,#fff);border-color:#edc7c0}
.r-story-node.kind-success{--node-accent:#4b9a78;background:linear-gradient(145deg,#eef9f2,#fff);border-color:#c5e4d1}
.r-story-node.kind-community{--node-accent:#548b68;background:linear-gradient(145deg,#eff8f0,#fff);border-color:#c7dfcb}
.r-story-node.kind-compact{padding:.34vh .32vw;border-radius:9px}
.r-story-node.kind-compact .r-story-node-head{gap:.2vw}.r-story-node.kind-compact .r-story-node-head i{width:clamp(14px,1.1vw,18px);height:clamp(14px,1.1vw,18px)}
.r-story-node.kind-compact .r-story-node-head b{font-size:clamp(8.5px,.64vw,10.5px)}
.r-story-node.kind-compact p{font-size:clamp(7.5px,.52vw,9px)}
.r-story-handoff{display:flex;align-items:center;gap:.25vw;min-width:0;padding:.2vh .28vw;border-radius:7px;background:color-mix(in srgb,var(--scene) 8%,#fff)}
.r-story-handoff small{flex:0 0 auto;font-size:var(--fs-xs);font-weight:700;color:color-mix(in srgb,var(--scene) 76%,#354052)}
.r-story-handoff span{min-width:0;font-size:var(--fs-xs);line-height:1.08;color:#586477}
.r-story-credit{position:absolute;right:.25vw;bottom:.14vh;font-size:7.5px;color:#a1a8b3}
.r-copy-journey .cb-painpoint-node{padding:.45vh .52vw!important;gap:.3vh!important;border-radius:9px!important}
.r-copy-journey .cb-painpoint-node small{font-size:var(--fs-xs)}.r-copy-journey .cb-painpoint-node span{font-size:var(--fs-xs);line-height:1.15}
"""

breakpoints = [
    {"label":"表达目标", "title":"先发现问题、再组织 Prompt，本身就是一道门槛", "body":"任务导向用户要从现场提炼目标；学习导向用户可能先有兴趣或疑问。两者都可能是新手或有经验者，专业程度决定引导深度。", "response":"把推荐理由和相关线索摆出来，让用户从可判断的起点开始。", "targets":[("主动建议",3),("线索串联",4)]},
    {"label":"学习起步", "title":"学习目标可以模糊，也可以明确", "body":"“我想系统入门昇腾”与“我想掌握某项能力”都是学习诉求：前者需要先探索方向，后者可以直接组织路径。它们是同一类学习用户的不同状态。", "response":"按意图生成路径，并允许用户补充目标、调整顺序和自定义节点。", "targets":[("意图路径",7),("共创调整",8)]},
    {"label":"边做边懂", "title":"任务完成，不等于开发者已经理解", "body":"用户可能照着建议修好代码，却仍不清楚参数为什么要这样变化；如果解释离开当前错误，理解也难迁移到相似问题。", "response":"让错误现场、图解、参数和代码联动，再用操作后的结果检查理解。", "targets":[("开发中图解",5)]},
    {"label":"经验回流", "title":"答案留在私人对话，社区难以复用", "body":"问题、尝试和修复过程随 AI 对话结束而分散。学习者自己的解释也可能只留在笔记里，难以再次找回。", "response":"调试后形成可审阅的社区草稿；个人笔记、图解和代码则整理为认知卡。", "targets":[("经验回流",6),("个人认知卡",9)]},
    {"label":"移动续学", "title":"离开电脑后，疑问和学习线索容易中断", "body":"开发现场产生的关注和疑问未必能在电脑旁继续处理；零散资讯也难接回正在做的事。", "response":"以轻量通知和知识卡承接兴趣与存疑，并把学习小结带回电脑继续实践。", "targets":[("小程序续学",11),("兴趣与疑问信号",12)]},
]
bp_buttons = "".join(
    f'<button type="button" data-bp-open="{i}" aria-label="查看断点 {i+1}：{esc(item["label"])}">'
    f'<span>{i+1:02}</span>{esc(item["label"])}</button>'
    for i,item in enumerate(breakpoints)
)
source_journey, SOURCE_JOURNEY_CSS = copy_editable_journey_markup_and_css()

SEQUENCE_ROLES = [
    ("T", "task", "任务导向开发者", "带任务推进交付", None),
    ("L", "learn", "学习导向开发者", "从兴趣或目标起步", None),
    ("S", "studio", "Ascend Studio", "承接任务与学习上下文", "layout-dashboard"),
    ("A", "agent", "智能体", "检索、解释并行动", "bot"),
    ("E", "environment", "开发环境", "运行并返回结果", "terminal"),
    ("K", "community", "知识与社区", "提供依据、接收经验", "book-open"),
]

def sequence_diagram_markup():
    source = HERE / "journey-sequence.mmd"
    raw_path = HERE / "journey-sequence.svg"
    renderer = HERE / "render_journey_sequence.mjs"
    if not raw_path.exists() or raw_path.stat().st_mtime < max(source.stat().st_mtime, renderer.stat().st_mtime):
        subprocess.run(["npm", "run", "render:journey-sequence", "--prefix", str(HERE)], check=True)

    svg_ns = "http://www.w3.org/2000/svg"
    ET.register_namespace("", svg_ns)
    root = ET.parse(raw_path).getroot()
    old_viewbox = [float(x) for x in root.get("viewBox", "0 0 0 0").split()]
    width, height = old_viewbox[2], old_viewbox[3]
    root_style = root.get("style", "")
    actor_positions = {}
    for actor in root.findall(f"{{{svg_ns}}}g"):
        if actor.get("class") != "actor":
            continue
        actor_id = actor.get("data-id")
        rect = actor.find(f"{{{svg_ns}}}rect")
        label = actor.find(f"{{{svg_ns}}}text")
        if not actor_id or (rect is None and label is None):
            continue
        if rect is not None:
            top = float(rect.get("y", "0"))
            center = float(rect.get("x", "0")) + float(rect.get("width", "0")) / 2
        else:
            top = float(label.get("y", "0")) - 20
            center = float(label.get("x", "0"))
        if actor_id not in actor_positions or top < actor_positions[actor_id][0]:
            actor_positions[actor_id] = (top, center)

    style_nodes, defs_nodes = [], []
    geometry = []
    for child in list(root):
        if child.tag == f"{{{svg_ns}}}style":
            style_nodes.append(child)
        elif child.tag == f"{{{svg_ns}}}defs":
            defs_nodes.append(child)
        elif child.get("class") != "actor":
            geometry.append(child)

    color_vars = {
        "var(--_arrow)": "#6563b7",
        "var(--_group-hdr)": "#f6f7f9",
        "var(--_inner-stroke)": "#e7e9ec",
        "var(--_node-fill)": "#f7f8fb",
        "var(--_node-stroke)": "#d9dee7",
        "var(--_text)": "#354052",
        "var(--_text-muted)": "#455267",
        "var(--_text-sec)": "#657184",
        "var(--bg)": "#ffffff",
        "var(--_line)": "#718096",
    }
    for node in root.iter():
        for attr in ("fill", "stroke"):
            value = node.get(attr)
            if value in color_vars:
                node.set(attr, color_vars[value])
        if node.tag.rsplit("}", 1)[-1] in ("line", "polyline"):
            try:
                stroke_width = float(node.get("stroke-width", "0"))
            except ValueError:
                stroke_width = 0
            if 0 < stroke_width < 1.4:
                node.set("stroke-width", "1.4")

    for style in style_nodes:
        style.text = re.sub(r"@import[^;]+;\s*", "", style.text or "")
        style.text = re.sub(
            r"text\s*\{[^}]*\}",
            "text { font-family: 'HarmonyOS Sans SC','Noto Sans SC',sans-serif; }",
            style.text,
            count=1,
        )

    for block in [node for node in geometry if node.get("class") == "block" and node.get("data-type") == "rect"]:
        rects = block.findall(f"{{{svg_ns}}}rect")
        if rects:
            rects[0].set("fill", "#f8f9fc")
            rects[0].set("stroke", "#dce2eb")
            rects[0].set("stroke-width", "1.2")
        if len(rects) > 1:
            block.remove(rects[1])
        for parent in block.iter():
            for child in list(parent):
                if child.tag == f"{{{svg_ns}}}text":
                    parent.remove(child)

    rotated = ET.Element(f"{{{svg_ns}}}g", {"transform": f"translate(0 {width:g}) rotate(-90)"})
    for node in geometry:
        for label in node.iter(f"{{{svg_ns}}}text"):
            x = float((label.get("x") or "0").split()[0])
            y = float((label.get("y") or "0").split()[0])
            previous = label.get("transform", "")
            label.set("transform", (previous + " " if previous else "") + f"rotate(90 {x:g} {y:g})")
        rotated.append(node)

    root.clear()
    root.set("viewBox", f"0 0 {height:g} {width:g}")
    root.set("width", f"{height:g}")
    root.set("height", f"{width:g}")
    if root_style:
        root.set("style", root_style)
    root.set("role", "img")
    root.set("aria-label", "由 beautiful-mermaid 生成并旋转为横向时间推进的角色时序图")
    root.set("preserveAspectRatio", "xMidYMid meet")
    for node in style_nodes + defs_nodes + [rotated]:
        root.append(node)
    diagram = ET.tostring(root, encoding="unicode")

    role_rows = []
    avatars = {"T": svg_data("persona-task.svg"), "L": svg_data("persona-learning.svg")}
    for actor_id, role, name, desc, icon in SEQUENCE_ROLES:
        _actor_top, center_x = actor_positions[actor_id]
        lane_y = width - center_x
        lane_pct = max(0, min(100, lane_y / width * 100))
        mark = (f'<img class="role-mark" src="{avatars[actor_id]}" alt="">' if actor_id in avatars else
                f'<span class="role-mark"><i data-lucide="{icon}" aria-hidden="true"></i></span>')
        role_rows.append(
            f'<div class="r-sequence-role" data-role="{role}" style="--lane-y:{lane_pct:.4f}%" '
            f'aria-label="{esc(name)}：{esc(desc)}">{mark}<span><b>{esc(name)}</b><small>{esc(desc)}</small></span></div>'
        )

    return (
        '<div class="r-sequence-role-label" aria-label="时序图参与角色">' + "".join(role_rows) + '</div>'
        '<div class="r-sequence-plot" aria-label="时间从左向右；箭头表示角色间消息与结果回传">'
        + diagram
        + '<small class="r-sequence-credit">图表：beautiful-mermaid · MIT；人物插图：DiceBear Personas · CC BY 4.0</small></div>'
    )

JOURNEY_STAGES = [
    ("01 · 起点", "认知起步", "任务现场或成长目标", "source", "need-context.png", "目标、现场与验收点"),
    ("02 · 寻源", "找依据与方向", "资料来源和学习目标", "action", "search-fetch.png", "来源、版本与适用范围"),
    ("03 · 明确", "形成可行动路径", "Prompt 与学习路径", "generate", "generate.png", "可编辑 Prompt / 学习路径"),
    ("04 · 实践", "边做边理解", "运行、解释与核验", "control", "decide.png", "错误图解 / 成功验证"),
    ("05 · 应用", "带着收获继续", "复习、记录与回流", "evidence", "execute.png", "社区草稿 / 个人知识卡"),
]

STORY_NODE_CONTENTS = {
    "01": {
        "task": ("kind-task kind-compact", "clipboard-list", "任务现场", "问题 / 目标 / 环境", ""),
        "learn": ("kind-learn kind-compact", "compass", "学习目标", "入门方向 / 专项能力", ""),
        "studio": ("kind-studio", "layout-dashboard", "Ascend Studio", "提炼目标与关键条件", "共创"),
        "context": ("kind-output", "list-checks", "任务卡", "目标 · 环境 · 验收点", "已整理"),
    },
    "02": {
        "need": ("kind-learn kind-compact", "search", "线索与目标", "现场 / 兴趣 / 版本", ""),
        "agent": ("kind-agent", "bot", "智能体", "检索、筛选并标出来源", "取回"),
        "official": ("kind-source kind-compact", "file-text", "官方文档", "接口与版本说明", "v8.0"),
        "practice": ("kind-source kind-compact", "book-open-check", "最佳实践", "可复用步骤", "v2.1"),
        "community": ("kind-community kind-compact", "users-round", "社区经验", "真实问题与解法", "v1.3"),
        "scope": ("kind-output", "badge-check", "适用性核对", "依据 · 版本 · 适用范围", "可判断"),
    },
    "03": {
        "intent": ("kind-task kind-compact", "messages-square", "任务线索 / 学习目标", "用户补写自己的条件", ""),
        "studio": ("kind-studio", "workflow", "Studio 与用户一起梳理", "问题、范围与下一步", "共创"),
        "prompt": ("kind-output", "send", "可编辑 Prompt", "", ""),
        "path": ("kind-learn", "route", "协同学习路径", "", ""),
    },
    "04": {
        "plan": ("kind-task kind-compact", "code-xml", "代码 / 学习节点", "明确当前要验证的内容", ""),
        "env": ("kind-agent", "terminal", "开发环境", "运行 / 练习 / 返回现场", "RUN"),
        "result": ("kind-output kind-compact", "circle-help", "运行结果", "错误或通过", ""),
        "explain": ("kind-error", "network", "错误图解", "日志 × 参数 × 原因", "定位"),
        "mastery": ("kind-success", "circle-check", "验证通过", "结果与原理检查", "通过"),
        "retry": ("kind-error kind-compact", "rotate-ccw", "调整后再验证", "保留本次运行证据", ""),
    },
    "05": {
        "task": ("kind-task kind-compact", "code-2", "任务实践", "整理真实现场", ""),
        "learn": ("kind-learn kind-compact", "graduation-cap", "学习实践", "补上个人理解", ""),
        "draft": ("kind-output", "file-pen-line", "社区经验草稿", "环境 · 问题 · 修复", "待审阅"),
        "card": ("kind-output", "notebook-pen", "个人知识卡", "笔记 · 图解 · 代码", "自用"),
        "knowledge": ("kind-community", "library", "知识与社区", "经验可检索、可复用", "回流"),
        "next": ("kind-community kind-compact", "move-right", "下一次任务 / 学习", "从积累继续", ""),
    },
}

STORY_NODE_TAGS = {
    ("01", "context"): ("目标", "环境", "验收点"),
    ("03", "prompt"): ("范围", "约束", "步骤"),
    ("03", "path"): ("节点", "顺序", "验证"),
    ("04", "env"): ("构建", "运行", "练习"),
    ("04", "mastery"): ("结果", "理解", "复用"),
    ("05", "draft"): ("来源", "版本", "修复"),
    ("05", "card"): ("笔记", "图解", "代码"),
}

def story_node_html(scene_id, node_id, x, y, width, height):
    kind, icon, title, detail, badge = STORY_NODE_CONTENTS[scene_id][node_id]
    badge_html = f'<em>{esc(badge)}</em>' if badge else ""
    detail_html = f'<p>{esc(detail)}</p>' if detail else ""
    tags = STORY_NODE_TAGS.get((scene_id, node_id), ())
    tags_html = '<div class="r-node-tags">' + "".join(f'<span>{esc(tag)}</span>' for tag in tags) + '</div>' if tags else ""
    style = f"--node-x:{x:.4f}%;--node-y:{y:.4f}%;--node-w:{width:.4f}%;--node-h:{height:.4f}%"
    return (
        f'<div class="r-story-node {kind}" data-node="{esc(node_id)}" style="{style}">'
        f'<div class="r-story-node-head"><i data-lucide="{esc(icon)}" aria-hidden="true"></i><b>{esc(title)}</b>{badge_html}</div>'
        f'{detail_html}{tags_html}</div>'
    )

def journey_scene_markup():
    specs_path = HERE / "journey-scenes.json"
    renderer = HERE / "render_journey_sequence.mjs"
    scenes = json.loads(specs_path.read_text())
    newest_input = max(specs_path.stat().st_mtime, renderer.stat().st_mtime)
    expected = [HERE / f"journey-scene-{scene['id']}.svg" for scene in scenes]
    if any(not p.exists() or p.stat().st_mtime < newest_input for p in expected):
        subprocess.run(["npm", "run", "render:journey-sequence", "--prefix", str(HERE)], check=True)

    avatars = {"T": svg_data("persona-task.svg"), "L": svg_data("persona-learning.svg")}
    role_rows = []
    for actor_id, role, name, desc, icon in SEQUENCE_ROLES:
        mark = (f'<img class="role-mark" src="{avatars[actor_id]}" alt="">' if actor_id in avatars else
                f'<span class="role-mark"><i data-lucide="{icon}" aria-hidden="true"></i></span>')
        role_rows.append(
            f'<div class="r-sequence-role" data-role="{role}" aria-label="{esc(name)}：{esc(desc)}">'
            f'{mark}<span><b>{esc(name)}</b><small>{esc(desc)}</small></span></div>'
        )

    ET.register_namespace("", "http://www.w3.org/2000/svg")
    svg_ns = "http://www.w3.org/2000/svg"
    stage_scenes = []
    for scene, stage in zip(scenes, JOURNEY_STAGES):
        _, _, _, phase, image_name, handoff = stage
        svg_root = ET.parse(HERE / f"journey-scene-{scene['id']}.svg").getroot()
        view = [float(value) for value in svg_root.get("viewBox", "0 0 0 0").split()]
        view_x, view_y, view_width, view_height = view
        nodes = []
        for child in list(svg_root):
            node_id = child.get("data-id") if child.tag.rsplit("}", 1)[-1] == "g" else None
            if node_id:
                rect = child.find(f"{{{svg_ns}}}rect")
                if rect is not None:
                    x, y = float(rect.get("x", 0)), float(rect.get("y", 0))
                    width, height = float(rect.get("width", 0)), float(rect.get("height", 0))
                else:
                    shape = child.find(f"{{{svg_ns}}}polygon")
                    points = re.findall(r"[-+]?\d*\.?\d+", shape.get("points", "")) if shape is not None else []
                    coords = [float(value) for value in points]
                    xs, ys = coords[0::2], coords[1::2]
                    x, y = min(xs), min(ys)
                    width, height = max(xs) - x, max(ys) - y
                nodes.append(story_node_html(
                    scene["id"], node_id,
                    ((x + width / 2 - view_x) / view_width) * 100,
                    ((y + height / 2 - view_y) / view_height) * 100,
                    (width / view_width) * 100,
                    (height / view_height) * 100,
                ))
                svg_root.remove(child)
            elif child.get("class") == "edge-label":
                svg_root.remove(child)
        svg_root.set("class", "r-story-flow-svg")
        svg_root.set("role", "img")
        svg_root.set("aria-label", scene["label"] + "；连线由 beautiful-mermaid 布局")
        svg_root.set("preserveAspectRatio", "none")
        svg_root.set("width", "100%")
        svg_root.set("height", "100%")
        for style_node in svg_root.findall(f"{{{svg_ns}}}style"):
            style_node.text = re.sub(r"@import[^;]+;\s*", "", style_node.text or "")
        diagram = ET.tostring(svg_root, encoding="unicode")
        image_path = ROOT / "cann-dashboard/assets/agent-stage-3d" / image_name
        art = "data:image/png;base64," + base64.b64encode(image_path.read_bytes()).decode()
        stage_scenes.append(
            f'<article class="r-story-scene is-{phase}" aria-label="{esc(scene["label"])}">'
            f'<header class="r-story-scene-head"><img src="{art}" alt=""><span>{esc(scene["label"])}</span></header>'
            f'<div class="r-story-flow">{diagram}{"".join(nodes)}</div>'
            f'<div class="r-story-handoff"><small>交接</small><span>{esc(handoff)}</span></div></article>'
        )
    credit = '<small class="r-story-credit">流程：beautiful-mermaid · MIT　图标：Lucide · ISC　人物：DiceBear Personas · CC BY 4.0</small>'
    return (
        '<div class="r-story-role-rail" aria-label="参与角色">' + "".join(role_rows) + '</div>'
        '<div class="r-story-scenes" aria-label="按时间从左到右推进的五段角色交接场景">'
        + "".join(stage_scenes) + credit + '</div>'
    )

def build_journey():
    section = source_journey
    section = section.replace('class="slide s-gray task-rel-page"', 'class="slide s-gray task-rel-page r-copy-journey"', 1)
    section = re.sub(r'<div class="collab-blueprint"[^>]*>',
        '<div class="collab-blueprint" role="group" aria-label="任务导向与学习导向共用的五阶段旅程；角色交接形成场景图解，底部对应五个设计断点">', section, count=1)
    section = section.replace('<div class="cb-axis"><small>STAGE</small><b>阶段</b></div>',
        '<div class="cb-axis"><small>TIME</small><b>旅程 →</b></div>', 1)
    section = section.replace('data-title="AI协作开发者旅程图"', 'data-title="用户旅程：任务交付与目标学习"', 1)
    section = section.replace('<div class="ttl">AI协作开发者旅程图</div>', '<div class="ttl">任务交付与目标学习，共用一条协作旅程</div>', 1)
    section = section.replace('以 AddCustom 开发为例，呈现各阶段的人机行为与关键痛点', '任务导向与学习导向是两种进入起点；经验程度影响引导深度，不定义用户类型', 1)
    section = section.replace('<div class="section-tabs"></div>',
        '<div class="r-journey-head-controls">' + tabs("用户旅程") + '</div>', 1)
    section = section.replace('<div class="body-area"', '<div class="body-area r-journey-body"', 1)
    section = re.sub(r'(<div class="body-area r-journey-body" aria-label=")[^"]*(")',
        r'\1从任务现场或学习目标进入，经过寻源、路径明确、实践核验，最终把经验带入下一次任务与学习\2', section, count=1)
    section = section.replace('<div class="cb-row-label cb-human-label"><small>DEVELOPER</small><b>开发者</b></div>',
        '<div class="cb-row-label cb-human-label"><small>ENTRY POINTS</small><b>两种起点</b></div>', 1)

    stage_html = []
    for kicker, title, desc, phase, _image, _handoff in JOURNEY_STAGES:
        stage_html.append(
            f'<div class="cb-stage is-{phase}"><div class="cb-stage-copy">'
            f'<small>{esc(kicker)}</small><b>{esc(title)}</b><span>{esc(desc)}</span></div></div>'
        )
    section = replace_div_content(section, "cb-stage-rail", "".join(stage_html))

    human_actions = [
        ("我有一个具体开发问题", "我想入门，或掌握一项能力"),
        ("需要确认资料与版本", "想找到适合自己的学习目标"),
        ("把现场线索变成可执行目标", "帮我把目标整理成学习路径"),
        ("边运行边定位错误", "按路径实践并检查理解"),
        ("整理可复用的开发经验", "把笔记带进下一次实践"),
    ]
    human_lanes = '<div class="cb-lane cb-human-lane" aria-label="两种开发者在五个阶段的表达">'
    for (task, learn), stage in zip(human_actions, JOURNEY_STAGES):
        phase = stage[3]
        bubbles = []
        for role, text in (("task", task), ("learn", learn)):
            bubbles.append(
                f'<div class="r-persona-row" data-avatar-ref="{role}">'
                f'<span class="r-persona-avatar" data-avatar-ref="{role}"></span>'
                f'<span class="r-persona-bubble">{esc(text)}</span></div>'
            )
        human_lanes += f'<article class="cb-lane-cell cb-human-step is-{phase}">{"".join(bubbles)}</article>'
    human_lanes += '</div>'
    section = replace_div_content(section, "cb-human-lane", "".join(human_lanes))

    section = section.replace('<div class="cb-row-label cb-painpoint-label"><small>PAIN POINT</small><b>痛点</b></div>',
        '<div class="cb-row-label cb-painpoint-label"><small>DESIGN BREAKS</small><b>设计断点</b></div>', 1)
    breakpoint_summaries = [
        "先提炼现场问题，再组织 Prompt",
        "找到可靠依据，也找到学习方向",
        "任务目标和学习目标都能形成路径",
        "任务完成后，理解仍需要支持",
        "私人经验要能回到社区与下次实践",
    ]
    breakpoint_nodes = "".join(
        f'<button type="button" class="cb-painpoint-node r-journey-breakpoint" data-bp-open="{i}" aria-label="查看断点 {i+1}：{esc(item["label"])}">'
        f'<small>{i+1:02} · {esc(item["label"])}</small><span>{esc(breakpoint_summaries[i])}</span><i aria-hidden="true">↗</i></button>'
        for i, item in enumerate(breakpoints)
    )
    section = replace_div_content(section, "cb-painpoint-rail", breakpoint_nodes)
    section = re.sub(r'aria-label="按 Need、Search、Generate、Decide、Execute 阶段归组[^\"]*"',
        'aria-label="五个旅程断点，可点击查看问题与对应设计响应"', section, count=1)

    middle_start = section.index('<div class="cb-row-label cb-handoff-label">')
    middle_end = section.index('<div class="cb-row-label cb-painpoint-label">', middle_start)
    section = section[:middle_start] + journey_scene_markup() + section[middle_end:]
    return section

journey = build_journey()

def bp_target_links(targets):
    return "".join(f'<a href="#{page}">{esc(label)} ↗</a>' for label,page in targets)

bp_sections = "".join(
    f'<section class="r-bp-panel" data-bp-panel="{i}" {"" if i == 0 else "hidden"}>'
    f'<span class="r-bp-index">断点 {i+1:02} / 05 · {esc(item["label"])}</span>'
    f'<h2>{esc(item["title"])}</h2><p>{esc(item["body"])}</p>'
    f'<div class="r-bp-response"><small>设计回应</small><strong>{esc(item["response"])}</strong></div>'
    f'<nav aria-label="查看相关设计">{bp_target_links(item["targets"])}</nav>'
    f'</section>'
    for i,item in enumerate(breakpoints)
)
bp_tabs = "".join(
    f'<button type="button" data-bp-tab="{i}" class="{"active" if i == 0 else ""}">{i+1:02} {esc(item["label"])}</button>'
    for i,item in enumerate(breakpoints)
)
breakpoint_dialog = f'''<dialog class="r-bp-dialog" aria-labelledby="r-bp-dialog-title">
  <header><div><small>用户旅程 · 问题到设计回应</small><h1 id="r-bp-dialog-title">同一条旅程上的五个断点</h1></div><button type="button" class="r-bp-close" aria-label="关闭断点详情">关闭</button></header>
  <nav class="r-bp-tabs" aria-label="选择旅程断点">{bp_tabs}</nav>
  <div class="r-bp-panels">{bp_sections}</div>
</dialog>'''

slides=[]
logo="data:image/svg+xml;base64,"+base64.b64encode((ROOT/"ascstudio/assets/ascend-logo.svg").read_bytes()).decode()
slides.append(f'''<section class="slide s-cover r-cover" data-title="让任务推进，也让能力成长"><img class="r-cover-image" src="{asset('04-connected-prompt.jpg')}" alt=""><div class="r-cover-content"><img class="r-cover-logo" src="{logo}" alt="Ascend"><div class="r-cover-kicker">ASCEND STUDIO · EXPERIENCE DESIGN</div><h1>让任务推进<br><span>也让能力成长</span></h1><p class="r-cover-lead">从一次表达，到理解、实践与经验回流<br>电脑端 · 小程序 · 知识供给</p></div><div class="r-cover-bottom"><span>基于现有交互原型的设计提案</span><span>2026.10</span></div></section>''')
slides.append(journey)

slides.append(dark("从空白输入<br>到有依据的起点","P1 · Prompt 的质量依赖用户先发现问题、回忆现场，再组织成语言。<b>把可讨论的线索主动摆出来。</b>",[
("看见建议从哪里来","历史问题与具体片段形成推荐依据。"),
("从建议进入行动","选择学习、先讨论，或暂不处理。"),
("保留用户的判断","推荐作为候选方向，用户决定下一步。")
],shot("03-proactive-card.jpg","现有 Demo · 展开推荐卡，查看近期记录、推荐理由与下一步。",badge(1,36,32)+badge(2,39,70)),"表达目标","01.1 · PROACTIVE START",note="推荐记录为策划示例；设计重点是建议如何被理解与选择。",demo="desktop"))
slides.append(dark("把线索连起来<br>把想法说完整","P1 · 用户可能知道几个关键词，却还没形成完整需求。<b>通过关系选择，逐步组织目标、条件与验证方式。</b>",[
("连接可见的线索","从现象出发，连到关注点与约束。"),
("Prompt 同步成形","每次选择都能在文字中核对。"),
("修改后明确发送","用户可以补写、删改，再决定启动。")
],shot("04-connected-prompt.jpg","现有 Demo · 训练与调优探索画布及其底部可编辑 Prompt。",badge(1,53,50)+badge(2,72,89)),"表达目标","01.2 · CONNECT TO PROMPT",note="原型展示可移动线索与可编辑 Prompt；点击“打开电脑端 Demo”继续操作。",demo="desktop"))

slides.append(dark("错误发生时<br>把原理放回现场","P3 · 修改成功并不意味着理解发生。<b>让错误、图解、参数和代码在同一现场相互对应。</b>",[
("看见抽象概念","把 HWC、CHW、batch 变成可观察结构。"),
("操作后看见变化","调整轴顺序，对照输出形状与代码。"),
("回到当前问题判断","理解为什么这样改，再继续核验。")
],shot("01-development-diagram.jpg","现有 Demo · 对话中的形状问题与右侧张量图解联动。",badge(1,77,53)+badge(2,77,37)),"边做边懂","02.1 · LEARN WHILE DEVELOPING",note="用当前错误检验理解，让解释紧贴正在进行的任务。",demo="desktop"))

slides.append(dark("调试结束<br>经验有机会回到社区","P4 · 问题与解答进入私人 AI 对话后，<b>社区不再自然获得同一份排障过程。</b>",[
("在完成时轻量邀请","沿当前任务整理，不要求重新写一篇。"),
("草稿保留可复用信息","问题、尝试、环境与验证状态一起呈现。"),
("审阅后决定是否分享","可补充、删改；由用户确认提交。")
],shot("02-community-draft.jpg","现有 Demo · 根据任务对话整理社区草稿，在右侧逐项审阅。",badge(1,36,73)+badge(2,88,45)+badge(3,93,91)),"边做边懂","02.2 · EXPERIENCE RETURNS",note="目标体验：降低整理负担，同时保留适用范围、未决项和用户分享决定。",demo="desktop"))

slides.append(dark("学习从意图开始<br>路径随自己形成","P2 · 知道想做什么，也可能不知道先学什么。<b>用目标、已有基础和可用时间组织学习。</b>",[
("模糊意图也能进入","通过主题探索或简短交流明确方向。"),
("明确目标直接成路","把想掌握的能力转成一组学习节点。"),
("先看路径再开始","看清先后关系、实践和检查位置。")
],shot("06-learning-intent.jpg","现有 Demo · 左侧表达目标，右侧保留基础、时间与现成路径入口。",badge(1,31,25)+badge(2,69,36)+badge(3,85,65)),"自主学习","03.1 · INTENT TO PATH",note="目标、已有基础和时间共同组织路径，用户无需先了解完整知识目录。",demo="desktop"))

slides.append(dark("路径可以共创<br>用户拥有调整权","P2 · 生成一条路径还不够，<b>它需要容纳已有基础、新问题和学习中的变化。</b>",[
("对话提出调整","补入想学的内容，说明希望跳过的基础。"),
("在路径上审阅变化","新增重点可见，逐项采纳或忽略。"),
("确认后进入学习","草案与正式学习状态明确衔接。")
],shot("05-learning-collaboration.jpg","现有 Demo · 学习路径中提出调整建议，由用户审阅后采纳。",badge(1,26,25)+badge(2,76,56)+badge(3,84,26)),"自主学习","03.2 · CO-CREATE THE PATH",note="用户与 AI 共同调整路径，在画布上确认学习顺序和重点。",demo="desktop"))

cognition='''<div class="r-cognition"><svg viewBox="0 0 700 500" preserveAspectRatio="none"><path d="M215 96 C300 96 310 96 400 96 M150 140L150 245 M250 292 C320 292 310 365 400 365" fill="none" stroke="#b6b1c7" stroke-width="1.5"/></svg><span class="r-design-note">个人认知画布 · 设计示意</span><article class="r-node root"><small>学习节点</small><h3>理解维度顺序</h3>HWC → CHW</article><article class="r-node note"><small>我的解释 · 可编辑</small><h3>换的是轴的位置</h3><div contenteditable="true" role="textbox" aria-label="我的认知笔记">把第 2 轴 C 移到最前。尺寸值和它代表的含义一起移动，不能只改形状数字。</div></article><article class="r-node draw"><small>我的图解</small><div class="r-axes"><span>H</span><span>W</span><span>C</span></div><p style="margin:1vh 0;color:#8e879f">↓ transpose(2,0,1)</p><div class="r-axes"><span>C</span><span>H</span><span>W</span></div></article><article class="r-node code"><small>代码片段</small><pre>chw = image.transpose(2, 0, 1)<br>nchw = chw[None, ...]</pre></article><article class="r-node custom"><small>＋ 自定义节点</small><p>补一个 transpose 与 reshape 对比</p></article></div>'''
slides.append(dark("把学到的内容<br>变成自己的认知","P4 · 跟随内容走完，仍可能只留下“看过”。<b>让学习者主动重述、画图和关联实践。</b>",[
("路径允许自行补充","加入需要比较、复习或深入的节点。"),
("用自己的方式表达","笔记、图解、代码片段关联同一知识点。"),
("形成可回看的认知卡","下次遇到问题，能找回当时的理解。")
],cognition,"自主学习","03.3 · MAKE KNOWLEDGE YOUR OWN",note="目标体验示意 · 个人笔记可编辑；自定义节点、图解与代码片段围绕同一知识点组织。",demo="desktop"))

transition=f'''<div class="r-transition"><article class="card"><span class="r-chip">任务导向 → 学习导向</span><h2>遇到不理解的地方，补一段学习</h2><p>“我能按建议改好，但还不理解轴顺序。”<br>携带当前错误与参数进入对应图解和练习。</p><img class="r-smallshot" src="{asset('01-development-diagram.jpg')}" alt="开发中的图解"></article><article class="card"><span class="r-chip">学习导向 → 任务导向</span><h2>把理解带回实践，核对是否会用</h2><p>“我理解了 HWC 与 CHW，试着检查模型输入。”<br>保留学习路径与尝试，再进入实际开发任务。</p><img class="r-smallshot" src="{asset('07-learning-practice.jpg')}" alt="学习路径与实践内容"></article><div class="r-loop"><span>实际问题</span> → 理解与练习 → <span>应用与核验</span> → 新的问题</div></div>'''
slides.append(gray("任务与学习可以相互进入，理解随实践积累", "两类用户的连接 · 按当前诉求切换，保留上下文",transition,active="自主学习",note="目标体验：完成任务与能力增长分别留下可判断的证据，不用浏览进度替代学会。",demo="desktop"))

phone_states=[
    ("10-mini-briefing.jpg","每周速览 · 本周重点","一条重点资讯，接两张与当前任务相关的知识卡"),
    ("09-mini-notification.jpg","服务通知 · 选择打开","在熟悉的消息入口里先看懂本周内容的价值"),
    ("11-mini-knowledge.jpg","知识卡 · 标记理解状态","看图解、做理解题，再把疑问带回任务")
]
phone_tabs=''.join(f'<button type="button" data-phone-state="{i}" aria-pressed="{"true" if i==0 else "false"}">{label.split(" · ")[0]}</button>' for i,(_,label,_) in enumerate(phone_states))
phone_assets=''.join(f'<img src="{asset(name)}" alt="{esc(label)}" data-phone-description="{esc(description)}" data-phone-source="{i}">' for i,(name,label,description) in enumerate(phone_states))
phones=f'''<div class="r-phone-showcase">
  <div class="r-phone-switch" role="tablist" aria-label="切换小程序界面状态">{phone_tabs}</div>
  <figure class="r-phone-stage"><img src="{asset(phone_states[0][0])}" alt="{esc(phone_states[0][1])}"><figcaption class="r-phone-caption">{esc(phone_states[0][2])}</figcaption><button class="r-enlarge" aria-label="放大小程序界面" title="放大小程序界面">↗</button></figure>
  <div class="r-phone-assets" aria-hidden="true">{phone_assets}</div>
</div>'''
slides.append(dark("离开电脑<br>也能接着理解","P5 · 关注和疑问产生在开发现场，学习时间可能在通勤与间隙。<b>手机承接短内容，电脑承接实践。</b>",[
("让内容适合手机","一次聚焦一个概念，减少长文跳转。"),
("从熟悉的消息进入","通知交代价值，用户选择打开。")
],phones,"移动续学","04.1 · KNOWLEDGE IN YOUR POCKET",note="现有小程序交互 Demo · 通知、速览和知识卡；在弹层内可切换线上版。",cls="r-mobile-wide",demo="mini"))

signal=f'''<div class="r-signal"><img src="{asset('11-mini-knowledge.jpg')}" alt="知识卡的感兴趣与还没弄懂入口"><div class="r-signal-flow"><div><b>表达关注或存疑</b>“感兴趣”继续拓展；“还没弄懂”补解释。</div><i>↓</i><div><b>收到相关短内容</b>一条重点资讯 + 两张相关知识卡。</div><i>↓</i><div><b>整理后回到任务</b>留下理解与问题，回电脑继续核查。</div></div></div>'''
slides.append(dark("让关注和疑问<br>成为下一次学习的线索","P5 · 定期推送容易变成无关资讯。<b>用明确的兴趣、疑问信号和任务背景连接下一次内容。</b>",[
("用户能表达需要","主动标记，比猜测用户是否理解更明确。"),
("内容有连续性","短知识承接当前问题，并给出延伸入口。"),
("保留接续动作","小结与待核查问题可以带回电脑。")
],signal,"移动续学","04.2 · SIGNAL TO CONTINUITY",note="真实微信送达依赖用户授权与可用订阅模板；当前跨端接续通过复制小结演示。",demo="mini"))

unit='''<div class="r-supply"><div class="r-supply-copy"><h2>一条知识要能被找到、调用、验证</h2><p>提供方交付的不只是一段正文，还要说清内容身份、适用范围、来源和维护状态。</p><div class="r-supply-strip">知识合同 · 从内容到可复用单元<small>让开发者能判断是否适用，让 AI 能引用并给出核验步骤。</small></div></div><article class="r-unit"><div class="r-unit-top"><span>知识单元 · 示例</span><span>图像输入 / 维度转换</span></div><h2>HWC → CHW：按轴语义重排</h2><div class="r-contract"><div><small>稳定身份</small><strong>资源 ID · 类型 · 标题</strong></div><div><small>适用范围</small><strong>CANN · 芯片 · OS · 框架版本</strong></div><div><small>来源依据</small><strong>原文链接 · 锚点 · 使用许可</strong></div><div><small>维护状态</small><strong>Owner · 核验日期 · 有效状态</strong></div></div><div class="r-unit-diagram"><span>[H, W, C]</span><i>→ transpose(2, 0, 1) →</i><span>[C, H, W]</span></div><div class="r-unit-row"><b>何时用</b><p>图像输入为 HWC，而模型约定 CHW / NCHW；先核对尺寸、dtype 与归一化要求。</p></div><div class="r-unit-row"><b>执行步骤</b><p>按轴语义重排；需要 NCHW 时再加入 batch。</p></div><div class="r-unit-row"><b>预期信号</b><p>检查输出形状和轴含义，再核对模型实际输入与运行结果。</p></div></article></div>'''
slides.append(gray("知识要可引用，先补齐身份、范围与验证", "知识供给 1 / 2 · 一个最小知识合同示例",unit,active="知识供给",note="适用范围示例参考 CANN 资源元数据；transpose 例子仅说明步骤与核验信号，不作为昇腾运行证据。",demo="desktop"))

service='''<div class="r-service"><svg viewBox="0 0 1200 560" preserveAspectRatio="none"></svg><div class="r-service-col"><article class="r-service-item"><h3>官方内容</h3><p>文档 · API · 样例 · 课程 · 认证</p></article><article class="r-service-item"><h3>实践证据</h3><p>案例 · 错误 · 复现 · 验证</p></article></div><article class="r-service-core"><h2>整理与核验<br>进入可信知识目录</h2><p>稳定 ID<br>适用范围与来源许可<br>Owner 与核验状态<br>步骤和预期信号</p></article><div class="r-service-col"><article class="r-service-item"><h3>Web / 搜索</h3><p>给开发者、搜索与爬虫<br>HTML / Markdown · sitemap</p></article><article class="r-service-item"><h3>产品 API</h3><p>给学习、社区与 Demo<br>路径 · 课程 · 版本 · 活动</p></article><article class="r-service-item"><h3>Agent 接口</h3><p>MCP 读取知识<br>Skill 执行任务方法</p></article></div><div class="r-return">使用信号：收藏 · 学完 · 引用 · 运行 · 纠错 · 过期　｜　持续治理：来源许可 · 版本兼容 · 权限审计 · 资源退役</div></div>'''
slides.append(gray("同一知识目录，连接网页、产品与 Agent", "知识供给 2 / 2 · 按入口交付，使用信号回流",service,active="知识供给",note="目标服务关系示意，不代表 Web、API 或 Agent 后端已接入。",demo="mini"))

evals=[
("表达目标","用户能否理解推荐依据，并形成自己愿意发送的 Prompt？","目标表达完整性 · 修改与选择过程"),
("组织路径","用户能否解释为什么这样学，并调整不适合自己的部分？","路径可理解性 · 调整与采纳情况"),
("实践与理解","用户能否解释修改原因，并迁移到一个相似问题？","原因重述 · 相似任务应用"),
("留下收获","个人卡片能否再次使用，社区草稿是否保留必要上下文？","回看复用 · 草稿可复现性"),
("持续成长","手机内容是否相关，回到电脑后能否继续？","内容相关性 · 接续成功情况"),
]
evaluation='<p class="r-summary">让用户更容易开始，在实践中理解，<br>把收获带入下一次任务。</p><table class="r-eval"><thead><tr><th>旅程阶段</th><th>需要验证的体验</th><th>观察信号</th></tr></thead><tbody>'+''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>' for a,b,c in evals)+'</tbody></table>'
slides.append(gray("设计价值回到旅程，用用户能做什么来验证", "验证方向 · 不以功能数量或内容浏览量替代体验成效",evaluation,note="以上为建议的后续验证问题与观察信号；当前没有对应的效果统计。"))

sources='''<div class="r-source-grid"><article class="card"><h2>材料从哪里来</h2><p><a href="https://schihhsin.github.io/AscendCANN/ascstudio/" target="_blank" rel="noopener">电脑端 Ascend Studio ↗</a><br>主动建议、线索串联、开发图解、社区草稿与学习路径共创。</p><p><a href="https://schihhsin.github.io/AscendCANN/ascstudio-mini/" target="_blank" rel="noopener">口袋新知小程序 Demo ↗</a><br>本轮界面来自本地 5217：服务通知、每周速览、知识卡与明确兴趣信号。</p><p><a href="ai-development-behavior-system-report-concise.html#5" target="_blank" rel="noopener">既有 AI 协作开发者旅程 #5 ↗</a><br>直接复制其 HTML 结构与样式并保持可编辑；两种开发者起点和角色时序在同页展开。</p><p><a href="https://schihhsin.github.io/AscendCANN/ascstudio-mini/knowledge-provider-map.html" target="_blank" rel="noopener">知识供给侧服务蓝图 ↗</a><br>参考其资源身份、适用范围、来源许可、核验状态与多入口服务关系，压缩为两页。</p></article><article class="card"><h2>如何理解这份设计提案</h2><ul><li>旅程、人群与问题是基于现有材料和本轮讨论的设计组织，尚非新一轮用户研究定稿。</li><li>界面截图来自现有原型；个人认知画布、知识供给图和角色时序为设计示意。</li><li>图解、推荐、AI 草稿和消息送达使用演示状态；不代表真实 AI、微信后台或 NPU 已接入。</li><li>未宣称任务完成率、学习收益或社区回流效果已被验证。</li></ul><p><a href="https://numpy.org/doc/stable/reference/generated/numpy.transpose.html" target="_blank" rel="noopener">知识例证：NumPy transpose ↗</a> · <a href="https://cloud.tencent.cn/document/product/1301/103770" target="_blank" rel="noopener">订阅消息接入参考 ↗</a></p></article></div>'''
slides.append(gray("设计推演与现有原型，各有清楚的依据和边界", "来源与演示范围 · 支撑材料",sources,active="知识供给",note="2026.10.29 · 页面截图与状态记录见 ascend-studio-design-report-evidence/。"))

# Copy the whole template, replace only deck content; preserve controls and runtime.
head = TEMPLATE[:TEMPLATE.index("<body>")]
body_tail = TEMPLATE[TEMPLATE.index('<!-- 调色面板'):] if '<!-- 调色面板' in TEMPLATE else ""
if not body_tail:
    pos=TEMPLATE.index('<div id="panel"')
    body_tail=TEMPLATE[pos:]
head=head.replace("<title>汇报 PPT 模板</title>","<title>Ascend Studio · 让任务推进，也让能力成长</title>")
head=head.replace("</style>",SOURCE_JOURNEY_CSS+"\n"+CSS+"\n</style>")
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
addEventListener('hashchange',()=>{const n=parseInt(location.hash.slice(1),10);if(n<1||n>slides.length)return;const destination=n-1;if(CTRL){go(destination);return;}rOverviewTransition=true;slides[destination].scrollIntoView({block:'start',behavior:'instant'});updateCurrent(destination);requestAnimationFrame(()=>{rOverviewTransition=false;});});
document.fonts.ready.then(()=>{balanceHeads();reanchor();});""")
# Avoid deck keyboard navigation while editing notes, dialogs, and screenshots.
doc=doc.replace("if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;", "if(e.target.closest('input,textarea,select,[contenteditable=true]')||document.querySelector('.r-modal.open,dialog[open]'))return;")
extra=breakpoint_dialog+r'''
<div class="r-modal" role="dialog" aria-modal="true" aria-label="界面截图放大" aria-hidden="true"><button>关闭 · Esc</button><img alt="放大的界面截图"></div>
<dialog class="r-live-demo" aria-labelledby="r-live-demo-title">
  <header><h1 id="r-live-demo-title">Ascend Studio Demo</h1><div class="r-live-demo-actions"><a id="r-demo-new-window" target="_blank" rel="noopener">新窗口打开 ↗</a><a id="r-demo-fallback" target="_blank" rel="noopener" hidden>打开本地版 · 5217 ↗</a><button type="button" class="r-demo-close">关闭 · Esc</button></div></header>
  <iframe title="可交互的 Ascend Studio 产品原型" src="about:blank" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
</dialog>
<script>
const rModal=document.querySelector('.r-modal');
const bpDialog=document.querySelector('.r-bp-dialog');
const liveDialog=document.querySelector('.r-live-demo');
const liveFrame=liveDialog.querySelector('iframe');
let rFocus=null;
function drawService(){
  if(document.body.classList.contains('overview'))return;
  const w=document.querySelector('.r-service'),svg=w.querySelector('svg'),wr=w.getBoundingClientRect();
  const box=e=>{const r=e.getBoundingClientRect();return {x:r.left-wr.left,y:r.top-wr.top,w:r.width,h:r.height};};
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
function selectBreakpoint(index){
  bpDialog.querySelectorAll('[data-bp-tab]').forEach((tab,i)=>{tab.classList.toggle('active',i===index);tab.setAttribute('aria-selected',String(i===index));});
  bpDialog.querySelectorAll('[data-bp-panel]').forEach((panel,i)=>{panel.hidden=i!==index;});
}
document.querySelectorAll('[data-bp-open]').forEach(button=>button.addEventListener('click',()=>{selectBreakpoint(Number(button.dataset.bpOpen));bpDialog.showModal();}));
bpDialog.querySelectorAll('[data-bp-tab]').forEach((tab,i)=>tab.addEventListener('click',()=>selectBreakpoint(i)));
bpDialog.querySelector('.r-bp-close').addEventListener('click',()=>bpDialog.close());
bpDialog.querySelectorAll('.r-bp-panel a').forEach(a=>a.addEventListener('click',()=>bpDialog.close()));
bpDialog.addEventListener('click',e=>{if(e.target===bpDialog)bpDialog.close();});
const phoneImage=document.querySelector('.r-phone-stage>img');
const phoneCaption=document.querySelector('.r-phone-caption');
const phoneSources=[...document.querySelectorAll('[data-phone-source]')];
document.querySelectorAll('[data-phone-state]').forEach(button=>button.addEventListener('click',()=>{
  const source=phoneSources[Number(button.dataset.phoneState)];
  if(!source||!phoneImage)return;
  phoneImage.src=source.src;phoneImage.alt=source.alt;
  phoneCaption.textContent=source.dataset.phoneDescription||source.alt;
  document.querySelectorAll('[data-phone-state]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
document.querySelectorAll('.r-demo-launch').forEach(button=>button.addEventListener('click',()=>{
  const url=button.dataset.demoUrl, fallback=button.dataset.demoFallback;
  liveDialog.querySelector('h1').textContent=button.dataset.demoTitle;
  liveDialog.querySelector('#r-demo-new-window').href=url;
  const local=liveDialog.querySelector('#r-demo-fallback');local.hidden=!fallback;if(fallback)local.href=fallback;
  liveFrame.src=url;liveDialog.showModal();
}));
liveDialog.querySelector('.r-demo-close').addEventListener('click',()=>liveDialog.close());
liveDialog.addEventListener('close',()=>{liveFrame.src='about:blank';});
liveDialog.addEventListener('click',e=>{if(e.target===liveDialog)liveDialog.close();});
</script>
'''
doc=doc.replace("</body>",extra+"</body>")
OUT.write_text(doc)
# JS extraction for syntax check without a browser.
for i,s in enumerate(re.findall(r"<script(?:\s[^>]*)?>(.*?)</script>",doc,re.S)):
    (HERE/f"runtime-{i}.js").write_text(s)
(HERE/"page-map.json").write_text(json.dumps([{"page":i+1,"title":re.sub("<[^>]+>","",re.search(r'data-title="([^"]+)"',s).group(1))} for i,s in enumerate(slides)],ensure_ascii=False,indent=2))
print(f"{OUT}: {len(slides)} pages, {len(doc):,} bytes")
