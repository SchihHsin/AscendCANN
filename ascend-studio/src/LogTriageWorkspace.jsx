import { useRef, useState } from "react";
import {
  IconAlertCircle,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconCode,
  IconFileText,
  IconInfoCircle,
  IconSparkles,
  IconTerminal2,
} from "@tabler/icons-react";
import { ICON_SIZE } from "./icon-system.js";
import "./log-triage-workspace.css";

const FLOW_STEPS = ["日志线索", "范围图解", "示例核对", "经验回流"];
const FORMAT_LAB_LIGHT_URL = "https://yinyucheng0601.github.io/compute-graph-viewer/format%20lab/index.html?theme=light";
const LOG_ENTRIES = [
  { time: "09:41:08", kind: "pass", label: "precision_check", detail: "input_shape=[16,32]", status: "PASS" },
  { time: "09:41:13", kind: "fail", label: "precision_check", detail: "input_shape=[17,33]", status: "FAIL" },
  { time: "09:41:13", kind: "clue", label: "precision mismatch", detail: "custom_op.cpp:128", status: "线索" },
  { time: "09:44:02", kind: "neutral", label: "compile flags changed", detail: "错误位置未变", status: "重试" },
];

function StepButton({ index, active, done, disabled, onClick }) {
  return <button
    className={`log-triage-step${active ? " is-active" : ""}${done ? " is-done" : ""}`}
    type="button"
    aria-current={active ? "step" : undefined}
    disabled={disabled}
    onClick={onClick}
  >
    <span className="log-triage-step-number">{done ? <IconCheck size={ICON_SIZE.micro} /> : String(index + 1).padStart(2, "0")}</span>
    <span>{FLOW_STEPS[index]}</span>
  </button>;
}

export const INITIAL_LOG_TRIAGE_STATE = Object.freeze({ step: 0, exampleApplied: false, verified: false, experienceReady: false });

export function LogTriageWorkspace({ state = INITIAL_LOG_TRIAGE_STATE, onStateChange = () => {}, onFormatLabFocusChange = () => {}, onCommunityExperienceReady, communityReady = false }) {
  const { step, exampleApplied, verified, experienceReady } = { ...INITIAL_LOG_TRIAGE_STATE, ...state };
  const contentRef = useRef(null);
  const [formatLabMounted, setFormatLabMounted] = useState(step === 1);
  const total = 17 * 33;
  const tileSize = 32;
  const blocks = Math.ceil(total / tileSize);
  const tail = total % tileSize;
  const updateState = patch => onStateChange(previous => ({ ...INITIAL_LOG_TRIAGE_STATE, ...previous, ...patch }));
  const setStage = (next) => {
    if (next === 1) setFormatLabMounted(true);
    onFormatLabFocusChange(next === 1);
    updateState({ step: next });
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const createExperienceEntry = () => {
    if (!verified || experienceReady || communityReady) return;
    onCommunityExperienceReady?.({
      id: "demo-addcustom-log-diagnostic-resolution",
      kind: "addcustom-log-diagnostic-resolution",
      demoFixture: true,
      rows: 17,
      columns: 33,
      tileSize,
      completionText: "示例范围核对已通过。可以把这次从日志、图解到示例验证的过程整理为社区经验；真实根因与目标环境结果仍待确认。",
    });
    updateState({ experienceReady: true });
  };

  return <section className="log-triage-shell" aria-label="Add 算子日志排查 Skill">
    <header className="log-triage-header">
      <span className="log-triage-header-icon"><IconTerminal2 size={ICON_SIZE.heading} /></span>
      <div className="log-triage-heading-copy"><h2>从日志开始排查</h2><p>Add 算子精度异常 · CANN 日志排查 Skill</p></div>
      <span className="log-triage-cost" title="预置日志命中本地规则，没有调用模型">本地规则 · 0 tokens</span>
    </header>

    <nav className="log-triage-progress" aria-label="排查流程">
      {FLOW_STEPS.map((label, index) => <StepButton
        key={label}
        index={index}
        active={step === index}
        done={index === 0 ? step > 0 : index === 1 ? exampleApplied : index === 2 ? verified : experienceReady || communityReady}
        disabled={index > (verified || experienceReady || communityReady ? 3 : exampleApplied ? 2 : 1)}
        onClick={() => setStage(index)}
      />)}
    </nav>

    <div className="log-triage-scroll" ref={contentRef}>
      {step === 0 && <div className="log-triage-stage">
        <div className="log-triage-stage-heading"><span>01 / 04</span><h3>先让日志把问题说清楚</h3><p>规则从日志中提取输入对照、错误位置和已经尝试的动作。</p></div>
        <section className="log-evidence-card" aria-label="预置运行日志">
          <header><div><IconFileText size={ICON_SIZE.control} /><strong>add_custom_op.log</strong></div><span>4 条相关记录</span></header>
          <div className="log-evidence-rows">{LOG_ENTRIES.map((entry, index) => <div className={`log-evidence-row is-${entry.kind}`} key={`${entry.time}-${index}`}>
            <time>{entry.time}</time><span className="log-evidence-marker" /><code>{entry.label}</code><span className="log-evidence-detail">{entry.detail}</span><b>{entry.status}</b>
          </div>)}</div>
        </section>
        <div className="log-signal-summary">
          <div className="log-signal-icon"><IconAlertCircle size={ICON_SIZE.heading} /></div>
          <div><strong>两组形状结果不同，错误仍落在同一位置</strong><p><code>[16,32]</code> 通过，<code>[17,33]</code> 失败。可以先核对非整块输入的访问范围。</p></div>
          <span>待核查</span>
        </div>
        <div className="log-triage-stage-footer"><span>预置日志命中规则，无需为重复解析消耗模型 Token</span><button className="log-triage-primary" type="button" onClick={() => setStage(1)}>看范围图解<IconArrowRight size={ICON_SIZE.inline} /></button></div>
      </div>}

      {formatLabMounted && <div className="log-triage-stage log-triage-stage--format-lab" hidden={step !== 1}>
        <iframe
          className="log-triage-format-lab-frame"
          src={FORMAT_LAB_LIGHT_URL}
          title="Format Lab · Layout Model（浅色模式）"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="log-triage-stage-footer"><span>图解提供排查方向，不代替代码证据</span><button className="log-triage-primary" type="button" onClick={() => setStage(2)}>对照示例修正<IconArrowRight size={ICON_SIZE.inline} /></button></div>
      </div>}

      {step === 2 && <div className="log-triage-stage">
        <div className="log-triage-stage-heading"><span>03 / 04</span><h3>把排查方向放进示例里核对</h3><p>先对照固定块长与尾块有效长度，再运行范围算例。</p></div>
        <div className="log-code-comparison">
          <article className="log-code-card"><header><span>当前示例</span><small>循环边界</small></header><pre><code>for (int offset = 0; offset &lt; tileSize; ++offset) &#123;\n  // 读写当前块\n&#125;</code></pre><p><IconAlertCircle size={ICON_SIZE.inline} />固定读取 32 个位置；是否符合真实实现需查看源码。</p></article>
          <article className={`log-code-card is-proposed${exampleApplied ? " is-applied" : ""}`}><header><span>建议对照</span><small>{exampleApplied ? "已放入示例副本" : "候选边界处理"}</small></header><pre><code>const int validCount =\n  min(tileSize, total - baseIndex);\nfor (int offset = 0; offset &lt; validCount; ++offset) &#123;\n  // 只遍历有效元素\n&#125;</code></pre><p><IconInfoCircle size={ICON_SIZE.inline} />仅是范围处理示例，不是对真实项目的代码修改。</p></article>
        </div>
        {!exampleApplied
          ? <button className="log-triage-primary log-triage-action-wide" type="button" onClick={() => updateState({ exampleApplied: true })}><IconCode size={ICON_SIZE.control} />放入示例副本</button>
          : <div className="log-applied-state"><IconCircleCheck size={ICON_SIZE.control} /><span>示例副本已采用有效元素边界；项目文件没有改动。</span></div>}
        <div className="log-verify-row">
          <div><strong>{verified ? "示例范围核对通过" : "下一步：运行范围算例"}</strong><p>{verified ? `${blocks} 块 · 最后一块 ${tail} 个有效元素 · 范围外索引 0` : "浏览器只计算示例索引范围，不编译 C++，不检查实际精度。"}</p></div>
          <button className="log-triage-primary" type="button" disabled={!exampleApplied} onClick={() => updateState({ verified: true })}>{verified ? <><IconCheck size={ICON_SIZE.inline} />已核对</> : <>运行示例核对<IconArrowRight size={ICON_SIZE.inline} /></>}</button>
        </div>
        {verified && <div className="log-triage-stage-footer"><span>范围算例通过 ≠ 真实精度或 NPU 验证</span><button className="log-triage-primary" type="button" onClick={() => setStage(3)}>沉淀排查经验<IconArrowRight size={ICON_SIZE.inline} /></button></div>}
      </div>}

      {step === 3 && <div className="log-triage-stage log-triage-stage--community">
        <div className="log-community-mark"><IconSparkles size={ICON_SIZE.heading} /></div>
        <div className="log-triage-stage-heading"><span>04 / 04</span><h3>把私人排查过程变成可复用经验</h3><p>保存问题现象、图解依据和示例核对结果；环境版本与真实验证仍留给开发者补充。</p></div>
        <section className="log-community-outline">
          <div><span>问题现象</span><p>[16,32] 通过，[17,33] 在 custom_op.cpp:128 报 precision mismatch</p></div>
          <div><span>排查路径</span><p>日志对照 → 尾块图解 → 有效元素边界示例</p></div>
          <div><span>验证状态</span><p>{verified ? "浏览器范围示例通过；真实代码与 NPU 待验证" : "等待示例范围核对"}</p></div>
        </section>
        {communityReady || experienceReady
          ? <div className="log-community-ready" role="status"><IconCircleCheck size={ICON_SIZE.heading} /><div><strong>经验回流入口已加入任务对话</strong><p>在对话底部打开社区草稿，按实际环境和验证记录编辑后再提交。</p></div></div>
          : <button className="log-triage-primary log-triage-action-wide" type="button" disabled={!verified} onClick={createExperienceEntry}><IconFileText size={ICON_SIZE.control} />生成社区经验入口</button>}
        <p className="log-triage-boundary"><IconInfoCircle size={ICON_SIZE.inline} />草稿来自预置日志与演示步骤，保留为可编辑内容；不会自动发布，也不代表根因已确认。</p>
      </div>}
    </div>
  </section>;
}

export default LogTriageWorkspace;
