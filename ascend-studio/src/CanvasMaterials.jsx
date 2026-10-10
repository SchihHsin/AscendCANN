import { useEffect, useId, useMemo, useState } from "react";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconBook,
  IconCheck,
  IconChevronDown,
  IconClipboardCheck,
  IconCode,
  IconColumns2,
  IconCopy,
  IconHistory,
  IconLoader2,
  IconPaperclip,
  IconRestore,
  IconX,
} from "@tabler/icons-react";
import { SAMPLE_ORIGINAL_CODE } from "./useTaskFlow.js";
import "./canvas-materials.css";

function buildDiff(before, after) {
  const left = String(before || "").split("\n");
  const right = String(after || "").split("\n");
  if (left.length * right.length > 250000) return [...left.map((text) => ({ type: "removed", text })), ...right.map((text) => ({ type: "added", text }))];
  const matrix = Array.from({ length: left.length + 1 }, () => new Uint32Array(right.length + 1));
  for (let i = left.length - 1; i >= 0; i -= 1) for (let j = right.length - 1; j >= 0; j -= 1) matrix[i][j] = left[i] === right[j] ? matrix[i + 1][j + 1] + 1 : Math.max(matrix[i + 1][j], matrix[i][j + 1]);
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

const boundsLabel = (value) => value === "valid" ? "仅有效元素" : "整块访问";
const modeLabel = (value) => value === "isolated" ? "隔离示例副本" : "任务内示例副本";
const attemptShape = (attempt) => `[${attempt?.rows ?? attempt?.snapshot?.rows ?? "—"},${attempt?.columns ?? attempt?.snapshot?.columns ?? "—"}]`;

function useCopy(resetVersion) {
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => { setMessage(""); setFailed(false); }, [resetVersion]);
  const copy = async (value) => {
    try { await navigator.clipboard.writeText(String(value || "")); setMessage("代码已复制。"); setFailed(false); }
    catch { setMessage("当前无法访问剪贴板，可直接选中代码复制。"); setFailed(true); }
  };
  return { copy, message, failed, clear: () => { setMessage(""); setFailed(false); } };
}

function CopyFeedback({ feedback }) {
  return feedback.message ? <p className={"cm-copy-message" + (feedback.failed ? " is-error" : "")} role={feedback.failed ? "alert" : "status"}>{feedback.message}</p> : null;
}

function LocalError({ state }) {
  return state.error ? <div className="cm-error" role="alert"><IconAlertTriangle size={14} /><span>{state.error}</span></div> : null;
}

function CodeBlock({ children, label }) {
  return <pre className="cm-code" tabIndex={0} aria-label={label}><code>{children}</code></pre>;
}

function EvidenceMaterial({ onShowCard }) {
  return <div className="cm-stack"><div className="cm-meta-line"><span>来源：本题诊断记录</span><span className="cm-tag">根因待确认</span></div><div className="cm-evidence-facts"><div><IconCheck size={15} /><span><strong>[16,32] 通过</strong><small>已记录的对照输入</small></span></div><div><IconAlertTriangle size={15} /><span><strong>[17,33] 失败</strong><small>失败与非整块输入同时出现</small></span></div><div><IconCode size={15} /><span><strong>precision mismatch</strong><small>custom_op.cpp:128</small></span></div><div><IconHistory size={15} /><span><strong>编译参数已调整</strong><small>错误位置未变，未带来新的定位信号</small></span></div></div><p className="cm-body-copy">尾块边界值得优先核对。目前仍需对照实际循环、逐元素误差和两次运行的环境条件，根因尚未确认。</p><div className="cm-actions"><button className="cm-button" type="button" onClick={() => onShowCard?.("explanation")}><IconBook size={14} />解释并试改</button><button className="cm-button" type="button" onClick={() => onShowCard?.("source")}><IconCode size={14} />只读核对</button><button className="cm-text-button" type="button" onClick={() => onShowCard?.("precision")}>误差核对<IconArrowRight size={13} /></button></div><p className="cm-note">这里只索引已有记录，尚无真实项目或 NPU 的新增验证结果。</p></div>;
}

function ExplanationMaterial({ onShowCard }) {
  return <div className="cm-stack">
    <div className="cm-meta-line"><span>依据：本题诊断记录与范围来源示例</span><span className="cm-tag">解释线索</span></div>
    <p className="cm-body-copy">现有记录中 <strong>[16,32] 通过、[17,33] 失败</strong>，调整编译参数后，错误位置仍在 <code>custom_op.cpp:128</code>。尾块处理值得优先核对，根因尚未确认。</p>
    <div className="cm-shape-comparison"><div><span>[16,32]</span><strong>512 个元素</strong><small>每块 32 → 16 个完整块</small></div><div><span>[17,33]</span><strong>561 个元素</strong><small>每块 32 → 17 个完整块 + 尾块 17</small></div></div>
    <p className="cm-body-copy">在范围来源示例中，最后一块也按 32 个元素处理，会涉及 <strong>15 个范围外索引</strong>。这个算例解释了需要核对的边界；实际循环、精度和环境仍需补充证据。</p>
    <div className="cm-quiet-note"><IconBook size={15} /><span>来源与草案可以直接并排对照。需要同时整理多份材料和关系时，再打开画布。</span></div>
    <div className="cm-actions"><button className="cm-button" type="button" onClick={() => onShowCard?.("source")}><IconCode size={14} />查看来源</button><button className="cm-button" type="button" onClick={() => onShowCard?.("draft")}>打开示例草案<IconArrowRight size={14} /></button><button className="cm-text-button" type="button" onClick={() => onShowCard?.("reference")}><IconBook size={13} />打开官方参考</button></div>
  </div>;
}

function SourceMaterial({ flow, onShowCard, onAttachCode }) {
  const attachment = flow.sourceAttachment || flow.codeAttachment || null;
  const text = typeof attachment?.content === "string" ? attachment.content : SAMPLE_ORIGINAL_CODE;
  const feedback = useCopy(flow.state.resetVersion);
  return <div className="cm-stack">
    <div className="cm-meta-line"><span>{attachment?.name || "custom_op.cpp:128 · 范围来源示例"}</span><span className="cm-tag">{attachment ? "用户提供 · 只读" : "来源示例 · 只读"}</span></div>
    <CodeBlock label={attachment ? "用户提供的只读代码" : "只读来源示例"}>{text}</CodeBlock>
    <p className="cm-note">{attachment ? "保留你提供的代码作为核对证据。试改使用独立示例工作副本，未运行附件代码。" : "来源示例用于对照索引范围，不代表真实项目文件。示例草案和真实来源分别保留。"}</p>
    <div className="cm-actions"><button className="cm-text-button" type="button" onClick={() => feedback.copy(text)}><IconCopy size={13} />复制来源</button><button className="cm-text-button" type="button" onClick={() => onShowCard?.("explanation")}><IconBook size={13} />解释这里</button>{onAttachCode && <button className="cm-text-button" type="button" onClick={onAttachCode}><IconPaperclip size={13} />附加真实代码</button>}</div>
    <CopyFeedback feedback={feedback} />
  </div>;
}

function DraftMaterial({ flow, onShowCard, onAttachCode }) {
  const { state, actions } = flow;
  const feedback = useCopy(state.resetVersion);
  return <div className="cm-stack">
    <div className="cm-mode-selector" role="group" aria-label="示例草案位置"><button className={state.mode === "inline" ? "is-selected" : ""} type="button" aria-pressed={state.mode === "inline"} disabled={state.busy} onClick={() => actions.setMode("inline")}>任务内示例副本</button><button className={state.mode === "isolated" ? "is-selected" : ""} type="button" aria-pressed={state.mode === "isolated"} disabled={state.busy} onClick={() => actions.setMode("isolated")}>隔离示例副本</button></div>
    <div className="cm-meta-line"><span>{modeLabel(state.mode)} · 可编辑</span><button className="cm-text-button" type="button" onClick={() => onShowCard?.("compare")}><IconColumns2 size={13} />并排对照来源</button></div>
    <textarea className="cm-code-editor" value={state.draftCode || ""} spellCheck={false} aria-label="编辑当前示例代码草案" onChange={(event) => { actions.editDraft(event.target.value); feedback.clear(); }} />
    <p className="cm-note">来源：只读范围示例的工作副本。两种副本分别保留参数和草案。范围演算由参数与范围策略决定，不解析、编译或执行编辑的 C++。</p>
    <div className="cm-actions"><button className="cm-text-button" type="button" onClick={() => feedback.copy(state.draftCode)}><IconCopy size={13} />复制草案</button>{onAttachCode && <button className="cm-text-button" type="button" onClick={onAttachCode}><IconPaperclip size={13} />附加核对证据</button>}<button className="cm-button" type="button" onClick={() => onShowCard?.("parameters")}>打开尝试参数<IconArrowRight size={14} /></button></div>
    <CopyFeedback feedback={feedback} />
  </div>;
}

function ParametersMaterial({ flow, onShowCard }) {
  const { state, actions } = flow;
  const radioName = useId();
  return <div className="cm-stack">
    <p className="cm-note cm-note-leading">来源：{modeLabel(state.mode)}的参数演算。运行后会保留本次参数、策略、代码快照和结果。</p>
    <form className="cm-parameter-form" onSubmit={(event) => { event.preventDefault(); actions.runTrial(); }}><div className="cm-parameter-fields"><label>行数<input required type="number" min="1" step="1" value={state.rows} disabled={state.busy} onChange={(event) => actions.setParameter("rows", event.target.value)} /></label><label>列数<input required type="number" min="1" step="1" value={state.columns} disabled={state.busy} onChange={(event) => actions.setParameter("columns", event.target.value)} /></label><label>每块元素<input required type="number" min="1" step="1" value={state.tileSize} disabled={state.busy} onChange={(event) => actions.setParameter("tileSize", event.target.value)} /></label></div>
      <fieldset className="cm-bounds"><legend>示例范围策略</legend><label><input type="radio" name={radioName} checked={state.bounds === "full"} disabled={state.busy} onChange={() => actions.setBounds("full")} /><span>整块访问<small>每块按相同大小处理</small></span></label><label><input type="radio" name={radioName} checked={state.bounds === "valid"} disabled={state.busy} onChange={() => actions.setBounds("valid")} /><span>仅有效元素<small>最后一块按剩余数量处理</small></span></label></fieldset>
      <button className="cm-button cm-button-primary" type="submit" disabled={state.busy}>{state.busy ? <IconLoader2 className="cm-spinner" size={14} /> : <IconCode size={14} />}{state.busy ? "正在演算" : "运行范围算例"}</button>
    </form>
    <p className="cm-note">仅浏览器索引范围演算，真实项目根因与 NPU 运行仍待验证。</p>
    {state.attempts?.length > 0 && <button className="cm-text-button" type="button" onClick={() => onShowCard?.("attempts")}><IconHistory size={13} />查看已有 {state.attempts.length} 次尝试</button>}
    <LocalError state={state} />
  </div>;
}

function AttemptMetadata({ attempt }) {
  return <div className="cm-attempt-metadata"><span>当时输入 {attemptShape(attempt)}</span><span>每块 {attempt.tileSize ?? attempt.snapshot?.tileSize ?? "—"}</span><span>{boundsLabel(attempt.bounds ?? attempt.snapshot?.bounds)}</span><span>{modeLabel(attempt.mode ?? attempt.snapshot?.mode)}</span><span>{attempt.time || "本次会话"}</span></div>;
}

function AttemptResult({ attempt, compact = false }) {
  if (!attempt) return null;
  return <div className={"cm-attempt-result" + (compact ? " is-compact" : "")}><div className={"cm-outcome" + (attempt.passed ? " is-pass" : "")} >{attempt.passed ? <IconCheck size={14} /> : <IconAlertTriangle size={14} />}<strong>{attempt.passed ? "示例索引在范围内" : "示例存在范围外索引"}</strong><span>浏览器算例</span></div><AttemptMetadata attempt={attempt} /><p className="cm-body-copy">{attempt.result}</p><dl className="cm-stat-grid"><div><dt>总元素 / 总块数</dt><dd>{attempt.total ?? "—"} / {attempt.blocks ?? "—"}</dd></div><div><dt>尾块有效元素</dt><dd>{attempt.tail ?? "—"}</dd></div><div><dt>最大访问索引</dt><dd>{attempt.maxIndex ?? "—"}</dd></div><div><dt>范围外索引数</dt><dd>{attempt.outOfRange ?? "—"}</dd></div></dl>{!compact && <p className="cm-note">结果对应上方保存的参数与策略，未编译 C++，未检查实际算子精度。</p>}</div>;
}

function AttemptsMaterial({ flow, onShowCard }) {
  const { state, actions } = flow;
  const attempts = Array.isArray(state.attempts) ? state.attempts : [];
  const selected = attempts.find((attempt) => attempt.id === state.selectedAttemptId) || attempts.at(-1);
  const current = selected && ["rows", "columns", "tileSize", "bounds", "mode"].every((name) => String(selected[name] ?? selected.snapshot?.[name]) === String(state[name])) && selected.code === state.draftCode;
  const cancelledHistory = state.diffHistory || state.proposalHistory || [];
  if (!selected) return <div className="cm-stack"><div className="cm-empty">还没有范围尝试。运行一次后，这里会保留当时的输入、代码和结果。</div><button className="cm-button" type="button" onClick={() => onShowCard?.("parameters")}>打开参数<IconArrowRight size={14} /></button></div>;
  return <div className="cm-stack"><label className="cm-history-select"><span>查看保存的尝试</span><select value={selected.id} disabled={state.busy} onChange={(event) => actions.selectAttempt(event.target.value)}>{[...attempts].reverse().map((attempt) => <option key={attempt.id} value={attempt.id}>{attempt.time} · {attemptShape(attempt)} · {boundsLabel(attempt.bounds)} · {modeLabel(attempt.mode)}</option>)}</select></label>
    <AttemptResult attempt={selected} />
    {!current && <div className="cm-quiet-note"><IconHistory size={15} /><span>正在查看已有尝试的快照。当前草案、参数或副本方式已变化，可再次运行生成新记录。</span></div>}
    <details className="cm-code-snapshot"><summary><IconCode size={14} />查看这次尝试的代码快照<IconChevronDown size={13} /></summary><CodeBlock label="所选尝试保存的只读代码">{selected.code || "此记录没有保存代码。"}</CodeBlock></details>
    <div className="cm-actions"><button className="cm-button" type="button" disabled={state.busy} onClick={() => onShowCard?.("diff")}>核对此次尝试的修改<IconArrowRight size={14} /></button><button className="cm-text-button" type="button" onClick={() => onShowCard?.("draft")}>查看当前草案</button></div>
    {attempts.length > 1 && <details className="cm-history"><summary><IconHistory size={14} />全部尝试历史 <small>{attempts.length} 条</small><IconChevronDown size={13} /></summary><div>{[...attempts].reverse().map((attempt) => <button className={"cm-history-row" + (attempt.id === selected.id ? " is-selected" : "")} type="button" key={attempt.id} disabled={state.busy} onClick={() => actions.selectAttempt(attempt.id)}><span><strong>{attemptShape(attempt)} · {boundsLabel(attempt.bounds)}</strong><small>{attempt.time} · {modeLabel(attempt.mode)} · 范围外 {attempt.outOfRange} 个索引</small></span>{attempt.id === selected.id ? <IconCheck size={14} /> : <IconArrowRight size={13} />}</button>)}</div></details>}
    {Array.isArray(cancelledHistory) && cancelledHistory.length > 0 && <details className="cm-history"><summary><IconHistory size={14} />提案操作历史 <small>{cancelledHistory.length} 条</small><IconChevronDown size={13} /></summary><div className="cm-proposal-history">{[...cancelledHistory].reverse().map((item, index) => <div key={item.id || index}><strong>{item.title || (item.status === "cancelled" ? "已取消示例提案" : "示例提案记录")}</strong><span>{item.time || "本次会话"}{item.summary ? ` · ${item.summary}` : ""}</span>{item.code && <details className="cm-code-snapshot"><summary>查看保留的提案快照<IconChevronDown size={13} /></summary><CodeBlock label="提案历史保存的只读代码">{item.code}</CodeBlock></details>}</div>)}</div></details>}
  </div>;
}

function DiffMaterial({ flow, onShowCard }) {
  const { state, actions } = flow;
  const attempts = Array.isArray(state.attempts) ? state.attempts : [];
  const selected = attempts.find((attempt) => attempt.id === state.selectedAttemptId) || attempts.at(-1);
  const baseline = state.proposalBaseline || state.appliedCode || SAMPLE_ORIGINAL_CODE;
  const proposed = state.proposedCode;
  const lines = useMemo(() => proposed ? buildDiff(baseline, proposed) : [], [baseline, proposed]);
  const hasChanges = Boolean(proposed) && lines.some((line) => line.type !== "same");
  const alreadyApplied = Boolean(proposed) && proposed === state.appliedCode;
  const feedback = useCopy(state.resetVersion);
  const cancel = () => { actions.cancelDiff(); onShowCard?.("draft", { close: "diff" }); };
  if (!proposed) return <div className="cm-stack"><div className="cm-empty">尚无待核对的示例提案。先选择一次尝试，再生成修改预览。</div><button className="cm-button" type="button" onClick={() => onShowCard?.("attempts")}>查看尝试记录<IconArrowRight size={14} /></button><LocalError state={state} /></div>;
  return <div className="cm-stack"><p className="cm-note cm-note-leading">对照{baseline === SAMPLE_ORIGINAL_CODE ? "原始范围示例" : "上次已应用的示例副本"}与所选尝试生成的提案。真实来源保持只读。</p>
    {selected && <AttemptMetadata attempt={selected} />}
    {!hasChanges && <div className="cm-quiet-note"><IconCode size={15} /><span>当前提案没有新增改动，应用已禁用。可以回到草案，调整范围策略后再运行。</span></div>}
    <div className="cm-diff-legend"><span>− 删除行</span><span>+ 新增行</span><button className="cm-text-button" type="button" onClick={() => feedback.copy(proposed)}><IconCopy size={13} />复制提案</button></div>
    <div className="cm-diff" tabIndex={0} aria-label="示例工作副本与提案的代码差异">{lines.map((line, index) => <div className={"cm-diff-line is-" + line.type} key={index}><span aria-hidden="true">{line.type === "removed" ? "−" : line.type === "added" ? "+" : " "}</span><code>{line.text || " "}</code></div>)}</div>
    <details className="cm-code-snapshot"><summary><IconCode size={14} />查看原始 / 已应用示例<IconChevronDown size={13} /></summary><CodeBlock label="此次差异的只读基准代码">{baseline}</CodeBlock></details>
    {selected && <AttemptResult attempt={selected} compact />}
    <p className="cm-note">提案依据保存的参数和范围策略生成；手工代码、精度和实际环境仍需另外核对。</p>
    <div className="cm-actions"><button className="cm-button cm-button-primary" type="button" disabled={state.busy || !hasChanges || alreadyApplied} onClick={() => { actions.confirmApply(); onShowCard?.("validation"); }}><IconCheck size={14} />{alreadyApplied ? "此提案已应用" : "应用到示例工作副本"}</button><button className="cm-button" type="button" disabled={state.busy} onClick={cancel}><IconX size={14} />取消提案</button></div>
    <p className="cm-note">取消只关闭此预览，草案和尝试记录继续保留，可重新生成修改预览。</p>
    <CopyFeedback feedback={feedback} /><LocalError state={state} />
  </div>;
}

function ValidationMaterial({ flow, onShowCard }) {
  const { state, actions } = flow;
  const validation = state.validation;
  const appliedAttempt = state.attempts?.find((attempt) => attempt.id === state.appliedAttemptId);
  return <div className="cm-stack"><ol className="cm-validation-layers"><li><span className={"cm-layer-icon" + (!state.appliedCode ? " is-pending" : "")}>{state.appliedCode ? <IconCheck size={14} /> : <IconCode size={14} />}</span><div><strong>{state.appliedCode ? "示例工作副本已更新" : "示例修改尚未应用"}</strong><p>{state.appliedCode ? "保留对应提案、代码与尝试快照。" : "核对 Diff 并确认应用后，再检查范围。"}</p></div><em>{state.appliedCode ? "已应用" : "待应用"}</em></li><li><span className="cm-layer-icon"><IconClipboardCheck size={14} /></span><div><strong>示例索引范围</strong><p>对照 [16,32] 与应用时的输入形状。</p></div><em>{validation ? validation.passed ? "范围内" : "待复核" : "待检查"}</em></li><li><span className="cm-layer-icon is-pending"><IconAlertTriangle size={14} /></span><div><strong>真实项目与 NPU 验证</strong><p>仍需真实代码、环境、精度和运行证据。</p></div><em>待验证</em></li></ol>
    {appliedAttempt && <AttemptMetadata attempt={appliedAttempt} />}
    <button className="cm-button cm-button-primary" type="button" disabled={state.busy || !state.appliedCode} onClick={actions.runValidation}>{state.busy ? <IconLoader2 className="cm-spinner" size={14} /> : <IconClipboardCheck size={14} />}{state.busy ? "正在复核" : "重新检查示例范围"}</button>
    {!state.appliedCode && <button className="cm-text-button" type="button" onClick={() => onShowCard?.("diff")}>查看修改预览<IconArrowRight size={13} /></button>}
    {validation && <div className="cm-validation-result"><div className="cm-meta-line"><strong>保存的范围复核</strong><span>{validation.time}</span></div><p className="cm-body-copy">{validation.summary}</p><div className="cm-validation-checks">{(validation.checks || []).map((check, index) => <div key={`${check.label}-${index}`}><span><strong>{check.label}</strong><small>元素 {check.total} · 尾块 {check.tail}</small></span><span><strong>{check.passed ? "示例范围内" : "范围待复核"}</strong><small>范围外 {check.outOfRange} 个索引</small></span></div>)}</div><p className="cm-note">结果仅针对浏览器范围演算，未编译或运行 C++，未验证实际算子精度，根因尚未确认。</p></div>}
    {state.appliedCode && <details className="cm-code-snapshot"><summary><IconCode size={14} />已应用的示例代码快照<IconChevronDown size={13} /></summary><CodeBlock label="已应用示例代码，只读">{state.appliedCode}</CodeBlock></details>}
    <div className="cm-actions"><button className="cm-text-button" type="button" onClick={() => onShowCard?.("draft")}>查看当前草案<IconArrowRight size={13} /></button><button className="cm-text-button" type="button" disabled={state.busy || !state.canUndoApply} onClick={actions.undoApply}><IconRestore size={13} />撤销上次示例应用</button></div>
    <LocalError state={state} />
  </div>;
}

export function CanvasMaterial({ id, flow, onShowCard, onAttachCode, presentation = "canvas" }) {
  if (!flow?.state || !flow?.actions) return null;
  const props = { flow, onShowCard, onAttachCode };
  return <div className={`cm-material-body cm-material-${id} cm-presentation-${presentation}`}>{
    id === "evidence" ? <EvidenceMaterial {...props} /> :
    id === "explanation" ? <ExplanationMaterial {...props} /> :
    id === "source" ? <SourceMaterial {...props} /> :
    id === "draft" ? <DraftMaterial {...props} /> :
    id === "parameters" ? <ParametersMaterial {...props} /> :
    id === "attempts" ? <AttemptsMaterial {...props} /> :
    id === "diff" ? <DiffMaterial {...props} /> :
    id === "validation" ? <ValidationMaterial {...props} /> : null
  }{presentation === "content" && flow.state.notice && !flow.state.error && <div className="cm-view-status" role="status">{flow.state.notice}</div>}</div>;
}

export default CanvasMaterial;
