# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 概述

这是一个面向设计师的 AI 辅助设计工作区，基于 **Pixso**（类 Figma 设计工具）与 MCP（模型上下文协议）集成。

**核心目标**：通过 skill 生成符合设计规范、可在 Pixso 中直接编辑的设计稿。**本仓库不负责生成代码。**

## MCP 配置

- Pixso 桌面端 MCP 服务在本地运行于 `http://127.0.0.1:3667/mcp`（在 `.mcp.json` 中配置）
- 使用 `mcp__pixso-desktop__*` 工具与 Pixso 设计画布交互
- `local-mcp` 服务已为所有项目 MCP 服务启用

## 设计工作流

在 Pixso 中执行设计任务时，请按以下顺序操作：

1. **读取设计规范**：`get_variable_sets` → `get_variables(variableSetId)` → `get_local_styles`
2. **读取组件库**：`get_all_components` 列出可用的 Symbol 组件
3. **插入组件**：`create_instance(componentKey)`
4. **应用样式/Token**：`set_fill_style`、`set_text_style`、`set_stroke_style`、`set_bound_variables`
5. **验证**：`get_node_dsl(itemId)` 查看结构，`get_image(itemId)` 查看视觉预览

> 所有输出均为可在 Pixso 中编辑的设计稿，不输出任何代码文件。

## 目录结构

| 目录 | 用途 |
|------|------|
| `opendesign skills/assets/` | 各组件设计规范文档（每组件一个 `.md`）及进度文件 `_skill-gen-status.md` |
| `opendesign skills/skill.md` | 主 skill 文件，定义完整 Pixso 设计工作流 |
| `scripts/` | 全局设计配置：`grid.json`（栅格）、`tokens.json`（设计 Token）、`component-keys.md`（组件 componentKey 索引） |

## 栅格系统（`scripts/grid.json`）

| 断点 | 列数 | 间距 | 边距 |
|---|---|---|---|
| PC（1920px） | 24 | 32vp | 64px |
| 移动端（360px） | 4 | 12vp | 24px |

## 节点 ID

- 格式：`"数字:数字"`（如 `"123:456"`）
- 从 Pixso URL 中提取：`?item-id=1:2` → itemId 为 `1:2`
- 若未提供 itemId，工具将对当前选中的画布节点进行操作

## 设计技能

`/design-skill` 技能（`.claude/skills/skill.md`）编排完整的 Pixso 设计工作流。如需创建 UI 组件或应用设计规范，请调用此技能。
