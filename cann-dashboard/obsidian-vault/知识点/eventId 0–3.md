---
type: concept
domain: 并发与同步
weight: 0
tags:
  - kg
  - sync
---

# eventId 0–3

**并发与同步** · 原子实操

> 手写 SetFlag 时使用的硬件事件编号。

**常见误区**：与框架撞了会互相冒充，偶发读到旧数据。

## 出现在
- [[存量 kernel 的 SetFlag]] · 第 7 轮
