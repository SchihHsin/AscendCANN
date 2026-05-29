# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本代码仓库中进行 Ascend C 算子开发提供指导。

> **语言要求**：所有回答必须使用中文。

---

## 项目概述

华为 CANN Ascend C 算子开发项目，用于开发在华为昇腾 AI 处理器上运行的自定义算子。

**核心功能**：
- 使用 Ascend C 编程语言开发昇腾 AI 处理器自定义算子
- 提供完整的开发、构建、测试工作流支持
- 遵循官方开发规范和性能优化最佳实践

**环境**：通过 `/ascendc-env-check` 动态探测（运行 `./env_setup.sh "bash .claude/skills/ascendc-env-check/scripts/detect_env.sh"`）

---

## 核心原则 ⭐⭐⭐

> 严格遵循以下 9 条核心原则，可避免 95% 的开发问题

### 原则 0：完整流程执行到底（最重要）⭐⭐⭐
- ✅ **算子开发必须完成全部 6 个阶段**才能结束
- ✅ 阶段顺序：方案设计 → 算子实现 → 构建测试 → 问题处理 → 结果总结 → 文档编写
- ✅ 每个阶段完成后**立即自动进入下一阶段**，不等待用户确认
- ❌ 禁止：在中间阶段停止
- ❌ 禁止：跳过构建测试阶段
- ❌ 禁止：未完成文档编写就结束

**6 个阶段定义**：
| 阶段 | 名称 | 完成标准 |
|------|------|---------|
| 1 | 方案设计 | plan 文档保存到 docs/ |
| 2 | 算子实现 | 代码文件创建完成 |
| 3 | 构建测试 | Level 0~3 测试通过 |
| 4 | 问题处理 | 编译运行无错误（如需要） |
| 5 | 结果总结 | 结果记录到 plan |
| 6 | 文档编写 | README.md 更新完成 |

### 原则 1：完整工作流程优先（最重要）⭐⭐⭐
- ✅ **所有算子开发第一步**：调用 `/ascendc-kernel-develop-workflow`
- ✅ 该 skill 会引导完成：需求分析 → 方案设计 → API 映射 → 开发计划
- ✅ 方案设计阶段会自动调用 `/ascend-complex-operator-guide` 确定算子类型
- ❌ 禁止：跳过工作流程直接开始编码

### 原则 2：遇问题直接定位修复
- ✅ 第一步：查阅本地文档和示例（Read、Grep、Glob）
- ✅ 第二步：定位问题点后修复该部分
- ✅ 本地文档不足时使用 `/ascend-docs-search`
- ❌ 禁止：下意识简化代码、凭直觉实现、遇到错误就推翻重写

### 原则 3：优先保证方案可用
- 方案走通后即完成开发，不进行额外优化探索
- 避免过度优化导致开发时间过长

### 原则 4：环境兼容性验证
- 确认 API/方法适用于当前环境（通过 `/ascendc-env-check` 获取的 CANN 版本和芯片型号）
- 遇到不兼容立即停止，搜索替代方案

### 原则 5：渐进式调试
- Level 0~N 多级用例：8元素 → 1K → 极值 → 大数据
- 复杂公式分段调试，使用 `AscendC::printf`

### 原则 6：定位问题而非推翻重写
- 遇到错误思考：哪些地方有问题？如何解决？
- ❌ 禁止：每次遇到错误就全部推翻重写

### 原则 7：禁止降级简化
- 不能因"能跑"就降低优化标准
- 不能简化双缓冲、Tiling 等必要优化

### 原则 8：使用基础矢量 API ⭐
- ✅ 使用基础矢量 API：`Add`、`Mul`、`Exp`、`ReduceSum`、`Div`、`Sub`、`Max` 等
- ❌ 禁止使用高阶封装 API：`AscendC::Softmax`、`AscendC::LayerNorm` 等
- 原因：基础 API 提供更细粒度的控制和更好的可理解性

### 原则 9：硬件参数必须动态获取 ⭐⭐⭐
- ✅ **必须**：使用 `AscendC::GetBlockNum()` 获取核数（Kernel 内）
- ✅ **必须**：使用 `AscendC::GetBlockIdx()` 获取核索引（Kernel 内）
- ✅ **必须**：使用 `platform->GetCoreNum()` 获取核数（Host 侧）
- ❌ **禁止**：写死硬件参数（如 `blockDim = 8`、`TILE = 4096`）
- ❌ **违反此原则 = 审查不通过**

| 参数 | 错误示例 | 正确示例 |
|-----|---------|---------|
| 核数 | `uint32_t blockDim = 8;` | `uint32_t blockDim = AscendC::GetBlockNum();` |
| 核索引 | `uint32_t blockIdx = 0;` | `uint32_t blockIdx = AscendC::GetBlockIdx();` |
| 分块大小 | `constexpr TILE = 4096;` | 根据 UB 容量动态计算 |

---

## 快速开始

### 开发流程概览

```
算子需求 → 调用 /ascendc-kernel-develop-workflow
              ↓
    ┌─────────────────────────────────────────────────┐
    │  阶段 1：方案设计 → 阶段 2：算子实现           │
    │       ↓                   ↓                     │
    │  阶段 3：构建测试 → 阶段 4：问题处理（如需要） │
    │       ↓                   ↓                     │
    │  阶段 5：结果总结 → 阶段 6：文档编写           │
    │                           ↓                     │
    │                    **开发完成**                │
    └─────────────────────────────────────────────────┘

⚠️ 强制要求：必须按顺序完成所有 6 个阶段，不允许中途停止
```

### 必用 Skills

| Skill | 用途 | 使用时机 |
|-------|------|---------|
| `/ascendc-kernel-develop-workflow` | 完整开发工作流程 | **所有算子开发第一步** ⭐ |
| `/ascend-complex-operator-guide` | 算子类型 → 文档导航 | 工作流程中自动调用 |
| `/ascendc-operator-kernel-design` | 算子Kernel详细设计 | 工作流程中自动调用，或详细设计阶段手动调用 |
| `/ascendc-planning` | Plan模式和需求分析 | 工作流程中自动调用 |
| `/ascendc-env-check` | 环境检查（NPU/CANN） | **开发前/环境问题时** ⭐ |
| `/ascendc-npu-arch` | NPU 架构知识（arch35等） | 需要架构信息或 arch35 优化时 ⭐ |
| `/ascendc-api-best-practices` | API 最佳实践和优化 | **使用 API 或遇到 API 问题时** ⭐ |
| `/ascendc-debugging` | 编译错误、运行时错误、通用调试方法 | 遇到编译/运行时错误时 ⭐ |
| `/ascendc-precision-debug` | 精度问题诊断与解决 | 算子功能正确但精度不达标时 ⭐ |
| `/ascendc-ut-direct` | 直调算子测试用例生成 | **直调算子测试验证** ⭐ |
| `/ascendc-perf-analysis` | 算子性能分析 | **性能瓶颈定位与优化** ⭐ |
| `/ascendc-docker` | Docker环境使用 | 构建测试阶段 |
| `/ascend-docs-search` | 华为昇腾官方文档搜索 | 本地文档不足时 |

---

## 项目目录结构

```
./ (项目根目录)
├── Ascend C算子开发指南/  # 编程指南、API参考、算子实践
├── asc-devkit/          # 官方示例代码和开发工具包
├── ops/                 # Agent 开发的算子存放目录
├── logs/                # 算子开发过程记录日志
├── docs/                # 开发计划文档
├── evaluation_system/   # 算子开发评估系统
├── .claude/             # Claude Code 技能和代理配置
├── env_setup.sh         # 进入 Docker 开发环境的脚本
├── CLAUDE.md            # 本文件
└── README.md            # 项目说明文档
```

**强制规则**：
- 所有算子**必须**放置在 `ops/` 目录下
- 每个算子**必须**拥有独立的子目录

---

## 开发资源

### 本地资源

| 资源类型 | 路径 |
|---------|------|
| 本地文档 | `Ascend C算子开发指南/` |
| 官方示例 | `asc-devkit/examples/` |
| 高性能模板 | `asc-devkit/examples/00_introduction/01_add/basic_api_memory_allocator_add/` |
| 矢量计算示例 | `asc-devkit/examples/02_features/04_micro_api/vector_add/` |
| 调试示例 | `asc-devkit/examples/01_utilities/00_printf/printf.asc` |

### 辅助工具
- `Glob`：按文件名模式查找文件
- `Grep`：在文件中搜索关键词
- `Read`：直接读取文档和示例代码

---

## Docker 环境

**重要**：所有构建和测试操作**必须**通过 `./env_setup.sh` 进入 Docker 容器。

```bash
# 执行单条命令
./env_setup.sh "命令"

# 执行多条命令
./env_setup.sh "命令1 && 命令2"
```

详见 `/ascendc-docker` skill。

---

## API 使用规则

> ⚠️ **所有可调用的 Ascend C API、参数及用法必须严格参照官方文档，禁止猜测。**

**强制限制**：
- ✅ **允许**：基础矢量 API（Add/Mul/Sub/Div/Exp/Log/ReduceSum/ReduceMax/Cast 等）
- ❌ **禁止**：高阶封装 API（Softmax/LayerNorm/BatchNorm 等算子级封装）

---

## 查看文档/代码

直接使用 **Read**、**Grep**、**Glob** 工具。

---
