# -*- coding: utf-8 -*-
"""新增两页：AI 不会说"我不会" / 团队的理解在变薄。"""
from d_slides1 import slide

# ---------------- Z2 自信地错 ----------------
CASES = [
    ('01', '自认正确', '郑雨豪："他做的是错的，但<b>他认为他是对的</b>。"'),
    ('02', '规范地过度设计', '徐立桂："生成 slop，把所有事情弄得很复杂，但是<b>非常规范</b>。"'),
    ('03', '编造后立刻认错', '王鹤锦："乱编函数名……<b>一问他就检索，就又改过来了</b>。"'),
    ('04', '反复试，不喊停', '王伟："精度调不通，就开始<b>左右脑互搏</b>。"'),
]
_cases = ''
for no, k, q in CASES:
    _cases += ('<div class="sp-i"><div class="sp-no">%s</div><div class="sp-k">%s</div><p>%s</p></div>' % (no, k, q))

Z2 = slide('''
<div class="sp-wrap">
  <div class="sp-top">四种"自信地错"的形态——没有一种是"报错然后停下"</div>
  <div class="sp-row">%s</div>
  <div class="sp-cmp">
    <div class="sp-side bad"><b>问 AI"你确定吗"</b><span>它仍然会说确定；追问三次，三次都通过。</span></div>
    <div class="sp-vs">VS</div>
    <div class="sp-side good"><b>跑一次 golden / 测试</b><span>误差一摆出来就露馅——外部证据不会被说服。</span></div>
  </div>
  <div class="cx-concl"><span class="ck">推论</span><span class="cv">AI 的自检信号不可信，<b>验证必须外部化</b>：跑测试、对 golden、看 diff 的形态（函数变短、封装变多、节点变复杂）。这也是为什么"看 thought"会成为一种技能。</span></div>
</div>''' % _cases,
    'AI 不会说"我不会"，它只会自信地给一个错答案', '人机协作 · 失败的形态', 2)

# ---------------- Z1 团队理解变薄 ----------------
CURVE = '''<svg viewBox="0 0 460 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <line x1="46" y1="264" x2="446" y2="264" stroke="#AEB6C2" stroke-width="1.2"/>
  <line x1="46" y1="20" x2="46" y2="264" stroke="#AEB6C2" stroke-width="1.2"/>
  <text x="46" y="282" font-size="10" fill="#7C8695">入职</text>
  <text x="446" y="282" font-size="10" fill="#7C8695" text-anchor="end">24 个月</text>
  <text x="16" y="150" font-size="10" fill="#7C8695" text-anchor="middle" transform="rotate(-90 16 150)">独立解决问题</text>
  <path d="M46 250 C 130 236, 210 150, 440 54" fill="none" stroke="#4B4BA8" stroke-width="2.4"/>
  <path d="M46 250 C 100 160, 130 146, 210 140 C 310 134, 380 132, 440 130" fill="none" stroke="#C0392B" stroke-width="2.4" stroke-dasharray="6 4"/>
  <text x="446" y="48" font-size="10.5" fill="#3B3B85" text-anchor="end">无 AI 上手：慢，但底子厚</text>
  <text x="446" y="124" font-size="10.5" fill="#8E2F35" text-anchor="end">有 AI 上手：快，停在"会用"</text>
  <circle cx="440" cy="130" r="4" fill="#C0392B"/>
</svg>'''

Z1 = slide('''
<div class="team-wrap">
  <div class="team-left">
    %s
    <div class="team-note">示意图，非测量。依据王伟对"新员工"与"自己前后变化"的描述。</div>
  </div>
  <div class="team-right">
    <div class="team-q"><b>王伟</b>："我刚入职的时候其实没有 AI，对原理还是有一些了解的……现在主要依赖 AI 写之后，原理还是会看，但<b>没有之前理解那么深了</b>。"</div>
    <div class="team-q"><b>王伟</b>："对于现在入职的新员工来说，<b>原理理解比较少</b>。"</div>
    <div class="team-q"><b>徐立桂</b>："确实对很多细节完全没有感知了，<b>越来越多东西变成黑盒</b>。"</div>
    <div class="team-q"><b>郑雨豪</b>："<b>AI 会了，我不会。</b>"</div>
    <div class="team-more">再加上 P23 那条：committer 检视时"我感觉现在他们都是让 AI 看的"。</div>
  </div>
</div>
<div class="cx-concl" style="margin-top:1.4vh"><span class="ck">风险</span><span class="cv">写的人、评审的人同时变薄——<b>三年后谁来判断这套实现对不对？</b>这不是个人学习习惯问题，是团队的能力结构问题。</span></div>''' % CURVE,
    'AI 让新人上手更快，团队的理解在变薄', '知识与学习 · 团队层面', 4)
