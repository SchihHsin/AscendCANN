import { useRef, useState } from "react";
import { getMaterialMeta } from "./workspace-materials";

function initialState(isMainTask, taskId) {
  const initial = { ...getMaterialMeta(taskId === "图像推理调试" ? "image-source" : isMainTask ? "source" : "task-brief"), unread: false };
  return {
    tabs: [initial],
    visitedTabs: [initial],
    activeId: initial.id,
    splitId: null,
    lastContentId: initial.id,
    lastSplitId: null,
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
  const material = { ...meta, unread: options.activate === false && !visible };
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
    ? { ...item, unread: false } : item);
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
    const index = previous.tabs.findIndex((tab) => tab.id === id);
    if (index < 0) return previous;
    const tabs = previous.tabs.filter((tab) => tab.id !== id);
    const contentTabs = tabs.filter((tab) => tab.type !== "canvas");
    let lastContentId = contentTabs.some((tab) => tab.id === previous.lastContentId)
      ? previous.lastContentId : contentTabs.at(-1)?.id || null;
    let activeId = previous.activeId;
    let splitId = previous.splitId === id ? null : previous.splitId;
    let lastSplitId = previous.lastSplitId === id ? null : previous.lastSplitId;
    if (activeId === id) {
      if (id === "canvas" && lastContentId) {
        activeId = lastContentId;
        splitId = tabs.some(tab => tab.id === lastSplitId) && lastSplitId !== activeId ? lastSplitId : null;
      }
      else if (splitId) { activeId = splitId; splitId = null; }
      else activeId = tabs[Math.min(index, tabs.length - 1)]?.id || null;
    }
    if (activeId === "canvas" || !activeId) splitId = null;
    if (activeId && activeId !== "canvas") lastContentId = activeId;
    const markRead = (items) => items.map((tab) => tab.id === activeId || tab.id === splitId
      ? { ...tab, unread: false } : tab);
    return {
      ...previous,
      tabs: markRead(tabs),
      visitedTabs: markRead(previous.visitedTabs),
      activeId,
      splitId,
      lastContentId,
      lastSplitId: activeId === "canvas" ? lastSplitId : splitId,
    };
  });

  const openCanvas = () => open("canvas");

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
  const reset = () => update(() => initialState(isMainTask, taskId));

  return { state, actions: { open, activate, close, openCanvas, splitWith, endSplit, reset } };
}

export default useContentWorkspace;
