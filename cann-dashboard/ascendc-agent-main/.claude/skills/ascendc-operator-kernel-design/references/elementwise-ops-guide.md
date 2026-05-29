# Elementwise 类算子快速参考

---

## 目录

- [API 使用规范](#api-使用规范)
- [核心概念](#核心概念)
- [三阶段流水线](#三阶段流水线)
- [Tiling 与 Buffer](#tiling-与-buffer)
- [常见问题](#常见问题)
- [检查清单](#检查清单)

---

## API 使用规范

### ⛔️ 禁止使用的 API

```cpp
AscendC::Softmax  /  AscendC::LayerNorm  /  AscendC::BatchNorm  // 非 Elementwise
```

### ✅ 推荐使用的 API

```cpp
// 一元算子
AscendC::Exp<T, false>(dst, src, count);
AscendC::Log<T, false>(dst, src, count);
AscendC::Sin<T, false>(dst, src, count);
AscendC::Cos<T, false>(dst, src, count);
AscendC::Floor<T, false>(dst, src, count);
AscendC::Abs(dst, src, count);
AscendC::Sqrt<T>(dst, src, count);
AscendC::Sign<T>(dst, src);              // 注意：Sign 无 count 参数

// 二元算子
AscendC::Add(dst, src0, src1, count);
AscendC::Sub(dst, src0, src1, count);
AscendC::Mul(dst, src0, src1, count);
AscendC::Div(dst, src0, src1, count);

// 标量混合
AscendC::Adds(dst, src, scalar, count);
AscendC::Muls(dst, src, scalar, count);

// 类型转换
AscendC::Cast(dst, src, AscendC::RoundMode::CAST_ROUND, count);
```

### 子类型分类

| 子类型 | 公式 | 典型算子 |
|--------|------|---------|
| **一元** | Y[i] = f(X[i]) | Exp, Log, Sin, Cos, Floor, Abs, Sqrt, Cast |
| **二元** | Z[i] = f(X[i], Y[i]) | Add, Sub, Mul, Div, Max, Min |
| **三元** | W[i] = f(X[i], Y[i], Z[i]) | Clamp(tensor, min, max) |
| **标量混合** | Y[i] = f(X[i], scalar) | Adds, Muls |

---

## 核心概念

**核心特征**：无跨元素依赖 → 天然适合并行，输入输出 Shape 完全一致。

### 类型转换 RoundMode

| 转换方向 | RoundMode | 说明 |
|---------|-----------|------|
| FP32 → FP16 | `CAST_ROUND` | 精度损失需四舍五入 |
| FP16 → FP32 | `CAST_NONE` | 无损 |
| FP → INT | `CAST_ROUND` / `CAST_CEIL` / `CAST_FLOOR` | 按需选择 |
| INT → FP | `CAST_NONE` | 无损 |

### 32 字节对齐

```cpp
uint32_t oneBlockNum = 32 / sizeof(T);  // FP32: 8, FP16: 16, INT8: 32
uint32_t alignedLen = (count + oneBlockNum - 1) / oneBlockNum * oneBlockNum;
```

---

## 三阶段流水线

所有 Elementwise 算子遵循：**CopyIn → Compute → CopyOut**

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  CopyIn  │ → │ Compute  │ → │ CopyOut  │
│  (MTE2)  │    │ (Vector) │    │  (MTE3)  │
└──────────┘    └──────────┘    └──────────┘
  GM → UB         UB → UB          UB → GM
```

### 关键代码片段

```cpp
// CopyIn
AscendC::LocalTensor<T> xLocal = inQueueX.AllocTensor<T>();
AscendC::DataCopy(xLocal, xGm[progress * tileLength], tileLength);
inQueueX.EnQue(xLocal);

// Compute（一元示例）
AscendC::LocalTensor<T> xLocal = inQueueX.DeQue<T>();
AscendC::LocalTensor<T> yLocal = outQueue.AllocTensor<T>();
AscendC::Exp<T, false>(yLocal, xLocal, tileLength);  // 替换为实际 API
outQueue.EnQue(yLocal);
inQueueX.FreeTensor(xLocal);

// CopyOut
AscendC::LocalTensor<T> yLocal = outQueue.DeQue<T>();
AscendC::DataCopy(yGm[progress * tileLength], yLocal, tileLength);
outQueue.FreeTensor(yLocal);
```

---

## Tiling 与 Buffer

### 多核切分

```cpp
uint32_t blockLength = totalLength / AscendC::GetBlockNum();
uint32_t offset = blockLength * AscendC::GetBlockIdx();
xGm.SetGlobalBuffer((__gm__ T*)x + offset, blockLength);
```

### UB 分片公式

```cpp
constexpr uint32_t BUFFER_NUM = 2;  // 双缓冲
uint32_t tileLength = blockLength / tileNum / BUFFER_NUM;
uint32_t loopCount = tileNum * BUFFER_NUM;
```

### Buffer 模式选择

| 模式 | 适用场景 | Queue 深度 |
|------|---------|-----------|
| **TQue（推荐）** | 大多数场景 | BUFFER_NUM=2 自动双缓冲 |
| **LocalMemAllocator** | 手动精细控制 | 手动 Ping/Pong 切换 |

### UB 内存用量

| 类型 | 一元算子 | 二元算子 |
|------|---------|---------|
| 计算公式 | 2 × BUFFER_NUM × tileLength × sizeof(T) | 3 × BUFFER_NUM × tileLength × sizeof(T) |
| 示例(FP32, BUFFER_NUM=2) | 4 × tileLength × 4 | 6 × tileLength × 4 |

### 数据量阈值参考

| 场景 | 策略 |
|------|------|
| totalLength < 8K | 单核、单 Tile、BUFFER_NUM=1 |
| 8K ≤ totalLength < 64K | 多核、单 Tile、BUFFER_NUM=2 |
| totalLength ≥ 64K | 多核、多 Tile、BUFFER_NUM=2 |

---

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 结果全 0 | Buffer 未正确 EnQue/DeQue | 检查 AllocTensor → EnQue → DeQue → FreeTensor 配对 |
| UB 越界崩溃 | tileLength 计算过大 | 检查 `tileLength * sizeof(T) * BUFFER_NUM * numQueues ≤ UB容量` |
| 结果部分错误 | 尾 tile 未处理 | 处理 `lastTileLength = blockLength - tileLength * (loopCount - 1)` |
| 带宽利用率低 | 单缓冲 | 使用 BUFFER_NUM=2 |
| Sign API 编译错误 | Sign 无 count 参数 | 使用 `Sign<T>(dst, src)` 而非 `Sign<T>(dst, src, count)` |
| 精度不达标 | FP16 累积误差 | 混合精度：Cast 到 FP32 计算后 Cast 回 |

---

## 检查清单

### 设计阶段

- [ ] 确定一元/二元/三元/标量混合类型
- [ ] 确定多核切分策略（blockLength 动态计算）
- [ ] 确定 UB 分片策略（tileNum, BUFFER_NUM）
- [ ] 确认所需 API 和参数

### 实现阶段

- [ ] 使用 `GetBlockNum()` / `GetBlockIdx()` 动态获取硬件参数
- [ ] Buffer 大小使用对齐后的值
- [ ] AllocTensor / EnQue / DeQue / FreeTensor 严格配对
- [ ] DataCopy 长度使用 tileLength
- [ ] 处理尾核/尾 tile 数据不足场景

### 测试阶段

- [ ] 小数据验证（8 元素）
- [ ] 大数据验证（> 1M 元素）
- [ ] 非对齐长度测试（如 997、1023）
- [ ] FP16/FP32/INT8 多类型覆盖
- [ ] 精度对比（相对误差 + 绝对误差）

---

## 快速链接

- **示例文件**:
  - [Add (TQue)](../../../asc-devkit/examples/00_introduction/01_add/basic_api_tque_add/)
  - [Add (LocalMemAllocator)](../../../asc-devkit/examples/00_introduction/01_add/basic_api_memory_allocator_add/)
  - [Add (DoubleBuffer)](../../../asc-devkit/examples/04_best_practices/00_add_doublebuffer/)
  - [Exp](../../../asc-devkit/examples/03_libraries/00_math/exp/)
  - [Cast](../../../asc-devkit/examples/03_libraries/00_math/cast/)
  - [Clamp](../../../asc-devkit/examples/03_libraries/00_math/clamp/)
- **相关参考**:
  - [API 最佳实践](../../ascendc-api-best-practices/references/api-arithmetic.md)
