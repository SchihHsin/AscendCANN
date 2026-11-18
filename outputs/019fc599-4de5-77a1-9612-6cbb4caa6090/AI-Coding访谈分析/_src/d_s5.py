# -*- coding: utf-8 -*-
from d_slides1 import slide

DIMS = ['触发', '完成标准', '资源条件', '知识来源', '学习方式', '交付与协作']
STU = [
    '课题、论文、课程作业、实习 demo',
    'benchmark 对 baseline；实验有提升；能自己复现',
    '自费额度、实验室无 root、租卡、远程环境',
    '论文、GitHub、官方文档、CSDN / 知乎',
    '任务触发为主，也会为"学会"刻意自己写代码',
    '1–2 人各做模块，没有评审压力',
]
EMP = [
    '需求单、问题单、测试任务、算子开发',
    '精度 golden + 性能 baseline 双达标，过测试、能合入',
    '统一采购 IDE、内网 / 黄区、内部 Skill 与专家',
    '官方 API 文档、内部 wiki、组内专家、设计文档',
    '被动 7 : 主动 3，基本在任务里学',
    'committer 检视、拆 PR、跨团队难复用',
]

_rows = ''
for d, a, b in zip(DIMS, STU, EMP):
    _rows += ('<div class="mir-cell a">%s</div><div class="mir-dim">%s</div><div class="mir-cell b">%s</div>'
              % (a, d, b))

S5 = slide('''
<div class="mir">
  <div class="mir-head a"><div class="n">高校学生</div><div class="d">徐立桂 · 梁淼城 · 王鹤锦 ｜ 研究、课程与实习驱动的开发</div></div>
  <div></div>
  <div class="mir-head b"><div class="n">企业工程师</div><div class="d">王伟 · 郑雨豪 · 彭椒 ｜ 需求、指标与合入驱动的开发</div></div>
  %s
  <div class="mir-q a">"一个窗口实现，一个窗口验收。" —— 徐立桂</div>
  <div></div>
  <div class="mir-q b">"人工审查跟 AI 执行是相互交叉、交替执行的过程。" —— 王伟</div>
</div>''' % _rows,
    '学生与 AI 一起探路，企业工程师把任务交办给 AI 再验收', '角色与旅程 · 双角色画像', 1)
