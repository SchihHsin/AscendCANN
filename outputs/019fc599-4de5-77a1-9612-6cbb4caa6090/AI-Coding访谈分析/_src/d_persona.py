# -*- coding: utf-8 -*-
"""两种典型角色：按 report-ppt-skill 的“用户画像·形式一”版式绘制。"""
from d_slides1 import slide
from avatars import AV_TASK, AV_LEARN

I_TARGET = '<svg viewBox="0 0 24 24" fill="none" stroke="#5B5BD6" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/></svg>'
I_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="#5B5BD6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12.5 3 3 5-6"/></svg>'
I_BOX = '<svg viewBox="0 0 24 24" fill="none" stroke="#5B5BD6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/></svg>'
I_ALERT = '<svg viewBox="0 0 24 24" fill="none" stroke="#5B5BD6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 3 20h18z"/><path d="M12 10v4M12 17h.01"/></svg>'


def _sc(title, desc, kind):
    if kind == 'code':
        body = ('<span class="mkl b" style="width:46%"></span><span class="mkl" style="width:78%"></span>'
                '<span class="mkl" style="width:62%"></span><span class="mkl b" style="width:30%"></span>')
    elif kind == 'term':
        body = ('<span class="mkl g" style="width:56%"></span><span class="mkl w" style="width:82%"></span>'
                '<span class="mkl w" style="width:40%"></span><span class="mkl g" style="width:68%"></span>')
    elif kind == 'doc':
        body = ('<span class="mkl b" style="width:38%"></span><span class="mkl" style="width:90%"></span>'
                '<span class="mkl" style="width:84%"></span><span class="mkl" style="width:70%"></span>')
    else:
        body = ('<span class="bub l" style="width:66%"></span><span class="bub r" style="width:52%"></span>'
                '<span class="bub l" style="width:44%"></span>')
    mock = ('<div class="pf-mk mk-%s"><div class="bar"><i></i><i></i><i></i></div>'
            '<div class="bd">%s</div></div>' % (kind, body))
    return '<div class="pf-sc">%s<div class="st">%s</div><div class="sd">%s</div></div>' % (mock, title, desc)


def _pains(items):
    return ''.join('<div class="pf-pain">%s</div>' % i for i in items)


def persona(av, name, role, reps, chips, duty, quote, blocks, scs, pains, title, sub):
    chips_html = ''.join('<span>%s</span>' % c for c in chips)
    b1, b2 = blocks
    return slide('''
<div class="pf">
  <div class="pf-side">
    <div class="pf-portrait"><img src="%s" alt=""></div>
    <div class="pf-sb head"><div class="nm">%s</div><div class="rl">%s</div></div>
    <div class="pf-chips">%s</div>
    <div class="pf-sb white"><div class="sbh">核心职责</div><div class="sbt">%s</div></div>
    <div class="pf-sb white"><div class="sbh">代表受访者</div><div class="sbt">%s</div></div>
    <div class="pf-quote">%s</div>
  </div>
  <div class="pf-r">
    <div class="pf-row">
      <div class="pf-block">
        <div class="pf-h2"><span class="ico">%s</span>什么时候找 AI</div>
        <div class="pf-pains">%s</div>
      </div>
      <div class="pf-block">
        <div class="pf-h2"><span class="ico">%s</span>怎么算做完</div>
        <div class="pf-pains">%s</div>
      </div>
    </div>
    <div class="pf-block">
      <div class="pf-h2"><span class="ico">%s</span>典型场景与工具</div>
      <div class="pf-scs">%s</div>
    </div>
    <div class="pf-block">
      <div class="pf-h2"><span class="ico">%s</span>核心痛点</div>
      <div class="pf-pains">%s</div>
    </div>
  </div>
</div>''' % (av, name, role, chips_html, duty, reps, quote,
             I_TARGET, _pains(b1), I_CHECK, _pains(b2), I_BOX, scs, I_ALERT, _pains(pains)), title, sub, 1)


P_STU = persona(
    AV_LEARN, '高校学生', '课题 / 论文 / 实习 demo 驱动', '徐立桂（南大研二）· 梁淼城（南大四）· 王鹤锦（杭电研三）',
    ['自费额度', '无 root', '租卡 / 远程环境', 'Codex · Claude Code', '导师与同门'],
    '把课题、课程或实习里的任务做成能交的东西：跑通、有结果、能写进报告或论文。',
    '"一个窗口实现，一个窗口验收。" —— 徐立桂',
    (['遇到不懂的机制，想让 AI 先讲清楚',
      '想快速验证一个方向可不可行',
      '改开源仓库、复刻别人的项目',
      '赶 demo、交作业，需要先跑起来'],
     ['benchmark 对 baseline',
      '实验有提升，且能自己复现',
      '不是"跑过一次"，是"下次还能做出来"']),
    _sc('复现开源项目', 'Codex · 仓库', 'code') + _sc('算子生成', 'HiDevLab · CANN 9.1.0', 'term') +
    _sc('论文选题', 'Codex · 文献', 'doc') + _sc('课程与作业', 'Claude Code', 'chat'),
    ['算力申请不到，环境在远程，Agent 接不上',
     '目标宽泛，没有可验证的完成标准',
     '过度设计、跑偏，缺判据',
     '缺错误样例，中文线索要自己搜',
     '额度不够，多 Agent 用不起'],
    '高校学生：一边学一边做，完成标准是"能复现"', '角色与旅程 · 画像一（学生）')

P_EMP = persona(
    AV_TASK, '企业新员工', '刚在真实项目里承担任务，靠 AI 补经验', '王伟（AI 使用 5 个月）· 郑雨豪（半年）· 彭椒（2023 起）',
    ['AI 使用 < 1 年', '算子 / 测试', '内部 Skill', '黄区', 'committer 检视'],
    '把需求单做成能合入的东西：精度过 golden、性能对 baseline、代码能被检视——但很多原理是边做边补的。',
    '"对于新手来说，只能许愿式编程……遇到搞不定的，去问大佬，问完自己像个路由器，再把大佬的话转给 AI。" —— 王伟',
    (['接需求，先照着别人的详设写一版',
      '遇到不懂的机制，先问 AI 要个说法',
      '精度调不通，看 thought 判断方向',
      '功能做完后清理 AI 写的封装'],
     ['精度：对 CPU golden 的最大 / 平均相对误差',
      '性能：对 baseline 达标',
      '测试通过，且能过 committer 检视']),
    _sc('算子开发', 'Cursor · 详设 + API 链接', 'code') + _sc('测试脚本', '毕方 · 直连服务器', 'term') +
    _sc('问题单 / Issue', 'Trae', 'chat') + _sc('精度调优', 'MindStudio Insight · msOpProf', 'doc'),
    ['需求模糊，"只给一个完成度 10% 的版本"',
     '单个 API 有文档，API 之间怎么配合没有',
     '精度调不通，AI 开始"左右脑互搏"',
     '原理理解少，出问题得先问人再转给 AI',
     '可读性差，大工程要拆 10 个 PR 才能检视'],
    '企业新员工：靠 AI 补经验，但完成标准仍是"过测试、能检视"', '角色与旅程 · 画像二（企业新员工）｜ 注：记录未含入职年限，此处按 AI 使用 < 1 年定义')
