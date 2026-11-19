# -*- coding: utf-8 -*-
from d_slides1 import slide

_tracks = [
    ('s', '学生 · 开发', 'S6', [
        ('目标宽泛、没有验收标准', '资源申请不到、环境在远程', '过度设计、方向跑偏', '缺错误样例、中文线索要自己搜', '经验散在对话里')]),
    ('s', '学生 · 学习', 'S7', [
        ('不知道从哪开始、没有路线', '资料口径不一、版本对不上', '听懂了但写不出', '排错被 AI 代劳', '知识仍是单点')]),
    ('e', '企业 · 开发', 'S8', [
        ('需求模糊，只拿到 10% 版本', 'API 组合用法没有文档', '精度调不通、左右脑互搏', '性能不达标 + 代码冗余', '可读性差、交接要 AI 再读')]),
    ('e', '企业 · 学习', 'S9', [
        ('任务压着，没时间系统学', '黄区资料 AI 拿不到', 'AI 用旧经验答，照改必错', '试错被跳过，原理说不清', '业务一迭代 Skill 就过期')]),
]
_sub = ['01 定题 / 卡点', '02 上下文 / 环境', '03 方案 / AI 执行', '04 验证 / 纠偏', '05 交付 / 沉淀']
_head = ('<div class="trk-head"><div></div><div class="trk-hs">%s</div></div>'
         % ''.join('<span>%s</span>' % x for x in _sub))

_rows = ''
for g, name, sid, cells in _tracks:
    if len(cells) == 1 and isinstance(cells[0], tuple):
        cells = list(cells[0])
    pts = ''
    for i, c in enumerate(cells):
        x = 10 + i * 20
        pts += ('<span class="trk-pt" style="left:%d%%"></span>'
                '<span class="trk-lb %s" style="left:%d%%">%s</span>'
                % (x, 'up' if i % 2 == 0 else 'dn', x, c))
    _rows += ('<div class="trk"><div class="trk-lab%s">%s<small>%s</small></div>'
              '<div class="trk-line">%s</div></div>'
              % (' e' if g == 'e' else '', name, sid, pts))

_concl = ('<div class="cx-concl" style="margin-top:1.6vh"><span class="ck">共同骨架</span>'
          '<span class="cv">四段旅程都走"定目标 → 备上下文 → AI 执行 → 验证纠偏 → 交付沉淀"，'
          '但卡点性质不同：<b>学生卡在条件</b>（算力、环境、样例），<b>企业卡在标准与交接</b>'
          '（验收阈值、API 组合、可读性）。三个结构性缺口贯穿全程：上下文装配、过程可见、证据链。</span></div>')

S10 = slide('<div class="trk-wrap">' + _head + _rows + '</div>' + _concl,
            '四段旅程走同一条五阶段骨架，痛点落在不同环节',
            '角色与旅程 · 旅程对照', 1)
