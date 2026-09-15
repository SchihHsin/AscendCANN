# 真实产品视频帧 · 2026-09-15

用户要求实际产品截图，禁止以说明文字框图代替。本轮通过 Firefox 原生 UI 观看官方 YouTube 演示，暂停、定位后保存原始截图；未登录操作 Ploy。文件均为 1228 × 768 桌面全屏视频帧，不声明为 1440px 网页全页截图。视频包含讲者区域，材料使用 SVG viewBox 展示实际产品区域，点击可看未经改绘的完整原图。

## 已用于报告的原图

| 文件 | 官方视频及时间点 | 画面确实显示 | 不能据此声称 |
| --- | --- | --- | --- |
| intent-42m22.png | https://www.youtube.com/watch?v=jMrT76x2RM8&t=2542s | Overview 的 Needs input / Opportunity、建议理由、Why this 来源、Run Ploy；Recents 与 Scheduled Ploybooks | 任务已经自动执行成功或邮件已发送 |
| company-42m27.png | https://www.youtube.com/watch?v=jMrT76x2RM8&t=2547s | Persona 的 High engagement 建议：两位访客、25 个事件、outbound link click，以及 Run Ploy | 公司详情展开、评分算法与数值、个人精确意图；演示数字不代表总体效果 |
| events-48m09.png | https://www.youtube.com/watch?v=jMrT76x2RM8&t=2889s | Insights → Events：Timestamp、Event、Path、Referrer、Country、Session | 每个事件已经关联到可识别个人；此页不是 AEO 回答详情 |
| ploybook-27m50.png | https://www.youtube.com/watch?v=gKgFmZVAzgU&t=1670s | 方法正文、Edit、Run、Schedule a Ploybook、Run History 两条 Completed、Version History | 调度已经启用（本例显示 No scheduled Ploybooks）；Webhook、记忆、暂停或回滚操作已验证 |

事实置信度：H（官方演示中可复核的可见状态）；不代表本轮账号实测、内部算法验证或真实业务收益。截图先保存、再查看同一文件/同一字节，避免播放继续后将不同帧误配到说明。未通过画面核对的探索帧不提交、不使用。

## 报告对应

- #3：真实 Overview，替换研究循环图；完整机制文字保留在补充说明。
- #4：同一 Overview 的定时任务与输出渠道局部。明确其是未来运行列表，未把它称为已发送回执；旧官网营销时间线仅在补充说明保留。
- #5：公司行为建议 + Events 原始记录两张实图。意图评分和公司详情仍标缺口。
- #7–8：保留已核对的官方权限设置原图及局部。
- #9：官方权限原图只支持权限分层；人工发布停点、状态卡和 Promote 仍待取证。
- #12：新 Ploybook 原图；旧机制说明保留为普通文字与表格。
- #6、#10、#11、#13：尚缺对应产品截图，撤下文字框图，只保留简短缺图状态与来源链接。未删减左侧论点或原文资料。

## 取证过程与未完成项

- Chrome 原生截图为空白；应用内 YouTube 加载超时。Firefox 成功播放及截图，未绕过浏览器安全提示，未改变系统安全权限。
- 重新核对 The Joy of Ploy 重点片段、SEO/AEO 专题、AI-native ABM 专题，并搜索 Ploy AEO analytics。部分内容仅为讲者口述或讲者自己的演示文稿，未作为产品 UI 配图。
- AEO 回答/引用/历史、GSC 修改后真实数据对比、待审 Gmail 草稿/例外队列、Code Sync 回执仍未取得。材料未标记为全文截图完成。
- 现有学习 Demo、27 页顺序与原设计点未变。本轮仅替换竞品证据呈现，不新增学习设计或改写创新观点。

## 本地报告验证

- 1280 × 720 桌面预览，页面横向宽度 1280px。9 个修改页的证据区均位于页眉与页脚之间；#3、#4、#5、#11、#12 逐页截图检查。
- 修复 SVG 等比留白区域露出讲者画面的问题，使用与 viewBox 一致的 clipPath；Events 仅展示表头与前几行，完整记录可点击原图查看。
- 第 12 页原图弹窗显示 1228px 原图和正确说明；第 11 页原文切换及完整英文引文通过。第 5 页检查截图为 report-05-1280.png，元数据见 report-05-meta.json。
- 27 页结构、2 段内联脚本解析、本地证据资源存在性、git diff --check 通过；9 个修改页左侧说明与 HEAD 逐字比较一致。
- 本轮未重新验证既有八个 Demo 的全部动作、全屏和概览交互；未改这些实现。截图尚未全文补齐，缺口以上文清单为准。
