import { useLayoutEffect, useRef, useState } from "react";
import {
  IconArrowRight, IconArrowUpRight, IconBook, IconCheck, IconChevronRight,
  IconCode, IconCpu, IconEdit, IconInfoCircle, IconRoute, IconSettings,
  IconSparkles, IconTrendingUp, IconX,
} from "@tabler/icons-react";
import { explorationTopics, explorationRequest, resolveExplorationPath } from "./home-exploration";
import "./explore-task-home.css";

const topicIcons = {
  training: IconTrendingUp,
  deployment: IconCpu,
  operator: IconCode,
  migration: IconRoute,
  environment: IconSettings,
  learning: IconBook,
};

function appendPreviewPath(ids, previewIds, nodeId) {
  return [...previewIds, nodeId].filter((id, index, path) => {
    const resolved = resolveExplorationPath([...ids, ...path.slice(0, index + 1)]);
    return resolved.at(-1)?.id === id;
  });
}

export function ExploreTaskHome({ onCreateTask }) {
  const [ids, setIds] = useState([]);
  const [previewIds, setPreviewIds] = useState([]);
  const [connections, setConnections] = useState({ width: 0, height: 0, source: null, paths: [] });
  const [hoveredId, setHoveredId] = useState(null);
  const [draft, setDraft] = useState("");
  const [edited, setEdited] = useState(false);
  const [appliedPrompt, setAppliedPrompt] = useState("");
  const [kindOverride, setKindOverride] = useState("");
  const [error, setError] = useState("");
  const [showOrigin, setShowOrigin] = useState(false);
  const homeRef = useRef(null);
  const fieldRef = useRef(null);
  const connectionSourceRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const draftRef = useRef(null);
  const previewTimer = useRef(null);
  const pointerNodeId = useRef(null);

  const request = explorationRequest(ids);
  const activeIds = [...ids, ...previewIds];
  const activePath = resolveExplorationPath(activeIds);
  const focused = activePath.at(-1);
  const options = focused?.children || explorationTopics;
  const hovered = options.find((item) => item.id === hoveredId);
  const isPreviewing = previewIds.length > 0;
  const kind = kindOverride || request.kind;
  const pending = edited && appliedPrompt !== request.goal;
  const completeLeaf = Boolean(focused && options.length === 0);
  const focusedId = focused?.id || "";

  useLayoutEffect(() => {
    if (homeRef.current) homeRef.current.scrollTop = 0;
  }, [focusedId]);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    const source = connectionSourceRef.current;
    if (!focused || options.length === 0 || !field || !source) {
      setConnections({ width: 0, height: 0, source: null, paths: [] });
      return undefined;
    }

    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const fieldRect = field.getBoundingClientRect();
        const sourceRect = source.getBoundingClientRect();
        const focusRect = field.querySelector(".explore-field__focus")?.getBoundingClientRect();
        const sx = sourceRect.left + sourceRect.width / 2 - fieldRect.left;
        const sy = sourceRect.top + sourceRect.height / 2 - fieldRect.top;
        const branchY = Math.max(sy + 13, focusRect ? focusRect.bottom - fieldRect.top + 4 : sy + 13);
        const paths = options.flatMap((item, index) => {
          const node = nodeRefs.current.get(item.id);
          if (!node) return [];
          const rect = node.getBoundingClientRect();
          const tx = rect.left + rect.width / 2 - fieldRect.left;
          const ty = rect.top + 4 - fieldRect.top;
          const curveDepth = Math.min(44, Math.max(18, Math.abs(tx - sx) * 0.06));
          return [{
            id: item.id,
            index,
            color: getComputedStyle(node).getPropertyValue("--node-color").trim() || "#6275d6",
            d: `M ${sx} ${branchY} C ${sx} ${branchY + curveDepth}, ${tx} ${ty + curveDepth}, ${tx} ${ty}`,
            x: tx,
            y: ty,
          }];
        });
        setConnections({
          width: fieldRect.width,
          height: fieldRect.height,
          source: { x: sx, y: sy, branchY },
          paths,
        });
      });
    };

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(field);
    observer?.observe(source);
    options.forEach((item) => {
      const node = nodeRefs.current.get(item.id);
      if (node) observer?.observe(node);
    });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [focusedId, options, hoveredId]);

  const choose = (nextIds) => {
    window.clearTimeout(previewTimer.current);
    previewTimer.current = null;
    pointerNodeId.current = null;
    const next = explorationRequest(nextIds);
    setIds(next.path.map((item) => item.id));
    setPreviewIds([]);
    setHoveredId(null);
    setError("");
    setKindOverride("");
    if (!edited) {
      setDraft(next.goal);
      setAppliedPrompt(next.goal);
    }
  };

  const preview = (node) => {
    window.clearTimeout(previewTimer.current);
    setHoveredId(node.id);
    previewTimer.current = window.setTimeout(() => {
      setPreviewIds((current) => appendPreviewPath(ids, current, node.id));
      previewTimer.current = null;
    }, 320);
  };

  const moveOnNode = (node, event) => {
    if (event.pointerType === "touch" || pointerNodeId.current === node.id) return;
    pointerNodeId.current = node.id;
    if (node.children.length) preview(node);
    else setHoveredId(node.id);
  };

  const leaveNode = (node) => {
    if (pointerNodeId.current !== node.id) return;
    window.clearTimeout(previewTimer.current);
    previewTimer.current = null;
    pointerNodeId.current = null;
    setHoveredId(null);
  };

  const leaveField = () => {
    window.clearTimeout(previewTimer.current);
    previewTimer.current = null;
    pointerNodeId.current = null;
    setPreviewIds([]);
    setHoveredId(null);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    if (!onCreateTask?.({ goal: draft.trim(), kind, attachments: [], groupId: "other" })) {
      setError("暂时未能创建任务。可能已有同名任务，请调整需求后重试。");
    }
  };

  const sourceText = isPreviewing || request.path.length
    ? "当前词条来自预设的探索地图，按你悬浮或点击的路径逐层展开；它们不是对你的训练现场、日志或问题的判断。"
    : "这里是人工整理的任务探索方向，不是个性化推荐，也没有读取你的训练日志。先悬浮预览；点击后才会加入需求。";

  return <section ref={homeRef} className="explore-home" aria-label="探索式首页" onPointerLeave={leaveField}>
    <header className="explore-home__header">
      <div className="explore-home__heading">
        <div className="explore-home__eyebrow"><IconSparkles size={14} /> 任务探索 · 预设能力地图</div>
        <h1>{focused ? focused.label : "今天，想探索什么？"}</h1>
        <p>{focused ? focused.hint : "悬浮一个方向，看看它能展开哪些相关内容。"}</p>
      </div>
      <div className="explore-home__origin">
        <button type="button" aria-expanded={showOrigin} onClick={() => setShowOrigin(!showOrigin)}>
          <IconInfoCircle size={14} />这些词条从哪里来
        </button>
        {showOrigin && <div className="explore-home__origin-popover" role="note">{sourceText}</div>}
      </div>
    </header>

    <nav className="explore-home__trail" aria-label="探索路径">
      <button type="button" onClick={() => choose([])} aria-current={!focused ? "page" : undefined}>全部方向</button>
      {activePath.map((item, index) => {
        const locked = index < ids.length;
        return <span key={item.id}>
          <IconChevronRight size={13} />
          <button
            type="button"
            className={locked ? "" : "is-preview"}
            aria-current={index === activePath.length - 1 ? "page" : undefined}
            onClick={() => choose(activeIds.slice(0, index + 1))}
          >{item.label}</button>
        </span>;
      })}
      {request.path.length > 0 && <button className="explore-home__back" type="button" onClick={() => choose(ids.slice(0, -1))}>
        <IconArrowUpRight size={13} />返回上一级
      </button>}
      {isPreviewing && <span className="explore-home__preview-label">悬浮预览 · 点击节点锁定</span>}
    </nav>

    <div
      ref={fieldRef}
      className={"explore-field" + (focused ? " is-focused" : "") + (isPreviewing ? " is-previewing" : "") + (completeLeaf ? " is-leaf" : "")}
      aria-label={focused ? focused.label + "相关方向" : "可探索的任务方向"}
    >
      {connections.paths.length > 0 && <svg
        className="explore-field__connections"
        width={connections.width}
        height={connections.height}
        viewBox={`0 0 ${connections.width} ${connections.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {connections.source && <path
          className="explore-field__connection-source"
          d={`M ${connections.source.x} ${connections.source.y} L ${connections.source.x} ${connections.source.branchY}`}
        />}
        {connections.paths.map((path) => <g key={path.id}>
          <path
            className={"explore-field__connection" + (hoveredId === path.id ? " is-active" : "")}
            d={path.d}
            pathLength="1"
            style={{ "--connection-index": path.index, "--connection-color": path.color }}
          />
          <circle className="explore-field__connection-end" cx={path.x} cy={path.y} r="2" style={{ "--connection-color": path.color }} />
        </g>)}
      </svg>}
      {focused && <div className="explore-field__focus">
        <span className="explore-field__focus-mark"><i ref={connectionSourceRef} aria-hidden="true" />{isPreviewing ? "正在预览" : "当前方向"}</span>
        <strong>{isPreviewing ? "点击锁定这个方向，或继续悬浮下钻。" : "已加入需求草稿。"}</strong>
        {isPreviewing && <button className="explore-field__lock" type="button" onClick={() => choose(activeIds)}>
          锁定「{focused.label}」<IconCheck size={12} />
        </button>}
      </div>}
      {options.length > 0 ? <div className="explore-field__nodes" data-count={options.length}>
        {options.map((item, index) => {
          const Icon = topicIcons[item.icon];
          const rootNode = activePath.length === 0;
          const tone = item.tone || (rootNode ? "violet" : focused?.tone || "blue");
          const label = rootNode ? "探索方向" : item.children.length ? "关联方向" : "下一步";
          return <button
            type="button"
            key={item.id}
            ref={(element) => {
              if (element) nodeRefs.current.set(item.id, element);
              else nodeRefs.current.delete(item.id);
            }}
            className={"explore-field__node explore-field__node--" + tone + (hoveredId === item.id ? " is-hovered" : "") + (rootNode ? " is-topic" : "")}
            style={{ "--node-index": index }}
            onPointerMove={(event) => moveOnNode(item, event)}
            onPointerLeave={() => leaveNode(item)}
            onFocus={() => setHoveredId(item.id)}
            onBlur={(event) => {
              if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) setHoveredId(null);
            }}
            onClick={() => choose([...activeIds, item.id])}
            aria-label={item.label + "。 " + item.hint + (item.children.length ? "。点击进入相关方向。" : "。点击加入需求草稿。")}
          >
            <span className="explore-field__node-content">
              <span className="explore-field__node-kind">
                <i aria-hidden="true" />
                {Icon && rootNode ? <Icon size={13} stroke={1.8} /> : null}
                {label}
              </span>
              <strong>{item.label}</strong>
              <span className="explore-field__node-hint">{item.hint}</span>
              <span className="explore-field__node-action">{item.children.length ? "继续展开" : "加入需求"} <IconArrowUpRight size={13} /></span>
            </span>
          </button>;
        })}
      </div> : <div className="explore-field__leaf">
        <span className="explore-field__leaf-mark"><IconCheck size={15} /></span>
        <div><span>这个方向已经具体到可开始</span><p>检查下方需求，补充你的现场，再发送并开始。</p></div>
        <button type="button" onClick={() => draftRef.current?.focus()}><IconEdit size={14} />编辑需求</button>
      </div>}
      <div className="explore-field__note" aria-live="polite">
        {hovered ? <><strong>{hovered.label}</strong><span>{hovered.hint}</span><small>{hovered.children.length ? "悬浮预览下一层 · 点击后锁定" : "点击加入需求草稿"}</small></>
          : focused ? <><strong>{focused.label}</strong><span>{focused.children.length ? "这一层只展示当前主题下的相关方向。" : "这条路径会作为可编辑需求草稿。"}</span></>
            : <span>主题词来自预设地图；它们是探索入口，不代表已经识别出你的问题。</span>}
      </div>
    </div>

    <form className="explore-composer" onSubmit={submit}>
      <div className="explore-composer__main">
        <span className="explore-composer__spark"><IconSparkles size={19} /></span>
        <textarea
          ref={draftRef}
          value={draft}
          maxLength={2000}
          rows={2}
          onChange={(event) => { setDraft(event.target.value); setEdited(true); setError(""); }}
          aria-label="可发送的需求草稿"
          placeholder="描述你想完成的事，或先悬浮、点击一个探索方向…"
        />
        <button className="explore-composer__send" type="submit" disabled={!draft.trim()} aria-label="发送并开始">
          <IconArrowRight size={20} />
        </button>
      </div>
      <div className="explore-composer__footer">
        <span className="explore-composer__path" aria-label="已加入需求的条件">
          {request.path.length ? request.path.map((item, index) => <button type="button" key={item.id} title={"移除“" + item.label + "”及后续选择"} onClick={() => choose(ids.slice(0, index))}>
            {index > 0 && <IconChevronRight size={11} />}{item.label}<IconX size={11} />
          </button>) : <small>悬浮只预览 · 点击才加入 · 发送后才创建任务</small>}
        </span>
        {pending && <button className="explore-composer__regenerate" type="button" onClick={() => { setDraft(request.goal); setAppliedPrompt(request.goal); setEdited(false); }}>
          保留了你的编辑 · 按当前选择重新生成
        </button>}
        <label className="explore-composer__kind"><span>创建为</span><select aria-label="创建的任务类型" value={kind} onChange={(event) => setKindOverride(event.target.value)}>
          <option value="development">开发任务</option><option value="learning">学习任务</option>
        </select></label>
        <button className="explore-composer__submit" type="submit" disabled={!draft.trim()}>发送并开始<IconArrowRight size={14} /></button>
      </div>
      {error && <p className="explore-composer__error" role="alert">{error}</p>}
    </form>
  </section>;
}
