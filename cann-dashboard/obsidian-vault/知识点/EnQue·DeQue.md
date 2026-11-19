---
type: concept
domain: 并发与同步
weight: 2
tags:
  - kg
  - sync
---

# EnQue/DeQue

**并发与同步** · 关键机制

> 在搬运与计算之间插一对 set/wait 事件，保证顺序。

**常见误区**：它同步的是事件，不是内存屏障，不保证 cache 一致。

## 出现在
- [[存量 kernel 的 SetFlag]] · 第 1 轮
- [[存量 kernel 的 SetFlag]] · 第 2 轮
- [[存量 kernel 的 SetFlag]] · 第 3 轮
- [[存量 kernel 的 SetFlag]] · 第 4 轮
- [[存量 kernel 的 SetFlag]] · 第 5 轮
- [[存量 kernel 的 SetFlag]] · 第 7 轮
- [[存量 kernel 的 SetFlag]] · 第 11 轮

## 相关概念
- [[TQue vs TBuf]]
- [[Barrier vs Flag]]
- [[eventId 资源]]
- [[队列深度双缓冲]]
