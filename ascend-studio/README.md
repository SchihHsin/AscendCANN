# Ascend Studio · 问题02判断与纠错原型

在线预览：https://schihhsin.github.io/AscendCANN/ascstudio/

源码：根仓 `ascend-studio/`，与 `cann-dashboard/` 平级。GitHub Pages静态产物：根仓 `ascstudio/`。

## 本地开发与发布

在本目录执行 `npm ci` 后，可用 `npm run dev` 启动开发预览。

- `npm run build:pages`：构建相对资源路径的GitHub Pages版本，更新根仓 `ascstudio/`；只覆盖本原型静态产物。
- `npm run build`：保留原项目的可选Sites构建能力。
- 修改后应将本目录源码、`ascstudio/`静态产物和根仓交接记录一起提交并立即推送。

## 范围

保留项目任务、对话、自由画布三栏。支持任务与对话操作、示例试改、范围结果、Diff审阅、示例应用和复核；画布可平移、缩放、移动对象、调整尺寸、固定、折叠、收纳与恢复。

这是问题02的设计提案。AI答复与范围算例在浏览器本地演示，未连接真实AI/NPU，不修改实际项目。页面状态仅保存在当前会话，刷新恢复初始状态。


## 当前装饰底图

左侧项目档案叠片与中间对话交汇纹理已作为不占位、不接收点击的背景图应用。右侧画布不放装饰图。

两张透明PNG由内置ImageGen制作，素材、完整提示词、来源与消费方式见[素材说明](design-explorations/ambient-assets-20261009/README.md)。
