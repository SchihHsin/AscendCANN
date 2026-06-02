# Normalization 类算子快速参考

---

## 目录

- [API 使用规范](#api-使用规范)
- [核心概念](#核心概念)
- [多 Pass 计算流程](#多-pass-计算流程)
- [Tiling 与 Buffer](#tiling-与-buffer)
- [常见问题](#常见问题)
- [检查清单](#检查清单)

---

## API 使用规范

### ⛔️ 禁止使用的 API

```cpp
AscendC::LayerNorm  /  AscendC::BatchNorm  /  AscendC::GroupNorm  // 高阶封装
```

### ✅ 推荐使用的 API

```cpp
// 统计量计算
AscendC::ReduceSum<T>(dst, src, tmp, count);
AscendC::Muls(dst, src, (T)(1.0f / N), count);  // 求均值

// 归一化计算
AscendC::Sub(centered, x, mean, count);           // x - mean
AscendC::Mul(squared, centered, centered, count);  // (x - mean)²
AscendC::Muls(normed, centered, (T)rstd, count);  // (x - mean) * rstd

// Scale + Shift
AscendC::Mul(dst, normed, gamma, count);           // × gamma
AscendC::Add(dst, dst, beta, count);               // + beta

// 类型转换（FP16 输入必须用 FP32 计算统计量）
AscendC::Cast(fp32Buf, fp16Buf, AscendC::RoundMode::CAST_NONE, count);
AscendC::Cast(fp16Buf, fp32Buf, AscendC::RoundMode::CAST_ROUND, count);
```

---

## 核心概念

### 算子分类

| 算子 | 归一化维度 | 统计量范围 | 可学习参数 | Pass 数 |
|------|-----------|-----------|-----------|---------|
| **LayerNorm** | 最后 N 维（H） | 每个样本独立 | gamma[H], beta[H] | 2~3 |
| **RMSNorm** | 最后 N 维（H） | 每个样本独立 | gamma[H]（无 beta） | 2 |
| **BatchNorm** | Batch 维（B） | 跨 Batch 共享 | gamma[C], beta[C] | 2~3 |
| **GroupNorm** | Group 维 | 组内统计 | gamma[C], beta[C] | 2~3 |

### 3D 抽象

```
X[B, S, H] → 抽象为 (A1, R)
  A1 = B × S  （独立的归一化单元数）
  R  = H      （每个单元的归一化维度）

多核切分: A1 个独立任务 → 分配到 N 个核
每核处理: A1/N 行，每行 H 个元素
```

### 数学公式

```
LayerNorm:  Y = (X - mean) / sqrt(var + eps) × gamma + beta
RMSNorm:    Y = X / sqrt(mean(X²) + eps) × gamma      (无 mean 减法，无 beta)
```

### 混合精度策略

| 输入类型 | 计算类型 | 说明 |
|---------|---------|------|
| FP16 | FP32 | 统计量计算**必须**用 FP32 |
| BF16 | FP32 | 统计量计算**必须**用 FP32 |
| FP32 | FP32 | 直接计算 |

---

## 多 Pass 计算流程

### ❌ 错误方式：分段独立处理

```
segment0 = normalize(x[0:4095])    // 仅用局部统计量 → 错误！
segment1 = normalize(x[4096:8191]) // 仅用局部统计量 → 每段 mean/var 不同
```

### ✅ 正确方式：多 Pass 遍历

```
LayerNorm (2~3 Pass):
  Pass 1: 遍历所有数据 → sum, sumSquares → mean, var, rstd
  Pass 2: 遍历所有数据 → 归一化 + Scale + Shift

RMSNorm (2 Pass):
  Pass 1: ReduceSum(X²) / N + eps → Rsqrt → rstd
  Pass 2: Y = X × rstd × gamma
```

### LayerNorm Compute 示例（Full-Load 模式）

```cpp
__aicore__ inline void Compute(int32_t rowIdx) {
    auto xLocal = inQueue.DeQue<T>();
    auto yLocal = outQueue.AllocTensor<T>();

    // 1. mean = sum(x) / H
    AscendC::ReduceSum<T>(sumLocal, xLocal, tmpReduce, H);
    float mean = sumLocal.GetValue(0) / H;

    // 2. centered = x - mean → variance
    AscendC::Adds(yLocal, xLocal, (T)(-mean), H);
    AscendC::Mul(tmpBuf, yLocal, yLocal, H);
    AscendC::ReduceSum<T>(varLocal, tmpBuf, tmpReduce, H);
    float rstd = 1.0f / sqrtf(varLocal.GetValue(0) / H + eps);

    // 3. 归一化 + Scale + Shift
    AscendC::Muls(yLocal, yLocal, (T)rstd, H);
    AscendC::Mul(yLocal, yLocal, gammaLocal, H);
    AscendC::Add(yLocal, yLocal, betaLocal, H);

    outQueue.EnQue(yLocal);
    inQueue.FreeTensor(xLocal);
}
```

---

## Tiling 与 Buffer

### UB 分片策略

**场景 1：H 能全载入 UB（Full-Load）**
```
条件: H × sizeof(T) × bufferCount ≤ UB 容量
策略: 每次加载完整一行，直接计算
```

**场景 2：H 太大需分片（Split）**
```
条件: H × sizeof(T) × bufferCount > UB 容量
策略: 多 Pass 分片遍历 H → 累加统计量 → 再次遍历归一化
```

### Buffer 布局

```
┌──────────────────┐
│ inQueue (VECIN)  │ H 元素 × BUFFER_NUM
├──────────────────┤
│ outQueue (VECOUT)│ H 元素 × BUFFER_NUM
├──────────────────┤
│ gammaLocal       │ H 元素（预加载）
├──────────────────┤
│ betaLocal        │ H 元素（预加载）
├──────────────────┤
│ tmpBuf           │ H 元素 + ReduceSum 临时
└──────────────────┘

UB 估算:
  Full-Load ≈ (2 × BUFFER_NUM + 2 + 2) × H × sizeof(T) + tmpReduceSize
            ≈ 8 × H × sizeof(T)  (BUFFER_NUM=2)
```

### gamma/beta 加载策略

| 场景 | 策略 | 说明 |
|------|------|------|
| H 较小 | 预加载到 UB | Init 阶段一次加载，所有行共用 |
| H 太大 | 分段加载 | 每个 chunk 加载对应段的 gamma/beta |

---

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 均值计算偏差 | 分段独立计算而非全局 | 使用多 Pass：先全局 sum → mean |
| FP16 精度差 | 中间统计量精度不足 | Cast 到 FP32 计算 mean/var |
| 输出尺度异常 | gamma/beta 未正确广播 | 确认 gamma 的维度和对齐 |
| UB 越界 | 未计入 gamma/beta/tmpReduce 空间 | Buffer 总量包含所有中间 Tensor |
| variance 为负 | 数值精度导致 sumSq/N - mean² < 0 | 加 `max(var, 0)` 保护 |
| BatchNorm 结果不对 | running mean/var 更新错误 | 区分训练和推理模式 |

---

## 检查清单

### 设计阶段

- [ ] 确定归一化类型（LayerNorm / RMSNorm / BatchNorm / GroupNorm）
- [ ] 确定 3D 抽象和多核切分策略
- [ ] 判断 Full-Load 还是 Split 模式
- [ ] 计算 UB 总用量（输入 + 输出 + gamma + beta + tmpBuf）
- [ ] 确定混合精度策略（FP16 输入 → FP32 统计量）

### 实现阶段

- [ ] 多 Pass 全局统计量计算正确
- [ ] epsilon 参数传递正确
- [ ] gamma/beta 广播和加载策略正确
- [ ] Cast + RoundMode 转换正确
- [ ] ReduceSum 的 tmpBuf 类型匹配

### 测试阶段

- [ ] 小 H 测试（H=8, 16, 64）
- [ ] 大 H 测试（H > UB 容量阈值）
- [ ] 非对齐 H 测试
- [ ] FP16/FP32 精度对比（FP32: <1e-5, FP16: <1e-3）
- [ ] 与 PyTorch nn.LayerNorm / nn.BatchNorm 对比

---

## 快速链接

- **示例文件**:
  - [LayerNorm](../../../asc-devkit/examples/03_libraries/03_normalization/layernorm/)
  - [LayerNorm V2](../../../asc-devkit/examples/03_libraries/03_normalization/layernorm_v2/)
  - [BatchNorm](../../../asc-devkit/examples/03_libraries/03_normalization/batchnorm/)
  - [GroupNorm](../../../asc-devkit/examples/03_libraries/03_normalization/groupnorm/)
  - [RMSNorm](../../../asc-devkit/examples/03_libraries/03_normalization/rmsnorm/)
  - [DeepNorm](../../../asc-devkit/examples/03_libraries/03_normalization/deepnorm/)
- **相关参考**:
  - [Elementwise 设计指南](elementwise-ops-guide.md)
  - [API 最佳实践](../../ascendc-api-best-practices/references/api-arithmetic.md)
