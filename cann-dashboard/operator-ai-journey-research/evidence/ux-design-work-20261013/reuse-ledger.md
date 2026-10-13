# UX 工作变化研究：既有证据复用台账

日期：2026-10-13
用途：为“Agent 普及后 UX 设计师的工作、介入、交付与评价变化”整理可复用事实，并逐项分析平台能力沙盘的十类入口与运行机制，从访谈、案例和平台差异推导 UX 机会。Skill、MCP、专家团只是其中的例子，不预设为优先方向。本文是证据索引与边界说明，不把候选设计工作写成已验证结论。

## 可复用证据

| # | 事实 / 原文摘录 | 证据来源 | 可以支持什么 | 不能支持什么 | 候选 UX 工作 |
|---|---|---|---|---|---|
| 1 | 受访者指出通用模型可能找得到正确资料，但上下文和开发逻辑仍可能需要人纠正；并说昇腾开发需要 Skill 辅助。另有“经验很重要，但是 ai 能力也很重要”“人主要在审核和决策上面？……可以这么理解”。 | 原逐字稿：[transcript-part-1.txt](/Users/hsin/Documents/Coding/opknow/experiments/ai-dev-behavior-pilot-20260924/analysis/interview_sources/transcript-part-1.txt:78)（00:11:35–00:14:11）；整理索引：[evidence-review.md](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ai-development-behavior-system-report-evidence/interview-focus-20260928/evidence-review.md:15) | 单一受访者将领域方法、经验判断和审核决策视为 AI 开发中的实际需求；Skill 可作为候选承载方式。 | 不能推出多数开发者都需要同一种 Skill；不能证明 Skill 安装后改善任务结果，也不能把受访者陈述改写成已观察的普遍分工。 | 定义 Skill 的任务触发条件、适用版本、输入要求、步骤分支、停止 / 升级条件、预期结果和证据回执；让用户能在审核点检查依据与选择下一步。 |
| 2 | 原声：“你的经验判断，他可以顺着你的经验判断走一条新的分支。”上一句描述 AI 迭代两轮仍报错后，开发者看报错并介入。 | 原逐字稿：[transcript-part-1.txt](/Users/hsin/Documents/Coding/opknow/experiments/ai-dev-behavior-pilot-20260924/analysis/interview_sources/transcript-part-1.txt:104)（00:15:53–00:16:06）；六题索引：[evidence-review.md](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ai-development-behavior-system-report-evidence/interview-focus-20260928/evidence-review.md:17) | 人的经验可以改变诊断分支，支持把“开发者难以判断和选择下一步行动”作为固定问题继续研究。 | 不能说明经验一定正确、介入的最佳时机或发生频率；这不是对实际任务行为的观察实验。 | 设计可比较的下一步及其依据；呈现已知事实、未知项、风险和可撤销动作；保留人工修正方向的入口，并记录决策为何改变路线。 |
| 3 | 原声：“这些对这些基本都能过……这时候你就要需要介入了，你需要让他考虑一些特殊的边界条件，特殊的输入输出。”其后提到重写 test bench。 | 原逐字稿：[transcript-part-1.txt](/Users/hsin/Documents/Coding/opknow/experiments/ai-dev-behavior-pilot-20260924/analysis/interview_sources/transcript-part-1.txt:121)（00:17:51–00:18:30）；六题索引：[evidence-review.md](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ai-development-behavior-system-report-evidence/interview-focus-20260928/evidence-review.md:19) | 受访者区分典型输入通过与特殊边界测试，指出验证标准和测试输入需要人工审视。 | 不能推出实际漏测率、测试质量下降比例或“模型总会偷懒”；不能把口述概括当成测量结果。 | 把验证目标、边界类别、预期输出和失败后的补测路径作为设计对象；在界面中区分“样例通过”“边界已覆盖”“真实环境验证”。 |
| 4 | 原声：“搜索的过程其实是一种学习的强化过程。但 ai 帮你做了这件事情之后，你没有走过程，所以你有时候学的东西并不太牢靠，过十几天就忘记了。”另称“内化这件事只有自己能做”。 | 原逐字稿：[transcript-part-2.txt](/Users/hsin/Documents/Coding/opknow/experiments/ai-dev-behavior-pilot-20260924/analysis/interview_sources/transcript-part-2.txt:56)（00:08:00–00:08:44）及 [同文件](/Users/hsin/Documents/Coding/opknow/experiments/ai-dev-behavior-pilot-20260924/analysis/interview_sources/transcript-part-2.txt:82)（00:11:33–00:11:55）；六题索引：[evidence-review.md](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ai-development-behavior-system-report-evidence/interview-focus-20260928/evidence-review.md:21) | 任务交付与学习内化应分开观察；支持研究是否需要让用户参与关键推理、解释或迁移练习。 | 不能证明受访者本人或群体长期能力已经下降；没有延迟测验、对照组或因果证据。 | 设计可选的理解检查、关键依据回看、最小复述 / 迁移练习；以延迟回忆和新任务迁移测“学会”，不能以看完解释或任务完成代替。 |
| 5 | 15 条公开 Issue / 案例库分类为：应用交付 5、构建与兼容 6、正确性与性能 4。条目字段包含任务、状态、上下文及原始 Issue URL；例如多 NPU GPT torch.compile 标有“硬件、版本、最小复现、日志”，状态“未闭环”。 | 数据：[case-corpus-20260818.json](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/operator-ai-journey-research/evidence/case-corpus-20260818.json)；代表条目：[Ascend/pytorch#154](https://github.com/Ascend/pytorch/issues/154)。报告早期页面 5/5/5 分类与 JSON 不一致，统计应以 JSON 为准。 | 公开案例具体显示问题推进经常依赖环境 / 版本 / 硬件 / 最小复现 / 日志等上下文；可用于任务简报、证据对象和升级闭环的需求分析。 | 15 条公开样本不是总体发生率或满意度调查；Issue 状态不能说明全部服务过程；不应把条目数解释为痛点占比。 | 建模任务上下文最小字段；设计缺项补问、证据收集、状态回执、人工 / Issue 升级与后来者复用时的适用范围确认。 |
| 6 | 三组 CANN × CUDA 对等任务（Add、ONNX 转换、性能分析）的公开检索记录显示：CANN Add 任务可从官方场景页走到 9.0.0 Add 样例，含编译运行命令和 accuracy passed；ATC 学习向导、性能工具介绍入口本身没有完整可照抄命令；CUDA 对应指南承接了连续步骤。 | [ai-usability-run-20260818.md](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/operator-ai-journey-research/evidence/ai-usability/ai-usability-run-20260818.md:1)，三项任务原始链接均列于该记录。 | 支持定位“版本选择、最小命令、验证信号、恢复路径是否在一次任务中连续可得”；可作为检索 / 知识 / Skill / MCP 设计的任务级基线。 | 只代表本轮指定问题、日期和公开页面；不能推成生态总体差距、用户满意度、真实构建成功率或模型总体能力。该记录的分数也不能替代真实用户 UX 评价。 | 设计可引用知识的版本与来源呈现；对缺失命令和验证信号明确告知；把检索、命令、预期结果、失败恢复串成任务流程，验证 AI 回答与证据是否一致。 |
| 7 | 本台账采用 [六平台历史沙盘快照](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ai-development-behavior-system-report.html:1446)，比较 Claude Code、OpenCode、Codex、Cursor、Trae、WorkBuddy 的十类能力 / 机制入口，逐项映射见下表。这是该报告记录的历史快照，不重新验证 2026 年现状。 | [ai-development-behavior-system-report.html:1446–1470](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ai-development-behavior-system-report.html:1446) 的“07 PLATFORM SANDBOX”。旧版五平台沙盘位于另一份材料 [operator-ai-journey-deck/index.html](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/operator-ai-journey-deck/index.html:238)，与本条六平台快照分开保留，不合并、不覆盖。 | 沙盘可支持识别跨平台共性、平台形态差异及不可直接装配的内置机制，并据此提出 UX 研究和设计机会；十类机会点按下方逐项呈现。 | 入口映射只描述该历史快照中的配置或运行形态，不表示使用率、任务成功率、体验质量或建设效果；不据共通数量排名平台。所有建设方向仍是待验证假设。 | 将十类能力 / 机制作为完整设计空间逐项分析，再结合任务证据决定哪些值得投入；不预先指定 Skill、MCP 或专家团为重点。 |
| 8 | 学习画布 Demo 当前有局部的“诊断下一步 → 试改 → Diff → 明确点击后检查”流程；实施状态文档明确本地规则 / 回复为演示、只操作浏览器示例。仍未接入真实 AI、项目写入、真实 C++ / NPU 验证或跨任务复用。 | [proactive-interaction-review.md](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ploy-interaction-lab/learning-canvas-story/proactive-interaction-review.md:1)；[demo-implementation-status.md](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ploy-interaction-lab/learning-canvas-story/demo-implementation-status.md:1)（尤见第 1、4、8、9 节）。 | 可作为“UX 设计工作不止画界面”的可操作原型例子：触发、状态身份、证据快照、撤销、显式验证、未验证边界都需要一起设计。 | 原型检查证明特定浏览器示例行为可运行，不证明真实开发者受益；不能宣称真实 AI 诊断准确、代码已修复或 NPU 验证通过。 | 把意图 / 状态模型、证据与来源、权限动作、取消恢复、验证等级和人工交接作为交付物；下一步用真实任务与用户回放检查这些规则是否可理解、可控。 |

## 六平台沙盘十类入口：逐项 UX 机会与证据边界

以下入口状态仅复述六平台历史快照（Claude Code / OpenCode / Codex / Cursor / Trae / WorkBuddy）。每项“UX 机会”是待验证的问题，不代表该机制已证明有效或应该优先建设。

| 沙盘单元 | 历史快照映射 | 可推导的 UX 机会 | 证据边界 / 后续验证 |
|---|---|---|---|
| 项目规则 / 持久上下文 | 六平台均为 direct，入口名称、作用范围与装载方式不同。 | 让项目约束可发现、可审阅、可说明作用范围；设计规则冲突、缺失和过期时如何提示与修订。 | 入口存在不证明规则被正确加载或提升任务质量；需按任务核对生效状态与错误案例。 |
| 领域知识库 / 检索源 | 六平台均为 direct，涉及项目文件、代码库、文档、MCP 或连接器等不同来源。 | 设计来源范围、版本 / 适用条件、引用回链、冲突提示和检索失败后的补充路径。 | 可配置检索源不证明检索准确或引用可靠；需对照任务测来源正确性、版本匹配和遗漏。 |
| Harness / Agent Runtime | 六平台均为 limit / 内置；OpenCode 可审阅源码，但仍不是独立可装配单元。 | 让用户理解运行状态、当前权限与执行范围；让 UX、工程共同定义调用失败、重试、恢复及证据回填。 | 内置机制不是用户直接配置入口；沙盘不提供内部策略与效果证据，需用运行观察和任务测试补足。 |
| Skill / Workflow | 六平台均为 direct，发现、携带和加载位置不同。 | 研究任务状态如何触发方法、方法需要哪些输入、分支 / 停止 / 验收条件如何可见；按平台适配交付。 | 六个入口共通不代表 Skill 可移植或有收益；需固定任务集比较内容本身与装配方式的贡献。 |
| Command / Prompt | Claude Code、OpenCode、Cursor、Trae 为 direct；Codex 由 Skill / UI 承接，WorkBuddy 用任务模板（两者均为 limit）。 | 设计显式任务入口与对话触发的关系、入口命名、参数补全、取消和重复执行反馈。 | 固定命令存在不代表用户容易发现或适合所有任务；需观察发现率、误触和完成路径。 |
| MCP / Connector | 五个平台为 direct；WorkBuddy 为 install / 授权连接。 | 设计外部事实查询与受控动作的权限、参数、确认、错误、状态及结果回填；区分只读和写入。 | 协议 / 连接入口存在不代表后端数据完整、动作安全或任务完成；需逐工具测数据新鲜度、动作边界和回执一致性。 |
| Plugin / Extension | 五个平台提供 install 形态；WorkBuddy 无同类 Plugin 面，以 Skill / Connector 扩展。 | 让用户理解安装包能带入哪些能力、需要哪些权限、如何更新 / 禁用及排查冲突。 | 安装入口与插件能力差异大，不可同名等同；需明确包内容、权限和版本兼容。 |
| Custom Agent / Subagent / Expert Team | 五个平台为 direct 的 Agent / Subagent 入口；WorkBuddy Expert Team 为 limit，可召唤但不等同自定义 Subagent。 | 设计角色任务边界、上下文 / 工具范围、委派可见性、交接与结果合并；将“专家服务”单独设计为责任、响应和回流流程。 | 配置 Agent 或召唤专家不证明协作质量；专家团只是沙盘中的一例，不自动成为本研究重点；需评估升级判断、证据完整度和用户是否能继续推进。 |
| Hook / Lifecycle | Claude Code、Cursor、Trae 为 direct；OpenCode 由 Plugin Events 承载；Codex、WorkBuddy 本轮未确认。 | 研究可预测的生命周期反馈、执行前后提醒、自动收集证据与用户控制 / 关闭方式。 | “未确认”不等于不存在；不同平台事件边界不一致，需先核实再设计，评估误触发和打断成本。 |
| Agent Loop · 任务内 | 六平台均有 limit / 产品内置或运行时回合；Agent Loop 不等于 Hook、定时任务或跨任务自进化。 | 让行动—观察—再决策的状态、等待、失败、停止和人工接管保持可理解，并让结果成为下一步判断的证据。 | 沙盘只标示运行形态，不证明内部规划质量或停止策略；需用可复现任务观察循环、失败恢复与用户接管。 |

## 六个固定问题名称

沿用既有固定名称，不重命名：

1. 01 可装配能力难以按任务选配并有效使用
2. 02 开发者难以判断和选择下一步行动
3. 03 生成结果的可信性难以验证
4. 04 任务完成不等于开发者能力增长
5. 05 团队难以共享完整的决策背景
6. 06 从论坛发帖到与 AI 对话，问题与解答不再自然沉淀于社区

六题正式名称以当前定稿的 [ai-development-behavior-system-report-concise.html](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ai-development-behavior-system-report-concise.html:2166) `focusQuestions` 为准；旧 [evidence-review.md](/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ai-development-behavior-system-report-evidence/interview-focus-20260928/evidence-review.md:14) 只用于追溯原始证据与取舍，不再作为问题标题权威来源。访谈只直接覆盖 01–04 的若干线索；05–06 的主要已有证据是公开协作案例，而不是上述访谈。

## 正文使用时的证据纪律

- 逐字稿目前是文本转写，未做录音听校；人物原声可作短引文，但需标明单一访谈及时间，不写成群体统计。
- 15 个公开案例分类按 JSON 的 5/6/4；与报告页面旧版 5/5/5 不一致时不沿用旧分类。
- AI 检索对照是三项公开任务的过程证据，不是 NPU 真机测试或用户满意度实验。
- 设计 Demo 的交互结果属于本地模拟 / 原型行为。模拟案例、模拟检查数、关键词命中、静态截图都不能充当真实开发者成效量化。
- 沙盘十类单元均需逐项进入机会分析；Skill、MCP、Expert Team 只是其中示例，不预设优先级。候选 UX 工作和服务规格尚须通过真实接入、任务对照与用户回放验证。
- 平台能力映射仅采用本台账第 7 条所链接的六平台历史快照；不与另一份旧五平台沙盘合并，也不把入口共通数当成效果证据。
