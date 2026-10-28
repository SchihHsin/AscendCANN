import { ICON_SIZE } from "./icon-system.js";
import { IconBook } from "@tabler/icons-react";
import { CanvasCardFrame, CanvasCardHeader, CanvasNodeActions, CanvasNodeMarker, CanvasNodeStatus } from "./shared/canvas/index.jsx";
import { normalizeCanvasNode } from "./shared/canvas/node-semantics.js";
import { canvasCardProfile } from "./shared/canvas/canvas-sizing.js";

export default function LearningCanvasCard({ id, title, summary, icon: Icon = IconBook, point, width, height, pinned, collapsed = false, children, onDrag, onFocus, onOpenContent, onTogglePin, onCollapse, nodeType = "material", contentType = "lesson", status, statusLabel, domain = "learning", className = "" }) {
  const profile = canvasCardProfile({ id, nodeType, contentType }, domain);
  const frameStyle = { left: point.x, top: point.y, width, ...(!collapsed && Number.isFinite(height) ? { height: Math.min(profile.maxHeight, Math.max(profile.height, height)) } : {}), ...(collapsed ? { height: 44 } : {}) };
  const semantics = normalizeCanvasNode({ id, title, summary, nodeType, contentType, status, statusLabel }, domain);
  const keyboardMove = event => {
    const vectors = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
    const vector = vectors[event.key];
    if (!vector) return;
    event.preventDefault();
    onDrag?.(null, id, { x: point.x + vector[0], y: point.y + vector[1] });
  };
  return <CanvasCardFrame className={`lh-card${collapsed ? " is-collapsed" : ""} ${className}`} data-object-id={id} data-node-type={semantics?.nodeType} data-content-type={semantics?.contentType} data-node-status={semantics?.status} data-node-domain={semantics?.domain} style={frameStyle} aria-label={[title, semantics?.nodeType, semantics?.statusLabel].filter(Boolean).join("，")} pinned={pinned} collapsed={collapsed}>
    <CanvasCardHeader className="lh-card-header">
      <div className="canvas-card-title lh-card-title"><CanvasNodeMarker nodeType={semantics?.nodeType} /><Icon size={ICON_SIZE.heading} /><strong>{title}</strong></div>
      <CanvasNodeStatus status={semantics?.status} statusLabel={semantics?.statusLabel} hideAvailable />
      {collapsed && <small className="lh-collapse-summary">{summary || "内容已收起"}</small>}
      <CanvasNodeActions
        className="lh-card-tools"
        title={title}
        move={onDrag ? { disabled: pinned, onPointerDown: event => onDrag(event, id, point), onKeyDown: keyboardMove, disabledTitle: "已固定位置" } : null}
        onFocus={onFocus ? () => onFocus(id) : null}
        onOpenContent={onOpenContent ? () => onOpenContent(id) : null}
        pin={onTogglePin ? { active: pinned, scope: "position", onToggle: () => onTogglePin(id) } : null}
        collapse={onCollapse ? { collapsed, onToggle: () => onCollapse(id) } : null}
      />
    </CanvasCardHeader>
    <div className="lh-card-content" hidden={collapsed} role="region" aria-label={`${title}内容；通常完整显示，内容超过卡片上限时可在卡片内滚动查看`} tabIndex={0}>{children}</div>
  </CanvasCardFrame>;
}
