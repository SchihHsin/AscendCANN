# CANN 用户体验旅程 Agentic 评分报告

更新时间：2026-05-14  
工作目录：`D:\HW\AscendCANN\cann-dashboard`

## 1. 这份报告的目标

这不是一份“仓库排行榜”，而是一份面向用户体验分析的报告。
主问题不是“哪个仓库分高”，而是：

- 不同角色在不同场景下，走 CANN 这条旅程时，会在哪个阶段卡住？
- 这些断点更像“内容缺失”，还是“环境摩擦”，还是“入口不清楚”？
- 哪些结论有强证据，哪些结论仍然只是远程可观测推断？

## 2. 报告结构

这次我把全量数据重新组织成 `角色 - 场景 - 旅程阶段` 的 UX 叙事：

1. 先按角色定义典型场景
2. 再按统一旅程阶段打分
3. 最后用仓库数据作为证据层解释这些分数

旅程阶段统一为：

- `发现入口`
- `判断是否适合我`
- `获取代码与资源`
- `环境准备`
- `首次运行`
- `验证结果`
- `深入扩展/回归`

## 3. 评分方法

这次不是直接给角色“拍分”，而是分两层算：

### 3.1 仓库级可观测证据

每个仓库都先根据 README、docs、examples、tests、package/build 入口、运行信号、摩擦信号、本地验证状态生成一个基础观测结果。

### 3.2 角色级旅程阶段分

再把同一角色相关的一组仓库聚合成旅程阶段分。
例如：

- `发现入口` 主要看 discoverability + documentation
- `环境准备` 主要看 setup_explicitness + friction_penalty
- `首次运行` 主要看 run_affordance + verification + friction_penalty + 本地状态

也就是说，仓库数据不再是最终结论本身，而是用户旅程阶段分的证据来源。

## 4. 总体结论

- 体验最佳的角色是：`算子/库开发者`，综合分 `85.77`
- 体验最弱的角色是：`行业方案开发者`，综合分 `41.24`
- 共同问题最重的阶段集中在：`环境准备 / 首次运行`，受影响角色包括：样例体验型开发者, 模型/框架适配工程师, 行业方案开发者

一句话判断：

CANN 现在的问题，不是“没有仓库内容”，而是“内容很多，但不同角色进入后，前 1 小时的体验链路不够顺滑”。

## 5. 样例体验型开发者

场景：想尽快跑通一个 CANN 上的样例，验证“这个生态对我有没有用”。

相关仓库数：`7`  
综合体验分：`58.36`

| 旅程阶段 | 分数 |
|---|---:|
| 发现入口 | 92.29 |
| 判断是否适合我 | 66.64 |
| 获取代码与资源 | 62.71 |
| 环境准备 | 56.36 |
| 首次运行 | 54.79 |
| 验证结果 | 44.07 |
| 深入扩展/回归 | 41.5 |

### 证据摘要

- README 覆盖率：`100.0%`
- docs 覆盖率：`85.7%`
- examples 覆盖率：`28.6%`
- tests 覆盖率：`28.6%`
- script/tool 入口覆盖率：`28.6%`
- package/build 入口覆盖率：`14.3%`
- 平均 README 长度：`5136.57`
- 平均摩擦信号数：`0.43`
- 本地完整验证数：`2`
- 本地不完整/空壳验证数：`2`

### 用户体验分析

- 样例仓库文档可读，但首次运行前的环境与权重准备摩擦仍然最高。
- 同一类任务分散在多个 recipe 仓库，用户很难快速判断哪个入口最适合当前目标。
- 本地强证据主要来自 embodied/spatial 两个代表样本，说明“能看懂”和“能跑通”之间仍有明显落差。

### 相关仓库中相对最强的入口

- `cann-samples`
- `cann-recipes-embodied-intelligence`
- `cann-recipes-spatial-intelligence`

### 相关仓库中最可能造成误判/卡顿的入口

- `cann-recipes-harmony-infer`
- `cann-recipes-train`
- `cann-learning-hub`

### 直接证据

- [embodied README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\cann-recipes-embodied-intelligence\README.md)
- [pi0 infer README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\cann-recipes-embodied-intelligence\manipulation\pi0\infer_with_torch\README.md)
- [VGGT README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\cann-recipes-spatial-intelligence\models\vggt\README.md)

## 6. 模型/框架适配工程师

场景：想把上游模型、训练/推理框架或服务后端迁移到 CANN 生态。

相关仓库数：`8`  
综合体验分：`65.35`

| 旅程阶段 | 分数 |
|---|---:|
| 发现入口 | 93.31 |
| 判断是否适合我 | 74.62 |
| 获取代码与资源 | 71.04 |
| 环境准备 | 69.75 |
| 首次运行 | 58.89 |
| 验证结果 | 44.94 |
| 深入扩展/回归 | 50.02 |

### 证据摘要

- README 覆盖率：`100.0%`
- docs 覆盖率：`100.0%`
- examples 覆盖率：`25.0%`
- tests 覆盖率：`25.0%`
- script/tool 入口覆盖率：`62.5%`
- package/build 入口覆盖率：`50.0%`
- 平均 README 长度：`4840.25`
- 平均摩擦信号数：`1.25`
- 本地完整验证数：`2`
- 本地不完整/空壳验证数：`2`

### 用户体验分析

- 模型适配类仓库的文档通常够长，但路径经常跨上游仓库、权重、框架后端和环境依赖。
- 从“找到方案”到“完成首次运行”的中间断点最多，说明适配成本主要消耗在拼装过程而不是知识发现本身。
- 这类用户最需要的是标准化迁移模板和外部依赖清单，而不是更多分散 README。

### 相关仓库中相对最强的入口

- `xla-npu`
- `torchtitan-npu`
- `triton-inference-server-ge-backend`

### 相关仓库中最可能造成误判/卡顿的入口

- `cann-recipes-train`
- `cann-recipes-infer`
- `cann-recipes-spatial-intelligence`

### 直接证据

- [observations JSON](D:\HW\AscendCANN\cann-dashboard\cann-agentic-observations.json)
- [repo coverage JSON](D:\HW\AscendCANN\cann-dashboard\cann-repo-coverage.json)

## 7. 算子/库开发者

场景：想开发或调试底层算子、模板库或语言接口，关注结构化开发体验。

相关仓库数：`22`  
综合体验分：`85.77`

| 旅程阶段 | 分数 |
|---|---:|
| 发现入口 | 95.09 |
| 判断是否适合我 | 87.65 |
| 获取代码与资源 | 85.48 |
| 环境准备 | 90.98 |
| 首次运行 | 77.97 |
| 验证结果 | 80.33 |
| 深入扩展/回归 | 84.97 |

### 证据摘要

- README 覆盖率：`100.0%`
- docs 覆盖率：`95.5%`
- examples 覆盖率：`72.7%`
- tests 覆盖率：`100.0%`
- script/tool 入口覆盖率：`90.9%`
- package/build 入口覆盖率：`100.0%`
- 平均 README 长度：`4878.55`
- 平均摩擦信号数：`2.45`
- 本地完整验证数：`1`
- 本地不完整/空壳验证数：`2`

### 用户体验分析

- 算子/库类仓库的结构化程度明显更高，说明这条旅程的主要问题不是文档，而是工具链环境门槛。
- 仓库层面的可编排性不错，但只有少量仓库进入了 A 级本地验证，意味着高置信体验结论仍偏少。
- 对这类用户来说，‘环境可自检’比‘文档再增加一页’更能改善实际体验。

### 相关仓库中相对最强的入口

- `pyasc`
- `asc-devkit`
- `asc-tools`

### 相关仓库中最可能造成误判/卡顿的入口

- `ops-collections`
- `opbase`
- `ops-fft`

### 直接证据

- [pyasc README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\pyasc\README.md)
- [pyasc quick start](D:\HW\AscendCANN\cann-dashboard\repo-evidence\pyasc\docs\quick_start.md)
- [observations JSON](D:\HW\AscendCANN\cann-dashboard\cann-agentic-observations.json)

## 8. 系统/通信工程师

场景：想搭建、调试或扩展运行时、通信与系统基础设施。

相关仓库数：`12`  
综合体验分：`79.85`

| 旅程阶段 | 分数 |
|---|---:|
| 发现入口 | 90.99 |
| 判断是否适合我 | 83.4 |
| 获取代码与资源 | 81.14 |
| 环境准备 | 85.67 |
| 首次运行 | 73.8 |
| 验证结果 | 70.1 |
| 深入扩展/回归 | 74.8 |

### 证据摘要

- README 覆盖率：`100.0%`
- docs 覆盖率：`83.3%`
- examples 覆盖率：`66.7%`
- tests 覆盖率：`75.0%`
- script/tool 入口覆盖率：`91.7%`
- package/build 入口覆盖率：`83.3%`
- 平均 README 长度：`4472.0`
- 平均摩擦信号数：`1.75`
- 本地完整验证数：`1`
- 本地不完整/空壳验证数：`1`

### 用户体验分析

- 系统/通信类仓库在结构化入口上成熟，但用户体验的主阻塞并不是仓库组织，而是设备、驱动、编译链和集群前提。
- 也就是说，这类仓库的 UX 问题更偏‘环境体验’，而不是‘仓库信息架构体验’。
- 如果不提供无设备预演、自检和快速失败反馈，这类角色的首次成功率仍然会很低。

### 相关仓库中相对最强的入口

- `hixl`
- `hcomm`
- `hccl`

### 相关仓库中最可能造成误判/卡顿的入口

- `cann-infra-mcp`
- `infrastructure`
- `cmake`

### 直接证据

- [hixl README](D:\HW\AscendCANN\cann-dashboard\repo-evidence\hixl\README.md)
- [hixl build docs](D:\HW\AscendCANN\cann-dashboard\repo-evidence\hixl\docs\build.md)
- [observations JSON](D:\HW\AscendCANN\cann-dashboard\cann-agentic-observations.json)

## 9. 行业方案开发者

场景：想直接复用行业场景仓库，验证是否能支撑业务 PoC 或领域方案开发。

相关仓库数：`4`  
综合体验分：`41.24`

| 旅程阶段 | 分数 |
|---|---:|
| 发现入口 | 70.29 |
| 判断是否适合我 | 55.19 |
| 获取代码与资源 | 50.0 |
| 环境准备 | 48.38 |
| 首次运行 | 36.94 |
| 验证结果 | 15.31 |
| 深入扩展/回归 | 15.56 |

### 证据摘要

- README 覆盖率：`100.0%`
- docs 覆盖率：`0.0%`
- examples 覆盖率：`0.0%`
- tests 覆盖率：`0.0%`
- script/tool 入口覆盖率：`0.0%`
- package/build 入口覆盖率：`0.0%`
- 平均 README 长度：`1491.0`
- 平均摩擦信号数：`0.0`
- 本地完整验证数：`0`
- 本地不完整/空壳验证数：`0`

### 用户体验分析

- 行业方案仓的价值主张清楚，但“拿来做 PoC”的路径不够清晰，导致业务用户难以快速确认可用性。
- 这类仓库在 README、examples、tests 上的可运行信号偏少，更像成果陈列而不是可直接复用的方案包。
- 对行业用户来说，‘一个最小可跑场景’往往比‘完整领域叙述’更关键。

### 相关仓库中相对最强的入口

- `elec-ops-prediction`
- `elec-ops-simulation`
- `mat-chem-sim-pred`

### 相关仓库中最可能造成误判/卡顿的入口

- `elec-ops-inspection`
- `elec-ops-prediction`
- `elec-ops-simulation`

### 直接证据

- [observations JSON](D:\HW\AscendCANN\cann-dashboard\cann-agentic-observations.json)
- [repo coverage JSON](D:\HW\AscendCANN\cann-dashboard\cann-repo-coverage.json)

## 10. 最后的 UX 结论

如果用 UX 语言总结，而不是用仓库语言总结，这份报告的核心发现是：

1. `入口问题`
   - 用户不是找不到内容，而是不知道“先看哪个、先跑哪个、哪个适合自己”。
2. `准备阶段问题`
   - 环境、权重、外部依赖、上游仓和工具链把很多旅程卡死在首次成功之前。
3. `反馈问题`
   - 很多仓库能让用户读懂，但不能让用户快速确认“我现在离成功还有多远”。
4. `角色分层问题`
   - 样例用户、适配工程师、算子开发者、系统工程师、行业方案开发者，其实不是同一条旅程；入口设计也不应该混在一起。

所以最应该改的不是“再补几份 README”，而是：

- 先按角色和目标重新组织入口
- 再给每条旅程补最小可运行路径
- 最后用环境自检、权重检查和失败反馈降低前 1 小时摩擦

## 11. 原始数据与方法文件

- [journey-agentic-report.html](D:\HW\AscendCANN\cann-dashboard\journey-agentic-report.html)
- [cann-agentic-summary.json](D:\HW\AscendCANN\cann-dashboard\cann-agentic-summary.json)
- [cann-agentic-observations.json](D:\HW\AscendCANN\cann-dashboard\cann-agentic-observations.json)
- [scripts/analyze_cann_repos.py](D:\HW\AscendCANN\cann-dashboard\scripts\analyze_cann_repos.py)
- [scripts/render_ux_journey_report.py](D:\HW\AscendCANN\cann-dashboard\scripts\render_ux_journey_report.py)
