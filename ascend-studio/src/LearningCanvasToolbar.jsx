import { IconArrowsMaximize, IconCheck, IconHandMove, IconLayoutColumns, IconLayoutRows, IconMinus, IconPencil, IconPlus } from "@tabler/icons-react";

export default function LearningCanvasToolbar({ layout, scale, hand, positionEditing = false, onTogglePositionEditing, onLayout, onZoom, onResetZoom, onHand, onFit }) {
  return <div className="lh-toolbar" role="toolbar" aria-label="画布视图与编辑操作">
    <div className="lh-layout-toggle" role="group" aria-label="画布布局">
      <button type="button" title="左右布局" aria-label="左右布局" aria-pressed={layout === "horizontal"} onClick={() => onLayout("horizontal")}><IconLayoutColumns size={16} /></button>
      <button type="button" title="上下布局" aria-label="上下布局" aria-pressed={layout === "vertical"} onClick={() => onLayout("vertical")}><IconLayoutRows size={16} /></button>
    </div>
    <span className="lh-toolbar-rule" aria-hidden="true" />
    <div className="lh-zoom-controls" role="group" aria-label="缩放画布">
      <button type="button" aria-label="缩小画布" title="缩小画布" onClick={() => onZoom(-.1)}><IconMinus size={15} /></button>
      <button type="button" className="lh-zoom-value" onClick={onResetZoom} title="还原 100% 画布比例">{Math.round(scale * 100)}%</button>
      <button type="button" aria-label="放大画布" title="放大画布" onClick={() => onZoom(.1)}><IconPlus size={15} /></button>
    </div>
    <span className="lh-toolbar-rule" aria-hidden="true" />
    <button type="button" className={`lh-tool-button${hand ? " is-active" : ""}`} aria-pressed={hand} title={hand ? "退出抓手平移" : "抓手平移"} aria-label={hand ? "退出抓手平移" : "抓手平移"} onClick={onHand}><IconHandMove size={16} /></button>
    <button type="button" className="lh-tool-button" title="适应全部可见内容" aria-label="适应全部可见内容" onClick={onFit}><IconArrowsMaximize size={16} /></button>
    <span className="lh-toolbar-rule" aria-hidden="true" />
    <button type="button" className={`lh-tool-button${positionEditing ? " is-active" : ""}`} aria-pressed={positionEditing} title={positionEditing ? "完成画布编辑" : "编辑画布位置"} aria-label={positionEditing ? "完成画布编辑" : "编辑画布位置"} onClick={onTogglePositionEditing}>{positionEditing ? <IconCheck size={16} /> : <IconPencil size={16} />}</button>
  </div>;
}
