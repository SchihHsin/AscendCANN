# UX 工作变化：一手来源摘录

检索日期：2026-10-13。以下摘录来自命令行可读取的原文。引文保留英文原句；中文释义是工作笔记，不是原文翻译认证。来源能说明设计问题、研究方法或协议能力，不自动证明某项工作由 UX 设计师单独负责，也不证明使用某方法必然有效。

## 1. 人类监督 AI 的工作与共创研究

- **来源：** Cedric Faas 等，*Design Considerations for Human Oversight of AI: Insights from Co-Design Workshops and Work Design Theory*，arXiv:2510.19512v1，2025-10-22。会议 / 同行评审状态：未确认；PDF 页面残留未完成的会议模板字段，须谨慎引用。
- **URL：** [arXiv HTML 原文](https://arxiv.org/html/2510.19512) · [摘要与版本记录](https://arxiv.org/abs/2510.19512v1)
- **检索：** 2026-10-13；HTML 正文可读取。
- **逐字摘录：** “We first conducted four co-design workshops in which domain experts from different backgrounds (i.e., computer science, psychology) oversaw an AI-based grading system for student tests. Reflecting on their own approaches and experiences during the oversight task, participants discussed their needs and requirements for an oversight interface. They then critically engaged with these requirements by designing concrete paper prototypes.”
- **释义：** 研究先让领域专家执行监督任务、回顾体验和需求，再共同做纸面原型；设计对象涵盖监督者的职责、AI 理解、任务意义与协作关系，不限于屏幕控件。
- **可支持的具体设计工作：** 研究方案可以把真实任务观察、角色 / 责任澄清、体验复盘、需求归纳和低成本原型连成一条证据链；设计评估可检查人是否知道自己应检查什么、何时介入，以及如何与同伴 / AI 协作。
- **限制：** 这是单一情境（学生作业评分）的定性研究；正文报告 4 个工作坊、12 位有相关评分经验的计算机科学 / 心理学参与者。它提出设计考虑，不等于验证这些设计提升了监督准确率或适用于所有开发 Agent 场景；论文的会议模板字段未清理，出版状态需要后续复核。

## 2. MCP Tools：工具发现、调用与用户交互边界

- **来源：** Model Context Protocol Specification，*Tools*，版本路径日期 2026-07-28（`latest` 当前重定向至该版本）。
- **URL：** [规范原文](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- **检索：** 2026-10-13；原始 Markdown 可读取。
- **逐字摘录：** “However, implementations are free to expose tools through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.”
- **释义：** MCP 定义工具协议，不替宿主规定工具必须怎样呈现给用户。
- **可支持的具体设计工作：** 结合下一段 SHOULD 要求，设计工具清单 / 说明、调用状态提示和有风险操作的确认点；把工具是否可见、何时可调用、调用后返回什么证据，作为宿主产品的体验决策来研究。
- **原文中的相关要求：** 同页建议（SHOULD）界面说明暴露给模型的工具、在工具调用时给出清晰视觉提示，并对操作提供确认提示。
- **限制：** 这是协议级规范建议，不是可用性研究或角色分工证据；明确允许实现方选不同交互模式。不能据此断言 UX 设计师拥有工具权限、后端路由或安全策略，也不能把 SHOULD 写成所有实现的强制行为。

## 3. MCP Elicitation：任务过程中补充信息

- **来源：** Model Context Protocol Specification，*Elicitation*，版本路径日期 2026-07-28。
- **URL：** [规范原文](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation)
- **检索：** 2026-10-13；原始 Markdown 可读取。
- **逐字摘录：** “MCP clients MUST: Provide UI that makes it clear which server is requesting information; Respect user privacy and provide clear decline and cancel options; For form mode, allow users to review and modify their responses before sending.”
- **释义：** 当工具工作流需要向用户补充信息时，客户端需要标明请求来源，并让用户能够审阅、修改、拒绝或取消；涉及敏感凭证时还要使用 URL mode，而不能从普通表单索取。
- **可支持的具体设计工作：** 为缺少的任务条件设计“为什么需要 / 谁在问 / 答案如何使用”的说明；设计可回看、修改、拒绝和退出的补充信息流程；按敏感度区分站内表单与外部授权流程。
- **限制：** 规范定义协议能力和客户端义务，不给出字段措辞、视觉布局、请求时机或最佳流程的实证结论；不能仅凭这段推断某类信息确实必要，仍需领域规则和用户研究。

## 4. MCP Client Best Practices：大量工具下的渐进发现

- **来源：** Model Context Protocol Documentation，*Client Best Practices*，版本路径日期 2026-07-28。
- **URL：** [原文](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices)
- **检索：** 2026-10-13；原始 Markdown 可读取。
- **逐字摘录：** “The layered principle (catalog, inspect, execute) applies regardless of retrieval mechanism.”
- **释义：** 当工具规模增大时，可先呈现 / 检索轻量目录，再查看候选工具的完整定义，最后执行；指南讨论渐进发现，以避免将所有工具定义一开始都塞入模型上下文。
- **可支持的具体设计工作：** 针对 Skill / MCP 能力目录，研究用户或 Agent 如何从任务目标定位候选能力、比较适用范围、检查参数与输出，再进入调用；把目录、详情、执行和结果回执拆成可测试环节。
- **限制：** 页面面向 MCP host / client 实作者，论据聚焦上下文容量、延迟和工具选择，不是人类用户界面指南，也没有证明某种目录 UI 会提升用户理解或成功率。这里的 catalog / inspect / execute 是实现模式，不是 UX 职责分配结论。

## 可访问性与引用边界

- 指定的 Microsoft Research *Guidelines for Human-AI Interaction* 与 *HAX Toolkit* 页面，本次命令行请求均返回 HTTP 403；ACM DOI 页面被 Cloudflare challenge 拦截。Crossref 可确认 *Guidelines for Human-AI Interaction* 的题名、作者及 2019-05-02 日期，但未提供摘要。因此本笔记不引用该论文中的 18 条指南，也不把二手记忆当作原文。
- Google PAIR Guidebook 指定链接返回 PAIR Guidebook 应用壳，未取得 `Feedback & Controls` 章节原文；该章节不纳入本轮摘录。
- MCP 的 3 份文档属于同一协议生态，不是 3 个独立用户研究。它们主要说明协议和宿主实现中的交互约束 / 设计空间；UX 工作归属、用户效果与昇腾场景适配仍需另外研究。

## 给正文的使用建议

适合正文使用：监督工作设计论文可支撑“UX 研究对象扩展到人的任务、责任、AI 理解、意义感与协作关系”，并展示“实际任务 → 反思讨论 → 需求 → 纸面原型”的研究方法；MCP Tools、Elicitation 与 Client Best Practices 可支撑“调用体验需要宿主在能力发现、参数补充、授权 / 确认和结果状态上作出设计决定”，但应标为协议 / 实现约束，不归结为 UX 单人负责。

HAX 的 18 条指南、HAX Playbook 不确定 / 失败场景卡，以及 PAIR 控制与反馈章节在本轮未能读取可核对的原文，暂不宜作为带逐字引文的正文依据。恢复可访问原文后再补卡；在此之前，可将其留作待核来源，而不是推导事实。
