import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  IconArrowRight,
  IconCode,
  IconDots,
  IconFileDescription,
  IconGitCompare,
  IconLayoutBoard,
  IconLayoutColumns,
  IconPlus,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import "./task-workspace.css";

const typeLabels = { code: "代码", source: "只读代码", preview: "预览", browser: "浏览器", diff: "Diff", canvas: "画布", result: "结果", record: "记录", brief: "任务简报" };

function MaterialIcon({ type, size = 14 }) {
  const Icon = type === "canvas" ? IconLayoutBoard : type === "code" || type === "source" ? IconCode : type === "browser" ? IconWorld : type === "diff" ? IconGitCompare : IconFileDescription;
  return <Icon size={size} />;
}

function normalizeVisited(state) {
  const tabs = Array.isArray(state.tabs) ? state.tabs : [];
  return (Array.isArray(state.visitedTabs) ? state.visitedTabs : tabs).map((item) => typeof item === "string" ? tabs.find((tab) => tab.id === item) || { id: item, title: item } : item);
}

function SavedContent({ workspace, ownerId, contentId, showing, children }) {
  const scroller = useRef(null);
  useLayoutEffect(() => {
    if (showing && scroller.current) scroller.current.scrollTop = workspace.getTaskState(ownerId).positions?.[contentId] || 0;
  }, [showing, ownerId, contentId]);
  return <div className="tw-pane-content" ref={scroller} onScroll={event => workspace.actions.savePosition(contentId, event.currentTarget.scrollTop, ownerId)}>{children}</div>;
}

/** Ordinary viewers stay mounted while the task canvas is opened or closed. */
export function TaskWorkspace({ taskId, workspace, isMainTask, materials = [], contentItems = [], onOpen, onClose, onOpenCanvas, onArrange, onReturnFocus, onCollapse, renderContent, renderCanvas }) {
  const { state, actions } = workspace;
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPurpose, setPickerPurpose] = useState("new");
  const toolsRef = useRef(null);
  const pickerRef = useRef(null);
  const taskViews = useRef(new Map());
  const tabs = state.tabs || [];
  const activeTab = tabs.find((tab) => tab.id === state.activeId);
  const onCanvas = state.activeId === "canvas";
  const canReturn = Boolean(state.returnPoint?.activeId || state.lastContentId);
  const unreadTabs = tabs.filter((tab) => tab.unread && tab.id !== state.activeId);
  const knownIds = new Set(contentItems.map(item => item.id));
  const pickerMaterials = pickerPurpose === "split" || !isMainTask ? materials : materials.filter(item => !knownIds.has(item.id) && !item.id.startsWith("record:"));
  const activeHistory = contentItems.find(item => item.id === state.activeId)?.children || [];
  taskViews.current.set(taskId, { state, isMainTask, visited: normalizeVisited(state) });

  useEffect(() => { setMenuOpen(false); setPickerOpen(false); }, [taskId]);
  useEffect(() => {
    if (!menuOpen && !pickerOpen) return undefined;
    const outsideClick = (event) => {
      if (toolsRef.current?.contains(event.target) || pickerRef.current?.contains(event.target)) return;
      setMenuOpen(false);
      setPickerOpen(false);
    };
    const escape = (event) => { if (event.key === "Escape") { setMenuOpen(false); setPickerOpen(false); } };
    document.addEventListener("pointerdown", outsideClick);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outsideClick); document.removeEventListener("keydown", escape); };
  }, [menuOpen, pickerOpen]);

  const openMaterial = (material, split = false) => {
    if (material.available === false) return;
    onOpen?.(material.id, split || pickerPurpose === "split" ? { split: true, restore: true } : {});
    setPickerOpen(false);
  };
  const showPicker = (purpose = "new") => { setPickerPurpose(purpose); setMenuOpen(false); setPickerOpen(true); };
  const openCanvas = (mode = "overview", options = {}) => { setMenuOpen(false); setPickerOpen(false); onOpenCanvas?.({ mode, ...options }); };
  const activeTitle = onCanvas && state.canvasMode === "overview" ? "任务内容" : activeTab?.title || "任务内容";
  const returnToFocus = () => { setMenuOpen(false); onReturnFocus?.(); };

  return <section className="task-workspace" aria-label="任务内容工作区">
    <header className="tw-topbar">
      <div className="tw-current-title" title={activeTitle}><span>{activeTitle}</span>{unreadTabs.length > 0 && <span className="tw-unread-count" aria-label={`${unreadTabs.length}项内容有未读更新`}>{unreadTabs.length}</span>}</div>
      <div className="tw-topbar-actions">
        {state.referenceId === state.activeId && state.referenceReturnId && <button className="tw-nearby-action" type="button" onClick={actions.returnFromReference}>返回当前内容</button>}
        {isMainTask && <button className="tw-view-all" type="button" disabled={onCanvas && state.canvasMode === "overview" && !canReturn} aria-label={onCanvas && state.canvasMode === "overview" ? "回到刚才查看的内容" : "看全部任务内容"} onClick={() => onCanvas && state.canvasMode === "overview" ? returnToFocus() : openCanvas("overview", { fit: true })}>{onCanvas && state.canvasMode === "overview" ? "回到刚才" : "看全部"}</button>}
        <button className="tw-collapse" type="button" aria-label="收起任务内容工作区" title="收起任务内容工作区" onClick={() => onCollapse?.()}><IconX size={14} /></button>
        <div className="tw-tools" ref={toolsRef}>
          <button className={"tw-more-button" + (menuOpen ? " is-open" : "")} type="button" aria-label="更多任务内容操作" title="更多" aria-expanded={menuOpen} onClick={() => { setMenuOpen((current) => !current); setPickerOpen(false); }}><IconDots size={17} /></button>
          {menuOpen && <div className="tw-tools-menu">
            {state.referenceId && <button type="button" onClick={() => { actions.endSplit(); setMenuOpen(false); }}><IconX size={15} /><span>收起固定参考</span></button>}
            {activeHistory.length > 0 && <details className="tw-history-menu"><summary>历史记录 <span>{activeHistory.length}</span></summary><div>{[...activeHistory].reverse().map(item => <button type="button" key={item.id} onClick={() => { onOpen?.(item.id, { restore: true, title: item.title }); setMenuOpen(false); }}><strong>{item.title}</strong><small>{item.time} · {item.summary}</small></button>)}</div></details>}
            {state.activeId && !onCanvas && <button type="button" onClick={() => { (onClose || actions.close)(state.activeId); setMenuOpen(false); }}><IconX size={15} /><span>收起当前内容为概要</span></button>}
            {state.activeId && !onCanvas && isMainTask && !state.splitId && <button type="button" onClick={() => showPicker("split")}><IconLayoutColumns size={15} /><span>留一份参考</span></button>}
            <button type="button" onClick={() => showPicker()}><IconPlus size={15} /><span>新增内容</span></button>
            {isMainTask && <button type="button" onClick={() => openCanvas("free")}><IconLayoutBoard size={15} /><span>手动整理内容</span></button>}
          </div>}
        </div>
      </div>
    </header>

    <div className="tw-stage">
      {[...taskViews.current.entries()].map(([ownerTaskId, view]) => {
        const selectedTask = ownerTaskId === taskId;
        const current = workspace.getTaskState?.(ownerTaskId, view.isMainTask) || view.state;
        const currentCanvas = current.activeId === "canvas";
        const diagramSplit = current.splitId && [current.activeId, current.splitId].some(id => id === "explanation" || id.startsWith("image-"));
        const visited = normalizeVisited(current);
        const canvasVisited = visited.some((tab) => tab.id === "canvas");
        return <div className={"tw-task-body" + (current.splitId && !currentCanvas ? " has-split" : "") + (diagramSplit ? " is-diagram-split" : "")} key={ownerTaskId} hidden={!selectedTask}>
          {visited.filter((tab) => tab.id !== "canvas").map((tab) => {
            const primary = current.activeId === tab.id && !currentCanvas;
            const secondary = current.splitId === tab.id && !currentCanvas;
            const showing = selectedTask && !current.collapsed && (primary || secondary);
            return <section className={"tw-pane" + (primary ? " is-primary" : "") + (secondary ? " is-secondary" : "")} key={tab.id} id={`workspace-pane-${ownerTaskId}-${tab.id}`} role="region" aria-label={tab.title} hidden={!showing}>
              {secondary && <div className="tw-pane-label"><MaterialIcon type={tab.type} />{secondary ? <button className="tw-reference-focus" type="button" onClick={() => actions.activate(tab.id)}>查看参考 · {tab.title}</button> : <span>{tab.title}</span>}{secondary && <button type="button" aria-label="收起固定参考" onClick={() => actions.endSplit()}><IconX size={12} /></button>}</div>}
              <SavedContent workspace={workspace} ownerId={ownerTaskId} contentId={tab.id} showing={showing}>{renderContent?.(tab.id, ownerTaskId)}</SavedContent>
            </section>;
          })}
          {canvasVisited && view.isMainTask && <div className="tw-canvas-view" id={`workspace-pane-${ownerTaskId}-canvas`} role="region" aria-label="任务画布" hidden={!selectedTask || !currentCanvas}>{renderCanvas?.(selectedTask && !current.collapsed && currentCanvas, ownerTaskId)}</div>}
          {selectedTask && !current.activeId && <div className="tw-empty"><IconFileDescription size={24} /><strong>打开需要查看的内容</strong><p>代码、结果和参考资料会在这里展开。</p>{isMainTask && <button type="button" onClick={() => openCanvas()}><IconLayoutBoard size={14} />查看已有内容</button>}<button type="button" onClick={() => showPicker()}><IconPlus size={14} />新增内容</button></div>}
        </div>;
      })}
    </div>

    {pickerOpen && <div className="tw-material-picker" ref={pickerRef} aria-label="任务材料">
      <div className="tw-picker-header"><div><strong>{pickerPurpose === "split" ? "选择参考内容" : "新增任务内容"}</strong><span>{pickerPurpose === "split" ? "保留当前内容，下一步也能查看这份参考" : "已使用的内容自动保留在总览中"}</span></div><button type="button" aria-label="关闭材料列表" onClick={() => setPickerOpen(false)}><IconX size={15} /></button></div>
      <div className="tw-material-list">{pickerMaterials.map((material) => {
        const available = material.available !== false;
        return <div className={"tw-material-row" + (!available ? " is-unavailable" : "")} key={material.id}>

          <MaterialIcon type={material.type} size={15} />
          <button className="tw-material-open" type="button" disabled={!available} onClick={() => openMaterial(material)}><strong>{material.title}</strong><small>{available ? material.description || typeLabels[material.type] || "任务材料" : material.disabledReason || "完成前置操作后可用"}</small></button>
          <div className="tw-material-actions">{available && state.activeId && !onCanvas && state.activeId !== material.id && isMainTask && <button type="button" aria-label={`将${material.title}与当前内容并排查看`} title="与当前内容并排" onClick={() => openMaterial(material, true)}><IconLayoutColumns size={14} /></button>}<button type="button" disabled={!available} aria-label={`打开${material.title}`} title="单独打开" onClick={() => openMaterial(material)}><IconArrowRight size={14} /></button></div>
        </div>;
      })}</div>
      {isMainTask && <div className="tw-picker-footer"><span>{pickerMaterials.length ? "打开后自动归入当前任务，无需另行保存" : "所有可用内容都已收进任务总览"}</span><button type="button" onClick={() => openCanvas()}>查看内容总览<IconArrowRight size={13} /></button></div>}
    </div>}
  </section>;
}

export default TaskWorkspace;
