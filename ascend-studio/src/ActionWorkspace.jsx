import { useEffect, useRef, useState } from "react";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconChartDots,
  IconCheck,
  IconClipboardCheck,
  IconCode,
  IconBulb,
  IconFiles,
  IconPencil,
  IconLoader2,
  IconPlus,
} from "@tabler/icons-react";
import "./action-workspace.css";

const DEMO_CSV = `index,expected,actual
0,1.25,1.25
1,2.5,2.500001
2,3.75,3.749998
542,1,1.000003
543,1.5,1.5
544,2,2.035
545,2.5,2.548
560,4,4.06`;

const TABS = [
  { id: "code", label: "代码核对", Icon: IconCode },
  { id: "precision", label: "误差分布", Icon: IconChartDots },
  { id: "review", label: "复核记录", Icon: IconClipboardCheck },
];

const REVIEW_CHECKS = [
  "已核对输入形状与实际有效元素数",
  "已记录两次运行的环境与编译条件",
  "已对照循环边界与代码路径",
  "已保留逐元素误差与容差依据",
];

function formatNumber(value) {
  if (value === 0) return "0";
  return Number(value.toPrecision(7)).toString();
}

function parsePrecisionCSV(source, absTolerance, relTolerance) {
  const lines = source.split(/\r?\n/).map((text, index) => ({ text: text.trim(), line: index + 1 })).filter(({ text }) => text);
  if (!lines.length) throw new Error("请粘贴 index,expected,actual 三列数据，或先载入示例。");
  if (lines[0].text.toLowerCase().replace(/\s/g, "") === "index,expected,actual") lines.shift();
  if (!lines.length) throw new Error("表头下还没有数据，请添加至少一行。");
  if (lines.length > 1000) throw new Error("单次最多计算 1000 行，请先截取需要核对的元素。");
  const indices = new Set();
  return lines.map(({ text, line }) => {
    const cells = text.split(",").map((cell) => cell.trim());
    if (cells.length !== 3 || cells.some((cell) => !cell)) throw new Error(`第 ${line} 行需要 index,expected,actual 三个非空数值。`);
    const [index, expected, actual] = cells.map(Number);
    if (![index, expected, actual].every(Number.isFinite)) throw new Error(`第 ${line} 行含有无效数值，请使用有限数字。`);
    if (!Number.isSafeInteger(index) || index < 0) throw new Error(`第 ${line} 行的 index 必须是非负整数。`);
    if (indices.has(index)) throw new Error(`第 ${line} 行的 index ${index} 重复，请保留每个元素的一条记录。`);
    indices.add(index);
    const error = Math.abs(actual - expected);
    const threshold = absTolerance + relTolerance * Math.abs(expected);
    if (!Number.isFinite(error) || !Number.isFinite(threshold)) throw new Error(`第 ${line} 行的计算结果超出数值范围，请检查数据或容差。`);
    return { index, expected, actual, error, threshold, passed: error <= threshold };
  }).sort((a, b) => a.index - b.index);
}

export function ActionWorkspace({ view, onChangeView, onBack, onRecord, codeAttachment = null, onExplain, onTry, onOpenContents, embedded = false, precisionContext = null, onPrecisionContext, rangeContext = null }) {
  const [total, setTotal] = useState("561");
  const [tileSize, setTileSize] = useState("32");
  const [rangeError, setRangeError] = useState("");
  const [rangeResult, setRangeResult] = useState(null);
  const [csv, setCSV] = useState("");
  const [sourceIsDemo, setSourceIsDemo] = useState(false);
  const [absoluteTolerance, setAbsoluteTolerance] = useState("0.00001");
  const [relativeTolerance, setRelativeTolerance] = useState("0.001");
  const [precisionError, setPrecisionError] = useState("");
  const [precisionResult, setPrecisionResult] = useState(null);
  const [checks, setChecks] = useState([]);
  const [observation, setObservation] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewResult, setReviewResult] = useState(null);
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState("");
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { if (embedded && view === "precision") onPrecisionContext?.(precisionResult); }, [precisionResult, embedded, view, onPrecisionContext]);
  const activePrecision = embedded && view === "review" ? precisionContext : precisionResult;
  const activeRange = embedded && view === "review" ? rangeContext : rangeResult;

  const runLocalAction = (kind, action) => {
    setBusy(kind);
    setNotice("");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      action();
      setBusy(null);
    }, 240);
  };

  const record = (value) => {
    onRecord?.(value);
    setNotice("已加入本次任务的复核记录。");
  };

  const calculateRange = (event) => {
    event.preventDefault();
    setRangeError("");
    const count = Number(total);
    const tile = Number(tileSize);
    if (!total.trim() || !tileSize.trim() || !Number.isSafeInteger(count) || !Number.isSafeInteger(tile) || count < 1 || tile < 1) {
      setRangeError("总元素数与每块元素数均需为正整数。");
      return;
    }
    runLocalAction("range", () => {
      setRangeResult({ total: count, tile, full: Math.floor(count / tile), tail: count % tile, blocks: Math.ceil(count / tile), last: count - 1 });
      setNotice("范围算例已更新；请与实际代码的索引规则对照。");
    });
  };

  const loadDemo = () => {
    setCSV(DEMO_CSV);
    setSourceIsDemo(true);
    setPrecisionResult(null);
    setPrecisionError("");
    setNotice("已载入 8 行演示数据，可修改后计算。");
  };

  const calculatePrecision = (event) => {
    event.preventDefault();
    setPrecisionError("");
    const atol = Number(absoluteTolerance);
    const rtol = Number(relativeTolerance);
    if (!absoluteTolerance.trim() || !relativeTolerance.trim() || !Number.isFinite(atol) || !Number.isFinite(rtol) || atol < 0 || rtol < 0) {
      setPrecisionError("绝对容差和相对容差需为有限非负数。");
      return;
    }
    let rows;
    try { rows = parsePrecisionCSV(csv, atol, rtol); }
    catch (error) { setPrecisionError(error.message); setPrecisionResult(null); return; }
    runLocalAction("precision", () => {
      setPrecisionResult({ rows, atol, rtol, isDemo: sourceIsDemo, failed: rows.filter((row) => !row.passed).length });
      setNotice(`已完成 ${rows.length} 个元素的本地误差计算。`);
    });
  };

  const generateReview = (event) => {
    event.preventDefault();
    setReviewError("");
    if (!observation.trim()) {
      setReviewError("请写下观察到的现象或需要继续核对的内容。");
      return;
    }
    runLocalAction("review", () => {
      const pending = REVIEW_CHECKS.filter((_, index) => !checks.includes(index));
      const context = [
        activeRange ? `浏览器范围算例：总元素 ${activeRange.total}，每块 ${activeRange.tile}。` : "范围算例尚未计算。",
        activePrecision ? `${activePrecision.isDemo ? "演示" : "用户提供"}误差数据：${activePrecision.rows.length} 个元素，${activePrecision.failed} 个超差；atol ${activePrecision.atol}，rtol ${activePrecision.rtol}。未独立验证数据来源。` : "逐元素误差尚未计算。",
      ].join("\n");
      const report = {
        title: "AddCustom 精度异常 · 复核记录",
        summary: `${observation.trim()}\n已核对 ${checks.length}/${REVIEW_CHECKS.length} 项。${pending.length ? `待补充：${pending.map((item) => item.replace(/^已/, "")).join("；")}。` : "核对项已记录，但需保留对应证据。"}\n${context}\n根因尚未确认；待 NPU 验证。${activePrecision?.isDemo ? "本记录包含演示误差数据。" : "用户记录尚未独立验证。"}`,
        kind: "review",
        isDemo: Boolean(activeRange || activePrecision?.isDemo),
      };
      setReviewResult(report);
      record(report);
    });
  };

  return (
    <aside className="action-workspace" aria-label="核对与复核操作区" hidden={view === null || !view}>
      <div className="diagnostic-scroll action-workspace-scroll">
        {!embedded && <header className="panel-header action-workspace-header">
          <div><h2>核对工作区</h2><span>在当前任务中补充定位证据</span></div>
          <div className="aw-header-actions">
            {onOpenContents && <button className="aw-contents-button" type="button" onClick={onOpenContents}><IconFiles size={14} />本任务内容</button>}
            <button className="aw-back" type="button" onClick={onBack}><IconArrowLeft size={14} />返回诊断</button>
          </div>
        </header>}
        {!embedded && <div className="aw-tabs" role="tablist" aria-label="核对方式">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} id={`aw-tab-${id}`} className={"aw-tab" + (view === id ? " is-active" : "")} role="tab" aria-selected={view === id} aria-controls={`aw-panel-${id}`} tabIndex={view === id ? 0 : -1} type="button" onClick={() => { setNotice(""); onChangeView(id); }} onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const current = TABS.findIndex((tab) => tab.id === id);
              const next = event.key === "Home" ? 0 : event.key === "End" ? TABS.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
              onChangeView(TABS[next].id);
              document.getElementById(`aw-tab-${TABS[next].id}`)?.focus();
            }}><Icon size={15} /><span>{label}</span></button>
          ))}
        </div>}

        <div className="aw-boundary"><IconAlertTriangle size={15} /><span>根因尚未确认 · 待 NPU 验证</span></div>

        {view === "code" && (
          <section className="aw-panel" id={embedded ? undefined : "aw-panel-code"} role={embedded ? undefined : "tabpanel"} aria-labelledby={embedded ? undefined : "aw-tab-code"}>
            <div className="aw-section-heading"><h3 title={codeAttachment?.name}>{codeAttachment?.name || "custom_op.cpp:128"}</h3><span className="aw-badge">{codeAttachment ? "用户提供 · 只读" : "只读示例"}</span></div>
            <p className="aw-description">{codeAttachment ? "展示本次任务中提供的代码文本，未解析或运行。请核对循环范围与实际运行条件。" : "下方是用于核对范围的示例片段。请将它与实际项目文件对照；当前尚未读取项目代码。"}</p>
            <div className="aw-code-window"><div className="aw-code-caption"><IconCode size={14} />{codeAttachment ? "用户提供的代码 · 未运行" : "范围检查示例 · C++"}</div><pre><code>{codeAttachment ? codeAttachment.content : `// 示例片段，不代表真实项目实现
const auto begin = blockId * tileSize;
const auto validCount =
  std::min(tileSize, total - begin);
for (int i = 0; i < validCount; ++i) {
  const auto index = begin + i;
  // 核对读取 / 写入范围与有效元素数
}`}</code></pre></div>
            {(onExplain || onTry) && <div className="aw-flow-launch">
              <div className="aw-flow-launch-actions">
                {onExplain && <button className="aw-source-action" type="button" onClick={onExplain}><IconBulb size={14} />解释这里</button>}
                {onTry && <button className="aw-source-action" type="button" onClick={onTry}><IconPencil size={14} />在示例副本中试改<IconArrowRight size={13} /></button>}
              </div>
              <p>{codeAttachment ? "解释与试改使用范围检查示例，原附件作为只读上下文保留。" : "沿用本任务的示例工作副本，解释、尝试与修改预览会保留。"}</p>
            </div>}
            <form className="aw-form" onSubmit={calculateRange}>
              <h3>范围算例</h3>
              <p className="aw-description">按一维、连续、从 0 开始的索引计算；分块规则需与实际实现核对。</p>
              <div className="aw-fields"><label>总元素数<input disabled={Boolean(busy)} type="number" min="1" step="1" value={total} onChange={(event) => { setTotal(event.target.value); setRangeResult(null); setRangeError(""); }} required /></label><label>每块元素数<input disabled={Boolean(busy)} type="number" min="1" step="1" value={tileSize} onChange={(event) => { setTileSize(event.target.value); setRangeResult(null); setRangeError(""); }} required /></label></div>
              {rangeError && <p className="aw-error" role="alert">{rangeError}</p>}
              <button className="aw-button aw-button-primary" type="submit" disabled={Boolean(busy)}>{busy === "range" ? <IconLoader2 className="aw-spinner" size={15} /> : <IconChartDots size={15} />}计算索引范围</button>
            </form>
            {rangeResult && <div className="aw-result-card"><div className="aw-result-title"><IconCheck size={15} /><strong>范围算例结果</strong></div><dl className="aw-metrics"><div><dt>完整块数</dt><dd>{rangeResult.full}</dd></div><div><dt>尾块有效元素</dt><dd>{rangeResult.tail}</dd></div><div><dt>总块数</dt><dd>{rangeResult.blocks}</dd></div><div><dt>最后有效索引</dt><dd>{rangeResult.last}</dd></div></dl><p className="aw-description">{rangeResult.tail ? `最后一块需处理 ${rangeResult.tail} 个有效元素。` : "当前参数没有不足一块的尾块。"}这一计算不确认越界或其他根因。</p><button className="aw-inline-button" type="button" onClick={() => record({ title: "索引范围算例", summary: `总元素数 ${rangeResult.total}，每块 ${rangeResult.tile}；完整块 ${rangeResult.full}，尾块有效元素 ${rangeResult.tail}，最后有效索引 ${rangeResult.last}。仅范围算例，根因尚未确认，待 NPU 验证。`, kind: "range", isDemo: true })}><IconPlus size={14} />加入复核记录</button></div>}
            <button className="aw-button aw-button-next" type="button" onClick={() => onChangeView("precision")}>继续检查误差分布<IconArrowRight size={15} /></button>
          </section>
        )}

        {view === "precision" && (
          <section className="aw-panel" id={embedded ? undefined : "aw-panel-precision"} role={embedded ? undefined : "tabpanel"} aria-labelledby={embedded ? undefined : "aw-tab-precision"}>
            <div className="aw-section-heading"><h3>逐元素误差</h3><button className="aw-inline-button" type="button" disabled={Boolean(busy)} onClick={loadDemo}>载入示例数据</button></div>
            <p className="aw-description">粘贴 CSV：index,expected,actual。当前仅计算你提供的数值，未连接运行环境。</p>
            <form className="aw-form" onSubmit={calculatePrecision}>
              <label className="aw-csv-label"><span>输入数据 <em>{sourceIsDemo ? "演示数据" : "用户提供 · 未独立验证"}</em></span><textarea disabled={Boolean(busy)} className="aw-csv-input" value={csv} onChange={(event) => { setCSV(event.target.value); setSourceIsDemo(false); setPrecisionResult(null); setPrecisionError(""); }} placeholder={"index,expected,actual\n0,1.25,1.25\n1,2.5,2.500001"} rows={7} spellCheck={false} /></label>
              <div className="aw-fields"><label>绝对容差 atol<input disabled={Boolean(busy)} type="number" min="0" step="any" value={absoluteTolerance} onChange={(event) => { setAbsoluteTolerance(event.target.value); setPrecisionResult(null); }} required /></label><label>相对容差 rtol<input disabled={Boolean(busy)} type="number" min="0" step="any" value={relativeTolerance} onChange={(event) => { setRelativeTolerance(event.target.value); setPrecisionResult(null); }} required /></label></div>
              <p className="aw-formula">超差条件：|actual − expected| &gt; atol + rtol × |expected|</p>
              {precisionError && <p className="aw-error" role="alert">{precisionError}</p>}
              <button className="aw-button aw-button-primary" type="submit" disabled={Boolean(busy)}>{busy === "precision" ? <IconLoader2 className="aw-spinner" size={15} /> : <IconChartDots size={15} />}计算误差</button>
            </form>
            {precisionResult && <div className="aw-result-card"><div className="aw-result-title"><IconCheck size={15} /><strong>{precisionResult.isDemo ? "演示数据结果" : "用户数据计算结果"}</strong></div><div className="aw-result-summary"><span>{precisionResult.rows.length} 个元素</span><strong>{precisionResult.failed} 个超差</strong><span>atol {formatNumber(precisionResult.atol)} · rtol {formatNumber(precisionResult.rtol)}</span></div><div className="aw-table-wrap"><table className="aw-table"><caption className="aw-sr-only">逐元素误差与容差对照</caption><thead><tr><th>索引</th><th>预期 / 实际</th><th>误差 / 阈值</th><th>判定</th></tr></thead><tbody>{precisionResult.rows.map((row) => <tr key={row.index}><td>{row.index}</td><td><span>{formatNumber(row.expected)}</span><small>{formatNumber(row.actual)}</small></td><td><span>{formatNumber(row.error)}</span><small>{formatNumber(row.threshold)}</small></td><td><span className={"aw-status" + (row.passed ? "" : " is-failed")}>{row.passed ? "范围内" : "超差"}</span></td></tr>)}</tbody></table></div><p className="aw-description">仅判断本次粘贴元素是否在所设容差内，不能代表整体精度通过，也不能确认根因。</p><button className="aw-inline-button" type="button" onClick={() => record({ title: precisionResult.isDemo ? "演示误差计算" : "逐元素误差计算", summary: `${precisionResult.isDemo ? "演示" : "用户提供"}数据：${precisionResult.rows.length} 个元素，${precisionResult.failed} 个超差；atol ${precisionResult.atol}，rtol ${precisionResult.rtol}。未独立验证数据来源，根因尚未确认，待 NPU 验证。`, kind: "precision", isDemo: precisionResult.isDemo })}><IconPlus size={14} />加入复核记录</button></div>}
            <button className="aw-button aw-button-next" type="button" onClick={() => onChangeView("review")}>整理观察与待验证项<IconArrowRight size={15} /></button>
          </section>
        )}

        {view === "review" && (
          <section className="aw-panel" id={embedded ? undefined : "aw-panel-review"} role={embedded ? undefined : "tabpanel"} aria-labelledby={embedded ? undefined : "aw-tab-review"}>
            <div className="aw-section-heading"><h3>整理本次复核</h3><span className="aw-badge">任务记录</span></div>
            <p className="aw-description">勾选已核对的条件，保留观察与下一步所需证据。</p>
            <form className="aw-form" onSubmit={generateReview}>
              <fieldset className="aw-checks"><legend>核对条件</legend>{REVIEW_CHECKS.map((label, index) => <label key={label}><input disabled={Boolean(busy)} type="checkbox" checked={checks.includes(index)} onChange={(event) => setChecks((current) => event.target.checked ? [...current, index] : current.filter((item) => item !== index))} /><span>{label}</span></label>)}</fieldset>
              <label className="aw-observation">观察与待确认内容<textarea disabled={Boolean(busy)} rows={5} value={observation} onChange={(event) => { setObservation(event.target.value); setReviewError(""); }} placeholder="例如：已对照循环范围，仍需补充失败元素的实际误差与运行环境记录。" /></label>
              <div className="aw-review-context"><span>当前记录来源</span><p>{activeRange ? `已计算范围算例：${activeRange.total} / ${activeRange.tile}。` : "范围算例尚未计算。"}{activePrecision ? `误差计算：${activePrecision.rows.length} 个元素、${activePrecision.failed} 个超差${activePrecision.isDemo ? "（演示）" : "（用户提供）"}。` : "尚未计算逐元素误差。"}</p></div>
              {reviewError && <p className="aw-error" role="alert">{reviewError}</p>}
              <button className="aw-button aw-button-primary" type="submit" disabled={Boolean(busy)}>{busy === "review" ? <IconLoader2 className="aw-spinner" size={15} /> : <IconClipboardCheck size={15} />}生成复核记录</button>
            </form>
            {reviewResult && <div className="aw-result-card"><div className="aw-result-title"><IconCheck size={15} /><strong>复核记录已生成</strong></div><p className="aw-review-text">{reviewResult.summary}</p><span className="aw-description">已同步到当前任务的记录区域。</span></div>}
          </section>
        )}

        <div className="aw-notice" role="status" aria-live="polite">{notice}</div>
      </div>
    </aside>
  );
}

export default ActionWorkspace;
