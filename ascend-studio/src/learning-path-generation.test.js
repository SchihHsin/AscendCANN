import test from "node:test";
import assert from "node:assert/strict";
import { LEARNING_NODES } from "./learning-data.js";
import { createPathGenerationDemoDraft } from "./learning-path-generation.js";
import { stepsForStage } from "./learning-path-collaboration.js";

test("the co-creation task starts with an independent, reviewable path draft", () => {
  const state = createPathGenerationDemoDraft();

  assert.equal(state.draftPath.length, LEARNING_NODES.length, "the original learning stages remain visible");
  assert.ok(state.draftPath.every(node => !node.skipped), "the original path remains unchanged in the draft");
  assert.deepEqual(state.pathChanges.map(change => change.title), [
    "图像尺寸调整",
    "归一化处理",
    "检查 NCHW 与 batch",
  ]);
  assert.ok(state.pathChanges.every(change => change.status === "pending"));
  assert.deepEqual(stepsForStage(state.draftPath.find(node => node.id === "check")).map(step => step.id), ["input", "shape-check", "summary"], "input checks follow the practice stage and precede saving the record");
});
