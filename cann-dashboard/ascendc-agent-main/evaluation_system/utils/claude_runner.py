"""Claude Session 运行器模块，负责启动和管理独立的 Claude Code session。"""
import itertools
import json
import logging
import os
import subprocess
import threading
from datetime import datetime
from pathlib import Path
from typing import Optional


class AuthTokenRotator:
    """Auth Token 轮换器，支持多 Token 线程安全轮换。

    适配环境变量：ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN / ANTHROPIC_BASE_URL

    Token 来源（按优先级）：
    1. 构造参数 auth_tokens 列表
    2. 环境变量 ANTHROPIC_AUTH_TOKENS（逗号分隔多个 token）
    3. 环境变量 ANTHROPIC_AUTH_TOKEN（单个 token）
    4. 环境变量 ANTHROPIC_API_KEY（兜底，DashScope 等代理服务的 API key）

    注意：传给子进程时统一使用 ANTHROPIC_API_KEY 变量名，
    因为 claude CLI 只识别 ANTHROPIC_API_KEY 进行认证。
    """

    ENV_TOKEN_MULTI = 'ANTHROPIC_AUTH_TOKENS'
    ENV_TOKEN_SINGLE = 'ANTHROPIC_AUTH_TOKEN'
    ENV_API_KEY = 'ANTHROPIC_API_KEY'

    def __init__(self, auth_tokens: Optional[list[str]] = None):
        tokens = []
        if auth_tokens:
            tokens = [t.strip() for t in auth_tokens if t.strip()]

        if not tokens:
            multi = os.environ.get(self.ENV_TOKEN_MULTI, '')
            if multi:
                tokens = [t.strip() for t in multi.split(',') if t.strip()]

        if not tokens:
            single = os.environ.get(self.ENV_TOKEN_SINGLE, '')
            if single.strip():
                tokens = [single.strip()]

        if not tokens:
            api_key = os.environ.get(self.ENV_API_KEY, '')
            if api_key.strip():
                tokens = [api_key.strip()]

        self._tokens = tokens
        self._cycle = itertools.cycle(tokens) if tokens else None
        self._lock = threading.Lock()
        self._logger = logging.getLogger(__name__)

        if len(tokens) > 1:
            self._logger.info(f'Auth Token 轮换器初始化: {len(tokens)} 个 token')
        elif len(tokens) == 1:
            self._logger.info('Auth Token 轮换器初始化: 单 token 模式')
        else:
            self._logger.warning('Auth Token 轮换器: 未找到任何 token')

    @property
    def token_count(self) -> int:
        return len(self._tokens)

    def next_token(self) -> Optional[str]:
        """线程安全地获取下一个 token。"""
        if not self._cycle:
            return None
        with self._lock:
            return next(self._cycle)


class ClaudeRunner:
    """Claude Session 运行器类。"""

    # 常量定义
    MAX_STDOUT_LENGTH = 2000  # stdout 最大保存长度（字符数）
    MAX_STDERR_LENGTH = 500  # stderr 最大保存长度（字符数）
    DEFAULT_TIMEOUT = 600  # 默认超时时间（秒）
    JSON_EXTRACTION_MAX_RETRIES = 2  # Phase 2 JSON 提取最大重试次数
    JSON_EXTRACTION_TIMEOUT = 900  # Phase 2 超时（秒），读取报告+按schema生成JSON（15分钟）

    def __init__(self, project_root: Optional[str] = None, auth_tokens: Optional[list[str]] = None):
        """初始化 runner。

        Args:
            project_root: 项目根目录
            auth_tokens: Auth token 列表，为空则从环境变量读取
        """
        self.logger = logging.getLogger(__name__)
        if project_root is None:
            project_root = str(Path(__file__).parent.parent.parent)
        self.project_root = Path(project_root)
        self.ops_dir = self.project_root / 'ops'
        self.env_setup_script = self.project_root / 'env_setup.sh'
        self.token_rotator = AuthTokenRotator(auth_tokens)

    def run_development_session(
        self,
        operator_name: str,
        operator_config: dict,
        batch_id: str,
        options: Optional[dict] = None,
    ) -> dict:
        """启动算子开发 session。"""
        if options is None:
            options = {}
        timeout = options.get('timeout', self.DEFAULT_TIMEOUT)

        work_dir = self.ops_dir / operator_name

        # 清理上一轮的开发产物，保留预置的 scripts/ 目录
        if work_dir.exists():
            import shutil
            for item in work_dir.iterdir():
                if item.name == 'scripts':
                    continue
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()
            self.logger.info(f'已清理 {work_dir} 上一轮产物（保留 scripts/）')

        work_dir.mkdir(parents=True, exist_ok=True)

        prompt = self._build_development_prompt(operator_config)

        env = os.environ.copy()
        env['ASCEND_BATCH_ID'] = batch_id
        env['ASCEND_OPERATOR_NAME'] = operator_name

        token = self.token_rotator.next_token()
        if token:
            env['ANTHROPIC_API_KEY'] = token
            # 清除 ANTHROPIC_AUTH_TOKEN，避免 claude CLI 误用旧 token
            env.pop('ANTHROPIC_AUTH_TOKEN', None)
            self.logger.info(f'算子 {operator_name} 使用 Auth Token: ...{token[-4:]}')

        result = {
            'operator_name': operator_name,
            'batch_id': batch_id,
            'work_dir': str(work_dir),
            'started_at': datetime.now().isoformat(),
            'success': False,
            'error': None
        }

        try:
            self.logger.info(f'启动算子开发 session: {operator_name}')

            process_result = subprocess.run(['claude', '--print', prompt],
                                            cwd=str(self.project_root),
                                            env=env,
                                            timeout=timeout,
                                            capture_output=True,
                                            text=True)

            result['completed_at'] = datetime.now().isoformat()
            result['return_code'] = process_result.returncode
            result['stdout'] = process_result.stdout
            result['stderr'] = process_result.stderr

            if process_result.returncode == 0:
                result['success'] = True
                self.logger.info(f'算子 {operator_name} 开发 session 完成')
            else:
                result['error'] = f'返回码: {process_result.returncode}'
                self.logger.warning(f'算子 {operator_name} 开发 session 失败')
                self.logger.warning(f'  返回码: {process_result.returncode}')
                if process_result.stderr:
                    self.logger.warning(f'  stderr: {process_result.stderr[:500]}')
                if process_result.stdout:
                    self.logger.warning(f'  stdout (尾部500字符): {process_result.stdout[-500:]}')

        except subprocess.TimeoutExpired:
            result['error'] = f'超时（{timeout}秒）'
            self.logger.warning(f'算子 {operator_name} 开发超时')

        except Exception as e:
            result['error'] = str(e)
            self.logger.error(f'算子 {operator_name} 开发出错: {e}')

        return result

    def run_evaluation_session(
        self,
        log_file: str,
        batch_id: str,
        operator_name: str,
        timeout: int = 600,
    ) -> dict:
        """启动日志评估 session。

        Args:
            log_file: 日志文件路径
            batch_id: 批次ID
            operator_name: 算子名称（用于文件重命名）
            timeout: 超时时间（秒）
        """
        log_path = Path(log_file)
        if not log_path.is_absolute():
            log_path = self.project_root / log_path

        # 删除中间元数据文件（评估完成后不需要保留）
        # 使用原始文件名的 stem 查找 meta 文件
        meta_path = log_path.parent / f'{log_path.stem}-meta.json'
        if meta_path.exists():
            meta_path.unlink()
            self.logger.info(f'删除中间元数据文件: {meta_path.name}')

        # 使用日志文件的 stem 作为输出文件名前缀，保持一致性
        log_stem = log_path.stem

        # 计算评估报告的绝对路径，避免写入 cwd（项目根目录）
        eval_report_path = log_path.parent / f'{log_stem}-evaluation.md'

        # === Phase 1: 生成 Markdown 评估报告（不生成 JSON） ===
        prompt = f'''请分析以下算子开发日志并生成评估报告：

算子名称: {operator_name}
日志文件路径: {log_path}

## 文件命名要求 ⚠️

**重要**：输出文件命名规范：

1. **日志文件**：`{log_path}`（不要重命名）
2. **评估报告**必须保存为：`{eval_report_path}`

**注意：必须使用上述绝对路径保存评估报告。不需要生成 JSON 文件，JSON 将由后续自动化流程自动生成。只需专注于输出高质量的 Markdown 评估报告。**

请按照 evaluator agent 的要求，读取日志文件并完成完整的复杂度评估分析，确保评估报告保存到上述绝对路径。'''

        # 注意：评估阶段不传递 ASCEND_BATCH_ID，避免评估过程日志写入批次目录
        # 评估报告（*-evaluation.md）由 evaluator agent 直接写入批次目录
        env = os.environ.copy()

        token = self.token_rotator.next_token()
        if token:
            env['ANTHROPIC_API_KEY'] = token
            env.pop('ANTHROPIC_AUTH_TOKEN', None)
            self.logger.info(f'评估 {operator_name} 使用 Auth Token: ...{token[-4:]}')

        result = {
            'log_file': str(log_path),
            'batch_id': batch_id,
            'started_at': datetime.now().isoformat(),
            'success': False,
            'error': None
        }

        try:
            self.logger.info(f'[Phase 1] 启动日志评估 session: {log_path.name}')

            process_result = subprocess.run(['claude', '--print', prompt],
                                            cwd=str(self.project_root),
                                            env=env,
                                            timeout=timeout,
                                            capture_output=True,
                                            text=True)

            result['completed_at'] = datetime.now().isoformat()
            result['return_code'] = process_result.returncode
            result['stdout'] = process_result.stdout[:self.MAX_STDOUT_LENGTH]
            stderr_text = process_result.stderr[:self.MAX_STDERR_LENGTH] if process_result.stderr else None
            result['stderr'] = stderr_text

            if process_result.returncode == 0:
                result['success'] = True
                self.logger.info(f'[Phase 1] 日志评估完成: {log_path.name}')
            else:
                result['error'] = f'Phase 1 返回码: {process_result.returncode}'
                self.logger.warning(f'[Phase 1] 日志评估失败: {log_path.name}')
                return result

        except subprocess.TimeoutExpired:
            result['error'] = f'Phase 1 超时（{timeout}秒）'
            self.logger.warning(f'[Phase 1] 日志评估超时: {log_path.name}')
            return result

        except Exception as e:
            result['error'] = f'Phase 1 异常: {e}'
            self.logger.error(f'[Phase 1] 日志评估出错: {e}')
            return result

        # === Phase 1.5: 检查评估报告是否写到了正确位置 ===
        report_path = log_path.parent / f'{log_stem}-evaluation.md'
        if not report_path.exists():
            # 检查是否写到了项目根目录（常见错误路径）
            fallback_path = self.project_root / f'{log_stem}-evaluation.md'
            if fallback_path.exists():
                fallback_path.rename(report_path)
                self.logger.warning(
                    f'评估报告写入了错误位置，已自动修正: {fallback_path} -> {report_path}')
            else:
                self.logger.warning(
                    f'[Phase 2] 评估报告不存在，跳过 JSON 提取: {report_path.name}')
                result['json_extraction'] = {
                    'success': False,
                    'error': f'评估报告不存在: {report_path.name}'
                }
                return result

        # === Phase 2: 从 Markdown 报告中提取结构化 JSON ===
        json_path = log_path.parent / f'{log_stem}-evaluation.json'

        self.logger.info(f'[Phase 2] 从评估报告提取 JSON: {report_path.name}')
        json_result = self._extract_json_from_report(
            report_path=report_path,
            json_output_path=json_path,
            operator_name=operator_name,
            batch_id=batch_id,
        )
        result['json_extraction'] = json_result

        if json_result['success']:
            # 额外校验写入的 JSON 文件
            validation_issues = self._validate_evaluation_json(json_path)
            if validation_issues:
                result['json_validation_issues'] = validation_issues
                self.logger.warning(
                    f'[Phase 2] JSON 校验问题 ({log_path.name}): {len(validation_issues)} 个字段不合规')
        else:
            self.logger.warning(
                f'[Phase 2] JSON 提取失败 ({log_path.name}): {json_result.get("error")}')

        return result

    @staticmethod
    def _validate_evaluation_json(json_path: Path) -> list[str]:
        """校验评估 JSON 文件是否符合 evaluator schema。

        Returns:
            问题列表，空列表表示全部合规。
        """
        if not json_path.exists():
            return [f'JSON 文件不存在: {json_path.name}']

        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except (json.JSONDecodeError, Exception) as e:
            return [f'JSON 解析失败: {e}']

        return ClaudeRunner._validate_evaluation_json_data(data)

    @staticmethod
    def _validate_evaluation_json_data(data: dict) -> list[str]:
        """校验评估 JSON 数据（内存 dict）是否符合 evaluator schema。

        Returns:
            问题列表，空列表表示全部合规。
        """
        issues = []

        # 顶层必需字段
        required_top = [
            'evaluation_id', 'operator_name', 'development_success',
            'test_results', 'summary', 'documentation_retrieval',
            'code_examples', 'build_configuration', 'functional_testing',
            'key_findings', 'dimension_tables',
            'issues_found', 'improvement_suggestions', 'section_scores'
        ]
        for field in required_top:
            if field not in data:
                issues.append(f'缺少顶层字段: {field}')

        # summary 子字段
        summary = data.get('summary', {})
        if isinstance(summary, dict):
            for field in ['complexity_level', 'efficiency_score', 'total_time_minutes',
                          'input_tokens', 'output_tokens', 'tool_calls']:
                if field not in summary:
                    issues.append(f'summary 缺少: {field}')

        # dimension_tables 7 个维度
        dims = data.get('dimension_tables', {})
        if isinstance(dims, dict):
            for dim in ['documentation', 'examples', 'api_design', 'engineering',
                        'environment', 'learning_curve', 'standards']:
                if dim not in dims:
                    issues.append(f'dimension_tables 缺少: {dim}')

        # test_results 子字段
        tests = data.get('test_results', {})
        if isinstance(tests, dict):
            for field in ['level_0', 'pass_rate', 'passed_count', 'total_count']:
                if field not in tests:
                    issues.append(f'test_results 缺少: {field}')

        # test_results 值域校验
        if isinstance(tests, dict):
            tc = tests.get('total_count')
            pc = tests.get('passed_count')
            pr = tests.get('pass_rate')
            if isinstance(tc, (int, float)) and not (0 <= tc <= 4):
                issues.append(f'test_results.total_count 超出范围 [0,4]: {tc}')
            if isinstance(pc, (int, float)) and not (0 <= pc <= 4):
                issues.append(f'test_results.passed_count 超出范围 [0,4]: {pc}')
            if isinstance(pr, (int, float)) and not (0 <= pr <= 1):
                issues.append(f'test_results.pass_rate 超出范围 [0,1]: {pr}')
            # 交叉校验：passed_count <= total_count
            if isinstance(tc, (int, float)) and isinstance(pc, (int, float)) and pc > tc:
                issues.append(f'test_results.passed_count ({pc}) > total_count ({tc})')
            # 交叉校验：pass_rate 与 count 一致性
            if (isinstance(tc, (int, float)) and isinstance(pc, (int, float))
                    and isinstance(pr, (int, float)) and tc > 0):
                expected_rate = round(pc / tc, 4)
                if abs(pr - expected_rate) > 0.01:
                    issues.append(
                        f'test_results.pass_rate ({pr}) 与 passed_count/total_count ({expected_rate}) 不一致')

        # summary 值域校验
        if isinstance(summary, dict):
            es = summary.get('efficiency_score')
            if isinstance(es, (int, float)) and not (1 <= es <= 10):
                issues.append(f'summary.efficiency_score 超出范围 [1,10]: {es}')
            for f in ['total_time_minutes', 'input_tokens', 'output_tokens',
                       'cached_tokens', 'api_calls', 'tool_calls']:
                v = summary.get(f)
                if isinstance(v, (int, float)) and v < 0:
                    issues.append(f'summary.{f} 为负数: {v}')
            cost = summary.get('cost_usd')
            if isinstance(cost, (int, float)) and cost < 0:
                issues.append(f'summary.cost_usd 为负数: {cost}')

        # documentation_retrieval 值域和交叉校验
        dr = data.get('documentation_retrieval', {})
        if isinstance(dr, dict):
            er = dr.get('effectiveness_rate')
            if isinstance(er, (int, float)) and not (0 <= er <= 1):
                issues.append(f'documentation_retrieval.effectiveness_rate 超出范围 [0,1]: {er}')
            ts = dr.get('total_searches')
            es_dr = dr.get('effective_searches')
            if isinstance(ts, (int, float)) and ts < 0:
                issues.append(f'documentation_retrieval.total_searches 为负数: {ts}')
            if isinstance(es_dr, (int, float)) and es_dr < 0:
                issues.append(f'documentation_retrieval.effective_searches 为负数: {es_dr}')
            if (isinstance(ts, (int, float)) and isinstance(es_dr, (int, float))
                    and es_dr > ts):
                issues.append(
                    f'documentation_retrieval.effective_searches ({es_dr}) > total_searches ({ts})')

        # code_examples 值域校验
        ce = data.get('code_examples', {})
        if isinstance(ce, dict):
            tmr = ce.get('template_modification_rate')
            if isinstance(tmr, (int, float)) and not (0 <= tmr <= 1):
                issues.append(f'code_examples.template_modification_rate 超出范围 [0,1]: {tmr}')

        # dimension_tables 子评分 [1, 10]
        if isinstance(dims, dict):
            for dim_name, dim_obj in dims.items():
                if isinstance(dim_obj, dict):
                    for k, v in dim_obj.items():
                        if isinstance(v, (int, float)) and not (1 <= v <= 10):
                            issues.append(f'dimension_tables.{dim_name}.{k} 超出范围 [1,10]: {v}')

        # key_findings 非空数组
        kf = data.get('key_findings', [])
        if not isinstance(kf, list) or len(kf) == 0:
            issues.append('key_findings 为空或非数组')

        # issues_found 非空数组校验
        ifl = data.get('issues_found', [])
        if not isinstance(ifl, list):
            issues.append('issues_found 不是数组')

        # improvement_suggestions 非空数组校验
        isg = data.get('improvement_suggestions', [])
        if not isinstance(isg, list):
            issues.append('improvement_suggestions 不是数组')

        # section_scores 校验
        ss = data.get('section_scores', {})
        if not isinstance(ss, dict):
            issues.append('section_scores 不是对象')
        else:
            for field in ['perception_learning', 'design_implementation',
                          'compilation', 'functional_testing', 'performance_tuning']:
                if field not in ss:
                    issues.append(f'section_scores 缺少: {field}')
            for k, v in ss.items():
                if isinstance(v, (int, float)) and not (1 <= v <= 10):
                    issues.append(f'section_scores.{k} 超出范围 [1,10]: {v}')

        return issues

    @staticmethod
    def _postprocess_evaluation_json(data: dict) -> dict:
        """后处理：clamp 超范围值、修正不一致数据。就地修改并返回 data。"""
        # --- test_results ---
        tr = data.get('test_results', {})
        if isinstance(tr, dict):
            if isinstance(tr.get('total_count'), (int, float)):
                tr['total_count'] = max(0, min(4, int(tr['total_count'])))
            if isinstance(tr.get('passed_count'), (int, float)):
                tr['passed_count'] = max(0, min(4, int(tr['passed_count'])))
            # passed_count 不能超过 total_count
            tc = tr.get('total_count', 4)
            pc = tr.get('passed_count', 0)
            if isinstance(tc, int) and isinstance(pc, int) and pc > tc:
                tr['passed_count'] = tc
            # 重算 pass_rate（权威来源是 count）
            tc = tr.get('total_count', 0)
            pc = tr.get('passed_count', 0)
            if isinstance(tc, int) and isinstance(pc, int):
                if tc > 0:
                    tr['pass_rate'] = round(pc / tc, 4)
                else:
                    tr['pass_rate'] = 0.0

        # --- summary ---
        s = data.get('summary', {})
        if isinstance(s, dict):
            if isinstance(s.get('efficiency_score'), (int, float)):
                s['efficiency_score'] = max(1, min(10, int(s['efficiency_score'])))
            for f in ['total_time_minutes', 'input_tokens', 'output_tokens',
                       'cached_tokens', 'api_calls', 'tool_calls']:
                if isinstance(s.get(f), (int, float)):
                    s[f] = max(0, int(s[f]))
            if isinstance(s.get('cost_usd'), (int, float)):
                s['cost_usd'] = max(0.0, float(s['cost_usd']))

        # --- documentation_retrieval ---
        dr = data.get('documentation_retrieval', {})
        if isinstance(dr, dict):
            for f in ['total_searches', 'effective_searches']:
                if isinstance(dr.get(f), (int, float)):
                    dr[f] = max(0, int(dr[f]))
            ts = dr.get('total_searches', 0)
            es = dr.get('effective_searches', 0)
            if isinstance(ts, int) and isinstance(es, int) and es > ts:
                dr['effective_searches'] = ts
            # 重算 effectiveness_rate
            ts = dr.get('total_searches', 0)
            es = dr.get('effective_searches', 0)
            if isinstance(ts, int) and isinstance(es, int):
                if ts > 0:
                    dr['effectiveness_rate'] = round(es / ts, 4)
                else:
                    dr['effectiveness_rate'] = 0.0

        # --- code_examples ---
        ce = data.get('code_examples', {})
        if isinstance(ce, dict):
            if isinstance(ce.get('template_modification_rate'), (int, float)):
                ce['template_modification_rate'] = max(0.0, min(1.0, float(ce['template_modification_rate'])))
            if isinstance(ce.get('examples_count'), (int, float)):
                ce['examples_count'] = max(0, int(ce['examples_count']))

        # --- build_configuration / functional_testing ---
        for section in ['build_configuration', 'functional_testing']:
            sec = data.get(section, {})
            if isinstance(sec, dict):
                for k, v in sec.items():
                    if isinstance(v, int):
                        sec[k] = max(0, v)
                    elif isinstance(v, float):
                        sec[k] = max(0.0, v)

        # --- dimension_tables: 所有子评分 clamp [1, 10] ---
        dims = data.get('dimension_tables', {})
        if isinstance(dims, dict):
            for dim_name, dim_obj in dims.items():
                if isinstance(dim_obj, dict):
                    for k, v in dim_obj.items():
                        if isinstance(v, (int, float)):
                            dim_obj[k] = max(1, min(10, int(v)))

        # --- section_scores: clamp [1, 10] ---
        ss = data.get('section_scores', {})
        if isinstance(ss, dict):
            for k, v in ss.items():
                if isinstance(v, (int, float)):
                    ss[k] = max(1.0, min(10.0, round(float(v), 1)))

        return data

    @staticmethod
    def _build_evaluation_json_schema() -> dict:
        """构建评估 JSON 的完整 JSON Schema，用于 claude --json-schema 参数。"""
        return {
            'type': 'object',
            'required': [
                'evaluation_id', 'operator_name', 'batch_id',
                'development_success', 'test_results', 'summary',
                'documentation_retrieval', 'code_examples',
                'build_configuration', 'functional_testing',
                'key_findings', 'dimension_tables',
                'issues_found', 'improvement_suggestions',
                'section_scores', 'evaluated_at', 'report_file'
            ],
            'additionalProperties': False,
            'properties': {
                'evaluation_id': {'type': 'string'},
                'operator_name': {'type': 'string'},
                'batch_id': {'type': 'string'},
                'development_success': {'type': 'boolean'},
                'test_results': {
                    'type': 'object',
                    'required': ['level_0', 'pass_rate', 'passed_count', 'total_count'],
                    'properties': {
                        'level_0': {
                            'type': 'object',
                            'required': ['status', 'description'],
                            'properties': {
                                'status': {'type': 'string', 'enum': ['passed', 'failed', 'skipped', 'unknown']},
                                'description': {'type': 'string'}
                            },
                            'additionalProperties': False
                        },
                        'level_1': {
                            'type': 'object',
                            'required': ['status', 'description'],
                            'properties': {
                                'status': {'type': 'string', 'enum': ['passed', 'failed', 'skipped', 'unknown']},
                                'description': {'type': 'string'}
                            },
                            'additionalProperties': False
                        },
                        'level_2': {
                            'type': 'object',
                            'required': ['status', 'description'],
                            'properties': {
                                'status': {'type': 'string', 'enum': ['passed', 'failed', 'skipped', 'unknown']},
                                'description': {'type': 'string'}
                            },
                            'additionalProperties': False
                        },
                        'level_3': {
                            'type': 'object',
                            'required': ['status', 'description'],
                            'properties': {
                                'status': {'type': 'string', 'enum': ['passed', 'failed', 'skipped', 'unknown']},
                                'description': {'type': 'string'}
                            },
                            'additionalProperties': False
                        },
                        'pass_rate': {'type': 'number', 'minimum': 0, 'maximum': 1},
                        'passed_count': {'type': 'integer', 'minimum': 0, 'maximum': 4},
                        'total_count': {'type': 'integer', 'minimum': 0, 'maximum': 4}
                    },
                    'additionalProperties': False
                },
                'summary': {
                    'type': 'object',
                    'required': [
                        'complexity_level', 'efficiency_score', 'total_time_minutes',
                        'input_tokens', 'output_tokens', 'cached_tokens',
                        'api_calls', 'cost_usd', 'tool_calls'
                    ],
                    'properties': {
                        'complexity_level': {'type': 'string', 'enum': ['simple', 'medium', 'complex']},
                        'efficiency_score': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                        'total_time_minutes': {'type': 'integer', 'minimum': 0},
                        'input_tokens': {'type': 'integer', 'minimum': 0},
                        'output_tokens': {'type': 'integer', 'minimum': 0},
                        'cached_tokens': {'type': 'integer', 'minimum': 0},
                        'api_calls': {'type': 'integer', 'minimum': 0},
                        'cost_usd': {'type': 'number', 'minimum': 0},
                        'tool_calls': {'type': 'integer', 'minimum': 0}
                    },
                    'additionalProperties': False
                },
                'documentation_retrieval': {
                    'type': 'object',
                    'required': ['total_searches', 'effective_searches', 'effectiveness_rate'],
                    'properties': {
                        'total_searches': {'type': 'integer', 'minimum': 0},
                        'effective_searches': {'type': 'integer', 'minimum': 0},
                        'effectiveness_rate': {'type': 'number', 'minimum': 0, 'maximum': 1}
                    },
                    'additionalProperties': False
                },
                'code_examples': {
                    'type': 'object',
                    'required': ['template_modification_rate', 'referenced_examples', 'examples_count'],
                    'properties': {
                        'template_modification_rate': {'type': 'number', 'minimum': 0, 'maximum': 1},
                        'referenced_examples': {
                            'type': 'array',
                            'items': {'type': 'string'}
                        },
                        'examples_count': {'type': 'integer', 'minimum': 0}
                    },
                    'additionalProperties': False
                },
                'build_configuration': {
                    'type': 'object',
                    'required': [
                        'config_lines', 'macros_to_understand',
                        'functions_to_understand', 'project_creation_time_seconds'
                    ],
                    'properties': {
                        'config_lines': {'type': 'integer', 'minimum': 0},
                        'macros_to_understand': {'type': 'integer', 'minimum': 0},
                        'functions_to_understand': {'type': 'integer', 'minimum': 0},
                        'project_creation_time_seconds': {'type': 'integer', 'minimum': 0}
                    },
                    'additionalProperties': False
                },
                'functional_testing': {
                    'type': 'object',
                    'required': [
                        'compile_run_count', 'dev_test_cycles',
                        'avg_test_duration_seconds', 'performance_optimization_iterations'
                    ],
                    'properties': {
                        'compile_run_count': {'type': 'integer', 'minimum': 0},
                        'dev_test_cycles': {'type': 'integer', 'minimum': 0},
                        'avg_test_duration_seconds': {'type': 'number', 'minimum': 0},
                        'performance_optimization_iterations': {'type': 'integer', 'minimum': 0}
                    },
                    'additionalProperties': False
                },
                'key_findings': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'required': ['rank', 'finding', 'category'],
                        'properties': {
                            'rank': {'type': 'integer', 'minimum': 1},
                            'finding': {'type': 'string'},
                            'category': {
                                'type': 'string',
                                'enum': ['documentation', 'api', 'example', 'environment', 'toolchain', 'other']
                            }
                        },
                        'additionalProperties': False
                    }
                },
                'dimension_tables': {
                    'type': 'object',
                    'required': [
                        'documentation', 'examples', 'api_design',
                        'engineering', 'environment', 'learning_curve', 'standards'
                    ],
                    'properties': {
                        'documentation': {
                            'type': 'object',
                            'required': ['discoverability', 'completeness', 'accuracy', 'understandability'],
                            'properties': {
                                'discoverability': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'completeness': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'accuracy': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'understandability': {'type': 'integer', 'minimum': 1, 'maximum': 10}
                            },
                            'additionalProperties': False
                        },
                        'examples': {
                            'type': 'object',
                            'required': ['coverage', 'portability', 'quality', 'organization'],
                            'properties': {
                                'coverage': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'portability': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'quality': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'organization': {'type': 'integer', 'minimum': 1, 'maximum': 10}
                            },
                            'additionalProperties': False
                        },
                        'api_design': {
                            'type': 'object',
                            'required': ['naming_semantics', 'consistency', 'abstraction', 'type_system'],
                            'properties': {
                                'naming_semantics': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'consistency': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'abstraction': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'type_system': {'type': 'integer', 'minimum': 1, 'maximum': 10}
                            },
                            'additionalProperties': False
                        },
                        'engineering': {
                            'type': 'object',
                            'required': ['template', 'build_config', 'directory_structure', 'build_tools'],
                            'properties': {
                                'template': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'build_config': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'directory_structure': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'build_tools': {'type': 'integer', 'minimum': 1, 'maximum': 10}
                            },
                            'additionalProperties': False
                        },
                        'environment': {
                            'type': 'object',
                            'required': ['setup', 'dev_cycle', 'error_diagnosis'],
                            'properties': {
                                'setup': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'dev_cycle': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'error_diagnosis': {'type': 'integer', 'minimum': 1, 'maximum': 10}
                            },
                            'additionalProperties': False
                        },
                        'learning_curve': {
                            'type': 'object',
                            'required': ['concept_complexity', 'mental_model', 'best_practices'],
                            'properties': {
                                'concept_complexity': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'mental_model': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'best_practices': {'type': 'integer', 'minimum': 1, 'maximum': 10}
                            },
                            'additionalProperties': False
                        },
                        'standards': {
                            'type': 'object',
                            'required': ['clarity', 'consistency', 'rationality'],
                            'properties': {
                                'clarity': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'consistency': {'type': 'integer', 'minimum': 1, 'maximum': 10},
                                'rationality': {'type': 'integer', 'minimum': 1, 'maximum': 10}
                            },
                            'additionalProperties': False
                        }
                    },
                    'additionalProperties': False
                },
                'section_scores': {
                    'type': 'object',
                    'required': [
                        'perception_learning', 'design_implementation',
                        'compilation', 'functional_testing', 'performance_tuning'
                    ],
                    'properties': {
                        'perception_learning': {'type': 'number', 'minimum': 1, 'maximum': 10},
                        'design_implementation': {'type': 'number', 'minimum': 1, 'maximum': 10},
                        'compilation': {'type': 'number', 'minimum': 1, 'maximum': 10},
                        'functional_testing': {'type': 'number', 'minimum': 1, 'maximum': 10},
                        'performance_tuning': {'type': 'number', 'minimum': 1, 'maximum': 10}
                    },
                    'additionalProperties': False
                },
                'issues_found': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'required': ['description', 'root_cause', 'category', 'severity'],
                        'properties': {
                            'description': {'type': 'string'},
                            'root_cause': {'type': 'string'},
                            'category': {
                                'type': 'string',
                                'enum': ['compiler', 'alignment', 'api', 'documentation', 'toolchain', 'other']
                            },
                            'severity': {
                                'type': 'string',
                                'enum': ['critical', 'major', 'minor']
                            }
                        },
                        'additionalProperties': False
                    }
                },
                'improvement_suggestions': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'required': ['suggestion', 'priority', 'scope', 'category'],
                        'properties': {
                            'suggestion': {'type': 'string'},
                            'priority': {
                                'type': 'string',
                                'enum': ['P0', 'P1', 'P2', 'P3']
                            },
                            'scope': {'type': 'string'},
                            'category': {
                                'type': 'string',
                                'enum': ['documentation', 'example', 'api', 'toolchain', 'framework', 'other']
                            }
                        },
                        'additionalProperties': False
                    }
                },
                'evaluated_at': {'type': 'string'},
                'report_file': {'type': 'string'}
            }
        }

    @staticmethod
    def _parse_claude_json_output(stdout: str) -> dict:
        """解析 claude --output-format json --json-schema 的输出。

        claude 输出 envelope 结构：
        {"type": "result", "result": "文本摘要", "structured_output": {...}}
        数据在 structured_output 字段中。

        Returns:
            解析后的 JSON 数据 dict。
        Raises:
            ValueError: 解析失败或无法提取数据。
        """
        try:
            envelope = json.loads(stdout)
        except json.JSONDecodeError as e:
            raise ValueError(f'claude 输出不是有效 JSON: {e}')

        if isinstance(envelope, dict) and 'structured_output' in envelope:
            data = envelope['structured_output']
            if isinstance(data, dict):
                return data
            raise ValueError(f'structured_output 不是 dict: {type(data)}')

        # 兜底：尝试从 result 字段解析 JSON 字符串
        if isinstance(envelope, dict) and 'result' in envelope:
            try:
                data = json.loads(envelope['result'])
                if isinstance(data, dict):
                    return data
            except (json.JSONDecodeError, TypeError):
                pass

        raise ValueError('无法从 claude 输出中提取 JSON 数据')

    def _extract_json_from_report(
        self,
        report_path: Path,
        json_output_path: Path,
        operator_name: str,
        batch_id: str,
    ) -> dict:
        """Phase 2：从评估报告中提取结构化 JSON 数据。

        读取 evaluation.md 报告，使用 claude --json-schema 生成合规 JSON。

        Args:
            report_path: 评估报告 .md 文件路径
            json_output_path: JSON 输出文件路径
            operator_name: 算子名称
            batch_id: 批次 ID

        Returns:
            {'success': bool, 'error': str|None, 'issues': list[str]}
        """
        result = {'success': False, 'error': None, 'issues': []}

        if not report_path.exists():
            result['error'] = f'评估报告不存在: {report_path.name}'
            return result

        schema = self._build_evaluation_json_schema()
        schema_str = json.dumps(schema, ensure_ascii=False)

        prompt = (
            f'请仔细阅读以下评估报告文件，从中提取所有结构化数据并按 JSON schema 输出。\n\n'
            f'评估报告路径: {report_path}\n'
            f'算子名称: {operator_name}\n'
            f'批次 ID: {batch_id}\n'
            f'evaluation_id: {report_path.stem.replace("-evaluation", "")}\n'
            f'report_file: {report_path.name}\n\n'
            f'要求：\n'
            f'1. 从报告的"执行摘要"部分提取 complexity_level、efficiency_score、total_time_minutes\n'
            f'2. 从报告的"Token 消耗与效率分析"或相关部分提取 token 数据\n'
            f'3. 从报告的各维度评估表格提取 dimension_tables 评分\n'
            f'4. 从报告的测试结果部分提取 test_results\n'
            f'5. 从报告的"关键发现"部分提取 key_findings\n'
            f'6. 从报告的文档检索分析部分提取 documentation_retrieval 数据\n'
            f'7. 从报告的示例分析部分提取 code_examples 数据\n'
            f'8. 从报告的构建分析部分提取 build_configuration 数据\n'
            f'9. 从报告的功能测试分析部分提取 functional_testing 数据\n'
            f'10. 从报告的"主要效率瓶颈"、"详细的问题-原因-建议映射表"（通常在附录B）等部分提取 issues_found，每条包含 description（问题描述）、root_cause（根因分析）、category（分类：compiler/alignment/api/documentation/toolchain/other）、severity（严重度：critical/major/minor）\n'
            f'11. 从报告各章节的"改进建议"和"改进优先级矩阵"部分提取 improvement_suggestions，每条包含 suggestion（建议内容）、priority（优先级：P0/P1/P2/P3）、scope（影响范围）、category（分类：documentation/example/api/toolchain/framework/other）\n'
            f'12. evaluated_at 使用当前时间的 ISO 格式\n'
            f'13. test_results 中 total_count 和 passed_count 最大为 4（只有 level_0~level_3 共 4 个测试级别）\n'
            f'14. pass_rate = passed_count / total_count，范围 [0, 1]\n'
            f'15. 比率字段(effectiveness_rate, template_modification_rate)必须在 0-1 之间\n'
            f'16. 评分字段(efficiency_score, dimension_tables各项)必须在 1-10 之间（整数）\n'
            f'17. effective_searches 不能超过 total_searches，passed_count 不能超过 total_count\n'
            f'18. 如果报告中某些数据无法确定，请根据上下文合理推断，但必须遵守上述范围约束\n'
            f'19. 从报告各领域的"领域总分"行中提取 section_scores 对象，包含 5 个字段：\n'
            f'    - perception_learning: 感知学习领域总分(1-10)\n'
            f'    - design_implementation: 算子设计与实现领域总分(1-10)\n'
            f'    - compilation: 算子编译领域总分(1-10)\n'
            f'    - functional_testing: 功能调测领域总分(1-10)\n'
            f'    - performance_tuning: 性能调优领域总分(1-10)\n'
            f'    各领域总分计算规则：\n'
            f'    - 感知学习 = (文档完整性 + 文档准确性 + 文档易理解性 + 检索有效率映射分) / 4\n'
            f'      检索有效率映射: <40%→1-2, 40-60%→3-4, 60-80%→5-6, 80-90%→7-8, 90-100%→9-10\n'
            f'    - 算子设计与实现 = (目录结构 + API数据类型 + API命名 + 模板修改率映射分) / 4\n'
            f'      模板修改率映射: <5%→9-10, 5-20%→7-8, 20-50%→5-6, 50-80%→3-4, >80%→1-2\n'
            f'    - 算子编译 = (工程易创建 + 编译运行次数映射分 + 配置行数映射分) / 3\n'
            f'      编译运行次数映射: 1次→9-10, 2次→7-8, 3次→5-6, 4次→3-4, >4次→1-2\n'
            f'      配置行数映射: 20-40行→9-10, 40-70行→7-8, 70-90行→5-6, 90-130行→3-4, >130行→1-2\n'
            f'    - 功能调测 = 开发测试循环次数映射分（0次→9-10, 1次→7-8, 2次→5-6, 3次→3-4, >3次→1-2）\n'
            f'    - 性能调优 = 性能调优迭代次数映射分（0次→9-10, 1次→7-8, 2次→5-6, 3次→3-4, >3次→1-2）'
        )

        env = os.environ.copy()
        token = self.token_rotator.next_token()
        if token:
            env['ANTHROPIC_API_KEY'] = token
            env.pop('ANTHROPIC_AUTH_TOKEN', None)

        for attempt in range(self.JSON_EXTRACTION_MAX_RETRIES + 1):
            try:
                self.logger.info(
                    f'Phase 2 JSON 提取 (尝试 {attempt + 1}/{self.JSON_EXTRACTION_MAX_RETRIES + 1}): '
                    f'{report_path.name}')

                proc = subprocess.run(
                    [
                        'claude', '--print',
                        '--output-format', 'json',
                        '--json-schema', schema_str,
                        '--no-session-persistence',
                        prompt,
                    ],
                    cwd=str(self.project_root),
                    env=env,
                    timeout=self.JSON_EXTRACTION_TIMEOUT,
                    capture_output=True,
                    text=True,
                )

                if proc.returncode != 0:
                    err_msg = f'claude 返回码 {proc.returncode}'
                    if proc.stderr:
                        err_msg += f': {proc.stderr[:200]}'
                    self.logger.warning(f'Phase 2 失败: {err_msg}')
                    result['error'] = err_msg
                    continue

                data = self._parse_claude_json_output(proc.stdout)

                # 校验必需字段
                issues = self._validate_evaluation_json_data(data)
                if issues:
                    self.logger.warning(
                        f'Phase 2 JSON 校验问题 (尝试 {attempt + 1}): {issues}')
                    result['issues'] = issues
                    # 有问题但数据基本可用（非致命），仍写入
                    if any('缺少顶层字段' in i for i in issues):
                        result['error'] = f'JSON 校验失败: {len(issues)} 个问题'
                        continue

                # 后处理：clamp 超范围值、修正不一致数据
                data = self._postprocess_evaluation_json(data)

                # 写入 JSON 文件
                with open(json_output_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                result['success'] = True
                result['error'] = None
                self.logger.info(f'Phase 2 JSON 生成成功: {json_output_path.name}')
                return result

            except subprocess.TimeoutExpired:
                result['error'] = f'Phase 2 超时（{self.JSON_EXTRACTION_TIMEOUT}秒）'
                self.logger.warning(f'Phase 2 超时: {report_path.name}')

            except ValueError as e:
                result['error'] = f'Phase 2 解析失败: {e}'
                self.logger.warning(f'Phase 2 解析失败: {e}')

            except Exception as e:
                result['error'] = f'Phase 2 异常: {e}'
                self.logger.error(f'Phase 2 异常: {e}')

        return result

    def _build_development_prompt(self, config: dict) -> str:
        """构建算子开发 prompt。"""
        name = config.get('name', '')
        # 修复：formula 在顶层，不是在 spec 下
        formula = config.get('formula', '')
        difficulty = config.get('difficulty', '')
        tech_type = config.get('tech_type', '')
        api_hints = config.get('api_hints', [])
        note = config.get('note', '')

        # 构建提示信息
        hints_section = f'\n## API 提示\n参考 API: {", ".join(api_hints)}' if api_hints else ''
        note_section = f'\n## 注意事项\n{note}' if note else ''
        difficulty_section = f'\n## 难度等级\n{difficulty}' if difficulty else ''

        # 检测预置测试脚本
        scripts_dir = self.ops_dir / name / 'scripts'
        has_preset = (scripts_dir / 'gen_data.py').is_file() and (scripts_dir / 'verify_result.py').is_file()

        if has_preset:
            test_section = f'''
## 测试脚本（重要）⭐⭐⭐
**已存在人工维护的测试脚本**，位于 `ops/{name}/scripts/`：
- `gen_data.py` - 测试数据生成
- `verify_result.py` - 精度验证

**强制要求**：
1. **禁止修改、覆盖或重新生成** `ops/{name}/scripts/` 下的任何文件
2. **直接使用现有脚本**进行测试验证
3. 先阅读这两个脚本了解其参数格式和调用方式，然后按其接口执行测试
'''
        else:
            test_section = f'''
## 测试脚本
该算子没有预置测试脚本，需要自行生成 `ops/{name}/scripts/gen_data.py` 和 `ops/{name}/scripts/verify_result.py`。
'''

        prompt = f'''请开发以下算子：

## 算子信息
- 名称: {name}
- 公式: {formula}
{difficulty_section}
{hints_section}
{note_section}
{test_section}

## 开发要求
1. **根据算子实际情况来调整，使用底层 API**
2. **目的**：评估通过其他底层 API 组合实现算子的真实开发难度
3. 使用以下 skill: ascendc-kernel-develop-workflow、ascendc-docker、ascendc-debugging、ascend-complex-operator-guide、ascendc-planning
'''
        return prompt

    @staticmethod
    def _format_tensor_list(tensors: list[dict]) -> str:
        """格式化张量列表。"""
        if not tensors:
            return '  无'

        lines = []
        for t in tensors:
            name = t.get('name', 'unknown')
            dtype = t.get('dtype', [])
            dtype_str = ', '.join(dtype) if isinstance(dtype, list) else str(dtype)
            lines.append(f'  - {name}: {dtype_str}')

        return '\n'.join(lines)
