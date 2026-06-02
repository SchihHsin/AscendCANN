---
name: find-skills
description: 帮助用户发现和安装 agent 技能。当用户问"如何做 X"、"查找 X 的技能"、"是否有技能可以..."，或表示希望扩展功能时使用此技能。当用户正在寻找可能作为可安装技能存在的功能时，应使用此技能。
---

# 查找技能

此技能帮助你从开放的 agent 技能生态系统中发现和安装技能。

## 何时使用此技能

当用户出现以下情况时使用此技能：

- 问"如何做 X"，其中 X 可能是已有技能支持的常见任务
- 说"查找 X 的技能"或"是否有 X 的技能"
- 问"你能做 X 吗"，其中 X 是专业能力
- 表示希望扩展 agent 功能
- 想要搜索工具、模板或工作流程
- 提到希望在特定领域（设计、测试、部署等）获得帮助

## 什么是 Skills CLI？

Skills CLI（`npx skills`）是开放 agent 技能生态系统的包管理器。技能是模块化的包，通过专业知识、工作流程和工具扩展 agent 能力。

**主要命令：**

- `npx skills find [query]` - 交互式搜索或按关键词搜索技能
- `npx skills add <package>` - 从 GitHub 或其他来源安装技能
- `npx skills check` - 检查技能更新
- `npx skills update` - 更新所有已安装的技能

**浏览技能：** https://skills.sh/

## 如何帮助用户查找技能

### 第一步：理解用户需求

当用户寻求帮助时，需要识别：

1. 领域（如 React、测试、设计、部署）
2. 具体任务（如编写测试、创建动画、审查 PR）
3. 这是否是足够常见的任务，可能已有相关技能存在

### 第二步：搜索技能

使用相关查询运行 find 命令：

```bash
npx skills find [query]
```

例如：

- 用户问"如何让我的 React 应用更快？" → `npx skills find react performance`
- 用户问"能帮我做 PR 审查吗？" → `npx skills find pr review`
- 用户问"我需要创建变更日志" → `npx skills find changelog`

命令将返回类似以下的结果：

```
Install with npx skills add <owner/repo@skill>

vercel-labs/agent-skills@vercel-react-best-practices
└ https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### 第三步：向用户展示选项

当找到相关技能时，向用户展示：

1. 技能名称及其功能
2. 用户可以运行的安装命令
3. skills.sh 上的了解更多链接

示例回复：

```
我找到了一个可能有帮助的技能！"vercel-react-best-practices" 技能提供
来自 Vercel 工程团队的 React 和 Next.js 性能优化指南。

安装命令：
npx skills add vercel-labs/agent-skills@vercel-react-best-practices

了解更多：https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### 第四步：提供安装帮助

如果用户想要继续，你可以帮助他们安装技能：

```bash
npx skills add <owner/repo@skill> -g -y
```

`-g` 标志表示全局安装（用户级别），`-y` 跳过确认提示。

## 常见技能类别

搜索时，考虑以下常见类别：

| 类别          | 示例查询                                  |
| ------------- | ----------------------------------------- |
| Web 开发      | react, nextjs, typescript, css, tailwind  |
| 测试          | testing, jest, playwright, e2e            |
| DevOps        | deploy, docker, kubernetes, ci-cd         |
| 文档          | docs, readme, changelog, api-docs         |
| 代码质量      | review, lint, refactor, best-practices    |
| 设计          | ui, ux, design-system, accessibility      |
| 生产力        | workflow, automation, git                 |

## 有效搜索技巧

1. **使用具体关键词**："react testing" 比仅用 "testing" 更好
2. **尝试替代术语**：如果 "deploy" 没有结果，尝试 "deployment" 或 "ci-cd"
3. **查看热门来源**：许多技能来自 `vercel-labs/agent-skills` 或 `ComposioHQ/awesome-claude-skills`

## 未找到技能时

如果没有找到相关技能：

1. 告知用户未找到现有技能
2. 提供使用通用能力直接帮助完成任务
3. 建议用户可以使用 `npx skills init` 创建自己的技能

示例：

```
我搜索了与 "xyz" 相关的技能，但没有找到匹配项。
我仍然可以直接帮你完成这个任务！需要我继续吗？

如果这是你经常做的事情，可以创建自己的技能：
npx skills init my-xyz-skill
```
