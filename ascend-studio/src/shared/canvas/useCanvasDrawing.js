import { useEffect, useRef, useState } from "react";

export function useCanvasDrawing({ canvasContent, editing }) {
  const [drawingMode, setDrawingMode] = useState(false);
  const [targetCardId, setTargetCardId] = useState(null);
  const [draft, setDraft] = useState([]);
  const stroke = useRef(null);
  const drawings = canvasContent?.state.drawings || [];

  useEffect(() => {
    if (!editing) {
      setDrawingMode(false);
      setTargetCardId(null);
      setDraft([]);
      const activeStroke = stroke.current;
      stroke.current = null;
      if (activeStroke?.surface?.hasPointerCapture(activeStroke.pointerId)) activeStroke.surface.releasePointerCapture(activeStroke.pointerId);
    }
  }, [editing]);

  const pointFor = (event, surface) => {
    const rect = surface.getBoundingClientRect();
    const scaleX = rect.width / Math.max(1, surface.clientWidth);
    const scaleY = rect.height / Math.max(1, surface.clientHeight);
    return {
      x: (event.clientX - rect.left) / scaleX,
      y: (event.clientY - rect.top) / scaleY,
    };
  };

  const start = cardId => {
    if (!editing || !cardId) return;
    setTargetCardId(cardId);
    setDrawingMode(true);
  };

  const stop = () => {
    setDrawingMode(false);
    setTargetCardId(null);
    setDraft([]);
    const activeStroke = stroke.current;
    stroke.current = null;
    if (activeStroke?.surface?.hasPointerCapture(activeStroke.pointerId)) activeStroke.surface.releasePointerCapture(activeStroke.pointerId);
  };

  const begin = (event, surface, cardId) => {
    if (!editing || !drawingMode || !targetCardId || targetCardId !== cardId || event.button !== 0) return false;
    event.preventDefault();
    event.stopPropagation();
    stroke.current = { pointerId: event.pointerId, cardId, points: [pointFor(event, surface)], surface };
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
    const cardId = stroke.current.cardId;
    stroke.current = null;
    setDraft([]);
    if (points.length > 1) canvasContent?.actions.addDrawing({ cardId, points, color: "#55585a", width: 3 });
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

  return { drawingMode, targetCardId, drawings, draft, start, stop, begin, move, finish, cancel };
}
