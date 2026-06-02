# Dashboard Gen · AscendOps Skill

这个目录是分享版 `dashboard-gen` skill，用来生成或刷新 CANN / AscendOps 风格的单文件 HTML 看板页面。

`SKILL.md` 是 agent 实际读取的主规则；这个 README 只给同事快速了解、安装和使用。

## 目录内容

```text
dashboard_UI_skill-main/
├── SKILL.md                  # skill 主文件，使用时优先读这里
├── dashboard-ui-design.md     # 设计规范、token、组件和反模式
├── examples/                 # 本轮 after 页面，可作为参考样例
├── LICENSE
└── README.md
```

分享版不依赖 `screenshots/`。视觉参考直接看 `examples/` 里的 HTML 页面。

## 安装

Codex:

```bash
mkdir -p ~/.codex/skills
cp -R dashboard_UI_skill-main ~/.codex/skills/dashboard-gen
```

Claude Code:

```bash
mkdir -p ~/.claude/skills
cp -R dashboard_UI_skill-main ~/.claude/skills/dashboard-gen
```

也可以不安装，直接把 `SKILL.md` 和 `dashboard-ui-design.md` 路径发给 agent，让它按这套规则执行。

## 使用方式

从 0 生成新看板：

```text
使用 dashboard-gen，生成一个 CANN 算子开发体验看板，单文件 HTML，AscendOps 风格。
```

刷新现有页面：

```text
使用 dashboard-gen Mode B，把这个 HTML 刷成 AscendOps 风格。
只换视觉，不删内容，不改业务结构。
```

参考本轮样例：

```text
参考 examples/02-design-options.html 的工具页视觉层级，
或参考 examples/04-journey-agentic-report.html 的报告页结构。
```

## 两种模式

**Mode A · 从 0 生成**

适合新建 dashboard / 体验看板 / KPI 总览页。可以参考 examples 的视觉语言，但业务模块要按实际主题重新组织。

**Mode B · 刷新现有页面**

适合已有 CANN 业务页换肤。核心原则是“视觉刷新，不重建内容”：

- 原页面 section、表格、正文、列表、链接、交互全部保留。
- 原页面是报告就还是报告，是工具就还是工具。
- 不把内容型页面硬改成 KPI 看板。
- DOM 与楼层顺序原则上保持，除非用户明确要求结构调整。

## 必守视觉规则

- 只用 Asana token：5 色族、10 灰阶、Navy。不要引入 Tailwind 默认色或自定义 hex。
- 单文件 HTML，inline SVG；不要用 ECharts、Chart.js、d3。
- 字体使用 Inter + JetBrains Mono。
- Variant A / Variant B banner 二选一，不要两个同时出现。
- CANN 字标可以保留品牌红；产品 active tab、主按钮、交互高亮用 Purple / Teal；Coral 只用于风险、错误、低分。
- KPI 大数字使用 48-54px / weight 500。
- 图表尺寸要改真实 SVG / canvas 输出，不只放大外层 CSS 容器。

## 容器层级

Mode B 最容易错在“卡片套卡片”。刷新前后都要做容器审计：

- L1 楼层：页面业务根、section shell、`.main-body`、`.scene-detail`、`.workspace`、`.app-shell` 等，默认 plain，不加白色大卡片。
- L2 内容对象：KPI、图表、关键结论、证据块、表格、列表对象，可以使用一层白色 soft card。
- L3 行项目：卡片内部的行、证据、列表项，用留白和轻量 hairline，不再套小卡。
- 同一区域只能有一个 visual owner，不能外层卡片里再放 border 卡片。
- 次要元信息，如报告日期、扫描基线、数据来源、工作区，用 bullets / `dl` / inline text，不做一组小卡片。

## 表格规则

- 表格全白、无斑马纹、无重分隔线、无 border 外框。
- 用圆角、极淡 `--shadow-soft`、hover、充足 padding 区分。
- 数值配评分胶囊、进度条、色阶或 mini visualization。
- 列宽按内容配比，不留大面积空白。

## Mode B 自检

交付前至少检查这些项：

- 内容是否 1:1 保留，没有丢 section / 表格 / 正文 / 链接。
- 真实 selector 是否命中，而不是只追加 `.card/.section/.hero` 通用覆盖。
- L1 shell 是否被误判成卡片。
- 是否存在 border 外框、左侧高亮描边、顶部色条、inset edge shadow。
- 是否有卡片套卡片。
- 是否有非 Asana token 的硬编码颜色。
- 图表是否仍由旧 JS 输出小 SVG。
- 顶部 toolbar / tabs / filter chips 是否适配完整宽度和正确高度。

## 示例页面

`examples/` 包含本轮整理过的 after 页面：

- `00-index.html`：分享入口页。
- `01-CANN-GitCode仓库与用户旅程 Agentic 评分报告.html`：报告页。
- `02-design-options.html`：工具型体验看板。
- `03-analysis.html`：分析页。
- `04-journey-agentic-report.html`：报告型页面标杆。
- `06-path-generator-ux.html`：左对话、右 canvas 的工具页。
- `07-cann-website.html`：网站类页面。
- `roadmap-preview.html`：方案 C 流程图谱样式。

## 维护方式

规则更新优先改 `SKILL.md`，详细设计补到 `dashboard-ui-design.md`。README 只保留给同事看的简明说明，不作为 agent 的唯一依据。

## License

MIT
