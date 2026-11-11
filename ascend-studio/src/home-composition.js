const step = (id, title, description, tone = "blue") => ({ id, title, description, tone });

const field = (id, title, english, hint, role, tone, x, y, related = [], promptValue = title, options = {}) => ({
  id,
  title,
  english,
  hint,
  role,
  tone,
  x,
  y,
  related,
  promptValue,
  topicId: options.topicId || null,
  goalId: options.goalId || null,
  defaultSteps: options.defaultSteps || [],
  prominence: options.prominence || "related",
  size: related.length >= 4 ? "large" : related.length ? "medium" : "small",
});

export const initialCompositionIds = [
  "operator-topic",
  "operator-principles",
  "operator-development",
  "operator-optimization",
  "operator-porting",
  "operator-validation",
  "operator-ascendc-model",
  "operator-framework-integration",
  "inference-topic",
  "training-topic",
  "performance-topic",
];

export const compositionFields = [
  // Operator work is the main interest cluster. Related goals are visible from
  // the first screen; inference, training and tuning remain as neighboring paths.
  field(
    "operator-topic", "算子", "OPERATOR", "从原理、开发到性能优化继续探索", "topic", "blue", 50, 50,
    ["operator-principles", "operator-development", "operator-optimization", "operator-porting", "operator-validation", "operator-ascendc-model", "operator-framework-integration"],
    "算子",
    {
      prominence: "primary",
      defaultSteps: [
        step("operator-semantics", "理解算子的计算语义", "从输入、输出与计算过程建立对算子的基本理解。", "blue"),
        step("tiling-strategy", "设计 Tiling 策略", "结合数据规模与硬件执行方式组织计算任务。", "violet"),
        step("kernel-implementation", "完成 Kernel 实现", "将计算逻辑映射为可执行的算子实现。", "teal"),
        step("compile-validation", "编译并验证结果", "检查编译结果、正确性与关键性能表现。", "coral"),
      ],
    },
  ),
  field(
    "inference-topic", "模型推理", "MODEL INFERENCE", "从模型适配延伸到端到端运行", "topic", "violet", 12, 34,
    ["inference-conversion", "inference-input", "inference-run"], "模型推理",
    {
      defaultSteps: [
        step("model-conversion", "准备模型转换", "理解模型格式、转换配置与运行环境之间的关系。", "violet"),
        step("input-shape", "适配模型输入", "梳理输入数据、预处理顺序与 Shape 约束。", "teal"),
        step("end-to-end-inference", "跑通端到端推理", "连接模型加载、推理执行与结果核对。", "blue"),
      ],
    },
  ),
  field(
    "training-topic", "模型训练", "MODEL TRAINING", "从训练流程延伸到并行与精度策略", "topic", "teal", 88, 32,
    ["training-flow", "parallel-strategy", "mixed-precision"], "模型训练",
    {
      defaultSteps: [
        step("training-data", "组织训练数据与输入流程", "把数据供给、预处理与训练入口串成完整流程。", "teal"),
        step("training-flow", "构建训练流程", "梳理前向、反向、优化器与检查点等关键环节。", "blue"),
        step("parallel-strategy", "选择并行策略", "理解数据并行与模型并行的适用方式。", "violet"),
        step("training-validation", "验证训练表现", "结合收敛、精度与吞吐评估训练过程。", "coral"),
      ],
    },
  ),
  field(
    "performance-topic", "性能调优", "PERFORMANCE TUNING", "从性能分析连接到优化与验证", "topic", "coral", 88, 70,
    ["performance-baseline", "profiler-analysis", "performance-improvement"], "性能调优",
    {
      defaultSteps: [
        step("performance-baseline", "建立性能基线", "固定运行条件，记录吞吐、时延等关键指标。", "blue"),
        step("profiler-analysis", "分析性能时间线", "从算子、访存与设备执行过程理解时间分布。", "violet"),
        step("kernel-optimization", "实施针对性优化", "围绕计算与访存特征调整实现策略。", "teal"),
        step("performance-validation", "对照验证优化结果", "比较优化前后的性能，并复核精度与稳定性。", "coral"),
      ],
    },
  ),

  // Operator learning intentions are peer paths, never nested under development.
  field("operator-principles", "理解算子原理", "OPERATOR PRINCIPLES", "从计算语义、数据布局到硬件执行建立理解", "goal", "violet", 34, 25,
    ["operator-semantics", "tensor-layout", "hardware-mapping"], "理解算子原理", {
      topicId: "operator-topic",
      prominence: "primary",
      defaultSteps: [
        step("operator-semantics", "理解计算语义与输入输出", "明确算子处理的数据、计算规则与输出关系。", "blue"),
        step("tensor-layout", "认识数据类型与布局", "理解 Shape、数据类型与布局对执行的影响。", "teal"),
        step("hardware-mapping", "连接计算逻辑与硬件执行", "了解计算任务如何映射到设备执行过程。", "violet"),
      ],
    }),
  field("operator-development", "完成算子开发", "CUSTOM OPERATOR DEVELOPMENT", "从接口定义走到可验证的算子实现", "goal", "blue", 50, 16,
    ["operator-interface", "tiling-strategy", "kernel-implementation", "compile-validation"], "完成自定义算子开发", {
      topicId: "operator-topic",
      prominence: "primary",
      defaultSteps: [
        step("operator-interface", "定义算子接口与输入输出", "明确参数、张量 Shape、数据类型与输出约束。", "blue"),
        step("tiling-strategy", "设计 Tiling 策略", "根据数据规模和硬件资源组织计算分块。", "violet"),
        step("kernel-implementation", "编写 Kernel 实现", "将计算逻辑映射到 Ascend C 执行方式。", "teal"),
        step("compile-validation", "编译并验证正确性", "检查构建结果、关键样例与精度表现。", "coral"),
      ],
    }),
  field("operator-optimization", "优化算子性能", "OPERATOR PERFORMANCE", "围绕性能基线、时间线与实现策略展开", "goal", "teal", 66, 25,
    ["performance-baseline", "profiler-analysis", "kernel-optimization", "performance-validation"], "优化算子性能", {
      topicId: "operator-topic",
      prominence: "primary",
      defaultSteps: [
        step("performance-baseline", "建立算子性能基线", "在固定输入与运行条件下记录初始耗时。", "blue"),
        step("profiler-analysis", "分析算子执行时间线", "识别计算、访存与调度相关的耗时特征。", "violet"),
        step("kernel-optimization", "调整计算与访存策略", "依据分析结果改进 Kernel 实现。", "teal"),
        step("performance-validation", "对照验证性能与精度", "确认优化收益并检查输出正确性。", "coral"),
      ],
    }),
  field("operator-porting", "迁移与适配算子", "OPERATOR PORTING", "梳理算子接口差异并完成昇腾适配", "goal", "coral", 28, 51,
    ["operator-api-mapping", "operator-data-adaptation", "compile-validation"], "迁移与适配算子", {
      topicId: "operator-topic",
      prominence: "primary",
      defaultSteps: [
        step("operator-api-mapping", "梳理算子接口与计算映射", "对齐原实现中的参数、数据与计算语义。", "blue"),
        step("operator-data-adaptation", "适配数据类型与布局", "确认昇腾侧输入格式及执行约束。", "violet"),
        step("compile-validation", "完成编译与结果验证", "检查构建、正确性及性能表现。", "coral"),
      ],
    }),
  field("operator-validation", "验证算子正确性", "OPERATOR VALIDATION", "从典型输入、边界数据到精度对比", "goal", "blue", 34, 77,
    ["operator-test-design", "precision-comparison", "edge-case-validation"], "验证算子正确性", {
      topicId: "operator-topic",
      prominence: "primary",
      defaultSteps: [
        step("operator-test-design", "设计代表性测试样例", "覆盖常见 Shape、数据类型与输入范围。", "blue"),
        step("precision-comparison", "对比输出与精度", "检查关键输出并确认误差范围。", "violet"),
        step("edge-case-validation", "验证边界输入", "确认边界条件下的结果与稳定性。", "coral"),
      ],
    }),

  field("operator-ascendc-model", "Ascend C 编程", "ASCEND C PROGRAMMING MODEL", "理解编程模型、存储层级与设备执行方式", "goal", "violet", 50, 85,
    ["ascendc-programming-basics", "ascendc-memory-model", "ascendc-execution-model"], "学习 Ascend C 编程模型", {
      topicId: "operator-topic",
      prominence: "primary",
      defaultSteps: [
        step("ascendc-programming-basics", "认识 Ascend C 编程模型", "建立对算子程序结构与执行组织的整体认识。", "blue"),
        step("ascendc-memory-model", "理解存储层级与数据搬运", "梳理数据在不同存储层级间的组织与流动。", "teal"),
        step("ascendc-execution-model", "理解设备侧执行方式", "连接计算任务、并行执行与同步关系。", "violet"),
      ],
    }),
  field("operator-framework-integration", "将算子接入框架", "FRAMEWORK INTEGRATION", "从接口注册走到框架侧调用", "goal", "teal", 70, 77,
    ["framework-op-interface", "operator-registration", "framework-call-validation"], "将算子接入框架", {
      topicId: "operator-topic",
      prominence: "primary",
      defaultSteps: [
        step("framework-op-interface", "对齐框架算子接口", "确认框架调用方式与算子输入输出的映射。", "blue"),
        step("operator-registration", "完成算子注册与构建", "将算子实现接入目标工程的构建流程。", "teal"),
        step("framework-call-validation", "验证框架侧调用", "核对调用链、输入输出与运行结果。", "coral"),
      ],
    }),

  // Inference intentions and their concrete learning content.
  field("inference-conversion", "完成模型转换", "MODEL CONVERSION", "理解模型格式、转换参数与适用范围", "goal", "violet", 0, 0,
    ["model-format", "conversion-config", "conversion-validation"], "完成模型转换", {
      topicId: "inference-topic",
      defaultSteps: [
        step("model-format", "确认模型格式与算子支持", "了解源模型结构及目标运行环境要求。", "violet"),
        step("conversion-config", "配置模型转换", "选择合适的转换参数并生成目标模型。", "blue"),
        step("conversion-validation", "检查转换结果", "核对转换产物与模型运行条件。", "coral"),
      ],
    }),
  field("inference-input", "适配模型输入", "MODEL INPUT ADAPTATION", "梳理输入数据、预处理顺序与 Shape", "goal", "teal", 0, 0,
    ["input-preprocessing", "input-shape", "input-dtype"], "适配模型输入", {
      topicId: "inference-topic",
      defaultSteps: [
        step("input-preprocessing", "整理输入预处理流程", "确认颜色、归一化与维度顺序等步骤。", "teal"),
        step("input-shape", "适配输入 Shape", "核对模型签名与实际输入维度。", "blue"),
        step("input-dtype", "匹配数据类型与布局", "让输入数据符合模型执行要求。", "violet"),
      ],
    }),
  field("inference-run", "跑通端到端推理", "END-TO-END INFERENCE", "从模型加载、推理执行到结果核对", "goal", "blue", 0, 0,
    ["runtime-initialization", "inference-execution", "inference-validation"], "跑通端到端推理", {
      topicId: "inference-topic",
      defaultSteps: [
        step("runtime-initialization", "准备推理运行环境", "连接模型、设备与必要的运行配置。", "blue"),
        step("inference-execution", "执行推理并获取结果", "跑通输入到输出的完整调用流程。", "teal"),
        step("inference-validation", "核对精度与时延", "验证推理结果及端到端运行表现。", "coral"),
      ],
    }),

  // Training intentions and their concrete learning content.
  field("training-flow", "构建训练流程", "TRAINING FLOW", "从数据供给、模型计算到优化器组织训练过程", "goal", "teal", 0, 0,
    ["training-data", "forward-backward", "optimizer-schedule"], "构建训练流程", {
      topicId: "training-topic",
      defaultSteps: [
        step("training-data", "组织训练数据与输入流程", "让数据读取与预处理稳定接入训练。", "teal"),
        step("forward-backward", "串起前向与反向计算", "理解模型计算图与梯度更新过程。", "blue"),
        step("optimizer-schedule", "配置优化器与学习率计划", "明确优化策略及训练阶段安排。", "violet"),
      ],
    }),
  field("parallel-strategy", "设计并行策略", "PARALLEL STRATEGY", "从数据并行、张量并行到通信协同", "goal", "violet", 0, 0,
    ["data-parallel", "tensor-parallel", "communication-pattern"], "设计并行策略", {
      topicId: "training-topic",
      defaultSteps: [
        step("data-parallel", "理解数据并行", "明确数据切分、梯度同步与全局 Batch 关系。", "blue"),
        step("tensor-parallel", "探索张量并行", "理解模型计算切分与通信位置。", "violet"),
        step("communication-pattern", "梳理通信模式", "认识集合通信在训练过程中的作用。", "coral"),
      ],
    }),
  field("mixed-precision", "应用混合精度", "MIXED PRECISION", "平衡计算效率与数值稳定性", "goal", "blue", 0, 0,
    ["fp16-bf16", "loss-scaling", "training-validation"], "应用混合精度", {
      topicId: "training-topic",
      defaultSteps: [
        step("fp16-bf16", "选择 FP16 或 BF16", "了解精度格式与训练计算的适用条件。", "blue"),
        step("loss-scaling", "理解 Loss Scaling", "认识数值范围管理与缩放策略。", "violet"),
        step("training-validation", "验证精度与训练表现", "对照损失、收敛与吞吐变化。", "coral"),
      ],
    }),

  // Cross-cutting performance intentions.
  field("performance-baseline", "建立性能基线", "PERFORMANCE BASELINE", "用稳定条件记录可比较的性能表现", "goal", "blue", 0, 0,
    ["throughput-latency", "warmup-repeat", "comparison-validation"], "建立性能基线", {
      topicId: "performance-topic",
      defaultSteps: [
        step("warmup-repeat", "固定运行条件并预热", "让性能采样具备可重复的运行条件。", "blue"),
        step("throughput-latency", "记录吞吐与时延", "选择与当前目标相关的性能指标。", "violet"),
        step("comparison-validation", "保留基线用于对照", "让后续优化可以在相同条件下比较。", "coral"),
      ],
    }),
  field("profiler-analysis", "分析性能时间线", "PROFILER ANALYSIS", "理解算子执行、设备利用与访存分布", "goal", "violet", 0, 0,
    ["operator-time-distribution", "device-utilization", "memory-access"], "分析性能时间线", {
      topicId: "performance-topic",
      defaultSteps: [
        step("operator-time-distribution", "观察算子耗时分布", "识别主要计算阶段及其时间占比。", "violet"),
        step("device-utilization", "查看设备执行状态", "理解计算单元利用与任务空隙。", "teal"),
        step("memory-access", "分析访存特征", "观察数据搬运与存储访问模式。", "blue"),
      ],
    }),
  field("performance-improvement", "优化执行效率", "PERFORMANCE IMPROVEMENT", "结合计算、访存与并行方式选择优化方向", "goal", "teal", 0, 0,
    ["kernel-optimization", "data-pipeline", "performance-validation"], "优化执行效率", {
      topicId: "performance-topic",
      defaultSteps: [
        step("kernel-optimization", "优化 Kernel 计算与访存", "依据分析结果调整执行策略。", "teal"),
        step("data-pipeline", "检查数据供给效率", "梳理数据预处理与设备执行的衔接。", "blue"),
        step("performance-validation", "对照验证优化结果", "比较性能变化并复核精度与稳定性。", "coral"),
      ],
    }),

  // Concrete learning content, revealed one level deeper from each intention.
  field("operator-semantics", "计算语义与输入输出", "OPERATOR SEMANTICS", "明确算子计算规则及输入输出关系", "content", "blue", 0, 0, [], "计算语义与输入输出", { topicId: "operator-topic", goalId: "operator-principles" }),
  field("tensor-layout", "数据类型与布局", "TENSOR LAYOUT", "理解 Shape、数据类型与布局约束", "content", "teal", 0, 0, [], "数据类型与布局", { topicId: "operator-topic", goalId: "operator-principles" }),
  field("hardware-mapping", "计算与硬件执行映射", "HARDWARE MAPPING", "从逻辑计算理解设备侧执行方式", "content", "violet", 0, 0, [], "计算与硬件执行映射", { topicId: "operator-topic", goalId: "operator-principles" }),
  field("operator-interface", "算子接口与输入输出", "OPERATOR INTERFACE", "定义参数、Shape、数据类型与输出约束", "content", "blue", 0, 0, [], "定义算子接口与输入输出", { topicId: "operator-topic", goalId: "operator-development" }),
  field("tiling-strategy", "Tiling 策略", "TILING STRATEGY", "依据数据规模与硬件资源组织计算分块", "content", "violet", 0, 0, [], "设计 Tiling 策略", { topicId: "operator-topic", goalId: "operator-development" }),
  field("kernel-implementation", "Kernel 实现", "KERNEL IMPLEMENTATION", "把计算逻辑映射为 Ascend C 实现", "content", "teal", 0, 0, [], "编写 Kernel 实现", { topicId: "operator-topic", goalId: "operator-development" }),
  field("compile-validation", "编译与正确性验证", "COMPILE AND VALIDATE", "检查构建结果、关键样例与精度表现", "content", "coral", 0, 0, [], "编译并验证正确性", { topicId: "operator-topic", goalId: "operator-development" }),
  field("kernel-optimization", "计算与访存优化", "KERNEL OPTIMIZATION", "结合执行特征改进计算和访存策略", "content", "teal", 0, 0, [], "优化计算与访存策略", { topicId: "operator-topic", goalId: "operator-optimization" }),
  field("operator-api-mapping", "算子接口映射", "OPERATOR API MAPPING", "梳理现有接口与昇腾实现间的映射", "content", "blue", 0, 0, [], "梳理算子接口与计算映射", { topicId: "operator-topic", goalId: "operator-porting" }),
  field("operator-data-adaptation", "数据类型与布局适配", "DATA TYPE ADAPTATION", "对齐目标实现中的数据约束", "content", "violet", 0, 0, [], "适配数据类型与布局", { topicId: "operator-topic", goalId: "operator-porting" }),
  field("operator-test-design", "算子测试样例", "OPERATOR TEST CASES", "覆盖常见 Shape、数据类型与输入范围", "content", "blue", 0, 0, [], "设计代表性测试样例", { topicId: "operator-topic", goalId: "operator-validation" }),
  field("precision-comparison", "精度与误差对比", "PRECISION COMPARISON", "核对输出结果与误差范围", "content", "violet", 0, 0, [], "对比输出与精度", { topicId: "operator-topic", goalId: "operator-validation" }),
  field("edge-case-validation", "边界输入验证", "EDGE CASE VALIDATION", "检查边界条件下的结果与稳定性", "content", "coral", 0, 0, [], "验证边界输入", { topicId: "operator-topic", goalId: "operator-validation" }),
  field("ascendc-programming-basics", "Ascend C 程序结构", "ASCEND C PROGRAM STRUCTURE", "认识算子程序的组成与基本执行流程", "content", "blue", 0, 0, [], "认识 Ascend C 编程模型", { topicId: "operator-topic", goalId: "operator-ascendc-model" }),
  field("ascendc-memory-model", "存储层级与数据搬运", "MEMORY HIERARCHY", "理解设备侧存储层级与数据流动方式", "content", "teal", 0, 0, [], "理解存储层级与数据搬运", { topicId: "operator-topic", goalId: "operator-ascendc-model" }),
  field("ascendc-execution-model", "并行执行与同步", "EXECUTION AND SYNCHRONIZATION", "了解计算任务的并行组织与同步关系", "content", "violet", 0, 0, [], "理解设备侧执行方式", { topicId: "operator-topic", goalId: "operator-ascendc-model" }),
  field("framework-op-interface", "框架算子接口", "FRAMEWORK OPERATOR API", "确认框架侧算子调用接口与数据约束", "content", "blue", 0, 0, [], "对齐框架算子接口", { topicId: "operator-topic", goalId: "operator-framework-integration" }),
  field("operator-registration", "算子注册与构建", "REGISTRATION AND BUILD", "将实现接入工程构建与算子注册流程", "content", "teal", 0, 0, [], "完成算子注册与构建", { topicId: "operator-topic", goalId: "operator-framework-integration" }),
  field("framework-call-validation", "框架侧调用验证", "FRAMEWORK CALL VALIDATION", "核对输入输出映射与运行结果", "content", "coral", 0, 0, [], "验证框架侧调用", { topicId: "operator-topic", goalId: "operator-framework-integration" }),

  field("model-format", "模型格式与算子支持", "MODEL FORMAT", "理解源模型结构及目标环境要求", "content", "violet", 0, 0, [], "确认模型格式与算子支持", { topicId: "inference-topic", goalId: "inference-conversion" }),
  field("conversion-config", "模型转换配置", "CONVERSION CONFIG", "选择转换参数并生成目标模型", "content", "blue", 0, 0, [], "配置模型转换", { topicId: "inference-topic", goalId: "inference-conversion" }),
  field("conversion-validation", "转换产物检查", "CONVERSION VALIDATION", "核对产物与后续运行条件", "content", "coral", 0, 0, [], "检查转换结果", { topicId: "inference-topic", goalId: "inference-conversion" }),
  field("input-preprocessing", "输入预处理", "INPUT PREPROCESSING", "整理颜色、归一化与维度顺序", "content", "teal", 0, 0, [], "整理输入预处理流程", { topicId: "inference-topic", goalId: "inference-input" }),
  field("input-shape", "输入 Shape", "INPUT SHAPE", "核对模型签名与实际输入维度", "content", "blue", 0, 0, [], "适配输入 Shape", { topicId: "inference-topic", goalId: "inference-input" }),
  field("input-dtype", "输入类型与布局", "INPUT TYPE AND LAYOUT", "让输入数据符合模型执行要求", "content", "violet", 0, 0, [], "匹配数据类型与布局", { topicId: "inference-topic", goalId: "inference-input" }),
  field("runtime-initialization", "推理运行环境", "INFERENCE RUNTIME", "连接模型、设备与必要的运行配置", "content", "blue", 0, 0, [], "准备推理运行环境", { topicId: "inference-topic", goalId: "inference-run" }),
  field("inference-execution", "端到端推理执行", "INFERENCE EXECUTION", "跑通输入到输出的完整调用流程", "content", "teal", 0, 0, [], "执行推理并获取结果", { topicId: "inference-topic", goalId: "inference-run" }),
  field("inference-validation", "推理精度与时延", "INFERENCE VALIDATION", "验证推理结果及端到端运行表现", "content", "coral", 0, 0, [], "核对精度与时延", { topicId: "inference-topic", goalId: "inference-run" }),

  field("training-data", "训练数据与输入流程", "TRAINING DATA PIPELINE", "让数据读取与预处理接入训练流程", "content", "teal", 0, 0, [], "组织训练数据与输入流程", { topicId: "training-topic", goalId: "training-flow" }),
  field("forward-backward", "前向与反向计算", "FORWARD AND BACKWARD", "连接模型计算图与梯度更新过程", "content", "blue", 0, 0, [], "串起前向与反向计算", { topicId: "training-topic", goalId: "training-flow" }),
  field("optimizer-schedule", "优化器与学习率计划", "OPTIMIZER SCHEDULE", "安排优化策略与训练阶段", "content", "violet", 0, 0, [], "配置优化器与学习率计划", { topicId: "training-topic", goalId: "training-flow" }),
  field("data-parallel", "数据并行", "DATA PARALLEL", "理解数据切分、梯度同步与全局 Batch", "content", "blue", 0, 0, [], "理解数据并行", { topicId: "training-topic", goalId: "parallel-strategy" }),
  field("tensor-parallel", "张量并行", "TENSOR PARALLEL", "理解模型计算切分与通信位置", "content", "violet", 0, 0, [], "探索张量并行", { topicId: "training-topic", goalId: "parallel-strategy" }),
  field("communication-pattern", "集合通信模式", "COLLECTIVE COMMUNICATION", "认识集合通信在训练过程中的作用", "content", "coral", 0, 0, [], "梳理通信模式", { topicId: "training-topic", goalId: "parallel-strategy" }),
  field("fp16-bf16", "FP16 与 BF16", "FP16 AND BF16", "了解精度格式与训练计算的适用条件", "content", "blue", 0, 0, [], "选择 FP16 或 BF16", { topicId: "training-topic", goalId: "mixed-precision" }),
  field("loss-scaling", "Loss Scaling", "LOSS SCALING", "认识数值范围管理与缩放策略", "content", "violet", 0, 0, [], "理解 Loss Scaling", { topicId: "training-topic", goalId: "mixed-precision" }),
  field("training-validation", "训练收敛与吞吐", "TRAINING VALIDATION", "对照损失、收敛与吞吐变化", "content", "coral", 0, 0, [], "验证精度与训练表现", { topicId: "training-topic", goalId: "mixed-precision" }),

  field("warmup-repeat", "预热与重复采样", "WARMUP AND REPEAT", "让性能采样具备可重复的运行条件", "content", "blue", 0, 0, [], "固定运行条件并预热", { topicId: "performance-topic", goalId: "performance-baseline" }),
  field("throughput-latency", "吞吐与时延", "THROUGHPUT AND LATENCY", "选择与当前学习目标相关的性能指标", "content", "violet", 0, 0, [], "记录吞吐与时延", { topicId: "performance-topic", goalId: "performance-baseline" }),
  field("comparison-validation", "基线对照", "BASELINE COMPARISON", "为后续优化保留可比较的参照", "content", "coral", 0, 0, [], "保留基线用于对照", { topicId: "performance-topic", goalId: "performance-baseline" }),
  field("operator-time-distribution", "算子耗时分布", "OPERATOR TIME DISTRIBUTION", "观察主要计算阶段及其时间占比", "content", "violet", 0, 0, [], "观察算子耗时分布", { topicId: "performance-topic", goalId: "profiler-analysis" }),
  field("device-utilization", "设备执行状态", "DEVICE EXECUTION", "理解计算单元利用与任务空隙", "content", "teal", 0, 0, [], "查看设备执行状态", { topicId: "performance-topic", goalId: "profiler-analysis" }),
  field("memory-access", "访存特征", "MEMORY ACCESS", "观察数据搬运与存储访问模式", "content", "blue", 0, 0, [], "分析访存特征", { topicId: "performance-topic", goalId: "profiler-analysis" }),
  field("data-pipeline", "数据供给效率", "DATA PIPELINE EFFICIENCY", "梳理预处理与设备执行的衔接", "content", "blue", 0, 0, [], "检查数据供给效率", { topicId: "performance-topic", goalId: "performance-improvement" }),
  field("performance-validation", "性能与精度验证", "PERFORMANCE VALIDATION", "比较性能变化并复核精度与稳定性", "content", "coral", 0, 0, [], "对照验证优化结果", { topicId: "performance-topic", goalId: "performance-improvement" }),
];

const fieldById = new Map(compositionFields.map((item) => [item.id, item]));

function unique(items) {
  return [...new Set(items)];
}

export function buildCompositionPrompt(selectedIds, connectionPath = []) {
  const orderedIds = unique([...connectionPath, ...selectedIds]);
  const fields = orderedIds.map((id) => fieldById.get(id)).filter(Boolean);
  if (!fields.length) return "";

  const topics = fields.filter((item) => item.role === "topic");
  const goals = fields.filter((item) => item.role === "goal");
  const content = fields.filter((item) => item.role === "content");
  const inferredTopicId = goals[0]?.topicId || content[0]?.topicId;
  const firstField = fields[0];
  const mainTopic = firstField?.role === "topic"
    ? firstField
    : fieldById.get(firstField?.topicId || inferredTopicId) || topics[0];
  const selectedSecondaryTopics = topics
    .filter((item) => item.id !== mainTopic?.id)
    .map((item) => item.promptValue);
  const subject = mainTopic?.promptValue || fields[0].promptValue;
  const sentences = [`我想围绕${subject}继续探索。`];

  if (goals.length) {
    sentences.push(`重点方向是${unique(goals.map((item) => item.promptValue)).join("、")}。`);
  }
  if (content.length) {
    sentences.push(`学习内容依次包括${unique(content.map((item) => item.promptValue)).join("、")}。`);
  } else if (goals.length) {
    sentences.push("请沿着相关原理与实践步骤，组织成循序渐进的学习路径。");
  } else {
    sentences.push("请从核心概念逐步延展到实践与验证。");
  }
  if (selectedSecondaryTopics.length) {
    sentences.push(`也希望了解它与${unique(selectedSecondaryTopics).join("、")}之间的关联。`);
  }
  return sentences.join("");
}

export function connectedCompositionIds(connections, manuallySelected = []) {
  return [...new Set([
    ...manuallySelected,
    ...connections.flatMap(({ from, to }) => [from, to]),
  ])];
}

export function orderedCompositionPath(connections) {
  if (!connections.length) return [];
  const path = [];
  for (const { from, to } of connections) {
    if (!path.length) path.push(from);
    if (path.at(-1) !== from) path.push(from);
    if (path.at(-1) !== to) path.push(to);
  }
  return path;
}
