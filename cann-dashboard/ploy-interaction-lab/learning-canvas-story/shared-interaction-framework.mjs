// Framework rules precede the photographed examples. Screenshots illustrate
// locations; a static frame is not evidence of arbitrary intent or concurrency.
const dir = 'images/shared-full-states-20261019/';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const framework = [
  {
    key:'task-boundary', title:'项目组织任务，任务承载对话、内容与恢复现场',
    thesis:'一个任务，<br>一份连续的工作现场',
    lead:'先确定当前在做什么，再决定需要展开什么。理解、试改、审阅与核对都归属当前任务。',
    facts:[
      ['项目与任务','左侧定位工作范围；切换任务时，各自的对话、内容和阅读位置分别保留。'],
      ['任务对话','中间持续表达目标、解释依据和接续行动，小提示直接留在相关回复旁。'],
      ['按需内容','右侧查看图解、代码、Diff、网页或结果；需要时打开，用完可以收起。']
    ],
    image:'image-proposal', caption:'三栏是同一任务的三个部分；学习作为任务中的活动进入。',
    highlights:[
      {x:3,y:58,width:280,height:659,label:'项目与任务：定位现场'},
      {x:289,y:58,width:540,height:659,label:'任务对话：持续推进'},
      {x:836,y:58,width:441,height:659,label:'按需内容：查看与操作'}
    ],
    principle:'任务身份是上下文与恢复的边界；内容类型不改变这套结构。',
    evidence:'现有三栏实拍＋共通交互规则；网页等完整业务流程仍待逐项适配。'
  },
  {
    key:'intent-and-attention', title:'内容出现的方式，跟随用户意图与当前注意力',
    thesis:'该展开时展开，<br>阅读时保持当前现场',
    lead:'主动交互先判断用户现在想做什么，以及是否正在阅读或编辑。',
    facts:[
      ['问原因、求理解','回答与关联图解一起出现，用户可以直接看和试。'],
      ['只报错、要求修复','先给必要依据，在问题旁提供深入入口；短提示不新建内容对象。'],
      ['正在阅读或编辑','新建议轻提示，保留当前对象、位置和未保存内容。'],
      ['明确试改、采用、检查','接续相应操作；实际改变内容前明确影响范围。']
    ],
    image:'addcustom-prompt', caption:'就近提示呈现依据和下一步；用户可接续，也可以收回摘要。',
    highlights:[{x:303,y:324,width:513,height:166,label:'行动入口贴着相关回答'}],
    principle:'主动程度随意图变化；提示、展开和执行分别有清楚的边界。',
    evidence:'截图展示现有提示样式；四类意图为通用规则，当前仅有固定分支演示。'
  },
  {
    key:'workspace-navigation', title:'平时查看具体内容，需要时拉远看同一批内容',
    thesis:'当前内容与总览，<br>共用同一批对象',
    lead:'右侧平时承载具体内容。找关系、定位历史或查看全貌时，再进入总览。',
    facts:[
      ['打开与切换','用标题处的分类入口选择内容；正文按代码、浏览器、图解或 Diff 自然呈现。'],
      ['看全部','按任务主题显示对象与关联；类型是辅助信息，无需先选一套管理视图。'],
      ['缩小与定位','详情 → 摘要 → 主题逐级精简，保持字号可读；点选内容回到正文。']
    ],
    image:'addcustom-map-topics', caption:'总览用于找内容；点选后继续正常阅读，右侧无需一直保持画布。',
    highlights:[
      {x:835,y:58,width:441,height:37,label:'同一标题区域：切换内容、看全部、收起'},
      {x:835,y:133,width:441,height:560,label:'总览：按任务主题定位'}
    ],
    principle:'总览是需要时的查看方式，不增加一排日常模式选择。',
    evidence:'图中为现有主题总览；主题由两个案例预置，关联来自明确记录。'
  },
  {
    key:'content-identity', title:'业务正文各不相同，内容身份与管理动作保持一致',
    thesis:'管理同一个对象，<br>保留每一次的条件',
    lead:'内容是能独立回看、操作或引用的对象。一次提示、一次调参不必各生成一张卡。',
    facts:[
      ['统一身份与入口','对象名称、任务归属、当前状态，以及来源、关联、历史保持一致。'],
      ['正文按需组合','图解、视频、代码、Diff、网页或表格按业务组合；只需阅读的资料不强加试改和核对。'],
      ['当前与历史分开','历史保留时间、输入与版本条件，只读查看；最新、已采用、已核对各自标明归属。']
    ],
    image:'image-current-info', caption:'条件、来源、关联与历史属于当前对象，统一从按需入口查看。',
    highlights:[{x:838,y:98,width:438,height:534,label:'共通管理层；正文随业务变化'}],
    principle:'来源关系帮助追溯；新条件不沿用旧结果，应用也不自动触发检查。',
    evidence:'图中为图像推理的现有管理入口；模块组合是跨业务交互范式。'
  },
  {
    key:'temporary-and-return', title:'临时对照、收起和再打开，都有确定的返回位置',
    thesis:'临时改变查看方式，<br>继续同一份工作',
    lead:'查看方式可以变化；内容对象、版本归属和任务上下文持续保留。',
    facts:[
      ['进入前保留起点','保存原对象、历史版本和阅读位置；对照只聚焦选定的两份内容。'],
      ['过程中适应空间','宽栏并排，窄栏完整查看一方；固定参考与临时对照分别表达。'],
      ['结束或唤醒后继续','结束对照回入口；收起归还对话空间，再打开恢复原内容。查看不等于执行。']
    ],
    image:'compare-wide', caption:'两份记录各自保留条件；临时对照结束后回到进入前的原记录。',
    highlights:[
      {x:643,y:93,width:634,height:70,label:'当前双方身份与结束入口'},
      {x:643,y:166,width:634,height:551,label:'同一临时对照，保留原对象和条件'}
    ],
    principle:'打开、缩放、对照、收起只改变查看；保存、应用、核对才改变业务记录。',
    evidence:'现有宽窄栏与返回实拍；后续逐页呈现收起前、收起、恢复的状态。'
  },
  {
    key:'updates-without-interruption', title:'新结果登记到原内容，当前阅读和编辑继续进行',
    thesis:'变化可以被发现，<br>当前工作不被打断',
    lead:'新增信息首先更新所属对象；系统不替用户切换工作焦点。',
    facts:[
      ['正在阅读或编辑','不切走、不重排，也不覆盖未保存草案；在关联位置提示更新。'],
      ['右侧已经收起','保持关闭，入口保留更新数量；用户需要时再唤醒。'],
      ['用户接续更新','定位到对应对象并短暂强调；处理后收回普通摘要，避免常驻醒目提示。']
    ],
    image:'image-overview', caption:'图中已有任务内更新入口；新结果仍归属原对象，而非另铺一批卡片。',
    highlights:[
      {x:709,y:103,width:54,height:27,label:'任务内更新入口'},
      {x:969,y:207,width:275,height:80,label:'所属对象上的更新提示'}
    ],
    principle:'出现、查看、执行与更新分别管理，共同保持任务的连续性。',
    evidence:'截图仅证明现有更新标记；真实后台晚到、外部并发和编辑冲突仍待验证。'
  }
];

export const frameworkPageCount = framework.length;
export const frameworkPagesIndex = framework.map(item=>({key:item.key,title:item.title}));

const taskFrameworkMap = () => `<div class="framework-map-layout"><svg class="framework-map" viewBox="0 0 1180 500" role="img" aria-labelledby="framework-map-title framework-map-desc"><title id="framework-map-title">以任务为边界的共性交互框架</title><desc id="framework-map-desc">对话按需要打开当前内容；当前内容可进入总览或临时对照，也可收起。选中总览对象、结束对照和重新打开均返回原内容或明确选定的对象。新结果登记到原对象，保留当前阅读和编辑现场。</desc><defs><marker id="framework-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" stroke-width="1.5"/></marker></defs>
  <g class="framework-task-band"><rect x="20" y="10" width="1125" height="48" rx="12"/><text x="42" y="40" class="framework-map-label">项目 / 当前任务</text><text x="265" y="40">对话、内容、历史与恢复状态，共同归属该任务</text></g>
  <g class="framework-map-lines"><path d="M255 180H360"/><path d="M360 222H255"/><path d="M620 164H755V114H880"/><path d="M880 147H788V207H620"/><path d="M620 221H707V288H880"/><path d="M880 323H680V238H620"/><path d="M448 242V324"/><path d="M540 324V242"/></g>
  <g class="framework-edge-labels"><text x="306" y="164">需要内容</text><text x="306" y="250">反馈回对话</text><text x="754" y="94">看全部</text><text x="752" y="231">点选内容</text><text x="787" y="277">开始对照</text><text x="786" y="346">结束 · 回原处</text><text x="420" y="291">收起</text><text x="582" y="291">打开 · 恢复</text></g>
  <g class="framework-map-node"><rect x="20" y="150" width="235" height="100" rx="14"/><text x="137" y="183" class="framework-map-heading">任务对话</text><text x="137" y="211">表达目标、提问、接续行动</text><text x="137" y="235" class="framework-map-secondary">短提示留在相关回复旁</text></g>
  <g class="framework-map-node framework-current-node"><rect x="360" y="142" width="260" height="100" rx="14"/><text x="490" y="177" class="framework-map-heading">当前内容</text><text x="490" y="207">图解 / 代码 / 预览 / 网页 / Diff</text><text x="490" y="230" class="framework-map-secondary">正文随对象变化，管理方式一致</text></g>
  <g class="framework-map-node"><rect x="880" y="82" width="265" height="90" rx="14"/><text x="1012" y="114" class="framework-map-heading">总览定位</text><text x="1012" y="141">主题 / 关联 / 历史</text><text x="1012" y="162" class="framework-map-secondary">同一批对象，缩小精简信息</text></g>
  <g class="framework-map-node"><rect x="880" y="260" width="265" height="90" rx="14"/><text x="1012" y="292" class="framework-map-heading">临时对照</text><text x="1012" y="319">保留双方版本与条件</text><text x="1012" y="340" class="framework-map-secondary">宽栏并排，窄栏切换</text></g>
  <g class="framework-map-node"><rect x="360" y="324" width="260" height="74" rx="14"/><text x="490" y="355" class="framework-map-heading">内容收起</text><text x="490" y="382">继续对话，保留原对象与位置</text></g>
  <g class="framework-updates-band"><rect x="20" y="433" width="1125" height="50" rx="12"/><text x="43" y="464" class="framework-map-label">新结果到达</text><text x="258" y="464">更新原对象与入口计数</text><path d="M195 458H228"/><path d="M596 458H635"/><text x="667" y="464">保持当前阅读、编辑与空间位置</text></g></svg>
  <div class="framework-mobile-map"><p><b>项目 / 当前任务</b><span>对话、内容、历史与恢复状态共同归属该任务。</span></p><dl><div><dt>对话 ⇄ 当前内容</dt><dd>需要持续查看时打开，反馈回到原对话。</dd></div><div><dt>当前内容 ⇄ 总览</dt><dd>看全部以定位主题和历史，点选对象回正文。</dd></div><div><dt>当前内容 ⇄ 临时对照</dt><dd>比较选定两份，结束后回到进入前的对象。</dd></div><div><dt>当前内容 ⇄ 收起</dt><dd>归还对话空间，再打开恢复原对象与位置。</dd></div><div><dt>新结果 → 原对象</dt><dd>更新计数与就近提示，当前阅读和编辑继续。</dd></div></dl></div><p class="framework-map-caption">共通框架：先定位任务，再按需要查看内容；查看方式的变化与业务执行分别管理。</p></div>`;

const frame = page => `<figure class="framework-frame"><button type="button" class="capture-image" data-enlarge="${dir+page.image}.jpg" data-highlights="${esc(JSON.stringify(page.highlights))}" data-viewport="1280 720" aria-label="放大框架：${esc(page.title)}"><span class="capture-visual"><img src="${dir+page.image}.jpg" alt="${esc(page.caption)}" loading="lazy" decoding="async"><svg class="capture-annotations" viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true">${page.highlights.map((h,i)=>`<rect x="${h.x}" y="${h.y}" width="${h.width}" height="${h.height}" rx="5"/><circle cx="${h.x+13}" cy="${h.y+13}" r="11"/><text x="${h.x+13}" y="${h.y+18}">${i+1}</text>`).join('')}</svg></span></button><figcaption><strong>${page.caption}</strong><div class="framework-legend">${page.highlights.map((h,i)=>`<span>${i+1}. ${esc(h.label)}</span>`).join('')}</div><small>完整界面位置说明 · 点击放大</small></figcaption></figure>`;

export function interactionFrameworkPages(chapterTabs) {
  return framework.map((page,index)=>`<section class="slide s-gray shared-rules framework-rules" id="framework-${page.key}" data-framework="${page.key}" data-title="${page.title}"><div class="head"><div class="head-l"><div class="brand"><span class="ttl">${page.title}</span></div><div class="subttl">共用交互框架 · ${index+1} / ${framework.length}</div></div>${chapterTabs('C')}</div><div class="body-area">${index===0?taskFrameworkMap():`<div class="framework-layout"><div class="framework-copy"><h2>${page.thesis}</h2><p>${page.lead}</p><dl>${page.facts.map(([label,text])=>`<div><dt>${label}</dt><dd>${text}</dd></div>`).join('')}</dl><p class="framework-principle">${page.principle}</p></div>${frame(page)}</div>`}</div><div class="foot">${index===0?'通用框架逻辑 · 任务为共同边界；后续完整界面逐项代入规则。':page.evidence}</div></section>`);
}

export const frameworkCSS = `
.story-deck .framework-map-layout{width:100%;display:grid;gap:1vh;align-content:center}
.story-deck .framework-map{display:block;width:100%;height:auto;overflow:visible;color:#7b83ab;font-family:inherit}
.story-deck .framework-map text{font-size:18px;fill:#626b7c}
.story-deck .framework-map .framework-map-label{font-weight:700;fill:#363d50}
.story-deck .framework-map .framework-map-heading{font-size:23px;fill:#303749;font-weight:700}
.story-deck .framework-map .framework-map-secondary{font-size:16px;fill:#7b8391}
.story-deck .framework-task-band rect{fill:#ffffff99;stroke:#fff}
.story-deck .framework-map-node rect{fill:#ffffffb8;stroke:#cfd5e1;stroke-width:1.2}
.story-deck .framework-map-node text{text-anchor:middle}
.story-deck .framework-current-node rect{fill:#eeeefd;stroke:#aeb4db}
.story-deck .framework-map-lines path{fill:none;stroke:#8c95b7;stroke-width:1.8;marker-end:url(#framework-arrow);stroke-linejoin:round}
.story-deck .framework-edge-labels text{font-size:16px;text-anchor:middle;fill:#697390}
.story-deck .framework-updates-band rect{fill:#dde2f06b;stroke:#cfd5e3}
.story-deck .framework-updates-band path{stroke:#8c95b7;stroke-width:1.6;fill:none;marker-end:url(#framework-arrow)}
.story-deck .shared-rules .framework-map-caption{margin:0;text-align:center;font-size:var(--fs-body);line-height:1.5;color:var(--ink-2)}
.story-deck .framework-mobile-map{display:none}
.story-deck .framework-layout{display:grid;grid-template-columns:minmax(0,.3fr) minmax(0,.7fr);gap:2vw;width:100%;align-items:center}
.story-deck .framework-copy{display:grid;gap:1.5vh;align-content:center}
.story-deck .framework-copy h2{font-size:var(--fs-h2);font-weight:750;line-height:1.28;letter-spacing:-.025em}
.story-deck .shared-rules .framework-copy>p{margin:0;font-size:var(--fs-body);line-height:1.55}
.story-deck .framework-copy dl{display:grid;gap:1.4vh;margin:0}
.story-deck .framework-copy dl>div{display:grid;gap:.4vh}
.story-deck .framework-copy dt{font-size:var(--fs-body);line-height:1.4;font-weight:650;color:var(--ink)}
.story-deck .framework-copy dd{margin:0;font-size:var(--fs-body);line-height:1.55;color:var(--ink-2);overflow-wrap:anywhere}
.story-deck .shared-rules .framework-copy .framework-principle{border-top:1px solid #cfd4df;padding-top:1.2vh;color:#62658b}
.story-deck .framework-frame{display:grid;gap:1.1vh;margin:0;min-width:0}
.story-deck .framework-frame .capture-image img{max-height:62vh}
.story-deck .framework-frame figcaption{display:grid;gap:.7vh}
.story-deck .framework-frame figcaption>strong{font-size:var(--fs-body);font-weight:600;line-height:1.5;color:var(--ink-2)}
.story-deck .framework-legend{display:flex;flex-wrap:wrap;gap:.5vh 1.2vw;font-size:var(--fs-sm);line-height:1.4;color:#66709b}
.story-deck .framework-frame figcaption>small{font-size:var(--fs-sm);line-height:1.4;color:var(--ink-3)}
@media(max-height:730px) and (min-width:641px){.story-deck .framework-copy{gap:1vh}.story-deck .framework-copy dl{gap:1vh}.story-deck .framework-frame .capture-image img{max-height:57vh}}
@media(max-width:900px) and (min-width:641px){.story-deck .framework-layout{grid-template-columns:minmax(0,.34fr) minmax(0,.66fr);gap:1.5vw}}
@media(max-width:640px){.story-deck .framework-layout{grid-template-columns:1fr;gap:2.6vh;flex:0 0 auto}.story-deck .framework-rules .body-area{display:block;overflow-y:auto;overscroll-behavior:contain;padding-top:1vh;padding-bottom:5vh}.story-deck .framework-copy{gap:1.4vh}.story-deck .framework-copy dl{gap:1.4vh}.story-deck .framework-frame .capture-image img{max-height:none}.story-deck .framework-legend{gap:.6vh 2vw}.story-deck .framework-map{display:none}.story-deck .framework-mobile-map{display:grid;gap:2vh}.story-deck .framework-mobile-map>p{margin:0;padding:1.5vh 3vw;background:#ffffff99;border-radius:10px}.story-deck .framework-mobile-map>p span{display:block;margin-top:.7vh}.story-deck .framework-mobile-map dl{display:grid;gap:2vh;margin:0}.story-deck .framework-mobile-map dt{font-size:var(--fs-body);font-weight:650;line-height:1.5;color:var(--ink)}.story-deck .framework-mobile-map dd{font-size:var(--fs-body);line-height:1.6;color:var(--ink-2);margin:.6vh 0 0}.story-deck .shared-rules .framework-map-caption{text-align:left;padding-top:1.5vh;border-top:1px solid #cfd4df}}
`;
