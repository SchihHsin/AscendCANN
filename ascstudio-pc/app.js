const APP_URL = "./studio/";
const MINI_URL = "../ascstudio-mini/";
const ROUTE_REV = "20261030-final-three-chapter-titles";
const LEARNING_PATH_PROMPT = "我会 Python，也理解 HWC 到 CHW。每天只有 15 分钟，我想从理解概念转为能核对模型的图像输入。请把熟悉的部分改成快速回顾，增加预处理顺序判断和模型输入签名核对，并把 NCHW 检查放到练习之后。";
const chapters = [
  {
    id: "learning", title: "让学习贴合个人目标与现有基础", cover: "从一张建议卡开始", summary: "从当前进度与问题获得学习建议，结合个人基础共创路径，再进入内容学习与实践。", art: "./assets/cover-learning.png", artAlt: "从学习建议出发，经过路径共创进入分步学习与实践的二维线描插画",
    points: [
      { id: "recommend", title: "基于当前进度推荐下一步", note: "基于用户当前进度与开发问题，推荐下一步学习。", emphasis: "推荐下一步学习", description: "基于用户当前进度与开发问题，推荐下一步学习。", entry: "新建任务 · 学习模式下的主动建议卡", home: "classic", mode: "学习", startView: "new-task", stage: "recommend" },
      { id: "co-create", title: "和 AI 一起调整学习路径", note: "结合个人基础和目标，和 AI 一起调整路径。", emphasis: "和 AI 一起调整路径", description: "结合个人基础和目标，和 AI 一起调整路径。", entry: "路径共创任务 · 输入框预填，等待发送", task: "图像输入预处理路径共创", group: "模型推理", stage: "path-prompt", prefill: LEARNING_PATH_PROMPT },
      { id: "resnet-path", title: "共创路径连接理解与实践", note: "让共创路径贯通理解、练习与结果核验。", emphasis: "理解、练习与结果核验", description: "让共创路径贯通理解、练习与结果核验。", entry: "ResNet50 离线推理初体验 · 第一学习节点", task: "ResNet50 离线推理初体验", group: "模型推理", stage: "resnet-entry" },
    ],
  },
  {
    id: "development", title: "在开发过程中掌握知识", cover: "从图解理解到经验回流", summary: "从图解理解问题依据，进入示例副本动手处理，再将经验整理并分享出去。", art: "./assets/cover-development.png", artAlt: "开发者围绕当前问题整理上下文、对比结果并理解原因的二维线描插画",
    points: [
      { id: "diagram", title: "打开图解看懂判断依据", note: "从关联图解看清排查线索与处理思路。", emphasis: "关联图解", description: "从关联图解看清排查线索与处理思路。", entry: "任务对话 · 定位尾块图解", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子", stage: "diagram" },
      { id: "edit", title: "在示例副本里动手修改", note: "在可编辑的示例副本中尝试修改，原始材料继续保留，方便对照和回看。", emphasis: "可编辑的示例副本", description: "在可编辑的示例副本中尝试修改，原始材料继续保留，方便对照和回看。", entry: "任务内容 · 示例工作副本编辑器", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子", stage: "draft" },
      { id: "return", title: "处理完成后回流经验", note: "完成处理后出现经验整理入口，让只留在个人对话中的经验有机会回到社区。", emphasis: "回到社区", description: "完成处理后出现经验整理入口，让只留在个人对话中的经验有机会回到社区。", entry: "任务完成 · 社区经验邀请", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子", stage: "invite" },
      { id: "community", title: "把处理过程整理成社区经验", note: "将问题、尝试和验证情况整理为草稿，补充后再决定是否提交。", emphasis: "整理为草稿", description: "将问题、尝试和验证情况整理为草稿，补充后再决定是否提交。", entry: "社区经验 · 草稿审阅", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子", stage: "community" },
      { id: "channels", title: "把经验带到更多平台", note: "同一份经验可按不同平台的表达方式整理，并提供 GitCode、CSDN 和抖音等分享入口。", emphasis: "GitCode、CSDN 和抖音", description: "同一份经验可按不同平台的表达方式整理，并提供 GitCode、CSDN 和抖音等分享入口。", entry: "社区经验 · 多渠道预览", task: "Add 算子精度差异排查", taskRoute: "AddCustom 精度异常", group: "CANN 自定义算子", stage: "channels" },
    ],
  },
  {
    id: "mobile", title: "让学习随时继续", cover: "把学习延伸到日常间隙", summary: "从电脑端收下知识，在手机上完成短读、回访和自主发现，并将理解状态带回任务。", art: "./assets/cover-mobile.png", artAlt: "在手机上查看学习内容、保存线索并继续学习的二维线描插画",
    points: [
      { id: "desktop-handoff", title: "从电脑端的一条回答，接上手机里的下一步", note: "入口就在正在处理的任务里", emphasis: "正在处理的任务里", description: "在 Agent 回答或学习内容里收下一条知识，标记感兴趣或还没弄懂，再选择即时送达或加入定期速览。", entry: "小程序 · 电脑端入口", route: "review-pending", mobile: true },
      { id: "instant-delivery", title: "电脑端选「现在看」，微信列表收到同一条知识", note: "让用户看清消息从哪里来", emphasis: "看清消息从哪里来", description: "发送后，手机微信会话列表出现带有知识标题的服务通知；手机样机与电脑端共用这一条内容。", entry: "小程序 · 即时学习", route: "review-instant", mobile: true },
      { id: "mobile-short-read", title: "手机短读卡，把一个知识点拆成几分钟", note: "把电脑上的内容整理成适合手机读的形式", emphasis: "适合手机读的形式", description: "从通知打开知识卡，用简明解释、重点和理解小题完成一次轻量学习；感兴趣或存疑也能继续保留。", entry: "小程序 · 知识短读卡", route: "wechat-notification/review", mobile: true },
      { id: "understanding-handoff", title: "看懂后回到电脑，理解状态也跟着回来", note: "内容和理解状态跨设备接续", emphasis: "理解状态跨设备接续", description: "手机端点「我看懂了」，电脑端知识口袋同步显示「已理解」，再回到原来的任务继续处理。", entry: "小程序 · 跨设备接续", route: "review-handoff/review", mobile: true },
      { id: "weekly-review", title: "把关注或存疑的内容，放进每周回访", note: "由用户选择主题、时间和授权", emphasis: "用户选择主题、时间和授权", description: "电脑端可将知识加入定期速览；手机端再选择主题、接收时间并确认订阅。", entry: "小程序 · 定期回访设置", route: "review-weekly-settings", mobile: true },
      { id: "weekly-briefing", title: "每周一条重点资讯，再补两张个性化卡片", note: "资讯与个人学习线索放在同一份速览里", emphasis: "同一份速览里", description: "速览用一条重点资讯开场，再优先带上电脑端安排的内容，并参考感兴趣或还没弄懂的信号。", entry: "小程序 · 每周速览", route: "review-briefing", mobile: true },
      { id: "discover", title: "没有当前任务，也能主动发现下一点新知", note: "知识推荐与主动探索互相补充", emphasis: "主动探索互相补充", description: "用户可以搜索、浏览分类或从推荐知识卡继续探索；发现的兴趣与问题还能成为之后回访的线索。", entry: "小程序 · 自主探索", route: "discover", mobile: true },
    ],
  },
];

const $ = selector => document.querySelector(selector);
const showcase = $("#showcase"), frame = $("#demo-frame"), cover = $("#chapter-cover");
const params = new URLSearchParams(location.search);
let currentChapter = Math.min(chapters.length - 1, Math.max(0, Number(params.get("chapter") || 1) - 1));
let currentPoint = Math.min(chapters[currentChapter].points.length - 1, Math.max(0, Number(params.get("pointIndex") || 0)));
let activePoint = null, menuOpen = false, loadingRevision = 0, loadedFrameHref = "", learningSyncCleanup = null;

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

function renderPointNote() {
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
}

function syncLearningPointToDemo(pointIndex) {
  if (currentChapter !== 0 || pointIndex === currentPoint || !chapters[0].points[pointIndex]) return;
  currentPoint = pointIndex;
  activePoint = chapters[0].points[pointIndex];
  menuOpen = false;
  renderPointMenu();
  renderPointNote();
  updateAddress("point");
}

function syncMobilePointFromDemo(pointIndex) {
  if (currentChapter !== 2 || showcase.dataset.view !== "stage" || !Number.isInteger(pointIndex) || pointIndex < 0 || pointIndex >= chapters[2].points.length || pointIndex === currentPoint) return;
  currentPoint = pointIndex;
  activePoint = chapters[2].points[pointIndex];
  renderPointMenu();
  renderPointNote();
  updateAddress("point");
}

function prefillLearningPrompt(doc, onlyIfBlank = true) {
  const input = doc.querySelector('textarea[aria-label="继续提问"]');
  if (!isVisible(input) || (onlyIfBlank && input.value.trim())) return false;
  const fillButton = visibleButton(doc, "button", "填入共创演示需求");
  if (fillButton) {
    fillButton.click();
    return true;
  }
  return false;
}

function syncLearningPointFromDemo(doc) {
  if (currentChapter !== 0 || showcase.dataset.view !== "stage") return;
  const task = selectedTaskLabel(doc);
  if (task === "ResNet50 离线推理初体验") {
    syncLearningPointToDemo(2);
    return;
  }
  if (task === "图像输入预处理路径共创" && currentPoint === 0) {
    syncLearningPointToDemo(1);
    requestAnimationFrame(() => prefillLearningPrompt(doc));
  }
}

function installLearningDemoSync(doc, revision) {
  learningSyncCleanup?.();
  if (currentChapter !== 0) return;
  let syncTimer = 0;
  const scheduleSync = () => {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      if (revision === loadingRevision) syncLearningPointFromDemo(doc);
    }, 160);
  };
  const handleClick = event => {
    if (event.target.closest(".new-task-home__card-summary, .new-task-home__card-continue, .new-task-home__card-chat, .task-suggestion-actions button, .new-task-button")) scheduleSync();
  };
  const handleFocus = event => {
    if (event.target.matches('textarea[aria-label="继续提问"]') && currentPoint === 0 && selectedTaskLabel(doc) === "图像输入预处理路径共创") {
      syncLearningPointToDemo(1);
      requestAnimationFrame(() => prefillLearningPrompt(doc));
    }
  };
  const observer = new MutationObserver(scheduleSync);
  doc.addEventListener("click", handleClick, true);
  doc.addEventListener("focusin", handleFocus, true);
  if (doc.body) observer.observe(doc.body, { childList: true, subtree: true });
  learningSyncCleanup = () => {
    clearTimeout(syncTimer);
    observer.disconnect();
    doc.removeEventListener("click", handleClick, true);
    doc.removeEventListener("focusin", handleFocus, true);
    learningSyncCleanup = null;
  };
  scheduleSync();
}

function selectedTaskLabel(doc) {
  return doc.querySelector(".task-title-button strong")?.textContent?.trim() || "";
}

function isVisible(element) {
  return Boolean(element && element.getClientRects().length && !element.closest("[hidden]"));
}

function visibleButton(doc, selector, text) {
  return [...doc.querySelectorAll(selector)].find(button => isVisible(button) && (!text || button.textContent.replace(/\s+/g, " ").trim().includes(text))) || null;
}

function applyPcStage(point, doc) {
  if (!point.stage) return true;
  const knowledgeCue = [...doc.querySelectorAll(".proactive-cue.is-knowledge")].find(isVisible);
  const draftPanel = doc.querySelector(".community-draft-panel");
  if (point.stage !== "community" && point.stage !== "channels" && isVisible(draftPanel)) {
    const close = visibleButton(doc, 'button[aria-label="关闭社区经验草稿"]');
    if (close) { close.click(); return false; }
  }

  const ensureInvite = () => {
    if (isVisible(doc.querySelector('[aria-label="任务完成后的社区经验邀请"]')) || isVisible(doc.querySelector(".community-draft-card"))) return true;
    const resolve = visibleButton(doc, "button", "标记为已解决");
    if (resolve) { resolve.click(); return false; }
    const overview = visibleButton(doc, 'button[aria-label="查看本任务全部内容"]');
    if (overview) { overview.click(); return false; }
    return false;
  };

  if (point.stage === "recommend") {
    const cards = [...doc.querySelectorAll(".new-task-home__card")].filter(isVisible);
    if (!cards.length) return Boolean(isVisible(doc.querySelector(".new-task-home__empty")));
    const matchingCard = cards.find(card => /图像预处理/.test(card.textContent)) || cards.find(card => /图像|输入 Shape/.test(card.textContent)) || cards[0];
    const summary = matchingCard.querySelector(".new-task-home__card-summary");
    if (summary && summary.getAttribute("aria-expanded") !== "true") summary.focus();
    return true;
  }

  if (point.stage === "path-prompt") {
    const input = doc.querySelector('textarea[aria-label="继续提问"]');
    if (!isVisible(input)) return false;
    if (input.value.trim() === point.prefill) return true;
    const fillButton = visibleButton(doc, "button", "填入共创演示需求");
    if (fillButton) { fillButton.click(); return false; }
    return false;
  }

  if (point.stage === "resnet-entry") {
    const firstStepNode = doc.querySelector('[data-learning-step="learning-official-step-image-classification"]');
    if (firstStepNode?.getAttribute("aria-pressed") === "true") return true;
    const firstStep = visibleButton(doc, ".task-suggestion-actions button", "从图像推理链路开始");
    if (firstStep) { firstStep.click(); return false; }
    return false;
  }

  if (point.stage === "knowledge") {
    const expand = knowledgeCue?.querySelector(".proactive-cue-expand");
    if (expand && isVisible(expand)) expand.click();
    return Boolean(knowledgeCue);
  }

  if (point.stage === "diagram") {
    if (isVisible(doc.querySelector('[aria-label="AddCustom 任务内容画布"]'))) return true;
    const diagramAction = knowledgeCue?.querySelector(".proactive-cue-secondary");
    if (diagramAction && isVisible(diagramAction) && /图解/.test(diagramAction.textContent)) { diagramAction.click(); return false; }
    const primary = knowledgeCue?.querySelector(".proactive-cue-primary");
    if (primary && isVisible(primary) && primary.textContent.includes("看尾块处理图解")) {
      primary.click();
      return false;
    }
    if (isVisible(doc.querySelector(".ex-panel"))) return true;
    const direct = visibleButton(doc, 'button[aria-label="打开线索解释完整内容"]') || visibleButton(doc, ".cm-code-link button", "对照图解");
    if (direct) { direct.click(); return false; }
    const cueExpand = knowledgeCue?.querySelector(".proactive-cue-expand");
    if (cueExpand && isVisible(cueExpand)) { cueExpand.click(); return false; }
    return false;
  }

  if (point.stage === "draft") {
    const editor = doc.querySelector('textarea[aria-label="编辑当前示例代码草案"]');
    if (isVisible(editor)) return true;
    const fullDraft = visibleButton(doc, 'button[aria-label="打开示例工作副本完整内容"]');
    if (fullDraft) { fullDraft.click(); return false; }
    if (!isVisible(doc.querySelector(".task-workspace"))) return false;
    const contentOpen = visibleButton(doc, "button", "打开内容");
    if (contentOpen) { contentOpen.click(); return false; }
    const trigger = visibleButton(doc, ".tw-content-trigger");
    const draftOption = visibleButton(doc, '.tw-content-option[role="menuitemradio"]', "示例工作副本");
    if (draftOption) { draftOption.click(); return false; }
    const pickerOption = visibleButton(doc, ".tw-material-open", "示例工作副本");
    if (pickerOption) { pickerOption.click(); return false; }
    const openOther = visibleButton(doc, '.tw-content-menu-foot button[role="menuitem"]', "打开其他内容");
    if (openOther) { openOther.click(); return false; }
    if (trigger && trigger.getAttribute("aria-expanded") !== "true") { trigger.click(); return false; }
    return false;
  }

  if (point.stage === "invite") {
    return ensureInvite();
  }

  if (point.stage === "community") {
    const overviewBack = visibleButton(doc, ".community-overview-back");
    if (overviewBack) { overviewBack.click(); return false; }
    if (isVisible(doc.querySelector('.community-draft-panel[aria-label="昇腾社区发布草稿"]')) || isVisible(doc.querySelector('.community-draft-panel[aria-label="社区经验草稿"]'))) return true;
    const generate = visibleButton(doc, ".community-entry-button", "生成草稿");
    if (generate) { generate.click(); return false; }
    const draftCard = visibleButton(doc, ".community-draft-card", "社区经验草稿已生成");
    if (draftCard) { draftCard.click(); return false; }
    if (!ensureInvite()) return false;
    return false;
  }

  if (point.stage === "channels") {
    if (isVisible(doc.querySelector(".community-draft-panel.is-channel-overview"))) return true;
    const channelLink = visibleButton(doc, ".community-channel-back");
    if (channelLink) { channelLink.click(); return false; }
    const generate = visibleButton(doc, ".community-entry-button", "生成草稿");
    if (generate) { generate.click(); return false; }
    const draftCard = visibleButton(doc, ".community-draft-card", "社区经验草稿已生成");
    if (draftCard) { draftCard.click(); return false; }
    if (!ensureInvite()) return false;
    return false;
  }

  return true;
}

function applyPcStart(point, attempt = 0, revision = loadingRevision) {
  if (revision !== loadingRevision) return;
  let doc;
  try { doc = frame.contentDocument; } catch { return; }
  if (!doc || !doc.querySelector("#root") || attempt > 22) { if (attempt < 22) setTimeout(() => applyPcStart(point, attempt + 1, revision), 180); return; }

  if (point.startView === "new-task" && !isVisible(doc.querySelector(".new-task-home"))) {
    const projectRail = visibleButton(doc, 'button[aria-label="项目与任务"]');
    if (projectRail && projectRail.getAttribute("aria-expanded") !== "true") { projectRail.click(); return setTimeout(() => applyPcStart(point, attempt + 1, revision), 180); }
    const newTaskButton = visibleButton(doc, ".new-task-button", "新建任务");
    if (newTaskButton) { newTaskButton.click(); return setTimeout(() => applyPcStart(point, attempt + 1, revision), 180); }
    if (attempt < 22) { setTimeout(() => applyPcStart(point, attempt + 1, revision), 180); return; }
  }

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
  if (!applyPcStage(point, doc) && attempt < 22) {
    setTimeout(() => applyPcStart(point, attempt + 1, revision), 180);
    return;
  }
  $("#loading-state").hidden = true;
  if (currentChapter === 0) installLearningDemoSync(doc, revision);
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
  learningSyncCleanup?.();
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
  renderPointNote();
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
  learningSyncCleanup?.();
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
$("#mobile-return").addEventListener("click", () => showChapterCover(2));
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

window.addEventListener("message", event => {
  if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
  if (event.data?.type === "ascstudio-mini-review-step") syncMobilePointFromDemo(event.data.index);
});

renderPointMenu();
const deepLink = location.hash.match(/^#chapter-(\d+)-([a-z0-9-]+)$/i);
if (deepLink) {
  const pointId = deepLink[2];
  const chapterIndex = chapters.findIndex(chapter => chapter.points.some(point => point.id === pointId));
  const pointIndex = chapterIndex >= 0 ? chapters[chapterIndex].points.findIndex(point => point.id === pointId) : -1;
  if (pointIndex >= 0) loadPoint(chapterIndex, pointIndex);
  else buildCover();
} else buildCover();
