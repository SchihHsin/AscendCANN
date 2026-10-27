import { useEffect, useRef, useState } from "react";

export default function CanvasDrawingSurface({ cardId, drawings = [], draft = [], drawingMode = false, onBegin, onMove, onFinish, onCancel }) {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const surface = ref.current;
    if (!surface) return undefined;
    const measure = () => setSize({ width: Math.max(1, surface.clientWidth), height: Math.max(1, surface.clientHeight) });
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    measure();
    return () => observer.disconnect();
  }, []);

  const visibleDrawings = [...drawings, ...(draft.length > 1 ? [{ id: "draft", points: draft }] : [])];
  return <div
    ref={ref}
    className={`canvas-drawing-surface${drawingMode ? " is-drawing" : ""}`}
    role="group"
    aria-label={`${cardId} 手绘区域${drawingMode ? "；在卡片内拖动绘图" : ""}`}
    onPointerDown={event => drawingMode && onBegin?.(event, event.currentTarget, cardId)}
    onPointerMove={event => drawingMode && onMove?.(event, event.currentTarget)}
    onPointerUp={event => drawingMode && onFinish?.(event, event.currentTarget)}
    onPointerCancel={event => drawingMode && onCancel?.(event, event.currentTarget)}
    onLostPointerCapture={event => drawingMode && onCancel?.(event, event.currentTarget)}
  >
    {!visibleDrawings.length && <span className="canvas-drawing-hint">{drawingMode ? "在此卡片内拖动绘图" : "进入编辑后可在卡片内绘图"}</span>}
    <svg className="canvas-drawing-surface-svg" viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none" aria-hidden="true">
      {visibleDrawings.map(item => <polyline key={item.id} points={item.points.map(point => `${point.x},${point.y}`).join(" ")} />)}
    </svg>
  </div>;
}
