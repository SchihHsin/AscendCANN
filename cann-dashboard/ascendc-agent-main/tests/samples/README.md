## README

为了暂时规避参考示例代码中工程构建和测试 和 环境配置 以及和 optest 不匹配的问题，暂时提供如下两个文件：

- `add_plan.yaml` ：为 AddKernelInvocationNeo 示例工程写的 optest 测试用例
- `run_entry.sh`  ：给 AddKernelInvocationNeo 示例工程的构建与执行入口，删掉了原有的 `run.sh` 中的老的测试执行方式

需要将这两个文件拷贝示例目录下： samples/operator/ascendc/0_introduction/3_add_kernellaunch/AddKernelInvocationNeo