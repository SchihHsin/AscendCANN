# UpdateKfcWorkspace

## 产品支持情况

| 产品 | 是否支持 |
| --- | --- |
| Atlas A3 训练系列产品/Atlas A3 推理系列产品 | x |
| Atlas A2 训练系列产品/Atlas A2 推理系列产品 | √ |
| Atlas 200I/500 A2 推理产品 | x |
| Atlas 推理系列产品AI Core | x |
| Atlas 推理系列产品Vector Core | x |
| Atlas 训练系列产品 | x |

## 功能说明

更新用于CubeResGroupHandle消息通信区的内存地址。用户使用[CubeResGroupHandle](CubeResGroupHandle构造函数.md)接口时，需要用此接口自主管理空间地址。

## 函数原型

```
__aicore__ inline void UpdateKfcWorkspace(uint32_t offset)
```

## 参数说明

**表 1**  接口参数说明

| 参数 | 输入/输出 | 说明 |
| --- | --- | --- |
| offset | 输入 | 更新workspace地址为原地址偏移offset后的地址。 |

## 返回值说明

无。

## 约束说明

本接口不能和[CreateCubeResGroup](CreateCubeResGroup.md)接口同时使用。

## 调用示例

```
AscendC::KfcWorkspace desc(workspaceGM);
desc.UpdateKfcWorkspace(1024);
```
