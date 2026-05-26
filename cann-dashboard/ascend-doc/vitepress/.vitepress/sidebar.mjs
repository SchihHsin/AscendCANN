export default {
  "/guide/": [
    {
      "text": "入门教程",
      "collapsed": true,
      "items": [
        {
          "text": "环境准备",
          "link": "/guide/入门教程/环境准备"
        },
        {
          "text": "Ascend-C概述与学习路径",
          "link": "/guide/入门教程/Ascend-C概述与学习路径"
        },
        {
          "text": "快速入门",
          "collapsed": true,
          "items": [
            {
              "text": "异构系统与编程模型",
              "link": "/guide/入门教程/快速入门/异构系统与编程模型"
            },
            {
              "text": "基于SIMD编程",
              "collapsed": true,
              "items": [
                {
                  "text": "基于SIMD编程",
                  "link": "/guide/入门教程/快速入门/基于SIMD编程/基于SIMD编程"
                },
                {
                  "text": "Add自定义算子开发",
                  "link": "/guide/入门教程/快速入门/基于SIMD编程/Add自定义算子开发"
                },
                {
                  "text": "HelloWorld",
                  "link": "/guide/入门教程/快速入门/基于SIMD编程/HelloWorld"
                }
              ]
            },
            {
              "text": "基于SIMT编程",
              "collapsed": true,
              "items": [
                {
                  "text": "基于SIMT编程",
                  "link": "/guide/入门教程/快速入门/基于SIMT编程/基于SIMT编程"
                },
                {
                  "text": "Add自定义算子开发",
                  "link": "/guide/入门教程/快速入门/基于SIMT编程/Add自定义算子开发"
                },
                {
                  "text": "HelloWorld",
                  "link": "/guide/入门教程/快速入门/基于SIMT编程/HelloWorld"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "text": "编程指南",
      "collapsed": true,
      "items": [
        {
          "text": "本文档组织结构",
          "link": "/guide/编程指南/本文档组织结构"
        },
        {
          "text": "编程模型",
          "collapsed": true,
          "items": [
            {
              "text": "编程模型",
              "link": "/guide/编程指南/编程模型/编程模型"
            },
            {
              "text": "编程模型概述",
              "link": "/guide/编程指南/编程模型/编程模型概述"
            },
            {
              "text": "异构系统",
              "link": "/guide/编程指南/编程模型/异构系统"
            },
            {
              "text": "AI-CPU编程",
              "link": "/guide/编程指南/编程模型/AI-CPU编程"
            },
            {
              "text": "AI-Core-SIMD编程",
              "collapsed": true,
              "items": [
                {
                  "text": "抽象硬件架构",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMD编程/抽象硬件架构"
                },
                {
                  "text": "概述",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMD编程/概述"
                },
                {
                  "text": "核函数",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMD编程/核函数"
                },
                {
                  "text": "AI-Core-SIMD编程",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMD编程/AI-Core-SIMD编程"
                },
                {
                  "text": "基于指针的C语言编程",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "基于语言扩展层C-API编程",
                      "link": "/guide/编程指南/编程模型/AI-Core-SIMD编程/基于指针的C语言编程/基于语言扩展层C-API编程"
                    }
                  ]
                },
                {
                  "text": "基于Tensor的C++编程",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "静态Tensor编程",
                      "link": "/guide/编程指南/编程模型/AI-Core-SIMD编程/基于Tensor的C++编程/静态Tensor编程"
                    },
                    {
                      "text": "Reg矢量计算编程",
                      "link": "/guide/编程指南/编程模型/AI-Core-SIMD编程/基于Tensor的C++编程/Reg矢量计算编程"
                    }
                  ]
                },
                {
                  "text": "基于TPipe-TQue框架编程",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "TPipe-TQue框架编程范式",
                      "link": "/guide/编程指南/编程模型/AI-Core-SIMD编程/基于TPipe-TQue框架编程/TPipe-TQue框架编程范式"
                    },
                    {
                      "text": "TPipe-TQue框架编程原理",
                      "link": "/guide/编程指南/编程模型/AI-Core-SIMD编程/基于TPipe-TQue框架编程/TPipe-TQue框架编程原理"
                    }
                  ]
                }
              ]
            },
            {
              "text": "AI-Core-SIMT编程",
              "collapsed": true,
              "items": [
                {
                  "text": "编程示例",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMT编程/编程示例"
                },
                {
                  "text": "抽象硬件架构",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMT编程/抽象硬件架构"
                },
                {
                  "text": "概述",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMT编程/概述"
                },
                {
                  "text": "核函数",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMT编程/核函数"
                },
                {
                  "text": "内存层级",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMT编程/内存层级"
                },
                {
                  "text": "同步机制",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMT编程/同步机制"
                },
                {
                  "text": "线程架构",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMT编程/线程架构"
                },
                {
                  "text": "AI-Core-SIMT编程",
                  "link": "/guide/编程指南/编程模型/AI-Core-SIMT编程/AI-Core-SIMT编程"
                }
              ]
            }
          ]
        },
        {
          "text": "编译与运行",
          "collapsed": true,
          "items": [
            {
              "text": "编译与运行",
              "link": "/guide/编程指南/编译与运行/编译与运行"
            },
            {
              "text": "异步执行",
              "link": "/guide/编程指南/编译与运行/异步执行"
            },
            {
              "text": "算子编译",
              "collapsed": true,
              "items": [
                {
                  "text": "毕昇编译器",
                  "link": "/guide/编程指南/编译与运行/算子编译/毕昇编译器"
                },
                {
                  "text": "约束说明",
                  "link": "/guide/编程指南/编译与运行/算子编译/约束说明"
                },
                {
                  "text": "AI-Core算子编译基本用法",
                  "link": "/guide/编程指南/编译与运行/算子编译/AI-Core算子编译基本用法"
                },
                {
                  "text": "AI-CPU算子编译基本用法",
                  "link": "/guide/编程指南/编译与运行/算子编译/AI-CPU算子编译基本用法"
                },
                {
                  "text": "RTC运行时编译",
                  "link": "/guide/编程指南/编译与运行/算子编译/RTC运行时编译"
                }
              ]
            }
          ]
        },
        {
          "text": "调试调优",
          "collapsed": true,
          "items": [
            {
              "text": "调试调优",
              "link": "/guide/编程指南/调试调优/调试调优"
            },
            {
              "text": "概述",
              "link": "/guide/编程指南/调试调优/概述"
            },
            {
              "text": "性能调优",
              "link": "/guide/编程指南/调试调优/性能调优"
            },
            {
              "text": "功能调试",
              "collapsed": true,
              "items": [
                {
                  "text": "功能调试",
                  "link": "/guide/编程指南/调试调优/功能调试/功能调试"
                },
                {
                  "text": "CPU域孪生调试",
                  "link": "/guide/编程指南/调试调优/功能调试/CPU域孪生调试"
                },
                {
                  "text": "NPU域上板调试",
                  "link": "/guide/编程指南/调试调优/功能调试/NPU域上板调试"
                }
              ]
            }
          ]
        },
        {
          "text": "附录",
          "collapsed": true,
          "items": [
            {
              "text": "基于样例工程完成Kernel直调",
              "link": "/guide/编程指南/附录/基于样例工程完成Kernel直调"
            },
            {
              "text": "简易自定义算子工程",
              "link": "/guide/编程指南/附录/简易自定义算子工程"
            },
            {
              "text": "msobjdump工具",
              "link": "/guide/编程指南/附录/msobjdump工具"
            },
            {
              "text": "show_kernel_debug_data工具",
              "link": "/guide/编程指南/附录/show_kernel_debug_data工具"
            },
            {
              "text": "常用操作",
              "collapsed": true,
              "items": [
                {
                  "text": "如何进行Tiling调测",
                  "link": "/guide/编程指南/附录/常用操作/如何进行Tiling调测"
                },
                {
                  "text": "如何开发动态输入算子",
                  "link": "/guide/编程指南/附录/常用操作/如何开发动态输入算子"
                },
                {
                  "text": "如何使用Tensor原地操作提升算子性能",
                  "link": "/guide/编程指南/附录/常用操作/如何使用Tensor原地操作提升算子性能"
                },
                {
                  "text": "如何使用workspace",
                  "link": "/guide/编程指南/附录/常用操作/如何使用workspace"
                },
                {
                  "text": "如何在矢量编程时使能Vector-Core",
                  "link": "/guide/编程指南/附录/常用操作/如何在矢量编程时使能Vector-Core"
                }
              ]
            },
            {
              "text": "FAQ",
              "collapsed": true,
              "items": [
                {
                  "text": "调用算子时出现无法打开config-ini的报错",
                  "link": "/guide/编程指南/附录/FAQ/调用算子时出现无法打开config-ini的报错"
                },
                {
                  "text": "含有Matmul高阶API的算子精度问题",
                  "link": "/guide/编程指南/附录/FAQ/含有Matmul高阶API的算子精度问题"
                },
                {
                  "text": "核函数运行验证时算子存在精度问题",
                  "link": "/guide/编程指南/附录/FAQ/核函数运行验证时算子存在精度问题"
                },
                {
                  "text": "算子包部署时出现权限不足报错",
                  "link": "/guide/编程指南/附录/FAQ/算子包部署时出现权限不足报错"
                },
                {
                  "text": "算子工程编译时出现文件名过长报错",
                  "link": "/guide/编程指南/附录/FAQ/算子工程编译时出现文件名过长报错"
                },
                {
                  "text": "运行验证时AllocTensor-FreeTensor失败",
                  "link": "/guide/编程指南/附录/FAQ/运行验证时AllocTensor-FreeTensor失败"
                },
                {
                  "text": "Kernel编译时报错-error-out-of-jump-jumpc-imm-range",
                  "link": "/guide/编程指南/附录/FAQ/Kernel编译时报错-error-out-of-jump-jumpc-imm-range"
                },
                {
                  "text": "kernel侧获取Tiling信息不正确",
                  "link": "/guide/编程指南/附录/FAQ/kernel侧获取Tiling信息不正确"
                }
              ]
            }
          ]
        },
        {
          "text": "高级编程",
          "collapsed": true,
          "items": [
            {
              "text": "高级特性",
              "collapsed": true,
              "items": [
                {
                  "text": "算子入图开发",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "概述",
                      "link": "/guide/编程指南/高级编程/高级特性/算子入图开发/概述"
                    },
                    {
                      "text": "基本开发流程",
                      "link": "/guide/编程指南/高级编程/高级特性/算子入图开发/基本开发流程"
                    },
                    {
                      "text": "使能Tiling下沉",
                      "link": "/guide/编程指南/高级编程/高级特性/算子入图开发/使能Tiling下沉"
                    },
                    {
                      "text": "图编译和图执行",
                      "link": "/guide/编程指南/高级编程/高级特性/算子入图开发/图编译和图执行"
                    },
                    {
                      "text": "SuperKernel开发",
                      "link": "/guide/编程指南/高级编程/高级特性/算子入图开发/SuperKernel开发"
                    }
                  ]
                },
                {
                  "text": "Aclnn算子工程化开发",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "创建算子工程",
                      "link": "/guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/创建算子工程"
                    },
                    {
                      "text": "单算子API调用",
                      "link": "/guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/单算子API调用"
                    },
                    {
                      "text": "概述",
                      "link": "/guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/概述"
                    },
                    {
                      "text": "算子动态库和静态库编译",
                      "link": "/guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/算子动态库和静态库编译"
                    },
                    {
                      "text": "算子工程编译拓展",
                      "link": "/guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/算子工程编译拓展"
                    },
                    {
                      "text": "算子原型定义",
                      "link": "/guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/算子原型定义"
                    },
                    {
                      "text": "Kernel侧算子实现",
                      "link": "/guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Kernel侧算子实现"
                    }
                  ]
                },
                {
                  "text": "AI框架算子适配",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "概述",
                      "link": "/guide/编程指南/高级编程/高级特性/AI框架算子适配/概述"
                    },
                    {
                      "text": "PyTorch框架",
                      "link": "/guide/编程指南/高级编程/高级特性/AI框架算子适配/PyTorch框架"
                    },
                    {
                      "text": "TensorFlow框架",
                      "link": "/guide/编程指南/高级编程/高级特性/AI框架算子适配/TensorFlow框架"
                    }
                  ]
                }
              ]
            },
            {
              "text": "高级AI-Core编程模型",
              "collapsed": true,
              "items": [
                {
                  "text": "SIMD与SIMT混合编程",
                  "link": "/guide/编程指南/高级编程/高级AI-Core编程模型/SIMD与SIMT混合编程"
                }
              ]
            },
            {
              "text": "硬件实现",
              "collapsed": true,
              "items": [
                {
                  "text": "基本架构",
                  "link": "/guide/编程指南/高级编程/硬件实现/基本架构"
                },
                {
                  "text": "硬件实现",
                  "link": "/guide/编程指南/高级编程/硬件实现/硬件实现"
                },
                {
                  "text": "架构规格",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "架构规格",
                      "link": "/guide/编程指南/高级编程/硬件实现/架构规格/架构规格"
                    },
                    {
                      "text": "NPU架构版本2002",
                      "link": "/guide/编程指南/高级编程/硬件实现/架构规格/NPU架构版本2002"
                    },
                    {
                      "text": "NPU架构版本2201",
                      "link": "/guide/编程指南/高级编程/硬件实现/架构规格/NPU架构版本2201"
                    },
                    {
                      "text": "NPU架构版本3002",
                      "link": "/guide/编程指南/高级编程/硬件实现/架构规格/NPU架构版本3002"
                    },
                    {
                      "text": "NPU架构版本3510",
                      "link": "/guide/编程指南/高级编程/硬件实现/架构规格/NPU架构版本3510"
                    }
                  ]
                },
                {
                  "text": "硬件约束",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "NPU架构版本2002",
                      "link": "/guide/编程指南/高级编程/硬件实现/硬件约束/NPU架构版本2002"
                    },
                    {
                      "text": "NPU架构版本2201",
                      "link": "/guide/编程指南/高级编程/硬件实现/硬件约束/NPU架构版本2201"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "text": "类库API",
          "collapsed": true,
          "items": [
            {
              "text": "编程接口概述",
              "link": "/guide/编程指南/类库API/编程接口概述"
            },
            {
              "text": "类库API",
              "link": "/guide/编程指南/类库API/类库API"
            },
            {
              "text": "Utils-API",
              "link": "/guide/编程指南/类库API/Utils-API"
            },
            {
              "text": "高阶API",
              "collapsed": true,
              "items": [
                {
                  "text": "概述",
                  "link": "/guide/编程指南/类库API/高阶API/概述"
                },
                {
                  "text": "常用操作速查指导",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "如何使用Kernel侧临时空间",
                      "link": "/guide/编程指南/类库API/高阶API/常用操作速查指导/如何使用Kernel侧临时空间"
                    },
                    {
                      "text": "如何使用Tiling依赖的头文件",
                      "link": "/guide/编程指南/类库API/高阶API/常用操作速查指导/如何使用Tiling依赖的头文件"
                    }
                  ]
                }
              ]
            },
            {
              "text": "基础API",
              "collapsed": true,
              "items": [
                {
                  "text": "概述",
                  "link": "/guide/编程指南/类库API/基础API/概述"
                },
                {
                  "text": "常用操作速查指导",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "如何使用归约计算API",
                      "link": "/guide/编程指南/类库API/基础API/常用操作速查指导/如何使用归约计算API"
                    },
                    {
                      "text": "如何使用掩码操作API",
                      "link": "/guide/编程指南/类库API/基础API/常用操作速查指导/如何使用掩码操作API"
                    }
                  ]
                },
                {
                  "text": "接口分类说明",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "高维切分API",
                      "link": "/guide/编程指南/类库API/基础API/接口分类说明/高维切分API"
                    },
                    {
                      "text": "连续计算API",
                      "link": "/guide/编程指南/类库API/基础API/接口分类说明/连续计算API"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "text": "语言扩展层",
          "collapsed": true,
          "items": [
            {
              "text": "语言扩展层",
              "link": "/guide/编程指南/语言扩展层/语言扩展层"
            },
            {
              "text": "SIMD-BuiltIn关键字",
              "link": "/guide/编程指南/语言扩展层/SIMD-BuiltIn关键字"
            },
            {
              "text": "SIMD语言扩展层C-API",
              "link": "/guide/编程指南/语言扩展层/SIMD语言扩展层C-API"
            },
            {
              "text": "SIMT-BuiltIn关键字",
              "link": "/guide/编程指南/语言扩展层/SIMT-BuiltIn关键字"
            },
            {
              "text": "SIMT语言扩展层C-API",
              "link": "/guide/编程指南/语言扩展层/SIMT语言扩展层C-API"
            }
          ]
        }
      ]
    },
    {
      "text": "算子实践参考",
      "collapsed": true,
      "items": [
        {
          "text": "本文档组织结构",
          "link": "/guide/算子实践参考/本文档组织结构"
        },
        {
          "text": "异构计算",
          "link": "/guide/算子实践参考/异构计算"
        },
        {
          "text": "典型算子实践案例",
          "collapsed": true,
          "items": [
            {
              "text": "典型算子实践案例",
              "link": "/guide/算子实践参考/典型算子实践案例/典型算子实践案例"
            },
            {
              "text": "SIMD算子实现",
              "collapsed": true,
              "items": [
                {
                  "text": "Add矢量算子实践",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "入门功能落地",
                      "link": "/guide/算子实践参考/典型算子实践案例/SIMD算子实现/Add矢量算子实践/入门功能落地"
                    }
                  ]
                },
                {
                  "text": "Matmul矩阵算子实践",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "入门功能落地",
                      "link": "/guide/算子实践参考/典型算子实践案例/SIMD算子实现/Matmul矩阵算子实践/入门功能落地"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "text": "功能调试",
          "collapsed": true,
          "items": [
            {
              "text": "功能调试",
              "link": "/guide/算子实践参考/功能调试/功能调试"
            },
            {
              "text": "精度正常",
              "link": "/guide/算子实践参考/功能调试/精度正常"
            },
            {
              "text": "算子调试",
              "link": "/guide/算子实践参考/功能调试/算子调试"
            },
            {
              "text": "运行正常",
              "link": "/guide/算子实践参考/功能调试/运行正常"
            }
          ]
        },
        {
          "text": "性能分析",
          "collapsed": true,
          "items": [
            {
              "text": "分析性能数据",
              "link": "/guide/算子实践参考/性能分析/分析性能数据"
            },
            {
              "text": "获取性能数据",
              "link": "/guide/算子实践参考/性能分析/获取性能数据"
            },
            {
              "text": "性能分析",
              "link": "/guide/算子实践参考/性能分析/性能分析"
            }
          ]
        },
        {
          "text": "优秀实践",
          "collapsed": true,
          "items": [
            {
              "text": "优秀实践",
              "link": "/guide/算子实践参考/优秀实践/优秀实践"
            },
            {
              "text": "FlashAttention算子性能调优案例",
              "link": "/guide/算子实践参考/优秀实践/FlashAttention算子性能调优案例"
            },
            {
              "text": "GroupedMatmul算子性能调优案例",
              "link": "/guide/算子实践参考/优秀实践/GroupedMatmul算子性能调优案例"
            },
            {
              "text": "MC-算子性能调优案例",
              "link": "/guide/算子实践参考/优秀实践/MC-算子性能调优案例"
            },
            {
              "text": "SIMT实现InsertHashTable算子案例",
              "link": "/guide/算子实践参考/优秀实践/SIMT实现InsertHashTable算子案例"
            },
            {
              "text": "Matmul性能调优案例",
              "collapsed": true,
              "items": [
                {
                  "text": "AIV核上的ND2NZ格式转换",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/AIV核上的ND2NZ格式转换"
                },
                {
                  "text": "Matmul高阶API使能纯Cube模式",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能纯Cube模式"
                },
                {
                  "text": "Matmul高阶API使能多核切K",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能多核切K"
                },
                {
                  "text": "Matmul高阶API使能多核K轴错峰访问内存",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能多核K轴错峰访问内存"
                },
                {
                  "text": "Matmul高阶API使能IBShare模板共享A和B矩阵数据",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能IBShare模板共享A和B矩阵数据"
                },
                {
                  "text": "Matmul高阶API使能IBShare模板共享B矩阵数据",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能IBShare模板共享B矩阵数据"
                },
                {
                  "text": "Matmul高阶API使能L2-Cache切分",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能L2-Cache切分"
                },
                {
                  "text": "Matmul高阶API使能MDL模板",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能MDL模板"
                },
                {
                  "text": "Matmul高阶API使能MTE2-Preload",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能MTE2-Preload"
                },
                {
                  "text": "Matmul高阶API使能NBuffer33模板",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能NBuffer33模板"
                },
                {
                  "text": "Matmul高阶API使能Tiling全量常量化",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能Tiling全量常量化"
                },
                {
                  "text": "Matmul高阶API使能UnitFlag",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul高阶API使能UnitFlag"
                },
                {
                  "text": "Matmul算子优化Tiling策略",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul算子优化Tiling策略"
                },
                {
                  "text": "Matmul性能优化策略总览",
                  "link": "/guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul性能优化策略总览"
                }
              ]
            }
          ]
        },
        {
          "text": "SIMD算子实现",
          "collapsed": true,
          "items": [
            {
              "text": "概述",
              "link": "/guide/算子实践参考/SIMD算子实现/概述"
            },
            {
              "text": "SIMD算子实现",
              "link": "/guide/算子实践参考/SIMD算子实现/SIMD算子实现"
            },
            {
              "text": "矩阵编程（高阶API）",
              "collapsed": true,
              "items": [
                {
                  "text": "基础知识",
                  "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/基础知识"
                },
                {
                  "text": "矩阵编程（高阶API）",
                  "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/矩阵编程（高阶API）"
                },
                {
                  "text": "算子实现",
                  "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/算子实现"
                },
                {
                  "text": "特性场景",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "4-2稀疏矩阵乘",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/4-2稀疏矩阵乘"
                    },
                    {
                      "text": "单次矩阵乘局部输出",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/单次矩阵乘局部输出"
                    },
                    {
                      "text": "多核对齐切分",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/多核对齐切分"
                    },
                    {
                      "text": "多核非对齐切分",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/多核非对齐切分"
                    },
                    {
                      "text": "矩阵乘输出的量化-反量化",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/矩阵乘输出的量化-反量化"
                    },
                    {
                      "text": "矩阵乘输出的Channel拆分",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/矩阵乘输出的Channel拆分"
                    },
                    {
                      "text": "矩阵乘输出的N方向对齐",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/矩阵乘输出的N方向对齐"
                    },
                    {
                      "text": "矩阵向量乘",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/矩阵向量乘"
                    },
                    {
                      "text": "异步场景处理",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/异步场景处理"
                    },
                    {
                      "text": "AIC和AIV独立运行机制",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/AIC和AIV独立运行机制"
                    },
                    {
                      "text": "Batch-Matmul复用Bias矩阵",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/Batch-Matmul复用Bias矩阵"
                    },
                    {
                      "text": "Batch-Matmul基础功能",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/Batch-Matmul基础功能"
                    },
                    {
                      "text": "Matmul特性介绍",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/Matmul特性介绍"
                    },
                    {
                      "text": "MxMatmul场景",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/MxMatmul场景"
                    },
                    {
                      "text": "TSCM输入的矩阵乘",
                      "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（高阶API）/特性场景/TSCM输入的矩阵乘"
                    }
                  ]
                }
              ]
            },
            {
              "text": "矩阵编程（基础API）",
              "collapsed": true,
              "items": [
                {
                  "text": "分离模式",
                  "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（基础API）/分离模式"
                },
                {
                  "text": "耦合模式",
                  "link": "/guide/算子实践参考/SIMD算子实现/矩阵编程（基础API）/耦合模式"
                }
              ]
            },
            {
              "text": "融合算子编程",
              "collapsed": true,
              "items": [
                {
                  "text": "融合算子编程",
                  "link": "/guide/算子实践参考/SIMD算子实现/融合算子编程/融合算子编程"
                },
                {
                  "text": "通算融合",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "基础知识",
                      "link": "/guide/算子实践参考/SIMD算子实现/融合算子编程/通算融合/基础知识"
                    },
                    {
                      "text": "算子实现",
                      "link": "/guide/算子实践参考/SIMD算子实现/融合算子编程/通算融合/算子实现"
                    },
                    {
                      "text": "特性场景",
                      "link": "/guide/算子实践参考/SIMD算子实现/融合算子编程/通算融合/特性场景"
                    }
                  ]
                },
                {
                  "text": "CV融合",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "基础知识",
                      "link": "/guide/算子实践参考/SIMD算子实现/融合算子编程/CV融合/基础知识"
                    },
                    {
                      "text": "算子实现",
                      "link": "/guide/算子实践参考/SIMD算子实现/融合算子编程/CV融合/算子实现"
                    }
                  ]
                }
              ]
            },
            {
              "text": "矢量编程",
              "collapsed": true,
              "items": [
                {
                  "text": "非对齐场景",
                  "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/非对齐场景"
                },
                {
                  "text": "概述",
                  "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/概述"
                },
                {
                  "text": "基础矢量算子",
                  "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/基础矢量算子"
                },
                {
                  "text": "矢量编程",
                  "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/矢量编程"
                },
                {
                  "text": "Broadcast场景",
                  "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/Broadcast场景"
                },
                {
                  "text": "DoubleBuffer场景",
                  "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/DoubleBuffer场景"
                },
                {
                  "text": "TBuf的使用",
                  "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/TBuf的使用"
                },
                {
                  "text": "多核-Tiling切分",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "多核Tiling",
                      "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/多核Tiling"
                    },
                    {
                      "text": "概述",
                      "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/概述"
                    },
                    {
                      "text": "尾核-尾块",
                      "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾核-尾块"
                    },
                    {
                      "text": "尾核Tiling",
                      "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾核Tiling"
                    },
                    {
                      "text": "尾块Tiling",
                      "link": "/guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾块Tiling"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "text": "SIMD算子性能优化",
          "collapsed": true,
          "items": [
            {
              "text": "优化建议总览表",
              "link": "/guide/算子实践参考/SIMD算子性能优化/优化建议总览表"
            },
            {
              "text": "SIMD算子性能优化",
              "link": "/guide/算子实践参考/SIMD算子性能优化/SIMD算子性能优化"
            },
            {
              "text": "矩阵计算",
              "collapsed": true,
              "items": [
                {
                  "text": "较小矩阵长驻L1-Buffer-仅分次搬运较大矩阵",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/矩阵计算/较小矩阵长驻L1-Buffer-仅分次搬运较大矩阵"
                },
                {
                  "text": "通过BT-Buffer实现高效的bias计算",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/矩阵计算/通过BT-Buffer实现高效的bias计算"
                },
                {
                  "text": "通过FP-Buffer存放量化参数实现高效随路量化",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/矩阵计算/通过FP-Buffer存放量化参数实现高效随路量化"
                },
                {
                  "text": "通过L0C-Buffer数据暂存实现高效的矩阵乘结果累加",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/矩阵计算/通过L0C-Buffer数据暂存实现高效的矩阵乘结果累加"
                },
                {
                  "text": "Matmul使能AtomicAdd选项",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/矩阵计算/Matmul使能AtomicAdd选项"
                }
              ]
            },
            {
              "text": "流水编排",
              "collapsed": true,
              "items": [
                {
                  "text": "流水编排",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/流水编排/流水编排"
                },
                {
                  "text": "使能DoubleBuffer",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/流水编排/使能DoubleBuffer"
                },
                {
                  "text": "使能Iterate或IterateAll异步接口避免AIC-AIV同步依赖",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/流水编排/使能Iterate或IterateAll异步接口避免AIC-AIV同步依赖"
                }
              ]
            },
            {
              "text": "内存访问",
              "collapsed": true,
              "items": [
                {
                  "text": "避免同地址访问",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/避免同地址访问"
                },
                {
                  "text": "纯搬运类算子VECIN和VECOUT建议复用",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/纯搬运类算子VECIN和VECOUT建议复用"
                },
                {
                  "text": "非对齐场景减少无效数据的搬运",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/非对齐场景减少无效数据的搬运"
                },
                {
                  "text": "非连续搬运场景减少搬运次数",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/非连续搬运场景减少搬运次数"
                },
                {
                  "text": "高效的使用搬运API",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/高效的使用搬运API"
                },
                {
                  "text": "尽量一次搬运较大的数据块",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/尽量一次搬运较大的数据块"
                },
                {
                  "text": "内存访问",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/内存访问"
                },
                {
                  "text": "设置合理的L2-CacheMode",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/设置合理的L2-CacheMode"
                },
                {
                  "text": "算子与高阶API共享临时Buffer",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/算子与高阶API共享临时Buffer"
                },
                {
                  "text": "通过缩减Tensor-ShapeInfo维度-优化栈空间",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/通过缩减Tensor-ShapeInfo维度-优化栈空间"
                },
                {
                  "text": "GM地址尽量512B对齐",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/GM地址尽量512B对齐"
                },
                {
                  "text": "L2-Cache切分",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/L2-Cache切分"
                },
                {
                  "text": "避免UB的bank冲突",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "避免bank冲突（NPU架构版本2201）",
                      "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/避免UB的bank冲突/避免bank冲突（NPU架构版本2201）"
                    },
                    {
                      "text": "避免bank冲突（NPU架构版本3510）",
                      "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/避免UB的bank冲突/避免bank冲突（NPU架构版本3510）"
                    },
                    {
                      "text": "避免UB的bank冲突",
                      "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/避免UB的bank冲突/避免UB的bank冲突"
                    },
                    {
                      "text": "概述",
                      "link": "/guide/算子实践参考/SIMD算子性能优化/内存访问/避免UB的bank冲突/概述"
                    }
                  ]
                }
              ]
            },
            {
              "text": "矢量计算",
              "collapsed": true,
              "items": [
                {
                  "text": "通过Unified-Buffer融合实现连续vector计算",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/矢量计算/通过Unified-Buffer融合实现连续vector计算"
                },
                {
                  "text": "选择低延迟指令-优化归约操作性能",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/矢量计算/选择低延迟指令-优化归约操作性能"
                },
                {
                  "text": "Vector算子灵活运用Counter模式",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/矢量计算/Vector算子灵活运用Counter模式"
                },
                {
                  "text": "VF性能优化",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "连续非对齐场景优化",
                      "link": "/guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/连续非对齐场景优化"
                    },
                    {
                      "text": "指令双发优化",
                      "link": "/guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/指令双发优化"
                    },
                    {
                      "text": "VF融合优化",
                      "link": "/guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/VF融合优化"
                    },
                    {
                      "text": "VF循环优化",
                      "link": "/guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/VF循环优化"
                    }
                  ]
                }
              ]
            },
            {
              "text": "头尾开销优化",
              "collapsed": true,
              "items": [
                {
                  "text": "避免TPipe在对象内创建和初始化",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/头尾开销优化/避免TPipe在对象内创建和初始化"
                },
                {
                  "text": "核函数内删除Workspace相关冗余操作",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/头尾开销优化/核函数内删除Workspace相关冗余操作"
                },
                {
                  "text": "设置合适的核数和算子Kernel类型",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/头尾开销优化/设置合适的核数和算子Kernel类型"
                },
                {
                  "text": "设置DCI编译选项来减少算子尾开销",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/头尾开销优化/设置DCI编译选项来减少算子尾开销"
                },
                {
                  "text": "头尾开销优化",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/头尾开销优化/头尾开销优化"
                },
                {
                  "text": "限制TilingData结构大小",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/头尾开销优化/限制TilingData结构大小"
                }
              ]
            },
            {
              "text": "Tiling策略",
              "collapsed": true,
              "items": [
                {
                  "text": "核间负载均衡",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/Tiling策略/核间负载均衡"
                },
                {
                  "text": "Tiling策略",
                  "link": "/guide/算子实践参考/SIMD算子性能优化/Tiling策略/Tiling策略"
                }
              ]
            }
          ]
        },
        {
          "text": "SIMD与SIMT混合算子实现",
          "collapsed": true,
          "items": [
            {
              "text": "基础知识",
              "link": "/guide/算子实践参考/SIMD与SIMT混合算子实现/基础知识"
            },
            {
              "text": "算子实现",
              "link": "/guide/算子实践参考/SIMD与SIMT混合算子实现/算子实现"
            },
            {
              "text": "SIMD与SIMT混合算子实现",
              "link": "/guide/算子实践参考/SIMD与SIMT混合算子实现/SIMD与SIMT混合算子实现"
            }
          ]
        },
        {
          "text": "SIMD与SIMT混合算子性能优化",
          "collapsed": true,
          "items": [
            {
              "text": "SIMD与SIMT混合算子性能优化",
              "link": "/guide/算子实践参考/SIMD与SIMT混合算子性能优化/SIMD与SIMT混合算子性能优化"
            },
            {
              "text": "计算优化",
              "collapsed": true,
              "items": [
                {
                  "text": "通过SIMT实现分支判断",
                  "link": "/guide/算子实践参考/SIMD与SIMT混合算子性能优化/计算优化/通过SIMT实现分支判断"
                }
              ]
            },
            {
              "text": "内存访问",
              "collapsed": true,
              "items": [
                {
                  "text": "使用Unified-Buffer提升内存访问效率",
                  "link": "/guide/算子实践参考/SIMD与SIMT混合算子性能优化/内存访问/使用Unified-Buffer提升内存访问效率"
                }
              ]
            }
          ]
        },
        {
          "text": "SIMT算子实现",
          "collapsed": true,
          "items": [
            {
              "text": "基础知识",
              "link": "/guide/算子实践参考/SIMT算子实现/基础知识"
            },
            {
              "text": "算子实现",
              "link": "/guide/算子实践参考/SIMT算子实现/算子实现"
            },
            {
              "text": "SIMT算子实现",
              "link": "/guide/算子实践参考/SIMT算子实现/SIMT算子实现"
            }
          ]
        }
      ]
    },
    {
      "text": "技术附录",
      "collapsed": true,
      "items": [
        {
          "text": "概念原理和术语",
          "collapsed": true,
          "items": [
            {
              "text": "术语表",
              "link": "/guide/技术附录/概念原理和术语/术语表"
            },
            {
              "text": "内存访问原理",
              "collapsed": true,
              "items": [
                {
                  "text": "Scalar读写数据",
                  "link": "/guide/技术附录/概念原理和术语/内存访问原理/Scalar读写数据"
                }
              ]
            },
            {
              "text": "神经网络和算子",
              "collapsed": true,
              "items": [
                {
                  "text": "数据排布格式",
                  "link": "/guide/技术附录/概念原理和术语/神经网络和算子/数据排布格式"
                },
                {
                  "text": "算子基本概念",
                  "link": "/guide/技术附录/概念原理和术语/神经网络和算子/算子基本概念"
                }
              ]
            },
            {
              "text": "性能优化技术原理",
              "collapsed": true,
              "items": [
                {
                  "text": "DoubleBuffer",
                  "link": "/guide/技术附录/概念原理和术语/性能优化技术原理/DoubleBuffer"
                }
              ]
            }
          ]
        },
        {
          "text": "CPP标准支持",
          "collapsed": true,
          "items": [
            {
              "text": "概述",
              "link": "/guide/技术附录/CPP标准支持/概述"
            },
            {
              "text": "语法限制",
              "collapsed": true,
              "items": [
                {
                  "text": "函数",
                  "link": "/guide/技术附录/CPP标准支持/语法限制/函数"
                },
                {
                  "text": "特性",
                  "link": "/guide/技术附录/CPP标准支持/语法限制/特性"
                },
                {
                  "text": "语法限制",
                  "link": "/guide/技术附录/CPP标准支持/语法限制/语法限制"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "text": "跨代迁移兼容性指南",
      "collapsed": true,
      "items": [
        {
          "text": "概述",
          "link": "/guide/跨代迁移兼容性指南/概述"
        },
        {
          "text": "Ascend-C-API兼容策略",
          "link": "/guide/跨代迁移兼容性指南/Ascend-C-API兼容策略"
        },
        {
          "text": "3510架构迁移指导",
          "collapsed": true,
          "items": [
            {
              "text": "2201到3510架构变更",
              "link": "/guide/跨代迁移兼容性指南/3510架构迁移指导/2201到3510架构变更"
            },
            {
              "text": "2201迁移3510指导",
              "collapsed": true,
              "items": [
                {
                  "text": "高阶API迁移指导",
                  "link": "/guide/跨代迁移兼容性指南/3510架构迁移指导/2201迁移3510指导/高阶API迁移指导"
                },
                {
                  "text": "基础API迁移指导",
                  "link": "/guide/跨代迁移兼容性指南/3510架构迁移指导/2201迁移3510指导/基础API迁移指导"
                },
                {
                  "text": "算子编译迁移指导",
                  "link": "/guide/跨代迁移兼容性指南/3510架构迁移指导/2201迁移3510指导/算子编译迁移指导"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "/api/SIMD-API/": [
    {
      "text": "通用说明和约束",
      "link": "/api/SIMD-API/通用说明和约束"
    },
    {
      "text": "C-API",
      "link": "/api/SIMD-API/C-API"
    },
    {
      "text": "SIMD-API",
      "link": "/api/SIMD-API/SIMD-API"
    },
    {
      "text": "SIMD-API列表",
      "link": "/api/SIMD-API/SIMD-API列表"
    },
    {
      "text": "高阶API",
      "collapsed": true,
      "items": [
        {
          "text": "高阶API",
          "link": "/api/SIMD-API/高阶API/高阶API"
        },
        {
          "text": "归一化操作",
          "collapsed": true,
          "items": [
            {
              "text": "归一化操作",
              "link": "/api/SIMD-API/高阶API/归一化操作/归一化操作"
            },
            {
              "text": "BatchNorm-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/BatchNorm-Tiling"
            },
            {
              "text": "BatchNorm",
              "link": "/api/SIMD-API/高阶API/归一化操作/BatchNorm"
            },
            {
              "text": "DeepNorm-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/DeepNorm-Tiling"
            },
            {
              "text": "DeepNorm",
              "link": "/api/SIMD-API/高阶API/归一化操作/DeepNorm"
            },
            {
              "text": "GroupNorm-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/GroupNorm-Tiling"
            },
            {
              "text": "GroupNorm",
              "link": "/api/SIMD-API/高阶API/归一化操作/GroupNorm"
            },
            {
              "text": "LayerNorm-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/LayerNorm-Tiling"
            },
            {
              "text": "LayerNorm",
              "link": "/api/SIMD-API/高阶API/归一化操作/LayerNorm"
            },
            {
              "text": "LayerNormGrad-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/LayerNormGrad-Tiling"
            },
            {
              "text": "LayerNormGrad",
              "link": "/api/SIMD-API/高阶API/归一化操作/LayerNormGrad"
            },
            {
              "text": "LayerNormGradBeta-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/LayerNormGradBeta-Tiling"
            },
            {
              "text": "LayerNormGradBeta",
              "link": "/api/SIMD-API/高阶API/归一化操作/LayerNormGradBeta"
            },
            {
              "text": "Normalize-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/Normalize-Tiling"
            },
            {
              "text": "Normalize",
              "link": "/api/SIMD-API/高阶API/归一化操作/Normalize"
            },
            {
              "text": "RmsNorm-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/RmsNorm-Tiling"
            },
            {
              "text": "RmsNorm",
              "link": "/api/SIMD-API/高阶API/归一化操作/RmsNorm"
            },
            {
              "text": "WelfordFinalize-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/WelfordFinalize-Tiling"
            },
            {
              "text": "WelfordFinalize",
              "link": "/api/SIMD-API/高阶API/归一化操作/WelfordFinalize"
            },
            {
              "text": "WelfordUpdate-Tiling",
              "link": "/api/SIMD-API/高阶API/归一化操作/WelfordUpdate-Tiling"
            },
            {
              "text": "WelfordUpdate",
              "link": "/api/SIMD-API/高阶API/归一化操作/WelfordUpdate"
            }
          ]
        },
        {
          "text": "归约操作",
          "collapsed": true,
          "items": [
            {
              "text": "归约操作",
              "link": "/api/SIMD-API/高阶API/归约操作/归约操作"
            },
            {
              "text": "Mean接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetMeanMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/Mean接口/GetMeanMaxMinTmpSize"
                },
                {
                  "text": "GetMeanTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/Mean接口/GetMeanTmpBufferFactorSize"
                },
                {
                  "text": "Mean",
                  "link": "/api/SIMD-API/高阶API/归约操作/Mean接口/Mean"
                },
                {
                  "text": "Mean接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/Mean接口/Mean接口"
                }
              ]
            },
            {
              "text": "ReduceAll接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetReduceAllMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceAll接口/GetReduceAllMaxMinTmpSize"
                },
                {
                  "text": "ReduceAll",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceAll接口/ReduceAll"
                },
                {
                  "text": "ReduceAll接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceAll接口/ReduceAll接口"
                }
              ]
            },
            {
              "text": "ReduceAny接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetReduceAnyMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceAny接口/GetReduceAnyMaxMinTmpSize"
                },
                {
                  "text": "ReduceAny",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceAny接口/ReduceAny"
                },
                {
                  "text": "ReduceAny接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceAny接口/ReduceAny接口"
                }
              ]
            },
            {
              "text": "ReduceMax接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetReduceMaxMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceMax接口/GetReduceMaxMaxMinTmpSize"
                },
                {
                  "text": "ReduceMax-91",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceMax接口/ReduceMax-91"
                },
                {
                  "text": "ReduceMax接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceMax接口/ReduceMax接口"
                }
              ]
            },
            {
              "text": "ReduceMean接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetReduceMeanMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceMean接口/GetReduceMeanMaxMinTmpSize"
                },
                {
                  "text": "ReduceMean",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceMean接口/ReduceMean"
                },
                {
                  "text": "ReduceMean接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceMean接口/ReduceMean接口"
                }
              ]
            },
            {
              "text": "ReduceMin接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetReduceMinMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceMin接口/GetReduceMinMaxMinTmpSize"
                },
                {
                  "text": "ReduceMin-92",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceMin接口/ReduceMin-92"
                },
                {
                  "text": "ReduceMin接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceMin接口/ReduceMin接口"
                }
              ]
            },
            {
              "text": "ReduceProd接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetReduceProdMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceProd接口/GetReduceProdMaxMinTmpSize"
                },
                {
                  "text": "ReduceProd",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceProd接口/ReduceProd"
                },
                {
                  "text": "ReduceProd接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceProd接口/ReduceProd接口"
                }
              ]
            },
            {
              "text": "ReduceSum接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetReduceSumMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceSum接口/GetReduceSumMaxMinTmpSize"
                },
                {
                  "text": "ReduceSum-90",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceSum接口/ReduceSum-90"
                },
                {
                  "text": "ReduceSum接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceSum接口/ReduceSum接口"
                }
              ]
            },
            {
              "text": "ReduceXorSum接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetReduceXorSumMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceXorSum接口/GetReduceXorSumMaxMinTmpSize"
                },
                {
                  "text": "ReduceXorSum",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceXorSum接口/ReduceXorSum"
                },
                {
                  "text": "ReduceXorSum接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/ReduceXorSum接口/ReduceXorSum接口"
                }
              ]
            },
            {
              "text": "Sum接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetSumMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/归约操作/Sum接口/GetSumMaxMinTmpSize"
                },
                {
                  "text": "Sum",
                  "link": "/api/SIMD-API/高阶API/归约操作/Sum接口/Sum"
                },
                {
                  "text": "Sum接口",
                  "link": "/api/SIMD-API/高阶API/归约操作/Sum接口/Sum接口"
                }
              ]
            }
          ]
        },
        {
          "text": "激活函数",
          "collapsed": true,
          "items": [
            {
              "text": "激活函数",
              "link": "/api/SIMD-API/高阶API/激活函数/激活函数"
            },
            {
              "text": "GeGLU接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GeGLU",
                  "link": "/api/SIMD-API/高阶API/激活函数/GeGLU接口/GeGLU"
                },
                {
                  "text": "GeGLU接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/GeGLU接口/GeGLU接口"
                },
                {
                  "text": "GetGeGLUMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/激活函数/GeGLU接口/GetGeGLUMaxMinTmpSize"
                },
                {
                  "text": "GetGeGLUTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/激活函数/GeGLU接口/GetGeGLUTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Gelu接口",
              "collapsed": true,
              "items": [
                {
                  "text": "FasterGelu",
                  "link": "/api/SIMD-API/高阶API/激活函数/Gelu接口/FasterGelu"
                },
                {
                  "text": "FasterGeluV2",
                  "link": "/api/SIMD-API/高阶API/激活函数/Gelu接口/FasterGeluV2"
                },
                {
                  "text": "Gelu",
                  "link": "/api/SIMD-API/高阶API/激活函数/Gelu接口/Gelu"
                },
                {
                  "text": "Gelu接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/Gelu接口/Gelu接口"
                },
                {
                  "text": "GetGeluMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/激活函数/Gelu接口/GetGeluMaxMinTmpSize"
                }
              ]
            },
            {
              "text": "LogSoftMax接口",
              "collapsed": true,
              "items": [
                {
                  "text": "LogSoftMax-Tiling",
                  "link": "/api/SIMD-API/高阶API/激活函数/LogSoftMax接口/LogSoftMax-Tiling"
                },
                {
                  "text": "LogSoftMax",
                  "link": "/api/SIMD-API/高阶API/激活函数/LogSoftMax接口/LogSoftMax"
                },
                {
                  "text": "LogSoftMax接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/LogSoftMax接口/LogSoftMax接口"
                }
              ]
            },
            {
              "text": "ReGlu接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetReGluMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/激活函数/ReGlu接口/GetReGluMaxMinTmpSize"
                },
                {
                  "text": "ReGlu",
                  "link": "/api/SIMD-API/高阶API/激活函数/ReGlu接口/ReGlu"
                },
                {
                  "text": "ReGlu接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/ReGlu接口/ReGlu接口"
                }
              ]
            },
            {
              "text": "Sigmoid接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetSigmoidMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/激活函数/Sigmoid接口/GetSigmoidMaxMinTmpSize"
                },
                {
                  "text": "Sigmoid",
                  "link": "/api/SIMD-API/高阶API/激活函数/Sigmoid接口/Sigmoid"
                },
                {
                  "text": "Sigmoid接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/Sigmoid接口/Sigmoid接口"
                }
              ]
            },
            {
              "text": "Silu接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetSiluTmpSize",
                  "link": "/api/SIMD-API/高阶API/激活函数/Silu接口/GetSiluTmpSize"
                },
                {
                  "text": "Silu",
                  "link": "/api/SIMD-API/高阶API/激活函数/Silu接口/Silu"
                },
                {
                  "text": "Silu接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/Silu接口/Silu接口"
                }
              ]
            },
            {
              "text": "SoftMax接口",
              "collapsed": true,
              "items": [
                {
                  "text": "AdjustSoftMaxRes",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/AdjustSoftMaxRes"
                },
                {
                  "text": "IsBasicBlockInSoftMax",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/IsBasicBlockInSoftMax"
                },
                {
                  "text": "SimpleSoftMax",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SimpleSoftMax"
                },
                {
                  "text": "SoftMax-SimpleSoftMax-Tiling",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftMax-SimpleSoftMax-Tiling"
                },
                {
                  "text": "SoftMax-Tiling使用说明",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftMax-Tiling使用说明"
                },
                {
                  "text": "SoftMax",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftMax"
                },
                {
                  "text": "SoftMax接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftMax接口"
                },
                {
                  "text": "SoftmaxFlash-Tiling接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlash-Tiling接口"
                },
                {
                  "text": "SoftmaxFlash",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlash"
                },
                {
                  "text": "SoftmaxFlashV2-Tiling接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlashV2-Tiling接口"
                },
                {
                  "text": "SoftmaxFlashV2",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlashV2"
                },
                {
                  "text": "SoftmaxFlashV3-Tiling接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlashV3-Tiling接口"
                },
                {
                  "text": "SoftmaxFlashV3",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlashV3"
                },
                {
                  "text": "SoftmaxGrad-Tiling接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxGrad-Tiling接口"
                },
                {
                  "text": "SoftmaxGrad",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxGrad"
                },
                {
                  "text": "SoftmaxGradFront",
                  "link": "/api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxGradFront"
                }
              ]
            },
            {
              "text": "SwiGLU接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetSwiGLUMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/激活函数/SwiGLU接口/GetSwiGLUMaxMinTmpSize"
                },
                {
                  "text": "GetSwiGLUTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/激活函数/SwiGLU接口/GetSwiGLUTmpBufferFactorSize"
                },
                {
                  "text": "SwiGLU",
                  "link": "/api/SIMD-API/高阶API/激活函数/SwiGLU接口/SwiGLU"
                },
                {
                  "text": "SwiGLU接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/SwiGLU接口/SwiGLU接口"
                }
              ]
            },
            {
              "text": "Swish接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetSwishTmpSize",
                  "link": "/api/SIMD-API/高阶API/激活函数/Swish接口/GetSwishTmpSize"
                },
                {
                  "text": "Swish",
                  "link": "/api/SIMD-API/高阶API/激活函数/Swish接口/Swish"
                },
                {
                  "text": "Swish接口",
                  "link": "/api/SIMD-API/高阶API/激活函数/Swish接口/Swish接口"
                }
              ]
            }
          ]
        },
        {
          "text": "矩阵计算",
          "collapsed": true,
          "items": [
            {
              "text": "矩阵计算-84",
              "link": "/api/SIMD-API/高阶API/矩阵计算/矩阵计算-84"
            },
            {
              "text": "Matmul-Kernel侧接口",
              "collapsed": true,
              "items": [
                {
                  "text": "AsyncGetTensorC",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/AsyncGetTensorC"
                },
                {
                  "text": "ClearBias",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/ClearBias"
                },
                {
                  "text": "DisableBias",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/DisableBias"
                },
                {
                  "text": "End",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/End"
                },
                {
                  "text": "GetBasicConfig",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetBasicConfig"
                },
                {
                  "text": "GetBatchC",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetBatchC"
                },
                {
                  "text": "GetBatchTensorC",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetBatchTensorC"
                },
                {
                  "text": "GetIBShareNormConfig",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetIBShareNormConfig"
                },
                {
                  "text": "GetMatmulApiTiling",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetMatmulApiTiling"
                },
                {
                  "text": "GetMDLConfig",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetMDLConfig"
                },
                {
                  "text": "GetMMConfig",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetMMConfig"
                },
                {
                  "text": "GetNormalConfig",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetNormalConfig"
                },
                {
                  "text": "GetOffsetC",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetOffsetC"
                },
                {
                  "text": "GetSpecialMDLConfig",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetSpecialMDLConfig"
                },
                {
                  "text": "GetSubBlockIdx",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetSubBlockIdx"
                },
                {
                  "text": "GetTensorC",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/GetTensorC"
                },
                {
                  "text": "Init-85",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/Init-85"
                },
                {
                  "text": "Iterate",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/Iterate"
                },
                {
                  "text": "IterateAll",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/IterateAll"
                },
                {
                  "text": "IterateBatch",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/IterateBatch"
                },
                {
                  "text": "IterateNBatch",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/IterateNBatch"
                },
                {
                  "text": "Matmul-Kernel侧接口",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/Matmul-Kernel侧接口"
                },
                {
                  "text": "Matmul模板参数",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/Matmul模板参数"
                },
                {
                  "text": "Matmul使用说明",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/Matmul使用说明"
                },
                {
                  "text": "MatmulCallBackFunc",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/MatmulCallBackFunc"
                },
                {
                  "text": "MatmulConfig",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/MatmulConfig"
                },
                {
                  "text": "MatmulPolicy",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/MatmulPolicy"
                },
                {
                  "text": "REGIST_MATMUL_OBJ",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/REGIST_MATMUL_OBJ"
                },
                {
                  "text": "SetAntiQuantScalar",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetAntiQuantScalar"
                },
                {
                  "text": "SetAntiQuantVector",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetAntiQuantVector"
                },
                {
                  "text": "SetBatchNum",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetBatchNum"
                },
                {
                  "text": "SetBias",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetBias"
                },
                {
                  "text": "SetHF32",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetHF32"
                },
                {
                  "text": "SetLocalWorkspace",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetLocalWorkspace"
                },
                {
                  "text": "SetOrgShape",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetOrgShape"
                },
                {
                  "text": "SetQuantScalar",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetQuantScalar"
                },
                {
                  "text": "SetQuantVector",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetQuantVector"
                },
                {
                  "text": "SetSelfDefineData",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetSelfDefineData"
                },
                {
                  "text": "SetSingleShape",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetSingleShape"
                },
                {
                  "text": "SetSparseIndex",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetSparseIndex"
                },
                {
                  "text": "SetSubBlockIdx",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetSubBlockIdx"
                },
                {
                  "text": "SetTail",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetTail"
                },
                {
                  "text": "SetTensorA",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetTensorA"
                },
                {
                  "text": "SetTensorB",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetTensorB"
                },
                {
                  "text": "SetTensorScaleA",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetTensorScaleA"
                },
                {
                  "text": "SetTensorScaleB",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetTensorScaleB"
                },
                {
                  "text": "SetUserDefInfo",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetUserDefInfo"
                },
                {
                  "text": "SetWorkspace",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/SetWorkspace"
                },
                {
                  "text": "WaitGetTensorC",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/WaitGetTensorC"
                },
                {
                  "text": "WaitIterateAll",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/WaitIterateAll"
                },
                {
                  "text": "WaitIterateBatch",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/WaitIterateBatch"
                }
              ]
            },
            {
              "text": "Matmul-Tiling侧接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Matmul-Tiling侧接口",
                  "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling侧接口"
                },
                {
                  "text": "获取Matmul计算所需空间",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "获取Matmul计算所需空间",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/获取Matmul计算所需空间/获取Matmul计算所需空间"
                    },
                    {
                      "text": "BatchMatmulGetTmpBufSize",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/获取Matmul计算所需空间/BatchMatmulGetTmpBufSize"
                    },
                    {
                      "text": "BatchMatmulGetTmpBufSizeV2",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/获取Matmul计算所需空间/BatchMatmulGetTmpBufSizeV2"
                    },
                    {
                      "text": "MatmulGetTmpBufSize",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/获取Matmul计算所需空间/MatmulGetTmpBufSize"
                    },
                    {
                      "text": "MatmulGetTmpBufSizeV2",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/获取Matmul计算所需空间/MatmulGetTmpBufSizeV2"
                    },
                    {
                      "text": "MultiCoreMatmulGetTmpBufSize",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/获取Matmul计算所需空间/MultiCoreMatmulGetTmpBufSize"
                    },
                    {
                      "text": "MultiCoreMatmulGetTmpBufSizeV2",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/获取Matmul计算所需空间/MultiCoreMatmulGetTmpBufSizeV2"
                    }
                  ]
                },
                {
                  "text": "Matmul-Tiling类",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "EnableBias",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/EnableBias"
                    },
                    {
                      "text": "EnableL1BankConflictOptimise",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/EnableL1BankConflictOptimise"
                    },
                    {
                      "text": "EnableMultiCoreSplitK",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/EnableMultiCoreSplitK"
                    },
                    {
                      "text": "GetBaseK",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/GetBaseK"
                    },
                    {
                      "text": "GetBaseM",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/GetBaseM"
                    },
                    {
                      "text": "GetBaseN",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/GetBaseN"
                    },
                    {
                      "text": "GetCoreNum",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/GetCoreNum"
                    },
                    {
                      "text": "GetSingleShape",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/GetSingleShape"
                    },
                    {
                      "text": "GetTiling",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/GetTiling"
                    },
                    {
                      "text": "Matmul-Tiling类",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/Matmul-Tiling类"
                    },
                    {
                      "text": "Matmul-Tiling类构造函数",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/Matmul-Tiling类构造函数"
                    },
                    {
                      "text": "Matmul-Tiling类使用说明",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/Matmul-Tiling类使用说明"
                    },
                    {
                      "text": "SetALayout",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetALayout"
                    },
                    {
                      "text": "SetAlignSplit",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetAlignSplit"
                    },
                    {
                      "text": "SetAType",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetAType"
                    },
                    {
                      "text": "SetBatchInfoForNormal",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetBatchInfoForNormal"
                    },
                    {
                      "text": "SetBatchNum-88",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetBatchNum-88"
                    },
                    {
                      "text": "SetBias-89",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetBias-89"
                    },
                    {
                      "text": "SetBiasType",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetBiasType"
                    },
                    {
                      "text": "SetBLayout",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetBLayout"
                    },
                    {
                      "text": "SetBType",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetBType"
                    },
                    {
                      "text": "SetBufferSpace",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetBufferSpace"
                    },
                    {
                      "text": "SetCLayout",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetCLayout"
                    },
                    {
                      "text": "SetCType",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetCType"
                    },
                    {
                      "text": "SetDequantType",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetDequantType"
                    },
                    {
                      "text": "SetDim",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetDim"
                    },
                    {
                      "text": "SetDoubleBuffer",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetDoubleBuffer"
                    },
                    {
                      "text": "SetFixSplit",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetFixSplit"
                    },
                    {
                      "text": "SetMadType",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetMadType"
                    },
                    {
                      "text": "SetMatmulConfigParams",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetMatmulConfigParams"
                    },
                    {
                      "text": "SetOrgShape-87",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetOrgShape-87"
                    },
                    {
                      "text": "SetScaleAType",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetScaleAType"
                    },
                    {
                      "text": "SetScaleBType",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetScaleBType"
                    },
                    {
                      "text": "SetShape",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetShape"
                    },
                    {
                      "text": "SetSingleRange",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetSingleRange"
                    },
                    {
                      "text": "SetSingleShape-86",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetSingleShape-86"
                    },
                    {
                      "text": "SetSparse",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetSparse"
                    },
                    {
                      "text": "SetSplitK",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetSplitK"
                    },
                    {
                      "text": "SetSplitRange",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetSplitRange"
                    },
                    {
                      "text": "SetTraverse",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetTraverse"
                    },
                    {
                      "text": "TCubeTiling结构体",
                      "link": "/api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/TCubeTiling结构体"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "text": "卷积计算",
          "collapsed": true,
          "items": [
            {
              "text": "卷积计算",
              "link": "/api/SIMD-API/高阶API/卷积计算/卷积计算"
            },
            {
              "text": "Conv3D",
              "collapsed": true,
              "items": [
                {
                  "text": "Conv3D",
                  "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D"
                },
                {
                  "text": "Conv3D-Kernel侧接口",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Conv3D-Kernel侧接口",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/Conv3D-Kernel侧接口"
                    },
                    {
                      "text": "Conv3D模板参数",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/Conv3D模板参数"
                    },
                    {
                      "text": "Conv3D使用说明",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/Conv3D使用说明"
                    },
                    {
                      "text": "End-104",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/End-104"
                    },
                    {
                      "text": "Init-101",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/Init-101"
                    },
                    {
                      "text": "IterateAll-103",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/IterateAll-103"
                    },
                    {
                      "text": "SetBias-102",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/SetBias-102"
                    },
                    {
                      "text": "SetInput",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/SetInput"
                    },
                    {
                      "text": "SetInputStartPosition",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/SetInputStartPosition"
                    },
                    {
                      "text": "SetSingleOutputShape",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/SetSingleOutputShape"
                    },
                    {
                      "text": "SetWeight",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Kernel侧接口/SetWeight"
                    }
                  ]
                },
                {
                  "text": "Conv3D-Tiling侧接口",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Conv3D-Tiling侧接口",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/Conv3D-Tiling侧接口"
                    },
                    {
                      "text": "Conv3D-Tiling构造函数",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/Conv3D-Tiling构造函数"
                    },
                    {
                      "text": "Conv3D-Tiling使用说明",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/Conv3D-Tiling使用说明"
                    },
                    {
                      "text": "GetTiling-105",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/GetTiling-105"
                    },
                    {
                      "text": "SetBiasType-107",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetBiasType-107"
                    },
                    {
                      "text": "SetDilation",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetDilation"
                    },
                    {
                      "text": "SetGroups",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetGroups"
                    },
                    {
                      "text": "SetInputType",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetInputType"
                    },
                    {
                      "text": "SetOrgInputShape",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetOrgInputShape"
                    },
                    {
                      "text": "SetOrgWeightShape",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetOrgWeightShape"
                    },
                    {
                      "text": "SetOutputType",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetOutputType"
                    },
                    {
                      "text": "SetPadding",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetPadding"
                    },
                    {
                      "text": "SetSingleOutputShape-106",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetSingleOutputShape-106"
                    },
                    {
                      "text": "SetSingleWeightShape",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetSingleWeightShape"
                    },
                    {
                      "text": "SetStride",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetStride"
                    },
                    {
                      "text": "SetWeightType",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/SetWeightType"
                    },
                    {
                      "text": "TConv3DApiTiling结构体",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/TConv3DApiTiling结构体"
                    }
                  ]
                }
              ]
            },
            {
              "text": "Conv3DBackpropFilter",
              "collapsed": true,
              "items": [
                {
                  "text": "Conv3DBackpropFilter",
                  "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter"
                },
                {
                  "text": "Conv3DBackpropFilter-Kernel侧接口",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Conv3DBackpropFilter-Kernel侧接口",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/Conv3DBackpropFilter-Kernel侧接口"
                    },
                    {
                      "text": "Conv3DBackpropFilter使用说明",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/Conv3DBackpropFilter使用说明"
                    },
                    {
                      "text": "End-127",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/End-127"
                    },
                    {
                      "text": "GetTensorC-126",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/GetTensorC-126"
                    },
                    {
                      "text": "Init-120",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/Init-120"
                    },
                    {
                      "text": "Iterate-125",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/Iterate-125"
                    },
                    {
                      "text": "SetGradOutput-122",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/SetGradOutput-122"
                    },
                    {
                      "text": "SetInput-121",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/SetInput-121"
                    },
                    {
                      "text": "SetSingleShape-123",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/SetSingleShape-123"
                    },
                    {
                      "text": "SetStartPosition-124",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Kernel侧接口/SetStartPosition-124"
                    }
                  ]
                },
                {
                  "text": "Conv3DBackpropFilter-Tiling侧接口",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Conv3DBackpropFilter-Tiling侧接口",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/Conv3DBackpropFilter-Tiling侧接口"
                    },
                    {
                      "text": "Conv3DBackpropFilter-Tiling构造函数",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/Conv3DBackpropFilter-Tiling构造函数"
                    },
                    {
                      "text": "Conv3DBackpropFilter-Tiling使用说明",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/Conv3DBackpropFilter-Tiling使用说明"
                    },
                    {
                      "text": "GetTiling-128",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/GetTiling-128"
                    },
                    {
                      "text": "SetDilation-137",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/SetDilation-137"
                    },
                    {
                      "text": "SetGradOutputShape-131",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/SetGradOutputShape-131"
                    },
                    {
                      "text": "SetGradOutputType-134",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/SetGradOutputType-134"
                    },
                    {
                      "text": "SetInputShape-130",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/SetInputShape-130"
                    },
                    {
                      "text": "SetInputType-133",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/SetInputType-133"
                    },
                    {
                      "text": "SetPadding-135",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/SetPadding-135"
                    },
                    {
                      "text": "SetStride-136",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/SetStride-136"
                    },
                    {
                      "text": "SetWeightShape-129",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/SetWeightShape-129"
                    },
                    {
                      "text": "SetWeightType-132",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/SetWeightType-132"
                    },
                    {
                      "text": "TConv3DBpFilterTiling结构体",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropFilter/Conv3DBackpropFilter-Tiling侧接口/TConv3DBpFilterTiling结构体"
                    }
                  ]
                }
              ]
            },
            {
              "text": "Conv3DBackpropInput",
              "collapsed": true,
              "items": [
                {
                  "text": "Conv3DBackpropInput",
                  "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput"
                },
                {
                  "text": "Conv3DBackpropInput-Kernel侧接口",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Conv3DBackpropInput-Kernel侧接口",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/Conv3DBackpropInput-Kernel侧接口"
                    },
                    {
                      "text": "Conv3DBackpropInput使用说明",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/Conv3DBackpropInput使用说明"
                    },
                    {
                      "text": "End-113",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/End-113"
                    },
                    {
                      "text": "GetTensorC-112",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/GetTensorC-112"
                    },
                    {
                      "text": "Init-108",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/Init-108"
                    },
                    {
                      "text": "Iterate-111",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/Iterate-111"
                    },
                    {
                      "text": "SetGradOutput",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/SetGradOutput"
                    },
                    {
                      "text": "SetSingleShape-110",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/SetSingleShape-110"
                    },
                    {
                      "text": "SetStartPosition",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/SetStartPosition"
                    },
                    {
                      "text": "SetWeight-109",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Kernel侧接口/SetWeight-109"
                    }
                  ]
                },
                {
                  "text": "Conv3DBackpropInput-Tiling侧接口",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Conv3DBackpropInput-Tiling侧接口",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/Conv3DBackpropInput-Tiling侧接口"
                    },
                    {
                      "text": "Conv3DBackpropInput-Tiling构造函数",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/Conv3DBackpropInput-Tiling构造函数"
                    },
                    {
                      "text": "Conv3DBackpropInput-Tiling使用说明",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/Conv3DBackpropInput-Tiling使用说明"
                    },
                    {
                      "text": "GetTiling-114",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/GetTiling-114"
                    },
                    {
                      "text": "SetDilation-119",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetDilation-119"
                    },
                    {
                      "text": "SetGradOutputShape",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetGradOutputShape"
                    },
                    {
                      "text": "SetGradOutputType",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetGradOutputType"
                    },
                    {
                      "text": "SetInputShape",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetInputShape"
                    },
                    {
                      "text": "SetInputType-116",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetInputType-116"
                    },
                    {
                      "text": "SetOutputPadding",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetOutputPadding"
                    },
                    {
                      "text": "SetPadding-117",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetPadding-117"
                    },
                    {
                      "text": "SetStride-118",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetStride-118"
                    },
                    {
                      "text": "SetWeightShape",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetWeightShape"
                    },
                    {
                      "text": "SetWeightType-115",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/SetWeightType-115"
                    },
                    {
                      "text": "TConv3DBackpropInputTiling结构体",
                      "link": "/api/SIMD-API/高阶API/卷积计算/Conv3DBackpropInput/Conv3DBackpropInput-Tiling侧接口/TConv3DBackpropInputTiling结构体"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "text": "量化操作",
          "collapsed": true,
          "items": [
            {
              "text": "量化操作",
              "link": "/api/SIMD-API/高阶API/量化操作/量化操作"
            },
            {
              "text": "AntiQuantize",
              "link": "/api/SIMD-API/高阶API/量化操作/AntiQuantize"
            },
            {
              "text": "AscendAntiQuant",
              "link": "/api/SIMD-API/高阶API/量化操作/AscendAntiQuant"
            },
            {
              "text": "AscendDequant",
              "link": "/api/SIMD-API/高阶API/量化操作/AscendDequant"
            },
            {
              "text": "AscendQuant",
              "link": "/api/SIMD-API/高阶API/量化操作/AscendQuant"
            },
            {
              "text": "Dequantize",
              "link": "/api/SIMD-API/高阶API/量化操作/Dequantize"
            },
            {
              "text": "GetAntiQuantizeMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetAntiQuantizeMaxMinTmpSize"
            },
            {
              "text": "GetAntiQuantizeTmpBufferFactorSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetAntiQuantizeTmpBufferFactorSize"
            },
            {
              "text": "GetAscendAntiQuantMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetAscendAntiQuantMaxMinTmpSize"
            },
            {
              "text": "GetAscendAntiQuantTmpBufferFactorSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetAscendAntiQuantTmpBufferFactorSize"
            },
            {
              "text": "GetAscendDequantMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetAscendDequantMaxMinTmpSize"
            },
            {
              "text": "GetAscendDequantTmpBufferFactorSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetAscendDequantTmpBufferFactorSize"
            },
            {
              "text": "GetAscendQuantMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetAscendQuantMaxMinTmpSize"
            },
            {
              "text": "GetAscendQuantTmpBufferFactorSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetAscendQuantTmpBufferFactorSize"
            },
            {
              "text": "GetDequantizeMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetDequantizeMaxMinTmpSize"
            },
            {
              "text": "GetDequantizeTmpBufferFactorSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetDequantizeTmpBufferFactorSize"
            },
            {
              "text": "GetQuantizeMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetQuantizeMaxMinTmpSize"
            },
            {
              "text": "GetQuantizeTmpBufferFactorSize",
              "link": "/api/SIMD-API/高阶API/量化操作/GetQuantizeTmpBufferFactorSize"
            },
            {
              "text": "Quantize",
              "link": "/api/SIMD-API/高阶API/量化操作/Quantize"
            }
          ]
        },
        {
          "text": "排序操作",
          "collapsed": true,
          "items": [
            {
              "text": "排序操作",
              "link": "/api/SIMD-API/高阶API/排序操作/排序操作"
            },
            {
              "text": "Concat",
              "link": "/api/SIMD-API/高阶API/排序操作/Concat"
            },
            {
              "text": "Extract",
              "link": "/api/SIMD-API/高阶API/排序操作/Extract"
            },
            {
              "text": "GetConcatTmpSize",
              "link": "/api/SIMD-API/高阶API/排序操作/GetConcatTmpSize"
            },
            {
              "text": "GetSortLen",
              "link": "/api/SIMD-API/高阶API/排序操作/GetSortLen"
            },
            {
              "text": "GetSortMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/排序操作/GetSortMaxMinTmpSize"
            },
            {
              "text": "GetSortOffset",
              "link": "/api/SIMD-API/高阶API/排序操作/GetSortOffset"
            },
            {
              "text": "GetSortTmpSize",
              "link": "/api/SIMD-API/高阶API/排序操作/GetSortTmpSize"
            },
            {
              "text": "MrgSort-93",
              "link": "/api/SIMD-API/高阶API/排序操作/MrgSort-93"
            },
            {
              "text": "Sort",
              "link": "/api/SIMD-API/高阶API/排序操作/Sort"
            },
            {
              "text": "TopK-Tiling",
              "link": "/api/SIMD-API/高阶API/排序操作/TopK-Tiling"
            },
            {
              "text": "TopK",
              "link": "/api/SIMD-API/高阶API/排序操作/TopK"
            }
          ]
        },
        {
          "text": "数据过滤",
          "collapsed": true,
          "items": [
            {
              "text": "数据过滤",
              "link": "/api/SIMD-API/高阶API/数据过滤/数据过滤"
            },
            {
              "text": "DropOut",
              "link": "/api/SIMD-API/高阶API/数据过滤/DropOut"
            },
            {
              "text": "GetDropOutMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/数据过滤/GetDropOutMaxMinTmpSize"
            },
            {
              "text": "GetSelectMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/数据过滤/GetSelectMaxMinTmpSize"
            },
            {
              "text": "Select-95",
              "link": "/api/SIMD-API/高阶API/数据过滤/Select-95"
            }
          ]
        },
        {
          "text": "数学计算",
          "collapsed": true,
          "items": [
            {
              "text": "更多样例-83",
              "link": "/api/SIMD-API/高阶API/数学计算/更多样例-83"
            },
            {
              "text": "数学计算",
              "link": "/api/SIMD-API/高阶API/数学计算/数学计算"
            },
            {
              "text": "Acos接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Acos",
                  "link": "/api/SIMD-API/高阶API/数学计算/Acos接口/Acos"
                },
                {
                  "text": "Acos接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Acos接口/Acos接口"
                },
                {
                  "text": "GetAcosMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Acos接口/GetAcosMaxMinTmpSize"
                },
                {
                  "text": "GetAcosTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Acos接口/GetAcosTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Acosh接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Acosh",
                  "link": "/api/SIMD-API/高阶API/数学计算/Acosh接口/Acosh"
                },
                {
                  "text": "Acosh接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Acosh接口/Acosh接口"
                },
                {
                  "text": "GetAcoshMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Acosh接口/GetAcoshMaxMinTmpSize"
                },
                {
                  "text": "GetAcoshTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Acosh接口/GetAcoshTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Asin接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Asin",
                  "link": "/api/SIMD-API/高阶API/数学计算/Asin接口/Asin"
                },
                {
                  "text": "Asin接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Asin接口/Asin接口"
                },
                {
                  "text": "GetAsinMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Asin接口/GetAsinMaxMinTmpSize"
                },
                {
                  "text": "GetAsinTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Asin接口/GetAsinTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Asinh接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Asinh",
                  "link": "/api/SIMD-API/高阶API/数学计算/Asinh接口/Asinh"
                },
                {
                  "text": "Asinh接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Asinh接口/Asinh接口"
                },
                {
                  "text": "GetAsinhMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Asinh接口/GetAsinhMaxMinTmpSize"
                },
                {
                  "text": "GetAsinhTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Asinh接口/GetAsinhTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Atan接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Atan",
                  "link": "/api/SIMD-API/高阶API/数学计算/Atan接口/Atan"
                },
                {
                  "text": "Atan接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Atan接口/Atan接口"
                },
                {
                  "text": "GetAtanMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Atan接口/GetAtanMaxMinTmpSize"
                },
                {
                  "text": "GetAtanTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Atan接口/GetAtanTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Atanh接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Atanh",
                  "link": "/api/SIMD-API/高阶API/数学计算/Atanh接口/Atanh"
                },
                {
                  "text": "Atanh接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Atanh接口/Atanh接口"
                },
                {
                  "text": "GetAtanhMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Atanh接口/GetAtanhMaxMinTmpSize"
                },
                {
                  "text": "GetAtanhTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Atanh接口/GetAtanhTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Axpy接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Axpy-80",
                  "link": "/api/SIMD-API/高阶API/数学计算/Axpy接口/Axpy-80"
                },
                {
                  "text": "Axpy接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Axpy接口/Axpy接口"
                },
                {
                  "text": "GetAxpyMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Axpy接口/GetAxpyMaxMinTmpSize"
                },
                {
                  "text": "GetAxpyTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Axpy接口/GetAxpyTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "BitwiseAnd接口",
              "collapsed": true,
              "items": [
                {
                  "text": "BitwiseAnd",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseAnd接口/BitwiseAnd"
                },
                {
                  "text": "BitwiseAnd接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseAnd接口/BitwiseAnd接口"
                },
                {
                  "text": "GetBitwiseAndMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseAnd接口/GetBitwiseAndMaxMinTmpSize"
                },
                {
                  "text": "GetBitwiseAndTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseAnd接口/GetBitwiseAndTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "BitwiseNot接口",
              "collapsed": true,
              "items": [
                {
                  "text": "BitwiseNot",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseNot接口/BitwiseNot"
                },
                {
                  "text": "BitwiseNot接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseNot接口/BitwiseNot接口"
                },
                {
                  "text": "GetBitwiseNotMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseNot接口/GetBitwiseNotMaxMinTmpSize"
                },
                {
                  "text": "GetBitwiseNotTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseNot接口/GetBitwiseNotTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "BitwiseOr接口",
              "collapsed": true,
              "items": [
                {
                  "text": "BitwiseOr",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseOr接口/BitwiseOr"
                },
                {
                  "text": "BitwiseOr接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseOr接口/BitwiseOr接口"
                },
                {
                  "text": "GetBitwiseOrMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseOr接口/GetBitwiseOrMaxMinTmpSize"
                },
                {
                  "text": "GetBitwiseOrTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseOr接口/GetBitwiseOrTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "BitwiseXor接口",
              "collapsed": true,
              "items": [
                {
                  "text": "BitwiseXor",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseXor接口/BitwiseXor"
                },
                {
                  "text": "BitwiseXor接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseXor接口/BitwiseXor接口"
                },
                {
                  "text": "GetBitwiseXorMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseXor接口/GetBitwiseXorMaxMinTmpSize"
                },
                {
                  "text": "GetBitwiseXorTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/BitwiseXor接口/GetBitwiseXorTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Ceil接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Ceil",
                  "link": "/api/SIMD-API/高阶API/数学计算/Ceil接口/Ceil"
                },
                {
                  "text": "Ceil接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Ceil接口/Ceil接口"
                },
                {
                  "text": "GetCeilMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Ceil接口/GetCeilMaxMinTmpSize"
                },
                {
                  "text": "GetCeilTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Ceil接口/GetCeilTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Clamp接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Clamp",
                  "link": "/api/SIMD-API/高阶API/数学计算/Clamp接口/Clamp"
                },
                {
                  "text": "Clamp接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Clamp接口/Clamp接口"
                },
                {
                  "text": "ClampMax",
                  "link": "/api/SIMD-API/高阶API/数学计算/Clamp接口/ClampMax"
                },
                {
                  "text": "ClampMin",
                  "link": "/api/SIMD-API/高阶API/数学计算/Clamp接口/ClampMin"
                },
                {
                  "text": "GetClampMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Clamp接口/GetClampMaxMinTmpSize"
                },
                {
                  "text": "GetClampTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Clamp接口/GetClampTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Cos接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Cos",
                  "link": "/api/SIMD-API/高阶API/数学计算/Cos接口/Cos"
                },
                {
                  "text": "Cos接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Cos接口/Cos接口"
                },
                {
                  "text": "GetCosMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Cos接口/GetCosMaxMinTmpSize"
                },
                {
                  "text": "GetCosTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Cos接口/GetCosTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Cosh接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Cosh",
                  "link": "/api/SIMD-API/高阶API/数学计算/Cosh接口/Cosh"
                },
                {
                  "text": "Cosh接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Cosh接口/Cosh接口"
                },
                {
                  "text": "GetCoshMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Cosh接口/GetCoshMaxMinTmpSize"
                },
                {
                  "text": "GetCoshTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Cosh接口/GetCoshTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "CumSum接口",
              "collapsed": true,
              "items": [
                {
                  "text": "CumSum",
                  "link": "/api/SIMD-API/高阶API/数学计算/CumSum接口/CumSum"
                },
                {
                  "text": "CumSum接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/CumSum接口/CumSum接口"
                },
                {
                  "text": "GetCumSumMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/CumSum接口/GetCumSumMaxMinTmpSize"
                }
              ]
            },
            {
              "text": "Digamma接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Digamma",
                  "link": "/api/SIMD-API/高阶API/数学计算/Digamma接口/Digamma"
                },
                {
                  "text": "Digamma接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Digamma接口/Digamma接口"
                },
                {
                  "text": "GetDigammaMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Digamma接口/GetDigammaMaxMinTmpSize"
                },
                {
                  "text": "GetDigammaTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Digamma接口/GetDigammaTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Erf接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Erf",
                  "link": "/api/SIMD-API/高阶API/数学计算/Erf接口/Erf"
                },
                {
                  "text": "Erf接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Erf接口/Erf接口"
                },
                {
                  "text": "GetErfMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Erf接口/GetErfMaxMinTmpSize"
                },
                {
                  "text": "GetErfTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Erf接口/GetErfTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Erfc接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Erfc",
                  "link": "/api/SIMD-API/高阶API/数学计算/Erfc接口/Erfc"
                },
                {
                  "text": "Erfc接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Erfc接口/Erfc接口"
                },
                {
                  "text": "GetErfcMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Erfc接口/GetErfcMaxMinTmpSize"
                },
                {
                  "text": "GetErfcTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Erfc接口/GetErfcTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Exp接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Exp-81",
                  "link": "/api/SIMD-API/高阶API/数学计算/Exp接口/Exp-81"
                },
                {
                  "text": "Exp接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Exp接口/Exp接口"
                },
                {
                  "text": "GetExpMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Exp接口/GetExpMaxMinTmpSize"
                },
                {
                  "text": "GetExpTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Exp接口/GetExpTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Floor接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Floor",
                  "link": "/api/SIMD-API/高阶API/数学计算/Floor接口/Floor"
                },
                {
                  "text": "Floor接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Floor接口/Floor接口"
                },
                {
                  "text": "GetFloorMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Floor接口/GetFloorMaxMinTmpSize"
                },
                {
                  "text": "GetFloorTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Floor接口/GetFloorTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Fma接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Fma",
                  "link": "/api/SIMD-API/高阶API/数学计算/Fma接口/Fma"
                },
                {
                  "text": "Fma接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Fma接口/Fma接口"
                },
                {
                  "text": "GetFmaMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Fma接口/GetFmaMaxMinTmpSize"
                },
                {
                  "text": "GetFmaTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Fma接口/GetFmaTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Fmod接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Fmod",
                  "link": "/api/SIMD-API/高阶API/数学计算/Fmod接口/Fmod"
                },
                {
                  "text": "Fmod接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Fmod接口/Fmod接口"
                },
                {
                  "text": "GetFmodMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Fmod接口/GetFmodMaxMinTmpSize"
                },
                {
                  "text": "GetFmodTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Fmod接口/GetFmodTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Frac接口",
              "collapsed": true,
              "items": [
                {
                  "text": "Frac",
                  "link": "/api/SIMD-API/高阶API/数学计算/Frac接口/Frac"
                },
                {
                  "text": "Frac接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Frac接口/Frac接口"
                },
                {
                  "text": "GetFracMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Frac接口/GetFracMaxMinTmpSize"
                },
                {
                  "text": "GetFracTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Frac接口/GetFracTmpBufferFactorSize"
                }
              ]
            },
            {
              "text": "Hypot接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetHypotMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Hypot接口/GetHypotMaxMinTmpSize"
                },
                {
                  "text": "GetHypotTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Hypot接口/GetHypotTmpBufferFactorSize"
                },
                {
                  "text": "Hypot",
                  "link": "/api/SIMD-API/高阶API/数学计算/Hypot接口/Hypot"
                },
                {
                  "text": "Hypot接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Hypot接口/Hypot接口"
                }
              ]
            },
            {
              "text": "IsFinite接口",
              "collapsed": true,
              "items": [
                {
                  "text": "IsFinite",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsFinite接口/IsFinite"
                },
                {
                  "text": "IsFinite接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsFinite接口/IsFinite接口"
                }
              ]
            },
            {
              "text": "IsInf接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetIsInfMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsInf接口/GetIsInfMaxMinTmpSize"
                },
                {
                  "text": "GetIsInfTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsInf接口/GetIsInfTmpBufferFactorSize"
                },
                {
                  "text": "IsInf",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsInf接口/IsInf"
                },
                {
                  "text": "IsInf接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsInf接口/IsInf接口"
                }
              ]
            },
            {
              "text": "IsNan接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetIsNanMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsNan接口/GetIsNanMaxMinTmpSize"
                },
                {
                  "text": "GetIsNanTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsNan接口/GetIsNanTmpBufferFactorSize"
                },
                {
                  "text": "IsNan",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsNan接口/IsNan"
                },
                {
                  "text": "IsNan接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/IsNan接口/IsNan接口"
                }
              ]
            },
            {
              "text": "Lgamma接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetLgammaMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Lgamma接口/GetLgammaMaxMinTmpSize"
                },
                {
                  "text": "GetLgammaTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Lgamma接口/GetLgammaTmpBufferFactorSize"
                },
                {
                  "text": "Lgamma",
                  "link": "/api/SIMD-API/高阶API/数学计算/Lgamma接口/Lgamma"
                },
                {
                  "text": "Lgamma接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Lgamma接口/Lgamma接口"
                }
              ]
            },
            {
              "text": "Log接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetLogMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Log接口/GetLogMaxMinTmpSize"
                },
                {
                  "text": "GetLogTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Log接口/GetLogTmpBufferFactorSize"
                },
                {
                  "text": "Log-79",
                  "link": "/api/SIMD-API/高阶API/数学计算/Log接口/Log-79"
                },
                {
                  "text": "Log接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Log接口/Log接口"
                }
              ]
            },
            {
              "text": "LogicalAnd接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetLogicalAndMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalAnd接口/GetLogicalAndMaxMinTmpSize"
                },
                {
                  "text": "GetLogicalAndTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalAnd接口/GetLogicalAndTmpBufferFactorSize"
                },
                {
                  "text": "LogicalAnd",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalAnd接口/LogicalAnd"
                },
                {
                  "text": "LogicalAnd接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalAnd接口/LogicalAnd接口"
                }
              ]
            },
            {
              "text": "LogicalAnds接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetLogicalAndsMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalAnds接口/GetLogicalAndsMaxMinTmpSize"
                },
                {
                  "text": "GetLogicalAndsTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalAnds接口/GetLogicalAndsTmpBufferFactorSize"
                },
                {
                  "text": "LogicalAnds",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalAnds接口/LogicalAnds"
                },
                {
                  "text": "LogicalAnds接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalAnds接口/LogicalAnds接口"
                }
              ]
            },
            {
              "text": "LogicalNot接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetLogicalNotMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalNot接口/GetLogicalNotMaxMinTmpSize"
                },
                {
                  "text": "GetLogicalNotTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalNot接口/GetLogicalNotTmpBufferFactorSize"
                },
                {
                  "text": "LogicalNot",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalNot接口/LogicalNot"
                },
                {
                  "text": "LogicalNot接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalNot接口/LogicalNot接口"
                }
              ]
            },
            {
              "text": "LogicalOr接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetLogicalOrMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalOr接口/GetLogicalOrMaxMinTmpSize"
                },
                {
                  "text": "GetLogicalOrTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalOr接口/GetLogicalOrTmpBufferFactorSize"
                },
                {
                  "text": "LogicalOr",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalOr接口/LogicalOr"
                },
                {
                  "text": "LogicalOr接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalOr接口/LogicalOr接口"
                }
              ]
            },
            {
              "text": "LogicalOrs接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetLogicalOrsMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalOrs接口/GetLogicalOrsMaxMinTmpSize"
                },
                {
                  "text": "GetLogicalOrsTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalOrs接口/GetLogicalOrsTmpBufferFactorSize"
                },
                {
                  "text": "LogicalOrs",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalOrs接口/LogicalOrs"
                },
                {
                  "text": "LogicalOrs接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalOrs接口/LogicalOrs接口"
                }
              ]
            },
            {
              "text": "LogicalXor接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetLogicalXorMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalXor接口/GetLogicalXorMaxMinTmpSize"
                },
                {
                  "text": "GetLogicalXorTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalXor接口/GetLogicalXorTmpBufferFactorSize"
                },
                {
                  "text": "LogicalXor",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalXor接口/LogicalXor"
                },
                {
                  "text": "LogicalXor接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/LogicalXor接口/LogicalXor接口"
                }
              ]
            },
            {
              "text": "Power接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetPowerMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Power接口/GetPowerMaxMinTmpSize"
                },
                {
                  "text": "GetPowerTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Power接口/GetPowerTmpBufferFactorSize"
                },
                {
                  "text": "Power",
                  "link": "/api/SIMD-API/高阶API/数学计算/Power接口/Power"
                },
                {
                  "text": "Power接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Power接口/Power接口"
                }
              ]
            },
            {
              "text": "Rint接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetRintMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Rint接口/GetRintMaxMinTmpSize"
                },
                {
                  "text": "GetRintTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Rint接口/GetRintTmpBufferFactorSize"
                },
                {
                  "text": "Rint",
                  "link": "/api/SIMD-API/高阶API/数学计算/Rint接口/Rint"
                },
                {
                  "text": "Rint接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Rint接口/Rint接口"
                }
              ]
            },
            {
              "text": "Round接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetRoundMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Round接口/GetRoundMaxMinTmpSize"
                },
                {
                  "text": "GetRoundTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Round接口/GetRoundTmpBufferFactorSize"
                },
                {
                  "text": "Round",
                  "link": "/api/SIMD-API/高阶API/数学计算/Round接口/Round"
                },
                {
                  "text": "Round接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Round接口/Round接口"
                }
              ]
            },
            {
              "text": "Sign接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetSignMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sign接口/GetSignMaxMinTmpSize"
                },
                {
                  "text": "GetSignTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sign接口/GetSignTmpBufferFactorSize"
                },
                {
                  "text": "Sign",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sign接口/Sign"
                },
                {
                  "text": "Sign接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sign接口/Sign接口"
                }
              ]
            },
            {
              "text": "Sin接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetSinMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sin接口/GetSinMaxMinTmpSize"
                },
                {
                  "text": "GetSinTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sin接口/GetSinTmpBufferFactorSize"
                },
                {
                  "text": "Sin",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sin接口/Sin"
                },
                {
                  "text": "Sin接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sin接口/Sin接口"
                }
              ]
            },
            {
              "text": "SinCos接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetSinCosMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/SinCos接口/GetSinCosMaxMinTmpSize"
                },
                {
                  "text": "GetSinCosTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/SinCos接口/GetSinCosTmpBufferFactorSize"
                },
                {
                  "text": "SinCos",
                  "link": "/api/SIMD-API/高阶API/数学计算/SinCos接口/SinCos"
                },
                {
                  "text": "SinCos接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/SinCos接口/SinCos接口"
                }
              ]
            },
            {
              "text": "Sinh接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetSinhMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sinh接口/GetSinhMaxMinTmpSize"
                },
                {
                  "text": "GetSinhTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sinh接口/GetSinhTmpBufferFactorSize"
                },
                {
                  "text": "Sinh",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sinh接口/Sinh"
                },
                {
                  "text": "Sinh接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Sinh接口/Sinh接口"
                }
              ]
            },
            {
              "text": "Tan接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetTanMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Tan接口/GetTanMaxMinTmpSize"
                },
                {
                  "text": "GetTanTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Tan接口/GetTanTmpBufferFactorSize"
                },
                {
                  "text": "Tan",
                  "link": "/api/SIMD-API/高阶API/数学计算/Tan接口/Tan"
                },
                {
                  "text": "Tan接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Tan接口/Tan接口"
                }
              ]
            },
            {
              "text": "Tanh接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetTanhMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Tanh接口/GetTanhMaxMinTmpSize"
                },
                {
                  "text": "GetTanhTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Tanh接口/GetTanhTmpBufferFactorSize"
                },
                {
                  "text": "Tanh",
                  "link": "/api/SIMD-API/高阶API/数学计算/Tanh接口/Tanh"
                },
                {
                  "text": "Tanh接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Tanh接口/Tanh接口"
                }
              ]
            },
            {
              "text": "Trunc接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetTruncMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Trunc接口/GetTruncMaxMinTmpSize"
                },
                {
                  "text": "GetTruncTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Trunc接口/GetTruncTmpBufferFactorSize"
                },
                {
                  "text": "Trunc",
                  "link": "/api/SIMD-API/高阶API/数学计算/Trunc接口/Trunc"
                },
                {
                  "text": "Trunc接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Trunc接口/Trunc接口"
                }
              ]
            },
            {
              "text": "Where接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetWhereMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Where接口/GetWhereMaxMinTmpSize"
                },
                {
                  "text": "GetWhereTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Where接口/GetWhereTmpBufferFactorSize"
                },
                {
                  "text": "Where",
                  "link": "/api/SIMD-API/高阶API/数学计算/Where接口/Where"
                },
                {
                  "text": "Where接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Where接口/Where接口"
                }
              ]
            },
            {
              "text": "Xor接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetXorMaxMinTmpSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Xor接口/GetXorMaxMinTmpSize"
                },
                {
                  "text": "GetXorTmpBufferFactorSize",
                  "link": "/api/SIMD-API/高阶API/数学计算/Xor接口/GetXorTmpBufferFactorSize"
                },
                {
                  "text": "Xor-82",
                  "link": "/api/SIMD-API/高阶API/数学计算/Xor接口/Xor-82"
                },
                {
                  "text": "Xor接口",
                  "link": "/api/SIMD-API/高阶API/数学计算/Xor接口/Xor接口"
                }
              ]
            }
          ]
        },
        {
          "text": "随机函数",
          "collapsed": true,
          "items": [
            {
              "text": "随机函数",
              "link": "/api/SIMD-API/高阶API/随机函数/随机函数"
            },
            {
              "text": "PhiloxRandom",
              "link": "/api/SIMD-API/高阶API/随机函数/PhiloxRandom"
            }
          ]
        },
        {
          "text": "索引计算",
          "collapsed": true,
          "items": [
            {
              "text": "索引计算",
              "link": "/api/SIMD-API/高阶API/索引计算/索引计算"
            },
            {
              "text": "Arange-94",
              "link": "/api/SIMD-API/高阶API/索引计算/Arange-94"
            },
            {
              "text": "GetArangeMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/索引计算/GetArangeMaxMinTmpSize"
            }
          ]
        },
        {
          "text": "张量变换",
          "collapsed": true,
          "items": [
            {
              "text": "张量变换",
              "link": "/api/SIMD-API/高阶API/张量变换/张量变换"
            },
            {
              "text": "Broadcast",
              "link": "/api/SIMD-API/高阶API/张量变换/Broadcast"
            },
            {
              "text": "Fill-97",
              "link": "/api/SIMD-API/高阶API/张量变换/Fill-97"
            },
            {
              "text": "GetBroadCastMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/张量变换/GetBroadCastMaxMinTmpSize"
            },
            {
              "text": "GetTransDataMaxMinTmpSize",
              "link": "/api/SIMD-API/高阶API/张量变换/GetTransDataMaxMinTmpSize"
            },
            {
              "text": "Pad-Tiling",
              "link": "/api/SIMD-API/高阶API/张量变换/Pad-Tiling"
            },
            {
              "text": "Pad",
              "link": "/api/SIMD-API/高阶API/张量变换/Pad"
            },
            {
              "text": "TransData",
              "link": "/api/SIMD-API/高阶API/张量变换/TransData"
            },
            {
              "text": "Transpose-96",
              "link": "/api/SIMD-API/高阶API/张量变换/Transpose-96"
            },
            {
              "text": "Transpose-Tiling",
              "link": "/api/SIMD-API/高阶API/张量变换/Transpose-Tiling"
            },
            {
              "text": "UnPad-Tiling",
              "link": "/api/SIMD-API/高阶API/张量变换/UnPad-Tiling"
            },
            {
              "text": "UnPad",
              "link": "/api/SIMD-API/高阶API/张量变换/UnPad"
            }
          ]
        },
        {
          "text": "HCCL通信类",
          "collapsed": true,
          "items": [
            {
              "text": "HCCL通信类",
              "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL通信类"
            },
            {
              "text": "HCCL-Context",
              "collapsed": true,
              "items": [
                {
                  "text": "GetHcclContext",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Context/GetHcclContext"
                },
                {
                  "text": "HCCL-Context",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Context/HCCL-Context"
                },
                {
                  "text": "HCCL-Context简介",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Context/HCCL-Context简介"
                },
                {
                  "text": "SetHcclContext",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Context/SetHcclContext"
                }
              ]
            },
            {
              "text": "HCCL-Kernel侧接口",
              "collapsed": true,
              "items": [
                {
                  "text": "AllGather",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AllGather"
                },
                {
                  "text": "AllReduce",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AllReduce"
                },
                {
                  "text": "AlltoAll",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AlltoAll"
                },
                {
                  "text": "AlltoAllV",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AlltoAllV"
                },
                {
                  "text": "AlltoAllvWrite",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AlltoAllvWrite"
                },
                {
                  "text": "BatchWrite",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/BatchWrite"
                },
                {
                  "text": "Commit",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/Commit"
                },
                {
                  "text": "Finalize",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/Finalize"
                },
                {
                  "text": "GetQueueNum",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/GetQueueNum"
                },
                {
                  "text": "GetRankDim",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/GetRankDim"
                },
                {
                  "text": "GetRankId",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/GetRankId"
                },
                {
                  "text": "GetWindowsInAddr",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/GetWindowsInAddr"
                },
                {
                  "text": "GetWindowsOutAddr",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/GetWindowsOutAddr"
                },
                {
                  "text": "HCCL-Kernel侧接口",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/HCCL-Kernel侧接口"
                },
                {
                  "text": "HCCL模板参数",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/HCCL模板参数"
                },
                {
                  "text": "HCCL使用说明",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/HCCL使用说明"
                },
                {
                  "text": "Init（废弃）",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/Init（废弃）"
                },
                {
                  "text": "InitV2",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/InitV2"
                },
                {
                  "text": "InterHcclGroupSync",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/InterHcclGroupSync"
                },
                {
                  "text": "Iterate-99",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/Iterate-99"
                },
                {
                  "text": "Query",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/Query"
                },
                {
                  "text": "QueueBarrier",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/QueueBarrier"
                },
                {
                  "text": "ReduceScatter",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/ReduceScatter"
                },
                {
                  "text": "SetCcTiling（废弃）",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/SetCcTiling（废弃）"
                },
                {
                  "text": "SetCcTilingV2",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/SetCcTilingV2"
                },
                {
                  "text": "Wait-98",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/Wait-98"
                }
              ]
            },
            {
              "text": "HCCL-Tiling侧接口",
              "collapsed": true,
              "items": [
                {
                  "text": "GetTiling-100",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/GetTiling-100"
                },
                {
                  "text": "HCCL-Tiling侧接口",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/HCCL-Tiling侧接口"
                },
                {
                  "text": "HCCL-Tiling构造函数",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/HCCL-Tiling构造函数"
                },
                {
                  "text": "HCCL-Tiling使用说明",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/HCCL-Tiling使用说明"
                },
                {
                  "text": "SetAlgConfig",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetAlgConfig"
                },
                {
                  "text": "SetCommBlockNum",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetCommBlockNum"
                },
                {
                  "text": "SetCommEngine",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetCommEngine"
                },
                {
                  "text": "SetDebugMode",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetDebugMode"
                },
                {
                  "text": "SetGroupName",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetGroupName"
                },
                {
                  "text": "SetOpType",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetOpType"
                },
                {
                  "text": "SetQueueNum",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetQueueNum"
                },
                {
                  "text": "SetReduceType",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetReduceType"
                },
                {
                  "text": "SetSkipBufferWindowCopy",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetSkipBufferWindowCopy"
                },
                {
                  "text": "SetSkipLocalRankCopy",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetSkipLocalRankCopy"
                },
                {
                  "text": "SetStepSize",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/SetStepSize"
                },
                {
                  "text": "TilingData结构体",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/TilingData结构体"
                },
                {
                  "text": "v1版本TilingData（废弃）",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/v1版本TilingData（废弃）"
                },
                {
                  "text": "v2版本TilingData（废弃）",
                  "link": "/api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/v2版本TilingData（废弃）"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "text": "基础数据结构",
      "collapsed": true,
      "items": [
        {
          "text": "基础数据结构",
          "link": "/api/SIMD-API/基础数据结构/基础数据结构"
        },
        {
          "text": "内置数据类型",
          "link": "/api/SIMD-API/基础数据结构/内置数据类型"
        },
        {
          "text": "Coordinate",
          "collapsed": true,
          "items": [
            {
              "text": "Coordinate",
              "link": "/api/SIMD-API/基础数据结构/Coordinate/Coordinate"
            },
            {
              "text": "Coordinate简介",
              "link": "/api/SIMD-API/基础数据结构/Coordinate/Coordinate简介"
            },
            {
              "text": "Crd2Idx",
              "link": "/api/SIMD-API/基础数据结构/Coordinate/Crd2Idx"
            },
            {
              "text": "MakeCoord",
              "link": "/api/SIMD-API/基础数据结构/Coordinate/MakeCoord"
            }
          ]
        },
        {
          "text": "GlobalTensor",
          "collapsed": true,
          "items": [
            {
              "text": "GetPhyAddr-0",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/GetPhyAddr-0"
            },
            {
              "text": "GetShapeInfo-7",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/GetShapeInfo-7"
            },
            {
              "text": "GetSize-4",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/GetSize-4"
            },
            {
              "text": "GetValue-1",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/GetValue-1"
            },
            {
              "text": "GlobalTensor",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/GlobalTensor"
            },
            {
              "text": "GlobalTensor构造函数",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/GlobalTensor构造函数"
            },
            {
              "text": "GlobalTensor简介",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/GlobalTensor简介"
            },
            {
              "text": "operator-5",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/operator-5"
            },
            {
              "text": "operator()-2",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/operator()-2"
            },
            {
              "text": "ReinterpretCast-8",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/ReinterpretCast-8"
            },
            {
              "text": "SetGlobalBuffer",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/SetGlobalBuffer"
            },
            {
              "text": "SetL2CacheHint",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/SetL2CacheHint"
            },
            {
              "text": "SetShapeInfo-6",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/SetShapeInfo-6"
            },
            {
              "text": "SetValue-3",
              "link": "/api/SIMD-API/基础数据结构/GlobalTensor/SetValue-3"
            }
          ]
        },
        {
          "text": "Layout",
          "collapsed": true,
          "items": [
            {
              "text": "运算符重载",
              "link": "/api/SIMD-API/基础数据结构/Layout/运算符重载"
            },
            {
              "text": "GetShape",
              "link": "/api/SIMD-API/基础数据结构/Layout/GetShape"
            },
            {
              "text": "GetStride",
              "link": "/api/SIMD-API/基础数据结构/Layout/GetStride"
            },
            {
              "text": "is_layout",
              "link": "/api/SIMD-API/基础数据结构/Layout/is_layout"
            },
            {
              "text": "Layout",
              "link": "/api/SIMD-API/基础数据结构/Layout/Layout"
            },
            {
              "text": "layout1",
              "link": "/api/SIMD-API/基础数据结构/Layout/layout1"
            },
            {
              "text": "Layout构造函数",
              "link": "/api/SIMD-API/基础数据结构/Layout/Layout构造函数"
            },
            {
              "text": "Layout简介",
              "link": "/api/SIMD-API/基础数据结构/Layout/Layout简介"
            },
            {
              "text": "MakeLayout",
              "link": "/api/SIMD-API/基础数据结构/Layout/MakeLayout"
            },
            {
              "text": "MakeShape",
              "link": "/api/SIMD-API/基础数据结构/Layout/MakeShape"
            },
            {
              "text": "MakeStride",
              "link": "/api/SIMD-API/基础数据结构/Layout/MakeStride"
            }
          ]
        },
        {
          "text": "LocalTensor",
          "collapsed": true,
          "items": [
            {
              "text": "GetLength",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/GetLength"
            },
            {
              "text": "GetPhyAddr",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/GetPhyAddr"
            },
            {
              "text": "GetPosition",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/GetPosition"
            },
            {
              "text": "GetShapeInfo",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/GetShapeInfo"
            },
            {
              "text": "GetSize",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/GetSize"
            },
            {
              "text": "GetUserTag",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/GetUserTag"
            },
            {
              "text": "GetValue",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/GetValue"
            },
            {
              "text": "LocalTensor",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/LocalTensor"
            },
            {
              "text": "LocalTensor构造函数",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/LocalTensor构造函数"
            },
            {
              "text": "LocalTensor简介",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/LocalTensor简介"
            },
            {
              "text": "operator",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/operator"
            },
            {
              "text": "operator()",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/operator()"
            },
            {
              "text": "Print",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/Print"
            },
            {
              "text": "ReinterpretCast",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/ReinterpretCast"
            },
            {
              "text": "SetAddrWithOffset",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/SetAddrWithOffset"
            },
            {
              "text": "SetBufferLen",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/SetBufferLen"
            },
            {
              "text": "SetShapeInfo",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/SetShapeInfo"
            },
            {
              "text": "SetSize",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/SetSize"
            },
            {
              "text": "SetUserTag",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/SetUserTag"
            },
            {
              "text": "SetValue",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/SetValue"
            },
            {
              "text": "ToFile",
              "link": "/api/SIMD-API/基础数据结构/LocalTensor/ToFile"
            }
          ]
        },
        {
          "text": "TensorTrait",
          "collapsed": true,
          "items": [
            {
              "text": "更多样例",
              "link": "/api/SIMD-API/基础数据结构/TensorTrait/更多样例"
            },
            {
              "text": "GetLayout",
              "link": "/api/SIMD-API/基础数据结构/TensorTrait/GetLayout"
            },
            {
              "text": "is_tensorTrait",
              "link": "/api/SIMD-API/基础数据结构/TensorTrait/is_tensorTrait"
            },
            {
              "text": "MakeTensorTrait",
              "link": "/api/SIMD-API/基础数据结构/TensorTrait/MakeTensorTrait"
            },
            {
              "text": "SetLayout",
              "link": "/api/SIMD-API/基础数据结构/TensorTrait/SetLayout"
            },
            {
              "text": "TensorTrait",
              "link": "/api/SIMD-API/基础数据结构/TensorTrait/TensorTrait"
            },
            {
              "text": "TensorTrait构造函数",
              "link": "/api/SIMD-API/基础数据结构/TensorTrait/TensorTrait构造函数"
            },
            {
              "text": "TensorTrait简介",
              "link": "/api/SIMD-API/基础数据结构/TensorTrait/TensorTrait简介"
            }
          ]
        }
      ]
    },
    {
      "text": "基础API",
      "collapsed": true,
      "items": [
        {
          "text": "基础API",
          "link": "/api/SIMD-API/基础API/基础API"
        },
        {
          "text": "标量计算",
          "collapsed": true,
          "items": [
            {
              "text": "标量计算",
              "link": "/api/SIMD-API/基础API/标量计算/标量计算"
            },
            {
              "text": "Cast（多类型转float）",
              "link": "/api/SIMD-API/基础API/标量计算/Cast（多类型转float）"
            },
            {
              "text": "Cast（float转bfloat16_t）",
              "link": "/api/SIMD-API/基础API/标量计算/Cast（float转bfloat16_t）"
            },
            {
              "text": "Cast（float转half-int32_t）",
              "link": "/api/SIMD-API/基础API/标量计算/Cast（float转half-int32_t）"
            },
            {
              "text": "CountBitsCntSameAsSignBit",
              "link": "/api/SIMD-API/基础API/标量计算/CountBitsCntSameAsSignBit"
            },
            {
              "text": "CountLeadingZero",
              "link": "/api/SIMD-API/基础API/标量计算/CountLeadingZero"
            },
            {
              "text": "GetBitCount",
              "link": "/api/SIMD-API/基础API/标量计算/GetBitCount"
            },
            {
              "text": "GetSFFValue",
              "link": "/api/SIMD-API/基础API/标量计算/GetSFFValue"
            },
            {
              "text": "Nop",
              "link": "/api/SIMD-API/基础API/标量计算/Nop"
            },
            {
              "text": "ReadGmByPassDCache(ISASI)",
              "link": "/api/SIMD-API/基础API/标量计算/ReadGmByPassDCache(ISASI)"
            },
            {
              "text": "WriteGmByPassDCache(ISASI)",
              "link": "/api/SIMD-API/基础API/标量计算/WriteGmByPassDCache(ISASI)"
            }
          ]
        },
        {
          "text": "调试接口",
          "collapsed": true,
          "items": [
            {
              "text": "调试接口",
              "link": "/api/SIMD-API/基础API/调试接口/调试接口"
            },
            {
              "text": "上板打印",
              "collapsed": true,
              "items": [
                {
                  "text": "上板打印",
                  "link": "/api/SIMD-API/基础API/调试接口/上板打印/上板打印"
                },
                {
                  "text": "DumpAccChkPoint",
                  "link": "/api/SIMD-API/基础API/调试接口/上板打印/DumpAccChkPoint"
                },
                {
                  "text": "DumpTensor",
                  "link": "/api/SIMD-API/基础API/调试接口/上板打印/DumpTensor"
                },
                {
                  "text": "printf",
                  "link": "/api/SIMD-API/基础API/调试接口/上板打印/printf"
                },
                {
                  "text": "PrintTimeStamp",
                  "link": "/api/SIMD-API/基础API/调试接口/上板打印/PrintTimeStamp"
                }
              ]
            },
            {
              "text": "性能统计",
              "collapsed": true,
              "items": [
                {
                  "text": "性能统计",
                  "link": "/api/SIMD-API/基础API/调试接口/性能统计/性能统计"
                },
                {
                  "text": "MarkStamp",
                  "link": "/api/SIMD-API/基础API/调试接口/性能统计/MarkStamp"
                },
                {
                  "text": "MetricsProfStart",
                  "link": "/api/SIMD-API/基础API/调试接口/性能统计/MetricsProfStart"
                },
                {
                  "text": "MetricsProfStop",
                  "link": "/api/SIMD-API/基础API/调试接口/性能统计/MetricsProfStop"
                }
              ]
            },
            {
              "text": "异常检测",
              "collapsed": true,
              "items": [
                {
                  "text": "异常检测",
                  "link": "/api/SIMD-API/基础API/调试接口/异常检测/异常检测"
                },
                {
                  "text": "ascendc_assert",
                  "link": "/api/SIMD-API/基础API/调试接口/异常检测/ascendc_assert"
                },
                {
                  "text": "assert",
                  "link": "/api/SIMD-API/基础API/调试接口/异常检测/assert"
                },
                {
                  "text": "CheckLocalMemoryIA(ISASI)",
                  "link": "/api/SIMD-API/基础API/调试接口/异常检测/CheckLocalMemoryIA(ISASI)"
                },
                {
                  "text": "Trap",
                  "link": "/api/SIMD-API/基础API/调试接口/异常检测/Trap"
                }
              ]
            },
            {
              "text": "CPU孪生调试",
              "collapsed": true,
              "items": [
                {
                  "text": "CPU孪生调试",
                  "link": "/api/SIMD-API/基础API/调试接口/CPU孪生调试/CPU孪生调试"
                },
                {
                  "text": "GmAlloc",
                  "link": "/api/SIMD-API/基础API/调试接口/CPU孪生调试/GmAlloc"
                },
                {
                  "text": "GmFree",
                  "link": "/api/SIMD-API/基础API/调试接口/CPU孪生调试/GmFree"
                },
                {
                  "text": "ICPU_RUN_KF",
                  "link": "/api/SIMD-API/基础API/调试接口/CPU孪生调试/ICPU_RUN_KF"
                },
                {
                  "text": "ICPU_SET_TILING_KEY",
                  "link": "/api/SIMD-API/基础API/调试接口/CPU孪生调试/ICPU_SET_TILING_KEY"
                },
                {
                  "text": "SetKernelMode",
                  "link": "/api/SIMD-API/基础API/调试接口/CPU孪生调试/SetKernelMode"
                }
              ]
            }
          ]
        },
        {
          "text": "工具函数",
          "collapsed": true,
          "items": [
            {
              "text": "工具函数",
              "link": "/api/SIMD-API/基础API/工具函数/工具函数"
            },
            {
              "text": "Async",
              "link": "/api/SIMD-API/基础API/工具函数/Async"
            },
            {
              "text": "CeilDivision",
              "link": "/api/SIMD-API/基础API/工具函数/CeilDivision"
            },
            {
              "text": "GetRuntimeUBSize",
              "link": "/api/SIMD-API/基础API/工具函数/GetRuntimeUBSize"
            },
            {
              "text": "GetSsbufBaseAddr",
              "link": "/api/SIMD-API/基础API/工具函数/GetSsbufBaseAddr"
            },
            {
              "text": "GetTaskRatio",
              "link": "/api/SIMD-API/基础API/工具函数/GetTaskRatio"
            },
            {
              "text": "GetUBSizeInBytes",
              "link": "/api/SIMD-API/基础API/工具函数/GetUBSizeInBytes"
            },
            {
              "text": "GetVecLen",
              "link": "/api/SIMD-API/基础API/工具函数/GetVecLen"
            },
            {
              "text": "NumericLimits",
              "collapsed": true,
              "items": [
                {
                  "text": "简介-76",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/简介-76"
                },
                {
                  "text": "DeNormMin",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/DeNormMin"
                },
                {
                  "text": "Infinity",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/Infinity"
                },
                {
                  "text": "Lowest",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/Lowest"
                },
                {
                  "text": "Max-77",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/Max-77"
                },
                {
                  "text": "Min-78",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/Min-78"
                },
                {
                  "text": "NegativeInfinity",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/NegativeInfinity"
                },
                {
                  "text": "NumericLimits",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/NumericLimits"
                },
                {
                  "text": "QuietNaN",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/QuietNaN"
                },
                {
                  "text": "SignalingNaN",
                  "link": "/api/SIMD-API/基础API/工具函数/NumericLimits/SignalingNaN"
                }
              ]
            }
          ]
        },
        {
          "text": "缓存控制",
          "collapsed": true,
          "items": [
            {
              "text": "缓存控制",
              "link": "/api/SIMD-API/基础API/缓存控制/缓存控制"
            },
            {
              "text": "DataCacheCleanAndInvalid",
              "link": "/api/SIMD-API/基础API/缓存控制/DataCacheCleanAndInvalid"
            },
            {
              "text": "DataCachePreload",
              "link": "/api/SIMD-API/基础API/缓存控制/DataCachePreload"
            },
            {
              "text": "GetICachePreloadStatus(ISASI)",
              "link": "/api/SIMD-API/基础API/缓存控制/GetICachePreloadStatus(ISASI)"
            },
            {
              "text": "ICachePreLoad(ISASI)",
              "link": "/api/SIMD-API/基础API/缓存控制/ICachePreLoad(ISASI)"
            }
          ]
        },
        {
          "text": "矩阵计算（ISASI）",
          "collapsed": true,
          "items": [
            {
              "text": "矩阵计算（ISASI）",
              "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算（ISASI）"
            },
            {
              "text": "矩阵计算",
              "collapsed": true,
              "items": [
                {
                  "text": "矩阵计算",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/矩阵计算"
                },
                {
                  "text": "Conv2D（废弃）",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/Conv2D（废弃）"
                },
                {
                  "text": "Gemm（废弃）",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/Gemm（废弃）"
                },
                {
                  "text": "Mmad",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/Mmad"
                },
                {
                  "text": "MmadBitMode",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/MmadBitMode"
                },
                {
                  "text": "MmadWithSparse",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/MmadWithSparse"
                },
                {
                  "text": "SetHF32Mode",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/SetHF32Mode"
                },
                {
                  "text": "SetHF32TransMode",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/SetHF32TransMode"
                },
                {
                  "text": "SetMMColumnMajor",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/SetMMColumnMajor"
                },
                {
                  "text": "SetMMRowMajor",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/矩阵计算/SetMMRowMajor"
                }
              ]
            },
            {
              "text": "数据搬运",
              "collapsed": true,
              "items": [
                {
                  "text": "数据搬运",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/数据搬运"
                },
                {
                  "text": "Fill",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/Fill"
                },
                {
                  "text": "Fixpipe",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/Fixpipe"
                },
                {
                  "text": "LoadDataUnzip",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadDataUnzip"
                },
                {
                  "text": "LoadDataWithSparse",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadDataWithSparse"
                },
                {
                  "text": "LoadDataWithTranspose",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadDataWithTranspose"
                },
                {
                  "text": "LoadImageToLocal",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadImageToLocal"
                },
                {
                  "text": "LoadUnzipIndex",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadUnzipIndex"
                },
                {
                  "text": "SetAippFunctions",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetAippFunctions"
                },
                {
                  "text": "SetFixPipeAddr",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetFixPipeAddr"
                },
                {
                  "text": "SetFixPipeClipRelu",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetFixPipeClipRelu"
                },
                {
                  "text": "SetFixPipeConfig",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetFixPipeConfig"
                },
                {
                  "text": "SetFixpipeNz2ndFlag",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetFixpipeNz2ndFlag"
                },
                {
                  "text": "SetFixpipePreQuantFlag",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetFixpipePreQuantFlag"
                },
                {
                  "text": "SetFmatrix",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetFmatrix"
                },
                {
                  "text": "SetFmatrixBitMode",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetFmatrixBitMode"
                },
                {
                  "text": "SetLoadDataBoundary",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetLoadDataBoundary"
                },
                {
                  "text": "SetLoadDataPaddingValue",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetLoadDataPaddingValue"
                },
                {
                  "text": "SetLoadDataRepeat",
                  "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/SetLoadDataRepeat"
                },
                {
                  "text": "LoadData",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Load2D",
                      "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadData/Load2D"
                    },
                    {
                      "text": "Load2DBitMode",
                      "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadData/Load2DBitMode"
                    },
                    {
                      "text": "Load2DMX",
                      "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadData/Load2DMX"
                    },
                    {
                      "text": "Load3D",
                      "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadData/Load3D"
                    },
                    {
                      "text": "Load3DBitMode",
                      "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadData/Load3DBitMode"
                    },
                    {
                      "text": "LoadData",
                      "link": "/api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadData/LoadData"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "text": "同步控制",
          "collapsed": true,
          "items": [
            {
              "text": "同步控制-73",
              "link": "/api/SIMD-API/基础API/同步控制/同步控制-73"
            },
            {
              "text": "核间同步",
              "collapsed": true,
              "items": [
                {
                  "text": "核间同步",
                  "link": "/api/SIMD-API/基础API/同步控制/核间同步/核间同步"
                },
                {
                  "text": "CrossCoreSetFlag(ISASI)",
                  "link": "/api/SIMD-API/基础API/同步控制/核间同步/CrossCoreSetFlag(ISASI)"
                },
                {
                  "text": "CrossCoreWaitFlag(ISASI)",
                  "link": "/api/SIMD-API/基础API/同步控制/核间同步/CrossCoreWaitFlag(ISASI)"
                },
                {
                  "text": "IBSet",
                  "link": "/api/SIMD-API/基础API/同步控制/核间同步/IBSet"
                },
                {
                  "text": "IBWait",
                  "link": "/api/SIMD-API/基础API/同步控制/核间同步/IBWait"
                },
                {
                  "text": "InitDetermineComputeWorkspace",
                  "link": "/api/SIMD-API/基础API/同步控制/核间同步/InitDetermineComputeWorkspace"
                },
                {
                  "text": "NotifyNextBlock",
                  "link": "/api/SIMD-API/基础API/同步控制/核间同步/NotifyNextBlock"
                },
                {
                  "text": "SyncAll",
                  "link": "/api/SIMD-API/基础API/同步控制/核间同步/SyncAll"
                },
                {
                  "text": "WaitPreBlock",
                  "link": "/api/SIMD-API/基础API/同步控制/核间同步/WaitPreBlock"
                }
              ]
            },
            {
              "text": "核内同步",
              "collapsed": true,
              "items": [
                {
                  "text": "核内同步",
                  "link": "/api/SIMD-API/基础API/同步控制/核内同步/核内同步"
                },
                {
                  "text": "同步控制简介",
                  "link": "/api/SIMD-API/基础API/同步控制/核内同步/同步控制简介"
                },
                {
                  "text": "AllocMutexID-(ISASI)",
                  "link": "/api/SIMD-API/基础API/同步控制/核内同步/AllocMutexID-(ISASI)"
                },
                {
                  "text": "DataSyncBarrier(ISASI)",
                  "link": "/api/SIMD-API/基础API/同步控制/核内同步/DataSyncBarrier(ISASI)"
                },
                {
                  "text": "PipeBarrier(ISASI)",
                  "link": "/api/SIMD-API/基础API/同步控制/核内同步/PipeBarrier(ISASI)"
                },
                {
                  "text": "ReleaseMutexID-(ISASI)",
                  "link": "/api/SIMD-API/基础API/同步控制/核内同步/ReleaseMutexID-(ISASI)"
                },
                {
                  "text": "SetFlag-WaitFlag(ISASI)",
                  "link": "/api/SIMD-API/基础API/同步控制/核内同步/SetFlag-WaitFlag(ISASI)"
                },
                {
                  "text": "Mutex（ISASI）",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "简介",
                      "link": "/api/SIMD-API/基础API/同步控制/核内同步/Mutex（ISASI）/简介"
                    },
                    {
                      "text": "Lock",
                      "link": "/api/SIMD-API/基础API/同步控制/核内同步/Mutex（ISASI）/Lock"
                    },
                    {
                      "text": "Mutex（ISASI）",
                      "link": "/api/SIMD-API/基础API/同步控制/核内同步/Mutex（ISASI）/Mutex（ISASI）"
                    },
                    {
                      "text": "Unlock",
                      "link": "/api/SIMD-API/基础API/同步控制/核内同步/Mutex（ISASI）/Unlock"
                    }
                  ]
                },
                {
                  "text": "TQueSync",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "模板参数",
                      "link": "/api/SIMD-API/基础API/同步控制/核内同步/TQueSync/模板参数"
                    },
                    {
                      "text": "SetFlag-WaitFlag",
                      "link": "/api/SIMD-API/基础API/同步控制/核内同步/TQueSync/SetFlag-WaitFlag"
                    },
                    {
                      "text": "TQueSync",
                      "link": "/api/SIMD-API/基础API/同步控制/核内同步/TQueSync/TQueSync"
                    }
                  ]
                }
              ]
            },
            {
              "text": "任务间同步",
              "collapsed": true,
              "items": [
                {
                  "text": "任务间同步",
                  "link": "/api/SIMD-API/基础API/同步控制/任务间同步/任务间同步"
                },
                {
                  "text": "SetNextTaskStart",
                  "link": "/api/SIMD-API/基础API/同步控制/任务间同步/SetNextTaskStart"
                },
                {
                  "text": "WaitPreTaskEnd",
                  "link": "/api/SIMD-API/基础API/同步控制/任务间同步/WaitPreTaskEnd"
                }
              ]
            }
          ]
        },
        {
          "text": "系统变量访问",
          "collapsed": true,
          "items": [
            {
              "text": "系统变量访问-74",
              "link": "/api/SIMD-API/基础API/系统变量访问/系统变量访问-74"
            },
            {
              "text": "GetArchVersion",
              "link": "/api/SIMD-API/基础API/系统变量访问/GetArchVersion"
            },
            {
              "text": "GetBlockIdx",
              "link": "/api/SIMD-API/基础API/系统变量访问/GetBlockIdx"
            },
            {
              "text": "GetBlockNum",
              "link": "/api/SIMD-API/基础API/系统变量访问/GetBlockNum"
            },
            {
              "text": "GetCtrlSpr(ISASI)",
              "link": "/api/SIMD-API/基础API/系统变量访问/GetCtrlSpr(ISASI)"
            },
            {
              "text": "GetDataBlockSizeInBytes",
              "link": "/api/SIMD-API/基础API/系统变量访问/GetDataBlockSizeInBytes"
            },
            {
              "text": "GetProgramCounter(ISASI)",
              "link": "/api/SIMD-API/基础API/系统变量访问/GetProgramCounter(ISASI)"
            },
            {
              "text": "GetSubBlockIdx(ISASI)",
              "link": "/api/SIMD-API/基础API/系统变量访问/GetSubBlockIdx(ISASI)"
            },
            {
              "text": "GetSubBlockNum(ISASI)",
              "link": "/api/SIMD-API/基础API/系统变量访问/GetSubBlockNum(ISASI)"
            },
            {
              "text": "GetSystemCycle(ISASI)",
              "link": "/api/SIMD-API/基础API/系统变量访问/GetSystemCycle(ISASI)"
            },
            {
              "text": "InitSocState",
              "link": "/api/SIMD-API/基础API/系统变量访问/InitSocState"
            },
            {
              "text": "ResetCtrlSpr(ISASI)",
              "link": "/api/SIMD-API/基础API/系统变量访问/ResetCtrlSpr(ISASI)"
            },
            {
              "text": "SetCtrlSpr(ISASI)",
              "link": "/api/SIMD-API/基础API/系统变量访问/SetCtrlSpr(ISASI)"
            }
          ]
        },
        {
          "text": "原子操作",
          "collapsed": true,
          "items": [
            {
              "text": "原子操作",
              "link": "/api/SIMD-API/基础API/原子操作/原子操作"
            },
            {
              "text": "AtomicAdd",
              "link": "/api/SIMD-API/基础API/原子操作/AtomicAdd"
            },
            {
              "text": "AtomicCas",
              "link": "/api/SIMD-API/基础API/原子操作/AtomicCas"
            },
            {
              "text": "AtomicExch",
              "link": "/api/SIMD-API/基础API/原子操作/AtomicExch"
            },
            {
              "text": "AtomicMax",
              "link": "/api/SIMD-API/基础API/原子操作/AtomicMax"
            },
            {
              "text": "AtomicMin",
              "link": "/api/SIMD-API/基础API/原子操作/AtomicMin"
            },
            {
              "text": "DisableDmaAtomic",
              "link": "/api/SIMD-API/基础API/原子操作/DisableDmaAtomic"
            },
            {
              "text": "GetStoreAtomicConfig(ISASI)",
              "link": "/api/SIMD-API/基础API/原子操作/GetStoreAtomicConfig(ISASI)"
            },
            {
              "text": "SetAtomicAdd",
              "link": "/api/SIMD-API/基础API/原子操作/SetAtomicAdd"
            },
            {
              "text": "SetAtomicMax(ISASI)",
              "link": "/api/SIMD-API/基础API/原子操作/SetAtomicMax(ISASI)"
            },
            {
              "text": "SetAtomicMin(ISASI)",
              "link": "/api/SIMD-API/基础API/原子操作/SetAtomicMin(ISASI)"
            },
            {
              "text": "SetAtomicType",
              "link": "/api/SIMD-API/基础API/原子操作/SetAtomicType"
            },
            {
              "text": "SetStoreAtomicConfig(ISASI)",
              "link": "/api/SIMD-API/基础API/原子操作/SetStoreAtomicConfig(ISASI)"
            }
          ]
        },
        {
          "text": "资源管理",
          "collapsed": true,
          "items": [
            {
              "text": "资源管理",
              "link": "/api/SIMD-API/基础API/资源管理/资源管理"
            },
            {
              "text": "临时空间管理",
              "collapsed": true,
              "items": [
                {
                  "text": "临时空间管理",
                  "link": "/api/SIMD-API/基础API/资源管理/临时空间管理/临时空间管理"
                },
                {
                  "text": "PopStackBuffer",
                  "link": "/api/SIMD-API/基础API/资源管理/临时空间管理/PopStackBuffer"
                },
                {
                  "text": "workspace",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "GetSysWorkSpacePtr",
                      "link": "/api/SIMD-API/基础API/资源管理/临时空间管理/workspace/GetSysWorkSpacePtr"
                    },
                    {
                      "text": "GetUserWorkspace",
                      "link": "/api/SIMD-API/基础API/资源管理/临时空间管理/workspace/GetUserWorkspace"
                    },
                    {
                      "text": "SetSysWorkSpace",
                      "link": "/api/SIMD-API/基础API/资源管理/临时空间管理/workspace/SetSysWorkSpace"
                    },
                    {
                      "text": "workspace1",
                      "link": "/api/SIMD-API/基础API/资源管理/临时空间管理/workspace/workspace1"
                    }
                  ]
                }
              ]
            },
            {
              "text": "内存管理",
              "collapsed": true,
              "items": [
                {
                  "text": "内存管理",
                  "link": "/api/SIMD-API/基础API/资源管理/内存管理/内存管理"
                },
                {
                  "text": "LocalMemAllocator",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Alloc",
                      "link": "/api/SIMD-API/基础API/资源管理/内存管理/LocalMemAllocator/Alloc"
                    },
                    {
                      "text": "GetCurAddr-72",
                      "link": "/api/SIMD-API/基础API/资源管理/内存管理/LocalMemAllocator/GetCurAddr-72"
                    },
                    {
                      "text": "LocalMemAllocator",
                      "link": "/api/SIMD-API/基础API/资源管理/内存管理/LocalMemAllocator/LocalMemAllocator"
                    },
                    {
                      "text": "LocalMemAllocator构造函数",
                      "link": "/api/SIMD-API/基础API/资源管理/内存管理/LocalMemAllocator/LocalMemAllocator构造函数"
                    },
                    {
                      "text": "LocalMemAllocator简介",
                      "link": "/api/SIMD-API/基础API/资源管理/内存管理/LocalMemAllocator/LocalMemAllocator简介"
                    }
                  ]
                }
              ]
            },
            {
              "text": "Pipe和Que框架",
              "collapsed": true,
              "items": [
                {
                  "text": "GetTPipePtr",
                  "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/GetTPipePtr"
                },
                {
                  "text": "Pipe和Que框架",
                  "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/Pipe和Que框架"
                },
                {
                  "text": "自定义TBufPool",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "自定义TBufPool",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/自定义TBufPool/自定义TBufPool"
                    },
                    {
                      "text": "EXTERN_IMPL_BUFPOOL宏",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/自定义TBufPool/EXTERN_IMPL_BUFPOOL宏"
                    },
                    {
                      "text": "GetBufHandle",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/自定义TBufPool/GetBufHandle"
                    },
                    {
                      "text": "GetCurAddr",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/自定义TBufPool/GetCurAddr"
                    },
                    {
                      "text": "GetCurBufSize",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/自定义TBufPool/GetCurBufSize"
                    },
                    {
                      "text": "Init-59",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/自定义TBufPool/Init-59"
                    },
                    {
                      "text": "Reset-58",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/自定义TBufPool/Reset-58"
                    },
                    {
                      "text": "SetCurAddr",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/自定义TBufPool/SetCurAddr"
                    },
                    {
                      "text": "SetCurBufSize",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/自定义TBufPool/SetCurBufSize"
                    }
                  ]
                },
                {
                  "text": "TBuf",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "Get",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBuf/Get"
                    },
                    {
                      "text": "GetWithOffset",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBuf/GetWithOffset"
                    },
                    {
                      "text": "TBuf",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBuf/TBuf"
                    },
                    {
                      "text": "TBuf构造函数",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBuf/TBuf构造函数"
                    },
                    {
                      "text": "TBuf简介",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBuf/TBuf简介"
                    }
                  ]
                },
                {
                  "text": "TBufPool",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "InitBuffer-56",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBufPool/InitBuffer-56"
                    },
                    {
                      "text": "InitBufPool-55",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBufPool/InitBufPool-55"
                    },
                    {
                      "text": "Reset-57",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBufPool/Reset-57"
                    },
                    {
                      "text": "TBufPool",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBufPool/TBufPool"
                    },
                    {
                      "text": "TBufPool构造函数",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBufPool/TBufPool构造函数"
                    },
                    {
                      "text": "TBufPool简介",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TBufPool/TBufPool简介"
                    }
                  ]
                },
                {
                  "text": "TPipe",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "AllocEventID",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/AllocEventID"
                    },
                    {
                      "text": "Destroy",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/Destroy"
                    },
                    {
                      "text": "DestroyWithoutPipeAll",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/DestroyWithoutPipeAll"
                    },
                    {
                      "text": "FetchEventID",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/FetchEventID"
                    },
                    {
                      "text": "GetBaseAddr",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/GetBaseAddr"
                    },
                    {
                      "text": "Init",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/Init"
                    },
                    {
                      "text": "InitBuffer",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/InitBuffer"
                    },
                    {
                      "text": "InitBufPool",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/InitBufPool"
                    },
                    {
                      "text": "InitSpmBuffer",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/InitSpmBuffer"
                    },
                    {
                      "text": "ReadSpmBuffer",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/ReadSpmBuffer"
                    },
                    {
                      "text": "ReleaseEventID",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/ReleaseEventID"
                    },
                    {
                      "text": "Reset",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/Reset"
                    },
                    {
                      "text": "TPipe",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/TPipe"
                    },
                    {
                      "text": "TPipe构造函数",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/TPipe构造函数"
                    },
                    {
                      "text": "TPipe简介",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/TPipe简介"
                    },
                    {
                      "text": "WriteSpmBuffer",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TPipe/WriteSpmBuffer"
                    }
                  ]
                },
                {
                  "text": "TQue",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "AllocTensor",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/AllocTensor"
                    },
                    {
                      "text": "DeQue",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/DeQue"
                    },
                    {
                      "text": "EnQue",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/EnQue"
                    },
                    {
                      "text": "FreeTensor",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/FreeTensor"
                    },
                    {
                      "text": "GetTensorCountInQue",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/GetTensorCountInQue"
                    },
                    {
                      "text": "HasIdleBuffer",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/HasIdleBuffer"
                    },
                    {
                      "text": "HasTensorInQue",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/HasTensorInQue"
                    },
                    {
                      "text": "TQue",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/TQue"
                    },
                    {
                      "text": "TQue简介",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/TQue简介"
                    },
                    {
                      "text": "VacantInQue",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/VacantInQue"
                    }
                  ]
                },
                {
                  "text": "TQueBind",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "AllocTensor-64",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/AllocTensor-64"
                    },
                    {
                      "text": "DeQue-67",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/DeQue-67"
                    },
                    {
                      "text": "EnQue-66",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/EnQue-66"
                    },
                    {
                      "text": "FreeAllEvent",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/FreeAllEvent"
                    },
                    {
                      "text": "FreeTensor-65",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/FreeTensor-65"
                    },
                    {
                      "text": "GetTensorCountInQue-70",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/GetTensorCountInQue-70"
                    },
                    {
                      "text": "HasIdleBuffer-71",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/HasIdleBuffer-71"
                    },
                    {
                      "text": "HasTensorInQue-69",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/HasTensorInQue-69"
                    },
                    {
                      "text": "InitBufHandle",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/InitBufHandle"
                    },
                    {
                      "text": "InitStartBufHandle",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/InitStartBufHandle"
                    },
                    {
                      "text": "TQueBind",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/TQueBind"
                    },
                    {
                      "text": "TQueBind构造函数",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/TQueBind构造函数"
                    },
                    {
                      "text": "TQueBind简介",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/TQueBind简介"
                    },
                    {
                      "text": "VacantInQue-68",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/VacantInQue-68"
                    }
                  ]
                },
                {
                  "text": "TSCM",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "AllocTensor-60",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TSCM/AllocTensor-60"
                    },
                    {
                      "text": "DeQue-63",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TSCM/DeQue-63"
                    },
                    {
                      "text": "EnQue-62",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TSCM/EnQue-62"
                    },
                    {
                      "text": "FreeTensor-61",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TSCM/FreeTensor-61"
                    },
                    {
                      "text": "TSCM",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TSCM/TSCM"
                    },
                    {
                      "text": "TSCM简介",
                      "link": "/api/SIMD-API/基础API/资源管理/Pipe和Que框架/TSCM/TSCM简介"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "text": "Cube分组管理（ISASI）",
          "collapsed": true,
          "items": [
            {
              "text": "Cube分组管理（ISASI）",
              "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/Cube分组管理（ISASI）"
            },
            {
              "text": "CubeResGroupHandle",
              "collapsed": true,
              "items": [
                {
                  "text": "AllocMessage",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/AllocMessage"
                },
                {
                  "text": "AssignQueue",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/AssignQueue"
                },
                {
                  "text": "CreateCubeResGroup",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/CreateCubeResGroup"
                },
                {
                  "text": "CubeResGroupHandle",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/CubeResGroupHandle"
                },
                {
                  "text": "CubeResGroupHandle构造函数",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/CubeResGroupHandle构造函数"
                },
                {
                  "text": "CubeResGroupHandle使用说明",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/CubeResGroupHandle使用说明"
                },
                {
                  "text": "FreeMessage",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/FreeMessage"
                },
                {
                  "text": "PostFakeMsg",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/PostFakeMsg"
                },
                {
                  "text": "PostMessage",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/PostMessage"
                },
                {
                  "text": "SetQuit",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/SetQuit"
                },
                {
                  "text": "SetSkipMsg",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/SetSkipMsg"
                },
                {
                  "text": "Wait",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/Wait"
                }
              ]
            },
            {
              "text": "GroupBarrier",
              "collapsed": true,
              "items": [
                {
                  "text": "Arrive",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/GroupBarrier/Arrive"
                },
                {
                  "text": "GetWorkspaceLen",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/GroupBarrier/GetWorkspaceLen"
                },
                {
                  "text": "GroupBarrier",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/GroupBarrier/GroupBarrier"
                },
                {
                  "text": "GroupBarrier构造函数",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/GroupBarrier/GroupBarrier构造函数"
                },
                {
                  "text": "GroupBarrier使用说明",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/GroupBarrier/GroupBarrier使用说明"
                },
                {
                  "text": "Wait-75",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/GroupBarrier/Wait-75"
                }
              ]
            },
            {
              "text": "KfcWorkspace",
              "collapsed": true,
              "items": [
                {
                  "text": "构造函数与析构函数",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/KfcWorkspace/构造函数与析构函数"
                },
                {
                  "text": "GetKfcWorkspace",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/KfcWorkspace/GetKfcWorkspace"
                },
                {
                  "text": "KfcWorkspace",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/KfcWorkspace/KfcWorkspace"
                },
                {
                  "text": "UpdateKfcWorkspace",
                  "link": "/api/SIMD-API/基础API/Cube分组管理（ISASI）/KfcWorkspace/UpdateKfcWorkspace"
                }
              ]
            }
          ]
        },
        {
          "text": "Kernel-Tiling",
          "collapsed": true,
          "items": [
            {
              "text": "设置Kernel类型",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/设置Kernel类型"
            },
            {
              "text": "COPY_TILING_WITH_ARRAY",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/COPY_TILING_WITH_ARRAY"
            },
            {
              "text": "COPY_TILING_WITH_STRUCT",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/COPY_TILING_WITH_STRUCT"
            },
            {
              "text": "GET_TILING_DATA_MEMBER",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/GET_TILING_DATA_MEMBER"
            },
            {
              "text": "GET_TILING_DATA_PTR_WITH_STRUCT",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/GET_TILING_DATA_PTR_WITH_STRUCT"
            },
            {
              "text": "GET_TILING_DATA_WITH_STRUCT",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/GET_TILING_DATA_WITH_STRUCT"
            },
            {
              "text": "GET_TILING_DATA",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/GET_TILING_DATA"
            },
            {
              "text": "Kernel-Tiling",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/Kernel-Tiling"
            },
            {
              "text": "REGISTER_NONE_TILING",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/REGISTER_NONE_TILING"
            },
            {
              "text": "REGISTER_TILING_DEFAULT",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/REGISTER_TILING_DEFAULT"
            },
            {
              "text": "REGISTER_TILING_FOR_TILINGKEY",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/REGISTER_TILING_FOR_TILINGKEY"
            },
            {
              "text": "TILING_KEY_IS",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/TILING_KEY_IS"
            },
            {
              "text": "TILING_KEY_LIST",
              "link": "/api/SIMD-API/基础API/Kernel-Tiling/TILING_KEY_LIST"
            }
          ]
        },
        {
          "text": "Memory矢量计算",
          "collapsed": true,
          "items": [
            {
              "text": "Memory矢量计算",
              "link": "/api/SIMD-API/基础API/Memory矢量计算/Memory矢量计算"
            },
            {
              "text": "比较与选择",
              "collapsed": true,
              "items": [
                {
                  "text": "比较与选择",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/比较与选择"
                },
                {
                  "text": "Compare",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/Compare"
                },
                {
                  "text": "Compare（结果存入寄存器）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/Compare（结果存入寄存器）"
                },
                {
                  "text": "Compares",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/Compares"
                },
                {
                  "text": "Compares（灵活标量位置）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/Compares（灵活标量位置）"
                },
                {
                  "text": "GatherMask",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/GatherMask"
                },
                {
                  "text": "GetCmpMask(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/GetCmpMask(ISASI)"
                },
                {
                  "text": "Select",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/Select"
                },
                {
                  "text": "Select（灵活标量位置）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/Select（灵活标量位置）"
                },
                {
                  "text": "SetCmpMask(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/比较与选择/SetCmpMask(ISASI)"
                }
              ]
            },
            {
              "text": "复合计算",
              "collapsed": true,
              "items": [
                {
                  "text": "复合计算",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/复合计算"
                },
                {
                  "text": "AbsSub(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/AbsSub(ISASI)"
                },
                {
                  "text": "AddDeqRelu",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/AddDeqRelu"
                },
                {
                  "text": "AddRelu",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/AddRelu"
                },
                {
                  "text": "AddReluCast",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/AddReluCast"
                },
                {
                  "text": "Axpy",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/Axpy"
                },
                {
                  "text": "CastDequant",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/CastDequant"
                },
                {
                  "text": "ExpSub(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/ExpSub(ISASI)"
                },
                {
                  "text": "FusedMulAdd",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/FusedMulAdd"
                },
                {
                  "text": "MulAddDst",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/MulAddDst"
                },
                {
                  "text": "MulAddRelu",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/MulAddRelu"
                },
                {
                  "text": "MulCast",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/MulCast"
                },
                {
                  "text": "MulsCast(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/MulsCast(ISASI)"
                },
                {
                  "text": "SubRelu",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/SubRelu"
                },
                {
                  "text": "SubReluCast",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/复合计算/SubReluCast"
                }
              ]
            },
            {
              "text": "归约计算",
              "collapsed": true,
              "items": [
                {
                  "text": "归约计算",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/归约计算"
                },
                {
                  "text": "BlockReduceMax",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/BlockReduceMax"
                },
                {
                  "text": "BlockReduceMin",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/BlockReduceMin"
                },
                {
                  "text": "BlockReduceSum",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/BlockReduceSum"
                },
                {
                  "text": "GetReduceRepeatMaxMinSpr(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/GetReduceRepeatMaxMinSpr(ISASI)"
                },
                {
                  "text": "GetReduceRepeatSumSpr(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/GetReduceRepeatSumSpr(ISASI)"
                },
                {
                  "text": "PairReduceSum",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/PairReduceSum"
                },
                {
                  "text": "ReduceMax",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/ReduceMax"
                },
                {
                  "text": "ReduceMin",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/ReduceMin"
                },
                {
                  "text": "ReduceSum",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/ReduceSum"
                },
                {
                  "text": "RepeatReduceSum",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/RepeatReduceSum"
                },
                {
                  "text": "WholeReduceMax",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/WholeReduceMax"
                },
                {
                  "text": "WholeReduceMin",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/WholeReduceMin"
                },
                {
                  "text": "WholeReduceSum",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/归约计算/WholeReduceSum"
                }
              ]
            },
            {
              "text": "基础算术",
              "collapsed": true,
              "items": [
                {
                  "text": "更多样例-9",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/更多样例-9"
                },
                {
                  "text": "基础算术",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/基础算术"
                },
                {
                  "text": "Abs",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Abs"
                },
                {
                  "text": "Add",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Add"
                },
                {
                  "text": "Adds",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Adds"
                },
                {
                  "text": "Adds（灵活标量位置）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Adds（灵活标量位置）"
                },
                {
                  "text": "BilinearInterpolation(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/BilinearInterpolation(ISASI)"
                },
                {
                  "text": "Div",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Div"
                },
                {
                  "text": "Divs",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Divs"
                },
                {
                  "text": "Exp",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Exp"
                },
                {
                  "text": "LeakyRelu",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/LeakyRelu"
                },
                {
                  "text": "Ln",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Ln"
                },
                {
                  "text": "Max",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Max"
                },
                {
                  "text": "Maxs",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Maxs"
                },
                {
                  "text": "Maxs（灵活标量位置）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Maxs（灵活标量位置）"
                },
                {
                  "text": "Min",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Min"
                },
                {
                  "text": "Mins",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Mins"
                },
                {
                  "text": "Mins（灵活标量位置）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Mins（灵活标量位置）"
                },
                {
                  "text": "Mul",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Mul"
                },
                {
                  "text": "Mull(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Mull(ISASI)"
                },
                {
                  "text": "Muls",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Muls"
                },
                {
                  "text": "Muls（灵活标量位置）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Muls（灵活标量位置）"
                },
                {
                  "text": "Neg(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Neg(ISASI)"
                },
                {
                  "text": "Prelu(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Prelu(ISASI)"
                },
                {
                  "text": "Reciprocal",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Reciprocal"
                },
                {
                  "text": "Relu",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Relu"
                },
                {
                  "text": "Rsqrt",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Rsqrt"
                },
                {
                  "text": "Sqrt",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Sqrt"
                },
                {
                  "text": "Sub",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Sub"
                },
                {
                  "text": "Subs",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/基础算术/Subs"
                }
              ]
            },
            {
              "text": "类型转换",
              "collapsed": true,
              "items": [
                {
                  "text": "类型转换",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/类型转换/类型转换"
                },
                {
                  "text": "Cast",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/类型转换/Cast"
                },
                {
                  "text": "Truncate(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/类型转换/Truncate(ISASI)"
                }
              ]
            },
            {
              "text": "离散与聚合",
              "collapsed": true,
              "items": [
                {
                  "text": "离散与聚合",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/离散与聚合/离散与聚合"
                },
                {
                  "text": "Gather",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/离散与聚合/Gather"
                },
                {
                  "text": "Gatherb(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/离散与聚合/Gatherb(ISASI)"
                },
                {
                  "text": "Scatter(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/离散与聚合/Scatter(ISASI)"
                }
              ]
            },
            {
              "text": "量化设置",
              "collapsed": true,
              "items": [
                {
                  "text": "量化设置",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/量化设置/量化设置"
                },
                {
                  "text": "SetDeqScale",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/量化设置/SetDeqScale"
                }
              ]
            },
            {
              "text": "逻辑计算",
              "collapsed": true,
              "items": [
                {
                  "text": "逻辑计算",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/逻辑计算"
                },
                {
                  "text": "And",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/And"
                },
                {
                  "text": "Ands",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/Ands"
                },
                {
                  "text": "Not",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/Not"
                },
                {
                  "text": "Or",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/Or"
                },
                {
                  "text": "Ors",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/Ors"
                },
                {
                  "text": "ShiftLeft",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/ShiftLeft"
                },
                {
                  "text": "ShiftLeft（左移位数为Tensor）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/ShiftLeft（左移位数为Tensor）"
                },
                {
                  "text": "ShiftRight",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/ShiftRight"
                },
                {
                  "text": "ShiftRight（右移位数为Tensor）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/逻辑计算/ShiftRight（右移位数为Tensor）"
                }
              ]
            },
            {
              "text": "排序组合（ISASI）",
              "collapsed": true,
              "items": [
                {
                  "text": "排序组合（ISASI）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/排序组合（ISASI）"
                },
                {
                  "text": "GetMrgSortResult",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/GetMrgSortResult"
                },
                {
                  "text": "MrgSort",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/MrgSort"
                },
                {
                  "text": "MrgSort4",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/MrgSort4"
                },
                {
                  "text": "ProposalConcat",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/ProposalConcat"
                },
                {
                  "text": "ProposalExtract",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/ProposalExtract"
                },
                {
                  "text": "RpSort16",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/RpSort16"
                },
                {
                  "text": "Sort32",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/Sort32"
                }
              ]
            },
            {
              "text": "数据填充",
              "collapsed": true,
              "items": [
                {
                  "text": "数据填充",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据填充/数据填充"
                },
                {
                  "text": "Brcb",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据填充/Brcb"
                },
                {
                  "text": "CreateVecIndex",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据填充/CreateVecIndex"
                },
                {
                  "text": "Duplicate",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据填充/Duplicate"
                },
                {
                  "text": "VectorPadding(ISASI)",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据填充/VectorPadding(ISASI)"
                }
              ]
            },
            {
              "text": "数据重排（ISASI）",
              "collapsed": true,
              "items": [
                {
                  "text": "数据重排（ISASI）",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据重排（ISASI）/数据重排（ISASI）"
                },
                {
                  "text": "DeInterleave",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据重排（ISASI）/DeInterleave"
                },
                {
                  "text": "Interleave",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据重排（ISASI）/Interleave"
                }
              ]
            },
            {
              "text": "数据转换",
              "collapsed": true,
              "items": [
                {
                  "text": "数据转换",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据转换/数据转换"
                },
                {
                  "text": "TransDataTo5HD",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据转换/TransDataTo5HD"
                },
                {
                  "text": "Transpose",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/数据转换/Transpose"
                }
              ]
            },
            {
              "text": "掩码操作",
              "collapsed": true,
              "items": [
                {
                  "text": "掩码操作",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/掩码操作/掩码操作"
                },
                {
                  "text": "ResetMask",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/掩码操作/ResetMask"
                },
                {
                  "text": "SetMaskCount",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/掩码操作/SetMaskCount"
                },
                {
                  "text": "SetMaskNorm",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/掩码操作/SetMaskNorm"
                },
                {
                  "text": "SetVectorMask",
                  "link": "/api/SIMD-API/基础API/Memory矢量计算/掩码操作/SetVectorMask"
                }
              ]
            }
          ]
        },
        {
          "text": "Memory数据搬运",
          "collapsed": true,
          "items": [
            {
              "text": "BroadCastVecToMM(ISASI)",
              "link": "/api/SIMD-API/基础API/Memory数据搬运/BroadCastVecToMM(ISASI)"
            },
            {
              "text": "Copy",
              "link": "/api/SIMD-API/基础API/Memory数据搬运/Copy"
            },
            {
              "text": "DataCopyPad(ISASI)",
              "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopyPad(ISASI)"
            },
            {
              "text": "Memory数据搬运",
              "link": "/api/SIMD-API/基础API/Memory数据搬运/Memory数据搬运"
            },
            {
              "text": "ResetLoopModePara",
              "link": "/api/SIMD-API/基础API/Memory数据搬运/ResetLoopModePara"
            },
            {
              "text": "SetLoopModePara",
              "link": "/api/SIMD-API/基础API/Memory数据搬运/SetLoopModePara"
            },
            {
              "text": "SetPadValue(ISASI)",
              "link": "/api/SIMD-API/基础API/Memory数据搬运/SetPadValue(ISASI)"
            },
            {
              "text": "DataCopy",
              "collapsed": true,
              "items": [
                {
                  "text": "多维数据搬运（ISASI）",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/多维数据搬运（ISASI）"
                },
                {
                  "text": "基础数据搬运",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/基础数据搬运"
                },
                {
                  "text": "切片数据搬运",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/切片数据搬运"
                },
                {
                  "text": "随路量化激活搬运",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/随路量化激活搬运"
                },
                {
                  "text": "随路转换DN2NZ搬运（ISASI）",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/随路转换DN2NZ搬运（ISASI）"
                },
                {
                  "text": "随路转换ND2NZ搬运",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/随路转换ND2NZ搬运"
                },
                {
                  "text": "随路转换NZ2ND搬运",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/随路转换NZ2ND搬运"
                },
                {
                  "text": "增强数据搬运",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/增强数据搬运"
                },
                {
                  "text": "DataCopy",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/DataCopy"
                },
                {
                  "text": "DataCopy简介",
                  "link": "/api/SIMD-API/基础API/Memory数据搬运/DataCopy/DataCopy简介"
                }
              ]
            }
          ]
        },
        {
          "text": "Reg矢量计算",
          "collapsed": true,
          "items": [
            {
              "text": "asc_vf_call",
              "link": "/api/SIMD-API/基础API/Reg矢量计算/asc_vf_call"
            },
            {
              "text": "Reg矢量计算",
              "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg矢量计算"
            },
            {
              "text": "比较与选择",
              "collapsed": true,
              "items": [
                {
                  "text": "比较与选择-40",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/比较与选择/比较与选择-40"
                },
                {
                  "text": "Compare-41",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/比较与选择/Compare-41"
                },
                {
                  "text": "Compares-42",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/比较与选择/Compares-42"
                },
                {
                  "text": "Select-43",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/比较与选择/Select-43"
                },
                {
                  "text": "Squeeze",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/比较与选择/Squeeze"
                }
              ]
            },
            {
              "text": "复合计算",
              "collapsed": true,
              "items": [
                {
                  "text": "复合计算-37",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/复合计算/复合计算-37"
                },
                {
                  "text": "AbsSub",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/复合计算/AbsSub"
                },
                {
                  "text": "Axpy-38",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/复合计算/Axpy-38"
                },
                {
                  "text": "ExpSub",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/复合计算/ExpSub"
                },
                {
                  "text": "MulAddDst-39",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/复合计算/MulAddDst-39"
                },
                {
                  "text": "MulDstAdd",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/复合计算/MulDstAdd"
                },
                {
                  "text": "MulsCast",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/复合计算/MulsCast"
                }
              ]
            },
            {
              "text": "归约计算",
              "collapsed": true,
              "items": [
                {
                  "text": "归约计算-46",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/归约计算/归约计算-46"
                },
                {
                  "text": "PairReduceElem",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/归约计算/PairReduceElem"
                },
                {
                  "text": "Reduce",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/归约计算/Reduce"
                },
                {
                  "text": "ReduceDataBlock",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/归约计算/ReduceDataBlock"
                }
              ]
            },
            {
              "text": "基础算术",
              "collapsed": true,
              "items": [
                {
                  "text": "基础算术-14",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/基础算术-14"
                },
                {
                  "text": "Abs-15",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Abs-15"
                },
                {
                  "text": "Add-20",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Add-20"
                },
                {
                  "text": "AddC",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/AddC"
                },
                {
                  "text": "Adds-26",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Adds-26"
                },
                {
                  "text": "Div-23",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Div-23"
                },
                {
                  "text": "Exp-17",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Exp-17"
                },
                {
                  "text": "LeakyRelu-30",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/LeakyRelu-30"
                },
                {
                  "text": "Ln-19",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Ln-19"
                },
                {
                  "text": "Log",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Log"
                },
                {
                  "text": "Log10",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Log10"
                },
                {
                  "text": "Log2",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Log2"
                },
                {
                  "text": "Max-24",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Max-24"
                },
                {
                  "text": "Maxs-28",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Maxs-28"
                },
                {
                  "text": "Min-25",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Min-25"
                },
                {
                  "text": "Mins-29",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Mins-29"
                },
                {
                  "text": "Mul-22",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Mul-22"
                },
                {
                  "text": "Mull",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Mull"
                },
                {
                  "text": "Muls-27",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Muls-27"
                },
                {
                  "text": "Neg",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Neg"
                },
                {
                  "text": "Prelu",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Prelu"
                },
                {
                  "text": "Relu-16",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Relu-16"
                },
                {
                  "text": "Sqrt-18",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Sqrt-18"
                },
                {
                  "text": "Sub-21",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/Sub-21"
                },
                {
                  "text": "SubC",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/基础算术/SubC"
                }
              ]
            },
            {
              "text": "寄存器数据类型",
              "collapsed": true,
              "items": [
                {
                  "text": "寄存器数据类型",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/寄存器数据类型/寄存器数据类型"
                },
                {
                  "text": "AddrReg",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/寄存器数据类型/AddrReg"
                },
                {
                  "text": "MaskReg",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/寄存器数据类型/MaskReg"
                },
                {
                  "text": "RegTensor",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/寄存器数据类型/RegTensor"
                },
                {
                  "text": "UnalignRegForLoad-UnalignRegForStore",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/寄存器数据类型/UnalignRegForLoad-UnalignRegForStore"
                }
              ]
            },
            {
              "text": "类型转换",
              "collapsed": true,
              "items": [
                {
                  "text": "类型转换-44",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/类型转换/类型转换-44"
                },
                {
                  "text": "Cast-45",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/类型转换/Cast-45"
                },
                {
                  "text": "Truncate",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/类型转换/Truncate"
                }
              ]
            },
            {
              "text": "离散与聚合",
              "collapsed": true,
              "items": [
                {
                  "text": "离散与聚合-49",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/离散与聚合/离散与聚合-49"
                },
                {
                  "text": "Gather-50",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/离散与聚合/Gather-50"
                },
                {
                  "text": "Gather（支持寄存器为源操作数）",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/离散与聚合/Gather（支持寄存器为源操作数）"
                },
                {
                  "text": "GatherB",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/离散与聚合/GatherB"
                },
                {
                  "text": "Scatter",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/离散与聚合/Scatter"
                }
              ]
            },
            {
              "text": "逻辑计算",
              "collapsed": true,
              "items": [
                {
                  "text": "逻辑计算-31",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/逻辑计算/逻辑计算-31"
                },
                {
                  "text": "And-33",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/逻辑计算/And-33"
                },
                {
                  "text": "Not-32",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/逻辑计算/Not-32"
                },
                {
                  "text": "Or-34",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/逻辑计算/Or-34"
                },
                {
                  "text": "ShiftLeft-35",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/逻辑计算/ShiftLeft-35"
                },
                {
                  "text": "ShiftLefts",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/逻辑计算/ShiftLefts"
                },
                {
                  "text": "ShiftRight-36",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/逻辑计算/ShiftRight-36"
                },
                {
                  "text": "ShiftRights",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/逻辑计算/ShiftRights"
                },
                {
                  "text": "Xor",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/逻辑计算/Xor"
                }
              ]
            },
            {
              "text": "数据类型",
              "collapsed": true,
              "items": [
                {
                  "text": "数据类型",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据类型/数据类型"
                },
                {
                  "text": "CastTrait",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据类型/CastTrait"
                },
                {
                  "text": "MaskMergeMode",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据类型/MaskMergeMode"
                },
                {
                  "text": "PostLiteral",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据类型/PostLiteral"
                },
                {
                  "text": "RegLayout",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据类型/RegLayout"
                },
                {
                  "text": "RoundMode",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据类型/RoundMode"
                },
                {
                  "text": "SatMode",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据类型/SatMode"
                }
              ]
            },
            {
              "text": "数据填充",
              "collapsed": true,
              "items": [
                {
                  "text": "数据填充-47",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据填充/数据填充-47"
                },
                {
                  "text": "Duplicate-48",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据填充/Duplicate-48"
                }
              ]
            },
            {
              "text": "数据压缩",
              "collapsed": true,
              "items": [
                {
                  "text": "数据压缩",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据压缩/数据压缩"
                },
                {
                  "text": "Pack-53",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据压缩/Pack-53"
                },
                {
                  "text": "UnPack-54",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据压缩/UnPack-54"
                },
                {
                  "text": "Unsqueeze",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据压缩/Unsqueeze"
                }
              ]
            },
            {
              "text": "数据重排",
              "collapsed": true,
              "items": [
                {
                  "text": "数据重排",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据重排/数据重排"
                },
                {
                  "text": "DeInterleave-52",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据重排/DeInterleave-52"
                },
                {
                  "text": "Interleave-51",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/数据重排/Interleave-51"
                }
              ]
            },
            {
              "text": "索引操作",
              "collapsed": true,
              "items": [
                {
                  "text": "索引操作",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/索引操作/索引操作"
                },
                {
                  "text": "Arange",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/索引操作/Arange"
                }
              ]
            },
            {
              "text": "同步控制",
              "collapsed": true,
              "items": [
                {
                  "text": "同步控制",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/同步控制/同步控制"
                },
                {
                  "text": "LocalMemBar",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/同步控制/LocalMemBar"
                }
              ]
            },
            {
              "text": "系统变量访问",
              "collapsed": true,
              "items": [
                {
                  "text": "系统变量访问",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/系统变量访问/系统变量访问"
                },
                {
                  "text": "ClearSpr",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/系统变量访问/ClearSpr"
                },
                {
                  "text": "GetSpr",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/系统变量访问/GetSpr"
                }
              ]
            },
            {
              "text": "直方图计算",
              "collapsed": true,
              "items": [
                {
                  "text": "直方图计算",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/直方图计算/直方图计算"
                },
                {
                  "text": "Histograms",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/直方图计算/Histograms"
                }
              ]
            },
            {
              "text": "MaskReg计算",
              "collapsed": true,
              "items": [
                {
                  "text": "DeInterleave-12",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/MaskReg计算/DeInterleave-12"
                },
                {
                  "text": "Interleave-11",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/MaskReg计算/Interleave-11"
                },
                {
                  "text": "MaskReg计算",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/MaskReg计算/MaskReg计算"
                },
                {
                  "text": "Move-10",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/MaskReg计算/Move-10"
                },
                {
                  "text": "MoveMask",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/MaskReg计算/MoveMask"
                },
                {
                  "text": "Pack",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/MaskReg计算/Pack"
                },
                {
                  "text": "Select-13",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/MaskReg计算/Select-13"
                },
                {
                  "text": "UnPack",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/MaskReg计算/UnPack"
                }
              ]
            },
            {
              "text": "Reg数据搬运",
              "collapsed": true,
              "items": [
                {
                  "text": "非连续对齐搬出",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/非连续对齐搬出"
                },
                {
                  "text": "非连续对齐搬入",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/非连续对齐搬入"
                },
                {
                  "text": "连续对齐搬出",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续对齐搬出"
                },
                {
                  "text": "连续对齐搬入",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续对齐搬入"
                },
                {
                  "text": "连续非对齐搬出",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续非对齐搬出"
                },
                {
                  "text": "连续非对齐搬入",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续非对齐搬入"
                },
                {
                  "text": "MaskReg搬出",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/MaskReg搬出"
                },
                {
                  "text": "MaskReg搬入",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/MaskReg搬入"
                },
                {
                  "text": "Move",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/Move"
                },
                {
                  "text": "Reg数据搬运",
                  "link": "/api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/Reg数据搬运"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "text": "其他数据类型",
      "collapsed": true,
      "items": [
        {
          "text": "其他数据类型",
          "link": "/api/SIMD-API/其他数据类型/其他数据类型"
        },
        {
          "text": "BinaryRepeatParams",
          "link": "/api/SIMD-API/其他数据类型/BinaryRepeatParams"
        },
        {
          "text": "complex32-complex64",
          "link": "/api/SIMD-API/其他数据类型/complex32-complex64"
        },
        {
          "text": "ListTensorDesc",
          "link": "/api/SIMD-API/其他数据类型/ListTensorDesc"
        },
        {
          "text": "ShapeInfo",
          "link": "/api/SIMD-API/其他数据类型/ShapeInfo"
        },
        {
          "text": "TPosition",
          "link": "/api/SIMD-API/其他数据类型/TPosition"
        },
        {
          "text": "UnaryRepeatParams",
          "link": "/api/SIMD-API/其他数据类型/UnaryRepeatParams"
        },
        {
          "text": "TensorDesc",
          "collapsed": true,
          "items": [
            {
              "text": "构造和析构函数",
              "link": "/api/SIMD-API/其他数据类型/TensorDesc/构造和析构函数"
            },
            {
              "text": "GetDataObj",
              "link": "/api/SIMD-API/其他数据类型/TensorDesc/GetDataObj"
            },
            {
              "text": "GetDataPtr",
              "link": "/api/SIMD-API/其他数据类型/TensorDesc/GetDataPtr"
            },
            {
              "text": "GetDim",
              "link": "/api/SIMD-API/其他数据类型/TensorDesc/GetDim"
            },
            {
              "text": "GetIndex",
              "link": "/api/SIMD-API/其他数据类型/TensorDesc/GetIndex"
            },
            {
              "text": "GetShape-138",
              "link": "/api/SIMD-API/其他数据类型/TensorDesc/GetShape-138"
            },
            {
              "text": "SetShapeAddr",
              "link": "/api/SIMD-API/其他数据类型/TensorDesc/SetShapeAddr"
            },
            {
              "text": "TensorDesc",
              "link": "/api/SIMD-API/其他数据类型/TensorDesc/TensorDesc"
            },
            {
              "text": "TensorDesc简介",
              "link": "/api/SIMD-API/其他数据类型/TensorDesc/TensorDesc简介"
            }
          ]
        }
      ]
    },
    {
      "text": "c_api",
      "collapsed": true,
      "items": [
        {
          "text": "c_api_list",
          "link": "/api/SIMD-API/c_api/c_api_list"
        },
        {
          "text": "general_instruction",
          "link": "/api/SIMD-API/c_api/general_instruction"
        },
        {
          "text": "README",
          "link": "/api/SIMD-API/c_api/README"
        },
        {
          "text": "cache_ctrl",
          "collapsed": true,
          "items": [
            {
              "text": "asc_datacache_preload",
              "link": "/api/SIMD-API/c_api/cache_ctrl/asc_datacache_preload"
            },
            {
              "text": "asc_dcci",
              "link": "/api/SIMD-API/c_api/cache_ctrl/asc_dcci"
            },
            {
              "text": "asc_dci",
              "link": "/api/SIMD-API/c_api/cache_ctrl/asc_dci"
            },
            {
              "text": "asc_get_icache_preload_status",
              "link": "/api/SIMD-API/c_api/cache_ctrl/asc_get_icache_preload_status"
            },
            {
              "text": "asc_icache_preload",
              "link": "/api/SIMD-API/c_api/cache_ctrl/asc_icache_preload"
            }
          ]
        },
        {
          "text": "cube_compute",
          "collapsed": true,
          "items": [
            {
              "text": "asc_enable_hf32_trans",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_enable_hf32_trans"
            },
            {
              "text": "asc_enable_hf32",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_enable_hf32"
            },
            {
              "text": "asc_get_l0c2gm_prequant",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_get_l0c2gm_prequant"
            },
            {
              "text": "asc_get_l0c2gm_relu",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_get_l0c2gm_relu"
            },
            {
              "text": "asc_get_l0c2gm_unitflag",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_get_l0c2gm_unitflag"
            },
            {
              "text": "asc_mmad_mx",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_mmad_mx"
            },
            {
              "text": "asc_mmad_sparse",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_mmad_sparse"
            },
            {
              "text": "asc_mmad",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_mmad"
            },
            {
              "text": "asc_set_fp32_mode",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_set_fp32_mode"
            },
            {
              "text": "asc_set_l0c2gm_config",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_set_l0c2gm_config"
            },
            {
              "text": "asc_set_l0c2gm_nz2nd",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_set_l0c2gm_nz2nd"
            },
            {
              "text": "asc_set_mmad_direction_m",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_set_mmad_direction_m"
            },
            {
              "text": "asc_set_mmad_direction_n",
              "link": "/api/SIMD-API/c_api/cube_compute/asc_set_mmad_direction_n"
            }
          ]
        },
        {
          "text": "cube_datamove",
          "collapsed": true,
          "items": [
            {
              "text": "asc_copy_gm2l0a",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_gm2l0a"
            },
            {
              "text": "asc_copy_gm2l0b",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_gm2l0b"
            },
            {
              "text": "asc_copy_gm2l1_align",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_gm2l1_align"
            },
            {
              "text": "asc_copy_gm2l1_dn2nz",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_gm2l1_dn2nz"
            },
            {
              "text": "asc_copy_l0c2ub",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l0c2ub"
            },
            {
              "text": "asc_copy_l12fb_v2",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12fb_v2"
            },
            {
              "text": "asc_copy_l12gm",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12gm"
            },
            {
              "text": "asc_copy_l12l0a_mx",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0a_mx"
            },
            {
              "text": "asc_copy_l12l0a_trans",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0a_trans"
            },
            {
              "text": "asc_copy_l12l0b_mx",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0b_mx"
            },
            {
              "text": "asc_copy_l12l0b_sparse",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0b_sparse"
            },
            {
              "text": "asc_copy_l12l0c",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0c"
            },
            {
              "text": "asc_copy_l12ub",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12ub"
            },
            {
              "text": "asc_fill_l0a",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_fill_l0a"
            },
            {
              "text": "asc_fill_l0b",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_fill_l0b"
            },
            {
              "text": "asc_fill_l1",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_fill_l1"
            },
            {
              "text": "asc_load_image_to_cbuf",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_load_image_to_cbuf"
            },
            {
              "text": "asc_set_gm2l1_loop_size",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_gm2l1_loop_size"
            },
            {
              "text": "asc_set_gm2l1_loop1_stride",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_gm2l1_loop1_stride"
            },
            {
              "text": "asc_set_gm2l1_loop2_stride",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_gm2l1_loop2_stride"
            },
            {
              "text": "asc_set_gm2l1_pad",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_gm2l1_pad"
            },
            {
              "text": "asc_set_l0c_copy_params",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_l0c_copy_params"
            },
            {
              "text": "asc_set_l0c_copy_prequant",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_l0c_copy_prequant"
            },
            {
              "text": "asc_set_l0c2gm_lrelu_alpha",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_l0c2gm_lrelu_alpha"
            },
            {
              "text": "asc_set_l13d_fmatrix_b",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_l13d_fmatrix_b"
            },
            {
              "text": "asc_set_l13d_fmatrix",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_l13d_fmatrix"
            },
            {
              "text": "asc_set_l13d_padding",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_l13d_padding"
            },
            {
              "text": "asc_set_l13d_rpt",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_l13d_rpt"
            },
            {
              "text": "asc_set_l13d_size",
              "link": "/api/SIMD-API/c_api/cube_datamove/asc_set_l13d_size"
            },
            {
              "text": "asc_copy_gm2l1",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_gm2l1_arch_2201",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_gm2l1/asc_copy_gm2l1_arch_2201"
                },
                {
                  "text": "asc_copy_gm2l1_arch_3510",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_gm2l1/asc_copy_gm2l1_arch_3510"
                }
              ]
            },
            {
              "text": "asc_copy_gm2l1_nd2nz",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_gm2l1_nd2nz_arch_2201",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_gm2l1_nd2nz/asc_copy_gm2l1_nd2nz_arch_2201"
                },
                {
                  "text": "asc_copy_gm2l1_nd2nz_arch_3510",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_gm2l1_nd2nz/asc_copy_gm2l1_nd2nz_arch_3510"
                }
              ]
            },
            {
              "text": "asc_copy_l0c2gm",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_l0c2gm_arch_2201",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l0c2gm/asc_copy_l0c2gm_arch_2201"
                },
                {
                  "text": "asc_copy_l0c2gm_arch_3510",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l0c2gm/asc_copy_l0c2gm_arch_3510"
                }
              ]
            },
            {
              "text": "asc_copy_l0c2l1",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_l0c2l1_arch_2201",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l0c2l1/asc_copy_l0c2l1_arch_2201"
                },
                {
                  "text": "asc_copy_l0c2l1_arch_3510",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l0c2l1/asc_copy_l0c2l1_arch_3510"
                }
              ]
            },
            {
              "text": "asc_copy_l12bt",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_l12bt_arch_2201",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12bt/asc_copy_l12bt_arch_2201"
                },
                {
                  "text": "asc_copy_l12bt_arch_3510",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12bt/asc_copy_l12bt_arch_3510"
                }
              ]
            },
            {
              "text": "asc_copy_l12fb",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_l12fb_arch_2201",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12fb/asc_copy_l12fb_arch_2201"
                },
                {
                  "text": "asc_copy_l12fb_arch_3510",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12fb/asc_copy_l12fb_arch_3510"
                }
              ]
            },
            {
              "text": "asc_copy_l12l0a",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_l12l0a_arch_2201",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0a/asc_copy_l12l0a_arch_2201"
                },
                {
                  "text": "asc_copy_l12l0a_arch_3510",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0a/asc_copy_l12l0a_arch_3510"
                }
              ]
            },
            {
              "text": "asc_copy_l12l0b",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_l12l0b_arch_2201",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0b/asc_copy_l12l0b_arch_2201"
                },
                {
                  "text": "asc_copy_l12l0b_arch_3510",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0b/asc_copy_l12l0b_arch_3510"
                }
              ]
            },
            {
              "text": "asc_copy_l12l0b_trans",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_l12l0b_trans_arch_2201",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0b_trans/asc_copy_l12l0b_trans_arch_2201"
                },
                {
                  "text": "asc_copy_l12l0b_trans_arch_3510",
                  "link": "/api/SIMD-API/c_api/cube_datamove/asc_copy_l12l0b_trans/asc_copy_l12l0b_trans_arch_3510"
                }
              ]
            }
          ]
        },
        {
          "text": "misc",
          "collapsed": true,
          "items": [
            {
              "text": "asc_init",
              "link": "/api/SIMD-API/c_api/misc/asc_init"
            }
          ]
        },
        {
          "text": "reg",
          "collapsed": true,
          "items": [
            {
              "text": "reg数据类型定义",
              "link": "/api/SIMD-API/c_api/reg/reg数据类型定义"
            },
            {
              "text": "reg_load",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_gather_datablock",
                  "link": "/api/SIMD-API/c_api/reg/reg_load/asc_gather_datablock"
                },
                {
                  "text": "asc_gather",
                  "link": "/api/SIMD-API/c_api/reg/reg_load/asc_gather"
                },
                {
                  "text": "asc_get_mask_spr",
                  "link": "/api/SIMD-API/c_api/reg/reg_load/asc_get_mask_spr"
                },
                {
                  "text": "asc_load",
                  "link": "/api/SIMD-API/c_api/reg/reg_load/asc_load"
                },
                {
                  "text": "asc_loadalign_postupdate",
                  "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadalign_postupdate"
                },
                {
                  "text": "asc_loadunalign_postupdate",
                  "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadunalign_postupdate"
                },
                {
                  "text": "asc_loadunalign_pre",
                  "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadunalign_pre"
                },
                {
                  "text": "asc_loadunalign",
                  "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadunalign"
                },
                {
                  "text": "asc_scatter",
                  "link": "/api/SIMD-API/c_api/reg/reg_load/asc_scatter"
                },
                {
                  "text": "asc_loadalign",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "asc_loadalign_v1",
                      "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadalign/asc_loadalign_v1"
                    },
                    {
                      "text": "asc_loadalign_v2",
                      "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadalign/asc_loadalign_v2"
                    },
                    {
                      "text": "asc_loadalign_v3",
                      "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadalign/asc_loadalign_v3"
                    },
                    {
                      "text": "asc_loadalign_v4",
                      "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadalign/asc_loadalign_v4"
                    },
                    {
                      "text": "asc_loadalign_v5",
                      "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadalign/asc_loadalign_v5"
                    },
                    {
                      "text": "asc_loadalign_v6",
                      "link": "/api/SIMD-API/c_api/reg/reg_load/asc_loadalign/asc_loadalign_v6"
                    }
                  ]
                }
              ]
            },
            {
              "text": "reg_store",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_store",
                  "link": "/api/SIMD-API/c_api/reg/reg_store/asc_store"
                },
                {
                  "text": "asc_storeunalign_post_postupdate",
                  "link": "/api/SIMD-API/c_api/reg/reg_store/asc_storeunalign_post_postupdate"
                },
                {
                  "text": "asc_storeunalign_post",
                  "link": "/api/SIMD-API/c_api/reg/reg_store/asc_storeunalign_post"
                },
                {
                  "text": "asc_storeunalign_postupdate",
                  "link": "/api/SIMD-API/c_api/reg/reg_store/asc_storeunalign_postupdate"
                },
                {
                  "text": "asc_storeunalign",
                  "link": "/api/SIMD-API/c_api/reg/reg_store/asc_storeunalign"
                },
                {
                  "text": "asc_storealign",
                  "collapsed": true,
                  "items": [
                    {
                      "text": "asc_storealign_v1",
                      "link": "/api/SIMD-API/c_api/reg/reg_store/asc_storealign/asc_storealign_v1"
                    },
                    {
                      "text": "asc_storealign_v2",
                      "link": "/api/SIMD-API/c_api/reg/reg_store/asc_storealign/asc_storealign_v2"
                    },
                    {
                      "text": "asc_storealign_v3",
                      "link": "/api/SIMD-API/c_api/reg/reg_store/asc_storealign/asc_storealign_v3"
                    },
                    {
                      "text": "asc_storealign_v4",
                      "link": "/api/SIMD-API/c_api/reg/reg_store/asc_storealign/asc_storealign_v4"
                    },
                    {
                      "text": "asc_storealign_v5",
                      "link": "/api/SIMD-API/c_api/reg/reg_store/asc_storealign/asc_storealign_v5"
                    }
                  ]
                }
              ]
            },
            {
              "text": "reg_vector",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_abs_sub",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_abs_sub"
                },
                {
                  "text": "asc_abs",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_abs"
                },
                {
                  "text": "asc_add_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_add_scalar"
                },
                {
                  "text": "asc_add",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_add"
                },
                {
                  "text": "asc_addc",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_addc"
                },
                {
                  "text": "asc_and",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_and"
                },
                {
                  "text": "asc_arange",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_arange"
                },
                {
                  "text": "asc_axpy",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_axpy"
                },
                {
                  "text": "asc_bfloat162e1m2x2",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_bfloat162e1m2x2"
                },
                {
                  "text": "asc_bfloat162e2m1x2",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_bfloat162e2m1x2"
                },
                {
                  "text": "asc_bfloat162float",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_bfloat162float"
                },
                {
                  "text": "asc_bfloat162half",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_bfloat162half"
                },
                {
                  "text": "asc_bfloat162int32",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_bfloat162int32"
                },
                {
                  "text": "asc_clear_ar_spr",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_clear_ar_spr"
                },
                {
                  "text": "asc_copy",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_copy"
                },
                {
                  "text": "asc_create_iter_reg",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_create_iter_reg"
                },
                {
                  "text": "asc_create_mask",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_create_mask"
                },
                {
                  "text": "asc_cumulative_histogram",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_cumulative_histogram"
                },
                {
                  "text": "asc_deintlv",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_deintlv"
                },
                {
                  "text": "asc_div",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_div"
                },
                {
                  "text": "asc_duplicate_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_duplicate_scalar"
                },
                {
                  "text": "asc_duplicate",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_duplicate"
                },
                {
                  "text": "asc_e1m2x22bfloat16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_e1m2x22bfloat16"
                },
                {
                  "text": "asc_e2m1x22bfloat16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_e2m1x22bfloat16"
                },
                {
                  "text": "asc_e4m32float",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_e4m32float"
                },
                {
                  "text": "asc_e5m22float",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_e5m22float"
                },
                {
                  "text": "asc_eq_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_eq_scalar"
                },
                {
                  "text": "asc_eq",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_eq"
                },
                {
                  "text": "asc_exp_sub",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_exp_sub"
                },
                {
                  "text": "asc_exp",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_exp"
                },
                {
                  "text": "asc_float2bfloat16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_float2bfloat16"
                },
                {
                  "text": "asc_float2e4m3",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_float2e4m3"
                },
                {
                  "text": "asc_float2e5m2",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_float2e5m2"
                },
                {
                  "text": "asc_float2half",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_float2half"
                },
                {
                  "text": "asc_float2hif8",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_float2hif8"
                },
                {
                  "text": "asc_float2int16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_float2int16"
                },
                {
                  "text": "asc_float2int32",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_float2int32"
                },
                {
                  "text": "asc_float2int64",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_float2int64"
                },
                {
                  "text": "asc_frequency_histogram",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_frequency_histogram"
                },
                {
                  "text": "asc_ge_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_ge_scalar"
                },
                {
                  "text": "asc_ge",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_ge"
                },
                {
                  "text": "asc_gt_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_gt_scalar"
                },
                {
                  "text": "asc_gt",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_gt"
                },
                {
                  "text": "asc_half2bf16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_half2bf16"
                },
                {
                  "text": "asc_half2float",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_half2float"
                },
                {
                  "text": "asc_half2hif8",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_half2hif8"
                },
                {
                  "text": "asc_half2int16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_half2int16"
                },
                {
                  "text": "asc_half2int32",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_half2int32"
                },
                {
                  "text": "asc_half2int4x2",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_half2int4x2"
                },
                {
                  "text": "asc_half2int8",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_half2int8"
                },
                {
                  "text": "asc_half2uint8",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_half2uint8"
                },
                {
                  "text": "asc_hif82half",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_hif82half"
                },
                {
                  "text": "asc_int162float",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int162float"
                },
                {
                  "text": "asc_int162half",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int162half"
                },
                {
                  "text": "asc_int162int32",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int162int32"
                },
                {
                  "text": "asc_int162uint32",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int162uint32"
                },
                {
                  "text": "asc_int162uint8",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int162uint8"
                },
                {
                  "text": "asc_int322float",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int322float"
                },
                {
                  "text": "asc_int322int16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int322int16"
                },
                {
                  "text": "asc_int322int64",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int322int64"
                },
                {
                  "text": "asc_int322uint16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int322uint16"
                },
                {
                  "text": "asc_int322uint8",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int322uint8"
                },
                {
                  "text": "asc_int4x22bfloat16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int4x22bfloat16"
                },
                {
                  "text": "asc_int4x22half",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int4x22half"
                },
                {
                  "text": "asc_int4x22int16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int4x22int16"
                },
                {
                  "text": "asc_int642float",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int642float"
                },
                {
                  "text": "asc_int642int32",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int642int32"
                },
                {
                  "text": "asc_int82half",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int82half"
                },
                {
                  "text": "asc_int82int16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int82int16"
                },
                {
                  "text": "asc_int82int32",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_int82int32"
                },
                {
                  "text": "asc_intlv",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_intlv"
                },
                {
                  "text": "asc_le_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_le_scalar"
                },
                {
                  "text": "asc_le",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_le"
                },
                {
                  "text": "asc_leakyrelu",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_leakyrelu"
                },
                {
                  "text": "asc_ln",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_ln"
                },
                {
                  "text": "asc_lt_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_lt_scalar"
                },
                {
                  "text": "asc_lt",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_lt"
                },
                {
                  "text": "asc_madd",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_madd"
                },
                {
                  "text": "asc_max_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_max_scalar"
                },
                {
                  "text": "asc_max",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_max"
                },
                {
                  "text": "asc_mem_bar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_mem_bar"
                },
                {
                  "text": "asc_min_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_min_scalar"
                },
                {
                  "text": "asc_min",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_min"
                },
                {
                  "text": "asc_mul_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_mul_scalar"
                },
                {
                  "text": "asc_mul",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_mul"
                },
                {
                  "text": "asc_mull",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_mull"
                },
                {
                  "text": "asc_muls",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_muls"
                },
                {
                  "text": "asc_ne_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_ne_scalar"
                },
                {
                  "text": "asc_ne",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_ne"
                },
                {
                  "text": "asc_neg",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_neg"
                },
                {
                  "text": "asc_not",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_not"
                },
                {
                  "text": "asc_or",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_or"
                },
                {
                  "text": "asc_pack",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_pack"
                },
                {
                  "text": "asc_pair_reduce_sum",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_pair_reduce_sum"
                },
                {
                  "text": "asc_prelu",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_prelu"
                },
                {
                  "text": "asc_reduce_max_datablock",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_reduce_max_datablock"
                },
                {
                  "text": "asc_reduce_max",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_reduce_max"
                },
                {
                  "text": "asc_reduce_min_datablock",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_reduce_min_datablock"
                },
                {
                  "text": "asc_reduce_min",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_reduce_min"
                },
                {
                  "text": "asc_reduce_sum_datablock",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_reduce_sum_datablock"
                },
                {
                  "text": "asc_reduce_sum",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_reduce_sum"
                },
                {
                  "text": "asc_relu",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_relu"
                },
                {
                  "text": "asc_select",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_select"
                },
                {
                  "text": "asc_shiftleft_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_shiftleft_scalar"
                },
                {
                  "text": "asc_shiftleft",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_shiftleft"
                },
                {
                  "text": "asc_shiftright_scalar",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_shiftright_scalar"
                },
                {
                  "text": "asc_shiftright",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_shiftright"
                },
                {
                  "text": "asc_sqrt",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_sqrt"
                },
                {
                  "text": "asc_squeeze",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_squeeze"
                },
                {
                  "text": "asc_sub",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_sub"
                },
                {
                  "text": "asc_subc",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_subc"
                },
                {
                  "text": "asc_truncate",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_truncate"
                },
                {
                  "text": "asc_uint162uint32",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_uint162uint32"
                },
                {
                  "text": "asc_uint162uint8",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_uint162uint8"
                },
                {
                  "text": "asc_uint322int16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_uint322int16"
                },
                {
                  "text": "asc_uint322uint16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_uint322uint16"
                },
                {
                  "text": "asc_uint322uint8",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_uint322uint8"
                },
                {
                  "text": "asc_uint82half",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_uint82half"
                },
                {
                  "text": "asc_uint82uint16",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_uint82uint16"
                },
                {
                  "text": "asc_uint82uint32",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_uint82uint32"
                },
                {
                  "text": "asc_unpack",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_unpack"
                },
                {
                  "text": "asc_unsqueeze",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_unsqueeze"
                },
                {
                  "text": "asc_update_mask",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_update_mask"
                },
                {
                  "text": "asc_xor",
                  "link": "/api/SIMD-API/c_api/reg/reg_vector/asc_xor"
                }
              ]
            }
          ]
        },
        {
          "text": "scalar_compute",
          "collapsed": true,
          "items": [
            {
              "text": "asc_clear_nthbit",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_clear_nthbit"
            },
            {
              "text": "asc_clz",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_clz"
            },
            {
              "text": "asc_ffs",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_ffs"
            },
            {
              "text": "asc_ffz",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_ffz"
            },
            {
              "text": "asc_float2int32",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_float2int32"
            },
            {
              "text": "asc_popc",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_popc"
            },
            {
              "text": "asc_set_nthbit",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_set_nthbit"
            },
            {
              "text": "asc_sflbits",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_sflbits"
            },
            {
              "text": "asc_store_dev",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_store_dev"
            },
            {
              "text": "asc_zero_bits_cnt",
              "link": "/api/SIMD-API/c_api/scalar_compute/asc_zero_bits_cnt"
            }
          ]
        },
        {
          "text": "simd_atomic",
          "collapsed": true,
          "items": [
            {
              "text": "asc_get_store_atomic_config",
              "link": "/api/SIMD-API/c_api/simd_atomic/asc_get_store_atomic_config"
            },
            {
              "text": "asc_set_atomic_add",
              "link": "/api/SIMD-API/c_api/simd_atomic/asc_set_atomic_add"
            },
            {
              "text": "asc_set_atomic_max",
              "link": "/api/SIMD-API/c_api/simd_atomic/asc_set_atomic_max"
            },
            {
              "text": "asc_set_atomic_min",
              "link": "/api/SIMD-API/c_api/simd_atomic/asc_set_atomic_min"
            },
            {
              "text": "asc_set_atomic_none",
              "link": "/api/SIMD-API/c_api/simd_atomic/asc_set_atomic_none"
            },
            {
              "text": "asc_set_store_atomic_config_v1",
              "link": "/api/SIMD-API/c_api/simd_atomic/asc_set_store_atomic_config_v1"
            },
            {
              "text": "asc_set_store_atomic_config_v2",
              "link": "/api/SIMD-API/c_api/simd_atomic/asc_set_store_atomic_config_v2"
            }
          ]
        },
        {
          "text": "struct",
          "collapsed": true,
          "items": [
            {
              "text": "asc_fill_value_config",
              "link": "/api/SIMD-API/c_api/struct/asc_fill_value_config"
            },
            {
              "text": "asc_l13d_fmatrix_config",
              "link": "/api/SIMD-API/c_api/struct/asc_l13d_fmatrix_config"
            },
            {
              "text": "asc_load3d_v2_config",
              "link": "/api/SIMD-API/c_api/struct/asc_load3d_v2_config"
            },
            {
              "text": "asc_ndim_pad_count_config",
              "link": "/api/SIMD-API/c_api/struct/asc_ndim_pad_count_config"
            },
            {
              "text": "asc_store_atomic_config",
              "link": "/api/SIMD-API/c_api/struct/asc_store_atomic_config"
            }
          ]
        },
        {
          "text": "sync",
          "collapsed": true,
          "items": [
            {
              "text": "asc_lock",
              "link": "/api/SIMD-API/c_api/sync/asc_lock"
            },
            {
              "text": "asc_sync_block_arrive",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_block_arrive"
            },
            {
              "text": "asc_sync_block_wait",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_block_wait"
            },
            {
              "text": "asc_sync_data_barrier",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_data_barrier"
            },
            {
              "text": "asc_sync_inter_wait",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_inter_wait"
            },
            {
              "text": "asc_sync_intra_arrive",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_intra_arrive"
            },
            {
              "text": "asc_sync_intra_wait",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_intra_wait"
            },
            {
              "text": "asc_sync_mte2",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_mte2"
            },
            {
              "text": "asc_sync_mte3",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_mte3"
            },
            {
              "text": "asc_sync_notify",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_notify"
            },
            {
              "text": "asc_sync_pipe",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_pipe"
            },
            {
              "text": "asc_sync_vec",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_vec"
            },
            {
              "text": "asc_sync_wait",
              "link": "/api/SIMD-API/c_api/sync/asc_sync_wait"
            },
            {
              "text": "asc_sync",
              "link": "/api/SIMD-API/c_api/sync/asc_sync"
            },
            {
              "text": "asc_unlock",
              "link": "/api/SIMD-API/c_api/sync/asc_unlock"
            }
          ]
        },
        {
          "text": "sys_var",
          "collapsed": true,
          "items": [
            {
              "text": "asc_get_ar_spr",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_ar_spr"
            },
            {
              "text": "asc_get_arch_ver",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_arch_ver"
            },
            {
              "text": "asc_get_block_idx",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_block_idx"
            },
            {
              "text": "asc_get_block_num",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_block_num"
            },
            {
              "text": "asc_get_core_id",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_core_id"
            },
            {
              "text": "asc_get_ctrl",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_ctrl"
            },
            {
              "text": "asc_get_ffts_base_addr",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_ffts_base_addr"
            },
            {
              "text": "asc_get_phy_buf_addr",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_phy_buf_addr"
            },
            {
              "text": "asc_get_phy_stack_base",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_phy_stack_base"
            },
            {
              "text": "asc_get_program_counter",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_program_counter"
            },
            {
              "text": "asc_get_smmu_tag_version",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_smmu_tag_version"
            },
            {
              "text": "asc_get_status",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_status"
            },
            {
              "text": "asc_get_sub_block_id",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_sub_block_id"
            },
            {
              "text": "asc_get_sub_block_num",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_sub_block_num"
            },
            {
              "text": "asc_get_sys_virtual_base",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_sys_virtual_base"
            },
            {
              "text": "asc_get_system_cycle",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_system_cycle"
            },
            {
              "text": "asc_get_vf_len",
              "link": "/api/SIMD-API/c_api/sys_var/asc_get_vf_len"
            },
            {
              "text": "asc_set_ctrl",
              "link": "/api/SIMD-API/c_api/sys_var/asc_set_ctrl"
            },
            {
              "text": "asc_set_ffts_base_addr",
              "link": "/api/SIMD-API/c_api/sys_var/asc_set_ffts_base_addr"
            },
            {
              "text": "asc_set_gm2l1_nz_para",
              "link": "/api/SIMD-API/c_api/sys_var/asc_set_gm2l1_nz_para"
            },
            {
              "text": "asc_set_l0c2gm_channel_para",
              "link": "/api/SIMD-API/c_api/sys_var/asc_set_l0c2gm_channel_para"
            },
            {
              "text": "asc_set_l0c2gm_quant_post",
              "link": "/api/SIMD-API/c_api/sys_var/asc_set_l0c2gm_quant_post"
            },
            {
              "text": "asc_set_l0c2gm_relu_alpha",
              "link": "/api/SIMD-API/c_api/sys_var/asc_set_l0c2gm_relu_alpha"
            },
            {
              "text": "asc_set_l12l0_padding_val",
              "link": "/api/SIMD-API/c_api/sys_var/asc_set_l12l0_padding_val"
            },
            {
              "text": "asc_set_l3d_rpt_b",
              "link": "/api/SIMD-API/c_api/sys_var/asc_set_l3d_rpt_b"
            }
          ]
        },
        {
          "text": "vector_compute",
          "collapsed": true,
          "items": [
            {
              "text": "asc_abs",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_abs"
            },
            {
              "text": "asc_add_relu",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_add_relu"
            },
            {
              "text": "asc_add_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_add_scalar"
            },
            {
              "text": "asc_add",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_add"
            },
            {
              "text": "asc_and",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_and"
            },
            {
              "text": "asc_axpy",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_axpy"
            },
            {
              "text": "asc_bfloat162float",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_bfloat162float"
            },
            {
              "text": "asc_bfloat162int32",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_bfloat162int32"
            },
            {
              "text": "asc_bitsort",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_bitsort"
            },
            {
              "text": "asc_brcb",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_brcb"
            },
            {
              "text": "asc_copy",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_copy"
            },
            {
              "text": "asc_datablock_reduce_max",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_datablock_reduce_max"
            },
            {
              "text": "asc_datablock_reduce_min",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_datablock_reduce_min"
            },
            {
              "text": "asc_datablock_reduce_sum",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_datablock_reduce_sum"
            },
            {
              "text": "asc_deq_int162b8",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_deq_int162b8"
            },
            {
              "text": "asc_deq_int322half",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_deq_int322half"
            },
            {
              "text": "asc_div",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_div"
            },
            {
              "text": "asc_duplicate",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_duplicate"
            },
            {
              "text": "asc_eq_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_eq_scalar"
            },
            {
              "text": "asc_eq",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_eq"
            },
            {
              "text": "asc_exp",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_exp"
            },
            {
              "text": "asc_float2bf16",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_float2bf16"
            },
            {
              "text": "asc_float2float",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_float2float"
            },
            {
              "text": "asc_float2half",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_float2half"
            },
            {
              "text": "asc_float2int16",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_float2int16"
            },
            {
              "text": "asc_float2int32",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_float2int32"
            },
            {
              "text": "asc_float2int64",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_float2int64"
            },
            {
              "text": "asc_fma",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_fma"
            },
            {
              "text": "asc_gather_datablock",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_gather_datablock"
            },
            {
              "text": "asc_gather",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_gather"
            },
            {
              "text": "asc_ge_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_ge_scalar"
            },
            {
              "text": "asc_ge",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_ge"
            },
            {
              "text": "asc_get_cmp_mask",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_get_cmp_mask"
            },
            {
              "text": "asc_get_reduce_max_cnt",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_get_reduce_max_cnt"
            },
            {
              "text": "asc_get_reduce_min_cnt",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_get_reduce_min_cnt"
            },
            {
              "text": "asc_get_rsvd_count",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_get_rsvd_count"
            },
            {
              "text": "asc_get_vms4_sr",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_get_vms4_sr"
            },
            {
              "text": "asc_gt_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_gt_scalar"
            },
            {
              "text": "asc_gt",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_gt"
            },
            {
              "text": "asc_half2float",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_half2float"
            },
            {
              "text": "asc_half2int16",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_half2int16"
            },
            {
              "text": "asc_half2int32",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_half2int32"
            },
            {
              "text": "asc_half2int4",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_half2int4"
            },
            {
              "text": "asc_half2int8",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_half2int8"
            },
            {
              "text": "asc_half2uint8",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_half2uint8"
            },
            {
              "text": "asc_int162float",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_int162float"
            },
            {
              "text": "asc_int162half",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_int162half"
            },
            {
              "text": "asc_int322float",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_int322float"
            },
            {
              "text": "asc_int322int16",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_int322int16"
            },
            {
              "text": "asc_int322int64",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_int322int64"
            },
            {
              "text": "asc_int42half",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_int42half"
            },
            {
              "text": "asc_int642float",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_int642float"
            },
            {
              "text": "asc_int642int32",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_int642int32"
            },
            {
              "text": "asc_int82half",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_int82half"
            },
            {
              "text": "asc_le_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_le_scalar"
            },
            {
              "text": "asc_le",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_le"
            },
            {
              "text": "asc_leakyrelu",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_leakyrelu"
            },
            {
              "text": "asc_log",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_log"
            },
            {
              "text": "asc_lt_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_lt_scalar"
            },
            {
              "text": "asc_lt",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_lt"
            },
            {
              "text": "asc_max_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_max_scalar"
            },
            {
              "text": "asc_max",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_max"
            },
            {
              "text": "asc_min_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_min_scalar"
            },
            {
              "text": "asc_min",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_min"
            },
            {
              "text": "asc_mrgsort4",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_mrgsort4"
            },
            {
              "text": "asc_mul_add_relu",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_mul_add_relu"
            },
            {
              "text": "asc_mul_add",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_mul_add"
            },
            {
              "text": "asc_mul_cast_half2int8",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_mul_cast_half2int8"
            },
            {
              "text": "asc_mul_cast_half2uint8",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_mul_cast_half2uint8"
            },
            {
              "text": "asc_mul_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_mul_scalar"
            },
            {
              "text": "asc_mul",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_mul"
            },
            {
              "text": "asc_ne_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_ne_scalar"
            },
            {
              "text": "asc_ne",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_ne"
            },
            {
              "text": "asc_not",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_not"
            },
            {
              "text": "asc_or",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_or"
            },
            {
              "text": "asc_pair_reduce_sum",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_pair_reduce_sum"
            },
            {
              "text": "asc_rcp",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_rcp"
            },
            {
              "text": "asc_reduce",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_reduce"
            },
            {
              "text": "asc_relu",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_relu"
            },
            {
              "text": "asc_repeat_reduce_max",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_repeat_reduce_max"
            },
            {
              "text": "asc_repeat_reduce_min",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_repeat_reduce_min"
            },
            {
              "text": "asc_repeat_reduce_sum",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_repeat_reduce_sum"
            },
            {
              "text": "asc_rsqrt",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_rsqrt"
            },
            {
              "text": "asc_select",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_select"
            },
            {
              "text": "asc_set_cmp_mask",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_set_cmp_mask"
            },
            {
              "text": "asc_set_deq_scale",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_set_deq_scale"
            },
            {
              "text": "asc_set_mask_count",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_set_mask_count"
            },
            {
              "text": "asc_set_mask_norm",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_set_mask_norm"
            },
            {
              "text": "asc_set_va_reg",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_set_va_reg"
            },
            {
              "text": "asc_set_vector_mask",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_set_vector_mask"
            },
            {
              "text": "asc_shiftleft",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_shiftleft"
            },
            {
              "text": "asc_shiftright",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_shiftright"
            },
            {
              "text": "asc_sqrt",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_sqrt"
            },
            {
              "text": "asc_squeeze",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_squeeze"
            },
            {
              "text": "asc_sub_relu",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_sub_relu"
            },
            {
              "text": "asc_sub_scalar",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_sub_scalar"
            },
            {
              "text": "asc_sub",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_sub"
            },
            {
              "text": "asc_transpose",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_transpose"
            },
            {
              "text": "asc_transto5hd",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_transto5hd"
            },
            {
              "text": "asc_uint82half",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_uint82half"
            },
            {
              "text": "asc_vdeq_int162b8",
              "link": "/api/SIMD-API/c_api/vector_compute/asc_vdeq_int162b8"
            }
          ]
        },
        {
          "text": "vector_datamove",
          "collapsed": true,
          "items": [
            {
              "text": "asc_copy_gm2ub",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_copy_gm2ub"
            },
            {
              "text": "asc_copy_ub2gm",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_copy_ub2gm"
            },
            {
              "text": "asc_copy_ub2l1",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_copy_ub2l1"
            },
            {
              "text": "asc_copy_ub2ub",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_copy_ub2ub"
            },
            {
              "text": "asc_ndim_copy_gm2ub",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_ndim_copy_gm2ub"
            },
            {
              "text": "asc_set_copy_pad_val",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_copy_pad_val"
            },
            {
              "text": "asc_set_gm2ub_loop_size",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_gm2ub_loop_size"
            },
            {
              "text": "asc_set_gm2ub_loop1_stride",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_gm2ub_loop1_stride"
            },
            {
              "text": "asc_set_gm2ub_loop2_stride",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_gm2ub_loop2_stride"
            },
            {
              "text": "asc_set_ndim_loop_stride",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_ndim_loop_stride"
            },
            {
              "text": "asc_set_ndim_pad_count",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_ndim_pad_count"
            },
            {
              "text": "asc_set_ndim_pad_value",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_ndim_pad_value"
            },
            {
              "text": "asc_set_ub2gm_loop_size",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_ub2gm_loop_size"
            },
            {
              "text": "asc_set_ub2gm_loop1_stride",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_ub2gm_loop1_stride"
            },
            {
              "text": "asc_set_ub2gm_loop2_stride",
              "link": "/api/SIMD-API/c_api/vector_datamove/asc_set_ub2gm_loop2_stride"
            },
            {
              "text": "asc_copy_gm2ub_align",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_gm2ub_align_arch_2201",
                  "link": "/api/SIMD-API/c_api/vector_datamove/asc_copy_gm2ub_align/asc_copy_gm2ub_align_arch_2201"
                },
                {
                  "text": "asc_copy_gm2ub_align_arch_3510",
                  "link": "/api/SIMD-API/c_api/vector_datamove/asc_copy_gm2ub_align/asc_copy_gm2ub_align_arch_3510"
                }
              ]
            },
            {
              "text": "asc_copy_ub2gm_align",
              "collapsed": true,
              "items": [
                {
                  "text": "asc_copy_ub2gm_align_arch_2201",
                  "link": "/api/SIMD-API/c_api/vector_datamove/asc_copy_ub2gm_align/asc_copy_ub2gm_align_arch_2201"
                },
                {
                  "text": "asc_copy_ub2gm_align_arch_3510",
                  "link": "/api/SIMD-API/c_api/vector_datamove/asc_copy_ub2gm_align/asc_copy_ub2gm_align_arch_3510"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "/api/SIMT-API/": [
    {
      "text": "概述",
      "link": "/api/SIMT-API/概述"
    },
    {
      "text": "SIMT-API",
      "link": "/api/SIMT-API/SIMT-API"
    },
    {
      "text": "地址空间谓词函数",
      "collapsed": true,
      "items": [
        {
          "text": "地址空间谓词函数",
          "link": "/api/SIMT-API/地址空间谓词函数/地址空间谓词函数"
        }
      ]
    },
    {
      "text": "地址空间转换函数",
      "collapsed": true,
      "items": [
        {
          "text": "地址空间转换函数",
          "link": "/api/SIMT-API/地址空间转换函数/地址空间转换函数"
        }
      ]
    },
    {
      "text": "访存函数",
      "collapsed": true,
      "items": [
        {
          "text": "访存函数",
          "link": "/api/SIMT-API/访存函数/访存函数"
        },
        {
          "text": "asc_ldca",
          "link": "/api/SIMT-API/访存函数/asc_ldca"
        },
        {
          "text": "asc_ldcg",
          "link": "/api/SIMT-API/访存函数/asc_ldcg"
        },
        {
          "text": "asc_stcg",
          "link": "/api/SIMT-API/访存函数/asc_stcg"
        },
        {
          "text": "asc_stwt",
          "link": "/api/SIMT-API/访存函数/asc_stwt"
        }
      ]
    },
    {
      "text": "数学函数",
      "collapsed": true,
      "items": [
        {
          "text": "数学函数",
          "link": "/api/SIMT-API/数学函数/数学函数"
        },
        {
          "text": "数据类型转换",
          "collapsed": true,
          "items": [
            {
              "text": "概述-258",
              "link": "/api/SIMT-API/数学函数/数据类型转换/概述-258"
            },
            {
              "text": "数据类型转换",
              "link": "/api/SIMT-API/数学函数/数据类型转换/数据类型转换"
            },
            {
              "text": "类型转换函数",
              "collapsed": true,
              "items": [
                {
                  "text": "类型转换函数",
                  "link": "/api/SIMT-API/数学函数/数据类型转换/类型转换函数/类型转换函数"
                }
              ]
            }
          ]
        },
        {
          "text": "整型数学库函数",
          "collapsed": true,
          "items": [
            {
              "text": "整型数学库函数",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/整型数学库函数"
            },
            {
              "text": "labs",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/labs"
            },
            {
              "text": "llabs",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/llabs"
            },
            {
              "text": "llmax",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/llmax"
            },
            {
              "text": "llmin",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/llmin"
            },
            {
              "text": "max1",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/max1"
            },
            {
              "text": "min1",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/min1"
            },
            {
              "text": "ullmax",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/ullmax"
            },
            {
              "text": "ullmin",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/ullmin"
            },
            {
              "text": "umax",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/umax"
            },
            {
              "text": "umin",
              "link": "/api/SIMT-API/数学函数/整型数学库函数/umin"
            }
          ]
        },
        {
          "text": "bfloat16类型",
          "collapsed": true,
          "items": [
            {
              "text": "bfloat16类型",
              "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型"
            },
            {
              "text": "bfloat16类型比较函数",
              "collapsed": true,
              "items": [
                {
                  "text": "bfloat16类型比较函数",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型比较函数/bfloat16类型比较函数"
                }
              ]
            },
            {
              "text": "bfloat16类型精度转换函数",
              "collapsed": true,
              "items": [
                {
                  "text": "bfloat16类型精度转换函数",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型精度转换函数/bfloat16类型精度转换函数"
                }
              ]
            },
            {
              "text": "bfloat16类型数学库函数",
              "collapsed": true,
              "items": [
                {
                  "text": "bfloat16类型数学库函数",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/bfloat16类型数学库函数"
                },
                {
                  "text": "hceil-190",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hceil-190"
                },
                {
                  "text": "hcos-183",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hcos-183"
                },
                {
                  "text": "hexp-177",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hexp-177"
                },
                {
                  "text": "hexp10-179",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hexp10-179"
                },
                {
                  "text": "hexp2-178",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hexp2-178"
                },
                {
                  "text": "hfloor-189",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hfloor-189"
                },
                {
                  "text": "hlog-180",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hlog-180"
                },
                {
                  "text": "hlog10-182",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hlog10-182"
                },
                {
                  "text": "hlog2-181",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hlog2-181"
                },
                {
                  "text": "hrcp-187",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hrcp-187"
                },
                {
                  "text": "hrint-188",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hrint-188"
                },
                {
                  "text": "hrsqrt-186",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hrsqrt-186"
                },
                {
                  "text": "hsin-184",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hsin-184"
                },
                {
                  "text": "hsqrt-185",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/hsqrt-185"
                },
                {
                  "text": "htanh-176",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/htanh-176"
                },
                {
                  "text": "htrunc-191",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型数学库函数/htrunc-191"
                }
              ]
            },
            {
              "text": "bfloat16类型算术函数",
              "collapsed": true,
              "items": [
                {
                  "text": "bfloat16类型算术函数",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16类型算术函数/bfloat16类型算术函数"
                }
              ]
            },
            {
              "text": "bfloat16x2类型比较函数",
              "collapsed": true,
              "items": [
                {
                  "text": "bfloat16x2类型比较函数",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型比较函数/bfloat16x2类型比较函数"
                }
              ]
            },
            {
              "text": "bfloat16x2类型数学库函数",
              "collapsed": true,
              "items": [
                {
                  "text": "bfloat16x2类型数学库函数",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/bfloat16x2类型数学库函数"
                },
                {
                  "text": "h2ceil-256",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2ceil-256"
                },
                {
                  "text": "h2cos-249",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2cos-249"
                },
                {
                  "text": "h2exp-243",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2exp-243"
                },
                {
                  "text": "h2exp10-245",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2exp10-245"
                },
                {
                  "text": "h2exp2-244",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2exp2-244"
                },
                {
                  "text": "h2floor-255",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2floor-255"
                },
                {
                  "text": "h2log-246",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2log-246"
                },
                {
                  "text": "h2log10-248",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2log10-248"
                },
                {
                  "text": "h2log2-247",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2log2-247"
                },
                {
                  "text": "h2rcp-253",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2rcp-253"
                },
                {
                  "text": "h2rint-254",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2rint-254"
                },
                {
                  "text": "h2rsqrt-252",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2rsqrt-252"
                },
                {
                  "text": "h2sin-250",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2sin-250"
                },
                {
                  "text": "h2sqrt-251",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2sqrt-251"
                },
                {
                  "text": "h2tanh-242",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2tanh-242"
                },
                {
                  "text": "h2trunc-257",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型数学库函数/h2trunc-257"
                }
              ]
            },
            {
              "text": "bfloat16x2类型算术函数",
              "collapsed": true,
              "items": [
                {
                  "text": "bfloat16x2类型算术函数",
                  "link": "/api/SIMT-API/数学函数/bfloat16类型/bfloat16x2类型算术函数/bfloat16x2类型算术函数"
                }
              ]
            }
          ]
        },
        {
          "text": "float类型数学库函数",
          "collapsed": true,
          "items": [
            {
              "text": "acosf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/acosf"
            },
            {
              "text": "acoshf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/acoshf"
            },
            {
              "text": "asinf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/asinf"
            },
            {
              "text": "asinhf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/asinhf"
            },
            {
              "text": "atan2f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/atan2f"
            },
            {
              "text": "atanf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/atanf"
            },
            {
              "text": "atanhf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/atanhf"
            },
            {
              "text": "cbrtf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/cbrtf"
            },
            {
              "text": "ceilf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/ceilf"
            },
            {
              "text": "copysignf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/copysignf"
            },
            {
              "text": "cosf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/cosf"
            },
            {
              "text": "coshf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/coshf"
            },
            {
              "text": "cospif",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/cospif"
            },
            {
              "text": "cyl_bessel_i0f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/cyl_bessel_i0f"
            },
            {
              "text": "cyl_bessel_i1f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/cyl_bessel_i1f"
            },
            {
              "text": "erfcf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/erfcf"
            },
            {
              "text": "erfcinvf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/erfcinvf"
            },
            {
              "text": "erfcxf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/erfcxf"
            },
            {
              "text": "erff",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/erff"
            },
            {
              "text": "erfinvf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/erfinvf"
            },
            {
              "text": "exp10f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/exp10f"
            },
            {
              "text": "exp2f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/exp2f"
            },
            {
              "text": "expf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/expf"
            },
            {
              "text": "expm1f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/expm1f"
            },
            {
              "text": "fabsf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/fabsf"
            },
            {
              "text": "fdimf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/fdimf"
            },
            {
              "text": "fdividef",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/fdividef"
            },
            {
              "text": "float类型数学库函数",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/float类型数学库函数"
            },
            {
              "text": "floorf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/floorf"
            },
            {
              "text": "fmaf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/fmaf"
            },
            {
              "text": "fmaxf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/fmaxf"
            },
            {
              "text": "fminf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/fminf"
            },
            {
              "text": "fmodf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/fmodf"
            },
            {
              "text": "frexpf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/frexpf"
            },
            {
              "text": "hypotf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/hypotf"
            },
            {
              "text": "ilogbf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/ilogbf"
            },
            {
              "text": "isfinite1",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/isfinite1"
            },
            {
              "text": "isinf1",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/isinf1"
            },
            {
              "text": "isnan1",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/isnan1"
            },
            {
              "text": "j0f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/j0f"
            },
            {
              "text": "j1f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/j1f"
            },
            {
              "text": "jnf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/jnf"
            },
            {
              "text": "ldexpf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/ldexpf"
            },
            {
              "text": "lgammaf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/lgammaf"
            },
            {
              "text": "llrintf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/llrintf"
            },
            {
              "text": "llroundf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/llroundf"
            },
            {
              "text": "log10f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/log10f"
            },
            {
              "text": "log1pf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/log1pf"
            },
            {
              "text": "log2f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/log2f"
            },
            {
              "text": "logbf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/logbf"
            },
            {
              "text": "logf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/logf"
            },
            {
              "text": "lrintf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/lrintf"
            },
            {
              "text": "lroundf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/lroundf"
            },
            {
              "text": "modff",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/modff"
            },
            {
              "text": "nearbyintf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/nearbyintf"
            },
            {
              "text": "nextafterf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/nextafterf"
            },
            {
              "text": "norm3df",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/norm3df"
            },
            {
              "text": "norm4df",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/norm4df"
            },
            {
              "text": "normcdff",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/normcdff"
            },
            {
              "text": "normcdfinvf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/normcdfinvf"
            },
            {
              "text": "normf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/normf"
            },
            {
              "text": "powf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/powf"
            },
            {
              "text": "rcbrtf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/rcbrtf"
            },
            {
              "text": "remainderf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/remainderf"
            },
            {
              "text": "remquof",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/remquof"
            },
            {
              "text": "rhypotf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/rhypotf"
            },
            {
              "text": "rintf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/rintf"
            },
            {
              "text": "rnorm3df",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/rnorm3df"
            },
            {
              "text": "rnorm4df",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/rnorm4df"
            },
            {
              "text": "rnormf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/rnormf"
            },
            {
              "text": "roundf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/roundf"
            },
            {
              "text": "rsqrtf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/rsqrtf"
            },
            {
              "text": "scalblnf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/scalblnf"
            },
            {
              "text": "scalbnf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/scalbnf"
            },
            {
              "text": "signbit",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/signbit"
            },
            {
              "text": "sincosf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/sincosf"
            },
            {
              "text": "sincospif",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/sincospif"
            },
            {
              "text": "sinf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/sinf"
            },
            {
              "text": "sinhf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/sinhf"
            },
            {
              "text": "sinpif",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/sinpif"
            },
            {
              "text": "sqrtf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/sqrtf"
            },
            {
              "text": "tanf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/tanf"
            },
            {
              "text": "tanhf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/tanhf"
            },
            {
              "text": "tanpif",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/tanpif"
            },
            {
              "text": "tgammaf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/tgammaf"
            },
            {
              "text": "truncf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/truncf"
            },
            {
              "text": "y0f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/y0f"
            },
            {
              "text": "y1f",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/y1f"
            },
            {
              "text": "ynf",
              "link": "/api/SIMT-API/数学函数/float类型数学库函数/ynf"
            }
          ]
        },
        {
          "text": "fp8类型",
          "collapsed": true,
          "items": [
            {
              "text": "fp8类型",
              "link": "/api/SIMT-API/数学函数/fp8类型/fp8类型"
            },
            {
              "text": "fp8数据类型简介",
              "link": "/api/SIMT-API/数学函数/fp8类型/fp8数据类型简介"
            },
            {
              "text": "fp8数据转换函数",
              "collapsed": true,
              "items": [
                {
                  "text": "fp8数据转换函数",
                  "link": "/api/SIMT-API/数学函数/fp8类型/fp8数据转换函数/fp8数据转换函数"
                }
              ]
            }
          ]
        },
        {
          "text": "half类型",
          "collapsed": true,
          "items": [
            {
              "text": "half类型",
              "link": "/api/SIMT-API/数学函数/half类型/half类型"
            },
            {
              "text": "half2类型比较函数",
              "collapsed": true,
              "items": [
                {
                  "text": "half2类型比较函数",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型比较函数/half2类型比较函数"
                }
              ]
            },
            {
              "text": "half2类型数学库函数",
              "collapsed": true,
              "items": [
                {
                  "text": "h2ceil",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2ceil"
                },
                {
                  "text": "h2cos",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2cos"
                },
                {
                  "text": "h2exp",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2exp"
                },
                {
                  "text": "h2exp10",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2exp10"
                },
                {
                  "text": "h2exp2",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2exp2"
                },
                {
                  "text": "h2floor",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2floor"
                },
                {
                  "text": "h2log",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2log"
                },
                {
                  "text": "h2log10",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2log10"
                },
                {
                  "text": "h2log2",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2log2"
                },
                {
                  "text": "h2rcp",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2rcp"
                },
                {
                  "text": "h2rint",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2rint"
                },
                {
                  "text": "h2rsqrt",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2rsqrt"
                },
                {
                  "text": "h2sin",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2sin"
                },
                {
                  "text": "h2sqrt",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2sqrt"
                },
                {
                  "text": "h2tanh",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2tanh"
                },
                {
                  "text": "h2trunc",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/h2trunc"
                },
                {
                  "text": "half2类型数学库函数",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型数学库函数/half2类型数学库函数"
                }
              ]
            },
            {
              "text": "half2类型算术函数",
              "collapsed": true,
              "items": [
                {
                  "text": "half2类型算术函数",
                  "link": "/api/SIMT-API/数学函数/half类型/half2类型算术函数/half2类型算术函数"
                }
              ]
            },
            {
              "text": "half类型比较函数",
              "collapsed": true,
              "items": [
                {
                  "text": "half类型比较函数",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型比较函数/half类型比较函数"
                }
              ]
            },
            {
              "text": "half类型精度转换函数",
              "collapsed": true,
              "items": [
                {
                  "text": "half类型精度转换函数",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型精度转换函数/half类型精度转换函数"
                }
              ]
            },
            {
              "text": "half类型数学库函数",
              "collapsed": true,
              "items": [
                {
                  "text": "half类型数学库函数",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/half类型数学库函数"
                },
                {
                  "text": "hceil",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hceil"
                },
                {
                  "text": "hcos",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hcos"
                },
                {
                  "text": "hexp",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hexp"
                },
                {
                  "text": "hexp10",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hexp10"
                },
                {
                  "text": "hexp2",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hexp2"
                },
                {
                  "text": "hfloor",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hfloor"
                },
                {
                  "text": "hlog",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hlog"
                },
                {
                  "text": "hlog10",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hlog10"
                },
                {
                  "text": "hlog2",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hlog2"
                },
                {
                  "text": "hrcp",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hrcp"
                },
                {
                  "text": "hrint",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hrint"
                },
                {
                  "text": "hrsqrt",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hrsqrt"
                },
                {
                  "text": "hsin",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hsin"
                },
                {
                  "text": "hsqrt",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/hsqrt"
                },
                {
                  "text": "htanh",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/htanh"
                },
                {
                  "text": "htrunc",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型数学库函数/htrunc"
                }
              ]
            },
            {
              "text": "half类型算术函数",
              "collapsed": true,
              "items": [
                {
                  "text": "half类型算术函数",
                  "link": "/api/SIMT-API/数学函数/half类型/half类型算术函数/half类型算术函数"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "text": "同步与内存栅栏",
      "collapsed": true,
      "items": [
        {
          "text": "同步与内存栅栏",
          "link": "/api/SIMT-API/同步与内存栅栏/同步与内存栅栏"
        },
        {
          "text": "内存栅栏接口",
          "collapsed": true,
          "items": [
            {
              "text": "内存栅栏接口",
              "link": "/api/SIMT-API/同步与内存栅栏/内存栅栏接口/内存栅栏接口"
            },
            {
              "text": "asc_threadfence_block",
              "link": "/api/SIMT-API/同步与内存栅栏/内存栅栏接口/asc_threadfence_block"
            },
            {
              "text": "asc_threadfence",
              "link": "/api/SIMT-API/同步与内存栅栏/内存栅栏接口/asc_threadfence"
            }
          ]
        },
        {
          "text": "同步接口",
          "collapsed": true,
          "items": [
            {
              "text": "同步接口",
              "link": "/api/SIMT-API/同步与内存栅栏/同步接口/同步接口"
            },
            {
              "text": "asc_syncthreads",
              "link": "/api/SIMT-API/同步与内存栅栏/同步接口/asc_syncthreads"
            }
          ]
        }
      ]
    },
    {
      "text": "原子操作",
      "collapsed": true,
      "items": [
        {
          "text": "原子操作-149",
          "link": "/api/SIMT-API/原子操作/原子操作-149"
        },
        {
          "text": "asc_atomic_add",
          "link": "/api/SIMT-API/原子操作/asc_atomic_add"
        },
        {
          "text": "asc_atomic_and",
          "link": "/api/SIMT-API/原子操作/asc_atomic_and"
        },
        {
          "text": "asc_atomic_cas",
          "link": "/api/SIMT-API/原子操作/asc_atomic_cas"
        },
        {
          "text": "asc_atomic_dec",
          "link": "/api/SIMT-API/原子操作/asc_atomic_dec"
        },
        {
          "text": "asc_atomic_exch",
          "link": "/api/SIMT-API/原子操作/asc_atomic_exch"
        },
        {
          "text": "asc_atomic_inc",
          "link": "/api/SIMT-API/原子操作/asc_atomic_inc"
        },
        {
          "text": "asc_atomic_max",
          "link": "/api/SIMT-API/原子操作/asc_atomic_max"
        },
        {
          "text": "asc_atomic_min",
          "link": "/api/SIMT-API/原子操作/asc_atomic_min"
        },
        {
          "text": "asc_atomic_or",
          "link": "/api/SIMT-API/原子操作/asc_atomic_or"
        },
        {
          "text": "asc_atomic_sub",
          "link": "/api/SIMT-API/原子操作/asc_atomic_sub"
        },
        {
          "text": "asc_atomic_xor",
          "link": "/api/SIMT-API/原子操作/asc_atomic_xor"
        }
      ]
    },
    {
      "text": "SIMD与SIMT混合编程简介",
      "collapsed": true,
      "items": [
        {
          "text": "编程模型-140",
          "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/编程模型-140"
        },
        {
          "text": "API列表-148",
          "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/API列表-148"
        },
        {
          "text": "SIMD与SIMT混合编程简介",
          "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/SIMD与SIMT混合编程简介"
        },
        {
          "text": "扩展语法",
          "collapsed": true,
          "items": [
            {
              "text": "函数执行空间限定符-142",
              "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/扩展语法/函数执行空间限定符-142"
            },
            {
              "text": "核函数配置-147",
              "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/扩展语法/核函数配置-147"
            },
            {
              "text": "扩展语法-141",
              "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/扩展语法/扩展语法-141"
            },
            {
              "text": "内存空间限定符-143",
              "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/扩展语法/内存空间限定符-143"
            },
            {
              "text": "内置变量-145",
              "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/扩展语法/内置变量-145"
            },
            {
              "text": "内置宏-146",
              "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/扩展语法/内置宏-146"
            },
            {
              "text": "内置数据类型-144",
              "link": "/api/SIMT-API/SIMD与SIMT混合编程简介/扩展语法/内置数据类型-144"
            }
          ]
        }
      ]
    },
    {
      "text": "SIMT编程简介",
      "collapsed": true,
      "items": [
        {
          "text": "编程模型",
          "link": "/api/SIMT-API/SIMT编程简介/编程模型"
        },
        {
          "text": "API列表",
          "link": "/api/SIMT-API/SIMT编程简介/API列表"
        },
        {
          "text": "SIMT编程简介",
          "link": "/api/SIMT-API/SIMT编程简介/SIMT编程简介"
        },
        {
          "text": "扩展语法",
          "collapsed": true,
          "items": [
            {
              "text": "函数执行空间限定符",
              "link": "/api/SIMT-API/SIMT编程简介/扩展语法/函数执行空间限定符"
            },
            {
              "text": "核函数配置",
              "link": "/api/SIMT-API/SIMT编程简介/扩展语法/核函数配置"
            },
            {
              "text": "扩展语法",
              "link": "/api/SIMT-API/SIMT编程简介/扩展语法/扩展语法"
            },
            {
              "text": "内存空间限定符",
              "link": "/api/SIMT-API/SIMT编程简介/扩展语法/内存空间限定符"
            },
            {
              "text": "内置变量",
              "link": "/api/SIMT-API/SIMT编程简介/扩展语法/内置变量"
            },
            {
              "text": "内置宏",
              "link": "/api/SIMT-API/SIMT编程简介/扩展语法/内置宏"
            },
            {
              "text": "内置数据类型-139",
              "link": "/api/SIMT-API/SIMT编程简介/扩展语法/内置数据类型-139"
            }
          ]
        }
      ]
    },
    {
      "text": "Warp函数",
      "collapsed": true,
      "items": [
        {
          "text": "Warp函数",
          "link": "/api/SIMT-API/Warp函数/Warp函数"
        },
        {
          "text": "Warp-Reduce类函数",
          "collapsed": true,
          "items": [
            {
              "text": "asc_reduce_add",
              "link": "/api/SIMT-API/Warp函数/Warp-Reduce类函数/asc_reduce_add"
            },
            {
              "text": "Warp-Reduce类函数",
              "link": "/api/SIMT-API/Warp函数/Warp-Reduce类函数/Warp-Reduce类函数"
            }
          ]
        },
        {
          "text": "Warp-Shfl类函数",
          "collapsed": true,
          "items": [
            {
              "text": "asc_shfl_down",
              "link": "/api/SIMT-API/Warp函数/Warp-Shfl类函数/asc_shfl_down"
            },
            {
              "text": "asc_shfl_up",
              "link": "/api/SIMT-API/Warp函数/Warp-Shfl类函数/asc_shfl_up"
            },
            {
              "text": "asc_shfl_xor",
              "link": "/api/SIMT-API/Warp函数/Warp-Shfl类函数/asc_shfl_xor"
            },
            {
              "text": "asc_shfl",
              "link": "/api/SIMT-API/Warp函数/Warp-Shfl类函数/asc_shfl"
            },
            {
              "text": "Warp-Shfl类函数",
              "link": "/api/SIMT-API/Warp函数/Warp-Shfl类函数/Warp-Shfl类函数"
            }
          ]
        },
        {
          "text": "Warp-Vote类函数",
          "collapsed": true,
          "items": [
            {
              "text": "asc_activemask",
              "link": "/api/SIMT-API/Warp函数/Warp-Vote类函数/asc_activemask"
            },
            {
              "text": "asc_all",
              "link": "/api/SIMT-API/Warp函数/Warp-Vote类函数/asc_all"
            },
            {
              "text": "asc_any",
              "link": "/api/SIMT-API/Warp函数/Warp-Vote类函数/asc_any"
            },
            {
              "text": "asc_ballot",
              "link": "/api/SIMT-API/Warp函数/Warp-Vote类函数/asc_ballot"
            },
            {
              "text": "Warp-Vote类函数",
              "link": "/api/SIMT-API/Warp函数/Warp-Vote类函数/Warp-Vote类函数"
            }
          ]
        }
      ]
    }
  ],
  "/api/Utils-API/": [
    {
      "text": "Utils-API",
      "link": "/api/Utils-API/Utils-API"
    },
    {
      "text": "Utils-API列表",
      "link": "/api/Utils-API/Utils-API列表"
    },
    {
      "text": "调测接口",
      "collapsed": true,
      "items": [
        {
          "text": "调测接口",
          "link": "/api/Utils-API/调测接口/调测接口"
        },
        {
          "text": "asc_dump",
          "link": "/api/Utils-API/调测接口/asc_dump"
        },
        {
          "text": "asc_mark_stamp",
          "link": "/api/Utils-API/调测接口/asc_mark_stamp"
        },
        {
          "text": "asc_prof_start",
          "link": "/api/Utils-API/调测接口/asc_prof_start"
        },
        {
          "text": "asc_prof_stop",
          "link": "/api/Utils-API/调测接口/asc_prof_stop"
        },
        {
          "text": "asc_time_stamp",
          "link": "/api/Utils-API/调测接口/asc_time_stamp"
        },
        {
          "text": "assert-291",
          "link": "/api/Utils-API/调测接口/assert-291"
        },
        {
          "text": "clock",
          "link": "/api/Utils-API/调测接口/clock"
        },
        {
          "text": "printf-290",
          "link": "/api/Utils-API/调测接口/printf-290"
        },
        {
          "text": "TRACE_START",
          "link": "/api/Utils-API/调测接口/TRACE_START"
        },
        {
          "text": "TRACE_STOP",
          "link": "/api/Utils-API/调测接口/TRACE_STOP"
        }
      ]
    },
    {
      "text": "平台信息获取",
      "collapsed": true,
      "items": [
        {
          "text": "平台信息获取",
          "link": "/api/Utils-API/平台信息获取/平台信息获取"
        },
        {
          "text": "PlatformAscendCManager",
          "link": "/api/Utils-API/平台信息获取/PlatformAscendCManager"
        },
        {
          "text": "PlatformAscendC",
          "collapsed": true,
          "items": [
            {
              "text": "构造及析构函数",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/构造及析构函数"
            },
            {
              "text": "CalcTschNumBlocks",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/CalcTschNumBlocks"
            },
            {
              "text": "GetCoreMemBw",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetCoreMemBw"
            },
            {
              "text": "GetCoreMemSize",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetCoreMemSize"
            },
            {
              "text": "GetCoreNum-270",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetCoreNum-270"
            },
            {
              "text": "GetCoreNumAic",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetCoreNumAic"
            },
            {
              "text": "GetCoreNumAiv",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetCoreNumAiv"
            },
            {
              "text": "GetCoreNumVector",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetCoreNumVector"
            },
            {
              "text": "GetCurNpuArch",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetCurNpuArch"
            },
            {
              "text": "GetLibApiWorkSpaceSize",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetLibApiWorkSpaceSize"
            },
            {
              "text": "GetResCubeGroupWorkSpaceSize",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetResCubeGroupWorkSpaceSize"
            },
            {
              "text": "GetResGroupBarrierWorkSpaceSize",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetResGroupBarrierWorkSpaceSize"
            },
            {
              "text": "GetSocVersion",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetSocVersion"
            },
            {
              "text": "GetVecRegLen",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/GetVecRegLen"
            },
            {
              "text": "PlatformAscendC",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/PlatformAscendC"
            },
            {
              "text": "PlatformAscendC简介",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/PlatformAscendC简介"
            },
            {
              "text": "ReserveLocalMemory",
              "link": "/api/Utils-API/平台信息获取/PlatformAscendC/ReserveLocalMemory"
            }
          ]
        }
      ]
    },
    {
      "text": "原型注册与管理",
      "collapsed": true,
      "items": [
        {
          "text": "原型注册接口（OP_ADD）",
          "link": "/api/Utils-API/原型注册与管理/原型注册接口（OP_ADD）"
        },
        {
          "text": "原型注册与管理",
          "link": "/api/Utils-API/原型注册与管理/原型注册与管理"
        },
        {
          "text": "OpAICoreConfig注册接口（REGISTER_OP_AICORE_CONFIG）",
          "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig注册接口（REGISTER_OP_AICORE_CONFIG）"
        },
        {
          "text": "OpAICoreConfig",
          "collapsed": true,
          "items": [
            {
              "text": "DynamicCompileStaticFlag",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/DynamicCompileStaticFlag"
            },
            {
              "text": "DynamicFormatFlag",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/DynamicFormatFlag"
            },
            {
              "text": "DynamicRankSupportFlag",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/DynamicRankSupportFlag"
            },
            {
              "text": "DynamicShapeSupportFlag",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/DynamicShapeSupportFlag"
            },
            {
              "text": "ExtendCfgInfo-284",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/ExtendCfgInfo-284"
            },
            {
              "text": "Input-282",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/Input-282"
            },
            {
              "text": "NeedCheckSupportFlag",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/NeedCheckSupportFlag"
            },
            {
              "text": "OpAICoreConfig",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/OpAICoreConfig"
            },
            {
              "text": "OpAICoreConfig构造函数",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/OpAICoreConfig构造函数"
            },
            {
              "text": "operator-285",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/operator-285"
            },
            {
              "text": "Output-283",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/Output-283"
            },
            {
              "text": "PrecisionReduceFlag",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreConfig/PrecisionReduceFlag"
            }
          ]
        },
        {
          "text": "OpAICoreDef",
          "collapsed": true,
          "items": [
            {
              "text": "AddConfig",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreDef/AddConfig"
            },
            {
              "text": "LaunchWithZeroEleOutputTensors",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreDef/LaunchWithZeroEleOutputTensors"
            },
            {
              "text": "OpAICoreDef",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreDef/OpAICoreDef"
            },
            {
              "text": "SetCheckSupport",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreDef/SetCheckSupport"
            },
            {
              "text": "SetOpSelectFormat",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreDef/SetOpSelectFormat"
            },
            {
              "text": "SetOpSpecInfo",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreDef/SetOpSpecInfo"
            },
            {
              "text": "SetOpSupportInfo",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreDef/SetOpSupportInfo"
            },
            {
              "text": "SetParamGeneralize",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreDef/SetParamGeneralize"
            },
            {
              "text": "SetTiling",
              "link": "/api/Utils-API/原型注册与管理/OpAICoreDef/SetTiling"
            }
          ]
        },
        {
          "text": "OpAICPUDef",
          "collapsed": true,
          "items": [
            {
              "text": "ComputeCost",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/ComputeCost"
            },
            {
              "text": "Engine",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/Engine"
            },
            {
              "text": "ExtendCfgInfo",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/ExtendCfgInfo"
            },
            {
              "text": "FlagAsync",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/FlagAsync"
            },
            {
              "text": "FlagPartial",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/FlagPartial"
            },
            {
              "text": "FunctionName",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/FunctionName"
            },
            {
              "text": "KernelSo",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/KernelSo"
            },
            {
              "text": "OpAICPUDef",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/OpAICPUDef"
            },
            {
              "text": "OpkernelLib1",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/OpkernelLib1"
            },
            {
              "text": "UserDefined",
              "link": "/api/Utils-API/原型注册与管理/OpAICPUDef/UserDefined"
            }
          ]
        },
        {
          "text": "OpAttrDef",
          "collapsed": true,
          "items": [
            {
              "text": "Comment-273",
              "link": "/api/Utils-API/原型注册与管理/OpAttrDef/Comment-273"
            },
            {
              "text": "OpAttrDef-272",
              "link": "/api/Utils-API/原型注册与管理/OpAttrDef/OpAttrDef-272"
            },
            {
              "text": "OpAttrDef",
              "link": "/api/Utils-API/原型注册与管理/OpAttrDef/OpAttrDef"
            }
          ]
        },
        {
          "text": "OpDef",
          "collapsed": true,
          "items": [
            {
              "text": "AICore",
              "link": "/api/Utils-API/原型注册与管理/OpDef/AICore"
            },
            {
              "text": "AICPU",
              "link": "/api/Utils-API/原型注册与管理/OpDef/AICPU"
            },
            {
              "text": "Attr",
              "link": "/api/Utils-API/原型注册与管理/OpDef/Attr"
            },
            {
              "text": "Comment",
              "link": "/api/Utils-API/原型注册与管理/OpDef/Comment"
            },
            {
              "text": "EnableFallBack",
              "link": "/api/Utils-API/原型注册与管理/OpDef/EnableFallBack"
            },
            {
              "text": "FormatMatchMode",
              "link": "/api/Utils-API/原型注册与管理/OpDef/FormatMatchMode"
            },
            {
              "text": "HostCPU",
              "link": "/api/Utils-API/原型注册与管理/OpDef/HostCPU"
            },
            {
              "text": "Input",
              "link": "/api/Utils-API/原型注册与管理/OpDef/Input"
            },
            {
              "text": "MC2",
              "link": "/api/Utils-API/原型注册与管理/OpDef/MC2"
            },
            {
              "text": "OpDef",
              "link": "/api/Utils-API/原型注册与管理/OpDef/OpDef"
            },
            {
              "text": "Output",
              "link": "/api/Utils-API/原型注册与管理/OpDef/Output"
            },
            {
              "text": "SetInferDataType",
              "link": "/api/Utils-API/原型注册与管理/OpDef/SetInferDataType"
            },
            {
              "text": "SetInferShape",
              "link": "/api/Utils-API/原型注册与管理/OpDef/SetInferShape"
            },
            {
              "text": "SetInferShapeRange",
              "link": "/api/Utils-API/原型注册与管理/OpDef/SetInferShapeRange"
            }
          ]
        },
        {
          "text": "OpHostCPUDef",
          "collapsed": true,
          "items": [
            {
              "text": "ComputeCost-276",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/ComputeCost-276"
            },
            {
              "text": "Engine-274",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/Engine-274"
            },
            {
              "text": "ExtendCfgInfo-281",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/ExtendCfgInfo-281"
            },
            {
              "text": "FlagAsync-277",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/FlagAsync-277"
            },
            {
              "text": "FlagPartial-275",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/FlagPartial-275"
            },
            {
              "text": "FunctionName-279",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/FunctionName-279"
            },
            {
              "text": "KernelSo-278",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/KernelSo-278"
            },
            {
              "text": "OpHostCPUDef",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/OpHostCPUDef"
            },
            {
              "text": "OpKernelLib",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/OpKernelLib"
            },
            {
              "text": "UserDefined-280",
              "link": "/api/Utils-API/原型注册与管理/OpHostCPUDef/UserDefined-280"
            }
          ]
        },
        {
          "text": "OpMC2Def",
          "collapsed": true,
          "items": [
            {
              "text": "HcclGroup",
              "link": "/api/Utils-API/原型注册与管理/OpMC2Def/HcclGroup"
            },
            {
              "text": "HcclServerType",
              "link": "/api/Utils-API/原型注册与管理/OpMC2Def/HcclServerType"
            },
            {
              "text": "operator-286",
              "link": "/api/Utils-API/原型注册与管理/OpMC2Def/operator-286"
            },
            {
              "text": "OpMC2Def",
              "link": "/api/Utils-API/原型注册与管理/OpMC2Def/OpMC2Def"
            },
            {
              "text": "OpMC2Def构造函数",
              "link": "/api/Utils-API/原型注册与管理/OpMC2Def/OpMC2Def构造函数"
            },
            {
              "text": "OpMC2Def简介",
              "link": "/api/Utils-API/原型注册与管理/OpMC2Def/OpMC2Def简介"
            }
          ]
        },
        {
          "text": "OpParamDef",
          "collapsed": true,
          "items": [
            {
              "text": "构造-拷贝构造函数",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/构造-拷贝构造函数"
            },
            {
              "text": "AutoContiguous",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/AutoContiguous"
            },
            {
              "text": "Comment-271",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/Comment-271"
            },
            {
              "text": "DataType",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/DataType"
            },
            {
              "text": "DataTypeForBinQuery",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/DataTypeForBinQuery"
            },
            {
              "text": "DataTypeList",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/DataTypeList"
            },
            {
              "text": "Follow",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/Follow"
            },
            {
              "text": "Format",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/Format"
            },
            {
              "text": "FormatForBinQuery",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/FormatForBinQuery"
            },
            {
              "text": "FormatList",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/FormatList"
            },
            {
              "text": "IgnoreContiguous",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/IgnoreContiguous"
            },
            {
              "text": "InitValue",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/InitValue"
            },
            {
              "text": "OpParamDef",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/OpParamDef"
            },
            {
              "text": "OutputShapeDependOnCompute",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/OutputShapeDependOnCompute"
            },
            {
              "text": "ParamType",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/ParamType"
            },
            {
              "text": "Scalar",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/Scalar"
            },
            {
              "text": "ScalarList",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/ScalarList"
            },
            {
              "text": "To",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/To"
            },
            {
              "text": "UnknownShapeFormat（废弃）",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/UnknownShapeFormat（废弃）"
            },
            {
              "text": "ValueDepend",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/ValueDepend"
            },
            {
              "text": "Version",
              "link": "/api/Utils-API/原型注册与管理/OpParamDef/Version"
            }
          ]
        }
      ]
    },
    {
      "text": "C++标准库",
      "collapsed": true,
      "items": [
        {
          "text": "C++标准库",
          "link": "/api/Utils-API/C++标准库/C++标准库"
        },
        {
          "text": "类型特性",
          "collapsed": true,
          "items": [
            {
              "text": "类型特性",
              "link": "/api/Utils-API/C++标准库/类型特性/类型特性"
            },
            {
              "text": "add_const",
              "link": "/api/Utils-API/C++标准库/类型特性/add_const"
            },
            {
              "text": "add_cv",
              "link": "/api/Utils-API/C++标准库/类型特性/add_cv"
            },
            {
              "text": "add_lvalue_reference",
              "link": "/api/Utils-API/C++标准库/类型特性/add_lvalue_reference"
            },
            {
              "text": "add_pointer",
              "link": "/api/Utils-API/C++标准库/类型特性/add_pointer"
            },
            {
              "text": "add_rvalue_reference",
              "link": "/api/Utils-API/C++标准库/类型特性/add_rvalue_reference"
            },
            {
              "text": "add_volatile",
              "link": "/api/Utils-API/C++标准库/类型特性/add_volatile"
            },
            {
              "text": "conditional",
              "link": "/api/Utils-API/C++标准库/类型特性/conditional"
            },
            {
              "text": "enable_if",
              "link": "/api/Utils-API/C++标准库/类型特性/enable_if"
            },
            {
              "text": "integral_constant",
              "link": "/api/Utils-API/C++标准库/类型特性/integral_constant"
            },
            {
              "text": "is_array",
              "link": "/api/Utils-API/C++标准库/类型特性/is_array"
            },
            {
              "text": "is_base_of",
              "link": "/api/Utils-API/C++标准库/类型特性/is_base_of"
            },
            {
              "text": "is_const",
              "link": "/api/Utils-API/C++标准库/类型特性/is_const"
            },
            {
              "text": "is_convertible",
              "link": "/api/Utils-API/C++标准库/类型特性/is_convertible"
            },
            {
              "text": "is_floating_point",
              "link": "/api/Utils-API/C++标准库/类型特性/is_floating_point"
            },
            {
              "text": "is_integral",
              "link": "/api/Utils-API/C++标准库/类型特性/is_integral"
            },
            {
              "text": "is_pointer",
              "link": "/api/Utils-API/C++标准库/类型特性/is_pointer"
            },
            {
              "text": "is_reference",
              "link": "/api/Utils-API/C++标准库/类型特性/is_reference"
            },
            {
              "text": "is_same",
              "link": "/api/Utils-API/C++标准库/类型特性/is_same"
            },
            {
              "text": "is_void",
              "link": "/api/Utils-API/C++标准库/类型特性/is_void"
            },
            {
              "text": "remove_const",
              "link": "/api/Utils-API/C++标准库/类型特性/remove_const"
            },
            {
              "text": "remove_cv",
              "link": "/api/Utils-API/C++标准库/类型特性/remove_cv"
            },
            {
              "text": "remove_pointer",
              "link": "/api/Utils-API/C++标准库/类型特性/remove_pointer"
            },
            {
              "text": "remove_reference",
              "link": "/api/Utils-API/C++标准库/类型特性/remove_reference"
            },
            {
              "text": "remove_volatile",
              "link": "/api/Utils-API/C++标准库/类型特性/remove_volatile"
            }
          ]
        },
        {
          "text": "容器函数",
          "collapsed": true,
          "items": [
            {
              "text": "容器函数",
              "link": "/api/Utils-API/C++标准库/容器函数/容器函数"
            },
            {
              "text": "get1",
              "link": "/api/Utils-API/C++标准库/容器函数/get1"
            },
            {
              "text": "make_tuple",
              "link": "/api/Utils-API/C++标准库/容器函数/make_tuple"
            },
            {
              "text": "tuple",
              "link": "/api/Utils-API/C++标准库/容器函数/tuple"
            }
          ]
        },
        {
          "text": "数学函数",
          "collapsed": true,
          "items": [
            {
              "text": "数学函数-269",
              "link": "/api/Utils-API/C++标准库/数学函数/数学函数-269"
            },
            {
              "text": "abs1",
              "link": "/api/Utils-API/C++标准库/数学函数/abs1"
            },
            {
              "text": "sqrt1",
              "link": "/api/Utils-API/C++标准库/数学函数/sqrt1"
            }
          ]
        },
        {
          "text": "算法",
          "collapsed": true,
          "items": [
            {
              "text": "算法",
              "link": "/api/Utils-API/C++标准库/算法/算法"
            },
            {
              "text": "max-267",
              "link": "/api/Utils-API/C++标准库/算法/max-267"
            },
            {
              "text": "min-268",
              "link": "/api/Utils-API/C++标准库/算法/min-268"
            }
          ]
        },
        {
          "text": "通用工具",
          "collapsed": true,
          "items": [
            {
              "text": "通用工具",
              "link": "/api/Utils-API/C++标准库/通用工具/通用工具"
            },
            {
              "text": "integer_sequence",
              "link": "/api/Utils-API/C++标准库/通用工具/integer_sequence"
            }
          ]
        }
      ]
    },
    {
      "text": "RTC",
      "collapsed": true,
      "items": [
        {
          "text": "aclrtcAddNameExpr",
          "link": "/api/Utils-API/RTC/aclrtcAddNameExpr"
        },
        {
          "text": "aclrtcCompileProg",
          "link": "/api/Utils-API/RTC/aclrtcCompileProg"
        },
        {
          "text": "aclrtcCreateProg",
          "link": "/api/Utils-API/RTC/aclrtcCreateProg"
        },
        {
          "text": "aclrtcDestroyProg",
          "link": "/api/Utils-API/RTC/aclrtcDestroyProg"
        },
        {
          "text": "aclrtcGetBinData",
          "link": "/api/Utils-API/RTC/aclrtcGetBinData"
        },
        {
          "text": "aclrtcGetBinDataSize",
          "link": "/api/Utils-API/RTC/aclrtcGetBinDataSize"
        },
        {
          "text": "aclrtcGetCompileLog",
          "link": "/api/Utils-API/RTC/aclrtcGetCompileLog"
        },
        {
          "text": "aclrtcGetCompileLogSize",
          "link": "/api/Utils-API/RTC/aclrtcGetCompileLogSize"
        },
        {
          "text": "aclrtcGetLoweredName",
          "link": "/api/Utils-API/RTC/aclrtcGetLoweredName"
        },
        {
          "text": "RTC",
          "link": "/api/Utils-API/RTC/RTC"
        },
        {
          "text": "RTC错误码",
          "link": "/api/Utils-API/RTC/RTC错误码"
        },
        {
          "text": "RTC简介",
          "link": "/api/Utils-API/RTC/RTC简介"
        }
      ]
    },
    {
      "text": "SuperKernel",
      "collapsed": true,
      "items": [
        {
          "text": "SK_BIND",
          "link": "/api/Utils-API/SuperKernel/SK_BIND"
        },
        {
          "text": "SuperKernel",
          "link": "/api/Utils-API/SuperKernel/SuperKernel"
        }
      ]
    },
    {
      "text": "Tiling调测",
      "collapsed": true,
      "items": [
        {
          "text": "Tiling调测",
          "link": "/api/Utils-API/Tiling调测/Tiling调测"
        },
        {
          "text": "ContextBuilder",
          "collapsed": true,
          "items": [
            {
              "text": "简介-289",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/简介-289"
            },
            {
              "text": "AddAttr",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/AddAttr"
            },
            {
              "text": "AddInputTd",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/AddInputTd"
            },
            {
              "text": "AddOutputTd",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/AddOutputTd"
            },
            {
              "text": "AddPlatformInfo",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/AddPlatformInfo"
            },
            {
              "text": "BuildKernelRunContext",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/BuildKernelRunContext"
            },
            {
              "text": "BuildTilingContext",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/BuildTilingContext"
            },
            {
              "text": "CompileInfo",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/CompileInfo"
            },
            {
              "text": "ContextBuilder",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/ContextBuilder"
            },
            {
              "text": "ContextBuilder构造函数",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/ContextBuilder构造函数"
            },
            {
              "text": "Inputs",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/Inputs"
            },
            {
              "text": "IrInstanceNum",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/IrInstanceNum"
            },
            {
              "text": "KernelRunContextHolder结构定义",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/KernelRunContextHolder结构定义"
            },
            {
              "text": "NodeIoNum",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/NodeIoNum"
            },
            {
              "text": "Outputs",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/Outputs"
            },
            {
              "text": "PlatformInfo",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/PlatformInfo"
            },
            {
              "text": "SetOpNameType",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/SetOpNameType"
            },
            {
              "text": "TilingData",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/TilingData"
            },
            {
              "text": "Workspace",
              "link": "/api/Utils-API/Tiling调测/ContextBuilder/Workspace"
            }
          ]
        },
        {
          "text": "OpTilingRegistry",
          "collapsed": true,
          "items": [
            {
              "text": "构造和析构函数-288",
              "link": "/api/Utils-API/Tiling调测/OpTilingRegistry/构造和析构函数-288"
            },
            {
              "text": "简介-287",
              "link": "/api/Utils-API/Tiling调测/OpTilingRegistry/简介-287"
            },
            {
              "text": "GetTilingFunc",
              "link": "/api/Utils-API/Tiling调测/OpTilingRegistry/GetTilingFunc"
            },
            {
              "text": "LoadTilingLibrary",
              "link": "/api/Utils-API/Tiling调测/OpTilingRegistry/LoadTilingLibrary"
            },
            {
              "text": "OpTilingRegistry",
              "link": "/api/Utils-API/Tiling调测/OpTilingRegistry/OpTilingRegistry"
            }
          ]
        }
      ]
    },
    {
      "text": "Tiling模板编程",
      "collapsed": true,
      "items": [
        {
          "text": "模板参数定义",
          "link": "/api/Utils-API/Tiling模板编程/模板参数定义"
        },
        {
          "text": "ASCENDC_TPL_SEL_PARAM",
          "link": "/api/Utils-API/Tiling模板编程/ASCENDC_TPL_SEL_PARAM"
        },
        {
          "text": "GET_TPL_TILING_KEY",
          "link": "/api/Utils-API/Tiling模板编程/GET_TPL_TILING_KEY"
        },
        {
          "text": "Tiling模板编程",
          "link": "/api/Utils-API/Tiling模板编程/Tiling模板编程"
        }
      ]
    },
    {
      "text": "Tiling数据结构注册",
      "collapsed": true,
      "items": [
        {
          "text": "Tiling数据结构注册",
          "link": "/api/Utils-API/Tiling数据结构注册/Tiling数据结构注册"
        },
        {
          "text": "TilingData结构定义",
          "link": "/api/Utils-API/Tiling数据结构注册/TilingData结构定义"
        },
        {
          "text": "TilingData结构注册",
          "link": "/api/Utils-API/Tiling数据结构注册/TilingData结构注册"
        }
      ]
    },
    {
      "text": "Tiling下沉",
      "collapsed": true,
      "items": [
        {
          "text": "DEVICE_IMPL_OP_OPTILING",
          "link": "/api/Utils-API/Tiling下沉/DEVICE_IMPL_OP_OPTILING"
        },
        {
          "text": "Tiling下沉",
          "link": "/api/Utils-API/Tiling下沉/Tiling下沉"
        }
      ]
    }
  ],
  "/api/AI-CPU-API/": [
    {
      "text": "AI-CPU-API",
      "link": "/api/AI-CPU-API/AI-CPU-API"
    },
    {
      "text": "AI-CPU-API列表",
      "link": "/api/AI-CPU-API/AI-CPU-API列表"
    },
    {
      "text": "assert-293",
      "link": "/api/AI-CPU-API/assert-293"
    },
    {
      "text": "DataStoreBarrier",
      "link": "/api/AI-CPU-API/DataStoreBarrier"
    },
    {
      "text": "printf-292",
      "link": "/api/AI-CPU-API/printf-292"
    }
  ],
  "/api/": [
    {
      "text": "Ascend-C-API列表",
      "link": "/api/Ascend-C-API列表"
    },
    {
      "text": "README",
      "link": "/api/README"
    },
    {
      "text": "SIMD-API",
      "collapsed": true,
      "items": [
        {
          "text": "通用说明和约束",
          "link": "/api/SIMD-API/通用说明和约束"
        },
        {
          "text": "C-API",
          "link": "/api/SIMD-API/C-API"
        },
        {
          "text": "SIMD-API",
          "link": "/api/SIMD-API/SIMD-API"
        },
        {
          "text": "SIMD-API列表",
          "link": "/api/SIMD-API/SIMD-API列表"
        }
      ]
    },
    {
      "text": "SIMT-API",
      "collapsed": true,
      "items": [
        {
          "text": "概述",
          "link": "/api/SIMT-API/概述"
        },
        {
          "text": "SIMT-API",
          "link": "/api/SIMT-API/SIMT-API"
        }
      ]
    },
    {
      "text": "Utils-API",
      "collapsed": true,
      "items": [
        {
          "text": "Utils-API",
          "link": "/api/Utils-API/Utils-API"
        },
        {
          "text": "Utils-API列表",
          "link": "/api/Utils-API/Utils-API列表"
        }
      ]
    },
    {
      "text": "AI-CPU-API",
      "collapsed": true,
      "items": [
        {
          "text": "AI-CPU-API",
          "link": "/api/AI-CPU-API/AI-CPU-API"
        },
        {
          "text": "AI-CPU-API列表",
          "link": "/api/AI-CPU-API/AI-CPU-API列表"
        },
        {
          "text": "assert-293",
          "link": "/api/AI-CPU-API/assert-293"
        },
        {
          "text": "DataStoreBarrier",
          "link": "/api/AI-CPU-API/DataStoreBarrier"
        },
        {
          "text": "printf-292",
          "link": "/api/AI-CPU-API/printf-292"
        }
      ]
    },
    {
      "text": "附录",
      "collapsed": true,
      "items": [
        {
          "text": "附录",
          "link": "/api/附录/附录"
        },
        {
          "text": "接口变更说明",
          "link": "/api/附录/接口变更说明"
        },
        {
          "text": "预留接口",
          "link": "/api/附录/预留接口"
        }
      ]
    }
  ]
}
