# 学习起步 A / B 图稿审阅（2026-10-20）

本目录为用户要求分别 ImageGen 生成的两张设计提案。用户尚未选择；图片不表示 Demo 已实现或交互已验证。

- A（第 1 张）：`a-free-learning-canvas.png`，自由学习画布。点阵背景、错落的独立内容对象、节点关联、移动与缩放工具、小地图。
- B（第 2 张）：`b-auto-arranged-learning-workspace.png`，自动编排学习工作区。横向可操作 workflow、紧随流程的调整预览、连续图解与代码并排；自由整理为次级入口。

## 比较条件

两图采用同一学习任务“学会图像输入预处理”、同一路径审阅阶段及未确认变更：环境准备拟跳过，保留理解输入维度、跟练维度转换和输入检查。保留项目 / 对话 / 任务内容三栏、红色 Ascend Studio 品牌、浅色中性界面、黑色主按钮和克制的蓝紫色。图解均呈现 RGB、HWC / CHW、batch 和 NCHW，与代码预览关联。

## 来源与生成

通过内置 ImageGen 分别独立生成两图，均实际附入以下本地参考：

1. `cann-dashboard/ploy-interaction-lab/learning-canvas-story/images/A2.png`
2. `cann-dashboard/ploy-interaction-lab/learning-canvas-story/images/A3.png`
3. `ascend-studio/evidence/20261020-learning-goal/01-path-preview.png`

完整提示词见 `prompt-a.txt`、`prompt-b.txt`。原生成文件保留于：

- A：`/Users/hsin/.codex/generated_images/01a15761-b5e9-7762-98b9-bb210e8df015/exec-709f1905-0e34-498b-81e5-75e49283c090.png`
- B：`/Users/hsin/.codex/generated_images/01a15761-b5e9-7762-98b9-bb210e8df015/exec-c1422141-6a2d-44b7-9c84-939a665938be.png`

图片用于评审空间组织与视觉关系。生成文字、示例图和代码不替代真实产品文案、数据、执行或学习效果验证；图中内容均为预览，没有真实 Python / 模型 / NPU 运行结论。本轮没有修改 Demo、Pages 产物或正式材料的页面序列。后续实现须等待用户选定方向。

已知生成文字误差：B 对话的每天 20 分钟与工具行的每天 30 分钟不一致，实施定稿时需统一；本轮只用于布局比较。
