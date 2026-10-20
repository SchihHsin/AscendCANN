const clean = (value) => String(value || "").trim();
const latestRecord = (task) => Array.isArray(task?.records) ? task.records.at(-1) : undefined;
const includesAny = (text, words) => words.some((word) => text.includes(word));

function recommendationFor(task, mode) {
  const name = clean(task.name);
  const records = Array.isArray(task.records) ? task.records : [];
  const lastRecord = latestRecord(task);
  const corpus = `${name} ${task.goal || ""} ${task.question || ""}`;
  let title = "梳理当前目标与已有线索";
  let reason = clean(task.goal || task.question) || "先明确目标与待核对条件。";
  let steps = [];
  let prompt = `围绕“${name}”，下一步先核对什么？`;
  let tone = task.kind === "learning" ? "rose" : "sand";

  if (name === "AddCustom 精度异常") {
    title = mode === "learning" ? "看懂尾块有效元素" : "核对尾块访问范围";
    reason = "[16,32] 通过、[17,33] 失败；尾块是待查线索，尚未确定根因。";
    steps = mode === "learning"
      ? ["看懂最后一块的有效元素数", "对照两种输入的差异"]
      : ["核对循环上限与有效元素数", "比较失败元素误差及运行条件"];
    prompt = mode === "learning"
      ? "能用这个任务说明尾块的有效元素数为什么值得核对吗？"
      : "请核对 AddCustom 最后一块的有效元素数与访问范围；[16,32] 通过、[17,33] 失败，根因尚未确定。";
    tone = "sand";
  } else if (name === "Add batch dimension") {
    title = "明确 batch 轴与形状约定";
    reason = "先确认 batch 轴、广播规则和输入输出形状，再列覆盖用例。";
    steps = ["明确 batch 维度位置与广播约定", "列出整块和非整块输入用例"];
    prompt = "Add 算子增加 batch dimension 时，batch 轴和广播约定应如何定义？请结合输入输出形状及整块、非整块用例说明。";
  } else if (task.kind === "learning" && mode === "learning") {
    const learningRecords = records.filter((record) => includesAny(String(record.kind || "").toLowerCase(), ["learning-path", "learning-attempt", "learning-check", "learning-summary", "learning_path", "learning_attempt", "learning_check", "learning_summary", "path", "attempt", "check", "summary", "learn"]));
    const recentLearningRecord = learningRecords.at(-1);
    const recentKind = String(recentLearningRecord?.kind || "").toLowerCase();
    const recentSummary = String(recentLearningRecord?.summary || "");
    const isSummary = includesAny(recentKind, ["summary"]) || includesAny(String(recentLearningRecord?.title || ""), ["小结", "总结", "学习记录"]);
    const isAttempt = includesAny(recentKind, ["attempt"]);
    const isCheck = includesAny(recentKind, ["check"]);
    const failed = includesAny(recentSummary, ["失败", "不符合", "未通过", "需调整"]);
    const passed = includesAny(recentSummary, ["通过", "符合", "成功"]);
    if (isSummary) {
      title = "把已学方法迁移到新例子";
      reason = "已有学习小结，可挑一个新例子检验理解。";
      steps = ["选择不同形状的输入", "说明如何应用已学方法"];
      prompt = `根据“${name}”的学习小结，换一个新例子练习迁移，可以吗？`;
    } else if ((isAttempt || isCheck) && failed) {
      title = "按失败记录调整练习";
      reason = "最近练习需要调整；先回看未通过的条件。";
      steps = ["查看记录中的失败条件", "调整一个参数后再核对"];
      prompt = "这条练习记录显示条件尚不符合。可以一起回看失败条件并调整练习吗？";
    } else if (isCheck && passed) {
      title = "保存本次学习小结";
      reason = "最近的输入检查已通过，可以整理本次理解与适用条件。";
      steps = ["记录本次核对的输入条件", "总结可迁移的方法"];
      prompt = "这次输入检查已通过。可以根据当前练习整理一份学习小结吗？";
    } else if (isAttempt && passed) {
      title = "核对本次输入";
      reason = "最近练习已通过，下一步可核对输入形状与约定。";
      steps = ["确认本次输入形状", "对照学习目标中的输入约定"];
      prompt = "这次练习已通过。可以继续核对本次输入是否符合目标约定吗？";
    } else if (includesAny(recentKind, ["path"])) {
      title = "从路径首个概念开始";
      reason = "学习路径已建立，可以从第一个概念逐步开始。";
      steps = ["打开路径中的首个概念", "用一个简单例子理解它"];
      prompt = `可以从“${name}”学习路径的第一个概念开始吗？`;
    } else if (recentLearningRecord) {
      title = `继续「${clean(recentLearningRecord.title) || "当前学习内容"}」`;
      reason = "从实际学习记录继续，选择一个尚待核对的概念。";
      steps = ["回看最近记录覆盖的内容", "挑一个概念用新例子解释"];
      prompt = `根据“${name}”最近的学习记录，下一步可以练习哪个概念？`;
    } else {
      title = "从学习目标整理第一步";
      reason = clean(task.learningProfile?.goal || task.goal) || "先根据学习目标确定起点。";
      steps = ["确认已有基础与目标", "列出一个入门步骤"];
      prompt = `根据“${name}”的学习目标，第一步适合从哪里开始？`;
    }
    tone = "rose";
  } else if (includesAny(corpus, ["图像", "HWC", "CHW", "NCHW"])) {
    title = mode === "learning" ? "理解 HWC、CHW 与 batch" : "核对 HWC → CHW → NCHW 与 batch";
    reason = "先对照当前布局和模型输入形状约定，再检查 batch 维度。";
    steps = ["确认当前布局与模型要求", "分别核对轴顺序和 batch 维度"];
    prompt = `“${name}”中的 HWC → CHW → NCHW 应如何对应模型输入约定？`;
    tone = "blue";
  } else {
    title = lastRecord?.title ? `接着核对「${clean(lastRecord.title)}」` : "先拆解目标与待确认条件";
    reason = [clean(lastRecord?.summary), clean(task.goal || task.question)].filter(Boolean).slice(0, 2).join("；") || "当前记录不多，可先补充目标与完成条件。";
    steps = lastRecord ? ["回看这条记录的结论与边界", "明确下一项需要的材料或检查"] : ["明确预期结果与适用环境", "列出当前缺少的输入或证据"];
    prompt = `继续“${name}”时，下一步应先核对什么？`;
  }

  return { taskName: name, project: clean(task.project), title, reason, steps: steps.slice(0, 2), ...(lastRecord ? { lastRecord } : {}), prompt, tone };
}

export function buildHomeSuggestions({ tasks = [], currentTaskName = "", mode = "learning" } = {}) {
  if (!Array.isArray(tasks)) return [];
  const unique = new Map();
  for (const task of tasks) {
    if (!task || !clean(task.name) || unique.has(task.name)) continue;
    unique.set(task.name, task);
  }
  const all = [...unique.values()];
  const scored = all.map((task, index) => {
    const corpus = `${task.name} ${task.goal || ""} ${task.question || ""}`;
    let score = task.name === currentTaskName && (mode !== "development" || task.kind !== "learning") ? 100 : 0;
    if (mode === "learning") {
      if (task.kind === "learning") score += 40;
      if (includesAny(corpus, ["学习", "图像", "HWC", "CHW", "NCHW"])) score += 18;
    } else {
      if (task.kind !== "learning") score += 25;
      if (includesAny(corpus, ["AddCustom", "Add batch dimension", "图像推理", "HWC", "NCHW"])) score += 30;
    }
    if (Array.isArray(task.records) && task.records.length) score += 4;
    return { task, index, score };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
  const colors = ["rose", "sand", "blue"];
  return scored.slice(0, 3).map(({ task }, index) => ({ ...recommendationFor(task, mode), tone: colors[index] }));
}
