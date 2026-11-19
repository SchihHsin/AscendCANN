---
type: concept
domain: 精度与性能
weight: 2
tags:
  - kg
  - numperf
---

# RoundMode

**精度与性能** · 关键机制

> fp32→fp16 用就近舍入，fp16→fp32 用 CAST_NONE。

**常见误区**：截断带来的偏差是系统性的，误差分布会明显偏一个方向。

## 出现在
- [[Softmax 精度差一点]] · 第 6 轮

## 相关概念
- [[dtype 选型]]
