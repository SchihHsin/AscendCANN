# CANN 用户体验旅程 Agentic 评分报告

更新时间：2026-05-14  
工作目录：`D:\HW\AscendCANN\cann-dashboard`

## 1. 这份报告的目标

这不是一份“仓库排行榜”，而是一份面向用户体验分析的报告。

- 不同角色在不同场景下，走 CANN 这条旅程时，会在哪个阶段卡住？
- 这些断点更像入口问题、环境问题，还是反馈问题？
- 哪些结论有实际证据，哪些结论仍然只是远程可观测推断？

## Agentic 评分结果

评分区间为 `0-100`。分数越高，说明 agent 越能在少人工干预的情况下自主推进。

- `90-100`：基本可自主推进
- `70-89`：可推进，但需少量人工补充
- `50-69`：能推进一部分，关键阶段会卡
- `30-49`：只能完成前半程
- `0-29`：几乎不可自主推进

## 分数怎么算

每个阶段分数都不是拍脑袋，而是按四项相加，满分 `100`：

| 组成项 | 满分 | 判断标准 |
|---|---:|---|
| 文档清晰度 | 30 | 是否有明确、线性的动作链，是否写清版本、路径、成功判据。 |
| 环境可达性 | 30 | 当前常见开发环境能推进到哪一步，前置限制越少分越高。 |
| 自动化友好度 | 25 | 是否容易脚本化、agent 化推进，是否依赖手工复制、手找权重、跨仓拼装。 |
| 反馈与验证质量 | 15 | 是否有 help、日志、测试、benchmark、结果校验、失败反馈。 |

`阶段分数 = 文档清晰度 + 环境可达性 + 自动化友好度 + 反馈与验证质量`

## 角色总分怎么算

每个 Persona 的综合评分按旅程权重加权，不是简单平均：

| 阶段 | 权重 |
|---|---:|
| 搜索发现 | 10% |
| 代码获取 | 10% |
| 环境准备 | 15% |
| 依赖安装 | 10% |
| 数据/权重/外部资产准备 | 10% |
| 首次运行 | 20% |
| 结果验证 | 10% |
| 深入修改/扩展 | 10% |
| 排障与回归 | 5% |

`角色总分 = Σ(阶段分数 × 阶段权重)`

之所以把“首次运行”和“环境准备”权重放高，是因为这两个阶段最决定首次体验成败。

## 一个例子

以 Persona 1 的“环境准备 = 40 分”为例，这个分数拆成：

- 文档清晰度：`9/30`
- 环境可达性：`15/30`
- 自动化友好度：`10/25`
- 反馈与验证质量：`6/15`

`9 + 15 + 10 + 6 = 40`

## 2. 总体结论

- 最佳体验角色：`算子 / 编译接口开发者`，综合分 `67.1`
- 最弱体验角色：`样例消费型开发者`，综合分 `49.1`
- 共同断点：`环境准备 / 首次运行`，受影响角色包括：样例消费型开发者, 模型 / 框架适配开发者, 算子 / 编译接口开发者, 系统 / 通信 / 基础设施开发者

一句话判断：CANN 的主要问题不是没有内容，而是用户进入后前 1 小时的推进链路不够顺滑。

## 3. Persona 1：样例消费型开发者

场景：想尽快跑通一个 CANN 样例，先验证这套生态对自己有没有用。

综合评分：`49.1 / 100`

| 阶段 | 分数 | 四项拆分 | 说明 |
|---|---:|---|---|
| 搜索发现 | 62 | 文档清晰度 27 / 环境可达性 11 / 自动化友好度 14 / 反馈与验证质量 10 | 命名和场景分类清楚，但 infer/train 空壳容易误导入口判断。 |
| 代码获取 | 58 | 文档清晰度 19 / 环境可达性 13 / 自动化友好度 15 / 反馈与验证质量 11 | 主仓可 clone，但部分 repo 超时或只落 .git。 |
| 环境准备 | 40 | 文档清晰度 9 / 环境可达性 15 / 自动化友好度 10 / 反馈与验证质量 6 | 强依赖 Linux、CANN、NPU、conda、source set_env.sh。 |
| 依赖安装 | 46 | 文档清晰度 9 / 环境可达性 16 / 自动化友好度 14 / 反馈与验证质量 7 | embodied 相对直给，spatial 版本匹配更严。 |
| 数据/权重/外部资产准备 | 41 | 文档清晰度 9 / 环境可达性 14 / 自动化友好度 12 / 反馈与验证质量 6 | VGGT 还要上游代码和权重手动准备。 |
| 首次运行 | 43 | 文档清晰度 8 / 环境可达性 14 / 自动化友好度 10 / 反馈与验证质量 11 | 文档明确，但真实前提过多，当前机上无法推进到执行。 |
| 结果验证 | 55 | 文档清晰度 13 / 环境可达性 13 / 自动化友好度 14 / 反馈与验证质量 15 | pi0 有性能与输出说明，VGGT 有评测入口。 |
| 深入修改/扩展 | 61 | 文档清晰度 14 / 环境可达性 13 / 自动化友好度 22 / 反馈与验证质量 12 | 有一定可读性，但路径碎片化明显。 |
| 排障与回归 | 44 | 文档清晰度 7 / 环境可达性 10 / 自动化友好度 12 / 反馈与验证质量 15 | 缺统一 troubleshooting 中心。 |

### 用户体验分析

- 样例内容本身不算少，但对第一次进入的人来说，真正断点不在“有没有例子”，而在“哪个例子最短、最稳、最适合我”。
- 进入代码后，环境、依赖、权重和上游仓准备连续叠加，导致首次成功体验被推迟。
- 验证入口存在，但从“看懂说明”到“在当前机器上真实推进”之间仍有明显断层。

### 辅助证据

- README 覆盖率：`100.0%`
- docs 覆盖率：`85.7%`
- examples 覆盖率：`28.6%`
- tests 覆盖率：`28.6%`
- scripts 入口覆盖率：`28.6%`
- package/build 覆盖率：`14.3%`
- 平均 README 长度：`5136.57`
- 平均摩擦信号数：`0.43`
- 相对最强入口：`cann-samples, cann-recipes-embodied-intelligence, cann-recipes-spatial-intelligence`
- 最可能造成误判/卡顿的入口：`cann-recipes-harmony-infer, cann-recipes-train, cann-learning-hub`

### 直接证据

- [embodied README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\cann-recipes-embodied-intelligence\README.md)
- [pi0 infer README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\cann-recipes-embodied-intelligence\manipulation\pi0\infer_with_torch\README.md)
- [VGGT README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\cann-recipes-spatial-intelligence\models\vggt\README.md)

## 4. Persona 2：模型 / 框架适配开发者

场景：想把上游模型、训练/推理框架或服务后端迁移到 CANN 生态。

综合评分：`54.0 / 100`

| 阶段 | 分数 | 四项拆分 | 说明 |
|---|---:|---|---|
| 搜索发现 | 68 | 文档清晰度 30 / 环境可达性 12 / 自动化友好度 16 / 反馈与验证质量 10 | 分场景清晰，较容易定位模型。 |
| 代码获取 | 61 | 文档清晰度 20 / 环境可达性 14 / 自动化友好度 16 / 反馈与验证质量 11 | 主仓可获取，附属仓稳定性一般。 |
| 环境准备 | 45 | 文档清晰度 10 / 环境可达性 18 / 自动化友好度 11 / 反馈与验证质量 6 | 完整 CANN / NPU 前提依旧很重。 |
| 依赖安装 | 50 | 文档清晰度 10 / 环境可达性 17 / 自动化友好度 15 / 反馈与验证质量 8 | 版本信息有写，但不是一步完成。 |
| 数据/权重/外部资产准备 | 36 | 文档清晰度 8 / 环境可达性 12 / 自动化友好度 11 / 反馈与验证质量 5 | VGGT 需要上游 clone + 手工复制 + checkpoint 放置。 |
| 首次运行 | 48 | 文档清晰度 9 / 环境可达性 15 / 自动化友好度 12 / 反馈与验证质量 12 | 对熟手尚可，对 agent 自动化不友好。 |
| 结果验证 | 63 | 文档清晰度 15 / 环境可达性 16 / 自动化友好度 17 / 反馈与验证质量 15 | 性能优化文档、精度验证文档是强项。 |
| 深入修改/扩展 | 72 | 文档清晰度 17 / 环境可达性 16 / 自动化友好度 25 / 反馈与验证质量 14 | 适合做模型改造和脚本层调优。 |
| 排障与回归 | 52 | 文档清晰度 9 / 环境可达性 13 / 自动化友好度 15 / 反馈与验证质量 15 | 有验证脚本，但回归路径不统一。 |

### 用户体验分析

- 这类用户最不缺的是材料，最缺的是一条跨仓、跨框架、跨依赖的连续动作链。
- 数据/权重/外部资产准备阶段明显拉低总分，说明迁移成本主要消耗在拼装，而不是发现知识。
- 深入修改与扩展阶段反而较强，意味着它更适合熟手工程师，而不适合低介入自动推进。

### 辅助证据

- README 覆盖率：`100.0%`
- docs 覆盖率：`100.0%`
- examples 覆盖率：`25.0%`
- tests 覆盖率：`25.0%`
- scripts 入口覆盖率：`62.5%`
- package/build 覆盖率：`50.0%`
- 平均 README 长度：`4840.25`
- 平均摩擦信号数：`1.25`
- 相对最强入口：`xla-npu, torchtitan-npu, triton-inference-server-ge-backend`
- 最可能造成误判/卡顿的入口：`cann-recipes-train, cann-recipes-infer, cann-recipes-spatial-intelligence`

### 直接证据

- [observations JSON](D:\HW\AscendCANN\cann-dashboard\cann-agentic-observations.json)
- [repo coverage JSON](D:\HW\AscendCANN\cann-dashboard\cann-repo-coverage.json)

## 5. Persona 3：算子 / 编译接口开发者

场景：想开发或调试底层算子、模板库或语言接口，关注结构化开发体验。

综合评分：`67.1 / 100`

| 阶段 | 分数 | 四项拆分 | 说明 |
|---|---:|---|---|
| 搜索发现 | 57 | 文档清晰度 25 / 环境可达性 10 / 自动化友好度 13 / 反馈与验证质量 9 | pyasc 定位清楚，但 ops-math 当前不可用。 |
| 代码获取 | 63 | 文档清晰度 20 / 环境可达性 15 / 自动化友好度 16 / 反馈与验证质量 12 | pyasc 获取完整，ops-math 为空壳。 |
| 环境准备 | 60 | 文档清晰度 14 / 环境可达性 23 / 自动化友好度 15 / 反馈与验证质量 8 | pyasc 按有无 NPU 分环境路径，这点明显更成熟。 |
| 依赖安装 | 66 | 文档清晰度 14 / 环境可达性 22 / 自动化友好度 19 / 反馈与验证质量 11 | pip install pyasc 与源码安装并存。 |
| 数据/权重/外部资产准备 | 92 | 文档清晰度 22 / 环境可达性 30 / 自动化友好度 25 / 反馈与验证质量 15 | 基本不依赖模型权重。 |
| 首次运行 | 64 | 文档清晰度 13 / 环境可达性 20 / 自动化友好度 16 / 反馈与验证质量 15 | 纯 Python 代码 compileall 通过，但真实编译执行仍需要 LLVM/CANN。 |
| 结果验证 | 62 | 文档清晰度 15 / 环境可达性 15 / 自动化友好度 17 / 反馈与验证质量 15 | 有 test/tutorial，但当前机缺编译工具链。 |
| 深入修改/扩展 | 78 | 文档清晰度 20 / 环境可达性 18 / 自动化友好度 25 / 反馈与验证质量 15 | 文档、API、教程、结构都适合深入开发。 |
| 排障与回归 | 69 | 文档清晰度 14 / 环境可达性 19 / 自动化友好度 21 / 反馈与验证质量 15 | 静态分析和有限自动化空间较大。 |

### 用户体验分析

- 底层开发仓库的结构化程度明显更高，说明这里的主要问题不是信息架构，而是工具链门槛。
- 数据/权重阶段得分极高，反而说明它的痛点集中在编译、运行和环境可达性，而不是外部资产依赖。
- 这是最接近“可 agent 化推进”的一类角色，但仍然需要更强的环境自检与失败反馈闭环。

### 辅助证据

- README 覆盖率：`100.0%`
- docs 覆盖率：`95.5%`
- examples 覆盖率：`72.7%`
- tests 覆盖率：`100.0%`
- scripts 入口覆盖率：`90.9%`
- package/build 覆盖率：`100.0%`
- 平均 README 长度：`4878.55`
- 平均摩擦信号数：`2.45`
- 相对最强入口：`pyasc, asc-devkit, asc-tools`
- 最可能造成误判/卡顿的入口：`ops-collections, opbase, ops-fft`

### 直接证据

- [pyasc README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\pyasc\README.md)
- [pyasc quick start](D:\HW\AscendCANN\cann-dashboard\repo-evidence\pyasc\docs\quick_start.md)
- [observations JSON](D:\HW\AscendCANN\cann-dashboard\cann-agentic-observations.json)

## 6. Persona 4：系统 / 通信 / 基础设施开发者

场景：想搭建、调试或扩展运行时、通信与系统基础设施。

综合评分：`50.2 / 100`

| 阶段 | 分数 | 四项拆分 | 说明 |
|---|---:|---|---|
| 搜索发现 | 52 | 文档清晰度 23 / 环境可达性 9 / 自动化友好度 12 / 反馈与验证质量 8 | hixl 清楚，但 hcomm/asc-devkit 取不到有效内容。 |
| 代码获取 | 48 | 文档清晰度 16 / 环境可达性 11 / 自动化友好度 12 / 反馈与验证质量 9 | hixl 完整，另外两个当前只落 .git。 |
| 环境准备 | 34 | 文档清晰度 8 / 环境可达性 13 / 自动化友好度 8 / 反馈与验证质量 5 | 设备、驱动、Docker、hccn_tool、网络互通要求都高。 |
| 依赖安装 | 39 | 文档清晰度 8 / 环境可达性 13 / 自动化友好度 12 / 反馈与验证质量 6 | 需要 GCC/CMake/bash/third-party，当前机最小帮助都跑不动。 |
| 数据/权重/外部资产准备 | 95 | 文档清晰度 25 / 环境可达性 30 / 自动化友好度 25 / 反馈与验证质量 15 | 这类仓库基本不依赖模型权重。 |
| 首次运行 | 28 | 文档清晰度 5 / 环境可达性 9 / 自动化友好度 7 / 反馈与验证质量 7 | 首次上手几乎必然卡在环境和工具链。 |
| 结果验证 | 51 | 文档清晰度 11 / 环境可达性 12 / 自动化友好度 13 / 反馈与验证质量 15 | tests/examples/benchmarks 齐，但前提太重。 |
| 深入修改/扩展 | 76 | 文档清晰度 19 / 环境可达性 17 / 自动化友好度 25 / 反馈与验证质量 15 | 工程化程度高，适合成熟团队。 |
| 排障与回归 | 67 | 文档清晰度 13 / 环境可达性 19 / 自动化友好度 20 / 反馈与验证质量 15 | 脚本和结构较规范。 |

### 用户体验分析

- 这类角色的问题不是仓库组织混乱，而是现实环境前提过重，首跑成功率天然偏低。
- 数据/权重阶段几乎不是问题，首次运行和环境准备才是真正断点。
- 对这类用户，最关键的不是再补说明，而是提供设备前提校验、失败即解释和最小预演路径。

### 辅助证据

- README 覆盖率：`100.0%`
- docs 覆盖率：`83.3%`
- examples 覆盖率：`66.7%`
- tests 覆盖率：`75.0%`
- scripts 入口覆盖率：`91.7%`
- package/build 覆盖率：`83.3%`
- 平均 README 长度：`4472.0`
- 平均摩擦信号数：`1.75`
- 相对最强入口：`hixl, hcomm, hccl`
- 最可能造成误判/卡顿的入口：`cann-infra-mcp, infrastructure, cmake`

### 直接证据

- [hixl README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\hixl\README.md)
- [hixl build docs](D:\HW\AscendCANN\cann-dashboard\repo-evidence\hixl\docs\build.md)
- [observations JSON](D:\HW\AscendCANN\cann-dashboard\cann-agentic-observations.json)

## 7. 原始数据与方法文件

- [04-journey-agentic-report.html](D:\HW\AscendCANN\cann-dashboard\04-journey-agentic-report.html)
- [cann-agentic-summary.json](D:\HW\AscendCANN\cann-dashboard\cann-agentic-summary.json)
- [cann-agentic-observations.json](D:\HW\AscendCANN\cann-dashboard\cann-agentic-observations.json)
- [scripts/render_ux_journey_report.py](D:\HW\AscendCANN\cann-dashboard\scripts\render_ux_journey_report.py)
- [scripts/journey_scoring.py](D:\HW\AscendCANN\cann-dashboard\scripts\journey_scoring.py)

