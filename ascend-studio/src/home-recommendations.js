const MODES = new Set(["learning", "development"]);
const clean = value => String(value ?? "").trim();
const object = value => value && typeof value === "object" && !Array.isArray(value);
const arr = value => Array.isArray(value) ? value : [];
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (object(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
};
const signature = value => {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(36);
};
const evidence = (id, title, summary, time) => ({ id, title, summary, ...(time ? { time } : {}) });

function candidate({ task, mode, type, title, reason, evidence: facts, steps, action, actionLabel, prompt, activity: explicitActivity, tone = mode === "learning" ? "rose" : "sand", priority = 0, deps }) {
  const taskName = clean(task.name);
  const activity = explicitActivity || facts.find(fact => fact?.activity)?.activity || `依据现存目标「${clean(task.goal || task.learningProfile?.goal || task.name)}」；近期操作、完成与验证状态未记录。`;
  return {
    id: `${mode}:${signature([taskName, type])}`,
    revision: signature(deps ?? facts), mode, type, taskName, project: clean(task.project), title, reason, activity,
    evidence: facts, steps, action, actionLabel, prompt, tone, priority,
  };
}

function learningSuggestions(task) {
  const name = clean(task.name);
  const state = object(task.learningState) ? task.learningState : {};
  const records = arr(task.records);
  const byData = records.filter(record => object(record?.data));
  const out = [];
  const path = arr(state.path);
  const goal = clean(state.profile?.goal || task.learningProfile?.goal || task.goal);
  const profileCurrent = !state.pathProfile || !state.profile || stable(state.pathProfile) === stable(state.profile);
  const pathCurrent = path.length > 0 && profileCurrent;
  const attempts = arr(state.attempts);
  const currentSnapshot = { axes: state.axes, batch: state.batch };
  const understood = arr(state.understood).includes("channels");
  const currentAttempt = attempts.findLast(attempt => stable(attempt.snapshot) === stable(currentSnapshot) && stable(attempt.profile || state.profile) === stable(state.profile) && stable(attempt.path || path) === stable(path));
  const currentCheck = arr(state.checks).findLast(check => check.attemptId === currentAttempt?.id && stable(check.snapshot) === stable(currentSnapshot));
  const currentSummary = arr(state.summaries).findLast(summary => summary.attemptId === currentAttempt?.id && summary.checkId === currentCheck?.id && stable(summary.snapshot) === stable(currentSnapshot) && stable(summary.path) === stable(path) && stable(summary.profile) === stable(state.profile));
  const latestRecord = (kind, predicate = () => true) => byData.findLast(record => record.kind === kind && predicate(record.data));
  const goalFact = goal ? evidence("learning-goal", "学习目标", goal) : null;

  if (!pathCurrent && goal) {
    const facts = [goalFact, ...records.filter(record => record.kind === "learning-path" && object(record.data)).slice(-1).map(record => evidence(record.id, record.title, record.summary, record.time))].filter(Boolean);
    const activity = facts.length > 1 ? `已设定目标「${goal}」；已有路径与当前目标/画像不匹配` : `已设定目标「${goal}」；尚无匹配的已确认路径`;
    out.push(candidate({ task, mode: "learning", type: "learning-path", title: "按当前目标建立学习路径", reason: "目标已明确，尚无匹配的已确认学习路径。", activity, evidence: facts, steps: ["确认目标与已有基础", "预览并确认学习路径"], action: { type: "learning-path", materialId: "learning-path", preparePath: true }, actionLabel: "准备学习路径", prompt: `请围绕“${goal}”整理一条学习路径，并先让我预览后再确认。`, priority: 95, deps: [goal, state.path, state.profile, state.pathProfile] }));
    return out;
  }
  if (!pathCurrent) return out;

  const matchingAttempts = attempts.filter(attempt => stable(attempt.profile || state.profile) === stable(state.profile) && stable(attempt.path || path) === stable(path));
  const latestAttempt = matchingAttempts.findLast(attempt => stable(attempt.snapshot) === stable(currentSnapshot));
  const latestCheck = arr(state.checks).findLast(check => check.attemptId === latestAttempt?.id && stable(check.snapshot) === stable(latestAttempt?.snapshot));
  const failedAt = matchingAttempts.reduce((last, attempt, index) => attempt.passed ? last : index, -1);
  const succeededAfterFailure = failedAt >= 0 && matchingAttempts.slice(failedAt + 1).some(attempt => attempt.passed && stable(attempt.snapshot) === stable(matchingAttempts[failedAt].snapshot));
  const attemptRecord = latestRecord("learning-attempt", data => data.id === latestAttempt?.id);
  if (latestAttempt && !latestAttempt.passed) {
    const failedAttempt = [...matchingAttempts].reverse().find(attempt => !attempt.passed);
    const failedIndex = matchingAttempts.indexOf(failedAttempt);
    const laterPassed = matchingAttempts.some((attempt, index) => index > failedIndex && attempt.passed && stable(attempt.snapshot) === stable(failedAttempt.snapshot));
    if (!laterPassed && failedAttempt === latestAttempt) {
      const facts = [evidence(attemptRecord?.id || latestAttempt.id, "学习跟练尝试", `${latestAttempt.valid ? `当前示例形状 [${arr(latestAttempt.dimensions).join(",")}]` : "轴顺序无效"}，尚未符合目标示例约定。`, attemptRecord?.time || latestAttempt.time), goalFact].filter(Boolean);
      facts[0].activity = `最近跟练未通过：${latestAttempt.valid ? `形状 [${arr(latestAttempt.dimensions).join(",")}]` : "轴顺序无效"}`;
      out.push(candidate({ task, mode: "learning", type: "learning-practice", title: "修正当前维度转换练习", reason: "当前参数下的跟练未通过，需调整轴顺序或 batch。", evidence: facts, steps: ["查看失败尝试的轴顺序与 batch", "调整参数后重新检查示例形状"], action: { type: "learning-practice", materialId: "learning-practice", sourceSummaryId: currentSummary?.id }, actionLabel: "回到练习", prompt: "请根据这次失败尝试的结构化输入，解释需要调整的轴顺序或 batch；只讨论当前形状示例，不推断真实推理结果。", priority: 100, deps: [latestAttempt.id, latestAttempt.snapshot, latestAttempt.passed, matchingAttempts.map(item => [item.id, item.snapshot, item.passed])] }));
    }
  } else if (!understood && !out.some(item => item.type === "learning-practice")) {
    const facts = [goalFact, evidence("learning-path", "已确认学习路径", `目标「${goal}」的学习路径已确认，前置理解节点尚未记录完成。`)].filter(Boolean);
    facts[1].activity = "已确认学习路径；前置理解节点尚无完成记录";
    out.push(candidate({ task, mode: "learning", type: "learning-lesson", title: "先理解图像通道与输入维度", reason: "已确认路径要求先理解维度；当前任务尚无该理解节点的完成记录。", evidence: facts, steps: ["查看 RGB、HWC 与 CHW 的讲解", "理解 batch 维度的作用"], action: { type: "learning-lesson", materialId: "learning-lesson" }, actionLabel: "打开前置讲解", prompt: `请按“${goal}”的目标讲解当前路径中的图像通道与输入维度，并说明练习前需要理解什么。`, priority: 90, deps: [path, state.understood, state.profile] }));
  }

  const transfer = object(state.transfer) ? state.transfer : {};
  const latestTransfer = arr(transfer.attempts).findLast(attempt => attempt.sourceSummaryId === currentSummary?.id);
  const transferSourceSignature = currentSummary && JSON.stringify({ attemptId: currentSummary.attemptId, checkId: currentSummary.checkId, profile: currentSummary.profile, path: currentSummary.path, dimensions: currentSummary.dimensions });
  const transferSourceCurrent = Boolean(currentSummary
    && transfer.sourceSummaryId === currentSummary.id
    && transfer.sourceSignature === transferSourceSignature);
  const transferDone = Boolean(transferSourceCurrent
    && latestTransfer?.sourceSummaryId === currentSummary.id
    && latestTransfer.passed === true
    && stable(latestTransfer.snapshot) === stable(transfer.snapshot));
  if (currentSummary && currentSummary.attemptId === latestAttempt?.id && latestCheck?.passed && !transferDone && !out.some(item => item.type === "learning-practice")) {
    const record = latestRecord("learning-summary", data => data.id === currentSummary.id);
    const facts = [evidence(record?.id || currentSummary.id, "当前学习小结", `${goal}；小结关联当前路径、通过的跟练与输入检查。`, record?.time || currentSummary.time)];
    facts[0].activity = "已保存学习小结；关联跟练与输入检查均通过";
    out.push(candidate({ task, mode: "learning", type: "learning-transfer", title: "用新输入检验已学方法", reason: "当前目标、跟练和输入检查对应的学习小结仍有效，可用不同输入检验迁移。", evidence: facts, steps: ["选择不同于当前快照的图像形状", "解释轴顺序与 batch 如何变化"], action: { type: "learning-transfer", materialId: "learning-summary", sourceSummaryId: currentSummary.id }, actionLabel: "开始迁移练习", prompt: `以“${goal}”为目标，用一组不同输入形状建立隔离的迁移练习；保留原学习状态，不声称真实 Python 或 NPU 验证。`, priority: 75, deps: [currentSummary, currentSnapshot, currentCheck] }));
  } else if (latestAttempt?.passed && latestCheck?.passed && !currentSummary && understood) {
    const record = latestRecord("learning-check", data => data.id === latestCheck.id);
      const facts = [evidence(record?.id || latestCheck.id, "已通过的输入检查", `关联当前跟练快照 [${arr(latestCheck.dimensions || latestAttempt.dimensions).join(",")}]; 真实模型推理尚未运行。`, record?.time || latestCheck.time), goalFact].filter(Boolean);
      facts[0].activity = `最近输入检查已通过：形状 [${arr(latestCheck.dimensions || latestAttempt.dimensions).join(",")}]`;
      out.push(candidate({ task, mode: "learning", type: "learning-summary", title: "保存本次学习小结", reason: "当前目标、跟练与输入检查已关联通过；学习记录尚未保存。", evidence: facts, steps: ["保存当前目标、路径与检查快照", "之后可从首页继续迁移练习"], action: { type: "learning-summary", materialId: "learning-summary" }, actionLabel: "保存学习小结", prompt: `请基于“${goal}”的当前路径、跟练与输入检查整理学习小结，并保留仅完成浏览器形状核对的边界。`, priority: 80, deps: [latestAttempt.id, latestCheck.id, state.path, state.profile, state.understood] }));
  } else if (latestAttempt?.passed && !latestCheck?.passed && !succeededAfterFailure) {
    const record = latestRecord("learning-attempt", data => data.id === latestAttempt.id);
    const facts = [evidence(record?.id || latestAttempt.id, "通过的跟练快照", `形状 [${arr(latestAttempt.dimensions).join(",")}]；仅浏览器形状演算。`, record?.time || latestAttempt.time)];
    facts[0].activity = `最近跟练已通过，尚未关联输入检查：形状 [${arr(latestAttempt.dimensions).join(",")}]`;
    out.push(candidate({ task, mode: "learning", type: "learning-practice", title: "核对本次通过练习的输入", reason: "当前跟练快照符合示例约定，但还没有与这次尝试关联的输入检查。", evidence: facts, steps: ["复核本次尝试的形状快照", "保存对应输入检查"], action: { type: "learning-practice", materialId: "learning-check", sourceSummaryId: latestAttempt.id }, actionLabel: "核对输入", prompt: "请围绕当前通过的形状快照完成输入约定核对，并保留它对应的尝试条件。", priority: 70, deps: [latestAttempt.id, latestAttempt.snapshot, latestCheck] }));
  }
  return out;
}

function developmentSuggestions(task) {
  const name = clean(task.name);
  const flow = object(task.flowState) ? task.flowState : {};
  const records = arr(task.records);
  const out = [];
  if (name === "AddCustom 精度异常") {
    const snapshot = { rows: "17", columns: "33", tileSize: "32", bounds: "full" };
    const sameConditionSuccess = arr(flow.attempts).some(item => item.passed === true && item.snapshot && Object.keys(snapshot).every(key => String(item.snapshot[key]) === snapshot[key]));
    const failed = arr(flow.attempts).findLast(item => item.snapshot && Object.keys(snapshot).every(key => String(item.snapshot[key]) === snapshot[key]) && item.passed === false);
    if (!sameConditionSuccess) {
      const recentTrials = arr(flow.attempts).filter(item => item.snapshot && Object.keys(snapshot).every(key => String(item.snapshot[key]) === snapshot[key]));
      const latestTrial = recentTrials.at(-1);
      const facts = [evidence(latestTrial?.id || "addcustom-demo-background", latestTrial ? "最近 AddCustom 示例尝试" : "AddCustom 演示背景", latestTrial ? `输入 [${latestTrial.snapshot.rows},${latestTrial.snapshot.columns}]；${latestTrial.passed === true ? "示例检查通过" : latestTrial.passed === false ? "示例检查未通过" : "尚无通过/失败结论"}，不代表实际工程运行。` : "固定演示背景：[16,32]通过、[17,33]失败；属于预置演示线索，不是用户近期操作或实际运行。", latestTrial?.time), ...records.filter(record => ["precision-snapshot", "trial", "validation-snapshot"].includes(record.kind) && object(record.data)).slice(-2).map(record => evidence(record.id, record.title, record.summary, record.time))];
      const activity = latestTrial ? `最近示例尝试 [${latestTrial.snapshot.rows},${latestTrial.snapshot.columns}]：${latestTrial.passed === true ? "通过" : latestTrial.passed === false ? "未通过" : "结果未记录"}（非实际工程运行）` : "演示依据：预置 [16,32]/[17,33] 对照；没有记录用户近期尝试";
      out.push(candidate({ task, mode: "development", type: "development-troubleshoot", title: "对照 [17,33] 算例检查尾块访问", reason: "演示中[16,32]过、[17,33]败；尾块待查，根因未定。", activity, evidence: facts, steps: ["对照实际循环上限和有效元素数", "记录真实运行条件与逐元素误差"], action: { type: "development-material", materialId: "source", anchor: "loop-bound" }, actionLabel: "打开代码核对", prompt: "请把当前浏览器算例中的范围线索作为待核对假设，先对照真实工程循环和有效元素数；不要把演示结果当真实运行或已定位根因。", priority: 100, deps: [snapshot, latestTrial, records.filter(record => ["precision-snapshot", "trial", "validation-snapshot"].includes(record.kind)).map(record => record.data)] }));
    }
    const currentCode = clean(flow.appliedCode || flow.draftCode || "");
    const hasApplied = Boolean(flow.appliedCode);
    const appliedAttempt = flow.appliedAttempt || arr(flow.attempts).findLast(item => item.id === flow.appliedAttemptId);
    const applicableAttempt = hasApplied && appliedAttempt?.code === currentCode ? appliedAttempt : (!hasApplied ? arr(flow.attempts).findLast(item => item.code === currentCode && item.snapshot) : null);
    const validationData = flow.validation || records.findLast(record => record.kind === "validation-snapshot")?.data;
    const currentValidation = validationData && validationData.code === currentCode && validationData.attemptId === applicableAttempt?.id ? validationData : null;
    if (applicableAttempt && !currentValidation) {
      const rec = records.findLast(record => record.kind === "validation-snapshot" && record.data?.attemptId === applicableAttempt.id && record.data?.code === currentCode);
      if (!rec) out.push(candidate({ task, mode: "development", type: "development-validation", title: "为当前示例版本补做范围复核", reason: "当前算例代码尚无匹配复核，仍属本地演示。", activity: `最近已生成当前代码的参数快照，尚无匹配复核：输入 [${applicableAttempt.snapshot.rows},${applicableAttempt.snapshot.columns}]、块大小 ${applicableAttempt.snapshot.tileSize}`, evidence: [evidence(applicableAttempt.id, "当前代码对应的示例快照", `输入 [${applicableAttempt.snapshot.rows},${applicableAttempt.snapshot.columns}]、块大小 ${applicableAttempt.snapshot.tileSize}；仅为演示算例。`, applicableAttempt.time)], steps: ["确认复核代码与尝试快照一致", "记录范围检查结果及适用边界"], action: { type: "development-material", materialId: hasApplied ? "validation" : "parameters" }, actionLabel: hasApplied ? "打开范围复核" : "检查范围参数", prompt: "请为当前示例代码和对应参数快照补做范围复核，并明确它只是浏览器演算，不是编译、真实运行或 NPU 验证。", priority: 85, deps: [currentCode, applicableAttempt.id, applicableAttempt.snapshot, currentValidation] }));
    }
    const latestSnapshot = appliedAttempt?.snapshot || arr(flow.attempts).at(-1)?.snapshot;
    const currentConditions = { rows: String(flow.rows ?? ""), columns: String(flow.columns ?? ""), tileSize: String(flow.tileSize ?? ""), bounds: flow.bounds };
    const conditionsChanged = latestSnapshot && Object.keys(currentConditions).every(key => currentConditions[key] !== "") && Object.keys(currentConditions).some(key => String(latestSnapshot[key]) !== String(currentConditions[key]));
    const currentAttemptForConditions = arr(flow.attempts).findLast(item => item.code === currentCode && item.snapshot && Object.keys(currentConditions).every(key => String(item.snapshot[key]) === String(currentConditions[key])));
    const matchingValidation = validationData && validationData.code === currentCode && validationData.attemptId === currentAttemptForConditions?.id;
    const latestAttempt = arr(flow.attempts).at(-1);
    const codeChanged = Boolean(latestSnapshot && currentCode && latestAttempt?.code && latestAttempt.code !== currentCode);
    const snapshotChanged = Boolean(latestSnapshot && conditionsChanged);
    const matchingCurrentValidation = validationData && validationData.code === currentCode && validationData.attemptId === currentAttemptForConditions?.id;
    if ((codeChanged || snapshotChanged) && !matchingCurrentValidation && latestSnapshot) out.push(candidate({ task, mode: "development", type: "development-change-review", title: "复核变更后的示例范围", reason: "代码或输入已变更，旧快照不适用于当前算例。", activity: codeChanged ? "最近代码草案与既有尝试代码不同；旧范围快照不再匹配" : "最近参数已变更；旧范围快照不再匹配当前输入", evidence: [evidence("addcustom-current-snapshot", "当前与既有示例快照", `当前输入 [${currentConditions.rows},${currentConditions.columns}]、块大小 ${currentConditions.tileSize}；旧快照 ${JSON.stringify(latestSnapshot)}。`, validationData?.time)], steps: ["按当前代码与参数重新生成范围尝试", "检查新快照及适用边界"], action: { type: "development-material", materialId: hasApplied ? "draft" : "parameters" }, actionLabel: hasApplied ? "查看当前草案" : "检查范围参数", prompt: "请针对当前示例代码和输入重新建立范围快照；旧快照在代码或条件变化后不适用。本操作仍为浏览器演算。", priority: 65, deps: [currentCode, currentConditions, latestSnapshot, validationData, currentAttemptForConditions] }));
  }
  const imageState = object(task.imageState) ? task.imageState : null;
  if (imageState && name === "图像推理调试") {
    const latest = arr(imageState.attempts).at(-1);
    const currentSnapshot = { axes: imageState.axes, batch: imageState.batch };
    const same = latest?.snapshot && stable(latest.snapshot) === stable(currentSnapshot);
    const validation = imageState.validation && stable(imageState.validation.snapshot) === stable(currentSnapshot) && imageState.validation.attemptId === latest?.id ? imageState.validation : null;
    if (latest && same && !validation) out.push(candidate({ task, mode: "development", type: "development-validation", title: "核对当前图像形状快照", reason: "当前形状尝试尚无关联复核，模型推理仍待验证。", activity: `最近已尝试图像形状：轴顺序 ${arr(latest.snapshot.axes).join(",")}，batch ${latest.snapshot.batch ? "开启" : "关闭"}；尚无关联复核`, evidence: [evidence(latest.id, "图像形状尝试", `轴顺序 ${arr(latest.snapshot.axes).join(",")}，batch ${latest.snapshot.batch ? "开启" : "关闭"}；仅浏览器形状演算。`, latest.time)], steps: ["按当前尝试复核输出维度", "对照真实模型签名与预处理要求"], action: { type: "development-material", materialId: imageState.applied ? "image-validation" : "image-practice" }, actionLabel: imageState.applied ? "打开形状复核" : "返回维度练习", prompt: "请依据当前图像尝试快照核对输出形状，同时说明模型文件、数据预处理和设备推理还需独立验证。", tone: "blue", priority: 85, deps: [currentSnapshot, latest.id, latest.snapshot, validation, imageState.applied] }));
  }
  return out;
}

function demoSuggestions(task, mode) {
  const goal = clean(task.goal || task.learningProfile?.goal || task.name);
  const context = [
    evidence("demo-task-goal", "现存任务目标", goal),
    evidence("demo-candidate", "演示场景候选", "由现存任务目标拆分的可继续探索入口；没有完成、失败次数、运行日志或硬件验证记录。"),
  ];
  const choices = mode === "learning"
    ? [
      { type: "demo-learning-new-task", title: "开启一项新的图像推理学习任务", label: "新建学习任务", step: "从已有的输入预处理目标延伸到完整推理链路", reason: "演示建议：可以沿着现有学习目标，另开一项更完整的图像推理学习任务。", priority: 2, action: { type: "task-create", groupId: "inference", kind: "learning", name: "图像推理入门学习", goal: `从“${goal}”延伸，了解图像分类推理的环境准备、输入处理、执行流程与结果解读。` } },
      { type: "demo-learning-lesson", title: "从目标中挑一个概念先理解", materialId: "learning-lesson", label: "打开概念讲解", step: "对照任务目标阅读相关概念", prompt: `请根据“${goal}”指出一个适合作为起点的概念，并说明后续如何练习。` },
      { type: "demo-learning-diagram", title: "先看通道与维度图解", materialId: "learning-lesson", label: "打开图解", step: "用图解对照图像通道、HWC 与 CHW 的关系", prompt: `请结合“${goal}”解释图像通道、HWC 与 CHW 的关系，并指出后续练习要观察什么。` },
    ]
    : [
      { type: "demo-development-new-task", title: "从当前问题新建一项开发任务", label: "新建开发任务", step: "把现有目标拆成独立的实现与验证任务", reason: "演示建议：可将当前目标整理成一项边界清晰、便于持续跟进的开发任务。", priority: 2, action: { type: "task-create", groupId: task.project === "模型推理" ? "inference" : "operator", kind: "development", name: task.project === "模型推理" ? "图像分类应用开发" : "算子验证设计", goal: `基于“${goal}”建立独立开发任务，整理实现范围、输入条件和验证计划；尚不表示已执行。` } },
      { type: "demo-development-context", title: "整理目标与待补充条件", materialId: task.name === "AddCustom 精度异常" ? "source" : task.name === "图像推理调试" ? "image-source" : "task-brief", label: "进入任务上下文", step: "对照目标标出当前已有和待补充的信息", prompt: `请围绕“${goal}”整理已知条件和仍需补充的信息，不假设任务已经执行。` },
      { type: "demo-development-preflight", title: "先补齐验证所需条件", materialId: "task-brief", label: "查看任务简报", step: "列出版本、硬件和输入条件等验证前提", prompt: `请围绕“${goal}”整理验证前需要补齐的版本、硬件和输入条件；不要推断这些条件已经满足。` },
    ];
  return choices.map((choice, index) => candidate({
    task, mode, type: choice.type, title: choice.title,
    reason: choice.reason || "演示建议：可从现存目标继续拆解下一步。", evidence: context,
    activity: `依据现存目标「${goal}」；近期操作、完成与验证状态未记录。`,
    steps: [choice.step], action: choice.action || { type: mode === "learning" ? choice.type.replace("demo-", "") : "development-material", materialId: choice.materialId },
    actionLabel: choice.label, prompt: choice.prompt, priority: choice.priority || 1,
    tone: ["rose", "sand", "blue"][index % 3],
    deps: [goal, choice.type],
  }));
}

export function buildHomeSuggestions({ tasks = [], currentTaskName = "", mode = "learning" } = {}) {
  if (!MODES.has(mode) || !Array.isArray(tasks)) return [];
  const pool = [];
  for (const task of tasks) {
    if (!object(task) || !clean(task.name)) continue;
    if (mode === "learning" && task.kind === "learning") pool.push(...learningSuggestions(task));
    if (mode === "development" && task.kind !== "learning" && task.kind !== "official-learning") pool.push(...developmentSuggestions(task));
  }
  const unique = new Map();
  for (const item of pool) {
    const key = `${item.taskName}:${item.type}`;
    const old = unique.get(key);
    if (!old || item.priority > old.priority) unique.set(key, item);
  }
  if (unique.size < 6) {
    let hasDemoTaskCreation = false;
    for (const task of tasks) {
      if (!object(task) || !clean(task.name)) continue;
      const eligible = mode === "learning" ? task.kind === "learning" : task.kind !== "learning" && task.kind !== "official-learning";
      if (!eligible) continue;
      for (const item of demoSuggestions(task, mode)) {
        if (item.action.type === "task-create" && hasDemoTaskCreation) continue;
        const key = `${item.taskName}:${item.type}`;
        if (!unique.has(key) && unique.size < 6) {
          unique.set(key, item);
          if (item.action.type === "task-create") hasDemoTaskCreation = true;
        }
      }
    }
  }
  return [...unique.values()].sort((a, b) => b.priority - a.priority || Number(b.taskName === currentTaskName) - Number(a.taskName === currentTaskName) || a.taskName.localeCompare(b.taskName, "zh-CN")).slice(0, 6);
}
