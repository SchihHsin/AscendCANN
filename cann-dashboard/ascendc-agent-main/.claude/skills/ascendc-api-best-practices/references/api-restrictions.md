# Ascend C API 使用限制与替代方案

> **重要**：使用任何 API 前必读，避免编译错误和运行时问题

---

## 1. 编译期限制

### 1.1 禁止使用 std::min/std::max

**原因**：Kernel 侧不推荐依赖 `<algorithm>` 头文件

**触发场景**：计算 Buffer 大小、阈值等

**错误示例**：
```cpp
#include <algorithm>

uint32_t result = std::min(a, b);  // ❌ 编译错误或性能问题
uint32_t result = std::max(a, b);
```

**正确替代**：使用三元操作符
```cpp
uint32_t result = (a < b) ? a : b;  // ✅ min
uint32_t result = (a > b) ? a : b;  // ✅ max

// 示例：计算阈值
uint32_t threshold = availableUB / (4 * typeSize);
threshold = (threshold < 12000u) ? threshold : 12000u;  // ✅
threshold = (threshold > 1u) ? threshold : 1u;          // ✅
```

### 1.2 禁止动态内存分配

**原因**：AI Core 无动态内存管理能力

**触发场景**：创建数组、缓冲区等

**错误示例**：
```cpp
std::vector<int> vec;       // ❌ 动态分配
int* ptr = new int[10];     // ❌ 动态分配
int* arr = malloc(100);     // ❌ 动态分配
```

**正确替代**：使用静态分配
```cpp
int arr[10];                          // ✅ 栈分配（Host 侧）
constexpr uint32_t SIZE = 1024;       // ✅ 编译期常量
pipe.InitBuffer(inQueue, 2, SIZE);    // ✅ UB 静态分配（Kernel 侧）
```

### 1.3 Host/Kernel 头文件隔离

**规则**：
- **Host 侧**（`.cpp`）：禁止包含 `kernel_operator.h`
- **Kernel 侧**（`.asc/.h`）：可包含 `kernel_operator.h`

**错误示例**：
```cpp
// host/tiling.cpp
#include "kernel_operator.h"  // ❌ Host 侧禁止
```

**正确用法**：
```cpp
// host/tiling.cpp
#include "tiling.h"  // ✅ 仅必要头文件
#include <cstring>

// kernel/operator.h
#include "kernel_operator.h"  // ✅ Kernel 侧允许
```

---

## 2. API 调用限制

### 2.1 Reduce API：dst ≠ tmpBuffer

**规则**：ReduceMax/ReduceSum 的 dst 和 tmpBuffer 必须是不同的 buffer

**触发场景**：任何归约操作

**错误示例**：
```cpp
// ❌ dst == tmpBuffer，编译或运行错误
ReduceMax<T>(buf, src, buf, count, false);
ReduceSum<T, true>(buf, src, buf, count);
```

**正确用法**：
```cpp
// ✅ dst 和 tmp 是不同 buffer
LocalTensor<T> dstLocal = dstBuf.Get<T>();
LocalTensor<T> tmpLocal = tmpBuf.Get<T>();
ReduceMax<T>(dstLocal, src, tmpLocal, count, false);
```

**推荐 Buffer 配置**：
```cpp
uint32_t scalarBufSize = 32;           // dst：存储 1 个标量
uint32_t tmpBufSize = ComputeTmpBufSize(...);  // tmp：临时 buffer

pipe.InitBuffer(scalarBuf, scalarBufSize);
pipe.InitBuffer(tmpBuf, tmpBufSize);
```

### 2.2 禁止使用低阶 Reduce API

**禁止列表**：
- `WholeReduce*`
- `BlockReduce*`
- `PairReduce*`
- `RepeatReduce*`

**替代方案**：使用高阶 Reduce API

| 场景 | 推荐接口 | 说明 |
|-----|---------|------|
| 逐行处理 | `ReduceMax<T>(dst, src, tmp, count)` | Level 2，无对齐要求 |
| 逐行求和 | `ReduceSum<T, true>(dst, src, tmp, count)` | Level 2，isSetMask=true |
| 跨行批量 | `ReduceMax<T, Pattern::AR>(dst, src, tmp, shape, isInit)` | Pattern 接口，需 32 字节对齐 |

---

## 3. 类型与常量规范

### 3.1 编译期常量

**规则**：Buffer 大小、循环次数等使用 `constexpr`

```cpp
// ✅ 正确：编译期常量
constexpr uint32_t BUFFER_NUM = 2;
constexpr uint32_t UB_SIZE = 192 * 1024;
constexpr uint32_t BLOCK_SIZE = 32;

// ❌ 不推荐：运行期常量
const uint32_t buffer_num = 2;  // 可能影响性能
```

### 3.2 类型转换

**规则**：显式类型转换，避免隐式精度损失

```cpp
// ✅ 正确：显式转换
T sumVal = scalarLocal.GetValue(0);
T invSumVal = (T)1.0 / sumVal;  // 显式转换为 T
Muls<T>(dst, src, invSumVal, count);

// ❌ 错误：隐式转换
float val = 1.0 / sumVal;  // 若 T 是 half，精度损失
```

---

## 4. 快速诊断清单

遇到编译错误时，检查：

- [ ] 是否使用了 `std::min/std::max` → 改用三元操作符
- [ ] 是否使用了动态内存（`std::vector`, `new`）→ 改用静态分配
- [ ] Host 侧是否包含了 `kernel_operator.h` → 移除该包含
- [ ] Reduce API 的 dst 和 tmp 是否是同一 buffer → 使用不同 buffer
- [ ] 是否使用了 WholeReduce 等低阶 API → 改用高阶 Reduce API
- [ ] 是否使用了 `const` 而非 `constexpr` → 改用 `constexpr`

---

## 5. 相关文档

- [api-scalar-operations.md](api-scalar-operations.md)：Adds/Muls 优化
- [api-reduce.md](api-reduce.md)：Reduce API 详细用法
- [api-buffer.md](api-buffer.md)：Buffer 管理最佳实践
