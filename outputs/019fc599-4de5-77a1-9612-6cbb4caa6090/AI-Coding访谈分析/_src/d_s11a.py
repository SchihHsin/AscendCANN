# -*- coding: utf-8 -*-
from d_slides1 import slide

QS = [
    ('Q1', '方向定了吗？', '还没想清楚要做什么、方法可不可行', '形态三 · 探索式', '先用 AI 写探针验方向，再决定要不要真做'),
    ('Q2', '结果能被机器判定吗？', '测试 pass、benchmark、精度阈值——机器能给对错', '形态二 · 远端闭环', '人退出循环，只在"给目标"和"终审"两端'),
    ('Q3', '要改的是结构与设计吗？', '过度设计、可读性、接口合理——没有现成判据', '形态一 · 本地逐轮', '人必须每轮在环，看 diff、给方向'),
]
_rows = ''
for q, title, sub, out, desc in QS:
    _rows += ('<div class="qrow"><div class="qno">%s</div>'
              '<div class="qq"><b>%s</b><span>%s</span></div>'
              '<div class="qarrow">→</div>'
              '<div class="qout"><b>%s</b><span>%s</span></div></div>' % (q, title, sub, out, desc))

_xtab = '''
<div class="xtab">
  <div class="xt-h"></div><div class="xt-h">形态一 · 本地逐轮</div><div class="xt-h">形态二 · 远端闭环</div><div class="xt-h">形态三 · 探索式</div>
  <div class="xt-r stu">高校学生</div>
  <div class="xt-c">梁淼城 · 王鹤锦</div><div class="xt-c">徐立桂</div><div class="xt-c">王鹤锦 · 梁淼城</div>
  <div class="xt-r emp">企业工程师</div>
  <div class="xt-c">王伟 · 郑雨豪</div><div class="xt-c">彭椒</div><div class="xt-c dim">样本中较少</div>
</div>'''

S11A = slide(
    '<div class="cond-wrap">'
    '<div class="cond">'
    '<div class="cond-left"><div class="cond-h">三个问题决定用哪种形态</div>' + _rows + '</div>'
    '<div class="cond-right"><div class="cond-h">身份不决定形态：两种角色都落在形态一、形态二</div>'
    + _xtab +
    '<div class="cond-note">经验不起"选形态"的作用，起作用的是<b>在环里判断得准不准</b>与<b>拆得够不够细</b>——王伟看 thought 喊停、徐立桂拆到 AI 不用猜，都是经验，不是形态。<span style="color:#8E9AAA">（条件模型为研究者归纳，待更多样本验证）</span></div>'
    '</div></div>'
    '<div class="cx-concl"><span class="ck">所以</span><span class="cv">缺什么要分形态看：<b>形态一缺"交接信号"</b>（人不知道该不该停），'
    '<b>形态二缺"过程可见"</b>（人只在两端，中间是黑箱），<b>形态三缺"低成本试错的脚手架"</b>（探针、环境、可回滚）。</span></div>'
    '</div>',
    '三种形态由任务条件决定，不由身份或经验决定', '人机协作 · 形态从哪来', 2)
