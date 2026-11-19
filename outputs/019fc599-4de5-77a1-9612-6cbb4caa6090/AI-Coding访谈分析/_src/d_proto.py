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

W, H = 880, 460
X0, Y0 = 160, 0
BASE = Y0 + H  # 460

_dots = ''
for n, g, x, y in PT:
    px = X0 + x * W
    py = BASE - y * H
    side = ' lft' if px > X0 + W * 0.55 else ''
    _dots += ('<div class="sc-pt %s%s" style="left:%dpx;top:%dpx"><i></i><b>%s</b></div>'
              % (g, side, int(px), int(py), n))

SCATTER = '''
<div class="proto">
  <div class="sc-wrap">
    <div class="sc-axis-x"></div>
    <div class="sc-axis-y"></div>
    <div class="sc-cap xl">AI 干得少</div><div class="sc-cap xr">AI 干得多</div>
    <div class="sc-cap yt">敢放手</div><div class="sc-cap yb">每步都查</div>
    %s
  </div>
  <div class="sc-lg"><span class="s">● 学生</span><span class="e">● 企业新员工</span></div>
  <div class="proto-take">用得多、查得紧的人落在右下：<b>AI 的产能已经进来了，人的验收没跟上</b>。</div>
  <div class="proto-note">点的位置为研究者据访谈判断的定性定位，不构成测量值。</div>
</div>''' % _dots

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
