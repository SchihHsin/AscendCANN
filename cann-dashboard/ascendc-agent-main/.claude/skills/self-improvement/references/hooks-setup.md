# 钩子配置指南

为 AI 编码代理配置自动自我改进触发器。

## 概述

钩子通过在关键时刻注入提醒来启用主动学习捕获：
- **UserPromptSubmit**: 每次提示后提醒评估学习内容
- **PostToolUse (Bash)**: 命令失败时的错误检测

## Claude Code 配置

### 选项 1: 项目级配置

在项目根目录创建 `.claude/settings.json`：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "./skills/self-improvement/scripts/activator.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "./skills/self-improvement/scripts/error-detector.sh"
          }
        ]
      }
    ]
  }
}
```

### 选项 2: 用户级配置

添加到 `~/.claude/settings.json` 以全局激活：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/skills/self-improvement/scripts/activator.sh"
          }
        ]
      }
    ]
  }
}
```

### 精简配置（仅激活器）

为了降低开销，仅使用 UserPromptSubmit 钩子：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "./skills/self-improvement/scripts/activator.sh"
          }
        ]
      }
    ]
  }
}
```

## Codex CLI 配置

Codex 使用与 Claude Code 相同的钩子系统。创建 `.codex/settings.json`：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "./skills/self-improvement/scripts/activator.sh"
          }
        ]
      }
    ]
  }
}
```

## GitHub Copilot 配置

Copilot 不直接支持钩子。相反，在 `.github/copilot-instructions.md` 中添加指导：

```markdown
## 自我改进

完成涉及以下内容的任务后：
- 调试非显而易见的问题
- 发现变通方案
- 学习项目特定模式
- 解决意外错误

考虑使用自我改进技能的格式将学习内容记录到 `.learnings/`。

对于会使其他会话受益的高价值学习内容，考虑技能提取。
```

## 验证

### 测试激活器钩子

1. 启用钩子配置
2. 启动新的 Claude Code 会话
3. 发送任意提示
4. 验证在上下文中看到 `<self-improvement-reminder>`

### 测试错误检测器钩子

1. 为 Bash 启用 PostToolUse 钩子
2. 运行一个失败的命令：`ls /nonexistent/path`
3. 验证看到 `<error-detected>` 提醒

### 试运行提取脚本

```bash
./skills/self-improvement/scripts/extract-skill.sh test-skill --dry-run
```

预期输出显示将要创建的技能脚手架。

## 故障排除

### 钩子未触发

1. **检查脚本权限**: `chmod +x scripts/*.sh`
2. **验证路径**: 使用绝对路径或相对于项目根目录的路径
3. **检查设置位置**: 项目 vs 用户级设置
4. **重启会话**: 钩子在会话开始时加载

### 权限被拒绝

```bash
chmod +x ./skills/self-improvement/scripts/activator.sh
chmod +x ./skills/self-improvement/scripts/error-detector.sh
chmod +x ./skills/self-improvement/scripts/extract-skill.sh
```

### 脚本未找到

如果使用相对路径，确保你在正确的目录或使用绝对路径：

```json
{
  "command": "/absolute/path/to/skills/self-improvement/scripts/activator.sh"
}
```

### 开销过大

如果激活器感觉侵入性太强：

1. **使用精简配置**: 仅 UserPromptSubmit，跳过 PostToolUse
2. **添加匹配器过滤器**: 仅对特定提示触发：

```json
{
  "matcher": "fix|debug|error|issue",
  "hooks": [...]
}
```

## 钩子输出预算

激活器设计为轻量级：
- **目标**: 每次激活约 50-100 token
- **内容**: 结构化提醒，非冗长指令
- **格式**: XML 标签便于解析

如果需要进一步降低开销，可以编辑 `activator.sh` 输出更少文本。

## 安全考虑

- 钩子脚本以与 Claude Code 相同的权限运行
- 脚本仅输出文本；不修改文件或运行命令
- 错误检测器读取 `CLAUDE_TOOL_OUTPUT` 环境变量
- 所有脚本都是可选的（你必须明确配置它们）

## 禁用钩子

临时禁用而不删除配置：

1. **在设置中注释掉**:
```json
{
  "hooks": {
    // "UserPromptSubmit": [...]
  }
}
```

2. **或删除设置文件**: 没有配置钩子不会运行
