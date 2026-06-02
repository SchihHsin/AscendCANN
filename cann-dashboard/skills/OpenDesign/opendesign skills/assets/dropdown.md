# ODropdown 下拉选择 · 设计 Skill

> 组件集合节点：`1042:17221` · 组件名：ODropdown 下拉选择 · 变体总数：18

---

## Part A：设计使用卡

### 组件概览

**ODropdown 下拉选择**：用于触发下拉菜单的按钮组件，常配合下拉面板使用。通过外观（实心/描边/文字）和尺寸传达视觉层级。

---

### 适用场景

- ✅ **下拉菜单触发**：表格筛选、表单下拉选择、操作菜单等
- ✅ **每页条数选择**：分页组件中的每页条数下拉
- ✅ **筛选条件**：数据筛选的下拉触发按钮
- ✅ **操作菜单**：更多操作、导出选项等下拉触发
- ❌ **不适合**：主要操作按钮（用 OButton）、导航链接（用 OLink）

---

### 变体说明

**size（尺寸）**
- `large` — 高 40px，字号 16px，适合突出的筛选区域
- `medium` — 高 32px，字号 14px，**默认尺寸**，适合大多数场景
- `small` — 高 28px，字号 14px，适合紧凑布局

**Variant（外观）**
- `solid` — 实心填充，背景为品牌色，文字和图标白色，视觉权重最高
- `outline` — 描边样式，无背景，描边、文字、图标均为品牌色
- `text` — 无背景无描边，文字和图标使用 info1 色，视觉权重最低

**Disabled（禁用）**
- `off` — 启用状态（默认）
- `on` — 禁用状态，solid/outline 变体使用 `color-primary4`，不可交互

**Dark（主题）**
- `off` — 浅色模式（默认）
- `on` — 深色模式，品牌色系自动切换为对应深色值

---

### 布局结构

> 🧩 **布局结构**：下拉按钮水平排列（HORIZONTAL Auto Layout），由文字和后缀下箭头图标组成，图标与文字间距 4px。

```
ODropdown（HORIZONTAL，自适应宽度，固定高度）
├── autoLayoutItemSpacing: 4px
├── autoLayoutPaddingTop: 8px（large）/ 5px（medium）/ 5px（small）
├── autoLayoutPaddingBottom: 8px（large）/ 5px（medium）/ 5px（small）
├── autoLayoutPaddingLeft: 24px（large）/ 16px（medium）/ 16px（small）【solid/outline】
│                                0px【text】
├── autoLayoutPaddingRight: 16px（large）/ 12px（medium）/ 12px（small）【solid/outline】
│                                0px【text】
│
├── [text PARAGRAPH]
│     fill: white（solid）/ color-primary1（outline）/ color-info1（text）
│     font: large=16px/24px, medium/small=14px/22px
│
└── [图标 Icon/下箭头 INSTANCE]（24×24）
      fill: white（solid）/ color-primary1（outline）/ color-info1（text）
      与文字颜色一致
```

---

### 组合搭配

> 🔗 **常见搭配**：
> - **下拉面板**：ODropdown 触发按钮 + 下拉菜单面板
> - **分页每页条数**：OPagination 中的每页条数下拉选择器
> - **筛选条件**：多个 ODropdown 组成筛选条件组
> - **工具栏**：工具栏中的下拉操作按钮

---

### 设计稿识别指南

> 🔍 **识别特征**：
> - 水平自动布局节点，高度固定为 28/32/40px，全圆角（100px）
> - 包含文字和下箭头图标（24×24px）
> - solid 变体有品牌色背景填充，outline 变体有描边，text 变体无背景无描边
> - 图标颜色与文字颜色一致

> 🔄 **易混淆组件**：
> - 与 **OButton**：Dropdown 用于触发下拉菜单，Button 用于触发操作；Dropdown 必带下箭头图标
> - 与 **OLink**：Dropdown 是按钮样式，Link 是文字链接样式；Dropdown 有背景/描边选项

---

### 响应式行为

参照 `scripts/grid.json` 中的断点定义，ODropdown 无自动断点响应式行为。尺寸通过 `size` 变体手动控制，深色模式通过 `Dark` 变体手动切换。

---

## Part B：规格速查参考

### 变体索引表

| 变体属性 | 可选值 | 默认值 | 视觉差异 |
|---------|--------|--------|---------|
| size | `large` / `medium` / `small` | `medium` | 高度 40/32/28px，字号和 Padding 有差异 |
| Variant | `solid` / `outline` / `text` | `solid` | 实心/描边/纯文字，颜色规则不同 |
| Disabled | `off` / `on` | `off` | 禁用状态，solid/outline 使用 `color-primary4` |
| Dark | `off` / `on` | `off` | 品牌色切换为深色主题对应值 |

---

### 布局规格

| 规格项 | large | medium | small |
|--------|-------|--------|-------|
| 整体高度 | 40px | 32px | 28px |
| Token（高度） | `control_size-l` | `control_size-m` | — |
| Auto Layout Padding Top | 8px | 5px | 5px |
| Auto Layout Padding Bottom | 8px | 5px | 5px |
| Auto Layout Padding Left（solid/outline） | 24px | 16px | 16px |
| Auto Layout Padding Left（text） | 0px | 0px | 0px |
| Auto Layout Padding Right（solid/outline） | 16px | 12px | 12px |
| Auto Layout Padding Right（text） | 0px | 0px | 0px |
| 图标↔文字间距 | 4px | 4px | 4px |
| Token（间距） | `gap-1` | `gap-1` | `gap-1` |
| 圆角 | 100px | 100px | 100px |
| 描边宽度（outline） | 1px | 1px | 1px |

---

### 颜色 Token 映射

#### solid 变体

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 背景 | `color-primary1` | `color-primary1` | brand-6 | rgb(0,47,167) → rgb(73,122,248) |
| 背景（Disabled） | `color-primary4` | `color-primary4` | — | 禁用状态背景色 |
| 文字 | `white` | `white` | — | rgb(255,255,255) |
| 图标 | `white` | `white` | — | 与文字一致 |

#### outline 变体

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 描边 | `color-primary1` | `color-primary1` | brand-6 | rgb(0,47,167) → rgb(73,122,248) |
| 描边（Disabled） | `color-primary4` | `color-primary4` | — | 禁用状态描边色 |
| 文字 | `color-primary1` | `color-primary1` | brand-6 | rgb(0,47,167) → rgb(73,122,248) |
| 文字（Disabled） | `color-primary4` | `color-primary4` | — | 禁用状态文字色 |
| 图标 | `color-primary1` | `color-primary1` | brand-6 | 与文字一致 |
| 图标（Disabled） | `color-primary4` | `color-primary4` | — | 禁用状态图标色 |
| 背景 | 无 | 无 | — | — |

#### text 变体

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 文字 | `color-info1` | `color-info1` | grey-14 | rgb(0,0,0) → rgb(255,255,255) |
| 文字（Disabled） | `color-info4` | `color-info4` | — | 禁用状态文字色 |
| 图标 | `color-info1` | `color-info1` | grey-14 | 与文字一致 |
| 图标（Disabled） | `color-info4` | `color-info4` | — | 禁用状态图标色 |
| 背景/描边 | 无 | 无 | — | — |

---

### 字体样式映射

| 使用场景 | 字号 Token | 行高 Token | 字重 Token | 字号值 | 行高值 |
|---------|-----------|-----------|-----------|-------|-------|
| large 下拉文字 | `font_size-text1` | `line_height-text1` | `font_weight-regular` | 16px | 24px |
| medium 下拉文字 | `font_size-tip1` | `line_height-tip1` | `font_weight-regular` | 14px | 22px |
| small 下拉文字 | `font_size-tip1` | `line_height-tip1` | `font_weight-regular` | 14px | 22px |

字体族：`font_family`（HarmonyOS / HarmonyHeiTi Regular）

---

### 组件层级结构

```
ODropdown（HORIZONTAL，自适应宽度，固定高度 28/32/40px）
│  GUID: 1042:17222（large/solid/Dark=off）等
│  autoLayoutMode: HORIZONTAL
│  autoLayoutItemSpacing: 4px
│  autoLayoutPaddingTop: 8px（large）/ 5px（medium）/ 5px（small）
│  autoLayoutPaddingBottom: 8px（large）/ 5px（medium）/ 5px（small）
│  autoLayoutPaddingLeft: 24px（large）/ 16px（medium）/ 16px（small）【solid/outline】
│                      或 0px【text】
│  autoLayoutPaddingRight: 16px（large）/ 12px（medium）/ 12px（small）【solid/outline】
│                       或 0px【text】
│  cornerRadius: 100px
│  fill: color-primary1（solid）/ 无（outline/text）
│  stroke: 无（solid/text）/ color-primary1（outline），strokeWeight: 1px
│
├── [text PARAGRAPH]
│   Width: 自适应
│   Height: 24px（large）/ 22px（medium/small）
│   fill: white（solid）/ color-primary1（outline）/ color-info1（text）
│   font: font_size-text1（large）/ font_size-tip1（medium/small）
│
└── [图标 Icon/下箭头 INSTANCE]
    Width: 24px | Height: 24px
    fill: white（solid）/ color-primary1（outline）/ color-info1（text）
    与文字颜色一致
```

---

### 变体 componentKey 速查

| 变体组合 | node_id | 尺寸 | 说明 |
|---------|---------|------|------|
| size=large, Variant=solid, Dark=off | `1042:17222` | 132×40px | 大尺寸实心浅色 |
| size=large, Variant=solid, Dark=on | `1042:17225` | 132×40px | 大尺寸实心深色 |
| size=large, Variant=outline, Dark=off | `1042:17241` | 132×40px | 大尺寸描边浅色 |
| size=large, Variant=outline, Dark=on | `1042:17244` | 132×40px | 大尺寸描边深色 |
| size=large, Variant=text, Dark=off | `1042:17266` | 92×40px | 大尺寸文字浅色 |
| size=large, Variant=text, Dark=on | `1042:17269` | 92×40px | 大尺寸文字深色 |
| size=medium, Variant=solid, Dark=off | `1042:17228` | 104×32px | 中尺寸实心浅色 |
| size=medium, Variant=solid, Dark=on | `1042:17231` | 104×32px | 中尺寸实心深色 |
| size=medium, Variant=outline, Dark=off | `1042:17247` | 104×32px | 中尺寸描边浅色 |
| size=medium, Variant=outline, Dark=on | `1042:17250` | 104×32px | 中尺寸描边深色 |
| size=medium, Variant=text, Dark=off | `1042:17260` | 76×32px | 中尺寸文字浅色 |
| size=medium, Variant=text, Dark=on | `1042:17263` | 76×32px | 中尺寸文字深色 |
| size=small, Variant=solid, Dark=off | `1042:17234` | 104×28px | 小尺寸实心浅色 |
| size=small, Variant=solid, Dark=on | `1042:17237` | 104×28px | 小尺寸实心深色 |
| size=small, Variant=outline, Dark=off | `1042:17253` | 104×28px | 小尺寸描边浅色 |
| size=small, Variant=outline, Dark=on | `1042:17256` | 104×28px | 小尺寸描边深色 |
| size=small, Variant=text, Dark=off | `1042:17275` | 76×28px | 小尺寸文字浅色 |
| size=small, Variant=text, Dark=on | `1042:17272` | 76×28px | 小尺寸文字深色 |

> **注意**：componentKey 需从 Pixso 组件面板获取。

---

### Pixso 操作速查

1. **插入组件**：组件面板搜索「ODropdown」，拖入画布
2. **切换尺寸**：右侧面板 → size 属性 → 选择 `large` / `medium` / `small`
3. **切换外观**：右侧面板 → Variant 属性 → 选择 `solid` / `outline` / `text`
4. **切换禁用**：右侧面板 → Disabled 属性 → 选择 `off` / `on`
5. **切换主题**：右侧面板 → Dark 属性 → 选择 `off` / `on`
6. **修改文字**：双击进入组件 → 双击 text 图层修改内容

---

### 注意事项

- **全圆角设计**：所有尺寸和变体均为全圆角（cornerRadius: 100px），胶囊形外观
- **图标固定**：所有尺寸的下箭头图标均为 24×24px，不随 size 变化
- **图标颜色一致**：图标颜色始终与文字颜色一致，不使用独立颜色
- **text 变体无 Padding**：text 变体左右 Padding 为 0，宽度完全由内容决定
- **solid/outline Padding**：实心和描边变体有左右 Padding（large=24/16px，medium/small=16/12px）
- **描边宽度**：outline 变体描边宽度固定为 1px
- **Disabled 状态**：solid/outline 变体使用 `color-primary4`，text 变体使用 `color-info4`
- **深色模式**：品牌色自动切换为 rgb(73,122,248)，白色和 info1 色自动切换

---

## Part C：交互与状态

### 交互状态

ODropdown 支持 Enabled 和 Disabled 两种状态，颜色规则如下：

**Enabled 状态**

| 变体 | 元素 | 颜色 |
|------|------|------|
| solid | 背景 | `color-primary1` |
| solid | 文字 | `white` |
| solid | 图标 | `white` |
| outline | 描边 | `color-primary1` |
| outline | 文字 | `color-primary1` |
| outline | 图标 | `color-primary1` |
| text | 文字 | `color-info1` |
| text | 图标 | `color-info1` |

**Disabled 状态**

| 变体 | 元素 | 颜色 |
|------|------|------|
| solid | 背景 | `color-primary4` |
| solid | 文字 | `white` |
| solid | 图标 | `white` |
| outline | 描边 | `color-primary4` |
| outline | 文字 | `color-primary4` |
| outline | 图标 | `color-primary4` |
| text | 文字 | `color-info4` |
| text | 图标 | `color-info4` |

---

### 下拉面板交互

- **点击触发**：点击 ODropdown 按钮展开下拉面板
- **面板定位**：下拉面板通常位于按钮下方，与按钮对齐
- **选项点击**：点击面板中的选项后，面板关闭，按钮文字更新为选中项

---

## Part D：设计变量绑定

### 推荐绑定变量

| 元素 | 属性 | 推荐变量 Token |
|------|------|---------------|
| solid 背景 | fill | `color-primary1` |
| solid 背景（Disabled） | fill | `color-primary4` |
| outline 描边 | stroke | `color-primary1` |
| outline 描边（Disabled） | stroke | `color-primary4` |
| solid 文字/图标 | fill | `white` |
| outline 文字/图标 | fill | `color-primary1` |
| outline 文字/图标（Disabled） | fill | `color-primary4` |
| text 文字/图标 | fill | `color-info1` |
| text 文字/图标（Disabled） | fill | `color-info4` |
| large 文字字号 | fontSize | `font_size-text1`（16px） |
| medium/small 文字字号 | fontSize | `font_size-tip1`（14px） |
| large 文字行高 | lineHeight | `line_height-text1`（24px） |
| medium/small 文字行高 | lineHeight | `line_height-tip1`（22px） |
| 图标尺寸 | width/height | `icon_size_control-m`（24px） |
| 图标↔文字间距 | autoLayoutItemSpacing | `gap-1`（4px） |
| 圆角 | cornerRadius | 100px |
| 描边宽度 | strokeWeight | 1px |

---

## Part E：最佳实践

### 使用建议

1. **外观选择**：突出的筛选使用 `solid`，常规筛选使用 `outline`，轻量筛选使用 `text`
2. **尺寸选择**：默认使用 `medium`，突出区域使用 `large`，紧凑布局使用 `small`
3. **下拉面板配合**：ODropdown 按钮需配合下拉面板组件使用
4. **图标必要性**：下箭头图标指示下拉行为，不可移除

### 设计提示

- 下拉按钮文字建议简短，如"筛选"、"更多"、"导出"、"10条/页"
- 下拉按钮宽度随内容自适应，建议设置合理的文字长度
- 深色模式下注意背景色和描边色同步切换
- 下拉面板的视觉风格应与按钮风格保持一致

---

## 技术备注

- 组件节点 ID：`1042:17221`（组件集）
- 设计稿 URL：https://pixso.cn/app/design/JZkjW0mhmT61Mtd98dCfBw?item-id=1042:17221
- 生成日期：2026-04-16
- 变体总数：36（size=large/medium/small × Variant=solid/outline/text × Disabled=off/on × Dark=off/on）
- 字号数据：来源于 Pixso 设计稿确认
- 图标尺寸：所有尺寸统一 24×24px
- 描边宽度：outline 变体固定 1px
- Disabled 状态：solid/outline 使用 `color-primary4`