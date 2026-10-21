import { useCallback, useMemo, useRef, useState } from "react";
import { readSession, writeSession } from "./session-storage";
import { OFFICIAL_LEARNING_COURSES, getOfficialLearningNode } from "./official-learning-data";

const LAYOUTS = new Set(["horizontal", "vertical"]);
const NODE_IDS = new Set(OFFICIAL_LEARNING_COURSES.flatMap(course => [course.id, ...course.children.map(child => child.id)]));
const FIRST_NODE = OFFICIAL_LEARNING_COURSES[0].children[0].id;
const MIN_SCALE = 0.2;
const initial = () => ({
  layout: "horizontal",
  selectedNodeId: FIRST_NODE,
  statuses: {},
  views: {
    horizontal: { viewport: { x: 0, y: 0, scale: 1 }, initialized: false },
    vertical: { viewport: { x: 0, y: 0, scale: 1 }, initialized: false },
  },
});
const keyFor = taskId => `learning-official-path:${taskId}`;
const object = value => value && typeof value === "object" && !Array.isArray(value);
const validViewport = value => ({
  x: Number.isFinite(value?.x) ? value.x : 0,
  y: Number.isFinite(value?.y) ? value.y : 0,
  scale: Number.isFinite(value?.scale) ? Math.max(MIN_SCALE, Math.min(1.6, value.scale)) : 1,
});

function restore(taskId) {
  const saved = readSession(keyFor(taskId), null);
  if (!object(saved)) return initial();
  const base = initial();
  const savedViews = object(saved.views) ? saved.views : {};
  const statuses = object(saved.statuses) ? Object.fromEntries(Object.entries(saved.statuses).filter(([id, status]) => NODE_IDS.has(id) && ["in-progress", "completed"].includes(status))) : {};
  return {
    ...base,
    layout: LAYOUTS.has(saved.layout) ? saved.layout : base.layout,
    selectedNodeId: NODE_IDS.has(saved.selectedNodeId) ? saved.selectedNodeId : base.selectedNodeId,
    statuses,
    views: Object.fromEntries([...LAYOUTS].map(layout => [layout, {
      viewport: validViewport(savedViews[layout]?.viewport),
      initialized: savedViews[layout]?.initialized === true,
    }])),
  };
}
export function useOfficialLearningPath({ taskId, enabled = true } = {}) {
  const tasks = useRef(new Map());
  const [, render] = useState(0);
  if (enabled && typeof taskId === "string" && !tasks.current.has(taskId)) tasks.current.set(taskId, restore(taskId));
  const state = enabled && typeof taskId === "string" ? tasks.current.get(taskId) || initial() : initial();
  const update = useCallback(change => {
    if (!enabled || typeof taskId !== "string") return;
    const previous = tasks.current.get(taskId) || initial();
    const next = typeof change === "function" ? change(previous) : { ...previous, ...change };
    if (next === previous) return;
    tasks.current.set(taskId, next);
    writeSession(keyFor(taskId), next);
    render(revision => revision + 1);
  }, [taskId, enabled]);
  const actions = useMemo(() => ({
    selectNode: id => {
      if (!NODE_IDS.has(id)) return;
      update(previous => previous.selectedNodeId === id ? previous : { ...previous, selectedNodeId: id });
    },
    startNode: id => {
      const node = getOfficialLearningNode(id);
      if (!node || node.kind !== "step") return;
      update(previous => ({ ...previous, selectedNodeId: id, statuses: { ...previous.statuses, [id]: "in-progress" } }));
    },
    completeNode: id => {
      const node = getOfficialLearningNode(id);
      if (!node || node.kind !== "step") return;
      update(previous => ({ ...previous, selectedNodeId: id, statuses: { ...previous.statuses, [id]: "completed" } }));
    },
    setLayout: layout => {
      if (!LAYOUTS.has(layout)) return;
      update(previous => previous.layout === layout ? previous : { ...previous, layout });
    },
    setViewport: viewport => {
      if (!object(viewport)) return;
      update(previous => {
        const current = previous.views[previous.layout]?.viewport || { x: 0, y: 0, scale: 1 };
        const nextViewport = validViewport({ ...current, ...viewport });
        if (current.x === nextViewport.x && current.y === nextViewport.y && current.scale === nextViewport.scale) return previous;
        return { ...previous, views: { ...previous.views, [previous.layout]: { ...previous.views[previous.layout], viewport: nextViewport } } };
      });
    },
    markInitialized: () => update(previous => previous.views[previous.layout].initialized ? previous : { ...previous, views: { ...previous.views, [previous.layout]: { ...previous.views[previous.layout], initialized: true } } }),
    reset: () => update(() => initial()),
  }), [update]);
  const view = state.views[state.layout] || { viewport: { x: 0, y: 0, scale: 1 }, initialized: false };
  return { state: { ...state, viewport: view.viewport, initialized: view.initialized }, actions };
}
