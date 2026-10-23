import test from "node:test";
import assert from "node:assert/strict";
import { canvasNodeKey, nodeConnector, positionTreeNodes } from "./canvas-node-position.js";

test("moving a learning node changes only its canvas coordinates and expands the drawing bounds", () => {
  const tree = {
    stages: [
      { id: "input", index: 0, rect: { x: 0, y: 0, width: 200, height: 60 }, steps: [{ id: "rgb", rect: { x: 20, y: 80, width: 180, height: 44 } }] },
      { id: "model", index: 1, rect: { x: 300, y: 0, width: 200, height: 60 }, steps: [{ id: "batch", rect: { x: 320, y: 80, width: 180, height: 44 } }] },
    ],
    width: 500,
    height: 150,
  };
  const moved = positionTreeNodes(tree, { [canvasNodeKey("step", "input", "rgb")]: { x: 620, y: 260 } }, "stages", "steps");

  assert.deepEqual(moved.stages.map(stage => stage.id), ["input", "model"]);
  assert.deepEqual(moved.stages[0].steps.map(step => step.id), ["rgb"]);
  assert.deepEqual(moved.stages[0].steps[0].rect, { x: 620, y: 260, width: 180, height: 44 });
  assert.deepEqual(moved.stages[1].rect, tree.stages[1].rect);
  assert.ok(moved.width >= 828);
  assert.ok(moved.height >= 332);
  assert.deepEqual(tree.stages[0].steps[0].rect, { x: 20, y: 80, width: 180, height: 44 });
});

test("moving a parent node preserves the learning sequence and child nodes", () => {
  const tree = {
    groups: [
      { id: "stage-a", index: 0, rect: { x: 0, y: 0, width: 200, height: 60 }, children: [{ id: "step-a", rect: { x: 20, y: 80, width: 180, height: 44 } }] },
      { id: "stage-b", index: 1, rect: { x: 300, y: 0, width: 200, height: 60 }, children: [{ id: "step-b", rect: { x: 320, y: 80, width: 180, height: 44 } }] },
    ],
    width: 500,
    height: 150,
  };
  const moved = positionTreeNodes(tree, { [canvasNodeKey("stage", "stage-a")]: { x: 100, y: 180 } }, "groups", "children");

  assert.deepEqual(moved.groups.map(group => group.id), ["stage-a", "stage-b"]);
  assert.deepEqual(moved.groups[0].rect, { x: 100, y: 180, width: 200, height: 60 });
  assert.deepEqual(moved.groups[0].children[0].rect, tree.groups[0].children[0].rect);
  assert.deepEqual(moved.groups[1], tree.groups[1]);
});

test("node connectors recompute their route from the current node rectangles", () => {
  assert.equal(nodeConnector(
    { x: 0, y: 0, width: 100, height: 40 },
    { x: 200, y: 80, width: 100, height: 40 },
  ), "M100,20 H150 V100 H200");
  assert.equal(nodeConnector(
    { x: 40, y: 0, width: 80, height: 40 },
    { x: 50, y: 100, width: 80, height: 40 },
  ), "M80,40 V70 H90 V100");
});
