# Ascend Studio · 已应用的氛围底图

用户确认将左侧档案叠片和中间冷暖交汇作为装饰底图，右侧画布无装饰图。

## 素材与生成方式

- [项目档案PNG](../../public/assets/project-archive-ambient.png)：1086×1448，RGBA，真实透明；[完整提示词](project-archive-prompt.json)。
- [对话交汇PNG](../../public/assets/dialog-exchange-ambient.png)：2172×724，RGBA，真实透明；[完整提示词](dialog-exchange-prompt.json)。
- 两张均由内置ImageGen独立制作，参考当前图稿canvas-bottom-pattern-20261009/refined.png的左/中装饰与已保存的配色材质参考。没有将整页图裁成静态界面。

## 在Demo中的消费

App.jsx使用BASE_URL加载图片。styles.css将它们作为absolute背景层，z-index:0；内容层z-index:1。左侧16%透明度，对话18%，使用渐消遮罩；不接收点击、不占位、不撑大面板、不修改文字与间距。

底图已应用到当前原型，Pages静态产物已同步构建。实际效果见../../evidence/20261009-ambient-final.jpg，视觉观察见../../design-qa.md。用户已明确右侧不放装饰；此前底部连接纹理保留为历史图稿。
