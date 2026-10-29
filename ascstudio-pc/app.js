const APP_URL = "./studio/";
const MINI_URL = "../ascstudio-mini/";
const ROUTE_REV = "20261030-new-task-card-start";
const chapters = [
  {
    id: "development", title: "解决问题后把经验留下", cover: "从错误现象到社区经验", summary: "从整理当前任务、理解问题、核对结果，到整理可分享的经验，串起完整的开发过程。", art: "./assets/cover-development.png", artAlt: "开发者围绕当前问题整理上下文、对比结果并理解原因的二维线描插画",
    points: [
      { id: "connect", title: "从任务建议卡开始", note: "在新建任务页用建议卡片提供可选起点，用户选择后再继续。", emphasis: "建议卡片", description: "在新建任务页用建议卡片提供可选起点，用户选择后再继续。", entry: "新建任务首页 · 主动建议卡片", home: "classic", mode: "学习" },
      { id: "micro", title: "把眼前内容带入提问", note: "选取内容、指向页面或调整输入区时，都能把当前上下文带入提问。", emphasis: "把当前上下文带入提问", description: "选取内容、指向页面或调整输入区时，都能把当前上下文带入提问。", entry: "Add 算子精度差异排查 · 对话内容与输入区", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子" },
      { id: "error-visual", title: "在问题发生处看懂原因", note: "把当前内容和解释图示放在一起，帮助用户理解原因和处理方式。", emphasis: "理解原因和处理方式", description: "把当前内容和解释图示放在一起，帮助用户理解原因和处理方式。", entry: "Add 算子精度差异排查 · 差异日志与图解", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子" },
      { id: "verify", title: "确认处理结果再继续", note: "对照处理前后的结果，确认问题是否解决，再决定下一步。", emphasis: "确认问题是否解决", description: "对照处理前后的结果，确认问题是否解决，再决定下一步。", entry: "Add 算子精度差异排查 · 结果核验", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子" },
      { id: "community", title: "处理完成后整理经验", note: "将处理过程整理成可审阅的经验草稿，由用户决定是否分享。", emphasis: "可审阅的经验草稿", description: "将处理过程整理成可审阅的经验草稿，由用户决定是否分享。", entry: "Add 算子精度差异排查 · 完成状态与经验草稿", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子" },
    ],
  },
  {
    id: "learning", title: "让学习目标一步步变成实践", cover: "先说想学什么，再一步步尝试", summary: "从提出学习目标到生成路径、动手练习和整理理解，带学习者逐步上手。", art: "./assets/cover-learning.png", artAlt: "从学习目标出发，经过学习路径和练习，整理成个人知识卡片的二维线描插画",
    points: [
      { id: "recommend", title: "先看建议再选择起点", note: "根据已有学习记录推荐下一步并说明理由，由学习者决定是否采用。", emphasis: "推荐下一步并说明理由", description: "根据已有学习记录推荐下一步并说明理由，由学习者决定是否采用。", entry: "新建任务首页 · 学习模式建议卡", mode: "学习" },
      { id: "intent", title: "从模糊想法开始学习", note: "说出希望提升的能力并补充已有基础，找到清晰的学习方向。", emphasis: "清晰的学习方向", description: "说出希望提升的能力并补充已有基础，找到清晰的学习方向。", entry: "新建任务首页 · 学习模式与目标输入", mode: "学习" },
      { id: "path", title: "生成路径后一起调整", note: "先生成学习路径草案，再根据已有基础和关注重点共同调整。", emphasis: "共同调整", description: "先生成学习路径草案，再根据已有基础和关注重点共同调整。", entry: "学习路径共创任务 · 未确认草案", task: "图像输入预处理路径共创", group: "模型推理" },
      { id: "custom-node", title: "在路径里加入个人安排", note: "添加自己的学习节点并调整顺序，让路径符合当前需要。", emphasis: "添加自己的学习节点并调整顺序", description: "添加自己的学习节点并调整顺序，让路径符合当前需要。", entry: "学习路径画布 · 选中一个可编辑节点", task: "图像输入预处理路径共创", group: "模型推理" },
      { id: "path-practice", title: "边练习边确认理解", note: "改变练习条件并观察结果，用变化确认自己是否理解。", emphasis: "确认自己是否理解", description: "改变练习条件并观察结果，用变化确认自己是否理解。", entry: "学习任务工作区 · 当前练习节点", task: "学会图像输入预处理", group: "模型推理" },
      { id: "cognition", title: "把自己的理解整理成认知卡", note: "把想法、图示和相关材料放进同一张卡片，方便补充和回看。", emphasis: "方便补充和回看", description: "把想法、图示和相关材料放进同一张卡片，方便补充和回看。", entry: "学习画布 · 个人认知材料", task: "学会图像输入预处理", group: "模型推理" },
      { id: "transfer", title: "带着所学继续解决任务", note: "带着学习中整理的资料回到实际任务，继续处理遇到的问题。", emphasis: "继续处理遇到的问题", description: "带着学习中整理的资料回到实际任务，继续处理遇到的问题。", entry: "学习记录 · 转到相关图像推理任务", task: "学会图像输入预处理", group: "模型推理" },
    ],
  },
  {
    id: "mobile", title: "在手机上随时接着学", cover: "把学习延伸到日常间隙", summary: "通过手机接收内容、保存学习线索和调整偏好，让学习可以随时接续。", art: "./assets/cover-mobile.png", artAlt: "在手机上查看学习内容、保存线索并继续学习的二维线描插画",
    points: [
      { id: "handoff", title: "新内容主动送到手边", note: "让新内容出现在常用消息入口，点开就能继续阅读。", emphasis: "继续阅读", description: "让新内容出现在常用消息入口，点开就能继续阅读。", entry: "小程序 · 微信消息列表", route: "wechat", mobile: true },
      { id: "notification", title: "先看重点再继续阅读", note: "先展示内容重点和摘要，再进入完整内容。", emphasis: "内容重点和摘要", description: "先展示内容重点和摘要，再进入完整内容。", entry: "小程序 · 服务通知摘要", route: "wechat-notification", mobile: true },
      { id: "digest", title: "让重点内容和相关卡片一起呈现", note: "将重点内容与相关知识卡放在一起，方便在手机上快速阅读。", emphasis: "快速阅读", description: "将重点内容与相关知识卡放在一起，方便在手机上快速阅读。", entry: "小程序 · 每周速览", route: "briefing", mobile: true },
      { id: "signals", title: "把感兴趣和没弄懂的内容记下来", note: "为感兴趣或暂时没弄懂的内容留下标记，方便下次接着学。", emphasis: "留下标记", description: "为感兴趣或暂时没弄懂的内容留下标记，方便下次接着学。", entry: "小程序 · 知识卡与兴趣信号", route: "knowledge/scaling", mobile: true },
      { id: "preferences", title: "按自己的习惯安排接收", note: "选择关注主题和接收时段，让后续内容更符合个人阅读习惯。", emphasis: "个人阅读习惯", description: "选择关注主题和接收时段，让后续内容更符合个人阅读习惯。", entry: "小程序 · 订阅设置", route: "briefing", openSettings: true, mobile: true },
    ],
  },
];

const $ = selector => document.querySelector(selector);
const showcase = $("#showcase"), frame = $("#demo-frame"), cover = $("#chapter-cover");
const params = new URLSearchParams(location.search);
let currentChapter = Math.min(chapters.length - 1, Math.max(0, Number(params.get("chapter") || 1) - 1));
let currentPoint = Math.min(chapters[currentChapter].points.length - 1, Math.max(0, Number(params.get("pointIndex") || 0)));
let activePoint = null, menuOpen = false, loadingRevision = 0, loadedFrameHref = "";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function updateCoverArt(chapter) {
  const image = $("#cover-art");
  image.src = chapter.art;
  image.alt = chapter.artAlt;
}

function updateAddress(view) {
  const url = new URL(location.href);
  url.searchParams.set("chapter", String(currentChapter + 1));
  url.searchParams.set("pointIndex", String(currentPoint));
  url.hash = view === "cover" ? `chapter-${currentChapter + 1}` : `chapter-${currentChapter + 1}-${chapters[currentChapter].points[currentPoint].id}`;
  history.replaceState(null, "", url);
}

function buildCover() {
  const chapter = chapters[currentChapter];
  $("#cover-kicker").textContent = `用户旅程 · 章节 ${String(currentChapter + 1).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")}`;
  $("#cover-number").textContent = String(currentChapter + 1).padStart(2, "0");
  $("#cover-title").textContent = chapter.title;
  $("#cover-description").textContent = chapter.summary;
  updateCoverArt(chapter);
  $("#cover-enter").textContent = currentChapter === chapters.length - 1 ? "进入小程序演示" : "进入本章";
  showcase.dataset.view = "cover";
  showcase.classList.remove("is-mobile");
  $("#mobile-return").hidden = true;
  $("#design-note").hidden = true;
  $("#chapter-menu").hidden = !menuOpen;
  updateAddress("cover");
}

function renderPointMenu() {
  $("#menu-content").innerHTML = chapters.map((chapter, chapterIndex) => `
    <section class="menu-chapter">
      <button class="menu-chapter-title" type="button" data-chapter-cover="${chapterIndex}"><span>${String(chapterIndex + 1).padStart(2, "0")}</span><span>${escapeHTML(chapter.title)}</span></button>
      ${chapter.points.map((point, pointIndex) => `<button class="menu-point ${chapterIndex === currentChapter && pointIndex === currentPoint ? "is-current" : ""}" type="button" data-point="${chapterIndex}:${pointIndex}"><span>${chapterIndex + 1}.${pointIndex + 1}</span><span>${escapeHTML(point.title)}</span></button>`).join("")}
    </section>`).join("");
  $("#chapter-menu").hidden = !menuOpen;
}

function selectedTaskLabel(doc) {
  return doc.querySelector(".task-title-button strong")?.textContent?.trim() || "";
}

function applyPcStart(point, attempt = 0, revision = loadingRevision) {
  if (revision !== loadingRevision) return;
  let doc;
  try { doc = frame.contentDocument; } catch { return; }
  if (!doc || !doc.querySelector("#root") || attempt > 22) { if (attempt < 22) setTimeout(() => applyPcStart(point, attempt + 1, revision), 180); return; }

  if (point.home) {
    const tab = doc.querySelector(`#home-tab-${point.home}`);
    if (tab && tab.getAttribute("aria-selected") !== "true") tab.click();
  }
  if (point.mode) {
    const mode = [...doc.querySelectorAll(".new-task-home__mode-button")].find(button => button.textContent.trim() === point.mode);
    if (mode && mode.getAttribute("aria-pressed") !== "true") mode.click();
  }
  if (point.task) {
    if (selectedTaskLabel(doc) !== point.task) {
      let row = [...doc.querySelectorAll(".task-row-label")].find(label => label.textContent.trim() === point.task);
      if (!row && point.group) {
        const group = [...doc.querySelectorAll(".project-heading")].find(button => button.textContent.includes(point.group));
        if (group && group.getAttribute("aria-expanded") !== "true") group.click();
        if (attempt < 22) { setTimeout(() => applyPcStart(point, attempt + 1, revision), 180); return; }
      }
      if (row) row.closest("button")?.click();
      else if (attempt < 22) { setTimeout(() => applyPcStart(point, attempt + 1, revision), 180); return; }
      if (row && attempt < 22) { setTimeout(() => applyPcStart(point, attempt + 1, revision), 180); return; }
    }
  }
  $("#loading-state").hidden = true;
}

function applyMobileStart(point, attempt = 0, revision = loadingRevision) {
  if (revision !== loadingRevision) return;
  let doc;
  try { doc = frame.contentDocument; } catch { return; }
  if (!doc || !doc.querySelector("#screen")) {
    if (attempt < 22) setTimeout(() => applyMobileStart(point, attempt + 1, revision), 180);
    return;
  }
  if (point.openSettings) {
    const settingsButton = doc.querySelector('[data-action="open-weekly-settings"]');
    if (!settingsButton) {
      if (attempt < 22) setTimeout(() => applyMobileStart(point, attempt + 1, revision), 180);
      return;
    }
    settingsButton.click();
  }
  $("#loading-state").hidden = true;
}

function loadPoint(chapterIndex = currentChapter, pointIndex = currentPoint) {
  const revision = ++loadingRevision;
  currentChapter = chapterIndex;
  currentPoint = pointIndex;
  activePoint = chapters[currentChapter].points[currentPoint];
  menuOpen = false;
  renderPointMenu();
  showcase.dataset.view = "loading";
  showcase.classList.toggle("is-mobile", Boolean(activePoint.mobile));
  $("#design-note").hidden = Boolean(activePoint.mobile);
  $("#mobile-return").hidden = !activePoint.mobile;
  $("#loading-state").hidden = false;
  const noteText = $("#note-text");
  const emphasis = activePoint.emphasis || "";
  const emphasisStart = activePoint.note.indexOf(emphasis);
  if (!emphasis || emphasisStart < 0) noteText.textContent = activePoint.note;
  else {
    const emphasisEnd = emphasisStart + emphasis.length;
    const emphasized = document.createElement("strong");
    emphasized.textContent = emphasis;
    noteText.replaceChildren(
      document.createTextNode(activePoint.note.slice(0, emphasisStart)),
      emphasized,
      document.createTextNode(activePoint.note.slice(emphasisEnd)),
    );
  }
  $("#note-prev").disabled = currentPoint === 0 && currentChapter === 0;
  const nextLabel = currentPoint < chapters[currentChapter].points.length - 1 ? "下一个设计点" : currentChapter < chapters.length - 1 ? "进入下一章封面" : "回到第一章封面";
  $("#note-next").setAttribute("aria-label", nextLabel);
  $("#note-next").title = nextLabel;
  updateAddress("point");

  const target = activePoint.mobile ? new URL(MINI_URL, location.href) : new URL(APP_URL, location.href);
  if (activePoint.mobile) {
    target.search = "";
    target.hash = activePoint.route || "wechat";
  } else {
    target.searchParams.set("showcaseRev", ROUTE_REV);
    if (activePoint.task) target.searchParams.set("task", activePoint.taskRoute || activePoint.task);
    else target.searchParams.set("home", activePoint.home || "classic");
    target.hash = "";
  }
  let currentDoc;
  try { currentDoc = frame.contentDocument; } catch { currentDoc = null; }
  const frameReady = activePoint.mobile ? currentDoc?.querySelector("#screen") : currentDoc?.querySelector("#root");
  if (frame.src === target.href && loadedFrameHref === target.href && frameReady) {
    showcase.dataset.view = "stage";
    $("#loading-state").hidden = true;
    if (!activePoint.mobile) setTimeout(() => applyPcStart(activePoint, 0, revision), 0);
    else setTimeout(() => applyMobileStart(activePoint, 0, revision), 0);
    return;
  }
  frame.onload = () => {
    if (revision !== loadingRevision || frame.src !== target.href) return;
    loadedFrameHref = target.href;
    showcase.dataset.view = "stage";
    if (!activePoint.mobile) setTimeout(() => applyPcStart(activePoint, 0, revision), 120);
    else setTimeout(() => applyMobileStart(activePoint, 0, revision), 120);
  };
  frame.onerror = () => { if (revision === loadingRevision) $("#loading-state").textContent = "演示页面暂时无法载入"; };
  frame.src = target.href;
}

function showChapterCover(index) {
  loadingRevision += 1;
  currentChapter = Math.max(0, Math.min(chapters.length - 1, index));
  currentPoint = 0;
  menuOpen = false;
  buildCover();
}

function nextPoint() {
  if (currentPoint < chapters[currentChapter].points.length - 1) loadPoint(currentChapter, currentPoint + 1);
  else if (currentChapter < chapters.length - 1) showChapterCover(currentChapter + 1);
  else showChapterCover(0);
}

function previousPoint() {
  if (currentPoint > 0) loadPoint(currentChapter, currentPoint - 1);
  else if (currentChapter > 0) showChapterCover(currentChapter - 1);
}

function openPointMenu() {
  menuOpen = true;
  renderPointMenu();
}

const designNote = $("#design-note");
const noteCard = $("#note-card");
let noteDrag = null;

noteCard.addEventListener("pointerdown", event => {
  if (event.button !== 0 || designNote.hidden || showcase.classList.contains("is-mobile")) return;
  const rect = designNote.getBoundingClientRect();
  noteDrag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, moved: false, rect };
  noteCard.setPointerCapture(event.pointerId);
});

noteCard.addEventListener("pointermove", event => {
  if (!noteDrag || event.pointerId !== noteDrag.pointerId) return;
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
  const shouldOpenMenu = !noteDrag.moved && event.type === "pointerup";
  noteDrag = null;
  designNote.classList.remove("is-dragging");
  if (noteCard.hasPointerCapture(event.pointerId)) noteCard.releasePointerCapture(event.pointerId);
  if (shouldOpenMenu) openPointMenu();
}

noteCard.addEventListener("pointerup", finishNoteDrag);
noteCard.addEventListener("pointercancel", finishNoteDrag);
noteCard.addEventListener("lostpointercapture", finishNoteDrag);
noteCard.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openPointMenu(); }
});

$("#cover-enter").addEventListener("click", () => loadPoint(currentChapter, 0));
$("#cover-index").addEventListener("click", openPointMenu);
$("#note-next").addEventListener("click", nextPoint);
$("#note-prev").addEventListener("click", previousPoint);
$("#menu-close").addEventListener("click", () => { menuOpen = false; renderPointMenu(); });
$("#mobile-return").addEventListener("click", () => showChapterCover(4));
$("#fullscreen-button").addEventListener("click", async () => {
  try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen(); } catch { /* Fullscreen may be unavailable in the embedded preview. */ }
});
$("#menu-content").addEventListener("click", event => {
  const pointButton = event.target.closest("[data-point]");
  const chapterButton = event.target.closest("[data-chapter-cover]");
  if (pointButton) { const [chapterIndex, pointIndex] = pointButton.dataset.point.split(":").map(Number); loadPoint(chapterIndex, pointIndex); }
  else if (chapterButton) showChapterCover(Number(chapterButton.dataset.chapterCover));
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menuOpen) { menuOpen = false; renderPointMenu(); return; }
  if (showcase.dataset.view === "cover" && event.key === "Enter") { loadPoint(currentChapter, 0); return; }
  if (showcase.dataset.view !== "stage" || event.target.closest("input,textarea,select,[contenteditable='true']")) return;
  if (event.key === "ArrowRight") { event.preventDefault(); nextPoint(); }
  else if (event.key === "ArrowLeft") { event.preventDefault(); previousPoint(); }
});

renderPointMenu();
const deepLink = location.hash.match(/^#chapter-(\d+)-([a-z0-9-]+)$/i);
if (deepLink) {
  const chapterIndex = Number(deepLink[1]) - 1;
  const pointIndex = chapters[chapterIndex]?.points.findIndex(point => point.id === deepLink[2]) ?? -1;
  if (pointIndex >= 0) loadPoint(chapterIndex, pointIndex);
  else buildCover();
} else buildCover();
