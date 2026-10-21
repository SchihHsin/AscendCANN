import test from "node:test";
import assert from "node:assert/strict";
import { OFFICIAL_LEARNING_STAGES } from "./official-learning-data.js";
import { currentInputAttempt, currentSequenceAttempt, deriveOfficialStatuses, initialOfficialProgress, restoreOfficialProgress } from "./official-learning-progress.js";

const allNodes = OFFICIAL_LEARNING_STAGES.flatMap(stage => stage.children);
const node = visual => allNodes.find(item => item.visual === visual);
const prepared = (target, { answer = target.checkpoint.answer, understood = true } = {}) => {
  const state = initialOfficialProgress();
  state.started = [target.id];
  state.understood = understood ? [target.id] : [];
  state.answers[target.id] = answer;
  state.checks[target.id] = { answer, passed: answer === target.checkpoint.answer };
  return state;
};

test("v1 manual completed status is retained as history but does not complete a node", () => {
  const target = node("classification");
  const restored = restoreOfficialProgress({ version: 1, statuses: { [target.id]: "completed" } });
  assert.equal(restored.legacyStatuses[target.id], "completed");
  assert.equal(deriveOfficialStatuses(restored)[target.id], "in-progress");
});

test("restored input and sequence passed flags are recomputed from current snapshots", () => {
  const inputState = initialOfficialProgress();
  inputState.input = { axes: [2, 0, 1], batch: true };
  inputState.inputAttempts = [{ snapshot: { axes: [2, 0, 1], batch: true }, passed: false }];
  const restoredInput = restoreOfficialProgress(inputState);
  assert.equal(currentInputAttempt(restoredInput).passed, true);

  const sequenceState = initialOfficialProgress();
  sequenceState.sequence = ["load", "input", "execute", "output"];
  sequenceState.sequenceAttempts = [{ snapshot: [...sequenceState.sequence], passed: false }];
  const restoredSequence = restoreOfficialProgress(sequenceState);
  assert.equal(currentSequenceAttempt(restoredSequence).passed, true);

  restoredInput.inputAttempts[0].passed = true;
  restoredInput.input.axes = [2, 2, 1];
  restoredInput.inputAttempts[0].snapshot.axes = [2, 2, 1];
  assert.equal(currentInputAttempt(restoredInput).passed, false);
});

test("input requires unique axes in target order and batch enabled", () => {
  const state = initialOfficialProgress();
  state.input = { axes: [2, 0, 1], batch: true };
  for (const axes of [[2, 2, 1], [0, 2, 1]]) {
    state.input = { axes: [...axes], batch: true };
    state.inputAttempts = [{ snapshot: { axes, batch: true }, passed: true }];
    assert.equal(currentInputAttempt(state).passed, false);
  }
  state.input = { axes: [2, 0, 1], batch: true };
  state.inputAttempts = [{ snapshot: { axes: [2, 0, 1], batch: false }, passed: true }];
  assert.equal(currentInputAttempt(state), null);
  state.inputAttempts = [{ snapshot: { axes: [2, 0, 1], batch: true }, passed: false }];
  assert.equal(currentInputAttempt(state).passed, true);
});

test("sequence practice is judged against load, input, execute, output", () => {
  const state = initialOfficialProgress();
  state.sequence = ["load", "input", "execute", "output"];
  state.sequenceAttempts = [{ snapshot: [...state.sequence], passed: false }];
  assert.equal(currentSequenceAttempt(state).passed, true);
  state.sequence = ["load", "execute", "input", "output"];
  assert.equal(currentSequenceAttempt(state), null);
  state.sequenceAttempts = [{ snapshot: [...state.sequence], passed: true }];
  assert.equal(currentSequenceAttempt(state).passed, false);
});

test("a summary stage requires a saved summary as well as current understanding", () => {
  const target = node("summary");
  const state = prepared(target);
  assert.equal(deriveOfficialStatuses(state)[target.id], "in-progress");
  state.summary = { id: "saved" };
  assert.equal(deriveOfficialStatuses(state)[target.id], "completed");
  state.understood = [];
  assert.equal(deriveOfficialStatuses(state)[target.id], "in-progress");
});

test("current understanding, correct current answer and required current practice gate completion", () => {
  const inputNode = node("preprocess");
  const state = prepared(inputNode);
  state.input = { axes: [2, 0, 1], batch: true };
  state.inputAttempts = [{ snapshot: { axes: [2, 0, 1], batch: true }, passed: false }];
  assert.equal(deriveOfficialStatuses(state)[inputNode.id], "completed");
  state.input = { axes: [2, 1, 0], batch: true };
  assert.equal(deriveOfficialStatuses(state)[inputNode.id], "in-progress");
  state.input = { axes: [2, 0, 1], batch: true };
  state.understood = [];
  assert.equal(deriveOfficialStatuses(state)[inputNode.id], "in-progress");
  state.understood = [inputNode.id];
  state.answers[inputNode.id] = inputNode.checkpoint.options.find(option => option.id !== inputNode.checkpoint.answer).id;
  assert.equal(deriveOfficialStatuses(state)[inputNode.id], "in-progress");

  const sequenceNode = node("execution");
  const sequenceState = prepared(sequenceNode);
  sequenceState.sequence = ["load", "input", "execute", "output"];
  sequenceState.sequenceAttempts = [{ snapshot: [...sequenceState.sequence], passed: false }];
  assert.equal(deriveOfficialStatuses(sequenceState)[sequenceNode.id], "completed");
  sequenceState.sequence = ["load", "execute", "input", "output"];
  assert.equal(deriveOfficialStatuses(sequenceState)[sequenceNode.id], "in-progress");
});

test("a selected node alone does not mark it started or complete", () => {
  const state = initialOfficialProgress();
  assert.equal(deriveOfficialStatuses(state)[state.selectedNodeId], "not-started");
});

test("stage status is completed only when every child is currently complete", () => {
  const stage = OFFICIAL_LEARNING_STAGES[0];
  const state = initialOfficialProgress();
  for (const child of stage.children) {
    state.started.push(child.id);
    state.understood.push(child.id);
    state.answers[child.id] = child.checkpoint.answer;
    state.checks[child.id] = { answer: child.checkpoint.answer, passed: true };
  }
  let statuses = deriveOfficialStatuses(state);
  assert.equal(Object.values(statuses).filter(status => status === "completed").length, stage.children.length);
  assert.equal(stage.children.every(child => statuses[child.id] === "completed"), true);
  assert.equal(stage.children.some(child => child.visual === "summary"), false);

  const all = OFFICIAL_LEARNING_STAGES.flatMap(item => item.children);
  for (const child of all) {
    state.started.push(child.id);
    state.understood.push(child.id);
    state.answers[child.id] = child.checkpoint.answer;
    state.checks[child.id] = { answer: child.checkpoint.answer, passed: true };
    if (["preprocess", "contract"].includes(child.visual)) {
      state.input = { axes: [2, 0, 1], batch: true };
      state.inputAttempts = [{ snapshot: { axes: [2, 0, 1], batch: true }, passed: true }];
    }
    if (child.visual === "execution") {
      state.sequence = ["load", "input", "execute", "output"];
      state.sequenceAttempts = [{ snapshot: [...state.sequence], passed: true }];
    }
    if (child.visual === "summary") state.summary = { id: "saved" };
  }
  statuses = deriveOfficialStatuses(state);
  assert.equal(stage.children.every(child => statuses[child.id] === "completed"), true);
});

test("checking one task state does not mutate another task state", () => {
  const first = initialOfficialProgress();
  const second = initialOfficialProgress();
  const target = node("classification");
  first.understood.push(target.id);
  first.answers[target.id] = target.checkpoint.answer;
  first.checks[target.id] = { answer: target.checkpoint.answer, passed: true };
  assert.equal(deriveOfficialStatuses(first)[target.id], "completed");
  assert.equal(deriveOfficialStatuses(second)[target.id], "not-started");
  assert.deepEqual(second.understood, []);
});
