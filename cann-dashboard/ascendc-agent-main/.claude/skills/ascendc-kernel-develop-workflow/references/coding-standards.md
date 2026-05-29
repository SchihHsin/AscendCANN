# Ascend C 编码规范详解

## 目录结构要求

### ⚠️ 核心规则

**所有算子相关文件必须放在 `ops/{算子名}/` 目录下**，禁止在 `ops/` 根目录直接放置任何文件或目录。

### 每个算子目录应包含

- **`.asc` 文件**（必需）：完整的算子实现
  - 使用 `class KernelXXX` 定义 kernel 类
  - 使用 `__global__ __aicore__` 定义 kernel 入口函数
  - 使用 `<<<>>>` 语法直接调用 kernel
  - 使用 `AscendC::LocalMemAllocator<AscendC::Hardware::UB>` 简化内存管理
  - 包含 Host 侧调用函数和 main 函数

- **`CMakeLists.txt`**（必需）：标准化的 CMake 配置

- **`README.md`**（必需）：算子文档

- **`data_utils.h`**（可选，推荐）：数据读写工具函数

- **`scripts/` 目录**（可选）：辅助脚本
  - `gen_data.py`：生成测试数据
  - `verify_result.py`：验证结果

- **`input/` 目录**（可选）：测试输入数据文件

- **`output/` 目录**（可选）：测试输出数据文件

### 正确 vs 错误的目录结构

✅ **正确**：
```
ops/
├── abs/
│   ├── abs.asc
│   ├── CMakeLists.txt
│   ├── input/      # abs 算子的输入数据
│   └── output/     # abs 算子的输出数据
└── add/
    ├── add.asc
    └── input/      # add 算子的输入数据
```

❌ **错误**：
```
ops/
├── input/          # 错误！不能在根目录
├── output/         # 错误！
├── abs.asc         # 错误！文件不能在根目录
└── CMakeLists.txt  # 错误！
```

---

## 三条黄金法则

### 1. 理解官方示例原理后实现

- 代码结构：Kernel 函数定义 → KernelCall 函数 → main 函数
- **禁止使用前向声明**：Kernel 入口函数必须定义在调用之前
- 遵循官方命名规范：`{功能}_custom`（如 `add_custom`、`sub_custom`）
- 理解双缓冲、事件同步等优化原理后自行实现

### 2. 硬件适配性法则 ⚠️

> **⭐ CRITICAL：违反此法则 = 审查不通过**

- ❌ **禁止**：写死核数、UB大小、TILE_LENGTH 等硬件相关参数
- ✅ **必须**：动态获取硬件资源（AI Core 数量、UB 容量）
- ✅ **必须**：Tiling 切分大小基于实际 UB 容量计算

**错误示例**：
```cpp
uint32_t blockDim = 8;  // ❌ 写死核数
constexpr uint32_t TILE_LENGTH = 4096;  // ❌ 写死分块大小
```

**正确示例**：
```cpp
// Kernel 内部获取启动的块数（官方推荐）
uint32_t blockDim = AscendC::GetBlockNum();

// Host 侧获取核数（用于 tiling 配置）
auto platform = platform_ascendc::PlatformAscendCManager::GetInstance();
uint32_t blockDim = platform->GetCoreNum();

// TILE_LENGTH 基于实际 UB 容量计算
uint32_t tileLength = CalculateTileSize(ubSize);  // ✅
```

**注意**：
- `AscendC::GetBlockNum()` 在 **Kernel 代码内部**调用
- `PlatformAscendCManager::GetCoreNum()` 在 **Host 侧**调用

**自检正则模式**（编码前必须检查）：
```bash
# 检查是否写死硬件参数
grep -E "blockDim\s*=\s*[0-9]" *.asc  # 应无匹配
grep -E "blockIdx\s*=\s*[0-9]" *.asc  # 应无匹配
grep -E "GetBlockNum|GetBlockIdx" *.asc  # 应有匹配
```

### 3. 遇问题处理流程

- 第一步：调用 `/ascend-complex-operator-guide`
- 第二步：查阅本地文档和示例
- 第三步：定位问题后修复，禁止简化代码或推翻重写
- 第四步：完成功能即可

---

## 常见开发错误

| 错误类型 | 根本原因 | 解决方法 |
|---------|---------|---------|
| `ambiguous` 调用错误 | Kernel 函数定义顺序错误 | 先定义后调用，不用前向声明 |
| 命名冲突 | 使用了标准库函数名 | 改用其他名称 |
| 编译失败 | 不满足对齐要求 | 检查 32/64/512 字节对齐规范 |
| 精度错误 | 数据类型不匹配 | 确认 API 支持的类型列表 |
| **全局聚合错误** | **分段独立计算** | **设计多遍遍历方案** |
| **硬件参数写死** | **使用固定值** | **动态获取硬件参数** |

---

## NPU 硬件特点

| 层次 | 名称 | 容量 | 带宽 | 用途 |
|-----|------|------|------|------|
| L3 | GM (Global Memory) | 大（GB级） | 低 | 存储输入输出数据 |
| L2 | UB (Unified Buffer) | 中（MB级） | 高 | 计算时数据缓存 |
| L1 | Local Memory | 小（KB级） | 极高 | 单核计算数据 |

### 关键要点

- **必须使用基础矢量 API**：`Add`、`Mul`、`Exp`、`ReduceSum`、`Div`、`Sub`、`Max` 等
- **禁止使用高阶封装 API**：`Softmax`、`LayerNorm`、`BatchNorm` 等算子级封装
- **必须实现 Tiling**：大数据必须分块处理
- **必须实现双缓冲**：使用 Ping-Pong 缓冲区实现流水线并行
- **必须实现事件同步**：使用 `SetFlag/WaitFlag` 控制依赖关系

### 全局聚合操作特殊处理

对于 `ReduceMax`、`ReduceSum`、`ReduceAny`、`ReduceAll` 等：

| 操作类型 | ❌ 错误做法 | ✅ 正确做法 |
|---------|-----------|-----------|
| 每行全局聚合 | 分段独立计算 | 跨段计算全局结果 |

**判断标准**：公式中有 Σ 或 max/min 覆盖整行/整列

**解决方案**：设计多遍遍历
1. 第一遍：计算全局聚合值（如 sum、max）
2. 第二遍：使用全局聚合值进行归一化或其他计算
