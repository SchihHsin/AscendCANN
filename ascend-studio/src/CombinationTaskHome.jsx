import { ICON_SIZE } from "./icon-system.js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconArrowBackUp, IconArrowForwardUp, IconSparkles, IconSend, IconX } from "@tabler/icons-react";
import {
  buildCompositionPrompt,
  compositionFields,
  connectedCompositionIds,
  initialCompositionIds,
  orderedCompositionPath,
} from "./home-composition";
import { buildCompositionLearningPlan } from "./composition-learning-path.js";
import "./combination-task-home.css";

const nodeMap = new Map(compositionFields.map((field) => [field.id, field]));
const pairKey = (from, to) => [from, to].sort().join("::");
const SOURCE_HOVER_DELAY = 280;
const TARGET_CONFIRM_DWELL = 680;
const REQUIRED_POINTER_MOVEMENT = 14;

function satellitePosition(index, count) {
  const positions = {
    1: [[81, 50]],
    2: [[82, 32], [82, 68]],
    3: [[80, 22], [89, 50], [80, 78]],
    4: [[80, 14], [89, 38], [89, 62], [80, 86]],
    5: [[80, 9], [88, 29], [92, 50], [88, 71], [80, 91]],
  };
  return positions[count]?.[index] || [82, 50];
}

function pathRailPosition(index, count) {
  if (count <= 1) return { x: 16, y: 50 };
  const spread = Math.min(2, 0.7 + (count - 2) * 0.22);
  const position = -spread / 2 + index * (spread / (count - 1));
  return { x: 16 + 18 * position ** 2, y: 50 + 38 * position };
}

function pointAtEdge(rect, dx, dy, canvasRect) {
  const scale = Math.min(
    Math.abs(dx) > 0.001 ? rect.width / 2 / Math.abs(dx) : Infinity,
    Math.abs(dy) > 0.001 ? rect.height / 2 / Math.abs(dy) : Infinity,
  );
  return {
    x: rect.left + rect.width / 2 + dx * scale - canvasRect.left,
    y: rect.top + rect.height / 2 + dy * scale - canvasRect.top,
  };
}

function connectionPath(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const bend = Math.max(28, Math.min(150, Math.abs(dx) * 0.38 + Math.abs(dy) * 0.12));
  const direction = Math.sign(dx) || 1;
  return `M ${start.x} ${start.y} C ${start.x + bend * direction} ${start.y}, ${end.x - bend * direction} ${end.y}, ${end.x} ${end.y}`;
}

function fieldTone(field) {
  return `var(--composition-${field?.tone || "blue"})`;
}

function previewPoints(node, canvas, clientX, clientY) {
  const centerX = node.left + node.width / 2;
  const centerY = node.top + node.height / 2;
  const dx = clientX - centerX || 1;
  const dy = clientY - centerY || 1;
  return {
    start: pointAtEdge(node, dx, dy, canvas),
    end: { x: clientX - canvas.left, y: clientY - canvas.top },
  };
}

function previewBetweenNodes(source, target, canvas, clientX, clientY) {
  if (!target) return previewPoints(source, canvas, clientX, clientY);
  const dx = target.left + target.width / 2 - source.left - source.width / 2;
  const dy = target.top + target.height / 2 - source.top - source.height / 2;
  return {
    start: pointAtEdge(source, dx, dy, canvas),
    end: pointAtEdge(target, -dx, -dy, canvas),
  };
}

export function CombinationTaskHome({ onCreateTask }) {
  const [connections, setConnections] = useState([]);
  const [manuallySelected, setManuallySelected] = useState([]);
  const [historyAvailability, setHistoryAvailability] = useState({ canUndo: false, canRedo: false });
  const [geometry, setGeometry] = useState({ width: 0, height: 0, edges: [] });
  const [hoverSourceId, setHoverSourceId] = useState(null);
  const [hoverSourceCandidateId, setHoverSourceCandidateId] = useState(null);
  const [hoverTargetId, setHoverTargetId] = useState(null);
  const [hoverPreview, setHoverPreview] = useState(null);
  const [pendingKeyboardNode, setPendingKeyboardNode] = useState(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const homeRef = useRef(null);
  const canvasRef = useRef(null);
  const ambientRef = useRef(null);
  const ambientFrameRef = useRef(0);
  const ambientTargetRef = useRef(null);
  const ambientCurrentRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const sourceHoverTimerRef = useRef(null);
  const targetDwellTimerRef = useRef(null);
  const sourceTimerGenerationRef = useRef(0);
  const targetTimerGenerationRef = useRef(0);
  const activeSourceRef = useRef(null);
  const sourceCandidateRef = useRef(null);
  const targetCandidateRef = useRef(null);
  const hoveredFieldRef = useRef(null);
  const pointerPositionRef = useRef(null);
  const cancelHoverRef = useRef(null);
  const focusRearmRef = useRef(null);
  const compositionRef = useRef({ connections: [], manuallySelected: [] });
  const compositionHistoryRef = useRef({ past: [], future: [] });
  const focusFieldRef = useRef(null);
  const undoCompositionRef = useRef(null);
  const redoCompositionRef = useRef(null);

  const setFocusedField = (fieldId) => {
    focusFieldRef.current = fieldId;
    setHoverSourceId(fieldId);
  };

  const selectedIds = connectedCompositionIds(connections, manuallySelected);
  const selectedSet = new Set(selectedIds);
  const pathIds = orderedCompositionPath(connections);
  const focusedField = nodeMap.get(hoverSourceId);
  const expandedIds = focusedField?.related || [];
  const visibleIds = hoverSourceId
    ? new Set([hoverSourceId, ...pathIds, ...expandedIds, ...manuallySelected])
    : new Set([...initialCompositionIds, ...selectedIds]);
  const visibleFields = compositionFields.filter((field) => visibleIds.has(field.id));
  const focusPositions = new Map();
  if (hoverSourceId) {
    focusPositions.set(hoverSourceId, { x: 50, y: 50 });
    const leftRailIds = [
      ...pathIds.filter((id) => id !== hoverSourceId),
      ...manuallySelected.filter((id) => id !== hoverSourceId && !pathIds.includes(id)),
    ];
    leftRailIds.forEach((id, index) => {
      focusPositions.set(id, pathRailPosition(index, leftRailIds.length));
    });
    expandedIds.forEach((id, index) => {
      if (!focusPositions.has(id)) {
        const [x, y] = satellitePosition(index, expandedIds.length);
        focusPositions.set(id, { x, y });
      }
    });
  }

  const updateGeometry = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const centers = new Map();
    nodeRefs.current.forEach((node, id) => {
      const rect = node.getBoundingClientRect();
      centers.set(id, { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    });
    const edges = connections.flatMap((connection) => {
      const source = centers.get(connection.from);
      const target = centers.get(connection.to);
      if (!source || !target) return [];
      const dx = target.left + target.width / 2 - source.left - source.width / 2;
      const dy = target.top + target.height / 2 - source.top - source.height / 2;
      const start = pointAtEdge(source, dx, dy, canvasRect);
      const end = pointAtEdge(target, -dx, -dy, canvasRect);
      return [{
        ...connection,
        start,
        end,
        path: connectionPath(start, end),
        color: fieldTone(nodeMap.get(connection.from)),
      }];
    });
    setGeometry({ width: canvasRect.width, height: canvasRect.height, edges });
  };

  useLayoutEffect(() => {
    updateGeometry();
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let animationFrame = 0;
    const animationStart = performance.now();
    const measureTransition = (now) => {
      updateGeometry();
      if (now - animationStart < 620) animationFrame = window.requestAnimationFrame(measureTransition);
    };
    animationFrame = window.requestAnimationFrame(measureTransition);
    const observer = new ResizeObserver(updateGeometry);
    observer.observe(canvas);
    nodeRefs.current.forEach((node) => observer.observe(node));
    window.addEventListener("resize", updateGeometry);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", updateGeometry);
    };
  }, [connections, hoverSourceId]);

  useEffect(() => {
    setDraft(buildCompositionPrompt(selectedIds));
  }, [connections, manuallySelected]);

  const captureComposition = () => ({
    ...compositionRef.current,
    focusId: focusFieldRef.current,
  });

  const updateHistoryAvailability = () => {
    setHistoryAvailability({
      canUndo: compositionHistoryRef.current.past.length > 0,
      canRedo: compositionHistoryRef.current.future.length > 0,
    });
  };

  const applyCompositionSnapshot = (snapshot) => {
    compositionRef.current = {
      connections: snapshot.connections,
      manuallySelected: snapshot.manuallySelected,
    };
    setConnections(snapshot.connections);
    setManuallySelected(snapshot.manuallySelected);
    setFocusedField(snapshot.focusId || null);
  };

  const recordCompositionChange = (nextConnections, nextManuallySelected, focusId = focusFieldRef.current) => {
    const current = captureComposition();
    const sameConnections = current.connections.length === nextConnections.length
      && current.connections.every((edge, index) => edge.from === nextConnections[index]?.from && edge.to === nextConnections[index]?.to);
    const sameManualSelection = current.manuallySelected.length === nextManuallySelected.length
      && current.manuallySelected.every((id, index) => id === nextManuallySelected[index]);
    if (sameConnections && sameManualSelection) return false;

    const past = [...compositionHistoryRef.current.past, current].slice(-50);
    compositionHistoryRef.current = { past, future: [] };
    compositionRef.current = { connections: nextConnections, manuallySelected: nextManuallySelected };
    setConnections(nextConnections);
    setManuallySelected(nextManuallySelected);
    setFocusedField(focusId);
    updateHistoryAvailability();
    return true;
  };

  const removeConnection = (from, to) => {
    const key = pairKey(from, to);
    const current = compositionRef.current;
    recordCompositionChange(
      current.connections.filter((item) => pairKey(item.from, item.to) !== key),
      current.manuallySelected,
    );
  };

  const clearSourceHoverTimer = () => {
    sourceTimerGenerationRef.current += 1;
    window.clearTimeout(sourceHoverTimerRef.current);
    sourceHoverTimerRef.current = null;
  };

  const clearTargetDwellTimer = () => {
    targetTimerGenerationRef.current += 1;
    window.clearTimeout(targetDwellTimerRef.current);
    targetDwellTimerRef.current = null;
  };

  const clearPendingHover = () => {
    clearSourceHoverTimer();
    clearTargetDwellTimer();
    activeSourceRef.current = null;
    focusRearmRef.current = null;
    sourceCandidateRef.current = null;
    targetCandidateRef.current = null;
    hoveredFieldRef.current = null;
    setHoverSourceCandidateId(null);
    setHoverTargetId(null);
    setHoverPreview(null);
    setPendingKeyboardNode(null);
  };

  const cancelHoverConnection = () => {
    clearPendingHover();
    setFocusedField(null);
  };
  cancelHoverRef.current = cancelHoverConnection;

  const undoComposition = () => {
    const { past, future } = compositionHistoryRef.current;
    if (!past.length) return;
    const previous = past[past.length - 1];
    const current = captureComposition();
    compositionHistoryRef.current = {
      past: past.slice(0, -1),
      future: [...future, current].slice(-50),
    };
    clearPendingHover();
    applyCompositionSnapshot(previous);
    updateHistoryAvailability();
    setError("");
  };

  const redoComposition = () => {
    const { past, future } = compositionHistoryRef.current;
    if (!future.length) return;
    const next = future[future.length - 1];
    const current = captureComposition();
    compositionHistoryRef.current = {
      past: [...past, current].slice(-50),
      future: future.slice(0, -1),
    };
    clearPendingHover();
    applyCompositionSnapshot(next);
    updateHistoryAvailability();
    setError("");
  };
  undoCompositionRef.current = undoComposition;
  redoCompositionRef.current = redoComposition;

  const updateHoverPreview = (clientX, clientY, targetId = null) => {
    const sourceId = activeSourceRef.current;
    const sourceElement = sourceId ? nodeRefs.current.get(sourceId) : null;
    const canvas = canvasRef.current;
    if (!sourceElement || !canvas || !nodeMap.get(sourceId)?.related.length) {
      setHoverPreview(null);
      return;
    }
    const canvasRect = canvas.getBoundingClientRect();
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetElement = targetId && targetId !== sourceId ? nodeRefs.current.get(targetId) : null;
    const targetRect = targetElement?.getBoundingClientRect();
    const points = previewBetweenNodes(sourceRect, targetRect, canvasRect, clientX, clientY);
    setHoverPreview({
      sourceId,
      path: connectionPath(points.start, points.end),
      color: fieldTone(nodeMap.get(sourceId)),
    });
  };

  const createConnection = (from, to) => {
    if (!from || !to || from === to) return;
    const current = compositionRef.current;
    if (orderedCompositionPath(current.connections).includes(to)) return;
    const key = pairKey(from, to);
    if (current.connections.some((item) => pairKey(item.from, item.to) === key)) return;
    recordCompositionChange([...current.connections, { from, to }], current.manuallySelected, to);
    setError("");
  };

  const toggleConnection = (from, to) => {
    if (!from || !to || from === to) return;
    const current = compositionRef.current;
    const key = pairKey(from, to);
    const exists = current.connections.some((item) => pairKey(item.from, item.to) === key);
    const nextConnections = exists
      ? current.connections.filter((item) => pairKey(item.from, item.to) !== key)
      : [...current.connections, { from, to }];
    recordCompositionChange(nextConnections, current.manuallySelected, null);
    setError("");
  };

  const toggleFieldSelection = (fieldId) => {
    const current = compositionRef.current;
    const isSelected = connectedCompositionIds(current.connections, current.manuallySelected).includes(fieldId);
    let nextConnections = current.connections;
    let nextManuallySelected;

    if (!isSelected) {
      nextManuallySelected = [...current.manuallySelected, fieldId];
    } else {
      nextManuallySelected = current.manuallySelected.filter((id) => id !== fieldId);
      const path = orderedCompositionPath(current.connections);
      const fieldIndex = path.indexOf(fieldId);
      if (fieldIndex >= 0) {
        const retainedPrefix = path.slice(0, fieldIndex);
        const retainedPath = new Set(retainedPrefix);
        nextConnections = current.connections.filter(({ from, to }) => retainedPath.has(from) && retainedPath.has(to));
        nextManuallySelected = [...new Set([...nextManuallySelected, ...retainedPrefix])];
      }
    }

    recordCompositionChange(nextConnections, nextManuallySelected, null);
    setError("");
  };

  const startTargetDwell = (sourceId, targetId, clientX, clientY) => {
    if (!sourceId || !targetId || sourceId === targetId || !nodeMap.get(sourceId)?.related.length) {
      clearTargetDwellTimer();
      targetCandidateRef.current = null;
      setHoverTargetId(null);
      setHoverPreview(null);
      return;
    }
    const alreadyConnected = connections.some((item) => pairKey(item.from, item.to) === pairKey(sourceId, targetId));
    if (alreadyConnected || orderedCompositionPath(connections).includes(targetId)) {
      clearTargetDwellTimer();
      targetCandidateRef.current = null;
      setHoverTargetId(null);
      setHoverPreview(null);
      return;
    }

    clearTargetDwellTimer();
    targetCandidateRef.current = targetId;
    setHoverTargetId(targetId);
    updateHoverPreview(clientX, clientY, targetId);
    const generation = ++targetTimerGenerationRef.current;
    targetDwellTimerRef.current = window.setTimeout(() => {
      const pointer = pointerPositionRef.current;
      const hoveredField = pointer
        ? document.elementFromPoint(pointer.clientX, pointer.clientY)?.closest?.("[data-composition-field]")
        : null;
      if (
        targetTimerGenerationRef.current !== generation
        || activeSourceRef.current !== sourceId
        || targetCandidateRef.current !== targetId
        || hoveredField?.dataset.compositionField !== targetId
      ) return;
      clearTargetDwellTimer();
      createConnection(sourceId, targetId);
      const canContinue = Boolean(nodeMap.get(targetId)?.related.length);
      activeSourceRef.current = canContinue ? targetId : null;
      focusRearmRef.current = canContinue ? (pointer ? { ...pointer } : { clientX, clientY }) : null;
      targetCandidateRef.current = null;
      setHoverSourceCandidateId(null);
      setHoverTargetId(null);
      setHoverPreview(null);
      setPendingKeyboardNode(null);
    }, TARGET_CONFIRM_DWELL);
  };

  const updateAmbientPointer = (event) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const home = homeRef.current;
    const glow = ambientRef.current;
    if (!home || !glow) return;
    const rect = home.getBoundingClientRect();
    const next = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    ambientTargetRef.current = next;
    if (!ambientCurrentRef.current) {
      ambientCurrentRef.current = next;
      glow.style.transform = `translate3d(${next.x - rect.width / 2}px, ${next.y - rect.height / 2}px, 0) translate(-50%, -50%)`;
    }
    glow.classList.add("is-active");
    if (ambientFrameRef.current) return;

    const follow = () => {
      const current = ambientCurrentRef.current;
      const target = ambientTargetRef.current;
      const bounds = homeRef.current?.getBoundingClientRect();
      const activeGlow = ambientRef.current;
      if (!current || !target || !bounds || !activeGlow) {
        ambientFrameRef.current = 0;
        return;
      }
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      activeGlow.style.transform = `translate3d(${current.x - bounds.width / 2}px, ${current.y - bounds.height / 2}px, 0) translate(-50%, -50%)`;
      if (Math.hypot(target.x - current.x, target.y - current.y) > 0.35) {
        ambientFrameRef.current = window.requestAnimationFrame(follow);
      } else {
        current.x = target.x;
        current.y = target.y;
        ambientFrameRef.current = 0;
      }
    };
    ambientFrameRef.current = window.requestAnimationFrame(follow);
  };

  const handleHomePointerMove = (event) => updateAmbientPointer(event);

  const handleHomePointerLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) ambientRef.current?.classList.remove("is-active");
  };

  const handleCanvasPointerMove = (event) => {
    pointerPositionRef.current = { clientX: event.clientX, clientY: event.clientY };
    const sourceId = activeSourceRef.current;
    if (!sourceId) return;
    if (!nodeMap.get(sourceId)?.related.length) {
      setHoverPreview(null);
      return;
    }
    const target = event.target.closest?.("[data-composition-field]");
    const targetId = target?.dataset.compositionField || null;
    const rearmPoint = focusRearmRef.current;
    if (rearmPoint) {
      const movement = Math.hypot(event.clientX - rearmPoint.clientX, event.clientY - rearmPoint.clientY);
      if (movement < REQUIRED_POINTER_MOVEMENT) return;
      focusRearmRef.current = null;
      if (targetId && targetId !== sourceId) {
        startTargetDwell(sourceId, targetId, event.clientX, event.clientY);
      }
      return;
    }
    if (targetId === sourceId) {
      setHoverPreview(null);
      return;
    }
    const duplicate = targetId && connections.some((item) => pairKey(item.from, item.to) === pairKey(sourceId, targetId));
    if (duplicate) {
      setHoverPreview(null);
      return;
    }
    updateHoverPreview(event.clientX, event.clientY, targetId);
  };

  const handleCanvasPointerDown = (event) => {
    if (!event.target.closest?.("[data-composition-field]")) cancelHoverConnection();
  };

  const handleCanvasPointerLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      ambientRef.current?.classList.remove("is-active");
      clearPendingHover();
    }
  };

  const handleFieldPointerEnter = (event, field) => {
    if (event.pointerType !== "mouse") return;
    pointerPositionRef.current = { clientX: event.clientX, clientY: event.clientY };
    hoveredFieldRef.current = field.id;
    clearSourceHoverTimer();

    const sourceId = activeSourceRef.current;
    if (sourceId) {
      if (sourceId === field.id) return;
      const rearmPoint = focusRearmRef.current;
      if (rearmPoint) {
        const movement = Math.hypot(event.clientX - rearmPoint.clientX, event.clientY - rearmPoint.clientY);
        if (movement < REQUIRED_POINTER_MOVEMENT) return;
        focusRearmRef.current = null;
      }
      startTargetDwell(sourceId, field.id, event.clientX, event.clientY);
      return;
    }

    sourceCandidateRef.current = field.id;
    if (field.related.length) setHoverSourceCandidateId(field.id);
    const generation = ++sourceTimerGenerationRef.current;
    sourceHoverTimerRef.current = window.setTimeout(() => {
      if (
        sourceTimerGenerationRef.current !== generation
        || sourceCandidateRef.current !== field.id
        || hoveredFieldRef.current !== field.id
        || activeSourceRef.current
      ) return;
      clearSourceHoverTimer();
      sourceCandidateRef.current = null;
      const pointer = pointerPositionRef.current;
      const canContinue = field.related.length > 0;
      focusRearmRef.current = canContinue && pointer ? { ...pointer } : null;
      activeSourceRef.current = canContinue ? field.id : null;
      setHoverSourceCandidateId(null);
      setFocusedField(field.id);
      setPendingKeyboardNode(null);
      setHoverPreview(null);
    }, SOURCE_HOVER_DELAY);
  };

  const handleFieldPointerLeave = (event, field) => {
    if (event.pointerType !== "mouse") return;
    if (hoveredFieldRef.current === field.id) hoveredFieldRef.current = null;
    if (sourceCandidateRef.current === field.id) {
      clearSourceHoverTimer();
      sourceCandidateRef.current = null;
      setHoverSourceCandidateId(null);
    }
    if (targetCandidateRef.current === field.id) {
      clearTargetDwellTimer();
      targetCandidateRef.current = null;
      setHoverTargetId(null);
    }
  };

  const handleFieldClick = (event, field) => {
    if (event.detail === 0 && pendingKeyboardNode) {
      clearPendingHover();
      toggleConnection(pendingKeyboardNode, field.id);
      setPendingKeyboardNode(null);
      return;
    }
    clearPendingHover();
    toggleFieldSelection(field.id);
  };

  const handleFieldKeyDown = (event, field) => {
    if (event.altKey && event.key === "Enter") {
      event.preventDefault();
      cancelHoverConnection();
      if (pendingKeyboardNode && pendingKeyboardNode !== field.id) {
        toggleConnection(pendingKeyboardNode, field.id);
        setPendingKeyboardNode(null);
      } else {
        setPendingKeyboardNode(field.id);
      }
    }
    if (event.key === "Escape") {
      cancelHoverConnection();
      setPendingKeyboardNode(null);
    }
  };

  useEffect(() => {
    const handleWindowKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const hasModifier = event.metaKey || event.ctrlKey;
      if (hasModifier && (key === "z" || key === "y")) {
        if (event.target?.closest?.("textarea, input, [contenteditable='true']")) return;
        event.preventDefault();
        const shouldRedo = key === "y" || (key === "z" && event.shiftKey);
        (shouldRedo ? redoCompositionRef.current : undoCompositionRef.current)?.();
        return;
      }
      if (event.key === "Escape") {
        cancelHoverRef.current?.();
        setPendingKeyboardNode(null);
      }
    };
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
      window.clearTimeout(sourceHoverTimerRef.current);
      window.clearTimeout(targetDwellTimerRef.current);
      window.cancelAnimationFrame(ambientFrameRef.current);
    };
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const goal = draft.trim();
    if (!goal) {
      setError("先连接或选择一些字段，再发送需求。");
      return;
    }
    const compositionPlan = buildCompositionLearningPlan({
      fieldIds: selectedIds,
      connectionPath: pathIds,
      prompt: goal,
    });
    const created = onCreateTask?.({ goal, kind: "learning", attachments: [], groupId: "other", compositionPlan });
    if (!created) setError("任务没有创建成功，请调整需求后重试。");
  };

  return <section
    ref={homeRef}
    className={`combination-home${hoverSourceId ? " has-focused-field" : ""}`}
    aria-label="基于场景的关联探索"
    onPointerMove={handleHomePointerMove}
    onPointerLeave={handleHomePointerLeave}
  >
    <div
      ref={ambientRef}
      className="combination-home__cursor-glow"
      aria-hidden="true"
    />
    <header className="combination-home__heading">
      <span>EXPLORE PROBLEMS AND PATHS FROM YOUR CONTEXT</span>
      <h1 className="combination-home__title">从你的场景出发，探索问题与路径</h1>
    </header>
    <div
      className="combination-cloud"
      ref={canvasRef}
      onPointerMove={handleCanvasPointerMove}
      onPointerDown={handleCanvasPointerDown}
      onPointerLeave={handleCanvasPointerLeave}
    >
      <svg className="combination-cloud__connections" width={geometry.width} height={geometry.height} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true">
        {geometry.edges.map((edge) => <g key={pairKey(edge.from, edge.to)}>
          <path d={edge.path} className="combination-cloud__line" style={{ stroke: edge.color }} />
          <path d={edge.path} className="combination-cloud__line-hit" role="button" tabIndex="0" aria-label={`移除${nodeMap.get(edge.from)?.title}与${nodeMap.get(edge.to)?.title}的连线`} onClick={() => removeConnection(edge.from, edge.to)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === "Delete" || event.key === "Backspace") removeConnection(edge.from, edge.to); }} />
          <circle cx={edge.start.x} cy={edge.start.y} r="3.2" className="combination-cloud__endpoint" style={{ fill: edge.color }} />
          <circle cx={edge.end.x} cy={edge.end.y} r="3.2" className="combination-cloud__endpoint" style={{ fill: fieldTone(nodeMap.get(edge.to)) }} />
        </g>)}
        {hoverPreview && <path d={hoverPreview.path} className="combination-cloud__line-preview" style={{ stroke: hoverPreview.color }} />}
      </svg>
      {visibleFields.map((field) => {
        const position = focusPositions.get(field.id) || { x: field.x, y: field.y };
        const isFocused = hoverSourceId === field.id;
        const isExpanded = expandedIds.includes(field.id) && !isFocused;
        const isPath = pathIds.includes(field.id);
        const revealHint = isFocused || hoverSourceCandidateId === field.id || hoverTargetId === field.id;
        const showDwell = hoverSourceCandidateId === field.id || hoverTargetId === field.id;
        const dwellDuration = hoverTargetId === field.id ? TARGET_CONFIRM_DWELL : SOURCE_HOVER_DELAY;
        return <button
          key={field.id}
          ref={(node) => { if (node) nodeRefs.current.set(field.id, node); else nodeRefs.current.delete(field.id); }}
          className={`combination-field combination-field--${field.size} combination-field--${field.tone}${selectedSet.has(field.id) ? " is-connected" : ""}${pendingKeyboardNode === field.id || isFocused ? " is-connection-source" : ""}${hoverSourceCandidateId === field.id ? " is-connection-candidate" : ""}${hoverTargetId === field.id ? " is-connection-target" : ""}${isFocused ? " is-focus-center" : ""}${isExpanded ? " is-expanded-neighbor" : ""}${isPath ? " is-composition-path" : ""}`}
          type="button"
          data-composition-field={field.id}
          aria-pressed={selectedSet.has(field.id)}
          aria-label={`${field.title}。${field.hint}。${selectedSet.has(field.id) ? (isPath ? "已选中；再次点击取消。若处于连续路径中，会同时移除它之后的路径。" : "已选中；再次点击取消此字段。") : "悬浮片刻作为连线起点，移到其他字段并停留确认；确认后从目标继续连线。点击加入。"}按 Alt 加 Enter 可用键盘连线。`}
          title={selectedSet.has(field.id) ? (isPath ? "再次点击取消此字段及其后的路径" : "再次点击取消此字段") : "点击加入组合"}
          style={{ "--field-x": `${position.x}%`, "--field-y": `${position.y}%`, "--field-color": `var(--composition-${field.tone})`, "--dwell-duration": `${dwellDuration}ms`, "--field-order": visibleFields.indexOf(field) }}
          onPointerEnter={(event) => handleFieldPointerEnter(event, field)}
          onPointerLeave={(event) => handleFieldPointerLeave(event, field)}
          onClick={(event) => handleFieldClick(event, field)}
          onKeyDown={(event) => handleFieldKeyDown(event, field)}
          onContextMenu={(event) => event.preventDefault()}
        >
          <span className="combination-field__dot" aria-hidden="true" />
          {showDwell && <svg className="combination-field__dwell" viewBox="0 0 22 22" aria-hidden="true">
            <circle cx="11" cy="11" r="8" pathLength="100" />
          </svg>}
          {selectedSet.has(field.id) && <span className="combination-field__remove" aria-hidden="true"><IconX size={12} stroke={1.8} /></span>}
          <span className="combination-field__english">{field.english}</span>
          <span className="combination-field__title">{field.title}</span>
          {revealHint && <span className="combination-field__hint">{field.hint}</span>}
        </button>;
      })}
    </div>

    <form className="combination-composer" onSubmit={submit}>
      <IconSparkles className="combination-composer__sparkle" size={ICON_SIZE.navigation} aria-hidden="true" />
      <textarea
        aria-label="根据连接字段生成的需求草稿"
        value={draft}
        onChange={(event) => { setDraft(event.target.value); setError(""); }}
        onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submit(event); }}
        placeholder="连接目标、线索、条件与验证方式…"
        rows={2}
      />
      <div className="combination-composer__history" role="group" aria-label="组合操作历史">
        <button
          className="combination-composer__history-button"
          type="button"
          onClick={undoComposition}
          disabled={!historyAvailability.canUndo}
          aria-label="撤销上一步选择或连线"
          title="撤销上一步（⌘Z / Ctrl+Z）"
        >
          <IconArrowBackUp size={16} stroke={1.8} aria-hidden="true" />
          <span>撤销</span>
        </button>
        <button
          className="combination-composer__history-button"
          type="button"
          onClick={redoComposition}
          disabled={!historyAvailability.canRedo}
          aria-label="重做上一步选择或连线"
          title="重做上一步（⌘⇧Z / Ctrl+Y）"
        >
          <IconArrowForwardUp size={16} stroke={1.8} aria-hidden="true" />
          <span>重做</span>
        </button>
      </div>
      <button className="combination-composer__send" type="submit" aria-label="发送并开始" disabled={!draft.trim()}><IconSend size={ICON_SIZE.navigation} aria-hidden="true" /></button>
    </form>
    {error && <p className="combination-home__error" role="alert">{error}</p>}
  </section>;
}
