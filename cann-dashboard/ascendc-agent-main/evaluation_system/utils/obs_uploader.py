"""OBS 批量上传工具模块，支持上传评估报告到华为云 OBS。"""
import json
import logging
import mimetypes
import os
import urllib.parse
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Optional

logger = logging.getLogger('evaluation_system')


def _get_obs_config_from_env() -> dict:
    """从环境变量获取 OBS 配置。"""
    return {
        'access_key': os.getenv('OBS_ACCESS_KEY'),
        'secret_key': os.getenv('OBS_SECRET_KEY'),
        'endpoint': os.getenv('OBS_ENDPOINT'),
        'bucket_name': os.getenv('OBS_BUCKET_NAME'),
    }


def _get_obs_config_from_yaml(config_loader) -> dict:
    """从 YAML 配置文件获取 OBS 配置。

    支持两种字段名格式：
    - access_key / secret_key（标准格式）
    - AK / SK（简写格式）
    """
    obs_config = config_loader.get_obs_config() if config_loader else {}
    return {
        'access_key': obs_config.get('access_key') or obs_config.get('AK'),
        'secret_key': obs_config.get('secret_key') or obs_config.get('SK'),
        'endpoint': obs_config.get('endpoint') or obs_config.get('server'),
        'bucket_name': obs_config.get('bucket_name'),
    }


def _merge_obs_config(env_config: dict, yaml_config: dict) -> dict:
    """合并配置，优先级：环境变量 > YAML配置。"""
    merged = {}
    for key in ['access_key', 'secret_key', 'endpoint', 'bucket_name']:
        # 环境变量 > YAML配置
        if env_config.get(key):
            merged[key] = env_config[key]
        elif yaml_config.get(key):
            merged[key] = yaml_config[key]

    return merged


class OBSClient:
    """OBS 客户端封装类。"""

    def __init__(self, access_key: str, secret_key: str, endpoint: str, bucket_name: str):
        """初始化 OBS 客户端。

        Args:
            access_key: 华为云 AK
            secret_key: 华为云 SK
            endpoint: OBS 终端节点
            bucket_name: OBS 桶名称
        """
        self.access_key = access_key
        self.secret_key = secret_key
        self.endpoint = endpoint
        self.bucket_name = bucket_name
        self._client = None
        self._bucket_client = None

    def _init_client(self):
        """延迟初始化 OBS 客户端。

        按照华为云官方文档：server 参数直接填写带 https:// 的 Endpoint
        文档：https://support.huaweicloud.com/sdk-python-devg-obs/obs_22_0801.html
        """
        if self._client is not None:
            return

        try:
            from obs import ObsClient

            # 【华为云官方文档写法】server 直接填写 endpoint，无需移除协议前缀
            server = self.endpoint

            self._client = ObsClient(
                access_key_id=self.access_key,
                secret_access_key=self.secret_key,
                server=server
            )
            self._bucket_client = self._client.bucketClient(bucketName=self.bucket_name)
        except ImportError:
            raise RuntimeError("请安装 OBS SDK: pip install esdk-obs-python")

    def put_object(self, object_key: str, file_data: bytes, content_type: str, metadata: dict) -> bool:
        """上传对象到 OBS。

        Args:
            object_key: 对象键
            file_data: 文件数据（字节流）
            content_type: 内容类型
            metadata: 自定义元数据

        Returns:
            是否成功
        """
        self._init_client()

        try:
            # 构建元数据，OBS要求自定义元数据以x-obs-meta-开头
            obs_metadata = {}
            if metadata:
                for key, val in metadata.items():
                    metadata_key = f"x-obs-meta-{key}" if not key.startswith("x-obs-meta-") else key
                    obs_metadata[metadata_key] = urllib.parse.quote(str(val))

            resp = self._bucket_client.putContent(
                objectKey=object_key,
                content=file_data,
                metadata=obs_metadata
            )

            if resp.status < 300:
                logger.info(f"成功上传对象 {object_key}")
                return True
            else:
                logger.error(f"上传对象失败 {object_key}: {resp.errorCode} - {resp.errorMessage}")
                return False

        except Exception as e:
            logger.error(f"上传文件到OBS失败: {e}", exc_info=True)
            return False

    def object_exists(self, object_key: str) -> bool:
        """检查 OBS 对象是否存在。

        Args:
            object_key: 对象键

        Returns:
            是否存在
        """
        self._init_client()

        try:
            resp = self._bucket_client.headObject(objectKey=object_key)
            return resp.status < 300
        except Exception as e:
            logger.error(f"检查对象是否存在失败: {e}", exc_info=True)
            return False


@dataclass
class UploadResult:
    """单个文件上传结果"""
    local_path: str
    obs_key: str
    success: bool
    error_message: Optional[str] = None
    skipped: bool = False  # 是否跳过（已存在且不覆盖）


@dataclass
class BatchUploadResult:
    """批量上传结果"""
    batch_id: str
    total_files: int
    success_count: int
    failed_count: int
    skipped_count: int
    upload_results: List[UploadResult] = field(default_factory=list)

    @property
    def is_success(self) -> bool:
        """是否全部成功（忽略跳过的文件）"""
        return self.failed_count == 0


class OBSUploader:
    """OBS 批量上传器"""

    # 文件类型到 MIME 类型的映射
    MIME_TYPES = {
        '.md': 'text/markdown',
        '.json': 'application/json',
        '.csv': 'text/csv',
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.yaml': 'text/yaml',
        '.yml': 'text/yaml',
    }

    def __init__(self,
                 project_root: Optional[str] = None,
                 obs_prefix: str = 'cann_exp/static/prod/agent_operator',
                 config_loader=None):
        """初始化上传器。

        Args:
            project_root: 项目根目录
            obs_prefix: OBS 对象前缀
            config_loader: 配置加载器实例
        """
        if project_root is None:
            project_root = Path(__file__).parent.parent.parent
        self.project_root = Path(project_root)
        self.logs_dir = self.project_root / 'logs'
        self.obs_prefix = obs_prefix
        self.config_loader = config_loader
        self._obs_client: Optional[OBSClient] = None
        self._operator_map: Optional[dict] = None

    def _get_obs_client(self) -> OBSClient:
        """获取 OBS 客户端实例。"""
        if self._obs_client is not None:
            return self._obs_client

        # 合并配置
        env_config = _get_obs_config_from_env()
        yaml_config = _get_obs_config_from_yaml(self.config_loader)
        config = _merge_obs_config(env_config, yaml_config)

        # 检查必要配置
        required_keys = ['access_key', 'secret_key', 'endpoint', 'bucket_name']
        missing = [k for k in required_keys if not config.get(k)]
        if missing:
            raise ValueError(f"OBS 配置缺失: {missing}。请通过环境变量或配置文件设置。")

        self._obs_client = OBSClient(
            access_key=config['access_key'],
            secret_key=config['secret_key'],
            endpoint=config['endpoint'],
            bucket_name=config['bucket_name']
        )
        return self._obs_client

    def _get_content_type(self, file_path: Path) -> str:
        """获取文件的 MIME 类型。"""
        suffix = file_path.suffix.lower()
        if suffix in self.MIME_TYPES:
            return self.MIME_TYPES[suffix]

        # 使用 mimetypes 模块猜测
        mime_type, _ = mimetypes.guess_type(str(file_path))
        return mime_type or 'application/octet-stream'

    @staticmethod
    def _extract_date_from_batch(batch_id: str) -> str:
        """从批次 ID 中提取日期部分。

        Args:
            batch_id: 批次ID，如 'batch_20260227_110543' 或 '20260227_110543'

        Returns:
            日期字符串，如 '20260227'；解析失败时返回 batch_id 去掉 'batch_' 前缀
        """
        # 先去掉可能的 'batch_' 前缀
        cleaned_id = batch_id.removeprefix('batch_')
        # 20260227_110543 → parts = ['20260227', '110543']
        parts = cleaned_id.split('_')
        # 返回第一部分（日期）
        if len(parts) >= 1 and parts[0].isdigit() and len(parts[0]) == 8:
            return parts[0]
        # 降级：返回清理后的 ID
        return cleaned_id

    def _build_operator_map(self) -> dict:
        """遍历 config_loader 所有批次，构建 {op_name: hardware_category} 映射。"""
        op_map = {}
        if self.config_loader is None:
            return op_map
        try:
            for batch_id in self.config_loader.get_available_batches():
                operators = self.config_loader.get_operators_by_batch(batch_id)
                for op in operators:
                    name = op.get('name')
                    hw = op.get('_hardware_category', 'Vector')
                    if name:
                        op_map[name] = hw
        except Exception as e:
            logger.warning(f'构建算子映射失败: {e}')
        return op_map

    def _get_operator_map(self) -> dict:
        """懒加载算子映射。"""
        if self._operator_map is None:
            self._operator_map = self._build_operator_map()
        return self._operator_map

    def _get_par_operator(self, op_name: str) -> str:
        """获取算子的硬件分类（par_operator），未找到时回退 'Vector'。"""
        return self._get_operator_map().get(op_name, 'Vector')

    def _get_scene_name(self) -> str:
        """从 config_loader 读取场景名称，无 config_loader 时返回 'scene4'。"""
        if self.config_loader is not None and hasattr(self.config_loader, 'get_scene_name'):
            return self.config_loader.get_scene_name()
        return 'scene4'

    def _identify_operator(self, filename: str) -> Optional[str]:
        """从文件名中解析算子名称。

        匹配规则：
          - '{op}-evaluation.json' → op
          - '{op}-evaluation.md'  → op
          - '{op}.md'             → op
          - '{op}.json'           → op（非 meta/summary 等通用文件）

        Args:
            filename: 文件名（不含目录）

        Returns:
            算子名称，识别不到返回 None
        """
        op_map = self._get_operator_map()
        stem = Path(filename).stem  # 去掉扩展名
        # 先尝试 '{op}-evaluation' 形式
        if stem.endswith('-evaluation'):
            candidate = stem[: -len('-evaluation')]
            if candidate in op_map:
                return candidate
        # 再尝试直接匹配算子名
        if stem in op_map:
            return stem
        return None

    def _get_obs_filename(self, filename: str, op_name: Optional[str]) -> str:
        """获取上传到 OBS 的目标文件名。

        规则：'{op}-evaluation.json' → '{op}.json'；其余保持原名。
        """
        if op_name and filename == f'{op_name}-evaluation.json':
            return f'{op_name}.json'
        return filename

    def _get_obs_key(self, local_path: Path, batch_id: str) -> str:
        """生成 OBS 对象键。

        已知算子文件：
          cann_exp/static/prod/agent_operator/{par_operator}/{scene_name}/{cur_date}/{obs_filename}
        批次级文件（meta.json 等）：
          cann_exp/static/prod/agent_operator/{scene_name}/{cur_date}/{filename}

        Args:
            local_path: 本地文件路径
            batch_id: 批次ID，如 'batch_20260227_110543'

        Returns:
            OBS 对象键
        """
        filename = local_path.name
        # 使用上传当天的日期（格式：YYYYMMDD）
        # 如果当前时间 >= 23:00，日期加一天
        now = datetime.now()
        if now.hour >= 23:
            cur_date = (now + timedelta(days=1)).strftime('%Y%m%d')
        else:
            cur_date = now.strftime('%Y%m%d')
        scene_name = self._get_scene_name()

        op_name = self._identify_operator(filename)
        if op_name:
            par_operator = self._get_par_operator(op_name)
            obs_filename = self._get_obs_filename(filename, op_name)
            return f"{self.obs_prefix}/{par_operator}/{scene_name}/{cur_date}/{obs_filename}"
        else:
            return f"{self.obs_prefix}/{scene_name}/{cur_date}/{filename}"

    def upload_file(self,
                    local_path: str,
                    batch_id: str,
                    metadata: Optional[dict] = None,
                    overwrite: bool = False,
                    dry_run: bool = False) -> UploadResult:
        """上传单个文件到 OBS。

        Args:
            local_path: 本地文件路径
            batch_id: 批次ID
            metadata: 自定义元数据
            overwrite: 是否覆盖已存在的对象
            dry_run: 试运行模式，不实际上传

        Returns:
            上传结果
        """
        file_path = Path(local_path)

        if not file_path.exists():
            return UploadResult(
                local_path=str(local_path),
                obs_key='',
                success=False,
                error_message=f'文件不存在: {local_path}'
            )

        obs_key = self._get_obs_key(file_path, batch_id)

        # 试运行模式
        if dry_run:
            logger.info(f'[DRY-RUN] 将上传: {local_path} -> {obs_key}')
            return UploadResult(
                local_path=str(local_path),
                obs_key=obs_key,
                success=True,
                skipped=True  # 试运行视为跳过
            )

        try:
            obs_client = self._get_obs_client()

            # 检查对象是否已存在
            if not overwrite and obs_client.object_exists(obs_key):
                logger.info(f'对象已存在，跳过: {obs_key}')
                return UploadResult(
                    local_path=str(local_path),
                    obs_key=obs_key,
                    success=True,
                    skipped=True
                )

            # 读取文件内容
            with open(file_path, 'rb') as f:
                file_data = f.read()

            # 上传到 OBS
            content_type = self._get_content_type(file_path)
            success = obs_client.put_object(
                object_key=obs_key,
                file_data=file_data,
                content_type=content_type,
                metadata=metadata or {}
            )

            if success:
                logger.info(f'上传成功: {local_path} -> {obs_key}')
                return UploadResult(
                    local_path=str(local_path),
                    obs_key=obs_key,
                    success=True
                )
            else:
                return UploadResult(
                    local_path=str(local_path),
                    obs_key=obs_key,
                    success=False,
                    error_message='OBS 上传失败'
                )

        except ValueError as e:
            # 配置错误
            logger.warning(f'OBS 配置错误: {e}')
            return UploadResult(
                local_path=str(local_path),
                obs_key=obs_key,
                success=False,
                error_message=str(e)
            )
        except Exception as e:
            logger.error(f'上传失败: {local_path} -> {obs_key}, 错误: {e}')
            return UploadResult(
                local_path=str(local_path),
                obs_key=obs_key,
                success=False,
                error_message=str(e)
            )

    def upload_batch(self,
                     batch_id: str,
                     overwrite: bool = False,
                     dry_run: bool = False) -> BatchUploadResult:
        """上传整个批次的报告到 OBS。

        Args:
            batch_id: 批次ID
            overwrite: 是否覆盖已存在的对象
            dry_run: 试运行模式

        Returns:
            批量上传结果
        """
        # 处理 batch_id 前缀
        if batch_id.startswith('batch_'):
            batch_dir_name = batch_id
        else:
            batch_dir_name = f'batch_{batch_id}'

        batch_dir = self.logs_dir / batch_dir_name

        if not batch_dir.exists():
            logger.error(f'批次目录不存在: {batch_dir}')
            return BatchUploadResult(
                batch_id=batch_id,
                total_files=0,
                success_count=0,
                failed_count=0,
                skipped_count=0
            )

        logger.info(f'开始上传批次: {batch_id}')
        logger.info(f'批次目录: {batch_dir}')
        logger.info(f'OBS 前缀: {self.obs_prefix}')

        # 收集要上传的文件
        # 仅上传三种文件：{op}-evaluation.json、{op}-evaluation.md、{op}.md
        # 跳过：meta.json、{op}-meta.json 及其他非标准文件
        files_to_upload = []

        for f in batch_dir.glob('*.json'):
            # 仅上传 {op}-evaluation.json，跳过 meta.json 和 {op}-meta.json
            if f.name == 'meta.json' or f.name.endswith('-meta.json'):
                continue
            if not f.name.endswith('-evaluation.json'):
                continue
            files_to_upload.append(f)
        for f in batch_dir.glob('*.md'):
            files_to_upload.append(f)

        logger.info(f'找到 {len(files_to_upload)} 个文件待上传')

        # 上传每个文件
        upload_results = []
        success_count = 0
        failed_count = 0
        skipped_count = 0

        # 准备批次元数据
        batch_metadata = {}
        meta_file = batch_dir / 'meta.json'
        if meta_file.exists():
            try:
                with open(meta_file, 'r', encoding='utf-8') as f:
                    batch_metadata = json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                logger.warning(f'读取批次元数据失败: {e}')

        for file_path in files_to_upload:
            # 为 evaluations 目录下的文件添加额外元数据
            file_metadata = {
                'batch_id': batch_id,
                'uploaded_at': str(Path(file_path).stat().st_mtime)
            }
            if batch_metadata:
                file_metadata['batch_created_at'] = batch_metadata.get('created_at', '')

            result = self.upload_file(
                local_path=str(file_path),
                batch_id=batch_id,
                metadata=file_metadata,
                overwrite=overwrite,
                dry_run=dry_run
            )

            upload_results.append(result)

            if result.skipped:
                skipped_count += 1
            elif result.success:
                success_count += 1
            else:
                failed_count += 1

        batch_result = BatchUploadResult(
            batch_id=batch_id,
            total_files=len(files_to_upload),
            success_count=success_count,
            failed_count=failed_count,
            skipped_count=skipped_count,
            upload_results=upload_results
        )

        logger.info(f'批次上传完成: 总计 {batch_result.total_files} 个文件, '
                    f'成功 {success_count}, 失败 {failed_count}, 跳过 {skipped_count}')

        return batch_result

    def list_uploadable_batches(self) -> List[dict]:
        """列出可上传的批次目录。

        Returns:
            批次信息列表，包含 batch_id, path, file_count
        """
        batches = []

        if not self.logs_dir.exists():
            return batches

        for batch_dir in sorted(self.logs_dir.glob('batch_*')):
            if not batch_dir.is_dir():
                continue

            # 统计文件数量
            file_count = len(list(batch_dir.glob('*.md')))
            file_count += len(list(batch_dir.glob('*.json')))

            batches.append({
                'batch_id': batch_dir.name,
                'path': str(batch_dir),
                'file_count': file_count
            })

        return batches


# 便捷函数
def upload_batch_to_obs(batch_id: str,
                        project_root: Optional[str] = None,
                        obs_prefix: str = 'cann_exp/static/prod/agent_operator',
                        overwrite: bool = False,
                        dry_run: bool = False,
                        config_loader=None) -> BatchUploadResult:
    """上传批次报告到 OBS 的便捷函数。

    Args:
        batch_id: 批次ID
        project_root: 项目根目录
        obs_prefix: OBS 对象前缀
        overwrite: 是否覆盖已存在的对象
        dry_run: 试运行模式
        config_loader: 配置加载器实例

    Returns:
        批量上传结果
    """
    uploader = OBSUploader(
        project_root=project_root,
        obs_prefix=obs_prefix,
        config_loader=config_loader
    )
    return uploader.upload_batch(batch_id, overwrite=overwrite, dry_run=dry_run)
