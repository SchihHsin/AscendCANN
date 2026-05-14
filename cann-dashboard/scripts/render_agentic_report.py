import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_json(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def pct(part, total):
    if not total:
        return "0%"
    return f"{round(part * 100 / total, 1)}%"


def score_class(score):
    if score >= 80:
        return "high"
    if score >= 60:
        return "mid"
    if score >= 40:
        return "low"
    return "bad"


def h(text):
    return html.escape(str(text))


def build_md(summary, observations):
    top = summary["top_10_by_weighted_score"]
    bottom = summary["bottom_10_by_weighted_score"]
    category_avg = summary["category_average_scores"]
    grade_dist = summary["evidence_grade_distribution"]
    local_dist = summary["local_status_distribution"]

    lines = []
    lines.append("# CANN GitCode 仓库全量 Agentic 评分报告")
    lines.append("")
    lines.append("更新时间：2026-05-14  ")
    lines.append("工作目录：`D:\\HW\\AscendCANN\\cann-dashboard`")
    lines.append("")
    lines.append("## 1. 这次报告和上一版有什么不同")
    lines.append("")
    lines.append("上一版主要由少量本地样本支撑，问题是全量覆盖和深度实测混在了一起。")
    lines.append("这次改成了 `65 仓库全量覆盖 + 证据分级 + 可追溯计算` 的方法。")
    lines.append("")
    lines.append(f"- `组织公开仓库枚举`：{summary['repo_headers']['total_count']} 个")
    lines.append(f"- `本地完整验证`：{local_dist.get('full', 0)} 个")
    lines.append(f"- `本地不完整/空壳验证`：{local_dist.get('git_only', 0) + local_dist.get('incomplete', 0)} 个")
    lines.append(f"- `仅远程内容观测`：{local_dist.get('enumerated_only', 0)} 个")
    lines.append("")
    lines.append("## 2. 数据来源")
    lines.append("")
    lines.append("这次分数直接来自三层数据：")
    lines.append("")
    lines.append("1. `GitCode 组织 API`")
    lines.append("   - 65 个公开仓库的名称、URL、语言、Star、创建时间、默认分支")
    lines.append("2. `GitCode 仓库内容 API`")
    lines.append("   - 根目录树")
    lines.append("   - README")
    lines.append("   - 根目录可见的 package / build / script / test / docs / examples 入口")
    lines.append("3. `本地验证`")
    lines.append("   - 已 clone 样本的完整性")
    lines.append("   - compileall 结果")
    lines.append("   - git-only / incomplete 状态")
    lines.append("")
    lines.append("原始数据文件：")
    lines.append("")
    lines.append(f"- [cann-agentic-summary.json]({ROOT / 'cann-agentic-summary.json'})")
    lines.append(f"- [cann-agentic-observations.json]({ROOT / 'cann-agentic-observations.json'})")
    lines.append(f"- [cann-repo-coverage.json]({ROOT / 'cann-repo-coverage.json'})")
    lines.append("")
    lines.append("## 3. 更新后的评分标准")
    lines.append("")
    lines.append("旧版“按 Persona 旅程阶段打总分”的方法不适合直接覆盖 65 个异构仓库。")
    lines.append("因为其中有样例仓库、算子仓库、系统仓库、社区治理仓库、模板仓库，它们并不共享同一条用户旅程。")
    lines.append("")
    lines.append("所以这次改成 `仓库级 Agentic 可推进度评分`，先对每个仓库打通用分，再按类别聚合。")
    lines.append("")
    lines.append("### 3.1 Observable Score")
    lines.append("")
    lines.append("`observable_score = discoverability(15) + documentation_onboarding(20) + setup_explicitness(20) + run_affordance(20) + verification_regression(15) + automation_friendliness(10) - friction_penalty(0..20)`")
    lines.append("")
    lines.append("各维度含义：")
    lines.append("")
    lines.append("- `discoverability_15`：描述、语言标识、Star 信号是否足以让开发者快速判断仓库用途")
    lines.append("- `documentation_onboarding_20`：README 是否存在、是否足够长、是否有 docs 目录、是否包含 setup 关键词")
    lines.append("- `setup_explicitness_20`：是否存在 requirements / setup.py / pyproject / CMakeLists / build.sh 等入口")
    lines.append("- `run_affordance_20`：是否存在 examples / demos / scripts，以及 README 中是否出现 run 命令")
    lines.append("- `verification_regression_15`：是否存在 tests / benchmark / eval / verify 等验证入口")
    lines.append("- `automation_friendliness_10`：是否具备适合脚本化推进的结构化入口")
    lines.append("- `friction_penalty_20`：README 中出现 `set_env.sh`、`torch-npu`、NPU 工具链、手动复制、额外 clone、权重手放等高摩擦信号时扣分；本地 git-only / incomplete 也额外扣分")
    lines.append("")
    lines.append("### 3.2 Confidence Score")
    lines.append("")
    lines.append("为了不把“远程看到了 README”和“本地真的跑过/验证过”混成一类，这次每个仓库都带 `证据等级`：")
    lines.append("")
    lines.append("- `A = 100`：本地完整树验证 + 命令级证据")
    lines.append("- `B+ = 70..85`：本地拿到不完整或空壳，但远程树/README 可读")
    lines.append("- `B = 75`：远程树 + README 可读")
    lines.append("- `C+ = 60`：远程树可读但 README 不可读")
    lines.append("- `C = 35`：只有元数据")
    lines.append("")
    lines.append("### 3.3 Final Score")
    lines.append("")
    lines.append("`weighted_score = observable_score × confidence_score / 100`")
    lines.append("")
    lines.append("这意味着：")
    lines.append("")
    lines.append("- `observable_score` 反映“从仓库表面和可访问内容看，体验看起来有多 agentic”")
    lines.append("- `confidence_score` 反映“这份判断的证据强度有多高”")
    lines.append("- `weighted_score` 才是最终排序使用的主分")
    lines.append("")
    lines.append("## 4. 全量结果摘要")
    lines.append("")
    lines.append(f"- `observable_average`：{summary['observable_average']}")
    lines.append(f"- `confidence_weighted_average`：{summary['confidence_weighted_average']}")
    lines.append("")
    lines.append("证据等级分布：")
    lines.append("")
    for grade, count in grade_dist.items():
        lines.append(f"- `{grade}`：{count} 个，占 {pct(count, summary['repo_count'])}")
    lines.append("")
    lines.append("本地状态分布：")
    lines.append("")
    for status, count in local_dist.items():
        lines.append(f"- `{status}`：{count} 个，占 {pct(count, summary['repo_count'])}")
    lines.append("")
    lines.append("类别平均分：")
    lines.append("")
    for key, value in category_avg.items():
        lines.append(f"- `{key}`：{value}")
    lines.append("")
    lines.append("解释：")
    lines.append("")
    lines.append("- `infra_operator = 80.89` 明显最高，说明算子/框架/系统型仓库在结构化入口、docs、tests、scripts 上整体更成熟")
    lines.append("- `app_recipe = 55.6` 中等偏低，说明 recipe 仓库内容有价值，但首次运行和外部依赖摩擦偏高")
    lines.append("- `community_governance = 32.12` 和 `industry_solution = 28.25` 低，不是因为这些仓库“差”，而是因为它们天然不是以“可脚本化运行体验”为主目标")
    lines.append("")
    lines.append("## 5. Top 10 仓库")
    lines.append("")
    lines.append("| repo | weighted | observable | confidence | grade |")
    lines.append("|---|---:|---:|---:|---|")
    for item in top:
        lines.append(f"| `{item['repo']}` | {item['weighted_score']} | {item['observable_score']} | {item['confidence_score']} | `{item['evidence_grade']}` |")
    lines.append("")
    lines.append("## 6. Bottom 10 仓库")
    lines.append("")
    lines.append("| repo | weighted | observable | confidence | grade |")
    lines.append("|---|---:|---:|---:|---|")
    for item in bottom:
        lines.append(f"| `{item['repo']}` | {item['weighted_score']} | {item['observable_score']} | {item['confidence_score']} | `{item['evidence_grade']}` |")
    lines.append("")
    lines.append("## 7. 具体计算例子")
    lines.append("")
    sample_names = ["hixl", "pyasc", "cann-recipes-spatial-intelligence", ".gitcode"]
    sample_map = {item["repo"]: item for item in observations if item["repo"] in sample_names}
    for repo_name in sample_names:
        if repo_name not in sample_map:
            continue
        item = sample_map[repo_name]
        d = item["scores"]["dimensions"]
        lines.append(f"### `{repo_name}`")
        lines.append("")
        lines.append(f"- `observable_score = {item['scores']['observable_score']}`")
        lines.append(f"- `confidence_score = {item['scores']['confidence_score']}`")
        lines.append(f"- `weighted_score = {item['scores']['weighted_score']}`")
        lines.append(f"- `evidence_grade = {item['scores']['evidence_grade']}`")
        lines.append("")
        lines.append("分项：")
        lines.append("")
        lines.append(f"- discoverability = {d['discoverability_15']}")
        lines.append(f"- documentation_onboarding = {d['documentation_onboarding_20']}")
        lines.append(f"- setup_explicitness = {d['setup_explicitness_20']}")
        lines.append(f"- run_affordance = {d['run_affordance_20']}")
        lines.append(f"- verification_regression = {d['verification_regression_15']}")
        lines.append(f"- automation_friendliness = {d['automation_friendliness_10']}")
        lines.append(f"- friction_penalty = {d['friction_penalty_20']}")
        lines.append("")
        lines.append("关键观测：")
        lines.append("")
        lines.append(f"- README 长度：{item['remote_observation']['readme_length']}")
        lines.append(f"- 根目录项数：{item['remote_observation']['tree_entry_count']}")
        lines.append(f"- package/build 入口：{', '.join(item['remote_observation']['package_files']) or '无'}")
        lines.append(f"- docs/examples/tests/scripts：{item['remote_observation']['has_doc_dir']}/{item['remote_observation']['has_example_dir']}/{item['remote_observation']['has_test_dir']}/{item['remote_observation']['has_script_dir']}")
        lines.append(f"- 本地状态：{item['local_observation']['local_status']}")
        lines.append("")
    lines.append("## 8. 结论")
    lines.append("")
    lines.append("这次可以更有把握地说：")
    lines.append("")
    lines.append("- `CANN 组织的 65 个公开仓库` 已经完成全量覆盖")
    lines.append("- `Agentic 体验最强的不是 recipe，而是 infra/operator 类仓库`")
    lines.append("- `Recipe 仓库的主要问题不是没有内容，而是外部依赖、环境前提、权重和跨仓拼装摩擦太高`")
    lines.append("- `社区/治理/模板类仓库` 不适合和可运行仓库共用同一套“首次运行体验”叙事")
    lines.append("")
    lines.append("因此后续如果继续优化报告或产品入口，最合理的做法不是只追一个总分，而是：")
    lines.append("")
    lines.append("1. 明确区分 `可运行样例`、`底层开发库`、`行业方案仓`、`社区治理仓`")
    lines.append("2. 为 recipe 仓库补环境自检、权重获取、上游仓同步和最小运行命令")
    lines.append("3. 为所有仓库持续保留 `证据等级`，避免把“远程可读”误写成“本地已验证”")
    lines.append("")
    lines.append("## 9. 原始文件")
    lines.append("")
    lines.append(f"- [journey-agentic-report.html]({ROOT / 'journey-agentic-report.html'})")
    lines.append(f"- [cann-agentic-summary.json]({ROOT / 'cann-agentic-summary.json'})")
    lines.append(f"- [cann-agentic-observations.json]({ROOT / 'cann-agentic-observations.json'})")
    lines.append(f"- [cann-repo-coverage.json]({ROOT / 'cann-repo-coverage.json'})")
    return "\n".join(lines) + "\n"


def build_html(summary, observations):
    top = summary["top_10_by_weighted_score"]
    bottom = summary["bottom_10_by_weighted_score"]
    category_avg = summary["category_average_scores"]
    grade_dist = summary["evidence_grade_distribution"]
    local_dist = summary["local_status_distribution"]
    total = summary["repo_count"]

    observations_sorted = sorted(observations, key=lambda x: (-x["scores"]["weighted_score"], x["repo"]))

    top_rows = "\n".join(
        f"<tr><td><a href=\"{h(next(o['html_url'] for o in observations if o['repo']==item['repo']))}\">{h(item['repo'])}</a></td><td><span class=\"score {score_class(item['weighted_score'])}\">{item['weighted_score']}</span></td><td>{item['observable_score']}</td><td>{item['confidence_score']}</td><td>{h(item['evidence_grade'])}</td></tr>"
        for item in top
    )
    bottom_rows = "\n".join(
        f"<tr><td><a href=\"{h(next(o['html_url'] for o in observations if o['repo']==item['repo']))}\">{h(item['repo'])}</a></td><td><span class=\"score {score_class(item['weighted_score'])}\">{item['weighted_score']}</span></td><td>{item['observable_score']}</td><td>{item['confidence_score']}</td><td>{h(item['evidence_grade'])}</td></tr>"
        for item in bottom
    )

    category_rows = "\n".join(
        f"<tr><td>{h(key)}</td><td>{value}</td></tr>"
        for key, value in category_avg.items()
    )

    grade_rows = "\n".join(
        f"<tr><td>{h(key)}</td><td>{count}</td><td>{pct(count, total)}</td></tr>"
        for key, count in grade_dist.items()
    )

    local_rows = "\n".join(
        f"<tr><td>{h(key)}</td><td>{count}</td><td>{pct(count, total)}</td></tr>"
        for key, count in local_dist.items()
    )

    samples = []
    for repo_name in ["hixl", "pyasc", "cann-recipes-spatial-intelligence", ".gitcode"]:
        item = next((x for x in observations if x["repo"] == repo_name), None)
        if not item:
            continue
        d = item["scores"]["dimensions"]
        samples.append(
            f"""
            <div class="card">
              <h4><a href="{h(item['html_url'])}">{h(repo_name)}</a></h4>
              <p><strong>weighted_score = {item['scores']['weighted_score']}</strong>，
              observable = {item['scores']['observable_score']}，
              confidence = {item['scores']['confidence_score']}，
              grade = {h(item['scores']['evidence_grade'])}</p>
              <table class="score-table small">
                <tbody>
                  <tr><td>discoverability</td><td>{d['discoverability_15']}</td></tr>
                  <tr><td>documentation</td><td>{d['documentation_onboarding_20']}</td></tr>
                  <tr><td>setup</td><td>{d['setup_explicitness_20']}</td></tr>
                  <tr><td>run</td><td>{d['run_affordance_20']}</td></tr>
                  <tr><td>verification</td><td>{d['verification_regression_15']}</td></tr>
                  <tr><td>automation</td><td>{d['automation_friendliness_10']}</td></tr>
                  <tr><td>friction_penalty</td><td>{d['friction_penalty_20']}</td></tr>
                </tbody>
              </table>
              <p class="muted">README 长度：{item['remote_observation']['readme_length']}，根目录项数：{item['remote_observation']['tree_entry_count']}，本地状态：{h(item['local_observation']['local_status'])}</p>
            </div>
            """
        )

    repo_rows = []
    for item in observations_sorted:
        d = item["scores"]["dimensions"]
        ro = item["remote_observation"]
        lo = item["local_observation"]
        repo_rows.append(
            "<tr>"
            f"<td><a href=\"{h(item['html_url'])}\">{h(item['repo'])}</a></td>"
            f"<td>{h(item['category'])}</td>"
            f"<td>{h(item['scores']['evidence_grade'])}</td>"
            f"<td>{h(lo['local_status'] or 'enumerated_only')}</td>"
            f"<td><span class=\"score {score_class(item['scores']['weighted_score'])}\">{item['scores']['weighted_score']}</span></td>"
            f"<td>{item['scores']['observable_score']}</td>"
            f"<td>{item['scores']['confidence_score']}</td>"
            f"<td>{d['discoverability_15']}</td>"
            f"<td>{d['documentation_onboarding_20']}</td>"
            f"<td>{d['setup_explicitness_20']}</td>"
            f"<td>{d['run_affordance_20']}</td>"
            f"<td>{d['verification_regression_15']}</td>"
            f"<td>{d['automation_friendliness_10']}</td>"
            f"<td>{d['friction_penalty_20']}</td>"
            f"<td>{ro['readme_length']}</td>"
            f"<td>{ro['tree_entry_count']}</td>"
            f"<td>{h(', '.join(ro['package_files']) or '-')}</td>"
            "</tr>"
        )

    html_doc = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CANN GitCode 仓库全量 Agentic 评分报告</title>
  <style>
    :root {{
      --bg: #f5f1e8;
      --panel: rgba(255,255,255,0.9);
      --text: #1e2430;
      --muted: #5f6572;
      --line: rgba(30,36,48,.12);
      --brand: #0b5f63;
      --accent: #c77b2a;
      --high: #13795b;
      --mid: #1d4ed8;
      --low: #b7791f;
      --bad: #b42318;
      --shadow: 0 18px 48px rgba(30,36,48,.08);
      --radius: 18px;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(11,95,99,.12), transparent 32%),
        radial-gradient(circle at top right, rgba(199,123,42,.08), transparent 28%),
        linear-gradient(180deg, #fbf8f2 0%, var(--bg) 100%);
      line-height: 1.65;
    }}
    a {{ color: var(--brand); text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
    .shell {{ width: min(1380px, calc(100vw - 32px)); margin: 24px auto 48px; }}
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
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }}
    .eyebrow {{
      display: inline-block;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(11,95,99,.1);
      color: var(--brand);
      font-size: 13px;
      font-weight: 700;
    }}
    h1 {{ margin: 14px 0 12px; font-size: clamp(30px, 4vw, 48px); line-height: 1.08; }}
    .lead {{ max-width: 860px; color: var(--muted); margin: 0; }}
    .meta {{ display: grid; gap: 10px; min-width: 300px; }}
    .meta-card {{
      background: rgba(255,255,255,.72);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 14px 16px;
    }}
    .meta-card strong {{
      display: block;
      font-size: 12px;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: var(--muted);
    }}
    .hero-grid {{
      padding: 8px 32px 32px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0,1fr));
      gap: 14px;
    }}
    .stat {{
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
      background: rgba(255,255,255,.72);
    }}
    .stat .k {{
      font-size: 12px;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: var(--muted);
    }}
    .stat .v {{
      font-size: 30px;
      font-weight: 800;
      line-height: 1;
      margin: 8px 0;
    }}
    .stat .d {{ color: var(--muted); font-size: 14px; }}
    .toc {{
      position: sticky;
      top: 12px;
      z-index: 30;
      margin: 18px 0 22px;
      padding: 12px;
      border-radius: 18px;
      background: rgba(255,253,248,.88);
      border: 1px solid var(--line);
      backdrop-filter: blur(12px);
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }}
    .toc a {{
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(11,95,99,.08);
      color: var(--brand);
      font-size: 14px;
      font-weight: 600;
    }}
    section {{ margin-top: 18px; padding: 28px 30px; }}
    h2 {{ margin: 0 0 12px; font-size: 28px; }}
    h3 {{ margin: 26px 0 10px; font-size: 20px; }}
    p {{ margin: 10px 0; }}
    ul {{ margin: 10px 0 10px 20px; padding: 0; }}
    li + li {{ margin-top: 6px; }}
    .grid-2 {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0,1fr));
      gap: 16px;
      margin-top: 16px;
    }}
    .card {{
      background: rgba(255,255,255,.84);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 18px;
    }}
    .callout {{
      padding: 16px 18px;
      border-radius: 16px;
      border-left: 4px solid var(--accent);
      background: rgba(199,123,42,.1);
      color: #6b430d;
      margin: 16px 0;
    }}
    .warning {{
      border-left-color: var(--bad);
      background: rgba(180,35,24,.08);
      color: #6a251d;
    }}
    .score-table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 14px;
    }}
    .score-table th, .score-table td {{
      padding: 10px 12px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      vertical-align: top;
    }}
    .score-table th {{
      color: var(--muted);
      font-size: 12px;
      letter-spacing: .05em;
      text-transform: uppercase;
    }}
    .small td {{ padding: 6px 10px; font-size: 13px; }}
    .score {{
      display: inline-block;
      min-width: 58px;
      padding: 4px 10px;
      border-radius: 999px;
      font-weight: 700;
      text-align: center;
    }}
    .score.high {{ background: rgba(19,121,91,.12); color: var(--high); }}
    .score.mid {{ background: rgba(29,78,216,.1); color: var(--mid); }}
    .score.low {{ background: rgba(183,121,31,.12); color: var(--low); }}
    .score.bad {{ background: rgba(180,35,24,.12); color: var(--bad); }}
    .table-shell {{
      overflow: auto;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: rgba(255,255,255,.84);
      margin-top: 16px;
    }}
    .repo-table {{
      width: max(1600px, 100%);
      border-collapse: collapse;
      font-size: 13px;
    }}
    .repo-table th, .repo-table td {{
      padding: 8px 10px;
      border-bottom: 1px solid var(--line);
      text-align: left;
      white-space: nowrap;
    }}
    .repo-table th {{
      position: sticky;
      top: 0;
      background: #faf8f3;
      z-index: 2;
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .04em;
    }}
    .muted {{ color: var(--muted); }}
    .evidence-list {{
      display: grid;
      grid-template-columns: repeat(3, minmax(0,1fr));
      gap: 12px;
      margin-top: 14px;
    }}
    .evidence {{
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(255,255,255,.84);
      padding: 14px;
    }}
    @media (max-width: 1100px) {{
      .hero-grid, .grid-2, .evidence-list {{ grid-template-columns: 1fr 1fr; }}
    }}
    @media (max-width: 720px) {{
      .hero-grid, .grid-2, .evidence-list {{ grid-template-columns: 1fr; }}
      .shell {{ width: min(100vw - 16px, 1380px); }}
      section {{ padding: 22px 18px; }}
      .hero-top, .hero-grid {{ padding-left: 18px; padding-right: 18px; }}
    }}
  </style>
</head>
<body>
  <div class="shell">
    <header class="hero">
      <div class="hero-top">
        <div>
          <div class="eyebrow">Full-Coverage Evidence-Based Scoring</div>
          <h1>CANN GitCode 仓库全量<br />Agentic 评分报告</h1>
          <p class="lead">
            这次不是只看少量样本，而是覆盖了 CANN 组织下 65 个公开仓库，并把数据来源、评分公式、证据等级、逐仓库分数和原始观测文件都一起公开出来。
          </p>
        </div>
        <div class="meta">
          <div class="meta-card"><strong>报告生成</strong>2026-05-14</div>
          <div class="meta-card"><strong>数据规模</strong>{summary['repo_headers']['total_count']} 个公开仓库，{summary['repo_headers']['total_page']} 页 API 数据</div>
          <div class="meta-card"><strong>工作区</strong><code>{h(ROOT)}</code></div>
        </div>
      </div>
      <div class="hero-grid">
        <div class="stat">
          <div class="k">全量枚举</div>
          <div class="v">{summary['repo_count']}</div>
          <div class="d">通过 GitCode API 枚举到的公开仓库总数</div>
        </div>
        <div class="stat">
          <div class="k">高置信样本</div>
          <div class="v">{grade_dist.get('A', 0)}</div>
          <div class="d">本地完整验证、可直接支撑强结论的仓库</div>
        </div>
        <div class="stat">
          <div class="k">可读性均分</div>
          <div class="v">{summary['observable_average']}</div>
          <div class="d">只看仓库内容表面证据的全量平均分</div>
        </div>
        <div class="stat">
          <div class="k">置信加权均分</div>
          <div class="v">{summary['confidence_weighted_average']}</div>
          <div class="d">把证据强度一起计入后的全量主分</div>
        </div>
      </div>
    </header>

    <nav class="toc">
      <a href="#change">变化</a>
      <a href="#sources">数据</a>
      <a href="#method">方法</a>
      <a href="#summary">摘要</a>
      <a href="#examples">算例</a>
      <a href="#ranking">全量表</a>
      <a href="#evidence">原始文件</a>
    </nav>

    <section id="change">
      <h2>这次和上一版的本质区别</h2>
      <p>上一版的主要问题不是“少分析了几个仓库”，而是把两种完全不同的证据混在了一起：</p>
      <ul>
        <li>少量本地深度样本：证据强，但覆盖窄</li>
        <li>全组织仓库列表：覆盖全，但证据弱</li>
      </ul>
      <div class="callout warning">
        这次改成了三层结构：<strong>全量枚举</strong>、<strong>远程内容观测</strong>、<strong>本地验证</strong>，并且每个仓库都带证据等级。
      </div>
      <div class="grid-2">
        <div class="card">
          <h4>全量组织覆盖</h4>
          <p>65 个公开仓库都已进入评分输入，不再只看 9 个仓库。</p>
        </div>
        <div class="card">
          <h4>证据强度分级</h4>
          <p>不再把“远程看到了 README”和“本地真的验证过”混成同一种分数。</p>
        </div>
      </div>
    </section>

    <section id="sources">
      <h2>数据来源</h2>
      <div class="grid-2">
        <div class="card">
          <h4>1. GitCode 组织 API</h4>
          <p>用于获取 65 个公开仓库的名称、URL、语言、Star、默认分支、时间信息。</p>
        </div>
        <div class="card">
          <h4>2. GitCode 仓库内容 API</h4>
          <p>用于抓取每个仓库的根目录树、README、根目录 package/build/script/test/docs/examples 入口。</p>
        </div>
        <div class="card">
          <h4>3. 本地验证</h4>
          <p>用于补充 full / git_only / incomplete 状态，以及 compileall 之类的命令级证据。</p>
        </div>
        <div class="card">
          <h4>4. 输出文件</h4>
          <p>所有观测和计算结果都落成 JSON，可直接复查，不靠口头解释。</p>
        </div>
      </div>
    </section>

    <section id="method">
      <h2>评分方法</h2>
      <p>旧版 Persona 旅程分不适合直接套到 65 个异构仓库上，因为社区治理仓、模板仓和算子仓并不共享同一条用户旅程。</p>
      <p>这次改成了 <strong>仓库级 Agentic 可推进度评分</strong>：先给每个仓库打通用分，再按类别聚合。</p>

      <h3>Observable Score</h3>
      <div class="callout">
        <code>observable_score = discoverability(15) + documentation_onboarding(20) + setup_explicitness(20) + run_affordance(20) + verification_regression(15) + automation_friendliness(10) - friction_penalty(0..20)</code>
      </div>
      <table class="score-table">
        <thead><tr><th>维度</th><th>满分</th><th>计算依据</th></tr></thead>
        <tbody>
          <tr><td>discoverability</td><td>15</td><td>description、language、Star 是否能帮助快速判断用途</td></tr>
          <tr><td>documentation_onboarding</td><td>20</td><td>README 是否存在、长度是否足够、是否有 docs、是否出现 setup 关键词</td></tr>
          <tr><td>setup_explicitness</td><td>20</td><td>requirements / setup.py / pyproject / CMakeLists / build.sh 等入口是否存在</td></tr>
          <tr><td>run_affordance</td><td>20</td><td>examples、scripts、README run 命令、本地 compileall 证据</td></tr>
          <tr><td>verification_regression</td><td>15</td><td>tests / benchmark / eval / verify / compileall 等验证信号</td></tr>
          <tr><td>automation_friendliness</td><td>10</td><td>结构化入口是否足够脚本化、agent 化</td></tr>
          <tr><td>friction_penalty</td><td>0..20</td><td>set_env.sh、torch-npu、NPU 工具链、手动复制、额外 clone、权重手放、git-only/incomplete 等高摩擦信号</td></tr>
        </tbody>
      </table>

      <h3>Confidence Score</h3>
      <table class="score-table">
        <thead><tr><th>等级</th><th>分值</th><th>含义</th></tr></thead>
        <tbody>
          <tr><td>A</td><td>100</td><td>本地完整验证 + 命令级证据</td></tr>
          <tr><td>B+</td><td>70..85</td><td>本地拿到不完整或空壳，但远程树/README 可读</td></tr>
          <tr><td>B</td><td>75</td><td>远程树 + README 可读</td></tr>
          <tr><td>C+</td><td>60</td><td>远程树可读但 README 不可读</td></tr>
          <tr><td>C</td><td>35</td><td>只有元数据</td></tr>
        </tbody>
      </table>

      <h3>Final Score</h3>
      <div class="callout">
        <code>weighted_score = observable_score × confidence_score / 100</code>
      </div>
      <p class="muted">因此：observable_score 反映“看起来有多 agentic”，confidence_score 反映“这份判断有多可信”，weighted_score 才是最终主分。</p>
    </section>

    <section id="summary">
      <h2>全量结果摘要</h2>
      <div class="grid-2">
        <div class="card">
          <h4>证据等级分布</h4>
          <table class="score-table small">
            <thead><tr><th>grade</th><th>count</th><th>ratio</th></tr></thead>
            <tbody>{grade_rows}</tbody>
          </table>
        </div>
        <div class="card">
          <h4>本地状态分布</h4>
          <table class="score-table small">
            <thead><tr><th>status</th><th>count</th><th>ratio</th></tr></thead>
            <tbody>{local_rows}</tbody>
          </table>
        </div>
        <div class="card">
          <h4>类别平均分</h4>
          <table class="score-table small">
            <thead><tr><th>category</th><th>avg score</th></tr></thead>
            <tbody>{category_rows}</tbody>
          </table>
        </div>
        <div class="card">
          <h4>关键判断</h4>
          <ul>
            <li><code>infra_operator = 80.89</code>，整体最成熟</li>
            <li><code>app_recipe = 55.6</code>，内容有价值但运行摩擦大</li>
            <li><code>community_governance</code> 和 <code>industry_solution</code> 低，不是“仓库差”，而是目标不在首次运行体验</li>
          </ul>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h4>Top 10</h4>
          <table class="score-table">
            <thead><tr><th>repo</th><th>weighted</th><th>observable</th><th>confidence</th><th>grade</th></tr></thead>
            <tbody>{top_rows}</tbody>
          </table>
        </div>
        <div class="card">
          <h4>Bottom 10</h4>
          <table class="score-table">
            <thead><tr><th>repo</th><th>weighted</th><th>observable</th><th>confidence</th><th>grade</th></tr></thead>
            <tbody>{bottom_rows}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="examples">
      <h2>具体计算例子</h2>
      <p>下面不是抽象解释，而是直接把仓库的分项分数展开。</p>
      <div class="grid-2">
        {''.join(samples)}
      </div>
    </section>

    <section id="ranking">
      <h2>65 仓库全量评分表</h2>
      <p>表内直接展示每个仓库的类别、证据等级、本地状态、主分，以及所有维度分和关键观测字段。</p>
      <div class="table-shell">
        <table class="repo-table">
          <thead>
            <tr>
              <th>repo</th>
              <th>category</th>
              <th>grade</th>
              <th>local_status</th>
              <th>weighted</th>
              <th>observable</th>
              <th>confidence</th>
              <th>discover</th>
              <th>docs</th>
              <th>setup</th>
              <th>run</th>
              <th>verify</th>
              <th>auto</th>
              <th>friction</th>
              <th>readme_len</th>
              <th>tree_count</th>
              <th>package_files</th>
            </tr>
          </thead>
          <tbody>
            {''.join(repo_rows)}
          </tbody>
        </table>
      </div>
    </section>

    <section id="evidence">
      <h2>原始文件与复查入口</h2>
      <div class="evidence-list">
        <div class="evidence"><a href="journey-agentic-report.md">生成后的 Markdown 报告</a></div>
        <div class="evidence"><a href="cann-agentic-summary.json">cann-agentic-summary.json</a></div>
        <div class="evidence"><a href="cann-agentic-observations.json">cann-agentic-observations.json</a></div>
        <div class="evidence"><a href="cann-repo-coverage.json">cann-repo-coverage.json</a></div>
        <div class="evidence"><a href="repo-scan-summary.json">repo-scan-summary.json</a></div>
        <div class="evidence"><a href="scripts/analyze_cann_repos.py">analyze_cann_repos.py</a><br /><a href="scripts/render_agentic_report.py">render_agentic_report.py</a></div>
      </div>
      <div class="callout">
        如果后续要继续提升可信度，最有效的方向不是再调公式，而是把更多 B / B+ 仓库推进到 A 级本地验证。
      </div>
    </section>
  </div>
</body>
</html>
"""
    return html_doc


def main():
    summary = load_json("cann-agentic-summary.json")
    observations = load_json("cann-agentic-observations.json")
    md = build_md(summary, observations)
    html_doc = build_html(summary, observations)
    (ROOT / "journey-agentic-report.md").write_text(md, encoding="utf-8")
    (ROOT / "journey-agentic-report.html").write_text(html_doc, encoding="utf-8")


if __name__ == "__main__":
    main()
