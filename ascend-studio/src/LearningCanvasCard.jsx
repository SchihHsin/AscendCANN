import { IconBook2, IconChevronDown, IconGripVertical, IconMaximize, IconPin, IconPinnedOff, IconTarget } from "@tabler/icons-react";

export default function LearningCanvasCard({ id, title, icon: Icon = IconBook2, point, width, pinned, children, onDrag, onFocus, onMaximize, onTogglePin, onCollapse, className = "" }) {
  return <section className={`lh-card ${className}${pinned ? " is-pinned" : ""}`} data-object-id={id} style={{ left: point.x, top: point.y, width }} aria-label={title}>
    <header className="lh-card-header">
      <div className="lh-card-title"><Icon size={18} /><strong>{title}</strong></div>
      <div className="lh-card-tools">
        {onDrag && <button type="button" className="lh-icon-button lh-drag-handle" aria-label={`移动${title}`} title="拖动卡片；方向键微调" onPointerDown={event => onDrag(event, id, point)} onKeyDown={event => { const vectors = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }; if (vectors[event.key]) { event.preventDefault(); onDrag(null, id, { x: point.x + vectors[event.key][0], y: point.y + vectors[event.key][1] }); } }}><IconGripVertical size={14} /></button>}
        {onFocus && <button className="lh-icon-button" type="button" title="聚焦到画布中的这个节点" aria-label={`聚焦到${title}`} onClick={() => onFocus(id)}><IconTarget size={14} /></button>}
        {onMaximize && <button className="lh-icon-button" type="button" title="放大到右侧完整工作区" aria-label={`放大${title}到完整工作区`} onClick={() => onMaximize(id)}><IconMaximize size={14} /></button>}
        <button className="lh-icon-button" type="button" title={pinned ? "取消固定" : "固定位置"} aria-label={`${pinned ? "取消固定" : "固定"}${title}`} aria-pressed={pinned} onClick={() => onTogglePin(id)}>{pinned ? <IconPinnedOff size={14} /> : <IconPin size={14} />}</button>
        {onCollapse && <button className="lh-icon-button" type="button" title="收起内容" aria-label={`收起${title}`} onClick={onCollapse}><IconChevronDown size={15} /></button>}
      </div>
    </header>
    {children}
  </section>;
}
