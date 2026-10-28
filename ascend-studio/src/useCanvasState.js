import { useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";
import { ADD_CUSTOM_CARD_POSITIONS, ADD_CUSTOM_LAYOUT_VERSION, positionNewAddCustomCard, reflowAddCustomCards } from "./addcustom-canvas-layout";
import { CANVAS_CARD_GAP_X, CANVAS_CARD_GAP_Y, canvasCardDefaultSize, canvasCardIsResizableContent, canvasCardProfile, reflowContentCards } from "./shared/canvas/canvas-sizing.js";

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 1.5;
const FIT_PADDING = 28;
const ADD_CUSTOM_FIT_PADDING = 36;

const CANVAS_LAYOUT_VERSION = ADD_CUSTOM_LAYOUT_VERSION;
const addCustomPosition = (id) => {
  const [x, y] = ADD_CUSTOM_CARD_POSITIONS[id] || [32, 64];
  return { x, y };
};
const isAddCustomStorageKey = (key) => typeof key === "string" && /^canvas-addcustom(?:-|$)/.test(key);
const LEGACY_CARD_SIZES = {
  "task-brief": [[700, 420]],
  source: [[780, 500], [230, 390], [440, 350], [620, 610], [620, 460], [720, 460], [780, 460]],
  evidence: [[700, 420], [395, 270], [560, 390], [560, 420], [620, 420]],
  reference: [[700, 520]],
  explanation: [[700, 520], [300, 450], [360, 340], [560, 520], [620, 520]],
  parameters: [[700, 560], [340, 310], [560, 560], [640, 560]],
  attempts: [[700, 560], [340, 350], [560, 560], [640, 560]],
  draft: [[700, 560], [430, 440], [560, 560], [640, 560]],
  diff: [[840, 640], [500, 550], [680, 640], [760, 640]],
  validation: [[700, 560], [500, 390], [560, 560], [640, 560]],
  precision: [[700, 500], [430, 390], [560, 500], [640, 500]],
  review: [[700, 520], [430, 340], [600, 520], [640, 520]],
};
const LEGACY_CARD_POSITIONS = {
  explanation: [[660, 28], [772, 28]], source: [[28, 28]], evidence: [[52, 448], [72, 408], [28, 670], [28, 548]],
  precision: [[660, 568], [772, 572]], review: [[28, 1088], [28, 992]], draft: [[660, 1088], [772, 1096]], parameters: [[28, 1640], [28, 1536]],
  attempts: [[660, 1680], [772, 1680]], diff: [[28, 2230], [28, 2120]], validation: [[740, 2280], [812, 2264]],
};

const LEGACY_LAYOUT_12_POSITIONS = {
  "task-brief": [32, 64], source: [32, 532], evidence: [32, 1080], reference: [32, 1548],
  explanation: [900, 64], parameters: [900, 632], attempts: [900, 1240], draft: [1688, 64],
  diff: [1688, 672], validation: [1688, 1360], precision: [2616, 64], review: [2616, 612],
};
const LEGACY_LAYOUT_13_POSITIONS = {
  "task-brief": [32, 64], source: [32, 468], evidence: [32, 928], reference: [32, 1320],
  explanation: [840, 64], parameters: [840, 456], attempts: [1648, 64], draft: [1648, 456],
  diff: [2456, 64], validation: [2456, 528], precision: [2456, 1000], review: [2456, 1392],
};

function cardDefaultSize(id, card = {}, semanticDomain = "addcustom") {
  return canvasCardDefaultSize({ ...card, id }, semanticDomain);
}

function isLegacyDynamicCardSize(card) {
  if (["reference", "task-brief"].includes(card.id)) return card.width === 520 && card.height === 300;
  if (card.id.startsWith("attempt:")) return [[520, 320], [520, 340], [520, 390], [680, 520]].some(([width, height]) => card.width === width && card.height === height);
  if (card.id.startsWith("snapshot:")) return [[520, 320], [520, 340], [520, 390], [660, 480]].some(([width, height]) => card.width === width && card.height === height);
  if (card.id.startsWith("record:")) return [[480, 300], [480, 320], [480, 340], [620, 420]].some(([width, height]) => card.width === width && card.height === height);
  return false;
}

function clampCardSize(id, width, height, card = {}, semanticDomain = "addcustom") {
  const limits = canvasCardProfile({ ...card, id }, semanticDomain);
  return {
    width: Math.min(limits.maxWidth, Math.max(limits.minWidth, width)),
    height: Math.min(limits.maxHeight, Math.max(limits.minHeight, height)),
  };
}

const initialCards = (startEmpty = false, initialVisibleIds = []) => [
  { id: "task-brief", title: "问题现场", ...addCustomPosition("task-brief"), pinned: false, visible: false, selected: false },
  { id: "source", title: "索引范围示例", ...addCustomPosition("source"), pinned: false, visible: true, selected: false },
  { id: "evidence", title: "现场与判断", ...addCustomPosition("evidence"), pinned: false, visible: true, selected: false },
  { id: "reference", title: "Ascend C 文档", ...addCustomPosition("reference"), pinned: false, visible: false, selected: false },
  { id: "explanation", title: "线索解释", ...addCustomPosition("explanation"), pinned: false, visible: false, selected: false },
  { id: "parameters", title: "参数与范围策略", ...addCustomPosition("parameters"), pinned: false, visible: false, selected: false },
  { id: "attempts", title: "尝试记录", ...addCustomPosition("attempts"), pinned: false, visible: false, selected: false },
  { id: "draft", title: "示例工作副本", ...addCustomPosition("draft"), pinned: false, visible: false, selected: false },
  { id: "diff", title: "示例修改预览", ...addCustomPosition("diff"), pinned: false, visible: false, selected: false },
  { id: "validation", title: "示例范围复核", ...addCustomPosition("validation"), pinned: false, visible: false, selected: false },
  { id: "precision", title: "误差核对", ...addCustomPosition("precision"), pinned: false, visible: false, selected: false },
  { id: "review", title: "复核记录", ...addCustomPosition("review"), pinned: false, visible: false, selected: false },
].map((card) => {
  const visible = startEmpty ? initialVisibleIds.includes(card.id) : card.visible;
  return { ...card, visible, selected: visible && card.id === initialVisibleIds[0], collapsed: false, opened: visible };
});

const initialState = (startEmpty = false, cardDefinitions, initialVisibleIds = [], semanticDomain = "addcustom") => {
  const positionedDefinitions = [];
  if (cardDefinitions) {
    let rowY = 28;
    for (let index = 0; index < cardDefinitions.length; index += 2) {
      const row = cardDefinitions.slice(index, index + 2);
      const rowProfiles = row.map(card => canvasCardProfile(card, semanticDomain));
      row.forEach((card, column) => positionedDefinitions.push({
        ...card,
        x: isFiniteNumber(card.x) ? card.x : 28 + column * (800 + CANVAS_CARD_GAP_X),
        y: isFiniteNumber(card.y) ? card.y : rowY,
        pinned: false,
        visible: false,
        selected: false,
        collapsed: false,
        opened: false,
      }));
      rowY += Math.max(...rowProfiles.map(profile => profile.height), 360) + CANVAS_CARD_GAP_Y;
    }
  }
  const sourceCards = cardDefinitions ? positionedDefinitions : initialCards(startEmpty, initialVisibleIds);
  const cards = sourceCards.map(card => {
    const semantic = canvasCardProfile(card, semanticDomain);
    const sizeMode = card.sizeMode || (canvasCardIsResizableContent(card, semanticDomain) ? "content" : "manual");
    const width = sizeMode === "content" ? semantic.width : card.width;
    const height = sizeMode === "content" ? semantic.height : card.height;
    const x = isFiniteNumber(card.x) ? card.x : 28;
    const y = isFiniteNumber(card.y) ? card.y : 28;
    return {
      ...card,
      x,
      y,
      width,
      height,
      sizeMode,
      baseHeight: isFiniteNumber(card.baseHeight) ? card.baseHeight : semantic.height,
      positionMode: card.positionMode || "auto",
      layoutOriginX: isFiniteNumber(card.layoutOriginX) ? card.layoutOriginX : x,
      layoutOriginY: isFiniteNumber(card.layoutOriginY) ? card.layoutOriginY : y,
    };
  });
  const selectedCardId = cards.find((card) => card.visible)?.id || null;
  return {
  layoutVersion: CANVAS_LAYOUT_VERSION,
  cards: reflowContentCards(cards),
  drawings: [],
  selectedCardId,
  lastHiddenId: null,
  comparing: false,
  viewport: { x: 0, y: 0, zoom: 1 },
  };
};

function restoreCanvasState(saved, startEmpty, cardDefinitions, initialVisibleIds, storageKey, semanticDomain) {
  if (!saved || !Array.isArray(saved.cards) || !saved.viewport) return initialState(startEmpty, cardDefinitions, initialVisibleIds, semanticDomain);
  const defaults = initialState(startEmpty, cardDefinitions, initialVisibleIds, semanticDomain);
  const oldLayout = Number(saved.layoutVersion) < CANVAS_LAYOUT_VERSION;
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
  const cards = base.cards.map(card => {
    const stored = savedById.get(card.id);
    const defaultCard = defaultsById.get(card.id);
    const targetSize = cardDefaultSize(card.id, card, semanticDomain);
    const knownAddCustomSizes = [targetSize, ...(LEGACY_CARD_SIZES[card.id] || [])].filter(Boolean);
    const matchesKnownSize = isAddCustomStorageKey(storageKey)
      ? knownAddCustomSizes.some(([width, height]) => card.width === width && card.height === height) || isLegacyDynamicCardSize(card)
      : Boolean(defaultCard && ((stored?.sizeMode === "content") || (card.width === defaultCard.width && card.height === defaultCard.height) || (card.width === 420 && card.height === 360)));
    const sizeMode = stored?.sizeMode || (["note", "drawing"].includes(card.kind) ? "manual" : matchesKnownSize ? "content" : "manual");
    const legacyPositions = [...(LEGACY_CARD_POSITIONS[card.id] || [])];
    if (LEGACY_LAYOUT_12_POSITIONS[card.id]) legacyPositions.push(LEGACY_LAYOUT_12_POSITIONS[card.id]);
    if (LEGACY_LAYOUT_13_POSITIONS[card.id]) legacyPositions.push(LEGACY_LAYOUT_13_POSITIONS[card.id]);
    const targetPosition = isAddCustomStorageKey(storageKey) ? ADD_CUSTOM_CARD_POSITIONS[card.id] : null;
    const matchesOldPosition = legacyPositions.some(([x, y]) => card.x === x && card.y === y);
    const definitionIndex = defaultCard ? defaults.cards.findIndex(item => item.id === defaultCard.id) : -1;
    const definitionHasExplicitPosition = definitionIndex >= 0 && cardDefinitions
      && (isFiniteNumber(cardDefinitions[definitionIndex]?.x) || isFiniteNumber(cardDefinitions[definitionIndex]?.y));
    const legacyGridPosition = !isAddCustomStorageKey(storageKey) && defaultCard && !definitionHasExplicitPosition
      ? { x: 28 + (definitionIndex % 2) * 450, y: 28 + Math.floor(definitionIndex / 2) * 390 }
      : null;
    const matchesLegacyGridPosition = Boolean(legacyGridPosition && card.x === legacyGridPosition.x && card.y === legacyGridPosition.y);
    const matchesCurrentPosition = Boolean(defaultCard && card.x === defaultCard.x && card.y === defaultCard.y)
      || Boolean(targetPosition && card.x === targetPosition[0] && card.y === targetPosition[1])
      || matchesLegacyGridPosition;
    const predictedDynamicPosition = isAddCustomStorageKey(storageKey) && /^(attempt|snapshot|record):/.test(card.id)
      ? positionNewAddCustomCard(card, base.cards.filter(item => item.id !== card.id))
      : null;
    const matchesDynamicPosition = predictedDynamicPosition && Math.abs(card.x - predictedDynamicPosition.x) < 1 && Math.abs(card.y - predictedDynamicPosition.y) < 1;
    const inferredPositionMode = matchesOldPosition || matchesCurrentPosition || matchesDynamicPosition ? "auto" : "manual";
    const positionMode = stored?.positionMode || inferredPositionMode;
    const migrateDefaultSize = oldLayout && sizeMode === "content" && !card.pinned;
    const width = migrateDefaultSize ? targetSize[0] : card.width;
    const height = migrateDefaultSize ? targetSize[1] : card.height;
    const defaultHeight = migrateDefaultSize ? targetSize[1] : defaultCard?.height || card.height;
    const migrateDefaultPosition = oldLayout && positionMode === "auto" && (matchesOldPosition || matchesCurrentPosition);
    const x = migrateDefaultPosition ? (targetPosition?.[0] ?? defaultCard?.x ?? card.x) : card.x;
    const y = migrateDefaultPosition ? (targetPosition?.[1] ?? defaultCard?.y ?? card.y) : card.y;
    return {
      ...card,
      sizeMode,
      width,
      height,
      x,
      y,
      positionMode,
      layoutOriginX: positionMode === "auto" && oldLayout ? x : isFiniteNumber(stored?.layoutOriginX) ? stored.layoutOriginX : x,
      layoutOriginY: positionMode === "auto" && oldLayout ? y : isFiniteNumber(stored?.layoutOriginY) ? stored.layoutOriginY : y,
      baseHeight: migrateDefaultSize ? defaultHeight : isFiniteNumber(stored?.baseHeight) ? stored.baseHeight : sizeMode === "content" ? defaultHeight : height,
    };
  });
  const migratedCards = isAddCustomStorageKey(storageKey) ? reflowAddCustomCards(cards) : cards;
  return { ...base, layoutVersion: CANVAS_LAYOUT_VERSION, cards: reflowContentCards(migratedCards) };
}

const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
const visibleHeight = (card) => card.collapsed ? 48 : card.height;

function freePosition(card, obstacles) {
  for (let index = 0; index < 240; index += 1) {
    const x = card.x + (index % 6) * (card.width + CANVAS_CARD_GAP_X);
    const y = card.y + Math.floor(index / 6) * (visibleHeight(card) + CANVAS_CARD_GAP_Y);
    const collides = obstacles.some((other) => other.visible && other.id !== card.id &&
      x < other.x + other.width + CANVAS_CARD_GAP_X && x + card.width + CANVAS_CARD_GAP_X > other.x &&
      y < other.y + visibleHeight(other) + CANVAS_CARD_GAP_Y && y + visibleHeight(card) + CANVAS_CARD_GAP_Y > other.y);
    if (!collides) return { x, y };
  }
  const right = Math.max(card.x, ...obstacles.filter((other) => other.visible).map((other) => other.x + other.width));
  return { x: right + CANVAS_CARD_GAP_X, y: card.y };
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

export function useCanvasState({ startEmpty = false, cardDefinitions, initialVisibleIds = [], storageKey = "canvas", semanticDomain = "addcustom" } = {}) {
  const [state, setState] = useState(() => ({ ...restoreCanvasState(readSession(storageKey, null), startEmpty, cardDefinitions, initialVisibleIds, storageKey, semanticDomain), comparing: false }));
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
    current.current = cached?.state || { ...restoreCanvasState(saved, startEmpty, cardDefinitions, initialVisibleIds, storageKey, semanticDomain), comparing: false };
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
      card = { ...card, ...position, layoutOriginX: position.x, layoutOriginY: position.y, positionMode: "auto" };
    }
    placedCards.current.add(id);
    hiddenHistory.current = hiddenHistory.current.filter((item) => item !== id);
    const cards = reflowContentCards(bringToFront(current.current.cards.map((item) => item.id === id ? { ...card, visible: true, opened: true, collapsed: typeof options.collapsed === "boolean" ? options.collapsed : card.collapsed } : item), id));
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
    const profile = canvasCardProfile(definition, semanticDomain);
    const sizeMode = definition.sizeMode || (canvasCardIsResizableContent({ ...definition, id }, semanticDomain) ? "content" : "manual");
    const card = {
      ...definition,
      id,
      title: typeof definition.title === "string" && definition.title.trim() ? definition.title.trim() : "任务内容",
      x: isFiniteNumber(definition.x) ? definition.x : anchor ? anchor.x + anchor.width + 24 : 28,
      y: isFiniteNumber(definition.y) ? definition.y : anchor ? anchor.y + 24 : 28,
      width: sizeMode === "content" ? profile.width : Math.max(220, isFiniteNumber(definition.width) ? definition.width : profile.width),
      height: sizeMode === "content" ? profile.height : Math.max(140, isFiniteNumber(definition.height) ? definition.height : profile.height),
      pinned: Boolean(definition.pinned),
      visible: true,
      opened: true,
      selected: false,
      collapsed: Boolean(definition.collapsed),
      sizeMode,
      baseHeight: isFiniteNumber(definition.baseHeight) ? definition.baseHeight : profile.height,
      positionMode: "auto",
      layoutOriginX: isFiniteNumber(definition.x) ? definition.x : anchor ? anchor.x + anchor.width + 24 : 28,
      layoutOriginY: isFiniteNumber(definition.y) ? definition.y : anchor ? anchor.y + 24 : 28,
    };
    if (isAddCustomStorageKey(storageKey)) Object.assign(card, clampCardSize(id, card.width, card.height, card, semanticDomain));
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
    update((previous) => ({ cards: previous.cards.map((item) => item.id === id ? { ...item, x, y, positionMode: "manual", layoutOriginX: x, layoutOriginY: y } : item) }));
  };
  const resizeCard = (id, width, height) => {
    if (!isFiniteNumber(width) || !isFiniteNumber(height)) return;
    const card = current.current.cards.find((item) => item.id === id);
    if (!card || card.pinned) return;
    const size = clampCardSize(id, width, height, card, semanticDomain);
    update((previous) => ({ cards: previous.cards.map((item) => item.id === id ? { ...item, ...size, sizeMode: "manual", positionMode: "manual", layoutOriginX: item.x, layoutOriginY: item.y } : item) }));
  };
  const fitCardContent = (id, height) => {
    if (!isFiniteNumber(height)) return;
    const card = current.current.cards.find(item => item.id === id);
    if (!card || card.sizeMode !== "content" || card.pinned || card.collapsed) return;
    const limits = canvasCardProfile(card, semanticDomain);
    const baseHeight = isFiniteNumber(card.baseHeight) ? card.baseHeight : card.height;
    const nextHeight = Math.min(limits.maxHeight, Math.max(baseHeight, Math.ceil(height)));
    if (Math.abs(nextHeight - card.height) < 3) return;
    const cards = current.current.cards.map(item => item.id === id ? { ...item, height: nextHeight } : item);
    update({ cards: reflowContentCards(cards) });
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
    update(initialState(startEmpty, cardDefinitions, initialVisibleIds, semanticDomain));
  };

  return {
    state: current.current,
    actions: { addCard, showCard, hideCard, deleteCard, selectCard, moveCard, resizeCard, fitCardContent, updateCard, addDrawing, removeDrawing, togglePin, toggleCollapse, setViewport, setSurfaceSize, beginComparison, endComparison, reset, restore, fitCanvas, focusCanvas },
  };
}

export default useCanvasState;
