import { IconArrowsMaximize, IconCheck, IconHandMove, IconLayoutColumns, IconLayoutRows, IconPencil, IconStack2 } from "@tabler/icons-react";
import { CanvasToolButton, CanvasToolbar, CanvasToolbarGroup, CanvasZoomGroup } from "./shared/canvas/index.jsx";

export default function LearningCanvasToolbar({ layout, scale, hand, positionEditing = false, onTogglePositionEditing, allExpanded = false, onToggleAllExpanded, onLayout, onZoom, onResetZoom, onHand, onFit }) {
  return <CanvasToolbar className="lh-toolbar" aria-label="画布视图与编辑操作">
    <CanvasToolbarGroup className="lh-layout-toggle" label="画布布局">
      <CanvasToolButton type="button" active={layout === "horizontal"} title="左右布局" aria-label="左右布局" onClick={() => onLayout("horizontal")}><IconLayoutColumns size={16} /></CanvasToolButton>
      <CanvasToolButton type="button" active={layout === "vertical"} title="上下布局" aria-label="上下布局" onClick={() => onLayout("vertical")}><IconLayoutRows size={16} /></CanvasToolButton>
    </CanvasToolbarGroup>
    <CanvasZoomGroup value={scale} min={0.35} max={1.6} onZoom={onZoom} onReset={onResetZoom} />
    {onToggleAllExpanded && <CanvasToolbarGroup className="lh-all-toggle-group" label="节点内容"><CanvasToolButton className="lh-all-toggle" type="button" active={allExpanded} title={allExpanded ? "收起所有节点内容卡片" : "展开所有节点内容卡片"} aria-label={allExpanded ? "收起所有节点内容卡片" : "展开所有节点内容卡片"} aria-pressed={allExpanded} onClick={onToggleAllExpanded}><IconStack2 size={16} /><span>{allExpanded ? "收起" : "全部展开"}</span></CanvasToolButton></CanvasToolbarGroup>}
    <CanvasToolbarGroup label="画布定位">
      <CanvasToolButton type="button" active={hand} title={hand ? "退出抓手平移" : "抓手平移"} aria-label={hand ? "退出抓手平移" : "抓手平移"} onClick={onHand}><IconHandMove size={16} /></CanvasToolButton>
      <CanvasToolButton type="button" title="适应全部可见内容" aria-label="适应全部可见内容" onClick={onFit}><IconArrowsMaximize size={16} /></CanvasToolButton>
    </CanvasToolbarGroup>
    <CanvasToolbarGroup label="画布编辑">
      <CanvasToolButton type="button" active={positionEditing} title={positionEditing ? "完成画布编辑" : "编辑画布位置"} aria-label={positionEditing ? "完成画布编辑" : "编辑画布位置"} onClick={onTogglePositionEditing}>{positionEditing ? <IconCheck size={16} /> : <IconPencil size={16} />}</CanvasToolButton>
    </CanvasToolbarGroup>
  </CanvasToolbar>;
}
