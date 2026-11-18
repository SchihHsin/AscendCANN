# -*- coding: utf-8 -*-
"""授权与风险：权限开到最大，信任却没跟上。"""
from d_slides1 import slide

PTS = [
    ('12%', '梁淼城', 'approve for me', '运行命令要确认，<br>文件修改直接放行'),
    ('30%', '王鹤锦', 'Auto mode', '涉昇腾 / 沐曦时<br>被强制切回手动'),
    ('50%', '郑雨豪', '只有删除要确认', '其他"都直接放行"'),
    ('68%', '彭椒', '开到最大', '"不然要一直点 yes"'),
    ('84%', '徐立桂', '全都给他开', '靠"一窗实现、<br>一窗验收"兜底'),
    ('96%', '王伟', '全部权限', '没有例外'),
]
_pts = ''
for x, name, mode, ex in PTS:
    _pts += ('<div class="perm-pt" style="left:%s"><div class="pp-top"><b>%s</b><span>%s</span></div>'
             '<div class="perm-dot"></div><div class="pp-ex">%s</div></div>' % (x, name, mode, ex))

PERM = slide('''
<div class="perm-wrap">
  <div class="perm-axis">
    <div class="perm-cap">授权刻度：左端需要逐条确认，右端全部放行</div>
    <div class="perm-line"></div>
    %s
  </div>
  <div class="perm-quotes">
    <div><b>郑雨豪</b>："我对 AI 做的事还是信任的，但<b>一直不太信任</b>，所以做完之后肯定都会检查一遍。"</div>
    <div><b>彭椒</b>："我的基本权限是<b>开最大的</b>。"</div>
    <div><b>梁淼城</b>："工作区里的文件修改都是<b>让他直接自己干了</b>。"</div>
  </div>
  <div class="cx-concl"><span class="ck">结论</span><span class="cv">授权放到最松、验收放到最紧——风险没有消失，只是<b>被挪到了后面</b>。所以用户真正需要的是"可回滚、可审计、可核验"，不是更多的确认弹窗。</span></div>
</div>''' % _pts,
    '权限开到最大，信任却没跟上', '人机协作 · 授权与风险', 2)
