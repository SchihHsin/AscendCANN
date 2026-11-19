const MIN_SCALE = 0.25;
const MAX_SCALE = 1.6;
export const CANVAS_LAYOUT_VERSION = 2;

const finite = value => typeof value === "number" && Number.isFinite(value);
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const validId = value => typeof value === "string" && /^[A-Za-z0-9][\w:.-]{0,119}$/u.test(value);

export function viewport(value, fallback = { x: 0, y: 0, scale: 1 }, minScale = MIN_SCALE) {
  const candidate = object(value) ? value : {};
  return {
    x: finite(candidate.x) ? candidate.x : fallback.x,
    y: finite(candidate.y) ? candidate.y : fallback.y,
    scale: finite(candidate.scale) ? Math.min(MAX_SCALE, Math.max(minScale, candidate.scale)) : fallback.scale,
  };
}

function positions(value) {
  if (!object(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id, point]) =>
    validId(id) && object(point) && finite(point.x) && finite(point.y),
  ).map(([id, point]) => [id, { x: point.x, y: point.y }]));
}

export function layoutView(value, minScale = MIN_SCALE) {
  const saved = object(value) ? value : {};
  return {
    layoutVersion: Number.isInteger(saved.layoutVersion) ? saved.layoutVersion : 0,
    viewport: viewport(saved.viewport, undefined, minScale),
    positions: positions(saved.positions),
    initialized: saved.initialized === true,
    canvasSize: object(saved.canvasSize) && finite(saved.canvasSize.width) && finite(saved.canvasSize.height) ? saved.canvasSize : null,
    returnViewport: object(saved.returnViewport) ? viewport(saved.returnViewport, undefined, minScale) : null,
    focusViewport: object(saved.focusViewport) ? viewport(saved.focusViewport, undefined, minScale) : null,
  };
}

export function migrateCanvasLayoutView(value, minScale = MIN_SCALE) {
  const view = layoutView(value, minScale);
  if (view.layoutVersion >= CANVAS_LAYOUT_VERSION) return view;
  return {
    ...view,
    layoutVersion: CANVAS_LAYOUT_VERSION,
    viewport: { x: 0, y: 0, scale: 1 },
    initialized: false,
    returnViewport: null,
    focusViewport: null,
  };
}

export function freshLayoutView() {
  return { ...layoutView(), layoutVersion: CANVAS_LAYOUT_VERSION };
}
