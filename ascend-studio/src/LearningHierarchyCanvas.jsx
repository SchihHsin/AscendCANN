import { useEffect, useId, useRef, useState } from "react";
import { IconAdjustments, IconArrowDown, IconArrowRight, IconArrowUp, IconBook2, IconCheck, IconChevronDown, IconCode, IconCube, IconGripVertical, IconHistory, IconMessageQuestion, IconPhoto, IconPlayerPause, IconPlayerPlay, IconPointer, IconSearch, IconSettings, IconSparkles, IconX } from "@tabler/icons-react";
import LearningCanvasToolbar from "./LearningCanvasToolbar";
import CanvasCard from "./LearningCanvasCard";
import { LEARNING_NODES, LEARNING_SEGMENTS, getLearningCode, getLearningShape } from "./learning-data";
import { stepsForStage } from "./learning-path-collaboration";
import "./learning-hierarchy-canvas.css";

const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const stamp = seconds => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
const stageLabels = { environment: "环境准备", channels: "理解模型输入", practice: "完成输入转换", check: "核对输入与保存" };
const stageIcons = { environment: IconSettings, channels: IconBook2, practice: IconCube, check: IconSearch };
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
  return <section className="lh-player"><header><IconPlayerPlay size={15} /><strong>图像输入预处理</strong><span>动态讲解示例 · 60 秒</span></header><div className="lh-player-caption"><small>{stamp(state.time)} · {segment.title}</small><p>{segment.caption}</p><button type="button" className="lh-text-button" onClick={() => onAsk?.({ kind: "learning", focus: segment.focus, time: state.time, subtitle: segment.caption, title: segment.title })}><IconMessageQuestion size={14} />解释这句</button></div><div className="lh-player-controls"><button type="button" className="lh-icon-button" aria-label={state.playing ? "暂停学习讲解" : "播放学习讲解"} onClick={actions.play}>{state.playing ? <IconPlayerPause size={17} /> : <IconPlayerPlay size={17} />}</button><input type="range" min="0" max="60" step=".5" value={state.time} aria-label="学习讲解进度" onChange={event => actions.seek(event.target.value)} /><span>{stamp(state.time)} / 01:00</span></div><div className="lh-player-chapters">{LEARNING_SEGMENTS.map(item => <button type="button" key={item.focus} aria-pressed={state.focus === item.focus} onClick={() => actions.seek(item.time)}><small>{stamp(item.time)}</small>{item.title}</button>)}</div></section>;
}

function CodePractice({ journey, activeSubstep, onCopy, onContinue }) {
  const { state, actions, shape, currentAttempt, pathCurrent } = journey;
  const code = getLearningCode(state);
  const selectedLine = activeSubstep === "layout" ? 3 : activeSubstep === "batch" ? 4 : 5;
  return <div className="lh-code-body"><div className="lh-code" role="region" aria-label="预处理练习代码">{code.split("\n").map((line, index) => <div className={index === selectedLine ? "is-highlighted" : ""} key={index}><span>{index + 1}</span><code>{line}</code></div>)}</div><div className="lh-code-actions"><span>Python · 参数生成示例</span><button className="lh-text-button" type="button" onClick={() => onCopy?.(code)}>复制代码</button></div><div className="lh-practice-parameters"><label className="lh-parameter-label">通道顺序（transpose）</label><div className="lh-axis-selects">{state.axes.map((axis, index) => <label key={index}><span>输出轴 {index}</span><select aria-label={`学习输出轴 ${index}`} value={axis} onChange={event => actions.axis(index, event.target.value)}>{[0, 1, 2].map(value => <option key={value} value={value}>{value} · {["H", "W", "C"][value]}</option>)}</select></label>)}</div><label className="lh-checkbox"><input type="checkbox" checked={state.batch} onChange={event => actions.batch(event.target.checked)} />增加 batch · N = 1</label></div><div className="lh-current-shape"><span>当前形状（预览）</span><code>{shape.valid ? `[${shape.dimensions.join(", ")}]` : "轴 0、1、2 各使用一次"}</code><small>{currentAttempt ? currentAttempt.passed ? "本次检查通过" : "本次需调整" : "待检查"}</small></div><Button primary className="lh-run-button" disabled={!state.path || !pathCurrent} onClick={actions.runPractice}><IconPlayerPlay size={16} />运行练习检查</Button>{currentAttempt ? <div className={`lh-inline-result${currentAttempt.passed ? " is-pass" : ""}`}><strong>尝试 {state.attempts.indexOf(currentAttempt) + 1} · {currentAttempt.time} · {currentAttempt.passed ? "通过" : "需要调整"}</strong><p>{currentAttempt.passed ? "输出 (1, 3, 224, 224)，轴顺序和 batch 符合示例。" : !currentAttempt.valid ? "三个输出轴需要各使用一次 0、1、2。" : "将轴顺序调整为 2、0、1，再补充 batch 维度。"}</p>{currentAttempt.passed && <button className="lh-text-button" type="button" onClick={onContinue}>继续核对输入<IconArrowRight size={13} /></button>}</div> : state.attempts.length > 0 && <p className="lh-old-condition">当前参数已改变，历史结果按原条件保留；请重新运行。</p>}<AttemptHistory journey={journey} /><p className="lh-boundary">浏览器仅演算维度；未执行 Python 或模型 / NPU。</p></div>;
}

function AttemptHistory({ journey }) {
  const { state, currentAttempt } = journey;
  return state.attempts.length > 0 && <details className="lh-history"><summary><IconHistory size={14} />练习记录 · {state.attempts.length} 次</summary>{[...state.attempts].reverse().map((attempt, index) => <div key={attempt.id}><strong>尝试 {state.attempts.length - index} · {attempt.time} · {attempt.passed ? "通过" : "需调整"}{attempt.id === currentAttempt?.id ? " · 当前条件" : " · 历史条件"}</strong><code>transpose({attempt.snapshot.axes.join(",")}) · batch {attempt.snapshot.batch ? "有" : "无"}</code><span>{attempt.valid ? `输出 [${attempt.dimensions.join(", ")}]` : "轴顺序重复"}</span><details><summary>当时的代码</summary><pre>{attempt.code}</pre></details></div>)}</details>;
}

function InputCheck({ journey, onRestore, onArchive, onEnterDevelopment }) {
  const { state, actions, shape, currentAttempt, currentCheck, pathCurrent, readyToComplete, currentSummary, summaryCurrent } = journey;
  return <div className="lh-check-body"><p>核对目标：NCHW [1, 3, 224, 224]。检查只关联这一次跟练。</p><dl><div><dt>当前输入</dt><dd>{shape.valid ? `${shape.labels.join("")} [${shape.dimensions.join(", ")}]` : "轴顺序无效"}</dd></div><div><dt>对应尝试</dt><dd>{currentAttempt ? `尝试 ${state.attempts.indexOf(currentAttempt) + 1} · ${currentAttempt.time}` : "当前参数待运行练习"}</dd></div><div><dt>理解内容</dt><dd>{state.understood.includes("channels") ? "已记录看过并理解" : "尚未标记理解"}</dd></div><div><dt>输入检查</dt><dd>{currentCheck ? `${currentCheck.time} · 当前条件符合` : state.checks.length ? "历史检查保留 · 当前待核对" : "待明确检查"}</dd></div></dl><Button primary disabled={!currentAttempt?.passed || !pathCurrent} onClick={actions.checkInput}>运行本次输入检查</Button>{currentCheck && <div className="lh-inline-result is-pass"><strong><IconCheck size={14} />本次示例形状核对通过</strong><span>尝试 {state.attempts.indexOf(currentAttempt) + 1} · {currentCheck.time}</span><p>真实模型的 dtype、归一化与输出仍需另行验证。</p></div>}{state.checks.length > 0 && <details className="lh-history"><summary>输入检查历史 · {state.checks.length}</summary>{[...state.checks].reverse().map(check => <div key={check.id}><strong>{check.time} · {check.id === currentCheck?.id ? "当前条件" : "历史条件"}</strong><code>[{check.dimensions.join(", ")}]</code><small>对应尝试 {state.attempts.findIndex(attempt => attempt.id === check.attemptId) + 1}</small></div>)}</details>}<Button primary disabled={!readyToComplete} onClick={actions.complete}>完成并保存学习记录<IconCheck size={15} /></Button>{currentSummary && <section className="lh-saved-summary"><strong><IconCheck size={17} />学习记录已保存 · {currentSummary.time}</strong>{!summaryCurrent && <p className="lh-old-condition">这份记录属于保存时的条件；当前目标、路径或参数已改变。</p>}<p>{currentSummary.profile.goal}</p><span>看过：RGB、HWC / CHW、batch</span><span>检查通过：NCHW [{currentSummary.dimensions.join(", ")}]</span><small>尝试 {state.attempts.findIndex(attempt => attempt.id === currentSummary.attemptId) + 1} 与对应输入检查；模型推理未运行</small><div className="lh-actions"><Button onClick={onRestore}>恢复练习现场</Button><Button onClick={onArchive}>收起学习内容</Button></div>{!state.suggestionDismissed && <div className="lh-development-next"><strong>可选择的下一步</strong><p>把学过的方法用于图像推理，继续核对真实模型输入。</p><div className="lh-actions"><Button onClick={onEnterDevelopment}>进入图像推理任务<IconArrowRight size={13} /></Button><button type="button" className="lh-text-button" onClick={actions.dismissDevelopment}>暂不开始</button></div></div>}</section>}</div>;
}

function makeTree(layout, path) {
  let offset = 0;
  const stages = path.map((entry, index) => {
    const children = stepsForStage(entry);
    const horizontal = layout === "horizontal";
    const rect = horizontal ? { x: 0, y: offset, width: 258, height: 72 } : { x: index * 320, y: 0, width: 292, height: 72 };
    const steps = children.map((step, stepIndex) => ({ ...step, rect: horizontal ? { x: 32, y: offset + 82 + stepIndex * 55, width: 226, height: 47 } : { x: index * 320 + 20, y: 88 + stepIndex * 55, width: 272, height: 47 } }));
    offset += 95 + children.length * 55;
    return { ...entry, index, rect, steps };
  });
  return { stages, width: layout === "horizontal" ? 258 : path.length * 320 - 28, height: layout === "horizontal" ? offset - 20 : 260 };
}

function HierarchyGroup({ tree, layout, selectedStage, selectedStep, journey, onSelect, onDrag, onMoveStep, pinned }) {
  const { state, currentAttempt, currentCheck } = journey;
  const [draggedStep, setDraggedStep] = useState(null);
  const done = id => id === "channels" ? state.understood.includes("channels") : id === "practice" ? currentAttempt?.passed : id === "check" ? currentCheck?.passed : false;
  const dragPayload = event => { try { return JSON.parse(event.dataTransfer.getData("application/x-learning-path-step")); } catch { return null; } };
  return <div className={`lh-hierarchy is-${layout}`} style={{ width: tree.width, height: tree.height }}>
    <div className="lh-tree-grab" role="button" tabIndex={0} aria-label="移动完整学习层级" title={pinned ? "层级已固定" : "拖动学习层级"} onPointerDown={onDrag}><IconPointer size={12} />学习路径</div>
    <svg className="lh-tree-lines" width={tree.width + 20} height={tree.height + 20} aria-hidden="true"><defs><marker id="lh-tree-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8" /></marker></defs>{tree.stages.map((stage, index) => {
      const next = tree.stages[index + 1];
      const rect = stage.rect;
      return <g key={stage.id}>{next && <path className="lh-stage-line" markerEnd="url(#lh-tree-arrow)" d={layout === "horizontal" ? `M${rect.x + 20},${rect.y + rect.height} V${next.rect.y - 8} H${next.rect.x + 20}` : `M${rect.x + rect.width},${rect.y + 34} H${next.rect.x - 8}`} />}{stage.steps.map(step => <path className={`lh-child-line${stage.id === selectedStage && step.id === selectedStep ? " is-current" : ""}`} key={step.id} d={layout === "horizontal" ? `M${rect.x + 18},${rect.y + rect.height} V${step.rect.y + 23} Q${rect.x + 18},${step.rect.y + 23} ${step.rect.x},${step.rect.y + 23}` : `M${rect.x + 10},${rect.y + rect.height} V${step.rect.y + 23} Q${rect.x + 10},${step.rect.y + 23} ${step.rect.x},${step.rect.y + 23}`} />)}</g>;
    })}</svg>
    {tree.stages.map(stage => {
      const Icon = stageIcons[stage.id] || IconBook2;
      return <div key={stage.id}><button className={`lh-tree-node lh-stage-node${stage.id === selectedStage ? " is-selected" : ""}${stage.skipped ? " is-skipped" : ""}`} type="button" style={{ left: stage.rect.x, top: stage.rect.y, width: stage.rect.width, height: stage.rect.height }} onClick={() => onSelect(stage.id, stage.steps[0]?.id)} aria-pressed={stage.id === selectedStage}><span className={`lh-node-icon${done(stage.id) ? " is-done" : ""}`}>{done(stage.id) ? <IconCheck size={19} /> : <Icon size={20} />}</span><span><strong>{stage.id === "environment" ? "" : `0${stage.index}　`}{stageLabels[stage.id]}</strong><small>{stage.skipped ? state.draftPath ? "拟跳过 · 等待确认" : "已跳过" : LEARNING_NODES.find(item => item.id === stage.id)?.description}</small></span>{stage.skipped && <em>跳过</em>}</button>{stage.steps.map((step, index) => {
        const proposedSkip = step.suggestion?.kind === "skip" && step.suggestion.status === "pending";
        const proposedAdd = step.suggestion?.kind === "add" && step.suggestion.status === "pending";
        const acceptedSuggestion = step.suggestion?.status === "accepted";
        const nodeClass = `lh-tree-node lh-step-node${stage.id === selectedStage && step.id === selectedStep ? " is-selected" : ""}${step.skipped || proposedSkip ? " is-skipped" : ""}${proposedAdd ? " is-proposed-add" : ""}${acceptedSuggestion ? " is-proposal-accepted" : ""}${draggedStep?.stageId === stage.id && draggedStep.stepId === step.id ? " is-dragging" : ""}`;
        return <button className={nodeClass} type="button" key={step.id} style={{ left: step.rect.x, top: step.rect.y, width: step.rect.width, height: step.rect.height }} onClick={() => onSelect(stage.id, step.id)} aria-pressed={stage.id === selectedStage && step.id === selectedStep} aria-label={`${step.title}；可拖动排序，也可按 Alt 加方向键移动`} title="拖动排序；键盘可按 Alt + ↑ / ↓ 调整顺序" draggable={!pinned} onDragStart={event => { if (pinned) { event.preventDefault(); return; } const payload = { stageId: stage.id, stepId: step.id }; setDraggedStep(payload); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("application/x-learning-path-step", JSON.stringify(payload)); }} onDragEnd={() => setDraggedStep(null)} onDragOver={event => { if (draggedStep?.stageId === stage.id) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; } }} onDrop={event => { event.preventDefault(); const payload = dragPayload(event); if (payload?.stageId === stage.id) onMoveStep?.(stage.id, payload.stepId, step.id); setDraggedStep(null); }} onKeyDown={event => { if (!event.altKey || !["ArrowUp", "ArrowDown"].includes(event.key)) return; const targetIndex = index + (event.key === "ArrowUp" ? -1 : 1); const target = stage.steps[targetIndex]; if (!target) return; event.preventDefault(); onMoveStep?.(stage.id, step.id, target.id); }}>
          <span className="lh-step-index">{stage.index}.{index + 1}</span><span><strong>{step.title}</strong><small>{step.subtitle}</small></span>
          {proposedSkip && <em className="lh-step-suggestion is-skip">AI 建议跳过</em>}{proposedAdd && <em className="lh-step-suggestion">AI 新增建议</em>}{acceptedSuggestion && <em className="lh-step-suggestion is-accepted">已采纳</em>}
          {step.suggestion?.kind === "add" && <IconGripVertical className="lh-step-grip" size={12} aria-hidden="true" />}
        </button>;
      })}</div>;
    })}
  </div>;
}

function GoalObject({ journey, onGenerate, onReturn }) {
  const { state, actions } = journey;
  const id = useId();
  return <div className="lh-goal-body"><span className="lh-kicker">从学习目标开始</span><h2>这次想学会什么？</h2><label htmlFor={`${id}-goal`}>学习目标<textarea id={`${id}-goal`} rows={2} maxLength={2000} value={state.profile.goal} onChange={event => actions.setProfile({ goal: event.target.value })} /></label><label htmlFor={`${id}-background`}>已有基础<textarea id={`${id}-background`} rows={2} maxLength={1000} value={state.profile.background} onChange={event => actions.setProfile({ background: event.target.value })} /></label><label className="lh-time-label" htmlFor={`${id}-time`}>每天可用时间<select id={`${id}-time`} value={state.profile.dailyMinutes} onChange={event => actions.setProfile({ dailyMinutes: Number(event.target.value) })}>{[10, 20, 30, 45, 60].map(minutes => <option key={minutes} value={minutes}>{minutes} 分钟</option>)}</select></label><Button primary disabled={!state.profile.goal.trim()} onClick={() => onGenerate("goal")}>生成学习路径<IconArrowRight size={14} /></Button>{state.path && <button type="button" className="lh-text-button" onClick={onReturn}>回看已有路径</button>}<p className="lh-boundary">当前路径由图像预处理示例模板准备，目标与基础会保留在任务中。</p></div>;
}

export function LearningHierarchyCanvas({ journey, view, visible = true, onOpen, onAsk, onCopy, onArchive, onEnterDevelopment }) {
  const { state, actions } = journey;
  const { state: canvas, actions: canvasActions } = view;
  const host = useRef(null);
  const gesture = useRef(null);
  const current = useRef(null);
  const previousReview = useRef({ draft: false, stage: null, stepCount: 0 });
  const [size, setSize] = useState({ width: 1000, height: 760 });
  const [hand, setHand] = useState(false);
  const layout = canvas.layout;
  const path = state.draftPath || state.path;
  const isGoal = !path || canvas.selectedStage === "goal";
  const reviewingPath = canvas.selectedStage === "path";
  const tree = makeTree(layout, path || []);
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
  const verticalDiagramX = Math.max(45, 45 + (tree.width - diagramWidth) / 2);
  const verticalDetailX = Math.max(45, 45 + (tree.width - detailWidth) / 2);
  const verticalContentY = 90 + tree.height + 70;
  const verticalSecondaryY = verticalContentY + 430;
  const defaults = isGoal ? { hierarchy: { x: 40, y: 90 }, goal: { x: 45, y: 105 }, diagram: { x: 550, y: 105 }, detail: { x: 550, y: 600 } } : horizontal ? { hierarchy: { x: 42, y: 100 }, goal: { x: 350, y: 100 }, diagram: { x: 350, y: state.draftPath || reviewingPath ? 285 : 100 }, detail: { x: 420, y: state.draftPath || reviewingPath ? 765 : 580 } } : { hierarchy: { x: 45, y: 90 }, goal: { x: 45, y: 405 }, diagram: { x: verticalDiagramX, y: verticalPrimary === "diagram" ? verticalContentY : verticalSecondaryY }, detail: { x: verticalDetailX, y: verticalPrimary === "detail" ? verticalContentY : verticalSecondaryY } };
  const position = id => canvas.positions[id] || defaults[id];
  const world = { width: isGoal ? 1450 : horizontal ? 1280 : Math.max(1580, tree.width + 120), height: isGoal ? 1050 : horizontal ? 1450 : 1450 };
  const viewport = canvas.viewport;
  const pinned = id => canvas.pinned.includes(id);
  const fitBounds = (bounds, padding = 34) => {
    const scale = Math.max(.35, Math.min(1.1, (size.width - padding * 2) / bounds.width, (size.height - padding * 2) / bounds.height));
    canvasActions.setViewport({ scale, x: padding - bounds.x * scale + Math.max(0, (size.width - padding * 2 - bounds.width * scale) / 2), y: padding - bounds.y * scale });
  };
  const fitPath = () => {
    canvasActions.setFocused(false);
    const point = position("hierarchy");
    if (isGoal) fitBounds({ x: 20, y: 50, width: 1365, height: 710 });
    else if (horizontal) fitBounds({ x: Math.min(point.x, position("diagram").x), y: 65, width: Math.max(tree.width + 40, position("diagram").x + diagramWidth - point.x), height: Math.max(tree.height + 80, 720) });
    else fitBounds({ x: point.x, y: point.y - 25, width: tree.width, height: 850 });
  };
  const focusCurrent = () => {
    if (canvas.focused) { canvasActions.setFocused(false); return; }
    canvasActions.setFocused(true);
    if (!canvas.expanded) canvasActions.setExpanded(true);
    const point = position(activeStage === "practice" ? "detail" : "diagram");
    fitBounds({ x: point.x - 20, y: point.y - 20, width: (activeStage === "practice" ? detailWidth : diagramWidth) + 40, height: 640 }, 20);
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
  const reorderStep = (stageId, sourceId, targetId) => { if (actions.reorderPathStep(stageId, sourceId, targetId)) canvasActions.select("path"); };
  const treePoint = position("hierarchy");
  const chosenStage = tree.stages.find(stage => stage.id === activeStage);
  const selectedNode = chosenStage?.steps.find(step => step.id === selectedStep) || chosenStage?.steps[0];
  const start = selectedNode ? { x: treePoint.x + selectedNode.rect.x + (horizontal ? selectedNode.rect.width : selectedNode.rect.width / 2), y: treePoint.y + selectedNode.rect.y + (horizontal ? selectedNode.rect.height / 2 : selectedNode.rect.height) } : null;
  const connection = (point, targetWidth, targetIndex) => horizontal ? `M${start.x},${start.y} H${treePoint.x + tree.width + 18 + targetIndex * 9} V${point.y + 28} H${point.x - 3}` : `M${start.x},${start.y} V${treePoint.y + tree.height + 35 + targetIndex * 10} H${point.x + Math.min(targetWidth / 2, 70)} V${point.y - 3}`;
  return <div ref={host} className={`learning-hierarchy-canvas${hand ? " is-hand" : ""}`} aria-label="可移动的学习层级与内容画布" onPointerDown={event => {
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
    <div className="lh-canvas-title"><IconBook2 size={24} /><div><h2>{state.profile.goal || "我的学习目标"}</h2><p>{state.draftPath ? `${pendingChanges.length ? `AI 建议待审阅 · ${pendingChanges.length} 项` : "路径草案待确认"} · ${path.length} 个阶段 · ${proposedStepCount} 个学习动作` : isGoal ? "从目标或现成路径开始一段可验证的学习" : `${stageLabels[activeStage]} · ${selectedStepTitle}`}</p></div></div>
    <LearningCanvasToolbar layout={layout} scale={viewport.scale} hand={hand} focused={canvas.focused} onLayout={canvasActions.setLayout} onZoom={zoom} onResetZoom={() => canvasActions.setViewport({ scale: 1 })} onHand={() => setHand(!hand)} onFit={fitPath} onFocus={focusCurrent} />
    <div className="lh-world" style={{ width: world.width, height: world.height, transform: `translate(${viewport.x}px,${viewport.y}px) scale(${viewport.scale})` }}>
      {!isGoal && <div className="lh-tree-position" style={{ left: treePoint.x, top: treePoint.y }}><HierarchyGroup tree={tree} layout={layout} selectedStage={activeStage} selectedStep={selectedStep} journey={journey} onSelect={select} onMoveStep={reorderStep} pinned={pinned("hierarchy")} onDrag={event => beginObjectDrag(event, "hierarchy", treePoint)} /></div>}
      {start && canvas.expanded && !state.draftPath && !reviewingPath && <svg className="lh-material-lines" width={world.width} height={world.height} aria-hidden="true"><defs><marker id="lh-material-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8" /></marker></defs><path d={connection(position("diagram"), diagramWidth, 0)} markerEnd="url(#lh-material-arrow)" /><path d={connection(position("detail"), detailWidth, 1)} markerEnd="url(#lh-material-arrow)" /><circle cx={start.x} cy={start.y} r="5" /></svg>}
      {isGoal && <CanvasCard id="goal" title="学习目标与基础" point={position("goal")} width={440} pinned={pinned("goal")} onDrag={beginObjectDrag} onTogglePin={canvasActions.togglePin}><GoalObject journey={journey} onGenerate={generate} onReturn={() => canvasActions.select("path")} /></CanvasCard>}
      {!isGoal && reviewingPath && !state.draftPath && <CanvasCard id="goal" title="已确认的学习路径" point={position("goal")} width={horizontal ? 830 : 1215} pinned={pinned("goal")} onDrag={beginObjectDrag} onTogglePin={canvasActions.togglePin}><div className="lh-path-draft"><div><strong>{state.profile.goal}</strong><p>{state.profile.background} · 每天 {state.profile.dailyMinutes} 分钟</p><small>{journey.pathCurrent ? "按节点继续学习，或审阅路径调整。" : "目标或基础已改变，请重新审阅路径。"}</small></div><div className="lh-actions"><Button primary disabled={!journey.pathCurrent} onClick={() => select(state.activeNode || "channels", "channels")}>继续学习<IconArrowRight size={13} /></Button><Button onClick={() => actions.generatePath()}>调整路径</Button><Button onClick={() => canvasActions.select("goal")}>修改目标</Button></div></div></CanvasCard>}
      {state.draftPath && <CanvasCard id="goal" title="学习路径草案 · 等待确认" point={position("goal")} width={horizontal ? 830 : 1215} pinned={pinned("goal")} onDrag={beginObjectDrag} onTogglePin={canvasActions.togglePin}><div className="lh-path-draft">
        <div><strong>{state.profile.goal}</strong><p>{state.profile.background} · 每天 {state.profile.dailyMinutes} 分钟</p><small>节点操作与对话共用此预览；原路径和学习记录在确认前保持不变。</small></div>
        <section className="lh-generation-flow" aria-label="学习路径共创进度">
          <span>共创进度</span>
          <ol>
            <li className="is-complete"><i>1</i><span>目标与基础已整理</span></li>
            <li className="is-complete"><i>2</i><span>路径草案已生成</span></li>
            <li className={pendingChanges.length ? "is-current" : "is-complete"}><i>3</i><span>{pendingChanges.length ? `等待你审阅 ${pendingChanges.length} 项建议` : "建议已处理"}</span></li>
            <li className={pendingChanges.length ? "" : "is-current"}><i>4</i><span>确认后开始学习</span></li>
          </ol>
          <small>你可以采纳、忽略或继续提出修改；确认后才进入学习，学习进度保存在独立任务中。</small>
        </section>
        {state.pathSync && <p className="lh-path-sync" role="status"><IconSparkles size={13} /><strong>AI 同步说明</strong><span>{state.pathSync}</span></p>}
        {pendingChanges.length > 0 && <section className="lh-path-review" aria-label="AI 路径调整建议">
          <header><IconSparkles size={15} /><strong>AI 修改建议</strong><span>{pendingChanges.length} 项待你审阅</span></header>
          <ul>{pendingChanges.map(change => <li key={change.id}><div><strong>{change.title}</strong><small>{change.reason}</small></div><span className="lh-change-actions"><button type="button" onClick={() => actions.resolvePathChange(change.id, true)}>采纳</button><button type="button" onClick={() => actions.resolvePathChange(change.id, false)}>忽略</button></span></li>)}</ul>
          <div className="lh-actions"><Button primary onClick={actions.acceptAllPathChanges}>采纳全部建议</Button><Button onClick={actions.dismissPathSuggestions}>忽略未采纳建议</Button></div>
          <small className="lh-review-boundary">本地交互演示 · 建议只更新草案，不会自动开始学习。</small>
        </section>}
        <div className="lh-actions"><Button primary disabled={pendingChanges.length > 0} title={pendingChanges.length ? "先采纳或忽略待审阅建议" : "确认这条学习路径"} onClick={() => { if (actions.confirmPath()) select("channels", "channels"); }}>确认并开始<IconArrowRight size={13} /></Button>{state.pathUndo?.length > 0 && <Button onClick={actions.undoPathEdit}>撤销上一步</Button>}<Button onClick={actions.cancelPath}>取消调整</Button><Button onClick={() => actions.editPath("environment", "skip")}>{path.find(item => item.id === "environment")?.skipped ? "恢复环境准备" : "跳过环境准备"}</Button></div>
        <div className="lh-draft-reorder"><span>调整环境节点位置</span><button className="lh-icon-button" type="button" aria-label="上移环境准备" onClick={() => actions.editPath("environment", "up")}><IconArrowUp size={14} /></button><button className="lh-icon-button" type="button" aria-label="下移环境准备" onClick={() => actions.editPath("environment", "down")}><IconArrowDown size={14} /></button></div>
      </div></CanvasCard>}
      {(isGoal || canvas.expanded) && <CanvasCard id="diagram" title={isGoal ? "图像输入预处理 · 路径预览" : "图像到模型输入"} icon={IconPhoto} point={position("diagram")} width={diagramWidth} pinned={pinned("diagram")} onDrag={beginObjectDrag} onTogglePin={canvasActions.togglePin} onCollapse={isGoal ? null : canvasActions.collapse}><TensorVisual journey={journey} activeSubstep={selectedStep} stage={isGoal ? "channels" : activeStage} />{isGoal && <div className="lh-preview-path"><div><strong>图像输入预处理入门</strong><span>RGB 通道 → 维度转换 → 跟练 → 输入检查 · 约 30 分钟</span></div><Button onClick={() => generate("existing")}>选用现成路径<IconArrowRight size={14} /></Button></div>}</CanvasCard>}
      {!isGoal && canvas.expanded && !state.draftPath && <CanvasCard id="detail" title={activeStage === "practice" ? "preprocess.py" : activeStage === "check" ? "输入检查与学习成果" : activeStage === "environment" ? "认识这次学习示例" : "讲解与理解记录"} icon={activeStage === "practice" ? IconCode : activeStage === "check" ? IconCheck : IconBook2} point={position("detail")} width={detailWidth} pinned={pinned("detail")} onDrag={beginObjectDrag} onTogglePin={canvasActions.togglePin} onCollapse={canvasActions.collapse}>
        {activeStage === "practice" ? <CodePractice journey={journey} activeSubstep={selectedStep} onCopy={onCopy} onContinue={() => select("check", "input")} /> : activeStage === "check" ? <InputCheck journey={journey} onRestore={() => select("practice", "result")} onArchive={onArchive} onEnterDevelopment={onEnterDevelopment} /> : <div className="lh-lesson-body">{activeStage === "environment" && <p>浏览器中可完成维度演算，无需安装环境。迁移到本地时需 Python 与 NumPy；真实模型另核对输入签名。</p>}<Player journey={journey} onAsk={onAsk} /><div className="lh-actions"><Button primary disabled={!journey.pathCurrent} onClick={() => { actions.markUnderstood(); select("practice", "layout"); }}>理解了，继续跟练<IconArrowRight size={14} /></Button><button type="button" className="lh-text-button" onClick={() => actions.generatePath()}>调整路径</button></div><p className="lh-boundary">动态讲解为本地概念演示；“看过”与练习检查通过分别记录。</p></div>}
      </CanvasCard>}
      {!isGoal && !canvas.expanded && <button type="button" className="lh-restore-material" style={{ left: position("diagram").x, top: position("diagram").y }} onClick={() => canvasActions.select(activeStage, selectedStep)}><IconBook2 size={19} /><span>材料已收起<strong>恢复{stageLabels[activeStage]}的图解与内容</strong></span><IconChevronDown size={17} /></button>}
    </div>
    {state.notice && <div className="lh-canvas-notice" role="status">{state.notice}</div>}
    <div className="lh-minimap"><svg viewBox={`0 0 ${world.width} ${world.height}`} aria-label="学习画布小地图，点击定位" role="button" tabIndex={0} onClick={event => { const rect = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width * world.width; const y = (event.clientY - rect.top) / rect.height * world.height; canvasActions.setViewport({ x: size.width / 2 - x * viewport.scale, y: size.height / 2 - y * viewport.scale }); }} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fitPath(); } }}><rect className="lh-mini-bg" width={world.width} height={world.height} />{!isGoal && tree.stages.map(stage => <rect className={stage.id === activeStage ? "is-current" : ""} key={stage.id} x={treePoint.x + stage.rect.x} y={treePoint.y + stage.rect.y} width={stage.rect.width} height={stage.rect.height} rx="8" />)}<rect x={position("diagram").x} y={position("diagram").y} width={diagramWidth} height="390" rx="8" />{!isGoal && canvas.expanded && <rect x={position("detail").x} y={position("detail").y} width={detailWidth} height="470" rx="8" />}<rect className="lh-mini-viewport" x={-viewport.x / viewport.scale} y={-viewport.y / viewport.scale} width={size.width / viewport.scale} height={size.height / viewport.scale} /></svg><button type="button" onClick={fitPath}>适应路径</button></div>
  </div>;
}
