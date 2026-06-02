---
name: self-improvement
description: "捕获学习内容、错误和纠正信息以实现持续改进。使用场景：(1) 命令或操作意外失败时，(2) 用户纠正 Claude（'不对...'、'实际上是...'），(3) 用户请求不存在的功能，(4) 外部 API 或工具失败，(5) Claude 意识到知识过时或不正确，(6) 发现重复任务的更好方法。同时，在重要任务前应查看学习记录。"
---

# 自我改进技能

将学习内容和错误记录到 Markdown 文件中，实现持续改进。编码代理后续可以将这些内容处理为修复方案，重要的学习内容会被提升到项目记忆中。

## 快速参考

| 场景 | 操作 |
|------|------|
| 命令/操作失败 | 记录到 `.learnings/ERRORS.md` |
| 用户纠正你 | 记录到 `.learnings/LEARNINGS.md`，类别为 `correction` |
| 用户想要缺失的功能 | 记录到 `.learnings/FEATURE_REQUESTS.md` |
| API/外部工具失败 | 记录到 `.learnings/ERRORS.md`，包含集成详情 |
| 知识过时 | 记录到 `.learnings/LEARNINGS.md`，类别为 `knowledge_gap` |
| 发现更好的方法 | 记录到 `.learnings/LEARNINGS.md`，类别为 `best_practice` |
| 与现有条目相似 | 用 `**See Also**` 链接，考虑提高优先级 |
| 广泛适用的学习内容 | 提升到 `CLAUDE.md`、`AGENTS.md` 和/或 `.github/copilot-instructions.md` |
| 工作流改进 | 提升到 `AGENTS.md`（OpenClaw 工作区） |
| 工具陷阱 | 提升到 `TOOLS.md`（OpenClaw 工作区） |
| 行为模式 | 提升到 `SOUL.md`（OpenClaw 工作区） |

## OpenClaw 配置（推荐）

OpenClaw 是此技能的主要平台。它使用基于工作区的提示注入，自动加载技能。

### 安装

**通过 ClawdHub（推荐）：**
```bash
clawdhub install self-improving-agent
```

**手动安装：**
```bash
git clone https://github.com/peterskoett/self-improving-agent.git ~/.openclaw/skills/self-improving-agent
```

### 工作区结构

OpenClaw 将这些文件注入到每个会话中：

```
~/.openclaw/workspace/
├── AGENTS.md          # 多代理工作流，委托模式
├── SOUL.md            # 行为准则，个性，原则
├── TOOLS.md           # 工具能力，集成陷阱
├── MEMORY.md          # 长期记忆（仅主会话）
├── memory/            # 每日记忆文件
│   └── YYYY-MM-DD.md
└── .learnings/        # 此技能的日志文件
    ├── LEARNINGS.md
    ├── ERRORS.md
    └── FEATURE_REQUESTS.md
```

### 创建学习文件

```bash
mkdir -p ~/.openclaw/workspace/.learnings
```

然后创建日志文件（或从 `assets/` 复制）：
- `LEARNINGS.md` — 纠正、知识盲点、最佳实践
- `ERRORS.md` — 命令失败、异常
- `FEATURE_REQUESTS.md` — 用户请求的功能

### 提升目标

当学习内容被证明具有广泛适用性时，将其提升到工作区文件：

| 学习类型 | 提升到 | 示例 |
|----------|--------|------|
| 行为模式 | `SOUL.md` | "简洁明了，避免免责声明" |
| 工作流改进 | `AGENTS.md` | "为长时间任务生成子代理" |
| 工具陷阱 | `TOOLS.md` | "Git push 需要先配置认证" |

### 会话间通信

OpenClaw 提供跨会话共享学习内容的工具：

- **sessions_list** — 查看活跃/最近的会话
- **sessions_history** — 读取其他会话的记录
- **sessions_send** — 向其他会话发送学习内容
- **sessions_spawn** — 生成子代理进行后台工作

### 可选：启用钩子

在会话开始时自动提醒：

```bash
# 复制钩子到 OpenClaw 钩子目录
cp -r hooks/openclaw ~/.openclaw/hooks/self-improvement

# 启用它
openclaw hooks enable self-improvement
```

详见 `references/openclaw-integration.md`。

---

## 通用配置（其他代理）

对于 Claude Code、Codex、Copilot 或其他代理，在项目中创建 `.learnings/`：

```bash
mkdir -p .learnings
```

从 `assets/` 复制模板或创建带标题的文件。

## 日志格式

### 学习条目

追加到 `.learnings/LEARNINGS.md`：

```markdown
## [LRN-YYYYMMDD-XXX] 类别

**记录时间**: ISO-8601 时间戳
**优先级**: low | medium | high | critical
**状态**: pending
**领域**: frontend | backend | infra | tests | docs | config

### 摘要
一句话描述学到了什么

### 详情
完整上下文：发生了什么、哪里错了、正确的做法是什么

### 建议操作
具体的修复或改进措施

### 元数据
- 来源: conversation | error | user_feedback
- 相关文件: path/to/file.ext
- 标签: tag1, tag2
- 另见: LRN-20250110-001（如果与现有条目相关）

---
```

### 错误条目

追加到 `.learnings/ERRORS.md`：

```markdown
## [ERR-YYYYMMDD-XXX] skill_or_command_name

**记录时间**: ISO-8601 时间戳
**优先级**: high
**状态**: pending
**领域**: frontend | backend | infra | tests | docs | config

### 摘要
简要描述什么失败了

### 错误信息
```
实际的错误消息或输出
```

### 上下文
- 尝试的命令/操作
- 使用的输入或参数
- 相关的环境详情

### 建议修复
如果可识别，可能的解决方案

### 元数据
- 可复现: yes | no | unknown
- 相关文件: path/to/file.ext
- 另见: ERR-20250110-001（如果重复出现）

---
```

### 功能请求条目

追加到 `.learnings/FEATURE_REQUESTS.md`：

```markdown
## [FEAT-YYYYMMDD-XXX] capability_name

**记录时间**: ISO-8601 时间戳
**优先级**: medium
**状态**: pending
**领域**: frontend | backend | infra | tests | docs | config

### 请求的功能
用户想要做什么

### 用户上下文
为什么需要它、正在解决什么问题

### 复杂度估计
simple | medium | complex

### 建议实现
如何构建、可能扩展什么

### 元数据
- 频率: first_time | recurring
- 相关功能: existing_feature_name

---
```

## ID 生成

格式：`TYPE-YYYYMMDD-XXX`
- TYPE: `LRN`（学习）、`ERR`（错误）、`FEAT`（功能）
- YYYYMMDD: 当前日期
- XXX: 顺序号或随机 3 字符（如 `001`、`A7B`）

示例：`LRN-20250115-001`、`ERR-20250115-A3F`、`FEAT-20250115-002`

## 解决条目

当问题被修复时，更新条目：

1. 将 `**Status**: pending` 改为 `**Status**: resolved`
2. 在元数据后添加解决信息块：

```markdown
### 解决方案
- **解决时间**: 2025-01-16T09:00:00Z
- **提交/PR**: abc123 或 #42
- **备注**: 简要描述做了什么
```

其他状态值：
- `in_progress` - 正在处理中
- `wont_fix` - 决定不处理（在解决方案备注中说明原因）
- `promoted` - 提升到 CLAUDE.md、AGENTS.md 或 .github/copilot-instructions.md

## 提升到项目记忆

当学习内容具有广泛适用性（不是一次性修复）时，将其提升为永久的项目记忆。

### 何时提升

- 学习内容适用于多个文件/功能
- 任何贡献者（人类或 AI）都应该知道的知识
- 防止重复犯错
- 记录项目特定的约定

### 提升目标

| 目标 | 适合内容 |
|------|----------|
| `CLAUDE.md` | 项目事实、约定、所有 Claude 交互的陷阱 |
| `AGENTS.md` | 代理特定的工作流、工具使用模式、自动化规则 |
| `.github/copilot-instructions.md` | GitHub Copilot 的项目上下文和约定 |
| `SOUL.md` | 行为准则、沟通风格、原则（OpenClaw 工作区） |
| `TOOLS.md` | 工具能力、使用模式、集成陷阱（OpenClaw 工作区） |

### 如何提升

1. **提炼**学习内容为简洁的规则或事实
2. **添加**到目标文件的适当部分（如需要则创建文件）
3. **更新**原始条目：
   - 将 `**Status**: pending` 改为 `**Status**: promoted`
   - 添加 `**Promoted**: CLAUDE.md`、`AGENTS.md` 或 `.github/copilot-instructions.md`

### 提升示例

**学习内容**（详细）：
> 项目使用 pnpm workspaces。尝试 `npm install` 但失败了。
> 锁文件是 `pnpm-lock.yaml`。必须使用 `pnpm install`。

**在 CLAUDE.md 中**（简洁）：
```markdown
## 构建与依赖
- 包管理器: pnpm（不是 npm）- 使用 `pnpm install`
```

**学习内容**（详细）：
> 修改 API 端点时，必须重新生成 TypeScript 客户端。
> 忘记这一点会导致运行时类型不匹配。

**在 AGENTS.md 中**（可操作）：
```markdown
## API 变更后
1. 重新生成客户端: `pnpm run generate:api`
2. 检查类型错误: `pnpm tsc --noEmit`
```

## 重复模式检测

如果记录的内容与现有条目相似：

1. **先搜索**: `grep -r "keyword" .learnings/`
2. **链接条目**: 在元数据中添加 `**See Also**: ERR-20250110-001`
3. **提高优先级**如果问题持续出现
4. **考虑系统性修复**: 重复出现的问题通常表明：
   - 缺少文档（→ 提升到 CLAUDE.md 或 .github/copilot-instructions.md）
   - 缺少自动化（→ 添加到 AGENTS.md）
   - 架构问题（→ 创建技术债务工单）

## 定期审查

在自然的断点处审查 `.learnings/`：

### 何时审查
- 开始新的主要任务之前
- 完成功能之后
- 在有过往学习内容的领域工作时
- 活跃开发期间每周

### 快速状态检查
```bash
# 统计待处理项目
grep -h "Status\*\*: pending" .learnings/*.md | wc -l

# 列出待处理的高优先级项目
grep -B5 "Priority\*\*: high" .learnings/*.md | grep "^## \["

# 查找特定领域的学习内容
grep -l "Area\*\*: backend" .learnings/*.md
```

### 审查操作
- 解决已修复的项目
- 提升适用的学习内容
- 链接相关条目
- 升级重复出现的问题

## 检测触发器

当你注意到以下情况时自动记录：

**纠正**（→ 学习条目，类别为 `correction`）：
- "不对..."
- "实际上应该是..."
- "你弄错了..."
- "那个已经过时了..."

**功能请求**（→ 功能请求）：
- "能不能也..."
- "希望你能..."
- "有没有办法..."
- "为什么不能..."

**知识盲点**（→ 学习条目，类别为 `knowledge_gap`）：
- 用户提供了你不知道的信息
- 你引用的文档已过时
- API 行为与你的理解不同

**错误**（→ 错误条目）：
- 命令返回非零退出码
- 异常或堆栈跟踪
- 意外的输出或行为
- 超时或连接失败

## 优先级指南

| 优先级 | 使用场景 |
|--------|----------|
| `critical` | 阻塞核心功能、数据丢失风险、安全问题 |
| `high` | 重大影响、影响常用工作流、重复出现的问题 |
| `medium` | 中等影响、存在变通方案 |
| `low` | 轻微不便、边缘情况、锦上添花 |

## 领域标签

用于按代码库区域过滤学习内容：

| 领域 | 范围 |
|------|------|
| `frontend` | UI、组件、客户端代码 |
| `backend` | API、服务、服务端代码 |
| `infra` | CI/CD、部署、Docker、云 |
| `tests` | 测试文件、测试工具、覆盖率 |
| `docs` | 文档、注释、README |
| `config` | 配置文件、环境、设置 |

## 最佳实践

1. **立即记录** - 问题发生后上下文最新鲜
2. **具体明确** - 未来的代理需要快速理解
3. **包含复现步骤** - 特别是错误
4. **链接相关文件** - 使修复更容易
5. **建议具体修复** - 不只是"调查"
6. **使用一致的类别** - 便于过滤
7. **积极提升** - 如有疑问，添加到 CLAUDE.md 或 .github/copilot-instructions.md
8. **定期审查** - 过时的学习内容会失去价值

## Gitignore 选项

**保持学习内容本地**（每个开发者）：
```gitignore
.learnings/
```

**在仓库中跟踪学习内容**（团队共享）：
不要添加到 .gitignore - 学习内容成为共享知识。

**混合模式**（跟踪模板，忽略条目）：
```gitignore
.learnings/*.md
!.learnings/.gitkeep
```

## 钩子集成

通过代理钩子启用自动提醒。这是**可选的** - 你必须明确配置钩子。

### 快速配置（Claude Code / Codex）

在项目中创建 `.claude/settings.json`：

```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "./skills/self-improvement/scripts/activator.sh"
      }]
    }]
  }
}
```

这会在每次提示后注入学习评估提醒（约 50-100 token 开销）。

### 完整配置（带错误检测）

```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "./skills/self-improvement/scripts/activator.sh"
      }]
    }],
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "./skills/self-improvement/scripts/error-detector.sh"
      }]
    }]
  }
}
```

### 可用的钩子脚本

| 脚本 | 钩子类型 | 用途 |
|------|----------|------|
| `scripts/activator.sh` | UserPromptSubmit | 任务后提醒评估学习内容 |
| `scripts/error-detector.sh` | PostToolUse (Bash) | 命令错误时触发 |

详见 `references/hooks-setup.md` 获取详细配置和故障排除。

## 自动技能提取

当学习内容足够有价值成为可复用技能时，使用提供的辅助工具进行提取。

### 技能提取标准

当满足以下任一条件时，学习内容适合提取为技能：

| 标准 | 描述 |
|------|------|
| **重复出现** | 有 2 个以上相似问题的 `See Also` 链接 |
| **已验证** | 状态为 `resolved` 且有可行的修复方案 |
| **非显而易见** | 需要实际调试/调查才能发现 |
| **广泛适用** | 不是项目特定的；跨代码库有用 |
| **用户标记** | 用户说"把这个保存为技能"或类似的话 |

### 提取工作流

1. **识别候选**：学习内容符合提取标准
2. **运行辅助工具**（或手动创建）：
   ```bash
   ./skills/self-improvement/scripts/extract-skill.sh skill-name --dry-run
   ./skills/self-improvement/scripts/extract-skill.sh skill-name
   ```
3. **定制 SKILL.md**：用学习内容填充模板
4. **更新学习条目**：设置状态为 `promoted_to_skill`，添加 `Skill-Path`
5. **验证**：在新会话中读取技能确保自包含

### 手动提取

如果你偏好手动创建：

1. 创建 `skills/<skill-name>/SKILL.md`
2. 使用 `assets/SKILL-TEMPLATE.md` 中的模板
3. 遵循 [Agent Skills 规范](https://agentskills.io/specification)：
   - YAML 前言包含 `name` 和 `description`
   - 名称必须与文件夹名称匹配
   - 技能文件夹内不要有 README.md

### 提取检测触发器

注意以下信号表明学习内容应该成为技能：

**在对话中：**
- "把这个保存为技能"
- "我总是遇到这个问题"
- "这对其他项目也有用"
- "记住这个模式"

**在学习条目中：**
- 多个 `See Also` 链接（重复问题）
- 高优先级 + 已解决状态
- 类别：`best_practice` 且具有广泛适用性
- 用户反馈称赞解决方案

### 技能质量关卡

提取前验证：

- [ ] 解决方案已测试且可行
- [ ] 描述在没有原始上下文的情况下也清晰
- [ ] 代码示例是自包含的
- [ ] 没有项目特定的硬编码值
- [ ] 遵循技能命名约定（小写、连字符）

## 多代理支持

此技能支持不同的 AI 编码代理，具有代理特定的激活方式。

### Claude Code

**激活方式**: 钩子（UserPromptSubmit、PostToolUse）
**配置**: `.claude/settings.json` 中的钩子配置
**检测**: 通过钩子脚本自动进行

### Codex CLI

**激活方式**: 钩子（与 Claude Code 相同的模式）
**配置**: `.codex/settings.json` 中的钩子配置
**检测**: 通过钩子脚本自动进行

### GitHub Copilot

**激活方式**: 手动（无钩子支持）
**配置**: 添加到 `.github/copilot-instructions.md`：

```markdown
## 自我改进

解决非显而易见的问题后，考虑记录到 `.learnings/`：
1. 使用自我改进技能的格式
2. 用 See Also 链接相关条目
3. 将高价值学习内容提升为技能

在聊天中询问："我应该把这个记录为学习内容吗？"
```

**检测**: 会话结束时手动审查

### OpenClaw

**激活方式**: 工作区注入 + 代理间消息
**配置**: 参见上面的"OpenClaw 配置"部分
**检测**: 通过会话工具和工作区文件

### 代理无关指导

无论使用哪个代理，在以下情况下应用自我改进：

1. **发现非显而易见的内容** - 解决方案不是立即想到的
2. **纠正自己** - 最初的方法是错误的
3. **学习项目约定** - 发现了未记录的模式
4. **遇到意外错误** - 特别是诊断困难的情况
5. **找到更好的方法** - 改进了原始解决方案

### Copilot Chat 集成

对于 Copilot 用户，在相关时添加到你的提示中：

> 完成此任务后，评估是否应该使用自我改进技能格式将学习内容记录到 `.learnings/`。

或使用快速提示：
- "把这个记录到学习内容"
- "从这个解决方案创建技能"
- "检查 .learnings/ 中的相关问题"
