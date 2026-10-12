import { useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";
import { getMaterialMeta } from "./workspace-materials";

function initialState(isMainTask, taskId) {
  const initial = { ...getMaterialMeta(taskId === "图像推理调试" ? "image-explanation" : isMainTask ? "explanation" : "task-brief"), unread: false };
  return {
    tabs: [initial],
    visitedTabs: [initial],
    activeId: initial.id,
    splitId: null,
    referenceId: null,
    referenceReturnId: null,
    lastContentId: initial.id,
    lastSplitId: null,
    canvasMode: "overview",
    overview: { query: "", category: "all", collapsedGroups: [], compactIds: [] },
    snapshots: [],
    collapsed: false,
    returnPoint: null,
    positions: {},
  };
}

function rememberMaterial(items, material) {
  const existing = items.find((item) => item.id === material.id);
  return existing
    ? items.map((item) => item.id === material.id ? { ...item, ...material } : item)
    : [...items, material];
}

function openedMaterial(previous, id, options = {}) {
  const existing = previous.tabs.find((tab) => tab.id === id)
    || previous.visitedTabs.find((tab) => tab.id === id);
  const meta = getMaterialMeta(id, { ...existing, ...options });
  const visible = id === previous.activeId || id === previous.splitId;
  const material = { ...existing, ...meta, closed: false, unread: options.activate === false && !visible ? options.restore ? Boolean(existing?.unread) : true : false };
  return {
    ...previous,
    tabs: rememberMaterial(previous.tabs, material),
    visitedTabs: rememberMaterial(previous.visitedTabs, material),
  };
}

function activatedState(previous, id) {
  const tab = previous.tabs.find((item) => item.id === id);
  if (!tab) return previous;
  const canvas = tab.type === "canvas";
  let splitId = previous.referenceId || previous.splitId;
  const referenceReturnId = previous.referenceId === id && previous.activeId && previous.activeId !== id && previous.activeId !== "canvas" ? previous.activeId : previous.referenceReturnId;
  if (canvas) splitId = null;
  else if (splitId === id) splitId = previous.referenceId ? null : previous.activeId !== "canvas" ? previous.activeId : null;
  const markRead = (items) => items.map((item) => item.id === id || item.id === splitId
    ? { ...item, closed: false, unread: false, ...(item.id === id && !canvas ? { lastAccessAt: Date.now() } : {}) } : item);
  return {
    ...previous,
    activeId: id,
    collapsed: false,
    referenceReturnId,
    splitId,
    lastContentId: canvas ? previous.lastContentId : id,
    lastSplitId: canvas && previous.activeId === "canvas" ? previous.lastSplitId : canvas ? previous.splitId : splitId,
    tabs: markRead(previous.tabs),
    visitedTabs: markRead(previous.visitedTabs),
  };
}

export function useContentWorkspace({ taskId, isMainTask }) {
  const tasks = useRef(null);
  if (!tasks.current) {
    const saved = readSession("workspace", {});
    tasks.current = new Map(Object.entries(saved && typeof saved === "object" ? saved : {}).filter(([, value]) => value && Array.isArray(value.tabs) && Array.isArray(value.visitedTabs)).map(([id, value]) => [id, { ...initialState(id === "AddCustom 精度异常" || id === "图像推理调试", id), ...value, positions: value.positions || {}, overview: { ...initialState(true, id).overview, ...value.overview } }]));
  }
  const persist = () => writeSession("workspace", Object.fromEntries(tasks.current));
  const [, setRevision] = useState(0);
  if (!tasks.current.has(taskId)) tasks.current.set(taskId, initialState(isMainTask, taskId));
  const state = tasks.current.get(taskId);

  const update = (change, ownerId = taskId, ownerIsMainTask = isMainTask) => {
    const previous = tasks.current.get(ownerId) || initialState(ownerIsMainTask, ownerId);
    const next = change(previous);
    if (next === previous) return;
    tasks.current.set(ownerId, next);
    persist();
    setRevision((revision) => revision + 1);
  };

  const open = (id, options = {}) => {
    if (typeof id !== "string" || !id.trim()) return;
    const materialId = id.trim();
    const ownerId = options.taskId || taskId;
    const openingOptions = ownerId === taskId ? options : { ...options, activate: false };
    update((previous) => {
      const opened = openedMaterial(previous, materialId, openingOptions);
      return openingOptions.activate === false ? opened : activatedState(opened, materialId);
    }, ownerId, options.isMainTask ?? isMainTask);
  };

  const activate = (id) => update((previous) => activatedState(previous, id));

  const close = (id) => update((previous) => {
    const target = previous.tabs.find((tab) => tab.id === id);
    if (!target) return previous;
    const tabs = previous.tabs.filter((tab) => tab.id !== id);
    const visitedTabs = previous.visitedTabs.map((tab) => tab.id === id ? { ...tab, closed: true } : tab);
    const compactIds = id === "canvas" ? previous.overview.compactIds : [...new Set([...previous.overview.compactIds, id])];
    let activeId = previous.activeId;
    let splitId = previous.splitId === id ? null : previous.splitId;
    if (activeId === id) {
      if (id === "canvas") activeId = previous.lastContentId && tabs.some(tab => tab.id === previous.lastContentId) ? previous.lastContentId : null;
      else if (splitId) { activeId = splitId; splitId = null; }
      else activeId = isMainTask ? "canvas" : null;
    }
    const next = { ...previous, tabs, visitedTabs, activeId, splitId, referenceId: previous.referenceId === id ? null : previous.referenceId, referenceReturnId: previous.referenceId === id ? null : previous.referenceReturnId, overview: { ...previous.overview, compactIds } };
    return activeId === "canvas" ? activatedState(openedMaterial(next, "canvas", { restore: true }), "canvas") : next;
  });

  const openCanvas = (options = {}) => update(previous => {
    const opened = activatedState(openedMaterial(previous, "canvas", { restore: true }), "canvas");
    const overview = options.fit ? { ...previous.overview, query: "", category: "all", collapsedGroups: [], historyId: null, scrollTop: 0, fitTick: (previous.overview.fitTick || 0) + 1 } : previous.overview;
    return { ...opened, collapsed: false, canvasMode: options.mode || previous.canvasMode || "overview", overview,
      returnPoint: previous.activeId !== "canvas" && previous.activeId ? { activeId: previous.activeId, splitId: previous.splitId } : previous.returnPoint };
  });
  const returnFocus = () => update(previous => {
    const point = previous.returnPoint || { activeId: previous.lastContentId, splitId: previous.lastSplitId };
    if (!point.activeId || point.activeId === "canvas") return previous;
    let next = activatedState(openedMaterial(previous, point.activeId, { restore: true }), point.activeId);
    if (point.splitId && previous.referenceId && point.splitId === previous.referenceId && point.splitId !== point.activeId) next = { ...openedMaterial(next, point.splitId, { restore: true }), splitId: point.splitId };
    return next;
  });
  const setCollapsed = value => update(previous => ({ ...previous, collapsed: value }));
  const savePosition = (id, top, ownerId = taskId) => {
    const previous = tasks.current.get(ownerId);
    if (!previous || !Number.isFinite(top)) return;
    tasks.current.set(ownerId, { ...previous, positions: { ...previous.positions, [id]: top } });
    persist();
  };
  const editGroup = (id, title) => update(previous => ({ ...previous, overview: { ...previous.overview, groupNames: { ...previous.overview.groupNames, [id]: String(title).trim().slice(0, 80) || id } } }));
  const editItem = (id, patch) => update(previous => ({ ...previous, overview: { ...previous.overview, itemOverrides: { ...previous.overview.itemOverrides, [id]: { ...previous.overview.itemOverrides?.[id], ...patch } } } }));
  const setOverview = (patch = {}, ownerId = taskId) => update(previous => ({ ...previous, overview: { ...previous.overview, ...patch } }), ownerId, true);
  const getTaskState = (ownerId, ownerIsMainTask = true) => {
    if (!tasks.current.has(ownerId)) tasks.current.set(ownerId, initialState(ownerIsMainTask, ownerId));
    return tasks.current.get(ownerId);
  };
  const saveSnapshot = (parentId, snapshot, ownerId = taskId) => update(previous => {
    const record = { ...snapshot, parentId, id: "snapshot:" + crypto.randomUUID(), time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Shanghai" }) };
    const opened = openedMaterial(previous, parentId, { activate: false, restore: false });
    return { ...opened, snapshots: [...previous.snapshots, record] };
  }, ownerId, true);

  const splitWith = (id) => {
    if (typeof id !== "string" || !id.trim() || id.trim() === "canvas") return;
    const materialId = id.trim();
    update((previous) => {
      const opened = openedMaterial(previous, materialId);
      const contentTabs = opened.tabs.filter((tab) => tab.type !== "canvas");
      const primary = contentTabs.find((tab) => tab.id === previous.activeId && tab.id !== materialId)
        || contentTabs.find((tab) => tab.id === previous.lastContentId && tab.id !== materialId)
        || contentTabs.find((tab) => tab.id !== materialId);
      const activeId = primary?.id || materialId;
      const splitId = primary ? materialId : null;
      const markRead = (items) => items.map((tab) => tab.id === activeId || tab.id === splitId
        ? { ...tab, unread: false } : tab);
      return {
        ...opened,
        activeId,
        splitId,
        referenceId: primary ? materialId : null,
        lastContentId: activeId,
        lastSplitId: splitId,
        tabs: markRead(opened.tabs),
        visitedTabs: markRead(opened.visitedTabs),
      };
    });
  };

  const endSplit = () => update((previous) => ({ ...previous, splitId: null, lastSplitId: null, referenceId: null, referenceReturnId: null }));
  const returnFromReference = () => { if (state.referenceReturnId) open(state.referenceReturnId, { restore: true }); };
  const markRead = (id) => update(previous => ({ ...previous, tabs: previous.tabs.map(item => item.id === id ? { ...item, unread: false } : item), visitedTabs: previous.visitedTabs.map(item => item.id === id ? { ...item, unread: false } : item) }));
  const reset = () => update(() => initialState(isMainTask, taskId));

  return { state, getTaskState, actions: { open, activate, close, openCanvas, returnFocus, setCollapsed, savePosition, editGroup, editItem, setOverview, saveSnapshot, markRead, splitWith, endSplit, returnFromReference, reset } };
}

export default useContentWorkspace;
