import { useRef, useState } from "react";
import { getMaterialMeta } from "./workspace-materials";

function initialState(isMainTask, taskId) {
  const initial = { ...getMaterialMeta(taskId === "图像推理调试" ? "image-explanation" : isMainTask ? "explanation" : "task-brief"), unread: false };
  return {
    tabs: [initial],
    visitedTabs: [initial],
    activeId: initial.id,
    splitId: null,
    lastContentId: initial.id,
    lastSplitId: null,
    canvasMode: "overview",
    overview: { query: "", category: "all", collapsedGroups: [], compactIds: [] },
    snapshots: [],
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
  let splitId = previous.splitId;
  if (canvas) splitId = null;
  else if (splitId === id) splitId = previous.activeId !== "canvas" ? previous.activeId : null;
  const markRead = (items) => items.map((item) => item.id === id || item.id === splitId
    ? { ...item, closed: false, unread: false } : item);
  return {
    ...previous,
    activeId: id,
    splitId,
    lastContentId: canvas ? previous.lastContentId : id,
    lastSplitId: canvas && previous.activeId === "canvas" ? previous.lastSplitId : canvas ? previous.splitId : splitId,
    tabs: markRead(previous.tabs),
    visitedTabs: markRead(previous.visitedTabs),
  };
}

export function useContentWorkspace({ taskId, isMainTask }) {
  const tasks = useRef(new Map());
  const [, setRevision] = useState(0);
  if (!tasks.current.has(taskId)) tasks.current.set(taskId, initialState(isMainTask, taskId));
  const state = tasks.current.get(taskId);

  const update = (change, ownerId = taskId, ownerIsMainTask = isMainTask) => {
    const previous = tasks.current.get(ownerId) || initialState(ownerIsMainTask, ownerId);
    const next = change(previous);
    if (next === previous) return;
    tasks.current.set(ownerId, next);
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
    const next = { ...previous, tabs, visitedTabs, activeId, splitId, overview: { ...previous.overview, compactIds } };
    return activeId === "canvas" ? activatedState(openedMaterial(next, "canvas", { restore: true }), "canvas") : next;
  });

  const openCanvas = (options = {}) => update(previous => {
    const opened = activatedState(openedMaterial(previous, "canvas", { restore: true }), "canvas");
    return { ...opened, canvasMode: options.mode || previous.canvasMode || "overview" };
  });
  const setOverview = (patch = {}) => update(previous => ({ ...previous, overview: { ...previous.overview, ...patch } }));
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
        lastContentId: activeId,
        lastSplitId: splitId,
        tabs: markRead(opened.tabs),
        visitedTabs: markRead(opened.visitedTabs),
      };
    });
  };

  const endSplit = () => update((previous) => previous.splitId ? { ...previous, splitId: null, lastSplitId: null } : previous);
  const markRead = (id) => update(previous => ({ ...previous, tabs: previous.tabs.map(item => item.id === id ? { ...item, unread: false } : item), visitedTabs: previous.visitedTabs.map(item => item.id === id ? { ...item, unread: false } : item) }));
  const reset = () => update(() => initialState(isMainTask, taskId));

  return { state, getTaskState, actions: { open, activate, close, openCanvas, setOverview, saveSnapshot, markRead, splitWith, endSplit, reset } };
}

export default useContentWorkspace;
