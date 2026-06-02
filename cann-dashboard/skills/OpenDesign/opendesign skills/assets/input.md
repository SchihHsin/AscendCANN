# OInput 输入框 · 设计 Skill

> 组件集合节点：`1042:18183` · 组件名：OInput 输入框 · 变体总数：12

---

## Part A：设计使用卡

### 组件概览

**OInput 输入框**：用于接收用户文本输入的基础表单控件。支持三种尺寸（large/medium/small）、三种状态（Enabled/Error/Complete），以及 Light/Dark 主题。输入框由标签、输入区域、提示文字组成，通过描边颜色区分正常和错误状态。

---

### 适用场景

- ✅ **表单输入**：登录表单、注册表单、信息填写等场景
- ✅ **搜索输入**：搜索框、筛选输入、查找功能
- ✅ **数据录入**：数据编辑、配置设置、参数输入
- ✅ **评论输入**：评论框、反馈输入、备注填写
- ❌ **不适合**：多行长文本（用 TextArea）、富文本编辑（用 RichTextEditor）、只读展示（用 OText）

---

### 变体说明

**size（尺寸）**
- `large` — 输入框高度 40px，文字字号 16px，**PC 端**突出的表单区域或重要输入
- `medium` — 输入框高度 32px，文字字号 14px，**PC 端默认尺寸**，适合大多数表单场景
- `small` — 输入框高度 40px，文字字号 14px，提示文字 12px，**移动端专用**

**Type（状态类型）**
- `Enabled` — 正常状态，默认可输入状态
- `Error` — 错误状态，描边使用红色，配合错误提示文字
- `Complete` — 完成状态，视觉上与 Enabled 相同（描边 grey-14@0.25），表示输入已完成但无特殊视觉反馈

**Dark（主题）**
- `off` — 浅色模式（默认），背景白色
- `on` — 深色模式，背景使用 grey-4

> **说明**：`Group-*` 变体（Group-tittle、Group-btn、Group-number）是组合示例，展示带标题、按钮、数字输入的完整输入框组合，不是单独的基础状态。

---

### 布局结构

> 🧩 **布局结构**：输入框由标签区域（可选）、输入区域、提示区域（可选）组成。输入区域是 FRAME 节点，包含文字输入层和可选的前缀/后缀图标。

**基础结构**

```
OInput（SYMBOL，自适应宽度，固定高度）
├── Width: 自适应（示例 320px large/medium，312px small）
├── Height: 40px（large/small）/ 32px（medium）
│
├── [提示区域 FRAME]（可选）
│   Width: 自适应 | Height: 22px（large）/ 18px（medium/small）
│   └── [提示文字 PARAGRAPH]
│         fontSize: 14px（large）/ 12px（medium/small）
│         fill: grey-14（Light）/ grey-14（Dark）
│         text: 提示语内容
│
└── [输入区域 FRAME]
    Width: 自适应 | Height: 40px（large/small）/ 32px（medium）
    cornerRadius: 4px
    fill: grey-1（Light）/ grey-4（Dark）
    stroke: grey-14@0.25（Enabled）/ red-6（Error）
    strokeWeight: 1px INSIDE
    │
    ├── [前缀图标]（可选，如搜索图标）
    │   Width: 16-24px | Height: 16-24px
    │
    ├── [输入文字 PARAGRAPH]
    │   fontSize: 16px（large）/ 14px（medium/small）
    │   fill: grey-14（Light）/ grey-14（Dark）
    │   text: 用户输入内容或占位文字
    │
    └── [后缀图标]（可选，如清除、完成图标）
        Width: 16-24px | Height: 16-24px
```

---

### 组合搭配

> 🔗 **常见搭配**：
> - **表单组合**：OInput + OLabel + OButton，构成完整表单
> - **搜索组合**：OInput（带搜索图标）+ OButton（搜索按钮）
> - **登录表单**：用户名输入框 + 密码输入框 + 提交按钮
> - **筛选输入**：OInput + OSelect + OToggle，构成筛选栏

---

### 设计稿识别指南

> 🔍 **识别特征**：
> - 输入区域 FRAME 节点，高度 32/40px，圆角 4px
> - Enabled 状态：背景 white/grey-4，描边 grey-14@0.25（color-control1）
> - Error 状态：背景不变，描边 red-6（color-danger1）
> - 文字字号：large=16px，medium/small=14px
> - 提示字号：large=14px，medium/small=12px
> - 无 Disabled 状态

> 🔄 **易混淆组件**：
> - 与 **TextArea 多行输入**：Input 是单行输入，固定高度；TextArea 是多行，高度自适应
> - 与 **OSelect 选择器**：Select 用于下拉选择，有下拉箭头；Input 用于自由文本输入

---

### 响应式行为

参照 `scripts/grid.json` 中的断点定义，OInput 输入框宽度随容器自适应，无固定断点响应式行为。

---

## Part B：规格速查参考

### 变体索引表

| 变体属性 | 可选值 | 默认值 | 视觉差异 |
|---------|--------|--------|---------|
| size | `large` / `medium` / `small` | `medium` | PC 端 40/32px，移动端 40px，字号 16/14/14px |
| Type | `Enabled` / `Error` / `Complete` | `Enabled` | 描边颜色 grey/red/grey |
| Dark | `off` / `on` | `off` | 背景色 white/grey-4 |

---

### 布局规格

> **尺寸用途说明**：`large` 和 `medium` 用于 PC 端，`small` 用于移动端。

| 规格项 | large（PC） | medium（PC） | small（移动端） |
|--------|-------|--------|-------|
| 输入框高度 | 40px | 32px | 40px |
| Token（高度） | `control_size-l` | `control_size-m` | `control_size-l` |
| 输入框宽度 | 自适应（示例 320px） | 自适应（示例 320px） | 自适应（示例 312px） |
| 输入框圆角 | 4px | 4px | 4px |
| Token（圆角） | `radius_control-xs` | `radius_control-xs` | `radius_control-xs` |
| 占位文字字号（输入框内） | 16px | 14px | 14px |
| Token（字号） | `font_size-text1` | `font_size-tip1` | `font_size-tip1` |
| 占位文字行高 | 24px | 22px | 22px |
| Token（行高） | `line_height-text1` | `line_height-tip1` | `line_height-tip1` |
| 提示文字字号（输入框外） | 14px | 12px | 12px |
| Token（提示字号） | `font_size-tip1` | `font_size-tip2` | `font_size-tip2` |
| 提示区域高度 | 22px | 18px | 18px |
| 描边宽度 | 1px INSIDE | 1px INSIDE | 1px INSIDE |

---

### 颜色 Token 映射

#### 输入区域（Enabled 状态）

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 输入框背景 | `grey-1` | `grey-4` | `color-fill2` | rgb(255,255,255) → rgb(36,36,39) |
| 输入框描边 | `grey-14 @ 0.25` | `grey-14 @ 0.25` | `color-control1` | rgba(0,0,0,0.25) → rgba(255,255,255,0.25) |
| 提示文字（输入框外） | `grey-14 @ 0.6` | `grey-14 @ 0.6` | `color-info3` | rgba(0,0,0,0.6) → rgba(255,255,255,0.6) |
| 占位文字（输入框内） | `grey-14 @ 0.4` | `grey-14 @ 0.4` | `color-info4` | rgba(0,0,0,0.4) → rgba(255,255,255,0.4) |

#### 输入区域（Error 状态）

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 输入框背景 | `grey-1` | `grey-4` | `color-fill2` | rgb(255,255,255) → rgb(36,36,39) |
| 输入框描边 | `red-6` | `red-6` | `color-danger1` | rgb(230,0,18) → rgb(235,35,45) |
| 提示文字（输入框外） | `grey-14 @ 0.6` | `grey-14 @ 0.6` | `color-info3` | rgba(0,0,0,0.6) → rgba(255,255,255,0.6) |
| 错误提示文字（输入框外） | `red-6` | `red-6` | `color-danger1` | rgb(230,0,18) → rgb(235,35,45) |
| 占位文字（输入框内） | `grey-14` | `grey-14` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |

#### 输入区域（Complete 状态）

Complete 状态视觉上与 Enabled 状态相同，无特殊颜色差异。

| 区域 | Light 模式 | Dark 模式 | Token | RGB 值 |
|------|-----------|----------|-------|--------|
| 输入框背景 | `grey-1` | `grey-4` | `color-fill2` | rgb(255,255,255) → rgb(36,36,39) |
| 输入框描边 | `grey-14 @ 0.25` | `grey-14 @ 0.25` | `color-control1` | rgba(0,0,0,0.25) → rgba(255,255,255,0.25) |
| 提示文字（输入框外） | `grey-14 @ 0.6` | `grey-14 @ 0.6` | `color-info3` | rgba(0,0,0,0.6) → rgba(255,255,255,0.6) |
| 占位文字（输入框内） | `grey-14` | `grey-14` | `color-info1` | rgb(0,0,0) → rgb(255,255,255) |

---

### 字体样式映射

| 使用场景 | 字号 Token | 行高 Token | 字重 Token | 字号值 | 行高值 |
|---------|-----------|-----------|-----------|-------|-------|
| large 占位文字（输入框内） | `font_size-text1` | `line_height-text1` | `font_weight-regular` | 16px | 24px |
| medium/small 占位文字（输入框内） | `font_size-tip1` | `line_height-tip1` | `font_weight-regular` | 14px | 22px |
| large 提示文字（输入框外） | `font_size-tip1` | — | `font_weight-regular` | 14px | — |
| medium/small 提示文字（输入框外） | `font_size-tip2` | — | `font_weight-regular` | 12px | — |

字体族：`font_family`（HarmonyOS / HarmonyHeiTi Regular）

---

### 组件层级结构

**size=large, Type=Enabled, Dark=off**

```
OInput（SYMBOL）
│  GUID: 1042:18202
│  Width: 自适应（示例 320px）| Height: 40px
│
├── [提示区域 FRAME]
│   GUID: 内部节点
│   Width: 320px | Height: 22px
│   │
│   └── [提示文字 PARAGRAPH]
│       Width: 268px | Height: 22px
│       fontSize: 14px → Token: `font_size-tip1`
│       fill: rgba(0,0,0,0.6) → Token: `color-info3`（Light）
│             rgba(255,255,255,0.6) → Token: `color-info3`（Dark）
│       nodeText: "提示语"
│
└── [输入区域 FRAME]
    GUID: 内部节点（属性 1=L,属性 2=Enabled）
    Width: 320px | Height: 40px
    cornerRadius: 4px → Token: `radius_control-xs`
    fill: rgb(255,255,255) → Token: `color-fill2`（Light）
          rgb(36,36,39) → Token: `color-fill2`（Dark）
    stroke: rgba(0,0,0,0.25) → Token: `color-control1`（Light Enabled）
            rgba(255,255,255,0.25) → Token: `color-control1`（Dark Enabled）
            rgba(230,0,18,1) → Token: `color-danger1`（Light Error）
            rgba(235,35,45,1) → Token: `color-danger1`（Dark Error）
    strokeWeight: 1px | strokeAlign: INSIDE
    │
    └── [输入文字 PARAGRAPH]
        Width: 自适应 | Height: 24px
        fontSize: 16px → Token: `font_size-text1`
        fill: rgba(0,0,0,0.4) → Token: `color-info4`（Light）
              rgba(255,255,255,0.4) → Token: `color-info4`（Dark）
        nodeText: "Hint"（占位文字示例）
```

**size=medium, Type=Enabled, Dark=off**

```
OInput（SYMBOL）
│  GUID: 1042:18258
│  Width: 320px | Height: 32px
│
├── [提示区域 FRAME]
│   Width: 320px | Height: 18px
│   └── [提示文字]
│       fontSize: 12px → Token: `font_size-tip2`
│
└── [输入区域 FRAME]
    Width: 320px | Height: 32px
    cornerRadius: 4px
    fill: rgb(255,255,255) → Token: `color-fill2`
    stroke: rgba(0,0,0,0.25) → Token: `color-control1`
    strokeWeight: 1px INSIDE
    │
    └── [输入文字]
        fontSize: 14px → Token: `font_size-tip1`
        nodeText: "Hint"
```

**size=small, Type=Enabled, Dark=off**

```
OInput（SYMBOL）
│  GUID: 1042:18284
│  Width: 312px | Height: 40px
│
├── [提示区域 FRAME]
│   Width: 312px | Height: 18px
│   └── [提示文字]
│       fontSize: 12px → Token: `font_size-tip2`
│       nodeText: "提示语"
│
└── [输入区域 FRAME]
    Width: 312px | Height: 40px
    cornerRadius: 4px
    fill: rgb(255,255,255) → Token: `color-fill2`
    stroke: rgba(0,0,0,0.25) → Token: `color-control1`
    strokeWeight: 1px INSIDE
    │
    └── [输入文字]
        fontSize: 14px → Token: `font_size-tip1`
        nodeText: "Hint"
```

---

### 变体 componentKey 速查

| 变体组合 | node_id | 尺寸（示例） | 说明 |
|---------|---------|------------|------|
| size=large, Type=Enabled, Dark=off | `1042:18202` | 320×40px | 大尺寸，正常，浅色 |
| size=large, Type=Enabled, Dark=on | `1042:18209` | 320×40px | 大尺寸，正常，深色 |
| size=large, Type=Error, Dark=off | `1042:18216` | 320×40px | 大尺寸，错误，浅色 |
| size=large, Type=Error, Dark=on | `1042:18221` | 320×40px | 大尺寸，错误，深色 |
| size=large, Type=Complete, Dark=off | `1042:18226` | 320×40px | 大尺寸，完成，浅色 |
| size=large, Type=Complete, Dark=on | `1042:18233` | 320×40px | 大尺寸，完成，深色 |
| size=medium, Type=Enabled, Dark=off | `1042:18258` | 320×32px | 中尺寸，正常，浅色 |
| size=medium, Type=Enabled, Dark=on | `1042:18265` | 320×32px | 中尺寸，正常，深色 |
| size=medium, Type=Complete, Dark=off | `1042:18240` | 320×32px | 中尺寸，完成，浅色 |
| size=medium, Type=Complete, Dark=on | `1042:18249` | 320×32px | 中尺寸，完成，深色 |
| size=small, Type=Enabled, Dark=off | `1042:18284` | 312×40px | 小尺寸，正常，浅色 |
| size=small, Type=Enabled, Dark=on | `1042:18291` | 312×40px | 小尺寸，正常，深色 |
| size=small, Type=Error, Dark=off | `1042:18322` | 312×40px | 小尺寸，错误，浅色 |
| size=small, Type=Error, Dark=on | `1042:18328` | 312×40px | 小尺寸，错误，深色 |
| size=small, Type=Complete, Dark=off | `1042:18298` | 312×40px | 小尺寸，完成，浅色 |
| size=small, Type=Complete, Dark=on | `1042:18307` | 312×40px | 小尺寸，完成，深色 |

> **注意**：示例尺寸（320px/312px）仅为演示，实际宽度随容器自适应。

---

### Pixso 操作速查

1. **插入组件**：组件面板搜索「OInput」，拖入画布
2. **切换尺寸**：右侧面板 → size 属性 → 选择 `large` / `medium` / `small`
3. **切换状态**：右侧面板 → Type 属性 → 选择 `Enabled` / `Error` / `Complete`
4. **切换主题**：右侧面板 → Dark 属性 → 选择 `off` / `on`
5. **修改宽度**：手动调整 SYMBOL 的 width 值
6. **修改提示文字**：双击进入组件 → 双击提示文字图层修改内容
7. **修改占位文字**：双击进入组件 → 双击输入文字图层修改内容

---

### 注意事项

- **无 Disabled 状态**：OInput 没有 Disabled（禁用）变体，所有状态均可输入
- **描边样式**：描边宽度 1px INSIDE，不影响输入框整体尺寸
- **输入框高度**：large=40px，medium=32px，small=40px（与 large 相同）
- **文字字号**：large=16px，medium/small=14px
- **提示字号**：large=14px，medium/small=12px
- **圆角统一**：所有尺寸圆角均为 4px（`radius_control-xs`）
- **背景颜色**：Light=grey-1（white），Dark=grey-4
- **描边颜色**：Enabled=grey-14@0.25（`color-control1`），Error=red-6（`color-danger1`）
- **Complete 状态**：视觉与 Enabled 相同，描边使用 `color-control1`，无图标
- **占位文字颜色差异**：Enabled=grey-14@0.4（`color-info4`），Error/Complete=grey-14@1（`color-info1`）
- **宽度自适应**：输入框宽度随容器自适应，无固定宽度
- **Group 变体**：组合示例，展示带标题、按钮、数字输入的完整输入框组合
- **提示区域**：可选，默认不显示，需要时可手动添加或使用 Group 变体

---

## Part C：交互与状态

### 交互状态

| 元素 | 状态 | 视觉表现 |
|------|------|---------|
| 输入框 | Enabled | 背景：`color-fill2`，描边：`color-control1` |
| 输入框 | Error | 背景：`color-fill2`，描边：`color-danger1`（red-6） |
| 输入框 | Complete | 背景：`color-fill2`，描边：`color-control1`（与 Enabled 相同） |
| 提示文字（输入框外） | Enabled | fill：`color-info3`（grey-14 @ 0.6） |
| 提示文字（输入框外） | Error/Complete | fill：`color-info3`（grey-14 @ 0.6） |
| 占位文字（输入框内） | Enabled | fill：`color-info4`（grey-14 @ 0.4） |
| 占位文字（输入框内） | Error/Complete | fill：`color-info1`（grey-14 @ 1） |

---

### 状态切换逻辑

- **Enabled → Error**：描边颜色切换为 `color-danger1`（red-6），显示错误提示文字
- **Error → Enabled**：描边颜色切换为 `color-control1`（grey-14 @ 0.25），隐藏错误提示
- **Enabled → Complete**：视觉不变，仅作为语义状态标记输入已完成
- **Complete → Enabled**：恢复 Enabled 状态（视觉无差异）
- **Light → Dark**：背景色切换 grey-1 → grey-4，描边和文字颜色同步切换为深色值

---

### Hover 状态（交互态）

| 元素 | Hover 视觉表现 |
|------|---------------|
| 输入框（Enabled） | 描边颜色切换为 `color-control2`（brand-6） |
| 输入框（Error） | 描边颜色不变 |
| 输入框（Complete） | 描边颜色切换为 `color-control2`（brand-6）（与 Enabled 相同） |

---

### Focus 状态（交互态）

| 元素 | Focus 视觉表现 |
|------|---------------|
| 输入框 | 描边颜色切换为 `color-control2`（brand-6），显示光标 |

---

## Part D：设计变量绑定

### 推荐绑定变量

| 元素 | 属性 | 推荐变量 Token |
|------|------|---------------|
| 输入框背景 | fill | `color-fill2` |
| 输入框描边（Enabled） | stroke | `color-control1` |
| 输入框描边（Error） | stroke | `color-danger1` |
| 提示文字（输入框外） | fill | `color-info3` |
| 错误提示文字（输入框外） | fill | `color-danger1` |
| 占位文字（输入框内） Enabled | fill | `color-info4` |
| 占位文字（输入框内） Error/Complete | fill | `color-info1` |
| 输入框高度（large/small） | height | `control_size-l`（40px） |
| 输入框高度（medium） | height | `control_size-m`（32px） |
| 输入框圆角 | cornerRadius | `radius_control-xs`（4px） |
| 占位文字字号（large） | fontSize | `font_size-text1`（16px） |
| 占位文字字号（medium/small） | fontSize | `font_size-tip1`（14px） |
| 提示文字字号（large） | fontSize | `font_size-tip1`（14px） |
| 提示文字字号（medium/small） | fontSize | `font_size-tip2`（12px） |
| 描边宽度 | strokeWeight | 1px INSIDE |

---

## Part E：最佳实践

### 使用建议

1. **尺寸选择**：PC 端默认使用 medium，突出表单使用 large；移动端使用 small
2. **错误提示**：Error 状态应配合具体的错误提示文字，说明错误原因
3. **占位文字**：使用简短的提示文字，如"请输入"、"搜索"、"用户名"
4. **宽度设置**：输入框宽度应与容器宽度匹配，确保布局协调

### 设计提示

- **尺寸用途**：large/medium 用于 PC 端，small 用于移动端
- 输入框高度：large=40px，medium=32px，small=40px（注意 small 与 large 高度相同）
- 提示区域高度：large=22px，medium/small=18px
- 文字字号：large=16px，medium/small=14px；提示字号：large=14px，medium/small=12px
- Error 状态仅改变描边颜色（red-6），背景不变
- Complete 状态视觉与 Enabled 相同，无图标，仅作为语义标记
- 描边样式为 1px INSIDE，不影响输入框整体尺寸
- 深色模式下背景切换为 grey-4，描边和文字颜色同步切换
- 输入框宽度自适应，根据容器或内容需求设置

---

## 技术备注

- 组件节点 ID：`1042:18183`（组件集）
- 设计稿 URL：https://pixso.cn/app/design/JZkjW0mhmT61Mtd98dCfBw?item-id=1042:18183
- 生成日期：2026-04-17
- 变体总数：12（size=large/medium/small × Type=Enabled/Error/Complete × Dark=off/on）
- 无 Disabled 状态：所有状态均可输入
- **尺寸用途**：large/medium 用于 PC 端，small 用于移动端
- 尺寸数据：large=320×40px，medium=320×32px，small=312×40px（示例）
- 输入框高度：large/small=40px，medium=32px
- 圆角：4px（radius_control-xs）
- 描边：1px INSIDE
- 文字字号：large=16px（font_size-text1），medium/small=14px（font_size-tip1）
- 提示字号：large=14px（font_size-tip1），medium/small=12px（font_size-tip2）
- 背景：Light=grey-1（white），Dark=grey-4（color-fill2）
- 描边：Enabled=grey-14@0.25（color-control1），Error=red-6（color-danger1）
- Group 变体：组合示例（Group-tittle、Group-btn、Group-number），非基础状态