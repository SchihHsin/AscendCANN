import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE_ROOT = ROOT / "repo-evidence"


def load_json(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def h(value):
    return html.escape(str(value))


def clamp(v, low=0, high=100):
    return max(low, min(high, round(v, 2)))


PERSONAS = [
    {
        "id": "sample_consumer",
        "name": "样例体验型开发者",
        "scene": "想尽快跑通一个 CANN 上的样例，验证“这个生态对我有没有用”。",
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
    },
    {
        "id": "model_adapter",
        "name": "模型/框架适配工程师",
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
    },
    {
        "id": "operator_developer",
        "name": "算子/库开发者",
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
    },
    {
        "id": "system_engineer",
        "name": "系统/通信工程师",
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
    },
    {
        "id": "industry_builder",
        "name": "行业方案开发者",
        "scene": "想直接复用行业场景仓库，验证是否能支撑业务 PoC 或领域方案开发。",
        "repos": [
            "elec-ops-inspection",
            "elec-ops-prediction",
            "elec-ops-simulation",
            "mat-chem-sim-pred",
        ],
        "evidence_links": [
            ("observations JSON", ROOT / "cann-agentic-observations.json"),
            ("repo coverage JSON", ROOT / "cann-repo-coverage.json"),
        ],
    },
]


STAGES = [
    ("discover", "发现入口"),
    ("path_fit", "判断是否适合我"),
    ("get_code", "获取代码与资源"),
    ("env_setup", "环境准备"),
    ("first_run", "首次运行"),
    ("verify", "验证结果"),
    ("extend", "深入扩展/回归"),
]


def score_stage(obs):
    d = obs["scores"]["dimensions"]
    docs = d["documentation_onboarding_20"] / 20 * 100
    discover = d["discoverability_15"] / 15 * 100
    setup = d["setup_explicitness_20"] / 20 * 100
    run = d["run_affordance_20"] / 20 * 100
    verify = d["verification_regression_15"] / 15 * 100
    auto = d["automation_friendliness_10"] / 10 * 100
    friction_inverse = (20 - d["friction_penalty_20"]) / 20 * 100
    confidence = obs["scores"]["confidence_score"]
    local = obs["local_observation"]["local_status"]

    local_bonus = 100 if local == "full" else 70 if local in {"git_only", "incomplete"} else 0

    return {
        "discover": clamp(discover * 0.55 + docs * 0.45),
        "path_fit": clamp(docs * 0.35 + setup * 0.20 + run * 0.15 + friction_inverse * 0.30),
        "get_code": clamp(setup * 0.25 + docs * 0.20 + run * 0.10 + verify * 0.05 + confidence * 0.20 + friction_inverse * 0.20),
        "env_setup": clamp(setup * 0.35 + docs * 0.20 + auto * 0.10 + friction_inverse * 0.35),
        "first_run": clamp(run * 0.35 + setup * 0.15 + verify * 0.10 + auto * 0.10 + friction_inverse * 0.30 + local_bonus * 0.05),
        "verify": clamp(verify * 0.45 + run * 0.15 + docs * 0.20 + auto * 0.20),
        "extend": clamp(auto * 0.30 + verify * 0.25 + docs * 0.20 + setup * 0.10 + run * 0.15),
    }


def avg(values):
    return round(sum(values) / len(values), 2) if values else 0.0


def make_persona_summary(persona, observations_by_repo):
    repos = [observations_by_repo[name] for name in persona["repos"] if name in observations_by_repo]
    stage_rows = [score_stage(repo) for repo in repos]
    stage_scores = {
        key: avg([row[key] for row in stage_rows])
        for key, _ in STAGES
    }
    stage_weights = {
        "discover": 0.10,
        "path_fit": 0.15,
        "get_code": 0.10,
        "env_setup": 0.20,
        "first_run": 0.20,
        "verify": 0.10,
        "extend": 0.15,
    }
    overall = round(sum(stage_scores[k] * stage_weights[k] for k in stage_scores), 2)

    remote = [r["remote_observation"] for r in repos]
    local = [r["local_observation"] for r in repos]

    coverage = {
        "repo_count": len(repos),
        "readme_coverage": round(sum(1 for r in remote if r["readme_length"] > 0) * 100 / len(repos), 1) if repos else 0,
        "docs_coverage": round(sum(1 for r in remote if r["has_doc_dir"]) * 100 / len(repos), 1) if repos else 0,
        "examples_coverage": round(sum(1 for r in remote if r["has_example_dir"]) * 100 / len(repos), 1) if repos else 0,
        "tests_coverage": round(sum(1 for r in remote if r["has_test_dir"]) * 100 / len(repos), 1) if repos else 0,
        "scripts_coverage": round(sum(1 for r in remote if r["has_script_dir"]) * 100 / len(repos), 1) if repos else 0,
        "package_coverage": round(sum(1 for r in remote if r["package_files"]) * 100 / len(repos), 1) if repos else 0,
        "avg_readme_length": avg([r["readme_length"] for r in remote]),
        "avg_friction_hits": avg([r["friction_hits_total"] for r in remote]),
        "full_local_count": sum(1 for r in local if r["local_status"] == "full"),
        "incomplete_local_count": sum(1 for r in local if r["local_status"] in {"git_only", "incomplete"}),
    }

    sorted_repos = sorted(repos, key=lambda x: (-x["scores"]["weighted_score"], x["repo"]))
    top = [r["repo"] for r in sorted_repos[:3]]
    bottom = [r["repo"] for r in sorted(repos, key=lambda x: (x["scores"]["weighted_score"], x["repo"]))[:3]]

    if persona["id"] == "sample_consumer":
        blockers = [
            "样例仓库文档可读，但首次运行前的环境与权重准备摩擦仍然最高。",
            "同一类任务分散在多个 recipe 仓库，用户很难快速判断哪个入口最适合当前目标。",
            "本地强证据主要来自 embodied/spatial 两个代表样本，说明“能看懂”和“能跑通”之间仍有明显落差。",
        ]
    elif persona["id"] == "model_adapter":
        blockers = [
            "模型适配类仓库的文档通常够长，但路径经常跨上游仓库、权重、框架后端和环境依赖。",
            "从“找到方案”到“完成首次运行”的中间断点最多，说明适配成本主要消耗在拼装过程而不是知识发现本身。",
            "这类用户最需要的是标准化迁移模板和外部依赖清单，而不是更多分散 README。",
        ]
    elif persona["id"] == "operator_developer":
        blockers = [
            "算子/库类仓库的结构化程度明显更高，说明这条旅程的主要问题不是文档，而是工具链环境门槛。",
            "仓库层面的可编排性不错，但只有少量仓库进入了 A 级本地验证，意味着高置信体验结论仍偏少。",
            "对这类用户来说，‘环境可自检’比‘文档再增加一页’更能改善实际体验。",
        ]
    elif persona["id"] == "system_engineer":
        blockers = [
            "系统/通信类仓库在结构化入口上成熟，但用户体验的主阻塞并不是仓库组织，而是设备、驱动、编译链和集群前提。",
            "也就是说，这类仓库的 UX 问题更偏‘环境体验’，而不是‘仓库信息架构体验’。",
            "如果不提供无设备预演、自检和快速失败反馈，这类角色的首次成功率仍然会很低。",
        ]
    else:
        blockers = [
            "行业方案仓的价值主张清楚，但“拿来做 PoC”的路径不够清晰，导致业务用户难以快速确认可用性。",
            "这类仓库在 README、examples、tests 上的可运行信号偏少，更像成果陈列而不是可直接复用的方案包。",
            "对行业用户来说，‘一个最小可跑场景’往往比‘完整领域叙述’更关键。",
        ]

    return {
        "id": persona["id"],
        "name": persona["name"],
        "scene": persona["scene"],
        "repo_count": len(repos),
        "stage_scores": stage_scores,
        "overall_score": overall,
        "coverage": coverage,
        "top_repos": top,
        "bottom_repos": bottom,
        "blockers": blockers,
        "evidence_links": persona["evidence_links"],
    }


def overall_conclusions(persona_summaries):
    sorted_personas = sorted(persona_summaries, key=lambda x: (-x["overall_score"], x["name"]))
    return {
        "highest": sorted_personas[0],
        "lowest": sorted_personas[-1],
        "environment_heavy_personas": [
            p["name"]
            for p in persona_summaries
            if p["stage_scores"]["env_setup"] < 65 or p["stage_scores"]["first_run"] < 60
        ],
    }


def render_markdown(persona_summaries, conclusions):
    lines = []
    lines.append("# CANN 用户体验旅程 Agentic 评分报告")
    lines.append("")
    lines.append("更新时间：2026-05-14  ")
    lines.append("工作目录：`D:\\HW\\AscendCANN\\cann-dashboard`")
    lines.append("")
    lines.append("## 1. 这份报告的目标")
    lines.append("")
    lines.append("这不是一份“仓库排行榜”，而是一份面向用户体验分析的报告。")
    lines.append("主问题不是“哪个仓库分高”，而是：")
    lines.append("")
    lines.append("- 不同角色在不同场景下，走 CANN 这条旅程时，会在哪个阶段卡住？")
    lines.append("- 这些断点更像“内容缺失”，还是“环境摩擦”，还是“入口不清楚”？")
    lines.append("- 哪些结论有强证据，哪些结论仍然只是远程可观测推断？")
    lines.append("")
    lines.append("## 2. 报告结构")
    lines.append("")
    lines.append("这次我把全量数据重新组织成 `角色 - 场景 - 旅程阶段` 的 UX 叙事：")
    lines.append("")
    lines.append("1. 先按角色定义典型场景")
    lines.append("2. 再按统一旅程阶段打分")
    lines.append("3. 最后用仓库数据作为证据层解释这些分数")
    lines.append("")
    lines.append("旅程阶段统一为：")
    lines.append("")
    for _, stage_name in STAGES:
        lines.append(f"- `{stage_name}`")
    lines.append("")
    lines.append("## 3. 评分方法")
    lines.append("")
    lines.append("这次不是直接给角色“拍分”，而是分两层算：")
    lines.append("")
    lines.append("### 3.1 仓库级可观测证据")
    lines.append("")
    lines.append("每个仓库都先根据 README、docs、examples、tests、package/build 入口、运行信号、摩擦信号、本地验证状态生成一个基础观测结果。")
    lines.append("")
    lines.append("### 3.2 角色级旅程阶段分")
    lines.append("")
    lines.append("再把同一角色相关的一组仓库聚合成旅程阶段分。")
    lines.append("例如：")
    lines.append("")
    lines.append("- `发现入口` 主要看 discoverability + documentation")
    lines.append("- `环境准备` 主要看 setup_explicitness + friction_penalty")
    lines.append("- `首次运行` 主要看 run_affordance + verification + friction_penalty + 本地状态")
    lines.append("")
    lines.append("也就是说，仓库数据不再是最终结论本身，而是用户旅程阶段分的证据来源。")
    lines.append("")
    lines.append("## 4. 总体结论")
    lines.append("")
    lines.append(f"- 体验最佳的角色是：`{conclusions['highest']['name']}`，综合分 `{conclusions['highest']['overall_score']}`")
    lines.append(f"- 体验最弱的角色是：`{conclusions['lowest']['name']}`，综合分 `{conclusions['lowest']['overall_score']}`")
    lines.append(f"- 共同问题最重的阶段集中在：`环境准备 / 首次运行`，受影响角色包括：{', '.join(conclusions['environment_heavy_personas'])}")
    lines.append("")
    lines.append("一句话判断：")
    lines.append("")
    lines.append("CANN 现在的问题，不是“没有仓库内容”，而是“内容很多，但不同角色进入后，前 1 小时的体验链路不够顺滑”。")
    lines.append("")
    for idx, persona in enumerate(persona_summaries, 1):
        lines.append(f"## {idx + 4}. {persona['name']}")
        lines.append("")
        lines.append(f"场景：{persona['scene']}")
        lines.append("")
        lines.append(f"相关仓库数：`{persona['repo_count']}`  ")
        lines.append(f"综合体验分：`{persona['overall_score']}`")
        lines.append("")
        lines.append("| 旅程阶段 | 分数 |")
        lines.append("|---|---:|")
        for key, stage_name in STAGES:
            lines.append(f"| {stage_name} | {persona['stage_scores'][key]} |")
        lines.append("")
        lines.append("### 证据摘要")
        lines.append("")
        c = persona["coverage"]
        lines.append(f"- README 覆盖率：`{c['readme_coverage']}%`")
        lines.append(f"- docs 覆盖率：`{c['docs_coverage']}%`")
        lines.append(f"- examples 覆盖率：`{c['examples_coverage']}%`")
        lines.append(f"- tests 覆盖率：`{c['tests_coverage']}%`")
        lines.append(f"- script/tool 入口覆盖率：`{c['scripts_coverage']}%`")
        lines.append(f"- package/build 入口覆盖率：`{c['package_coverage']}%`")
        lines.append(f"- 平均 README 长度：`{c['avg_readme_length']}`")
        lines.append(f"- 平均摩擦信号数：`{c['avg_friction_hits']}`")
        lines.append(f"- 本地完整验证数：`{c['full_local_count']}`")
        lines.append(f"- 本地不完整/空壳验证数：`{c['incomplete_local_count']}`")
        lines.append("")
        lines.append("### 用户体验分析")
        lines.append("")
        for blocker in persona["blockers"]:
            lines.append(f"- {blocker}")
        lines.append("")
        lines.append(f"### 相关仓库中相对最强的入口")
        lines.append("")
        for name in persona["top_repos"]:
            lines.append(f"- `{name}`")
        lines.append("")
        lines.append(f"### 相关仓库中最可能造成误判/卡顿的入口")
        lines.append("")
        for name in persona["bottom_repos"]:
            lines.append(f"- `{name}`")
        lines.append("")
        lines.append("### 直接证据")
        lines.append("")
        for label, path in persona["evidence_links"]:
            lines.append(f"- [{label}]({path})")
        lines.append("")
    lines.append("## 10. 最后的 UX 结论")
    lines.append("")
    lines.append("如果用 UX 语言总结，而不是用仓库语言总结，这份报告的核心发现是：")
    lines.append("")
    lines.append("1. `入口问题`")
    lines.append("   - 用户不是找不到内容，而是不知道“先看哪个、先跑哪个、哪个适合自己”。")
    lines.append("2. `准备阶段问题`")
    lines.append("   - 环境、权重、外部依赖、上游仓和工具链把很多旅程卡死在首次成功之前。")
    lines.append("3. `反馈问题`")
    lines.append("   - 很多仓库能让用户读懂，但不能让用户快速确认“我现在离成功还有多远”。")
    lines.append("4. `角色分层问题`")
    lines.append("   - 样例用户、适配工程师、算子开发者、系统工程师、行业方案开发者，其实不是同一条旅程；入口设计也不应该混在一起。")
    lines.append("")
    lines.append("所以最应该改的不是“再补几份 README”，而是：")
    lines.append("")
    lines.append("- 先按角色和目标重新组织入口")
    lines.append("- 再给每条旅程补最小可运行路径")
    lines.append("- 最后用环境自检、权重检查和失败反馈降低前 1 小时摩擦")
    lines.append("")
    lines.append("## 11. 原始数据与方法文件")
    lines.append("")
    lines.append(f"- [journey-agentic-report.html]({ROOT / 'journey-agentic-report.html'})")
    lines.append(f"- [cann-agentic-summary.json]({ROOT / 'cann-agentic-summary.json'})")
    lines.append(f"- [cann-agentic-observations.json]({ROOT / 'cann-agentic-observations.json'})")
    lines.append(f"- [scripts/analyze_cann_repos.py]({ROOT / 'scripts' / 'analyze_cann_repos.py'})")
    lines.append(f"- [scripts/render_ux_journey_report.py]({ROOT / 'scripts' / 'render_ux_journey_report.py'})")
    return "\n".join(lines) + "\n"


def score_badge(score):
    if score >= 80:
        return "high"
    if score >= 60:
        return "mid"
    if score >= 40:
        return "low"
    return "bad"


def render_html(persona_summaries, conclusions):
    persona_sections = []
    for persona in persona_summaries:
        stage_rows = "\n".join(
            f"<tr><td>{h(stage_name)}</td><td><span class=\"score {score_badge(persona['stage_scores'][key])}\">{persona['stage_scores'][key]}</span></td></tr>"
            for key, stage_name in STAGES
        )
        coverage = persona["coverage"]
        evidence_html = "".join(
            f"<a href=\"{h(path)}\">{h(label)}</a><br />"
            for label, path in persona["evidence_links"]
        )
        blockers_html = "".join(f"<li>{h(text)}</li>" for text in persona["blockers"])
        top_html = "".join(f"<span class=\"tag\">{h(name)}</span>" for name in persona["top_repos"])
        bottom_html = "".join(f"<span class=\"tag warn\">{h(name)}</span>" for name in persona["bottom_repos"])
        persona_sections.append(
            f"""
            <section id="{h(persona['id'])}">
              <h2>{h(persona['name'])}</h2>
              <p class="lead-mini"><strong>场景：</strong>{h(persona['scene'])}</p>
              <div class="summary-row">
                <div class="summary-pill"><strong>相关仓库</strong>{persona['repo_count']} 个</div>
                <div class="summary-pill"><strong>综合体验分</strong>{persona['overall_score']}</div>
              </div>
              <div class="grid-2">
                <div class="card">
                  <h4>旅程阶段评分</h4>
                  <table class="score-table small">
                    <thead><tr><th>阶段</th><th>分数</th></tr></thead>
                    <tbody>{stage_rows}</tbody>
                  </table>
                </div>
                <div class="card">
                  <h4>证据摘要</h4>
                  <ul>
                    <li>README 覆盖率：{coverage['readme_coverage']}%</li>
                    <li>docs 覆盖率：{coverage['docs_coverage']}%</li>
                    <li>examples 覆盖率：{coverage['examples_coverage']}%</li>
                    <li>tests 覆盖率：{coverage['tests_coverage']}%</li>
                    <li>script/tool 入口覆盖率：{coverage['scripts_coverage']}%</li>
                    <li>package/build 入口覆盖率：{coverage['package_coverage']}%</li>
                    <li>平均 README 长度：{coverage['avg_readme_length']}</li>
                    <li>平均摩擦信号数：{coverage['avg_friction_hits']}</li>
                    <li>本地完整验证：{coverage['full_local_count']} 个</li>
                    <li>本地不完整/空壳验证：{coverage['incomplete_local_count']} 个</li>
                  </ul>
                </div>
              </div>
              <div class="grid-2">
                <div class="card">
                  <h4>用户体验分析</h4>
                  <ul>{blockers_html}</ul>
                </div>
                <div class="card">
                  <h4>代表性入口</h4>
                  <p>相对最强：</p>
                  <div class="tag-row">{top_html}</div>
                  <p>最可能造成误判/卡顿：</p>
                  <div class="tag-row">{bottom_html}</div>
                </div>
              </div>
              <div class="card evidence-card">
                <h4>直接证据</h4>
                {evidence_html}
              </div>
            </section>
            """
        )

    toc_links = "".join(f"<a href=\"#{h(p['id'])}\">{h(p['name'])}</a>" for p in persona_summaries)
    html_text = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CANN 用户体验旅程 Agentic 评分报告</title>
  <style>
    :root {{
      --bg: #f4f1ea;
      --panel: rgba(255,252,246,0.92);
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
    }}
    * {{ box-sizing: border-box; }}
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
    .shell {{ width: min(1280px, calc(100vw - 32px)); margin: 24px auto 48px; }}
    .hero, section {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 24px;
      box-shadow: var(--shadow);
    }}
    .hero {{ overflow: hidden; }}
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
    }}
    h1 {{ margin: 14px 0 12px; font-size: clamp(30px, 4vw, 48px); line-height: 1.08; }}
    .lead {{ max-width: 860px; color: var(--muted); font-size: 16px; margin: 0 0 10px; }}
    .lead-mini {{ color: var(--muted); }}
    .meta {{ display: grid; gap: 10px; min-width: 280px; }}
    .meta-card {{
      background: rgba(255,255,255,.75);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 14px 16px;
    }}
    .meta-card strong {{
      display: block;
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: .08em;
    }}
    .hero-grid {{
      padding: 8px 32px 32px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }}
    .stat {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
    }}
    .stat .k {{
      font-size: 12px;
      text-transform: uppercase;
      color: var(--muted);
      letter-spacing: .08em;
      margin-bottom: 8px;
    }}
    .stat .v {{
      font-size: 28px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 8px;
    }}
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
    .toc a {{
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(13,92,99,.08);
      color: var(--brand);
      font-size: 14px;
      font-weight: 600;
    }}
    section {{ margin-top: 18px; padding: 28px 30px; }}
    section h2 {{ margin: 0 0 12px; font-size: 28px; line-height: 1.15; }}
    section h4 {{ margin: 0 0 8px; font-size: 17px; }}
    p {{ margin: 10px 0; }}
    ul {{ margin: 10px 0 10px 20px; padding: 0; }}
    li + li {{ margin-top: 6px; }}
    .grid-2 {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
      margin-top: 16px;
    }}
    .card {{
      background: var(--panel-strong);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
    }}
    .callout {{
      padding: 16px 18px;
      border-radius: 16px;
      border-left: 4px solid var(--accent);
      background: rgba(217,119,6,.08);
      color: #5a3a0a;
      margin: 16px 0;
    }}
    .warning {{
      border-left-color: var(--danger);
      background: rgba(180,35,24,.08);
      color: #6a251d;
    }}
    .summary-row {{
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin: 8px 0 0;
    }}
    .summary-pill {{
      padding: 8px 12px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(255,255,255,.75);
      font-size: 14px;
    }}
    .score-table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 14px;
    }}
    .score-table th, .score-table td {{
      padding: 9px 10px;
      border-bottom: 1px solid var(--line);
      text-align: left;
    }}
    .score-table th {{
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .05em;
    }}
    .small td {{ font-size: 13px; }}
    .score {{
      display: inline-block;
      min-width: 58px;
      padding: 4px 10px;
      border-radius: 999px;
      font-weight: 700;
      text-align: center;
    }}
    .score.high {{ background: rgba(19,121,91,.12); color: var(--good); }}
    .score.mid {{ background: rgba(13,92,99,.12); color: var(--brand); }}
    .score.low {{ background: rgba(217,119,6,.12); color: var(--accent); }}
    .score.bad {{ background: rgba(180,35,24,.12); color: var(--danger); }}
    .tag-row {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }}
    .tag {{
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(13,92,99,.08);
      color: var(--brand);
      font-size: 13px;
      font-weight: 600;
    }}
    .tag.warn {{
      background: rgba(180,35,24,.08);
      color: var(--danger);
    }}
    .evidence-card {{
      margin-top: 16px;
    }}
    @media (max-width: 900px) {{
      .hero-grid, .grid-2 {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>
  <div class="shell">
    <header class="hero">
      <div class="hero-top">
        <div>
          <div class="eyebrow">User Journey First, Data As Evidence</div>
          <h1>CANN 用户体验旅程<br />Agentic 评分报告</h1>
          <p class="lead">
            这份报告不再把仓库当主角，而是把不同角色的不同场景和旅程阶段放在前面。数据仍然保留，但现在只作为用户体验分析的证据层。
          </p>
        </div>
        <div class="meta">
          <div class="meta-card"><strong>角色数</strong>{len(persona_summaries)} 个</div>
          <div class="meta-card"><strong>全量覆盖</strong>65 个仓库</div>
          <div class="meta-card"><strong>原始数据</strong><code>{h(ROOT / 'cann-agentic-observations.json')}</code></div>
        </div>
      </div>
      <div class="hero-grid">
        <div class="stat">
          <div class="k">最佳体验角色</div>
          <div class="v">{h(conclusions['highest']['name'])}</div>
          <div class="d">综合分 {conclusions['highest']['overall_score']}</div>
        </div>
        <div class="stat">
          <div class="k">最弱体验角色</div>
          <div class="v">{h(conclusions['lowest']['name'])}</div>
          <div class="d">综合分 {conclusions['lowest']['overall_score']}</div>
        </div>
        <div class="stat">
          <div class="k">共同断点</div>
          <div class="v">环境 / 首跑</div>
          <div class="d">多数角色在前 1 小时内会被环境准备和首次运行卡住</div>
        </div>
        <div class="stat">
          <div class="k">结论边界</div>
          <div class="v">证据分级</div>
          <div class="d">仓库数据仍保留证据强度，不把远程可读和本地验证混为一谈</div>
        </div>
      </div>
    </header>

    <nav class="toc">
      <a href="#goal">目标</a>
      <a href="#method">方法</a>
      <a href="#overall">总体结论</a>
      {toc_links}
      <a href="#raw">原始数据</a>
    </nav>

    <section id="goal">
      <h2>这份报告的目标</h2>
      <p>这不是一份“仓库排行榜”，而是一份面向用户体验分析的报告。</p>
      <ul>
        <li>问题一：不同角色在不同场景下，会在哪个旅程阶段卡住？</li>
        <li>问题二：这些断点更像入口问题、环境问题、还是反馈问题？</li>
        <li>问题三：哪些结论已经有强证据，哪些仍然只是远程可观测推断？</li>
      </ul>
      <div class="callout warning">
        所以这次的主叙事是“角色 - 场景 - 阶段”，不是“仓库 - 分数 - 排名”。
      </div>
    </section>

    <section id="method">
      <h2>方法</h2>
      <p>这次分两层算：</p>
      <div class="grid-2">
        <div class="card">
          <h4>仓库级证据层</h4>
          <p>从 65 个仓库抓取 README、docs、examples、tests、package/build/script 入口、本地状态和摩擦信号。</p>
        </div>
        <div class="card">
          <h4>角色级旅程层</h4>
          <p>把同一角色相关仓库聚合成用户旅程阶段分，再输出 UX 结论。</p>
        </div>
      </div>
      <p>统一旅程阶段：</p>
      <ul>
        <li>发现入口</li>
        <li>判断是否适合我</li>
        <li>获取代码与资源</li>
        <li>环境准备</li>
        <li>首次运行</li>
        <li>验证结果</li>
        <li>深入扩展/回归</li>
      </ul>
    </section>

    <section id="overall">
      <h2>总体结论</h2>
      <p>CANN 现在的问题，不是“没有仓库内容”，而是“内容很多，但不同角色进入后，前 1 小时的体验链路不够顺滑”。</p>
      <ul>
        <li>最佳体验角色：{h(conclusions['highest']['name'])}，综合分 {conclusions['highest']['overall_score']}</li>
        <li>最弱体验角色：{h(conclusions['lowest']['name'])}，综合分 {conclusions['lowest']['overall_score']}</li>
        <li>共同断点最重的阶段：环境准备 / 首次运行</li>
        <li>这说明主问题不是“用户找不到内容”，而是“找到了也不容易顺利推进到成功”</li>
      </ul>
    </section>

    {''.join(persona_sections)}

    <section id="raw">
      <h2>原始数据与方法文件</h2>
      <ul>
        <li><a href="{h(ROOT / 'cann-agentic-summary.json')}">cann-agentic-summary.json</a></li>
        <li><a href="{h(ROOT / 'cann-agentic-observations.json')}">cann-agentic-observations.json</a></li>
        <li><a href="{h(ROOT / 'cann-repo-coverage.json')}">cann-repo-coverage.json</a></li>
        <li><a href="{h(ROOT / 'scripts' / 'analyze_cann_repos.py')}">analyze_cann_repos.py</a></li>
        <li><a href="{h(ROOT / 'scripts' / 'render_ux_journey_report.py')}">render_ux_journey_report.py</a></li>
      </ul>
      <div class="callout">
        如果后续还要继续提升可信度，最有效的方法不是继续调分，而是把更多关键角色的核心仓库推进到 A 级本地验证。
      </div>
    </section>
  </div>
</body>
</html>
"""
    return html_text


def main():
    observations = load_json("cann-agentic-observations.json")
    observations_by_repo = {item["repo"]: item for item in observations}
    persona_summaries = [make_persona_summary(p, observations_by_repo) for p in PERSONAS]
    conclusions = overall_conclusions(persona_summaries)
    md_text = render_markdown(persona_summaries, conclusions)
    html_text = render_html(persona_summaries, conclusions)
    (ROOT / "journey-agentic-report.md").write_text(md_text, encoding="utf-8")
    (ROOT / "journey-agentic-report.html").write_text(html_text, encoding="utf-8")


if __name__ == "__main__":
    main()
