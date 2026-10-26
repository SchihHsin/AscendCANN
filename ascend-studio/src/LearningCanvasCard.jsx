import { IconBook2, IconChevronDown, IconFocus2, IconGripVertical, IconMaximize, IconMinimize, IconPin, IconPinnedOff } from "@tabler/icons-react";
import { CanvasCardActions, CanvasCardButton, CanvasCardFrame, CanvasCardHeader } from "./shared/canvas/index.jsx";

export default function LearningCanvasCard({ id, title, icon: Icon = IconBook2, point, width, pinned, maximized = false, maximizedWidth, maximizedHeight, children, onDrag, onFocus, onMaximize, onTogglePin, onCollapse, className = "" }) {
  const frameStyle = maximized ? { left: 18, top: 18, width: maximizedWidth, height: maximizedHeight, overflow: "auto" } : { left: point.x, top: point.y, width };
  return <CanvasCardFrame className={`lh-card ${maximized ? "is-maximized" : ""} ${className}`} data-object-id={id} style={frameStyle} aria-label={title} pinned={pinned}>
    <CanvasCardHeader className="lh-card-header">
      <div className="canvas-card-title lh-card-title"><Icon size={18} /><strong>{title}</strong></div>
      <CanvasCardActions className="lh-card-tools">
        {onDrag && !maximized && <CanvasCardButton type="button" className="lh-icon-button lh-drag-handle" aria-label={`移动${title}`} title="拖动卡片；方向键微调" onPointerDown={event => onDrag(event, id, point)} onKeyDown={event => { const vectors = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }; if (vectors[event.key]) { event.preventDefault(); onDrag(null, id, { x: point.x + vectors[event.key][0], y: point.y + vectors[event.key][1] }); } }}><IconGripVertical size={14} /></CanvasCardButton>}
        {onFocus && !maximized && <CanvasCardButton type="button" className="lh-icon-button" title="聚焦到画布中的这个节点" aria-label={`聚焦到${title}`} onClick={() => onFocus(id)}><IconFocus2 size={14} /></CanvasCardButton>}
        {onMaximize && <CanvasCardButton type="button" className="lh-icon-button" title={maximized ? "还原画布视图" : "放大到右侧完整工作区"} aria-label={maximized ? `还原${title}到画布` : `放大${title}到完整工作区`} aria-pressed={maximized} onClick={() => onMaximize(id)}>{maximized ? <IconMinimize size={14} /> : <IconMaximize size={14} />}</CanvasCardButton>}
        <CanvasCardButton type="button" className="lh-icon-button" title={pinned ? "取消固定" : "固定位置"} aria-label={`${pinned ? "取消固定" : "固定"}${title}`} active={pinned} onClick={() => onTogglePin(id)}>{pinned ? <IconPinnedOff size={14} /> : <IconPin size={14} />}</CanvasCardButton>
        {onCollapse && !maximized && <CanvasCardButton type="button" className="lh-icon-button" title="收起内容" aria-label={`收起${title}`} onClick={onCollapse}><IconChevronDown size={15} /></CanvasCardButton>}
      </CanvasCardActions>
    </CanvasCardHeader>
    {children}
  </CanvasCardFrame>;
}
