---
name: ascendc-docker
description: Ascend C 算子开发 Docker 环境使用指南。包含 env_setup.sh 脚本使用方法（单条命令/多条命令）、容器内环境配置、严格禁止事项、常用命令示例。
---

# Docker 环境使用

## ⚠️ 重要：执行位置要求

**`./env_setup.sh` 必须在项目根目录（包含 `env_setup.sh` 文件的目录）执行！**

## 重要原则

**所有构建和测试操作必须先通过 `./env_setup.sh` 进入 Docker 容器后执行。**

---

## 进入容器的方式

### 方式1：执行单条命令（Agent使用）

```bash
# ⚠️ 确保在项目根目录！
./env_setup.sh "命令"

# 示例：查看ops目录
./env_setup.sh "ls -la ops/"

# 示例：构建算子
./env_setup.sh "cd ops/my_operator && mkdir -p build && cd build && cmake .. && make -j"
```

### 方式2：执行多条命令（Agent使用）

```bash
# ⚠️ 确保在项目根目录！
./env_setup.sh "
  cd ops/my_operator && \
  rm -rf build && mkdir -p build && cd build && \
  cmake .. -DCMAKE_BUILD_TYPE=Release && \
  make -j
"
```

---

## 容器内环境

进入容器后：
- 工作目录为 `/ascendc-agent`
- `ops` 目录绝对路径：`/ascendc-agent/ops`
- 所有算子开发操作都在容器内进行
- 容器内已配置好所有必要的环境变量

---

## 严格禁止

- ❌ 直接使用 `docker run` 等命令
- ❌ 绕过 `./env_setup.sh` 脚本

**必须**：通过 `./env_setup.sh` 脚本进入容器。

---

## 常用命令示例

### 查看目录结构
```bash
./env_setup.sh "ls -la ops/"
```

### 构建算子

**CMakeLists.txt 中 `--npu-arch` 设置**：
```bash
npu-smi info  # 查看 NPU 型号
```
通过 `npu-smi info` 查看芯片型号，再参考 `/ascendc-npu-arch` 映射表确定 `--npu-arch` 值。

快速探测：
```bash
./env_setup.sh "bash .claude/skills/ascendc-env-check/scripts/detect_env.sh"
```

```bash
./env_setup.sh "cd ops/my_operator && mkdir -p build && cd build && cmake .. && make -j"
```

### 清理构建
```bash
./env_setup.sh "cd ops/my_operator && rm -rf build"
```

### 运行测试
```bash
./env_setup.sh "cd ops/my_operator/build && ./my_operator"
```
