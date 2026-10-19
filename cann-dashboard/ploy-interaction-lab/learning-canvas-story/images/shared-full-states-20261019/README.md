# 共用机制页 · 完整 Demo 状态截图

本目录保存学习画布故事第31–36页当前使用的21张完整浏览器截图，尺寸与素材视口为1280×720 JPEG。`manifest.json` 记录每张图的来源、说明及关键区域坐标。

## 截图规则

- 用户明确要求完整 viewport 取代此前“局部状态图 + 小全景定位”策略：每个状态直接呈现 Demo 的完整三栏工作区；右区收起时按实际界面隐藏。
- 图片未经裁切、拼接或重绘。重点区域通过 manifest 坐标由页面 renderer 独立叠加 SVG 细框与编号；放大图保留同样的框标。原始 JPEG 本身不含框标，可通过页面的原图链接查看。
- 这批图片记录浏览器示例中的操作状态（M：运行观察），不代表真实工程写入、CANN 编译、模型推理或 NPU 验证。

## 状态清单

| 页 | 文件 | 状态 |
|---|---|---|
| 31 | `image-tensor-correct.jpg` | 图解内理解与试改 |
| 31 | `image-proposal.jpg` | 独立审阅修改 |
| 32 | `addcustom-prompt.jpg` | AddCustom 就近提示 |
| 32 | `addcustom-prompt-collapsed.jpg` | 收回提示摘要 |
| 32 | `addcustom-explanation.jpg` | 定位关联图解 |
| 33 | `addcustom-map-topics.jpg` | 地图主题总览 |
| 33 | `addcustom-map-summary.jpg` | 地图70%关系摘要 |
| 33 | `map-navigation-before.jpg` | 收起前的只读记录 |
| 33 | `map-navigation-collapsed.jpg` | 右区收起后的界面 |
| 33 | `map-navigation-restored.jpg` | 唤醒后恢复同一记录 |
| 34 | `image-overview.jpg` | 图像推理主题总览 |
| 34 | `image-history-expanded.jpg` | 原对象下展开历史 |
| 34 | `image-history-readonly.jpg` | 打开只读快照 |
| 35 | `image-check-pending.jpg` | 应用后待复核 |
| 35 | `image-check-complete.jpg` | 明确操作后的核对记录 |
| 35 | `image-conditions-overview.jpg` | 新提案与旧核对并存 |
| 36 | `compare-wide.jpg` | 宽栏并排比较 |
| 36 | `compare-narrow-current.jpg` | 窄栏显示当前记录 |
| 36 | `compare-narrow-reference.jpg` | 窄栏切换对照记录 |
| 36 | `compare-ended.jpg` | 结束后回到进入时的记录 |
| 36 | `image-current-info.jpg` | 当前条件、来源、关联与历史 |

## 来源与解释边界

- 第32页 AddCustom 提示状态由独立5174会话拍摄，保留该会话既有的 AddCustom 记录。
- 第31、34、35、36页图像推理状态由独立5174会话拍摄。恢复正常 UI 后重建记录：尝试1为11:51、含 batch，已采用并明确复核；尝试2为11:52、不含 batch，新提案未应用。宽栏与窄栏对照区域约638px与447px。
- 第33页地图状态由5173新 tab拍摄，只查看既有7项内容和12:01、12:12两条尝试，没有修改参数或创建记录。以70%摘要开始，操作结束仍为70%。
- 未拍到“收起期间出现新结果”的状态；不要把这项行为描述成已经实拍验证。
- 旧目录 `images/shared-states-20261019/` 保留早期过程材料；当前31–36页使用本目录的完整图。


## 现行页序更新：框架先行与独立状态页

现行HTML共59页：31–36为共通框架（31是框架总图，其余按需引用本目录完整实拍），37–57将本目录21张实拍各自独立成页，无页内步骤切换；58/59为案例映射和范围。上文采集条件及历史页码保留为拍摄时记录，当前阅读索引以主README和shared-interaction-captures.mjs为准。本次未重拍或修改原始图像。
