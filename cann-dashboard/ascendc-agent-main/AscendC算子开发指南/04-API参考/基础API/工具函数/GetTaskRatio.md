# GetTaskRatio

## 产品支持情况

| 产品 | 是否支持 |
| --- | --- |
| Atlas A3 训练系列产品/Atlas A3 推理系列产品 | √ |
| Atlas A2 训练系列产品/Atlas A2 推理系列产品 | √ |
| Atlas 200I/500 A2 推理产品 | x |
| Atlas 推理系列产品AI Core | √ |
| Atlas 推理系列产品Vector Core | x |
| Atlas 训练系列产品 | x |

## 功能说明

[分离模式](基本架构.md#section1574769433)下，获取一个AI Core上Cube Core（AIC）或者Vector Core（AIV）的数量与AI Core数量的比例。耦合模式下，固定返回1。

## 函数原型

```
__aicore__ inline int64_t GetTaskRatio()
```

## 参数说明

无

## 返回值说明

-   针对[分离模式](基本架构.md#section1574769433)，不同Kernel类型下（通过[设置Kernel类型](设置Kernel类型.md)接口设置），在AIC和AIV上调用该接口的返回值如下：

    **表 1**  返回值列表

| Kernel类型 | KERNEL_TYPE_AIV_ONLY | KERNEL_TYPE_AIC_ONLY | KERNEL_TYPE_MIX_AIC_1_2 | KERNEL_TYPE_MIX_AIC_1_1 | KERNEL_TYPE_MIX_AIC_1_0 | KERNEL_TYPE_MIX_AIV_1_0 |
| --- | --- | --- | --- | --- | --- | --- |
| AIV | 1 | - | 2 | 1 | - | 1 |
| AIC | - | 1 | 1 | 1 | 1 | - |

-   针对[耦合模式](基本架构.md#section1574769433)，固定返回1。

## 约束说明

无

## 调用示例

```
uint64_t ratio = AscendC::GetTaskRatio();
AscendC::PRINTF("task ratio is %u", ratio);
```
