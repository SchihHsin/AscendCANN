# Ascend Studio · 氛围底图历史素材（当前未使用）

这两张素材曾用于左侧档案叠片和对话区冷暖交汇装饰。用户于 2026-10-28 要求去掉工作区里的背景图案，现已从 `App.jsx` 移除运行时引用；素材与生成记录留在此处供设计追溯，不再作为页面底图。

## 素材与生成方式

- [项目档案PNG](../../public/assets/project-archive-ambient.png)：1086×1448，RGBA，真实透明；[完整提示词](project-archive-prompt.json)。
- [对话交汇PNG](../../public/assets/dialog-exchange-ambient.png)：2172×724，RGBA，真实透明；[完整提示词](dialog-exchange-prompt.json)。
- 两张均由内置ImageGen独立制作，参考当前图稿canvas-bottom-pattern-20261009/refined.png的左/中装饰与已保存的配色材质参考。没有将整页图裁成静态界面。

## 曾有的 Demo 用法（已移除）

历史方案中 App.jsx 通过 BASE_URL 加载两张 PNG，styles.css 将它们叠在项目列表与对话区下方，不接收点击、不占位、不修改文字与间距。该运行时用法已撤销。

旧版效果可在 `../../evidence/20261010-header-shape-final.jpg`、`../../evidence/20261009-header-glow-final.jpg` 和 `../../evidence/20261009-ambient-final.jpg` 回看，相关观察见 `../../design-qa.md`。用户已明确右侧不放装饰；此前底部连接纹理保留为历史图稿。

旧实现曾把对话底图铺在对话面板底层；该位置说明仅供回溯。
