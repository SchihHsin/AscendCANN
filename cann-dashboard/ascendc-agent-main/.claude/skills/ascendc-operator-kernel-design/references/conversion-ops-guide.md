# Conversion 类算子快速参考

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

### ✅ 推荐使用的 API

```cpp
// 基础数据搬运
AscendC::DataCopy(dstLocal, srcGm, count);
AscendC::DataCopy(dstGm, srcLocal, count);

// 带对齐填充的搬运（推荐）
AscendC::DataCopyPad<T>(dst, src, copyParams, padParams);

// 非连续数据搬运（stride 模式）
AscendC::DataCopyExtParams params = {
    blockCount, blockLen, srcStride, dstStride, rsv
};
AscendC::DataCopyPad<T>(dst, src, params);

// 高阶转置
AscendC::Transpose<T>(dst, src, transposeTiling);
AscendC::GetTransposeMaxMinTmpSize<T>(tiling, maxTmpSize, minTmpSize);

// 填充
AscendC::Duplicate<T>(dst, value, count);  // 用常数填充
```

### 子类型速查

| 子类型 | 操作 | 典型算子 | 核心 API |
|--------|------|---------|---------|
| **维度变换** | 改变维度顺序 | Transpose, Permute | `Transpose<T>` |
| **拼接/拆分** | 合并或拆分张量 | Concat, Split | `DataCopyPad` + stride |
| **填充/裁剪** | 增加或去除填充 | Pad, Unpad, Slice | `Duplicate` + `DataCopy` |
| **格式转换** | 存储格式变换 | TransData (ND↔NZ↔5HD) | `TransDataTo5HD` |
| **形状变换** | 改变逻辑形状 | Reshape, Flatten | 仅改变元数据 |

---

## 核心概念

### 共同特征

| 特征 | 说明 |
|------|------|
| 核心操作 | 数据重排/搬运，无数学计算 |
| 计算密度 | 极低（纯访存操作） |
| 设计难点 | 复杂的地址映射和对齐处理 |
| 性能瓶颈 | 带宽利用率 |

### 数据格式

| 格式 | 存储方式 | 用途 |
|------|---------|------|
| **ND** | 行主序 `A[i*W+j]` | 一般输入 |
| **NZ** | 16×16 块格式 | 预优化权重 |
| **5HD** | `[N, ceil(C/16), H, W, 16]` | 硬件 16 通道并行 |

### Transpose 2D 基本原理

```
输入 A[H, W] → 输出 B[W, H]
地址映射: dst[j * H + i] = src[i * W + j]
```

### Concat / Split 地址映射

```
Axis 0 拼接（连续）:
  直接 DataCopy: src1 → dst[0:len1], src2 → dst[len1:]

Axis 1 拼接（不连续）:
  逐行搬运或使用 stride DataCopy:
  dst[row * (K1+K2) : +K1] = A[row * K1 : +K1]
  dst[row * (K1+K2) + K1 : +K2] = B[row * K2 : +K2]
```

### Pad 实现策略

```
策略 1: Duplicate(0) 填充整个输出 → DataCopy 搬运原始数据到正确位置
策略 2: DataCopyPad API 直接处理填充（推荐）
```

---

## 计算流程

### Transpose（使用高阶 API）

```cpp
// Host 侧计算 Tiling
AscendC::GetTransposeTilingInfo<T>(transposeTiling, srcShape, perm, ...);

// Kernel 侧
uint32_t maxTmpSize, minTmpSize;
AscendC::GetTransposeMaxMinTmpSize<T>(transposeTiling, maxTmpSize, minTmpSize);

AscendC::Transpose<T>(dstLocal, srcLocal, transposeTiling);
```

### Concat axis=1（stride DataCopy）

```cpp
// 非连续数据搬运
AscendC::DataCopyExtParams params;
params.blockCount = rowNum;       // 行数
params.blockLen = colBytes;       // 每行字节数
params.srcStride = srcRowBytes;   // 源行间距
params.dstStride = dstRowBytes;   // 目标行间距
AscendC::DataCopyPad<T>(dst, src, params);
```

### Pad（先填充后搬运）

```cpp
// Step 1: 全零填充
AscendC::Duplicate<T>(outLocal, (T)0, totalSize);

// Step 2: 搬运原始数据到偏移位置
uint32_t offset = padTop * newW + padLeft;
AscendC::DataCopy(outLocal[offset], srcLocal, srcLen);
```

---

## Tiling 与 Buffer

### Transpose Buffer 布局

```
┌──────────────────┐
│ inQueue (VECIN)  │ 源数据块
├──────────────────┤
│ outQueue (VECOUT)│ 转置后数据块
├──────────────────┤
│ tmpBuf           │ GetTransposeMaxMinTmpSize 计算
└──────────────────┘

临时 Buffer:
  minTmpSize → 功能正确（最低性能）
  maxTmpSize → 最佳性能
```

### Concat / Split Buffer

```
仅需搬运 Buffer:
  inQueue: 源数据
  outQueue: 目标数据
  无需临时 Buffer（纯搬运）

注意: 非连续轴操作需逐行处理或使用 stride DataCopy
```

---

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 转置结果错乱 | 地址映射计算错误 | 使用高阶 `Transpose` API |
| Concat 行间错位 | stride 参数错误 | 检查 srcStride 和 dstStride |
| Pad 填充位置偏移 | offset 未考虑 padTop/padLeft | 偏移 = padTop × newW + padLeft |
| NZ 格式数据丢失 | 维度未 16 对齐 | 补零填充到 16 的倍数 |
| 性能很差 | 逐元素搬运 | 使用块搬运，减少 DataCopy 调用次数 |
| 非连续轴 Split 错误 | 直接整块搬运 | 逐行处理或 stride DataCopy |

---

## 检查清单

### 设计阶段

- [ ] 确定操作类型（转置/拼接/拆分/填充/格式转换）
- [ ] 确定源和目标的 Shape 和 Format
- [ ] 分析数据连续性（哪些维度连续存储）
- [ ] 计算地址映射公式
- [ ] 确定是否需要 stride DataCopy

### 实现阶段

- [ ] 使用 `DataCopyPad` 而非 `DataCopy` 处理对齐
- [ ] Transpose 使用高阶 API + Tiling
- [ ] 临时 Buffer 大小正确计算
- [ ] 非连续维度操作使用逐行处理
- [ ] NZ 格式的 16×16 块边界正确处理

### 测试阶段

- [ ] 小 Shape 功能验证
- [ ] 非对齐 Shape 测试
- [ ] 边界条件（单行/单列/1×1）
- [ ] 数值不变性验证（转置前后元素集合一致）
- [ ] 多种数据类型测试

---

## 快速链接

- **示例文件**:
  - [Transpose](../../../asc-devkit/examples/03_libraries/09_transpose/transpose/)
  - [TransData](../../../asc-devkit/examples/03_libraries/09_transpose/transdata/)
  - [TransData to 5HD](../../../asc-devkit/examples/03_libraries/09_transpose/trans_data_to_5hd/)
  - [Pad](../../../asc-devkit/examples/03_libraries/09_transpose/pad/)
  - [Unpad](../../../asc-devkit/examples/03_libraries/09_transpose/unpad/)
  - [Duplicate](../../../asc-devkit/examples/03_libraries/09_transpose/duplicate/)
- **相关参考**:
  - [Elementwise 设计指南](elementwise-ops-guide.md)
  - [API 最佳实践](../../ascendc-api-best-practices/references/api-arithmetic.md)
