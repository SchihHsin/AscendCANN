---
name: ascendc-debugging
description: Ascend C 通用调试技能。处理编译错误、运行时错误，提供 Level 0~N 测试、Printf 调试等通用方法。精度问题请使用 /ascendc-precision-debug。
---

# Ascend C 通用调试

## 概述

本技能提供 Ascend C 算子开发过程中的通用调试支持：
- **编译错误**：语法、类型、对齐等问题
- **运行时错误**：执行崩溃、结果异常等

> **核心理念**：调试 = 定位问题 → 分析原因 → 修复该部分，而非推翻重写

---

## 使用时机

| 问题类型 | 使用 Skill |
|---------|-----------|
| 编译错误、运行时错误 | **本 skill** (`/ascendc-debugging`) |
| 精度问题（功能正确但精度不达标） | `/ascendc-precision-debug` |
| FP16 精度明显差于 FP32 | `/ascendc-precision-debug` |
| 特定数值范围出现大误差 | `/ascendc-precision-debug` |

---

## 第一部分：错误类型处理

### 1. 编译错误

| 问题 | 可能原因 | 排查方法 |
|------|---------|---------|
| `ambiguous` 调用错误 | Kernel 函数定义顺序错误 | 检查函数定义是否在调用之前 |
| 命名冲突 | 使用了标准库函数名 | 修改为自定义名称 |
| 编译失败 | 不满足对齐要求 | 检查 32/64/512 字节对齐 |
| 类型不匹配 | 数据类型不支持 | 确认 API 支持的类型 |

**处理方法**：定位错误行号，参考文档检查语法，对比官方示例

### 2. 运行时错误

| 问题 | 可能原因 | 排查方法 |
|------|---------|---------|
| 全局聚合错误 | 分段独立计算 | 设计多遍遍历方案 |
| 硬件参数写死 | 使用固定值 | 使用 API 动态获取 |
| 内存访问异常 | 越界访问 | 检查 Tiling 边界条件 |
| 核心超时/挂起 | Buffer 冲突/死锁 | 检查 Alloc/Free 配对 |

**处理方法**：使用 `AscendC::printf` 定位问题，采用渐进式调试

---

## 第二部分：通用调试方法

### Level 0~N 多级用例构建

```
Level 0: 8-16 元素  ──▶ 基础功能验证
    │
    └── 通过 ──▶ ⚠️ 必须继续测试 Level 1
                    │
Level 1: 1K 元素     ──▶ 典型场景验证
                    │
                    └── 通过 ──▶ ⚠️ 必须继续测试 Level 2
                                    │
Level 2: 极值/零值   ──▶ 边界情况验证
                                    │
                                    └── 通过 ──▶ ⚠️ 必须继续测试 Level 3
                                                    │
Level 3: 大数据量    ──▶ 性能验证
                                                    │
                                                    └── 全部通过 ──▶ 测试完成
```

**强制规则**：
- 必须完成全部 4 级测试：Level 0 → Level 1 → Level 2 → Level 3
- 仅 Level 0 未通过时允许停止修复

详细指南见 [references/level-testing.md](references/level-testing.md)

### Printf 调试法

```cpp
// 在 .asc 文件中添加调试输出
AscendC::printf("Step 1 - value: %f\n", value.GetValue());

// FP16 打印需转为 float
AscendC::printf("FP16 value: %f\n", static_cast<float>(half_val));

// 条件打印 - 只打印误差大的位置
if (abs(output[i] - expected[i]) > threshold) {
    AscendC::printf("Mismatch at %d: got %.6f, expected %.6f\n",
           i, output[i], expected[i]);
}
```

调试参考：`asc-devkit/examples/01_utilities/00_printf/printf.asc`

### 分段调试步骤（复杂公式）

1. 识别公式中的关键中间步骤
2. 在每个步骤后插入 `AscendC::printf`
3. 运行并比对每个中间值与预期
4. 定位误差来源的具体步骤
5. 修复该步骤的问题

---

## 第三部分：精度问题概要

> **重要**：如果算子功能正确但精度不达标，请使用 **`/ascendc-precision-debug`**

### 快速速查表

| 问题 | 快速解决方案 |
|-----|-------------|
| FP16 精度不足 | 关键中间值用 FP32 |
| exp/log 溢出 | 先减最大值再计算 |
| 减法抵消 | 使用数值稳定等价公式 |
| Reduce 误差 | 使用 FP32 累加器 |
| 除零风险 | `abs(den) < eps ? 0 : num/den` |

### 推荐容差标准

| 数据类型 | rtol | atol |
|---------|------|------|
| FP16 | 1e-3 | 1e-4 |
| FP32 | 1e-5 | 1e-6 |
| INT | - | 0 |

**如需深度精度调试，请调用 `/ascendc-precision-debug`**

---

## 第四部分：开发失败处理

当遇到无法解决的开发问题时：

### 1. 记录失败原因

- 明确说明哪个 API 或功能无法实现
- 记录已尝试的方案和结果
- 提供相关错误信息或文档引用

### 2. 诚实报告

- 不要猜测或强行实现
- 明确标注"开发失败"及原因
- 这有助于后续改进和寻求帮助

---

## 禁止的行为

- ❌ 一遇到错误就全部重写
- ❌ 看到问题就简化代码
- ❌ 不分析原因就尝试其他方案
- ❌ 盲目试错超过 7 次不切换二分调试

---

## API 使用确认 ⭐

当怀疑是 API 使用问题时，按以下顺序确认：

1. **第一步**：查看 `asc-devkit/docs/api/context/` 下的 API 文档
2. **第二步**：搜索 `asc-devkit/examples/` 查找类似算子的示例
3. **第三步**：如果文档不够详细，使用 `/ascend-docs-search` 搜索官方文档

> **重要**：禁止猜测 API 用法，所有可调用的 Ascend C API 必须严格参照官方文档确认。

---

## 参考资料

### 通用调试
- [references/level-testing.md](references/level-testing.md) - Level 0~N 多级用例构建

### 精度调试（详见 /ascendc-precision-debug）
- 精度问题诊断、二分调试、常见陷阱等详见 `/ascendc-precision-debug` skill
