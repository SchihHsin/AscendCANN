import { IconGripVertical, IconX } from "@tabler/icons-react";
import { CanvasCardButton, CanvasCardFrame, CanvasCardHeader } from "./index.jsx";

export default function CanvasUserNote({ card, selected, editing, onMoveStart, onChange, onHide }) {
  return <CanvasCardFrame className="canvas-user-note" selected={selected} aria-label={card.title} style={{ left: card.x, top: card.y, width: card.width, height: card.height, zIndex: 12 }}>
    <CanvasCardHeader className={`canvas-user-note-header${editing ? " is-draggable" : ""}`} onPointerDown={event => editing && onMoveStart?.(event, card)}>
      {editing && <IconGripVertical size={14} aria-hidden="true" />}
      <strong>{card.title}</strong>
      {editing && <CanvasCardButton type="button" aria-label={`收起${card.title}`} title="收起便签" onPointerDown={event => event.stopPropagation()} onClick={() => onHide?.(card.id)}><IconX size={14} /></CanvasCardButton>}
    </CanvasCardHeader>
    <textarea aria-label={`${card.title}内容`} placeholder="记下想补充的内容…" value={card.noteText || ""} readOnly={!editing} onChange={event => onChange?.(card.id, event.target.value)} />
  </CanvasCardFrame>;
}
