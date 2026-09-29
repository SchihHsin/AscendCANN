# 问题 01 · Codex 能力装配概念图

生成日期：2026-09-29。使用内置 image_gen，未使用 CLI、HTML 或 SVG 绘制界面。

## 文件

- `01-codex-task-capability-selection-v1.png`：任务条件待确认，三项推荐能力呈现用途、输入与适用条件；右侧只读加载许可，代码修改、构建运行与 NPU 性能评测未授权。
- `02-codex-capability-usage-record-v1.png`：同一工作台的使用记录状态。明确 Skill 加载不等于执行；MCP 为回执结构示例，不是真实查询；性能评测待接 NPU、未运行、无性能结论。

两图仅是交互设计提案，不是现成功能截图、真实工具调用回执或硬件实验结果。A 标注“概念演示”；B 标注“概念演示 · 非真实运行日志”。CANN 版本、芯片型号、验收条件均为“待确认”。

## 构图与参考

近 16:9 横向，两图原生尺寸均为 1672 × 941 PNG（提示词请求高分辨率，但内置工具实际返回此尺寸；未进行插值放大）。Codex 风格；浅灰侧栏、白色主体及右侧检查面板；文字为近黑/灰，克制蓝色强调。画面填满，无设备外框或蓝色桌面背景。

A 参考原有 `../03-codex-capability-assembly.png` 的桌面风格；B 以 A 为界面不变量参考，保持侧栏、任务标题、字号与列宽一致。

## 建议框注坐标

以下是整张 PNG 的百分比坐标 `x/y/w/h`，原点左上，供 HTML 单独叠加注释。

| 图 | 对象 | x | y | w | h |
|---|---|---:|---:|---:|---:|
| A | 任务条件及待确认项 | 18.5 | 28 | 50.2 | 15 |
| A | 三项推荐能力及用途/输入/适用条件 | 18.5 | 46 | 50.2 | 52 |
| A | 只读起步、未授权动作及确认按钮 | 71.3 | 11 | 27.5 | 74 |
| B | Skill 已加载且检查未运行 | 23.8 | 28.5 | 44.8 | 21 |
| B | 文档 MCP 回执结构与来源示例 | 23.8 | 52 | 44.8 | 28 |
| B | 性能评测待接 NPU、无性能结论 | 23.8 | 83 | 44.8 | 14 |

叠加框注时不要遮住“概念演示”“示例”“待确认”“未运行”等边界标签。B 的三个主体状态适合分别聚焦，不要把全部主体和右栏同时圈出。

## 验收

已逐图检查中文、状态与布局。两图保持同任务与同侧栏，主要中文字清楚；未观察到乱码、截字或虚构性能数字。所用来源标签为概念回执字段，不提供伪造链接。

## 最终生成提示词 A

```text
Use case: ui-mockup.
Create a high fidelity raster desktop Codex-style AI workspace concept, state A of a two-state task story. Reference image 1 is STYLE REFERENCE ONLY. Retain its quiet native desktop layout and typography, not its blue outside gradient, unnecessary cards, model labels, or fake successful runtime results.
Output a sharp high resolution 16:9 landscape app screenshot, ideally 3840x2160. The app UI fills every edge of the image. No desktop wallpaper, no device frame, no outer mockup border, no 3D or perspective. Very light gray narrow sidebar (15% width); clean white main workspace (55% width); white right permission inspector (30% width) with hairline dividers. Near-black text, muted gray metadata, restrained solid blue active highlights. Large crisply readable Chinese typography, generous padding, not a waterfall of rounded cards. Native Codex-like spacing and monochrome thin icons.

Exact UI layout and text, do not add any other claims or made-up data:
Sidebar: small wordmark "Codex". Entries "新建任务", "搜索", "项目". One project "Ascend C", active thread "算子性能优化", inactive "历史任务". Bottom small "本地工作区".
Top main task header: "Ascend C 算子性能优化". Top right small but legible label "概念演示".
Under task header a compact navigation row: active "能力组合", inactive "使用记录".
Main content title "为当前任务选择能力".
One short paragraph: "先确认适用条件，再加载方法与只读查询。"
A flat task-context strip, no heavy card: "任务条件" with three compact fields: "CANN 版本  待确认"; "芯片型号  待确认"; "验收条件  待确认". Do not invent specific versions or chips.

Below label "推荐组合" and THREE flat horizontally divided selectable rows, all selected, title and three short lines each:
Row 1 title "性能分析 Skill", small category "方法".
"用途：梳理性能瓶颈与验证路径"
"输入：算子代码、目标 Shape、性能基线"
"适用条件：先确认环境；未运行评测"
Row 2 title "环境检查 Skill", small category "方法".
"用途：检查版本、芯片与依赖是否匹配"
"输入：环境信息与兼容要求"
"适用条件：检查命令需另行确认"
Row 3 title "文档 MCP", small category "只读查询".
"用途：查询官方依据与适用范围"
"输入：问题、版本、芯片"
"适用条件：返回来源；不修改环境"

Right inspector heading "本次权限".
A restrained blue outlined shield icon and text "仅只读起步".
An allowed section "确认后允许" with two lines "加载所选 Skill" and "连接文档 MCP 进行查询".
A separate gray section "尚未授权" with two lines "修改代码、构建与运行" and "NPU 性能评测".
A clear explanatory line "加载方法，不等于已经执行。"
At inspector bottom a solid blue button "确认只读加载", with gray secondary "返回调整".
Footer small readable "设计提案 · 不代表平台现成功能".

Keep all exact Chinese text correct and sparse. No success checkmarks, no fabricated logs, no performance numbers, no green performance improvement. Do not use generated evidence or fake source URLs. Strong alignment, usable whitespace, believable production product screen.
```

## 最终生成提示词 B

```text
Use case: ui-mockup.
Edit the supplied concept UI image to create STATE B of the SAME Codex task. Input image 1 is the reference and base UI. Preserve exact app shell, sidebar, typography, 16:9 composition, near-black and muted-gray type, restrained blue highlights, width of main workspace and permission inspector. Preserve task name "Ascend C 算子性能优化". This is a proposed design, not real logs or product documentation.
Produce a crisp high resolution landscape app screenshot ideally 3840x2160. Fill all image edges with UI. No external frame or desktop background. No gradients, no card waterfall, no invented benchmark values, no success claim. Use flat rows with whitespace, hairline separators, readable precise Chinese.

Changes for state B:
Top navigation: "能力组合" inactive; "使用记录" active in blue.
Top right badge now says "概念演示 · 非真实运行日志".
Main heading "看清能力是否真正被使用".
Subtitle "方法加载、工具调用和真实验证，分别留下记录。"

Main workspace contains a clear vertical activity sequence with three numbered steps, not oversized colored cards. Each row has a numbered circle, a concise status tag aligned right, and content underneath.

Step 01 heading "Skill 方法已加载", status "已加载 · 示例".
Main line "性能分析 Skill  /  环境检查 Skill".
Second line "方法与检查要求已进入任务上下文。"
Emphasized note "加载不等于执行；检查命令尚未运行。"

Step 02 heading "文档 MCP 查询回执", status "只读查询 · 示例".
Content is one realistic compact receipt section with exact fields:
"查询：性能分析前置条件"
"返回：环境、版本与芯片信息要求"
"来源：CANN 官方文档"
"适用版本：待匹配"
Small blue link text "查看原文位置（示例）"
A small light gray annotation: "此处展示回执结构，不是真实查询结果。"
No fake URL or fabricated document version. Display clear visual separation between returned information, source and applicability fields.

Step 03 heading "性能评测", status "待接 NPU" in restrained amber.
Main line "缺少匹配的 NPU 与 CANN 运行环境。"
Prominent dark text "未运行 · 无性能结论".
No charts, no timing values, no green success status.

Right inspector heading "继续前需确认".
A simple outlined document/checklist icon (not success).
Three compact rows:
"CANN 版本" with value "待确认"
"芯片型号" with value "待确认"
"验收条件" with value "待确认"
Divider.
Section heading "当前权限"
Text "只读加载与文档查询"
Secondary note "修改代码、构建与运行仍需授权。"
Divider.
Section heading "下一步"
Text "补齐环境与验收条件后，才能安排真实评测。"
At bottom a blue button "补充任务条件".
Below a disabled light gray button "开始性能评测".
Bottom small "设计提案 · 不代表平台现成功能".

Preserve sidebar exactly: Codex, 新建任务, 搜索, 项目, Ascend C, selected 算子性能优化, 历史任务, 本地工作区.
Render Chinese text verbatim without gibberish. Keep all text inside canvas. The key reading should be visually obvious: Skill loaded is NOT runtime execution; the MCP row demonstrates the structure of a traceable query receipt; NPU assessment has NOT RUN and offers NO performance conclusion.
```
