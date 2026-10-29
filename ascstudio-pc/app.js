const APP_URL = "./studio/";
const MINI_URL = "../ascstudio-mini/";
const ROUTE_REV = "20261029-task-routing";
const chapters = [
  {
    id: "development", title: "开发场景：Add 算子精度排查", cover: "从错误现象到社区经验", summary: "从 Add 算子精度差异开始，带着代码和日志理解问题、核对处理结果，并把排查过程整理成社区经验。", art: "./assets/cover-development.png", artAlt: "开发者通过代码、结果对比和放大镜排查 Add 算子精度差异的二维线描插画",
    points: [
      { id: "connect", title: "从任务线索整理提问", note: "从 Add 算子精度差异排查任务中选出目标、代码和日志，整理成可编辑的 Prompt，确认后再发送。", emphasis: "可编辑的 Prompt", description: "从当前任务里的目标、代码与日志出发，形成可调整并由开发者确认的提问。", entry: "Add 算子精度差异排查 · 任务对话与 Prompt", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子" },
      { id: "micro", title: "从当前内容取上下文", note: "划选内容、指向页面或调整输入框时，都能顺手把当前内容带入提问。", emphasis: "把当前内容带入提问", description: "划词、指向工作区和调整输入区位置，都从用户眼前的内容开始；微交互跟随任务发生。", entry: "Add 算子精度差异排查 · 对话内容与输入区", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子" },
      { id: "error-visual", title: "错误发生时，把原理放回现场", note: "遇到错误时，把相关代码、参数和图解放在一起，帮助用户看懂问题和处理方式。", emphasis: "看懂问题和处理方式", description: "错误、图解、参数和代码相互对应；用户可以回看当前问题为什么需要这样处理。", entry: "Add 算子精度差异排查 · 差异日志与图解", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子" },
      { id: "verify", title: "对照结果确认是否修好", note: "对照修改前后的输出与误差，确认问题是否解决，再决定下一步。", emphasis: "确认问题是否解决", description: "回到通过与失败样例核对修改结果；验证之前，排查线索仍保持为待确认。", entry: "Add 算子精度差异排查 · 结果核验", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子" },
      { id: "community", title: "调试结束后，邀请整理社区经验", note: "调试完成后，把问题、尝试、环境和验证结果整理成社区经验草稿，由用户决定是否分享。", emphasis: "社区经验草稿", description: "根据当前任务形成可审阅草稿，保留问题、尝试、环境和验证状态；是否分享由用户确认。", entry: "Add 算子精度差异排查 · 完成状态与经验草稿", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子" },
    ],
  },
  {
    id: "learning", title: "学习场景：从目标到实践", cover: "先说想学什么，再一步步尝试", summary: "从学习记录和能力目标出发，生成可调整的学习路径，通过练习理解内容、整理个人知识，再带着收获回到相关任务。", art: "./assets/cover-learning.png", artAlt: "从学习目标出发，经过学习路径和练习，整理成个人知识卡片的二维线描插画",
    points: [
      { id: "recommend", title: "主动建议先摆出依据", note: "根据近期学习记录推荐下一步，并说明理由，是否采用由学习者决定。", emphasis: "推荐下一步，并说明理由", description: "结合已有学习记录给出可判断的下一步建议；是否继续由学习者决定。", entry: "新建任务首页 · 学习模式建议卡", mode: "学习" },
      { id: "intent", title: "模糊意图也能开始", note: "说出想提升的能力并补充已有基础，就能生成学习方向。", emphasis: "生成学习方向", description: "从“想学会图像输入预处理，但不知道从哪里开始”进入，补充目标与已有基础后生成学习方向。", entry: "新建任务首页 · 学习模式与目标输入", mode: "学习" },
      { id: "path", title: "生成路径后一起调整", note: "先生成一份学习路径草案，再按已有基础和关注重点一起调整。", emphasis: "一起调整", description: "路径以草案出现，用户可以说明已有基础、补充重点，并逐项审阅变化。", entry: "学习路径共创任务 · 未确认草案", task: "图像输入预处理路径共创", group: "模型推理" },
      { id: "custom-node", title: "路径允许加入自己的节点", note: "可以添加学习节点并调整顺序，让路径更符合自己的需要。", emphasis: "添加学习节点并调整顺序", description: "补充自定义节点并调整先后关系，保留用户对学习顺序和重点的决定权。", entry: "学习路径画布 · 选中一个可编辑节点", task: "图像输入预处理路径共创", group: "模型推理" },
      { id: "path-practice", title: "路径练习承接刚学到的概念", note: "调整参数后观察结果变化，确认是否理解了刚学的内容。", emphasis: "确认是否理解了刚学的内容", description: "从路径节点进入练习，改变参数后观察形状变化，并用结果检查理解。", entry: "学习任务工作区 · 当前练习节点", task: "学会图像输入预处理", group: "模型推理" },
      { id: "cognition", title: "笔记、图解和代码成为认知卡", note: "把笔记、图解和代码放进同一张认知卡，方便之后回看。", emphasis: "方便之后回看", description: "学习者用自己的话重述、画图和关联代码，围绕同一知识点组织，之后还能回看。", entry: "学习画布 · 个人认知材料", task: "学会图像输入预处理", group: "模型推理" },
      { id: "transfer", title: "理解可以带回实际任务", note: "带着学习记录中的来源和条件回到开发任务，继续核对实际问题。", emphasis: "继续核对实际问题", description: "学习记录保留来源和条件，再进入相关图像推理任务继续核对；示例演算不替代真实项目验证。", entry: "学习记录 · 转到相关图像推理任务", task: "学会图像输入预处理", group: "模型推理" },
    ],
  },
  {
    id: "mobile", title: "支线：在手机上继续学习", cover: "把学习延伸到日常间隙", summary: "从学习路径和认知卡出发，打开小程序看每周速览、标记兴趣与疑问，并调整接收偏好。", art: "./assets/cover-mobile.png", artAlt: "手机上查看每周学习速览、知识卡片并保存后续学习线索的二维线描插画",
    points: [
      { id: "handoff", title: "新知先出现在微信里", note: "让每周开发速览出现在微信通知里，点开就能继续阅读。", emphasis: "点开就能继续阅读", description: "一条未读服务通知，让每周开发速览主动来到用户熟悉的消息列表。", entry: "小程序 · 微信消息列表", route: "wechat", mobile: true },
      { id: "notification", title: "先看懂这条通知", note: "通知先展示本周重点和内容摘要，再进入完整速览。", emphasis: "本周重点和内容摘要", description: "通知先交代本周重点和内容形态，再把用户带入完整速览。", entry: "小程序 · 服务通知摘要", route: "wechat-notification", mobile: true },
      { id: "digest", title: "一条资讯，接两张卡", note: "每期速览用一条重点资讯和两张知识卡，方便在手机上快速阅读。", emphasis: "在手机上快速阅读", description: "重点资讯搭配两张短知识卡，让开发者用手机快速读完并接着学。", entry: "小程序 · 每周速览", route: "briefing", mobile: true },
      { id: "signals", title: "把存疑留给下一次", note: "把感兴趣或还没弄懂的知识卡标记下来，为后续学习留下线索。", emphasis: "为后续学习留下线索", description: "在知识卡上标记感兴趣或还没弄懂，为后续速览留下接续线索。", entry: "小程序 · 知识卡与兴趣信号", route: "knowledge/scaling", mobile: true },
      { id: "preferences", title: "推送主题与时间可选", note: "选择关注主题和接收时间，让每周速览更符合自己的阅读习惯。", emphasis: "自己的阅读习惯", description: "选择关注主题和接收时间；确认后，Demo 模拟新通知回到微信列表。", entry: "小程序 · 订阅设置", route: "briefing", openSettings: true, mobile: true },
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
