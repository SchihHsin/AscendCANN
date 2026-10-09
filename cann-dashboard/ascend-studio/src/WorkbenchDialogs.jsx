import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  IconAlertCircle,
  IconArrowRight,
  IconBook,
  IconCheck,
  IconCode,
  IconCopy,
  IconCpu,
  IconFileText,
  IconHistory,
  IconPlayerPlay,
  IconPlus,
  IconSearch,
  IconSettingsAutomation,
  IconX,
} from "@tabler/icons-react";
import "./workbench-dialogs.css";

const dialogConfig = {
  newTask: { title: "新建任务", description: "把目标和上下文保存在项目中，后续对话会围绕这个任务展开。", icon: IconPlus },
  code: { title: "附加代码片段", description: "补充当前任务的代码上下文。片段只会保存在本次原型会话中。", icon: IconCode },
  capabilities: { title: "能力库", description: "选择一个能力，把检查目标带入当前对话。", icon: IconBook },
  automations: { title: "自动化任务", description: "查看任务状态，或演示运行一次。", icon: IconSettingsAutomation },
  history: { title: "对话历史", description: "恢复记录时，会切换当前任务的对话内容。", icon: IconHistory },
  models: { title: "选择 AI", description: "选择本次对话使用的演示 AI 配置。", icon: IconCpu },
  attempts: { title: "已尝试的动作", description: "保留动作和结果，避免反复尝试相同路径。", icon: IconHistory },
  evidence: { title: "证据详情", description: "查看已记录的事实和日志。", icon: IconFileText },
  copy: { title: "复制内容", description: "已选中下方内容，可使用 ⌘C / Ctrl+C 复制。", icon: IconCopy },
};

function FormError({ message }) {
  if (!message) return null;
  return <p className="wb-dialog-error" role="alert"><IconAlertCircle size={16} /><span>{message}</span></p>;
}

function EmptyState({ children }) {
  return <div className="wb-dialog-empty">{children}</div>;
}

function FormActions({ onClose, children }) {
  return <div className="wb-dialog-actions"><button className="wb-button" type="button" onClick={onClose}>取消</button>{children}</div>;
}

function NewTaskForm({ groups = [], onCreateTask, onClose }) {
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState(groups[0]?.id || "");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !goal.trim()) { setError("请填写任务名称和目标。"); return; }
    if (!groups.some((group) => group.id === groupId)) { setError("请选择一个项目。"); return; }
    try {
      if (onCreateTask?.({ name: name.trim(), groupId, goal: goal.trim() }) === false) {
        setError("这个项目中已有同名任务，请换一个名称。");
      }
    } catch { setError("任务未能创建，请稍后重试。"); }
  };
  return <form className="wb-form" onSubmit={submit}>
    <label className="wb-field"><span>任务名称</span><input data-initial-focus required maxLength={80} value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="例如：排查非整块输入的精度异常" /></label>
    <label className="wb-field"><span>所属项目</span><select required value={groupId} onChange={(event) => setGroupId(event.target.value)} disabled={!groups.length}>{groups.length ? groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>) : <option value="">暂无可用项目</option>}</select></label>
    <label className="wb-field"><span>任务目标</span><textarea required rows={4} maxLength={2000} value={goal} onChange={(event) => { setGoal(event.target.value); setError(""); }} placeholder="描述期望结果、已有信息和需要检查的内容。" /></label>
    <FormError message={error} />
    <FormActions onClose={onClose}><button className="wb-button wb-button-primary" type="submit" disabled={!groups.length}>创建任务<IconArrowRight size={15} /></button></FormActions>
  </form>;
}

function CodeForm({ taskName, onAttachCode, onClose }) {
  const [name, setName] = useState("custom_op.cpp");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !content.trim()) { setError("请填写文件名和代码内容。"); return; }
    try { onAttachCode?.({ name: name.trim(), content: content.trim() }); }
    catch { setError("代码片段未能附加，请重试。"); }
  };
  return <form className="wb-form" onSubmit={submit}>
    {taskName && <p className="wb-context">当前任务：{taskName}</p>}
    <label className="wb-field"><span>文件名</span><input required maxLength={160} value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="custom_op.cpp" /></label>
    <label className="wb-field"><span>代码片段</span><textarea className="wb-code-input" data-initial-focus required rows={11} maxLength={50000} value={content} onChange={(event) => { setContent(event.target.value); setError(""); }} placeholder="粘贴与当前问题相关的代码……" spellCheck={false} /></label>
    <FormError message={error} />
    <FormActions onClose={onClose}><button className="wb-button wb-button-primary" type="submit"><IconCode size={15} />附加到对话</button></FormActions>
  </form>;
}

function CapabilityList({ capabilities = [], onUseCapability }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const categories = useMemo(() => ["全部", ...new Set(capabilities.map((item) => item.category).filter(Boolean))], [capabilities]);
  const visible = capabilities.filter((item) => (category === "全部" || item.category === category) && [item.name, item.description, item.category, item.prompt].filter(Boolean).join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="wb-content-stack">
    <label className="wb-search"><IconSearch size={17} /><input data-initial-focus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索能力名称或用途" aria-label="搜索能力" /></label>
    <div className="wb-filter-row" aria-label="能力分类">{categories.map((item) => <button key={item} type="button" className={"wb-filter" + (item === category ? " is-active" : "")} aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <div className="wb-item-list">{visible.length ? visible.map((item) => <article className="wb-list-item" key={item.id}><div className="wb-item-copy"><div className="wb-item-heading"><h3>{item.name}</h3>{item.category && <span className="wb-tag">{item.category}</span>}</div><p>{item.description}</p>{item.prompt && <div className="wb-prompt-preview">{item.prompt}</div>}</div><button className="wb-button" type="button" onClick={() => onUseCapability?.(item.id)}>使用<IconArrowRight size={14} /></button></article>) : <EmptyState>{capabilities.length ? "没有匹配的能力，试试其他关键词。" : "暂时没有可用能力。"}</EmptyState>}</div>
  </div>;
}

function AutomationList({ automations = [], onToggleAutomation, onRunAutomation, onAddAutomation }) {
  const [name, setName] = useState("");
  const [cadence, setCadence] = useState("每个工作日 09:00");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !cadence.trim()) { setError("请填写自动化名称和运行周期。"); return; }
    try {
      onAddAutomation?.({ name: name.trim(), cadence: cadence.trim() });
      setName(""); setError("");
    } catch { setError("自动化未能添加，请重试。"); }
  };
  return <div className="wb-content-stack">
    <div className="wb-preview-note"><IconAlertCircle size={16} /><p>这是本次预览的状态演示。开关、周期和运行记录仅保存在页面中，未连接真实定时调度。</p></div>
    <div className="wb-item-list">{automations.length ? automations.map((item) => <article className="wb-list-item wb-automation-item" key={item.id}><div className="wb-item-copy"><h3>{item.name}</h3><p>{item.cadence} · {item.enabled ? "已启用" : "已暂停"}</p><small>最近演示运行：{item.lastRun || "尚未运行"}</small></div><div className="wb-automation-actions"><button className="wb-switch" type="button" role="switch" aria-checked={item.enabled} aria-label={(item.enabled ? "暂停" : "启用") + item.name} onClick={() => onToggleAutomation?.(item.id)}><span /></button><button className="wb-button" type="button" disabled={Boolean(item.running)} onClick={() => onRunAutomation?.(item.id)}><IconPlayerPlay size={14} />{item.running ? "演示运行中…" : "演示运行"}</button></div></article>) : <EmptyState>尚无自动化任务，可以在下方添加一个演示任务。</EmptyState>}</div>
    <form className="wb-form wb-inline-form" onSubmit={submit}><h3 className="wb-form-heading">新增自动化</h3><div className="wb-field-grid"><label className="wb-field"><span>名称</span><input required maxLength={80} value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="例如：检查构建日志" /></label><label className="wb-field"><span>周期</span><input required maxLength={100} value={cadence} onChange={(event) => setCadence(event.target.value)} placeholder="每个工作日 09:00" /></label></div><FormError message={error} /><div className="wb-inline-actions"><button className="wb-button" type="submit"><IconPlus size={14} />添加演示任务</button></div></form>
  </div>;
}

function HistoryList({ history = [], onRestoreConversation }) {
  return <div className="wb-item-list">{history.length ? history.map((item) => <article className="wb-list-item" key={item.id}><div className="wb-item-copy"><h3>{item.title}</h3><p>{item.time || "本次会话"} · {(item.messages?.length || 0) + (item.showIntro ? 2 : 0)} 条消息</p>{item.messages?.length > 0 && <div className="wb-history-preview">{item.messages.at(-1)?.text || "已有对话记录"}</div>}</div><button className="wb-button" type="button" onClick={() => onRestoreConversation?.(item.id)}><IconHistory size={14} />恢复</button></article>) : <EmptyState>尚无已保存的对话记录。</EmptyState>}</div>;
}

function ModelList({ modelOptions = [], selectedModel, onSelectModel }) {
  return <div className="wb-content-stack"><p className="wb-context">本原型使用本地演示回复；选择配置会更新界面中的 AI 名称。</p><div className="wb-model-list" role="group" aria-label="AI 配置">{modelOptions.length ? modelOptions.map((item) => <button className={"wb-model-item" + (item.id === selectedModel ? " is-selected" : "")} type="button" key={item.id} aria-pressed={item.id === selectedModel} onClick={() => onSelectModel?.(item.id)}><IconCpu size={20} /><span><strong>{item.label}</strong><small>{item.description}</small></span>{item.id === selectedModel ? <IconCheck className="wb-model-check" size={18} /> : <span className="wb-model-check" />}</button>) : <EmptyState>暂无可选的 AI 配置。</EmptyState>}</div></div>;
}

function AttemptsList({ attempts = [], onAddAttempt }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!title.trim() || !summary.trim()) { setError("请填写动作和结果。"); return; }
    try {
      onAddAttempt?.({ title: title.trim(), summary: summary.trim() });
      setTitle(""); setSummary(""); setError("");
    } catch { setError("记录未能保存，请重试。"); }
  };
  return <div className="wb-content-stack"><div className="wb-item-list">{attempts.length ? attempts.map((item, index) => <article className="wb-list-item" key={item.id || `${item.title}-${index}`}><div className="wb-attempt-number">{String(index + 1).padStart(2, "0")}</div><div className="wb-item-copy"><h3>{item.title}</h3><p>{item.summary}</p><small>{item.time || "本次会话"}</small></div></article>) : <EmptyState>尚未记录已尝试动作。</EmptyState>}</div><form className="wb-form wb-inline-form" onSubmit={submit}><h3 className="wb-form-heading">手动记录动作</h3><label className="wb-field"><span>做了什么</span><input required maxLength={120} value={title} onChange={(event) => { setTitle(event.target.value); setError(""); }} placeholder="例如：调整编译参数并重新运行" /></label><label className="wb-field"><span>结果与观察</span><textarea required rows={3} maxLength={2000} value={summary} onChange={(event) => { setSummary(event.target.value); setError(""); }} placeholder="记录实际观察到的结果、日志或仍未解决的问题。" /></label><FormError message={error} /><div className="wb-inline-actions"><button className="wb-button" type="submit"><IconPlus size={14} />保存记录</button></div></form></div>;
}

function EvidenceDetail({ evidenceDetail }) {
  if (!evidenceDetail) return <EmptyState>请从右侧证据列表选择一条记录。</EmptyState>;
  return <div className="wb-content-stack"><section className="wb-evidence-summary"><h3>{evidenceDetail.title}</h3><p>{evidenceDetail.body}</p></section>{evidenceDetail.log ? <section><h3 className="wb-form-heading">记录片段</h3><pre className="wb-log" tabIndex={0}>{evidenceDetail.log}</pre></section> : <p className="wb-context">这条记录暂无日志片段。</p>}<p className="wb-context">证据用于限定检查范围；尾块处理仍是待核查线索，根因尚未确认。</p></div>;
}

function DialogContent({ dialog, ...props }) {
  switch (dialog) {
    case "newTask": return <NewTaskForm {...props} />;
    case "code": return <CodeForm {...props} />;
    case "capabilities": return <CapabilityList {...props} />;
    case "automations": return <AutomationList {...props} />;
    case "history": return <HistoryList {...props} />;
    case "models": return <ModelList {...props} />;
    case "attempts": return <AttemptsList {...props} />;
    case "evidence": return <EvidenceDetail {...props} />;
    case "copy": return <label className="wb-field"><span>待复制内容</span><textarea className="wb-copy-input" data-initial-focus readOnly rows={11} value={props.copyText || ""} onFocus={(event) => event.target.select()} aria-label="待复制内容" /><small className="wb-context">也可以选中部分内容后复制。</small></label>;
    default: return null;
  }
}

export function WorkbenchDialogs({ dialog, onClose, ...props }) {
  const modalRef = useRef(null);
  const closeRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();
  closeRef.current = onClose;
  const config = dialogConfig[dialog];
  useEffect(() => {
    if (!dialog || !dialogConfig[dialog]) return undefined;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => [...(modalRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]') || [])].filter((element) => element.getClientRects().length);
    const initial = modalRef.current?.querySelector("[data-initial-focus]") || focusable()[0] || modalRef.current;
    initial?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeRef.current?.(); return; }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); modalRef.current?.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const outside = !modalRef.current?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || outside)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || outside)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) previouslyFocused.focus();
    };
  }, [dialog]);
  if (!config) return null;
  const HeaderIcon = config.icon;
  return createPortal(<div className="wb-modal-overlay" onClick={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
    <section className={"wb-modal wb-modal-" + dialog} ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex={-1}>
      <header className="wb-modal-header"><div className="wb-modal-title-row"><span className="wb-modal-icon"><HeaderIcon size={19} /></span><h2 id={titleId}>{config.title}</h2><button className="wb-close-button" type="button" onClick={onClose} aria-label="关闭对话框"><IconX size={19} /></button></div><p id={descriptionId}>{config.description}</p></header>
      <div className="wb-modal-body"><DialogContent key={dialog} dialog={dialog} onClose={onClose} {...props} /></div>
    </section>
  </div>, document.body);
}

export default WorkbenchDialogs;
