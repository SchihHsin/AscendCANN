# -*- coding: utf-8 -*-
"""平台忠诚度：没有“我的平台”，换工具的代价几乎为零。"""
from d_slides1 import slide

ROWS = [
    ('王鹤锦', ['Claude Code', 'DeepSeek Harness', 'Grok'], '限制多就换：触发 safeguard、被限流'),
    ('徐立桂', ['Codex 客户端', 'OpenCode + DeepSeek'], '觉得 DeepSeek 写代码“更干净”'),
    ('梁淼城', ['按项目选主力', 'DeepSeek（审美类）'], '任务类型决定用哪个'),
    ('王伟', ['国外模型（复杂任务）', 'Trae（问题单）'], '任务类型；“公司配的 Trae 非常卡”'),
    ('郑雨豪', ['强模型（写码）', '弱模型（对话）'], '任务类型决定用哪个'),
    ('彭椒', ['OpenCode', '手动备份到 VS Code'], '“生成速度慢、容易挂”'),
]

_rows = ''
for name, tools, trig in ROWS:
    chain = '<span class="loy-ar">→</span>'.join('<span class="loy-t">%s</span>' % t for t in tools)
    _rows += ('<div class="loy-r"><div class="loy-n">%s</div><div class="loy-c">%s</div>'
              '<div class="loy-g">%s</div></div>' % (name, chain, trig))

LOY = slide('''
<div class="loy">
  <div class="loy-head"><div>受访者</div><div>现在同时在用的</div><div>什么情况下换</div></div>
  <div class="loy-rows">%s</div>
  <div class="loy-bot">
    <div class="loy-k">为什么换得动</div>
    <div class="loy-why">
      <div><b>沉淀物是文件，不在平台里</b><span>md、代码、Skill 都留在本地，换个工具照样接着用</span></div>
      <div><b>迁移成本≈0</b><span>“OpenCode 里觉得有用的内容会手动保存在别的地方（VS Code）”</span></div>
      <div><b>所以没有“我的平台”</b><span>只有“这一轮用哪个”——忠诚度是结果，不是前提</span></div>
    </div>
    <div class="loy-concl">产品留人不能靠“存得多、搬不走”，只能靠<b>“每次任务都更强”</b>。</div>
  </div>
</div>''' % _rows,
    '没有“我的平台”：换工具的代价几乎为零', '习惯与偏好 · 平台忠诚', 3)
