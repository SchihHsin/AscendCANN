import { useEffect, useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";
import { DEFAULT_LEARNING_PROFILE, LEARNING_NODES, getLearningCode, getLearningShape, getTransferCode, getTransferShape } from "./learning-data";
import { cloneLearningPath, commitLearningPath, moveLearningPathStep, pendingPathChangeCount, proposeLearningPathChanges, resolveLearningPathChange } from "./learning-path-collaboration";
import { createPathGenerationDemoDraft } from "./learning-path-generation";

const now = () => new Date().toLocaleTimeString("zh-CN", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit" });
const sameParameters = (a, b) => Boolean(a && b && a.axes.join(",") === b.axes.join(",") && a.batch === b.batch);
const initial = profile => ({ profile: { ...DEFAULT_LEARNING_PROFILE, ...profile }, path: null, draftPath: null, pathSource: null, draftSource: null, pathProfile: null, pathChanges: [], pathProposalId: null, pathUndo: [], pathSync: "", activeNode: null, understood: [], axes: [0, 1, 2], batch: false, attempts: [], checks: [], summaries: [], transfer: null, practiceView: "base", time: 0, focus: "channels", channel: "all", playing: false, suggestionDismissed: false, notice: "", resetVersion: 0 });
const keyFor = taskId => `learning-journey:${taskId}`;
function restore(taskId, profile, seedPathGeneration) {
  const saved = readSession(keyFor(taskId), null);
  const base = initial(profile);
  if (!saved || !Array.isArray(saved.attempts)) return seedPathGeneration ? { ...base, ...createPathGenerationDemoDraft() } : base;
  return { ...base, ...saved, profile: { ...base.profile, ...saved.profile }, checks: Array.isArray(saved.checks) ? saved.checks : [], summaries: Array.isArray(saved.summaries) ? saved.summaries : [], understood: Array.isArray(saved.understood) ? saved.understood : [], pathChanges: Array.isArray(saved.pathChanges) ? saved.pathChanges : [], pathUndo: Array.isArray(saved.pathUndo) ? saved.pathUndo : [], pathProposalId: saved.pathProposalId || null, transfer: saved.transfer || null, practiceView: saved.practiceView === "transfer" ? "transfer" : "base", playing: false };
}
function exposeTaskState(task) {
  if (!task) return undefined;
  const latestAttempt = task.attempts?.at(-1);
  const currentAttempt = latestAttempt && sameParameters(latestAttempt.snapshot, task)
    && JSON.stringify(latestAttempt.profile) === JSON.stringify(task.profile) ? latestAttempt : null;
  const currentCheck = [...(task.checks || [])].reverse().find(check => check.attemptId === currentAttempt?.id && sameParameters(check.snapshot, task));
  const currentSummary = task.summaries?.at(-1);
  const pathCurrent = Boolean(task.path && JSON.stringify(task.profile) === JSON.stringify(task.pathProfile));
  const summaryCurrent = Boolean(currentSummary && pathCurrent && currentAttempt && currentCheck
    && currentSummary.attemptId === currentAttempt.id && currentSummary.checkId === currentCheck.id
    && JSON.stringify(currentSummary.path) === JSON.stringify(task.path)
    && JSON.stringify(currentSummary.profile) === JSON.stringify(task.profile));
  const transferSource = task.transfer && task.summaries?.find(summary => summary.id === task.transfer.sourceSummaryId);
  const transferSourceCurrent = Boolean(summaryCurrent && transferSource?.id === currentSummary?.id
    && task.transfer.sourceSignature === JSON.stringify({ attemptId: transferSource.attemptId, checkId: transferSource.checkId, profile: transferSource.profile, path: transferSource.path, dimensions: transferSource.dimensions }));
  const latestTransferAttempt = task.transfer?.attempts?.at(-1);
  const transferCurrentAttempt = transferSourceCurrent && latestTransferAttempt
    && latestTransferAttempt.sourceSummaryId === task.transfer.sourceSummaryId
    && JSON.stringify(latestTransferAttempt.snapshot) === JSON.stringify(task.transfer.snapshot) ? latestTransferAttempt : null;
  return { ...task, transferSourceCurrent, transferCurrentAttempt, transferCompleted: Boolean(transferCurrentAttempt?.passed) };
}

/** Task-owned state changes are written at action time, never during task restore. */
export function useLearningJourney({ taskId, profile, visible = false, onRecord, seedPathGeneration = false }) {
  const tasks = useRef(new Map());
  const [, render] = useState(0);
  const activeTask = useRef(taskId);
  activeTask.current = taskId;
  if (!tasks.current.has(taskId)) tasks.current.set(taskId, restore(taskId, profile, seedPathGeneration));
  const state = tasks.current.get(taskId);
  const update = (change, ownerId = taskId) => {
    const previous = tasks.current.get(ownerId);
    const next = { ...previous, ...(typeof change === "function" ? change(previous) : change) };
    tasks.current.set(ownerId, next);
    writeSession(keyFor(ownerId), { ...next, playing: false });
    render(revision => revision + 1);
    return next;
  };
  const record = (title, summary, kind, data) => onRecord?.({ title, summary, kind, data, isDemo: true }, taskId);
  const pathSnapshot = previous => ({ draftPath: previous.draftPath ? cloneLearningPath(previous.draftPath) : null, pathChanges: (previous.pathChanges || []).map(change => ({ ...change })), pathProposalId: previous.pathProposalId || null, pathSync: previous.pathSync || "" });
  const pathUndoStack = () => [...(state.pathUndo || []), pathSnapshot(state)].slice(-20);
  const shape = getLearningShape(state);
  const latestAttempt = state.attempts.at(-1);
  const currentAttempt = sameParameters(latestAttempt?.snapshot, state) && JSON.stringify(latestAttempt.profile) === JSON.stringify(state.profile) ? latestAttempt : null;
  const currentCheck = [...state.checks].reverse().find(check => check.attemptId === currentAttempt?.id && sameParameters(check.snapshot, state));
  const pathCurrent = Boolean(state.path && JSON.stringify(state.profile) === JSON.stringify(state.pathProfile));
  const readyToComplete = Boolean(pathCurrent && state.understood.includes("channels") && currentAttempt?.passed && currentCheck?.passed);
  const currentSummary = state.summaries.at(-1);
  const summaryCurrent = Boolean(currentSummary && currentSummary.attemptId === currentAttempt?.id && currentSummary.checkId === currentCheck?.id && JSON.stringify(currentSummary.path) === JSON.stringify(state.path) && JSON.stringify(currentSummary.profile) === JSON.stringify(state.profile));
  const transferSource = state.transfer && state.summaries.find(summary => summary.id === state.transfer.sourceSummaryId);
  const transferSourceCurrent = Boolean(transferSource && transferSource.id === currentSummary?.id && summaryCurrent && transferSource.id === state.transfer.sourceSummaryId && state.transfer.sourceSignature === JSON.stringify({ attemptId: transferSource.attemptId, checkId: transferSource.checkId, profile: transferSource.profile, path: transferSource.path, dimensions: transferSource.dimensions }));
  const transferAttempt = state.transfer?.attempts?.at(-1);
  const transferCurrentAttempt = transferSourceCurrent && transferAttempt && transferAttempt.sourceSummaryId === state.transfer.sourceSummaryId && JSON.stringify(transferAttempt.snapshot) === JSON.stringify(state.transfer.snapshot) ? transferAttempt : null;
  const transferShape = state.transfer ? getTransferShape(state.transfer.snapshot) : getTransferShape();

  useEffect(() => {
    if (!visible || !state.playing) return undefined;
    const ownerId = taskId;
    const timer = setInterval(() => {
      if (activeTask.current !== ownerId) return;
      update(previous => {
        const time = Math.min(60, previous.time + .5);
        return { time, focus: time < 20 ? "channels" : time < 40 ? "layout" : "batch", playing: time < 60 };
      }, ownerId);
    }, 500);
    return () => {
      clearInterval(timer);
      const previous = tasks.current.get(ownerId);
      if (previous?.playing) {
        const paused = { ...previous, playing: false };
        tasks.current.set(ownerId, paused);
        writeSession(keyFor(ownerId), paused);
      }
    };
  }, [taskId, visible, state.playing]);
  const defaultPath = () => LEARNING_NODES.map(node => ({ id: node.id, skipped: false }));
  const generatePath = (source = "goal") => {
    if (!state.profile.goal.trim()) { update({ notice: "先填写想学会的内容。" }); return false; }
    const proposalId = crypto.randomUUID();
    update({ draftPath: state.path ? cloneLearningPath(state.path) : defaultPath(), draftSource: source, pathChanges: [], pathProposalId: proposalId, pathUndo: [], pathSync: "", notice: "路径停留在草案；可以继续讨论或调整，再确认开始。" });
    return { proposalId, changes: [] };
  };
  const startPathFromPrompt = prompt => {
    const text = String(prompt || "").trim();
    const nextProfile = { ...state.profile };
    const goalMatch = text.match(/(?:我想|希望|想要|帮我)?\s*(学会|学习|掌握|了解)\s*([^，,。；;！!]+)/);
    if (goalMatch) nextProfile.goal = `${goalMatch[1]}${goalMatch[2].trim()}`;
    const timeMatch = text.match(/每天(?:可以|大约|约)?\s*(\d+)\s*分钟/);
    if (timeMatch) nextProfile.dailyMinutes = Math.min(120, Math.max(5, Number(timeMatch[1])));
    const backgroundMatch = text.match(/(会一点|有)([^，,。；;！!]{1,30}(?:Python|python|基础|经验)[^，,。；;！!]*)/);
    if (backgroundMatch) nextProfile.background = `${backgroundMatch[1]}${backgroundMatch[2]}`.trim();
    if (!nextProfile.goal.trim()) { update({ notice: "先补充想学会的内容。" }); return null; }
    const proposalId = crypto.randomUUID();
    const proposal = proposeLearningPathChanges(state.path ? cloneLearningPath(state.path) : defaultPath(), text, proposalId);
    update({ profile: nextProfile, draftPath: proposal.path, draftSource: "goal", pathChanges: proposal.changes, pathProposalId: proposalId, pathUndo: [], pathSync: "", notice: proposal.changes.length ? `AI 已准备学习路径和 ${proposal.changes.length} 项建议；请先审阅，确认前不会开始学习。` : "AI 已按你的目标准备路径草案；确认前不会开始学习。" });
    return { proposalId, profile: nextProfile, path: proposal.path, changes: proposal.changes };
  };
  const proposePathChanges = prompt => {
    const basePath = state.draftPath || state.path || defaultPath();
    const proposalId = crypto.randomUUID();
    const proposal = proposeLearningPathChanges(basePath, prompt, proposalId);
    if (!proposal.changes.length) return { proposalId: state.pathProposalId, changes: [], path: basePath };
    update({ draftPath: proposal.path, draftSource: state.draftSource || state.pathSource || "goal", pathChanges: [...(state.pathChanges || []), ...proposal.changes], pathProposalId: proposalId, pathUndo: pathUndoStack(), pathSync: "", notice: `已准备 ${proposal.changes.length} 项建议；原路径与学习记录保持不变。` });
    return { proposalId, changes: proposal.changes, path: proposal.path };
  };
  const resolvePathChange = (id, accept) => {
    if (!state.draftPath || !state.pathChanges?.some(change => change.id === id && change.status === "pending")) return false;
    const result = resolveLearningPathChange(state.draftPath, state.pathChanges, id, accept);
    update({ draftPath: result.path, pathChanges: result.changes, pathUndo: pathUndoStack(), notice: accept ? "已采纳这项路径建议；确认整条路径后才生效。" : "已忽略这项建议，保留原节点。" });
    return true;
  };
  const acceptAllPathChanges = () => {
    const pending = (state.pathChanges || []).filter(change => change.status === "pending");
    if (!state.draftPath || !pending.length) return false;
    const result = pending.reduce((current, change) => resolveLearningPathChange(current.path, current.changes, change.id, true), { path: state.draftPath, changes: state.pathChanges });
    update({ draftPath: result.path, pathChanges: result.changes, pathUndo: pathUndoStack(), notice: `已采纳 ${pending.length} 项建议；确认整条路径后才开始学习。` });
    return true;
  };
  const dismissPathSuggestions = () => {
    const pending = (state.pathChanges || []).filter(change => change.status === "pending");
    if (!state.draftPath || !pending.length) return false;
    const result = pending.reduce((current, change) => resolveLearningPathChange(current.path, current.changes, change.id, false), { path: state.draftPath, changes: state.pathChanges });
    update({ draftPath: result.path, pathChanges: result.changes, pathUndo: pathUndoStack(), notice: "已忽略待审阅建议；路径草案仍可继续调整。" });
    return true;
  };
  const undoPathEdit = () => {
    const previous = state.pathUndo?.at(-1);
    if (!previous) return false;
    update({ draftPath: previous.draftPath ? cloneLearningPath(previous.draftPath) : null, pathChanges: previous.pathChanges || [], pathProposalId: previous.pathProposalId || null, pathSync: previous.pathSync || "", pathUndo: state.pathUndo.slice(0, -1), notice: "已撤销上一步路径调整。" });
    return true;
  };
  const reorderPathStep = (stageId, sourceId, targetId) => {
    const basePath = state.draftPath || state.path || defaultPath();
    const moved = moveLearningPathStep(basePath, stageId, sourceId, targetId);
    if (!moved) return false;
    const pathSync = `已把「${moved.movedTitle}」移到「${moved.targetTitle}」${moved.relation}；同阶段的其余节点顺序已同步调整。你可以继续拖动，或撤销这一步。`;
    update({ draftPath: moved.path, draftSource: state.draftSource || state.pathSource || "goal", pathProposalId: state.pathProposalId || crypto.randomUUID(), pathUndo: pathUndoStack(), pathSync, notice: `${pathSync} 确认草案后才会替换当前路径。` });
    return true;
  };
  const editPath = (id, action) => {
    const draft = cloneLearningPath(state.draftPath || state.path || defaultPath());
    const index = draft.findIndex(node => node.id === id);
    if (index < 0) return false;
    if (action === "skip" && id === "environment") draft[index].skipped = !draft[index].skipped;
    else if (action === "up" || action === "down") {
      const target = index + (action === "up" ? -1 : 1);
      if (target < 0 || target >= draft.length) return false;
      [draft[index], draft[target]] = [draft[target], draft[index]];
      const order = draft.filter(node => node.id !== "environment").map(node => node.id).join(",");
      if (order !== "channels,practice,check") { update({ notice: "理解 → 跟练 → 输入检查需要按依赖顺序进行；环境准备可移动或跳过。" }); return false; }
    }
    update({ draftPath: draft, draftSource: state.draftSource || state.pathSource || "goal", pathProposalId: state.pathProposalId || crypto.randomUUID(), pathUndo: pathUndoStack(), notice: "调整已放入预览，确认后才更新学习路径。" });
    return true;
  };
  const confirmPath = () => {
    if (!state.draftPath) return false;
    if (pendingPathChangeCount(state.pathChanges) > 0) { update({ notice: "还有路径建议待你采纳或忽略；处理后再确认整条路径。" }); return false; }
    const path = commitLearningPath(state.draftPath);
    update({ path, draftPath: null, pathSource: state.draftSource || state.pathSource || "goal", draftSource: null, pathProfile: { ...state.profile }, pathChanges: [], pathProposalId: null, pathUndo: [], pathSync: "", activeNode: path.find(node => !node.skipped)?.id, notice: "学习路径已确认，已有学习记录保留。" });
    record("已确认学习路径", `${state.profile.goal}；${path.filter(node => !node.skipped).length} 个节点；每天 ${state.profile.dailyMinutes} 分钟。`, "learning-path", { path, profile: state.profile });
    return true;
  };
  const runPractice = () => {
    if (!state.path || !pathCurrent) { update({ notice: "请先确认与当前目标对应的学习路径。" }); return null; }
    const snapshot = { axes: [...state.axes], batch: state.batch };
    const result = getLearningShape(snapshot);
    const attempt = { id: crypto.randomUUID(), time: now(), snapshot, ...result, code: getLearningCode(snapshot), path: state.path.map(node => ({ ...node })), profile: { ...state.profile } };
    update(previous => ({ attempts: [...previous.attempts, attempt], activeNode: "practice", notice: result.passed ? "本次形状检查通过，可以继续输入检查。" : result.valid ? "本次输出尚不符合示例约定；修改参数后可重试。" : "轴 0、1、2 各用一次；这次无效尝试也已保留。" }));
    record("学习跟练尝试", `${result.valid ? `[${result.dimensions.join(",")}]` : "重复或无效轴"} · ${result.passed ? "形状符合" : "需调整"}示例约定。`, "learning-attempt", attempt);
    return attempt;
  };
  const checkInput = () => {
    if (!currentAttempt?.passed || !pathCurrent) { update({ notice: "先用当前参数完成一次通过的跟练，再核对输入。" }); return null; }
    const check = { id: crypto.randomUUID(), time: now(), attemptId: currentAttempt.id, snapshot: { ...currentAttempt.snapshot, axes: [...currentAttempt.snapshot.axes] }, passed: true, dimensions: [...currentAttempt.dimensions], code: currentAttempt.code };
    update(previous => ({ checks: [...previous.checks, check], activeNode: "check", notice: "本次输入形状核对通过，结果已关联到这次尝试。" }));
    record("学习输入检查", `NCHW [${check.dimensions.join(",")}]；对应尝试 ${state.attempts.indexOf(currentAttempt) + 1}。仅核对浏览器形状约定。`, "learning-check", check);
    return check;
  };
  const complete = () => {
    if (!readyToComplete) { update({ notice: "完成摘要需要：理解节点、当前跟练通过，以及对应的输入检查。" }); return null; }
    if (summaryCurrent) { update({ notice: "当前学习记录已经保存，可直接恢复原内容。" }); return currentSummary; }
    const summary = { id: crypto.randomUUID(), time: now(), profile: { ...state.profile }, path: state.path.map(node => ({ ...node })), understood: [...state.understood], attemptId: currentAttempt.id, checkId: currentCheck.id, snapshot: { ...currentAttempt.snapshot, axes: [...currentAttempt.snapshot.axes] }, dimensions: [...currentAttempt.dimensions], code: currentAttempt.code, attemptCount: state.attempts.length };
    update(previous => ({ summaries: [...previous.summaries, summary], notice: "学习记录与练习内容已保存在当前浏览器。" }));
    record("已保存学习记录", `${state.profile.goal}；理解与示例形状检查已完成，共 ${state.attempts.length} 次尝试。`, "learning-summary", summary);
    return summary;
  };
  const startTransfer = summaryId => {
    const summary = state.summaries.find(item => item.id === summaryId);
    if (!summary || summary.id !== currentSummary?.id || !summaryCurrent) { update({ practiceView: "base", notice: "来源学习小结已变化或不再有效，请从当前有效小结重新开始迁移练习。" }); return false; }
    const sourceSignature = JSON.stringify({ attemptId: summary.attemptId, checkId: summary.checkId, profile: summary.profile, path: summary.path, dimensions: summary.dimensions });
    if (state.transfer?.sourceSummaryId === summaryId && state.transfer.sourceSignature === sourceSignature) {
      update({ practiceView: "transfer", activeNode: "practice", notice: "已恢复同一条迁移练习；原参数和尝试历史均保留。" });
      return true;
    }
    const snapshot = { dimensions: [128, 256, 3], axes: [0, 1, 2], batch: false };
    update({ transfer: { sourceSummaryId: summaryId, sourceSignature, dimensions: [...snapshot.dimensions], axes: [...snapshot.axes], batch: snapshot.batch, snapshot, attempts: [] }, practiceView: "transfer", activeNode: "practice", notice: "迁移练习已建立，基础练习参数和历史保持不变。" });
    return true;
  };
  const runTransfer = () => {
    if (!state.transfer || !transferSourceCurrent) { update({ notice: "来源学习小结已变化或不再有效；本次迁移练习不计为完成。" }); return null; }
    const snapshot = { dimensions: [...state.transfer.dimensions], axes: [...state.transfer.axes], batch: state.transfer.batch };
    const result = getTransferShape(snapshot);
    const attempt = { id: crypto.randomUUID(), sourceSummaryId: state.transfer.sourceSummaryId, time: now(), snapshot, ...result, code: getTransferCode(snapshot) };
    update(previous => ({ transfer: { ...previous.transfer, snapshot, attempts: [...previous.transfer.attempts, attempt] }, notice: result.passed ? "迁移形状检查通过；这是本地形状演算，不是 Python 或 NPU 执行。" : result.valid ? "迁移输出尚不符合 NHWC → NCHW 目标；调整后可重试。" : "输入尺寸与轴序无效；修正后重试。" }));
    record("学习迁移练习尝试", `来源小结 ${state.transfer.sourceSummaryId}；${result.valid ? `[${result.dimensions.join(",")}]` : "无效输入"} · ${result.passed ? "符合迁移形状约定" : "需调整"}。仅本地形状演算。`, "learning-transfer-attempt", attempt);
    return attempt;
  };
  const setTransferAxis = (index, axis) => update(previous => previous.transfer ? ({ transfer: { ...previous.transfer, axes: previous.transfer.axes.map((value, i) => i === index ? Number(axis) : value) }, notice: "迁移参数已改变；旧尝试仍保留在历史中，当前需重新运行。" }) : { notice: "先从有效学习小结开始迁移练习。" });
  const setTransferBatch = batch => update(previous => previous.transfer ? ({ transfer: { ...previous.transfer, batch: Boolean(batch) }, notice: "迁移参数已改变；旧尝试仍保留在历史中，当前需重新运行。" }) : { notice: "先从有效学习小结开始迁移练习。" });
  return { state, shape, latestAttempt, currentAttempt, currentCheck, pathCurrent, readyToComplete, currentSummary, summaryCurrent, transferShape, transferSource, transferSourceCurrent, transferCurrentAttempt, getTaskState: ownerId => exposeTaskState(tasks.current.get(ownerId)), actions: {
    setProfile: patch => update(previous => ({ profile: { ...previous.profile, ...patch }, notice: previous.path ? "目标或基础已修改；请重新审阅并确认学习路径。" : "" })),
    generatePath, startPathFromPrompt, proposePathChanges, resolvePathChange, acceptAllPathChanges, dismissPathSuggestions, undoPathEdit, reorderPathStep, editPath, confirmPath,
    cancelPath: () => update({ draftPath: null, draftSource: null, pathChanges: [], pathProposalId: null, pathUndo: [], pathSync: "", notice: state.path ? "已取消调整，保留原学习路径与记录。" : "已取消草案，可修改目标或选择现成路径。" }),
    openNode: id => update({ activeNode: id }),
    markUnderstood: () => update(previous => ({ understood: [...new Set([...previous.understood, "channels"])], notice: "已记录看过并理解这一段；可继续跟练。" })),
    axis: (index, axis) => update(previous => ({ axes: previous.axes.map((old, i) => i === index ? Number(axis) : old), notice: "参数已改变；已有尝试和检查按原条件保留。" })),
    batch: batch => update({ batch, notice: "参数已改变；已有尝试和检查按原条件保留。" }),
    focus: focus => update({ focus }), channel: channel => update({ channel }),
    seek: time => { const value = Math.max(0, Math.min(60, Number(time))); update({ time: value, focus: value < 20 ? "channels" : value < 40 ? "layout" : "batch", playing: false }); },
    play: () => update({ playing: !state.playing, ...(state.time >= 60 ? { time: 0 } : {}) }),
    runPractice, checkInput, complete,
    startTransfer, setTransferAxis, setTransferBatch, runTransfer,
    returnToBasePractice: () => update({ practiceView: "base", notice: "已返回基础练习；其参数和尝试历史均已保留。" }),
    dismissDevelopment: () => update({ suggestionDismissed: true, notice: "后续实践建议已关闭，学习记录继续保留。" }),
    reset: () => update({ ...initial(profile), resetVersion: state.resetVersion + 1 }),
  } };
}
