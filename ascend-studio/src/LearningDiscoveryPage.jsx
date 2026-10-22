import { useMemo, useState } from "react";
import { IconArrowRight, IconCircleCheck, IconSearch, IconSparkles } from "@tabler/icons-react";
import { LEARNING_TASK } from "./learning-data";
import { OFFICIAL_LEARNING_PATH_URL, OFFICIAL_LEARNING_SOURCES, OFFICIAL_LEARNING_TASK } from "./official-learning-data";
import "./learning-discovery.css";

const tabs = [
  { id: "recommended", label: "为你推荐", count: 4 },
  { id: "new", label: "新上架", count: 4 },
  { id: "calendar", label: "日程", count: 3 },
];

const recommendations = [
  {
    type: "课程",
    title: "ResNet50 C&C++ 应用课程",
    description: "沿着图像输入、模型执行到结果解读，梳理一次完整的推理流程。",
    reason: "与你正在探索的图像推理主题相关",
    meta: "官方课程 · 约 50 分钟",
    destination: { taskName: OFFICIAL_LEARNING_TASK, materialId: "learning-official-stage-chain" },
    action: "继续学习",
  },
  {
    type: "学习路径",
    title: "图像输入预处理学习路径",
    description: "从 RGB 与维度理解开始，逐步完成跟练、输入检查和学习记录。",
    reason: "延续 HWC、CHW 与 batch 的学习目标",
    meta: "4 个学习节点 · 约 30 分钟",
    destination: { taskName: LEARNING_TASK, materialId: "learning-path" },
    action: "查看学习路径",
  },
  {
    type: "知识点",
    title: "HWC → CHW：看懂图像通道轴",
    description: "用一张图像理解 H、W、C 的含义，以及通道轴为什么会移动。",
    reason: "这是图像数据进入模型前的关键概念",
    meta: "概念讲解 · 约 8 分钟",
    destination: { taskName: LEARNING_TASK, materialId: "learning-lesson", anchor: "layout" },
    action: "打开知识点",
  },
  {
    type: "学习任务",
    title: "核对模型输入约定",
    description: "把数据类型、布局和尺寸作为检查项，对照所选样例逐项确认。",
    reason: "把已学概念带到输入准备环节",
    meta: "输入准备 · 约 18 分钟",
    destination: { taskName: OFFICIAL_LEARNING_TASK, materialId: "learning-official-stage-input" },
    action: "开始下一步",
  },
];

const newItems = [
  {
    type: "课程",
    title: OFFICIAL_LEARNING_SOURCES.quickstart.title,
    description: "从官方快速入门课程了解 AscendCL 的基础概念与应用流程。",
    meta: "官方课程入口",
    action: "打开官方课程",
    href: OFFICIAL_LEARNING_SOURCES.quickstart.url,
  },
  {
    type: "路径",
    title: "昇腾开发者成长路径",
    description: "按学习阶段浏览昇腾开发者成长资源与课程入口。",
    meta: "官方学习路径",
    action: "浏览成长路径",
    href: OFFICIAL_LEARNING_PATH_URL,
  },
  {
    type: "认证",
    title: "开发者认证备考专题",
    description: "汇总认证方向、能力主题与学习准备清单，方便规划下一步。",
    meta: "专题示例 · 可关注",
    action: "关注专题",
    followId: "certification",
  },
  {
    type: "知识点",
    title: "图像预处理：核对模型输入约定",
    description: "从模型签名和官方样例出发，逐项记录输入数据类型、布局与尺寸。",
    meta: "学习内容 · 输入准备",
    action: "打开知识点",
    destination: { taskName: OFFICIAL_LEARNING_TASK, materialId: "learning-official-stage-input" },
  },
];

const events = [
  { id: "meetup-inference", month: "11月", day: "05", weekday: "周四", time: "19:30", kind: "Meetup", title: "昇腾开发者 Meetup · 模型推理实践", description: "围绕模型输入准备、推理应用与部署中的常见问题交流。", place: "线上 · 活动信息示例" },
  { id: "live-cann", month: "11月", day: "12", weekday: "周四", time: "14:00", kind: "课程直播", title: "CANN 工具链快速上手", description: "演示开发环境准备、样例定位与基础工具链检查。", place: "线上 · 活动信息示例" },
  { id: "meetup-community", month: "11月", day: "19", weekday: "周四", time: "19:00", kind: "开发者交流", title: "昇腾 AI 应用开发者交流会", description: "分享模型迁移、应用调试与开发协作中的实践经验。", place: "线上 · 活动信息示例" },
];

function DiscoveryCard({ item, index, onOpen, followed, onFollow }) {
  return (
    <article className={`ld-card ld-card-tone-${index % 4}`}>
      <div className="ld-card-topline">
        <span className="ld-type-chip">{item.type}</span>
        {item.reason && <span className="ld-card-context">{item.reason}</span>}
      </div>
      <h3>{item.title}</h3>
      <p className="ld-card-description">{item.description}</p>
      <div className="ld-card-bottom">
        <span className="ld-card-meta">{item.meta}</span>
        {item.href ? <a className="ld-card-action" href={item.href} target="_blank" rel="noreferrer">{item.action}<IconArrowRight size={15} /></a>
          : item.followId ? <button className={`ld-card-action${followed ? " is-followed" : ""}`} type="button" aria-pressed={followed} onClick={() => onFollow(item.followId)}>{followed ? "已关注" : item.action}{followed ? <IconCircleCheck size={15} /> : <IconArrowRight size={15} />}</button>
            : <button className="ld-card-action" type="button" onClick={() => onOpen(item.destination)}>{item.action}<IconArrowRight size={15} /></button>}
      </div>
    </article>
  );
}

function EmptyResults() {
  return <div className="ld-empty">没有找到匹配内容，试试课程、知识点或活动关键词。</div>;
}

export function LearningDiscoveryPage({ onOpenItem }) {
  const [activeTab, setActiveTab] = useState("recommended");
  const [query, setQuery] = useState("");
  const [followed, setFollowed] = useState(() => new Set());
  const [joinedEvents, setJoinedEvents] = useState(() => new Set());
  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
  const filteredRecommendations = useMemo(() => recommendations.filter(item => `${item.type} ${item.title} ${item.description} ${item.reason}`.toLocaleLowerCase("zh-CN").includes(normalizedQuery)), [normalizedQuery]);
  const filteredNewItems = useMemo(() => newItems.filter(item => `${item.type} ${item.title} ${item.description} ${item.meta}`.toLocaleLowerCase("zh-CN").includes(normalizedQuery)), [normalizedQuery]);
  const filteredEvents = useMemo(() => events.filter(item => `${item.kind} ${item.title} ${item.description} ${item.place}`.toLocaleLowerCase("zh-CN").includes(normalizedQuery)), [normalizedQuery]);
  const toggleSet = (setter, id) => setter(previous => {
    const next = new Set(previous);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  return (
    <section className="learning-discovery" aria-label="学习发现">
      <header className="ld-header">
        <div className="ld-heading-copy">
          <div className="ld-eyebrow"><IconSparkles size={15} />学习与活动</div>
          <h1>学习发现</h1>
          <p>接着学一点，发现新内容，也看看开发者们最近在交流什么。</p>
        </div>
        <div className="ld-heading-tools">
          <span className="ld-demo-note">原型示例内容</span>
          <label className="ld-search">
            <IconSearch size={16} />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索课程、知识点或活动" aria-label="搜索学习内容与活动" />
          </label>
        </div>
      </header>

      <div className="ld-tabbar" role="tablist" aria-label="学习发现分类">
        {tabs.map(tab => <button key={tab.id} id={`ld-tab-${tab.id}`} className={`ld-tab${activeTab === tab.id ? " is-active" : ""}`} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls="ld-tabpanel" onClick={() => setActiveTab(tab.id)}>
          <span>{tab.label}</span><small>{tab.count}</small>
        </button>)}
        <span className="ld-tabbar-spacer" />
        {activeTab === "recommended" && <span className="ld-sort-note">结合当前学习主题整理</span>}
      </div>

      <div id="ld-tabpanel" className="ld-scroll" role="tabpanel" aria-labelledby={`ld-tab-${activeTab}`}>
        {activeTab === "recommended" && <>
          <div className="ld-section-heading">
            <div><h2>为你推荐</h2><p>从课程、路径、知识点和下一步任务里，挑一个接着探索。</p></div>
            <span className="ld-section-count">{filteredRecommendations.length} 项</span>
          </div>
          <div className="ld-card-grid">
            {filteredRecommendations.map((item, index) => <DiscoveryCard key={item.title} item={item} index={index} onOpen={onOpenItem} />)}
          </div>
          {filteredRecommendations.length === 0 && <EmptyResults />}
        </>}

        {activeTab === "new" && <>
          <div className="ld-section-heading">
            <div><h2>新上架</h2><p>课程、成长路径、认证专题与知识点，集中浏览最近可探索的内容。</p></div>
            <span className="ld-section-count">{filteredNewItems.length} 项</span>
          </div>
          <div className="ld-card-grid">
            {filteredNewItems.map((item, index) => <DiscoveryCard key={item.title} item={item} index={index} onOpen={onOpenItem} followed={followed.has(item.followId)} onFollow={id => toggleSet(setFollowed, id)} />)}
          </div>
          {filteredNewItems.length === 0 && <EmptyResults />}
          <p className="ld-source-footnote">官方入口会跳转至昇腾开发者网站；认证专题为本 Demo 的内容形态示例。</p>
        </>}

        {activeTab === "calendar" && <>
          <div className="ld-section-heading ld-calendar-heading">
            <div><h2>近期日程</h2><p>Meetup、课程直播与开发者交流，选中后加入本页的演示日程。</p></div>
            <span className="ld-section-count">{filteredEvents.length} 场活动</span>
          </div>
          <div className="ld-event-list">
            {filteredEvents.map(event => {
              const isJoined = joinedEvents.has(event.id);
              return <article className="ld-event" key={event.id}>
                <div className="ld-event-date"><span>{event.month}</span><strong>{event.day}</strong><small>{event.weekday}</small></div>
                <div className="ld-event-copy">
                  <div className="ld-event-meta"><span className="ld-type-chip">{event.kind}</span><span>{event.time}</span></div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <small className="ld-event-place">{event.place}</small>
                </div>
                <button className={`ld-join-button${isJoined ? " is-joined" : ""}`} type="button" aria-pressed={isJoined} onClick={() => toggleSet(setJoinedEvents, event.id)}>{isJoined ? <><IconCircleCheck size={15} />已加入</> : <>加入日程<IconArrowRight size={15} /></>}</button>
              </article>;
            })}
          </div>
          {filteredEvents.length === 0 && <EmptyResults />}
          <p className="ld-source-footnote">活动名称、时间与报名信息均为原型示例，不代表真实活动公告；“加入日程”仅保存在当前页面状态。</p>
        </>}
      </div>
    </section>
  );
}
