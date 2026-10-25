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
  IconPhotoSearch,
  IconRefresh,
  IconSend,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import "./community-draft.css";
import { ChannelDraftContent, getCommunityDraftTopic } from "./ChannelDraftContent.jsx";
import "./channel-draft.css";
import { PublishedChannelPreview } from "./PublishedChannelPreview.jsx";
import ascendCommunityMark from "./assets/channel-marks/ascend-community.svg";
import gitcodeMark from "./assets/channel-marks/gitcode.svg";
import csdnMark from "./assets/channel-marks/csdn.svg";
import douyinMark from "./assets/channel-marks/douyin.svg";
import tensorCubeIllustration from "./assets/channel-marks/tensor-cubes.png";

const sections = [
  { id: "problem", label: "1. 问题描述", Icon: IconAlertCircle },
  { id: "approach", label: "2. 尝试与结果", Icon: IconListDetails },
  { id: "environment", label: "3. 环境信息", Icon: IconCube, list: true },
  { id: "verification", label: "4. 验证状态", Icon: IconFlask },
];

const CHANNELS = [
  { id: "community", name: "昇腾社区", reward: "审核通过后 +20 积分（以社区规则为准）", rewardShort: "审核后 +20 积分", button: "审阅并提交" },
  { id: "gitcode", name: "GitCode", reward: "投稿被采纳后 +50 积分（以活动规则为准）", rewardShort: "采纳后 +50 积分", button: "审阅并发布" },
  { id: "csdn", name: "CSDN", reward: "原创内容 +10 积分（以平台规则为准）", rewardShort: "+10 积分", button: "审阅并发布" },
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
  const previewLines = isAddCustom
    ? ["input = [17, 33]", "precision mismatch", "custom_op.cpp:128"]
    : ["img = img.transpose(2, 0, 1)", "img = img[None, ...]", "shape = [1, 3, 224, 224]"];
  if (channelId === "community") return <div className="channel-preview-community">
    <div className="channel-preview-community-lead">
      <div>
        <h3>{topic}经验记录与排查思路</h3>
        <p>{truncate(draft.approach, 105)}</p>
      </div>
      <img src={tensorCubeIllustration} alt="" aria-hidden="true" />
    </div>
    <div className="channel-preview-community-section">
      <h4>一、问题现象</h4>
      <p>{truncate(draft.problem, 110)}</p>
      <div className="channel-preview-caution"><span />{isAddCustom ? "尾块边界仍是待验证线索" : "真实模型结果仍待目标环境核对"}</div>
    </div>
  </div>;

  if (channelId === "gitcode") return <div className="channel-preview-gitcode">
    <div className="channel-preview-topic"><span className="channel-preview-state">Open</span><span>CANN</span><span>{isAddCustom ? "custom operator" : "image inference"}</span></div>
    <h3>{topic}：复现记录与排查线索</h3>
    <div className="channel-preview-gitcode-code">
      <div className="channel-preview-code-label"><span>复现记录</span><small>{isAddCustom ? "C++" : "Python"}</small></div>
      <pre><code>{previewLines.join("\n")}</code></pre>
    </div>
    <div className="channel-preview-expectation"><b>排查线索</b><p>{truncate(draft.approach, 110)}</p></div>
    <div className="channel-preview-expectation"><b>验证边界</b><p>{truncate(draft.verification, 110)}</p></div>
  </div>;

  if (channelId === "csdn") return <div className="channel-preview-csdn">
    <h3>一次{topic}的排查过程</h3>
    <p>{truncate(draft.problem, 105)}</p>
    <div className="channel-preview-csdn-layout">
      <div className="channel-preview-csdn-toc">
        <b>文章目录</b>
        <div className="channel-preview-csdn-toc-list" role="list">
          {["问题现象", "输入与目标约定", "排查步骤", "验证记录"].map((label, index) => <div className="channel-preview-csdn-toc-item" role="listitem" key={label}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}</div>)}
        </div>
      </div>
      <div className="channel-preview-csdn-code">
        <div><span>{isAddCustom ? "C++" : "Python"}</span><small>片段预览</small></div>
        <pre><code>{previewLines.join("\n")}</code></pre>
      </div>
    </div>
  </div>;

  return <div className="channel-preview-tiktok">
    <div className="channel-preview-tiktok-heading"><span>抖音 · 知识图文</span><b>4 页预览</b></div>
    <div className="channel-preview-tiktok-panels">
      {[
        { number: "01", type: "cover", kicker: "问题现象", title: isAddCustom ? "AddCustom\n精度异常" : "输入形状\n怎么核对？", note: "先固定异常范围" },
        { number: "02", type: "compare", kicker: "形状对照" },
        { number: "03", type: "flow", kicker: "排查步骤", items: isAddCustom ? ["输入范围", "尾块边界", "误差变化"] : ["换轴顺序", "补 Batch", "核对形状"], note: "线索不等于根因" },
        { number: "04", type: "evidence", kicker: "验证清单", items: isAddCustom ? ["编译版本", "误差标准", "边界样例"] : ["模型约定", "归一化", "真实推理"], note: isAddCustom ? "目标环境待复核" : "真实推理待复核" },
      ].map(slide => <div key={slide.number} className={`channel-preview-tiktok-tile channel-preview-tiktok-tile--${slide.type}`}>
        <div className="channel-preview-tiktok-tile-top"><small>{slide.number}</small><span>{slide.kicker}</span></div>
        {slide.type === "cover" && <div className="channel-preview-tiktok-cover-content">
          <strong>{slide.title}</strong><span>{isAddCustom ? "先定位误差范围" : "从现象开始排查"}</span><span className="channel-preview-tiktok-cover-mark" aria-hidden="true"><IconPhotoSearch size={20} stroke={1.7} /></span>
        </div>}
        {slide.type === "compare" && <div className="channel-preview-tiktok-compare-content">
          <div className="channel-preview-tiktok-shape-row">
            <span>{isAddCustom ? "参考" : "输入"}</span><strong>{isAddCustom ? "[16, 32]" : "NHWC"}</strong><small>{isAddCustom ? "逐元素核对" : "224×224×3"}</small><em className="is-recorded">{isAddCustom ? "通过" : "已记录"}</em>
          </div>
          <span className="channel-preview-tiktok-shape-arrow" aria-hidden="true">↓</span>
          <div className="channel-preview-tiktok-shape-row is-target">
            <span>{isAddCustom ? "异常" : "目标"}</span><strong>{isAddCustom ? "[17, 33]" : "NCHW"}</strong><small>{isAddCustom ? "尾块边界" : "1×3×224×224"}</small><em className={isAddCustom ? "is-fail" : "is-review"}>{isAddCustom ? "异常" : "待核对"}</em>
          </div>
        </div>}
        {slide.type === "flow" && <div className="channel-preview-tiktok-flow-content">
          <ol>{slide.items.map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol>
          <span>{slide.note}</span>
        </div>}
        {slide.type === "evidence" && <div className="channel-preview-tiktok-evidence-content">
          <ul>{slide.items.map(item => <li key={item}>{item}</li>)}</ul>
          <span>{slide.note}</span>
        </div>}
      </div>)}
    </div>
  </div>;
}

function ChannelPreviewCard({ channel, draft, state, selected, onToggle, onOpen }) {
  const published = Boolean(state.published);
  return <article
    className={`channel-preview-card channel-preview-card--${channel.id}${selected && !published ? " is-selected" : ""}${published ? " is-published" : ""}`}
    aria-label={`${channel.name}${published ? "，已发布" : "，可选择发布"}`}
    onClick={published ? undefined : onToggle}
  >
    <div className="channel-preview-card-heading">
      <div className="channel-preview-channel-name"><ChannelMark channel={channel} /><strong>{channel.name}</strong></div>
      <div className="channel-preview-card-tools">
        <span className="channel-preview-format">{channel.id === "community" ? "社区经验帖" : channel.id === "gitcode" ? "Issue / PR" : channel.id === "csdn" ? "技术博客" : "知识图文"}</span>
        {published
          ? <span className="channel-preview-locked-status"><IconCheck size={10} aria-hidden="true" />已发布</span>
          : <button
            type="button"
            className={`channel-preview-select${selected ? " is-selected" : ""}`}
            onClick={event => { event.stopPropagation(); onToggle(); }}
            aria-label={`${selected ? "取消选择" : "选择"}${channel.name}`}
            aria-pressed={selected}
          >
            {selected && <IconCheck size={12} stroke={2.5} aria-hidden="true" />}
          </button>}
      </div>
    </div>
    <div className="channel-preview-card-body"><ChannelCardPreview channelId={channel.id} draft={draft} /></div>
    <div className="channel-preview-card-footer">
      <span className="channel-preview-reward"><IconSparkles size={12} />{channel.rewardShort}</span>
      <div className="channel-preview-card-footer-actions">
        <button type="button" onClick={event => { event.stopPropagation(); onOpen(); }} className="channel-preview-action">
          {state.published ? "查看发布效果" : "查看详情"}<IconArrowRight size={13} />
        </button>
      </div>
    </div>
  </article>;
}

function MultiChannelOverview({ draft, channelStates, selectedChannels, onToggleChannel, onOpen, onPublishSelected, onViewPublished, regenerated }) {
  const pendingChannels = selectedChannels.filter(id => !channelStates[id]?.published);
  const hasPublished = Object.values(channelStates).some(state => state.published);
  const showPublishedPreview = pendingChannels.length === 0 && hasPublished;
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
        selected={!channelStates[channel.id]?.published && selectedChannels.includes(channel.id)}
        onToggle={() => onToggleChannel(channel.id)}
        onOpen={() => onOpen(channel.id)}
      />)}
    </div>
    <div className="community-channel-overview-footer">
      <p className="community-channel-overview-note"><IconInfoCircle size={14} />已选 {pendingChannels.length} 个待发布渠道；发布为本地演示，奖励规则以平台为准。</p>
      <button type="button" className="community-channel-publish-selected" onClick={showPublishedPreview ? onViewPublished : onPublishSelected} disabled={pendingChannels.length === 0 && !hasPublished}>
        {showPublishedPreview
          ? <><IconArrowRight size={14} />查看发布后预览</>
          : <><IconSend size={14} />{pendingChannels.length > 1 ? `批量发布（${pendingChannels.length}）` : pendingChannels.length === 1 ? "发布到选中渠道（1）" : "选择发布渠道"}</>}
      </button>
    </div>
  </div>;
}

export function CommunityDraftPanel({ draft, onUpdate, onClose, onSubmit }) {
  const [editingSection, setEditingSection] = useState(null);
  const [view, setView] = useState(() => draft.status === "submitted" ? "published" : "community");
  const [overviewVisited, setOverviewVisited] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [regenerated, setRegenerated] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(() => draft.status === "submitted" ? [] : ["community"]);
  const [channelStates, setChannelStates] = useState(() => ({
    community: { generated: true, published: draft.status === "submitted" },
    gitcode: { generated: true, published: false },
    csdn: { generated: true, published: false },
    tiktok: { generated: true, published: false },
  }));
  const [publishedChannelIds, setPublishedChannelIds] = useState(() => draft.status === "submitted" ? ["community"] : []);
  const [publishedActiveChannel, setPublishedActiveChannel] = useState("community");
  const overview = view === "overview";
  const publishedPreview = view === "published";
  const activeChannel = publishedPreview ? publishedActiveChannel : overview ? "community" : view;
  const channelDetails = CHANNEL_BY_ID[activeChannel] || CHANNEL_BY_ID.community;
  const channelState = channelStates[activeChannel] || { generated: true, published: false };
  const submitted = draft.status === "submitted";
  const overviewChannelStates = submitted
    ? { ...channelStates, community: { ...channelStates.community, generated: true, published: true } }
    : channelStates;
  const submittedForReview = activeChannel === "community" ? draft.status === "review" : channelState.generated;
  const updateField = (id, value) => onUpdate({ ...draft, [id]: value });
  const setChannelState = (channelId, change) => setChannelStates(states => ({ ...states, [channelId]: { ...(states[channelId] || {}), ...change } }));
  const toggleSelectedChannel = channelId => {
    if (channelStates[channelId]?.published || (channelId === "community" && submitted)) return;
    setSelectedChannels(selected => selected.includes(channelId)
      ? selected.filter(id => id !== channelId)
      : [...selected, channelId]);
  };
  const showPublishedPreviews = channelIds => {
    const ids = [...new Set(channelIds)].filter(id => CHANNEL_BY_ID[id]);
    if (!ids.length) return;
    setPublishedChannelIds(ids);
    setPublishedActiveChannel(ids[0]);
    setView("published");
  };
  const openSelectedPublishedPreviews = () => {
    const latestPublished = publishedChannelIds.filter(id => channelStates[id]?.published || (id === "community" && submitted));
    const selectedPublished = selectedChannels.filter(id => channelStates[id]?.published || (id === "community" && submitted));
    showPublishedPreviews(latestPublished.length ? latestPublished : selectedPublished);
  };
  const showChannelOverview = () => {
    setOverviewVisited(true);
    setView("overview");
  };
  const publishChannel = channelId => {
    setChannelState(channelId, { generated: true, published: true });
    setSelectedChannels(selected => selected.filter(id => id !== channelId));
    setEditingSection(null);
    if (channelId === "community") onSubmit();
    showPublishedPreviews([channelId]);
  };
  const publishSelectedChannels = () => {
    const pendingChannels = selectedChannels.filter(id => !channelStates[id]?.published);
    if (!pendingChannels.length) return;
    setChannelStates(states => pendingChannels.reduce((next, id) => ({
      ...next,
      [id]: { ...(states[id] || {}), generated: true, published: true },
    }), { ...states }));
    setSelectedChannels(selected => selected.filter(id => !pendingChannels.includes(id)));
    if (pendingChannels.includes("community")) {
      onSubmit();
    }
    const batchChannels = pendingChannels;
    setPublishedChannelIds(batchChannels);
    setPublishedActiveChannel(pendingChannels[0] || batchChannels[0]);
    setView("published");
  };
  const openChannel = channelId => {
    setOverviewVisited(true);
    if (channelStates[channelId]?.published || (channelId === "community" && submitted)) {
      const publishedGroup = publishedChannelIds.filter(id => channelStates[id]?.published || (id === "community" && submitted));
      const channelsToShow = publishedGroup.includes(channelId) ? publishedGroup : [channelId];
      setPublishedChannelIds(channelsToShow);
      setPublishedActiveChannel(channelId);
      setView("published");
    } else {
      setView(channelId);
    }
  };
  const continueEditing = () => {
    setEditingSection("problem");
    document.querySelector(".community-draft-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => document.querySelector('[aria-label="编辑1. 问题描述"]')?.focus());
  };
  const regenerate = () => {
    setRegenerated(true);
    setChannelStates(states => Object.fromEntries(CHANNELS.map(channel => [channel.id, { ...states[channel.id], generated: true }])));
  };

  if (publishedPreview) return <section className={`community-draft-panel${expanded ? " is-expanded" : ""}`} aria-label="发布后内容预览" role={expanded ? "dialog" : undefined} aria-modal={expanded ? "true" : undefined}>
    <PublishedChannelPreview
      draft={draft}
      channelIds={publishedChannelIds.filter(id => channelStates[id]?.published || (id === "community" && submitted))}
      activeChannel={activeChannel}
      onSelect={setPublishedActiveChannel}
      onBack={showChannelOverview}
      expanded={expanded}
      onToggleExpanded={() => setExpanded(value => !value)}
      onClose={onClose}
    />
  </section>;

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
          <span className={`community-draft-status${channelState.published ? " is-submitted" : submittedForReview ? " is-review" : ""}`}>
            {channelState.published ? "已发布 · 演示" : submittedForReview ? "待你审阅" : "待生成"}
          </span>
        </div>
        <div className="community-incentive-alert" role="status" aria-label={channelDetails.reward} title={channelDetails.reward}>
          <IconSparkles size={14} aria-hidden="true" />
          <span>{channelDetails.rewardShort}</span>
        </div>
        <button type="button" className="community-channel-back" aria-label={overviewVisited ? "返回渠道总览" : "查看全部发布渠道"} title={overviewVisited ? "返回渠道总览" : "查看全部发布渠道"} onClick={showChannelOverview}>{overviewVisited ? <IconArrowLeft size={14} aria-hidden="true" /> : <IconArrowRight size={14} aria-hidden="true" />}<span>{overviewVisited ? "返回渠道总览" : "查看全部发布渠道"}</span></button>
        <div className="community-draft-header-actions">
          <button type="button" className={`community-draft-zoom${expanded ? " is-active" : ""}`} onClick={() => setExpanded(value => !value)} aria-label={expanded ? "缩小草稿预览" : "放大草稿预览"} title={expanded ? "缩小预览" : "放大预览"}><IconMaximize size={15} /></button>
          <button type="button" className="community-draft-close" onClick={onClose} aria-label="关闭社区经验草稿"><IconX size={17} /></button>
        </div>
      </>}
    </header>
    {overview ? <MultiChannelOverview
      draft={draft}
      channelStates={overviewChannelStates}
      selectedChannels={selectedChannels}
      onToggleChannel={toggleSelectedChannel}
      onOpen={openChannel}
      onPublishSelected={publishSelectedChannels}
      onViewPublished={openSelectedPublishedPreviews}
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
        <p><IconInfoCircle size={17} aria-hidden="true" /><span>草稿不会自动公开；提交前可继续编辑并确认内容。奖励规则以对应平台为准。</span></p>
        <div className="community-draft-actions">
          <button type="button" className="community-draft-continue" onClick={continueEditing}>继续编辑</button>
          <button type="button" className="community-draft-submit" onClick={() => publishChannel("community")}><IconSend size={16} />提交到社区</button>
        </div>
      </footer>
    </> : <ChannelDraftContent
      channel={activeChannel}
      draft={draft}
      generated={channelState.generated}
      published={channelState.published}
      onGenerate={() => setChannelState(activeChannel, { generated: true })}
      onPublish={() => publishChannel(activeChannel)}
      publishLabel={channelDetails.button}
    />}
  </section>;
}

export default CommunityDraftPanel;
