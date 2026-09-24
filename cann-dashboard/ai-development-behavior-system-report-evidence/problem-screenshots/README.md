# 问题页公开证据截图

所有截图均为本轮新采集的公开网页画面，采集窗口为 1440×900（Chrome 桌面视口）；图片保留为视口截图，并非整页拼接。截图页面为公开 GitHub issue / pull request 或 arXiv 摘要页；未登录，也未发现遮挡内容的 Cookie / 登录弹窗。图像尺寸已用 `sips` 核验为 1440×900。

这些截图只说明对应页面记录了什么具体现象、需求或研究设计，不能单独证明问题在行业内的普遍程度。尤其是开源项目 issue / RFC，应理解为公开案例或提案；论文结果也按其样本与统计显著性边界呈现。

| 问题 | 截图文件 | 来源与画面重点 | 截取时间（Asia/Shanghai） |
|---|---|---|---|
| 01 任务定义 | `01-task-definition-1440x900.png` | [OpenHands #17496](https://github.com/OpenHands/OpenHands/issues/17496)：提示含糊或缺项引起追加澄清，并提出执行前预览和确认 | 2026-09-24 13:34:28 |
| 02 上下文适用性 | `02-context-applicability-1440x900.png` | [Ascend/pytorch #144](https://github.com/Ascend/pytorch/issues/144)：故障报告携带硬件、soc_version、CANN、PyTorch 等环境组合 | 2026-09-24 13:34:36 |
| 03 能力选择与组合 | `03-capability-choice-1440x900.png` | [OpenHands #15419](https://github.com/OpenHands/OpenHands/issues/15419)：Agent 入口会被误解为模型或认证选择，实际选的是 Harness | 2026-09-24 13:34:44 |
| 04 过程状态与接管 | `04-process-takeover-1440x900.png` | [OpenHands PR #17593](https://github.com/OpenHands/OpenHands/pull/17593)：沙箱准备、仓库克隆期间缺少进行中任务卡片 | 2026-09-24 13:35:49 |
| 05 验证成为瓶颈 | `05-verification-1440x900.png` | [OpenHands #16988](https://github.com/OpenHands/OpenHands/issues/16988)：超时导致测试未启动，但检查仍可能报告成功 | 2026-09-24 13:36:00 |
| 06 团队共同理解 | `06-team-context-1440x900.png` | [OpenHands #17273](https://github.com/OpenHands/OpenHands/issues/17273)：高风险变更可能需要 Diff 之外的设计背景 | 2026-09-24 13:36:07 |
| 07 开发者能力增长 | `07-learning-1440x900.png` | [arXiv 2604.18538](https://arxiv.org/abs/2604.18538)：22 名新手程序员、Copilot / 人类结对对照和一周后回测；AI 条件回测下降差异未达显著 | 2026-09-24 13:43:50 |
| 08 反馈回流 | `08-feedback-loop-1440x900.png` | [OpenHands #17524](https://github.com/OpenHands/OpenHands/issues/17524)：社区提案指出每轮从零开始会重复学习项目约定与既有错误 | 2026-09-24 13:37:16 |
| 09 责任边界 | `09-responsibility-1440x900.png` | [OpenHands #17055](https://github.com/OpenHands/OpenHands/issues/17055)：共享管理员权限难以限制能力并追踪人员、自动化与服务的动作归属 | 2026-09-24 13:37:24 |

实现时使用的图片路径与页面说明，集中维护在 `ai-development-behavior-system-report.html` 的 `problemEvidenceOverrides` 数据中；正式页面的九题顺序与“现状 / 方案”成对结构没有改变。
