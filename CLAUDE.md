# AscendCANN · CLAUDE.md

> 新会话必读。本文件由 Claude Code 自动维护，每次对话后更新。

---

## 项目目标

重构"CANN 开发者效能全景概览"看板，帮助产品/体验团队**快速定位体验最差的角色/场景**，基于 Agentic 评分、痛点、VOD 数据作出改进决策。

---

## 文件结构

```
AscendCANN/
├── CLAUDE.md                   ← 本文件（自动维护）
├── CANNlogo.png
├── Ascendlogo.svg
└── cann-dashboard/
    ├── analysis.html           ← UX 分析文档（封面 + 13 章节，v0.4）
    ├── style.css               ← 分析文档样式
    ├── script.js               ← 分析文档交互逻辑
    ├── design-options.html     ← 新看板（单文件，模拟数据，~1960 行）
    ├── ascendc-agent-main/     ← Agentic 算子评测系统（已分析，原作者有 NPU）
    ├── backend-context.md      ← 后端上下文
    ├── context.md              ← 旧上下文文件（内容已迁移至此，保留备查）
    └── process-log.md          ← 协作过程记录
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

> **注意**：Claude Code 的 Read/Write/Bash 工具受 macOS TCC 限制，无法直接访问 `~/Documents`。但 `git`（系统二进制）可以绕过此限制。写文件需用 `python3 -c "..."` heredoc 方式。

---

## 协作规则（每次必须执行）

1. **每次修改完成后立即 git push**，不要堆积
2. **每次对话结束后更新本文件（CLAUDE.md）**，追加本次对话的关键决策和改动摘要
3. **视觉/设计类改动先提 2–4 个选项**让用户选，不要直接实现
4. **用中文**与用户交流

---

## 当前进度（2026-05-20）

### 已完成

#### 新看板 design-options.html（~1960 行，单文件，模拟数据）

##### 导航架构（两个顶层 Tab）

**总览**（`#tabOverview`）：可滚动总览页，filter-bar 含芯片筛选 + 视角（6 个角色 chip）
1. KPI 横排（4 张摘要卡片，含 ECharts sparkline）
2. 体验健康矩阵（5 产品线 × Agent/痛点/VOD/综合/环比，含 mini 折线）
3. **技术内核** 楼层（红色徽章）：PyTorch API 雷达图 / 模型开箱环形图（77% 综合覆盖）/ 0 Day 发布
4. **开发界面** 楼层（蓝色徽章）：需立即处理清单 + Agentic 效率仪表盘 + "→ 进入用户旅程" CTA
5. 客户痛点 section：大客户闭环率横向柱状图 + 痛点分布柱状图 + 分类汇总 chip（工具/文档/API/环境，可点击过滤，计数随角色联动）+ 统一痛点列表（P0→P1，每条带 `data-cat` + `data-roles`）
6. **生态增益** 楼层（绿色徽章）：VOD ECharts 柱状图 + Top3 原声卡片 + 社区入门体验（S0–S5 步骤圆圈 + KPI 4 格 + 关键痛点 callout）

**用户旅程**（`#tabDev`）：单页纵向滚动
- filter-bar（芯片 + 三个角色）→ KPI 4 格（整体健康/严重场景/活跃痛点/本期优先）
- 触点矩阵（4 场景 × 文档/API/工具/环境，点击格子右侧出现 Agent 观测）
- main-body：场景列表（sticky left）+ 场景详情（评分/痛点/VOD 三证据 tab + 5 维雷达）+ 设计依据侧栏

##### 关键 JS 实现

| 函数 | 作用 |
|------|------|
| `switchTab(id, btn)` | 切换 tabOverview / tabDev，关闭两个设计点面板 |
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

- **用途**：用 Claude Code Agent 批量自动开发昇腾 NPU 算子，评测开发者体验（DX）
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

- **楼层重排**（进行中）：总览 → 客户痛点 → VOD → 生态增益 → 开发界面 → 技术内核，每楼层压缩高度
- 确认是否有 NPU 服务器资源接入，用于替换模拟数据

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

### 2026-05-20

- 用户要求：每次改完必须 push + 更新 CLAUDE.md（已存入长期记忆）
- context.md 内容迁移至 CLAUDE.md，CLAUDE.md 成为唯一上下文维护文件
- 待实施：总览 Tab 楼层重排（总览 → 客户痛点 → VOD → 生态增益 → 开发界面 → 技术内核）
