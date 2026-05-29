#!/usr/bin/env bash

# ==============================================================================
# Ascend C 开发环境启动脚本
# 功能：自动进入Docker容器，使用与手动docker run相同的配置
#
# 使用方式：
#   交互式进入容器（NPU模式）：./env_setup.sh
#   交互式进入容器（CPU模式）：./env_setup.sh --mode cpu
#   Agent执行命令（NPU模式）：./env_setup.sh "命令"
#   Agent执行命令（CPU模式）：./env_setup.sh --mode cpu "命令"
#   指定容器名称（支持并行）：./env_setup.sh --name my_container "命令"
#   指定NPU设备ID（并行开发）：./env_setup.sh --device-id 1 "命令"
#
# 支持的参数：
#   --mode <cpu|npu>      指定运行模式，默认为 npu
#   --name <name>         指定容器名称，默认为 cann_container（支持并行时使用不同名称）
#   --device-id <0|1|2|3> 指定使用的 NPU 设备 ID，用于并行开发（默认不指定，使用所有卡）
# ==============================================================================

# =============================================================================
# 配置区域 - 修改这些变量以适应你的环境
# =============================================================================

# Docker 镜像名称 - 修改这里可以更换使用不同的镜像
DOCKER_IMAGE="ascendc-optest:latest"

# =============================================================================
# 以下为脚本内部逻辑，一般不需要修改
# =============================================================================

set -e

# 获取脚本所在目录的绝对路径（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() {
    echo -e "${GREEN}[INFO]${NC} $@"
}

error() {
    echo -e "${RED}[ERROR]${NC} $@" >&2
}

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker first."
    exit 1
fi

# 解析命令行参数
MODE="npu"  # 默认 NPU 模式
CONTAINER_NAME="cann_container"  # 默认容器名称
DEVICE_ID=""  # 默认不指定设备 ID（使用所有卡）
COMMAND_TO_RUN=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --mode)
            if [[ -z "$2" ]] || [[ ! "$2" =~ ^(cpu|npu)$ ]]; then
                error "Invalid mode: $2. Use 'cpu' or 'npu'."
                exit 1
            fi
            MODE="$2"
            shift 2
            ;;
        --name)
            if [[ -z "$2" ]]; then
                error "Missing container name after --name"
                exit 1
            fi
            CONTAINER_NAME="$2"
            shift 2
            ;;
        --device-id)
            if [[ -z "$2" ]] || [[ ! "$2" =~ ^[0-3]$ ]]; then
                error "Invalid device-id: $2. Use 0, 1, 2, or 3."
                exit 1
            fi
            DEVICE_ID="$2"
            shift 2
            ;;
        *)
            # 剩余参数作为要执行的命令
            COMMAND_TO_RUN="$*"
            break
            ;;
    esac
done

# ==============================================================================
# 并行模式容器名称处理
# 如果设置了 ASCEND_DEVICE_ID 环境变量（由 Orchestrator 传递），
# 且未通过 --name 显式指定容器名，则自动生成唯一容器名
# ==============================================================================
if [[ -n "$ASCEND_DEVICE_ID" ]] && [[ "$CONTAINER_NAME" == "cann_container" ]]; then
    # 使用设备 ID 生成唯一容器名
    CONTAINER_NAME="cann_container_device_${ASCEND_DEVICE_ID}"
    info "并行模式: 使用容器名 $CONTAINER_NAME (设备 $ASCEND_DEVICE_ID)"
fi

# 检查镜像是否存在，如果不存在则构建
if ! docker image inspect "$DOCKER_IMAGE" > /dev/null 2>&1; then
    if [ -n "$COMMAND_TO_RUN" ]; then
        # Agent 模式：自动构建
        info "Docker image '$DOCKER_IMAGE' not found. Building automatically..."
        if ! docker build -t "$DOCKER_IMAGE" "${PROJECT_ROOT}"; then
            error "Failed to build Docker image."
            exit 1
        fi
        info "Docker image built successfully."
    else
        # 交互模式：询问用户
        error "Docker image '$DOCKER_IMAGE' not found."
        read -p "是否自动构建镜像? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            info "Building Docker image..."
            if ! docker build -t "$DOCKER_IMAGE" "${PROJECT_ROOT}"; then
                error "Failed to build Docker image."
                exit 1
            fi
            info "Docker image built successfully."
        else
            echo "请手动构建: docker build -t $DOCKER_IMAGE ."
            exit 1
        fi
    fi
fi

# 检测是否有TTY和是否需要执行命令
NEED_TTY=0
if [ -z "$COMMAND_TO_RUN" ]; then
    # 没有命令参数，需要交互式终端
    if [ -t 0 ] && [ -t 1 ]; then
        NEED_TTY=1
        info "Starting Ascend C development container (interactive mode)..."
    fi
else
    # 有命令参数，非交互模式
    info "Running command in container: $COMMAND_TO_RUN"
fi

# 构建docker run参数
if [ $NEED_TTY -eq 1 ]; then
    DOCKER_TTY="-it"
else
    DOCKER_TTY=""
fi

# 构建容器内执行的命令
if [ -n "$COMMAND_TO_RUN" ]; then
    # Agent模式：直接使用容器内已配置好的环境变量
    INNER_CMD="cd /ascendc-agent && $COMMAND_TO_RUN"
else
    # 交互模式：显示信息并启动shell
    INNER_CMD="cd /ascendc-agent && bash -l"
fi

# 如果指定了设备 ID，设置 ASCEND_VISIBLE_DEVICES 环境变量
if [ -n "$DEVICE_ID" ]; then
    info "Device ID: $DEVICE_ID (setting ASCEND_VISIBLE_DEVICES=$DEVICE_ID)"
    INNER_CMD="export ASCEND_VISIBLE_DEVICES=$DEVICE_ID && $INNER_CMD"
fi

# ==============================================================================
# 根据模式配置 NPU 设备挂载
# ==============================================================================

NPU_DEVICE_ARGS=()
NPU_MOUNT_ARGS=()

if [[ "$MODE" == "npu" ]]; then
    # NPU 模式：挂载所有 NPU 设备和目录
    NPU_DEVICE_ARGS=(
        --device /dev/davinci1
        --device /dev/davinci_manager
        --device /dev/devmm_svm
        --device /dev/hisi_hdc
    )
    NPU_MOUNT_ARGS=(
        -v /usr/local/dcmi:/usr/local/dcmi
        -v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi
        -v /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/
        -v /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info
        -v /etc/ascend_install.info:/etc/ascend_install.info
    )
    info "Mode: NPU - mounting NPU devices and drivers"
else
    # CPU 模式：不挂载 NPU 设备
    info "Mode: CPU - skipping NPU devices"
fi

# ==============================================================================
# 启动容器
# ==============================================================================
docker run $DOCKER_TTY --rm \
  --name "$CONTAINER_NAME" \
  --network host \
  --security-opt seccomp=unconfined \
  "${NPU_DEVICE_ARGS[@]}" \
  "${NPU_MOUNT_ARGS[@]}" \
  -v "${PROJECT_ROOT}:/ascendc-agent" \
  -w /ascendc-agent \
  "$DOCKER_IMAGE" \
  bash -c "$INNER_CMD"

if [ $NEED_TTY -eq 1 ]; then
    info "Exited from container."
fi
