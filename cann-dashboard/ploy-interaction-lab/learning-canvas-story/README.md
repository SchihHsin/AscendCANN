# 空间画布学习体验 · 两条完整故事线

[打开网页 PPT](https://schihhsin.github.io/AscendCANN/cann-dashboard/ploy-interaction-lab/learning-canvas-story/index.html) · [直接阅读共用机制（31–38页）](https://schihhsin.github.io/AscendCANN/cann-dashboard/ploy-interaction-lab/learning-canvas-story/index.html#31)

共38页。前30页保留产品参考、两条目标旅程及早期界面提案；31–38页集中说明跨业务共性交互。正式设计说明以HTML为主，Markdown保留实现追踪和检查记录。

| 内容 | 页码 |
|---|---|
| 封面 / 问题陈述 | 1–2 |
| Ploy主动建议与权限 / Workspace参考 | 3–6 |
| 主动学习目标旅程 | 7 |
| A1 表达目标 | 8–9 |
| A2 调整路径 | 10–11 |
| A3 理解内容 | 12–13 |
| A4 跟练验证 | 14–15 |
| A5 完成保存 | 16–17 |
| 开发中学习目标旅程 | 18 |
| B1 发现问题 | 19–20 |
| B2 展开学习 | 21–22 |
| B3 隔离跟练 | 23–24 |
| B4 应用修改 | 25–26 |
| B5 返回验证 | 27–28 |
| B6 任务中试改 | 29–30 |
| 共通卡片结构与对象身份 | 31 |
| 按意图主动出现 / 就近提示 | 32 |
| 当前、总览、对照与整区收起 | 33 |
| 主题分类、关联与历史 | 34 |
| 条件版本、采用与检查 | 35 |
| 对照、固定参考与窄栏适配 | 36 |
| AddCustom / 图像推理共通映射 | 37 |
| Demo实现范围与评审路径 | 38 |

## 内容边界

- 两条故事线是目标体验提案；原图保留早期设计，不是当前Demo截图或真实执行证据。图中仍可能有历史术语与布局，现行共通行为以31–38页为准。
- 不新增学习中心或强制学习组；解释、试改与学习按需发生在原任务中，右侧不常驻自由画布。
- 统一对象身份、查看与管理动作；图解、代码、网页、Diff、视频按业务组合正文，无需全部走修改或检查流程。
- 当前Demo已实现两任务的共通管理，详见第38页。视频与图解、学习起步、图像专属主动提示、能力匹配及官网／GitCode协作仍需补齐。
- 示例预览、修改应用、范围核对分别记录；没有真实工程写入、Python／CANN编译、模型推理或NPU验证，不声称完整任务已运行成功。
- 目标旅程与设计收益仍待用户回放验证；本地操作取证不等于用户效果研究。

## 文件与复现

- `index.html`：正式阅读入口，含完整翻页、概览、全屏和hash恢复。
- `shared-interaction-pages.mjs`：31–38页的交互规则、HTML结构图、映射与实现范围。
- `story-data.mjs`：A1–A5、B1–B5的用户操作、响应、设计点及下一步。
- `intro.mjs`：产品参考分析；`images/`：参考与11张故事线设计图。
- `build.mjs`：内容组装，运行 `node build.mjs` 生成 `index.html`；页数随内容计算。
- `source/deck-template.html`、`source/user-journey-template.html`：Report PPT Skill通用模板快照。
- `content-management-design.md`：讨论和实现过程；`demo-implementation-status.md`：范围跟踪；`QA.md`：材料检查记录。

六问题报告的问题02、问题04仅保留共性交互摘要及本章链接，完整规则集中在本HTML中维护。构建源已同步既有B1/B2/B6主动展开与图解内调参文字，重新生成不会回退到旧说明。
