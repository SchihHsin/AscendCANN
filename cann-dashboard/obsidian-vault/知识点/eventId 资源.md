---
type: concept
domain: 并发与同步
weight: 1
tags:
  - kg
  - sync
---

# eventId 资源

**并发与同步** · 常规细节

> 硬件事件数量有限，框架内部也在用，撞了会互相“冒充”。

**常见误区**：症状是偶发读到旧数据，改一行无关代码就好或更差。

## 出现在
- [[存量 kernel 的 SetFlag]] · 第 7 轮

## 相关概念
- [[EnQue·DeQue]]
