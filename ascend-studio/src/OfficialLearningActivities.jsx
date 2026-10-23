import { useId } from "react";
import { IconArrowRight, IconCheck, IconHistory, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { OFFICIAL_LEARNING_SOURCES } from "./official-learning-data.js";

const mmss = seconds => `00:${String(Math.floor(seconds)).padStart(2, "0")}`;
const statusText = attempt => attempt ? attempt.passed ? "检查通过" : "需要调整" : "待检查";
const sourceKind = type => ({ course: "官方视频课程", path: "成长路径", document: "官方文档", article: "官方文章" }[type] || "官方资料");

function sourceForLesson(node) {
  const preferred = OFFICIAL_LEARNING_SOURCES[node?.mediaId];
  if (preferred?.type === "course") return preferred;
  const fallback = (node?.sourceIds || []).map(id => OFFICIAL_LEARNING_SOURCES[id]).find(source => source?.type === "course");
  return fallback || OFFICIAL_LEARNING_SOURCES.overview;
}

export function OfficialLesson({ node, journey, onAsk, onCopy }) {
  const timeId = useId();
  if (!node || !journey?.state || !journey?.actions) return null;
  const { state, actions } = journey;
  const source = sourceForLesson(node);
  const taskVideo = OFFICIAL_LEARNING_SOURCES.resnet;
  const steps = node.flow?.length ? node.flow : [node.title];
  const duration = 45;
  const slice = duration / steps.length;
  const segmentIndex = Math.min(steps.length - 1, Math.floor(Math.min(state.time, duration - Number.EPSILON) / slice));
  const focus = steps[segmentIndex];
  const point = node.lesson?.points?.[segmentIndex] || node.lesson?.points?.[0] || node.summary;
  const checkpoint = node.checkpoint;
  const currentCheck = state.checks?.[node.id];
  const answer = state.answers?.[node.id];
  return <div className="lh-player og-lesson">
    {taskVideo?.embedUrl && <section className="og-official-video" aria-label="官方 ResNet50 视频课程"><header className="og-official-video-header"><span><small>官方视频课程</small><strong>{taskVideo.title}</strong></span><a href={taskVideo.url} target="_blank" rel="noreferrer" onClick={() => actions.visitSource(taskVideo.id)}>官网观看↗</a></header><div className="og-official-video-frame"><iframe title="昇腾官方 ResNet50 C&C++ 课程视频" src={taskVideo.embedUrl} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen /><p>视频由昇腾课程平台提供。若播放器要求登录或未能加载，可<a href={taskVideo.url} target="_blank" rel="noreferrer" onClick={() => actions.visitSource(taskVideo.id)}>前往官网观看↗</a>。</p></div></section>}
    <a className="og-official-course" href={source.url} target="_blank" rel="noreferrer" onClick={() => actions.visitSource(source.id)}><span><small>本节点关联资料</small><strong>{source.title}</strong></span><span>打开资料↗</span></a>
    <section className="og-local-lesson" aria-label="交互图解讲解"><header><div><strong>交互图解讲解 · 45 秒</strong><span>本地讲解示例</span></div><span>{mmss(state.time)} / 00:45</span></header>
      <div className="og-flow-focus" aria-live="polite"><span>当前步骤 · {segmentIndex + 1}/{steps.length}</span><strong>{focus}</strong><p>{point}</p></div>
      <div className="og-player-controls"><button className="lh-button" type="button" aria-label={state.playing ? "暂停本地讲解" : "播放本地讲解"} onClick={actions.play}>{state.playing ? <IconPlayerPause size={15} /> : <IconPlayerPlay size={15} />}{state.playing ? "暂停" : "播放"}</button><label className="og-sr-only" htmlFor={timeId}>本地讲解进度</label><input id={timeId} type="range" min="0" max={duration} step="0.5" value={state.time} aria-label="本地讲解进度" onChange={event => actions.seek(event.target.value)} /><span>{mmss(state.time)}</span></div>
      <div className="og-chapters" role="group" aria-label="跳到讲解步骤">{steps.map((step, index) => <button className="lh-text-button" type="button" key={`${step}-${index}`} aria-pressed={segmentIndex === index} onClick={() => actions.seek(index * slice)}><small>{mmss(index * slice)}</small>{step}</button>)}</div>
      <button className="lh-text-button" type="button" onClick={() => onAsk?.({ nodeId: node.id, title: node.title, time: state.time, subtitle: point, focus })}>解释这段<IconArrowRight size={13} /></button>
    </section>
    <section className="og-lesson-body"><h3>{node.lesson?.title || node.title}</h3><p>{node.lesson?.body || node.summary}</p><ul>{(node.lesson?.points || []).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>{node.lesson?.code && <details><summary>查看接口顺序示意</summary><pre><code>{node.lesson.code}</code></pre><button className="lh-text-button" type="button" onClick={() => onCopy?.(node.lesson.code)}>复制示意代码</button></details>}</section>
    <button className="lh-button" type="button" aria-pressed={state.understood?.includes(node.id) || false} onClick={() => actions.understand(node.id)}>{state.understood?.includes(node.id) ? "已记录理解" : "我理解了这段内容"}</button>
    {checkpoint && <section className="og-checkpoint"><h3>检查一下理解</h3><fieldset><legend>{checkpoint.question}</legend>{checkpoint.options.map(option => <label key={option.id}><input type="radio" name={`checkpoint-${node.id}`} value={option.id} checked={answer === option.id} onChange={() => actions.chooseAnswer(node.id, option.id)} />{option.label}</label>)}</fieldset><button className="lh-button" type="button" onClick={() => actions.checkAnswer(node.id)}>检查答案</button>{currentCheck && <div className={`lh-inline-result${currentCheck.passed && currentCheck.answer === answer ? " is-pass" : ""}`} role="status"><strong>{currentCheck.answer === answer ? currentCheck.passed ? "本次理解题通过" : "本次答案需调整" : "已选择新答案，请重新检查"}</strong><p>{currentCheck.answer === answer ? checkpoint.explanation : "检查结果只对应已提交的答案。"}</p></div>}</section>}
  </div>;
}

function InputPractice({ node, journey, onCopy }) {
  const { state, actions, inputAttempt } = journey;
  const axes = state.input.axes;
  const dimensions = [224, 224, 3];
  const valid = new Set(axes).size === 3;
  const shape = valid ? `${state.input.batch ? "[1, " : "["}${axes.map(axis => dimensions[axis]).join(", ")}${state.input.batch ? "]" : "]"}` : "轴顺序无效：H、W、C 各使用一次";
  const code = `# 教学示例：RGB HWC[224, 224, 3] → NCHW\n# 与当前真实模型输入约定分别核对\nimage = image.transpose(${axes.join(", ")})${state.input.batch ? "\nimage = image[None, ...]" : ""}`;
  const outputs = axes.map((axis, index) => <label key={index}>输出轴 {index}<select aria-label={`输出轴 ${index}（H、W 或 C）`} value={axis} onChange={event => actions.patchInput({ axes: axes.map((item, axisIndex) => axisIndex === index ? Number(event.target.value) : item) })}>{[[0, "H"], [1, "W"], [2, "C"]].map(([value, label]) => <option key={value} value={value}>{value} · {label}</option>)}</select></label>);
  const attempts = state.inputAttempts || [];
  return <div className="og-input-practice"><p>{node.summary}</p><p>教学示例：RGB HWC[224, 224, 3] → NCHW；与当前真实模型输入约定分别核对。</p><div className="og-axis-selects">{outputs}</div><label className="og-batch"><input type="checkbox" checked={state.input.batch} onChange={event => actions.patchInput({ batch: event.target.checked })} />增加 batch 维度</label><div className="og-shape"><span>当前预览</span><code>{shape}</code></div><pre><code>{code}</code></pre><div className="og-practice-actions"><button className="lh-text-button" type="button" onClick={() => onCopy?.(code)}>复制教学代码</button><button className="lh-button" type="button" onClick={actions.runInput}>运行形状检查</button></div>{inputAttempt && <div className={`lh-inline-result${inputAttempt.passed ? " is-pass" : ""}`} role="status"><strong>{statusText(inputAttempt)} · 当前参数</strong><p>{inputAttempt.dimensions.length ? `输出形状 [${inputAttempt.dimensions.join(", ")}]。` : "轴顺序重复，请让 H、W、C 各出现一次。"}这是浏览器中的形状教学检查。</p></div>}{attempts.length > 0 && <details className="lh-history"><summary><IconHistory size={14} />形状检查记录 · {attempts.length} 次</summary>{[...attempts].reverse().map((attempt, index) => <div key={attempt.id}><strong>尝试 {attempts.length - index} · {attempt.time} · {statusText(attempt)}</strong><code>轴序 {attempt.snapshot.axes.join(", ")} · batch {attempt.snapshot.batch ? "有" : "无"}</code><span>输出 [{attempt.dimensions.join(", ")}]</span></div>)}</details>}<small className="og-boundary">只检查教学示例维度，不运行 Python、模型或设备推理。</small></div>;
}

function SequencePractice({ journey }) {
  const { state, actions, sequenceAttempt } = journey;
  const labels = { load: "加载模型", input: "准备输入", execute: "执行推理", output: "读取输出" };
  const sequence = state.sequence || [];
  const attempts = state.sequenceAttempts || [];
  return <div className="og-sequence-practice"><p>用上下按钮调整调用顺序。检查只核对调用先后，不是设备执行。</p><ol>{sequence.map((item, index) => <li key={item}><strong>{labels[item] || item}</strong><span><button className="lh-text-button" type="button" aria-label={`将${labels[item] || item}上移`} disabled={index === 0} onClick={() => actions.moveSequence(index, -1)}>上移</button><button className="lh-text-button" type="button" aria-label={`将${labels[item] || item}下移`} disabled={index === sequence.length - 1} onClick={() => actions.moveSequence(index, 1)}>下移</button></span></li>)}</ol><button className="lh-button" type="button" onClick={actions.runSequence}>检查调用顺序</button>{sequenceAttempt && <div className={`lh-inline-result${sequenceAttempt.passed ? " is-pass" : ""}`} role="status"><strong>{statusText(sequenceAttempt)}</strong><p>本次只核对调用步骤顺序；没有执行设备推理。</p></div>}{attempts.length > 0 && <details className="lh-history"><summary><IconHistory size={14} />顺序检查记录 · {attempts.length} 次</summary>{[...attempts].reverse().map((attempt, index) => <div key={attempt.id}><strong>尝试 {attempts.length - index} · {attempt.time} · {statusText(attempt)}</strong><span>{attempt.snapshot.map(item => labels[item] || item).join(" → ")}</span></div>)}</details>}</div>;
}

function SummaryPractice({ journey }) {
  const { state, actions } = journey;
  const done = Object.values(state.statuses || {}).filter(status => status === "completed").length;
  const attempts = (state.attempts?.length || 0) + (state.inputAttempts?.length || 0) + (state.sequenceAttempts?.length || 0);
  return <div className="og-summary-practice"><p>{done} 个学习动作已完成理解与检查，累计 {attempts} 次尝试。</p><button className="lh-button" type="button" onClick={actions.saveSummary}>保存学习记录</button>{state.summary && <div className="lh-inline-result is-pass" role="status"><strong>记录已保存 · {state.summary.time}</strong><p>{state.summary.completed.length}/{state.summary.total} 个学习动作已完成理解与对应检查；设备推理尚待官方实验验证。</p></div>}{Object.keys(state.legacyStatuses || {}).length > 0 && <details className="lh-history"><summary>查看旧版手动进度记录</summary><p>旧版记录已保留；新路径按当前理解与检查重新汇总。</p>{Object.entries(state.legacyStatuses).map(([id,status]) => <div key={id}><code>{id.replace("learning-official-step-", "")}</code><span>{status === "completed" ? "旧版标记已学完" : status === "in-progress" ? "旧版标记学习中" : "旧版待开始"}</span></div>)}</details>}</div>;
}

export function OfficialPractice({ node, journey, onCopy }) {
  if (!node || !journey?.state || !journey?.actions) return null;
  if (["preprocess", "contract"].includes(node.visual)) return <div className="lh-player og-practice"><InputPractice node={node} journey={journey} onCopy={onCopy} /></div>;
  if (node.visual === "execution") return <div className="lh-player og-practice"><SequencePractice journey={journey} /></div>;
  if (node.visual === "summary") return <div className="lh-player og-practice"><SummaryPractice journey={journey} /></div>;
  return null;
}

export function OfficialSources({ node, journey }) {
  if (!node) return null;
  const ids = [...new Set([node.mediaId, ...(node.sourceIds || []), "growth"])];
  return <details className="lh-history og-sources"><summary>本节点资料与来源</summary>{ids.map(id => OFFICIAL_LEARNING_SOURCES[id]).filter(Boolean).map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" onClick={() => journey?.actions?.visitSource(source.id)}><span><small>{sourceKind(source.type)}</small><strong>{source.title}</strong></span><IconArrowRight size={14} /></a>)}</details>;
}
