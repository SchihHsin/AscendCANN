import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowsDiagonal,
  IconChevronDown,
  IconChevronRight,
  IconExternalLink,
  IconFocus2,
  IconGripVertical,
  IconHandMove,
  IconLayoutBoard,
  IconLayoutColumns,
  IconLayoutList,
  IconMinus,
  IconPin,
  IconPlus,
  IconRestore,
  IconTarget,
  IconX,
} from "@tabler/icons-react";
import "./task-canvas.css";

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 1.5;
const COLLAPSED_HEIGHT = 44;

const clampZoom = (zoom) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
const editableTarget = (target) => target instanceof Element && Boolean(target.closest("input,textarea,select,[contenteditable=true]"));
const floatingTarget = (target) => target instanceof Element && Boolean(target.closest(".tc-floating-index,.tc-canvas-controls,.tc-mini-map,.tc-empty-state"));

export function TaskCanvas({ visible = true, embedded = false, flow, canvas, onBack, onOpenContents, onOpenContent, onAttachCode, renderMaterial, contents = null, contentsOpen = false, connections = [] }) {
  const { state, actions } = canvas;
  const [collapsedIds, setCollapsedIds] = useState([]);
  const [handMode, setHandMode] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [gestureKind, setGestureKind] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });
  const stageRef = useRef(null);
  const gesture = useRef(null);
  const stateRef = useRef(state);
  const actionsRef = useRef(actions);
  stateRef.current = state;
  actionsRef.current = actions;
  const selected = state.cards.find((card) => card.id === state.selectedCardId && card.visible) || null;
  const cardSummary = (card) => card.summary || ({ source: "来源只读", evidence: "根因待确认", explanation: "线索解释", draft: flow?.state.mode === "isolated" ? "隔离示例副本" : "任务内示例副本", parameters: `输入 [${flow?.state.rows},${flow?.state.columns}]`, attempts: `${flow?.state.attempts.length || 0} 次范围尝试`, diff: flow?.state.proposedCode ? "保留修改差异" : "待生成提案", validation: flow?.state.validation ? "已存范围复核" : "真实项目待验证", precision: "数值误差核对", review: "观察与待补证据" }[card.id] || "内容保留");
  const visibleCards = state.cards.filter((card) => card.visible);
  const hiddenCards = state.cards.filter((card) => !card.visible && card.opened);
  const { x: panX, y: panY, zoom } = state.viewport;
  const isCollapsed = (card) => card.collapsed ?? collapsedIds.includes(card.id);

  const minimapBounds = useMemo(() => {
    if (!visibleCards.length) return { x: -30, y: -30, width: 600, height: 500 };
    const left = Math.min(...visibleCards.map((card) => card.x)) - 40;
    const top = Math.min(...visibleCards.map((card) => card.y)) - 40;
    const right = Math.max(...visibleCards.map((card) => card.x + card.width)) + 40;
    const bottom = Math.max(...visibleCards.map((card) => card.y + (isCollapsed(card) ? COLLAPSED_HEIGHT : card.height))) + 40;
    return { x: left, y: top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) };
  }, [state.cards, collapsedIds]);

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
    if (handMode || spaceHeld) { beginPan(event); return; }
    if (card.pinned) return;
    beginGesture(event, { kind: "move", id: card.id, x: card.x, y: card.y });
    actions.selectCard(card.id);
  };
  const beginResize = (event, card) => {
    if (card.pinned || isCollapsed(card)) return;
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
    else actions.resizeCard(current.id, current.width + deltaX / current.viewport.zoom, current.height + deltaY / current.viewport.zoom);
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
    actions.setViewport({ x: stageSize.width / 2 - (card.x + card.width / 2) * current.zoom, y: stageSize.height / 2 - (card.y + height / 2) * current.zoom });
  };

  const toggleCollapsed = (id) => {
    if (actions.toggleCollapse) actions.toggleCollapse(id);
    else setCollapsedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const keyboardMove = (event, card) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) || card.pinned) return;
    event.preventDefault();
    event.stopPropagation();
    const step = event.shiftKey ? 48 : 12;
    actions.moveCard(card.id, card.x + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0), card.y + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0));
  };

  const keyboardResize = (event, card) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) || card.pinned) return;
    event.preventDefault();
    event.stopPropagation();
    const step = event.shiftKey ? 48 : 12;
    actions.resizeCard(card.id, card.width + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0), card.height + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0));
  };

  const mapClick = (event) => {
    const map = event.currentTarget;
    const matrix = map.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    actions.setViewport({ x: stageSize.width / 2 - point.x * zoom, y: stageSize.height / 2 - point.y * zoom });
  };

  return <aside className={"task-canvas" + (embedded ? " is-embedded" : "")} hidden={!visible} aria-label="当前任务的自由画布">
    {!embedded && <header className="panel-header tc-header"><div><h2><IconLayoutBoard size={17} />任务画布</h2><span>同一现场里的代码、解释与检查证据</span></div><div className="tc-header-links"><button type="button" onClick={onBack}><IconArrowLeft size={14} />定位现场</button><button type="button" className={contentsOpen ? "is-active" : ""} aria-expanded={contentsOpen} onClick={onOpenContents}><IconLayoutList size={14} />本任务内容</button></div></header>}
    <div className="tc-object-toolbar" aria-label="画布对象操作"><span className="tc-selection-label">{selected ? selected.title : `${visibleCards.length} 个内容对象`}</span><div>{embedded && <button type="button" className={contentsOpen ? "is-active" : ""} aria-expanded={contentsOpen} onClick={onOpenContents}><IconLayoutList size={14} />内容</button>}<button type="button" disabled={!selected} aria-label="定位所选内容" title="定位所选内容" onClick={() => focusCard(selected)}><IconTarget size={14} /></button><button type="button" disabled={!selected} className={selected?.pinned ? "is-active" : ""} aria-label={selected?.pinned ? "取消固定所选内容" : "固定所选内容"} title={selected?.pinned ? "取消固定" : "固定位置与尺寸"} onClick={() => actions.togglePin(selected.id)}><IconPin size={14} /></button><button type="button" disabled={!selected} aria-label="收纳所选内容" title="收纳所选内容" onClick={() => actions.hideCard(selected.id)}><IconX size={14} /></button><span className="tc-toolbar-rule" /><button className="tc-comparison-button" type="button" aria-pressed={Boolean(state.comparing)} onClick={() => state.comparing ? actions.endComparison?.() : actions.beginComparison?.(["source", "draft"])}><IconLayoutColumns size={14} />{state.comparing ? "退出对照" : "临时对照"}</button></div></div>

    <div ref={stageRef} className={"tc-stage" + (handMode || spaceHeld ? " is-hand-mode" : "") + (gestureKind ? " is-gesturing" : "") + (gestureKind === "pan" ? " is-panning" : "")} tabIndex={0} aria-label="任务空间；拖动空白平移，按住 Ctrl 或 Command 滚轮缩放" style={{ backgroundSize: `${Math.max(12, 20 * zoom)}px ${Math.max(12, 20 * zoom)}px`, backgroundPosition: `${panX}px ${panY}px` }} onPointerDown={(event) => {
      if (floatingTarget(event.target) || editableTarget(event.target)) return;
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
      else if ((event.key === "Delete" || event.key === "Backspace") && selected) { event.preventDefault(); actions.hideCard(selected.id); }
      else if (event.key === "Escape") { setSpaceHeld(false); setHandMode(false); }
    }} onKeyUp={(event) => { if (event.key === " ") setSpaceHeld(false); }} onBlur={() => setSpaceHeld(false)}>
      <div className="tc-world" style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }}>
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

        {state.cards.map((card, index) => {
          const collapsed = isCollapsed(card);
          return <section className={"tc-card" + (state.selectedCardId === card.id ? " is-selected" : "") + (card.pinned ? " is-pinned" : "") + (collapsed ? " is-collapsed" : "")} key={card.id} hidden={!card.visible} aria-label={card.title} style={{ left: card.x, top: card.y, width: card.width, height: collapsed ? COLLAPSED_HEIGHT : card.height, zIndex: index + 2 }} onPointerDownCapture={(event) => { if (event.target instanceof Element && event.target.closest("button,a,input,textarea,select,label,summary")) return; if (!handMode && !spaceHeld && stateRef.current.selectedCardId !== card.id) actions.selectCard(card.id); }}>
            <header className="tc-card-header" onPointerDown={(event) => { if (event.target instanceof Element && event.target.closest("button")) return; beginMove(event, card); }}>
              <button className="tc-move-handle" type="button" disabled={card.pinned} aria-label={`移动${card.title}；方向键微调，Shift 加快`} title={card.pinned ? "已固定位置" : "拖动标题移动；方向键微调"} onPointerDown={(event) => beginMove(event, card)} onKeyDown={(event) => keyboardMove(event, card)}><IconGripVertical size={15} /></button><h3 title={card.title}>{card.title}</h3>{collapsed && <small className="tc-collapse-summary">{cardSummary(card)}</small>}{card.pinned && <span className="tc-pin-label"><IconPin size={11} />已固定</span>}
              <div className="tc-card-actions">{onOpenContent && <button type="button" aria-label={`展开查看${card.title}`} title="展开查看完整内容" onClick={() => onOpenContent(card.id)}><IconExternalLink size={13} /></button>}<button type="button" aria-label={card.pinned ? `取消固定${card.title}` : `固定${card.title}`} title={card.pinned ? "取消固定" : "固定位置与尺寸"} aria-pressed={card.pinned} onClick={() => actions.togglePin(card.id)}><IconPin size={13} /></button><button type="button" aria-label={collapsed ? `展开${card.title}` : `折叠${card.title}`} title={collapsed ? "展开内容" : "折叠内容"} aria-expanded={!collapsed} onClick={() => toggleCollapsed(card.id)}>{collapsed ? <IconChevronRight size={14} /> : <IconChevronDown size={14} />}</button><button type="button" aria-label={`收纳${card.title}`} title="收纳到本任务内容" onClick={() => actions.hideCard(card.id)}><IconX size={13} /></button></div>
            </header>
            <div className="tc-card-content" hidden={collapsed}>{renderMaterial ? renderMaterial(card.id, card) : <div className="tc-slot-placeholder"><span>当前任务内容</span><button type="button" onClick={onOpenContents}>打开内容索引</button></div>}</div>
            {!collapsed && <button className="tc-resize-handle" type="button" disabled={card.pinned} aria-label={`调整${card.title}尺寸；方向键微调`} title={card.pinned ? "已固定尺寸" : "拖动调整尺寸；方向键微调"} onPointerDown={(event) => beginResize(event, card)} onKeyDown={(event) => keyboardResize(event, card)}><IconArrowsDiagonal size={12} /></button>}
          </section>;
        })}
      </div>

      {contentsOpen && contents && <div className="tc-floating-index">{contents}</div>}
      {!visibleCards.length && <div className="tc-empty-state"><IconLayoutBoard size={23} /><strong>{hiddenCards.length ? "当前内容已收纳" : "尚未加入材料"}</strong><p>{hiddenCards.length ? "从本任务内容中恢复，位置和操作记录仍保留。" : "在对话或材料中选择“在画布中整理”，把需要关联的内容放到这里。"}</p><button type="button" onClick={onOpenContents}><IconLayoutList size={14} />选择本任务材料</button></div>}

      <div className="tc-mini-map"><svg role="button" tabIndex={0} aria-label="画布小地图，点击定位；Enter 适应全部内容" viewBox={`${minimapBounds.x} ${minimapBounds.y} ${minimapBounds.width} ${minimapBounds.height}`} onClick={mapClick} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); actions.fitCanvas(stageSize.width, stageSize.height); } }}>{visibleCards.map((card) => <rect key={card.id} x={card.x} y={card.y} width={card.width} height={isCollapsed(card) ? COLLAPSED_HEIGHT : card.height} rx="12" className={selected?.id === card.id ? "is-selected" : ""} />)}<rect className="tc-map-viewport" x={-panX / zoom} y={-panY / zoom} width={stageSize.width / zoom} height={stageSize.height / zoom} /></svg><span>点击小地图定位</span></div>

      <div className="tc-canvas-controls"><div className="tc-zoom-controls"><button type="button" disabled={zoom <= MIN_ZOOM} aria-label="缩小画布" title="缩小画布" onClick={() => changeZoom(zoom - 0.1)}><IconMinus size={15} /></button><button className="tc-zoom-label" type="button" title="还原 100% 画布比例" onClick={() => changeZoom(1)}>{Math.round(zoom * 100)}%</button><button type="button" disabled={zoom >= MAX_ZOOM} aria-label="放大画布" title="放大画布" onClick={() => changeZoom(zoom + 0.1)}><IconPlus size={15} /></button></div><button type="button" aria-label="适应全部可见内容" title="适应全部可见内容" onClick={() => actions.fitCanvas(stageSize.width, stageSize.height)}><IconFocus2 size={16} /></button><button type="button" className={handMode ? "is-active" : ""} aria-pressed={handMode} aria-label={handMode ? "退出抓手模式" : "切换抓手平移模式"} title="抓手平移" onClick={() => setHandMode((current) => !current)}><IconHandMove size={16} /></button>{state.lastHiddenId && <button type="button" aria-label="恢复刚收纳的内容" title="恢复刚收纳的内容" onClick={() => actions.restore()}><IconRestore size={15} /></button>}</div>
      <div className="tc-canvas-hint">空白拖动平移 · ⌘ / Ctrl 滚轮缩放{hiddenCards.length ? ` · 已收纳 ${hiddenCards.length} 项` : ""}</div>
    </div>
    {(flow?.state?.notice || flow?.state?.error) && <div className={"tc-flow-status" + (flow.state.error ? " is-error" : "")} role={flow.state.error ? "alert" : "status"} aria-live="polite">{flow.state.error ? <IconAlertTriangle size={13} /> : <IconLayoutBoard size={13} />}<span>{flow.state.error || flow.state.notice}</span></div>}
  </aside>;
}

export default TaskCanvas;
