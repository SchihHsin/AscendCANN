# CANN × CUDA AI 可用性实测记录

日期：2026-08-18。执行者：可实时访问公开网页的 AI 助手。评测对象是“AI 将公开知识组织成可执行回复”的能力，不测 NPU/GPU 真机性能或产品功能强弱。

## 统一口径

每个任务用一对等价问句，分别只替换技术栈：要求给出可信来源、版本、可照抄步骤和验证信号。计分采用 `ai-usability-benchmark/score_template.py` 的 11 项指标；①–⑩基于以下过程记录，⑪由脚本的三源噪声 OR 公式计算。二手来源只计实际记录到的 CSDN 搜索触点；官方文档和官方仓不重复当作二手来源。

## A · 最小逐元素 Add 自定义核（版本敏感度：中）

问句（CANN）：`我需要在昇腾上实现一个不能直接复用的逐元素 Add 算子。请给出 Ascend C 的实现、编译运行与精度验证最小闭环，并锁定可信来源和版本。`

问句（CUDA）：`我需要在 CUDA 上实现一个不能直接复用的逐元素 Add kernel。请给出 CUDA C++ 的实现、编译运行与结果验证最小闭环，并锁定可信来源和版本。`

| 生态 | 实测检索过程 | 可复核观测 |
|---|---|---|
| CANN | 1 轮进入官方算子场景与 CANN 9.0.0 Ascend C 入口；再取 GitCode `asc-devkit` 9.0.0 Add 样例。 | 官方页为 SSR HTML；样例含 CopyIn/Compute/CopyOut、Tiling、环境变量、CMake、运行命令与 accuracy passed 信号。文档版本选择器同时暴露 9.0.0、8.5.0、8.3 RC 等 13 个版本；本轮观察到 CSDN 搜索是一个站外经验触点。 |
| CUDA | 1 轮打开 CUDA Programming Guide 13.3 的 `Intro to CUDA C++`。 | 静态正文含 `vecAdd`、kernel launch、边界检查、内存、同步、CPU/GPU 校验及完整代码。 |

来源：<https://www.hiascend.com/cn/developer/operator?tab=ascendc> · <https://gitcode.com/cann/asc-devkit/tree/9.0.0/examples/01_simd_cpp_api/00_introduction/01_add/basic_api_tque_add> · <https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/intro-to-cuda-cpp.html>

## B · ONNX 模型转换（版本敏感度：高）

问句（CANN）：`我有一个 ONNX 模型，需要转换成昇腾可部署的离线模型。请给出 ATC 的最小路径、版本约束、命令和验证信号。`

问句（CUDA）：`我有一个 ONNX 模型，需要转换成可部署的 TensorRT engine。请给出 trtexec 的最小路径、版本约束、命令和验证信号。`

| 生态 | 实测检索过程 | 可复核观测 |
|---|---|---|
| CANN | 1 轮抓取 CANN 9.0.0 ATC “学习向导”。 | 官方页为 SSR HTML，说明 ATC 将网络模型转换为 `.om` 离线模型，并暴露多个历史版本；该入口为学习导览，不含一份可直接照抄的转换命令。 |
| CUDA | 1 轮抓取 TensorRT Quick Start Guide。 | 静态正文说明 ONNX → engine → runtime 的完整链路，列出 `trtexec`，并链接至 ONNX 部署实例和 Triton Quick Start。 |

来源：<https://www.hiascend.com/document/detail/zh/canncommercial/900/devaids/atctool/atlasatc_16_0001.html> · <https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/quick-start-guide.html>

## C · 性能采集与分析（版本敏感度：中）

问句（CANN）：`我的昇腾任务吞吐异常，需要采集并定位性能瓶颈。请给出 CANN 性能分析工具的最小采集路径、关键输出和验证方式。`

问句（CUDA）：`我的 CUDA 任务吞吐异常，需要采集并定位性能瓶颈。请给出 Nsight Systems 的最小采集路径、关键输出和验证方式。`

| 生态 | 实测检索过程 | 可复核观测 |
|---|---|---|
| CANN | 1 轮抓取 CANN 9.0.0 性能调优工具简介。 | SSR HTML 说明该工具采集和分析 AI 任务各阶段关键性能指标、辅助定位软硬件瓶颈；入口本身未给出完整采集命令。 |
| CUDA | 1 轮抓取 Nsight Systems User Guide。 | 静态用户指南包含 “Preparing Your Application for Profiling”“Focused Profiling”等连续章节，并说明无需改应用即可启用 profiling。 |

来源：<https://www.hiascend.com/document/detail/zh/canncommercial/900/devaids/Profiling/atlasprofiling_16_0144.html> · <https://docs.nvidia.com/nsight-systems/UserGuide/index.html>

## 可解释边界

- CANN 侧的版本数量来自本轮可见的文档版本选择器，并不等于版本本身有问题；评分反映 AI 在单次回复中锁定合适版本的额外判断负担。
- NVIDIA 侧并未因“没有采集二手来源”被虚构加分；两侧空二手源按 1 分处理。CANN 侧的 CSDN 触点只表明站外内容可发现，未验证其正确性。
- “模型自带知识”为显式自评项；分数均不能替代人类 UX、硬件能力或生产成功率。
