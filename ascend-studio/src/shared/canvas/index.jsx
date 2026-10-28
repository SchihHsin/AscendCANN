import { ICON_SIZE } from "../../icon-system.js";
import { forwardRef, useRef } from "react";
import {
  IconArrowsMinimize,
  IconChevronDown,
  IconChevronRight,
  IconFocus2,
  IconGripVertical,
  IconMaximize,
  IconMinus,
  IconPin,
  IconPinnedOff,
  IconPlus,
} from "@tabler/icons-react";
import { CANVAS_NODE_TYPE, normalizeCanvasStatus } from "./node-semantics.js";

export { focusViewportForBounds } from "./focus-viewport.js";

export const CanvasSurface = forwardRef(function CanvasSurface({ as: Element = "div", className = "", ...props }, ref) {
  return <Element {...props} ref={ref} className={`canvas-surface ${className}`.trim()} />;
});

export function CanvasToolbar({ as: Element = "div", placement = "top-right", className = "", children, ...props }) {
  return <Element {...props} className={`canvas-toolbar canvas-toolbar--${placement} ${className}`.trim()} role={props.role || "toolbar"}>{children}</Element>;
}

export function CanvasToolbarGroup({ as: Element = "div", label, className = "", children, ...props }) {
  return <Element {...props} className={`canvas-toolbar-group ${className}`.trim()} role={props.role || "group"} aria-label={label || props["aria-label"]}>{children}</Element>;
}

export function CanvasFitIcon({ size = ICON_SIZE.control }) {
  return <IconArrowsMinimize size={size} />;
}

export function CanvasToolButton({ active, className = "", children, ...props }) {
  const pressed = typeof active === "boolean" && props["aria-pressed"] === undefined ? { "aria-pressed": active } : {};
  return <button {...props} {...pressed} className={`canvas-tool-button ${active ? "is-active" : ""} ${className}`.trim()}>{children}</button>;
}

export function CanvasZoomGroup({ value, onZoom, onReset, min = 0.15, max = 1.5, step = 0.1, label = "缩放画布" }) {
  const percent = Math.round(value * 100);
  return <CanvasToolbarGroup className="canvas-toolbar-zoom" label={label}>
    <CanvasToolButton type="button" disabled={value <= min} aria-label="缩小画布" title="缩小画布" onClick={() => onZoom(-step)}><IconMinus size={ICON_SIZE.control} /></CanvasToolButton>
    <CanvasToolButton type="button" className="canvas-zoom-value" aria-label={`当前缩放 ${percent}%，点击恢复 100%`} title="恢复 100%" onClick={onReset}>{percent}%</CanvasToolButton>
    <CanvasToolButton type="button" disabled={value >= max} aria-label="放大画布" title="放大画布" onClick={() => onZoom(step)}><IconPlus size={ICON_SIZE.control} /></CanvasToolButton>
  </CanvasToolbarGroup>;
}

export function CanvasCardFrame({ as: Element = "section", className = "", selected = false, pinned = false, collapsed = false, children, ...props }) {
  return <Element {...props} className={`canvas-card-frame ${selected ? "is-selected" : ""} ${pinned ? "is-pinned" : ""} ${collapsed ? "is-collapsed" : ""} ${className}`.trim()}>{children}</Element>;
}

export function CanvasCardHeader({ as: Element = "header", className = "", children, ...props }) {
  return <Element {...props} className={`canvas-card-header ${className}`.trim()}>{children}</Element>;
}

export function CanvasCardActions({ as: Element = "div", className = "", children, ...props }) {
  return <Element {...props} className={`canvas-card-actions ${className}`.trim()}>{children}</Element>;
}

export function CanvasCardButton({ active, className = "", children, ...props }) {
  const pressed = typeof active === "boolean" && props["aria-pressed"] === undefined ? { "aria-pressed": active } : {};
  return <button {...props} {...pressed} className={`canvas-card-button ${active ? "is-active" : ""} ${className}`.trim()}>{children}</button>;
}

const NODE_TYPE_MARKERS = Object.freeze({
  [CANVAS_NODE_TYPE.GOAL]: { label: "目标", color: "#2787e8", surface: "#e9f2ff" },
  [CANVAS_NODE_TYPE.STEP]: { label: "步骤", color: "#5366c8", surface: "#edf0ff" },
  [CANVAS_NODE_TYPE.MATERIAL]: { label: "材料", color: "#e6a12d", surface: "#fff5e3" },
  [CANVAS_NODE_TYPE.EVIDENCE]: { label: "证据", color: "#8257c5", surface: "#f2ecfa" },
  [CANVAS_NODE_TYPE.ACTION]: { label: "操作", color: "#ec7169", surface: "#fff0ee" },
  [CANVAS_NODE_TYPE.RESULT]: { label: "结果", color: "#24a99f", surface: "#e5f7f5" },
  [CANVAS_NODE_TYPE.NOTE]: { label: "笔记", color: "#8257c5", surface: "#f2ecfa" },
});

export function CanvasNodeMarker({ nodeType, className = "" }) {
  const marker = NODE_TYPE_MARKERS[nodeType];
  if (!marker) return null;
  return <span className={`canvas-node-type-marker ${className}`.trim()} data-node-type={nodeType} title={`${marker.label}节点`} style={{ "--canvas-node-marker": marker.color, "--canvas-node-marker-surface": marker.surface }}>{marker.label}</span>;
}

const NODE_STATUS_CLASS = Object.freeze({
  "in-progress": "progress",
  proposed: "review",
  completed: "success",
  "needs-review": "review",
  blocked: "error",
  outdated: "review",
  archived: "neutral",
  available: "neutral",
});

export function CanvasNodeStatus({ status, statusLabel, hideAvailable = false, className = "" }) {
  const normalizedStatus = normalizeCanvasStatus(status);
  if (!statusLabel || (hideAvailable && normalizedStatus === "available")) return null;
  const tone = NODE_STATUS_CLASS[normalizedStatus] || "neutral";
  return <span className={`canvas-node-status is-${tone} ${className}`.trim()} data-node-status={normalizedStatus || "unknown"} title={statusLabel}>{statusLabel}</span>;
}

/** One action contract for material cards across freeform and learning canvases. */
export function CanvasNodeActions({ title, move, onFocus, onOpenContent, pin, collapse, className = "", children }) {
  const pinScope = pin?.scope === "position-and-size" ? "位置与尺寸" : "位置";
  const collapsed = Boolean(collapse?.collapsed);
  return <CanvasCardActions className={className}>
    {move && <CanvasCardButton
      type="button"
      className="canvas-node-action-move"
      disabled={Boolean(move.disabled)}
      aria-label={move.ariaLabel || `移动${title}`}
      title={move.disabled ? (move.disabledTitle || "位置已固定") : (move.title || "拖动卡片移动；方向键微调")}
      onPointerDown={move.onPointerDown}
      onKeyDown={move.onKeyDown}
    ><IconGripVertical size={ICON_SIZE.inline} /></CanvasCardButton>}
    {onFocus && <CanvasCardButton type="button" aria-label={`聚焦${title}`} title="聚焦到画布视野中心" onClick={onFocus}><IconFocus2 size={ICON_SIZE.inline} /></CanvasCardButton>}
    {onOpenContent && <CanvasCardButton type="button" aria-label={`打开${title}完整内容`} title="在任务内容区打开完整内容" onClick={onOpenContent}><IconMaximize size={ICON_SIZE.inline} /></CanvasCardButton>}
    {pin && <CanvasCardButton type="button" active={Boolean(pin.active)} aria-label={`${pin.active ? "取消固定" : "固定"}${title}${pinScope}`} title={pin.active ? `取消固定${pinScope}` : `固定${pinScope}`} onClick={pin.onToggle}>{pin.active ? <IconPinnedOff size={ICON_SIZE.inline} /> : <IconPin size={ICON_SIZE.inline} />}</CanvasCardButton>}
    {collapse && <CanvasCardButton type="button" aria-label={collapsed ? `展开${title}` : `收起${title}`} title={collapsed ? "展开卡片内容" : "收起卡片内容"} aria-expanded={!collapsed} onClick={collapse.onToggle}>{collapsed ? <IconChevronRight size={ICON_SIZE.inline} /> : <IconChevronDown size={ICON_SIZE.inline} />}</CanvasCardButton>}
    {children}
  </CanvasCardActions>;
}

function normalizeViewBox(viewBox) {
  if (typeof viewBox === "string") return viewBox;
  if (Array.isArray(viewBox)) return viewBox.join(" ");
  return `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
}

function viewBoxBounds(viewBox) {
  if (typeof viewBox === "string") {
    const [x, y, width, height] = viewBox.trim().split(/[\s,]+/).map(Number);
    return { x, y, width, height };
  }
  if (Array.isArray(viewBox)) return { x: viewBox[0], y: viewBox[1], width: viewBox[2], height: viewBox[3] };
  return viewBox;
}

export function CanvasMiniMap({ viewBox, viewport, onNavigate, onFit, placement = "bottom-right", className = "", ariaLabel = "画布小地图；点击或拖动定位，按 Enter 适应全部内容", children }) {
  const svgRef = useRef(null);
  const activePointer = useRef(null);
  const bounds = viewBoxBounds(viewBox);
  const navigate = (event) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    onNavigate?.({ x: point.x, y: point.y });
  };
  const start = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    activePointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    navigate(event);
  };
  const move = (event) => {
    if (activePointer.current === event.pointerId) { event.stopPropagation(); navigate(event); }
  };
  const end = (event) => {
    if (activePointer.current !== event.pointerId) return;
    event.stopPropagation();
    activePointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return <div className={`canvas-minimap canvas-minimap--${placement} ${className}`.trim()}>
    <svg ref={svgRef} className="canvas-minimap-svg" viewBox={normalizeViewBox(viewBox)} role="button" tabIndex={0} aria-label={ariaLabel} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={() => { activePointer.current = null; }} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && onFit) { event.preventDefault(); onFit(); } }}>
      <rect className="canvas-minimap-background" x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} />
      {children}
      {viewport && <rect className="canvas-minimap-viewport" {...viewport} />}
    </svg>
  </div>;
}
