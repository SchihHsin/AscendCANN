# Ploy 交互证据索引

研究日期：2026-09-14。截图为通过 Chrome 原生界面观看官方演示时截取的桌面全屏视频帧，保存实际画面，没有将产品首页替代操作状态。截图尺寸以文件为准（原生截图约 1228×768）；未伪装为 1440×900 登录产品截图。

## 采用的 8 张关键帧

| 文件 | 来源与时刻 | 可支持的观察 | 不支持的推断 |
|---|---|---|---|
| slurp-04m47.png | https://www.youtube.com/watch?v=jMrT76x2RM8&t=287s | 导入进度与左侧意图选项同时呈现 | 真实导入成功率和耗时收益 |
| ready-06m26.png | https://www.youtube.com/watch?v=jMrT76x2RM8&t=386s | 同任务中出现页面预览，保留对话与选项 | 用户长期使用效率 |
| annotation-11m20.png | https://www.youtube.com/watch?v=jMrT76x2RM8&t=680s | 选区、左侧任务名与修改摘要；候选问题与回答记录 | 选区传递的内部字段结构 |
| annotation-11m25.png | https://www.youtube.com/watch?v=jMrT76x2RM8&t=685s | 元素旁输入意见、Add / Send to chat | 所有类型的选区均能被可靠编辑 |
| inline-edit-04s.png | https://docs.ploy.ai/site-builder#edit-text-directly-in-preview 文档内视频约 04 秒 | 标题选区与直接编辑工具 | 撤销和历史按钮的实际执行结果 |
| inline-edit-11s.png | 同上视频约 10.96 秒 | 同一选区中标题文字已改变 | 所有编辑均免费；文档限定为多数直接文本编辑 |
| ploybook-09m08.png | https://www.youtube.com/watch?v=jMrT76x2RM8&t=548s | 作者、适用范围、Phase 1、Clone & Run | 本轮已执行此工作流 |
| lookbook-20m28.png | https://www.youtube.com/watch?v=jMrT76x2RM8&t=1228s | 演示者在 Ploy Admin 展示可视化参考库 | 普通用户拥有同样的入口与权限 |

ready-06m26 是研究中核对的前后状态，并在汇报页面内提供查看；其余 7 张在主要论证图中直接展示。

## 未用于论证的探索帧

- annotation-11m35.png 实为代码文件视图，不用作标注输入证据。
- ploybook-08m23.png 实际播放器到约 08:31，属于模板入口，且有暂停覆盖，不用作执行步骤证据。
- lookbook-18m29.png / lookbook-19m44.png 是示例站点或对话预览，不用作 Lookbook 选项证据。

## 文档证据与研究限制

- 9 份公开 HTML 的正文已归档为 source-1.txt 到 source-9.txt；索引见 sources.json。
- 自动快照、版本恢复、权限分级、主动建议、记忆、定时运行等按官方文档 / 官方复盘陈述呈现，未用无关截图佐证，也未登录实测。
- 官网页面可抓取正文；应用内浏览器连续超时，原生 Chrome 成功打开文档及 YouTube。研究使用官方总览和长视频重点片段，不宣称完整观看 56 分钟。
- 昇腾 Demo 的对象选择、路径 Diff、可见执行、进度保护、失败插入节点等为迁移设计；不是宣称 Ploy 已有相同的教学能力。
- Demo 不调用 AI，不执行任意代码，不访问 NPU；预设指令与运行结果均为前端模拟。
