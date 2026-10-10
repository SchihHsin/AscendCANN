import { useEffect, useId, useRef, useState } from "react";
import "./precision-plot.css";

const RATIO_CAP = 1e6;
const LOG_CAP = Math.log1p(RATIO_CAP);
const indexText = (value) => value.toLocaleString("zh-CN");
const exactValue = (value) => String(value);

function ratioGeometry(row) {
  if (row.error === 0) return { ratio: 0, logValue: 0, capped: false, zeroThreshold: row.threshold === 0, text: row.threshold === 0 ? "0×（零误差，绘图约定）" : "0×" };
  if (row.threshold === 0) return { ratio: Infinity, logValue: LOG_CAP, capped: true, zeroThreshold: true, text: "∞（阈值为 0，误差非零）" };
  const logRatio = Math.log(row.error) - Math.log(row.threshold);
  const ratio = row.error / row.threshold;
  // Compute log(1 + error / threshold) without overflowing the quotient.
  const logarithm = logRatio > 36 ? logRatio : Math.log1p(Math.exp(logRatio));
  const capped = logarithm > LOG_CAP;
  let text;
  if (Number.isFinite(ratio) && ratio > 0) text = `${Number(ratio.toPrecision(6))}×`;
  else {
    const exponent = Math.floor(logRatio / Math.LN10);
    const mantissa = Math.exp(logRatio - exponent * Math.LN10);
    text = `约 ${Number(mantissa.toPrecision(5))} × 10^${exponent}`;
  }
  return { ratio, logValue: Math.min(LOG_CAP, logarithm), capped, zeroThreshold: false, text };
}

function yTicks(maximum, yAt) {
  const values = [0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 1e4, 1e5, 1e6].filter((value) => value <= maximum);
  const ticks = [0, 1];
  for (const value of values) {
    if (value <= 1) continue;
    if (Math.abs(yAt(value) - yAt(ticks.at(-1))) >= 25) ticks.push(value);
  }
  return ticks;
}

function multiplierTick(value) {
  return value >= 1e4 ? `${value.toExponential(0).replace("e+", "e")}×` : `${value}×`;
}

/** Scatter plot of the provided rows only, with no interpolation or NPU claim. */
export function PrecisionPlot({ result, selectedIndex = null, onSelect }) {
  const hostRef = useRef(null);
  const pointRefs = useRef(new Map());
  const [width, setWidth] = useState(480);
  const id = useId().replace(/:/g, "");
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const observer = new ResizeObserver((entries) => {
      const nextWidth = Math.max(180, Math.round(entries[0]?.contentRect.width || host.clientWidth));
      setWidth((previous) => previous === nextWidth ? previous : nextWidth);
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, [Boolean(result?.rows?.length)]);

  if (!result?.rows?.length) return null;
  const rows = result.rows;
  const points = rows.map((row) => ({ ...row, ...ratioGeometry(row) }));
  const selected = points.find((row) => row.index === selectedIndex) || points.find((row) => !row.passed) || points[0];
  const minimumIndex = Math.min(...points.map((row) => row.index));
  const maximumIndex = Math.max(...points.map((row) => row.index));
  const indexSpan = maximumIndex - minimumIndex;
  const offsetLabels = maximumIndex > 1e7;
  const maximumLogValue = Math.max(Math.log1p(2), ...points.map((row) => row.logValue));
  const axisLogMaximum = Math.min(LOG_CAP, maximumLogValue * 1.14);
  const axisMaximum = axisLogMaximum === LOG_CAP ? RATIO_CAP : Math.expm1(axisLogMaximum);
  const plot = { left: 43, right: width - 13, top: 18, bottom: 165 };
  const xAt = (index) => indexSpan ? plot.left + ((index - minimumIndex) / indexSpan) * (plot.right - plot.left) : (plot.left + plot.right) / 2;
  const yAtLog = (value) => plot.bottom - (value / axisLogMaximum) * (plot.bottom - plot.top);
  const yAt = (ratio) => yAtLog(Math.log1p(ratio));
  const ticks = yTicks(axisMaximum, yAt);
  const xTicks = indexSpan ? width >= 350 ? [minimumIndex, minimumIndex + Math.floor(indexSpan / 2), maximumIndex] : [minimumIndex, maximumIndex] : [minimumIndex];
  const uniqueXTicks = [...new Set(xTicks)];
  const cappedCount = points.filter((row) => row.capped).length;
  const zeroThresholdCount = points.filter((row) => row.zeroThreshold && row.error !== 0).length;
  const zeroOverZeroCount = points.filter((row) => row.zeroThreshold && row.error === 0).length;
  const gapCount = rows.reduce((sum, row, index) => index > 0 && row.index - rows[index - 1].index > 1 ? sum + 1 : sum, 0);

  const choose = (row, keyboard = false) => {
    onSelect?.(row.index);
    if (keyboard) requestAnimationFrame(() => pointRefs.current.get(row.index)?.focus());
  };
  const keyboardSelect = (event, row) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(row); return; }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const position = points.findIndex((point) => point.index === row.index);
    const nextPosition = event.key === "Home" ? 0 : event.key === "End" ? points.length - 1 : Math.min(points.length - 1, Math.max(0, position + (event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : -1)));
    choose(points[nextPosition], true);
  };

  return <section className="pp-precision-plot" aria-label="逐元素误差相对容差图">
    <header className="pp-heading"><strong>误差相对容差</strong><span>{result.isDemo ? `${rows.length} 行演示数据` : `${rows.length} 行用户提供数据 · 未独立验证`}</span></header>
    <div className="pp-chart-host" ref={hostRef}>
      <svg className="pp-chart" viewBox={`0 0 ${width} 210`} role="group" aria-label="散点横坐标为实际数据索引；纵坐标为误差除以阈值，使用 log1p 刻度。圆点为容差内，菱形为超差，三角形为绘图封顶。方向键可选择相邻数据点。">
        <defs><linearGradient id={`${id}-point`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#839eef" /><stop offset="1" stopColor="#a08ad6" /></linearGradient><linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dce4fc" stopOpacity=".45" /><stop offset="1" stopColor="#ece8fb" stopOpacity=".12" /></linearGradient></defs>
        <rect x={plot.left} y={yAt(1)} width={plot.right - plot.left} height={plot.bottom - yAt(1)} fill={`url(#${id}-area)`} />
        {ticks.map((tick) => <g key={tick} aria-hidden="true"><path d={`M ${plot.left} ${yAt(tick)} H ${plot.right}`} className={tick === 1 ? "pp-threshold-line" : "pp-grid-line"} /><text x={plot.left - 7} y={yAt(tick) + (tick === 1 && yAt(0) - yAt(1) < 17 ? -3 : 3)} textAnchor="end" className={tick === 1 ? "pp-axis-label is-threshold" : "pp-axis-label"}>{multiplierTick(tick)}</text></g>)}
        <path d={`M ${plot.left} ${plot.top} V ${plot.bottom} H ${plot.right}`} className="pp-axis-line" aria-hidden="true" />
        {uniqueXTicks.map((tick, position) => <g key={tick} aria-hidden="true"><path d={`M ${xAt(tick)} ${plot.bottom} v 4`} className="pp-axis-line" /><text x={xAt(tick)} y={plot.bottom + 17} textAnchor={position === 0 && indexSpan ? "start" : position === uniqueXTicks.length - 1 && indexSpan ? "end" : "middle"} className="pp-axis-label">{offsetLabels ? `+${indexText(tick - minimumIndex)}` : indexText(tick)}</text></g>)}
        <text x={(plot.left + plot.right) / 2} y="203" textAnchor="middle" className="pp-axis-label" aria-hidden="true">{offsetLabels ? "相对起点的索引偏移" : "数据索引"}</text>
        {points.map((point) => {
          const x = xAt(point.index);
          const y = yAtLog(point.logValue);
          const isSelected = point.index === selected.index;
          return <g key={point.index} ref={(element) => { if (element) pointRefs.current.set(point.index, element); else pointRefs.current.delete(point.index); }} className={"pp-point" + (point.passed ? " is-passed" : " is-failed") + (isSelected ? " is-selected" : "")} role="button" tabIndex={isSelected ? 0 : -1} aria-pressed={isSelected} aria-label={`索引 ${indexText(point.index)}，${point.passed ? "容差内" : "超差"}，误差 ${exactValue(point.error)}，阈值 ${exactValue(point.threshold)}，倍数 ${point.text}${point.capped ? "；点位在 1000000 倍处封顶" : ""}`} onClick={() => choose(point)} onKeyDown={(event) => keyboardSelect(event, point)}>
            <title>{`索引 ${indexText(point.index)} · ${point.passed ? "容差内" : "超差"}\n误差 ${exactValue(point.error)} / 阈值 ${exactValue(point.threshold)}\n${point.text}${point.capped ? " · 绘图封顶" : ""}`}</title>
            <circle cx={x} cy={y} r="9" className="pp-point-hit" />
            {isSelected && <circle cx={x} cy={y} r="7.5" className="pp-selection-ring" />}
            {point.capped ? <path d={`M ${x} ${y - 5} L ${x + 5} ${y + 4} L ${x - 5} ${y + 4} Z`} fill={`url(#${id}-point)`} className="pp-point-shape" /> : point.passed ? <circle cx={x} cy={y} r="3.4" className="pp-point-shape" /> : <path d={`M ${x} ${y - 4.5} L ${x + 4.5} ${y} L ${x} ${y + 4.5} L ${x - 4.5} ${y} Z`} fill={`url(#${id}-point)`} className="pp-point-shape" />}
          </g>;
        })}
      </svg>
    </div>
    <div className="pp-legend"><span>○ 容差内</span><span>◇ 超差</span>{cappedCount > 0 && <span>△ 绘图封顶</span>}<span className="pp-threshold-key">1× 为判定阈值</span></div>
    <p className="pp-scale-note">纵轴采用 log1p(误差 / 阈值) 刻度；全部 {rows.length} 个数据点均已绘制，不连线。{gapCount ? "索引空白处未提供数据，不代表误差为零。" : ""}{offsetLabels ? `横轴起点为索引 ${indexText(minimumIndex)}。` : ""}</p>
    {cappedCount > 0 && <p className="pp-scale-note is-capped">{cappedCount} 个点在 1,000,000× 处封顶{zeroThresholdCount ? `，其中 ${zeroThresholdCount} 个点阈值为 0 且误差非零` : ""}。以下读数保留原始误差和阈值。</p>}
    {zeroOverZeroCount > 0 && <p className="pp-scale-note">{zeroOverZeroCount} 个点的误差与阈值均为 0，按 0× 位置绘制；此处为绘图约定。</p>}
    <article className="pp-point-detail" aria-live="polite" aria-label={`已选择索引 ${indexText(selected.index)}`}>
      <div className="pp-detail-heading"><strong>索引 {indexText(selected.index)}</strong><span>{selected.passed ? "○ 容差内" : "◇ 超差"}</span></div>
      <dl><div><dt>实际误差</dt><dd>{exactValue(selected.error)}</dd></div><div><dt>判定阈值</dt><dd>{exactValue(selected.threshold)}</dd></div><div><dt>误差 / 阈值</dt><dd>{selected.text}</dd></div><div><dt>预期 → 实际</dt><dd>{exactValue(selected.expected)} → {exactValue(selected.actual)}</dd></div></dl>
    </article>
  </section>;
}

export default PrecisionPlot;
