# MatMul 类算子快速参考

---

## 目录

- [API 使用规范](#api-使用规范)
- [核心概念](#核心概念)
- [Kernel 执行流程](#kernel-执行流程)
- [多核分配与偏移](#多核分配与偏移)
- [Batch MatMul 与性能优化](#batch-matmul-与性能优化)
- [常见问题](#常见问题)
- [检查清单](#检查清单)

---

## API 使用规范

### ✅ 推荐：高阶 Matmul API

```cpp
#include "lib/matmul_intf.h"

using A_TYPE = AscendC::MatmulType<AscendC::TPosition::GM, AscendC::CubeFormat::ND, half>;
using B_TYPE = AscendC::MatmulType<AscendC::TPosition::GM, AscendC::CubeFormat::ND, half>;
using C_TYPE = AscendC::MatmulType<AscendC::TPosition::GM, AscendC::CubeFormat::ND, float>;

AscendC::Matmul<A_TYPE, B_TYPE, C_TYPE, BIAS_TYPE> mm;
REGIST_MATMUL_OBJ(&pipe, GetSysWorkSpacePtr(), mm, &tiling);  // 必须注册
```

### 核心方法速查

| 方法 | 作用 | 阶段 |
|------|------|------|
| `SetOrgShape(M, N, Ka, Kb)` | 设置完整矩阵维度 | Setup |
| `SetSingleShape(M, N, K)` | 设置单核计算维度 | Setup |
| `SetTail(tailM, tailN)` | 处理非对齐尾块 | Setup |
| `SetTensorA(gm, isTranspose)` | 设置左矩阵 | Input |
| `SetTensorB(gm, isTranspose)` | 设置右矩阵 | Input |
| `SetBias(gm)` | 设置偏置 | Input |
| `IterateAll(gmC)` | 计算完整单核区域 | Compute |
| `End()` | 释放资源 | Cleanup |

### MatmulType 参数

| 参数 | 可选值 | 说明 |
|------|--------|------|
| `pos` | GM, VECIN, VECOUT, TSCM | 数据位置 |
| `format` | ND, NZ | 数据格式 |
| `T` | half, float, int8_t, bfloat16_t | 数据类型 |
| `isTransposed` | false, true | 是否转置 |

### 常用类型组合

| 场景 | A 类型 | B 类型 | C 类型 |
|------|--------|--------|--------|
| 标准 FP16 | ND half | ND half | ND float |
| 量化 INT8 | ND int8 | NZ int8 | ND int32 |
| BF16 | ND bf16 | ND bf16 | ND float |

---

## 核心概念

### 内存层级

```
GM → L1 Buffer → L0A/L0B → L0C (Cube计算) → UB → GM
```

与 Vector 算子不同，MatMul 使用 **Cube 计算单元** 和多级缓存层级。

### Host 侧 Tiling

```cpp
#include "lib/matmul_tiling.h"

optiling::TCubeTiling tilingData;
matmul_tiling::MultiCoreMatmulTiling tilingApi(*platform);
tilingApi.SetDim(platform->GetCoreNumAic());
tilingApi.SetAType(TPosition::GM, CubeFormat::ND, DataType::DT_FLOAT16, isTransA);
tilingApi.SetBType(TPosition::GM, CubeFormat::ND, DataType::DT_FLOAT16, isTransB);
tilingApi.SetCType(TPosition::GM, CubeFormat::ND, DataType::DT_FLOAT);
tilingApi.SetOrgShape(M, N, K);
tilingApi.SetShape(M, N, K);
tilingApi.SetFixSplit(baseM, baseN, baseK);
tilingApi.EnableBias(hasBias);
tilingApi.GetTiling(tilingData);
```

### 数据格式

| 格式 | 存储方式 | 适用场景 |
|------|---------|---------|
| **ND** | 行主序 `A[i*K+j]` | 一般输入 |
| **NZ** | 16×16 块格式 | 预优化权重 |

---

## Kernel 执行流程

```cpp
extern "C" __global__ __aicore__ void matmul_kernel(
    GM_ADDR a, GM_ADDR b, GM_ADDR bias, GM_ADDR c,
    __kfc_workspace__ GM_ADDR workspace, GM_ADDR tilingGm)
{
    // 1. 读取 Tiling
    TCubeTiling tiling;
    CopyTiling(&tiling, tilingGm);

    // 2. 判断核是否参与计算
    if (AscendC::GetBlockIdx() >= tiling.usedCoreNum) return;

    // 3. 创建 Matmul 对象
    AscendC::TPipe pipe;
    AscendC::Matmul<A_TYPE, B_TYPE, C_TYPE, BIAS_TYPE> mm;
    REGIST_MATMUL_OBJ(&pipe, GetSysWorkSpacePtr(), mm, &tiling);

    // 4. 设置 Tensor + 偏移
    mm.SetOrgShape(tiling.M, tiling.N, tiling.Ka, tiling.Kb);
    mm.SetTensorA(aGm[offsetA]);
    mm.SetTensorB(bGm[offsetB]);
    mm.SetTail(tailM, tailN);

    if (tiling.isBias) mm.SetBias(biasGm);

    // 5. 计算 + 释放
    mm.IterateAll(cGm[offsetC]);
    mm.End();
}
```

---

## 多核分配与偏移

### 2D 网格映射

```cpp
uint32_t mBlocks = (M + singleCoreM - 1) / singleCoreM;
uint32_t mCoreIdx = blockIdx % mBlocks;
uint32_t nCoreIdx = blockIdx / mBlocks;
```

### 偏移计算（考虑转置）

```cpp
// A 矩阵：非转置 → 行偏移 × K；转置 → 行偏移
int offsetA = isTransA ? mCoreIdx * singleCoreM
                       : mCoreIdx * singleCoreM * Ka;

// B 矩阵：非转置 → 列偏移；转置 → 列偏移 × K
int offsetB = isTransB ? nCoreIdx * singleCoreN * Kb
                       : nCoreIdx * singleCoreN;

// C 矩阵
int offsetC = mCoreIdx * singleCoreM * N + nCoreIdx * singleCoreN;

// 尾块处理
int tailM = min(singleCoreM, M - mCoreIdx * singleCoreM);
int tailN = min(singleCoreN, N - nCoreIdx * singleCoreN);
```

---

## Batch MatMul 与性能优化

### Batch MatMul

```cpp
// 类型定义需加 LayoutMode::BSNGD
using A_TYPE = MatmulType<TPosition::GM, CubeFormat::ND, half, false, LayoutMode::BSNGD>;

// 循环处理 batch
for (int i = 0; i < batchCount; i++) {
    mm.SetTensorA(aGm[i * M * K], false);
    mm.SetTensorB(bGm[i * K * N], true);
    mm.IterateBatch(cGm[i * M * N], batchA, batchB, false);
    AscendC::PipeBarrier<PIPE_FIX>();
}
```

### 配置模式选择

| 配置 | 场景 | 特点 |
|------|------|------|
| `CFG_NORM` | 通用 | 自动优化，适合起步 |
| `CFG_MDL` | 大模型推理 | 预加载优化 |
| `CFG_PURE_CUBE` | 极致性能 | 最小开销 |

### 性能调优

```cpp
mm.SetL2CacheHint(AscendC::CacheMode::CACHE);    // 启用 L2 缓存
AscendC::PipeBarrier<PIPE_FIX>();                  // Cube 流水线同步
```

---

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 结果全 0 | 未调用 REGIST_MATMUL_OBJ | 使用前必须注册 |
| 核挂起 | blockIdx ≥ usedCoreNum 未 return | 加 `if (blockIdx >= usedCoreNum) return;` |
| 尾块精度差 | 未调用 SetTail | 计算 tailM/tailN 并设置 |
| 偏移错误 | 转置下偏移计算不对 | 区分 isTransA/isTransB |
| Workspace 不足 | 未分配足够空间 | 根据 Tiling 输出确定大小 |
| 编译错误 | 类型组合不匹配 | 确保 A/B/C TYPE 数据类型有效 |

---

## 检查清单

### 设计阶段

- [ ] 确定 M/N/K 维度和数据类型
- [ ] 选择数据格式（ND vs NZ）
- [ ] 确定是否需要 Bias / 转置
- [ ] 选择配置模式（CFG_NORM / CFG_MDL / ...）

### 实现阶段

- [ ] Host 侧正确计算 Tiling（MultiCoreMatmulTiling）
- [ ] 使用 `REGIST_MATMUL_OBJ` 注册
- [ ] 判断 `blockIdx < usedCoreNum`
- [ ] 正确计算多核偏移（考虑转置）
- [ ] 调用 `SetTail` 处理尾块
- [ ] 调用 `mm.End()` 释放资源

### 测试阶段

- [ ] 小矩阵验证（M=N=K=16）
- [ ] 非对齐矩阵（M=33, N=65, K=129）
- [ ] 转置 / Bias 场景测试
- [ ] 多核负载均衡验证
- [ ] 精度对比（与 numpy.matmul）

---

## 快速链接

- **示例文件**:
  - [入门 MatMul](../../../asc-devkit/examples/00_introduction/02_matmul/)
  - [标准 MatMul](../../../asc-devkit/examples/03_libraries/01_matrix/matmul/)
  - [BatchMatMul](../../../asc-devkit/examples/03_libraries/01_matrix/batch_matmul/)
  - [L2 Cache 优化](../../../asc-devkit/examples/03_libraries/01_matrix/matmul_l2cache/)
  - [GroupedMatMul](../../../asc-devkit/examples/04_best_practices/06_grouped_matmul/)
  - [量化 MatMul](../../../asc-devkit/examples/03_libraries/01_matrix/fixpipe_co12c1_quantization_f322s8/)
