import { useEffect, useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";
import { DEFAULT_LEARNING_PROFILE, LEARNING_NODES, getLearningCode, getLearningShape } from "./learning-data";

const now = () => new Date().toLocaleTimeString("zh-CN", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit" });
const sameParameters = (a, b) => Boolean(a && b && a.axes.join(",") === b.axes.join(",") && a.batch === b.batch);
const initial = profile => ({ profile: { ...DEFAULT_LEARNING_PROFILE, ...profile }, path: null, draftPath: null, pathSource: null, draftSource: null, pathProfile: null, activeNode: null, understood: [], axes: [0, 1, 2], batch: false, attempts: [], checks: [], summaries: [], time: 0, focus: "channels", channel: "all", playing: false, suggestionDismissed: false, notice: "", resetVersion: 0 });
const keyFor = taskId => `learning-journey:${taskId}`;
function restore(taskId, profile) {
  const saved = readSession(keyFor(taskId), null);
  const base = initial(profile);
  if (!saved || !Array.isArray(saved.attempts)) return base;
  return { ...base, ...saved, profile: { ...base.profile, ...saved.profile }, checks: Array.isArray(saved.checks) ? saved.checks : [], summaries: Array.isArray(saved.summaries) ? saved.summaries : [], understood: Array.isArray(saved.understood) ? saved.understood : [], playing: false };
}

/** Task-owned state changes are written at action time, never during task restore. */
export function useLearningJourney({ taskId, profile, visible = false, onRecord }) {
  const tasks = useRef(new Map());
  const [, render] = useState(0);
  const activeTask = useRef(taskId);
  activeTask.current = taskId;
  if (!tasks.current.has(taskId)) tasks.current.set(taskId, restore(taskId, profile));
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
  const shape = getLearningShape(state);
  const latestAttempt = state.attempts.at(-1);
  const currentAttempt = sameParameters(latestAttempt?.snapshot, state) && JSON.stringify(latestAttempt.profile) === JSON.stringify(state.profile) ? latestAttempt : null;
  const currentCheck = [...state.checks].reverse().find(check => check.attemptId === currentAttempt?.id && sameParameters(check.snapshot, state));
  const pathCurrent = Boolean(state.path && JSON.stringify(state.profile) === JSON.stringify(state.pathProfile));
  const readyToComplete = Boolean(pathCurrent && state.understood.includes("channels") && currentAttempt?.passed && currentCheck?.passed);
  const currentSummary = state.summaries.at(-1);
  const summaryCurrent = Boolean(currentSummary && currentSummary.attemptId === currentAttempt?.id && currentSummary.checkId === currentCheck?.id && JSON.stringify(currentSummary.path) === JSON.stringify(state.path) && JSON.stringify(currentSummary.profile) === JSON.stringify(state.profile));

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
    update({ draftPath: state.path ? state.path.map(node => ({ ...node })) : defaultPath(), draftSource: source, notice: "路径停留在草案；可以调整，再确认开始。" });
    return true;
  };
  const editPath = (id, action) => {
    const draft = (state.draftPath || state.path || defaultPath()).map(node => ({ ...node }));
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
    update({ draftPath: draft, draftSource: state.draftSource || state.pathSource || "goal", notice: "调整已放入预览，确认后才更新学习路径。" });
    return true;
  };
  const confirmPath = () => {
    if (!state.draftPath) return false;
    const path = state.draftPath.map(node => ({ ...node }));
    update({ path, draftPath: null, pathSource: state.draftSource || state.pathSource || "goal", draftSource: null, pathProfile: { ...state.profile }, activeNode: path.find(node => !node.skipped)?.id, notice: "学习路径已确认，已有学习记录保留。" });
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
  return { state, shape, latestAttempt, currentAttempt, currentCheck, pathCurrent, readyToComplete, currentSummary, summaryCurrent, getTaskState: (ownerId) => tasks.current.get(ownerId), actions: {
    setProfile: patch => update(previous => ({ profile: { ...previous.profile, ...patch }, notice: previous.path ? "目标或基础已修改；请重新审阅并确认学习路径。" : "" })),
    generatePath, editPath, confirmPath,
    cancelPath: () => update({ draftPath: null, draftSource: null, notice: state.path ? "已取消调整，保留原学习路径与记录。" : "已取消草案，可修改目标或选择现成路径。" }),
    openNode: id => update({ activeNode: id }),
    markUnderstood: () => update(previous => ({ understood: [...new Set([...previous.understood, "channels"])], notice: "已记录看过并理解这一段；可继续跟练。" })),
    axis: (index, axis) => update(previous => ({ axes: previous.axes.map((old, i) => i === index ? Number(axis) : old), notice: "参数已改变；已有尝试和检查按原条件保留。" })),
    batch: batch => update({ batch, notice: "参数已改变；已有尝试和检查按原条件保留。" }),
    focus: focus => update({ focus }), channel: channel => update({ channel }),
    seek: time => { const value = Math.max(0, Math.min(60, Number(time))); update({ time: value, focus: value < 20 ? "channels" : value < 40 ? "layout" : "batch", playing: false }); },
    play: () => update({ playing: !state.playing, ...(state.time >= 60 ? { time: 0 } : {}) }),
    runPractice, checkInput, complete,
    dismissDevelopment: () => update({ suggestionDismissed: true, notice: "后续实践建议已关闭，学习记录继续保留。" }),
    reset: () => update({ ...initial(profile), resetVersion: state.resetVersion + 1 }),
  } };
}
