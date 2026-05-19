---
name: dashboard-gen
description: 基于 Asana 配色 + AscendOps 风格快速生成单页数据看板 HTML。当用户要求"生成 dashboard / 体验看板 / 数据看板 / 监控面板 / KPI 总览页"等单文件可视化页面时触发；也可用于把现有页面刷新成同款风格（Mode B）。
---

# Dashboard Generator · AscendOps Style

## 触发条件

- 用户要做"看板 / dashboard / 数据可视化页面 / 监控面板 / KPI 总览 / 体验度量"等单页 HTML
- 用户要把已有页面"换成 Asana 风格 / 同 AscendOps 风格 / 刷新一下配色"
- **不用于**：多页应用、需后端的工具、纯前端组件库、移动端

## 产物

单文件 HTML，原生 HTML/CSS/JS + inline SVG，无外部库（除 Google Fonts Inter + JetBrains Mono），1392px 桌面定宽。

---

## 关键参考文件（必读）

| 路径 | 用途 |
|------|------|
| `/Users/yin/dashboard-ui-design.md` | **设计规范全文** — Design tokens、组件 spec、反模式、布局栅格、字体阶梯。**生成前必读。** |
| `/Users/yin/AscendCANN-main/cann-dashboard/ascendops-experience.html` | **真实蓝本** — 1300 行完整实现，可直接复制改业务内容 |

---

## 工作流程（Mode A · 从 0 生成）

### Phase 0 · 摸清需求（不要跳过）
问用户 3 件事：
1. **业务主题**（什么数据 / 给谁看 / 解决什么问题）
2. **数据来源**（有真实 JSON/CSV 可读吗？还是全编？）
3. **要保留哪些楼层**（默认全套；非数据强相关的可砍）

### Phase 1 · 数据准备
- **有真实数据**：用 Explore subagent 摸清结构，能用真值就用真值（**至少** Hero KPI 总分、列表头部、汇总均值用真值）
- **无真实数据**：编造时合理、量级一致，副标注明"示意"

### Phase 2 · 给方案让用户确认（CLAUDE.md 硬要求）
基于 dashboard-ui-design.md 的组件清单挑 8–12 个模块，给出 ASCII 布局图 + 业务映射，让用户改 / 确认后再写代码。**视觉改动不要直接动手。**

### Phase 3 · 生成 HTML
**最高效路径**：复制 `ascendops-experience.html` 为新文件，按方案做替换：
1. CSS `:root` 不动（Asana token 全套照搬）
2. 替换 4 业务对象色家族绑定（s1 = Green / s2 = Gold / s3 = Coral / s4 = Purple）
3. 替换 Hero KPI 文案 + 数字
4. 替换 Pipeline 节点（stages） + 业务卡（scenes） + 矩阵（matrix）
5. 替换列表数据：痛点 / 仓库 / VOD
6. 折线 / 柱状图：series 数据换真值，颜色绑业务

### Phase 4 · 浏览器验证
`open <path>` 让用户看，按反馈调整。**不要自夸"完成了"** —— UI 改动只有用户在浏览器看过才算完。

---

## 工作流程（Mode B · 刷新现有页面）

1. **Read 现有 HTML** 看它的结构和当前色系
2. **诊断**：列出违反 Asana 体系的硬编码 hex、box-shadow、浏览器 chrome、过粗字重、左侧导航等反模式
3. **替换 :root** 整段为 Asana 全套 token（从 `dashboard-ui-design.md` Section 2 直接复制）
4. **用 sed 批量替换硬编码 hex**（参考下方"色彩迁移映射表"）
5. **去掉反模式**：浏览器壳 / 重阴影 / 800+ 字重的大数字 / 多余的 Bold
6. **open** 让用户验证

---

## 色彩迁移映射表（Mode B 用 sed）

```bash
# 中性
sed -i '' \
  -e 's/#F8F8F8/#F8F8F9/g' -e 's/#EEF1F5/#E1E2E4/g' -e 's/#E3E7EE/#CDCFD2/g' \
  -e 's/#F1F5F9/#EFF0F1/g' -e 's/#E5E7EB/#E1E2E4/g' -e 's/#CBD5E1/#B9BCC0/g' \
  -e 's/#9CA3AF/#A1A4AA/g' -e 's/#94A3B8/#A1A4AA/g' -e 's/#64748B/#495058/g' \
  -e 's/#475569/#495058/g' -e 's/#0F172A/#1B2432/g' \
  FILE.html

# 主色族（Tailwind → Asana）
sed -i '' \
  -e 's/#3B5BFF/#6A67CE/g' -e 's/#6F5BFF/#A177FF/g' \
  -e 's/#16A34A/#37C597/g' -e 's/#22C55E/#3BE880/g' -e 's/#15803D/#37C597/g' \
  -e 's/#10B981/#37C597/g' -e 's/#34D399/#3BE880/g' -e 's/#86EFAC/#9DFBE8/g' \
  -e 's/#E11D48/#E63838/g' -e 's/#BE123C/#E63838/g' -e 's/#EF4444/#E63838/g' \
  -e 's/#F59E0B/#FD9A00/g' -e 's/#FB923C/#FD9A00/g' -e 's/#FBBF24/#FFB900/g' \
  -e 's/#EC4899/#FC636B/g' -e 's/#F472B6/#FF6D92/g' -e 's/#FB7185/#FF6D92/g' \
  FILE.html

# Pastel light
sed -i '' \
  -e 's/#DCFCE7/#EBFCF7/g' -e 's/#FFE4E6/#FEEFF0/g' -e 's/#DBEAFE/#E8F7FB/g' \
  -e 's/#EDE9FE/#F0EFFA/g' -e 's/#FEE2E2/#FEEFF0/g' -e 's/#FEF3C7/#FFF8E5/g' \
  -e 's/#D1FAE5/#EBFCF7/g' \
  FILE.html
```

完整映射见 `dashboard-ui-design.md` 第 "应用到 AscendOps Dashboard 的迁移建议" 一节。

---

## 硬规则（不可破）

- 单文件 HTML，无外部 JS 库（chart.js、d3、echarts 都不要）
- 只用 Asana token（5 色族 × 5 层 + 10 灰阶 + Navy），禁用 Tailwind 默认色
- 卡片不加重阴影，靠 1px border + bg 分隔（hero / tooltip 例外）
- 不做浏览器 chrome 装饰（traffic light、URL bar）
- 业务大数字 48–54px / **weight 500**（不要 800/900）
- 业务对象色族 ≤ 4 个（超了改用灰底卡）
- 字体 Inter + JetBrains Mono（数字 mono）
- 顶栏全宽，无侧边导航（除非模块 > 6 个）

---

## 业务对象 ↔ 色族 绑定模板

| s | 色族 | bg (Light) | fg (Dark) | 典型语义 |
|---|------|-----------|-----------|---------|
| 1 | Green  | #EBFCF7 | #37C597 | 健康 / 已完成 / 成功类对象 |
| 2 | Gold   | #FFF8E5 | #FD9A00 | 中性 / 进行中 / 业务流类对象 |
| 3 | Coral  | #FEEFF0 | #E63838 | 警示 / 高优先级 / 风险类对象 |
| 4 | Purple | #F0EFFA | #4F4DA7 | 创新 / 探索类 / 品牌核心对象 |

---

## Banner 两种实现（生成时让用户选）

### Variant A · 卡片式 Hero（Asana Purple-Teal）
**适合**：严肃数据看板、内容紧凑、需要明确分区感
- Hero 是一张独立卡片，圆角 22px
- 背景：`linear-gradient(135deg, #D0B8FF 0%, #80E6FF 55%, #80E6FF 100%)` + 右上角白色 radial 装饰圆 + 同心圆 repeating
- 标题大字号（22px / 800 / `#4F4DA7`）、副标白蒙黑字
- 5 张玻璃 KPI 浮在卡片内
- Body 背景纯 `#F8F8F9`
- 楼层间用 `.section` 卡片区分

```css
.hero{
  background:
    radial-gradient(circle at 80% 20%, rgba(255,255,255,.55), transparent 50%),
    linear-gradient(135deg, #D0B8FF 0%, #80E6FF 55%, #80E6FF 100%);
  border-radius:22px; padding:24px 28px; position:relative; overflow:hidden;
}
.hero::before{ /* 右上同心圆 */
  content:''; position:absolute; right:-60px; top:-40px;
  width:360px; height:360px; border-radius:50%;
  background: repeating-radial-gradient(circle at center, rgba(255,255,255,.18) 0 1px, transparent 1px 12px);
}
.hero::after{ /* 右上白光 */
  content:''; position:absolute; right:60px; top:-30px;
  width:200px; height:200px; border-radius:50%;
  background: radial-gradient(circle, rgba(255,255,255,.6), transparent 70%);
}
```
**蓝本**：`examples/ascendops-experience.html`

---

### Variant B · 整页斜向渐变（Warm Multi-color, 参考 The Software House）
**适合**：偏品牌/营销感看板、希望上下贯通、希望页面有"氛围"
- Hero 去外壳：无背景、无装饰；标题用普通 `sec-title`（17px / 800 / `#1B2432`），副标 `sec-sub`
- 5 张玻璃 KPI 直接浮在 body 渐变上
- Body 用 6 段 115° 线性渐变（暖橙→紫→蓝）+ 5 层斜向白色条带 overlay 模拟平行四边形层叠
- 高度 500px（覆盖到 Hero KPI 底部），mask 渐隐到 `#F8F8F9`

```css
body{
  position:relative; min-width:1440px;
  background:
    linear-gradient(180deg, rgba(248,248,249,0) 0%, rgba(248,248,249,0) 50%, rgba(248,248,249,.85) 78%, #F8F8F9 92%) 0 0 / 100% 500px no-repeat,
    linear-gradient(115deg, #FFD7A8 0%, #F3C7BF 22%, #D9BFEE 44%, #BFB6F0 60%, #A8C0F0 78%, #BFD3F2 100%) 0 0 / 100% 500px no-repeat,
    #F8F8F9;
}
body::before{
  content:''; position:absolute; top:0; left:0; right:0; height:500px;
  background:
    linear-gradient(115deg, transparent 0%, transparent 10%, rgba(255,255,255,.20) 10%, rgba(255,255,255,.20) 18%, transparent 18%),
    linear-gradient(115deg, transparent 24%, rgba(255,255,255,.14) 24%, rgba(255,255,255,.14) 34%, transparent 34%),
    linear-gradient(115deg, transparent 46%, rgba(255,255,255,.16) 46%, rgba(255,255,255,.16) 56%, transparent 56%),
    linear-gradient(115deg, transparent 66%, rgba(255,255,255,.12) 66%, rgba(255,255,255,.12) 78%, transparent 78%),
    linear-gradient(115deg, transparent 84%, rgba(255,255,255,.18) 84%, rgba(255,255,255,.18) 95%, transparent 95%);
  mask-image: linear-gradient(180deg, #000 0%, #000 55%, transparent 90%);
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 55%, transparent 90%);
  pointer-events:none; z-index:0;
}
.browser{ position:relative; z-index:1; }

/* Hero 去壳 */
.hero{ padding:4px 4px 0; margin-bottom:22px; position:relative; }
.hero-title{ font-size:17px; font-weight:800; color:var(--text); }
.hero-sub{ font-size:12px; color:var(--text-3); margin-top:3px; font-weight:500; }

/* KPI 玻璃态加深 blur */
.glass{
  background:rgba(255,255,255,.62); backdrop-filter:blur(18px);
  border:1px solid rgba(255,255,255,.85); border-radius:18px;
  padding:22px 22px 20px; min-height:188px;
  display:flex; flex-direction:column; justify-content:space-between;
}
.glass-num{ font-size:52px; font-weight:500; color:#4F4DA7; }
```
**蓝本**：`examples/ascendops-experience-warm.html`

**选择建议**：默认问用户喜欢哪种；如果用户没明确说，看场景——内部数据/治理看板用 A，产品 landing 风格用 B。

---

## 推荐楼层模板（按上下顺序）

1. **Header** — Logo + 面包屑 + 筛选 + 搜索 + 通知 + 头像（顶栏全宽 38px）
2. **Hero**（必有）— Variant A 卡片渐变 / Variant B 整页斜向渐变 + 4–5 张玻璃态 KPI
3. **Pipeline**（可选）— 横向 stepper，N 节点，健康度色，节点间 ▶ 箭头
4. **业务对象卡**（必有）— pastel banner + 大数字 + sparkline，1×4 grid
5. **矩阵热力图**（可选）— 业务对象 × 维度，coral→gold→green 色谱
6. **环形 + 列表**（可选）— donut + star/分布列表 + KPI 区块
7. **趋势折线**（可选）— 多 series + tooltip + Day/Month/Year segment
8. **痛点 / 高优先级 bar list**（可选）— rank 徽章 + tag + bar + mono 数值
9. **明细列表**（可选）— Top/Bottom 切换 + grade pill + 渐变 bar
10. **类别条形**（可选）— 中文名 + mono 英文名 + bar + 目标线
11. **VOD / 卡片列表**（可选）— emoji + title + tag + 引言 + 来源 + 播放按钮

---

## 反例自检

写完后扫一遍，命中任何一条就回去改：
- [ ] 有没有 `box-shadow:` 在普通卡片上？
- [ ] 有没有 Tailwind 系 hex（`#3B82F6` / `#EF4444` / `#10B981` 等）？
- [ ] 大数字字重是不是写到了 700+？
- [ ] 业务对象色族用超过 4 种？
- [ ] 用了 `<emoji>` 但其他地方又用了 SVG？应该统一
- [ ] 折线图用了 chart.js / echarts？应该用纯 SVG
- [ ] 用了浏览器 chrome 装饰？删
- [ ] 卡片内文字色用了 #000？应该用 g10 `#1B2432`
