# -*- coding: utf-8 -*-
"""新增两页：E 环境门槛 / H 错误样例。"""
from d_slides1 import slide

# ---------------- E 环境门槛 ----------------
ENV_ROWS = [
    ('算力 / 卡', '徐立桂："CANN Lab 老是申请不到资源"；王鹤锦：官网查不到 C500 参数，"在网上租一张卡，用代码把卡的信息打印出来"。', '学生为主'),
    ('版本 / 驱动', '梁淼城：910B 上排查小半天，"最后才发现是 CANN 版本没有升级，所以跑不动"。', '两边都有'),
    ('权限 / 黄区', '彭椒："黄区能拿到的资源非常有限"，内部业务资料 AI 拿不到；王鹤锦：实验室服务器没有 root。', '企业为主'),
    ('网络 / 工具', '徐立桂："环境在远程，Agent 接远程的能力还很差"；王伟：公司配的 IDE "非常卡"。', '两边都有'),
]
_rows = ''
for k, v, who in ENV_ROWS:
    _rows += ('<div class="env-row"><div class="env-k">%s</div><div class="env-v">%s</div>'
              '<div class="env-who">%s</div><div class="env-ai">AI 帮不上</div></div>' % (k, v, who))

X6 = slide('''
<div class="env-wrap">
  <div class="env-top">四件事，缺一件就开不了工——而且没有一件是模型能替你解决的。</div>
  <div class="env-table">
    <div class="env-head"><span>环节</span><span>受访者遇到的具体卡点</span><span>谁更常被卡</span><span>AI 能否代劳</span></div>
    %s
  </div>
  <div class="env-bottom">
    <div class="env-b"><b>结果一：</b>任务还没开始，先花掉半天到几天。徐立桂要申请环境，王鹤锦要租卡，梁淼城要排查版本。</div>
    <div class="env-b"><b>结果二：</b>环境在哪，决定了用哪种协作形态——本机就逐轮看，远端就只能给目标、等结果。</div>
  </div>
  <div class="cx-concl"><span class="ck">结论</span><span class="cv">这是唯一一个<b>"模型再强也变不出来"</b>的环节。所以它既决定任务能不能开始，也决定人和 AI 怎么分工。</span></div>
</div>''' % _rows,
    '任务还没开始，先卡在环境上', '人机协作 · 开工前的门槛', 2)

# ---------------- H 错误样例 ----------------
X7 = slide('''
<div class="err-wrap">
  <div class="err-cols">
    <div class="err-col have">
      <div class="err-h">现在拿得到的</div>
      <div class="err-item">API 怎么调用</div>
      <div class="err-item">正确的示例代码</div>
      <div class="err-item">最佳实践与优化思路</div>
      <div class="err-item">benchmark 与 baseline</div>
    </div>
    <div class="err-mid"><span>不缺</span><i>→</i><span>缺</span></div>
    <div class="err-col miss">
      <div class="err-h">真正缺的</div>
      <div class="err-item">这个错误长什么样</div>
      <div class="err-item">为什么会错、错在哪一层</div>
      <div class="err-item">怎么定位、怎么排除</div>
      <div class="err-item">哪些写法一定会踩坑</div>
    </div>
  </div>
  <div class="err-quotes">
    <div><b>梁淼城</b>："其实缺的就是<b>错误样例</b>，他不知道怎么错的。"</div>
    <div><b>王伟</b>：精度调不通时只能"点开他的 thought，看看到底在做哪些尝试"。</div>
    <div><b>彭椒</b>：内部业务资料 AI 拿不到，"可能就依赖自己以前的经验"，照着改一定不对。</div>
  </div>
  <div class="cx-concl"><span class="ck">所以</span><span class="cv">错误样例是最稀缺的一类知识，而且它<b>天然长在组织内部</b>（黄区、私有仓库、别人的失败）——公开资料里几乎没有。</span></div>
</div>''',
    '资料都在教"怎么写对"，没人教"这么写会怎么错"', '知识与学习 · 错误样例', 4)
