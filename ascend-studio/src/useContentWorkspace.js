import { useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";
import { getMaterialMeta } from "./workspace-materials";
import { LEARNING_PATH_GENERATION_TASK } from "./learning-data";
import { LOG_DIAGNOSTIC_TASK } from "./prototype-data";

const ADD_CUSTOM_TASK_ID = "AddCustom 精度异常";
const ADD_CUSTOM_CANVAS_VERSION = 5;
const LOG_DIAGNOSTIC_WORKSPACE_VERSION = 1;

function initialState(isMainTask, taskId, initialMaterialId) {
  const initial = { ...getMaterialMeta(initialMaterialId || (taskId === "学会图像输入预处理" ? "learning-goal" : taskId === "图像推理调试" ? "image-explanation" : taskId === LOG_DIAGNOSTIC_TASK ? "log-diagnosis" : isMainTask ? "explanation" : "task-brief")), unread: false };
  const addCustom = taskId === ADD_CUSTOM_TASK_ID;
  const logDiagnostic = taskId === LOG_DIAGNOSTIC_TASK;
  const canvas = { ...getMaterialMeta("canvas"), title: "任务内容画布", unread: false };
  return {
    tabs: addCustom ? [initial, canvas] : [initial],
    visitedTabs: addCustom ? [initial, canvas] : [initial],
    activeId: initial.id,
    splitId: null,
    referenceId: null,
    referenceReturnId: null,
    comparisonFocusId: null,
    comparisonReturnPoint: null,
    comparisonPinned: false,
    lastContentId: initial.id,
    lastSplitId: null,
    canvasMode: addCustom ? "focus" : "overview",
    overview: { query: "", category: "all", collapsedGroups: [], compactIds: [], mapLevel: 2, mapInitialized: false, ...(addCustom ? { focusId: initial.id } : {}) },
    snapshots: [],
    collapsed: addCustom || logDiagnostic,
    returnPoint: null,
    positions: {},
    ...(addCustom ? { addCustomCanvasVersion: ADD_CUSTOM_CANVAS_VERSION } : {}),
  };
}

function rememberMaterial(items, material) {
  const existing = items.find((item) => item.id === material.id);
  return existing
    ? items.map((item) => item.id === material.id ? { ...item, ...material } : item)
    : [...items, material];
}

function learningCanvasState(previous) {
  const material = { ...getMaterialMeta("canvas"), title: "学习画布", unread: false, closed: false };
  return {
    ...previous,
    tabs: rememberMaterial(previous.tabs, material),
    visitedTabs: rememberMaterial(previous.visitedTabs, material),
    activeId: "canvas",
    splitId: null,
    canvasMode: "free",
    lastContentId: previous.lastContentId && previous.lastContentId !== "canvas" ? previous.lastContentId : "learning-goal",
    learningCanvasVersion: 1,
  };
}

function openedMaterial(previous, id, options = {}) {
  const existing = previous.tabs.find((tab) => tab.id === id)
    || previous.visitedTabs.find((tab) => tab.id === id);
  const meta = getMaterialMeta(id, { ...existing, ...options });
  const visible = Array.isArray(options.visibleIds)
    ? options.visibleIds.includes(id)
    : !previous.collapsed && previous.activeId !== "canvas" && (id === previous.activeId || id === previous.splitId);
  const background = options.activate === false;
  const closed = options.viewedInCanvas ? false : background ? existing?.closed ?? !previous.tabs.some(tab => tab.id === id) : false;
  const material = { ...existing, ...meta, closed,
    unread: !options.viewedInCanvas && background && !visible ? options.restore ? Boolean(existing?.unread) : true : false,
    ...(options.viewedInCanvas ? { lastAccessAt: Date.now() } : {}) };
  return {
    ...previous,
    tabs: background && closed ? previous.tabs : rememberMaterial(previous.tabs, material),
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
    comparisonFocusId: canvas ? previous.comparisonFocusId : id,
    splitId,
    lastContentId: canvas ? previous.lastContentId : id,
    lastSplitId: canvas && previous.activeId === "canvas" ? previous.lastSplitId : canvas ? previous.splitId : splitId,
    tabs: markRead(previous.tabs),
    visitedTabs: markRead(previous.visitedTabs),
  };
}

export function useContentWorkspace({ taskId, isMainTask, initialMaterialId, defaultToLearningCanvas = false }) {
  const tasks = useRef(null);
  const visibleContent = useRef(new Map());
  if (!tasks.current) {
    const saved = readSession("workspace", {});
    tasks.current = new Map(Object.entries(saved && typeof saved === "object" ? saved : {}).filter(([id, value]) => id !== LEARNING_PATH_GENERATION_TASK && value && Array.isArray(value.tabs) && Array.isArray(value.visitedTabs)).map(([id, value]) => [id, { ...initialState(id === "AddCustom 精度异常" || id === "图像推理调试", id), ...value, positions: value.positions || {}, overview: { ...initialState(true, id).overview, ...value.overview } }]));
  }
  const persist = () => writeSession("workspace", Object.fromEntries(tasks.current));
  const [, setRevision] = useState(0);
  if (!tasks.current.has(taskId)) tasks.current.set(taskId, initialState(isMainTask, taskId, initialMaterialId));
  if (taskId === ADD_CUSTOM_TASK_ID && tasks.current.get(taskId).addCustomCanvasVersion !== ADD_CUSTOM_CANVAS_VERSION) {
    const previous = tasks.current.get(taskId);
    const focusId = previous.activeId && previous.activeId !== "canvas"
      ? previous.activeId
      : previous.overview?.focusId || previous.lastContentId || "explanation";
    const canvas = { ...getMaterialMeta("canvas"), title: "任务内容画布", unread: false, closed: false };
    const tabs = rememberMaterial(previous.tabs || [], canvas);
    const visitedTabs = rememberMaterial(previous.visitedTabs || [], canvas);
    tasks.current.set(taskId, {
      ...previous,
      tabs,
      visitedTabs,
      activeId: focusId,
      splitId: null,
      referenceId: null,
      referenceReturnId: null,
      comparisonFocusId: null,
      comparisonReturnPoint: null,
      comparisonPinned: false,
      lastContentId: focusId,
      lastSplitId: null,
      canvasMode: "focus",
      overview: { ...initialState(true, taskId).overview, ...previous.overview, focusId },
      collapsed: true,
      returnPoint: null,
      addCustomCanvasVersion: ADD_CUSTOM_CANVAS_VERSION,
    });
    persist();
  }
  // The log-triage task starts in the conversation; reveal its work area only after the user opens the cue.
  if (taskId === LOG_DIAGNOSTIC_TASK && tasks.current.get(taskId).logDiagnosticWorkspaceVersion !== LOG_DIAGNOSTIC_WORKSPACE_VERSION) {
    const previous = tasks.current.get(taskId);
    const initial = initialState(isMainTask, taskId, initialMaterialId);
    tasks.current.set(taskId, {
      ...initial,
      ...previous,
      tabs: previous.tabs?.length ? previous.tabs : initial.tabs,
      visitedTabs: previous.visitedTabs?.length ? previous.visitedTabs : initial.visitedTabs,
      activeId: previous.activeId || initial.activeId,
      lastContentId: previous.lastContentId || initial.lastContentId,
      collapsed: true,
      logDiagnosticWorkspaceVersion: LOG_DIAGNOSTIC_WORKSPACE_VERSION,
    });
    persist();
  }
  // Migrate only the presentation once; saved task data and a collapsed work area remain intact.
  if (defaultToLearningCanvas && tasks.current.get(taskId).learningCanvasVersion !== 1) {
    tasks.current.set(taskId, learningCanvasState(tasks.current.get(taskId)));
    persist();
  }
  const state = tasks.current.get(taskId);

  const update = (change, ownerId = taskId, ownerIsMainTask = isMainTask) => {
    const previous = tasks.current.get(ownerId) || initialState(ownerIsMainTask, ownerId, ownerId === taskId ? initialMaterialId : undefined);
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
    const openingOptions = { ...options, visibleIds: visibleContent.current.get(ownerId), ...(ownerId !== taskId ? { activate: false } : {}) };
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
    let referenceId = previous.referenceId === id ? null : previous.referenceId;
    let referenceReturnId = previous.referenceId === id || previous.referenceReturnId === id ? null : previous.referenceReturnId;
    if (activeId === id) {
      const originalReturn = id === previous.referenceId && tabs.find(tab => tab.id === previous.referenceReturnId);
      const contentTabs = previous.tabs.filter(tab => tab.id !== "canvas");
      const index = contentTabs.findIndex(tab => tab.id === id);
      const remaining = contentTabs.filter(tab => tab.id !== id);
      const adjacent = remaining[Math.min(index, remaining.length - 1)];
      if (id === "canvas") activeId = previous.lastContentId && tabs.some(tab => tab.id === previous.lastContentId) ? previous.lastContentId : remaining.at(-1)?.id || null;
      else if (originalReturn) activeId = originalReturn.id;
      else if (splitId) { activeId = splitId; splitId = null; }
      else activeId = adjacent?.id || (isMainTask ? "canvas" : null);
      if (referenceId === activeId) { referenceId = null; referenceReturnId = null; }
    }
    const next = { ...previous, tabs, visitedTabs, activeId, splitId, referenceId, referenceReturnId,
      comparisonFocusId: activeId,
      comparisonReturnPoint: null,
      comparisonPinned: false,
      lastSplitId: previous.lastSplitId === id ? null : previous.lastSplitId,
      returnPoint: previous.returnPoint?.activeId === id ? null : previous.returnPoint,
      overview: { ...previous.overview, compactIds },
      ...(activeId === "canvas" && previous.activeId === id ? { canvasMode: "overview" } : {}) };
    if (activeId === "canvas") return activatedState(openedMaterial(next, "canvas", { restore: true }), "canvas");
    return previous.activeId === id && activeId ? activatedState(next, activeId) : next;
  });

  const openCanvas = (options = {}) => update(previous => {
    const opened = activatedState(openedMaterial(previous, "canvas", { restore: true }), "canvas");
    const overview = options.fit ? { ...previous.overview, query: "", category: "all", collapsedGroups: [], historyId: null, scrollTop: 0, fitTick: (previous.overview.fitTick || 0) + 1 } : previous.overview;
    return { ...opened, collapsed: false, canvasMode: options.mode || previous.canvasMode || "overview", overview,
      returnPoint: previous.activeId !== "canvas" && previous.activeId ? { activeId: previous.activeId, splitId: previous.splitId, comparisonFocusId: previous.comparisonFocusId } : previous.returnPoint };
  });
  const returnFocus = () => update(previous => {
    const point = previous.returnPoint || { activeId: previous.lastContentId, splitId: previous.lastSplitId };
    if (!point.activeId || point.activeId === "canvas") return previous;
    let next = activatedState(openedMaterial(previous, point.activeId, { restore: true }), point.activeId);
    if (point.splitId && previous.referenceId && point.splitId === previous.referenceId && point.splitId !== point.activeId) next = { ...openedMaterial(next, point.splitId, { restore: true }), splitId: point.splitId, comparisonFocusId: [point.activeId, point.splitId].includes(point.comparisonFocusId) ? point.comparisonFocusId : point.activeId };
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
    const record = { ...snapshot, parentId, id: "snapshot:" + crypto.randomUUID(), createdAt: Date.now(), time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Shanghai" }) };
    const opened = openedMaterial(previous, parentId, { activate: false, restore: false, visibleIds: visibleContent.current.get(ownerId) });
    return { ...opened, snapshots: [...previous.snapshots, record] };
  }, ownerId, true);

  const splitWith = (id, options = {}) => {
    if (typeof id !== "string" || !id.trim() || id.trim() === "canvas") return;
    const materialId = id.trim();
    update((previous) => {
      let opened = openedMaterial(previous, materialId, { ...options, restore: true });
      const primaryId = previous.activeId !== "canvas" ? previous.activeId : previous.lastContentId;
      const primary = primaryId && primaryId !== materialId
        ? previous.tabs.find(tab => tab.id === primaryId) || previous.visitedTabs.find(tab => tab.id === primaryId)
        : null;
      if (!primary) return activatedState(opened, materialId);
      opened = openedMaterial(opened, primary.id, { restore: true });
      const returnPoint = previous.comparisonReturnPoint || {
        activeId: previous.activeId,
        canvasMode: previous.canvasMode,
        splitId: previous.splitId,
        referenceId: previous.referenceId,
        referenceReturnId: previous.referenceReturnId,
        comparisonFocusId: previous.comparisonFocusId,
      };
      const markRead = items => items.map(tab => tab.id === primary.id || tab.id === materialId
        ? { ...tab, unread: false, closed: false } : tab);
      return {
        ...opened,
        collapsed: false,
        activeId: primary.id,
        splitId: materialId,
        referenceId: materialId,
        referenceReturnId: null,
        comparisonFocusId: primary.id,
        comparisonReturnPoint: options.pinned ? null : returnPoint,
        comparisonPinned: Boolean(options.pinned),
        lastContentId: primary.id,
        lastSplitId: materialId,
        tabs: markRead(opened.tabs),
        visitedTabs: markRead(opened.visitedTabs),
      };
    });
  };

  const focusComparison = id => update(previous => {
    if (id !== previous.activeId && id !== previous.splitId) return previous;
    return { ...previous, comparisonFocusId: id,
      tabs: previous.tabs.map(item => item.id === id ? { ...item, unread: false } : item),
      visitedTabs: previous.visitedTabs.map(item => item.id === id ? { ...item, unread: false } : item) };
  });
  const endSplit = () => update(previous => {
    const point = previous.comparisonReturnPoint;
    let next = { ...previous, splitId: null, lastSplitId: null, referenceId: null, referenceReturnId: null,
      comparisonFocusId: null, comparisonReturnPoint: null, comparisonPinned: false };
    if (point?.activeId) {
      next = activatedState(openedMaterial(next, point.activeId, { restore: true }), point.activeId);
      next = { ...next, canvasMode: point.canvasMode || next.canvasMode };
      if (point.referenceId && point.splitId && point.splitId !== point.activeId) {
        next = { ...openedMaterial(next, point.splitId, { restore: true }), splitId: point.splitId,
          referenceId: point.referenceId, referenceReturnId: point.referenceReturnId, comparisonPinned: true,
          comparisonFocusId: [point.activeId, point.splitId].includes(point.comparisonFocusId) ? point.comparisonFocusId : point.activeId };
      }
    }
    return next;
  });
  const setVisibleContent = (ownerId, ids) => visibleContent.current.set(ownerId, ids);
  const returnFromReference = () => update(previous => previous.referenceReturnId
    ? activatedState(openedMaterial(previous, previous.referenceReturnId, { restore: true }), previous.referenceReturnId)
    : previous);
  const markRead = (id) => update(previous => ({ ...previous, tabs: previous.tabs.map(item => item.id === id ? { ...item, unread: false } : item), visitedTabs: previous.visitedTabs.map(item => item.id === id ? { ...item, unread: false } : item) }));
  const reset = () => update(() => { const initial = initialState(isMainTask, taskId, initialMaterialId); return defaultToLearningCanvas ? learningCanvasState(initial) : initial; });

  return { state, getTaskState, actions: { open, activate, close, openCanvas, returnFocus, setCollapsed, savePosition, editGroup, editItem, setOverview, saveSnapshot, markRead, splitWith, focusComparison, setVisibleContent, endSplit, returnFromReference, reset } };
}

export default useContentWorkspace;
