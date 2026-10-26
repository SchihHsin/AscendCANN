import { IconBook2, IconChevronDown, IconFocus2, IconGripVertical, IconMaximize, IconPin, IconPinnedOff } from "@tabler/icons-react";
import { CanvasCardActions, CanvasCardButton, CanvasCardFrame, CanvasCardHeader } from "./shared/canvas/index.jsx";

export default function LearningCanvasCard({ id, title, icon: Icon = IconBook2, point, width, pinned, children, onDrag, onFocus, onMaximize, onTogglePin, onCollapse, className = "" }) {
  return <CanvasCardFrame className={`lh-card ${className}`} data-object-id={id} style={{ left: point.x, top: point.y, width }} aria-label={title} pinned={pinned}>
    <CanvasCardHeader className="lh-card-header">
      <div className="canvas-card-title lh-card-title"><Icon size={18} /><strong>{title}</strong></div>
      <CanvasCardActions className="lh-card-tools">
        {onDrag && <CanvasCardButton type="button" className="lh-icon-button lh-drag-handle" aria-label={`移动${title}`} title="拖动卡片；方向键微调" onPointerDown={event => onDrag(event, id, point)} onKeyDown={event => { const vectors = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }; if (vectors[event.key]) { event.preventDefault(); onDrag(null, id, { x: point.x + vectors[event.key][0], y: point.y + vectors[event.key][1] }); } }}><IconGripVertical size={14} /></CanvasCardButton>}
        {onFocus && <CanvasCardButton type="button" className="lh-icon-button" title="聚焦到画布中的这个节点" aria-label={`聚焦到${title}`} onClick={() => onFocus(id)}><IconFocus2 size={14} /></CanvasCardButton>}
        {onMaximize && <CanvasCardButton type="button" className="lh-icon-button" title="放大到右侧完整工作区" aria-label={`放大${title}到完整工作区`} onClick={() => onMaximize(id)}><IconMaximize size={14} /></CanvasCardButton>}
        <CanvasCardButton type="button" className="lh-icon-button" title={pinned ? "取消固定" : "固定位置"} aria-label={`${pinned ? "取消固定" : "固定"}${title}`} active={pinned} onClick={() => onTogglePin(id)}>{pinned ? <IconPinnedOff size={14} /> : <IconPin size={14} />}</CanvasCardButton>
        {onCollapse && <CanvasCardButton type="button" className="lh-icon-button" title="收起内容" aria-label={`收起${title}`} onClick={onCollapse}><IconChevronDown size={15} /></CanvasCardButton>}
      </CanvasCardActions>
    </CanvasCardHeader>
    {children}
  </CanvasCardFrame>;
}
