# CANN 体验看板 · 项目上下文

## 项目目标
重构"CANN 开发者效能全景概览"看板，帮助产品/体验团队**快速定位体验最差的角色/场景**，基于 Agentic 评分、痛点、VOD 数据作出改进决策。

---

## 当前进度（2026-05-08）

### 已完成
- UX 分析文档 `analysis.html` v0.4 — 浏览器打开可读
- 视觉风格：浅色主题（`#f4f5f8` 底）、主题色 `#c7000b`、Inter 字体
- 布局：左侧固定 sidebar（232px）+ 分组导航 + 线性 SVG icon + Intersection Observer 高亮
- Sidebar logo：`CANNlogo.png`，点击滚动回顶部
- 章节顺序与 sidebar 导航对齐（用户研究三节归组、待确认移至收尾）
- 章节底色交替（白 / `#f4f7fb`），section 铺满 main-content 全宽
- 封面页：浅灰底、CANN 字样红色、右侧四根升序柱状图（呼应 Ascend + 数据看板）
- 文件已拆分：`style.css`（样式）、`script.js`（交互）、`analysis.html`（结构+内容）

### 下一步（等待数据）
- 用户将提供真实 Agent 评分、痛点列表、VOD 原声样本
- 数据到位后开始 UI 设计（看板本体，非分析文档）

---

## 信息架构

### 两条主线
| 维度 | 角色 | 评估对象 |
|------|------|---------|
| 产品易用性 | AI框架开发者、算子开发者、应用框架开发者 | 工具/API/文档能不能用好 |
| 社区应用易用性 | 入门开发者 | 新人能不能在 GitCode 上跑通 |

### 筛选维度
- 角色类型（4种）
- 芯片型号（A5 等）

---

## 算子开发者 · 典型场景（已确认）
1. 算子复现部署
2. 算子迁移部署
3. Built-in 算子定制
4. 算子基本功能实现
5. 特定 shape 性能
6. 泛化 shape 性能

## 入门开发者 · 任务流（已确认）
在 GitCode 中由 Agent 执行：
1. 搜索与发现
2. 环境检查样例
3. 快速体验开发与编译
4. 测试与验证
5. 反馈与贡献

---

## Agentic Skills 仓库分析
来源：https://gitcode.com/cann/cannbot-skills/tree/master/ops
共 33 个 skill，每个 skill 对应一类开发任务，有 SKILL.md 入口 + references/ + scripts/。

### 场景 → Skills 对应关系（算子开发者）
| 典型场景 | 相关 Skills |
|---------|------------|
| 算子复现部署 | `ascendc-direct-invoke-template`, `ascendc-registry-invoke-template`, `cann-env-setup` |
| 算子迁移部署 | `ascendc-direct-invoke-to-registry-invoke`, `ascendc-registry-invoke-to-direct-invoke` |
| Built-in 算子定制 | `torch-ascendc-op-extension` |
| 算子基本功能实现 | `pypto-op-develop`, `ascendc-ut-develop` |
| 特定 shape 性能 | `ops-profiling`, `pypto-op-perf-tune` |
| 泛化 shape 性能 | `ascendc-tiling-design`, `ascendc-st-design`, `ascendc-whitebox-design` |

### Agent 评分结构（已确认）
评分不是单一总分，按场景类型使用不同指标体系：

**精度类：** L0/L1/L2 分级
- 指标：MARE / MERE / RMSE Ratio（NPU vs 三方芯片双标杆）
- L0 阈值：≤10 / ≤2 / ≤2；L1：≤5/≤1.5/≤1.5；L2：≤2/≤1.2/≤1.2

**性能类：** 11 个维度，每个有达标/警告/严重三档
- 核间负载均衡、Block Dim、VEC ratio、MTE2 ratio、L2 Cache 命中率、带宽利用率等
- 总体判定：实际耗时 vs 理论耗时，差距 <20% 达标，>50% 严重瓶颈

**任务执行类：** skill 完成情况 + 证据链日志

### 芯片型号
从 `ascendc-npu-arch` skill 推断有 DAV_1001 ~ DAV_3510 系列，Ascend 950 有专属知识包。

---

## 设计方向（已确定）
1. **问题优先**：排序/颜色/强调以"哪里最差"为导向
2. **三类证据互证**：Agent评分 + Agent痛点 + VOD原声并列呈现
3. **三层递进**：全景 → 角色视图 → 场景详情
4. **筛选即叙事**：角色+芯片筛选是进入专属分析视角的入口

---

## 协作约定（新会话必读）

### 关于用户
- GitHub 用户名：**SchihHsin**（注意不是 SchihShin，H-s-i-n）
- 主要工作语言：中文

### 操作习惯
- **视觉/设计类改动，先给 2-4 个选项让用户选，不要直接动手实现**
  - 上一次直接删掉封面装饰元素，被用户指出应该先问
- 每次完成改动后**立即 commit + push**，不要堆积
- 改完之后**主动用 `open` 打开浏览器**让用户看效果
- **修改 context.md** 反映最新状态，不要让它过时

### 关于这个项目
- 主要受众是**内部团队**（体验 PM + 技术 Owner），管理层汇报是次要需求
- 现阶段产出物是**分析文档**（analysis.html），不是看板本体
- 看板 UI 设计要等用户提供真实数据后才开始

### 回到顶部的快捷流程
```bash
cd ~/Documents/Coding/AscendCANN
open cann-dashboard/analysis.html   # 查看当前效果
```

---

## 待确认问题（UI 设计前必须明确）
- [ ] **Q1 VOD 来源**：真实用户反馈从哪来（访谈/问卷/社区工单）？是结构化数据还是原始文字？
- [ ] **Q2 评分聚合方式**：看板展示的是单次 skill 运行的原始分，还是多次汇总均值？
- [ ] **Q3 其他角色场景**：AI框架开发者和应用框架开发者是否对应 pypto-* / torch-* 系列 skills？

---

## 文件结构
```
AscendCANN/
└── cann-dashboard/
    ├── analysis.html   ← UX 分析文档（浏览器打开）~1020 行
    ├── style.css       ← 样式（浅色主题，主题色 #c7000b）~394 行
    ├── script.js       ← 交互（lightbox + sidebar 高亮）~26 行
    └── context.md      ← 本文件，项目上下文
AscendCANN/
    ├── CANNlogo.png    ← sidebar 使用的 logo
    └── Ascendlogo.svg  ← 备用 Ascend logo
```
