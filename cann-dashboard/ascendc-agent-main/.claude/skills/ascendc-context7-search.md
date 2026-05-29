# AscendC Context7 检索技能

## 概述

通过 Context7 服务实现 AscendC 算子开发文档的智能语义检索。

## 使用场景

1. **需要 AscendC API 参考时** - 查询 API 签名、参数、返回值
2. **查找代码示例时** - 获取完整的可运行代码示例
3. **了解最佳实践时** - 性能优化、常见陷阱、推荐做法
4. **问题诊断时** - 编译错误、运行时错误、精度问题

## Context7 集成信息

- **GitHub 仓库**: https://github.com/2529844385/ascendc-knowledge-base
- **Library ID**: `/2529844385/ascendc-knowledge-base`
- **llms.txt 位置**: `/llms.txt`

## 使用方式

### 方式 1: 通过 MCP 工具（推荐）

如果已配置 Context7 MCP，可以使用以下工具：

```
# 解析库 ID
resolve-library-id(libraryName="ascendc", query="查询内容")

# 查询文档
query-docs(libraryId="/2529844385/ascendc-knowledge-base", query="具体问题")
```

### 方式 2: 通过 CLI

```bash
# 安装 Context7 CLI
npm install -g @upstash/context7-cli

# 测试检索
npx ctx7 docs "/2529844385/ascendc-knowledge-base" "Add API"

# 复杂查询
npx ctx7 docs "/2529844385/ascendc-knowledge-base" "如何实现 Tiling 切分"

# 代码示例
npx ctx7 docs "/2529844385/ascendc-knowledge-base" "ReduceSum 代码示例"
```

### 方式 3: 直接访问 GitHub

当 Context7 索引尚未完成时，可以直接访问：

```
https://github.com/2529844385/ascendc-knowledge-base
```

## 常用查询示例

### API 查询

```
# 矢量计算 API
"Add API 使用方法"
"Mul 参数说明"
"ReduceSum 返回值"

# Buffer 管理 API
"TBuf 初始化"
"TQue 队列操作"
"DataCopy 数据搬运"

# 矩阵计算 API
"Matmul 配置参数"
"Mmad 使用示例"
```

### 代码示例查询

```
"Add 算子完整示例"
"双缓冲实现代码"
"Tiling 切分示例"
"非对齐数据处理"
```

### 最佳实践查询

```
"性能优化技巧"
"内存管理最佳实践"
"多核同步方法"
"精度保证建议"
```

### 问题诊断查询

```
"编译错误解决方案"
"精度问题诊断"
"运行时错误处理"
"内存泄漏排查"
```

## 触发条件

当用户提出以下类型的问题时，应考虑使用此技能：

1. "如何使用 AscendC 的 XXX API？"
2. "有没有 XXX 算子的示例代码？"
3. "XXX 操作的最佳实践是什么？"
4. "遇到 XXX 错误怎么解决？"
5. "如何优化 XXX 的性能？"

## 注意事项

1. **索引延迟**: Context7 索引可能需要几分钟到几小时完成
2. **文档更新**: 本地文档更新后需要推送到 GitHub 才能被索引
3. **查询精确性**: 使用具体的技术术语而非自然语言描述
4. **回退机制**: 如果 Context7 无结果，应回退到本地文档搜索

## 与其他 Skills 的协作

| Skill | 关系 | 协作方式 |
|-------|------|---------|
| `/ascend-docs-search` | 替代/补充 | Context7 索引完成前使用 ascend-docs-search |
| `/ascendc-api-best-practices` | 补充 | API 最佳实践的详细说明 |
| `/ascendc-debugging` | 补充 | 调试问题的具体解决方案 |
| `/ascendc-precision-debug` | 补充 | 精度问题的诊断和修复 |

## 配置状态

- [x] GitHub 仓库创建
- [x] llms.txt 文件创建
- [ ] Context7 索引完成（需要提交到 Context7）
- [ ] MCP 工具配置（可选）

## 下一步

1. 提交仓库到 Context7 进行索引
2. 配置 Claude Code MCP（如需要）
3. 根据使用反馈优化 llms.txt 内容
