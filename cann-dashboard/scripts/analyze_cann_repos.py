import json
import math
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path


BASE_URL = "https://api.gitcode.com/api/v5"
ROOT = Path(__file__).resolve().parents[1]


LOCAL_OBSERVATIONS = {
    "cann-recipes-embodied-intelligence": {
        "local_status": "full",
        "local_path": str(ROOT / "repo-scan" / "cann-recipes-embodied-intelligence"),
        "local_compileall_passed": True,
        "local_notes": "README and representative path reviewed; compileall passed on pi0 infer path.",
    },
    "cann-recipes-spatial-intelligence": {
        "local_status": "full",
        "local_path": str(ROOT / "repo-scan" / "cann-recipes-spatial-intelligence"),
        "local_compileall_passed": True,
        "local_notes": "README and VGGT path reviewed; compileall passed on representative path.",
    },
    "hixl": {
        "local_status": "full",
        "local_path": str(ROOT / "repo-scan" / "hixl"),
        "local_compileall_passed": True,
        "local_notes": "README/build/tests/examples reviewed; compileall passed on examples path.",
    },
    "pyasc": {
        "local_status": "full",
        "local_path": str(ROOT / "repo-scan" / "pyasc"),
        "local_compileall_passed": True,
        "local_notes": "README and quick start reviewed; compileall passed on python package path.",
    },
    "ops-math": {
        "local_status": "git_only",
        "local_path": str(ROOT / "repo-scan" / "ops-math"),
        "local_compileall_passed": False,
        "local_notes": "Local clone only contains .git metadata.",
    },
    "asc-devkit": {
        "local_status": "git_only",
        "local_path": str(ROOT / "repo-scan" / "asc-devkit-fresh"),
        "local_compileall_passed": False,
        "local_notes": "Fresh local clone only contains .git metadata.",
    },
    "hcomm": {
        "local_status": "git_only",
        "local_path": str(ROOT / "repo-scan" / "hcomm"),
        "local_compileall_passed": False,
        "local_notes": "Local clone only contains .git metadata.",
    },
    "cann-recipes-infer": {
        "local_status": "incomplete",
        "local_path": str(ROOT / "repo-scan" / "cann-recipes-infer"),
        "local_compileall_passed": False,
        "local_notes": "Fresh clone attempt timed out; local observable content is near-empty.",
    },
    "cann-recipes-train": {
        "local_status": "incomplete",
        "local_path": str(ROOT / "repo-scan" / "cann-recipes-train"),
        "local_compileall_passed": False,
        "local_notes": "Fresh clone attempt timed out; local observable content is near-empty.",
    },
}


README_CANDIDATES = [
    "README.md",
    "README.MD",
    "README.rst",
    "README.txt",
    "README",
    "readme.md",
    "Readme.md",
]


PACKAGE_FILES = {
    "requirements.txt",
    "pyproject.toml",
    "setup.py",
    "package.json",
    "cargo.toml",
    "cmakelists.txt",
    "makefile",
    "dockerfile",
    "build.sh",
    "install.sh",
    "configure",
}

DOC_DIRS = {"docs", "doc", "documentation", "guide", "guides"}
EXAMPLE_DIRS = {"example", "examples", "sample", "samples", "demo", "demos", "tutorial", "tutorials"}
TEST_DIRS = {"test", "tests", "benchmark", "benchmarks", "eval", "evaluation", "verify", "verification"}
SCRIPT_DIRS = {"script", "scripts", "bin", "tools", "tool", "ci"}

SETUP_PATTERNS = [
    r"pip install",
    r"conda",
    r"cmake",
    r"docker",
    r"make\b",
    r"install",
    r"编译",
    r"安装",
    r"environment",
]

RUN_PATTERNS = [
    r"python\s",
    r"bash\s",
    r"\./",
    r"\binfer\b",
    r"\btrain\b",
    r"\bdemo\b",
    r"\busage\b",
    r"运行",
    r"启动",
]

VERIFY_PATTERNS = [
    r"\btest\b",
    r"\btests\b",
    r"\bbenchmark\b",
    r"\beval\b",
    r"\bverify\b",
    r"验证",
    r"评测",
]

TROUBLESHOOT_PATTERNS = [
    r"faq",
    r"troubleshoot",
    r"troubleshooting",
    r"common issue",
    r"常见问题",
    r"故障",
    r"排障",
    r"错误",
]

FRICTION_PATTERNS = {
    "set_env": r"set_env\.sh|source\s+set_env",
    "torch_npu": r"torch[_-]?npu",
    "npu_toolchain": r"\bnpu-smi\b|\batc\b|\bmsopgen\b|\bhccn_tool\b",
    "manual_copy": r"\bcp\s|manual|手动|复制",
    "external_clone": r"git clone",
    "weights": r"checkpoint|ckpt|weight|权重",
    "conda_heavy": r"\bconda\b",
}


def api_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8")), dict(resp.headers)


def api_text(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="ignore"), dict(resp.headers)


def count_pattern_hits(text: str, patterns):
    hits = {}
    lowered = text.lower()
    for pattern in patterns:
        hits[pattern] = len(re.findall(pattern, lowered))
    return hits


def fetch_repos(token: str):
    repos = []
    headers = {}
    total_count = None
    total_page = None
    for page in range(1, 5):
        url = f"{BASE_URL}/orgs/cann/repos?type=public&per_page=20&page={page}&access_token={urllib.parse.quote(token)}"
        data, resp_headers = api_json(url)
        repos.extend(data)
        if total_count is None:
            total_count = int(resp_headers.get("total_count", len(data)))
            total_page = int(resp_headers.get("total_page", page))
    return repos, {"total_count": total_count, "total_page": total_page}


def fetch_root_tree(token: str, repo_name: str, default_branch: str):
    url = (
        f"{BASE_URL}/repos/cann/{repo_name}/git/trees/{urllib.parse.quote(default_branch)}"
        f"?access_token={urllib.parse.quote(token)}&per_page=100"
    )
    data, _ = api_json(url)
    return data.get("tree", [])


def fetch_readme(token: str, repo_name: str, readme_path: str, ref: str):
    quoted_path = "/".join(urllib.parse.quote(part) for part in readme_path.split("/"))
    url = (
        f"{BASE_URL}/repos/cann/{repo_name}/raw/{quoted_path}"
        f"?access_token={urllib.parse.quote(token)}&ref={urllib.parse.quote(ref)}"
    )
    text, _ = api_text(url)
    return text


def detect_category(name: str):
    if name.startswith("cann-recipes") or name in {"cann-samples", "cann-learning-hub", "torchtitan-npu", "tensorflow", "xla-npu"}:
        return "app_recipe"
    if name.startswith("ops-") or name in {
        "opbase",
        "catlass",
        "catccos",
        "atvoss",
        "ascend-transformer-boost",
        "ascend-boost-comm",
        "pto-isa",
        "ge",
        "metadef",
        "runtime",
        "driver",
        "hccl",
        "shmem",
        "hcomm",
        "hixl",
        "pyasc",
        "asnumpy",
        "asc-devkit",
        "asc-tools",
        "cmake",
        "amct",
        "infrastructure",
        "triton-inference-server-ge-backend",
    }:
        return "infra_operator"
    if name.startswith("elec-") or name == "mat-chem-sim-pred":
        return "industry_solution"
    if name in {"community", ".gitcode", "manifest", "release-management", "cann-agreements", "cann-competitions", "cannbot-skills", "cann-spack-package"}:
        return "community_governance"
    return "other"


def compute_feature_flags(repo, tree, readme_text):
    entries = [item["name"] for item in tree]
    entries_lower = [name.lower() for name in entries]
    dirs_lower = {
        item["name"].lower()
        for item in tree
        if item.get("type") == "tree"
    }

    readme_path = None
    for candidate in README_CANDIDATES:
        if candidate.lower() in entries_lower:
            idx = entries_lower.index(candidate.lower())
            readme_path = entries[idx]
            break

    package_files = sorted(name for name in entries if name.lower() in PACKAGE_FILES)
    has_doc_dir = any(name in dirs_lower for name in DOC_DIRS)
    has_example_dir = any(name in dirs_lower for name in EXAMPLE_DIRS)
    has_test_dir = any(name in dirs_lower for name in TEST_DIRS)
    has_script_dir = any(name in dirs_lower for name in SCRIPT_DIRS)

    readme_lower = readme_text.lower() if readme_text else ""
    setup_hits = count_pattern_hits(readme_lower, SETUP_PATTERNS) if readme_text else {}
    run_hits = count_pattern_hits(readme_lower, RUN_PATTERNS) if readme_text else {}
    verify_hits = count_pattern_hits(readme_lower, VERIFY_PATTERNS) if readme_text else {}
    trouble_hits = count_pattern_hits(readme_lower, TROUBLESHOOT_PATTERNS) if readme_text else {}
    friction_hits = count_pattern_hits(readme_lower, FRICTION_PATTERNS.values()) if readme_text else {}

    return {
        "readme_path": readme_path,
        "readme_length": len(readme_text),
        "tree_entry_count": len(tree),
        "root_entries": entries[:50],
        "package_files": package_files,
        "has_doc_dir": has_doc_dir,
        "has_example_dir": has_example_dir,
        "has_test_dir": has_test_dir,
        "has_script_dir": has_script_dir,
        "setup_hits_total": sum(setup_hits.values()),
        "run_hits_total": sum(run_hits.values()),
        "verify_hits_total": sum(verify_hits.values()),
        "trouble_hits_total": sum(trouble_hits.values()),
        "friction_hits_total": sum(friction_hits.values()),
    }


def clamp(value, low, high):
    return max(low, min(high, value))


def score_repo(repo, flags, local):
    stars = repo.get("stargazers_count", 0) or 0
    has_description = bool((repo.get("description") or "").strip())
    has_language = bool(repo.get("language"))
    has_readme = bool(flags["readme_path"])
    has_package_file = bool(flags["package_files"])
    local_status = (local or {}).get("local_status")
    local_compileall = bool((local or {}).get("local_compileall_passed"))

    discovery = 0
    discovery += 8 if has_description else 2
    discovery += 2 if has_language else 0
    discovery += clamp(int(math.log10(stars + 1) * 3), 0, 5)
    discovery = clamp(discovery, 0, 15)

    docs = 0
    docs += 8 if has_readme else 0
    docs += 4 if flags["has_doc_dir"] else 0
    docs += 4 if flags["setup_hits_total"] > 0 else 0
    docs += 4 if flags["readme_length"] > 1200 else (2 if flags["readme_length"] > 300 else 0)
    docs = clamp(docs, 0, 20)

    setup = 0
    setup += 10 if has_package_file else 0
    setup += 6 if flags["has_script_dir"] else 0
    setup += 4 if flags["setup_hits_total"] > 2 else (2 if flags["setup_hits_total"] > 0 else 0)
    setup = clamp(setup, 0, 20)

    run_affordance = 0
    run_affordance += 8 if flags["has_example_dir"] else 0
    run_affordance += 6 if flags["run_hits_total"] > 1 else (3 if flags["run_hits_total"] > 0 else 0)
    run_affordance += 2 if flags["has_script_dir"] else 0
    run_affordance += 4 if local_compileall else 0
    run_affordance = clamp(run_affordance, 0, 20)

    verification = 0
    verification += 8 if flags["has_test_dir"] else 0
    verification += 4 if flags["verify_hits_total"] > 1 else (2 if flags["verify_hits_total"] > 0 else 0)
    verification += 3 if local_compileall else 0
    verification = clamp(verification, 0, 15)

    automation = 0
    automation += 4 if has_package_file else 0
    automation += 2 if flags["has_script_dir"] else 0
    automation += 2 if flags["has_test_dir"] else 0
    automation += 2 if flags["has_example_dir"] else 0
    automation = clamp(automation, 0, 10)

    friction_penalty = 0
    friction_penalty += clamp(flags["friction_hits_total"], 0, 6) * 2
    if local_status == "git_only":
        friction_penalty += 8
    elif local_status == "incomplete":
        friction_penalty += 6
    friction_penalty = clamp(friction_penalty, 0, 20)

    observable_score = clamp(
        discovery + docs + setup + run_affordance + verification + automation - friction_penalty,
        0,
        100,
    )

    if local_status == "full":
        confidence = 100
        evidence_grade = "A"
    elif local_status in {"git_only", "incomplete"}:
        confidence = 85 if has_readme else 70
        evidence_grade = "B+"
    elif has_readme and flags["tree_entry_count"] > 0:
        confidence = 75
        evidence_grade = "B"
    elif flags["tree_entry_count"] > 0:
        confidence = 60
        evidence_grade = "C+"
    else:
        confidence = 35
        evidence_grade = "C"

    weighted_score = round(observable_score * confidence / 100.0, 2)

    return {
        "dimensions": {
            "discoverability_15": discovery,
            "documentation_onboarding_20": docs,
            "setup_explicitness_20": setup,
            "run_affordance_20": run_affordance,
            "verification_regression_15": verification,
            "automation_friendliness_10": automation,
            "friction_penalty_20": friction_penalty,
        },
        "observable_score": observable_score,
        "confidence_score": confidence,
        "evidence_grade": evidence_grade,
        "weighted_score": weighted_score,
    }


def summarize(observations):
    category_scores = defaultdict(list)
    grade_counter = Counter()
    local_status_counter = Counter()
    for item in observations:
        category_scores[item["category"]].append(item["scores"]["observable_score"])
        grade_counter[item["scores"]["evidence_grade"]] += 1
        local_status_counter[item["local_observation"]["local_status"] or "enumerated_only"] += 1

    weighted_avg = 0.0
    weight_sum = 0.0
    for item in observations:
        weighted_avg += item["scores"]["observable_score"] * item["scores"]["confidence_score"]
        weight_sum += item["scores"]["confidence_score"]

    return {
        "repo_count": len(observations),
        "observable_average": round(sum(item["scores"]["observable_score"] for item in observations) / len(observations), 2),
        "confidence_weighted_average": round(weighted_avg / weight_sum, 2) if weight_sum else 0.0,
        "evidence_grade_distribution": dict(grade_counter),
        "local_status_distribution": dict(local_status_counter),
        "category_average_scores": {
            key: round(sum(values) / len(values), 2)
            for key, values in sorted(category_scores.items())
        },
        "top_10_by_weighted_score": [
            {
                "repo": item["repo"],
                "weighted_score": item["scores"]["weighted_score"],
                "observable_score": item["scores"]["observable_score"],
                "confidence_score": item["scores"]["confidence_score"],
                "evidence_grade": item["scores"]["evidence_grade"],
            }
            for item in sorted(observations, key=lambda x: (-x["scores"]["weighted_score"], x["repo"]))[:10]
        ],
        "bottom_10_by_weighted_score": [
            {
                "repo": item["repo"],
                "weighted_score": item["scores"]["weighted_score"],
                "observable_score": item["scores"]["observable_score"],
                "confidence_score": item["scores"]["confidence_score"],
                "evidence_grade": item["scores"]["evidence_grade"],
            }
            for item in sorted(observations, key=lambda x: (x["scores"]["weighted_score"], x["repo"]))[:10]
        ],
        "scoring_formula": {
            "observable_score": "discoverability(15) + documentation_onboarding(20) + setup_explicitness(20) + run_affordance(20) + verification_regression(15) + automation_friendliness(10) - friction_penalty(0..20), clamp to 0..100",
            "confidence_score": {
                "A": "100: local full-tree validation and command-level evidence",
                "B+": "70..85: local incomplete/git-only validation plus remote tree/readme evidence",
                "B": "75: remote tree + readme available",
                "C+": "60: remote tree available but readme unavailable",
                "C": "35: metadata only",
            },
            "weighted_score": "observable_score * confidence_score / 100",
        },
    }


def main():
    token = os.environ.get("GITCODE_TOKEN")
    if not token:
        print("GITCODE_TOKEN is required in environment", file=sys.stderr)
        sys.exit(1)

    repos, repo_headers = fetch_repos(token)
    observations = []

    for repo in sorted(repos, key=lambda x: x["name"].lower()):
        repo_name = repo["name"]
        default_branch = repo.get("default_branch") or "master"

        tree = []
        readme_text = ""
        fetch_errors = []

        try:
            tree = fetch_root_tree(token, repo_name, default_branch)
        except Exception as exc:  # noqa: BLE001
            fetch_errors.append(f"tree_fetch_failed: {exc.__class__.__name__}")

        flags = compute_feature_flags(repo, tree, readme_text)

        if flags["readme_path"]:
            try:
                readme_text = fetch_readme(token, repo_name, flags["readme_path"], default_branch)
            except Exception as exc:  # noqa: BLE001
                fetch_errors.append(f"readme_fetch_failed: {exc.__class__.__name__}")
            flags = compute_feature_flags(repo, tree, readme_text)

        local = LOCAL_OBSERVATIONS.get(repo_name, {})
        scores = score_repo(repo, flags, local)

        observations.append(
            {
                "repo": repo_name,
                "html_url": repo["html_url"],
                "category": detect_category(repo_name),
                "metadata": {
                    "description": repo.get("description") or "",
                    "language": repo.get("language"),
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "open_issues": repo.get("open_issues_count", 0),
                    "default_branch": default_branch,
                    "created_at": repo.get("created_at"),
                    "updated_at": repo.get("updated_at"),
                },
                "remote_observation": {
                    "tree_fetched": bool(tree),
                    "tree_entry_count": flags["tree_entry_count"],
                    "root_entries": flags["root_entries"],
                    "readme_path": flags["readme_path"],
                    "readme_length": flags["readme_length"],
                    "package_files": flags["package_files"],
                    "has_doc_dir": flags["has_doc_dir"],
                    "has_example_dir": flags["has_example_dir"],
                    "has_test_dir": flags["has_test_dir"],
                    "has_script_dir": flags["has_script_dir"],
                    "setup_hits_total": flags["setup_hits_total"],
                    "run_hits_total": flags["run_hits_total"],
                    "verify_hits_total": flags["verify_hits_total"],
                    "trouble_hits_total": flags["trouble_hits_total"],
                    "friction_hits_total": flags["friction_hits_total"],
                    "fetch_errors": fetch_errors,
                },
                "local_observation": {
                    "local_status": local.get("local_status"),
                    "local_path": local.get("local_path"),
                    "local_compileall_passed": local.get("local_compileall_passed", False),
                    "local_notes": local.get("local_notes"),
                },
                "scores": scores,
            }
        )
        time.sleep(0.05)

    summary = summarize(observations)
    summary["repo_headers"] = repo_headers

    (ROOT / "cann-agentic-observations.json").write_text(
        json.dumps(observations, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (ROOT / "cann-agentic-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
