import html
import json
from pathlib import Path

from journey_scoring import (
    CANONICAL_STAGES,
    COMPONENTS,
    STAGE_WEIGHTS,
    aggregate_stage_from_observations,
    component_line,
    renormalized_weighted_total,
    score_class,
)


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE_ROOT = ROOT / "repo-evidence"


def load_json(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def h(value):
    return html.escape(str(value))


ROLE_SCENES = [
    {
        "name": "算子开发者",
        "role_label": "产品应用性",
        "role_statement": "这一类角色更关注底层开发是否结构化、可验证、可持续迭代。",
        "scenes": [
            {
                "name": "算子复现部署",
                "source": "context",
                "repos": ["cann-samples", "cann-learning-hub", "ops-test-kit", "pyasc", "asc-devkit"],
                "stage_keys": ["search", "environment", "verify"],
                "evidence_links": [
                    ("pyasc README", EVIDENCE_ROOT / "pyasc" / "README.md"),
                    ("pyasc quick start", EVIDENCE_ROOT / "pyasc" / "docs" / "quick_start.md"),
                ],
                "insights_override": [
                    "从找入口到跑验证的主链路存在，但真正影响推进速度的是工具链与环境前提。",
                    "这条旅程里，环境准备不是辅助步骤，而是决定体验成败的主断点。",
                ],
            },
            {
                "name": "算子迁移部署",
                "source": "context",
                "repos": ["asc-devkit", "asc-tools", "pyasc", "atvoss", "catlass", "ops-math", "ascend-transformer-boost"],
                "stage_keys": ["search", "acquire", "install", "verify", "extend"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "insights_override": [
                    "这里的瓶颈不是不知道做什么，而是迁移、编译、验证之间存在多段前置条件。",
                    "当角色进入深改阶段后，仓库结构化优势会明显放大。",
                ],
            },
            {
                "name": "Builtin 算子定制修改",
                "source": "context",
                "repos": ["opbase", "ops-nn", "ops-cv", "ops-transformer", "ops-math", "catlass", "catccos", "asc-devkit", "pyasc"],
                "stage_keys": ["search", "acquire", "install", "run", "extend", "troubleshoot"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "insights_override": [
                    "进入定制修改后，自动化友好度与反馈质量的重要性明显高于入口发现。",
                    "仓库本身更像成熟开发资产，问题主要在环境与验证闭环能否及时反馈。",
                ],
            },
            {
                "name": "算子基本功能实现",
                "source": "context",
                "repos": ["pyasc", "asc-devkit", "asc-tools", "atvoss", "opbase", "ops-collections", "ops-blas", "ops-tensor", "ops-solver", "ops-sparse", "ops-rand", "ops-fft"],
                "stage_keys": ["search", "acquire", "install", "run", "verify", "extend"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "insights_override": [
                    "这是当前最接近“可持续 agent 化推进”的底层旅程，但仍旧受工具链门槛制约。",
                    "如果补强环境自检与编译失败解释，这条旅程的整体体验还有上升空间。",
                ],
            },
            {
                "name": "特定 shape 性能优化",
                "source": "supplement",
                "repos": ["ops-transformer", "ops-math", "ascend-transformer-boost", "catlass"],
                "stage_keys": ["search", "verify", "extend", "troubleshoot"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 中只有场景名，没有具体旅程；这里用新分析补全。",
                "insights_override": [
                    "性能优化更依赖验证和排障链路，而不是单纯的文档入口。",
                    "如果缺少基准、回归和失败解释，优化过程会退化成高成本试错。",
                ],
            },
            {
                "name": "泛化 shape 性能优化",
                "source": "supplement",
                "repos": ["ops-transformer", "ops-math", "ops-tensor", "ops-solver", "ascend-transformer-boost"],
                "stage_keys": ["search", "verify", "extend", "troubleshoot"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 中只有场景名，没有具体旅程；这里用新分析补全。",
                "insights_override": [
                    "泛化优化的关键不在单次提速，而在验证闭环是否足够短、足够可信。",
                    "这条旅程对反馈与验证质量最敏感。",
                ],
            },
        ],
    },
    {
        "name": "AI 框架开发者",
        "role_label": "产品应用性",
        "role_statement": "这一类角色不是单点开发，而是在框架、后端、依赖和模型之间建立连续迁移路径。",
        "scenes": [
            {
                "name": "裸模型 Torch 原生开箱",
                "source": "supplement",
                "repos": ["tensorflow", "xla-npu", "torchtitan-npu", "triton-inference-server-ge-backend"],
                "stage_keys": ["search", "acquire", "environment", "run", "verify"],
                "evidence_links": [
                    ("observations JSON", ROOT / "cann-agentic-observations.json"),
                    ("repo coverage JSON", ROOT / "cann-repo-coverage.json"),
                ],
                "status_note": "context.md 里没有旅程内容，这里用新分析补全原生开箱链路。",
                "insights_override": [
                    "原生开箱的问题不是没有文档，而是关键前置条件分散在多个仓和多个技术层次上。",
                    "一旦进入环境和首跑阶段，跨仓拼装摩擦会快速抬升。",
                ],
            },
            {
                "name": "裸模型昇腾亲和优化",
                "source": "context",
                "repos": ["tensorflow", "xla-npu", "torchtitan-npu", "triton-inference-server-ge-backend", "cann-recipes-infer", "cann-recipes-train"],
                "stage_keys": ["search", "assets", "verify", "extend"],
                "evidence_links": [
                    ("observations JSON", ROOT / "cann-agentic-observations.json"),
                    ("repo coverage JSON", ROOT / "cann-repo-coverage.json"),
                ],
                "insights_override": [
                    "进入亲和优化后，首要问题从“能不能跑”转为“怎么稳定验证收益”。",
                    "这条旅程更需要标准化迁移模板，而不是再增加零散说明。",
                ],
            },
            {
                "name": "VLLM/SGL 框架原生开箱",
                "source": "supplement",
                "repos": ["cann-recipes-infer", "cann-recipes-train", "triton-inference-server-ge-backend"],
                "stage_keys": ["search", "acquire", "environment", "run", "verify"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 里没有旅程内容，这里用新分析补全。",
                "insights_override": [
                    "框架开箱路径看似有入口，但真正的断点集中在依赖和运行前提的连续性上。",
                    "对用户来说，最关键的是能否在最短路径下确认这个框架方案可行。",
                ],
            },
            {
                "name": "VLLM/SGL 框架昇腾亲和优化",
                "source": "supplement",
                "repos": ["cann-recipes-infer", "cann-recipes-train", "xla-npu", "triton-inference-server-ge-backend"],
                "stage_keys": ["search", "assets", "verify", "extend"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 里没有旅程内容，这里用新分析补全。",
                "insights_override": [
                    "亲和优化阶段的 UX 核心是验证闭环和可回退路径，而不是单纯文档量。",
                    "如果没有统一的收益判断标准，优化体验会显著下降。",
                ],
            },
            {
                "name": "Verl 框架原生开箱",
                "source": "supplement",
                "repos": ["cann-recipes-train", "torchtitan-npu"],
                "stage_keys": ["search", "acquire", "environment", "run", "verify"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 里没有旅程内容，这里用新分析补全。",
                "insights_override": [
                    "训练框架开箱的问题同样不是发现不到入口，而是环境与运行阶段的前置条件较重。",
                    "如果能把最小可运行路径压缩，开箱体验会明显改善。",
                ],
            },
            {
                "name": "Verl 框架昇腾亲和优化",
                "source": "supplement",
                "repos": ["cann-recipes-train", "xla-npu", "torchtitan-npu"],
                "stage_keys": ["search", "assets", "verify", "extend"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 里没有旅程内容，这里用新分析补全。",
                "insights_override": [
                    "这条旅程更像持续优化，而不是首次体验，因此验证与扩展阶段的权重更高。",
                    "需要统一的优化回路，避免用户在不同仓间自行拼装验证路径。",
                ],
            },
        ],
    },
    {
        "name": "应用开发者",
        "role_label": "产品应用性",
        "role_statement": "context.md 原本为空，这里用新分析补出更贴近业务落地与样例消费的两条应用型旅程。",
        "scenes": [
            {
                "name": "行业方案验证与 PoC",
                "source": "supplement",
                "repos": ["elec-ops-inspection", "elec-ops-prediction", "elec-ops-simulation", "mat-chem-sim-pred"],
                "stage_keys": ["search", "environment", "run", "verify"],
                "evidence_links": [
                    ("observations JSON", ROOT / "cann-agentic-observations.json"),
                    ("repo coverage JSON", ROOT / "cann-repo-coverage.json"),
                ],
                "status_note": "这是对 context.md 空白角色内容的补全。",
                "insights_override": [
                    "应用型用户最先关心的是能否快速完成 PoC，而不是理解整套底层架构。",
                    "当前更像方案展示而不是最小可运行方案包，所以首跑和验证阶段容易掉线。",
                ],
            },
            {
                "name": "样例落地与快速试用",
                "source": "supplement",
                "repos": [
                    "cann-learning-hub",
                    "cann-samples",
                    "cann-recipes-harmony-infer",
                    "cann-recipes-embodied-intelligence",
                    "cann-recipes-spatial-intelligence",
                    "cann-recipes-infer",
                    "cann-recipes-train",
                ],
                "stage_keys": ["search", "acquire", "environment", "run", "verify"],
                "evidence_links": [
                    ("embodied README", EVIDENCE_ROOT / "cann-recipes-embodied-intelligence" / "README.md"),
                    ("VGGT README", EVIDENCE_ROOT / "cann-recipes-spatial-intelligence" / "models" / "vggt" / "README.md"),
                ],
                "status_note": "这是对 context.md 空白角色内容的补全。",
                "insights_override": [
                    "应用开发者真正想看到的是最短路径出结果，而不是在多个 recipe 之间自行判断入口。",
                    "内容入口很多，但从“看见方案”到“确认它适合我”之间仍缺收敛路径。",
                ],
            },
        ],
    },
    {
        "name": "入门开发者",
        "role_label": "社区易用性",
        "role_statement": "这一类角色最关注能不能找到入口、快速跑通，并知道下一步做什么。",
        "scenes": [
            {
                "name": "S0 搜索与发现",
                "source": "context",
                "repos": ["community", "cann-learning-hub", "cann-samples", "pyasc", ".gitcode"],
                "stage_keys": ["search"],
                "evidence_links": [
                    ("context.md", ROOT / "context.md"),
                    ("observations JSON", ROOT / "cann-agentic-observations.json"),
                ],
                "insights_override": [
                    "新用户不是完全找不到信息，而是无法快速判断哪个入口最权威、最适合自己当前目标。",
                    "搜索与发现阶段的 UX 重点是收敛，而不是堆更多入口。",
                ],
            },
            {
                "name": "S1 环境检查与准备",
                "source": "context",
                "repos": ["cann-samples", "cann-learning-hub", "pyasc", "cann-recipes-embodied-intelligence", "cann-recipes-spatial-intelligence"],
                "stage_keys": ["environment", "install"],
                "evidence_links": [
                    ("pyasc quick start", EVIDENCE_ROOT / "pyasc" / "docs" / "quick_start.md"),
                    ("embodied README", EVIDENCE_ROOT / "cann-recipes-embodied-intelligence" / "README.md"),
                ],
                "insights_override": [
                    "入门用户的最大断点不是理解概念，而是环境链路过长、失败不够可解释。",
                    "如果没有环境自检与清晰成功判据，准备阶段会快速劝退。",
                ],
            },
            {
                "name": "S2 样例快速体验",
                "source": "supplement",
                "repos": ["cann-samples", "cann-learning-hub", "cann-recipes-embodied-intelligence", "cann-recipes-spatial-intelligence"],
                "stage_keys": ["run", "verify"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 只有阶段名，这里用新分析补全内容。",
                "insights_override": [
                    "样例快速体验本该是建立信心的阶段，但当前仍受到外部依赖与设备前提影响。",
                    "如果不能快速得到一个明确结果，用户会很难继续下一步。",
                ],
            },
            {
                "name": "S3 开发与编译",
                "source": "supplement",
                "repos": ["pyasc", "asc-devkit", "cann-samples"],
                "stage_keys": ["install", "run", "troubleshoot"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 只有阶段名，这里用新分析补全内容。",
                "insights_override": [
                    "新手进入开发与编译后，最大风险是失败反馈不够短路，导致无法判断自己卡在哪。",
                    "这里需要比文档更强的脚本化检查和即时解释。",
                ],
            },
            {
                "name": "S4 测试与验证",
                "source": "supplement",
                "repos": ["pyasc", "asc-devkit", "cann-samples", "cann-recipes-spatial-intelligence"],
                "stage_keys": ["verify", "troubleshoot"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 只有阶段名，这里用新分析补全内容。",
                "insights_override": [
                    "对新手来说，测试与验证的核心不是覆盖率，而是能否明确告诉他‘现在结果算不算成功’。",
                    "反馈质量越清楚，用户越能继续往下走。",
                ],
            },
            {
                "name": "S5 反馈与贡献",
                "source": "supplement",
                "repos": ["community", ".gitcode", "pyasc"],
                "stage_keys": ["search", "troubleshoot"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "status_note": "context.md 只有阶段名，这里用新分析补全内容。",
                "insights_override": [
                    "反馈与贡献的关键不是仓库里有没有 issue 入口，而是用户是否清楚该去哪里、提什么、怎么描述问题。",
                    "如果反馈入口不收敛，新手的负面体验会被带入社区环节继续放大。",
                ],
            },
        ],
    },
]


def scene_summary(scene, obs_map):
    repos = [obs_map[name] for name in scene["repos"] if name in obs_map]
    stage_scores = {stage_key: aggregate_stage_from_observations(stage_key, repos) for stage_key in scene["stage_keys"]}
    overall = renormalized_weighted_total(stage_scores, scene["stage_keys"])
    strongest_key = max(scene["stage_keys"], key=lambda key: stage_scores[key]["score"]) if stage_scores else None
    weakest_key = min(scene["stage_keys"], key=lambda key: stage_scores[key]["score"]) if stage_scores else None
    coverage = {
        "repo_count": len(repos),
        "readme_coverage": round(sum(1 for item in repos if item["remote_observation"]["readme_length"] > 0) * 100 / len(repos), 1) if repos else 0,
        "docs_coverage": round(sum(1 for item in repos if item["remote_observation"]["has_doc_dir"]) * 100 / len(repos), 1) if repos else 0,
        "examples_coverage": round(sum(1 for item in repos if item["remote_observation"]["has_example_dir"]) * 100 / len(repos), 1) if repos else 0,
        "tests_coverage": round(sum(1 for item in repos if item["remote_observation"]["has_test_dir"]) * 100 / len(repos), 1) if repos else 0,
    }
    repo_refs = [{"name": item["repo"], "url": item.get("html_url", "")} for item in repos]
    sorted_repos = sorted(repos, key=lambda item: (-item["scores"]["weighted_score"], item["repo"]))
    risk_sorted = sorted(repos, key=lambda item: (item["scores"]["weighted_score"], item["repo"]))
    stages = []
    for stage_key in scene["stage_keys"]:
        stage_name = next(name for key, name in CANONICAL_STAGES if key == stage_key)
        score = stage_scores[stage_key]
        stages.append(
            {
                "key": stage_key,
                "stage": stage_name,
                "score": score["score"],
                "score_class": score["score_class"],
                "component_line": component_line(score),
                "interpretation": scene["insights_override"][0] if stage_key == strongest_key else scene["insights_override"][-1] if stage_key == weakest_key else f"{stage_name} 阶段存在可推进路径，但仍有人工补齐成本。",
                "evidence_summary": component_line(score),
                "is_strongest": stage_key == strongest_key,
                "is_weakest": stage_key == weakest_key,
            }
        )
    return {
        **scene,
        "overall": overall,
        "overall_class": score_class(overall) if overall is not None else "bad",
        "stages": stages,
        "coverage": coverage,
        "repo_refs": repo_refs,
        "top_repos": [item["repo"] for item in sorted_repos[:3]],
        "risk_repos": [item["repo"] for item in risk_sorted[:3]],
    }


def role_summary(role, obs_map):
    scenes = [scene_summary(scene, obs_map) for scene in role["scenes"]]
    valid = [scene["overall"] for scene in scenes if scene["overall"] is not None]
    return {
        **role,
        "scenes": scenes,
        "overall": round(sum(valid) / len(valid), 1) if valid else None,
    }


def method_md_lines():
    lines = [
        "## Agentic 评分结果",
        "",
        "评分区间为 `0-100`。分数越高，说明 agent 越能在少人工干预的情况下自主推进。",
        "",
        "## 分数怎么算",
        "",
        "每个阶段分数按四项相加，满分 `100`：",
        "",
        "| 组成项 | 满分 | 判断标准 |",
        "|---|---:|---|",
    ]
    for _, label, cap in COMPONENTS:
        if label == "文档清晰度":
            rule = "动作链、版本、路径、成功判据是否清楚。"
        elif label == "环境可达性":
            rule = "常见开发环境能推进到哪一步，前置限制越少越高。"
        elif label == "自动化友好度":
            rule = "是否容易脚本化推进，是否依赖手工复制、跨仓拼装。"
        else:
            rule = "是否有 help、日志、测试、benchmark、结果校验、失败反馈。"
        lines.append(f"| {label} | {cap} | {rule} |")
    lines.extend(
        [
            "",
            "`阶段分数 = 文档清晰度 + 环境可达性 + 自动化友好度 + 反馈与验证质量`",
            "",
            "场景总分按本场景所包含阶段的权重重新归一化计算，不做简单平均。",
            "",
            "`场景总分 = Σ(阶段分数 × 阶段权重) / Σ(场景已使用权重)`",
            "",
        ]
    )
    return lines


def method_html():
    rows = []
    for _, label, cap in COMPONENTS:
        if label == "文档清晰度":
            rule = "动作链、版本、路径、成功判据是否清楚。"
        elif label == "环境可达性":
            rule = "常见开发环境能推进到哪一步，前置限制越少越高。"
        elif label == "自动化友好度":
            rule = "是否容易脚本化推进，是否依赖手工复制、跨仓拼装。"
        else:
            rule = "是否有 help、日志、测试、benchmark、结果校验、失败反馈。"
        rows.append(f"<tr><td>{label}</td><td>{cap}</td><td>{rule}</td></tr>")
    return f"""
    <section class="role-panel active" style="display:block;padding:22px;margin-bottom:14px;">
      <div class="role-head">
        <div>
          <div class="role-kicker">Scoring Method</div>
          <h2>Agentic 评分结果</h2>
          <p>评分区间为 <code>0-100</code>。分数越高，说明 agent 越能在少人工干预的情况下自主推进。</p>
        </div>
      </div>
      <div class="scenario-meta">
        <div class="meta-card">
          <div class="meta-title">阶段分公式</div>
          <table class="score-table small">
            <thead><tr><th>组成项</th><th>满分</th><th>判断标准</th></tr></thead>
            <tbody>{''.join(rows)}</tbody>
          </table>
          <p><code>阶段分数 = 文档清晰度 + 环境可达性 + 自动化友好度 + 反馈与验证质量</code></p>
        </div>
        <div class="meta-card">
          <div class="meta-title">场景分公式</div>
          <p>场景总分按本场景所包含阶段的权重重新归一化计算，不做简单平均。</p>
          <p><code>场景总分 = Σ(阶段分数 × 阶段权重) / Σ(场景已使用权重)</code></p>
        </div>
        <div class="meta-card">
          <div class="meta-title">辅助证据</div>
          <p>覆盖率与被引用仓库名只作为辅助证据，不作为主叙事。主叙事仍然是角色、场景和阶段得分。</p>
        </div>
      </div>
    </section>
    """


def source_badges(scene):
    badges = []
    if scene["source"] == "context":
        badges.append('<span class="source-badge context">context 骨架</span>')
    if scene["source"] == "supplement":
        badges.append('<span class="source-badge supplement">新分析补全</span>')
    return "".join(badges)


def render_stage_node(stage, idx, total):
    connector = "" if idx == total - 1 else '<div class="journey-connector" aria-hidden="true"></div>'
    extreme_badge = ""
    if stage["is_strongest"]:
        extreme_badge = '<span class="mini-badge strongest">高分阶段</span>'
    elif stage["is_weakest"]:
        extreme_badge = '<span class="mini-badge weakest">低分阶段</span>'
    return f"""
    <div class="journey-step {h(stage['score_class'])}{' strongest' if stage['is_strongest'] else ''}{' weakest' if stage['is_weakest'] else ''}">
      <div class="journey-node">
        <div class="journey-index">阶段 {idx + 1}</div>
        <div class="journey-stage">{h(stage['stage'])}</div>
        <div class="journey-score-row">
          <span class="score-pill {h(stage['score_class'])}">{h(stage['score'])}</span>
          {extreme_badge}
        </div>
      </div>
      <div class="journey-card">
        <p class="journey-point">{h(stage['interpretation'])}</p>
        <p class="journey-evidence">{h(stage['evidence_summary'])}</p>
      </div>
      {connector}
    </div>
    """


def render_scenario_panel(role_id, scene_id, scene, active=False):
    active_class = " active" if active else ""
    track = "".join(render_stage_node(stage, idx, len(scene["stages"])) for idx, stage in enumerate(scene["stages"]))
    insights = "".join(f"<li>{h(item)}</li>" for item in scene["insights_override"])
    evidence = "".join(f'<a href="{h(path)}" target="_blank">{h(label)}</a>' for label, path in scene["evidence_links"])
    repo_refs = "".join(
        f'<a class="repo-ref" href="{h(item["url"])}" target="_blank">{h(item["name"])}</a>' if item.get("url")
        else f'<span class="repo-ref plain">{h(item["name"])}</span>'
        for item in scene["repo_refs"]
    )
    top_tags = "".join(f'<span class="repo-chip">{h(item)}</span>' for item in scene["top_repos"])
    risk_tags = "".join(f'<span class="repo-chip risk">{h(item)}</span>' for item in scene["risk_repos"])
    supplement_note = f'<div class="inline-note">{h(scene["status_note"])}</div>' if scene.get("status_note") else ""
    return f"""
    <section class="scenario-panel{active_class}" data-role-panel="{h(role_id)}" data-scene-panel="{h(scene_id)}">
      <div class="scenario-hero">
        <div>
          <div class="scenario-eyebrow">场景旅程</div>
          <h3>{h(scene['name'])}</h3>
          <div class="source-row">{source_badges(scene)}</div>
          <p class="scenario-summary">场景分 <strong>{h(scene['overall'])}</strong>。当前旅程的高低点已经直接体现在轨道里。</p>
        </div>
        <div class="scenario-score {h(scene['overall_class'])}">
          <span>场景分</span>
          <strong>{h(scene['overall'])}</strong>
        </div>
      </div>
      {supplement_note}
      <div class="journey-track">{track}</div>
      <div class="scenario-meta">
        <div class="meta-card">
          <div class="meta-title">用户体验分析</div>
          <ul>{insights}</ul>
        </div>
        <div class="meta-card">
          <div class="meta-title">辅助证据</div>
          <div class="metric-grid compact">
            <div class="metric"><span>仓库数</span><strong>{scene['coverage']['repo_count']}</strong></div>
            <div class="metric"><span>README 覆盖率</span><strong>{scene['coverage']['readme_coverage']}%</strong></div>
            <div class="metric"><span>docs 覆盖率</span><strong>{scene['coverage']['docs_coverage']}%</strong></div>
            <div class="metric"><span>examples 覆盖率</span><strong>{scene['coverage']['examples_coverage']}%</strong></div>
            <div class="metric"><span>tests 覆盖率</span><strong>{scene['coverage']['tests_coverage']}%</strong></div>
            <div class="metric"><span>参考仓库</span><strong>{len(scene['repo_refs'])}</strong></div>
          </div>
          <div class="chip-row" style="margin-top:12px;">{top_tags}</div>
          <div class="chip-row">{risk_tags}</div>
        </div>
        <div class="meta-card">
          <div class="meta-title">被引用仓 / 证据</div>
          <div class="repo-ref-list">{repo_refs}</div>
          <div class="evidence-links" style="margin-top:12px;">{evidence}</div>
        </div>
      </div>
    </section>
    """


def render_role_panel(role, idx):
    role_id = f"role-{idx}"
    scene_tabs = []
    scene_panels = []
    for scene_idx, scene in enumerate(role["scenes"]):
        scene_id = f"{role_id}-scene-{scene_idx}"
        active = " active" if scene_idx == 0 else ""
        scene_tabs.append(
            f"""
            <button class="scene-tab{active}" type="button" data-role-target="{h(role_id)}" data-scene-target="{h(scene_id)}">
              <span class="scene-tab-name">{h(scene['name'])}</span>
              <span class="scene-tab-score">场景分 {h(scene['overall'])}</span>
            </button>
            """
        )
        scene_panels.append(render_scenario_panel(role_id, scene_id, scene, active=scene_idx == 0))
    return f"""
    <section class="role-panel{' active' if idx == 0 else ''}" data-role="{h(role_id)}">
      <div class="role-head">
        <div>
          <div class="role-kicker">{h(role['role_label'])}</div>
          <h2>{h(role['name'])}</h2>
          <p>{h(role['role_statement'])}</p>
        </div>
        <div class="role-score {h(score_class(role['overall']))}">
          <span>角色均分</span>
          <strong>{h(role['overall'])}</strong>
        </div>
      </div>
      <div class="scene-tabbar">{''.join(scene_tabs)}</div>
      {''.join(scene_panels)}
    </section>
    """


def render_md(role_summaries):
    lines = [
        "# CANN 角色与旅程体验报告",
        "",
        "更新时间：2026-05-14  ",
        "工作目录：`D:\\HW\\AscendCANN\\cann-dashboard`",
        "",
        "这版报告把 `context.md` 作为角色/场景骨架；如果 context 里缺内容，但新分析已有可用内容，则用新分析补全。",
        "",
    ]
    lines.extend(method_md_lines())
    for role in role_summaries:
        lines.extend(
            [
                f"## {role['name']}",
                "",
                role["role_statement"],
                "",
                f"角色均分：`{role['overall']}`",
                "",
            ]
        )
        for scene in role["scenes"]:
            lines.extend(
                [
                    f"### {scene['name']}",
                    "",
                    f"场景分：`{scene['overall']}`",
                    "",
                    "| 阶段 | 分数 | 四项拆分 |",
                    "|---|---:|---|",
                ]
            )
            for stage in scene["stages"]:
                lines.append(f"| {stage['stage']} | {stage['score']} | {stage['component_line']} |")
            lines.extend(
                [
                    "",
                    "辅助证据：",
                    "",
                    f"- 参考仓库：`{', '.join(item['name'] for item in scene['repo_refs'])}`",
                    f"- README 覆盖率：`{scene['coverage']['readme_coverage']}%`",
                    f"- docs 覆盖率：`{scene['coverage']['docs_coverage']}%`",
                    f"- examples 覆盖率：`{scene['coverage']['examples_coverage']}%`",
                    f"- tests 覆盖率：`{scene['coverage']['tests_coverage']}%`",
                    "",
                ]
            )
    return "\n".join(lines) + "\n"


def render_html(role_summaries):
    role_tabs = []
    role_panels = []
    for idx, role in enumerate(role_summaries):
        role_id = f"role-{idx}"
        active = " active" if idx == 0 else ""
        role_tabs.append(
            f"""
            <button class="role-tab{active}" type="button" data-role-tab="{h(role_id)}">
              <span class="role-tab-name">{h(role['name'])}</span>
              <span class="role-tab-meta">{h(role['role_label'])} · {h(role['overall'])}</span>
            </button>
            """
        )
        role_panels.append(render_role_panel(role, idx))
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CANN 角色与旅程体验报告</title>
  <style>
    :root {{
      --bg: #f5f1e7;
      --panel: rgba(255,252,246,.92);
      --card: rgba(255,255,255,.8);
      --text: #1f2430;
      --muted: #5d6473;
      --line: rgba(31,36,48,.1);
      --brand: #0f5f64;
      --brand-soft: rgba(15,95,100,.1);
      --accent: #cf7a00;
      --accent-soft: rgba(207,122,0,.14);
      --danger: #b42318;
      --danger-soft: rgba(180,35,24,.12);
      --good: #117a5a;
      --good-soft: rgba(17,122,90,.12);
      --shadow: 0 22px 60px rgba(31,36,48,.08);
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      color: var(--text);
      font-family: "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
      line-height: 1.6;
      background:
        radial-gradient(circle at 0% 0%, rgba(15,95,100,.14), transparent 30%),
        radial-gradient(circle at 100% 0%, rgba(207,122,0,.12), transparent 26%),
        linear-gradient(180deg, #fbf8f2 0%, var(--bg) 100%);
    }}
    button {{ font: inherit; color: inherit; background: none; border: none; padding: 0; cursor: pointer; }}
    a {{ color: var(--brand); text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
    .page {{ width: min(1440px, calc(100vw - 28px)); margin: 16px auto 28px; }}
    .hero, .role-panel {{ background: var(--panel); border: 1px solid var(--line); border-radius: 28px; box-shadow: var(--shadow); }}
    .hero {{ padding: 28px 30px 24px; margin-bottom: 14px; }}
    .eyebrow {{ display: inline-flex; padding: 6px 10px; border-radius: 999px; background: var(--brand-soft); color: var(--brand); font-size: 12px; font-weight: 700; }}
    h1 {{ margin: 14px 0 10px; font-size: clamp(28px, 4vw, 46px); line-height: 1.05; }}
    .hero p {{ margin: 0; color: var(--muted); max-width: 920px; }}
    .hero-summary {{ display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; margin-top: 18px; }}
    .summary-card {{ background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 14px 16px; }}
    .summary-card span {{ display: block; color: var(--muted); font-size: 12px; margin-bottom: 6px; }}
    .summary-card strong {{ display: block; font-size: 20px; line-height: 1.1; margin-bottom: 6px; }}
    .role-tabbar {{ position: sticky; top: 10px; z-index: 20; display: flex; gap: 8px; padding: 8px; border: 1px solid var(--line); border-radius: 18px; background: rgba(255,252,246,.92); backdrop-filter: blur(14px); box-shadow: 0 10px 30px rgba(31,36,48,.06); margin-bottom: 14px; overflow-x: auto; }}
    .role-tab {{ flex: 1 0 220px; min-width: 220px; text-align: left; padding: 10px 14px; border-radius: 14px; border: 1px solid transparent; }}
    .role-tab.active {{ background: #fff; border-color: rgba(15,95,100,.22); box-shadow: 0 8px 24px rgba(15,95,100,.08); }}
    .role-tab-name {{ display: block; font-weight: 700; font-size: 15px; }}
    .role-tab-meta {{ display: block; margin-top: 3px; font-size: 12px; color: var(--muted); }}
    .role-panel {{ display: none; padding: 22px; }}
    .role-panel.active {{ display: block; }}
    .role-head, .scenario-hero {{ display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; }}
    .role-head {{ margin-bottom: 16px; }}
    .role-kicker, .scenario-eyebrow, .meta-title {{ color: var(--brand); font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }}
    h2 {{ margin: 6px 0 8px; font-size: 28px; line-height: 1.08; }}
    h3 {{ margin: 6px 0 8px; font-size: 26px; line-height: 1.08; }}
    .role-head p, .scenario-summary {{ margin: 0; color: var(--muted); max-width: 880px; }}
    .role-score, .scenario-score {{ min-width: 120px; padding: 12px 14px; border-radius: 18px; background: #fff; border: 1px solid var(--line); text-align: right; }}
    .role-score span, .scenario-score span {{ display: block; color: var(--muted); font-size: 12px; }}
    .role-score strong, .scenario-score strong {{ display: block; margin-top: 4px; font-size: 28px; line-height: 1; }}
    .scene-tabbar {{ display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 18px; }}
    .scene-tab {{ min-width: 176px; padding: 12px 14px; border-radius: 16px; border: 1px solid var(--line); background: rgba(255,255,255,.52); text-align: left; }}
    .scene-tab.active {{ background: #fff; border-color: rgba(15,95,100,.22); box-shadow: 0 8px 20px rgba(15,95,100,.06); }}
    .scene-tab-name {{ display: block; font-weight: 700; font-size: 14px; line-height: 1.25; }}
    .scene-tab-score {{ display: block; margin-top: 5px; color: var(--muted); font-size: 12px; }}
    .scenario-panel {{ display: none; }}
    .scenario-panel.active {{ display: block; }}
    .source-row {{ display: flex; gap: 8px; flex-wrap: wrap; margin: 0 0 10px; }}
    .source-badge {{ display: inline-flex; padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }}
    .source-badge.context {{ background: var(--brand-soft); color: var(--brand); }}
    .source-badge.supplement {{ background: var(--accent-soft); color: #8b5300; }}
    .inline-note {{ margin: 14px 0; padding: 12px 14px; border-radius: 14px; background: var(--accent-soft); color: #6b4609; }}
    .journey-track {{ display: flex; gap: 18px; overflow-x: auto; padding: 6px 4px 14px; margin-bottom: 18px; }}
    .journey-step {{ position: relative; flex: 0 0 min(340px, 78vw); }}
    .journey-node {{ background: linear-gradient(180deg, rgba(255,255,255,.98), rgba(255,250,242,.96)); border: 1px solid var(--line); border-radius: 18px; padding: 14px 16px; box-shadow: 0 12px 26px rgba(31,36,48,.06); }}
    .journey-step.strongest .journey-node {{ border-color: rgba(17,122,90,.28); box-shadow: 0 12px 26px rgba(17,122,90,.10); }}
    .journey-step.weakest .journey-node {{ border-color: rgba(180,35,24,.24); box-shadow: 0 12px 26px rgba(180,35,24,.08); }}
    .journey-index {{ color: var(--muted); font-size: 12px; margin-bottom: 6px; }}
    .journey-stage {{ font-size: 18px; font-weight: 700; line-height: 1.25; }}
    .journey-score-row {{ display: flex; align-items: center; gap: 8px; margin-top: 10px; }}
    .score-pill, .mini-badge {{ display: inline-flex; align-items: center; justify-content: center; min-width: 58px; padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }}
    .score-pill.high {{ background: var(--good-soft); color: var(--good); }}
    .score-pill.mid {{ background: var(--brand-soft); color: var(--brand); }}
    .score-pill.low {{ background: var(--accent-soft); color: var(--accent); }}
    .score-pill.bad {{ background: var(--danger-soft); color: var(--danger); }}
    .mini-badge.strongest {{ background: var(--good-soft); color: var(--good); min-width: auto; }}
    .mini-badge.weakest {{ background: var(--danger-soft); color: var(--danger); min-width: auto; }}
    .journey-card {{ margin-top: 10px; min-height: 180px; background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 14px 16px; }}
    .journey-point {{ margin: 0 0 12px; font-size: 15px; }}
    .journey-evidence {{ margin: 0; color: var(--muted); font-size: 13px; }}
    .journey-connector {{ position: absolute; top: 44px; right: -18px; width: 18px; height: 2px; background: linear-gradient(90deg, rgba(15,95,100,.35), rgba(207,122,0,.35)); }}
    .scenario-meta {{ display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 14px; }}
    .meta-card {{ background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: 16px; }}
    .meta-card ul {{ margin: 0; padding-left: 18px; }}
    .metric-grid {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }}
    .metric-grid.compact {{ grid-template-columns: repeat(3, minmax(0, 1fr)); }}
    .metric {{ border-radius: 14px; background: rgba(255,255,255,.72); border: 1px solid var(--line); padding: 10px; }}
    .metric span {{ display: block; color: var(--muted); font-size: 11px; margin-bottom: 3px; }}
    .metric strong {{ font-size: 18px; line-height: 1; }}
    .chip-row {{ display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }}
    .repo-chip {{ display: inline-flex; padding: 6px 10px; border-radius: 999px; background: var(--brand-soft); color: var(--brand); font-size: 12px; font-weight: 600; }}
    .repo-chip.risk {{ background: var(--danger-soft); color: var(--danger); }}
    .repo-ref-list {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }}
    .repo-ref {{ display: inline-flex; padding: 6px 10px; border-radius: 10px; background: rgba(255,255,255,.86); border: 1px solid var(--line); color: var(--brand); font-size: 12px; }}
    .repo-ref.plain {{ color: var(--text); }}
    .evidence-links {{ display: flex; flex-direction: column; gap: 6px; font-size: 14px; }}
    .score-table {{ width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }}
    .score-table th, .score-table td {{ padding: 8px 8px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }}
    @media (max-width: 1080px) {{ .hero-summary, .scenario-meta {{ grid-template-columns: 1fr 1fr; }} }}
    @media (max-width: 760px) {{
      .page {{ width: min(100vw - 16px, 1440px); margin: 8px auto 18px; }}
      .hero, .role-panel {{ padding: 18px; }}
      .role-head, .scenario-hero {{ flex-direction: column; }}
      .hero-summary, .scenario-meta, .metric-grid {{ grid-template-columns: 1fr; }}
      .journey-step {{ flex-basis: 88vw; }}
    }}
  </style>
</head>
<body>
  <div class="page">
    <header class="hero">
      <div class="eyebrow">Context Skeleton + Research Supplement</div>
      <h1>CANN 角色与旅程体验报告</h1>
      <p>这版仍然按角色切换、角色内按场景切换，并且把每个场景的阶段旅程可视化出来。现在页面上的分数已经统一按实际规则计算，不再只是解释口径。</p>
      <div class="hero-summary">
        <div class="summary-card"><span>角色切换</span><strong>顶部 Tab</strong>先按角色切换，不把不同角色混在一页。</div>
        <div class="summary-card"><span>场景切换</span><strong>角色内多场景</strong>每个角色单独维护自己的场景组。</div>
        <div class="summary-card"><span>旅程展示</span><strong>横向旅程轨道</strong>每个场景按阶段顺序可视化。</div>
        <div class="summary-card"><span>评分逻辑</span><strong>真实规则</strong>阶段分和场景分都按当前页面所写规则计算。</div>
      </div>
    </header>
    {method_html()}
    <nav class="role-tabbar">{''.join(role_tabs)}</nav>
    <main>{''.join(role_panels)}</main>
  </div>
  <script>
    const roleTabs = Array.from(document.querySelectorAll('[data-role-tab]'));
    const rolePanels = Array.from(document.querySelectorAll('.role-panel'));
    const sceneTabs = Array.from(document.querySelectorAll('.scene-tab'));
    const scenePanels = Array.from(document.querySelectorAll('.scenario-panel'));
    function activateRole(roleId) {{
      roleTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.roleTab === roleId));
      rolePanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.role === roleId));
      const roleSceneTabs = sceneTabs.filter((tab) => tab.dataset.roleTarget === roleId);
      const activeSceneTab = roleSceneTabs.find((tab) => tab.classList.contains('active')) || roleSceneTabs[0];
      if (activeSceneTab) activateScene(roleId, activeSceneTab.dataset.sceneTarget);
    }}
    function activateScene(roleId, sceneId) {{
      sceneTabs.filter((tab) => tab.dataset.roleTarget === roleId).forEach((tab) => tab.classList.toggle('active', tab.dataset.sceneTarget === sceneId));
      scenePanels.filter((panel) => panel.dataset.rolePanel === roleId).forEach((panel) => panel.classList.toggle('active', panel.dataset.scenePanel === sceneId));
    }}
    roleTabs.forEach((tab) => tab.addEventListener('click', () => activateRole(tab.dataset.roleTab)));
    sceneTabs.forEach((tab) => tab.addEventListener('click', () => activateScene(tab.dataset.roleTarget, tab.dataset.sceneTarget)));
    if (roleTabs.length) activateRole(roleTabs[0].dataset.roleTab);
  </script>
</body>
</html>
"""


def main():
    observations = load_json("cann-agentic-observations.json")
    obs_map = {item["repo"]: item for item in observations}
    role_summaries = [role_summary(role, obs_map) for role in ROLE_SCENES]
    (ROOT / "context-journey-report.md").write_text(render_md(role_summaries), encoding="utf-8")
    (ROOT / "05-context-journey-report.html").write_text(render_html(role_summaries), encoding="utf-8")


if __name__ == "__main__":
    main()
