# Ascend C 示例代码索引

| 示例名称 | 路径 | 用途 |
|---------|------|------|
| 高性能模板 | `asc-devkit/examples/00_introduction/01_add/basic_api_memory_allocator_add/` | 双缓冲+流水线并行完整示例 |
| 减法算子 | `asc-devkit/examples/00_introduction/04_simple_operator/sub/` | 减法算子实现参考 |
| 调试打印 | `asc-devkit/examples/01_utilities/00_printf/printf.asc` | printf 调试方法 |
| 断言使用 | `asc-devkit/examples/01_utilities/01_assert/assert.asc` | 断言使用方法 |
| 库函数 | `asc-devkit/examples/03_libraries/00_math/addcdiv/` | 数学库函数使用 |
| 矢量计算 | `asc-devkit/examples/02_features/04_micro_api/vector_add/` | 矢量 API 使用 |

## 高性能模板详解

路径：`asc-devkit/examples/00_introduction/01_add/basic_api_memory_allocator_add/`

**包含技术**：
- 双缓冲（Ping-Pong Buffer）
- 流水线并行
- 事件同步（SetFlag/WaitFlag）
- LocalMemAllocator 内存管理

**何时参考此模板**：
- 需要高性能实现的算子
- 大数据处理场景
- 需要优化内存访问模式
