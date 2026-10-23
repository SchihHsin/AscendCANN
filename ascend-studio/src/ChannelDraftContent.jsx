import { useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconFileText,
  IconSparkles,
  IconUpload,
} from "@tabler/icons-react";

export function getCommunityDraftTopic(draft) {
  const problem = String(draft?.problem || "");
  if (/AddCustom|precision mismatch/i.test(problem)) return "AddCustom 精度异常";
  if (/图像|NCHW|NHWC|HWC|CHW/i.test(problem)) return "图像输入形状";
  return "开发任务";
}

function buildTikTokSlides(draft) {
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常";
  return [
    { eyebrow: "先看现象", title: isAddCustom ? "AddCustom\n精度异常，怎么排？" : `${topic}\n怎么核对？`, note: "先固定现象，再整理已有证据", visual: "cover", footer: "问题排查路径 · 01 / 04" },
    { eyebrow: "01 · 复现边界", title: isAddCustom ? "两组输入，\n结果不一样" : "对齐输入与\n目标约定", note: isAddCustom ? "[16,32] 通过　·　[17,33] 失败\n报错位置：custom_op.cpp:128" : "固定示例输入与目标形状\n当前只核对浏览器示例", visual: "compare", footer: "先固定现象，不急着改结论" },
    { eyebrow: isAddCustom ? "02 · 核对候选线索" : "02 · 核对处理步骤", title: isAddCustom ? "检查尾块\n有效元素范围" : "检查轴顺序\n与 batch 维度", note: isAddCustom ? "逐项核对循环边界与有效元素数\n这是一条待验证线索" : "对照模型输入约定\n真实模型条件仍需确认", visual: "blocks", footer: isAddCustom ? "线索不等于根因" : "示例结果不等于模型验证" },
    { eyebrow: "03 · 补证据再判断", title: "把运行条件\n和结果补完整", note: isAddCustom ? "编译命令与版本 · 两次运行条件\n逐元素误差 · 预期与实际结果" : "模型签名与预处理参数\n实际环境 · 模型推理结果", visual: "evidence", footer: "当前没有真实 NPU 验证结论" },
  ];
}

function TikTokVisual({ slide, slides, index, onPrevious, onNext, isAddCustom }) {
  return <div className="tiktok-visual-shell">
    <div className={`tiktok-visual tiktok-visual--${slide.visual}`}>
      <div className="tiktok-visual-topline"><span>ASCEND C · DEBUG NOTE</span><span>{String(index + 1).padStart(2, "0")} / 04</span></div>
      <div className="tiktok-visual-copy">
        <span className="tiktok-visual-eyebrow">{slide.eyebrow}</span>
        <h3>{slide.title.split("\n").map((line, lineIndex) => <span key={lineIndex}>{line}</span>)}</h3>
        <p>{slide.note.split("\n").map((line, lineIndex) => <span key={lineIndex}>{line}</span>)}</p>
      </div>
      <div className="tiktok-visual-art" aria-hidden="true">
        {slide.visual === "cover" && <div className="visual-code-mark"><i /><i /><i /><b>≠</b></div>}
        {slide.visual === "compare" && <div className="visual-compare-grid"><div><b>{isAddCustom ? "16 × 32" : "当前输入"}</b><i>对照</i></div><span>→</span><div><b>{isAddCustom ? "17 × 33" : "目标约定"}</b><i>核对</i></div></div>}
        {slide.visual === "blocks" && <div className="visual-block-row"><i /><i /><i /><i className="is-tail" /><span>{isAddCustom ? "尾块" : "轴顺序"}</span></div>}
        {slide.visual === "evidence" && <div className="visual-evidence-list"><i>运行参数</i><i>{isAddCustom ? "误差记录" : "模型签名"}</i><i className="is-pending">真实验证待补</i></div>}
      </div>
      <div className="tiktok-visual-footer"><span>{slide.footer}</span><b>昇腾开发笔记</b></div>
    </div>
    <div className="tiktok-carousel-controls" aria-label="图文页切换">
      <button type="button" onClick={onPrevious} aria-label="上一张"><IconArrowLeft size={15} /></button>
      <div>{slides.map((_, dotIndex) => <button key={dotIndex} type="button" className={dotIndex === index ? "is-active" : ""} onClick={() => onNext(dotIndex)} aria-label={`查看第 ${dotIndex + 1} 张`} />)}</div>
      <button type="button" onClick={() => onNext((index + 1) % slides.length)} aria-label="下一张"><IconArrowRight size={15} /></button>
    </div>
  </div>;
}

function TikTokDraft({ draft, generated, published, onGenerate, onPublish }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常";
  const slides = buildTikTokSlides(draft);
  const defaultCaption = isAddCustom
    ? "AddCustom 精度异常别急着改参数，先把输入边界、报错位置和尾块有效元素逐项对齐。尾块只是待验证线索，补齐运行条件与逐元素误差后，再判断根因。"
    : "图像输入形状核对先对齐输入、轴顺序与目标约定，再补充模型签名和实际运行结果。浏览器示例只展示形状变化，不能替代真实模型验证。";
  const [caption, setCaption] = useState(defaultCaption);
  const slide = slides[slideIndex];
  const previous = () => setSlideIndex(current => (current - 1 + slides.length) % slides.length);
  const next = index => setSlideIndex(typeof index === "number" ? index : (slideIndex + 1) % slides.length);

  return <div className="channel-draft-main channel-draft-main--tiktok">
    <div className="channel-draft-scroll">
      <div className="channel-draft-tiktok-layout">
        <TikTokVisual slide={slide} slides={slides} index={slideIndex} onPrevious={previous} onNext={next} isAddCustom={isAddCustom} />
        <section className="channel-draft-copy">
          <div className="channel-draft-kicker"><IconSparkles size={15} />{generated ? "AI 已生成图文草稿" : "知识图文预览"}</div>
          <h3>{generated ? "核对图文内容后再发布" : `把${topic}整理成深色知识图文`}</h3>
          <p>{isAddCustom ? "将本次任务中的现象、尾块候选线索和待补证据拆成 4 张图；尾块仅作为待验证线索，不会写成根因。" : "将本次任务中的现象、处理步骤和待补证据拆成 4 张图，保留示例与真实验证之间的边界。"}</p>
          {generated ? <>
            <label className="channel-draft-field-label" htmlFor="tiktok-caption">配文</label>
            <textarea id="tiktok-caption" value={caption} onChange={event => setCaption(event.target.value)} rows={5} />
            <div className="channel-draft-hashtags">#昇腾CANN　{isAddCustom ? "#算子开发　#精度排查" : "#图像推理　#输入形状"}</div>
          </> : <div className="channel-draft-checklist"><span><IconCheck size={14} />4 张深色图文卡</span><span><IconCheck size={14} />可逐页预览</span><span><IconCheck size={14} />保留验证边界</span></div>}
        </section>
      </div>
    </div>
    <footer className="channel-draft-footer">
      <p><IconFileText size={15} />{published ? "已完成本地发布演示，未连接抖音发布服务。" : "本地交互演示；发布前可审阅图文与配文。"}</p>
      {published
        ? <button type="button" className="channel-draft-publish is-complete" disabled><IconCheck size={16} />已发布 · 演示</button>
        : generated
          ? <button type="button" className="channel-draft-publish" onClick={onPublish}><IconUpload size={16} />发布到抖音</button>
          : <button type="button" className="channel-draft-publish" onClick={onGenerate}><IconSparkles size={16} />生成图文草稿</button>}
    </footer>
  </div>;
}

function GitCodeDraft({ draft, generated, published, onGenerate, onPublish }) {
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常";
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
          <div className="channel-caution">{isAddCustom ? "尾块边界目前只是待验证线索，尚未确认根因。" : "当前仅完成浏览器示例形状核对，真实模型和设备验证仍待补充。"}</div>
        </> : <div className="channel-draft-empty"><IconFileText size={22} /><p>生成后会按 Issue / PR 的结构整理复现步骤、观察结果与待补证据。</p></div>}
      </section>
    </div>
    <footer className="channel-draft-footer"><p><IconFileText size={15} />本地交互演示；不会自动创建真实 Issue / PR。</p>{published ? <button className="channel-draft-publish is-complete" disabled><IconCheck size={16} />已发布 · 演示</button> : generated ? <button className="channel-draft-publish" onClick={onPublish}><IconUpload size={16} />发布到 GitCode</button> : <button className="channel-draft-publish" onClick={onGenerate}><IconSparkles size={16} />生成 Issue / PR 草稿</button>}</footer>
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
        </> : <div className="channel-draft-empty"><IconFileText size={22} /><p>生成后会整理为标题、问题背景、排查过程和验证说明。</p></div>}
      </article>
    </div>
    <footer className="channel-draft-footer"><p><IconFileText size={15} />本地交互演示；不会自动发布到 CSDN。</p>{published ? <button className="channel-draft-publish is-complete" disabled><IconCheck size={16} />已发布 · 演示</button> : generated ? <button className="channel-draft-publish" onClick={onPublish}><IconUpload size={16} />发布到 CSDN</button> : <button className="channel-draft-publish" onClick={onGenerate}><IconSparkles size={16} />生成技术博客草稿</button>}</footer>
  </div>;
}

export function ChannelDraftContent(props) {
  if (props.channel === "tiktok") return <TikTokDraft {...props} />;
  if (props.channel === "gitcode") return <GitCodeDraft {...props} />;
  return <CSDNDraft {...props} />;
}
