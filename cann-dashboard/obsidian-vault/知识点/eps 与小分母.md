---
type: concept
domain: 精度与性能
weight: 1
tags:
  - kg
  - numperf
---

# eps 与小分母

**精度与性能** · 常规细节

> 相对误差在分母很小时被放大，用 max(sum, eps) 兜底。

**常见误区**：sum + eps 会引入系统性偏差，尤其 sum 本身很小时。

## 出现在
- [[Softmax 精度差一点]] · 第 11 轮

## 相关概念
- [[MARE·MERE]]
