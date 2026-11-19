# -*- coding: utf-8 -*-
"""四段用户旅程的渲染器与内容（沿用 ai-user-journey 的视觉语法：灰色箭头阶段、五泳道、圆形触点、红色只表痛点、连线式情绪曲线）。"""

ICONS = {
    'calendar': '<rect x="5" y="6" width="14" height="14" rx="2"/><path d="M8 4v4M16 4v4M5 11h14"/>',
    'bulb': '<path d="M9 17h6M10 20h4M8 14a7 7 0 1 1 8 0l-1 2H9z"/>',
    'search': '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    'chat': '<path d="M20 12a8 8 0 0 1-8 8 9 9 0 0 1-4-.9L4 20l1.3-4A8 8 0 1 1 20 12Z"/>',
    'desktop': '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8m-4-4v4"/>',
    'users': '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2 19c0-4 3-6 6-6s6 2 6 6M13 15c1-2 3-3 5-3 3 0 5 2 5 6"/>',
    'check': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 12 3.5 3.5L17 8"/>',
    'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    'document': '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    'tools': '<circle cx="7" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><path d="m9 9 6 6M17 3v6m-3-3h6M3 17h8m-4-4v8"/>',
    'chart': '<path d="M3 21h18M5 18l5-6 4 3 6-9"/><path d="M17 6h3v3"/>',
    'signup': '<path d="M13 5H5v15h14v-9M10 13l9-9 2 2-9 9-4 1z"/>',
    'link': '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-2 2M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l2-2"/>',
    'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>',
    'mobile': '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 19h2"/>',
    'handshake': '<path d="m2 9 5-4 5 2 5-2 5 4-5 8-3-2-3 2-4-2zM7 13l4 4m-1-8 3 3m0 0 3-2"/>',
    'lock': '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    'refresh': '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
}


def _svg_icon(name):
    return ('<svg viewBox="0 0 24 24" aria-hidden="true">%s</svg>' % ICONS.get(name, ICONS['chat']))


def _label_pos(node):
    x, y = node['x'], node['y']
    ly = node.get('ly')
    lx = node.get('lx')
    if lx is None:
        lx = max(0.4, x - 4.2)
    if ly is None:
        ly = y - 52 if y < 100 else y + 30
    return lx, ly


def _curve(nodes):
    pts = [(n['x'] * 10, n['y']) for n in nodes]
    d = 'M %.1f %.1f' % pts[0]
    for i in range(1, len(pts)):
        x0, y0 = pts[i - 1]
        x1, y1 = pts[i]
        xm = (x0 + x1) / 2
        d += ' C %.1f %.1f, %.1f %.1f, %.1f %.1f' % (xm, y0, xm, y1, x1, y1)
    return d


def render_journey(j, theme='task'):
    """theme: task(青) / learn(橙)"""
    cls = 'jd' + (' learn' if theme == 'learn' else '')
    # 阶段
    stages = ''.join('<div class="jd-stage">%s</div>' % s for s in j['stages'])
    # 活动 / 思考
    acts = ''.join('<div class="jd-cell">%s</div>' % a for a in j['acts'])
    thinks = ''.join('<div class="jd-cell q">%s</div>' % t for t in j['thinks'])
    # 触点
    nodes = [n for grp in j['nodes'] for n in grp]
    svg = '<path class="lk" d="%s"/>' % _curve(nodes)
    for n in nodes:
        if n.get('red'):
            svg += '<path class="vd" d="M %.1f 0 V 265"/>' % (n['x'] * 10)
    tps, tls = [], []
    for n in nodes:
        extra = ' red' if n.get('red') else ''
        tps.append('<div class="jd-tp%s" style="left:%.2f%%;top:%.2f%%">%s</div>'
                   % (extra, n['x'], n['y'] / 265 * 100, _svg_icon(n['icon'])))
        lx, ly = _label_pos(n)
        tls.append('<div class="jd-tl" style="left:%.2f%%;top:%.2f%%;width:%dpx">%s</div>'
                   % (lx, ly / 265 * 100, n.get('w', 132), n['t']))
    # 情绪
    ems = sorted(j['emotions'], key=lambda e: e['x'])
    pts = ' '.join('%.1f,%.1f' % (e['x'] * 10, e['y']) for e in ems)
    chart = '<polyline class="ln" points="%s"/>' % pts
    for e in ems:
        if e.get('pain'):
            e['y'] = min(e['y'], 202)
            chart += '<path class="ds" d="M %.1f 0 V %.1f"/>' % (e['x'] * 10, e['y'])
    dots, els = [], []
    for e in ems:
        dots.append('<span class="jd-dot%s" style="left:%.2f%%;top:%.2f%%"></span>'
                    % (' red' if e.get('pain') else '', e['x'], e['y'] / 252 * 100))
        if e.get('pain'):
            ly = min(e['y'] + 9, 213)
        elif e['y'] < 90:
            ly = e['y'] - 42
        else:
            ly = e['y'] + 7
        w = e.get('w', 148)
        left = max(0.2, e['x'] - (w / 2) / 14.6)
        left = min(left, 99.6 - w / 14.6)
        cls2 = 'jd-em' + (' pain' if e.get('pain') else '') + (' c' if e.get('c') else '')
        els.append('<div class="%s" style="left:%.2f%%;top:%.2f%%;width:%dpx">%s</div>'
                   % (cls2, left, ly / 252 * 100, w, e['t']))

    return '''<div class="%s">
  <div class="jd-rail"><div>阶段</div><div>开发活动</div><div>思考与疑问</div><div><span>操作与交互</span><span class="sm">（触点）</span></div><div>体验感受</div></div>
  <div class="jd-body">
    <div class="jd-stages">%s</div>
    <div class="jd-row">%s</div>
    <div class="jd-row">%s</div>
    <div class="jd-doing"><div class="jd-seg"><div></div><div></div><div></div><div></div><div></div></div><svg class="jd-svg" viewBox="0 0 1000 265" preserveAspectRatio="none" aria-hidden="true">%s</svg>%s%s</div>
    <div class="jd-feel"><svg class="jd-chart" viewBox="0 0 1000 252" preserveAspectRatio="none" aria-hidden="true">%s</svg>%s%s</div>
  </div>
</div>''' % (cls, stages, acts, thinks, svg, ''.join(tps), ''.join(tls), chart, ''.join(dots), ''.join(els))


def N(x, y, icon, t, red=False, w=132):
    return {'x': x, 'y': y, 'icon': icon, 't': t, 'red': red, 'w': w}


def E(x, y, t, pain=False, w=150, c=True):
    return {'x': x, 'y': y, 't': t, 'pain': pain, 'w': w, 'c': c}


# ============ J1 高校学生 · 开发 ============
J_S_DEV = {
    'stages': ['01 定题与目标', '02 找资料与环境', '03 让 AI 出方案', '04 运行验证与纠偏', '05 交付与沉淀'],
    'acts': [
        '从课题 / 实习 / 作业里切出一个能做的任务，先读论文或别人仓库',
        '申请算力（CANN Lab / 租卡 / 实验室服务器），装 CANN、跑通样例',
        '让 AI 解释目标仓库、估代码量、画架构图；确认后先建空骨架',
        '跑 benchmark / 写个小实验，对 baseline；跑偏就回滚上一版重来',
        '交 demo / 论文结果，把对话与结论整理进 Obsidian',
    ],
    'thinks': [
        '做到什么程度算完成？<br>导师要结果还是要方法？',
        '环境在这台机器对不对？<br>有卡吗、版本匹配吗？',
        '它估的代码量准吗？<br>这一层要不要我自己写？',
        '是代码错、环境错，<br>还是我 prompt 没说清？',
        '这套东西下次还能复现吗？<br>我真的学会了吗？',
    ],
    'nodes': [
        [N(4.2, 62, 'target', '读论文 / 仓库<br>切出可做的任务'),
         N(13.2, 124, 'users', '和导师、同门<br>对齐范围'),
         N(8.8, 204, 'document', '目标宽泛<br>没有可验证的完成标准', True)],
        [N(22.2, 62, 'desktop', '申请算力、装 CANN<br>先跑通样例'),
         N(31.2, 124, 'link', '查版本与环境<br>官方文档 / issue'),
         N(28.8, 204, 'tools', '申请不到资源<br>环境在远程，Agent 接不上', True)],
        [N(42.2, 62, 'bulb', '让 AI 解释仓库<br>给方案与架构图'),
         N(51.2, 124, 'signup', '确认方向后<br>先建一个空骨架'),
         N(48.8, 204, 'chat', '过度设计、跑偏<br>冒出一堆一行函数', True)],
        [N(62.2, 62, 'desktop', '跑 benchmark<br>对比 baseline'),
         N(71.2, 124, 'search', '看报错日志<br>交给 AI 定位'),
         N(68.8, 204, 'tools', '缺错误样例<br>中文线索要自己搜', True)],
        [N(82.2, 62, 'chart', '整理结果<br>写进报告 / 论文'),
         N(91.2, 124, 'document', '把对话与结论<br>整理成 markdown'),
         N(88.8, 204, 'chat', '经验散在对话里<br>下次要重新问一遍', True)],
    ],
    'emotions': [
        E(2.5, 70, '从课题里找到一个<br>能做的事'), E(8.8, 206, '目标太宽，<br>不知道做到哪算完', True),
        E(16, 120, '对齐之后<br>范围清楚一些'), E(22.5, 58, '拿到环境，<br>看到跑通的样例'),
        E(28.8, 208, '没卡、没权限、<br>版本对不上', True), E(36, 110, '靠文档和 issue<br>凑出可用环境'),
        E(42.5, 60, 'AI 很快给出<br>结构和方案'), E(48.8, 210, '过度设计、<br>方向越走越偏', True),
        E(56, 120, '回滚上一版<br>重新引导'), E(62.5, 55, '第一版结果<br>接近 baseline'),
        E(68.8, 206, '报错查不到<br>只能自己搜中文', True), E(76, 115, '改对了，<br>指标有提升'),
        E(82.5, 52, '结果能写进<br>报告 / 论文'), E(88.8, 208, '对话散落，<br>下次难复现', True),
        E(96, 130, '整理成 md<br>心里有点底'),
    ],
}

# ============ J2 高校学生 · 学习 ============
J_S_LEARN = {
    'stages': ['01 卡点或起意', '02 找可信资料', '03 让 AI 讲与追问', '04 自己动手写', '05 复现与沉淀'],
    'acts': [
        '论文 / 项目里遇到不懂的机制，或想系统学一个框架',
        '翻论文、GitHub、官方文档；找不到就租卡实测',
        '让 AI 讲架构、列技术点、写一份分天学习规划',
        '按规划自己写代码，一天一个点；AI 只答疑',
        '复述 / 复现一遍，把笔记放进 Obsidian',
    ],
    'thinks': [
        '该从哪开始？<br>我要"了解"还是"会做"？',
        '这份资料可信吗？<br>版本对不对？',
        '它是真懂还是在编？<br>我能用自己的话讲出来吗？',
        '为什么我写不出来？<br>是没懂还是不会调？',
        '不看 AI 我还能做出来吗？',
    ],
    'nodes': [
        [N(4.2, 62, 'bulb', '遇到不懂的机制<br>或想系统学框架'),
         N(13.2, 124, 'chat', '问 AI：这东西<br>到底怎么跑起来的'),
         N(8.8, 204, 'target', '不知道从哪开始<br>没有学习路线', True)],
        [N(22.2, 62, 'document', '翻论文、官方文档<br>和源码'),
         N(31.2, 124, 'search', '搜第三方解释<br>CSDN / 知乎'),
         N(28.8, 204, 'link', '资料口径不一致<br>版本对不上', True)],
        [N(42.2, 62, 'chat', '让 AI 讲架构<br>列技术点'),
         N(51.2, 124, 'signup', '让 AI 写规划<br>一天实现一个点'),
         N(48.8, 204, 'document', '讲解抽象、编函数名<br>听着懂、写不出', True)],
        [N(62.2, 62, 'desktop', '自己写代码<br>AI 只答疑'),
         N(71.2, 124, 'tools', '跑不通就调<br>看报错'),
         N(68.8, 204, 'search', '排错被 AI 代劳<br>自己 debug 能力没长', True)],
        [N(82.2, 62, 'check', '复述 / 复现<br>确认学会了'),
         N(91.2, 124, 'document', '笔记进 Obsidian<br>做非侵入索引'),
         N(88.8, 204, 'chat', '知识仍是单点<br>没有连成网', True)],
    ],
    'emotions': [
        E(2.5, 66, '想学点真东西'), E(8.8, 206, '不知道从哪下手', True),
        E(16, 120, 'AI 给了个起点'), E(22.5, 58, '找到论文和源码'),
        E(28.8, 208, '资料互相矛盾', True), E(36, 108, '决定信代码、信实测'),
        E(42.5, 54, 'AI 讲得挺清楚'), E(48.8, 210, '听懂了，但写不出', True),
        E(56, 118, '换个例子再问'), E(62.5, 60, '自己写出第一段'),
        E(68.8, 206, '报错卡住，AI 直接<br>把答案给了', True), E(76, 112, '照着改了，能跑'),
        E(82.5, 50, '能复现，有点成就感'), E(88.8, 208, '过几天又忘了', True),
        E(96, 132, '记了笔记，心里没底'),
    ],
}

# ============ J3 企业工程师 · 开发 ============
J_E_DEV = {
    'stages': ['01 需求与设计文档', '02 预置 API 与上下文', '03 AI 出初版', '04 精度 / 性能审查', '05 验收与文档回写'],
    'acts': [
        '接需求单，写详细设计文档：框架限定死，细节写到大差不差',
        '把要用的 API 文档 / 链接放进详设，避免 AI 猜接口',
        'Cursor 生成初版；通读代码，用引用功能指出问题',
        '精度对 CPU golden、性能对 baseline；清理无效封装',
        '过测试标准；把改动反过来写回设计文档',
    ],
    'thinks': [
        '这次验收标准是什么？<br>精度 / 性能阈值写清了吗？',
        '多个 API 怎么配合？<br>文档里没说怎么办？',
        '这一版是"能跑"<br>还是"能交付"？',
        '精度调不通，是在试错<br>还是在左右脑互搏？',
        'committer 看得过来吗？<br>以后我还维护得动吗？',
    ],
    'nodes': [
        [N(4.2, 62, 'target', '接需求单<br>拆到可实现的粒度'),
         N(13.2, 124, 'document', '写详细设计文档<br>几百字小作文'),
         N(8.8, 204, 'target', '需求模糊<br>只拿到 10% 完成度的版本', True, 150)],
        [N(22.2, 62, 'link', '把 API 链接<br>贴进详设'),
         N(31.2, 124, 'document', '补版本、约束<br>与测试要求'),
         N(28.8, 204, 'tools', '单个 API 有文档<br>API 之间怎么配合没有', True, 150)],
        [N(42.2, 62, 'signup', 'AI 出初版代码'),
         N(51.2, 124, 'search', '通读代码<br>引用片段反馈'),
         N(48.8, 204, 'chat', '精度调不通<br>开始左右脑互搏', True)],
        [N(62.2, 62, 'chart', '对 golden 看最大 /<br>平均相对误差'),
         N(71.2, 124, 'desktop', '采 baseline<br>比性能'),
         N(68.8, 204, 'tools', '能跑但性能不达标<br>清封装又花一天', True)],
        [N(82.2, 62, 'check', '过测试标准<br>提 PR'),
         N(91.2, 124, 'users', 'committer 检视<br>大工程要拆多个 PR'),
         N(88.8, 204, 'document', '代码可读性差<br>交接只能让 AI 再读一遍', True, 150)],
    ],
    'emotions': [
        E(2.5, 64, '需求清楚，能开工'), E(8.8, 206, '文档写不细，<br>AI 就只给 10%', True),
        E(16, 118, '把框架定死，有底了'), E(22.5, 56, 'API 链接备齐'),
        E(28.8, 208, '组合用法没人写过', True), E(36, 110, '只能靠试'),
        E(42.5, 52, '一天出初版，挺快'), E(48.8, 210, '精度不通，开始互搏', True),
        E(56, 116, '看 thought，喊停'), E(62.5, 58, '精度过了'),
        E(68.8, 206, '性能不达标 + 代码冗余', True), E(76, 112, '清理完结构，踏实'),
        E(82.5, 50, '过测试，可以提'), E(88.8, 208, '检视不动，只能拆 PR', True),
        E(96, 130, '回写文档，沉淀下来'),
    ],
}

# ============ J4 企业工程师 · 学习 ============
J_E_LEARN = {
    'stages': ['01 任务卡住', '02 找内部资料与人', '03 用 AI 补与试', '04 在任务里验证', '05 写成 wiki / Skill'],
    'acts': [
        '需求 / 问题单里遇到新场景，被任务逼着学',
        '先看内部代码、wiki、设计文档，再问组内专家',
        '把资料丢给 AI 让它读 / 解释，或直接问 AI',
        '在真实任务里改一版、跑一遍，看结果对不对',
        '写进个人 wiki，或做成团队 Skill',
    ],
    'thinks': [
        '这个知识是"要会用"<br>还是"要知道为什么"？',
        '内部资料 AI 拿不到，<br>怎么补？',
        '它答的是通用经验，<br>还是我们这套系统？',
        '跑通了，就算学会了吗？',
        '业务一迭代，<br>这套经验还成立吗？',
    ],
    'nodes': [
        [N(4.2, 62, 'target', '新需求 / 新错误<br>旧经验不够用'),
         N(13.2, 124, 'chat', '先问 AI<br>快速问个概念'),
         N(8.8, 204, 'target', '任务压着<br>没时间系统学', True)],
        [N(22.2, 62, 'document', '翻内部代码<br>wiki / 设计文档'),
         N(31.2, 124, 'users', '问组内专家<br>要一条方向'),
         N(28.8, 204, 'lock', '黄区资料 AI 拿不到<br>只能靠人', True)],
        [N(42.2, 62, 'bulb', '把资料交给 AI<br>帮读、帮解释'),
         N(51.2, 124, 'search', '追问原理<br>要一份总结'),
         N(48.8, 204, 'document', 'AI 用旧经验答<br>照它改必错', True)],
        [N(62.2, 62, 'desktop', '在任务里改一版<br>跑一遍'),
         N(71.2, 124, 'tools', '看结果 / 日志<br>对不上再调'),
         N(68.8, 204, 'search', '试错被跳过<br>只记得"大概怎么回事"', True, 150)],
        [N(82.2, 62, 'document', '写成个人 wiki<br>或团队 Skill'),
         N(91.2, 124, 'users', '讲给同事<br>检验自己懂没懂'),
         N(88.8, 204, 'refresh', '业务一迭代<br>Skill 就过期', True)],
    ],
    'emotions': [
        E(2.5, 68, '新任务，有点兴奋'), E(8.8, 206, '时间紧，只能现学现卖', True),
        E(16, 122, '先问 AI 顶一下'), E(22.5, 60, '找到内部代码'),
        E(28.8, 208, '关键资料 AI 看不到', True), E(36, 112, '找人问到了方向'),
        E(42.5, 54, 'AI 讲得比文档清楚'), E(48.8, 210, '它答的是通用经验', True),
        E(56, 116, '拿真实代码去对'), E(62.5, 56, '改完跑通了'),
        E(68.8, 206, '只是能跑，原理说不清', True), E(76, 110, '再问一遍为什么'),
        E(82.5, 50, '沉淀成 wiki / Skill'), E(88.8, 208, '下次迭代又要重来', True),
        E(96, 132, '至少这次记住了'),
    ],
}
