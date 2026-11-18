# -*- coding: utf-8 -*-
"""上一轮确认新增的五页：模型档位 / 教 AI 的隐性工时 / 代码的读者 / 任务状态 / 学习窗口。"""
from d_slides1 import slide

# ---------------- X1 模型档位 ----------------
def _chain(lab, cls, nodes, arrows):
    inner = ''
    for i, n in enumerate(nodes):
        inner += '<div class="sup-node %s">%s</div>' % (n[1], n[0])
        if i < len(arrows):
            inner += '<div class="sup-ar"><span>%s</span></div>' % arrows[i]
    return ('<div class="sup-row"><div class="sup-lab %s">%s</div><div class="sup-chain">%s</div></div>'
            % (cls, lab, inner))


X1 = slide('''
<div class="sup-wrap">
  %s
  %s
  <div class="sup-note">同一条链上，"谁付钱"决定了默认档位：学生自己订阅，额度就是上限；企业组织采购，合规与预算就是上限，想要更强只能自费补一把。</div>
  <div class="sup-bottom">
    <div class="sup-b">
      <div class="sup-h">两边都在做同一件事：<b>分层使用</b></div>
      <div class="sup-items">
        <span><b>王伟</b>：国外模型做复杂任务，Trae 解问题单</span>
        <span><b>郑雨豪</b>：弱模型对话，强模型写码</span>
        <span><b>梁淼城</b>：审美活交给 DeepSeek</span>
        <span><b>徐立桂</b>：Codex 降智就转 DeepSeek</span>
      </div>
    </div>
    <div class="sup-b">
      <div class="sup-h">而且档位会变：<b>降智、封号、挂</b></div>
      <div class="sup-items">
        <span><b>王鹤锦</b>：触发 safeguard，Opus 5.5 被降成 5.0</span>
        <span><b>彭椒</b>：动不动容易挂，人一多就不行</span>
        <span><b>王伟</b>：公司配的 Trae 非常卡</span>
      </div>
    </div>
  </div>
</div>''' % (
    _chain('高校学生', 'stu',
           [('个人订阅 / 自费', 'plain'), ('Codex · Claude Code', 'strong'), ('DeepSeek · Grok 兜底', 'weak')],
           ['额度', '额度见底']),
    _chain('企业工程师', 'emp',
           [('组织采购 / 黄区', 'plain'), ('Trae · 毕方 · 内部模型', 'default'), ('Cursor + 境外模型', 'self')],
           ['合规与预算', '自费补强']),
),
    '最强模型不是标配：学生用额度换，企业用自费换', '角色与旅程 · 资源条件', 1)

# ---------------- X2 教 AI 的隐性工时 ----------------
X2 = slide('''
<div class="dest-wrap">
  <div class="dest-title">一次算子开发的时间去向（王伟自述）</div>
  <div class="dest">
    <div class="dest-seg s1" style="flex:15"><b>15%</b><span>写详细设计文档</span></div>
    <div class="dest-seg s2" style="flex:10"><b>10%</b><span>AI 执行</span></div>
    <div class="dest-seg s3" style="flex:70"><b>≈70%</b><span>人工审查、清理与返工</span></div>
    <div class="dest-seg s4" style="flex:5"><b>5%</b><span>沉淀</span></div>
  </div>
  <div class="dest-bracket"><span>其中"清理 AI 代码"单独就要约一天</span></div>
  <div class="dest-quotes">
    <p><b>王伟</b>："AI 非常喜欢做一些<b>无效封装</b>，定义各种变量传来传去……很难跟 AI 说清楚 code review 到底是什么，基本上还是得自己看，看完再告诉他<b>不用做那么多封装</b>。"</p>
    <p><b>梁淼城</b>："上一轮生成的已经开始跑偏了，我会给他引导，说把上一轮的全部回滚，然后重新来一遍。"</p>
  </div>
  <div class="cx-concl"><span class="ck">结论</span><span class="cv">省下的是"敲键盘"，<b>没有省下的是"讲清楚"和"验收"</b>——后者甚至更贵，因为它不可外包、也不进计划。</span></div>
</div>''', '写代码省下来的时间，又还给了"讲清楚"和"验收"', '人机协作 · 隐性工时', 2)

# ---------------- X3 代码的读者 ----------------
def _rev(steps, cls=''):
    out = ''
    for i, (t, k) in enumerate(steps):
        out += '<div class="rev-step %s">%s</div>' % (k, t)
        if i < len(steps) - 1:
            out += '<div class="rev-ar">→</div>'
    return '<div class="rev %s">%s</div>' % (cls, out)


X3 = slide('''
<div class="rev-wrap">
  <div class="rev-row">
    <div class="rev-lab">以前</div>
    %s
  </div>
  <div class="rev-row">
    <div class="rev-lab">现在</div>
    %s
  </div>
  <div class="rev-note">中间那一步没有消失，只是"读代码的人"从人换成了 AI：人只核核心逻辑，剩下的交给 AI 去读、去讲、去评。</div>
  <div class="rev-quotes">
    <div class="rev-q"><b>王伟</b>："几万行代码，你让 committer 去检视，谁都检视不了……只能拆成 10 个 PR 一步一步上。"<span>"我感觉现在他们都是让 AI 看的。"</span></div>
    <div class="rev-q"><b>郑雨豪</b>："一次给你生成几千行，可读性比较差，<b>不一定人工能看过来</b>。"</div>
    <div class="rev-q"><b>徐立桂</b>："一般情况下我不会看代码，他给我讲一下这个代码是什么情况，我看一下模块组织合理不合理。"</div>
  </div>
  <div class="cx-concl"><span class="ck">推论</span><span class="cv">"可读性"的标准正在分裂：<b>对人可读</b>与<b>对 AI 可读</b>不是一回事。当评审也交给 AI，团队就失去了"人的理解"这个锚点。</span></div>
</div>''' % (
    _rev([('人写代码', 'plain'), ('人评审', 'plain'), ('人维护', 'plain')]),
    _rev([('AI 生成', 'plain'), ('人只核核心', 'plain'), ('AI 先读、AI 评', 'dead')]),
),
    '代码的读者变了：现在先读它的是 AI，不是人', '人机协作 · 评审与交接', 2)

# ---------------- X4 任务状态 ----------------
X4 = slide('''
<div class="ts-wrap">
  <div class="ts-left">
    <div class="ts-h">现在的会话列表长这样</div>
    <div class="ts-list">
      <div class="ts-item"><span>算子 kernel 优化</span><em>2 小时前</em><b>?</b></div>
      <div class="ts-item"><span>测试脚本修复</span><em>昨天</em><b>?</b></div>
      <div class="ts-item"><span>论文 demo 复现</span><em>3 天前</em><b>?</b></div>
    </div>
    <div class="ts-sub">只有标题和时间，没有"在跑 / 卡住 / 跑完了等你"</div>
  </div>
  <div class="ts-right">
    <div class="ts-h">于是各自发明了土办法</div>
    <div class="ts-q"><b>王伟</b>：2–3 个任务，"这边交互完去看另外两个有没有做完，来回点"</div>
    <div class="ts-q"><b>彭椒</b>：多任务时"界面比较拥挤，一下子找不到我是在哪个任务"</div>
    <div class="ts-q"><b>梁淼城</b>：另开一个定时任务，每 2–3 小时提醒"哪条会话忘了回"</div>
    <div class="ts-q"><b>郑雨豪</b>："一个对象正在修改时，另一个就没办法操作"</div>
  </div>
</div>
<div class="cx-concl" style="margin-top:1.6vh"><span class="ck">结论</span><span class="cv">卡住的不是并行能力，是<b>任务级的状态可见性</b>：工具都在优化"一次对话"，没人做"任务看板"。</span></div>''',
    '多任务卡住的不是"多"，是"看不见"', '习惯与偏好 · 注意力管理', 3)

# ---------------- X5 学习窗口 ----------------
X5 = slide('''
<div class="win-wrap">
  <div class="win-row">
    <div class="win-lab">AI</div>
    <div class="win-track">
      <div class="win-block ai" style="flex:1"><b>AI 在跑任务</b><span>30 分钟 ~ 1 天</span></div>
    </div>
  </div>
  <div class="win-row">
    <div class="win-lab">人</div>
    <div class="win-track">
      <div class="win-block wait" style="flex:2"><b>等结果</b><span>刷进度条、看 thought</span></div>
      <div class="win-block learn" style="flex:3"><b>学习窗口</b><span>"AI 干活的时候，自己去学点东西"</span></div>
      <div class="win-block wait" style="flex:1"><b>回来验收</b><span>看 diff、跑测试</span></div>
    </div>
  </div>
  <div class="win-note">王伟：主动学习"其实就是 AI 在干活的时候，自己去学一些东西"；被动 : 主动 ≈ <b>7 : 3</b>，而被动那一份基本都发生在任务里。</div>
  <div class="win-cases">
    <div><b>王鹤锦</b>：让 AI 跑实验，"基本上半小时就好了"，这半小时他去读论文</div>
    <div><b>徐立桂</b>：后台 nohup 跑着，每 5 分钟看一次，中间时间用来查资料</div>
    <div><b>王伟</b>：等 AI 出初版时，"对一些感兴趣的算子，让 AI 先读代码，自己边看边理解"</div>
  </div>
  <div class="cx-concl"><span class="ck">对学习产品</span><span class="cv">不要另开一个"学习模式"——<b>要占的就是这段等待窗口</b>：把 AI 正在做的事变成可读的、可追问的，而不是让人盯着进度条。</span></div>
</div>''', '学习不发生在"学"的时候，发生在 AI 干活的时候', '知识与学习 · 学习窗口', 4)
