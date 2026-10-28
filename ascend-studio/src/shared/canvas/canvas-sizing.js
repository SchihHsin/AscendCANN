import { normalizeCanvasNode } from "./node-semantics.js";

// Shared canvas dimensions are expressed in logical canvas pixels, before zoom.
export const MAX_CONTENT_CARD_HEIGHT = 760;
export const CANVAS_CARD_GAP_X = 32;
export const CANVAS_CARD_GAP_Y = 32;

const CARD_PROFILES = Object.freeze({
  summary: Object.freeze({ width: 700, height: 360, minWidth: 600, maxWidth: 880, minHeight: 260 }),
  diagram: Object.freeze({ width: 700, height: 380, minWidth: 600, maxWidth: 880, minHeight: 280 }),
  interactive: Object.freeze({ width: 700, height: 380, minWidth: 600, maxWidth: 880, minHeight: 280 }),
  code: Object.freeze({ width: 760, height: 420, minWidth: 640, maxWidth: 920, minHeight: 320 }),
  document: Object.freeze({ width: 760, height: 420, minWidth: 640, maxWidth: 920, minHeight: 300 }),
  video: Object.freeze({ width: 760, height: 420, minWidth: 640, maxWidth: 920, minHeight: 320 }),
  diff: Object.freeze({ width: 800, height: 440, minWidth: 680, maxWidth: 960, minHeight: 360 }),
  note: Object.freeze({ width: 640, height: 360, minWidth: 480, maxWidth: 800, minHeight: 240 }),
  drawing: Object.freeze({ width: 640, height: 420, minWidth: 480, maxWidth: 800, minHeight: 280 }),
});

const CONTENT_PROFILE = Object.freeze({
  code: "code",
  document: "document",
  diagram: "diagram",
  video: "video",
  diff: "diff",
  checklist: "summary",
  note: "note",
  drawing: "drawing",
  summary: "summary",
  lesson: "diagram",
  interactive: "interactive",
});

export function canvasCardProfile(card = {}, domain) {
  const semantic = normalizeCanvasNode(card, domain);
  const contentType = semantic?.contentType || (card.kind === "drawing" ? "drawing" : card.kind === "note" ? "note" : "summary");
  const profileId = CONTENT_PROFILE[contentType] || "summary";
  return { ...CARD_PROFILES[profileId], maxHeight: MAX_CONTENT_CARD_HEIGHT, profileId };
}

export function canvasCardDefaultSize(card = {}, domain) {
  const { width, height } = canvasCardProfile(card, domain);
  return [width, height];
}

export function canvasCardContentHeight(card = {}, measuredHeight, domain) {
  const profile = canvasCardProfile(card, domain);
  const measured = Number.isFinite(measuredHeight) ? Math.ceil(measuredHeight) : profile.height;
  return Math.min(profile.maxHeight, Math.max(profile.height, measured));
}

export function canvasCardIsResizableContent(card = {}, domain) {
  const semantic = normalizeCanvasNode(card, domain || card.domain);
  return !["note", "drawing"].includes(semantic?.contentType || card.kind);
}

function visibleHeight(card) {
  return card?.collapsed ? 44 : Math.max(140, Number(card?.height) || 340);
}

function overlaps(candidate, other) {
  return candidate.x < other.x + other.width + CANVAS_CARD_GAP_X
    && candidate.x + candidate.width + CANVAS_CARD_GAP_X > other.x
    && candidate.y < other.y + visibleHeight(other) + CANVAS_CARD_GAP_Y
    && candidate.y + visibleHeight(candidate) + CANVAS_CARD_GAP_Y > other.y;
}

/**
 * Repack only automatically positioned visible cards after a content-sized
 * card changes height. Their saved origins remain stable, so shrinking content
 * naturally restores the original arrangement. User moved, resized or pinned
 * cards keep their position and act as fixed obstacles.
 */
export function reflowContentCards(cards = []) {
  const visible = cards.filter(card => card.visible);
  const fixed = visible.filter(card => card.positionMode === "manual" || card.pinned);
  const automatic = visible.filter(card => card.positionMode !== "manual" && !card.pinned)
    .sort((a, b) => (a.layoutOriginY ?? a.y) - (b.layoutOriginY ?? b.y)
      || (a.layoutOriginX ?? a.x) - (b.layoutOriginX ?? b.x)
      || String(a.id).localeCompare(String(b.id)));
  const placed = [...fixed];
  const positions = new Map();

  for (const card of automatic) {
    const origin = {
      x: Number.isFinite(card.layoutOriginX) ? card.layoutOriginX : card.x,
      y: Number.isFinite(card.layoutOriginY) ? card.layoutOriginY : card.y,
    };
    const candidate = { ...card, ...origin };
    let attempts = 0;
    while (placed.some(other => overlaps(candidate, other)) && attempts < 240) {
      const collisions = placed.filter(other => overlaps(candidate, other));
      candidate.y = Math.max(...collisions.map(other => other.y + visibleHeight(other) + CANVAS_CARD_GAP_Y));
      attempts += 1;
    }
    if (attempts >= 240) {
      candidate.x = Math.max(candidate.x, ...placed.map(other => other.x + other.width + CANVAS_CARD_GAP_X));
      candidate.y = origin.y;
    }
    positions.set(card.id, { x: candidate.x, y: candidate.y });
    placed.push(candidate);
  }

  return cards.map(card => {
    const point = positions.get(card.id);
    return point ? { ...card, ...point } : card;
  });
}
