import { useEffect, useRef, useState } from "react";
import { useWorkbenchState, MAIN_TASK } from "./useWorkbenchState";
import { capabilities, modelOptions } from "./prototype-data";
import { WorkbenchDialogs } from "./WorkbenchDialogs";
import { ActionWorkspace } from "./ActionWorkspace";
import { useTaskFlow } from "./useTaskFlow";
import { useCanvasState } from "./useCanvasState";
import { TaskCanvas } from "./TaskCanvas";
import { CanvasMaterial } from "./CanvasMaterials";
import { CanvasIndex } from "./CanvasIndex";
import "./interaction.css";
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
  const canvas = useCanvasState();
  const [precisionContext, setPrecisionContext] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const previousFlow = useRef({ attempts: 0, proposal: null, applied: null });
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
  const showCanvasCard = (id, options = {}) => {
    if (!isMainTask) return;
    if (options.close) canvas.actions.hideCard(options.close);
    if (id === "compare") {
      canvas.actions.beginComparison(["source", "draft"]);
    } else {
      if (id === "diff" && !flow.state.proposedCode) flow.actions.prepareDiff();
      canvas.actions.showCard(id, options);
    }
    setTaskContentsOpen(false);
  };
  const changeActionView = (view) => {
    if (view === "code" || view === "precision") wb.patchSession({ selectedRoute: view === "code" ? "tail" : "precision" });
    showCanvasCard(view === "code" ? "source" : view);
  };
  const openTaskFlow = (phase = "understand") => {
    if (!isMainTask) return;
    if (phase === "try") {
      canvas.actions.showCard("draft", { focus: false });
      showCanvasCard("parameters");
    } else showCanvasCard({ understand: "explanation", diff: "diff", validate: "validation" }[phase] || "explanation");
  };
  const confirmCanvasRoute = () => {
    if (selectedRoute === "retry") wb.confirmRoute();
    else changeActionView(selectedRoute === "tail" ? "code" : "precision");
  };
  const openCanvasRecord = (record) => {
    canvas.actions.addCard({ id: "record:" + record.id, title: record.title });
    setTaskContentsOpen(false);
  };
  const latestAttempt = flow.state.attempts.find(attempt => attempt.id === flow.state.selectedAttemptId) || flow.state.attempts.at(-1);
  const renderCanvasMaterial = (id) => {
    if (id.startsWith("record:")) {
      const record = session.records.find(item => "record:" + item.id === id);
      return record ? <article className="canvas-record-detail"><span>{record.time} · {record.isDemo ? "浏览器示例记录" : "开发者记录 · 待验证"}</span><p>{record.summary}</p></article> : null;
    }
    if (id === "precision" || id === "review") return <ActionWorkspace embedded view={id} onChangeView={changeActionView} onBack={() => canvas.actions.hideCard(id)} onRecord={(record) => wb.addRecord(record, MAIN_TASK)} precisionContext={precisionContext} onPrecisionContext={setPrecisionContext} rangeContext={latestAttempt ? { total: latestAttempt.total, tile: latestAttempt.tileSize } : null} />;
    return <CanvasMaterial id={id} flow={{ ...flow, codeAttachment: wb.attachmentCode }} onShowCard={showCanvasCard} onAttachCode={() => openDialog("code")} />;
  };
  const resetCurrentTask = () => {
    if (isMainTask) { flow.actions.reset(); canvas.actions.reset(); setPrecisionContext(null); setSuggestionDismissed(false); }
    setTaskContentsOpen(false);
    wb.resetTask();
  };
  useEffect(() => {
    const before = previousFlow.current;
    const next = { attempts: flow.state.attempts.length, proposal: flow.state.proposedCode, applied: flow.state.appliedCode };
    if (next.attempts > before.attempts) canvas.actions.showCard("attempts", { focus: isMainTask });
    if (next.proposal && next.proposal !== before.proposal) canvas.actions.showCard("diff", { focus: isMainTask });
    if (!next.proposal && before.proposal) canvas.actions.hideCard("diff");
    if (next.applied && next.applied !== before.applied) canvas.actions.showCard("validation", { focus: isMainTask });
    if (!next.applied && before.applied) canvas.actions.hideCard("validation");
    previousFlow.current = next;
  }, [flow.state.attempts.length, flow.state.proposedCode, flow.state.appliedCode]);
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

      <div className={"workspace-grid" + (sidebarCollapsed ? " is-sidebar-collapsed" : "")}>
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
                  <p className="assistant-lead">目前确认：[16,32] 可以通过，[17,33] 失败；报错为 <code>precision mismatch</code>，位置在 <code>custom_op.cpp:128</code>。修改编译参数后，错误仍出现在同一位置。</p>
                  <p>现有信息只能说明失败与非整块输入同时出现。尾块边界是值得核对的线索，但还不能据此认定根因；也可能与索引范围或精度计算有关。</p>
                  <p>编译参数的调整没有带来新的定位信号。下一步应从重复尝试配置转向核对代码路径和误差证据；尾块判断目前只决定排查顺序，不能当作结论。</p>
                  <p>还需要核对两次运行除输入形状外的条件是否一致，并查看失败元素的逐项误差。当前没有这些记录，所以判断暂时停在“优先核查尾块路径”，不归因到具体实现。</p>
                  <button className="rationale-button" type="button" aria-expanded={rationaleOpen} onClick={() => setRationaleOpen((value) => !value)}>
                    <IconBook size={16} />{rationaleOpen ? "收起判断依据" : "查看判断依据"}<IconArrowRight className="rationale-arrow" size={15} />
                  </button>
                  {rationaleOpen && <div className="rationale-detail"><p>[16,32] 与 [17,33] 的差异让末尾元素处理值得检查，仍需对照实际循环与误差证据，不能单独证明越界。</p><button type="button" className="task-plain-button" onClick={() => showCanvasCard("evidence")}>定位画布中的判断依据<IconArrowRight size={13} /></button></div>}
                  <p className="assistant-next">建议先只读检查对应循环的索引范围和有效元素数；如果没有发现边界异常，再补充逐元素误差证据。当前还没有真实 NPU 验证结果。</p>
                  {!suggestionDismissed && <div className="task-inline-suggestion">
                    <div><IconBook size={15} /><span><strong>先看懂这条线索，再决定是否修改</strong><small>展开范围示例，保留当前任务与错误现场。</small></span><button type="button" className="icon-button compact-icon" aria-label="关闭解释建议" onClick={() => setSuggestionDismissed(true)}><IconX size={14} /></button></div>
                    <div className="task-suggestion-actions"><button type="button" className="light-button" onClick={() => openTaskFlow("understand")}>理解并试改<IconArrowRight size={14} /></button><button type="button" className="task-plain-button" onClick={() => changeActionView("code")}>直接核对代码</button></div>
                  </div>}
                  <div className="chat-next-actions" aria-label="可能的下一步方向">
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
                    <button className="light-button chat-canvas-action" type="button" onClick={confirmCanvasRoute}>{selectedRouteData.id === "retry" ? "保留现场并重新评估" : selectedRouteData.id === "tail" ? "定位画布中的代码" : "在画布中核对误差"}<IconArrowRight size={14} /></button>
                  </div>
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
              <article className="message-row assistant-message"><div className="message-content"><div className="message-meta">Ascend Studio · 演示</div><div className="assistant-response"><p>{task.reply}</p></div></div></article>
            </>}
            {messages.map((message) => (
              <article className={"message-row " + (message.role === "user" ? "user-message" : "assistant-message")} key={message.id}>
                <div className="message-content">
                  <div className="message-meta">{message.role === "user" ? "你" : "Ascend Studio"}{message.isDemo && " · 演示"}{message.model && " · " + message.model}</div>
                  <div className={message.role === "user" ? "user-bubble" : "assistant-response extra-message"}>{message.text.split("\n\n").map((paragraph, i) => <p className="message-paragraph" key={i}>{paragraph}</p>)}
                    {message.attachments?.length > 0 && <div className="message-attachments">{message.attachments.map((file) => <button type="button" key={file.id} onClick={() => openDialog("evidence", { title: file.name, body: "本次任务的本地附件，尚未独立验证。", log: file.content || "已关联文件名称，尚无可读取的文本内容。" })}><IconPaperclip size={13} />{file.name}</button>)}</div>}
                  </div>
                  {message.role === "assistant" && <div className="message-feedback"><button type="button" aria-label="复制这条回答" onClick={() => wb.copyText(message.text)}><IconCopy size={16} /></button></div>}
                </div>
              </article>
            ))}
            {session.replying && <div className="replying-indicator" role="status"><span /><span /><span /><small>正在整理演示答复…</small></div>}
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

        <aside className="diagnostic-panel" aria-label={isMainTask ? "任务画布" : "任务简报"}>
          <TaskCanvas key={flow.state.resetVersion} visible={isMainTask} flow={flow} canvas={canvas} onBack={() => showCanvasCard("evidence")} onOpenContents={() => setTaskContentsOpen(value => !value)} onAttachCode={() => openDialog("code")} renderMaterial={renderCanvasMaterial} contentsOpen={taskContentsOpen && isMainTask} contents={<CanvasIndex canvas={canvas} flow={flow} records={session.records} onClose={() => setTaskContentsOpen(false)} onLocate={showCanvasCard} onOpenRecord={openCanvasRecord} />} />
          {!isMainTask && <div className="diagnostic-scroll">
            <header className="panel-header diagnostic-header"><h2>任务简报</h2><button className="icon-button" type="button" aria-label="更多诊断操作" data-menu-trigger aria-expanded={wb.menu?.name === "diagnostic"} onClick={(event) => openMenu("diagnostic", event)}><IconDots size={18} /></button></header>
            <section className="task-brief-section"><div className="section-title"><IconFileText size={18} /><h3>任务简报</h3></div><div className="task-brief-card"><strong>{selectedTask}</strong><p>{task.goal}</p><span>待补充证据</span></div></section>
            <section className="task-brief-section"><div className="section-title"><IconDatabase size={18} /><h3>上下文与材料</h3></div><div className="task-brief-card"><p>补充代码、日志与运行条件后，再确定检查方向。</p><button type="button" className="light-button" onClick={() => openDialog("code")}><IconCode size={15} />补充代码片段</button><button type="button" className="light-button" onClick={() => { setDraft("请帮我整理当前任务的环境条件、需要补充的证据和下一步检查清单。"); wb.draftRef.current?.focus(); }}><IconMessageCircle size={15} />整理检查清单</button></div></section>
            <p className="action-footnote">任务内容仅用于本地交互演示，尚未接入 AI 或硬件服务。</p>
          </div>}
        </aside>
      </div>
      {wb.menu && <div className={"workbench-menu workbench-menu-" + wb.menu.name} ref={wb.menuRef} style={{ left: wb.menu.left, ...(wb.menu.bottom !== null ? { bottom: wb.menu.bottom } : { top: wb.menu.top }) }}>
        {wb.menu.name === "filter" && <><div className="menu-label">显示项目</div>{[{ id: "all", label: "全部项目" }, { id: "current", label: "当前项目" }].map((item) => <button key={item.id} type="button" className={wb.filterScope === item.id ? "is-active" : ""} onClick={() => closeMenuAnd(() => wb.setFilterScope(item.id))}>{item.label}{wb.filterScope === item.id && <IconCircleCheck size={15} />}</button>)}<div className="menu-divider" /><button type="button" onClick={() => closeMenuAnd(() => wb.setOpenedGroups(wb.groups.map((group) => group.id)))}>展开所有项目</button><button type="button" onClick={() => closeMenuAnd(() => wb.setOpenedGroups([]))}>收起所有项目</button></>}
        {wb.menu.name === "chat" && <><div className="menu-label">当前任务对话</div><button type="button" onClick={() => openDialog("history")}>对话历史<span>{session.history.length}</span></button><button type="button" onClick={() => closeMenuAnd(() => wb.copyText(wb.conversationText()))}>复制当前对话<IconCopy size={15} /></button><button type="button" onClick={wb.exportTask}>导出任务记录<IconFileText size={15} /></button><div className="menu-divider" /><button type="button" onClick={resetCurrentTask}>恢复本题初始状态</button></>}
        {wb.menu.name === "input" && <><div className="menu-label">补充任务上下文</div><button type="button" onClick={() => openDialog("code")}>代码片段<IconCode size={15} /></button><button type="button" onClick={() => closeMenuAnd(() => wb.fileRef.current?.click())}>选择本地文件<IconPaperclip size={15} /></button><button type="button" onClick={() => closeMenuAnd(() => wb.imageRef.current?.click())}>选择截图<IconPhoto size={15} /></button><button type="button" onClick={() => openDialog("capabilities")}>使用能力库<IconBooks size={15} /></button></>}
        {wb.menu.name === "diagnostic" && <><div className="menu-label">判断与核对</div>{isMainTask && <><button type="button" onClick={() => closeMenuAnd(() => showCanvasCard("review"))}>生成复核记录<IconFileText size={15} /></button><button type="button" onClick={() => closeMenuAnd(() => setRationaleOpen((value) => !value))}>{rationaleOpen ? "收起判断依据" : "展开判断依据"}<IconBook size={15} /></button></>}<button type="button" onClick={() => openDialog("attempts")}>已尝试的动作<IconAdjustmentsHorizontal size={15} /></button><button type="button" onClick={wb.exportTask}>导出任务记录<IconFileText size={15} /></button></>}
        {wb.menu.name === "notifications" && <><div className="menu-label">任务动态</div>{wb.notifications.length ? wb.notifications.map((entry) => <button className="notification-row" key={entry.id} type="button" onClick={() => selectTask(entry.taskName)}><span><strong>{entry.text}</strong><small>{entry.taskName} · {entry.time}</small></span></button>) : <p className="menu-empty">尚无新动态。完成核对后会在这里留下记录。</p>}</>}
        {wb.menu.name === "profile" && <><div className="menu-profile"><strong>开发者</strong><span>Ascend Studio · 本地设计预览</span></div><button type="button" onClick={wb.exportTask}>导出当前任务</button><p className="menu-empty">附件与交互记录保存在本次页面会话中；刷新后恢复初始状态。</p></>}
      </div>}

      <WorkbenchDialogs dialog={wb.dialog} onClose={wb.closeDialog} groups={wb.groups} taskName={selectedTask} taskGoal={task.goal} onCreateTask={wb.createTask} onAttachCode={wb.attachCode} capabilities={capabilities} onUseCapability={wb.useCapability} automations={wb.automations} onToggleAutomation={(id) => wb.setAutomations((items) => items.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item))} onRunAutomation={wb.runAutomation} onAddAutomation={(entry) => wb.setAutomations((items) => [...items, { ...entry, id: crypto.randomUUID(), enabled: true, lastRun: "" }])} history={session.history} onRestoreConversation={wb.restoreConversation} modelOptions={modelOptions} selectedModel={wb.selectedModel} onSelectModel={wb.chooseModel} attempts={wb.attempts} onAddAttempt={(entry) => wb.addRecord({ ...entry, kind: "attempt", isDemo: false })} evidenceDetail={wb.dialogData} copyText={wb.dialogData.text || ""} />
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </main>
  );
}

export { App };
