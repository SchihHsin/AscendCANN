# Reduce API 使用指南

逐行 Reduce 与跨行 Reduce 的 API 选择与使用规范。

---

## 目录

1. [接口选择](#接口选择)
2. [Level 2 接口（逐行处理）](#level-2-接口逐行处理)
3. [Pattern 接口（跨行批量）](#pattern-接口跨行批量)
4. [常见错误](#常见错误)
5. [最佳实践](#最佳实践)

---

## 接口选择

| 场景 | 接口 | 参数 | 对齐要求 | 典型用途 |
|-----|------|------|----------|---------|
| 逐行独立处理 | Level 2 | `(dst, src, tmp, count)` | **无** | Softmax, LayerNorm |
| 跨行批量处理 | Pattern | `(dst, src, tmp, shape, isInit)` | 32 字节 | ReduceSum axis=-1 |

**选择原则**：
- 逐行独立计算 → **Level 2 接口**（更简单，无对齐要求）
- 需要跨行 Reduce → **Pattern 接口**（性能更高）

---

## Level 2 接口（逐行处理）

### ReduceMax

```cpp
AscendC::ReduceMax<T>(
    dst,          // 输出 LocalTensor（1 个元素）
    src,          // 输入 LocalTensor（count 个元素）
    tmpBuffer,    // 临时 buffer（LocalTensor<T>）
    count,        // 元素个数（int32_t）
    calIndex      // 是否计算索引（bool，默认 false）
);
```

### ReduceSum

```cpp
AscendC::ReduceSum<T, isSetMask=true>(
    dst,          // 输出 LocalTensor（1 个元素）
    src,          // 输入 LocalTensor（count 个元素）
    tmpBuffer,    // 临时 buffer（LocalTensor<T>）
    count         // 元素个数（int32_t）
);
```

### ReduceMin

```cpp
AscendC::ReduceMin<T>(
    dst,          // 输出 LocalTensor（1 个元素）
    src,          // 输入 LocalTensor（count 个元素）
    tmpBuffer,    // 临时 buffer（LocalTensor<T>）
    count,        // 元素个数（int32_t）
    calIndex      // 是否计算索引（bool，默认 false）
);
```

### tmpBuffer 类型要求（关键！）

**tmpBuffer 类型必须与 dst/src 相同**

```cpp
// ❌ 错误：tmpBuffer 类型不匹配
AscendC::LocalTensor<uint8_t> tmpBuffer = tmpBuf.Get<uint8_t>();
AscendC::ReduceMax(rowTmp, src, tmpBuffer, count);  // 编译错误！

// ✅ 正确：tmpBuffer 类型必须与 T 相同
AscendC::LocalTensor<T> reduceTmp = reduceBuf.Get<T>();
AscendC::ReduceMax(rowTmp, src, reduceTmp, count);
```

### 完整示例：Softmax 逐行处理

```cpp
__aicore__ inline void ProcessRow(
    AscendC::LocalTensor<T>& xLocal, 
    AscendC::LocalTensor<T>& yLocal, 
    uint32_t rowIdx)
{
    // 关键：用 rLengthAlign 计算偏移
    uint32_t rowOffset = rowIdx * rLengthAlign;
    
    AscendC::LocalTensor<T> rowTmp = rowBuf.Get<T>();
    AscendC::LocalTensor<T> reduceTmp = reduceBuf.Get<T>();
    
    // 1. ReduceMax（只传 rLength，有效数据个数）
    AscendC::ReduceMax<T>(rowTmp, xLocal[rowOffset], reduceTmp, 
        static_cast<int32_t>(rLength), false);
    
    T maxVal = rowTmp.GetValue(0);
    AscendC::Duplicate<T>(rowTmp, maxVal, rLength);
    AscendC::Sub<T>(xLocal[rowOffset], xLocal[rowOffset], rowTmp, rLength);
    
    // 2. Exp
    AscendC::Exp<T>(xLocal[rowOffset], xLocal[rowOffset], rLength);
    
    // 3. ReduceSum
    AscendC::ReduceSum<T, true>(rowTmp, xLocal[rowOffset], reduceTmp, 
        static_cast<int32_t>(rLength));
    
    T sumVal = rowTmp.GetValue(0);
    AscendC::Duplicate<T>(rowTmp, sumVal, rLength);
    AscendC::Div<T>(yLocal[rowOffset], xLocal[rowOffset], rowTmp, rLength);
}
```

---

## Pattern 接口（跨行批量）

### 适用场景
- 需要沿行方向（RA）或列方向（AR）批量 Reduce
- 数据已 32 字节对齐

### Pattern 说明

```cpp
// Pattern::Reduce::RA - 沿第一维（行方向）Reduce
//   输入: (R, C) → 输出: (C,)
AscendC::ReduceMax<T, AscendC::Pattern::Reduce::RA>(dst, src, tmp, srcShape, isInit);

// Pattern::Reduce::AR - 沿最后一维（列方向）Reduce
//   输入: (R, C) → 输出: (R,)
AscendC::ReduceSum<T, AscendC::Pattern::Reduce::AR>(dst, src, tmp, srcShape, isInit);
```

### 典型用法

```cpp
// 对每行求 max 和 sum
uint32_t srcShape[] = {1, alignedCols};  // alignedCols 必须 32 字节对齐

// 求每行最大值
AscendC::ReduceMax<float, AscendC::Pattern::Reduce::AR>(
    maxLocal,   // 输出: 1 个最大值
    srcLocal,   // 输入: alignedCols 个元素
    tmpLocal,   // 临时 buffer
    srcShape,   // {1, alignedCols}
    true        // isInit
);

// 求每行 exp 之和
AscendC::ReduceSum<float, AscendC::Pattern::Reduce::AR>(
    sumLocal,   // 输出: 1 个和
    expLocal,   // 输入: alignedCols 个元素
    tmpLocal,   // 临时 buffer
    srcShape,   // {1, alignedCols}
    true        // isInit
);
```

### tmpBufSize 计算

```cpp
// Pattern 接口需要正确计算 tmpBufSize
uint32_t perRepeat = 256 / sizeof(float);      // 64 for FP32
uint32_t perBlock = 32 / sizeof(float);        // 8 for FP32
uint32_t repeats = (R * alignedCols + perRepeat - 1) / perRepeat;
uint32_t tmpBufSize = ((repeats + perBlock - 1) / perBlock) * perBlock * sizeof(float);
tmpBufSize = std::max(tmpBufSize, 4096u);      // 最小 4KB
```

---

## 常见错误

### 错误1：tmpBuffer 类型不匹配

```cpp
// ❌ 错误
AscendC::LocalTensor<uint8_t> tmpBuffer = tmpBuf.Get<uint8_t>();
AscendC::ReduceMax(rowTmp, src, tmpBuffer, count);
// 编译错误：no matching function for call to 'ReduceMax'

// ✅ 正确
AscendC::LocalTensor<T> reduceTmp = reduceBuf.Get<T>();
AscendC::ReduceMax(rowTmp, src, reduceTmp, count);
```

### 错误2：rowOffset 用 rLength 而非 rLengthAlign

```cpp
// ❌ 错误：多行场景失败
uint32_t rowOffset = rowIdx * rLength;  // 13 * 1 = 13, 非对齐地址
AscendC::ReduceMax(..., xLocal[rowOffset], ...);

// ✅ 正确
uint32_t rowOffset = rowIdx * rLengthAlign;  // 16 * 1 = 16, 对齐地址
AscendC::ReduceMax(..., xLocal[rowOffset], ...);
```

**症状**：单行通过，多行失败（特别是非对齐场景）

### 错误3：非对齐数据用 Pattern 接口

```cpp
// ❌ 错误：rLength=13，非 32 字节对齐
uint32_t srcShape[] = {1, rLength};  // 13，非对齐！
AscendC::ReduceMax<T, AscendC::Pattern::Reduce::AR>(..., srcShape, true);

// ✅ 正确方案1：改用 Level 2 接口
AscendC::ReduceMax<T>(dst, src, tmp, rLength, false);

// ✅ 正确方案2：用 DataCopyPad 填充到对齐
// GM 数据填充到 alignedCols，再用 Pattern 接口
```

### 错误4：Reduce API count 传 rLengthAlign

```cpp
// ❌ 错误：count 应该是有效数据个数
AscendC::ReduceMax(rowTmp, src, tmp, rLengthAlign, false);

// ✅ 正确：count 只传有效数据个数
AscendC::ReduceMax(rowTmp, src, tmp, rLength, false);
```

---

## 最佳实践

### 参数对照表

| 参数位置 | 用 rLength | 用 rLengthAlign |
|---------|-----------|-----------------|
| DataCopyPad blockLen | ✓ | ✗ |
| Reduce API count | ✓ | ✗ |
| Sub/Exp/Div count | ✓ | ✗ |
| UB rowOffset | ✗ | ✓ |
| Buffer 大小计算 | ✗ | ✓ |

### 决策流程

```
需要 Reduce 操作？
    │
    ├─ 逐行独立处理（Softmax/LayerNorm）
    │     │
    │     └─→ Level 2 接口
    │           ReduceMax(dst, src, tmp, count)
    │           - 无对齐要求
    │           - count = rLength（有效数据个数）
    │
    └─ 跨行批量 Reduce
          │
          └─→ Pattern 接口
                ReduceMax<T, Pattern::AR>(dst, src, tmp, shape, isInit)
                - 需要 32 字节对齐
                - 用 DataCopyPad 预处理
```

### Buffer 分配

```cpp
// 逐行处理模式
uint32_t tileSize = rowsPerLoop * rLengthAlign * sizeof(T);  // 输入/输出 buffer
uint32_t rowBufSize = rLengthAlign * sizeof(T);              // 临时 buffer
uint32_t reduceBufSize = 32 * 1024;                          // Reduce 临时 buffer

pipe->InitBuffer(inQueueX, 1, tileSize);
pipe->InitBuffer(outQueueY, 1, tileSize);
pipe->InitBuffer(rowBuf, rowBufSize);
pipe->InitBuffer(reduceBuf, reduceBufSize);
```
