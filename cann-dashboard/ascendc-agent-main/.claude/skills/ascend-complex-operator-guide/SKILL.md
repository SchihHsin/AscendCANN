---
name: ascend-complex-operator-guide
description: 为所有 Ascend C 算子开发提供算子类型到所需文档概念的统一导航。覆盖简单算子、融合算子、矩阵运算、性能敏感算子、复杂模式算子，包含文档路径、核心概念、优化技术决策。
---

# Ascend C 算子开发导航指南

## 快速开始

### 第一步：确定算子类型

根据算子特征确定类型：

| 类型 | 判断依据 | 核心概念 |
|------|----------|----------|
| **0 简单算子** | 单步计算（Add/Sub/Mul/Exp/Sin等） | LocalMemAllocator、矢量API |
| **1 融合算子** | 多个连续计算步骤 | SIMD编程、流水线设计 |
| **2 矩阵运算** | Matmul/BatchMatmul | Matmul高阶API、Cube单元 |
| **3 性能敏感算子** | 数据量>8K或需优化 | DoubleBuffer、Tiling、流水线 |
| **4 复杂模式算子** | Softmax/LayerNorm/FlashAttention | 全局聚合、归一化原理 |

### 第二步：查阅对应文档

**简单算子**：参见 [简单算子文档](references/simple.md)

**融合算子**：参见 [融合算子文档](references/fusion.md)

**矩阵运算**：参见 [矩阵运算文档](references/matrix.md)

**性能敏感算子**：参见 [性能优化文档](references/performance.md)

**复杂模式算子**：参见 [复杂模式算子文档](references/complex.md)

### 第三步：本地资源不足时

使用 `ascend-docs-search` 技能搜索华为昇腾官方文档。

---

## 核心概念速查

### LocalMemAllocator（推荐）
```cpp
AscendC::LocalMemAllocator<AscendC::Hardware::UB> allocator;
```

### 常用矢量API
- `Add`、`Sub`、`Mul`、`Div` - 基础运算
- `Exp`、`Log`、`Pow` - 指数对数
- `Sin`、`Cos`、`Tan` - 三角函数

### 基础编程流程
1. 定义 Kernel 类
2. 实现 Process 方法
3. 使用 `<<<>>>` 语法调用
4. 编写 main 函数

---

## 优化技术决策树

```
数据量 < 8K 元素？
├── Yes → 基础实现即可
└── No → 需要优化
    ├── SIMD 矢量计算（必须）
    ├── Tiling 分块（必须）
    └── 性能要求高？
        ├── Yes → DoubleBuffer + 流水线
        └── No → SIMD + Tiling
```

---

## 全局聚合操作警告 ⚠️

对于包含 `Σ` 或 `max/min` 覆盖整行/整列的算子（如 Softmax、LayerNorm）：

**❌ 错误**：分段独立计算
**✅ 正确**：跨段计算全局结果

需要多遍遍历：先算全局 Max/Sum，再归一化。

详见 [复杂模式算子文档](references/complex.md)。

---

## 文档路径说明

**本地文档根目录**：
- `Ascend C算子开发指南/` - 编程指南、API参考、算子实践
- `asc-devkit/` - 官方示例代码

**快速定位**：
```bash
find . -type d -name "asc-devkit" 2>/dev/null
find . -type d -name "*算子开发指南*" 2>/dev/null
```

---

## 常见问题

**Q：简单算子需要 Tiling 吗？**
A：数据量 < 8K 元素时不需要。

**Q：简单算子需要 DoubleBuffer 吗？**
A：一般不需要，除非对性能有特殊要求。

**Q：如何判断是否需要全局聚合？**
A：如果算子公式中有 Σ 或 max/min 覆盖整行/整列。
