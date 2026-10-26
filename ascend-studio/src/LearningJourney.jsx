import { ICON_SIZE } from "./icon-system.js";
import { IconArrowDown, IconArrowRight, IconArrowUp, IconCheck, IconCode, IconHistory, IconLayoutColumns, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { ContentToolbar } from "./ContentToolbar";
import { TensorDiagram } from "./ImageInference";
import { LEARNING_NODES, LEARNING_SEGMENTS, getLearningCode, getLearningShape, getTransferCode, getTransferShape } from "./learning-data";
import "./learning-journey.css";

const stamp = seconds => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
const stageTarget = id => id === "channels" || id === "environment" ? "learning-lesson" : id === "practice" ? "learning-practice" : "learning-check";
function Heading({ eyebrow, title, children }) { return <header className="lj-heading"><span>{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</header>; }
function Button({ children, primary, ...props }) { return <button type="button" className={`lj-button${primary ? " is-primary" : ""}`} {...props}>{children}</button>; }
function ShapeResult({ snapshot, title }) {
  const shape = getLearningShape(snapshot);
  return <div className={`lj-result${shape.passed ? " is-pass" : ""}`} role="status"><strong>{title || (!shape.valid ? "轴顺序无效" : shape.passed ? "符合示例形状约定" : "还需要调整")}</strong><code>{shape.valid ? `${shape.labels.join("")} [${shape.dimensions.join(", ")}]` : "轴 0、1、2 必须各使用一次"}</code><span>预期：NCHW [1, 3, 224, 224]</span></div>;
}
function TransferShapeResult({ snapshot, title }) {
  const shape = getTransferShape(snapshot);
  return <div className={`lj-result${shape.passed ? " is-pass" : ""}`} role="status"><strong>{title || (!shape.valid ? "轴顺序无效" : shape.passed ? "符合迁移目标形状" : "还需要调整")}</strong><code>{shape.valid ? `${shape.labels.join("")} [${shape.dimensions.join(", ")}]` : "轴 0、1、2 必须各使用一次"}</code><span>目标：NCHW [{snapshot.batch ? "1, " : ""}{snapshot.dimensions?.[2]}, {snapshot.dimensions?.[0]}, {snapshot.dimensions?.[1]}]</span></div>;
}
export function LearningJourneyMaterial({ id, journey, onOpen, onAsk, onCopy, onEnterDevelopment, onArchive, onTaskComplete, presentation = "content" }) {
  const { state, actions, shape, currentAttempt, currentCheck, currentSummary, summaryCurrent, pathCurrent, readyToComplete, transferShape, transferSource, transferSourceCurrent, transferCurrentAttempt } = journey;
  const path = state.draftPath || state.path;
  const segment = [...LEARNING_SEGMENTS].reverse().find(item => state.time >= item.time) || LEARNING_SEGMENTS[0];
  const adapter = { state: { ...state, channel: state.channel || "all", exploring: true }, actions };
  const lessonSnapshot = { axes: state.focus === "channels" ? [0, 1, 2] : [2, 0, 1], batch: state.focus === "batch" };
  const openNode = nodeId => { actions.openNode(nodeId); onOpen(stageTarget(nodeId)); };
  const run = () => { actions.runPractice(); };
  const begin = () => { if (actions.confirmPath()) openNode(path.find(node => !node.skipped)?.id || "channels"); };
  if (presentation === "canvas") return <div className="lj-canvas-summary"><strong>{id === "learning-goal" ? state.profile.goal : id === "learning-path" ? "目标 → 理解 → 跟练 → 检查" : id === "learning-summary" ? currentSummary ? `学习记录 · ${currentSummary.time}` : "完成后保存学习记录" : id === "learning-check" ? currentCheck ? "本次输入形状已核对" : "输入检查待完成" : id === "learning-practice" ? `${state.attempts.length} 次跟练尝试` : "RGB、HWC / CHW 与 batch"}</strong>{["learning-lesson", "learning-practice"].includes(id) && <TensorDiagram inference={adapter} snapshot={id === "learning-lesson" ? lessonSnapshot : state} compact />}<p>{state.profile.background} · 每天 {state.profile.dailyMinutes} 分钟</p><Button onClick={() => onOpen(id)}>展开内容<IconArrowRight size={ICON_SIZE.inline} /></Button></div>;
  return <div className="learning-journey">
    <ContentToolbar label="学习内容工具"><span>{id === "learning-goal" ? "目标与基础" : id === "learning-path" ? "路径审阅" : id === "learning-lesson" ? "动态讲解 · 60 秒" : id === "learning-practice" ? "学习示例 · 参数生成代码" : id === "learning-check" ? "输入形状核对" : "已保存的学习记录"}</span>{["learning-practice", "learning-summary"].includes(id) ? <Button onClick={() => onCopy?.(id === "learning-summary" && currentSummary ? currentSummary.code : getLearningCode(state))}><IconCode size={ICON_SIZE.inline} />复制代码</Button> : !["learning-goal", "learning-path"].includes(id) && <Button onClick={() => onOpen("learning-path")}>学习路径</Button>}</ContentToolbar>
    {id === "learning-goal" && <>
      <Heading eyebrow="从学习目标开始" title="今天想学会什么？">写下目标、已有基础与时间，再审阅一段可以跟练的路径。</Heading>
      <div className="lj-goal-form"><label>学习目标<textarea rows={2} maxLength={2000} value={state.profile.goal} onChange={event => actions.setProfile({ goal: event.target.value })} /></label><label>已有基础<textarea rows={2} maxLength={1000} value={state.profile.background} onChange={event => actions.setProfile({ background: event.target.value })} /></label><label className="lj-time-field">每天可用时间<select value={state.profile.dailyMinutes} onChange={event => actions.setProfile({ dailyMinutes: Number(event.target.value) })}>{[10, 20, 30, 45, 60].map(minutes => <option value={minutes} key={minutes}>{minutes} 分钟</option>)}</select></label><div className="lj-actions"><Button primary disabled={!state.profile.goal.trim()} onClick={() => { if (actions.generatePath()) onOpen("learning-path"); }}>生成学习路径<IconArrowRight size={ICON_SIZE.inline} /></Button>{state.path && <Button onClick={() => onOpen("learning-path")}>返回已有路径</Button>}</div></div>
      <section className="lj-existing-path"><span>也可以从现成路径开始</span><h3>图像输入预处理入门</h3><p>RGB 通道 → 维度转换 → 隔离跟练 → 输入检查</p><div className="lj-path-preview" aria-label="现成路径预览"><span>HWC</span><IconArrowRight size={ICON_SIZE.control} /><span>CHW</span><IconArrowRight size={ICON_SIZE.control} /><span>NCHW</span></div><div className="lj-actions"><small>约 30 分钟 · Python 基础</small><Button onClick={() => { if (actions.generatePath("existing")) onOpen("learning-path"); }}>选用路径<IconArrowRight size={ICON_SIZE.inline} /></Button></div></section>
      <p className="lj-note">当前 Demo 提供图像输入预处理示例路线。自定目标会保留在任务中，路径由本地模板准备。</p>
    </>}
    {id === "learning-path" && <>
      <Heading eyebrow={state.draftPath ? "路径草案 · 等待确认" : state.path ? "已确认的学习路径" : "尚未生成学习路径"} title={state.profile.goal}>结合你的基础：{state.profile.background || "待补充"} · 每天 {state.profile.dailyMinutes} 分钟</Heading>
      {!path ? <div className="lj-empty"><p>先表达学习目标，或选用现成路径。</p><Button primary onClick={() => onOpen("learning-goal")}>打开学习目标</Button></div> : <>
        <div className="lj-plan-summary"><span>{state.draftPath ? "调整预览" : "当前路径"}</span><strong>{path.filter(node => !node.skipped).length} 个节点 · 约 {path.reduce((sum, node) => sum + (node.skipped ? 0 : LEARNING_NODES.find(item => item.id === node.id).minutes), 0)} 分钟</strong><small>{(state.draftPath ? state.draftSource : state.pathSource) === "existing" ? "来源：现成路径" : "来源：学习目标与基础"} · 约 {Math.ceil(path.reduce((sum, node) => sum + (node.skipped ? 0 : LEARNING_NODES.find(item => item.id === node.id).minutes), 0) / state.profile.dailyMinutes)} 次学习 · 图像预处理示例</small></div>
        {!pathCurrent && state.path && !state.draftPath && <p className="lj-notice">目标、基础或时间已修改。已有记录保留，请重新审阅路径。</p>}
        <ol className="lj-path-nodes">{path.map((entry, index) => {
          const node = LEARNING_NODES.find(item => item.id === entry.id);
          const done = entry.id === "channels" ? state.understood.includes("channels") : entry.id === "practice" ? Boolean(currentAttempt?.passed) : entry.id === "check" ? Boolean(currentCheck?.passed) : false;
          const previous = state.path?.find(item => item.id === entry.id);
          const changed = state.draftPath && (previous ? previous.skipped !== entry.skipped || state.path.findIndex(item => item.id === entry.id) !== index : false);
          return <li className={`${entry.skipped ? "is-skipped " : ""}${changed ? "is-proposed" : ""}`} key={entry.id}><span className="lj-node-number">{done ? <IconCheck size={ICON_SIZE.inline} /> : String(index + 1).padStart(2, "0")}</span><div className="lj-node-copy"><strong>{node.title}</strong><p>{node.description}</p><small>{entry.skipped ? state.draftPath ? "拟跳过 · 确认后生效" : "已跳过" : `${node.minutes} 分钟${done ? " · 已有记录" : ""}`}</small><div className="lj-node-actions">{entry.id === "environment" && <Button onClick={() => actions.editPath(entry.id, "skip")}>{entry.skipped ? "恢复节点" : "跳过此节点"}</Button>}{state.path && !state.draftPath && !entry.skipped && <Button disabled={!pathCurrent} onClick={() => openNode(entry.id)}>打开内容<IconArrowRight size={ICON_SIZE.micro} /></Button>}</div></div><div className="lj-reorder"><button type="button" aria-label={`上移${node.title}`} disabled={index === 0} onClick={() => actions.editPath(entry.id, "up")}><IconArrowUp size={ICON_SIZE.inline} /></button><button type="button" aria-label={`下移${node.title}`} disabled={index === path.length - 1} onClick={() => actions.editPath(entry.id, "down")}><IconArrowDown size={ICON_SIZE.inline} /></button></div></li>;
        })}</ol>
        <div className="lj-actions">{state.draftPath ? <><Button primary onClick={begin}>确认并开始<IconArrowRight size={ICON_SIZE.inline} /></Button><Button onClick={actions.cancelPath}>取消调整</Button></> : <><Button primary disabled={!pathCurrent} onClick={() => openNode(state.activeNode || state.path.find(node => !node.skipped)?.id)}>继续学习<IconArrowRight size={ICON_SIZE.inline} /></Button><Button onClick={() => actions.generatePath()}>调整路径</Button></>}<Button onClick={() => onOpen("learning-goal")}>修改目标</Button></div><p className="lj-note">也可以在对话中说“环境已准备好，跳过环境配置”。对话与节点操作共用这份调整预览。</p>
      </>}
    </>}
    {id === "learning-lesson" && <>
      <Heading eyebrow="理解 · 图像输入预处理" title={state.activeNode === "environment" ? "先认识这次学习示例" : "从 RGB 图像到模型输入"}>{state.activeNode === "environment" ? "浏览器中可以完成维度演算，无需安装环境。迁移本地时需要 Python 与 NumPy；实际模型另核对输入签名。" : "同一份数据，改变维度组织顺序；在讲解中不理解的地方直接提问。"}</Heading>
      {!state.path ? <div className="lj-notice">先确认学习路径，再开始记录学习进度。<Button onClick={() => onOpen("learning-path")}>查看路径</Button></div> : null}
      <section className="lj-player" aria-label="图像输入动态讲解"><div className="lj-player-caption"><small>{stamp(state.time)} · {segment.title}</small><p>{segment.caption}</p><Button onClick={() => onAsk?.({ kind: "learning", focus: segment.focus, time: state.time, subtitle: segment.caption, title: segment.title })}>解释这句<IconArrowRight size={ICON_SIZE.inline} /></Button></div><div className="lj-player-controls"><button type="button" aria-label={state.playing ? "暂停学习讲解" : "播放学习讲解"} onClick={actions.play}>{state.playing ? <IconPlayerPause size={ICON_SIZE.control} /> : <IconPlayerPlay size={ICON_SIZE.control} />}</button><input type="range" min="0" max="60" step=".5" value={state.time} aria-label="学习讲解进度" onChange={event => actions.seek(event.target.value)} /><span>{stamp(state.time)} / 01:00</span></div><div className="lj-chapters">{LEARNING_SEGMENTS.map(item => <button type="button" key={item.focus} aria-pressed={state.focus === item.focus} onClick={() => actions.seek(item.time)}><small>{stamp(item.time)}</small>{item.title}</button>)}</div></section>
      <TensorDiagram inference={adapter} snapshot={lessonSnapshot} />
      <div className="lj-actions"><Button primary disabled={!state.path || !pathCurrent} onClick={() => { actions.markUnderstood(); actions.openNode("practice"); onOpen("learning-practice"); }}>理解了，继续跟练<IconArrowRight size={ICON_SIZE.inline} /></Button><Button onClick={() => onOpen("learning-practice", { split: true })}><IconLayoutColumns size={ICON_SIZE.inline} />对照练习</Button></div><p className="lj-note">动态讲解为本地概念演示。点击“理解了”记录学习状态，练习结果另行检查。</p>
    </>}
    {id === "learning-practice" && <>
      {state.practiceView === "transfer" && state.transfer ? <>
        <Heading eyebrow="迁移练习 · 隔离变式" title="把新的 NHWC 输入转换为 NCHW">使用与基础练习相同的本地维度演算规则；尝试与基础练习分开保存。</Heading>
        <div className="lj-notice"><strong>迁移练习 · 来自某次学习小结</strong><p>{transferSource?.time || "来源已失效"} · {transferSource?.profile?.goal || "未知学习目标"} · 小结 {state.transfer.sourceSummaryId}</p>{!transferSourceCurrent && <p role="alert">来源小结已变化或目标状态失效；旧结果不计入当前迁移完成。</p>}</div>
        <div className="lj-parameter-form"><strong>输入 RGB 图像 · HWC</strong><div className="lj-axis-controls">{state.transfer.axes.map((axis, index) => <label key={index}>输出轴 {index}<select aria-label={`迁移练习输出轴 ${index}`} value={axis} onChange={event => actions.setTransferAxis(index, event.target.value)}>{[0, 1, 2].map(value => <option value={value} key={value}>{value} · { ["H", "W", "C"][value] }</option>)}</select></label>)}</div><label className="lj-checkbox"><input type="checkbox" checked={state.transfer.batch} onChange={event => actions.setTransferBatch(event.target.checked)} />增加 batch 维度 N = 1</label></div>
        <TransferShapeResult snapshot={state.transfer} title="当前迁移参数预览" />
        <pre className="lj-code"><code>{getTransferCode(state.transfer)}</code></pre>
        <div className="lj-actions"><Button primary disabled={!transferSourceCurrent} onClick={actions.runTransfer}><IconPlayerPlay size={ICON_SIZE.inline} />运行迁移形状检查</Button><Button onClick={actions.returnToBasePractice}>返回基础练习</Button></div>
        {transferCurrentAttempt && <div className={`lj-result${transferCurrentAttempt.passed ? " is-pass" : ""}`}><strong>{transferCurrentAttempt.time} · {transferCurrentAttempt.passed ? "迁移练习通过" : "本次未通过"}</strong><p>{transferCurrentAttempt.passed ? `新输入输出为 NCHW [${transferCurrentAttempt.dimensions.join(", ")}]。迁移完成仅对来源小结 ${transferCurrentAttempt.sourceSummaryId} 与这组参数有效。` : transferCurrentAttempt.valid ? "请将 C 轴移动到最前并按目标加入 batch，再重新检查。" : "轴序无效，请让 0、1、2 各使用一次后重试。"}</p></div>}
        {state.transfer.attempts.length > 0 && <AttemptHistory attempts={state.transfer.attempts.map(attempt => ({ ...attempt, snapshot: { axes: attempt.snapshot.axes, batch: attempt.snapshot.batch } }))} currentId={transferCurrentAttempt?.id} />}
        <p className="lj-note">通过只表示浏览器按本地规则核对了形状，不执行真实 Python、模型或 NPU。</p>
      </> : <>
      <Heading eyebrow="跟练 · 隔离学习示例" title="把 HWC 转成 NCHW">将通道移到最前，再增加一个样本的 batch 维度。每次检查都会保留当时的参数和结果。</Heading>
      <div className="lj-parameter-form"><strong>image.transpose(…)</strong><div className="lj-axis-controls">{state.axes.map((axis, index) => <label key={index}>输出轴 {index}<select aria-label={`学习输出轴 ${index}`} value={axis} onChange={event => actions.axis(index, event.target.value)}>{[0, 1, 2].map(value => <option value={value} key={value}>{value} · {["H", "W", "C"][value]}</option>)}</select></label>)}</div><label className="lj-checkbox"><input type="checkbox" checked={state.batch} onChange={event => actions.batch(event.target.checked)} />增加 batch 维度 N = 1</label></div>
      <ShapeResult snapshot={state} title="当前参数预览" />
      <pre className="lj-code"><code>{getLearningCode(state)}</code></pre>
      <div className="lj-actions"><Button primary disabled={!state.path || !pathCurrent} onClick={run}><IconPlayerPlay size={ICON_SIZE.inline} />运行练习检查</Button><Button onClick={() => onOpen("learning-lesson", { split: true })}><IconLayoutColumns size={ICON_SIZE.inline} />对照图解</Button></div>
      {currentAttempt ? <div className={`lj-result${currentAttempt.passed ? " is-pass" : ""}`}><strong>尝试 {state.attempts.indexOf(currentAttempt) + 1} · {currentAttempt.time} · {currentAttempt.passed ? "形状检查通过" : "检查未通过"}</strong><p>{currentAttempt.passed ? "得到 (1, 3, 224, 224)，可以继续核对这次输入。" : !currentAttempt.valid ? "轴顺序重复。将 0、1、2 各使用一次后重试。" : "先将轴 2（C）放到最前，再核对是否增加了 batch。"}</p>{currentAttempt.passed && <Button primary onClick={() => { actions.openNode("check"); onOpen("learning-check"); }}>继续输入检查<IconArrowRight size={ICON_SIZE.inline} /></Button>}</div> : state.attempts.length > 0 && <p className="lj-notice">参数已变化；上次结果属于旧条件，请重新运行练习检查。</p>}
      <AttemptHistory attempts={state.attempts} currentId={currentAttempt?.id} />
      <p className="lj-note">检查只演算维度顺序，代码可复制到本地自行运行。真实模型的 dtype、颜色顺序与归一化仍需另行核对。</p>
      {state.transfer && <Button onClick={() => { actions.startTransfer(state.transfer.sourceSummaryId); }}>恢复迁移练习</Button>}
      </>}
    </>}
    {id === "learning-check" && <>
      <Heading eyebrow="验证 · 关联到本次尝试" title="核对这次输入">检查目标为示例的 NCHW [1,3,224,224]。运行核对后，才记录这一项完成。</Heading>
      <ShapeResult snapshot={state} title="当前输入条件" />
      <dl className="lj-checklist"><div><dt>输入来源</dt><dd>RGB 示例 · HWC [224,224,3]</dd></div><div><dt>轴转换</dt><dd>transpose({state.axes.join(",")})</dd></div><div><dt>Batch</dt><dd>{state.batch ? "已增加 N = 1" : "未增加"}</dd></div><div><dt>对应跟练</dt><dd>{currentAttempt ? `尝试 ${state.attempts.indexOf(currentAttempt) + 1} · ${currentAttempt.time}${currentAttempt.passed ? " · 已通过" : " · 需调整"}` : "当前参数还没有跟练记录"}</dd></div><div><dt>输入检查</dt><dd>{currentCheck ? `${currentCheck.time} · 示例形状符合` : state.checks.length ? "旧条件检查已保留 · 当前待核对" : "待核对"}</dd></div></dl>
      <div className="lj-actions"><Button primary disabled={!currentAttempt?.passed || !pathCurrent} onClick={actions.checkInput}>运行本次输入检查</Button><Button onClick={() => onOpen("learning-practice")}>返回跟练</Button></div>
      {currentCheck && <div className="lj-result is-pass"><strong><IconCheck size={ICON_SIZE.control} /> 本次输入形状核对通过</strong><span>对应尝试 {state.attempts.indexOf(currentAttempt) + 1} · {currentCheck.time}</span><p>已验证当前示例的轴顺序与 batch；模型推理尚未运行。</p></div>}
      {state.checks.length > 0 && <details className="lj-history"><summary><IconHistory size={ICON_SIZE.inline} />输入检查历史 · {state.checks.length}</summary>{[...state.checks].reverse().map(check => <div key={check.id}><strong>{check.time} · {check.id === currentCheck?.id ? "当前条件" : "历史条件"}</strong><code>[{check.dimensions.join(", ")}]</code><small>对应尝试 {state.attempts.findIndex(attempt => attempt.id === check.attemptId) + 1} · 查看不会重跑</small></div>)}</details>}
      <div className="lj-actions"><Button primary disabled={!readyToComplete} onClick={() => { const summary = actions.complete(); if (summary) { onTaskComplete?.(summary); onOpen("learning-summary"); } }}>完成并保存学习记录<IconArrowRight size={ICON_SIZE.inline} /></Button>{!state.understood.includes("channels") && <Button onClick={() => onOpen("learning-lesson")}>返回理解节点</Button>}</div>
    </>}
    {id === "learning-summary" && <>
      <Heading eyebrow="学习记录 · 当前浏览器保存" title={currentSummary ? "这一段学习已保存" : "完成后留下可恢复的成果"}>{currentSummary ? currentSummary.profile.goal : "完成理解、跟练与本次输入检查后，再保存学习记录。"}</Heading>
      {!currentSummary ? <div className="lj-empty"><Button primary onClick={() => onOpen("learning-check")}>返回输入检查</Button></div> : <>
        {!summaryCurrent && <p className="lj-notice">以下是 {currentSummary.time} 保存的学习记录。当前目标、路径或参数已变化，需重新完成对应检查后另存。</p>}
        <div className="lj-complete-mark"><IconCheck size={ICON_SIZE.navigation} /><div><strong>理解与示例检查已完成</strong><span>{currentSummary.time} · {currentSummary.attemptCount} 次尝试</span></div></div>
        <dl className="lj-checklist"><div><dt>学过的内容</dt><dd>RGB、HWC / CHW、batch</dd></div><div><dt>练习输出</dt><dd>NCHW [{currentSummary.dimensions.join(", ")}]</dd></div><div><dt>验证依据</dt><dd>尝试 {state.attempts.findIndex(attempt => attempt.id === currentSummary.attemptId) + 1} 与对应输入检查</dd></div><div><dt>真实模型推理</dt><dd>尚未运行</dd></div></dl>
        <div className="lj-actions"><Button primary onClick={onArchive}>收起学习内容</Button><Button onClick={() => onOpen("learning-practice")}>恢复练习现场</Button><Button onClick={() => onOpen("learning-path")}>回看学习路径</Button></div>
        {!state.suggestionDismissed && <section className="lj-existing-path"><span>接下来可以做</span><h3>把学过的方法用于图像推理</h3><p>进入开发任务后，先核对真实模型的输入约定，再进行项目修改与推理验证。学习现场会保留。</p><div className="lj-actions"><Button onClick={onEnterDevelopment}>进入图像推理任务<IconArrowRight size={ICON_SIZE.inline} /></Button><Button onClick={actions.dismissDevelopment}>暂不开始，关闭建议</Button></div></section>}
        {state.summaries.length > 1 && <details className="lj-history"><summary>之前的学习记录 · {state.summaries.length - 1}</summary>{state.summaries.slice(0, -1).reverse().map(summary => <div key={summary.id}><strong>{summary.time} · {summary.profile.goal}</strong><code>[{summary.dimensions.join(", ")}]</code><small>{summary.attemptCount} 次尝试 · 已保存条件</small></div>)}</details>}
      </>}
    </>}
    {state.notice && <p className="lj-notice" role="status">{state.notice}</p>}
    <footer className="lj-boundary">学习交互示例 · 未调用真实 AI、执行 Python 或运行模型 / NPU</footer>
  </div>;
}
function AttemptHistory({ attempts, currentId }) {
  return attempts.length > 0 && <details className="lj-history"><summary><IconHistory size={ICON_SIZE.inline} />跟练记录 · {attempts.length} 次</summary>{[...attempts].reverse().map((attempt, index) => <div key={attempt.id}><strong>尝试 {attempts.length - index} · {attempt.time} · {attempt.passed ? "通过" : "需调整"}{attempt.id === currentId ? " · 当前参数" : " · 历史条件"}</strong><code>transpose({attempt.snapshot.axes.join(",")}) · batch {attempt.snapshot.batch ? "有" : "无"}</code><span>{attempt.valid ? `输出 [${attempt.dimensions.join(",")}]` : "重复轴，无法生成有效形状"}</span><details><summary>当时的代码</summary><pre className="lj-code"><code>{attempt.code}</code></pre></details></div>)}</details>;
}
