const field = (id, title, english, hint, role, tone, x, y, related = [], promptValue = title) => ({
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
  size: related.length >= 4 ? "large" : related.length ? "medium" : "small",
});

export const initialCompositionIds = [
  "training-goal",
  "multi-card-gains",
  "samples",
  "device-utilization",
  "data-loading",
  "communication-wait",
  "mixed-precision",
  "model-parallel",
  "precision",
  "profiler",
  "ab-experiment",
  "training-duration",
];

export const compositionFields = [
  // First view: a balanced set of goals, symptoms, signals, strategies and checks.
  field("training-goal", "提升训练吞吐", "TRAINING GOAL", "提高 samples/s，缩短训练时间", "goal", "blue", 50, 13, ["samples", "training-duration", "multi-card-gains", "precision", "ab-experiment"]),
  field("multi-card-gains", "多卡收益不明显", "LIMITED MULTI-GPU GAINS", "增加卡数后，吞吐提升没有达到预期", "issue", "coral", 22, 34, ["multi-gpu-efficiency", "device-utilization", "communication-wait", "gradient-sync"]),
  field("samples", "samples/s", "SAMPLES PER SECOND", "训练吞吐指标", "metric", "violet", 49, 34, ["data-loading", "step-time", "training-duration", "profiler"]),
  field("device-utilization", "设备利用率", "DEVICE UTILIZATION", "计算资源利用率", "metric", "teal", 77, 34, ["profiler", "operator-bottleneck", "hbm"]),
  field("data-loading", "数据加载", "DATA LOADING", "I/O 吞吐与瓶颈", "focus", "teal", 16, 56, ["cpu-preprocessing", "step-time", "checkpoint"]),
  field("communication-wait", "通信等待", "COMMUNICATION WAIT", "等待时间占比", "focus", "blue", 39, 56, ["hccl", "gradient-sync", "multi-gpu-efficiency"]),
  field("mixed-precision", "混合精度", "MIXED PRECISION", "FP16 / BF16 训练", "strategy", "teal", 63, 56, ["loss-scale", "precision", "convergence"]),
  field("model-parallel", "模型并行", "MODEL PARALLELISM", "张量并行与流水并行", "strategy", "violet", 85, 56, ["data-parallel", "effective-batch", "global-batch", "training-framework"]),
  field("precision", "保持精度", "ACCURACY CONSTRAINT", "加速同时，模型精度不下降", "constraint", "teal", 22, 79, ["convergence", "mixed-precision", "ab-experiment"]),
  field("profiler", "Profiler 时间线", "PROFILER TIMELINE", "性能分析与定位", "focus", "violet", 49, 79, ["operator-bottleneck", "training-duration", "hbm"]),
  field("ab-experiment", "对照实验", "A/B CONTRAST EXPERIMENT", "比较不同训练配置", "verification", "coral", 77, 79, ["single-card", "training-duration", "precision"]),
  field("training-duration", "训练时长", "TRAINING DURATION", "总时间与阶段耗时", "metric", "blue", 91, 13, ["checkpoint", "step-time", "profiler"]),

  // Deeper clues appear only around the field the user is exploring.
  field("multi-gpu-efficiency", "多卡扩展效率", "MULTI-GPU SCALING", "随卡数增长的加速比", "issue", "coral", 68, 17, ["hccl", "gradient-sync", "single-card"]),
  field("gradient-sync", "梯度同步", "GRADIENT SYNCHRONIZATION", "同步策略与开销", "focus", "coral", 32, 23, ["hccl", "multi-gpu-efficiency", "data-parallel"]),
  field("hccl", "HCCL 通信", "HCCL COMMUNICATION", "集群通信性能", "focus", "blue", 91, 48, ["communication-wait", "gradient-sync", "multi-gpu-efficiency"]),
  field("step-time", "每步耗时", "STEP TIME", "单步训练时间", "metric", "blue", 9, 68, ["data-loading", "operator-bottleneck", "training-duration"]),
  field("cpu-preprocessing", "CPU 预处理", "CPU PREPROCESSING", "数据清洗与增强", "focus", "teal", 7, 25, ["data-loading", "samples", "checkpoint"]),
  field("loss-scale", "loss scale", "LOSS SCALE", "动态 / 静态缩放", "strategy", "blue", 40, 19, ["mixed-precision", "convergence", "precision"]),
  field("single-card", "单卡基线", "SINGLE CARD BASELINE", "单卡性能参考", "verification", "blue", 8, 43),
  field("data-parallel", "数据并行", "DATA PARALLELISM", "DP 策略与扩展", "strategy", "blue", 15, 91, ["global-batch", "multi-gpu-efficiency", "effective-batch"]),
  field("effective-batch", "有效 batch", "EFFECTIVE BATCH SIZE", "单卡实际 batch 大小", "context", "teal", 43, 91, ["global-batch", "convergence", "precision"]),
  field("global-batch", "global batch", "GLOBAL BATCH SIZE", "全局 batch 大小", "context", "blue", 65, 91, ["effective-batch", "data-parallel", "convergence"]),
  field("convergence", "收敛稳定性", "CONVERGENCE STABILITY", "训练是否稳定收敛", "constraint", "violet", 8, 88),
  field("checkpoint", "checkpoint 频率", "CHECKPOINT FREQUENCY", "保存间隔与开销", "focus", "blue", 30, 91),
  field("operator-bottleneck", "算子瓶颈", "OPERATOR BOTTLENECK", "关键算子与耗时", "focus", "teal", 76, 91, ["profiler", "step-time", "device-utilization"]),
  field("hbm", "HBM 占用", "HBM USAGE", "显存占用与峰值", "metric", "blue", 92, 72),
  field("training-framework", "训练框架", "TRAINING FRAMEWORK", "框架选型与特性", "context", "teal", 62, 22, ["model-parallel", "mixed-precision", "data-parallel"]),
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
