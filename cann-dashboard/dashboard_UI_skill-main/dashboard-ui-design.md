# Dashboard UI Design — 参考图提取

> 来源：4 张 dribbble 风格参考图（Gotics / Catalog / Notes and tasks / Patient Tracking）
> 模式：先全面铺开，后续再做减法

---

## 一、参考图逐张提取

### 图 1 · Gotics Analytics Dashboard

**整体气质**：经典 SaaS analytics，冷静、克制、信息密度高。

#### 视觉风格
| 维度 | 取值 |
|------|------|
| 背景 | 极浅冷灰 `#F4F6F9` |
| 卡片底 | 纯白 `#FFFFFF`，subtle border `#EEF1F5` |
| 主色 | 蓝色系，强调色 `#2D7FF9`，浅蓝 `#E8F1FF` |
| 强调辅色 | 绿色（增长）`#22C55E`，红色徽标 `#FF6B4A` |
| 字体 | sans-serif（Inter / SF Pro 类），数字字重 600–700 |
| 字号层级 | 标题 14–16，KPI 数值 28–32，正文 13–14 |
| 圆角 | 卡片 16–20，按钮/胶囊 999（全圆） |
| 阴影 | 几乎无，仅靠 1px border 和留白分隔 |

#### 组件清单
- **顶栏**：浏览器 chrome 风格（红黄绿点 + 地址栏 www.gotics.com），上下文沉浸感强
- **Logo 块**：蓝色圆形 + 白色箭头 + 文字 "Gotics"
- **左侧导航**
  - 项 = icon + label，选中态浅蓝填充 + 蓝字
  - 徽标：Audience 项右侧 `10` 红色 pill（提醒未读）
  - 分组小标题 "OTHERS" 大写灰字
  - 底部 **Light / Dark 切换胶囊**（图标 + 文字，selected 态白底）
- **KPI 小卡**（Users / Revenue / Conv Rate / Session）
  - 顶部圆形 icon 框（浅灰底）
  - label → 数值 → 增长率 `↗ 1.02% from last week`（绿字）
  - 2×2 紧凑网格
- **热力图（User by time of day）**
  - 7 行（Sun–Sat）× 12 列（2am–6pm）
  - 蓝色 5 级色阶填色块，间隙 4px
  - 底部水平 legend 色带 50–800
- **折线图（Active Users）**
  - 单色蓝线 + 浅蓝面积 fill
  - hover tooltip：日期 + "18,584 active users"，配灰色虚线垂直辅助线
  - 底部分段按钮 Day / Month / Year，右下 `View report →`
- **环形进度（Sessions by device）**
  - 双色 donut（深蓝主 + 浅蓝段），中心 icon + 数值 + label
  - 右侧列表：设备 icon + 名称 + 百分比，左对齐

---

### 图 2 · Catalog eCommerce Dashboard

**整体气质**：电商 SaaS，紫色渐变 + 玻璃态 hero，活泼但保持商务感。

#### 视觉风格
| 维度 | 取值 |
|------|------|
| 背景 | 浅冷灰 `#E8ECF1`，dashboard 卡浮在其上 |
| 主色 | 紫色 `#6B5BFF` / `#7B6CFF`，accent 青绿 `#3DDBC2` |
| Hero 渐变 | 淡紫 → 淡蓝 `#D8D5FF → #C9DFFF`，叠加同心圆几何线条装饰 |
| 玻璃态 KPI | 半透明白 + blur，边框 1px 半透明白 |
| 圆角 | 外层卡 24，KPI 16，按钮 12 |
| 字体 | sans-serif，数值黑色重磅 |

#### 组件清单
- **顶部搜索栏**：圆角胶囊 + 搜索 icon + placeholder，右侧 mail/bell/settings icon
- **左侧导航**
  - 分组标题 HOME / App / Page 灰字
  - 选中项左侧浅紫填充 + 紫字
  - 底部头像卡：Jane Cooper · Admin + Setting / Log out
- **Hero KPI 横排**（Sales Distribution）
  - 标题 + 副标题在左
  - 5 张玻璃态 KPI 横排，每张：数值 + label + 增长 chip（如 `40%` 紫色 pill）
- **Sales Overview 环形图**
  - 紫 + 青绿双色 donut，中心 `$500,00`
  - 右侧 legend：彩点 + 金额 + label
- **Revenue Updates 柱状图**
  - 紫色 gradient bars（顶亮底暗），等宽，圆角顶
  - Y 轴 10/30/50/80 刻度
- **Yearly Sales 区域图**
  - 双层柔和曲线 + area fill（紫 + 浅紫）
  - 内嵌两个金额徽标 `$5476 / $4476`
- **世界地图（Active User）**
  - 白底 + 灰色国家 outline
  - 蓝色圆点标记，底部总数 `23,214 Total Active User`
  - 右上 Export 按钮（带 icon）
- **Payment Gateways 列表**
  - 每行：圆形品牌 icon + 名称 + 副标题 + 右侧金额（带正负色）
  - 底部紫色 `View all transactions` 按钮（满宽）

---

### 图 3 · Notes and Tasks Card

**整体气质**：内容型 widget，紫色背景烘托主体，圆润、亲和、轻量。

#### 视觉风格
| 维度 | 取值 |
|------|------|
| 外部背景 | 紫色 `#C7C2FF`（仅为 widget 展示衬底） |
| 卡片底 | 浅灰 `#F4F4F8`（外卡）+ 纯白（内 note 卡） |
| 主色 | 紫色 `#6F5BFF`，tag 多色（紫/绿/蓝/橙） |
| 圆角 | 外卡 28，内卡 16，tag 6–8，输入框 14 |
| 字体 | sans-serif，标题超粗黑（Heavy/Black） |

#### 组件清单
- **Widget 标题区**
  - 大粗标题 "Notes and tasks"
  - 紫色圆角方块 filter icon（视觉锚点）
  - 右侧 `View all →` 紫色文字链
- **输入框**
  - 浅灰填充 pill，placeholder "What's on your mind today?"
  - 右侧两个按钮：紫色 + 圆形（add）/ 灰色 ▷（send）
- **Note 条目卡**
  - 顶部：emoji 风 icon（橙/绿圆角方）+ 标题 + 多 tag + 日期（右上灰字）
  - tag 多色 pill：Urgent task（紫）/ Course（绿）/ Personal（蓝）
  - 描述文字 2 行截断
  - checkbox 列表（已选紫色填充打勾）

---

### 图 4 · Patient Tracking Summary

**整体气质**：医疗/管理后台，4 张 pastel 配色 KPI 卡，柔和清爽。

#### 视觉风格
| 维度 | 取值 |
|------|------|
| 背景 | 浅灰渐变 `#EEF0F3` |
| 卡片底 | 纯白 + soft shadow（rgba 黑 4–6%，y=8，blur=24） |
| pastel 主题色 | 薄荷 `#D8F1E4` / 米黄 `#FCEDD0` / 粉红 `#FBD9DC` / 淡紫 `#E7DCF8` |
| 状态 chip | 绿底绿字（↑）/ 红底红字（↓），圆角 8 |
| 字体 | sans-serif，数值黑色 Heavy |
| 圆角 | 卡 16，banner 10，chip 8 |

#### 组件清单
- **区块标题 + 时间筛选**：左侧大粗标题，右侧 `Last week ▼` 下拉胶囊
- **KPI 卡 2×2 网格**，每张统一结构：
  - 顶部 pastel banner：icon + label（color-coded 区分类别）
  - 大数值（黑色 Heavy，32+）
  - 副标签 "Since Last Week"
  - 右侧状态 chip `↑20%` 绿 / `↓12%` 红

---

## 二、共性归纳（可复用方向）

### 风格主轴
- **底色策略**：极浅冷灰底 + 纯白卡，靠留白和圆角营造呼吸感（4 张图共用）
- **强调色家族**：蓝（数据感）/ 紫（产品感）二选一为主，搭配绿/红做正负反馈
- **pastel 类别色**：用作 KPI 卡 banner、tag、icon 框背景，避免大面积铺色
- **圆角语言**：外层卡 16–24，元素 8–12，按钮全圆 pill，整体偏圆润
- **阴影克制**：要么不用阴影靠 border，要么极淡 y-shadow，绝不用硬阴影

### 字体节奏
- 标题超粗（Heavy/Black）拉视觉锤
- KPI 数值大字号 + 高字重，让数据成为视觉主角
- 正文/label 中等字号灰字，做信息层级降级

### 通用组件（可抽出来做 component library）

| 组件 | 出现图 | 关键参数 |
|------|--------|----------|
| 左侧导航（icon + label） | 1, 2 | 选中态浅色填充 + 主色字，分组标题 caps gray |
| 顶部搜索 + 通知/头像 | 1, 2 | 圆角胶囊搜索框 |
| KPI 数据小卡（icon + 值 + 增长率） | 1, 4 | icon 圆框 + 大数值 + ↗ 颜色 chip |
| Hero KPI 玻璃态横排 | 2 | 渐变背景 + 半透明卡 |
| 折线图 + tooltip | 1, 2 | 单色线 + area fill + 垂直辅助线 |
| 柱状图 | 2 | gradient bars，等宽圆角顶 |
| 环形/donut 图 | 1, 2 | 双色 segment + 中心数值 |
| 热力图（calendar 风） | 1 | 5 级色阶方格 + legend 色带 |
| 世界地图 | 2 | 白底灰 outline + 彩点 |
| 任务/Note 列表卡 | 3 | emoji icon + 多色 tag + 日期 + checkbox |
| 状态 chip（↑/↓ 百分比） | 1, 4 | 绿/红底，圆角 8 |
| Light/Dark toggle | 1 | 胶囊内 segment |
| 时间范围切换 Day/Month/Year | 1 | 分段按钮组 |
| 满宽 primary button（带 icon） | 2 | 主色填充，圆角 12 |
| 头像 + 角色卡（底部用户区） | 2 | 头像 + 名字 + 角色 + 副操作 |

### 信息架构共识
1. **左导航 + 右内容**是默认骨架（图 1, 2）
2. **顶部 KPI 行 → 中部多图表网格 → 底部表格/列表**是标准三段式
3. 数据卡片之间用 12–24px 间距，避免拥挤
4. 每张图表卡右上角常有 `⋯` 或 `View all →` 出口

---

## 三、后续可做的减法方向（建议）

- **如果偏 analytics SaaS**：以图 1 Gotics 为主基调，借图 4 的 pastel KPI banner 增加情绪色
- **如果偏内容/工作流产品**：以图 3 的圆润大粗字体为主，借图 2 的玻璃态 hero 做开场
- **如果偏电商/营收**：图 2 为主，紫色渐变 hero + 世界地图 + 列表，气质最完整
- **统一一套 design tokens**：颜色 8–10 个、圆角 4 级、字号 6 级、阴影 2 级，足够撑起整个 dashboard

---

> 下一步建议：选定主基调后，把上面"通用组件"列表挑出 6–8 个最常用的，做成 component spec（含尺寸 / 状态 / 间距），再开 .pen 文件做视觉稿。

---

# 配色参考补充（新增）

> 两张新参考图：图 5 Waybill 品牌 × 多背景测试 / 图 6 Asana 完整色彩系统
> 用途：取代之前我估算的 hex，作为正式的配色 token 来源

---

## 图 5 · Waybill 品牌色 × 16 背景测试

**用途**：检验品牌色（深紫红 logo + 黑色文字）在不同饱和度 / 明度背景下的可读性与情绪表达。
**核心启发**：品牌色保持不变，靠"背景色族"切换营造不同氛围；同一套品牌可在 light/bright/saturated/dark 四种环境下都成立。

### 4 × 4 背景色矩阵（估值，从图视觉提取）

| 行 | 主调 | 1（暖粉/红） | 2（暖黄/橙） | 3（冷蓝/紫） | 4（冷绿） |
|----|------|--------------|--------------|--------------|-----------|
| 1 · 极浅 | 高明度低饱和 | `#FAD9E8` 浅粉 | `#FFF6D8` 米白 | `#D9E6FF` 浅蓝 | `#D9F6E5` 浅薄荷 |
| 2 · 鲜亮 | 高饱和高明度 | `#FF9ED4` 粉红 | `#FCDE5C` 亮黄 | `#B0BEFA` 淡紫蓝 | `#C8F95C` 柠檬绿 |
| 3 · 中浓 | 高饱和中明度 | `#E3275E` 玫红 | `#FA8A2F` 橙 | `#2F46DD` 钴蓝 | `#2DAD51` 草绿 |
| 4 · 深沉 | 低明度高饱和 | `#6D1238` 暗红 | `#C84612` 橘红 | `#142D6B` 午夜蓝 | `#143A1F` 深森林 |

### 提炼规律
- 同色相 4 个层级（浅→鲜→浓→深）几乎对应 Asana 体系的 Light / Bright / Core / Dark
- 浅色行最适合 dashboard 主背景；中浓行适合 hero / CTA；深色行适合 dark mode 或局部强调
- 品牌色在前 2 行用深紫色 logo（保对比度），在后 2 行用浅色 logo（反相）

---

## 图 6 · Asana Colors 完整色彩系统 ⭐

**用途**：成熟产品级色板，可直接照搬作为 design tokens。
**结构**：Energizing（5 色系 × 5 层级） + Gradients（5 种） + Neutral（3 主） + Secondary Grays（10 级）

---

### A. Energizing Palette（核心 5 色系）

每个色系 5 个层级：**Dark / Core / Bright / Med / Light**
（Green 多一个 Faded）

#### 用途定义（官方）
- **Dark**：制造对比/深度，**白底上的正文文字**用此层
- **Core**：所有其它色由它派生，**主要识别色**
- **Bright**：额外能量 — hover 态、激活态、插画
- **Med**：克制使用，仅与 Light 配对作 border/icon
- **Light**：大面积色填充，营造低能量氛围（适合 banner、background）
- **Faded**：仅 Green 一档，介于 Med 和 Light 之间

#### Green 系
| 层级 | Hex |
|------|------|
| Dark Green   | `#37C597` |
| Core Green   | `#3BE880` |
| Bright Green | `#3BF7D1` |
| Med Green    | `#9DFBE8` |
| Faded Green  | `#C3EDDF` |
| Light Green  | `#EBFCF7` |

#### Teal 系
| 层级 | Hex |
|------|------|
| Dark Teal    | `#179D8A` |
| Core Teal    | `#1AAFD0` |
| Bright Teal  | `#02CEFF` |
| Med Teal     | `#80E6FF` |
| Light Teal   | `#E8F7FB` |

#### Purple 系
| 层级 | Hex |
|------|------|
| Dark Purple   | `#4F4DA7` |
| Core Purple   | `#6A67CE` |
| Bright Purple | `#A177FF` |
| Med Purple    | `#D0B8FF` |
| Light Purple  | `#F0EFFA` |

#### Gold 系
| 层级 | Hex |
|------|------|
| Dark Gold    | `#FD9A00` |
| Core Gold    | `#FFB900` |
| Bright Gold  | `#FFD200` |
| Med Gold     | `#FFE87F` |
| Light Gold   | `#FFF8E5` |

#### Coral 系
| 层级 | Hex |
|------|------|
| Dark Coral   | `#E63838` |
| Core Coral   | `#FC636B` |
| Bright Coral | `#FF6D92` |
| Med Coral    | `#FFB6C8` |
| Light Coral  | `#FEEFF0` |

---

### B. Gradients（5 种，渐变从左下暗 → 右上亮）

| # | 配方 | 用途参考 |
|---|------|---------|
| 1 | Core Green `#3BE880` → Bright Teal `#02CEFF` | 清新/科技感 hero |
| 2 | Bright Purple `#A177FF` → Bright Teal `#02CEFF` | 品牌主渐变（紫→青） |
| 3 | Bright Purple `#A177FF` → Bright Coral `#FF6D92` | 暖紫→粉 / 情感化 |
| 4 | Bright Coral `#FF6D92` → Dark Gold `#FD9A00` → Bright Gold `#FFD200` | 落日 / 能量 / 营销 |
| 5 | Bright Coral `#FF6D92` → Core Coral `#FC636B` → Dark Gold `#FD9A00` | 暖红橙单色族 |

> 用法约定：方向通常从对象左下（暗）→ 右上（亮）；若需要方向性/聚焦，可把亮端放在任一角

---

### C. Neutral Palette（中性主色）

| 名 | Hex | 角色 |
|----|------|------|
| White         | `#FFFFFF` | 默认背景，主要 surface |
| Gray 2        | `#EEEEF0` | 次级背景 / 分隔区 |
| **Navy**      | `#273347` | 深色主色（dark mode 主面） |
| Navy Title    | `#B3BCC4` | Navy 背景上的标题文字 |
| Navy Text     | `#8897A3` | Navy 背景上的正文文字 |

> 注：核心调色板偏中性，但**不应当作灰阶看待**。页面以白为主，灰用作对比和聚焦

---

### D. Secondary Grays（10 级灰阶 + 用途）

| 级 | Hex | 推荐用途 |
|----|------|---------|
| Gray 1  | `#F8F8F9` | **backgrounds** |
| Gray 2  | `#EFF0F1` | backgrounds |
| Gray 3  | `#E1E2E4` | **borders** |
| Gray 4  | `#CDCFD2` | borders |
| Gray 5  | `#B9BCC0` | — |
| Gray 6  | `#A1A4AA` | **text** (placeholder/secondary) |
| Gray 7  | `#898E95` | **borders** (深) |
| Gray 8  | `#676D76` | — |
| Gray 9  | `#495058` | **text** (body) |
| Gray 10 | `#1B2432` | 强标题 / 接近黑 |

---

## 应用到 AscendOps Dashboard 的迁移建议

> 如果决定全量切换到 Asana 体系，可这样映射当前看板的色 token：

### 主色族选定
- **Primary（蓝紫主色）** → Core Purple `#6A67CE` / hover Bright Purple `#A177FF` / 深度 Dark Purple `#4F4DA7`
- **Accent（青蓝辅助）** → Core Teal `#1AAFD0` / Bright Teal `#02CEFF`
- **Success（增长）** → Dark Green `#37C597`
- **Warning** → Core Gold `#FFB900` / Dark Gold `#FD9A00`
- **Danger** → Dark Coral `#E63838`

### 4 场景 pastel banner 替换
| 场景 | 当前 | 建议（Asana Light） | 文字色（建议 Asana Dark） |
|------|------|---------------------|---------------------------|
| 算子复现部署       | `#D8F1E4` | Light Green `#EBFCF7` | Dark Green `#37C597` |
| 算子迁移部署       | `#FCEDD0` | Light Gold `#FFF8E5`  | Dark Gold `#FD9A00`  |
| Builtin 算子定制   | `#FBD9DC` | Light Coral `#FEEFF0` | Dark Coral `#E63838` |
| 算子基本功能实现   | `#E7DCF8` | Light Purple `#F0EFFA`| Dark Purple `#4F4DA7`|

### 折线图 4 条线（用 Bright 层级，更亮更鲜活）
- 复现：Dark Green `#37C597`（绿系深一档保证可读）
- 迁移：Dark Gold `#FD9A00`
- Builtin：Bright Coral `#FF6D92` / Dark Coral `#E63838`
- 基本功能：Core Purple `#6A67CE` / Bright Purple `#A177FF`

### Hero 渐变
- 替换原 `#DCD7FF → #C9DFFF → #B8C9FF` 为 **Gradient #2**：Bright Purple `#A177FF` → Bright Teal `#02CEFF`（更品牌、更鲜活）
- 或更柔和的：Med Purple `#D0B8FF` → Med Teal `#80E6FF`

### 中性色替换
- 页面背景 `#F8F8F8` → Gray 1 `#F8F8F9`（几乎一致，统一到 token）
- 卡片边框 `#EEF1F5` → Gray 3 `#E1E2E4`
- 正文 `#0F172A` → Gray 10 `#1B2432`
- 次文 `#475569` → Gray 9 `#495058`
- 弱文 `#94A3B8` → Gray 6 `#A1A4AA`
- 卡片 hover border → Gray 4 `#CDCFD2`

---

> 待用户确认主基调后，再决定是否：(a) 全量切到 Asana 体系；(b) 只替换部分（如 hero 渐变 + 4 场景色）；(c) 维持现有色，仅作为参考备查

---

# Dashboard Design System v1（基于 AscendOps 最终实现）

> 参考实现：`AscendCANN-main/cann-dashboard/ascendops-experience.html`
> 选定方案：Asana 体系全量 + AscendOps 业务定制
> 用途：作为后续所有同款 dashboard 的正式规范，照搬即得同风格

---

## 1. 风格定位一句话

> **白底为主、Asana 多彩点缀、大数字小标签、卡片靠 border 不靠阴影、紫青渐变作 hero、四色族区分业务对象**

---

## 2. Design Tokens（完整 CSS Variables）

直接复制到 `:root` 即可：

```css
:root{
  /* ===== Asana Energizing Palette ===== */
  --green-dark:#37C597; --green-core:#3BE880; --green-bright:#3BF7D1; --green-med:#9DFBE8; --green-faded:#C3EDDF; --green-light:#EBFCF7;
  --teal-dark:#179D8A;  --teal-core:#1AAFD0;  --teal-bright:#02CEFF;  --teal-med:#80E6FF;  --teal-light:#E8F7FB;
  --purple-dark:#4F4DA7;--purple-core:#6A67CE;--purple-bright:#A177FF;--purple-med:#D0B8FF;--purple-light:#F0EFFA;
  --gold-dark:#FD9A00;  --gold-core:#FFB900;  --gold-bright:#FFD200;  --gold-med:#FFE87F;  --gold-light:#FFF8E5;
  --coral-dark:#E63838; --coral-core:#FC636B; --coral-bright:#FF6D92; --coral-med:#FFB6C8; --coral-light:#FEEFF0;

  /* ===== Secondary Grays (10 级) ===== */
  --g1:#F8F8F9; --g2:#EFF0F1; --g3:#E1E2E4; --g4:#CDCFD2; --g5:#B9BCC0;
  --g6:#A1A4AA; --g7:#898E95; --g8:#676D76; --g9:#495058; --g10:#1B2432;

  /* ===== Neutrals ===== */
  --white:#FFFFFF;
  --navy:#273347; --navy-title:#B3BCC4; --navy-text:#8897A3;

  /* ===== Semantic Mapping ===== */
  --bg: var(--g1);
  --card: var(--white);
  --border: var(--g3);
  --border-2: var(--g4);
  --text: var(--g10);
  --text-2: var(--g9);
  --text-3: var(--g6);

  --primary: var(--purple-core);
  --primary-2: var(--purple-bright);
  --primary-dark: var(--purple-dark);
  --primary-soft: var(--purple-light);
  --accent: var(--teal-core);

  --good: var(--green-dark);  --good-soft: var(--green-light);
  --bad:  var(--coral-dark);  --bad-soft:  var(--coral-light);
  --warn: var(--gold-dark);   --warn-soft: var(--gold-light);

  /* hero gradient = Asana #2 (Med Purple → Med Teal) */
  --grad-1: var(--purple-med);
  --grad-2: var(--teal-med);

  /* 4 业务对象 = Green / Gold / Coral / Purple 四色族 */
  --s1-bg:var(--green-light);  --s1-fg:var(--green-dark);
  --s2-bg:var(--gold-light);   --s2-fg:var(--gold-dark);
  --s3-bg:var(--coral-light);  --s3-fg:var(--coral-dark);
  --s4-bg:var(--purple-light); --s4-fg:var(--purple-dark);

  /* radius scale */
  --radius-xl:22px; --radius-l:18px; --radius-m:12px; --radius-s:8px;

  /* shadow (基本不用，只 hero/tooltip 用) */
  --shadow-soft: 0 1px 2px rgba(39,51,71,.04), 0 4px 14px rgba(39,51,71,.04);
  --shadow-pop:  0 10px 30px rgba(106,103,206,.18);
}
```

### Token 使用约定
- **背景**：永远 `var(--bg)`（白偏灰 #F8F8F9）
- **卡片底**：`var(--card)` + `1px solid var(--border)`，**不加阴影**（除 hero、tooltip）
- **文字三级**：`--text`（黑）/ `--text-2`（深灰）/ `--text-3`（中灰）
- **多彩绑业务**：业务对象（场景/类别/角色）绑定 4 色族（s1-s4），整页一致

---

## 3. Typography

字体栈：
```css
font-family: 'Inter','PingFang SC','Microsoft YaHei',sans-serif;
```
数字单独用：`'JetBrains Mono', monospace`（仓库名、评分等）

| 用途 | size | weight | letter-spacing | 备注 |
|------|------|--------|----------------|------|
| Hero KPI 大数字 | 48px | **500 (Medium)** | -.035em | 业务核心数字 |
| 业务卡大数字 | 54px | **500** | -.04em | 比 Hero 更夸张 |
| Section 标题 | 17px | 800 | -.01em | 楼层标题 |
| Hero 标题 | 22px | 800 | -.01em | |
| 二级数字 | 22px | 800 | -.02em | stage 数字、pain 数字等 |
| 卡片标题 | 14.5px | 800 | 0 | VOD title 等 |
| 正文 | 13px | 500–600 | 0 | |
| Label | 12px | 600 | 0 | KPI label |
| 副标签 | 11px | 500–600 | 0 | sub text |
| 微标签 | 10–10.5px | 600–700 | 0 | tag、mini-tag |

**核心规则**：业务大数字用 Medium（500） + 大字号 + 紧字距，**不用 Bold/Black**——优雅而不浮夸。

---

## 4. Spacing & Radius

### Radius 阶梯
- xl 22px — 外层 section
- l 18px — 中层卡（scene card）
- m 12px — 内层元素（stage、按钮、tag pill）
- s 8px — 小元素（chip、tag）
- pill 999 — segment、search、icon-btn、状态 chip

### Spacing 阶梯（gap & padding）
- Section 间距：`row` `gap:20px; margin-bottom:20px`
- Section padding：`22px 24px`
- Card 内 padding：`14–18px`
- 元素间 gap：`8–14px`
- 整页 padding：`22px 26px 32px`

### 容器宽度
- 主容器固定 **1392px**（min-width 1440px，桌面优先）

---

## 5. 布局栅格

5 个标准 row 模板：
```css
.row.r-1   { grid-template-columns: 1fr; }
.row.r-4   { grid-template-columns: repeat(4, 1fr); }
.row.r-1-1 { grid-template-columns: 1fr 1fr; }
.row.r-3-2 { grid-template-columns: 3fr 2fr; }
.row.r-2-3 { grid-template-columns: 2fr 3fr; }
```

**经典 dashboard 楼层顺序**（AscendOps 用法）：
1. **Header** — logo + 面包屑 + 筛选 + 搜索 + 通知 + 头像
2. **Hero**（r-1） — 渐变 + N 张玻璃态 KPI 横排
3. **Pipeline / 主流程**（r-1） — 横向 stepper，最显眼
4. **4 业务对象卡**（r-4） — pastel banner + 大数字
5. **矩阵 + 主图**（r-3-2） — 热力图 + donut
6. **列表 + 列表**（r-1-1） — 痛点 + 仓库 / 趋势 + 类别
7. **VOD 原声**（r-1） — 任务卡风格列表

---

## 6. 组件 Spec

### 6.1 Hero 卡

```
背景：linear-gradient(135deg, --grad-1 0%, --grad-2 100%) + 装饰圆 + 高斯模糊
内边距：24px 28px
圆角：22px
头部：左边 title 22/800 + sub 13；右边 hero-tag（半透明白胶囊 + 实时点）
内容：N 张玻璃态 KPI（grid 等分）
```

**玻璃态 KPI**：
- `background: rgba(255,255,255,.65); backdrop-filter: blur(14px)`
- `border: 1px solid rgba(255,255,255,.9)`
- `border-radius: 16px; padding: 16px 18px`
- 结构：label（gi icon + 12px 文字） → 数字 48/500 → foot（chip + 12 灰字）
- 推荐 4–5 张，每张承载一个 top KPI

### 6.2 Section（楼层卡）

```
.section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 22px 24px;
}
```
- 头：sec-head（左 title + sub，右 actions / seg / more-link）
- 不加 box-shadow

### 6.3 Pipeline Stage 节点

8 卡横排，每张：
- 头部：序号徽章（渐变 stage-h-*）+ 健康度小点
- 名称 13.5/700 + 元信息 11/灰
- 数字 22/800 + `/100`
- 进度条 4px 渐变（primary→primary-2）
- 痛点 mini-tag（背景 g2 灰 或 coral-light 警示）
- 节点之间 ▶ 小箭头（绝对定位）

健康度色（用 stage-h-good/warn/bad/neu 渐变背景）：
- good = green-core → green-dark
- warn = gold-core → gold-dark
- bad  = coral-bright → coral-dark
- neu  = purple-bright → purple-core

### 6.4 业务对象 pastel KPI 卡

```
外：圆角 18，border g3
上 banner：scene-N-bg（Asana Light），padding 14 18，icon + 名称
下 body：padding 18，大数字 54/500，meta 行（平均分 + chip ↑↓），sparkline 38px
```

**业务对象数量超过 4 个？** → 不要新增颜色，要么用 Bright/Dark 层级扩展，要么改成无 banner 的灰底卡。

### 6.5 触点矩阵（热力图）

```
grid-template-columns: <label-w> repeat(n, 1fr)
gap: 6px
cell: aspect-ratio 2.4/1, radius 10
内容：大数字 18/800 + 副标 10.5（如 "12 触点"）
```

色谱（heatColor 函数）：Asana 顺序
- 0   → coral-light  `#FEEFF0`
- 30  → coral-med    `#FFB6C8`
- 50  → gold-med     `#FFE87F`
- 65  → gold-light   `#FFF8E5`
- 80  → green-light  `#EBFCF7`
- 100 → green-core   `#3BE880`

底部 heat-grad legend 用相同 stops。

### 6.6 Donut + 列表组

- SVG 200×200，stroke-width 22，底色 g2
- 多 segment 用同色族不同层级，或 Asana 5 色族顺序（green-dark / green-core / gold-core / gold-dark / coral-dark）
- 中心：v 大数字 32/800 + l 11/灰
- 右侧 star-row 列表：图标 + bar + 百分比

### 6.7 折线图（trend）

- 纯 SVG，不用 chart.js
- viewBox `720 230`，PAD `{l:36 r:14 t:18 b:30}`
- Y 轴网格：10 等分，灰线 `#EFF0F1`
- 每个 series：area（color α0.18→0） + line（color stroke 2.2 round） + 节点 circle r3 白填色 + 2px stroke
- 顶部 legend：sw 10×10 圆角 + 名字
- Hover：透明 rect 覆盖每列宽，触发 tooltip
- 4 系列固定色（绑业务）：`#37C597 / #FD9A00 / #FC636B / #A177FF`

### 6.8 痛点/仓库列表（bar list）

```
grid-template-columns: <rank> 1fr <bar> <num>
```
- rank：徽章（前 3 用 coral-bright→dark 渐变填白，其余 g2 灰）
- 标题 13/600 + meta（tag + 副标）
- bar：高 6，渐变（coral-bright→coral-core 等）
- num：mono 13/800

### 6.9 类别条形（带目标线）

```
grid-template-columns: 180px 1fr 50px
gap: 14; padding: 6 0; 行间 dashed 分隔
```
- 左：cn-top（点 + 中文名） + cn-sub（mono 英文标识）— 上下排
- 中：bar 高 10，目标刻度线 `width:2; background:--g6` 绝对定位
- 右：分数 mono 800

### 6.10 VOD 卡片（任务列表风格）

```
grid-template-columns: 44px 1fr auto
gap: 14; padding: 14 16
背景：g1，hover 白 + 紫 border
```
- 左：emoji 框 44×44 圆角 12，渐变（Asana 同色族 med→core 或 med→dark）
- 中：title 14.5/800 + tag pills + 日期 mono；quote 12.5 灰 line-clamp 2；foot（check + source）
- 右上：声量 mono 22/800 紫；右下：紫色播放圆按钮

### 6.11 状态 chip ↑/↓

```
.chip { padding: 3px 8px; radius: 8; font-size: 11/700 }
.chip.up { bg: green-light; color: green-dark }
.chip.dn { bg: coral-light; color: coral-dark }
.chip.neu{ bg: g2;          color: g9 }
```

### 6.12 Tag pill（分类标签）

5 个分类 → 绑 Asana 5 色族 Light/Dark：
- 文档 → teal-light / teal-dark
- API → purple-light / purple-dark
- 工具 → gold-light / gold-dark
- 环境 → green-light / green-dark
- 综合 → coral-light / coral-dark

### 6.13 Segment 分段按钮

```
.seg { display: inline-flex; padding: 3; border 1 g4; radius 8; bg white }
.seg button { padding: 6 12; font 12/600; color g9; radius 6 }
.seg button.on { bg: purple-light; color: purple-core }
```

### 6.14 顶部 Header

- Logo 左：38×38 圆角 11，linear-gradient primary→primary-2，白色 icon
- Brand 名 18/800 + sub 12/500
- 面包屑：> 主页 > 当前
- 右侧：filter pill-select × N + search + icon-btn（通知 + 红点）+ avatar
- 全部高度 38px，圆角 999

### 6.15 More link / View all

```
color: primary; font-size: 12.5/600; 后接 → 箭头
```

---

## 7. 数据可视化规范

### 7.1 颜色绑业务对象，不绑数据语义
- 4 个业务对象 → 4 色族（Green/Gold/Coral/Purple）
- 同一对象在所有图表里**永远同色**（折线、KPI 卡、tag、热力图行 label）

### 7.2 健康度 / 状态 → 用 good/warn/bad 三色
- good = `--good` 绿
- warn = `--warn` 金
- bad = `--bad` 珊瑚红

### 7.3 评分高低 → 用 coral→gold→green 渐变（heatmap）
- 不用红→绿（红色情绪太强），用 coral→gold→green 更温和

### 7.4 真实数据优先
- 能用真数据就用，不要全编（如果有 JSON 数据源，至少 KPI 总分、列表头部、汇总均值用真值）
- 编造数据时注明"示意"或在副标里说明

### 7.5 Tooltip 规范
- 白底 + 1px g4 border + radius 10 + shadow-pop
- 顶部日期 10.5 灰
- 每行：色点 + 名称 + 粗体值

---

## 8. 内容写作

- **标题**：中文 4–8 字 + 后置 sub 一句话解释来源/口径
- **数字单位用 `<small>`**：`<small>/100</small>` `<small>%</small>` `<small>条</small>` `<small>触点</small>`
- **业务术语保留原文**：英文专有名词（API/SDK/Builtin/Kernel）不强行翻译
- **VOD 引言加引号** `"…"`，限 2 行截断

---

## 9. 不要做的（反模式）

- ❌ **不要加重阴影**（图1/4 教训：阴影一加就显廉价）
- ❌ **不要用左侧导航**（除非业务模块超过 6 个）— 顶栏全宽更现代
- ❌ **不要把数字字重做到 800/900**（Asana hero 是 medium 500，更优雅）
- ❌ **不要用红色作数据强调**（除负向趋势）— 用 coral 替代红，更温和
- ❌ **不要混用 emoji 和 SVG icon** — 同一页面统一一种（VOD 卡可用 emoji）
- ❌ **不要超过 4 个业务对象色** — 超了改用灰底卡
- ❌ **不要用浏览器 chrome 装饰**（traffic light + url 栏）— 显廉价

---

## 10. AscendOps 实现摘要（参考蓝本）

| 楼层 | 模块 | 关键决策 |
|------|------|---------|
| Header | Logo + 面包屑 + Q2 / 芯片 / 搜索 / 通知 / 头像 | 顶栏全宽，无侧导航 |
| Hero | 5 玻璃态 KPI（触点 / 评分 / Agent / VOD / 闭环率） | 紫青渐变背景 |
| Pipeline | 8 阶段横排 stepper | 健康度色 + 痛点 chip |
| 业务对象 | 4 场景 pastel 大卡 | sparkline + 平均分 |
| 矩阵 | 4 场景 × 5 维度热力图 | coral→gold→green 色谱 |
| 评分 | Agent donut + star 列表 + 4 KPI | 5 段 Asana 色 |
| 痛点 | Top10 bar list | coral 渐变 bar |
| 仓库 | Top/Bottom 切换 list | 金银铜 rank 徽章 |
| 趋势 | 4 场景多线 折线图 | 业务色绑定 |
| 类别 | 5 类条形 + 目标线 | 上下排 label |
| VOD | 5 条原声卡片 | emoji + tag + 播放按钮 |

完整代码：`AscendCANN-main/cann-dashboard/ascendops-experience.html`
