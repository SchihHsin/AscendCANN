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

所有路径都相对本 skill 目录解析；不要使用 `/Users/yin/...` 这类作者本机绝对路径。

| 路径 | 用途 |
|------|------|
| `./dashboard-ui-design.md` | **设计规范全文** — Design tokens、组件 spec、反模式、布局栅格、字体阶梯。**生成前必读。** |
| `./examples/ascendops-experience.html` | **Variant A 真实蓝本** — 完整实现，可直接复制改业务内容 |
| `./examples/ascendops-experience-warm.html` | **Variant B 真实蓝本** — 暖色整页渐变版本 |

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

**高还原要求**：当用户说"同款 / 还原 / 按这个 skill 优化 / AscendOps 风格"时，必须从 `examples/ascendops-experience*.html` 复制成新文件再迁移业务数据。不要在已有页面 CSS 上局部打补丁，也不要保留已有 ECharts/Chart.js 图表实现。

### Phase 4 · 浏览器验证
`open <path>` 让用户看，按反馈调整。**不要自夸"完成了"** —— UI 改动只有用户在浏览器看过才算完。

---

## 工作流程（Mode B · 刷新现有页面）

**dashboard-gen 是一套视觉 theme，刷新只换皮、不动业务内容。**
刷新 = 给现有页面套上 AscendOps 视觉系统。原页面的每个 section、每张表格、每段正文、每个列表项、链接、交互——一条不删、不重排、不压缩、不"概括"。改的只有视觉层。

> ⚠️ 最常见、最严重的错误：把内容型页面（报告 / 分析 / 文档）硬塞进 `examples` 蓝本的固定楼层（Hero/Pipeline/矩阵/图表/VOD），导致明细表、正文、证据被丢光。这是失败，不是"高还原"。**蓝本是视觉参考，不是内容模具。**

### 铁律
- 刷新后页面信息量 = 原页面信息量。少一张表 / 少一段正文 / 把内容裁进固定楼层，都算失败。
- 不重建页面结构。原页面是报告就还是报告、是工具就还是工具，DOM 与楼层顺序保持。
- `examples/*.html` 是视觉规范的样板，**不是要往里灌数据的模板**。只有 Mode A 从 0 新建看板才复制蓝本。

### 步骤
1. Read 现有 HTML，`<body>` 内容与 DOM 结构原样保留。
2. 重写 `<style>`：`:root` 换 Asana token（见 `dashboard-ui-design.md` 第 2 节）；原类名沿用，逐条把视觉换成本规范的组件 spec。
3. 视觉一定要做足 —— 换肤 ≠ 变素，见下方「视觉 richness 清单」。
4. 旧页面若用 ECharts/Chart.js/d3，就地改写成 inline SVG，数据不变。
5. 加 Inter + JetBrains Mono 字体；硬编码 hex 按「色彩迁移映射表」替换。
6. 做 selector 命中审计：不要只追加通用 `.card/.section/.hero` 覆盖；必须列出并命中原页面真实 root / topbar / KPI / 图表 / JS template selector。
7. 跑下方「反例自检」，内容项或视觉项命中就回去改。

### 视觉 richness 清单（换肤必须全部做到，否则没做完）
- [ ] 页面顶部 hero / banner 用紫青渐变背景 + 同心圆 / 光晕装饰（见 Variant A），不是白底卡
- [ ] 核心 KPI / 主要摘要可以做成玻璃态 KPI 卡或 pastel 彩卡；次要元信息不要强行卡片化
- [ ] 表格做可视化：数值配色阶 / 进度条 / heatmap 单元格 / 评分胶囊；表头不要死灰底，行分隔不要靠整条横线堆叠
- [ ] KPI 大数字必须命中 48–54px / weight 500；不要停留在原页面 20–28px 小号运营看板数字
- [ ] SVG / inline chart 必须同步放大真实输出尺寸；不要只 CSS 放大容器，JS 仍生成 120–180px 小图
- [ ] section 标题、卡片、列表项、角色块配 inline SVG icon
- [ ] 评分 / 状态 / 分类用 Asana 多彩 token（5 色族），不是一片灰
- [ ] 主导航 / active tab / primary action 用 Purple/Teal 这类产品主色；CANN 字标可保留品牌红，但 Coral 不得被当作全页 active 高亮色
- [ ] 用渐变、色阶、pastel banner、装饰圆撑出层次与氛围，避免整页发白发素

### Selector 命中审计（Mode B 必做）
- 找出页面真实布局根：例如 `.topbar`、`.filter-bar`、`.kpi-strip`、`.main-body`、`.scene-detail`、`.radar-section`，不要假设一定有 `.browser` / `.container` / `.section`。
- 命中后先判定层级：`.main-body`、`.scene-detail`、`.workspace`、`.app-shell` 等业务根通常是 L1 shell，必须 plain；不要放进通用 `.card` 选择器。L2 才是内部图表、证据块、KPI、列表对象。
- 顶部页签要按真实控件修：一级产品 tabs 不要撑满 toolbar 高度，active 胶囊通常 36–44px 高；二级筛选 chips 可居中或与内容 rail 对齐，不能局促挤在左上角。
- 宽度规则必须落在真实 root 上：顶部若是产品工具栏，要么全 viewport 宽，要么与内容 rail 对齐；不能出现页面两侧背景露出而 toolbar 只是一条局促居中窄条。
- 字体尺度必须查 computed result：topbar/筛选/列表/图表 label 不能仍是 10–11px；KPI 数字不能仍是 22px。
- 图表要检查生成函数：`trendSvg(...)`、`radarSvg(...)`、canvas/SVG viewBox、legend 字号和容器高度都要一起改；只改 CSS 容器通常无效。
- 语义色变量要拆开：`--brand/--primary` 用 Purple/Teal，`--risk/--bad` 用 Coral，`--warn` 用 Gold；不要用一个 `--accent` 同时当品牌高亮和风险色。
- 截图至少检查首屏、核心图表楼层、交互展开后的 JS-rendered template；如果截图里图表过扁、被裁或文字不可读，不能交付。

### 容器审计算法（避免 AI 味卡片泛滥）
刷新完成前必须从上到下做一次容器审计，包含静态 HTML 和 JS/render template 里的楼层：
1. 列出所有可见楼层：`header / nav / section / generated section / table / list / card / callout`。
2. 给每层标角色：`control` 导航控制、`structure` 标题说明、`auxiliary` 口径/公式/备注、`data` 表格/KPI/图表、`entity` persona/角色/仓库等重复业务对象。
3. 每个区域只选一个 visual owner：要么外层 section 有容器，要么内部 content/data/entity 有容器，不能两者同时有。
4. 若某楼层内部已经有 bordered table、KPI、图表或列表行，父级 section 必须是 plain section；工具页的 `.scene-detail` / `.workspace` 这类选中态业务根也按 L1 plain 处理。
5. 扫描 CSS 选择器：`section`、`.card`、`.panel`、`.toc`、`.tabs`、`.raw-list a`、JS 模板里的 `<section>` 和 `<div class="card">`，去掉默认背景/描边。
6. 递归检查：任何 `background + border + radius` 节点里面，不允许再出现另一个 `background + border + radius` 内容容器；表格内部行分隔线除外。
7. 单独审计次要 meta 信息：报告日期、扫描基线、工作区、数据来源、原始文件、版本号、更新时间、覆盖数等只用 bullets / `dl` / inline text；禁止做成多个 `meta-card`、竖向卡片栈或小卡片网格。

### 容器层级规则
- 先判断元素角色：导航 / tabs / TOC 是控制层，标题 + 说明是结构层，公式解释是辅助层；这些默认无背景、无描边、无外壳。
- 信息层级决定容器层级，不是所有内容都需要卡片。核心 KPI、主要对比、insight summary、可操作列表才用 card/background。
- section 不是默认 card。楼层外壳保持 plain；如果这一层有完整结论、摘要洞察、KPI 指标，把背景给内容对象本身，而不是给整个 section。
- `总体结论`这类完整 insight object 应该用内部 soft background card 承接正文与列表；方法说明、导航区保持页面底色。
- 页面/section 已经有 `border + radius` 时，内部解释区优先用纯文字、定义列表、轻量分隔线或无边框 group；不要再套一层 card。
- 同一视觉区域最多保留 1 层主边框；允许表格自身有 1px 外框，但不要形成 `section > card > table > row border` 的厚重套娃。
- Hero 里的次要元信息（如报告日期、扫描基线、工作区、角色数、覆盖数、原始数据链接）用 bullets / `meta-line` / `dl` / inline text 排版；只有业务大数字或关键状态才使用玻璃 KPI 卡。
- Tabs / TOC 禁止外层大圆角描边容器；用无壳横排链接，最多给单个 tab 一个轻量 selected / hover 背景。
- Persona / 角色详情这类 entity 楼层：外层如果只是分组标题，必须 plain；`相关仓库`、`综合评分`这类 KPI summary 应该有轻量背景卡；内部分析、证据、链接用无边框 group，评分表本身可作为主要数据对象。
- Raw links / 文件列表不是卡片墙；用文本行、轻量图标和 hover 颜色即可，默认无描边、无填充。
- 视觉 richness 来自渐变、色阶、icon、排版节奏和数据可视化，不来自给每段内容都加圆角边框。

### 楼层区分规则（不用卡片也要有层级）
- plain section 之间用 32–64px 的垂直间距、清晰标题、subheader、轻量 hairline / 渐变分隔线建立节奏。
- 分隔线是 layout 线，不是容器边框：只放在 section 顶部，1px 或 2px，颜色淡，不能包住内容。
- Persona / 角色楼层可用角色色短渐变 hairline 做起始标记；不要用整块背景或大圆角外框。
- 相邻楼层若区分度低，优先增加 `margin-top`、标题组间距、section 顶部 hairline；不要退回卡片壳。

### 表格视觉规则
- 表格是数据对象，可以有唯一外边界，但表头不要用大面积灰底；优先用白底/透明底 + 小号 uppercase label + 彩色短线/淡 tint。
- 不要用一排排深灰横线切割所有行；用留白、行组 gap、淡色背景块、局部列分隔或 hover tint 来组织扫描。
- 表格里已经有 score pill、bar、heatmap 时，减少额外边框；让数值可视化承担层级。
- 表头和 body 不要像原生后台表格：避免 `thead background: #eee`、每行 `border-top:1px solid`、厚重 cell grid。

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
- **Mode A 新建看板**用桌面定宽框架：`<meta name="viewport" content="width=1440">`、`body{min-width:1440px}`、`.browser{width:1392px;margin:0 auto}`
- **Mode B 刷新**沿用原页面的 DOM 与楼层顺序，不重排内容；但视觉宽度必须落到真实页面 root selector，原页面过窄时按 AscendOps 桌面 rail 修正
- 只用 Asana token（5 色族 × 5 层 + 10 灰阶 + Navy），禁用 Tailwind 默认色
- 卡片 / 表格 / 容器不用 border 外框，靠底色 + 圆角 + 极淡 `--shadow-soft` + 留白区分；玻璃卡细白描边、文字列表 hairline 可例外
- 卡片 / callout / 区块**禁止任何边缘高亮描边**：包括 `border-left/top/right/bottom` 色带、inset edge shadow、看起来像描边的顶部色条；用背景、分组标题、胶囊和数值可视化区分
- 避免容器套娃：普通 section 内不要再给解释性内容套 card；次要元信息直接文字排版
- 导航 tabs、TOC、方法说明、标题说明区默认无外框、无背景填充
- 所有 JS-rendered template 也必须过容器审计；不要只改静态 HTML 首屏
- 表格禁止死板灰表头 + 整行横线堆叠；改为轻量表头、行间留白、局部 tint 和数值可视化
- 楼层之间不能因为去卡片而糊成一片；用大间距、subheader、顶部 hairline / 渐变线区分，不用外框
- 不做浏览器 chrome 装饰（traffic light、URL bar）
- 业务大数字 48–54px / **weight 500**（不要 800/900）
- 业务对象色族 ≤ 4 个（超了改用灰底卡）
- 字体 Inter + JetBrains Mono（数字 mono）
- 顶栏全宽，无侧边导航（除非模块 > 6 个）

---

## 图表样式补充：Roadmap / 流程图谱（方案 C）

- 用于学习路径、依赖路径、任务 DAG、能力路线图；默认优先方案 C，而不是竖向卡片列表。
- 画布宽度 900–960px；阶段用淡色底带区分，节点用白底 soft card；节点最小高度约 108px，卡片内 padding 18–20px。
- 同阶段节点 gap 22–28px；同阶段上下层 `cgap >= 80px`；阶段间 `inter >= 96px`，必须给 SVG 贝塞尔依赖线留空间。
- 连线只用 inline SVG：source bottom center → target top center，纵向贝塞尔，stroke 1.6–1.8，按阶段色走线；次要依赖用 dashed。
- 节点只保留一层视觉 owner，禁止“阶段卡 > 节点描边卡 > 内部小卡”套娃；阶段归属用阶段淡色底、phase label、tag 色和连线颜色表达，禁止顶部/左侧/任意边缘色带或 inset edge shadow。

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

**互斥规则**：Variant A 和 Variant B 只能二选一，不能叠加。
- 选 Variant A：`.hero` 是唯一 banner，body 背景必须是纯 `#F8F8F9`，不要加 `body::before` 暖色斜向条带。
- 选 Variant B：body 是唯一 banner，`.hero` 必须去外壳（`background:transparent; border:0; box-shadow:none; border-radius:0`），不要再给 `.hero` 或 `.cover` 加渐变背景 / 斜向白条。
- 自检必须同时扫 `body` / `body::before` 和 `.hero` / `.cover`：如果两边都有渐变或装饰条，就是双 banner，必须删一边。

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

> 仅 Mode A 从 0 新建看板时套用；Mode B 刷新沿用原页面楼层，不套这套模板。

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
- [ ] 【Mode B】刷新后是否丢了原页面任何 section / 表格 / 正文段落 / 列表 / 链接？丢了 = 失败，回退重做
- [ ] 【Mode B】是否把内容型页面重建成了 KPI 看板、或改了楼层结构？应只换视觉、不动结构
- [ ] 视觉够不够：有没有渐变 banner、彩色、icon、可视化表格？整页发白发素 = 没做完
- [ ] 有没有把次要元信息（报告日期 / 扫描基线 / 工作区 / 数据来源 / 角色数 / 覆盖数 / 原始数据）做成多个竖向卡片？应改成 bullets / `dl` / 文字型 meta
- [ ] Mode B 是否只是追加了通用覆盖，而没有命中原页面真实 selector（如 `.topbar/.kpi-strip/.radar-section`）？必须逐个 selector 修正
- [ ] 真实 selector 命中后是否误把 L1 shell（如 `.main-body/.scene-detail/.workspace/.app-shell`）放进 `.card` 组？L1 必须 plain，L2 内容对象才卡片化
- [ ] 顶部工具栏是否宽度局促、没有适配完整页面宽度或内容 rail？必须修正真实 toolbar/root 宽度
- [ ] 顶部页签高度是否撑满整条 toolbar、二级 chips 是否局促偏左？一级 tabs 36–44px，二级筛选按 rail 居中或对齐
- [ ] KPI / hero 数字是否仍是 20–28px 小字或 700/800 粗字？应为 48–54px / weight 500
- [ ] 图表是否仍由 JS 输出 120–180px 小 SVG，导致过小、过扁或展示不全？应同步改生成函数尺寸、viewBox、label 字号和容器高度
- [ ] 主高亮色是否把 CANN 红 / Coral 当作全页 active 色？CANN 字标可用品牌红；active tab、按钮、产品高亮应用 Purple/Teal，Coral 只用于风险/低分
- [ ] 有没有把导航 tabs / TOC 包进一个大描边圆角容器？删掉外壳，保留无壳 tab row
- [ ] 有没有把说明型 section（如评分方法 / 方法口径 / 解释文本）做成卡片？应改成 plain section，只让表格或关键数据自己有视觉层
- [ ] 有没有漏扫 JS 模板渲染出的 Persona / 角色 / 仓库楼层？这些也要消除 `section > card > table/list` 套娃
- [ ] Persona 这类角色楼层是否仍是外层 card + 内部 card + bordered table？外层改 plain，内部分析/证据改无边框 group
- [ ] 原始数据 / 文件链接列表是否被做成卡片墙？改成无壳文本行
- [ ] 表格是否还是灰色表头 + 每行横线？改成轻量表头、弱分隔、行间留白和色彩化数值
- [ ] 去掉卡片后楼层区分是否变弱？用 section 间距和顶部 hairline 增强，不能加回描边卡片壳
- [ ] insight / KPI / summary metric 是否被误伤成纯文字？这些内容对象应保留 soft background card，但不要给父 section 加壳
- [ ] 有没有三层边框嵌套（section > card > table/list/callout）？删掉中间 card 或改无边框 group
- [ ] 有没有 `<script src="https://cdn.jsdelivr.net/npm/echarts`、chart.js、d3 或其它外部 JS？
- [ ] 有没有丢失 `width=1440` viewport、`body{min-width:1440px}`、`.browser{width:1392px;margin:0 auto}`？
- [ ] 有没有 `box-shadow:` 在普通卡片上？
- [ ] 卡片 / callout / 图谱节点用了任意边缘高亮（`border-left/top`、顶部色条、inset edge shadow）？删掉，改背景色、标题、胶囊或数值可视化
- [ ] 有没有 Tailwind 系 hex（`#3B82F6` / `#EF4444` / `#10B981` 等）？
- [ ] 大数字字重是不是写到了 700+？
- [ ] 业务对象色族用超过 4 种？
- [ ] 用了 `<emoji>` 但其他地方又用了 SVG？应该统一
- [ ] 折线图、柱状图、donut、雷达图用了图表库？应该用纯 SVG / CSS
- [ ] 用了浏览器 chrome 装饰？删
- [ ] 卡片内文字色用了 #000？应该用 g10 `#1B2432`
