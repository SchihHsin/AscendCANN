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
- 两侧收起药丸的纵向位置改为由路径工作区实际边界计算：固定在工作区的垂直中点，适配导航收起 / 恢复后的可视区域高度。
- 路径详情右栏 AI 助手补回显性“让 AI 调整学习路径”入口；用户在右栏直接输入“增加 / 删除 / 移动 / 替换路径节点”等诉求时也会自动切换至既有 AI 屏幕操控编辑器，并保留原诉求、AI 光标与逐项编辑动效。
- 修复学习路径左侧第一个“列表”Tab：通过列表容器自身的 `v2-list-mode` 与 14px 左右内边距统一控制课程标题和节点卡位置，不再通过内容结构选择器绕开可视化 Tab；可视化 Tab 维持原有时间线布局与对齐。
- 用户认为列表 Tab 仍被 V2 节点卡视觉干扰，已恢复首版 V1 列表的完整表现：课程分组标题、朴素白色列表行、圆形序号、选中描边与轻阴影；仅列表容器保留统一 14px 内边距，右侧可视化 Tab 仍使用新版路线图。
- 新建独立探索样板 `learn-agent-v3.html`，不影响 V2：放弃左 / 中 / 右三栏，改为左侧常驻“学习 Agent”对话工作台与右侧连续学习画布。以“在昇腾 NPU 上运行 Qwen3”为真实内容样例：右侧整合进度路线、当前课程、视频、关键知识、下一步与学习状态；左侧 Agent 提供执行确认、对话记录和快捷诉求。输入错误码、20 分钟学习时长或提前动手练习等诉求，会直接反映到画布的排障、计划或下一步任务，验证对话作为路径控制入口的交互方向。
- V3 按确认布局调整：Agent 继续独立在最左；右侧工作区内部恢复既有纵向、可点击的课程聚类路径导航（列表 Tab 为默认，Agent 可高亮 / 定位节点）；主体保留课程正文、视频、知识点和实践；“本节知识图谱”成为正文右侧的伴随卡；“随堂测验”置于知识点之后，答题结果回显到 Agent 对话，避免再把知识图谱和测验拆成第三个长期栏位。
- 用户决定先以 V2 继续迭代，V3 暂停。修复 V2 右栏 AI 输入框错位：移除误用的 `learning-search-bg.png`（该素材自身包含完整圆角输入框和阴影，叠在真实 input 内形成双层边框）；改为单层白色 input、明确 36px 高度、统一圆角和焦点描边。
- 修复 V2 文档页导航下的大块空白：外层 `.page` 已预留 92px Community Bar + Developer Nav 高度，文档 `docs-layout` 又额外添加了 72px 顶部 padding；现移除重复留白，文档三栏从导航下方直接开始，侧栏可视高度同步按 92px 导航高度计算。
- V2 文档页目录再次对齐 `ascend-doc` 已确认的技术文档参考：左侧重建为低饱和树状目录（章节层级、圆点与细引导线、淡蓝紫激活态），右侧“本页内容”改为圆点—细连线的锚点时间线，去除突兀的大卡片感；不改动原有文档内容或交互。
- V2 文档首页的分类浏览和热门文档入口移除 emoji，统一替换为 Lucide 线性图标；目录首页与“本页内容”标题图标也统一为同套图标系统，尺寸、线宽与中性灰色调保持一致。
- 修复 V2 文档 AI 解释链路：文档选中内容或代码解释会默认进入可拖动的浮动助手面板；浮层关闭按钮改为直接关闭自身，不再因隐藏的学习路径工作区状态被错误转发。AI 解释只接受远程 Worker 的真实返回，不使用本地兜底内容；当前配置的 Worker 域名连接超时，需使用原 Cloudflare 账户重新发布 `worker.js` 并配置 `DEEPSEEK_API_KEY` Secret 后恢复。
- 发布独立学习分身样板页 `study-zhuang.html`：单文件页面，包含主页、学习分身、学习地图、聚焦学习、搜索和成就等 hash 路由，用于后续评估“学习分身”是否并入学习档案或首页摘要入口。
- `cann-website-v2.html` 的 HiDevLab 现支持同一 Notebook 实例的三种停靠布局：默认底部抽屉（保留 60% 视口高度与纵向拖拽）、右侧分屏（学习路径自动让出空间，可横向拖拽宽度）与全屏专注。布局切换入口放在 HiDevLab 标题栏的 Lucide 图标组中；当前 Cell、终端和运行状态会保留，所选布局与尺寸仅在当前浏览器会话保存。
- 根据分屏截图修正 HiDevLab 的右侧停靠状态：进入分屏时，学习路径与右侧学习工具（AI / 知识图谱 / 测验）自动从工作区布局中收起，只保留学习正文与 HiDevLab；实验区在窄宽度下改为紧凑标题栏，隐藏设备规格、压缩运行操作与状态监控，并在更窄屏隐藏文件侧栏 / 文件管理 Tab，避免控制项相互挤压错位。
- `cann-website-v2` 的非 Qwen3 章节知识图谱改为参考图的横向流程画布：使用点阵底、白色知识簇卡、左右圆形端口与单一圆角直角连线，按“算子建模 → 数据排布 → Scalar 访存 → 流水优化”依次呈现。保留原有全部知识点、悬浮解释、官方文档跳转和点击定位，取消节点级多对多曲线，避免交叉连线杂乱。
- 修正此前误改路径详情右栏而未改到用户所指“学习档案 → 学习全景图”的问题：学习档案全景图现改为四张横向流程卡（基础入门 → 应用开发 → 算子开发 → 分布式），点阵底、端口和单一圆角直角连线替代跨分类蓝色曲线；保留全局节点内容、已学 / 学习中 / 待学状态、关联路径数量与点击进入节点。
- 根据进一步反馈，学习档案全景图取消分类卡及任何节点左侧彩色描边：每个知识节点独立成为白色流程卡，通过左右端口逐个沿横向主线连接；基础入门、应用开发、算子开发、分布式只保留为上方分类标识，状态移至卡片右上角。
- 学习档案全景图改为分类横向并列、分类内节点纵向串联：节点卡固定为 204×62px、同类节点间 18px 留白，避免重叠和无效留白。SVG 连线与端口中心共用同一套坐标，纵向从下端口接到上端口，跨分类从最后节点右端口接到下一列首节点左端口；仅渲染实际被连线使用的端口。
- 学习档案全景图补充悬浮关联强调：默认连线为中性深灰；悬浮或键盘聚焦任一节点时，该节点显示黑色描边，且只将与其直接相连的纵向 / 跨分类线加深为黑色，其余连线保持默认深灰。
- 学习档案全景图的关联强调进一步校正：默认线与端点统一调浅为 `#9BA2AE`，悬浮节点时直接关联线及其实际两端端口同步加深为柔和深灰 `#4E5561`；连线增加端口方向元数据，只加深被这条线真正使用的圆端点，避免同一卡上无关端口被误高亮。
- 学习档案全景图的悬浮强调色按最新反馈改为纯黑：直接关联线、该线两个实际端点与当前悬浮卡片描边均使用 `#000`（通过高优先级规则避免被默认样式覆盖）；其余线和端点保持 `#9BA2AE`。
- 修复学习档案全景图的空分类占位：应用开发等当前无节点的分类会在数据层过滤后重新编号，不再保留空列的横向宽度，因此基础入门、算子开发等实际显示分类按相邻列紧凑排列。
- 修正学习档案全景图的连线语义：删除“分类内相邻节点纵向串联”及“上一分类末节点连下一分类首节点”的自动关系；改为显式知识依赖 / 应用关联图（如 CANN 软件包结构 → 算子开发编程基础、Tokenizer 编解码 → 逐 Token 推理、性能评估 → 性能优化）。节点只在存在真实关系时显示对应方向端口，说明文案同步强调分类只用于浏览，悬浮仍仅高亮直接关联线、端点和当前节点。
- 学习档案右侧抽屉新增左边缘拖拽调宽：默认 560px，可在 440px 与视口 82%（同时至少保留 160px 主页面）之间调节；悬浮边缘出现细竖向拖拽提示，宽度按会话保存，移动端维持全宽且不显示拖拽控件。
- HiDevLab Notebook 抽屉顶部品牌标识改为使用用户提供的透明 PNG 素材 `visual-assets/hidevlab/hidevlab-logo.png`，不再使用通用终端线性图标和文字；保持原始宽高比，并针对右侧分屏稍微收窄，底部抽屉与全屏布局保持清晰显示。
- 学习路径详情的代码框从单一“运行”入口升级为内容匹配的行动单元：概念节点使用短调用 / 计算契约，实践节点使用最小可运行示例，性能与融合节点使用改前改后或验证对照。Ascend C 章节补齐硬件识别、CANN 环境、算子契约、CopyIn/Compute/CopyOut、工程与 Host 骨架、尾块、性能评估、双缓冲、调试和融合等代码示例；代码框统一支持复制与 AI 逐行解释，只有标注“可运行示例”的代码显示“在 HiDevLab 运行”，避免将伪代码或对照片段误导为可直接执行。
- 根据截图调整 HiDevLab 顶部 Logo 的视觉尺寸：常规底部 / 全屏布局从 22px 高提高到 30px（最大宽度 148px），右侧分屏从 19px 提高到 24px（最大宽度 118px），使其与 Notebook Tab 的视觉重量相称，同时保留分屏布局的空间。
- 路径详情正文阅读顺序调整为：学习视频 → 本节讲解 → 代码示例 → 动手练习 → 常见错误码与排查 → 本节要掌握什么 → 学习资源。代码示例成为讲解后的可验证例子；无“本节讲解”的章节仍在视频后自然呈现代码。
- 修复路径详情中间正文的宽度不一致：讲解、代码、动手练习、排障、知识点和学习资源统一到 820px（或中栏可用宽度）的阅读轨道，移除讲解 / 排障 760px、首跑卡 900px 与其余模块满宽的混用；视频继续保留较小的 50% 媒体宽度，作为独立视觉节奏。
- 修复 HiDevLab 右侧分屏拖拽只改变实验区、不改变学习内容宽度的问题：分屏打开时，整个 `ld-roadmap` 的右边界由 HiDevLab 当前宽度占位，路径工作区、顶栏和中间正文的实际可用宽度都会随拖拽同步变化；900px 以下仍退回覆盖式分屏，避免将正文压缩到不可读。
- HiDevLab 顶部 Logo 统一为 36px 高、最大 176px 宽，底部抽屉、右侧分屏和全屏专注均使用同一尺寸；移除曾为分屏保留的缩小覆盖，因为三种布局的顶部栏高度一致。
- 学习路径详情在未打开 HiDevLab 时改为默认“左侧学习路径 + 中间正文”两栏：右侧 AI 助手、知识图谱、随堂测验不再常驻占用一栏，而是作为右侧三枚 Lucide FAB 按需唤醒；每次只打开一个独立浮窗，沿用原有工具数据、当前节点上下文和交互。左侧路径收起后改为左侧 `route` FAB，点击以独立路径浮窗展开。HiDevLab 右侧分屏时继续隐藏这些 FAB / 浮窗，避免与实验区争夺空间。
- HiDevLab 打开态进入专注工作区：自动收起 Ascend Community Bar 和 Ascend Developer Nav，学习路径的 `ld-roadmap-topbar` 紧贴视口顶部；右侧分屏的实验区同步从该 58px 顶栏下开始，关闭 HiDevLab 后恢复全局导航。
- 学习路径中间正文区建立统一排版阶梯：H1/H2/H3/H4 分别为 26/22/19/17px、600 字重及 1.35/1.35/1.4/1.4 行高，对应 32/28/24/20px 上间距和 18/16/14/12px 下间距；正文统一 16px/400/1.7 与 16px 段落间距，注释/图注统一 14px/1.5。列表上下间距 12px，视频、代码、图片与表格块上下 20px，全部采用 4px/8px 间距网格。
- 全局 Ascend 导航按等比收紧：Community Bar 30px → 24px、Developer Nav 62px → 52px，总高 92px → 76px；同步缩小 Logo、文字、导航间距与两侧留白。学习详情、文档布局、移动端顶栏和 HiDevLab 分屏的顶部锚点均同步使用 76px，避免缩小导航后产生空白或遮挡。
- HiDevLab 右侧分屏时，`ld-roadmap-actions` 脱离被实验区压缩的 `ld-roadmap` 右边界并固定在视口右上角、与 58px 路径顶栏居中；因此拖拽 HiDevLab 宽度不会再带动“全量课程 / 学习档案”操作区左移。窄屏与常规布局保持原逻辑。
- 修正 HiDevLab 右侧分屏的侧栏入口：分屏进入时左侧学习路径默认收起为左侧 FAB，右侧保留 AI 助手、知识图谱、随堂测验三个 FAB；左侧 FAB 点击后恢复为分屏内嵌的学习路径栏（非浮窗），右侧三个 FAB 继续以独立浮窗打开。退出分屏后恢复进入前的左栏展开/收起状态。
- 学习档案“学习全景图”节点悬浮/聚焦态的黑色描边加粗为 2.75px，与关联高亮连线使用同一视觉粗细；默认节点描边仍保持 1px 浅灰。
- 学习路径详情正文保留 820px 统一阅读轨道；考虑到按需从右侧唤起知识图谱、测验等浮窗的使用场景，宽屏下轨道恢复贴靠左侧。视频仍在轨道内保持较窄媒体比例。
- 右侧 AI 助手、知识图谱、随堂测验的三枚 FAB 现为一对一入口：点击任何 FAB 只展示对应的独立浮窗，其标题直接反映当前工具，不再在浮窗内重复提供三工具切换 Tab。
- 右侧工具浮窗打开时隐藏整组 FAB，避免按钮从浮窗底部露出；关闭浮窗后再恢复 FAB 入口。
- 站内嵌套滚动区域统一为轻量按需滚动条：默认透明，鼠标悬浮或用户滚动时短暂显示 5px 无底色滑块；移除上下箭头和常驻白色轨道，覆盖学习路径、工具浮窗、知识图谱、学习档案、文档栏、代码框与 HiDevLab 等滚动容器。
- 右侧工具浮窗改为内容型可调高度：AI 助手初始 420px、随堂测验初始 320px、知识图谱保留 540px 画布；浮窗贴近页面下方，拖动上边缘的轻量把手调节高度（向上变高、向下变矮），并按工具分别保存本会话尺寸。
- “在昇腾 NPU 上运行 Qwen3”路径的第 5 节由通用“检查昇腾 NPU 环境”升级为“Qwen3 首跑：环境与版本预检”：在下载模型前针对该基线 Notebook 检查 NPU、PyTorch / torch_npu 配套、transformers 与 modelscope，并以实际创建 `npu:0` Tensor 作为首跑条件；结果未通过时明确引导安装缺少依赖、切换与 CANN / Driver 配套的 NPU 环境，或转到 HiDevLab。
- Qwen3 首跑预检节点不再复用普通课程的“视频—讲解—代码—练习”布局，改为专用本地决策面板：运行位置说明、四项首跑检查、可复制的本地脚本、三类结果分流。HiDevLab 仅作为本地 NPU / 版本无法调整时的替代环境，不能用于读取本机环境信息。
- 学习首页由 CANN 专属入口调整为昇腾学习入口：主 slogan 更新为“快速开始昇腾学习成长之旅”，首页引导与画像弹窗的用户可见 CANN 文案同步改为“昇腾”，但路径、文档及技术内容中的 CANN 名称保持不变。
- 学习视觉更新采用分阶段确认：第一阶段只重绘学习首页，参照 `CANN学习高保真离线标注` 的居中大 Hero、柔和暖紫蓝渐变、中央插画与悬浮输入条；页面顺序固定为 Hero → 典型场景 → 为你推荐 → 继续学习。路径详情和搜索 / 测验 / 知识图谱等交互状态待首页确认后再处理。
- 首页 Hero 背景不使用 CSS 近似渐变：直接复用离线标注导出的 `bg@4x.png` 与 `配图@4x.png`，分别作为完整背景和居中卡片插画，以保持标注稿的实际色彩与层次。
- 首页补齐标注稿的场景到任务交互：点击典型场景仅高亮场景并展开对应任务楼层（目标筛选、标签、成本/性能提示与开始学习入口），不再立即跳入路径；任务入口再进入生成路径或 Qwen3 固定路径。同步使用标注稿导出的五个场景图标，并将下方内容调整为“从系统化学习开始”的封面卡与“我的学习”的横向进度卡。
- 修复首页场景交互的内容顺序：`ld-scene-tasks` 任务楼层固定紧跟“从典型场景开始”区域，系统化学习推荐区始终排在任务楼层之后，不会插入两者中间。
- 首页右侧胶囊快捷入口按标注稿重排为“智能助手 → 学习分身 → 学习档案 → 随堂复习”；前两项直接使用标注稿导出的彩色球形智能助手图标与星光人形学习分身图标，分别唤起既有 AI 浮窗和学习分身浮窗。
- 移除首页 Hero 右上角旧“学习档案”按钮，学习档案仅保留在右侧胶囊入口，避免重复。
- 首页纵向间距统一：输入框所在 Hero 到“从典型场景开始”为 72px，场景卡与其展开的任务楼层保持 12px 紧贴关系，任务楼层与后续完整楼层、以及各普通楼层之间统一为 64px。
- 首页典型场景卡按标注稿重绘为整体白色容器内的独立子卡：卡片之间保留 8px 间隙，默认白底无分割线，选中项才使用浅紫圆角底与轻投影；图标、标题、说明统一左对齐，避免选中背景铺满整列。
- 学习首页整体底色改为标注稿中的冷浅灰 `#F5F6F8`；Hero 保持使用独立背景图，白色仅用于场景容器、任务面板和课程/进度卡片，文档页仍保持白色背景。
- 首页任务输入框补齐提交交互：非空文本才可提交，支持 Enter 与“生成路径”按钮，提交后显示生成状态并防止重复请求；涉及“在昇腾 NPU 上运行 Qwen3”的明确输入直接进入固定 Qwen3 路径，其余输入进入既有 AI 路径生成流程，且不会再次追问已明确的学习目标。
- 首页搜索框按标注稿的六态链路重做为居中浮层：聚焦后显示最近搜索、快速开始和热门课程；输入后显示路径匹配卡和搜索建议；“开始学习”进入对应路径；无明确目标时可进入 AI 测验，按“身份 → 目标 → 技术水平”三步收集信息，最后显示生成进度后调用既有路径生成。搜索中的 Qwen3/NPU/推理请求直接落到固定 Qwen3 路径。
- 搜索结果收敛为“固定路径 + 受控个性化编排”：Qwen3 与官方 Ascend C 编程显示固定名称并直达；训练、迁移、推理、性能、排障、基础入门等需求使用稳定领域标题，由 AI 仅从既有课程章节和实践节点中安排顺序，不以用户原话生成路径名称。模糊诉求不显示伪匹配路径，转为 AI 测验补充角色、目标与基础后再编排。
- 首页“从系统化学习开始”和“我的学习”分别按标注稿重绘：前者使用三列课程封面卡（浅色封面、分类/阶段标签、课程简介、文档元信息），后者使用横向学习进度卡（左侧封面摘要、中部进行中状态与进度条、右上继续学习），不再复用旧通用节点卡与图标块。
- 进一步隔离首页两类课程卡与旧版通用路径卡规则：系统化学习卡固定为更完整的三列封面阅读层级；我的学习卡固定为“左侧摘要封面 / 中部进度与下一步 / 右侧继续学习”三段布局，并补齐平板、手机的自适应排版。
- 系统化学习卡的封面不再使用同一套 CSS 几何渐变占位：按课程分类接入标注稿导出的模型迁移、模型推理、算子开发、模型训练插画，并保留与各类别对应的浅色封面底，保证三张课程卡的视觉内容可区分。
- “我的学习”卡进一步按标注稿的信息位置收敛：路径摘要缩窄为左侧信息块，状态/标题/下一步在中部，节点数与蓝色进度条独立右对齐，“继续学习”按钮贴最右；卡高由 142px 收紧为 118px，不再将进度条放在路径标题正下方。
- 进一步澄清并修正“我的学习”最下方楼层的左侧课程封面：它是卡内带留白的 92px 高独立封面（不贴满整张卡、不带右侧分割描边），复用标注稿原始背景纹理 `bg@4x.png`，再按当前路径叠加对应课程插画；不是上方系统化学习的三张卡封面。
- 根据尺寸反馈，将该“我的学习”卡的独立封面由 92px 放大为 112px、整卡由 118px 恢复到 136px；仍保留 12px 左右及上下留白，而非做成贴边满高封面。
- 修复典型场景任务楼层的学习成本/性能控制显示：标签文本与星级拆分，只有星级使用暖黄强调，标签恢复中性灰；任务卡的四列固定宽度改为可收缩网格和自适应列间距，避免在中等宽度时与最右“开始学习”按钮重叠。
- 根据用户提供首页全图重新校正课程封面：系统化学习与最下方“我的学习”均改为低对比、多层半透明几何的细腻纹理底；移除此前误加的场景插画。封面内部保留“分类 + 阶段”两枚胶囊和课程标题，文本直接叠在纹理上，与参考图一致。
- 封面“双胶囊”由两枚分离圆角标签修正为参考图的单一连接胶囊：外层为完整圆形轮廓，左段浅紫实色、右段中性浅灰，两段无间隙；系统化学习与“我的学习”复用同一结构。
- 首页 Hero 首屏性能优化：将原始 7680px / 2.6MB 背景 PNG 与 2312px / 851KB 插图 PNG 导出为按实际显示尺寸的 AVIF（20KB 与 25KB），CSS 切换至 AVIF，并在 head 中 preload 两项资源。原始 4x PNG 保留作为编辑源。
- 典型场景任务楼层的“开发目标 / 用户水平”筛选项改为可点击单选条件：可再次点击取消。选择后任务不被过滤隐藏，而是按目标、验证/可解释性、性能和新手/进阶/高级的关联词重新排序，首项显示“优先推荐”，楼层说明同步回显当前组合，便于用户理解筛选的影响。

### 2026-08-03（张宸梓访谈分析）

- 新增 `cann-dashboard/智能学习方案-张宸梓访谈分析.html`：基于 2026-08-02 两段逐字稿的 12 页单文件网页 PPT，保留整页翻页、页码 hash、概览、全屏和键盘控制。
- 报告按“研究证据 → 用户与旅程 → 设计判断 → 下一步验证”组织，纳入原声墙、单人画像、AI 辅助学习旅程、原型正负反馈、机会矩阵和目标学习闭环。
- 每页区分“受访者明确表达 / 设计推论 / 待验证假设”，明确本次样本为一位高经验、重度 AI 使用者，避免将其偏好直接外推为全体用户需求。
- 核心判断：学习方案不应重复 Agent 已擅长的搜索与生成，而应优先形成“场景任务 → 可运行实践 → 结果验证 → 上下文排障 → 最小复盘沉淀”的连续闭环；强提醒式学习分身与 IDE 插件暂不作为近期主线。
- 已以 1600×900 桌面视口逐页核验封面、VOC、画像、旅程、机会矩阵、闭环、验证计划和附录，修正目标闭环页长标题换行。
- 新增 `cann-dashboard/智能学习方案-原型测试访谈要点.html`：独立单页研究材料，不使用网页 PPT。仅收录已展示原型的正向验证、信息架构 / 画像问题及未进入原型的学习分身反馈；每条保留原声、逐字稿时间点和“可写结论”。AI 趋势、IDE 插件、昇腾知识库 / Skill 明确排除在此页之外，待后续按独立分类整理。

### 2026-08-03（张宸梓访谈五类重组）

- 新增 `cann-dashboard/智能学习方案-张宸梓五类访谈分析.html`：按用户指定的五类重新组织为独立的 11 页单文件网页 PPT，保留整页翻页、hash 页码、概览、全屏和键盘控制，不覆盖此前的 12 页版本。
- 五个章节固定为：用户信息、当前原型测试、未进入原型的设计评价、AI 趋势、IDE 相关；原型测试拆为“已验证价值”和“信息架构问题”，学习分身明确标注为单人概念反馈与待验证假设。
- 用户信息页直接采用 `report-ppt-skill` 的“用户画像·形式一”正式单人深描：左人物栏、标签 / 职责 / 原声，右侧工作方式、典型任务链路、核心关注点和痛点。
- AI 趋势与 IDE 分别单列：前者呈现“AI 压缩检索与生成，人转向验收、纠错与优化”及能力内化张力；后者明确受访者偏 CLI，IDE 插件须比现有 Agent 更快、更方便、更直观 / 可信才值得验证。
- 已通过本地桌面视口检查封面、目录、正式画像和学习分身页；页面根节点无横向溢出。暗页的底部光晕伪元素扩展自身 `scrollWidth`，但被页面 `overflow:hidden` 裁切，不影响实际展示。
- 根据反馈，将“设计评价（学习分身）”和“AI 趋势（人机分工）”从黑底设计点页改为灰底分析页：两页均改用标准 `head`、完整五类 `section-tabs`、结论 + 原声 + 设计含义的分析结构。黑底不再用于这两类访谈分析，避免将研究证据误写成方案展示。

### 2026-08-07（AI Coding 访谈提纲）

- 新增 `cann-dashboard/AI-Coding访谈提纲.html`：将宸梓访谈中的 AI Coding 关注点整理为独立横向结构图，按“真实任务 → AI 参与 → 人的介入 → 结果验收 → 学习影响 → 产品机会”展开。
- 图采用固定 SVG/D3 三列布局，而非 Mermaid 自动布局：左侧为研究目标，中间为六个主题，右侧为对应追问；主干统一中性灰，主题分支与问题节点共用同一高对比主题色，所有分叉只位于节点间留白，不穿过或超出卡片。
- 第六主题由“学习产品的 AI 机会”更名为“学习类产品的 AI 机会”，对应问题统一使用更宽泛的“学习类产品”表述。
- 页面、根节点和文件名统一去除“批量”表述，并移除左上角版本标记；原 `AI-Coding批量访谈提纲.html` 保留为跳转页，兼容已有链接。
- 右侧具体问题节点改为近白色底，仅以低透明度主题色描边和圆点关联所属主题；中间主题节点保留较清晰的浅色底，强化信息层级。
- 右侧问题节点进一步采用局部加粗：突出任务对象、关键动作、验收标准、失败恢复与产品价值，不把整句加粗，便于访谈员快速扫读。

### 2026-08-04（学习页刷新路由）

- 修复 `cann-website-v2.html#learn` 及 `#learn/<路径>` 刷新时回退到首页的问题：路由初始化现按 hash 首段识别页面，`learn/...` 会稳定恢复学习页；恢复时不再覆盖原 hash，Qwen3 路径详情等深链可保留并在学习工作区初始化后重新打开。
- 新增 `hashchange` 路由同步，浏览器前进 / 后退和手动修改 hash 后也会切换到相应页面；保留旧 `#ascend-c-demo` 链接的学习页兼容。
- 学习首页 Hero 背景按高保真参考收敛为大面积、低饱和的横向三色过渡：左奶油黄—中淡粉紫—右浅蓝；去除中心多层光晕，并用上层透明渐变在下半段自然收敛到页面底色。
- 学习首页直达不再自动弹出“个性化推荐”画像弹窗；首页只展示可浏览内容和搜索入口。用户在搜索中提出模糊诉求时，才通过“AI 测验”补充角色、目标与技术基础，再生成匹配路径。
- 路径详情的 AI 助手浮窗改用“学习上下文版”社区助手样式：顶部轻操作栏、彩色助手图标居中欢迎区、当前章节胶囊和快捷问题、底部固定输入框；首次提问后自动切换为对话消息流，保留原 Worker 问答和路径编辑逻辑。
- Qwen3 路径不再为每个节点伪造视频：仅概念导览、推理流程、模型加载、逐 token 推理、性能基线、RMSNorm 融合优化 6 节保留视频；其余阅读型节点直接进入讲解、代码和练习，无额外模式选择。视频侧的“内容解读 / 时间目录”暂不实现，先按参考图完成视频详情页的整体视觉对齐后再单独确认内容联动方案。

### 2026-08-06（路径详情视觉第一轮）

- 按 `155-8236.png` 的常规学习态推进路径详情视觉对齐，不改变节点内容或视频联动逻辑：保留既有浅灰到白色渐变及右侧纹理背景，课程元信息、标题、简介和 HiDevLab 行动收敛为轻量首屏层级。
- 视频统一为中等宽度的独立媒体卡；代码框改为浅色编辑器式容器；动手练习改为带蓝色编号与纵向连线的步骤流，右侧 HiDevLab 入口作为轻操作保留。路径侧栏同步收紧为浅灰背景、紧凑课程分组和蓝色当前节点状态。
- 右侧工具仍遵循现有按需 FAB / 浮窗机制；本轮只微调其浮窗尺寸和边界，不将知识图谱或助手嵌回正文，也不新增“视频对应内容”。
- Qwen3 路径的动手练习由单个泛化入口改为章节内的 3 步任务流：预检（依赖→NPU/版本→NPU Tensor）、下载（目录→下载→完整性）、加载（Tokenizer→Eager 模型→NPU/FP16/eval）、Tokenizer（编码→解码→token 数比较）、推理（构造输入→生成→解码）、性能（固定条件→热身→三次计时）、融合（保存原实现→替换→冒烟）、验证（公平输入→三次对比→加速比）及后续实验收口。每步附具体代码和预期结果，可独立送入 HiDevLab Notebook。

### 2026-08-06（学习页面拆分）

- 将学习 Demo 按职责拆为两个独立入口：`learn-home.html` 仅维护学习首页（Hero、搜索、典型场景、系统化学习和我的学习），`learn-path.html` 仅维护路径详情（学习侧栏、正文、工具 FAB / 浮窗和 HiDevLab）。原 `cann-website-v2.html` 保留为整站兼容入口，不强制迁移既有 `#learn` 链接。
- 新增 `learn-standalone.js` 作为独立页胶水层；两个页面继续共用 `cann-app.js` 的学习数据、内容渲染和实验逻辑，以及 `cann-website-v2.css` 的视觉 token，避免复制节点数据和样式。
- 首页卡片、搜索结果和“我的学习”会跳转到 `learn-path.html?path=<id>`；从路径详情返回则回到 `learn-home.html`。指定单节点可用 `learn-path.html?node=<节点名>` 打开。
- 路径独立页保留 Qwen3 的 17 节节点内容、右侧 AI / 知识图谱 / 随堂测验三枚 FAB、可调高度的工具浮窗，以及动手练习把代码送入 HiDevLab 的行为；已在本地 HTTP 页面实际验证首页加载、Qwen3 跳转、工具浮窗、HiDevLab 和返回首页，未发现页面脚本错误。

### 2026-08-11（路径实践入口收敛）

- 移除学习正文标题简介后的重复“在 HiDevLab 实践”入口，避免与章节内“动手练习”产生两处并列入口。
- 在路径顶栏右侧加入主行动“开始实践”；它始终对应当前学习节点，优先把该节点的第一个分步练习及预期结果送入 HiDevLab。没有分步练习时，打开该节点的代码示例。

### 2026-08-11（首页 Hero 插画兼容）

- 本地浏览器未能稳定解码首页 Hero 的 AVIF 插画，导致仅剩标题、渐变和搜索框。Hero 插画恢复使用已验证可显示的原始 `配图@4x.png`，并同步改为 PNG 预加载；背景渐变保持不变。

### 2026-08-11（实践按钮位置）

- 路径顶栏的“开始实践”移动到学习进度文字之后，紧贴进度信息；视觉改为白底、浅灰描边的次级按钮。全量课程与学习档案继续固定在顶栏最右侧。

### 2026-08-11（分屏工具与顶栏修复）

- 修复知识图谱浮窗仍露出 AI 助手欢迎区：AI 面板的视觉规则仅在自身 `.active` 时生效，工具 FAB 切换后只显示当前对应面板。
- HiDevLab 右侧分屏打开时，学习页承接顶栏右半段的背景统一为白色，使课程顶栏与笔记本上方成为连续的白色工作栏。

### 2026-08-12（Qwen3 视频与实践流）

- Qwen3 路径固定区分两类节点：6 个有视频节点采用“视频 → 对应讲解 → 对应练习”的阅读顺序；无视频节点不展示空视频位，直接采用讲解、代码、分步练习、排障与资源的连续学习流。
- 补齐此前退回单一泛化入口的四个前置节点的 3 步动手练习：推理闭环、token 生成循环、PyTorch Tensor / batch 输入、torch_npu NPU 迁移与同设备计算。
- 移除动手练习的全局单项兜底：没有真实操作任务的节点不再显示“运行配套练习”占位。

### 2026-08-12（学习快捷入口收敛）

- 右侧快捷入口按页面上下文切换：首页胶囊保留 AI 助手、学习分身、学习档案和错题本；课程详情页隐藏首页胶囊，使用同一位置的课程胶囊提供 AI 助手、知识图谱和随堂出题，移除二者重叠。
- 移除课程顶栏重复的“学习档案”入口，右侧胶囊成为唯一快捷入口。
- 学习档案、学习全景图和错题本复用原有数据面板，但按对应入口以独立右侧小浮窗打开；隐藏旧的 Tab 切换栏，不再以抽屉形式混合呈现。

### 2026-08-12（视频内容联动）

- Qwen3 路径中带视频的节点改为纵向学习流：视频在上、时间章节紧随其下，再进入正文、代码与动手练习；不采用左右对照布局。
- 每个视频时间点已关联本节点的具体讲解段、代码示例或动手练习步骤；选择时间点会高亮并定位对应内容。
- 动手练习统一使用步骤序号，移除了会将序号替换为终端图标的视觉脚本。
- 视频节点的下半部分进一步收敛为“当前视频段内容”单一面板：切换章节时直接替换本段讲解、关键知识点、相关代码和对应的一项练习，不再保留整节长内容供定位。当前为演示播放器，播放按钮按章节顺序切换；接入真实视频后可直接由播放进度触发同一切换逻辑。
- 视频播放器与视频章节导航在桌面端改为左右并排；当前视频段内容仍位于其下方，小屏自动回落为上下布局。
- 动手练习中的“在 HiDevLab 运行”操作默认隐藏，仅在悬浮或键盘聚焦到对应步骤时在右侧出现，避免连续步骤中重复按钮干扰阅读。
- 首页和课程详情页的 AI 助手入口统一使用同一枚彩色“智能助手”图标；知识图谱与随堂出题仍保持各自的线性图标。
- 彩色智能助手与学习分身 PNG 自带四周各 25% 的透明留白；胶囊快捷入口图片盒由 40px 微调为 36px，对应约 18px 的实际彩色图形，和下方线性图标保持接近；课程详情页同步处理。
- 首页典型场景配图由 28px 调至 40px 图片盒（源图有效内容约占 70–85%，实际视觉约 30px），场景卡最低高度同步增至 120px，保持图文呼吸感。
- 从学习详情的“开始实践”、节点代码运行或任一步动手练习打开 HiDevLab 时，统一在打开后切换至右侧分屏；独立路径页的默认停靠方式同步为右侧分屏，避免初始化回落为底部抽屉。

### 2026-08-13（代码示例归入练习步骤）

- 有分步动手练习的节点，可运行代码不再以独立“代码示例”区重复呈现；代码、预期输出、复制和 HiDevLab 运行均收进用户点开的对应步骤。
- 纯概念代码仍保留为独立代码示例，避免将仅用于解释 API 的片段伪装成可执行任务。
- 视频章节若关联某步练习，当前视频段内容同样展示该步骤自身的代码和预期结果；不再额外复制节点级“对应代码”。

### 2026-08-14（昇腾社区体验改进汇报材料）

- 新增 `ascend-community-progress.html`：按 16:9 网页翻页材料组织昇腾社区近期进展、学习 Demo 三项设计点（渐进式路线、动态知识图谱、边学边练），以及独立的 AI 可用性研究结论与行动方向。
- AI 可用性部分引用 `ascend-vs-nvidia-ux/reports/synthesis/index.html` 的首轮研究：26 个对照任务、11 项指标、7 个内容可用性问题；与学习 Demo 是两条独立工作线，不将其表述为 Demo 的后续评估。
- 汇报材料将“学习路线渐进式呈现”拆为两页：视频节点采用“视频章节 → 当前视频段内容 → 对应练习”的同步替换；无视频节点采用“讲解 → 概念 → 分步练习 → 排障/资源”的流式阅读，不制造空视频位。
- AI 可用性研究在汇报中按两条方法线拆分：AI 可用性矩阵用于识别内容资产的短板与优先级；开发者侧基础体验研究通过模拟真实用户旅程、触点取证及 NVIDIA 对照，定位官网使用过程的硬阻断与长板。
- 汇报材料的每个学习 Demo 设计点页由 3 条扩展为 6 条：在有视频、无视频流式、知识图谱和边学边练四类页面中，分别补充触发边界、信息稳定性、状态/定位、完成标准与操作分工等细节。

### 2026-08-14（动手练习步骤节点）

- 路径详情的动手练习步骤节点对齐参考样式：30px 蓝色圆角编号方块、细灰蓝纵向连接线；编号作为时间线标记，不再呈现为普通文字或按钮样式。

### 2026-08-14（视频段内容对齐）

- 视频章节下方的“当前视频段内容”收为单一阅读卡：统一头部、说明与正文的左右内边距，移除讲解区逐段重复的横向分隔线；仅在进入知识点、练习或代码等新模块时保留一条有语义的分隔。
- 当前视频段头部的时间标签改为相对右侧“状态标签 + 标题”内容组垂直居中，不再与内容组顶部对齐。
- “关键知识点”由贯穿式左描边与大面积空白改为紧凑浅蓝信息卡；仅在概念内容自身周围形成边界，和上方讲解区分离但不重复画横线。
- 页面沿用“左侧进展栏 + 右侧内容区”模板；提供翻页、页码深链、键盘操作、缩略总览与全屏查看，便于直接用于汇报。

### 2026-08-14（全屏稳定性）

- 修复 `cann-website-v2.html` 在 F11 全屏切换时的持续闪烁：将连续 `resize` 事件合并为每帧一次的尺寸同步，并在浮动路径按钮坐标未变化时跳过样式写回，避免浏览器在全屏过渡期间反复触发布局和重绘。

### 2026-08-14（实践交互汇报文案）

- 重写 `ascend-community-progress.html` 中“边学边练的实践交互”页：以“解释 → 最小可运行案例 → 预期输出验证 → 云端首跑 → 本地迁移”为主线，明确 HiDevLab 用于降低首次运行阻断，章节指引用于承接依赖、版本、命令和验证结果到本地开发；补齐共六项设计点。
- 在该页六项设计点中补充“将常见错误码接入当前步骤的排查路径”：首跑失败时，围绕当前代码直接提供报错原因、环境检查命令与修复顺序，避免用户离开页面重新搜索。

### 2026-08-14（动手练习代码元信息）

- 动手练习展开后的 `Python · 第 N 步` 不再放在代码工具栏中以胶囊形式呈现；改为“本步代码”下方的浅灰说明文字，工具栏只保留复制与 HiDevLab 运行操作。普通流式练习和视频关联练习同步采用此结构。

### 2026-08-17（昇腾社区 AI 时代研究策略草案）

- 基于内部访谈诉求，形成待验证研究命题：在 CANN 与 Mind 系列开源、知识分散在 GitCode、CSDN、官方站及大模型入口后，开发者从“查资料”转向“完成可验证任务”；昇腾社区的潜在定位由内容/工单承载转为“可信的任务完成网络”。
- 建议按互斥主旅程研究四类开发者：首次跑通者、AI 应用交付者、迁移与集成者、生态贡献与维护者；大模型是贯穿触点，而非独立用户角色。
- 研究将先界定昇腾社区、GitCode、文档、HiDevLab、CSDN 与工单等边界，再做当前旅程取证、任务可用性测试、服务蓝图与机会优先级；正式启动前需确认主 URL、各入口责任边界、可用行为数据与研究对象范围。
- 用户明确下一阶段以 AI 实跑为主：采用“双轨”测试——开发者直接完成任务的浏览器旅程，以及大模型检索/引用/生成答案的知识可用性旅程；每次运行保留问题原文、模型/日期、步骤轨迹、URL/截图、来源、产出、失败和人工复核结论，支持后续量化与复跑对比。

### 2026-08-17（Ascend C 算子开发 AI 实跑·首轮）

- 用户确认以“Ascend C 自定义算子从零开发”为第一条主线，研究边界包含站外触点，并加入 CUDA / NVIDIA 同任务对照；Builtin 定制与编译/精度排障作为后续分支而非首轮并列场景。
- 新增 `cann-dashboard/operator-ai-journey-research/`：`index.html` 为首轮 HTML 报告，`run-log.md` 为可复核运行日志，`evidence/` 保存 4 张公开页面实测截图。
- 真实任务锚点为官方 GitCode `CANN/asc-devkit` 9.0.0 的 Add 直调样例；AI 实测跑过昇腾算子开发场景页、CANN Ascend C 文档入口、该 GitCode 样例，以及 CUDA 13.3 `Intro to CUDA C++` 的 `vecAdd` 对照。
- 初步结论严格限定为知识路径：昇腾官方已有从入门到调试的场景旅程与完整样例，但最小闭环需在官方文档与 GitCode 间编排；CUDA 对照将概念、代码与验证连续放在一个文档中。报告将论坛/Issue 未获取到真实报错案例记为“证据待补”，不据此推断社区无案例。
- 当前设备未接入版本匹配的 NPU/CANN 环境，因此未实际运行 `cmake` / `make` / `./add`，不声称精度已验证；报告内置下一轮 NPU 复跑清单（记录环境、日志、失败与修复链路）并计划由真实 stderr 驱动排障支线。

### 2026-08-17（AI 时代社区价值研究·重跑扩展版）

- 用户指出首轮报告过窄，仅描述算子样例，未充分回答开源 + 大模型背景下用户旅程变化、社区未来价值、用户吸引与体验设计；已按“多触点资产分布 → AI 协作旅程 → 社区定位/机会 → 可验证研究策略”重跑并重构报告。
- `cann-dashboard/operator-ai-journey-research/index.html` 已升级为完整研究报告；首轮窄报告另保留为 `index-round1.html` 便于追溯。
- 新增公开实测证据：GitCode `cann/community`（治理、SIG、Issue/PR、会议、邮件、发布流程及仓库智能体入口）、`cann-learning-hub`（quick_start/tutorials/reference_practice 与 155 Issues/160 PR 页面状态）、MindSpore API 文档，以及 CSDN 对“Ascend C 自定义算子”的搜索页（页面显示约 13,316 个结果）。截图保存为 `evidence/05–09`。
- 核心策略判断改为“社区是可信任务完成网络”：不是集中复制所有内容，而是在任务层路由 GitCode、文档、Mind 系列、站外经验与 AI，提供适用范围/版本/硬件/来源/验证状态、首跑与诊断闭环，以及完成后的低摩擦贡献回流。
- 报告明确列出：AI 使发现、判断、执行、排障、沉淀重新分配；社区价值指标应从单纯 PV 转向权威引用被采用、任务完成率、首次成功时间、失败恢复率、贡献回流率及答案—验证一致率。以上体验收益均标为待用 NPU 真机与开发者回放验证的假设，而非既定结果。

### 2026-08-17（研究报告的选择性可视化增强）

- 用户明确不将整份长篇 HTML 硬套为网页 PPT；保持现有报告阅读结构，仅选择内容真正匹配的 `report-ppt-skill` 组件增强表达。
- `operator-ai-journey-research/index.html` 的机会优先级区采用 2×2 bento 便利贴矩阵：横轴为既有资产/机制基础、纵轴为任务完成影响；语义校验后将“任务包 + 首跑诊断”置于右上“优先验证”。
- 证据截图区采用“证据聚光灯”交互：保留六张截图总览，支持手动点击编号或卡片聚焦；非当前证据淡化，并在邻近说明卡内展示该证据支持的研究判断。全程不自动播放。
- 保留现有生态关系图、五阶段旅程图、体验 Demo 和研究策略阶段结构，避免因模板替换损失信息匹配度。桌面预览已确认无横向溢出、6 张证据图均正常加载，聚光灯点击状态正确切换。

### 2026-08-17（AI 时代社区研究报告·问题导向重构）

- 用户否定了此前“为可视化套模板”的方向，明确要求所有结构服务于回答：开源 + AI 后旅程如何变化、社区价值/定位/机会是什么、如何吸引用户、体验如何设计；不再以算子开发或视觉组件作为主叙事。
- `cann-dashboard/operator-ai-journey-research/index.html` 已完全重写为宏观研究报告，并移除旧的便利贴机会矩阵、证据聚光灯、任务包 Demo 等容易造成局部化叙事的内容。
- 新结构按“直接回答 → 旅程变化 → 开发者 × AI 生命周期 → 社区定位 → 增长与体验原则 → Ascend C 验证切片 → 研究验证策略”组织；算子开发被明确降级为检验高复杂任务的压力测试，不外推为社区战略全貌。
- 核心社区定位升级为“可信协作层”：文档负责权威说明、GitCode 负责代码协作、站外渠道负责扩散、AI 负责交互生成；社区负责让它们在任务中可判断、可执行、可追责，并通过可发现 / 可信任 / 可协作三层能力落地。
- 增长模型从 PV 转向“获客—激活—留存—共创”价值循环，分别定义任务入口覆盖、首次成功时间、问题恢复率、已验证资产复用率、结果回流/贡献采纳等待采集指标；体验原则归纳为任务先于目录、证据先于结论、上下文不断流、渐进披露、完成即可回流。
- 页面已用桌面浏览器验证：7 个章节、3 张证据图均加载、无横向溢出；生命周期图 5 个阶段与 4 类责任行完整呈现。公开资产事实、战略假设和待验证项在内容中明确分层。

### 2026-08-17（真实用户案例补跑 + 冷灰研究档案视觉）

- 用户要求报告不应只保留推断或把真实分析留作“下一步”；改为实际搜集公开、可追溯的开发者使用案例，并将其作为分析主体之一。
- 新增 `operator-ai-journey-research/evidence/cases/`：保存公开 GitHub API 响应与评论快照。补跑并收录 Ascend/pytorch #148（910B Qwen3-ASR 微调的 TransData 编译失败，用户后报切换 910B2/升级 CANN 与 torch_npu 后解决）、#106（源码编译缺少配置文件，回复回链推荐环境/官方安装文档）、#154（多 NPU GPT torch.compile 超时，GitCode 方案后 1.5B 仍未闭环）、Ascend/MindIE-LLM #1（PD 分离部署→K8s 文档路由）和 MindSpore #402（携带完整环境/输入/预期的精度 Issue）。
- 报告新增“真实用户案例”章节，以任务 → 上下文 → 支持 / 状态 → 洞察的证据链呈现；生命周期章节改为由真实案例归纳，并清楚限定案例不等于样本量统计或满意度结论。
- 真实案例得出可落地的观察：用户从项目目标/错误进入，不从产品树进入；有效支持依赖模型、硬件、CANN、框架、分支、最小复现与已尝试动作；“有方案”不等于完成，任务需表达规模/版本条件与未解状态；大模型部署支持应以部署目标路由。
- 页面视觉切换为冷灰研究档案：冷灰背景、白卡、墨色正文；绿色仅代表已验证/可继续，橙色代表待关注，红色代表风险/未闭环，移除蓝紫渐变装饰性风格。桌面检查确认 4 张真实案例卡、3 张证据图正常加载且无横向溢出。

### 2026-08-17（深灰低饱和研究档案）

- 用户进一步指定整体需为接近黑色、略带蓝调的低饱和深灰；只允许页面最顶部保留渐变，其他区域不可使用渐变。
- `operator-ai-journey-research/index.html` 已改为深灰页面、深浅灰信息卡、冷灰文字层级；Hero 使用唯一的墨蓝灰渐变。页面内其他原有渐变（摘要首卡、阶段卡等）均改为纯色。
- 绿色只表示可继续/已验证，橙色只表示待关注，红色只表示风险/未闭环；并调整案例、旅程、研究状态、来源链接和证据图的暗色对比。
- 浏览器检查：`body` 为 `#111417`；全页仅 `.hero` 有 `background-image` 渐变；3 张证据图均加载，桌面宽度无横向溢出。

### 2026-08-17（主题色纠正：亮底 + 近黑蓝灰）

- 用户澄清“深灰”指主题色而非全页背景：原浅灰背景不好看，但页面仍应保持明亮阅读底。
- 页面已改为冷白亮底（`#fdfefe`）与白色信息卡；近黑、低饱和蓝灰用于标题、导航、深色重点模块和分隔层级。
- Hero 保留唯一墨蓝灰渐变；全页除 `.hero` 外无任何 `background-image` 渐变。绿色、橙色、红色仍只表达已验证/可继续、待关注、风险或未闭环。
- 浏览器检查：桌面无横向溢出、证据图均正常加载、Hero 是唯一渐变元素。

### 2026-08-17（黑色主题收敛 + 语义图标）

- 用户要求主题色进一步接近黑色；页面继续保持亮白研究画布，不改为整页深色模式。新增最终黑色主题覆盖：正文主色、标题、结构线、流程箭头、Hero 深色锚点收敛到 `#111417`，绿色/橙色/红色仍只表达状态。
- 报告选择性加入 Lucide 线性图标：核心问题、传统/当前旅程、旅程迁移点、真实案例任务链、社区三层能力、获客—激活—留存—共创、五项体验原则、五段服务链。图标服务于“阶段 / 能力 / 动作”的快速识别，没有给普通段落和所有标题堆图标。
- 使用 Lucide UMD CDN 初始化，统一 `stroke-width:1.8`；兼容性处理将 `map-pin-question` 替换为 `map-pin`。通过本地 HTTP 预览实测：43 个 SVG 图标全部渲染、无残留 `data-lucide`、桌面 1280px 无横向溢出，Hero 仍为唯一渐变。

### 2026-08-17（报告叙事收紧 + Ascend C 任务链分析）

- 用户要求删除大量“为什么这样做 / 这不是什么 / 下一步再做”的解释性旁白；报告统一改为直接陈述研究动作、观察、分析与结论。
- Hero、核心问题、旅程变化、真实案例、生命周期、社区定位、增长和体验原则的标题与导语已收紧；保留必要的公开案例记录说明和待补数据清单，但不再以方法论辩护口吻呈现。
- 原“为什么以 Ascend C 算子开发起跑”章节改名为“Ascend C 算子开发：任务链分析”。新增图文任务链：发现任务 → 选择路径 → 执行编译 → 失败恢复 → 结果回流；每步带资产/状态标记，图下直接给出三条分析结论：跨资产选择与版本匹配是首个判断点、失败恢复仍依赖人工拼接上下文、社区优先建设任务路由/上下文携带/结果回流。
- 本地 HTTP 浏览器实测：亮白画布、黑色主题 Hero 保持不变；48 个 Lucide SVG 正常渲染、无未处理图标、任务链 5 步与 3 条结论完整呈现、1280px 无横向溢出。

### 2026-08-18（全量证据补跑：案例库、LLM旅程、AI对照、服务设计）

- 用户要求将此前建议的所有扩充项在同一轮完整补齐；本轮使用 `ai-usability-benchmark`（CANN vs CUDA 的任务级 AI 检索评测）与 `user-journey-skill`（阶段—触点—行为—痛点—机会逐列映射）完成研究，并以公开可复核证据落库。
- 公开案例从 5 个扩到 15 个：新增抓取 Ascend/pytorch #163、#147、#133、#153、#144、#125、#149，以及 Ascend/torchair #4、#2、#1 的 Issue / 评论 API 快照，存入 `operator-ai-journey-research/evidence/cases-extended/`；统一编码文件为 `evidence/case-corpus-20260818.json`。样本按应用交付、构建与兼容、正确性与性能三类任务各 5 个可视化呈现。
- 新增“大模型应用旅程”：定义目标 → 选型与配套 → 首个可运行结果 → 排障与扩展 → 交付与回流；每阶段关联 MindIE、Qwen 微调 / 推理、多 NPU GPT、ATC 精度等案例和可观察断点。
- 完成 3 个 CANN × CUDA 对等 AI 检索任务：A 自定义 Add 算子、B ONNX 模型转换、C 性能分析。原始问句、URL、过程、边界记录在 `evidence/ai-usability/ai-usability-run-20260818.md`；Python 评分脚本与 JSON 结果同目录。CANN ⑪综合置信度为 0.768 / 0.741 / 0.741（均“中高”），CUDA 为 1.000 / 0.962 / 1.000（“高”）。本轮差距集中在从官方概览页获得版本锁定、最小命令、验证信号与恢复路径，不是官方入口可发现性。
- 新增“生态职责—任务会话”服务设计：文档、GitCode、站外经验、AI、社区分工；任务会话包含任务简报、可信路径、可验证执行、带上下文升级、结果回流，字段含硬件、CANN / 框架版本、分支、容器、最小复现、日志、预期输出、验证和规模条件。案例反推 P0 为版本 / 硬件匹配与日志 / 复现携带。
- 页面本地浏览器实测：12 个主章节、15案例统计、5步 LLM 旅程、3行 AI 对照矩阵、5个生态职责节点、5步任务会话、5步算子任务链均存在；63 个 Lucide SVG 正常渲染、没有残留图标占位、1280px 无横向溢出。
- 补充修复：初次保存的扩展案例快照文件名带空格且内容为空，已重新抓取为 `Ascend-pytorch-<id>.json` / `Ascend-torchair-<id>.json` 及对应 `-comments.json`；10 个 Issue 与 10 个评论响应均通过 JSON 解析，零空文件。

### 2026-08-18（CANN × CUDA 开发者旅程对比）

- 用户指出已有 AI 检索评分矩阵不等于足够直观的 CUDA 对比；新增独立“同一开发任务下，CANN 与 CUDA 的旅程差异”章节。
- 用共同目标“模型 / ONNX 任务转为可部署、可验证结果”串联五阶段：发现入口、选择版本与路径、获得首跑步骤、失败恢复、回流与复用；每一阶段将 CANN / 昇腾与 CUDA / NVIDIA 触点、可观察差异并列。
- 新对比复用本轮实测来源：CANN 场景 / ATC / Profiling / GitCode、CUDA Quick Start / CUDA Programming Guide / TensorRT Quick Start / Nsight Systems User Guide，另验证 NVIDIA Developer Forums 为公开讨论入口。对 CUDA 未采集等量 Issue 语料的地方明确不作恢复率数值对比。
- 新结论：两侧官方入口均可一轮到达；CANN 的首跑知识更常跨场景页、文档、GitCode 和站外经验拼接，CUDA 本轮更多在连续官方正文中承接。社区机会是把 CANN 的多源资产编排为可执行、可验证、可恢复的任务路径，而非复制内容规模。

### 2026-08-18（报告图文证据增强）

- 用户要求仅在截图真正支撑论证时补图，不为装饰而堆砌图标或模板；`operator-ai-journey-research/index.html` 因此新增三处定向图文模块。
- “旅程变化”补入官方算子场景、GitCode Add 样例、CSDN 搜索三张已有实测截图，分别说明任务边界、可运行资产与站外经验如何分散在不同触点；截图均可点击查看原图。
- AI 评测后新增 CANN Add 样例与 CUDA vecAdd 官方指南的并列页面证据，直接支撑“CANN 需要跨入口拼接、CUDA 本轮在连续官方正文中承接”的结论，不以截图取代评分或案例证据。
- “任务会话”新增克制的 HTML 界面示例：任务简报、环境/状态、待补信息、可信路径、验证状态和失败升级同屏出现，用于具体化“上下文不断流”的服务机制；它明确标为示例，未伪装为真实产品截图。
- 新模块复用亮白、近黑蓝灰、绿色/橙色状态语义；窄屏自动单列，避免在小屏强塞截图卡。

### 2026-08-18（截图证据重做：可读裁切 + 图内标注）

- 用户指出首次加入的长页面截图被 `object-fit: cover` 放大裁切，图中无法读取有效信息；同时仅靠图下说明不能明确“截图里到底在证明什么”。
- 新增 `operator-ai-journey-research/evidence/crops/`，从原始实测页面制作 4 张可读裁切：算子场景的三条开发路径与用户旅程矩阵、GitCode 的版本/样例/构建文件、CSDN 的站外搜索结果、CUDA 的 NVCC / Kernels 连续章节；保留原始截图，裁切图仅用于报告内阅读。
- 旅程变化和 CANN × CUDA 对照中的截图均改用裁切图，并在图内增加带编号的看点标签和箭头；图下说明逐一对应标号，明确证据如何支撑“入口选择”“仓内资产”“站外经验分散”“CUDA 连续正文”等结论。
- 修复截图 `<a>` 容器没有 `display:block` 的布局问题；截图卡改为更高的可读视窗。任何无法成为清晰证据的长图不再原样塞入卡片。

### 2026-08-18（传统社区 × AI 时代用户旅程对比）

- 用户要求使用 `report-ppt-skill` 的用户旅程模板重画“旅程变化”，并指出原先只写“现在”的摘要卡无法看出重点。按该 skill 的选件路由，旅程主体使用其指定的 `user-journey-skill` 六行结构，而没有将整份研究报告强行改为 PPT deck。
- `operator-ai-journey-research/index.html` 的原“过去 / 现在”文字对照卡已替换为两张同构旅程图：传统社区资料旅程、AI 广泛使用后的任务旅程。每张均固定呈现阶段、触点、行为 mini UI、情绪、痛点 / 新增断点、社区价值 / 新职责，确保逐阶段可比较。
- 两图均使用四个连续阶段；传统：进入社区→查阅与理解→求助与等待→采纳与复用；AI：提出任务→AI 生成路径→执行并核验→恢复并回流。情绪曲线按格绘制且每一张图的相邻格边界连续。
- 新结论条明确对比：过去的主要摩擦是找内容、理解内容；AI 时代的主要风险是候选路径能否在当前版本、硬件和项目中验证，并在失败后持续恢复。社区的新职责逐格落为任务发现、可信路径、可验证执行、上下文升级和结果回流。

### 2026-08-18（用户旅程合并：传统 × 开发者 AI 生命周期）

- 用户澄清：原意是以既有“开发者 × AI 生命周期”为主体，再补一张传统旅程，而不是在前后放置两套相似的 AI 旅程。
- 删除独立的 `#life` 生命周期矩阵，避免报告出现“传统 / AI 任务旅程”与“开发者 × AI 生命周期”三张重叠图。
- `#change` 中的两张用户旅程改为共用原生命周期的 S0–S4 五阶段轴：发现与评估、定向与选择、首个真实结果、交付与扩展、共创与影响；上图为传统开发者生命周期，下图为开发者 × AI 生命周期。两个图仍保留触点、行为、情绪、痛点与社区角色的逐阶段对比。
- 原“大模型应用旅程”更名为“大模型应用案例切片”，明确其用途是为开发者 × AI 生命周期的 S0–S4 提供 MindIE、Qwen、多 NPU GPT、ATC 等真实案例证据，而不是第三条并列用户旅程；顶栏入口同步改为“大模型案例”。

### 2026-08-18（未来服务协同模式：知识 × 问题）

- 领导新指导要求以“未来用户工作流只剩知识和问题”为重点，回答 AI 可发现性 / 使用可信、问题状态 / 解决，以及 AI 工具与未来服务能力的协同和成本。检查既有报告后确认：可信路径、任务会话与上下文升级已有局部回答，但没有形成完整模式。
- 新增 `#future-model` 章节并在顶栏增加“协同模式”入口。章节先定义两个工作对象：知识（来源、版本、适用范围、验证记录、维护责任）与问题（任务、环境、日志、已尝试动作、状态、未解条件与影响）。
- 第一问用“被发现→被引用→被验证”可信路径说明 AI 可发现性和使用可信：不以入口可达为终点，必须输出来源、版本 / 硬件范围、最小步骤、预期输出和验证记录；与本轮 AI 实测中版本锁定、最小命令、验证信号的差距对应。
- 第二问新增五态问题生命周期：已提出→正在诊断→等待验证→已验证解决→未解 / 部分解，明确将 #154 所示的规模条件和未解分支纳入状态，而非隐藏在评论中。
- 第三问新增 AI—任务会话—服务 / 工具协同图与三层成本账本：AI 负责低成本理解、检索、结构化和陪跑；产品化服务承担知识元数据、状态与跨触点上下文；真机 / CI、专家、版本修复和治理属于高成本、只在高风险高价值节点介入的责任层。明确未来产品不是“社区 + 聊天机器人”或简单 MCP / Skill 包装，而是以任务会话联结三层投入的协同服务。金额和效率数值尚无实测，故以投入层级、应量指标和待验证经营假设呈现，不伪造成本结论。

### 2026-08-18（协同模式布局修复）

- “服务与工具的高价值层”卡片误用了页面既有的通用 `.service` 类；该类是增长章节的五列服务链布局，因此污染了协同模型右侧卡片并造成内容错位。
- 协同卡改用隔离的 `.service-lane` 类，并为 `.collab-lane` 补充 `min-width: 0`，恢复 AI — 任务会话 — 服务工具三列的正常布局，同时避免长内容撑破栅格。

### 2026-08-18（AI 时代社区角色 → 服务方案）

- 用户澄清“协同模式”楼层的主题必须仍是“社区在 AI 时代的新角色与价值”，不能被服务体系方案取代；原“未来工作流只管理两类对象”标题不再直接复述内部输入。
- 楼层标题改为“社区在 AI 时代的新角色：让开发任务可信地持续推进”，先给出价值判断：社区的不可替代性是可信边界、执行验证和责任闭环；“可信知识 / 可接续问题”改表述为社区需沉淀的两类能力资产。
- 在价值判断之后新增从角色到方案的开发任务服务闭环：任务简报→可信路径→执行验证→带上下文升级→结果回流。以 Ascend C Add 首跑为可落地试点；开发者可从对话、搜索、文档、IDE、命令行或自动化代理进入，由任务会话承接同一上下文。
- 明确 AI / Agent、连接与自动化、社区服务的责任边界：API、MCP、Skill、插件和脚本只是连接执行现场的多种实现手段，不应成为方案主语或用户需要挑选的服务目录；社区最终交付的是可信、可恢复、可复用的任务结果。

### 2026-08-18（报告楼层逻辑与研究规划恢复）

- 用户指出报告整体楼层顺序不顺，并要求保留以“后续怎么做用户研究”为主题的收尾规划。采用“事实与证据 → 判断 → 社区角色与方案 → 验证”作为报告叙事结构，不以增加新楼层解决问题。
- 主文通过 flex order 重排：直接回答 → 传统 / AI 旅程 → 公开案例与案例样本 → Ascend C 算子任务切片 → 大模型案例 → CANN × CUDA 对照 → 社区定位 → 增长体验 → 资产协作设计 → AI 时代社区角色与服务方案 → 下一阶段研究。算子切片从策略段移入证据段。
- 导航收敛为旅程变化、真实案例、案例样本、AI 对照、定位判断、角色与方案、后续研究；章节编号同步为 01–13，避免旧版 04 / 05 / 06 / 08 重复导致阅读失序。
- 末层改名为“下一阶段研究：验证‘社区能否真正推进任务’”，新增三波研究路线：补齐真实任务证据 → 检验任务会话原型 → 建立任务漏斗与问题状态的持续运营证据；保留原有研究问题表、第一阶段动作和研究治理原则。

### 2026-08-18（楼层职责再校正：核心角色层聚焦）

- 用户要求先审视每一层究竟在说什么，确保叙事逻辑顺畅，不因指出重复就草率删除内容。报告的主线明确为：旅程变化与公开证据 → 算子 / 大模型 / CUDA 对照 → 生态资产分工事实 → 价值空间判断 → **AI 时代社区新角色与服务方案（核心）** → 增长结果 → 后续研究验证。
- “生态资产分工”保留，但限定为现状 / 约束层：说明文档、GitCode、站外经验、AI 与现有社区底座各自承载什么，论证未来不应将内容重新收拢为单一站点；移除其中重复的任务会话、字段与 Demo。
- “价值空间判断”限定回答生态资产之间缺什么（判断、验证、协作）；“社区在 AI 时代的新角色”是唯一承接完整定位、可信知识、问题状态、AI—服务协同、投入分层及服务闭环的核心方案层。
- Ascend C Add 首跑 Demo 移入核心角色层，新增明确导语：它是可信知识、问题状态、执行验证与失败升级如何在一个真实任务中被产品化呈现的示例，非独立 AI 助手概念。
- “增长闭环”保留为核心方案的结果层：解释可信任务推进如何带来获客、激活、留存与共创；移除与方案层重复的五步服务链，体验原则更名为“让增长发生的体验要求”。

### 2026-08-18（Agent 能力承载架构：不以 Skill / MCP 为终点）

- 用户要求分析社区 / GitCode 等知识内容应分别做成什么 AI 能力载体，明确不能只围绕 Skill、MCP、知识库和插件等被举例的名词；分析依据使用本仓 'ascendc-agent-main' 的实际机制：完整开发工作流、环境检查、文档搜索、通用调试与精度调试已是流程 Skill，编排器负责调度开发 / 测试 / 评估角色，Docker / NPU 环境负责实际执行和日志产出。
- 在“社区在 AI 时代的新角色”核心层新增 D3 Agent 能力编排图：文档 / GitCode / 站外经验 / 运行信号 / 专家责任作为输入，由任务会话编排为知识库、流程组件、连接器、工作台、任务状态与案例图谱、验证治理；只有含来源、版本范围和验证记录的结果回流为可信资产。
- 形成六类承载建议而非一刀切迁移：①版本化知识库 / 检索索引沉淀可引用事实；②流程组件 / Skill 沉淀可复用判断步骤；③连接器 / MCP / API 连接实时、带权限或需执行的外部系统；④工作台 / 插件 / 模板在社区、文档、IDE、CLI 呈现并接续任务；⑤任务状态 / 案例图谱持久化上下文、状态与复用关系；⑥验证服务 / 治理工作流处理真机 / CI、兼容矩阵、专家升级和责任闭环。
- 关键边界：源码和原始内容不应全量搬入 Skill；同一 GitCode 样例可以同时被知识库索引、被流程组件引用、被连接器读取当前分支 / Issue、在 IDE 模板中呈现，并将运行结果进入任务图谱。承载方式由稳定性、是否需要执行、是否需要连接实时系统和是否需要责任判定决定。

### 2026-08-18（修正 Agent 载体研究问题：内容类型 → 服务形态）

- 用户澄清研究结论不应聚焦“证明不应该强行转成单一 Skill”，而应直接回答：目前社区 / GitCode / 文档中的不同知识和资产，分别做成何种形态才能更好被 AI 调用、被开发者获取。
- 核心层的 D3 图与标题改为“内容转为 AI 可调用服务”：依据内容是否需检索、按步骤执行、读取实时状态、在现场交互、或经验证与责任判定进行分流；强调一个资产可派生多种形态，而不是按来源站点一刀切。
- 新增“内容类型 → 典型资产 → 优先转化形态 → Agent 调用 → 开发者获取”矩阵，具体映射为：权威定义 / API / 兼容关系→版本化知识库与结构化检索；可重复任务方法→Skill / 工作流；GitCode 代码、脚本、配置→模板 / 脚手架与可执行配方；分支 / Issue / CI / NPU / 日志→连接器 / MCP / API；经验案例与解决记录→案例图谱与问题状态服务；兼容承诺、性能结论、版本修复和治理→验证服务与人机协作工作流。
- 保留三张边界卡，但改为可行动结论：Skill 应承载方法，MCP / API 应承载访问与动作，任务状态 / 案例图谱是统一各类结果、实现跨入口接续的社区服务底座。

### 2026-08-18（Agent 决策机制图重画）

- 用户指出旧 D3 图只是把能力模块并列摆放，无法回答“Agent 什么时候用知识库、Skill、MCP 或其他形态”。原图容易被理解为所有能力都必须按固定顺序执行。
- `#agentCapabilityFlow` 已改为以 Ascend C Add 首跑为例的决策树：任务会话抽取目标 / 环境 / 当前阶段 → “缺什么证据？”分流；稳定事实进入知识库 / 检索，固定方法进入 Skill / 工作流，实时状态或外部动作进入 MCP / API，需要创建或嵌入开发现场时进入模板 / 插件 / CLI。
- 各分支结果汇合到“更新证据账本与问题状态”，Agent 再判断“能否宣告解决？”；证据不足返回待验证，高风险进入 CI / 真机 / 性能复现 / 专家升级，最终状态回流为知识、案例和维护计划。
- 图中使用菱形表达触发条件、箭头标签表达“缺什么 / 证据不足 / 高风险”，并保留蓝（知识）、灰（方法）、绿（实时连接）、紫（工作台）、橙（验证）语义色；浏览器桌面预览确认 SVG 已渲染、无控制台错误且五类承载形态可读。

### 2026-08-18（Agent 图改为公开机制支撑的纵向工作流）

- 用户认为上一版仍不具备 Start → End 的工作流可读性，并追问流程图依据。确认问题不在 D3 库，而在原先采用了能力地图式的横向编码；D3 仅为渲染工具，不能替代工作流的信息架构。
- `#agentCapabilityFlow` 现改为单一纵向主干：接收任务与上下文 → 理解任务并决定是否调用工具 → 调用能力并把结果写回任务 → “证据足够？” → 执行验证或携带上下文恢复 → 已验证解决 / 已升级。知识库 / 文档、Skill / 工作流、模板 / 脚手架 / 插件、MCP / API 与调试 / 专家升级均作为在特定条件下接入主干的侧分支。
- 图示依据分两层并直接写入 caption：通用工具调用循环引用 OpenAI Function Calling 和 Anthropic Tool Use 的公开文档（模型判断是否调用工具、读取工具结果、继续处理直到完成）；领域阶段引用本仓 `ascendc-agent-main/CLAUDE.md` 与 `ascendc-kernel-develop-workflow/SKILL.md` 的六阶段强制流程及阶段性 Skill 调用、Docker + NPU 构建测试事实。
- 通过“事实与推导的边界”图例明确：蓝灰为公开机制 / 当前 Agent 实现；模板、插件、MCP / API 等紫绿侧支为面向社区的产品化建议，尚需后续用户研究验证；橙色为不能由模型单独宣告的运行验证与责任升级。桌面预览确认主干与 End 连续可读、SVG 无控制台报错。

### 2026-08-18（与 opknow Agent 循环架构的互补关系）

- 用户指出 `opknow/20_human_ai_journey.html` 的“Agent 循环架构”更成熟，并澄清它与报告中的流程图不应互斥。经对照，opknow 4.3 是 Agent 内部的工具调用循环（计划 / 工具路由 / tool result / 证据判断 / 继续或收敛）；报告原图若再画同一循环会形成重复。
- 报告图改为“社区任务服务工作流”，将 Agent 循环作为中部明确标注的可重复子循环嵌入外层任务：开发者进入 → 社区识别缺口与风险 → Agent 循环调用知识库、Skill、模板 / 插件、MCP / API → 开发者与环境执行 / 复核 → 验证或失败恢复 → 已验证解决 / 已升级。
- 因而两图分工清晰：opknow 解释 Agent 内部如何运转；本报告解释循环怎样与社区资产、开发者、本地环境和责任服务协作。图下注释加入指向 opknow `#s4` 的本地链接，桌面预览确认嵌套循环与外层 Start / End 主线均可读、无控制台错误。

### 2026-08-18（固定坐标 SVG 重画与来源分层）

- 用户截图指出嵌套 D3 图仍出现能力卡、主节点与连线交叠。根因是运行时 D3 布局把侧支和主干放入同一空间；本图不需要数据驱动的自动排版，继续使用 D3 只会增加不确定性。
- `#agentCapabilityFlow` 改为仿照 `opknow/20_human_ai_journey.html#s4` 的固定坐标内联 SVG：固定 defs/marker、手工节点坐标、边缘到边缘的直连/回路；主线为开发者进入 → 识别缺口 → Agent 循环框 → 执行复核 → 验证 → 结果，循环框内四类能力卡按左右两列对齐接入“Plan / Route”和“Tool Call + Result”。移除页面加载时的 D3 渲染调用，避免字体和容器宽度造成的叠压。
- 图注完整分层来源：①图形绘制方式与内层循环参照 opknow 的 Agent 循环架构；②该循环的机制依据 Anthropic Tool Use（opknow 的示范实现使用 Anthropic Messages API）及 OpenAI Function Calling 的公开文档；③外层社区服务链是本研究结合公开案例和 Ascend C Agent 六阶段工作流的服务设计推导；④MCP/API、模板/插件明确为待验证建议，不冒充已实现事实。浏览器桌面检查：固定 SVG 48 条文本 / 20 条路径均渲染、无控制台错误。

### 2026-08-18（流程图拆分为两个紧凑 Tab）

- 用户指出固定 SVG 虽不再重叠，但内层循环框存在过高的无内容区域，且一张图同时承载“Agent 内部循环”和“社区外层服务”使画面过长；要求参考 opknow 的比例，并在图内提供两图切换。
- 图位改为两张同尺寸 `720×610`、最大显示宽度 660px（对齐 opknow 约 660px）固定 SVG 的 Tab：默认“Agent 工具调用循环”完整呈现规划 / 路由、工具结果、四类能力形态、证据判断、继续 / 收敛与验证升级；“社区任务服务闭环”只呈现任务进入、任务会话、调用循环、执行、验证 / 升级和结果回流。
- 服务闭环 Tab 在“Agent Loop”节点明确指向另一 Tab，不重复展开循环细节；因此两图保留互补关系，同时消除合并图中间大面积断层。新增无障碍 tab / tabpanel 语义与点击切换逻辑；浏览器桌面实测默认态、切换态均正常显示，无控制台错误。

### 2026-08-18（真实资产 → AI 服务形态：六个可核查实例）

- 用户要求把“哪些做成 Skill / MCP / 其他形态”的判断落实到当前网页和仓库的真实内容，而不是停留在抽象矩阵；在 `#future-model` 的内容形态矩阵后新增“真实资产示例”双列卡片组。每张卡固定呈现：带标注的来源截图、资产名称、形态、已存在 / 建议转化状态、Agent 调用、开发者获取方式及可点击原始链接。
- 新增六个实例：①昇腾算子开发场景 → 版本化知识库 / 结构化检索；②本仓 Ascend C Agent 六阶段工作流 → Skill / 工作流；③GitCode `asc-devkit` 9.0.0 Add 样例 → 模板 / 脚手架与可执行配方；④CANN community 的 Issue / Pull Request / Actions → 连接器 / MCP / API；⑤`Ascend/pytorch#154` 公开 Issue → 案例图谱 / 问题状态；⑥同一 Add 样例的构建入口 → 验证服务 / 人机协作。明确源码仍应在仓库、MCP/API 只承载实时状态与受控动作、验证结论必须有 NPU / CI 运行证据。
- 新采集两张可读证据截图并保存 metadata：`evidence/crops/github-issue-154.png`（公开 GitHub Issue，展示 GitCode 同步、软硬件版本和最小复现脚本）与 `evidence/crops/ascendc-agent-six-stage-flow.png`（本地 Agent 运行原理页面，展示实际的批次、开发、Docker + NPU、日志与评估阶段）。页面文本和元数据均清楚区分已存在资产与待验证的产品化建议。
- 桌面浏览器已验证新增区域 6 张卡片、所有 6 张截图加载正常，卡片宽度无横向溢出；现有证据截图只用作支撑相应形态判断，不作为装饰图。
- “真实资产示例”标题采用直接陈述的“六类真实资产：对应六种 AI 服务形态”，移除“不是抽象分类”这类反驳 / 辩解式表达。

### 2026-08-18（AI 时代昇腾社区角色研究 · 决策汇报版）

- 原 `operator-ai-journey-research/index.html` 同时承担研究底稿、证据库、方案说明、Demo 与研究计划，阅读主线过长；新增 `cann-dashboard/operator-ai-journey-deck/index.html` 作为独立 9 页决策汇报版，原页面继续保留为可下钻证据底稿。
- 汇报主线收束为：旅程变化 → 真实证据 → 研究判断 → 社区新角色 → 服务闭环 / Add 首跑试点 → 下一阶段验证。证据页复用并标注官方算子场景页、GitCode `asc-devkit` Add 样例与 `Ascend/pytorch#154` 公开 Issue，重要链接均保留在材料内。
- 研究判断明确区分边界：公开资产与问题记录是已采集证据；“可信服务网络”和任务会话是基于证据的服务设计推导；Add 首跑界面为待验证试点原型，不表述为既有能力。
- 社区角色聚焦可信知识、可接续问题、执行验证与责任闭环；服务模型以一个任务串联自然语言 / 日志 / IDE 入口、版本化路径、知识库、工作流、模板、连接器、CI / NPU 与专家升级，避免将 Skill 或聊天入口视为唯一产品形态。
- 按 `report-ppt-skill` 保留完整 deck runtime（翻页、页码、概览、全屏、键盘和 URL 定位）；旅程页按 `user-journey-skill` 将阶段、真实触点、行为、关键风险和社区职责逐列对应呈现。已在 1280×720 桌面视口逐页核验 9 页，无内容溢出、图片断链或控制台错误。

### 2026-08-18（决策汇报版重排：以 Agent Workflow 与资产分流为核心）

- 用户指出初版决策汇报遗漏核心内容：Agent Workflow 及“社区 / GitCode 等资产分别适合作为知识库、Skill、MCP 或其他服务形态”的研究判断被错误留在底稿；汇报版已扩展为 13 页，叙事调整为：传统旅程 → AI 任务旅程 → 真实证据 → Agent Workflow → 资产分流原则 → 六个真实资产映射 → 社区新角色 → 服务模型 → Add 首跑试点 → 验证计划。
- 新增 Agent Workflow 页，包含可切换的“Agent 工具调用循环 / 社区任务服务闭环”：模型先识别事实、方法、工程入口或实时状态的缺口，再调用知识库、Skill / 工作流、模板 / 插件 / CLI、MCP / API / 连接器；工具结果写回任务，证据不足继续路由，高风险进入 CI / 真机 / 专家验证或升级。图形方式参考 opknow Agent 循环架构，机制边界注明 Anthropic Tool Use、OpenAI Function Calling 与当前 Ascend C Agent 多阶段 workflow / Docker + NPU 事实。
- 新增资产分流矩阵与两页真实资产映射：官方路径 / API → 版本化知识库；六阶段方法 → Skill / 工作流；GitCode Add 工程 → 模板 / 脚手架 / 可执行配方；GitCode Issue / PR / CI / NPU / 日志 → 连接器 / MCP / API；Issue #154 等条件化经验 → 案例图谱 / 问题状态；构建、兼容、精度与性能结论 → 验证服务 / 人机协作。明确同一资产可派生多种形态，不按来源站点一刀切。
- 用户指出旅程模型前后不一致；复核后确定原研究页 `#change` 中的 S0–S4 生命周期为研究主模型：发现与评估、定向与选择、首个真实结果、交付与扩展、共创与影响。决策汇报版仅使用 `user-journey-skill` 的紧凑视觉模板与分两页的呈现，两页均已对齐为相同 S0–S4，而不再用“搜索入口 / 报错与求助”等另一套操作阶段替代模型。
- 1280×720 桌面核验：13 页均无内容溢出；两张旅程的 S0–S4 逐项一致；Agent Workflow、资产分流矩阵、真实资产截图页均正常渲染，无控制台错误。

### 2026-08-18（旅程模型改为前后不同的任务机制）

- 用户指出传统社区与 AI 时代的开发者旅程不应只替换触点后沿用同一套阶段；已重构决策汇报版的两页旅程，二者以同一 Ascend C 算子开发任务为对照对象，但阶段按实际服务机制分别定义。
- 传统社区旅程改为：任务触发 → 多点检索 → 拼接试做 → 换入口求助 → 结果散落，揭示开发者在搜索、官方文档、GitCode、CSDN、论坛与工单之间自行拼接知识、工程与状态的成本。
- 开发者 × AI 任务旅程改为：任务提交 → 上下文补齐 → 路由与调用 → 执行、验证与恢复 → 状态回流与协同，揭示 AI 的价值不在替代搜索，而在按缺口协调知识库、工作流、模板、实时连接与验证服务，并让证据持续写回同一任务。
- 两页继续使用用户旅程模板的阶段 / 触点 / 行为 / 情绪 / 痛点 / 机会六行结构；资料中的“情绪”行仍保留连续曲线，卡片文案同步对应新阶段。

### 2026-08-18（用户旅程改为责任泳道图）

- 用户提供 `b2b-delivery-swimlane-v4.html` 作为实现参考，要求只借鉴旅程泳道的表现方式，不复用其内容。决策汇报版两页用户旅程均改为“横向阶段 × 纵向责任角色 × 跨泳道交接箭头”的泳道图：顶栏为阶段、左栏为任务参与角色、节点固定在对应责任泳道、箭头描述行动交接及反馈回路、底栏总结该模式下的任务后果。
- 传统社区页的泳道为开发者、内容与代码站点、工具与本地环境、社区支持；展现任务触发、多点检索、拼接试做、换入口求助、结果散落，突出上下文反复组织与结果无法接续。
- AI 任务页的泳道为开发者、AI / 任务会话、社区服务、执行与支持；展现任务提交、上下文补齐、按缺口路由、执行与验证、状态回流，突出同一任务中知识、工作流、工程、连接器与验证服务的协同关系。
- 1280×720 桌面预览已核查两张泳道图：阶段栏、四条泳道、5 个节点、箭头和底部结论均在单屏内可读，无节点重叠或裁切。

### 2026-08-18（旅程模板与泳道合并）

- 用户指出泳道图不应替代原用户旅程模板，否则会丢失触点、行为、情绪、痛点、机会等研究信息；已恢复两页原模板的完整信息行，并将泳道能力收为新增的一行“交接 / Swimlane”。
- 两页现统一为：阶段 → 触点 → 行为 → 交接泳道 → 情绪 → 痛点 → 机会。泳道仅解释各阶段之间由谁承接、是否回流：传统页为开发者 / 内容代码工具 / 社区支持；AI 页为开发者 / AI 任务会话 / 社区服务与执行环境。
- 为保证单屏阅读，阶段、触点、行为、情绪、痛点、机会行高度与间距均已收紧；1280×720 桌面预览确认两页均完整呈现六行研究信息加一行泳道，痛点和机会不再缺失、无垂直裁切。

### 2026-08-18（行为行与泳道合一）

- 用户指出“行为”本身应由泳道表达，而不是保留一行文字行为再新增一行交接。已删除原文字行为行和单列“交接”标签，将紧凑泳道改名为“行为 / Action”。
- 当前结构为：阶段 → 触点 → 行为（责任泳道内的任务节点与跨角色箭头）→ 情绪 → 痛点 → 机会；既保留用户旅程的研究信息，也以泳道准确表达行动主体和交接关系。
- 1280×720 预览确认传统页与 AI 页各只保留一条行为泳道，均无文字行为卡残留，痛点与机会保持完整。

### 2026-08-18（补足行为泳道的动作信息）

- 用户指出合并后的行为泳道内容过少，仅有动作标签不足以解释任务如何推进。每个节点已扩展为“动作标题 + 具体输入 / 动作 / 交接产物”两层：传统页补足需求转检索词、文档 / GitCode / CSDN 分散检索、环境拼接、携带日志重述与结果散落；AI 页补足目标与上下文提交、版本 / 芯片追问、检索 / 工作流 / 模板 / 连接器路由、CLI / CI / NPU 输出或复现包、验证结论和适用边界回流。
- 泳道左侧角色标签同步补足职责说明；节点仍保持单屏内的紧凑卡片和交接箭头。1280×720 桌面预览确认传统与 AI 两图无节点重叠、文字不裁切，动作信息可读。

### 2026-08-18（痛点与机会扩展为阶段问题簇）

- 用户指出旅程中不止行为泳道，痛点和机会也不应每阶段只有一句话。两页 5 个阶段的痛点和机会均改为 3 条具体项，形成一组“问题簇 / 服务响应簇”，而非单点结论。
- 传统页覆盖：任务入口与首步选择、版本 / 条件 / 经验分散、样例与环境拼接、问题上下文无法跨入口接续、成功与反例难沉淀；机会逐组对应任务入口、可信来源状态、一次试跑工程、问题对象与版本化案例。
- AI 页覆盖：上下文透明度、来源和适用范围、调用与真实执行的区别、高风险验证升级、回流资产的维护治理；机会逐组对应任务会话、可信边界、工具编排与状态写回、CI / 真机 / 专家闭环和持续治理指标。
- 1280×720 桌面验证：传统与 AI 两页各有 5 组痛点、5 组机会，每组严格 3 条，无垂直溢出。
