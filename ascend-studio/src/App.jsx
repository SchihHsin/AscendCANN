import { useEffect, useRef, useState } from "react";
import { useWorkbenchState, MAIN_TASK } from "./useWorkbenchState";
import { capabilities, modelOptions } from "./prototype-data";
import { WorkbenchDialogs } from "./WorkbenchDialogs";
import { ActionWorkspace } from "./ActionWorkspace";
import { useTaskFlow } from "./useTaskFlow";
import { useExplanationSession } from "./useExplanationSession";
import { useCanvasState } from "./useCanvasState";
import { useContentWorkspace } from "./useContentWorkspace";
import { MATERIAL_DEFINITIONS, getMaterialMeta } from "./workspace-materials";
import { TaskWorkspace } from "./TaskWorkspace";
import { ReferenceBrowser } from "./ReferenceBrowser";
import { useWorkbenchLayout } from "./useWorkbenchLayout";
import { TaskCanvas } from "./TaskCanvas";
import { CanvasMaterial } from "./CanvasMaterials";
import { CanvasIndex } from "./CanvasIndex";
import { IMAGE_TASK, IMAGE_MATERIALS, useImageInference } from "./useImageInference";
import { ImageInferenceMaterial } from "./ImageInference";
import "./interaction.css";
import "./visual-focus.css";
import {
  IconAdjustmentsHorizontal,
  IconAlertTriangle,
  IconArrowRight,
  IconBell,
  IconBook,
  IconBooks,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconCode,
  IconCopy,
  IconDatabase,
  IconDots,
  IconFileText,
  IconFolder,
  IconLibrary,
  IconLock,
  IconMessageCircle,
  IconPaperclip,
  IconPhoto,
  IconPlayerPlay,
  IconPlus,
  IconSearch,
  IconSend,
  IconSettingsAutomation,
  IconThumbDown,
  IconThumbUp,
  IconBulb,
  IconX,
} from "@tabler/icons-react";

const routes = [
  {
    id: "tail",
    title: "核对尾块索引范围",
    sub: "只读检查 · 暂不修改代码",
    reason: "依据：仅非整块输入失败",
  },
  {
    id: "precision",
    title: "检查误差分布",
    sub: "还需逐元素精度证据",
    reason: "用于判断精度误差是否集中在特定位置",
  },
  {
    id: "retry",
    title: "更换 AI 重试",
    sub: "不会增加新的诊断证据",
    reason: "建议先保留当前错误与已尝试动作",
  },
];

function ProjectSection({ group, opened, query, selectedTask, onToggle, onSelect }) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchesProject = normalizedQuery && group.name.toLowerCase().includes(normalizedQuery);
  const filteredTasks = matchesProject
    ? group.tasks
    : group.tasks.filter((task) => task.toLowerCase().includes(normalizedQuery));
  if (normalizedQuery && filteredTasks.length === 0) return null;
  return (
    <section className="project-section">
      <button
        className="project-heading"
        type="button"
        aria-expanded={opened}
        aria-controls={"project-" + group.id}
        onClick={onToggle}
      >
        {opened ? <IconChevronDown size={15} /> : <IconChevronRight size={15} />}
        <IconFolder className="project-folder" size={18} />
        <span className="project-name">{group.name}</span>
        <span className="project-count">{group.tasks.length}</span>
      </button>
      {opened && (
        <div className="project-tasks" id={"project-" + group.id}>
          {filteredTasks.map((task) => (
            <button
              className={"task-row" + (selectedTask === task ? " is-selected" : "")}
              type="button"
              aria-current={selectedTask === task ? "page" : undefined}
              key={task}
              onClick={() => onSelect(task)}
            >
              <IconFileText className="task-file" size={17} />
              <span>{task}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function App() {
  const wb = useWorkbenchState();
  const flow = useTaskFlow({ onRecord: (title, summary, kind, isDemo) => wb.addRecord({ title, summary, kind, isDemo }, MAIN_TASK) });
  const canvas = useCanvasState({ startEmpty: true });
  const imageCanvas = useCanvasState({ startEmpty: true, cardDefinitions: IMAGE_MATERIALS });
  const [precisionContext, setPrecisionContext] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const layout = useWorkbenchLayout({ sidebarCollapsed });
  const previousFlow = useRef({ attempts: 0, proposal: null, applied: null, validation: null });
  const [taskContentsOpen, setTaskContentsOpen] = useState(false);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const {
    query, setQuery, openedGroups, selectedTask, rationaleOpen, setRationaleOpen,
    visibleGroups, toggleGroup, selectTask, setSelectedRoute,
    session, task, currentGroup, isMainTask,
    openDialog, openMenu, sendMessage, setDraft, toast,
  } = wb;
  const { selectedRoute, draft, messages } = session;
  const selectedRouteData = routes.find((route) => route.id === selectedRoute) || routes[0];
  const feedback = (value) => wb.patchSession({ feedback: session.feedback === value ? null : value });
  const closeMenuAnd = (action) => { wb.setMenu(null); action(); };
  const isImageTask = selectedTask === IMAGE_TASK;
  const isInteractiveTask = isMainTask || isImageTask;
  const workspace = useContentWorkspace({ taskId: selectedTask, isMainTask: isInteractiveTask });
  const imageVisible = isImageTask && workspace.state.activeId !== "canvas" && [workspace.state.activeId, workspace.state.splitId].some(id => id === "image-explanation");
  const inference = useImageInference({ visible: imageVisible, onRecord: record => wb.addRecord(record, IMAGE_TASK) });
  const explanationVisible = isMainTask && workspace.state.activeId !== "canvas" && (workspace.state.activeId === "explanation" || workspace.state.splitId === "explanation");
  const explanation = useExplanationSession({ resetVersion: flow.state.resetVersion, visible: explanationVisible });
  const mainSession = wb.getSession(MAIN_TASK);
  const imageSession = wb.getSession(IMAGE_TASK);
  const imageAttachment = [...imageSession.messages.flatMap(item => item.attachments || []), ...imageSession.attachments].filter(file => file.content && (file.type === "code" || /\.py$/i.test(file.name))).sort((a, b) => (a.receivedOrder || 0) - (b.receivedOrder || 0)).at(-1);
  const mainAttachment = [...mainSession.messages.flatMap(item => item.attachments || []), ...mainSession.attachments]
    .filter(file => file.content && (file.type === "code" || /\.(cpp|h|py)$/i.test(file.name)))
    .sort((a, b) => (a.receivedOrder || 0) - (b.receivedOrder || 0)).at(-1);
  const openContent = (id, options = {}) => {
    if (!isInteractiveTask && id !== "task-brief") return;
    if (isImageTask && !id.startsWith("image-") && !id.startsWith("record:") && id !== "canvas") return;
    if (options.close) workspace.actions.close(options.close);
    if ((id === "explanation" || id === "source") && options.anchor) explanation.actions.focusConcept(options.anchor);
    if (id === "explanation" && (options.time !== undefined || options.video)) explanation.actions.openAt({ focus: options.anchor || explanation.state.focus, time: options.time, video: options.video });
    if (id === "compare") {
      workspace.actions.open("source");
      workspace.actions.splitWith("draft");
    } else {
      if (id === "diff" && !flow.state.proposedCode) flow.actions.prepareDiff();
      if (options.split) workspace.actions.splitWith(id);
      else workspace.actions.open(id, options);
    }
    setTaskContentsOpen(false);
  };
  const compareExplanation = () => {
    workspace.actions.open("source");
    workspace.actions.splitWith("explanation");
    setTaskContentsOpen(false);
  };
  const askExplanation = (context) => {
    wb.askFromExplanation(context);
  };
  const openCanvas = () => {
    if (!isInteractiveTask) return;
    workspace.actions.openCanvas();
    setTaskContentsOpen(false);
  };
  const arrangeMaterials = (ids) => {
    if (!isInteractiveTask) return;
    const targetCanvas = isImageTask ? imageCanvas : canvas;
    const targetSession = isImageTask ? imageSession : mainSession;
    const uniqueIds = [...new Set(ids)].filter(id => id !== "canvas");
    if (uniqueIds.includes("diff") && !flow.state.proposedCode) flow.actions.prepareDiff();
    uniqueIds.forEach(id => {
      const card = targetCanvas.state.cards.find(item => item.id === id);
      if (card) targetCanvas.actions.showCard(id, { focus: false });
      else {
        const record = targetSession.records.find(item => "record:" + item.id === id);
        targetCanvas.actions.addCard({ ...getMaterialMeta(id, record ? { title: record.title } : {}), width: 440, height: 340 }, { focus: false });
      }
    });
    openCanvas();
    if (uniqueIds.length) requestAnimationFrame(() => targetCanvas.actions.fitCanvas());
  };
  const locateCanvasMaterial = (id) => {
    if (id === "diff" && !flow.state.proposedCode) flow.actions.prepareDiff();
    if (!canvas.state.cards.some(card => card.id === id)) arrangeMaterials([id]);
    else canvas.actions.showCard(id);
    setTaskContentsOpen(false);
  };
  const changeActionView = (view) => {
    if (view === "code" || view === "precision") wb.patchSession({ selectedRoute: view === "code" ? "tail" : "precision" });
    openContent(view === "code" ? "source" : view);
  };
  const openTaskFlow = (phase = "understand") => {
    if (!isMainTask) return;
    if (phase === "try") {
      workspace.actions.open("draft");
      workspace.actions.splitWith("parameters");
    } else openContent({ understand: "explanation", diff: "diff", validate: "validation" }[phase] || "explanation");
  };
  const confirmWorkspaceRoute = () => {
    if (selectedRoute === "retry") wb.confirmRoute();
    else changeActionView(selectedRoute === "tail" ? "code" : "precision");
  };
  const latestAttempt = flow.state.attempts.find(attempt => attempt.id === flow.state.selectedAttemptId) || flow.state.attempts.at(-1);
  const renderBrief = (ownerId) => <div className="diagnostic-scroll">
    <section className="task-brief-section"><div className="section-title"><IconFileText size={18} /><h3>任务简报</h3></div><div className="task-brief-card"><strong>{ownerId}</strong><p>{wb.getTask(ownerId).goal}</p><span>待补充证据</span></div></section>
    <section className="task-brief-section"><div className="section-title"><IconDatabase size={18} /><h3>上下文与材料</h3></div><div className="task-brief-card"><p>补充代码、日志与运行条件后，再确定检查方向。</p><button type="button" className="light-button" onClick={() => openDialog("code")}><IconCode size={15} />补充代码片段</button><button type="button" className="light-button" onClick={() => { setDraft("请帮我整理当前任务的环境条件、需要补充的证据和下一步检查清单。"); wb.draftRef.current?.focus(); }}><IconMessageCircle size={15} />整理检查清单</button></div></section>
    <p className="action-footnote">任务内容仅用于本地交互演示，尚未接入 AI 或硬件服务。</p>
  </div>;
  const renderMaterial = (id, presentation = "canvas", ownerId = MAIN_TASK) => {
    if (id === "task-brief") return renderBrief(ownerId);
    if (ownerId === IMAGE_TASK) {
      if (id.startsWith("record:")) {
        const record = imageSession.records.find(item => "record:" + item.id === id);
        return record ? <article className="canvas-record-detail"><span>{record.time} · 示例记录</span><p>{record.summary}</p></article> : null;
      }
      return <ImageInferenceMaterial key={inference.state.resetVersion} id={id} inference={inference} onOpen={openContent} onAsk={askExplanation} onCopy={wb.copyText} presentation={presentation} codeAttachment={imageAttachment} />;
    }
    if (ownerId !== MAIN_TASK) return null;
    if (id.startsWith("record:")) {
      const record = mainSession.records.find(item => "record:" + item.id === id);
      return record ? <article className="canvas-record-detail"><span>{record.time} · {record.isDemo ? "浏览器示例记录" : "开发者记录 · 待验证"}</span><p>{record.summary}</p></article> : null;
    }
    if (id === "reference") return presentation === "canvas" ? <div className="cm-stack"><p className="cm-body-copy">Ascend C 官方文档</p><p className="cm-note">用于理解概念与使用范围，实际版本与根因仍需核对。</p><button className="cm-button" type="button" onClick={() => openContent("reference")}>打开参考网页<IconArrowRight size={14} /></button></div> : <ReferenceBrowser resetVersion={flow.state.resetVersion} />;
    if (presentation === "canvas" && (id === "precision" || id === "review")) return <div className="cm-stack"><p className="cm-body-copy">{id === "precision" ? "逐元素误差与容差依据" : "检查清单、观察与待补证据"}</p><p className="cm-note">{precisionContext ? `已保留 ${precisionContext.count ?? precisionContext.rows?.length ?? "本次"} 项误差核对依据。` : "尚未保存误差计算。真实项目根因待确认。"}</p><button className="cm-button" type="button" onClick={() => openContent(id)}>展开核对<IconArrowRight size={14} /></button></div>;
    if (id === "precision" || id === "review") return <ActionWorkspace key={flow.state.resetVersion} embedded view={id} onChangeView={changeActionView} onBack={() => openContent("evidence")} onRecord={(record) => wb.addRecord(record, MAIN_TASK)} precisionContext={precisionContext} onPrecisionContext={setPrecisionContext} rangeContext={latestAttempt ? { total: latestAttempt.total, tile: latestAttempt.tileSize } : null} />;
    return <CanvasMaterial key={flow.state.resetVersion} id={id} presentation={presentation} flow={{ ...flow, codeAttachment: mainAttachment }} onShowCard={openContent} onAttachCode={() => openDialog("code")} explanation={explanation} onAsk={askExplanation} onCompare={compareExplanation} />;
  };
  const availableMaterials = isMainTask ? [
    ...Object.values(MATERIAL_DEFINITIONS).filter(item => item.id !== "canvas" && item.id !== "task-brief" && !item.id.startsWith("image-")).map(item => ({
      ...item,
      available: item.id === "attempts" || item.id === "diff" ? flow.state.attempts.length > 0 : item.id === "validation" ? Boolean(flow.state.appliedCode) : true,
      disabledReason: item.id === "validation" ? "应用示例修改后可用" : "运行一次范围算例后可用",
    })),
    ...mainSession.records.map(record => ({ ...getMaterialMeta("record:" + record.id, { title: record.title }), description: record.time + " · " + (record.isDemo ? "示例记录" : "待验证") })),
  ] : isImageTask ? [...IMAGE_MATERIALS.map(item => ({ ...item, available: item.id === "image-attempts" || item.id === "image-diff" ? inference.state.attempts.length > 0 : item.id === "image-validation" ? Boolean(inference.state.applied) : true, disabledReason: "完成示例尝试后可用" })), ...imageSession.records.map(record => getMaterialMeta("record:" + record.id, { title: record.title }))] : [MATERIAL_DEFINITIONS["task-brief"]];
  const materialConnections = [
    { id: "source-explanation", from: "source", to: "explanation", label: "范围示例图解" },
    { id: "evidence-explanation", from: "evidence", to: "explanation", label: "待核查线索" },
    { id: "explanation-parameters", from: "explanation", to: "parameters", label: "沿用参数试算" },
    ...(flow.state.attempts.length ? [{ id: "parameters-attempts", from: "parameters", to: "attempts", label: "已保存尝试" }] : []),
    ...(flow.state.proposedCode ? [{ id: "attempts-diff", from: "attempts", to: "diff", label: "所选尝试的提案" }] : []),
    ...(flow.state.appliedCode ? [{ id: "diff-validation", from: "diff", to: "validation", label: "示例应用后复核" }] : []),
  ];
  const resetCurrentTask = () => {
    if (isMainTask) { flow.actions.reset(); canvas.actions.reset(); setPrecisionContext(null); setSuggestionDismissed(false); }
    if (isImageTask) { inference.actions.reset(); imageCanvas.actions.reset(); }
    workspace.actions.reset();
    setTaskContentsOpen(false);
    wb.resetTask();
  };
  useEffect(() => {
    const before = previousFlow.current;
    const next = { attempts: flow.state.attempts.length, proposal: flow.state.proposedCode, applied: flow.state.appliedCode, validation: flow.state.validation };
    const registerResult = id => workspace.actions.open(id, { activate: false, taskId: MAIN_TASK, isMainTask: true });
    if (next.attempts > before.attempts) registerResult("attempts");
    if (next.proposal && next.proposal !== before.proposal) registerResult("diff");
    if (next.applied && next.applied !== before.applied) registerResult("validation");
    if (next.validation && next.validation !== before.validation) registerResult("validation");
    previousFlow.current = next;
  }, [flow.state.attempts.length, flow.state.proposedCode, flow.state.appliedCode, flow.state.validation]);
  useEffect(() => { setTaskContentsOpen(false); }, [selectedTask]);

  return (
    <main className="app-frame" data-testid="q02-workbench">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-logo" src={`${import.meta.env.BASE_URL}assets/ascend-logo.svg`} alt="Ascend" />
          <span className="brand-studio">Studio</span>
        </div>
        <div className="topbar-divider" />
        <nav className="breadcrumbs" aria-label="当前位置">
          <span>项目</span><IconChevronRight size={14} /><span>{currentGroup?.name}</span><IconChevronRight size={14} /><strong>任务</strong>
        </nav>
        <div className="topbar-spacer" />
        <span className="proposal-badge"><span className="proposal-dot" />设计提案 · 待开发者确认</span>
        <button className="icon-button top-icon" type="button" aria-label="通知" data-menu-trigger aria-expanded={wb.menu?.name === "notifications"} onClick={(event) => openMenu("notifications", event)}><IconBell size={18} />{wb.notifications.length > 0 && <span className="notification-dot" />}</button>
        <button className="profile-button" type="button" aria-label="用户菜单" data-menu-trigger aria-expanded={wb.menu?.name === "profile"} onClick={(event) => openMenu("profile", event)}>D</button>
      </header>

      <div className={"workspace-grid" + (sidebarCollapsed ? " is-sidebar-collapsed" : "") + (layout.dragging ? " is-resizing" : "")} ref={layout.workspaceRef} style={layout.style}>
        <div className={"sidebar-shell" + (sidebarCollapsed ? " is-collapsed" : "")}>
        <aside id="project-sidebar" className="sidebar" aria-label="项目与任务" hidden={sidebarCollapsed}>
          <img className="ambient-art ambient-art--archive" src={`${import.meta.env.BASE_URL}assets/project-archive-ambient.png`} alt="" aria-hidden="true" draggable={false} />
          <div className="primary-nav">
            <button className="new-task-button" type="button" onClick={() => openDialog("newTask")}>
              <IconPlus size={18} /><span>新建任务</span>
            </button>
            <button className="nav-row" type="button" onClick={() => openDialog("automations")}>
              <IconSettingsAutomation size={18} /><span>自动化任务</span>
            </button>
            <button className="nav-row" type="button" onClick={() => openDialog("capabilities")}>
              <IconBooks size={18} /><span>能力库</span>
            </button>
          </div>

          <div className="project-list-header">
            <h1>项目</h1>
            <button className="icon-button compact-icon" type="button" aria-label="项目筛选" data-menu-trigger aria-expanded={wb.menu?.name === "filter"} onClick={(event) => openMenu("filter", event)}>
              <IconAdjustmentsHorizontal size={17} />
            </button>
          </div>
          <label className="search-box">
            <IconSearch size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目或任务" aria-label="搜索项目或任务" />
            {query && <button type="button" className="clear-search" aria-label="清空搜索" onClick={() => setQuery("")}><IconX size={14} /></button>}
          </label>
          <div className="project-scroll">
            {visibleGroups.map((group) => (
              <ProjectSection
                key={group.id}
                group={group}
                opened={openedGroups.includes(group.id) || Boolean(query)}
                query={query}
                selectedTask={selectedTask}
                onToggle={() => toggleGroup(group.id)}
                onSelect={selectTask}
              />
            ))}
            {query && !visibleGroups.some((group) =>
              group.name.toLowerCase().includes(query.toLowerCase()) ||
              group.tasks.some((task) => task.toLowerCase().includes(query.toLowerCase())
            )) && (
              <div className="empty-search">没有匹配的项目或任务</div>
            )}
          </div>
          <div className="sidebar-footer"><IconLock size={14} /><span>当前任务与项目上下文关联</span></div>
        </aside>
        <button
          className="sidebar-toggle"
          type="button"
          aria-controls="project-sidebar"
          aria-expanded={!sidebarCollapsed}
          aria-label={sidebarCollapsed ? "展开项目栏" : "收起项目栏"}
          title={sidebarCollapsed ? "展开项目栏" : "收起项目栏"}
          onClick={() => { setSidebarCollapsed(value => !value); wb.setMenu(null); }}
        >
          {sidebarCollapsed ? <IconChevronRight size={13} /> : <IconChevronLeft size={13} />}
        </button>
        </div>
        {!sidebarCollapsed && <div className="workspace-divider workspace-divider--projects" role="separator" tabIndex={0} aria-label="调整项目栏宽度" title="拖动调整项目栏宽度；双击恢复默认布局" {...layout.separatorProps("projects")} />}

        <section className="conversation-panel" aria-label="任务对话">
          <header className="panel-header conversation-header">
            <div><h2>对话</h2><span className="conversation-context" title={selectedTask}>{selectedTask}</span></div>
            <div className="header-actions">
              <button className="light-button" type="button" onClick={wb.startConversation}><IconPlus size={16} />新对话</button>
              <button className="icon-button" type="button" aria-label="更多对话操作" data-menu-trigger aria-expanded={wb.menu?.name === "chat"} onClick={(event) => openMenu("chat", event)}><IconDots size={18} /></button>
            </div>
            <img className="ambient-art ambient-art--exchange" src={`${import.meta.env.BASE_URL}assets/dialog-exchange-ambient.png`} alt="" aria-hidden="true" draggable={false} />
          </header>
          <div className="conversation-scroll" ref={wb.conversationRef}>
            <div className="conversation-flow">
            {session.showIntro && isMainTask && <>
            <article className="message-row user-message">
              <div className="message-content">
                <div className="message-meta">你</div>
                <div className="user-bubble">为什么 [16,32] 通过，[17,33] 失败？我改过编译参数，还是在 custom_op.cpp:128 报错。</div>
              </div>
            </article>
            <button className="attempt-row" type="button" onClick={() => openDialog("attempts")}>
              <span className="attempt-icon"><IconAdjustmentsHorizontal size={15} /></span>
              <span>已尝试：修改编译参数 · 错误位置未变</span>
              <IconChevronRight className="attempt-chevron" size={16} />
            </button>
            <article className="message-row assistant-message">
              <div className="message-content">
                <div className="message-meta">Ascend Studio</div>
                <div className="assistant-response">
                  <p className="assistant-lead">尾块索引范围值得优先核对，根因尚未确认。</p>
                  <p>已知：<span className="chat-fact is-pass">[16,32] 通过</span>；<span className="chat-fact is-fail">[17,33] 失败</span>。修改编译参数后，错误位置未变。</p>
                  <p>还需：实际循环、两次运行条件与逐元素误差证据。</p>
                  <button className="rationale-button" type="button" aria-expanded={rationaleOpen} onClick={() => setRationaleOpen((value) => !value)}>
                    <IconBook size={16} />{rationaleOpen ? "收起判断依据" : "查看判断依据"}<IconArrowRight className="rationale-arrow" size={15} />
                  </button>
                  {rationaleOpen && <div className="rationale-detail"><p>[16,32] 与 [17,33] 的差异让末尾元素处理值得检查，仍需对照实际循环与误差证据，不能单独证明越界。</p><button type="button" className="task-plain-button" onClick={() => openContent("evidence")}>打开现场与判断<IconArrowRight size={13} /></button></div>}
                  <p className="assistant-next">先理解有效元素与访问范围，再决定下一步。</p>
                  {!suggestionDismissed && <div className="task-inline-suggestion">
                    <div><IconBook size={15} /><span><strong>先看懂这条线索，再决定是否修改</strong><small>展开范围示例，保留当前任务与错误现场。</small></span><button type="button" className="icon-button compact-icon" aria-label="关闭解释建议" onClick={() => setSuggestionDismissed(true)}><IconX size={14} /></button></div>
                    <div className="task-suggestion-actions"><button type="button" className="light-button" onClick={() => openTaskFlow("understand")}>查看图解并试改<IconArrowRight size={14} /></button><button type="button" className="task-plain-button" onClick={() => changeActionView("code")}>直接核对代码</button><button type="button" className="task-plain-button" onClick={() => arrangeMaterials(["source", "evidence", "explanation"])}>在画布中整理</button></div>
                  </div>}
                  <details className="chat-next-disclosure"><summary>比较其他排查方向</summary><div className="chat-next-actions" aria-label="可能的下一步方向">
                    <div className="chat-next-heading">可能的下一步方向</div>
                    {routes.map((route, index) => (
                      <button
                        className={"chat-next-row" + (selectedRoute === route.id ? " is-selected" : "")}
                        type="button"
                        key={route.id}
                        onClick={() => { setSelectedRoute(route.id); if (route.id !== "retry") changeActionView(route.id === "tail" ? "code" : "precision"); }}
                      >
                        <span className="chat-next-number">{index + 1}</span>
                        <strong>{route.title}</strong>
                        <small>{route.sub} · {route.reason}</small>
                      </button>
                    ))}
                    <button className="light-button chat-canvas-action" type="button" onClick={confirmWorkspaceRoute}>{selectedRouteData.id === "retry" ? "保留现场并重新评估" : selectedRouteData.id === "tail" ? "查看索引范围示例" : "打开误差核对"}<IconArrowRight size={14} /></button>
                  </div></details>
                </div>
                <div className="message-feedback">
                  <button type="button" aria-label="复制回答" onClick={() => wb.copyText(task.reply)}><IconCopy size={16} /></button>
                  <button type="button" aria-label="赞同" aria-pressed={session.feedback === "up"} onClick={() => feedback("up")}><IconThumbUp size={16} /></button>
                  <button type="button" aria-label="不赞同" aria-pressed={session.feedback === "down"} onClick={() => feedback("down")}><IconThumbDown size={16} /></button>
                </div>
              </div>
            </article>
            </>}
            {session.showIntro && !isMainTask && <>
              <article className="message-row user-message"><div className="message-content"><div className="message-meta">你</div><div className="user-bubble">{task.question}</div></div></article>
              <article className="message-row assistant-message"><div className="message-content"><div className="message-meta">Ascend Studio · 演示</div><div className="assistant-response">{task.reply.split("\n\n").map((text, index) => <p key={index}>{text}</p>)}{isImageTask && <div className="task-inline-suggestion"><div><IconBook size={15} /><span><strong>从图像到输入张量，先看懂再试</strong><small>原代码只读，练习与尝试保留在本任务。</small></span></div><div className="task-suggestion-actions"><button className="light-button" type="button" onClick={() => openContent("image-explanation")}>查看图解<IconArrowRight size={14} /></button><button className="task-plain-button" type="button" onClick={() => { inference.actions.explore(); openContent("image-practice"); }}>在副本中试一下</button></div></div>}</div></div></article>
            </>}
            {messages.map((message) => (
              <article className={"message-row " + (message.role === "user" ? "user-message" : "assistant-message")} key={message.id}>
                <div className="message-content">
                  <div className="message-meta">{message.role === "user" ? "你" : "Ascend Studio"}{message.isDemo && " · 演示"}{message.model && " · " + message.model}</div>
                  <div className={message.role === "user" ? "user-bubble" : "assistant-response extra-message"}>{message.text.split("\n\n").map((paragraph, i) => <p className="message-paragraph" key={i}>{paragraph}</p>)}
                    {message.attachments?.length > 0 && <div className="message-attachments">{message.attachments.map((file) => <button type="button" key={file.id} onClick={() => openDialog("evidence", { title: file.name, body: "本次任务的本地附件，尚未独立验证。", log: file.content || "已关联文件名称，尚无可读取的文本内容。" })}><IconPaperclip size={13} />{file.name}</button>)}</div>}
                  </div>
                  {message.sourceContext && <div className="message-source-links"><button type="button" onClick={() => { if (message.sourceContext.kind === "image") { inference.actions.seek(message.sourceContext.time); if (!inference.state.lessonOpen) inference.actions.lesson(); openContent("image-explanation"); } else openContent("explanation", { anchor: message.sourceContext.focus, time: message.sourceContext.time, video: true }); }}><IconPlayerPlay size={12} /><span>讲解示例 {message.sourceContext.stamp} · 返回片段</span></button>{message.role === "assistant" && <button type="button" onClick={() => { if (message.sourceContext.kind === "image") { inference.actions.focus(message.sourceContext.focus); openContent("image-explanation"); } else openContent("explanation", { anchor: message.sourceContext.focus }); }}><IconBook size={12} />查看关联图解</button>}</div>}
                  {message.role === "assistant" && <div className="message-feedback"><button type="button" aria-label="复制这条回答" onClick={() => wb.copyText(message.text)}><IconCopy size={16} /></button></div>}
                </div>
              </article>
            ))}
            {session.replying && <div className="replying-indicator" role="status"><span /><span /><span /><small>正在整理演示答复…</small></div>}
            </div>
          </div>
          <form className="composer" onSubmit={sendMessage}>
            {(session.attachments.length > 0 || session.capabilityIds.length > 0) && <div className="composer-context-chips">
              {session.attachments.map((file) => <span className="attachment-chip" key={file.id}><IconPaperclip size={13} /><span title={file.name}>{file.name}</span><button type="button" aria-label={"移除附件 " + file.name} onClick={() => wb.patchSession((old) => ({ attachments: old.attachments.filter((item) => item.id !== file.id) }))}><IconX size={12} /></button></span>)}
              {session.capabilityIds.map((id) => <span className="attachment-chip capability-chip" key={id}><IconBooks size={13} /><span>{capabilities.find((item) => item.id === id)?.name}</span><button type="button" aria-label="移除能力" onClick={() => wb.patchSession((old) => ({ capabilityIds: old.capabilityIds.filter((item) => item !== id) }))}><IconX size={12} /></button></span>)}
            </div>}
            <textarea ref={wb.draftRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); sendMessage(event); } }} placeholder="继续提问，或描述你想进行的下一步…" aria-label="继续提问" rows={1} />
            <div className="composer-toolbar">
              <div className="composer-tools">
                <button className="icon-button composer-plus" type="button" aria-label="更多输入方式" data-menu-trigger aria-expanded={wb.menu?.name === "input"} onClick={(event) => openMenu("input", event)}><IconPlus size={17} /></button>
                <button className="tool-chip" type="button" onClick={() => openDialog("code")}><IconCode size={15} />代码片段</button>
                <button className="tool-chip" type="button" onClick={() => wb.imageRef.current?.click()}><IconPhoto size={15} />截图</button>
                <button className="tool-chip" type="button" onClick={() => wb.fileRef.current?.click()}><IconPaperclip size={15} />文件</button>
              </div>
              <div className="composer-submit">
                <button className="model-button" type="button" onClick={() => openDialog("models")} title="选择 AI（本地演示）"><IconBulb size={14} /><span>{wb.model.label}</span><IconChevronDown size={13} /></button>
                <button className="send-button" type="submit" aria-label="发送消息" disabled={session.replying || (!draft.trim() && !session.attachments.length)}><IconSend size={17} /></button>
              </div>
            </div>
          </form>
          <input hidden type="file" multiple ref={wb.fileRef} onChange={(event) => wb.readFiles(event, "file")} aria-label="选择文件附件" />
          <input hidden type="file" multiple accept="image/*" ref={wb.imageRef} onChange={(event) => wb.readFiles(event, "image")} aria-label="选择截图附件" />
        </section>

        <div className="workspace-divider workspace-divider--conversation" role="separator" tabIndex={0} aria-label="调整对话与工作区宽度" title="拖动调整对话与工作区宽度；双击恢复默认布局" {...layout.separatorProps("conversation")} />
        <aside className="diagnostic-panel" aria-label="任务工作区">
          <TaskWorkspace taskId={selectedTask} workspace={workspace} isMainTask={isInteractiveTask} materials={availableMaterials} onOpen={openContent} onOpenCanvas={openCanvas} onArrange={arrangeMaterials}
            renderContent={(id, ownerId) => renderMaterial(id, "content", ownerId)}
            renderCanvas={(visible, ownerId) => ownerId === MAIN_TASK ? <TaskCanvas key={flow.state.resetVersion} embedded visible={visible} flow={flow} canvas={canvas} onBack={() => openContent("evidence")} onOpenContents={() => setTaskContentsOpen(value => !value)} onOpenContent={openContent} onAttachCode={() => openDialog("code")} connections={materialConnections} renderMaterial={id => renderMaterial(id, "canvas")} contentsOpen={taskContentsOpen && visible} contents={<CanvasIndex canvas={canvas} flow={flow} records={mainSession.records} onClose={() => setTaskContentsOpen(false)} onLocate={locateCanvasMaterial} onOpenRecord={record => locateCanvasMaterial("record:" + record.id)} />} /> : ownerId === IMAGE_TASK ? <TaskCanvas key={inference.state.resetVersion} embedded visible={visible} canvas={imageCanvas} comparisonIds={["image-source", "image-practice"]} onBack={() => openContent("image-explanation")} onOpenContents={() => setTaskContentsOpen(value => !value)} onOpenContent={openContent} connections={[{ id: "image-code-diagram", from: "image-source", to: "image-explanation", label: "通道与维度" }, { id: "image-diagram-practice", from: "image-explanation", to: "image-practice", label: "参数试改" }, { id: "image-practice-result", from: "image-practice", to: "image-attempts", label: "形状快照" }]} renderMaterial={id => renderMaterial(id, "canvas", IMAGE_TASK)} contentsOpen={taskContentsOpen && visible} contents={<div className="image-canvas-index"><header>本任务内容<button type="button" onClick={() => setTaskContentsOpen(false)} aria-label="关闭图像任务内容"><IconX size={14} /></button></header>{IMAGE_MATERIALS.map(item => <button key={item.id} type="button" onClick={() => { imageCanvas.actions.showCard(item.id); setTaskContentsOpen(false); }}>{item.title}<IconArrowRight size={13} /></button>)}</div>} /> : null}
          />
        </aside>
      </div>
      {wb.menu && <div className={"workbench-menu workbench-menu-" + wb.menu.name} ref={wb.menuRef} style={{ left: wb.menu.left, ...(wb.menu.bottom !== null ? { bottom: wb.menu.bottom } : { top: wb.menu.top }) }}>
        {wb.menu.name === "filter" && <><div className="menu-label">显示项目</div>{[{ id: "all", label: "全部项目" }, { id: "current", label: "当前项目" }].map((item) => <button key={item.id} type="button" className={wb.filterScope === item.id ? "is-active" : ""} onClick={() => closeMenuAnd(() => wb.setFilterScope(item.id))}>{item.label}{wb.filterScope === item.id && <IconCircleCheck size={15} />}</button>)}<div className="menu-divider" /><button type="button" onClick={() => closeMenuAnd(() => wb.setOpenedGroups(wb.groups.map((group) => group.id)))}>展开所有项目</button><button type="button" onClick={() => closeMenuAnd(() => wb.setOpenedGroups([]))}>收起所有项目</button></>}
        {wb.menu.name === "chat" && <><div className="menu-label">当前任务对话</div><button type="button" onClick={() => openDialog("history")}>对话历史<span>{session.history.length}</span></button><button type="button" onClick={() => closeMenuAnd(() => wb.copyText(wb.conversationText()))}>复制当前对话<IconCopy size={15} /></button><button type="button" onClick={wb.exportTask}>导出任务记录<IconFileText size={15} /></button><div className="menu-divider" /><button type="button" onClick={resetCurrentTask}>恢复本题初始状态</button></>}
        {wb.menu.name === "input" && <><div className="menu-label">补充任务上下文</div><button type="button" onClick={() => openDialog("code")}>代码片段<IconCode size={15} /></button><button type="button" onClick={() => closeMenuAnd(() => wb.fileRef.current?.click())}>选择本地文件<IconPaperclip size={15} /></button><button type="button" onClick={() => closeMenuAnd(() => wb.imageRef.current?.click())}>选择截图<IconPhoto size={15} /></button><button type="button" onClick={() => openDialog("capabilities")}>使用能力库<IconBooks size={15} /></button></>}
        {wb.menu.name === "diagnostic" && <><div className="menu-label">判断与核对</div>{isMainTask && <><button type="button" onClick={() => closeMenuAnd(() => openContent("review"))}>生成复核记录<IconFileText size={15} /></button><button type="button" onClick={() => closeMenuAnd(() => setRationaleOpen((value) => !value))}>{rationaleOpen ? "收起判断依据" : "展开判断依据"}<IconBook size={15} /></button></>}<button type="button" onClick={() => openDialog("attempts")}>已尝试的动作<IconAdjustmentsHorizontal size={15} /></button><button type="button" onClick={wb.exportTask}>导出任务记录<IconFileText size={15} /></button></>}
        {wb.menu.name === "notifications" && <><div className="menu-label">任务动态</div>{wb.notifications.length ? wb.notifications.map((entry) => <button className="notification-row" key={entry.id} type="button" onClick={() => selectTask(entry.taskName)}><span><strong>{entry.text}</strong><small>{entry.taskName} · {entry.time}</small></span></button>) : <p className="menu-empty">尚无新动态。完成核对后会在这里留下记录。</p>}</>}
        {wb.menu.name === "profile" && <><div className="menu-profile"><strong>开发者</strong><span>Ascend Studio · 本地设计预览</span></div><button type="button" onClick={wb.exportTask}>导出当前任务</button><p className="menu-empty">附件与交互记录保存在本次页面会话中；刷新后恢复初始状态。</p></>}
      </div>}

      <WorkbenchDialogs dialog={wb.dialog} onClose={wb.closeDialog} groups={wb.groups} taskName={selectedTask} taskGoal={task.goal} onCreateTask={wb.createTask} onAttachCode={wb.attachCode} capabilities={capabilities} onUseCapability={wb.useCapability} automations={wb.automations} onToggleAutomation={(id) => wb.setAutomations((items) => items.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item))} onRunAutomation={wb.runAutomation} onAddAutomation={(entry) => wb.setAutomations((items) => [...items, { ...entry, id: crypto.randomUUID(), enabled: true, lastRun: "" }])} history={session.history} onRestoreConversation={wb.restoreConversation} modelOptions={modelOptions} selectedModel={wb.selectedModel} onSelectModel={wb.chooseModel} attempts={wb.attempts} onAddAttempt={(entry) => wb.addRecord({ ...entry, kind: "attempt", isDemo: false })} evidenceDetail={wb.dialogData} copyText={wb.dialogData.text || ""} />
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </main>
  );
}

export { App };
