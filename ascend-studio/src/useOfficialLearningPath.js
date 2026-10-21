import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";
import { OFFICIAL_LEARNING_STAGES, getOfficialLearningNode } from "./official-learning-data";
import { currentInputAttempt, currentSequenceAttempt, deriveOfficialStatuses, initialOfficialProgress, restoreOfficialProgress } from "./official-learning-progress";

const keyFor = taskId => `learning-official-path:${taskId}`;
const object = value => value && typeof value === "object" && !Array.isArray(value);
const now = () => new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const stepFor = id => { const node = getOfficialLearningNode(id); return node?.kind === "course" ? node.children[0] : node; };

export function useOfficialLearningPath({ taskId, enabled = true, visible = false, onRecord } = {}) {
  const tasks = useRef(new Map());
  const active = useRef(enabled);
  active.current = enabled;
  const [, render] = useState(0);
  if (enabled && typeof taskId === "string" && !tasks.current.has(taskId)) tasks.current.set(taskId, restoreOfficialProgress(readSession(keyFor(taskId), null)));
  const raw = enabled ? tasks.current.get(taskId) || initialOfficialProgress() : initialOfficialProgress();
  const update = useCallback(change => {
    if (!enabled || !active.current || typeof taskId !== "string") return undefined;
    const previous = tasks.current.get(taskId) || initialOfficialProgress();
    const next = typeof change === "function" ? change(previous) : { ...previous, ...change };
    if (next === previous) return previous;
    tasks.current.set(taskId, next);
    writeSession(keyFor(taskId), { ...next, playing: false });
    render(value => value + 1);
    return next;
  }, [enabled, taskId]);
  useEffect(() => { if (!visible && raw.playing) update(previous => ({ ...previous, playing: false })); }, [visible, taskId]);
  useEffect(() => {
    if (!enabled || !visible || !raw.playing) return undefined;
    const timer = setInterval(() => update(previous => {
      const time = Math.min(45, (previous.times[previous.selectedNodeId] || 0) + .5);
      return { ...previous, times: { ...previous.times, [previous.selectedNodeId]: time }, playing: time < 45 };
    }), 500);
    return () => clearInterval(timer);
  }, [enabled, visible, raw.playing, raw.selectedNodeId, update]);
  const actions = useMemo(() => ({
    selectNode: id => {
      const node = stepFor(id);
      if (node) update(previous => previous.selectedNodeId === node.id ? previous : { ...previous, selectedNodeId: node.id, playing: false, notice: "" });
    },
    startNode: id => {
      const node = stepFor(id);
      if (node) update(previous => ({ ...previous, selectedNodeId: node.id, started: [...new Set([...previous.started, node.id])] }));
    },
    understand: id => {
      const node = stepFor(id);
      if (node) update(previous => ({ ...previous, understood: [...new Set([...previous.understood, node.id])], notice: "已记录理解；完成当前练习或理解题后更新节点进度。" }));
    },
    chooseAnswer: (id, option) => {
      const node = stepFor(id);
      if (node?.checkpoint.options.some(item => item.id === option)) update(previous => ({ ...previous, answers: { ...previous.answers, [node.id]: option }, notice: "" }));
    },
    checkAnswer: id => {
      const node = stepFor(id);
      if (!node) return;
      update(previous => {
        const answer = previous.answers[node.id];
        if (!answer) return { ...previous, notice: "先选择一个答案，再检查理解。" };
        const check = { id: uid("understanding"), nodeId: node.id, answer, passed: answer === node.checkpoint.answer, time: now() };
        return { ...previous, started: [...new Set([...previous.started, node.id])], checks: { ...previous.checks, [node.id]: check }, attempts: [...previous.attempts, check].slice(-120), notice: check.passed ? "理解题已通过；学习状态会结合理解记录与当前练习更新。" : "这次答案需调整，图解与历史尝试都会保留。" };
      });
    },
    patchInput: patch => { if (object(patch)) update(previous => ({ ...previous, input: { ...previous.input, ...patch }, notice: "" })); },
    runInput: () => update(previous => {
      const { axes, batch } = previous.input;
      const valid = axes.length === 3 && new Set(axes).size === 3 && axes.every(axis => [0, 1, 2].includes(axis));
      const check = { id: uid("input"), snapshot: { axes: [...axes], batch }, dimensions: valid ? [...(batch ? [1] : []), ...axes.map(axis => [224, 224, 3][axis])] : [], passed: valid && axes.join(",") === "2,0,1" && batch, time: now() };
      return { ...previous, inputAttempts: [...previous.inputAttempts, check].slice(-40), notice: check.passed ? "本次教学示例维度检查通过。" : "当前轴顺序或 batch 还不符合教学示例目标。" };
    }),
    moveSequence: (index, direction) => update(previous => {
      const target = index + direction;
      if (target < 0 || target >= previous.sequence.length) return previous;
      const sequence = [...previous.sequence];
      [sequence[index], sequence[target]] = [sequence[target], sequence[index]];
      return { ...previous, sequence, notice: "" };
    }),
    runSequence: () => update(previous => {
      const check = { id: uid("sequence"), snapshot: [...previous.sequence], passed: previous.sequence.join(",") === "load,input,execute,output", time: now() };
      return { ...previous, sequenceAttempts: [...previous.sequenceAttempts, check].slice(-40), notice: check.passed ? "调用先后关系检查通过。" : "先加载模型与准备输入，再执行并读取输出。" };
    }),
    seek: time => update(previous => ({ ...previous, times: { ...previous.times, [previous.selectedNodeId]: Math.max(0, Math.min(45, Number(time) || 0)) }, playing: false })),
    play: () => update(previous => ({ ...previous, started: [...new Set([...previous.started, previous.selectedNodeId])], playing: !previous.playing, times: { ...previous.times, [previous.selectedNodeId]: (previous.times[previous.selectedNodeId] || 0) >= 45 ? 0 : previous.times[previous.selectedNodeId] || 0 } })),
    visitSource: id => update(previous => ({ ...previous, sources: [...new Set([...previous.sources, id])] })),
    saveSummary: () => {
      const previous = tasks.current.get(taskId);
      if (!previous) return;
      const completed = Object.entries(deriveOfficialStatuses({ ...previous, summary: { pending: true } })).filter(([, status]) => status === "completed").map(([id]) => id);
      const summary = { id: uid("summary"), time: now(), completed, total: OFFICIAL_LEARNING_STAGES.reduce((sum, stage) => sum + stage.children.length, 0), sources: [...previous.sources], checks: [...previous.attempts], inputAttempts: [...previous.inputAttempts], sequenceAttempts: [...previous.sequenceAttempts] };
      update({ ...previous, summary, notice: "已保存本次学习记录，包含当前进度、检查与待继续项。" });
      onRecord?.({ title: "ResNet50 学习记录", summary: `${summary.completed.length}/${summary.total} 个学习动作已完成理解与对应检查；保留 ${summary.checks.length} 次理解题尝试。设备推理尚待官方实验验证。`, kind: "official-learning-summary", isDemo: true, details: summary }, taskId);
    },
    reset: () => update(() => initialOfficialProgress()),
  }), [update, taskId, onRecord]);
  return { state: { ...raw, statuses: deriveOfficialStatuses(raw), time: raw.times[raw.selectedNodeId] || 0 }, actions, inputAttempt: currentInputAttempt(raw), sequenceAttempt: currentSequenceAttempt(raw) };
}
