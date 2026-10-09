# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Confirmed design decisions

- The workspace has three columns: left project/task navigation, middle task conversation, and right-side judgment/evidence/actions. Do not remove the conversation or replace the project task list with a learning center.
- Keep the left shortcuts for new task, automation tasks, and capability library, then show compact, collapsible task groups under projects.
- Use the selected screen mock as the visual reference, then make iteration changes in HTML/CSS. Keep generated imagery for small decorative accents, not as the editable page itself.
- Keep typography compact and the palette restrained: warm white and light gray surfaces, a cool blue-violet accent used sparingly, and neutral selected states without saturated outlines or a left color strip. Yellow uncertainty cards may keep a pale yellow surface, but their text must not have an outline or glow.
- The middle conversation and right operation area should remain close to the agreed 55:45 proportion. This prototype is Ascend Studio; do not imply that all issues are handled in Codex or add “学习组” labeling.
- Omit avatars in the conversation. Keep AI responses directly on the conversation background without a bubble surface; align user messages to the right inside a restrained bubble.
- Problem 02 must present tail-block handling as an unconfirmed clue. Do not state a root cause or claim NPU validation.

## 2026-10-09 · Decorative refinement review

- The user wants more decorative imagery and better overall visual craftsmanship. Material reference: `design-references/soft-glass-services-reference.png`; use ImageGen for frosted glass, translucent layers, pearl spheres and soft refracted light, with warm white/gray and restrained cool blue-violet.
- Preserve the existing dense three-column workspace. Place decoration in header/edge/empty regions, keeping message text, compact task rows, evidence and neutral selections readable.
- Three independent ImageGen previews were displayed, in this authoritative selection order. Await selection before applying the decorative treatment to the HTML:
  1. `/Users/hsin/.codex/generated_images/01a0f0fa-7e78-7c81-a14c-994e31ca9b7b/exec-f7b59d57-c75a-4d99-a416-e41e7c7f0567.png`
  2. `/Users/hsin/.codex/generated_images/01a0f0fa-7e78-7c81-a14c-994e31ca9b7b/exec-447cbf4b-ff21-4d91-81cb-d52865011cc3.png`
  3. `/Users/hsin/.codex/generated_images/01a0f0fa-7e78-7c81-a14c-994e31ca9b7b/exec-517e2c74-eadc-45e7-a842-8e7a30a3ea24.png`
- These are visual review mocks; no source UI changes or new NPU validation were made in this exploration.

## 2026-10-09 · Interactive problem 02 prototype

- The user asked to turn the fixed page into an interactive prototype. Keep this work within problem 02 until they review it; do not start another problem or apply an unselected decorative option.
- Task groups now expand, collapse, search and filter. Tasks switch to their own conversation, draft, attachments, records and history; new tasks can be created under the existing projects.
- Chat supports text input, local file/image association, code snippets, capability selection, AI configuration selection, feedback, actual copying, new conversations, history restore and JSON export. AI replies are local demonstration text, not real model calls.
- Right-side evidence opens details; the action workspace supports read-only example/user code, range calculations, CSV tolerance calculations, checklists and review records. Records return to the same task's conversation and evidence area. Tail-block handling remains an unconfirmed clue; no NPU verification is implied.
- Automation toggles, creation and one-off demonstration runs are interactive but do not create a real schedule. Browser refresh restores the original preview; all working state is held in the current page session.
- Preserve the established warm-white three-column layout, compact project navigation, neutral selections, avatar-free conversation, AI text on the background and right-aligned user bubbles.
- Implementation files: `src/App.jsx`, `src/useWorkbenchState.js`, `src/prototype-data.js`, `src/ActionWorkspace.jsx`, `src/action-workspace.css`, `src/WorkbenchDialogs.jsx`, `src/workbench-dialogs.css`, `src/interaction.css`. This prototype is outside the AscendCANN repository; only its handoff is recorded there.


## 2026-10-09 · 将来源方案的交互补入问题02

- 用户明确更新对象为当前问题02原型：把 `AscendCANN/cann-dashboard/ploy-interaction-lab/learning-canvas-story/index.html#19` 的交互补入当前原型。继续单题评审，不改源汇报或其他问题；B1–B5及B6均纳入交互范围，不机械复制图像预处理的技术结论。
- 三栏壳与既有用户视觉决策保持。新增 `src/useTaskFlow.js`、`TaskPracticeFlow.jsx` / CSS、`TaskContents.jsx` / CSS，更新 `App.jsx`、`ActionWorkspace.jsx` / CSS、`interaction.css`。错误现场及只读代码旁可打开就地解释、关闭建议，留在当前任务与对话中。
- 试改支持任务内与隔离示例副本，两种方式分别保留参数和草案；每次范围演算保存输入、策略、代码、时间与结果快照，历史结果明确归属所选尝试。手工代码可编辑、复制，但不被浏览器解析或执行，范围演算只来自参数控件。
- Diff以原始示例或上次已应用代码为基准，显示增删行及尝试依据；取消保留草案，确认仅更新浏览器示例副本，无改动提案禁用应用。支持撤销应用、分层范围复核、内容索引、折叠、收纳/恢复/撤销收纳、固定现场依据、临时对照退出、材料拖动换位/键盘移动、90–110%阅读缩放。刷新恢复默认；任务切换不串记录，恢复本题会同时清流程状态与局部阅读设置。
- 演示边界：默认[17,33]/32为561个元素、18块、尾块17；整块访问算例最大575、范围外15，按有效元素访问最大560、范围外0。它们是数学范围示例，不能确认真实AddCustom越界、精度根因或NPU通过；真实项目、AI和NPU未连接。源方案的通道顺序与batch示例未移植为该题结论。
- 在In-app Browser 1584×994查看解释、两种模式切换、范围结果、Diff确认/取消/撤销、验证、内容收纳恢复、固定/对照/折叠、阅读缩放、键盘材料换位、原核对入口和任务切换。构建通过，未新增或运行自动化测试。新增右侧正文12px、代码11px、元信息至少10px，解决初版8–9px过小过浅的问题。截图和比较材料保存在 `evidence/20261009-*`，细节见 `design-qa.md`。装饰候选继续待用户选择。


## 2026-10-09 · 自由画布取代固定工作区

- 用户指出“窗口不是画布”，并明确选择右侧自由画布：代码、解释、结果、Diff 是可移动、调整尺寸、固定的独立对象。上一轮固定步骤工作区只迁移了内容与流程，未满足空间画布要求；当前实现以本条为准。继续只交付问题02供评审。
- 新增 `src/useCanvasState.js`、`TaskCanvas.jsx` / `task-canvas.css`、`CanvasMaterials.jsx` / `canvas-materials.css`、`CanvasIndex.jsx` / `canvas-index.css`；更新 `App.jsx`、`ActionWorkspace.jsx`、`useTaskFlow.js`。App 不再挂载 TaskPracticeFlow 和遮罩式 TaskContents。默认在画布上显示只读范围来源示例和现场判断，其余解释、草案、参数、尝试、Diff、范围复核、误差、复核记录按需展开。
- 二维世界坐标与视口分离；空白拖动/抓手/滚轮平移，Ctrl/Command滚轮缩放，缩放控件15–150%，初始100%。标题拖动、角落调整尺寸、方向键微调；固定阻止移动和改尺寸。新增内容只调整自身位置，不移动已存在对象。小地图与适应全部负责导航；正文阅读通过定位对象展开。
- 折叠留标题与摘要，收纳保留位置/尺寸/内容，索引是画布内部小浮层；区分待展开与已收纳。临时来源/草案对照保存和恢复位置、尺寸、可见性、折叠和视口；固定对象不移动。动态复核记录是画布对象。
- 尝试与示例应用沿用原状态，取消提案保留草案和尝试，可重新生成；本轮没有新增取消提案历史。Diff保存生成时的基准，确认应用后仍能查看原差异。误差和复核各为独立卡，共享已算误差和范围依据；记录保存数据来源、数量与容差。计算期间锁定输入，恢复初始状态会清理卡内表单、结果和计时器。
- 保留Ascend Studio三栏、项目任务分组、自动化任务/能力库、无头像、AI文字铺背景、用户气泡靠右和中性选中。不新增学习中心/学习组，不改变其他题目的平台或报告序列。新ImageGen装饰仍待用户选择。
- 本轮通过In-app Browser默认1280×720实际操作拖动、尺寸调整、平移、键盘微调、固定、临时对照退出恢复、收纳/恢复、折叠、索引定位、尝试→Diff取消/再生成/确认→范围复核、误差→复核记录→动态卡、任务切换与重置。原生overflow:hidden因按钮定位引起画布内部滚动，已改overflow:clip；之后观察tc-stage.scrollTop=0。未单独覆盖Ctrl/Command滚轮缩放或移动端，本轮未再次核验复制。
- `npm run build`通过；最终刷新后未捕获console error。没有新增或运行自动化测试。截图保存在 `evidence/20261009-free-canvas-default.jpg`、`20261009-free-canvas-explanation.jpg`、`20261009-free-canvas-overview.jpg`；整体评审待用户。仍是浏览器范围/误差算例，未接真实AI、持久化、文件写入或NPU；根因未知。


## 2026-10-09 · 纳入根仓并发布GitHub Pages

- 用户再次强调每次修改后立即push；此前只推交接记录是执行错误，不能以可视化目录在仓库外为由不推源码。
- 当前权威源码位于 `/Users/hsin/Documents/Coding/AscendCANN/ascend-studio/`，后续修改在此进行；历史仓外目录保留作快照。
- Pages产物在根仓 `/Users/hsin/Documents/Coding/AscendCANN/ascstudio/`，线上入口为 `https://schihhsin.github.io/AscendCANN/ascstudio/`。源码品牌资产按BASE_URL解析，Pages构建使用相对base；不改变UI、交互或研究边界。
- 修改后构建 `npm run build:pages`，只暂存本任务源码/产物与交接记录并立即push；不得再次只提交交接文档。
- 保留原Sites可选模板文件；本轮使用用户指定的GitHub Pages，不调用Sites发布。


## 2026-10-09 · 独立于CANN Dashboard的工作台

- 用户纠正Ascend Studio不应放在CANN Dashboard下。源码已移到根仓 `ascend-studio/`，与 `cann-dashboard/` 平级；根仓 `ascstudio/` 继续只放Pages静态产物。
- `build:pages`输出路径同步为 `../ascstudio`，线上入口仍为 `https://schihhsin.github.io/AscendCANN/ascstudio/`。不改UI、交互或其他问题的承载平台。


## 2026-10-09 · 计算场景装饰重新探索

- 用户否定此前3版装饰候选，明确珍珠与计算场景无关。后续装饰须从张量、矩阵、算子图、数据路径或并行计算轨迹取形；不再使用珍珠、首饰、漂浮圆球等无场景关联的意象。可以保留细腻的半透明材质，但应有明确计算含义。
- 使用内置ImageGen与Product Design ideate，以 `evidence/20261009-free-canvas-default.jpg` 的现有桌面三栏为基准，独立生成3张候选，按主对话实际显示顺序编号。候选保存于 `design-explorations/compute-decoration-20261009/option-{1,2,3}.png`，完整提示词保存在同目录 `prompts.json`。
- 新3版维持三栏、紧凑项目分组、中性选中、克制冷蓝紫、无对话头像、AI文字铺背景与右对齐用户气泡；装饰主要位于画布标题、左侧页脚与画布空白边缘。候选图属于视觉提案，生成文字不能作为新功能、硬件、性能或根因事实。第3张的GPU/NPU小字是生成插画细节，若选择该方向应移除或改为无字抽象轨迹。
- 当前等待用户评审，未把任何新候选套用到源码或线上页面；前一组珍珠候选不再作为可选方向。只保存本次图稿与交接并push，不运行测试或重建未改动的页面。
