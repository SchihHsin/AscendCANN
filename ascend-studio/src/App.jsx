import { ICON_SIZE } from "./icon-system.js";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { readSession, writeSession, sessionSaveAvailable } from "./session-storage";
import { useWorkbenchState, MAIN_TASK } from "./useWorkbenchState";
import { resolveTaskUrlValue, taskUrlIdentifier } from "./task-url";
import { capabilities, modelOptions, LOG_DIAGNOSTIC_TASK, displayTaskName } from "./prototype-data";
import { WorkbenchDialogs } from "./WorkbenchDialogs";
import { ActionWorkspace } from "./ActionWorkspace";
import { useTaskFlow } from "./useTaskFlow";
import { useExplanationSession } from "./useExplanationSession";
import { useCanvasState } from "./useCanvasState";
import { normalizeCanvasNodes, normalizeCanvasRelation } from "./shared/canvas/node-semantics.js";
import { useContentWorkspace } from "./useContentWorkspace";
import { MATERIAL_DEFINITIONS, getMaterialMeta } from "./workspace-materials";
import { TaskWorkspace } from "./TaskWorkspace";
import { ReferenceBrowser } from "./ReferenceBrowser";
import { useWorkbenchLayout } from "./useWorkbenchLayout";
import { TaskCanvas } from "./TaskCanvas";
import { AddCustomTaskCanvas } from "./AddCustomTaskCanvas";
import { CanvasMaterial } from "./CanvasMaterials";
import VoiceCaptureButton from "./VoiceCaptureButton.jsx";
import { TaskContentOverview } from "./TaskContentOverview";
import { CONTENT_CATEGORIES, getContentGroups, buildTaskContentItems } from "./task-content-catalog";
import { IMAGE_TASK, IMAGE_MATERIALS, useImageInference, imageShape, imageCode } from "./useImageInference";
import { ImageInferenceMaterial, TensorDiagram } from "./ImageInference";
import { RangeDiagram, getRangeGeometry } from "./RangeDiagram";
import { classifyTaskIntent, getExplanationFocus } from "./task-intents";
import ProactiveCue from "./ProactiveCue.jsx";
import { useProactiveCues } from "./useProactiveCues.js";
import { LEARNING_PATH_GENERATION_TASK, LEARNING_TASK, LEARNING_MATERIALS } from "./learning-data";
import { OFFICIAL_LEARNING_TASK, OFFICIAL_LEARNING_STAGES, OFFICIAL_LEARNING_MATERIALS, getOfficialLearningNode, buildOfficialLearningContentItems, getOfficialLearningStatus, officialStatusLabel } from "./official-learning-data";
import { useLearningJourney } from "./useLearningJourney";
import { useLearningCanvasView } from "./useLearningCanvasView";
import { LearningHierarchyCanvas } from "./LearningHierarchyCanvas";
import { stepsForStage } from "./learning-path-collaboration";
import { useOfficialLearningPath } from "./useOfficialLearningPath";
import { OfficialLearningPathCanvas } from "./OfficialLearningPathCanvas";
import { OfficialLearningMaterial } from "./OfficialLearningMaterial";
import { LearningJourneyMaterial } from "./LearningJourney";
import { NewTaskHome } from "./NewTaskHome";
import { LearningDiscoveryPage } from "./LearningDiscoveryPage";
import { buildHomeSuggestions } from "./home-recommendations";
import { AutomationList, CapabilityList } from "./WorkbenchDialogs";
import { CommunityDraftPanel } from "./CommunityDraftPanel";
import { createCommunityDraft } from "./community-draft-data";
import { INITIAL_LOG_TRIAGE_STATE, LogTriageWorkspace } from "./LogTriageWorkspace.jsx";
import { buildLearningContentItems } from "./learning-content-catalog";
import { KnowledgePocketPage } from "./KnowledgePocket.jsx";
import { announceKnowledgePocketChange, readKnowledgePocket, writeKnowledgePocket } from "./knowledge-pocket-storage.js";
import zaiModelLogo from "./assets/model-logos/zai.svg";
import deepseekModelLogo from "./assets/model-logos/deepseek-color.svg";
import qwenModelLogo from "./assets/model-logos/qwen-color.svg";
import "./interaction.css";
import "./visual-focus.css";
import {
  IconAdjustmentsHorizontal,
  IconArrowRight,
  IconBookmark,
  IconBell,
  IconBook,
  IconBooks,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconCircleCheck,
  IconCircleX,
  IconCode,
  IconCopy,
  IconDatabase,
  IconDots,
  IconFileText,
  IconFolder,
  IconLibrary,
  IconLayoutBottombar,
  IconLayoutSidebar,
  IconLock,
  IconMessageCircle,
  IconPaperclip,
  IconPhoto,
  IconPlayerPlay,
  IconPointer2,
  IconPlus,
  IconSearch,
  IconSend,
  IconShieldCheck,
  IconSparkles,
  IconSettingsAutomation,
  IconThumbDown,
  IconThumbUp,
  IconX,
} from "@tabler/icons-react";

const MODEL_PROVIDER_LOGOS = {
  general: zaiModelLogo,
  diagnostic: deepseekModelLogo,
  reasoning: qwenModelLogo,
};
const OFFICIAL_STAGE_IDS = new Set(OFFICIAL_LEARNING_STAGES.map(stage => stage.id));
const OFFICIAL_MATERIAL_STAGES = Object.fromEntries(OFFICIAL_LEARNING_STAGES.flatMap(stage => [[stage.id, [stage.id, stage.children[0].id]], ...stage.children.map(child => [child.id, [stage.id, child.id]])]));
const PATH_REFINEMENT_DEMO_PROMPT = "我会 Python，也理解 HWC 到 CHW。每天只有 15 分钟，我想从理解概念转为能核对模型的图像输入。请把熟悉的部分改成快速回顾，增加预处理顺序判断和模型输入签名核对，并把 NCHW 检查放到练习之后。";
const PERMISSION_OPTIONS = [
  { id: "read-only", label: "只读" },
  { id: "confirm", label: "每次确认" },
  { id: "task", label: "本任务内允许操作" },
];

function withMaterialCanvasConnections(items = []) {
  const knownIds = new Set(items.map(item => item.id));
  const connections = [];
  const keys = new Set();
  const add = raw => {
    const relation = normalizeCanvasRelation(raw);
    if (!relation || !knownIds.has(relation.fromId) || !knownIds.has(relation.toId)) return;
    const key = [relation.fromId, relation.toId, relation.relationType].join("::");
    if (keys.has(key)) return;
    keys.add(key);
    connections.push({
      id: relation.id || key,
      from: relation.fromId,
      to: relation.toId,
      relationType: relation.relationType,
      label: relation.label || relation.title || "",
    });
  };
  items.forEach(item => (item.relations || []).forEach(add));
  return connections;
}
function findLearningPathMove(text, path) {
  const match = String(text).match(/(?:把|将)\s*[“"「]?(.+?)[”"」]?\s*(?:节点)?(?:移动到|移到|放到|排到)\s*[“"「]?(.+?)[”"」]?\s*(之前|前面|前|之后|后面|后)/);
  if (!match) return null;
  const clean = value => value.replace(/[“"「」”]/g, "").replace(/节点/g, "").trim();
  const nodes = (path || []).flatMap(stage => stepsForStage(stage).map(step => ({ stageId: stage.id, stepId: step.id, title: step.title })));
  const find = phrase => nodes.filter(node => phrase.includes(node.title) || node.title.includes(phrase)).sort((a, b) => b.title.length - a.title.length)[0];
  const source = find(clean(match[1]));
  const target = find(clean(match[2]));
  if (!source || !target || source.stageId !== target.stageId || source.stepId === target.stepId) return null;
  return { ...source, targetId: target.stepId, targetTitle: target.title, direction: /前/.test(match[3]) ? "before" : "after" };
}

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

function ProjectSection({ group, opened, query, selectedTask, onToggle, onSelect, statusForTask }) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchesProject = normalizedQuery && group.name.toLowerCase().includes(normalizedQuery);
  const filteredTasks = matchesProject
    ? group.tasks
    : group.tasks.filter((task) => task.toLowerCase().includes(normalizedQuery) || displayTaskName(task).toLowerCase().includes(normalizedQuery));
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
        {opened ? <IconChevronDown size={ICON_SIZE.control} /> : <IconChevronRight size={ICON_SIZE.control} />}
        <IconFolder className="project-folder" size={ICON_SIZE.heading} />
        <span className="project-name">{group.name}</span>
        <span className="project-count">{group.tasks.length}</span>
      </button>
      {opened && (
        <div className="project-tasks" id={"project-" + group.id}>
          {filteredTasks.map((task) => {
            const status = statusForTask?.(task);
            return <button
              className={"task-row" + (selectedTask === task ? " is-selected" : "")}
              type="button"
              aria-current={selectedTask === task ? "page" : undefined}
              key={task}
              onClick={() => onSelect(task)}
            >
              <IconFileText className="task-file" size={ICON_SIZE.heading} />
              <span className="task-row-label">{displayTaskName(task)}</span>
              {status && <small className={`task-status is-${status.tone}`}>{status.label}</small>}
            </button>;
          })}
        </div>
      )}
    </section>
  );
}

function App() {
  const wb = useWorkbenchState();
  const [visualTheme, setVisualTheme] = useState(() => {
    try { return localStorage.getItem("ascend-studio-theme") === "cool-gray" ? "cool-gray" : "neutral-gray"; }
    catch { return "neutral-gray"; }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = visualTheme;
    try { localStorage.setItem("ascend-studio-theme", visualTheme); } catch { /* Keep the in-session choice when storage is unavailable. */ }
  }, [visualTheme]);
  const [mainView, setMainView] = useState(() => {
    const launchParams = new URLSearchParams(window.location.search);
    const taskNames = new Set(wb.groups.flatMap(group => group.tasks));
    const launchTask = resolveTaskUrlValue(launchParams.get("task"), taskNames);
    const launchHome = launchParams.get("home");
    if (launchTask) return "task";
    if (launchParams.has("showcaseRev") && ["classic", "explore", "combine"].includes(launchHome)) return "home";
    const savedView = readSession("main-view", null);
    if (["home", "learning", "automations", "capabilities", "knowledge-pocket", "task"].includes(savedView)) return savedView;
    // A home-variant query may remain in the URL after navigating into a task.
    // Use it only for a fresh session so it cannot override the saved task view on refresh.
    if (["classic", "explore", "combine"].includes(new URLSearchParams(window.location.search).get("home"))) return "home";
    // Reopening the co-creation scenario should show its reset starter state,
    // while a fresh visit to the app still opens the new-task home.
    return readSession("workbench", null)?.selectedTask === LEARNING_PATH_GENERATION_TASK ? "task" : "home";
  });
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("showcaseRev")) return;
    ["showcaseRev", "home"].forEach(key => url.searchParams.delete(key));
    window.history.replaceState(window.history.state, "", url);
  }, []);
  useEffect(() => { writeSession("main-view", mainView); }, [mainView]);
  const [knowledgePocket, setKnowledgePocket] = useState(readKnowledgePocket);
  const [selectedPocketId, setSelectedPocketId] = useState("");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("pocket-demo") !== "1") return;
    const now = Date.now();
    const examples = [
      { id: "pocket-demo-tail-index", sourceKey: "pocket-demo:tail-index", title: "排查线索：尾块索引范围", summary: "尾块索引范围值得优先核对；根因尚未确认。还需实际循环、两次运行条件与逐元素误差证据。", content: "尾块索引范围值得优先核对，根因尚未确认。\n\n已知：[16,32] 通过；[17,33] 失败。修改编译参数后，错误位置未变。\n\n还需：实际循环、两次运行条件与逐元素误差证据。", sourceLabel: "AddCustom 精度异常", sourceType: "Agent 回答", taskId: "AddCustom 精度异常", signal: "question", status: "saved", createdAt: now },
      { id: "pocket-demo-input-layout", sourceKey: "pocket-demo:input-layout", title: "输入布局 HWC → NCHW：先核对模型约定", summary: "确认模型期望的轴顺序与 batch 维度，再决定是否转换输入。", content: "先确认模型输入约定。\n\n常见图像布局包括 HWC、CHW 与 NCHW；转换前核对通道顺序、数据类型与 batch 维度。", sourceLabel: "图像输入预处理", sourceType: "学习节点", taskId: "图像推理调试", signal: "interested", status: "saved", createdAt: now - 1000 },
      { id: "pocket-demo-error-evidence", sourceKey: "pocket-demo:error-evidence", title: "精度差异：先保留运行条件与误差分布", summary: "比较前记录输入、运行条件和逐元素误差，避免只根据最终差值猜根因。", content: "复现精度差异时，先固定输入与运行条件，再保存逐元素误差分布。\n\n对照两次运行结果，定位首个偏差位置后再检查算子边界与数据类型。", sourceLabel: "算子精度排查", sourceType: "Agent 回答", taskId: "AddCustom 精度异常", signal: "", status: "saved", createdAt: now - 2000 },
    ];
    const current = readKnowledgePocket();
    const items = [...current.items];
    for (const example of examples) {
      if (items.some(item => item.sourceKey === example.sourceKey || item.title === example.title)) continue;
      items.push(example);
    }
    const primary = items.find(item => item.sourceKey === examples[0].sourceKey || item.title === examples[0].title);
    if (primary) setSelectedPocketId(primary.id);
    if (items.length === current.items.length) return;
    const written = writeKnowledgePocket({ ...current, items });
    if (!written) return;
    setKnowledgePocket(written);
    announceKnowledgePocketChange();
  }, []);
  useEffect(() => {
    const sync = event => {
      if (event?.key && event.key !== "ascstudio.knowledge-pocket.v1") return;
      setKnowledgePocket(readKnowledgePocket());
    };
    window.addEventListener("storage", sync);
    window.addEventListener("ascstudio-knowledge-pocket-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ascstudio-knowledge-pocket-change", sync);
    };
  }, []);
  const [projectPanelOpen, setProjectPanelOpen] = useState(() => readSession("project-panel-open", false) === true);
  useEffect(() => { writeSession("project-panel-open", projectPanelOpen); }, [projectPanelOpen]);
  const initialConversationLayout = readSession("conversation-layout", "sidebar") === "floating" ? "floating" : "sidebar";
  const [conversationLayout, setConversationLayout] = useState(initialConversationLayout);
  useEffect(() => { writeSession("conversation-layout", conversationLayout); }, [conversationLayout]);
  const [floatingConversationExpanded, setFloatingConversationExpanded] = useState(() => initialConversationLayout === "floating" && wb.selectedTask === LOG_DIAGNOSTIC_TASK);
  const [conversationDragging, setConversationDragging] = useState(false);
  const [conversationDragEdgeHover, setConversationDragEdgeHover] = useState(false);
  const [conversationDockPreview, setConversationDockPreview] = useState(false);
  const [conversationFloatPreview, setConversationFloatPreview] = useState(false);
  const [permissionModes, setPermissionModes] = useState({});
  const conversationPanelRef = useRef(null);
  const conversationDragRef = useRef(null);
  const showNewTaskHome = mainView === "home";
  const showLearningDiscovery = mainView === "learning";
  const showAutomations = mainView === "automations";
  const showCapabilities = mainView === "capabilities";
  const showKnowledgePocket = mainView === "knowledge-pocket";
  const showTaskWorkspace = mainView === "task";
  const [pendingDiscoveryItem, setPendingDiscoveryItem] = useState(null);
  const [pendingRecommendationAction, setPendingRecommendationAction] = useState(null);
  const [learningAgentAction, setLearningAgentAction] = useState(null);
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
  const diagnosisCue = proactive.forCue("diagnosis-tail");
  const canvas = useCanvasState({ startEmpty: true, initialVisibleIds: ["task-brief", "source", "evidence", "explanation"], storageKey: "canvas-addcustom-v3" });
  const imageCanvas = useCanvasState({ startEmpty: true, cardDefinitions: IMAGE_MATERIALS, storageKey: "canvas-image", semanticDomain: "image-inference" });
  const [precisionContext, setPrecisionContext] = useState(() => readSession("precision-context", null));
  const [logTriageState, setLogTriageState] = useState(INITIAL_LOG_TRIAGE_STATE);
  const [logTriageResetVersion, setLogTriageResetVersion] = useState(0);
  useEffect(() => { writeSession("precision-context", precisionContext); }, [precisionContext]);
  const previousImage = useRef(null);
  const previousPrecision = useRef(precisionContext);
  const previousFlow = useRef({ attempts: flow.state.attempts.length, proposal: flow.state.proposedCode, applied: flow.state.appliedCode, validation: flow.state.validation });
  const [taskContentsOpen, setTaskContentsOpen] = useState(false);
  const [pointContext, setPointContext] = useState(null);
  const [areaInteractionActive, setAreaInteractionActive] = useState(false);
  const composerVoiceDraftRef = useRef("");
  const [composerPrimaryVoiceListening, setComposerPrimaryVoiceListening] = useState(false);
  const {
    query, setQuery, openedGroups, selectedTask, rationaleOpen, setRationaleOpen,
    visibleGroups, toggleGroup, selectTask, setSelectedRoute,
    session, task, currentGroup, isMainTask,
    openDialog, openMenu, sendMessage, setDraft, toast,
  } = wb;
  useLayoutEffect(() => {
    setFloatingConversationExpanded(conversationLayout === "floating" && selectedTask === LOG_DIAGNOSTIC_TASK);
  }, [conversationLayout, selectedTask]);
  useEffect(() => {
    const clearRangeContext = () => setPointContext(null);
    window.addEventListener("ascstudio-point-range-clear", clearRangeContext);
    window.addEventListener("ascstudio-point-range-consumed", clearRangeContext);
    return () => {
      window.removeEventListener("ascstudio-point-range-clear", clearRangeContext);
      window.removeEventListener("ascstudio-point-range-consumed", clearRangeContext);
    };
  }, []);
  useEffect(() => setPointContext(null), [selectedTask]);
  const onComposerVoiceStart = () => { composerVoiceDraftRef.current = wb.draftRef.current?.value ?? draft; };
  const onComposerVoiceTranscript = (transcript) => setDraft([composerVoiceDraftRef.current.trim(), transcript.trim()].filter(Boolean).join(" "));
  useLayoutEffect(() => {
    const textarea = wb.draftRef.current;
    if (!textarea) return;
    const isCompactComposer = textarea.closest(".conversation-panel")?.matches(".is-composer-only, .is-conversation-expanded");
    const minHeight = isCompactComposer ? 20 : 44;
    textarea.style.height = `${minHeight}px`;
    if (!textarea.value) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(minHeight, Math.min(textarea.scrollHeight, 110))}px`;
  }, [session.draft, mainView, conversationLayout, floatingConversationExpanded]);
  const clearPointContext = () => {
    setPointContext(null);
    window.dispatchEvent(new Event("ascstudio-point-range-consumed"));
  };
  const sendAreaMessage = (text, context) => {
    const generationText = `${text}\n\n用户指向工作区区域「${context.contentTitle || "当前内容"} · ${context.label}」。${context.selectedText ? `选区内可读取文本：\n${context.selectedText}` : "选区可能包含图表、代码或其他视觉内容，请结合当前任务上下文理解。"}`;
    const accepted = sendMessage(null, { userText: text, scopeReference: { ...context }, generationText });
    if (accepted) clearPointContext();
    return accepted;
  };
  const selectExistingTask = (name) => { selectTask(name); setMainView("task"); };
  const { selectedRoute, draft } = session;
  const composerHasPayload = Boolean(draft.trim() || session.attachments.length);
  const permissionMode = permissionModes[selectedTask] || "confirm";
  const permissionModeLabel = PERMISSION_OPTIONS.find(item => item.id === permissionMode)?.label || "每次确认";
  const messages = session.messages.filter(message => {
    if (["learning", "official-learning"].includes(task.kind) && (message.communityInvite || message.communityDraftCard)) return false;
    if (selectedTask === MAIN_TASK && message.communityInvite?.summaryId === "demo-addcustom-resolution-feedback") return false;
    return !message.communityDraftCard || Boolean(message.communityDraftId && session.communityDraft?.id === message.communityDraftId && session.communityDraft?.completionId);
  });
  const selectedRouteData = routes.find((route) => route.id === selectedRoute) || routes[0];
  const feedback = (value) => wb.patchSession({ feedback: session.feedback === value ? null : value });
  const closeMenuAnd = (action) => { wb.setMenu(null); action(); };
  const isImageTask = selectedTask === IMAGE_TASK;
  const isLogDiagnosticTask = selectedTask === LOG_DIAGNOSTIC_TASK;
  const supportsCommunityDraft = selectedTask === IMAGE_TASK || selectedTask === MAIN_TASK || isLogDiagnosticTask;
  const isStandardLearningTask = task.kind === "learning";
  const isPathGenerationTask = selectedTask === LEARNING_PATH_GENERATION_TASK;
  const isOfficialLearningTask = task.kind === "official-learning";
  const isLearningTask = isStandardLearningTask || isOfficialLearningTask;
  const communityInviteMessage = supportsCommunityDraft
    ? [...session.messages].reverse().find(message => message.communityInvite)
    : null;
  const showCommunityInvite = Boolean(communityInviteMessage && (selectedTask !== MAIN_TASK || session.communityInviteReady) && communityInviteMessage.communityInvite.summaryId !== session.communityDraft?.completionId);
  const routeInitialized = useRef(false);
  useEffect(() => {
    // The knowledge-pocket preview uses its own one-time launch parameters.
    // Keep that embedded flow independent from task-page navigation history.
    if (new URLSearchParams(window.location.search).get("pocket-demo") === "1") {
      routeInitialized.current = true;
      return;
    }
    const address = new URL(window.location.href);
    const rawTask = address.searchParams.get("task");
    const taskNames = new Set(wb.groups.flatMap(group => group.tasks));
    const addressTask = resolveTaskUrlValue(rawTask, taskNames);
    const targetTask = mainView === "task" ? selectedTask : null;
    const urlAlreadyMatches = targetTask
      ? addressTask === targetTask && rawTask === taskUrlIdentifier(targetTask)
      : !rawTask;
    const routeState = { view: mainView, task: targetTask };
    const nextHistoryState = { ...(window.history.state || {}), ascendStudioRoute: routeState };
    const currentRouteState = window.history.state?.ascendStudioRoute;
    const stateAlreadyMatches = currentRouteState?.view === routeState.view && currentRouteState?.task === routeState.task;
    const initialSync = !routeInitialized.current;
    routeInitialized.current = true;

    if (urlAlreadyMatches) {
      if (!stateAlreadyMatches) window.history.replaceState(nextHistoryState, "", address.href);
      return;
    }

    if (targetTask) address.searchParams.set("task", taskUrlIdentifier(targetTask));
    else address.searchParams.delete("task");

    // Normalize first loads and legacy aliases in place. User navigation adds
    // history entries so Back / Forward restores the previous task or page.
    const method = initialSync || (targetTask && addressTask === targetTask) ? "replaceState" : "pushState";
    window.history[method](nextHistoryState, "", address.href);
  }, [mainView, selectedTask, wb.groups]);
  useEffect(() => {
    const handlePopState = () => {
      if (new URLSearchParams(window.location.search).get("pocket-demo") === "1") return;
      const taskNames = new Set(wb.groups.flatMap(group => group.tasks));
      const addressTask = resolveTaskUrlValue(new URLSearchParams(window.location.search).get("task"), taskNames);
      const routeState = window.history.state?.ascendStudioRoute;
      if (addressTask) {
        wb.selectTask(addressTask);
        setMainView("task");
        return;
      }
      if (routeState?.view === "task" && taskNames.has(routeState.task)) wb.selectTask(routeState.task);
      setMainView(["home", "learning", "automations", "capabilities", "knowledge-pocket"].includes(routeState?.view) ? routeState.view : "home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [wb.groups, wb.selectTask]);
  const isInteractiveTask = isMainTask || isImageTask || isLogDiagnosticTask || isLearningTask;
  const workspace = useContentWorkspace({ taskId: selectedTask, isMainTask: isInteractiveTask, initialMaterialId: isLogDiagnosticTask ? "log-diagnosis" : isOfficialLearningTask ? OFFICIAL_LEARNING_MATERIALS[0]?.id : isLearningTask ? "learning-goal" : undefined, defaultToLearningCanvas: isLearningTask });
  useEffect(() => {
    if (!isLogDiagnosticTask || workspace.state.collapsed) return undefined;
    const scrollToLatest = () => window.requestAnimationFrame(() => {
      const conversation = wb.conversationRef.current;
      conversation?.scrollTo({ top: conversation.scrollHeight, behavior: "auto" });
    });
    scrollToLatest();
    window.addEventListener("resize", scrollToLatest);
    return () => window.removeEventListener("resize", scrollToLatest);
  }, [isLogDiagnosticTask, selectedTask, workspace.state.collapsed]);
  const communityDraftFocus = showTaskWorkspace && supportsCommunityDraft && Boolean(session.communityDraft?.open && session.communityDraft?.completionId);
  const layout = useWorkbenchLayout({ projectPanelOpen, contentCollapsed: showTaskWorkspace && workspace.state.collapsed, learningLayout: isLearningTask, communityDraftFocus });
  const resetConversationDrag = () => {
    const active = conversationDragRef.current;
    conversationDragRef.current = null;
    if (active?.handle?.hasPointerCapture(active.pointerId)) active.handle.releasePointerCapture(active.pointerId);
    conversationPanelRef.current?.style.removeProperty("--conversation-drag-x");
    conversationPanelRef.current?.style.removeProperty("--conversation-drag-y");
    setConversationDragging(false);
    setConversationDragEdgeHover(false);
    setConversationDockPreview(false);
    setConversationFloatPreview(false);
  };
  const conversationDockTargetContains = (clientX, clientY) => {
    const workspaceElement = layout.workspaceRef.current;
    if (!workspaceElement) return false;
    const workspaceRect = workspaceElement.getBoundingClientRect();
    const styles = getComputedStyle(workspaceElement);
    const projectsEdge = Number.parseFloat(styles.getPropertyValue("--projects-edge")) || 56;
    const conversationEdge = Number.parseFloat(styles.getPropertyValue("--conversation-edge"));
    if (!Number.isFinite(conversationEdge) || conversationEdge <= projectsEdge) return false;
    const left = workspaceRect.left + projectsEdge;
    const right = workspaceRect.left + conversationEdge;
    return clientX >= left - 16 && clientX <= right + 16 && clientY >= workspaceRect.top && clientY <= workspaceRect.bottom;
  };
  const conversationFloatTargetContains = (clientX, clientY) => {
    const workspaceElement = layout.workspaceRef.current;
    if (!workspaceElement) return false;
    const workspaceRect = workspaceElement.getBoundingClientRect();
    const styles = getComputedStyle(workspaceElement);
    const projectsEdge = Number.parseFloat(styles.getPropertyValue("--projects-edge")) || 56;
    const conversationEdge = Number.parseFloat(styles.getPropertyValue("--conversation-edge"));
    const contentStart = Number.isFinite(conversationEdge) ? conversationEdge : projectsEdge;
    const centerX = workspaceRect.left + projectsEdge + (workspaceRect.width - projectsEdge) / 2;
    const hitWidth = Math.min(360, Math.max(220, (workspaceRect.right - workspaceRect.left - contentStart) / 2));
    const bottomBand = Math.min(190, Math.max(120, workspaceRect.height * 0.28));
    return clientX >= centerX - hitWidth && clientX <= centerX + hitWidth && clientY >= workspaceRect.bottom - bottomBand && clientY <= workspaceRect.bottom;
  };
  const isConversationDragEdge = (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("textarea, button, input, select, a, [contenteditable='true'], .composer-context-chips")) return false;
    const rect = event.currentTarget.getBoundingClientRect();
    const edge = 10;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return x <= edge || rect.right - event.clientX <= edge || y <= edge || rect.bottom - event.clientY <= edge;
  };
  const moveConversationDrag = (event) => {
    const active = conversationDragRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - active.clientX;
    const deltaY = event.clientY - active.clientY;
    if (!active.moved && Math.hypot(deltaX, deltaY) < 5) return;
    active.moved = true;
    setConversationDragging(true);
    conversationPanelRef.current?.style.setProperty("--conversation-drag-x", `${deltaX}px`);
    conversationPanelRef.current?.style.setProperty("--conversation-drag-y", `${deltaY}px`);
    const destination = active.sourceLayout === "floating"
      ? conversationDockTargetContains(event.clientX, event.clientY) ? "sidebar" : null
      : conversationFloatTargetContains(event.clientX, event.clientY) ? "floating" : null;
    setConversationDockPreview(destination === "sidebar");
    setConversationFloatPreview(destination === "floating");
    event.preventDefault();
  };
  const handleConversationPointerMove = (event) => {
    if (conversationDragRef.current) {
      moveConversationDrag(event);
      return;
    }
    const canDrag = !areaInteractionActive && window.innerWidth > 980 && event.pointerType === "mouse" && isConversationDragEdge(event);
    setConversationDragEdgeHover(current => current === canDrag ? current : canDrag);
  };
  const startConversationDrag = (event) => {
    if (areaInteractionActive || window.innerWidth <= 980 || event.button !== 0 || !event.isPrimary || conversationDragRef.current || !isConversationDragEdge(event)) return;
    setConversationDragEdgeHover(false);
    conversationDragRef.current = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, moved: false, sourceLayout: conversationLayout, handle: event.currentTarget };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const finishConversationDrag = (event, cancelled = false) => {
    const active = conversationDragRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (!cancelled) moveConversationDrag(event);
    const hasTarget = active.sourceLayout === "floating"
      ? conversationDockTargetContains(event.clientX, event.clientY)
      : conversationFloatTargetContains(event.clientX, event.clientY);
    const shouldSwitch = !cancelled && active.moved && hasTarget;
    resetConversationDrag();
    if (shouldSwitch) setConversationLayout(active.sourceLayout === "floating" ? "sidebar" : "floating");
  };
  useEffect(() => {
    if (areaInteractionActive && conversationDragRef.current) resetConversationDrag();
  }, [areaInteractionActive]);
  const visibleContentId = layout.contentWidth <= 620 && workspace.state.splitId && [workspace.state.activeId, workspace.state.splitId].includes(workspace.state.comparisonFocusId) ? workspace.state.comparisonFocusId : workspace.state.activeId;
  const contentVisible = id => !workspace.state.collapsed && workspace.state.activeId !== "canvas" && (layout.contentWidth <= 620 ? visibleContentId === id : workspace.state.activeId === id || workspace.state.splitId === id);
  const learningCanvasView = useLearningCanvasView({ taskId: isStandardLearningTask ? selectedTask : "__inactive-learning", enabled: isStandardLearningTask, initialStage: isPathGenerationTask ? "path" : "channels", resetOnLoad: isPathGenerationTask });
  const learningCanvasVisible = isStandardLearningTask && !workspace.state.collapsed && workspace.state.activeId === "canvas" && workspace.state.canvasMode === "free";
  const learning = useLearningJourney({ taskId: isStandardLearningTask ? selectedTask : "__inactive-learning", profile: task.learningProfile, seedPathGeneration: isPathGenerationTask, visible: isStandardLearningTask && (contentVisible("learning-lesson") || learningCanvasVisible && learningCanvasView.state.expanded && ["channels", "environment"].includes(learningCanvasView.state.selectedStage)), onRecord: (record, ownerId) => { wb.addRecord(record, ownerId); const id = ({ "learning-path": "learning-path", "learning-attempt": "learning-practice", "learning-check": "learning-check", "learning-summary": "learning-summary" })[record.kind]; if (id) workspace.actions.open(id, { activate: false, taskId: ownerId, isMainTask: true }); } });
  useEffect(() => {
    if (learningAgentAction && learningAgentAction.taskId !== selectedTask) setLearningAgentAction(null);
  }, [selectedTask, learningAgentAction]);
  const statusForTask = name => {
    if (name === LEARNING_PATH_GENERATION_TASK && name === selectedTask) {
      if (learning.state.path) return { label: "路径已确认", tone: "confirmed" };
      if (learning.state.draftPath) return { label: "路径共创中", tone: "review" };
      return { label: "生成中", tone: "review" };
    }
    const details = wb.getTask(name);
    return details.sidebarStatus ? { label: details.sidebarStatus, tone: details.sidebarStatusTone || "review" } : null;
  };
  const officialCanvasVisible = isOfficialLearningTask && !workspace.state.collapsed && workspace.state.activeId === "canvas" && workspace.state.canvasMode === "free";
  const officialCanvasView = useLearningCanvasView({ taskId: isOfficialLearningTask ? selectedTask : "__inactive-official-learning", enabled: isOfficialLearningTask, stageIds: OFFICIAL_STAGE_IDS, initialStage: OFFICIAL_LEARNING_STAGES[0].id, materialStages: OFFICIAL_MATERIAL_STAGES, storagePrefix: "official-learning-canvas-v2" });
  const officialLearning = useOfficialLearningPath({ taskId: isOfficialLearningTask ? selectedTask : "__inactive-official-learning", enabled: isOfficialLearningTask, visible: officialCanvasVisible && officialCanvasView.state.expanded && showTaskWorkspace, onRecord: (record, ownerId) => wb.addRecord(record, ownerId) });
  const learningCanvas = useCanvasState({ startEmpty: true, cardDefinitions: LEARNING_MATERIALS, storageKey: `canvas-learning-${isLearningTask || isOfficialLearningTask ? selectedTask : "__inactive-learning"}`, semanticDomain: "learning" });
  const learningCanvasMaterial = !learning.state.path && !learning.state.draftPath ? "learning-goal" : ({ goal: "learning-goal", path: "learning-path", environment: "learning-lesson", channels: "learning-lesson", practice: "learning-practice", check: "learning-check", summary: "learning-summary" })[learningCanvasView.state.selectedStage];
  const learningCanvasMaterialIds = learningCanvasVisible && learningCanvasView.state.expanded && learningCanvasMaterial ? [learningCanvasMaterial] : [];
  useEffect(() => {
    if (!learningCanvasVisible || !learningCanvasView.state.expanded || !learningCanvasMaterial) return;
    workspace.actions.open(learningCanvasMaterial, { activate: false, restore: true, viewedInCanvas: true });
  }, [selectedTask, learningCanvasVisible, learningCanvasView.state.expanded, learningCanvasMaterial]);
  useEffect(() => {
    if (!officialCanvasVisible || !officialLearning.state.selectedNodeId) return;
    workspace.actions.open(officialLearning.state.selectedNodeId, { activate: false, restore: true, viewedInCanvas: true });
  }, [selectedTask, officialCanvasVisible, officialLearning.state.selectedNodeId]);
  const officialCanvasMaterialIds = officialCanvasVisible && officialLearning.state.selectedNodeId ? [officialLearning.state.selectedNodeId] : [];
  const imageVisible = isImageTask && contentVisible("image-explanation");
  const inference = useImageInference({ visible: imageVisible, onAxesReady: (snapshot, shape) => {
    offerCommunityExperience({
      id: `image-shape-check-${snapshot.axes.join("-")}-${snapshot.batch ? "n1" : "no-batch"}`,
      kind: "image-shape-check",
      dimensions: shape.dimensions,
      snapshot,
      demoFixture: true,
      completionText: `输出轴设置与 batch 维度已符合示例约定：NCHW [${shape.dimensions.join(", ")}]。可以把本次参数调整整理为社区经验；真实模型推理仍需在目标环境验证。`,
    });
  }, onRecord: record => {
    wb.addRecord(record, IMAGE_TASK);
    if (record.kind === "image-validation" && record.data?.passed) {
      offerCommunityExperience({
        id: `image-shape-check-${record.data.snapshot.axes.join("-")}-${record.data.snapshot.batch ? "n1" : "no-batch"}`,
        kind: "image-shape-check",
        dimensions: record.data.dimensions,
        snapshot: record.data.snapshot,
        attemptCount: inference.state.attempts.length,
        demoFixture: true,
        completionText: `输出轴设置与 batch 维度已符合示例约定：NCHW [${record.data.dimensions.join(", ")}]。可以把本次参数调整整理为社区经验；真实模型推理仍需在目标环境验证。`,
      });
    }
  } });
  const explanationVisible = isMainTask && (contentVisible("explanation") || workspace.state.activeId === "canvas" && workspace.state.canvasMode === "focus" && (workspace.state.overview.focusId || workspace.state.lastContentId) === "explanation");
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
    if (isOfficialLearningTask && getOfficialLearningNode(id)) {
      const node = getOfficialLearningNode(id);
      id = node.kind === "course" ? node.children[0].id : node.id;
      officialLearning.actions.selectNode(id);
      officialCanvasView.actions.openMaterial(id);
      officialCanvasView.actions.revealObject(`${id}:diagram`);
      officialCanvasView.actions.revealObject(`${id}:lesson`);
      workspace.actions.open(id, { ...options, activate: false, restore: true, viewedInCanvas: true });
      workspace.actions.openCanvas({ mode: "free" });
      setTaskContentsOpen(false);
      return;
    }
    if (isLearningTask && LEARNING_MATERIALS.some(item => item.id === id)) {
      if (id === "learning-lesson" && options.anchor) learningCanvasView.actions.select("channels", options.anchor);
      else learningCanvasView.actions.openMaterial(id);
      workspace.actions.open(id, { ...options, activate: false, restore: true, viewedInCanvas: true });
      workspace.actions.openCanvas({ mode: "free" });
      setTaskContentsOpen(false);
      return;
    }
    const keepAddCustomCanvas = isMainTask && (options.activate !== false || options.viewedInCanvas === true);
    if (id === "canvas" && keepAddCustomCanvas) {
      openCanvas({ mode: options.mode || "focus", fit: options.fit });
      return;
    }
    if ((id === "explanation" || id === "source") && options.anchor) explanation.actions.focusConcept(options.anchor);
    if (id === "explanation" && (options.time !== undefined || options.video)) explanation.actions.openAt({ focus: options.anchor || explanation.state.focus, time: options.time, video: options.video });
    if (id === "compare") {
      if (keepAddCustomCanvas) {
        workspace.actions.open("source", { activate: false, restore: true, viewedInCanvas: true });
        workspace.actions.open("draft", { activate: false, restore: true, viewedInCanvas: true });
        workspace.actions.setOverview({ focusId: "source" });
        openCanvas({ mode: "free", compareIds: ["source", "draft"] });
      } else {
        workspace.actions.open("source");
        workspace.actions.splitWith("draft");
      }
    } else {
      if (id === "diff" && !options.prepared && !options.restore && !flow.state.proposedCode) flow.actions.prepareDiff();
      const workspaceOptions = keepAddCustomCanvas ? { ...options, activate: false, restore: true, viewedInCanvas: true } : options;
      if (options.split && keepAddCustomCanvas) {
        const previousFocusId = workspace.state.overview.focusId || workspace.state.lastContentId || "source";
        workspace.actions.open(id, workspaceOptions);
        workspace.actions.setOverview({ focusId: previousFocusId });
        openCanvas({ mode: "free", compareIds: [previousFocusId, id] });
      } else {
        if (options.split) workspace.actions.splitWith(id, options);
        else workspace.actions.open(id, workspaceOptions);
        if (keepAddCustomCanvas) {
          workspace.actions.setOverview({ focusId: id });
          openCanvas({ mode: "focus", focusId: id });
        }
      }
    }
    setTaskContentsOpen(false);
  };
  const openDiscoveryItem = (destination) => {
    if (!destination?.taskName || !destination?.materialId) return;
    wb.setMenu(null);
    setMainView("task");
    setProjectPanelOpen(false);
    workspace.actions.setCollapsed(false);
    if (destination.taskName === selectedTask) {
      openContent(destination.materialId, { restore: true, ...(destination.anchor ? { anchor: destination.anchor } : {}) });
      return;
    }
    setPendingDiscoveryItem(destination);
    wb.selectTask(destination.taskName);
  };
  useEffect(() => {
    if (!pendingDiscoveryItem || pendingDiscoveryItem.taskName !== selectedTask) return;
    const destination = pendingDiscoveryItem;
    setPendingDiscoveryItem(null);
    openContent(destination.materialId, { restore: true, ...(destination.anchor ? { anchor: destination.anchor } : {}) });
  }, [pendingDiscoveryItem, selectedTask]);
  const updateOverview = (patch, ownerId = selectedTask) => {
    if (Array.isArray(patch.compactIds)) {
      const ownerCanvas = ["learning", "official-learning"].includes(wb.getTask(ownerId).kind) ? learningCanvas : ownerId === IMAGE_TASK ? imageCanvas : canvas;
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
    if (isOfficialLearningTask) {
      const node = getOfficialLearningNode(context.nodeId || officialLearning.state.selectedNodeId);
      if (!node || node.kind !== "step") return;
      const time = context.time || 0;
      const sourceContext = { ...context, kind: "official-learning", nodeId: node.id, stamp: `00:${String(Math.floor(time)).padStart(2, "0")}` };
      const reply = `${node.lesson.body}\n\n${node.checkpoint.explanation}\n\n可以在同一节点对照图解、官方资料和理解检查；这里的讲解与练习不代表设备推理已通过。`;
      if (wb.addExchange({ text: `解释「${node.title}」${sourceContext.stamp}：“${context.subtitle}”`, sourceContext }, { text: reply, sourceContext })) {
        openContent(node.id);
        officialLearning.actions.seek(time);
      }
      return;
    }
    if (isStandardLearningTask) {
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
    const requestedMode = options.mode || "overview";
    if (isOfficialLearningTask) {
      const selected = getOfficialLearningNode(options.focusId || officialLearning.state.selectedNodeId);
      const step = selected?.kind === "course" ? selected.children[0] : selected;
      if (step) {
        officialLearning.actions.selectNode(step.id);
        officialCanvasView.actions.openMaterial(step.id);
        officialCanvasView.actions.revealObject(`${step.id}:diagram`);
        officialCanvasView.actions.revealObject(`${step.id}:lesson`);
      }
      workspace.actions.openCanvas({ mode: "free", fit: Boolean(options.fit) });
      setTaskContentsOpen(false);
      return;
    }
    // 图像推理任务的“全部内容”就是自由画布；不再切到另一张分组卡片总览。
    const mode = isImageTask && requestedMode === "overview" ? "free" : requestedMode;
    const fitOnEntry = Boolean(options.fit || isImageTask && requestedMode === "overview");
    const targetCanvas = isLearningTask ? learningCanvas : isImageTask ? imageCanvas : canvas;
    if (isMainTask && ["focus", "overview", "detail"].includes(mode)) {
      if (mode === "focus" || mode === "detail") {
        const focusId = options.focusId || targetCanvas.state.selectedCardId || workspace.state.overview.focusId || workspace.state.lastContentId || "explanation";
        const items = getTaskItems(selectedTask).flatMap(item => [item, ...(item.children || [])]);
        const material = items.find(item => item.id === focusId);
        const relatedIds = new Set((material?.relations || []).map(relation => relation.id));
        const focusIds = [focusId, ...relatedIds].filter((id, index, all) => all.indexOf(id) === index && items.some(item => item.id === id));
        focusIds.forEach(id => {
          const card = targetCanvas.state.cards.find(item => item.id === id);
          if (card) { if (!card.visible) targetCanvas.actions.showCard(id, { focus: false }); }
          else {
            const item = items.find(candidate => candidate.id === id);
            if (item?.available !== false) targetCanvas.actions.addCard({ ...getMaterialMeta(id, item), width: id === "explanation" ? 360 : 300, height: id === "explanation" ? 450 : 390 }, { focus: false });
          }
        });
        workspace.actions.setOverview({ focusId });
      } else {
        getTaskItems(selectedTask).flatMap(item => [item, ...(item.children || [])]).filter(item => item.id !== "canvas" && item.available !== false).forEach(item => {
          const existing = targetCanvas.state.cards.find(card => card.id === item.id);
          if (existing) { if (!existing.visible) targetCanvas.actions.showCard(item.id, { focus: false }); }
          else targetCanvas.actions.addCard({ ...getMaterialMeta(item.id, item), width: 420, height: 320 }, { focus: false });
        });
      }
      workspace.actions.openCanvas({ mode, fit: options.fit });
      setTaskContentsOpen(false);
      return;
    }
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
        else targetCanvas.actions.addCard({ ...getMaterialMeta(item.id, item), width: 420, height: 300, collapsed: workspace.state.overview.compactIds.includes(item.id) }, { focus: false });
      });
      if (added || fitOnEntry) requestAnimationFrame(() => targetCanvas.actions.fitCanvas());
    }
    if (mode === "free") targetCanvas.state.cards.filter(card => card.opened).forEach(card => { if (Boolean(card.collapsed) !== workspace.state.overview.compactIds.includes(card.id)) targetCanvas.actions.toggleCollapse(card.id); });
    workspace.actions.openCanvas({ mode, fit: fitOnEntry });
    setTaskContentsOpen(false);
  };
  useEffect(() => {
    if (!isImageTask || workspace.state.activeId !== "canvas" || workspace.state.canvasMode !== "overview") return;
    // 把旧会话里已打开的分组总览迁移到新的任务画布入口。
    openCanvas({ mode: "free", fit: true });
  }, [isImageTask, selectedTask, workspace.state.activeId, workspace.state.canvasMode]);
  const openLearningPathReview = () => {
    if (!isStandardLearningTask) return;
    learningCanvasView.actions.select("path");
    learningCanvasView.actions.setExpanded(true);
    workspace.actions.openCanvas({ mode: "free" });
    setTaskContentsOpen(false);
  };
  const restoreContent = (id) => {
    const saved = workspace.getTaskState(selectedTask).snapshots.find(item => item.id === id) || wb.getSession(selectedTask).records.find(item => "record:" + item.id === id);
    const indexed = getTaskItems(selectedTask).flatMap(item => [item, ...(item.children || [])]).find(item => item.id === id);
    if (saved?.parentId || indexed?.parentId) workspace.actions.markRead(saved?.parentId || indexed.parentId);
    openContent(id, { restore: true, ...((saved || indexed) ? { title: (saved || indexed).title, type: indexed?.parentId || saved ? "preview" : indexed.type } : {}) });
  };
  const openOfficialLearningContent = (id, canvasObjectId) => {
    const selected = getOfficialLearningNode(id);
    if (!selected) return;
    const node = selected.kind === "course" ? selected.children[0] : selected;
    officialLearning.actions.selectNode(node.id);
    officialCanvasView.actions.openMaterial(node.id);
    officialCanvasView.actions.requestFocus(canvasObjectId || `${node.id}:diagram`);
    workspace.actions.open(node.id, { restore: true, title: node.title, type: "preview" });
    setTaskContentsOpen(false);
  };
  const compareContent = id => {
    const item = getTaskItems(selectedTask).flatMap(entry => [entry, ...(entry.children || [])]).find(entry => entry.id === id);
    if (!item || item.available === false) return;
    if (isMainTask) {
      const focusId = workspace.state.overview.focusId || workspace.state.lastContentId || "source";
      workspace.actions.open(id, { activate: false, restore: true, viewedInCanvas: true, title: item.title, type: item.type });
      workspace.actions.setOverview({ focusId });
      openCanvas({ mode: "free", compareIds: [focusId, id] });
      if (item.parentId) workspace.actions.markRead(item.parentId);
      return;
    }
    workspace.actions.splitWith(id, { restore: true, title: item.title, type: id.startsWith("snapshot:") || id.startsWith("record:") || id.startsWith("attempt:") ? "preview" : item.type });
    if (item.parentId) workspace.actions.markRead(item.parentId);
  };
  const arrangeMaterials = (ids) => {
    if (!isInteractiveTask) return;
    if (isOfficialLearningTask) {
      const materialId = ids.find(id => OFFICIAL_LEARNING_MATERIALS.some(item => item.id === id));
      if (materialId) { openContent(materialId, { restore: true }); return; }
      workspace.actions.openCanvas({ mode: "free" });
      setTaskContentsOpen(false);
      return;
    }
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
      else {
        const item = getTaskItems(selectedTask).flatMap(entry => [entry, ...(entry.children || [])]).find(entry => entry.id === id);
        targetCanvas.actions.addCard({ ...getMaterialMeta(id, item), width: 440, height: 340 }, { focus: false });
      }
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
    const withPointContext = (options = {}) => pointContext ? {
      ...options,
      scopeReference: { ...pointContext },
      generationText: pointContext.type === "workspace-area"
        ? `${text}\n\n用户指向工作区区域「${pointContext.contentTitle || "当前内容"} · ${pointContext.label}」。${pointContext.selectedText ? `选区内可读取文本：\n${pointContext.selectedText}` : "选区可能包含图表、代码或其他视觉内容，请结合当前任务上下文理解。"}`
        : `${text}\n\n用户指向图解范围：${pointContext.label}`,
    } : options;
    const consumePointContext = () => { if (pointContext) clearPointContext(); };
    if (isOfficialLearningTask) {
      event?.preventDefault();
      if (!text || session.replying) return;
      const target = /目标检测/.test(text) ? "learning-official-step-object-detection"
        : /环境|设备|版本/.test(text) ? "learning-official-step-environment-check"
        : /预处理|通道|轴序|batch/i.test(text) ? "learning-official-step-preprocess"
        : /输入|张量|形状/.test(text) ? "learning-official-step-resnet-input"
        : /执行|运行|调用顺序/.test(text) ? "learning-official-step-inference-output"
        : /输出|结果|分类结果/.test(text) ? "learning-official-step-resnet-result"
        : /小结|记录|复盘|保存/.test(text) ? "learning-official-step-save-summary"
        : /生命周期|资源释放/.test(text) ? "learning-official-step-acl-lifecycle"
        : /初始化|模型加载/.test(text) ? "learning-official-step-acl-init"
        : /路径|课程|AscendCL/.test(text) ? OFFICIAL_LEARNING_STAGES[0].children[0].id
        : officialLearning.state.selectedNodeId;
      const targetNode = getOfficialLearningNode(target);
      const replyText = targetNode
        ? `已定位「${targetNode.title}」。${targetNode.lesson?.body || targetNode.summary}\n\n在同一画布里可以看图解、打开官方视频课程、检查理解并保留尝试。节点进度由理解与当前检查更新；真实设备运行仍需在官方实验环境验证。`
        : "这份路径按认识链路、准备环境、准备输入、执行推理、解读结果组织，可以从具体学习动作继续。";
      if (sendMessage(event, withPointContext({ replyText }))) {
        consumePointContext();
        if (targetNode) openContent(target);
        else openCanvas({ mode: "free" });
      }
      return;
    }
    if (isStandardLearningTask) {
      event?.preventDefault();
      if (!text || session.replying) return;
      let action = () => openContent("learning-goal");
      let replyText = "目标与基础已保留。可以在右侧修改，再生成或选用图像输入预处理的示例路径。";
      let messageMeta;
      let pathAgentAction = null;
      if (/取消.*(?:路径|调整|变更)|(?:路径|调整|变更).*取消/.test(text)) {
        action = () => { learning.actions.cancelPath(); openContent("learning-path"); };
        replyText = "已取消路径调整，保留原来已确认的路径与学习记录。";
      } else if (/跳过.*环境|环境.*(?:准备好|配置好|已配|已准备)/.test(text)) {
        action = () => { const entry = (learning.state.draftPath || learning.state.path)?.find(node => node.id === "environment"); if (!entry?.skipped) learning.actions.editPath("environment", "skip"); openContent("learning-path"); };
        replyText = "已把环境准备节点的跳过调整放进路径共创中。理解 → 跟练 → 输入检查继续保留；确认后才开始学习。";
        const environment = (learning.state.draftPath || learning.state.path)?.find(node => node.id === "environment");
        if (!environment?.skipped) pathAgentAction = { type: "adjust", label: "调整节点", targets: [{ stageId: "environment", stepId: "environment-intro" }] };
      } else if (/恢复.*环境|环境.*恢复/.test(text)) {
        action = () => { const entry = (learning.state.draftPath || learning.state.path)?.find(node => node.id === "environment"); if (entry?.skipped) learning.actions.editPath("environment", "skip"); openContent("learning-path"); };
        replyText = "已把环境节点恢复放进路径共创中，等你决定后再开始学习。";
        const environment = (learning.state.draftPath || learning.state.path)?.find(node => node.id === "environment");
        if (environment?.skipped) pathAgentAction = { type: "adjust", label: "恢复节点", targets: [{ stageId: "environment", stepId: "environment-intro" }] };
      } else if ((learning.state.draftPath || learning.state.path) && /(?:已经|已掌握|会了|熟悉|学过|重点|优先|补充|增加|加入|移除|删除|跳过|减少|调整|更关注|不需要|移动|移到|放到|排到)/i.test(text)) {
        const pathBeforeChange = learning.state.draftPath || learning.state.path;
        const move = findLearningPathMove(text, pathBeforeChange);
        action = openLearningPathReview;
        if (move) {
          const moved = learning.actions.reorderPathStep(move.stageId, move.stepId, move.targetId, move.direction);
          if (moved) {
            pathAgentAction = { type: "move", label: "移动节点", targets: [{ stageId: move.stageId, stepId: move.stepId }, { stageId: move.stageId, stepId: move.targetId }] };
            replyText = `我已把「${move.title}」移动到「${move.targetTitle}」${move.direction === "before" ? "之前" : "之后"}，改动留在路径草案里。你可以继续调整或撤销；确认整条路径后才会生效。`;
          } else replyText = "这两个节点当前不能这样调整；我已打开路径画布，你可以查看同阶段的节点并继续编辑。";
        } else {
          const proposal = learning.actions.proposePathChanges(text);
          if (proposal.changes.length) {
            messageMeta = { pathReviewId: proposal.proposalId };
            const targets = [...proposal.changes.map(change => ({ stageId: change.stageId, stepId: change.stepId })), ...(proposal.contextTargets || [])];
            const uniqueTargets = targets.filter((target, index) => targets.findIndex(item => item.stageId === target.stageId && item.stepId === target.stepId) === index);
            const orderedTargets = uniqueTargets.sort((a, b) => {
              const path = proposal.path || learning.state.draftPath || learning.state.path || [];
              const stageOrder = stageId => path.findIndex(stage => stage.id === stageId);
              const stepOrder = target => stepsForStage(path.find(stage => stage.id === target.stageId)).findIndex(step => step.id === target.stepId);
              return stageOrder(a.stageId) - stageOrder(b.stageId) || stepOrder(a) - stepOrder(b);
            });
            pathAgentAction = { type: "propose", label: "按新目标调整节点", targets: orderedTargets };
            const profileUpdate = proposal.profileChanged ? `已同步目标、基础和每天 ${proposal.profile.dailyMinutes} 分钟的安排。` : "";
            const orderNote = proposal.contextTargets?.length ? "NCHW 检查已放在跟练之后，我会保留这条依赖顺序。" : "";
            replyText = `我根据你补充的学习情况提出了 ${proposal.changes.length} 项节点变化。${profileUpdate}${orderNote}Agent 已逐个定位相关节点；你可以在画布上逐项采纳或忽略，也可以继续手动调整。整条路径确认前不会开始学习。`;
          } else if (proposal.profileChanged) {
            replyText = `已同步学习目标、基础和每天 ${proposal.profile.dailyMinutes} 分钟的安排。现有节点暂无变化；你可以继续说想快速回顾或新增的练习内容。`;
          } else replyText = "我已打开正在共创的路径。你可以说已掌握的节点、想补充的主题，或希望重点练习的部分；新的 AI 变化会直接出现在相应节点上。";
        }
      } else if (!learning.state.path && !learning.state.draftPath && /(?:我想|希望|想要|帮我|我要).{0,36}(?:学会|学习|掌握|了解)|(?:生成|准备|制定).{0,16}(?:学习)?路径/i.test(text)) {
        const proposal = learning.actions.startPathFromPrompt(text);
        if (proposal) {
          action = openLearningPathReview;
          messageMeta = { pathReviewId: proposal.proposalId };
          pathAgentAction = { type: "create", label: "生成学习路径", targets: proposal.changes.length ? proposal.changes.map(change => ({ stageId: change.stageId, stepId: change.stepId })) : ["environment", "channels", "practice", "check"].map(stageId => ({ stageId })) };
          replyText = proposal.changes.length
            ? `我先按你的目标搭出路径初稿，并在 ${proposal.changes.length} 个节点上标出 AI 提议。路径仍在共创中；可以直接在节点决定，也可以继续补充目标，确认之前不会开始学习。`
            : "我先按你的目标搭出路径初稿。你可以直接检查和调整路径节点，也可以继续告诉我已掌握的内容或想增加的主题；路径确认之前不会开始学习。";
        }
      } else if (/确认.*(?:路径|开始|调整)|开始学习/.test(text)) {
        action = () => { if (learning.state.draftPath) learning.actions.confirmPath(); openContent("learning-path"); };
        replyText = learning.state.draftPath ? "已确认学习路径，可以从保留的节点继续。" : "已打开当前路径；若尚未准备草案，先生成或选用路径。";
      } else if (/生成.*路径|准备.*路径|选用.*路径|调整.*路径/.test(text)) {
        const proposal = learning.actions.generatePath(/选用/.test(text) ? "existing" : "goal");
        action = openLearningPathReview;
        if (proposal) messageMeta = { pathReviewId: proposal.proposalId };
        if (proposal) pathAgentAction = { type: "create", label: "生成学习路径", targets: ["environment", "channels", "practice", "check"].map(stageId => ({ stageId })) };
        replyText = "示例路径已放入共创画布。你可以检查各阶段和子步骤、补充学习要求或拖动节点；确认后才进入学习。";
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
      if (sendMessage(event, withPointContext({ replyText, ...(messageMeta ? { messageMeta } : {}) }))) {
        consumePointContext();
        if (pathAgentAction) setLearningAgentAction({ ...pathAgentAction, id: crypto.randomUUID(), taskId: selectedTask });
        action();
      }
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
      const accepted = sendMessage(event, withPointContext({ replyText }));
      if (accepted) {
        consumePointContext();
        if (item && !/之前|上次/.test(text)) restoreContent(item.id);
        else { workspace.actions.setOverview({ category: item?.category || "all", query: "", collapsedGroups: [], compactIds: workspace.state.overview.compactIds.filter(id => id !== item?.id), historyId: item?.id || null }); openCanvas(); }
      }
      return;
    }
    const intent = isInteractiveTask ? classifyTaskIntent(text) : "none";
    const requestedFocus = getExplanationFocus(text, isImageTask);
    const focus = requestedFocus === "structure" ? "total" : requestedFocus;
    const keepsPointFocus = Boolean(pointContext);
    const target = intent === "check"
      ? isMainTask && /误差|精度|容差|precision|tolerance/i.test(text) ? "precision"
        : /实际(?:代码|循环|模型)|真实(?:代码|项目|模型)|模型签名|原文件|源码/i.test(text) ? (isImageTask ? "image-source" : "source") : null
      : null;
    const accepted = sendMessage(event, withPointContext(intent === "none" ? {} : {
      interaction: { intent, focus, target }, replyText: taskIntentReply(intent, focus, target),
    }));
    if (accepted) consumePointContext();
    if (accepted && isInteractiveTask && !keepsPointFocus) dispatchTaskIntent(intent, focus, target);
  };
  const confirmWorkspaceRoute = () => {
    if (selectedRoute === "retry") wb.confirmRoute();
    else changeActionView(selectedRoute === "tail" ? "code" : "precision");
  };
  const latestAttempt = flow.state.attempts.find(attempt => attempt.id === flow.state.selectedAttemptId) || flow.state.attempts.at(-1);
  const renderBrief = (ownerId) => <div className="diagnostic-scroll">
    <section className="task-brief-section"><div className="section-title"><IconFileText size={ICON_SIZE.heading} /><h3>任务简报</h3></div><div className="task-brief-card"><strong>{displayTaskName(ownerId)}</strong><p>{wb.getTask(ownerId).goal}</p><span>待补充证据</span></div></section>
    <section className="task-brief-section"><div className="section-title"><IconDatabase size={ICON_SIZE.heading} /><h3>上下文与材料</h3></div><div className="task-brief-card"><p>补充代码、日志与运行条件后，再确定检查方向。</p><button type="button" className="light-button" onClick={() => openDialog("code")}><IconCode size={ICON_SIZE.control} />补充代码片段</button><button type="button" className="light-button" onClick={() => { setDraft("请帮我整理当前任务的环境条件、需要补充的证据和下一步检查清单。"); wb.draftRef.current?.focus(); }}><IconMessageCircle size={ICON_SIZE.control} />整理检查清单</button></div></section>
    <p className="action-footnote">任务内容仅用于本地交互演示，尚未接入 AI 或硬件服务。</p>
  </div>;
  const archiveLearning = () => { openContent("learning-summary", { restore: true }); workspace.actions.setCollapsed(true); };
  const renderLogDiagnosticWorkspace = () => <LogTriageWorkspace key={logTriageResetVersion} state={logTriageState} onStateChange={setLogTriageState} communityReady={Boolean(communityInviteMessage)} onCommunityExperienceReady={completeLogDiagnostic} />;
  const enterLearningDevelopment = () => { const saved = learning.currentSummary; wb.addExchange("把学过的方法用于图像推理。", "学习记录保留在原任务；接下来核对开发任务的真实输入约定，继续修改审阅与项目验证。"); if (saved) wb.addExchange("带入已保存的学习记录，继续图像推理开发。", { text: `学习参考：${saved.profile.goal}\n\n示例已核对 NCHW [${saved.dimensions.join(",")}]；真实模型签名、预处理及推理仍需在本任务验证。`, learningReference: { taskId: selectedTask, summaryId: saved.id } }, IMAGE_TASK); selectExistingTask(IMAGE_TASK); };
  const renderMaterial = (id, presentation = "canvas", ownerId = MAIN_TASK) => {
    if (wb.getTask(ownerId).kind === "official-learning") {
      if (ownerId !== selectedTask) return null;
      if (id.startsWith("record:")) {
        const record = wb.getSession(ownerId).records.find(item => `record:${item.id}` === id);
        return record ? <article className="content-snapshot"><header><strong>{record.title}</strong><small>{record.time} · 学习记录</small></header><p>{record.summary}</p><p>资料与检查的本地快照；设备推理仍需在对应环境验证。</p></article> : null;
      }
      const selectedNode = getOfficialLearningNode(id);
      const node = selectedNode?.kind === "course" ? selectedNode.children[0] : selectedNode;
      const sourceKey = node ? `learning-node:${ownerId}:${node.id}` : "";
      return node ? <OfficialLearningMaterial node={node} journey={officialLearning} pocketSaved={knowledgePocket.items.some(item => item.sourceKey === sourceKey)} onSaveToPocket={() => saveToKnowledgePocket({ sourceKey, title: node.title, summary: node.summary, content: `${node.title}\n\n${node.summary}`, sourceLabel: wb.getTask(ownerId).name, sourceType: "当前学习节点", taskId: ownerId })} onAsk={askExplanation} onCopy={wb.copyText} onReturnToCanvas={() => { officialCanvasView.actions.requestFocus(officialCanvasView.state.pendingFocusId || `${node.id}:diagram`); openCanvas({ mode: "free", focusId: node.id }); }} /> : null;
    }
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
      const learningNodeTitles = { "learning-goal": "学习目标与已有基础", "learning-path": "图像预处理学习路径", "learning-lesson": "RGB、HWC 与 CHW：图像维度怎么排", "learning-practice": "把 HWC 转成 NCHW", "learning-check": "核对模型输入形状", "learning-summary": "图像预处理学习记录" };
      const sourceKey = `learning-node:${ownerId}:${id}`;
      const nodeTitle = learningNodeTitles[id] || "学习内容";
      const nodeSummary = id === "learning-practice"
        ? `当前 transpose(${learning.state.axes.join(",")}) · batch ${learning.state.batch ? "已增加" : "未增加"}。示例检查目标 NCHW [1, 3, 224, 224]。`
        : id === "learning-check"
          ? `当前示例输出为 ${learning.shape.valid ? `[${learning.shape.dimensions.join(", ")}]` : "轴顺序无效"}；输入签名仍需在真实模型中核对。`
          : `${learning.state.profile.goal || "图像输入预处理"} · ${learning.state.profile.background || "RGB、HWC / CHW 与 batch"}`;
      return <LearningJourneyMaterial id={id} journey={learning} pocketSaved={knowledgePocket.items.some(item => item.sourceKey === sourceKey)} onSaveToPocket={() => saveToKnowledgePocket({ sourceKey, title: nodeTitle, summary: nodeSummary, content: `${nodeTitle}\n\n${nodeSummary}`, sourceLabel: wb.getTask(ownerId).name, sourceType: "当前学习节点", taskId: ownerId })} onOpen={openContent} onAsk={askExplanation} onCopy={wb.copyText} presentation={presentation} onArchive={archiveLearning} onEnterDevelopment={enterLearningDevelopment} onTaskComplete={offerCommunityExperience} />;
    }
    if (id === "task-brief") return renderBrief(ownerId);
    if (id.startsWith("attempt:")) {
      const attempt = (ownerId === IMAGE_TASK ? inference.state.attempts : flow.state.attempts).find(item => `attempt:${item.id}` === id);
      if (!attempt) return <p className="cm-note">这份尝试记录暂不可用。</p>;
      const image = ownerId === IMAGE_TASK;
      if (presentation === "canvas") return <article className="content-snapshot cm-card-preview cm-history-preview"><header><strong>{image ? "形状尝试" : "范围尝试"}</strong><small>{attempt.time} · 只读历史</small></header>
        <p className="cm-body-copy">{image ? `当时的输出 [${attempt.dimensions.join(",")}]，${attempt.passed ? "符合" : "不符合"}示例形状约定。` : attempt.result}</p>
        {image ? <TensorDiagram inference={inference} snapshot={attempt.snapshot} compact /> : <RangeDiagram snapshot={attempt.snapshot} compact active={false} title="当时的范围参数" />}
        <p className="cm-note">当时输入 [{image ? attempt.dimensions?.join(",") || "—" : `${attempt.rows ?? attempt.snapshot?.rows ?? "—"},${attempt.columns ?? attempt.snapshot?.columns ?? "—"}`}] · 展开节点查看代码与完整依据；查看不会重新执行。</p>
      </article>;
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
      if (presentation === "canvas") return <article className="content-snapshot cm-card-preview cm-history-preview"><header><strong>{saved.title}</strong><small>{saved.time} · 只读快照</small></header><p className="cm-body-copy">{saved.summary}</p>
        {data.attempt?.snapshot && <RangeDiagram snapshot={data.attempt.snapshot} compact active={false} title="当时的范围参数" />}
        {data.snapshot?.axes && <TensorDiagram inference={inference} snapshot={data.snapshot} compact />}
        {Array.isArray(data.checks) && <dl className="cm-preview-metrics">{data.checks.slice(0, 3).map((check, index) => <div key={index}><dt>{check.label}</dt><dd>{check.passed ? "示例范围内" : `范围外 ${check.outOfRange} 个`}</dd></div>)}</dl>}
        {Array.isArray(data.rows) && <p className="cm-note">{data.rows.length} 项误差数据 · {data.failed} 项超差 · atol {data.atol} · rtol {data.rtol}</p>}
        <p className="cm-note">展开节点可查看当时的代码和完整证据；重新打开不会运行。</p>
      </article>;
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
    if (ownerId === LOG_DIAGNOSTIC_TASK) return ownerId === selectedTask && id === "log-diagnosis" ? renderLogDiagnosticWorkspace() : null;
    if (ownerId !== MAIN_TASK) return null;
    if (id.startsWith("record:")) {
      const record = mainSession.records.find(item => "record:" + item.id === id);
      return record ? <article className="canvas-record-detail cm-card-preview"><span>{record.time} · {record.isDemo ? "浏览器示例记录" : "开发者记录 · 待验证"}</span><p>{record.summary}</p><small>完整记录可从节点右上角放大查看。</small></article> : null;
    }
    if (id === "reference") return presentation === "canvas" ? <div className="cm-stack"><p className="cm-body-copy">Ascend C 官方文档</p><p className="cm-note">用于理解概念与使用范围，实际版本与根因仍需核对。</p><button className="cm-button" type="button" onClick={() => openContent("reference")}>打开参考网页<IconArrowRight size={ICON_SIZE.inline} /></button></div> : <ReferenceBrowser resetVersion={flow.state.resetVersion} />;
    if (presentation === "canvas" && (id === "precision" || id === "review")) return <div className="cm-stack"><p className="cm-body-copy">{id === "precision" ? "逐元素误差与容差依据" : "检查清单、观察与待补证据"}</p><p className="cm-note">{precisionContext ? `已保留 ${precisionContext.count ?? precisionContext.rows?.length ?? "本次"} 项误差核对依据。` : "尚未保存误差计算。真实项目根因待确认。"}</p><button className="cm-button" type="button" onClick={() => openContent(id)}>展开核对<IconArrowRight size={ICON_SIZE.inline} /></button></div>;
    if (id === "precision" || id === "review") return <ActionWorkspace key={flow.state.resetVersion} storageKey={`action-${MAIN_TASK}-${id}-${flow.state.resetVersion}`} embedded view={id} onChangeView={changeActionView} onBack={() => openContent("evidence")} onRecord={(record) => wb.addRecord(record, MAIN_TASK)} precisionContext={precisionContext} onPrecisionContext={setPrecisionContext} rangeContext={latestAttempt ? { total: latestAttempt.total, tile: latestAttempt.tileSize } : null} onTaskComplete={id === "precision" ? confirmAddCustomResolution : undefined} completionAlreadyOffered={mainSession.messages.some(message => message.communityInvite?.summary?.kind === "addcustom-precision-resolution")} />;
    return <CanvasMaterial key={flow.state.resetVersion} id={id} presentation={presentation} flow={{ ...flow, codeAttachment: mainAttachment }} onShowCard={openContent} onAttachCode={() => openDialog("code")} explanation={explanation} onAsk={askExplanation} onCompare={compareExplanation} proactive={proactive} diagramRef={presentation === "content" ? diagnosisTargetRef : undefined}
      onCommunityExperienceReady={ownerId === MAIN_TASK && id === "evidence" ? completeAddCustomDiagramAction : undefined}
      communityReady={ownerId === MAIN_TASK && Boolean(mainSession.communityInviteReady)} />;
  };
  const availableMaterials = isLogDiagnosticTask ? [getMaterialMeta("log-diagnosis")] : isMainTask ? [
    ...Object.values(MATERIAL_DEFINITIONS).filter(item => item.id !== "canvas" && item.id !== "task-brief" && !item.id.startsWith("image-") && !item.id.startsWith("learning-")).map(item => ({
      ...item,
      available: item.id === "attempts" || item.id === "diff" ? flow.state.attempts.length > 0 : item.id === "validation" ? Boolean(flow.state.appliedCode) : true,
      disabledReason: item.id === "validation" ? "应用示例修改后可用" : "运行一次范围算例后可用",
    })),
    ...mainSession.records.map(record => ({ ...getMaterialMeta("record:" + record.id, { title: record.title }), description: record.time + " · " + (record.isDemo ? "示例记录" : "待验证") })),
  ] : isOfficialLearningTask ? OFFICIAL_LEARNING_MATERIALS.map(item => ({ ...item, available: true, statusLabel: officialStatusLabel(getOfficialLearningStatus(item.id, officialLearning.state.statuses)), disabledReason: "来自昇腾开发者成长路径的学习材料" })) : isStandardLearningTask ? LEARNING_MATERIALS.map(item => ({ ...item, available: ["learning-goal", "learning-path"].includes(item.id) || (item.id === "learning-summary" ? learning.state.summaries.length > 0 : Boolean(learning.state.path)), disabledReason: item.id === "learning-summary" ? "完成输入检查并保存后可用" : "确认学习路径后可用" })) : isImageTask ? [...IMAGE_MATERIALS.map(item => ({ ...item, available: item.id === "image-attempts" || item.id === "image-diff" ? inference.state.attempts.length > 0 : item.id === "image-validation" ? Boolean(inference.state.applied) : true, disabledReason: "完成示例尝试后可用" })), ...imageSession.records.map(record => getMaterialMeta("record:" + record.id, { title: record.title }))] : [MATERIAL_DEFINITIONS["task-brief"]];
  const getTaskItems = (ownerId) => {
    const ownerKind = wb.getTask(ownerId).kind;
    if (ownerKind === "learning") return ownerId === selectedTask ? normalizeCanvasNodes(buildLearningContentItems({ journey: learning, workspaceState: workspace.getTaskState(ownerId), records: wb.getSession(ownerId).records }), "learning") : [];
    if (ownerKind === "official-learning") return ownerId === selectedTask ? normalizeCanvasNodes(buildOfficialLearningContentItems({ state: officialLearning.state, workspaceState: workspace.getTaskState(ownerId), records: wb.getSession(ownerId).records }), "resnet50") : [];
    if (ownerId === LOG_DIAGNOSTIC_TASK) {
      const stateLabel = logTriageState.diagramInteracted ? "已操作图解" : "待操作";
      return [{ ...MATERIAL_DEFINITIONS["log-diagnosis"], statusLabel: stateLabel, category: "explain", groupId: "content", available: true, relations: [], provenance: [], summary: "交互式 Format Lab 布局图解；操作后可在对话中生成社区经验草稿。" }];
    }
    if (![MAIN_TASK, IMAGE_TASK].includes(ownerId)) return [];
    const ownerImage = ownerId === IMAGE_TASK;
    const ownerMain = ownerId === MAIN_TASK;
    const ownerState = workspace.getTaskState(ownerId);
    const items = buildTaskContentItems({
      taskId: ownerId, visited: ownerState.visitedTabs,
      materials: ownerImage ? IMAGE_MATERIALS : Object.values(MATERIAL_DEFINITIONS),
      flowState: ownerMain ? flow.state : {}, inferenceState: ownerImage ? inference.state : {},
      records: [...wb.getSession(ownerId).records, ...ownerState.snapshots],
      precisionContext: ownerMain ? precisionContext : null,
      canvasCards: ownerImage ? imageCanvas.state.cards : ownerMain ? canvas.state.cards : [],
    }).map(item => ({ ...item, ...ownerState.overview.itemOverrides?.[item.id], lastAccessAt: ownerState.visitedTabs.find(tab => tab.id === item.id)?.lastAccessAt || 0 }));
    return normalizeCanvasNodes(items, ownerImage ? "image-inference" : "addcustom");
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
  const saveLearningSummary = () => {
    const summary = learning.actions.complete();
    if (!summary) {
      wb.notify("当前学习状态还不满足保存条件，请先完成理解、跟练与输入检查。");
      return null;
    }
    return summary;
  };
  const runRecommendationAction = item => {
    const { action = {} } = item;
    if (action.type === "task-create") {
      const existingGroup = wb.groups.find(group => group.tasks.includes(action.name));
      if (existingGroup) { wb.selectTask(action.name); setMainView("task"); setProjectPanelOpen(false); return; }
      const created = wb.createTask({ name: action.name, groupId: action.groupId, goal: action.goal, kind: action.kind });
      if (!created) wb.notify("演示任务没有创建成功，请从任务列表选择已有任务。");
      setMainView("task");
      setProjectPanelOpen(false);
      return;
    }
    if (action.type === "learning-path") {
      if (action.preparePath && !learning.actions.generatePath("home-recommendation")) return;
      openContent(action.materialId || "learning-path", { restore: true, ...(action.anchor ? { anchor: action.anchor } : {}) });
      return;
    }
    if (action.type === "learning-summary") {
      if (!saveLearningSummary()) return;
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
    setMainView("task");
    setProjectPanelOpen(false);
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
      setMainView("task");
      setProjectPanelOpen(false);
      requestAnimationFrame(() => wb.draftRef.current?.focus());
    }
  };
  const renderContentCanvas = (visible, ownerId) => {
    if (ownerId === LOG_DIAGNOSTIC_TASK) return ownerId === selectedTask ? renderLogDiagnosticWorkspace() : null;
    const ownerLearning = wb.getTask(ownerId).kind === "learning";
    const ownerOfficialLearning = wb.getTask(ownerId).kind === "official-learning";
    if ((ownerLearning || ownerOfficialLearning) && ownerId !== selectedTask) return null;
    if (![MAIN_TASK, IMAGE_TASK].includes(ownerId) && !ownerLearning && !ownerOfficialLearning) return null;
    const ownerImage = ownerId === IMAGE_TASK;
    const ownerMain = ownerId === MAIN_TASK;
    const ownerState = workspace.getTaskState(ownerId);
    const free = ownerState.canvasMode === "free";
    const ownerItems = getTaskItems(ownerId);
    const focusedId = ownerMain ? ownerState.overview.focusId || ownerState.lastContentId || "explanation" : null;
    const addCustomCanvas = ownerMain && ["focus", "overview"].includes(ownerState.canvasMode);
    const addCustomDetail = ownerMain && ownerState.canvasMode === "detail";
    const focusedMaterial = ownerItems.flatMap(item => [item, ...(item.children || [])]).find(item => item.id === focusedId);
    const focusRelatedIds = new Set((focusedMaterial?.relations || []).map(relation => relation.id));
    const allOwnerItems = ownerItems.flatMap(item => [item, ...(item.children || [])]);
    const ownerConnections = withMaterialCanvasConnections(allOwnerItems);
    const focusIds = ownerMain ? [focusedId, ...focusRelatedIds].filter((id, index, all) => all.indexOf(id) === index) : [];
    const relatedItems = ownerMain ? (focusedMaterial?.relations || []).map(relation => {
      const target = allOwnerItems.find(item => item.id === relation.id);
      return target ? { id: target.id, title: target.title, relationLabel: relation.label, status: target.state?.label || target.statusLabel } : null;
    }).filter(Boolean) : [];
    const showOverview = visible && !free && !ownerMain;
    if (ownerLearning && free) return <LearningHierarchyCanvas journey={learning} view={learningCanvasView} canvasContent={learningCanvas} visible={visible} agentAction={ownerId === selectedTask ? learningAgentAction : null} onAgentActionComplete={id => setLearningAgentAction(current => current?.id === id ? null : current)} onOpen={openContent} onAsk={askExplanation} onCopy={wb.copyText} onArchive={archiveLearning} onEnterDevelopment={enterLearningDevelopment} />;
    if (ownerOfficialLearning && free) return <OfficialLearningPathCanvas journey={officialLearning} view={officialCanvasView} canvasContent={learningCanvas} visible={visible} onAsk={askExplanation} onCopy={wb.copyText} onOpenContent={openOfficialLearningContent} onOpenPreprocessing={() => selectExistingTask(LEARNING_TASK)} />;
    const ownerCanvas = ownerLearning || ownerOfficialLearning ? learningCanvas : ownerImage ? imageCanvas : canvas;
    return <div className="tw-content-canvas">
      <div className="tw-canvas-body">
        <TaskContentOverview taskId={ownerId} visible={showOverview} items={ownerItems} categories={CONTENT_CATEGORIES} groups={getContentGroups(ownerId, ownerLearning || ownerOfficialLearning).map(group => ({ ...group, title: ownerState.overview.groupNames?.[group.id] || group.title }))} viewState={ownerState.overview} selectedId={ownerMain ? focusedId : ownerState.lastContentId} onViewChange={patch => updateOverview(patch, ownerId)} onEditGroup={workspace.actions.editGroup} onEditItem={workspace.actions.editItem} onOpen={id => ownerMain ? openContent(id, { restore: true, viewedInCanvas: true }) : restoreContent(id)} onCompare={compareContent} onArrange={arrangeMaterials}
          renderPreview={id => id === "explanation" ? <RangeDiagram snapshot={flow.state} compact active={false} onFocus={focus => { explanation.actions.focusConcept(focus); restoreContent("explanation"); }} title="当前示例范围" /> : id === "image-explanation" ? <TensorDiagram inference={inference} compact /> : null} />
        {addCustomDetail && <AddCustomTaskCanvas item={focusedMaterial} relatedItems={relatedItems} onOpenRelated={id => openCanvas({ mode: "detail", focusId: id })} onReturnCanvas={() => openCanvas({ mode: "focus", focusId: focusedId })}>{renderMaterial(focusedId, "content", ownerId)}</AddCustomTaskCanvas>}
        <TaskCanvas embedded isAddCustom={ownerMain} enableCardFocus={ownerImage} semanticDomain={ownerMain ? "addcustom" : ownerImage ? "image-inference" : ownerLearning ? "learning" : "resnet50"} nodeSemantics={allOwnerItems} visible={visible && (free || addCustomCanvas)} viewMode={addCustomCanvas ? ownerState.canvasMode : undefined} focusIds={focusIds} fitRequest={ownerState.overview.fitTick || 0} flow={ownerImage || ownerLearning || ownerOfficialLearning ? undefined : flow} canvas={ownerCanvas} comparisonIds={ownerLearning ? ["learning-lesson", "learning-practice"] : ownerOfficialLearning ? [OFFICIAL_LEARNING_MATERIALS[0]?.id, OFFICIAL_LEARNING_MATERIALS.at(-1)?.id] : ownerImage ? ["image-source", "image-practice"] : ["source", "draft"]} onOpenContents={() => ownerImage ? imageCanvas.actions.fitCanvas() : openCanvas("overview", { fit: true })} onOpenContent={id => ownerMain ? openCanvas({ mode: "detail", focusId: id }) : restoreContent(id)} onFocusContent={id => { if (ownerMain) openCanvas({ mode: "focus", focusId: id }); }} onCollapse={(id, collapsed) => workspace.actions.setOverview({ compactIds: collapsed ? [...new Set([...workspace.state.overview.compactIds, id])] : workspace.state.overview.compactIds.filter(item => item !== id) })} onAttachCode={() => openDialog("code")} connections={ownerConnections} renderMaterial={id => renderMaterial(id, "canvas", ownerId)} />
      </div>
    </div>;
  };
  const resetCurrentTask = () => {
    if (isMainTask) { flow.actions.reset(); canvas.actions.reset(); setPrecisionContext(null); }
    if (isImageTask) { inference.actions.reset(); imageCanvas.actions.reset(); }
    if (isLogDiagnosticTask) { setLogTriageState(INITIAL_LOG_TRIAGE_STATE); setLogTriageResetVersion(version => version + 1); }
    if (isStandardLearningTask) { learning.actions.reset(); learningCanvas.actions.reset(); learningCanvasView.actions.reset(); }
    if (isOfficialLearningTask) { officialLearning.actions.reset(); officialCanvasView.actions.reset(); learningCanvas.actions.reset(); }
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

  const offerCommunityExperience = (summary) => {
    if (!summary?.id) return;
    const isAddCustomResolution = summary.kind === "addcustom-precision-resolution";
    const isLogDiagnosticResolution = summary.kind === "addcustom-log-diagnostic-resolution";
    const isLogDiagnosticExploration = summary.kind === "addcustom-log-diagnostic-exploration";
    if (isAddCustomResolution && session.communityInviteReady && session.messages.some(message => message.communityInvite?.summary?.kind === summary.kind)) return;
    if (session.messages.some(message => message.communityInvite?.summaryId === summary.id)) {
      if (isAddCustomResolution && !session.communityInviteReady) wb.patchSession({ communityInviteReady: true });
      return;
    }
    const dimensions = summary.dimensions?.join(", ") || "当前示例形状";
    const completionExchange = isLogDiagnosticExploration ? [] : isLogDiagnosticResolution ? [{
      id: crypto.randomUUID(), role: "user", isDemo: true,
      text: "我在浏览器示例中核对了 17×33 输入、每块 32 个元素的范围，末块有 17 个有效元素，范围外索引为 0。",
    }] : summary.demoFixture && summary.dimensions?.length ? [{
      id: crypto.randomUUID(), role: "user", isDemo: true,
      text: `我在示例副本中调整了图像输入，当前输出形状为 NCHW [${dimensions}]。`,
    }] : [];
    wb.patchSession(old => old.messages.some(message => message.communityInvite?.summaryId === summary.id) ? (isAddCustomResolution ? { communityInviteReady: true } : {}) : ({
      ...(isAddCustomResolution ? { communityInviteReady: true } : {}),
      messages: [...old.messages, ...completionExchange, {
        id: crypto.randomUUID(), role: "assistant", isDemo: true,
        communityInvite: { summaryId: summary.id, summary },
        text: summary.completionText || (isLogDiagnosticExploration
          ? "已记录这次 Format Lab 图解操作。可以把日志现象和布局理解整理成社区经验草稿；真实根因与目标环境验证仍待补充。"
          : isLogDiagnosticResolution
          ? "浏览器范围算例已核对。真实代码、算子精度与 NPU 结果仍待在目标环境验证。"
          : `${summary.demoFixture ? "示例输出形状符合预设" : "示例修改已应用，输入形状核对通过"}：NCHW [${dimensions}]。\n\n这里展示的是浏览器中的示例形状规则，真实模型推理仍需在对应环境验证。`),
      }],
    }));
    window.setTimeout(() => wb.conversationRef.current?.scrollTo({ top: wb.conversationRef.current.scrollHeight, behavior: "smooth" }), 0);
  };
  const confirmAddCustomResolution = (result) => {
    if (selectedTask !== MAIN_TASK || result?.kind !== "addcustom-precision-resolution" || result.isDemo || result.failed !== 0) return;
    offerCommunityExperience({
      id: `addcustom-${result.id}`,
      kind: "addcustom-precision-resolution",
      precision: result.precision,
      completionText: "你已确认 AddCustom 精度异常已在目标环境复测通过。可以把本次修复步骤、适用条件和验证证据整理为社区经验；当前 Demo 不会代替真实设备检查。",
    });
  };
  const completeAddCustomDiagramAction = () => {
    if (selectedTask !== MAIN_TASK || session.communityInviteReady) return;
    offerCommunityExperience({
      id: "demo-addcustom-diagram-resolution",
      kind: "addcustom-precision-resolution",
      demoFixture: true,
      precision: { count: 561, failed: 0, atol: "1e-5", rtol: "1e-4", isDemo: true },
      completionText: "示例修复已完成，当前范围核对通过。可以把这次排查整理为社区经验草稿。",
    });
  };
  const completeLogDiagnostic = (result) => {
    if (selectedTask !== LOG_DIAGNOSTIC_TASK || result?.kind !== "addcustom-log-diagnostic-exploration") return;
    offerCommunityExperience({
      id: result.id || "demo-addcustom-log-diagnostic-exploration",
      kind: result.kind,
      demoFixture: true,
      dimensions: [result.rows || 17, result.columns || 33],
      tileSize: result.tileSize || 32,
      completionText: result.completionText || "已操作浅色 Format Lab 图解。可以把日志现象与布局理解整理为社区经验；真实根因与目标环境验证仍待补充。",
    });
  };
  const generateCommunityExperience = (completion) => {
    if (!completion?.id) return;
    if (session.communityDraft?.completionId === completion.id) {
      wb.patchSession(old => ({ communityDraft: { ...old.communityDraft, open: true } }));
      workspace.actions.setCollapsed(false);
      return;
    }
    const communityDraft = createCommunityDraft({ taskId: selectedTask, task, session, completion });
    wb.patchSession(old => ({
      communityDraft,
      messages: [...old.messages, {
        id: crypto.randomUUID(), role: "assistant", isDemo: true, communityDraftCard: true, communityDraftId: communityDraft.id,
        text: "已根据本次任务对话整理社区经验草稿，可在右侧审阅、编辑并决定是否提交。",
      }],
    }));
    workspace.actions.setCollapsed(false);
    wb.notify("社区经验草稿已生成 · 本地演示");
    window.setTimeout(() => wb.conversationRef.current?.scrollTo({ top: wb.conversationRef.current.scrollHeight, behavior: "smooth" }), 0);
  };
  const openCommunityDraft = () => {
    if (!session.communityDraft?.completionId) return;
    wb.patchSession(old => ({ communityDraft: { ...old.communityDraft, open: true } }));
    workspace.actions.setCollapsed(false);
  };
  const closeCommunityDraft = () => wb.patchSession(old => ({
    communityDraft: { ...old.communityDraft, open: false },
  }));
  const submitCommunityDraft = () => {
    if (!session.communityDraft || session.communityDraft.status === "submitted") return;
    wb.patchSession(old => ({
      communityDraft: { ...old.communityDraft, status: "submitted", submittedAt: Date.now(), open: true },
      messages: [...old.messages, {
        id: crypto.randomUUID(), role: "assistant", isDemo: true, communitySubmission: true,
        text: "社区经验草稿已提交（演示）。当前页面尚未连接真实社区服务。",
      }],
    }));
    wb.notify("演示提交完成；尚未连接真实社区服务");
    window.setTimeout(() => wb.conversationRef.current?.scrollTo({ top: wb.conversationRef.current.scrollHeight, behavior: "smooth" }), 0);
  };
  const navigateMainView = (view) => {
    wb.setMenu(null);
    setMainView(view);
    setProjectPanelOpen(false);
  };
  useEffect(() => {
    if (window.parent === window) return undefined;
    const handlePreviewMessage = event => {
      if (event.source !== window.parent || event.origin !== window.location.origin) return;
      if (event.data?.type !== "ascstudio-mini-demo-view") return;
      navigateMainView(event.data.view === "pocket" ? "knowledge-pocket" : "task");
    };
    window.addEventListener("message", handlePreviewMessage);
    return () => window.removeEventListener("message", handlePreviewMessage);
  }, []);
  const updateKnowledgePocket = updater => {
    const current = readKnowledgePocket();
    const next = typeof updater === "function" ? updater(current) : updater;
    const written = writeKnowledgePocket(next);
    if (!written) {
      wb.notify("知识口袋暂时无法保存，请检查浏览器存储设置");
      return null;
    }
    setKnowledgePocket(written);
    announceKnowledgePocketChange();
    return written;
  };
  const saveToKnowledgePocket = entry => {
    const sourceKey = String(entry.sourceKey || "");
    const current = readKnowledgePocket();
    if (sourceKey && current.items.some(item => item.sourceKey === sourceKey)) {
      wb.notify("这条内容已在知识口袋里");
      return;
    }
    const id = globalThis.crypto?.randomUUID?.() || `pocket-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const saved = updateKnowledgePocket({
      ...current,
      items: [...current.items, { ...entry, id, createdAt: Date.now(), status: "saved", signal: entry.signal || "" }],
    });
    if (saved) wb.notify("已收进知识口袋；可从左侧口袋安排微信送达");
  };
  const schedulePocketItem = item => {
    updateKnowledgePocket(current => ({ ...current, items: current.items.map(entry => entry.id === item.id ? { ...entry, status: "scheduled", scheduledAt: Date.now() } : entry) }));
    if (window.parent !== window) window.parent.postMessage({ type: "ascstudio-pocket-scheduled", itemId: item.id }, window.location.origin);
    wb.notify("已加入每周速览；手机端会优先展示这条内容");
  };
  const sendPocketItemNow = item => {
    const sentAt = Date.now();
    const updated = updateKnowledgePocket(current => ({
      ...current,
      lastNotificationId: item.id,
      items: current.items.map(entry => entry.id === item.id ? { ...entry, status: "sent", sentAt } : entry),
    }));
    if (!updated) return;
    if (window.parent !== window) {
      window.parent.postMessage({ type: "ascstudio-pocket-delivery", itemId: item.id }, window.location.origin);
      wb.notify("已模拟送到右侧手机样机");
      return;
    }
    const miniUrl = new URL("../ascstudio-mini/", window.location.href);
    miniUrl.hash = "wechat";
    window.open(miniUrl.href, "_blank", "noopener,noreferrer");
    wb.notify("已模拟送到微信；新标签页会显示未读服务通知");
  };
  const setPocketSignal = (item, signal) => {
    const nextSignal = item.signal === signal ? "" : signal;
    const updated = updateKnowledgePocket(current => ({ ...current, items: current.items.map(entry => entry.id === item.id ? { ...entry, signal: nextSignal } : entry) }));
    if (updated && nextSignal) wb.notify(nextSignal === "interested" ? "已记录关注，后续速览会参考这一兴趣" : "已记录存疑，后续速览会优先补充这一知识");
    else if (updated) wb.notify("已取消这条学习标记");
  };
  const removePocketItem = id => {
    updateKnowledgePocket(current => ({ ...current, items: current.items.filter(item => item.id !== id), lastNotificationId: current.lastNotificationId === id ? "" : current.lastNotificationId }));
  };
  const toggleProjectNavigation = () => {
    wb.setMenu(null);
    if (mainView === "task" || mainView === "home") setProjectPanelOpen((open) => !open);
    else { setMainView("task"); setProjectPanelOpen(true); }
  };
  const useCapabilityFromPage = (id) => {
    wb.useCapability(id);
    setMainView("task");
    setProjectPanelOpen(false);
    window.setTimeout(() => wb.draftRef.current?.focus(), 0);
  };

  return (
    <main className="app-frame" data-testid="q02-workbench">
      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-logo" src={`${import.meta.env.BASE_URL}assets/ascend-logo.svg`} alt="Ascend" />
          <span className="brand-studio">Studio</span>
        </div>
        <div className="topbar-divider" />
        <nav className="breadcrumbs" aria-label="当前位置">
          {showNewTaskHome ? <strong>新建任务</strong> : showLearningDiscovery ? <strong>学习发现</strong> : showAutomations ? <strong>自动化任务</strong> : showCapabilities ? <strong>能力库</strong> : showKnowledgePocket ? <strong>知识口袋</strong> : <>
          <span className="breadcrumb-project">{currentGroup?.name}</span><IconChevronRight className="breadcrumb-project" size={ICON_SIZE.inline} /><button className="task-title-button" type="button" title={displayTaskName(selectedTask)} aria-label="当前任务与对话操作" data-menu-trigger aria-expanded={wb.menu?.name === "chat"} onClick={event => openMenu("chat", event)}><strong>{displayTaskName(selectedTask)}</strong><IconChevronDown size={ICON_SIZE.inline} /></button>
          </>}
        </nav>
        {showTaskWorkspace && session.unreadReply && <button className="light-button new-reply-button" type="button" onClick={wb.showLatestReply}><IconChevronDown size={ICON_SIZE.inline} />有新回复</button>}
        <div className="topbar-spacer" />
        {showTaskWorkspace && <div className="conversation-layout-switch" role="group" aria-label="对话区域布局" title={areaInteractionActive ? "完成或取消区域输入后可切换对话布局" : "切换对话区域布局"}>
          <button type="button" aria-label="对话显示在左侧" title="左侧对话" aria-pressed={conversationLayout === "sidebar"} disabled={areaInteractionActive} onClick={() => setConversationLayout("sidebar")}>
            <IconLayoutSidebar size={ICON_SIZE.heading} aria-hidden="true" />
          </button>
          <button type="button" aria-label="对话显示为底部浮窗" title="底部浮窗" aria-pressed={conversationLayout === "floating"} disabled={areaInteractionActive} onClick={() => setConversationLayout("floating")}>
            <IconLayoutBottombar size={ICON_SIZE.heading} aria-hidden="true" />
          </button>
        </div>}
        {showTaskWorkspace && !saveAvailable && <span className="save-unavailable" role="status">暂未保存</span>}
        {showTaskWorkspace && workspace.state.collapsed && <button className="light-button reopen-content" type="button" onClick={() => workspace.actions.setCollapsed(false)}>打开内容{workspace.state.visitedTabs.some(item => item.unread) && <span className="reopen-update-count">{workspace.state.visitedTabs.filter(item => item.unread).length} 项更新</span>}</button>}
        {showTaskWorkspace && <span className={`proposal-badge${isPathGenerationTask && learning.state.draftPath ? " proposal-badge--learning-edit" : ""}`}><span className="proposal-dot" />{isPathGenerationTask ? learning.state.draftPath ? "学习路径 · 编辑中" : learning.state.path ? "学习路径 · 已确认" : "学习路径 · 待生成" : "设计提案 · 待开发者确认"}</span>}
        <button className="icon-button top-icon" type="button" aria-label="通知" data-menu-trigger aria-expanded={wb.menu?.name === "notifications"} onClick={(event) => openMenu("notifications", event)}><IconBell size={ICON_SIZE.heading} />{wb.notifications.length > 0 && <span className="notification-dot" />}</button>
        <button className="profile-button" type="button" aria-label="用户菜单" data-menu-trigger aria-expanded={wb.menu?.name === "profile"} onClick={(event) => openMenu("profile", event)}>D</button>
      </header>

      <div className={"workspace-grid " + (showTaskWorkspace ? "is-task-workspace" : "is-standalone-view") + (showNewTaskHome ? " is-new-task-home" : "") + (showLearningDiscovery ? " is-learning-discovery" : "") + (showAutomations ? " is-automations-view" : "") + (showCapabilities ? " is-capabilities-view" : "") + (showKnowledgePocket ? " is-knowledge-pocket-view" : "") + (projectPanelOpen ? " is-project-panel-open" : "") + (layout.dragging ? " is-resizing" : "") + (showTaskWorkspace && workspace.state.collapsed ? " is-content-collapsed" : "") + (showTaskWorkspace && conversationLayout === "floating" ? " is-conversation-floating" : "") + (showTaskWorkspace && conversationLayout === "floating" && floatingConversationExpanded ? " is-conversation-expanded" : "") + (showTaskWorkspace && isLogDiagnosticTask && !workspace.state.collapsed ? " is-log-diagnostic-workspace-open" : "") + (showTaskWorkspace && isLogDiagnosticTask && !workspace.state.collapsed ? " is-log-format-lab-focused" : "") + (showTaskWorkspace && areaInteractionActive ? " is-area-interaction-active" : "") + (conversationDragging ? " is-conversation-dragging" : "") + (conversationDockPreview ? " has-conversation-dock-preview" : "") + (conversationFloatPreview ? " has-conversation-float-preview" : "")} ref={layout.workspaceRef} style={showTaskWorkspace ? layout.style : layout.standaloneStyle}>
        <aside className="icon-rail" aria-label="主导航">
          <div className="icon-rail-nav">
            <button className={"icon-rail-button" + ((showTaskWorkspace || showNewTaskHome) ? " is-current" : "")} type="button" aria-label="项目与任务" title={projectPanelOpen ? "收起项目与任务" : "项目与任务"} aria-current={(showTaskWorkspace || showNewTaskHome) ? "page" : undefined} aria-expanded={projectPanelOpen} aria-controls="project-sidebar" onClick={toggleProjectNavigation}><IconFolder size={ICON_SIZE.navigation} /></button>
            <button className={"icon-rail-button" + (showLearningDiscovery ? " is-current" : "")} type="button" aria-label="学习发现" title="学习发现" aria-current={showLearningDiscovery ? "page" : undefined} onClick={() => navigateMainView("learning")}><IconSparkles size={ICON_SIZE.navigation} /></button>
            <button className={"icon-rail-button" + (showAutomations ? " is-current" : "")} type="button" aria-label="自动化任务" title="自动化任务" aria-current={showAutomations ? "page" : undefined} onClick={() => navigateMainView("automations")}><IconSettingsAutomation size={ICON_SIZE.navigation} /></button>
            <button className={"icon-rail-button" + (showCapabilities ? " is-current" : "")} type="button" aria-label="能力库" title="能力库" aria-current={showCapabilities ? "page" : undefined} onClick={() => navigateMainView("capabilities")}><IconBooks size={ICON_SIZE.navigation} /></button>
            <button className={"icon-rail-button" + (showKnowledgePocket ? " is-current" : "")} type="button" aria-label="知识口袋" title="知识口袋" aria-current={showKnowledgePocket ? "page" : undefined} onClick={() => navigateMainView("knowledge-pocket")}><IconBookmark size={ICON_SIZE.navigation} /></button>
          </div>
        </aside>
        <aside id="project-sidebar" className="sidebar" aria-label="项目与任务" hidden={!projectPanelOpen}>
          <div className="primary-nav">
            <button className="new-task-button" type="button" onClick={() => { wb.setMenu(null); setMainView("home"); }}>
              <IconPlus size={ICON_SIZE.heading} /><span>新建任务</span>
            </button>
          </div>

          <div className="project-list-header">
            <h1>项目</h1>
            <button className="icon-button compact-icon" type="button" aria-label="项目筛选" data-menu-trigger aria-expanded={wb.menu?.name === "filter"} onClick={(event) => openMenu("filter", event)}>
              <IconAdjustmentsHorizontal size={ICON_SIZE.heading} />
            </button>
          </div>
          <label className="search-box">
            <IconSearch size={ICON_SIZE.control} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目或任务" aria-label="搜索项目或任务" />
            {query && <button type="button" className="clear-search" aria-label="清空搜索" onClick={() => setQuery("")}><IconX size={ICON_SIZE.inline} /></button>}
          </label>
          <div className="project-scroll">
            {visibleGroups.map((group) => (
              <ProjectSection
                key={group.id}
                group={group}
                opened={openedGroups.includes(group.id) || Boolean(query)}
                query={query}
                selectedTask={showNewTaskHome ? null : selectedTask}
                onToggle={() => toggleGroup(group.id)}
                onSelect={selectExistingTask}
                statusForTask={statusForTask}
              />
            ))}
            {query && !visibleGroups.some((group) =>
              group.name.toLowerCase().includes(query.toLowerCase()) ||
              group.tasks.some((task) => task.toLowerCase().includes(query.toLowerCase())
            )) && (
              <div className="empty-search">没有匹配的项目或任务</div>
            )}
          </div>
          <div className="sidebar-footer"><IconLock size={ICON_SIZE.inline} /><span>当前任务与项目上下文关联</span></div>
        </aside>
        {projectPanelOpen && <div className="workspace-divider workspace-divider--projects" role="separator" tabIndex={0} aria-label="调整项目栏宽度" title="拖动调整项目栏宽度；双击恢复默认布局" {...layout.separatorProps("projects")} />}

        {showNewTaskHome ? <NewTaskHome currentTaskName={selectedTask} tasks={recommendationTasks} onRecommendationAction={selectRecommendationAction} onRecommendationChat={chatAboutRecommendation} onCreateTask={({ goal, kind, attachments, groupId: requestedGroupId }) => {
          const groupId = wb.groups.some((group) => group.id === requestedGroupId) ? requestedGroupId : kind === "learning" ? "inference" : (currentGroup?.id || "operator");
          const created = wb.createTask({ name: goal.slice(0, 60), groupId, goal, kind, attachments });
          if (created) { setMainView("task"); setProjectPanelOpen(false); }
          return created;
        }} /> : showLearningDiscovery ? <LearningDiscoveryPage onOpenItem={openDiscoveryItem} /> : showKnowledgePocket ? <KnowledgePocketPage items={knowledgePocket.items} selectedId={selectedPocketId} onSelect={setSelectedPocketId} onSendNow={sendPocketItemNow} onSchedule={schedulePocketItem} onSignal={setPocketSignal} onRemove={removePocketItem} /> : showAutomations ? <section className="management-page" aria-labelledby="automations-page-title">
          <header className="management-page-header"><div className="management-page-title"><span className="management-page-eyebrow">任务协作 · 自动化</span><h1 id="automations-page-title">自动化任务</h1><p>查看自动化状态，安排演示任务，或手动运行一次检查。</p></div><div className="management-page-summary"><strong>{wb.automations.filter(item => item.enabled).length}</strong><span>项已启用</span><i /><strong>{wb.automations.length}</strong><span>项任务</span></div></header>
          <div className="management-page-content"><AutomationList automations={wb.automations} onToggleAutomation={(id) => wb.setAutomations((items) => items.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item))} onRunAutomation={wb.runAutomation} onAddAutomation={(entry) => wb.setAutomations((items) => [...items, { ...entry, id: crypto.randomUUID(), enabled: true, lastRun: "" }])} /></div>
        </section> : showCapabilities ? <section className="management-page" aria-labelledby="capabilities-page-title">
          <header className="management-page-header"><div className="management-page-title"><span className="management-page-eyebrow">任务协作 · 工具与方法</span><h1 id="capabilities-page-title">能力库</h1><p>按类型查找可复用的检查能力，选择后会带入当前任务。</p></div><div className="management-page-summary"><strong>{capabilities.length}</strong><span>项可用能力</span><i /><strong>{new Set(capabilities.map(item => item.category).filter(Boolean)).size}</strong><span>个分类</span></div></header>
          <div className="management-page-content"><CapabilityList capabilities={capabilities} onUseCapability={useCapabilityFromPage} /></div>
        </section> : <section ref={conversationPanelRef} className={`conversation-panel${conversationDragging ? " is-dragging" : ""}${conversationLayout === "floating" && !floatingConversationExpanded ? " is-composer-only" : ""}${conversationLayout === "floating" && floatingConversationExpanded ? " is-conversation-expanded" : ""}`} aria-label="任务对话">
          <div id="task-conversation-history" className="conversation-scroll" ref={wb.conversationRef} onScroll={wb.handleConversationScroll}>
            <div className="conversation-flow">
            {session.showIntro && isMainTask && <>
            <article className="message-row user-message">
              <div className="message-content">
                <div className="message-meta">你</div>
                <div className="user-bubble">为什么 [16,32] 通过，[17,33] 失败？我改过编译参数，还是在 custom_op.cpp:128 报错。</div>
              </div>
            </article>
            <button className="attempt-row" type="button" onClick={() => openDialog("attempts")}>
              <span className="attempt-icon"><IconAdjustmentsHorizontal size={ICON_SIZE.control} /></span>
              <span>已尝试：修改编译参数 · 错误位置未变</span>
              <IconChevronRight className="attempt-chevron" size={ICON_SIZE.control} />
            </button>
            <article className="message-row assistant-message">
              <div className="message-content">
                <div className="message-meta">Ascend Studio</div>
                <div className="assistant-response">
                  <p className="assistant-lead">先检查 <code>custom_op.cpp:128</code> 的尾块读写边界。</p>
                  <p><code>[17,33]</code> 共 561 个元素，块大小为 32 时，最后一块只有 17 个有效元素。</p>
                  <p>将循环上限设为 <code>validCount = min(tileSize, total - baseIndex)</code>，确保读写不超出有效范围，再用 <code>[16,32]</code> 和 <code>[17,33]</code> 复测。</p>
                  {diagnosisCue.collapsed && <>
                    <button className="rationale-button" type="button" aria-expanded={rationaleOpen} onClick={() => setRationaleOpen((value) => !value)}>
                      <IconBook size={ICON_SIZE.control} />{rationaleOpen ? "收起判断依据" : "查看判断依据"}<IconArrowRight className="rationale-arrow" size={ICON_SIZE.control} />
                    </button>
                    {rationaleOpen && <div className="rationale-detail"><p>[16,32] 与 [17,33] 的差异让末尾元素处理值得检查，仍需对照实际循环与误差证据，不能单独证明越界。</p><button type="button" className="task-plain-button" onClick={() => openContent("evidence")}>打开现场与判断<IconArrowRight size={ICON_SIZE.inline} /></button></div>}
                  </>}
                  <ProactiveCue {...diagnosisCue} variant="knowledge" emphasisRef={diagnosisTargetRef}
                    title="为什么 [17,33] 值得检查尾块？"
                    description="元素总数不是 tileSize 的整数倍时，尾块只有部分元素有效；访问时需按剩余数量做边界保护。"
                    onDismiss={() => { diagnosisCue.onDismiss(); setRationaleOpen(false); }}
                    onExpand={() => { diagnosisCue.onExpand(); setRationaleOpen(false); }}
                    primaryLabel={workspace.state.activeId === "explanation" ? "核对实际循环与来源" : "看尾块处理图解"}
                    onPrimary={() => { proactive.settle("diagnosis-tail"); workspace.state.activeId === "explanation" ? changeActionView("code") : dispatchTaskIntent("explain", "tail"); }}
                    secondaryLabel={workspace.state.activeId === "explanation" ? "定位尾块图解" : "对照当前代码"}
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
                    <button className="light-button chat-canvas-action" type="button" onClick={confirmWorkspaceRoute}>{selectedRouteData.id === "retry" ? "保留现场并重新评估" : selectedRouteData.id === "tail" ? "查看索引范围示例" : "打开误差核对"}<IconArrowRight size={ICON_SIZE.inline} /></button>
                  </div></details>
                </div>
                <div className="message-feedback">
                  <button type="button" className="pocket-save-action" aria-label="收进知识口袋" data-tooltip="收进知识口袋" onClick={() => saveToKnowledgePocket({ sourceKey: `agent-intro:${selectedTask}`, title: "排查线索：尾块索引范围", summary: "尾块索引范围值得优先核对；根因尚未确认。还需实际循环、两次运行条件与逐元素误差证据。", content: "尾块索引范围值得优先核对，根因尚未确认。\n\n已知：[16,32] 通过；[17,33] 失败。修改编译参数后，错误位置未变。\n\n还需：实际循环、两次运行条件与逐元素误差证据。", sourceLabel: selectedTask, sourceType: "Agent 回答", taskId: selectedTask, signal: "question" })}><IconBookmark size={ICON_SIZE.control} /></button>
                  <button type="button" aria-label="复制回答" data-tooltip="复制回答" onClick={() => wb.copyText(task.reply)}><IconCopy size={ICON_SIZE.control} /></button>
                  <button type="button" aria-label="赞同" data-tooltip="赞同" aria-pressed={session.feedback === "up"} onClick={() => feedback("up")}><IconThumbUp size={ICON_SIZE.control} /></button>
                  <button type="button" aria-label="不赞同" data-tooltip="不赞同" aria-pressed={session.feedback === "down"} onClick={() => feedback("down")}><IconThumbDown size={ICON_SIZE.control} /></button>
                </div>
              </div>
            </article>
            </>}
            {session.showIntro && !isMainTask && <>
              <article className="message-row user-message">
                <div className="message-content"><div className="message-meta">你</div><div className="user-bubble">{task.question}</div></div>
              </article>
              <article className="message-row assistant-message">
                <div className="message-content">
                  <div className="message-meta">Ascend Studio · 演示</div>
                  <div className="assistant-response">
                    {task.reply.split("\n\n").map((text, index) => <p key={index}>{text}</p>)}
                    {isStandardLearningTask && <div className="task-suggestion-actions"><button className="task-plain-button" type="button" onClick={() => openContent("learning-goal")}>设置学习目标<IconArrowRight size={ICON_SIZE.inline} /></button><button className="task-plain-button" type="button" onClick={() => openContent(learning.state.summaries.length ? "learning-summary" : "learning-path")}>{learning.state.summaries.length ? "回看学习记录" : "查看学习路径"}</button>{isPathGenerationTask && <button className="task-plain-button" type="button" onClick={() => { setDraft(PATH_REFINEMENT_DEMO_PROMPT); wb.draftRef.current?.focus(); }}>填入共创演示需求</button>}</div>}
                    {isOfficialLearningTask && <div className="task-suggestion-actions"><button className="task-plain-button" type="button" onClick={() => openContent("learning-official-stage-chain")}>查看目标学习路径<IconArrowRight size={ICON_SIZE.inline} /></button><button className="task-plain-button" type="button" onClick={() => openContent("learning-official-step-image-classification")}>从图像推理链路开始</button></div>}
                    {isImageTask && <div className="task-suggestion-actions"><button className="task-plain-button" type="button" onClick={() => dispatchTaskIntent("explain", "layout")}>返回关联图解<IconArrowRight size={ICON_SIZE.inline} /></button><button className="task-plain-button" type="button" onClick={() => openContent("image-source")}>查看代码与来源</button></div>}
                  </div>
                  <div className="message-feedback"><button type="button" className="pocket-save-action" aria-label="收进知识口袋" data-tooltip="收进知识口袋" onClick={() => saveToKnowledgePocket({ sourceKey: `agent-intro:${selectedTask}`, title: task.reply.split(/[。\n]/)[0].slice(0, 52) || task.title, summary: task.reply.split("\n\n")[0], content: task.reply, sourceLabel: selectedTask, sourceType: "Agent 回答", taskId: selectedTask })}><IconBookmark size={ICON_SIZE.control} /></button></div>
                </div>
              </article>
            </>}
            {messages.map((message) => (
              <article className={"message-row " + (message.role === "user" ? "user-message" : "assistant-message")} key={message.id}>
                <div className="message-content">
                  <div className="message-meta">{message.role === "user" ? "你" : "Ascend Studio"}{message.isDemo && " · 演示"}{message.model && " · " + message.model}</div>
                  <div className={message.role === "user" ? "user-bubble" : "assistant-response extra-message"}>{message.text.split("\n\n").map((paragraph, i) => <p className="message-paragraph" key={i}>{paragraph}</p>)}
                    {message.attachments?.length > 0 && <div className="message-attachments">{message.attachments.map((file) => <button type="button" key={file.id} onClick={() => openDialog("evidence", { title: file.name, body: "本次任务的本地附件，尚未独立验证。", log: file.content || "已关联文件名称，尚无可读取的文本内容。" })}><IconPaperclip size={ICON_SIZE.inline} />{file.name}</button>)}</div>}
                  </div>
                  {message.scopeReference && <div className="message-source-links"><button type="button" onClick={() => {
                    const reference = message.scopeReference;
                    if (reference.type === "workspace-area") {
                      setPointContext(reference);
                      if (session.communityDraft?.open) closeCommunityDraft();
                      if (reference.contentId === "canvas") openCanvas({ mode: reference.canvasMode || "overview" });
                      else if (reference.contentId !== "empty") openContent(reference.contentId || "explanation", { restore: true });
                    } else {
                      openContent("explanation", { anchor: reference.focus || "tail" });
                      window.setTimeout(() => window.dispatchEvent(new CustomEvent("ascstudio-point-range-restore", { detail: reference })), 0);
                    }
                  }}><IconPointer2 size={ICON_SIZE.micro} /><span>{message.scopeReference.type === "workspace-area" ? `关联工作区区域 · ${message.scopeReference.contentTitle || "内容"} · ${message.scopeReference.label}` : `关联图解范围 · ${message.scopeReference.label}`}</span></button></div>}
                  {message.learningReference && <div className="message-source-links"><button type="button" onClick={() => selectExistingTask(message.learningReference.taskId)}><IconBook size={ICON_SIZE.micro} />返回来源学习任务</button></div>}
                  {message.pathReviewId && isStandardLearningTask && <div className="message-source-links"><button type="button" onClick={openLearningPathReview}><IconSparkles size={ICON_SIZE.micro} />{learning.state.draftPath ? "继续路径共创" : "回看已确认学习路径"}</button></div>}
                  {message.sourceContext && <div className="message-source-links"><button type="button" onClick={() => { if (message.sourceContext.kind === "official-learning") { openContent(message.sourceContext.nodeId); officialLearning.actions.seek(message.sourceContext.time); } else if (message.sourceContext.kind === "learning") { learning.actions.seek(message.sourceContext.time); openContent("learning-lesson", { anchor: message.sourceContext.focus }); } else if (message.sourceContext.kind === "image") { inference.actions.seek(message.sourceContext.time); if (!inference.state.lessonOpen) inference.actions.lesson(); openContent("image-explanation"); } else openContent("explanation", { anchor: message.sourceContext.focus, time: message.sourceContext.time, video: true }); }}><IconPlayerPlay size={ICON_SIZE.micro} /><span>讲解示例 {message.sourceContext.stamp} · 返回片段</span></button>{message.role === "assistant" && <button type="button" onClick={() => { if (message.sourceContext.kind === "official-learning") { openContent(message.sourceContext.nodeId); } else if (message.sourceContext.kind === "learning") { learning.actions.focus(message.sourceContext.focus); openContent("learning-lesson", { anchor: message.sourceContext.focus }); } else if (message.sourceContext.kind === "image") { inference.actions.focus(message.sourceContext.focus); openContent("image-explanation"); } else openContent("explanation", { anchor: message.sourceContext.focus }); }}><IconBook size={ICON_SIZE.micro} />查看关联图解</button>}</div>}
                  {isMainTask && message.role === "assistant" && message.interaction?.intent === "diagnose" ? <ProactiveCue {...proactive.forCue(`diagnose:${message.id}`)}
                    title="沿这次错误补一项判断依据" description="当前材料保持原位。需要理解时，可把这条线索直接带进关联图解。"
                    evidence="基于本次描述；实际循环与运行证据仍待核对"
                    primaryLabel="解释这条线索" onPrimary={() => { proactive.settle(`diagnose:${message.id}`); dispatchTaskIntent("explain", message.interaction.focus); }}
                    secondaryLabel="查看实际代码" onSecondary={() => { proactive.settle(`diagnose:${message.id}`); changeActionView("code"); }} />
                    : message.role === "assistant" && message.interaction && <div className="message-source-links"><button type="button" onClick={() => dispatchTaskIntent("explain", message.interaction.focus)}><IconBook size={ICON_SIZE.inline} />{message.interaction.intent === "diagnose" ? "解释这条线索" : "查看关联图解"}</button></div>}
                  {message.communityDraftCard && message.communityDraftId === session.communityDraft?.id && session.communityDraft?.completionId && <button type="button" className="community-draft-card" onClick={openCommunityDraft} aria-label="打开社区经验草稿审阅">
                    <span className="community-draft-card-icon"><IconFileText size={ICON_SIZE.navigation} /></span>
                    <span className="community-draft-card-copy"><strong>社区经验草稿已生成</strong><small>{isLogDiagnosticTask ? "本地图解交互记录 · 演示" : "AI 根据本次对话整理 · 演示"}</small></span>
                    <span className={`community-draft-card-status${session.communityDraft.status === "submitted" ? " is-submitted" : " is-review"}`}>{session.communityDraft.status === "submitted" ? "已提交 · 演示" : "待你审阅"}</span>
                    <IconChevronRight size={ICON_SIZE.heading} />
                  </button>}
                  {message.role === "assistant" && <div className="message-feedback"><button type="button" className="pocket-save-action" aria-label="收进知识口袋" data-tooltip="收进知识口袋" onClick={() => saveToKnowledgePocket({ sourceKey: `agent-message:${selectedTask}:${message.id}`, title: message.text.split(/\n+/)[0].slice(0, 56) || "Agent 回答", summary: message.text.replace(/\s+/g, " ").slice(0, 220), content: message.text, sourceLabel: selectedTask, sourceType: "Agent 回答", taskId: selectedTask })}><IconBookmark size={ICON_SIZE.control} /></button><button type="button" aria-label="复制这条回答" data-tooltip="复制这条回答" onClick={() => wb.copyText(message.text)}><IconCopy size={ICON_SIZE.control} /></button></div>}
                </div>
              </article>
            ))}
            {session.replying && <div className="replying-indicator" role="status"><span /><span /><span /><small>正在整理演示答复…</small></div>}
            </div>
          </div>
          <div className={`composer-stack${showCommunityInvite ? " composer-stack--community" : ""}`}>
          {showCommunityInvite && <section className="community-success-invite" aria-label="任务完成后的社区经验邀请">
            <span className="community-success-invite-icon"><IconSparkles size={ICON_SIZE.navigation} aria-hidden="true" /></span>
            <div className="community-success-invite-copy">
              <strong>把本次任务整理为社区经验？</strong>
              <p>{isLogDiagnosticTask ? "本地 Format Lab 操作记录整理成可编辑草稿" : "AI 根据当前对话生成草稿，可在右侧审阅"}</p>
            </div>
            <button type="button" className="community-entry-button" onClick={() => generateCommunityExperience(communityInviteMessage.communityInvite.summary)}>
              <IconFileText size={ICON_SIZE.control} />生成草稿
            </button>
          </section>}
          <form className={`composer${showCommunityInvite ? " composer--community" : ""}${conversationDragEdgeHover ? " is-drag-edge-hover" : ""}`} onSubmit={(event) => { if (conversationLayout === "floating" && !session.replying && (draft.trim() || session.attachments.length)) setFloatingConversationExpanded(true); handleSendMessage(event); }} onPointerDown={startConversationDrag} onPointerMove={handleConversationPointerMove} onPointerLeave={() => setConversationDragEdgeHover(false)} onPointerUp={event => finishConversationDrag(event)} onPointerCancel={event => finishConversationDrag(event, true)} onLostPointerCapture={event => finishConversationDrag(event, true)}>
            {conversationLayout === "floating" && <button className="conversation-expand-toggle" type="button" aria-label={floatingConversationExpanded ? "收起对话" : "展开对话"} aria-controls="task-conversation-history" aria-expanded={floatingConversationExpanded} title={floatingConversationExpanded ? "收起对话" : "展开对话"} onClick={() => setFloatingConversationExpanded(current => !current)}>{floatingConversationExpanded ? <IconChevronDown size={ICON_SIZE.inline} aria-hidden="true" /> : <IconChevronUp size={ICON_SIZE.inline} aria-hidden="true" />}</button>}
            {(session.attachments.length > 0 || session.capabilityIds.length > 0 || pointContext) && <div className="composer-context-chips">
              {pointContext && <span className="attachment-chip point-context-chip"><IconPointer2 size={ICON_SIZE.inline} /><span>{pointContext.type === "workspace-area" ? `工作区区域 · ${pointContext.label}` : `图解范围 · ${pointContext.label}`}</span><button type="button" aria-label="移除指向区域上下文" onClick={clearPointContext}><IconX size={ICON_SIZE.micro} /></button></span>}
              {session.attachments.map((file) => <span className="attachment-chip" key={file.id}><IconPaperclip size={ICON_SIZE.inline} /><span title={file.restorationNote || file.name}>{file.name}</span><button type="button" aria-label={"移除附件 " + file.name} onClick={() => wb.patchSession((old) => ({ attachments: old.attachments.filter((item) => item.id !== file.id) }))}><IconX size={ICON_SIZE.micro} /></button></span>)}
              {session.capabilityIds.map((id) => <span className="attachment-chip capability-chip" key={id}><IconBooks size={ICON_SIZE.inline} /><span>{capabilities.find((item) => item.id === id)?.name}</span><button type="button" aria-label="移除能力" onClick={() => wb.patchSession((old) => ({ capabilityIds: old.capabilityIds.filter((item) => item !== id) }))}><IconX size={ICON_SIZE.micro} /></button></span>)}
            </div>}
            <div className="composer-entry">
              <textarea ref={wb.draftRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="继续提问，或描述你想进行的下一步…" aria-label="继续提问" rows={1} />
              <div className="composer-toolbar">
                <div className="composer-tools">
                  <button className="icon-button composer-plus" type="button" aria-label="更多输入方式" data-menu-trigger data-menu-align="left" aria-expanded={wb.menu?.name === "input"} onClick={(event) => openMenu("input", event)}><IconPlus size={ICON_SIZE.heading} /></button>
                </div>
                <div className="composer-submit">
                  <button className="permission-button" type="button" aria-label={`权限设置，当前${permissionModeLabel}`} title={`权限：${permissionModeLabel}（演示）`} data-menu-trigger aria-expanded={wb.menu?.name === "permissions"} onClick={event => openMenu("permissions", event)}><IconShieldCheck size={ICON_SIZE.control} /></button>
                  <button className="model-button" type="button" data-menu-trigger data-menu-align="left" aria-label={`选择模型，当前${wb.model.label}`} aria-expanded={wb.menu?.name === "models"} onClick={event => openMenu("models", event)} title="选择模型"><img className="model-brand-logo" src={MODEL_PROVIDER_LOGOS[wb.selectedModel]} alt="" aria-hidden="true" /><span>{wb.model.label}</span><IconChevronDown className="model-menu-chevron" size={ICON_SIZE.inline} /></button>
                  <span className="composer-voice-slot"><VoiceCaptureButton className="composer-voice" label="语音输入" activeLabel="停止语音输入" onStart={onComposerVoiceStart} onTranscript={onComposerVoiceTranscript} iconOnly /></span>
                  {composerHasPayload && !composerPrimaryVoiceListening ? <button className="send-button" type="submit" aria-label="发送消息" disabled={session.replying}><IconSend size={ICON_SIZE.heading} /></button> : <span className="composer-voice-slot composer-primary-voice-slot"><VoiceCaptureButton className="composer-primary-voice" label="语音输入" activeLabel="停止语音输入" onStart={onComposerVoiceStart} onTranscript={onComposerVoiceTranscript} onListeningChange={setComposerPrimaryVoiceListening} waveform iconOnly /></span>}
                </div>
              </div>
            </div>
          </form>
          </div>
          <input hidden type="file" multiple ref={wb.fileRef} onChange={(event) => wb.readFiles(event, "file")} aria-label="选择文件附件" />
          <input hidden type="file" multiple accept="image/*" ref={wb.imageRef} onChange={(event) => wb.readFiles(event, "image")} aria-label="选择截图附件" />
        </section>}

        {showTaskWorkspace && <div className="workspace-divider workspace-divider--conversation" hidden={workspace.state.collapsed} role="separator" tabIndex={0} aria-label="调整对话与工作区宽度" title="拖动调整对话与工作区宽度；双击恢复默认布局" {...layout.separatorProps("conversation")} />}
        {showTaskWorkspace && <aside className="diagnostic-panel" hidden={workspace.state.collapsed} aria-label="任务工作区">
          {supportsCommunityDraft && session.communityDraft?.open && session.communityDraft?.completionId
            ? <CommunityDraftPanel draft={session.communityDraft} onUpdate={communityDraft => wb.patchSession({ communityDraft })} onClose={closeCommunityDraft} onSubmit={submitCommunityDraft} />
            : <TaskWorkspace taskId={selectedTask} workspace={workspace} contentWidth={layout.contentWidth} onCompare={compareContent} isMainTask={isInteractiveTask} isLearningTask={isLearningTask} canvasMaterialIds={isOfficialLearningTask ? officialCanvasMaterialIds : learningCanvasMaterialIds} materials={availableMaterials} contentItems={contentItems} onOpen={openContent} onClose={closeContent} onOpenCanvas={openCanvas} onArrange={arrangeMaterials} onReturnFocus={isLearningTask ? () => workspace.actions.openCanvas({ mode: "free" }) : workspace.actions.returnFocus} onCollapse={() => workspace.actions.setCollapsed(true)} pointContext={pointContext} onPointContextChange={setPointContext} onAreaInteractionChange={setAreaInteractionActive} onAreaSend={sendAreaMessage} onAreaDismiss={clearPointContext} areaComposerDisabled={session.replying}
              renderContent={(id, ownerId) => renderMaterial(id, "content", ownerId)} renderCanvas={renderContentCanvas}
            />}
        </aside>}
        {showTaskWorkspace && conversationDockPreview && <div className="conversation-dock-preview" aria-hidden="true" />}
        {showTaskWorkspace && conversationFloatPreview && <div className="conversation-float-preview" aria-hidden="true" />}
      </div>
      {wb.menu && <div className={"workbench-menu workbench-menu-" + wb.menu.name} ref={wb.menuRef} style={{ left: wb.menu.left, ...(wb.menu.bottom !== null ? { bottom: wb.menu.bottom } : { top: wb.menu.top }) }}>
        {wb.menu.name === "filter" && <><div className="menu-label">显示项目</div>{[{ id: "all", label: "全部项目" }, { id: "current", label: "当前项目" }].map((item) => <button key={item.id} type="button" className={wb.filterScope === item.id ? "is-active" : ""} onClick={() => closeMenuAnd(() => wb.setFilterScope(item.id))}>{item.label}{wb.filterScope === item.id && <IconCircleCheck size={ICON_SIZE.control} />}</button>)}<div className="menu-divider" /><button type="button" onClick={() => closeMenuAnd(() => wb.setOpenedGroups(wb.groups.map((group) => group.id)))}>展开所有项目</button><button type="button" onClick={() => closeMenuAnd(() => wb.setOpenedGroups([]))}>收起所有项目</button></>}
        {wb.menu.name === "chat" && <><div className="menu-label">当前任务对话</div><button type="button" onClick={() => closeMenuAnd(wb.startConversation)}>新对话<IconPlus size={ICON_SIZE.control} /></button><button type="button" onClick={() => openDialog("history")}>对话历史<span>{session.history.length}</span></button><button type="button" onClick={() => closeMenuAnd(() => wb.copyText(wb.conversationText()))}>复制当前对话<IconCopy size={ICON_SIZE.control} /></button><button type="button" onClick={wb.exportTask}>导出任务记录<IconFileText size={ICON_SIZE.control} /></button><div className="menu-divider" /><button type="button" onClick={resetCurrentTask}>恢复本题初始状态</button></>}
        {wb.menu.name === "input" && <><div className="menu-label">添加输入</div><button type="button" onClick={() => openDialog("code")}>代码片段<IconCode size={ICON_SIZE.control} /></button><button type="button" onClick={() => closeMenuAnd(() => wb.fileRef.current?.click())}>选择本地文件<IconPaperclip size={ICON_SIZE.control} /></button><button type="button" onClick={() => closeMenuAnd(() => wb.imageRef.current?.click())}>选择截图<IconPhoto size={ICON_SIZE.control} /></button><button type="button" onClick={() => closeMenuAnd(() => navigateMainView("capabilities"))}>使用能力库<IconBooks size={ICON_SIZE.control} /></button></>}
        {wb.menu.name === "models" && <><div className="menu-label">选择模型</div>{modelOptions.map(item => <button key={item.id} type="button" className={wb.selectedModel === item.id ? "is-active" : ""} aria-pressed={wb.selectedModel === item.id} onClick={() => closeMenuAnd(() => wb.chooseModel(item.id))}><span className="model-option-main"><img className="model-option-logo" src={MODEL_PROVIDER_LOGOS[item.id]} alt="" aria-hidden="true" /><span>{item.label}</span></span>{wb.selectedModel === item.id && <IconCircleCheck size={ICON_SIZE.control} />}</button>)}</>}
        {wb.menu.name === "permissions" && <><div className="menu-label">当前任务权限 · 演示</div>{PERMISSION_OPTIONS.map(item => <button key={item.id} type="button" className={permissionMode === item.id ? "is-active" : ""} onClick={() => closeMenuAnd(() => setPermissionModes(current => ({ ...current, [selectedTask]: item.id })))}><span>{item.label}</span>{permissionMode === item.id && <IconCircleCheck size={ICON_SIZE.control} />}</button>)}</>}
        {wb.menu.name === "diagnostic" && <><div className="menu-label">判断与核对</div>{isMainTask && <><button type="button" onClick={() => closeMenuAnd(() => openContent("review"))}>生成复核记录<IconFileText size={ICON_SIZE.control} /></button><button type="button" onClick={() => closeMenuAnd(() => setRationaleOpen((value) => !value))}>{rationaleOpen ? "收起判断依据" : "展开判断依据"}<IconBook size={ICON_SIZE.control} /></button></>}<button type="button" onClick={() => openDialog("attempts")}>已尝试的动作<IconAdjustmentsHorizontal size={ICON_SIZE.control} /></button><button type="button" onClick={wb.exportTask}>导出任务记录<IconFileText size={ICON_SIZE.control} /></button></>}
        {wb.menu.name === "notifications" && <><div className="menu-label">任务动态</div>{wb.notifications.length ? wb.notifications.map((entry) => <button className="notification-row" key={entry.id} type="button" onClick={() => selectExistingTask(entry.taskName)}><span><strong>{entry.text}</strong><small>{entry.taskName} · {entry.time}</small></span></button>) : <p className="menu-empty">尚无新动态。完成核对后会在这里留下记录。</p>}</>}
        {wb.menu.name === "profile" && <><div className="menu-profile"><strong>开发者</strong><span>Ascend Studio · 本地设计预览</span></div><div className="menu-label">界面主题</div><div className="theme-options" role="group" aria-label="界面主题">{[{ id: "neutral-gray", label: "中性灰" }, { id: "cool-gray", label: "冷灰" }].map(item => <button key={item.id} type="button" aria-pressed={visualTheme === item.id} className={visualTheme === item.id ? "is-active" : ""} onClick={() => setVisualTheme(item.id)}><span className={`theme-swatch theme-swatch--${item.id}`} aria-hidden="true" />{item.label}{visualTheme === item.id && <IconCircleCheck size={ICON_SIZE.control} />}</button>)}</div><button type="button" onClick={wb.exportTask}>导出当前任务</button><p className="menu-empty">{saveAvailable ? "任务参数、草案、对话与历史自动保存在此浏览器。原始附件需要重新选择。" : "此浏览器暂时无法保存新改动；请先导出当前任务记录。"}</p></>}
      </div>}

      <WorkbenchDialogs dialog={wb.dialog} onClose={wb.closeDialog} groups={wb.groups} taskName={selectedTask} taskGoal={task.goal} onCreateTask={wb.createTask} onAttachCode={wb.attachCode} history={session.history} onRestoreConversation={wb.restoreConversation} modelOptions={modelOptions} selectedModel={wb.selectedModel} onSelectModel={wb.chooseModel} attempts={wb.attempts} onAddAttempt={(entry) => wb.addRecord({ ...entry, kind: "attempt", isDemo: false })} evidenceDetail={wb.dialogData} copyText={wb.dialogData.text || ""} />
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </main>
  );
}

export { App };
