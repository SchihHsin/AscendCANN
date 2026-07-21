# AscendCANN · AGENTS.md

> 新会话必读。本文件由 Codex 自动维护，每次对话后更新。

---

## 项目目标

重构"CANN 开发者效能全景概览"看板，帮助产品/体验团队**快速定位体验最差的角色/场景**，基于 Agentic 评分、痛点、VOD 数据作出改进决策。

---

## 文件结构

```
AscendCANN/
├── AGENTS.md                        ← 本文件（自动维护）
├── CANNlogo.png
├── Ascendlogo.svg
└── cann-dashboard/
    ├── analysis.html                ← UX 分析文档（封面 + 13 章节，v0.4）
    ├── style.css                    ← 分析文档样式
    ├── script.js                    ← 分析文档交互逻辑
    ├── design-options-themed.html   ← 主工作文件（单文件，模拟数据，~2800 行）
    ├── design-options.html          ← 旧版看板（已停用，保留备查）
    ├── ascendc-agent-main/          ← Agentic 算子评测系统（已分析，原作者有 NPU）
    ├── asana-skill/                 ← AscendOps 视觉规范参考文件
    │   ├── SKILL.md
    │   ├── ascendops-experience.html
    │   ├── components.md
    │   └── tokens.md
    ├── backend-context.md           ← 后端上下文
    ├── context.md                   ← 旧上下文（内容已迁移至此，保留备查）
    └── process-log.md               ← 协作过程记录
```

---

## 常用命令

```bash
# 查看看板（直接在浏览器打开）
open cann-dashboard/design-options.html

# Git 操作（绕过 macOS TCC 权限限制）
git --git-dir=/Users/hsin/Documents/Coding/AscendCANN/.git \
    --work-tree=/Users/hsin/Documents/Coding/AscendCANN <命令>

# 推送
git --git-dir=/Users/hsin/Documents/Coding/AscendCANN/.git \
    --work-tree=/Users/hsin/Documents/Coding/AscendCANN push
```

> **注意**：Codex 的 Read/Write/Bash 工具受 macOS TCC 限制，无法直接访问 `~/Documents`。但 `git`（系统二进制）可以绕过此限制。写文件需用 `python3 -c "..."` heredoc 方式。

---

## 协作规则（每次必须执行）

1. **每次修改完成后立即 git push**，不要堆积
2. **每次对话结束后更新本文件（AGENTS.md）**，追加本次对话的关键决策和改动摘要
3. **视觉/设计类改动先提 2–4 个选项**让用户选，不要直接实现
4. **用中文**与用户交流

---

## 当前进度（2026-05-30，本会话更新）

### 2026-07-15（学习页迭代）

- 作品集筛选新增双视图 Tab：可按主题浏览，或切换为按真实项目文件夹浏览。项目视图含 AscendCANN（13）、AscendCANN/cann-dashboard（6）、cannbench（9）、ascend-vs-nvidia-ux（6）、opknow（7）和两个 Skill 来源目录（各 1）。
- 补齐 `ascend-vs-nvidia-ux/reports/ascend-vs-nvidia-2026-06-13-visual.html` 的独立卡片和真实桌面全页预览；同步收录综合分析 UX 版。已移除未发布到 GitHub Pages 的 `gitcode-cann-code-deep` 本地目录卡片，避免 404。
- 探索版昇腾社区作品集的 40 个入口全部补齐一页一图的真实桌面截图，移除 `NO PREVIEW YET` 占位；已校验 40 条页面数据均引用唯一且存在的封面文件。
- 学习档案的“学习全景图”改为无中心的知识分列视图：基础入门、应用开发、算子开发、分布式四类并列呈现；同名节点跨路径合并，显示关联路径数量和已学 / 学习中 / 待学状态。
- 移除原有中心式 SVG 思维导图，避免 SVG 样式级联导致的黑色节点与黑色连线渲染问题。
- 全景图采用四列纵向知识流：移除分类外围容器，仅保留列标题和节点；每列节点以竖直连线串联，避免跨列连线造成杂乱。
- 全景图补充跨类别的贝塞尔依赖连线，置于节点下层；节点使用已学绿、学习中蓝、待学灰三种状态，并在无历史进度时展示三种状态示意。
- 学习画像第一步明确为“你的角色是？”。只有用户选定角色后，推荐区才置于典型场景上方并隐藏分类 chips；跳过画像时，推荐区仍位于场景下方并显示 chips。
- 角色选项点击时立即重排首页，刷新后也根据已保存角色保持对应布局。
- 以昇腾教育中心官方“Ascend C编程”路径（`/edu/growth/details/9614049b0d6044c28e291aea1d931a53`）替换模拟默认路径：预备知识 Ascend C基本概念、异构编程基础速成班、Ascend C 算子开发入门 / 进阶 / 高级、Ascend C skills 系列课程及异构编程基础微认证。节点详情与资源均链接到官方路径或认证页。
- 历史内置 `sample-*` 演示路径自动迁移为官方路径；用户自行创建的路径保留。
- 路径的最小节点由课程名称改为真实章节 / 模块，课程名称作为路径侧栏的聚类标题；首批录入截图已确认的速成班（9 章）、入门（4 模块）、进阶（7 模块）、高级（4 模块）、Skills 全景（3 节）和 Skills 算子开发入门（6 章）。章节详情关联真实学习目标、知识点、官方课程来源和适用的动手练习。
- 每个章节详情固定展示“动手练习”长条卡片及“在 HiDevLab 运行”入口；已有定制步骤的章节进入对应步骤，其他章节直接打开 HiDevLab。
- 样板路径直达地址：`learn.html#ascend-c-demo`（同时兼容 `?path=ascend-c-demo`），直接进入 Ascend C 编程样板路径详情并跳过首页画像弹窗；内置样板路径不受用户已保存路径影响。
- 另提供独立定制页面 `learn-ascend-c-demo.html`，作为审阅 Ascend C 章节级样板路径的固定地址；页面加载后自动进入该样板路径详情。
- AI 助手在由场景卡或自由输入生成路径后，首条上下文消息会回显生成来源，提示“已生成路径，请在左侧查看”，并引导用户继续就当前节点、代码或实践提问。
- 路径侧栏的列表 / 可视化切换改为 Lucide `list-tree` / `git-branch` 图标按钮，保留悬浮说明和无障碍标签；样板路径 AI 首条回复采用固定的 AscendC 编程生成提示。用户提供的昇腾异构编程基础图片仅作为“算子开发编程基础”节点的视频封面。
- `learn-ascend-c-demo.html` 顶部导航对齐 Ascend 开发者站：社区入口细条、Ascend 标识、“开发者”主身份、主页 / 开发 / 文档 / 活动 / 学习 / 论坛 / 博客 / 开发者计划及下载 / 支持 / 积分兑换操作区；当前“学习”以品牌红高亮。
- 样板路径的中间详情补充“学习视频—正文讲解—关键知识点—代码/实践—资源”阅读流；“算子开发编程基础”包含围绕算子、数据搬运与开发验证闭环的具体正文。右栏“本节概念图”更名为“知识图谱”，悬浮知识节点可查看解释卡，点击可定位中间内容。

### 已完成

#### 新看板 design-options-themed.html（主工作文件，~2600 行，单文件，模拟数据）

##### 导航架构（三个顶层 Tab）

**总览**（`#tabOverview`，hash `#overview`）：可滚动总览页，filter-bar 含芯片筛选 + 视角（6 个角色 chip）
1. KPI 横排（4 张摘要卡片，含 ECharts sparkline）
2. 体验健康矩阵（5 产品线 × Agent/痛点/VOD/综合/环比，含 mini 折线）
3. **技术内核** 楼层（红色徽章）：PyTorch API 雷达图 / 模型开箱环形图（77% 综合覆盖）/ 0 Day 发布
4. **开发界面** 楼层（蓝色徽章）：需立即处理清单 + Agentic 效率仪表盘 + "→ 进入用户旅程" CTA
5. 客户痛点 section：大客户闭环率横向柱状图 + 痛点分布柱状图 + 分类汇总 chip（工具/文档/API/环境，可点击过滤，计数随角色联动）+ 统一痛点列表（P0→P1，每条带 `data-cat` + `data-roles`）
6. **生态增益** 楼层（绿色徽章）：VOD ECharts 柱状图 + Top3 原声卡片 + 社区入门体验（S0–S5 步骤圆圈 + KPI 4 格 + 关键痛点 callout）

**体验测试**（`#tabUxtest`，hash `#uxtest`）：单页纵向滚动，专注组件 × 维度量化评分
- **触点体验矩阵**（`#tpHeatGrid`）：4 场景（算子复现/迁移/Builtin/基本功能）× 5 维度（文档/API/工具/环境/综合），热力色 + 趋势箭头，点击格子展示 `#tpDetail` Agent 观测
- **组件评分矩阵**（`#uxtMatrix`）：5 组件（hccl/dvpp/dump/amct/ge）× 9 维度（总分/测试/开发/可理解/可操作/根因/完整/一致/准确），两级列标题（综合/分项评分/开发评分子维度），右侧"更新时间"合并列，热力色 + 趋势箭头，点击格子展示 `#uxtMatrixDetail`
- **数据结构**：`touchpointData`（4行，每格含 `s`/`cls`/`t`/`obs`）、`UXT_MATRIX_ROWS`（5行，含 `vals[]`/`trends[]`/`ec`/`updated`）
- **统一渲染器**：`renderMatrix(cfg)` + `_mxClick()`，由 `initUXTMatrix()` 和 `renderTpMatrix()` 共用
- **归一化**：`uxtNorm(colIdx, v)`：col0 直接用，col1-2 ×10，col3-8 ×20（统一映射到 0–100）
- **URL hash**：`#uxtest`，三个 tab 均支持 hash 路由（`history.replaceState` + 初始化读取 `location.hash`）

**用户旅程**（`#tabDev`，hash `#dev`）：单页纵向滚动
- filter-bar（芯片 + 三个角色）→ KPI 4 格（整体健康/严重场景/活跃痛点/本期优先）
- 触点矩阵（4 场景 × 文档/API/工具/环境，点击格子右侧出现 Agent 观测）
- main-body：场景列表（sticky left）+ 场景详情（评分/痛点/VOD 三证据 tab + 5 维雷达）+ 设计依据侧栏

##### 关键 JS 实现

| 函数 | 作用 |
|------|------|
| `switchTab(id, btn)` | 切换 overview / uxtest / dev，URL hash 同步，滚顶 |
| `filterPain(cat, btn)` | 更新 `_activeCat`，调用 `applyPainFilter()` |
| `applyPainFilter()` | 两层交集过滤（`_activeRole` × `_activeCat`），更新 chip 计数 |
| `selectRole(role, btn)` | 控制总览视角筛选（淡化/关注徽章），尾部调用 `applyPainFilter()` |
| `renderTpMatrix()` | 从 `touchpointData` 渲染触点矩阵 |
| `selectTpCell(sceneId, col, el)` | 更新 `#tpDetail` innerHTML |
| `jumpToJourney(sceneId)` | 切换至用户旅程 tab 并定位场景 |
| `toggleRat()` | tab-aware：总览 → `.ov-rat-panel`；用户旅程 → `.rat-sidebar` |

- 每条 `pain-item` 同时有 `data-cat`（工具/文档/API/环境）和 `data-roles`（op/infra/doc/pm 等）
- 痛点楼层 `data-roles` 覆盖全部角色（永不淡化），内部条目按角色过滤
- 粘滞层次：topbar(top:0, 50px) → filter-bar(top:50px) → scene-list/rat-sidebar(top:100px)
- ECharts：KPI sparklines × 4、健康矩阵 sparklines × 5、PyTorch 雷达、模型覆盖环形、Agentic 仪表盘、大客户闭环柱状图、痛点分布柱状图、VOD 柱状图

#### ascendc-agent-main（Agentic 算子评测系统，已分析，未运行）

- **用途**：用 Codex Agent 批量自动开发昇腾 NPU 算子，评测开发者体验（DX）
- **与看板关系**：是 design-options.html 中"算子编程 Ascend C"相关数据的生产系统

**四层架构**：
1. orchestrator.py：串行开发 35 个算子、并行评测日志、多 Token 轮换
2. 8 个专职 Agent：architect / developer / tester / evaluator / reviewer / comparator / precision-tuner / team-lead
3. 17 个 Skill 模块：ascendc-kernel-develop-workflow / ascendc-precision-debug / ascendc-env-check 等
4. 配置层：operator_catalog.yaml（35 个算子，L1–L3 难度）+ evaluation_config.yaml

**evaluator 5 维度 → 看板映射**：

| evaluator 维度 | 看板位置 |
|---------------|---------|
| 感知学习（文档完整性/准确性/可理解性） | 体验测试评分 / 用户旅程雷达图 |
| 算子设计与实现（API 命名/样例覆盖） | 开发界面 Agentic KPI |
| 算子编译（编译次数/配置行数） | 工具类痛点 |
| 功能调测（测试循环次数） | 调试能力维度 |
| 性能调优（迭代次数） | 工具稳定性维度 |

**NPU 依赖分析**：

| 看板板块 | 是否需要 NPU |
|---------|-------------|
| 体验测试评分 算子编程 Ascend C（4.1/6） | 否（纯日志分析） |
| Agentic KPI — token 消耗 / 耗时 | 否 |
| Agentic KPI — 开发成功率 / 用例通过率 | **是** |
| 客户痛点条目（工具/文档/API 类） | 否 |
| PyTorch API 通过率 / 模型覆盖 / 0 Day | **是** |
| VOD 原声 / 大客户闭环率 | 否 |
| 健康矩阵 Agent 评分列 | 否（有日志即可） |

**Token 消耗**：单个 L1 算子约 20–50 万 tokens（$1–3）；35 个算子全批次约 $40–100+

### 下一步

- 确认是否有 NPU 服务器资源接入，用于替换模拟数据
- 内容改版（用户提过，尚未启动）

---

## 信息架构

### 两条主线

| 维度 | 角色 | 评估对象 |
|------|------|---------|
| 产品应用性 | AI 框架开发者、算子开发者、应用开发者 | 工具/API/文档能不能用好 |
| 社区易用性 | 入门开发者 | 新人能不能在 GitCode 上跑通 |

### 筛选维度

- 产品应用性：芯片型号（A5 / A2&A3）+ 角色
- 社区易用性：组织 / SIG / 项目 / 硬件环境 / 版本 + 可添加对比

---

## 角色与旅程

### 算子开发者典型场景

| 场景 | 旅程环节 |
|------|---------|
| 算子复现部署 | 感知学习 / 环境准备 / 环境验证 |
| 算子迁移部署 | 感知学习 / 算子迁移 / 算子编译 / 功能调测 / 性能调优 |
| Builtin 算子定制修改 | 感知学习 / 算子设计与实现 / 算子编译 / 功能调测 / 性能调优 |
| 算子基本功能实现 | 感知学习 / 算子设计与实现 / 算子编译 / 功能调测 / 性能调优 |
| 特定/泛化 shape 性能优化 | 暂无旅程 |

### AI 框架开发者典型场景

| 场景 | 旅程环节 |
|------|---------|
| 裸模型昇腾亲和优化 | 感知学习 / 整网优化 |
| 其他框架场景（VLLM/SGL/Verl） | 暂无旅程 |

### 入门开发者（社区易用性）旅程步骤

| 步骤 | 任务 |
|------|------|
| S0 搜索与发现 | 搜索并验证官方文档 / 搜索并验证源码仓库 |
| S1 环境检查与准备 | 代码克隆 / 环境预检 |
| S2–S5 | 待补充 |

---

## Agent 评分结构

- **指标概览**（固定 4 项）：开发成功率 / 平均复杂度 / 平均任务执行时长 / 用例执行通过率
- **聚合方式**：取近 7 次运行数据均值
- **精度类**（L0/L1/L2 分级）：MARE / MERE / RMSE Ratio（NPU vs 三方芯片双标杆）
- **性能类**（11 维度）：核间负载均衡、Block Dim、VEC ratio、MTE2 ratio、L2 Cache 命中率等

---

## 痛点数据结构

来源：昇腾大客户（腾讯、蚂蚁、美团、京东等）

每条痛点含：痛点概述 / 客户面向目标 / 客户 Top 痛点 / 确认情况及计划 / 进展 / 客户 / 优先级 / 期望闭环日期 / 计划闭环日期 / 分类 / 状态 / 所属分队 / 责任人

---

## VOD 数据

来源：社区 issue 97% / 线下活动 0.9% / 社区论坛 0.7% / 线上直播 0.5% / 其他

### Top 5 高频共性声音

| # | 原声摘要 | 声量 |
|---|---------|------|
| 1 | 多算子层：空指针校验缺失、编译失败、core dump、精度异常、内存越界、文档描述不一致 | 71 |
| 2 | CANN 多算子仓：文档参数错误、格式错误、描述不一致、内容缺失 | 61 |
| 3 | 算子资料文档：格式不规范、参数描述错误、命令目录错误 | 40 |
| 4 | transformer 算子：图模式类型缺失、编码韧性不足、描述不一致 | 35 |
| 5 | ops-transformer：量化适配不足、shape 拦截缺失、编译依赖缺陷、精度失败 | 33 |

---

## 设计方向（已确定）

1. **问题优先**：排序/颜色/强调以"哪里最差"为导向
2. **三类证据互证**：Agent 评分 + 痛点 + VOD 并列呈现
3. **三层递进**：全景 → 角色视图 → 场景详情
4. **筛选即叙事**：角色 + 芯片筛选是进入专属分析视角的入口
5. **整体重新设计**（非修补），用模拟数据先行，后续替换真实数据

---

## 待确认问题

- [x] Q1 VOD 来源：已确认
- [x] Q2 评分聚合方式：近 7 次数据均值
- [x] 新看板设计方案：已完成，design-options.html 可用
- [ ] Q3 其他角色场景：应用开发者整体开发中
- [ ] 入门开发者 S2–S5 步骤的任务列表
- [ ] 是否有 NPU 服务器：待确认，影响真实数据接入

---

## 对话记录摘要

### 2026-05-19

- 完成痛点双层筛选（角色 × 分类）：`applyPainFilter()` + `filterPain()` + `selectRole()` 联动
- 深度分析 ascendc-agent-main：四层架构、evaluator 5 维度与看板的映射关系、NPU 依赖分布、token 消耗估算
- 更新 context.md + process-log.md，完成 push

### 2026-05-20（第一会话）

- 用户要求：每次改完必须 push + 更新 AGENTS.md（已存入长期记忆）
- context.md 内容迁移至 AGENTS.md，AGENTS.md 成为唯一上下文维护文件
- **主要工作文件切换**：从 `design-options.html` 改为 `design-options-themed.html`（用户调整了视觉样式后的版本），视觉规范参考 `ascendops-theme.skill`
- **总览 Tab 楼层重排完成**：Hero Banner → 健康矩阵 → 客户痛点 → VOD 声量 → 生态增益 → 开发界面 → 技术内核
- **修复 KPI hero 折线图消失**：4 个 glass 卡片缺少 `ecKpi0–3` 挂载容器，已补充

### 2026-05-20（本会话）

#### Bug 修复

- **用户旅程场景卡片点击自动滚顶**：`selScene()` 内有 `window.scrollTo({top:0})` 调用，已删除
- **RSB（角色摘要条）距顶无间距**：`#roleSummaryBar` 的 `margin-top` 从 0 改为 20px，与 `.ov-hero` 对齐

#### VOD 声量楼层 — 完整重构

**旧实现问题**：文件中存在多组冲突的 `.vod-*` CSS：
- 旧 `.vod-body`（第 611 行）为页面布局类，`padding:16px 28px 48px`，覆盖了卡片级 `.vod-body{min-width:0}`，导致卡片内容区异常膨胀
- 旧 `.vod-quote`（第 532 行）带 `border-left:3px`、`padding:8px 16px`、`italic`，渗入新卡片样式
- 死代码 `.vod-two-col`、`.vod-src-*`、`.vod-full-*` 与旧 `.vod-body` 块一并存在

**修复方案**：
1. 旧 `.vod-quote` 重命名为 `.jvod-quote`（旅程 tab 专用），与新样式隔离
2. 删除死代码 CSS 块（`.vod-body` 页面布局 + `.vod-two-col` + `.vod-src-*` + `.vod-full-*`）
3. 新 VOD CSS 严格照抄 `ascendops-experience.html` 参考文件原文，无任何 override hack
4. `renderVodList` 暴露为 `window.renderVodList`（原为局部作用域，导致"返回列表"按钮无效）

**当前 VOD 交互设计**：
- 默认：展示 5 条紧凑 `.vod` 卡片列表（参考文件原样）
- 点击柱状图：切换为该条的详情视图（`.vod-cta` 按钮返回列表）
- 详情视图包含：完整引语（带紫色左描边）+ 深度分析段落 + 统计行（影响人数/状态/来源拆解）+ 改进计划 callout

**VOD_DATA 新增字段**：`detail`（扩展分析）、`impact`（影响范围）、`trend/trendCls`（趋势）、`status/statusCls`（处理状态）、`action`（改进行动）、`sources[]`（声量来源拆解）

**VOD 图标**：emoji 替换为 5 个 Feather 风格线性 SVG 图标（白色描边，显示在渐变色背景上）：
1. 扳手（算子工具链）2. 书本（文档仓库）3. 文件文本（资料格式）4. CPU（transformer）5. 滑杆（ops 调参）

**VOD 柱状图优化**：
- 颜色按严重度从左到右渐变：红(`#E63838`) → 粉(`#FC636B`) → 金(`#FD9A00`) → 青(`#1AAFD0`) → 绿(`#37C597`)
- 每柱从底部透明到顶部实色的渐变填充
- `yAxis.max:74`，最高柱(71)填满约 96% 容器高度
- Grid `top:24 = bottom:24`，上下完全对称居中
- 去掉 `containLabel:true`（会不对称撑开 grid 导致偏右），改用固定对称像素 `left:20, right:20`
- X 轴标签改为单行短词，移除 `\n` 换行符

#### 技术内核楼层

- **PyTorch API 支持度卡片**：雷达图移至左侧（140×140），5 个维度数据行（色点+名称+进度条+数值）移至右侧，与模型开箱覆盖卡片布局一致

#### Commits（上一会话）

| commit | 内容 |
|--------|------|
| `2420bfe` | 修复场景滚顶 + VOD 列表默认视图 + RSB margin |
| `9fcd84b` | VOD 柱状图居中/窄柱/渐变 + PyTorch 卡片布局 |
| `d258215` | 修复 `.vod-quote` 旧 CSS 冲突 + renderVodList 全局暴露 |
| `000bf24` | VOD CSS 从头重写，严格照抄参考文件 |
| `a424f94` | 详情视图复用 `.vod` 卡片结构 |
| `8bf2275` | VOD emoji → 线性 SVG 图标 |
| `fe2eba6` | 详情视图补充 detail/impact/status/action/sources 字段 |
| `eddf1a1` | 柱状图居中修复（去 containLabel，固定对称边距） |
| `7e04cd9` | 柱颜色对应图标背景 + 柱高拉伸 |
| `7a69baf` | 柱颜色改为严重度渐变 + 上下居中 + 高度充满容器 |

### 2026-05-21（本会话）

#### Bug 修复

- **S0–S5 节点点击显示内容都是 S0**：`#journeyStageDetail` 上方有一个写死"S0 最弱环节"文字的静态 `.journey-alert`，用户看到的是它而非动态面板，已删除
- **用户旅程 tab 切换后有时滚到底部**：`switchTab()` 未重置滚动位置，已加 `window.scrollTo({top:0})`
- **`jumpToJourney` 不切换 tab 直接选场景**：现在先调 `switchTab('dev',...)` 再 `selScene()`
- **刷新后总览页定位到中部**：浏览器 scroll restoration 导致，已在 `<script>` 顶部加 `history.scrollRestoration='manual'` + `window.scrollTo(0,0)`
- **生态增益 S0–S5 默认无选中态**：加页面初始化调用 `selectStage('S0', firstEl)`，默认选中并渲染 S0 详情

#### 视觉改动

- **PyTorch 雷达图顶点颜色**：由多色改为同色系紫色深浅（高分→深紫 `#4F4DA7`，低分→浅紫 `#C4AAFF`），尺寸同步缩放；右列图例颜色同步更新
- **用户旅程 5 维雷达图**：`radarSvg()` 的顶点颜色改为同款紫色深浅，图例 `clrDim` 函数同步；`.radar-body` gap 从 0 改为 12px，让"评测趋势"和"五维诊断"两卡片有间距
- **Agent 步骤改为竖向时间轴**：每个旅程环节左侧有彩色圆点（显示评分数字，颜色按 bad/mid/ok）+ 竖线连接下一步，最后一步无竖线；步骤名从左侧独立列移入内容区作为 header

#### 新功能

- **asana-skill/ 目录 push 至远程**：包含 SKILL.md、ascendops-experience.html、components.md、tokens.md

#### 关键 CSS/JS 变更

| 位置 | 变更 |
|------|------|
| `.radar-body` | `gap:0` → `gap:12px` |
| `radarSvg()` | 顶点颜色改为 `purpleClr(v)` 深浅紫函数 |
| `clrDim` | 改为紫色深浅映射，与雷达图一致 |
| `.step-tl-*` 系列 CSS | 新增 timeline 布局类 |
| agent panel 渲染 JS | `agent-step-row` 改为 `step-tl-item`，增加 `.step-tl-node`（圆点+竖线）+ `.step-tl-body` |
| `switchTab()` | 末尾加 `window.scrollTo({top:0})` |
| `jumpToJourney()` | 先 `switchTab('dev',...)` 再 `selScene()` |
| `selectStage()` | 页面初始化时自动调用，默认选中 S0 |

#### Commits（本会话）

| commit | 内容 |
|--------|------|
| `fac03d0` | SVG雷达图按分数着色+尺寸;S0-S5点击详情;去左描边;右列padding20px;角色→痛点tab联动 |
| `bfc8680` | 删除写死 S0 的静态 journey-alert |
| `8f001a6` | 雷达图改深浅紫色系;switchTab滚顶;jumpToJourney先切tab |
| `dace249` | 雷达图紫色深浅;两卡片gap12px;刷新滚顶;图例色同步 |
| `f68ad8d` | agent步骤改为竖向时间轴，圆点+连线，颜色按评分cls |
| `2e2a157` | add asana-skill reference files |
| `839c432` | 生态增益旅程步骤默认选中并显示S0详情 |

### 2026-05-21（续会话）

#### Bug 修复

- **S0–S5 节点点击均显示相同内容**：静态 `.journey-alert` 写死"S0 最弱环节"，覆盖了动态 `#journeyStageDetail`，已删除
- **用户旅程 tab 底部大片空白**：`.step-tl-body` 每步 `padding-bottom:18px` + `.ev-panel` 28px + `.main-body` 48px 累积；改为 `align-items:flex-start` + 连线用 `position:absolute` + 最后一步 `.step-tl-body.last{padding-bottom:0}`
- **设计点 `hlRat(n)` 索引错位**：`querySelectorAll('.rat-item')` 选中总览+旅程共 12 条，在旅程 tab 点击时 n-1 指向总览面板的条目；改为根据激活 tab 限定查询范围（`.ov-rat-panel` vs `#ratSidebar`）

#### 视觉改动

- **生态增益 S0–S5 Pipeline 重绘**：完全按 `ascendops-experience.html` 中"算子开发八阶段 Pipeline"样式重建
  - 结构：`ov-stage-head`（方形渐变色徽章 S0–S5 + health 圆点光晕）+ 阶段名 + 场景/触点 meta + 大号评分 + 进度条 + 底部痛点 `mini-tag`
  - CSS：`.ov-pipeline` / `.ov-stage` / `.ov-stage-head` / `.ov-stage-no` / `.ov-h-good/warn/bad` / `.ov-health-dot` / `.ov-health-good/warn/bad` / `.ov-stage-bar` / `.ov-stage-foot`
  - `selectStage()` 和初始化代码同步改为查询 `.ov-stage`（原 `.journey-stage`）
- **用户旅程五维雷达图例**：新增进度条列（`radar-dim-bar`），颜色沿用紫色深浅 `clrDim(v)` 

#### 关键 CSS/JS 变更（续）

| 位置 | 变更 |
|------|------|
| `.ov-pipeline` | 新 Pipeline 容器，`grid-template-columns:repeat(6,1fr)` |
| `.ov-stage` | 替换旧 `.journey-stage`，完全照抄参考样式 |
| `.ov-h-good/warn/bad` | 方形徽章渐变色，对应好/中/差评分 |
| `.ov-health-dot` | health 圆点，带颜色光晕 |
| `selectStage()` | 查询目标从 `.journey-stage` 改为 `.ov-stage` |
| `.radar-dim-bar` | 雷达图例新增进度条列（色随 `clrDim`） |
| `hlRat(n)` | 根据激活 tab 限定查询范围，避免跨面板索引错位 |
| `.step-tl-line` | 改为 `position:absolute`，从圆点底延伸到行底 |
| `.step-tl-body.last` | `padding-bottom:0` 去除最后一步多余底部空间 |

#### Commits（续会话）

| commit | 内容 |
|--------|------|
| `501e687` | docs: 更新 AGENTS.md |
| `0303976` | timeline连线改绝对定位，最后步去padding，消除底部大片空白 |
| `de34bde` | S0-S5按参考pipeline重绘;雷达图图例加进度条;设计点hlRat定位到正确面板 |

### 2026-05-21（续会话 2）

#### Bug 修复

- **Agent 时间轴连线不可见**：`.step-tl-line` 使用 `position:absolute` 定位在 `.step-tl-node`（高度仅 30px），`top:33px` 已超出父容器，连线实际只有几像素。修复：将定位改为相对 `.step-tl-item`（`left:14px; top:30px; bottom:0`），连线可正确延伸到下一节点顶端。同时移除 `.step-tl-node` 上的 `position:relative`
- **设计点面板不出现**：`.rat-sidebar` 是 `.main-body`（`flex-direction:column`）的子元素，导致侧栏排在场景详情**下方**（页面底部），不在视野内。修复：在 scene-detail + rat-sidebar 外包一层 `display:flex;flex-direction:row` 容器
- **评测趋势图右侧空白**：`trendSvg()` 输出固定 `width="220"` SVG，未随 chart-col 弹性宽度拉伸。修复：改为 `width="100%"`（保留 `viewBox="0 0 220 82"` 确保正确缩放）
- **雷达图与图例距离过近**：`.radar-col` 的 `gap:12px` 改为 `gap:22px`

#### Commits

| commit | 内容 |
|--------|------|
| `8e7b0c3` | 修复timeline连线/设计点侧栏布局/趋势图宽度/雷达图间距 |

### 2026-05-21（续会话 3）

#### cann-website 视觉规范重构（基于 OpenDesign tokens）

**目标**：将 `cann-style.css` + 4 个 HTML 文件对齐 OpenEuler 设计系统（`OpenDesign/scripts/tokens.json`）。

**CSS `:root` 变量变更**：

| 变量 | 旧值 | 新值 |
|------|------|------|
| `--grad` | `linear-gradient(#2e53fa, #7b25f4)` | `linear-gradient(#002FA7, #5177CA)` |
| `--black` | `#0A0A0F` | `#000000` |
| `--bg` | `#F8F9FB` | `#F3F3F5`（grey-2） |
| `--surface2` | `#F1F4F9` | `#EDEDED`（grey-3） |
| `--border` | `#E5E7EB` | `rgba(0,0,0,0.1)`（color-control4） |
| `--border2` | `#D1D5DB` | `rgba(0,0,0,0.25)`（color-control1） |
| `--text-secondary` | `#4B5563` | `rgba(0,0,0,0.8)` |
| `--text-muted` | `#9CA3AF` | `rgba(0,0,0,0.4)` |
| `--accent-blue` | `#2e53fa` | `#002FA7` |
| `--font` | `'Sora', sans-serif` | HarmonyOS/Inter 栈 |
| `--mono` | `'JetBrains Mono', monospace` | SFMono/Menlo/Monaco 栈 |
| `--radius` / `--radius-lg` | `12px` / `16px` | `4px` / `4px` |
| `--radius-xl` | `24px` | `8px` |
| `--shadow` | `0 4px 12px rgba(0,0,0,0.05)...` | `0 3px 8px rgba(0,0,0,0.08)` |
| `--shadow-lg` | `0 12px 24px rgba(0,0,0,0.08)...` | `0 2px 24px rgba(0,0,0,0.15)` |

**其他改动**：
- Nav height `64px` → `72px`；添加 OpenEuler nav shadow `rgba(0,18,85,0.078)`；backdrop-filter blur `4.53px`
- Nav active link 改为品牌蓝色 + 2px 底部指示线
- docs-layout sticky offset `64px` → `72px`
- 全文扫描替换所有硬编码旧品牌色 `rgba(46,83,250,...)` / `rgba(123,37,244,...)` / `#2e53fa` / `#7b25f4` → 新品牌蓝等效值
- 移除 4 个 HTML 文件中的 Google Fonts（Sora + JetBrains Mono）引用

#### Commits

| commit | 内容 |
|--------|------|
| `fb14c5e` | style: OpenDesign token重构——品牌蓝/HarmonyOS字体/扁平圆角/新阴影/nav 72px |

### 2026-05-21（续会话 4）

#### 矩阵趋势箭头 + 角标底色

**趋势箭头**：每个矩阵格子数字右侧新增 8×8 SVG 小箭头，表示该维度较上期的变化方向：
- 上升 `'u'` → 淡绿 `#6DBD9A` 向上三角折线
- 下降 `'d'` → 淡珊瑚 `#E89494` 向下三角折线
- 持平 `'f'` → 灰 `#AAAAAA` 水平线

**实现细节**：
- 新增 `cellTrendSvg(t)` 工具函数，返回 `<svg width="8" height="8">` 字符串
- `UXT_MATRIX_ROWS` 每行新增 `trends[]`（长度 9，值为 `'u'|'d'|'f'`）
- `initUXTMatrix` config 新增 `trendOf:(r,ci)=>r.trends[ci]`
- `touchpointData` 每个 cell 新增 `t` 字段（4 列）
- `renderMatrix` 格子内 `.cv` 改为 `display:flex;gap:3px`，数字+箭头并排
- `renderTpMatrix` 同步更新，读取 `row.cells[col].t`

**角标底色变浅**：`.hm-corner` `background:#E3E3E6` → `#EBEBED`

#### Commits

| commit | 内容 |
|--------|------|
| `2496087` | feat: 矩阵格子数字旁加趋势箭头SVG + 角标底色变浅 |

### 2026-05-21（续会话 5）

#### 趋势箭头调整

- 渲染尺寸 8×8 → 7×5（宽度保持，仅高度缩小），顶点内移（y=1→y=3）使张角变大约 74°
- 线宽 1.6 → 1.8 补偿视觉重量

#### 组件评分矩阵详情面板重构

**数据新增**：`UXT_MATRIX_ROWS` 每行新增：
- `prevVals[]`：上期 9 维度数据
- `hist[][]`：近 6 期 × 9 维度历史数据（5行×9列×6期）

**新增函数**：
- `miniSparkSvg(data, color, W, H)`：纯 SVG 走线 + 渐变填充（上深下淡）+ 末点圆点（颜色表示最近趋势）；用自增 `_spkIdx` 保证渐变 id 唯一

**详情面板布局（三列水平对齐）**：
1. 大 avatar（56×56，热力色）
2. 文字块（组件名 + sub + 上期分/delta 同行；维度/EC/更新时间第二行）
3. 近6期走线（110×45，独立第三列，紧跟文字块）

**细节**：
- 上期分 + delta 从 avatar 下方移至组件名同行（`align-items:baseline`）
- 全维度对比条（右侧）每列显示本期分 + delta，当前维度高亮背景
- 外层 `align-items:center` 三列垂直居中
- 文字块改为 `flex-shrink:0`（去掉 `flex:1`），走线不再被推到右侧
- 走线 SVG 改 `vertical-align:middle`（原 `display:block`），"近6期"文字垂直居中

#### Commits

| commit | 内容 |
|--------|------|
| `22ed773` | fix: 矩阵趋势箭头缩至5×5，顶点内移使张角更大 |
| `02ed4a4` | feat: 组件评分矩阵详情面板加上期分+delta+近6期走线 |
| `d9ffb89` | fix: 详情面板走线内联至维度信息行，减少高度 |
| `50051d1` | fix: 趋势箭头宽度恢复，仅高度缩小（7×5） |
| `a87d52c` | fix: 上期分数移至组件名旁，不再占avatar下方空间 |
| `a1540f6` | feat: 走线加渐变填充(上深下淡)，尺寸稍大，垂直居中 |
| `e604159` | fix: 走线SVG vertical-align:middle，近6期文字垂直居中 |
| `5de596b` | fix: 走线尺寸放大至110×45（约等于avatar高度80%） |
| `660cc5b` | fix: 详情面板外层flex改align-items:center |
| `0c13d1e` | refactor: 详情面板拆为三列——avatar/文字/走线独立水平对齐 |
| `fd5e85c` | fix: 文字块去掉flex:1，走线紧跟文字不再靠右 |

### 2026-05-22（续会话）

#### learn.html 完整重设计

**需求**：原 AI 对话框埋在 Tab 内部太深，路径内容太长一屏看不完。

**方案**：双视图结构（仪表盘 + 路径详情）

- **仪表盘视图**（`#ld-dash`）：
  - 顶部 hero：大号标题 + AI 输入框（Enter/点击触发 `ldGenPath`）+ 快捷 chip
  - 继续学习版块：紧凑路径卡片（进度条 + 下一步提示 + 继续学习按钮）
  - 为你推荐版块：节点卡片网格（分类 chip 过滤，展示标题/描述/方向标签）

- **路径详情视图**（`#ld-roadmap`，默认隐藏）：
  - sticky topbar：← 返回按钮 + 路径名 + 进度条
  - 完整路径序列 + 节点列表
  - `ldShowDash()` 返回仪表盘

#### 新增 JS 函数（cann-app.js）

| 函数 | 作用 |
|------|------|
| `ldSetInput(text)` | 填充 `#ld-ai-input` |
| `ldGenPath()` | 调 `_aiPathStart()` 触发 AI 路径生成 |
| `ldSetCat(cat, btn)` | 切换推荐分类 chip，调 `ldRenderNodes` |
| `ldRenderContinue()` | 渲染路径卡片列表（从 `customPaths` 或 `samplePaths`） |
| `ldRenderNodes(cat)` | 渲染节点推荐网格（从 `NODE_LIST` 按分类过滤） |
| `ldStartNode(title)` | 进入路径详情视图并定位到该节点 |
| `ldShowRoadmap(pathId)` | 隐藏仪表盘、显示路径详情，设置进度条 |
| `ldShowDash()` | 返回仪表盘视图 |
| DOMContentLoaded | learn.html 初始化：调 `ldRenderContinue()` + `ldRenderNodes('all')` |

**CSS 类对应（cann-style.css 已有）**：`.ld-path-body` / `.ld-path-prog-label` / `.ld-node-card-top` / `.ld-node-card-title` / `.ld-node-card-badge` / `.ld-node-card-desc` / `.ld-node-card-footer`

#### Commits

| commit | 内容 |
|--------|------|
| `801e2c8` | feat: learn页面重设计 — AI输入框置顶，路径卡片+节点推荐双版块 |

### 2026-05-22（续会话 2）

#### 右侧抽屉报告功能（design-options-themed.html）

**需求**：点击组件评分矩阵左列组件名，以右侧抽屉形式展示 dump_evaluation_report.md，支持可视化/渲染两种视图，支持复制、下载。

**实现**：
- `REPORT_MD` JS 对象：组件名 → 完整 markdown 字符串（嵌入 dump_evaluation_report.md 全文，12节/429行，不截断）
- `openReportDrawer(name)` / `closeReportDrawer()`：固定定位右侧面板，overlay 背景蒙层
- `mdToHtml(md)`：标准 MD→HTML（表格/标题/粗体/代码/列表/blockquote/hr）
- `mdToVisualHtml(md)`：增强可视化渲染
  - ✅❌⚠️ → 彩色徽章（绿/红/黄圆角标签）
  - 表格单元格按关键词着色（PASS→绿、FAIL→红、P0/P1/偏低→橙）
  - `xx.x%` → 内联进度条 + 数值（颜色按 ≥80/≥50/其他分级）
  - `<blockquote>` → 橙色左边框 alert 框
  - 前置 4 格评分摘要卡片（设计/提取/覆盖/等级，颜色按分值）
- `renderRptContent()`：根据 `_rptView` 切换调用 `mdToVisualHtml` 或 `mdToHtml`
- 默认视图：可视化；按钮标签：**可视化** / **渲染**
- 行标签条件渲染：`hasReport` 时加 `comp-link` class + `onclick="openReportDrawer(...)"`
- 移除旧版重复的 `rptSwitchView` 函数

**CSS 新增类**：`.vi-badge` `.vi-ok/fail/warn` `.vi-cell-ok/fail/warn` `.vi-pct-wrap/bar/num` `.vi-alert` `.vi-score-grid/card/val/label/sub/unit`

#### Commits

| commit | 内容 |
|--------|------|
| `a891349` | feat: 抽屉报告 mdToVisualHtml 可视化渲染 + 完整 dump 报告内容嵌入 |

### 2026-05-25（本会话）

#### design-options-themed.html 抽屉报告精修

**CSS cascade bug 修复**：
- 搜索/复制/下载/关闭按钮底色不一致——旧 `.rpt-btn` 规则写在覆盖规则之前导致后者失效，整合为单一规则 `background:rgba(255,255,255,.1)`
- 图标尺寸统一为 14×14
- 状态圆点颜色阈值与矩阵 `textColor()` 对齐（≥60 绿 / ≥40 橙 / 其余红）

**目录（TOC）**：
- 默认展开，放在抽屉右侧（172px 宽，浅色 `#F6F6F8` 背景）
- 滚动时才显示滚动条（JS scroll event + `toc-scrolling` class + 1s timeout）
- 激活项用左描边（`border-left`），非右描边
- 报告正文滚动条始终可见

**抽屉 header 重构**：
- 两列 flex 布局：左列（圆点+标题+meta），右列（所有操作按钮垂直居中）
- 状态色光晕：从 dot color 解析 RGB，生成 `linear-gradient(105deg, rgba(r,g,b,.18)→transparent), #0F172A`
- 关闭按钮缩小 + 去底色

**其他**：
- 打开抽屉时锁定页面滚动（`document.body.style.overflow='hidden'`）
- 表格"权重"列不着色：列感知处理，识别表头含"权重"的列，跳过百分比颜色化
- 下载下拉菜单磨砂玻璃质感：`backdrop-filter:blur(16px) saturate(180%)`
- 体验测试 tab 三张隐藏卡片改为骨架屏（无闪烁动画、无文字、无 tag）

#### VitePress 文档站 Ascend 主题

**背景**：对 `cann-dashboard/ascend-doc/vitepress` VitePress 项目做视觉重绘，参考 `性能调优-CANN社区版9.1.0-beta.1-昇腾社区.html`（hiascend.com OpenDesign 设计系统）。

**新增文件**：
- `.vitepress/theme/ascend-theme.css`（780 行）：完整主题覆盖
- `package.json`：补充缺失的 npm 配置

**主题覆盖范围**：

| 区域 | 关键值 |
|------|-------|
| 品牌色 | `#c7000b`（昇腾红），替换默认蓝 |
| 字体 | HarmonyOS Sans SC → PingFang SC → Microsoft YaHei 回退链 |
| 导航栏 | 白底 64px，站点名红色，激活链接红色+底部 2px 指示线 |
| 侧边栏 | `#f6f6f8` 底，激活链接红色+左描边 |
| H1 | 红色 2px 底线；H2 灰色 1px 底线 |
| 内联代码 | 淡红底 + 红字 |
| 代码块 | `#282c34` 深色，语言标签，复制按钮 |
| 表格 | 带边框，灰色表头，hover 行高亮 |
| 提示块 | tip=蓝/warning=橙/danger=红/info=绿色左描边 |
| 首页 | 红色 CTA 按钮，Feature 卡片 hover 红边框 |
| FilterToggle | 匹配红色 focus/hover |

**config.mjs 更新**：
- 新增 `srcDir: resolve(import.meta.dirname, '../../../repo-scan/asc-devkit-fresh/docs')`
- 文档源文件在 `cann-dashboard/repo-scan/asc-devkit-fresh/docs/`

**新增 index.md**：
- 路径：`repo-scan/asc-devkit-fresh/docs/index.md`
- VitePress home layout，含快速入门/API 两个 CTA + 三个 Feature 卡片

**启动方式**（Windows，npm 缓存需指向用户目录）：
```
cd D:\HW\AscendCANN\cann-dashboard\ascend-doc\vitepress
npm install --registry https://registry.npmjs.org --cache "%LOCALAPPDATA%\npm-cache"
node node_modules/vitepress/bin/vitepress.js dev --port 5300
```

> npm 注意：系统全局 npm cache 在 `C:\Program Files\nodejs\node_cache`（需管理员权限），每次 install 需加 `--cache` 参数指向用户可写路径。淘宝镜像证书已过期，用 `--registry https://registry.npmjs.org`。

#### Commits

| commit | 内容 |
|--------|------|
| `d01fe9c` | feat: VitePress Ascend community theme — brand red, HarmonyOS font stack, full component coverage |

### 2026-05-27（本会话）

#### VitePress Ascend 主题深度重构（去红 + 蓝紫主题色）

**背景**：初版主题大量使用昇腾红 `#c7000b`，用户要求除顶部导航栏外全部去红，主题色改为蓝紫，按钮改黑色胶囊，文字链接蓝色仅限文档内容区。

**关键改动**：

| 区域 | 旧值 | 新值 |
|------|------|------|
| 侧边栏背景 | `#f6f6f8` 纯灰 | `#ebf1fa` + `linear-gradient(90deg, rgba(46,83,250,.03), rgba(123,37,244,.03))` |
| 侧边栏激活态文字 | 红色 `#c7000b` | `var(--vp-c-text-1)`（深色） |
| 侧边栏激活态背景 | 无 | `rgba(46,83,250,.18)` |
| 侧边栏激活态字重 | 正常 | `700` |
| H1 底线 | 红色 2px | 灰色 `#e5e5e9` |
| 内联代码底色/字色 | 淡红/红 | `rgba(0,0,0,.05)` / `#1d2129` |
| 文字链接 | 全局红色 | 仅 `.vp-doc a` 用蓝色 `#002fa7`，其余均为深色 |
| 主要按钮 | 红色 | 黑色 `#000000`，`border-radius:100px`（胶囊） |
| 次要按钮 | 红色边框 | 透明底 + 黑色边框/字色，`border-radius:100px` |
| 首页 CTA/Feature 卡片 | 红色 hover | 深色/中性 |
| 搜索高亮/选中态 | 红色 | `#1d2129` 深色 |
| TOC 激活态 | 红色 | 深色 `var(--vp-c-text-1)`，加粗 |
| Logo | 文字 "Ascend C" 显示 | 仅显示 SVG（`display:none` 隐藏 `.title`），高度 26px |
| `:root --vp-c-brand-*` | 红色系 | `#002fa7` / `#5177ca` / `#84a1dc`（蓝紫系） |

**保留红色的唯一位置**（导航栏）：
- `.VPNavBarTitle .title { color: #c7000b }` — 站点名
- `.VPNavBarMenu .VPNavBarMenuLink.active { color: #c7000b }` — 激活链接
- `.VPNavBarMenu .VPNavBarMenuLink.active::after { background: #c7000b }` — 底部 2px 指示线

**按钮规范**（参考 OpenDesign button.md）：
- 主要（brand）：`background:#000; border-color:#000; color:#fff; border-radius:100px`
- 次要（alt）：`background:transparent; border-color:#1d2129; color:#1d2129; border-radius:100px`

**链接规范**（参考 OpenDesign link.md）：
- 仅 `.vp-doc a`：`color:#002fa7`（brand-6），hover `#5177ca`（brand-4），底部 `1px solid rgba(0,47,167,.2)`
- 所有其他 UI 链接（侧边栏、TOC、Feature 卡片、Footer、搜索）均使用深色 `#1d2129` 或 `var(--vp-c-text-1)`

#### Commits

| commit | 内容 |
|--------|------|
| `8b2bafc` | style: sidebar蓝紫背景+蓝色激活态；Logo仅显示SVG；隐藏title文字 |
| `2ad7371` | style: 全面去红——链接蓝色、按钮黑色胶囊、激活态深色文字+蓝紫填充 |
| `bf82ad2` | style: 选中态背景加深至 rgba(.18)，文字加粗 700 |
| `4960e1c` | style: 蓝色链接仅限 vp-doc 内容区，其余链接/卡片/搜索均改深色 |

### 2026-05-30（本会话）

#### 工作仓库

本会话所有工作在独立仓库 `SchihHsin/cann-dashboard`（`/Users/hsin/Documents/Coding/cann-dashboard/`）完成，主文件为 `overview-v3.html`，GitHub Pages 地址：`https://schihHsin.github.io/cann-dashboard/overview-v3.html`。

#### 体验金字塔重设计

将开发界面楼层原有"五层旅程金字塔"（感知学习/设计与实现/算子编译/功能调测/性能调优）替换为**体验质量金字塔**：

| 层级 | 名称 | 分值 |
|------|------|------|
| L5（顶） | 好用 | 8–10分 |
| L4 | 易用 | 6–8分 |
| L3 | 可用 | 4–6分 |
| L2 | 难用 | 2–4分 |
| L1（底） | 不可用 | 0–2分 |

**当前位置**：L3 可用，5.4分；L4 标注"目标"。

**实现细节**：
- SVG 内联绘制，viewBox `0 0 360 128`（约为原高度 60%）
- 竖向渐变（上浅下深）+ `clipPath` 圆角（顶点 r≈5，底角 r≈6）
- 右侧五行标签：彩色圆点 + 等级名 + 分值区间，扇形虚线连接金字塔边缘
- L3（当前）行高亮背景 + 紫色"当前 5.4" badge
- L4 行附蓝色"目标"badge
- 无阴影，颜色减至柔和粉彩（顶色极浅，底色中段）

#### 图表颜色统一（方案 B）

将**非语义图表**的多色配置统一为蓝色渐变（深 `#2E6BE6` → 浅 `#BFDBFE`）：

| 图表 | 改动 |
|------|------|
| VOD 高频声音柱状图（5条） | 红/橙/金/青/绿 → 统一蓝色水平渐变 |
| 痛点分布泡泡图（5个） | 5色 → 统一蓝色 `opacity:.72` |
| 产品健康 hbar（4条） | 绿/青/金/紫 → 蓝色渐变 |
| 接口满足度 hbar（多组） | 紫/青/绿/红/金 → 蓝色渐变 |
| Sample 覆盖度竖柱（4条） | 4色 → 蓝色竖向渐变 |
| posCase 已完成/已规划 | 绿/浅蓝 → 深蓝/浅蓝 |
| **痛点闭环率 hbar** | ✅ **保留** 绿/金/红语义色 |

颜色来源：`asana-skill/tokens.md` 蓝色系（`#2E6BE6` = `--blue`，`#BFDBFE` ≈ `--blue-light`）。

#### 其他改动

- **FAB 按钮**：移除右下角固定悬浮按钮及对应 CSS
- **GitHub Pages**：`SchihHsin/cann-dashboard` 仓库首次 push + Pages 启用

#### Commits（本会话，cann-dashboard 仓库）

| commit | 内容 |
|--------|------|
| `da09b38` | style: 体验金字塔重绘——细窄造型+竖向渐变+阴影+扇形连线+右侧标签列 |
| `1ea0610` | style: 体验金字塔高度压缩至60%（viewBox 208→128） |
| `fc2b44e` | style: 体验金字塔颜色减淡——渐变改为柔和中段色 |
| `18e040c` | style: 体验金字塔颜色再减淡至柔和粉彩色 |
| `b1526fa` | style: 去掉金字塔阴影 |
| `96d6a06` | style: 金字塔加圆角——顶点+底角clipPath贝塞尔圆化 |
| `2994bde` | style: 移除右下角FAB按钮 |
| `926f6b4` | style: 图表非语义色统一改为蓝色渐变（#2E6BE6→#BFDBFE） |

### 2026-06-10（本会话）

#### ascendc-agent-main 运行原理 HTML

- 用户回访：定位 `cann-dashboard/ascendc-agent-main`（原作者在昇腾 NPU 服务器上跑的算子自动开发评测系统），并回顾此前对"它怎么跑"的分析（源：会话 `bb61e3e5-...` 及其子代理日志）
- 实读 `orchestrator.py` / `claude_runner.py` / `env_setup.sh` / `Dockerfile` / `*.yaml`，新增详细 HTML：`ascendc-agent-main/运行原理与复现指南.html`
  - 七节：是什么 / 四层架构 / 运行流程 / NPU 容器机制 / **复现限制** / 复现步骤 / 成本估算
  - 重点补全"复现限制"：硬依赖 Linux（`/dev/davinci*` 设备节点仅 Linux+真实 NPU 才有）、昇腾 910B 物理卡、NPU 驱动/固件、aarch64 架构、Docker、Codex CLI + ANTHROPIC token；Mac 只能跑 CPU 孪生或纯 `--evaluate`
- 在线地址（AscendCANN 仓 Pages，main 根目录）：
  `https://schihhsin.github.io/AscendCANN/cann-dashboard/ascendc-agent-main/运行原理与复现指南.html`

### 2026-07-14（本会话）

#### learn.html 任务优先迭代

- 学习页保留既有 AI 路径生成、路径编辑、节点抽屉与进度记录；首屏将旧快捷词改为完整可见的 3×2 场景入口：算子开发、模型迁移、模型推理、模型训练、性能调优、自定义目标。
- 选场景会预填 AI 输入并展开轻量计划配置；用户可填写学习目标与计划完成日，数据随保存的自定义路径一并保存在浏览器本地。
- 新增“我的学习资源”：支持添加名称、链接与类型，资源列表可删除，使用 `localStorage` 持久化。
- 进入路径后改为左侧路径导航、右侧内容工作区；左侧提供列表/可视化两种显示，右侧展示当前节点概要、核心概念、资源与实践入口，完整节点内容仍可在抽屉打开。
- 验证：`node --check cann-app.js` 和 `git diff --check` 通过；受当前浏览器安全策略限制，无法对本地 `file://` 地址进行自动化点击验收。
- 后续修正：恢复学习页固定右侧快捷工具栏，提供“智能助手 / 学习档案 / 错题本”三个入口；错题本有错题时显示红点，避免路径工作区改版遮蔽原有功能入口。
- 再次修正：右侧第三项应为“出题”而非“错题本”；点击会对当前学习节点直接生成 AI 测验题。错题本仍位于学习档案内，作为答题记录查看入口。
- 新增修复：`openEmptySandbox()` 曾引用已移除的旧 Playground DOM，导致学习页所有 HiDevLab 入口无反应；改为打开现有 Notebook 抽屉并渲染默认文件。新增 `learn-before-iteration.html`，从改版前提交恢复，用于并排对照。
- 计划配置从“目标+日期”扩展为身份、基础、目标、资源、时间五组可选项；AI 生成路径会携带这些偏好。路径可视化改为带连接线的垂直节点图；AI 路径编辑状态下隐藏路径工作区，恢复原有编辑器交互。
- 调整路径侧栏：移除节点列表两侧多余留白，标题仍保留最小内边距，解决列表与侧栏边缘看起来有空白带的问题。
- 对照页修复：`learn-before-iteration.html` 会用内联样式覆盖新版“隐藏旧路线主体”规则，进入路径后可正常查看原有路线内容。新版路径节点详情新增推荐视频卡，点击可进入该节点的完整学习抽屉及视频内容。
- 场景配置优化：五个 CANN 高频场景改为各自的身份、基础、目标和资源选项（时间统一）；这些选择会作为路径生成上下文直接传入 AI。只要用户已选择偏好，路径规划跳过旧的澄清问答，不再重复询问页面已收集的信息。
- 首页路径入口调整：保留顶部自由输入框（有内容才启用生成）；场景卡路径则在其下方完成配置后直接生成，无须回到输入框。暂时移除“继续学习”楼层；推荐内容缩减为每类最多 6 张简洁卡片，去除卡内主题长列表并改为三列展示。
- 再次调整继续学习：恢复该楼层但首页仅显示最近一条紧凑路径卡；全部路径统一从“查看全部”进入学习档案，控制首页高度。
- 自由输入框修复：禁用浏览器自动补全，并在学习页初始化时清空，避免恢复上一轮输入内容。推荐卡维持简洁摘要，hover 时显示前三项“本节内容”要点，平衡扫读和信息密度。
- 场景生成按钮改为按需显示：页面初始不显示“根据选择生成学习路径”，用户点击场景卡后才与偏好配置一同出现。
- 学习偏好改为可选：选择场景后即可生成路径；已选择的身份、基础、目标、资源和时间仅作为定制上下文，不再阻塞生成。
- 路径生成落点调整：生成完成后直接进入三栏学习详情页（左：列表/连线可视化路径，中：当前节点内容，右：智能助手与随堂测验）。保留路径编辑能力，改为左栏“编辑路径”按需进入，不再作为生成后的必经步骤。
- 新增个性定制：第六张场景卡命名为“个性定制”，会显示任务描述输入并以其作为生成主题。所有场景的身份、基础、目标、资源、时间偏好组均统一增加“其他”选项，选择后可直接填写自定义内容。
- 路径工作区留白修复：移除三栏工作区 `max-width` 居中约束，宽屏下左侧路径栏从页面左边缘开始，避免列表外侧出现空白带。
- 首次学习引导：学习页首次打开显示三步全页偏好问答（兴趣场景、学习目标、基础与资源），画像持久化到 `localStorage`；完成或跳过后进入首页。推荐内容按兴趣场景优先排序，首页可随时“调整学习偏好”。
- 学习首页信息顺序调整：保留页首轻量自由输入作为熟练用户直接入口；将“为你推荐”前置为偏好完成后的首个主要内容区；高频场景与配置放在推荐之后，继续学习再往后，体现“画像 → 推荐结果”的反馈同时不牺牲任务直达效率。
- 路径可视化重做：废弃“列表 + 竖线”伪可视化，改为内联 SVG 学习路线图。路线以曲线箭头连接可点击节点卡，节点按所属阶段着色，当前节点高亮；点击会同步更新中间节点详情。未引入 D3：路径为有序线性数据，原生 SVG 更轻且不依赖外网资源，适合本地 `file://` 预览。
- 学习详情右栏重构：右栏默认展开并嵌入导航栏下方三栏布局，宽 330px，会挤压左侧路径和中间知识内容。右栏提供智能助手、随堂测验、知识可视化三个 Tab；问答、答题和概念关系图均在栏内完成，并随当前路径节点同步更新。
- 学习路径页 AI 收敛：右栏 Tab 顺序改为“AI 助手 / 知识图谱 / 随堂测验”。路径页顶栏 Ask AI 直接激活右栏 AI 助手并聚焦输入框，旧全局 `#ai-sidebar` 自动关闭；右栏 AI 同时支持当前节点问题、通用 CANN 问题、页面操作和路径调整，不再区分两个 AI 入口。其他页面仍沿用原全局侧栏。
- 推荐区收敛：首页“为你推荐”固定为一排 3 张卡片，新增“换一换”可在当前筛选分类内轮换下一组内容；切换分类会重置到该类首组。
- 交互收敛：隐藏首页 `learn-quick-rail` 快捷浮栏，避免与顶栏及路径页右栏能力重复。路径详情中的 Ask AI 改为右栏开关：默认右栏展开，点击收起，再次点击展开并聚焦“AI 助手”。
- Ask AI 状态细化：路径页右栏展开但处于知识图谱/随堂测验时，点击 Ask AI 仅切回 AI 助手；只有右栏展开且 AI 助手已选中时，点击才收起右栏。`learn-quick-rail` 已从 DOM 删除；随堂测验 Tab 进入时自动生成题目。
- 推荐卡交互优化：移除易被 hover 覆盖层遮挡的底部“开始学习”文字按钮，卡片整体可点击；hover 覆盖层右下新增圆形进入图标按钮，明确进入当前学习节点。
- 学习画像流程收敛：偏好弹窗改为每次进入学习页都会出现，收集的画像用于推荐及路径生成；移除典型场景卡下重复的身份/基础/资源配置。五个典型场景卡点击后直接生成路径；“个性定制”保留任务描述输入作为唯一补充步骤。
- 学习详情增强：从推荐卡进入会组装 4–6 步的前置与同方向进阶路径，不再只显示单节点。中间节点内容若有 `knowledge.code` 则展示代码示例及“在 HiDevLab 运行”。学习页不再展示右下角浮动 HiDevLab（仅文档页显示）。右侧 AI 新增当前节点快捷提问：初学者解释、逐行代码讲解、常见错误排查、20 分钟练习设计。
- 中间内容收敛：移除“打开完整学习内容”二次入口；学习路径节点的中间栏默认完整展示视频、代码、概念与资源，右栏不再承担完整内容展示。
- 本轮补齐：中间节点区增加全部核心概念、代码、可运行的 `lab` 练习步骤；资源区可“添加到当前节点”（同步写入个人资源库）。首页标题下增加显眼的学习档案入口。学习档案新增“学习图谱”Tab：汇总用户所有路径的节点、按路径先后关系连线，并标记已学/学习中/待学。角色画像存在时推荐区前置且隐藏分类筛选，跳过画像时推荐区位于场景后并保留分类筛选。路径可视化连接线由蛇形曲线改为直线箭头。
- 图谱职责命名：路径右栏的当前节点关系图命名为“本节概念图”；学习档案中的跨路径总图命名为“学习全景图”。视频改为中间栏内嵌学习模块，概念图节点不再打开旧节点抽屉，而是聚焦中间完整学习内容。
- 文案调整：学习首页场景区标题从“从高频任务开始”改为“从典型场景开始”。
- 节点内容收敛：移除中间栏独立的“正文讲解”楼层，正文说明分别并入“本节要掌握什么”的对应知识点卡片；例如“算子开发编程基础”将算子与计算逻辑、数据与存储层级、开发流程概览各自解释直接呈现在卡片中，避免信息重复和视线跳转。
- 样板学习路径名称更新为“算子开发从入门到精通”；保留官方“Ascend C编程”作为检索词和课程来源名称，不混淆路径名与原始官方课程名。
- 节点详情的内容顺序调整为：学习视频 → 动手练习 → 本节要掌握什么 → 代码示例 → 学习资源，使实践入口先于概念要点，便于边做边学。
- “算子开发编程基础”右侧知识图谱升级为 12 个可交互的关联节点：算子建模、Tensor 数据排布、Scalar 访存和 DoubleBuffer 流水优化四条知识链由依赖连线串联；节点悬浮展示解释并可直达对应官方文档。
- 知识图谱不再对非“算子开发编程基础”章节只展示 2–3 个兜底概念；通用图谱至少生成 8 个节点。“昇腾硬件架构介绍”单独建模为 12 节点关系图，覆盖 Host/Device、AI Core、Cube/Vector、GM/L1/UB、MTE 与算子执行流水。
- “算子开发编程基础”的知识图谱进一步按四个可见知识簇组织：算子建模、数据排布、Scalar 访存、流水优化。簇内节点置于同色背景组内，保留簇内与跨簇的依赖连线，避免节点呈无结构网格。
- 图谱布局由固定网格改为拓扑式非等距布局：节点按关系疏密错落排布，关系线改为带箭头的曲线；四个知识簇以不规则淡色轮廓界定范围，而不再作为等高行容器。
- 评审后撤回章节级放射图方案，恢复为非等距的聚类拓扑图；保留已有的 12 个知识点、知识簇、曲线依赖与官方文档悬浮入口。
- 撤回直接覆盖原文档页和学习页视觉的尝试，保留原有页面；新增独立重绘预览页 `docs-visual-redesign.html` 与 `learn-visual-redesign.html`，以 `cann.zip` 的两张视觉稿为基准重新构建文档阅读态与章节学习态，后续在预览页确认后再迁移到主页面。
- `cann.zip` 内导出的背景素材已整理到 `visual-assets/cann-redesign/` 并实际接入独立重绘页：文档页使用搜索框与标题区素材，右侧目录使用淡化装饰素材；学习页首张视频卡直接使用“视频封面”素材。原页面保持不变。
- 新建 `cann-website-v2.html`：以原 `cann-website.html` 的交互和旧版 HiDevLab 抽屉为功能底座，文档页和学习路径详情替换为新视觉；v2 内导航不再跳转到其他 HTML，文档目录、路径节点、AI/图谱/测验和路径编辑均映射到对应的真实 DOM 元素。
- 根据评审反馈，`cann-website-v2` 的文档页改用 `ascend-doc` 已精调的技术文档视觉系统：红色只用于品牌导航、蓝色用于内容链接、目录采用低饱和渐变选中态、H1 使用 `doc-banner.png`、代码和表格保持中性高可读样式；学习路径详情继续使用新的视觉稿方向。
- `cann-website-v2` 导航改为对齐 Ascend 开发者站：顶部昇腾社区细条，下方 Ascend 单 Logo + 开发者身份 + 主页/开发/文档/活动/学习/论坛/博客/开发者计划及下载、支持、积分兑换；不再显示 CANN Logo。本地的主页、文档、学习仍在 v2 内切换，其余开发者站入口跳转官网。
- `cann-website-v2` 学习路径详情继续按视觉稿收敛：标题区使用未拉伸的右侧浅紫蓝笔触背景；列表模式保留 V1 的真实课程/章节列表，可视化模式改为带课程分组、序号圆点和纵向连线的时间线。右栏将“本节概念图”统一命名为“知识图谱”，以算子建模、数据排布、流水优化和 Scalar 访存四个知识簇呈现，通过曲线连接到当前章节；保留节点悬浮解释、官方文档入口及点击定位中间正文的交互。
- 进一步明确 v2 路径双模式：左侧列表 Tab 按 V1 的课程标题、大号章节编号和章节副标题呈现；右侧可视化 Tab 才呈现课程分组、编号圆点与连续路径线。学习资源卡统一在渲染后替换为 Lucide 的课程 / 文档图标。标题区新增可编辑 SVG 背景 `learn-path-hero.svg`：浅紫蓝云端和流线视觉、低饱和、高分辨率，并通过白色渐隐与正文衔接，避免原有灰色块与失焦素材。
- v2 章节内容统一图标系统：图标放在卡片内部而非楼层标题；动手练习卡使用 `square-terminal`，知识点卡按内容使用 `brain-circuit` / `layers-3` / `workflow`，学习资源卡使用课程 / 文档 Lucide 图标，均为黑色 20px 且线宽一致。
- v2 路径侧栏字号回归 V1 规范：课程名 11px、节点标题 12px、章节副标题 10px、序号圆点 23px / 10px，避免为视觉稿误放大列表文本。学习详情两侧栏新增独立收起按钮与可拖动分隔线：左栏范围 220–440px、右栏范围 300–520px，宽度在当前浏览器会话保存；收起后中间正文自动扩展，Ask AI 能重新展开右栏并激活 AI Tab。
- v2 双侧栏收起控件改为附着在左右分栏中线位置的竖向小药丸，以 Lucide `chevron-left` / `chevron-right` 表示收起；收起后药丸贴在外侧页面边缘并自动翻转箭头表示展开，不再占用栏头位置。
- 知识点卡的 Lucide 图标与标题使用同一行的 20px + 11px 双列栅格，正文从下一行跨整卡开始，避免图标独占一行导致标题错位。
- v2 学习路径左栏默认宽度回归 V1 的 250px；宽度存储 key 升级，旧会话中的 320px 默认值不再覆盖新默认，用户主动拖动后才保存新的自定义尺寸。
- v2 侧栏药丸改为视口固定定位（`position:fixed`），纵向始终处于屏幕中线；只在拖动栏宽、收起展开、窗口缩放时依据分栏边界重新计算横向位置，因此正文滚动不再带走控件。
- v2 文档代码块在浅色内容区继续使用中性浅灰工具栏，但显式将语言标签、代码解释 / 运行文字及下载 / 复制图标设置为深灰，悬浮态进一步加深，修复工具栏沿用旧深色代码块白字而导致的低对比问题。
- v2 导航“学习”恢复先进入学习首页；只有从首页的推荐、场景、继续学习或样板路径入口进入后才展示三栏路径详情。首页画像弹窗改为低遮罩透明叠层，底层首页可见，并支持右上角关闭、点击遮罩空白关闭及“暂不设置，直接浏览”。
- 个性化引导保持角色、首要目标单选，基础与资源改为可多选并标注“可多选”；“零基础”与已选择的编程基础互斥，有昇腾硬件和希望在线实验可同时选择，推荐逻辑继续兼容历史单值数据。
- 个性化引导的单选题选中后自动进入下一题；仅多选题保留底部确认按钮，避免单选完成后再点击“下一步”的重复操作。
- 修复 v2 学习档案遗漏的“学习全景图”入口：恢复 Tab 与 `la-panel-map` 容器，复用既有跨路径知识节点、已学 / 学习中 / 待学状态及跨类别依赖连线渲染；它与路径详情右栏的当前章节“知识图谱”保持职责区分。
- 修复学习档案路径卡只返回学习首页的问题：整张路径卡及“继续 / 开始”按钮均关闭档案抽屉并按路径 id 直接进入对应三栏详情，且自动关闭首页画像弹窗。
- 节点详情标题下的简介与“在 HiDevLab 实践”按钮改为同一行的弹性布局：简介占剩余宽度，实践入口固定靠右。
- v2 学习路径移除新增的 `#5451B9` / `#5B57CB` 等独立紫蓝色，视图切换、节点选中标识和强调色统一复用 V1 的 `--grad`（`#2e53fa → #7b25f4`）及其透明变体。
- v2 路径详情进一步清理深紫色：章节眉标改中性灰，当前节点提示改浅灰底 / 深灰字，AI 用户消息和发送按钮统一采用 V1 蓝紫 `--grad`，移除 `#4744A8`、`#4D4AB5`、`#5553B9`。
- v2 桌面端路径详情改为固定三栏工作区：`ld-roadmap` 固定在 92px 开发者导航下方，路径顶栏不滚动，左右栏和中间知识内容分别在各自列内滚动；移动端保留常规文档流与顶栏 sticky 行为。
- v2 HiDevLab 沿用原 Notebook 抽屉内容，默认高度改为视口 60%；顶部增加拖动调节柄，允许在 360px 到导航下方可用高度间调整，尺寸在当前浏览器会话内保存。
- 学习路径详情中间栏只保留用户提供的透明流线素材 `learn-path-bottom-ribbon.png`：右上缩小并向内收，露出更多完整弧线，图像透明度约 50%，左缘使用 CSS mask 渐隐到透明；背景渐变改为仅在顶部由淡蓝紫自上而下淡出至白色，移除底部渐变和右到左渐变。
- 流线装饰进一步向右上偏移（右移 46px、上移 34px），其余大小、透明度与顶部纵向渐变保持不变。
- v2 文档首页与学习首页移除 `section-label` 眉标（“文档中心”“学习”），保留主标题和其余内容结构，不影响主页的功能性 section label。
- 新增“在昇腾 NPU 上运行Qwen3”路径：内容严格对应 CANN Learning Hub 的 `01_qwen3_npu_inference_baseline.ipynb`，按 AI/LLM 基础、推理组件、PyTorch 与 `torch_npu`、NPU 环境检查、ModelScope 下载 Qwen3-0.6B、模型加载、Tokenizer、逐 token 贪心推理、基线测速和自由对话组织为 12 个节点、4 个课程聚类。入口作为“为你推荐”网格内的普通卡片（占用三卡中的一张），仅在全部 / 应用开发筛选中显示；详情沿用现有三栏工作区，并为节点补充 Notebook 原链接、真实代码示例与 HiDevLab 练习入口。
- Qwen3 路径右侧“知识图谱”改为 Notebook 的真实“推理流程一图看懂”：用户输入 → Tokenizer 编码 → 推理循环（模型前向、选 token、EOS 检查与拼接）→ Tokenizer 解码 → 输出结果，并明确标注未结束时回到循环、EOS 时结束；不再误用通用的概念拓扑图。
- 学习路径详情中间栏右上流线背景再上移 40px；Qwen3 路径支持固定直达地址 `cann-website-v2.html#learn/qwen3-npu-inference-baseline`，首次打开会跳过首页与画像弹窗，直接进入三栏详情。直达逻辑同时兼容旧查询参数，并在 DOM 就绪和页面加载完成后各校验一次，避免首页初始化覆盖详情状态。
- 修复 Qwen3 专用推理流程图被 v2 通用知识簇图二次覆盖的问题；v2 图谱覆写器会对该路径直接放行。直达地址改为在所有初始化逻辑结束后再进入详情，避免被学习首页重置。
- v2 学习路径右侧工具栏的 Tab 头固定在工具栏顶部；右栏滚动由激活的工具内容面板承接，AI / 知识图谱 / 随堂测验 Tab 不再随内容滚走。
- Qwen3 路径不再只保留 Notebook 的标题、摘要和关键代码：保留独立的“本节讲解”正文楼层，用连续段落呈现原 Notebook 的教学说明；“本节要掌握什么”仅保留适合扫读的关键概念卡。内容覆盖训练/推理比喻、Tokenizer 与后处理、PyTorch Tensor、`torch_npu` / CANN、下载提示、Eager / FP16 / eval 参数、逐 token 循环、EOS / 拼接、NPU 同步计时、tokens/s 基线和自由练习提示。
- 学习路径的“动手练习”后新增“常见错误码与排查”楼层：按 Qwen3 推理、算子开发和通用运行时匹配近场景的错误帮助，每条包含触发症状、常见原因、逐步排查与建议修复，并提供官方错误码参考入口。知识点卡新增“查看文档”跳转，优先对应节点首个官方资源。
- 修复学习首页顶部自由输入框无法启用“生成路径”：它曾与已移除的场景配置按钮共用状态函数，并因该按钮不存在而提前返回；现改为先独立更新自由输入按钮，场景配置缺失不会阻断自由输入生成。
- 修复“常见错误码与排查”误把问题分类当错误码：Qwen3 节点改为显示实际错误码 / 错误文本（`ACL_ERROR_RT_MEMORY_ALLOCATION`、`ACL_ERROR_RT_DEVICE_NOT_READY`、`ModuleNotFoundError: torch_npu`、`OSError / from_pretrained`），并新增错误码 / 错误原文搜索框；算子路径保留 `EZ9999` 等实际码。用户可先按日志查码，再查看该码的近场景排查路径。
- 修复 Qwen3 hash 直达地址被首页路由改写成 `#home`：页面脚本加载时立即保存 `#learn/qwen3-npu-inference-baseline` 的路径 ID，在 DOM 初始化和所有资源加载后使用保存的 ID 进入详情，并将地址恢复为该固定 hash。
- 进一步修复 Qwen3 直达：路径 ID 的捕获前移到 `cann-website-v2.html` 的 `<head>`，在 `cann-app.js` 加载前完成；主学习初始化直接读取该值。新增独立入口 `learn-qwen3.html`，用于提供不依赖 hash 的稳定直达地址，跳转到带路径参数的详情页。
- 学习路径内嵌视频封面改为按素材原始 956×538 比例（约 16:9）渲染，不再由固定最小高度压扁；视频尺寸随中间内容栏宽度自适应。
- 视频卡片桌面端宽度收敛为中间内容栏约 50%（最小 320px），保持原始比例；中等屏为 65%，移动端恢复满宽。
- 页面中搜索与下拉图标统一替换为 Lucide `search` / `chevron-down`：覆盖首页和文档搜索、文档操作下拉、导航下载、错误码排查、节点实验步骤及路径编辑器；动态生成的内容在渲染后主动初始化图标，避免缺失。
- 顶部社区细条右侧改为 Lucide `user-round` 个人账户入口，对齐昇腾开发者站的导航结构。
- Qwen3 路径的最后一组课程命名为“巩固与扩展”，从 12 节增至 17 节。首节点直接回答首跑后的操作痛点：在 `cann-learning-hub/quick_start/first_llm_inference` 中复制 `03_qwen3_npu_inference_fused_op.ipynb` 为个人实验副本，仅替换 `Qwen3RMSNorm.forward` 为 `torch_npu.npu_rms_norm`，小算子版 / 融合版各热身 1 次并计时 3 次，记录 tokens/s 和加速比；后续再扩展 RoPE / 图模式，并以实验记录与认证收口。
- 按用户确认的范围 1 使用 `cann社区视觉图.zip` 更新学习路径详情与右侧知识图谱：采用新稿的浅蓝光感卡片背景、视频封面、搜索纹理和纵向推理流程卡片；学习首页结构与交互保持不变。扩展课程的右栏图谱改为“基线 → 实验工程 → RMSNorm 融合 / 三次计时 / RoPE 或图模式 → 成果与认证”的优化闭环。
- 对照新版路径详情图进一步校正：学习视频封面保留背景素材但叠加课程标签、视频标题、说明和播放按钮；左栏列表重绘为课程图标分组、彩色方形编号与竖向连接线；中间栏恢复明显的顶部浅蓝渐变，右上卡片背景素材放大并上移。
- 按最新反馈修正中间栏：背景渐变改为浅中性灰白，不再使用蓝色；背景素材取消右上偏移和缩小，改为从右上自然铺开并放大到内容区域宽度。
- 修复学习视频封面错位：清除旧视频阶段对内部元素的隐藏与裁切影响，封面、课程文字层和播放按钮固定在同一比例区域内；左栏背景改为浅灰，未选节点采用半透明白卡，选中节点为纯白实卡。
- 学习路径左栏的列表节点进一步压缩为 40px 高，并增加 7px 卡片间距；连接线仅绘制在相邻卡片的留白中，避免穿透卡片造成节点粘连。
- 修复右栏 AI 助手提问区在窄栏或调整栏宽后输入框与发送按钮重叠：输入区改为固定按钮、剩余空间自适应的两列布局，输入框可正常收缩且不溢出。
- 学习视频封面移除课程标签 `span`，仅保留视频标题、学习说明与播放入口，减少封面叠层。
- v2 学习路径视图职责调整：左侧 `list-tree` Tab 恢复 V1 的课程分组列表；右侧 `git-branch` Tab 承载新版带彩色编号、卡片间距和连接线的节点可视化，并设为进入路径详情时的默认视图。
- 学习视频播放入口改为封面正中的独立 46px 圆形按钮，脱离左侧文字层的弹性布局，避免按钮被压缩；同时移除残留的右下角时长 / 课程标签。
- 视频封面播放入口进一步缩至 36px，改为半透明白色玻璃底、细白边与 8px 背景模糊；悬浮时仅轻微提亮，避免纯白大按钮抢占封面视觉。
- 为学习首页新增独立视觉方向预览 `learn-home-visual-options.html`，不影响正式页：A“轻科技社区”采用浅灰白基底、流线素材与轻玻璃卡片；B“沉浸式学习”采用深色任务主视觉与 AI 输入主焦点。两版使用相同的推荐、场景和继续学习内容，供用户选择后再迁移。
- 用户确认采用 A“轻科技社区”方向：正式学习首页改为任务导向的明亮主视觉、右上流线素材、半透明输入框与轻玻璃内容卡；典型场景保留算子开发、模型迁移、模型推理、模型训练、性能调优五类，并移除“个性定制”（自由描述仍由顶部 AI 输入框承接）。
- 修复学习首页自由输入仍触发旧 AI 澄清问答：用户已在输入框给出任务时直接进入路径生成，不再追问“你的学习目标是什么”；首页标题强调与“为你推荐”选中筛选统一为蓝紫渐变白字，移除该区域的深紫色实底。
- Qwen3 路径的独立入口 `learn-qwen3.html` 不再跳转并丢失自身地址，改为以全屏嵌入方式加载带路径参数和 hash 的详情态；分享 / 打开该地址时稳定保持独立 URL，并直接进入“在昇腾 NPU 上运行Qwen3”路径。
- Qwen3 的排障楼层改为“常见昇腾错误码与运行异常”：官方昇腾编号使用 `E10001`、`E10002`、`EZ9999`，并把 `ModuleNotFoundError: torch_npu`、`OSError / from_pretrained` 明确标注为“报错原文”，不再将英文异常名称误呈现为错误码；搜索提示同步更新。
- 恢复路径详情的“让 AI 调整路径”入口：从左栏进入既有内联编辑器并打开 AI 路径调整会话，用户提出增加 / 删除 / 移动 / 替换节点后会沿用原有 AI 光标、节点高亮和逐项修改动画。
- 路径详情的左栏、中间正文、右栏工具内容使用 6px 透明轨道细滚动条，移除白色轨道和滚动按钮；Community Bar 与 Ascend Developer Nav 在三栏内容向下滚动时收起，向上滚动或回到顶部时恢复。
