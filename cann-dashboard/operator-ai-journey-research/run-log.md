# AI 实跑记录｜Ascend C 自定义算子从零开发（首轮）

> 日期：2026-08-17（Asia/Shanghai）  
> 执行者：具备联网检索与网页浏览能力的 AI 助手  
> 边界：知识发现、路径编排、可执行性与验证信息；**不含 NPU 实机编译/精度/性能验证**。  
> 对照：CUDA 13.3 官方文档的同等 Vector Add 最小 kernel 学习闭环。

## 0. 任务定义

**AI 接到的任务原文**

> 我需要在昇腾上实现一个当前不能直接复用的简单逐元素 Add 算子。请先判断应否复用或定制现有能力；如果需要自定义，请给出从 Ascend C 实现、编译运行到精度验证的最小闭环与可信来源。

**成功标准（本轮）**

1. 能找到官方入口，明确 Ascend C 是适合的实现路径；
2. 能获得带版本信息的最小实现、编译命令与成功验证信号；
3. 能说清本机无法替代 NPU 真机验证的边界；
4. 能定位到继续求助的公开触点，而不臆造论坛或 Issue 结论。

## 1. Ascend C 路径实跑

| # | AI 动作 / 触点 | 实测观测 | 结果 |
|---|---|---|---|
| A1 | 打开昇腾“算子开发场景”页 | 页面将算子开发方式分为 Ascend C、CATLASS、Triton，并按新手入门／进阶开发／深度创新给出环境、实现、编译运行、调试调优的旅程骨架。 | 通过 |
| A2 | 进入 CANN 9.0.0 文档的 Ascend C 入口 | 文档有“入门教程、环境准备、快速入门、编程指南、算子实践参考、兼容性迁移指南”等导航；说明 Ascend C 支持自定义创新算法。 | 通过 |
| A3 | 跟随 Add 的官方 GitCode 样例 | `CANN/asc-devkit` 的 `9.0.0` 分支提供 Add 直调样例，README 给出算子规格、CopyIn/Compute/CopyOut、Tiling、环境变量、CMake、运行命令和`[Success] Case accuracy is verification passed.` | 通过（知识闭环） |
| A4 | 检查公开求助路径 | 官方文档提供“在线提单”“论坛求助”；GitCode 项目公开显示 Issues 入口，但本次公开列表为 0 项。论坛的参数化搜索落到“发布帖子”页面，未得到可引用的真实报错帖。 | 部分通过；不以此推断社区无案例 |
| A5 | 尝试实机执行 | 当前工作机无 NPU/CANN 运行环境。本轮未执行 `cmake` / `make` / `./add`，也未对精度成功声明实测。 | 待 NPU 复跑 |

## 2. CUDA 对照实跑

| # | AI 动作 / 触点 | 实测观测 | 结果 |
|---|---|---|---|
| C1 | 打开 CUDA Programming Guide 13.3 | 顶层目录直接按 Introduction / Programming GPUs / Advanced / Features 组织，并有版本与 Archive。 | 通过 |
| C2 | 进入 `Intro to CUDA C++` | 同一连续正文中给出 `vecAdd` kernel、`<<< >>>` launch、线程/网格、边界检查、内存、同步、CPU/GPU 校验及完整代码。 | 通过（知识闭环） |
| C3 | 尝试实机执行 | 当前工作机没有 GPU/CUDA 环境；没有编译或运行。 | 待 GPU 复跑 |

## 3. 首轮可复核来源

1. 昇腾算子开发场景：<https://www.hiascend.com/cn/developer/operator?tab=ascendc>
2. Ascend C 概览（CANN 9.0.0）：<https://www.hiascend.com/document/detail/zh/canncommercial/latest/programug/Ascendcopdevg/atlas_ascendc_map_10_0002.html>
3. CANN/asc-devkit Add 样例（9.0.0）：<https://gitcode.com/cann/asc-devkit/tree/9.0.0/examples/01_simd_cpp_api/00_introduction/01_add/basic_api_tque_add>
4. CUDA 13.3 Intro to CUDA C++：<https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/intro-to-cuda-cpp.html>

## 4. 本轮结论的证据级别

- **实测**：上述 URL 在浏览器中可访问；页面正文、链接、版本、样例 README 及截图中可见的内容。
- **实测受阻**：通用搜索页请求超时；GitCode 当前公开 Issue 列表无条目；论坛参数化搜索没有返回帖子列表。
- **待验证**：实际算子编译、运行、精度验证、性能调优；需要一台版本匹配的 NPU 环境。
- **推断**：跨文档与代码仓连接带来的认知/编排成本，来自本次路径观察，须以多个真实任务与开发者复测校准。

## 5. 下一轮 NPU 复跑清单

1. 记录芯片型号、驱动、CANN 版本、安装方式与运行用户；
2. 按 README 配置 `set_env.sh`，运行 `cmake .. && make -j && ./add`；
3. 保存完整 stdout/stderr、构建耗时、首次报错与修复链路；
4. 修改 Add 的 shape / dtype 或计算逻辑，验证“复用／定制／从零”分流是否仍可完成；
5. 用完全对齐的 CUDA `vecAdd` 执行同一验证，比较成功率、轮数与故障恢复成本。

## 6. 公开真实用户案例补跑（2026-08-17）

> 目的：补充“开发者实际上如何使用生态、如何求助与恢复”的行为证据。来源是公开 GitHub Issue 与评论镜像，代表可追溯个案，不代表用户规模、满意度或所有生态路径。

| 案例 | 用户任务与上下文 | 公开支持 / 状态 | 可观察的旅程事实 |
|---|---|---|---|
| Ascend/pytorch #148 | 用户 `lrs02` 在 Ascend 910B 上，以 `torch_npu 2.1.0 + CANN 8.0.0` 微调 Qwen3-ASR；提交 E90003、bfloat16 TransData 不支持及训练日志。 | 提问者后续评论称切换到 910B2 并升级 CANN、torch_npu 后解决。 | 用户从模型微调任务和算子编译失败进入；软硬件/版本组合是求助上下文的一部分。 |
| Ascend/pytorch #106 | 用户 `NiYueLiuFeng` 在 `pytorch-7.3.0-pytorch2.6.0` 分支，以 Python 3.11 源码编译；报告缺少 `op_plugin_functions.yaml`、`derivatives.yaml`。 | 回复建议检查前序报错、使用干净/推荐编译环境，并回链官方源码安装文档。 | 有效支持不是重述安装说明，而是将当前分支、命令和报错路径映射到环境约束与文档。 |
| Ascend/pytorch #154 | 用户 `ShaohonChen` 在 Ascend950PR、CANN 9.0.0、torch 2.10.0、源码 torch_npu、triton-ascend 3.2.1 下，给出最小 GPT 多 NPU `torch.compile` 复现和硬件访问超时。 | 该问题同步到 GitCode；用户引用方案后反馈大参数量（1.5B）仍超时、原因未定位。 | 支持是一段可持续状态，而非“一条答案”；规模条件、未解分支和跨站链接必须能保留。 |
| Ascend/MindIE-LLM #1 | 用户 `flyingbytes163` 直接询问 PD 分离部署是否支持及参考方案。 | 回复确认支持、指出需要 K8s，并直链 PD 分离服务部署文档。 | 大模型应用用户从部署目标进入；任务路由比产品树导航更符合需求。 |
| MindSpore #402 | 用户 `ALinrunrun` 为 `ops.igamma` 精度问题提交硬件、MindSpore/Python/OS/GCC 版本、输入与实际/预期行为。 | 截至抓取时开放、0 条评论。 | 高质量问题天然是“可复现任务包”：环境 + 最小输入 + 行为 + 预期；也揭示了无响应/未闭环状态需要被看见。 |

**快照保存**：`evidence/cases/` 保存前四个 Ascend Issue 及评论、MindSpore #402 的公开 GitHub API 响应，便于复核页面解析所依据的标题、时间、正文、状态和评论。

## 7. 公开案例样本扩充（2026-08-18）

在原有 5 个案例基础上，新增抓取 10 个公开 GitHub Issue 及评论快照，形成 15 个案例的结构化样本库：`evidence/case-corpus-20260818.json`。新增原始响应保存在 `evidence/cases-extended/`。

| 任务簇 | 公开案例 | 可观察事实 |
|---|---|---|
| 应用交付 | Ascend/pytorch #148、#154、#147、#144；MindIE-LLM #1 | 微调、推理、训练能力与部署架构都以任务目标进入；模型、硬件、CANN、框架、容器和规模条件决定路径。 |
| 构建与兼容 | Ascend/pytorch #106、#163、#149；Ascend/torchair #4、#2、#1 | 源码构建、上游兼容、模块导入和版本匹配构成连续支持需求；其中 #149 已关闭，其他多个公开状态仍为 open。 |
| 正确性与性能 | MindSpore #402；Ascend/pytorch #133、#153、#125 | 精度、设备崩溃、Profiler 输出兼容和 ATC 混合精度转换都需要携带硬件、版本、输入 / 预期或错误码。#133 带公开方案，多个问题仍未闭环。 |

### 样本编码结论

1. 15 个案例的起点均是明确任务、异常或版本选择；没有一个案例以“寻找内容栏目”为起点。
2. 高频上下文包括硬件、CANN / 框架版本、分支、容器、最小复现、日志 / 错误码、精度预期和规模条件。
3. 公开状态区分“用户报告恢复 / 已关闭”“给出路径或方案”“开放 / 未完全闭环”；支持结果不能只以“回复过”计量。

## 8. CANN × CUDA AI 可用性对照实测（2026-08-18）

**方法**：对 3 个等价任务分别提出 CANN 和 CUDA 问句，要求给出可信来源、版本、可执行步骤和验证信号。原始过程、URL 和口径在 `evidence/ai-usability/ai-usability-run-20260818.md`；原始观测在 `score_20260818.py`；结果由同目录脚本计算至 `scores_20260818.json`。

| 任务 | CANN ⑪ 综合置信度 | CUDA ⑪ 综合置信度 | 差异来自本轮可观察证据 |
|---|---:|---:|---|
| A 自定义 Add 算子 | 0.768（中高） | 1.000（高） | CANN 需要在 Ascend C 文档、GitCode 9.0.0 样例与较多文档版本间组合；CUDA 13.3 同页给出完整 `vecAdd` 闭环。 |
| B ONNX 模型转换 | 0.741（中高） | 0.962（高） | ATC 学习向导说明模型转换但当前入口未给最小可抄命令；TensorRT Quick Start 将 ONNX → engine → runtime、`trtexec` 与部署实例连接在连续正文。 |
| C 性能分析 | 0.741（中高） | 1.000（高） | CANN 性能调优入口说明能力与指标，当前入口未给完整采集路径；Nsight Systems User Guide 提供连续 profiling 准备与聚焦章节。 |

**对照结论**：3 个 CANN 官方入口均能在 1 轮发现；差距集中在 AI 将概览知识收敛为“版本锁定、最小命令、预期信号和恢复路径”的成本。该方法不衡量硬件性能、人类视觉 UX 或生产成功率；模型自带知识为显式自评项。

## 9. 报告新增模块（2026-08-18）

- 案例样本库：15 个 Issue 按应用交付、构建与兼容、正确性与性能三类任务可视化，并显示公开闭环状态。
- 大模型应用旅程：定义目标 → 选型与配套 → 首个可运行结果 → 排障与扩展 → 交付与回流；每阶段都关联公开案例、触点和具体断点。
- AI 对照矩阵：将 3 个任务的 CANN / CUDA ⑪ 综合置信度、最大差距与实测依据并列呈现。
- 生态职责与任务会话：明确文档、GitCode、站外经验、AI、社区的职责，并给出任务简报、可信路径、验证、升级、回流的最小服务流与字段。

## 10. CANN × CUDA 开发者旅程对比（2026-08-18）

在评分矩阵之外，报告新增“同一任务下的旅程对比”章节，按发现入口、选择版本与路径、获得首跑步骤、失败恢复、回流与复用五阶段并列 CANN / CUDA 的本轮可观察触点。

| 阶段 | CANN 实测触点 | CUDA 实测触点 | 本轮观察 |
|---|---|---|---|
| 发现 | 算子场景、ATC / Profiling 文档入口 | CUDA Quick Start、TensorRT Quick Start、Nsight Systems User Guide | 两侧均能 1 轮到达。 |
| 选择 | 芯片 / CANN / 框架 / 容器与多个文档版本共同影响选择 | CUDA 13.3 Quick Start 与 TensorRT 专题路径 | CANN 的版本、硬件和框架组合在真实 Issue 中反复出现，单次回复需要更多条件收集。 |
| 首跑 | Ascend C Add 样例提供完整闭环；ATC / Profiling 当前导览页偏概览 | vecAdd、TensorRT ONNX 与 Nsight 指南在连续官方正文中连接更多步骤 | 与 3 个 AI 实测的“官方正文详尽度、复现性”评分一致。 |
| 恢复 | GitCode Issue、论坛、工单，公开案例要求携带日志 / 版本 / 复现 | NVIDIA Developer Forums 可达；本轮未采集等量 CUDA Issue | 不对两侧恢复率做数值结论。 |
| 回流 | GitCode 有 Issue / PR / SIG；状态与规模条件常分散在评论中 | 官方文档与论坛并行 | CANN 的机会是将验证状态、未解条件和复用结果结构化回流。 |

来源：CANN / CUDA 任务来源见第 8 节；CUDA Quick Start：<https://docs.nvidia.com/cuda/cuda-quick-start-guide/index.html>；NVIDIA Developer Forums：<https://forums.developer.nvidia.com/>。该对比描述公开知识与协作路径，不比较硬件性能、工具功能、用户规模或社区贡献总量。
