import { ICON_SIZE } from "./icon-system.js";
import { IconCheck, IconHandMove, IconLayoutColumns, IconLayoutRows, IconPencil, IconPlus, IconRestore, IconStack2, IconTrash } from "@tabler/icons-react";
import { CanvasFitIcon, CanvasToolButton, CanvasToolbar, CanvasToolbarGroup, CanvasZoomGroup } from "./shared/canvas/index.jsx";

export default function LearningCanvasToolbar({ layout, leftRightLayout = "horizontal", upDownLayout = "vertical", scale, hand, positionEditing = false, drawingMode = false, hasHiddenContent = false, hasLegacyDrawings = false, canDeleteSelectedDrawing = false, onTogglePositionEditing, allExpanded = false, onToggleAllExpanded, onLayout, onZoom, onResetZoom, onHand, onFit, onAddNode, onToggleDrawing, onDeleteSelectedDrawing, onRestoreContent }) {
  return <CanvasToolbar className="lh-toolbar" aria-label="画布视图与编辑操作">
    <CanvasToolbarGroup className="lh-layout-toggle" label="画布结构与内容">
      <CanvasToolButton type="button" active={layout === leftRightLayout} aria-pressed={layout === leftRightLayout} title="左右布局" aria-label="左右布局" onClick={() => onLayout(leftRightLayout)}><IconLayoutColumns size={ICON_SIZE.control} /></CanvasToolButton>
      <CanvasToolButton type="button" active={layout === upDownLayout} aria-pressed={layout === upDownLayout} title="上下布局" aria-label="上下布局" onClick={() => onLayout(upDownLayout)}><IconLayoutRows size={ICON_SIZE.control} /></CanvasToolButton>
      {onToggleAllExpanded && <CanvasToolButton className="lh-all-toggle" type="button" active={allExpanded} title={allExpanded ? "收起所有节点内容卡片" : "展开所有节点内容卡片"} aria-label={allExpanded ? "收起所有节点内容卡片" : "展开所有节点内容卡片"} aria-pressed={allExpanded} onClick={onToggleAllExpanded}><IconStack2 size={ICON_SIZE.control} /><span>{allExpanded ? "收起" : "全部展开"}</span></CanvasToolButton>}
    </CanvasToolbarGroup>
    <CanvasZoomGroup value={scale} min={0.35} max={1.6} onZoom={onZoom} onReset={onResetZoom} />
    <CanvasToolbarGroup label="画布定位">
      <CanvasToolButton type="button" active={hand} title={hand ? "退出抓手平移" : "抓手平移"} aria-label={hand ? "退出抓手平移" : "抓手平移"} onClick={onHand}><IconHandMove size={ICON_SIZE.control} /></CanvasToolButton>
      <CanvasToolButton type="button" title="适应全部可见内容" aria-label="适应全部可见内容" onClick={onFit}><CanvasFitIcon /></CanvasToolButton>
    </CanvasToolbarGroup>
    <CanvasToolbarGroup label="画布编辑">
      <CanvasToolButton className={positionEditing ? "canvas-tool-button--labeled" : ""} type="button" active={positionEditing} title={positionEditing ? "完成编辑并退出编辑状态" : "编辑画布位置"} aria-label={positionEditing ? "完成编辑并退出编辑状态" : "编辑画布位置"} onClick={onTogglePositionEditing}>{positionEditing ? <><IconCheck size={ICON_SIZE.control} /><span>完成编辑</span></> : <IconPencil size={ICON_SIZE.control} />}</CanvasToolButton>
    </CanvasToolbarGroup>
    {positionEditing && (onAddNode || onToggleDrawing || hasLegacyDrawings || hasHiddenContent) && <CanvasToolbarGroup className="canvas-toolbar-group--add-content" label="画布内容操作">
      {onAddNode && <CanvasToolButton type="button" title="新增节点：便签" aria-label="新增节点：便签" onClick={onAddNode}><IconPlus size={ICON_SIZE.control} /></CanvasToolButton>}
      {onToggleDrawing && <CanvasToolButton type="button" active={drawingMode} title={drawingMode ? "结束卡片绘图" : "新增手绘卡片"} aria-label={drawingMode ? "结束卡片绘图" : "新增手绘卡片"} onClick={onToggleDrawing}><IconPencil size={ICON_SIZE.control} /></CanvasToolButton>}
      {hasLegacyDrawings && onDeleteSelectedDrawing && <CanvasToolButton className="canvas-tool-button--labeled" type="button" disabled={!canDeleteSelectedDrawing} title={canDeleteSelectedDrawing ? "删除当前选中的旧笔迹" : "先点击要删除的笔迹，再删除"} aria-label={canDeleteSelectedDrawing ? "删除当前选中的旧笔迹" : "先点击要删除的笔迹，再删除"} onClick={onDeleteSelectedDrawing}><IconTrash size={ICON_SIZE.control} /><span>删除笔迹</span></CanvasToolButton>}
      {hasHiddenContent && onRestoreContent && <CanvasToolButton type="button" title="恢复刚收起的便签" aria-label="恢复刚收起的便签" onClick={onRestoreContent}><IconRestore size={ICON_SIZE.control} /></CanvasToolButton>}
    </CanvasToolbarGroup>}
  </CanvasToolbar>;
}
