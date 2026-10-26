import { ICON_SIZE } from "../../icon-system.js";
import { forwardRef, useRef } from "react";
import { IconArrowsMinimize, IconMinus, IconPlus } from "@tabler/icons-react";

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
