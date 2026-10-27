import { ICON_SIZE } from "./icon-system.js";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowsDiagonal,
  IconChevronDown,
  IconChevronRight,
  IconCheck,
  IconFocus2,
  IconGripVertical,
  IconHandMove,
  IconLayoutBoard,
  IconLayoutColumns,
  IconLayoutList,
  IconMaximize,
  IconNotes,
  IconPin,
  IconPencil,
  IconPlus,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { ADD_CUSTOM_LAYOUT_GROUPS, addCustomGroupKey } from "./addcustom-canvas-layout";
import { CanvasCardActions, CanvasCardButton, CanvasCardFrame, CanvasCardHeader, CanvasFitIcon, CanvasMiniMap, CanvasSurface, CanvasToolButton, CanvasToolbar, CanvasToolbarGroup, CanvasZoomGroup } from "./shared/canvas/index.jsx";
import CanvasDrawingSurface from "./shared/canvas/CanvasDrawingSurface.jsx";
import { useCanvasDrawing } from "./shared/canvas/useCanvasDrawing.js";
import "./task-canvas.css";

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 1.5;
const COLLAPSED_HEIGHT = 44;

const clampZoom = (zoom) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
const editableTarget = (target) => target instanceof Element && Boolean(target.closest("input,textarea,select,[contenteditable=true]"));
const floatingTarget = (target) => target instanceof Element && Boolean(target.closest(".tc-floating-index,.tc-canvas-toolbar,.tc-node-picker,.tc-mini-map,.tc-empty-state"));

export function TaskCanvas({ visible = true, embedded = false, isAddCustom = false, enableCardFocus = false, viewMode, focusIds = [], fitRequest = 0, flow, canvas, onBack, onOpenContents, onOpenContent, onFocusContent, onCollapse, onAttachCode, renderMaterial, contents = null, contentsOpen = false, connections = [], comparisonIds = ["source", "draft"] }) {
  const { state, actions } = canvas;
  const [collapsedIds, setCollapsedIds] = useState([]);
  const [handMode, setHandMode] = useState(false);
  const [positionEditing, setPositionEditing] = useState(false);
  const [nodePickerOpen, setNodePickerOpen] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [gestureKind, setGestureKind] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });
  const stageRef = useRef(null);
  const initialFitDone = useRef(false);
  const gesture = useRef(null);
  const stateRef = useRef(state);
  const actionsRef = useRef(actions);
  stateRef.current = state;
  actionsRef.current = actions;
  useEffect(() => {
    if (visible) return;
    setPositionEditing(false);
    setHandMode(false);
    setNodePickerOpen(false);
    drawing.stop();
  }, [visible]);
  useEffect(() => {
    if (!visible || !positionEditing) return undefined;
    const handleEscape = (event) => {
      if (event.key !== "Escape" || editableTarget(event.target)) return;
      setPositionEditing(false);
      setHandMode(false);
      setNodePickerOpen(false);
      drawing.stop();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [positionEditing, visible]);
  const selected = state.cards.find((card) => card.id === state.selectedCardId && card.visible) || null;
  const cardSummary = (card) => card.summary || ({ source: "来源只读", evidence: "根因待确认", explanation: "线索解释", draft: flow?.state.mode === "isolated" ? "隔离示例副本" : "任务内示例副本", parameters: `输入 [${flow?.state.rows},${flow?.state.columns}]`, attempts: `${flow?.state.attempts.length || 0} 次范围尝试`, diff: flow?.state.proposedCode ? "保留修改差异" : "待生成提案", validation: flow?.state.validation ? "已存范围复核" : "真实项目待验证", precision: "数值误差核对", review: "观察与待补证据" }[card.id] || "内容保留");
  const visibleCards = state.cards.filter((card) => card.visible);
  const hiddenCards = state.cards.filter((card) => !card.visible && card.opened);
  const availableNodeCards = isAddCustom ? state.cards.filter((card) => !card.visible) : [];
  const drawings = Array.isArray(state.drawings) ? state.drawings : [];
  const focusCardId = viewMode === "focus" ? focusIds[0] : null;
  const focusRelatedCards = focusCardId
    ? focusIds.slice(1).map((id) => visibleCards.find((card) => card.id === id)).filter(Boolean)
    : [];
  const { x: panX, y: panY, zoom } = state.viewport;
  const drawing = useCanvasDrawing({ canvasContent: canvas, editing: positionEditing });
  const worldDrawings = drawings.filter(item => !item.cardId);
  const isCollapsed = (card) => card.collapsed ?? collapsedIds.includes(card.id);
  const addCustomGroupRegions = useMemo(() => {
    if (!isAddCustom) return [];
    return ADD_CUSTOM_LAYOUT_GROUPS.map((group) => {
      const cards = visibleCards.filter((card) => addCustomGroupKey(card) === group.id);
      if (!cards.length) return null;
      const left = Math.min(...cards.map((card) => card.x)) - 20;
      const top = Math.min(...cards.map((card) => card.y)) - 42;
      const right = Math.max(...cards.map((card) => card.x + card.width)) + 20;
      const bottom = Math.max(...cards.map((card) => card.y + (isCollapsed(card) ? COLLAPSED_HEIGHT : card.height))) + 20;
      return { ...group, left, top, width: right - left, height: bottom - top };
    }).filter(Boolean);
  }, [isAddCustom, state.cards, collapsedIds]);

  const minimapBounds = useMemo(() => {
    const drawingPoints = worldDrawings.flatMap((drawing) => drawing.points || []);
    if (!visibleCards.length && !drawingPoints.length) return { x: -30, y: -30, width: 600, height: 500 };
    const left = Math.min(...visibleCards.map((card) => card.x), ...drawingPoints.map((point) => point.x)) - 40;
    const top = Math.min(...visibleCards.map((card) => card.y), ...drawingPoints.map((point) => point.y)) - 40;
    const right = Math.max(...visibleCards.map((card) => card.x + card.width), ...drawingPoints.map((point) => point.x)) + 40;
    const bottom = Math.max(...visibleCards.map((card) => card.y + (isCollapsed(card) ? COLLAPSED_HEIGHT : card.height)), ...drawingPoints.map((point) => point.y)) + 40;
    return { x: left, y: top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) };
  }, [state.cards, worldDrawings, collapsedIds]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const measure = () => {
      const { width, height } = stage.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      setStageSize({ width, height });
      if (actionsRef.current.setSurfaceSize) actionsRef.current.setSurfaceSize(width, height);
      else {
        const previous = { ...stateRef.current.viewport };
        actionsRef.current.fitCanvas(width, height);
        actionsRef.current.setViewport(previous);
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (viewMode || !visible || initialFitDone.current || !visibleCards.length) return undefined;
    const frame = requestAnimationFrame(() => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect || rect.width < 1 || rect.height < 1) return;
      actionsRef.current.setSurfaceSize?.(rect.width, rect.height);
      actionsRef.current.fitCanvas(rect.width, rect.height);
      initialFitDone.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, visibleCards.length]);

  const viewKey = `${viewMode || ""}:${focusIds.join(",")}:${fitRequest}`;
  useEffect(() => {
    if (!viewMode || !visible) return undefined;
    const frame = requestAnimationFrame(() => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect || rect.width < 1 || rect.height < 1) return;
      actionsRef.current.setSurfaceSize?.(rect.width, rect.height);
      if (viewMode === "focus") actionsRef.current.focusCanvas(focusIds.slice(0, 1), rect.width, rect.height);
      else actionsRef.current.fitCanvas(rect.width, rect.height);
      initialFitDone.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, [viewKey, visible]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const handleWheel = (event) => {
      if (floatingTarget(event.target)) return;
      const current = stateRef.current.viewport;
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const rect = stage.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;
        const nextZoom = clampZoom(current.zoom * Math.exp(-event.deltaY * 0.002));
        actionsRef.current.setViewport({ zoom: nextZoom, x: screenX - (screenX - current.x) / current.zoom * nextZoom, y: screenY - (screenY - current.y) / current.zoom * nextZoom });
        return;
      }
      // Inner editors and material cards retain their own scroll behavior.
      let node = event.target instanceof Element ? event.target : null;
      while (node && node !== stage) {
        const style = window.getComputedStyle(node);
        const canScrollY = /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1;
        const canScrollX = /(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 1;
        if (canScrollY && (event.deltaY < 0 && node.scrollTop > 0 || event.deltaY > 0 && node.scrollTop < node.scrollHeight - node.clientHeight - 1)) return;
        if (canScrollX && (event.deltaX < 0 && node.scrollLeft > 0 || event.deltaX > 0 && node.scrollLeft < node.scrollWidth - node.clientWidth - 1)) return;
        node = node.parentElement;
      }
      event.preventDefault();
      const deltaScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1;
      actionsRef.current.setViewport({ x: current.x - event.deltaX * deltaScale, y: current.y - event.deltaY * deltaScale });
    };
    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, []);

  const beginGesture = (event, details) => {
    if (event.button !== 0 || !stageRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    gesture.current = { ...details, pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, viewport: { ...stateRef.current.viewport } };
    setGestureKind(details.kind);
    stageRef.current.setPointerCapture(event.pointerId);
  };

  const beginPan = (event) => beginGesture(event, { kind: "pan" });
  const beginMove = (event, card) => {
    if (!positionEditing || drawing.drawingMode) return;
    if (handMode || spaceHeld) { beginPan(event); return; }
    if (card.pinned) return;
    beginGesture(event, { kind: "move", id: card.id, x: card.x, y: card.y });
    actions.selectCard(card.id);
  };
  const beginResize = (event, card) => {
    if (!positionEditing || drawing.drawingMode || card.pinned || isCollapsed(card)) return;
    beginGesture(event, { kind: "resize", id: card.id, width: card.width, height: card.height });
    actions.selectCard(card.id);
  };

  const moveGesture = (event) => {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - current.clientX;
    const deltaY = event.clientY - current.clientY;
    if (current.kind === "pan") actions.setViewport({ x: current.viewport.x + deltaX, y: current.viewport.y + deltaY });
    else if (current.kind === "move") actions.moveCard(current.id, current.x + deltaX / current.viewport.zoom, current.y + deltaY / current.viewport.zoom);
    else if (current.kind === "resize") actions.resizeCard(current.id, current.width + deltaX / current.viewport.zoom, current.height + deltaY / current.viewport.zoom);
  };

  const endGesture = (event) => {
    if (gesture.current && event.pointerId !== gesture.current.pointerId) return;
    gesture.current = null;
    setGestureKind(null);
    if (stageRef.current?.hasPointerCapture(event.pointerId)) stageRef.current.releasePointerCapture(event.pointerId);
  };

  const changeZoom = (next, screenPoint = null) => {
    const current = stateRef.current.viewport;
    const rect = stageRef.current?.getBoundingClientRect();
    const screenX = screenPoint?.x ?? (rect?.width || stageSize.width) / 2;
    const screenY = screenPoint?.y ?? (rect?.height || stageSize.height) / 2;
    const nextZoom = clampZoom(next);
    actions.setViewport({ zoom: nextZoom, x: screenX - (screenX - current.x) / current.zoom * nextZoom, y: screenY - (screenY - current.y) / current.zoom * nextZoom });
  };

  const focusCard = (card) => {
    if (!card) return;
    actions.selectCard(card.id);
    const current = stateRef.current.viewport;
    const height = isCollapsed(card) ? COLLAPSED_HEIGHT : card.height;
    const widthPadding = isAddCustom ? 24 : 72;
    const zoom = clampZoom(Math.min(1.1, Math.max(1, stageSize.width - widthPadding) / card.width, Math.max(1, stageSize.height - 112) / height));
    actions.setViewport({ zoom, x: stageSize.width / 2 - (card.x + card.width / 2) * zoom, y: stageSize.height / 2 - (card.y + height / 2) * zoom });
  };

  const toggleCollapsed = (id) => {
    const nextCollapsed = !isCollapsed(stateRef.current.cards.find(card => card.id === id) || {});
    onCollapse?.(id, nextCollapsed);
    if (actions.toggleCollapse) actions.toggleCollapse(id);
    else setCollapsedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const keyboardMove = (event, card) => {
    if (!positionEditing || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) || card.pinned) return;
    event.preventDefault();
    event.stopPropagation();
    const step = event.shiftKey ? 48 : 12;
    actions.moveCard(card.id, card.x + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0), card.y + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0));
  };

  const keyboardResize = (event, card) => {
    if (!positionEditing || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) || card.pinned) return;
    event.preventDefault();
    event.stopPropagation();
    const step = event.shiftKey ? 48 : 12;
    actions.resizeCard(card.id, card.width + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0), card.height + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0));
  };

  const navigateMap = ({ x, y }) => actions.setViewport({ x: stageSize.width / 2 - x * zoom, y: stageSize.height / 2 - y * zoom });
  const togglePositionEditing = () => {
    const next = !positionEditing;
    setPositionEditing(next);
    setHandMode(false);
    setNodePickerOpen(false);
    drawing.stop();
  };
  const addNote = () => {
    const count = state.cards.filter((card) => card.kind === "note").length + 1;
    actions.addCard({ id: `note:${Date.now().toString(36)}`, kind: "note", groupId: selected ? addCustomGroupKey(selected) : "analysis", title: `笔记 ${count}`, noteText: "", width: 600, height: 360 }, { focus: true });
    setNodePickerOpen(false);
    drawing.stop();
  };
  const addDrawingCard = () => {
    const count = state.cards.filter(card => card.kind === "drawing").length + 1;
    const id = `drawing-card:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 6)}`;
    const anchor = selected || visibleCards.at(-1);
    actions.addCard({ id, kind: "drawing", groupId: selected ? addCustomGroupKey(selected) : "analysis", title: `手绘卡片 ${count}`, width: 640, height: 420, ...(anchor ? { x: anchor.x + anchor.width + 24, y: anchor.y } : {}) }, { focus: true });
    setNodePickerOpen(false);
    return id;
  };
  const toggleDrawing = () => {
    if (drawing.drawingMode) { drawing.stop(); return; }
    drawing.start(selected?.kind === "drawing" ? selected.id : addDrawingCard());
    setNodePickerOpen(false);
  };

  const canvasToolbar = <CanvasToolbar placement="inline" className="tc-canvas-toolbar" aria-label="画布视图与编辑操作">
    <CanvasToolbarGroup label="任务内容">
      {embedded && !enableCardFocus && <CanvasToolButton type="button" active={contentsOpen} aria-label="打开任务内容总览" title="打开任务内容总览" aria-expanded={contentsOpen} onClick={onOpenContents}><IconLayoutList size={ICON_SIZE.control} /></CanvasToolButton>}
      <CanvasToolButton type="button" active={Boolean(state.comparing)} aria-label={state.comparing ? "退出临时对照" : "临时对照内容"} title={state.comparing ? "退出临时对照" : "临时对照内容"} onClick={() => state.comparing ? actions.endComparison?.() : actions.beginComparison?.(comparisonIds)}><IconLayoutColumns size={ICON_SIZE.control} /></CanvasToolButton>
      {state.lastHiddenId && <CanvasToolButton type="button" aria-label="恢复刚收起的内容" title="恢复刚收起的内容" onClick={() => actions.restore()}><IconRestore size={ICON_SIZE.control} /></CanvasToolButton>}
    </CanvasToolbarGroup>
    <CanvasZoomGroup value={zoom} min={MIN_ZOOM} max={MAX_ZOOM} onZoom={changeZoom} onReset={() => changeZoom(1)} />
    <CanvasToolbarGroup label="画布定位">
      <CanvasToolButton type="button" active={handMode} aria-label={handMode ? "退出抓手模式" : "切换抓手平移模式"} title={handMode ? "退出抓手模式" : "抓手平移"} onClick={() => { setHandMode(current => !current); setPositionEditing(false); setNodePickerOpen(false); drawing.stop(); }}><IconHandMove size={ICON_SIZE.control} /></CanvasToolButton>
      <CanvasToolButton type="button" aria-label="适应全部可见内容" title="适应全部可见内容" onClick={() => actions.fitCanvas(stageSize.width, stageSize.height)}><CanvasFitIcon /></CanvasToolButton>
    </CanvasToolbarGroup>
    <CanvasToolbarGroup label="画布编辑">
      <CanvasToolButton className={positionEditing ? "canvas-tool-button--labeled" : ""} type="button" active={positionEditing} aria-label={positionEditing ? "完成编辑并退出编辑状态" : "编辑画布"} title={positionEditing ? "完成编辑并退出编辑状态" : "编辑画布"} onClick={togglePositionEditing}>{positionEditing ? <><IconCheck size={ICON_SIZE.control} /><span>完成编辑</span></> : <IconPencil size={ICON_SIZE.control} />}</CanvasToolButton>
    </CanvasToolbarGroup>
    {isAddCustom && positionEditing && <CanvasToolbarGroup className="canvas-toolbar-group--add-content" label="添加画布内容">
      <CanvasToolButton type="button" active={nodePickerOpen} aria-label="添加已有内容节点" aria-expanded={nodePickerOpen} title="添加已有内容节点" onClick={() => { setNodePickerOpen((open) => !open); drawing.stop(); }}><IconPlus size={ICON_SIZE.control} /></CanvasToolButton>
      <CanvasToolButton type="button" aria-label="添加笔记" title="添加笔记" onClick={addNote}><IconNotes size={ICON_SIZE.control} /></CanvasToolButton>
      <CanvasToolButton type="button" active={drawing.drawingMode} aria-label={drawing.drawingMode ? "结束卡片绘图" : "新增手绘卡片"} title={drawing.drawingMode ? "结束卡片绘图" : "新增手绘卡片"} onClick={toggleDrawing}><IconPencil size={ICON_SIZE.control} /></CanvasToolButton>
      {drawings.length > 0 && <CanvasToolButton type="button" aria-label="撤销上一笔绘图" title="撤销上一笔绘图" onClick={() => actions.removeDrawing?.(drawings.at(-1).id)}><IconRestore size={ICON_SIZE.control} /></CanvasToolButton>}
    </CanvasToolbarGroup>}
  </CanvasToolbar>;
  const nodePicker = isAddCustom && positionEditing && nodePickerOpen && <div className="tc-node-picker" role="region" aria-label="添加已有内容节点">
    <strong>添加任务内容</strong>
    {availableNodeCards.length ? availableNodeCards.map((card) => <button key={card.id} type="button" onClick={() => { actions.showCard(card.id, { focus: true }); setNodePickerOpen(false); }}><span>{card.title}</span><small>{cardSummary(card)}</small></button>) : <p>当前任务的材料都已显示在画布上。</p>}
  </div>;

  return <aside className={"task-canvas" + (embedded ? " is-embedded" : "") + (isAddCustom ? " is-addcustom" : "")} hidden={!visible} aria-label="当前任务的自由画布">
    {!embedded && <header className="panel-header tc-header"><div><h2><IconLayoutBoard size={ICON_SIZE.heading} />任务画布</h2><span>同一现场里的代码、解释与检查证据</span></div><div className="tc-header-links"><button type="button" onClick={onBack}><IconArrowLeft size={ICON_SIZE.inline} />定位现场</button><button type="button" className={contentsOpen ? "is-active" : ""} aria-expanded={contentsOpen} onClick={onOpenContents}><IconLayoutList size={ICON_SIZE.inline} />本任务内容</button></div></header>}
    <div className="tc-object-toolbar"><span className="tc-selection-label">{selected ? selected.title : `${visibleCards.length} 个内容对象`}</span>{focusRelatedCards.length > 0 && <nav className="tc-focus-related" aria-label="当前节点的直接关联">{focusRelatedCards.map((card) => {
      const relation = connections.find((connection) => connection.from === focusCardId && connection.to === card.id || connection.to === focusCardId && connection.from === card.id);
      return <button key={card.id} type="button" title={`聚焦到${card.title}${relation?.label ? ` · ${relation.label}` : ""}`} onClick={() => { focusCard(card); onFocusContent?.(card.id); }}><span>{card.title}</span>{relation?.label && <small>{relation.label}</small>}</button>;
    })}</nav>}</div>

    <CanvasSurface as="div" ref={stageRef} className={"tc-stage" + (handMode || spaceHeld ? " is-hand-mode" : "") + (positionEditing ? " is-layout-editing" : "") + (drawing.drawingMode ? " is-drawing" : "") + (gestureKind ? " is-gesturing" : "") + (gestureKind === "pan" ? " is-panning" : "")} tabIndex={0} aria-label="任务空间；拖动空白平移，按住 Ctrl 或 Command 滚轮缩放" style={{ backgroundSize: `${Math.max(12, 20 * zoom)}px ${Math.max(12, 20 * zoom)}px`, backgroundPosition: `${panX}px ${panY}px` }} onPointerDown={(event) => {
      if (floatingTarget(event.target) || editableTarget(event.target)) return;
      if (drawing.drawingMode) return;
      const inCard = event.target instanceof Element && event.target.closest(".tc-card");
      if (inCard && !handMode && !spaceHeld) return;
      if (event.target instanceof Element && event.target.closest("button,a")) return;
      if (!inCard) actions.selectCard(null);
      beginPan(event);
    }} onPointerMove={moveGesture} onPointerUp={endGesture} onPointerCancel={endGesture} onLostPointerCapture={() => { gesture.current = null; setGestureKind(null); }} onKeyDown={(event) => {
      if (editableTarget(event.target) || floatingTarget(event.target) || event.target !== event.currentTarget) return;
      if (event.key === " ") { event.preventDefault(); setSpaceHeld(true); }
      else if (event.key === "+" || event.key === "=") { event.preventDefault(); changeZoom(zoom + 0.1); }
      else if (event.key === "-") { event.preventDefault(); changeZoom(zoom - 0.1); }
      else if (event.key === "0") { event.preventDefault(); changeZoom(1); }
      else if (event.key.toLowerCase() === "f") { event.preventDefault(); actions.fitCanvas(stageSize.width, stageSize.height); }
      else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) { event.preventDefault(); const step = event.shiftKey ? 120 : 40; actions.setViewport({ x: panX + (event.key === "ArrowLeft" ? step : event.key === "ArrowRight" ? -step : 0), y: panY + (event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0) }); }
      else if ((event.key === "Delete" || event.key === "Backspace") && selected) { event.preventDefault(); if (positionEditing && ["note", "drawing"].includes(selected.kind)) actions.deleteCard(selected.id); else actions.hideCard(selected.id); }
      else if (event.key === "Escape") { setSpaceHeld(false); setHandMode(false); setPositionEditing(false); setNodePickerOpen(false); drawing.stop(); }
    }} onKeyUp={(event) => { if (event.key === " ") setSpaceHeld(false); }} onBlur={() => setSpaceHeld(false)}>
      <div className="tc-floating-tools">{canvasToolbar}{nodePicker}</div>
      <div className="tc-world" style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }}>
        {addCustomGroupRegions.map((group) => <div key={group.id} className={`tc-group-region is-${group.id}`} aria-hidden="true" style={{ left: group.left, top: group.top, width: group.width, height: group.height, "--tc-group-label-scale": Math.max(1, Math.min(4.5, 1 / zoom)) }}><span>{group.label}</span></div>)}
        {connections.length > 0 && <svg className="tc-connections" aria-hidden="true"><defs><marker id="task-canvas-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M 1 1 L 7 4 L 1 7" fill="none" stroke="currentColor" strokeWidth="1.3" /></marker></defs>{connections.map((connection, index) => {
          const from = visibleCards.find((card) => card.id === connection.from);
          const to = visibleCards.find((card) => card.id === connection.to);
          if (!from || !to) return null;
          const fromHeight = isCollapsed(from) ? COLLAPSED_HEIGHT : from.height;
          const toHeight = isCollapsed(to) ? COLLAPSED_HEIGHT : to.height;
          const fromCenter = { x: from.x + from.width / 2, y: from.y + fromHeight / 2 };
          const toCenter = { x: to.x + to.width / 2, y: to.y + toHeight / 2 };
          const horizontal = Math.abs(toCenter.x - fromCenter.x) >= Math.abs(toCenter.y - fromCenter.y);
          const direction = horizontal ? Math.sign(toCenter.x - fromCenter.x) || 1 : Math.sign(toCenter.y - fromCenter.y) || 1;
          const startX = horizontal ? fromCenter.x + direction * from.width / 2 : fromCenter.x;
          const startY = horizontal ? fromCenter.y : fromCenter.y + direction * fromHeight / 2;
          const endX = horizontal ? toCenter.x - direction * to.width / 2 : toCenter.x;
          const endY = horizontal ? toCenter.y : toCenter.y - direction * toHeight / 2;
          const distance = Math.max(8, Math.abs(horizontal ? endX - startX : endY - startY) * 0.4);
          const path = horizontal ? `M ${startX} ${startY} C ${startX + direction * distance} ${startY}, ${endX - direction * distance} ${endY}, ${endX} ${endY}` : `M ${startX} ${startY} C ${startX} ${startY + direction * distance}, ${endX} ${endY - direction * distance}, ${endX} ${endY}`;
          return <g key={connection.id || index}><path d={path} markerEnd="url(#task-canvas-arrow)" />{connection.label && <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 8}>{connection.label}</text>}</g>;
        })}</svg>}
        {worldDrawings.length > 0 && <svg className="tc-drawings" aria-hidden="true">{worldDrawings.map((drawing) => <polyline key={drawing.id} points={(drawing.points || []).map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke={drawing.color || "#55585a"} strokeWidth={drawing.width || 3} strokeLinecap="round" strokeLinejoin="round" />)}</svg>}

        {state.cards.map((card, index) => {
          const collapsed = isCollapsed(card);
          return <CanvasCardFrame key={card.id} className={`tc-card${collapsed ? " is-collapsed" : ""}`} selected={state.selectedCardId === card.id} pinned={card.pinned} collapsed={collapsed} hidden={!card.visible} aria-label={card.title} style={{ left: card.x, top: card.y, width: card.width, height: collapsed ? COLLAPSED_HEIGHT : card.height, zIndex: index + 2 }} onPointerDownCapture={(event) => { if (event.target instanceof Element && event.target.closest("button,a,input,textarea,select,label,summary")) return; if (!handMode && !spaceHeld && stateRef.current.selectedCardId !== card.id) actions.selectCard(card.id); }}>
            <CanvasCardHeader className="tc-card-header" onPointerDown={(event) => { if (!positionEditing || event.target instanceof Element && event.target.closest("button")) return; beginMove(event, card); }}>
              {positionEditing && <CanvasCardButton className="tc-move-handle" type="button" disabled={card.pinned} aria-label={`移动${card.title}；方向键微调，Shift 加快`} title={card.pinned ? "已固定位置" : "拖动标题移动；方向键微调"} onPointerDown={(event) => beginMove(event, card)} onKeyDown={(event) => keyboardMove(event, card)}><IconGripVertical size={ICON_SIZE.control} /></CanvasCardButton>}<div className="canvas-card-title"><h3 title={card.title}>{card.title}</h3></div>{collapsed && <small className="tc-collapse-summary">{cardSummary(card)}</small>}{card.pinned && <span className="tc-pin-label"><IconPin size={ICON_SIZE.micro} />已固定</span>}
              <CanvasCardActions className="tc-card-actions"><CanvasCardButton type="button" aria-label={`聚焦到${card.title}`} title="聚焦到画布中的这个节点" onClick={() => { focusCard(card); onFocusContent?.(card.id); }}><IconFocus2 size={ICON_SIZE.inline} /></CanvasCardButton>{onOpenContent && <CanvasCardButton type="button" aria-label={`放大${card.title}到右侧完整工作区`} title="放大到右侧完整工作区" onClick={() => onOpenContent(card.id)}><IconMaximize size={ICON_SIZE.inline} /></CanvasCardButton>}<CanvasCardButton type="button" active={card.pinned} aria-label={card.pinned ? `取消固定${card.title}` : `固定${card.title}`} title={card.pinned ? "取消固定" : "固定位置与尺寸"} onClick={() => actions.togglePin(card.id)}><IconPin size={ICON_SIZE.inline} /></CanvasCardButton>{positionEditing && ["note", "drawing"].includes(card.kind) && <CanvasCardButton className="is-destructive" type="button" aria-label={`删除${card.title}`} title="删除新增卡片" onClick={() => { if (drawing.targetCardId === card.id) drawing.stop(); actions.deleteCard(card.id); }}><IconTrash size={ICON_SIZE.inline} /></CanvasCardButton>}<CanvasCardButton type="button" aria-label={collapsed ? `展开${card.title}` : `折叠${card.title}`} title={collapsed ? "展开内容" : "折叠内容"} aria-expanded={!collapsed} onClick={() => toggleCollapsed(card.id)}>{collapsed ? <IconChevronRight size={ICON_SIZE.inline} /> : <IconChevronDown size={ICON_SIZE.inline} />}</CanvasCardButton></CanvasCardActions>
            </CanvasCardHeader>
            <div className={`tc-card-content${card.kind === "drawing" ? " is-drawing-card" : ""}`} hidden={collapsed} role={isAddCustom ? "region" : undefined} tabIndex={isAddCustom ? 0 : undefined} aria-label={isAddCustom ? `${card.title}内容，可在卡片内滚动查看` : undefined} onWheel={(event) => {
              const content = event.currentTarget;
              if (!event.ctrlKey && !event.metaKey && content.scrollHeight > content.clientHeight + 1) event.stopPropagation();
            }}>{card.kind === "drawing" ? <CanvasDrawingSurface cardId={card.id} drawings={drawings.filter(item => item.cardId === card.id)} draft={drawing.targetCardId === card.id ? drawing.draft : []} drawingMode={drawing.drawingMode && drawing.targetCardId === card.id} onBegin={drawing.begin} onMove={drawing.move} onFinish={drawing.finish} onCancel={drawing.cancel} /> : card.kind === "note" ? <textarea className="tc-note-editor" aria-label={`${card.title}内容`} placeholder="记下当前判断、待办或补充说明…" value={card.noteText || ""} disabled={!positionEditing} onChange={(event) => actions.updateCard?.(card.id, { noteText: event.target.value })} /> : renderMaterial ? renderMaterial(card.id, card) : <div className="tc-slot-placeholder"><span>当前任务内容</span><button type="button" onClick={onOpenContents}>打开内容索引</button></div>}</div>
            {!collapsed && positionEditing && <button className="tc-resize-handle" type="button" disabled={card.pinned} aria-label={`调整${card.title}尺寸；方向键微调`} title={card.pinned ? "已固定尺寸" : "拖动调整尺寸；方向键微调"} onPointerDown={(event) => beginResize(event, card)} onKeyDown={(event) => keyboardResize(event, card)}><IconArrowsDiagonal size={ICON_SIZE.micro} /></button>}
          </CanvasCardFrame>;
        })}
      </div>

      {contentsOpen && contents && <div className="tc-floating-index">{contents}</div>}
      {!visibleCards.length && <div className="tc-empty-state"><IconLayoutBoard size={ICON_SIZE.feature} /><strong>{hiddenCards.length ? "当前内容已收纳" : "尚未加入材料"}</strong><p>{hiddenCards.length ? "从本任务内容中恢复，位置和操作记录仍保留。" : "在对话或材料中选择“在画布中整理”，把需要关联的内容放到这里。"}</p><button type="button" onClick={onOpenContents}><IconLayoutList size={ICON_SIZE.inline} />选择本任务材料</button></div>}

      <CanvasMiniMap className="tc-mini-map" placement="bottom-right" viewBox={minimapBounds} viewport={{ x: -panX / zoom, y: -panY / zoom, width: stageSize.width / zoom, height: stageSize.height / zoom }} onNavigate={navigateMap} onFit={() => actions.fitCanvas(stageSize.width, stageSize.height)} ariaLabel="小地图，点击或拖动定位；Enter 适应全部内容">
        {visibleCards.map((card) => <rect key={card.id} x={card.x} y={card.y} width={card.width} height={isCollapsed(card) ? COLLAPSED_HEIGHT : card.height} rx="8" className={`canvas-minimap-item${selected?.id === card.id ? " is-selected" : ""}`} />)}
        {worldDrawings.map((drawing) => <polyline key={drawing.id} className="canvas-minimap-drawing" points={(drawing.points || []).map((point) => `${point.x},${point.y}`).join(" ")} />)}
      </CanvasMiniMap>

      <div className="tc-canvas-hint">{drawing.drawingMode ? "绘图中：在手绘卡片内拖动 · 点击笔形按钮或按 Esc 结束" : positionEditing ? "编辑中：拖动卡片标题移动 · 完成编辑按钮或 Esc 退出" : "空白拖动平移 · ⌘ / Ctrl 滚轮缩放"}{hiddenCards.length ? ` · 已收纳 ${hiddenCards.length} 项` : ""}</div>
    </CanvasSurface>
    {(flow?.state?.notice || flow?.state?.error) && <div className={"tc-flow-status" + (flow.state.error ? " is-error" : "")} role={flow.state.error ? "alert" : "status"} aria-live="polite">{flow.state.error ? <IconAlertTriangle size={ICON_SIZE.inline} /> : <IconLayoutBoard size={ICON_SIZE.inline} />}<span>{flow.state.error || flow.state.notice}</span></div>}
  </aside>;
}

export default TaskCanvas;
