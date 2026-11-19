import assert from "node:assert/strict";
import test from "node:test";
import { migrateCanvasLayoutView } from "./learning-canvas-view-state.js";

test("migrates old canvas viewports while preserving user-moved objects", () => {
  const migrated = migrateCanvasLayoutView({
    viewport: { x: -240, y: -90, scale: 0.43 },
    positions: { hierarchy: { x: 42, y: 100 }, diagram: { x: 350, y: 100 } },
    initialized: true,
    returnViewport: { x: -20, y: -10, scale: 0.8 },
    focusViewport: { x: -200, y: -100, scale: 1.2 },
  });

  assert.equal(migrated.layoutVersion, 2);
  assert.deepEqual(migrated.viewport, { x: 0, y: 0, scale: 1 });
  assert.equal(migrated.initialized, false);
  assert.deepEqual(migrated.positions, { hierarchy: { x: 42, y: 100 }, diagram: { x: 350, y: 100 } });
  assert.equal(migrated.returnViewport, null);
  assert.equal(migrated.focusViewport, null);
});

test("keeps a current canvas viewport and initialization state", () => {
  const current = migrateCanvasLayoutView({
    layoutVersion: 2,
    viewport: { x: -120, y: -50, scale: 0.72 },
    initialized: true,
  });

  assert.deepEqual(current.viewport, { x: -120, y: -50, scale: 0.72 });
  assert.equal(current.initialized, true);
});
