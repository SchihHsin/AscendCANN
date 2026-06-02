---
name: ascendc-api-best-practices
description: Ascend C API 使用最佳实践。提供算术、归约、数据搬运、Buffer管理、精度转换等 API 的正确用法和最佳实践。触发：使用 AscendC API 时或遇到 API 相关问题时。
---

# Ascend C API 最佳实践

---

## API 类别索引

| API 类别 | 涵盖 API | 核心文档 | 典型场景 |
|---------|---------|---------|---------|
| **算术运算** | Add, Sub, Mul, Div, Adds, Muls | [api-arithmetic.md](references/api-arithmetic.md) | Softmax, LayerNorm, 广播优化 |
| **归约操作** | ReduceMax, ReduceSum | [api-reduce.md](references/api-reduce.md) | Softmax, LayerNorm, ReduceMean |
| **数学函数** | Exp, Log, Sin, Cos | [api-math.md](references/api-math.md) | 激活函数（规划中） |
| **数据搬运** | DataCopy, DataCopyPad | [api-datacopy.md](references/api-datacopy.md) | 非对齐处理、多维搬运 |
| **Buffer 管理** | TBuf, TQue | [api-buffer.md](references/api-buffer.md) | Double Buffer、内存规划 |
| **精度转换** | Cast | [api-precision.md](references/api-precision.md) | FP16/FP32 混合精度 |
| **流水线同步** | EnQue, DeQue, SetFlag | [api-pipeline.md](references/api-pipeline.md) | 多级流水线、事件同步 |
| **Vector 操作** | repeatTimes, mask | [api-vector.md](references/api-vector.md) | 向量化计算、掩码操作 |
| **API 限制** | - | [api-restrictions.md](references/api-restrictions.md) | 禁用 API、编译期限制 |

---

## 场景索引

| 使用场景 | 相关文档 | 关键技巧 |
|---------|---------|---------|
| **Softmax/LayerNorm** | [api-reduce.md](references/api-reduce.md), [api-arithmetic.md](references/api-arithmetic.md) | 标量操作、广播优化、Buffer 复用 |
| **逐行处理（AR 模板）** | [api-arithmetic.md](references/api-arithmetic.md) | Adds/Muls、节省 UB |
| **多行广播（ARA 模板）** | [api-arithmetic.md](references/api-arithmetic.md) | BinaryRepeatParams.src1RepStride=0、分批处理 |
| **非对齐数据** | [api-datacopy.md](references/api-datacopy.md) | DataCopyPad、32 字节对齐 |
| **混合精度** | [api-precision.md](references/api-precision.md) | FP16 输入 FP32 计算 |
| **流水线优化** | [api-pipeline.md](references/api-pipeline.md), [api-buffer.md](references/api-buffer.md) | Double Buffer、事件同步 |
| **性能调优** | [api-vector.md](references/api-vector.md) | repeatTimes 优化、mask 模式 |
| **遇到 API 限制** | [api-restrictions.md](references/api-restrictions.md) | 替代方案、避坑指南 |

---

## 快速参考

完整的 API 参数速查表：[api-quickref.md](references/api-quickref.md)
