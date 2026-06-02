#!/usr/bin/env python3
"""Convert Claude transcript JSONL files into human-readable Markdown."""
from __future__ import annotations

import argparse
import json
import re
import sys
import os
import datetime
from pathlib import Path
from typing import Any, Iterable, List, Sequence, Tuple


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Render a Claude CLI transcript JSONL file as Markdown.",
    )
    parser.add_argument(
        "jsonl_path",
        nargs="?",
        help="Path to the transcript .jsonl file to convert.",
    )
    parser.add_argument(
        "-o",
        "--output",
        help="Optional output path for the Markdown file (defaults to input name with .md).",
    )
    parser.add_argument(
        "--subagent",
        action="store_true",
        help="Save logs to subagent subdirectory instead of main logs directory.",
    )
    return parser.parse_args()

def default_output_path(src_path: Path) -> Path:
    if src_path.suffix == ".jsonl":
        return src_path.with_suffix(".md")
    return src_path.with_suffix(src_path.suffix + ".md")


def load_entries(path: Path) -> List[Tuple[int, Any]]:
    entries: List[Tuple[int, Any]] = []
    with path.open(encoding="utf-8") as handle:
        for idx, raw_line in enumerate(handle, 1):
            line = raw_line.strip()
            if not line:
                continue
            try:
                payload = json.loads(line)
            except json.JSONDecodeError as exc:
                raise SystemExit(f"Failed to parse JSON on line {idx}: {exc}") from exc
            entries.append((idx, payload))
    return entries


_SYSTEM_REMINDER_RE = re.compile(
    r"<system-reminder>.*?</system-reminder>",
    re.DOTALL,
)


def strip_system_reminders(text: str) -> str:
    """Remove all <system-reminder>...</system-reminder> blocks from text."""
    return _SYSTEM_REMINDER_RE.sub("", text).strip()


# Keys extracted once into the session header (no longer repeated per message)
_SESSION_HEADER_KEYS = {
    "sessionId", "cwd", "gitBranch", "version",
}


def build_session_header(entries: Sequence[Tuple[int, Any]], label: str) -> List[str]:
    """Extract session-constant metadata from the first message entry and
    return a compact header block so these fields are written only once."""
    header_vals: dict[str, Any] = {}
    for _line_no, entry in entries:
        if not isinstance(entry, dict):
            continue
        for key in _SESSION_HEADER_KEYS:
            if key in entry and key not in header_vals:
                header_vals[key] = entry[key]
        if len(header_vals) == len(_SESSION_HEADER_KEYS):
            break

    lines: List[str] = [
        f"# Transcript: {label}",
        "",
        "## Session Info",
        "- Log format: v2 (compact)",
    ]
    mapping = [
        ("Session", header_vals.get("sessionId")),
        ("Working dir", header_vals.get("cwd")),
        ("Git branch", header_vals.get("gitBranch")),
        ("Version", header_vals.get("version")),
    ]
    for lbl, val in mapping:
        if val is not None:
            lines.append(f"- {lbl}: {val}")
    lines.append("")
    return lines


def build_markdown(entries: Sequence[Tuple[int, Any]], label: str) -> str:
    lines: List[str] = build_session_header(entries, label)
    for index, (line_no, entry) in enumerate(entries, 1):
        formatted = format_entry(index, line_no, entry)
        if formatted:
            lines.extend(formatted)
            lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def format_entry(index: int, line_no: int, entry: Any) -> List[str]:
    entry_type = entry.get("type") if isinstance(entry, dict) else None

    # Filter: queue-operation entries are pure noise
    if entry_type == "queue-operation":
        return []

    # Filter: empty file-history-snapshot entries
    if entry_type == "file-history-snapshot":
        snapshot = entry.get("snapshot") or {}
        backups = snapshot.get("trackedFileBackups") or {}
        if not backups:
            return []
        return format_snapshot_entry(index, line_no, entry)

    if entry_type in {"assistant", "user"}:
        return format_message_entry(index, line_no, entry)
    if entry_type == "summary":
        return format_summary_entry(index, line_no, entry)
    return format_generic_entry(index, line_no, entry)


def format_message_entry(index: int, line_no: int, entry: dict) -> List[str]:
    message = entry.get("message") or {}
    role = message.get("role") or entry.get("type") or "unknown"
    timestamp = entry.get("timestamp") or "timestamp unavailable"
    header = f"## [{index}] {role} ({entry.get('type')}) — {timestamp}"
    lines: List[str] = [header]

    # Compact metadata: session-level fields moved to header; keep only
    # per-message fields that vary and carry semantic value.
    metadata_pairs = [
        ("Model", message.get("model")),
        ("Stop reason", message.get("stop_reason")),
        ("Usage", message.get("usage")),
    ]
    lines.extend(format_metadata(metadata_pairs))

    lines.extend(format_message_content(message))

    # toolUseResult is omitted — identical content is already in Tool Result.

    return lines


_SKILL_HEADER_RE = re.compile(
    r"^Base directory for this skill:\s*`?([^`\n]+)`?",
    re.MULTILINE,
)


def _try_collapse_skill(text: str) -> str | None:
    """If *text* is an expanded Skill (SKILL.md injected as user message),
    return a one-line summary; otherwise return None."""
    m = _SKILL_HEADER_RE.search(text)
    if not m:
        return None
    skill_path = m.group(1).strip()
    # Extract skill name from path  …/.claude/skills/<skill-name>/…
    parts = skill_path.replace("\\", "/").split("/")
    skill_name = "unknown"
    for i, p in enumerate(parts):
        if p == "skills" and i + 1 < len(parts):
            skill_name = parts[i + 1]
            break
    return f"> [Skill `{skill_name}` loaded, content omitted]"


def format_message_content(message: dict) -> List[str]:
    content = message.get("content")
    lines: List[str] = []
    if isinstance(content, str):
        # Strip system reminders
        content = strip_system_reminders(content)
        # Collapse Skill expansion
        collapsed = _try_collapse_skill(content)
        if collapsed:
            lines.append("### Message")
            lines.append(collapsed)
            lines.append("")
            return lines
        lines.append("### Message")
        lines.extend(render_blockquote(content))
        lines.append("")
        return lines

    if isinstance(content, list):
        text_count = 0
        tool_count = 0
        result_count = 0
        for chunk in content:
            chunk_type = chunk.get("type")
            if chunk_type == "text":
                text_count += 1
                text_val = strip_system_reminders(chunk.get("text", ""))
                # Collapse Skill expansion
                collapsed = _try_collapse_skill(text_val)
                if collapsed:
                    suffix = f" ({text_count})" if text_count > 1 else ""
                    lines.append(f"### Message{suffix}")
                    lines.append(collapsed)
                    lines.append("")
                    continue
                suffix = f" ({text_count})" if text_count > 1 else ""
                lines.append(f"### Message{suffix}")
                lines.extend(render_blockquote(text_val))
                lines.append("")
            elif chunk_type == "tool_use":
                tool_count += 1
                lines.append(f"### Tool Call {tool_count}")
                lines.append(f"- Name: `{chunk.get('name', 'unknown')}`")
                if chunk.get("id"):
                    lines.append(f"- Call ID: `{chunk['id']}`")
                lines.append("")
                lines.extend(render_code_block(chunk.get("input")))
                lines.append("")
            elif chunk_type == "tool_result":
                result_count += 1
                label = f"### Tool Result {result_count}"
                if chunk.get("tool_use_id"):
                    label += f" ← `{chunk['tool_use_id']}`"
                if chunk.get("is_error"):
                    label += " (error)"
                lines.append(label)
                normalized = normalize_tool_result_content(chunk.get("content"))
                lines.extend(render_blockquote(normalized))
                lines.append("")
            elif chunk_type == "thinking":
                thinking_text = chunk.get("thinking", "")
                if thinking_text:
                    lines.append("### Thinking")
                    lines.extend(render_blockquote(thinking_text))
                    lines.append("")
            else:
                lines.append(f"### Content ({chunk_type or 'unknown'})")
                lines.extend(render_code_block(chunk))
                lines.append("")
        if not content:
            lines.append("### Message")
            lines.extend(render_blockquote(""))
            lines.append("")
        return lines

    if content is None:
        return lines

    lines.append("### Message")
    lines.extend(render_code_block(content))
    lines.append("")
    return lines


def normalize_tool_result_content(content: Any) -> str:
    if content is None:
        return ""
    if isinstance(content, str):
        return strip_system_reminders(content)
    if isinstance(content, list):
        parts: List[str] = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text" and "text" in item:
                parts.append(strip_system_reminders(item["text"]))
            else:
                parts.append(json.dumps(item, ensure_ascii=False))
        return "\n".join(parts)
    if isinstance(content, dict):
        return json.dumps(content, indent=2, ensure_ascii=False)
    return str(content)


def format_snapshot_entry(index: int, line_no: int, entry: dict) -> List[str]:
    snapshot = entry.get("snapshot") or {}
    timestamp = snapshot.get("timestamp") or "timestamp unavailable"
    header = f"## [{index}] file-history-snapshot — {timestamp}"
    lines: List[str] = [header]
    metadata_pairs = [
        ("Source line", line_no),
        ("Message ID", entry.get("messageId")),
        ("Snapshot message ID", snapshot.get("messageId")),
        ("Is snapshot update", entry.get("isSnapshotUpdate")),
    ]
    lines.extend(format_metadata(metadata_pairs))

    backups = snapshot.get("trackedFileBackups") or {}
    lines.append("### Tracked File Backups")
    if backups:
        for path_str in sorted(backups):
            info = backups[path_str]
            info_bits = ", ".join(f"{key}={info[key]}" for key in sorted(info))
            lines.append(f"- `{path_str}`: {info_bits}")
    else:
        lines.append("- (none)")
    lines.append("")
    return lines


def format_summary_entry(index: int, line_no: int, entry: dict) -> List[str]:
    header = f"## [{index}] summary — leaf {entry.get('leafUuid', 'unknown')}"
    lines: List[str] = [header]
    lines.extend(format_metadata([("Source line", line_no)]) )
    lines.append("### Summary")
    lines.extend(render_blockquote(entry.get("summary", "")))
    lines.append("")
    return lines


def format_generic_entry(index: int, line_no: int, entry: Any) -> List[str]:
    entry_type = entry.get("type") if isinstance(entry, dict) else type(entry).__name__
    header = f"## [{index}] {entry_type}"
    lines: List[str] = [header, f"- Source line: {line_no}", ""]
    lines.extend(render_code_block(entry))
    lines.append("")
    return lines


def format_metadata(pairs: Iterable[Tuple[str, Any]]) -> List[str]:
    rendered: List[str] = []
    for label, value in pairs:
        if value is None:
            continue
        rendered.append(f"- {label}: {format_metadata_value(value)}")
    if rendered:
        rendered.append("")
    return rendered


def format_metadata_value(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False)
    return str(value)


def render_blockquote(text: str) -> List[str]:
    lines: List[str] = []
    text = text or ""
    if not text:
        return ["> (empty)"]
    for raw_line in text.splitlines():
        lines.append("> " + raw_line if raw_line else ">")
    return lines


def render_code_block(payload: Any, language: str | None = None) -> List[str]:
    if isinstance(payload, str):
        body = payload
        lang = language or "text"
    else:
        try:
            body = json.dumps(payload, indent=2, ensure_ascii=False)
            lang = language or "json"
        except TypeError:
            body = str(payload)
            lang = language or "text"
    return [f"```{lang}", body, "```"]


def estimate_tokens(text: str) -> int:
    """估算文本的 token 数量（近似算法，仅作为后备方案）

    规则：
    - 中文字符约 1.5 tokens
    - 英文/数字约 0.25 tokens (4字符≈1token)
    - 代码和特殊字符约 0.4 tokens
    """
    if not text:
        return 0

    chinese_chars = 0
    other_chars = 0

    for char in text:
        if '\u4e00' <= char <= '\u9fff':  # 中文字符范围
            chinese_chars += 1
        else:
            other_chars += 1

    # 中文 1.5 tokens/字符，其他 0.3 tokens/字符
    return int(chinese_chars * 1.5 + other_chars * 0.3)


def get_telemetry_stats(session_id: str) -> dict:
    """从 telemetry 文件读取真实的 token 使用统计

    Args:
        session_id: 会话 ID

    Returns:
        包含 token 统计的字典，如果找不到返回 None
    """
    import glob

    telemetry_dir = os.path.expanduser("~/.claude/telemetry/")
    pattern = os.path.join(telemetry_dir, f"*{session_id}*.json")
    matching_files = glob.glob(pattern)

    if not matching_files:
        return None

    stats = {
        "api_calls": 0,
        "input_tokens": 0,
        "output_tokens": 0,
        "cached_tokens": 0,
        "cost_usd": 0.0,
        "data_source": "telemetry"
    }

    for filepath in matching_files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                        event_data = data.get('event_data', {})
                        metadata_str = event_data.get('additional_metadata', '{}')
                        metadata = json.loads(metadata_str) if isinstance(metadata_str, str) else metadata_str

                        stats["api_calls"] += 1
                        stats["input_tokens"] += metadata.get('inputTokens', 0) or 0
                        stats["output_tokens"] += metadata.get('outputTokens', 0) or 0
                        stats["cached_tokens"] += metadata.get('cachedInputTokens', 0) or 0
                        stats["cost_usd"] += metadata.get('costUSD', 0) or 0
                    except (json.JSONDecodeError, TypeError):
                        continue
        except IOError:
            continue

    if stats["api_calls"] == 0:
        return None

    stats["total_tokens"] = stats["input_tokens"] + stats["output_tokens"]
    return stats


def extract_text_from_content(content: Any) -> str:
    """从 content 字段中提取所有文本内容"""
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        texts = []
        for chunk in content:
            if isinstance(chunk, dict):
                if chunk.get("type") == "text":
                    texts.append(chunk.get("text", ""))
                elif chunk.get("type") == "tool_use":
                    # 包含工具调用的 name 和 input
                    texts.append(chunk.get("name", ""))
                    texts.append(json.dumps(chunk.get("input", {}), ensure_ascii=False))
                elif chunk.get("type") == "tool_result":
                    texts.append(normalize_tool_result_content(chunk.get("content")))
        return " ".join(texts)
    return str(content)


def calculate_session_stats(entries: Sequence[Tuple[int, Any]], session_id: str = None) -> dict:
    """计算整个 session 的统计数据

    优先从 telemetry 获取真实 token 数据，否则使用估算
    """
    stats = {
        "user_tokens": 0,
        "assistant_tokens": 0,
        "user_messages": 0,
        "assistant_messages": 0,
        "tool_calls": 0,
        "tool_results": 0,
        "api_calls": 0,
        "input_tokens": 0,
        "output_tokens": 0,
        "cached_tokens": 0,
        "cost_usd": 0.0,
        "data_source": "estimated"
    }

    # 优先从 telemetry 获取真实数据
    if session_id:
        telemetry_stats = get_telemetry_stats(session_id)
        if telemetry_stats:
            stats["api_calls"] = telemetry_stats["api_calls"]
            stats["input_tokens"] = telemetry_stats["input_tokens"]
            stats["output_tokens"] = telemetry_stats["output_tokens"]
            stats["cached_tokens"] = telemetry_stats["cached_tokens"]
            stats["cost_usd"] = telemetry_stats["cost_usd"]
            stats["data_source"] = "telemetry"

    # 计算消息统计（这些从 transcript 获取更准确）
    for line_no, entry in entries:
        entry_type = entry.get("type") if isinstance(entry, dict) else None
        if entry_type not in ("user", "assistant"):
            continue

        message = entry.get("message") or {}
        content = message.get("content")

        # 提取文本并估算 tokens（作为后备）
        text = extract_text_from_content(content)
        tokens = estimate_tokens(text)

        # 统计工具调用
        if isinstance(content, list):
            for chunk in content:
                if isinstance(chunk, dict):
                    if chunk.get("type") == "tool_use":
                        stats["tool_calls"] += 1
                    elif chunk.get("type") == "tool_result":
                        stats["tool_results"] += 1

        if entry_type == "user":
            stats["user_tokens"] += tokens
            stats["user_messages"] += 1
        elif entry_type == "assistant":
            stats["assistant_tokens"] += tokens
            stats["assistant_messages"] += 1

    stats["total_messages"] = stats["user_messages"] + stats["assistant_messages"]

    # 如果有 telemetry 数据，使用真实的 token 数
    if stats["data_source"] == "telemetry":
        stats["total_tokens"] = stats["input_tokens"] + stats["output_tokens"]
    else:
        stats["total_tokens"] = stats["user_tokens"] + stats["assistant_tokens"]

    return stats


def build_stats_section(stats: dict) -> str:
    """生成统计汇总的 Markdown 部分"""
    lines = [
        "",
        "---",
        "",
        "# Session Statistics",
        "",
    ]

    if stats["data_source"] == "telemetry":
        # 使用真实的 telemetry 数据
        lines.extend([
            "## Token Usage (Actual from API)",
            f"- **Total Tokens**: {stats['total_tokens']:,}",
            f"- **Input Tokens**: {stats['input_tokens']:,}",
            f"- **Output Tokens**: {stats['output_tokens']:,}",
            f"- **Cached Tokens**: {stats['cached_tokens']:,}",
            f"- **API Calls**: {stats['api_calls']}",
            f"- **Estimated Cost**: ${stats['cost_usd']:.4f}",
            "",
        ])
    else:
        # 使用估算数据
        lines.extend([
            "## Token Usage (Estimated)",
            f"- **Total Tokens**: {stats['total_tokens']:,}",
            f"- **Input Tokens (User)**: {stats['user_tokens']:,}",
            f"- **Output Tokens (Assistant)**: {stats['assistant_tokens']:,}",
            "",
        ])

    lines.extend([
        "## Message Counts",
        f"- **Total Messages**: {stats['total_messages']}",
        f"- **User Messages**: {stats['user_messages']}",
        f"- **Assistant Messages**: {stats['assistant_messages']}",
        "",
        "## Tool Usage",
        f"- **Tool Calls**: {stats['tool_calls']}",
        f"- **Tool Results**: {stats['tool_results']}",
        "",
        f"> Data source: {stats['data_source']}",
        "",
    ])

    return "\n".join(lines)


def handle(jsonl_path : str, output : str, session_id: str = None) -> None:
    src_path = Path(jsonl_path).expanduser().resolve()
    if not src_path.is_file():
        raise SystemExit(f"Input file not found: {src_path}")

    entries = load_entries(src_path)
    markdown = build_markdown(entries, src_path.name)

    # 计算统计数据并追加到 Markdown
    stats = calculate_session_stats(entries, session_id)
    stats_section = build_stats_section(stats)
    markdown += stats_section

    if output:
        out_path = Path(output).expanduser().resolve()
    else:
        out_path = default_output_path(src_path)

    out_path.write_text(markdown, encoding="utf-8")
    print(f"Wrote {out_path}")

    # 打印统计摘要
    if stats["data_source"] == "telemetry":
        print(f"Session stats: {stats['total_tokens']:,} tokens ({stats['input_tokens']:,} input + {stats['output_tokens']:,} output), {stats['api_calls']} API calls, ${stats['cost_usd']:.4f}")
    else:
        print(f"Session stats: {stats['total_tokens']:,} tokens (estimated)")

# json_str = """
# {
#   "session_id": "eb5b0174-55…",
#   "transcript_path": "/Users/wangbo/.claude/projects/-Users-wangbo-Codes-agent-spike-ascendc-agent/agent-0d809015.jsonl",
#   "cwd": "/Users/you/project/myproj",
#   "hook_event_name": "Stop",
#   "stop_hook_active": false
# }
# """


def hook_main(is_subagent: bool = False):
    """Entry point for hook invocation (reads from stdin).

    Args:
        is_subagent: If True, save logs to subagent subdirectory.
    """
    try:
        input_data = json.load(sys.stdin)
        transcript_file = input_data.get("transcript_path")
        if not transcript_file:
            print("Error: Missing transcript_path in input data", file=sys.stderr)
            sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)

    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Extract session_id from transcript file path
    # e.g., /root/.claude/projects/.../22c670d1-07b5-4153-b3f5-bda407053437.jsonl
    session_id = None
    if transcript_file:
        basename = os.path.splitext(os.path.basename(transcript_file))[0]
        # Session ID is typically the filename without extension
        if len(basename) >= 8:  # Valid UUID format
            session_id = basename
            print(f"DEBUG: session_id = {session_id}", file=sys.stderr)

    # Extract operator name: env var (batch mode) > cwd (interactive mode)
    cwd = input_data.get("cwd", "")
    print(f"DEBUG: cwd = {cwd}", file=sys.stderr)
    operator_name = os.environ.get('ASCEND_OPERATOR_NAME') or None
    if operator_name:
        print(f"DEBUG: using operator_name from env ASCEND_OPERATOR_NAME: {operator_name}", file=sys.stderr)

    if not operator_name and cwd:
        # Normalize path and split
        normalized = os.path.normpath(cwd)
        parts = normalized.split(os.sep)
        print(f"DEBUG: normalized path = {normalized}", file=sys.stderr)
        print(f"DEBUG: parts = {parts}", file=sys.stderr)
        try:
            ops_index = parts.index("ops")
            print(f"DEBUG: found 'ops' at index {ops_index}", file=sys.stderr)
            if ops_index + 1 < len(parts):
                candidate = parts[ops_index + 1]
                print(f"DEBUG: candidate operator name = {candidate}", file=sys.stderr)
                # Validate operator name: not empty, not special directories
                if candidate and candidate not in (".", "..") and not candidate.startswith("."):
                    operator_name = candidate
                    print(f"DEBUG: using operator_name from cwd: {operator_name}", file=sys.stderr)
        except ValueError:
            print(f"DEBUG: 'ops' not found in path", file=sys.stderr)
            pass  # "ops" not found in path


    # Determine output directory
    logs_root = os.path.join(script_dir, "../../logs/")
    batch_id = os.environ.get('ASCEND_BATCH_ID')

    if batch_id:
        # Batch evaluation mode: write to batch directory
        output_dir = os.path.join(logs_root, f'batch_{batch_id}')
    else:
        # Normal development mode: write to root directory
        output_dir = logs_root

    # Subagent logs go to a separate subdirectory
    if is_subagent:
        output_dir = os.path.join(output_dir, 'subagents')
        print(f"DEBUG: subagent mode, output_dir = {output_dir}", file=sys.stderr)

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Generate filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    original_filename = os.path.splitext(os.path.basename(transcript_file))[0]
    short_id = original_filename[:8]  # first 8 chars of original filename (likely session ID)

    if operator_name:
        output_filename = f"{operator_name}.md"
    else:
        output_filename = f"{timestamp}_{short_id}.md"

    output_file_path = os.path.join(output_dir, output_filename)
    handle(transcript_file, output_file_path, session_id)


def main():
    """Entry point for command-line invocation."""
    args = parse_args()
    if args.jsonl_path:
        handle(args.jsonl_path, args.output)
    else:
        print("Error: jsonl_path is required for CLI mode", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    # Determine if called as hook (stdin has data) or CLI
    import select
    args = parse_args()

    if select.select([sys.stdin], [], [], 0.0)[0]:
        # stdin has data, assume hook invocation
        hook_main(is_subagent=args.subagent)
    else:
        # no stdin, assume CLI with arguments
        if args.subagent:
            print("Warning: --subagent flag is only effective in hook mode (stdin)", file=sys.stderr)
        main()