import { ICON_SIZE } from "./icon-system.js";
import { useId } from "react";
import { IconArrowRight, IconCheck, IconHistory, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { OFFICIAL_LEARNING_SOURCES } from "./official-learning-data.js";
import { OFFICIAL_VIDEO_CHAPTERS, OFFICIAL_VIDEO_DURATION, officialVideoChapterIndex } from "./official-learning-video.js";

const mmss = seconds => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
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
  const steps = OFFICIAL_VIDEO_CHAPTERS;
  const duration = OFFICIAL_VIDEO_DURATION;
  const segmentIndex = officialVideoChapterIndex(state.time);
  const demoStepIndex = segmentIndex;
  const chapter = steps[segmentIndex];
  const focus = chapter.title;
  const point = chapter.summary;
  const checkpoint = node.checkpoint;
  const currentCheck = state.checks?.[node.id];
  const answer = state.answers?.[node.id];
  return <div className="lh-player og-lesson">
    <section className="og-local-lesson" aria-label="ResNet50 图像推理视频"><header><div><strong>ResNet50 图像推理</strong><span>完整流程讲解 · 45 秒</span><a className="og-demo-official-link" href={taskVideo.url} target="_blank" rel="noreferrer" onClick={() => actions.visitSource(taskVideo.id)}>官网课程↗</a></div><span>{mmss(state.time)} / 00:45</span></header>
      <div className="og-demo-screen" style={{ "--og-demo-progress": `${(state.time / duration) * 100}%`, "--og-demo-cursor-x": `${[17, 43, 68, 86][demoStepIndex]}%`, "--og-demo-cursor-y": `${[39, 58, 40, 67][demoStepIndex]}%` }} aria-label={`视频画面：${focus}`}>
        <div className="og-demo-topbar"><span className="og-demo-dot"/><span className="og-demo-dot"/><span className="og-demo-dot"/><strong>resnet50_infer.cpp</strong><small>Ascend Studio · 推理工作台</small></div>
        <div className="og-demo-workspace">
          <div className="og-demo-editor" aria-label="代码编辑器演示">
            <div className="og-demo-pane-title"><span>应用代码</span><small>demo.cpp</small></div>
            {steps.flatMap(step => step.screenLines).map((line, index) => {
              return <div className={`og-demo-code-line${Math.floor(index / 2) === demoStepIndex ? " is-active" : ""}`} key={`${index}-${line}`}><i>{String(index + 1).padStart(2, "0")}</i><code>{line}</code></div>;
            })}
          </div>
          <div className="og-demo-side">
            <div className="og-demo-pane-title"><span>推理流程</span><small>{state.playing ? "PLAYING" : state.time >= duration ? "COMPLETE" : state.time > 0 ? "PAUSED" : "READY"}</small></div>
            <div className="og-demo-pipeline">{steps.map((step, index) => <div className={`og-demo-pipeline-step${index === demoStepIndex ? " is-active" : ""}${index < demoStepIndex ? " is-done" : ""}`} key={step.id}><span>{index < demoStepIndex ? "✓" : String(index + 1)}</span><strong>{step.pipeline}</strong>{index < 3 && <i/>}</div>)}</div>
            <div className="og-demo-output"><div className="og-demo-output-heading"><span>Top-3 分类结果</span></div>{demoStepIndex === 3 ? [["虎斑猫", 92], ["埃及猫", 6], ["猞猁", 2]].map(([label, value], index) => <div className="og-demo-score" key={label}><span>{label}</span><i><b style={{ width: `${value}%`, transitionDelay: `${index * 80}ms` }}/></i><code>{value}%</code></div>) : <div className="og-demo-output-waiting">{demoStepIndex === 2 ? "推理执行中，等待输出就绪…" : "完成模型执行后展示分类结果"}</div>}</div>
          </div>
        </div>
        <span className="og-demo-cursor" aria-hidden="true"/>
        <div className="og-demo-controls">
          <button className="og-demo-transport" type="button" aria-label={state.playing ? "暂停视频讲解" : "播放视频讲解"} onClick={actions.play}>{state.playing ? <IconPlayerPause size={ICON_SIZE.inline} /> : <IconPlayerPlay size={ICON_SIZE.inline} />}</button>
          <label className="og-sr-only" htmlFor={timeId}>视频讲解进度</label><input id={timeId} type="range" min="0" max={duration} step="0.5" value={state.time} aria-label="视频讲解进度" onChange={event => actions.seek(event.target.value)} />
          <span>{mmss(state.time)} / 00:45</span>
        </div>
      </div>
      <div className="og-flow-focus" aria-live="polite"><span>当前步骤 · {segmentIndex + 1}/{steps.length}</span><strong>{focus}</strong><p>{point}</p></div>
      <div className="og-chapters" role="group" aria-label="跳到讲解步骤">{steps.map((step, index) => <button className="lh-text-button" type="button" key={step.id} aria-pressed={segmentIndex === index} onClick={() => actions.seek(step.start)}><small>{mmss(step.start)}</small>{step.title}</button>)}</div>
      <button className="lh-text-button" type="button" onClick={() => onAsk?.({ nodeId: node.id, title: chapter.title, time: state.time, subtitle: point, focus })}>解释这段<IconArrowRight size={ICON_SIZE.inline} /></button>
    </section>
    <a className="og-official-course" href={source.url} target="_blank" rel="noreferrer" onClick={() => actions.visitSource(source.id)}><span><small>本节点关联资料</small><strong>{source.title}</strong></span><span>打开资料↗</span></a>
    <section className="og-lesson-body" key={chapter.id} aria-label="当前视频同步讲解" aria-live="polite" aria-atomic="true" data-video-chapter={chapter.id}><h3>{chapter.title}</h3><p>{chapter.body}</p><ul>{chapter.points.map((item, index) => <li key={`${chapter.id}-${index}`}>{item}</li>)}</ul><details><summary>查看接口顺序示意</summary><pre><code>{chapter.code}</code></pre><button className="lh-text-button" type="button" onClick={() => onCopy?.(chapter.code)}>复制示意代码</button></details></section>
    <button className="lh-button" type="button" aria-pressed={state.understood?.includes(node.id) || false} onClick={() => actions.understand(node.id)}>{state.understood?.includes(node.id) ? "已记录理解" : "我理解了本节点内容"}</button>
    {checkpoint && <section className="og-checkpoint"><h3>检查本节点理解</h3><p>{node.title}</p><fieldset><legend>{checkpoint.question}</legend>{checkpoint.options.map(option => <label key={option.id}><input type="radio" name={`checkpoint-${node.id}`} value={option.id} checked={answer === option.id} onChange={() => actions.chooseAnswer(node.id, option.id)} />{option.label}</label>)}</fieldset><button className="lh-button" type="button" onClick={() => actions.checkAnswer(node.id)}>检查答案</button>{currentCheck && <div className={`lh-inline-result${currentCheck.passed && currentCheck.answer === answer ? " is-pass" : ""}`} role="status"><strong>{currentCheck.answer === answer ? currentCheck.passed ? "本次理解题通过" : "本次答案需调整" : "已选择新答案，请重新检查"}</strong><p>{currentCheck.answer === answer ? checkpoint.explanation : "检查结果只对应已提交的答案。"}</p></div>}</section>}
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
  return <div className="og-input-practice"><p>{node.summary}</p><p>教学示例：RGB HWC[224, 224, 3] → NCHW；与当前真实模型输入约定分别核对。</p><div className="og-axis-selects">{outputs}</div><label className="og-batch"><input type="checkbox" checked={state.input.batch} onChange={event => actions.patchInput({ batch: event.target.checked })} />增加 batch 维度</label><div className="og-shape"><span>当前预览</span><code>{shape}</code></div><pre><code>{code}</code></pre><div className="og-practice-actions"><button className="lh-text-button" type="button" onClick={() => onCopy?.(code)}>复制教学代码</button><button className="lh-button" type="button" onClick={actions.runInput}>运行形状检查</button></div>{inputAttempt && <div className={`lh-inline-result${inputAttempt.passed ? " is-pass" : ""}`} role="status"><strong>{statusText(inputAttempt)} · 当前参数</strong><p>{inputAttempt.dimensions.length ? `输出形状 [${inputAttempt.dimensions.join(", ")}]。` : "轴顺序重复，请让 H、W、C 各出现一次。"}这是浏览器中的形状教学检查。</p></div>}{attempts.length > 0 && <details className="lh-history"><summary><IconHistory size={ICON_SIZE.inline} />形状检查记录 · {attempts.length} 次</summary>{[...attempts].reverse().map((attempt, index) => <div key={attempt.id}><strong>尝试 {attempts.length - index} · {attempt.time} · {statusText(attempt)}</strong><code>轴序 {attempt.snapshot.axes.join(", ")} · batch {attempt.snapshot.batch ? "有" : "无"}</code><span>输出 [{attempt.dimensions.join(", ")}]</span></div>)}</details>}<small className="og-boundary">只检查教学示例维度，不运行 Python、模型或设备推理。</small></div>;
}

function SequencePractice({ journey }) {
  const { state, actions, sequenceAttempt } = journey;
  const labels = { load: "加载模型", input: "准备输入", execute: "执行推理", output: "读取输出" };
  const sequence = state.sequence || [];
  const attempts = state.sequenceAttempts || [];
  return <div className="og-sequence-practice"><p>用上下按钮调整调用顺序。检查只核对调用先后，不是设备执行。</p><ol>{sequence.map((item, index) => <li key={item}><strong>{labels[item] || item}</strong><span><button className="lh-text-button" type="button" aria-label={`将${labels[item] || item}上移`} disabled={index === 0} onClick={() => actions.moveSequence(index, -1)}>上移</button><button className="lh-text-button" type="button" aria-label={`将${labels[item] || item}下移`} disabled={index === sequence.length - 1} onClick={() => actions.moveSequence(index, 1)}>下移</button></span></li>)}</ol><button className="lh-button" type="button" onClick={actions.runSequence}>检查调用顺序</button>{sequenceAttempt && <div className={`lh-inline-result${sequenceAttempt.passed ? " is-pass" : ""}`} role="status"><strong>{statusText(sequenceAttempt)}</strong><p>本次只核对调用步骤顺序；没有执行设备推理。</p></div>}{attempts.length > 0 && <details className="lh-history"><summary><IconHistory size={ICON_SIZE.inline} />顺序检查记录 · {attempts.length} 次</summary>{[...attempts].reverse().map((attempt, index) => <div key={attempt.id}><strong>尝试 {attempts.length - index} · {attempt.time} · {statusText(attempt)}</strong><span>{attempt.snapshot.map(item => labels[item] || item).join(" → ")}</span></div>)}</details>}</div>;
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
  return <details className="lh-history og-sources"><summary>本节点资料与来源</summary>{ids.map(id => OFFICIAL_LEARNING_SOURCES[id]).filter(Boolean).map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" onClick={() => journey?.actions?.visitSource(source.id)}><span><small>{sourceKind(source.type)}</small><strong>{source.title}</strong></span><IconArrowRight size={ICON_SIZE.inline} /></a>)}</details>;
}
