# GitCode 现网内容快照 · 2026-11-26

改版所依据的现网页面：https://gitcode.com/cann/cann-learning-hub

- 抓取时间：2026-11-26 16:40（Asia/Shanghai）
- 默认分支：`master`
- 说明：本目录只保存“内容与结构”参考，不是现网仓库的完整镜像；完整代码与 Notebook 以 GitCode 仓库为准。

## 文件

| 文件 | 来源 | 说明 |
| --- | --- | --- |
| `README.repo.md` | `contents/README.md` | 现网 README 原文（77,740 B），包含角色导航、五条主线、完整课程体系、高校方案、博客与最新动态 |
| `repo-root.json` | `contents/` | 仓库根目录列表（目录/文件、最近提交） |
| `repo-tree-sample.json` | `git/trees/master?recursive=1&per_page=100&page=1` | 前 100 条目录/文件路径，用于快速了解仓库结构；GitCode 该接口未返回完整递归树 |
| `screenshot-1440x1200.png` | 现网页首屏 | 1440×1200 桌面截图；抓取时未登录，顶部部分图标为骨架占位 |

## README 的章节结构

- 🎯 角色导航（9 类角色）
- 📋 前置基础
- 🚀 从这里开始（CANN 基础第一课）
- 🧭 学完基础，选择一条主线（训练 / 推理 / 算子 / 应用 / 推荐）
- 📖 完整课程体系
- 🏫 高校教学方案专区
- 🤝 课程共建专区
- 🔗 配套生态
- 📝 技术博客
- 🔬 科研案例
- 🤝 参与贡献
- 🔥 Latest News
- 📄 版本与信息

## 使用的接口

- `https://api.gitcode.com/api/v5/repos/cann/cann-learning-hub/contents/README.md`
- `https://api.gitcode.com/api/v5/repos/cann/cann-learning-hub/contents/`
- `https://api.gitcode.com/api/v5/repos/cann/cann-learning-hub/git/trees/master?recursive=1&per_page=100&page=1`

> 现网 README 会持续更新；如需最新内容，重新抓取上述接口即可。
