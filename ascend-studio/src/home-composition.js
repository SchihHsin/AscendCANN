const field = (id, title, english, hint, role, tone, size, x, y, promptValue = title) => ({
  id, title, english, hint, role, tone, size, x, y, promptValue,
});

export const compositionFields = [
  field("data-loading", "数据加载", "DATA LOADING", "I/O 吞吐与瓶颈", "focus", "teal", "medium", 7.5, 14),
  field("cpu-preprocessing", "CPU 预处理", "CPU PREPROCESSING", "数据清洗与增强", "focus", "teal", "small", 29, 15),
  field("samples", "samples/s", "SAMPLES PER SECOND", "训练吞吐指标", "metric", "violet", "medium", 51, 13),
  field("device-utilization", "设备利用率", "DEVICE UTILIZATION", "计算资源利用率", "metric", "teal", "small", 73, 14),
  field("hbm", "HBM 占用", "HBM USAGE", "显存占用与峰值", "metric", "blue", "medium", 92, 14),

  field("single-card", "单卡基线", "SINGLE CARD BASELINE", "单卡性能参考", "verification", "blue", "medium", 8, 25),
  field("gradient-sync", "梯度同步", "GRADIENT SYNCHRONIZATION", "同步策略与开销", "focus", "coral", "medium", 87, 24),
  field("training-goal", "提升训练吞吐", "TRAINING GOAL", "提高 samples/s，降低总训练时长", "goal", "blue", "large", 31, 27),
  field("multi-gpu-efficiency", "多卡扩展效率", "MULTI-GPU SCALING", "随卡数增长的加速比", "issue", "coral", "large", 65, 29),

  field("step-time", "每步耗时", "STEP TIME", "单步训练时间", "metric", "blue", "medium", 8, 45),
  field("multi-card-gains", "多卡收益不明显", "LIMITED MULTI-GPU GAINS", "增加卡数后，吞吐提升没有达到预期", "issue", "violet", "large", 49, 47),
  field("hccl", "HCCL 通信", "HCCL COMMUNICATION", "集群通信性能", "focus", "blue", "large", 88, 44),
  field("communication-wait", "通信等待", "COMMUNICATION WAIT", "等待时间占比", "focus", "blue", "medium", 91, 62),

  field("mixed-precision", "混合精度", "MIXED PRECISION", "FP16 / BF16 训练", "strategy", "teal", "medium", 9, 63),
  field("loss-scale", "loss scale", "LOSS SCALE", "动态 / 静态缩放", "strategy", "blue", "medium", 27, 64),
  field("effective-batch", "有效 batch", "EFFECTIVE BATCH SIZE", "单卡实际 batch 大小", "context", "teal", "medium", 45, 65),
  field("global-batch", "global batch", "GLOBAL BATCH SIZE", "全局 batch 大小", "context", "blue", "medium", 68, 65),
  field("precision", "保持精度", "ACCURACY CONSTRAINT", "加速同时，模型精度不下降", "constraint", "teal", "medium", 36, 78),

  field("convergence", "收敛稳定性", "CONVERGENCE STABILITY", "训练是否稳定收敛", "focus", "violet", "medium", 10, 82),
  field("checkpoint", "checkpoint 频率", "CHECKPOINT FREQUENCY", "保存间隔与开销", "focus", "blue", "small", 31, 89),
  field("profiler", "profiler 时间线", "PROFILER TIMELINE", "性能分析与定位", "focus", "violet", "medium", 53, 84),
  field("operator-bottleneck", "算子瓶颈", "OPERATOR BOTTLENECK", "关键算子与耗时", "focus", "teal", "medium", 75, 82),
  field("training-duration", "训练时长", "TRAINING DURATION", "总时间与阶段耗时", "metric", "blue", "medium", 91, 84),

  field("data-parallel", "数据并行", "DATA PARALLELISM", "DP 策略与扩展", "strategy", "blue", "small", 16, 95),
  field("model-parallel", "模型并行", "MODEL PARALLELISM", "张量 / 流水并行", "strategy", "violet", "small", 44, 95),
  field("framework", "训练框架", "TRAINING FRAMEWORK", "框架选型与特性", "context", "teal", "small", 63, 95),
  field("ab-experiment", "对照实验", "A/B CONTRAST EXPERIMENT", "不同配置对比分析", "verification", "coral", "medium", 84, 95),
];

export function buildCompositionPrompt(selectedIds) {
  if (selectedIds.length === 0) return "";

  const selected = new Set(selectedIds);
  const valuesFor = (role) => compositionFields
    .filter((item) => selected.has(item.id) && item.role === role)
    .map((item) => item.promptValue);
  const goal = valuesFor("goal")[0] || "提升训练效率";
  const issues = valuesFor("issue");
  const contexts = valuesFor("context");
  const constraints = valuesFor("constraint");
  const focus = valuesFor("focus");
  const strategies = valuesFor("strategy");
  const metrics = valuesFor("metric");
  const verification = valuesFor("verification");

  const sentences = [`我想在昇腾上${goal}。`];
  if (issues.length) sentences.push(`当前现象：${issues.join("、")}。`);
  if (contexts.length) sentences.push(`训练条件包括${contexts.join("、")}。`);
  if (constraints.length) sentences.push(`需要满足${constraints.join("、")}。`);
  const diagnostics = [...focus, ...strategies];
  if (diagnostics.length) sentences.push(`请重点分析${diagnostics.join("、")}。`);
  if (metrics.length) sentences.push(`以${metrics.join("、")}衡量结果。`);
  if (verification.length) sentences.push(`并通过${verification.join("、")}进行对照验证。`);
  return sentences.join("");
}

export function connectedCompositionIds(connections, manuallySelected = []) {
  return [...new Set([
    ...manuallySelected,
    ...connections.flatMap(({ from, to }) => [from, to]),
  ])];
}
