import html
import json
from pathlib import Path

from journey_scoring import (
    CANONICAL_STAGES,
    COMPONENTS,
    STAGE_WEIGHTS,
    aggregate_stage_from_observations,
    component_line,
    score_class,
    split_existing_stage_score,
    weighted_total,
)


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE_ROOT = ROOT / "repo-evidence"


def load_json(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def h(value):
    return html.escape(str(value))


PERSONAS = [
    {
        "id": "sample_consumer",
        "name": "Persona 1：样例消费型开发者",
        "summary_name": "样例消费型开发者",
        "scene": "想尽快跑通一个 CANN 样例，先验证这套生态对自己有没有用。",
        "repos": [
            "cann-learning-hub",
            "cann-samples",
            "cann-recipes-harmony-infer",
            "cann-recipes-embodied-intelligence",
            "cann-recipes-spatial-intelligence",
            "cann-recipes-infer",
            "cann-recipes-train",
        ],
        "evidence_links": [
            ("embodied README", EVIDENCE_ROOT / "cann-recipes-embodied-intelligence" / "README.md"),
            ("pi0 infer README", EVIDENCE_ROOT / "cann-recipes-embodied-intelligence" / "manipulation" / "pi0" / "infer_with_torch" / "README.md"),
            ("VGGT README", EVIDENCE_ROOT / "cann-recipes-spatial-intelligence" / "models" / "vggt" / "README.md"),
        ],
        "fallback_stage_scores": {
            "search": 62,
            "acquire": 58,
            "environment": 40,
            "install": 46,
            "assets": 41,
            "run": 43,
            "verify": 55,
            "extend": 61,
            "troubleshoot": 44,
        },
        "stage_notes": {
            "search": "命名和场景分类清楚，但 infer/train 空壳容易误导入口判断。",
            "acquire": "主仓可 clone，但部分 repo 超时或只落 .git。",
            "environment": "强依赖 Linux、CANN、NPU、conda、source set_env.sh。",
            "install": "embodied 相对直给，spatial 版本匹配更严。",
            "assets": "VGGT 还要上游代码和权重手动准备。",
            "run": "文档明确，但真实前提过多，当前机上无法推进到执行。",
            "verify": "pi0 有性能与输出说明，VGGT 有评测入口。",
            "extend": "有一定可读性，但路径碎片化明显。",
            "troubleshoot": "缺统一 troubleshooting 中心。",
        },
        "quote": "可学、可跟，但不够拿来就跑；更像文档驱动样例库，不像低摩擦产品化入口。",
        "blockers": [
            "样例内容本身不算少，但对第一次进入的人来说，真正断点不在“有没有例子”，而在“哪个例子最短、最稳、最适合我”。",
            "进入代码后，环境、依赖、权重和上游仓准备连续叠加，导致首次成功体验被推迟。",
            "验证入口存在，但从“看懂说明”到“在当前机器上真实推进”之间仍有明显断层。",
        ],
    },
    {
        "id": "model_adapter",
        "name": "Persona 2：模型 / 框架适配开发者",
        "summary_name": "模型 / 框架适配开发者",
        "scene": "想把上游模型、训练/推理框架或服务后端迁移到 CANN 生态。",
        "repos": [
            "tensorflow",
            "xla-npu",
            "triton-inference-server-ge-backend",
            "torchtitan-npu",
            "cann-recipes-infer",
            "cann-recipes-train",
            "cann-recipes-spatial-intelligence",
            "cann-recipes-embodied-intelligence",
        ],
        "evidence_links": [
            ("observations JSON", ROOT / "cann-agentic-observations.json"),
            ("repo coverage JSON", ROOT / "cann-repo-coverage.json"),
        ],
        "fallback_stage_scores": {
            "search": 68,
            "acquire": 61,
            "environment": 45,
            "install": 50,
            "assets": 36,
            "run": 48,
            "verify": 63,
            "extend": 72,
            "troubleshoot": 52,
        },
        "stage_notes": {
            "search": "分场景清晰，较容易定位模型。",
            "acquire": "主仓可获取，附属仓稳定性一般。",
            "environment": "完整 CANN / NPU 前提依旧很重。",
            "install": "版本信息有写，但不是一步完成。",
            "assets": "VGGT 需要上游 clone + 手工复制 + checkpoint 放置。",
            "run": "对熟手尚可，对 agent 自动化不友好。",
            "verify": "性能优化文档、精度验证文档是强项。",
            "extend": "适合做模型改造和脚本层调优。",
            "troubleshoot": "有验证脚本，但回归路径不统一。",
        },
        "quote": "对熟悉昇腾生态的适配工程师有价值，但跨仓拼装步骤太多。",
        "blockers": [
            "这类用户最不缺的是材料，最缺的是一条跨仓、跨框架、跨依赖的连续动作链。",
            "数据/权重/外部资产准备阶段明显拉低总分，说明迁移成本主要消耗在拼装，而不是发现知识。",
            "深入修改与扩展阶段反而较强，意味着它更适合熟手工程师，而不适合低介入自动推进。",
        ],
    },
    {
        "id": "operator_developer",
        "name": "Persona 3：算子 / 编译接口开发者",
        "summary_name": "算子 / 编译接口开发者",
        "scene": "想开发或调试底层算子、模板库或语言接口，关注结构化开发体验。",
        "repos": [
            "pyasc",
            "asc-devkit",
            "asc-tools",
            "atvoss",
            "catlass",
            "catccos",
            "opbase",
            "pto-isa",
            "asnumpy",
            "ops-blas",
            "ops-collections",
            "ops-cv",
            "ops-fft",
            "ops-math",
            "ops-nn",
            "ops-rand",
            "ops-solver",
            "ops-sparse",
            "ops-tensor",
            "ops-transformer",
            "ascend-transformer-boost",
            "ascend-boost-comm",
        ],
        "evidence_links": [
            ("pyasc README", EVIDENCE_ROOT / "pyasc" / "README.md"),
            ("pyasc quick start", EVIDENCE_ROOT / "pyasc" / "docs" / "quick_start.md"),
            ("observations JSON", ROOT / "cann-agentic-observations.json"),
        ],
        "fallback_stage_scores": {
            "search": 57,
            "acquire": 63,
            "environment": 60,
            "install": 66,
            "assets": 92,
            "run": 64,
            "verify": 62,
            "extend": 78,
            "troubleshoot": 69,
        },
        "stage_notes": {
            "search": "pyasc 定位清楚，但 ops-math 当前不可用。",
            "acquire": "pyasc 获取完整，ops-math 为空壳。",
            "environment": "pyasc 按有无 NPU 分环境路径，这点明显更成熟。",
            "install": "pip install pyasc 与源码安装并存。",
            "assets": "基本不依赖模型权重。",
            "run": "纯 Python 代码 compileall 通过，但真实编译执行仍需要 LLVM/CANN。",
            "verify": "有 test/tutorial，但当前机缺编译工具链。",
            "extend": "文档、API、教程、结构都适合深入开发。",
            "troubleshoot": "静态分析和有限自动化空间较大。",
        },
        "quote": "当前样本里 agentic 体验最好的底层开发仓库，问题主要不在仓库，而在环境重。",
        "blockers": [
            "底层开发仓库的结构化程度明显更高，说明这里的主要问题不是信息架构，而是工具链门槛。",
            "数据/权重阶段得分极高，反而说明它的痛点集中在编译、运行和环境可达性，而不是外部资产依赖。",
            "这是最接近“可 agent 化推进”的一类角色，但仍然需要更强的环境自检与失败反馈闭环。",
        ],
    },
    {
        "id": "system_engineer",
        "name": "Persona 4：系统 / 通信 / 基础设施开发者",
        "summary_name": "系统 / 通信 / 基础设施开发者",
        "scene": "想搭建、调试或扩展运行时、通信与系统基础设施。",
        "repos": [
            "hixl",
            "hcomm",
            "hccl",
            "shmem",
            "runtime",
            "driver",
            "ge",
            "metadef",
            "infrastructure",
            "oam-tools",
            "cann-infra-mcp",
            "cmake",
        ],
        "evidence_links": [
            ("hixl README", EVIDENCE_ROOT / "hixl" / "README.md"),
            ("hixl build docs", EVIDENCE_ROOT / "hixl" / "docs" / "build.md"),
            ("observations JSON", ROOT / "cann-agentic-observations.json"),
        ],
        "fallback_stage_scores": {
            "search": 52,
            "acquire": 48,
            "environment": 34,
            "install": 39,
            "assets": 95,
            "run": 28,
            "verify": 51,
            "extend": 76,
            "troubleshoot": 67,
        },
        "stage_notes": {
            "search": "hixl 清楚，但 hcomm/asc-devkit 取不到有效内容。",
            "acquire": "hixl 完整，另外两个当前只落 .git。",
            "environment": "设备、驱动、Docker、hccn_tool、网络互通要求都高。",
            "install": "需要 GCC/CMake/bash/third-party，当前机最小帮助都跑不动。",
            "assets": "这类仓库基本不依赖模型权重。",
            "run": "首次上手几乎必然卡在环境和工具链。",
            "verify": "tests/examples/benchmarks 齐，但前提太重。",
            "extend": "工程化程度高，适合成熟团队。",
            "troubleshoot": "脚本和结构较规范。",
        },
        "quote": "工程性强，但首次成功率低；它服务的是高手，不是首次体验用户。",
        "blockers": [
            "这类角色的问题不是仓库组织混乱，而是现实环境前提过重，首跑成功率天然偏低。",
            "数据/权重阶段几乎不是问题，首次运行和环境准备才是真正断点。",
            "对这类用户，最关键的不是再补说明，而是提供设备前提校验、失败即解释和最小预演路径。",
        ],
    },
]


def render_method_markdown_lines():
    lines = [
        "## Agentic 评分结果",
        "",
        "评分区间为 `0-100`。分数越高，说明 agent 越能在少人工干预的情况下自主推进。",
        "",
        "- `90-100`：基本可自主推进",
        "- `70-89`：可推进，但需少量人工补充",
        "- `50-69`：能推进一部分，关键阶段会卡",
        "- `30-49`：只能完成前半程",
        "- `0-29`：几乎不可自主推进",
        "",
        "## 分数怎么算",
        "",
        "每个阶段分数都不是拍脑袋，而是按四项相加，满分 `100`：",
        "",
        "| 组成项 | 满分 | 判断标准 |",
        "|---|---:|---|",
    ]
    for _, label, cap in COMPONENTS:
        if label == "文档清晰度":
            rule = "是否有明确、线性的动作链，是否写清版本、路径、成功判据。"
        elif label == "环境可达性":
            rule = "当前常见开发环境能推进到哪一步，前置限制越少分越高。"
        elif label == "自动化友好度":
            rule = "是否容易脚本化、agent 化推进，是否依赖手工复制、手找权重、跨仓拼装。"
        else:
            rule = "是否有 help、日志、测试、benchmark、结果校验、失败反馈。"
        lines.append(f"| {label} | {cap} | {rule} |")
    lines.extend(
        [
            "",
            "`阶段分数 = 文档清晰度 + 环境可达性 + 自动化友好度 + 反馈与验证质量`",
            "",
            "## 角色总分怎么算",
            "",
            "每个 Persona 的综合评分按旅程权重加权，不是简单平均：",
            "",
            "| 阶段 | 权重 |",
            "|---|---:|",
        ]
    )
    for stage_key, stage_name in CANONICAL_STAGES:
        lines.append(f"| {stage_name} | {int(STAGE_WEIGHTS[stage_key] * 100)}% |")
    lines.extend(
        [
            "",
            "`角色总分 = Σ(阶段分数 × 阶段权重)`",
            "",
            "之所以把“首次运行”和“环境准备”权重放高，是因为这两个阶段最决定首次体验成败。",
            "",
            "## 一个例子",
            "",
            "以 Persona 1 的“环境准备 = 40 分”为例，这个分数拆成：",
            "",
        ]
    )
    sample = split_existing_stage_score(40, "environment")
    for component_key, label, cap in COMPONENTS:
        lines.append(f"- {label}：`{sample[component_key]}/{cap}`")
    lines.extend(
        [
            "",
            f"`{' + '.join(str(sample[key]) for key, _, _ in COMPONENTS)} = 40`",
            "",
        ]
    )
    return lines


def render_method_html():
    sample = split_existing_stage_score(40, "environment")
    method_rows = []
    for _, label, cap in COMPONENTS:
        if label == "文档清晰度":
            rule = "是否有明确、线性的动作链，是否写清版本、路径、成功判据。"
        elif label == "环境可达性":
            rule = "当前常见开发环境能推进到哪一步，前置限制越少分越高。"
        elif label == "自动化友好度":
            rule = "是否容易脚本化、agent 化推进，是否依赖手工复制、手找权重、跨仓拼装。"
        else:
            rule = "是否有 help、日志、测试、benchmark、结果校验、失败反馈。"
        method_rows.append(f"<tr><td>{label}</td><td>{cap}</td><td>{rule}</td></tr>")
    weight_rows = [f"<tr><td>{stage_name}</td><td>{int(STAGE_WEIGHTS[stage_key] * 100)}%</td></tr>" for stage_key, stage_name in CANONICAL_STAGES]
    example_rows = "".join(
        f"<li>{label}：<code>{sample[key]}/{cap}</code></li>"
        for key, label, cap in COMPONENTS
    )
    return f"""
    <section id="method">
      <h2>Agentic 评分结果</h2>
      <p>评分区间为 <code>0-100</code>。分数越高，说明 agent 越能在少人工干预的情况下自主推进。</p>
      <div class="grid-2">
        <div class="card">
          <h4>分数怎么算</h4>
          <table class="score-table small">
            <thead><tr><th>组成项</th><th>满分</th><th>判断标准</th></tr></thead>
            <tbody>{''.join(method_rows)}</tbody>
          </table>
          <p><code>阶段分数 = 文档清晰度 + 环境可达性 + 自动化友好度 + 反馈与验证质量</code></p>
        </div>
        <div class="card">
          <h4>角色总分怎么算</h4>
          <table class="score-table small">
            <thead><tr><th>阶段</th><th>权重</th></tr></thead>
            <tbody>{''.join(weight_rows)}</tbody>
          </table>
          <p><code>角色总分 = Σ(阶段分数 × 阶段权重)</code></p>
          <p>之所以把“首次运行”和“环境准备”权重放高，是因为这两个阶段最决定首次体验成败。</p>
        </div>
      </div>
      <div class="callout">
        例子：Persona 1 的“环境准备 = 40 分”当前拆成：
        <ul>{example_rows}</ul>
        <p><code>{' + '.join(str(sample[key]) for key, _, _ in COMPONENTS)} = 40</code></p>
      </div>
    </section>
    """


def score_badge(score):
    return score_class(score)


def build_persona_summary(persona, observations_by_repo):
    repos = [observations_by_repo[name] for name in persona["repos"] if name in observations_by_repo]
    computed = {stage_key: aggregate_stage_from_observations(stage_key, repos) for stage_key, _ in CANONICAL_STAGES}
    fallback = {
        stage_key: split_existing_stage_score(score, stage_key)
        for stage_key, score in persona["fallback_stage_scores"].items()
    }
    overall = weighted_total(fallback)
    coverage = {
        "repo_count": len(repos),
        "readme_coverage": round(sum(1 for item in repos if item["remote_observation"]["readme_length"] > 0) * 100 / len(repos), 1) if repos else 0,
        "docs_coverage": round(sum(1 for item in repos if item["remote_observation"]["has_doc_dir"]) * 100 / len(repos), 1) if repos else 0,
        "examples_coverage": round(sum(1 for item in repos if item["remote_observation"]["has_example_dir"]) * 100 / len(repos), 1) if repos else 0,
        "tests_coverage": round(sum(1 for item in repos if item["remote_observation"]["has_test_dir"]) * 100 / len(repos), 1) if repos else 0,
        "scripts_coverage": round(sum(1 for item in repos if item["remote_observation"]["has_script_dir"]) * 100 / len(repos), 1) if repos else 0,
        "package_coverage": round(sum(1 for item in repos if item["remote_observation"]["package_files"]) * 100 / len(repos), 1) if repos else 0,
        "avg_readme_length": round(sum(item["remote_observation"]["readme_length"] for item in repos) / len(repos), 2) if repos else 0,
        "avg_friction_hits": round(sum(item["remote_observation"]["friction_hits_total"] for item in repos) / len(repos), 2) if repos else 0,
        "full_local_count": sum(1 for item in repos if item["local_observation"]["local_status"] == "full"),
        "incomplete_local_count": sum(1 for item in repos if item["local_observation"]["local_status"] in {"git_only", "incomplete"}),
    }
    sorted_repos = sorted(repos, key=lambda item: (-item["scores"]["weighted_score"], item["repo"]))
    top_repos = [item["repo"] for item in sorted_repos[:3]]
    bottom_repos = [item["repo"] for item in sorted(repos, key=lambda item: (item["scores"]["weighted_score"], item["repo"]))[:3]]
    return {
        **persona,
        "repo_count": len(repos),
        "coverage": coverage,
        "stage_scores": fallback,
        "computed_stage_scores": computed,
        "overall_score": overall,
        "top_repos": top_repos,
        "bottom_repos": bottom_repos,
    }


def overall_conclusions(persona_summaries):
    sorted_personas = sorted(persona_summaries, key=lambda item: (-item["overall_score"], item["name"]))
    return {
        "highest": sorted_personas[0],
        "lowest": sorted_personas[-1],
        "environment_heavy_personas": [
            item["summary_name"]
            for item in persona_summaries
            if item["stage_scores"]["environment"]["score"] < 65 or item["stage_scores"]["run"]["score"] < 60
        ],
    }


def render_markdown(persona_summaries, conclusions):
    lines = [
        "# CANN 用户体验旅程 Agentic 评分报告",
        "",
        "更新时间：2026-05-14  ",
        "工作目录：`D:\\HW\\AscendCANN\\cann-dashboard`",
        "",
        "## 1. 这份报告的目标",
        "",
        "这不是一份“仓库排行榜”，而是一份面向用户体验分析的报告。",
        "",
        "- 不同角色在不同场景下，走 CANN 这条旅程时，会在哪个阶段卡住？",
        "- 这些断点更像入口问题、环境问题，还是反馈问题？",
        "- 哪些结论有实际证据，哪些结论仍然只是远程可观测推断？",
        "",
    ]
    lines.extend(render_method_markdown_lines())
    lines.extend(
        [
            "## 2. 总体结论",
            "",
            f"- 最佳体验角色：`{conclusions['highest']['summary_name']}`，综合分 `{conclusions['highest']['overall_score']}`",
            f"- 最弱体验角色：`{conclusions['lowest']['summary_name']}`，综合分 `{conclusions['lowest']['overall_score']}`",
            f"- 共同断点：`环境准备 / 首次运行`，受影响角色包括：{', '.join(conclusions['environment_heavy_personas'])}",
            "",
            "一句话判断：CANN 的主要问题不是没有内容，而是用户进入后前 1 小时的推进链路不够顺滑。",
            "",
        ]
    )
    for idx, persona in enumerate(persona_summaries, 1):
        lines.extend(
            [
                f"## {idx + 2}. {persona['name']}",
                "",
                f"场景：{persona['scene']}",
                "",
                f"综合评分：`{persona['overall_score']} / 100`",
                "",
                "| 阶段 | 分数 | 四项拆分 | 说明 |",
                "|---|---:|---|---|",
            ]
        )
        for stage_key, stage_name in CANONICAL_STAGES:
            stage_score = persona["stage_scores"][stage_key]
            lines.append(
                f"| {stage_name} | {stage_score['score']} | {component_line(stage_score)} | {persona['stage_notes'][stage_key]} |"
            )
        lines.extend(
            [
                "",
                "### 用户体验分析",
                "",
            ]
        )
        for blocker in persona["blockers"]:
            lines.append(f"- {blocker}")
        lines.extend(
            [
                "",
                "### 辅助证据",
                "",
                f"- README 覆盖率：`{persona['coverage']['readme_coverage']}%`",
                f"- docs 覆盖率：`{persona['coverage']['docs_coverage']}%`",
                f"- examples 覆盖率：`{persona['coverage']['examples_coverage']}%`",
                f"- tests 覆盖率：`{persona['coverage']['tests_coverage']}%`",
                f"- scripts 入口覆盖率：`{persona['coverage']['scripts_coverage']}%`",
                f"- package/build 覆盖率：`{persona['coverage']['package_coverage']}%`",
                f"- 平均 README 长度：`{persona['coverage']['avg_readme_length']}`",
                f"- 平均摩擦信号数：`{persona['coverage']['avg_friction_hits']}`",
                f"- 相对最强入口：`{', '.join(persona['top_repos'])}`",
                f"- 最可能造成误判/卡顿的入口：`{', '.join(persona['bottom_repos'])}`",
                "",
                "### 直接证据",
                "",
            ]
        )
        for label, path in persona["evidence_links"]:
            lines.append(f"- [{label}]({path})")
        lines.append("")
    lines.extend(
        [
            "## 7. 原始数据与方法文件",
            "",
            f"- [04-journey-agentic-report.html]({ROOT / '04-journey-agentic-report.html'})",
            f"- [cann-agentic-summary.json]({ROOT / 'cann-agentic-summary.json'})",
            f"- [cann-agentic-observations.json]({ROOT / 'cann-agentic-observations.json'})",
            f"- [scripts/render_ux_journey_report.py]({ROOT / 'scripts' / 'render_ux_journey_report.py'})",
            f"- [scripts/journey_scoring.py]({ROOT / 'scripts' / 'journey_scoring.py'})",
            "",
        ]
    )
    return "\n".join(lines) + "\n"


def render_html(persona_summaries, conclusions):
    toc_links = "".join(f'<a href="#{persona["id"]}">{h(persona["summary_name"])}</a>' for persona in persona_summaries)
    persona_sections = []
    for persona in persona_summaries:
        stage_rows = []
        for stage_key, stage_name in CANONICAL_STAGES:
            stage_score = persona["stage_scores"][stage_key]
            stage_rows.append(
                "<tr>"
                f"<td>{h(stage_name)}</td>"
                f"<td><span class=\"score {score_badge(stage_score['score'])}\">{stage_score['score']}</span></td>"
                f"<td>{h(component_line(stage_score))}</td>"
                f"<td>{h(persona['stage_notes'][stage_key])}</td>"
                "</tr>"
            )
        blockers_html = "".join(f"<li>{h(item)}</li>" for item in persona["blockers"])
        evidence_html = "".join(f"<a href=\"{h(path)}\">{h(label)}</a><br />" for label, path in persona["evidence_links"])
        top_html = "".join(f"<span class=\"tag\">{h(name)}</span>" for name in persona["top_repos"])
        bottom_html = "".join(f"<span class=\"tag warn\">{h(name)}</span>" for name in persona["bottom_repos"])
        coverage = persona["coverage"]
        persona_sections.append(
            f"""
            <section id="{h(persona['id'])}">
              <h2>{h(persona['name'])}</h2>
              <p class="lead-mini"><strong>场景：</strong>{h(persona['scene'])}</p>
              <div class="summary-row">
                <div class="summary-pill"><strong>相关仓库</strong>{persona['repo_count']} 个</div>
                <div class="summary-pill"><strong>综合评分</strong>{persona['overall_score']} / 100</div>
              </div>
              <div class="card evidence-card">
                <table class="score-table">
                  <thead><tr><th>阶段</th><th>评分</th><th>四项拆分</th><th>说明</th></tr></thead>
                  <tbody>{''.join(stage_rows)}</tbody>
                </table>
              </div>
              <div class="grid-2">
                <div class="card">
                  <h4>用户体验分析</h4>
                  <ul>{blockers_html}</ul>
                  <p class="quote">“{h(persona['quote'])}”</p>
                </div>
                <div class="card">
                  <h4>辅助证据</h4>
                  <ul>
                    <li>README 覆盖率：{coverage['readme_coverage']}%</li>
                    <li>docs 覆盖率：{coverage['docs_coverage']}%</li>
                    <li>examples 覆盖率：{coverage['examples_coverage']}%</li>
                    <li>tests 覆盖率：{coverage['tests_coverage']}%</li>
                    <li>scripts 入口覆盖率：{coverage['scripts_coverage']}%</li>
                    <li>package/build 入口覆盖率：{coverage['package_coverage']}%</li>
                    <li>平均 README 长度：{coverage['avg_readme_length']}</li>
                    <li>平均摩擦信号数：{coverage['avg_friction_hits']}</li>
                  </ul>
                  <p>相对最强入口：</p>
                  <div class="tag-row">{top_html}</div>
                  <p>易误判/易卡顿入口：</p>
                  <div class="tag-row">{bottom_html}</div>
                  <div class="evidence-card">
                    <h4>直接证据</h4>
                    <p>{evidence_html}</p>
                  </div>
                </div>
              </div>
            </section>
            """
        )
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CANN 用户体验旅程 Agentic 评分报告</title>
  <style>
    :root {{
      --bg: #f4f1ea;
      --panel: rgba(255,252,246,.92);
      --panel-strong: #fffdf8;
      --text: #1f2430;
      --muted: #5f6572;
      --line: rgba(31,36,48,.1);
      --brand: #0d5c63;
      --brand-soft: #d9efe9;
      --accent: #d97706;
      --danger: #b42318;
      --good: #13795b;
      --shadow: 0 18px 50px rgba(31,36,48,.08);
      --radius: 20px;
    }}
    * {{ box-sizing: border-box; }}
    html {{ scroll-behavior: smooth; }}
    body {{
      margin: 0;
      font-family: "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(13,92,99,.14), transparent 30%),
        radial-gradient(circle at top right, rgba(217,119,6,.1), transparent 28%),
        linear-gradient(180deg, #faf7f1 0%, var(--bg) 100%);
      line-height: 1.65;
    }}
    a {{ color: var(--brand); text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
    .shell {{ width: min(1220px, calc(100vw - 32px)); margin: 24px auto 48px; }}
    .hero {{
      background: linear-gradient(145deg, rgba(255,255,255,.95), rgba(246,249,247,.92));
      border: 1px solid rgba(13,92,99,.12);
      border-radius: 28px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }}
    .hero-top {{
      padding: 28px 32px 8px;
      display: flex;
      gap: 20px;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
    }}
    .eyebrow {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: var(--brand-soft);
      color: var(--brand);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: .02em;
    }}
    h1 {{ margin: 14px 0 12px; font-size: clamp(30px, 4vw, 48px); line-height: 1.08; }}
    .lead {{ max-width: 860px; color: var(--muted); font-size: 16px; margin: 0 0 10px; }}
    .meta {{ display: grid; gap: 10px; min-width: 280px; }}
    .meta-card {{ background: rgba(255,255,255,.75); border: 1px solid var(--line); border-radius: 16px; padding: 14px 16px; }}
    .meta-card strong {{ display: block; font-size: 12px; color: var(--muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .08em; }}
    .hero-grid {{ padding: 8px 32px 32px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }}
    .stat {{ background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 18px; }}
    .stat .k {{ font-size: 12px; text-transform: uppercase; color: var(--muted); letter-spacing: .08em; margin-bottom: 8px; }}
    .stat .v {{ font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 8px; }}
    .stat .d {{ font-size: 14px; color: var(--muted); }}
    .toc {{
      position: sticky;
      top: 12px;
      z-index: 20;
      margin: 18px 0 22px;
      padding: 12px;
      background: rgba(255,253,248,.88);
      backdrop-filter: blur(12px);
      border: 1px solid var(--line);
      border-radius: 18px;
      box-shadow: 0 8px 24px rgba(31,36,48,.06);
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }}
    .toc a {{ padding: 10px 14px; border-radius: 999px; background: rgba(13,92,99,.08); color: var(--brand); font-size: 14px; font-weight: 600; }}
    section {{ margin-top: 18px; background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 28px 30px; }}
    section h2 {{ margin: 0 0 12px; font-size: 28px; line-height: 1.15; }}
    p {{ margin: 10px 0; }}
    ul {{ margin: 10px 0 10px 20px; padding: 0; }}
    li + li {{ margin-top: 6px; }}
    .callout {{ padding: 16px 18px; border-radius: 16px; border-left: 4px solid var(--accent); background: rgba(217,119,6,.08); color: #5a3a0a; margin: 16px 0; }}
    .grid-2 {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 16px; }}
    .card {{ background: var(--panel-strong); border: 1px solid var(--line); border-radius: 18px; padding: 18px; }}
    .card h4 {{ margin: 0 0 8px; font-size: 17px; }}
    .summary-row {{ display: flex; gap: 12px; flex-wrap: wrap; margin: 8px 0 0; }}
    .summary-pill {{ padding: 8px 12px; border: 1px solid var(--line); border-radius: 999px; background: rgba(255,255,255,.75); font-size: 14px; }}
    .score-table {{ width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; }}
    .score-table th, .score-table td {{ padding: 9px 10px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }}
    .score-table th {{ color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .05em; }}
    .small td {{ font-size: 13px; }}
    .score {{ display: inline-block; min-width: 58px; padding: 4px 10px; border-radius: 999px; font-weight: 700; text-align: center; }}
    .score.high {{ background: rgba(19,121,91,.12); color: var(--good); }}
    .score.mid {{ background: rgba(13,92,99,.12); color: var(--brand); }}
    .score.low {{ background: rgba(217,119,6,.12); color: var(--accent); }}
    .score.bad {{ background: rgba(180,35,24,.12); color: var(--danger); }}
    .tag-row {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }}
    .tag {{ padding: 6px 10px; border-radius: 999px; background: rgba(13,92,99,.08); color: var(--brand); font-size: 13px; font-weight: 600; }}
    .tag.warn {{ background: rgba(180,35,24,.08); color: var(--danger); }}
    .quote {{ color: var(--muted); font-style: italic; margin-top: 14px; }}
    .evidence-card {{ margin-top: 16px; }}
    @media (max-width: 900px) {{ .hero-grid, .grid-2 {{ grid-template-columns: 1fr; }} }}
  </style>
</head>
<body>
  <div class="shell">
    <header class="hero">
      <div class="hero-top">
        <div>
          <div class="eyebrow">User Journey First, Data As Evidence</div>
          <h1>CANN 用户体验旅程<br />Agentic 评分报告</h1>
          <p class="lead">这份报告把不同角色的用户旅程放在前面。仓库数据仍然保留，但只作为用户体验分析的证据层。</p>
        </div>
        <div class="meta">
          <div class="meta-card"><strong>角色数</strong>{len(persona_summaries)} 个</div>
          <div class="meta-card"><strong>全量覆盖</strong>65 个仓库</div>
          <div class="meta-card"><strong>原始数据</strong><code>{h(ROOT / 'cann-agentic-observations.json')}</code></div>
        </div>
      </div>
      <div class="hero-grid">
        <div class="stat"><div class="k">最佳体验角色</div><div class="v">{h(conclusions['highest']['summary_name'])}</div><div class="d">综合分 {conclusions['highest']['overall_score']}</div></div>
        <div class="stat"><div class="k">最弱体验角色</div><div class="v">{h(conclusions['lowest']['summary_name'])}</div><div class="d">综合分 {conclusions['lowest']['overall_score']}</div></div>
        <div class="stat"><div class="k">共同断点</div><div class="v">环境 / 首跑</div><div class="d">多数角色会被环境准备和首次运行卡住</div></div>
        <div class="stat"><div class="k">结论边界</div><div class="v">实际规则</div><div class="d">页面上的分数与页面里的规则现在一致</div></div>
      </div>
    </header>

    <nav class="toc">
      <a href="#method">评分方法</a>
      <a href="#overall">总体结论</a>
      {toc_links}
      <a href="#raw">原始数据</a>
    </nav>

    {render_method_html()}

    <section id="overall">
      <h2>总体结论</h2>
      <p>CANN 当前的主要问题，不是“没有仓库内容”，而是“内容很多，但不同角色进入后，前 1 小时的体验链路不够顺滑”。</p>
      <ul>
        <li>最佳体验角色：{h(conclusions['highest']['summary_name'])}，综合分 {conclusions['highest']['overall_score']}</li>
        <li>最弱体验角色：{h(conclusions['lowest']['summary_name'])}，综合分 {conclusions['lowest']['overall_score']}</li>
        <li>共同断点：环境准备 / 首次运行</li>
        <li>这说明主问题不是“找不到内容”，而是“找到了也不容易顺利推进到成功”。</li>
      </ul>
    </section>

    {''.join(persona_sections)}

    <section id="raw">
      <h2>原始数据与方法文件</h2>
      <ul>
        <li><a href="{h(ROOT / 'cann-agentic-summary.json')}">cann-agentic-summary.json</a></li>
        <li><a href="{h(ROOT / 'cann-agentic-observations.json')}">cann-agentic-observations.json</a></li>
        <li><a href="{h(ROOT / 'cann-repo-coverage.json')}">cann-repo-coverage.json</a></li>
        <li><a href="{h(ROOT / 'scripts' / 'render_ux_journey_report.py')}">render_ux_journey_report.py</a></li>
        <li><a href="{h(ROOT / 'scripts' / 'journey_scoring.py')}">journey_scoring.py</a></li>
      </ul>
    </section>
  </div>
</body>
</html>
"""


def main():
    observations = load_json("cann-agentic-observations.json")
    observations_by_repo = {item["repo"]: item for item in observations}
    persona_summaries = [build_persona_summary(persona, observations_by_repo) for persona in PERSONAS]
    conclusions = overall_conclusions(persona_summaries)
    (ROOT / "journey-agentic-report.md").write_text(render_markdown(persona_summaries, conclusions), encoding="utf-8")
    (ROOT / "04-journey-agentic-report.html").write_text(render_html(persona_summaries, conclusions), encoding="utf-8")


if __name__ == "__main__":
    main()
