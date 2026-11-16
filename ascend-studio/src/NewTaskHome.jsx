import { ICON_SIZE } from "./icon-system.js";
import { useEffect, useRef, useState } from "react";
import { CombinationTaskHome } from "./CombinationTaskHome";
import {
  IconArrowRight,
  IconCards,
  IconBook,
  IconBulb,
  IconCode,
  IconFileText,
  IconPaperclip,
  IconPhoto,
  IconPlus,
  IconSparkles,
  IconBrain,
  IconAffiliate,
  IconMessageCircle,
  IconExternalLink,
  IconRoute,
  IconX,
} from "@tabler/icons-react";
import { HomeComputeBackdrop } from "./HomeComputeBackdrop";
import { FolderCardSurface } from "./FolderCardSurface";
import { buildHomeSuggestions } from "./home-recommendations";
import { buildProjectRulesPlan } from "./project-rules-learning";
import { useHomeRecommendationState } from "./useHomeRecommendationState";
import "./new-task-home.css";
import "./home-variants.css";

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

function ClassicTaskHome({ onCreateTask, currentTaskName = "当前任务", tasks = [], onRecommendationAction, onRecommendationChat, onOpenCapabilities }) {
  const [mode, setMode] = useState("learning");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [projectRulesIntent, setProjectRulesIntent] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const fileInputRef = useRef(null);
  const goalRef = useRef(null);
  const lastCardPointerTypeRef = useRef("mouse");
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
      const content = type === "file" && codeFilePattern.test(file.name) && file.size <= 2 * 1024 * 1024
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

  const setCardExpanded = (id) => setExpandedCardId(id);

  const submit = (event) => {
    event.preventDefault();
    const cleanGoal = goal.trim() || (projectRulesIntent ? "请结合近期昇腾开发问题和上传的项目文件，整理学习路径。" : "");
    if (!cleanGoal) {
      setError("先写下你想学习或开发的目标。");
      goalRef.current?.focus();
      return;
    }
    const compositionPlan = projectRulesIntent ? buildProjectRulesPlan(attachments.filter(file => file.type === "file"), cleanGoal) : null;
    if (projectRulesIntent && !compositionPlan) { setError("没有读取到文件中的文字，请选择可读取的文本或 Markdown 文件。"); return; }
    const created = onCreateTask?.({ goal: cleanGoal, kind: mode, attachments, compositionPlan });
    if (!created) setError("任务没有创建成功，请调整目标后重试。");
  };

  const openRecommendation = (item) => {
    if (item.action?.type === "project-rules-upload") {
      setProjectRulesIntent(true);
      setGoal("请结合近期昇腾开发问题和上传的项目文件，整理学习路径。");
      fileInputRef.current?.click();
      return;
    }
    onRecommendationAction?.(item);
  };

  const startLearningFromQuestionTrail = (item) => {
    setMode("learning");
    setProjectRulesIntent(false);
    setGoal(item.prompt || `请围绕“${item.title}”整理学习路径。`);
    setError("");
    setCardExpanded(null);
    requestAnimationFrame(() => goalRef.current?.focus());
  };

  const addProjectRulesToQuestionTrail = (item) => {
    setMode("learning");
    setProjectRulesIntent(true);
    const learningGoal = item.prompt || `请围绕“${item.title}”整理学习路径。`;
    setGoal(`${learningGoal} 请再结合我上传的项目规则，核对其中涉及的接口与约束。`);
    setError("");
    fileInputRef.current?.click();
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
              onClick={() => { setMode(item.id); setError(""); setCardExpanded(null); setProjectRulesIntent(false); }}
            >
              {item.id === "learning" ? <IconBook size={ICON_SIZE.feature} aria-hidden="true" /> : <IconCode size={ICON_SIZE.feature} aria-hidden="true" />}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`new-task-home__suggestions${suggestions.length === 0 ? " is-empty" : ` is-count-${suggestions.length}`}`} aria-label="任务起点">
        {suggestions.length === 0 && <p className="new-task-home__empty" role="status">目前没有需要优先处理的建议。你可以直接描述新的学习或开发目标。</p>}
        {suggestions.map((item) => {
          const index = suggestions.indexOf(item);
          const cardTone = ["rose", "sand", "blue", "sand"][index] || "rose";
          const errorLearning = item.type.startsWith("error-learning-");
          const questionTrail = item.type === "question-trail";
          const learningProgress = item.type === "continue-official-learning";
          const externalQuestion = questionTrail ? item.questionTrail.find(question => question.context === "平台外开发") : null;
          const relatedTaskQuestionCount = questionTrail ? item.questionTrail.filter(question => question.context !== "平台外开发").length : 0;
          const errorIcons = [IconBook, IconFileText, IconBrain];
          const Icon = errorLearning ? errorIcons[index % errorIcons.length] : questionTrail ? IconMessageCircle : learningProgress ? IconRoute : mode === "learning" ? IconBook : item.tone === "blue" ? IconBrain : IconFileText;
          const Motif = errorLearning ? errorIcons[index % errorIcons.length] : questionTrail ? IconMessageCircle : learningProgress ? IconRoute : mode === "learning" ? IconBook : item.tone === "blue" ? IconBrain : IconBulb;
          const expanded = expandedCardId === item.id;
          const detailsId = `home-suggestion-details-${String(item.id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
          return (
            <article
              key={item.id}
              className={`new-task-home__card new-task-home__card--${cardTone}${errorLearning ? " is-error-learning" : ""}${questionTrail ? " is-question-trail" : ""}${learningProgress ? " is-learning-progress" : ""}${expanded ? " is-expanded" : ""}`}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") setCardExpanded(item.id); }}
              onPointerDownCapture={(event) => { lastCardPointerTypeRef.current = event.pointerType; }}
              onPointerLeave={(event) => { if (event.pointerType !== "touch" && !event.currentTarget.contains(document.activeElement)) setCardExpanded(null); }}
              onFocusCapture={() => setCardExpanded(item.id)}
              onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setCardExpanded(null); }}
              onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); event.currentTarget.querySelector(".new-task-home__card-summary")?.blur(); setCardExpanded(null); } }}
            >
              <FolderCardSurface />
              <button
                className={`new-task-home__card-summary${errorLearning ? " is-error-learning" : ""}${questionTrail ? " is-question-trail" : ""}${learningProgress ? " is-learning-progress" : ""}`}
                type="button"
                aria-label={errorLearning
                  ? `建议学习${item.title}，${item.errorPeriod}出错${item.errorCount}次，查看错误详情`
                  : questionTrail
                    ? `识别到平台外的开发任务：${externalQuestion?.question || "查看相关提问"}，开始学习${item.title}`
                    : learningProgress
                      ? `打开 ResNet50 推理学习路径，当前${item.learningProgress.currentStage}，已完成${item.learningProgress.completed}/${item.learningProgress.total}个学习动作`
                      : `${item.taskName}：${item.title}，前往任务`}
                aria-controls={detailsId}
                aria-expanded={expanded}
                onClick={() => {
                  if (questionTrail) {
                    const pointerType = lastCardPointerTypeRef.current;
                    lastCardPointerTypeRef.current = "mouse";
                    if (pointerType === "touch" && !expanded) {
                      setCardExpanded(item.id);
                      return;
                    }
                    startLearningFromQuestionTrail(item);
                    return;
                  }
                  openRecommendation(item);
                }}
              >
                {errorLearning ? <>
                  <span className="new-task-home__card-heading">
                    <Icon size={ICON_SIZE.navigation} aria-hidden="true" />
                    <strong title={item.title}>{item.title}</strong>
                    <span className="new-task-home__card-action" aria-hidden="true"><IconArrowRight size={ICON_SIZE.inline} /></span>
                  </span>
                  <span className="new-task-home__card-meta is-error"><span>{item.errorPeriod}出错</span><strong>{item.errorCount} 次</strong></span>
                  {!expanded && <span className="new-task-home__card-body"><ul className="new-task-home__card-error-examples" aria-label="近期错误记录">
                    {item.errorExamples.slice(0, 2).map((example) => <li key={`${example.date}-${example.summary}`} title={`${example.date} · ${example.summary}`}><time>{example.date}</time><span aria-hidden="true">·</span><span className="new-task-home__card-error-summary">{example.summary}</span></li>)}
                  </ul></span>}
                </> : questionTrail ? <>
                  <span className="new-task-home__card-heading">
                    <Icon size={ICON_SIZE.navigation} aria-hidden="true" />
                    <strong title={item.title}>{item.title}</strong>
                    <span className="new-task-home__card-action" aria-hidden="true"><IconArrowRight size={ICON_SIZE.inline} /></span>
                  </span>
                  <span className="new-task-home__card-meta is-detection"><IconExternalLink size={ICON_SIZE.inline} aria-hidden="true" /><strong>识别到平台外的开发任务</strong></span>
                  <span className="new-task-home__card-body">
                    <span className="new-task-home__external-context"><strong>{externalQuestion?.source || "自由提问"}</strong><time>{externalQuestion?.date}</time><span>{externalQuestion?.context}</span></span>
                    <span className="new-task-home__external-question">{externalQuestion?.question}</span>
                    <span className="new-task-home__external-related">关联 {relatedTaskQuestionCount} 个任务内问题 · 模型输入约定</span>
                  </span>
                </> : learningProgress ? <>
                  <span className="new-task-home__card-heading">
                    <Icon size={ICON_SIZE.navigation} aria-hidden="true" />
                    <strong title={item.title}>{item.title}</strong>
                    <span className="new-task-home__card-action" aria-hidden="true"><IconArrowRight size={ICON_SIZE.inline} /></span>
                  </span>
                  <span className="new-task-home__card-meta is-progress"><span>当前阶段</span><strong>{item.learningProgress.currentStage}</strong><small>{item.learningProgress.completed}/{item.learningProgress.total}</small></span>
                  <span className="new-task-home__card-body is-learning-progress">
                    <span className="new-task-home__learning-route" aria-label="学习路径阶段">
                      {item.learningPath.map((stage, stageIndex) => <span className={`new-task-home__learning-stop is-${stage.state}`} key={stage.id} title={stage.title}>
                        <i aria-hidden="true" />{stageIndex < item.learningPath.length - 1 && <b aria-hidden="true" />}
                      </span>)}
                    </span>
                    <span className="new-task-home__learning-labels" aria-hidden="true"><span>认识</span><span>环境</span><span>输入</span><span>执行</span><span>复盘</span></span>
                  </span>
                </> : <>
                  <span className="new-task-home__card-context"><Icon size={ICON_SIZE.feature} aria-hidden="true" /><span className="new-task-home__card-source" title={item.taskName}>{item.taskName}<small>{item.project ? ` · ${item.project}` : ""}</small></span></span>
                  <span className="new-task-home__card-activity" title={item.activity}>{["frequent-questions", "external-project-rules"].includes(item.type) ? "示例 · " : ""}{item.activity}</span>
                  <span className="new-task-home__card-title"><strong title={item.title}>建议：{item.title}</strong><span className="new-task-home__card-action" aria-hidden="true"><IconArrowRight size={ICON_SIZE.inline} /></span></span>
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
                </> : questionTrail ? <>
                  <div className="new-task-home__trail-detail" aria-label="近期提问脉络">
                    {item.questionTrail.map((question, trailIndex) => <section className="new-task-home__trail-entry" key={question.date}>
                      <span className="new-task-home__trail-entry-marker"><i aria-hidden="true" />{trailIndex < item.questionTrail.length - 1 && <b aria-hidden="true" />}</span>
                      <div><div className="new-task-home__trail-entry-meta"><time>{question.date}</time><span>{question.source}</span><small>{question.context}</small></div><p>{question.question}</p></div>
                    </section>)}
                  </div>
                  <div className="new-task-home__trail-actions" aria-label="学习操作">
                    <button className="new-task-home__trail-start" type="button" onClick={() => startLearningFromQuestionTrail(item)}><IconBook size={ICON_SIZE.inline} aria-hidden="true" />开始学习</button>
                    <button className="new-task-home__trail-rules" type="button" onClick={() => addProjectRulesToQuestionTrail(item)}><IconFileText size={ICON_SIZE.inline} aria-hidden="true" />补充项目规则</button>
                  </div>
                </> : learningProgress ? <>
                  <div className="new-task-home__learning-detail" aria-label="学习路径进度">
                    {item.learningPath.map(stage => <div className={`new-task-home__learning-stage is-${stage.state}`} key={stage.id}>
                      <span className="new-task-home__learning-stage-mark" aria-hidden="true">{stage.state === "completed" ? "✓" : stage.state === "current" ? "●" : ""}</span>
                      <strong>{stage.title}</strong><small>{stage.completed}/{stage.total}</small>
                    </div>)}
                  </div>
                  <p className="new-task-home__learning-next">当前阶段：{item.learningProgress.currentStage}。沿路径继续查看图解、课程和练习。</p>
                </> : <>
                  {item.evidence?.length > 0 && <ul className="new-task-home__card-evidence" aria-label="推荐依据">{item.evidence.slice(0, 3).map((evidence) => <li key={evidence.id}><strong>{evidence.title}</strong>{evidence.summary && <span>{evidence.summary}</span>}{evidence.time && <time>{evidence.time}</time>}</li>)}</ul>}
                  {item.condition && <p className="new-task-home__card-condition">适用条件：{item.condition}</p>}
                  {item.steps?.length > 0 && <ul className="new-task-home__card-steps" aria-label="建议步骤">{item.steps.slice(0, 3).map((step, stepIndex) => <li key={`${stepIndex}-${step}`}>{step}</li>)}</ul>}
                </>}
                {!questionTrail && <div className="new-task-home__card-buttons">
                  <button className="new-task-home__card-continue" type="button" onClick={() => openRecommendation(item)}>{item.actionLabel || "查看建议"}</button>
                  {!["project-rules-upload", "continue-task"].includes(item.action?.type) && <button className="new-task-home__card-chat" type="button" onClick={() => onRecommendationChat?.(item)}>先聊聊</button>}
                  <button className="new-task-home__card-snooze" type="button" onClick={() => { snooze(item); setCardExpanded(null); }}>暂不处理</button>
                </div>}
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
                {item.type === "image" ? <IconPhoto size={ICON_SIZE.inline} aria-hidden="true" /> : item.type === "code" ? <IconCode size={ICON_SIZE.inline} aria-hidden="true" /> : <IconPaperclip size={ICON_SIZE.inline} aria-hidden="true" />}
                <span>{item.name}</span>
                <button type="button" aria-label={`移除附件 ${item.name}`} onClick={() => setAttachments((items) => items.filter((attachment) => attachment.id !== item.id))}><IconX size={ICON_SIZE.inline} /></button>
              </span>
            ))}
          </div>
        )}
        {projectRulesIntent && <div className="new-task-home__rules-intent">已选择项目文件学习 <button type="button" onClick={() => setProjectRulesIntent(false)}>取消</button></div>}
        {!projectRulesIntent && attachments.some(file => /^(agents|claude)\.md$/i.test(file.name)) && <button className="new-task-home__rules-suggestion" type="button" onClick={() => { setMode("learning"); setProjectRulesIntent(true); if (!goal.trim()) setGoal("请根据上传的项目规则，整理需要学习的内容。"); }}>根据项目规则生成学习路径 <IconArrowRight size={ICON_SIZE.inline} /></button>}
        {quickMenuOpen && (
          <div className="new-task-home__quick-menu" role="group" aria-label="添加上下文">
            <button type="button" onClick={() => { setQuickMenuOpen(false); fileInputRef.current?.click(); }}><IconPaperclip size={ICON_SIZE.control} />上传文件</button>
            <button type="button" onClick={() => { setQuickMenuOpen(false); onOpenCapabilities?.(); }}><IconBook size={ICON_SIZE.control} />使用能力</button>
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
            <button className="new-task-home__add-button" type="button" aria-label="添加上下文" title="添加上下文" aria-expanded={quickMenuOpen} onClick={() => setQuickMenuOpen((open) => !open)}><IconPlus size={ICON_SIZE.feature} /></button>
          </div>
          <button className="new-task-home__submit" type="submit" disabled={!goal.trim() || (projectRulesIntent && !attachments.length)}>
            <IconSparkles size={ICON_SIZE.heading} aria-hidden="true" />
            <span>{projectRulesIntent ? "生成学习路径" : activeMode.action}</span>
            <IconArrowRight size={ICON_SIZE.navigation} aria-hidden="true" />
          </button>
        </div>
        {error && <p className="new-task-home__error" role="alert">{error}</p>}
        <input ref={fileInputRef} className="new-task-home__file-input" type="file" multiple onChange={(event) => handleInputFiles(event)} aria-label="选择文件" />
      </form>
    </section>
  );
}


export function NewTaskHome(props) {
  const homeViews = ["classic", "combine"];
  const readView = () => {
    const requested = new URLSearchParams(window.location.search).get("home");
    if (requested === "explore") return "combine";
    return homeViews.includes(requested) ? requested : "classic";
  };
  const [view, setView] = useState(readView);
  useEffect(() => {
    const sync = () => setView(readView());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const switchView = (next) => {
    setView(next);
    const url = new URL(window.location.href);
    url.searchParams.set("home", next);
    url.searchParams.delete("task");
    window.history.replaceState(window.history.state, "", url);
  };
  const handleTabKey = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = homeViews.indexOf(view);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? homeViews.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + homeViews.length) % homeViews.length;
    const next = homeViews[nextIndex];
    switchView(next);
    event.currentTarget.querySelector(`#home-tab-${next}`)?.focus();
  };
  return <section className="home-variants" aria-label="新建任务首页">
    <div className="home-variants__tabs" role="tablist" aria-label="首页交互方式" onKeyDown={handleTabKey}>
      {[{ id: "classic", label: "主动建议", Icon: IconCards }, { id: "combine", label: "关联探索", Icon: IconAffiliate }].map(({ id, label, Icon }) => <button key={id} id={`home-tab-${id}`} type="button" role="tab" aria-selected={view === id} aria-controls={`home-panel-${id}`} tabIndex={view === id ? 0 : -1} onClick={() => switchView(id)}><Icon size={ICON_SIZE.inline} />{label}</button>)}
    </div>
    <div className="home-variants__panel" role="tabpanel" id="home-panel-classic" aria-labelledby="home-tab-classic" hidden={view !== "classic"}><ClassicTaskHome {...props} /></div>
    <div className="home-variants__panel" role="tabpanel" id="home-panel-combine" aria-labelledby="home-tab-combine" hidden={view !== "combine"}><CombinationTaskHome onCreateTask={props.onCreateTask} /></div>
  </section>;
}
