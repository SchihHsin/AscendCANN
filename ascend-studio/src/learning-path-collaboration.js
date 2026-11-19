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

const copyStep = step => ({ ...step, ...(step.suggestion ? { suggestion: { ...step.suggestion, ...(step.suggestion.patch ? { patch: { ...step.suggestion.patch } } : {}) } } : {}) });

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

export function updateLearningProfileFromPrompt(profile, prompt) {
  const text = String(prompt || "");
  const next = { ...(profile || {}) };
  const timeMatch = text.match(/每天(?:只有|仅|最多|可以|大约|约)?\s*(\d+)\s*分钟/);
  if (timeMatch) next.dailyMinutes = Math.min(120, Math.max(5, Number(timeMatch[1])));

  if (/Python/i.test(text) && /会|熟悉|掌握|基础|理解/.test(text)) {
    const knowsLayout = /(?:理解|掌握|熟悉|会|学过).{0,24}HWC\s*(?:→|->|到|to)\s*CHW|HWC\s*(?:→|->|到|to)\s*CHW.{0,24}(?:理解|掌握|熟悉|会|学过)/i.test(text);
    next.background = knowsLayout ? "会 Python；理解 HWC → CHW" : "会 Python";
  }
  const targetMatch = text.match(/(?:从[^，,。；;！!]{0,30}转为|希望|想要|目标是|我想).{0,18}(?:能|可以|能够)?\s*(核对|检查|校验|匹配)\s*(?:模型的?)?图像输入/);
  if (targetMatch) next.goal = "能够核对模型的图像输入";
  return next;
}

export function learningPathContextTargets(prompt) {
  return /(?:nchw|输入形状).{0,20}(?:练习|跟练).{0,12}(?:之后|后)|(?:练习|跟练).{0,12}(?:之后|后).{0,20}(?:nchw|输入形状)/i.test(String(prompt || ""))
    ? [{ stageId: "check", stepId: "shape-check" }]
    : [];
}

/** Build a local, reviewable path proposal from explicit learner feedback. */
export function proposeLearningPathChanges(path, prompt, proposalId) {
  const next = cloneLearningPath(path);
  const changes = [];
  const text = String(prompt || "");
  const layoutToken = "(?:HWC\\s*(?:→|->|到|to)\\s*CHW|维度转换|轴顺序)";
  const knowsLayout = new RegExp(`(?:已经|已|我会|我理解|理解|掌握|熟悉|学过|不需要|跳过|减少).{0,28}${layoutToken}|(?:HWC\\s*(?:→|->|到|to)\\s*CHW|维度转换).{0,20}(?:已经|已|会了|掌握|学过|跳过)`, "i").test(text);
  const wantsQuickReview = /快速回顾|快速复习|回顾.{0,12}HWC|HWC.{0,12}回顾/i.test(text);
  const wantsPreprocess = /(?:resize|尺寸调整|尺寸预处理|图像预处理|图像推理前处理)/i.test(text);
  const wantsResize = wantsPreprocess || /(?:resize|缩放|裁剪|输入尺寸)/i.test(text);
  const wantsNormalize = wantsPreprocess || /(?:normalization|归一化|标准化)/i.test(text);
  const wantsShapeCheck = /(?:nchw|batch|输入形状|形状检查|输入检查)/i.test(text);
  const wantsOrderJudgment = /(?:预处理顺序|处理顺序|顺序判断|顺序选择|流程顺序)/i.test(text);
  const wantsModelSignature = /(?:模型输入签名|模型签名|输入签名|核对模型输入|检查模型输入|模型输入约定)/i.test(text);

  const addChange = (stageId, stepId, kind, title, reason) => {
    const id = changeId(proposalId, stageId, stepId, kind);
    changes.push({ id, proposalId, stageId, stepId, kind, title, reason, status: "pending" });
    return id;
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
      steps: (() => {
        const steps = [...stepsForStage(item)];
        const beforeIndex = step.beforeId ? steps.findIndex(candidate => candidate.id === step.beforeId) : -1;
        const content = { ...step };
        delete content.beforeId;
        const inserted = { ...content, suggestion: { id, kind: "add", status: "pending", reason } };
        if (beforeIndex >= 0) steps.splice(beforeIndex, 0, inserted);
        else steps.push(inserted);
        return steps;
      })(),
    });
  };
  const reviseStep = (stageId, stepId, patch, title, reason) => {
    const entry = next.find(item => item.id === stageId);
    const step = stepsForStage(entry).find(item => item.id === stepId);
    if (!step || step.suggestion) return;
    const id = addChange(stageId, stepId, "revise", title, reason);
    return updateStep(next, stageId, stepId, item => ({ ...item, suggestion: { id, kind: "revise", status: "pending", reason, patch } }));
  };

  if (knowsLayout) {
    if (wantsQuickReview) {
      const revised = reviseStep("channels", "layout", { title: "快速回顾 HWC → CHW", subtitle: "复习轴顺序 · H、W、C" }, "把 HWC → CHW 改为快速回顾", "你已理解 HWC → CHW，保留简短回顾并缩减基础讲解。");
      if (revised) next.splice(0, next.length, ...revised);
    } else {
      const a = markSkip("channels", "layout", "减少维度顺序基础", "你已掌握 HWC → CHW，避免重复讲解。");
      if (a) next.splice(0, next.length, ...a);
    }
    const b = markSkip("practice", "layout", "减少重复的轴转换跟练", "保留实践主线，把时间留给新的预处理重点。");
    if (b) next.splice(0, next.length, ...b);
  }
  if (wantsOrderJudgment) {
    const updated = addStep("practice", { id: "preprocess-order", title: "判断预处理顺序", subtitle: "Resize → 归一化 → 通道转换", beforeId: "result" }, "你希望从理解概念转向能判断图像预处理的实际先后顺序。");
    if (updated) next.splice(0, next.length, ...updated);
  }
  if (wantsResize) {
    const updated = addStep("practice", { id: "resize", title: "图像尺寸调整", subtitle: "Resize · 缩放与裁剪", beforeId: "result" }, "按图像推理前处理目标补入尺寸调整。");
    if (updated) next.splice(0, next.length, ...updated);
  }
  if (wantsNormalize) {
    const updated = addStep("practice", { id: "normalize", title: "归一化处理", subtitle: "Normalization · 像素值范围", beforeId: "result" }, "按图像推理前处理目标补入归一化。");
    if (updated) next.splice(0, next.length, ...updated);
  }
  if (wantsShapeCheck) {
    const updated = addStep("check", { id: "shape-check", title: "检查 NCHW 与 batch", subtitle: "输入维度顺序与样本维度", beforeId: "summary" }, "为目标模型补充输入形状检查，并放在跟练之后。");
    if (updated) next.splice(0, next.length, ...updated);
  }
  if (wantsModelSignature) {
    const updated = addStep("check", { id: "model-signature", title: "核对模型输入签名", subtitle: "shape · layout · dtype · batch", beforeId: "summary" }, "从预处理结果继续核对模型声明的输入约定。");
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
      if (change.kind === "revise") return { ...step, ...step.suggestion?.patch, suggestion: { ...step.suggestion, status: "accepted" } };
      return { ...step, ...(change.kind === "skip" ? { skipped: true } : {}), suggestion: { ...step.suggestion, status: "accepted" } };
    });
  }
  return { path: nextPath, changes: nextChanges };
}

export function moveLearningPathStep(path, stageId, sourceId, targetId, direction = null) {
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
  const nextTargetIndex = steps.findIndex(step => step.id === targetId);
  moved.userAdjusted = true;
  const insertAt = direction === "after" ? nextTargetIndex + 1 : direction === "before" ? nextTargetIndex : targetIndex;
  steps.splice(insertAt, 0, moved);
  next[next.findIndex(entry => entry.id === stageId)] = { ...stage, steps };
  return { path: next, movedTitle, targetTitle, relation: direction ? direction === "after" ? "之后" : "之前" : sourceIndex < targetIndex ? "之后" : "之前" };
}

export function commitLearningPath(path) {
  return cloneLearningPath(path).map(entry => ({
    ...entry,
    steps: stepsForStage(entry).map(step => {
      const { suggestion, userAdjusted, ...rest } = step;
      return rest;
    }),
  }));
}

export const pendingPathChangeCount = changes => (changes || []).filter(change => change.status === "pending").length;
