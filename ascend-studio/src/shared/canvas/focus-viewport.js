const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Center one canvas object and scale it to the usable viewport without leaving the canvas. */
export function focusViewportForBounds(bounds, viewport, {
  paddingX = 24,
  paddingTop = 24,
  paddingBottom = 24,
  centerYOffset = 0,
  minScale = 0.25,
  maxScale = 1.1,
} = {}) {
  if (!bounds || !viewport || bounds.width <= 0 || bounds.height <= 0 || viewport.width <= 0 || viewport.height <= 0) return null;

  const availableWidth = Math.max(1, viewport.width - paddingX * 2);
  const availableHeight = Math.max(1, viewport.height - paddingTop - paddingBottom);
  const scale = clamp(Math.min(maxScale, availableWidth / bounds.width, availableHeight / bounds.height), minScale, maxScale);
  const centerX = viewport.width / 2;
  const centerY = paddingTop + availableHeight / 2 + centerYOffset;

  return {
    scale,
    x: centerX - (bounds.x + bounds.width / 2) * scale,
    y: centerY - (bounds.y + bounds.height / 2) * scale,
  };
}
