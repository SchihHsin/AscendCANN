import { IconGripVertical, IconTrash, IconX } from "@tabler/icons-react";
import { CanvasCardButton, CanvasCardFrame, CanvasCardHeader } from "./index.jsx";
import CanvasDrawingSurface from "./CanvasDrawingSurface.jsx";
import CanvasNoteContent from "./CanvasNoteContent.jsx";

export default function CanvasUserNote({ card, selected, editing, drawingMode = false, drawings = [], draft = [], onMoveStart, onUpdate, onHide, onDelete, onDrawingBegin, onDrawingMove, onDrawingFinish, onDrawingCancel }) {
  return <CanvasCardFrame className="canvas-user-note" selected={selected} aria-label={card.title} style={{ left: card.x, top: card.y, width: card.width, height: card.height, zIndex: 12 }}>
    <CanvasCardHeader className={`canvas-user-note-header${editing ? " is-draggable" : ""}`} onPointerDown={event => editing && onMoveStart?.(event, card)}>
      {editing && <IconGripVertical size={14} aria-hidden="true" />}
      <strong>{card.title}</strong>
      {editing && <div className="canvas-card-actions">
        <CanvasCardButton type="button" aria-label={`收起${card.title}`} title="收起卡片" onPointerDown={event => event.stopPropagation()} onClick={() => onHide?.(card.id)}><IconX size={14} /></CanvasCardButton>
        <CanvasCardButton className="is-destructive" type="button" aria-label={`删除${card.title}`} title="删除卡片" onPointerDown={event => event.stopPropagation()} onClick={() => onDelete?.(card.id)}><IconTrash size={14} /></CanvasCardButton>
      </div>}
    </CanvasCardHeader>
    {card.kind === "drawing" ? <CanvasDrawingSurface cardId={card.id} drawings={drawings} draft={draft} drawingMode={drawingMode} onBegin={onDrawingBegin} onMove={onDrawingMove} onFinish={onDrawingFinish} onCancel={onDrawingCancel} /> : <CanvasNoteContent card={card} editing={editing} onUpdate={patch => onUpdate?.(card.id, patch)} />}
  </CanvasCardFrame>;
}
