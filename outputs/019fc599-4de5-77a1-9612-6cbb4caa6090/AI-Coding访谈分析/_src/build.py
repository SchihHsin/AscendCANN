# -*- coding: utf-8 -*-
import re
import sys
import base64
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from d_css import CSS_EXTRA
from d_slides2 import ALL

TPL = pathlib.Path('/Users/hsin/.agents/skills/report-ppt-skill/assets/deck-template.html')
T = TPL.read_text(encoding='utf-8')

style = re.search(r'<style>(.*?)</style>', T, re.S).group(1)
script = re.search(r'<script>\s*(const root=.*?)</script>', T, re.S).group(1)
tail = T[T.index('<div id="panel"'):]
tail = tail.replace('<script>\nconst root=', '<script>\nconst root=')

html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Coding 用户访谈分析 | 6 位开发者的开发与学习旅程</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400&family=Inter:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Noto+Sans+SC:wght@200;300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/IKKI2000/harmonyos-fonts@master/css/harmonyos_sans_sc.css">
<style>
%s
%s
</style>
</head>
<body>
<div id="deck">
%s
</div>
%s
</body>
</html>
''' % (style, CSS_EXTRA, '\n\n'.join(ALL), tail)

# 给每页加 id="pN"，并注入 #pN 深链跳转
_parts = html.split('<section class="slide')
html = _parts[0]
for _i, _seg in enumerate(_parts[1:], start=1):
    html += '<section id="p%d" class="slide' % _i + _seg

# 每页的章节归属（1-based）：14 过程 / 22 发现 / 2 汇总 / 2 设计
TABMAP = [1] * 14 + [2] * 22 + [3] * 2 + [4] * 2
GROUPS = {15: '前提', 16: '前提', 17: '前提', 18: '交办', 19: '交办',
          20: '执行', 21: '执行', 22: '执行', 23: '执行',
          24: '验收', 25: '验收', 26: '验收', 27: '出错', 28: '出错',
          29: '沉淀', 30: '沉淀', 31: '沉淀', 32: '沉淀',
          33: '贯穿', 34: '贯穿', 35: '贯穿', 36: '贯穿'}

from d_slides1 import TABS as _TABS
_secs = html.split('<section id="p')
for _i in range(1, len(_secs)):
    _seg = _secs[_i]
    _ti = TABMAP[_i - 1] if _i - 1 < len(TABMAP) else len(_TABS)
    _spans = ''.join('<span class="%s">%s</span>' % ('active' if _k + 1 == _ti else '', _t)
                     for _k, _t in enumerate(_TABS))
    _seg = re.sub(r'(<div class="section-tabs"[^>]*>)(.*?)(</div>)',
                  lambda m: m.group(1) + _spans + m.group(3), _seg, count=1)
    if 5 <= _i <= 14:
        _seg = _seg.replace('<div class="subttl">角色与旅程 · ', '<div class="subttl">过程 · ', 1)
        _seg = _seg.replace('<div class="subttl">人机协作 · ', '<div class="subttl">过程 · ', 1)
    _g = GROUPS.get(_i)
    if 15 <= _i <= 36:
        _m = re.search(r'<div class="subttl">(.*?)</div>', _seg)
        if _m:
            _tail = _m.group(1).split(' · ')[-1]
            _seg = _seg.replace(_m.group(0), '<div class="subttl">发现 · %s</div>' % _tail, 1)
    if _g:
        _seg = _seg.replace('<span class="ttl">', '<span class="gtag">%s</span><span class="ttl">' % _g, 1)
    _secs[_i] = _seg
html = '<section id="p'.join(_secs)

DEEPLINK = """
<script>
(function(){
  function goto(){
    var m=(location.hash||'').match(/^#p?(\\d+)$/);
    if(!m) return;
    var el=document.getElementById('p'+m[1]);
    if(!el) return;
    var h=document.documentElement, t=el.offsetTop, ob=h.style.scrollBehavior;
    h.style.scrollBehavior='auto';
    h.scrollTop=t;
    window.scrollTo(0,t);
    h.style.scrollBehavior=ob;
  }
  window.addEventListener('load', function(){ setTimeout(goto, 0); });
  window.addEventListener('hashchange', goto);
})();
</script>
"""
html = html.replace('</body>', DEEPLINK + '</body>')

# 运行时初始化时的 scrollTo(0,0) 也要尊重 #pN（body 是滚动容器）
_boot = ("var _m=(location.hash||'').match(/^#p?(\\d+)$/),"
         "_el=_m&&document.getElementById('p'+_m[1]);"
         "if(_el){var _h=document.documentElement;_h.style.scrollBehavior='auto';_h.scrollTop=_el.offsetTop;}"
         "else{window.scrollTo(0,0);}")
if 'window.scrollTo(0,0);' in html:
    html = html.replace('window.scrollTo(0,0);', _boot, 1)
else:
    print('WARN: boot scrollTo not found')

# 翻页时把当前页码写回地址栏（#1、#2 …），刷新/分享即定位到该页
_OLD = 'updateCurrent(0);'
_NEW = ('var _uc=updateCurrent;'
        'updateCurrent=function(n){_uc(n);'
        'try{history.replaceState(null,"","#"+(n+1))}catch(e){}};'
        'updateCurrent(0);')
if _OLD in html:
    html = html.replace(_OLD, _NEW, 1)
else:
    print('WARN: updateCurrent(0) not found')

# 头像内联为 data URI，保证单文件可移植（源文件保留在目录里）
_base = pathlib.Path(__file__).resolve().parent.parent
for _f in ('av-student.svg', 'av-emp.svg'):
    _p = _base / _f
    if _p.exists():
        _b64 = base64.b64encode(_p.read_bytes()).decode()
        html = html.replace('src="%s"' % _f, 'src="data:image/svg+xml;base64,%s"' % _b64)
    else:
        print('WARN: avatar missing', _f)

out = pathlib.Path(__file__).resolve().parent.parent / 'AI-Coding用户访谈分析.html'
out.write_text(html, encoding='utf-8')
print('written', out, len(html))
