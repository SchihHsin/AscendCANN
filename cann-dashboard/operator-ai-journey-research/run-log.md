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
