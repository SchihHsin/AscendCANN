# -*- coding: utf-8 -*-
import pathlib
import re
import sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from d_slides1 import slide
from d_proto import SCATTER, TIMELINE
from d_seq_all import ALLSEQ
from d_two import TWO

base = pathlib.Path(__file__).resolve().parent.parent
deck = (base / 'AI-Coding用户访谈分析.html').read_text(encoding='utf-8')
css = re.search(r'<style>(.*?)</style>', deck, re.S).group(1)

EXTRA = """
.proto{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;align-items:stretch;gap:1.2vh}
.k-panel{width:min(100%,1080px);margin:0 auto;background:#fff;border-radius:18px;padding:1.8vh 1.6vw 1.2vh;
  box-shadow:0 26px 60px -46px rgba(20,25,35,.5),0 2px 0 rgba(255,255,255,.9) inset}
.k-svg{width:100%;height:auto;max-height:52vh;display:block}
.k-axis{stroke:#555D68;stroke-width:1.4}
.k-al{font:700 10.6px 'JetBrains Mono',monospace;fill:#6B7280;letter-spacing:.04em}
.k-rot{letter-spacing:.14em}
.k-pt circle{stroke:#fff;stroke-width:2}
.k-pt.s circle{fill:#0E7C86}
.k-pt.e circle{fill:#4B4BA8}
.k-pt text{font:600 11.6px 'HarmonyOS Sans SC','Noto Sans SC',sans-serif;fill:#2C333D}
.k-pt.hollow circle{fill:#fff;stroke-width:2}
.k-pt.s.hollow circle{stroke:#0E7C86}
.k-pt.e.hollow circle{stroke:#4B4BA8}
.k-cl{font:700 11.4px 'HarmonyOS Sans SC','Noto Sans SC',sans-serif}
.k-cn{font:500 9.2px 'HarmonyOS Sans SC','Noto Sans SC',sans-serif;fill:#8C95A3}
.k-lv{font:600 10.2px 'HarmonyOS Sans SC','Noto Sans SC',sans-serif;fill:#5E646E}
.sc-lg{display:flex;gap:1.4vw;font-size:10.4px;color:#8C95A3;align-items:center;justify-content:center;padding:.6vh 0 .4vh}
.sc-lg .s{color:#0E7C86}.sc-lg .e{color:#4B4BA8}
.sc-lg .muted{color:#A6ADB8;margin-left:.8vw}
.proto-take{font-size:11.8px;color:#3A4048;line-height:1.55;text-align:center}
.proto-take b{color:#16191E}
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
.tl-legend{display:flex;gap:1.8vw;font-size:10.2px;color:#8C95A3;margin-top:1.4vh;align-items:center;justify-content:center}
.tl-legend i{display:inline-block;vertical-align:middle;margin-right:.4em}
.tl-legend i.dot2{width:11px;height:11px;border-radius:50%;background:#4B4BA8}
.tl-legend i.dot1{width:8px;height:8px;border-radius:50%;background:#fff;border:2px solid #9AA3B2}
"""

EXTRA_2 = """
.two{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:1.4vw;align-items:stretch}
.two-card{width:100%;display:flex;flex-direction:column;padding:1.6vh 1vw 1.2vh;border-radius:16px}
.two-h b{font-size:13px;color:#16191E;display:block}
.two-h span{font-size:9.8px;color:#98A0AD;font-family:'JetBrains Mono'}
.two-card .k-svg{width:100%;height:auto;max-height:none;flex:1;min-height:0}
.two-f{display:flex;gap:1vw;font-size:9.8px;color:#8C95A3;justify-content:center;padding-top:.4vh}
.two-f .s{color:#0E7C86}.two-f .e{color:#4B4BA8}
.two-f .f{color:#2F3D63}.two-f .h{color:#8C95A3}
.two-t{font-size:10.4px;color:#3A4048;line-height:1.5;text-align:center;padding-top:.6vh;border-top:1px solid rgba(47,61,99,.1);margin-top:.4vh}
.two-t b{color:#16191E}
"""

p1 = slide(SCATTER, '依赖都上来了，信任没跟上', '过程 · 用户对照（原型 A：坐标）', 0)
p2 = slide(TIMELINE, '同一条任务，六个人在不同的地方回来', '过程 · 用户对照（原型 B：介入时间线）', 0)

html = ('<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
        '<title>介入方式原型</title><style>' + css + EXTRA + EXTRA_2 + '</style></head><body><div id="deck">'
        + p1 + p2 + ALLSEQ + TWO + '</div></body></html>')
out = base / '_proto' / '介入方式对比.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding='utf-8')
print('written', out, len(html))
