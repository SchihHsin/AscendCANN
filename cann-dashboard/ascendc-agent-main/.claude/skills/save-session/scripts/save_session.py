"""自动保存当前Claude Code会话记录为Markdown格式"""
import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path


def get_current_session_id():
    """从history.jsonl获取当前会话ID"""
    history_path = Path.home() / ".claude" / "history.jsonl"
    if not history_path.exists():
        print(f"历史文件不存在: {history_path}", file=sys.stderr)
        return None

    last_session_id = None
    try:
        with open(history_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    record = json.loads(line)
                    if 'sessionId' in record:
                        last_session_id = record['sessionId']
                except json.JSONDecodeError:
                    continue
    except Exception as e:
        print(f"读取历史文件失败: {e}", file=sys.stderr)
        return None

    return last_session_id


def get_project_dir():
    """根据当前工作目录获取projects子目录名"""
    cwd = Path.cwd()
    project_dir = str(cwd).replace('/', '-')
    return project_dir


def find_session_file(session_id, project_dir=None):
    """查找会话对应的JSONL文件"""
    if not session_id:
        return None

    if not project_dir:
        project_dir = get_project_dir()
    projects_root = Path.home() / ".claude" / "projects"

    # 检查projects目录是否存在
    if not projects_root.exists():
        if Path.home() / ".claude" / "projects-backup".exists():
            projects_root = Path.home() / ".claude" / "projects-backup"
        else:
            return None

    # 尝试直接匹配: <session_id>.jsonl
    session_file = projects_root / project_dir / f"{session_id}.jsonl"
    if session_file.exists():
        return session_file

    # 尝试匹配: agent-<short_id>.jsonl (旧格式)
    for pattern in ["*.jsonl", "agent-*.jsonl"]:
        target_dir = projects_root / project_dir
        if not target_dir.exists():
            continue
        for file_path in target_dir.glob(pattern):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    first_line = f.readline().strip()
                    if first_line:
                        data = json.loads(first_line)
                        if data.get('sessionId') == session_id:
                            return file_path
            except (json.JSONDecodeError, UnicodeDecodeError):
                continue

    # 如果找不到，尝试在所有projects目录中查找
    for pattern in ["*.jsonl", "agent-*.jsonl"]:
        for project_subdir in projects_root.iterdir():
            if not project_subdir.is_dir():
                continue
            for file_path in project_subdir.glob(pattern):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        first_line = f.readline().strip()
                        if first_line:
                            data = json.loads(first_line)
                            if data.get('sessionId') == session_id:
                                return file_path
                except (json.JSONDecodeError, UnicodeDecodeError):
                    continue

    return None


def import_session_stop_handle():
    """动态导入session_stop_handle模块"""
    import importlib.util

    # 尝试从hooks目录导入
    hooks_dir = Path(__file__).parent.parent.parent / "hooks"
    session_stop_path = hooks_dir / "session_stop_handle.py"

    if not session_stop_path.exists():
        # 尝试从项目根目录的.claude/hooks导入
        project_root = Path.cwd()
        session_stop_path = project_root / ".claude" / "hooks" / "session_stop_handle.py"

    if not session_stop_path.exists():
        raise FileNotFoundError(
            f"找不到session_stop_handle.py: {session_stop_path}")

    spec = importlib.util.spec_from_file_location("session_stop_handle",
                                                  session_stop_path)
    session_module = importlib.util.module_from_spec(spec)

    # 临时添加路径以便导入
    original_sys_path = sys.path.copy()
    sys.path.insert(0, str(session_stop_path.parent))
    try:
        spec.loader.exec_module(session_module)
        return session_module
    finally:
        sys.path = original_sys_path


def save_as_markdown(jsonl_path, operator_name=None):
    """将会话记录保存为Markdown"""
    session_module = import_session_stop_handle()

    # 生成输出路径
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # 确定算子目录
    if operator_name:
        log_dir = Path("logs") / operator_name
    else:
        # 从当前目录推断算子名
        cwd = Path.cwd()
        if cwd.parent.name == "ops" and cwd.name:
            operator_name = cwd.name
            log_dir = Path("logs") / operator_name
        else:
            log_dir = Path("logs") / "unknown"

    log_dir.mkdir(parents=True, exist_ok=True)
    output_path = log_dir / f"{jsonl_path.stem}_{timestamp}.md"

    # 调用现有转换函数
    session_module.handle(str(jsonl_path), str(output_path))
    return output_path


def main():
    """主函数：命令行入口"""
    parser = argparse.ArgumentParser(description="自动保存当前Claude Code会话记录")
    parser.add_argument("--operator", "-o", help="算子名称（可选，自动推断）")
    parser.add_argument("--debug", "-d", action="store_true", help="调试模式")
    parser.add_argument("--session-id", "-s", help="直接指定会话ID（可选，默认从history.jsonl读取）")
    parser.add_argument("--session-file", "-f", type=Path, help="直接指定会话文件路径（可选）")
    parser.add_argument("--project-dir", "-p", help="指定projects子目录名（可选，默认自动推断）")
    args = parser.parse_args()

    operator_name = args.operator

    # 获取会话文件路径（支持多种方式）
    session_file = None

    # 方式1：直接指定会话文件
    if args.session_file:
        session_file = args.session_file
        if not session_file.exists():
            print(f"错误：指定的会话文件不存在: {session_file}", file=sys.stderr)
            sys.exit(1)
        if args.debug:
            print(f"使用指定会话文件: {session_file}")

    # 方式2：使用会话ID查找
    else:
        # 获取会话ID
        session_id = args.session_id
        if not session_id:
            session_id = get_current_session_id()
            if not session_id:
                print("错误：无法获取当前会话ID", file=sys.stderr)
                sys.exit(1)

        if args.debug:
            print(f"当前会话ID: {session_id}")
            print(f"当前目录: {Path.cwd()}")
            print(f"推断算子名: {operator_name}")

        # 查找会话文件
        session_file = find_session_file(session_id, args.project_dir)
        if not session_file:
            print(f"错误：找不到会话文件 {session_id}.jsonl", file=sys.stderr)

            # 调试信息
            if args.debug:
                project_dir = args.project_dir or get_project_dir()
                projects_root = Path.home() / ".claude" / "projects"
                target_dir = projects_root / project_dir
                if target_dir.exists():
                    files = list(target_dir.glob("*.jsonl"))
                    print(f"可用文件 ({len(files)}个):")
                    for f in sorted(files,
                                    key=lambda x: x.stat().st_mtime,
                                    reverse=True)[:5]:
                        mtime = datetime.fromtimestamp(
                            f.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")
                        print(f"  - {f.name} (修改时间: {mtime})")
                else:
                    print(f"projects目录不存在: {target_dir}")

            sys.exit(1)

    if args.debug:
        print(f"找到会话文件: {session_file}")

    # 保存为Markdown
    try:
        output_path = save_as_markdown(session_file, operator_name)
        print(f"✓ 会话记录已保存到: {output_path}")
        return 0
    except Exception as e:
        print(f"错误：保存失败 - {e}", file=sys.stderr)
        if args.debug:
            import traceback
            traceback.print_exc()
        return 1


def skill_main():
    """Skill入口：支持环境变量参数"""
    try:
        # 从环境变量获取参数（如果存在）
        operator_name = os.environ.get("SAVE_SESSION_OPERATOR")
        session_id = os.environ.get("SAVE_SESSION_SESSION_ID")
        project_dir = os.environ.get("SAVE_SESSION_PROJECT_DIR")
        session_file_path = os.environ.get("SAVE_SESSION_SESSION_FILE")

        # 自动推断算子名（如果未通过环境变量指定）
        if not operator_name:
            cwd = Path.cwd()
            if cwd.parent.name == "ops" and cwd.name:
                operator_name = cwd.name

        # 获取会话文件路径（支持多种方式）
        session_file = None

        # 方式1：直接指定会话文件
        if session_file_path:
            session_file = Path(session_file_path)
            if not session_file.exists():
                return {"success": False, "message": f"指定的会话文件不存在: {session_file}"}

        # 方式2：使用会话ID查找
        else:
            # 获取会话ID（优先使用环境变量，否则自动获取）
            if not session_id:
                session_id = get_current_session_id()
                if not session_id:
                    return {"success": False, "message": "无法获取当前会话ID"}

            # 查找会话文件
            session_file = find_session_file(session_id, project_dir)
            if not session_file:
                return {"success": False, "message": f"找不到会话文件 {session_id}.jsonl"}

        # 保存为Markdown
        output_path = save_as_markdown(session_file, operator_name)

        return {
            "success": True,
            "message": f"会话记录已保存到: {output_path}",
            "output_path": str(output_path)
        }
    except Exception as e:
        return {"success": False, "message": f"保存失败: {str(e)}"}


if __name__ == "__main__":
    # 检查是否通过Skill工具调用（可能有特殊参数）
    if len(sys.argv) == 1:
        # 无参数调用，尝试作为skill执行
        result = skill_main()
        print(json.dumps(result, ensure_ascii=False))
    else:
        # 命令行调用
        sys.exit(main())
