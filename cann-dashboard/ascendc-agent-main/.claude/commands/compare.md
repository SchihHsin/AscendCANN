---
description: 使用[对比分析 agent](../agents/comparator.md) 对比两份评估报告，量化 Ascend C 文档改进的效果
---

## 使用方法

```bash
/compare --before [改进前的评估报告] --after [改进后的评估报告]
```

或者

```bash
/compare [算子名称]
```

## 功能说明

此命令启动对比分析 agent，通过对比改进前后的两份评估报告，分析文档改进是否真正降低了开发复杂度。

对比 agent 会完成：
- 量化开发效率的变化（评分、交互轮次、耗时等）
- 追踪问题的解决状态
- 评估具体改进措施的有效性
- 给出总体改进效果等级（A/B/C/D/F）

## 使用示例

```bash
# 对比指定的两份评估报告
/compare --before logs/20251223_193304_sinh-evaluation.md --after logs/20251225_120000_sinh_v2-evaluation.md

# 对比指定算子的最新前后报告（自动查找）
/compare sinh

# 使用通配符对比
/compare --before logs/20251223_*-evaluation.md --after logs/20251225_*-evaluation.md
```

## 参数说明

| 参数 | 说明 |
|------|------|
| `--before` | 改进前的评估报告（基线） |
| `--after` | 改进后的评估报告（对比对象） |
| `算子名称` | 算子名称，会自动在 `logs/` 目录查找最新的前后报告 |

报告保存路径：`logs/[原始日志名]-comparison.md`
