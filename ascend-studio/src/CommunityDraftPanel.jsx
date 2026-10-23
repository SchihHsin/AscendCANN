import { useEffect, useRef, useState } from "react";
import {
  IconAlertCircle,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconCube,
  IconEdit,
  IconFileDescription,
  IconFlask,
  IconInfoCircle,
  IconListDetails,
  IconMaximize,
  IconSend,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import "./community-draft.css";
import { ChannelDraftContent } from "./ChannelDraftContent.jsx";
import "./channel-draft.css";
import { CommunityPublishedArticle } from "./CommunityPublishedArticle.jsx";

const sections = [
  { id: "problem", label: "1. 问题描述", Icon: IconAlertCircle },
  { id: "approach", label: "2. 尝试与结果", Icon: IconListDetails },
  { id: "environment", label: "3. 环境信息", Icon: IconCube, list: true },
  { id: "verification", label: "4. 验证状态", Icon: IconFlask },
];

const CHANNELS = [
  { id: "community", name: "昇腾社区", reward: "审核通过后 +20 积分（示例）", rewardShort: "审核后 +20 积分", button: "提交到社区" },
  { id: "gitcode", name: "GitCode", reward: "活动投稿被采纳可获积分（示例 +50）", rewardShort: "采纳后 +50 积分", button: "发布到 GitCode" },
  { id: "csdn", name: "CSDN", reward: "原创内容积分（示例 +10，规则以平台为准）", rewardShort: "+10 积分（示例）", button: "发布到 CSDN" },
  { id: "tiktok", name: "抖音", reward: "按播放表现可能获得创作收益", rewardShort: "播放表现激励", button: "发布到抖音" },
];
const CHANNEL_BY_ID = Object.fromEntries(CHANNELS.map(channel => [channel.id, channel]));

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
  const [selectedChannels, setSelectedChannels] = useState(["community"]);
  const [activeChannel, setActiveChannel] = useState("community");
  const [channelPickerOpen, setChannelPickerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [channelStates, setChannelStates] = useState({
    gitcode: { generated: false, published: false },
    csdn: { generated: false, published: false },
    tiktok: { generated: false, published: false },
  });
  const pickerRef = useRef(null);
  const submitted = draft.status === "submitted";
  const updateField = (id, value) => onUpdate({ ...draft, [id]: value });
  const channelDetails = CHANNEL_BY_ID[activeChannel] || CHANNEL_BY_ID.community;
  const channelState = channelStates[activeChannel] || { generated: false, published: false };
  const generated = activeChannel === "community" || channelState.generated;
  const published = activeChannel === "community" ? false : channelState.published;
  const submittedForReview = activeChannel === "community" ? draft.status === "review" : generated;
  const pickerLabel = channelPickerOpen ? "收起发布渠道" : "查看全部发布渠道";
  const setChannelState = change => setChannelStates(states => ({ ...states, [activeChannel]: { ...(states[activeChannel] || {}), ...change } }));
  const toggleChannel = channelId => {
    if (selectedChannels.includes(channelId)) {
      if (selectedChannels.length === 1) return;
      const next = selectedChannels.filter(id => id !== channelId);
      setSelectedChannels(next);
      if (activeChannel === channelId) setActiveChannel(next[0]);
      return;
    }
    setSelectedChannels([...selectedChannels, channelId]);
  };
  const previewChannel = channelId => {
    setActiveChannel(channelId);
    setChannelPickerOpen(false);
  };
  useEffect(() => {
    if (!channelPickerOpen) return undefined;
    const closeOnOutside = event => { if (!pickerRef.current?.contains(event.target)) setChannelPickerOpen(false); };
    const closeOnEscape = event => {
      if (event.key !== "Escape") return;
      setChannelPickerOpen(false);
      setExpanded(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [channelPickerOpen]);
  useEffect(() => {
    if (channelPickerOpen || !expanded) return undefined;
    const closeOnEscape = event => { if (event.key === "Escape") setExpanded(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [channelPickerOpen, expanded]);
  if (submitted) return <CommunityPublishedArticle draft={draft} />;
  const continueEditing = () => {
    setEditingSection("problem");
    document.querySelector(".community-draft-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => document.querySelector('[aria-label="编辑1. 问题描述"]')?.focus());
  };

  return <section className={`community-draft-panel${expanded ? " is-expanded" : ""}`} aria-label={`${channelDetails.name}发布草稿`} role={expanded ? "dialog" : undefined} aria-modal={expanded ? "true" : undefined}>
    <header className="community-draft-header">
      <div className="community-draft-title">
        <IconFileDescription size={23} aria-hidden="true" />
        <h2>{channelDetails.name}</h2>
        <span className={`community-draft-status${published ? " is-submitted" : ""}`}>
          {published ? "已发布 · 演示" : submittedForReview ? "待你审阅" : "待生成"}
        </span>
      </div>
      <div className="community-channel-picker-anchor" ref={pickerRef}>
        <button type="button" className="community-channel-all" aria-label={pickerLabel} aria-expanded={channelPickerOpen} onClick={() => setChannelPickerOpen(open => !open)}>
          查看全部发布渠道<IconChevronDown size={13} aria-hidden="true" />
        </button>
        {channelPickerOpen && <div className="community-channel-picker" role="dialog" aria-label="选择发布渠道">
          <div className="community-channel-picker-heading">
            <strong>发布到多个渠道</strong>
            <span>默认选择昇腾社区，可同时勾选其他平台</span>
          </div>
          <div className="community-channel-options">
            {CHANNELS.map(channel => {
              const checked = selectedChannels.includes(channel.id);
              return <div className={`community-channel-option${checked ? " is-selected" : ""}${activeChannel === channel.id ? " is-previewing" : ""}`} key={channel.id}>
                <label className="community-channel-option-check">
                  <input type="checkbox" checked={checked} disabled={checked && selectedChannels.length === 1} onChange={() => toggleChannel(channel.id)} />
                  <span className="community-channel-option-copy"><strong>{channel.name}</strong><small>{channel.reward}</small></span>
                </label>
                <button type="button" className="community-channel-option-preview" aria-pressed={activeChannel === channel.id} onClick={() => previewChannel(channel.id)}>{activeChannel === channel.id ? "正在预览" : "预览"}</button>
              </div>;
            })}
          </div>
          <footer className="community-channel-picker-footer">
            <span>已选 {selectedChannels.length} 个渠道</span>
            <button type="button" onClick={() => setChannelPickerOpen(false)}>完成选择</button>
          </footer>
        </div>}
      </div>
      <div className="community-incentive-alert" role="status" aria-label={channelDetails.reward} title={channelDetails.reward}>
        <IconSparkles size={14} aria-hidden="true" /><span>{channelDetails.rewardShort}</span>
      </div>
      <div className="community-draft-header-actions">
        <button type="button" className={`community-draft-zoom${expanded ? " is-active" : ""}`} onClick={() => { setChannelPickerOpen(false); setExpanded(value => !value); }} aria-label={expanded ? "缩小草稿预览" : "放大草稿预览"} title={expanded ? "缩小预览" : "放大预览"}><IconMaximize size={15} /></button>
        <button type="button" className="community-draft-close" onClick={onClose} aria-label="关闭社区经验草稿"><IconX size={17} /></button>
      </div>
    </header>
    {activeChannel === "community" ? <>
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
        <p><IconInfoCircle size={17} aria-hidden="true" /><span>草稿不会自动公开；提交前可继续编辑并确认内容。积分提示为示例，实际以平台规则为准。</span></p>
        <div className="community-draft-actions">
          <button type="button" className="community-draft-continue" onClick={continueEditing}>继续编辑</button>
          <button type="button" className="community-draft-submit" onClick={() => { setEditingSection(null); onSubmit(); }}><IconSend size={16} />提交到社区</button>
        </div>
      </footer>
    </> : <ChannelDraftContent
      channel={activeChannel}
      draft={draft}
      generated={generated}
      published={published}
      onGenerate={() => setChannelState({ generated: true })}
      onPublish={() => setChannelState({ published: true })}
      publishLabel={channelDetails.button}
    />}
  </section>;
}

export default CommunityDraftPanel;
