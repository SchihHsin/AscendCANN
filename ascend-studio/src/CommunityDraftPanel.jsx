import { useState } from "react";
import {
  IconAlertCircle,
  IconCheck,
  IconChevronRight,
  IconCube,
  IconEdit,
  IconFileDescription,
  IconFlask,
  IconInfoCircle,
  IconListDetails,
  IconSend,
  IconX,
} from "@tabler/icons-react";
import "./community-draft.css";

const sections = [
  { id: "problem", label: "1. 问题描述", Icon: IconAlertCircle },
  { id: "approach", label: "2. 尝试与结果", Icon: IconListDetails },
  { id: "environment", label: "3. 环境信息", Icon: IconCube, list: true },
  { id: "verification", label: "4. 验证状态", Icon: IconFlask },
];

function DraftSection({ section, value, editing, onEdit, onChange }) {
  const { Icon } = section;
  return <article className="community-draft-section">
    <header>
      <Icon size={19} aria-hidden="true" />
      <h3>{section.label}</h3>
      <button type="button" className="community-draft-edit" onClick={onEdit} aria-expanded={editing}>
        {editing ? <IconCheck size={14} /> : <IconEdit size={14} />}{editing ? "完成" : "编辑"}
      </button>
    </header>
    <div className="community-draft-section-body">
      {editing
        ? <textarea autoFocus aria-label={`编辑${section.label}`} value={value || ""} onChange={event => onChange(event.target.value)} rows={section.list ? 5 : 4} />
        : section.list
          ? <ul>{String(value || "").split("\n").filter(Boolean).map((line, index) => <li key={`${index}-${line}`}>{line}</li>)}</ul>
          : <p>{value || "尚未补充"}</p>}
    </div>
  </article>;
}

export function CommunityDraftPanel({ draft, onUpdate, onClose, onSubmit }) {
  const [editingSection, setEditingSection] = useState(null);
  const submitted = draft.status === "submitted";
  const updateField = (id, value) => onUpdate({ ...draft, [id]: value });
  const continueEditing = () => {
    setEditingSection("problem");
    document.querySelector(".community-draft-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => document.querySelector('[aria-label="编辑1. 问题描述"]')?.focus());
  };

  return <section className="community-draft-panel" aria-label="社区经验草稿">
    <header className="community-draft-header">
      <div className="community-draft-title">
        <IconFileDescription size={26} aria-hidden="true" />
        <h2>社区经验草稿</h2>
        <span className={`community-draft-status${submitted ? " is-submitted" : ""}`}>
          {submitted ? "已提交 · 演示" : "待你审阅"}
        </span>
      </div>
      <button type="button" className="community-draft-close" onClick={onClose} aria-label="关闭社区经验草稿"><IconX size={17} /></button>
    </header>
    <p className="community-draft-intro">已根据本次任务对话整理内容。请核对描述与结果，补充必要信息后再提交到社区。</p>
    <div className="community-draft-scroll">
      {sections.map(section => <DraftSection
        key={section.id}
        section={section}
        value={draft[section.id]}
        editing={editingSection === section.id}
        onEdit={() => setEditingSection(current => current === section.id ? null : section.id)}
        onChange={value => updateField(section.id, value)}
      />)}
    </div>
    <footer className="community-draft-footer">
      <p><IconInfoCircle size={17} aria-hidden="true" /><span>{submitted ? "此状态为本地交互演示，尚未连接真实社区服务。" : "草稿不会自动公开；提交前可继续编辑并确认内容。"}</span></p>
      <div className="community-draft-actions">
        {!submitted && <button type="button" className="community-draft-continue" onClick={continueEditing}>继续编辑</button>}
        {submitted
          ? <button type="button" className="community-draft-submit is-complete" disabled><IconCheck size={16} />已提交</button>
          : <button type="button" className="community-draft-submit" onClick={() => { setEditingSection(null); onSubmit(); }}><IconSend size={16} />提交到社区</button>}
      </div>
    </footer>
  </section>;
}

export default CommunityDraftPanel;
