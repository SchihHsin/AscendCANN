# OCard 卡片 · 设计 Skill

> 组件集合节点：`1042:21386` · 组件名：OCard 卡片 · 变体总数：待确认

---

## Part A：设计使用卡

### 组件概览

**OCard 卡片**：用于承载和展示内容的容器组件，通过卡片边界划分内容区域，提升页面视觉层次感。支持封面卡片和图标卡片两种类型，水平/垂直两种布局，可选头部、内容区、底部三段式结构。适用于信息展示、列表项、内容分组等场景。

---

### 适用场景

- ✅ **封面卡片**：产品展示、图文卡片、新闻列表项，封面图突出视觉吸引力
- ✅ **图标卡片**：功能入口、快捷操作、统计卡片，图标辅助语义传达
- ✅ **信息展示**：用户信息卡、订单信息卡、商品信息卡等
- ✅ **列表项**：卡片式列表布局，每个列表项为独立卡片
- ✅ **内容分组**：页面中不同内容模块的边界标识
- ❌ **不适合**：表单分组（用分割线）、导航切换（用 Tab）、大量文字描述（用详情页）

---

### 变体说明

**type（卡片类型）**
- `cover` — 封面卡片，头部包含封面图片区域，视觉吸引力强，适合产品展示、图文卡片
- `icon` — 图标卡片，头部包含图标区域，语义传达清晰，适合功能入口、统计卡片

**layout（布局方式）**
- `horizontal` — 水平布局，卡片内容横向排列，适合侧边栏卡片、列表项横向展示
- `vertical` — 垂直布局，卡片内容纵向排列，**默认布局**，适合大多数卡片场景

**Dark（主题）**
- `off` — 浅色模式（默认）
- `on` — 深色模式，背景色自动切换为对应深色值

---

### 布局结构

> 🧩 **布局结构**：卡片整体为容器节点（FRAME），内部由 Header（头部）、Body（内容区）、Footer（底部）三部分组成，布局方式由 `layout` 变体控制。

**layout=vertical 布局**

```
OCard（VERTICAL，自适应宽高）
│  cornerRadius: 4px
│  fill: color-fill2（卡片背景）
│  shadow: shadow-2（悬浮时显示）
│
├── [Header 头部 FRAME]（自适应宽，固定高度）
│   ├── [封面图片 IMAGE]（cover 类型）/ [图标 Icon INSTANCE]（icon 类型）
│   └── [标题文字 PARAGRAPH]
│
├── [Body 内容区 FRAME]（自适应宽高）
│   └── [内容节点...]
│
└── [Footer 底部 FRAME]（自适应宽，固定高度）
    └── [操作按钮 INSTANCE...]
```

**layout=horizontal 布局**

```
OCard（HORIZONTAL，自适应宽高）
│  cornerRadius: 4px
│  fill: color-fill2
│  shadow: shadow-2（悬浮时显示）
│
├── [Header 头部 FRAME]（固定宽度，自适应高度）
│   ├── [封面图片 IMAGE]（cover）/ [图标 Icon INSTANCE]（icon）
│   └── [标题文字 PARAGRAPH]
│
├── [Body 内容区 FRAME]（自适应宽高）
│   └── [内容节点...]
│
└── [Footer 底部 FRAME]（固定宽度，自适应高度）
    └── [操作按钮 INSTANCE...]
```

---

### 组合搭配

> 🔗 **常见搭配**：
> - **产品列表**：封面卡片（cover + vertical）纵向排列，用于电商产品列表、新闻列表
> - **功能入口**：图标卡片（icon + horizontal）横向排列，用于快捷操作入口
> - **信息卡片**：图标卡片（icon + vertical）独立展示，用于用户信息卡、订单信息卡
> - **统计卡片**：图标卡片（icon + vertical + large padding），用于数据统计展示

---

### 设计稿识别指南

> 🔍 **识别特征**：
> - 容器节点（FRAME），圆角 4px，无边框描边
> - 背景为 `color-fill2`（浅灰填充色）
> - 悬浮时显示阴影 `shadow-2`
> - 内部结构分为 Header、Body、Footer 三部分（可选）
> - Header 包含封面图片（cover）或图标（icon）+ 标题

> 🔄 **易混淆组件**：
> - 与 **OPanel 面板** 的区别：Card 是独立卡片单元，视觉边界清晰；Panel 是大面积容器，边界模糊
> - 与 **OListItem 列表项** 的区别：Card 是独立组件，可脱离列表使用；ListItem 是列表组件的子单元

---

### 响应式行为

参照 `scripts/grid.json` 中的断点定义，OCard 无自动断点响应式行为。宽度由容器或栅格系统控制，高度由内容自适应。布局方式通过 `layout` 变体手动切换。

---

## Part B：规格速查参考

### 变体索引表

| 变体属性 | 可选值 | 默认值 | 视觉差异 |
|---------|--------|--------|---------|
| type | `cover` / `icon` | `cover` | 封面图片 / 图标 |
| layout | `horizontal` / `vertical` | `vertical` | 水平排列 / 垂直排列 |
| Dark | `off` / `on` | `off` | 浅色模式 / 深色模式 |

---

### 布局规格

| 规格项 | cover | icon |
|--------|-------|------|
| 圆角 | 4px | 4px |
| Token（圆角） | `radius_control-m` | `radius_control-m` |
| 背景 | `color-fill2` | `color-fill2` |
| 边框 | 无 | 无 |
| 阴影（悬浮） | `shadow-2` | `shadow-2` |
| Header 内边距 | 见下表 | 见下表 |
| Body 内边距 | 见下表 | 见下表 |
| Footer 内边距 | 见下表 | 见下表 |

> **说明**：卡片宽度由容器或栅格系统控制，高度由内容自适应。内边距根据布局和内容密度有不同规格。

---

### 内边距规格

> **cover 类型**：卡片容器统一 padding 8px，各 section 无独立 padding，Body（文字区域）额外增加 bottom 16px、left/right 16px。
> **icon 类型**：卡片容器统一 padding top/bottom 24px、left/right 32px，无独立 section padding。

**cover 类型内边距**

| 区域 | vertical（上/下） | horizontal（左/右） |
|------|-----------------|-------------------|
| Header 内边距 | 8px | 8px |
| Body 内边距 | 上 0px · 下 16px | 16px |
| Footer 内边距 | 8px | 8px |
| 区域间距（Header↔Body） | 24px | — |
| 区域间距（Body↔Footer） | 24px | — |

**icon 类型内边距**

| 区域 | vertical（垂直布局） | horizontal（水平布局） |
|------|-----------------|-------------------|
| 卡片容器 padding（上/下） | 24px | 24px |
| 卡片容器 padding（左/右） | 32px | 32px |
| 内容项间距（gap） | 16px | 24px |

---

### 封面图片规格（cover 类型）

| 规格项 | vertical | horizontal |
|--------|----------|------------|
| 图片宽度 | 自适应（跟随卡片宽度） | 固定（如 120px） |
| 图片高度 | 固定比例（如 16:9）或固定高度 | 自适应（跟随卡片高度） |
| 圆角 | 0px（无圆角）或顶部圆角 4px | 0px 或左侧圆角 4px |

---

### 图标规格（icon 类型）

| 规格项 | vertical | horizontal |
|--------|----------|------------|
| 图标尺寸 | 32px | 32px |
| Token（图标尺寸） | `icon_size-l` | `icon_size-l` |
| 图标颜色 | `color-primary1` | `color-primary1` |
| 图标背景 | `color-primary1-light` | `color-primary1-light` |
| 图标圆角 | 4px | 4px |

---

### 颜色 Token 映射

| 区域 | Light 模式 Token | Dark 模式 Token | RGB 值 |
|------|-----------------|----------------|--------|
| 卡片背景 | `color-fill2` | `color-fill2` | rgb(255,255,255) → rgb(36,36,39) |
| 悬浮阴影 | `shadow-2` | `shadow-2` | 0 2px 24px rgba(0,0,0,0.15) → 0 2px 24px rgba(255,255,255,0.15) |
| 标题文字 | `color-info1` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |
| 内容文字 | `color-info2` | `color-info2` | rgba(0,0,0,0.8) → rgba(255,255,255,0.8) |
| 图标颜色 | `color-info1` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |

---

### 字体样式映射

| 使用场景 | 字号 Token | 行高 Token | 字重 Token | 字号值 | 行高值 |
|---------|-----------|-----------|-----------|-------|-------|
| Header 标题 | `font_size-text1` | `line_height-text1` | `font_weight-bold` | 16px | 24px |
| Body 正文 | `font_size-tip1` | `line_height-tip1` | `font_weight-regular` | 14px | 22px |
| Footer 按钮 | `font_size-tip1` | `line_height-tip1` | `font_weight-regular` | 14px | 22px |

字体族：`font_family`（HarmonyOS / HarmonyHeiTi）

---

### 组件层级结构

```
OCard（FRAME，自适应宽高）
│  cornerRadius: 4px（radius_control-m）
│  fill: color-fill2
│  effects: shadow-2（悬浮时）
│
├── [Header 头部 FRAME]（自适应宽/固定宽）
│   autoLayoutPadding: 见内边距规格
│   autoLayoutDirection: HORIZONTAL / VERTICAL
│   │
│   ├── [封面图片 IMAGE]（cover 类型）
│   │     width: 自适应（vertical）/ 固定（horizontal）
│   │     height: 固定比例或自适应
│   │   或 [图标容器 FRAME]（icon 类型）
│   │     width/height: 32px（icon_size-l）
│   │     cornerRadius: 4px
│   │     fill: color-primary1-light
│   │     └── [图标 Icon INSTANCE]
│   │           fill: color-primary1
│   │
│   └── [标题文字 PARAGRAPH]
│         font: font_family Bold | font_size-text1
│         fill: color-info1
│
├── [Body 内容区 FRAME]（自适应宽高）
│   autoLayoutPadding: 见内边距规格
│   └── [内容节点...]
│         fill: color-info2
│
└── [Footer 底部 FRAME]（自适应宽/固定宽）
    autoLayoutPadding: 见内边距规格
    autoLayoutDirection: HORIZONTAL
    └── [操作按钮 OButton INSTANCE...]
```

---

### 变体 componentKey 速查

| 变体组合 | node_id | 说明 |
|---------|---------|------|
| type=cover, layout=vertical, Dark=off | `1042:21386` | 封面卡片，垂直布局，浅色模式（待确认） |
| type=icon, layout=vertical, Dark=off | 待确认 | 图标卡片，垂直布局，浅色模式 |
| type=cover, layout=horizontal, Dark=off | 待确认 | 封面卡片，水平布局，浅色模式 |
| type=icon, layout=horizontal, Dark=off | 待确认 | 图标卡片，水平布局，浅色模式 |
| Dark=on | 待确认 | 深色模式变体 |

> **注意**：componentKey 需从 Pixso 组件面板获取。当前 node_id 为用户提供的设计稿链接中的 item-id。

---

### Pixso 操作速查

1. **插入组件**：组件面板搜索「OCard」，拖入画布
2. **切换类型**：右侧面板 → type 属性 → 选择 `cover` / `icon`
3. **切换布局**：右侧面板 → layout 属性 → 选择 `horizontal` / `vertical`
4. **切换主题**：右侧面板 → Dark 属性 → 选择 `off` / `on`
5. **设置宽度**：拖拽卡片边缘或设置容器宽度约束
6. **替换封面**：双击进入 Header → 替换封面图片资源
7. **替换图标**：双击进入 Header → 双击图标层 → 选择新图标
8. **修改标题**：双击进入 Header → 双击标题文字修改内容
9. **添加内容**：双击进入 Body → 添加内容节点
10. **添加按钮**：双击进入 Footer → 添加 OButton 组件实例

---

### 注意事项

- **宽度控制**：卡片宽度由容器或栅格系统控制，无固定宽度约束
- **高度自适应**：卡片高度由内容自适应，避免固定高度导致内容溢出
- **悬浮阴影**：默认无阴影，悬浮时显示 `shadow-2`，提升交互反馈
- **封面图片**：需确保图片比例与卡片布局匹配，避免图片变形
- **图标语义**：图标应与卡片内容语义一致，增强信息传达
- **深色模式**：背景色自动切换为深色值，确保在深色背景上可见
- **三段式结构**：Header、Body、Footer 可根据场景选择性使用，不必全部包含

---

## Part C：交互与状态

### 状态定义

| 状态 | 说明 | 视觉差异 |
|------|------|---------|
| 默认 | 卡片正常显示，无悬浮 | 无阴影，无边框 |
| 悬浮 | 鼠标悬浮在卡片上 | 显示阴影 shadow-2 |
| 选中 | 卡片被选中（可选功能） | 边框切换为 color-primary1 或其他强调色 |
| 禁用 | 卡片禁用，不可交互 | 整体透明度降低或使用禁用色 |

### 交互行为

- **悬浮阴影**：鼠标悬浮时显示阴影，提升交互反馈
- **点击跳转**：卡片整体可点击，跳转到详情页或执行操作
- **按钮交互**：Footer 底部按钮可独立点击，执行对应操作

---

## Part D：设计变量绑定

### 推荐绑定变量

| 元素 | 属性 | 推荐变量 Token |
|------|------|---------------|
| 卡片背景 | fill | `color-fill2` |
| 悬浮阴影 | effects | `shadow-2` |
| 圆角 | cornerRadius | `radius_control-m`（4px） |
| 标题文字 | fill | `color-info1` |
| 内容文字 | fill | `color-info2` |
| 图标颜色 | fill | `color-primary1` |
| 图标背景 | fill | `color-primary1-light` |
| 图标尺寸 | width/height | `icon_size-l`（32px） |
| Header 内边距 | autoLayoutPadding | 待确认 |
| Body 内边距 | autoLayoutPadding | 待确认 |
| Footer 内边距 | autoLayoutPadding | 待确认 |
| 区域间距 | autoLayoutItemSpacing | 待确认 |
| 标题字号 | fontSize | `font_size-text1`（16px） |
| 标题字重 | fontWeight | `font_weight-bold` |
| 正文字号 | fontSize | `font_size-tip1`（14px） |

---

## Part E：最佳实践

### 使用建议

1. **类型匹配内容**：图文内容使用 cover 类型，功能/统计使用 icon 类型
2. **布局匹配场景**：独立展示使用 vertical，侧边栏或横向排列使用 horizontal
3. **宽度控制**：卡片宽度由栅格系统控制，遵循栅格规范
4. **内容密度**：卡片内容不宜过多，避免信息过载

### 设计提示

- 卡片悬浮阴影提升交互反馈，但同一区域不宜过多使用悬浮效果
- 封面图片比例应统一，如 16:9 或 1:1，避免不同卡片视觉不一致
- 图标尺寸和颜色应保持统一，增强视觉一致性
- Footer 底部按钮不超过 3 个，避免操作过多造成用户困惑
- 深色模式下背景色和边框色均需切换，确保可见性
- 卡片间距推荐 16px（gap-4）或 24px（gap-5），根据场景调整

---

## 技术备注

- 组件节点 ID：`1042:21386`（组件集）
- 设计稿 URL：https://pixso.cn/app/design/JZkjW0mhmT61Mtd98dCfBw?item-id=1042:21386
- 生成日期：2026-04-17
- 变体总数：待确认（type × layout × Dark）
- 卡片类型：cover（封面卡片）、icon（图标卡片）
- 布局方式：horizontal（水平）、vertical（垂直）
- 结构组成：Header（头部）、Body（内容区）、Footer（底部）
- 圆角：4px（radius_control-m）
- 悬浮阴影：shadow-2
- 数据来源：用户提供的设计规范信息，部分规格需从设计稿确认