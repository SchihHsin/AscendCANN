import { useEffect, useLayoutEffect, useRef, useState } from "react";

const COLLAPSED_PROJECTS = 18;
const MIN_PROJECTS = 200;
const MAX_PROJECTS = 520;
const MIN_CONVERSATION = 300;
const MIN_CANVAS = 360;
const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));
const pixels = (value) => `${Math.round(value * 1000) / 1000}px`;
const initialPreferences = () => ({ projects: null, conversationRatio: null });

function resolveLayout(size, preferences, sidebarCollapsed) {
  if (size.windowWidth <= 980 || !size.width) return null;
  const compact = size.windowWidth <= 1240;
  const defaultProjects = compact ? 260 : Math.max(286, size.windowWidth * 0.22);
  const expandedProjects = preferences.projects === null
    ? defaultProjects
    : clamp(preferences.projects, MIN_PROJECTS, Math.min(MAX_PROJECTS, size.width - MIN_CONVERSATION - MIN_CANVAS));
  const defaultRemaining = Math.max(0, size.width - expandedProjects);
  const defaultCanvas = Math.max(compact ? 420 : 500, defaultRemaining * (compact ? 0.48 : 0.45));
  const defaultConversation = Math.max(0, defaultRemaining - defaultCanvas);
  const defaultRatio = defaultRemaining ? defaultConversation / defaultRemaining : 0.55;
  const projects = sidebarCollapsed ? COLLAPSED_PROJECTS : expandedProjects;
  const remaining = Math.max(0, size.width - projects);
  const conversation = preferences.conversationRatio === null && !sidebarCollapsed
    ? defaultConversation
    : clamp(remaining * (preferences.conversationRatio ?? defaultRatio), MIN_CONVERSATION, remaining - MIN_CANVAS);
  return { total: size.width, projects, conversation, canvas: remaining - conversation };
}

function bounds(kind, layout) {
  return kind === "projects"
    ? { min: MIN_PROJECTS, max: Math.min(MAX_PROJECTS, layout.total - layout.canvas - MIN_CONVERSATION), now: layout.projects }
    : { min: MIN_CONVERSATION, max: layout.total - layout.projects - MIN_CANVAS, now: layout.conversation };
}

export function useWorkbenchLayout({ sidebarCollapsed }) {
  const workspaceRef = useRef(null);
  const dragRef = useRef(null);
  const currentRef = useRef(null);
  const [size, setSize] = useState({ width: 0, windowWidth: 0 });
  const [preferences, setPreferences] = useState(initialPreferences);
  const [dragging, setDragging] = useState(null);
  const layout = resolveLayout(size, preferences, sidebarCollapsed);
  currentRef.current = { layout, preferences, sidebarCollapsed };

  function endDrag(updateState = true) {
    const active = dragRef.current;
    dragRef.current = null;
    if (active?.element.hasPointerCapture(active.pointerId)) {
      active.element.releasePointerCapture(active.pointerId);
    }
    if (updateState) setDragging(null);
  }

  useLayoutEffect(() => {
    const element = workspaceRef.current;
    if (!element) return undefined;
    let lastWidth = 0;
    let lastWindowWidth = 0;
    const measure = () => {
      const width = element.getBoundingClientRect().width;
      const windowWidth = window.innerWidth;
      if (Math.abs(width - lastWidth) < 0.1 && windowWidth === lastWindowWidth) return;
      lastWidth = width;
      lastWindowWidth = windowWidth;
      endDrag();
      setSize({ width, windowWidth });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      endDrag(false);
    };
  }, []);

  useEffect(() => {
    if (dragRef.current) endDrag();
  }, [sidebarCollapsed]);

  function updateBoundary(kind, start, delta) {
    const current = currentRef.current;
    if (!current.layout || (kind === "projects" && current.sidebarCollapsed)) return;
    const limits = bounds(kind, start);
    const width = clamp(limits.now + delta, limits.min, limits.max);
    let next;
    if (kind === "projects") {
      const remaining = start.total - width;
      next = { projects: width, conversationRatio: (remaining - start.canvas) / remaining };
    } else {
      next = { ...current.preferences, conversationRatio: width / (start.total - start.projects) };
    }
    currentRef.current = { ...current, preferences: next };
    setPreferences(next);
  }

  function pointerMove(event) {
    const active = dragRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    updateBoundary(active.kind, active.layout, event.clientX - active.clientX);
  }

  function pointerEnd(event) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    if (event.type === "pointerup") pointerMove(event);
    endDrag();
  }

  function separatorProps(kind) {
    const limits = layout ? bounds(kind, layout) : { min: 0, max: 0, now: 0 };
    const disabled = !layout || (kind === "projects" && sidebarCollapsed);
    return {
      "aria-orientation": "vertical",
      "aria-disabled": disabled || undefined,
      "aria-valuemin": Math.round(limits.min),
      "aria-valuemax": Math.round(Math.max(limits.min, limits.max)),
      "aria-valuenow": Math.round(limits.now),
      "aria-valuetext": `${Math.round(limits.now)} px`,
      onPointerDown: (event) => {
        const current = currentRef.current;
        if (event.button !== 0 || !event.isPrimary || dragRef.current || !current.layout || (kind === "projects" && current.sidebarCollapsed)) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { kind, pointerId: event.pointerId, clientX: event.clientX, layout: current.layout, element: event.currentTarget };
        setDragging(kind);
      },
      onPointerMove: pointerMove,
      onPointerUp: pointerEnd,
      onPointerCancel: pointerEnd,
      onLostPointerCapture: pointerEnd,
      onKeyDown: (event) => {
        const current = currentRef.current;
        if (!current.layout || (kind === "projects" && current.sidebarCollapsed)) return;
        const activeLimits = bounds(kind, current.layout);
        const step = event.shiftKey ? 64 : 16;
        const deltas = {
          ArrowLeft: -step,
          ArrowRight: step,
          Home: activeLimits.min - activeLimits.now,
          End: activeLimits.max - activeLimits.now,
        };
        if (!Object.prototype.hasOwnProperty.call(deltas, event.key)) return;
        event.preventDefault();
        endDrag();
        updateBoundary(kind, current.layout, deltas[event.key]);
      },
      onDoubleClick: (event) => {
        const current = currentRef.current;
        if (!current.layout || (kind === "projects" && current.sidebarCollapsed)) return;
        event.preventDefault();
        endDrag();
        const next = initialPreferences();
        currentRef.current = { ...current, preferences: next };
        setPreferences(next);
      },
    };
  }

  return {
    workspaceRef,
    dragging,
    separatorProps,
    style: layout ? {
      gridTemplateColumns: `${pixels(layout.projects)} ${pixels(layout.conversation)} ${pixels(layout.canvas)}`,
      "--projects-edge": pixels(layout.projects),
      "--conversation-edge": pixels(layout.projects + layout.conversation),
    } : {},
  };
}
