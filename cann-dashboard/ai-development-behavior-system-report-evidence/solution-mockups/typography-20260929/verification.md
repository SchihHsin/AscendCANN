# 设计图无标注视图与字号比例修正 · 验收

日期：2026-09-29。用户确认 A 方案，并要求 Luna 子 Agent 执行、主代理验收。

## 范围

- 目标：`cann-dashboard/ai-development-behavior-system-report-concise.html`。
- 仍为 27 页；只改变 6 个解决方案页（11、13、15、17、19、22）的交互与其中 3 张图的引用。
- 默认“完整界面”：隐藏外加数字及框；“讲解标注”：点击右侧设计点，仅显示对应的透明描边框。讲解序号保留在图外右侧，不再压在图片上。
- 标注模式独立于业务演示步骤，不增加页数、不增加 hash 后缀、不自动轮播。开关与原有演示步骤共用图下方工具行，窄屏可换行，不在图上再增加整排占位。新业务步骤采用该状态的默认设计点，显隐偏好保留；图片加载中及失败时隐藏标注，旧请求不能把框恢复到新状态。
- 产品界面自身有语义的流程序号不属于外加标注，例如使用记录里的 01–03，仍保留。
- 图稿使用内置 imagegen 编辑；不是 HTML/SVG 绘制。最终资产与完整提示词见同目录 `README.md`。

## 主代理原图验收

直接查看最终 PNG；未通过浏览器重新渲染报告。

| 最终图片 | 验收结果 |
|---|---|
| `../q1-assembly-20260929/01-codex-task-capability-selection-typography-v3.png` | v2 字号改善不足未采用；v3 收小任务标题、正文和控件，保留条件待确认、只读加载、修改/构建/NPU另行授权。3 个框按新内容位置校准。 |
| `../q1-assembly-20260929/02-codex-capability-usage-record-typography-v3.png` | 与选配图相同任务、相同 UI 层级；保留加载≠执行、查询回执示例而非真实结果、版本待匹配、未运行与无性能结论。3 个既有区域框可沿用。 |
| `../02-codex-decision-guidance-typography-v2.png` | 大号区块序号去除，标题/正文收小；定向修正生成中误写的“整数尺寸”为“整块尺寸”。保留失败 Shape、已尝试动作、路线依据、不修改精度阈值的约束。按左右面板和底部确认区重设 3 个框。 |

3 张均为 1672×941，保持原图片占位，不通过缩小整张图片制造小字。字号按与真实工作台参考的相对比例视觉验收；图像生成未精确满足每一处目标像素，按钮仍略宽高，不宣称像素级还原。其他现有方案图不机械统一缩字。

## 离线回归

固定基线：`a0551622c4f8e55f34095668d4386b0b895b5472`。

脚本：`/tmp/ascend-annotation-domtest.yhK9Ug/check-annotation-dom.cjs`。

执行：

```sh
node --check /tmp/ascend-annotation-domtest.yhK9Ug/check-annotation-dom.cjs
node /tmp/ascend-annotation-domtest.yhK9Ug/check-annotation-dom.cjs
git diff --check -- cann-dashboard/ai-development-behavior-system-report-concise.html AGENTS.md
```

- 主代理在 3 张最终图片接入后独立运行：**239/239 通过，0 运行时错误**。
- 非方案 21 页的 runtime DOM 与基线逐字一致，包含第 1–10 页；不归一化空白、页眉、Tab 或页数。
- 覆盖：六页默认隐藏、模式按钮语义、键盘 Enter/Space、单点聚焦、全部业务步骤及图片/alt/hash、直接 hash 恢复、概览与导航。
- 受控图片回调覆盖：加载中、成功、失败、快速 1→2→1 切换、陈旧 onload/onerror；不将新坐标框叠到旧图上。
- 验收曾发现模式按钮的代理 selector 与 slide 状态属性同名，导致点击业务步骤与设计点被祖先节点截获；已收紧为 `button[data-solution-annotation-mode]` 并完整复测。
- 全部本地图片引用存在，内联 JS 语法通过；原图保留，未采用预览不纳入提交。

## 尚未验证

浏览器访问限制未绕过。以上 jsdom 测试禁用外部资源与 iframe 执行，只验证 DOM 与状态逻辑；其合成几何不是视觉证据。整页实际字体、溢出、窄屏排版、图片加载网络体验与 iframe 内容未在浏览器重新验收。

本轮只调整设计提案的展示；不新增用户研究结论，不声称真实 NPU 运行或平台已经实现这些界面。
