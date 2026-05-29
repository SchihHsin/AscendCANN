# SetMaskNorm

## 产品支持情况

| 产品 | 是否支持 |
| --- | --- |
| Atlas A3 训练系列产品/Atlas A3 推理系列产品 | √ |
| Atlas A2 训练系列产品/Atlas A2 推理系列产品 | √ |
| Atlas 200I/500 A2 推理产品 | √ |
| Atlas 推理系列产品AI Core | √ |
| Atlas 推理系列产品Vector Core | x |
| Atlas 训练系列产品 | x |

## 功能说明

设置mask模式为Normal模式。该模式为系统默认模式，支持开发者配置迭代次数。mask模式分为Counter模式和Normal模式，两种模式的概念和使用场景请参考[如何使用掩码操作API](如何使用掩码操作API.md)。Normal模式的设置和使用流程请参考[如何使用掩码操作API](如何使用掩码操作API.md)。

## 函数原型

```
__aicore__ inline void SetMaskNorm()
```

## 参数说明

无

## 返回值说明

无

## 约束说明

无

## 调用示例

请参考[Normal模式调用示例](SetVectorMask.md#li7648351102813)。
