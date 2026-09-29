# 问题 01 样章：真实性能优化 Skill / MCP 证据

核查日期：2026-09-29。仅只读结构核查，未执行任何 NPU、性能测试或 MCP 网络查询。

## 版本与来源

- CANNBot 官方仓库：`https://atomgit.com/cann/cannbot-skills.git`
- 当前分支：`master`；固定提交：`591e5fd668decdf3b26545914ce98928c5fcb93d`。
- 本地只读快照：`/tmp/ascend-skill-evidence.0VJ7P6/cannbot-skills/`。
- 此快照完整 Git 树实际为 270 个 `SKILL.md`：plugins-community 120、ops 79、plugins-official 22、model 21、graph 13、infra 5、tools 8、runtime 2。使用 `git ls-tree -r --name-only HEAD` 计数，并用 `rg --files --hidden --no-ignore` 交叉核验；不能用受 .gitignore 影响的默认文件搜索数量。材料旧的 258 是上轮盘点，不应把两轮数据静默混用。
- 文档 MCP 本地包：`/Users/hsin/Documents/Coding/ascend-vs-nvidia-ux/node_modules/@opencxd/ascend-doc-mcp`，版本 `0.0.1-alpha-6`。
- MCP 以 `dist/index.js.map` 内 `sourcesContent` 中的实际源码和注册为准。README 仍称 16 个工具，不应作为实际注册数依据。

固定提交审阅链接：

- [ascendc-env-check](https://atomgit.com/cann/cannbot-skills/blob/591e5fd668decdf3b26545914ce98928c5fcb93d/ops/ascendc-env-check/SKILL.md)
- [ops-profiling](https://atomgit.com/cann/cannbot-skills/blob/591e5fd668decdf3b26545914ce98928c5fcb93d/ops/ops-profiling/SKILL.md)
- [ascendc-perf-optimize](https://atomgit.com/cann/cannbot-skills/blob/591e5fd668decdf3b26545914ce98928c5fcb93d/ops/ascendc-perf-optimize/SKILL.md)
- [核间流水占位内容](https://atomgit.com/cann/cannbot-skills/blob/591e5fd668decdf3b26545914ce98928c5fcb93d/ops/ascendc-perf-optimize/references/inter-core-pipeline/index.md)
- [MCP 包版本](https://www.npmjs.com/package/@opencxd/ascend-doc-mcp/v/0.0.1-alpha-6)

URL 核验：ops-profiling 的固定提交 blob 地址以 HTTP HEAD 返回 200；另外两条采用同一仓库、提交和真实 Git 路径。源码事实来自已拉取的固定 Git 对象，不依赖网页截图。

<a id="environment"></a>

## 1. ascendc-env-check：先判断运行现场

源：`ops/ascendc-env-check/SKILL.md`，关键行 2–3、46–64、68–107。

- 触发：环境检查、NPU 设备、CANN 安装、设备查询、NPU 架构等。
- 输入/前置条件：有 Ascend driver 与 CANN toolkit；架构探测前 source 安装目录下 `set_env.sh`。
- 动作：`check_env.sh` 检查 Toolkit/OPP/算子包/msprof 等；`npu_info.sh` 查询设备；`get_npu_arch.py` 读取架构。
- 输出：环境检查报告；架构脚本 `--json` 返回 `full_soc`、`npu_arch`、`short_soc`、`variant_dir`、来源和 warnings 等字段。
- 重要条件：该版明确不能仅用 npu-smi 的 Chip Name 判断 short-soc-version；asys/DSMI 与 ini 构成来源链。
- 不能宣称：有此 Skill 就保证环境兼容或已完成本机检查。

页面短文案：
> **先确认环境** · `ascendc-env-check` 检查 CANN、设备与 NPU 架构，给后续采集和优化提供运行条件。

<a id="profiling"></a>

## 2. ops-profiling：取得基线和瓶颈数据

源：`ops/ops-profiling/SKILL.md`，关键行 2–3、39–125、129–159。

- 触发：上板性能、性能测试、硬件性能验证、NPU profiling、性能对比、加速比等。
- 标准模式输入：可运行的算子可执行文件与参数。
- 对比模式输入：参考 `model.py`、`model_new_ascendc.py`、kernel 工程和测试用例（优先 `<op>_perf_cases.jsonl`）。
- 动作：`msprof_profile_run.sh` 支持标准采集、`--compare`、`--quick`、`--batch`；`msprof_perf_summary.py` 解析结果。
- 输出：`performance.json`、`performance.log`、`perf_report.md`；报告字段包含 Case、Shape、DType、自定义/标杆耗时、加速比。标准采集支持更深的瓶颈分析。
- 条件：MC² / fork 多 rank 算子应使用 msprof，不使用 msprof op；无对应工具时提示检查环境。
- 完成边界：加速比对比输出 JSON 与 Markdown 即完成，不自动生成可视化。是否达到业务验收仍取决于任务条件。
- 真实局部接口边界：`PROF_GROUP_*` 归档不能直接喂给可视化子技能，两套采集目录不互通（159 行）。
- 不能宣称：本机已跑出任何加速比；README 中宣称能力不等于实测有效性。

页面短文案：
> **先测出基线** · `ops-profiling` 对比自定义算子与标杆，输出按 Shape / DType 的耗时、加速比和瓶颈线索。

<a id="optimization"></a>

## 3. ascendc-perf-optimize：根据数据制定优化策略

源：`ops/ascendc-perf-optimize/SKILL.md`，关键行 2–3、12–36、40–53、57–101、105–118。

- 触发：算子性能调优、流水分析、Tiling 修正、bound 诊断等。
- 输入：算子类型、Shape、dtype、kernel 代码或计算流程、profiling 数据；仿真图在总览中标为可选。
- 动作：先做 Tiling 理论建模，再按适用条件分析卡间、核间和单核流水。
- 输出：Tiling / Buffer 规划、bound 诊断、性能分析报告、优化策略和 Tiling 修正建议。
- 条件：卡间分析仅针对通信类；核间分析针对多核同步；普通计算算子会跳过不适用分支。
- MC² 条件：缺失 TilingData 或隔离测试的 T_comm/T_compute 时，需补采数据，不能直接给切分方案。
- 已确认局部缺口：101 行明确核间流水策略尚未收录；`references/inter-core-pipeline/index.md` 也明确是占位内容、该分支跳过。
- 不能宣称：所有四步完整成熟，或该 Skill 会自动完成代码改造与性能验收。

页面短文案：
> **再按类型优化** · `ascendc-perf-optimize` 结合计算流程与 profiling 数据，按适用分支提出 Tiling 和流水优化策略。

<a id="mcp"></a>

## 4. 两个真实文档 MCP 工具

### search_docs

源映射：`src/tools/search-docs.ts`，45–74 行；`src/register-tools.ts`，52–57 行与 P0 注册段。

- 输入：`keyword`；可选 `product`、`version`、`tab`、`limit`、`lang`。
- 功能：搜索社区文档，返回结果摘要、链接与版本标注；支持关键词搜索与语义召回。
- 版本边界：`version` 是对返回结果的客户端二次过滤，不是服务端直接限制搜索范围。
- 不含通用芯片/Driver/Shape 适用性判定输入，不能画成自动做完环境匹配。
- 注册为 `readOnlyHint: true`、`destructiveHint: false`；不执行编译、测试或 profiling。

页面短文案：
> **查优化依据** · `search_docs` 搜索 CANN 文档，带回来源与版本线索；版本过滤并不等于芯片和任务适用性已验证。

### get_doc_content

源映射：`src/tools/get-doc-content.ts`，156–183 行；`src/register-tools.ts` 的 P0 注册段。

- 输入：从搜索或目录结果取得的 `url` / 源文件路径 / codePath；可选 `format`。
- 功能：获取正文（默认 Markdown）、原始 HTML 或摘要。安装/部署类可额外传 Mode/OS/Software 条件。
- 不要在演示中伪造真实文档 URL；应使用搜索返回的实际地址。
- 注册为只读；不执行任何 NPU 动作，也不判定优化成功。

页面短文案：
> **读原文条件** · `get_doc_content` 读取对应章节，确认 API、限制和说明；它提供依据，不替代性能实测。

## 5. 可直接用于样章的关系结论

> “优化这个 Ascend C 算子”不是选择一个名字相近的工具：环境检查确认运行条件，Profiling 产生测量，性能优化 Skill 解释数据并选择策略，文档 MCP 提供可追溯依据。它们是分工不同、需要衔接的能力，不是同类替代项。

建议表现为：环境条件 → 基线/瓶颈数据 → 条件分支优化策略 → 再测；文档查询是旁路依据。最后的再测是本样章建议的任务组织关系，不是已经验证的统一系统编排。

不能写“这些 Skill 没有触发、输入、分支或输出”，因为源文件已经包含。可以研究“用户/Agent 能否找到、正确选择并将各项输入输出衔接”。仅资产结构不能证明普遍的用户选择困难，也不能证明任务效果。

## 6. 截图检索结论

已检查主仓 `ai-development-behavior-system-report-evidence`、`operator-ai-journey-research/evidence`、相关已有 PNG/JPG/WebP，以及兄弟研究仓相关图片；没有找到可确认来源的 CANNBot 目录 / SKILL 正文 / 文档 MCP 工具列表网页截图。

- 旧 `problem-screenshots/03-capability-choice-1440x900.png` 是 OpenHands Issue #15419，不是昇腾资产。
- `solution-mockups/03-codex-capability-assembly*.png` 是方案生成图，不能作为现状截图。
- 官方仓库 `docs/figures/cannbot-repo-map.png` 是发布方的架构示意图（已查看），展示 cannbot / cannbot-skills / cannbot-knowledge / cannbot-dsl / cann-bench / cannbot-sentry；不是网页截图，也不是具体 Skill 使用证据。
- 没有新开 file:// 或新截图，没有把代码渲染为截图。若当前页面必须有真实截图，需另行通过允许的公开网页访问采集；不要以生成图补作事实。

## 7. 证据级别

- Skill 文件、脚本存在和条件/字段：公开仓库可复核事实（H），固定在上述提交。
- MCP schema / 注册 / 实现：本地安装包可复核源码事实（H），限定 0.0.1-alpha-6。
- 编译、NPU、查询成功、性能提升：本轮未执行，不能当作已验证事实。
- 选择和衔接带来的效率改善：待任务实验验证（L）。
