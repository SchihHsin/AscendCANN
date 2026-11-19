# -*- coding: utf-8 -*-
"""两个候选版式：坐标图 vs 介入时间线（原型，不进正式 deck）。"""

PT = [
    # 名字, 归属, 依赖(AI 干多少 0-1), 信任(查得紧→敢放手 0-1)
    ('王鹤锦', 's', 0.30, 0.28),
    ('梁淼城', 's', 0.45, 0.52),
    ('徐立桂', 's', 0.80, 0.68),
    ('王伟', 'e', 0.72, 0.40),
    ('郑雨豪', 'e', 0.75, 0.15),
    ('彭椒', 'e', 0.92, 0.88),
]

# Kano 式象限图（参考 cann-dashboard 问卷分析 #3）
X0, Y0, PW, PH = 150, 40, 640, 420
GRID = 'rgba(76,85,98,.13)'


def _pt(x, y):
    return X0 + x * PW, Y0 + (1 - y) * PH


_grid = ''
for i in range(1, 4):
    gx = X0 + PW * i / 4
    gy = Y0 + PH * i / 4
    _grid += '<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s"/>' % (gx, Y0, gx, Y0 + PH, GRID)
    _grid += '<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="%s"/>' % (X0, gy, X0 + PW, gy, GRID)

_QUAD = [
    ('k-Q2', 26, 62, 'start', '只让它试', '用得少，但愿意信'),
    ('k-Q1', 914, 62, 'end', '放手', '干得多，也敢放手'),
    ('k-Q3', 26, 442, 'start', '自己写', '用得少，也不太信'),
    ('k-Q4', 914, 442, 'end', '审查', '干得多，每一步都要查'),
]
_qlab = ''
for cls, x, y, anchor, t, note in _QUAD:
    _qlab += ('<text class="k-ql %s" x="%d" y="%d" text-anchor="%s">%s</text>'
              '<text class="k-qn" x="%d" y="%d" text-anchor="%s">%s</text>'
              % (cls, x, y, anchor, t, x, y + 16, anchor, note))

_dots = ''
for n, g, x, y in PT:
    cx, cy = _pt(x, y)
    right = cx < X0 + PW * 0.62
    lx = cx + 14 if right else cx - 14
    anchor = 'start' if right else 'end'
    _dots += ('<g class="k-pt %s"><circle cx="%.1f" cy="%.1f" r="7.5"/>'
              '<text x="%.1f" y="%.1f" text-anchor="%s">%s</text></g>'
              % (g, cx, cy, lx, cy + 4, anchor, n))

# 相邻成组的三个圈（互为最近邻）
import math as _m

CLUSTERS = [
    ('彭椒', '徐立桂', '#4B4BA8'),
    ('王伟', '郑雨豪', '#B3403A'),
    ('梁淼城', '王鹤锦', '#727B88'),
]

_pos = {n: _pt(x, y) for n, g, x, y in PT}
_rings = ''
for a, b, col in CLUSTERS:
    (x1, y1), (x2, y2) = _pos[a], _pos[b]
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    dx, dy = x2 - x1, y2 - y1
    d = _m.hypot(dx, dy)
    ang = _m.degrees(_m.atan2(dy, dx))
    rx, ry = d / 2 + 32, 40
    _rings += ('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s1a" stroke="%s" '
               'stroke-dasharray="5 4" stroke-width="1.2" transform="rotate(%.1f %.1f %.1f)"/>'
               % (cx, cy, rx, ry, col, col, ang, cx, cy))

SCATTER = '''
<div class="proto">
  <div class="k-panel">
  <svg class="k-svg" viewBox="0 0 940 520" preserveAspectRatio="xMidYMid meet">
    <g class="k-gridg">%s</g>
    <line class="k-axis" x1="%d" y1="%d" x2="%d" y2="%d"/>
    <line class="k-axis" x1="%d" y1="%d" x2="%d" y2="%d"/>
    %s
    %s
    %s
    <text class="k-al" x="%d" y="%d" text-anchor="start">AI 干得少</text>
    <text class="k-al" x="%d" y="%d" text-anchor="end">AI 干得多</text>
    <text class="k-al k-rot" x="%d" y="%d" text-anchor="middle" transform="rotate(-90 %d %d)">每步都查 → 敢放手</text>
  </svg>
  <div class="sc-lg"><span class="s">● 学生</span><span class="e">● 企业新员工</span><span class="muted">点的位置为研究者据访谈判断的定性定位，不构成测量值</span></div>
  </div>
  <div class="proto-take">圈起来的三组位置最接近：<b>放手、审查、自写</b>。最值得看的是“审查”那组——用得多，查得也最细。</div>
</div>''' % (_grid, X0, Y0 + PH, X0 + PW, Y0 + PH, X0, Y0, X0, Y0 + PH,
              _qlab, _rings, _dots,
              X0, Y0 + PH + 26, X0 + PW, Y0 + PH + 26,
              118, Y0 + PH / 2, 118, Y0 + PH / 2)

STAGES = ['开工 / 定题', '备料 / 上下文', 'AI 执行', '验收 / 纠偏', '沉淀 / 交付']

TL = [
    ('彭椒', 'e', [2, 2, 1, 2, 1], '只在终点手跑一遍'),
    ('王伟', 'e', [2, 2, 2, 2, 2], '每一步都在看'),
    ('郑雨豪', 'e', [1, 2, 2, 2, 1], '做完必查'),
    ('徐立桂', 's', [1, 2, 2, 2, 1], '一个窗口实现、一个窗口验收'),
    ('梁淼城', 's', [2, 2, 1, 1, 1], '命令要确认，文件放行'),
    ('王鹤锦', 's', [2, 2, 2, 1, 2], '自己写，AI 只在边上讲'),
]

_head = ''.join('<div>%s</div>' % s for s in STAGES)
_rows = ''
for n, g, marks, note in TL:
    cells = ''
    for m in marks:
        if m == 2:
            cells += '<div class="tl-c"><i class="dot2"></i></div>'
        elif m == 1:
            cells += '<div class="tl-c"><i class="dot1"></i></div>'
        else:
            cells += '<div class="tl-c"><i class="dot0"></i></div>'
    _rows += ('<div class="tl-r %s"><div class="tl-n">%s</div><div class="tl-line">%s</div>'
              '<div class="tl-g">%s</div></div>' % (g, n, cells, note))

TIMELINE = '''
<div class="proto">
  <div class="tl">
    <div class="tl-head"><div class="tl-n"></div><div class="tl-line">%s</div><div class="tl-g"></div></div>
    %s
  </div>
  <div class="tl-legend"><span><i class="dot2"></i>深度介入</span><span><i class="dot1"></i>轻介入 / 抽查</span><span>线＝这段在他的视野里</span></div>
  <div class="proto-take">彭椒和王伟是两个极端：<b>一个只在终点回来，一个每一步都在</b>；中间的人按任务风险各不相同。</div>
  <div class="proto-note">介入点由研究者据访谈整理；同一阶段内不区分先后顺序。</div>
</div>''' % (_head, _rows)
