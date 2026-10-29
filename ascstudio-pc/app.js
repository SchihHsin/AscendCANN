const APP_URL = "./studio/";
const MINI_URL = "../ascstudio-mini/";
const ROUTE_REV = "20261029-task-routing";
const chapters = [
  {
    id: "expression", title: "先把目标说清", cover: "用户不是从空白开始", summary: "从任务现场或学习意图出发，让可讨论的线索先出现，再由用户组织并确认自己的 Prompt。",
    points: [
      { id: "recommend", title: "主动建议先摆出依据", description: "结合已有任务线索给出可判断的下一步。建议是起点，开发者仍决定是否采用。", entry: "新建任务首页 · 开发模式建议卡", mode: "开发" },
      { id: "connect", title: "把线索连起来，Prompt 逐步成形", description: "从训练目标、关注方向和约束出发，关系选择逐步写入可编辑 Prompt，再由用户明确发送。", entry: "新建任务首页 · 探索画布与 Prompt", home: "explore" },
      { id: "micro", title: "从当前内容取上下文", description: "划词、指向工作区和调整输入区位置，都从用户眼前的内容开始；微交互跟随任务发生。", entry: "任务工作区 · 对话内容与输入区", task: "图像推理调试" },
    ],
  },
  {
    id: "learning-start", title: "让学习从目标开始", cover: "不必先知道课程名", summary: "兴趣、疑问和明确能力目标都能成为入口；系统先帮助形成方向，再把路径交给用户调整。",
    points: [
      { id: "intent", title: "模糊意图也能开始", description: "从“想提升训练效率，但不知道先学什么”进入，先补充目标与已有基础，再生成学习方向。", entry: "新建任务首页 · 学习模式与目标输入", mode: "学习" },
      { id: "path", title: "生成路径后一起调整", description: "路径以草案出现，用户可以说明已有基础、补充重点，并逐项审阅变化。", entry: "学习路径共创任务 · 未确认草案", task: "图像输入预处理路径共创", group: "模型推理" },
      { id: "custom-node", title: "路径允许加入自己的节点", description: "补充自定义节点并调整先后关系，保留用户对学习顺序和重点的决定权。", entry: "学习路径画布 · 选中一个可编辑节点", task: "图像输入预处理路径共创", group: "模型推理" },
    ],
  },
  {
    id: "practice", title: "在实践中理解", cover: "任务完成不等于理解完成", summary: "把解释放回当前任务或学习练习，让用户能观察、尝试、比较，再判断是否真正理解。",
    points: [
      { id: "error-visual", title: "错误发生时，把原理放回现场", description: "错误、图解、参数和代码相互对应；用户可以回看当前问题为什么需要这样处理。", entry: "开发任务工作区 · 错误线索与张量图解", task: "图像推理调试" },
      { id: "path-practice", title: "路径练习承接刚学到的概念", description: "从路径节点进入练习，改变参数后观察形状变化，并用结果检查理解。", entry: "学习任务工作区 · 当前练习节点", task: "学会图像输入预处理", group: "模型推理" },
      { id: "transfer", title: "理解可以带回实际任务", description: "学习记录保留来源和条件，再进入相关开发任务继续核对；示例演算不替代真实项目验证。", entry: "学习任务与开发任务的切换入口", task: "学会图像输入预处理", group: "模型推理" },
    ],
  },
  {
    id: "return", title: "把收获带入下一次", cover: "让经验有机会被找回", summary: "任务对话中的尝试与修复可整理成社区草稿，学习者自己的解释也能成为个人认知卡。",
    points: [
      { id: "community", title: "调试结束后，邀请整理社区经验", description: "根据当前任务形成可审阅草稿，保留问题、尝试、环境和验证状态；是否分享由用户确认。", entry: "开发任务完成状态 · 社区经验草稿入口", task: "图像推理调试", taskRoute: "development" },
      { id: "cognition", title: "笔记、图解和代码成为认知卡", description: "学习者用自己的话重述、画图和关联代码，围绕同一知识点组织，之后还能回看。", entry: "学习画布 · 个人认知材料", task: "学会图像输入预处理", group: "模型推理" },
    ],
  },
  {
    id: "mobile", title: "离开电脑，继续学习", cover: "把疑问和线索带在身边", summary: "小程序承接短内容与明确的兴趣、疑问信号，帮助学习从桌面任务延伸到日常间隙。",
    points: [
      { id: "handoff", title: "新知先出现在微信里", description: "一条未读服务通知，让每周开发速览主动来到用户熟悉的消息列表。", entry: "小程序 · 微信消息列表", route: "wechat", mobile: true },
      { id: "notification", title: "先看懂这条通知", description: "通知先交代本周重点和内容形态，再把用户带入完整速览。", entry: "小程序 · 服务通知摘要", route: "wechat-notification", mobile: true },
      { id: "digest", title: "一条资讯，接两张卡", description: "重点资讯搭配两张短知识卡，让开发者用手机快速读完并接着学。", entry: "小程序 · 每周速览", route: "briefing", mobile: true },
      { id: "signals", title: "把存疑留给下一次", description: "在知识卡上标记感兴趣或还没弄懂，为后续速览留下接续线索。", entry: "小程序 · 知识卡与兴趣信号", route: "knowledge/scaling", mobile: true },
      { id: "preferences", title: "推送主题与时间可选", description: "选择关注主题和接收时间；确认后，Demo 模拟新通知回到微信列表。", entry: "小程序 · 订阅设置", route: "briefing", openSettings: true, mobile: true },
    ],
  },
];

const $ = selector => document.querySelector(selector);
const showcase = $("#showcase"), frame = $("#demo-frame"), cover = $("#chapter-cover");
const params = new URLSearchParams(location.search);
let currentChapter = Math.min(chapters.length - 1, Math.max(0, Number(params.get("chapter") || 1) - 1));
let currentPoint = Math.min(chapters[currentChapter].points.length - 1, Math.max(0, Number(params.get("pointIndex") || 0)));
let activePoint = null, menuOpen = false, loadingRevision = 0;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
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
  $("#cover-point-count").textContent = `${String(chapter.points.length).padStart(2, "0")} 个设计点`;
  $("#cover-points").innerHTML = chapter.points.map((point, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><span>${escapeHTML(point.title)}</span></li>`).join("");
  $("#journey-rail").innerHTML = chapters.map((_, index) => `<span class="${index === currentChapter ? "is-current" : ""}"></span>`).join("");
  $("#cover-enter").textContent = currentChapter === chapters.length - 1 ? "进入小程序演示" : "进入本章";
  showcase.dataset.view = "cover";
  showcase.classList.remove("is-mobile", "is-note-collapsed");
  $("#mobile-return").hidden = true;
  $("#design-note").hidden = true;
  $("#note-dock").hidden = true;
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
  showcase.classList.remove("is-note-collapsed");
  $("#design-note").hidden = Boolean(activePoint.mobile);
  $("#note-dock").hidden = true;
  $("#mobile-return").hidden = !activePoint.mobile;
  $("#loading-state").hidden = false;
  $("#note-kicker").textContent = `章节 ${String(currentChapter + 1).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")} · 设计点 ${currentPoint + 1} / ${chapters[currentChapter].points.length}`;
  $("#note-title").textContent = activePoint.title;
  $("#note-description").textContent = activePoint.description;
  $("#note-entry").textContent = activePoint.entry;
  $("#dock-label").textContent = `${String(currentChapter + 1).padStart(2, "0")} · ${activePoint.title}`;
  $("#note-prev").disabled = currentPoint === 0 && currentChapter === 0;
  $("#note-next").textContent = currentPoint < chapters[currentChapter].points.length - 1 ? "下一个 →" : currentChapter < chapters.length - 1 ? "下一章封面 →" : "回到章节封面 →";
  updateAddress("point");

  frame.onload = () => {
    if (revision !== loadingRevision) return;
    showcase.dataset.view = "stage";
    if (!activePoint.mobile) setTimeout(() => applyPcStart(activePoint, 0, revision), 120);
    else setTimeout(() => applyMobileStart(activePoint, 0, revision), 120);
  };
  frame.onerror = () => { if (revision === loadingRevision) $("#loading-state").textContent = "演示页面暂时无法载入"; };
  if (activePoint.mobile) {
    const target = new URL(MINI_URL, location.href);
    target.search = "";
    target.hash = activePoint.route || "wechat";
    frame.src = target.href;
  } else {
    const target = new URL(APP_URL, location.href);
    target.searchParams.set("showcaseRev", ROUTE_REV);
    if (activePoint.task) target.searchParams.set("task", activePoint.taskRoute || activePoint.task);
    else target.searchParams.set("home", activePoint.home || "classic");
    target.hash = "";
    frame.src = target.href;
  }
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

$("#cover-enter").addEventListener("click", () => loadPoint(currentChapter, 0));
$("#cover-index").addEventListener("click", () => { menuOpen = true; renderPointMenu(); });
$("#note-next").addEventListener("click", nextPoint);
$("#note-prev").addEventListener("click", previousPoint);
$("#note-index").addEventListener("click", () => { menuOpen = !menuOpen; renderPointMenu(); });
$("#menu-close").addEventListener("click", () => { menuOpen = false; renderPointMenu(); });
$("#note-collapse").addEventListener("click", () => { showcase.classList.add("is-note-collapsed"); $("#design-note").hidden = true; $("#note-dock").hidden = false; });
$("#note-dock").addEventListener("click", () => { showcase.classList.remove("is-note-collapsed"); $("#design-note").hidden = false; $("#note-dock").hidden = true; });
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
