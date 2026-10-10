import { useEffect, useRef, useState } from "react";
import { IconArrowRight, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import "./range-structure.css";

export function RangeStructure({ geometry: g, onFocus }) {
  const [selected, setSelected] = useState(g.total - 1);
  useEffect(() => setSelected(g.total - 1), [g.rows, g.columns, g.tileSize]);
  const detailed = g.total <= 2048 && g.columns <= 64 && g.rows <= 48;
  const columns = detailed ? g.columns : Math.min(24, g.columns);
  const rows = detailed ? g.rows : Math.min(18, g.rows);
  const cell = Math.min(11, 218 / columns, 155 / rows);
  const block = Math.min(g.blocks - 1, Math.floor(selected / g.tileSize));
  const blocks = g.blocks <= 18 ? Array.from({ length: g.blocks }, (_, i) => i) : [0,1,2,3,4,5,g.blocks-3,g.blocks-2,g.blocks-1];
  const selectKey = (event, value) => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); setSelected(value); } };
  return <section className="rs-structure" aria-label="输入矩阵与连续元素分块"><header><strong>输入怎样成为分块</strong><span>按行展开的范围示例</span></header>
    <div className="rs-structure-panels">
      <div><h5>二维输入 [{g.rows}, {g.columns}]</h5><svg viewBox={`0 0 240 ${20 + rows * cell}`} role="group" aria-label={`输入 ${g.rows} 行 ${g.columns} 列`}>{Array.from({ length: rows * columns }, (_, i) => {
        const row = Math.floor(i / columns), col = i % columns;
        const index = detailed ? row * g.columns + col : Math.floor(i * g.total / (rows * columns));
        const cellBlock = Math.floor(index / g.tileSize);
        return <rect key={i} role="button" tabIndex={0} aria-label={`${detailed ? `行${row}列${col}` : "缩略位置"}，索引${index}，第${cellBlock + 1}块`} onClick={() => setSelected(index)} onKeyDown={event => selectKey(event,index)} x={10 + col * cell} y={10 + row * cell} width={Math.max(.5,cell-.7)} height={Math.max(.5,cell-.7)} rx=".8" className={`rs-cell${cellBlock === g.blocks - 1 ? " is-tail" : ""}${cellBlock === block ? " is-selected" : ""}`}><title>索引 {index} → 第 {cellBlock+1} 块</title></rect>;
      })}</svg><small>{detailed ? "点击元素，查看它属于哪一块" : "缩略表示，非逐元素图"}</small></div>
      <IconArrowRight className="rs-layout-arrow" size={18} />
      <div><h5>连续元素 → 每块 {g.tileSize}</h5><svg viewBox={`0 0 220 ${20 + Math.ceil(blocks.length / 6) * 42}`} role="group" aria-label={`共${g.blocks}个分块`}>{blocks.map((value,i) => <g key={value} role="button" tabIndex={0} aria-label={`选择第${value+1}块`} onClick={() => setSelected(Math.min(g.total-1,value*g.tileSize))} onKeyDown={event => selectKey(event,Math.min(g.total-1,value*g.tileSize))}><rect x={10+i%6*33} y={10+Math.floor(i/6)*42} width="28" height="32" rx="4" className={`rs-block${value === g.blocks-1 ? " is-tail" : ""}${value === block ? " is-selected" : ""}`} /><text x={24+i%6*33} y={30+Math.floor(i/6)*42} textAnchor="middle" className="rs-block-label">{value+1}</text></g>)}</svg><small>{g.fullBlocks} 个完整块{g.hasTail ? ` + 尾块 ${g.tail}` : "，无余数"}{g.blocks > 18 ? `；中间省略 ${g.blocks-blocks.length} 块` : ` · ${g.total} 个有效元素`}</small></div>
    </div><div className="rs-index-link"><span>{detailed ? `(${Math.floor(selected/g.columns)}, ${selected%g.columns})` : "缩略位置"}</span><IconArrowRight size={12} /><span>索引 <strong>{selected}</strong></span><IconArrowRight size={12} /><span>第 <strong>{block+1}</strong> 块</span><button type="button" onClick={() => onFocus?.("tail")}>放大最后一块<IconArrowRight size={12} /></button></div></section>;
}

export function RangeAccessStepper({ geometry: g, active = true }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const sectionRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (!entries[0]?.isIntersecting) setPlaying(false); });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  const limit = g.bounds === "valid" ? g.lastBlockValid : g.tileSize;
  useEffect(() => { setStep(0); setPlaying(false); }, [g.total, g.tileSize, g.bounds]);
  useEffect(() => { if (!active) setPlaying(false); }, [active]);
  useEffect(() => {
    if (!playing || !active) return;
    const timer = setInterval(() => setStep(previous => Math.min(limit - 1, previous + Math.max(1, Math.floor(limit / 64)))), 320);
    return () => clearInterval(timer);
  }, [playing, active, limit]);
  useEffect(() => { if (step >= limit - 1) setPlaying(false); }, [step, limit]);
  const offset = Math.min(step, limit - 1), outside = offset >= g.lastBlockValid;
  const width = 450 * g.lastBlockValid / g.tileSize, pointer = 20 + 450 * (offset + .5) / g.tileSize;
  return <section ref={sectionRef} className="rs-access-stepper" aria-label="单步访问过程"><header><strong>跟着循环看访问位置</strong><span>最后一块 · 当前策略</span></header><svg viewBox="0 0 490 105" className="rs-chart" role="img" aria-label={`偏移${offset}，索引${g.lastBlockStart + offset}，${outside ? "范围外" : "有效"}`}><rect x="20" y="42" width="450" height="25" rx="4" className="rs-track" /><rect x="20" y="42" width={width} height="25" rx="4" className="rs-valid" />{g.unusedSlots > 0 && <rect x={20 + width} y="42" width={450 - width} height="25" className="rs-outside" />}<path d={`M ${20 + width} 35 V 76`} className="rs-boundary" /><path d={`M ${pointer} 18 V 67`} className={outside ? "rs-pointer is-outside" : "rs-pointer"} /><circle cx={pointer} cy="42" r="4" className={outside ? "rs-dot is-outside" : "rs-dot"} /><text x="20" y="91" className="rs-note">{g.lastBlockStart}</text><text x={20 + width} y="91" textAnchor="middle" className="rs-note">有效截止 {g.lastValidIndex}</text><text x="470" y="91" textAnchor="end" className="rs-note">{g.capacity - 1}</text><text x="20" y="16" className="rs-label">offset {offset} → index {g.lastBlockStart + offset}</text></svg><div className="rs-playback"><button type="button" aria-label={playing ? "暂停访问演示" : "播放访问演示"} onClick={() => { if (offset >= limit - 1) setStep(0); setPlaying(value => !value); }}>{playing ? <IconPlayerPause size={14} /> : <IconPlayerPlay size={14} />}</button><input aria-label="块内访问偏移" type="range" min="0" max={limit - 1} step="1" value={offset} onChange={event => { setPlaying(false); setStep(Number(event.target.value)); }} /><button type="button" disabled={offset >= limit - 1} onClick={() => { setPlaying(false); setStep(value => Math.min(limit - 1, value + 1)); }}>单步<IconArrowRight size={12} /></button></div><div className={`rs-observation${outside ? " is-outside" : ""}`}><code>index = {g.lastBlockStart} + {offset}</code><span>{outside ? "当前索引超出示例有效范围" : "当前索引在示例有效范围内"}</span></div><p>当前循环上限：{g.bounds === "valid" ? "validCount" : "tileSize"} = {limit}。这是范围演示，不执行代码。</p></section>;
}
