import { ICON_SIZE } from "./icon-system.js";
import { useMemo, useState } from "react";
import { IconArrowRight, IconCalendarEvent, IconCircleCheck, IconSearch, IconSparkles, IconUsersGroup, IconVideo } from "@tabler/icons-react";
import { LEARNING_TASK } from "./learning-data";
import { OFFICIAL_LEARNING_PATH_URL, OFFICIAL_LEARNING_SOURCES, OFFICIAL_LEARNING_STAGES, OFFICIAL_LEARNING_TASK } from "./official-learning-data";
import resnetCourseImage from "./assets/learning-discovery/resnet50-inference-course-category-palette.jpg";
import featuredResnetPathImage from "./assets/learning-discovery/resnet50-inference-path-cool-spectrum.png";
import preprocessingPathImage from "./assets/learning-discovery/image-preprocessing-path-category-palette.jpg";
import tensorKnowledgeImage from "./assets/learning-discovery/hwc-to-chw-knowledge-category-palette.jpg";
import inputContractImage from "./assets/learning-discovery/model-input-contract-banner-palette.jpg";
import ascendclCourseImage from "./assets/learning-discovery/ascendcl-quickstart-banner-palette.jpg";
import developerPathImage from "./assets/learning-discovery/developer-growth-path-banner-palette.jpg";
import certificationImage from "./assets/learning-discovery/developer-certification-category-palette.jpg";
import meetupImage from "./assets/learning-discovery/developer-meetup-banner-palette.jpg";
import "./learning-discovery.css";

const featuredPathActionCount = OFFICIAL_LEARNING_STAGES.reduce((total, stage) => total + stage.children.length, 0);
const featuredPathDuration = OFFICIAL_LEARNING_STAGES.reduce((total, stage) => total + stage.minutes, 0);
const featuredRecommendation = {
  type: "学习路径",
  title: "ResNet50 离线推理学习路径",
  description: "从认识推理链路、准备环境与样例，到整理输入、执行推理和解读结果，完整走一遍 ResNet50 离线推理。",
  destination: { taskName: OFFICIAL_LEARNING_TASK, materialId: OFFICIAL_LEARNING_STAGES[0].id },
  action: "开始学习",
};
const pathStageTones = ["blue", "cyan", "purple", "rose", "green"];

const recommendations = [
  {
    type: "课程",
    title: "ResNet50 C&C++ 应用课程",
    description: "沿着图像输入、模型执行到结果解读，梳理一次完整的推理流程。",
    reason: "与你正在探索的图像推理主题相关",
    meta: "官方课程 · 约 50 分钟",
    image: resnetCourseImage,
    imageAlt: "图像经过多层特征提取后进入分类结果的 ResNet 推理流程",
    destination: { taskName: OFFICIAL_LEARNING_TASK, materialId: "learning-official-stage-chain" },
    action: "继续学习",
  },
  {
    type: "学习路径",
    title: "图像输入预处理学习路径",
    description: "从 RGB 与维度理解开始，逐步完成跟练、输入检查和学习记录。",
    reason: "延续 HWC、CHW 与 batch 的学习目标",
    meta: "4 个学习节点 · 约 30 分钟",
    image: preprocessingPathImage,
    imageAlt: "图像预处理路径：从 RGB 图像经过多个步骤整理为模型输入",
    destination: { taskName: LEARNING_TASK, materialId: "learning-path" },
    action: "查看学习路径",
  },
  {
    type: "知识点",
    title: "HWC → CHW：看懂图像通道轴",
    description: "用一张图像理解 H、W、C 的含义，以及通道轴为什么会移动。",
    reason: "这是图像数据进入模型前的关键概念",
    meta: "概念讲解 · 约 8 分钟",
    image: tensorKnowledgeImage,
    imageAlt: "RGB 图像张量从按高度、宽度、通道排列转换为按通道优先排列",
    destination: { taskName: LEARNING_TASK, materialId: "learning-lesson", anchor: "layout" },
    action: "打开知识点",
  },
  {
    type: "认证",
    title: "昇腾开发者认证准备",
    description: "结合你正在学习的 CANN 与模型推理内容，梳理认证知识主题和下一步准备重点。",
    reason: "与你近期的图像推理学习目标相关",
    meta: "认证规划 · Demo 建议",
    image: certificationImage,
    imageAlt: "认证证书、备考笔记和学习清单",
    followId: "certification",
    action: "关注备考专题",
  },
];

const newItems = [
  {
    type: "课程",
    title: OFFICIAL_LEARNING_SOURCES.quickstart.title,
    description: "从官方快速入门课程了解 AscendCL 的基础概念与应用流程。",
    meta: "官方课程入口",
    image: ascendclCourseImage,
    imageAlt: "从代码、运行流程到 AI 加速设备的 AscendCL 快速入门课程内容",
    action: "打开官方课程",
    href: OFFICIAL_LEARNING_SOURCES.quickstart.url,
  },
  {
    type: "路径",
    title: "昇腾开发者成长路径",
    description: "按学习阶段浏览昇腾开发者成长资源与课程入口。",
    meta: "官方学习路径",
    image: developerPathImage,
    imageAlt: "开发者从基础学习逐步前往应用构建和进阶部署的成长路径",
    action: "浏览成长路径",
    href: OFFICIAL_LEARNING_PATH_URL,
  },
  {
    type: "认证",
    title: "开发者认证备考专题",
    description: "汇总认证方向、能力主题与学习准备清单，方便规划下一步。",
    meta: "专题示例 · 可关注",
    image: certificationImage,
    imageAlt: "认证证书、备考笔记和学习清单",
    action: "关注专题",
    followId: "certification",
  },
  {
    type: "知识点",
    title: "图像预处理：核对模型输入约定",
    description: "从模型签名和官方样例出发，逐项记录输入数据类型、布局与尺寸。",
    meta: "学习内容 · 输入准备",
    image: inputContractImage,
    imageAlt: "图像输入的张量规格与核对清单示意",
    action: "打开知识点",
    destination: { taskName: OFFICIAL_LEARNING_TASK, materialId: "learning-official-stage-input" },
  },
];

const events = [
  { id: "meetup-inference", month: "11月", day: "05", weekday: "周四", time: "19:30", kind: "Meetup", title: "昇腾开发者 Meetup · 模型推理实践", description: "围绕模型输入准备、推理应用与部署中的常见问题交流。", place: "线上 · 活动信息示例", image: meetupImage, imageAlt: "开发者围绕模型推理流程交流讨论" },
  { id: "live-cann", month: "11月", day: "12", weekday: "周四", time: "14:00", kind: "课程直播", title: "CANN 工具链快速上手", description: "演示开发环境准备、样例定位与基础工具链检查。", place: "线上 · 活动信息示例" },
  { id: "meetup-community", month: "11月", day: "19", weekday: "周四", time: "19:00", kind: "开发者交流", title: "昇腾 AI 应用开发者交流会", description: "分享模型迁移、应用调试与开发协作中的实践经验。", place: "线上 · 活动信息示例" },
];

const chipTone = type => ({
  "课程": "tone-course",
  "学习路径": "tone-path",
  "路径": "tone-path",
  "知识点": "tone-knowledge",
  "认证": "tone-certification",
  "学习任务": "tone-task",
  "Meetup": "tone-meetup",
  "课程直播": "tone-course",
  "开发者交流": "tone-community",
}[type] ?? "tone-neutral");

function DiscoveryCard({ item, onOpen, followed, onFollow }) {
  return (
    <article className="ld-card">
      <div className="ld-card-media">
        <img src={item.image} alt={item.imageAlt} loading="lazy" />
      </div>
      <div className="ld-card-content">
        <div className="ld-card-topline">
          <span className={`ld-type-chip ${chipTone(item.type)}`}>{item.type}</span>
          {item.reason && <span className="ld-card-context">{item.reason}</span>}
        </div>
        <h3>{item.title}</h3>
        <p className="ld-card-description">{item.description}</p>
        <div className="ld-card-bottom">
          <span className="ld-card-meta">{item.meta}</span>
          {item.href ? <a className="ld-card-action" href={item.href} target="_blank" rel="noreferrer">{item.action}<IconArrowRight size={ICON_SIZE.control} /></a>
            : item.followId ? <button className={`ld-card-action${followed ? " is-followed" : ""}`} type="button" aria-pressed={followed} onClick={() => onFollow(item.followId)}>{followed ? "已关注" : item.action}{followed ? <IconCircleCheck size={ICON_SIZE.control} /> : <IconArrowRight size={ICON_SIZE.control} />}</button>
              : <button className="ld-card-action" type="button" onClick={() => onOpen(item.destination)}>{item.action}<IconArrowRight size={ICON_SIZE.control} /></button>}
        </div>
      </div>
    </article>
  );
}

function EmptyResults() {
  return <div className="ld-empty">没有找到匹配内容，试试课程、知识点或活动关键词。</div>;
}

export function LearningDiscoveryPage({ onOpenItem }) {
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
        <div className="ld-hero-inner">
          <div className="ld-hero-topline">
            <div className="ld-featured-state"><IconSparkles size={ICON_SIZE.control} /><span>为你推荐</span><i aria-hidden="true" /></div>
            <label className="ld-search">
              <IconSearch size={ICON_SIZE.control} />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索课程、知识点或活动" aria-label="搜索学习内容与活动" />
            </label>
          </div>
          <div className="ld-featured-layout">
            <div className="ld-featured-copy">
              <span className="ld-featured-type">学习路径 <span>{OFFICIAL_LEARNING_STAGES.length} 个阶段 · {featuredPathActionCount} 个学习动作 · 约 {featuredPathDuration} 分钟</span></span>
              <h1>{featuredRecommendation.title}</h1>
              <p>{featuredRecommendation.description}</p>
              <button className="ld-primary-action" type="button" onClick={() => onOpenItem(featuredRecommendation.destination)}>{featuredRecommendation.action}<IconArrowRight size={ICON_SIZE.control} /></button>
            </div>
            <div className="ld-featured-art">
              <img src={featuredResnetPathImage} alt="猫图像经过张量特征处理与 ResNet50 推理，生成分类结果" />
            </div>
          </div>
          <ol className="ld-stage-groups" aria-label={`ResNet50 离线推理学习路径的 ${OFFICIAL_LEARNING_STAGES.length} 个阶段和 ${featuredPathActionCount} 个学习动作`}>
            {OFFICIAL_LEARNING_STAGES.map((stage, stageIndex) => (
              <li className={`ld-stage-group ld-stage-${pathStageTones[stageIndex % pathStageTones.length]}`} key={stage.id}>
                <div className="ld-stage-heading">
                  <span className="ld-stage-index" aria-hidden="true">{String(stageIndex + 1).padStart(2, "0")}</span>
                  <h2>{stage.title}</h2>
                  <span className="ld-stage-duration">{stage.minutes} 分钟</span>
                </div>
                <ol className="ld-stage-actions">
                  {stage.children.map(node => (
                    <li key={node.id}>
                      <button className="ld-path-action" type="button" onClick={() => onOpenItem({ taskName: OFFICIAL_LEARNING_TASK, materialId: node.id })} aria-label={`打开${stage.title}：${node.title}`}>
                        <span className="ld-path-action-dot" aria-hidden="true" />
                        <span>{node.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <main className="ld-scroll" aria-label="学习发现内容">
        <section className="ld-floor ld-floor-recommended" aria-labelledby="ld-heading-recommended">
          <div className="ld-section-heading">
            <div className="ld-section-copy"><span className="ld-floor-kicker">01 · 继续探索</span><h2 id="ld-heading-recommended">更多推荐</h2><p>课程、路径、知识点和认证专题，接着这条路径继续学习。</p></div>
            <span className="ld-section-count">{filteredRecommendations.length} 项</span>
          </div>
          <div className="ld-card-grid">
            {filteredRecommendations.map(item => <DiscoveryCard key={item.title} item={item} onOpen={onOpenItem} followed={followed.has(item.followId)} onFollow={id => toggleSet(setFollowed, id)} />)}
          </div>
          {filteredRecommendations.length === 0 && <EmptyResults />}
        </section>

        <section className="ld-floor ld-floor-new" aria-labelledby="ld-heading-new">
          <div className="ld-section-heading">
            <div className="ld-section-copy"><span className="ld-floor-kicker">02 · 新内容</span><h2 id="ld-heading-new">新上架</h2><p>课程、成长路径、认证专题与知识点，集中浏览最近可探索的内容。</p></div>
            <span className="ld-section-count">{filteredNewItems.length} 项</span>
          </div>
          <div className="ld-card-grid">
            {filteredNewItems.map(item => <DiscoveryCard key={item.title} item={item} onOpen={onOpenItem} followed={followed.has(item.followId)} onFollow={id => toggleSet(setFollowed, id)} />)}
          </div>
          {filteredNewItems.length === 0 && <EmptyResults />}
          <p className="ld-source-footnote">官方入口会跳转至昇腾开发者网站；认证专题为本 Demo 的内容形态示例。</p>
        </section>

        <section className="ld-floor ld-floor-calendar" aria-labelledby="ld-heading-calendar">
          <div className="ld-section-heading ld-calendar-heading">
            <div className="ld-section-copy"><span className="ld-floor-kicker">03 · 和开发者见面</span><h2 id="ld-heading-calendar">近期日程</h2><p>Meetup、课程直播与开发者交流，选中后加入本页的演示日程。</p></div>
            <span className="ld-section-count">{filteredEvents.length} 场活动</span>
          </div>
          <div className="ld-event-list">
            {filteredEvents.map(event => {
              const isJoined = joinedEvents.has(event.id);
              const EventIcon = event.kind === "课程直播" ? IconVideo : event.kind === "Meetup" ? IconCalendarEvent : IconUsersGroup;
              return <article className="ld-event" key={event.id}>
                <div className="ld-event-date"><span>{event.month}</span><strong>{event.day}</strong><small>{event.weekday}</small></div>
                <div className="ld-event-copy">
                  <div className="ld-event-meta"><span className={`ld-type-chip ${chipTone(event.kind)}`}>{event.kind}</span><span>{event.time}</span></div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <small className="ld-event-place">{event.place}</small>
                </div>
                <div className={`ld-event-media${event.image ? " has-image" : ""}`} aria-hidden="true">
                  {event.image ? <img src={event.image} alt="" loading="lazy" /> : <EventIcon size={ICON_SIZE.feature} />}
                </div>
                <button className={`ld-join-button${isJoined ? " is-joined" : ""}`} type="button" aria-pressed={isJoined} onClick={() => toggleSet(setJoinedEvents, event.id)}>{isJoined ? <><IconCircleCheck size={ICON_SIZE.control} />已加入</> : <>加入日程<IconArrowRight size={ICON_SIZE.control} /></>}</button>
              </article>;
            })}
          </div>
          {filteredEvents.length === 0 && <EmptyResults />}
          <p className="ld-source-footnote">活动名称、时间与报名信息均为原型示例，不代表真实活动公告；“加入日程”仅保存在当前页面状态。</p>
        </section>
      </main>
    </section>
  );
}
