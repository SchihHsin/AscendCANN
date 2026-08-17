#!/usr/bin/env python3
"""2026-08-18 CANN × CUDA AI 可用性实测数据。

原始记录见 ../ai-usability-run-20260818.md；计分函数复用
ai-usability-benchmark/score_template.py，避免前端手填分数。
"""
import json
import sys

sys.path.insert(0, "/Users/hsin/.codex/skills/ai-usability-benchmark")
import score_template as score

# 任务 A：最小逐元素 Add 自定义核；B：ONNX 模型转换；C：性能采集。
# baseline = CUDA / NVIDIA，target = CANN / Ascend。
# sources / platforms 仅填本轮实际访问或已有截图记录的二手渠道；官方不重复计入。
score.RAW = {
    "A_自定义算子": {
        "baseline": dict(
            rounds=1, rank=1, refine=False, fetch=1, fetch_fail=0,
            core_fetch="static", exec=True, ref_level="exhaustive",
            n_versions=1, ver_matrix=False, ver_irrelev=False, two_axis=False,
            sources=[], platforms=[], dates=[], consist="mid",
            own=5, churn="stable", pin="exact", repro="copyrun",
        ),
        "target": dict(
            rounds=1, rank=1, refine=False, fetch=2, fetch_fail=0,
            core_fetch="ssr", exec=True, ref_level="core_only",
            n_versions=13, ver_matrix=False, ver_irrelev=False, two_axis=True,
            sources=["tech_blog"], platforms=["csdn.net"], dates=[None], consist="mid",
            own=3, churn="moderate", pin="exact", repro="copyrun",
        ),
    },
    "B_模型转换": {
        "baseline": dict(
            rounds=1, rank=1, refine=False, fetch=1, fetch_fail=0,
            core_fetch="static", exec=True, ref_level="core_only",
            n_versions=1, ver_matrix=False, ver_irrelev=False, two_axis=False,
            sources=[], platforms=[], dates=[], consist="mid",
            own=4, churn="moderate", pin="mostly", repro="params",
        ),
        "target": dict(
            rounds=1, rank=1, refine=False, fetch=1, fetch_fail=0,
            core_fetch="ssr", exec=False, ref_level="overview",
            n_versions=13, ver_matrix=False, ver_irrelev=False, two_axis=True,
            sources=["tech_blog"], platforms=["csdn.net"], dates=[None], consist="mid",
            own=3, churn="moderate", pin="mostly", repro="skeleton",
        ),
    },
    "C_性能分析": {
        "baseline": dict(
            rounds=1, rank=1, refine=False, fetch=1, fetch_fail=0,
            core_fetch="static", exec=True, ref_level="exhaustive",
            n_versions=1, ver_matrix=False, ver_irrelev=False, two_axis=False,
            sources=[], platforms=[], dates=[], consist="mid",
            own=4, churn="stable", pin="mostly", repro="params",
        ),
        "target": dict(
            rounds=1, rank=1, refine=False, fetch=1, fetch_fail=0,
            core_fetch="ssr", exec=False, ref_level="overview",
            n_versions=13, ver_matrix=False, ver_irrelev=False, two_axis=True,
            sources=["tech_blog"], platforms=["csdn.net"], dates=[None], consist="mid",
            own=3, churn="moderate", pin="range", repro="skeleton",
        ),
    },
}

# 空二手源意味着没有在本轮证据中采集可用的二手来源，按 1 分而不是除零。
_source6 = score.score6_sec_cred
def score6_safe(record):
    return 1 if not record["sources"] else _source6(record)
score.METRICS[5] = score6_safe
score.TASKS = list(score.RAW.keys())

if __name__ == "__main__":
    out = score.compute()
    if "--json" in sys.argv:
        print(json.dumps(out, ensure_ascii=False, indent=2))
    else:
        for task, stacks in out.items():
            print(task)
            for name, result in stacks.items():
                print(name, result)
