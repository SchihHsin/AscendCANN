---
type: concept
domain: 架构与迁移
weight: 1
tags:
  - kg
  - arch
---

# CUDA 映射

**架构与迁移** · 常规细节

> 线程级并行换成“核 + 指令 lane”，shared memory 换成显式 UB。

**常见误区**：逐行翻译会得到一份能跑但很慢的代码。

## 出现在
- [[搬 CUDA LayerNorm]] · 第 1 轮
- [[搬 CUDA LayerNorm]] · 第 2 轮
- [[搬 CUDA LayerNorm]] · 第 4 轮
- [[搬 CUDA LayerNorm]] · 第 5 轮
- [[搬 CUDA LayerNorm]] · 第 8 轮

## 相关概念
- [[NHWC 与 stride]]
- [[UB 生命周期]]
