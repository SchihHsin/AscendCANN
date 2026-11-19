---
type: concept
domain: 并发与同步
weight: 0
tags:
  - kg
  - sync
---

# VECIN 队列

**并发与同步** · 原子实操

> TQue<QuePosition::VECIN,2> 声明输入队列，深度 2 即双缓冲。

**常见误区**：深度 1 等于没有双缓冲。

## 出现在
- [[存量 kernel 的 SetFlag]] · 第 2 轮
