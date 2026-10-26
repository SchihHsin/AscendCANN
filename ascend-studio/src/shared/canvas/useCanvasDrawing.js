import { useEffect, useRef, useState } from "react";

export function useCanvasDrawing({ canvasContent, editing, viewport }) {
  const [drawingMode, setDrawingMode] = useState(false);
  const [draft, setDraft] = useState([]);
  const stroke = useRef(null);
  const drawings = canvasContent?.state.drawings || [];

  useEffect(() => {
    if (!editing) {
      setDrawingMode(false);
      setDraft([]);
      stroke.current = null;
    }
  }, [editing]);

  const pointFor = (event, surface) => {
    const rect = surface.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - viewport.x) / viewport.scale,
      y: (event.clientY - rect.top - viewport.y) / viewport.scale,
    };
  };

  const begin = (event, surface, blockedSelector) => {
    if (!editing || !drawingMode || event.button !== 0 || event.target.closest(blockedSelector)) return false;
    event.preventDefault();
    event.stopPropagation();
    stroke.current = { pointerId: event.pointerId, points: [pointFor(event, surface)] };
    surface.setPointerCapture(event.pointerId);
    setDraft(stroke.current.points);
    return true;
  };

  const move = (event, surface) => {
    if (!stroke.current || stroke.current.pointerId !== event.pointerId) return false;
    event.preventDefault();
    const next = pointFor(event, surface);
    const points = stroke.current.points;
    const last = points[points.length - 1];
    if (Math.hypot(next.x - last.x, next.y - last.y) >= 2) {
      stroke.current = { ...stroke.current, points: [...points, next] };
      setDraft(stroke.current.points);
    }
    return true;
  };

  const finish = (event, surface) => {
    if (!stroke.current || stroke.current.pointerId !== event.pointerId) return false;
    const points = stroke.current.points;
    stroke.current = null;
    setDraft([]);
    if (points.length > 1) canvasContent?.actions.addDrawing({ points, color: "#7468a1", width: 3 });
    if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
    return true;
  };

  const cancel = (event, surface) => {
    if (!stroke.current || stroke.current.pointerId !== event.pointerId) return false;
    stroke.current = null;
    setDraft([]);
    if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
    return true;
  };

  return { drawingMode, setDrawingMode, drawings, draft, begin, move, finish, cancel };
}
