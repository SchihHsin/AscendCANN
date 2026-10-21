# ResNet50 目标学习画布 · 2026-10-21

用户选择 B：沿推理目标组织真实来源，保持原图像输入预处理画布体验。

## 来源（H，公开材料）

- 成长路径：https://www.hiascend.com/edu/growth/details/2b5bea0dcd854f3b9d22d9e423a75746 （3 个课程 + 1 个在线实验；15 个子节点为 Demo 侧目标拆解）
- 官方学习资源文章：https://www.hiascend.com/developer/techArticles/20230817-1?envFlag=1
- 概述：https://www.hiascend.com/developer/courses/detail/1676860115159470081
- 快速入门：https://www.hiascend.com/developer/courses/detail/1676864664357150722
- ResNet50 C&C++：https://www.hiascend.com/developer/courses/detail/1679410425112403970
- Python：https://www.hiascend.com/zh/developer/courses/detail/1687390499876962306
- 图像处理样例：https://www.hiascend.com/document/detail/zh/canncommercial/800/developmentguide/appdevg/aclcppdevg/aclcppdevg_000058.html

### 官方视频内嵌边界

从官方页面公开 JS（`/_static3/Cuo_W01Y.js`、`/_static3/BRZ1_ZRP.js`）定位公开 `getCourseUrl?courseId=...` 元数据请求，带对应课程页 Referer 得到课程播放页。已观察概述播放器路径 `https://www.hiascend.com/course/1493401497873534978/application-view?courseId=1676860115159470081&appId=552628867459117056&appType=1&headershow=true` HTTP 200，响应含 `X-Frame-Options: SAMEORIGIN`；CSP frame-ancestors 仅允许官方自身、HiDevLab、Ascend console 等官方域，不含本 Demo 域。

故保留打开原课程的链接，不代理媒体、不移除保护头。未验证完整视频播放、精确章节或硬件实验；本地 45 秒交互图解与官方视频分别标识。这里仅保存净化后的事实摘要，无原始 Cookie/响应头文件。

## 本地交互观察（M）

内置浏览器实际 1600×900；保存默认、聚焦、输入练习、执行图、旧学习任务回归、544px 工作区截图。标题/工具避让、层级子节点、整体左右/上下、进一步聚焦退出、标题按钮方向键移动、固定阻止移动、收起恢复、讲解播放和点击设备定位00:30均检查。输入重复轴显示无效，调整到2,0,1并加batch后图与代码/shape同步；参数随后恢复，不运行或保存测试完成结果。播放会把一个节点标成学习中；既有学习数据未重置。

浏览器 viewport.set 对当前已打开页未实际改变尺寸（仍1600×900），因此没有声称1280×720或移动端验证；通过工作台分隔条将右画布缩至544px检查容器响应式，随后恢复原宽。尝试新建 localhost 隔离测试页被浏览器权限拒绝，未绕过；继续检查既有127.0.0.1页。未点击会新增完成检查/小结的操作，其逻辑由纯数据测试覆盖。最终无console error/warn。不是全站回归或用户设计验收。

## 自动校验

`node --test src/official-learning-progress.test.js src/home-recommendations.test.js`：20/20。涵盖迁移/当前快照与作答失效/汇总/隔离，以及既有推荐规则。数据/Hook `node --check`、Pages build 与 scoped `git diff --check`。

无真实AI、Python、模型、工程或NPU执行；图像与分数是教学示意。
