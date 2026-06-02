---
name:  design-skill
description: -- 专为 Pixso MCP 设计工作流打造的综合设计技能。当用户需要在 Pixso 中完成以下任何任务时，必须主动触发此技能：创建或编辑 UI 组件（按钮、输入框、卡片、导航、表单等）、应用设计规范（颜色/字号/间距/圆角/栅格）、搭建页面框架或设计稿、读取/验证设计节点、使用设计变量（Tokens）、调用 Pixso 组件库（Symbol）。
---

# Design Skill · Pixso 组件系统

## 概述

基于 Pixso MCP 工具实现的可复用设计系统工作流，支持：
- 读取并应用栅格与设计变量（Tokens）
- 调用现有 Symbol 组件库
- 自动生成符合规范的可编辑设计稿

## 设计能力

- 栅格系统布局规范（参考 `scripts/grid.json`）
- 全局设计变量（Tokens）管理（参考 `scripts/tokens.json`）
- Pixso Symbol 组件库维护与调用
- 组件化、规范化界面快速生成
- 统一视觉风格与交互逻辑

## 资源文件说明

| 文件路径 | 说明 |
|---|---|
| `scripts/grid.json` | 栅格系统配置：列数、间距、边距、响应式断点 |
| `scripts/tokens.json` | 全局设计变量：颜色、字号、间距、圆角、阴影 |

## 图标处理规范（核心约束）

> ⚠️ 本节规则优先级最高，所有生成步骤必须遵守。

### 图标存储机制

OpenEuler 设计系统中，图标以 `svgSha` 外部引用方式存储在 Pixso 服务器上（非内嵌 SVG 路径）。这意味着：

- 图标 SVG 数据**不存在于 DSL 中**，无法通过工具直接提取路径
- `code_to_design` 内嵌的任何 SVG 均为**通用占位符**，不属于设计系统图标
- `create_instance` 生成的组件实例**自带正确图标**，由 Pixso 在渲染时从服务器解析

### 图标安全规则

| 场景 | 允许的方式 | 禁止的方式 |
|------|-----------|-----------|
| 含图标的 UI 组件（导航、搜索、按钮、分页、下拉等） | `create_instance` | `code_to_design` 内嵌 SVG |
| 纯布局结构（背景、容器、栅格、文字区块） | `code_to_design` | — |
| 装饰性图标占位符 | `code_to_design` 使用色块矩形 + 文字标注 | SVG 路径 |

### 两阶段生成策略（整页设计）

生成包含图标的完整页面时，强制采用两阶段方式：

**阶段一：结构层（`code_to_design`）**
- 生成页面整体布局：背景色、容器、栅格、区块划分、标题文字
- 所有 UI 组件位置使用**色块矩形占位符**，不嵌入任何 SVG
- 占位符规格：与目标组件同尺寸，填充 `rgba(0,0,0,0.06)`，内置文字标注（如 `[ONavigation]`、`[OSearch]`）

**阶段二：组件层（`create_instance`）**
- 针对每个 UI 组件调用 `create_instance(componentKey)` 生成真实实例
- 实例图标由 Pixso 自动从设计系统解析，保证与规范一致
- 在 Pixso 中手动将实例拖入对应占位符位置（AI 无法自动定位）

---

## 执行工作流

### 第一步：读取设计规范

```
使用 get_variable_sets 获取当前文件所有变量集合
使用 get_variables(variableSetId) 读取具体变量值（颜色/字号/间距等）
使用 get_local_styles 获取本地样式（填充色/描边/文字样式）
```

### 第二步：读取组件库

```
使用 get_all_components 列出所有可用 Symbol 组件
根据需求筛选目标组件名称和 componentKey
```

### 第三步：两阶段生成

**含图标组件的场景**：

```
阶段一（结构层）：
  code_to_design(htmlStr) — 纯布局 HTML，UI 组件位置用矩形色块替代，无任何 SVG

阶段二（组件层）：
  对每个需要图标的 UI 组件执行：
  create_instance(componentKey) → 返回 instanceGuid
```

**纯组件/单组件场景**（无需整页布局）：

```
直接使用 create_instance(componentKey) 插入组件实例
```

### 第四步：图标验证

插入组件实例后，**必须**通过 DSL 验证图标是否正确存在：

```
get_node_dsl(instanceGuid) → 在 childNode 中查找 VECTOR 类型节点
```

**验证结果判断**：

| DSL 中的图标节点特征 | 状态 | 处理方式 |
|---------------------|------|---------|
| `type: VECTOR` + `svgSha: "IconX"` | ✅ 正常 | 图标已正确引用，Pixso 渲染时自动解析 |
| `type: VECTOR` + 无 `svgSha`，有 `vectorPaths` | ✅ 正常 | 图标路径内嵌，直接可用 |
| 无 VECTOR 子节点 | ⚠️ 异常 | 组件内无图标（可能是纯文字变体），检查是否选错了 componentKey |
| `type: RECTANGLE`（空矩形替代了图标） | ❌ 错误 | 库链接失败，通知用户执行"从库复制粘贴"流程 |

**跨文件警告**：若当前工作文件（如 `975xPIJXN66PO6CHYokq_w`）与组件库文件（`JZkjW0mhmT61Mtd98dCfBw`）不同，且验证发现图标为空矩形时，提示用户：

> 图标依赖 Pixso 跨文件库链接解析。修复方式：在 Pixso 中打开组件库文件 → 复制组件 → 粘贴到当前工作文件。

### 第五步：应用设计变量与样式

```
set_fill_style(itemId, styleKey) — 应用填充色样式
set_text_style(itemId, styleKey) — 应用文字样式
set_stroke_style(itemId, styleKey) — 应用描边样式
set_bound_variables(bindings) — 绑定设计变量（Token）
```

### 第六步：验证视觉结果

```
get_node_dsl(itemId) — 读取节点 DSL 结构，验证层级与属性
get_image(itemId) — 生成节点预览图，确认视觉结果
```

### 第七步：记录生成状态

组件生成完成后，**必须**将记录追加到 `opendesign skills/assets/_skill-gen-status.md` 文件：

```
| 组件名称 | ✅ 完成 | `节点ID` | 完成日期（YYYY-MM-DD） |
```

- 组件名称使用中英文，如 `OTab 标签页`
- 节点 ID 来自第三步 create_instance 返回的 instanceGuid
- 日期使用今天的实际日期

## 节点 ID 获取方式

- 从 Pixso 画布 URL 提取：`?item-id=1:2` → itemId 为 `1:2`
- 使用 `mcp__pixso-desktop__get_all_components` 或 `mcp__pixso-desktop__get_local_styles` 返回结果中查找对应 key/id

## 组件文档规范

生成组件文档（`opendesign skills/assets/*.md`）时，**必须**将设计稿中的色值、字号、间距等匹配 `scripts/tokens.json` 中的变量名：

### 必须匹配的属性

| 属性类型 | Token 格式 | 示例 |
|---|---|---|
| 颜色 | `color-*` | `color-info3`、`color-primary1`、`color-link1` |
| 字号 | `font_size-*` | `font_size-tip1` (14px) |
| 行高 | `line_height-*` | `line_height-tip1` (22px) |
| 字重 | `font_weight-*` | `font_weight-regular` (400)、`font_weight-bold` (600) |
| 间距 | `gap-*` | `gap-1` (4px)、`gap-2` (8px) |
| 圆角 | `radius_control-*` | `radius_control-m` (4px) |
| 图标尺寸 | `icon_size-*` / `icon_size_control-*` | `icon_size-m` (24px) |
| 阴影 | `shadow-*` | `shadow-1` |

### 颜色 Token 对照表

| 语义 | Token | 用途 |
|---|---|---|
| 一级文字/标题 | `color-info1` | 强调信息 |
| 二级文字/正文 | `color-info2` | 次强调 |
| 三级文字/辅助 | `color-info3` | 辅助信息、面包屑层级 |
| 禁用文字 | `color-info4` | 禁用状态 |
| 链接文字 | `color-link1` | 链接常规状态 |
| 强调色/主色 | `color-primary1` | 当前页面、激活状态 |
| 成功色 | `color-success1` | 成功提示 |
| 告警色 | `color-warning1` | 告警提示 |
| 危险色 | `color-danger1` | 错误/危险提示 |
| 控件边框 | `color-control1` | 输入框边框等 |

### 文档格式要求

样式规范表格中必须包含 Token 列：

```markdown
### 颜色

| 元素 | Token | Dark=off | Dark=on |
|---|---|---|---|
| 文字 | `color-info3` | `rgba(var(--o-grey-14), 0.6)` | `rgba(var(--o-grey-1), 0.6)` |
```

## 注意事项

- 所有 `itemId` 格式为 `"数字:数字"`，例如 `"123:456"`
- 若未指定 itemId，工具默认操作当前 Pixso 画布中已选中的节点
- 导出图片时使用 `get_export_image` 并配置 exportSettings（PNG/SVG/PDF 等）
- **组件文档中所有色值、字号、间距必须匹配 tokens.json 变量名**，禁止使用硬编码值
- **图标规则**：含图标的 UI 组件必须通过 `create_instance` 插入，禁止在 `code_to_design` HTML 中内嵌 SVG 图标路径
- **跨文件图标**：`svgSha` 引用的图标在 Pixso 渲染时自动从组件库解析；若图标不显示，指引用户从组件库文件复制粘贴组件

## componentKey 速查

> 完整 536 个变体的速查表见 [`scripts/component-keys.md`](../scripts/component-keys.md)

常用高频变体（Light 模式默认变体，已验证）：

| 组件 | 变体 | componentKey |
|------|------|-------------|
| ONavigation/顶部导航 | PC, Dark=off | `561d3014fbe6f361abfecc203a06f1ab6cad43af` |
| ONavigation/顶部导航 | PC, Dark=on | `c4522744b94335f4bc8fbc358c2316d3c447b771` |
| ONavigation/顶部导航 | Mb, Dark=off | `7675ede074069cf358a0f164f76e1c6c119a592f` |
| 导航 Navigation/底部导航 | PC | `5d66a734f21bfcce1fbe4fce1d79f832b7f08f02` |
| 导航 Navigation/底部导航 | Mb | `62383dfdd93fd29e6dfcb7def1861d22d005324a` |
| OBreadcrumb 面包屑 | Dark=off | `7838d75ba480e2c51fe0f741109ba6c9745a6f86` |
| 搜索框 Search | large, Enabled, Light | `504d78f315ae03447c67e6019f787e5656b4aa1a` |
| 搜索框 Search | medium, Enabled, Light | `bfb0631d6779aa79179e27e84534dd68acd2fa0e` |
| OButton 按钮 | solid, medium, Light | `eab0e6c545d27376ba67aef7dd233fc58c476234` |
| OButton 按钮 | outline, medium, Light | `3cd0c2f583c60180725e297d3529d67ed62fcad8` |
| OButton 按钮 | text, medium, Light | `2b717cf5c4d422ff4385f6f215d52fa4dcc1c04a` |
| OButton 按钮 | solid, large, Light | `1a36bbfd374263c7b4644d4490e8bb65450c2f57` |
| ODropdown 下拉菜单 | medium, solid, Light | `647e1f27461028010d0828c17a8dfb6f245bd449` |
| ODropdown 下拉菜单 | medium, outline, Light | `6c12a6d3766a2055cd8f300e001c589084b2decd` |
| ODropdown 下拉菜单 | medium, text, Light | `cdf3700ce2d84a8bcf81720f9d64a0c867909268` |
| OPagination 分页 | All, Dark=off | `35bb7a0ef9189834048e73d6832418da0796d993` |
| OPagination 分页 | Simple, Dark=off | `c8d2772ff9159d6bc99498f30ba24bb001039139` |
| OCard 卡片 | cover, vertical, Light | `a22044aaa494bba137bd3ebba74319449b998694` |
| OCard 卡片 | cover, horizontal, Light | `0fceafcdae43547862ffb167bdcce89f510c3c35` |
| OCard 卡片 | icon, vertical, Light | `6103b3265e752087a546bf1b77a0f1b5bfef888b` |
| OCard 卡片 | icon, horizontal, Light | `e2a10a804dc8cb9ab507d237c712f65c7cf12f5e` |
