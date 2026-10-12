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
export function TaskWorkspace({ taskId, workspace, isMainTask, materials = [], contentItems = [], onOpen, onClose, onOpenCanvas, onArrange, renderContent, renderCanvas }) {
  const { state, actions } = workspace;
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPurpose, setPickerPurpose] = useState("new");
  const activeTabRef = useRef(null);
  const toolsRef = useRef(null);
  const pickerRef = useRef(null);
  const taskViews = useRef(new Map());
  const tabs = state.tabs || [];
  const activeTab = tabs.find((tab) => tab.id === state.activeId);
  const onCanvas = state.activeId === "canvas";
  const unreadTabs = tabs.filter((tab) => tab.unread && tab.id !== state.activeId);
  const displayTabs = tabs.filter(tab => tab.id === state.activeId || tab.id === state.splitId);
  const knownIds = new Set(contentItems.map(item => item.id));
  const pickerMaterials = pickerPurpose === "split" || !isMainTask ? materials : materials.filter(item => !knownIds.has(item.id) && !item.id.startsWith("record:"));
  const activeHistory = contentItems.find(item => item.id === state.activeId)?.children || [];
  const activeMaterial = materials.find((material) => material.id === state.activeId);
  taskViews.current.set(taskId, { state, isMainTask, visited: normalizeVisited(state) });

  useEffect(() => { activeTabRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [taskId, state.activeId]);
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
  const arrange = (ids) => {
    if (!ids.length) return;
    onArrange?.(ids);
    setPickerOpen(false);
    setMenuOpen(false);
  };
  const showPicker = (purpose = "new") => { setPickerPurpose(purpose); setMenuOpen(false); setPickerOpen(true); };
  const openCanvas = (mode = "overview") => { setMenuOpen(false); setPickerOpen(false); onOpenCanvas?.({ mode }); };

  return <section className="task-workspace" aria-label="任务内容工作区">
    <header className="tw-header">
      <div className="tw-heading"><IconLayoutColumns size={16} /><h2>工作区</h2><span>{onCanvas ? state.canvasMode === "free" ? "自由摆放" : "按问题查看全部内容" : state.splitId ? "并排查看" : "查看与操作任务内容"}</span></div>
      <div className="tw-header-actions">
        {isMainTask && <button className={"tw-overview-button" + (onCanvas ? " is-selected" : "")} type="button" onClick={() => openCanvas()}><IconLayoutBoard size={14} />内容总览 <span>{contentItems.length}</span>{unreadTabs.length > 0 && <i aria-label={`${unreadTabs.length}项内容有更新`} />}</button>}
        <div className="tw-tools" ref={toolsRef}>
          <button className={"tw-tool-button" + (menuOpen ? " is-open" : "")} type="button" aria-label="工作区工具" aria-expanded={menuOpen} onClick={() => { setMenuOpen((current) => !current); setPickerOpen(false); }}><IconPlus size={14} /><IconChevronDown size={12} /></button>
          {menuOpen && <div className="tw-tools-menu">
            <button type="button" onClick={() => showPicker()}><IconPlus size={15} /><span>新增内容</span></button>
            {isMainTask && <button type="button" onClick={() => openCanvas("free")}><IconLayoutBoard size={15} /><span>自由摆放</span></button>}
          </div>}
        </div>
      </div>
    </header>

    <div className="tw-tabs" hidden={onCanvas} role="tablist" aria-label="已打开的任务内容">
      {displayTabs.map((tab) => <div className={"tw-tab" + (tab.id === state.activeId ? " is-active" : "") + (tab.id === state.splitId ? " is-split" : "")} key={tab.id}>
        <button className="tw-tab-select" ref={tab.id === state.activeId ? activeTabRef : null} type="button" role="tab" aria-selected={tab.id === state.activeId || tab.id === state.splitId} aria-controls={`workspace-pane-${taskId}-${tab.id}`} onClick={() => actions.activate(tab.id)}><MaterialIcon type={tab.type || (tab.id === "canvas" ? "canvas" : "preview")} /><span>{tab.title}</span>{tab.unread && tab.id !== state.activeId && <i className="tw-unread-dot" aria-label="有未读更新" />}</button>
        <button className="tw-tab-close" type="button" aria-label={`收起${tab.title}`} title={tab.id === "canvas" ? "收起总览，保留材料与布局" : "收起为概要，内容与现场保留"} onClick={() => (onClose || actions.close)(tab.id)}><IconX size={12} /></button>
      </div>)}
      <button className="tw-add-content" type="button" aria-label="新增任务内容" title="新增任务内容" onClick={() => showPicker()}><IconPlus size={14} /></button>
    </div>

    {activeTab && !onCanvas && <div className="tw-view-toolbar">
      <span className="tw-view-kind">{typeLabels[activeTab.type] || "任务内容"}{activeMaterial?.description && <small>{activeMaterial.description}</small>}</span>
      <div>{activeHistory.length > 0 && <details className="tw-history-menu"><summary>历史记录 {activeHistory.length}</summary><div>{[...activeHistory].reverse().map(item => <button type="button" key={item.id} onClick={() => onOpen?.(item.id, { restore: true, title: item.title })}><strong>{item.title}</strong><small>{item.time} · {item.summary}</small></button>)}</div></details>}{isMainTask && <button type="button" onClick={() => onOpenCanvas?.({ mode: state.canvasMode })}><IconLayoutBoard size={13} />返回总览</button>}{state.splitId ? <button type="button" onClick={() => actions.endSplit()}><IconLayoutColumns size={13} />退出并排</button> : isMainTask && <button type="button" onClick={() => showPicker("split")}><IconLayoutColumns size={13} />并排查看</button>}{isMainTask && <button type="button" onClick={() => arrange([state.activeId, ...(state.splitId ? [state.splitId] : [])])}><IconLayoutBoard size={13} />在画布中整理</button>}</div>
    </div>}

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
            const showing = selectedTask && (primary || secondary);
            return <section className={"tw-pane" + (primary ? " is-primary" : "") + (secondary ? " is-secondary" : "")} key={tab.id} id={`workspace-pane-${ownerTaskId}-${tab.id}`} role="tabpanel" aria-label={tab.title} hidden={!showing}>
              {current.splitId && <div className="tw-pane-label"><MaterialIcon type={tab.type} /><span>{tab.title}</span>{secondary && <button type="button" aria-label="关闭并排查看" onClick={() => actions.endSplit()}><IconX size={12} /></button>}</div>}
              <div className="tw-pane-content">{renderContent?.(tab.id, ownerTaskId)}</div>
            </section>;
          })}
          {canvasVisited && view.isMainTask && <div className="tw-canvas-view" id={`workspace-pane-${ownerTaskId}-canvas`} role="tabpanel" aria-label="任务画布" hidden={!selectedTask || !currentCanvas}>{renderCanvas?.(selectedTask && currentCanvas, ownerTaskId)}</div>}
          {selectedTask && !current.activeId && <div className="tw-empty"><IconFileDescription size={24} /><strong>打开需要查看的内容</strong><p>代码、结果和参考资料会在这里展开。</p>{isMainTask && <button type="button" onClick={() => openCanvas()}><IconLayoutBoard size={14} />查看已有内容</button>}<button type="button" onClick={() => showPicker()}><IconPlus size={14} />新增内容</button></div>}
        </div>;
      })}
    </div>

    {pickerOpen && <div className="tw-material-picker" ref={pickerRef} aria-label="任务材料">
      <div className="tw-picker-header"><div><strong>{pickerPurpose === "split" ? "选择并排内容" : "新增任务内容"}</strong><span>{pickerPurpose === "split" ? "保留当前内容，打开一份参考" : "已使用的内容自动保留在总览中"}</span></div><button type="button" aria-label="关闭材料列表" onClick={() => setPickerOpen(false)}><IconX size={15} /></button></div>
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
