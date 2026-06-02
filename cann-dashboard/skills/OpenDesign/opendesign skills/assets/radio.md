# ORadio 单选框 · 设计 Skill

> 组件集合节点：`1042:16975` · 组件名：ORadio 单选框 · 变体总数：8

---

## Part A：设计使用卡

### 组件概览

**ORadio 单选框**：用于在多个互斥选项中选择其一的表单控件。通过圆形选中指示器（外圈 + 内圈）传达选中/未选中状态，支持禁用状态表达不可操作。通常以单选组形式使用，同一组内只能选中一个选项。

---

### 适用场景

- ✅ **表单单选**：性别选择、付款方式、配送方式等互斥选项
- ✅ **设置面板**：配置选项切换，如主题选择、语言选择
- ✅ **筛选条件**：单一筛选维度，如排序方式、时间范围
- ✅ **问卷调查**：单选题型答案选择
- ❌ **不适合**：多选场景（用 Checkbox）、开关切换（用 Switch）、需快速切换的二元状态

---

### 变体说明

**check（选中状态）**
- `Selected` — 已选中，外圈使用品牌色填充，内圈显示选中指示点
- `Unselected` — 未选中，外圈使用描边样式，无内圈指示点

**state（交互状态）**
- `Enabled` — 正常可点击状态
- `Disabled` — 颜色使用禁用色 Token，不可点击

**Dark（主题）**
- `off` — 浅色模式（默认）
- `on` — 深色模式，品牌色系和背景色自动切换为对应深色值

---

### 布局结构

> 🧩 **布局结构**：单选框水平排列（HORIZONTAL Auto Layout），由圆形选择器和文字标签组成。选择器与文字间距 8px，整体高度 24px。

```
ORadio（HORIZONTAL，自适应宽度，固定高度 24px）
├── autoLayoutItemSpacing: 8px（选择器↔文字间距）
├── autoLayoutPadding: 0px（上下左右）
│
├── [组合 圆形选择器 GROUP]（16×16）
│   ├── [外圈 ELLIPSE]（16×16，cornerRadius: 50%）
│   │     fill: 选中=color-primary1 / 未选中=color-fill2
│   │     stroke: 未选中=color-control1 / 选中=无
│   └── [内圈选中指示 ELLIPSE]（8×8，仅选中状态显示）
│         fill: `color-fill2`
│
└── [text PARAGRAPH]（自适应宽度，固定高度 24px）
      fill: Enabled=color-info1 / Disabled=color-info4
      font: 16px / 24px，Regular
```

---

### 组合搭配

> 🔗 **常见搭配**：
> - **单选组 ORadioGroup**：多个 ORadio 组合使用，同一组内互斥选中
> - **表单布局**：与 OInput、OSelect 等表单组件配合，垂直排列
> - **卡片内选项**：与 OCard 配合，卡片内展示单选选项
> - **筛选面板**：与 OFilter 配合，筛选条件单选

---

### 设计稿识别指南

> 🔍 **识别特征**：
> - 圆形选择器节点（ELLIPSE，16×16px），位于文字左侧
> - 选中状态：外圈品牌色填充 + 内圈白色指示点（8×8px）
> - 未选中状态：外圈白色填充 + 灰色描边（strokeWeight: 1px INSIDE）
> - 整体高度固定 24px，Auto Layout spacing 8px
> - 文字字号 16px，行高 24px，Regular 字重

> 🔄 **易混淆组件**：
> - 与 **OCheckbox 复选框**：Radio 是圆形单选，Checkbox 是方形多选；Radio 选中显示内圈点，Checkbox 选中显示勾号
> - 与 **OSwitch 开关**：Switch 是滑动开关，用于二元状态快速切换；Radio 是选择控件

---

### 响应式行为

参照 `scripts/grid.json` 中的断点定义，ORadio 无自动断点响应式行为。选中状态和主题通过变体手动切换。

---

## Part B：规格速查参考

### 变体索引表

| 变体属性 | 可选值 | 默认值 | 视觉差异 |
|---------|--------|--------|---------|
| check | `Selected` / `Unselected` | `Unselected` | 外圈填充样式 + 内圈指示点显示/隐藏 |
| state | `Enabled` / `Disabled` | `Enabled` | 颜色切换为禁用 Token，不可交互 |
| Dark | `off` / `on` | `off` | 品牌色/背景色切换为深色主题对应值 |

---

### 布局规格

| 规格项 | 值 | Token |
|--------|---|-------|
| 整体高度 | 24px | — |
| 整体宽度 | 自适应（文字宽度 + 24px） | — |
| Auto Layout Spacing | 8px | `gap-2` |
| Auto Layout Padding | 0px（上下左右） | — |
| 外圈尺寸 | 16×16px | `icon_size_control-xs` |
| 内圈尺寸 | 8×8px | — |
| 文字高度 | 24px | `line_height-text1` |
| 文字字号 | 16px | `font_size-text1` |

---

### 颜色 Token 映射

#### Unselected 状态

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 外圈背景（Enabled） | `grey-1` | `grey-4` | `color-fill2` | rgb(255,255,255) → rgb(36,36,39) |
| 外圈描边（Enabled） | `grey-14 @ 0.25` | `grey-14 @ 0.25` | `color-control1` | rgba(0,0,0,0.25) → rgba(255,255,255,0.25) |
| 外圈背景（Disabled Light） | `brand-1` | — | `color-control2-light` | rgb(235,241,250) |
| 外圈背景（Disabled Dark） | — | `grey-5` | `color-control2-light` | rgb(43,43,47) |
| 外圈描边（Disabled） | `grey-14 @ 0.1` | `grey-14 @ 0.15` | `color-control4` | rgba(0,0,0,0.1) → rgba(255,255,255,0.15) |
| 文字（Enabled） | `grey-14` | `grey-14` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |
| 文字（Disabled） | `grey-14 @ 0.4` | `grey-14 @ 0.4` | `color-info4` | rgba(0,0,0,0.4) → rgba(255,255,255,0.4) |

#### Selected 状态

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 外圈背景（Enabled） | `brand-6` | `brand-6` | `color-primary1` | rgb(0,47,167) → rgb(73,122,248) |
| 外圈背景（Disabled） | `brand-3` | `brand-3` | `color-primary4` | rgb(132,161,220) → rgb(29,51,120) |
| 内圈指示点（Enabled） | `white` | `grey-4` | `color-fill2` | rgb(255,255,255) → rgb(36,36,39) |
| 内圈指示点（Disabled） | `white` | `grey-4` | `color-fill2` | rgb(255,255,255) → rgb(36,36,39) |
| 文字（Enabled） | `grey-14` | `grey-14` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |
| 文字（Disabled） | `grey-14 @ 0.4` | `grey-14 @ 0.4` | `color-info4` | rgba(0,0,0,0.4) → rgba(255,255,255,0.4) |

> **说明**：选中状态外圈使用品牌色填充，无描边；内圈指示点使用 `color-fill2`（Light=white，Dark=grey-4）。

---

### 字体样式映射

| 使用场景 | 字号 Token | 行高 Token | 字重 Token | 字号值 | 行高值 |
|---------|-----------|-----------|-----------|-------|-------|
| Radio 文字 | `font_size-text1` | `line_height-text1` | `font_weight-regular` | 16px | 24px |

字体族：`font_family`（HarmonyOS / HarmonyHeiTi Regular）

---

### 组件层级结构

```
ORadio（HORIZONTAL，自适应宽度，固定高度 24px）
│  GUID: 1042:16976（Unselected/Enabled/off）等
│  Width: 自适应（示例 56px）| Height: 24px
│  Auto Layout: HORIZONTAL
│  autoLayoutItemSpacing: 8px
│  autoLayoutPaddingTop/Bottom/Left/Right: 0px
│  autoLayoutPrimaryAlign: flex-start
│  autoLayoutCounterAlign: center
│
├── [容器 FRAME]
│   GUID: 1080:9898（Unselected）/ 组合 16009（Selected）
│   Width: 16px | Height: 16px
│   Auto Layout: FIXED
│   │
│   ├── [外圈 ELLIPSE]（未选中状态）
│   │   GUID: 1042:16977
│   │   Width: 16px | Height: 16px
│   │   fill: rgb(255,255,255) → rgb(36,36,39) → Token: `color-fill2`
│   │         rgb(235,241,250) / rgb(43,43,47) → Token: `color-control2-light`
│   │   stroke: rgba(0,0,0,0.25) → rgba(255,255,255,0.25) → Token: `color-control1`
│   │           rgba(0,0,0,0.1) → rgba(255,255,255,0.15) → Token: `color-control4`
│   │   strokeWeight: 1px INSIDE
│   │
│   └── [外圈 ELLIPSE]（选中状态）
│   │   GUID: 1042:16985（Light）/ 1042:16988（Dark）
│   │   Width: 16px | Height: 16px
│   │   fill: rgb(0,47,167) → rgb(73,122,248) → Token: `color-primary1`
│   │         rgb(132,161,220) → rgb(29,51,120) → Token: `color-primary4`
│   │   stroke: 无（隐藏）
│   │
│   └── [内圈指示点 ELLIPSE]（仅选中状态显示）
│       GUID: 1042:16986（Light）/ 1042:16989（Dark）
│       Width: 8px | Height: 8px
│       top: 4px | left: 4px（居中于外圈内）
│       fill: rgb(255,255,255) → rgb(36,36,39) → Token: `color-fill2`
│
└── [text PARAGRAPH]
    GUID: 1080:9895
    Width: 自适应（示例 32px）| Height: 24px
    fill: rgb(0,0,0) → rgb(255,255,255) → Token: `color-info1`
          rgba(0,0,0,0.4) → rgba(255,255,255,0.4) → Token: `color-info4`
    fontFamily: HarmonyHeiTi
    fontStyle: Regular
    fontSize: 16px → Token: `font_size-text1`
    lineHeight: 24px → Token: `line_height-text1`
    nodeText: "选项"
```

---

### 变体 componentKey 速查

| 变体组合 | node_id | 尺寸 | 说明 |
|---------|---------|------|------|
| check=Unselected, state=Enabled, Dark=off | `1042:16976` | 56×24px | 未选中，浅色，正常状态 |
| check=Unselected, state=Disabled, Dark=off | `1042:16980` | 56×24px | 未选中，浅色，禁用状态 |
| check=Selected, state=Enabled, Dark=off | `1042:16984` | 56×24px | 已选中，浅色，正常状态 |
| check=Selected, state=Disabled, Dark=off | `1042:16990` | 56×24px | 已选中，浅色，禁用状态 |
| check=Unselected, state=Enabled, Dark=on | `1042:16978` | 56×24px | 未选中，深色，正常状态 |
| check=Unselected, state=Disabled, Dark=on | `1042:16982` | 56×24px | 未选中，深色，禁用状态 |
| check=Selected, state=Enabled, Dark=on | `1042:16987` | 56×24px | 已选中，深色，正常状态 |
| check=Selected, state=Disabled, Dark=on | `1042:16993` | 56×24px | 已选中，深色，禁用状态 |

> **注意**：componentKey 需从 Pixso 组件面板获取。

---

### Pixso 操作速查

1. **插入组件**：组件面板搜索「ORadio」，拖入画布
2. **切换选中状态**：右侧面板 → check 属性 → 选择 `Selected` / `Unselected`
3. **切换交互状态**：右侧面板 → state 属性 → 选择 `Enabled` / `Disabled`
4. **切换主题**：右侧面板 → Dark 属性 → 选择 `off` / `on`
5. **修改文字内容**：双击进入组件 → 双击 text 图层修改内容
6. **组合为单选组**：多个 Radio 实例放入同一容器，设置互斥逻辑

---

### 注意事项

- **选中状态识别**：选中时外圈使用品牌色填充（`color-primary1`），内圈显示指示点
- **未选中状态识别**：未选中时外圈使用 `color-fill2` 背景 + `color-control1` 描边，无内圈指示点
- **内圈指示点**：仅 `Selected` 状态显示，尺寸 8×8px，居中于外圈内（top/left 各 4px），使用 `color-fill2`
- **外圈描边**：仅 `Unselected` 状态有描边（strokeWeight: 1px INSIDE），`Selected` 状态无描边
- **禁用状态背景**：Unselected Disabled 使用 `color-control2-light`
- **禁用状态描边**：Unselected Disabled 使用 `color-control4` 描边
- **文字颜色**：Enabled 状态使用 `color-info1`（一级文字色），Disabled 状态使用 `color-info4`（禁用文字色）
- **Dark 模式差异**：选中状态内圈指示点在 Dark 模式下为 grey-4（而非 white），确保在深色背景下可识别
- **单选组逻辑**：多个 Radio 组合使用时，同一组内只能选中一个，需在交互层面实现互斥

---

## Part C：交互与状态

### 交互状态

| 元素 | 状态 | 视觉表现 |
|------|------|---------|
| 外圈 | Unselected Enabled | 背景：`color-fill2`，描边：`color-control1` |
| 外圈 | Unselected Disabled Light | 背景：`color-control2-light`，描边：`color-control4` |
| 外圈 | Unselected Disabled Dark | 背景：`color-control2-light`，描边：`color-control4` |
| 外圈 | Selected Enabled | 背景：`color-primary1`，无描边 |
| 外圈 | Selected Disabled | 背景：`color-primary4`，无描边 |
| 内圈 | Selected | 显示，fill：`color-fill2` |
| 内圈 | Unselected | 隐藏 |
| 文字 | Enabled | 颜色：`color-info1` |
| 文字 | Disabled | 颜色：`color-info4` |

---

### 状态切换逻辑

- **Unselected → Selected**：外圈背景切换为 `color-primary1`，描边隐藏，内圈指示点显示
- **Selected → Unselected**：外圈背景切换为 `color-fill2`，描边显示（`color-control1`），内圈指示点隐藏
- **Enabled → Disabled**：颜色降级为禁用 Token（Selected 用 `color-primary4`，Unselected 用 `color-control2-light`），不可交互
- **Light → Dark**：背景色、品牌色、文字色同步切换为深色主题对应值

---

### Hover 状态（交互态）

| 元素 | Hover 视觉表现 |
|------|---------------|
| 外圈（Unselected） | 描边颜色切换为 `color-control2`（brand-6），背景不变 |
| 外圈（Selected） | 背景颜色切换为 `color-primary2`（brand-4），内圈不变 |
| 文字 | 颜色不变 |

---

## Part D：设计变量绑定

### 推荐绑定变量

| 元素 | 属性 | 推荐变量 Token |
|------|------|---------------|
| 外圈背景（Selected Enabled） | fill | `color-primary1` |
| 外圈背景（Selected Disabled） | fill | `color-primary4` |
| 外圈背景（Unselected Enabled） | fill | `color-fill2` |
| 外圈背景（Unselected Disabled Light） | fill | `color-control2-light` |
| 外圈背景（Unselected Disabled Dark） | fill | `color-control2-light` |
| 外圈描边（Unselected Enabled） | stroke | `color-control1` |
| 外圈描边（Unselected Disabled） | stroke | `color-control4` |
| 内圈指示点 | fill | `color-fill2` |
| 文字（Enabled） | fill | `color-info1` |
| 文字（Disabled） | fill | `color-info4` |
| 文字字号 | fontSize | `font_size-text1`（16px） |
| 文字行高 | lineHeight | `line_height-text1`（24px） |
| 选择器↔文字间距 | autoLayoutItemSpacing | `gap-2`（8px） |
| 外圈尺寸 | width/height | `icon_size_control-xs`（16px） |

---

## Part E：最佳实践

### 使用建议

1. **单选组布局**：多个 Radio 垂直排列时，间距建议 8-12px（gap-2 ~ gap-3）
2. **选项文字简洁**：每个选项文字控制在 2-8 个字，避免过长描述
3. **默认选中**：单选组应设置一个默认选中项，避免用户困惑
4. **禁用提示**：禁用选项应配合说明文字解释原因

### 设计提示

- 单选框左侧选择器 + 右侧文字是标准布局，不建议反向排列
- 选中状态内圈指示点使用 `color-fill2`（Light=white，Dark=grey-4），确保在深色背景下可识别
- 单选框整体高度固定 24px，与文字行高一致，确保视觉对齐
- 同一组单选框应保持一致的尺寸和间距
- 禁用状态应同时禁用外圈和文字的交互

---

## 技术备注

- 组件节点 ID：`1042:16975`（组件集）
- 设计稿 URL：https://pixso.cn/app/design/JZkjW0mhmT61Mtd98dCfBw?item-id=1042:16975
- 生成日期：2026-04-17
- 变体总数：8（check=Selected/Unselected × state=Enabled/Disabled × Dark=off/on）
- 尺寸数据：来源于 Pixso MCP get_node_dsl
- 字号数据：16px/24px（font_size-text1 / line_height-text1）
- 外圈尺寸：16×16px（icon_size_control-xs）
- 内圈尺寸：8×8px（选中指示点）