# -*- coding: utf-8 -*-
"""两类典型角色：report-ppt-skill 用户画像·形式二（顶栏 + 三栏 + 雷达）。"""
import math
from d_slides1 import slide
from avatars import AV_TASK, AV_LEARN

DIMS = ['自建上下文', '环境依赖', '成本敏感', '评审压力', '验证严格度', '学习动机']
STU = [5, 4, 5, 2, 3, 4]
EMP = [5, 3, 3, 5, 5, 2]


def _poly(vals, cx=210, cy=190, R=120):
    out = []
    for i, v in enumerate(vals):
        a = math.radians(-90 + i * 60)
        r = R * v / 5
        out.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return ' '.join('%.1f,%.1f' % p for p in out)


def _rings():
    o = ''
    for v in (1, 2, 3, 4, 5):
        pts = []
        for k in range(6):
            a = math.radians(-90 + k * 60)
            r = 120 * v / 5
            pts.append((210 + r * math.cos(a), 190 + r * math.sin(a)))
        o += '<polygon points="%s" fill="none" stroke="#DCE1E8" stroke-width="1"/>' % ' '.join('%.1f,%.1f' % p for p in pts)
    for k in range(6):
        a = math.radians(-90 + k * 60)
        o += '<line x1="210" y1="190" x2="%.1f" y2="%.1f" stroke="#E4E8EE" stroke-width="1"/>' % (210 + 120 * math.cos(a), 190 + 120 * math.sin(a))
    return o


def _labels():
    o = ''
    for i, d in enumerate(DIMS):
        a = math.radians(-90 + i * 60)
        x, y = 210 + 146 * math.cos(a), 190 + 146 * math.sin(a)
        anchor, dy = 'middle', 0
        if i in (1, 2):
            anchor, x = 'start', x + 4
        elif i in (4, 5):
            anchor, x = 'end', x - 4
        if i == 0:
            dy = -4
        elif i == 3:
            dy = 12
        o += '<text x="%.1f" y="%.1f" font-size="10.2" fill="#5E646E" text-anchor="%s">%s</text>' % (x, y + dy, anchor, d)
    return o


RADAR = ('<svg viewBox="0 0 420 380" class="cmp-radar-svg">' + _rings() + _labels() +
         '<polygon points="' + _poly(STU) + '" fill="rgba(14,124,134,.16)" stroke="#0E7C86" stroke-width="2"/>' +
         '<polygon points="' + _poly(EMP) + '" fill="rgba(75,75,168,.14)" stroke="#4B4BA8" stroke-width="2" stroke-dasharray="6 3"/>' +
         '</svg>')

BODY = '''
<div class="cmp">
  <div class="cmp-top">
    <div class="cmp-p">
      <img src="__LEARN__" alt="">
      <div class="cmp-pt">
        <b>高校学生</b>
        <span>课题 / 论文 / 实习 demo</span>
        <i>"一个窗口实现，一个窗口验收。"</i>
      </div>
    </div>
    <div class="cmp-p">
      <img src="__TASK__" alt="">
      <div class="cmp-pt">
        <b>企业新员工</b>
        <span>需求 / 指标 / 合入</span>
        <i>"遇到搞不定的，问完大佬再转给 AI。"</i>
      </div>
    </div>
  </div>
  <div class="cmp-lead">同一个动作（把任务写清楚 + 验收），落在两种完成标准上：学生要<b>能复现</b>，企业要<b>能合入</b>。</div>
  <div class="cmp-body">
    <div class="cmp-col">
      <div class="cmp-k">技术背景</div>
      <div class="cmp-two">
        <div>
          <b>学生</b>
          <ul><li>研究 / 课程 / 实习任务</li><li>自费额度、无 root、租卡</li><li>Codex · Claude Code</li><li>导师与同门是主要求助对象</li></ul>
        </div>
        <div>
          <b>企业</b>
          <ul><li>需求单 / 指标 / 合入</li><li>组织采购、黄区、内部 Skill</li><li>Cursor · Trae · 毕方</li><li>committer 决定能不能合入</li></ul>
        </div>
      </div>
      <div class="cmp-q">"最耗费时间的就提目标。" —— 王鹤锦</div>
    </div>
    <div class="cmp-col radar">
      <div class="cmp-k">关键差异（研究者编码 1–5）</div>
      __RADAR__
      <div class="cmp-lg"><span class="a">学生</span><span class="b">企业新员工</span></div>
    </div>
    <div class="cmp-col">
      <div class="cmp-k">卡在哪</div>
      <div class="cmp-two">
        <div>
          <b>学生</b>
          <ul class="pain"><li>算力与环境是硬门槛</li><li>目标没有可验证标准</li><li>缺错误样例</li><li>额度不够，多 Agent 用不起</li></ul>
        </div>
        <div>
          <b>企业</b>
          <ul class="pain"><li>需求模糊、API 组合无文档</li><li>精度互搏、清理耗时</li><li>评审也在外包给 AI</li><li>可读性差，拆 10 个 PR 才能检视</li></ul>
        </div>
      </div>
      <div class="cmp-q">"需求描述比较模糊的话，它只会给你一个完成度 10% 的版本。" —— 王伟</div>
    </div>
  </div>
</div>'''

CMP = slide(BODY.replace('__LEARN__', AV_LEARN).replace('__TASK__', AV_TASK).replace('__RADAR__', RADAR),
            '两类角色：一个在学、一个刚上手，完成标准完全不同', '角色与旅程 · 双角色画像', 1)
