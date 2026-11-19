---
type: concept
domain: 精度与性能
weight: 2
tags:
  - kg
  - numperf
---

# 减 max

**精度与性能** · 关键机制

> 先找 max、减掉、再 exp；既防溢出，也保住有效位。

**常见误区**：顺序反了，减掉的是 exp 之后的最大值，已经不是 softmax。

## 出现在
- [[Softmax 精度差一点]] · 第 1 轮
- [[Softmax 精度差一点]] · 第 4 轮
- [[Softmax 精度差一点]] · 第 5 轮
- [[Softmax 精度差一点]] · 第 9 轮
- [[Softmax 精度差一点]] · 第 11 轮

## 相关概念
- [[fp32 累加]]
