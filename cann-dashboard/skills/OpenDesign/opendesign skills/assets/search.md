# OSearch 搜索框 · 设计 Skill

> 组件集合节点：`1042:18112` · 组件名：OSearch 搜索框 · 变体总数：16

---

## Part A：设计使用卡

### 组件概览

**OSearch 搜索框**：用于搜索场景的专用输入控件。集成搜索图标、输入区域和清除按钮，通过描边颜色区分默认和激活状态。激活状态显示光标和清除图标，支持四种尺寸（large/medium/small/Mb）和 Light/Dark 主题。

---

### 适用场景

- ✅ **全局搜索**：页面顶部搜索栏、站点全局搜索入口
- ✅ **列表筛选**：表格、列表、数据列表的搜索筛选
- ✅ **内容查找**：文档搜索、帮助文档查找、知识库搜索
- ✅ **快捷搜索**：工具栏搜索、快捷操作栏搜索入口
- ❌ **不适合**：普通文本输入（用 OInput）、多行输入（用 TextArea）、表单填写（用 OInput）

---

### 变体说明

**size（尺寸）**
- `large` — 搜索框高度 48px，字号 16px，**PC 端**突出搜索区域或重要搜索入口
- `medium` — 搜索框高度 40px，字号 16px，**PC 端默认尺寸**，适合大多数搜索场景
- `small` — 搜索框高度 32px，字号 14px，**PC 端**紧凑布局或辅助搜索
- `Mb` — 搜索框高度 40px，字号 14px，**移动端专用**

**state（状态）**
- `Enabled` — 默认状态，描边 grey-14 @ 0.25，仅显示搜索图标
- `Actived` — 激活/聚焦状态，描边 brand-6，显示光标和清除图标

**Dark（主题）**
- `off` — 浅色模式（默认），背景白色
- `on` — 深色模式，背景使用 grey-4

> **说明**：OSearch 没有 Disabled（禁用）状态变体，所有状态均可输入搜索。

---

### 布局结构

> 🧩 **布局结构**：搜索框由搜索图标、输入区域、清除图标（可选）和光标（可选）组成。输入区域包含占位文字或用户输入内容。

**Enabled 状态**

```
OSearch（SYMBOL，自适应宽度，固定高度）
├── Width: 自适应（示例 320px PC / 312px Mb）
├── Height: 48px（large）/ 40px（medium/Mb）/ 32px（small）
├── cornerRadius: 4px
├── fill: grey-1（Light）/ grey-4（Dark）
├── stroke: grey-14 @ 0.25（color-control1）
├── strokeWeight: 1px INSIDE
│
├── [搜索图标 Icon/搜索]（24×24px / 16×16px small）
│     fill: grey-14（Light）/ grey-14（Dark）
│     位置：左侧
│
└── [占位文字 PARAGRAPH]（自适应宽度）
      fontSize: 16px（large/medium）/ 14px（small/Mb）
      fill: grey-14 @ 0.4（color-info4）
      text: "搜索"
      位置：搜索图标右侧
```

**Actived 状态**

```
OSearch（SYMBOL，自适应宽度，固定高度）
├── Width: 自适应
├── Height: 48px（large）/ 40px（medium/Mb）/ 32px（small）
├── cornerRadius: 4px
├── fill: grey-1（Light）/ grey-4（Dark）
├── stroke: brand-6（color-primary1）
├── strokeWeight: 1px INSIDE
│
├── [搜索图标 Icon/搜索]（24×24px / 16×16px small / 16×16px Mb）
│     fill: grey-14（Light）/ grey-14（Dark）
│
├── [输入文字 PARAGRAPH]（自适应宽度）
│     fontSize: 16px（large/medium）/ 14px（small/Mb）
│     fill: grey-14（color-info1）
│
├── [光标 RECTANGLE]（1.5×24px 或 1.5×22px）
│     fill: grey-14（Light）/ grey-14（Dark）
│     位置：输入文字后
│
└── [清除图标 Icon/关闭]（24×24px / 16×16px small / 24×24px Mb）
      fill: grey-14（Light）/ grey-14（Dark）
      位置：右侧
```

---

### 组合搭配

> 🔗 **常见搭配**：
> - **顶部搜索栏**：OSearch + OButton（搜索按钮），构成完整搜索入口
> - **筛选搜索**：OSearch + OToggle + OSelect，构成筛选栏
> - **表格搜索**：OSearch + OTable，搜索筛选表格数据
> - **工具栏搜索**：OSearch + OIcon（工具图标），构成工具栏

---

### 设计稿识别指南

> 🔍 **识别特征**：
> - 搜索框 FRAME 节点，高度 32/40/48px，圆角 4px
> - Enabled 状态：背景 white/grey-4，描边 grey-14@0.25
> - Actived 状态：背景不变，描边 brand-6，显示光标和清除图标
> - 前缀搜索图标（large/medium=24×24px，small/Mb=16×16px），始终显示
> - 后缀清除图标（large/medium/Mb=24×24px，small=16×16px），仅 Actived 状态显示
> - 文字字号：large/medium=16px，small/Mb=14px

> 🔄 **易混淆组件**：
> - 与 **OInput 输入框**：Search 集成搜索图标和清除按钮，专用于搜索场景；Input 是通用文本输入
> - 与 **OSelect 选择器**：Select 用于下拉选择，有下拉箭头；Search 用于自由文本搜索

---

### 响应式行为

参照 `scripts/grid.json` 中的断点定义：
- **PC 端（1920px）**：使用 large/medium/small 尺寸
- **移动端（360px）**：使用 Mb 尺寸（40px 高度，宽度 312px）

---

## Part B：规格速查参考

### 变体索引表

| 变体属性 | 可选值 | 默认值 | 视觉差异 |
|---------|--------|--------|---------|
| size | `large` / `medium` / `small` / `Mb` | `medium` | 高度 48/40/32/40px，字号 16/16/14/14px |
| state | `Enabled` / `Actived` | `Enabled` | 描边颜色 grey/brand，图标数量 |
| Dark | `off` / `on` | `off` | 背景色 white/grey-4 |

---

### 布局规格

> **尺寸用途说明**：`large`/`medium`/`small` 用于 PC 端，`Mb` 用于移动端。

| 规格项 | large（PC） | medium（PC） | small（PC） | Mb（移动端） |
|--------|-------------|--------------|-------------|--------------|
| 搜索框高度 | 48px | 40px | 32px | 40px |
| Token（高度） | `control_size-xl` | `control_size-l` | `control_size-m` | `control_size-l` |
| 搜索框宽度 | 自适应（320px） | 自适应（320px） | 自适应（320px） | 自适应（312px） |
| 搜索框圆角 | 4px | 4px | 4px | 4px |
| Token（圆角） | `radius_control-xs` | `radius_control-xs` | `radius_control-xs` | `radius_control-xs` |
| 占位文字字号 | 16px | 16px | 14px | 14px |
| Token（字号） | `font_size-text1` | `font_size-text1` | `font_size-tip1` | `font_size-tip1` |
| 占位文字行高 | 24px | 24px | 22px | 22px |
| Token（行高） | `line_height-text1` | `line_height-text1` | `line_height-tip1` | `line_height-tip1` |
| 搜索图标尺寸 | 24×24px | 24×24px | 16×16px | 16×16px |
| Token（搜索图标） | `icon_size_control-m` | `icon_size_control-m` | `icon_size_control-s` | `icon_size_control-s` |
| 清除图标尺寸 | 24×24px | 24×24px | 16×16px | 24×24px |
| Token（清除图标） | `icon_size_control-m` | `icon_size_control-m` | `icon_size_control-s` | `icon_size_control-m` |
| 光标宽度 | 1.5px | 1.5px | 1.5px | 1.5px |
| 光标高度 | 24px | 24px | 22px | 22px |
| 描边宽度 | 1px INSIDE | 1px INSIDE | 1px INSIDE | 1px INSIDE |

---

### 颜色 Token 映射

#### Enabled 状态

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 搜索框背景 | `grey-1` | `grey-4` | `color-fill2` | rgb(255,255,255) → rgb(36,36,39) |
| 搜索框描边 | `grey-14 @ 0.25` | `grey-14 @ 0.25` | `color-control1` | rgba(0,0,0,0.25) → rgba(255,255,255,0.25) |
| 搜索图标 | `grey-14` | `grey-14` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |
| 占位文字 | `grey-14 @ 0.4` | `grey-14 @ 0.4` | `color-info4` | rgba(0,0,0,0.4) → rgba(255,255,255,0.4) |

#### Actived 状态

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 搜索框背景 | `grey-1` | `grey-4` | `color-fill2` | rgb(255,255,255) → rgb(36,36,39) |
| 搜索框描边 | `brand-6` | `brand-6` | `color-primary1` | rgb(0,47,167) → rgb(110,148,243) |
| 搜索图标 | `grey-14` | `grey-14` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |
| 输入文字 | `grey-14` | `grey-14` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |
| 光标 | `grey-14` | `grey-14` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |
| 清除图标 | `grey-14` | `grey-14` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |

> **说明**：Actived 状态描边颜色 Light 模式为 rgb(0,47,167)（brand-6），Dark 模式为 rgb(110,148,243)（brand-6 Dark 值）。

---

### 字体样式映射

| 使用场景 | 字号 Token | 行高 Token | 字重 Token | 字号值 | 行高值 |
|---------|-----------|-----------|-----------|-------|-------|
| large/medium 文字 | `font_size-text1` | `line_height-text1` | `font_weight-regular` | 16px | 24px |
| small/Mb 文字 | `font_size-tip1` | `line_height-tip1` | `font_weight-regular` | 14px | 22px |

字体族：`font_family`（HarmonyOS / HarmonyHeiTi Regular）

---

### 组件层级结构

**size=large, state=Enabled, Dark=off**

```
OSearch（SYMBOL）
│  GUID: 1042:18113
│  Width: 320px | Height: 48px
│  cornerRadius: 4px → Token: `radius_control-xs`
│  fill: rgb(255,255,255) → Token: `color-fill2`（Light）
│        rgb(36,36,39) → Token: `color-fill2`（Dark）
│  stroke: rgba(0,0,0,0.25) → Token: `color-control1`（Light Enabled）
│          rgba(255,255,255,0.25) → Token: `color-control1`（Dark Enabled）
│          rgba(0,47,167,1) → Token: `color-primary1`（Light Actived）
│          rgba(110,148,243,1) → Token: `color-primary1`（Dark Actived）
│  strokeWeight: 1px | strokeAlign: INSIDE
│
├── [搜索图标 Icon/搜索]
│   Width: 24px（large/medium）/ 16px（small/Mb）| Height: 同 Width
│   Token: `icon_size_control-m`（large/medium）/ `icon_size_control-s`（small/Mb）
│   fill: rgb(0,0,0) → Token: `color-info1`（Light）
│         rgb(255,255,255) → Token: `color-info1`（Dark）
│   位置：左侧（Auto Layout）
│
└── [占位文字 PARAGRAPH]
    Width: 自适应（256px）| Height: 24px
    fontSize: 16px → Token: `font_size-text1`
    lineHeight: 24px → Token: `line_height-text1`
    fill: rgba(0,0,0,0.4) → Token: `color-info4`（Light Enabled）
          rgba(255,255,255,0.4) → Token: `color-info4`（Dark Enabled）
          rgb(0,0,0) → Token: `color-info1`（Light Actived）
          rgb(255,255,255) → Token: `color-info1`（Dark Actived）
    nodeText: "搜索"
```

**size=large, state=Actived, Dark=off**

```
OSearch（SYMBOL）
│  GUID: 1042:18119
│  Width: 320px | Height: 48px
│  stroke: rgba(0,47,167,1) → Token: `color-primary1`
│
├── [搜索图标 Icon/搜索]
│   Width: 24px（large/medium）/ 16px（small/Mb）| Height: 同 Width
│   Token: `icon_size_control-m`（large/medium）/ `icon_size_control-s`（small/Mb）
│   fill: rgb(0,0,0) → Token: `color-info1`
│
├── [输入文字 PARAGRAPH]
│   fontSize: 16px → Token: `font_size-text1`
│   fill: rgb(0,0,0) → Token: `color-info1`
│
├── [光标组合 FRAME]
│   Width: 自适应 | Height: 24px
│   │
│   └── [光标 RECTANGLE]
│       Width: 1.5px | Height: 24px
│       fill: rgb(0,0,0) → Token: `color-info1`（Light）
│             rgb(255,255,255) → Token: `color-info1`（Dark）
│
└── [清除图标 Icon/关闭]
    Width: 24px（large/medium/Mb）/ 16px（small）| Height: 同 Width
    Token: `icon_size_control-m`（large/medium/Mb）/ `icon_size_control-s`（small）
    fill: rgb(0,0,0) → Token: `color-info1`（Light）
          rgb(255,255,255) → Token: `color-info1`（Dark）
```

---

### 变体 componentKey 速查

| 变体组合 | node_id | 尺寸（示例） | 说明 |
|---------|---------|------------|------|
| size=large, state=Enabled, Dark=off | `1042:18113` | 320×48px | 大尺寸，默认，浅色 |
| size=large, state=Enabled, Dark=on | `1042:18116` | 320×48px | 大尺寸，默认，深色 |
| size=large, state=Actived, Dark=off | `1042:18119` | 320×48px | 大尺寸，激活，浅色 |
| size=large, state=Actived, Dark=on | `1042:18125` | 320×48px | 大尺寸，激活，深色 |
| size=medium, state=Enabled, Dark=off | `1042:18131` | 320×40px | 中尺寸，默认，浅色 |
| size=medium, state=Enabled, Dark=on | `1042:18134` | 320×40px | 中尺寸，默认，深色 |
| size=medium, state=Actived, Dark=off | `1042:18137` | 320×40px | 中尺寸，激活，浅色 |
| size=medium, state=Actived, Dark=on | `1042:18141` | 320×40px | 中尺寸，激活，深色 |
| size=small, state=Enabled, Dark=off | `1042:18147` | 320×32px | 小尺寸，默认，浅色 |
| size=small, state=Enabled, Dark=on | `1042:18150` | 320×32px | 小尺寸，默认，深色 |
| size=small, state=Actived, Dark=off | `1042:18153` | 320×32px | 小尺寸，激活，浅色 |
| size=small, state=Actived, Dark=on | `1042:18159` | 320×32px | 小尺寸，激活，深色 |
| size=Mb, state=Enabled, Dark=off | `1042:18165` | 312×40px | 移动端，默认，浅色 |
| size=Mb, state=Enabled, Dark=on | `1042:18168` | 312×40px | 移动端，默认，深色 |
| size=Mb, state=Actived, Dark=off | `1042:18171` | 312×40px | 移动端，激活，浅色 |
| size=Mb, state=Actived, Dark=on | `1042:18177` | 312×40px | 移动端，激活，深色 |

> **注意**：示例尺寸（320px/312px）仅为演示，实际宽度随容器自适应。

---

### Pixso 操作速查

1. **插入组件**：组件面板搜索「OSearch」，拖入画布
2. **切换尺寸**：右侧面板 → size 属性 → 选择 `large` / `medium` / `small` / `Mb`
3. **切换状态**：右侧面板 → state 属性 → 选择 `Enabled` / `Actived`
4. **切换主题**：右侧面板 → Dark 属性 → 选择 `off` / `on`
5. **修改宽度**：手动调整 SYMBOL 的 width 值
6. **修改占位文字**：双击进入组件 → 双击文字图层修改内容

---

### 注意事项

- **无 Disabled 状态**：OSearch 没有 Disabled（禁用）变体，所有状态均可输入搜索
- **描边样式**：描边宽度 1px INSIDE，不影响搜索框整体尺寸
- **搜索框高度**：large=48px，medium=40px，small=32px，Mb=40px
- **文字字号**：large/medium=16px，small/Mb=14px
- **圆角统一**：所有尺寸圆角均为 4px（`radius_control-xs`）
- **背景颜色**：Light=grey-1（white），Dark=grey-4
- **描边颜色**：Enabled=grey-14@0.25（`color-control1`），Actived=brand-6（`color-primary1`）
- **图标数量**：Enabled 仅显示搜索图标，Actived 显示搜索图标 + 光标 + 清除图标
- **搜索图标尺寸**：large/medium=24×24px，small/Mb=16×16px
- **清除图标尺寸**：large/medium/Mb=24×24px，small=16×16px
- **光标尺寸**：宽度 1.5px，高度与文字行高一致（large/medium=24px，small/Mb=22px）
- **宽度自适应**：搜索框宽度随容器自适应，PC 端示例 320px，移动端示例 312px
- **尺寸用途**：large/medium/small 用于 PC 端，Mb 用于移动端
- **Dark 模式 Actived 描边**：Light 模式 rgb(0,47,167)，Dark 模式 rgb(110,148,243)

---

## Part C：交互与状态

### 交互状态

| 元素 | 状态 | 视觉表现 |
|------|------|---------|
| 搜索框 | Enabled | 背景：`color-fill2`，描边：`color-control1`，仅搜索图标 |
| 搜索框 | Actived | 背景：`color-fill2`，描边：`color-primary1`，搜索图标 + 光标 + 清除图标 |
| 搜索图标 | 所有状态 | fill：`color-info1`（grey-14），尺寸：large/medium=24px，small/Mb=16px |
| 清除图标 | Actived | fill：`color-info1`（grey-14），尺寸：large/medium/Mb=24px，small=16px |
| 光标 | Actived | fill：`color-info1`（grey-14），宽度 1.5px |
| 占位文字 | Enabled | fill：`color-info4`（grey-14 @ 0.4） |
| 输入文字 | Actived | fill：`color-info1`（grey-14 @ 1） |

---

### 状态切换逻辑

- **Enabled → Actived**：描边颜色切换为 `color-primary1`（brand-6），显示光标和清除图标
- **Actived → Enabled**：描边颜色切换为 `color-control1`（grey-14 @ 0.25），隐藏光标和清除图标
- **Light → Dark**：背景色切换 grey-1 → grey-4，描边和图标颜色同步切换为深色值

---

### Hover 状态（交互态）

| 元素 | Hover 视觉表现 |
|------|---------------|
| 搜索框（Enabled） | 描边颜色切换为 `color-control2`（brand-6） |
| 搜索框（Actived） | 描边颜色不变 |
| 清除图标 | 显示悬浮提示，颜色不变 |

---

### Focus 状态

Focus 状态即 Actived 状态，显示光标和清除图标。

---

## Part D：设计变量绑定

### 推荐绑定变量

| 元素 | 属性 | 推荐变量 Token |
|------|------|---------------|
| 搜索框背景 | fill | `color-fill2` |
| 搜索框描边（Enabled） | stroke | `color-control1` |
| 搜索框描边（Actived） | stroke | `color-primary1` |
| 搜索图标 | fill | `color-info1` |
| 搜索图标尺寸（large/medium） | width/height | `icon_size_control-m`（24px） |
| 搜索图标尺寸（small/Mb） | width/height | `icon_size_control-s`（16px） |
| 清除图标 | fill | `color-info1` |
| 清除图标尺寸（large/medium/Mb） | width/height | `icon_size_control-m`（24px） |
| 清除图标尺寸（small） | width/height | `icon_size_control-s`（16px） |
| 光标 | fill | `color-info1` |
| 占位文字（Enabled） | fill | `color-info4` |
| 输入文字（Actived） | fill | `color-info1` |
| 搜索框高度（large） | height | `control_size-xl`（48px） |
| 搜索框高度（medium/Mb） | height | `control_size-l`（40px） |
| 搜索框高度（small） | height | `control_size-m`（32px） |
| 搜索框圆角 | cornerRadius | `radius_control-xs`（4px） |
| 文字字号（large/medium） | fontSize | `font_size-text1`（16px） |
| 文字字号（small/Mb） | fontSize | `font_size-tip1`（14px） |
| 图标尺寸 | width/height | `icon_size_control-m`（24px） |
| 光标宽度 | width | 1.5px |
| 描边宽度 | strokeWeight | 1px INSIDE |

---

## Part E：最佳实践

### 使用建议

1. **尺寸选择**：PC 端默认使用 medium，突出搜索使用 large，紧凑布局使用 small；移动端使用 Mb
2. **搜索图标**：始终显示搜索图标，传达搜索功能语义
3. **清除图标**：仅在 Actived 状态且有输入内容时显示清除图标
4. **宽度设置**：搜索框宽度应与容器宽度匹配，PC 端建议 320-400px，移动端建议 312px

### 设计提示

- 搜索框高度：large=48px，medium=40px，small=32px，Mb=40px（移动端）
- 文字字号：large/medium=16px，small/Mb=14px
- 搜索图标尺寸：large/medium=24×24px，small/Mb=16×16px
- 清除图标尺寸：large/medium/Mb=24×24px，small=16×16px
- Actived 状态显示光标（1.5px）和清除图标
- 描边样式为 1px INSIDE，不影响搜索框整体尺寸
- 深色模式下 Actived 描边颜色为 rgb(110,148,243)
- 搜索框宽度自适应，根据容器或内容需求设置

---

## 技术备注

- 组件节点 ID：`1042:18112`（组件集）
- 设计稿 URL：https://pixso.cn/app/design/JZkjW0mhmT61Mtd98dCfBw?item-id=1042:18112
- 生成日期：2026-04-17
- 变体总数：16（size=large/medium/small/Mb × state=Enabled/Actived × Dark=off/on）
- 无 Disabled 状态：所有状态均可输入搜索
- 尺寸数据：large=320×48px，medium=320×40px，small=320×32px，Mb=312×40px（示例）
- 搜索框高度：large=48px，medium=40px，small=32px，Mb=40px
- 圆角：4px（radius_control-xs）
- 描边：1px INSIDE
- 文字字号：large/medium=16px（font_size-text1），small/Mb=14px（font_size-tip1）
- 背景：Light=grey-1（white），Dark=grey-4（color-fill2）
- 描边：Enabled=grey-14@0.25（color-control1），Actived=brand-6（color-primary1）
- 搜索图标：large/medium=24×24px（icon_size_control-m），small/Mb=16×16px（icon_size_control-s），始终显示
- 清除图标：large/medium/Mb=24×24px（icon_size_control-m），small=16×16px（icon_size_control-s），仅 Actived 显示
- 光标：宽度 1.5px，高度 large/medium=24px，small/Mb=22px
- 尺寸用途：large/medium/small 用于 PC 端，Mb 用于移动端