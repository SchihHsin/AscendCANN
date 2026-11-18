# -*- coding: utf-8 -*-
from d_slides1 import slide

NODES = [
    (66, '触发', '任务卡住 / 起意', '#1F4B4A'),
    (216, '检索', '论文 / 文档 / 人', '#3E4A63'),
    (366, '可信判断', '离执行多近', '#7A6A4F'),
    (516, '内化', '自己写 / 复现', '#2E6E6B'),
    (666, '沉淀', 'md / 文档 / Skill', '#1F4B4A'),
]
_cy = 108
_r = 46
_parts = []
for cx, name, sub, color in NODES:
    _parts.append(
        '<g><circle cx="%d" cy="%d" r="%d" fill="%s"/>'
        '<text x="%d" y="%d" text-anchor="middle" font-size="13" font-weight="600" fill="#fff">%s</text>'
        '<text x="%d" y="%d" text-anchor="middle" font-size="9.5" fill="rgba(255,255,255,.78)">%s</text></g>'
        % (cx, _cy, _r, color, cx, _cy - 3, name, cx, _cy + 14, sub))
_arrows = ''
for i in range(4):
    x1 = NODES[i][0] + _r + 3
    x2 = NODES[i + 1][0] - _r - 8
    _arrows += ('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#8D97A5" stroke-width="1.6" marker-end="url(#fa)"/>'
                % (x1, _cy, x2, _cy))
_loop = '''<svg viewBox="0 0 732 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <defs><marker id="fa" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
    <path d="M0,0 L8,4 L0,8" fill="none" stroke="#8D97A5" stroke-width="1.4"/></marker>
    <marker id="fb" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
    <path d="M0,0 L8,4 L0,8" fill="none" stroke="#C4693F" stroke-width="1.4"/></marker>
  </defs>
  %s
  %s
  <path d="M666 %d L666 206 Q666 222 648 222 L84 222 Q66 222 66 206 L66 %d"
        fill="none" stroke="#C4693F" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#fb)"/>
  <text x="366" y="240" text-anchor="middle" font-size="10" fill="#B3403A">下一次任务从这里重新进来</text>
</svg>''' % (''.join(_arrows), ''.join(_parts), _cy + _r, _cy + _r)

S16 = slide('''
<div class="kl">
  <div class="kl-left">
    %s
    <div class="kl-note">知识不是"学完存起来"，而是在任务里被反复调用：卡点触发、检索、判断可信、自己写一遍、再落回文件。</div>
  </div>
  <div class="kl-right">
    <div class="kl-cap">可信度不按"文档等级"排，而按<b>离执行有多近</b>排——六个人各自独立给出的同一条经验。</div>
    <div class="auth">
      <div class="auth-i a1"><div class="k">1</div><div class="bx">代码 / 头文件 / 运行输出<small>"那个毕竟是代码，所以那个是最真实的"（徐立桂）</small></div></div>
      <div class="auth-i a2"><div class="k">2</div><div class="bx">官方文档与 API 说明<small>王伟：把 API 链接放进详设，别让它猜</small></div></div>
      <div class="auth-i a3"><div class="k">3</div><div class="bx">第三方加工内容（CSDN / 知乎）<small>梁淼城：官方 search 偏国外，最后在 CSDN 找到</small></div></div>
      <div class="auth-i a4"><div class="k">4</div><div class="bx">AI 生成的解释与来源<small>郑雨豪：以前给的来源"都是他自己编的"</small></div></div>
    </div>
    <div class="kl-chips">
      <div class="chip warn"><i></i>三种典型失真：编函数名 / CUDA 思维写昇腾 / 旧经验套新业务</div>
      <div class="chip mute"><i></i>获取不到 ≠ 不可信：黄区、沐曦生态、昇腾版本都会让"可信源"直接消失</div>
    </div>
  </div>
</div>''' % _loop,
    '知识从"卡点"进来，靠"离执行最近"的证据站住，最后落回文件', '知识与学习 · 获取、可信与沉淀', 4)
