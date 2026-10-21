import test from "node:test";
import assert from "node:assert/strict";
import { commitLearningPath, moveLearningPathStep, proposeLearningPathChanges, resolveLearningPathChange, stepsForStage } from "./learning-path-collaboration.js";

const basePath = () => ["environment", "channels", "practice", "check"].map(id => ({ id, skipped: false }));

test("turns learner feedback into reviewable skip and add suggestions", () => {
  const result = proposeLearningPathChanges(basePath(), "我已经会 HWC→CHW，重点学 Resize、Normalization 和 NCHW 输入检查。", "proposal-1");

  assert.equal(result.changes.length, 5);
  assert.equal(stepsForStage(result.path.find(stage => stage.id === "channels")).find(step => step.id === "layout").suggestion.kind, "skip");
  assert.equal(stepsForStage(result.path.find(stage => stage.id === "practice")).find(step => step.id === "layout").suggestion.kind, "skip");
  assert.ok(stepsForStage(result.path.find(stage => stage.id === "practice")).some(step => step.id === "resize"));
  assert.ok(stepsForStage(result.path.find(stage => stage.id === "practice")).some(step => step.id === "normalize"));
  assert.ok(stepsForStage(result.path.find(stage => stage.id === "check")).some(step => step.id === "shape-check"));
  assert.equal(basePath()[1].steps, undefined, "the saved path is not mutated");
});

test("accepting or rejecting one suggestion updates only its targeted node", () => {
  const proposal = proposeLearningPathChanges(basePath(), "我已经会 HWC→CHW，重点学 Resize、Normalization 和 NCHW 输入检查。", "proposal-2");
  const skip = proposal.changes.find(change => change.kind === "skip" && change.stageId === "channels");
  const add = proposal.changes.find(change => change.stepId === "resize");
  let state = resolveLearningPathChange(proposal.path, proposal.changes, skip.id, true);
  state = resolveLearningPathChange(state.path, state.changes, add.id, false);

  const channelsLayout = stepsForStage(state.path.find(stage => stage.id === "channels")).find(step => step.id === "layout");
  const practiceSteps = stepsForStage(state.path.find(stage => stage.id === "practice"));
  assert.equal(channelsLayout.skipped, true);
  assert.equal(channelsLayout.suggestion.status, "accepted");
  assert.equal(practiceSteps.some(step => step.id === "resize"), false);
  assert.equal(state.changes.find(change => change.id === add.id).status, "rejected");
  assert.equal(state.changes.filter(change => change.status === "pending").length, 3);
});

test("manual reordering keeps child nodes within their phase and does not mutate the source", () => {
  const result = moveLearningPathStep(basePath(), "practice", "layout", "batch");
  assert.ok(result);
  assert.deepEqual(stepsForStage(result.path.find(stage => stage.id === "practice")).map(step => step.id), ["batch", "layout", "result"]);
  assert.equal(result.relation, "之后");
  assert.deepEqual(stepsForStage(basePath().find(stage => stage.id === "practice")).map(step => step.id), ["layout", "batch", "result"]);
  assert.equal(moveLearningPathStep(basePath(), "practice", "layout", "layout"), null);
});

test("reports whether a moved node lands before or after its drop target", () => {
  assert.equal(moveLearningPathStep(basePath(), "practice", "result", "layout").relation, "之前");
});

test("committing strips proposal markers while preserving the accepted path edits", () => {
  const proposal = proposeLearningPathChanges(basePath(), "重点学 Resize", "proposal-3");
  const accepted = resolveLearningPathChange(proposal.path, proposal.changes, proposal.changes[0].id, true);
  const committed = commitLearningPath(accepted.path);
  const resize = stepsForStage(committed.find(stage => stage.id === "practice")).find(step => step.id === "resize");
  assert.ok(resize);
  assert.equal(resize.suggestion, undefined);
});
