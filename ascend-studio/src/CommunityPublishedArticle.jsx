import { IconArrowLeft, IconChevronRight, IconExternalLink, IconEye, IconThumbUp } from "@tabler/icons-react";
import "./community-published.css";

const COMMUNITY_ARTICLES_URL = "https://www.hiascend.com/developer/techArticles";

function publishedDate(timestamp) {
  const date = timestamp ? new Date(timestamp) : new Date();
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date).replaceAll("-", "/");
}

export function CommunityPublishedArticle({ draft, onBack }) {
  const environment = String(draft.environment || "").split("\n").filter(Boolean);

  return <section className="community-published-panel" aria-label="昇腾社区文章发布后预览">
    <div className="community-published-demo-bar">
      {onBack && <button type="button" className="community-published-back" onClick={onBack}><IconArrowLeft size={13} aria-hidden="true" />多渠道预览</button>}
      <span className="community-published-demo-status"><i aria-hidden="true" />已提交 · 本地预览</span>
      <span className="community-published-demo-copy">页面样式参照昇腾社区官方技术文章</span>
      <a href={COMMUNITY_ARTICLES_URL} target="_blank" rel="noopener noreferrer">
        打开社区<IconExternalLink size={14} aria-hidden="true" />
      </a>
    </div>

    <div className="community-published-scroll">
      <div className="community-site-header">
        <div className="community-site-kicker">昇腾社区首页</div>
        <div className="community-site-nav">
          <a className="community-site-brand" href={COMMUNITY_ARTICLES_URL} target="_blank" rel="noopener noreferrer" aria-label="打开昇腾社区">
            <img src={`${import.meta.env.BASE_URL}assets/ascend-logo.svg`} alt="Ascend" />
          </a>
          <span className="community-site-section">开发者</span>
          <nav aria-label="昇腾社区导航">
            <span>开发</span><span>文档</span><span>学习</span><span>论坛</span><span className="is-current">博客</span>
          </nav>
          <span className="community-site-search" aria-label="搜索">⌕</span>
          <span className="community-site-support">支持</span>
        </div>
      </div>

      <div className="community-article-content">
        <div className="community-article-breadcrumb">
          <a href={COMMUNITY_ARTICLES_URL} target="_blank" rel="noopener noreferrer">官方技术文章</a>
          <IconChevronRight size={13} aria-hidden="true" />
          <span>图像推理输入布局排查</span>
        </div>

        <article className="community-article-card">
          <header className="community-article-heading">
            <h1>图像推理输入布局排查：从 HWC 到 NCHW</h1>
            <span className="community-article-tag">图像推理</span>
            <div className="community-article-meta">
              <span>发表于：{publishedDate(draft.submittedAt)}</span>
              <span className="community-article-stat"><IconEye size={15} aria-hidden="true" />0</span>
              <span className="community-article-stat"><IconThumbUp size={14} aria-hidden="true" />0</span>
            </div>
          </header>

          <div className="community-article-body">
            <section>
              <h2>问题描述：</h2>
              <p>{draft.problem || "本次开发任务中遇到输入布局差异，以下整理了问题背景与排查记录。"}</p>
            </section>
            <section>
              <h2>解决方案：</h2>
              <p>{draft.approach || "暂无处理过程。"}</p>
            </section>
            <section>
              <h2>环境信息：</h2>
              <ul>{environment.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>
            </section>
            <section>
              <h2>验证说明：</h2>
              <p>{draft.verification || "暂无验证说明。"}</p>
            </section>
          </div>
        </article>

        <div className="community-article-address">
          <span>社区地址</span>
          <a href={COMMUNITY_ARTICLES_URL} target="_blank" rel="noopener noreferrer">
            www.hiascend.com/developer/techArticles<IconExternalLink size={13} aria-hidden="true" />
          </a>
          <small>当前 Demo 未连接社区发布服务；链接打开昇腾社区官方技术文章频道。</small>
        </div>
      </div>
    </div>
  </section>;
}

export default CommunityPublishedArticle;
