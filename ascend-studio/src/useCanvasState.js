import { useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 1.5;
const FIT_PADDING = 28;

const ADD_CUSTOM_CANVAS_VERSION = 3;
const ADD_CUSTOM_CARD_SIZES = {
  explanation: [560, 520], source: [620, 610], evidence: [560, 390], precision: [560, 500],
  review: [600, 520], draft: [560, 560], parameters: [560, 560], attempts: [560, 560],
  diff: [680, 640], validation: [560, 560],
};
const ADD_CUSTOM_CARD_LIMITS = {
  note: { minWidth: 440, maxWidth: 720, minHeight: 240, maxHeight: 560 },
  explanation: { minWidth: 480, maxWidth: 760, minHeight: 320, maxHeight: 680 },
  code: { minWidth: 520, maxWidth: 820, minHeight: 360, maxHeight: 760 },
  result: { minWidth: 480, maxWidth: 760, minHeight: 300, maxHeight: 680 },
  diff: { minWidth: 560, maxWidth: 880, minHeight: 400, maxHeight: 760 },
};
const ADD_CUSTOM_CARD_CATEGORY = {
  explanation: "explanation", source: "code", evidence: "note", precision: "result", review: "result",
  draft: "code", parameters: "explanation", attempts: "result", diff: "diff", validation: "result",
};
const LEGACY_CARD_SIZES = {
  explanation: [[300, 450], [360, 340]], source: [[230, 390], [440, 350]], evidence: [[395, 270]],
  precision: [[430, 390]], review: [[430, 340]], draft: [[430, 440]], parameters: [[340, 310]],
  attempts: [[340, 350]], diff: [[500, 550]], validation: [[500, 390]],
};

function addCustomCardLimits(id) {
  const category = ADD_CUSTOM_CARD_CATEGORY[id]
    || (id.startsWith("attempt:") || id.startsWith("snapshot:") ? "result" : id.startsWith("record:") ? "note" : "result");
  return ADD_CUSTOM_CARD_LIMITS[category];
}

function clampAddCustomCardSize(id, width, height) {
  const limits = addCustomCardLimits(id);
  return {
    width: Math.min(limits.maxWidth, Math.max(limits.minWidth, width)),
    height: Math.min(limits.maxHeight, Math.max(limits.minHeight, height)),
  };
}

const initialCards = (startEmpty = false, initialVisibleIds = []) => [
  { id: "explanation", title: "线索解释", x: 660, y: 28, width: 560, height: 520, pinned: false, visible: false, selected: false },
  { id: "source", title: "索引范围示例", x: 28, y: 28, width: 620, height: 610, pinned: false, visible: true, selected: false },
  { id: "evidence", title: "现场与判断", x: 28, y: 670, width: 560, height: 390, pinned: false, visible: true, selected: false },
  { id: "precision", title: "误差核对", x: 660, y: 568, width: 560, height: 500, pinned: false, visible: false, selected: false },
  { id: "review", title: "复核记录", x: 28, y: 1088, width: 600, height: 520, pinned: false, visible: false, selected: false },
  { id: "draft", title: "示例工作副本", x: 660, y: 1088, width: 560, height: 560, pinned: false, visible: false, selected: false },
  { id: "parameters", title: "参数与范围策略", x: 28, y: 1640, width: 560, height: 560, pinned: false, visible: false, selected: false },
  { id: "attempts", title: "尝试记录", x: 660, y: 1680, width: 560, height: 560, pinned: false, visible: false, selected: false },
  { id: "diff", title: "示例修改预览", x: 28, y: 2230, width: 680, height: 640, pinned: false, visible: false, selected: false },
  { id: "validation", title: "示例范围复核", x: 740, y: 2280, width: 560, height: 560, pinned: false, visible: false, selected: false },
].map((card) => {
  const visible = startEmpty ? initialVisibleIds.includes(card.id) : card.visible;
  return { ...card, visible, selected: visible && card.id === initialVisibleIds[0], collapsed: false, opened: visible };
});

const initialState = (startEmpty = false, cardDefinitions, initialVisibleIds = []) => {
  const cards = cardDefinitions ? cardDefinitions.map((card, index) => ({ x: 28 + (index % 2) * 450, y: 28 + Math.floor(index / 2) * 390, width: 420, height: 360, pinned: false, visible: false, selected: false, collapsed: false, opened: false, ...card })) : initialCards(startEmpty, initialVisibleIds);
  const selectedCardId = cards.find((card) => card.visible)?.id || null;
  return {
  layoutVersion: ADD_CUSTOM_CANVAS_VERSION,
  cards,
  selectedCardId,
  lastHiddenId: null,
  comparing: false,
  viewport: { x: 0, y: 0, zoom: 1 },
  };
};

function restoreCanvasState(saved, startEmpty, cardDefinitions, initialVisibleIds, storageKey) {
  if (!saved || !Array.isArray(saved.cards) || !saved.viewport) return initialState(startEmpty, cardDefinitions, initialVisibleIds);
  const base = { ...initialState(startEmpty, cardDefinitions, initialVisibleIds), ...saved };
  if (storageKey !== "canvas-addcustom" || Number(saved.layoutVersion) >= ADD_CUSTOM_CANVAS_VERSION) return base;
  const source = base.cards.find(card => card.id === "source");
  const evidence = base.cards.find(card => card.id === "evidence");
  const defaultPlacement = source?.x === 28 && source?.y === 28 && evidence && [[52, 448], [72, 408]].some(([x, y]) => evidence.x === x && evidence.y === y);
  const cards = base.cards.map(card => {
    const target = ADD_CUSTOM_CARD_SIZES[card.id];
    const legacySizes = LEGACY_CARD_SIZES[card.id] || [];
    const matchesOldDefault = legacySizes.some(([width, height]) => card.width === width && card.height === height);
    const resized = target && matchesOldDefault && !card.pinned ? { ...card, width: target[0], height: target[1] } : card;
    if (card.id === "evidence" && defaultPlacement && !card.pinned) return { ...resized, x: 28, y: 670 };
    return resized;
  });
  return { ...base, layoutVersion: ADD_CUSTOM_CANVAS_VERSION, cards };
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

function fittedViewport(cards, width, height, ids = null) {
  const included = ids ? new Set(ids) : null;
  const visible = cards.filter((card) => card.visible && (!included || included.has(card.id)));
  if (!visible.length) return { x: 0, y: 0, zoom: 1 };
  const left = Math.min(...visible.map((card) => card.x));
  const top = Math.min(...visible.map((card) => card.y));
  const right = Math.max(...visible.map((card) => card.x + card.width));
  const bottom = Math.max(...visible.map((card) => card.y + visibleHeight(card)));
  const contentWidth = Math.max(1, right - left);
  const contentHeight = Math.max(1, bottom - top);
  const zoom = clampZoom(Math.min(
    Math.max(1, width - FIT_PADDING * 2) / contentWidth,
    Math.max(1, height - FIT_PADDING * 2) / contentHeight,
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
    if (!placedCards.current.has(id) && !card.pinned) card = { ...card, ...freePosition(card, current.current.cards) };
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
      ...(storageKey === "canvas-addcustom" && ADD_CUSTOM_CARD_SIZES[id] ? { width: ADD_CUSTOM_CARD_SIZES[id][0], height: ADD_CUSTOM_CARD_SIZES[id][1] } : {}),
      pinned: Boolean(definition.pinned),
      visible: true,
      opened: true,
      selected: false,
      collapsed: Boolean(definition.collapsed),
    };
    if (storageKey === "canvas-addcustom") Object.assign(card, clampAddCustomCardSize(id, card.width, card.height));
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
    const size = storageKey === "canvas-addcustom" ? clampAddCustomCardSize(id, width, height) : { width: Math.max(220, width), height: Math.max(140, height) };
    update((previous) => ({ cards: previous.cards.map((item) => item.id === id ? { ...item, ...size } : item) }));
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
    update({ viewport: fittedViewport(current.current.cards, width, height) });
  };
  const focusCanvas = (ids = [], width = surfaceSize.current?.width, height = surfaceSize.current?.height) => {
    if (!isFiniteNumber(width) || !isFiniteNumber(height) || width <= 0 || height <= 0) return;
    setSurfaceSize(width, height);
    update({ viewport: fittedViewport(current.current.cards, width, height, ids) });
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
    actions: { addCard, showCard, hideCard, selectCard, moveCard, resizeCard, togglePin, toggleCollapse, setViewport, setSurfaceSize, beginComparison, endComparison, reset, restore, fitCanvas, focusCanvas },
  };
}

export default useCanvasState;
