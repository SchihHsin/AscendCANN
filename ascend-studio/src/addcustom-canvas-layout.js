const GROUPS = [
  { id: "context", label: "现场与来源", x: 32, y: 64 },
  { id: "analysis", label: "理解与试算", x: 900, y: 64 },
  { id: "change", label: "修改与核对", x: 1688, y: 64 },
  { id: "precision", label: "输出误差与复核", x: 2616, y: 64 },
];

const CARD_GROUP = {
  source: "context",
  evidence: "context",
  reference: "context",
  "task-brief": "context",
  explanation: "analysis",
  parameters: "analysis",
  attempts: "analysis",
  draft: "change",
  diff: "change",
  validation: "change",
  precision: "precision",
  review: "precision",
};

const GROUP_ALIASES = {
  context: "context",
  reference: "context",
  analysis: "analysis",
  change: "change",
  precision: "precision",
};

const CARD_ORDER = {
  "task-brief": 10,
  source: 20,
  evidence: 30,
  reference: 40,
  explanation: 10,
  parameters: 20,
  attempts: 30,
  draft: 10,
  diff: 20,
  validation: 30,
  precision: 10,
  review: 20,
};

const GROUP_BY_ID = new Map(GROUPS.map((group) => [group.id, group]));

export const ADD_CUSTOM_LAYOUT_GROUPS = GROUPS;
export const ADD_CUSTOM_LAYOUT_VERSION = 11;
export const ADD_CUSTOM_LAYOUT_GAP_X = 88;
export const ADD_CUSTOM_LAYOUT_GAP_Y = 48;

export function addCustomGroupKey(cardOrId = {}) {
  const card = typeof cardOrId === "string" ? { id: cardOrId } : cardOrId;
  const id = String(card?.id || "");
  const parentId = String(card?.parentId || "");
  const explicit = card?.groupId;
  if (GROUP_ALIASES[explicit]) return GROUP_ALIASES[explicit];
  const parentGroup = parentId ? (CARD_GROUP[parentId] || (parentId.startsWith("attempt:") ? "analysis" : parentId.startsWith("snapshot:") || parentId.startsWith("record:") ? "change" : "")) : "";
  if (explicit === "range") return CARD_GROUP[id] || parentGroup || (id.startsWith("attempt:") ? "analysis" : "change");
  if (CARD_GROUP[id]) return CARD_GROUP[id];
  if (parentGroup) return parentGroup;
  if (id.startsWith("attempt:")) return "analysis";
  if (id.startsWith("snapshot:")) return "change";
  if (id.startsWith("record:")) {
    return "change";
  }
  if (parentId) return CARD_GROUP[parentId] || "change";
  if (explicit === "range") return "analysis";
  return "change";
}

function orderFor(card) {
  const id = String(card?.id || "");
  if (Number.isFinite(card?.layoutOrder)) return card.layoutOrder;
  if (Number.isFinite(CARD_ORDER[id])) return CARD_ORDER[id];
  if (id.startsWith("attempt:")) return 35;
  if (id.startsWith("snapshot:")) return 35;
  return 50;
}

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

function freeSpot(card, start, obstacles) {
  const step = cardHeight(card) + ADD_CUSTOM_LAYOUT_GAP_Y;
  for (let index = 0; index < 180; index += 1) {
    const point = { x: start.x, y: start.y + step * index };
    if (!obstacles.some((other) => other.id !== card.id && overlaps(pointWithSize(card, point), other))) return point;
  }
  const right = Math.max(start.x, ...obstacles.map((other) => other.x + other.width + ADD_CUSTOM_LAYOUT_GAP_X));
  return { x: right, y: start.y };
}

function pointWithSize(card, point) {
  return { ...card, x: point.x, y: point.y };
}

function laneMembers(cards, groupId, id) {
  return cards.filter((card) => card.id !== id && addCustomGroupKey(card) === groupId && (card.visible || card.opened));
}

export function reflowAddCustomCards(cards = []) {
  const byId = new Map(cards.map((card) => [card.id, { ...card }]));
  const placed = cards.filter((card) => card.pinned).map((card) => ({ ...card }));

  for (const group of GROUPS) {
    const members = cards
      .filter((card) => !card.pinned && addCustomGroupKey(card) === group.id)
      .sort((a, b) => orderFor(a) - orderFor(b) || String(a.id).localeCompare(String(b.id)));
    let cursorY = group.y;
    for (const card of members) {
      const point = freeSpot(card, { x: group.x, y: cursorY }, placed);
      const next = { ...byId.get(card.id), ...point };
      byId.set(card.id, next);
      placed.push(next);
      cursorY = point.y + cardHeight(card) + ADD_CUSTOM_LAYOUT_GAP_Y;
    }
  }

  return cards.map((card) => byId.get(card.id) || card);
}

export function positionNewAddCustomCard(card, cards = []) {
  const groupId = addCustomGroupKey(card);
  const group = GROUP_BY_ID.get(groupId) || GROUPS[2];
  const relationIds = [card.parentId, ...(Array.isArray(card.relations) ? card.relations.map((relation) => relation?.id) : [])].filter(Boolean);
  const anchor = relationIds.map((id) => cards.find((entry) => entry.id === id && (entry.visible || entry.opened))).find(Boolean);
  const lane = laneMembers(cards, groupId, card.id).sort((a, b) => orderFor(a) - orderFor(b) || String(a.id).localeCompare(String(b.id)));
  const sameGroupAnchor = anchor && addCustomGroupKey(anchor) === groupId ? anchor : null;
  const earlier = lane.filter((entry) => orderFor(entry) <= orderFor(card));
  const predecessor = earlier.at(-1);
  const start = sameGroupAnchor
    ? { x: group.x, y: sameGroupAnchor.y + cardHeight(sameGroupAnchor) + ADD_CUSTOM_LAYOUT_GAP_Y }
    : predecessor
      ? { x: group.x, y: predecessor.y + cardHeight(predecessor) + ADD_CUSTOM_LAYOUT_GAP_Y }
      : { x: group.x, y: group.y };
  return freeSpot(card, start, cards.filter((entry) => entry.id !== card.id && (entry.visible || entry.opened)));
}
