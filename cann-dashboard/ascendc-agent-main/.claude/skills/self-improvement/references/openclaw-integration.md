# OpenClaw 集成

自我改进技能与 OpenClaw 集成的完整设置和使用指南。

## 概述

OpenClaw 使用基于工作区的提示注入结合事件驱动钩子。上下文在会话开始时从工作区文件注入，钩子可以在生命周期事件上触发。

## 工作区结构

```
~/.openclaw/
├── workspace/                   # 工作目录
│   ├── AGENTS.md               # 多代理协调模式
│   ├── SOUL.md                 # 行为准则和个性
│   ├── TOOLS.md                # 工具能力和陷阱
│   ├── MEMORY.md               # 长期记忆（仅主会话）
│   └── memory/                 # 每日记忆文件
│       └── YYYY-MM-DD.md
├── skills/                      # 已安装的技能
│   └── <skill-name>/
│       └── SKILL.md
└── hooks/                       # 自定义钩子
    └── <hook-name>/
        ├── HOOK.md
        └── handler.ts
```

## 快速设置

### 1. 安装技能

```bash
clawdhub install self-improving-agent
```

或手动复制：

```bash
cp -r self-improving-agent ~/.openclaw/skills/
```

### 2. 安装钩子（可选）

将钩子复制到 OpenClaw 的钩子目录：

```bash
cp -r hooks/openclaw ~/.openclaw/hooks/self-improvement
```

启用钩子：

```bash
openclaw hooks enable self-improvement
```

### 3. 创建学习文件

在工作区创建 `.learnings/` 目录：

```bash
mkdir -p ~/.openclaw/workspace/.learnings
```

或在技能目录中：

```bash
mkdir -p ~/.openclaw/skills/self-improving-agent/.learnings
```

## 注入的提示文件

### AGENTS.md

用途：多代理工作流和委托模式。

```markdown
# 代理协调

## 委托规则
- 使用 explore 代理处理开放式代码库问题
- 为长时间运行的任务生成子代理
- 使用 sessions_send 进行跨会话通信

## 会话交接
当委托给另一个会话时：
1. 在交接消息中提供完整上下文
2. 包含相关文件路径
3. 指定预期的输出格式
```

### SOUL.md

用途：行为准则和沟通风格。

```markdown
# 行为准则

## 沟通风格
- 直接且简洁
- 避免不必要的警告和免责声明
- 使用适合上下文的技术语言

## 错误处理
- 及时承认错误
- 立即提供纠正信息
- 将重大错误记录到学习内容
```

### TOOLS.md

用途：工具能力、集成陷阱、本地配置。

```markdown
# 工具知识

## 自我改进技能
将学习内容记录到 `.learnings/` 以持续改进。

## 本地工具
- 在此处记录工具特定的陷阱
- 记录认证要求
- 跟踪集成问题
```

## 学习工作流

### 捕获学习内容

1. **会话内**: 像往常一样记录到 `.learnings/`
2. **跨会话**: 提升到工作区文件

### 提升决策树

```
学习内容是否是项目特定的？
├── 是 → 保留在 .learnings/
└── 否 → 是否与行为/风格相关？
    ├── 是 → 提升到 SOUL.md
    └── 否 → 是否与工具相关？
        ├── 是 → 提升到 TOOLS.md
        └── 否 → 提升到 AGENTS.md（工作流）
```

### 提升格式示例

**从学习内容：**
> 没有配置认证时 Git push 到 GitHub 失败 - 触发桌面提示

**到 TOOLS.md：**
```markdown
## Git
- 不要在未确认已配置认证的情况下推送
- 使用 `gh auth status` 检查 GitHub CLI 认证
```

## 代理间通信

OpenClaw 提供跨会话通信工具：

### sessions_list

查看活跃和最近的会话：
```
sessions_list(activeMinutes=30, messageLimit=3)
```

### sessions_history

读取另一个会话的记录：
```
sessions_history(sessionKey="session-id", limit=50)
```

### sessions_send

向另一个会话发送消息：
```
sessions_send(sessionKey="session-id", message="学习: API 需要 X-Custom-Header")
```

### sessions_spawn

生成后台子代理：
```
sessions_spawn(task="研究 X 并回报", label="research")
```

## 可用的钩子事件

| 事件 | 触发时机 |
|------|----------|
| `agent:bootstrap` | 工作区文件注入前 |
| `command:new` | 发出 `/new` 命令时 |
| `command:reset` | 发出 `/reset` 命令时 |
| `command:stop` | 发出 `/stop` 命令时 |
| `gateway:startup` | 网关启动时 |

## 检测触发器

### 标准触发器
- 用户纠正（"不对..."）
- 命令失败（非零退出码）
- API 错误
- 知识盲点

### OpenClaw 特定触发器

| 触发器 | 操作 |
|--------|------|
| 工具调用错误 | 记录到 TOOLS.md 并包含工具名称 |
| 会话交接混乱 | 记录到 AGENTS.md 并包含委托模式 |
| 模型行为意外 | 记录到 SOUL.md 并包含预期与实际 |
| 技能问题 | 记录到 .learnings/ 或报告上游 |

## 验证

检查钩子是否已注册：

```bash
openclaw hooks list
```

检查技能是否已加载：

```bash
openclaw status
```

## 故障排除

### 钩子未触发

1. 确保配置中已启用钩子
2. 配置更改后重启网关
3. 检查网关日志中的错误

### 学习内容未持久化

1. 验证 `.learnings/` 目录存在
2. 检查文件权限
3. 确保工作区路径配置正确

### 技能未加载

1. 检查技能是否在技能目录中
2. 验证 SKILL.md 有正确的前言
3. 运行 `openclaw status` 查看已加载的技能
