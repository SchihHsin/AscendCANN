# -*- coding: utf-8 -*-
import pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from d_slides1 import slide
from d_proto import SCATTER, TIMELINE

base = pathlib.Path(__file__).resolve().parent.parent
deck = (base / 'AI-Coding用户访谈分析.html').read_text(encoding='utf-8')
css = re.search(r'<style>(.*?)</style>', deck, re.S).group(1)

EXTRA = '''
.sc-wrap{position:relative;flex:none;height:472px;margin-top:1vh}
.sc-axis-x{position:absolute;left:160px;right:120px;top:460px;height:1px;background:#C9CFD8}
.sc-axis-y{position:absolute;left:160px;top:0;height:460px;width:1px;background:#C9CFD8}
.sc-cap{position:absolute;font-size:10.2px;color:#98A0AD;font-family:'JetBrains Mono';letter-spacing:.06em}
.sc-cap.xl{left:160px;top:474px}
.sc-cap.xr{right:120px;top:474px}
.sc-cap.yt{left:120px;top:2px}
.sc-cap.yb{left:100px;top:436px}
.sc-pt{position:absolute;transform:translateY(-50%);display:flex;align-items:center;gap:.45em;white-space:nowrap}
.sc-pt.lft{flex-direction:row-reverse;transform:translate(-100%,-50%)}
.sc-pt i{width:11px;height:11px;border-radius:50%;display:block;border:2.5px solid #fff;box-shadow:0 0 0 1.5px currentColor}
.sc-pt b{font-size:11.8px;font-weight:600;color:#2C333D}
.sc-pt.s i{color:#0E7C86;background:#0E7C86}
.sc-pt.e i{color:#4B4BA8;background:#4B4BA8}
.sc-lg{display:flex;gap:1.4vw;font-size:10.4px;color:#8C95A3;margin-top:.6vh}
.sc-lg .s{color:#0E7C86}
.sc-lg .e{color:#4B4BA8}
.proto{flex:1;min-height:0;display:flex;flex-direction:column}
.proto-take{font-size:11.8px;color:#3A4048;line-height:1.55;margin-top:1.6vh}
.proto-take b{color:#16191E}
.proto-note{font-size:10px;color:#98A0AD;margin-top:.8vh;line-height:1.5}
.tl{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center}
.tl-head,.tl-r{display:grid;grid-template-columns:96px 1fr 260px;gap:1.4vw;align-items:center}
.tl-head div{font-family:'JetBrains Mono';font-size:9.6px;letter-spacing:.08em;color:#98A0AD;text-align:center}
.tl-head .tl-n{text-align:left}
.tl-r{padding:3.1vh 0;border-top:1px solid rgba(47,61,99,.08)}
.tl-n{font-size:12.8px;font-weight:700;color:#22262F}
.tl-r.s .tl-n{color:#0E7C86}
.tl-r.e .tl-n{color:#4B4BA8}
.tl-line{display:grid;grid-template-columns:repeat(5,1fr);position:relative}
.tl-line::before{content:"";position:absolute;left:10%;right:10%;top:50%;height:1px;background:rgba(47,61,99,.16)}
.tl-c{display:flex;justify-content:center;position:relative;z-index:1}
.tl-c i{display:block;border-radius:50%;background:#fff}
.tl-c i.dot2{width:12px;height:12px;background:#4B4BA8;box-shadow:0 0 0 2px rgba(75,75,168,.18)}
.tl-c i.dot1{width:9px;height:9px;background:#fff;border:2px solid #9AA3B2}
.tl-c i.dot0{width:5px;height:5px;background:#D5DAE2}
.tl-g{font-size:10.4px;color:#5E646E;line-height:1.4}
.tl-legend{display:flex;gap:1.8vw;font-size:10.2px;color:#8C95A3;margin-top:1.4vh;align-items:center}
.tl-legend i{display:inline-block;vertical-align:middle;margin-right:.4em}
.tl-legend i.dot2{width:11px;height:11px;border-radius:50%;background:#4B4BA8}
.tl-legend i.dot1{width:8px;height:8px;border-radius:50%;background:#fff;border:2px solid #9AA3B2}
'''

p1 = slide(SCATTER, '依赖都上来了，信任没跟上', '过程 · 用户对照（原型 A：坐标）', 0)
p2 = slide(TIMELINE, '同一条任务，六个人在不同的地方回来', '过程 · 用户对照（原型 B：介入时间线）', 0)

html = ('<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
        '<title>介入方式原型</title><style>' + css + EXTRA + '</style></head><body><div id="deck">'
        + p1 + p2 + '</div></body></html>')
out = base / '_proto' / '介入方式对比.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding='utf-8')
print('written', out, len(html))
