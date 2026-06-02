# 矩阵运算文档参考

## 判断依据

算子涉及**矩阵乘法**或批量矩阵运算

---

## 必读文档路径

### API 文档（首选）

**高阶API - 矩阵计算**：
```
Ascend C算子开发指南/04-API参考/高阶API/矩阵计算/
├── Matmul高阶API完整接口文档    - 接口说明
├── 数据类型和约束说明           - 类型支持
└── 使用示例                    - 代码示例
```

**Kernel 侧接口**：
```
Ascend C算子开发指南/04-API参考/高阶API/矩阵计算/Matmul Kernel侧接口/
├── Kernel侧调用接口            - 调用方法
└── 参数配置说明                - 参数说明
```

**Tiling 侧接口**：
```
Ascend C算子开发指南/04-API参考/高阶API/矩阵计算/Matmul Tiling侧接口/
├── Tiling参数配置             - Tiling 参数
└── 多核切分策略               - 切分策略
```

**特性场景**：
```
Ascend C算子开发指南/04-API参考/高阶API/矩阵计算/特性场景/
├── Batch-Matmul基础功能        - 批量矩阵乘
└── 多核非对齐切分              - 非对齐处理
```

---

## 算子实践参考

### Matmul 高阶 API

```
Ascend C算子开发指南/03-算子实践参考/SIMD算子实现/矩阵编程（高阶API）/
├── 基础知识/          - Matmul 核心概念
├── 算子实现/          - 完整实现流程
└── 特性场景/          - 特殊使用场景
```

### Matmul 基础 API

```
Ascend C算子开发指南/03-算子实践参考/SIMD算子实现/矩阵编程（基础API）/
├── 耦合模式/          - 基础API实现方式
└── 分离模式/          - 数据搬运与计算分离
```

### 性能调优

```
Ascend C算子开发指南/03-算子实践参考/优秀实践/Matmul性能调优案例/
├── Matmul性能优化策略总览           - 优化总览
├── Matmul高阶API使能多核切K        - K轴切分
├── Matmul高阶API使能L2-Cache切分   - L2切分
└── AIV核上的ND2NZ格式转换           - 格式转换
```

### BatchMatmul 优化

```
Ascend C算子开发指南/03-算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/
├── Batch-Matmul基础功能             - 批量功能
└── Batch-Matmul复用Bias矩阵        - Bias复用
```

### GroupedMatmul 优化

```
Ascend C算子开发指南/03-算子实践参考/优秀实践/GroupedMatmul算子性能调优案例/
├── GroupedMatmul特殊优化技巧         - 优化技巧
└── 多组矩阵乘的批量处理             - 批量处理
```

---

## 基础 API 矩阵运算

```
Ascend C算子开发指南/04-API参考/基础API/矩阵计算（ISASI）/
├── Cube分组管理接口                - 分组管理
└── 基础矩阵操作API                 - 基础操作

Ascend C算子开发指南/04-API参考/基础API/Cube分组管理（ISASI）/
├── CubeResGroupHandle              - 分组句柄
├── GroupBarrier                    - 组屏障
└── KfcWorkspace                    - 工作空间
```

---

## 核心概念

- **Matmul 高阶 API** - 完整接口和 Tiling 参数配置
- **Cube 单元** - AI Core 的矩阵计算单元
- **多核切分策略** - K 轴切分、M/N 轴切分
- **数据格式** - NZ 格式、ND2NZ 转换

---

## 实现要点

- ✅ 优先使用高阶 API
- ✅ 理解 Cube 单元工作原理
- ✅ 掌握多核切分策略
- ✅ 注意数据格式转换
- ✅ 参考官方性能调优案例
