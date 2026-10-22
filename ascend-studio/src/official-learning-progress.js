import { OFFICIAL_LEARNING_STAGES, getOfficialLearningNode } from "./official-learning-data.js";
import { normalizeOfficialPersonalPlan } from "./official-learning-plan.js";

const nodes = OFFICIAL_LEARNING_STAGES.flatMap(stage => stage.children);
const ids = new Set(nodes.map(node => node.id));
const object = value => value && typeof value === "object" && !Array.isArray(value);
const list = value => Array.isArray(value) ? value : [];
const INPUT_AXES = [2, 0, 1];
const SEQUENCE = ["load", "input", "execute", "output"];
const normalizeInputAttempt = attempt => {
  const axes = attempt.snapshot.axes;
  const batch = attempt.snapshot.batch === true;
  const valid = axes.length === 3 && new Set(axes).size === 3 && axes.every(axis => [0,1,2].includes(axis));
  return { ...attempt, snapshot:{axes:[...axes],batch}, dimensions:valid ? [...(batch ? [1] : []), ...axes.map(axis => [224,224,3][axis])] : [], passed:valid && axes.join(",") === INPUT_AXES.join(",") && batch };
};

export const initialOfficialProgress = () => ({
  version: 2, selectedNodeId: nodes[0].id, started: [], understood: [], answers: {}, checks: {}, attempts: [],
  input: { axes: [0, 1, 2], batch: false }, inputAttempts: [],
  sequence: ["load", "execute", "input", "output"], sequenceAttempts: [],
  times: {}, playing: false, sources: [], summary: null, legacyStatuses: {}, personalPlan: null, personalPlanBase: null, personalPlanUndo: [], notice: "",
});

export function restoreOfficialProgress(saved) {
  const base = initialOfficialProgress();
  if (!object(saved)) return base;
  const selected = getOfficialLearningNode(saved.selectedNodeId);
  const selectedNodeId = selected?.kind === "course" ? selected.children[0].id : selected?.id || base.selectedNodeId;
  if (saved.version !== 2) return { ...base, selectedNodeId, legacyStatuses: object(saved.statuses) ? saved.statuses : {}, started: Object.keys(saved.statuses || {}).filter(id => ids.has(id)) };
  const answers = object(saved.answers) ? Object.fromEntries(nodes.filter(node => node.checkpoint.options.some(option => option.id === saved.answers[node.id])).map(node => [node.id, saved.answers[node.id]])) : {};
  const checks = object(saved.checks) ? Object.fromEntries(nodes.filter(node => object(saved.checks[node.id]) && node.checkpoint.options.some(option => option.id === saved.checks[node.id].answer)).map(node => { const check = saved.checks[node.id]; return [node.id, { ...check, passed: check.answer === node.checkpoint.answer }]; })) : {};
  const axes = list(saved.input?.axes);
  const sequence = list(saved.sequence);
  const personalPlan = normalizeOfficialPersonalPlan(saved.personalPlan);
  const personalPlanBase = normalizeOfficialPersonalPlan(saved.personalPlanBase);
  const personalPlanUndo = list(saved.personalPlanUndo).map(item => normalizeOfficialPersonalPlan(item)).filter(Boolean).slice(-20);
  return { ...base, selectedNodeId, started: list(saved.started).filter(id => ids.has(id)), understood: list(saved.understood).filter(id => ids.has(id)), answers, checks,
    attempts: list(saved.attempts).filter(item => object(item) && ids.has(item.nodeId)).slice(-120),
    input: { axes: axes.length === 3 && axes.every(value => Number.isInteger(value) && value >= 0 && value <= 2) ? axes : base.input.axes, batch: saved.input?.batch === true },
    inputAttempts: list(saved.inputAttempts).filter(item => object(item) && Array.isArray(item.snapshot?.axes)).slice(-40).map(normalizeInputAttempt),
    sequence: sequence.length === 4 && new Set(sequence).size === 4 && sequence.every(item => base.sequence.includes(item)) ? sequence : base.sequence,
    sequenceAttempts: list(saved.sequenceAttempts).filter(item => object(item) && Array.isArray(item.snapshot)).slice(-40).map(item => ({...item, snapshot:[...item.snapshot], passed:item.snapshot.join(",") === SEQUENCE.join(",")})),
    times: object(saved.times) ? Object.fromEntries(Object.entries(saved.times).filter(([id, time]) => ids.has(id) && Number.isFinite(time)).map(([id,time]) => [id, Math.max(0, Math.min(45,time))])) : {},
    sources: list(saved.sources).filter(id => typeof id === "string"), summary: object(saved.summary) ? saved.summary : null, legacyStatuses: object(saved.legacyStatuses) ? saved.legacyStatuses : {}, personalPlan, personalPlanBase, personalPlanUndo,
  };
}

export function currentInputAttempt(state) {
  const current = list(state.inputAttempts).at(-1);
  if (!current || !object(current.snapshot) || !Array.isArray(current.snapshot.axes)) return null;
  const matches = current.snapshot.axes.length === state.input.axes.length && current.snapshot.axes.every((axis, i) => axis === state.input.axes[i]) && current.snapshot.batch === state.input.batch;
  if (!matches) return null;
  return normalizeInputAttempt(current);
}

export function currentSequenceAttempt(state) {
  const current = list(state.sequenceAttempts).at(-1);
  if (!current || !Array.isArray(current.snapshot)) return null;
  const matches = current.snapshot.length === state.sequence.length && current.snapshot.every((item, i) => item === state.sequence[i]);
  if (!matches) return null;
  return { ...current, passed: current.snapshot.join(",") === SEQUENCE.join(",") };
}

export function deriveOfficialStatuses(state) {
  const summarySaved = Boolean(state.summary);
  return Object.fromEntries(nodes.map(node => {
    const check = state.checks?.[node.id];
    const knowledgePassed = check?.answer === node.checkpoint.answer && state.answers?.[node.id] === node.checkpoint.answer;
    const practicePassed = ["preprocess", "contract"].includes(node.visual) ? currentInputAttempt(state)?.passed === true : node.visual === "execution" ? currentSequenceAttempt(state)?.passed === true : true;
    const understood = list(state.understood).includes(node.id);
    const completed = node.visual === "summary" ? summarySaved && understood && knowledgePassed : understood && knowledgePassed && practicePassed;
    return [node.id, completed ? "completed" : list(state.started).includes(node.id) || understood || state.answers?.[node.id] ? "in-progress" : "not-started"];
  }));
}
