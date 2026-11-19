---
type: concept
domain: 环境与部署
weight: 2
tags:
  - kg
  - env
---

# aclnn 两段式

**环境与部署** · 关键机制

> 先问 workspace 多大，再执行；workspace 由调用方分配。

**常见误区**：同 shape 可以复用，别每一步都 malloc/free。

## 出现在
- [[动态 shape 怎么支持]] · 第 2 轮
- [[动态 shape 怎么支持]] · 第 5 轮
- [[动态 shape 怎么支持]] · 第 6 轮
- [[动态 shape 怎么支持]] · 第 7 轮
- [[Python 里调不到]] · 第 2 轮
- [[Python 里调不到]] · 第 3 轮
- [[Python 里调不到]] · 第 6 轮
- [[Python 里调不到]] · 第 10 轮

## 相关概念
- [[OPP 安装路径]]
- [[dispatcher 注册]]
