import { useEffect, useRef, useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconCode,
  IconFileDescription,
  IconGitCompare,
  IconLayoutBoard,
  IconLayoutColumns,
  IconLayoutList,
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

/** Ordinary viewers stay mounted while the task canvas is opened or closed. */
export function TaskWorkspace({ taskId, workspace, isMainTask, materials = [], onOpen, onOpenCanvas, onArrange, renderContent, renderCanvas }) {
  const { state, actions } = workspace;
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const activeTabRef = useRef(null);
  const toolsRef = useRef(null);
  const pickerRef = useRef(null);
  const taskViews = useRef(new Map());
  const tabs = state.tabs || [];
  const activeTab = tabs.find((tab) => tab.id === state.activeId);
  const onCanvas = state.activeId === "canvas";
  const unreadTabs = tabs.filter((tab) => tab.unread && tab.id !== state.activeId);
  const activeMaterial = materials.find((material) => material.id === state.activeId);
  taskViews.current.set(taskId, { state, isMainTask, visited: normalizeVisited(state) });

  useEffect(() => { activeTabRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [taskId, state.activeId]);
  useEffect(() => { setMenuOpen(false); setPickerOpen(false); setSelectedIds([]); }, [taskId]);
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
    onOpen?.(material.id, split ? { split: true } : {});
    setPickerOpen(false);
  };
  const arrange = (ids) => {
    if (!ids.length) return;
    onArrange?.(ids);
    setPickerOpen(false);
    setMenuOpen(false);
    setSelectedIds([]);
  };
  const showPicker = () => { setMenuOpen(false); setPickerOpen(true); };
  const openCanvas = () => { setMenuOpen(false); setPickerOpen(false); onOpenCanvas?.(); };
  const toggleSelected = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);

  return <section className="task-workspace" aria-label="任务内容工作区">
    <header className="tw-header">
      <div className="tw-heading"><IconLayoutColumns size={16} /><h2>工作区</h2><span>{onCanvas ? "整理关联材料" : state.splitId ? "并排查看" : "查看与操作任务内容"}</span></div>
      <div className="tw-header-actions">
        {unreadTabs.length > 0 && <button className="tw-new-results" type="button" onClick={() => actions.activate(unreadTabs[0].id)}><span aria-hidden="true" />新结果 {unreadTabs.length}</button>}
        <div className="tw-tools" ref={toolsRef}>
          <button className={"tw-tool-button" + (menuOpen ? " is-open" : "")} type="button" aria-label="工作区工具" aria-expanded={menuOpen} onClick={() => { setMenuOpen((current) => !current); setPickerOpen(false); }}><IconPlus size={14} /><IconChevronDown size={12} /></button>
          {menuOpen && <div className="tw-tools-menu">
            <button type="button" onClick={showPicker}><IconLayoutList size={15} /><span>打开材料</span></button>
            {isMainTask && <button type="button" onClick={openCanvas}><IconLayoutBoard size={15} /><span>打开画布</span>{normalizeVisited(state).some((tab) => tab.id === "canvas") && <small>恢复</small>}</button>}
          </div>}
        </div>
      </div>
    </header>

    <div className="tw-tabs" role="tablist" aria-label="已打开的任务内容">
      {tabs.map((tab) => <div className={"tw-tab" + (tab.id === state.activeId ? " is-active" : "") + (tab.id === state.splitId ? " is-split" : "")} key={tab.id}>
        <button className="tw-tab-select" ref={tab.id === state.activeId ? activeTabRef : null} type="button" role="tab" aria-selected={tab.id === state.activeId || tab.id === state.splitId} aria-controls={`workspace-pane-${taskId}-${tab.id}`} onClick={() => actions.activate(tab.id)}><MaterialIcon type={tab.type || (tab.id === "canvas" ? "canvas" : "preview")} /><span>{tab.title}</span>{tab.unread && tab.id !== state.activeId && <i className="tw-unread-dot" aria-label="有未读更新" />}</button>
        <button className="tw-tab-close" type="button" aria-label={`关闭${tab.title}`} title={tab.id === "canvas" ? "关闭画布，保留材料与布局" : "关闭视图，保留内容"} onClick={() => actions.close(tab.id)}><IconX size={12} /></button>
      </div>)}
      <button className="tw-add-content" type="button" aria-label="打开其他材料" title="打开其他材料" onClick={showPicker}><IconPlus size={14} /></button>
    </div>

    {activeTab && !onCanvas && <div className="tw-view-toolbar">
      <span className="tw-view-kind">{typeLabels[activeTab.type] || "任务内容"}{activeMaterial?.description && <small>{activeMaterial.description}</small>}</span>
      <div>{isMainTask && tabs.some(tab => tab.id === "canvas") && <button type="button" onClick={onOpenCanvas}><IconLayoutBoard size={13} />返回画布</button>}{state.splitId ? <button type="button" onClick={() => actions.endSplit()}><IconLayoutColumns size={13} />退出并排</button> : isMainTask && <button type="button" onClick={showPicker}><IconLayoutColumns size={13} />并排查看</button>}{isMainTask && <button type="button" onClick={() => arrange([state.activeId, ...(state.splitId ? [state.splitId] : [])])}><IconLayoutBoard size={13} />在画布中整理</button>}</div>
    </div>}

    <div className="tw-stage">
      {[...taskViews.current.entries()].map(([ownerTaskId, view]) => {
        const selectedTask = ownerTaskId === taskId;
        const current = view.state;
        const currentCanvas = current.activeId === "canvas";
        const diagramSplit = current.splitId && [current.activeId, current.splitId].some(id => id === "explanation" || id.startsWith("image-"));
        const canvasVisited = view.visited.some((tab) => tab.id === "canvas");
        return <div className={"tw-task-body" + (current.splitId && !currentCanvas ? " has-split" : "") + (diagramSplit ? " is-diagram-split" : "")} key={ownerTaskId} hidden={!selectedTask}>
          {view.visited.filter((tab) => tab.id !== "canvas").map((tab) => {
            const primary = current.activeId === tab.id && !currentCanvas;
            const secondary = current.splitId === tab.id && !currentCanvas;
            const showing = selectedTask && (primary || secondary);
            return <section className={"tw-pane" + (primary ? " is-primary" : "") + (secondary ? " is-secondary" : "")} key={tab.id} id={`workspace-pane-${ownerTaskId}-${tab.id}`} role="tabpanel" aria-label={tab.title} hidden={!showing}>
              {current.splitId && <div className="tw-pane-label"><MaterialIcon type={tab.type} /><span>{tab.title}</span>{secondary && <button type="button" aria-label="关闭并排查看" onClick={() => actions.endSplit()}><IconX size={12} /></button>}</div>}
              <div className="tw-pane-content">{renderContent?.(tab.id, ownerTaskId)}</div>
            </section>;
          })}
          {canvasVisited && view.isMainTask && <div className="tw-canvas-view" id={`workspace-pane-${ownerTaskId}-canvas`} role="tabpanel" aria-label="任务画布" hidden={!selectedTask || !currentCanvas}>{renderCanvas?.(selectedTask && currentCanvas, ownerTaskId)}</div>}
          {selectedTask && !current.activeId && <div className="tw-empty"><IconFileDescription size={24} /><strong>打开需要查看的内容</strong><p>代码、结果和参考资料会在这里展开。</p><button type="button" onClick={showPicker}><IconLayoutList size={14} />打开材料</button></div>}
        </div>;
      })}
    </div>

    {pickerOpen && <div className="tw-material-picker" ref={pickerRef} aria-label="任务材料">
      <div className="tw-picker-header"><div><strong>本任务材料</strong><span>{isMainTask ? "单独查看，或选择关联材料整理" : "查看当前任务的内容"}</span></div><button type="button" aria-label="关闭材料列表" onClick={() => setPickerOpen(false)}><IconX size={15} /></button></div>
      <div className="tw-material-list">{materials.map((material) => {
        const available = material.available !== false;
        return <div className={"tw-material-row" + (!available ? " is-unavailable" : "")} key={material.id}>
          {isMainTask && <label className="tw-material-check"><input type="checkbox" checked={selectedIds.includes(material.id)} disabled={!available} aria-label={`选择${material.title}`} onChange={() => toggleSelected(material.id)} /><span><IconCheck size={11} /></span></label>}
          <MaterialIcon type={material.type} size={15} />
          <button className="tw-material-open" type="button" disabled={!available} onClick={() => openMaterial(material)}><strong>{material.title}</strong><small>{available ? material.description || typeLabels[material.type] || "任务材料" : material.disabledReason || "完成前置操作后可用"}</small></button>
          <div className="tw-material-actions">{available && state.activeId && !onCanvas && state.activeId !== material.id && isMainTask && <button type="button" aria-label={`将${material.title}与当前内容并排查看`} title="与当前内容并排" onClick={() => openMaterial(material, true)}><IconLayoutColumns size={14} /></button>}<button type="button" disabled={!available} aria-label={`打开${material.title}`} title="单独打开" onClick={() => openMaterial(material)}><IconArrowRight size={14} /></button></div>
        </div>;
      })}</div>
      {isMainTask && <div className="tw-picker-footer"><span>{selectedIds.length ? `已选择 ${selectedIds.length} 份材料` : "选择要一起整理的材料"}</span><button type="button" disabled={!selectedIds.length} onClick={() => arrange(selectedIds)}><IconLayoutBoard size={14} />在画布中整理</button></div>}
    </div>}
  </section>;
}

export default TaskWorkspace;
