import { useRef, useState } from "react";
import {
  IconArrowRight,
  IconBook,
  IconBulb,
  IconCode,
  IconFileText,
  IconPaperclip,
  IconPhoto,
  IconPlus,
  IconSparkles,
  IconBrain,
  IconX,
} from "@tabler/icons-react";
import { HomeComputeBackdrop } from "./HomeComputeBackdrop";
import { FolderCardSurface } from "./FolderCardSurface";
import { buildHomeSuggestions } from "./home-recommendations";
import { useHomeRecommendationState } from "./useHomeRecommendationState";
import "./new-task-home.css";

const modes = [
  { id: "learning", label: "学习", placeholder: "描述你的学习目标、遇到的问题或想掌握的主题…", action: "生成学习路径" },
  { id: "development", label: "开发", placeholder: "描述你要实现的功能、遇到的问题或希望修改的代码…", action: "开始开发任务" },
];

const codeFilePattern = /\.(c|cc|cpp|cxx|h|hpp|py|js|jsx|ts|tsx|txt|log|csv|json|md|yaml|yml)$/i;
const createId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const HOME_CODE_HIGHLIGHT_PATTERN = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:const|auto|int|uint32_t|float|double|bool|void|Shape|PixelFormat)\b|\b(?:nullptr|true|false|RGB|NCHW|HWC)\b|\b\d+(?:\.\d+)?(?:[fFuUlL]*)\b|[A-Za-z_]\w*(?:(?:\.[A-Za-z_]\w*)|(?:::?[A-Za-z_]\w*))*?(?=\s*(?:\(|<<<))/g;
const HOME_CODE_TYPE_TOKENS = new Set(["const", "auto", "int", "uint32_t", "float", "double", "bool", "void", "Shape", "PixelFormat"]);
const HOME_CODE_CONSTANT_TOKENS = new Set(["nullptr", "true", "false", "RGB", "NCHW", "HWC"]);

function highlightHomeCode(line) {
  const fragments = [];
  let cursor = 0;
  for (const match of line.matchAll(new RegExp(HOME_CODE_HIGHLIGHT_PATTERN.source, "g"))) {
    const [token] = match;
    const start = match.index;
    if (start > cursor) fragments.push(line.slice(cursor, start));
    const tokenType = token.startsWith('"') || token.startsWith("'")
      ? "string"
      : /^\d/.test(token)
        ? "number"
        : HOME_CODE_TYPE_TOKENS.has(token)
          ? "type"
          : HOME_CODE_CONSTANT_TOKENS.has(token)
            ? "constant"
            : "function";
    fragments.push(<span key={`${start}-${token}`} className={`new-task-home__card-error-code-token new-task-home__card-error-code-token--${tokenType}`}>{token}</span>);
    cursor = start + token.length;
  }
  if (cursor < line.length) fragments.push(line.slice(cursor));
  return fragments.length ? fragments : line;
}

export function NewTaskHome({ onCreateTask, currentTaskName = "当前任务", tasks = [], onRecommendationAction, onRecommendationChat }) {
  const [mode, setMode] = useState("learning");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [snippet, setSnippet] = useState("");
  const [snippetOpen, setSnippetOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const goalRef = useRef(null);
  const activeMode = modes.find((item) => item.id === mode) || modes[0];
  const candidates = buildHomeSuggestions({ tasks, currentTaskName, mode }).map((item, index) => ({
    ...item,
    id: item.id || `${mode}:${item.taskName || "task"}:${item.type || item.title || index}`,
    revision: item.revision ?? item.updatedAt ?? item.evidenceRevision ?? "1",
    evidence: item.evidence || [],
    action: item.action || {},
    steps: item.steps || [],
    reason: item.reason || "根据该任务的现有记录，建议继续核对下一步。",
  }));
  const { suggestions, snooze } = useHomeRecommendationState(candidates);

  const addFiles = async (fileList, forcedType) => {
    const incomingFiles = Array.from(fileList || []);
    const incoming = await Promise.all(incomingFiles.map(async (file, index) => {
      const type = forcedType || (file.type.startsWith("image/") ? "image" : "file");
      const content = type === "file" && codeFilePattern.test(file.name) && file.size < 131072
        ? await file.text().catch(() => "")
        : "";
      return { id: createId(), name: file.name, type, size: file.size, content, receivedOrder: attachments.length + index + 1 };
    }));
    if (incoming.length) {
      setAttachments((items) => [...items, ...incoming]);
      setError("");
    }
  };

  const handleInputFiles = (event, forcedType) => {
    const files = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = "";
    void addFiles(files, forcedType);
  };

  const attachSnippet = () => {
    const content = snippet.trim();
    if (!content) {
      setError("先粘贴要添加的代码片段。");
      return;
    }
    setAttachments((items) => [...items, {
      id: createId(),
      name: `代码片段 ${items.filter((item) => item.type === "code").length + 1}.txt`,
      type: "code",
      size: content.length,
      content,
      receivedOrder: items.length + 1,
    }]);
    setSnippet("");
    setSnippetOpen(false);
    setError("");
  };

  const setCardExpanded = (id) => setExpandedCardId(id);

  const submit = (event) => {
    event.preventDefault();
    const cleanGoal = goal.trim();
    if (!cleanGoal) {
      setError("先写下你想学习或开发的目标。");
      goalRef.current?.focus();
      return;
    }
    const created = onCreateTask?.({ goal: cleanGoal, kind: mode, attachments });
    if (!created) setError("任务没有创建成功，请调整目标后重试。");
  };

  const openSnippet = () => {
    setSnippetOpen((open) => !open);
    setQuickMenuOpen(false);
    setError("");
  };

  return (
    <section
      className="new-task-home"
      aria-label="新建任务"
    >
      <HomeComputeBackdrop />
      <div className="new-task-home__hero">
        <h1>开始一个新任务</h1>
        <div className="new-task-home__mode" role="group" aria-label="任务类型">
          {modes.map((item) => (
            <button
              key={item.id}
              className={"new-task-home__mode-button" + (item.id === mode ? " is-active" : "")}
              type="button"
              aria-pressed={item.id === mode}
              onClick={() => { setMode(item.id); setError(""); setCardExpanded(null); }}
            >
              {item.id === "learning" ? <IconBook size={22} stroke={1.8} aria-hidden="true" /> : <IconCode size={22} stroke={1.8} aria-hidden="true" />}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`new-task-home__suggestions${suggestions.length === 0 ? " is-empty" : ` is-count-${suggestions.length}`}`} aria-label="任务起点">
        {suggestions.length === 0 && <p className="new-task-home__empty" role="status">目前没有需要优先处理的建议。你可以直接描述新的学习或开发目标。</p>}
        {suggestions.map((item) => {
          const index = suggestions.indexOf(item);
          const cardTone = ["rose", "sand", "blue"][index] || "rose";
          const errorLearning = item.type.startsWith("error-learning-");
          const errorIcons = [IconBook, IconFileText, IconBrain];
          const Icon = errorLearning ? errorIcons[index % errorIcons.length] : mode === "learning" ? IconBook : item.tone === "blue" ? IconBrain : IconFileText;
          const Motif = errorLearning ? errorIcons[index % errorIcons.length] : mode === "learning" ? IconBook : item.tone === "blue" ? IconBrain : IconBulb;
          const expanded = expandedCardId === item.id;
          const detailsId = `home-suggestion-details-${String(item.id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
          return (
            <article
              key={item.id}
              className={`new-task-home__card new-task-home__card--${cardTone}${errorLearning ? " is-error-learning" : ""}${expanded ? " is-expanded" : ""}`}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") setCardExpanded(item.id); }}
              onPointerLeave={(event) => { if (event.pointerType !== "touch" && !event.currentTarget.contains(document.activeElement)) setCardExpanded(null); }}
              onFocusCapture={() => setCardExpanded(item.id)}
              onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setCardExpanded(null); }}
              onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); event.currentTarget.querySelector(".new-task-home__card-summary")?.blur(); setCardExpanded(null); } }}
            >
              <FolderCardSurface />
              <button
                className={`new-task-home__card-summary${errorLearning ? " is-error-learning" : ""}`}
                type="button"
                aria-label={errorLearning
                  ? `建议学习${item.title}，${item.errorPeriod}出错${item.errorCount}次，展开查看错误详情和推荐说明`
                  : `${item.taskName}：${item.title}，前往任务`}
                aria-controls={detailsId}
                aria-expanded={expanded}
                onClick={() => onRecommendationAction?.(item)}
              >
                {errorLearning ? <>
                  <span className="new-task-home__card-error-heading">
                    <Icon size={20} stroke={1.8} aria-hidden="true" />
                    <strong title={item.title}>{item.title}</strong>
                    <span className="new-task-home__card-action" aria-hidden="true"><IconArrowRight size={14} /></span>
                  </span>
                  <span className="new-task-home__card-error-count">{item.errorPeriod}出错 <strong>{item.errorCount} 次</strong></span>
                  {!expanded && <ul className="new-task-home__card-error-examples" aria-label="近期错误记录">
                    {item.errorExamples.slice(0, 2).map((example) => <li key={`${example.date}-${example.summary}`} title={`${example.date} · ${example.summary}`}><time>{example.date}</time><span aria-hidden="true">·</span><span className="new-task-home__card-error-summary">{example.summary}</span></li>)}
                  </ul>}
                </> : <>
                  <span className="new-task-home__card-context"><Icon size={22} stroke={1.8} aria-hidden="true" /><span className="new-task-home__card-source" title={item.taskName}>{item.taskName}<small>{item.project ? ` · ${item.project}` : ""}</small></span></span>
                  <span className="new-task-home__card-activity" title={item.activity}>{item.activity}</span>
                  <span className="new-task-home__card-title"><strong title={item.title}>建议：{item.title}</strong><span className="new-task-home__card-action" aria-hidden="true"><IconArrowRight size={14} /></span></span>
                  <span className="new-task-home__card-reason">{item.reason}</span>
                </>}
              </button>
              <div className="new-task-home__card-details" id={detailsId} hidden={!expanded}>
                {errorLearning ? <>
                  <div className="new-task-home__card-error-detail-list" aria-label="近期错误详情">
                    <span className="new-task-home__card-error-detail-label">近期记录 · 示例代码</span>
                    {item.errorExamples.slice(0, 2).map((example) => <section className="new-task-home__card-error-detail" key={`${example.date}-${example.summary}`}>
                      <div className="new-task-home__card-error-detail-heading"><time>{example.date}</time><strong>{example.summary}</strong></div>
                      <p className="new-task-home__card-error-detail-context">{example.detail}</p>
                      <div className="new-task-home__card-error-code-wrap">
                        <ol className="new-task-home__card-error-code" aria-label="演示代码片段">
                          {example.code.map((line, lineIndex) => <li key={`${lineIndex}-${line}`}><code>{highlightHomeCode(line)}</code></li>)}
                        </ol>
                      </div>
                    </section>)}
                  </div>
                  <div className="new-task-home__card-error-guidance" aria-label="推荐说明">
                    <p><strong>推荐理由</strong><span>{item.recommendationReason}</span></p>
                    <p><strong>学习方向</strong><span>{item.learningDirection}</span></p>
                  </div>
                </> : <>
                  {item.evidence?.length > 0 && <ul className="new-task-home__card-evidence" aria-label="推荐依据">{item.evidence.slice(0, 3).map((evidence) => <li key={evidence.id}><strong>{evidence.title}</strong>{evidence.summary && <span>{evidence.summary}</span>}{evidence.time && <time>{evidence.time}</time>}</li>)}</ul>}
                  {item.condition && <p className="new-task-home__card-condition">适用条件：{item.condition}</p>}
                  {item.steps?.length > 0 && <ul className="new-task-home__card-steps" aria-label="建议步骤">{item.steps.slice(0, 3).map((step, stepIndex) => <li key={`${stepIndex}-${step}`}>{step}</li>)}</ul>}
                </>}
                <div className="new-task-home__card-buttons">
                  <button className="new-task-home__card-continue" type="button" onClick={() => onRecommendationAction?.(item)}>{item.actionLabel || "查看建议"}</button>
                  <button className="new-task-home__card-chat" type="button" onClick={() => onRecommendationChat?.(item)}>先聊聊</button>
                  <button className="new-task-home__card-snooze" type="button" onClick={() => { snooze(item); setCardExpanded(null); }}>暂不处理</button>
                </div>
              </div>
              <Motif className="new-task-home__card-motif" size={76} stroke={1.2} aria-hidden="true" />
            </article>
          );
        })}
      </div>

      <form className="new-task-home__composer" onSubmit={submit}>
        {attachments.length > 0 && (
          <div className="new-task-home__attachments" aria-label="已添加材料">
            {attachments.map((item) => (
              <span className="new-task-home__attachment" key={item.id} title={item.name}>
                {item.type === "image" ? <IconPhoto size={14} aria-hidden="true" /> : item.type === "code" ? <IconCode size={14} aria-hidden="true" /> : <IconPaperclip size={14} aria-hidden="true" />}
                <span>{item.name}</span>
                <button type="button" aria-label={`移除附件 ${item.name}`} onClick={() => setAttachments((items) => items.filter((attachment) => attachment.id !== item.id))}><IconX size={13} /></button>
              </span>
            ))}
          </div>
        )}
        {snippetOpen && (
          <div className="new-task-home__snippet-popover">
            <label htmlFor="new-task-code-snippet">添加代码片段</label>
            <textarea id="new-task-code-snippet" value={snippet} onChange={(event) => setSnippet(event.target.value)} placeholder="粘贴代码或日志片段…" rows={5} />
            <div>
              <button type="button" onClick={() => { setSnippetOpen(false); setSnippet(""); }}>取消</button>
              <button type="button" className="is-primary" onClick={attachSnippet}>添加代码</button>
            </div>
          </div>
        )}
        {quickMenuOpen && (
          <div className="new-task-home__quick-menu" role="group" aria-label="添加上下文">
            <button type="button" onClick={openSnippet}><IconCode size={16} />代码片段</button>
            <button type="button" onClick={() => { setQuickMenuOpen(false); imageInputRef.current?.click(); }}><IconPhoto size={16} />截图</button>
            <button type="button" onClick={() => { setQuickMenuOpen(false); fileInputRef.current?.click(); }}><IconPaperclip size={16} />文件</button>
          </div>
        )}
        <label className="new-task-home__field">
          <span className="new-task-home__sr-only">{activeMode.label}目标</span>
          <textarea
            ref={goalRef}
            value={goal}
            onChange={(event) => { setGoal(event.target.value); setError(""); }}
            placeholder={activeMode.placeholder}
            maxLength={2000}
            rows={2}
            aria-label={`${activeMode.label}目标`}
          />
          {goal.length > 0 && <span className="new-task-home__count">{goal.length} / 2000</span>}
        </label>
        <div className="new-task-home__toolbar">
          <div className="new-task-home__tools">
            <button className="new-task-home__add-button" type="button" aria-label="添加上下文" title="添加上下文" aria-expanded={quickMenuOpen} onClick={() => { setQuickMenuOpen((open) => !open); setSnippetOpen(false); }}><IconPlus size={23} stroke={1.8} /></button>
            <button className="new-task-home__tool-button" type="button" onClick={openSnippet}><IconCode size={18} />代码片段</button>
            <button className="new-task-home__tool-button" type="button" onClick={() => imageInputRef.current?.click()}><IconPhoto size={18} />截图</button>
            <button className="new-task-home__tool-button" type="button" onClick={() => fileInputRef.current?.click()}><IconPaperclip size={18} />文件</button>
          </div>
          <button className="new-task-home__submit" type="submit" disabled={!goal.trim()}>
            <IconSparkles size={18} aria-hidden="true" />
            <span>{activeMode.action}</span>
            <IconArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
        {error && <p className="new-task-home__error" role="alert">{error}</p>}
        <input ref={fileInputRef} className="new-task-home__file-input" type="file" multiple onChange={(event) => handleInputFiles(event)} aria-label="选择文件" />
        <input ref={imageInputRef} className="new-task-home__file-input" type="file" multiple accept="image/*" onChange={(event) => handleInputFiles(event, "image")} aria-label="选择截图" />
      </form>
    </section>
  );
}
