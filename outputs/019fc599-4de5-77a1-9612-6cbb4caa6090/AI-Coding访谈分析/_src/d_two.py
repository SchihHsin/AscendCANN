# -*- coding: utf-8 -*-
"""一页两张坐标：左＝开发（依赖×信任），右＝学习（时点×学会标准）。"""
import math
from d_slides1 import slide

W, H = 640, 540
PX, PY, PW, PH = 86, 34, 500, 430
GRIDC = 'rgba(76,85,98,.13)'


def _xy(x, y):
    return PX + x * PW, PY + (1 - y) * PH


def _grid(nx, ny):
    o = ''
    for i in range(1, nx):
        gx = PX + PW * i / nx
        o += '<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s"/>' % (gx, PY, gx, PY + PH, GRIDC)
    for i in range(1, ny):
        gy = PY + PH * i / ny
        o += '<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="%s"/>' % (PX, gy, PX + PW, gy, GRIDC)
    return o


def _axes():
    return ('<line class="k-axis" x1="%d" y1="%d" x2="%d" y2="%d"/>'
            '<line class="k-axis" x1="%d" y1="%d" x2="%d" y2="%d"/>'
            % (PX, PY + PH, PX + PW, PY + PH, PX, PY, PX, PY + PH))


def _dot(x, y, name, role, side='right', hollow=False, label=True):
    cx, cy = _xy(x, y)
    dx = 13 if side == 'right' else -13
    anchor = 'start' if side == 'right' else 'end'
    cls = 'k-pt hollow' if hollow else 'k-pt'
    o = '<g class="%s %s"><circle cx="%.1f" cy="%.1f" r="7"/>' % (cls, role, cx, cy)
    if label:
        o += '<text x="%.1f" y="%.1f" text-anchor="%s">%s</text>' % (cx + dx, cy + 4, anchor, name)
    return o + '</g>'


# ---------------- 左：开发 ----------------
DEV_PTS = [('王鹤锦', 's', 0.30, 0.28), ('梁淼城', 's', 0.45, 0.52), ('徐立桂', 's', 0.80, 0.68),
           ('王伟', 'e', 0.72, 0.40), ('郑雨豪', 'e', 0.75, 0.15), ('彭椒', 'e', 0.92, 0.88)]
DEV_CLU = [('彭椒', '徐立桂', '#4B4BA8', '放手', '干得多，也敢放手', 1),
           ('王伟', '郑雨豪', '#B3403A', '审查', '干得多，每一步都要查', 1),
           ('梁淼城', '王鹤锦', '#727B88', '自己写', '用得少，也不太信', -1)]

_dev_pos = {n: _xy(x, y) for n, g, x, y in DEV_PTS}
_dev_rings = ''
for a, b, col, lab, note, side in DEV_CLU:
    (x1, y1), (x2, y2) = _dev_pos[a], _dev_pos[b]
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    dx, dy = x2 - x1, y2 - y1
    d = math.hypot(dx, dy)
    ang = math.degrees(math.atan2(dy, dx))
    _dev_rings += ('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="30" fill="%s1a" stroke="%s" '
                   'stroke-dasharray="5 4" stroke-width="1.1" transform="rotate(%.1f %.1f %.1f)"/>'
                   % (cx, cy, d / 2 + 22, col, col, ang, cx, cy))

_dev_dots = ''
for n, g, x, y in DEV_PTS:
    _dev_dots += _dot(x, y, n, g, 'left' if x > 0.62 else 'right')

DEV_SVG = ('<svg class="k-svg" viewBox="0 0 %d %d">' % (W, H) + _grid(4, 0) + _axes() +
           _dev_rings + _dev_dots +
           '<text class="k-al" x="%d" y="%d" text-anchor="start">AI 干得少</text>'
           '<text class="k-al" x="%d" y="%d" text-anchor="end">AI 干得多</text>'
           '<text class="k-al k-rot" x="52" y="%d" text-anchor="middle" transform="rotate(-90 52 %d)">每步都查 → 敢放手</text>'
           '</svg>' % (PX, PY + PH + 26, PX + PW, PY + PH + 26, PY + PH / 2, PY + PH / 2))


def _ellipse_from_points(pts, pad_x=24, pad_y=22):
    """PCA 拟合一组点的外接椭圆（返回 cx,cy,rx,ry,angle）。"""
    n = len(pts)
    cx = sum(p[0] for p in pts) / n
    cy = sum(p[1] for p in pts) / n
    sxx = sum((p[0] - cx) ** 2 for p in pts) / n
    syy = sum((p[1] - cy) ** 2 for p in pts) / n
    sxy = sum((p[0] - cx) * (p[1] - cy) for p in pts) / n
    ang = 0.5 * math.atan2(2 * sxy, sxx - syy)
    ca, sa = math.cos(ang), math.sin(ang)
    u = [((p[0] - cx) * ca + (p[1] - cy) * sa) for p in pts]
    v = [(-(p[0] - cx) * sa + (p[1] - cy) * ca) for p in pts]
    rx = max(abs(min(u)), abs(max(u))) + pad_x
    ry = max(abs(min(v)), abs(max(v))) + pad_y
    return cx, cy, rx, ry, math.degrees(ang)

# ---------------- 右：学习 ----------------
# x: 卡住才学(0) → 主动起意(1)；y: 能跑通(0) / 能讲清(0.5) / 能复现(1)
LEARN_PAS = [('彭椒', 'e', 0.05, 0.20, 'right'), ('梁淼城', 's', 0.13, 0.14, 'right'),
             ('郑雨豪', 'e', 0.21, 0.18, 'right'), ('王伟', 'e', 0.30, 0.13, 'right'),
             ('王鹤锦', 's', 0.34, 0.52, 'right'), ('徐立桂', 's', 0.20, 0.56, 'right')]
LEARN_ACT = {'王伟': (0.62, 0.50, 'left'), '王鹤锦': (0.84, 0.52, 'right'), '徐立桂': (0.92, 0.86, 'left')}

_learn = ''
for n, g, x, y in LEARN_ACT.values() and [] or []:
    pass

LEARN_CLU = [
    (['彭椒', '梁淼城', '郑雨豪', '王伟'], 'pas', '#8C95A3', '现学现用'),
    (['王鹤锦', '徐立桂'], 'pas', '#C08A2E', '边做边懂'),
    (['王伟', '王鹤锦', '徐立桂'], 'act', '#2E8B6B', '主动补'),
]
_learn += ''
for names, src_, col, lab in LEARN_CLU:
    pts = []
    for n in names:
        if src_ == 'act' and n in LEARN_ACT:
            pts.append(_xy(*LEARN_ACT[n][:2]))
        else:
            row = [p for p in LEARN_PAS if p[0] == n]
            if row:
                pts.append(_xy(row[0][2], row[0][3]))
    if len(pts) < 2:
        continue
    cx, cy, rx, ry, ang = _ellipse_from_points(pts)
    _learn += ('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s1a" stroke="%s" '
               'stroke-dasharray="5 4" stroke-width="1.1" transform="rotate(%.1f %.1f %.1f)"/>'
               % (cx, cy, rx, ry, col, col, ang, cx, cy))

# 连线
for n, (ax, ay, _sd) in LEARN_ACT.items():
    px, py = [p for p in LEARN_PAS if p[0] == n][0][2], [p for p in LEARN_PAS if p[0] == n][0][3]
    x1, y1 = _xy(px, py)
    x2, y2 = _xy(ax, ay)
    _learn += ('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#C3C9D4" '
               'stroke-width="1.1" stroke-dasharray="4 4"/>' % (x1, y1, x2, y2))

for n, g, x, y, sd in LEARN_PAS:
    _learn += _dot(x, y, n, g, sd)
for n, (x, y, sd) in LEARN_ACT.items():
    _role = [p[1] for p in LEARN_PAS if p[0] == n][0]
    _learn += _dot(x, y, n, _role, sd, hollow=True, label=True)

LEARN_SVG = ('<svg class="k-svg" viewBox="0 0 %d %d">' % (W, H) + _grid(4, 2) + _axes() + _learn +
             '<text class="k-lv" x="%d" y="%d" text-anchor="end">能复现</text>'
             '<text class="k-lv" x="%d" y="%d" text-anchor="end">能讲清</text>'
             '<text class="k-lv" x="%d" y="%d" text-anchor="end">能跑通</text>'
             '<text class="k-al" x="%d" y="%d" text-anchor="start">卡住才学</text>'
             '<text class="k-al" x="%d" y="%d" text-anchor="end">主动起意</text>'
             '</svg>' % (PX - 12, PY + PH / 6 + 4, PX - 12, PY + PH / 2 + 4, PX - 12, PY + PH * 5 / 6 + 4,
                         PX, PY + PH + 26, PX + PW, PY + PH + 26))

TWO = slide('''
<div class="two">
  <div class="k-panel two-card">
    <div class="two-h"><b>开发：交到什么程度</b><span>横轴＝AI 干多少，纵轴＝查得多紧</span></div>
    %s
    <div class="two-f"><span class="s">● 学生</span><span class="e">● 企业新员工</span>
      <span style="color:#4B4BA8">⌒ 放手</span><span style="color:#B3403A">⌒ 审查</span><span style="color:#727B88">⌒ 自己写</span></div>
    <div class="two-t">用得多、查得紧的人落在右下：<b>AI 的产能进来了，验收没跟上</b>。</div>
  </div>
  <div class="k-panel two-card">
    <div class="two-h"><b>学习：学到什么程度</b><span>横轴＝什么时候学，纵轴＝什么算学会</span></div>
    %s
    <div class="two-f"><span class="f">● 被动学</span><span class="h">○ 主动学</span>
      <span style="color:#8C95A3">⌒ 现学现用</span><span style="color:#C08A2E">⌒ 边做边懂</span><span style="color:#2E8B6B">⌒ 主动补</span></div>
    <div class="two-t">主动学大多停在“能讲清”，<b>只有一个人推到“能复现”</b>。</div>
  </div>
</div>''' % (DEV_SVG, LEARN_SVG),
    '开发与学习：同一批人，各聚成三组', '过程 · 两种场景的聚类', 0)
