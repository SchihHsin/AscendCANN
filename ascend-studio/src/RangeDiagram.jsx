import { useEffect, useId, useState } from "react";
import "./range-diagram.css";
import { RangeStructure, RangeAccessStepper } from "./RangeStructure";

export const RANGE_CONCEPT_LABELS = Object.freeze({
  total: "整体分块",
  tail: "最后一块",
  access: "访问边界",
});

const count = (value) => value.toLocaleString("zh-CN");
const interval = (start, end) => start === end ? count(start) : `${count(start)}–${count(end)}`;

function positiveInteger(value) {
  if (typeof value !== "number" && (typeof value !== "string" || !/^\d+$/.test(value.trim()))) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

/** Mathematical index geometry only; no source-code parsing or hardware execution. */
export function getRangeGeometry(snapshot) {
  const source = snapshot?.snapshot || snapshot || {};
  const rows = positiveInteger(source.rows);
  const columns = positiveInteger(source.columns);
  const tileSize = positiveInteger(source.tileSize);
  const bounds = source.bounds ?? "full";
  if (rows === null || columns === null || tileSize === null || !["full", "valid"].includes(bounds)) {
    return { valid: false, invalid: true, error: "行数、列数和每块元素数需要是正整数，范围策略需为整块访问或仅有效元素。" };
  }
  const total = rows * columns;
  if (!Number.isSafeInteger(total)) {
    return { valid: false, invalid: true, error: "参数超出浏览器可准确表示的整数范围，请缩小算例。" };
  }
  const tail = total % tileSize;
  const fullBlocks = (total - tail) / tileSize;
  const blocks = fullBlocks + (tail > 0 ? 1 : 0);
  const capacity = blocks * tileSize;
  if (!Number.isSafeInteger(capacity)) {
    return { valid: false, invalid: true, error: "参数超出浏览器可准确表示的整数范围，请缩小算例。" };
  }
  const hasTail = tail > 0;
  const lastBlockStart = (blocks - 1) * tileSize;
  const lastBlockValid = hasTail ? tail : tileSize;
  const unusedSlots = capacity - total;
  const accessedCount = bounds === "valid" ? total : capacity;
  return {
    valid: true, invalid: false, rows, columns, tileSize, bounds, total, blocks, capacity,
    fullBlocks, tail, hasTail, lastBlockStart, lastBlockValid, unusedSlots,
    lastValidIndex: total - 1,
    accessedCount,
    maxAccessIndex: accessedCount - 1,
    outOfRange: accessedCount - total,
    remainder: tail,
    lastValid: total - 1,
    lastBase: lastBlockStart,
    accessed: accessedCount,
    maxIndex: accessedCount - 1,
  };
}

function overviewBlocks(geometry) {
  const { blocks } = geometry;
  if (blocks <= 18) return Array.from({ length: blocks }, (_, index) => ({ index }));
  // Keep both ends and the final block; omitted blocks are explicitly counted.
  return [
    ...Array.from({ length: 6 }, (_, index) => ({ index })),
    { omitted: blocks - 11 },
    ...Array.from({ length: 5 }, (_, index) => ({ index: blocks - 5 + index })),
  ];
}

function partitionPositions(start, length, limit, valid) {
  if (!length) return [];
  const groups = Math.min(length, limit);
  const base = Math.floor(length / groups);
  const remainder = length % groups;
  return Array.from({ length: groups }, (_, index) => {
    const offset = index * base + Math.min(index, remainder);
    const size = base + (index < remainder ? 1 : 0);
    return { start: start + offset, size, valid };
  });
}

function lastBlockPositions(geometry) {
  const { tileSize, lastBlockValid, unusedSlots } = geometry;
  if (tileSize <= 32) return Array.from({ length: tileSize }, (_, index) => ({ start: index, size: 1, valid: index < lastBlockValid }));
  // Partition each semantic region separately so one cell never mixes valid and
  // outside positions. All group counts remain integers, even for large tiles.
  const validBudget = unusedSlots ? Math.min(23, Math.max(1, Math.round(24 * (lastBlockValid / tileSize)))) : 24;
  return [
    ...partitionPositions(0, lastBlockValid, validBudget, true),
    ...partitionPositions(lastBlockValid, unusedSlots, 24 - validBudget, false),
  ];
}

function FocusExplanation({ geometry, focus }) {
  const { rows, columns, total, tileSize, fullBlocks, tail, hasTail, lastBlockStart, lastValidIndex, bounds, maxAccessIndex, outOfRange } = geometry;
  if (focus === "total") return <p className="rd-focus-copy"><code>rows × columns</code> 得到 {count(rows)} × {count(columns)} = {count(total)} 个元素；按每块 {count(tileSize)} 个分为 {count(fullBlocks)} 个完整块{hasTail ? `，再加一个有效元素为 ${count(tail)} 的尾块。` : "，没有不足一块的尾块。"}</p>;
  if (focus === "access") return <p className="rd-focus-copy"><code>{bounds === "valid" ? "offset < validCount" : "offset < tileSize"}</code> 在这组参数下访问至索引 {count(maxAccessIndex)}；有效索引截至 {count(lastValidIndex)}。{outOfRange ? `示例涉及 ${count(outOfRange)} 个范围外位置。` : "示例索引均处于有效区间。"}</p>;
  return <p className="rd-focus-copy"><code>baseIndex / validCount</code>：最后一块从索引 {count(lastBlockStart)} 开始，{hasTail ? `剩余 ${count(tail)} 个有效元素。按完整块大小访问时，还会涉及 ${count(tileSize - tail)} 个范围外位置。` : `含 ${count(tileSize)} 个有效元素，是完整块，无需额外尾块处理。`}</p>;
}

export function RangeDiagram({ snapshot, focus = "tail", onFocus, compact = false, title, active = true }) {
  const geometry = getRangeGeometry(snapshot);
  const requestedFocus = Object.hasOwn(RANGE_CONCEPT_LABELS, focus) ? focus : "tail";
  const [localFocus, setLocalFocus] = useState(requestedFocus);
  const id = useId().replace(/:/g, "");
  const activeFocus = onFocus ? requestedFocus : localFocus;
  useEffect(() => { setLocalFocus(requestedFocus); }, [requestedFocus]);
  const selectFocus = (next) => { setLocalFocus(next); onFocus?.(next); };

  if (!geometry.valid) return <section className="rd-range-diagram rd-invalid" aria-label={title || "索引范围图解"}><strong>{title || "索引范围图解"}</strong><p role="status">{geometry.error}</p></section>;

  const lastLabel = geometry.hasTail ? "尾块" : "最后一个完整块";
  const outsideLabel = geometry.bounds === "full" ? "范围外访问" : "未访问位置";
  const positions = lastBlockPositions(geometry);
  const grouped = geometry.tileSize > 32;
  const barWidth = 472;
  const validWidth = barWidth * (geometry.total / geometry.capacity);
  const accessWidth = barWidth * (geometry.accessedCount / geometry.capacity);

  return <section className={"rd-range-diagram" + (compact ? " is-compact" : "")} data-range-focus={activeFocus} aria-label={title || "索引范围图解"}>
    <header className="rd-heading"><div><h4>{title || "把索引范围画出来"}</h4><span>[{count(geometry.rows)}, {count(geometry.columns)}] · 每块 {count(geometry.tileSize)}</span></div><span className="rd-strategy">{geometry.bounds === "valid" ? "仅有效元素" : "整块访问"}</span></header>
    <div className="rd-focus-controls" role="group" aria-label="图解关注位置">
      {Object.entries(RANGE_CONCEPT_LABELS).map(([key, label]) => <button type="button" key={key} aria-pressed={activeFocus === key} onClick={() => selectFocus(key)}>{key === "tail" && geometry.hasTail ? "尾块放大" : label}</button>)}
    </div>

    {activeFocus === "total" && <RangeStructure geometry={geometry} onFocus={selectFocus} />}
    {activeFocus === "access" && <RangeAccessStepper geometry={geometry} active={active} />}
    {!compact && <dl className="rd-metrics"><div><dt>总元素</dt><dd>{count(geometry.total)}</dd></div><div><dt>完整块</dt><dd>{count(geometry.fullBlocks)}</dd></div><div><dt>{geometry.hasTail ? "尾块有效" : "最后一块有效"}</dt><dd>{count(geometry.lastBlockValid)}</dd></div><div><dt>范围外访问</dt><dd>{count(geometry.outOfRange)}</dd></div></dl>}

    {(!compact && activeFocus === "tail") && <button className={"rd-plot rd-overview" + (activeFocus === "total" ? " is-focused" : "")} type="button" onClick={() => selectFocus("total")} aria-label={`整体分块：${count(geometry.fullBlocks)} 个完整块${geometry.hasTail ? `与 1 个尾块` : "，无尾块"}。关注整体分块。`}>
      <span className="rd-plot-heading"><strong>整体分块</strong><span>{count(geometry.blocks)} 块{compact ? ` · 每块 ${count(geometry.tileSize)}` : ""}</span></span>
      <span className="rd-block-grid">{overviewBlocks(geometry).map((block) => block.omitted ? <span className="rd-block rd-block-omitted" key="omitted"><span>···</span>{!compact && <small>省略 {count(block.omitted)} 块</small>}</span> : <span className={"rd-block" + (block.index === geometry.blocks - 1 ? " is-last" : "")} key={block.index} title={`第 ${count(block.index + 1)} 块：索引 ${interval(block.index * geometry.tileSize, Math.min(geometry.total - 1, (block.index + 1) * geometry.tileSize - 1))}`}><span>{count(block.index + 1)}</span>{!compact && <small>{block.index === geometry.blocks - 1 && geometry.hasTail ? `尾块 ${count(geometry.tail)}` : `${count(geometry.tileSize)} 个`}</small>}</span>)}</span>
      {compact && geometry.blocks > 18 && <span className="rd-plot-caption">中间省略 {count(geometry.blocks - 11)} 块，块宽为示意。</span>}
      {!compact && <span className="rd-plot-caption">{count(geometry.fullBlocks)} 个完整块{geometry.hasTail ? ` + 尾块 ${count(geometry.tail)} 个有效元素` : " · 无不足一块的尾块"}{geometry.blocks > 18 ? "；中间块已省略，块宽为示意。" : "；块宽为示意。"}</span>}
    </button>}

    {activeFocus === "tail" && <button className={"rd-plot rd-tail" + (activeFocus === "tail" ? " is-focused" : "")} type="button" onClick={() => selectFocus("tail")} aria-label={`${lastLabel}：${count(geometry.lastBlockValid)} 个有效元素，${count(geometry.unusedSlots)} 个${outsideLabel}。关注最后一块。`}>
      <span className="rd-plot-heading"><strong>{lastLabel}{grouped ? "分组示意" : "放大"}</strong><span>{count(geometry.lastBlockValid)} / {count(geometry.tileSize)} 有效</span></span>
      <span className="rd-position-grid">{positions.map((position, index) => {
        const start = geometry.lastBlockStart + position.start;
        const end = start + position.size - 1;
        const description = `${position.valid ? "有效元素" : outsideLabel}；索引 ${interval(start, end)}；共 ${count(position.size)} 个位置`;
        return <span className={"rd-position" + (position.valid ? " is-valid" : geometry.bounds === "full" ? " is-outside" : " is-inactive")} key={position.start} title={description} aria-label={description}><span>{grouped ? `组 ${index + 1}` : position.start}</span><small aria-hidden="true">{position.valid ? "●" : geometry.bounds === "full" ? "×" : "—"}</small></span>;
      })}</span>
      <span className="rd-tail-ranges"><span><i className="rd-key is-valid" aria-hidden="true" />有效 {count(geometry.lastBlockValid)} 个<span>索引 {interval(geometry.lastBlockStart, geometry.lastValidIndex)}</span></span>{geometry.unusedSlots > 0 && <span><i className={"rd-key " + (geometry.bounds === "full" ? "is-outside" : "is-inactive")} aria-hidden="true" />{outsideLabel} {count(geometry.unusedSlots)} 个<span>索引 {interval(geometry.total, geometry.capacity - 1)}</span></span>}</span>
      {!compact && <span className="rd-plot-caption">{grouped ? "每格为一组连续索引；悬浮可查看每组的精确区间与整数数量。" : "格内数字是块内偏移；● 有效，× 范围外访问，— 未访问。"}{geometry.bounds === "valid" && geometry.unusedSlots > 0 ? "虚线位置保留，但当前策略不会访问。" : ""}</span>}
    </button>}

    {activeFocus === "access" && <button className={"rd-plot rd-access" + (activeFocus === "access" ? " is-focused" : "")} type="button" onClick={() => selectFocus("access")} aria-label={`有效索引 0 至 ${count(geometry.lastValidIndex)}，示例最大访问索引 ${count(geometry.maxAccessIndex)}。关注访问边界。`}>
      <span className="rd-plot-heading"><strong>有效区间与访问上限</strong><span>{geometry.outOfRange ? `范围外 ${count(geometry.outOfRange)}` : "范围外 0"}</span></span>
      <svg className="rd-range-bar" viewBox="0 0 500 65" role="img" aria-label={`上条为有效元素区间，下线为示例访问区间。${geometry.bounds === "valid" ? "访问止于有效区间" : "访问覆盖完整分块容量"}。`}>
        <defs><linearGradient id={`${id}-valid`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#8aa6f2" /><stop offset=".6" stopColor="#9b9bea" /><stop offset="1" stopColor="#b1a1eb" /></linearGradient><pattern id={`${id}-outside`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="7" height="7" fill="#fcf3df" /><path d="M 0 0 V 7" stroke="#ceb98a" strokeWidth="2" /></pattern></defs>
        <rect x="14" y="10" width={barWidth} height="19" rx="5" className="rd-bar-track" />
        <rect x="14" y="10" width={validWidth} height="19" rx="5" fill={`url(#${id}-valid)`} />
        {geometry.unusedSlots > 0 && <rect x={14 + validWidth} y="10" width={barWidth - validWidth} height="19" fill={geometry.bounds === "full" ? `url(#${id}-outside)` : "#fff"} className={geometry.bounds === "valid" ? "rd-bar-unused" : undefined} />}
        <path d={`M 14 46 H ${14 + accessWidth}`} className="rd-access-line" />
        <path d={`M ${14 + accessWidth - 5} 42 L ${14 + accessWidth} 46 L ${14 + accessWidth - 5} 50`} className="rd-access-line" />
        <path d={`M ${14 + validWidth} 6 V 34`} className="rd-valid-end" />
        <circle cx="14" cy="46" r="2.5" className="rd-access-start" />
      </svg>
      <span className="rd-access-labels"><span>有效索引<strong>0–{count(geometry.lastValidIndex)}</strong></span><span>示例访问至<strong>{count(geometry.maxAccessIndex)}</strong></span></span>
    </button>}
    {!compact && <FocusExplanation geometry={geometry} focus={activeFocus} />}
    <p className="rd-boundary">{compact ? "数学范围示例 · 未运行代码" : "浏览器数学范围示例 · 未运行代码，不能据此确认真实根因。"}</p>
  </section>;
}

export default RangeDiagram;
