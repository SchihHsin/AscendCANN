---
name: ascendc-operator-kernel-design
description: Ascend C 算子设计知识库。提供算子分类体系、通用设计要素（多核切分、UB切分、Buffer规划、分支覆盖）和各类别详细设计指南。触发：需要查阅算子设计方法或分类特征时。
---

# Ascend C 算子 Kernel 详细设计指南

## 算子分类体系

| 类别 | 特征 | 典型算子 | 设计指南 |
|------|------|---------|---------|
| Reduction 归约类 | 沿轴归约，输出维度减少 | ReduceSum, ReduceMax, ReduceMin | ✅ [快速参考](references/reduction-ops-guide.md) / [完整方法论](references/reduction-ops-methodology.md) |
| Elementwise 逐元素类 | 输入输出Shape相同，逐元素独立计算 | Exp, Sin, Cos, Abs, Add, Mul | ✅ [快速参考](references/elementwise-ops-guide.md) |
| Broadcast 广播类 | 输入Shape不同，需广播对齐 | Add(不同Shape), Mul(不同Shape) | ✅ [快速参考](references/broadcast-ops-guide.md) |
| Conversion 数据转换类 | 改变布局/形状，合并/拆分张量 | Transpose, Concat, Split, Pad | ✅ [快速参考](references/conversion-ops-guide.md) |
| Activation 激活类 | 非线性变换，含全局聚合或逐元素 | Softmax, Gelu, Sigmoid, SiLU | ✅ [快速参考](references/activation-ops-guide.md) |
| Normalization 归一化类 | 全局统计量计算+归一化，多Pass遍历 | LayerNorm, BatchNorm, RMSNorm | ✅ [快速参考](references/normalization-ops-guide.md) |
| MatMul 矩阵乘类 | 矩阵乘法，高计算密度，用Cube单元 | MatMul, BatchMatMul | ✅ [快速参考](references/matmul-ops-guide.md) |
| Random 随机类 | 生成随机数，需种子管理 | RandomUniform, Dropout | 📋 规划中 |
| Advanced 高级算法类 | 复杂算法，可能需要多Pass/Workspace | Sort, TopK, Unique | 📋 规划中 |
| Convolution 卷积类 | 空间卷积，滑动窗口计算 | Conv2D, DepthwiseConv | 📋 规划中 |

---

## 使用场景

本技能是**知识库型技能**，提供设计参考，不定义开发流程。

**典型使用方式**：
1. `ascendc-kernel-develop-workflow` 在设计阶段（阶段二）调用本技能
2. 开发者查阅算子分类和通用设计要素
3. 根据算子类别查阅对应的详细设计指南（references 文件）

**相关技能**：
- `ascendc-kernel-develop-workflow` - 完整开发流程和准出条件

---

## 通用设计要素（所有类别必须）

以下设计要素是所有算子类别都必须考虑和完成的：

### 1. 多核切分策略

**核心问题**：任务如何分配给多个 AI Core？

**设计要点**：
- 负载均衡：每个核处理的任务量尽量相等
- 数据局部性：相邻数据尽量分配给同一核
- 粒度适中：tile 不能太小（调度开销大），不能太大（并行度低）

**输出**：
- [ ] 总任务切分方式（按哪个维度切）
- [ ] 每个 AI Core 处理的任务量
- [ ] 使用的 AI Core 数量

### 2. UB 切分策略

**核心问题**：单次能处理多少数据？

**设计要点**：
- UB 容量限制（A2/A3: 192KB, A5: 248KB）
- 单次处理数据量
- 是否需要分 chunk 处理

**输出**：
- [ ] 单次处理的数据量
- [ ] 是否需要分 chunk
- [ ] chunk 大小计算公式

### 3. Buffer 规划

**核心问题**：需要哪些 buffer？各多大？

**设计要点**：
- 输入 buffer（inQueue）
- 输出 buffer（outQueue）
- 中间计算 buffer（tmpBuf, workBuf 等）
- Double Buffer 优化

**输出**：
- [ ] Buffer 列表及用途
- [ ] 各 Buffer 大小计算公式
- [ ] 总 UB 使用量

### 4. 分支场景覆盖

**核心问题**：需要处理哪些不同场景？

**常见分支维度**：
- 数据类型：FP32 / FP16 / BF16 / INT8
- Shape 大小：大 shape / 小 shape
- 数据对齐：32字节对齐 / 非对齐
- 边界情况：最小值 / 最大值 / 特殊值

**输出**：
- [ ] 分支决策条件
- [ ] 各分支的处理策略
- [ ] 边界测试用例
