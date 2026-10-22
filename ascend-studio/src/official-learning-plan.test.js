import test from "node:test";
import assert from "node:assert/strict";
import { OFFICIAL_LEARNING_STAGES } from "./official-learning-data.js";
import { moveOfficialLearningStep, normalizeOfficialPersonalPlan, officialPathOrder } from "./official-learning-plan.js";

const stage = OFFICIAL_LEARNING_STAGES[0];
const first = stage.children[0].id;
const second = stage.children[1].id;
const third = stage.children[2].id;

test("official path order is copied by stable node IDs", () => {
  assert.deepEqual(officialPathOrder()[stage.id], stage.children.map(node => node.id));
});

test("personal draft reordering is limited to the same official stage", () => {
  const plan = { status: "draft", orderByStage: officialPathOrder() };
  const moved = moveOfficialLearningStep(plan, stage.id, first, third);
  assert.deepEqual(moved.orderByStage[stage.id], [second, third, first]);
  assert.deepEqual(plan.orderByStage[stage.id], [first, second, third]);
  assert.equal(moveOfficialLearningStep(plan, stage.id, first, first), null);
  assert.equal(moveOfficialLearningStep(plan, stage.id, first, OFFICIAL_LEARNING_STAGES[1].children[0].id), null);
  assert.equal(moveOfficialLearningStep({ ...plan, status: "confirmed" }, stage.id, first, third), null);
});

test("restoring a personal plan keeps valid order and appends newly added nodes", () => {
  const normalized = normalizeOfficialPersonalPlan({ status: "draft", orderByStage: { [stage.id]: [third, third, "removed-node"] } });
  assert.deepEqual(normalized.orderByStage[stage.id], [third, first, second]);
  assert.equal(normalized.status, "draft");
  assert.equal(normalizeOfficialPersonalPlan({ status: "invalid", orderByStage: {} }), null);
});
