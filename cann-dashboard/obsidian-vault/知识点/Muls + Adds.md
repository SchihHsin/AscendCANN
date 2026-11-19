---
type: concept
domain: 精度与性能
weight: 0
tags:
  - kg
  - numperf
---

# Muls + Adds

**精度与性能** · 原子实操

> 把 (x-mean)*rstd 拆成先乘后加两步计算。

**常见误区**：顺序写反会得到看似合理但完全不同的结果。

## 出现在
- [[搬 CUDA LayerNorm]] · 第 9 轮
