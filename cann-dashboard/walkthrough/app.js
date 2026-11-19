const CONFIG = {
  demoUrl: "../算子知识工作台.html",
  mobileUrl: "",
  readySelector: "#nodes .node",
  chapterParam: "chapter",
  pointParam: "pointIndex",
  revParam: "",
  rev: "",
  maxAttempts: 26,
  retryDelay: 160,
  closing: false,
};

const chapters = [
  {
    id: "locate",
    title: "把一条报错读到能动手",
    summary: "从搜索定位知识点，在节点卡里拿到结论与误区，再回到原文与对话轴上核对上下文。",
    art: "./assets/chapter-1.png", artAlt: "搜索 OOM 时的图谱：命中节点亮起，其余压暗",
    points: [
      { id: "search", title: "搜索点亮而不是筛掉", note: "搜索时全图不散，只把无关节点压暗，位置感还在。",
        emphasis: "只把无关节点压暗", stage: "search", query: { q: "OOM" } },
      { id: "verdict", title: "先给结论再给原文", note: "点开节点先给结论和误区，原文紧接其后。",
        emphasis: "先给结论", stage: "node", query: { node: "n13" } },
      { id: "scope", title: "下拉只列来源对话", note: "对话下拉只列真正提到它的那几段。",
        emphasis: "真正提到它的那几段", stage: "node", query: { node: "n33" } },
      { id: "timeline", title: "按轮回看知识到齐", note: "拖动时间轴，知识点按轮次逐个到齐。",
        emphasis: "按轮次逐个到齐", stage: "tl", query: { tl: "60" } },
    ],
  },
  {
    id: "organize",
    title: "把 74 个点排成一张能读的图",
    summary: "用内置名字的胶囊、四档填充、父子虚线和项目切换，让密集的知识点有层次可循。",
    art: "./assets/chapter-2.png", artAlt: "74 个知识点排成的知识图谱全景",
    points: [
      { id: "capsule", title: "名字写在节点里", note: "名字直接写在节点里，不再挂一圈外部标签。",
        emphasis: "写在节点里", stage: "none", query: {} },
      { id: "weight", title: "权重靠填充区分", note: "权重越高填充越实，核心节点一眼可辨。",
        emphasis: "填充越实", stage: "none", query: {} },
      { id: "parent", title: "原子挂在父级下", note: "原子节点用细虚线挂在父级下，没有孤点。",
        emphasis: "细虚线", stage: "none", query: {} },
      { id: "project", title: "项目切换改变图的范围", note: "切换项目只换一批对话，图随之收窄。",
        emphasis: "只换一批对话", stage: "scene", query: { scene: "s4" } },
    ],
  },
  {
    id: "produce",
    title: "让结论可以带走",
    summary: "把几个知识点串成路径，生成带出处与误区的剧本，导出成可以发给同事的 Markdown。",
    art: "./assets/chapter-3.png", artAlt: "三条路径展开成右侧的排查剧本",
    points: [
      { id: "path", title: "把点串成路径", note: "按 Shift 连续点选，几个节点串成一条路径。",
        emphasis: "串成一条路径", stage: "path", query: { path: "n13,n16,n25" } },
      { id: "playbook", title: "路径长成剧本", note: "路径展开成剧本，每步带结论、误区与出处。",
        emphasis: "剧本", stage: "playbook", query: { path: "n13,n16,n25", playbook: "1" } },
      { id: "export", title: "导出给同事", note: "剧本可导出为 Markdown，直接发给同事。",
        emphasis: "导出为 Markdown", stage: "playbook", query: { path: "n13,n16,n25", playbook: "1" } },
      { id: "entry", title: "入口不藏在快捷键里", note: "不按快捷键也能从左侧找到建立排查剧本的入口。",
        emphasis: "建立排查剧本", stage: "none", query: {} },
    ],
  },
];

const CLOSING = { kicker: "整体体验反馈", title: "", voices: [] };

/* ============================================================
   以下为引擎，通常不需要改
   ============================================================ */

const $ = selector => document.querySelector(selector);
const showcase = $("#showcase");
const frame = $("#demo-frame");
const designNote = $("#design-note");
const noteCard = $("#note-card");

let currentChapter = 0;
let currentPoint = 0;
let activePoint = null;
let menuOpen = false;
let revision = 0;                 // 连续翻点时，让旧的一次进入过程自杀
let loadedFrameHref = "";
let noteDrag = null;

const pad = value => String(value).padStart(2, "0");
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

/* ---------- 在界面里模拟点击的小工具 ---------- */

function isVisible(element) {
  return Boolean(element && element.getClientRects().length && !element.closest("[hidden]"));
}

/** 按文案找可见元素：界面没有稳定选择器时更耐用。 */
function visibleButton(doc, selector, text) {
  return [...doc.querySelectorAll(selector)].find(node =>
    isVisible(node) && (!text || node.textContent.replace(/\s+/g, " ").trim().includes(text))) || null;
}

/** 幂等点击：已经满足条件就不点。 */
function clickIf(doc, selector, already) {
  const node = doc.querySelector(selector);
  if (node && !(already && already(node))) node.click();
  return node;
}

/** 演示页里的焦点圈会出现在截图里，注入一次去掉。 */
function suppressFocusRing(doc) {
  if (!doc?.head || doc.getElementById("walkthrough-focus-ring")) return;
  const style = doc.createElement("style");
  style.id = "walkthrough-focus-ring";
  style.textContent = ":focus-visible { outline: none !important; }";
  doc.head.append(style);
}

function frameDoc() {
  try { return frame.contentDocument; } catch { return null; }   // 跨域时为 null
}

/* ============================================================
   状态入口：每个函数返回 true = 已达成，false = 再调我一次
   下面几个是示例，换成你自己的界面步骤
   ============================================================ */

const STAGES = {
  none: () => true,
  search(doc) { return doc.querySelector("#q").value.trim().length > 0; },
  node(doc) { return doc.querySelector("#drawer").classList.contains("open"); },
  tl(doc) { const r = doc.querySelector("#tlRange"); return Boolean(r) && r.value !== "173"; },
  scene(doc) { return [...doc.querySelectorAll("#scenes button.on")].some(b => b.dataset.id !== "all"); },
  path(doc) { const b = doc.querySelector("#pathbar"); return Boolean(b) && !b.hidden; },
  playbook(doc) { const p = doc.querySelector("#playbook"); return Boolean(p) && !p.hidden; },
};

function stepOf(point) {
  if (typeof point.enter === "function") return point.enter;   // 也可以直接写函数
  if (point.stage && STAGES[point.stage]) return STAGES[point.stage];
  return STAGES.none;
}

/* ---------- 地址 ---------- */

function updateAddress(view) {
  const url = new URL(location.href);
  if (CONFIG.revParam && CONFIG.rev) url.searchParams.set(CONFIG.revParam, CONFIG.rev);
  url.searchParams.set(CONFIG.chapterParam, String(currentChapter + 1));
  url.searchParams.set(CONFIG.pointParam, String(currentPoint));
  url.hash =
    view === "closing" ? "closing"
    : view === "cover" ? `chapter-${currentChapter + 1}`
    : `chapter-${currentChapter + 1}-${activePoint.id}`;
  history.replaceState(null, "", url);
}

/* ---------- 封面 ---------- */

function renderVoices(chapter) {
  const host = $("#cover-voices");
  host.replaceChildren();
  for (const voice of chapter.voices || []) {
    const item = document.createElement("figure");
    item.className = "cover-voice";
    const quote = document.createElement("blockquote");
    quote.textContent = `“${voice.quote}”`;
    const source = document.createElement("figcaption");
    source.textContent = voice.source;
    item.append(quote, source);
    host.append(item);
  }
  host.hidden = host.childElementCount === 0;
}

function renderArt(chapter) {
  const stage = $("#cover-art-stage");
  const image = $("#cover-art");
  if (!chapter.art) { stage.hidden = true; image.removeAttribute("src"); return; }
  stage.hidden = false;
  image.src = chapter.art;
  image.alt = chapter.artAlt || "";
}

function buildCover() {
  const chapter = chapters[currentChapter];
  $("#cover-kicker").textContent = `用户旅程 · 章节 ${pad(currentChapter + 1)} / ${pad(chapters.length)}`;
  $("#cover-number").textContent = pad(currentChapter + 1);
  $("#cover-title").textContent = chapter.title;
  $("#cover-description").textContent = chapter.summary;
  renderVoices(chapter);
  renderArt(chapter);
  $("#cover-enter").textContent = currentChapter === chapters.length - 1 ? "进入最后章节" : "进入本章";

  showcase.dataset.view = "cover";
  showcase.classList.remove("is-mobile");
  $("#mobile-return").hidden = true;
  designNote.hidden = true;
  $("#chapter-menu").hidden = !menuOpen;
  updateAddress("cover");
}

/* ---------- 目录 ---------- */

function renderPointMenu() {
  const closingItem = CONFIG.closing
    ? `<button class="menu-point menu-closing-item ${showcase.dataset.view === "closing" ? "is-current" : ""}" type="button" data-closing><span>✦</span><span>${escapeHTML(CLOSING.kicker)}</span></button>`
    : "";
  $("#menu-content").innerHTML = chapters.map((chapter, chapterIndex) => `
    <section class="menu-chapter">
      <button class="menu-chapter-title" type="button" data-chapter-cover="${chapterIndex}">
        <span>${pad(chapterIndex + 1)}</span><span>${escapeHTML(chapter.title)}</span>
      </button>
      ${chapter.points.map((point, pointIndex) => `
        <button class="menu-point ${chapterIndex === currentChapter && pointIndex === currentPoint ? "is-current" : ""}"
                type="button" data-point="${chapterIndex}:${pointIndex}">
          <span>${chapterIndex + 1}.${pointIndex + 1}</span>
          <span>${escapeHTML(point.title)}</span>
        </button>`).join("")}
    </section>`).join("") + closingItem;
  $("#chapter-menu").hidden = !menuOpen;
}

/* ---------- 批注条 ---------- */

function renderNote() {
  const host = $("#note-text");
  const { note = "", emphasis = "" } = activePoint;
  const at = emphasis ? note.indexOf(emphasis) : -1;

  if (at < 0) {
    // emphasis 不在 note 里就老实输出整句，不要猜
    host.textContent = note;
  } else {
    const strong = document.createElement("strong");
    strong.textContent = emphasis;
    host.replaceChildren(
      document.createTextNode(note.slice(0, at)),
      strong,
      document.createTextNode(note.slice(at + emphasis.length)),
    );
  }

  const prevLabel = currentPoint === 0 ? "返回本章封面" : "上一个设计点";
  $("#note-prev").setAttribute("aria-label", prevLabel);
  $("#note-prev").title = prevLabel;
  const nextLabel =
    currentPoint < chapters[currentChapter].points.length - 1 ? "下一个设计点"
    : currentChapter < chapters.length - 1 ? "进入下一章封面"
    : CONFIG.closing ? "查看整体反馈" : "回到第一章封面";
  $("#note-next").setAttribute("aria-label", nextLabel);
  $("#note-next").title = nextLabel;
}

/* ---------- 驱动界面到状态 ---------- */

function isMobilePoint(point) {
  return Boolean(point.mobile) && Boolean(CONFIG.mobileUrl);
}

function targetUrl(point) {
  const base = new URL(isMobilePoint(point) ? CONFIG.mobileUrl : CONFIG.demoUrl, location.href);
  if (isMobilePoint(point)) {
    base.search = "";
    base.hash = point.hash || "";
    return base.href;
  }
  if (CONFIG.revParam && CONFIG.rev) base.searchParams.set(CONFIG.revParam, CONFIG.rev);
  Object.entries(point.query || {}).forEach(([key, value]) => base.searchParams.set(key, value));
  base.hash = point.hash || "";
  return base.href;
}

function applyPoint(point, attempt = 0, rev = revision) {
  if (rev !== revision) return;
  const doc = frameDoc();
  if (doc) suppressFocusRing(doc);

  const ready = doc && doc.querySelector(CONFIG.readySelector);
  if (!ready) {
    if (attempt < CONFIG.maxAttempts) setTimeout(() => applyPoint(point, attempt + 1, rev), CONFIG.retryDelay);
    else if (rev === revision) {
      $("#loading-state").hidden = true;      // 安静收场：页面上不留任何内部状态字样
    }
    return;
  }

  let done = false;
  try { done = stepOf(point)(doc) !== false; }
  catch {
    if (rev === revision) $("#loading-state").hidden = true;
    return;
  }

  if (done) {
    if (rev !== revision) return;
    $("#loading-state").hidden = true;
    return;
  }
  if (attempt >= CONFIG.maxAttempts) {
    // 没到位：安静收场。页面上不留任何内部状态字样，也不动批注的样子。
    // 内部状态只回对话里说，不进材料。
    if (rev !== revision) return;
    $("#loading-state").hidden = true;
    return;
  }
  setTimeout(() => applyPoint(point, attempt + 1, rev), CONFIG.retryDelay);
}

/* ---------- 切换 ---------- */

function loadPoint(chapterIndex = currentChapter, pointIndex = currentPoint) {
  const rev = ++revision;
  currentChapter = chapterIndex;
  currentPoint = pointIndex;
  activePoint = chapters[currentChapter].points[currentPoint];
  menuOpen = false;

  renderPointMenu();
  showcase.dataset.view = "loading";
  showcase.classList.toggle("is-mobile", isMobilePoint(activePoint));
  designNote.hidden = isMobilePoint(activePoint);
  $("#mobile-return").hidden = !isMobilePoint(activePoint);
  $("#loading-state").hidden = false;
  $("#loading-state").textContent = "正在载入演示页面…";
  renderNote();        // 界面还没确认，先别让这句话担保屏幕
  updateAddress("point");

  const target = targetUrl(activePoint);

  // 同一个界面地址就不要重载 iframe：省一次加载，也不闪
  const doc = frameDoc();
  const frameReady = doc && doc.querySelector(CONFIG.readySelector);
  if (frame.src === target && loadedFrameHref === target && frameReady) {
    showcase.dataset.view = "stage";
    $("#loading-state").hidden = true;
    bindFrameKeyboard();
    setTimeout(() => applyPoint(activePoint, 0, rev), 0);
    return;
  }

  frame.onload = () => {
    if (rev !== revision || frame.src !== target) return;
    loadedFrameHref = target;
    showcase.dataset.view = "stage";
    bindFrameKeyboard();
    setTimeout(() => applyPoint(activePoint, 0, rev), 120);   // 给界面一次渲染机会
  };
  frame.onerror = () => { if (rev === revision) $("#loading-state").hidden = true; };
  frame.src = target;
}

function showChapterCover(index) {
  revision += 1;
  currentChapter = Math.max(0, Math.min(chapters.length - 1, index));
  currentPoint = 0;
  menuOpen = false;
  buildCover();
}

function showClosingPage() {
  revision += 1;
  menuOpen = false;
  showcase.dataset.view = "closing";
  showcase.classList.remove("is-mobile");
  $("#mobile-return").hidden = true;
  designNote.hidden = true;
  $("#loading-state").hidden = true;
  renderPointMenu();
  updateAddress("closing");
}

function nextPoint() {
  if (currentPoint < chapters[currentChapter].points.length - 1) loadPoint(currentChapter, currentPoint + 1);
  else if (currentChapter < chapters.length - 1) showChapterCover(currentChapter + 1);
  else if (CONFIG.closing) showClosingPage();
  else showChapterCover(0);
}

function previousPoint() {
  if (currentPoint > 0) loadPoint(currentChapter, currentPoint - 1);
  else showChapterCover(currentChapter);
}

/* ---------- 键盘 ---------- */

function handleKeydown(event) {
  if (event.key === "Escape" && menuOpen) { menuOpen = false; renderPointMenu(); return; }
  if (menuOpen || event.defaultPrevented) return;

  if (showcase.dataset.view === "closing") {
    if (event.key === "ArrowLeft") { event.preventDefault(); loadPoint(chapters.length - 1, chapters[chapters.length - 1].points.length - 1); }
    else if (event.key === "ArrowRight") { event.preventDefault(); showChapterCover(0); }
    return;
  }

  if (showcase.dataset.view === "cover") {
    if (event.key === "Enter" || event.key === "ArrowRight") {
      if (event.key === "ArrowRight") event.preventDefault();
      loadPoint(currentChapter, 0);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const previous = (currentChapter - 1 + chapters.length) % chapters.length;
      loadPoint(previous, chapters[previous].points.length - 1);
    }
    return;
  }

  if (showcase.dataset.view !== "stage") return;
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

  const target = event.target;
  if (target?.closest?.("input,textarea,select,[contenteditable='true'],[role='textbox'],[role='slider'],[role='spinbutton']")) return;
  const selection = target?.ownerDocument?.getSelection?.();
  if (selection && !selection.isCollapsed) return;           // 用户正在选文本，别抢方向键

  if (event.key === "ArrowRight") { event.preventDefault(); nextPoint(); }
  else if (event.key === "ArrowLeft") { event.preventDefault(); previousPoint(); }
}

/** 焦点在 iframe 里时，外层 document 收不到 keydown，必须往 iframe 里也绑一份。 */
function bindFrameKeyboard() {
  const doc = frameDoc();
  if (!doc) return;
  doc.removeEventListener("keydown", handleKeydown);
  doc.addEventListener("keydown", handleKeydown);
}

/* ---------- 批注条拖拽 ---------- */

function openPointMenu() {
  menuOpen = true;
  renderPointMenu();
}

noteCard.addEventListener("pointerdown", event => {
  if (event.button !== 0 || designNote.hidden || showcase.classList.contains("is-mobile")) return;
  const rect = designNote.getBoundingClientRect();
  noteDrag = {
    pointerId: event.pointerId,
    startX: event.clientX, startY: event.clientY,
    offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top,
    moved: false, rect,
  };
  noteCard.setPointerCapture(event.pointerId);
});

noteCard.addEventListener("pointermove", event => {
  if (!noteDrag || event.pointerId !== noteDrag.pointerId) return;
  // 5px 阈值：小于它就当点击（打开目录），不是拖拽
  if (!noteDrag.moved && Math.hypot(event.clientX - noteDrag.startX, event.clientY - noteDrag.startY) < 5) return;
  if (!noteDrag.moved) {
    noteDrag.moved = true;
    designNote.style.left = `${noteDrag.rect.left}px`;
    designNote.style.top = `${noteDrag.rect.top}px`;
    designNote.style.right = "auto";
    designNote.style.bottom = "auto";
    designNote.classList.add("is-dragging");
  }
  event.preventDefault();
  const rect = designNote.getBoundingClientRect();
  const left = Math.min(Math.max(0, event.clientX - noteDrag.offsetX), Math.max(0, window.innerWidth - rect.width));
  const top = Math.min(Math.max(0, event.clientY - noteDrag.offsetY), Math.max(0, window.innerHeight - rect.height));
  designNote.style.left = `${left}px`;
  designNote.style.top = `${top}px`;
});

function finishNoteDrag(event) {
  if (!noteDrag || event.pointerId !== noteDrag.pointerId) return;
  const openMenu = !noteDrag.moved && event.type === "pointerup";
  noteDrag = null;
  designNote.classList.remove("is-dragging");
  if (noteCard.hasPointerCapture(event.pointerId)) noteCard.releasePointerCapture(event.pointerId);
  if (openMenu) openPointMenu();
}

noteCard.addEventListener("pointerup", finishNoteDrag);
noteCard.addEventListener("pointercancel", finishNoteDrag);
noteCard.addEventListener("lostpointercapture", finishNoteDrag);
noteCard.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openPointMenu(); }
});

/* ---------- 收尾页 ---------- */

function renderClosing() {
  $("#closing-page").querySelector(".cover-eyebrow").textContent = CLOSING.kicker;
  $("#closing-title").textContent = CLOSING.title;
  const host = $("#closing-voices");
  host.replaceChildren();
  CLOSING.voices.slice(0, 3).forEach((voice, index) => {
    const figure = document.createElement("figure");
    figure.className = "closing-voice";
    figure.innerHTML = `
      <span class="closing-index">${pad(index + 1)}</span>
      <span class="closing-mark" aria-hidden="true">“</span>
      <blockquote></blockquote>
      <figcaption><strong></strong><span></span></figcaption>`;
    figure.querySelector("blockquote").textContent = voice.quote;
    figure.querySelector("strong").textContent = voice.name;
    figure.querySelector("figcaption span").textContent = voice.role;
    host.append(figure);
  });
}

/* ---------- 事件 ---------- */

$("#cover-enter").addEventListener("click", () => loadPoint(currentChapter, 0));
$("#cover-index").addEventListener("click", openPointMenu);
$("#closing-back").addEventListener("click", () => loadPoint(chapters.length - 1, chapters[chapters.length - 1].points.length - 1));
$("#closing-index").addEventListener("click", openPointMenu);
$("#closing-home").addEventListener("click", () => showChapterCover(0));
$("#note-next").addEventListener("click", nextPoint);
$("#note-prev").addEventListener("click", previousPoint);
$("#menu-close").addEventListener("click", () => { menuOpen = false; renderPointMenu(); });
$("#mobile-return").addEventListener("click", () => showChapterCover(currentChapter));

$("#fullscreen-button").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch { /* 内嵌预览里可能不可用，忽略 */ }
});

$("#menu-content").addEventListener("click", event => {
  const pointButton = event.target.closest("[data-point]");
  const chapterButton = event.target.closest("[data-chapter-cover]");
  const closingButton = event.target.closest("[data-closing]");
  if (pointButton) {
    const [chapterIndex, pointIndex] = pointButton.dataset.point.split(":").map(Number);
    loadPoint(chapterIndex, pointIndex);
  } else if (chapterButton) {
    showChapterCover(Number(chapterButton.dataset.chapterCover));
  } else if (closingButton) {
    showClosingPage();
  }
});

document.addEventListener("keydown", handleKeydown);

/* ---------- 启动：优先读深链 ---------- */

function boot() {
  renderClosing();
  renderPointMenu();

  const params = new URLSearchParams(location.search);
  currentChapter = Math.max(0, Math.min(chapters.length - 1, Number(params.get(CONFIG.chapterParam) || 1) - 1));
  currentPoint = Math.max(0, Math.min(chapters[currentChapter].points.length - 1, Number(params.get(CONFIG.pointParam) || 0)));

  if (location.hash === "#closing" && CONFIG.closing) { showClosingPage(); return; }

  // hash 里的点 id 全局查找：章节顺序变了，老链接依然有效
  const deepLink = location.hash.match(/^#chapter-(\d+)-([a-z0-9-]+)$/i);
  if (deepLink) {
    const pointId = deepLink[2];
    const chapterIndex = chapters.findIndex(chapter => chapter.points.some(point => point.id === pointId));
    const pointIndex = chapterIndex >= 0 ? chapters[chapterIndex].points.findIndex(point => point.id === pointId) : -1;
    if (pointIndex >= 0) { loadPoint(chapterIndex, pointIndex); return; }
    buildCover();
    return;
  }

  if (params.has(CONFIG.pointParam) || params.has(CONFIG.chapterParam)) { loadPoint(currentChapter, currentPoint); return; }
  buildCover();
}

boot();
