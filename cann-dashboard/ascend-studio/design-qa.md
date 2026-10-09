# 问题02「判断与纠错」原型视觉 QA

## 对照材料

- Source visual truth: `/Users/hsin/.codex/generated_images/01a0f0fa-7e78-7c81-a14c-994e31ca9b7b/exec-762b9846-774f-4eb4-a3ab-84ecbdd968c9.png`
- Source dimensions: 1584 × 993 px.
- Implementation: Codex In-app Browser, `http://127.0.0.1:5173/`.
- Implementation capture: Codex In-app Browser capture shown during this review; 1584 × 994 px screenshot at a 1584 × 994 CSS viewport. The current CUA browser API does not expose a persistent screenshot file path.
- Density normalization: screenshot dimensions match the CSS viewport 1:1; no resampling. Source is one pixel shorter in height, so that edge difference was excluded.
- State: default AddCustom 精度异常 task; rationale expanded; first next-step route selected; no extra chat messages.
- Additional viewport check: 1280 × 720. The message and diagnostic regions scroll independently while the composer remains visible.

## Full-view comparison

The three-column structure matches the selected mock: compact grouped project tasks on the left, the task conversation in the middle, and evidence, uncertainty, and action suggestions on the right. The conversation remains visible and contains a detailed explanation plus selectable next steps. The right panel preserves the unconfirmed status of the tail-block clue. The automation and capability-library shortcuts remain in the sidebar.

## Focused-region comparison

- Left navigation and task groups: shortcut order, project grouping, compact row spacing, and neutral selected state reviewed.
- Conversation: message indentation, readable response width, attempt context, rationale expansion, and next-step selection reviewed.
- Judgment panel: evidence rows, pale yellow uncertainty card, no text outline or glow, and synchronized action state reviewed.
- Decorative image: restrained pastel accent remains confined to the top of the right panel.

## Fidelity surfaces

- Typography: compact UI sizes follow the user's request to reduce overall type size. Key labels remain readable at the 1584 × 994 view; secondary metadata uses smaller type. The body response uses slightly more line spacing and denser evidence copy than the first implementation.
- Spacing and layout: left navigation uses 22vw at the desktop comparison width; conversation and operation regions stay close to the agreed 55:45 ratio. Message inset and card widths were adjusted to match the mock's alignment. At 1280 × 720, long content scrolls within its panel instead of hiding the composer.
- Colors and tokens: warm white and light gray dominate; cool blue-violet is used sparingly. Selected task/action states are neutral gray without a saturated outline or left stripe. The uncertainty card uses a pale yellow surface; its heading has no stroke or shadow.
- Images and assets: Ascend logo and the supplied generated glass accent are image assets; no decorative art is drawn with CSS.
- Copy and content: `[16,32]` passes, `[17,33]` fails, and `precision mismatch` at `custom_op.cpp:128` are presented as the known evidence. Tail-block handling is a lead to investigate, not a confirmed cause. The UI does not claim real NPU validation.

## Comparison history

1. Initial browser render was blank because `IconLock` was used without being imported. Added the missing import; the page then rendered and the production build passed.
2. First visual pass had a sparse, left-shifted conversation and short right-side cards. Added the diagnostic explanation and next-step rows to the conversation, aligned the message inset to the mock, and increased evidence/action row height while keeping compact typography.
3. Rechecked the 1584 × 994 main view and 1280 × 720 desktop view. No remaining P0/P1/P2 visual or functional mismatch was found.

## Interaction and build checks

- Project search filters grouped tasks and supports project-name matches.
- Rationale expands and collapses.
- Selecting an action in either the conversation or right panel updates the selected route and primary action label.
- Sending a chat message appends the user message and assistant response; the original review state was restored afterward.
- `npm run build` passed and produced the Vite client and Sites build artifacts.

## Findings

- No actionable P0/P1/P2 findings remain.

## Follow-up polish

- The generated mock uses slightly larger body text in places. The implementation keeps the requested smaller, denser type scale; adjust after the user's review if they want more visual weight.

## 2026-09-30 · 对话消息样式澄清

- 用户澄清：AI 回复应直接铺在对话区背景上，不放在气泡里；仅用户消息使用靠右气泡。
- 移除 AI 回复的底色、边界、阴影与气泡尾，恢复纯背景文本；用户气泡保持右对齐。三栏结构与文案不变。
- 在 1280 × 720 预览中确认 AI 回答直接显示在白色对话背景上，用户消息仍是靠右浅灰气泡；三栏结构保持完整。长回答继续在对话区滚动，输入区固定。
- `npm run build` 通过。此题仍处于单题评审阶段，用户确认后再开始下一题。

## 2026-10-03 · 移除对话头像

- 用户提出对话区不要头像；已移除用户与 Ascend Studio 的头像，保留各自的文字标识。
- AI 回复继续直接显示在背景上，用户气泡靠右；调整消息容器列数后复核三栏结构没有变化。
- `npm run build` 通过。窄视口预览确认双方头像已移除、AI 文本无气泡底、用户气泡靠右；该视口按既有响应式规则纵向堆叠三栏，未在本轮重新做桌面尺寸截图。

final result: passed

## 2026-10-09 · 交互补齐

- 将仅弹出提示的入口改为实际表单、菜单和操作区，覆盖项目任务切换与创建、能力选择、代码附件、发送、AI配置、对话历史、自动化状态与演示运行、证据详情和复核记录。保留既有三栏结构及对话视觉规范。
- 在 In-app Browser 的 1584 × 994 桌面视口查看初始界面与操作状态。实际走过代码范围计算 → 误差示例 → 复核生成 → 返回诊断；记录出现在当前任务的对话与右侧列表。范围算例为 561 / 32；示例 CSV 为 8 个元素、3 个超差，界面保留演示标识。
- 查看任务切换、新建任务、能力加入、代码片段关联、发送、新对话与历史恢复、自动化开关与演示运行，以及更换诊断助手并保留现有证据的状态。新对话会取消尚未完成的旧演示答复；任务间上下文分开保留。
- 更新后浏览器没有捕获到 console error。`npm run build` 通过，生成既有 Vite/Sites 构建产物；未新增或运行自动化测试。
- 演示回复、自动化状态不连接真实 AI、调度器或硬件；用户 CSV 的误差计算在浏览器内执行，不代表完整算子精度验证。附件与任务状态保存在本次页面会话中，刷新恢复默认状态。
- 本轮未应用尚未选定的 ImageGen 装饰方案。交付前刷新原型，恢复默认 AddCustom 任务，供用户评审。


## 2026-10-09 · 来源方案交互迁移

### 范围与来源

- 更新目标：当前问题02，保留Ascend Studio三栏壳。交互取自 `/Users/hsin/Documents/Coding/AscendCANN/cann-dashboard/ploy-interaction-lab/learning-canvas-story/index.html#19`、`story-data.mjs`及`build.mjs`中的B1–B6与共用机制。来源画布的整体布局与图像预处理技术结论不作为本原型的视觉或技术事实。
- 本轮视觉基准：`evidence/20261009-before-flow.jpg`，即实施前现有原型（继承无头像、AI文本铺背景、用户气泡靠右及中性选中等已确认修改）。1584×994像素与CSS视口，dpr=1。
- 默认状态更新图：`evidence/20261009-default-final.jpg`；解释状态最终图：`evidence/20261009-understand-final.jpg`；两者同为1584×994，密度1:1，不重采样。基准与默认态合并于 `evidence/20261009-shell-comparison.jpg`（3168×1024，顶部30px为比较标签）。
- 同状态字号迭代：`evidence/20261009-understand.jpg` 对照最终解释图，合并全图 `evidence/20261009-typography-comparison.jpg`；右侧1028–1584的局部1:1比较为 `evidence/20261009-operation-typography-focus.jpg`。本轮实际打开合并比较和局部比较后形成结论。
- 其他状态：`evidence/20261009-diff.jpg`、`20261009-validation.jpg`、`20261009-contents-final.jpg`。

### 五项视觉检查

- 字体：沿用系统中文字体与原有层级；操作区正文12px、代码/Diff11px，元信息至少10px，避免初版8–9px文本过小。新标题16px，与既有右栏一致。
- 布局：默认态比较确认左侧项目分组、快捷入口及三栏边界未变，中央/右侧约55:45。新增就地入口使下方内容继续在原面板滚动；输入框保持可见。只在右侧展开材料，没有添加学习中心或新页面。
- 色彩：暖白、浅灰、中性选中保持；冷蓝紫用于克制的提示和操作，Diff行采用浅淡增删底色。正文对比度加深，没有彩色左条、文字描边或新高饱和选中态。
- 图片：Ascend标识与现有玻璃装饰资产保持；本轮未使用尚未选定的新ImageGen装饰图。操作界面由可编辑组件组成。
- 内容：已知现场及根因未知表述保留；所有演算明确是示例，应用只在浏览器副本中发生；范围通过不代表精度、项目修复或NPU通过。旧尝试保存快照与来源，手改代码不冒充执行。

### 修正与再次观察

1. 初版操作区8–9px与过浅文字，属于P2。提高正文/代码/元信息字号并加深文字；最终同状态全图和局部比较显示正文层级清晰，颜色与原壳一致。内容索引同样提高字号，重新捕获最终图。
2. 无变化提案原可点击应用，属于P2状态问题。增加无改动说明与应用禁用、数据层拒绝无改动应用；浏览器看到默认整块策略的“没有新增改动”与禁用按钮。有效元素策略出现真实增删行。
3. 内容索引打开Diff时先生成对应尝试提案，避免空Diff；恢复本题同时重置局部缩放/排列。旧尝试标明模式、形状、策略及代码快照，眼前参数变化时提示尚未产生新结果。
4. 加入自定义Hook引用期间Vite热更新产生一次旧Hook顺序错误；完整刷新后页面正常，后续流程未捕获新增console error。历史日志保留该条，未将其描述成全程零错误。

### 实际浏览状态与边界

- 实际操作：错误现场→解释→整块范围算例→无改动Diff→取消→隔离副本有效元素策略→范围通过→Diff确认→分层范围复核→撤销应用→索引收纳/恢复；两种模式切回各自草案，任务切换后记录仍属于AddCustom。
- 另查看固定、对照、退出对照入口、折叠/展开、阅读缩放及键盘材料换位；拖动处理已实现，但本轮未用鼠标实际拖动，不声称已覆盖该手势。真实复制沿用浏览器剪贴板调用，本轮未再次核验系统剪贴板。
- `npm run build`通过；没有新增或运行自动化测试。当前QA针对1584×994桌面，移动端及其他尺寸未重新查看。
- 无剩余可见P0/P1/P2问题。刷新恢复初始会话；未接AI、真实文件写入、任务持久化、NPU。

final result: passed


## 2026-10-09 · 用户纠正后实现真正自由画布

### 更正与范围

- 上一轮 `passed` 只针对固定面板版的可见样式与流程，不能证明完成自由画布。用户指出差异后已选择“自由画布”，本轮替换右侧容器；保留当前三栏壳，不复制来源方案的完整平台框架。
- 来源仍为 Learning Canvas Story 的B1–B6及共用机制：对象局部展开、临时对照退出恢复、固定、摘要折叠、收纳恢复。交付范围为问题02，其他题目待本题评审。

### 观察与修正

- 1280×720默认桌面视口，未设置新的尺寸覆盖。实际拖动来源标题后世界坐标由(28,28)变为(56,53)；角落拖动使尺寸从428×350变为404×330，空白拖动使视口变为(-50,28)。这些操作分别作用于对象或视口。
- 固定来源后移动/调整尺寸禁用；临时对照保持固定来源坐标，退出恢复来源、草案可见性及视口。折叠保留摘要，收纳/恢复仍保留坐标和尺寸；内部内容索引无全屏遮罩。
- 试改打开独立草案与参数。有效元素策略的[17,33]/32尝试为561元素、18块、尾块17、最大索引560、范围外0；取消保留草案/尝试，索引可重新生成Diff。确认后展开复核块；原Diff仍保留1条删除与2条新增，按钮显示已应用。范围复核中[16,32]与[17,33]均范围内，真实项目仍待验证。
- 误差示例8个元素、3个超差，复核卡共享范围和误差依据；保存的动态记录包含561/32、8/3、atol0.00001、rtol0.001与来源。恢复初始状态后CSV与结果清空；任务切换回本题保留画布视口和对象状态。
- 修正3处状态问题：应用后Diff基准改用生成时快照；复核记录保存计算依据；误差计算期间禁用输入，防止旧结果覆盖新输入。重置通过resetVersion重新挂载卡内状态，取消旧计时器。
- 修正浏览器定位卡内按钮导致父画布原生滚动、浮动工具遮住按钮的问题：画布使用overflow:clip，卡体独立滚动。再次观察父画布scrollTop为0，应用按钮可完成操作。
- 低比例适应全部用于对象概览，阅读时定位对象；首次打开和恢复只移动新对象或视口，不重排已有对象。暖白浅灰、克制冷蓝紫、中性选中，无头像/文字描边；本轮未应用待选装饰候选。

### 结果与证据

- `npm run build`通过；最终刷新后日志未捕获console error。未新增或运行自动化测试；Ctrl/Command滚轮缩放、移动端、系统剪贴板本轮未单独覆盖。
- 当前截图：`evidence/20261009-free-canvas-default.jpg`（手动适应初始对象76%）、`20261009-free-canvas-explanation.jpg`（解释定位100%）、`20261009-free-canvas-overview.jpg`（11对象概览16%）。这些都是默认1280×720视口，未拉大截图尺寸。
- 当前状态：主要画布操作和本题连续流程已手动观察，等待用户评审。刷新恢复初始会话；AI、真实项目、持久化、NPU未连接，不能把范围算例通过当作精度或修复结论。


## 2026-10-09 · GitHub Pages发布适配

- 将同一原型源码与既有证据纳入根仓，UI和交互设计不变。品牌资源改为BASE_URL解析，Pages构建使用相对base，避免仓库子路径404。
- 本轮不新增或运行测试套件；沿用上轮本地画布操作的观察，发布后的可访问性另由HTTP和部署回执确认。
