# -*- coding: utf-8 -*-
from d_slides1 import slide, S1, S2, S3, S4, S5, S6, S7, S8, S9
from d_s4 import S4
from d_s5 import S5
from d_s10 import S10
from d_s16 import S16

# ---------------- S11 时序图 ----------------
_seq = [
    ('01', '提出目标', '≈15% · 1–2 天', [
        (1, 2, 'key', '给目标 + 设计文档：框架限定死，细节写到大差不差'),
    ]),
    ('02', '备上下文', '人工整理', [
        (1, 3, '', '查 API 文档、官方优化思路'),
        (1, 2, 'key', '把链接与示例贴进详设，不让它猜接口'),
    ]),
    ('03', 'AI 执行', '≈10% · 约 1 天出初版', [
        (2, 4, 'mut', '读仓库、跑命令、改文件'),
        (2, 1, '', '返回初版 + 改动说明'),
    ]),
    ('04', '人工审查', '≈70% · 与执行交替', [
        (1, 2, 'key', '引用代码段，指出具体问题'),
        (2, 1, '', '看 thought，判断该不该喊停'),
    ]),
    ('05', '运行验证', '按需求采集', [
        (1, 4, 'mut', '跑测试 / golden / baseline'),
        (4, 1, 'mut', '回指标与日志'),
    ]),
    ('06', '回写沉淀', '随任务结束', [
        (1, 3, '', '反过来更新设计文档，作为下次的上下文'),
    ]),
]
_rows_html = ''
for no, name, note, ars in _seq:
    _ar = ''.join(
        '<div class="ar %s" style="--a:%d;--b:%d"><div class="bar"></div><div class="lb">%s</div></div>'
        % (cls, a, b + 1, lb) for a, b, cls, lb in ars)
    _rows_html += ('<div class="seq-ph"><div class="seq-no"><b>%s</b><span>%s</span><div class="seq-note">%s</div></div>'
                   '<div class="seq-arrows">%s</div></div>' % (no, name, note, _ar))

S11 = slide('''
<div class="seq">
  <div class="seq-h"><div style="background:none;box-shadow:none"></div><div class="p1">开发者</div><div class="p2">AI Agent</div><div class="p3">资料与文档</div><div class="p4">运行环境</div></div>
  <div class="seq-body"><div class="seq-lines"><i></i><i></i><i></i><i></i><i></i></div>@@ROWS@@</div>
</div>
<div style="display:flex;gap:1.2vw;margin-top:1.6vh;align-items:center">
  <div class="chip warn"><i></i>三个决定走向的交接</div>
  <div style="font-size:var(--fs-sm);color:var(--ink-2);line-height:1.45;flex:1">给设计文档 → 贴 API 链接 → 引用代码段指出问题。三者都在"人把隐性的判断写成 AI 能用的形式"，而不是"人检查 AI 的产出"。</div>
</div>'''.replace('@@ROWS@@', _rows_html),
    '真正的交接发生在 6 个时刻，其中 3 个决定任务走向', '人机协作 · 分工与交接（以企业算子开发为典型）', 2)

# ---------------- S12 信号 ----------------
_sig = [
    ('形态', '函数变短、封装变多、节点做得复杂', '梁淼城："出现很多一两行的函数的时候，我就知道肯定是（过度设计）"', 'tools'),
    ('思考', 'thought 里全是无效尝试', '王伟："点开他的 thought……发现那些尝试完全都不对，就让他终止"', 'bulb'),
    ('指标', '精度调不通、性能不达标', '王伟："精度都调不通，然后他就开始在那儿左右脑互搏"', 'chart'),
    ('语义', '输出方向不像业务要的', '彭椒："看它的输出就感觉业务方向不对，那我会去改提示词"', 'target'),
    ('环境', '无权限、网络、版本不对', '王鹤锦："只有完全没有权限的时候才会卡住"；梁淼城：CANN 版本未升级', 'lock'),
    ('意图', '模块接错、理解偏了', '王鹤锦："我说把这个模块加上去，它就把这个模块串联进去了"', 'chat'),
]
_sig_html = ''.join(
    '<div class="sig-i"><div class="ic"><svg viewBox="0 0 24 24">%s</svg></div><div class="tx"><b>%s信号</b><span>%s</span><span style="margin-top:.2em"><em>%s</em></span></div></div>'
    % (__import__('d_journey').ICONS[ic], k, d, q) for k, d, q, ic in _sig)
S12 = slide('''
<div class="sig">
  <div class="sig-grid">%s</div>
  <div class="sig-mid"><svg viewBox="0 0 24 24"><path d="M4 6h9a4 4 0 0 1 0 8H8m0 0 3-3m-3 3 3 3"/><path d="M4 18h4"/></svg><span>判断</span></div>
  <div class="sig-act">
    <div class="act"><b>补上下文</b><span>给日志、版本、示例、测试结果——最常见的接手动作</span></div>
    <div class="act"><b>重写与回滚</b><span>删掉 slop、回到上一版、重写 prompt；"航母掉头很难"</span></div>
    <div class="act"><b>换模型 / 人工接手</b><span>换更强模型再试；模型罢工则转人工排查</span></div>
  </div>
</div>
<div style="display:flex;gap:1vw;margin-top:1.8vh">
  <div class="cx-concl" style="flex:1"><span class="ck">判断门槛</span><span class="cv">"你要自己有一些知识，才知道什么时候该介入。"（王伟）——同一份代码，新手看是"能跑"，老手看是"过度设计"。</span></div>
  <div class="cx-concl" style="flex:1"><span class="ck">经验缺口</span><span class="cv">"我自己经验不足的情况下，过度设计也难判断。"（梁淼城）——信号可观察，但判据不可移植。</span></div>
</div>''' % _sig_html,
    '人不是按检查点介入，而是被 6 类信号叫停', '人机协作 · 交接触发', 2)

# ---------------- S13 验证 ----------------
def _pt(x, y, label, cls=''):
    return ('<g><circle cx="%d" cy="%d" r="7" fill="%s" stroke="#fff" stroke-width="2"/>'
            '<text x="%d" y="%d" font-size="11" fill="#3A424E" font-family="HarmonyOS Sans SC">%s</text></g>'
            % (x, y, '#B3403A' if cls == 'r' else ('#4B4BA8' if cls == 'b' else '#0E7C86'),
               x + 11, y + 4, label))

_scatter = '''<svg viewBox="0 0 520 330" preserveAspectRatio="xMidYMid meet">
  <line x1="52" y1="286" x2="500" y2="286" stroke="#AEB6C2" stroke-width="1.2"/>
  <line x1="52" y1="286" x2="52" y2="24" stroke="#AEB6C2" stroke-width="1.2"/>
  <line x1="52" y1="160" x2="500" y2="160" stroke="#D6DBE3" stroke-width="1" stroke-dasharray="3 4"/>
  <line x1="276" y1="24" x2="276" y2="286" stroke="#D6DBE3" stroke-width="1" stroke-dasharray="3 4"/>
  <text x="58" y="306" font-size="11" fill="#7C8695">工程 / 可运行即通过</text>
  <text x="500" y="306" font-size="11" fill="#7C8695" text-anchor="end">研究 / 需要可引用</text>
  <text x="60" y="20" font-size="11" fill="#7C8695">来源需求 高</text>
  <text x="60" y="278" font-size="11" fill="#7C8695">低</text>
  %s
</svg>''' % ''.join([
    _pt(115, 239, '王伟'),
    _pt(146, 258, '彭椒'),
    _pt(231, 200, '徐立桂'),
    _pt(285, 150, '王鹤锦'),
    _pt(334, 92, '梁淼城（看任务）'),
    _pt(204, 61, '郑雨豪', 'r'),
])

S13 = slide('''
<div class="lad">
  <div class="lad-l">
    <div class="step l1"><div class="no">L1</div><div class="bd"><b>执行证据：运行结果、测试通过、benchmark、golden</b>
      <p>6 / 6 首选；"我们都是通过现有工具去做验证，这个地方是没法作假的"（王伟）</p></div></div>
    <div class="step l2"><div class="no">L2</div><div class="bd"><b>代码证据：diff、公式实现、接口与模块组织</b>
      <p>视责任与规模：王伟通读并清理；郑雨豪只核公式；"几千行、可读性差，不一定能看过来"（郑雨豪）</p></div></div>
    <div class="step l3"><div class="no">L3</div><div class="bd"><b>来源证据：链接、文档、模型解释</b>
      <p>分化最大：郑雨豪"没有中间数据就认为它是编造的"；王伟"没那闲工夫"；徐立桂"越干净越好，按需点开"</p></div></div>
  </div>
  <div class="scatter">%s
    <div style="font-size:10.5px;color:var(--ink-3);line-height:1.4;margin-top:.6vh">坐标为依据访谈内容的定性定位，不是量表测量。</div>
  </div>
</div>
<div class="cx-concl" style="margin-top:1.4vh"><span class="ck">矛盾</span><span class="cv">徐立桂说"最权威的是开发包里的头文件和动态库"，但"一般情况下我不会看代码，他给我讲一下模块组织"——<b>声称的信任依据 ≠ 实际的审查行为</b>。只做"显示来源"无法解决这种落差。</span></div>''' % _scatter,
    '验证只认"离执行最近"的证据，来源需求随严谨度变化', '人机协作 · 验证与信任', 2)

# ---------------- S14 失败恢复 ----------------
_spec = [('重试', 4), ('补上下文', 4), ('重写 prompt', 3), ('换模型', 5), ('回滚上一版', 3), ('拆解任务', 2), ('换工具', 2), ('人工介入 / 放弃', 5)]
_spec_html = ''
for name, cnt in _spec:
    _spec_html += ('<div class="spec-i"><div class="n">%d</div><div class="bx" style="height:%dpx"></div>'
                   '<div class="lb">%s</div></div>' % (cnt, 26 + cnt * 17, name))
S14 = slide('''
<div style="font-size:var(--fs-sm);color:var(--ink-2);margin-bottom:.4vh">提到该策略的受访者人数（n = 6，可多选）· 按升级顺序排列</div>
<div class="spec">%s</div>
<div class="ind">
  <div class="ind-c yes"><b>徐立桂：把"拆解权"收回来，但拆完仍交给 AI</b>
    <p>"一开始我想一键生成一个 agent 框架，AI 显然搞不下去，那就只能一步步拆解任务……拆得越细，AI 执行越符合预期，因为他不用猜了。"——他不是自己写完，而是把大任务拆成 AI 接得住的小步骤。</p></div>
  <div class="ind-c no"><b>其余 5 人：把整块任务重新交回 AI</b>
    <p>梁淼城："AI 做错的时候，我肯定也做不对。"郑雨豪："不太能自己继续，大不了再买一个新账号，自费上班。"王鹤锦："一般不自己上手，就是找问题、纠正他。"</p></div>
</div>
<div class="cx-concl" style="margin-top:1.6vh"><span class="ck">推论</span><span class="cv">失败后的"恢复"不是人接管，而是<b>重新分配控制权</b>：要么换一个更强的模型，要么把任务拆到 AI 能接住。<b>可恢复性应设计成"可拆解、可回退"，而不是假设用户能独立修好</b>。</span></div>''' % _spec_html,
    '失败后没有人自己接手：5 人换模型，1 人把任务拆细再交回 AI', '人机协作 · 失败恢复', 2)

# ---------------- S15 习惯三层 ----------------
S15 = slide('''
<div class="lay">
  <div class="lay-r"><div class="lay-h"><b>明确表达</b><span>PREFERENCE · 原话</span></div>
    <div class="lay-items">
      <div class="lay-i q"><b>要可视化图解</b>（王伟、梁淼城、郑雨豪、彭椒）</div>
      <div class="lay-i q"><b>来源给链接、别展开</b>（郑雨豪要链接，徐立桂要"越干净越好"）</div>
      <div class="lay-i q"><b>流程要能裁剪</b>（郑雨豪：强制多子进程跑同数据集，跑一次就够）</div>
      <div class="lay-i q"><b>知识做成 Skill</b>（梁淼城、徐立桂）</div>
    </div></div>
  <div class="lay-r"><div class="lay-h"><b>实际做法</b><span>BEHAVIOR · 回忆</span></div>
    <div class="lay-items">
      <div class="lay-i x"><b>每天用、权限基本全开</b>（6/6；彭椒、王伟、徐立桂全开）</div>
      <div class="lay-i x"><b>多窗口 / 多会话并行</b>（王伟 2–3 个、王鹤锦、梁淼城、郑雨豪）</div>
      <div class="lay-i x"><b>翻聊天记录找信息</b>（王伟、梁淼城、郑雨豪、彭椒，3 人明说慢）</div>
      <div class="lay-i x"><b>手动另存</b>（彭椒存 IDE、徐立桂存 Obsidian、王伟回写文档）</div>
      <div class="lay-i x"><b>弱模型对话、强模型写码</b>（郑雨豪、王伟、梁淼城）</div>
    </div></div>
  <div class="lay-r"><div class="lay-h"><b>研究者解释</b><span>INFERENCE · 推断</span></div>
    <div class="lay-items">
      <div class="lay-i"><b>全权限不是信任，是减少打断成本</b>——"不然要一直点 yes"（彭椒）</div>
      <div class="lay-i"><b>多任务是默认形态，缺的是任务级视图</b>——"界面拥挤，找不到我在哪个任务"（彭椒）</div>
      <div class="lay-i"><b>沉淀发生在文件系统，不在产品里</b>——md / 设计文档 / Skill</div>
    </div></div>
</div>''' , '偏好、行为与解释要分开看：三处"说的"和"做的"并不一致', '习惯与偏好 · 三层分离', 3)

# ---------------- S16 知识流 ----------------
_loop = '''<svg viewBox="0 0 460 400" preserveAspectRatio="xMidYMid meet">
  <defs><marker id="karr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="none" stroke="#8D97A5" stroke-width="1.2"/></marker></defs>
  <circle cx="230" cy="200" r="132" fill="none" stroke="#DCE1E8" stroke-width="1" stroke-dasharray="4 5"/>
  <path d="M230 68 A132 132 0 0 1 355 145" fill="none" stroke="#8D97A5" stroke-width="1.4" marker-end="url(#karr)"/>
  <path d="M355 255 A132 132 0 0 1 230 332" fill="none" stroke="#8D97A5" stroke-width="1.4" marker-end="url(#karr)"/>
  <path d="M105 255 A132 132 0 0 1 105 145" fill="none" stroke="#8D97A5" stroke-width="1.4" marker-end="url(#karr)"/>
  <g><circle cx="230" cy="68" r="38" fill="#1F4B4A"/><text x="230" y="64" text-anchor="middle" font-size="12" fill="#fff" font-weight="600">触发</text><text x="230" y="80" text-anchor="middle" font-size="9" fill="#BFE3DF">任务卡住 / 起意</text></g>
  <g><circle cx="355" cy="200" r="38" fill="#3E4A63"/><text x="355" y="196" text-anchor="middle" font-size="12" fill="#fff" font-weight="600">检索</text><text x="355" y="212" text-anchor="middle" font-size="9" fill="#C9D2E0">论文 / 文档 / 人</text></g>
  <g><circle cx="230" cy="332" r="38" fill="#7A6A4F"/><text x="230" y="328" text-anchor="middle" font-size="12" fill="#fff" font-weight="600">可信判断</text><text x="230" y="344" text-anchor="middle" font-size="9" fill="#EADCC6">离执行多近</text></g>
  <g><circle cx="105" cy="200" r="38" fill="#2E6E6B"/><text x="105" y="196" text-anchor="middle" font-size="12" fill="#fff" font-weight="600">内化</text><text x="105" y="212" text-anchor="middle" font-size="9" fill="#BFE3DF">自己写 / 复现</text></g>
  <g><circle cx="230" cy="200" r="52" fill="rgba(255,255,255,.9)" stroke="#DCE1E8"/><text x="230" y="196" text-anchor="middle" font-size="11.5" fill="#3A424E" font-weight="600">沉淀</text><text x="230" y="212" text-anchor="middle" font-size="9" fill="#7C8695">md / 文档 / Skill</text></g>
  <path d="M282 200 L196 200" stroke="#C4693F" stroke-width="1.6" stroke-dasharray="4 4" marker-end="url(#karr)"/>
  <text x="239" y="192" text-anchor="middle" font-size="9" fill="#B3403A">下一次</text>
</svg>'''
S16 = slide('''
<div class="kl">
  <div class="kl-loop">%s</div>
  <div>
    <div style="font-size:11.4px;color:var(--ink-2);line-height:1.5;margin-bottom:1.2vh">可信度不是按"文档等级"排，而是按<b style="color:var(--ink)">离执行有多近</b>排——这是六个人各自独立给出的同一条经验。</div>
    <div class="auth">
      <div class="auth-i a1"><div class="k">1</div><div class="bx">代码 / 头文件 / 运行输出<small>"那个毕竟是代码，所以那个是最真实的"（徐立桂）</small></div></div>
      <div class="auth-i a2"><div class="k">2</div><div class="bx">官方文档与 API 说明<small>王伟：把 API 链接放进详设，别让它猜</small></div></div>
      <div class="auth-i a3"><div class="k">3</div><div class="bx">第三方加工内容（CSDN / 知乎）<small>梁淼城：官方 search 偏国外，最后在 CSDN 找到</small></div></div>
      <div class="auth-i a4"><div class="k">4</div><div class="bx">AI 生成的解释与来源<small>郑雨豪：以前给的来源"都是他自己编的"</small></div></div>
    </div>
    <div style="margin-top:1.6vh;display:flex;flex-direction:column;gap:.6vh">
      <div class="chip warn"><i></i>三种典型失真：编函数名 / 用 CUDA 思维写昇腾 / 拿旧经验套新业务</div>
      <div class="chip mute"><i></i>获取不到 ≠ 不可信：黄区、沐曦生态、昇腾版本都会让"可信源"直接消失</div>
    </div>
  </div>
</div>''' % _loop,
    '知识从"卡点"进来，靠"离执行最近"的证据站住，最后落回文件', '知识与学习 · 获取、可信与沉淀', 4)

# ---------------- S17 五条发现 ----------------
_find = [
    ('F1', '编码被压缩，"把任务写成 AI 接得住的形式"成为主战场', 'l2',
     '王伟：人工审查约 70%、写文档 15%，并用自沉淀的格式出详设；彭椒/王鹤锦：时间主要花在"提出目标"；徐立桂："拆得越细，AI 执行越符合预期"。',
     '自报时间占比，非观测；"任务写法"由四道工序归纳而来，属研究者编码。'),
    ('F2', '交接由可观察的异常信号触发，判据却不可移植', 'l2',
     '梁淼城："出现很多一两行的函数，我就知道肯定是（过度设计）"；王伟：看 thought 发现"尝试完全都不对"；徐立桂："节点搞得非常复杂，不停做哈希"。',
     '同一信号在新手眼里不构成信号——判据来自经验，不来自工具。'),
    ('F3', '验证只认执行证据；来源需求随严谨度变化，并与审查行为脱节', 'l2',
     '6/6 以运行结果/测试/golden/benchmark 为准；郑雨豪要来源、王伟不看来源；徐立桂以头文件为最权威，却"一般不看代码"。',
     '"不看来源"不等于不需要可追溯，只说明当前的来源展示没有进入他的决策链。'),
    ('F4', '失败后没有人真正"自己接手"：差别在交办粒度，不在人机分工', 'l2',
     '梁淼城/郑雨豪/王鹤锦/王伟以换模型、重写、回滚为主；徐立桂收回拆解权，但拆完仍交给 AI 执行——"拆得越细，AI 执行越符合预期，因为他不用猜了"。',
     '样本中仅 1 例走"拆细再交办"，不能推断比例；它说明恢复能力更像"拆解能力"而非"接管能力"。'),
    ('F5', 'AI 压缩的是试错与排错，不压缩编码；学习损失集中在参数、归因与性能直觉', 'l3',
     '王伟："试错是知识增长最快的一个阶段……Agent 把这一步跳过了"；郑雨豪："AI 会了，我不会"；梁淼城：排错被压缩影响日后 debug；反例：王鹤锦为学 vLLM 坚持自己写代码。',
     '未做前后测，无法量化损失；只能确认"损失发生在哪一段"。'),
]
_led = ''
for no, title, stg, ev, bound in _find:
    _led += ('<div class="led-r"><div class="led-n">%s</div><div class="led-b"><h4>%s<span class="stg %s">%s</span></h4>'
             '<p>%s</p><p style="color:var(--ink-3)"><b>边界：</b>%s</p></div></div>'
             % (no[1], title, stg, '跨案例模式' if stg == 'l2' else '待验证', ev, bound))
S17 = slide('<div class="led">%s</div>' % _led,
            '五条有证据的发现', '发现与启示 · 结论与证据', 5)

# ---------------- S18 设计启发 ----------------
S18 = slide('''
<div class="m4">
  <div>
    <h2 style="font-size:clamp(18px,1.45vw,24px);line-height:1.35;font-weight:800;color:var(--ink);margin-bottom:1.4vh">先做"上下文装配"和"验证凭据"：<br>它们同时抬高价值、压低成本</h2>
    <p style="font-size:12.4px;color:var(--ink-2);line-height:1.6;margin-bottom:1.4vh">每条标注它回应的那一页发现（P##），按"用户价值 × 实现成本"排优先级，避免做成功能清单。</p>
    <div class="cx-concl"><span class="ck">取舍</span><span class="cv">不做"新建知识库"：六人里已有四人把沉淀放在文件系统里，唯一想建库的人自己也承认"知识还是单点"。</span></div>
  </div>
  <div>
    <div class="ax-tag">价值 高 ↑</div>
    <div class="m4-grid">
      <div class="m4-cell tl"><div class="ct">快赢<small>高价值 · 低成本</small></div>
        <span class="note g"><b>验证凭据链</b>：运行输出 / golden / baseline 绑定到结论<em>P24</em></span>
        <span class="note g"><b>成本可见与 Skill 裁剪</b>：token 预算、档位、步骤可删<em>P30</em></span>
        <span class="note g"><b>沉淀导出</b>：md / 设计文档 / Skill，不做新库<em>P21</em></span>
      </div>
      <div class="m4-cell tr"><div class="ct">重点投入<small>高价值 · 高成本</small></div>
        <span class="note"><b>上下文装配台</b>：结构化详设 + API 预置 + 可复用模板<em>P18</em></span>
        <span class="note"><b>交接信号面板</b>：thought / diff / 指标异常聚合成"该不该停"<em>P22</em></span>
        <span class="note"><b>可恢复性</b>：checkpoint、回滚、分支对比、拆解建议<em>P27</em></span>
        <span class="note"><b>远端执行可观测</b>：长任务进度、结果回收、断点续跑<em>P20</em></span>
      </div>
      <div class="m4-cell bl"><div class="ct">看情况<small>低价值 · 低成本</small></div>
        <span class="note o"><b>来源按需展开</b>：默认收起，冲突时再展开<em>P24</em></span>
        <span class="note o"><b>会话检索</b>：跨会话 / 跨目录找回<em>P21</em></span>
      </div>
      <div class="m4-cell br"><div class="ct">分阶段<small>高价值 · 很高成本</small></div>
        <span class="note a"><b>学习留痕</b>：把被压缩的试错变成可回放的最小实验<em>P31</em></span>
        <span class="note a"><b>判据迁移</b>：把老手的"形态信号"变成可检查项<em>P22</em></span>
      </div>
    </div>
    <div class="ax-tag" style="text-align:right;margin-top:.7vh">成本 高 →</div>
  </div>
</div>''', '设计启发：八条方向按"价值 × 成本"排优先级', '设计 · 价值与成本', 5)

# ---------------- S19 边界 ----------------
S19 = slide('''
<div class="bd2">
  <div class="bd2-c ok"><h4>这份分析可以支撑</h4>
    <li>过程结构：一次任务在哪些环节被切断、由谁接回</li>
    <li>机制解释：什么信号触发介入、什么证据支撑验收</li>
    <li>学习影响的位置：损失集中在试错、排错与参数直觉</li>
    <li>设计优先级：哪些缺口同时抬高价值、压低成本</li>
    <li>两类角色的差异：完成标准、资源条件、知识来源、交付压力</li>
  </div>
  <div class="bd2-c no"><h4>这份分析不能支撑</h4>
    <li>比例与频次：样本 6 人、回顾式自报，不能外推总体</li>
    <li>因果：未做对照，不能断言"AI 导致理解变浅"</li>
    <li>真实性能：未现场观察，不能声称上卡成功或达标</li>
    <li>跨团队普遍性：企业侧集中在同一部门，学生侧集中在三所高校</li>
    <li>个体差异：同一角色内部差异很大（郑雨豪明显比同组更谨慎）</li>
    <li>时效性：工具与模型迭代很快，具体工具结论会过期</li>
  </div>
</div>
<div class="hyp">
  <div class="hyp-i"><b>H1 · 成本是隐性的任务分配器</b><span>5 人提及价格/额度影响模型选择、是否多 Agent、是否继续迭代，但无人把它说成策略。</span></div>
  <div class="hyp-i"><b>H2 · 全权限是摩擦管理而非信任</b><span>"不然要一直点 yes"是一句行为解释；需要专门测试用户对权限的真实风险感知。</span></div>
  <div class="hyp-i"><b>H3 · 沉淀应落在文件系统</b><span>4 人已在做，郑雨豪仍希望"知识库 + AI 直接调用"；两种路径需要并行验证。</span></div>
</div>
<div style="margin-top:2vh;font-size:10.5px;color:var(--ink-3);line-height:1.5">材料：6 份《AI-Coding 用户访谈记录》（思维导图手记 + ASR 逐字稿补充）、DACT 访谈提纲、30 分钟精简提纲；ASR 原文另见《用户访谈观点解析》。本报告中所有引号内文字均为记录稿或 ASR 转写，非严格逐字引用。</div>''',
    '这份分析能回答什么、不能回答什么', '发现与启示 · 边界与假设', 5)

from d_s16 import S16  # 覆盖本地旧版

from d_seq2 import Q1, Q2, Q3
from d_extra import X1, X2, X3, X4, X5
from d_extra2 import X6, X7
from d_extra3 import X8, X9
from d_extra4 import Y1, Y2
from d_extra5 import Z1, Z2
from d_final import MAP, S17N
from d_perm import PERM
from d_up import P_STU, P_EMP
from d_loy import LOY
from d_s11b import S11B
from d_s15b import S15B

ALL = [S1, S2, S3, S4, P_STU, P_EMP, S6, S7, S8, S9, S10, Q1, Q2, Q3,
       X1, PERM, X6, S11B, X2, X4, Y1, S12, Z2, S13, X3, S16, S14, X9,
       X7, X8, X5, Y2, S15, LOY, S15B, Z1, MAP, S17N, S18, S19]
