# -*- coding: utf-8 -*-
"""两类典型角色：用户画像·形式三（左紫栏档案 + 右便利贴墙）。"""
from d_slides1 import slide
from avatars import AV_TASK, AV_LEARN


def _notes(items):
    return ''.join('<div class="up-note %s">%s</div>' % (c, t) for c, t in items)


def _pl(rows):
    o = '<div class="up-card"><div class="up-label">工作方式</div>'
    for left, right, pct in rows:
        o += ('<div class="up-pl"><div class="track"><span class="dot" style="left:%s%%"></span></div>'
              '<div class="ends"><span>%s</span><span>%s</span></div></div>' % (pct, left, right))
    return o + '</div>' 


def _mot(rows):
    return ('<div class="up-card"><div class="up-label">动机</div><div class="up-mot">' +
            ''.join('<div><div class="row"><span>%s</span><em>%s%%</em></div><div class="bar"><i style="width:%s%%"></i></div></div>'
                    % (k, v, v) for k, v in rows) + '</div></div>')


def _dots(rows):
    o = '<div class="up-card"><div class="up-label">熟练度 / 关注</div><div class="up-dots">'
    for name, n in rows:
        ds = ''.join('<i class="on"></i>' if i < n else '<i></i>' for i in range(5))
        o += '<div class="row"><span>%s</span><span class="d">%s</span></div>' % (name, ds)
    o += '</div><div class="up-chips">%s</div></div>' % ''.join('<span>%s</span>' % c for c in ['本地 IDE', 'CLI', '远程', '多窗口'])
    return o


def _wall(label, items, span=''):
    return ('<div class="up-card %s"><div class="up-label">%s</div><div class="up-wall">%s</div></div>'
            % (span, label, _notes(items)))


def persona(av, name, role, fields, bio, tags, cards, problems, fixes, title, sub):
    side = ''.join('<div class="up-f"><b>%s</b><span>%s</span></div>' % (k, v) for k, v in fields)
    tag_html = ''.join('<div class="up-tag">%s</div>' % t for t in tags)
    body = '''
<div class="up">
  <div class="up-side">
    <div class="up-portrait"><img src="__AV__" alt=""></div>
    <div><div class="up-name">__NAME__</div><div class="up-role">__ROLE__</div></div>
    <div class="up-fields">__FIELDS__</div>
    <div class="up-bio">__BIO__</div>
    <div class="up-notes">__TAGS__</div>
  </div>
  <div class="up-grid">
    __CARDS__
    __PROBLEMS__
    __FIXES__
  </div>
</div>'''
    body = (body.replace('__AV__', av).replace('__NAME__', name).replace('__ROLE__', role)
            .replace('__FIELDS__', side).replace('__BIO__', bio).replace('__TAGS__', tag_html)
            .replace('__CARDS__', cards).replace('__PROBLEMS__', problems).replace('__FIXES__', fixes))
    return slide(body, title, sub, 1)


P_STU = persona(
    AV_LEARN, '高校学生', '课题 / 论文 / 实习 demo 驱动',
    [('身份', '研二 / 大四 / 研三'), ('AI 使用', '1–3 年'), ('入口', 'Codex · Claude Code'), ('算力', '自费 · 租卡')],
    '把课题、课程或实习里的任务做成能交的东西：跑通、有结果、能写进报告或论文。',
    ['自费额度', '无 root', '远程 / 租卡', '导师与同门'],
    _pl([('先想清楚', '先跑起来', 68), ('一个人', '找人讨论', 45), ('本机', '远程 / 租卡', 75)]) + _mot([('学会怎么做', 70), ('交出能用的结果', 85), ('探一个方向', 60), ('省时间', 80)]) +
    _wall('目标 / 痛点', [('y', '跑通一个能复现的结果'), ('y', '论文 / 作业能交'), ('y', '方向值得做'), ('r', '算力与环境申请不到'), ('r', '目标没有验收标准'), ('r', '额度不够')]) +
    _dots([('编码', 4), ('环境', 2), ('调试', 3), ('领域', 2), ('复现', 3)]),
    _wall('问题', [('r', '环境在远程，Agent 接不上'), ('r', '同一个错下次还会踩'), ('y', '额度见底就换便宜模型')], 'span2'),
    _wall('解法', [('g', '环境一键就绪 + 可回滚'), ('g', '验收标准模板：什么叫做完'), ('b', '错误样例库：这么写会怎么错')], 'span2'),
    '高校学生：一边学一边做，完成标准是"能复现"', '角色与旅程 · 画像一（学生）')

P_EMP = persona(
    AV_TASK, '企业新员工', '刚在真实项目里承担任务，靠 AI 补经验',
    [('身份', '算子 / 测试 / 工具'), ('AI 使用', '< 1 年'), ('入口', 'Cursor · Trae · 毕方'), ('环境', '组织采购 · 黄区')],
    '把需求单做成能合入的东西：精度过 golden、性能对 baseline、代码能被检视——但很多原理是边做边补的。',
    ['内部 Skill', '黄区', 'committer 检视', '自费补强'],
    _pl([('先想清楚', '先跑起来', 42), ('一个人', '找人讨论', 60), ('本机', '远程 / 黄区', 55)]) + _mot([('过测试、能合入', 90), ('尽快上手', 80), ('弄懂原理', 50), ('少返工', 75)]) +
    _wall('目标 / 痛点', [('y', '精度 + 性能双达标'), ('y', '过 committer 检视'), ('y', '尽快上手'), ('r', '需求模糊，只给 10% 版本'), ('r', '原理理解少，得先问人'), ('r', '清理封装又一天')]) +
    _dots([('编码', 3), ('环境', 2), ('调试', 2), ('领域', 1), ('工具链', 3)]),
    _wall('问题', [('r', 'API 之间怎么配合没人写'), ('r', '精度调不通，AI 左右脑互搏'), ('r', '清理 AI 封装又花一天')], 'span2'),
    _wall('解法', [('g', '详设模板 + API 链接预置'), ('b', '交接信号：该不该喊停'), ('g', '可回滚 + 可审计的授权')], 'span2'),
    '企业新员工：靠 AI 补经验，但完成标准仍是"过测试、能检视"',
    '角色与旅程 · 画像二（企业新员工）｜ 注：记录未含入职年限，此处按 AI 使用 < 1 年定义')
