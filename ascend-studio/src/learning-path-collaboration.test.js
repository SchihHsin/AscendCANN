import test from "node:test";
import assert from "node:assert/strict";
import { commitLearningPath, learningPathContextTargets, moveLearningPathStep, proposeLearningPathChanges, resolveLearningPathChange, stepsForStage, updateLearningProfileFromPrompt } from "./learning-path-collaboration.js";

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

test("turns a goal shift into a review, a reduced duplicate exercise, and two concrete nodes", () => {
  const prompt = "我会 Python，也理解 HWC 到 CHW。每天只有 15 分钟，我想从理解概念转为能核对模型的图像输入。请把熟悉的部分改成快速回顾，增加预处理顺序判断和模型输入签名核对，并把 NCHW 检查放到练习之后。";
  const initial = proposeLearningPathChanges(basePath(), "请补充图像推理前处理重点：图像尺寸调整、归一化，以及 NCHW 输入形状检查。", "initial");
  const result = proposeLearningPathChanges(initial.path, prompt, "goal-shift");
  const changes = result.changes;
  const practice = stepsForStage(result.path.find(stage => stage.id === "practice"));
  const check = stepsForStage(result.path.find(stage => stage.id === "check"));

  assert.equal(changes.length, 4);
  assert.equal(changes.find(change => change.kind === "revise").stepId, "layout");
  assert.ok(changes.some(change => change.kind === "skip" && change.stageId === "practice" && change.stepId === "layout"));
  assert.deepEqual(practice.map(step => step.id), ["layout", "batch", "resize", "normalize", "preprocess-order", "result"]);
  assert.deepEqual(check.map(step => step.id), ["input", "shape-check", "model-signature", "summary"]);
  assert.equal(stepsForStage(result.path.find(stage => stage.id === "channels")).find(step => step.id === "layout").suggestion.patch.title, "快速回顾 HWC → CHW");
});

test("an accepted quick-review edit updates only its node; rejecting it keeps the original wording", () => {
  const result = proposeLearningPathChanges(basePath(), "我会 Python，也理解 HWC 到 CHW。请把熟悉的部分改成快速回顾。", "review-edit");
  const revision = result.changes.find(change => change.kind === "revise");
  const accepted = resolveLearningPathChange(result.path, result.changes, revision.id, true);
  const rejected = resolveLearningPathChange(result.path, result.changes, revision.id, false);

  assert.equal(stepsForStage(accepted.path.find(stage => stage.id === "channels")).find(step => step.id === "layout").title, "快速回顾 HWC → CHW");
  assert.equal(stepsForStage(rejected.path.find(stage => stage.id === "channels")).find(step => step.id === "layout").title, "理解维度顺序");
});

test("updates the learner goal, known background, and daily time from the prompt", () => {
  const profile = updateLearningProfileFromPrompt({ goal: "旧目标", background: "旧基础", dailyMinutes: 20 }, "我会 Python，也理解 HWC 到 CHW。每天只有 15 分钟，我想从理解概念转为能核对模型的图像输入。");

  assert.equal(profile.goal, "能够核对模型的图像输入");
  assert.equal(profile.background, "会 Python；理解 HWC → CHW");
  assert.equal(profile.dailyMinutes, 15);
});

test("points the Agent cursor at the existing NCHW check when the learner asks to keep it after practice", () => {
  assert.deepEqual(learningPathContextTargets("把 NCHW 检查放到练习之后。"), [{ stageId: "check", stepId: "shape-check" }]);
  assert.deepEqual(learningPathContextTargets("补充模型输入签名核对。"), []);
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
  assert.equal(stepsForStage(result.path.find(stage => stage.id === "practice")).find(step => step.id === "layout").userAdjusted, true);
  assert.equal(result.relation, "之后");
  assert.deepEqual(stepsForStage(basePath().find(stage => stage.id === "practice")).map(step => step.id), ["layout", "batch", "result"]);
  assert.equal(moveLearningPathStep(basePath(), "practice", "layout", "layout"), null);
});

test("reports whether a moved node lands before or after its drop target", () => {
  assert.equal(moveLearningPathStep(basePath(), "practice", "result", "layout").relation, "之前");
});

test("supports an explicit after target for conversational path edits", () => {
  const result = moveLearningPathStep(basePath(), "practice", "layout", "result", "after");
  assert.deepEqual(stepsForStage(result.path.find(stage => stage.id === "practice")).map(step => step.id), ["batch", "result", "layout"]);
  assert.equal(result.relation, "之后");
});

test("committing strips proposal markers while preserving the accepted path edits", () => {
  const proposal = proposeLearningPathChanges(basePath(), "重点学 Resize", "proposal-3");
  const accepted = resolveLearningPathChange(proposal.path, proposal.changes, proposal.changes[0].id, true);
  const committed = commitLearningPath(accepted.path);
  const resize = stepsForStage(committed.find(stage => stage.id === "practice")).find(step => step.id === "resize");
  assert.ok(resize);
  assert.equal(resize.suggestion, undefined);
  const moved = moveLearningPathStep(proposal.path, "practice", "layout", "batch");
  assert.equal(stepsForStage(commitLearningPath(moved.path).find(stage => stage.id === "practice")).find(step => step.id === "layout").userAdjusted, undefined);
});
