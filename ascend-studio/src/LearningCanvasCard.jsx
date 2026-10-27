import { ICON_SIZE } from "./icon-system.js";
import { IconArrowUpRight, IconBook, IconChevronDown, IconChevronRight, IconFocus2, IconGripVertical, IconPin, IconPinnedOff } from "@tabler/icons-react";
import { CanvasCardActions, CanvasCardButton, CanvasCardFrame, CanvasCardHeader } from "./shared/canvas/index.jsx";

export default function LearningCanvasCard({ id, title, summary, icon: Icon = IconBook, point, width, pinned, collapsed = false, children, onDrag, onFocus, onOpenContent, onTogglePin, onCollapse, className = "" }) {
  const frameStyle = { left: point.x, top: point.y, width, ...(collapsed ? { height: 44 } : {}) };
  return <CanvasCardFrame className={`lh-card${collapsed ? " is-collapsed" : ""} ${className}`} data-object-id={id} style={frameStyle} aria-label={title} pinned={pinned} collapsed={collapsed}>
    <CanvasCardHeader className="lh-card-header">
      <div className="canvas-card-title lh-card-title"><Icon size={ICON_SIZE.heading} /><strong>{title}</strong></div>
      {collapsed && <small className="lh-collapse-summary">{summary || "内容已收起"}</small>}
      <CanvasCardActions className="lh-card-tools">
        {onDrag && <CanvasCardButton type="button" className="lh-icon-button lh-drag-handle" aria-label={`移动${title}`} title="拖动卡片；方向键微调" onPointerDown={event => onDrag(event, id, point)} onKeyDown={event => { const vectors = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }; if (vectors[event.key]) { event.preventDefault(); onDrag(null, id, { x: point.x + vectors[event.key][0], y: point.y + vectors[event.key][1] }); } }}><IconGripVertical size={ICON_SIZE.inline} /></CanvasCardButton>}
        {onFocus && <CanvasCardButton type="button" className="lh-icon-button" title="移到视野中心并适当放大；仍在画布内" aria-label={`聚焦${title}并适当放大`} onClick={() => onFocus(id)}><IconFocus2 size={ICON_SIZE.inline} /></CanvasCardButton>}
        {onOpenContent && <CanvasCardButton type="button" className="lh-icon-button" title="打开完整内容；离开画布查看" aria-label={`打开${title}完整内容`} onClick={() => onOpenContent(id)}><IconArrowUpRight size={ICON_SIZE.inline} /></CanvasCardButton>}
        <CanvasCardButton type="button" className="lh-icon-button" title={pinned ? "取消固定" : "固定位置"} aria-label={`${pinned ? "取消固定" : "固定"}${title}`} active={pinned} onClick={() => onTogglePin(id)}>{pinned ? <IconPinnedOff size={ICON_SIZE.inline} /> : <IconPin size={ICON_SIZE.inline} />}</CanvasCardButton>
        {onCollapse && <CanvasCardButton type="button" className="lh-icon-button" title={collapsed ? "展开内容" : "收起内容"} aria-label={collapsed ? `展开${title}` : `收起${title}`} aria-expanded={!collapsed} onClick={onCollapse}>{collapsed ? <IconChevronRight size={ICON_SIZE.inline} /> : <IconChevronDown size={ICON_SIZE.control} />}</CanvasCardButton>}
      </CanvasCardActions>
    </CanvasCardHeader>
    <div className="lh-card-content" hidden={collapsed} role="region" aria-label={`${title}内容；需要时可在卡片内滚动查看`} tabIndex={0}>{children}</div>
  </CanvasCardFrame>;
}
