# 昇腾社区学习平台 · 交互创新竞品研究笔记

更新时间：2026-08-28

## 研究目的

本轮不再按“学习平台有哪些功能”组织竞品，而是从用户体验工程视角研究：用户如何在一条完整旅程中与目标、AI、学习路径、内容、代码、运行环境、失败状态和学习证据持续互动。

要回答的核心问题：

1. 用户从 Landing Page 进入时，如何用真实任务而不是课程分类表达意图？
2. 系统生成路径前如何暴露理解和假设；生成后用户如何审阅、修改、分支和回滚？
3. 视频、讲解、代码、运行和诊断是否应该共用固定页面框架？
4. AI 如何锚定当前内容、代码选择、运行结果和学习阶段，而不是作为独立聊天窗？
5. 失败后如何经历定位、提示、修复、复跑、验证和再规划？
6. 用户离开后回来，如何恢复任务现场、证据、未决问题和下一动作？

## 与上一版的差异

上一版六个方向是能力 / 产品机制口径：可验证任务合约、版本化 NPU 数字孪生、苏格拉底式共学 Agent、证据型技能孪生、开放挑战网络、失败记忆与同行评审。

它们能解释平台长期能力，却不能直接决定一个界面此刻如何变化。本轮将分析单位改为六个“关键交互时刻”：

1. 意图协商式入口
2. 可共同编辑的活路径
3. 活动驱动的自适应画布
4. 锚定上下文的 AI 介入
5. 从失败到恢复的可见反馈闭环
6. 带证据的继续学习入口

技能孪生、开放挑战和社区贡献仍可作为长期能力，但暂不进入 Landing / 学习旅程的优先原型。

## 端到端用户旅程

| 阶段 | 用户目标 | 主要触点 | 关键交互问题 |
|---|---|---|---|
| 1. 表达目标 | 把真实任务说清 | Landing、自然语言输入、用途 / 项目入口 | 用户需要写多具体；系统如何补问 |
| 2. 预览与生成 | 理解系统准备生成什么 | 任务简报、假设、路径骨架 | 生成依据是否可见；成本和风险是否清楚 |
| 3. 审阅与调整 | 取得路径控制权 | 路径编辑、Diff、分支 | 能否锁定节点；修改是否局部生效 |
| 4. 学习与运行 | 边理解边验证 | 视频、讲解、代码、HiDevLab | 页面是否随活动变化；AI 是否锚定上下文 |
| 5. 失败与再规划 | 在当前现场恢复 | 错误、提示、诊断、复跑 | 是否逐级提示；失败是否更新路径 |
| 6. 验证与续学 | 带着证据继续 | 验收回执、继续学习入口 | 是否恢复现场；下一动作是否有理由 |

当前旅程图是基于 Demo 走查和公开竞品的启发式判断（M / L），不是用户研究事实；后续需要真实用户回放校准情绪和问题强度。

## 六个交互方向与竞品证据

### 方向 1 · 意图协商式入口

| 竞品 | 已验证页面信号 | 可借鉴的交互原则 | 证据 |
|---|---|---|---|
| roadmap.sh AI Tutor | 中央问“你想学什么”，提示更多细节会产生更个性化路线 | 允许用自由目标开始；先表达、后结构化 | H |
| Memrise | 先问考试、工作、关系、保持活跃等真实用途 | 目的先于课程目录 | H |
| Hyperskill | Project-first；用真实项目承载学习 | 目标产物也可以是意图输入 | H |

方向判断（L）：Landing 应允许目标、用途或目标产物进入；系统把输入转为可见任务简报，只追问会改变路径的问题。用户不必先写“完美 Prompt”。

### 方向 2 · 可共同编辑的活路径

| 竞品 | 已验证页面信号 | 证据边界 | 证据 |
|---|---|---|---|
| roadmap.sh AI | 同一入口可生成 Plan、Roadmap、Course、Guide、Quiz | 支持“路径是可生成对象”，未证明节点 Diff | H |
| Sana Learn | AI-native learning 平台定位 | 公开营销页不能证明拖拽、分支、回滚 | H（定位） |
| CodeSignal Learn | Learning Paths、Collections 与 Cosmo 对话入口并存 | 未显示路径共同编辑 | H |

方向判断（L）：当前公开证据未找到同时具备“自然语言目标 + 结构化路径 + 节点级操纵 + 版本 Diff”的完整范式。这是本轮最明确的市场空白。

目标交互：

- 生成前预览任务简报和路径骨架。
- 节点可锁定、删除、移动、替换和分支。
- 修改后显示新增 / 移除 / 成本 / 风险 Diff。
- 失败只触发受影响分支的局部重规划。
- 用户确认过的节点不会被 AI 静默覆盖。

### 方向 3 · 活动驱动的自适应画布

| 竞品 | 已验证页面信号 | 可借鉴的交互原则 | 证据 |
|---|---|---|---|
| Scrimba | 从 Fullstack Path 点击 Watch Preview 后进入文件、主画布、Terminal、运行预览与 Explain 同屏的课程工作区 | 内容直接变成可操作现场 | H |
| KodeKloud | 任务 / 提示与 Terminal 同屏；Build · Break · Fix · Learn | 运行环境成为主画布 | H |
| CodeGrade | IDE、测试、评分和反馈连续发生 | 反馈贴近刚刚完成的动作 | H |

方向判断（L）：保持路径上下文，但不固定三栏宽度。看视频时视频最大，读概念时正文最大，运行时 Lab 最大，诊断时错误链和证据最大；用户可以固定常用布局。

### 方向 4 · 锚定上下文的 AI 介入

| 竞品 | 已验证页面信号 | 可借鉴的交互原则 | 证据 |
|---|---|---|---|
| Khanmigo | “Deep learning, no answers”板块明确说明引导解题和追问，而不是直接给答案 | 维持思考过程 | H |
| Duolingo Max | Roleplay 板块展示会话入口，并说明挑战与学习路径并列 | AI 反馈发生在情境内 | H |
| Brilliant | “Built to make you think / Adapts to exactly where you are”板块将可操作题目与引导文案并置 | 提示贴着当前卡点出现 | H |

方向判断（L）：AI 介入应绑定当前讲解、代码选区、运行结果和路径节点，并按“诊断问题 → 最小线索 → 局部示例 → 完整解释”逐级展开。采用或拒绝的提示会影响后续提示强度和路径。

### 方向 5 · 从失败到恢复的可见反馈闭环

| 竞品 | 已验证页面信号 | 可借鉴的交互原则 | 证据 |
|---|---|---|---|
| Frontend Mentor | 真实项目、AI code review、技能画像和同行反馈 | 反馈锚定具体产物 | H |
| Codewars | “Compare your solution with others after each kata”板块明确连接多解比较、讨论与最佳实践 | “通过”之后仍可理解策略差异 | H |
| GitHub Discussions | 分类、标签、Answered 状态 | 恢复经验具有明确问题状态 | H |

方向判断（L）：错误必须经历定位、最小提示、修复、复跑、验证和更新路径。成功修复后，证据、适用条件和已尝试动作留在当前任务现场。

### 方向 6 · 带证据的继续学习入口

| 竞品 | 已验证页面信号 | 可借鉴的交互原则 | 证据 |
|---|---|---|---|
| Workera | Verified skill signal 与能力发展关联 | 用证据解释下一步 | H |
| Pluralsight | Skill IQ 连接推荐、Labs 和 Sandboxes | 能力状态驱动下一动作 | H |
| Microsoft Applied Skills | 真实任务能力与聚焦凭证关联 | 任务证据可以跨会话保留 | H |

方向判断（L）：继续学习页优先恢复最后现场、已经通过的证据、未决问题、路径变化和建议下一动作；“完成 43%”是次要信息。

## 跨案例规律

1. 任务语言优于课程语言：目的、目标产物和真实项目更接近用户心智。
2. 反馈越靠近动作越有效：提示、测试和诊断应贴着内容、代码和运行结果出现。
3. 控制权需要渐进交接：AI 可以先生成，但用户必须能审阅、锁定、修改并理解影响。
4. 恢复比推荐稀缺：多数产品会推荐下一课，较少产品能恢复失败现场、路径变化与证据。

## 优先级建议

六个关键时刻都应保留在完整旅程中，但下一轮核心原型只验证三组交互：

1. **活路径**：合并“意图协商 + 路径共编”。这是当前 Demo 最核心的未解问题，也是公开竞品中最明显的空白。
2. **活画布**：活动驱动布局，直接回应固定框架和空间浪费问题。
3. **可恢复 AI**：合并“上下文介入 + 失败恢复”。AI 不单独做聊天功能，而是帮助用户恢复并局部调整路径。

“续学恢复”作为以上三组交互共同产生的结果，不单独做孤立功能。

下一版 Demo 建议由六个不同界面承载：

1. 学习 Landing
2. 任务简报与路径预览
3. 路径共编
4. 自适应学习画布
5. 诊断与恢复画布
6. 验证与继续学习

这些界面共享任务和路径状态，但不共享一套固定页面框架，也不需要在顶部用横栏展示流程步骤。

## 新增截图与来源

截图目录：`evidence/interaction-competitors/`

| 文件 | URL | 状态 |
|---|---|---|
| 19-roadmap-ai.png | https://roadmap.sh/ai/roadmap | 成功；实际 AI Tutor 界面 |
| 20-sana-ai.png | https://sanalabs.com/ | 成功；公开营销页，仅支持定位判断 |
| 21-scrimba.png | https://scrimba.com/ | 成功；课程 / 路径 / Explain 界面 |
| 22-codesignal-learn.png | https://codesignal.com/learn/course-paths | 成功；Learning Paths / Collections / Cosmo |
| 25-kinnu.png | https://www.kinnu.xyz/ | 成功；营销页，未纳入核心证据 |
| 26-mimo.png | https://mimo.org/ | 成功；营销页，未纳入核心证据 |
| 27-hyperskill.png | https://hyperskill.org/ | 成功；Project-first 页面 |
| 28-exercism.png | https://exercism.org/ | Cloudflare 验证页；排除 |
| 29-codecademy.png | https://www.codecademy.com/ | 成功；学习工作台信号不足，未纳入核心证据 |
| 30-freecodecamp-learn.png | https://www.freecodecamp.org/learn | 成功；固定 curriculum 对照，未纳入核心页 |
| 31-sololearn.png | https://www.sololearn.com/en/ | 成功；营销页，未纳入核心证据 |
| 32-memrise.png | https://www.memrise.com/ | 成功；真实用途入口 |
| 33-kodekloud.png | https://kodekloud.com/ | 成功；任务 / 提示 / Terminal 强证据 |
| 34-frontend-mentor.png | https://www.frontendmentor.io/ | 成功；项目 / AI review / 同行反馈 |
| 21d-scrimba-preview.png | https://scrimba.com/fullstack-path-c0fullstack | 成功；点击 Watch Preview 后的课程工作区 |
| 07b-khanmigo-no-answers.png | https://www.khanmigo.ai/learners | 成功；下钻到 Deep learning, no answers 板块 |
| 08b-duolingo-roleplay.png | https://blog.duolingo.com/duolingo-max/ | 成功；下钻到 Roleplay 板块 |
| 09b-brilliant-adapts.png | https://brilliant.org/ | 成功；下钻到 tutor / adaptive guidance 板块 |
| 16b-codewars-solutions.png | https://www.codewars.com/ | 成功；下钻到多解比较板块 |

每张新增截图均有同名 JSON 元数据，目标视口为 1440×900。

## 访问失败与禁止推断

- OpenAI Study Mode 与 Google Learn About 本轮浏览器 / 截图超时，没有可复核页面，不纳入证据。
- Exercism 截图是 Cloudflare 验证页，不能用于产品机制判断。
- 未登录竞品账户，也未完成付费功能端到端实测。公开页面没有展示的拖拽、Diff、回滚、提示策略和恢复逻辑，不得写成竞品事实。
- 所有方向页均为设计假设（L），不是已经实现或证明有效的结论。
- 本机没有匹配 NPU / CANN 真机环境，不能声称运行、性能或精度已验证。

## 建议验证

1. 生成后路径调整：对比“重新生成”与“节点编辑 + Diff”。
2. 固定布局 vs 活动画布：比较视频、代码、运行和诊断任务中的切换成本与空间利用。
3. AI 提示与失败恢复：制造同一版本冲突，对比自由聊天、上下文提示阶梯和完整恢复闭环；隔日继续同一任务。

先用 8–12 位不同基础的开发者做定性测试，再用约 20 人同任务对照验证方向信号。
