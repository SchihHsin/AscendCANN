# -*- coding: utf-8 -*-
"""按 journey-sequence-diagram 规范生成的 SVG 时序图：
时间向下、参与者横列、生命线、消息箭头 + 发起方圆标、本地动作圆角矩形、
决策窄竖条、阶段带 / 主导带、图例。所有坐标由结构化数据推导。
"""
from d_slides1 import slide

HUMAN = '#2F3D63'
AI = '#6B5BA8'
TOOL = '#3F7D72'
SRC = '#8A6A3C'
GOLD = '#C79433'
LOOP = '#2F5FA8'


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def render(spec):
    P = spec['participants']
    n = len(P)
    idx = {p['id']: i for i, p in enumerate(P)}
    W = 1600
    LEFT, RIGHT = 146, 26
    lane = (W - LEFT - RIGHT) / n
    cx = [LEFT + lane * (i + 0.5) for i in range(n)]

    # ---- 行高：动作占 54，仅消息 24；每条消息 26；行尾留白 22 ----
    rows, y = [], 74
    for st in spec['steps']:
        node = st.get('node') or {}
        top = 56 if node.get('kind') == 'decision' else (46 if node else 20)
        h = top + 24 * max(1, len(st.get('msgs', []))) + 14
        rows.append((y, h))
        y += h
    H = y + 14

    o = ['<svg viewBox="0 0 %d %d" role="img" aria-label="%s" font-family="HarmonyOS Sans SC, Noto Sans SC, sans-serif">'
         % (W, H, esc(spec['title']))]
    o.append('<defs>')
    for cid, col in (('arr', '#8C97A5'), ('arrLoop', LOOP), ('arrRed', '#C0392B')):
        o.append('<marker id="%s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">'
                 '<path d="M0,0 L10,5 L0,10" fill="none" stroke="%s" stroke-width="1.6"/></marker>' % (cid, col))
    o.append('</defs>')

    # ---- 阶段带 / 主导带 ----
    for (a, b, name, lead) in spec['phases']:
        y0 = rows[a][0]
        y1 = rows[b][0] + rows[b][1]
        lead_col = HUMAN if lead == 'human' else AI
        o.append('<rect x="8" y="%d" width="118" height="%d" rx="7" fill="#FFFFFF" fill-opacity=".5"/>'
                 % (y0 - 5, y1 - y0))
        o.append('<circle cx="14" cy="%d" r="3.4" fill="%s"/>' % (y0 + 8, lead_col))
        o.append('<text x="22" y="%d" font-size="11.5" fill="#2F3844">%s</text>' % (y0 + 13, esc(name)))
        o.append('<text x="22" y="%d" font-size="9.5" fill="%s">%s</text>'
                 % (y0 + 28, lead_col, '人主导' if lead == 'human' else 'AI 主导'))

    # ---- 生命线与列头 ----
    for i, p in enumerate(P):
        o.append('<line x1="%.1f" y1="56" x2="%.1f" y2="%d" stroke="#B4BDC9" stroke-width="1.3" stroke-dasharray="5 4"/>'
                 % (cx[i], cx[i], H - 6))
        w = 148
        o.append('<rect x="%.1f" y="14" width="%d" height="34" rx="9" fill="%s"/>' % (cx[i] - w / 2, w, p['color']))
        o.append('<text x="%.1f" y="36" font-size="13.5" font-weight="600" fill="#fff" text-anchor="middle">%s</text>'
                 % (cx[i], esc(p['label'])))

    # ---- 步骤 ----
    def lane_x(i):
        return cx[i]

    for si, st in enumerate(spec['steps']):
        y0, h = rows[si]
        node = st.get('node')
        msg_y0 = y0 + (62 if (node and node.get('kind') == 'decision') else (56 if node else 24))
        if node:
            i = idx[node['actor']]
            col = HUMAN if node['actor'] == 'dev' else (AI if node['actor'] == 'ai' else (TOOL if node['actor'] == 'env' else SRC))
            if node['kind'] == 'decision':
                bw, bh = 15, 34
                o.append('<g><title>%s</title><rect x="%.1f" y="%d" width="%d" height="%d" rx="7" fill="%s"/>'
                         '<text x="%.1f" y="%d" font-size="10.8" fill="#5A4212" text-anchor="middle">%s</text></g>'
                         % (esc(node.get('detail', node['title'])), cx[i] - bw / 2, y0 + 14, bw, bh, GOLD,
                            cx[i], y0 + 9, esc(node['title'])))
            else:
                tw = 168
                o.append('<g><title>%s</title><rect x="%.1f" y="%d" width="%d" height="30" rx="8" fill="#fff" stroke="%s" stroke-width="1.4"/>'
                         '<text x="%.1f" y="%d" font-size="11.5" fill="#2C333B" text-anchor="middle">%s</text></g>'
                         % (esc(node.get('detail', node['title'])), cx[i] - tw / 2, y0 + 4, tw, col,
                            cx[i], y0 + 23, esc(node['title'])))

        for mi, m in enumerate(st.get('msgs', [])):
            my = msg_y0 + mi * 24
            a, b = idx[m['from']], idx[m['to']]
            x1, x2 = lane_x(a), lane_x(b)
            d = 1 if b > a else -1
            o.append('<g><title>%s → %s：%s</title>' % (esc(P[a]['label']), esc(P[b]['label']), esc(m.get('detail', m['label']))))
            _c = '#C0392B' if m.get('red') else '#8C97A5'
            _mk = 'arrRed' if m.get('red') else 'arr'
            o.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="1.8" marker-end="url(#%s)"/>'
                     % (x1 + d * 13, my, x2 - d * 11, my, _c, _mk))
            o.append('<text x="%.1f" y="%d" font-size="10.5" fill="%s" text-anchor="%s">%s</text>'
                     % (x1 + d * 26, my - 8, '#B3403A' if m.get('red') else '#2F3844',
                        'start' if d > 0 else 'end', esc(m['label'])))
            o.append('<circle cx="%.1f" cy="%d" r="9" fill="#fff" stroke="%s" stroke-width="1.6"/>'
                     '<text x="%.1f" y="%d" font-size="8" font-weight="700" fill="%s" text-anchor="middle">%s</text>'
                     % (x1, my, P[a]['color'], x1, my + 3, P[a]['color'], m.get('id', 'E%d' % (si + 1))))
            o.append('</g>')

    # ---- 回退 / 循环 ----
    for lp in spec.get('loops', []):
        a, b = lp['from'], lp['to']
        i = idx[lp['actor']]
        ya = rows[a][0] + 16
        yb = rows[b][0] + 40
        if i == 0:
            x, sx, ex = 145, cx[i] - 96, cx[i] - 20
        else:
            x, sx, ex = cx[i] + lane * 0.42, cx[i] + 96, cx[i] + 20
        o.append('<g><title>%s</title><path d="M %.1f %d L %.1f %d L %.1f %d L %.1f %d" fill="none" stroke="%s" '
                 'stroke-width="1.4" stroke-dasharray="5 4" marker-end="url(#arrLoop)"/>'
                 '<text x="%.1f" y="%d" font-size="10" fill="%s" text-anchor="start">%s</text></g>'
                 % (esc(lp['label']), sx, ya, x, ya, x, yb, ex, yb,
                    LOOP, x + 7, (ya + yb) / 2 - 2, LOOP, esc(lp['label'])))

    o.append('</svg>')
    return ''.join(o)


def legend(spec):
    parts = ''.join('<span class="li"><i class="sw" style="background:%s;border-color:%s"></i>%s</span>'
                    % (p['color'], p['color'], esc(p['label'])) for p in spec['participants'])
    return ('<div class="seq2-legend">%s</div>'
            '<div class="seq2-legend"><span class="li"><i class="ln"></i>消息方向</span>'
            '<span class="li"><i class="ci">E</i>事件起点</span>'
            '<span class="li"><i class="sw" style="background:#fff;border-color:#8C97A5"></i>本地动作</span>'
            '<span class="li"><i class="sw" style="background:%s;border-color:%s"></i>需人裁定</span>'
            '<span class="li"><i class="ln dash"></i>回退 / 换方向</span></div>' % (parts, GOLD, GOLD))


def seq_slide(spec, sub, cond, pos, key):
    body = ('<div class="seq2">'
            '<div class="seq2-main">' + render(spec) + '</div>'
            '<aside class="seq2-rail">'
            '<div class="sr-i"><div class="sr-k">出现条件</div><div class="sr-v">%s</div></div>'
            '<div class="sr-i"><div class="sr-k">人的位置</div><div class="sr-v">%s</div></div>'
            '<div class="sr-i"><div class="sr-k">关键交接</div><div class="sr-v">%s</div></div>'
            '<div class="sr-lg">%s</div>'
            '<div class="sr-note">阶段带与“人主导 / AI 主导”由事件顺序推导</div>'
            '</aside></div>' % (cond, pos, key, legend(spec)))
    return slide(body, spec['title'], sub, 2)


# ================= 形态一 =================
DEV, AIA, DOC, ENV = ('dev', 'ai', 'doc', 'env')
P4 = [{'id': DEV, 'label': '开发者', 'color': HUMAN},
      {'id': AIA, 'label': 'AI Agent', 'color': AI},
      {'id': DOC, 'label': '资料与文档', 'color': SRC},
      {'id': ENV, 'label': '运行环境', 'color': TOOL}]


def M(f, t, label, detail='', red=False):
    return {'from': f, 'to': t, 'label': label, 'detail': detail or label, 'red': red}


Q1 = seq_slide({
    'title': '每轮都看：人写文档、AI 出初版，一轮一轮改',
    'participants': P4,
    'phases': [(0, 0, '01 提出目标', 'human'), (1, 1, '02 备上下文', 'human'),
               (2, 2, '03 AI 执行', 'ai'), (3, 4, '04 人工审查', 'human'),
               (5, 5, '05 验证与回写', 'human')],
    'steps': [
        {'node': {'actor': DEV, 'kind': 'action', 'title': '写详细设计文档',
                  'detail': '框架限定死，细节写到大差不差；把 API 链接一起写进去'},
         'msgs': [M(DEV, AIA, '给目标 + 设计文档', '人把任务写成 AI 能直接执行的形式')]},
        {'msgs': [M(DEV, DOC, '查 API 与官方优化思路'),
                  M(DEV, AIA, '贴链接与示例，不让它猜')]},
        {'node': {'actor': AIA, 'kind': 'action', 'title': '读仓库、跑命令、出初版',
                  'detail': '约 1 天出初版，精度可能过、性能不达标'},
         'msgs': [M(AIA, ENV, '读文件、跑命令'), M(AIA, DEV, '返回初版 + 改动说明')]},
        {'node': {'actor': DEV, 'kind': 'decision', 'title': '该不该喊停？',
                  'detail': '看 thought 判断是否在无效尝试；这是依赖经验的判断'},
         'msgs': [M(AIA, DEV, 'thought：全是无效尝试'), M(DEV, AIA, '引用代码段，指出问题')]},
        {'node': {'actor': DEV, 'kind': 'action', 'title': '通读 diff、清理封装',
                  'detail': '"AI 喜欢做无效封装、定义变量传来传去"——清理常要额外一天'},
         'msgs': [M(DEV, ENV, '跑 golden / baseline'), M(ENV, DEV, '指标与日志')]},
        {'node': {'actor': DEV, 'kind': 'action', 'title': '回写设计文档',
                  'detail': '让 AI 反过来改最初那份详设，作为下次任务的上下文'},
         'msgs': [M(DEV, DOC, '更新详设，沉淀为下次上下文')]},
    ],
}, '人机协作 · 形态一（王伟、郑雨豪、梁淼城）',
    '环境在本机（IDE 打开仓库，AI 能直接改文件、跑命令）；要改的是<b>结构与设计</b>，对错没有现成判据，所以人必须每轮看。',
    '<b>每一轮都在</b>：审查与执行交替，靠"引用代码段 + 看 thought"这类细粒度信号介入。',
    '给设计文档 → 贴 API 链接 → 引用代码段指出问题')


# ================= 形态二 =================
Q2 = seq_slide({
    'title': '交给它跑：一句话目标，AI 在服务器上自己跑自己改',
    'participants': P4,
    'phases': [(0, 0, '01 给目标', 'human'), (1, 1, '02 接环境', 'ai'),
               (2, 3, '03 自循环', 'ai'), (4, 4, '04 稀疏查看', 'human'), (5, 5, '05 终审', 'human')],
    'steps': [
        {'node': {'actor': DEV, 'kind': 'action', 'title': '只给目标与验收',
                  'detail': '不写详设："让脚本跑通并通过"'},
         'msgs': [M(DEV, AIA, '让脚本跑通并通过')]},
        {'node': {'actor': AIA, 'kind': 'action', 'title': '接服务器、起后台任务',
                  'detail': '毕方直连服务器；或 SSH + nohup，每 5 分钟看一次'},
         'msgs': [M(AIA, ENV, 'SSH + nohup / 直连')]},
        {'msgs': [M(AIA, ENV, '跑一轮任务'), M(ENV, AIA, '返回日志与结果')]},
        {'node': {'actor': AIA, 'kind': 'action', 'title': '自动修正后重跑',
                  'detail': '读服务器返回、自己改、再跑，循环到通过为止'},
         'msgs': [M(AIA, ENV, '改完再跑')]},
        {'node': {'actor': DEV, 'kind': 'decision', 'title': '方向不对？',
                  'detail': '输出方向不像业务要的，就改提示词或换工具'},
         'msgs': [M(DEV, AIA, '改提示词 / 换工具')]},
        {'node': {'actor': DEV, 'kind': 'action', 'title': '自己再手跑一遍',
                  'detail': '编译通过 + pass 标志 + 源代码，再人工跑一次'},
         'msgs': [M(DEV, ENV, '手跑验证'), M(DEV, AIA, '通过 / 驳回')]},
    ],
    'loops': [{'from': 3, 'to': 2, 'actor': AIA, 'label': '自循环'}],
}, '人机协作 · 形态二（彭椒、徐立桂）',
    '任务有<b>机器可判定的终点</b>（测试 pass / benchmark 对 baseline）；AI 能自己触达环境；单轮跑很久，人没必要盯。',
    '<b>只在两端</b>：给目标、做终审。中间过程看不到，"生成慢、容易挂、界面拥挤"都在这一段被放大。',
    '给目标 → 改提示词或换工具 → 通过 / 驳回')


# ================= 形态三 =================
Q3 = seq_slide({
    'title': '先试方向：先让它跑个小实验，再决定要不要真做',
    'participants': P4,
    'phases': [(0, 0, '01 读与想', 'human'), (1, 1, '02 写个小实验', 'human'),
               (2, 2, '03 快验', 'ai'), (3, 3, '04 判方向', 'human'),
               (4, 5, '05 细化与回写', 'human')],
    'steps': [
        {'node': {'actor': DEV, 'kind': 'action', 'title': '读论文、想方法',
                  'detail': '也和导师、同事讨论；这一步没有 AI 参与'},
         'msgs': [M(DEV, DOC, '查论文 / 仓库 / 源码')]},
        {'node': {'actor': DEV, 'kind': 'action', 'title': '决定先验一下',
                  'detail': '方向不确定，但验证成本很低'},
         'msgs': [M(DEV, AIA, '先写个最小版本试试')]},
        {'node': {'actor': AIA, 'kind': 'action', 'title': '跑小实验（10 分钟内）',
                  'detail': '"验证不是很准确，但大方向不会差"'},
         'msgs': [M(AIA, ENV, '跑最小实验'), M(ENV, DEV, '返回结果')]},
        {'node': {'actor': DEV, 'kind': 'decision', 'title': '方向成立吗？',
                  'detail': '必须由人裁定；模型给不了这个判断'}},
        {'msgs': [M(DEV, AIA, '可行 → 细化机制'), M(AIA, ENV, '跑完整实验 / 建骨架')]},
        {'node': {'actor': DEV, 'kind': 'action', 'title': '写回文档',
                  'detail': '结论回论文 / markdown / 团队 wiki'},
         'msgs': [M(DEV, DOC, '结论写回资料')]},
    ],
    'loops': [{'from': 3, 'to': 0, 'actor': DEV, 'label': '不可行 → 换方向'}],
}, '人机协作 · 形态三（王鹤锦、梁淼城、徐立桂）',
    '方向本身不确定（选题、方法可行性），而验证成本很低——<b>小实验 10 分钟就能看出大方向</b>，所以值得先试再定。',
    '<b>在方向判断上</b>：AI 承担低成本试错，不替你决定做什么。方向一旦确定，就切回前两种做法。',
    '方向判断是唯一不可让渡的交接')
