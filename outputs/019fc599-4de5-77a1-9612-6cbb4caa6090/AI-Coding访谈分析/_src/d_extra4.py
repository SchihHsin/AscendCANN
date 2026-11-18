# -*- coding: utf-8 -*-
"""新增两页：上下文在工作记忆上的缺口 / "学会"的标准分裂。"""
from d_slides1 import slide

# ---------------- Y1 上下文会漏 ----------------
LEAKS = [
    ('压缩 / clear', '王鹤锦："压缩过的对话会<b>丢失记忆</b>，clear 后也会丢失。"', '于是靠 /btw 提问、按 Esc 回到任务'),
    ('按目录隔离', '郑雨豪："会话是按<b>工作目录</b>做的，切换到其他目录，上一个会话就丢掉了。"', '于是跨任务时手动翻、手动搬'),
    ('跨工具不共享', '彭椒："OpenCode 里觉得有用的内容，会<b>手动保存在别的地方</b>（VS Code）。"', '于是每个工具一套记忆'),
]
_leaks = ''
for t, q, s in LEAKS:
    _leaks += ('<div class="leak"><div class="leak-d"><div class="ld-b"></div><div class="ld-g"></div><div class="ld-b"></div></div>'
               '<b>%s</b><p>%s</p><span class="leak-s">%s</span></div>' % (t, q, s))

Y1 = slide('''
<div class="mem-wrap">
  <div class="mem-top">同一段任务的历史，会在三个地方漏掉——而补漏洞的活全落在人身上</div>
  <div class="leaks">%s</div>
  <div class="fix-row">
    <div class="fix"><b>补丁一 · 翻</b><span>王伟拉进度条、梁淼城翻聊天记录（"加载很慢"）、郑雨豪手动往上翻</span></div>
    <div class="fix"><b>补丁二 · 另存</b><span>彭椒存进编辑器、徐立桂定期让 codex 整理进 Obsidian</span></div>
    <div class="fix"><b>补丁三 · 定时提醒</b><span>梁淼城另开定时任务，每 2–3 小时提醒"哪条会话忘了回"</span></div>
  </div>
  <div class="cx-concl"><span class="ck">结论</span><span class="cv">上下文已经成了开发者的<b>工作记忆</b>，但它只是会话的副产品：<b>不可检索、不可迁移、不可交接</b>。记忆管理应该由工具承担，而不是靠人打三种补丁。</span></div>
</div>''' % _leaks,
    '上下文成了新的工作记忆，但没人对它负责', '习惯与偏好 · 记忆的缺口', 3)

# ---------------- Y2 学会的标准 ----------------
PTS = [
    ('12%', '会用', '徐立桂', '最重要的是学会怎么用 AI', '黑盒化也无所谓'),
    ('50%', '能复现', '梁淼城', '看过代码、能自己复现', '才算学会'),
    ('88%', '亲手写', '王鹤锦', '代码我自己写，AI 只指导', '"算不算偷懒？"'),
]
_pts = ''
for x, name, who, line, note in PTS:
    _pts += ('<div class="std-pt" style="left:%s"><b>%s</b><span>%s</span>'
             '<div class="std-dot"></div><em>%s</em><i>%s</i></div>' % (x, name, who, line, note))

Y2 = slide('''
<div class="std-wrap">
  <div class="std-axis">
    <div class="std-line"></div>
    %s
  </div>
  <div class="std-quotes">
    <div class="std-q"><b>徐立桂</b>："最重要的是你学会<b>怎么用 AI</b>，AI 的能力肯定不会越来越弱。"<span>"确实对很多细节完全没有感知了，越来越多东西变成黑盒……不需要深究，让 AI 再写一遍。"</span></div>
    <div class="std-q"><b>梁淼城</b>："<b>除非我看过代码、确定自己能复现</b>，我才觉得自己是学会的，不然工程开发的时候也不关心学没学会。"</div>
    <div class="std-q"><b>王鹤锦</b>："我想学 vLLM，就让 AI 写规划，<b>代码我自己写</b>。"<span>"这些技术实现上的小问题，如果 AI 帮我做了，算不算是我偷懒了？"</span></div>
  </div>
  <div class="std-note"><b>王伟的旁观：</b>试错被跳过之后，"对那些 API 的用法，只是大致知道它是干什么的"——这正好是"会用"这一端要付的代价。</div>
  <div class="cx-concl"><span class="ck">设计含义</span><span class="cv">三种标准不是水平差异，而是<b>目标差异</b>。学习产品如果默认"会用就行"，就做不出"能复现"和"亲手写"需要的路径；反过来也一样。</span></div>
</div>''' % _pts,
    '"学会"没有统一标准：会用 / 能复现 / 亲手写', '知识与学习 · 学习的标准', 4)
