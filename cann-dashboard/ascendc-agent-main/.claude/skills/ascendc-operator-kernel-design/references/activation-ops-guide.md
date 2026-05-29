# Activation 类算子快速参考

---

## 目录

- [API 使用规范](#api-使用规范)
- [核心概念](#核心概念)
- [Softmax 计算流程](#softmax-计算流程)
- [Tiling 与 Buffer](#tiling-与-buffer)
- [常见问题](#常见问题)
- [检查清单](#检查清单)

---

## API 使用规范

### ⛔️ 禁止使用的 API

```cpp
AscendC::Softmax  // 高阶封装，禁止使用
```

### ✅ 推荐使用的 API

```cpp
// 基础数学
AscendC::Exp<T, false>(dst, src, count);
AscendC::Reciprocal<T>(dst, src, count);
AscendC::Muls(dst, src, scalar, count);
AscendC::Adds(dst, src, scalar, count);
AscendC::Mul(dst, src0, src1, count);

// 归约
AscendC::ReduceMax<T>(dst, src, tmp, count);
AscendC::ReduceSum<T>(dst, src, tmp, count);
AscendC::ReduceMax<T, AscendC::Pattern::Reduce::AR>(dst, src, tmp, shape, isInit);
AscendC::ReduceSum<T, AscendC::Pattern::Reduce::AR>(dst, src, tmp, shape, isInit);

// 激活（低级）
AscendC::Relu<T>(dst, src, count);
AscendC::LeakyRelu<T>(dst, src, alpha, count);
```

---

## 核心概念

### 算子分类

| 类型 | 特征 | 典型算子 | 复杂度 |
|------|------|---------|--------|
| **全局聚合型** | 需全局 max/sum → 多 Pass | Softmax | ★★★★ |
| **逐元素型** | 每个元素独立计算 | Gelu, Sigmoid, SiLU, Tanh, ReLU | ★★ |
| **门控型** | 输入拆分 + 激活 + 门控 | GeGLU, ReGLU, SwiGLU | ★★★ |

### 数学公式速查

| 算子 | 公式 |
|------|------|
| **Softmax** | exp(x - max) / Σ exp(x - max) |
| **Sigmoid** | 1 / (1 + exp(-x)) |
| **SiLU (Swish)** | x × sigmoid(x) |
| **Gelu** | 0.5x(1 + tanh(√(2/π)(x + 0.044715x³))) |
| **ReLU** | max(0, x) |
| **SwiGLU** | SiLU(x₁) × x₂，输入 2H → 输出 H |

### 设计模式区分

```
逐元素型: 标准三阶段流水线（CopyIn → Compute → CopyOut），同 Elementwise
门控型:   输入 X[B,S,2H] → 拆分 x1/x2 → activation(x1) × x2 → Y[B,S,H]
全局聚合型: 多 Pass 遍历（类似 Normalization），行级独立处理
```

### 手动实现常用激活

```cpp
// Sigmoid: y = 1 / (1 + exp(-x))
AscendC::Muls(tmp, x, (T)(-1.0f), count);
AscendC::Exp<T, false>(tmp, tmp, count);
AscendC::Adds(tmp, tmp, (T)(1.0f), count);
AscendC::Reciprocal<T>(y, tmp, count);

// SiLU: y = x * sigmoid(x)
// 先计算 sigmoid(x) → tmp，再 Mul(y, x, tmp)
AscendC::Mul(y, x, sigmoidResult, count);
```

---

## Softmax 计算流程

### 为什么需要全局聚合

```
❌ 分段处理: softmax(x[0:4095]) + softmax(x[4096:8191]) → 每段概率和=1，总和=2
✅ 全局处理: 先求全局 max/sum，再统一归一化 → 总概率和=1
```

### 三 Pass 流程

```
Pass 1: globalMax = max(所有数据)
Pass 2: globalSum = Σ exp(x[i] - globalMax)
Pass 3: output[i] = exp(x[i] - globalMax) / globalSum
```

### Compute 实现要点

```cpp
__aicore__ inline void Compute(int32_t tileIdx, uint32_t rowNum) {
    auto xLocal = inQueue.DeQue<T>();
    auto yLocal = outQueue.AllocTensor<T>();
    uint32_t srcShape[] = {rowNum, alignedCols};

    // Pass 1: 每行求 Max
    AscendC::ReduceMax<T, AscendC::Pattern::Reduce::AR>(
        maxLocal, xLocal, tmpLocal, srcShape, true);

    // Pass 2: exp(x - max) 并求 Sum
    for (uint32_t r = 0; r < rowNum; r++) {
        AscendC::Adds(yLocal[r * alignedCols],
                      xLocal[r * alignedCols],
                      -maxLocal.GetValue(r), colLength);
    }
    AscendC::Exp<T, false>(yLocal, yLocal, rowNum * alignedCols);
    AscendC::ReduceSum<T, AscendC::Pattern::Reduce::AR>(
        sumLocal, yLocal, tmpLocal, srcShape, true);

    // Pass 3: 除以 Sum
    for (uint32_t r = 0; r < rowNum; r++) {
        T invSum = (T)(1.0f / (float)sumLocal.GetValue(r));
        AscendC::Muls(yLocal[r * alignedCols],
                      yLocal[r * alignedCols], invSum, colLength);
    }

    outQueue.EnQue(yLocal);
    inQueue.FreeTensor(xLocal);
}
```

---

## Tiling 与 Buffer

### Softmax 行级分片

```
多核切分: 按行分配，行间无依赖
行内分片: 根据列数动态调整 rowsPerLoop

列数阈值表:
  colLength >= 8192 → 每次 1 行
  colLength >= 4096 → 每次 2 行
  colLength >= 2048 → 每次 4 行
  colLength >= 1024 → 每次 8 行
  colLength >= 512  → 每次 16 行
  colLength < 256   → 每次 64 行
```

### Buffer 布局

```
Softmax:
┌──────────────────┐
│ inQueue (VECIN)  │ rowsPerLoop × colLength 元素
├──────────────────┤
│ outQueue (VECOUT)│ rowsPerLoop × colLength 元素
├──────────────────┤
│ maxBuf / sumBuf  │ rowsPerLoop × 8 (32B 对齐标量)
├──────────────────┤
│ tmpBuf           │ ReduceMax/ReduceSum 临时
└──────────────────┘

门控算子 (SwiGLU 等):
┌──────────────────┐
│ inQueue          │ 2H 元素（完整输入行）
├──────────────────┤
│ x1Local/x2Local  │ 各 H 元素（拆分）
├──────────────────┤
│ actLocal         │ H 元素（激活结果）
├──────────────────┤
│ outQueue         │ H 元素（门控输出）
└──────────────────┘
```

---

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| Softmax 概率和 ≠ 1 | 分段独立计算 | 必须全局 max/sum |
| Softmax exp 溢出 | 未减去 max | 始终用 exp(x - max) |
| Gelu 精度差 | 使用低精度模式 | `Gelu<T, true>` 开启高精度 |
| 门控算子 Shape 错误 | 未正确拆分输入 | 输入 2H，输出 H |
| 归约 tmpBuf 类型不匹配 | ReduceSum<float> 的 tmp 必须是 float | 确保类型一致 |
| Sigmoid 结果全 1 | 输入数据为大正数 | 检查输入数据范围 |

---

## 检查清单

### Softmax 专用

- [ ] 使用 exp(x - max) 而非 exp(x)
- [ ] max 和 sum 是全局值（非分段）
- [ ] 行级独立处理，行间无依赖
- [ ] 根据列数动态调整 rowsPerLoop
- [ ] 混合精度：FP16 输入时 sum 用 FP32 累加

### 逐元素激活

- [ ] 遵循 Elementwise 模板（CopyIn → Compute → CopyOut）
- [ ] 确认 API 参数（精度标志、count 参数）
- [ ] 32 字节对齐处理

### 门控激活

- [ ] 输入为 2H，输出为 H
- [ ] 正确拆分 x1 和 x2
- [ ] 激活函数与门控乘法顺序正确

---

## 快速链接

- **示例文件**:
  - [Softmax](../../../asc-devkit/examples/03_libraries/02_activation/softmax/)
  - [SoftmaxFlash V2](../../../asc-devkit/examples/03_libraries/02_activation/softmaxflashv2/)
  - [Gelu](../../../asc-devkit/examples/03_libraries/02_activation/gelu/)
  - [Sigmoid](../../../asc-devkit/examples/03_libraries/02_activation/sigmoid/)
  - [SiLU](../../../asc-devkit/examples/03_libraries/02_activation/silu/)
  - [GeGLU](../../../asc-devkit/examples/03_libraries/02_activation/geglu/)
  - [SwiGLU](../../../asc-devkit/examples/03_libraries/02_activation/swiglu/)
- **相关参考**:
  - [Elementwise 设计指南](elementwise-ops-guide.md)
  - [Normalization 设计指南](normalization-ops-guide.md)
  - [API 最佳实践](../../ascendc-api-best-practices/references/api-arithmetic.md)
