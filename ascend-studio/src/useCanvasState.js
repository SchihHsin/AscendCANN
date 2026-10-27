import { useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";
import { ADD_CUSTOM_CARD_POSITIONS, ADD_CUSTOM_LAYOUT_VERSION, positionNewAddCustomCard, reflowAddCustomCards } from "./addcustom-canvas-layout";
import { MAX_CONTENT_CARD_HEIGHT } from "./shared/canvas/canvas-sizing.js";

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 1.5;
const FIT_PADDING = 28;
const ADD_CUSTOM_FIT_PADDING = 36;

const ADD_CUSTOM_CANVAS_VERSION = ADD_CUSTOM_LAYOUT_VERSION;
const ADD_CUSTOM_CARD_SIZES = {
  explanation: [700, 520], source: [780, 500], evidence: [700, 420], precision: [700, 500],
  review: [700, 520], draft: [700, 560], parameters: [700, 560], attempts: [700, 560],
  diff: [840, 640], validation: [700, 560], reference: [700, 520], "task-brief": [700, 420], note: [600, 360], "drawing-card": [640, 420],
};
const ADD_CUSTOM_DYNAMIC_CARD_SIZES = {
  attempt: [680, 520], snapshot: [660, 480], record: [620, 420],
};
const addCustomPosition = (id) => {
  const [x, y] = ADD_CUSTOM_CARD_POSITIONS[id] || [32, 64];
  return { x, y };
};
const ADD_CUSTOM_CARD_LIMITS = {
  note: { minWidth: 480, maxWidth: 800, minHeight: 240, maxHeight: 560 },
  explanation: { minWidth: 520, maxWidth: 840, minHeight: 320, maxHeight: 680 },
  code: { minWidth: 560, maxWidth: 880, minHeight: 500, maxHeight: 760 },
  result: { minWidth: 520, maxWidth: 840, minHeight: 300, maxHeight: 680 },
  diff: { minWidth: 620, maxWidth: 960, minHeight: 400, maxHeight: 760 },
  attempt: { minWidth: 600, maxWidth: 840, minHeight: 400, maxHeight: 680 },
  snapshot: { minWidth: 560, maxWidth: 840, minHeight: 320, maxHeight: 640 },
};
const ADD_CUSTOM_CARD_CATEGORY = {
  explanation: "explanation", source: "code", evidence: "note", precision: "result", review: "result",
  draft: "code", parameters: "explanation", attempts: "result", diff: "diff", validation: "result", note: "note",
};
const isAddCustomStorageKey = (key) => typeof key === "string" && /^canvas-addcustom(?:-|$)/.test(key);
const LEGACY_CARD_SIZES = {
  explanation: [[300, 450], [360, 340], [560, 520], [620, 520]], source: [[230, 390], [440, 350], [620, 610], [620, 460], [720, 460], [780, 460]], evidence: [[395, 270], [560, 390], [560, 420], [620, 420]],
  precision: [[430, 390], [560, 500], [640, 500]], review: [[430, 340], [600, 520], [640, 520]], draft: [[430, 440], [560, 560], [640, 560]], parameters: [[340, 310], [560, 560], [640, 560]],
  attempts: [[340, 350], [560, 560], [640, 560]], diff: [[500, 550], [680, 640], [760, 640]], validation: [[500, 390], [560, 560], [640, 560]],
};
const LEGACY_CARD_POSITIONS = {
  explanation: [[660, 28], [772, 28]], source: [[28, 28]], evidence: [[52, 448], [72, 408], [28, 670], [28, 548]],
  precision: [[660, 568], [772, 572]], review: [[28, 1088], [28, 992]], draft: [[660, 1088], [772, 1096]], parameters: [[28, 1640], [28, 1536]],
  attempts: [[660, 1680], [772, 1680]], diff: [[28, 2230], [28, 2120]], validation: [[740, 2280], [812, 2264]],
};

function addCustomCardLimits(id) {
  if (id.startsWith("drawing-card:")) return ADD_CUSTOM_CARD_LIMITS.note;
  if (id.startsWith("note:")) return ADD_CUSTOM_CARD_LIMITS.note;
  if (id.startsWith("attempt:")) return ADD_CUSTOM_CARD_LIMITS.attempt;
  if (id.startsWith("snapshot:")) return ADD_CUSTOM_CARD_LIMITS.snapshot;
  const category = ADD_CUSTOM_CARD_CATEGORY[id]
    || (id.startsWith("record:") ? "note" : "result");
  return ADD_CUSTOM_CARD_LIMITS[category];
}

function addCustomDefaultCardSize(id) {
  if (ADD_CUSTOM_CARD_SIZES[id]) return ADD_CUSTOM_CARD_SIZES[id];
  if (id.startsWith("drawing-card:")) return ADD_CUSTOM_CARD_SIZES["drawing-card"];
  if (id.startsWith("note:")) return ADD_CUSTOM_CARD_SIZES.note;
  if (id.startsWith("attempt:")) return ADD_CUSTOM_DYNAMIC_CARD_SIZES.attempt;
  if (id.startsWith("snapshot:")) return ADD_CUSTOM_DYNAMIC_CARD_SIZES.snapshot;
  if (id.startsWith("record:")) return ADD_CUSTOM_DYNAMIC_CARD_SIZES.record;
  return null;
}

function isLegacyDynamicCardSize(card) {
  if (["reference", "task-brief"].includes(card.id)) return card.width === 520 && card.height === 300;
  const isAttempt = card.id.startsWith("attempt:");
  const isSnapshot = card.id.startsWith("snapshot:");
  const isRecord = card.id.startsWith("record:");
  if (isAttempt) return card.width === 520 && [320, 340, 390].includes(card.height);
  if (isSnapshot) return card.width === 520 && [320, 340, 390].includes(card.height);
  if (isRecord) return card.width === 480 && [300, 320, 340].includes(card.height);
  return false;
}

function clampAddCustomCardSize(id, width, height) {
  const limits = addCustomCardLimits(id);
  return {
    width: Math.min(limits.maxWidth, Math.max(limits.minWidth, width)),
    height: Math.min(limits.maxHeight, Math.max(limits.minHeight, height)),
  };
}

const initialCards = (startEmpty = false, initialVisibleIds = []) => [
  { id: "task-brief", title: "问题现场", ...addCustomPosition("task-brief"), width: 700, height: 420, pinned: false, visible: false, selected: false },
  { id: "source", title: "索引范围示例", ...addCustomPosition("source"), width: 780, height: 500, pinned: false, visible: true, selected: false },
  { id: "evidence", title: "现场与判断", ...addCustomPosition("evidence"), width: 700, height: 420, pinned: false, visible: true, selected: false },
  { id: "reference", title: "Ascend C 文档", ...addCustomPosition("reference"), width: 700, height: 520, pinned: false, visible: false, selected: false },
  { id: "explanation", title: "线索解释", ...addCustomPosition("explanation"), width: 700, height: 520, pinned: false, visible: false, selected: false },
  { id: "parameters", title: "参数与范围策略", ...addCustomPosition("parameters"), width: 700, height: 560, pinned: false, visible: false, selected: false },
  { id: "attempts", title: "尝试记录", ...addCustomPosition("attempts"), width: 700, height: 560, pinned: false, visible: false, selected: false },
  { id: "draft", title: "示例工作副本", ...addCustomPosition("draft"), width: 700, height: 560, pinned: false, visible: false, selected: false },
  { id: "diff", title: "示例修改预览", ...addCustomPosition("diff"), width: 840, height: 640, pinned: false, visible: false, selected: false },
  { id: "validation", title: "示例范围复核", ...addCustomPosition("validation"), width: 700, height: 560, pinned: false, visible: false, selected: false },
  { id: "precision", title: "误差核对", ...addCustomPosition("precision"), width: 700, height: 500, pinned: false, visible: false, selected: false },
  { id: "review", title: "复核记录", ...addCustomPosition("review"), width: 700, height: 520, pinned: false, visible: false, selected: false },
].map((card) => {
  const visible = startEmpty ? initialVisibleIds.includes(card.id) : card.visible;
  return { ...card, visible, selected: visible && card.id === initialVisibleIds[0], collapsed: false, opened: visible };
});

const initialState = (startEmpty = false, cardDefinitions, initialVisibleIds = []) => {
  const cards = (cardDefinitions ? cardDefinitions.map((card, index) => ({ x: 28 + (index % 2) * 450, y: 28 + Math.floor(index / 2) * 390, width: 420, height: 360, pinned: false, visible: false, selected: false, collapsed: false, opened: false, ...card })) : initialCards(startEmpty, initialVisibleIds)).map(card => ({
    ...card,
    sizeMode: card.sizeMode || (["note", "drawing"].includes(card.kind) ? "manual" : "content"),
    baseHeight: isFiniteNumber(card.baseHeight) ? card.baseHeight : card.height,
  }));
  const selectedCardId = cards.find((card) => card.visible)?.id || null;
  return {
  layoutVersion: ADD_CUSTOM_CANVAS_VERSION,
  cards,
  drawings: [],
  selectedCardId,
  lastHiddenId: null,
  comparing: false,
  viewport: { x: 0, y: 0, zoom: 1 },
  };
};

function restoreCanvasState(saved, startEmpty, cardDefinitions, initialVisibleIds, storageKey) {
  if (!saved || !Array.isArray(saved.cards) || !saved.viewport) return initialState(startEmpty, cardDefinitions, initialVisibleIds);
  const defaults = initialState(startEmpty, cardDefinitions, initialVisibleIds);
  let base = { ...defaults, ...saved };
  if (isAddCustomStorageKey(storageKey)) {
    const defaultIds = new Set(defaults.cards.map((card) => card.id));
    const savedById = new Map(saved.cards.map((card) => [card.id, card]));
    const cards = [
      ...defaults.cards.map((card) => ({ ...card, ...(savedById.get(card.id) || {}) })),
      ...saved.cards.filter((card) => !defaultIds.has(card.id)),
    ];
    base = { ...base, cards };
  }
  const savedById = new Map(saved.cards.map(card => [card.id, card]));
  const defaultsById = new Map(defaults.cards.map(card => [card.id, card]));
  base = { ...base, cards: base.cards.map(card => {
    const stored = savedById.get(card.id);
    const defaultCard = defaultsById.get(card.id);
    const targetSize = isAddCustomStorageKey(storageKey) ? addCustomDefaultCardSize(card.id) : null;
    const knownAddCustomSizes = [targetSize, ...(LEGACY_CARD_SIZES[card.id] || [])].filter(Boolean);
    const matchesKnownSize = isAddCustomStorageKey(storageKey)
      ? knownAddCustomSizes.some(([width, height]) => card.width === width && card.height === height) || isLegacyDynamicCardSize(card)
      : Boolean(defaultCard && card.width === defaultCard.width && card.height === defaultCard.height);
    const sizeMode = stored?.sizeMode || (["note", "drawing"].includes(card.kind) ? "manual" : matchesKnownSize ? "content" : "manual");
    const defaultHeight = targetSize?.[1] || defaultCard?.height || card.height;
    return {
      ...card,
      sizeMode,
      baseHeight: isFiniteNumber(stored?.baseHeight) ? stored.baseHeight : sizeMode === "content" ? defaultHeight : card.height,
    };
  }) };
  if (!isAddCustomStorageKey(storageKey) || Number(saved.layoutVersion) >= ADD_CUSTOM_CANVAS_VERSION) return base;
  const cards = base.cards.map(card => {
    const target = addCustomDefaultCardSize(card.id);
    const legacySizes = LEGACY_CARD_SIZES[card.id] || [];
    const legacyPositions = LEGACY_CARD_POSITIONS[card.id] || [];
    const targetPosition = ADD_CUSTOM_CARD_POSITIONS[card.id];
    const matchesOldDefault = legacySizes.some(([width, height]) => card.width === width && card.height === height);
    const matchesLegacyDynamicDefault = isLegacyDynamicCardSize(card);
    const matchesOldPosition = legacyPositions.some(([x, y]) => card.x === x && card.y === y);
    return {
      ...card,
      ...(target && (matchesOldDefault || matchesLegacyDynamicDefault) && !card.pinned ? { width: target[0], height: target[1] } : {}),
      ...(targetPosition && matchesOldPosition && !card.pinned ? { x: targetPosition[0], y: targetPosition[1] } : {}),
    };
  });
  return { ...base, layoutVersion: ADD_CUSTOM_CANVAS_VERSION, cards: reflowAddCustomCards(cards) };
}

const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
const visibleHeight = (card) => card.collapsed ? 48 : card.height;

function freePosition(card, obstacles) {
  for (let index = 0; index < 240; index += 1) {
    const x = card.x + (index % 6) * (card.width + 24);
    const y = card.y + Math.floor(index / 6) * (visibleHeight(card) + 24);
    const collides = obstacles.some((other) => other.visible && other.id !== card.id &&
      x < other.x + other.width + 16 && x + card.width + 16 > other.x &&
      y < other.y + visibleHeight(other) + 16 && y + visibleHeight(card) + 16 > other.y);
    if (!collides) return { x, y };
  }
  const right = Math.max(card.x, ...obstacles.filter((other) => other.visible).map((other) => other.x + other.width));
  return { x: right + 24, y: card.y };
}

function fittedViewport(cards, width, height, ids = null, padding = FIT_PADDING, drawings = []) {
  const included = ids ? new Set(ids) : null;
  const visible = cards.filter((card) => card.visible && (!included || included.has(card.id)));
  const points = included ? [] : drawings.filter(drawing => !drawing.cardId).flatMap((drawing) => drawing.points || []);
  if (!visible.length && !points.length) return { x: 0, y: 0, zoom: 1 };
  const left = Math.min(...visible.map((card) => card.x), ...points.map((point) => point.x));
  const top = Math.min(...visible.map((card) => card.y), ...points.map((point) => point.y));
  const right = Math.max(...visible.map((card) => card.x + card.width), ...points.map((point) => point.x));
  const bottom = Math.max(...visible.map((card) => card.y + visibleHeight(card)), ...points.map((point) => point.y));
  const contentWidth = Math.max(1, right - left);
  const contentHeight = Math.max(1, bottom - top);
  const zoom = clampZoom(Math.min(
    Math.max(1, width - padding * 2) / contentWidth,
    Math.max(1, height - padding * 2) / contentHeight,
  ));
  return {
    x: width / 2 - (left + contentWidth / 2) * zoom,
    y: height / 2 - (top + contentHeight / 2) * zoom,
    zoom,
  };
}

function bringToFront(cards, id) {
  const selected = cards.find((card) => card.id === id);
  if (!selected) return cards;
  return [...cards.filter((card) => card.id !== id).map((card) => ({ ...card, selected: false })), { ...selected, selected: true }];
}

export function useCanvasState({ startEmpty = false, cardDefinitions, initialVisibleIds = [], storageKey = "canvas" } = {}) {
  const [state, setState] = useState(() => ({ ...restoreCanvasState(readSession(storageKey, null), startEmpty, cardDefinitions, initialVisibleIds, storageKey), comparing: false }));
  const current = useRef(state);
  const surfaceSize = useRef(null);
  const hiddenHistory = useRef([]);
  const placedCards = useRef(new Set(state.cards.filter(card => card.opened).map(card => card.id)));
  const comparisonSnapshot = useRef(null);
  const activeStorageKey = useRef(storageKey);
  const taskContexts = useRef(new Map());
  if (activeStorageKey.current !== storageKey) {
    taskContexts.current.set(activeStorageKey.current, { state: current.current, hidden: hiddenHistory.current, placed: placedCards.current, comparison: comparisonSnapshot.current });
    const cached = taskContexts.current.get(storageKey);
    const saved = readSession(storageKey, null);
    current.current = cached?.state || { ...restoreCanvasState(saved, startEmpty, cardDefinitions, initialVisibleIds, storageKey), comparing: false };
    hiddenHistory.current = cached?.hidden || [];
    placedCards.current = cached?.placed || new Set(current.current.cards.filter(card => card.opened).map(card => card.id));
    comparisonSnapshot.current = cached?.comparison || null;
    activeStorageKey.current = storageKey;
  }
  const lastHidden = (cards) => hiddenHistory.current.findLast((id) => cards.some((card) => card.id === id && !card.visible)) || null;

  const update = (change) => {
    const previous = current.current;
    const next = { ...previous, ...(typeof change === "function" ? change(previous) : change) };
    current.current = next;
    writeSession(storageKey, next);
    setState(next);
  };

  const showCard = (id, options = {}) => {
    let card = current.current.cards.find((item) => item.id === id);
    if (!card) return;
    if (!placedCards.current.has(id) && !card.pinned) {
      const position = isAddCustomStorageKey(storageKey)
        ? positionNewAddCustomCard(card, current.current.cards)
        : freePosition(card, current.current.cards);
      card = { ...card, ...position };
    }
    placedCards.current.add(id);
    hiddenHistory.current = hiddenHistory.current.filter((item) => item !== id);
    const cards = bringToFront(current.current.cards.map((item) => item.id === id ? { ...card, visible: true, opened: true, collapsed: typeof options.collapsed === "boolean" ? options.collapsed : card.collapsed } : item), id);
    const size = surfaceSize.current;
    const focusZoom = size ? clampZoom(Math.min(1, Math.max(1, size.width - 40) / card.width, Math.max(1, size.height - 110) / visibleHeight(card))) : current.current.viewport.zoom;
    const viewport = size && options.focus !== false ? {
      zoom: focusZoom,
      x: size.width / 2 - (card.x + card.width / 2) * focusZoom,
      y: (size.height - 70) / 2 - (card.y + visibleHeight(card) / 2) * focusZoom,
    } : current.current.viewport;
    update({ cards, selectedCardId: id, lastHiddenId: lastHidden(cards), viewport });
  };
  const addCard = (definition = {}, options = {}) => {
    const id = typeof definition.id === "string" ? definition.id.trim() : "";
    if (!id) return;
    if (current.current.cards.some((card) => card.id === id)) { showCard(id, options); return; }
    const anchor = current.current.cards.find((card) => card.id === current.current.selectedCardId) || current.current.cards.filter((card) => card.visible).at(-1);
    const card = {
      ...definition,
      id,
      title: typeof definition.title === "string" && definition.title.trim() ? definition.title.trim() : "任务内容",
      x: isFiniteNumber(definition.x) ? definition.x : anchor ? anchor.x + anchor.width + 24 : 28,
      y: isFiniteNumber(definition.y) ? definition.y : anchor ? anchor.y + 24 : 28,
      width: Math.max(220, isFiniteNumber(definition.width) ? definition.width : 420),
      height: Math.max(140, isFiniteNumber(definition.height) ? definition.height : 300),
      ...(isAddCustomStorageKey(storageKey) && addCustomDefaultCardSize(id) ? { width: addCustomDefaultCardSize(id)[0], height: addCustomDefaultCardSize(id)[1] } : {}),
      pinned: Boolean(definition.pinned),
      visible: true,
      opened: true,
      selected: false,
      collapsed: Boolean(definition.collapsed),
      sizeMode: definition.sizeMode || (["note", "drawing"].includes(definition.kind) ? "manual" : "content"),
      baseHeight: isFiniteNumber(definition.baseHeight) ? definition.baseHeight : Math.max(140, isFiniteNumber(definition.height) ? definition.height : 300),
    };
    if (isAddCustomStorageKey(storageKey)) Object.assign(card, clampAddCustomCardSize(id, card.width, card.height));
    update((previous) => ({ cards: [...previous.cards, card] }));
    showCard(id, options);
  };
  const hideCard = (id) => {
    const card = current.current.cards.find((item) => item.id === id);
    if (!card?.visible) return;
    hiddenHistory.current = [...hiddenHistory.current.filter((item) => item !== id), id];
    update((previous) => ({
      cards: previous.cards.map((item) => item.id === id ? { ...item, visible: false, selected: false } : item),
      selectedCardId: previous.selectedCardId === id ? null : previous.selectedCardId,
      lastHiddenId: id,
    }));
  };
  const deleteCard = (id) => {
    if (!current.current.cards.some(card => card.id === id)) return;
    hiddenHistory.current = hiddenHistory.current.filter(item => item !== id);
    placedCards.current.delete(id);
    update(previous => {
      const cards = previous.cards.filter(card => card.id !== id);
      const selectedCardId = previous.selectedCardId === id ? cards.findLast(card => card.visible)?.id || null : previous.selectedCardId;
      return {
        cards,
        drawings: (previous.drawings || []).filter(drawing => drawing.cardId !== id),
        selectedCardId,
        lastHiddenId: previous.lastHiddenId === id ? lastHidden(cards) : previous.lastHiddenId,
      };
    });
  };
  const updateCard = (id, patch) => {
    if (!current.current.cards.some((card) => card.id === id) || !patch || typeof patch !== "object") return;
    update((previous) => ({ cards: previous.cards.map((card) => card.id === id ? { ...card, ...patch } : card) }));
  };
  const addDrawing = (drawing = {}) => {
    const points = Array.isArray(drawing.points) ? drawing.points.filter((point) => isFiniteNumber(point?.x) && isFiniteNumber(point?.y)) : [];
    const cardId = typeof drawing.cardId === "string" ? drawing.cardId : null;
    if (points.length < 2 || !cardId || !current.current.cards.some(card => card.id === cardId && card.kind === "drawing")) return null;
    const id = `drawing:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 7)}`;
    update((previous) => ({ drawings: [...(previous.drawings || []), { id, cardId, points, color: drawing.color || "#56585a", width: isFiniteNumber(drawing.width) ? drawing.width : 3 }] }));
    return id;
  };
  const removeDrawing = (id) => {
    update((previous) => ({ drawings: (previous.drawings || []).filter((drawing) => drawing.id !== id) }));
  };
  const selectCard = (id) => {
    if (id === null) {
      update((previous) => ({ cards: previous.cards.map((card) => ({ ...card, selected: false })), selectedCardId: null }));
      return;
    }
    if (!current.current.cards.some((card) => card.id === id && card.visible)) return;
    update((previous) => ({ cards: bringToFront(previous.cards, id), selectedCardId: id }));
  };
  const moveCard = (id, x, y) => {
    if (!isFiniteNumber(x) || !isFiniteNumber(y)) return;
    const card = current.current.cards.find((item) => item.id === id);
    if (!card || card.pinned) return;
    update((previous) => ({ cards: previous.cards.map((item) => item.id === id ? { ...item, x, y } : item) }));
  };
  const resizeCard = (id, width, height) => {
    if (!isFiniteNumber(width) || !isFiniteNumber(height)) return;
    const card = current.current.cards.find((item) => item.id === id);
    if (!card || card.pinned) return;
    const size = isAddCustomStorageKey(storageKey) ? clampAddCustomCardSize(id, width, height) : { width: Math.max(220, width), height: Math.max(140, height) };
    update((previous) => ({ cards: previous.cards.map((item) => item.id === id ? { ...item, ...size, sizeMode: "manual" } : item) }));
  };
  const fitCardContent = (id, height) => {
    if (!isFiniteNumber(height)) return;
    const card = current.current.cards.find(item => item.id === id);
    if (!card || card.sizeMode !== "content" || card.pinned || card.collapsed) return;
    const limits = isAddCustomStorageKey(storageKey) ? addCustomCardLimits(id) : { maxHeight: MAX_CONTENT_CARD_HEIGHT };
    const baseHeight = isFiniteNumber(card.baseHeight) ? card.baseHeight : card.height;
    const nextHeight = Math.min(limits.maxHeight, Math.max(baseHeight, Math.ceil(height)));
    if (Math.abs(nextHeight - card.height) < 3) return;
    update(previous => ({ cards: previous.cards.map(item => item.id === id ? { ...item, height: nextHeight } : item) }));
  };
  const togglePin = (id) => {
    if (!current.current.cards.some((card) => card.id === id)) return;
    update((previous) => ({ cards: previous.cards.map((card) => card.id === id ? { ...card, pinned: !card.pinned } : card) }));
  };
  const toggleCollapse = (id) => {
    if (!current.current.cards.some((card) => card.id === id)) return;
    update((previous) => ({ cards: previous.cards.map((card) => card.id === id ? { ...card, collapsed: !card.collapsed } : card) }));
  };
  const setViewport = (change = {}) => {
    const previous = current.current.viewport;
    update({ viewport: {
      x: isFiniteNumber(change.x) ? change.x : previous.x,
      y: isFiniteNumber(change.y) ? change.y : previous.y,
      zoom: isFiniteNumber(change.zoom) ? clampZoom(change.zoom) : previous.zoom,
    } });
  };
  const setSurfaceSize = (width, height) => {
    if (!isFiniteNumber(width) || !isFiniteNumber(height) || width <= 0 || height <= 0) return;
    surfaceSize.current = { width, height };
  };
  const fitCanvas = (width = surfaceSize.current?.width, height = surfaceSize.current?.height) => {
    if (!isFiniteNumber(width) || !isFiniteNumber(height) || width <= 0 || height <= 0) return;
    setSurfaceSize(width, height);
    const padding = isAddCustomStorageKey(storageKey) ? ADD_CUSTOM_FIT_PADDING : FIT_PADDING;
    update({ viewport: fittedViewport(current.current.cards, width, height, null, padding, current.current.drawings || []) });
  };
  const focusCanvas = (ids = [], width = surfaceSize.current?.width, height = surfaceSize.current?.height) => {
    if (!isFiniteNumber(width) || !isFiniteNumber(height) || width <= 0 || height <= 0) return;
    setSurfaceSize(width, height);
    const padding = isAddCustomStorageKey(storageKey) ? ADD_CUSTOM_FIT_PADDING : FIT_PADDING;
    update({ viewport: fittedViewport(current.current.cards, width, height, ids, padding) });
  };
  const restore = (id) => {
    const target = id || current.current.lastHiddenId;
    if (target) showCard(target);
  };
  const beginComparison = (ids = []) => {
    if (current.current.comparing || !Array.isArray(ids)) return;
    const selected = [...new Set(ids)].map((id) => current.current.cards.find((card) => card.id === id)).filter(Boolean);
    if (selected.length < 2) return;
    comparisonSnapshot.current = {
      cards: selected.map((card) => ({ ...card })),
      viewport: { ...current.current.viewport },
      selectedCardId: current.current.selectedCardId,
    };
    const positions = new Map();
    const fixed = selected.filter((card) => card.pinned);
    const anchor = fixed[0] || selected[0];
    const selectedIds = new Set(selected.map((card) => card.id));
    const obstacles = current.current.cards.filter((card) => !selectedIds.has(card.id) || card.pinned).map((card) => selectedIds.has(card.id) ? { ...card, visible: true } : card);
    let nextX = anchor.x + anchor.width + 24;
    for (const card of selected) {
      if (card.pinned) continue;
      if (!fixed.length && card.id === anchor.id) {
        positions.set(card.id, { x: card.x, y: card.y });
        obstacles.push({ ...card, visible: true, opened: true, collapsed: false });
        continue;
      }
      const placement = freePosition({ ...card, x: nextX, y: anchor.y, collapsed: false }, obstacles);
      positions.set(card.id, placement);
      obstacles.push({ ...card, ...placement, visible: true, opened: true, collapsed: false });
      nextX = placement.x + card.width + 24;
    }
    const cards = current.current.cards.map((card) => selectedIds.has(card.id)
      ? { ...card, ...(positions.get(card.id) || {}), visible: true, opened: true, collapsed: card.pinned ? card.collapsed : false, selected: card.id === selected[0].id }
      : { ...card, selected: false });
    const size = surfaceSize.current;
    let viewport = current.current.viewport;
    if (size) {
      const shown = cards.filter((card) => selectedIds.has(card.id));
      const left = Math.min(...shown.map((card) => card.x));
      const top = Math.min(...shown.map((card) => card.y));
      const width = Math.max(...shown.map((card) => card.x + card.width)) - left;
      const height = Math.max(...shown.map((card) => card.y + visibleHeight(card))) - top;
      const zoom = Math.max(0.7, clampZoom(Math.min(Math.max(1, size.width - FIT_PADDING * 2) / width, Math.max(1, size.height - FIT_PADDING * 2) / height)));
      viewport = { x: size.width / 2 - (left + width / 2) * zoom, y: size.height / 2 - (top + height / 2) * zoom, zoom };
    }
    update({ cards, selectedCardId: selected[0].id, comparing: true, viewport, lastHiddenId: lastHidden(cards) });
  };
  const endComparison = () => {
    const snapshot = comparisonSnapshot.current;
    if (!snapshot) return;
    const originals = new Map(snapshot.cards.map((card) => [card.id, card]));
    const cards = current.current.cards.map((card) => {
      const original = originals.get(card.id);
      return original
        ? { ...card, x: original.x, y: original.y, width: original.width, height: original.height, visible: original.visible, opened: original.opened, collapsed: original.collapsed, selected: card.id === snapshot.selectedCardId }
        : { ...card, selected: card.id === snapshot.selectedCardId };
    });
    comparisonSnapshot.current = null;
    update({ cards, selectedCardId: snapshot.selectedCardId, comparing: false, viewport: snapshot.viewport, lastHiddenId: lastHidden(cards) });
  };
  const reset = () => {
    hiddenHistory.current = [];
    placedCards.current = new Set(startEmpty ? [] : ["source", "evidence"]);
    comparisonSnapshot.current = null;
    update(initialState(startEmpty, cardDefinitions, initialVisibleIds));
  };

  return {
    state: current.current,
    actions: { addCard, showCard, hideCard, deleteCard, selectCard, moveCard, resizeCard, fitCardContent, updateCard, addDrawing, removeDrawing, togglePin, toggleCollapse, setViewport, setSurfaceSize, beginComparison, endComparison, reset, restore, fitCanvas, focusCanvas },
  };
}

export default useCanvasState;
