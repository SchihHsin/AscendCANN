# ONavigation 导航 · 设计 Skill

> 组件集合节点：`1303:10353` · 组件名：ONavigation 导航 · 变体总数：6

---

## Part A：设计使用卡

### 组件概览

**ONavigation 导航**：openEuler 官网全局导航组件，分为**顶部导航栏**（Header）和**底部页脚**（Footer）两类。顶部导航支持 PC 端宽屏和移动端两种布局，均提供 Light/Dark 主题切换；底部页脚为深色通栏样式，包含站点地图、版权信息和社交媒体入口。

---

### 适用场景

- ✅ **PC 顶导**：1920px 宽屏页面的全局顶部导航，包含 Logo、主导航菜单、搜索、快捷操作区
- ✅ **移动端顶导**：360px 移动页面的全局顶部导航，包含汉堡菜单、Logo、搜索、用户头像
- ✅ **PC 页脚**：PC 端站点底部通栏，包含分类导航链接、版权声明、社交媒体二维码
- ✅ **移动端页脚**：移动端底部页脚，适配小屏垂直排版
- ❌ **不适合**：侧边导航（用 OSideNav）、面包屑（用 OBreadcrumb）、标签页（用 OTab）

---

### 变体说明

**type（设备/位置）**
- `PC` — PC 端（1920px），顶导高度 72px，页脚高度 460px
- `Mb` — 移动端（360px），顶导高度 76px（含 18px 状态栏），页脚高度 458px

**Dark（主题，仅顶导）**
- `off` — 浅色模式，背景白色（顶导默认）
- `on` — 深色模式，背景 rgba(36,36,39,1)，底部加 1px 白色分割线

**属性 2（内容类型）**
- *(不填)* — 顶部导航栏（Header）
- `openEuler` — 底部页脚（Footer），始终深色

> **说明**：6 个变体 = 顶导 4 个（PC×2 + Mb×2）+ 页脚 2 个（PC + Mb）。页脚没有 Light 变体。

---

### 布局结构

#### PC 顶导（type=PC）

```
ONavigation Header PC（SYMBOL）
│  node_id: 1303:10846（Light）/ 1303:10896（Dark）
│  Width: 1920px | Height: 72px
│  display: flex | justify: space-between | align: center
│  padding: 0px 216px
│  background: rgba(255,255,255,1)（Light）/ rgba(36,36,39,1)（Dark）
│  boxShadow: 0px 3px 9px 0px rgba(0,18,85,0.078)
│  backdropFilter: blur(4.53px)
│  [Dark 专属] borderBottom: 1px solid rgba(255,255,255,0.149)
│
├── [左侧区域 FRAME]（gap 40px，align: flex-end）
│   ├── [Logo FRAME]（padding: 20px 0）
│   │   └── [OpenEuler LOGO GROUP]（136px × 32px）
│   │         图标（28.86px × 32px）+ 文字（100.2px × 18.75px）
│   │
│   └── [主导航菜单 FRAME]（gap 32px）
│       └── [菜单项 FRAME] × 7（32px × 48px，padding-bottom: 24px）
│             text: 下载 / 开发 / 文档 / 学习 / 支持 / 社区 / 动态
│             fontSize: 16px | lineHeight: 24px | fontWeight: 400
│             fill: rgba(0,0,0,1)（Light）/ rgba(255,255,255,1)（Dark）
│
└── [右侧操作区 FRAME]（gap 20px，align: center）
    ├── [搜索框]（160px × 32px）
    │   Light: vector 背景图片 + 绝对定位图标/文字
    │   Dark:  FRAME，background rgba(36,36,39,1)，borderRadius 4px
    │          padding: 5px 16px，gap 8px（图标 16px + 文字 flex-grow）
    │          占位文字 fill: rgba(255,255,255,0.4)，14px
    ├── [源码下拉 GROUP]（48px × 24px）
    │   text "源码" 14px lineHeight 24px + 下拉箭头图标（16px × 16px）
    ├── [国际化图标 GROUP]（24px × 24px）
    ├── [主题切换图标 FRAME]（24px × 24px）
    └── [用户图标 FRAME]（24px × 24px）
```

#### 移动端顶导（type=Mb）

```
ONavigation Header Mb（SYMBOL）
│  node_id: 1303:11169（Light）/ 1303:11391（Dark）
│  Width: 360px | Height: 76px
│  position: relative（绝对定位内部子节点）
│  background: rgba(255,255,255,0.95)（Light）/ Dark 待核实
│  boxShadow: 0px 3px 8px 0px rgba(0,0,0,0.078)
│  backdropFilter: blur(1.67px)
│
├── [状态栏 FRAME]（348.5px × 18px，overflow: hidden，top: 0）
│   信号图标（38.34px × 10px）+ 时间"9:41 AM" + 蓝牙/电量图标
│
├── [汉堡菜单图标 FRAME]（24px × 24px）
│   position: absolute | left: 24px | top: 36px
│
├── [OpenEuler Logo GROUP]（85px × 20px）
│   position: absolute | left: 138px | top: 38px
│
└── [右侧操作 GROUP]（64px × 24px）
    position: absolute | left: 272px | top: 36px
    ├── [搜索图标 FRAME]（24px × 24px，left: 0px）
    └── [用户头像 GROUP]（24px × 24px，left: 40px）
          圆形裁剪头像（31.5px × 31px 含出血区）
```

#### PC 页脚（type=PC, 属性 2=openEuler）

```
ONavigation Footer PC（SYMBOL）
│  node_id: 1303:12847
│  Width: 1920px | Height: 460px
│  background: rgba(18,18,20,1)（始终深色）
│  padding: 24px 216px 34px 216px（内容区宽 1488px）
│
├── [顶部说明 FRAME]（居中，column，gap 12px，再外层 gap 16px）
│   ├── [文字 PARAGRAPH]（20px，Regular，lineHeight 28px，white，居中）
│   │   "openEuler 是由开放原子开源基金会（OpenAtom Foundation）孵化及运营的开源项目"
│   └── [基金会 Logo RECTANGLE]（160.43px × 32px，图片填充）
│
├── [导航列 GROUP]（1122.5px × 180px）
│   6 列绝对定位，各列左起位置：0 / 221.5 / 409.5 / 646.5 / 834.5 / 1022.5px
│   ├── 关于openEuler（成员单位/组织架构/社区章程/贡献看板/社区介绍）
│   ├── 新闻与资讯（新闻/博客/白皮书）
│   ├── 获取与下载（获取openEuler操作系统/最新社区发行版/商业发行版/软件中心）
│   ├── 支持与服务（FAQ/联系我们/反馈问题）
│   ├── 互动与交流（邮件列表/活动/论坛）
│   └── 贡献与成长（SIG中心/贡献攻略/课程中心）
│   [列标题] fontSize: 20px | lineHeight: 28px | fontWeight: Regular | fill: white
│   [链接文字] fontSize: 14px | lineHeight: 22px | fill: rgba(255,255,255,0.6)
│
├── [友情链接区 GROUP]（897px × 24px）
│   [标题"友情链接"] fontSize: 12px，fontWeight: UltraLight，fill: rgba(255,255,255,1)
│   [链接列] fontSize: 12px，fill: rgba(255,255,255,0.6)
│   木兰开源社区 / 鲲鹏社区 / 鲲鹏小智 / 鹏城实验室 / InfoQ /
│   开源社 / 中科微澜 / Authing / openGauss / 昇思MindSpore / Ebaina
│
├── [分隔线 FRAME + RECTANGLE]
│   Width: 1487.91px | Height: 2px
│   fill: rgba(229,229,229,1) | opacity: 0.12
│
└── [底部信息行 GROUP]（1487.91px × 78px）
    ├── [Logo区 GROUP]（150px × 68px，left: 0）
    │   OpenEuler 白色 Logo（130px × 24.53px）
    │   "contact@openeuler.org" fontSize: 14px，fill: white，top: 46px
    ├── [版权信息区 GROUP]（266px × 78px，left: 611px）
    │   品牌 | 隐私政策 | 法律声明（14px white，分隔线 1px×14px white）
    │   "版权所有 © 2024 openEuler 保留一切权利"（14px white@0.6）
    │   "遵循 木兰宽松许可证第2版（MulanPSL2）"（14px white@0.6）
    └── [社交媒体区 GROUP]（353.91px × 52px，left: 1134px）
        二维码行（top: 0）：openEuler小助手 + openEuler公众号（各 126.96px × 20px）
        平台Logo行（top: 32px）：OSCHINA / CSDN / 新土提金 / bilibili / 头条
        各平台 Logo 背景：rgba(43,43,47,1)，borderRadius: 4px
```

#### 移动端页脚（type=Mb, 属性 2=openEuler）

```
ONavigation Footer Mb（SYMBOL）
│  node_id: 1303:12977
│  Width: 360px | Height: 458px
│  background: rgba(18,18,18,1)（注意：与 PC 页脚 rgba(18,18,20,1) 有细微差异）
│
├── [顶部说明文字]（14px，Medium，white，居中，left: 68px，top: 24px）
│   "openEuler 是由开放原子开源基金会"
│   "（OpenAtom Foundation）"
│   "孵化及运营的开源项目"
│
├── [基金会 Logo RECTANGLE]（150.4px × 30px，left: 105px，top: 102px，图片填充）
│
├── [分隔线 GROUP]（312px × 1px，left: 24px，top: 146px）
│   fill: rgba(229,229,229,1) | opacity: 0.12
│
├── [底部链接行 GROUP]（207px × 18px，left: 77px，top: 161px）
│   品牌 | 隐私政策 | 法律声明 | 服务状态（12px white，分隔线 1px×12px white）
│   ⚠️ 注意：移动端比 PC 端多"服务状态"一项
│
├── [版权声明 PARAGRAPH]（12px，white，居中，left: 66.5px，top: 183px）
│   "版权所有 © 2022 openEuler 保留一切权利"
│   ⚠️ 注意：移动端版权年份为 2022，PC 端为 2024
│
├── [OpenEuler Logo GROUP]（86px × 34px，left: 137px，top: 213px）
│   Logo 图形（86px × 20px）+ "contact@openeuler.org"（8px white，top: 24px）
│
├── [QR 码区 GROUP]（243px × 102px，left: 60px，top: 264px）
│   openEuler公众号（78px × 78px 白底二维码 + 12px 标题）
│   openEuler小助手（78px × 78px 二维码 + 12px 标题，left: 151px）
│
└── [平台 Logo 行 GROUP]（232px × 49px，left: 64px，top: 385px）
    第一行（top: 0）：OSCHINA（77px）/ CSDN（58px）/ 新土提金（73px）
    第二行（top: 29px）：bilibili（48px，left: 57px）/ 头条（48px，left: 117px）
    各平台 Logo 背景：rgba(43,43,47,1)，borderRadius: 4px
```

---

### 组合搭配

> 🔗 **常见搭配**：
> - **完整页面框架**：ONavigation Header（顶部）+ 页面内容区 + ONavigation Footer（底部）
> - **PC 页面**：`type=PC` Header + 内容 + `type=PC, openEuler` Footer
> - **移动端页面**：`type=Mb` Header + 内容 + `type=Mb, openEuler` Footer
> - **主题统一**：顶导 Dark=on 时，配合页面深色背景；页脚始终深色，无需切换

---

### 设计稿识别指南

> 🔍 **识别特征**：
> - PC 顶导 Light：1920×72px，白色背景，无底部线条
> - PC 顶导 Dark：1920×72px，rgba(36,36,39) 深色背景，**底部 1px 白色@0.149 分割线**
> - 移动端顶导：360×76px，含 18px 状态栏，左汉堡/中Logo/右操作
> - PC 页脚：1920×460px，rgba(18,18,20) 深色，6 列导航
> - 移动端页脚：360×458px，rgba(18,18,18) 深色，垂直单列布局

> 🔄 **易混淆组件**：
> - 与 **OTab 标签页**：Tab 用于页面内区域切换，Navigation 是全局顶导
> - 与 **OSideNav 侧边导航**：SideNav 固定在侧边栏，Navigation 是水平顶导

---

### 响应式行为

| 断点 | 组件 | 宽度 | 内边距 |
|------|------|------|--------|
| PC（1920px） | `type=PC` Header | 1920px | padding 0 216px |
| PC（1920px） | `type=PC` Footer | 1920px | padding 24px 216px 34px 216px |
| 移动端（360px） | `type=Mb` Header | 360px | 绝对定位，左边距 24px |
| 移动端（360px） | `type=Mb` Footer | 360px | 绝对定位，左边距 24px |

---

## Part B：规格速查参考

### 变体索引表

| 变体组合 | node_id | 尺寸 | 说明 |
|---------|---------|------|------|
| type=PC, Dark=off | `1303:10846` | 1920×72px | PC 浅色顶导 |
| type=PC, Dark=on | `1303:10896` | 1920×72px | PC 深色顶导，底部有分割线 |
| type=Mb, Dark=off | `1303:11169` | 360×76px | 移动端浅色顶导 |
| type=Mb, Dark=on | `1303:11391` | 360×76px | 移动端深色顶导 |
| type=PC, 属性 2=openEuler | `1303:12847` | 1920×460px | PC 深色页脚 |
| type=Mb, 属性 2=openEuler | `1303:12977` | 360×458px | 移动端深色页脚 |

---

### 布局规格

#### PC 顶导（1303:10846 / 1303:10896）

| 规格项 | 值 |
|--------|---|
| 整体尺寸 | 1920px × 72px |
| 左右内边距 | 216px |
| Logo GROUP 尺寸 | 136px × 32px |
| Logo FRAME 上下 padding | 20px |
| 菜单项 FRAME 尺寸 | 32px × 48px（padding-bottom: 24px） |
| 菜单项间距 | 32px |
| Logo 与菜单间距 | 40px |
| 右侧操作区间距 | 20px |
| 搜索框尺寸 | 160px × 32px |
| 搜索框（Dark）padding | 5px 16px，gap 8px，borderRadius 4px |
| 源码下拉 GROUP 尺寸 | 48px × 24px |
| 操作图标尺寸 | 24px × 24px |
| boxShadow | 0px 3px 9px 0px rgba(0,18,85,0.078) |
| backdropFilter | blur(4.53px) |
| Dark 底部描边 | 1px bottom，rgba(255,255,255,0.149) |

#### 移动端顶导（1303:11169 / 1303:11391）

| 规格项 | 值 |
|--------|---|
| 整体尺寸 | 360px × 76px |
| 状态栏高度 | 18px（FRAME，348.5px 宽，overflow: hidden） |
| 汉堡图标 | 24px × 24px，left: 24px，top: 36px |
| Logo GROUP | 85px × 20px，left: 138px，top: 38px |
| 右侧操作 GROUP | 64px × 24px，left: 272px，top: 36px |
| 头像（含出血区） | 31.5px × 31px，left: 40px（相对右侧 GROUP） |
| boxShadow | 0px 3px 8px 0px rgba(0,0,0,0.078) |
| backdropFilter | blur(1.67px) |

#### PC 页脚（1303:12847）

| 规格项 | 值 |
|--------|---|
| 整体尺寸 | 1920px × 460px |
| 内边距 | 24px 216px 34px 216px（内容区宽 1488px） |
| 顶部说明文字 | 20px Regular，lineHeight 28px |
| 基金会 Logo | 160.43px × 32px |
| 导航列 GROUP | 1122.5px × 180px |
| 导航列标题 | 20px Regular white |
| 导航链接 | 14px Regular white@0.6 |
| 友情链接行 | 897px × 24px（标题 + 链接横排） |
| 分隔线 | 1487.91px × 2px，rgba(229,229,229) opacity 0.12 |
| 底部信息行 | 1487.91px × 78px |
| 底部 Logo 区 | 150px × 68px，left: 0 |
| 版权区 | 266px × 78px，left: 611px |
| 社交媒体区 | 353.91px × 52px，left: 1134px |
| 二维码尺寸 | 126.96px × 20px（含文字行） |
| 平台 Logo 背景 | rgba(43,43,47,1)，borderRadius: 4px |

#### 移动端页脚（1303:12977）

| 规格项 | 值 |
|--------|---|
| 整体尺寸 | 360px × 458px |
| 顶部说明文字 | 14px Medium，lineHeight 22px，white，居中，left: 68px，top: 24px |
| 基金会 Logo | 150.4px × 30px，left: 105px，top: 102px |
| 分隔线 | 312px × 1px，left: 24px，top: 146px，rgba(229,229,229) opacity 0.12 |
| 底部链接行 | 207px × 18px，left: 77px，top: 161px，12px white |
| 版权声明 | 12px white，居中，left: 66.5px，top: 183px |
| Logo GROUP | 86px × 34px，left: 137px，top: 213px |
| 联系邮箱 | 8px white，top: 24px（相对 Logo GROUP） |
| QR 码区 GROUP | 243px × 102px，left: 60px，top: 264px |
| 单个二维码 | 78px × 78px |
| 平台 Logo 行 | 232px × 49px，left: 64px，top: 385px |

---

### 颜色规格

#### 顶导颜色

| 区域 | Light 模式（rgba） | Dark 模式（rgba） |
|------|-------------------|------------------|
| 导航栏背景（PC） | (255,255,255,1) | (36,36,39,1) |
| 导航栏背景（Mb） | (255,255,255,0.95) | 待核实 |
| PC Dark 底部描边 | — | (255,255,255,0.149) |
| 菜单文字 | (0,0,0,1) | (255,255,255,1) |
| 源码文字 | (0,0,0,1) | (255,255,255,1) |
| 搜索框背景（Dark） | — | (36,36,39,1) |
| 搜索占位文字 | (0,0,0,0.4) | (255,255,255,0.4) |
| boxShadow（PC） | (0,18,85,0.078) | (0,18,85,0.078) |
| boxShadow（Mb） | (0,0,0,0.078) | 待核实 |

#### 页脚颜色

| 区域 | PC 页脚（rgba） | 移动端页脚（rgba） |
|------|----------------|------------------|
| 背景 | (18,18,20,1) | (18,18,18,1)⚠️细微差异 |
| 顶部说明文字 | (255,255,255,1) | (255,255,255,1) |
| 导航列标题 | (255,255,255,1) | — |
| 导航链接/友情链接 | (255,255,255,0.6) | — |
| 版权/底部链接 | (255,255,255,0.6) | (255,255,255,1) |
| 分隔线 | (229,229,229) × opacity 0.12 | (229,229,229) × opacity 0.12 |
| 平台 Logo 背景 | (43,43,47,1) | (43,43,47,1) |

---

### 字体样式规格

#### PC 顶导

| 使用位置 | 字号 | 行高 | 字重 | 颜色 |
|---------|------|------|------|------|
| 主导航菜单文字 | 16px | 24px | 400 | 黑/白（主题） |
| 源码下拉文字 | 14px | 24px | 400 | 黑/白（主题） |
| 搜索占位文字 | 14px | 22px | 400 | black@0.4 / white@0.4 |

#### PC 页脚

| 使用位置 | 字号 | 行高 | 字重 | 颜色 |
|---------|------|------|------|------|
| 顶部说明文字 | 20px | 28px | Regular | white |
| 导航列标题 | 20px | 28px | Regular | white |
| 导航链接文字 | 14px | 22px | Regular | white@0.6 |
| 友情链接标题 | 12px | 24px | UltraLight | white |
| 友情链接文字 | 12px | 18px | Regular | white@0.6 |
| 底部链接（品牌/政策）| 14px | 22px | Regular | white |
| 版权/许可证声明 | 14px | 22px | Regular | white@0.6 |
| 联系邮箱 | 14px | 22px | Regular | white |
| QR 码标题 | 12px | — | Regular | white@0.6 |

#### 移动端页脚

| 使用位置 | 字号 | 行高 | 字重 | 颜色 |
|---------|------|------|------|------|
| 顶部说明文字 | 14px | 22px | **Medium** | white |
| 底部链接（品牌/政策）| 12px | 18px | Regular | white |
| 版权声明 | 12px | 18px | Regular | white |
| 联系邮箱 | 8px | — | Regular | white |
| QR 码标题 | 12px | 18px | Regular | white |

字体族：`HarmonyHeiTi`（Regular 400 / Medium 500 / UltraLight 200）

---

### 变体 componentKey 速查

| 变体 | node_id | componentKey |
|------|---------|-------------|
| type=PC, Dark=off | `1303:10846` | `561d3014fbe6f361abfecc203a06f1ab6cad43af` |
| type=PC, Dark=on | `1303:10896` | `c4522744b94335f4bc8fbc358c2316d3c447b771` |
| type=Mb, Dark=off | `1303:11169` | `7675ede074069cf358a0f164f76e1c6c119a592f` |
| type=Mb, Dark=on | `1303:11391` | `bf7bae1fb8fa033032f477251a510a0e0a247544` |
| type=PC, 属性 2=openEuler | `1303:12847` | `5d66a734f21bfcce1fbe4fce1d79f832b7f08f02` |
| type=Mb, 属性 2=openEuler | `1303:12977` | `62383dfdd93fd29e6dfcb7def1861d22d005324a` |

---

### Pixso 操作速查

1. **插入顶导**：组件面板搜索「ONavigation」→ 选择 `type=PC` 或 `type=Mb` → 拖入画布
2. **切换主题**：右侧面板 → Dark 属性 → `off`（浅色）/ `on`（深色）
3. **插入页脚**：选择 `type=PC, openEuler` 或 `type=Mb, openEuler`
4. **修改菜单文字**：双击进入组件 → 双击文字图层直接编辑
5. **调整定位**：顶导固定在画板顶部（x: 0, y: 0）；页脚固定在画板底部

---

### 注意事项

- **Dark 顶导有底部分割线**：PC Dark 变体底部有 1px `rgba(255,255,255,0.149)` 描边，Light 变体无此线
- **PC 与 Mb 页脚背景色不同**：PC rgba(18,18,20,1) vs 移动端 rgba(18,18,18,1)，细微差异
- **移动端页脚多"服务状态"链接**：移动端底部链接栏比 PC 多出"服务状态"一项
- **版权年份不一致**：PC 页脚为 2024，移动端为 2022（设计稿历史遗留，使用时注意统一）
- **移动端页脚顶部文字字重不同**：14px Medium，而 PC 端为 20px Regular
- **PC 页脚 Logo 区联系邮箱字号**：14px；移动端为 8px（较小，注意辨认）
- **移动端含状态栏**：Mb 变体高度 76px 包含 18px 系统状态栏，导航操作区实际高度 58px
- **搜索框 Light/Dark 实现方式不同**：Light 为 vector 图片叠加，Dark 为 FRAME + 描边布局
- **毛玻璃效果**：顶导有 backdrop-filter 模糊效果，需配合透明/半透明背景

---

## Part C：交互与状态

### 顶导交互状态

| 元素 | 状态 | 视觉表现 |
|------|------|---------|
| 菜单项 | 默认 | 文字黑色（Light）/ 白色（Dark），padding-bottom 24px 留激活线空间 |
| 菜单项 | Hover | 文字变主色（brand color） |
| 菜单项 | Active（当前页） | 底部 2px 指示线（品牌蓝），文字颜色加深 |
| 搜索框 | 默认 | 背景 + 占位文字 + 搜索图标 |
| 搜索框 | Focus | 边框高亮，显示光标 |
| 汉堡菜单 | 点击 | 展开侧边导航抽屉 |
| 主题切换图标 | 点击 | Light ↔ Dark 切换 |

### 主题切换逻辑

| 元素 | Light | Dark |
|------|-------|------|
| PC 导航背景 | rgba(255,255,255,1) | rgba(36,36,39,1) |
| PC 底部描边 | 无 | 1px rgba(255,255,255,0.149) |
| 菜单/操作文字 | rgba(0,0,0,1) | rgba(255,255,255,1) |
| 搜索框 | 图片背景（无描边） | FRAME + 描边布局 |
| 搜索占位文字 | rgba(0,0,0,0.4) | rgba(255,255,255,0.4) |
| 页脚 | 不受切换影响（始终深色） | 同左 |

---

## Part D：设计变量绑定

> **注意**：当前文件无本地变量集（`get_variable_sets` 返回空）。ONavigation 使用硬编码颜色值，无 Token 绑定。如需绑定变量，参考下表手动设置。

| 元素 | 属性 | 精确颜色值 |
|------|------|-----------|
| PC 顶导背景（Light） | fill | rgba(255,255,255,1) |
| PC 顶导背景（Dark） | fill | rgba(36,36,39,1) |
| PC Dark 底部描边 | stroke | rgba(255,255,255,0.149)，1px bottom |
| 菜单文字（Light） | fill | rgba(0,0,0,1) |
| 菜单文字（Dark） | fill | rgba(255,255,255,1) |
| 搜索占位文字（Light） | fill | rgba(0,0,0,0.4) |
| 搜索占位文字（Dark） | fill | rgba(255,255,255,0.4) |
| PC 页脚背景 | fill | rgba(18,18,20,1) |
| 移动端页脚背景 | fill | rgba(18,18,18,1) |
| 页脚导航链接 | fill | rgba(255,255,255,0.6) |
| 分隔线 | fill | rgba(229,229,229,1)，opacity 0.12 |
| 平台 Logo 背景 | fill | rgba(43,43,47,1) |

---

## Part E：最佳实践

### 使用建议

1. **设备适配**：PC 页面使用 `type=PC`，移动端使用 `type=Mb`，不要混用
2. **主题一致性**：顶导主题与页面整体主题保持一致；页脚无需处理（始终深色）
3. **固定定位**：顶导应置于画板最顶层并固定，确保滚动时遮挡内容
4. **内容区宽度**：PC 端内容区 = 1920 - 216×2 = **1488px**，页面主体内容应对齐此宽度

### 设计提示

- PC Dark 顶导有底部 1px 分割线，用于视觉分层，Light 无此线
- 菜单项高度 48px（非 72px），底部 24px 留给激活指示线，整体居中对齐
- 移动端 Logo、汉堡、操作图标均为绝对定位，top 统一为 36px（状态栏 18px + 10px 居中偏移）
- PC 页脚导航列使用绝对定位，6 列左起 x 坐标：0 / 221.5 / 409.5 / 646.5 / 834.5 / 1022.5px
- 移动端页脚平台 Logo 分两行排列（第一行 3 个，第二行 2 个），注意保持间距对齐

---

## 技术备注

- 组件集合节点 ID：`1303:10353`
- 设计稿 URL：https://pixso.cn/app/design/JZkjW0mhmT61Mtd98dCfBw?item-id=1303:10353
- 生成日期：2026-04-28
- 变体总数：6（PC/Mb × 顶导 Light/Dark + PC/Mb 页脚）
- 顶导尺寸：PC=1920×72px，Mb=360×76px（含 18px 状态栏）
- 页脚尺寸：PC=1920×460px，Mb=360×458px
- PC 顶导背景：Light=rgba(255,255,255,1)，Dark=rgba(36,36,39,1)
- Dark 顶导底部描边：rgba(255,255,255,0.149)，1px，bottom only
- PC 页脚背景：rgba(18,18,20,1)
- 移动端页脚背景：rgba(18,18,18,1)（与 PC 页脚细微不同）
- 字体族：HarmonyHeiTi（Regular 400 / Medium 500 / UltraLight 200）
- 本地变量集：无（颜色均为硬编码值）
- 移动端页脚多"服务状态"链接、版权年份 2022（PC 为 2024）
