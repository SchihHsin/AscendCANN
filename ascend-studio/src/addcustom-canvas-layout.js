const CARD_POSITIONS = {
  "task-brief": [32, 64],
  source: [32, 532],
  evidence: [32, 1080],
  reference: [32, 1548],
  explanation: [900, 64],
  parameters: [900, 632],
  attempts: [900, 1240],
  draft: [1688, 64],
  diff: [1688, 672],
  validation: [1688, 1360],
  precision: [2616, 64],
  review: [2616, 612],
};

const CARD_ORDER = Object.keys(CARD_POSITIONS);
const DYNAMIC_PARENT = { attempt: "attempts", snapshot: "diff" };

export const ADD_CUSTOM_CARD_POSITIONS = CARD_POSITIONS;
export const ADD_CUSTOM_LAYOUT_VERSION = 12;
export const ADD_CUSTOM_LAYOUT_GAP_X = 88;
export const ADD_CUSTOM_LAYOUT_GAP_Y = 48;

function cardHeight(card) {
  return card?.collapsed ? 44 : Math.max(140, Number(card?.height) || 340);
}

function overlaps(candidate, other) {
  const gap = ADD_CUSTOM_LAYOUT_GAP_X;
  const verticalGap = ADD_CUSTOM_LAYOUT_GAP_Y;
  return candidate.x < other.x + other.width + gap
    && candidate.x + candidate.width + gap > other.x
    && candidate.y < other.y + cardHeight(other) + verticalGap
    && candidate.y + cardHeight(candidate) + verticalGap > other.y;
}

function freeSpot(card, start, obstacles = []) {
  const step = cardHeight(card) + ADD_CUSTOM_LAYOUT_GAP_Y;
  for (let index = 0; index < 180; index += 1) {
    const point = { x: start.x, y: start.y + step * index };
    const candidate = { ...card, ...point };
    if (!obstacles.some((other) => other.id !== card.id && overlaps(candidate, other))) return point;
  }
  const right = Math.max(start.x, ...obstacles.map((other) => other.x + other.width + ADD_CUSTOM_LAYOUT_GAP_X));
  return { x: right, y: start.y };
}

function parentIdFor(card) {
  if (card?.parentId) return String(card.parentId);
  const id = String(card?.id || "");
  const prefix = Object.keys(DYNAMIC_PARENT).find((key) => id.startsWith(`${key}:`));
  return prefix ? DYNAMIC_PARENT[prefix] : "";
}

function relatedAnchor(card, cards = []) {
  const ids = [parentIdFor(card), ...(Array.isArray(card?.relations) ? card.relations.map((relation) => relation?.id) : [])].filter(Boolean);
  return ids.map((id) => cards.find((entry) => entry.id === id)).find(Boolean) || null;
}

function relatedStart(card, cards = []) {
  const anchor = relatedAnchor(card, cards);
  if (!anchor) return { x: 32, y: 2100 };
  const siblings = cards.filter((entry) => entry.id !== card.id && parentIdFor(entry) === parentIdFor(card));
  const lastSibling = siblings.sort((a, b) => a.y + cardHeight(a) - (b.y + cardHeight(b))).at(-1);
  const base = lastSibling || anchor;
  return { x: base.x, y: base.y + cardHeight(base) + ADD_CUSTOM_LAYOUT_GAP_Y };
}

export function reflowAddCustomCards(cards = []) {
  const byId = new Map(cards.map((card) => [card.id, { ...card }]));
  const placed = cards.filter((card) => Number.isFinite(card.x) && Number.isFinite(card.y)).map((card) => ({ ...card }));
  const unpositioned = cards.filter((card) => !Number.isFinite(card.x) || !Number.isFinite(card.y)).sort((a, b) => {
    const aOrder = CARD_ORDER.indexOf(a.id);
    const bOrder = CARD_ORDER.indexOf(b.id);
    if (aOrder !== -1 || bOrder !== -1) return (aOrder === -1 ? Number.MAX_SAFE_INTEGER : aOrder) - (bOrder === -1 ? Number.MAX_SAFE_INTEGER : bOrder);
    return String(a.id).localeCompare(String(b.id));
  });

  for (const card of unpositioned) {
    const base = CARD_POSITIONS[card.id];
    const start = base ? { x: base[0], y: base[1] } : relatedStart(card, placed);
    const point = freeSpot(card, start, placed);
    const next = { ...byId.get(card.id), ...point };
    byId.set(card.id, next);
    placed.push(next);
  }

  return cards.map((card) => byId.get(card.id) || card);
}

export function positionNewAddCustomCard(card, cards = []) {
  const base = CARD_POSITIONS[card?.id];
  const start = base ? { x: base[0], y: base[1] } : relatedStart(card, cards);
  return freeSpot(card, start, cards.filter((entry) => entry.id !== card?.id && (entry.visible || entry.opened)));
}
