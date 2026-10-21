import { useEffect, useRef, useState } from "react";
import { readSession, writeSession, sessionSaveAvailable } from "./session-storage";
import { useWorkbenchState, MAIN_TASK } from "./useWorkbenchState";
import { capabilities, modelOptions } from "./prototype-data";
import { WorkbenchDialogs } from "./WorkbenchDialogs";
import { ActionWorkspace } from "./ActionWorkspace";
import { useTaskFlow } from "./useTaskFlow";
import { useExplanationSession } from "./useExplanationSession";
import { useCanvasState } from "./useCanvasState";
import { useContentWorkspace } from "./useContentWorkspace";
import { MATERIAL_DEFINITIONS, getMaterialMeta } from "./workspace-materials";
import { TaskWorkspace } from "./TaskWorkspace";
import { ReferenceBrowser } from "./ReferenceBrowser";
import { useWorkbenchLayout } from "./useWorkbenchLayout";
import { TaskCanvas } from "./TaskCanvas";
import { CanvasMaterial } from "./CanvasMaterials";
import { TaskContentOverview } from "./TaskContentOverview";
import { CONTENT_CATEGORIES, getContentGroups, buildTaskContentItems } from "./task-content-catalog";
import { IMAGE_TASK, IMAGE_MATERIALS, useImageInference, imageShape, imageCode } from "./useImageInference";
import { ImageInferenceMaterial, TensorDiagram } from "./ImageInference";
import { RangeDiagram, getRangeGeometry } from "./RangeDiagram";
import { classifyTaskIntent, getExplanationFocus } from "./task-intents";
import ProactiveCue from "./ProactiveCue.jsx";
import { useProactiveCues } from "./useProactiveCues.js";
import { LEARNING_TASK, LEARNING_MATERIALS } from "./learning-data";
import { useLearningJourney } from "./useLearningJourney";
import { useLearningCanvasView } from "./useLearningCanvasView";
import { LearningHierarchyCanvas } from "./LearningHierarchyCanvas";
import { LearningJourneyMaterial } from "./LearningJourney";
import { NewTaskHome } from "./NewTaskHome";
import { buildHomeSuggestions } from "./home-recommendations";
import { buildLearningContentItems } from "./learning-content-catalog";
import "./interaction.css";
import "./visual-focus.css";
import {
  IconAdjustmentsHorizontal,
  IconAlertTriangle,
  IconArrowRight,
  IconBell,
  IconBook,
  IconBooks,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconCode,
  IconCopy,
  IconDatabase,
  IconDots,
  IconFileText,
  IconFolder,
  IconLibrary,
  IconLock,
  IconMessageCircle,
  IconPaperclip,
  IconPhoto,
  IconPlayerPlay,
  IconPlus,
  IconSearch,
  IconSend,
  IconSettingsAutomation,
  IconThumbDown,
  IconThumbUp,
  IconBulb,
  IconX,
} from "@tabler/icons-react";

const routes = [
  {
    id: "tail",
    title: "核对尾块索引范围",
    sub: "只读检查 · 暂不修改代码",
    reason: "依据：仅非整块输入失败",
  },
  {
    id: "precision",
    title: "检查误差分布",
    sub: "还需逐元素精度证据",
    reason: "用于判断精度误差是否集中在特定位置",
  },
  {
    id: "retry",
    title: "更换 AI 重试",
    sub: "不会增加新的诊断证据",
    reason: "建议先保留当前错误与已尝试动作",
  },
];

function ProjectSection({ group, opened, query, selectedTask, onToggle, onSelect }) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchesProject = normalizedQuery && group.name.toLowerCase().includes(normalizedQuery);
  const filteredTasks = matchesProject
    ? group.tasks
    : group.tasks.filter((task) => task.toLowerCase().includes(normalizedQuery));
  if (normalizedQuery && filteredTasks.length === 0) return null;
  return (
    <section className="project-section">
      <button
        className="project-heading"
        type="button"
        aria-expanded={opened}
        aria-controls={"project-" + group.id}
        onClick={onToggle}
      >
        {opened ? <IconChevronDown size={15} /> : <IconChevronRight size={15} />}
        <IconFolder className="project-folder" size={18} />
        <span className="project-name">{group.name}</span>
        <span className="project-count">{group.tasks.length}</span>
      </button>
      {opened && (
        <div className="project-tasks" id={"project-" + group.id}>
          {filteredTasks.map((task) => (
            <button
              className={"task-row" + (selectedTask === task ? " is-selected" : "")}
              type="button"
              aria-current={selectedTask === task ? "page" : undefined}
              key={task}
              onClick={() => onSelect(task)}
            >
              <IconFileText className="task-file" size={17} />
              <span>{task}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function App() {
  const wb = useWorkbenchState();
  const [showNewTaskHome, setShowNewTaskHome] = useState(false);
  const [pendingRecommendationAction, setPendingRecommendationAction] = useState(null);
  const [saveAvailable, setSaveAvailable] = useState(sessionSaveAvailable);
  useEffect(() => {
    const update = () => setSaveAvailable(sessionSaveAvailable());
    window.addEventListener("ascstudio-save-status", update);
    update();
    return () => window.removeEventListener("ascstudio-save-status", update);
  }, []);
  const flow = useTaskFlow({ onRecord: (title, summary, kind, isDemo) => wb.addRecord({ title, summary, kind, isDemo }, MAIN_TASK) });
  const diagnosisTargetRef = useRef(null);
  const proactive = useProactiveCues(`${MAIN_TASK}:${flow.state.resetVersion}`);
  const canvas = useCanvasState({ startEmpty: true, storageKey: "canvas-addcustom" });
  const imageCanvas = useCanvasState({ startEmpty: true, cardDefinitions: IMAGE_MATERIALS, storageKey: "canvas-image" });
  const [precisionContext, setPrecisionContext] = useState(() => readSession("precision-context", null));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readSession("sidebar-collapsed", false));
  useEffect(() => { writeSession("sidebar-collapsed", sidebarCollapsed); }, [sidebarCollapsed]);
  useEffect(() => { writeSession("precision-context", precisionContext); }, [precisionContext]);
  const previousImage = useRef(null);
  const previousPrecision = useRef(precisionContext);
  const previousFlow = useRef({ attempts: flow.state.attempts.length, proposal: flow.state.proposedCode, applied: flow.state.appliedCode, validation: flow.state.validation });
  const [taskContentsOpen, setTaskContentsOpen] = useState(false);
  const {
    query, setQuery, openedGroups, selectedTask, rationaleOpen, setRationaleOpen,
    visibleGroups, toggleGroup, selectTask, setSelectedRoute,
    session, task, currentGroup, isMainTask,
    openDialog, openMenu, sendMessage, setDraft, toast,
  } = wb;
  const selectExistingTask = (name) => { selectTask(name); setShowNewTaskHome(false); };
  const { selectedRoute, draft, messages } = session;
  const selectedRouteData = routes.find((route) => route.id === selectedRoute) || routes[0];
  const feedback = (value) => wb.patchSession({ feedback: session.feedback === value ? null : value });
  const closeMenuAnd = (action) => { wb.setMenu(null); action(); };
  const isImageTask = selectedTask === IMAGE_TASK;
  const isLearningTask = task.kind === "learning";
  const learningLaunchHandled = useRef(false);
  useEffect(() => {
    if (learningLaunchHandled.current) return;
    learningLaunchHandled.current = true;
    if (new URLSearchParams(window.location.search).get("task") === "learning") {
      setShowNewTaskHome(false);
      wb.selectTask(LEARNING_TASK);
      wb.setQuery("");
      wb.setFilterScope("all");
      wb.setOpenedGroups(groups => groups.includes("inference") ? groups : [...groups, "inference"]);
      const address = new URL(window.location.href);
      address.searchParams.delete("task");
      window.history.replaceState(null, "", address.pathname + address.search + address.hash);
    }
  }, []);
  const isInteractiveTask = isMainTask || isImageTask || isLearningTask;
  const workspace = useContentWorkspace({ taskId: selectedTask, isMainTask: isInteractiveTask, initialMaterialId: isLearningTask ? "learning-goal" : undefined, defaultToLearningCanvas: isLearningTask });
  const layout = useWorkbenchLayout({ sidebarCollapsed, contentCollapsed: workspace.state.collapsed, learningLayout: isLearningTask });
  const visibleContentId = layout.contentWidth <= 620 && workspace.state.splitId && [workspace.state.activeId, workspace.state.splitId].includes(workspace.state.comparisonFocusId) ? workspace.state.comparisonFocusId : workspace.state.activeId;
  const contentVisible = id => !workspace.state.collapsed && workspace.state.activeId !== "canvas" && (layout.contentWidth <= 620 ? visibleContentId === id : workspace.state.activeId === id || workspace.state.splitId === id);
  const learningCanvasView = useLearningCanvasView({ taskId: isLearningTask ? selectedTask : "__inactive-learning", enabled: isLearningTask });
  const learningCanvasVisible = isLearningTask && !workspace.state.collapsed && workspace.state.activeId === "canvas" && workspace.state.canvasMode === "free";
  const learning = useLearningJourney({ taskId: isLearningTask ? selectedTask : "__inactive-learning", profile: task.learningProfile, visible: isLearningTask && (contentVisible("learning-lesson") || learningCanvasVisible && learningCanvasView.state.expanded && ["channels", "environment"].includes(learningCanvasView.state.selectedStage)), onRecord: (record, ownerId) => { wb.addRecord(record, ownerId); const id = ({ "learning-path": "learning-path", "learning-attempt": "learning-practice", "learning-check": "learning-check", "learning-summary": "learning-summary" })[record.kind]; if (id) workspace.actions.open(id, { activate: false, taskId: ownerId, isMainTask: true }); } });
  const learningCanvas = useCanvasState({ startEmpty: true, cardDefinitions: LEARNING_MATERIALS, storageKey: `canvas-learning-${isLearningTask ? selectedTask : "__inactive-learning"}` });
  const learningCanvasMaterial = !learning.state.path && !learning.state.draftPath ? "learning-goal" : ({ goal: "learning-goal", path: "learning-path", environment: "learning-lesson", channels: "learning-lesson", practice: "learning-practice", check: "learning-check", summary: "learning-summary" })[learningCanvasView.state.selectedStage];
  const learningCanvasMaterialIds = learningCanvasVisible && learningCanvasView.state.expanded && learningCanvasMaterial ? [learningCanvasMaterial] : [];
  useEffect(() => {
    if (!learningCanvasVisible || !learningCanvasView.state.expanded || !learningCanvasMaterial) return;
    workspace.actions.open(learningCanvasMaterial, { activate: false, restore: true, viewedInCanvas: true });
  }, [selectedTask, learningCanvasVisible, learningCanvasView.state.expanded, learningCanvasMaterial]);
  const imageVisible = isImageTask && contentVisible("image-explanation");
  const inference = useImageInference({ visible: imageVisible, onRecord: record => wb.addRecord(record, IMAGE_TASK) });
  const explanationVisible = isMainTask && contentVisible("explanation");
  const explanation = useExplanationSession({ resetVersion: flow.state.resetVersion, visible: explanationVisible });
  const mainSession = wb.getSession(MAIN_TASK);
  const imageSession = wb.getSession(IMAGE_TASK);
  const imageAttachment = [...imageSession.messages.flatMap(item => item.attachments || []), ...imageSession.attachments].filter(file => file.content && (file.type === "code" || /\.py$/i.test(file.name))).sort((a, b) => (a.receivedOrder || 0) - (b.receivedOrder || 0)).at(-1);
  const mainAttachment = [...mainSession.messages.flatMap(item => item.attachments || []), ...mainSession.attachments]
    .filter(file => file.content && (file.type === "code" || /\.(cpp|h|py)$/i.test(file.name)))
    .sort((a, b) => (a.receivedOrder || 0) - (b.receivedOrder || 0)).at(-1);
  const openContent = (id, options = {}) => {
    if (!isInteractiveTask && id !== "task-brief") return;
    if (isImageTask && !id.startsWith("image-") && !id.startsWith("record:") && !id.startsWith("snapshot:") && !id.startsWith("attempt:") && id !== "canvas") return;
    if (isLearningTask && !id.startsWith("learning-") && !/^(record:|snapshot:|attempt:)/.test(id) && id !== "canvas") return;
    if (options.close) workspace.actions.close(options.close);
    if (isLearningTask && LEARNING_MATERIALS.some(item => item.id === id)) {
      if (id === "learning-lesson" && options.anchor) learningCanvasView.actions.select("channels", options.anchor);
      else learningCanvasView.actions.openMaterial(id);
      workspace.actions.open(id, { ...options, activate: false, restore: true, viewedInCanvas: true });
      workspace.actions.openCanvas({ mode: "free" });
      setTaskContentsOpen(false);
      return;
    }
    if ((id === "explanation" || id === "source") && options.anchor) explanation.actions.focusConcept(options.anchor);
    if (id === "explanation" && (options.time !== undefined || options.video)) explanation.actions.openAt({ focus: options.anchor || explanation.state.focus, time: options.time, video: options.video });
    if (id === "compare") {
      workspace.actions.open("source");
      workspace.actions.splitWith("draft");
    } else {
      if (id === "diff" && !options.prepared && !options.restore && !flow.state.proposedCode) flow.actions.prepareDiff();
      if (options.split) workspace.actions.splitWith(id, options);
      else workspace.actions.open(id, options);
    }
    setTaskContentsOpen(false);
  };
  const updateOverview = (patch, ownerId = selectedTask) => {
    if (Array.isArray(patch.compactIds)) {
      const ownerCanvas = wb.getTask(ownerId).kind === "learning" ? learningCanvas : ownerId === IMAGE_TASK ? imageCanvas : canvas;
      ownerCanvas.state.cards.filter(card => card.opened).forEach(card => {
        if (Boolean(card.collapsed) !== patch.compactIds.includes(card.id)) ownerCanvas.actions.toggleCollapse(card.id);
      });
    }
    workspace.actions.setOverview(patch, ownerId);
  };
  const closeContent = (id) => {
    const ownerCanvas = isLearningTask ? learningCanvas : isImageTask ? imageCanvas : canvas;
    const card = ownerCanvas.state.cards.find(item => item.id === id);
    if (card?.opened && !card.collapsed) ownerCanvas.actions.toggleCollapse(id);
    workspace.actions.close(id);
  };
  const compareExplanation = () => {
    workspace.actions.open("source");
    workspace.actions.splitWith("explanation");
    setTaskContentsOpen(false);
  };
  const askExplanation = (context) => {
    if (isLearningTask) {
      const focus = context.focus || "layout";
      const sourceContext = { ...context, kind: "learning", stamp: `${String(Math.floor(context.time / 60)).padStart(2, "0")}:${String(Math.floor(context.time % 60)).padStart(2, "0")}` };
      const reply = { channels: "RGB 的每个像素有三个数值。HWC 的最后一维 C=3，表示颜色通道；224×224 是空间尺寸。", layout: "transpose(2,0,1) 按输入轴 2、0、1 取出 C、H、W，得到 CHW [3,224,224]。维度含义随轴移动，数据不会凭空增减。", batch: "CHW 前增加 N=1 表示一个样本，得到 NCHW [1,3,224,224]。batch 与通道是不同维度。" }[focus];
      if (wb.addExchange({ text: `请解释 ${sourceContext.stamp} 这句：“${context.subtitle}”`, sourceContext }, { text: reply, sourceContext })) {
        learning.actions.seek(context.time || 0);
        openContent("learning-lesson", { anchor: focus });
      }
      return;
    }
    if (!wb.askFromExplanation(context)) return;
    if (context.kind === "image") {
      inference.actions.focus(context.focus);
      openContent("image-explanation");
    } else openContent("explanation", { anchor: context.focus });
  };
  const openCanvas = (options = {}) => {
    if (!isInteractiveTask) return;
    const mode = options.mode || "overview";
    const targetCanvas = isLearningTask ? learningCanvas : isImageTask ? imageCanvas : canvas;
    if (isLearningTask && mode === "free") {
      workspace.actions.openCanvas({ mode: "free" });
      setTaskContentsOpen(false);
      return;
    }
    if (mode === "overview" && !workspace.state.visitedTabs.some(item => item.id === "canvas") && getTaskItems(selectedTask).length > 2) workspace.actions.setOverview({ compactIds: getTaskItems(selectedTask).map(item => item.id) });
    if (mode === "free") {
      let added = false;
      const items = getTaskItems(selectedTask);
      items.forEach(item => {
        const existing = targetCanvas.state.cards.find(card => card.id === item.id);
        if (existing?.opened) return;
        added = true;
        if (existing) targetCanvas.actions.showCard(item.id, { focus: false, collapsed: workspace.state.overview.compactIds.includes(item.id) });
        else targetCanvas.actions.addCard({ ...getMaterialMeta(item.id), width: 420, height: 300, collapsed: workspace.state.overview.compactIds.includes(item.id) }, { focus: false });
      });
      if (added) requestAnimationFrame(() => targetCanvas.actions.fitCanvas());
    }
    if (mode === "free") targetCanvas.state.cards.filter(card => card.opened).forEach(card => { if (Boolean(card.collapsed) !== workspace.state.overview.compactIds.includes(card.id)) targetCanvas.actions.toggleCollapse(card.id); });
    workspace.actions.openCanvas({ mode, fit: options.fit });
    setTaskContentsOpen(false);
  };
  const restoreContent = (id) => {
    const saved = workspace.getTaskState(selectedTask).snapshots.find(item => item.id === id) || wb.getSession(selectedTask).records.find(item => "record:" + item.id === id);
    const indexed = getTaskItems(selectedTask).flatMap(item => [item, ...(item.children || [])]).find(item => item.id === id);
    if (saved?.parentId || indexed?.parentId) workspace.actions.markRead(saved?.parentId || indexed.parentId);
    openContent(id, { restore: true, ...((saved || indexed) ? { title: (saved || indexed).title, type: indexed?.parentId || saved ? "preview" : indexed.type } : {}) });
  };
  const compareContent = id => {
    const item = getTaskItems(selectedTask).flatMap(entry => [entry, ...(entry.children || [])]).find(entry => entry.id === id);
    if (!item || item.available === false) return;
    workspace.actions.splitWith(id, { restore: true, title: item.title, type: id.startsWith("snapshot:") || id.startsWith("record:") || id.startsWith("attempt:") ? "preview" : item.type });
    if (item.parentId) workspace.actions.markRead(item.parentId);
  };
  const arrangeMaterials = (ids) => {
    if (!isInteractiveTask) return;
    if (isLearningTask) {
      const materialId = ids.find(id => LEARNING_MATERIALS.some(item => item.id === id));
      if (materialId) openContent(materialId, { restore: true });
      else if (ids[0]) restoreContent(ids[0]);
      else workspace.actions.openCanvas({ mode: "free" });
      return;
    }
    const targetCanvas = isLearningTask ? learningCanvas : isImageTask ? imageCanvas : canvas;
    [...new Set(ids)].filter(id => id !== "canvas").forEach(id => {
      const card = targetCanvas.state.cards.find(item => item.id === id);
      if (card) targetCanvas.actions.showCard(id, { focus: false });
      else targetCanvas.actions.addCard({ ...getMaterialMeta(id), width: 440, height: 340 }, { focus: false });
      workspace.actions.open(id, { activate: false, restore: true });
    });
    workspace.actions.openCanvas({ mode: "free" });
    setTaskContentsOpen(false);
    requestAnimationFrame(() => targetCanvas.actions.fitCanvas());
  };
  const changeActionView = (view) => {
    if (view === "code" || view === "precision") wb.patchSession({ selectedRoute: view === "code" ? "tail" : "precision" });
    openContent(view === "code" ? "source" : view);
  };
  // Explicit user requests may open a related view. Reply/record arrivals never navigate.
  const dispatchTaskIntent = (intent, focus, target = null) => {
    const explainId = isImageTask ? "image-explanation" : "explanation";
    if (isMainTask && flow.state.busy && ["review", "check"].includes(intent) && !target) return;
    if (intent === "explain" || intent === "try") {
      if (isImageTask) { inference.actions.explore(); inference.actions.focus(focus); }
      else { explanation.actions.startExplore(); explanation.actions.focusConcept(focus); }
      openContent(explainId);
    } else if (intent === "review") {
      const prepared = isImageTask ? inference.actions.prepareCurrent() : flow.actions.prepareDiff({ current: true });
      openContent(prepared ? (isImageTask ? "image-diff" : "diff") : explainId, { prepared: Boolean(prepared) });
    } else if (intent === "check") {
      if (target) { openContent(target); return; }
      if (isImageTask && inference.state.applied) { inference.actions.validate(); openContent("image-validation"); }
      else if (isMainTask && flow.state.appliedCode) { flow.actions.runValidation(); openContent("validation"); }
      else {
        if (isImageTask) { inference.actions.explore(); inference.actions.run(); }
        else { explanation.actions.startExplore(); flow.actions.runTrial(); }
        openContent(explainId);
      }
    }
  };
  const taskIntentReply = (intent, focus, target = null) => {
    const scope = "这里只演算浏览器示例，未执行项目代码或模型，也未验证 NPU。";
    if (intent === "check" && target) return target === "precision"
      ? "已打开误差核对。需要实际逐元素输出与容差，核对后再判断误差是否集中在特定位置。范围算例不能替代精度证据。"
      : "已打开只读代码来源，便于核对实际循环或模型输入约定。没有执行项目；请关联真实代码、模型签名与运行证据。";
    if (intent === "diagnose") return isImageTask
      ? "先对照输入形状与模型约定：当前示例需要 NCHW [1,3,224,224]。轴顺序、batch、dtype 与归一化都需核对真实代码和模型签名。\n\n可以展开维度图解理解这条线索；当前阅读与编辑位置保留。"
      : "非整块输入失败使尾块范围值得优先核对；它仍是线索，根因尚未确认。还需实际循环、逐元素误差与两次运行条件。\n\n可以展开范围图解理解这条线索；当前阅读与编辑位置保留。";
    if ((intent === "review" || intent === "check") && isMainTask && flow.state.busy) return "当前示例检查正在进行，请等结果完成后再继续审阅或检查。参数与尝试会保留。";
    if (intent === "review") {
      const valid = isImageTask ? imageShape(inference.state).valid : getRangeGeometry(flow.state).valid;
      return valid ? "已根据当前参数准备 Diff，旁边保留这次尝试的依据。审阅后再确认应用到浏览器示例副本。\n\n真实项目文件保持只读，尚未写入或执行。" : "当前参数无效，修改预览还不能生成。请先在图解里修正参数；已有尝试与阅读现场保留。";
    }
    if (intent === "check" && (isImageTask ? inference.state.applied : flow.state.appliedCode)) return "正在接续已应用示例副本的核对，结果会保留在本任务。\n\n" + scope;
    if (isImageTask) {
      const shape = imageShape(inference.state);
      if (!shape.valid) return "当前轴顺序无效：0、1、2 每个轴只能出现一次。可以在图解内修正，结果会原位更新。\n\n" + scope;
      const detail = focus === "channels" ? "RGB 每个像素包含三个通道，原图是 HWC [224,224,3]。通道分层图与当前图像对应。"
        : focus === "batch" ? `当前${inference.state.batch ? "加入" : "未加入"} batch，输出为 ${shape.labels.join("")} [${shape.dimensions.join(",")}]。batch 表示样本数，需要与模型签名一致。`
        : `transpose(${inference.state.axes.join(",")}) 将原来的 H、W、C 轴按当前顺序排列；输出为 ${shape.labels.join("")} [${shape.dimensions.join(",")}]。`;
      return detail + (intent === "check" ? "\n\n这次形状检查已保留；" : "\n\n图解已展开，参数可直接调整，形状与代码在原处更新；") + scope;
    }
    const range = getRangeGeometry(flow.state);
    if (!range.valid) return range.error + "\n\n图解保留当前参数，修正后即可继续；" + scope;
    const detail = focus === "total" ? `[${range.rows},${range.columns}] 共 ${range.total} 个元素，每块 ${range.tileSize} 个，分为 ${range.blocks} 块。`
      : focus === "access" ? `当前策略访问至索引 ${range.maxAccessIndex}，有效索引截止 ${range.lastValidIndex}，涉及 ${range.outOfRange} 个范围外位置。`
      : `最后一块从索引 ${range.lastBlockStart} 开始，有 ${range.lastBlockValid} 个有效元素；${range.hasTail ? `按整块访问会多涉及 ${range.unusedSlots} 个位置。` : "当前输入没有不足一块的尾块。"}`;
    return detail + (intent === "check" ? "\n\n这次范围检查会保留；" : "\n\n图解已展开，参数可直接调整，图形与结果在原处更新；") + "尾块仍是待核查线索。" + scope;
  };
  const handleSendMessage = (event) => {
    const text = draft.trim();
    if (isLearningTask) {
      event?.preventDefault();
      if (!text || session.replying) return;
      let action = () => openContent("learning-goal");
      let replyText = "目标与基础已保留。可以在右侧修改，再生成或选用图像输入预处理的示例路径。";
      if (/取消.*(?:路径|调整|变更)|(?:路径|调整|变更).*取消/.test(text)) {
        action = () => { learning.actions.cancelPath(); openContent("learning-path"); };
        replyText = "已取消路径调整，保留原来已确认的路径与学习记录。";
      } else if (/跳过.*环境|环境.*(?:准备好|配置好|已配|已准备)/.test(text)) {
        action = () => { const entry = (learning.state.draftPath || learning.state.path)?.find(node => node.id === "environment"); if (!entry?.skipped) learning.actions.editPath("environment", "skip"); openContent("learning-path"); };
        replyText = "已把跳过环境准备放进路径预览。理解 → 跟练 → 输入检查继续保留；确认后才更新路径。";
      } else if (/恢复.*环境|环境.*恢复/.test(text)) {
        action = () => { const entry = (learning.state.draftPath || learning.state.path)?.find(node => node.id === "environment"); if (entry?.skipped) learning.actions.editPath("environment", "skip"); openContent("learning-path"); };
        replyText = "已准备恢复环境节点的调整预览，等待确认。";
      } else if (/确认.*(?:路径|开始|调整)|开始学习/.test(text)) {
        action = () => { if (learning.state.draftPath) learning.actions.confirmPath(); openContent("learning-path"); };
        replyText = learning.state.draftPath ? "已确认学习路径，可以从保留的节点继续。" : "已打开当前路径；若尚未准备草案，先生成或选用路径。";
      } else if (/生成.*路径|准备.*路径|选用.*路径|调整.*路径/.test(text)) {
        action = () => { learning.actions.generatePath(/选用/.test(text) ? "existing" : "goal"); openContent("learning-path"); };
        replyText = "已准备可审阅的示例路径。你可以调整环境节点，确认后进入理解、跟练与检查。";
      } else if (/输入.*(?:检查|核对)|核对.*输入/.test(text)) {
        action = () => openContent("learning-check");
        replyText = "已打开本次输入检查；明确运行检查后才保存结果，旧记录继续保留。";
      } else if (/完成|保存|小结|成果|总结/.test(text)) {
        action = () => openContent(learning.state.summaries.length ? "learning-summary" : "learning-check");
        replyText = "完成记录需要理解节点、当前跟练通过及对应输入检查。已有记录可以回看，保存由当前内容中的操作完成。";
      } else if (/跟练|练习|试一下|试改|代码/.test(text)) {
        action = () => openContent("learning-practice");
        replyText = "已打开隔离跟练。可以调整轴顺序与 batch，再运行形状检查；结果会按本次参数保留。";
      } else if (/图解|讲解|为什么|怎么理解|通道|batch|张量|维度/i.test(text)) {
        action = () => openContent("learning-lesson");
        replyText = "已展开图像与输入维度讲解。HWC 的轴 0、1、2 是 H、W、C；transpose(2,0,1) 得到 CHW，再加 batch 得到 NCHW。可以在当前片段继续提问。";
      } else if (/路径|继续学习/.test(text)) {
        action = () => openContent("learning-path"); replyText = "已找回这份学习路径与原记录，没有重新生成或运行检查。";
      } else if (/全部|找回|恢复/.test(text)) {
        action = () => openCanvas(); replyText = "已打开本任务的内容与记录，可以恢复原对象及尝试。";
      }
      if (sendMessage(event, { replyText })) action();
      return;
    }
    const restore = isInteractiveTask && /^(?:请)?(?:帮我)?(?:打开|回到|恢复|找回|再看|唤醒|查看)/.test(text) && /刚才|之前|上次|那份|解释|图解|张量|误差|核对|尝试|记录|diff|修改预览|来源/i.test(text);
    if (restore) {
      const items = getTaskItems(selectedTask);
      const aliases = isImageTask ? [
        [/图解|解释|张量|讲解|通道/, "image-explanation"], [/diff|修改预览/i, "image-diff"], [/核对|验证/, "image-validation"], [/尝试|形状|记录/, "image-attempts"], [/来源|代码/, "image-source"],
      ] : [[/误差|精度|容差/, "precision"], [/diff|修改预览/i, "diff"], [/复核|验证/, "validation"], [/尝试|范围检查|记录/, "attempts"], [/图解|解释|讲解/, "explanation"], [/来源|代码/, "source"]];
      const target = aliases.find(([pattern]) => pattern.test(text))?.[1];
      const item = items.find(value => value.id === target);
      const replyText = item ? /之前|上次/.test(text) ? `已定位「${item.title}」的历史记录，可按时间与条件选择一份。没有重新生成或运行检查。` : `已找回「${item.title}」。保留原参数、阅读现场与已有记录，没有重新生成或运行检查。` : "已打开本任务的内容总览，可按用途或关键词找回已有内容。重新运行需要另行操作。";
      const accepted = sendMessage(event, { replyText });
      if (accepted) {
        if (item && !/之前|上次/.test(text)) restoreContent(item.id);
        else { workspace.actions.setOverview({ category: item?.category || "all", query: "", collapsedGroups: [], compactIds: workspace.state.overview.compactIds.filter(id => id !== item?.id), historyId: item?.id || null }); openCanvas(); }
      }
      return;
    }
    const intent = isInteractiveTask ? classifyTaskIntent(text) : "none";
    const requestedFocus = getExplanationFocus(text, isImageTask);
    const focus = requestedFocus === "structure" ? "total" : requestedFocus;
    const target = intent === "check"
      ? isMainTask && /误差|精度|容差|precision|tolerance/i.test(text) ? "precision"
        : /实际(?:代码|循环|模型)|真实(?:代码|项目|模型)|模型签名|原文件|源码/i.test(text) ? (isImageTask ? "image-source" : "source") : null
      : null;
    const accepted = sendMessage(event, intent === "none" ? {} : {
      interaction: { intent, focus, target }, replyText: taskIntentReply(intent, focus, target),
    });
    if (accepted && isInteractiveTask) dispatchTaskIntent(intent, focus, target);
  };
  const confirmWorkspaceRoute = () => {
    if (selectedRoute === "retry") wb.confirmRoute();
    else changeActionView(selectedRoute === "tail" ? "code" : "precision");
  };
  const latestAttempt = flow.state.attempts.find(attempt => attempt.id === flow.state.selectedAttemptId) || flow.state.attempts.at(-1);
  const renderBrief = (ownerId) => <div className="diagnostic-scroll">
    <section className="task-brief-section"><div className="section-title"><IconFileText size={18} /><h3>任务简报</h3></div><div className="task-brief-card"><strong>{ownerId}</strong><p>{wb.getTask(ownerId).goal}</p><span>待补充证据</span></div></section>
    <section className="task-brief-section"><div className="section-title"><IconDatabase size={18} /><h3>上下文与材料</h3></div><div className="task-brief-card"><p>补充代码、日志与运行条件后，再确定检查方向。</p><button type="button" className="light-button" onClick={() => openDialog("code")}><IconCode size={15} />补充代码片段</button><button type="button" className="light-button" onClick={() => { setDraft("请帮我整理当前任务的环境条件、需要补充的证据和下一步检查清单。"); wb.draftRef.current?.focus(); }}><IconMessageCircle size={15} />整理检查清单</button></div></section>
    <p className="action-footnote">任务内容仅用于本地交互演示，尚未接入 AI 或硬件服务。</p>
  </div>;
  const archiveLearning = () => { openContent("learning-summary", { restore: true }); workspace.actions.setCollapsed(true); };
  const enterLearningDevelopment = () => { const saved = learning.currentSummary; wb.addExchange("把学过的方法用于图像推理。", "学习记录保留在原任务；接下来核对开发任务的真实输入约定，继续修改审阅与项目验证。"); if (saved) wb.addExchange("带入已保存的学习记录，继续图像推理开发。", { text: `学习参考：${saved.profile.goal}\n\n示例已核对 NCHW [${saved.dimensions.join(",")}]；真实模型签名、预处理及推理仍需在本任务验证。`, learningReference: { taskId: selectedTask, summaryId: saved.id } }, IMAGE_TASK); selectExistingTask(IMAGE_TASK); };
  const renderMaterial = (id, presentation = "canvas", ownerId = MAIN_TASK) => {
    if (wb.getTask(ownerId).kind === "learning") {
      if (ownerId !== selectedTask) return null;
      if (/^(attempt:learning:|snapshot:learning-)/.test(id)) {
        const saved = id.startsWith("attempt:") ? learning.state.attempts.find(item => `attempt:learning:${item.id}` === id) : id.startsWith("snapshot:learning-check:") ? learning.state.checks.find(item => `snapshot:learning-check:${item.id}` === id) : learning.state.summaries.find(item => `snapshot:learning-summary:${item.id}` === id);
        return saved ? <article className="content-snapshot"><header><strong>{id.startsWith("attempt:") ? "跟练尝试" : id.startsWith("snapshot:learning-check:") ? "输入检查" : "学习完成记录"}</strong><small>{saved.time} · 只读历史</small></header>{saved.profile && <p>{saved.profile.goal}</p>}<p>transpose({saved.snapshot.axes.join(",")}) · batch {saved.snapshot.batch ? "有" : "无"} · {saved.dimensions?.length ? `[${saved.dimensions.join(",")}]` : "轴顺序无效"}</p>{saved.code && <pre>{saved.code}</pre>}<p className="cm-note">保存时的学习条件；查看不会运行检查，真实模型尚未运行。</p></article> : null;
      }
      if (id.startsWith("record:")) {
        const record = wb.getSession(ownerId).records.find(item => `record:${item.id}` === id);
        return record ? <article className="content-snapshot"><header><strong>{record.title}</strong><small>{record.time} · 只读记录</small></header><p>{record.summary}</p>{record.data?.profile && <p>{record.data.profile.background} · 每天 {record.data.profile.dailyMinutes} 分钟</p>}</article> : null;
      }
      return <LearningJourneyMaterial id={id} journey={learning} onOpen={openContent} onAsk={askExplanation} onCopy={wb.copyText} presentation={presentation} onArchive={archiveLearning} onEnterDevelopment={enterLearningDevelopment} />;
    }
    if (id === "task-brief") return renderBrief(ownerId);
    if (id.startsWith("attempt:")) {
      const attempt = (ownerId === IMAGE_TASK ? inference.state.attempts : flow.state.attempts).find(item => `attempt:${item.id}` === id);
      if (!attempt) return <p className="cm-note">这份尝试记录暂不可用。</p>;
      const image = ownerId === IMAGE_TASK;
      return <article className="content-snapshot"><header><strong>{image ? "形状尝试" : "范围尝试"}</strong><small>{attempt.time} · 只读历史</small></header>
        <p>{image ? `当时的输出 [${attempt.dimensions.join(",")}]，${attempt.passed ? "符合" : "不符合"}示例形状约定。` : attempt.result}</p>
        {image ? <TensorDiagram inference={inference} snapshot={attempt.snapshot} compact /> : <RangeDiagram snapshot={attempt.snapshot} compact active={false} title="当时的范围参数" />}
        <details><summary>当时的示例代码</summary><pre>{attempt.code}</pre></details>
        <p className="cm-note">对应当时的输入条件；查看不会重新执行。仅浏览器{image ? "形状" : "索引范围"}示例，真实项目、模型及 NPU 仍待验证。</p>
      </article>;
    }
    if (id.startsWith("snapshot:")) {
      const saved = workspace.getTaskState(ownerId).snapshots.find(item => item.id === id);
      if (!saved) return <p className="cm-note">这份记录暂不可用。</p>;
      const data = saved.data || {};
      return <article className="content-snapshot"><header><strong>{saved.title}</strong><small>{saved.time} · 当时保存的只读快照</small></header><p>{saved.summary}</p>
        {data.attempt?.snapshot && <RangeDiagram snapshot={data.attempt.snapshot} compact active={false} title="当时的范围参数" />}
        {data.snapshot?.axes && <TensorDiagram inference={inference} snapshot={data.snapshot} compact />}
        {Array.isArray(data.checks) && <dl className="cm-stat-grid">{data.checks.map((check, index) => <div key={index}><dt>{check.label}</dt><dd>{check.passed ? "示例范围内" : `范围外 ${check.outOfRange} 个`}</dd></div>)}</dl>}
        {Array.isArray(data.rows) && <p>{data.rows.length} 项数据 · {data.failed} 项超差 · atol {data.atol} · rtol {data.rtol}</p>}
        {data.baseline && <details><summary>当时的基准代码</summary><pre>{data.baseline}</pre></details>}
        {data.code && <details open><summary>当时的示例代码</summary><pre>{data.code}</pre></details>}
        <p className="cm-note">对应当时的输入与代码，重新打开不会运行。当前参数或代码变化后，需要重新核对；真实项目与 NPU 仍待验证。</p>
      </article>;
    }
    if (ownerId === IMAGE_TASK) {
      if (id.startsWith("record:")) {
        const record = imageSession.records.find(item => "record:" + item.id === id);
        return record ? <article className="canvas-record-detail"><span>{record.time} · 示例记录</span><p>{record.summary}</p></article> : null;
      }
      return <ImageInferenceMaterial key={inference.state.resetVersion} id={id} inference={inference} onOpen={openContent} onAsk={askExplanation} onCopy={wb.copyText} presentation={presentation} codeAttachment={imageAttachment} />;
    }
    if (ownerId !== MAIN_TASK) return null;
    if (id.startsWith("record:")) {
      const record = mainSession.records.find(item => "record:" + item.id === id);
      return record ? <article className="canvas-record-detail"><span>{record.time} · {record.isDemo ? "浏览器示例记录" : "开发者记录 · 待验证"}</span><p>{record.summary}</p></article> : null;
    }
    if (id === "reference") return presentation === "canvas" ? <div className="cm-stack"><p className="cm-body-copy">Ascend C 官方文档</p><p className="cm-note">用于理解概念与使用范围，实际版本与根因仍需核对。</p><button className="cm-button" type="button" onClick={() => openContent("reference")}>打开参考网页<IconArrowRight size={14} /></button></div> : <ReferenceBrowser resetVersion={flow.state.resetVersion} />;
    if (presentation === "canvas" && (id === "precision" || id === "review")) return <div className="cm-stack"><p className="cm-body-copy">{id === "precision" ? "逐元素误差与容差依据" : "检查清单、观察与待补证据"}</p><p className="cm-note">{precisionContext ? `已保留 ${precisionContext.count ?? precisionContext.rows?.length ?? "本次"} 项误差核对依据。` : "尚未保存误差计算。真实项目根因待确认。"}</p><button className="cm-button" type="button" onClick={() => openContent(id)}>展开核对<IconArrowRight size={14} /></button></div>;
    if (id === "precision" || id === "review") return <ActionWorkspace key={flow.state.resetVersion} storageKey={`action-${MAIN_TASK}-${id}-${flow.state.resetVersion}`} embedded view={id} onChangeView={changeActionView} onBack={() => openContent("evidence")} onRecord={(record) => wb.addRecord(record, MAIN_TASK)} precisionContext={precisionContext} onPrecisionContext={setPrecisionContext} rangeContext={latestAttempt ? { total: latestAttempt.total, tile: latestAttempt.tileSize } : null} />;
    return <CanvasMaterial key={flow.state.resetVersion} id={id} presentation={presentation} flow={{ ...flow, codeAttachment: mainAttachment }} onShowCard={openContent} onAttachCode={() => openDialog("code")} explanation={explanation} onAsk={askExplanation} onCompare={compareExplanation} proactive={proactive} diagramRef={presentation === "content" ? diagnosisTargetRef : undefined} />;
  };
  const availableMaterials = isMainTask ? [
    ...Object.values(MATERIAL_DEFINITIONS).filter(item => item.id !== "canvas" && item.id !== "task-brief" && !item.id.startsWith("image-") && !item.id.startsWith("learning-")).map(item => ({
      ...item,
      available: item.id === "attempts" || item.id === "diff" ? flow.state.attempts.length > 0 : item.id === "validation" ? Boolean(flow.state.appliedCode) : true,
      disabledReason: item.id === "validation" ? "应用示例修改后可用" : "运行一次范围算例后可用",
    })),
    ...mainSession.records.map(record => ({ ...getMaterialMeta("record:" + record.id, { title: record.title }), description: record.time + " · " + (record.isDemo ? "示例记录" : "待验证") })),
  ] : isLearningTask ? LEARNING_MATERIALS.map(item => ({ ...item, available: ["learning-goal", "learning-path"].includes(item.id) || (item.id === "learning-summary" ? learning.state.summaries.length > 0 : Boolean(learning.state.path)), disabledReason: item.id === "learning-summary" ? "完成输入检查并保存后可用" : "确认学习路径后可用" })) : isImageTask ? [...IMAGE_MATERIALS.map(item => ({ ...item, available: item.id === "image-attempts" || item.id === "image-diff" ? inference.state.attempts.length > 0 : item.id === "image-validation" ? Boolean(inference.state.applied) : true, disabledReason: "完成示例尝试后可用" })), ...imageSession.records.map(record => getMaterialMeta("record:" + record.id, { title: record.title }))] : [MATERIAL_DEFINITIONS["task-brief"]];
  const getTaskItems = (ownerId) => {
    if (wb.getTask(ownerId).kind === "learning") return ownerId === selectedTask ? buildLearningContentItems({ journey: learning, workspaceState: workspace.getTaskState(ownerId), records: wb.getSession(ownerId).records }) : [];
    if (![MAIN_TASK, IMAGE_TASK].includes(ownerId)) return [];
    const ownerImage = ownerId === IMAGE_TASK;
    const ownerMain = ownerId === MAIN_TASK;
    const ownerState = workspace.getTaskState(ownerId);
    return buildTaskContentItems({
      taskId: ownerId, visited: ownerState.visitedTabs,
      materials: ownerImage ? IMAGE_MATERIALS : Object.values(MATERIAL_DEFINITIONS),
      flowState: ownerMain ? flow.state : {}, inferenceState: ownerImage ? inference.state : {},
      records: [...wb.getSession(ownerId).records, ...ownerState.snapshots],
      precisionContext: ownerMain ? precisionContext : null,
      canvasCards: ownerImage ? imageCanvas.state.cards : ownerMain ? canvas.state.cards : [],
    }).map(item => ({ ...item, ...ownerState.overview.itemOverrides?.[item.id], lastAccessAt: ownerState.visitedTabs.find(tab => tab.id === item.id)?.lastAccessAt || 0 }));
  };
  const contentItems = getTaskItems(selectedTask);
  const recommendationTasks = wb.groups.flatMap(group => group.tasks.map(name => {
    const details = wb.getTask(name);
    return {
      ...details,
      name,
      project: group.name,
      records: wb.getSession(name).records,
      ...(name === MAIN_TASK ? { flowState: flow.state } : {}),
      ...(name === IMAGE_TASK ? { imageState: inference.state } : {}),
      ...(details.kind === "learning" ? {
        learningState: learning.getTaskState(name) || readSession(`learning-journey:${name}`, null),
      } : {}),
    };
  }));
  const runRecommendationAction = item => {
    const { action = {} } = item;
    if (action.type === "learning-path") {
      if (action.preparePath && !learning.actions.generatePath("home-recommendation")) return;
      openContent(action.materialId || "learning-path", { restore: true, ...(action.anchor ? { anchor: action.anchor } : {}) });
      return;
    }
    if (action.type === "learning-summary") {
      if (!learning.actions.complete()) { wb.notify("当前学习状态还不满足保存条件，请先完成理解、跟练与输入检查。"); return; }
      openContent("learning-summary", { restore: true });
      return;
    }
    if (["learning-lesson", "learning-practice", "learning-check"].includes(action.type)) {
      openContent(action.materialId || action.type, { restore: true, ...(action.anchor ? { anchor: action.anchor } : {}) });
      return;
    }
    if (action.type === "learning-transfer") {
      const started = learning.actions.startTransfer?.(action.sourceSummaryId);
      if (!started) { wb.notify("这条迁移练习已不再对应当前学习小结，请从最新学习记录继续。"); return; }
      openContent("learning-practice", { restore: true });
      return;
    }
    if (action.type === "development-diff") {
      const prepared = flow.actions.prepareDiff({ current: true });
      if (!prepared) { wb.notify("当前任务条件已变化，请先重新检查相关示例。"); return; }
      openContent(action.materialId || "diff", { prepared: true });
      return;
    }
    if (action.type === "development-material") {
      const materialId = action.materialId;
      if (!materialId) { wb.notify("这条建议暂时无法打开对应内容。"); return; }
      if (materialId === "validation" && !flow.state.appliedCode) {
        wb.notify("当前还没有可复核的示例副本；先查看对应代码或练习材料。");
        return;
      }
      openContent(materialId, { restore: true });
      return;
    }
    wb.notify("这条建议暂时无法打开对应内容。");
  };
  const selectRecommendationAction = item => {
    setPendingRecommendationAction(item);
    setShowNewTaskHome(false);
    if (selectedTask !== item.taskName) selectTask(item.taskName);
  };
  useEffect(() => {
    if (!pendingRecommendationAction || selectedTask !== pendingRecommendationAction.taskName) return;
    const current = buildHomeSuggestions({ tasks: recommendationTasks, currentTaskName: selectedTask, mode: pendingRecommendationAction.mode })
      .find(item => item.id === pendingRecommendationAction.id && item.revision === pendingRecommendationAction.revision);
    setPendingRecommendationAction(null);
    if (!current) { wb.notify("任务状态已经变化，这条建议需要重新判断；首页会显示最新内容。"); return; }
    runRecommendationAction(current);
  }, [selectedTask, pendingRecommendationAction]);
  const chatAboutRecommendation = item => {
    if (wb.prepareTaskSuggestion({ taskName: item.taskName, prompt: item.prompt })) {
      setShowNewTaskHome(false);
      requestAnimationFrame(() => wb.draftRef.current?.focus());
    }
  };
  const renderContentCanvas = (visible, ownerId) => {
    const ownerLearning = wb.getTask(ownerId).kind === "learning";
    if (ownerLearning && ownerId !== selectedTask) return null;
    if (![MAIN_TASK, IMAGE_TASK].includes(ownerId) && !ownerLearning) return null;
    const ownerImage = ownerId === IMAGE_TASK;
    const ownerState = workspace.getTaskState(ownerId);
    const free = ownerState.canvasMode === "free";
    if (ownerLearning && free) return <LearningHierarchyCanvas journey={learning} view={learningCanvasView} visible={visible} onOpen={openContent} onAsk={askExplanation} onCopy={wb.copyText} onArchive={archiveLearning} onEnterDevelopment={enterLearningDevelopment} />;
    const ownerCanvas = ownerLearning ? learningCanvas : ownerImage ? imageCanvas : canvas;
    return <div className="tw-content-canvas">
      <div className="tw-canvas-body">
        <TaskContentOverview taskId={ownerId} visible={visible && !free} items={getTaskItems(ownerId)} categories={CONTENT_CATEGORIES} groups={getContentGroups(ownerId, ownerLearning).map(group => ({ ...group, title: ownerState.overview.groupNames?.[group.id] || group.title }))} viewState={ownerState.overview} selectedId={ownerState.lastContentId} onViewChange={patch => updateOverview(patch, ownerId)} onEditGroup={workspace.actions.editGroup} onEditItem={workspace.actions.editItem} onOpen={restoreContent} onCompare={compareContent} onArrange={arrangeMaterials}
          renderPreview={id => id === "explanation" ? <RangeDiagram snapshot={flow.state} compact active={false} onFocus={focus => { explanation.actions.focusConcept(focus); restoreContent("explanation"); }} title="当前示例范围" /> : id === "image-explanation" ? <TensorDiagram inference={inference} compact /> : null} />
        <TaskCanvas embedded visible={visible && free} flow={ownerImage || ownerLearning ? undefined : flow} canvas={ownerCanvas} comparisonIds={ownerLearning ? ["learning-lesson", "learning-practice"] : ownerImage ? ["image-source", "image-practice"] : ["source", "draft"]} onOpenContents={() => openCanvas()} onOpenContent={restoreContent} onCollapse={(id, collapsed) => workspace.actions.setOverview({ compactIds: collapsed ? [...new Set([...workspace.state.overview.compactIds, id])] : workspace.state.overview.compactIds.filter(item => item !== id) })} onAttachCode={() => openDialog("code")} connections={ownerLearning ? contentItems.flatMap(item => (item.relations || []).filter(relation => contentItems.some(target => target.id === relation.id)).map(relation => ({ id: `${item.id}-${relation.id}`, from: relation.id, to: item.id, label: relation.label }))) : ownerImage ? [{ id: "image-code-diagram", from: "image-source", to: "image-explanation", label: "通道与维度" }, { id: "image-diagram-practice", from: "image-explanation", to: "image-practice", label: "参数试改" }, { id: "image-practice-result", from: "image-practice", to: "image-attempts", label: "形状快照" }] : materialConnections} renderMaterial={id => renderMaterial(id, "canvas", ownerId)} />
      </div>
    </div>;
  };
  const materialConnections = [
    { id: "source-explanation", from: "source", to: "explanation", label: "范围示例图解" },
    { id: "evidence-explanation", from: "evidence", to: "explanation", label: "待核查线索" },
    { id: "explanation-parameters", from: "explanation", to: "parameters", label: "沿用参数试算" },
    ...(flow.state.attempts.length ? [{ id: "parameters-attempts", from: "parameters", to: "attempts", label: "已保存尝试" }] : []),
    ...(flow.state.proposedCode ? [{ id: "attempts-diff", from: "attempts", to: "diff", label: "所选尝试的提案" }] : []),
    ...(flow.state.appliedCode ? [{ id: "diff-validation", from: "diff", to: "validation", label: "示例应用后复核" }] : []),
  ];
  const resetCurrentTask = () => {
    if (isMainTask) { flow.actions.reset(); canvas.actions.reset(); setPrecisionContext(null); }
    if (isImageTask) { inference.actions.reset(); imageCanvas.actions.reset(); }
    if (isLearningTask) { learning.actions.reset(); learningCanvas.actions.reset(); learningCanvasView.actions.reset(); }
    workspace.actions.reset();
    setTaskContentsOpen(false);
    wb.resetTask();
  };
  useEffect(() => {
    const before = previousFlow.current;
    const next = { attempts: flow.state.attempts.length, proposal: flow.state.proposedCode, applied: flow.state.appliedCode, validation: flow.state.validation };
    const registerResult = id => workspace.actions.open(id, { activate: false, taskId: MAIN_TASK, isMainTask: true });
    if (next.attempts > before.attempts) registerResult("attempts");
    if (next.proposal && next.proposal !== before.proposal) {
      registerResult("diff");
      const attempt = flow.state.attempts.find(item => item.id === flow.state.selectedAttemptId) || flow.state.attempts.at(-1);
      workspace.actions.saveSnapshot("diff", { title: "示例修改提案", kind: "diff-snapshot", summary: "当时生成的示例 Diff；只读快照，未修改真实项目。", data: { code: next.proposal, baseline: flow.state.proposalBaseline, attempt } }, MAIN_TASK);
    }
    if (next.applied && next.applied !== before.applied) registerResult("validation");
    if (next.validation && next.validation !== before.validation) {
      registerResult("validation");
      workspace.actions.saveSnapshot("validation", { title: "范围复核快照", kind: "validation-snapshot", summary: next.validation.summary, data: { ...next.validation } }, MAIN_TASK);
    }
    previousFlow.current = next;
  }, [flow.state.attempts.length, flow.state.proposedCode, flow.state.appliedCode, flow.state.validation]);
  useEffect(() => {
    const next = { attempts: inference.state.attempts.length, proposal: inference.state.proposal, applied: inference.state.applied, validation: inference.state.validation };
    const before = previousImage.current;
    if (!before) { previousImage.current = next; return; }
    const register = id => workspace.actions.open(id, { activate: false, taskId: IMAGE_TASK, isMainTask: true });
    if (next.attempts > before.attempts) register("image-attempts");
    if (next.proposal && next.proposal !== before.proposal) {
      register("image-diff");
      workspace.actions.saveSnapshot("image-diff", { title: "预处理修改提案", kind: "diff-snapshot", summary: `当时的轴顺序 ${next.proposal.attempt.snapshot.axes.join(",")}；示例副本修改，未执行推理。`, data: { code: next.proposal.attempt.code, baseline: imageCode(next.proposal.baseline), snapshot: next.proposal.attempt.snapshot, attemptId: next.proposal.attempt.id, attempt: next.proposal.attempt } }, IMAGE_TASK);
    }
    if (next.applied && next.applied !== before.applied) register("image-validation");
    if (next.validation && next.validation !== before.validation) {
      register("image-validation");
      workspace.actions.saveSnapshot("image-validation", { title: "形状复核快照", kind: "validation-snapshot", summary: `当时输入 [${next.validation.dimensions.join(",")}]，${next.validation.passed ? "符合" : "不符合"}示例约定。真实推理待验证。`, data: { ...next.validation } }, IMAGE_TASK);
    }
    previousImage.current = next;
  }, [inference.state.attempts.length, inference.state.proposal, inference.state.applied, inference.state.validation]);
  useEffect(() => {
    if (precisionContext && JSON.stringify(precisionContext) !== JSON.stringify(previousPrecision.current)) workspace.actions.saveSnapshot("precision", { title: "误差计算快照", kind: "precision-snapshot", summary: `${precisionContext.rows?.length || 0} 个元素，${precisionContext.failed} 个超差。${precisionContext.isDemo ? "演示" : "用户提供"}数据，来源与真实精度仍待核对。`, data: { ...precisionContext } }, MAIN_TASK);
    previousPrecision.current = precisionContext;
  }, [precisionContext]);
  useEffect(() => { setTaskContentsOpen(false); }, [selectedTask]);

  return (
    <main className="app-frame" data-testid="q02-workbench">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-logo" src={`${import.meta.env.BASE_URL}assets/ascend-logo.svg`} alt="Ascend" />
          <span className="brand-studio">Studio</span>
        </div>
        <div className="topbar-divider" />
        <nav className="breadcrumbs" aria-label="当前位置">
          {showNewTaskHome ? <strong>新建任务</strong> : <>
          <span className="breadcrumb-project">{currentGroup?.name}</span><IconChevronRight className="breadcrumb-project" size={14} /><button className="task-title-button" type="button" title={selectedTask} aria-label="当前任务与对话操作" data-menu-trigger aria-expanded={wb.menu?.name === "chat"} onClick={event => openMenu("chat", event)}><strong>{selectedTask}</strong><IconChevronDown size={13} /></button>
          </>}
        </nav>
        {!showNewTaskHome && session.unreadReply && <button className="light-button new-reply-button" type="button" onClick={wb.showLatestReply}><IconChevronDown size={14} />有新回复</button>}
        <div className="topbar-spacer" />
        {!showNewTaskHome && !saveAvailable && <span className="save-unavailable" role="status">暂未保存</span>}
        {!showNewTaskHome && workspace.state.collapsed && <button className="light-button reopen-content" type="button" onClick={() => workspace.actions.setCollapsed(false)}>打开内容{workspace.state.visitedTabs.some(item => item.unread) && <span className="reopen-update-count">{workspace.state.visitedTabs.filter(item => item.unread).length} 项更新</span>}</button>}
        {!showNewTaskHome && <span className="proposal-badge"><span className="proposal-dot" />设计提案 · 待开发者确认</span>}
        <button className="icon-button top-icon" type="button" aria-label="通知" data-menu-trigger aria-expanded={wb.menu?.name === "notifications"} onClick={(event) => openMenu("notifications", event)}><IconBell size={18} />{wb.notifications.length > 0 && <span className="notification-dot" />}</button>
        <button className="profile-button" type="button" aria-label="用户菜单" data-menu-trigger aria-expanded={wb.menu?.name === "profile"} onClick={(event) => openMenu("profile", event)}>D</button>
      </header>

      <div className={"workspace-grid" + (showNewTaskHome ? " is-new-task-home" : "") + (sidebarCollapsed ? " is-sidebar-collapsed" : "") + (layout.dragging ? " is-resizing" : "") + (!showNewTaskHome && workspace.state.collapsed ? " is-content-collapsed" : "")} ref={layout.workspaceRef} style={showNewTaskHome ? undefined : layout.style}>
        <div className={"sidebar-shell" + (sidebarCollapsed ? " is-collapsed" : "")}>
        <aside id="project-sidebar" className="sidebar" aria-label="项目与任务" hidden={sidebarCollapsed}>
          <img className="ambient-art ambient-art--archive" src={`${import.meta.env.BASE_URL}assets/project-archive-ambient.png`} alt="" aria-hidden="true" draggable={false} />
          <div className="primary-nav">
            <button className="new-task-button" type="button" onClick={() => { wb.setMenu(null); setShowNewTaskHome(true); }}>
              <IconPlus size={18} /><span>新建任务</span>
            </button>
            <button className="nav-row" type="button" onClick={() => openDialog("automations")}>
              <IconSettingsAutomation size={18} /><span>自动化任务</span>
            </button>
            <button className="nav-row" type="button" onClick={() => openDialog("capabilities")}>
              <IconBooks size={18} /><span>能力库</span>
            </button>
          </div>

          <div className="project-list-header">
            <h1>项目</h1>
            <button className="icon-button compact-icon" type="button" aria-label="项目筛选" data-menu-trigger aria-expanded={wb.menu?.name === "filter"} onClick={(event) => openMenu("filter", event)}>
              <IconAdjustmentsHorizontal size={17} />
            </button>
          </div>
          <label className="search-box">
            <IconSearch size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目或任务" aria-label="搜索项目或任务" />
            {query && <button type="button" className="clear-search" aria-label="清空搜索" onClick={() => setQuery("")}><IconX size={14} /></button>}
          </label>
          <div className="project-scroll">
            {visibleGroups.map((group) => (
              <ProjectSection
                key={group.id}
                group={group}
                opened={openedGroups.includes(group.id) || Boolean(query)}
                query={query}
                selectedTask={selectedTask}
                onToggle={() => toggleGroup(group.id)}
                onSelect={selectExistingTask}
              />
            ))}
            {query && !visibleGroups.some((group) =>
              group.name.toLowerCase().includes(query.toLowerCase()) ||
              group.tasks.some((task) => task.toLowerCase().includes(query.toLowerCase())
            )) && (
              <div className="empty-search">没有匹配的项目或任务</div>
            )}
          </div>
          <div className="sidebar-footer"><IconLock size={14} /><span>当前任务与项目上下文关联</span></div>
        </aside>
        <button
          className="sidebar-toggle"
          type="button"
          aria-controls="project-sidebar"
          aria-expanded={!sidebarCollapsed}
          aria-label={sidebarCollapsed ? "展开项目栏" : "收起项目栏"}
          title={sidebarCollapsed ? "展开项目栏" : "收起项目栏"}
          onClick={() => { setSidebarCollapsed(value => !value); wb.setMenu(null); }}
        >
          {sidebarCollapsed ? <IconChevronRight size={13} /> : <IconChevronLeft size={13} />}
        </button>
        </div>
        {!sidebarCollapsed && <div className="workspace-divider workspace-divider--projects" role="separator" tabIndex={0} aria-label="调整项目栏宽度" title="拖动调整项目栏宽度；双击恢复默认布局" {...layout.separatorProps("projects")} />}

        {showNewTaskHome ? <NewTaskHome currentTaskName={selectedTask} tasks={recommendationTasks} onRecommendationAction={selectRecommendationAction} onRecommendationChat={chatAboutRecommendation} onCreateTask={({ goal, kind, attachments }) => {
          const groupId = kind === "learning" ? "inference" : (currentGroup?.id || "operator");
          const created = wb.createTask({ name: goal.slice(0, 60), groupId, goal, kind, attachments });
          if (created) setShowNewTaskHome(false);
          return created;
        }} /> : <section className="conversation-panel" aria-label="任务对话">
          <img className="ambient-art ambient-art--exchange" src={`${import.meta.env.BASE_URL}assets/dialog-exchange-ambient.png`} alt="" aria-hidden="true" draggable={false} />
          <div className="conversation-scroll" ref={wb.conversationRef} onScroll={wb.handleConversationScroll}>
            <div className="conversation-flow">
            {session.showIntro && isMainTask && <>
            <article className="message-row user-message">
              <div className="message-content">
                <div className="message-meta">你</div>
                <div className="user-bubble">为什么 [16,32] 通过，[17,33] 失败？我改过编译参数，还是在 custom_op.cpp:128 报错。</div>
              </div>
            </article>
            <button className="attempt-row" type="button" onClick={() => openDialog("attempts")}>
              <span className="attempt-icon"><IconAdjustmentsHorizontal size={15} /></span>
              <span>已尝试：修改编译参数 · 错误位置未变</span>
              <IconChevronRight className="attempt-chevron" size={16} />
            </button>
            <article className="message-row assistant-message">
              <div className="message-content">
                <div className="message-meta">Ascend Studio</div>
                <div className="assistant-response">
                  <p className="assistant-lead">尾块索引范围值得优先核对，根因尚未确认。</p>
                  <p>已知：<span className="chat-fact is-pass">[16,32] 通过</span>；<span className="chat-fact is-fail">[17,33] 失败</span>。修改编译参数后，错误位置未变。</p>
                  <p>还需：实际循环、两次运行条件与逐元素误差证据。</p>
                  <button className="rationale-button" type="button" aria-expanded={rationaleOpen} onClick={() => setRationaleOpen((value) => !value)}>
                    <IconBook size={16} />{rationaleOpen ? "收起判断依据" : "查看判断依据"}<IconArrowRight className="rationale-arrow" size={15} />
                  </button>
                  {rationaleOpen && <div className="rationale-detail"><p>[16,32] 与 [17,33] 的差异让末尾元素处理值得检查，仍需对照实际循环与误差证据，不能单独证明越界。</p><button type="button" className="task-plain-button" onClick={() => openContent("evidence")}>打开现场与判断<IconArrowRight size={13} /></button></div>}
                  <ProactiveCue {...proactive.forCue("diagnosis-tail")} emphasisRef={diagnosisTargetRef}
                    title="先核对非整块输入的访问范围"
                    evidence="两组输入结果不同，调整编译参数后错误位置未变"
                    description="已把尾块差异带入右侧图解。可以直接调参观察，再核对实际循环；这条线索仍不能确认根因。"
                    primaryLabel={workspace.state.activeId === "explanation" ? "核对实际循环与来源" : "查看关联图解"}
                    onPrimary={() => { proactive.settle("diagnosis-tail"); workspace.state.activeId === "explanation" ? changeActionView("code") : dispatchTaskIntent("explain", "tail"); }}
                    secondaryLabel={workspace.state.activeId === "explanation" ? "定位尾块图解" : "查看实际代码"}
                    onSecondary={() => { proactive.settle("diagnosis-tail"); workspace.state.activeId === "explanation" ? dispatchTaskIntent("explain", "tail") : changeActionView("code"); }} />
                  <details className="chat-next-disclosure"><summary>比较其他排查方向</summary><div className="chat-next-actions" aria-label="可能的下一步方向">
                    <div className="chat-next-heading">可能的下一步方向</div>
                    {routes.map((route, index) => (
                      <button
                        className={"chat-next-row" + (selectedRoute === route.id ? " is-selected" : "")}
                        type="button"
                        key={route.id}
                        onClick={() => { setSelectedRoute(route.id); if (route.id !== "retry") changeActionView(route.id === "tail" ? "code" : "precision"); }}
                      >
                        <span className="chat-next-number">{index + 1}</span>
                        <strong>{route.title}</strong>
                        <small>{route.sub} · {route.reason}</small>
                      </button>
                    ))}
                    <button className="light-button chat-canvas-action" type="button" onClick={confirmWorkspaceRoute}>{selectedRouteData.id === "retry" ? "保留现场并重新评估" : selectedRouteData.id === "tail" ? "查看索引范围示例" : "打开误差核对"}<IconArrowRight size={14} /></button>
                  </div></details>
                </div>
                <div className="message-feedback">
                  <button type="button" aria-label="复制回答" onClick={() => wb.copyText(task.reply)}><IconCopy size={16} /></button>
                  <button type="button" aria-label="赞同" aria-pressed={session.feedback === "up"} onClick={() => feedback("up")}><IconThumbUp size={16} /></button>
                  <button type="button" aria-label="不赞同" aria-pressed={session.feedback === "down"} onClick={() => feedback("down")}><IconThumbDown size={16} /></button>
                </div>
              </div>
            </article>
            </>}
            {session.showIntro && !isMainTask && <>
              <article className="message-row user-message"><div className="message-content"><div className="message-meta">你</div><div className="user-bubble">{task.question}</div></div></article>
              <article className="message-row assistant-message"><div className="message-content"><div className="message-meta">Ascend Studio · 演示</div><div className="assistant-response">{task.reply.split("\n\n").map((text, index) => <p key={index}>{text}</p>)}{isLearningTask && <div className="task-suggestion-actions"><button className="task-plain-button" type="button" onClick={() => openContent("learning-goal")}>设置学习目标<IconArrowRight size={14} /></button><button className="task-plain-button" type="button" onClick={() => openContent(learning.state.summaries.length ? "learning-summary" : "learning-path")}>{learning.state.summaries.length ? "回看学习记录" : "查看学习路径"}</button></div>}{isImageTask && <div className="task-suggestion-actions"><button className="task-plain-button" type="button" onClick={() => dispatchTaskIntent("explain", "layout")}>返回关联图解<IconArrowRight size={14} /></button><button className="task-plain-button" type="button" onClick={() => openContent("image-source")}>查看代码与来源</button></div>}</div></div></article>
            </>}
            {messages.map((message) => (
              <article className={"message-row " + (message.role === "user" ? "user-message" : "assistant-message")} key={message.id}>
                <div className="message-content">
                  <div className="message-meta">{message.role === "user" ? "你" : "Ascend Studio"}{message.isDemo && " · 演示"}{message.model && " · " + message.model}</div>
                  <div className={message.role === "user" ? "user-bubble" : "assistant-response extra-message"}>{message.text.split("\n\n").map((paragraph, i) => <p className="message-paragraph" key={i}>{paragraph}</p>)}
                    {message.attachments?.length > 0 && <div className="message-attachments">{message.attachments.map((file) => <button type="button" key={file.id} onClick={() => openDialog("evidence", { title: file.name, body: "本次任务的本地附件，尚未独立验证。", log: file.content || "已关联文件名称，尚无可读取的文本内容。" })}><IconPaperclip size={13} />{file.name}</button>)}</div>}
                  </div>
                  {message.learningReference && <div className="message-source-links"><button type="button" onClick={() => selectExistingTask(message.learningReference.taskId)}><IconBook size={12} />返回来源学习任务</button></div>}
                  {message.sourceContext && <div className="message-source-links"><button type="button" onClick={() => { if (message.sourceContext.kind === "learning") { learning.actions.seek(message.sourceContext.time); openContent("learning-lesson", { anchor: message.sourceContext.focus }); } else if (message.sourceContext.kind === "image") { inference.actions.seek(message.sourceContext.time); if (!inference.state.lessonOpen) inference.actions.lesson(); openContent("image-explanation"); } else openContent("explanation", { anchor: message.sourceContext.focus, time: message.sourceContext.time, video: true }); }}><IconPlayerPlay size={12} /><span>讲解示例 {message.sourceContext.stamp} · 返回片段</span></button>{message.role === "assistant" && <button type="button" onClick={() => { if (message.sourceContext.kind === "learning") { learning.actions.focus(message.sourceContext.focus); openContent("learning-lesson", { anchor: message.sourceContext.focus }); } else if (message.sourceContext.kind === "image") { inference.actions.focus(message.sourceContext.focus); openContent("image-explanation"); } else openContent("explanation", { anchor: message.sourceContext.focus }); }}><IconBook size={12} />查看关联图解</button>}</div>}
                  {isMainTask && message.role === "assistant" && message.interaction?.intent === "diagnose" ? <ProactiveCue {...proactive.forCue(`diagnose:${message.id}`)}
                    title="沿这次错误补一项判断依据" description="当前材料保持原位。需要理解时，可把这条线索直接带进关联图解。"
                    evidence="基于本次描述；实际循环与运行证据仍待核对"
                    primaryLabel="解释这条线索" onPrimary={() => { proactive.settle(`diagnose:${message.id}`); dispatchTaskIntent("explain", message.interaction.focus); }}
                    secondaryLabel="查看实际代码" onSecondary={() => { proactive.settle(`diagnose:${message.id}`); changeActionView("code"); }} />
                    : message.role === "assistant" && message.interaction && <div className="message-source-links"><button type="button" onClick={() => dispatchTaskIntent("explain", message.interaction.focus)}><IconBook size={13} />{message.interaction.intent === "diagnose" ? "解释这条线索" : "查看关联图解"}</button></div>}
                  {message.role === "assistant" && <div className="message-feedback"><button type="button" aria-label="复制这条回答" onClick={() => wb.copyText(message.text)}><IconCopy size={16} /></button></div>}
                </div>
              </article>
            ))}
            {session.replying && <div className="replying-indicator" role="status"><span /><span /><span /><small>正在整理演示答复…</small></div>}
            </div>
          </div>
          <form className="composer" onSubmit={handleSendMessage}>
            {(session.attachments.length > 0 || session.capabilityIds.length > 0) && <div className="composer-context-chips">
              {session.attachments.map((file) => <span className="attachment-chip" key={file.id}><IconPaperclip size={13} /><span title={file.restorationNote || file.name}>{file.name}</span><button type="button" aria-label={"移除附件 " + file.name} onClick={() => wb.patchSession((old) => ({ attachments: old.attachments.filter((item) => item.id !== file.id) }))}><IconX size={12} /></button></span>)}
              {session.capabilityIds.map((id) => <span className="attachment-chip capability-chip" key={id}><IconBooks size={13} /><span>{capabilities.find((item) => item.id === id)?.name}</span><button type="button" aria-label="移除能力" onClick={() => wb.patchSession((old) => ({ capabilityIds: old.capabilityIds.filter((item) => item !== id) }))}><IconX size={12} /></button></span>)}
            </div>}
            <textarea ref={wb.draftRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); handleSendMessage(event); } }} placeholder="继续提问，或描述你想进行的下一步…" aria-label="继续提问" rows={1} />
            <div className="composer-toolbar">
              <div className="composer-tools">
                <button className="icon-button composer-plus" type="button" aria-label="更多输入方式" data-menu-trigger aria-expanded={wb.menu?.name === "input"} onClick={(event) => openMenu("input", event)}><IconPlus size={17} /></button>
                <button className="tool-chip" type="button" onClick={() => openDialog("code")}><IconCode size={15} />代码片段</button>
                <button className="tool-chip" type="button" onClick={() => wb.imageRef.current?.click()}><IconPhoto size={15} />截图</button>
                <button className="tool-chip" type="button" onClick={() => wb.fileRef.current?.click()}><IconPaperclip size={15} />文件</button>
              </div>
              <div className="composer-submit">
                <button className="model-button" type="button" onClick={() => openDialog("models")} title="选择 AI（本地演示）"><IconBulb size={14} /><span>{wb.model.label}</span><IconChevronDown size={13} /></button>
                <button className="send-button" type="submit" aria-label="发送消息" disabled={session.replying || (!draft.trim() && !session.attachments.length)}><IconSend size={17} /></button>
              </div>
            </div>
          </form>
          <input hidden type="file" multiple ref={wb.fileRef} onChange={(event) => wb.readFiles(event, "file")} aria-label="选择文件附件" />
          <input hidden type="file" multiple accept="image/*" ref={wb.imageRef} onChange={(event) => wb.readFiles(event, "image")} aria-label="选择截图附件" />
        </section>}

        {!showNewTaskHome && <div className="workspace-divider workspace-divider--conversation" hidden={workspace.state.collapsed} role="separator" tabIndex={0} aria-label="调整对话与工作区宽度" title="拖动调整对话与工作区宽度；双击恢复默认布局" {...layout.separatorProps("conversation")} />}
        {!showNewTaskHome && <aside className="diagnostic-panel" hidden={workspace.state.collapsed} aria-label="任务工作区">
          <TaskWorkspace taskId={selectedTask} workspace={workspace} contentWidth={layout.contentWidth} onCompare={compareContent} isMainTask={isInteractiveTask} isLearningTask={isLearningTask} canvasMaterialIds={learningCanvasMaterialIds} materials={availableMaterials} contentItems={contentItems} onOpen={openContent} onClose={closeContent} onOpenCanvas={openCanvas} onArrange={arrangeMaterials} onReturnFocus={isLearningTask ? () => workspace.actions.openCanvas({ mode: "free" }) : workspace.actions.returnFocus} onCollapse={() => workspace.actions.setCollapsed(true)}
            renderContent={(id, ownerId) => renderMaterial(id, "content", ownerId)} renderCanvas={renderContentCanvas}
          />
        </aside>}
      </div>
      {wb.menu && <div className={"workbench-menu workbench-menu-" + wb.menu.name} ref={wb.menuRef} style={{ left: wb.menu.left, ...(wb.menu.bottom !== null ? { bottom: wb.menu.bottom } : { top: wb.menu.top }) }}>
        {wb.menu.name === "filter" && <><div className="menu-label">显示项目</div>{[{ id: "all", label: "全部项目" }, { id: "current", label: "当前项目" }].map((item) => <button key={item.id} type="button" className={wb.filterScope === item.id ? "is-active" : ""} onClick={() => closeMenuAnd(() => wb.setFilterScope(item.id))}>{item.label}{wb.filterScope === item.id && <IconCircleCheck size={15} />}</button>)}<div className="menu-divider" /><button type="button" onClick={() => closeMenuAnd(() => wb.setOpenedGroups(wb.groups.map((group) => group.id)))}>展开所有项目</button><button type="button" onClick={() => closeMenuAnd(() => wb.setOpenedGroups([]))}>收起所有项目</button></>}
        {wb.menu.name === "chat" && <><div className="menu-label">当前任务对话</div><button type="button" onClick={() => closeMenuAnd(wb.startConversation)}>新对话<IconPlus size={15} /></button><button type="button" onClick={() => openDialog("history")}>对话历史<span>{session.history.length}</span></button><button type="button" onClick={() => closeMenuAnd(() => wb.copyText(wb.conversationText()))}>复制当前对话<IconCopy size={15} /></button><button type="button" onClick={wb.exportTask}>导出任务记录<IconFileText size={15} /></button><div className="menu-divider" /><button type="button" onClick={resetCurrentTask}>恢复本题初始状态</button></>}
        {wb.menu.name === "input" && <><div className="menu-label">补充任务上下文</div><button type="button" onClick={() => openDialog("code")}>代码片段<IconCode size={15} /></button><button type="button" onClick={() => closeMenuAnd(() => wb.fileRef.current?.click())}>选择本地文件<IconPaperclip size={15} /></button><button type="button" onClick={() => closeMenuAnd(() => wb.imageRef.current?.click())}>选择截图<IconPhoto size={15} /></button><button type="button" onClick={() => openDialog("capabilities")}>使用能力库<IconBooks size={15} /></button></>}
        {wb.menu.name === "diagnostic" && <><div className="menu-label">判断与核对</div>{isMainTask && <><button type="button" onClick={() => closeMenuAnd(() => openContent("review"))}>生成复核记录<IconFileText size={15} /></button><button type="button" onClick={() => closeMenuAnd(() => setRationaleOpen((value) => !value))}>{rationaleOpen ? "收起判断依据" : "展开判断依据"}<IconBook size={15} /></button></>}<button type="button" onClick={() => openDialog("attempts")}>已尝试的动作<IconAdjustmentsHorizontal size={15} /></button><button type="button" onClick={wb.exportTask}>导出任务记录<IconFileText size={15} /></button></>}
        {wb.menu.name === "notifications" && <><div className="menu-label">任务动态</div>{wb.notifications.length ? wb.notifications.map((entry) => <button className="notification-row" key={entry.id} type="button" onClick={() => selectExistingTask(entry.taskName)}><span><strong>{entry.text}</strong><small>{entry.taskName} · {entry.time}</small></span></button>) : <p className="menu-empty">尚无新动态。完成核对后会在这里留下记录。</p>}</>}
        {wb.menu.name === "profile" && <><div className="menu-profile"><strong>开发者</strong><span>Ascend Studio · 本地设计预览</span></div><button type="button" onClick={wb.exportTask}>导出当前任务</button><p className="menu-empty">{saveAvailable ? "任务参数、草案、对话与历史自动保存在此浏览器。原始附件需要重新选择。" : "此浏览器暂时无法保存新改动；请先导出当前任务记录。"}</p></>}
      </div>}

      <WorkbenchDialogs dialog={wb.dialog} onClose={wb.closeDialog} groups={wb.groups} taskName={selectedTask} taskGoal={task.goal} onCreateTask={wb.createTask} onAttachCode={wb.attachCode} capabilities={capabilities} onUseCapability={wb.useCapability} automations={wb.automations} onToggleAutomation={(id) => wb.setAutomations((items) => items.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item))} onRunAutomation={wb.runAutomation} onAddAutomation={(entry) => wb.setAutomations((items) => [...items, { ...entry, id: crypto.randomUUID(), enabled: true, lastRun: "" }])} history={session.history} onRestoreConversation={wb.restoreConversation} modelOptions={modelOptions} selectedModel={wb.selectedModel} onSelectModel={wb.chooseModel} attempts={wb.attempts} onAddAttempt={(entry) => wb.addRecord({ ...entry, kind: "attempt", isDemo: false })} evidenceDetail={wb.dialogData} copyText={wb.dialogData.text || ""} />
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </main>
  );
}

export { App };
