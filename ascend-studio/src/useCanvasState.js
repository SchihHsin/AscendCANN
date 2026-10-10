import { useRef, useState } from "react";

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 1.5;
const FIT_PADDING = 28;

const initialCards = (startEmpty = false) => [
  { id: "explanation", title: "线索解释", x: 500, y: 28, width: 360, height: 340, pinned: false, visible: false, selected: false },
  { id: "source", title: "索引范围示例", x: 28, y: 28, width: 440, height: 350, pinned: false, visible: true, selected: false },
  { id: "evidence", title: "现场与判断", x: 72, y: 408, width: 395, height: 270, pinned: false, visible: true, selected: false },
  { id: "precision", title: "误差核对", x: 960, y: 28, width: 430, height: 390, pinned: false, visible: false, selected: false },
  { id: "review", title: "复核记录", x: 960, y: 448, width: 430, height: 340, pinned: false, visible: false, selected: false },
  { id: "draft", title: "示例工作副本", x: 500, y: 408, width: 430, height: 440, pinned: false, visible: false, selected: false },
  { id: "parameters", title: "参数与范围策略", x: 28, y: 708, width: 340, height: 310, pinned: false, visible: false, selected: false },
  { id: "attempts", title: "尝试记录", x: 500, y: 888, width: 340, height: 350, pinned: false, visible: false, selected: false },
  { id: "diff", title: "示例修改预览", x: 1420, y: 28, width: 500, height: 550, pinned: false, visible: false, selected: false },
  { id: "validation", title: "示例范围复核", x: 1420, y: 608, width: 500, height: 390, pinned: false, visible: false, selected: false },
].map((card) => ({ ...card, visible: startEmpty ? false : card.visible, collapsed: false, opened: startEmpty ? false : card.visible }));

const initialState = (startEmpty = false, cardDefinitions) => ({
  cards: cardDefinitions ? cardDefinitions.map((card, index) => ({ x: 28 + (index % 2) * 450, y: 28 + Math.floor(index / 2) * 390, width: 420, height: 360, pinned: false, visible: false, selected: false, collapsed: false, opened: false, ...card })) : initialCards(startEmpty),
  selectedCardId: null,
  lastHiddenId: null,
  comparing: false,
  viewport: { x: 0, y: 0, zoom: 1 },
});

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

function fittedViewport(cards, width, height) {
  const visible = cards.filter((card) => card.visible);
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

export function useCanvasState({ startEmpty = false, cardDefinitions } = {}) {
  const [state, setState] = useState(() => initialState(startEmpty, cardDefinitions));
  const current = useRef(state);
  const surfaceSize = useRef(null);
  const hiddenHistory = useRef([]);
  const placedCards = useRef(new Set(startEmpty ? [] : ["source", "evidence"]));
  const comparisonSnapshot = useRef(null);
  const lastHidden = (cards) => hiddenHistory.current.findLast((id) => cards.some((card) => card.id === id && !card.visible)) || null;

  const update = (change) => {
    const previous = current.current;
    const next = { ...previous, ...(typeof change === "function" ? change(previous) : change) };
    current.current = next;
    setState(next);
  };

  const showCard = (id, options = {}) => {
    let card = current.current.cards.find((item) => item.id === id);
    if (!card) return;
    if (!placedCards.current.has(id) && !card.pinned) card = { ...card, ...freePosition(card, current.current.cards) };
    placedCards.current.add(id);
    hiddenHistory.current = hiddenHistory.current.filter((item) => item !== id);
    const cards = bringToFront(current.current.cards.map((item) => item.id === id ? { ...card, visible: true, opened: true } : item), id);
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
      pinned: Boolean(definition.pinned),
      visible: true,
      opened: true,
      selected: false,
      collapsed: Boolean(definition.collapsed),
    };
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
    update((previous) => ({ cards: previous.cards.map((item) => item.id === id ? { ...item, width: Math.max(220, width), height: Math.max(140, height) } : item) }));
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
    update(initialState(startEmpty, cardDefinitions));
  };

  return {
    state,
    actions: { addCard, showCard, hideCard, selectCard, moveCard, resizeCard, togglePin, toggleCollapse, setViewport, setSurfaceSize, beginComparison, endComparison, reset, restore, fitCanvas },
  };
}

export default useCanvasState;
