export const LEARNING_PATH_STEPS = {
  environment: [{ id: "environment-intro", title: "认识学习示例", subtitle: "输入与运行边界" }],
  channels: [
    { id: "channels", title: "认识 RGB 通道", subtitle: "每个像素的三个值" },
    { id: "layout", title: "理解维度顺序", subtitle: "HWC 与 CHW" },
    { id: "batch", title: "理解样本维度", subtitle: "N = 1" },
  ],
  practice: [
    { id: "layout", title: "调整通道顺序", subtitle: "HWC → CHW" },
    { id: "batch", title: "增加 batch", subtitle: "N = 1" },
    { id: "result", title: "查看输出形状", subtitle: "关联本次练习结果" },
  ],
  check: [
    { id: "input", title: "核对本次输入", subtitle: "关联已通过的尝试" },
    { id: "summary", title: "保存学习记录", subtitle: "区分看过与检查通过" },
  ],
};

const copyStep = step => ({ ...step, ...(step.suggestion ? { suggestion: { ...step.suggestion } } : {}) });

export function cloneLearningPath(path) {
  return (path || []).map(entry => ({
    ...entry,
    ...(Array.isArray(entry.steps) ? { steps: entry.steps.map(copyStep) } : {}),
  }));
}

export function stepsForStage(entry) {
  return (Array.isArray(entry?.steps) ? entry.steps : LEARNING_PATH_STEPS[entry?.id] || []).map(copyStep);
}

function updateStep(path, stageId, stepId, change) {
  return path.map(entry => entry.id !== stageId ? entry : {
    ...entry,
    steps: stepsForStage(entry).map(step => step.id === stepId ? change(step) : step),
  });
}

function changeId(proposalId, stageId, stepId, kind) {
  return `${proposalId}:${stageId}:${stepId}:${kind}`;
}

/** Build a local, reviewable path proposal from explicit learner feedback. */
export function proposeLearningPathChanges(path, prompt, proposalId) {
  const next = cloneLearningPath(path);
  const changes = [];
  const text = String(prompt || "");
  const knowsLayout = /(?:已经|已|我会|掌握|熟悉|学过|不需要|跳过|减少).{0,28}(?:HWC\s*(?:→|->|to)\s*CHW|维度转换|轴顺序)|(?:HWC\s*(?:→|->|to)\s*CHW|维度转换).{0,20}(?:已经|已|会了|掌握|学过|跳过)/i.test(text);
  const wantsPreprocess = /(?:resize|尺寸调整|尺寸预处理|图像预处理|图像推理前处理)/i.test(text);
  const wantsResize = wantsPreprocess || /(?:resize|缩放|裁剪|输入尺寸)/i.test(text);
  const wantsNormalize = wantsPreprocess || /(?:normalization|归一化|标准化)/i.test(text);
  const wantsShapeCheck = /(?:nchw|batch|输入形状|形状检查|输入检查)/i.test(text);

  const addChange = (stageId, stepId, kind, title, reason) => {
    const id = changeId(proposalId, stageId, stepId, kind);
    changes.push({ id, proposalId, stageId, stepId, kind, title, reason, status: "pending" });
  };
  const markSkip = (stageId, stepId, title, reason) => {
    const entry = next.find(item => item.id === stageId);
    const step = stepsForStage(entry).find(item => item.id === stepId);
    if (!step || step.suggestion || step.skipped) return;
    const id = changeId(proposalId, stageId, stepId, "skip");
    addChange(stageId, stepId, "skip", title, reason);
    return updateStep(next, stageId, stepId, item => ({ ...item, suggestion: { id, kind: "skip", status: "pending", reason } }));
  };
  const addStep = (stageId, step, reason) => {
    const entry = next.find(item => item.id === stageId);
    if (!entry || stepsForStage(entry).some(item => item.id === step.id)) return;
    const id = changeId(proposalId, stageId, step.id, "add");
    addChange(stageId, step.id, "add", step.title, reason);
    return next.map(item => item.id !== stageId ? item : {
      ...item,
      steps: [...stepsForStage(item), { ...step, suggestion: { id, kind: "add", status: "pending", reason } }],
    });
  };

  if (knowsLayout) {
    const a = markSkip("channels", "layout", "减少维度顺序基础", "你已掌握 HWC → CHW，避免重复讲解。");
    if (a) next.splice(0, next.length, ...a);
    const b = markSkip("practice", "layout", "减少重复的轴转换跟练", "保留实践主线，把时间留给新的预处理重点。");
    if (b) next.splice(0, next.length, ...b);
  }
  if (wantsResize) {
    const updated = addStep("practice", { id: "resize", title: "图像尺寸调整", subtitle: "Resize · 缩放与裁剪" }, "按图像推理前处理目标补入尺寸调整。");
    if (updated) next.splice(0, next.length, ...updated);
  }
  if (wantsNormalize) {
    const updated = addStep("practice", { id: "normalize", title: "归一化处理", subtitle: "Normalization · 像素值范围" }, "按图像推理前处理目标补入归一化。");
    if (updated) next.splice(0, next.length, ...updated);
  }
  if (wantsShapeCheck) {
    const updated = addStep("check", { id: "shape-check", title: "检查 NCHW 与 batch", subtitle: "输入维度顺序与样本维度" }, "为目标模型补充输入形状检查。");
    if (updated) next.splice(0, next.length, ...updated);
  }
  return { path: next, changes };
}

export function resolveLearningPathChange(path, changes, id, accept) {
  const change = changes.find(item => item.id === id && item.status === "pending");
  if (!change) return { path, changes };
  let nextPath = cloneLearningPath(path);
  const nextChanges = changes.map(item => item.id === id ? { ...item, status: accept ? "accepted" : "rejected" } : item);
  const entry = nextPath.find(item => item.id === change.stageId);
  if (!entry) return { path: nextPath, changes: nextChanges };
  if (!accept && change.kind === "add") {
    nextPath = nextPath.map(item => item.id !== change.stageId ? item : {
      ...item,
      steps: stepsForStage(item).filter(step => step.id !== change.stepId),
    });
  } else {
    nextPath = updateStep(nextPath, change.stageId, change.stepId, step => {
      if (!accept) {
        const { suggestion, ...rest } = step;
        return rest;
      }
      return { ...step, ...(change.kind === "skip" ? { skipped: true } : {}), suggestion: { ...step.suggestion, status: "accepted" } };
    });
  }
  return { path: nextPath, changes: nextChanges };
}

export function moveLearningPathStep(path, stageId, sourceId, targetId) {
  if (sourceId === targetId) return null;
  let movedTitle = "";
  let targetTitle = "";
  const next = cloneLearningPath(path);
  const stage = next.find(entry => entry.id === stageId);
  if (!stage) return null;
  const steps = stepsForStage(stage);
  const sourceIndex = steps.findIndex(step => step.id === sourceId);
  const targetIndex = steps.findIndex(step => step.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return null;
  movedTitle = steps[sourceIndex].title;
  targetTitle = steps[targetIndex].title;
  const [moved] = steps.splice(sourceIndex, 1);
  steps.splice(targetIndex, 0, moved);
  next[next.findIndex(entry => entry.id === stageId)] = { ...stage, steps };
  return { path: next, movedTitle, targetTitle, relation: sourceIndex < targetIndex ? "之后" : "之前" };
}

export function commitLearningPath(path) {
  return cloneLearningPath(path).map(entry => ({
    ...entry,
    steps: stepsForStage(entry).map(step => {
      const { suggestion, ...rest } = step;
      return rest;
    }),
  }));
}

export const pendingPathChangeCount = changes => (changes || []).filter(change => change.status === "pending").length;
