import { useCallback, useMemo, useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";
import { freshLayoutView, migrateCanvasLayoutView, viewport } from "./learning-canvas-view-state";

const LAYOUTS = ["horizontal", "vertical"];
const STAGES = new Set(["goal", "path", "environment", "channels", "practice", "check", "summary"]);
const MATERIAL_STAGES = {
  "learning-goal": ["goal"],
  "learning-path": ["path"],
  "learning-lesson": ["channels", "channels"],
  "learning-practice": ["practice", "layout"],
  "learning-check": ["check", "input"],
  "learning-summary": ["summary", "summary"],
};

const keyFor = (taskId, prefix = "learning-canvas-view") => `${prefix}:${taskId}`;
const finite = value => typeof value === "number" && Number.isFinite(value);
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const validId = value => typeof value === "string" && /^[A-Za-z0-9][\w:.-]{0,119}$/u.test(value);
const validTask = value => typeof value === "string" && value.trim().length > 0;
const sameViewport = (a, b) => a.x === b.x && a.y === b.y && a.scale === b.scale;

function initial(initialStage = "channels", initialLayout = "horizontal") {
  const layouts = { horizontal: freshLayoutView(), vertical: freshLayoutView() };
  const layout = LAYOUTS.includes(initialLayout) ? initialLayout : "horizontal";
  return {
    state: {
      layout,
      selectedStage: initialStage,
      selectedStep: initialStage,
      expanded: true,
      focused: false,
      viewport: layouts[layout].viewport,
      positions: layouts[layout].positions,
      pinned: [],
      hidden: [],
      collapsed: [],
      pendingFocusId: null,
      initialized: false,
      canvasSize: null,
    },
    layouts,
  };
}

function restore(taskId, { stageIds, initialStage, initialLayout, storagePrefix, resetOnLoad }) {
  if (resetOnLoad) return initial(initialStage, initialLayout);
  const saved = readSession(keyFor(taskId, storagePrefix), null);
  if (!object(saved)) return initial(initialStage, initialLayout);
  const layout = LAYOUTS.includes(saved.layout) ? saved.layout : initialLayout;
  const layouts = {
    horizontal: migrateCanvasLayoutView(saved.layouts?.horizontal),
    vertical: migrateCanvasLayoutView(saved.layouts?.vertical),
  };
  // Accept the active flat snapshot as well as the per-layout representation.
  layouts[layout] = migrateCanvasLayoutView(object(saved.layouts?.[layout]) ? saved.layouts[layout] : saved);
  const selectedStage = stageIds.has(saved.selectedStage) ? saved.selectedStage : initialStage;
  const expanded = typeof saved.expanded === "boolean" ? saved.expanded : true;
  return {
    state: {
      layout,
      selectedStage,
      selectedStep: validId(saved.selectedStep) ? saved.selectedStep : selectedStage,
      expanded,
      focused: expanded && saved.focused === true,
      viewport: layouts[layout].viewport,
      positions: layouts[layout].positions,
      pinned: Array.isArray(saved.pinned) ? [...new Set(saved.pinned.filter(validId))] : [],
      hidden: Array.isArray(saved.hidden) ? [...new Set(saved.hidden.filter(validId))] : [],
      collapsed: Array.isArray(saved.collapsed) ? [...new Set(saved.collapsed.filter(validId))] : [],
      pendingFocusId: null,
      initialized: layouts[layout].initialized,
      canvasSize: layouts[layout].canvasSize,
    },
    layouts,
  };
}

function replaceState(record, patch, viewPatch = {}) {
  const state = { ...record.state, ...patch };
  return {
    state,
    layouts: {
      ...record.layouts,
      [state.layout]: {
        ...record.layouts[state.layout],
        ...viewPatch,
        viewport: state.viewport,
        positions: state.positions,
        initialized: state.initialized,
        canvasSize: state.canvasSize,
      },
    },
  };
}

function collapseRecord(record) {
  if (!record.state.expanded && !record.state.focused) return record;
  return replaceState(record, { expanded: false, focused: false }, {
    returnViewport: { ...record.state.viewport },
    focusViewport: null,
  });
}

function expandRecord(record) {
  if (record.state.expanded) return record;
  const previousViewport = record.layouts[record.state.layout].returnViewport;
  return replaceState(record, {
    expanded: true,
    ...(previousViewport ? { viewport: { ...previousViewport } } : {}),
  });
}

/** Visual state only: learning progress and validation records remain task-owned elsewhere. */
export function useLearningCanvasView({ taskId, enabled = true, stageIds = STAGES, initialStage = "channels", initialLayout = "horizontal", materialStages = MATERIAL_STAGES, storagePrefix = "learning-canvas-view", resetOnLoad = false } = {}) {
  const tasks = useRef(new Map());
  const disabledState = useRef(null);
  const currentEnabled = useRef(enabled);
  currentEnabled.current = enabled;
  const [, render] = useState(0);
  if (!disabledState.current) disabledState.current = initial(initialStage, initialLayout).state;
  const active = enabled && validTask(taskId);
  // Restore never writes: simply switching tasks must not create or replace a saved session.
  if (active && !tasks.current.has(taskId)) tasks.current.set(taskId, restore(taskId, { stageIds, initialStage, initialLayout, storagePrefix, resetOnLoad }));

  const update = useCallback(change => {
    if (!enabled || !currentEnabled.current || !validTask(taskId)) return undefined;
    const previous = tasks.current.get(taskId);
    if (!previous) return undefined;
    const next = change(previous);
    if (next === previous) return previous.state;
    tasks.current.set(taskId, next);
    writeSession(keyFor(taskId, storagePrefix), { ...next.state, layouts: next.layouts });
    render(revision => revision + 1);
    return next.state;
  }, [taskId, enabled, storagePrefix]);

  const actions = useMemo(() => {
    const select = (stage, step) => {
      if (!stageIds.has(stage) || (step !== undefined && !validId(step))) return undefined;
      return update(record => {
        const previous = record.state;
        const sameStage = previous.selectedStage === stage;
        const selectedStep = step ?? (sameStage ? previous.selectedStep : stage);
        if (sameStage && previous.selectedStep === selectedStep && previous.expanded) return record;
        const expanded = sameStage ? expandRecord(record) : record;
        const previousFocus = record.layouts[previous.layout].focusViewport;
        return replaceState(expanded, {
          selectedStage: stage,
          selectedStep,
          expanded: true,
          focused: sameStage ? expanded.state.focused : false,
          ...(!sameStage && previous.focused && previousFocus ? { viewport: { ...previousFocus } } : {}),
        }, sameStage ? {} : { returnViewport: null, focusViewport: null });
      });
    };
    return {
      setLayout: layout => {
        if (!LAYOUTS.includes(layout)) return undefined;
        return update(record => {
          if (record.state.layout === layout) return record;
          const view = record.layouts[layout];
          return replaceState(record, {
            layout,
            viewport: { ...view.viewport },
            positions: { ...view.positions },
            initialized: view.initialized,
            canvasSize: view.canvasSize,
          });
        });
      },
      select,
      openMaterial: id => materialStages[id] ? select(...materialStages[id]) : undefined,
      collapse: () => update(collapseRecord),
      setExpanded: expanded => typeof expanded === "boolean"
        ? update(expanded ? expandRecord : collapseRecord)
        : undefined,
      setFocused: focused => {
        if (typeof focused !== "boolean") return undefined;
        return update(record => {
          if (record.state.focused === focused) return record;
          const expanded = focused ? expandRecord(record) : record;
          const view = expanded.layouts[expanded.state.layout];
          return replaceState(expanded, {
            focused,
            ...(focused ? { expanded: true } : view.focusViewport ? { viewport: { ...view.focusViewport } } : {}),
          }, { focusViewport: focused ? { ...expanded.state.viewport } : null });
        });
      },
      setViewport: patch => {
        if (!object(patch)) return undefined;
        return update(record => {
          const next = viewport(patch, record.state.viewport);
          return sameViewport(next, record.state.viewport) ? record : replaceState(record, { viewport: next });
        });
      },
      moveObject: (id, point) => {
        if (!validId(id) || !object(point) || !finite(point.x) || !finite(point.y)) return undefined;
        return update(record => {
          const previous = record.state.positions[id];
          if (record.state.pinned.includes(id) || (previous?.x === point.x && previous?.y === point.y)) return record;
          return replaceState(record, { positions: { ...record.state.positions, [id]: { x: point.x, y: point.y } } });
        });
      },
      togglePin: id => {
        if (!validId(id)) return undefined;
        return update(record => replaceState(record, { pinned: record.state.pinned.includes(id)
          ? record.state.pinned.filter(item => item !== id)
          : [...record.state.pinned, id] }));
      },
      toggleCollapsed: id => {
        if (!validId(id)) return undefined;
        return update(record => replaceState(record, { collapsed: record.state.collapsed.includes(id)
          ? record.state.collapsed.filter(item => item !== id)
          : [...record.state.collapsed, id] }));
      },
      requestFocus: id => validId(id) ? update(record => replaceState(record, { pendingFocusId: id })) : undefined,
      clearPendingFocus: () => update(record => record.state.pendingFocusId ? replaceState(record, { pendingFocusId: null }) : record),
      hideObject: id => validId(id) ? update(record => replaceState(record, { hidden: [...new Set([...record.state.hidden, id])] })) : undefined,
      revealObject: id => validId(id) ? update(record => replaceState(record, { hidden: record.state.hidden.filter(item => item !== id) })) : undefined,
      rememberSize: size => object(size) && finite(size.width) && finite(size.height) ? update(record => record.state.canvasSize?.width === size.width && record.state.canvasSize?.height === size.height ? record : replaceState(record, { canvasSize:{width:size.width,height:size.height} })) : undefined,
      markInitialized: () => update(record => record.state.initialized ? record : replaceState(record, { initialized: true })),
      reset: () => update(() => initial(initialStage)),
    };
  }, [update, stageIds, initialStage, materialStages]);

  const getTaskState = useCallback(ownerId => tasks.current.get(ownerId)?.state, []);
  return { state: tasks.current.get(taskId)?.state || disabledState.current, actions, getTaskState };
}

export default useLearningCanvasView;
