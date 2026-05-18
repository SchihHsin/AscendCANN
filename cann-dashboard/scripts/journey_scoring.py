import math


COMPONENTS = [
    ("documentation", "文档清晰度", 30),
    ("environment", "环境可达性", 30),
    ("automation", "自动化友好度", 25),
    ("feedback", "反馈与验证质量", 15),
]


CANONICAL_STAGES = [
    ("search", "搜索发现"),
    ("acquire", "代码获取"),
    ("environment", "环境准备"),
    ("install", "依赖安装"),
    ("assets", "数据/权重/外部资产准备"),
    ("run", "首次运行"),
    ("verify", "结果验证"),
    ("extend", "深入修改/扩展"),
    ("troubleshoot", "排障与回归"),
]


STAGE_WEIGHTS = {
    "search": 0.10,
    "acquire": 0.10,
    "environment": 0.15,
    "install": 0.10,
    "assets": 0.10,
    "run": 0.20,
    "verify": 0.10,
    "extend": 0.10,
    "troubleshoot": 0.05,
}


COMPONENT_CAPS = {key: cap for key, _, cap in COMPONENTS}


STAGE_PRIORITIES = {
    "search": {"documentation": 1.7, "environment": 0.7, "automation": 0.9, "feedback": 0.6},
    "acquire": {"documentation": 1.4, "environment": 1.0, "automation": 1.1, "feedback": 0.8},
    "environment": {"documentation": 1.0, "environment": 1.7, "automation": 1.1, "feedback": 0.6},
    "install": {"documentation": 0.9, "environment": 1.5, "automation": 1.3, "feedback": 0.7},
    "assets": {"documentation": 0.9, "environment": 1.3, "automation": 1.2, "feedback": 0.6},
    "run": {"documentation": 0.8, "environment": 1.3, "automation": 1.0, "feedback": 1.0},
    "verify": {"documentation": 0.8, "environment": 0.8, "automation": 0.9, "feedback": 1.8},
    "extend": {"documentation": 1.0, "environment": 0.9, "automation": 1.5, "feedback": 0.8},
    "troubleshoot": {"documentation": 0.7, "environment": 1.0, "automation": 1.1, "feedback": 1.6},
}


FORMULAS = {
    "search": {
        "documentation": {"discover": 0.55, "docs": 0.45},
        "environment": {"setup": 0.10, "friction_inv": 0.65, "local_bonus": 0.25},
        "automation": {"auto": 0.35, "discover": 0.20, "docs": 0.45},
        "feedback": {"verify": 0.20, "run": 0.20, "docs": 0.60},
    },
    "acquire": {
        "documentation": {"docs": 0.35, "discover": 0.25, "setup": 0.40},
        "environment": {"setup": 0.30, "friction_inv": 0.40, "local_bonus": 0.30},
        "automation": {"auto": 0.45, "setup": 0.25, "run": 0.30},
        "feedback": {"verify": 0.30, "run": 0.35, "docs": 0.35},
    },
    "environment": {
        "documentation": {"docs": 0.45, "setup": 0.55},
        "environment": {"setup": 0.50, "friction_inv": 0.30, "local_bonus": 0.20},
        "automation": {"auto": 0.45, "setup": 0.35, "docs": 0.20},
        "feedback": {"verify": 0.45, "docs": 0.20, "run": 0.35},
    },
    "install": {
        "documentation": {"docs": 0.40, "setup": 0.60},
        "environment": {"setup": 0.45, "friction_inv": 0.35, "local_bonus": 0.20},
        "automation": {"auto": 0.50, "setup": 0.35, "run": 0.15},
        "feedback": {"verify": 0.50, "docs": 0.20, "run": 0.30},
    },
    "assets": {
        "documentation": {"docs": 0.55, "discover": 0.15, "setup": 0.30},
        "environment": {"setup": 0.20, "friction_inv": 0.40, "local_bonus": 0.40},
        "automation": {"auto": 0.40, "setup": 0.20, "friction_inv": 0.40},
        "feedback": {"verify": 0.30, "docs": 0.30, "run": 0.40},
    },
    "run": {
        "documentation": {"docs": 0.30, "setup": 0.20, "run": 0.50},
        "environment": {"setup": 0.25, "friction_inv": 0.35, "local_bonus": 0.40},
        "automation": {"auto": 0.35, "setup": 0.20, "run": 0.45},
        "feedback": {"verify": 0.45, "run": 0.40, "docs": 0.15},
    },
    "verify": {
        "documentation": {"docs": 0.30, "run": 0.20, "verify": 0.50},
        "environment": {"setup": 0.20, "friction_inv": 0.25, "local_bonus": 0.55},
        "automation": {"auto": 0.30, "run": 0.20, "verify": 0.50},
        "feedback": {"verify": 0.60, "run": 0.25, "docs": 0.15},
    },
    "extend": {
        "documentation": {"docs": 0.40, "discover": 0.20, "setup": 0.40},
        "environment": {"setup": 0.30, "friction_inv": 0.30, "local_bonus": 0.40},
        "automation": {"auto": 0.55, "run": 0.15, "setup": 0.30},
        "feedback": {"verify": 0.35, "run": 0.20, "docs": 0.45},
    },
    "troubleshoot": {
        "documentation": {"docs": 0.35, "discover": 0.15, "verify": 0.50},
        "environment": {"setup": 0.25, "friction_inv": 0.30, "local_bonus": 0.45},
        "automation": {"auto": 0.45, "verify": 0.20, "setup": 0.35},
        "feedback": {"verify": 0.65, "docs": 0.20, "run": 0.15},
    },
}


def clamp(value, low=0, high=100):
    return max(low, min(high, value))


def round_int(value):
    return int(round(value))


def avg(values):
    return round(sum(values) / len(values), 2) if values else 0.0


def score_class(score):
    if score >= 80:
        return "high"
    if score >= 60:
        return "mid"
    if score >= 40:
        return "low"
    return "bad"


def feature_vector(observation):
    dims = observation["scores"]["dimensions"]
    local_status = observation["local_observation"]["local_status"]
    if local_status == "full":
        local_bonus = 100
    elif local_status in {"git_only", "incomplete"}:
        local_bonus = 70
    else:
        local_bonus = 45
    return {
        "discover": dims["discoverability_15"] / 15 * 100,
        "docs": dims["documentation_onboarding_20"] / 20 * 100,
        "setup": dims["setup_explicitness_20"] / 20 * 100,
        "run": dims["run_affordance_20"] / 20 * 100,
        "verify": dims["verification_regression_15"] / 15 * 100,
        "auto": dims["automation_friendliness_10"] / 10 * 100,
        "friction_inv": (20 - dims["friction_penalty_20"]) / 20 * 100,
        "local_bonus": local_bonus,
    }


def _weighted_feature_score(feature_values, weights):
    return sum(feature_values[name] * weight for name, weight in weights.items())


def score_stage_from_features(stage_key, feature_values):
    formulas = FORMULAS[stage_key]
    output = {}
    total = 0
    for component_key, _, component_cap in COMPONENTS:
        normalized = _weighted_feature_score(feature_values, formulas[component_key])
        component_score = round_int(clamp(normalized, 0, 100) * component_cap / 100)
        output[component_key] = component_score
        total += component_score
    output["score"] = total
    output["score_class"] = score_class(total)
    return output


def merge_stage_component_sets(stage_component_sets):
    merged = {}
    for component_key, _, _ in COMPONENTS:
        merged[component_key] = round_int(avg([item[component_key] for item in stage_component_sets]))
    merged["score"] = sum(merged[key] for key, _, _ in COMPONENTS)
    merged["score_class"] = score_class(merged["score"])
    return merged


def aggregate_stage_from_observations(stage_key, observations):
    components = [
        score_stage_from_features(stage_key, feature_vector(observation))
        for observation in observations
    ]
    return merge_stage_component_sets(components)


def weighted_total(stage_scores):
    total = 0.0
    for stage_key, _ in CANONICAL_STAGES:
        if stage_key in stage_scores:
            total += stage_scores[stage_key]["score"] * STAGE_WEIGHTS[stage_key]
    return round(total, 1)


def renormalized_weighted_total(stage_scores, included_stage_keys):
    included_weight = sum(STAGE_WEIGHTS[key] for key in included_stage_keys)
    if not included_weight:
        return None
    total = 0.0
    for stage_key in included_stage_keys:
        total += stage_scores[stage_key]["score"] * STAGE_WEIGHTS[stage_key]
    return round(total / included_weight, 1)


def split_existing_stage_score(total_score, stage_key):
    priorities = STAGE_PRIORITIES[stage_key]
    remaining_total = total_score
    remaining_caps = COMPONENT_CAPS.copy()
    remaining_keys = [key for key, _, _ in COMPONENTS]
    allocations = {key: 0.0 for key in remaining_keys}

    while remaining_keys and remaining_total > 0:
        weight_sum = sum(priorities[key] for key in remaining_keys)
        progressed = False
        saturated = []
        for key in remaining_keys:
            tentative = remaining_total * priorities[key] / weight_sum
            if tentative >= remaining_caps[key]:
                allocations[key] += remaining_caps[key]
                remaining_total -= remaining_caps[key]
                saturated.append(key)
                progressed = True
        if progressed:
            for key in saturated:
                remaining_keys.remove(key)
                remaining_caps[key] = 0.0
            continue
        for key in remaining_keys:
            allocations[key] += remaining_total * priorities[key] / weight_sum
        remaining_total = 0

    floors = {key: math.floor(value) for key, value in allocations.items()}
    remainder = total_score - sum(floors.values())
    fractions = sorted(
        ((allocations[key] - floors[key], key) for key in floors),
        reverse=True,
    )
    index = 0
    while remainder > 0 and index < len(fractions):
        _, key = fractions[index]
        if floors[key] < COMPONENT_CAPS[key]:
            floors[key] += 1
            remainder -= 1
        index += 1
        if index == len(fractions) and remainder > 0:
            index = 0

    result = dict(floors)
    result["score"] = total_score
    result["score_class"] = score_class(total_score)
    return result


def component_line(stage_score):
    return " / ".join(
        f"{label} {stage_score[key]}"
        for key, label, _ in COMPONENTS
    )
