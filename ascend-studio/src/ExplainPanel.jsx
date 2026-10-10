import { useEffect, useId, useState } from "react";
import { IconAlertTriangle, IconArrowLeft, IconArrowRight, IconCheck, IconChevronDown, IconCode, IconColumns2, IconHistory, IconMessageQuestion, IconPin, IconPlayerPause, IconPlayerPlay, IconX } from "@tabler/icons-react";
import RangeDiagram, { getRangeGeometry } from "./RangeDiagram.jsx";
import { EXPLANATION_DURATION, EXPLANATION_SEGMENTS, EXPLANATION_SNAPSHOT, EXPLANATION_TITLE, explanationSegmentAt } from "./useExplanationSession.js";
import "./explain-panel.css";

const formatTime = (time) => `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(Math.floor(time % 60)).padStart(2, "0")}`;
const focusLabel = (focus) => EXPLANATION_SEGMENTS.find((item) => item.focus === focus)?.concept || "索引范围";
const snapshotOf = (state) => ({ rows: state.rows, columns: state.columns, tileSize: state.tileSize, bounds: state.bounds });

function LessonScene({ time, playing, segment }) {
  const progress = Math.min(1, Math.max(0, (time - segment.time) / 20));
  return <div className={`ex-lesson-scene ex-scene-${segment.focus}${playing ? " is-playing" : ""}`} aria-label={`${segment.concept}的动态片段`}>
    <div className="ex-scene-heading"><span>17 × 33</span><IconArrowRight size={15} /><strong>{segment.focus === "total" ? "561 个元素" : segment.focus === "tail" ? "尾块：17 / 32" : "有效 561 / 访问 576"}</strong></div>
    {segment.focus === "total" ? <div className="ex-scene-blocks">{Array.from({ length: 18 }, (_, index) => <span className={index === 17 ? "is-tail" : ""} key={index} style={{ "--ex-delay": `${index * 0.07}s` }}>{index === 17 ? "17" : "32"}</span>)}</div>
      : <div className="ex-scene-tail">{Array.from({ length: 32 }, (_, index) => <span key={index} className={index >= 17 ? "is-outside" : ""} style={{ "--ex-delay": `${index * 0.025}s` }} />)}<span className="ex-scene-sweep" style={{ left: `${progress * 100}%` }} aria-hidden="true" /></div>}
    <div className="ex-scene-footer"><span>{segment.focus === "total" ? "17 个完整块" : "有效索引 544–560"}</span><span>{segment.focus === "total" ? "+ 1 个尾块" : segment.focus === "tail" ? "剩余 15 个位置无有效数据" : "561–575：范围外 15 个索引"}</span></div>
    <p>{segment.note}</p>
  </div>;
}

function LessonPlayer({ explanation, onAsk }) {
  const { state, actions } = explanation;
  const segment = explanationSegmentAt(state.time);
  const [captionSelected, setCaptionSelected] = useState(false);
  const timelineId = useId();
  useEffect(() => setCaptionSelected(false), [segment.focus, state.videoOpen]);
  const pauseLesson = () => { if (state.playing) actions.playPause(); };
  const ask = () => { pauseLesson(); onAsk?.({ title: EXPLANATION_TITLE, time: Math.floor(state.time), subtitle: segment.subtitle, concept: segment.concept, focus: segment.focus }); };
  return <section className="ex-lesson-player" aria-label="讲解交互示例播放器">
    <header className="ex-lesson-header"><div><strong>讲解交互示例</strong><span>动态片段 · 交互示例 · 60 秒</span></div><button className="ex-icon-button" type="button" aria-label="关闭讲解" onClick={actions.closeVideo}><IconX size={15} /></button></header>
    <LessonScene time={state.time} playing={state.playing} segment={segment} />
    <div className="ex-caption-wrap"><button className={`ex-caption${captionSelected ? " is-selected" : ""}`} type="button" aria-pressed={captionSelected} onClick={() => { if (!captionSelected) pauseLesson(); setCaptionSelected((value) => !value); }}><span>当前字幕</span>{segment.subtitle}<IconChevronDown size={13} /></button>{captionSelected && <div className="ex-caption-tools"><span>{formatTime(state.time)} · {segment.concept}</span><button className="ex-quiet-button" type="button" onClick={ask}><IconMessageQuestion size={13} />解释这句</button><button className="ex-quiet-button" type="button" onClick={() => { actions.startExplore(); setCaptionSelected(false); }}><IconCode size={13} />暂停并试一下</button></div>}</div>
    <div className="ex-player-controls"><button className="ex-icon-button" type="button" disabled={state.mode === "explore"} aria-label={state.playing ? "暂停讲解" : state.time >= EXPLANATION_DURATION ? "重新播放讲解" : "播放讲解"} onClick={actions.playPause}>{state.playing ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}</button><label className="ex-timeline-label" htmlFor={timelineId}>讲解进度</label><input id={timelineId} aria-label="讲解时间轴" type="range" min="0" max={EXPLANATION_DURATION} step="0.1" value={state.time} disabled={state.mode === "explore"} onChange={(event) => actions.seek(event.target.value)} /><span className="ex-player-time">{formatTime(state.time)} / 01:00</span></div>
    <div className="ex-chapters" role="group" aria-label="跳到讲解章节">{EXPLANATION_SEGMENTS.map((item, index) => <button className={segment.focus === item.focus ? "is-current" : ""} aria-pressed={segment.focus === item.focus} disabled={state.mode === "explore"} type="button" key={item.focus} onClick={() => actions.seek(item.time)}><span>{formatTime(item.time)}</span><strong>{index + 1}. {item.title}</strong></button>)}</div>
    {state.mode === "explore" && <p className="ex-player-paused-note">讲解停在 {formatTime(state.time)}。下方按你的参数试算，讲解参数仍保留。</p>}
  </section>;
}

function CodeAnchor({ snapshot, focus, onShowCard, onCompare }) {
  const geometry = getRangeGeometry(snapshot);
  const code = focus === "total" ? ["const int total = rows * columns;", "const int blocks = (total + tileSize - 1) / tileSize;"]
    : focus === "tail" ? ["const int baseIndex = block * tileSize;", snapshot.bounds === "valid" ? "const int validCount = std::min(tileSize, total - baseIndex);" : "// 剩余有效元素 = total - baseIndex"]
      : [snapshot.bounds === "valid" ? "for (int offset = 0; offset < validCount; ++offset) {" : "for (int offset = 0; offset < tileSize; ++offset) {", "  const int index = baseIndex + offset;"];
  const description = !geometry.valid ? "填写完整参数后，查看代码与图中范围的对应。" : focus === "total" ? `${geometry.total} 个元素按每块 ${geometry.tileSize} 分组，共 ${geometry.blocks} 块。` : focus === "tail" ? `最后一块从 ${geometry.lastBlockStart} 开始，剩余 ${geometry.lastBlockValid} 个有效元素。` : `${snapshot.bounds === "valid" ? "按有效元素" : "按整块"}访问，最大索引 ${geometry.maxAccessIndex}；有效索引到 ${geometry.lastValidIndex}。`;
  return <section className="ex-code-anchor"><div className="ex-anchor-heading"><span><IconCode size={14} />对应示例代码 · {focusLabel(focus)}</span><button className="ex-quiet-button" type="button" onClick={() => onShowCard?.("source", { anchor: focus })}>查看来源<IconArrowRight size={12} /></button></div><pre tabIndex={0} aria-label={`${focusLabel(focus)}对应的示例代码`}><code>{code.join("\n")}</code></pre><div className="ex-anchor-footer"><p>{description}</p><button className="ex-quiet-button" type="button" onClick={() => onCompare?.(focus)}><IconColumns2 size={13} />并排核对</button></div></section>;
}

function TrialControls({ flow, explanation, onShowCard }) {
  const { state, actions } = flow;
  const strategyName = useId();
  const attempts = Array.isArray(state.attempts) ? state.attempts : [];
  const latestAttempt = attempts.find((item) => item.id === state.selectedAttemptId) || attempts.at(-1);
  const matches = latestAttempt && ["rows", "columns", "tileSize", "bounds"].every((name) => String(latestAttempt.snapshot?.[name] ?? latestAttempt[name]) === String(state[name]));
  return <section className="ex-trial-panel" aria-label="就地图解试算"><div className="ex-trial-heading"><div><strong>试一下，图解跟着参数变化</strong><span>任务内示例 · 与讲解参数分别保留</span></div>{explanation.state.videoOpen && <button className="ex-quiet-button" type="button" onClick={explanation.actions.returnToLesson}><IconArrowLeft size={13} />返回讲解</button>}</div>
    <form onSubmit={(event) => { event.preventDefault(); actions.runTrial(); }}><div className="ex-parameter-fields">{[{ name: "rows", label: "行数" }, { name: "columns", label: "列数" }, { name: "tileSize", label: "每块元素" }].map(({ name, label }) => <label key={name}>{label}<input type="number" required min="1" step="1" value={state[name]} disabled={state.busy} onChange={(event) => actions.setParameter(name, event.target.value)} /></label>)}</div><fieldset className="ex-strategies"><legend>最后一块的访问范围</legend><label><input type="radio" name={strategyName} checked={state.bounds === "full"} disabled={state.busy} onChange={() => actions.setBounds("full")} /><span>整块访问<small>每块按相同大小</small></span></label><label><input type="radio" name={strategyName} checked={state.bounds === "valid"} disabled={state.busy} onChange={() => actions.setBounds("valid")} /><span>仅有效元素<small>尾块按剩余数量</small></span></label></fieldset><div className="ex-trial-actions"><button className="ex-primary-button" type="submit" disabled={state.busy}><IconPlayerPlay size={14} />{state.busy ? "正在演算…" : "运行范围算例"}</button><span>只演算索引，不执行 C++ 或 NPU</span></div></form>
    {state.error && <p className="ex-trial-error" role="alert"><IconAlertTriangle size={14} />{state.error}</p>}
    {latestAttempt && <div className="ex-trial-result" role="status"><div><span className="ex-result-icon">{latestAttempt.passed ? <IconCheck size={15} /> : <IconAlertTriangle size={15} />}</span><span><strong>{latestAttempt.passed ? "示例索引在范围内" : `示例涉及 ${latestAttempt.outOfRange} 个范围外索引`}</strong><small>保存于 {latestAttempt.time} · [{latestAttempt.rows},{latestAttempt.columns}] / 每块 {latestAttempt.tileSize}{matches ? "" : " · 参数已变化，可重新运行"}</small></span></div><button className="ex-quiet-button" type="button" onClick={() => onShowCard?.("attempts")}><IconHistory size={13} />查看尝试</button></div>}
  </section>;
}

export function ExplainPanel({ flow, explanation, onShowCard, onAsk, onCompare, presentation = "content" }) {
  const [fullDiagram, setFullDiagram] = useState(false);
  useEffect(() => setFullDiagram(false), [flow?.state?.resetVersion]);
  if (!flow?.state || !explanation?.state) return null;
  const { state, actions } = explanation;
  const userSnapshot = snapshotOf(flow.state);
  const lessonSnapshot = state.mode === "lesson" ? EXPLANATION_SNAPSHOT : userSnapshot;
  const fixed = state.pinned && state.mode !== "explore";
  const diagramSnapshot = fixed && state.pinnedSnapshot ? state.pinnedSnapshot : lessonSnapshot;
  const focus = fixed ? state.pinnedFocus : state.focus;
  if (presentation === "canvas") return <div className="ex-canvas-summary"><div className="ex-summary-meta"><span>范围图解</span><span>{state.pinned ? "参考已固定" : "按需查看"}</span></div><RangeDiagram snapshot={diagramSnapshot} focus={focus} compact title="元素分块与尾块" /><p>图解、讲解片段与试算留在同一份解释中。</p><button className="ex-quiet-button" type="button" onClick={() => onShowCard?.("explanation")}>展开解释与试算<IconArrowRight size={13} /></button></div>;
  return <div className="ex-panel"><header className="ex-heading"><div><span className="ex-eyebrow">AddCustom · 解释线索</span><h2>看清元素、尾块与访问范围</h2><p>从图中选择要核对的部分，也可以边看讲解边试算。</p></div><div className="ex-heading-actions"><button className="ex-primary-button" type="button" onClick={state.videoOpen ? actions.closeVideo : actions.openVideo}><IconPlayerPlay size={14} />{state.videoOpen ? "收起讲解" : "观看讲解"}<span>60 秒</span></button></div></header>
    <div className={`ex-reading-layout${state.videoOpen ? " has-lesson" : ""}`}>{state.videoOpen && <LessonPlayer explanation={explanation} onAsk={onAsk} />}<section className="ex-diagram-panel" aria-label="关联范围图解"><header className="ex-diagram-heading"><div><strong>{focusLabel(focus)}</strong><span>{state.mode === "explore" ? "随当前试算参数" : fixed ? "固定参考 · 保留当时参数" : state.mode === "lesson" ? `关联动态片段 ${formatTime(state.time)}` : "随当前示例参数"}</span></div><button className={`ex-quiet-button${state.pinned ? " is-fixed" : ""}`} type="button" aria-pressed={state.pinned} onClick={() => actions.pin(diagramSnapshot)}><IconPin size={13} />{state.mode === "explore" ? state.pinned ? "更新固定参考" : "固定试算图" : state.pinned ? "取消固定" : "固定图解"}</button></header><RangeDiagram snapshot={diagramSnapshot} focus={focus} onFocus={actions.focusConcept} compact={!fullDiagram} title={focusLabel(focus)} active={explanation.visible} /><button className="ex-expand-diagram ex-quiet-button" type="button" aria-expanded={fullDiagram} onClick={() => setFullDiagram((value) => !value)}><IconChevronDown size={12} />{fullDiagram ? "收起完整图解" : "展开完整图解"}</button><div className="ex-diagram-foot"><span>[{diagramSnapshot.rows},{diagramSnapshot.columns}] · 每块 {diagramSnapshot.tileSize} · {diagramSnapshot.bounds === "valid" ? "有效元素范围" : "整块范围"}</span>{state.mode !== "explore" && <button className="ex-quiet-button" type="button" onClick={actions.startExplore}><IconCode size={13} />{state.videoOpen ? "暂停并试一下" : "在图中试一下"}<IconArrowRight size={12} /></button>}</div>{fixed && state.videoOpen && <p className="ex-fixed-note">图解已固定，播放不会替换这份参考。取消固定后跟随片段。</p>}{state.pinned && state.mode === "explore" && <p className="ex-fixed-note">固定参考仍保留；当前图解显示你的试算参数。</p>}</section></div>
    {state.mode === "explore" && <TrialControls flow={flow} explanation={explanation} onShowCard={onShowCard} />}
    <CodeAnchor snapshot={diagramSnapshot} focus={focus} onShowCard={onShowCard} onCompare={onCompare} />
    <p className="ex-evidence-note">图解与动态片段使用范围示例。尾块只是待核查线索，真实 AddCustom 根因与精度仍待证据确认。</p>
  </div>;
}

export default ExplainPanel;
