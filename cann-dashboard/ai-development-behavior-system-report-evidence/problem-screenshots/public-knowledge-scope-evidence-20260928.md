# 昇腾公开经验与适用条件：截图证据

采集日期：2026-09-28。使用独立临时 Chrome profile、Playwright、1440×900 桌面视口、DPR 1；未登录，没有复用或关闭用户浏览器，没有修改页面正文或样式。

执行脚本：`capture-public-knowledge-scope.mjs`，基于 `desktop-fullpage-screenshot` Skill 的采集流程。先滚动触发加载，再保存完整长图和首屏；局部图由浏览器 `clip` 截取真实 DOM 区域，并非合成截图。PNG 尺寸、DOM 宽度、完整高度、对话框及 Cookie 遮挡检查记录在各自 metadata 中。

## 08 · 公开经验可供后来者与 AI 再次检索

- 来源：https://github.com/Ascend/pytorch/issues/133
- 全图：`08-public-knowledge-ascend-133-1440-full.png`（1440×4696）
- 首屏：`08-public-knowledge-ascend-133-1440-viewport.png`（1440×900）
- metadata：`08-public-knowledge-ascend-133-1440-meta.json`
- `opening-clip`：作者明确说明发布目的的一行原文。
- `opening-context-clip`：作者、发布目的与问题现象，可作为汇报主截图。
- `fix-clip`：帖子中可执行的修复步骤。

原文：“严格来说这个不算是bug,只是把我发现的问题+分析结论+解决方案贴在这里,供遇到类似问题的同学/AI索引解决类似的问题”。

该公开帖子直接展示“任务经验经主动发布，形成他人与 AI 可检索的公共记录”。它不能证明所有传统任务都会公开，也不能证明 AI 用户普遍不再发布；后者仍需任务回放或回流率等研究验证。帖子中的技术问题与修复结果是作者陈述，本机没有复现 NPU 操作。

## 02 · 知识与方案需要携带适用条件

- 来源：https://github.com/Ascend/pytorch/issues/144
- 全图：`02-scope-ascend-144-1440-full.png`（1440×5125）
- 首屏：`02-scope-ascend-144-1440-viewport.png`（1440×900）
- metadata：`02-scope-ascend-144-1440-meta.json`
- `environment-clip`（894×334）：PyTorch、torch_npu、CANN、NPU、soc_version 的完整环境组合。
- `failure-clip`（894×331）：作者为调试将 soc_version 104 暂时按 A2 处理，绕过前置检查后，实际算子路径依然失败。
- `scope-request-clip`（894×147）：作者请求澄清支持范围，提醒仅将 104 映射为 A2 不能解决后续算子问题。

该案例支持“相似硬件名称和前置检查通过，不足以证明方案适用于实际环境”。原文没有记录 AI 参与，不能写成“AI 推荐了错误方案”或“AI 丢失了版本条件”。AI 综合答案时是否保留条件，属于待验证命题。

## 证据分级

- H：公开页面存在、引文与截图可复核。
- M：公开作者报告的故障和修复经过；本机未独立复现。
- L：由上述案例进一步提出的 AI 条件丢失与公共回流减少假设。

## 08 分析补证 · 同一公开线程被后来者复用

- 来源：https://github.com/Ascend/pytorch/issues/29
- 全图：`08-public-thread-29-1440-full.png`（1440×3685）
- 首屏：`08-public-thread-29-1440-viewport.png`（1440×900）
- metadata：`08-public-thread-29-1440-meta.json`
- `08-public-thread-29-original-resolution-clip.png`（926×436）：连续截取 2024-04-09 的定位建议与原提问者确认。
- `08-public-thread-29-later-reuse-clip.png`（926×155）：2025-08-27，后来者引用线程中的 PYTHONPATH 建议并回复“pycharm中加入该环境变量，已解决”。

首次定位评论：https://github.com/Ascend/pytorch/issues/29#issuecomment-2044025963

原提问者确认：https://github.com/Ascend/pytorch/issues/29#issuecomment-2044068003

后来者复用确认：https://github.com/Ascend/pytorch/issues/29#issuecomment-3227277246

这组证据展示“求助与排障记录持续公开 → 后来的任务再次引用 → 后来者报告解决”。不同评论涉及 Python/CANN 配套和 PYTHONPATH，不能把它们概括成同一具体根因或同一个修改操作。可说同一公开问题线程积累的排障建议被后来者复用；不推断 AI 是否参与，也不由一个线程推导总体复用率。
