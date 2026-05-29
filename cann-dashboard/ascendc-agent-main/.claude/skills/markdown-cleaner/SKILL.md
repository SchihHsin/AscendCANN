---
name: markdown-cleaner
description: 清理 Markdown 文件中的冗余 HTML 内容。当用户需要清理文档中的 HTML 锚点、转换 HTML 表格为 Markdown 格式、移除术语标签等冗余 HTML 元素时使用。适用场景：(1) 清理 AscendC算子开发指南 等转换后的文档 (2) 批量处理 Markdown 文件中的 HTML 残留 (3) 文档格式标准化
---

# Markdown 文件清理器

清理 Markdown 文件中的冗余 HTML 内容，支持批量处理。

## 支持的清理功能

| 模式 | 示例 | 处理方式 |
|------|------|---------|
| `<a name="..."></a>` | `<a name="ZH-CN_TOPIC_xxx"></a>` | 完全移除 |
| HTML 表格 | `<table><tr><td>...</td></tr></table>` | 转换为 Markdown 表格 |
| `<term id="...">` | `<term id="xxx">Atlas 推理系列</term>` | 保留内容，移除标签 |
| `&nbsp;` | 空格实体 | 替换为空格 |
| HTML 属性 | `id="..."`, `class="..."`, `width="..."` | 移除 |
| `<b>`, `<i>`, `<strong>`, `<em>` | 格式标签 | 转换为 Markdown 格式 |
| `<br>`, `<hr>` | 换行和分隔线标签 | 转换为 Markdown 等效格式 |

## 使用方法

### 清理指定目录

```bash
# 清理 AscendC算子开发指南 目录下的所有 Markdown 文件
python .claude/skills/markdown-cleaner/scripts/clean_markdown.py --dir "AscendC算子开发指南/"
```

### 清理单个文件

```bash
python .claude/skills/markdown-cleaner/scripts/clean_markdown.py --file "test.md"
```

### 命令行参数

| 参数 | 说明 |
|------|------|
| `--dir`, `-d` | 指定要清理的目录路径 |
| `--file`, `-f` | 指定要清理的单个文件路径 |
| `--no-backup` | 不创建备份文件（默认创建 `.bak` 备份） |
| `--no-recursive` | 不递归处理子目录（默认递归） |

### 示例

```bash
# 不创建备份直接清理
python .claude/skills/markdown-cleaner/scripts/clean_markdown.py --dir "docs/" --no-backup

# 只处理当前目录（不递归）
python .claude/skills/markdown-cleaner/scripts/clean_markdown.py --dir "docs/" --no-recursive
```

## 清理流程

脚本按以下顺序执行清理：

1. **移除锚点标签** - `<a name="..."></a>`
2. **转换 HTML 表格** - 为标准 Markdown 表格格式
3. **移除术语标签** - `<term id="...">...</term>`
4. **移除段落和 span 的 id 属性**
5. **移除其他 HTML 标签** - `<b>`, `<i>`, `<br>` 等
6. **清理 HTML 实体** - `&nbsp;`, `&lt;`, `&gt;` 等
7. **移除 HTML 属性** - `style`, `class`, `id`, `width` 等
8. **清理多余空行** - 3个及以上连续换行替换为2个

## 输出示例

```
============================================================
Markdown 文件清理工具
============================================================

处理目录: AscendC算子开发指南/
递归: 是
备份: 是
------------------------------------------------------------

找到 50 个 Markdown 文件
  [完成] AscendC算子开发指南/01.md
  [跳过] AscendC算子开发指南/02.md (无需清理)
  [完成] AscendC算子开发指南/03.md
------------------------------------------------------------

处理完成!
  成功: 45
  失败: 0
  跳过: 5
```

## 注意事项

- 默认会创建 `.bak` 备份文件，清理后如有问题可恢复
- 使用 `--no-backup` 参数可跳过备份创建
- 清理后的文件会保留原有内容，仅移除冗余 HTML 元素
