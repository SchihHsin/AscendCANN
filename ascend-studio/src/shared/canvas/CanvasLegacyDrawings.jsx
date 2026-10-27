export default function CanvasLegacyDrawings({ className, drawings = [], width = 1, height = 1, editable = false, selectedId = null, onSelect, onDelete }) {
  if (!drawings.length) return null;

  return <svg className={className} width={width} height={height} aria-hidden={!editable || undefined} aria-label={editable ? "可选中的旧画布笔迹" : undefined}>
    {drawings.map((drawing, index) => {
      const points = (drawing.points || []).map(point => `${point.x},${point.y}`).join(" ");
      const selected = drawing.id === selectedId;
      const select = event => {
        event?.stopPropagation?.();
        onSelect?.(drawing.id);
      };
      const handleKeyDown = event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select(event);
        } else if ((event.key === "Delete" || event.key === "Backspace") && selected) {
          event.preventDefault();
          event.stopPropagation();
          onDelete?.(drawing.id);
        }
      };

      return <g key={drawing.id}>
        {selected && <polyline className="canvas-legacy-drawing-selection" points={points} />}
        <polyline className="canvas-legacy-drawing-line" points={points} stroke={drawing.color || "#55585a"} strokeWidth={drawing.width || 3} />
        {editable && <polyline
          className="canvas-legacy-drawing-hit-target"
          points={points}
          strokeWidth={Math.max(14, (drawing.width || 3) + 10)}
          tabIndex={0}
          role="button"
          aria-label={`选择画布笔迹 ${index + 1}`}
          aria-pressed={selected}
          onFocus={() => onSelect?.(drawing.id)}
          onPointerDown={event => { event.stopPropagation(); event.currentTarget.focus(); }}
          onClick={select}
          onKeyDown={handleKeyDown}
        />}
      </g>;
    })}
  </svg>;
}
