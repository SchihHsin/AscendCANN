# 空间画布学习体验 · 两条完整故事线

[打开网页 PPT](https://schihhsin.github.io/AscendCANN/cann-dashboard/ploy-interaction-lab/learning-canvas-story/index.html)

28 页；#2–5 均为真实产品参考分析：用户提供的 Ploy Overview、官方权限设置、对话与产物同屏、对象标注。支持放大与来源跳转；封面也不再使用自有设计图。#6 起进入用户旅程，#7 起展示方案大图。既有 Ploy 研究 #17 / #18 提供入口，原交互 Demo 保留。

| 内容 | 页码 |
|---|---|
| 封面 | 1 |
| Ploy 主动建议与权限 | 2–3 |
| Workspace 与学习画布设计依据 | 4–5 |
| 主动学习目标旅程 | 6 |
| A1 表达目标 | 7–8 |
| A2 调整路径 | 9–10 |
| A3 理解内容 | 11–12 |
| A4 跟练验证 | 13–14 |
| A5 完成保存 | 15–16 |
| 开发中学习目标旅程 | 17 |
| B1 发现问题 | 18–19 |
| B2 展开学习 | 20–21 |
| B3 隔离跟练 | 22–23 |
| B4 应用修改 | 24–25 |
| B5 返回验证 | 26–27 |
| 共用画布管理机制 | 28 |

## 内容边界

- 设计方案，不是竞品事实，也不是可运行的 Workspace。图中的文件、视频、AI 和检查状态均为模拟。
- 主动学习的完成范围是图像输入预处理；开发中学习完成后，项目输入检查通过，完整推理仍待执行。
- 情绪尚未实测，旅程页不编造情绪曲线；风险是基于本轮讨论的设计假设。
- 图片保留高保真 GUI 示意，代码片段仅服务界面状态说明，不作为可执行教程或真实 NPU 验证。
- 拖拽、AI 操作动画、路径修改预览和原位恢复尚待代码原型实现。本轮不更新既有 Demo。

## 文件与复现

- `images/codex-workspace-user.png`：用户提供的 Codex Workspace 界面参考，用于第 4 页的 Vibe Coding / AI Workspace 背景说明。
- `images/A1.png`–`A5.png`、`B1.png`–`B5.png`：新的完整故事线图片；旧稿不覆盖。
- `story-data.mjs`：每步操作、响应、设计点、画布规则和下一步。
- `source/image-prompts.json`：内置 ImageGen 提示词、最终图映射及修正记录。
- `source/deck-template.html`、`source/user-journey-template.html`：Report PPT Skill 原始模板快照。
- `build.mjs`：模板派生与内容组装，运行 `node build.mjs` 生成 `index.html`。

设计取舍：大图页占 83vh 且使用 contain 完整显示；说明放到紧随其后的页面，保留详细解释。用户阅读时不自动重排；对照、折叠、收纳及恢复都由可辨识动作触发。
