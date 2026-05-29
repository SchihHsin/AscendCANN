"""Ascend C 算子批量开发主编排器，负责协调整个批量开发和评估流程。"""
import sys
from pathlib import Path

# 确保项目根目录在 Python 路径中
_project_root = Path(__file__).parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

import json
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path
from typing import Optional

from evaluation_system.utils.claude_runner import ClaudeRunner
from evaluation_system.utils.config_loader import ConfigLoader, HARDWARE_CATEGORIES
from evaluation_system.utils.obs_uploader import OBSUploader, BatchUploadResult

# 常量定义
DEFAULT_TIMEOUT_SECONDS = 1800  # 单个算子开发超时时间（30分钟）
DEFAULT_MAX_WORKERS = 32  # 默认最大并行评估数
DEFAULT_EVALUATION_TIMEOUT = 3600  # 默认评估超时时间（1小时）
DATE_FORMAT = '%Y%m%d_%H%M%S'  # 批次ID日期格式
TIMESTAMP_FORMAT = '%Y-%m-%dT%H:%M:%S'  # ISO时间戳格式
INDENT = 2  # JSON缩进空格数


def _setup_logging() -> None:
    """配置日志系统，确保日志输出到控制台。"""
    logger = logging.getLogger('evaluation_system')
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)


_setup_logging()
logger = logging.getLogger('evaluation_system')


class OperatorOrchestrator:
    """算子批量开发编排器类。"""

    def __init__(self, project_root: Optional[str] = None, config_dir: Optional[str] = None):
        """初始化编排器。"""
        if project_root is None:
            project_root = Path(__file__).parent.parent

        self.project_root = Path(project_root)
        self.config_loader = ConfigLoader(config_dir)
        self.claude_runner = ClaudeRunner(str(self.project_root))
        self.logs_dir = self.project_root / 'logs'
        self.current_batch_id: Optional[str] = None
        self.obs_uploader: Optional[OBSUploader] = None

    def create_batch_id(self) -> str:
        """创建新的批次ID。"""
        return datetime.now().strftime(DATE_FORMAT)

    def create_batch_directory(self, batch_id: str) -> Path:
        """创建批次目录。"""
        batch_dir = self.logs_dir / f'batch_{batch_id}'
        batch_dir.mkdir(parents=True, exist_ok=True)
        return batch_dir

    def _save_json(self, file_path: Path, data: dict) -> None:
        """保存JSON数据到文件。"""
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=INDENT, ensure_ascii=False)

    def _load_json(self, file_path: Path) -> dict:
        """从文件加载JSON数据。"""
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def save_batch_metadata(self, batch_id: str, metadata: dict) -> None:
        """保存批次元数据。"""
        batch_dir = self.logs_dir / f'batch_{batch_id}'
        meta_file = batch_dir / 'meta.json'
        self._save_json(meta_file, metadata)

    def run_development_batch(self,
                              operators: Optional[list[dict]] = None,
                              difficulty: Optional[str] = None,
                              category: Optional[str] = None,
                              limit: Optional[int] = None) -> dict:
        """批量开发算子（串行模式）。"""
        self.current_batch_id = self.create_batch_id()
        batch_dir = self.create_batch_directory(self.current_batch_id)

        logger.info(f'开始批量开发算子，批次ID: {self.current_batch_id}，'
                    f'批次目录: {batch_dir}')

        if operators is None:
            operators = self.config_loader.get_operator_list(difficulty=difficulty, category=category, limit=limit)

        if not operators:
            logger.info('没有找到需要开发的算子')
            return {'batch_id': self.current_batch_id, 'count': 0}

        logger.info(f'计划开发 {len(operators)} 个算子')

        batch_metadata = {
            'batch_id': self.current_batch_id,
            'created_at': datetime.now().strftime(TIMESTAMP_FORMAT),
            'total_operators': len(operators),
            'status': 'in_progress'
        }
        self.save_batch_metadata(self.current_batch_id, batch_metadata)

        results = []
        for idx, op_config in enumerate(operators, 1):
            op_name = op_config.get('name', 'Unknown')
            op_id = op_config.get('id', 'Unknown')

            logger.info(f'[{idx}/{len(operators)}] 开发算子: {op_id} {op_name}')

            result = self.develop_single_operator(op_config)
            results.append(result)

            success_count = sum(1 for r in results if r.get('success'))
            logger.info(f'进度: {success_count}/{len(results)} 成功')

        logger.info('组织日志到批次目录...')
        organized_logs = self._organize_batch_logs(batch_id=self.current_batch_id, operator_configs=operators)
        logger.info(f'已组织 {len(organized_logs)} 个日志文件')

        batch_metadata['status'] = 'completed'
        batch_metadata['completed_at'] = datetime.now().strftime(TIMESTAMP_FORMAT)
        batch_metadata['success_count'] = sum(1 for r in results if r.get('success'))
        self.save_batch_metadata(self.current_batch_id, batch_metadata)

        summary = {
            'batch_id': self.current_batch_id,
            'total': len(operators),
            'success': batch_metadata['success_count'],
            'failed': len(operators) - batch_metadata['success_count'],
            'results': results
        }

        logger.info(f'批量开发完成，总计: {summary["total"]}, '
                    f'成功: {summary["success"]}, 失败: {summary["failed"]}')

        return summary

    def develop_single_operator(self, operator_config: dict) -> dict:
        """开发单个算子（独立Claude session）。"""
        operator_name = operator_config.get('name', 'Unknown')
        operator_id = operator_config.get('id', 'Unknown')

        result = self.claude_runner.run_development_session(operator_name=operator_name,
                                                            operator_config=operator_config,
                                                            batch_id=self.current_batch_id,
                                                            options={'timeout': DEFAULT_TIMEOUT_SECONDS})

        result['operator_id'] = operator_id
        result['operator_name'] = operator_name
        result['difficulty'] = operator_config.get('difficulty')
        result['category'] = operator_config.get('category')

        return result

    def run_batch_evaluation(self,
                             batch: str,
                             hardware: Optional[str] = None,
                             limit: Optional[int] = None,
                             skip_evaluation: bool = False,
                             max_workers: Optional[int] = None) -> dict:
        """按评估批次运行完整流程。

        Args:
            batch: 批次ID，如 'day_1', 'day_2'
            hardware: 可选的硬件分类筛选，如 'Vector', 'Cube'
            limit: 限制开发的算子数量
            skip_evaluation: 是否跳过评估阶段
            max_workers: 并行评估的线程数

        Returns:
            流程执行结果
        """
        logger.info(f'按批次运行评估: {batch}')
        if hardware:
            logger.info(f'硬件分类筛选: {hardware}')

        # 获取批次统计信息
        try:
            stats = self.config_loader.get_batch_statistics(batch)
            logger.info(f'批次统计: 总数={stats["total_count"]}, '
                        f'难度分布={stats["by_difficulty"]}, '
                        f'硬件分布={stats["by_hardware"]}')
        except ValueError as e:
            logger.error(f'批次不存在: {batch}')
            return {'batch': batch, 'error': str(e), 'success': False}

        # 获取算子列表
        if hardware:
            operators = self.config_loader.get_operators_by_batch_and_hardware(batch, hardware)
        else:
            operators = self.config_loader.get_operators_by_batch(batch)

        if not operators:
            logger.info(f'批次 {batch} 中没有找到算子')
            return {'batch': batch, 'total': 0, 'success': True}

        if limit:
            operators = operators[:limit]
            logger.info(f'限制开发数量: {limit}')

        # 调用完整流程
        return self.run_full_pipeline(
            operators=operators,
            skip_evaluation=skip_evaluation,
            max_workers=max_workers
        )

    def list_available_batches(self) -> list[dict]:
        """列出所有可用的评估批次。

        Returns:
            批次信息列表
        """
        batches = self.config_loader.get_available_batches()
        result = []

        for batch_id in batches:
            try:
                stats = self.config_loader.get_batch_statistics(batch_id)
                metadata = self.config_loader.get_batch_metadata(batch_id)
                result.append({
                    'batch_id': batch_id,
                    'description': metadata.get('description', ''),
                    'total_count': stats['total_count'],
                    'by_difficulty': stats['by_difficulty'],
                    'by_hardware': stats['by_hardware'],
                })
            except Exception as e:
                logger.warning(f'获取批次 {batch_id} 信息失败: {e}')

        return result

    def run_evaluation_batch(self, batch_id: Optional[str] = None, max_workers: Optional[int] = None) -> dict:
        """批量评估开发日志（并行模式）。"""
        if batch_id is None:
            batch_id = self.current_batch_id

        if batch_id is None:
            raise ValueError('未指定批次ID，且没有当前批次')

        # 处理 batch_id 前缀
        if not batch_id.startswith('batch_'):
            batch_dir_name = f'batch_{batch_id}'
        else:
            batch_dir_name = batch_id

        batch_dir = self.logs_dir / batch_dir_name
        if not batch_dir.exists():
            raise ValueError(f'批次目录不存在: {batch_dir}')

        logger.info(f'开始批量评估日志（并行模式），批次ID: {batch_id}')

        log_files = self._scan_development_logs(batch_dir)
        if not log_files:
            logger.info('没有找到需要评估的日志')
            return {'batch_id': batch_id, 'total': 0, 'results': []}

        logger.info(f'找到 {len(log_files)} 个开发日志')

        # 优先级: 参数 > 配置文件 > 默认值
        if max_workers is None:
            config_workers = self.config_loader.get_max_workers()
            if config_workers is not None:
                max_workers = config_workers
            else:
                max_workers = min(DEFAULT_MAX_WORKERS, len(log_files) + 4)
        logger.info(f'并行度: {max_workers}')

        results = []
        completed = 0
        log = logging.getLogger('evaluation_system')

        # 获取评估超时配置
        eval_timeout = self.config_loader.get_evaluation_timeout()
        logger.info(f'评估超时时间: {eval_timeout} 秒')

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_log = {}
            for log_file in log_files:
                # 从元数据文件中获取算子名称
                operator_name = self._extract_operator_name_from_metadata(log_file)

                future = executor.submit(
                    self.claude_runner.run_evaluation_session,
                    log_file=str(log_file),
                    batch_id=batch_id,
                    operator_name=operator_name,
                    timeout=eval_timeout
                )
                future_to_log[future] = log_file

            for future in as_completed(future_to_log):
                log_file = future_to_log[future]
                completed += 1
                log.info(f'[{completed}/{len(log_files)}] 评估完成: {log_file.name}')

                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    log.error(f'评估失败: {log_file.name}, {e}')
                    results.append({'log_file': str(log_file), 'success': False, 'error': str(e)})

        meta_file = batch_dir / 'meta.json'
        if meta_file.exists():
            try:
                metadata = self._load_json(meta_file)
                metadata['evaluation_completed_at'] = datetime.now().strftime(TIMESTAMP_FORMAT)
                metadata['evaluation_count'] = len(results)
                self._save_json(meta_file, metadata)
            except (json.JSONDecodeError, OSError) as e:
                logger.warning(f'更新元数据文件失败: {e}')

        logger.info('批量评估完成')

        return {'batch_id': batch_id, 'total': len(log_files), 'results': results}

    def _scan_development_logs(self, batch_dir: Optional[Path] = None) -> list[Path]:
        """扫描开发日志文件。"""
        log_files = []

        if batch_dir and batch_dir.exists():
            for file in batch_dir.glob('*.md'):
                if not file.name.endswith('-evaluation.md'):
                    log_files.append(file)

        if not log_files:
            for file in self.logs_dir.glob('*.md'):
                if not file.name.endswith('-evaluation.md'):
                    log_files.append(file)

        return sorted(log_files)

    def _extract_timestamp_from_filename(self, filename: str) -> Optional[str]:
        """从文件名中提取时间戳。"""
        parts = filename.split('_')

        for i, part in enumerate(parts):
            # 查找8位数字（日期）
            if len(part) == 8 and part.isdigit():
                # 检查下一部分是否为6位数字（时间）
                if i + 1 < len(parts) and len(parts[i + 1]) == 6 and parts[i + 1].isdigit():
                    return f'{part}_{parts[i + 1]}'

        return None

    def _organize_batch_logs(self, batch_id: str, operator_configs: list[dict]) -> list[dict]:
        """为批次目录中的日志生成元数据。

        注意：日志由 Hook（session_stop_handle.py）直接写入 batch 目录，
        不再从 logs 根目录移动。此方法仅负责为已有日志生成元数据。
        """
        batch_dir = self.logs_dir / f'batch_{batch_id}'
        organized_logs = []

        if not batch_dir.exists():
            logger.warning(f'批次目录不存在: {batch_dir}')
            return []

        # 处理批次目录中的日志文件，生成元数据
        for log_file in batch_dir.glob('*.md'):
            if log_file.name.endswith('-evaluation.md'):
                continue

            # 检查是否已有元数据文件
            meta_path = batch_dir / f'{log_file.stem}-meta.json'
            if meta_path.exists():
                continue  # 已有元数据，跳过

            operator_name = self._extract_operator_name_from_log(log_file.name)
            operator_config = self._find_operator_config(operator_name, operator_configs)

            file_timestamp = self._extract_timestamp_from_filename(log_file.stem)

            if operator_config:
                op_id = operator_config.get('id', 'UNKNOWN')
            else:
                op_id = None

            # operator_name 始终使用从文件名提取的完整名称，避免截断导致覆盖
            metadata = {
                'batch_id': batch_id,
                'operator_id': op_id,
                'operator_name': operator_name,
                'original_filename': log_file.name,
                'log_file': log_file.name,
                'timestamp': file_timestamp,
                'difficulty': operator_config.get('difficulty') if operator_config else None,
                'category': operator_config.get('category') if operator_config else None,
            }

            self._save_json(meta_path, metadata)

            organized_logs.append({'log_file': str(log_file), 'meta_file': str(meta_path), 'metadata': metadata})

            logger.info(f'生成元数据(批次目录): {log_file.name}')

        return organized_logs

    def _extract_operator_name_from_log(self, log_filename: str) -> Optional[str]:
        """从日志文件名提取算子名称。

        使用完整的文件名 stem 作为算子名称，不再按下划线截断。
        例如: gmm_softmax.md -> gmm_softmax, reduce_mean.md -> reduce_mean
        """
        stem = Path(log_filename).stem
        parts = stem.split('_')

        # 如果以时间戳开头，没有算子名称
        if len(parts[0]) == 8 and parts[0].isdigit():
            return None

        return stem

    def _find_operator_config(self, operator_name: Optional[str], operator_configs: list[dict]) -> Optional[dict]:
        """在配置列表中查找算子配置。

        先精确匹配，再尝试前缀匹配（用于 weight_quant_batch_mm_retry 等带后缀的情况）。
        """
        if not operator_name:
            return None

        # 精确匹配
        for config in operator_configs:
            if config.get('name') == operator_name:
                return config

        # 前缀匹配：日志名可能带 _retry 等后缀
        for config in operator_configs:
            config_name = config.get('name', '')
            if operator_name.startswith(config_name + '_') or config_name.startswith(operator_name + '_'):
                return config

        return None

    def _extract_operator_name_from_metadata(self, log_file: Path) -> str:
        """从元数据文件或日志内容中提取算子名称。

        优先级：
        1. 从元数据文件读取
        2. 从日志文件名提取（如果已经是算子名称格式）
        3. 从日志内容提取
        4. 使用文件名作为默认值

        Args:
            log_file: 日志文件路径

        Returns:
            算子名称
        """
        # 1. 尝试从元数据文件读取
        meta_file = log_file.parent / f'{log_file.stem}-meta.json'
        if meta_file.exists():
            try:
                with open(meta_file, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                    if metadata.get('operator_name'):
                        return metadata['operator_name']
            except Exception as e:
                logger.warning(f'读取元数据文件失败: {meta_file}, {e}')

        # 2. 从日志文件名中提取（如果是已重命名的格式）
        stem = log_file.stem
        # 检查是否是时间戳格式 (YYYYMMDD_HHMMSS_XXXXXXX)
        parts = stem.split('_')
        if not (len(parts[0]) == 8 and parts[0].isdigit()):
            # 不是时间戳格式，说明已经是算子名称格式
            return stem.replace('-evaluation', '')

        # 3. 从日志内容中提取（最后手段）
        try:
            with open(log_file, 'r', encoding='utf-8') as f:
                # 读取前100行
                for _ in range(100):
                    line = f.readline()
                    if not line:
                        break
                    # 查找算子名称标识
                    if '算子名称' in line or 'Operator Name' in line or '名称:' in line:
                        # 提取名称（简单实现，可能需要根据实际情况调整）
                        parts = line.split(':')
                        if len(parts) > 1:
                            return parts[1].strip().lower().replace(' ', '_')
        except Exception as e:
            logger.warning(f'从日志内容提取算子名称失败: {log_file}, {e}')

        # 4. 使用文件名作为默认值
        return log_file.stem

    def _get_obs_uploader(self, obs_prefix: Optional[str] = None) -> OBSUploader:
        """获取或创建 OBS 上传器实例。"""
        if self.obs_uploader is None or (obs_prefix and self.obs_uploader.obs_prefix != obs_prefix):
            prefix = obs_prefix or self.config_loader.get_obs_config().get('prefix', 'evaluation_reports')
            self.obs_uploader = OBSUploader(project_root=str(self.project_root), obs_prefix=prefix, config_loader=self.config_loader)
        return self.obs_uploader

    def upload_batch_to_obs(self,
                            batch_id: Optional[str] = None,
                            obs_prefix: Optional[str] = None,
                            overwrite: bool = False,
                            dry_run: bool = False) -> BatchUploadResult:
        """上传批次报告到 OBS。

        Args:
            batch_id: 批次ID，默认使用当前批次
            obs_prefix: OBS 对象前缀
            overwrite: 是否覆盖已存在的对象
            dry_run: 试运行模式

        Returns:
            批量上传结果
        """
        if batch_id is None:
            batch_id = self.current_batch_id

        if batch_id is None:
            raise ValueError('未指定批次ID，且没有当前批次')

        logger.info(f'[OBS 上传] 开始上传批次报告: {batch_id}')

        uploader = self._get_obs_uploader(obs_prefix)
        result = uploader.upload_batch(
            batch_id=batch_id,
            overwrite=overwrite,
            dry_run=dry_run
        )

        if dry_run:
            logger.info(f'[OBS 上传] 试运行完成，共 {result.total_files} 个文件待上传')
        else:
            logger.info(f'[OBS 上传] 上传完成: 成功 {result.success_count}, '
                        f'失败 {result.failed_count}, 跳过 {result.skipped_count}')

        return result

    def list_uploadable_batches(self) -> list[dict]:
        """列出可上传的批次目录。"""
        uploader = self._get_obs_uploader()
        return uploader.list_uploadable_batches()

    def run_full_pipeline(self,
                          operators: Optional[list[dict]] = None,
                          difficulty: Optional[str] = None,
                          category: Optional[str] = None,
                          limit: Optional[int] = None,
                          skip_evaluation: bool = False,
                          max_workers: Optional[int] = None,
                          batch: Optional[str] = None,
                          hardware: Optional[str] = None,
                          upload_obs: bool = False,
                          obs_prefix: Optional[str] = None,
                          obs_overwrite: bool = False,
                          dry_run: bool = False) -> dict:
        """完整流程：批量开发加自动评估加可选OBS上传。

        Args:
            operators: 直接指定的算子列表
            difficulty: 按难度筛选（旧方式）
            category: 按类别筛选（旧方式）
            limit: 限制开发的算子数量
            skip_evaluation: 是否跳过评估阶段
            max_workers: 并行评估的线程数
            batch: 评估批次ID（新方式），如 'day_1'
            hardware: 硬件分类筛选（新方式），如 'Vector'
            upload_obs: 是否上传到 OBS
            obs_prefix: OBS 对象前缀
            obs_overwrite: 是否覆盖已存在的 OBS 对象
            dry_run: 试运行模式（仅对 OBS 上传生效）

        Returns:
            流程执行结果字典
        """
        logger.info('Ascend C 算子自动化开发与评估完整流程')

        # 如果指定了批次，使用新的批次加载方式
        if batch:
            logger.info(f'评估批次: {batch}')
            if hardware:
                logger.info(f'硬件分类筛选: {hardware}')

            try:
                if hardware:
                    operators = self.config_loader.get_operators_by_batch_and_hardware(batch, hardware)
                else:
                    operators = self.config_loader.get_operators_by_batch(batch)
            except ValueError as e:
                logger.error(f'批次不存在: {batch}')
                return {'batch': batch, 'error': str(e), 'success': False}

            if limit:
                operators = operators[:limit]
        elif operators is None:
            # 使用旧的筛选方式
            operators = self.config_loader.get_operator_list(difficulty=difficulty, category=category, limit=limit)

        # 阶段1：批量开发
        total_stages = 3 if upload_obs else 2
        logger.info(f'[阶段 1/{total_stages}] 批量开发算子')

        dev_result = self.run_development_batch(operators=operators)

        batch_id = dev_result.get('batch_id')
        dev_total = dev_result.get('total', 0)
        dev_success = dev_result.get('success', 0)
        dev_failed = dev_result.get('failed', 0)

        # 阶段1.5：重试失败的开发（最多1次）
        if dev_failed > 0:
            logger.info(f'[阶段 1.5/{total_stages}] 重试失败的算子开发（{dev_failed}个）')
            failed_operators = []
            for result in dev_result.get('results', []):
                if not result.get('success'):
                    failed_operators.append(result.get('operator_name'))

            # 检查是否有 429 速率限制错误，如有则等待
            import time
            has_rate_limit = any(
                '429' in str(r.get('stdout', '')) + str(r.get('stderr', ''))
                for r in dev_result.get('results', []) if not r.get('success')
            )
            if has_rate_limit:
                wait_seconds = 60
                logger.info(f'检测到 API 速率限制(429)，等待 {wait_seconds} 秒后重试...')
                time.sleep(wait_seconds)

            retry_success = 0
            for op_name in failed_operators:
                op_config = self._find_operator_config(op_name, operators)
                if op_config:
                    logger.info(f'重试算子: {op_name}')
                    retry_result = self.develop_single_operator(op_config)
                    if retry_result.get('success'):
                        retry_success += 1
                        # 更新原始结果
                        for i, r in enumerate(dev_result.get('results', [])):
                            if r.get('operator_name') == op_name:
                                dev_result['results'][i] = retry_result
                                break

            # 更新统计
            dev_success += retry_success
            dev_failed -= retry_success
            dev_result['success'] = dev_success
            dev_result['failed'] = dev_failed
            logger.info(f'重试完成: 成功 {retry_success} 个')

            # 同步更新 meta.json 中的 success_count
            if retry_success > 0 and batch_id:
                try:
                    meta_file = self.logs_dir / f'batch_{batch_id}' / 'meta.json'
                    if meta_file.exists():
                        metadata = self._load_json(meta_file)
                        metadata['success_count'] = dev_success
                        metadata['retry_success_count'] = retry_success
                        self._save_json(meta_file, metadata)
                        logger.info(f'已更新 meta.json: success_count={dev_success}')
                except Exception as e:
                    logger.warning(f'更新 meta.json 失败: {e}')

        # 阶段2：批量评估
        if skip_evaluation:
            logger.info(f'[阶段 2/{total_stages}] 跳过评估（--skip-evaluation）')
            eval_result = {'batch_id': batch_id, 'skipped': True, 'reason': '用户指定跳过评估'}
        elif dev_total == 0:
            logger.info(f'[阶段 2/{total_stages}] 跳过评估（没有算子需要评估）')
            eval_result = {'batch_id': batch_id, 'skipped': True, 'reason': '没有算子需要评估'}
        else:
            logger.info(f'[阶段 2/{total_stages}] 批量评估开发日志')
            eval_result = self.run_evaluation_batch(batch_id=batch_id, max_workers=max_workers)

        # 阶段3：OBS 上传
        obs_result = None
        if upload_obs:
            logger.info(f'[阶段 3/{total_stages}] 上传报告到 OBS')
            try:
                obs_result = self.upload_batch_to_obs(
                    batch_id=batch_id,
                    obs_prefix=obs_prefix,
                    overwrite=obs_overwrite,
                    dry_run=dry_run
                )
                obs_result = {
                    'batch_id': batch_id,
                    'total_files': obs_result.total_files,
                    'success_count': obs_result.success_count,
                    'failed_count': obs_result.failed_count,
                    'skipped_count': obs_result.skipped_count,
                    'dry_run': dry_run
                }
            except Exception as e:
                logger.error(f'OBS 上传失败: {e}')
                obs_result = {'batch_id': batch_id, 'error': str(e), 'success': False}

        # 完整流程汇总
        eval_total = eval_result.get('total', 0) if not eval_result.get('skipped') else 0

        logger.info('完整流程执行完成')
        logger.info(f'批次ID: {batch_id}')
        logger.info(f'[开发阶段] 计划开发: {dev_total} 个算子，'
                    f'开发成功: {dev_success} 个，开发失败: {dev_failed} 个')
        if dev_total > 0:
            logger.info(f'成功率: {dev_success / dev_total * 100:.1f}%')
        else:
            logger.info('成功率: N/A')

        if eval_result.get('skipped'):
            logger.info(f'[评估阶段] 状态: 已跳过，原因: {eval_result.get("reason", "未知")}')
        else:
            eval_success = sum(1 for r in eval_result.get('results', []) if r.get('success'))
            logger.info(f'[评估阶段] 评估日志: {eval_total} 个，'
                        f'评估成功: {eval_success} 个')
            if eval_total > 0:
                logger.info(f'成功率: {eval_success / eval_total * 100:.1f}%')
            else:
                logger.info('成功率: N/A')

        logger.info(f'批次目录: logs/batch_{batch_id}/')

        # OBS 上传结果
        if obs_result:
            if obs_result.get('dry_run'):
                logger.info(f'[OBS 上传] 试运行模式，共 {obs_result.get("total_files", 0)} 个文件待上传')
            elif obs_result.get('error'):
                logger.error(f'[OBS 上传] 失败: {obs_result.get("error")}')
            else:
                logger.info(f'[OBS 上传] 成功: {obs_result.get("success_count", 0)}, '
                            f'失败: {obs_result.get("failed_count", 0)}, '
                            f'跳过: {obs_result.get("skipped_count", 0)}')

        return {'batch_id': batch_id, 'development': dev_result, 'evaluation': eval_result, 'obs_upload': obs_result}


def main() -> None:
    """主函数入口（用于测试）。"""
    import argparse

    parser = argparse.ArgumentParser(description='Ascend C 算子批量开发编排器',
                                     formatter_class=argparse.RawDescriptionHelpFormatter,
                                     epilog='''
使用示例:
  # 按评估批次运行（推荐方式）
  python3 evaluation_system/orchestrator.py --full-pipeline --batch day_1
  python3 evaluation_system/orchestrator.py --full-pipeline --batch day_1 --hardware Vector
  python3 evaluation_system/orchestrator.py --full-pipeline --batch day_1 --limit 5

  # 完整流程（开发+评估+上传OBS）
  python3 evaluation_system/orchestrator.py --full-pipeline --batch day_1 --upload-obs

  # 列出所有可用批次
  python3 evaluation_system/orchestrator.py --list-batches

  # 列出可上传的批次目录
  python3 evaluation_system/orchestrator.py --list-batch-dirs

  # 旧方式：按难度/类别筛选
  python3 evaluation_system/orchestrator.py --difficulty L1 --limit 3

  # 评估阶段（仅评估已完成的开发日志）
  python3 evaluation_system/orchestrator.py --evaluate batch_20260115_094732

  # 完整流程（仅开发，跳过评估）
  python3 evaluation_system/orchestrator.py --full-pipeline --batch day_1 --skip-evaluation

  # 仅上传指定批次到 OBS
  python3 evaluation_system/orchestrator.py --upload-batch batch_20260224_165307

  # 试运行模式（查看将要上传的文件）
  python3 evaluation_system/orchestrator.py --upload-batch batch_20260224_165307 --dry-run
        ''')

    # 功能选择参数
    parser.add_argument('--full-pipeline', action='store_true', help='完整流程模式：批量开发加自动评估')
    parser.add_argument('--list-batches', action='store_true', help='列出所有可用的评估批次')
    parser.add_argument('--list-batch-dirs', action='store_true', help='列出可上传的批次目录')

    # 批次筛选参数（新方式）
    parser.add_argument('--batch', metavar='BATCH_ID', help='评估批次ID，如 day_1, day_2')
    parser.add_argument('--hardware', choices=HARDWARE_CATEGORIES,
                        help='硬件分类筛选: Vector, Cube, CV_Fusion, General_Fusion')

    # 算子筛选参数（旧方式，保持兼容）
    parser.add_argument('--difficulty', choices=['L1', 'L2', 'L3'], help='按难度筛选（旧方式）')
    parser.add_argument('--category', help='按类别筛选（旧方式）')
    parser.add_argument('--limit', type=int, help='限制开发的算子数量')

    # 评估参数
    parser.add_argument('--evaluate', metavar='BATCH_ID', help='评估指定批次（仅评估模式，评估已完成的开发日志）')
    parser.add_argument('--skip-evaluation', action='store_true', help='完整流程模式下跳过评估步骤')
    parser.add_argument('--max-workers', type=int, help='并行评估的线程数（覆盖配置文件）')

    # OBS 上传参数
    parser.add_argument('--upload-obs', action='store_true', help='评估完成后上传到 OBS')
    parser.add_argument('--no-upload-obs', action='store_true', help='禁用自动上传（覆盖配置文件）')
    parser.add_argument('--obs-prefix', metavar='PREFIX', help='自定义 OBS 对象前缀')
    parser.add_argument('--obs-overwrite', action='store_true', help='覆盖已存在的 OBS 对象')
    parser.add_argument('--upload-batch', metavar='BATCH_ID', help='仅上传指定批次到 OBS（不上传请使用 --dry-run）')
    parser.add_argument('--dry-run', action='store_true', help='试运行模式（仅对 OBS 上传生效）')

    args = parser.parse_args()

    orchestrator = OperatorOrchestrator()

    # 优先级：列出批次 > 列出批次目录 > 仅上传OBS > 仅评估 > 完整流程 > 仅开发
    if args.list_batches:
        batches = orchestrator.list_available_batches()
        print('\n可用的评估批次:')
        print('-' * 60)
        for b in batches:
            print(f"  {b['batch_id']}: {b['description']}")
            print(f"    总数: {b['total_count']}, 难度分布: {b['by_difficulty']}")
            print(f"    硬件分布: {b['by_hardware']}")
        print('-' * 60)

    elif args.list_batch_dirs:
        batches = orchestrator.list_uploadable_batches()
        print('\n可上传的批次目录:')
        print('-' * 60)
        for b in batches:
            print(f"  {b['batch_id']}: {b['file_count']} 个文件")
        print('-' * 60)

    elif args.upload_batch:
        # 仅上传指定批次到 OBS
        batch_id = args.upload_batch
        if batch_id.startswith('batch_'):
            batch_id = batch_id[6:]
        orchestrator.upload_batch_to_obs(
            batch_id=batch_id,
            obs_prefix=args.obs_prefix,
            overwrite=args.obs_overwrite,
            dry_run=args.dry_run
        )

    elif args.evaluate:
        batch_id = args.evaluate
        if batch_id.startswith('batch_'):
            batch_id = batch_id[6:]
        orchestrator.run_evaluation_batch(batch_id, max_workers=args.max_workers)

    elif args.full_pipeline:
        orchestrator.run_full_pipeline(
            batch=args.batch,
            hardware=args.hardware,
            difficulty=args.difficulty,
            category=args.category,
            limit=args.limit,
            skip_evaluation=args.skip_evaluation,
            max_workers=args.max_workers,
            upload_obs=args.upload_obs,
            obs_prefix=args.obs_prefix,
            obs_overwrite=args.obs_overwrite,
            dry_run=args.dry_run
        )

    else:
        orchestrator.run_development_batch(difficulty=args.difficulty, category=args.category, limit=args.limit)


if __name__ == '__main__':
    main()
