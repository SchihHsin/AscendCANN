"""配置文件加载工具模块，支持按批次和硬件分类加载算子配置。"""
from pathlib import Path
from typing import Optional

import yaml


# tech_type 到硬件分类的映射
TECH_TYPE_TO_HARDWARE = {
    # Vector（矢量计算）
    'elementwise': 'Vector',
    'reduction': 'Vector',
    'cumsum': 'Vector',
    'softmax': 'Vector',
    'normalization': 'Vector',
    'sort': 'Vector',
    'gather': 'Vector',
    'scatter': 'Vector',
    'transpose': 'Vector',
    'broadcast': 'Vector',
    'concat': 'Vector',
    'cast': 'Vector',
    'copy': 'Vector',
    'pad': 'Vector',
    'fill': 'Vector',
    'quantization': 'Vector',
    'compare': 'Vector',
    'select': 'Vector',
    'logical': 'Vector',
    'math': 'Vector',
    # Cube（矩阵计算）
    'matmul': 'Cube',
    'conv': 'Cube',
    'attention': 'Cube',
    'gradient': 'Cube',
    'fft': 'Cube',
    # CV融合（计算机视觉融合算子）
    'interpolation': 'CV_Fusion',
    # 通算融合（通用计算融合算子）
    'fused': 'General_Fusion',
}

# 硬件分类列表
HARDWARE_CATEGORIES = ['Vector', 'Cube', 'CV_Fusion', 'General_Fusion']


def get_hardware_category(tech_type: str) -> str:
    """根据 tech_type 获取硬件分类。

    Args:
        tech_type: 技术类型

    Returns:
        硬件分类名称
    """
    return TECH_TYPE_TO_HARDWARE.get(tech_type, 'Vector')


class ConfigLoader:
    """配置加载器类，支持按批次和硬件分类查询算子。"""

    def __init__(self, config_dir: Optional[str] = None):
        """初始化配置加载器。

        Args:
            config_dir: 配置文件目录路径，默认为 evaluation_system/config
        """
        if config_dir is None:
            project_root = Path(__file__).parent.parent.parent
            config_dir = project_root / 'evaluation_system' / 'config'
        self.config_dir = Path(config_dir)
        self._catalog_cache: Optional[dict] = None

    def _load_yaml(self, yaml_path: Path) -> dict:
        """加载 YAML 文件。

        Args:
            yaml_path: YAML 文件路径

        Returns:
            解析后的字典数据

        Raises:
            FileNotFoundError: 文件不存在
        """
        if not yaml_path.exists():
            raise FileNotFoundError(f'YAML 文件不存在: {yaml_path}')
        with open(yaml_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)

    def load_catalog(self, force_reload: bool = False) -> dict:
        """加载算子目录配置文件（带缓存）。

        Args:
            force_reload: 是否强制重新加载

        Returns:
            算子目录配置字典
        """
        if self._catalog_cache is not None and not force_reload:
            return self._catalog_cache

        catalog_path = self.config_dir / 'operator_catalog.yaml'
        if not catalog_path.exists():
            raise FileNotFoundError(f'算子目录配置文件不存在: {catalog_path}')

        data = self._load_yaml(catalog_path)
        self._catalog_cache = data.get('catalog', data)
        return self._catalog_cache

    def get_version(self) -> str:
        """获取配置版本号。"""
        catalog = self.load_catalog()
        return catalog.get('version', 'unknown')

    def get_evaluation_schedule(self) -> list[dict]:
        """获取评估计划列表。

        Returns:
            评估计划列表，每项包含 batch, day, description
        """
        catalog = self.load_catalog()
        return catalog.get('evaluation_schedule', [])

    def get_available_batches(self) -> list[str]:
        """获取所有可用的批次ID列表。

        Returns:
            批次ID列表，如 ['day_1', 'day_2', ...]
        """
        catalog = self.load_catalog()
        batches = catalog.get('batches', {})
        return list(batches.keys())

    def get_batch_metadata(self, batch_id: str) -> dict:
        """获取批次元数据。

        Args:
            batch_id: 批次ID，如 'day_1'

        Returns:
            批次元数据字典
        """
        catalog = self.load_catalog()
        batches = catalog.get('batches', {})
        if batch_id not in batches:
            raise ValueError(f'批次不存在: {batch_id}')
        return batches[batch_id].get('metadata', {})

    def get_operators_by_batch(self, batch_id: str) -> list[dict]:
        """获取指定批次的所有算子。

        Args:
            batch_id: 批次ID，如 'day_1'

        Returns:
            算子配置列表
        """
        catalog = self.load_catalog()
        batches = catalog.get('batches', {})
        if batch_id not in batches:
            raise ValueError(f'批次不存在: {batch_id}')

        batch_data = batches[batch_id]
        hardware_categories = batch_data.get('hardware_categories', {})

        all_operators = []
        for hw_category, hw_data in hardware_categories.items():
            operators = hw_data.get('operators', [])
            for op in operators:
                op['_hardware_category'] = hw_category
            all_operators.extend(operators)

        return all_operators

    def get_operators_by_batch_and_hardware(self, batch_id: str, hardware: str) -> list[dict]:
        """按批次和硬件分类获取算子。

        Args:
            batch_id: 批次ID，如 'day_1'
            hardware: 硬件分类，如 'Vector', 'Cube', 'CV_Fusion', 'General_Fusion'

        Returns:
            算子配置列表
        """
        if hardware not in HARDWARE_CATEGORIES:
            raise ValueError(f'无效的硬件分类: {hardware}，有效值为: {HARDWARE_CATEGORIES}')

        catalog = self.load_catalog()
        batches = catalog.get('batches', {})
        if batch_id not in batches:
            raise ValueError(f'批次不存在: {batch_id}')

        batch_data = batches[batch_id]
        hardware_categories = batch_data.get('hardware_categories', {})

        if hardware not in hardware_categories:
            return []

        operators = hardware_categories[hardware].get('operators', [])
        for op in operators:
            op['_hardware_category'] = hardware

        return operators

    def get_batch_statistics(self, batch_id: str) -> dict:
        """获取批次统计信息。

        Args:
            batch_id: 批次ID，如 'day_1'

        Returns:
            统计信息字典，包含 total_count, by_difficulty, by_hardware 等
        """
        operators = self.get_operators_by_batch(batch_id)

        stats = {
            'batch_id': batch_id,
            'total_count': len(operators),
            'by_difficulty': {},
            'by_hardware': {},
            'by_tech_type': {},
        }

        for op in operators:
            difficulty = op.get('difficulty', 'Unknown')
            stats['by_difficulty'][difficulty] = stats['by_difficulty'].get(difficulty, 0) + 1

            hw = op.get('_hardware_category', get_hardware_category(op.get('tech_type', '')))
            stats['by_hardware'][hw] = stats['by_hardware'].get(hw, 0) + 1

            tech_type = op.get('tech_type', 'Unknown')
            stats['by_tech_type'][tech_type] = stats['by_tech_type'].get(tech_type, 0) + 1

        return stats

    def get_hardware_distribution(self, batch_id: str) -> dict:
        """获取批次内硬件分类分布。

        Args:
            batch_id: 批次ID，如 'day_1'

        Returns:
            硬件分类分布字典
        """
        operators = self.get_operators_by_batch(batch_id)

        distribution = {hw: 0 for hw in HARDWARE_CATEGORIES}
        for op in operators:
            hw = op.get('_hardware_category', get_hardware_category(op.get('tech_type', '')))
            if hw in distribution:
                distribution[hw] += 1

        return distribution

    def get_operator_by_id(self, operator_id: str, batch_id: Optional[str] = None) -> Optional[dict]:
        """根据ID获取算子配置。

        Args:
            operator_id: 算子ID，如 'OP001'
            batch_id: 可选的批次ID，指定则在特定批次内查找

        Returns:
            算子配置字典，未找到返回 None
        """
        if batch_id:
            operators = self.get_operators_by_batch(batch_id)
            for op in operators:
                if op.get('id') == operator_id:
                    return op
            return None

        for batch_id in self.get_available_batches():
            operators = self.get_operators_by_batch(batch_id)
            for op in operators:
                if op.get('id') == operator_id:
                    return op

        return None

    def get_operator_by_name(self, name: str, batch_id: Optional[str] = None) -> Optional[dict]:
        """根据名称获取算子配置。

        Args:
            name: 算子名称
            batch_id: 可选的批次ID

        Returns:
            算子配置字典，未找到返回 None
        """
        if batch_id:
            operators = self.get_operators_by_batch(batch_id)
            for op in operators:
                if op.get('name') == name:
                    return op
            return None

        for batch_id in self.get_available_batches():
            operators = self.get_operators_by_batch(batch_id)
            for op in operators:
                if op.get('name') == name:
                    return op

        return None

    def load_evaluation_config(self) -> dict:
        """加载评估配置文件。"""
        config_path = self.config_dir / 'evaluation_config.yaml'
        if not config_path.exists():
            return {}
        return self._load_yaml(config_path)

    def get_max_workers(self) -> Optional[int]:
        """获取并行评估的线程数配置。"""
        config = self.load_evaluation_config()
        return config.get('resources', {}).get('evaluation', {}).get('max_workers')

    def get_evaluation_timeout(self) -> int:
        """获取评估超时时间配置（秒）。"""
        config = self.load_evaluation_config()
        timeout = config.get('resources', {}).get('evaluation', {}).get('timeout_seconds')
        return timeout if timeout is not None else 3600

    def get_daily_schedule(self) -> dict:
        """获取每日评估计划。"""
        config = self.load_evaluation_config()
        return config.get('daily_evaluation', {}).get('schedule', {})

    def get_obs_config(self) -> dict:
        """获取 OBS 上传配置。

        Returns:
            OBS 完整配置字典，包含 enabled, prefix, auto_upload_on_completion, overwrite
            以及认证信息 access_key, secret_key, endpoint, bucket_name
        """
        config = self.load_evaluation_config()
        return config.get('obs_upload', {
            'enabled': False,
            'prefix': 'evaluation_reports',
            'auto_upload_on_completion': True,
            'overwrite': False,
            'access_key': None,
            'secret_key': None,
            'endpoint': None,
            'bucket_name': None
        })

    def get_scene_name(self) -> str:
        """获取 OBS 上传场景名称，默认 scene4。"""
        return self.get_obs_config().get('scene_name', 'scene4')

    def is_obs_upload_enabled(self) -> bool:
        """检查是否启用 OBS 上传。"""
        return self.get_obs_config().get('enabled', False)
