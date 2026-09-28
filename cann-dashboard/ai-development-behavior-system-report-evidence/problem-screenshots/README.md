# 问题页公开证据截图

## 2026-09-28 叙事与来源修订

九题现在以行为变化与具体断点为主图，截图是局部事实旁证，不再由一张截图替整条问题作证明。第 02 题改用 #144 的失败原文局部，第 08 题改用昇腾 #133 的主动经验分享，并以 #29 的跨时间回复作分析证据。采集过程、完整截图、原文与边界见 [本轮证据索引](public-knowledge-scope-evidence-20260928.md)。

- 05 正式名称为“验证与交付”；OpenHands #16988 是自身 CI 汇总缺陷，不是 Agent 会话虚报，不能证明验证成本成为瓶颈。
- 08 正式名称为“公共经验回流”；下表旧 #17524 仅为历史截图，不再用于正式问题页，项目记忆不能替代公共经验回流。
- 01／03／04／06／09 的公开提案与缺陷只支持所标的局部现象；07 的 22 人学习研究差异未显著。AI 带来的实际变化仍待任务研究。
- 当前生效信息在 `problemNarratives`、`storyScenes`、`narrativeAnalyses`；总叙事说明见上一级 `problem-narrative-revision-20260928.md`。

## 2026-09-24 初始采集（保留追溯）

所有截图均为本轮新采集的公开网页画面，采集窗口为 1440×900（Chrome 桌面视口）；图片保留为视口截图，并非整页拼接。截图页面为公开 GitHub issue / pull request 或 arXiv 摘要页；未登录，也未发现遮挡内容的 Cookie / 登录弹窗。图像尺寸已用 `sips` 核验为 1440×900。

这些截图只说明对应页面记录了什么具体现象、需求或研究设计，不能单独证明问题在行业内的普遍程度。尤其是开源项目 issue / RFC，应理解为公开案例或提案；论文结果也按其样本与统计显著性边界呈现。

| 问题 | 截图文件 | 来源与画面重点 | 截取时间（Asia/Shanghai） |
|---|---|---|---|
| 01 任务定义 | `01-task-definition-1440x900.png` | [OpenHands #17496](https://github.com/OpenHands/OpenHands/issues/17496)：提示含糊或缺项引起追加澄清，并提出执行前预览和确认 | 2026-09-24 13:34:28 |
| 02 上下文适用性 | `02-context-applicability-1440x900.png` | [Ascend/pytorch #144](https://github.com/Ascend/pytorch/issues/144)：故障报告携带硬件、soc_version、CANN、PyTorch 等环境组合 | 2026-09-24 13:34:36 |
| 03 能力选择与组合 | `03-capability-choice-1440x900.png` | [OpenHands #15419](https://github.com/OpenHands/OpenHands/issues/15419)：Agent 入口会被误解为模型或认证选择，实际选的是 Harness | 2026-09-24 13:34:44 |
| 04 过程状态与接管 | `04-process-takeover-1440x900.png` | [OpenHands PR #17593](https://github.com/OpenHands/OpenHands/pull/17593)：沙箱准备、仓库克隆期间缺少进行中任务卡片 | 2026-09-24 13:35:49 |
| 05 验证与交付 | `05-verification-1440x900.png` | [OpenHands #16988](https://github.com/OpenHands/OpenHands/issues/16988)：项目 CI 超时导致部分测试未启动，但汇总仍可能报告成功；不证明验证成本 | 2026-09-24 13:36:00 |
| 06 团队共同理解 | `06-team-context-1440x900.png` | [OpenHands #17273](https://github.com/OpenHands/OpenHands/issues/17273)：高风险变更可能需要 Diff 之外的设计背景 | 2026-09-24 13:36:07 |
| 07 开发者能力增长 | `07-learning-1440x900.png` | [arXiv 2604.18538](https://arxiv.org/abs/2604.18538)：22 名新手程序员、Copilot / 人类结对对照和一周后回测；AI 条件回测下降差异未达显著 | 2026-09-24 13:43:50 |
| 08 反馈回流 | `08-feedback-loop-1440x900.png` | [OpenHands #17524](https://github.com/OpenHands/OpenHands/issues/17524)：社区提案指出每轮从零开始会重复学习项目约定与既有错误 | 2026-09-24 13:37:16 |
| 09 责任边界 | `09-responsibility-1440x900.png` | [OpenHands #17055](https://github.com/OpenHands/OpenHands/issues/17055)：共享管理员权限难以限制能力并追踪人员、自动化与服务的动作归属 | 2026-09-24 13:37:24 |

初始截图路径仍保留在 `problemEvidenceOverrides`，由后置叙事数据覆盖正式页的标题、边界与部分截图；当前九题采用“现状 → 分析 → 方案”的结构。
