import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import {
  IconArchive,
  IconArrowBackUp,
  IconArrowRight,
  IconCheckupList,
  IconChevronDown,
  IconCode,
  IconFileCode,
  IconFileText,
  IconFiles,
  IconHistory,
  IconLayoutSidebarRightCollapse,
  IconPin,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import "./task-contents.css";

const flowItems = [
  { phase: "understand", title: "来源代码", Icon: IconFileCode, detail: () => "查看来源示例与本任务的浏览器工作副本。" },
  { phase: "understand", title: "解释与草案", Icon: IconFileText, detail: (state) => state.draftCode ? "草案已保留，可继续核对解释和判断依据。" : "查看解释、判断依据，继续形成当前草案。" },
  { phase: "try", title: "尝试结果", Icon: IconHistory, detail: (state) => `${Array.isArray(state.attempts) ? state.attempts.length : 0} 条尝试记录，保留本次过程与选择。` },
  { phase: "diff", title: "修改预览", Icon: IconCode, detail: (state) => state.attempts?.length ? "查看建议修改与当前工作副本的差异。" : "完成一次尝试后，可以查看修改预览。", disabled: (state) => !state.attempts?.length },
  { phase: "validate", title: "示例范围验证", Icon: IconCheckupList, detail: (state) => !state.appliedCode ? "应用到浏览器工作副本后，可以复核示例范围。" : state.validation ? "已有本地示例范围记录，可继续查看。" : "检查示例输入的范围条件，补充待核对项。", disabled: (state) => !state.appliedCode },
];

function FlowIndex({ flow, onOpenFlow, onOpenCode, onUndoArchive }) {
  const state = flow?.state;
  const actions = flow?.actions || {};
  const available = Boolean(state);
  const archived = Boolean(state?.archived);
  const openPhase = (phase) => {
    if (!available) return;
    if (archived) actions.restore?.();
    onOpenFlow?.(phase);
  };
  const restoreCurrent = () => {
    actions.restore?.();
    onOpenFlow?.(state?.phase || "understand");
  };
  return <section className="tc-section" aria-labelledby="tc-flow-title">
    <div className="tc-section-heading"><h3 id="tc-flow-title">判断与核对</h3><div className="tc-status-group">{archived && <span className="tc-status">已收纳</span>}{state?.collapsed && <span className="tc-status">已折叠</span>}{state?.pinned && <span className="tc-status"><IconPin size={11} />已固定</span>}</div></div>
    {available ? <>
      <p className="tc-section-description">同一任务工作区中的内容，打开后接着当前状态继续。</p>
      <div className="tc-flow-index">{flowItems.map(({ phase, title, Icon, detail, disabled }) => <button className={"tc-content-card" + (state.phase === phase ? " is-current" : "")} type="button" key={title} onClick={() => openPhase(phase)} disabled={Boolean(state.busy) || Boolean(disabled?.(state))} aria-label={"打开" + title}><span className="tc-card-icon"><Icon size={17} /></span><span className="tc-card-copy"><strong>{title}</strong><small>{detail(state)}</small></span><IconArrowRight className="tc-card-arrow" size={14} /></button>)}</div>
      <div className="tc-flow-controls">{archived ? <><button className="tc-button tc-restore-button" type="button" onClick={restoreCurrent}><IconArrowBackUp size={14} />恢复工作区</button><button className="tc-text-button" type="button" onClick={() => onUndoArchive ? onUndoArchive() : actions.restore?.()}>撤销收纳</button></> : <><button className="tc-button" type="button" aria-pressed={Boolean(state.collapsed)} onClick={() => actions.toggleCollapse?.()}><IconLayoutSidebarRightCollapse size={14} />{state.collapsed ? "展开" : "折叠"}</button><button className="tc-button" type="button" aria-pressed={Boolean(state.pinned)} onClick={() => actions.togglePin?.()}><IconPin size={14} />{state.pinned ? "取消固定" : "固定"}</button><button className="tc-button" type="button" onClick={() => actions.archive?.()} disabled={Boolean(state.busy)}><IconArchive size={14} />收纳</button></>}</div>
      <p className="tc-retention-note">{archived ? "收纳只移出右侧内容区，工作副本和尝试记录仍保留在本任务中。" : state.collapsed ? "折叠只收起内容；展开后继续当前状态。" : "工作副本、尝试记录与当前状态随本任务保留。"}</p>
    </> : <div className="tc-empty">本任务尚未打开判断与核对工作区。</div>}
    {onOpenCode && <button className="tc-add-code" type="button" onClick={onOpenCode}><IconPlus size={14} />附加代码片段<IconArrowRight size={13} /></button>}
  </section>;
}

function RecordIndex({ records = [], onOpenRecord }) {
  return <section className="tc-section tc-records-section" aria-labelledby="tc-records-title"><div className="tc-section-heading"><h3 id="tc-records-title">现有核对记录</h3><span className="tc-count">{records.length}</span></div>{records.length ? <div className="tc-record-list">{records.map((record, index) => <button className="tc-content-card tc-record-card" type="button" key={record.id || `${record.title || "record"}-${index}`} onClick={() => onOpenRecord?.(record)}><span className="tc-card-icon"><IconFileText size={16} /></span><span className="tc-card-copy"><strong>{record.title || `核对记录 ${index + 1}`}</strong>{record.summary && <small className="tc-record-summary">{record.summary}</small>}<span className="tc-record-meta">{record.time || "本次任务"}{record.isDemo ? " · 示例记录" : ""}</span></span><IconArrowRight className="tc-card-arrow" size={14} /></button>)}</div> : <div className="tc-empty">尚无核对记录。记录后会在这里保留索引。</div>}<p className="tc-retention-note">打开已有记录查看原内容，保留原来的来源和适用范围。</p></section>;
}

export function TaskContents({ open, onClose, flow, records = [], onOpenFlow, onOpenRecord, onOpenCode, onUndoArchive }) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const controls = () => [...(panelRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]') || [])].filter((element) => element.getClientRects().length);
    (panelRef.current?.querySelector("[data-tc-initial-focus]") || controls()[0] || panelRef.current)?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeRef.current?.(); return; }
      if (event.key !== "Tab") return;
      const elements = controls();
      if (!elements.length) { event.preventDefault(); panelRef.current?.focus(); return; }
      const outside = !panelRef.current?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === elements[0] || outside)) { event.preventDefault(); elements.at(-1).focus(); }
      else if (!event.shiftKey && (document.activeElement === elements.at(-1) || outside)) { event.preventDefault(); elements[0].focus(); }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(<div className="tc-overlay" onClick={(event) => { if (event.target === event.currentTarget) onClose?.(); }}><aside className="tc-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex={-1}><header className="tc-header"><div className="tc-title-row"><IconFiles size={18} /><h2 id={titleId}>本任务内容</h2><button className="tc-close" data-tc-initial-focus type="button" onClick={onClose} aria-label="关闭本任务内容"><IconX size={18} /></button></div><p id={descriptionId}>查看、恢复本任务中的工作内容与核对记录。</p></header><div className="tc-scroll"><FlowIndex flow={flow} onOpenFlow={onOpenFlow} onOpenCode={onOpenCode} onUndoArchive={onUndoArchive} /><RecordIndex records={Array.isArray(records) ? records : []} onOpenRecord={onOpenRecord} /></div><footer className="tc-footer"><IconChevronDown size={13} /><span>示例范围检查仅供核对，根因仍待确认。</span></footer></aside></div>, document.body);
}

export default TaskContents;
