import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconCode,
  IconDots,
  IconFileDescription,
  IconGitCompare,
  IconLayoutBoard,
  IconLayoutColumns,
  IconInfoCircle,
  IconPlus,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import "./task-workspace.css";
import { ContentObjectInfo } from "./ContentObjectInfo";
import { ContentSurface } from "./ContentToolbar";
import { buildContentNavigation } from "./task-content-catalog";

const typeLabels = { code: "代码", source: "只读代码", preview: "预览", browser: "浏览器", diff: "Diff", canvas: "画布", result: "结果", record: "记录", brief: "任务简报" };

function MaterialIcon({ type, size = 14 }) {
  const Icon = type === "canvas" ? IconLayoutBoard : type === "code" || type === "source" ? IconCode : type === "browser" ? IconWorld : type === "diff" ? IconGitCompare : IconFileDescription;
  return <Icon size={size} />;
}


function workspacePaneId(ownerId, contentId) {
  return `workspace-pane-${encodeURIComponent(ownerId)}-${encodeURIComponent(contentId)}`;
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
  return <ContentSurface scrollerRef={scroller} onScroll={event => workspace.actions.savePosition(contentId, event.currentTarget.scrollTop, ownerId)}>{children}</ContentSurface>;
}

/** Ordinary viewers stay mounted while the task canvas is opened or closed. */
export function TaskWorkspace({ taskId, workspace, isMainTask, materials = [], contentItems = [], onOpen, onClose, onOpenCanvas, onArrange, onReturnFocus, onCollapse, renderContent, renderCanvas, contentWidth = 1000, onCompare }) {
  const { state, actions } = workspace;
  const [menuOpen, setMenuOpen] = useState(false);
  const [objectInfoOpen, setObjectInfoOpen] = useState(false);
  const objectInfoTrigger = useRef(null);
  const [contentMenuOpen, setContentMenuOpen] = useState(false);
  const contentMenuId = useId();
  const contentSwitchRef = useRef(null);
  const contentMenuRef = useRef(null);
  const contentTriggerRef = useRef(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPurpose, setPickerPurpose] = useState("new");
  const toolsRef = useRef(null);
  const pickerRef = useRef(null);
  const taskViews = useRef(new Map());
  const tabs = state.tabs || [];
  const compactCompare = contentWidth <= 620;
  const focusedId = state.splitId && [state.activeId, state.splitId].includes(state.comparisonFocusId) ? state.comparisonFocusId : state.activeId;
  const activeTab = tabs.find((tab) => tab.id === focusedId);
  const parentItem = contentItems.find(item => item.id === focusedId || item.children?.some(child => child.id === focusedId));
  const historyItem = parentItem?.children?.find(child => child.id === focusedId);
  const savedEntry = id => contentItems.flatMap(item => item.children || []).find(item => item.id === id);
  const contentTitle = id => { const record = savedEntry(id); return record ? `${record.title} · ${record.time || "历史"}` : tabs.find(tab => tab.id === id)?.title || "内容"; };
  const onCanvas = state.activeId === "canvas";
  const canReturn = Boolean(state.returnPoint?.activeId || state.lastContentId);
  const unreadTabs = normalizeVisited(state).filter(tab => tab.unread);
  const knownIds = new Set(contentItems.map(item => item.id));
  const pickerMaterials = pickerPurpose === "split" || !isMainTask ? materials : materials.filter(item => !knownIds.has(item.id) && !item.id.startsWith("record:"));
  const activeHistory = [...(parentItem?.children || []), ...(parentItem?.relatedHistory || [])];
  const switchItems = [...new Map([
    ...contentItems.filter(item => item.id !== "canvas").map(item => ({ ...item, ...materials.find(material => material.id === item.id) })),
    ...tabs.filter(item => item.id !== "canvas" && (item.id === state.activeId || item.id === state.referenceId)),
  ].map(item => [item.id, { ...materials.find(material => material.id === item.id), ...item }])).values()];
  const navigationTabs = tabs.filter(item => !/^(record:|snapshot:|attempt:)/.test(item.id) || item.id === state.activeId || item.id === state.splitId);
  const groupedItems = buildContentNavigation({ taskId, materials: switchItems, contentItems, tabs: navigationTabs, visitedTabs: state.visitedTabs, groupNames: state.overview?.groupNames, itemOverrides: state.overview?.itemOverrides });
  taskViews.current.set(taskId, { state, isMainTask, visited: normalizeVisited(state), contentItems });

  useEffect(() => { setMenuOpen(false); setPickerOpen(false); setContentMenuOpen(false); setObjectInfoOpen(false); }, [taskId]);
  useEffect(() => {
    if (!menuOpen && !pickerOpen && !contentMenuOpen && !objectInfoOpen) return undefined;
    const outsideClick = (event) => {
      if (toolsRef.current?.contains(event.target) || pickerRef.current?.contains(event.target) || contentSwitchRef.current?.contains(event.target) || event.target.closest?.(".tw-object-sheet") || objectInfoTrigger.current?.contains(event.target)) return;
      setMenuOpen(false);
      setPickerOpen(false);
      setContentMenuOpen(false);
      setObjectInfoOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false); setPickerOpen(false); setContentMenuOpen(false); setObjectInfoOpen(false);
        if (objectInfoOpen) objectInfoTrigger.current?.focus({ preventScroll: true });
        if (contentMenuOpen) contentTriggerRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", outsideClick);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outsideClick); document.removeEventListener("keydown", escape); };
  }, [menuOpen, pickerOpen, contentMenuOpen, objectInfoOpen]);
  useLayoutEffect(() => {
    if (!contentMenuOpen) return;
    const menu = contentMenuRef.current;
    const current = menu?.querySelector('[aria-checked="true"]:not(:disabled)');
    focusContentOption(current || menu?.querySelector("button:not(:disabled)"));
  }, [contentMenuOpen]);

  useEffect(() => {
    for (const [ownerId] of taskViews.current) {
      const current = workspace.getTaskState(ownerId);
      const selected = ownerId === taskId && !current.collapsed && current.activeId !== "canvas";
      actions.setVisibleContent(ownerId, !selected ? [] : [current.activeId, current.splitId].filter(Boolean));
    }
  });
  const restoreObject = id => { setObjectInfoOpen(false); const record = activeHistory.find(child => child.id === id); onOpen?.(id, { restore: true, ...(record ? { title: record.title, type: "preview" } : {}) }); };
  const compareObject = id => { setObjectInfoOpen(false); onCompare?.(id); };
  const closeInfo = () => { setObjectInfoOpen(false); objectInfoTrigger.current?.focus({ preventScroll: true }); };

  const switchContent = (material) => {
    if (material.available === false) return;
    // Navigation restores an object; it does not generate a proposal or run a check.
    if (state.splitId && !state.comparisonPinned) actions.endSplit();
    if (tabs.some(item => item.id === material.id)) actions.activate(material.id);
    else actions.open(material.id, { restore: true, title: material.title, type: material.type });
    setContentMenuOpen(false);
    setObjectInfoOpen(false);
    contentTriggerRef.current?.focus({ preventScroll: true });
  };
  function focusContentOption(option) {
    option?.focus({ preventScroll: true });
    const list = contentMenuRef.current?.querySelector(".tw-content-groups");
    if (!option || !list?.contains(option)) return;
    const optionBox = option.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    if (optionBox.top < listBox.top) list.scrollTop += optionBox.top - listBox.top;
    else if (optionBox.bottom > listBox.bottom) list.scrollTop += optionBox.bottom - listBox.bottom;
  }
  const navigateContentMenu = (event) => {
    const options = [...(contentMenuRef.current?.querySelectorAll("button:not(:disabled)") || [])];
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const index = options.indexOf(document.activeElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      focusContentOption(options[next]);
    } else if (event.key === "Tab") {
      event.preventDefault();
      setContentMenuOpen(false);
      if (event.shiftKey) contentTriggerRef.current?.focus({ preventScroll: true });
      else contentSwitchRef.current?.closest(".tw-topbar")?.querySelector(".tw-topbar-actions button:not(:disabled)")?.focus({ preventScroll: true });
    }
  };

  const openMaterial = (material, split = false) => {
    if (material.available === false) return;
    onOpen?.(material.id, { restore: true, ...(split || pickerPurpose === "split" ? { split: true, pinned: pickerPurpose === "split" } : {}) });
    setPickerOpen(false);
  };
  const showPicker = (purpose = "new") => { setPickerPurpose(purpose); setMenuOpen(false); setContentMenuOpen(false); setObjectInfoOpen(false); setPickerOpen(true); };
  const openCanvas = (mode = "overview", options = {}) => { setMenuOpen(false); setPickerOpen(false); setContentMenuOpen(false); setObjectInfoOpen(false); onOpenCanvas?.({ mode, ...options }); };
  const inOverview = onCanvas && state.canvasMode === "overview";
  const activeTitle = inOverview ? "全部内容" : historyItem ? `${historyItem.title} · ${historyItem.time || "历史"}` : activeTab?.title || "任务内容";
  const returnToFocus = () => { setMenuOpen(false); setContentMenuOpen(false); onReturnFocus?.(); };

  return <section className={`task-workspace${compactCompare ? " is-compact-comparison" : ""}${inOverview ? " is-overview" : ""}`} aria-label="任务内容工作区">
    <header className="tw-topbar" aria-label="工作区公共标题栏">
      <div className="tw-content-switch" ref={contentSwitchRef}>
        <button className="tw-content-trigger" type="button" ref={contentTriggerRef} aria-label={`切换任务内容：${activeTitle}`} aria-haspopup="menu" aria-expanded={contentMenuOpen} aria-controls={contentMenuId} title="切换任务内容" onClick={() => { setContentMenuOpen(current => !current); setMenuOpen(false); setPickerOpen(false); setObjectInfoOpen(false); }} onKeyDown={event => { if (["ArrowDown", "ArrowUp"].includes(event.key)) { event.preventDefault(); setContentMenuOpen(true); setMenuOpen(false); setPickerOpen(false); } }}>
          <MaterialIcon type={onCanvas ? "canvas" : activeTab?.type} /><span>{activeTitle}</span>{unreadTabs.length > 0 && <span className="tw-unread-count" aria-label={`${unreadTabs.length}项内容有未读更新`}>{unreadTabs.length}</span>}<IconChevronDown size={13} />
        </button>
        {contentMenuOpen && <div className="tw-content-menu" id={contentMenuId} role="menu" aria-label="切换任务内容" ref={contentMenuRef} onKeyDown={navigateContentMenu}>
          <div className="tw-content-groups">{groupedItems.map(group => <section className="tw-content-group" key={group.id} role="group" aria-label={group.label}>
            <h3>{group.label}</h3>
            {group.items.map(material => {
              const current = material.id === focusedId;
              const reference = material.id === state.referenceId && !current;
              const visited = state.visitedTabs?.find(item => item.id === material.id);
              const saved = /^(snapshot:|record:|attempt:)/.test(material.id);
              const displayedTitle = saved ? contentTitle(material.id) : material.title;
              return <button className={"tw-content-option" + (current ? " is-current" : "") + (reference ? " is-reference" : "") + (material.available === false ? " is-unavailable" : "")} key={material.id} type="button" role="menuitemradio" aria-checked={current} aria-label={displayedTitle} disabled={material.available === false} tabIndex={-1} onClick={() => switchContent(material)}>
                <MaterialIcon type={material.type} /><span className="tw-option-copy"><strong>{displayedTitle}</strong>{material.available === false ? <small>{material.disabledReason || "完成前置操作后可用"}</small> : saved ? <small>只读历史</small> : null}</span><small className="tw-option-kind">{material.kindLabel || typeLabels[material.type] || "内容"}</small>
                {current ? <IconCheck size={13} aria-label="当前内容" /> : reference ? <small className="tw-option-state">参考</small> : visited?.closed ? <small className="tw-option-state">已收起</small> : visited?.unread ? <small className="tw-option-state">有更新</small> : null}
              </button>;
            })}
          </section>)}</div>
          <div className="tw-content-menu-foot"><button type="button" role="menuitem" tabIndex={-1} onClick={() => showPicker()}><IconPlus size={14} />打开其他内容</button>{isMainTask && <button type="button" role="menuitem" tabIndex={-1} onClick={() => openCanvas("overview")}><IconLayoutBoard size={14} />全部内容 · {contentItems.length}<IconArrowRight size={13} /></button>}</div>
        </div>}
      </div>
      <div className="tw-topbar-actions">
        {!onCanvas && <button type="button" ref={objectInfoTrigger} className={"tw-object-info-button" + (objectInfoOpen ? " is-open" : "")} aria-label="来源、关联与历史" title="来源、关联与历史" aria-expanded={objectInfoOpen} onClick={() => { setObjectInfoOpen(current => !current); setMenuOpen(false); setPickerOpen(false); setContentMenuOpen(false); }}><IconInfoCircle size={15} />{activeHistory.length > 0 && <small>{activeHistory.length}</small>}</button>}
        {state.referenceId === state.activeId && state.referenceReturnId && <button className="tw-nearby-action" type="button" onClick={actions.returnFromReference}>返回当前内容</button>}
        {isMainTask && <button className="tw-view-all" type="button" disabled={inOverview && !canReturn} aria-label={inOverview ? "回到刚才查看的内容" : "看全部任务内容"} onClick={() => inOverview ? returnToFocus() : openCanvas("overview")}>{inOverview ? <><IconArrowRight className="tw-return-arrow" size={13} />返回正文</> : <><IconLayoutBoard size={13} />全部内容</>}</button>}
        <div className="tw-tools" ref={toolsRef}>
          <button className={"tw-more-button" + (menuOpen ? " is-open" : "")} type="button" aria-label="更多任务内容操作" title="更多" aria-expanded={menuOpen} onClick={() => { setMenuOpen((current) => !current); setPickerOpen(false); setContentMenuOpen(false); setObjectInfoOpen(false); }}><IconDots size={17} /></button>
          {menuOpen && <div className="tw-tools-menu">
            {state.referenceId && <button type="button" onClick={() => { actions.endSplit(); setMenuOpen(false); }}><IconX size={15} /><span>收起固定参考</span></button>}
            {!onCanvas && <button type="button" onClick={() => { setMenuOpen(false); setObjectInfoOpen(true); }}><IconInfoCircle size={15} /><span>来源、关联与历史{activeHistory.length ? ` · ${activeHistory.length}` : ""}</span></button>}
            {state.activeId && !onCanvas && <button type="button" onClick={() => { (onClose || actions.close)(focusedId); setMenuOpen(false); }}><IconX size={15} /><span>收起当前内容为概要</span></button>}
            {state.activeId && !onCanvas && isMainTask && !state.splitId && <button type="button" onClick={() => showPicker("split")}><IconLayoutColumns size={15} /><span>留一份参考</span></button>}
            <button type="button" onClick={() => showPicker()}><IconPlus size={15} /><span>打开其他内容</span></button>
            {isMainTask && <button type="button" onClick={() => openCanvas("free")}><IconLayoutBoard size={15} /><span>手动整理内容</span></button>}
          </div>}
        </div>
        <button className="tw-collapse" type="button" aria-label="收起任务内容工作区" title="收起任务内容工作区" onClick={() => onCollapse?.()}><IconX size={14} /></button>
      </div>
    </header>

    {state.splitId && !onCanvas && <div className="tw-comparison-bar" aria-label="内容对照">
      <div className="tw-comparison-items">{[state.activeId, state.splitId].map((id, index) => <button type="button" key={id} className={focusedId === id ? "is-selected" : ""} aria-pressed={focusedId === id} onClick={() => actions.focusComparison(id)} title={contentTitle(id)}><small>{index === 0 ? "当前" : state.comparisonPinned ? "参考" : "对照"}</small><span>{contentTitle(id)}</span></button>)}</div>
      <button className="tw-end-comparison" type="button" onClick={actions.endSplit}>{state.comparisonPinned ? "移除参考" : "结束对照"}</button>
    </div>}
    {historyItem && !onCanvas && <div className="tw-history-context"><span>只读历史 · {historyItem.time || "当时保存"}</span><button type="button" onClick={() => restoreObject(parentItem.id)}>回到当前内容<IconArrowRight size={12} /></button></div>}
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
            return <section className={"tw-pane" + (primary ? " is-primary" : "") + (secondary ? " is-secondary" : "")} key={tab.id} id={workspacePaneId(ownerTaskId, tab.id)} role="region" aria-label={tab.title} hidden={!showing}>

              <SavedContent workspace={workspace} ownerId={ownerTaskId} contentId={tab.id} showing={showing}>{renderContent?.(tab.id, ownerTaskId)}</SavedContent>
            </section>;
          })}
          {canvasVisited && view.isMainTask && <div className="tw-canvas-view" id={workspacePaneId(ownerTaskId, "canvas")} role="region" aria-label={current.canvasMode === "free" ? "手动整理任务内容" : "全部任务内容"} hidden={!selectedTask || !currentCanvas}>{renderCanvas?.(selectedTask && !current.collapsed && currentCanvas, ownerTaskId)}</div>}
          {selectedTask && !current.activeId && <div className="tw-empty"><IconFileDescription size={24} /><strong>打开需要查看的内容</strong><p>代码、结果和参考资料会在这里展开。</p>{isMainTask && <button type="button" onClick={() => openCanvas()}><IconLayoutBoard size={14} />查看已有内容</button>}<button type="button" onClick={() => showPicker()}><IconPlus size={14} />新增内容</button></div>}
        </div>;
      })}
    </div>

    {objectInfoOpen && !onCanvas && <ContentObjectInfo item={parentItem || activeTab} history={historyItem} selectedId={focusedId} onClose={closeInfo} onOpen={restoreObject} onCompare={onCompare ? compareObject : undefined} />}

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
