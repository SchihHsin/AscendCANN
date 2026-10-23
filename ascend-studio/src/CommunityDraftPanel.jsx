import { useState } from "react";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCube,
  IconEdit,
  IconFileDescription,
  IconFlask,
  IconInfoCircle,
  IconListDetails,
  IconMaximize,
  IconRefresh,
  IconSend,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import "./community-draft.css";
import { ChannelDraftContent, getCommunityDraftTopic } from "./ChannelDraftContent.jsx";
import "./channel-draft.css";
import { CommunityPublishedArticle } from "./CommunityPublishedArticle.jsx";
import ascendCommunityMark from "./assets/channel-marks/ascend-community.svg";
import gitcodeMark from "./assets/channel-marks/gitcode.svg";
import csdnMark from "./assets/channel-marks/csdn.svg";
import douyinMark from "./assets/channel-marks/douyin.svg";

const sections = [
  { id: "problem", label: "1. 问题描述", Icon: IconAlertCircle },
  { id: "approach", label: "2. 尝试与结果", Icon: IconListDetails },
  { id: "environment", label: "3. 环境信息", Icon: IconCube, list: true },
  { id: "verification", label: "4. 验证状态", Icon: IconFlask },
];

const CHANNELS = [
  { id: "community", name: "昇腾社区", reward: "审核通过后 +20 积分（示例）", rewardShort: "审核后 +20 积分 · 示例", button: "审阅并提交" },
  { id: "gitcode", name: "GitCode", reward: "活动投稿被采纳可获积分（示例 +50）", rewardShort: "采纳后 +50 积分 · 示例", button: "审阅并发布" },
  { id: "csdn", name: "CSDN", reward: "原创内容积分（示例 +10，规则以平台为准）", rewardShort: "+10 积分（示例）", button: "审阅并发布" },
  { id: "tiktok", name: "抖音", reward: "按播放表现可能获得创作收益", rewardShort: "播放表现激励", button: "预览并发布" },
];
const CHANNEL_BY_ID = Object.fromEntries(CHANNELS.map(channel => [channel.id, channel]));
const CHANNEL_MARKS = {
  community: ascendCommunityMark,
  gitcode: gitcodeMark,
  csdn: csdnMark,
  tiktok: douyinMark,
};
const truncate = (value, max = 96) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

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

function ChannelMark({ channel }) {
  return <span className={`channel-preview-mark channel-preview-mark--${channel.id}`} aria-hidden="true">
    <img src={CHANNEL_MARKS[channel.id]} alt="" />
  </span>;
}

function ChannelCardPreview({ channelId, draft }) {
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常";
  if (channelId === "community") return <div className="channel-preview-community">
    <h3>{topic}经验记录</h3>
    <div><b>问题现象</b><p>{truncate(draft.problem, 82)}</p></div>
    <div><b>排查过程</b><p>{truncate(draft.approach, 82)}</p></div>
    <div className="channel-preview-caution"><span />{isAddCustom ? "尾块边界是待验证线索，尚未确认根因" : "示例形状已核对，真实模型结果仍待补充"}</div>
  </div>;

  if (channelId === "gitcode") return <div className="channel-preview-gitcode">
    <div className="channel-preview-topic"><span>CANN</span><span>custom operator</span></div>
    <h3>{topic}：复现记录与排查线索</h3>
    <div className="channel-preview-step"><i>1</i><div><b>复现现象</b><p>{truncate(draft.problem, 75)}</p></div></div>
    <div className="channel-preview-step"><i>2</i><div><b>待补证据</b><p>{truncate(draft.verification, 75)}</p></div></div>
    <div className="channel-preview-code"><code>复现步骤　·　运行环境　·　验证记录</code></div>
  </div>;

  if (channelId === "csdn") return <div className="channel-preview-csdn">
    <h3>一次{topic}的排查过程</h3>
    <p>{truncate(draft.problem, 100)}</p>
    <ol><li><b>问题现象</b><span>{truncate(draft.problem, 52)}</span></li><li><b>当前排查方向</b><span>{truncate(draft.approach, 52)}</span></li><li><b>验证状态</b><span>{truncate(draft.verification, 52)}</span></li></ol>
  </div>;

  return <div className="channel-preview-tiktok">
    <div className="channel-preview-tiktok-heading"><span>ASCEND C · DEBUG NOTE</span><b>知识图文 · 4 页</b></div>
    <div className="channel-preview-tiktok-panels">
      {[
        ["01", isAddCustom ? "精度异常，\n怎么排？" : "输入形状，\n怎么核对？", "先固定现象"],
        ["02", isAddCustom ? "复现输入\n边界" : "对齐输入\n约定", "记录实际差异"],
        ["03", isAddCustom ? "检查候选\n线索" : "核对转换\n步骤", isAddCustom ? "线索不等于根因" : "示例不等于模型验证"],
        ["04", "补齐证据\n再判断", "验证状态待补"],
      ].map(([number, title, note]) => <div key={number} className={`channel-preview-tiktok-tile channel-preview-tiktok-tile--${number}`}>
        <small>{number}</small><strong>{title.split("\n").map((line, index) => <span key={index}>{line}</span>)}</strong><i /> <em>{note}</em>
      </div>)}
    </div>
  </div>;
}

function ChannelPreviewCard({ channel, draft, state, onOpen }) {
  return <article className={`channel-preview-card channel-preview-card--${channel.id}`}>
    <div className="channel-preview-card-heading">
      <div className="channel-preview-channel-name"><ChannelMark channel={channel} /><strong>{channel.name}</strong></div>
      <span className="channel-preview-format">{channel.id === "community" ? "社区经验帖" : channel.id === "gitcode" ? "Issue / PR" : channel.id === "csdn" ? "技术博客" : "知识图文"}</span>
    </div>
    <div className="channel-preview-card-body"><ChannelCardPreview channelId={channel.id} draft={draft} /></div>
    <div className="channel-preview-card-footer">
      <span className="channel-preview-reward"><IconSparkles size={12} />{channel.rewardShort}</span>
      <button type="button" onClick={onOpen} className={`channel-preview-action${state.published ? " is-published" : ""}`}>
        {state.published ? <><IconCheck size={14} />已发布 · 演示</> : <>{channel.button}<IconArrowRight size={13} /></>}
      </button>
    </div>
  </article>;
}

function MultiChannelOverview({ draft, channelStates, onOpen, regenerated }) {
  return <div className="community-channel-overview">
    <div className="community-channel-overview-actions">
      {regenerated && <span className="community-channel-regenerated" role="status">已重新整理草稿 · 本地演示</span>}
    </div>
    <div className="community-channel-grid">
      {CHANNELS.map(channel => <ChannelPreviewCard
        key={channel.id}
        channel={channel}
        draft={draft}
        state={channelStates[channel.id] || { generated: true, published: false }}
        onOpen={() => onOpen(channel.id)}
      />)}
    </div>
    <p className="community-channel-overview-note"><IconInfoCircle size={14} />同一任务经验按平台语境整理草稿；生成与发布均为本地演示，奖励提示为示例。</p>
  </div>;
}

export function CommunityDraftPanel({ draft, onUpdate, onClose, onSubmit }) {
  const [editingSection, setEditingSection] = useState(null);
  const [view, setView] = useState("community");
  const [expanded, setExpanded] = useState(false);
  const [regenerated, setRegenerated] = useState(false);
  const [channelStates, setChannelStates] = useState({
    community: { generated: true, published: false },
    gitcode: { generated: true, published: false },
    csdn: { generated: true, published: false },
    tiktok: { generated: true, published: false },
  });
  const overview = view === "overview";
  const activeChannel = overview ? "community" : view;
  const channelDetails = CHANNEL_BY_ID[activeChannel] || CHANNEL_BY_ID.community;
  const channelState = channelStates[activeChannel] || { generated: true, published: false };
  const submitted = draft.status === "submitted";
  const submittedForReview = activeChannel === "community" ? draft.status === "review" : channelState.generated;
  const updateField = (id, value) => onUpdate({ ...draft, [id]: value });
  const setChannelState = (channelId, change) => setChannelStates(states => ({ ...states, [channelId]: { ...(states[channelId] || {}), ...change } }));
  const continueEditing = () => {
    setEditingSection("problem");
    document.querySelector(".community-draft-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => document.querySelector('[aria-label="编辑1. 问题描述"]')?.focus());
  };
  const regenerate = () => {
    setRegenerated(true);
    setChannelStates(states => Object.fromEntries(CHANNELS.map(channel => [channel.id, { ...states[channel.id], generated: true }])));
  };

  if (submitted) return <CommunityPublishedArticle draft={draft} />;

  return <section className={`community-draft-panel${expanded ? " is-expanded" : ""}${overview ? " is-channel-overview" : ""}`} aria-label={overview ? "多渠道草稿预览" : `${channelDetails.name}发布草稿`} role={expanded ? "dialog" : undefined} aria-modal={expanded ? "true" : undefined}>
    <header className={`community-draft-header${overview ? " community-draft-header--overview" : ""}`}>
      {overview ? <>
        <div className="community-overview-heading">
          <div className="community-overview-heading-title"><button type="button" className="community-overview-back" onClick={() => setView("community")} aria-label="返回昇腾社区草稿"><IconArrowLeft size={16} /></button><h2>多渠道草稿预览</h2></div>
          <p>同一条任务经验，按平台语境生成不同草稿</p>
        </div>
        <div className="community-draft-header-actions">
          <button type="button" className="community-overview-regenerate" onClick={regenerate}><IconRefresh size={15} />重新生成</button>
          <button type="button" className={`community-draft-zoom${expanded ? " is-active" : ""}`} onClick={() => setExpanded(value => !value)} aria-label={expanded ? "缩小草稿预览" : "放大草稿预览"} title={expanded ? "缩小预览" : "放大预览"}><IconMaximize size={15} /></button>
          <button type="button" className="community-draft-close" onClick={onClose} aria-label="关闭社区经验草稿"><IconX size={17} /></button>
        </div>
      </> : <>
        <div className="community-draft-title">
          <IconFileDescription size={23} aria-hidden="true" />
          <h2>{channelDetails.name}</h2>
          <span className={`community-draft-status${channelState.published ? " is-submitted" : ""}`}>
            {channelState.published ? "已发布 · 演示" : submittedForReview ? "待你审阅" : "待生成"}
          </span>
        </div>
        <button type="button" className="community-channel-all" aria-label="查看全部发布渠道" onClick={() => setView("overview")}><span>查看全部发布渠道</span><IconArrowRight size={13} aria-hidden="true" /></button>
        <div className="community-incentive-alert" role="status" aria-label={channelDetails.reward} title={channelDetails.reward}>
          <IconSparkles size={14} aria-hidden="true" /><span>{channelDetails.rewardShort}</span>
        </div>
        <div className="community-draft-header-actions">
          <button type="button" className={`community-draft-zoom${expanded ? " is-active" : ""}`} onClick={() => setExpanded(value => !value)} aria-label={expanded ? "缩小草稿预览" : "放大草稿预览"} title={expanded ? "缩小预览" : "放大预览"}><IconMaximize size={15} /></button>
          <button type="button" className="community-draft-close" onClick={onClose} aria-label="关闭社区经验草稿"><IconX size={17} /></button>
        </div>
      </>}
    </header>
    {overview ? <MultiChannelOverview
      draft={draft}
      channelStates={channelStates}
      onOpen={channelId => setView(channelId)}
      regenerated={regenerated}
    /> : activeChannel === "community" ? <>
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
      generated={channelState.generated}
      published={channelState.published}
      onGenerate={() => setChannelState(activeChannel, { generated: true })}
      onPublish={() => setChannelState(activeChannel, { published: true })}
      publishLabel={channelDetails.button}
    />}
  </section>;
}

export default CommunityDraftPanel;
