---
name: ascendc-kernel-develop-workflow
description: Ascend C 算子开发完整工作流程。**所有直调算子开发必须首先调用此 skill**。覆盖从需求分析到文档编写的完整6阶段流程。当用户请求开发任何算子（如"开发一个X算子"）时自动触发。支持元素级、归约、归一化、矩阵运算等各类算子。
---

# Ascend C 算子开发工作流程

## ⚠️ 强制规则

1. **必须完成全部 6 个阶段**才能结束开发
2. **禁止中途停止** - 每个阶段完成后自动进入下一阶段
3. **阶段顺序**：方案设计 → 算子实现 → 构建测试 → 问题处理 → 结果总结 → 文档编写

---

## 工作流程概览

```
需求输入 → 阶段1:方案设计 → 阶段2:算子实现 → 阶段3:构建测试
                ↓                                    ↓
           docs/{算子}.md                      ops/{算子}/
                                                     ↓
           阶段4:问题处理(如需) → 阶段5:结果总结 → 阶段6:文档编写
                                                     ↓
                                               **开发完成**
```

---

## 协作 Skills 速查

| 调用时机 | Skill | 用途 |
|---------|-------|------|
| 阶段1 | `/ascend-complex-operator-guide` | 确定算子类型 |
| 阶段1 | `/ascendc-operator-kernel-design` | 详细设计指导 |
| 阶段1 | `/ascendc-npu-arch` | NPU架构信息 |
| 阶段1 | `/ascendc-planning` | 开发计划制定 |
| 阶段2 | `/ascendc-api-best-practices` | API最佳实践 |
| 阶段2 | `/ascendc-ut-direct` | **直调算子测试用例** ⭐ |
| 阶段2 | `/ascendc-ut-direct` | **直调算子测试用例** ⭐ |
| 阶段3前 | `/ascendc-env-check` | 环境检查 |
| 阶段3 | `/ascendc-docker` | Docker构建测试 |
| 阶段3 | `/ascendc-perf-analysis` | 性能分析（可选） |
| 编译/运行错误 | `/ascendc-debugging` | 通用调试 |
| 精度问题 | `/ascendc-precision-debug` | 精度调试 |

---

## 阶段 1：方案设计

### 步骤

1. **理解需求**：明确输入/输出、数学公式
2. **确定算子类型**：调用 `/ascend-complex-operator-guide`
3. **获取设计指导**：调用 `/ascendc-operator-kernel-design`
4. **查询架构信息**：调用 `/ascendc-npu-arch` 确定 `--npu-arch`
5. **制定开发计划**：调用 `/ascendc-planning`
6. **API可行性验证**：拆解公式为API组合

### 关键识别

**全局聚合操作**（需多遍遍历）：
- 判断：公式含 Σ 或 max/min 覆盖整行/整列
- 示例：Softmax、LayerNorm、BatchNorm
- 方案：第一遍计算全局统计量，第二遍使用

**精度敏感算子**：
- 累加类 → 使用 FP32 累加器
- exp/log → 设计数值稳定算法
- 归一化 → 中间值用 FP32

### 输出
- Plan 文档保存至 `docs/{算子名称}.md`

### ✓ 检查清单
- [ ] 数学公式明确
- [ ] 已确定算子类型
- [ ] 已获取详细设计指导
- [ ] 已拆解为API组合
- [ ] 已识别全局聚合操作
- [ ] 已评估精度需求

---

## 阶段 2：算子实现

### 目录结构

```
ops/{算子名}/
├── {算子名}.asc          # 算子实现（必需）
├── CMakeLists.txt        # 构建配置（必需）
├── README.md             # 文档（必需）
├── data_utils.h          # 数据工具（可选）
├── scripts/              # 脚本（可选）
│   ├── gen_data.py
│   └── verify_result.py
├── input/                # 测试数据
└── output/               # 输出数据
```

⚠️ **禁止在 `ops/` 根目录直接创建文件**

### 核心代码规范

#### 函数定义顺序（强制）
```cpp
// 1. Kernel 类
class KernelAdd { ... };

// 2. Kernel 入口（必须在调用前定义）
__global__ __aicore__ void add_custom(...) { ... }

// 3. Host 调用
extern "C" void add_custom_do(...) {
    add_custom<<<blockDim, l2ctrl>>>(...);
}
```
**❌ 禁止前向声明**

#### 硬件参数（强制动态获取）

| 项目 | ❌ 错误 | ✅ 正确 |
|-----|--------|--------|
| 核数 | `blockDim = 8` | `GetBlockNum()` (Kernel内) |
| 核索引 | `blockIdx = 0` | `GetBlockIdx()` |
| 分块 | `TILE = 4096` | 基于 UB 容量计算 |

**自检命令**：
```bash
grep -E "blockDim\s*=\s*[0-9]|blockIdx\s*=\s*[0-9]" *.asc  # 应无匹配
grep -E "GetBlockNum|GetBlockIdx" *.asc  # 应有匹配
```

#### API 使用规范
- ✅ **使用**：`Add`, `Mul`, `Exp`, `ReduceSum`, `Div`, `Sub`, `Max` 等基础API
- ❌ **禁止**：`Softmax`, `LayerNorm`, `BatchNorm` 等高阶封装

#### 精度编码
```cpp
// ✅ 正确：累加用 FP32
float sum_fp32 = 0.0f;  // 精度敏感：累加使用FP32
for (int i = 0; i < n; i++) {
    sum_fp32 += static_cast<float>(input[i]);
}
```

### 生成 UT 测试用例 ⭐

**调用 `/ascendc-ut-direct`** 生成直调算子测试：
- L0-L3 四级参数化测试
- dtype × shape 组合覆盖
- 精度验证（按 dtype 设置容差）

### ✓ 检查清单
- [ ] 目录结构正确
- [ ] Kernel 定义在调用前
- [ ] 硬件参数动态获取
- [ ] 使用基础矢量 API
- [ ] 精度敏感代码使用 FP32
- [ ] 已生成 UT 测试用例

---

## 阶段 3：构建和测试

### ⚠️ 第一步：调用 `/ascendc-docker`

了解 Docker 环境使用方式后再开始构建。

### Level 0~N 测试

| Level | 规模 | 目的 |
|-------|------|------|
| 0 | 8元素 | 验证基本逻辑 |
| 1 | 1K元素 | 验证正常功能 |
| 2 | 极值 | 边界条件 |
| 3 | 大数据 | Tiling正确性 |

**强制**：Level 0 通过后必须继续 Level 1-3

### 精度测试顺序

1. FP32 + 32字节对齐（rtol=1e-5）
2. FP16 + 32字节对齐（rtol=1e-3）
3. 非对齐场景
4. 边界值

### 构建命令
```bash
./env_setup.sh "cd ops/{算子}/build && cmake .. && make -j"
./env_setup.sh "cd ops/{算子}/build && ./{算子}"
```

### ✓ 检查清单
- [ ] 使用 Docker 环境构建
- [ ] Level 0-3 全部执行
- [ ] 精度测试按顺序完成
- [ ] 精度在容差范围内

---

## 阶段 4：问题处理

### 问题类型判断

```
遇到问题
├─ 编译失败 → /ascendc-debugging
├─ 运行崩溃 → /ascendc-debugging
└─ 精度不达标 → /ascendc-precision-debug
```

### 禁止行为
- ❌ 遇到错误就全部重写
- ❌ 不分析就简化代码
- ❌ 跳过问题继续开发

### 常见问题

| 问题 | 解决 |
|-----|------|
| `ambiguous` 调用 | 先定义后调用 |
| 对齐失败 | 检查32字节对齐 |
| 精度错误 | 使用FP32中间值 |
| 全局聚合错误 | 多遍遍历 |

---

## 阶段 5：结果总结

### 记录内容
- 编译运行状态
- 功能验证结果
- 精度测试结果（FP32/FP16）
- 性能验证结果
- 已知限制

### ✓ 检查清单
- [ ] 标注成功/失败
- [ ] 记录功能验证结果
- [ ] 记录精度测试结果
- [ ] 记录已知限制

---

## 阶段 6：文档编写

### README.md 内容
- 算子概述（功能、公式）
- 编译运行指南
- 测试结果说明
- 已知限制
- 精度说明
- 常见问题

### 更新 Plan
- 更新 `docs/{算子名称}.md`

---

## 参考资料

- **[编码规范详解](references/coding-standards.md)**：目录结构、黄金法则、常见错误
- **[示例代码索引](references/examples.md)**：官方示例路径
