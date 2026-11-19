---
type: concept
domain: 并发与同步
weight: 0
tags:
  - kg
  - sync
---

# PIPE_ALL

**并发与同步** · 原子实操

> 同核内所有流水的顺序屏障。

**常见误区**：正确但慢，优化时换成精确事件。

## 出现在
- [[存量 kernel 的 SetFlag]] · 第 6 轮
