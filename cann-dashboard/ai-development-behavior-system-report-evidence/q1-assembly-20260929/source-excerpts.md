# 问题 01 · 最小原文摘录

只读摘录，不是截图或运行记录。CANNBot 固定提交：`591e5fd668decdf3b26545914ce98928c5fcb93d`。行号指源文件。

## ops/ascendc-env-check/SKILL.md

来源：https://atomgit.com/cann/cannbot-skills/blob/591e5fd668decdf3b26545914ce98928c5fcb93d/ops/ascendc-env-check/SKILL.md

原文 L1–L4：

```text
---
name: ascendc-env-check
description: Ascend C 算子开发环境检查技能。用于：(1) 通过 npu-smi 查询 NPU 设备信息（设备列表、状态、资源使用），(2) 检查 CANN 环境配置（CANN Toolkit、Ops、自定义算子包），(3) 验证开发依赖是否完整，(4) 运行时检测当前设备 NPU 架构。触发关键词：环境检查、NPU设备、npu-smi、CANN安装、设备查询、资源监控、检查CANN环境变量、NPU架构、npu arch。
---
```

原文 L68–L82：

````text
## NPU 架构检测

**前置条件**：先 source CANN 安装目录下的 `set_env.sh`（asys 与 DSMI 库依赖其 PATH / LD_LIBRARY_PATH）。

**重要**：npu-smi 的 Chip Name 作为 short-soc-version **不可信**（A3 机型误报 `Ascend910`，issue #587），禁止用于芯片型号识别。

```bash
# 人读报告（含用途注释与证据链）
python3 scripts/get_npu_arch.py

# 仅输出裸 NpuArch 数值（如 3510）
python3 scripts/get_npu_arch.py --raw

# 机器可读 JSON（键名：full_soc / full_soc_source / npu_arch / npu_arch_source / short_soc / ccec_aiv_version / variant_dir / ini_path / npu_count / warnings）
python3 scripts/get_npu_arch.py --json
````

原文 L97–L97：

```text
**依赖**：Ascend driver 和 CANN toolkit。
```

## ops/ops-profiling/SKILL.md

来源：https://atomgit.com/cann/cannbot-skills/blob/591e5fd668decdf3b26545914ce98928c5fcb93d/ops/ops-profiling/SKILL.md

原文 L1–L4：

```text
---
name: ops-profiling
description: NPU 性能采集与分析，融合 msprof 算子级瓶颈定位与 kernel-level 对比测试，用于采集算子性能数据、对比自定义算子 vs 标杆加速比、定位性能瓶颈并给出优化建议。核心工具：msprof_profile_run.sh（标准采集 / --compare 对比测试 / --quick 快速对比 / --batch 批量并行）与 msprof_perf_summary.py（瓶颈分析、对比报告）；加速比对比用 msprof_profile_run.sh 的 compare/quick 模式，输出 performance.json 和 markdown 对比报告即完成，无需可视化。另含 msopprof-visualization 子技能，仅当用户明确要求把已采集数据渲染为交互式 HTML 可视化报告时使用，不用于加速比对比场景。当用户在算子开发过程中提到"上板性能"、"算子性能测试"、"硬件性能验证"、"NPU性能采集"、"NPU profiling"、"性能对比"、"加速比"、"性能可视化"、"性能报告"等场景时触发。
---
```

原文 L53–L61：

````text
### 2. 对比测试模式（kernel-level 加速比）

对算子目录下的 `model.py` vs `model_new_ascendc.py` 做对比测试：

```bash
bash scripts/msprof_profile_run.sh --compare --output-dir=./output/GELU --warm-up=3 --device=0
```

输出：`performance.json` + `performance.log` + `perf_report.md`
````

原文 L114–L125：

```text
## 输出格式（对比模式）

Markdown 报告包含：
- **对比表**：`Case | Shape | DType | 自定义算子(us) | 标杆(us) | 加速比`
- **全量汇总**：用例数、平均加速比、自定义/标杆更优条数
- **按数据类型汇总**：分 dtype 的统计
- **简短分析**：整体趋势结论
- **深度瓶颈分析入口**：提供 msprof 深度分析命令

额外输出：
- `performance.json` — 结构化数据（含 geomean/mean/median/min/max 加速比）
- `performance.log` — 打屏日志
```

原文 L139–L144：

```text
2. **用户未指定** — 先判定算子类型，再探测环境：
   - **MC² / 多 rank 算子**（算子通过 `fork()` 创建多个子进程绑定不同 NPU 卡，子进程间通过 SHMEM UDMA / BarrierAll / CrossCoreFlag 协同通信，如 alltoall_matmul、allgather_matmul、matmul_reducescatter）→ **必须使用 `msprof`**，禁止使用 `msprof op`（`msprof op` 对 fork 程序的采集行为未定义，数据不可靠）。加载 [`references/msprof-guide.md`](references/msprof-guide.md) 的「MC² 多 rank 算子采集」章节，同时参考 `ascendc-perf-optimize` skill 的 `references/comm-compute/index.md`「性能采集方法」章节
   - 仅 `msopprof` 可用 → [`references/msprof-op-guide.md`](references/msprof-op-guide.md)
   - 仅 `msprof` 可用 → [`references/msprof-guide.md`](references/msprof-guide.md)
   - 两者皆可用 → 须向用户确认或按项目约定选用其一
   - 两者皆不可用 → 报错，提示检查 CANN / `ASCEND_HOME` 安装
```

原文 L159（样章中的产物衔接边界）：

```text
注意两套链路输出不互通：本技能的 `PROF_GROUP_*` 归档不能直接喂给可视化渲染，可视化子技能的采集目录结构由其自身 `collect.py` 产生。
```

## ops/ascendc-perf-optimize/SKILL.md

来源：https://atomgit.com/cann/cannbot-skills/blob/591e5fd668decdf3b26545914ce98928c5fcb93d/ops/ascendc-perf-optimize/SKILL.md

原文 L1–L4：

```text
---
name: ascendc-perf-optimize
description: Ascend C 算子性能优化策略制定。结合 Tiling 建模与流水分析（仿真图 + profiling 数据），按卡间/核间/核内三层流水制定性能优化策略，并回修 Tiling 参数。触发：算子性能调优、流水分析、Tiling 修正、bound 诊断、MC² 通算融合算子优化、卡间流水配平时。
---
```

原文 L12–L17：

```text
| 步骤 | 名称 | 适用条件 | 关注点 |
|------|------|---------|--------|
| **Step 1** | Tiling 理论建模 | 所有算子 | 确定理想 tiling data |
| **Step 2** | 卡间流水优化 | 通信类算子 | 通算演算、卡间通信瓶颈。**MC² 算子须先采集 TilingData 和隔离测试数据（见 `comm-compute/index.md` Step 0/2），缺失时返回数据采集阶段补采** |
| **Step 3** | 核间流水优化 | 多核间同步算子 | 核间并行效率、同步开销 |
| **Step 4** | 单核流水优化 | 所有算子 | 核内流水、bound 诊断 |
```

原文 L40–L53：

```text
## Step 1 — Tiling 理论建模

**输入**：算子类型、Shape、dtype、计算流程

**过程**：根据算子 pattern 路由到对应的 Tiling 理论模型目录（详见 `references/tiling/`，入口为 `references/tiling/index.md`），输出理想 tiling data。

**输出**：
- [ ] 卡间切分方案（切分维度、通信内算子涉及）
- [ ] 多核切分方案（切分维度、单核任务量、核数）
- [ ] 单核切分方案：
  - Cube/融合类：L1 split（baseM/baseN/baseK、L1 ping-pong）+ L0 split（mL0/nL0/kL0）
  - Vec 类：UB split（block_size、repeat）
- [ ] Buffer 规划（各 buffer 用途与大小，区分 L1/L0/UB 层级）
- [ ] 分支场景覆盖（dtype、shape 大小、对齐）
```

原文 L85–L101：

```text
## Step 3 — 核间流水优化策略

**适用条件**：涉及多核间同步的算子（如跨核同步、核间数据依赖等）。

非多核同步算子**跳过**此步骤。

**输入**：Step 1 的 tiling data + 计算流程 + 仿真图 + profiling 数据

**过程**：加载 `references/inter-core-pipeline/`，分析多核间的流水并行效率。

**输出**：
- [ ] 核间流水仿真图分析
- [ ] 核间 profiling 数据报告
- [ ] 核间流水优化策略
- [ ] 对 Step 1 tiling 策略的修正建议

> 当前 `references/inter-core-pipeline/` 内容为空，此步骤返回「核间流水优化策略暂未收录，跳过核间流水分析」。
```

## MCP · 本地包 0.0.1-alpha-6

来源：`/Users/hsin/Documents/Coding/ascend-vs-nvidia-ux/node_modules/@opencxd/ascend-doc-mcp/dist/index.js.map` 的 `sourcesContent`。不代表本轮已调用成功。

### ../src/tools/search-docs.ts · L45–L59

```typescript
/** search_docs 输入 schema */
export const searchDocsSchema = z
  .object({
    community: communityParamSchema,
    keyword: z.string().describe('搜索关键词。中文关键词需 URL 编码'),
    tab: z.enum(['ALL', 'DEVELOPER', 'DOC', 'PRODUCT_SOLUTION', 'FORUM_BLOG', 'AI_MARKET', 'OTHER']).default('DOC').describe('搜索范围：默认只搜文档'),
    product: z.string().optional().describe('限定产品范围（如 CANN社区版）'),
    version: z
      .string()
      .optional()
      .describe('按版本过滤结果（二次过滤，因 /intelligent/search 不支持服务端版本过滤）。传入版本路径段如 "900"、"920beta1"，工具从结果路径中提取版本段匹配。不传时返回所有版本的结果（每条标注 isLatestVersion）'),
    limit: z.number().default(10).describe('返回结果数量上限'),
    lang: z.enum(['zh', 'en']).default('zh').describe('语言：zh=中文、en=英文'),
  })
  .strict();
```

### ../src/tools/get-doc-content.ts · L156–L174

```typescript
export const getDocContentSchema = z
  .object({
    community: communityParamSchema,
    url: z
      .string()
      .describe(
        '文档页 URL。支持三种格式：1) 详情页完整URL（如 https://www.hiascend.com/document/detail/zh/...）2) 源文件路径（如 zh/CANNCommunityEdition/.../instg_0094.html）3) codePath格式（从 get_doc_toc 返回值获取，如 softwareinst/instg）。路径无需手动构造，从 search_docs/list_versions/get_doc_toc 返回值中直接获取即可。IDP 产物的 .md 格式返回 403，应默认使用 HTML 格式',
      ),
    params: z
      .object({
        Mode: z.enum(['PmIns', 'VmIns', 'DockerIns']).optional(),
        OS: z.enum(['openEuler', 'CentOS', 'Ubuntu', 'Kylin']).optional(),
        Software: z.enum(['cannToolKit', 'cannKernels', 'cannNnal']).optional(),
      })
      .optional()
      .describe('参数化条件（仅安装/部署类文档需要，条件名从 get_doc_toc 返回值的 ⚠ 标记获取）'),
    format: z.enum(['markdown', 'html', 'summary']).default('markdown').describe('输出格式：markdown=完整内容、html=原始HTML、summary=仅标题+摘要+章节列表'),
  })
  .strict();
```

### ../src/register-tools.ts · L52–L57

```typescript
const readOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
};
```
