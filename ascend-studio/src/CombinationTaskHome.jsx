import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconSparkles, IconSend } from "@tabler/icons-react";
import {
  buildCompositionPrompt,
  compositionFields,
  connectedCompositionIds,
} from "./home-composition";
import "./combination-task-home.css";

const nodeMap = new Map(compositionFields.map((field) => [field.id, field]));
const pairKey = (from, to) => [from, to].sort().join("::");
const SOURCE_HOVER_DELAY = 280;
const TARGET_CONFIRM_DWELL = 680;

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
  const [geometry, setGeometry] = useState({ width: 0, height: 0, edges: [] });
  const [hoverSourceId, setHoverSourceId] = useState(null);
  const [hoverSourceCandidateId, setHoverSourceCandidateId] = useState(null);
  const [hoverTargetId, setHoverTargetId] = useState(null);
  const [hoverPreview, setHoverPreview] = useState(null);
  const [pendingKeyboardNode, setPendingKeyboardNode] = useState(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const sourceHoverTimerRef = useRef(null);
  const targetDwellTimerRef = useRef(null);
  const activeSourceRef = useRef(null);
  const sourceCandidateRef = useRef(null);
  const targetCandidateRef = useRef(null);
  const hoveredFieldRef = useRef(null);
  const pointerPositionRef = useRef(null);
  const cancelHoverRef = useRef(null);

  const selectedIds = connectedCompositionIds(connections, manuallySelected);
  const selectedSet = new Set(selectedIds);

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
    const observer = new ResizeObserver(updateGeometry);
    observer.observe(canvas);
    nodeRefs.current.forEach((node) => observer.observe(node));
    window.addEventListener("resize", updateGeometry);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateGeometry);
    };
  }, [connections]);

  useEffect(() => {
    setDraft(buildCompositionPrompt(selectedIds));
  }, [connections, manuallySelected]);

  const removeConnection = (from, to) => {
    const key = pairKey(from, to);
    setConnections((items) => items.filter((item) => pairKey(item.from, item.to) !== key));
  };

  const clearSourceHoverTimer = () => {
    window.clearTimeout(sourceHoverTimerRef.current);
    sourceHoverTimerRef.current = null;
  };

  const clearTargetDwellTimer = () => {
    window.clearTimeout(targetDwellTimerRef.current);
    targetDwellTimerRef.current = null;
  };

  const cancelHoverConnection = () => {
    clearSourceHoverTimer();
    clearTargetDwellTimer();
    activeSourceRef.current = null;
    sourceCandidateRef.current = null;
    targetCandidateRef.current = null;
    setHoverSourceId(null);
    setHoverSourceCandidateId(null);
    setHoverTargetId(null);
    setHoverPreview(null);
  };
  cancelHoverRef.current = cancelHoverConnection;

  const updateHoverPreview = (clientX, clientY, targetId = null) => {
    const sourceId = activeSourceRef.current;
    const sourceElement = sourceId ? nodeRefs.current.get(sourceId) : null;
    const canvas = canvasRef.current;
    if (!sourceElement || !canvas) {
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
    const key = pairKey(from, to);
    setConnections((items) => items.some((item) => pairKey(item.from, item.to) === key)
      ? items
      : [...items, { from, to }]);
    setError("");
  };

  const toggleConnection = (from, to) => {
    if (!from || !to || from === to) return;
    const key = pairKey(from, to);
    setConnections((items) => items.some((item) => pairKey(item.from, item.to) === key)
      ? items.filter((item) => pairKey(item.from, item.to) !== key)
      : [...items, { from, to }]);
    setError("");
  };

  const handleCanvasPointerMove = (event) => {
    pointerPositionRef.current = { clientX: event.clientX, clientY: event.clientY };
    const sourceId = activeSourceRef.current;
    if (!sourceId) return;
    const target = event.target.closest?.("[data-composition-field]");
    const targetId = target?.dataset.compositionField || null;
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
    if (!event.currentTarget.contains(event.relatedTarget)) cancelHoverConnection();
  };

  const handleFieldPointerEnter = (event, field) => {
    if (event.pointerType !== "mouse") return;
    pointerPositionRef.current = { clientX: event.clientX, clientY: event.clientY };
    hoveredFieldRef.current = field.id;
    clearSourceHoverTimer();

    const sourceId = activeSourceRef.current;
    if (sourceId) {
      if (sourceId === field.id) return;
      const duplicate = connections.some((item) => pairKey(item.from, item.to) === pairKey(sourceId, field.id));
      if (duplicate) {
        clearTargetDwellTimer();
        targetCandidateRef.current = null;
        setHoverTargetId(null);
        setHoverPreview(null);
        return;
      }
      clearTargetDwellTimer();
      targetCandidateRef.current = field.id;
      setHoverTargetId(field.id);
      updateHoverPreview(event.clientX, event.clientY, field.id);
      targetDwellTimerRef.current = window.setTimeout(() => {
        if (activeSourceRef.current !== sourceId || targetCandidateRef.current !== field.id) return;
        createConnection(sourceId, field.id);
        activeSourceRef.current = null;
        targetCandidateRef.current = null;
        setHoverSourceId(null);
        setHoverTargetId(null);
        setHoverPreview(null);
        setPendingKeyboardNode(null);
      }, TARGET_CONFIRM_DWELL);
      return;
    }

    sourceCandidateRef.current = field.id;
    setHoverSourceCandidateId(field.id);
    sourceHoverTimerRef.current = window.setTimeout(() => {
      if (sourceCandidateRef.current !== field.id || hoveredFieldRef.current !== field.id || activeSourceRef.current) return;
      sourceCandidateRef.current = null;
      activeSourceRef.current = field.id;
      setHoverSourceCandidateId(null);
      setHoverSourceId(field.id);
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
      cancelHoverConnection();
      toggleConnection(pendingKeyboardNode, field.id);
      setPendingKeyboardNode(null);
      return;
    }
    cancelHoverConnection();
    setManuallySelected((items) => items.includes(field.id) ? items.filter((id) => id !== field.id) : [...items, field.id]);
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
      if (event.key !== "Escape") return;
      cancelHoverRef.current?.();
      setPendingKeyboardNode(null);
    };
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
      window.clearTimeout(sourceHoverTimerRef.current);
      window.clearTimeout(targetDwellTimerRef.current);
    };
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const goal = draft.trim();
    if (!goal) {
      setError("先连接或选择一些训练字段，再发送需求。");
      return;
    }
    const created = onCreateTask?.({ goal, kind: "development", attachments: [], groupId: "other" });
    if (!created) setError("任务没有创建成功，请调整需求后重试。");
  };

  return <section className="combination-home" aria-label="训练与调优字段组合">
    <div
      className="combination-cloud"
      ref={canvasRef}
      onPointerMove={handleCanvasPointerMove}
      onPointerDown={handleCanvasPointerDown}
      onPointerLeave={handleCanvasPointerLeave}
    >
      <h1 className="combination-home__sr-only">训练与调优字段组合</h1>
      <svg className="combination-cloud__connections" width={geometry.width} height={geometry.height} viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true">
        {geometry.edges.map((edge) => <g key={pairKey(edge.from, edge.to)}>
          <path d={edge.path} className="combination-cloud__line" style={{ stroke: edge.color }} />
          <path d={edge.path} className="combination-cloud__line-hit" role="button" tabIndex="0" aria-label={`移除${nodeMap.get(edge.from)?.title}与${nodeMap.get(edge.to)?.title}的连线`} onClick={() => removeConnection(edge.from, edge.to)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === "Delete" || event.key === "Backspace") removeConnection(edge.from, edge.to); }} />
          <circle cx={edge.start.x} cy={edge.start.y} r="3.2" className="combination-cloud__endpoint" style={{ fill: edge.color }} />
          <circle cx={edge.end.x} cy={edge.end.y} r="3.2" className="combination-cloud__endpoint" style={{ fill: fieldTone(nodeMap.get(edge.to)) }} />
        </g>)}
        {hoverPreview && <path d={hoverPreview.path} className="combination-cloud__line-preview" style={{ stroke: hoverPreview.color }} />}
      </svg>
      {compositionFields.map((field) => <button
        key={field.id}
        ref={(node) => { if (node) nodeRefs.current.set(field.id, node); else nodeRefs.current.delete(field.id); }}
        className={`combination-field combination-field--${field.size} combination-field--${field.tone}${selectedSet.has(field.id) ? " is-connected" : ""}${pendingKeyboardNode === field.id || hoverSourceId === field.id ? " is-connection-source" : ""}${hoverSourceCandidateId === field.id ? " is-connection-candidate" : ""}${hoverTargetId === field.id ? " is-connection-target" : ""}`}
        type="button"
        data-composition-field={field.id}
        aria-pressed={selectedSet.has(field.id)}
        aria-label={`${field.title}。${field.hint}。悬浮片刻作为连线起点，移到其他字段并停留确认；点击加入或移除。按 Alt 加 Enter 可用键盘连线。`}
        style={{ "--field-x": `${field.x}%`, "--field-y": `${field.y}%`, "--field-color": `var(--composition-${field.tone})` }}
        onPointerEnter={(event) => handleFieldPointerEnter(event, field)}
        onPointerLeave={(event) => handleFieldPointerLeave(event, field)}
        onClick={(event) => handleFieldClick(event, field)}
        onKeyDown={(event) => handleFieldKeyDown(event, field)}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span className="combination-field__dot" aria-hidden="true" />
        {hoverTargetId === field.id && <svg className="combination-field__dwell" viewBox="0 0 22 22" aria-hidden="true">
          <circle cx="11" cy="11" r="8" pathLength="100" />
        </svg>}
        <span className="combination-field__title">{field.title}</span>
        <span className="combination-field__english">{field.english}</span>
        <span className="combination-field__hint">{field.hint}</span>
      </button>)}
    </div>

    <form className="combination-composer" onSubmit={submit}>
      <IconSparkles className="combination-composer__sparkle" size={19} aria-hidden="true" />
      <textarea
        aria-label="根据连接字段生成的需求草稿"
        value={draft}
        onChange={(event) => { setDraft(event.target.value); setError(""); }}
        onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submit(event); }}
        placeholder="连接训练目标、现象、环境和验证字段…"
        rows={2}
      />
      <button className="combination-composer__send" type="submit" aria-label="发送并开始" disabled={!draft.trim()}><IconSend size={19} aria-hidden="true" /></button>
    </form>
    {error && <p className="combination-home__error" role="alert">{error}</p>}
  </section>;
}
