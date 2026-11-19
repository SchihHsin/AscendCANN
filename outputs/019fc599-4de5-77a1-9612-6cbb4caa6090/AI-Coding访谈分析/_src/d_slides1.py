# -*- coding: utf-8 -*-
from d_journey import render_journey, J_S_DEV, J_S_LEARN, J_E_DEV, J_E_LEARN

TABS = ['01 过程', '02 发现', '03 汇总', '04 设计']


def head(title, sub, ch):
    tabs = ''.join('<span class="%s">%s</span>' % ('active' if i == ch else '', t) for i, t in enumerate(TABS))
    return ('<div class="head"><div class="head-l"><div class="brand"><span class="ttl">%s</span></div>'
            '<div class="subttl">%s</div></div><div class="section-tabs" aria-label="当前章节">%s</div></div>'
            % (title, sub, tabs))


def slide(body, title, sub, ch, cls='s-gray', area_cls='body-area'):
    foot = ('<div class="pfoot"><span>AI Coding 用户访谈分析 · 6 位受访者 · 开发与学习双场景</span></div>')
    return ('<section class="slide %s">%s<div class="%s">%s</div>%s</section>'
            % (cls, head(title, sub, ch), area_cls, body, foot))


# ---------------- S1 封面 ----------------
S1 = '''<section class="slide s-cover">
  <div class="cv-bg"></div>
  <div class="cv-content">
    <div class="cv-top">
      <div class="cv-huawei"><svg class="petal" viewBox="0 0 24 24" fill="#E60012"><path d="M12 2c-1 4-3 6-6 7 3 1 5 3 6 7 1-4 3-6 6-7-3-1-5-3-6-7z"/></svg>HUAWEI</div>
      <div class="cv-meta">Ascend · Developer Experience</div>
    </div>
    <div class="cv-center">
      <div class="cv-kicker">AI CODING · USER RESEARCH</div>
      <div class="cv-logo"><img src="cann-dark-logo.svg" alt="CANN"></div>
      <div class="cv-sub">AI Coding 用户访谈分析</div>
      <div class="cv-lead">6 位开发者 · 开发与学习两种场景 · 从任务理解、上下文准备、代码实现到验证与沉淀的过程回放</div>
    </div>
    <div class="cv-bot">
      <div class="cv-ucd"><span class="sq"></span>USER RESEARCH</div>
      <div class="cv-meta">2026 · 内部研究</div>
    </div>
  </div>
</section>'''

# ---------------- S2 目录 ----------------
def _card(no, name, en, items, note, cls, pages=''):
    its = ''.join('<span>%s</span>' % i for i in items)
    return ('<article class="directory-card %s"><div class="directory-no">%s</div><h2 class="directory-name">%s</h2>'
            '<div class="directory-en">%s</div><div class="directory-range">%s</div><div class="directory-items">%s</div>'
            '<div class="directory-note">%s</div></article>' % (cls, no, name, en, pages, its, note))


S2 = '''<section class="slide s-gray contents-slide">
  <div class="head"><div class="head-l"><div class="brand"><span class="ttl">目录</span></div></div></div>
  <div class="body-area"><div class="contents-directory contents-4">
  %s
  </div></div>
</section>''' % ''.join([
    _card('01', '过程', 'Process &amp; Evidence', ['材料与边界', '两张画像', '四段旅程', '三张时序图'], '先看我们是怎么看到的', 'research', 'P1–14'),
    _card('02', '发现', 'Findings', ['前提 / 交办 / 执行', '验收 / 出错 / 沉淀', '贯穿全程的四条'], '22 条，沿任务链条排', 'persona', 'P15–36'),
    _card('03', '汇总', 'Synthesis', ['现象与问题地图', '五条核心'], '把 22 条收敛成一张图', 'competitor', 'P37–38'),
    _card('04', '设计', 'Design', ['价值 × 成本', '边界与缺口'], '从发现推到可行动', 'roadmap', 'P39–40'),
])

# ---------------- S3 受访者矩阵 ----------------
_rows = [
    ('e', '王伟', '企业', '昇腾计算基础软件开发部工程师', '算子从 0 开发', 'Cursor · Grok · Trae', 'IDE', '5 个月 · 每天', '人工审查约 70%，与 AI 执行交替'),
    ('e', '郑雨豪', '企业', '昇腾计算基础软件开发部工程师', '算子开发', 'Cursor · Trae', 'IDE', '半年 · 每天', '一直不太信任，做完必查'),
    ('e', '彭椒', '企业', '实验室 / 测试工程师', '修测试脚本并跑通', 'OpenCode · TestAgent · 毕方', 'CLI · 网页', '2023 起 · 每天', '毕方直连服务器自动循环修正'),
    ('s', '徐立桂', '学生', '南京大学 · 研二', '算子生成 + 昇腾知识图谱', 'Codex · OpenCode', '客户端 · CLI', '半年+ · 每天', '一个窗口实现、一个窗口验收'),
    ('s', '梁淼城', '学生', '南京大学 · 大四', '后端 Demo，改开源仓库', 'Codex · Claude Code', '客户端 · CLI', '1–1.5 年 · 每天', '过度设计是最痛的点'),
    ('s', '王鹤锦', '学生', '杭州电子科大 · 研三', '无人机跨视角定位', 'Claude Code · DeepSeek', 'CLI · 网页', '2022 起 · 每天', '额度不够，多 Agent 用不起'),
]
_tr = ''.join(
    '<tr><td><div class="who%s"><span class="bar"></span>%s</div><div class="chip %s" style="margin-top:.45em"><i></i>%s</div></td>'
    '<td>%s</td><td class="task">%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'
    % (' e' if g == 'e' else '', n, 'emp' if g == 'e' else 'stu', tag, role, task, tools, entry, dur, note)
    for g, n, tag, role, task, tools, entry, dur, note in _rows)

S3 = slide('''
<table class="mtx">
<colgroup><col style="width:15%"><col style="width:19%"><col style="width:16%"><col style="width:16%"><col style="width:9%"><col style="width:11%"><col style="width:14%"></colgroup>
<thead><tr><th>受访者</th><th>身份</th><th>最近一次任务</th><th>主要工具</th><th>入口</th><th>时长 · 频率</th><th>标志性细节</th></tr></thead>
<tbody>@@TR@@</tbody></table>
<div style="margin-top:2.2vh;display:flex;gap:1.4vw;align-items:flex-start">
  <div class="chip mute"><i></i>6 / 6 每天使用</div>
  <div class="chip mute"><i></i>5 / 6 近期任务直接落在昇腾或算子场景</div>
  <div class="chip warn"><i></i>访谈日期、访谈者均未记录</div>
  <div style="font-size:var(--fs-sm);color:var(--ink-2);line-height:1.5">
    研究目的：按时间还原"任务理解 → 方案形成 → 上下文准备 → 实现 → 验证 → 沉淀"，观察人、AI、资料与环境如何交替参与。<br>身份取自访谈记录；郑雨豪的记录未写身份，按用户补充归入昇腾基础软件开发部。<br>
    材料为"思维导图手记为主 + ASR 逐字稿补充"的二次整理稿；<b>口径：手记优先，ASR 只补细节，两者冲突以手记为准。</b>
  </div>
</div>'''.replace('@@TR@@', _tr), '6 位受访者：3 名学生、3 名企业工程师，全部每天使用',
    '材料与边界 · 受访者概况', 0)

# ---------------- S4 证据强度与缺口 ----------------
S4 = slide('''
<div class="ev">
  <div class="ev-left">
    <div class="ev-row"><div class="ev-k">L1</div>
      <div><div class="ev-bar s1"><span>直接支持 · 原话 + 具体事件</span></div>
      <div class="ev-note">每条结论都能落回一个可复述的动作，例如"出现很多一两行函数就知道跑偏了"（梁淼城）</div></div></div>
    <div class="ev-row"><div class="ev-k">L2</div>
      <div><div class="ev-bar l2 s2"><span>跨案例模式 · ≥3 人复现同一结构</span></div>
      <div class="ev-note">上下文前置、异常信号介入、执行证据优先、恢复靠换模型、沉淀落文件</div></div></div>
    <div class="ev-row"><div class="ev-k">L3</div>
      <div><div class="ev-bar l3 s3"><span>待验证假设 · 1–2 人 / 研究者推断</span></div>
      <div class="ev-note">成本是隐性分配器、全权限等于摩擦管理、知识应落文件、Skill 应可裁剪</div></div></div>
  </div>
  <div class="ev-right">
    <h4>必须先说明的材料缺口</h4>
    <div class="ev-gap"><b>时间比例两版冲突</b>：梁淼城"提出目标:执行:审查:沉淀"记录为 5:3:1:1，ASR 为 3:3:2:3:1:1，无法判定哪版为准。</div>
    <div class="ev-gap"><b>身份与元信息缺失</b>：郑雨豪记录未写身份；6 份记录均无访谈日期与访谈者。</div>
    <div class="ev-gap"><b>多项"未记录"</b>：梁第 3 痛点、郑任务时间分配、徐学习资源与渠道等 10 项，按未记录处理，不补全。</div>
    <div class="ev-gap"><b>全部是回顾叙述</b>：访谈不要求现场执行，未做独立核验，不能据此声称上卡成功、达到性能或完成端到端部署。</div>
  </div>
</div>''', '材料能支撑"模式"，不足以支撑"比例"', '材料与边界 · 证据强度', 0)

# ---------------- S5 双角色 ----------------
def _mir(side, rows, name, desc, quote):
    cls = 'a' if side == 's' else 'b'
    cells = ''.join('<div class="mir-cell">%s</div>' % r for r in rows)
    return ('<div class="mir-col %s"><div class="mir-head %s"><div class="n">%s</div><div class="d">%s</div></div>'
            '%s<div class="mir-q">%s</div></div>' % (cls, cls, name, desc, cells, quote))


S5 = slide('''
<div class="mir">
  %s
  <div class="mir-mid"><span>触发</span><span>完成标准</span><span>资源</span><span>知识来源</span><span>学习</span><span>交付</span></div>
  %s
</div>''' % (
    _mir('s', ['课题、论文、课程作业、实习 demo', 'benchmark 对 baseline；实验有提升；能自己复现',
               '自费额度、实验室无 root、租卡、远程环境', '论文、GitHub、官方文档、CSDN / 知乎',
               '任务触发为主，也会为"学会"刻意自己写代码', '1–2 人各做模块，没有评审压力'],
         '高校学生', '徐立桂 · 梁淼城 · 王鹤锦 ｜ 研究、课程与实习驱动的开发',
         '"一个窗口实现，一个窗口验收。" —— 徐立桂'),
    _mir('e', ['需求单、问题单、测试任务、算子开发', '精度 golden + 性能 baseline 双达标，过测试、能合入',
               '统一采购 IDE、内网 / 黄区、内部 Skill 与专家', '官方 API 文档、内部 wiki、组内专家、设计文档',
               '被动 7 : 主动 3，基本在任务里学', 'committer 检视、拆 PR、跨团队难复用'],
         '企业工程师', '王伟 · 郑雨豪 · 彭椒 ｜ 需求、指标与合入驱动的开发',
         '"人工审查跟 AI 执行是相互交叉、交替执行的过程。" —— 王伟'),
), '学生与 AI 一起探路，企业工程师把任务交办给 AI 再验收', '角色与旅程 · 双角色画像', 1)

# ---------------- S6–S9 旅程 ----------------
JOURNEYS = [
    ('学生 · 开发', 'S6', J_S_DEV, 'task',
     '学生开发：先解决环境，再解决方向，最后才是代码',
     '角色与旅程 · 高校学生 · 开发场景',
     '痛点集中在"可验证性"与"环境可控性"：目标没有验收标准、算力与版本不可控、跑偏缺判据、错误样例缺失。'),
    ('学生 · 学习', 'S7', J_S_LEARN, 'learn',
     '学生学习：听得懂不等于写得出，卡在"排错被代劳"',
     '角色与旅程 · 高校学生 · 学习场景',
     '学习由卡点触发，靠"自己写一遍"完成内化；但排错被 AI 代劳，知识仍以单点存在，最后要靠 markdown 手工沉淀。'),
    ('企业 · 开发', 'S8', J_E_DEV, 'task',
     '企业开发：一半时间写清上下文，一半时间验收 AI 的初版',
     '角色与旅程 · 企业工程师 · 开发场景',
     '详设文档与 API 链接决定初版质量；真正的成本在精度/性能审查与代码清理，交接压力落在 committer 与后续维护。'),
    ('企业 · 学习', 'S9', J_E_LEARN, 'learn',
     '企业学习：知识从任务里来，但黄区把 AI 挡在门外',
     '角色与旅程 · 企业工程师 · 学习场景',
     '学习被任务压缩成"够用就好"；内部资料 AI 拿不到，AI 退回通用经验；沉淀靠 wiki 与 Skill，但业务一迭代就过期。'),
]

_jslides = []
for i, (tag, sid, data, theme, title, sub, note) in enumerate(JOURNEYS):
    _jslides.append(slide(
        render_journey(data, theme),
        title, sub + ' · 红色 = 该阶段实际痛点，与下方红色低谷一一对应', 1))
S6, S7, S8, S9 = _jslides

