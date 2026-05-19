# CANN 体验看板设计分析 · 协作过程记录

> 记录从零开始、通过人机协作完成 UX 分析文档的完整过程。

---

## 阶段一：项目启动

**用户指令**：把 GitHub 仓库 `SchihHsin/AscendCANN` pull 到本地 `~/Documents/Coding/` 目录。

**过程中遇到的问题**：
- Xcode Command Line Tools 未安装 → 用户手动安装后继续
- SSH `Host key verification failed` → 执行 `ssh-keyscan github.com >> ~/.ssh/known_hosts` 解决

---

## 阶段二：建立分析文档

**用户指令**：从用户体验/交互设计专业角度，分析如何重构这个看板；在仓库下建立项目文件夹，先写一个分析 HTML 文件，明确设计方向。

**AI 决策**：
- 新建 `cann-dashboard/` 目录
- 通过读取 cannbot-skills 仓库结构，梳理出 33 个 skill、6 类算子开发场景、5 步入门任务流
- 初版分析文档涵盖：背景、信息架构、设计方向、待确认问题

---

## 阶段三：丰富参考案例

**用户指令**：觉得分析不完善，要求找类似场景的可参考产品，提供网址，图文并茂。

**AI 行动**：
- 精选 9 个案例（Spotify Soundcheck、Datadog IDP、LinearB、Stripe DX、GitHub Insights 等）
- 按相关度分三档（高度相关 / 中度相关 / 低度相关）
- 每个产品附多张截图 + 编号注释，说明与 CANN 的对应关系

---

## 阶段四：补全 UX 分析维度

**用户指令**：你觉得目前分析还差什么？（开放式提问）

**AI 诊断**：发现缺少 6 类 UX 设计系统标配内容——用户画像、任务流程、故事线、组件清单、边缘态设计、成功指标。

**协作方式**：
- AI 列出「必须回答」与「可选问题」供用户选择
- 用户确认：主要受众是内部团队（非管理层汇报）、评分是多维度结构
- AI 按最优实践补全所有缺失章节，形成 v0.4

---

## 阶段五：视觉重构

**用户指令**：文件太长，在左边加一个目录（线性 icon + 字），改一下整体视觉风格。

**AI 方案**：
- 新增左侧固定 sidebar（232px），5 个导航分组，每项配 Feather 风格线性 SVG icon
- Intersection Observer 驱动滚动高亮
- 全面替换 CSS design token：深色主题 → 浅色主题，主题色橙 → `#c7000b`（用户指定）
- 文件拆分：`style.css`（~394 行）、`script.js`（~26 行），`analysis.html` 只保留结构和内容

---

## 阶段六：布局与章节细节

**问题 1**：目录顺序和章节顺序不一致
- 原因：HTML 章节按编号排列，sidebar 按逻辑分组排列
- 修复：用 Python 提取所有 section 块、按 sidebar 分组顺序重新拼装

**问题 2**：章节底色只占容器宽度（900px），没有铺满
- 修复：移除 `.container` 的水平 padding，改用 `padding-inline: max(48px, calc((100% - 900px) / 2))` 让 section 自己铺满 main-content 全宽

**问题 3**：章节之间视觉混在一起
- 修复：奇偶 section 交替白色 / `#f4f7fb`，加 1px 分隔线

---

## 阶段七：封面页迭代

**用户指令**：最前面放个封面。

| 版本 | 描述 | 被否定原因 |
|------|------|-----------|
| v1 | 极深黑背景 `#0e0608` + 白字 | "为啥用这么深的底色" |
| v2 | 品牌红渐变 `#c7000b → #8a0008` | "这么一大片红太丑了" |
| v3 | 浅灰底 `#f4f5f8`，CANN 字样红色 | ✅ 用户选定 |

**封面装饰迭代**：

| 版本 | 描述 | 结果 |
|------|------|------|
| 同心圆 + C 字母 | 红底白圆 | "有点丑" → 给选项 |
| 放大 CANN logo | 低透明度水印 | 未被选 |
| 几何色块（随机排列） | 4 个矩形错落 | 用户选定，但觉得"不知所云" |
| 升序柱状图 | 4 根柱子逐渐升高 | ✅ 最终版 — 呼应 Ascend（向上）+ 数据看板主题 |

**关键教训**：AI 直接删除装饰元素而没有给选项 → 用户指出应先问再动手。

---

## 阶段八：Logo 迭代

| 版本 | 内容 | 原因 |
|------|------|------|
| v1 | 「C」字符方块 | 初始占位 |
| v2 | `Ascendlogo.svg` | 仓库内找到的 Ascend logo |
| v3 | `CANNlogo.png` | 用户指定使用 CANN 官方 logo |

- Logo 点击行为：`window.scrollTo({top:0})` 回到封面顶部
- Logo 右侧加竖线分隔符 + 「体验看板 / 设计分析」文字（用户要求）
- 竖线过长 → 改用伪元素固定 16px 高度

---

---

## 阶段九：新看板启动 —— JS 崩溃修复

**背景**：已有一个包含方案1A / 1C / 2 / 3 五个变体的对比页 `design-options.html`，但多个面板白屏无内容。

**根因**：`<script>` 块在第 771 行，但它调用的 `fux-tag` DOM 元素在第 1271 行（`</script>` 之后）。脚本执行时元素还不存在。

**修复**：用 Python 提取整个 `<script>` 块，移至 `</body>` 正前方。

---

## 阶段十：新看板大改 —— 从"方案对比"到"单一可用看板"

**用户指令**：不是要看你的回答，是根据分析产出一个好的设计，整体大改。设计要能印证分析，设计依据要指着页面上具体的地方讲。

**AI 决策**：
- 放弃五方案对比结构，重写为一个完整可操作的看板页
- 核心信息架构：Topbar → 筛选栏 → KPI 条 → 场景列表（左）+ 场景详情（右）
- 浮动「设计依据」面板：6 条，每条悬停时高亮并自动滚动到页面对应元素（用 callout badge ①~⑥ 标注）

**同时修复的两个问题**（用户反馈）：
1. 证据面板（Agent/痛点/VOD）内容出现在一个小内滚动窗口 → 去掉 `height:100vh;overflow:hidden`，改为页面整体自然滚动
2. 点击设计依据悬停只高亮但不滚动到对应元素 → `hlRat(n)` 改用 `window.scrollTo()`，并自动切换到相关 Tab

---

## 阶段十一：布局迭代 —— 全页滚动

**用户反馈**：怎么都是局部区域滚动，页面整体滚动会不会更好？

**AI 方案**：
- 去除 body/ev-panels 上所有 `overflow:hidden` / `height:100vh` 约束
- 场景列表改为 `position:sticky; align-self:flex-start`，跟随整页滚动保持可见
- ev-tabs 改为 `position:sticky; top:88px`（topbar 50px + filter-bar 38px），滚过 header 后依然可见
- `selScene()` 调用从 `sceneDetail.scrollTo()` 改为 `window.scrollTo({top:0})`

---

## 阶段十二：数据补充 —— 旅程环节子指标网格

**用户反馈**：目前数据还是缺的，每个旅程环节下面应该有很多数据，现在都没有。

**AI 方案**：
- 每个 `agentStep` 增加 `metrics` 数组，每条含 `{l:标签, v:值, trend:趋势, trendCls}`
- 以 context.md 中各场景的子指标定义为依据填充模拟数据（感知学习 8 项、环境准备 7 项、环境验证 8 项等）
- 渲染为子指标网格：`grid-template-columns:repeat(auto-fill,minmax(130px,1fr))`，每格显示标签 + 数值（颜色编码）+ 趋势箭头

---

## 阶段十三：场景排序双模式

**用户反馈**：场景目前按问题从高到低排，能不能加一种按产品目录顺序的排法？

**背景澄清**：目录顺序是产品定义的开发者学习/使用进阶顺序（算子复现→算子迁移→Builtin定制→基本功能实现），不是使用频率。

**AI 方案**：
- 新增 `sortMode` 状态变量（`'score'` / `'catalog'`）
- `catalogOrder = [0, 2, 1, 3]` 对应产品顺序
- 问题优先模式：评分升序，卡片左上角显示 `#1` `#2`
- 目录顺序模式：按产品顺序，卡片左上角显示 `S1` `S2`
- 场景列表顶部新增切换按钮组（当前模式高亮）

---

## 阶段十四：场景详情图表升级 —— 折线图 → 雷达图

**用户提问**：场景卡片上有折线图，点进场景详情里也有折线图，两个一致，有必要重复吗？卡片是折线图、进来是更详细的雷达图，是不是更好？

**AI 判断**：折线图表达趋势，雷达图表达多维诊断，两者信息不重叠，场景详情改雷达图更有决策价值。用户确认「好」。

**实现**：
- 每个场景增加 `radar:[v1,v2,v3,v4,v5]` 数组（5 维：开发成功率/文档质量/环境效率/调试能力/工具稳定性），值从已有子指标推导
- 新增 `radarSvg(vals, size)` 函数：5 条轴 + 背景环 + 数据多边形（红色半透明填充）+ 点（按阈值着色）+ 轴标签 + 值标签
- 删除 `distSvg()` 函数和 `.dist-section` CSS/HTML，替换为 `.radar-section`
- 右侧配图例面板（维度名 + 颜色点 + 数值），顶部标注最弱维度
- 卡片折线图保持不变
- 设计依据 ③ 文案同步更新：从"7点分布"改为"5维雷达图 · 定位最弱维度"

---

## 阶段十五：设计依据从悬浮改为嵌入侧栏

**用户反馈**：设计依据悬浮面板遮挡页面，尤其是悬停高亮某个元素时那个元素反而被面板挡住了。入口（浮动按钮）保持不变，只是布局形式从悬浮变成嵌入。

**AI 方案**：
- 保留底部右侧浮动按钮作为开关，样式不变
- 删除 `position:fixed` 的 `.rat-panel` 弹出层
- 新增 `.rat-sidebar` 作为 `main-body` 的第三个 flex 子项（`width:0 → 264px` 过渡）
- 打开时场景详情自然收窄，关闭时恢复全宽；内容区域完全不被遮挡
- `toggleRat()` 改为切换 `body.rat-open` class，sidebar 通过 CSS 响应

---

## 阶段十六：详情图表区域补全 —— 折线图 + 雷达图双栏

**用户反馈**：现在详情里只有雷达图，右边空着，感觉缺了什么。不如左边折线图、右边雷达图。

**AI 方案**：
- 新增 `trendSvg(runs, W, H)` 函数，渲染带均值虚线、颜色点、本次标注的趋势折线
- 将 `.radar-body` 改为左右双栏布局（`.chart-col` + `.radar-col`，中间竖线分隔）
- 左栏：近 7 次评测折线 + 波动稳定性标签（波动小/中等/大）
- 右栏：雷达图 SVG + 图例面板
- 两图信息互补：折线看趋势，雷达看维度诊断

---

## 阶段十七：切换 Tab 内容顶部被遮挡修复

**用户反馈**：选择 Agent 评分 / 痛点分析 / VOD 原声后，下面内容的顶部被遮挡了。

**根因**：ev-tabs 是 `position:sticky; top:88px`。用户滚动到详情中间再切换 Tab 时，新 panel 顶部已经在视口上方，被 sticky tabs 遮住。

**修复**：`switchEvTab()` 末尾检测当前 `scrollY` 是否超过 ev-tabs 的文档位置减 88px，若超过则平滑滚回，确保切换后 tabs 贴顶、内容从 tabs 正下方开始显示。

---

## 阶段十八：Agent 面板重构 —— 总结 + Agent 观测 替代"卡点"

**用户提问**：之前 Agent 对旅程中每个阶段的任务是自己跑的，跑完之后会发现痛点并做总结。这里的"卡点"和客户痛点/VOD 没有关系，那应该放痛点和总结吗还是只放卡点？

**概念澄清**（三类证据来源）：

| 证据 | 来源 | 性质 |
|------|------|------|
| Agent 总结 + 观测 | 自动评测 Agent 执行过程 | 客观测量，系统层面哪里跑不通 |
| 痛点分析 | 大客户（腾讯/蚂蚁/美团/京东）报告 | 业务反馈，客户感知到了什么 |
| VOD 原声 | 社区 issue / 论坛原话 | 开发者声音，大众用户说了什么 |

**AI 方案**：放两个都放，但改名以区分——"痛点"已被客户 Tab 占用，Agent 的产出改名为：
- **总结**：Agent 对该步骤整体状态的一句话判断（灰色细字，快速浏览）
- **Agent 观测**：Agent 跑任务发现的离散具体问题，逐条列出（红色左边框条目）

**数据结构变化**：每个 `agentStep` 的 `stuck` 字段拆成 `summary` + `observations:[]` 数组，所有 11 个 agentStep 数据均已更新。

---

## 阶段十九：总览看板大重构 —— ECharts、角色筛选、痛点重设计

**日期**：2026-05-15

**主要变更**：

1. **导航简化**：只保留两个顶层 tab（总览 / 用户旅程），清理所有遗留子 tab div
2. **用户旅程 tab 扁平化**：移除触点分析 / 场景详情子 tab；触点矩阵直接内嵌于 KPI 行和场景列表之间
3. **总览加入 ECharts 图表**：KPI sparklines × 4、健康矩阵 sparklines × 5、PyTorch API 雷达、模型开箱覆盖环形图（77% 综合，5 段多色）、Agentic 仪表盘、大客户闭环柱状图、痛点分布柱状图、VOD 柱状图
4. **角色/视角筛选**：filter-bar 加入 6 个角色 chip（全部/算子开发/AI框架/体验设计/资料/基础设施），选中后淡化无关楼层（opacity .2），相关楼层显示"关注"徽章
5. **设计点按钮 tab-aware**：总览 → 固定侧抽屉 `.ov-rat-panel`；用户旅程 → 内嵌 `.rat-sidebar`；填写了总览设计依据 6 条
6. **"零 Day"→"0 Day"**：全文替换
7. **模型覆盖环形图**：填入假数据（大语言 100%、多模态 100%、VLLM 78%、SGLang 65%、VERL 42%），增加中心 graphic 标注"77% 综合覆盖"
8. **痛点 section 重设计**：  
   - 移除旧的分类分组展示  
   - 加入分类汇总 chip 行（全部/工具3/文档5/API2/环境1），支持点击过滤（`filterPain()`）  
   - 统一痛点列表 P0→P1 排序，每条卡片带 `data-cat` 属性 + 描边分类 badge  
   - 痛点卡片紧凑化：padding 7px 10px、font-size 11px、line-height 1.5
9. **社区入门体验设计**：在生态增益楼层加入 S0–S5 步骤圆圈导览 + KPI 4格 + 关键痛点 callout
10. **PyTorch 雷达图**：补全 5 条产品线数据（算子库/通信库/Ascend C/图引擎/运行时）

**设计决策**：
- 角色筛选（宏观淡化页面）vs 分类 chip（精细过滤痛点列表）：两层筛选粒度不同，互补而非重复
- 痛点展示规则在 chip 行明确：按优先级排序 · 仅展示代表性痛点，消除"为何展示几条"的困惑

---
## 阶段二十：痛点列表与角色视角联动                                                                                   
                                                            
  **日期**：2026-05-15                                                                                                  
   
  **背景**：原来的分类 chip（工具/文档/API/环境）与角色视角没有关联，用户无法通过切换角色来看该角色最关心的痛点。       
                                                            
  **变更**：                                                                                                            
                                                                                                                        
  1. **每条 pain-item 加 `data-roles`**，与顶栏角色 chip 共用同一套 ID：
     - AIC 日志 / 迁移工具 shape → `op infra`                                                                           
     - Builtin 文档 / Ascend C Python 文档 → `doc op`       
     - 算子编程 API 约束 → `op`                                                                                         
     - NPU 容器初始化耗时 → `infra op pm` 
                                                                                                                        
  2. **新增 `applyPainFilter()`**：基于全局 `_activeRole` 和 `_activeCat` 做交集过滤，同时动态更新各分类 chip 的计数    
                                                                                                                        
  3. **`selectRole()` 尾部调用 `applyPainFilter()`**：切换角色时痛点列表自动更新，chip 计数同步变化                     
                                                                                                                        
  4. **痛点楼层 `data-roles` 改为覆盖全部角色**（`op infra pm doc ux comm`），任何角色下都不被淡化
                                                                                                                        
  **设计决策**：角色筛选（宏观淡化楼层）和分类              
  chip（细化痛点类型）是两层过滤，互补不冲突——先按角色缩小范围，再按分类进一步定位。                  
---


## 阶段二十一：深入分析 ascendc-agent-main 评测系统

**日期**：2026-05-19

**起因**：用户提供了 ascendc-agent-main 文件夹，要求阅读并理解其内容，然后深入分析它与 design-options.html 看板数据的对应关系，并评估能否在本机运行。

---

### 分析一：这个文件夹实现了什么？

**结论**：一个用 Claude Code Agent 批量自动开发昇腾 NPU 算子、并评测开发者体验（DX）的自动化平台。

**四层架构**：

1. **批量调度系统（evaluation_system/）**
   - `orchestrator.py`（872行）：主控制器，串行开发算子、并行评测日志
   - `claude_runner.py`：为每个算子启动独立 Claude Code 会话，支持多 Token 轮换（应对限流）
   - `config_loader.py`：从 YAML 读取算子目录，按批次/难度/硬件类型查询
   - `obs_uploader.py`：把评测报告上传到华为云对象存储（OBS）

2. **8个专职 Agent（.claude/agents/）**
   - architect：设计算子规格、输出技术方案文档
   - developer：按设计写代码实现
   - tester：设计并执行测试用例
   - evaluator：分析开发日志、输出 DX 评分报告
   - reviewer：代码质量审查
   - comparator：性能/精度对比
   - precision-tuner：精度优化
   - team-lead：整体流程协调

3. **17个 Skill 技能库（.claude/skills/）**
   包括 ascendc-kernel-develop-workflow、ascendc-precision-debug、ascendc-env-check、
   ascendc-api-best-practices、ascendc-docker、ascend-docs-search 等

4. **配置与文档层**
   - operator_catalog.yaml：定义35个算子（L1-L3难度，Vector/Cube/CV_Fusion/General_Fusion分类）
   - evaluation_config.yaml：单算子最长1小时、总批次最长24小时
   - AscendC算子开发指南/：4000+页本地文档

**完整开发流程（6阶段，CLAUDE.md 强制要求全部完成）**：
```
方案设计 → 算子实现 → 构建测试 → 问题处理 → 结果总结 → 文档编写
```

**关键原则（摘自 CLAUDE.md）**：
- 必须使用基础矢量 API（Add/Mul/Exp 等），禁止高阶封装（Softmax/LayerNorm）
- 硬件参数必须动态获取（GetBlockNum()），禁止写死（blockDim = 8）
- 6阶段必须全部完成，禁止中途停止

---

### 分析二：ascendc-agent-main 数据对应到 design-options.html 哪些部分？

**数据流向**：
```
ascendc-agent-main 运行
    ↓ 产生
开发日志 (logs/batch_*/operator.md)
    ↓ evaluator agent 分析
评测报告（5维度评分 + 量化指标 + 痛点归因）
    ↓ 上传 OBS / 汇总
design-options.html 各板块
```

**具体对应关系**：

| 看板板块 | 数据来源 |
|---------|---------|
| 体验测试评分 算子编程 Ascend C（4.1/6） | evaluator 5维度聚合 × 0.6 |
| Agentic KPI — token消耗 / 耗时 | orchestrator 运行时记录（无需 NPU） |
| Agentic KPI — 开发成功率 / 用例通过率 | 真实编译+执行结果（需 NPU） |
| 客户痛点（工具/文档/API类条目） | evaluator 痛点归因：AIC日志→功能调测维度低分；API约束→感知学习文档完整性缺失 |
| 用户旅程雷达图5维 | evaluator 5个域直接映射 |
| 健康矩阵 Agent评分列 | evaluator 综合分 |

**evaluator 的5维度与看板的映射**：
| evaluator 域 | 看板雷达图维度 |
|-------------|--------------|
| 感知学习（文档完整性/准确性/可理解性） | 文档质量 |
| 算子设计与实现（API命名/样例覆盖） | 开发成功率 |
| 算子编译（编译次数/配置行数） | 环境效率 |
| 功能调测（测试循环次数） | 调试能力 |
| 性能调优（迭代次数） | 工具稳定性 |

**不来自此系统的部分**：PyTorch API 通过率、模型开箱覆盖（VLLM/SGLang/VERL）、0 Day 验证、VOD 原声、大客户闭环率——这些来自独立测试流水线、社区抓取、CRM 系统。

---

### 分析三：能否在本机运行？

**结论：不能完整运行，但可部分模拟。**

**运行卡点**：
1. Docker 未安装（`command not found: docker`）
2. 无昇腾 NPU 硬件（`/dev/davinci1` 等设备节点不存在）
3. Docker 基础镜像来自华为私有仓库，需要华为云账号认证：
   `FROM swr.cn-south-1.myhuaweicloud.com/ascendhub/cann:8.5.0-910b-openeuler24.03-py3.11`

**数据分类（是否需要 NPU）**：

不需要 NPU（约40%的看板数据）：
- 所有 DX 评分分析（evaluator 输出，纯日志文本分析）
- Agentic 过程指标（token数、耗时）
- VOD / 社区 / 客户反馈数据
- 社区入门体验 S0–S5（Agentic Web 浏览，不碰硬件）

必须 NPU（约60%）：
- PyTorch API 77,006个用例通过率
- 模型开箱覆盖率（VLLM/SGLang/VERL）
- 0 Day 发布验证
- 算子编译成功率 / 用例执行通过率
- 所有性能值（吞吐量/时延）

---

### 分析四：原作者是否有 NPU 服务器？

**结论：几乎可以确定有。**

证据：
1. 批次 ID 是真实时间戳（`batch_20260115_094732`、`batch_20260224_165307`），非示例占位
2. `optest-0.2.2-py3-none-any.whl`：自定义测试包已迭代到 0.2.2 版，经历真实使用
3. OBS 上传配置有真实华为云 bucket 路径和区域设置
4. 单算子超时限制 3600 秒是根据真实 NPU 编译/测试时长定出来的
5. 专门设计了多 Token 轮换系统（`ANTHROPIC_AUTH_TOKENS` 逗号分隔），说明长时间运行中单 token 限速会被打爆

---

### 分析五：Token 消耗评估

**结论：非常消耗，35个算子全批次约 $40–100+。**

代码中的直接证据：
- `AuthTokenRotator`：支持多 token 轮换，专门为高消耗设计
- 评测 JSON schema 中有 `cost_usd`、`cached_tokens` 字段，作者在认真追踪成本
- 每个算子跑3次独立 Claude 会话：开发 session + evaluator session + JSON 提取 session（Phase 2，900秒超时）
- 本地文档 4000+ 页，每次开发都会多次检索读取

估算：
| 维度 | 估算 |
|------|------|
| 单个 L1 简单算子 | ~20–50万 tokens（$1–3） |
| 35个算子全批次 | ~$40–100+ |
| L2/L3 复杂算子 | 编译多次失败会大幅拉高，可能 $5–10/个 |

系统已用的降本手段：Prompt Cache（`cached_tokens` 字段）、多 Token 轮换分摊限速

建议试跑命令（单个 L1 算子，最低成本验证流程）：
```bash
python3 evaluation_system/orchestrator.py --full-pipeline --limit 1 --difficulty L1
```

---

## 协作模式总结

| 模式 | 说明 |
|------|------|
| **方向由人，实现由 AI** | 用户给目标和约束，AI 负责技术选型和具体实现 |
| **迭代否定** | 多处设计经历 2-3 轮否定才到位，视觉判断靠用户，AI 不擅长预判审美偏好 |
| **选项前置** | 涉及视觉风格选择时，应先给 2-4 个方案让用户选，而不是直接实现 |
| **跨会话连续** | 通过 `context.md`（项目上下文）+ `process-log.md` + Claude memory 机制，支持跨 session 继续 |
| **数据先行** | 先用模拟数据搭通完整 UI 交互，后续替换真实 Agent 评分数据 |

---

## 最终文件结构

```
AscendCANN/
├── CANNlogo.png
├── Ascendlogo.svg
└── cann-dashboard/
    ├── analysis.html        ← UX 分析文档（封面 + 13 章节）
    ├── style.css            ← 分析文档样式
    ├── script.js            ← 分析文档交互逻辑
    ├── design-options.html  ← 新看板（单文件，模拟数据）
    ├── context.md           ← 项目上下文（跨会话使用）
    └── process-log.md       ← 本文件
```
