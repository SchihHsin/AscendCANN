import { ICON_SIZE } from "./icon-system.js";
import { IconCheck, IconHandMove, IconLayoutColumns, IconLayoutRows, IconPencil, IconPlus, IconRestore, IconStack2 } from "@tabler/icons-react";
import { CanvasFitIcon, CanvasToolButton, CanvasToolbar, CanvasToolbarGroup, CanvasZoomGroup } from "./shared/canvas/index.jsx";

export default function LearningCanvasToolbar({ layout, scale, hand, positionEditing = false, drawingMode = false, hasHiddenContent = false, onTogglePositionEditing, allExpanded = false, onToggleAllExpanded, onLayout, onZoom, onResetZoom, onHand, onFit, onAddNode, onToggleDrawing, onRestoreContent }) {
  return <CanvasToolbar className="lh-toolbar" aria-label="画布视图与编辑操作">
    <CanvasToolbarGroup className="lh-layout-toggle" label="画布布局">
      <CanvasToolButton type="button" active={layout === "horizontal"} title="左右布局" aria-label="左右布局" onClick={() => onLayout("horizontal")}><IconLayoutColumns size={ICON_SIZE.control} /></CanvasToolButton>
      <CanvasToolButton type="button" active={layout === "vertical"} title="上下布局" aria-label="上下布局" onClick={() => onLayout("vertical")}><IconLayoutRows size={ICON_SIZE.control} /></CanvasToolButton>
    </CanvasToolbarGroup>
    <CanvasZoomGroup value={scale} min={0.35} max={1.6} onZoom={onZoom} onReset={onResetZoom} />
    <CanvasToolbarGroup label="画布定位">
      <CanvasToolButton type="button" active={hand} title={hand ? "退出抓手平移" : "抓手平移"} aria-label={hand ? "退出抓手平移" : "抓手平移"} onClick={onHand}><IconHandMove size={ICON_SIZE.control} /></CanvasToolButton>
      <CanvasToolButton type="button" title="适应全部可见内容" aria-label="适应全部可见内容" onClick={onFit}><CanvasFitIcon /></CanvasToolButton>
    </CanvasToolbarGroup>
    {onToggleAllExpanded && <CanvasToolbarGroup className="lh-all-toggle-group" label="节点内容"><CanvasToolButton className="lh-all-toggle" type="button" active={allExpanded} title={allExpanded ? "收起所有节点内容卡片" : "展开所有节点内容卡片"} aria-label={allExpanded ? "收起所有节点内容卡片" : "展开所有节点内容卡片"} aria-pressed={allExpanded} onClick={onToggleAllExpanded}><IconStack2 size={ICON_SIZE.control} /><span>{allExpanded ? "收起" : "全部展开"}</span></CanvasToolButton></CanvasToolbarGroup>}
    <CanvasToolbarGroup label="画布编辑">
      <CanvasToolButton className={positionEditing ? "canvas-tool-button--labeled" : ""} type="button" active={positionEditing} title={positionEditing ? "完成编辑并退出编辑状态" : "编辑画布位置"} aria-label={positionEditing ? "完成编辑并退出编辑状态" : "编辑画布位置"} onClick={onTogglePositionEditing}>{positionEditing ? <><IconCheck size={ICON_SIZE.control} /><span>完成编辑</span></> : <IconPencil size={ICON_SIZE.control} />}</CanvasToolButton>
    </CanvasToolbarGroup>
    {positionEditing && (onAddNode || onToggleDrawing || hasHiddenContent) && <CanvasToolbarGroup className="canvas-toolbar-group--add-content" label="新增画布内容">
      {onAddNode && <CanvasToolButton type="button" title="新增节点：便签" aria-label="新增节点：便签" onClick={onAddNode}><IconPlus size={ICON_SIZE.control} /></CanvasToolButton>}
      {onToggleDrawing && <CanvasToolButton type="button" active={drawingMode} title={drawingMode ? "结束卡片绘图" : "新增手绘卡片"} aria-label={drawingMode ? "结束卡片绘图" : "新增手绘卡片"} onClick={onToggleDrawing}><IconPencil size={ICON_SIZE.control} /></CanvasToolButton>}
      {hasHiddenContent && onRestoreContent && <CanvasToolButton type="button" title="恢复刚收起的便签" aria-label="恢复刚收起的便签" onClick={onRestoreContent}><IconRestore size={ICON_SIZE.control} /></CanvasToolButton>}
    </CanvasToolbarGroup>}
  </CanvasToolbar>;
}
