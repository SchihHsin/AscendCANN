# Ascend C 算子评估系统

批量开发和评估 Ascend C 算子的自动化系统。

## 功能特性

- **串行开发**：逐个开发算子，避免资源冲突
- **并行评估**：同时评估多个开发日志，提高效率
- **完整流程**：一站式完成开发-评估-上传全流程
- **OBS 上传**：支持将评估报告批量上传到华为云 OBS
- **灵活配置**：通过 YAML 配置算子目录和评估参数

## 目录结构

```
evaluation_system/
├── __init__.py              # 包初始化文件
├── orchestrator.py          # 主编排器
├── config/                  # 配置文件目录
│   ├── evaluation_config.yaml   # 评估系统配置
│   └── operator_catalog.yaml    # 算子目录配置
└── utils/                   # 工具模块
    ├── __init__.py
    ├── claude_runner.py     # Claude Session 管理器
    ├── config_loader.py     # 配置加载器
    └── obs_uploader.py      # OBS 批量上传工具
```

## 快速开始

### 安装依赖

```bash
pip install pyyaml
pip install esdk-obs-python  # 可选，OBS 上传功能需要
```

### 基本使用

```python
from evaluation_system import OperatorOrchestrator

# 创建编排器实例
orchestrator = OperatorOrchestrator()

# 完整流程（开发 + 评估）
result = orchestrator.run_full_pipeline(
    difficulty="L1",  # 按难度筛选
    limit=3          # 限制数量
)
```

### 命令行使用

```bash
# 完整流程（推荐）
python3 evaluation_system/orchestrator.py --full-pipeline --batch day_1

# 完整流程 + OBS 上传
python3 evaluation_system/orchestrator.py --full-pipeline --batch day_1 --upload-obs

# 仅开发
python3 evaluation_system/orchestrator.py --difficulty L1 --limit 3

# 仅评估
python3 evaluation_system/orchestrator.py --evaluate batch_20260115_094732

# 列出可用的评估批次
python3 evaluation_system/orchestrator.py --list-batches

# 列出可上传的批次目录
python3 evaluation_system/orchestrator.py --list-batch-dirs

# 仅上传指定批次到 OBS
python3 evaluation_system/orchestrator.py --upload-batch batch_20260224_165307

# 试运行模式（查看将要上传的文件，不实际上传）
python3 evaluation_system/orchestrator.py --upload-batch batch_20260224_165307 --dry-run

# 全流程测试一个算子
python3 evaluation_system/orchestrator.py --full-pipeline --batch day_1 --limit 1
```

## 配置说明

### 算子目录配置 (operator_catalog.yaml)

定义待开发的算子列表：

```yaml
catalog:
  operators:
    - id: "OP001"
      name: "abs"
      category: "Element-wise"
      difficulty: "L1"
      spec:
        formula: "out = |x|"
        inputs:
          - name: "x"
            dtype: ["fp16", "fp32"]
        outputs:
          - name: "out"
            dtype: "与输入一致"
```

### 评估配置 (evaluation_config.yaml)

定义系统行为说明和资源限制：

```yaml
agent:
  execution:
    development_mode: "serial"     # 串行开发
    evaluation_mode: "parallel"    # 并行评估

resources:
  time_limits:
    per_operator: 3600             # 单个算子最多1小时
    total_batch: 86400             # 总批次最多24小时
```

### OBS 上传配置

支持将评估报告批量上传到华为云 OBS。有两种配置方式，**环境变量优先级更高**：

#### 方式一：环境变量（推荐）

```bash
export OBS_ACCESS_KEY="your_access_key"        # 华为云 AK
export OBS_SECRET_KEY="your_secret_key"        # 华为云 SK
export OBS_ENDPOINT="https://obs.cn-south-1.myhuaweicloud.com"  # OBS 终端节点
export OBS_BUCKET_NAME="your-bucket-name"      # OBS 桶名称
```

#### 方式二：配置文件

编辑 `evaluation_system/config/evaluation_config.yaml`：

```yaml
obs_upload:
  enabled: false
  prefix: "evaluation_reports"

  # 取消注释并填写
  # access_key: "your_access_key"
  # secret_key: "your_secret_key"
  # endpoint: "https://obs.cn-south-1.myhuaweicloud.com"
  # bucket_name: "your-bucket-name"
```

#### 获取 OBS 凭证

1. **AK/SK**：华为云控制台 → 右上角用户名 → 我的凭证 → 访问密钥 → 新增访问密钥
2. **ENDPOINT**：根据桶所在区域选择
   - 华南-广州: `https://obs.cn-south-1.myhuaweicloud.com`
   - 华北-北京四: `https://obs.cn-north-4.myhuaweicloud.com`
   - 华东-上海一: `https://obs.cn-east-3.myhuaweicloud.com`
3. **BUCKET_NAME**：在 OBS 控制台创建的桶名称

#### OBS 对象路径

上传后的 OBS 对象路径结构：

```
{bucket}/evaluation_reports/batch_20260224_165307/
├── abs.md                    # 开发日志
├── abs-evaluation.md         # 评估报告
├── summary.md                # 汇总报告
├── meta.json                 # 批次元数据
└── evaluations/              # 评估结果目录
    └── *.json                # JSON 评估数据
```

## 环境要求

- Python 3.10+
- PyYAML
- Claude Code CLI（需要单独安装）
- esdk-obs-python（可选，OBS 上传功能需要）

## 核心设计

### 串行开发

算子开发采用串行模式，确保每个算子开发完成后才开始下一个，避免资源竞争。

### 并行评估

日志评估采用并行模式，使用 `ThreadPoolExecutor` 同时处理多个日志文件。

### 批次管理

每次运行生成唯一批次 ID（格式：`YYYYMMDD_HHMMSS`），相关日志组织到 `logs/batch_{id}/` 目录。

## 输出目录

```
logs/
└── batch_20260115_094732/
    ├── meta.json              # 批次元数据
    ├── OP001_abs.md           # 开发日志
    ├── OP001_abs-meta.json    # 日志元数据
    ├── OP001_abs-evaluation.md # 评估报告
    └── evaluations/           # 评估结果目录
```

## License

Copyright © 2026
