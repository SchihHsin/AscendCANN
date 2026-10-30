import { ICON_SIZE } from "./icon-system.js";
import { useState } from "react";
import { LOG_DIAGNOSTIC_TASK } from "./prototype-data.js";
import {
  IconAlertCircle,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconFileText,
  IconSparkles,
  IconUpload,
} from "@tabler/icons-react";

export function getCommunityDraftTopic(draft) {
  if (draft?.taskId === LOG_DIAGNOSTIC_TASK) return LOG_DIAGNOSTIC_TASK;
  const problem = String(draft?.problem || "");
  if (/AddCustom|precision mismatch/i.test(problem)) return "AddCustom 精度异常";
  if (/图像|NCHW|NHWC|HWC|CHW/i.test(problem)) return "图像输入形状";
  return "开发任务";
}

function buildTikTokSlides(draft) {
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常" || topic === LOG_DIAGNOSTIC_TASK;
  if (topic === LOG_DIAGNOSTIC_TASK) return [
    { eyebrow: "问题现象", title: "Add 算子异常\n待核对的尾块线索", note: "[16,32] 通过，[17,33] 在 custom_op.cpp:128 出现 precision mismatch", visual: "cover", footer: "日志现象 · 根因待确认" },
    { eyebrow: "输入对照", title: "两组输入，结果不同", note: "先保留可复现条件，不把相关性写成根因", visual: "compare", footer: "现象来自预置任务日志" },
    { eyebrow: "布局理解", title: "图解帮助理解数据布局", note: "交互式 Format Lab 用于观察布局关系，不代表代码已验证", visual: "layout", footer: "图解作为排查参考" },
    { eyebrow: "验证边界", title: "真实代码与环境待补", note: "补充循环边界、运行条件、误差数据和环境版本", visual: "evidence", footer: "真实验证结果待补" },
  ];
  const coverTitle = topic === LOG_DIAGNOSTIC_TASK ? "Add 算子异常\n从日志到验证" : isAddCustom ? "AddCustom\n精度异常" : `${topic}怎么核对？`;
  return [
    { eyebrow: "先看现象", title: coverTitle, note: "先固定异常范围，再整理已有证据", visual: "cover", footer: "问题排查路径 · 01 / 04" },
    { eyebrow: "01 · 复现边界", title: isAddCustom ? "两组输入，结果不同" : "输入与目标约定", note: isAddCustom ? "报错位置：custom_op.cpp:128" : "固定输入条件与目标形状", visual: "compare", footer: "先固定现象，不急着改结论" },
    { eyebrow: isAddCustom ? "02 · 核对候选线索" : "02 · 核对处理步骤", title: isAddCustom ? "尾块边界候选" : "轴顺序与 batch 维度", note: isAddCustom ? "逐项核对循环边界与有效元素数；这是一条待验证线索" : "对照模型输入约定；实际推理结果仍需核对", visual: "blocks", footer: isAddCustom ? "线索不等于根因" : "形状记录 · 真实推理待验证" },
    { eyebrow: "03 · 补证据再判断", title: "验证前要补齐的记录", note: isAddCustom ? "版本与环境 · 两组运行条件 · 逐元素误差" : "模型签名 · 预处理参数 · 实际推理结果", visual: "evidence", footer: "当前没有真实 NPU 验证结论" },
  ];
}

function TikTokSlideContent({ slide, isAddCustom }) {
  const title = slide.title.split("\n").map((line, index) => <span key={index}>{line}</span>);
  if (slide.visual === "cover") return <>
    <div className="tiktok-slide-heading tiktok-slide-heading--cover">
      <span className="tiktok-visual-eyebrow">{slide.eyebrow}</span>
      <h3>{title}</h3>
      <p>{slide.note}</p>
    </div>
    <div className="visual-cover-art"><IconAlertCircle size={32} /><div><strong>{isAddCustom ? "两组输入表现不同" : "输入布局需要对齐"}</strong><span>{isAddCustom ? "先定位异常边界" : "先核对轴顺序"}</span></div></div>
    <div className="visual-cover-snapshot"><span>{isAddCustom ? "[16,32]" : "NHWC [224,224,3]"}<b className={isAddCustom ? "is-pass" : "is-recorded"}><IconCheck size={ICON_SIZE.micro} />{isAddCustom ? "通过" : "已记录"}</b></span><span>{isAddCustom ? "[17,33]" : "NCHW [1,3,224,224]"}<b className={isAddCustom ? "is-warning" : "is-review"}><IconAlertCircle size={ICON_SIZE.micro} />{isAddCustom ? "失败" : "待核对"}</b></span></div>
  </>;

  if (slide.visual === "compare") return <>
    <div className="tiktok-slide-heading">
      <span className="tiktok-visual-eyebrow">{slide.eyebrow}</span>
      <h3>{title}</h3>
    </div>
    <div className="visual-compare-grid">
      <div className={`visual-compare-panel ${isAddCustom ? "is-pass" : "is-recorded"}`}>
        <div className="visual-compare-panel-meta"><span>{isAddCustom ? "输入组合 A" : "当前输入"}</span><i>{isAddCustom ? <><IconCheck size={ICON_SIZE.inline} />通过</> : "已记录"}</i></div>
        <b>{isAddCustom ? "[16,32]" : "NHWC"}</b>
        <small>{isAddCustom ? "逐元素核对" : "[224,224,3]"}</small>
      </div>
      <IconArrowDown className="visual-compare-divider" size={ICON_SIZE.heading} aria-hidden="true" />
      <div className={`visual-compare-panel ${isAddCustom ? "is-fail" : "is-review"}`}>
        <div className="visual-compare-panel-meta"><span>{isAddCustom ? "输入组合 B" : "目标布局"}</span><i>{isAddCustom ? <><IconAlertCircle size={ICON_SIZE.inline} />失败</> : "待核对"}</i></div>
        <b>{isAddCustom ? "[17,33]" : "NCHW"}</b>
        <small>{isAddCustom ? "尾块边界" : "[1,3,224,224]"}</small>
      </div>
    </div>
    <p className="visual-slide-note">{slide.note}</p>
  </>;

  if (slide.visual === "blocks") return <>
    <div className="tiktok-slide-heading">
      <span className="tiktok-visual-eyebrow">{slide.eyebrow}</span>
      <h3>{title}</h3>
    </div>
    <div className="visual-diagnostic-flow">
      <div><b>01</b><span>{isAddCustom ? "读取范围" : "输入轴顺序"}</span></div>
      <IconArrowDown size={ICON_SIZE.control} aria-hidden="true" />
      <div><b>02</b><span>{isAddCustom ? "循环边界" : "batch 维度"}</span></div>
      <IconArrowDown size={ICON_SIZE.control} aria-hidden="true" />
      <div className="is-focus"><b>03</b><span>{isAddCustom ? "尾块有效元素" : "目标输入约定"}</span><em>待核对</em></div>
    </div>
    <p className="visual-slide-note">{slide.note}</p>
  </>;

  if (slide.visual === "layout") return <>
    <div className="tiktok-slide-heading">
      <span className="tiktok-visual-eyebrow">{slide.eyebrow}</span>
      <h3>{title}</h3>
    </div>
    <div className="visual-evidence-list">
      {["输入形状差异", "逻辑布局与物理分块", "尾块访问线索"].map(item => <div key={item}><IconArrowRight size={ICON_SIZE.inline} aria-hidden="true" /><span>{item}</span><b>图解参考</b></div>)}
      <strong>仍需对照真实代码确认</strong>
    </div>
    <p className="visual-slide-note">{slide.note}</p>
  </>;

  return <>
    <div className="tiktok-slide-heading">
      <span className="tiktok-visual-eyebrow">{slide.eyebrow}</span>
      <h3>{title}</h3>
    </div>
    <div className="visual-evidence-list">
      {["CANN / 芯片 / 编译版本", "两组输入与运行条件", "逐元素误差与原始日志"].map(item => <div key={item}><IconAlertCircle size={ICON_SIZE.inline} aria-hidden="true" /><span>{item}</span><b>待补</b></div>)}
      <strong>真实 NPU 验证待补</strong>
    </div>
    <p className="visual-slide-note">{slide.note}</p>
  </>;
}

function TikTokVisual({ slide, slides, index, onPrevious, onNext, isAddCustom, isLogDiagnostic = false }) {
  return <div className="tiktok-visual-shell">
    <div className={`tiktok-visual tiktok-visual--${slide.visual}`}>
      <div className="tiktok-visual-topline"><span>ASCEND C · DEBUG NOTE</span>{!isLogDiagnostic && <span>{String(index + 1).padStart(2, "0")} / 04</span>}</div>
      <div className={`tiktok-slide-content tiktok-slide-content--${slide.visual}`}>
        <TikTokSlideContent slide={slide} isAddCustom={isAddCustom} />
      </div>
      <div className="tiktok-visual-footer"><span>{slide.footer}</span><b>昇腾开发笔记</b></div>
    </div>
    <div className="tiktok-carousel-controls" aria-label="图文页切换">
      <button type="button" onClick={onPrevious} aria-label="上一张"><IconArrowLeft size={ICON_SIZE.control} /></button>
      <div>{slides.map((_, dotIndex) => <button key={dotIndex} type="button" className={dotIndex === index ? "is-active" : ""} onClick={() => onNext(dotIndex)} aria-label={`查看第 ${dotIndex + 1} 张`} />)}</div>
      <button type="button" onClick={() => onNext((index + 1) % slides.length)} aria-label="下一张"><IconArrowRight size={ICON_SIZE.control} /></button>
    </div>
  </div>;
}

function TikTokDraft({ draft, generated, published, onGenerate, onPublish }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常" || topic === LOG_DIAGNOSTIC_TASK;
  const isLogDiagnostic = topic === LOG_DIAGNOSTIC_TASK;
  const slides = buildTikTokSlides(draft);
  const defaultCaption = isLogDiagnostic
    ? "AddCustom 日志里 [16,32] 通过、[17,33] 在 custom_op.cpp:128 出现 precision mismatch。交互式 Format Lab 用来理解布局关系；图解不是根因结论，也不代表真实代码或 NPU 验证。"
    : isAddCustom
      ? "AddCustom 精度异常别急着改参数，先把输入边界、报错位置和尾块有效元素逐项对齐。尾块只是待验证线索，补齐运行条件与逐元素误差后，再判断根因。"
      : "图像输入形状核对先对齐输入、轴顺序与目标约定，再补充模型签名和实际运行结果。当前页面只展示形状变化，不能替代真实模型验证。";
  const [caption, setCaption] = useState(defaultCaption);
  const slide = slides[slideIndex];
  const previous = () => setSlideIndex(current => (current - 1 + slides.length) % slides.length);
  const next = index => setSlideIndex(typeof index === "number" ? index : (slideIndex + 1) % slides.length);

  return <div className="channel-draft-main channel-draft-main--tiktok">
    <div className="channel-draft-scroll">
      <div className="channel-draft-tiktok-layout">
        <TikTokVisual slide={slide} slides={slides} index={slideIndex} onPrevious={previous} onNext={next} isAddCustom={isAddCustom} isLogDiagnostic={isLogDiagnostic} />
        <section className="channel-draft-copy">
          <div className="channel-draft-kicker"><IconSparkles size={ICON_SIZE.control} />{generated ? isLogDiagnostic ? "本地交互记录已整理" : "AI 已生成图文草稿" : "知识图文预览"}</div>
          <h3>{generated ? "核对图文内容后再发布" : `把${topic}整理成深色知识图文`}</h3>
          <p>{isLogDiagnostic ? "将日志现象、图解观察和待补验证信息整理为社区经验；根因仍需结合代码与环境确认。" : isAddCustom ? "将本次任务中的现象、尾块候选线索和待补证据拆成 4 张图；尾块仅作为待验证线索，不会写成根因。" : "将本次任务中的现象、处理步骤和待补证据拆成 4 张图，区分形状记录与真实设备验证。"}</p>
          {generated ? <>
            <label className="channel-draft-field-label" htmlFor="tiktok-caption">配文</label>
            <textarea id="tiktok-caption" value={caption} onChange={event => setCaption(event.target.value)} rows={5} />
            <div className="channel-draft-hashtags">#昇腾CANN　{isAddCustom ? "#算子开发　#精度排查" : "#图像推理　#输入形状"}</div>
          </> : <div className="channel-draft-checklist"><span><IconCheck size={ICON_SIZE.inline} />4 张深色图文卡</span><span><IconCheck size={ICON_SIZE.inline} />可逐页预览</span><span><IconCheck size={ICON_SIZE.inline} />保留验证边界</span></div>}
        </section>
      </div>
    </div>
    <footer className="channel-draft-footer">
      <p><IconFileText size={ICON_SIZE.control} />{published ? "已完成本地发布演示，未连接抖音发布服务。" : "本地交互演示；发布前可审阅图文与配文。"}</p>
      {published
        ? <button type="button" className="channel-draft-publish is-complete" disabled><IconCheck size={ICON_SIZE.control} />已发布 · 演示</button>
        : generated
          ? <button type="button" className="channel-draft-publish" onClick={onPublish}><IconUpload size={ICON_SIZE.control} />发布到抖音</button>
          : <button type="button" className="channel-draft-publish" onClick={onGenerate}><IconSparkles size={ICON_SIZE.control} />生成图文草稿</button>}
    </footer>
  </div>;
}

export function TikTokPublishedPost({ draft }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常" || topic === LOG_DIAGNOSTIC_TASK;
  const isLogDiagnostic = topic === LOG_DIAGNOSTIC_TASK;
  const slides = buildTikTokSlides(draft);
  const caption = isLogDiagnostic
    ? "AddCustom 日志里 [16,32] 通过、[17,33] 在 custom_op.cpp:128 出现 precision mismatch。交互式 Format Lab 用来理解布局关系；图解不是根因结论，也不代表真实代码或 NPU 验证。"
    : isAddCustom
      ? "AddCustom 精度异常别急着改参数，先把输入边界、报错位置和尾块有效元素逐项对齐。尾块只是待验证线索，补齐运行条件与逐元素误差后，再判断根因。"
      : "图像输入形状核对先对齐输入、轴顺序与目标约定，再补充模型签名和实际运行结果。当前页面只展示形状变化，不能替代真实模型验证。";

  return <article className="douyin-published-post">
    <div className="douyin-published-account"><span className="douyin-published-avatar">昇</span><div><strong>昇腾开发笔记</strong><small>刚刚发布 · 知识图文</small></div><button type="button">关注</button></div>
    <div className="douyin-published-main">
      <TikTokVisual
        slide={slides[slideIndex]}
        slides={slides}
        index={slideIndex}
        onPrevious={() => setSlideIndex(index => (index - 1 + slides.length) % slides.length)}
        onNext={index => setSlideIndex(typeof index === "number" ? index : (slideIndex + 1) % slides.length)}
        isAddCustom={isAddCustom}
        isLogDiagnostic={isLogDiagnostic}
      />
      <div className="douyin-published-copy">
        <h3>{topic}排查笔记</h3>
        <p>{caption}</p>
        <div className="douyin-published-tags">#昇腾CANN　{isAddCustom ? "#算子开发　#精度排查" : "#图像推理　#输入形状"}</div>
        <div className="douyin-published-actions"><span>♡　喜欢</span><span>评论</span><span>分享</span><span>收藏</span></div>
      </div>
    </div>
  </article>;
}

function GitCodeDraft({ draft, generated, published, onGenerate, onPublish }) {
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常" || topic === LOG_DIAGNOSTIC_TASK;
  return <div className="channel-draft-main">
    <div className="channel-draft-scroll">
      <section className="channel-markdown-preview">
        <div className="channel-draft-kicker">GitCode · Issue / PR</div>
        <h3>{generated ? `${topic}：复现记录与排查线索` : "从任务记录生成 Issue / PR 草稿"}</h3>
        <div className="channel-git-labels"><span>精度问题</span><span>待复现核对</span><span>CANN</span></div>
        {generated ? <>
          <h4>现象</h4><p>{draft.problem}</p>
          <h4>已尝试与观察</h4><p>{draft.approach}</p>
          <h4>尚待补充</h4><p>{draft.verification}</p>
          <div className="channel-caution">{isAddCustom ? "尾块边界目前只是待验证线索，尚未确认根因。" : "当前仅完成浏览器形状核对，真实模型和设备验证仍待补充。"}</div>
        </> : <div className="channel-draft-empty"><IconFileText size={ICON_SIZE.feature} /><p>生成后会按 Issue / PR 的结构整理复现步骤、观察结果与待补证据。</p></div>}
      </section>
    </div>
    <footer className="channel-draft-footer"><p><IconFileText size={ICON_SIZE.control} />本地交互演示；不会自动创建真实 Issue / PR。</p>{published ? <button className="channel-draft-publish is-complete" disabled><IconCheck size={ICON_SIZE.control} />已发布 · 演示</button> : generated ? <button className="channel-draft-publish" onClick={onPublish}><IconUpload size={ICON_SIZE.control} />发布到 GitCode</button> : <button className="channel-draft-publish" onClick={onGenerate}><IconSparkles size={ICON_SIZE.control} />生成 Issue / PR 草稿</button>}</footer>
  </div>;
}

function CSDNDraft({ draft, generated, published, onGenerate, onPublish }) {
  const topic = getCommunityDraftTopic(draft);
  return <div className="channel-draft-main">
    <div className="channel-draft-scroll">
      <article className="channel-csdn-preview">
        <div className="channel-draft-kicker">CSDN · 技术博客</div>
        <h3>{generated ? `${topic}排查：从现象到证据核对` : "把任务过程整理成技术博客"}</h3>
        <p className="channel-csdn-subtitle">记录已观察到的现象、检查顺序，以及还需要哪些证据。</p>
        {generated ? <>
          <h4>一、问题现象</h4><p>{draft.problem}</p>
          <h4>二、当前排查方向</h4><p>{draft.approach}</p>
          <h4>三、验证边界</h4><p>{draft.verification}</p>
          <div className="channel-caution">未完成真实 NPU 验证，不将推测写成结论。</div>
        </> : <div className="channel-draft-empty"><IconFileText size={ICON_SIZE.feature} /><p>生成后会整理为标题、问题背景、排查过程和验证说明。</p></div>}
      </article>
    </div>
    <footer className="channel-draft-footer"><p><IconFileText size={ICON_SIZE.control} />本地交互演示；不会自动发布到 CSDN。</p>{published ? <button className="channel-draft-publish is-complete" disabled><IconCheck size={ICON_SIZE.control} />已发布 · 演示</button> : generated ? <button className="channel-draft-publish" onClick={onPublish}><IconUpload size={ICON_SIZE.control} />发布到 CSDN</button> : <button className="channel-draft-publish" onClick={onGenerate}><IconSparkles size={ICON_SIZE.control} />生成技术博客草稿</button>}</footer>
  </div>;
}

export function ChannelDraftContent(props) {
  if (props.channel === "tiktok") return <TikTokDraft {...props} />;
  if (props.channel === "gitcode") return <GitCodeDraft {...props} />;
  return <CSDNDraft {...props} />;
}
