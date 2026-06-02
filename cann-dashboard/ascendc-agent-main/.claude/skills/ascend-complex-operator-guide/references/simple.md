# 简单算子文档参考

## 判断依据

单步计算，如：
- 基础运算：Add（加）、Sub（减）、Mul（乘）、Div（除）
- 三角函数：Sin、Cos、Tan 等
- 指数对数：Exp、Log、Pow 等
- 其他单步操作：Abs、Sqrt、Floor、Ceil 等

---

## 必读文档路径

### 本地资源（优先查阅）

**官方示例**：
```
asc-devkit/examples/00_introduction/01_add/
├── basic_api_tque_add/                    # 使用 TQue 的基础实现
└── basic_api_memory_allocator_add/        # 使用 LocalMemAllocator 的高性能模板（推荐）
```

**API 文档**：
```
asc-devkit/docs/api/context/基础API/矢量计算/
├── Add/   - 加法 API
├── Sub/   - 减法 API
├── Mul/   - 乘法 API
├── Div/   - 除法 API
├── Exp/   - 指数 API
├── Log/   - 对数 API
├── Pow/   - 幂运算 API
├── Sin/   - 正弦 API
├── Cos/   - 余弦 API
└── ...    - 其他矢量 API
```

**编程指南**：
```
Ascend C算子开发指南/02-编程指南/C++类库API/基础API/
├── 矢量计算/          - 矢量 API 使用方法
└── 常用操作速查指导/  - 快速参考
```

---

## 核心概念

### LocalMemAllocator（推荐）
```cpp
AscendC::LocalMemAllocator<AscendC::Hardware::UB> allocator;
```

### 常用矢量API
- `Add`、`Sub`、`Mul`、`Div` - 基础运算
- `Exp`、`Log`、`Pow`、`Sqrt` - 数学函数
- `Sin`、`Cos`、`Tan` - 三角函数
- `Abs`、`Floor`、`Ceil` - 其他操作

### 基础编程流程
1. 定义 Kernel 类
2. 实现 Process 方法
3. 使用 `<<<>>>` 语法调用
4. 编写 main 函数

---

## 实现要点

- ✅ 使用矢量 API，禁止逐元素操作
- ✅ 数据量 < 8K 时无需 Tiling
- ✅ 一般无需 DoubleBuffer
- ✅ 参考官方示例代码结构

---

## 常见问题

**Q：需要 Tiling 吗？**
A：数据量 < 8K 元素时不需要。

**Q：需要 DoubleBuffer 吗？**
A：一般不需要，除非对性能有特殊要求。
