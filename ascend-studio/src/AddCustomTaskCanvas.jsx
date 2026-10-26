import { ICON_SIZE } from "./icon-system.js";
import "./addcustom-task-canvas.css";
import { IconArrowLeft } from "@tabler/icons-react";

function toneClass(tone) {
  return ["confirmed", "review", "pending", "blocked", "neutral"].includes(tone) ? ` is-${tone}` : "";
}

export function AddCustomTaskCanvas({ item, relatedItems = [], onOpenRelated, onReturnCanvas, children }) {
  return <section className="ac-task-canvas" aria-label="AddCustom 节点完整内容">
    <header className="ac-task-canvas-header">
      <div className="ac-task-canvas-heading">
        <span>节点内容</span>
        <strong title={item?.title || "任务内容"}>{item?.title || "任务内容"}</strong>
      </div>
      <div className="ac-task-canvas-header-actions">
        {item?.state?.label && <span className={`ac-task-canvas-state${toneClass(item.state.tone)}`} title={item.state.detail || item.state.label}>{item.state.label}</span>}
        <button type="button" className="ac-task-canvas-return" onClick={onReturnCanvas} aria-label="返回画布中的聚焦视图" title="返回画布中的聚焦视图"><IconArrowLeft size={ICON_SIZE.inline} /><span>返回画布</span></button>
      </div>
    </header>
    <div className="ac-task-canvas-main">{children}</div>
    {relatedItems.length > 0 && <nav className="ac-task-canvas-related" aria-label="当前节点的直接关联">
      <span className="ac-task-canvas-related-label">直接关联</span>
      <div className="ac-task-canvas-related-list">
        {relatedItems.map((related) => <button key={related.id} type="button" onClick={() => onOpenRelated?.(related.id)} title={`${related.relationLabel} · ${related.title}`}>
          <small>{related.relationLabel}</small>
          <strong>{related.title}</strong>
          {related.status && <em>{related.status}</em>}
        </button>)}
      </div>
    </nav>}
  </section>;
}

export default AddCustomTaskCanvas;
