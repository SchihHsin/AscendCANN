import { useLayoutEffect, useRef, useState } from "react";
import { IconArrowRight, IconArrowUpRight, IconBook, IconCheck, IconChevronRight, IconCode, IconCpu, IconEdit, IconInfoCircle, IconRoute, IconSettings, IconSparkles, IconTrendingUp, IconX } from "@tabler/icons-react";
import { explorationTopics, explorationRequest } from "./home-exploration";
import "./explore-task-home.css";

const topicIcons = { training: IconTrendingUp, deployment: IconCpu, operator: IconCode, migration: IconRoute, environment: IconSettings, learning: IconBook };

function Connections({ containerRef, revision, hovered }) {
  const [lines, setLines] = useState([]);
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const measure = () => {
      const frame = container.getBoundingClientRect();
      const root = container.querySelector("[data-graph-root]")?.getBoundingClientRect();
      if (!root || !frame.width) { setLines([]); return; }
      setLines(Array.from(container.querySelectorAll("[data-graph-node]")).map((node) => {
        const rect = node.getBoundingClientRect();
        const sx = root.right - frame.left, sy = root.top + root.height / 2 - frame.top;
        const ex = rect.left - frame.left, ey = rect.top + rect.height / 2 - frame.top;
        return { id: node.dataset.graphNode, d: `M ${sx} ${sy} C ${sx + (ex - sx) * .48} ${sy}, ${sx + (ex - sx) * .48} ${ey}, ${ex} ${ey}` };
      }));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    measure();
    return () => observer.disconnect();
  }, [containerRef, revision]);
  return <svg className="explore-map__connections" aria-hidden="true">{lines.map((line) => <path key={line.id} d={line.d} className={hovered === line.id ? "is-active" : ""} />)}</svg>;
}

export function ExploreTaskHome({ onCreateTask }) {
  const [ids, setIds] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [draft, setDraft] = useState("");
  const [edited, setEdited] = useState(false);
  const [appliedPrompt, setAppliedPrompt] = useState("");
  const [directOpen, setDirectOpen] = useState(false);
  const [kindOverride, setKindOverride] = useState("");
  const [error, setError] = useState("");
  const [showOrigin, setShowOrigin] = useState(false);
  const mapRef = useRef(null);
  const draftRef = useRef(null);
  const request = explorationRequest(ids);
  const current = request.path.at(-1);
  const topic = request.path[0];
  const options = current?.children || [];
  const preview = (current ? options : explorationTopics).find((item) => item.id === hovered);
  const pending = edited && appliedPrompt !== request.goal;
  const kind = kindOverride || request.kind;
  const dockOpen = Boolean(current || directOpen || draft);

  const choose = (nextIds) => {
    const next = explorationRequest(nextIds);
    setIds(next.path.map((item) => item.id));
    setHovered(null);
    setError("");
    setKindOverride("");
    if (!edited) { setDraft(next.goal); setAppliedPrompt(next.goal); }
  };
  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    if (!onCreateTask?.({ goal: draft.trim(), kind, attachments: [], groupId: "other" })) setError("暂时未能创建任务。可能已有同名任务，请调整需求后重试。");
  };
  const openDirect = () => {
    setDirectOpen(true);
    requestAnimationFrame(() => draftRef.current?.focus());
  };
  const focusPreview = (event, id) => {
    if (event.pointerType !== "touch") setHovered(id);
  };

  return <section className={`explore-home${dockOpen ? " has-draft" : ""}`} aria-label="探索式首页">
    <header className="explore-home__header">
      <div className="explore-home__eyebrow"><IconSparkles size={14} /> 从一个方向开始</div>
      <h1>{current ? "让想法，再具体一点。" : "今天，想探索什么？"}</h1>
      <p>{current ? "选一个更接近你的目标，下面的需求会随之成形。" : "悬浮看看关联，点选一个起点，把想法连成可以开始的任务。"}</p>
      <div className="explore-home__origin">
        <button type="button" aria-expanded={showOrigin} onClick={() => setShowOrigin(!showOrigin)}><IconInfoCircle size={13} />{current ? "依据：你刚刚的选择" : "这些方向从哪里来"}</button>
        {showOrigin && <div className="explore-home__origin-popover" role="note">{current ? `当前关联来自你选择的「${request.path.map((item) => item.label).join(" → ")}」。它们是可选的下一步，尚未判断问题原因。` : "这里是预设的任务探索地图，帮助你找到起点。尚未读取你的训练日志，也没有据此判断你遇到了什么问题。"}</div>}
      </div>
    </header>

    <nav className="explore-home__trail" aria-label="探索路径">
      <button type="button" onClick={() => choose([])} aria-current={!current ? "page" : undefined}>全部方向</button>
      {request.path.map((item, index) => <span key={item.id}><IconChevronRight size={12} /><button type="button" aria-current={index === request.path.length - 1 ? "page" : undefined} onClick={() => choose(ids.slice(0, index + 1))}>{item.label}</button></span>)}
      {current && <button type="button" className="explore-home__back" onClick={() => choose(ids.slice(0, -1))}>返回上一级</button>}
    </nav>

    {!current ? <div className={`explore-atlas${hovered ? " is-previewing" : ""}`} aria-label="可探索的任务方向">
      {explorationTopics.map((item) => {
        const Icon = topicIcons[item.icon];
        const active = hovered === item.id;
        return <div key={item.id} className={`explore-island explore-island--${item.tone}${active ? " is-active" : ""}`} onPointerEnter={(event) => focusPreview(event, item.id)} onPointerLeave={() => setHovered(null)} onFocusCapture={() => setHovered(item.id)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(null); }}>
          <svg className="explore-island__links" viewBox="0 0 320 170" preserveAspectRatio="none" aria-hidden="true"><path d="M160 80 C120 80 100 34 65 34 M160 80 C205 80 210 34 255 34 M160 90 C120 90 100 143 65 143 M160 90 C210 90 210 143 255 143" /></svg>
          <button type="button" className="explore-island__topic" onClick={() => choose([item.id])}><Icon size={19} stroke={1.6} /><strong>{item.label}</strong><IconArrowUpRight className="explore-island__arrow" size={15} /></button>
          <span className="explore-island__keywords" aria-hidden="true">{item.keywords}</span>
          <div className="explore-island__satellites">{item.children.map((child, index) => <button type="button" key={child.id} className={`explore-island__satellite satellite-${index}`} onClick={() => choose([item.id, child.id])}>{child.label}</button>)}</div>
        </div>;
      })}
    </div> : <div className={`explore-map${!options.length ? " is-leaf" : ""}`} ref={mapRef}>
      <Connections containerRef={mapRef} revision={`${ids.join("/")}:${options.length}`} hovered={hovered} />
      <div className="explore-map__root" data-graph-root>
        <span className="explore-map__root-eyebrow">{topic.label}</span>
        <strong>{current.label}</strong>
        <span className="explore-map__root-hint">{current.hint}</span>
        <span className="explore-map__root-selected"><IconCheck size={12} /> 已加入需求</span>
      </div>
      {options.length > 0 ? <div className="explore-map__branches" aria-label={`${current.label}的关联方向`}>
        {options.map((item) => <button type="button" key={item.id} data-graph-node={item.id} className={`explore-map__node${hovered === item.id ? " is-previewed" : ""}`} onPointerEnter={(event) => focusPreview(event, item.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(item.id)} onBlur={() => setHovered(null)} onClick={() => choose([...ids, item.id])}>
          <span className="explore-map__node-label">{item.label}<IconArrowUpRight size={15} /></span>
          <span className="explore-map__node-hint">{item.hint}</span>
        </button>)}
      </div> : <div className="explore-map__ready" data-graph-node="ready">
        <IconCheck size={21} stroke={1.7} /><h2>已经有一个清楚的起点</h2><p>检查下方需求，补充你的现场，再开始任务。</p>
        <button type="button" onClick={openDirect}>补充我的情况 <IconEdit size={13} /></button>
      </div>}
    </div>}

    <div className="explore-home__caption" aria-live="polite">{preview ? <><span>{preview.label}</span><span>{preview.hint}</span><small>点击加入需求</small></> : <span>{current ? options.length ? "关联方向来自当前选择；你也可以直接编辑需求并开始。" : "尚未运行分析。发送后，从你的环境和材料开始。" : "这里展示可探索的任务，不代表已经识别出你的问题。"}</span>}</div>

    {dockOpen ? <form className="explore-draft" onSubmit={submit}>
      <div className="explore-draft__top"><span className="explore-draft__label"><IconSparkles size={14} />{edited ? "你的需求" : "你的需求，正在成形"}</span>
        <div className="explore-draft__chips" aria-label="已选择的条件">{request.path.map((item, index) => <button type="button" key={item.id} title={`移除${item.label}及后续选择`} onClick={() => choose(ids.slice(0, index))}>{item.label}<IconX size={10} /></button>)}</div>
        {!current && <button type="button" className="explore-draft__close" aria-label="收起需求编辑" onClick={() => setDirectOpen(false)} disabled={Boolean(draft)}><IconX size={14} /></button>}
      </div>
      <textarea ref={draftRef} value={draft} maxLength={2000} rows={3} onChange={(event) => { setDraft(event.target.value); setEdited(true); setError(""); }} aria-label="可发送的需求" placeholder="直接描述你想完成的事，也可以先从上方选择一个方向…" />
      <div className="explore-draft__bottom">
        {pending ? <button className="explore-draft__regenerate" type="button" onClick={() => { setDraft(request.goal); setAppliedPrompt(request.goal); setEdited(false); }}>保留了你的编辑 · 按当前选择重新生成</button> : <span className="explore-draft__note">可以自由修改 · 点击发送后才创建任务</span>}
        <label className="explore-draft__kind"><span>创建为</span><select aria-label="创建的任务类型" value={kind} onChange={(event) => setKindOverride(event.target.value)}><option value="development">开发任务</option><option value="learning">学习任务</option></select></label>
        <button className="explore-draft__send" type="submit" disabled={!draft.trim()}>发送并开始<IconArrowRight size={15} /></button>
      </div>
      {error && <p className="explore-draft__error" role="alert">{error}</p>}
    </form> : <div className="explore-home__direct"><span>已经有明确的想法？</span><button type="button" onClick={openDirect}><IconEdit size={15} />直接说说你的目标<IconArrowRight size={14} /></button><button type="button" className="explore-home__demo" onClick={() => choose(["training"])}>试试训练调优<IconArrowUpRight size={13} /></button></div>}
  </section>;
}
