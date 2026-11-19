# -*- coding: utf-8 -*-
from d_slides1 import slide

_tiers = [
    ('l1', 'L1', '直接支持 · 原话 + 具体事件', '每条结论都能落回一个可复述的动作——例如梁淼城判断跑偏的依据是"出现很多一两行的函数"。'),
    ('l2', 'L2', '跨案例模式 · ≥3 人复现同一结构', '上下文前置、异常信号介入、执行证据优先、恢复靠换模型、沉淀落文件。'),
    ('l3', 'L3', '待验证假设 · 1–2 人 / 研究者推断', '成本是隐性分配器、全权限等于摩擦管理、知识应落文件、Skill 应可裁剪。'),
]
_bands = ''
for cls, tag, name, desc in _tiers:
    _bands += ('<div class="ev-tier"><div class="ev-tag">%s</div>'
               '<div class="ev-band b%s"><b>%s</b><span>%s</span></div></div>' % (tag, cls[1], name, desc))

S4 = slide('''
<div class="ev">
  <div class="ev-left">
    <div class="ev-kick">从 6 份记录里提取的证据分三层：只有 L1、L2 进入结论，L3 单独标注为假设</div>
    %s
  </div>
  <div class="ev-right">
    <h4>必须先说明的材料缺口</h4>
    <div class="ev-gap"><b>口径冲突按"手记优先"处理</b>：梁淼城时间比例采用记录稿 5:3:1:1；ASR 转写的 3:3:2:3:1:1 属转录差异，不采用。</div>
    <div class="ev-gap"><b>身份与元信息缺失</b>：郑雨豪记录未写身份；6 份记录均无访谈日期与访谈者。</div>
    <div class="ev-gap"><b>多项"未记录"</b>：梁第 3 痛点、郑任务时间分配、徐学习资源与渠道等 10 项，按未记录处理，不补全。</div>
    <div class="ev-gap"><b>全部是回顾叙述</b>：访谈不要求现场执行，未做独立核验，不能据此声称上卡成功、达到性能或完成端到端部署。</div>
  </div>
</div>''' % _bands,
    '材料能支撑"模式"，不足以支撑"比例"', '材料与边界 · 证据强度', 0)
