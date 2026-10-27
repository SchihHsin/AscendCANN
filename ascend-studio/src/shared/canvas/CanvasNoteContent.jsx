import { IconCode, IconPlus, IconTrash } from "@tabler/icons-react";

const LANGUAGES = [
  ["python", "Python"],
  ["cpp", "C / C++"],
  ["c", "C"],
  ["shell", "Shell"],
  ["javascript", "JavaScript"],
  ["text", "纯文本"],
];

function createCodeBlock() {
  return {
    id: `code:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 7)}`,
    language: "python",
    code: "",
  };
}

export default function CanvasNoteContent({ card, editing, onUpdate }) {
  const codeBlocks = Array.isArray(card.codeBlocks) ? card.codeBlocks.filter(block => block && typeof block === "object") : [];
  const updateBlocks = nextBlocks => onUpdate?.({ codeBlocks: nextBlocks });
  const updateBlock = (id, patch) => updateBlocks(codeBlocks.map((block, index) => (block.id || `legacy-${index}`) === id ? { ...block, ...patch } : block));

  return <div className={`canvas-note-content${codeBlocks.length ? " has-code" : " is-empty"}`}>
    <textarea
      className="canvas-note-text"
      aria-label={`${card.title}文字内容`}
      placeholder="记下想补充的内容…"
      value={card.noteText || ""}
      readOnly={!editing}
      onChange={event => onUpdate?.({ noteText: event.target.value })}
    />
    {codeBlocks.map((block, index) => {
      const id = block.id || `legacy-${index}`;
      return <section className="canvas-note-code-block" key={id} aria-label={`代码块 ${index + 1}`}>
        <header className="canvas-note-code-header">
          <IconCode size={14} aria-hidden="true" />
          {editing
            ? <select aria-label={`代码块 ${index + 1}语言`} value={block.language || "python"} onChange={event => updateBlock(id, { language: event.target.value })}>
              {LANGUAGES.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
            : <span>{LANGUAGES.find(([value]) => value === block.language)?.[1] || block.language || "代码"}</span>}
          {editing && <button type="button" className="canvas-note-code-remove" aria-label={`删除代码块 ${index + 1}`} title="删除代码块" onClick={() => updateBlocks(codeBlocks.filter((_, blockIndex) => blockIndex !== index))}><IconTrash size={13} /></button>}
        </header>
        {editing
          ? <textarea className="canvas-note-code-editor" aria-label={`代码块 ${index + 1}内容`} placeholder="在这里输入或粘贴代码…" spellCheck="false" value={block.code || ""} onChange={event => updateBlock(id, { code: event.target.value })} />
          : <pre className="canvas-note-code-preview"><code>{block.code || " "}</code></pre>}
      </section>;
    })}
    {editing && <button type="button" className="canvas-note-insert-code" onClick={() => updateBlocks([...codeBlocks, createCodeBlock()])}><IconPlus size={14} /><IconCode size={14} />插入代码块</button>}
  </div>;
}
