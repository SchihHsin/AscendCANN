# TensorDesc简介

TensorDesc用于储存[ListTensorDesc](ListTensorDesc.md).GetDesc\(\)中根据index获取对应的Tensor描述信息。

## 原型定义

```
template<class T> class TensorDesc {
    TensorDesc();
    ~TensorDesc();
    void SetShapeAddr(uint64_t* shapePtr);
    uint64_t GetDim();
    uint64_t GetIndex();
    uint64_t GetShape(uint32_t offset);
    T* GetDataPtr();
    GlobalTensor<T> GetDataObj();
}
```

## 模板参数

**表 1**  模板参数说明

| 参数名 | 描述 |
| --- | --- |
| T | Tensor数据类型。 |

## 成员函数

```
[TensorDesc](构造和析构函数-113.md)()
[~TensorDesc](构造和析构函数-113.md)()
void [SetShapeAddr](SetShapeAddr.md)(uint64_t* shapePtr)
uint64_t [GetDim](GetDim.md)()
uint64_t [GetIndex](GetIndex.md)()
uint64_t [GetShape](GetShape-114.md)(uint32_t offset)
T* [GetDataPtr](GetDataPtr.md)()
GlobalTensor<T> [GetDataObj](GetDataObj.md)()
```
