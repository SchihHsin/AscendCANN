# CANN 后端读取数据与报告生成 · 项目上下文

## 目标
本文件只记录**后端读取数据 / 仓库分析 / Agentic 评分 / 报告生成**相关上下文。

与设计/前端相关的上下文继续维护在：
- `context.md`

---

## 当前进度（2026-05-14）

### 已完成
#### 1. GitCode 仓库全量梳理
- 已通过 GitCode API 拉取并梳理 `cann` 组织公开仓库，共 **65 个仓库**
- 已完成全量仓库元数据、README、目录结构、脚本/测试/build 入口等远程观测整理

#### 2. 评分与证据文件
- 已生成：
  - `cann-agentic-observations.json`
  - `cann-agentic-summary.json`
  - `cann-repo-coverage.json`
  - `repo-scan-summary.json`
- 已建立本地证据目录：
  - `repo-scan/`

#### 3. 本地脚本
- 已有脚本：
  - `scripts/analyze_cann_repos.py`
  - `scripts/render_agentic_report.py`
  - `scripts/render_ux_journey_report.py`
  - `scripts/render_context_journey_report.py`

#### 4. 报告输出
- 第一版 UX 导向报告：
  - `journey-agentic-report.md`
  - `journey-agentic-report.html`
- 第二版 context 骨架导向报告：
  - `context-journey-report.md`
  - `context-journey-report.html`

#### 5. 当前报告规则
- `journey-agentic-report.*`
  - 按新分析的人群 / 场景体系组织
- `context-journey-report.*`
  - 按 `context.md` 中定义的角色 / 场景 / 旅程骨架组织
  - 如果 `context.md` 中没有内容，但新分析已有可映射内容，则允许**用新分析补全**
  - 页面中需明确标注：
    - `context 骨架`
    - `新分析补全`
    - `阶段名来自 context，内容来自新分析`

#### 6. 当前报告呈现原则
- 分数是主信息
- 覆盖率只是辅助证据
- 辅助证据区需要展示：
  - 参考仓库名称
  - 仓库地址
  - 少量覆盖信息
- “最高阶段 / 最低阶段 / 旅程判断”不再单独占一整排
  - 改为在旅程节点上通过小标签和视觉强调表达

---

## 数据文件说明

### `cann-agentic-observations.json`
- 仓库级观测明细
- 包含：
  - repo 元数据
  - remote observation
  - local observation
  - score dimensions
  - confidence / weighted score

### `cann-agentic-summary.json`
- 汇总统计
- 包含：
  - 仓库总数
  - 分类平均分
  - top/bottom 仓库
  - 评分公式说明

### `cann-repo-coverage.json`
- 全量仓库覆盖清单
- 用于报告中展示“哪些仓库被纳入观察”

### `repo-scan-summary.json`
- 本地 repo-scan 结果汇总

### `repo-scan/`
- 本地证据目录
- 保存部分关键仓的：
  - README
  - docs
  - 目录结构证据

---

## 当前关键结论

### 1. context 只是骨架
- `context.md` 不再被视为内容上限
- 如果后端新分析已有可映射证据，可以补入骨架导向报告

### 2. UX 结论优先于覆盖率展示
- 报告需要优先回答：
  - 哪个角色 / 场景得分低
  - 哪个旅程阶段最差
  - 为什么低
- 覆盖率只用于解释，不应主导页面

### 3. 证据要可追溯
- HTML 报告中的证据链接，尽量对应真实已纳入版本库的文件
- 已完成 push 的 JSON 证据文件：
  - `cann-agentic-observations.json`
  - `cann-agentic-summary.json`
  - `cann-repo-coverage.json`

---

## 已完成提交
- `cb063f2` `Add context-based journey report with supplemented UX analysis`
- `18d7fce` `Add report evidence JSON files`
- `487e087` `Update project context with report and analysis progress`

---

## 待处理事项
- [ ] 如有需要，继续把报告中引用到的 `repo-scan/...` 本地证据文件纳入版本库
- [ ] 继续校正“新分析内容”到 `context` 骨架场景的映射关系
- [ ] 如后续引入真实后端读取逻辑，补充：
  - 数据源
  - 拉取方式
  - 更新周期
  - 字段定义

---

## 文件范围
本后端 context 主要对应：
- `cann-agentic-observations.json`
- `cann-agentic-summary.json`
- `cann-repo-coverage.json`
- `repo-scan-summary.json`
- `repo-scan/`
- `journey-agentic-report.*`
- `context-journey-report.*`
- `scripts/analyze_cann_repos.py`
- `scripts/render_agentic_report.py`
- `scripts/render_ux_journey_report.py`
- `scripts/render_context_journey_report.py`
