# -*- coding: utf-8 -*-
from d_slides1 import slide

STEPS = [
    ('01', '定验收', '什么算做完？',
     '王伟：精度、性能<b>通过测试标准</b>；郑雨豪：功能没错 + 性能达标。',
     '做不好：需求模糊，"它只会给你一个完成度 10% 的版本"（王伟）'),
    ('02', '配上下文', '拿什么给它？',
     '王伟：把 <b>API 链接放进详设</b>，"不要让他自己去猜"；郑雨豪：知道正确写法时<b>直接给示例</b>。',
     '做不好：单个 API 有文档，"API 之间怎么配合"没有（王伟）'),
    ('03', '拆粒度', '拆到不用猜？',
     '徐立桂：<b>"拆得越细，AI 执行越符合预期，因为他不用猜了"</b>；王伟：把框架限定死。',
     '做不好："你提供不出好的拆解方案，AI 也想不出"（徐立桂）'),
    ('04', '套格式', '能不能固化？',
     '王伟：设计文档的格式来自<b>自己沉淀的总结</b>，"每次让他按这个格式出"。',
     '做不好：没有模板，每次从零写一遍详设'),
]
_band = ''
for no, name, q, ev, bad in STEPS:
    _band += ('<div class="tstep"><div class="no">%s</div><h3>%s</h3>'
              '<div class="q">%s</div><div class="tev">%s</div>'
              '<div class="bad">%s</div></div>' % (no, name, q, ev, bad))

S11B = slide('''
<div class="tflow">
  <div class="tflow-ends"><span>输入：一句需求 / 一个模糊目标</span><span>输出：AI 不用猜的任务</span></div>
  <div class="tflow-band">%s</div>
  <div class="tflow-foot">
    <div class="tf-quote">
      <div class="tf-h">同一道工序，新手与老手的差距</div>
      <p><b>王伟</b>："对于新手来说，只能<b>许愿式编程</b>……遇到无法解决的问题，得去问大佬，问完之后自己<b>像个路由器</b>，再把大佬的话转给 AI。"</p>
      <p><b>徐立桂</b>："熟练工<b>预先知道一些容易出 bug 的地方</b>，写 prompt 时就会说是不是这个问题；新手不具备这样的知识，只能让 AI 自己去查。"</p>
    </div>
    <div class="cx-concl" style="align-self:stretch;grid-template-columns:auto 1fr">
      <span class="ck">结论</span>
      <span class="cv">AI 能替你写设计文档，但<b>不能替你决定"什么算做完"和"拆到多细"</b>——这两件事正好是新手与老手的差距，也是唯一还没有被 AI 接管的环节。</span>
    </div>
  </div>
</div>''' % _band,
    '分工的分界线不在写代码，而在"把任务写成 AI 接得住的形式"', '人机协作 · 任务写法', 2)
