import { ICON_SIZE } from "./icon-system.js";
import {
  IconArrowLeft,
  IconCheck,
  IconChevronRight,
  IconExternalLink,
  IconEye,
  IconGitBranch,
  IconMaximize,
  IconMessageCircle,
  IconThumbUp,
  IconX,
} from "@tabler/icons-react";
import { getCommunityDraftTopic, TikTokPublishedPost } from "./ChannelDraftContent.jsx";
import { CommunityPublishedArticle } from "./CommunityPublishedArticle.jsx";
import ascendCommunityMark from "./assets/channel-marks/ascend-community.svg";
import gitcodeMark from "./assets/channel-marks/gitcode.svg";
import csdnMark from "./assets/channel-marks/csdn.svg";
import douyinMark from "./assets/channel-marks/douyin.svg";
import "./channel-published.css";

const CHANNEL_INFO = {
  community: { name: "昇腾社区", mark: ascendCommunityMark, url: "https://www.hiascend.com/developer/techArticles" },
  gitcode: { name: "GitCode", mark: gitcodeMark, url: "https://gitcode.com/cann/cann" },
  csdn: { name: "CSDN", mark: csdnMark, url: "https://blog.csdn.net/" },
  tiktok: { name: "抖音", mark: douyinMark, url: "https://www.douyin.com/" },
};

function ChannelMark({ channel }) {
  const info = CHANNEL_INFO[channel];
  return <span className={`published-channel-mark published-channel-mark--${channel}`} aria-hidden="true"><img src={info.mark} alt="" /></span>;
}

function publishedDate(timestamp) {
  const date = timestamp ? new Date(timestamp) : new Date();
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })
    .format(date).replaceAll("-", "/");
}

function GitCodePublishedPage({ draft }) {
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常";
  return <div className="gitcode-published-site">
    <header className="gitcode-published-nav"><div className="gitcode-published-brand"><ChannelMark channel="gitcode" /><strong>GitCode</strong></div><nav><span>发现</span><span>开源项目</span><span>企业服务</span><span>学习</span></nav><div className="gitcode-published-user">个人中心</div></header>
    <div className="gitcode-published-layout">
      <main>
        <div className="gitcode-published-breadcrumb"><span>cann</span><IconChevronRight size={ICON_SIZE.inline} /><span>问题反馈</span><IconChevronRight size={ICON_SIZE.inline} /><b>发布内容</b></div>
        <article className="gitcode-published-issue">
          <div className="gitcode-published-labels"><span className="gitcode-open-label"><IconMessageCircle size={ICON_SIZE.micro} />开放讨论</span><span>精度问题</span><span>CANN</span></div>
          <h1>{topic}：复现记录与排查线索</h1>
          <div className="gitcode-published-meta"><span className="gitcode-published-avatar">昇</span><b>昇腾开发笔记</b><span>发布于 {publishedDate(draft.submittedAt)}</span><span>面向社区讨论</span></div>
          <div className="gitcode-published-rule" />
          <section className="gitcode-published-prose">
            <h2>问题现象</h2><p>{draft.problem || "本次开发任务中的问题现象记录。"}</p>
            <h2>复现与观察</h2><p>{draft.approach || "尚无排查过程记录。"}</p>
            <div className="gitcode-published-code"><span>复现信息</span><code>{isAddCustom ? "输入组合 · 报错位置 · 逐元素误差" : "输入条件 · 运行步骤 · 预期结果"}</code><code>{String(draft.environment || "运行环境待补").split("\n").filter(Boolean).join("\n")}</code></div>
            <h2>待补证据</h2><p>{draft.verification || "仍需补充验证记录。"}</p>
            <div className="gitcode-published-caution">{isAddCustom ? "尾块边界目前只是待验证线索，尚未确认根因。" : "当前示例结果不能替代真实模型或设备验证。"}</div>
          </section>
          <footer className="gitcode-published-issue-footer"><span><IconThumbUp size={ICON_SIZE.control} />点赞</span><span><IconMessageCircle size={ICON_SIZE.control} />参与讨论</span><span><IconGitBranch size={ICON_SIZE.control} />关联项目</span></footer>
        </article>
      </main>
      <aside className="gitcode-published-sidebar"><h2>问题信息</h2><div><span>类型</span><b>Issue</b></div><div><span>可见范围</span><b>公开讨论</b></div><div><span>标签</span><b>精度问题</b></div><div><span>环境</span><small>{String(draft.environment || "待补充").split("\n").filter(Boolean).join(" · ")}</small></div><p>社区协作可继续补充复现条件与验证证据。</p></aside>
    </div>
  </div>;
}

function CSDNPublishedPage({ draft }) {
  const topic = getCommunityDraftTopic(draft);
  const isAddCustom = topic === "AddCustom 精度异常";
  return <div className="csdn-published-site">
    <header className="csdn-published-nav"><div className="csdn-published-brand"><ChannelMark channel="csdn" /><strong>CSDN</strong><span>· 技术博客</span></div><nav><span>首页</span><span>博客</span><span>下载</span><span>学习</span><span>问答</span></nav><span className="csdn-published-search">搜索技术内容</span><button type="button">创作中心</button></header>
    <div className="csdn-published-layout">
      <main className="csdn-published-article">
        <div className="csdn-published-kicker">昇腾开发 · 技术博客</div>
        <h1>{topic}排查：从现象到证据核对</h1>
        <div className="csdn-published-meta"><b>昇腾开发笔记</b><span>{publishedDate(draft.submittedAt)}</span><span><IconEye size={ICON_SIZE.inline} />文章预览</span><span>原创内容</span></div>
        <div className="csdn-published-tags"><span>{isAddCustom ? "算子开发" : "图像推理"}</span><span>CANN</span><span>问题排查</span></div>
        <div className="csdn-published-prose">
          <p className="csdn-published-lead">记录已观察到的现象、检查顺序，以及还需要哪些证据。以下内容来自本次开发任务整理。</p>
          <h2>一、问题现象</h2><p>{draft.problem || "本次开发任务中的问题现象记录。"}</p>
          <h2>二、当前排查方向</h2><p>{draft.approach || "尚无排查过程记录。"}</p>
          <div className="csdn-published-note">{isAddCustom ? "尾块边界只是待验证线索，尚未确认根因。" : "示例形状核对不代表真实模型或 NPU 验证。"}</div>
          <h2>三、运行环境</h2><ul>{String(draft.environment || "环境信息待补充").split("\n").filter(Boolean).map((line, index) => <li key={`${index}-${line}`}>{line}</li>)}</ul>
          <h2>四、验证说明</h2><p>{draft.verification || "仍需补充实际验证记录。"}</p>
        </div>
        <footer className="csdn-published-reactions"><span>👍 点赞</span><span>⭐ 收藏</span><span>💬 评论</span><span>↗ 分享</span></footer>
      </main>
      <aside className="csdn-published-toc"><b>目录</b><span>一、问题现象</span><span>二、当前排查方向</span><span>三、运行环境</span><span>四、验证说明</span><small>文章内容预览</small></aside>
    </div>
  </div>;
}

function DouyinPublishedPage({ draft }) {
  return <div className="douyin-published-site">
    <header className="douyin-published-nav"><div className="douyin-published-logo"><ChannelMark channel="tiktok" /><strong>抖音</strong></div><nav><span>推荐</span><span>关注</span><span>知识</span><span>直播</span></nav><span className="douyin-published-search">搜索视频、用户</span><span className="douyin-published-nav-user">登录</span></header>
    <div className="douyin-published-feed"><div className="douyin-published-feed-label"><span>图文笔记</span><span>发布预览</span></div><TikTokPublishedPost draft={draft} /><p className="douyin-published-boundary">展示为知识图文内容；互动量与实际发布数据未生成。</p></div>
  </div>;
}

export function PublishedChannelPreview({ draft, channelIds, activeChannel, onSelect, onBack, expanded, onToggleExpanded, onClose }) {
  const current = CHANNEL_INFO[activeChannel] || CHANNEL_INFO.community;
  const channels = channelIds.length ? channelIds : [activeChannel];
  return <section className="channel-published-preview" aria-label={`${current.name}发布后预览`}>
    <header className="channel-published-toolbar">
      <button type="button" className="channel-published-back" onClick={onBack}><IconArrowLeft size={ICON_SIZE.inline} />返回渠道总览</button>
      {channels.length > 1 ? <nav className="channel-published-tabs" role="tablist" aria-label="本次发布渠道">
        {channels.map(channelId => <button key={channelId} type="button" role="tab" aria-selected={channelId === activeChannel} className={channelId === activeChannel ? "is-active" : ""} onClick={() => onSelect(channelId)}>
          <ChannelMark channel={channelId} /><span>{CHANNEL_INFO[channelId].name}</span><IconCheck size={ICON_SIZE.micro} />
        </button>)}
      </nav> : <div className="channel-published-current"><ChannelMark channel={activeChannel} /><strong>{current.name}</strong><span><i />已发布 · 本地预览</span></div>}
      <a className="channel-published-external" href={current.url} target="_blank" rel="noopener noreferrer">打开平台<IconExternalLink size={ICON_SIZE.inline} /></a>
      <div className="channel-published-window-actions">
        <button type="button" className={`channel-published-window-button${expanded ? " is-active" : ""}`} onClick={onToggleExpanded} aria-label={expanded ? "缩小发布预览" : "放大发布预览"} title={expanded ? "缩小预览" : "放大预览"}><IconMaximize size={ICON_SIZE.inline} /></button>
        <button type="button" className="channel-published-window-button" onClick={onClose} aria-label="关闭发布预览" title="关闭"><IconX size={ICON_SIZE.control} /></button>
      </div>
    </header>
    {channels.length > 1 && <div className="channel-published-batch-note">已完成本地发布演示 · 本次发布到 {channels.length} 个渠道 · 选择渠道可切换预览</div>}
    <div className={`channel-published-body channel-published-body--${activeChannel}`}>
      {activeChannel === "community" ? <CommunityPublishedArticle draft={draft} embedded />
        : activeChannel === "gitcode" ? <GitCodePublishedPage draft={draft} />
          : activeChannel === "csdn" ? <CSDNPublishedPage draft={draft} />
            : <DouyinPublishedPage draft={draft} />}
    </div>
  </section>;
}

export default PublishedChannelPreview;
