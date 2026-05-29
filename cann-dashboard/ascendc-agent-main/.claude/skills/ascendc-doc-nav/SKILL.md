---
name: ascendc-doc-nav
description: Ascend C 文档导航技能。高效定位和选择性读取 Ascend C 算子开发文档，减少 90%+ 上下文消耗。当需要以下操作时使用：(1) 查找特定 API 文档路径，(2) 了解文档结构和分类，(3) 需要特定章节内容而非完整文档，(4) 本地搜索文档索引。
---

# Ascend C 文档导航

## 核心功能

1. **文档快速定位** - 使用预生成索引避免 Grep 全文搜索
2. **文档大纲提取** - 用 Grep 获取标题结构（不读取内容）
3. **章节选择性读取** - 用 Read 的 offset/limit 参数只读需要的部分

## 工作流程

### 查找 API 文档

```
步骤 1: 检查下方"常用 API 快速索引"
    │
    ├─ 找到 → 直接使用路径
    │
    └─ 未找到 → 读取 references/doc-index-compact.json
                    │
                    └─ 仍需详细搜索 → 读取 references/doc-index.json
```

### 读取特定章节

1. Grep 获取章节位置：`grep -n "^#" "文档路径"`
2. 计算 offset 和 limit
3. Read 只读取目标章节

## 文档分类

| 分类 | 路径前缀 | 说明 |
|------|----------|------|
| vector | 04-API参考/基础API/矢量计算/ | 矢量计算 API |
| data_copy | 04-API参考/基础API/数据搬运/ | 数据搬运 API |
| resource | 04-API参考/基础API/资源管理/ | 资源管理 API |
| sync | 04-API参考/基础API/同步控制/ | 同步控制 API |
| high_level | 04-API参考/高阶API/ | 高阶 API |
| tutorial | 01-入门教程/ | 入门教程 |
| guide | 02-编程指南/ | 编程指南 |
| practice | 03-算子实践参考/ | 算子实践 |

## 常用 API 快速索引

| API | 文档路径 |
|-----|----------|
| Add | 04-API参考/基础API/矢量计算/基础算术/Add.md |
| Sub | 04-API参考/基础API/矢量计算/基础算术/Sub.md |
| Mul | 04-API参考/基础API/矢量计算/基础算术/Mul.md |
| Div | 04-API参考/基础API/矢量计算/基础算术/Div.md |
| Exp | 04-API参考/基础API/矢量计算/基础算术/Exp.md |
| ReduceSum | 04-API参考/基础API/矢量计算/归约计算/ReduceSum.md |
| ReduceMax | 04-API参考/基础API/矢量计算/归约计算/ReduceMax.md |
| Cast | 04-API参考/基础API/矢量计算/类型转换/Cast.md |
| DataCopy | 04-API参考/基础API/数据搬运/DataCopy/DataCopy简介.md |
| TPipe | 04-API参考/基础API/资源管理/Pipe和Que框架/TPipe/TPipe简介.md |
| TQue | 04-API参考/基础API/资源管理/Pipe和Que框架/TQue/TQue简介.md |
| LocalTensor | 04-API参考/基础数据结构/LocalTensor/LocalTensor简介.md |
| GlobalTensor | 04-API参考/基础数据结构/GlobalTensor/GlobalTensor简介.md |

> 更多 API 请查阅 `references/doc-index.json`

## 参考资源

- `references/doc-index.json` - 完整文档索引（API 名称 → 路径）
- `references/doc-index-compact.json` - 精简索引（常用 API）
- `scripts/build_index.py` - 索引重建脚本

## 预期收益

| 操作 | 传统方式 | 本 Skill |
|------|----------|----------|
| 查找 API | Grep 搜索 ~5K tokens | 索引查找 ~200 tokens |
| 读取用法 | 完整文档 ~8K tokens | 特定章节 ~1K tokens |
