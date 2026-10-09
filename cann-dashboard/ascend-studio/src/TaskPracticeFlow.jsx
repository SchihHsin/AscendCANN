import { useEffect, useMemo, useState } from "react";
import {
  IconAlertTriangle,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconBook,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconClipboardCheck,
  IconCode,
  IconColumns2,
  IconCopy,
  IconFileText,
  IconGripVertical,
  IconHistory,
  IconLayoutList,
  IconLoader2,
  IconMinus,
  IconPaperclip,
  IconPin,
  IconPlus,
  IconRestore,
} from "@tabler/icons-react";
import { SAMPLE_ORIGINAL_CODE } from "./useTaskFlow.js";
import "./task-practice-flow.css";

const PHASES = [
  { id: "understand", title: "理解现场" },
  { id: "try", title: "尝试修改" },
  { id: "diff", title: "核对修改" },
  { id: "validate", title: "检查结果" },
];

function buildDiff(before, after) {
  const left = before.split("\n");
  const right = after.split("\n");
  if (left.length * right.length > 250000) return [...left.map((text) => ({ type: "removed", text })), ...right.map((text) => ({ type: "added", text }))];
  const matrix = Array.from({ length: left.length + 1 }, () => new Uint32Array(right.length + 1));
  for (let i = left.length - 1; i >= 0; i -= 1) for (let j = right.length - 1; j >= 0; j -= 1) {
    matrix[i][j] = left[i] === right[j] ? matrix[i + 1][j + 1] + 1 : Math.max(matrix[i + 1][j], matrix[i][j + 1]);
  }
  const lines = [];
  let i = 0;
  let j = 0;
  while (i < left.length || j < right.length) {
    if (i < left.length && j < right.length && left[i] === right[j]) { lines.push({ type: "same", text: left[i] }); i += 1; j += 1; }
    else if (i < left.length && (j === right.length || matrix[i + 1][j] >= matrix[i][j + 1])) { lines.push({ type: "removed", text: left[i] }); i += 1; }
    else { lines.push({ type: "added", text: right[j] }); j += 1; }
  }
  return lines;
}

function shortTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value || "") : date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function TrialResult({ attempt, compact = false }) {
  if (!attempt) return null;
  return <div className={"tpf-trial-result" + (compact ? " is-compact" : "")}>
    <div className="tpf-result-heading"><span className={"tpf-outcome" + (attempt.passed ? " is-pass" : "")}>{attempt.passed ? <IconCheck size={13} /> : <IconAlertTriangle size={13} />}{attempt.passed ? "示例范围内" : "示例存在越界索引"}</span><span>{shortTime(attempt.time)} · 演示算例</span></div>
    <p>{attempt.result}</p>
    <dl className="tpf-stat-grid"><div><dt>总元素 / 总块数</dt><dd>{attempt.total} / {attempt.blocks}</dd></div><div><dt>尾块有效元素</dt><dd>{attempt.tail}</dd></div><div><dt>最大访问索引</dt><dd>{attempt.maxIndex}</dd></div><div><dt>范围外索引数</dt><dd>{attempt.outOfRange}</dd></div></dl>
    {!compact && <div className="tpf-mini-note">仅由本次参数与范围策略演算，未编译或运行 C++，未验证精度。</div>}
  </div>;
}

export function TaskPracticeFlow({ visible = true, flow, onBack, onOpenContents, onAttachCode }) {
  const { state, actions } = flow;
  const [scale, setScale] = useState(100);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [dragging, setDragging] = useState(null);
  const [orders, setOrders] = useState({ understand: ["explanation", "source"], try: ["editor", "parameters"] });
  useEffect(() => {
    setScale(100);
    setCopied(false);
    setCopyError("");
    setDragging(null);
    setOrders({ understand: ["explanation", "source"], try: ["editor", "parameters"] });
  }, [state.resetVersion]);
  const selectedAttempt = state.attempts.find((attempt) => attempt.id === state.selectedAttemptId) || state.attempts.at(-1) || null;
  const olderAttempts = state.attempts.filter((attempt) => attempt.id !== selectedAttempt?.id);
  const baseline = state.appliedCode || SAMPLE_ORIGINAL_CODE;
  const attemptIsCurrent = selectedAttempt && ["rows", "columns", "tileSize", "bounds", "mode"].every((key) => String(selectedAttempt[key]) === String(state[key]));
  const diffLines = useMemo(() => buildDiff(baseline, state.proposedCode || ""), [baseline, state.proposedCode]);

  const hasDiffChanges = diffLines.some((line) => line.type !== "same");

  const copyCode = async (text) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setCopyError(""); }
    catch { setCopyError("当前无法访问剪贴板，可直接选中代码复制。"); }
  };

  const moveMaterial = (phase, id, destination) => {
    setOrders((current) => {
      const next = [...current[phase]];
      const from = next.indexOf(id);
      if (from < 0 || destination < 0 || destination >= next.length) return current;
      next.splice(from, 1);
      next.splice(destination, 0, id);
      return { ...current, [phase]: next };
    });
    setDragging(null);
  };

  const material = (phase, id, title, contents) => {
    const position = orders[phase].indexOf(id);
    return <section key={id} className={"tpf-material" + (dragging?.phase === phase && dragging?.id === id ? " is-dragging" : "")} onDragOver={(event) => { if (dragging?.phase === phase) event.preventDefault(); }} onDrop={(event) => {
      if (dragging?.phase !== phase) return;
      event.preventDefault();
      moveMaterial(phase, dragging.id, position);
    }}>
      <header className="tpf-material-heading"><button className="tpf-grip" type="button" draggable aria-label={`拖动${title}换位；也可使用右侧上移下移按钮`} title="拖动材料换位" onDragStart={(event) => { event.dataTransfer.setData("text/plain", `${phase}:${id}`); event.dataTransfer.effectAllowed = "move"; setDragging({ phase, id }); }} onDragEnd={() => setDragging(null)}><IconGripVertical size={14} /></button><h3>{title}</h3><div className="tpf-material-actions"><button type="button" aria-label={`将${title}上移`} title="上移" disabled={position === 0} onClick={() => moveMaterial(phase, id, position - 1)}><IconArrowUp size={13} /></button><button type="button" aria-label={`将${title}下移`} title="下移" disabled={position === orders[phase].length - 1} onClick={() => moveMaterial(phase, id, position + 1)}><IconArrowDown size={13} /></button></div></header>
      <div className="tpf-material-body">{contents}</div>
    </section>;
  };

  const codeEditor = () => <div className={state.compare ? "tpf-code-pair" : "tpf-code-single"}>
    {state.compare && <div><div className="tpf-code-label">原始示例 · 只读</div><pre className="tpf-code"><code>{SAMPLE_ORIGINAL_CODE}</code></pre></div>}
    <div><div className="tpf-code-label"><span>{state.compare ? "当前草案 · 可编辑" : "当前示例草案 · 可编辑"}</span><button className="tpf-text-action" type="button" onClick={() => copyCode(state.draftCode)}><IconCopy size={12} />{copied ? "已复制" : "复制"}</button></div><textarea className="tpf-code-editor" value={state.draftCode} spellCheck={false} aria-label="编辑示例代码草案" onChange={(event) => { actions.editDraft(event.target.value); setCopied(false); }} /></div>
  </div>;

  const explainMaterial = <>
    {state.explanationOpen ? <div className="tpf-explanation"><p>现有记录中 <strong>[16,32] 通过、[17,33] 失败</strong>，且调整编译参数后错误位置仍在 <code>custom_op.cpp:128</code>。这让尾块处理值得检查，根因仍未确认。</p><div className="tpf-range-explain"><div><span>[16,32]</span><strong>512 个元素</strong><small>每块 32 → 16 个完整块</small></div><div><span>[17,33]</span><strong>561 个元素</strong><small>每块 32 → 17 个完整块 + 尾块 17</small></div></div><p>若示例把最后一块也按 32 个元素处理，会涉及 <strong>15 个范围外索引</strong>；这只是演示代码的范围算例，不能由此确认实际项目的问题。</p><p className="tpf-mini-note">下面从同一现场解释到试改，再核对差异与检查结果。精度、环境和实际循环仍需补充证据。</p></div> : <button className="tpf-text-action" type="button" onClick={actions.toggleExplanation}><IconBook size={14} />展开就地解释</button>}
    <button className="tpf-button tpf-button-neutral" type="button" onClick={() => actions.open("try")}>在当前任务尝试修改<IconArrowRight size={14} /></button>
  </>;

  const sourceMaterial = <><div className="tpf-code-label"><span>custom_op.cpp:128 · 范围示例</span><button className="tpf-text-action" type="button" onClick={() => copyCode(SAMPLE_ORIGINAL_CODE)}><IconCopy size={12} />复制</button></div>{state.compare ? codeEditor() : <pre className="tpf-code"><code>{SAMPLE_ORIGINAL_CODE}</code></pre>}<p className="tpf-mini-note">用于对照索引范围的示例，不代表真实项目文件。</p><button className="tpf-text-action" type="button" onClick={onAttachCode}><IconPaperclip size={13} />附加当前任务的真实代码片段</button></>;

  const editorMaterial = <>{codeEditor()}<p className="tpf-mini-note">草案可编辑；范围演算由参数与范围策略决定，不解析或编译代码文本。</p><button className="tpf-text-action" type="button" onClick={onAttachCode}><IconPaperclip size={13} />附加代码作为核对证据</button></>;

  const parameterMaterial = <><div className="tpf-parameter-fields"><label>行数<input type="number" min="1" step="1" value={state.rows} onChange={(event) => actions.setParameter("rows", event.target.value)} /></label><label>列数<input type="number" min="1" step="1" value={state.columns} onChange={(event) => actions.setParameter("columns", event.target.value)} /></label><label>每块元素<input type="number" min="1" step="1" value={state.tileSize} onChange={(event) => actions.setParameter("tileSize", event.target.value)} /></label></div><fieldset className="tpf-bounds"><legend>示例范围策略</legend><label><input type="radio" name="tpf-bounds" value="full" checked={state.bounds === "full"} onChange={() => actions.setBounds("full")} /><span>整块访问<small>每块按相同大小处理</small></span></label><label><input type="radio" name="tpf-bounds" value="valid" checked={state.bounds === "valid"} onChange={() => actions.setBounds("valid")} /><span>仅有效元素<small>最后一块按剩余数量处理</small></span></label></fieldset><button className="tpf-button tpf-button-primary" type="button" disabled={state.busy} onClick={actions.runTrial}>{state.busy ? <IconLoader2 className="tpf-spinner" size={14} /> : <IconCode size={14} />}运行范围算例</button></>;

  return <aside className="task-practice-flow" hidden={!visible} aria-label="当前任务的理解、试改与验证" style={{ "--tpf-scale": scale / 100 }}>
    <div className="diagnostic-scroll tpf-scroll">
      <header className="panel-header tpf-header"><div><h2>从判断到验证</h2><span>AddCustom 精度异常</span></div><div className="tpf-header-links"><button type="button" onClick={onBack}><IconArrowLeft size={13} />返回诊断</button><button type="button" onClick={onOpenContents}><IconLayoutList size={13} />本任务内容</button></div></header>
      <nav className="tpf-stepper" aria-label="本次任务流程">{PHASES.map((phase, index) => <button key={phase.id} type="button" className={state.phase === phase.id ? "is-current" : ""} aria-current={state.phase === phase.id ? "step" : undefined} disabled={state.busy || phase.id === "diff" && !selectedAttempt || phase.id === "validate" && !state.appliedCode} onClick={() => phase.id === "diff" && !state.proposedCode ? actions.prepareDiff() : actions.open(phase.id)}><span>{index + 1}</span>{phase.title}</button>)}</nav>
      <div className="tpf-toolbar" aria-label="内容查看工具"><div><button type="button" className={state.explanationOpen ? "is-active" : ""} aria-pressed={state.explanationOpen} onClick={actions.toggleExplanation} title="就地解释"><IconBook size={14} /><span>解释</span></button><button type="button" className={state.pinned ? "is-active" : ""} aria-pressed={state.pinned} onClick={actions.togglePin} title="固定现场依据"><IconPin size={14} /><span>固定</span></button><button type="button" className={state.compare ? "is-active" : ""} aria-pressed={state.compare} onClick={actions.toggleCompare} title="并排对照原始示例与草案"><IconColumns2 size={14} /><span>对照</span></button><button type="button" aria-expanded={!state.collapsed} onClick={actions.toggleCollapse}>{state.collapsed ? <IconChevronRight size={14} /> : <IconChevronDown size={14} />}<span>{state.collapsed ? "展开" : "收起"}</span></button></div><div className="tpf-zoom"><button type="button" aria-label="缩小内容" title="缩小内容" disabled={scale <= 90} onClick={() => setScale((value) => Math.max(90, value - 10))}><IconMinus size={12} /></button><button type="button" title="还原阅读尺寸" onClick={() => setScale(100)}>{scale}%</button><button type="button" aria-label="放大内容" title="放大内容" disabled={scale >= 110} onClick={() => setScale((value) => Math.min(110, value + 10))}><IconPlus size={12} /></button></div></div>
      <div className="tpf-boundary"><IconAlertTriangle size={14} /><span>尾块只是排查线索 · 实际项目根因尚未确认</span></div>

      {state.archived && <div className="tpf-archived"><IconFileText size={15} /><div><strong>已收纳到本任务内容</strong><span>当前草案、尝试与检查记录仍保留。</span></div><button type="button" onClick={actions.restore}><IconRestore size={13} />继续查看</button></div>}
      {state.pinned && <div className="tpf-pinned"><div><IconPin size={13} /><strong>固定的现场依据</strong></div><p>[16,32] 通过 · [17,33] 失败</p><p>precision mismatch · custom_op.cpp:128</p><span>编译参数调整后错误位置未变 · 待 NPU 验证</span></div>}

      {state.collapsed ? <div className="tpf-collapsed"><IconFileText size={16} /><div><strong>{PHASES.find((phase) => phase.id === state.phase)?.title}已收起</strong><p>已保留 {state.attempts.length} 次尝试、代码草案与当前流程阶段。</p></div><button className="tpf-text-action" type="button" onClick={actions.toggleCollapse}>展开</button></div> : <div className="tpf-body">
        {state.phase === "understand" && <div className="tpf-material-stack">{orders.understand.map((id) => id === "explanation" ? material("understand", id, "就地理解当前线索", explainMaterial) : material("understand", id, "与代码范围对照", sourceMaterial))}</div>}

        {state.phase === "try" && <>
          <div className="tpf-mode-line"><span>试改位置</span><div><button type="button" className={state.mode === "inline" ? "is-selected" : ""} aria-pressed={state.mode === "inline"} onClick={() => actions.setMode("inline")}>当前任务内</button><button type="button" className={state.mode === "isolated" ? "is-selected" : ""} aria-pressed={state.mode === "isolated"} onClick={() => actions.setMode("isolated")}>隔离示例副本</button></div></div><p className="tpf-mini-note">两种方式均保留本任务现场，仅编辑示例草案；按需选用隔离副本。</p>
          {state.explanationOpen && <div className="tpf-inline-explanation"><IconBook size={14} /><span>对比“整块访问”与“仅有效元素”，先判断示例索引范围能否覆盖尾块。参数驱动范围演算；手工草案独立保留。</span></div>}
          <div className="tpf-material-stack">{orders.try.map((id) => id === "editor" ? material("try", id, "修改示例草案", editorMaterial) : material("try", id, "尝试参数与范围策略", parameterMaterial))}</div>
          {selectedAttempt && <section className="tpf-attempt-section"><div className="tpf-section-heading"><h3>所选尝试的检查结果</h3><span>[{selectedAttempt.rows},{selectedAttempt.columns}] · {selectedAttempt.bounds === "valid" ? "仅有效元素" : "整块访问"}<br />{selectedAttempt.mode === "isolated" ? "隔离示例副本" : "当前任务内"}</span></div><TrialResult attempt={selectedAttempt} />
            <p className="tpf-mini-note">来源：{selectedAttempt.mode === "isolated" ? "隔离示例副本" : "当前任务内"} · 每块 {selectedAttempt.tileSize} 个元素。{!attemptIsCurrent && "当前参数或方式已变化，请运行算例生成新结果。"}</p>
            <details className="tpf-applied-code"><summary><IconCode size={14} />查看这次尝试保存的代码<IconChevronDown size={13} /></summary><pre className="tpf-code"><code>{selectedAttempt.code}</code></pre></details><button className="tpf-button tpf-button-neutral" type="button" disabled={state.busy} onClick={actions.prepareDiff}>核对此次尝试的修改<IconArrowRight size={14} /></button></section>}
          {olderAttempts.length > 0 && <details className="tpf-history"><summary><IconHistory size={14} /><span>之前的尝试</span><small>{olderAttempts.length} 条</small><IconChevronDown size={13} /></summary><div>{olderAttempts.map((attempt) => <div className="tpf-history-row" key={attempt.id}><div><strong>[{attempt.rows},{attempt.columns}] · {attempt.bounds === "valid" ? "仅有效元素" : "整块访问"}</strong><span>{shortTime(attempt.time)} · 范围外 {attempt.outOfRange} 个索引</span></div><button className="tpf-text-action" type="button" disabled={state.busy} onClick={() => actions.selectAttempt(attempt.id)}>查看此尝试</button></div>)}</div></details>}
        </>}

        {state.phase === "diff" && <>
          <div className="tpf-section-heading"><h3>修改预览</h3><span>仅示例工作副本</span></div><p className="tpf-description">对照{state.appliedCode ? "上次已应用的示例代码" : "原始示例代码"}与本次提案；检查结果与差异一同保留。</p>
          {!hasDiffChanges && <p className="tpf-mini-note">没有新增改动。当前提案与示例工作副本一致，可返回选择另一种范围策略再试。</p>}
          <div className="tpf-diff-legend"><span>− 删除行</span><span>+ 新增行</span><button className="tpf-text-action" type="button" onClick={() => copyCode(state.proposedCode || "")}><IconCopy size={12} />复制提案</button></div>
          <div className="tpf-diff" aria-label="原始与提议代码差异">{diffLines.map((line, index) => <div className={"tpf-diff-line is-" + line.type} key={index}><span aria-hidden="true">{line.type === "removed" ? "−" : line.type === "added" ? "+" : " "}</span><code>{line.text || " "}</code></div>)}</div>
          {state.compare && <div className="tpf-diff-pair"><div><span>原始 / 已应用示例</span><pre className="tpf-code"><code>{baseline}</code></pre></div><div><span>本次提案</span><pre className="tpf-code"><code>{state.proposedCode}</code></pre></div></div>}
          {selectedAttempt && <div className="tpf-diff-evidence"><h3>本次提案依据</h3><TrialResult attempt={selectedAttempt} compact /></div>}
          <p className="tpf-mini-note">此差异按选中尝试的参数与范围策略生成，不替代对手工代码、精度或实际环境的核对。</p>
          <div className="tpf-confirm-actions"><button className="tpf-button tpf-button-primary" type="button" disabled={state.busy || !state.proposedCode || !hasDiffChanges} onClick={actions.confirmApply}><IconCheck size={14} />应用到示例工作副本</button><button className="tpf-button tpf-button-neutral" type="button" disabled={state.busy} onClick={actions.cancelDiff}>取消，继续试改</button></div>
          {state.appliedCode && <button className="tpf-text-action tpf-undo" type="button" disabled={state.busy || !state.canUndoApply} onClick={actions.undoApply}><IconRestore size={13} />撤销上次示例应用</button>}
        </>}

        {state.phase === "validate" && <>
          <div className="tpf-section-heading"><h3>分层检查当前结果</h3><span>示例副本</span></div>
          <ol className="tpf-validation-layers"><li><span className={"tpf-layer-icon" + (state.appliedCode ? "" : " is-pending")}>{state.appliedCode ? <IconCheck size={14} /> : <IconCode size={14} />}</span><div><strong>{state.appliedCode ? "修改已应用到示例工作副本" : "修改尚未应用到示例工作副本"}</strong><p>{state.appliedCode ? "保留本次代码差异与尝试快照。" : "先核对差异并确认应用，再检查结果。"}</p></div><em>{state.appliedCode ? "已应用" : "待应用"}</em></li><li><span className="tpf-layer-icon">{state.validation ? <IconClipboardCheck size={14} /> : <IconCode size={14} />}</span><div><strong>重新检查示例索引范围</strong><p>对照 [16,32] 与应用时输入形状。</p></div><em>{state.validation ? state.validation.passed ? "范围内" : "需复核" : "待检查"}</em></li><li><span className="tpf-layer-icon is-pending"><IconAlertTriangle size={14} /></span><div><strong>实际项目与 NPU 验证</strong><p>仍需真实代码、环境、精度与运行证据。</p></div><em>待验证</em></li></ol>
          <button className="tpf-button tpf-button-primary" type="button" disabled={state.busy || !state.appliedCode} onClick={actions.runValidation}>{state.busy ? <IconLoader2 className="tpf-spinner" size={14} /> : <IconClipboardCheck size={14} />}重新检查示例范围</button>
          {state.validation && <section className="tpf-validation-result"><div className="tpf-section-heading"><h3>示例检查结果</h3><span>{shortTime(state.validation.time)}</span></div><p className="tpf-description">{state.validation.summary}</p><div className="tpf-validation-checks">{state.validation.checks.map((check, index) => <div key={`${check.label}-${index}`}><div><strong>{check.label}</strong><span>元素 {check.total} · 尾块 {check.tail}</span></div><div><strong>{check.passed ? "示例范围内" : "范围待复核"}</strong><span>范围外 {check.outOfRange} 个索引</span></div></div>)}</div><p className="tpf-mini-note">上述结果不代表实际算子精度通过或项目已修复。根因尚未确认，待 NPU 验证。</p></section>}
          {state.appliedCode && <details className="tpf-applied-code"><summary><IconCode size={14} />查看已应用的示例代码<IconChevronDown size={13} /></summary><pre className="tpf-code"><code>{state.appliedCode}</code></pre></details>}
          <div className="tpf-confirm-actions"><button className="tpf-button tpf-button-neutral" type="button" onClick={() => actions.open("try")}><IconArrowLeft size={14} />继续核对</button><button className="tpf-button tpf-button-neutral" type="button" onClick={() => { actions.archive(); onBack?.(); }}><IconFileText size={14} />收纳内容并返回诊断</button></div>
          <button className="tpf-text-action tpf-undo" type="button" disabled={state.busy || !state.canUndoApply} onClick={actions.undoApply}><IconRestore size={13} />撤销示例应用</button>
        </>}
      </div>}

      {(state.error || copyError) && <div className="tpf-error" role="alert">{state.error || copyError}</div>}
      <div className="tpf-notice" role="status" aria-live="polite">{state.notice || (copied ? "代码已复制。" : "")}</div>
      <div className="tpf-reset-row"><button className="tpf-text-action" type="button" disabled={state.busy} onClick={() => { actions.reset(); setCopied(false); setCopyError(""); }}><IconRestore size={12} />重置范围示例</button><span>仅浏览器内的示例操作</span></div>
    </div>
  </aside>;
}

export default TaskPracticeFlow;
