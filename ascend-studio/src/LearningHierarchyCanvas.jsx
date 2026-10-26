import { ICON_SIZE } from "./icon-system.js";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconAdjustments, IconArrowDown, IconArrowRight, IconArrowUp, IconBook, IconCheck, IconChevronDown, IconCode, IconCube, IconGripVertical, IconHistory, IconMessageQuestion, IconPhoto, IconPlayerPause, IconPlayerPlay, IconPointer, IconSearch, IconSettings, IconSparkles, IconX } from "@tabler/icons-react";
import LearningCanvasToolbar from "./LearningCanvasToolbar";
import CanvasCard from "./LearningCanvasCard";
import { CanvasMiniMap, CanvasSurface } from "./shared/canvas/index.jsx";
import { LEARNING_NODES, LEARNING_SEGMENTS, getLearningCode, getLearningShape } from "./learning-data";
import { stepsForStage } from "./learning-path-collaboration";
import { canvasNodeKey, nodeConnector, positionTreeNodes } from "./canvas-node-position";
import "./learning-hierarchy-canvas.css";

const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const stamp = seconds => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
const stageLabels = { environment: "环境准备", channels: "理解模型输入", practice: "完成输入转换", check: "核对输入与保存" };
const stageIcons = { environment: IconSettings, channels: IconBook, practice: IconCube, check: IconSearch };
function Button({ children, primary, className = "", ...props }) { return <button type="button" className={`lh-button${primary ? " is-primary" : ""} ${className}`} {...props}>{children}</button>; }

export function ChannelPhoto({ channel }) {
  const ref = useRef(null);
  useEffect(() => {
    let active = true;
    const source = new Image();
    source.onload = () => {
      if (!active || !ref.current) return;
      const context = ref.current.getContext("2d", { willReadFrequently: true });
      context.drawImage(source, 0, 0, 160, 160);
      const pixels = context.getImageData(0, 0, 160, 160);
      for (let index = 0; index < pixels.data.length; index += 4) for (let c = 0; c < 3; c++) if (c !== channel) pixels.data[index + c] = 0;
      context.putImageData(pixels, 0, 0);
    };
    source.src = asset("inference-input-cat.png");
    return () => { active = false; };
  }, [channel]);
  return <canvas ref={ref} width="160" height="160" role="img" aria-label={`${["R", "G", "B"][channel]} 通道像素分解`} />;
}

function TensorVisual({ journey, activeSubstep, stage }) {
  const { state, actions, shape } = journey;
  const activeFocus = stage === "channels" ? state.focus : activeSubstep;
  const shapeText = shape.valid ? `${shape.labels.join("")} [${shape.dimensions.join(", ")}]` : "轴顺序重复，无法生成有效形状";
  return <div className="lh-visual-body">
    <div className="lh-visual-flow">
      <figure className="lh-source-image"><img src={asset("inference-input-cat.png")} alt="用于图像预处理示例的虎斑猫照片" /><div className="lh-channel-images">{[0, 1, 2].map(channel => <button type="button" key={channel} aria-label={`查看${["R", "G", "B"][channel]}通道`} aria-pressed={state.channel === ["R", "G", "B"][channel]} onClick={() => actions.channel(state.channel === ["R", "G", "B"][channel] ? "all" : ["R", "G", "B"][channel])}><ChannelPhoto channel={channel} /><span>{["R", "G", "B"][channel]}</span></button>)}</div><figcaption><strong>RGB 图像</strong><span>HWC [224, 224, 3]</span></figcaption></figure>
      <div className="lh-tensor-sequence"><TensorShape label="HWC" dimensions="[224, 224, 3]" kind="hwc" active={activeFocus === "channels"} /><div className={`lh-transform${activeFocus === "layout" ? " is-active" : ""}`}><span>transpose</span><code>({stage === "channels" ? "2, 0, 1" : state.axes.join(", ")})</code><IconArrowRight size={32} /></div><TensorShape label="CHW" dimensions="[3, 224, 224]" kind="chw" active={activeFocus === "layout"} /><div className={`lh-transform${activeFocus === "batch" ? " is-active" : ""}`}><span>增加 batch</span><code>[None, ...]</code><IconArrowRight size={32} /></div><TensorShape label="NCHW" dimensions="[1, 3, 224, 224]" kind="nchw" active={activeFocus === "batch" || activeFocus === "result"} /></div>
    </div>
    <div className="lh-visual-caption"><span>照片通道来自上方同一张图；张量为概念示意。</span><code>{stage === "practice" ? `当前参数预览：${shapeText}` : activeFocus === "channels" ? "R、G、B 共同组成每个彩色像素" : activeFocus === "layout" ? "0 = H，1 = W，2 = C；把轴 2 移到最前" : "在 CHW 前补一个样本维度 N = 1"}</code></div>
  </div>;
}

export function TensorShape({ label, dimensions, kind, active }) {
  return <figure className={`lh-tensor-shape is-${kind}${active ? " is-active" : ""}`}><strong>{label}</strong><div className="lh-tensor-image"><img src={asset("inference-rgb-tensor.png")} alt={`${label} 三个通道平面的概念张量`} /><span className="lh-dimension-h">H<br />224</span><span className="lh-dimension-w">W · 224</span><span className="lh-dimension-c">C<br />3</span>{kind === "nchw" && <span className="lh-dimension-n">N = 1</span>}</div><figcaption>{label} {dimensions}</figcaption></figure>;
}

function Player({ journey, onAsk }) {
  const { state, actions } = journey;
  const segment = [...LEARNING_SEGMENTS].reverse().find(item => state.time >= item.time) || LEARNING_SEGMENTS[0];
  return <section className="lh-player"><header><IconPlayerPlay size={ICON_SIZE.control} /><strong>图像输入预处理</strong><span>动态讲解示例 · 60 秒</span></header><div className="lh-player-caption"><small>{stamp(state.time)} · {segment.title}</small><p>{segment.caption}</p><button type="button" className="lh-text-button" onClick={() => onAsk?.({ kind: "learning", focus: segment.focus, time: state.time, subtitle: segment.caption, title: segment.title })}><IconMessageQuestion size={ICON_SIZE.inline} />解释这句</button></div><div className="lh-player-controls"><button type="button" className="lh-icon-button" aria-label={state.playing ? "暂停学习讲解" : "播放学习讲解"} onClick={actions.play}>{state.playing ? <IconPlayerPause size={ICON_SIZE.heading} /> : <IconPlayerPlay size={ICON_SIZE.heading} />}</button><input type="range" min="0" max="60" step=".5" value={state.time} aria-label="学习讲解进度" onChange={event => actions.seek(event.target.value)} /><span>{stamp(state.time)} / 01:00</span></div><div className="lh-player-chapters">{LEARNING_SEGMENTS.map(item => <button type="button" key={item.focus} aria-pressed={state.focus === item.focus} onClick={() => actions.seek(item.time)}><small>{stamp(item.time)}</small>{item.title}</button>)}</div></section>;
}

function CodePractice({ journey, activeSubstep, onCopy, onContinue }) {
  const { state, actions, shape, currentAttempt, pathCurrent } = journey;
  const code = getLearningCode(state);
  const selectedLine = activeSubstep === "layout" ? 3 : activeSubstep === "batch" ? 4 : 5;
  return <div className="lh-code-body"><div className="lh-code" role="region" aria-label="预处理练习代码">{code.split("\n").map((line, index) => <div className={index === selectedLine ? "is-highlighted" : ""} key={index}><span>{index + 1}</span><code>{line}</code></div>)}</div><div className="lh-code-actions"><span>Python · 参数生成示例</span><button className="lh-text-button" type="button" onClick={() => onCopy?.(code)}>复制代码</button></div><div className="lh-practice-parameters"><label className="lh-parameter-label">通道顺序（transpose）</label><div className="lh-axis-selects">{state.axes.map((axis, index) => <label key={index}><span>输出轴 {index}</span><select aria-label={`学习输出轴 ${index}`} value={axis} onChange={event => actions.axis(index, event.target.value)}>{[0, 1, 2].map(value => <option key={value} value={value}>{value} · {["H", "W", "C"][value]}</option>)}</select></label>)}</div><label className="lh-checkbox"><input type="checkbox" checked={state.batch} onChange={event => actions.batch(event.target.checked)} />增加 batch · N = 1</label></div><div className="lh-current-shape"><span>当前形状（预览）</span><code>{shape.valid ? `[${shape.dimensions.join(", ")}]` : "轴 0、1、2 各使用一次"}</code><small>{currentAttempt ? currentAttempt.passed ? "本次检查通过" : "本次需调整" : "待检查"}</small></div><Button primary className="lh-run-button" disabled={!state.path || !pathCurrent} onClick={actions.runPractice}><IconPlayerPlay size={ICON_SIZE.control} />运行练习检查</Button>{currentAttempt ? <div className={`lh-inline-result${currentAttempt.passed ? " is-pass" : ""}`}><strong>尝试 {state.attempts.indexOf(currentAttempt) + 1} · {currentAttempt.time} · {currentAttempt.passed ? "通过" : "需要调整"}</strong><p>{currentAttempt.passed ? "输出 (1, 3, 224, 224)，轴顺序和 batch 符合示例。" : !currentAttempt.valid ? "三个输出轴需要各使用一次 0、1、2。" : "将轴顺序调整为 2、0、1，再补充 batch 维度。"}</p>{currentAttempt.passed && <button className="lh-text-button" type="button" onClick={onContinue}>继续核对输入<IconArrowRight size={ICON_SIZE.inline} /></button>}</div> : state.attempts.length > 0 && <p className="lh-old-condition">当前参数已改变，历史结果按原条件保留；请重新运行。</p>}<AttemptHistory journey={journey} /><p className="lh-boundary">浏览器仅演算维度；未执行 Python 或模型 / NPU。</p></div>;
}

function AttemptHistory({ journey }) {
  const { state, currentAttempt } = journey;
  return state.attempts.length > 0 && <details className="lh-history"><summary><IconHistory size={ICON_SIZE.inline} />练习记录 · {state.attempts.length} 次</summary>{[...state.attempts].reverse().map((attempt, index) => <div key={attempt.id}><strong>尝试 {state.attempts.length - index} · {attempt.time} · {attempt.passed ? "通过" : "需调整"}{attempt.id === currentAttempt?.id ? " · 当前条件" : " · 历史条件"}</strong><code>transpose({attempt.snapshot.axes.join(",")}) · batch {attempt.snapshot.batch ? "有" : "无"}</code><span>{attempt.valid ? `输出 [${attempt.dimensions.join(", ")}]` : "轴顺序重复"}</span><details><summary>当时的代码</summary><pre>{attempt.code}</pre></details></div>)}</details>;
}

function InputCheck({ journey, onRestore, onArchive, onEnterDevelopment }) {
  const { state, actions, shape, currentAttempt, currentCheck, pathCurrent, readyToComplete, currentSummary, summaryCurrent } = journey;
  return <div className="lh-check-body"><p>核对目标：NCHW [1, 3, 224, 224]。检查只关联这一次跟练。</p><dl><div><dt>当前输入</dt><dd>{shape.valid ? `${shape.labels.join("")} [${shape.dimensions.join(", ")}]` : "轴顺序无效"}</dd></div><div><dt>对应尝试</dt><dd>{currentAttempt ? `尝试 ${state.attempts.indexOf(currentAttempt) + 1} · ${currentAttempt.time}` : "当前参数待运行练习"}</dd></div><div><dt>理解内容</dt><dd>{state.understood.includes("channels") ? "已记录看过并理解" : "尚未标记理解"}</dd></div><div><dt>输入检查</dt><dd>{currentCheck ? `${currentCheck.time} · 当前条件符合` : state.checks.length ? "历史检查保留 · 当前待核对" : "待明确检查"}</dd></div></dl><Button primary disabled={!currentAttempt?.passed || !pathCurrent} onClick={actions.checkInput}>运行本次输入检查</Button>{currentCheck && <div className="lh-inline-result is-pass"><strong><IconCheck size={ICON_SIZE.inline} />本次示例形状核对通过</strong><span>尝试 {state.attempts.indexOf(currentAttempt) + 1} · {currentCheck.time}</span><p>真实模型的 dtype、归一化与输出仍需另行验证。</p></div>}{state.checks.length > 0 && <details className="lh-history"><summary>输入检查历史 · {state.checks.length}</summary>{[...state.checks].reverse().map(check => <div key={check.id}><strong>{check.time} · {check.id === currentCheck?.id ? "当前条件" : "历史条件"}</strong><code>[{check.dimensions.join(", ")}]</code><small>对应尝试 {state.attempts.findIndex(attempt => attempt.id === check.attemptId) + 1}</small></div>)}</details>}<Button primary disabled={!readyToComplete} onClick={actions.complete}>完成并保存学习记录<IconCheck size={ICON_SIZE.control} /></Button>{currentSummary && <section className="lh-saved-summary"><strong><IconCheck size={ICON_SIZE.heading} />学习记录已保存 · {currentSummary.time}</strong>{!summaryCurrent && <p className="lh-old-condition">这份记录属于保存时的条件；当前目标、路径或参数已改变。</p>}<p>{currentSummary.profile.goal}</p><span>看过：RGB、HWC / CHW、batch</span><span>检查通过：NCHW [{currentSummary.dimensions.join(", ")}]</span><small>尝试 {state.attempts.findIndex(attempt => attempt.id === currentSummary.attemptId) + 1} 与对应输入检查；模型推理未运行</small><div className="lh-actions"><Button onClick={onRestore}>恢复练习现场</Button><Button onClick={onArchive}>收起学习内容</Button></div>{!state.suggestionDismissed && <div className="lh-development-next"><strong>可选择的下一步</strong><p>把学过的方法用于图像推理，继续核对真实模型输入。</p><div className="lh-actions"><Button onClick={onEnterDevelopment}>进入图像推理任务<IconArrowRight size={ICON_SIZE.inline} /></Button><button type="button" className="lh-text-button" onClick={actions.dismissDevelopment}>暂不开始</button></div></div>}</section>}</div>;
}

function makeTree(layout, path, positions = {}) {
  let offset = 0;
  const stages = path.map((entry, index) => {
    const children = stepsForStage(entry);
    const horizontal = layout === "horizontal";
    const rect = horizontal ? { x: index * 300, y: 0, width: 272, height: 72 } : { x: 0, y: offset, width: 258, height: 72 };
    let stepOffset = 0;
    const steps = children.map((step, stepIndex) => {
      const annotated = Boolean(step.suggestion?.reason);
      const height = annotated ? (step.userAdjusted ? 132 : 118) : step.userAdjusted ? 76 : 47;
      const y = horizontal ? 88 + stepOffset : offset + 82 + stepOffset;
      stepOffset += height + 8;
      return { ...step, rect: horizontal ? { x: index * 300 + 12, y, width: 248, height } : { x: 32, y, width: 226, height } };
    });
    offset += 95 + stepOffset;
    return { ...entry, index, rect, steps, contentHeight: 88 + stepOffset };
  });
  return positionTreeNodes({ stages, width: layout === "horizontal" ? Math.max(258, path.length * 300 - 28) : 258, height: layout === "horizontal" ? Math.max(260, ...stages.map(stage => stage.contentHeight + 12)) : offset - 20 }, positions, "stages", "steps");
}

function HierarchyGroup({ tree, layout, selectedStage, selectedStep, journey, onSelect, onDrag, onMoveNode, scale = 1, minX = 8, minY = 8, pinned, agentTarget, editing = false }) {
  const { state, currentAttempt, currentCheck } = journey;
  const [dragPreview, setDragPreview] = useState(null);
  const pointerDrag = useRef(null);
  const suppressClick = useRef(false);
  const done = id => id === "channels" ? state.understood.includes("channels") : id === "practice" ? currentAttempt?.passed : id === "check" ? currentCheck?.passed : false;
  const finishNodeDrag = (event, commit = true) => {
    const drag = pointerDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    pointerDrag.current = null;
    if (!drag.active) return;
    if (commit) onMoveNode?.(drag.key, drag.current);
    suppressClick.current = true;
    window.setTimeout(() => { suppressClick.current = false; }, 0);
    setDragPreview(null);
  };
  const dragHandlers = (key, point) => editing ? {
    onPointerDown: event => {
      if (event.button !== 0 || pointerDrag.current) return;
      pointerDrag.current = { key, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, point, current: point, active: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove: event => {
      const drag = pointerDrag.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
      if (!drag.active && Math.hypot(dx, dy) < 4) return;
      drag.active = true;
      event.preventDefault();
      event.stopPropagation();
      drag.current = { x: Math.max(minX, drag.point.x + dx / scale), y: Math.max(minY, drag.point.y + dy / scale) };
      setDragPreview({ key: drag.key, point: drag.current });
    },
    onPointerUp: finishNodeDrag,
    onPointerCancel: event => finishNodeDrag(event, false),
    onKeyDown: event => {
      if (!event.altKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const delta = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[event.key];
      onMoveNode?.(key, { x: Math.max(minX, point.x + delta[0]), y: Math.max(minY, point.y + delta[1]) });
    },
  } : {};
  const liveTree = dragPreview ? positionTreeNodes(tree, { [dragPreview.key]: dragPreview.point }, "stages", "steps") : tree;
  return <div className={`lh-hierarchy is-${layout}${editing ? " is-position-editing" : ""}`} style={{ width: liveTree.width, height: liveTree.height }}>
    {onDrag && <div className="lh-tree-grab" role="button" tabIndex={0} aria-label="移动完整学习层级" title={pinned ? "层级已固定" : "拖动学习层级"} onPointerDown={onDrag}><IconPointer size={ICON_SIZE.micro} />学习路径</div>}
    <svg className="lh-tree-lines" width={liveTree.width + 20} height={liveTree.height + 20} aria-hidden="true"><defs><marker id="lh-tree-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8" /></marker></defs>{liveTree.stages.map((stage, index) => {
      const next = liveTree.stages[index + 1];
      const rect = stage.rect;
      return <g key={stage.id}>{next && <path className="lh-stage-line" markerEnd="url(#lh-tree-arrow)" d={nodeConnector(rect, next.rect)} />}{stage.steps.map(step => <path className={`lh-child-line${stage.id === selectedStage && step.id === selectedStep ? " is-current" : ""}`} key={step.id} d={nodeConnector(rect, step.rect)} />)}</g>;
    })}</svg>
    {liveTree.stages.map(stage => {
      const Icon = stageIcons[stage.id] || IconBook;
      const stageKey = canvasNodeKey("stage", stage.id);
      return <div key={stage.id}><button data-learning-stage={stage.id} className={`lh-tree-node lh-stage-node${stage.id === selectedStage ? " is-selected" : ""}${stage.skipped ? " is-skipped" : ""}${agentTarget?.stageId === stage.id && !agentTarget.stepId ? " is-agent-target" : ""}${dragPreview?.key === stageKey ? " is-node-dragging" : ""}`} type="button" style={{ left: stage.rect.x, top: stage.rect.y, width: stage.rect.width, height: stage.rect.height }} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } onSelect(stage.id, stage.steps[0]?.id); }} aria-pressed={stage.id === selectedStage} aria-label={editing ? `${stageLabels[stage.id]}；拖动调整画布位置，学习顺序不变` : stageLabels[stage.id]} title={editing ? "拖动调整画布位置；Alt + 方向键可微调" : "选择学习阶段"} {...dragHandlers(stageKey, stage.rect)}><span className={`lh-node-icon${done(stage.id) ? " is-done" : ""}`}>{done(stage.id) ? <IconCheck size={ICON_SIZE.navigation} /> : <Icon size={ICON_SIZE.navigation} />}</span><span><strong>{stage.id === "environment" ? "" : `0${stage.index}　`}{stageLabels[stage.id]}</strong><small>{stage.skipped ? state.draftPath ? "拟跳过 · 待你决定" : "已跳过" : LEARNING_NODES.find(item => item.id === stage.id)?.description}</small></span>{stage.skipped && <em>跳过</em>}{editing && <IconGripVertical className="lh-node-move-grip" size={ICON_SIZE.inline} aria-hidden="true" />}</button>{stage.steps.map((step, index) => {
        const proposedSkip = step.suggestion?.kind === "skip" && step.suggestion.status === "pending";
        const proposedAdd = step.suggestion?.kind === "add" && step.suggestion.status === "pending";
        const proposedRevise = step.suggestion?.kind === "revise" && step.suggestion.status === "pending";
        const acceptedSuggestion = step.suggestion?.status === "accepted";
        const stepKey = canvasNodeKey("step", stage.id, step.id);
        const nodeClass = `lh-tree-node lh-step-node${stage.id === selectedStage && step.id === selectedStep ? " is-selected" : ""}${step.skipped || proposedSkip ? " is-skipped" : ""}${proposedAdd ? " is-proposed-add" : ""}${proposedRevise ? " is-proposed-revise" : ""}${acceptedSuggestion ? " is-proposal-accepted" : ""}${dragPreview?.key === stepKey ? " is-node-dragging" : ""}${agentTarget?.stageId === stage.id && agentTarget.stepId === step.id ? " is-agent-target" : ""}`;
        const change = step.suggestion?.status === "pending" ? (state.pathChanges || []).find(item => item.id === step.suggestion.id && item.status === "pending") : null;
        return <div className={`lh-step-wrap${step.suggestion?.reason ? " has-review" : ""}${step.userAdjusted ? " is-user-adjusted" : ""}${dragPreview?.key === stepKey ? " is-dragging" : ""}`} key={step.id} style={{ left: step.rect.x, top: step.rect.y, width: step.rect.width, height: step.rect.height }}>
          <button data-learning-stage={stage.id} data-learning-step={step.id} className={nodeClass} type="button" onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } onSelect(stage.id, step.id); }} aria-pressed={stage.id === selectedStage && step.id === selectedStep} aria-label={editing ? `${step.title}；拖动调整画布位置，学习顺序不变` : `${step.title}；选择节点查看学习内容`} title={editing ? "拖动调整画布位置；Alt + 方向键可微调" : "选择学习节点查看内容"} {...dragHandlers(stepKey, step.rect)}>
            <span className="lh-step-index">{stage.index}.{index + 1}</span><span className="lh-step-copy"><strong>{proposedRevise ? step.suggestion.patch?.title || step.title : step.title}</strong><small>{proposedRevise ? step.suggestion.patch?.subtitle || step.subtitle : step.subtitle}</small>{step.userAdjusted && <small className="lh-step-user-adjusted">你已调整顺序</small>}{step.suggestion?.reason && <small className="lh-step-reason">{step.suggestion.reason}</small>}</span>
            {proposedSkip && <em className="lh-step-suggestion is-skip">AI 提议跳过</em>}{proposedAdd && <em className="lh-step-suggestion">AI 提议 · 待确认</em>}{proposedRevise && <em className="lh-step-suggestion">AI 提议 · 调整内容</em>}{acceptedSuggestion && <em className="lh-step-suggestion is-accepted">已采纳</em>}
            {editing && <IconGripVertical className="lh-node-move-grip" size={ICON_SIZE.inline} aria-hidden="true" />}
          </button>
          {change && <div className="lh-draft-node-actions" aria-label={`${change.title}的建议操作`}><button type="button" onClick={event => { event.preventDefault(); event.stopPropagation(); journey.actions.resolvePathChange(change.id, true); }}>采纳</button><button type="button" onClick={event => { event.preventDefault(); event.stopPropagation(); journey.actions.resolvePathChange(change.id, false); }}>忽略</button></div>}
        </div>;
      })}</div>;
    })}
  </div>;
}

function GoalObject({ journey, onGenerate, onReturn }) {
  const { state, actions } = journey;
  const id = useId();
  return <div className="lh-goal-body"><span className="lh-kicker">从学习目标开始</span><h2>这次想学会什么？</h2><label htmlFor={`${id}-goal`}>学习目标<textarea id={`${id}-goal`} rows={2} maxLength={2000} value={state.profile.goal} onChange={event => actions.setProfile({ goal: event.target.value })} /></label><label htmlFor={`${id}-background`}>已有基础<textarea id={`${id}-background`} rows={2} maxLength={1000} value={state.profile.background} onChange={event => actions.setProfile({ background: event.target.value })} /></label><label className="lh-time-label" htmlFor={`${id}-time`}>每天可用时间<select id={`${id}-time`} value={state.profile.dailyMinutes} onChange={event => actions.setProfile({ dailyMinutes: Number(event.target.value) })}>{[10, 15, 20, 30, 45, 60].map(minutes => <option key={minutes} value={minutes}>{minutes} 分钟</option>)}</select></label><Button primary disabled={!state.profile.goal.trim()} onClick={() => onGenerate("goal")}>生成学习路径<IconArrowRight size={ICON_SIZE.inline} /></Button>{state.path && <button type="button" className="lh-text-button" onClick={onReturn}>回看已有路径</button>}<p className="lh-boundary">当前路径由图像预处理示例模板准备，目标与基础会保留在任务中。</p></div>;
}

export function LearningHierarchyCanvas({ journey, view, visible = true, agentAction = null, onAgentActionComplete, onOpen, onAsk, onCopy, onArchive, onEnterDevelopment }) {
  const { state, actions } = journey;
  const { state: canvas, actions: canvasActions } = view;
  const host = useRef(null);
  const gesture = useRef(null);
  const current = useRef(null);
  const previousReview = useRef({ draft: false, stage: null, stepCount: 0 });
  const agentCompleteRef = useRef(onAgentActionComplete);
  const [size, setSize] = useState({ width: 1000, height: 760 });
  const [hand, setHand] = useState(false);
  const [positionEditing, setPositionEditing] = useState(false);
  const [agentCursor, setAgentCursor] = useState(null);
  const [agentTarget, setAgentTarget] = useState(null);
  useEffect(() => {
    if (!hand && !positionEditing) return undefined;
    const handleEscape = event => {
      if (event.key !== "Escape" || event.target?.closest?.('input,textarea,select,[contenteditable="true"],[role="textbox"]')) return;
      setHand(false);
      setPositionEditing(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [hand, positionEditing]);
  agentCompleteRef.current = onAgentActionComplete;
  const layout = canvas.layout;
  const path = state.draftPath || state.path;
  const isGoal = !path || canvas.selectedStage === "goal";
  const reviewingPath = canvas.selectedStage === "path";
  const tree = makeTree(layout, path || [], canvas.positions);
  const activeStage = canvas.selectedStage === "summary" ? "check" : ["environment", "channels", "practice", "check"].includes(canvas.selectedStage) ? canvas.selectedStage : state.activeNode || "channels";
  const activeStageSteps = stepsForStage(path?.find(stage => stage.id === activeStage));
  const selectedStep = canvas.selectedStage === "summary" ? "summary" : canvas.selectedStep || activeStageSteps[0]?.id;
  const selectedStepTitle = activeStageSteps.find(item => item.id === selectedStep)?.title || "选择子步骤继续";
  const pendingChanges = (state.pathChanges || []).filter(change => change.status === "pending");
  const proposedStepCount = (path || []).reduce((count, stage) => count + stepsForStage(stage).length, 0);
  const horizontal = layout === "horizontal";
  const diagramWidth = isGoal ? 820 : horizontal ? 830 : 850;
  const detailWidth = horizontal ? 700 : 850;
  const verticalPrimary = ["practice", "check"].includes(activeStage) ? "detail" : "diagram";
  const horizontalHierarchy = canvas.positions.hierarchy || { x: 42, y: 100 };
  const horizontalMaterialsY = horizontalHierarchy.y + tree.height + 96;
  const horizontalReviewY = horizontalMaterialsY + 160;
  const verticalHierarchy = canvas.positions.hierarchy || { x: 45, y: 90 };
  const verticalDiagramX = verticalHierarchy.x + tree.width + 60;
  const verticalDetailX = verticalDiagramX;
  const verticalContentY = verticalHierarchy.y + (reviewingPath ? 175 : 0);
  const verticalSecondaryY = verticalContentY + (verticalPrimary === "detail" ? 900 : 460);
  const defaults = isGoal
    ? { hierarchy: { x: 40, y: 90 }, goal: { x: 45, y: 105 }, diagram: { x: 550, y: 105 }, detail: { x: 550, y: 600 } }
    : horizontal
      ? {
        hierarchy: horizontalHierarchy,
        goal: { x: horizontalHierarchy.x, y: horizontalMaterialsY },
        diagram: { x: horizontalHierarchy.x, y: reviewingPath ? horizontalReviewY : horizontalMaterialsY },
        detail: { x: horizontalHierarchy.x + diagramWidth + 44, y: reviewingPath ? horizontalReviewY : horizontalMaterialsY },
      }
      : { hierarchy: verticalHierarchy, goal: { x: verticalDiagramX, y: verticalHierarchy.y }, diagram: { x: verticalDiagramX, y: verticalPrimary === "diagram" ? verticalContentY : verticalSecondaryY }, detail: { x: verticalDetailX, y: verticalPrimary === "detail" ? verticalContentY : verticalSecondaryY } };
  const position = id => canvas.positions[id] || defaults[id];
  const treePoint = position("hierarchy");
  const goalWidth = isGoal ? 440 : horizontal ? 830 : 1215;
  const showGoal = isGoal || reviewingPath && !state.draftPath;
  const showDiagram = isGoal || canvas.expanded && !state.draftPath;
  const showDetail = !isGoal && canvas.expanded && !state.draftPath;
  const showRestore = !isGoal && !canvas.expanded;
  const hierarchyRight = isGoal ? 0 : treePoint.x + tree.width;
  const estimatedRight = Math.max(
    hierarchyRight,
    showGoal ? position("goal").x + goalWidth : 0,
    showDiagram ? position("diagram").x + diagramWidth : 0,
    showDetail ? position("detail").x + detailWidth : 0,
    showRestore ? position("diagram").x + 320 : 0,
  );
  const estimatedBottom = Math.max(
    isGoal ? position("goal").y + 490 : 0,
    showGoal && !isGoal ? position("goal").y + 170 : 0,
    showDiagram ? position("diagram").y + 450 : 0,
    isGoal ? 0 : treePoint.y + tree.height,
    showDetail ? position("detail").y + 820 : 0,
    showRestore ? position("diagram").y + 100 : 0,
  );
  const world = { width: Math.max(isGoal ? 1450 : horizontal ? 1280 : 1580, estimatedRight + 80), height: Math.max(isGoal ? 1050 : 900, estimatedBottom + 90) };
  const viewport = canvas.viewport;
  const pinned = id => canvas.pinned.includes(id);
  const fitBounds = (bounds, padding = 34) => {
    const scale = Math.max(.35, Math.min(1.1, (size.width - padding * 2) / bounds.width, (size.height - padding * 2) / bounds.height));
    canvasActions.setViewport({ scale, x: padding - bounds.x * scale + Math.max(0, (size.width - padding * 2 - bounds.width * scale) / 2), y: padding - bounds.y * scale });
  };
  const objectBounds = id => {
    const element = [...(host.current?.querySelectorAll("[data-object-id]") || [])].find(item => item.dataset.objectId === id);
    return element ? { x: element.offsetLeft, y: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight } : null;
  };
  const focusObject = id => {
    const bounds = objectBounds(id);
    if (!bounds) return;
    const centerY = (size.height + 90) / 2;
    canvasActions.setViewport({ x: size.width / 2 - (bounds.x + bounds.width / 2) * viewport.scale, y: centerY - (bounds.y + bounds.height / 2) * viewport.scale });
  };
  const maximizeObject = id => {
    const bounds = objectBounds(id);
    if (!bounds) return;
    const topInset = size.width < 650 ? 112 : 86;
    const margin = 22;
    const availableHeight = Math.max(1, size.height - topInset - margin);
    const scale = Math.max(.2, Math.min(1.1, (size.width - margin * 2) / bounds.width, availableHeight / bounds.height));
    canvasActions.setViewport({ scale, x: (size.width - bounds.width * scale) / 2 - bounds.x * scale, y: topInset + (availableHeight - bounds.height * scale) / 2 - bounds.y * scale });
  };
  const fitPath = () => {
    canvasActions.setFocused(false);
    const elements = [...(host.current?.querySelectorAll(".lh-tree-position, .lh-card, .lh-restore-material") || [])].filter(element => element.getClientRects().length);
    const measured = elements.map(element => ({ x: element.offsetLeft, y: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight })).filter(rect => rect.width > 0 && rect.height > 0);
    if (!measured.length) {
      const point = position("hierarchy");
      fitBounds(isGoal ? { x: 20, y: 35, width: 1365, height: 710 } : { x: point.x - 20, y: point.y - 75, width: Math.max(tree.width, world.width - 80), height: Math.max(tree.height + 150, world.height - 150) });
      return;
    }
    const left = Math.min(...measured.map(rect => rect.x));
    const top = Math.min(...measured.map(rect => rect.y));
    const right = Math.max(...measured.map(rect => rect.x + rect.width));
    const bottom = Math.max(...measured.map(rect => rect.y + rect.height));
    const topWithToolbarClearance = Math.min(top, 100) - 75;
    fitBounds({ x: left - 20, y: topWithToolbarClearance, width: right - left + 40, height: bottom - topWithToolbarClearance });
  };
  current.current = { viewport, size, canvasActions };
  useEffect(() => {
    if (!host.current) return undefined;
    const observer = new ResizeObserver(entries => { const { width, height } = entries[0].contentRect; if (width > 0 && height > 0) setSize({ width, height }); });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || canvas.initialized || size.width < 50 || size.height < 50) return;
    fitPath();
    canvasActions.markInitialized();
  }, [visible, canvas.initialized, layout, size.width, size.height]);
  useEffect(() => {
    const previous = previousReview.current;
    const shouldFit = visible && state.draftPath && canvas.selectedStage === "path"
      && (!previous.draft || previous.stage !== "path" || previous.stepCount !== proposedStepCount);
    previousReview.current = { draft: Boolean(state.draftPath), stage: canvas.selectedStage, stepCount: proposedStepCount };
    if (shouldFit) requestAnimationFrame(fitPath);
  }, [visible, Boolean(state.draftPath), canvas.selectedStage, proposedStepCount, layout, size.width, size.height]);
  useEffect(() => {
    if (!agentAction?.id) return undefined;
    if (!visible) {
      agentCompleteRef.current?.(agentAction.id);
      return undefined;
    }
    const timers = [];
    let frame = 0;
    let cancelled = false;
    const later = (fn, delay) => timers.push(window.setTimeout(fn, delay));
    const launch = () => {
      if (cancelled || !host.current) return;
      setAgentCursor(null);
      setAgentTarget(null);
      const composer = document.querySelector('.composer textarea[aria-label="继续提问"]');
      const sendButton = composer?.closest(".composer")?.querySelector(".composer-submit .send-button");
      const sourceRect = (sendButton || composer)?.getBoundingClientRect();
      const fallbackRect = host.current.getBoundingClientRect();
      const start = sourceRect
        ? { x: sourceRect.left + sourceRect.width / 2, y: sourceRect.top + sourceRect.height / 2 }
        : { x: fallbackRect.left + 18, y: fallbackRect.top + fallbackRect.height * .72 };
      const targets = (agentAction.targets || []).map(target => {
        const nodes = [...(host.current?.querySelectorAll("[data-learning-stage]") || [])];
        const node = nodes.find(item => item.dataset.learningStage === target.stageId && (!target.stepId || item.dataset.learningStep === target.stepId));
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        return { stageId: target.stageId, stepId: target.stepId || null, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }).filter(Boolean);
      if (!targets.length) { agentCompleteRef.current?.(agentAction.id); return; }
      setAgentCursor({ ...start, phase: "ready", label: `Agent · ${agentAction.label || "调整路径"}` });
      const visit = index => {
        if (cancelled) return;
        if (index >= targets.length) {
          later(() => {
            if (cancelled) return;
            setAgentCursor(currentCursor => currentCursor ? { ...currentCursor, phase: "done" } : null);
            later(() => {
              if (cancelled) return;
              setAgentCursor(null);
              setAgentTarget(null);
              agentCompleteRef.current?.(agentAction.id);
            }, 360);
          }, 420);
          return;
        }
        const target = targets[index];
        setAgentTarget({ stageId: target.stageId, stepId: target.stepId });
        setAgentCursor(currentCursor => currentCursor ? { ...currentCursor, ...target, phase: index === 0 && agentAction.type === "move" ? "grabbing" : "moving" } : null);
        later(() => {
          if (cancelled) return;
          setAgentCursor(currentCursor => currentCursor ? { ...currentCursor, phase: "pressing" } : null);
          later(() => visit(index + 1), 180);
        }, 430);
      };
      frame = window.requestAnimationFrame(() => { frame = window.requestAnimationFrame(() => visit(0)); });
    };
    const launchTimer = window.setTimeout(launch, 130);
    return () => {
      cancelled = true;
      window.clearTimeout(launchTimer);
      timers.forEach(window.clearTimeout);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [agentAction?.id, visible]);
  useEffect(() => {
    const node = host.current;
    if (!node) return undefined;
    const wheel = event => {
      if (event.target.closest("textarea,select,.lh-code,.lh-history, .lh-check-body")) return;
      event.preventDefault();
      const { viewport: old, canvasActions: update } = current.current;
      if (event.ctrlKey || event.metaKey) {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        const scale = Math.max(.35, Math.min(1.6, old.scale * Math.exp(-event.deltaY * .002)));
        update.setViewport({ scale, x: x - (x - old.x) * scale / old.scale, y: y - (y - old.y) * scale / old.scale });
      } else update.setViewport({ x: old.x - event.deltaX, y: old.y - event.deltaY });
    };
    node.addEventListener("wheel", wheel, { passive: false });
    return () => node.removeEventListener("wheel", wheel);
  }, []);
  const zoom = amount => {
    const scale = Math.max(.35, Math.min(1.6, viewport.scale + amount));
    canvasActions.setViewport({ scale, x: size.width / 2 - (size.width / 2 - viewport.x) * scale / viewport.scale, y: size.height / 2 - (size.height / 2 - viewport.y) * scale / viewport.scale });
  };
  const beginObjectDrag = (event, id, point) => {
    if (pinned(id)) return;
    if (!event) { canvasActions.moveObject(id, point); return; }
    event.preventDefault(); event.stopPropagation();
    gesture.current = { id, startX: event.clientX, startY: event.clientY, original: point };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const select = (stage, step) => {
    canvasActions.select(stage, step);
    actions.openNode(stage);
    if (stage === "channels" && ["channels", "layout", "batch"].includes(step)) { const segment = LEARNING_SEGMENTS.find(item => item.focus === step); if (segment) actions.seek(segment.time); }
  };
  const generate = source => { if (actions.generatePath(source)) { canvasActions.select("path"); canvasActions.setExpanded(true); } };
  const chosenStage = tree.stages.find(stage => stage.id === activeStage);
  const selectedNode = chosenStage?.steps.find(step => step.id === selectedStep) || chosenStage?.steps[0];
  const start = selectedNode ? { x: treePoint.x + selectedNode.rect.x + (horizontal ? selectedNode.rect.width : selectedNode.rect.width / 2), y: treePoint.y + selectedNode.rect.y + (horizontal ? selectedNode.rect.height / 2 : selectedNode.rect.height) } : null;
  const horizontalMaterialsBelowTree = horizontal && Math.min(position("diagram").y, position("detail").y) >= treePoint.y + tree.height;
  const verticalMaterialsBesideTree = !horizontal && position("diagram").x >= treePoint.x + tree.width;
  const connection = (point, targetWidth, targetIndex) => horizontalMaterialsBelowTree
    ? `M${start.x},${start.y} V${treePoint.y + tree.height + 28 + targetIndex * 10} H${point.x + Math.min(targetWidth / 2, 70)} V${point.y - 3}`
    : verticalMaterialsBesideTree
      ? `M${start.x},${start.y} H${treePoint.x + tree.width + 28 + targetIndex * 9} V${point.y + 28} H${point.x - 3}`
      : horizontal
        ? `M${start.x},${start.y} H${treePoint.x + tree.width + 18 + targetIndex * 9} V${point.y + 28} H${point.x - 3}`
        : `M${start.x},${start.y} V${treePoint.y + tree.height + 35 + targetIndex * 10} H${point.x + Math.min(targetWidth / 2, 70)} V${point.y - 3}`;
  return <CanvasSurface as="div" ref={host} className={`learning-hierarchy-canvas path-editing-canvas${hand ? " is-hand" : ""}${positionEditing ? " is-position-editing" : ""}`} style={{ backgroundSize: `${Math.max(12, 20 * viewport.scale)}px ${Math.max(12, 20 * viewport.scale)}px`, backgroundPosition: `${viewport.x}px ${viewport.y}px` }} aria-label="可移动的学习层级与内容画布" onPointerDown={event => {
    if (event.button !== 0 || event.target.closest("button,input,textarea,select,summary,a,.lh-card,.lh-tree-node")) return;
    gesture.current = { id: "viewport", startX: event.clientX, startY: event.clientY, original: viewport };
    event.currentTarget.setPointerCapture(event.pointerId);
  }} onPointerMove={event => {
    const drag = gesture.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.startX, deltaY = event.clientY - drag.startY;
    if (drag.id === "viewport") canvasActions.setViewport({ x: drag.original.x + deltaX, y: drag.original.y + deltaY });
    else canvasActions.moveObject(drag.id, { x: drag.original.x + deltaX / viewport.scale, y: drag.original.y + deltaY / viewport.scale });
  }} onPointerUp={() => { gesture.current = null; }} onPointerCancel={() => { gesture.current = null; }}>
    <div className={`lh-canvas-title${state.draftPath ? " is-draft-path" : ""}`}><IconBook size={ICON_SIZE.feature} /><div className="lh-canvas-title-copy">{state.draftPath && <div className="lh-editing-state"><span className="lh-editing-dot" />学习路径草案 · 正在编辑<span>尚未开始学习</span></div>}<h2>{state.draftPath ? "与 AI 共创学习路径" : state.profile.goal || "我的学习目标"}</h2><p>{state.draftPath ? `目标：${state.profile.goal} · 进入位置编辑后可移动节点与关联卡片，路径顺序不变${pendingChanges.length ? ` · ${pendingChanges.length} 项 AI 调整待你决定` : " · 也可在左侧对话继续增删重点"}` : isGoal ? "从目标或现成路径开始一段可验证的学习" : `${stageLabels[activeStage]} · ${selectedStepTitle}`}</p></div></div>
    <LearningCanvasToolbar layout={layout} scale={viewport.scale} hand={hand} positionEditing={positionEditing} onTogglePositionEditing={() => { setPositionEditing(value => !value); setHand(false); }} onLayout={canvasActions.setLayout} onZoom={zoom} onResetZoom={() => canvasActions.setViewport({ scale: 1 })} onHand={() => { setHand(value => !value); setPositionEditing(false); }} onFit={fitPath} />
    {state.draftPath && <div className="lh-draft-controls" aria-label="路径共创整体操作"><Button primary disabled={pendingChanges.length > 0} title={pendingChanges.length ? "先决定所有 AI 调整" : "确认这条路径并进入学习"} onClick={() => { if (actions.confirmPath()) select("channels", "channels"); }}>确认路径并开始学习<IconArrowRight size={ICON_SIZE.inline} /></Button><Button disabled={!state.pathUndo?.length} onClick={actions.undoPathEdit}><IconHistory size={ICON_SIZE.inline} />撤销</Button><Button onClick={actions.cancelPath}>取消</Button></div>}
    <div className="lh-world" style={{ width: world.width, height: world.height, transform: `translate(${viewport.x}px,${viewport.y}px) scale(${viewport.scale})` }}>
    {!isGoal && <div className="lh-tree-position" style={{ left: treePoint.x, top: treePoint.y, width: tree.width, height: tree.height }}><HierarchyGroup tree={tree} layout={layout} selectedStage={activeStage} selectedStep={selectedStep} journey={journey} onSelect={select} onMoveNode={(id, point) => canvasActions.moveObject(id, point)} scale={viewport.scale} minX={8 - treePoint.x} minY={8 - treePoint.y} pinned={pinned("hierarchy")} agentTarget={agentTarget} editing={positionEditing} onDrag={positionEditing && !pinned("hierarchy") ? event => beginObjectDrag(event, "hierarchy", treePoint) : undefined} /></div>}
      {start && canvas.expanded && !state.draftPath && !reviewingPath && <svg className="lh-material-lines" width={world.width} height={world.height} aria-hidden="true"><defs><marker id="lh-material-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8" /></marker></defs><path d={connection(position("diagram"), diagramWidth, 0)} markerEnd="url(#lh-material-arrow)" /><path d={connection(position("detail"), detailWidth, 1)} markerEnd="url(#lh-material-arrow)" /><circle cx={start.x} cy={start.y} r="5" /></svg>}
      {isGoal && <CanvasCard id="goal" title="学习目标与基础" point={position("goal")} width={440} pinned={pinned("goal")} onDrag={positionEditing && !pinned("goal") ? beginObjectDrag : undefined} onFocus={focusObject} onMaximize={maximizeObject} onTogglePin={canvasActions.togglePin}><GoalObject journey={journey} onGenerate={generate} onReturn={() => canvasActions.select("path")} /></CanvasCard>}
      {!isGoal && reviewingPath && !state.draftPath && <CanvasCard id="goal" title="已确认的学习路径" point={position("goal")} width={horizontal ? 830 : 1215} pinned={pinned("goal")} onDrag={positionEditing && !pinned("goal") ? beginObjectDrag : undefined} onFocus={focusObject} onMaximize={maximizeObject} onTogglePin={canvasActions.togglePin}><div className="lh-path-draft"><div><strong>{state.profile.goal}</strong><p>{state.profile.background} · 每天 {state.profile.dailyMinutes} 分钟</p><small>{journey.pathCurrent ? "按节点继续学习，或审阅路径调整。" : "目标或基础已改变，请重新审阅路径。"}</small></div><div className="lh-actions"><Button primary disabled={!journey.pathCurrent} onClick={() => select(state.activeNode || "channels", "channels")}>继续学习<IconArrowRight size={ICON_SIZE.inline} /></Button><Button onClick={() => actions.generatePath()}>调整路径</Button><Button onClick={() => canvasActions.select("goal")}>修改目标</Button></div></div></CanvasCard>}
      {(isGoal || canvas.expanded && !state.draftPath) && <CanvasCard id="diagram" title={isGoal ? "图像输入预处理 · 路径预览" : "图像到模型输入"} icon={IconPhoto} point={position("diagram")} width={diagramWidth} pinned={pinned("diagram")} onDrag={positionEditing && !pinned("diagram") ? beginObjectDrag : undefined} onFocus={focusObject} onMaximize={maximizeObject} onTogglePin={canvasActions.togglePin} onCollapse={isGoal ? null : canvasActions.collapse}><TensorVisual journey={journey} activeSubstep={selectedStep} stage={isGoal ? "channels" : activeStage} />{isGoal && <div className="lh-preview-path"><div><strong>图像输入预处理入门</strong><span>RGB 通道 → 维度转换 → 跟练 → 输入检查 · 约 30 分钟</span></div><Button onClick={() => generate("existing")}>选用现成路径<IconArrowRight size={ICON_SIZE.inline} /></Button></div>}</CanvasCard>}
      {!isGoal && canvas.expanded && !state.draftPath && <CanvasCard id="detail" title={activeStage === "practice" ? "preprocess.py" : activeStage === "check" ? "输入检查与学习成果" : activeStage === "environment" ? "认识这次学习示例" : "讲解与理解记录"} icon={activeStage === "practice" ? IconCode : activeStage === "check" ? IconCheck : IconBook} point={position("detail")} width={detailWidth} pinned={pinned("detail")} onDrag={positionEditing && !pinned("detail") ? beginObjectDrag : undefined} onFocus={focusObject} onMaximize={maximizeObject} onTogglePin={canvasActions.togglePin} onCollapse={canvasActions.collapse}>
        {activeStage === "practice" ? <CodePractice journey={journey} activeSubstep={selectedStep} onCopy={onCopy} onContinue={() => select("check", "input")} /> : activeStage === "check" ? <InputCheck journey={journey} onRestore={() => select("practice", "result")} onArchive={onArchive} onEnterDevelopment={onEnterDevelopment} /> : <div className="lh-lesson-body">{activeStage === "environment" && <p>浏览器中可完成维度演算，无需安装环境。迁移到本地时需 Python 与 NumPy；真实模型另核对输入签名。</p>}<Player journey={journey} onAsk={onAsk} /><div className="lh-actions"><Button primary disabled={!journey.pathCurrent} onClick={() => { actions.markUnderstood(); select("practice", "layout"); }}>理解了，继续跟练<IconArrowRight size={ICON_SIZE.inline} /></Button></div><p className="lh-boundary">动态讲解为本地概念演示；“看过”与练习检查通过分别记录。</p></div>}
      </CanvasCard>}
      {!isGoal && !canvas.expanded && <button type="button" className="lh-restore-material" style={{ left: position("diagram").x, top: position("diagram").y }} onClick={() => canvasActions.select(activeStage, selectedStep)}><IconBook size={ICON_SIZE.navigation} /><span>材料已收起<strong>恢复{stageLabels[activeStage]}的图解与内容</strong></span><IconChevronDown size={ICON_SIZE.heading} /></button>}
    </div>
    {state.notice && !state.draftPath && <div className="lh-canvas-notice" role="status">{state.notice}</div>}
    <CanvasMiniMap className="lh-minimap" viewBox={{ x: 0, y: 0, width: world.width, height: world.height }} viewport={{ x: -viewport.x / viewport.scale, y: -viewport.y / viewport.scale, width: size.width / viewport.scale, height: size.height / viewport.scale }} onNavigate={({ x, y }) => canvasActions.setViewport({ x: size.width / 2 - x * viewport.scale, y: size.height / 2 - y * viewport.scale })} onFit={fitPath}>
      {!isGoal && tree.stages.map(stage => <rect className={`canvas-minimap-item${stage.id === activeStage ? " is-current" : ""}`} key={stage.id} x={treePoint.x + stage.rect.x} y={treePoint.y + stage.rect.y} width={stage.rect.width} height={stage.rect.height} rx="8" />)}
      <rect className="canvas-minimap-item" x={position("diagram").x} y={position("diagram").y} width={diagramWidth} height="390" rx="8" />
      {!isGoal && canvas.expanded && <rect className="canvas-minimap-item" x={position("detail").x} y={position("detail").y} width={detailWidth} height="470" rx="8" />}
    </CanvasMiniMap>
    {agentCursor && createPortal(<div className={`lh-agent-flight is-${agentCursor.phase}`} style={{ transform: `translate3d(${agentCursor.x}px, ${agentCursor.y}px, 0)` }} aria-hidden="true"><IconPointer size={ICON_SIZE.feature} stroke={2.2} /><span>{agentCursor.label}</span></div>, document.body)}
  </CanvasSurface>;
}
