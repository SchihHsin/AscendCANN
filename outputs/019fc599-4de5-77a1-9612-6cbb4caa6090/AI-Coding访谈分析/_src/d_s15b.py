# -*- coding: utf-8 -*-
from d_slides1 import slide

ROWS = [
    ('成本敏感', '学生自费额度、企业统一采购但国外模型难报销',
     '用弱模型做对话、强模型写码', '额度决定能不能开多 Agent、要不要继续迭代'),
    ('环境可控', '本地 IDE 每轮都看 vs 远程服务器 / 黄区',
     '每轮跑完就看 diff', '定时轮询结果，中间过程看不到'),
    ('交付责任', '自己的玩具 / 论文结果 vs 责任田 / committer 检视',
     '只看核心逻辑与接口', '通读、清理封装、拆成多个 PR'),
    ('任务严谨度', '工程任务可运行即通过 vs 研究结论需要可引用',
     '来源基本不看', '没有来源就当成编造'),
]
_rows = ''
for cond, ctx, a, b in ROWS:
    _rows += ('<div class="frk"><div class="frk-cond"><b>%s</b><span>%s</span></div>'
              '<div class="frk-out a">%s</div><div class="frk-out b">%s</div></div>'
              % (cond, ctx, a, b))

S15B = slide('''
<div class="frk-head"><div></div><div class="frk-h a">学生的表现</div><div class="frk-h b">企业工程师的表现</div></div>
%s
<div class="cx-concl" style="margin-top:1.8vh"><span class="ck">读法</span><span class="cv">同一个行为在不同情境下含义不同：<b>"权限全开"在学生会带来探索自由，在企业会带来返工风险</b>；<b>"不看来源"在工程里是效率，在研究里是失职</b>。设计不能只按"用户偏好"排序，要先判断他处在哪种情境。</span></div>''' % _rows,
    '同样的行为，在不同情境下含义不同', '习惯与偏好 · 差异与情境', 3)
