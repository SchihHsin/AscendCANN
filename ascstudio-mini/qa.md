# 交互与视觉核验 · 2026-10-27

结果：通过。浏览器交互原型，无原生微信运行器或 NPU 执行。

## 核验环境

- Codex 内置浏览器，静态 HTTP 预览。
- 手机宽度 320、390、430px；桌面 1440×1000。
- 320 / 430px 文档宽度等于视口宽度，320px 下交互控件无横向越界。
- 首访使用默认训练任务；另一独立本地来源验证已有收藏与小结的恢复。

## 已检查

- 首页搜索即时过滤、无结果、清空、分类、换组入口与任务上下文。
- 从任务页选择算子任务后，首页改为对应上下文，首卡改为尾块知识。
- 扩展效率：4卡为3.32倍 / 83%，切至8卡为5.44倍 / 68%。均为图解示例。
- 有效 Batch：默认4×4×2=32；每卡Batch改为8，得到64。
- 梯度同步：本地2/4/6/8 → 聚合后每卡5 → 参数更新。
- 混合精度切换、数据 / 模型并行切换、HWC / CHW轴与形状切换。
- 尾块：33元素 / 块长32得到2块、末块1；65元素得到3块、末块1。
- 理解题错答反馈、改答后通过、即时显示已理解。
- 收藏、学习进展、编辑并保存的小结在刷新后保留；任务小结不串到其它任务。
- 电脑端接续内容包括任务目标、已理解内容与保存的小结；复制后浏览器剪贴板内容匹配。
- 弹窗打开时背景inert，Escape关闭；关闭回到原任务。
- 控制台没有页面error / warn。
- 五个不同的延伸阅读URL均返回HTTP 200。
- `node --check app.js` / `node --check knowledge.js`通过；数据完整性检查通过（7张卡、3项任务，ID、关联、题目答案索引、HTTPS来源合法）。

## 截图

- `evidence/home-mobile.png`：390×844，首访首页。
- `evidence/home-desktop.png`：1440×1000，桌面评审壳。
- `evidence/knowledge-mobile.png`：知识卡详情与交互图解。
- `evidence/task-mobile.png`：任务进展与相关知识。
- `evidence/handoff-mobile.png`：可编辑的电脑端接续小结。
- `evidence/weekly-briefing-320.png` / `evidence/weekly-briefing-mobile.png`：周报在 320 / 430px 手机视口。
- `evidence/weekly-briefing-desktop.png`：桌面评审窗口中的小程序周报。
- `evidence/knowledge-signal-mobile.png`：知识卡的兴趣 / 疑问信号区域。

## 演示边界

本版为移动浏览器中的小程序交互Demo。示例任务、规则推荐与原理图解在本地运行；收藏和学习记录存储在当前浏览器。电脑端接续通过复制小结与问题完成，无跨设备后台同步。


## 2026-10-27 · 每周速览与知识卡信号

- 新增周报页面与知识卡信号区后，用本地静态服务器和 Chrome 移动视口截屏检查 320px、430px。两种视口的 `document.documentElement.scrollWidth` 均与视口宽度一致；截图可见重点内容和两张相关卡，无横向溢出。
- 页面包含主题偏好（昇腾开发 / 训练调优 / 算子实践 / AI 应用）、周几与时间选项、微信授权样式弹窗和知识卡信号区。
- 当前周报内容是静态示例。真实持续推送受小程序类目与可用长期订阅模板限制；授权界面不调用微信 API。

## 2026-10-27 · 微信服务通知主路径

- Demo 默认从微信会话列表开始，服务通知以一条未读消息呈现；打开消息后进入通知详情，再点击「查看本周速览」进入内容页。
- 速览设置中的确认动作会模拟授权和新消息送达，返回会话列表后显示未读数；再次打开通知会清除未读状态。微信导航栏只出现在会话列表，不显示为小程序底部的「速览」入口。
- 通知正文、资讯和个性化卡片均为静态 / 本地示例；当前没有调用微信 API、真实定时器或后台推送。当前修订检查了路由与事件实现，并通过 JS 语法和 diff 格式检查；没有执行浏览器端完整回归。

## 2026-10-27 · 五个设计点逐屏讲解

- 桌面预览左侧随当前路由切换讲解文案，并提供「上一屏 / 下一设计点」控制；导航覆盖微信消息列表、服务通知、每周速览、知识卡信号、订阅设置。进入第五步时通过速览页打开订阅弹层；移动端仍保留小程序原生交互路径。
- 验证：`node --check app.js`、`node --check knowledge.js`、`git diff --check` 通过。未完成浏览器端的逐屏点击回归，未生成新截图。

## 2026-10-27 · Pura X View 阔直板样机

- 桌面预览使用单屏直板外框，不含折叠轴或内外屏。标准尺寸 420×696 CSS px，宽高比约 0.603；华为规格为机身宽 87.0 mm、长 144.1 mm，宽高比约 0.604；6.39 英寸屏幕规格见[官方页面](https://consumer.huawei.com/cn/phones/pura-x-view/specs/)。该外框只近似机身比例，不声称精确还原工业设计。
- Chrome 桌面视口 1440×1000 回放速览页并检查截图；设备外形保持宽直板比例，正文在更短屏幕内自然滚动。修正讲解栏步骤标签样式，避免被圆点规则压缩为竖排。
- 更新 `evidence/weekly-briefing-desktop.png`。验证：`node --check app.js`、`node --check knowledge.js`、`git diff --check` 通过；未运行自动化测试。

## 2026-10-28 · 核心学习主线、主动回访章节与 HarmonyOS 状态栏

- 手机无路由初始进入「发现」；桌面评审分为「核心学习」3 点（任务发现、知识卡微学习、任务接续）与「主动回访」4 点（微信列表、通知、每周速览、订阅设置），默认顺序以学习体验为主。桌面总览提供两章七屏缩略图；上/下沿显隐、快捷键、总览焦点循环和 `?point=7#briefing` 均已核对。
- Chrome 156 本地 HTTP 预览，桌面 1440×1000；总览 7 个缩略 iframe 全部加载、无嵌套总览，弹层高度 760px 且不需内部滚动。将通知状态设为 `noticeRead:false` 后加载总览缩略图，localStorage 内容保持不变。键盘到第七步打开订阅设置，弹层打开时方向键不切屏，Escape 关闭；确认订阅后回到微信列表并显示未读提示。聚焦手机内搜索框时，O 与方向键不会触发桌面演示快捷键。
- 手机视口 320 / 390 / 430 × 844：文档宽度等于视口宽度，桌面演示控件和模拟系统状态栏隐藏，正文仍可滚动。未检测到浏览器 JS error。
- 样机状态栏将原来的 `9:41` 与单独信号 / Wi-Fi / 电池图形改为 `10:08`、5G、信号、Wi-Fi、电量百分比与电池图标；属于 HarmonyOS 常见信息排列的概念示意，不是 Pura X View 实机截图。更新 `evidence/home-desktop.png` 和 `evidence/review-overview-desktop.png`。
- 验证命令：`node --check ascstudio-mini/app.js`、`node --check ascstudio-mini/knowledge.js`、`git diff --check` 通过；未运行自动化测试。

## 2026-10-28 · 滚轮翻设计页

- 桌面评审区支持鼠标滚轮 / 触控板上下滚动切换七个设计点，保留右侧节点、底部控制栏与键盘翻页。手机样机内容仍可在可滚动范围内自然阅读；到达内容边界后再切换讲解页。总览、订阅设置和输入控件内不触发材料翻页。
- 手机视口不注册材料翻页行为，保持原生内容滚动。
- Chrome 本地回放：桌面 1440×1000 下，滚轮将 01/07 切到 02/07；同一惯性手势没有连跳，下一次滚动进入 03/07。鼠标停在手机内容区时先滚动内容，到底后切至下一设计点；第 07/07 订阅设置打开时，滚轮不会关闭弹层或切页。
- 390×844 手机视口中，滚轮仍滚动手机正文；路由不因材料分页改变，`document.documentElement.scrollWidth` 为 390px。页面未捕获到 JS exception。
- 截图：`evidence/review-wheel-desktop.png`。`node --check ascstudio-mini/app.js`、`node --check ascstudio-mini/knowledge.js`、`git diff --check` 通过；未运行自动化测试。
- 主线提交 `8e8195c3` 已推送；GitHub Pages workflow `40543693742` 成功。线上 HTML 与 `app.js` 均 HTTP 200，已核对翻页提示与 wheel listener 已发布。

## 2026-10-28 · 电脑端知识口袋与微信送达

- 电脑端 Agent 回答与当前学习内容可收进统一知识口袋；用户在口袋里标记「感兴趣 / 还没弄懂」，再选择「发到微信，现在看」或「加入定期速览」。手机端收到同源 localStorage 中的条目，在微信消息列表显示未读服务通知；点开通知进入手机短读卡。已安排的条目优先补入每周速览；「我的」页增加「电脑端收来」列表。
- 浏览器人工回放：1440×940 桌面样机验证收纳、信号切换、安排速览、立即送达；手机端验证微信未读行、通知详情、短读卡与「我看懂了」状态回写。390×844 手机视口中，微信列表与短读卡的 `scrollWidth` 均为 390px。已核对学习对话回答入口与学习内容工具栏入口。
- 截图：`evidence/knowledge-pocket-desktop.png`、`evidence/wechat-notification-list.png`、`evidence/knowledge-pocket-phone-card.png`。周报示例资讯仍为静态策划素材。电脑与手机在同一浏览器中用同源 localStorage 演示共享；未实现不同设备账号同步、真实微信消息或后台定时推送。
- rebase 到最新主线 `a6681665` 后重新构建：`cd ascend-studio && npm run build:pages` 成功，当前 `/ascstudio/` 引用 `index-SON5PQr8.js` 与 `index-e9TgRYmh.css`。`node --check ascstudio-mini/app.js`、`node --check ascstudio-mini/knowledge.js`、新构建 bundle 语法检查及 `git diff --check` 通过；未运行自动化测试。

## 2026-10-28 · 八点叙事：电脑端知识口袋先触发

- 按用户确认的叙事顺序，将电脑端知识口袋入口前置为第 4 点，再展示微信即时通知、手机短读卡、每周速览和订阅管理；主动回访章节现为第 4–8 点。第 4 点展示电脑端收纳与「感兴趣 / 还没弄懂」标记，以及「发到微信，现在看 / 加入定期速览」选择，并提供「模拟点按」进入即时送达。
- 1280×720 桌面浏览器回放确认：总览顶部提示「共 8 个设计点 · 向下滚动查看」；滚动后第 8 点可见。点选第 4 点展示电脑知识口袋截图，点「模拟点按」后 URL 进入 `?point=5#review-instant`，微信列表可访问地显示带知识标题的未读服务通知。八个总览缩略页均有对应状态。
- `evidence/review-overview-desktop.png` 保留为七点版历史截图，README 已明确标注，避免误作当前八点版。新的电脑端入口裁切为 `evidence/knowledge-pocket-entry-crop.png`。
- 依据：页序与电脑端入口要求来自用户选择（H）；本地演示状态与同源浏览器内即时通知流程是概念验证（M）。本地存储样例用于同一浏览器内桌面 / 手机演示；未接入真实微信 API、不同设备账号同步或后台定时推送。
- 页序由 7 点调整为 8 点；不涉及 API / Protocol、Host / Harness 或 Application / Task 机制边界。
- 验证：Chrome 本地静态预览，桌面 1280×720；总览滚动及第 4→5 点即时消息链路已回放。`node --check ascstudio-mini/app.js`、`node --check ascstudio-mini/knowledge.js`、`git diff --check` 通过；未运行自动化测试。

## 2026-10-28 · 状态栏 Wi-Fi 图标

- 按用户截图反馈，将手绘的三段曲线替换为 Tabler Icons v3.48.0 `IconWifi` SVG 路径。该路径沿用 24×24 坐标，三条弧线间距一致，并保留圆点；CSS 等比使用 15×15 尺寸与 2px 圆角描边。
- 图标为内联静态 SVG，没有新增运行时依赖；项目已有 Tabler Icons MIT 许可，CSS 中注明来源。
- 本地 HTTP 预览中核对 Pura X View 状态栏的 5G、信号、Wi-Fi 与电量排列；`node --check ascstudio-mini/app.js` 与 `git diff --check` 通过。未运行自动化测试；页面序列与推送流程不变。

## 2026-10-28 · 知识口袋条目分组与送达操作

- 知识口袋提供三条策划示例，列表统一包在连续容器中，以细分隔线连接条目；当前展开项用浅灰底区分正文与操作区。一次展开一条，方便看出“列表 → 展开内容”的层级。
- 「加入定期速览」与「发到微信，现在看」保持上下排列，两个按钮统一为 40px 高；「感兴趣 / 还没弄懂」是可取消的学习标记，不直接发送消息。
- 1280×720 本地浏览器回放：展开不同知识条目后，旧条目自动收起；再次点击即时送达，微信列表出现同标题通知，打开短读卡并点「我看懂了」，回到电脑端知识口袋后同一条内容显示「已理解」。这是同一浏览器内 localStorage / postMessage 的交互演示，不代表真实微信推送或跨设备同步。
- `cd ascend-studio && npm run build:pages`、`node --check ascstudio-mini/app.js`、`node --check ascstudio-mini/knowledge.js`、当前构建 JS `node --check`、`git diff --check` 与 `git diff --cached --check` 通过；未运行自动化测试。

## 2026-10-28 · 评审页电脑 Demo 单屏与 16:9 比例

- 第 1、4 个设计点在桌面评审壳中只展示电脑端 Demo，隐藏旁边的手机样机；其他设计点继续使用 Pura X View 手机样机，手机宽度视口也保留原有小程序页面。
- 电脑端以 1440×810 为逻辑视口，按可用宽高等比缩放，保持 16:9；材料中的最大宽度为 900px，较窄桌面屏幕按剩余列宽自适应。
- Chrome 本地预览回放：1440×900、第 1 / 4 点；1280×720、第 1 点；390×844 手机微信列表。确认第 1 / 4 点均只呈现电脑画面、口袋视图完整、手机视口不出现电脑 Demo。
- 截图：`evidence/review-desktop-only-1440.png`、`evidence/review-desktop-only-1280.png`、`evidence/review-desktop-pocket-1440.png`、`evidence/review-wechat-mobile-390.png`。
- 验证：`node --check ascstudio-mini/app.js`、`node --check ascstudio-mini/knowledge.js`、`git diff --check` 通过；未运行自动化测试。仅调整评审壳呈现与缩放，不改变七点页序、状态流转或 API / Protocol、Host / Harness、Application / Task 边界。
