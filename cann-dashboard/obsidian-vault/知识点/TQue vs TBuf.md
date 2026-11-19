---
type: concept
domain: 并发与同步
weight: 3
tags:
  - kg
  - sync
---

# TQue vs TBuf

**并发与同步** · 核心瓶颈

> TQue 带同步语义，TBuf 是裸内存，同步责任在你身上。

**常见误区**：名字都带 buffer，但一个管事件，一个什么都不管。

## 出现在
- [[API 到底分几层]] · 第 8 轮
- [[存量 kernel 的 SetFlag]] · 第 1 轮
- [[存量 kernel 的 SetFlag]] · 第 2 轮
- [[存量 kernel 的 SetFlag]] · 第 3 轮
- [[存量 kernel 的 SetFlag]] · 第 4 轮
- [[存量 kernel 的 SetFlag]] · 第 8 轮

## 相关概念
- [[EnQue·DeQue]]
- [[SyncAll 与槽位]]
- [[API 分层]]
- [[UB 生命周期]]
