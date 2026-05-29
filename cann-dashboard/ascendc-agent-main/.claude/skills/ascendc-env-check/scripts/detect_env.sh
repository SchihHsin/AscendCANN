#!/bin/bash
# 环境自动探测脚本 —— 输出 key=value 格式供 agent 解析
# 用途：动态获取当前环境信息，替代硬编码的服务器型号和 CANN 版本
# 使用：./env_setup.sh "bash .claude/skills/ascendc-env-check/scripts/detect_env.sh"

# CANN 版本：从 ASCEND_HOME_PATH 提取
if [ -n "$ASCEND_HOME_PATH" ]; then
    CANN_VERSION=$(basename "$ASCEND_HOME_PATH" | sed 's/cann-//')
else
    cann_dir=$(ls -d /usr/local/Ascend/cann-* 2>/dev/null | head -1)
    CANN_VERSION=$(basename "$cann_dir" 2>/dev/null | sed 's/cann-//')
fi

# 芯片名称：从 npu-smi info 提取
CHIP_NAME=$(npu-smi info 2>/dev/null | grep -oP '\d+\s+\K(910\w+|310\w+|950\w+)' | head -1)

# 驱动版本
DRIVER_VERSION=$(grep '^Version=' /usr/local/Ascend/driver/version.info 2>/dev/null | cut -d= -f2)

# npu-arch 映射
case "$CHIP_NAME" in
    910B*|910_93) NPU_ARCH="dav-2201" ;;
    310P*)        NPU_ARCH="dav-2002" ;;
    310B*)        NPU_ARCH="dav-3002" ;;
    950*|910PR*)  NPU_ARCH="dav-3510" ;;
    *)            NPU_ARCH="unknown"  ;;
esac

# Card ID（取第一个可用设备）
CARD_ID=$(npu-smi info 2>/dev/null | grep -oP '^\|\s+\K\d+(?=\s+\d+)' | head -1)

# 输出结构化信息
echo "CANN_VERSION=$CANN_VERSION"
echo "CHIP_NAME=$CHIP_NAME"
echo "NPU_ARCH=$NPU_ARCH"
echo "DRIVER_VERSION=$DRIVER_VERSION"
echo "ASCEND_HOME_PATH=$ASCEND_HOME_PATH"
echo "ASCEND_OPP_PATH=$ASCEND_OPP_PATH"
echo "CARD_ID=$CARD_ID"
