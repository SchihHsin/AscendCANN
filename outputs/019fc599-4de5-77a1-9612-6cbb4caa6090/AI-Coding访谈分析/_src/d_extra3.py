# -*- coding: utf-8 -*-
"""新增两页：官方 Skill 的流程税 / 失败归因。"""
from d_slides1 import slide

# ---------------- X8 Skill 流程税 ----------------
FLOW = ['读需求', '出设计文档', '拆步骤', '逐步实现', '自检', '跑通过', '交交付物']
_steps = ''
for i, s in enumerate(FLOW):
    _steps += '<div class="skl-step">%s</div>' % s
    if i < len(FLOW) - 1:
        _steps += '<div class="skl-ar">→</div>'

X8 = slide('''
<div class="skl-wrap">
  <div class="skl-top">官方 Skill 的典型形态：一条要走完的长流程</div>
  <div class="skl-flow">%s</div>
  <div class="skl-cost">越往前走，成本越高——但"活"还没开始干</div>
  <div class="skl-reacts">
    <div class="skl-r"><b>绕开</b><span>王伟："流程比较长……每次任务还没开始干，头可能就已经耗掉很多了。我一般不太会用他的工作流，一般让他看里面的一些知识。"</span></div>
    <div class="skl-r"><b>裁剪</b><span>郑雨豪：官方 skill 强制"开多个子进程跑同一份数据集，全部通过才合格"，他认为"跑一次就可以了"，中间的步骤可以删。</span></div>
    <div class="skl-r"><b>不碰</b><span>徐立桂："我知道有很多非常 fancy 的 skill……但是我没有时间去找。"王鹤锦：没有尝试过官方 skill。</span></div>
  </div>
  <div class="cx-concl"><span class="ck">结论</span><span class="cv">问题不是内容不好，是<b>把"流程"当成了产品</b>：用户要的是里面的知识密度，不是必须走完的仪式；要的是可裁剪的步骤，不是一条不能跳的长链。</span></div>
</div>''' % _steps,
    '官方 Skill 把流程做全了，用户只想拿走里面的知识', '知识与学习 · Skill 的形态', 4)

# ---------------- X9 失败归因 ----------------
X9 = slide('''
<div class="attr-wrap">
  <div class="attr-top">结果不对时，人往哪儿找原因</div>
  <div class="attr-grid">
    <div class="attr-src">任务失败<br><span>结果不对 / 跑不通</span></div>
    <svg class="attr-fan" viewBox="0 0 56 120" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <marker id="fanR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="#B3403A" stroke-width="1.6"/></marker>
        <marker id="fanG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="#8C97A5" stroke-width="1.6"/></marker>
      </defs>
      <path d="M2 60 C 26 60, 26 30, 52 30" fill="none" stroke="#B3403A" stroke-width="2.6" marker-end="url(#fanR)"/>
      <path d="M2 60 C 26 60, 26 90, 52 90" fill="none" stroke="#8C97A5" stroke-width="1.2" marker-end="url(#fanG)"/>
    </svg>
    <div class="attr-lines">
      <div class="attr-line self"><b>4 人 · 归因于自己</b><span>prompt 没写好、路线选错、需求没写清</span></div>
      <div class="attr-line model"><b>1 人 · 归因于模型</b><span>能力不够、语料太少</span></div>
    </div>
  </div>
  <div class="attr-quotes">
    <div><b>王鹤锦</b>："结果不好不一定是 AI 的问题，<b>很可能是我 prompt 写得不好，或者技术路线选错</b>。大多数实验其实是失败的。"</div>
    <div><b>徐立桂</b>："绝大多数情况下，还是<b>我的提示词描述得不太好</b>，或者有歧义。"</div>
    <div><b>王伟</b>："需求描述比较模糊的话，<b>它只会给你一个完成度 10% 的版本</b>。"</div>
  </div>
  <div class="cx-concl"><span class="ck">设计含义</span><span class="cv">用户不会说"模型不行"，会说"我没写清楚"。所以只推<b>"换更强的模型"</b>他并不买账；他要的是<b>帮他把没写清楚的部分显性化</b>——验收标准、上下文、拆解粒度。</span></div>
</div>''',
    'AI 失败时，人先怪自己', '人机协作 · 失败归因', 2)
