---
name: ascendc-precision-debug
description: Ascend C 算子精度调试技能，提供系统化的精度问题诊断、分析和解决方法。当出现以下情况时使用：(1) 算子功能正确但精度不达标，(2) FP16 精度明显差于 FP32，(3) 特定数值范围出现大误差，(4) 验证脚本报告精度失败，(5) Plan 阶段需要评估精度要求。
---

# Ascend C 算子精度调试

## 核心理念

> **精度调试 = 理解 + 分析 + 定位 + 修复**

1. **理解数据类型限制**：FP16 约 3-4 位有效数字，FP32 约 6-7 位
2. **识别数值稳定性问题**：大数吃小数、灾难性抵消
3. **掌握科学调试方法**：从最小复现到根因分析

## 使用时机

**适用**：精度不达标、FP16差于FP32、特定数值范围误差大、验证失败、Plan阶段评估精度

**不适用**（功能问题）：结果完全错误、编译/运行错误、逻辑异常 → 使用 `/ascendc-debugging`

---

**精度敏感算子特征**：

| 特征 | 示例 | 建议 |
|-----|------|------|
| 累加类操作 | Reduce/Sum/Mean | 使用 FP32 累加器 |
| exp/log 操作 | Softmax/LogSoftmax | 设计数值稳定算法 |
| 归一化操作 | LayerNorm/BatchNorm | 中间值用 FP32 |

### 实现阶段 - 精度意识

编码规范：
- 关键中间变量使用 FP32：`float sum_fp32 = 0.0f;`
- 数值敏感操作添加注释：`// 精度敏感：先减 max 避免溢出`

### 验证阶段 - 精度测试

验证流程：
```
1. 最小可复现测试（优先：32字节对齐 + FP32）
2. FP32 对齐测试通过 → 算法逻辑正确 → 测试 FP16
3. FP32 对齐测试失败 → 检查公式/API 实现
4. 精度验证失败 → 触发调试流程
```

---

## 调试前置要求 ⭐⭐⭐

> 进入调试前**必须**完成以下三步

### 1. 固定最小可复现用例

| 项目 | 说明 | 示例 |
|------|------|------|
| Shape | tensor 形状 | `{8, 16}` |
| Dtype | 数据类型 | `float16` |
| 固定值 | 具体数值 | `[1.0, 2.0, -0.5, ...]` |

**选择原则**：优先简单 → 优先32字节对齐 → 优先FP32 → 覆盖边界值

详细示例见 [references/precision-checklist.md](references/precision-checklist.md)

### 2. 检索 asc-devkit ⭐

> **禁止凭直觉修改代码**

**检索顺序**：
1. 搜索 `asc-devkit/examples/` 查找类似算子
2. 查看 `asc-devkit/docs/api/context/` API 文档
3. 对比官方实现与当前实现

### 3. 清理缓存和临时文件

```bash
rm -rf build input output
mkdir -p build/input build/output
```

---

## 快速决策树

```
[前置检查] 已固定用例？已检索API？已清理缓存？
    │
    └─ 否 → 先完成前置步骤
    └─ 是 → 继续
        │
        ├─ [第一步] 排查数据搬运 ⭐
        │   ├─ 检查 DataCopy 数据量是否 32 字节对齐
        │   │   └─ 非对齐 → 改用 DataCopyPad
        │   └─ 验证：用 "CopyIn → CopyOut" 测试搬运
        │
        ├─ [第二步] 对比分析
        │   └─ 对比官方示例与当前实现 → 发现差异
        │
        └─ [第三步] 诊断问题类型
            ├─ 所有结果都差 → 公式/常量/API选择
            ├─ 个别值错误 → 边界条件/除零/溢出
            └─ 误差整体偏大 → FP16精度不足 → 尝试FP32中间计算
```

---

## 症状-原因速查表

| 症状 | 可能原因 | 诊断方向 |
|------|----------|----------|
| `sum=0, max_err=输入级别` | 输出没写出 | 检查输出队列类型（VECIN vs VECOUT） |
| `sum=0, max_err≈0` | 输出全0/未初始化 | 检查 UB 溢出、buffer 分配 |
| `核心超时/挂起` | Buffer 冲突/死锁 | 检查 Alloc/Free 配对 |
| `特定参数范围失败` | 阈值/边界错误 | 验证阈值计算、检查分支条件 |
| `非对齐数据失败` | DataCopy 对齐问题 | 改用 DataCopyPad |
| `FP16 差但 FP32 好` | 精度不足 | 中间计算用 FP32 |
| `Cast 后数据错误` | RoundMode 错误 | half→float用CAST_NONE，float→half用CAST_ROUND |

---

## 常见陷阱速查

| 陷阱 | 症状 | 解决方案 |
|-----|------|----------|
| **DataCopy 非对齐** | 小规模数据全0/异常 | 使用 DataCopyPad ⭐ |
| FP16 精度不足 | 简单计算也有误差 | 关键中间值用 FP32 |
| exp/log 溢出 | 出现 Inf 或 NaN | 先减最大值再计算 |
| 减法抵消 | a≈b 时 a-b 误差大 | 使用数值稳定等价公式 |
| Reduce 误差 | Reduce 结果比逐元素误差大 | 使用 FP32 累加器 |
| 除零风险 | NaN 或异常大值 | 添加 epsilon 保护 |
| **Cast RoundMode** | Cast后数据混乱 | 参见上方速查表 |
| **流水线同步** | 数据随机/完全错误 | 使用 EnQue/DeQue 同步 ⭐ |

### 流水线同步调试

**核心问题**：DataCopy/DataCopyPad 是异步 DMA 操作，直接在搬运后的数据上做 Vector 计算可能读到未完成的数据！

```cpp
// ❌ 错误：AllocTensor 后直接用
LocalTensor<T> x = inQueue.AllocTensor<T>();
DataCopy(x, gm, size);
Compute(x);  // 错！可能读到未完成搬运的数据

// ✅ 正确：DeQue 后再计算
LocalTensor<T> x = inQueue.AllocTensor<T>();
DataCopy(x, gm, size);
inQueue.EnQue(x);
LocalTensor<T> xIn = inQueue.DeQue<T>();  // 等待搬运完成
Compute(xIn);
```

**临时调试方法**：
```cpp
DataCopy(x, gm, size);
PipeBarrier<PIPE_ALL>();  // 临时加，如果结果正确说明是同步问题
Compute(x);
```

**如果 PipeBarrier 能解决问题，说明是同步问题** → 修复方案：改为 EnQue/DeQue 机制

| 误区 | 正确理解 |
|-----|---------|
| AllocTensor 后数据就可用 | AllocTensor 只分配内存，不等待搬运 |
| DataCopy 是同步的 | DataCopy 是异步 DMA，立即返回 |
| 不用 EnQue/DeQue 也能正常工作 | 必须用 EnQue/DeQue 或 PipeBarrier 同步 |
| PipeBarrier 性能好 | PipeBarrier 是全流水线停顿，性能差 |

详细说明见 [references/common-traps.md](references/common-traps.md)

---

## 调试策略层级

```
调试方法
    │
    ├─ 快速方法（优先尝试，≤7次）
    │   ├─ 误差分布分析 → 识别误差模式
    │   ├─ Printf 特定位置 → 缩小范围
    │   └─ 常见陷阱排查 → 对症下药
    │
    └─ 二分调试（保底手段）
        └─ 快速方法尝试≥7次或方法穷尽时立即切换
```

> **重要原则**：不要盲目试错超过 7 次

---

## 问题定位方法

### 1. 对比法（与工作的代码对比）

找到正常工作的代码，逐行对比差异

### 2. 边界二分法

记录通过/失败的临界点，分析分支选择

### 3. 数值验证法

不要相信估算公式，用代码计算实际值

### 4. Buffer 调试要点

| 问题 | 表现 | 解决方案 |
|------|------|----------|
| VECIN 用于输出 | 输出等于输入 | 输出必须用 VECOUT 队列 |
| Buffer 未释放 | 核心挂起/超时 | 循环内 Alloc 后必须 Free |
| Double Buffer 漏算 | 阈值错误 | 计算阈值时 ×2 |

详细定位流程见 [references/diagnosis-workflow.md](references/diagnosis-workflow.md)

---

## 精度标准来源优先级

1. **优先级1**：算子开发 Plan 中明确的精度要求
2. **优先级2**：华为昇腾官方精度标准文档
3. **优先级3**：本 Skill 默认值（仅作兜底）

### 推荐容差标准

| 数据类型 | rtol | atol |
|---------|------|------|
| FP16 | 1e-3 | 1e-4 |
| FP32 | 1e-5 | 1e-6 |
| INT | - | 0 |

---

## Agent 使用指南

### 调试计数规则

```
计数器 = 0
每次尝试快速方法（误差分析/Printf/陷阱排查）→ 计数器+1
当 计数器 >= 7 或 快速方法穷尽 → 立即切换二分调试
```

### 调试总结要求

每步调试成功后**必须**形成总结：

- 文档描述不清晰的地方
- 需要改进的地方及推荐方案
- 给 Agent 造成困扰的点
- 调试过程记录

总结模板：[references/debug-summary-template.md](references/debug-summary-template.md)

### 检查清单

**调试阶段**：
- [ ] 已固定最小可复现用例
- [ ] 已检索 asc-devkit 确认 API 用法 ⭐
- [ ] 已清理缓存和临时文件
- [ ] 已排查数据搬运问题（DataCopy 32字节对齐）⭐
- [ ] 对比官方示例与当前实现
- [ ] 尝试次数 < 7
- [ ] 达到阈值立即切换二分调试

**Plan 阶段**：
- [ ] 询问用户精度要求
- [ ] 评估是否需要混合精度
- [ ] 设计数值稳定算法

**完成阶段**：
- [ ] 记录精度验证结果
- [ ] 说明已知精度限制
- [ ] 提供精度使用建议

---

## 参考资料

### 工作流程
- [references/diagnosis-workflow.md](references/diagnosis-workflow.md) - 完整诊断工作流程
- [references/binary-search-debug.md](references/binary-search-debug.md) - 二分调试详细指南
- [references/precision-checklist.md](references/precision-checklist.md) - 精度检查清单

### 问题诊断
- [references/common-traps.md](references/common-traps.md) - 常见精度陷阱详解
- [references/best-practices.md](references/best-practices.md) - 最佳实践

### 调试工具
- [references/printf-debug.md](references/printf-debug.md) - Printf 调试法
- [references/data-comparison.md](references/data-comparison.md) - 数据对比法
- [references/tools-reference.md](references/tools-reference.md) - 工具和命令参考

### 实战案例
- [references/case-studies.md](references/case-studies.md) - 实战调试案例
- [references/debug-summary-template.md](references/debug-summary-template.md) - 调试总结模板
