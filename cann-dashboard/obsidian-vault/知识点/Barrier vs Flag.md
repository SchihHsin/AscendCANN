---
type: concept
domain: 并发与同步
weight: 1
tags:
  - kg
  - sync
---

# Barrier vs Flag

**并发与同步** · 常规细节

> 同一 pipe 内用屏障，跨 pipe 用事件；前者正确但慢。

**常见误区**：调试期用 PIPE_ALL 求稳，优化期换成精确事件。

## 出现在
- [[存量 kernel 的 SetFlag]] · 第 5 轮
- [[存量 kernel 的 SetFlag]] · 第 6 轮

## 相关概念
- [[EnQue·DeQue]]
