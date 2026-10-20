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
  IconX,
} from "@tabler/icons-react";
import "./new-task-home.css";

const modes = [
  { id: "learning", label: "学习", placeholder: "描述你的学习目标、遇到的问题或想掌握的主题…", action: "生成学习路径" },
  { id: "development", label: "开发", placeholder: "描述你要实现的功能、遇到的问题或希望修改的代码…", action: "开始开发任务" },
];

const suggestions = [
  {
    id: "learning",
    title: "继续学习主题",
    description: "基于当前问题，生成个性化的学习路径",
    icon: IconBook,
    motif: IconBook,
    tone: "rose",
  },
  {
    id: "current-issue",
    title: "从当前问题开始",
    description: "基于已有报错或代码，整理下一步线索",
    icon: IconFileText,
    motif: IconBulb,
    tone: "sand",
  },
  {
    id: "materials",
    title: "添加材料",
    description: "上传代码、日志或截图，补充任务上下文",
    icon: IconPaperclip,
    motif: IconPaperclip,
    tone: "blue",
  },
];

const codeFilePattern = /\.(c|cc|cpp|cxx|h|hpp|py|js|jsx|ts|tsx|txt|log|csv|json|md|yaml|yml)$/i;
const createId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function NewTaskHome({ onCreateTask, currentTaskName = "当前任务" }) {
  const [mode, setMode] = useState("learning");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [snippet, setSnippet] = useState("");
  const [snippetOpen, setSnippetOpen] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const homeRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const goalRef = useRef(null);
  const activeMode = modes.find((item) => item.id === mode) || modes[0];

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

  const selectSuggestion = (suggestion) => {
    if (suggestion.id === "materials") {
      fileInputRef.current?.click();
      return;
    }
    const nextMode = suggestion.id === "learning" ? "learning" : "development";
    setMode(nextMode);
    setGoal(suggestion.id === "learning"
      ? `请围绕“${currentTaskName}”梳理值得学习的主题，并给出适合当前基础的学习路径。`
      : `请从“${currentTaskName}”开始，先整理现有问题与线索，再给出下一步检查建议。`);
    setError("");
    requestAnimationFrame(() => goalRef.current?.focus());
  };

  const updatePointer = (event) => {
    if (event.pointerType === "touch" || !homeRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    const root = homeRef.current;
    root.classList.add("has-pointer");
    root.style.setProperty("--pointer-x", `${(x * 100).toFixed(2)}%`);
    root.style.setProperty("--pointer-y", `${(y * 100).toFixed(2)}%`);
    root.style.setProperty("--dot-shift-x", `${((x - 0.5) * 8).toFixed(2)}px`);
    root.style.setProperty("--dot-shift-y", `${((y - 0.5) * 6).toFixed(2)}px`);
  };

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
      ref={homeRef}
      className="new-task-home"
      aria-label="新建任务"
      onPointerMove={updatePointer}
      onPointerLeave={(event) => { if (event.pointerType !== "touch") homeRef.current?.classList.remove("has-pointer"); }}
    >
      <div
        className="new-task-home__dot-field"
        style={{ "--dot-texture": `url("${import.meta.env.BASE_URL}assets/new-task-dot-matrix.png")` }}
        aria-hidden="true"
      />
      <div className="new-task-home__hero">
        <h1>开始一个新任务</h1>
        <div className="new-task-home__mode" role="group" aria-label="任务类型">
          {modes.map((item) => (
            <button
              key={item.id}
              className={"new-task-home__mode-button" + (item.id === mode ? " is-active" : "")}
              type="button"
              aria-pressed={item.id === mode}
              onClick={() => { setMode(item.id); setError(""); }}
            >
              {item.id === "learning" ? <IconBook size={22} stroke={1.8} aria-hidden="true" /> : <IconCode size={22} stroke={1.8} aria-hidden="true" />}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="new-task-home__suggestions" aria-label="任务起点">
        {suggestions.map((item) => {
          const Icon = item.icon;
          const Motif = item.motif;
          return (
            <button
              key={item.id}
              type="button"
              className={`new-task-home__card new-task-home__card--${item.tone}`}
              onClick={() => selectSuggestion(item)}
              aria-label={item.id === "materials" ? "添加材料" : `${item.title}：填入建议内容`}
            >
              <span className="new-task-home__card-band" aria-hidden="true" />
              <span className="new-task-home__card-icon"><Icon size={25} stroke={1.8} aria-hidden="true" /></span>
              <span className="new-task-home__card-copy">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </span>
              <Motif className="new-task-home__card-motif" size={76} stroke={1.2} aria-hidden="true" />
              <span className="new-task-home__card-action" aria-hidden="true"><IconArrowRight size={18} /></span>
            </button>
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
