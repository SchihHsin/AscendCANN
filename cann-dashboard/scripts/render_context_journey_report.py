import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_json(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def h(value):
    return html.escape(str(value))


def avg(nums):
    return round(sum(nums) / len(nums), 2) if nums else 0.0


def clamp(value):
    return max(0, min(100, round(value, 2)))


def score_class(value):
    if value >= 80:
        return "high"
    if value >= 60:
        return "mid"
    if value >= 40:
        return "low"
    return "bad"


def stage_features(obs):
    d = obs["scores"]["dimensions"]
    return {
        "discover": d["discoverability_15"] / 15 * 100,
        "docs": d["documentation_onboarding_20"] / 20 * 100,
        "setup": d["setup_explicitness_20"] / 20 * 100,
        "run": d["run_affordance_20"] / 20 * 100,
        "verify": d["verification_regression_15"] / 15 * 100,
        "auto": d["automation_friendliness_10"] / 10 * 100,
        "friction_inv": (20 - d["friction_penalty_20"]) / 20 * 100,
        "confidence": obs["scores"]["confidence_score"],
    }


def score_from_formula(features, stage_name):
    formulas = {
        "感知学习": 0.40 * features["discover"] + 0.35 * features["docs"] + 0.10 * features["setup"] + 0.15 * features["confidence"],
        "环境准备": 0.35 * features["setup"] + 0.20 * features["docs"] + 0.15 * features["auto"] + 0.30 * features["friction_inv"],
        "环境验证": 0.35 * features["run"] + 0.35 * features["verify"] + 0.15 * features["setup"] + 0.15 * features["confidence"],
        "算子迁移": 0.20 * features["discover"] + 0.25 * features["docs"] + 0.20 * features["auto"] + 0.20 * features["setup"] + 0.15 * features["friction_inv"],
        "算子设计与实现": 0.20 * features["docs"] + 0.30 * features["auto"] + 0.20 * features["setup"] + 0.15 * features["verify"] + 0.15 * features["friction_inv"],
        "算子编译": 0.45 * features["setup"] + 0.15 * features["auto"] + 0.20 * features["run"] + 0.20 * features["friction_inv"],
        "功能调测": 0.30 * features["run"] + 0.35 * features["verify"] + 0.15 * features["docs"] + 0.20 * features["auto"],
        "性能调优": 0.20 * features["docs"] + 0.20 * features["verify"] + 0.30 * features["auto"] + 0.15 * features["run"] + 0.15 * features["friction_inv"],
        "整网优化": 0.20 * features["docs"] + 0.25 * features["auto"] + 0.20 * features["setup"] + 0.20 * features["verify"] + 0.15 * features["friction_inv"],
        "S0 搜索与发现": 0.45 * features["discover"] + 0.40 * features["docs"] + 0.15 * features["confidence"],
        "S1 环境检查与准备": 0.30 * features["setup"] + 0.20 * features["docs"] + 0.20 * features["friction_inv"] + 0.15 * features["discover"] + 0.15 * features["auto"],
        "S2 样例快速体验": 0.35 * features["run"] + 0.20 * features["setup"] + 0.20 * features["docs"] + 0.15 * features["verify"] + 0.10 * features["friction_inv"],
        "S3 开发与编译": 0.35 * features["setup"] + 0.25 * features["auto"] + 0.20 * features["docs"] + 0.20 * features["verify"],
        "S4 测试与验证": 0.30 * features["verify"] + 0.20 * features["run"] + 0.20 * features["docs"] + 0.15 * features["auto"] + 0.15 * features["confidence"],
        "S5 反馈与贡献": 0.30 * features["docs"] + 0.20 * features["discover"] + 0.25 * features["verify"] + 0.25 * features["auto"],
    }
    return clamp(formulas[stage_name])


FALLBACK_CONTENT = {
    "应用开发者": {
        "role_statement": "context.md 中该角色仍是空白，但新分析已经识别出更贴近业务落地与样例消费的应用型旅程，可用于补全角色内容层。",
        "summary_source": "新分析补全",
        "scenarios": [
            {
                "name": "行业方案验证与 PoC",
                "repos": ["elec-ops-inspection", "elec-ops-prediction", "elec-ops-simulation", "mat-chem-sim-pred"],
                "stages": ["感知学习", "环境准备", "环境验证"],
                "evidence_links": [
                    ("observations JSON", ROOT / "cann-agentic-observations.json"),
                    ("repo coverage JSON", ROOT / "cann-repo-coverage.json"),
                ],
                "supplemented": True,
                "supplement_note": "该场景不在 context.md 原文中展开，基于新分析中的“行业方案开发者”旅程进行映射补全。",
                "insights_override": [
                    "应用型用户首先关心的是是否能快速验证业务 PoC，而不是理解底层架构全貌。",
                    "当前更像方案展示而不是最小可运行方案包，因此在环境拉起和结果验证阶段容易掉线。",
                ],
            },
            {
                "name": "样例落地与快速试用",
                "repos": [
                    "cann-learning-hub",
                    "cann-samples",
                    "cann-recipes-harmony-infer",
                    "cann-recipes-embodied-intelligence",
                    "cann-recipes-spatial-intelligence",
                    "cann-recipes-infer",
                    "cann-recipes-train",
                ],
                "stages": ["感知学习", "环境准备", "环境验证"],
                "evidence_links": [
                    ("embodied README", ROOT / "repo-scan" / "cann-recipes-embodied-intelligence" / "README.md"),
                    ("VGGT README", ROOT / "repo-scan" / "cann-recipes-spatial-intelligence" / "models" / "vggt" / "README.md"),
                ],
                "supplemented": True,
                "supplement_note": "该场景基于新分析中的“样例体验型开发者”补到应用开发者内容层，用来补齐应用侧的上手旅程。",
                "insights_override": [
                    "应用开发者真正想看到的是最短路径出结果，而不是在多个 recipe 之间反复判断入口。",
                    "内容入口很多，但从“看到方案”到“确认它适合我”之间仍缺明确收敛路径。",
                ],
            },
        ],
    },
    "AI 框架开发者": {
        "scenario_overrides": {
            "裸模型 Torch 原生开发": {
                "repos": ["tensorflow", "xla-npu", "torchtitan-npu", "triton-inference-server-ge-backend"],
                "stages": ["感知学习", "环境准备", "环境验证"],
                "evidence_links": [
                    ("observations JSON", ROOT / "cann-agentic-observations.json"),
                    ("repo coverage JSON", ROOT / "cann-repo-coverage.json"),
                ],
                "supplemented": True,
                "supplement_note": "context.md 只有场景名，没有旅程内容；这里用新分析中的“模型/框架适配工程师”结果补出原生开发的基础旅程。",
                "insights_override": [
                    "原生开发不是没有材料，而是材料分布在框架、后端、推理服务和环境依赖之间。",
                    "对用户来说，最关键的是把跨仓库的前置条件收敛成一条明确起步线。",
                ],
            },
            "VLLM/SGL 框架原生开发": {
                "repos": ["cann-recipes-infer", "cann-recipes-train", "triton-inference-server-ge-backend"],
                "stages": ["感知学习", "环境准备", "环境验证"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "supplemented": True,
                "supplement_note": "该内容由新分析补全，作为框架原生开发的当前可观察代理场景。",
            },
            "VLLM/SGL 框架昇腾亲和优化": {
                "repos": ["cann-recipes-infer", "cann-recipes-train", "xla-npu", "triton-inference-server-ge-backend"],
                "stages": ["感知学习", "整网优化"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "supplemented": True,
                "supplement_note": "该内容由新分析补全，突出跨后端适配与优化的连续性问题。",
            },
            "Verl 框架原生开发": {
                "repos": ["cann-recipes-train", "torchtitan-npu"],
                "stages": ["感知学习", "环境准备", "环境验证"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "supplemented": True,
                "supplement_note": "该内容由新分析补全，作为训练框架原生开发的可观察代理。",
            },
            "Verl 框架昇腾亲和优化": {
                "repos": ["cann-recipes-train", "xla-npu", "torchtitan-npu"],
                "stages": ["感知学习", "整网优化"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "supplemented": True,
                "supplement_note": "该内容由新分析补全，用来补足训练框架优化链路。",
            },
        }
    },
    "算子开发者": {
        "scenario_overrides": {
            "特定 shape 性能优化": {
                "repos": ["ops-transformer", "ops-math", "ascend-transformer-boost", "catlass"],
                "stages": ["感知学习", "功能调测", "性能调优"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "supplemented": True,
                "supplement_note": "该旅程在 context.md 中未展开，这里基于新分析对算子/库开发者的调优阶段补全。",
                "insights_override": [
                    "特定 shape 优化更像局部打磨，用户最需要的是快速定位瓶颈与可验证的优化回路。",
                    "如果缺少基准、回归和失败解释，调优会退化成高成本试探。",
                ],
            },
            "泛化 shape 性能优化": {
                "repos": ["ops-transformer", "ops-math", "ops-tensor", "ops-solver", "ascend-transformer-boost"],
                "stages": ["感知学习", "功能调测", "性能调优"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "supplemented": True,
                "supplement_note": "该旅程在 context.md 中未展开，这里用新分析结果补齐泛化 shape 优化内容。",
                "insights_override": [
                    "泛化优化比单点优化更依赖稳定反馈，因为用户要判断优化是否在更多 shape 上成立。",
                    "当前风险不在入口，而在验证闭环是否足够短、足够可信。",
                ],
            },
        }
    },
    "入门开发者": {
        "scenario_overrides": {
            "S2 样例快速体验": {
                "supplemented": True,
                "supplement_note": "context.md 只有阶段名；这里沿用新分析中“样例体验型开发者”的结果，把内容层补进社区新人旅程。",
                "insights_override": [
                    "新用户此时要的不是全貌，而是一个最短、最稳的试跑路径。",
                    "如果样例路径需要先判断多个仓库之间的关系，体验就会在真正开始前被消耗掉。",
                ],
            },
            "S3 开发与编译": {
                "supplemented": True,
                "supplement_note": "context.md 只有阶段名；这里用新分析中的开发/编译观测来补全内容层。",
            },
            "S4 测试与验证": {
                "supplemented": True,
                "supplement_note": "context.md 只有阶段名；这里用新分析中的验证观测来补全内容层。",
            },
            "S5 反馈与贡献": {
                "supplemented": True,
                "supplement_note": "context.md 只有阶段名；这里用新分析中的社区反馈入口观察来补全内容层。",
            },
        }
    },
}


CONFIG = {
    "算子开发者": {
        "role_label": "产品应用性",
        "role_statement": "该角色的旅程最完整，适合直接按场景拆解体验断点。",
        "scenarios": [
            {
                "name": "算子复现部署",
                "repos": ["cann-samples", "cann-learning-hub", "ops-test-kit", "pyasc", "asc-devkit"],
                "stages": ["感知学习", "环境准备", "环境验证"],
                "evidence_links": [
                    ("pyasc README", ROOT / "repo-scan" / "pyasc" / "README.md"),
                    ("pyasc quick start", ROOT / "repo-scan" / "pyasc" / "docs" / "quick_start.md"),
                ],
                "defined_in_context": True,
            },
            {
                "name": "算子迁移部署",
                "repos": ["asc-devkit", "asc-tools", "pyasc", "atvoss", "catlass", "ops-math", "ascend-transformer-boost"],
                "stages": ["感知学习", "算子迁移", "算子编译", "功能调测", "性能调优"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "defined_in_context": True,
            },
            {
                "name": "Builtin 算子定制修改",
                "repos": ["opbase", "ops-nn", "ops-cv", "ops-transformer", "ops-math", "catlass", "catccos", "asc-devkit", "pyasc"],
                "stages": ["感知学习", "算子设计与实现", "算子编译", "功能调测", "性能调优"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "defined_in_context": True,
            },
            {
                "name": "算子基本功能实现",
                "repos": ["pyasc", "asc-devkit", "asc-tools", "atvoss", "opbase", "ops-collections", "ops-blas", "ops-tensor", "ops-solver", "ops-sparse", "ops-rand", "ops-fft"],
                "stages": ["感知学习", "算子设计与实现", "算子编译", "功能调测", "性能调优"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "defined_in_context": True,
            },
            {"name": "特定 shape 性能优化", "repos": [], "stages": [], "undefined": True, "defined_in_context": True},
            {"name": "泛化 shape 性能优化", "repos": [], "stages": [], "undefined": True, "defined_in_context": True},
        ],
    },
    "AI 框架开发者": {
        "role_label": "产品应用性",
        "role_statement": "该角色不是一步一步做单算子，而是要跨框架、跨优化点建立整网适配路径。",
        "scenarios": [
            {"name": "裸模型 Torch 原生开发", "repos": [], "stages": [], "undefined": True, "defined_in_context": True},
            {
                "name": "裸模型昇腾亲和优化",
                "repos": ["tensorflow", "xla-npu", "torchtitan-npu", "triton-inference-server-ge-backend", "cann-recipes-infer", "cann-recipes-train"],
                "stages": ["感知学习", "整网优化"],
                "evidence_links": [
                    ("observations JSON", ROOT / "cann-agentic-observations.json"),
                    ("repo coverage JSON", ROOT / "cann-repo-coverage.json"),
                ],
                "defined_in_context": True,
            },
            {"name": "VLLM/SGL 框架原生开发", "repos": [], "stages": [], "undefined": True, "defined_in_context": True},
            {"name": "VLLM/SGL 框架昇腾亲和优化", "repos": [], "stages": [], "undefined": True, "defined_in_context": True},
            {"name": "Verl 框架原生开发", "repos": [], "stages": [], "undefined": True, "defined_in_context": True},
            {"name": "Verl 框架昇腾亲和优化", "repos": [], "stages": [], "undefined": True, "defined_in_context": True},
        ],
    },
    "应用开发者": {
        "role_label": "产品应用性",
        "role_undefined": True,
        "summary": "context.md 中该角色仍未展开具体内容。",
    },
    "入门开发者": {
        "role_label": "社区易用性",
        "role_statement": "该角色更关注能否找到入口、快速跑通、知道下一步做什么，而不是只看仓库结构。",
        "scenarios": [
            {
                "name": "S0 搜索与发现",
                "repos": ["community", "cann-learning-hub", "cann-samples", "pyasc", ".gitcode"],
                "stages": ["S0 搜索与发现"],
                "evidence_links": [
                    ("context.md", ROOT / "context.md"),
                    ("observations JSON", ROOT / "cann-agentic-observations.json"),
                ],
                "defined_tasks": True,
                "defined_in_context": True,
            },
            {
                "name": "S1 环境检查与准备",
                "repos": ["cann-samples", "cann-learning-hub", "pyasc", "cann-recipes-embodied-intelligence", "cann-recipes-spatial-intelligence"],
                "stages": ["S1 环境检查与准备"],
                "evidence_links": [
                    ("pyasc quick start", ROOT / "repo-scan" / "pyasc" / "docs" / "quick_start.md"),
                    ("embodied README", ROOT / "repo-scan" / "cann-recipes-embodied-intelligence" / "README.md"),
                ],
                "defined_tasks": True,
                "defined_in_context": True,
            },
            {
                "name": "S2 样例快速体验",
                "repos": ["cann-samples", "cann-learning-hub", "cann-recipes-embodied-intelligence", "cann-recipes-spatial-intelligence"],
                "stages": ["S2 样例快速体验"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "partial_defined": True,
                "defined_in_context": True,
            },
            {
                "name": "S3 开发与编译",
                "repos": ["pyasc", "asc-devkit", "cann-samples"],
                "stages": ["S3 开发与编译"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "partial_defined": True,
                "defined_in_context": True,
            },
            {
                "name": "S4 测试与验证",
                "repos": ["pyasc", "cann-samples", "ops-test-kit"],
                "stages": ["S4 测试与验证"],
                "evidence_links": [("observations JSON", ROOT / "cann-agentic-observations.json")],
                "partial_defined": True,
                "defined_in_context": True,
            },
            {
                "name": "S5 反馈与贡献",
                "repos": ["community", "cann-competitions", ".gitcode", "cannbot-skills"],
                "stages": ["S5 反馈与贡献"],
                "evidence_links": [
                    ("context.md", ROOT / "context.md"),
                    ("observations JSON", ROOT / "cann-agentic-observations.json"),
                ],
                "partial_defined": True,
                "defined_in_context": True,
            },
        ],
    },
}


def merge_role_with_fallback(role_name, role_cfg):
    fallback = FALLBACK_CONTENT.get(role_name, {})
    merged = dict(role_cfg)

    if role_cfg.get("role_undefined") and fallback.get("scenarios"):
        merged["role_undefined"] = False
        merged["role_statement"] = fallback.get("role_statement", role_cfg.get("summary", ""))
        merged["summary_source"] = fallback.get("summary_source", "新分析补全")
        merged["scenarios"] = fallback["scenarios"]
        return merged

    if "scenario_overrides" in fallback:
        overrides = fallback["scenario_overrides"]
        merged_scenes = []
        for scene in role_cfg.get("scenarios", []):
            override = overrides.get(scene["name"])
            if override:
                new_scene = dict(scene)
                new_scene.update(override)
                if scene.get("undefined") and override.get("repos"):
                    new_scene["undefined"] = False
                merged_scenes.append(new_scene)
            else:
                merged_scenes.append(scene)
        merged["scenarios"] = merged_scenes
    return merged


def stage_interpretation(role_name, stage_name, score):
    if score >= 85:
        level = "顺滑"
    elif score >= 70:
        level = "可完成，但仍有跳转成本"
    elif score >= 55:
        level = "需要额外摸索"
    else:
        level = "高阻塞"

    mapping = {
        ("算子开发者", "环境准备"): "文档能指路，但从说明到可运行环境之间仍有明显操作落差。",
        ("算子开发者", "环境验证"): "关键不是能不能跑，而是跑完后能否快速确认环境真的可用。",
        ("算子开发者", "功能调测"): "用户最怕的是失败后不知道该回到哪一步。",
        ("算子开发者", "性能调优"): "这一段更像反复试探，缺少稳定的优化闭环提示。",
        ("AI 框架开发者", "整网优化"): "跨仓库拼接感强，用户需要统一路径，而不是散点材料。",
        ("AI 框架开发者", "环境准备"): "前置依赖分散在不同组件里，用户需要的是单条准备路径。",
        ("应用开发者", "环境准备"): "应用型用户希望尽快拉起最小场景，不希望先理解复杂依赖树。",
        ("应用开发者", "环境验证"): "对业务用户而言，验证的是“能否支撑 PoC”，而不只是命令执行成功。",
        ("入门开发者", "S0 搜索与发现"): "入口是否直达，决定新用户会不会继续往下走。",
        ("入门开发者", "S1 环境检查与准备"): "核心是预检、依赖和成功判定是否足够明确。",
        ("入门开发者", "S2 样例快速体验"): "新人希望最短路径看到结果，而不是先理解全貌。",
        ("入门开发者", "S5 反馈与贡献"): "如果贡献入口不清晰，社区旅程会在最后一步断掉。",
    }
    detail = mapping.get((role_name, stage_name), "该阶段是否顺滑，决定用户能否自然进入下一步。")
    return f"{level}。{detail}"


def stage_evidence_summary(stage_name, coverage):
    hints = [f"{coverage['repo_count']} 个相关仓观测"]
    if stage_name in {"环境准备", "算子编译", "S1 环境检查与准备", "S3 开发与编译"}:
        hints.append(f"build 支撑 {coverage['package_coverage']}%")
    if stage_name in {"环境验证", "功能调测", "S4 测试与验证"}:
        hints.append(f"tests 支撑 {coverage['tests_coverage']}%")
    hints.append(f"平均摩擦 {coverage['avg_friction_hits']}")
    return "辅助证据：" + " / ".join(hints)


def default_insights(role_name, scenario):
    if scenario.get("insights_override"):
        return scenario["insights_override"]
    if role_name == "算子开发者":
        return [
            "该类场景的信息入口总体不差，真正的 UX 断点集中在失败反馈与下一步指引。",
            "如果编译、调测、调优阶段的错误解释和回退路径更清晰，整体旅程会更顺。",
        ]
    if role_name == "AI 框架开发者":
        return [
            "资料并不少，问题在于跨框架、跨后端、跨仓库的适配信息没有被收敛成一条连续路径。",
            "用户需要统一路线图，而不是分散在多个仓库里的局部说明。",
        ]
    if role_name == "应用开发者":
        return [
            "应用型用户最关心的不是底层能力全貌，而是能否最短路径验证场景可行性。",
            "如果没有明确的最小可运行路径，用户会把方案仓误判成仅供展示的资料仓。",
        ]
    if role_name == "入门开发者":
        if scenario.get("defined_tasks"):
            return [
                "S0/S1 的任务定义相对清晰，因此可以直接看到入口发现与环境拉起的问题。",
                "对新人而言，这两步已经足以决定是否继续投入后续学习和开发。",
            ]
        return [
            "该阶段在 context.md 中只有阶段名，因此这里是基于新分析证据对内容层做补全。",
            "这能让旅程继续可视化，但也说明后续仍需在源头把任务定义补完整。",
        ]
    return []


def get_stage_extremes(scene):
    if not scene["stages"]:
        return None, None
    sorted_stages = sorted(scene["stages"], key=lambda item: item["score"])
    weakest = sorted_stages[0]
    strongest = sorted_stages[-1]
    return strongest, weakest


def scenario_judgement(scene):
    strongest, weakest = get_stage_extremes(scene)
    if not strongest or not weakest:
        return "当前缺少足够得分数据。"
    if scene["overall"] >= 85:
        tone = "整体旅程较顺"
    elif scene["overall"] >= 70:
        tone = "整体可完成，但存在明显断点"
    elif scene["overall"] >= 55:
        tone = "整体需要较多摸索"
    else:
        tone = "整体阻塞较重"
    return f"{tone}，当前最弱阶段是“{weakest['stage']}”({weakest['score']})，最强阶段是“{strongest['stage']}”({strongest['score']})。"


def scenario_summary(role_name, scenario, obs_map):
    repos = [obs_map[name] for name in scenario.get("repos", []) if name in obs_map]
    if not repos:
        return {
            "name": scenario["name"],
            "empty": True,
            "overall": None,
            "stages": [],
            "coverage": None,
            "insights": default_insights(role_name, scenario),
            "evidence_links": scenario.get("evidence_links", []),
            "repo_refs": [],
            "top_repos": [],
            "risk_repos": [],
            "status_note": scenario.get("supplement_note") or "当前没有匹配到可支撑该场景的仓库观测数据。",
            "defined_in_context": scenario.get("defined_in_context", False),
            "supplemented": scenario.get("supplemented", False),
            "partial_defined": scenario.get("partial_defined", False),
        }

    coverage = {
        "repo_count": len(repos),
        "readme_coverage": round(sum(1 for r in repos if r["remote_observation"]["readme_length"] > 0) * 100 / len(repos), 1),
        "examples_coverage": round(sum(1 for r in repos if r["remote_observation"]["has_example_dir"]) * 100 / len(repos), 1),
        "tests_coverage": round(sum(1 for r in repos if r["remote_observation"]["has_test_dir"]) * 100 / len(repos), 1),
        "scripts_coverage": round(sum(1 for r in repos if r["remote_observation"]["has_script_dir"]) * 100 / len(repos), 1),
        "package_coverage": round(sum(1 for r in repos if r["remote_observation"]["package_files"]) * 100 / len(repos), 1),
        "avg_friction_hits": avg([r["remote_observation"]["friction_hits_total"] for r in repos]),
        "local_full": sum(1 for r in repos if r["local_observation"]["local_status"] == "full"),
        "local_incomplete": sum(1 for r in repos if r["local_observation"]["local_status"] in {"git_only", "incomplete"}),
    }

    stages = []
    for stage_name in scenario["stages"]:
        score = avg([score_from_formula(stage_features(obs), stage_name) for obs in repos])
        stages.append({
            "stage": stage_name,
            "score": score,
            "score_class": score_class(score),
            "interpretation": stage_interpretation(role_name, stage_name, score),
            "evidence_summary": stage_evidence_summary(stage_name, coverage),
        })

    sorted_repos = sorted(repos, key=lambda item: (-item["scores"]["weighted_score"], item["repo"]))
    risk_sorted = sorted(repos, key=lambda item: (item["scores"]["weighted_score"], item["repo"]))

    return {
        "name": scenario["name"],
        "empty": False,
        "overall": avg([stage["score"] for stage in stages]),
        "stages": stages,
        "coverage": coverage,
        "insights": default_insights(role_name, scenario),
        "evidence_links": scenario.get("evidence_links", []),
        "repo_refs": [{"name": item["repo"], "url": item.get("html_url", "")} for item in repos],
        "top_repos": [item["repo"] for item in sorted_repos[:3]],
        "risk_repos": [item["repo"] for item in risk_sorted[:3]],
        "status_note": scenario.get("supplement_note"),
        "defined_in_context": scenario.get("defined_in_context", False),
        "supplemented": scenario.get("supplemented", False),
        "partial_defined": scenario.get("partial_defined", False),
    }


def role_summary(role_name, role_cfg, obs_map):
    merged = merge_role_with_fallback(role_name, role_cfg)
    if merged.get("role_undefined"):
        return {
            "name": role_name,
            "role_label": merged["role_label"],
            "role_statement": merged.get("summary", ""),
            "role_undefined": True,
            "summary_source": "仅 context.md",
            "scenarios": [],
            "overall": None,
        }

    scenarios = [scenario_summary(role_name, scene, obs_map) for scene in merged.get("scenarios", [])]
    valid = [scene for scene in scenarios if scene["overall"] is not None]
    return {
        "name": role_name,
        "role_label": merged["role_label"],
        "role_statement": merged.get("role_statement", ""),
        "role_undefined": False,
        "summary_source": merged.get("summary_source", "context.md"),
        "scenarios": scenarios,
        "overall": avg([scene["overall"] for scene in valid]) if valid else None,
    }


def source_badges(scene):
    badges = []
    if scene.get("defined_in_context"):
        badges.append('<span class="source-badge context">context 骨架</span>')
    if scene.get("supplemented"):
        badges.append('<span class="source-badge supplement">新分析补全</span>')
    if scene.get("partial_defined"):
        badges.append('<span class="source-badge partial">阶段名来自 context，内容来自新分析</span>')
    return "".join(badges)


def render_stage_node(stage, idx, total, low_conf=False, is_strongest=False, is_weakest=False):
    low_conf_badge = '<span class="mini-badge low-confidence">补全内容</span>' if low_conf else ""
    extreme_badge = ""
    if is_strongest:
        extreme_badge = '<span class="mini-badge strongest">高分阶段</span>'
    elif is_weakest:
        extreme_badge = '<span class="mini-badge weakest">低分阶段</span>'
    connector = "" if idx == total - 1 else '<div class="journey-connector" aria-hidden="true"></div>'
    return f"""
    <div class="journey-step {h(stage['score_class'])}{' strongest' if is_strongest else ''}{' weakest' if is_weakest else ''}">
      <div class="journey-node">
        <div class="journey-index">阶段 {idx + 1}</div>
        <div class="journey-stage">{h(stage['stage'])}</div>
        <div class="journey-score-row">
          <span class="score-pill {h(stage['score_class'])}">{h(stage['score'])}</span>
          {low_conf_badge}
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
    if scene["overall"] is None:
        return f"""
        <section class="scenario-panel{active_class}" data-role-panel="{h(role_id)}" data-scene-panel="{h(scene_id)}">
          <div class="placeholder">
            <div class="placeholder-kicker">内容待补齐</div>
            <h3>{h(scene['name'])}</h3>
            <div class="source-row">{source_badges(scene)}</div>
            <p>{h(scene['status_note'])}</p>
          </div>
        </section>
        """

    strongest, weakest = get_stage_extremes(scene)
    strongest_stage_name = strongest["stage"] if strongest else None
    weakest_stage_name = weakest["stage"] if weakest else None
    track = "".join(
        render_stage_node(
            stage,
            idx,
            len(scene["stages"]),
            scene.get("supplemented", False) or scene.get("partial_defined", False),
            stage["stage"] == strongest_stage_name,
            stage["stage"] == weakest_stage_name,
        )
        for idx, stage in enumerate(scene["stages"])
    )
    coverage = scene["coverage"]
    insights = "".join(f"<li>{h(item)}</li>" for item in scene["insights"])
    evidence = "".join(f'<a href="{h(path)}" target="_blank">{h(label)}</a>' for label, path in scene["evidence_links"])
    repo_refs = "".join(
        f'<a class="repo-ref" href="{h(item["url"])}" target="_blank">{h(item["name"])}</a>' if item.get("url")
        else f'<span class="repo-ref plain">{h(item["name"])}</span>'
        for item in scene.get("repo_refs", [])
    )
    top_tags = "".join(f'<span class="repo-chip">{h(item)}</span>' for item in scene["top_repos"])
    risk_tags = "".join(f'<span class="repo-chip risk">{h(item)}</span>' for item in scene["risk_repos"])
    supplement_note = ""
    if scene.get("status_note"):
        supplement_note = f'<div class="inline-note">{h(scene["status_note"])}</div>'
    return f"""
    <section class="scenario-panel{active_class}" data-role-panel="{h(role_id)}" data-scene-panel="{h(scene_id)}">
      <div class="scenario-hero">
        <div>
          <div class="scenario-eyebrow">场景旅程</div>
          <h3>{h(scene['name'])}</h3>
          <div class="source-row">{source_badges(scene)}</div>
          <p class="scenario-summary">综合分 <strong>{h(scene['overall'])}</strong>。{h(scenario_judgement(scene))}</p>
        </div>
        <div class="scenario-score {h(score_class(scene['overall']))}">
          <span>场景分</span>
          <strong>{h(scene['overall'])}</strong>
        </div>
      </div>
      {supplement_note}
      <div class="journey-track">{track}</div>
      <div class="scenario-meta">
        <div class="meta-card">
          <div class="meta-title">得分结论</div>
          <ul>{insights}</ul>
        </div>
        <div class="meta-card">
          <div class="meta-title">辅助证据</div>
          <div class="metric-grid compact">
            <div class="metric"><span>仓库</span><strong>{h(coverage['repo_count'])}</strong></div>
            <div class="metric"><span>tests</span><strong>{h(coverage['tests_coverage'])}%</strong></div>
            <div class="metric"><span>build</span><strong>{h(coverage['package_coverage'])}%</strong></div>
          </div>
          <p class="small-note">覆盖率仅用于辅助解释得分，不作为主结论。平均摩擦 {h(coverage['avg_friction_hits'])}，本地完整验证 {h(coverage['local_full'])}。</p>
          <p class="mini-label">参考仓库</p>
          <div class="repo-ref-list">{repo_refs}</div>
        </div>
        <div class="meta-card">
          <div class="meta-title">入口对比</div>
          <p class="mini-label">相对更顺的入口</p>
          <div class="chip-row">{top_tags}</div>
          <p class="mini-label">高风险入口</p>
          <div class="chip-row">{risk_tags}</div>
          <p class="mini-label">直接证据</p>
          <div class="evidence-links">{evidence}</div>
        </div>
      </div>
    </section>
    """


def render_role_panel(role, idx):
    role_id = f"role-{idx}"
    active = " active" if idx == 0 else ""
    if role["role_undefined"]:
        return f"""
        <section class="role-panel{active}" data-role="{h(role_id)}">
          <div class="role-head">
            <div>
              <div class="role-kicker">{h(role['role_label'])}</div>
              <h2>{h(role['name'])}</h2>
              <div class="source-row"><span class="source-badge context">仅 context.md</span></div>
              <p>{h(role['role_statement'])}</p>
            </div>
          </div>
          <div class="placeholder role-empty">
            <div class="placeholder-kicker">角色仍缺内容层</div>
            <p>这个角色目前还没有可用于旅程可视化的补全数据。</p>
          </div>
        </section>
        """

    scene_tabs = []
    panels = []
    for scene_idx, scene in enumerate(role["scenarios"]):
        scene_id = f"{role_id}-scene-{scene_idx}"
        scene_active = " active" if scene_idx == 0 else ""
        tab_score = "待补" if scene["overall"] is None else scene["overall"]
        scene_tabs.append(
            f"""
            <button class="scene-tab{scene_active}" type="button" data-role-target="{h(role_id)}" data-scene-target="{h(scene_id)}">
              <span class="scene-tab-name">{h(scene['name'])}</span>
              <span class="scene-tab-score">{h(tab_score)}</span>
            </button>
            """
        )
        panels.append(render_scenario_panel(role_id, scene_id, scene, active=scene_idx == 0))

    role_score = "未评分" if role["overall"] is None else role["overall"]
    return f"""
    <section class="role-panel{active}" data-role="{h(role_id)}">
      <div class="role-head">
        <div>
          <div class="role-kicker">{h(role['role_label'])}</div>
          <h2>{h(role['name'])}</h2>
          <div class="source-row"><span class="source-badge context">角色骨架来自 context.md</span><span class="source-badge supplement">{h(role['summary_source'])}</span></div>
          <p>{h(role['role_statement'])}</p>
        </div>
        <div class="role-score">
          <span>角色均分</span>
          <strong>{h(role_score)}</strong>
        </div>
      </div>
      <div class="scene-tabbar">{''.join(scene_tabs)}</div>
      <div class="scene-panels">{''.join(panels)}</div>
    </section>
    """


def render_md(role_summaries):
    lines = [
        "# CANN 角色与旅程体验报告（基于 context.md 骨架 + 新分析补全）",
        "",
        "更新时间：2026-05-14",
        "",
        "这版报告把 `context.md` 作为角色/场景/旅程骨架；如果 context 里缺内容，但新分析已有可用内容，则使用新分析补全，并明确标注来源。",
        "",
    ]
    for role in role_summaries:
        lines.append(f"## {role['name']}")
        lines.append("")
        if role["role_undefined"]:
            lines.append(role["role_statement"])
            lines.append("")
            continue
        lines.append(f"角色均分：`{role['overall']}`")
        lines.append("")
        for scene in role["scenarios"]:
            lines.append(f"### {scene['name']}")
            lines.append("")
            if scene.get("status_note"):
                lines.append(scene["status_note"])
                lines.append("")
            if scene["overall"] is not None:
                lines.append(f"场景分：`{scene['overall']}`")
                for stage in scene["stages"]:
                    lines.append(f"- {stage['stage']}：`{stage['score']}`，{stage['interpretation']}")
                lines.append("")
    return "\n".join(lines) + "\n"


def render_html(role_summaries):
    role_tabs = []
    role_panels = []
    for idx, role in enumerate(role_summaries):
        role_id = f"role-{idx}"
        active = " active" if idx == 0 else ""
        score = "未评分" if role["overall"] is None else role["overall"]
        role_tabs.append(
            f"""
            <button class="role-tab{active}" type="button" data-role-tab="{h(role_id)}">
              <span class="role-tab-name">{h(role['name'])}</span>
              <span class="role-tab-meta">{h(role['role_label'])} · {h(score)}</span>
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
    .role-kicker, .scenario-eyebrow, .meta-title, .placeholder-kicker {{ color: var(--brand); font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }}
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
    .source-badge.partial {{ background: var(--danger-soft); color: var(--danger); }}
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
    .mini-badge.low-confidence {{ background: rgba(180,35,24,.08); color: var(--danger); min-width: auto; }}
    .mini-badge.strongest {{ background: var(--good-soft); color: var(--good); min-width: auto; }}
    .mini-badge.weakest {{ background: var(--danger-soft); color: var(--danger); min-width: auto; }}
    .journey-card {{ margin-top: 10px; min-height: 180px; background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 14px 16px; }}
    .journey-point {{ margin: 0 0 12px; font-size: 15px; }}
    .journey-evidence {{ margin: 0; color: var(--muted); font-size: 13px; }}
    .journey-connector {{ position: absolute; top: 44px; right: -18px; width: 18px; height: 2px; background: linear-gradient(90deg, rgba(15,95,100,.35), rgba(207,122,0,.35)); }}
    .scenario-meta {{ display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 14px; }}
    .meta-card, .placeholder {{ background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: 16px; }}
    .meta-card ul {{ margin: 0; padding-left: 18px; }}
    .metric-grid {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }}
    .metric-grid.compact {{ grid-template-columns: repeat(3, minmax(0, 1fr)); }}
    .metric {{ border-radius: 14px; background: rgba(255,255,255,.72); border: 1px solid var(--line); padding: 10px; }}
    .metric span {{ display: block; color: var(--muted); font-size: 11px; margin-bottom: 3px; }}
    .metric strong {{ font-size: 18px; line-height: 1; }}
    .small-note, .mini-label {{ color: var(--muted); font-size: 13px; }}
    .chip-row {{ display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }}
    .repo-chip {{ display: inline-flex; padding: 6px 10px; border-radius: 999px; background: var(--brand-soft); color: var(--brand); font-size: 12px; font-weight: 600; }}
    .repo-chip.risk {{ background: var(--danger-soft); color: var(--danger); }}
    .repo-ref-list {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }}
    .repo-ref {{ display: inline-flex; padding: 6px 10px; border-radius: 10px; background: rgba(255,255,255,.86); border: 1px solid var(--line); color: var(--brand); font-size: 12px; }}
    .repo-ref.plain {{ color: var(--text); }}
    .evidence-links {{ display: flex; flex-direction: column; gap: 6px; font-size: 14px; }}
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
      <p>这版不再把 context 里的空白硬保留为空。现在的规则是：<code>context.md</code> 负责定义角色、场景和旅程骨架；如果新分析里已经有可映射的用户体验内容，就把内容补进来，并明确标注“新分析补全”。</p>
      <div class="hero-summary">
        <div class="summary-card"><span>角色切换</span><strong>顶部 Tab</strong>先按角色切换，不把不同角色混在一页。</div>
        <div class="summary-card"><span>场景切换</span><strong>角色内多场景</strong>每个角色单独维护自己的场景组。</div>
        <div class="summary-card"><span>旅程展示</span><strong>横向旅程轨道</strong>每个场景按阶段顺序可视化，不再是卡片罗列。</div>
        <div class="summary-card"><span>内容来源</span><strong>显式标注</strong>区分 context 骨架与新分析补全内容。</div>
      </div>
    </header>
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
    role_summaries = [role_summary(role_name, role_cfg, obs_map) for role_name, role_cfg in CONFIG.items()]
    (ROOT / "context-journey-report.md").write_text(render_md(role_summaries), encoding="utf-8")
    (ROOT / "context-journey-report.html").write_text(render_html(role_summaries), encoding="utf-8")


if __name__ == "__main__":
    main()
