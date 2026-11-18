# -*- coding: utf-8 -*-
import re
import sys
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

out = pathlib.Path(__file__).resolve().parent.parent / 'AI-Coding用户访谈分析.html'
out.write_text(html, encoding='utf-8')
print('written', out, len(html))
