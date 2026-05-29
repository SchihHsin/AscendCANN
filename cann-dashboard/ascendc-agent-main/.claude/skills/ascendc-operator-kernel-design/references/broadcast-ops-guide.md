# Broadcast 类算子快速参考

---

## 目录

- [API 使用规范](#api-使用规范)
- [核心概念](#核心概念)
- [计算流程](#计算流程)
- [Tiling 与 Buffer](#tiling-与-buffer)
- [常见问题](#常见问题)
- [检查清单](#检查清单)

---

## API 使用规范

### ✅ Broadcast API

```cpp
template <typename T, int32_t dim, int32_t axis, bool isReuseSource = false>
__aicore__ inline void AscendC::Broadcast(
    const LocalTensor<T>& dst,
    const LocalTensor<T>& src,
    const uint32_t dstShape[dim],
    const uint32_t srcShape[dim],
    LocalTensor<uint8_t>& tmpBuf  // 可选
);
```

### 使用示例

```cpp
// 列广播: (M, 1) → (M, K)
uint32_t dstShape[] = {M, K};
uint32_t srcShape[] = {M, 1};
AscendC::Broadcast<T, 2, 1>(broadcastResult, srcLocal, dstShape, srcShape);

// 行广播: (1, K) → (M, K)
uint32_t dstShape[] = {M, K};
uint32_t srcShape[] = {1, K};
AscendC::Broadcast<T, 2, 0>(broadcastResult, srcLocal, dstShape, srcShape);
```

### 支持数据类型

`int8_t`, `uint8_t`, `half`, `float`, `bfloat16_t`

---

## 核心概念

### 与 Elementwise 的区别

```
Elementwise: X[B,S,H] + Y[B,S,H] → Z[B,S,H]   (Shape 完全相同)
Broadcast:   X[B,S,H] + Y[1,1,H] → Z[B,S,H]   (Y 需要广播)
```

### 支持的广播维度

当前 `AscendC::Broadcast` API 支持 **1D 或 2D** 张量：

| 维度 | Axis | 源 Shape | 目标 Shape | 说明 |
|------|------|---------|-----------|------|
| 1D | 0 | (1,) | (N,) | 标量广播到向量 |
| 2D | 0 | (1, K) | (M, K) | 行广播 |
| 2D | 1 | (M, 1) | (M, K) | 列广播 |

### 对齐约束

| Axis | 对齐要求 |
|------|---------|
| Axis 0 | `srcShape[1]` 必须 32 字节对齐 |
| Axis 1 | `srcShape[0]` 必须 32 字节对齐 |

### 广播系数

```cpp
uint32_t coef = longerLen / shorterLen;  // 广播倍数
```

### 按轴区分设计

| 广播轴 | 切分维度 | 较短输入处理 | 复杂度 |
|--------|---------|-------------|--------|
| Axis 0 | 按 M 切分 | 全部核共享 Y | ★★ |
| Axis 1 | 按 M×K 切分 | Y 也按核切分 | ★★★ |

---

## 计算流程

### 标准流程：先广播后计算

```cpp
__aicore__ inline void Compute(int32_t progress) {
    auto xLocal = inQueueX.DeQue<T>();
    auto yLocal = inQueueY.DeQue<T>();
    auto zLocal = outQueueZ.AllocTensor<T>();
    auto broadcastTmp = tmpBuf.Get<T>();

    // Step 1: 广播较小的输入
    uint32_t dstShape[] = {tileLength / coef, coef};
    uint32_t srcShape[] = {tileLength / coef, 1};
    AscendC::Broadcast<T, 2, 1>(broadcastTmp, yLocal, dstShape, srcShape);

    // Step 2: 执行计算
    AscendC::Add(zLocal, xLocal, broadcastTmp, tileLength);

    outQueueZ.EnQue(zLocal);
    inQueueX.FreeTensor(xLocal);
    inQueueY.FreeTensor(yLocal);
}
```

### DataCopy 策略

```cpp
// X 正常拷贝
AscendC::DataCopyPad<T>(xLocal, xGm[progress * tileLength], copyXParams);

// Y 按 coef 缩小拷贝（axis=1 场景）
uint32_t yOffset = progress * tileLength / coef;
AscendC::DataCopyPad<T>(yLocal, yGm[yOffset], copyYParams);
```

---

## Tiling 与 Buffer

### UB 布局（Axis 1 列广播）

```
┌──────────────────┐
│ inQueueX         │ tileLength 元素
├──────────────────┤
│ inQueueY         │ tileLength/coef 元素（小得多）
├──────────────────┤
│ tmpBuf           │ tileLength 元素（广播结果，深度 1）
├──────────────────┤
│ outQueueZ        │ tileLength 元素
└──────────────────┘
```

### Buffer 初始化

```cpp
pipe->InitBuffer(inQueueX, BUFFER_NUM, tileLength * sizeof(T));
pipe->InitBuffer(outQueueZ, BUFFER_NUM, tileLength * sizeof(T));
pipe->InitBuffer(inQueueY, BUFFER_NUM, (tileLength / coef) * sizeof(T));  // axis=1
pipe->InitBuffer(tmpBuf, tileLength * sizeof(T));  // 广播临时，不需要双缓冲
```

### 均匀 vs 非均匀分核

```cpp
if (divDimCoef % blockDim == 0) {
    // 均匀分配：所有核同样的 tileNum, tileLength
    uint32_t blockLength = divDimCoef / blockDim * alignCoef;
} else {
    // 非均匀分配：前部核多分一份
    uint32_t formerNum  = divDimCoef % blockDim;
    uint32_t tailNum    = blockDim - formerNum;
    uint32_t formerLength = (divDimCoef / blockDim + 1) * alignCoef;
    uint32_t tailLength   = (divDimCoef / blockDim) * alignCoef;
}
```

---

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 广播结果部分错误 | srcShape 对齐不符合要求 | Axis 0 时 srcShape[1] 须 32B 对齐 |
| UB 越界 | 未考虑广播临时 Buffer | 加上 `tileLength * sizeof(T)` 的 tmpBuf |
| Y 数据加载错误 | Axis 1 时 Y 偏移未除以 coef | `yOffset = progress * tileLength / coef` |
| 非均匀核结果不对 | Former/tail 核使用相同 tileLength | 区分 formerTileLength 和 tailTileLength |
| 编译错误 | Broadcast dim/axis 模板参数不匹配 | dim 和 axis 必须是编译期常量 |

---

## 检查清单

### 设计阶段

- [ ] 确定广播轴（0 或 1）和广播系数 (coef)
- [ ] 确定哪个输入较短
- [ ] 设计均匀/非均匀多核分配策略
- [ ] 计算 UB 总用量（包含广播临时 Buffer）
- [ ] 确认源 Shape 满足对齐约束

### 实现阶段

- [ ] 使用 `DataCopyPad` 而非 `DataCopy`
- [ ] 较短输入的 Buffer 大小正确（= tileLength / coef）
- [ ] 广播 API 的 dstShape/srcShape 参数正确
- [ ] 较短输入的 GM 偏移计算正确
- [ ] tmpBuf 不需要双缓冲（深度 1 即可）

### 测试阶段

- [ ] 对称广播测试（两个输入都需要广播）
- [ ] 单维广播测试（仅一个输入需要广播）
- [ ] 非对齐数据测试
- [ ] 大/小 coef 测试
- [ ] 精度验证

---

## 快速链接

- **示例文件**:
  - [独立 Broadcast](../../../asc-devkit/examples/00_introduction/04_simple_operator/broadcast/)
  - [Add + Broadcast](../../../asc-devkit/examples/00_introduction/04_simple_operator/add_broadcast/)
  - [Broadcast (转置库)](../../../asc-devkit/examples/03_libraries/09_transpose/broadcast/)
- **相关参考**:
  - [Elementwise 设计指南](elementwise-ops-guide.md)
  - [API 最佳实践](../../ascendc-api-best-practices/references/api-arithmetic.md)
