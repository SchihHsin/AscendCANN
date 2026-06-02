"""Ascend C 算子评估系统。

提供批量开发和评估算子的编排能力，支持：
- 串行开发多个算子
- 并行评估开发日志
- 完整的开发-评估流程
"""

from evaluation_system.orchestrator import OperatorOrchestrator

__all__ = ["OperatorOrchestrator"]
__version__ = "1.0.0"
