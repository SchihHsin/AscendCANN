# SetAddrWithOffset

## 产品支持情况

| 产品 | 是否支持 |
| --- | --- |
| Atlas A3 训练系列产品/Atlas A3 推理系列产品 | √ |
| Atlas A2 训练系列产品/Atlas A2 推理系列产品 | √ |
| Atlas 200I/500 A2 推理产品 | √ |
| Atlas 推理系列产品AI Core | √ |
| Atlas 推理系列产品Vector Core | √ |
| Atlas 训练系列产品 | √ |

## 功能说明

设置带有偏移的Tensor地址。用于快速获取定义一个Tensor，同时指定新Tensor相对于旧Tensor首地址的偏移。偏移的长度为旧Tensor的元素个数。

## 函数原型

```
template <typename S>
__aicore__ inline void SetAddrWithOffset(LocalTensor<S> &src, uint32_t offset)
```

## 参数说明

**表 1**  参数说明

| 参数名 | 输入/输出 | 描述 |
| --- | --- | --- |
| src | 输入 | 基础地址的Tensor，将该Tensor的地址作为基础地址，设置偏移后的Tensor地址。 |
| offset | 输入 | 偏移的长度，单位为元素。 |

## 返回值说明

无

## 约束说明

无

## 调用示例

参考[调用示例](LocalTensor构造函数.md#section17531157161314)。
