import { useEffect, useId, useRef } from "react";
import { IconArrowRight, IconCheck, IconCode, IconGitCompare, IconHistory, IconLayoutColumns, IconMessageQuestion, IconPhoto, IconPin, IconPlayerPause, IconPlayerPlay, IconRotateClockwise, IconX } from "@tabler/icons-react";
import { IMAGE_LESSON, imageCode, imageSegmentAt, imageShape } from "./useImageInference";
import "./image-inference.css";

const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const stamp = time => `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(Math.floor(time % 60)).padStart(2, "0")}`;
const axisColors = { N: "neutral", H: "height", W: "width", C: "channel" };

function ChannelImage({ channel }) {
  const ref = useRef(null);
  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled || !ref.current) return;
      const ctx = ref.current.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(image, 0, 0, 224, 224);
      const pixels = ctx.getImageData(0, 0, 224, 224);
      const selected = { R: 0, G: 1, B: 2 }[channel];
      for (let index = 0; index < pixels.data.length; index += 4) for (let c = 0; c < 3; c++) if (c !== selected) pixels.data[index + c] = 0;
      ctx.putImageData(pixels, 0, 0);
    };
    image.src = asset("inference-input-cat.png");
    return () => { cancelled = true; };
  }, [channel]);
  return <canvas ref={ref} width={224} height={224} role="img" aria-label={`示例图像的 ${channel} 通道`} />;
}

function Dimensions({ snapshot, label }) {
  const shape = imageShape(snapshot);
  return <div className="im-dimensions"><span>{label}</span>{shape.valid ? <><div className="im-axes">{shape.labels.map((axis, index) => <div className={`im-axis is-${axisColors[axis]}`} key={axis}><strong>{shape.dimensions[index]}</strong><span>{axis}</span></div>)}</div><small>{shape.labels.join("")} · [{shape.dimensions.join(", ")}]</small></> : <p className="im-error">轴 0、1、2 各使用一次，才能生成维度顺序。</p>}</div>;
}

export function TensorDiagram({ inference, snapshot: supplied, compact = false }) {
  const { state, actions } = inference;
  const snapshot = supplied || (state.exploring ? state : state.pinned || (state.lessonOpen ? { axes: state.focus === "channels" ? [0, 1, 2] : [2, 0, 1], batch: state.focus === "batch" } : state));
  const focus = !supplied && !state.exploring && state.pinned ? state.pinned.focus : state.focus;
  const shape = imageShape(snapshot);
  return <section className={`im-diagram${compact ? " is-compact" : ""}`} aria-label="RGB 张量结构与维度转换">
    <div className="im-diagram-top"><span>同一份图像数据，改变维度的组织顺序</span><span className="im-data-tag">224 × 224 · RGB</span></div>
    {!compact && <div className="im-concept-controls" role="group" aria-label="图像概念">{IMAGE_LESSON.map(item => <button key={item.focus} type="button" aria-pressed={focus === item.focus} onClick={() => actions.focus(item.focus)}>{item.focus === "channels" ? "RGB 通道" : item.focus === "layout" ? "HWC → CHW" : "Batch 维度"}</button>)}</div>}
    {!compact && focus === "channels" && <div className="im-channel-strip"><figure><img src={asset("inference-input-cat.png")} alt="用于通道解释的生成虎斑猫照片" /><figcaption>输入图像</figcaption></figure>{["R", "G", "B"].map(channel => <button className={`im-channel is-${channel}${state.channel === channel ? " is-focused" : ""}`} type="button" key={channel} aria-pressed={state.channel === channel} onClick={() => actions.channel(state.channel === channel ? "all" : channel)}><ChannelImage channel={channel} /><span>{channel} 通道</span></button>)}</div>}
    <div className="im-tensor-reading"><figure className={`im-tensor-figure channel-${state.channel}`}><img src={asset("inference-rgb-tensor.png")} alt="RGB 三个二维平面分层组成的概念张量示意，层的颜色分别为红绿蓝" /><figcaption><span>H = 224</span><span>W = 224</span><span className="im-channel-legend">R · G · B</span></figcaption><small>原方案概念配图 · 非当前照片数据</small></figure><div className="im-layout-flow"><Dimensions snapshot={{ axes: [0, 1, 2], batch: false }} label="图像读入 HWC" /><div className="im-transform"><IconArrowRight size={20} /><code>transpose({snapshot.axes.join(",")})</code></div><Dimensions snapshot={snapshot} label="当前示例输出" /></div></div>
    {focus === "batch" && !compact && <div className="im-batch-strip"><span>一个样本</span><strong>N = 1</strong><span>在 {shape.valid ? shape.labels.filter(label => label !== "N").join("") : "图像"} 前增加批量维度</span><code>{snapshot.batch ? "transformed[None, ...]" : "尚未添加 batch"}</code></div>}
    {!compact && <p className="im-diagram-note">{focus === "channels" ? "每个像素包含 R、G、B 三个数值；通道分解直接来自左上方输入照片。" : focus === "layout" ? "轴 0 = H，轴 1 = W，轴 2 = C。将轴 2 移到最前，尺寸值和对应轴一起移动。" : "示例要求 NCHW [1,3,224,224]。batch 维度与通道转换分别检查。"}</p>}
  </section>;
}

function ImagePlayer({ inference, onAsk }) {
  const { state, actions } = inference;
  const segment = imageSegmentAt(state.time);
  return <section className="im-player"><header><IconPlayerPlay size={15} /><strong>图像输入的三个步骤</strong><span>动态讲解示例 · 60 秒</span><button className="im-icon" type="button" aria-label="收起图像讲解" onClick={actions.lesson}><IconX size={15} /></button></header><div className="im-caption"><span>{stamp(state.time)} · 当前字幕</span><p>{segment.caption}</p><button className="im-text-button" type="button" onClick={() => { actions.focus(segment.focus); onAsk?.({ kind: "image", focus: segment.focus, time: state.time, subtitle: segment.caption, title: "图像与张量讲解" }); }}><IconMessageQuestion size={14} />解释这句</button></div><div className="im-player-controls"><button className="im-icon" type="button" aria-label={state.playing ? "暂停图像讲解" : "播放图像讲解"} onClick={actions.play}>{state.playing ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}</button><input type="range" min="0" max="60" value={state.time} step=".2" aria-label="图像讲解进度" onChange={event => actions.seek(event.target.value)} /><span>{stamp(state.time)} / 01:00</span></div><div className="im-chapters">{IMAGE_LESSON.map(item => <button type="button" key={item.focus} aria-pressed={segment.focus === item.focus} onClick={() => actions.seek(item.time)}><small>{stamp(item.time)}</small>{item.title}</button>)}</div>{state.exploring && <small className="im-player-note">已暂停跟随，图解显示你的试改参数。点击章节可回到讲解参数。</small>}</section>;
}

function ImageParameters({ inference }) {
  const { state, actions } = inference;
  const prefix = useId();
  return <div className="im-parameters"><div className="im-parameter-line"><code>image.transpose(</code>{state.axes.map((axis, index) => <label key={index} htmlFor={`${prefix}-${index}`}><span>输出轴 {index}</span><select id={`${prefix}-${index}`} aria-label={`输出轴 ${index} 对应的输入轴`} value={axis} onChange={event => actions.axis(index, event.target.value)}>{[0, 1, 2].map(value => <option key={value} value={value}>{value} · {["H", "W", "C"][value]}</option>)}</select></label>)}<code>)</code></div><div className="im-parameter-bottom"><label><input type="checkbox" checked={state.batch} onChange={event => actions.batch(event.target.checked)} />增加 batch 维度 N = 1</label><button className="im-text-button" type="button" onClick={actions.correct}>使用 2,0,1 示例</button></div></div>;
}

function ImageSource({ inference, onOpen, practice, onCopy, codeAttachment }) {
  const { state, actions } = inference;
  const code = practice ? imageCode(state) : codeAttachment?.content || imageCode();
  return <><header className="im-heading"><div><span>图像推理 · {practice ? "隔离练习副本" : "只读现场"}</span><h2>{practice ? "试改预处理，观察形状变化" : codeAttachment?.name || "preprocess.py"}</h2><p>{practice ? "参数控件同步生成示例代码；原文件保持只读。" : codeAttachment ? "用户提供的只读附件；图解使用独立预处理示例，未解析附件。" : "原方案的图像输入示例 · 当前输入 NHWC，示例模型约定 NCHW。"}</p></div><button className="im-button" type="button" onClick={() => onCopy?.(code)}>复制代码</button></header><div className="im-code">{code.split("\n").map((line, index) => <div className={index === 5 || index === 6 ? "is-concept" : ""} key={index}><span>{index + 1}</span><code>{line || " "}</code>{!practice && !codeAttachment && (index === 5 || index === 6) && <button className="im-icon" type="button" aria-label={index === 5 ? "解释通道顺序" : "解释 batch 维度"} onClick={() => { actions.focus(index === 5 ? "layout" : "batch"); onOpen("image-explanation", { split: true }); }}><IconArrowRight size={13} /></button>}</div>)}</div>{practice ? <><ImageParameters inference={inference} /><TensorDiagram inference={inference} snapshot={state} /><div className="im-primary-actions"><button className="im-button is-primary" type="button" onClick={() => { actions.run(); onOpen("image-attempts", { activate: false }); }}>运行形状检查<IconPlayerPlay size={14} /></button><button className="im-button" type="button" onClick={() => onOpen("image-attempts")}>查看尝试<IconHistory size={14} /></button></div><small>仅演算维度顺序，不执行上方 Python 或模型推理。</small></> : <div className="im-primary-actions"><button className="im-button is-primary" type="button" onClick={() => onOpen("image-explanation")}>查看图解<IconArrowRight size={14} /></button><button className="im-button" type="button" onClick={() => { actions.explore(); onOpen("image-practice"); }}>在副本中试一下<IconCode size={14} /></button></div>}</>;
}

function ImageAttempts({ inference, onOpen }) {
  const { state, actions } = inference;
  const selected = state.attempts.find(item => item.id === state.selectedId) || state.attempts.at(-1);
  const before = selected && state.attempts[state.attempts.indexOf(selected) - 1];
  return <><header className="im-heading"><div><span>任务内尝试 · 独立保存</span><h2>形状变化与检查结果</h2><p>每次结果对应保存时的参数，不随当前草案变化。</p></div></header>{!selected ? <div className="im-empty"><IconHistory size={25} /><p>先在副本中运行一次形状检查。</p><button className="im-button" type="button" onClick={() => onOpen("image-practice")}>打开练习副本</button></div> : <><div className="im-attempt-list">{state.attempts.map((item, index) => <button type="button" key={item.id} aria-pressed={item.id === selected.id} onClick={() => actions.select(item.id)}>尝试 {index + 1}<span>{item.time}</span></button>)}</div><div className={`im-outcome${selected.passed ? " is-pass" : " is-pending"}`}><strong>{!selected.valid ? "轴顺序无效" : selected.passed ? "符合示例形状约定" : "尚不符合示例形状约定"}</strong><span>形状演算 · 未运行推理</span></div><div className="im-before-after">{before && <Dimensions snapshot={before.snapshot} label="上次尝试" />}<Dimensions snapshot={selected.snapshot} label="本次尝试" /></div><TensorDiagram inference={inference} snapshot={selected.snapshot} compact /><div className="im-primary-actions"><button className="im-button is-primary" type="button" disabled={!selected.valid} onClick={() => { actions.prepare(); onOpen("image-diff"); }}>查看修改预览<IconGitCompare size={14} /></button><button className="im-button" type="button" onClick={() => actions.save(selected)}>带回任务对话</button><button className="im-text-button" type="button" onClick={() => onOpen("image-practice")}>继续试改</button></div></>}</>;
}

function ImageDiff({ inference, onOpen }) {
  const { state, actions } = inference;
  const proposal = state.proposal;
  const changed = proposal && imageCode(proposal.baseline) !== proposal.attempt.code;
  return <><header className="im-heading"><div><span>修改预览 · 浏览器副本</span><h2>核对预处理的变化</h2><p>确认后仅更新示例工作副本，不写入真实项目。</p></div></header>{!proposal ? <div className="im-empty"><p>选择已保存的尝试，再生成修改预览。</p><button className="im-button" type="button" onClick={() => onOpen("image-attempts")}>查看尝试</button></div> : <><div className="im-before-after"><Dimensions snapshot={proposal.baseline} label="应用前的副本" /><Dimensions snapshot={proposal.attempt.snapshot} label="这次提案" /></div><div className="im-diff-code">{[5, 6].map(index => <div key={index}><pre className="is-before">− {imageCode(proposal.baseline).split("\n")[index]}</pre><pre className="is-after">+ {proposal.attempt.code.split("\n")[index]}</pre></div>)}</div><p>{changed ? "确认轴顺序及 batch 维度后再应用。" : "这次提案与当前副本相同，没有可应用的新变化。"}</p><div className="im-primary-actions"><button className="im-button is-primary" type="button" disabled={!changed} onClick={() => { actions.apply(); onOpen("image-validation"); }}>确认应用到示例副本</button><button className="im-button" type="button" onClick={() => { actions.cancel(); onOpen("image-practice"); }}>取消，保留练习</button></div></>}</>;
}

export function ImageInferenceMaterial({ id, inference, onOpen, onAsk, onCopy, presentation = "content", codeAttachment }) {
  const { state, actions } = inference;
  if (presentation === "canvas") {
    const attempt = state.attempts.find(item => item.id === state.selectedId) || state.attempts.at(-1);
    const titles = { "image-source": "原文件 · 只读示例", "image-practice": "练习副本 · 独立参数", "image-explanation": "RGB 与维度转换", "image-attempts": `${state.attempts.length} 次形状尝试`, "image-diff": "所选尝试的修改预览", "image-validation": "返回任务 · 分层核对" };
    const snapshot = id === "image-attempts" ? attempt?.snapshot : id === "image-diff" ? state.proposal?.attempt.snapshot : id === "image-validation" ? state.applied?.snapshot : id === "image-practice" ? state : undefined;
    return <div className="im-material im-canvas-summary"><strong>{titles[id]}</strong>{id === "image-source" ? <pre>{(codeAttachment?.content || imageCode()).split("\n").slice(5,8).join("\n")}</pre> : ["image-attempts", "image-diff", "image-validation"].includes(id) ? snapshot ? <><Dimensions snapshot={snapshot} label={id === "image-validation" ? "已应用副本" : "保存的参数"} /><p>{id === "image-validation" ? state.validation ? "形状已复核 · 真实推理未运行" : "示例待复核 · 真实推理未运行" : "形状快照 · 未运行推理"}</p></> : <p>{id === "image-diff" ? "尚未生成修改提案" : id === "image-validation" ? "尚未应用示例修改" : "尚未保存尝试"}</p> : <TensorDiagram inference={inference} snapshot={snapshot} compact />}<button className="im-button" type="button" onClick={() => onOpen(id)}>展开内容<IconArrowRight size={13} /></button></div>;
  }
  return <div className="im-material">
    {(id === "image-source" || id === "image-practice") && <ImageSource inference={inference} onOpen={onOpen} onCopy={onCopy} codeAttachment={codeAttachment} practice={id === "image-practice"} />}
    {id === "image-explanation" && <><header className="im-heading"><div><span>图像推理 · 关联解释</span><h2>从图像到模型输入</h2><p>图像、三个通道与代码维度，在同一处对照。</p></div><button className="im-button" type="button" onClick={actions.lesson}><IconPlayerPlay size={14} />{state.lessonOpen ? "收起讲解" : "观看讲解"}</button></header>{state.lessonOpen && <ImagePlayer inference={inference} onAsk={onAsk} />}<div className="im-figure-tools"><span>{state.pinned ? "参考已固定，参数保留" : state.lessonOpen && !state.exploring ? `跟随讲解 ${stamp(state.time)}` : "当前练习参数"}</span><button className="im-text-button" type="button" aria-pressed={Boolean(state.pinned)} onClick={actions.pin}><IconPin size={13} />{state.pinned ? "取消固定" : "固定图解"}</button></div><TensorDiagram inference={inference} /><div className="im-primary-actions"><button className="im-button is-primary" type="button" onClick={() => { actions.explore(); onOpen("image-practice"); }}>在副本中试一下<IconArrowRight size={14} /></button><button className="im-button" type="button" onClick={() => { onOpen("image-source"); onOpen("image-explanation", { split: true }); }}><IconLayoutColumns size={14} />与代码对照</button></div></>}
    {id === "image-attempts" && <ImageAttempts inference={inference} onOpen={onOpen} />}
    {id === "image-diff" && <ImageDiff inference={inference} onOpen={onOpen} />}
    {id === "image-validation" && <><header className="im-heading"><div><span>返回原任务 · 分层核对</span><h2>理解、修改与验证分别记录</h2><p>示例形状检查通过，并不表示模型推理成功。</p></div></header>{state.applied ? <><Dimensions snapshot={state.applied.snapshot} label="已应用的浏览器副本" /><div className="im-primary-actions"><button className="im-button is-primary" type="button" onClick={actions.validate}>复核示例形状并带回对话</button><button className="im-button" disabled={!state.undo} type="button" onClick={actions.undo}><IconRotateClockwise size={14} />撤销示例应用</button></div></> : <p>还没有应用示例修改。可以先理解图解，或继续练习。</p>}<dl className="im-checklist"><div><dt>理解与尝试</dt><dd>{state.attempts.length ? `${state.attempts.length} 次尝试已保存` : "待尝试"}</dd></div><div><dt>示例副本</dt><dd>{state.applied ? "已应用 · 可撤销" : "未应用"}</dd></div><div><dt>形状约定</dt><dd>{state.validation ? state.validation.passed ? "单项符合" : "需继续调整" : "待复核"}</dd></div><div><dt>真实项目与推理</dt><dd>未修改 · 未运行</dd></div></dl><p>下一步：核对真实模型签名、dtype、颜色顺序、归一化和运行结果。</p></>}
    {state.notice && <p className="im-notice" role="status">{state.notice}</p>}
    <footer className="im-boundary"><IconPhoto size={13} />图像／形状交互示例 · 未执行 Python、模型或 NPU</footer>
  </div>;
}
