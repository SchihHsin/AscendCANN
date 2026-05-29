# 技能模板

从学习内容提取技能的模板。复制并定制。

---

## SKILL.md 模板

```markdown
---
name: skill-name-here
description: "简明描述何时以及为何使用此技能。包含触发条件。"
---

# 技能名称

简要介绍，说明此技能解决的问题及其来源。

## 快速参考

| 场景 | 操作 |
|------|------|
| [触发条件 1] | [操作 1] |
| [触发条件 2] | [操作 2] |

## 背景

为什么这个知识很重要。它能防止什么问题。原始学习内容的上下文。

## 解决方案

### 步骤

1. 第一步，包含代码或命令
2. 第二步
3. 验证步骤

### 代码示例

\`\`\`language
// 演示解决方案的示例代码
\`\`\`

## 常见变体

- **变体 A**: 描述及处理方法
- **变体 B**: 描述及处理方法

## 陷阱

- 警告或常见错误 #1
- 警告或常见错误 #2

## 相关

- 相关文档链接
- 相关技能链接

## 来源

从学习条目提取。
- **学习 ID**: LRN-YYYYMMDD-XXX
- **原始类别**: correction | insight | knowledge_gap | best_practice
- **提取日期**: YYYY-MM-DD
```

---

## 精简模板

对于不需要所有部分的简单技能：

```markdown
---
name: skill-name-here
description: "此技能的功能及使用时机。"
---

# 技能名称

[一句话问题陈述]

## 解决方案

[直接解决方案，包含代码/命令]

## 来源

- 学习 ID: LRN-YYYYMMDD-XXX
```

---

## 带脚本的模板

对于包含可执行辅助工具的技能：

```markdown
---
name: skill-name-here
description: "此技能的功能及使用时机。"
---

# 技能名称

[介绍]

## 快速参考

| 命令 | 用途 |
|------|------|
| `./scripts/helper.sh` | [功能描述] |
| `./scripts/validate.sh` | [功能描述] |

## 使用方法

### 自动化（推荐）

\`\`\`bash
./skills/skill-name/scripts/helper.sh [args]
\`\`\`

### 手动步骤

1. 第一步
2. 第二步

## 脚本

| 脚本 | 描述 |
|------|------|
| `scripts/helper.sh` | 主要工具 |
| `scripts/validate.sh` | 验证检查器 |

## 来源

- 学习 ID: LRN-YYYYMMDD-XXX
```

---

## 命名约定

- **技能名称**: 小写，用连字符代替空格
  - 正确: `docker-m1-fixes`, `api-timeout-patterns`
  - 错误: `Docker_M1_Fixes`, `APITimeoutPatterns`

- **描述**: 以动词开头，提及触发条件
  - 正确: "处理 Apple Silicon 上的 Docker 构建失败。当构建因平台不匹配失败时使用。"
  - 错误: "Docker 相关"

- **文件**:
  - `SKILL.md` - 必需，主要文档
  - `scripts/` - 可选，可执行代码
  - `references/` - 可选，详细文档
  - `assets/` - 可选，模板

---

## 提取检查清单

从学习内容创建技能前：

- [ ] 学习内容已验证（状态: resolved）
- [ ] 解决方案广泛适用（非一次性）
- [ ] 内容完整（包含所有需要的上下文）
- [ ] 名称遵循约定
- [ ] 描述简洁但信息丰富
- [ ] 快速参考表格可操作
- [ ] 代码示例已测试
- [ ] 已记录来源学习 ID

创建后：

- [ ] 更新原始学习内容状态为 `promoted_to_skill`
- [ ] 在学习元数据中添加 `Skill-Path: skills/skill-name`
- [ ] 在新会话中读取技能进行测试
