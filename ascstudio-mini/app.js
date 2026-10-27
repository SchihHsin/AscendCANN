import { DESKTOP_URL, TASKS, KNOWLEDGE, WEEKLY_FEATURES, WEEKLY_TOPICS, taskById, knowledgeById } from "./knowledge.js";

const $ = s => document.querySelector(s);
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const paths = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', back: '<path d="m14 5-7 7 7 7"/>',
  search: '<circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 4 4"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>', check: '<path d="m5 12 4 4 10-10"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  pocket: '<path d="M5 4h14v9a7 7 0 0 1-14 0z"/><path d="m8 10 4 4 4-4"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>', more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 6.1A8 8 0 0 1 19.5 10M4.5 14A8 8 0 0 0 18 18"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  cube: '<path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10 9-5m-9 5L3 8m9 5v9"/>',
  desktop: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>', copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
  spark: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z"/>',
  note: '<path d="M14 3H5v18h14V8zM14 3v6h5M8 13h8m-8 4h6"/>',
  external: '<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>', home: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.3 1.7c-1 .9-1.9 1.2-1.9 2.8m0 3h.01"/>',
};
const icon = (name, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
const STORAGE = "ascstudio-mini:v1";
const WEEKLY_DAY_OPTIONS = ["周一", "周三", "周五"];
const validId = id => Boolean(knowledgeById(id));
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE) || "null") || {};
    const ids = value => [...new Set(Array.isArray(value) ? value.filter(validId) : [])];
    const topics = Array.isArray(raw.weeklyTopics) ? [...new Set(raw.weeklyTopics.filter(topic => WEEKLY_TOPICS.includes(topic)))] : [];
    return { saved: ids(raw.saved), learned: ids(raw.learned), interested: ids(raw.interested), unsure: ids(raw.unsure), answers: raw.answers && typeof raw.answers === "object" && !Array.isArray(raw.answers) ? raw.answers : {}, notes: Array.isArray(raw.notes) ? raw.notes.filter(n => n && TASKS.some(t => t.id === n.taskId) && typeof n.text === "string").slice(-100) : [], activeTask: TASKS.some(t => t.id === raw.activeTask) ? raw.activeTask : "training", weeklyTopics: topics.length ? topics : ["昇腾开发"], weeklyDay: WEEKLY_DAY_OPTIONS.includes(raw.weeklyDay) ? raw.weeklyDay : "周一", weeklyTime: ["09:00", "19:00"].includes(raw.weeklyTime) ? raw.weeklyTime : "09:00", weeklySubscribed: raw.weeklySubscribed === true };
  } catch { return { saved: [], learned: [], interested: [], unsure: [], answers: {}, notes: [], activeTask: "training", weeklyTopics: ["昇腾开发"], weeklyDay: "周一", weeklyTime: "09:00", weeklySubscribed: false }; }
}
const state = load();
let category = "为你推荐", query = "", group = 0, returnRoute = "discover", currentRoute = "", toastTimer, overlayReturnFocus;
const widgets = { cards: 4, batch: 4, devices: 4, accumulation: 2, sync: 0, precision: "mixed", parallel: "data", elements: 33, layout: "chw" };
function persist() {
  try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch { toast("当前浏览器无法保存记录，本次仍可继续体验"); }
}
function toast(message) {
  clearTimeout(toastTimer); $("#toast").textContent = message; $("#toast").classList.add("is-visible");
  toastTimer = setTimeout(() => $("#toast").classList.remove("is-visible"), 2600);
}
function go(route) {
  if (location.hash.slice(1) === route) render();
  else location.hash = route;
}
const routeFor = k => `knowledge/${k.id}`;
function activeTask() { return taskById(state.activeTask); }
function weeklyEntry() {
  const status = state.weeklySubscribed ? `演示订阅 · ${state.weeklyDay} ${state.weeklyTime}` : "一条重点资讯 + 两张相关知识卡";
  return `<button class="weekly-entry" data-route="briefing"><span class="weekly-entry-icon">${icon("spark")}</span><span class="weekly-entry-copy"><strong>每周开发速览</strong><small>${esc(status)}</small></span><span class="weekly-entry-end">${state.weeklySubscribed ? "已开启" : "看看"}${icon("chevron")}</span></button>`;
}
function smallArt(k, hero = false) {
  if (k.visual === "scaling") return `<div class="card-art art-scaling ${hero ? "art-hero" : ""}" aria-hidden="true"><div class="art-grid"></div><div class="chip chip-one"><span>NPU</span><div class="chip-core">1</div><small>单卡基线</small></div><div class="chip-link"><i></i><span>× 4 ?</span><i></i></div><div class="chip chip-four"><span>NPU × 4</span><div class="core-grid">${"<i></i>".repeat(4)}</div><small>扩展收益</small></div><span class="art-orbit orbit-one"></span><span class="art-orbit orbit-two"></span><span class="art-spark">✦</span></div>`;
  if (k.visual === "batch") return `<div class="card-art art-batch" aria-hidden="true"><div class="batch-stack"><i></i><i></i><i></i><b>4</b></div><span>×</span><div class="batch-number">4</div><span>×</span><div class="batch-number outline">2</div><div class="batch-sum">= 32</div></div>`;
  if (k.visual === "sync") return `<div class="card-art art-sync" aria-hidden="true"><i>g₁</i><span>⇄</span><b>∇</b><span>⇄</span><i>g₂</i><div class="sync-thread"></div></div>`;
  if (k.visual === "precision") return `<div class="card-art art-precision" aria-hidden="true"><i>16<span>bit</span></i><b>+</b><i>32<span>bit</span></i></div>`;
  if (k.visual === "tail") return `<div class="card-art art-tail" aria-hidden="true"><div>${"<i></i>".repeat(16)}</div><span>+</span><b>1</b></div>`;
  if (k.visual === "parallel") return `<div class="card-art art-parallel" aria-hidden="true"><div><i></i><i></i><i></i></div><span>↔</span><div><i></i><i></i><i></i></div></div>`;
  return `<div class="card-art art-layout" aria-hidden="true"><div><i>H</i><i>W</i><i>C</i></div><span>→</span><div><i>C</i><i>H</i><i>W</i></div></div>`;
}
function card(k, variant = "small") {
  if (variant === "hero") return `<button class="hero-card tone-${k.tone}" data-route="${routeFor(k)}"><div class="card-meta"><span>${esc(k.category)}</span><span>${icon("clock")}${k.minutes} 分钟</span></div><h2>${esc(k.title)}</h2><p>${esc(k.short)}</p>${smallArt(k, true)}<span class="hero-bottom"><span>${state.learned.includes(k.id) ? `${icon("check")} 已理解，再看一次` : "从一个小图解开始"}</span><span class="round-arrow">${icon("arrow")}</span></span></button>`;
  if (variant === "list") return `<button class="knowledge-row" data-route="${routeFor(k)}"><div class="row-art tone-${k.tone}">${smallArt(k)}</div><span class="row-copy"><strong>${esc(k.title)}</strong><span>${esc(k.category)} · ${k.minutes} 分钟${state.learned.includes(k.id) ? " · 已理解" : ""}</span></span>${icon("chevron")}</button>`;
  return `<button class="small-card tone-${k.tone}" data-route="${routeFor(k)}">${smallArt(k)}<h3>${esc(k.title)}</h3><div class="small-card-meta"><span>${k.minutes} 分钟${state.saved.includes(k.id) ? " · 已收藏" : ""}</span>${icon("arrow")}</div></button>`;
}
function filteredCards() {
  const text = query.trim().toLocaleLowerCase("zh-CN");
  const pool = KNOWLEDGE.filter(k => (!text || `${k.title} ${k.short} ${k.category} ${k.tags}`.toLocaleLowerCase("zh-CN").includes(text)) && (category === "为你推荐" || k.category === category));
  if (category === "为你推荐" && !text) {
    const order = activeTask().knowledge;
    pool.sort((a, b) => (order.includes(a.id) ? order.indexOf(a.id) : 99) - (order.includes(b.id) ? order.indexOf(b.id) : 99));
    if (pool.length && group) { const offset = group % Math.min(order.length, pool.length); return [...pool.slice(offset), ...pool.slice(0, offset)]; }
  }
  return pool;
}
function discoveryResults() {
  const pool = filteredCards();
  if (!pool.length) return empty("没找到这个知识点", "换个词试试，比如「梯度」「Batch」或「输入布局」。", "清空搜索", "clear-search");
  if (query.trim() || category !== "为你推荐") return `<div class="result-count">${query ? `「${esc(query)}」` : esc(category)} · ${pool.length} 个知识点</div><div class="knowledge-list">${pool.map(k => card(k, "list")).join("")}</div>`;
  return `${card(pool[0], "hero")}<div class="section-title"><h2>接着这条思路</h2><button class="text-button" data-action="shuffle">换一组 ${icon("refresh")}</button></div><div class="small-card-grid">${pool.slice(1, 3).map(k => card(k)).join("")}</div><div class="section-title more-title"><h2>也许你还想知道</h2><span>几分钟，懂一点</span></div><div class="knowledge-list">${pool.slice(3).map(k => card(k, "list")).join("")}</div><p class="list-end">一点一点，把想法连起来。</p>`;
}
function discover() {
  const t = activeTask();
  return `<div class="home-page"><div class="page-greeting"><div class="eyebrow"><span class="tiny-star">✦</span> 一点新知，接着你的思路</div><h1>今天，学一点什么？</h1></div>${weeklyEntry()}<div class="search-box">${icon("search")}<input type="search" id="knowledge-search" aria-label="搜索知识点" placeholder="搜一个概念，或说说你的问题" value="${esc(query)}" autocomplete="off"><button type="button" class="clear-search ${query ? "" : "is-hidden"}" data-action="clear-search" aria-label="清空搜索">${icon("close")}</button></div><div class="category-tabs" role="group" aria-label="知识分类">${["为你推荐", "训练调优", "算子开发", "模型推理"].map(c => `<button data-category="${c}" aria-pressed="${category === c}" class="${category === c ? "is-active" : ""}">${c}</button>`).join("")}</div><button class="task-context" data-route="task/${t.id}"><span class="context-icon tone-${t.tone}">${icon(t.icon)}</span><span><small>接着电脑端的思路</small><strong>${esc(t.title)}</strong></span><span class="context-end">${icon("chevron")}</span></button><div id="discovery-results">${discoveryResults()}</div></div>`;
}
function pills(values, selected, key, suffix = "") { return `<div class="widget-pills">${values.map(v => `<button data-widget="${key}" data-value="${v}" aria-pressed="${String(selected) === String(v)}" class="${String(selected) === String(v) ? "is-active" : ""}">${v}${suffix}</button>`).join("")}</div>`; }
function widget(k) {
  if (k.visual === "scaling") {
    const n = widgets.cards, rate = { 1: 100, 2: 188, 4: 332, 8: 544 }[n], efficiency = Math.round(rate / n);
    return `<div class="widget-label"><span>换个卡数，看收益怎样变化</span><span>示例数据</span></div>${pills([1, 2, 4, 8], n, "cards", " 卡")}<div class="throughput-chart"><div class="chart-row"><label>理想线性</label><div><i class="bar ideal" style="--bar:${n / 8 * 100}%"></i></div><b>${n}×</b></div><div class="chart-row"><label>示例加速</label><div><i class="bar actual" style="--bar:${rate / 800 * 100}%"></i></div><b>${(rate / 100).toFixed(2).replace(/\.00$/, "")}×</b></div></div><div class="widget-result"><span>扩展效率</span><strong>${efficiency}<small>%</small></strong></div><p class="widget-footnote">单卡吞吐 100，多卡吞吐 ${rate}，比较同一统计口径。</p>`;
  }
  if (k.visual === "batch") return `<div class="widget-label"><span>动手配一组训练设置</span>${icon("layers")}</div><div class="control-line"><label>每卡 Batch</label>${pills([2, 4, 8], widgets.batch, "batch")}</div><div class="control-line"><label>数据并行卡数</label>${pills([1, 2, 4, 8], widgets.devices, "devices")}</div><div class="control-line"><label>梯度累积步数</label>${pills([1, 2, 4], widgets.accumulation, "accumulation")}</div><div class="batch-equation"><span>${widgets.batch} × ${widgets.devices} × ${widgets.accumulation}</span><span>=</span><strong>${widgets.batch * widgets.devices * widgets.accumulation}</strong></div><p class="widget-footnote">一次参数更新所对应的有效样本数</p>`;
  if (k.visual === "sync") {
    const step = widgets.sync;
    return `<div class="widget-label"><span>${["① 各卡计算本地梯度", "② 聚合后，梯度保持一致", "③ 按一致梯度更新参数"][step]}</span><span>简化示意</span></div><div class="sync-demo ${step > 0 ? "is-synced" : ""}">${[2, 4, 6, 8].map((v, i) => `<div class="sync-device"><span>卡 ${i + 1}</span><b>${step > 0 ? "5" : v}</b><small>${step === 2 ? "更新参数" : "梯度 g"}</small></div>`).join("")}</div><div class="sync-caption">${["不同数据 → 不同的本地梯度", "平均梯度：(2 + 4 + 6 + 8) ÷ 4 = 5", "各副本保持一致的更新方向"][step]}</div><button class="widget-next" data-action="sync-next">${["看看梯度同步", "再看参数更新", "重新看一遍"][step]} ${icon("arrow")}</button>`;
  }
  if (k.visual === "precision") return `<div class="widget-label"><span>看看计算如何分工</span><span>原理示意</span></div><div class="widget-pills"><button data-widget="precision" data-value="full" aria-pressed="${widgets.precision === "full"}">FP32 示例</button><button data-widget="precision" data-value="mixed" aria-pressed="${widgets.precision === "mixed"}">混合精度示意</button></div><div class="precision-demo"><div><span>矩阵等运算</span><b class="${widgets.precision === "mixed" ? "low-precision" : ""}">${widgets.precision === "mixed" ? "低精度" : "FP32"}</b></div><span>+</span><div><span>敏感操作</span><b>FP32</b></div></div><p class="widget-footnote">具体运算精度由算子支持与框架策略决定。</p>`;
  if (k.visual === "parallel") {
    const data = widgets.parallel === "data";
    return `<div class="widget-label"><span>切换看看，分的是什么</span><span>两卡示意</span></div><div class="widget-pills"><button data-widget="parallel" data-value="data" aria-pressed="${data}">数据并行</button><button data-widget="parallel" data-value="model" aria-pressed="${!data}">模型并行</button></div><div class="parallel-demo">${[1, 2].map((v, i) => `<div><small>卡 ${v}</small><b>${data ? "完整模型" : `模型部分 ${v}`}</b><span>${data ? `数据分片 ${v}` : i ? "承接中间结果" : "输入数据"}</span></div>`).join(`<span>${data ? "⇄" : "→"}</span>`)}</div><p class="widget-footnote">${data ? "模型复制到各卡，训练数据分开处理。" : "模型切分到不同卡，按切分方案交换中间结果。"}</p>`;
  }
  if (k.visual === "tail") {
    const n = widgets.elements, blocks = Math.ceil(n / 32), tail = n % 32 || 32;
    return `<div class="widget-label"><span>固定块长 32，换个元素总数</span><span>范围演算</span></div>${pills([31, 32, 33, 65], n, "elements")}<div class="tail-demo">${Array.from({ length: blocks }, (_, i) => `<div><label>第 ${i + 1} 块</label><span class="tail-blocks">${Array.from({ length: 32 }, (_, j) => `<i class="${i * 32 + j < n ? "is-valid" : ""}"></i>`).join("")}</span><b>${i < blocks - 1 ? 32 : tail}</b></div>`).join("")}</div><div class="widget-result"><span>最后一块有效元素</span><strong>${tail}<small> / 32</small></strong></div>`;
  }
  const chw = widgets.layout === "chw";
  return `<div class="widget-label"><span>换一种布局，看看轴的顺序</span><span>H=2 · W=3 · C=3</span></div><div class="widget-pills"><button data-widget="layout" data-value="hwc" aria-pressed="${!chw}">HWC</button><button data-widget="layout" data-value="chw" aria-pressed="${chw}">CHW</button></div><div class="layout-demo">${(chw ? ["C", "H", "W"] : ["H", "W", "C"]).map(c => `<div class="axis axis-${c.toLowerCase()}"><strong>${c}</strong><span>${c === "H" ? "高度" : c === "W" ? "宽度" : "通道"}</span><b>${c === "H" ? 2 : 3}</b></div>`).join("")}</div><p class="widget-footnote">${chw ? "轴顺序 (2, 0, 1) → 形状 [3, 2, 3]" : "原始轴顺序 (0, 1, 2) → 形状 [2, 3, 3]"}</p>`;
}
function quiz(k) {
  const answer = state.answers[k.id], chosen = Number.isInteger(answer) ? answer : -1, passed = chosen === k.quiz.correct;
  return `<section class="quiz-section" aria-label="理解小题"><div class="section-title"><h2>用一道小题，确认一下</h2><span>${icon("spark")}</span></div><p class="quiz-question">${esc(k.quiz.question)}</p><div class="quiz-options">${k.quiz.options.map((option, i) => `<button data-answer="${i}" data-knowledge="${k.id}" aria-pressed="${chosen === i}" class="${chosen === i ? passed ? "is-correct" : "is-wrong" : ""}"><span class="answer-letter">${String.fromCharCode(65 + i)}</span><span>${esc(option)}</span>${chosen === i ? icon(passed ? "check" : "close") : ""}</button>`).join("")}</div>${chosen >= 0 ? `<p class="quiz-feedback ${passed ? "is-correct" : "is-wrong"}" role="status">${icon(passed ? "check" : "spark")}${esc(passed ? k.quiz.right : k.quiz.wrong)}</p>` : ""}</section>`;
}
function weeklyCards() {
  const cards = [];
  const add = (ids, signal, label) => {
    for (const id of ids.slice().reverse()) {
      if (cards.length >= 2 || cards.some(item => item.knowledge.id === id)) continue;
      const knowledge = knowledgeById(id);
      if (knowledge) cards.push({ knowledge, signal, label });
    }
  };
  add(state.interested, "interested", "你标记了感兴趣");
  add(state.unsure, "unsure", "你还没弄懂");
  add(activeTask().knowledge, "context", "关联当前任务");
  add(KNOWLEDGE.map(item => item.id), "context", "继续补一点基础");
  return cards;
}
function weeklyDigest() {
  const cards = weeklyCards();
  const signals = state.interested.length + state.unsure.length;
  const date = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", timeZone: "Asia/Shanghai" }).format(new Date());
  const topicLine = state.weeklyTopics.length ? state.weeklyTopics.join(" · ") : "昇腾开发";
  const feature = WEEKLY_FEATURES[state.weeklyTopics[0]] || WEEKLY_FEATURES["昇腾开发"];
  return `<div class="brief-page"><div class="page-greeting"><div class="eyebrow"><span class="tiny-star">✦</span> ${esc(topicLine)} · 手机读完，再回电脑继续</div><h1>每周开发速览</h1><p class="page-subtitle">本周 · ${esc(date)} · 示例期</p></div><article class="featured-brief"><div class="brief-kicker"><span>本周重点资讯</span><span class="sample-label">示例内容</span></div><span class="brief-category">${esc(feature.category)}</span><h2>${esc(feature.title)}</h2><p>${esc(feature.summary)}</p><ul>${feature.points.map(point => `<li>${esc(point)}</li>`).join("")}</ul><a class="brief-source" href="${esc(feature.source.url)}" target="_blank" rel="noopener">${icon("external")}${esc(feature.source.title)}${icon("chevron")}</a></article><section class="brief-recommendations"><div class="section-title"><div><h2>给你补两张知识卡</h2><p>${signals ? `结合 ${signals} 个兴趣或疑问标记` : `先接上「${esc(activeTask().title)}」这条任务`}</p></div><span class="brief-count">02</span></div><div class="brief-card-list">${cards.map(({ knowledge: k, label }) => `<button class="brief-card" data-route="${routeFor(k)}"><span class="brief-card-top"><span class="tone-dot tone-${k.tone}"></span>${esc(label)}<span>${k.minutes} 分钟</span></span><strong>${esc(k.title)}</strong><p>${esc(k.takeaway)}</p><span class="brief-card-open">打开知识卡 ${icon("arrow")}</span></button>`).join("")}</div></section><section class="weekly-settings-card"><div class="weekly-settings-copy"><span>${icon("clock")} 每周一条，轻松读完</span><strong>${state.weeklySubscribed ? `每周${esc(state.weeklyDay)} · ${esc(state.weeklyTime)} <small>演示订阅已开启</small>` : "订阅后，收到本周速览通知"}</strong><small>主题：${esc(topicLine)}</small></div><button class="primary-button" data-action="${state.weeklySubscribed ? "open-notification" : "open-weekly-settings"}">${state.weeklySubscribed ? "查看本周通知" : "设置每周推送"}${icon("arrow")}</button><button class="text-button weekly-manage" data-action="open-weekly-settings">${state.weeklySubscribed ? "管理主题与时间" : "选主题与时间"}${icon("chevron")}</button></section><p class="prototype-note">交互流程为本地演示；真实周期推送需符合小程序类目并申请可用的长期订阅模板。</p></div>`;
}
function detail(k) {
  const related = activeTask().knowledge.includes(k.id) ? activeTask() : TASKS.find(t => t.knowledge.includes(k.id));
  const follow = related.knowledge.map(knowledgeById).filter(x => x && x.id !== k.id).slice(0, 2);
  const interested = state.interested.includes(k.id), unsure = state.unsure.includes(k.id);
  return `<article class="detail-page tone-${k.tone}"><div class="detail-meta"><span class="category-dot"></span>${esc(k.category)}<span>·</span>${k.minutes} 分钟${state.learned.includes(k.id) ? `<span class="learned-badge">${icon("check")} 已理解</span>` : ""}</div><h1>${esc(k.title)}</h1><p class="detail-intro">${esc(k.intro)}</p><section class="signal-panel"><div><strong>让每周速览更懂你</strong><span>标记想继续关注，或还想再看懂的地方。</span></div><div class="signal-actions"><button data-action="toggle-signal" data-signal="interested" data-id="${k.id}" aria-pressed="${interested}" class="${interested ? "is-active" : ""}">${icon("spark")}感兴趣</button><button data-action="toggle-signal" data-signal="unsure" data-id="${k.id}" aria-pressed="${unsure}" class="${unsure ? "is-active" : ""}">${icon("help")}还没弄懂</button></div></section><section class="interactive-widget" id="interactive-widget" aria-label="${esc(k.short)}互动图解">${widget(k)}</section><section class="takeaway"><span>记住这一点</span><p>${esc(k.takeaway)}</p></section><p class="detail-explanation">${esc(k.explanation)}</p><section class="connection"><div>${icon("layers")}<span>放回你的任务里</span></div><h2>${esc(related.title)}</h2><p>${esc(k.connection)}</p><button class="text-button" data-route="task/${related.id}">看看相关任务 ${icon("arrow")}</button></section><div id="quiz">${quiz(k)}</div><a class="source-link" href="${esc(k.source.url)}" target="_blank" rel="noopener"><span>${icon("external")}延伸阅读</span><strong>${esc(k.source.title)}</strong>${icon("chevron")}</a>${follow.length ? `<div class="section-title"><h2>下一点新知</h2></div><div class="knowledge-list">${follow.map(x => card(x, "list")).join("")}</div>` : ""}<p class="list-end">理解一点，离目标更近一点。</p></article>`;
}
function empty(title, copy, button, action = "home") { return `<div class="empty-state"><span class="empty-icon">${icon("pocket")}</span><h2>${title}</h2><p>${copy}</p><button class="secondary-button" data-action="${action}">${button}${icon("arrow")}</button></div>`; }
function tasksPage() {
  return `<div class="tasks-page"><div class="page-greeting"><div class="eyebrow">让新知有处可用</div><h1>继续学习</h1><p class="page-subtitle">手机上理解一点，回到电脑继续探索。</p></div><div class="task-list">${TASKS.map(t => { const learned = t.knowledge.filter(id => state.learned.includes(id)).length, notes = state.notes.filter(n => n.taskId === t.id).length; return `<button class="task-card" data-route="task/${t.id}"><div class="task-card-top"><span class="task-type-icon tone-${t.tone}">${icon(t.icon)}</span><span>${esc(t.category)}</span>${state.activeTask === t.id ? '<span class="current-task">当前思路</span>' : ""}</div><h2>${esc(t.title)}</h2><p>${esc(t.description)}</p><div class="task-progress"><i style="--progress:${learned / t.knowledge.length * 100}%"></i></div><div class="task-card-foot"><span>${learned} / ${t.knowledge.length} 个知识点已理解${notes ? ` · ${notes} 条小结` : ""}</span>${icon("arrow")}</div></button>`; }).join("")}</div><p class="list-end">示例任务 · 点击可切换推荐方向</p></div>`;
}
function noteCard(n) { const t = taskById(n.taskId); return `<article class="note-card"><div>${icon("note")}<span>${esc(t.title)}</span><time>${esc(n.date || "刚刚")}</time></div><p>${esc(n.text)}</p><button class="text-button" data-route="task/${t.id}">回到任务 ${icon("arrow")}</button></article>`; }
function taskDetail(t) {
  const notes = state.notes.filter(n => n.taskId === t.id).slice().reverse();
  const learned = t.knowledge.filter(id => state.learned.includes(id)).length;
  return `<div class="task-detail"><div class="task-type-icon tone-${t.tone}">${icon(t.icon)}</div><div class="eyebrow">${esc(t.category)}</div><h1>${esc(t.title)}</h1><p class="page-subtitle">${esc(t.description)}</p><div class="task-summary"><div><strong>${learned}<small> / ${t.knowledge.length}</small></strong><span>知识点已理解</span></div><i></i><div><strong>${notes.length}</strong><span>条任务小结</span></div></div><button class="secondary-button task-recommend" data-action="use-task" data-id="${t.id}">${icon("spark")}${state.activeTask === t.id ? "围绕这个任务发现知识" : "按这个任务推荐知识"}${icon("arrow")}</button><div class="section-title"><h2>补一点相关知识</h2></div><div class="task-knowledge-list">${t.knowledge.map((id, i) => { const k = knowledgeById(id); return `<button class="task-knowledge" data-route="knowledge/${k.id}"><span class="step-index ${state.learned.includes(id) ? "is-done" : ""}">${state.learned.includes(id) ? icon("check") : String(i + 1).padStart(2, "0")}</span><span><strong>${esc(k.title)}</strong><small>${k.minutes} 分钟 · ${state.learned.includes(id) ? "已理解" : "图解与小题"}</small></span>${icon("chevron")}</button>`; }).join("")}</div><div class="section-title"><h2>带回任务的小结</h2><button class="text-button" data-action="new-note" data-id="${t.id}">写一点 ${icon("note")}</button></div>${notes.length ? notes.map(noteCard).join("") : `<div class="note-empty">看懂一个概念后，点「加入任务小结」。<br>把理解和想继续问的问题，留在这里。</div>`}<button class="primary-button desktop-continue" data-action="handoff" data-id="${t.id}">${icon("desktop")}在电脑端继续${icon("arrow")}</button></div>`;
}
function mine(tab) {
  const selected = ["saved", "learned", "notes"].includes(tab) ? tab : "saved";
  const ids = selected === "saved" ? state.saved : state.learned;
  return `<div class="mine-page"><div class="page-greeting"><div class="eyebrow">一点一点，装进口袋</div><h1>我的知识口袋</h1></div><div class="pocket-stats"><button data-route="mine/saved"><strong>${state.saved.length}</strong><span>已收藏</span></button><button data-route="mine/learned"><strong>${state.learned.length}</strong><span>已理解</span></button><button data-route="mine/notes"><strong>${state.notes.length}</strong><span>任务小结</span></button></div><div class="mine-tabs" role="group" aria-label="我的知识内容">${[["saved", "收藏"], ["learned", "已理解"], ["notes", "任务小结"]].map(([id, label]) => `<button data-route="mine/${id}" aria-pressed="${selected === id}">${label}</button>`).join("")}</div>${selected === "notes" ? state.notes.length ? state.notes.slice().reverse().map(noteCard).join("") : empty("让理解留下一点痕迹", "知识卡里的理解，可以存成任务小结。下次回来，接着这条思路。", "去发现一点新知") : ids.length ? `<div class="knowledge-list">${ids.slice().reverse().map(knowledgeById).filter(Boolean).map(k => card(k, "list")).join("")}</div>` : empty(selected === "saved" ? "把想再看的，装进口袋" : "下一个懂了的概念，就在前面", selected === "saved" ? "点知识卡上的收藏，下次从这里继续。" : "试着答对一道理解小题，留下你的学习进展。", "去发现一点新知")}<button class="about-link" data-action="about">关于这个小程序 Demo ${icon("chevron")}</button></div>`;
}
function render() {
  closeOverlay(false);
  let route; try { route = decodeURIComponent(location.hash.slice(1) || "discover"); } catch { route = "discover"; }
  const [page, id] = route.split("/");
  const k = page === "knowledge" ? knowledgeById(id) : null;
  const valid = page === "discover" || page === "briefing" || page === "tasks" || page === "mine" || (page === "task" && TASKS.some(t => t.id === id)) || Boolean(k);
  if (!valid) { go("discover"); return; }
  if (page === "knowledge" && !currentRoute.startsWith("knowledge/")) returnRoute = currentRoute || "discover";
  currentRoute = route;
  const nested = page === "knowledge" || page === "task";
  const pageName = page === "knowledge" ? "知识卡" : page === "task" ? "任务" : page === "briefing" ? "每周速览" : "";
  $("#app-header").innerHTML = `<div class="header-title">${nested ? `<button class="icon-button" data-route="${page === "knowledge" ? esc(returnRoute) : "tasks"}" aria-label="返回">${icon("back")}</button><span>${pageName}</span>` : `<img src="./mark.svg" width="22" height="22" alt=""><span>Ascend Studio</span>`}</div><div class="mini-capsule"><button data-action="more" aria-label="更多选项">${icon("more")}</button><i></i><button data-route="discover" aria-label="回到发现首页">${icon("home")}</button></div>`;
  $("#screen").innerHTML = page === "discover" ? discover() : page === "briefing" ? weeklyDigest() : k ? detail(k) : page === "tasks" ? tasksPage() : page === "task" ? taskDetail(taskById(id)) : mine(id);
  $("#screen").scrollTop = 0;
  $("#device").classList.toggle("is-detail", Boolean(k));
  $("#detail-action").innerHTML = k ? `<div class="detail-action"><button class="save-button ${state.saved.includes(k.id) ? "is-saved" : ""}" data-action="save" data-id="${k.id}" aria-pressed="${state.saved.includes(k.id)}" aria-label="${state.saved.includes(k.id) ? "取消收藏" : "收藏知识点"}">${icon("bookmark")}<span>${state.saved.includes(k.id) ? "已收藏" : "收藏"}</span></button><button class="primary-button" data-action="add-note" data-id="${k.id}">${icon("note")}加入任务小结${icon("arrow")}</button></div>` : "";
  const selectedTab = page === "task" || page === "tasks" ? "tasks" : page === "mine" ? "mine" : page === "briefing" ? "briefing" : "discover";
  $("#tab-bar").hidden = Boolean(k);
  $("#tab-bar").innerHTML = [["discover", "compass", "发现"], ["briefing", "spark", "速览"], ["tasks", "layers", "任务"], ["mine/saved", "pocket", "我的"]].map(([path, name, label]) => `<button data-route="${path}" ${selectedTab === path.split("/")[0] ? 'aria-current="page"' : ""}>${icon(name)}<span>${label}</span>${selectedTab === path.split("/")[0] ? '<i class="tab-dot"></i>' : ""}</button>`).join("");
}
function openOverlay(title, body, kind = "") {
  overlayReturnFocus = document.activeElement;
  $("#overlay").innerHTML = `<div class="overlay-backdrop" data-action="close-overlay"></div><section class="bottom-sheet ${kind}" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="sheet-handle"></div><div class="sheet-heading"><h2 id="sheet-title">${title}</h2><button class="icon-button" data-action="close-overlay" aria-label="关闭弹窗">${icon("close")}</button></div>${body}</section>`;
  $("#overlay").classList.add("is-open");
  $("#screen").inert = true; $("#app-header").inert = true; $("#tab-bar").inert = true; $("#detail-action").inert = true;
  $("#overlay").querySelector("input, textarea, button, a")?.focus({ preventScroll: true });
}
function closeOverlay(restore = true) {
  if (!$("#overlay").classList.contains("is-open")) return;
  $("#overlay").classList.remove("is-open"); $("#overlay").innerHTML = "";
  for (const id of ["#screen", "#app-header", "#tab-bar", "#detail-action"]) $(id).inert = false;
  if (restore && overlayReturnFocus?.isConnected) overlayReturnFocus.focus({ preventScroll: true });
}
function openWeeklySettings() {
  const topics = WEEKLY_TOPICS.map(topic => `<button class="topic-option ${state.weeklyTopics.includes(topic) ? "is-active" : ""}" data-action="toggle-weekly-topic" data-topic="${esc(topic)}" aria-pressed="${state.weeklyTopics.includes(topic)}">${state.weeklyTopics.includes(topic) ? icon("check") : ""}${esc(topic)}</button>`).join("");
  const days = WEEKLY_DAY_OPTIONS.map(day => `<button class="schedule-option ${state.weeklyDay === day ? "is-active" : ""}" data-action="set-weekly-day" data-day="${day}" aria-pressed="${state.weeklyDay === day}">${day}</button>`).join("");
  const times = ["09:00", "19:00"].map(time => `<button class="schedule-option ${state.weeklyTime === time ? "is-active" : ""}" data-action="set-weekly-time" data-time="${time}" aria-pressed="${state.weeklyTime === time}">${time === "09:00" ? "早上" : "晚上"} ${time}</button>`).join("");
  openOverlay("设置每周开发速览", `<p class="sheet-hint settings-intro">每周一条重点资讯，再按你标记的兴趣或疑问补两张短知识卡。</p><span class="field-label">想看哪些主题</span><div class="topic-options">${topics}</div><span class="field-label">每周什么时候</span><div class="schedule-options">${days}</div><div class="schedule-options">${times}</div><div class="authorization-preview"><span>${icon("pocket")}微信订阅消息</span><p>下一步会模拟微信授权弹窗。允许后，展示一条服务通知并打开本周速览。</p></div><p class="platform-note">真实周期推送需小程序类目符合要求，并有可用的长期订阅模板。</p><button class="primary-button" data-action="accept-weekly">${state.weeklySubscribed ? "保存设置并预览通知" : "允许并预览通知"}${icon("arrow")}</button>${state.weeklySubscribed ? '<button class="text-button settings-cancel" data-action="cancel-weekly">关闭演示订阅</button>' : '<button class="text-button settings-cancel" data-action="reject-weekly">暂不订阅</button>'}`);
}
function openWeeklyNotification() {
  openOverlay("微信服务通知 · 演示", `<article class="wechat-notification"><div class="notice-source"><img src="./mark.svg" alt=""><strong>Ascend Studio</strong><time>刚刚</time></div><div class="notice-content"><strong>本周开发速览到了</strong><p>一条昇腾开发重点，再加两张按你关注或疑问整理的知识卡。</p></div><button class="primary-button" data-action="open-briefing">打开本周速览${icon("arrow")}</button></article><p class="platform-note">此处模拟微信服务通知的点击回流；未连接微信后台。</p>`);
}
function openNote(k, t = activeTask()) {
  if (k && !t.knowledge.includes(k.id)) t = TASKS.find(x => x.knowledge.includes(k.id)) || t;
  const text = k ? `${k.takeaway}\n\n接下来：${k.connection}` : "";
  openOverlay("把理解，带回任务", `<form id="note-form"><label class="field-label" for="note-task">关联任务</label><select id="note-task" name="taskId">${TASKS.map(x => `<option value="${x.id}" ${x.id === t.id ? "selected" : ""}>${esc(x.title)}</option>`).join("")}</select>${k ? `<div class="note-knowledge-ref">${icon("bookmark")}<span>${esc(k.title)}</span></div>` : ""}<label class="field-label" for="note-text">我的理解与下一步</label><textarea id="note-text" name="text" rows="6" maxlength="2000" required placeholder="留一点理解，或记下想继续问的问题……">${esc(text)}</textarea><input type="hidden" name="knowledgeId" value="${k?.id || ""}"><p class="sheet-hint">保存后，可从「任务」或「我的」继续查看。</p><button type="submit" class="primary-button">${icon("check")}保存到任务</button></form>`);
}
function handoff(t) {
  const notes = state.notes.filter(n => n.taskId === t.id);
  const learned = t.knowledge.filter(id => state.learned.includes(id)).map(knowledgeById);
  const text = `${t.question}${learned.length ? `\n\n我已理解：\n${learned.map(k => `- ${k.takeaway}`).join("\n")}` : ""}${notes.length ? `\n\n我的学习小结：\n${notes.map(n => n.text).join("\n\n")}` : ""}`;
  openOverlay("回到电脑，接着这个思路", `<div class="handoff-visual">${icon("pocket")}<span>···········</span>${icon("desktop")}</div><p class="handoff-copy">复制这份任务小结，在电脑端粘贴继续。<br>也可以先改成你想问的问题。</p><label class="field-label" for="handoff-text">${esc(t.title)}</label><textarea id="handoff-text" rows="7" maxlength="8000">${esc(text)}</textarea><button class="primary-button" data-action="copy-handoff">${icon("copy")}复制小结与问题</button><a class="secondary-button full-width" href="${DESKTOP_URL}" target="_blank" rel="noopener">打开 Ascend Studio ${icon("external")}</a>`);
}
async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const input = document.createElement("textarea"); input.value = text; input.style.cssText = "position:fixed;left:-9999px;top:0"; document.body.append(input); input.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch { /* Manual selection remains available. */ } input.remove(); return ok;
  }
}
document.addEventListener("click", async event => {
  const button = event.target.closest("[data-route], [data-action], [data-category], [data-widget], [data-answer]");
  if (!button) return;
  if (button.dataset.route) { go(button.dataset.route); return; }
  if (button.dataset.category) { category = button.dataset.category; group = 0; const scroll = $("#screen").scrollTop; render(); $("#screen").scrollTop = scroll; return; }
  if (button.dataset.widget) {
    const key = button.dataset.widget, value = button.dataset.value;
    widgets[key] = ["precision", "parallel", "layout"].includes(key) ? value : Number(value);
    const k = knowledgeById(currentRoute.split("/")[1]); if (k) { $("#interactive-widget").innerHTML = widget(k); $("#interactive-widget").querySelector(`[data-widget="${key}"][data-value="${value}"]`)?.focus({ preventScroll: true }); } return;
  }
  if (button.dataset.answer !== undefined) {
    const k = knowledgeById(button.dataset.knowledge), answer = Number(button.dataset.answer);
    state.answers[k.id] = answer;
    if (answer === k.quiz.correct && !state.learned.includes(k.id)) { state.learned.push(k.id); toast("懂了一个新概念，已记入学习进展"); }
    persist();
    if (answer === k.quiz.correct && !$(".learned-badge")) $(".detail-meta").insertAdjacentHTML("beforeend", `<span class="learned-badge">${icon("check")} 已理解</span>`);
    $("#quiz").innerHTML = quiz(k); $("#quiz").querySelector(`[data-answer="${answer}"]`)?.focus({ preventScroll: true }); return;
  }
  const action = button.dataset.action, id = button.dataset.id;
  if (action === "home") go("discover");
  else if (action === "toggle-signal") {
    const signal = button.dataset.signal === "unsure" ? "unsure" : "interested", list = state[signal], index = list.indexOf(id);
    if (index >= 0) list.splice(index, 1); else list.push(id);
    persist(); const active = list.includes(id); button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active));
    button.innerHTML = `${icon(signal === "interested" ? "spark" : "help")}${signal === "interested" ? "感兴趣" : "还没弄懂"}`;
    toast(active ? (signal === "interested" ? "已加入每周速览的关注信号" : "已加入每周速览的疑问信号") : "已移除这个推荐信号");
  }
  else if (action === "open-weekly-settings") openWeeklySettings();
  else if (action === "toggle-weekly-topic") {
    const topic = button.dataset.topic, index = state.weeklyTopics.indexOf(topic);
    if (index >= 0 && state.weeklyTopics.length === 1) { toast("至少保留一个关注主题"); return; }
    if (index >= 0) state.weeklyTopics.splice(index, 1); else if (WEEKLY_TOPICS.includes(topic)) state.weeklyTopics.push(topic);
    persist(); closeOverlay(false); openWeeklySettings();
  }
  else if (action === "set-weekly-day") { state.weeklyDay = WEEKLY_DAY_OPTIONS.includes(button.dataset.day) ? button.dataset.day : "周一"; persist(); closeOverlay(false); openWeeklySettings(); }
  else if (action === "set-weekly-time") { state.weeklyTime = ["09:00", "19:00"].includes(button.dataset.time) ? button.dataset.time : "09:00"; persist(); closeOverlay(false); openWeeklySettings(); }
  else if (action === "accept-weekly") { state.weeklySubscribed = true; persist(); closeOverlay(false); openWeeklyNotification(); }
  else if (action === "cancel-weekly") { state.weeklySubscribed = false; persist(); closeOverlay(); render(); toast("已关闭本地演示订阅"); }
  else if (action === "reject-weekly") { closeOverlay(); toast("速览仍可随时打开"); }
  else if (action === "open-notification") openWeeklyNotification();
  else if (action === "open-briefing") { closeOverlay(false); go("briefing"); }
  else if (action === "clear-search") { query = ""; if ($("#knowledge-search")) { $("#knowledge-search").value = ""; $(".clear-search").classList.add("is-hidden"); $("#discovery-results").innerHTML = discoveryResults(); $("#knowledge-search").focus(); } }
  else if (action === "shuffle") { group++; $("#discovery-results").innerHTML = discoveryResults(); toast("换了一组关联知识点"); }
  else if (action === "sync-next") { widgets.sync = (widgets.sync + 1) % 3; $("#interactive-widget").innerHTML = widget(knowledgeById("sync")); $(".widget-next").focus({ preventScroll: true }); }
  else if (action === "save") {
    const index = state.saved.indexOf(id); if (index >= 0) state.saved.splice(index, 1); else state.saved.push(id); persist();
    const saved = state.saved.includes(id); button.classList.toggle("is-saved", saved); button.setAttribute("aria-pressed", String(saved)); button.setAttribute("aria-label", saved ? "取消收藏" : "收藏知识点"); button.innerHTML = `${icon("bookmark")}<span>${saved ? "已收藏" : "收藏"}</span>`; toast(saved ? "已装进口袋，下次从「我的」继续" : "已取消收藏");
  }
  else if (action === "add-note") openNote(knowledgeById(id));
  else if (action === "new-note") openNote(null, taskById(id));
  else if (action === "close-overlay") closeOverlay();
  else if (action === "use-task") { state.activeTask = id; category = "为你推荐"; query = ""; group = 0; persist(); go("discover"); toast(`围绕「${taskById(id).title}」发现新知`); }
  else if (action === "handoff") handoff(taskById(id));
  else if (action === "copy-handoff") { const ok = await copy($("#handoff-text").value); if (ok) { button.innerHTML = `${icon("check")}已复制，在电脑端粘贴继续`; toast("任务小结已复制"); } else { $("#handoff-text").select(); toast("请长按或按 Ctrl / ⌘ + C 复制选中的小结"); } }
  else if (action === "more") openOverlay("随手学一点", `<div class="menu-options"><button data-action="about">${icon("spark")}关于口袋新知${icon("chevron")}</button><button data-action="share">${icon("copy")}复制当前知识卡链接${icon("chevron")}</button><a href="${DESKTOP_URL}" target="_blank" rel="noopener">${icon("desktop")}打开电脑端 Demo${icon("external")}</a></div>`);
  else if (action === "share") { const url = location.href; const ok = await copy(url); closeOverlay(); if (ok) toast("链接已复制，手机打开也可以继续看"); else openOverlay("分享这点新知", `<p class="sheet-hint">长按或选中下方链接复制。</p><textarea rows="3" readonly aria-label="分享链接">${esc(url)}</textarea>`); }
  else if (action === "about") openOverlay("Ascend Studio · 口袋新知", `<div class="about-mark"><img src="./mark.svg" alt="" width="48" height="48"></div><p class="about-copy">把下一点新知，接上你的思路。</p><p class="sheet-hint">这是小程序交互 Demo，使用示例任务与知识卡展示推荐、图解、理解小题和任务接续。收藏与学习记录保存在当前浏览器；电脑端接续通过复制小结完成。</p><p class="sheet-hint">知识卡中的吞吐、梯度等数值是原理示例。延伸阅读可打开相应公开资料。</p><button class="primary-button" data-action="close-overlay">继续探索 ${icon("arrow")}</button>`);
});
document.addEventListener("input", event => {
  if (event.target.id === "knowledge-search") { query = event.target.value; group = 0; $(".clear-search").classList.toggle("is-hidden", !query); $("#discovery-results").innerHTML = discoveryResults(); }
});
document.addEventListener("submit", event => {
  if (event.target.id !== "note-form") return;
  event.preventDefault(); const form = new FormData(event.target), text = String(form.get("text") || "").trim(), taskId = form.get("taskId");
  if (!text || !TASKS.some(t => t.id === taskId)) { toast("先留一点理解，再保存"); return; }
  const knowledgeId = String(form.get("knowledgeId") || "");
  state.notes.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, taskId, knowledgeId: validId(knowledgeId) ? knowledgeId : null, text, date: new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", timeZone: "Asia/Shanghai" }).format(new Date()) });
  state.notes = state.notes.slice(-100); persist(); closeOverlay(false); go(`task/${taskId}`); toast("小结已保存，接着你的任务继续");
});
document.addEventListener("keydown", event => {
  if (!$("#overlay").classList.contains("is-open")) return;
  if (event.key === "Escape") { closeOverlay(); return; }
  if (event.key === "Tab") {
    const items = [...$("#overlay").querySelectorAll('button, a[href], input:not([type="hidden"]), textarea, select')].filter(el => !el.disabled);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
});
window.addEventListener("hashchange", render);
render();
