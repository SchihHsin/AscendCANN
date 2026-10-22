import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { initialGroups, taskDetails, capabilities, initialAutomations, modelOptions, buildAssistantReply } from "./prototype-data";
import { readSession, writeSession } from "./session-storage";
import { LEARNING_PATH_GENERATION_TASK, LEARNING_TASK } from "./learning-data";
import { OFFICIAL_LEARNING_TASK } from "./official-learning-data";

export const MAIN_TASK = "AddCustom 精度异常";
export const evidenceDetails = [
  { title: "[16,32] 通过", body: "已知的通过样本。仍需补充输入内容、数据类型和环境版本，才能作完整对照。", log: "input_shape: [16,32]\nprecision_check: PASS\n环境与容差记录：待补充" },
  { title: "[17,33] 失败", body: "已知的失败样本。非整块输入与失败同时出现，仅能作为核查线索。", log: "input_shape: [17,33]\nprecision_check: FAIL\n逐元素误差：待补充" },
  { title: "precision mismatch · custom_op.cpp:128", body: "错误位置标记了检查入口，尚未定位到具体实现原因。", log: "precision mismatch\nlocation: custom_op.cpp:128\n尝试：修改编译参数\n结果：错误位置未变" },
];
const blank = () => ({ showIntro: true, messages: [], draft: "", attachments: [], records: [], capabilityIds: [], history: [], selectedRoute: "tail", feedback: null, replying: false, unreadReply: false });
const uid = () => crypto.randomUUID();
const timeNow = () => new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Shanghai" });
const cleanReply = (text) => text.replace(/\n\n演示答复 · 未调用真实 AI 或硬件。$/, "");

const isObject = value => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const objects = value => Array.isArray(value) ? value.filter(isObject) : [];

function storedAttachment(file) {
  const content = typeof file.content === "string" ? file.content : "";
  const readable = content && !/^(?:blob:|data:)/i.test(content) && content.length <= 262144;
  return {
    id: typeof file.id === "string" ? file.id : uid(),
    name: typeof file.name === "string" ? file.name : "本地附件",
    type: typeof file.type === "string" ? file.type : "file",
    size: Number.isFinite(file.size) ? file.size : 0,
    receivedOrder: Number.isFinite(file.receivedOrder) ? file.receivedOrder : 0,
    content: readable ? content : "",
    ...(!readable ? { restorationNote: file.restorationNote || (content.length > 262144 ? "附件内容过大；仅保留名称，刷新后需重新选择文件。" : "仅保留附件名称；本地文件或图片需重新选择。") } : {}),
  };
}
const storedAttachments = value => objects(value).map(storedAttachment);
const storedMessages = value => objects(value).filter(message => typeof message.text === "string").map(message => ({
  ...message,
  ...(Array.isArray(message.attachments) ? { attachments: storedAttachments(message.attachments) } : {}),
}));
function storedTaskSession(value) {
  const initial = blank();
  const session = isObject(value) ? { ...initial, ...value } : initial;
  return {
    ...session,
    showIntro: typeof session.showIntro === "boolean" ? session.showIntro : true,
    messages: storedMessages(session.messages),
    draft: typeof session.draft === "string" ? session.draft : "",
    attachments: storedAttachments(session.attachments),
    records: objects(session.records),
    capabilityIds: Array.isArray(session.capabilityIds) ? session.capabilityIds.filter(id => typeof id === "string") : [],
    history: objects(session.history).map(entry => ({ ...entry, messages: storedMessages(entry.messages) })),
    selectedRoute: ["tail", "precision", "retry"].includes(session.selectedRoute) ? session.selectedRoute : initial.selectedRoute,
    replying: false,
    unreadReply: Boolean(session.unreadReply),
  };
}
function restoreWorkbench() {
  const saved = readSession("workbench", null);
  const value = isObject(saved) ? saved : {};
  const savedGroups = objects(value.groups).filter(group => typeof group.id === "string" && typeof group.name === "string" && Array.isArray(group.tasks));
  const groups = savedGroups.length
    ? savedGroups.map(group => ({ ...group, tasks: group.tasks.filter(task => typeof task === "string") }))
    : initialGroups.map(group => ({ ...group, tasks: [...group.tasks] }));
  // Add learning examples to existing browsers without replacing saved task lists.
  for (const taskName of [LEARNING_PATH_GENERATION_TASK, LEARNING_TASK, OFFICIAL_LEARNING_TASK]) {
    if (groups.some(group => group.tasks.includes(taskName))) continue;
    const inferenceGroup = groups.find(group => group.id === "inference");
    if (inferenceGroup) inferenceGroup.tasks = [...inferenceGroup.tasks, taskName];
    else groups.push({ id: "inference", name: "模型推理", tasks: [taskName] });
  }
  const taskNames = new Set(groups.flatMap(group => group.tasks));
  const sessions = isObject(value.sessions) ? Object.fromEntries(Object.entries(value.sessions).filter(([name]) => taskNames.has(name)).map(([name, session]) => [name, storedTaskSession(session)])) : {};
  if (!sessions[MAIN_TASK]) sessions[MAIN_TASK] = blank();
  // The path co-creation task is a repeatable demo: restore its starter
  // conversation so a page refresh brings back the initial review scenario.
  sessions[LEARNING_PATH_GENERATION_TASK] = blank();
  const meta = { ...taskDetails, ...(isObject(value.meta) ? Object.fromEntries(Object.entries(value.meta).filter(([, item]) => isObject(item))) : {}) };
  for (const taskName of [LEARNING_PATH_GENERATION_TASK, LEARNING_TASK]) {
    if (meta[taskName]?.kind === "learning") {
      meta[taskName] = {
        ...meta[taskName],
        sidebarStatus: taskDetails[taskName].sidebarStatus,
        sidebarStatusTone: taskDetails[taskName].sidebarStatusTone,
      };
    }
  }
  // Refresh only the built-in scenario brief; saved conversations, records and custom tasks stay intact.
  if (meta[OFFICIAL_LEARNING_TASK]?.kind === "official-learning") meta[OFFICIAL_LEARNING_TASK] = { ...meta[OFFICIAL_LEARNING_TASK], ...taskDetails[OFFICIAL_LEARNING_TASK] };
  if (meta["图像推理调试"]) meta["图像推理调试"] = { ...meta["图像推理调试"], ...taskDetails["图像推理调试"] };
  return {
    groups, meta, sessions,
    query: typeof value.query === "string" ? value.query : "",
    filterScope: ["all", "current"].includes(value.filterScope) ? value.filterScope : "all",
    openedGroups: Array.isArray(value.openedGroups) ? value.openedGroups.filter(id => groups.some(group => group.id === id)) : ["operator", "inference"],
    selectedTask: taskNames.has(value.selectedTask) ? value.selectedTask : MAIN_TASK,
    rationaleOpen: Boolean(value.rationaleOpen),
    selectedModel: modelOptions.some(model => model.id === value.selectedModel) ? value.selectedModel : "general",
    automations: Array.isArray(value.automations) ? objects(value.automations).map(entry => ({ ...entry, running: false })) : initialAutomations,
    notifications: objects(value.notifications).slice(0, 10),
    attachmentOrder: Math.max(0, ...Object.values(sessions).flatMap(session => [...session.attachments, ...session.messages.flatMap(message => message.attachments || []), ...session.history.flatMap(entry => entry.messages.flatMap(message => message.attachments || []))]).map(file => file.receivedOrder || 0)),
  };
}
function restoreConversationScroll() {
  const saved = readSession("conversation-scroll", null);
  const entries = value => Array.isArray(value) ? value.filter(entry => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === "string") : [];
  return { positions: new Map(entries(saved?.positions).filter(([, position]) => Number.isFinite(position) && position >= 0)), following: new Map(entries(saved?.following).filter(([, following]) => typeof following === "boolean")) };
}

export function useWorkbenchState() {
  const restored = useRef(null);
  if (restored.current === null) restored.current = restoreWorkbench();
  const [groups, setGroups] = useState(() => restored.current.groups);
  const [meta, setMeta] = useState(() => restored.current.meta);
  const [query, setQuery] = useState(() => restored.current.query);
  const [filterScope, setFilterScope] = useState(() => restored.current.filterScope);
  const [openedGroups, setOpenedGroups] = useState(() => restored.current.openedGroups);
  const [selectedTask, setSelectedTask] = useState(() => restored.current.selectedTask);
  const [sessions, setSessions] = useState(() => restored.current.sessions);
  const [rationaleOpen, setRationaleOpen] = useState(() => restored.current.rationaleOpen);
  const [actionView, setActionView] = useState(null);
  const [menu, setMenu] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [dialogData, setDialogData] = useState({});
  const [selectedModel, setSelectedModel] = useState(() => restored.current.selectedModel);
  const [retryRequested, setRetryRequested] = useState(false);
  const [automations, setAutomations] = useState(() => restored.current.automations);
  const [notifications, setNotifications] = useState(() => restored.current.notifications);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const replyTimers = useRef(new Map());
  const automationTimers = useRef(new Map());
  const attachmentOrder = useRef(restored.current.attachmentOrder);
  const conversationRef = useRef(null);
  const draftRef = useRef(null);
  const fileRef = useRef(null);
  const imageRef = useRef(null);
  const menuRef = useRef(null);
  const activeConversationTask = useRef(selectedTask);
  activeConversationTask.current = selectedTask;
  const session = sessions[selectedTask] || blank();
  const conversationScrollState = useRef({ task: selectedTask, messages: session.messages });
  const restoredScroll = useRef(null);
  if (restoredScroll.current === null) restoredScroll.current = restoreConversationScroll();
  const conversationScrollPositions = useRef(restoredScroll.current.positions);
  const previousConversationTask = useRef(null);
  const followingConversation = useRef(restoredScroll.current.following);
  const scrollConversationToTop = useRef(null);
  const task = meta[selectedTask] || { question: "开始任务", reply: "请补充任务上下文。", goal: "补充目标和材料。" };
  const currentGroup = groups.find((group) => group.tasks.includes(selectedTask));
  const model = modelOptions.find((item) => item.id === selectedModel) || modelOptions[0];
  const isMainTask = selectedTask === MAIN_TASK;
  const visibleGroups = filterScope === "current" ? groups.filter((group) => group.id === currentGroup?.id) : groups;
  const updateTask = (name, change) => setSessions((all) => {
    const old = all[name] || blank();
    return { ...all, [name]: { ...old, ...(typeof change === "function" ? change(old) : change) } };
  });
  const patchSession = (change) => updateTask(selectedTask, change);
  const cancelReply = (taskName) => {
    const pending = replyTimers.current.get(taskName);
    if (pending) clearTimeout(pending.timer);
    replyTimers.current.delete(taskName);
  };
  const notify = (text) => { setToast(text); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(""), 2600); };
  const openDialog = (name, data = {}) => { setMenu(null); setDialogData(data); setDialog(name); };
  const closeDialog = () => { setDialog(null); setRetryRequested(false); };
  const openMenu = (name, event) => {
    const box = event.currentTarget.getBoundingClientRect();
    setMenu((old) => old?.name === name ? null : { name, left: Math.max(8, Math.min(innerWidth - 252, box.right - 240)), top: box.bottom + 7, bottom: box.bottom + 260 > innerHeight ? innerHeight - box.top + 7 : null });
  };
  const persistConversationScroll = () => writeSession("conversation-scroll", { positions: [...conversationScrollPositions.current], following: [...followingConversation.current] });
  const saveConversationScroll = () => { if (!conversationRef.current) return; conversationScrollPositions.current.set(selectedTask, conversationRef.current.scrollTop); persistConversationScroll(); };
  const selectTask = (name) => { if (name !== selectedTask) saveConversationScroll(); if (!sessions[name]) updateTask(name, {}); setSelectedTask(name); setActionView(null); setMenu(null); };
  const toggleGroup = (id) => setOpenedGroups((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const setSelectedRoute = (id) => { patchSession({ selectedRoute: id }); setActionView(null); };
  const setDraft = (draft) => patchSession({ draft });
  const prepareTaskSuggestion = ({ taskName, prompt }) => {
    const group = groups.find(item => item.tasks.includes(taskName));
    const suggestion = String(prompt || "").trim();
    if (!group || !suggestion) return false;
    updateTask(taskName, old => ({
      draft: old.draft.includes(suggestion) ? old.draft : old.draft.trim() ? `${old.draft}\n\n${suggestion}` : suggestion,
    }));
    selectTask(taskName);
    setOpenedGroups(items => items.includes(group.id) ? items : [...items, group.id]);
    setQuery("");
    setFilterScope("all");
    return true;
  };
  const addNotification = (text, taskName = selectedTask) => setNotifications((items) => [{ id: uid(), text, taskName, time: timeNow() }, ...items].slice(0, 10));

  useEffect(() => {
    writeSession("workbench", {
      groups, meta, query, filterScope, openedGroups, selectedTask, rationaleOpen, selectedModel,
      sessions: Object.fromEntries(Object.entries(sessions).map(([name, value]) => [name, storedTaskSession(value)])),
      automations: automations.map(entry => ({ ...entry, running: false, ...(entry.running ? { lastRun: "刷新后停止；演示尚未完成。" } : {}) })),
      notifications,
    });
  }, [groups, meta, query, filterScope, openedGroups, selectedTask, rationaleOpen, selectedModel, sessions, automations, notifications]);

  useEffect(() => {
    const close = (event) => { if (event.key === "Escape") setMenu(null); };
    const outside = (event) => { if (!event.target.closest("[data-menu-trigger]") && !menuRef.current?.contains(event.target)) setMenu(null); };
    document.addEventListener("keydown", close); document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside); };
  }, []);
  useLayoutEffect(() => {
    if (scrollConversationToTop.current === selectedTask) {
      scrollConversationToTop.current = null;
      previousConversationTask.current = selectedTask;
      conversationScrollPositions.current.set(selectedTask, 0);
      persistConversationScroll();
      conversationRef.current?.scrollTo({ top: 0 });
      conversationScrollState.current = { task: selectedTask, messages: session.messages };
      return;
    }
    if (previousConversationTask.current === selectedTask) return;
    previousConversationTask.current = selectedTask;
    conversationRef.current?.scrollTo({ top: conversationScrollPositions.current.get(selectedTask) || 0 });
  }, [selectedTask, session.messages]);
  useEffect(() => {
    const previous = conversationScrollState.current;
    const previousLast = previous.messages.at(-1);
    const hasNewMessage = previous.task === selectedTask && session.messages.length > previous.messages.length && (!previousLast || session.messages[previous.messages.length - 1]?.id === previousLast.id);
    conversationScrollState.current = { task: selectedTask, messages: session.messages };
    if (!hasNewMessage) return undefined;
    const latestMessage = session.messages.at(-1);
    if (latestMessage?.role !== "user" && followingConversation.current.get(selectedTask) === false) {
      patchSession({ unreadReply: true });
      return undefined;
    }
    const frame = requestAnimationFrame(() => conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: "smooth" }));
    return () => cancelAnimationFrame(frame);
  }, [selectedTask, session.messages]);
  useEffect(() => () => {
    clearTimeout(toastTimer.current);
    for (const pending of replyTimers.current.values()) clearTimeout(pending.timer);
    for (const timer of automationTimers.current.values()) clearTimeout(timer);
    replyTimers.current.clear();
    automationTimers.current.clear();
  }, []);

  const copyText = async (text) => { try { await navigator.clipboard.writeText(text); notify("已复制"); } catch { openDialog("copy", { text }); } };
  const conversationText = () => [session.showIntro ? task.question + "\n\n" + task.reply : "", ...session.messages.map((item) => (item.role === "user" ? "你：" : "Ascend Studio：") + item.text)].filter(Boolean).join("\n\n");
  const exportTask = () => {
    const data = { task: selectedTask, project: currentGroup?.name, goal: task.goal, evidence: isMainTask ? evidenceDetails : [], records: session.records, messages: session.messages, attachments: session.attachments.map(({ id, name, type, size }) => ({ id, name, type, size })), verification: "待真实环境验证" };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = selectedTask + "-任务记录.json"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setMenu(null); notify("已导出任务记录");
  };
  const resetTask = () => { cancelReply(selectedTask); scrollConversationToTop.current = selectedTask; patchSession(blank()); setActionView(null); setMenu(null); notify("当前任务已恢复初始状态"); };
  const sendMessage = (event, options = {}) => {
    event?.preventDefault();
    const text = String(options.userText ?? (session.draft.trim() || (session.attachments.length ? "请结合这些附件整理下一步检查。" : ""))).trim();
    if (!text || session.replying || replyTimers.current.has(selectedTask)) return false;
    const generationText = options.generationText || text;
    const taskName = selectedTask, attachments = session.attachments, records = session.records, modelLabel = model.label;
    const pending = { timer: null };
    replyTimers.current.set(taskName, pending);
    updateTask(taskName, (old) => ({ draft: "", attachments: [], replying: true, unreadReply: false, messages: [...old.messages, { id: uid(), role: "user", text, attachments, ...(options.scopeReference ? { scopeReference: options.scopeReference } : {}) }] }));
    pending.timer = setTimeout(() => {
      if (replyTimers.current.get(taskName) !== pending) return;
      replyTimers.current.delete(taskName);
      updateTask(taskName, (old) => ({ replying: false, unreadReply: old.unreadReply || activeConversationTask.current !== taskName, messages: [...old.messages, { id: uid(), role: "assistant", text: options.overrideReply || options.replyText || cleanReply(buildAssistantReply({ text: generationText, taskName, modelLabel, attachments, records })), interaction: options.interaction, ...(options.messageMeta && typeof options.messageMeta === "object" ? options.messageMeta : {}), model: modelLabel, isDemo: true }] }));
    }, 650);
    return true;
  };
  const handleConversationScroll = () => {
    const node = conversationRef.current;
    if (!node) return;
    const following = node.scrollHeight - node.clientHeight - node.scrollTop < 80;
    followingConversation.current.set(selectedTask, following);
    conversationScrollPositions.current.set(selectedTask, node.scrollTop);
    persistConversationScroll();
    if (following && session.unreadReply) patchSession({ unreadReply: false });
  };
  const showLatestReply = () => {
    followingConversation.current.set(selectedTask, true);
    patchSession({ unreadReply: false });
    conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: "smooth" });
  };
  const askFromExplanation = (context) => {
    if (session.replying || replyTimers.current.has(selectedTask)) { notify("当前答复完成后可以继续解释这句。"); return false; }
    if (context.kind === "image") {
      const focus = ["channels", "layout", "batch"].includes(context.focus) ? context.focus : "layout";
      const seconds = Math.max(0, Math.min(60, Number(context.time) || 0));
      const stamp = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
      const sourceContext = { ...context, focus, time: seconds, stamp, isDemo: true };
      const text = { channels: "每个像素包含 R、G、B 三个数值，HWC 的最后一维 C=3。分层张量图帮助区分通道，透视示意不表示真实内存结构。", layout: "HWC 输入的轴 0、1、2 分别对应 H、W、C。transpose(2,0,1) 改成 C、H、W，得到 [3,224,224]。图解里的尺寸随轴一起移动。", batch: "CHW [3,224,224] 前增加样本数 N=1，就成为 NCHW [1,3,224,224]。这里只核对示例输入约定，真实模型签名、dtype 和归一化仍需确认。" }[focus];
      updateTask(selectedTask, old => ({ messages: [...old.messages, { id: uid(), role: "user", text: `请解释 ${stamp} 这句：“${context.subtitle}”`, sourceContext }, { id: uid(), role: "assistant", text, isDemo: true, sourceContext }] }));
      return true;
    }
    const focus = ["total", "tail", "access"].includes(context.focus) ? context.focus : "tail";
    const seconds = Math.max(0, Math.min(60, Number(context.time) || 0));
    const stamp = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
    const sourceContext = { title: context.title || "非整块输入的范围讲解", subtitle: context.subtitle || "", focus, time: seconds, stamp, isDemo: true };
    const replies = {
      total: "这个范围示例把 [17,33] 展开为 561 个元素。每块 32 个，先得到 17 个完整块，共 544 个元素，最后还剩 17 个。图解里的完整块和最后一块分别对应 total 与 blocks 的计算。",
      tail: "最后一块从索引 544 开始，有效元素到索引 560 为止，共 17 个。baseIndex 决定起点，剩余数量决定有效元素数。图解放大的是这段范围；实际项目是否采用相同路径仍需核对源码。",
      access: "示例若让最后一块也循环 32 次，会访问索引 544–575，其中 561–575 的 15 个位置超出有效范围。仅访问剩余有效元素时，访问上限是 560。可以在图解中切换策略比较；这段演示不能单独证明真实 AddCustom 的精度根因。",
    };
    updateTask(selectedTask, (old) => ({ messages: [...old.messages,
      { id: uid(), role: "user", text: `请解释 ${stamp} 这句：“${sourceContext.subtitle}”`, sourceContext },
      { id: uid(), role: "assistant", text: replies[focus], isDemo: true, sourceContext },
    ] }));
    return true;
  };
  const addExchange = (user, assistant, targetTask = selectedTask) => {
    const userMessage = typeof user === "string" ? { text: user } : user;
    const assistantMessage = typeof assistant === "string" ? { text: assistant } : assistant;
    if (!userMessage?.text?.trim() || !assistantMessage?.text?.trim() || !groups.some(group => group.tasks.includes(targetTask))) return false;
    if (sessions[targetTask]?.replying || replyTimers.current.has(targetTask)) {
      notify("当前答复完成后可以继续学习。");
      return false;
    }
    updateTask(targetTask, old => ({
      unreadReply: old.unreadReply || activeConversationTask.current !== targetTask,
      messages: [...old.messages,
        { ...userMessage, id: uid(), role: "user" },
        { ...assistantMessage, id: uid(), role: "assistant", isDemo: true },
      ],
    }));
    return true;
  };
  const createTask = ({ name, groupId, goal, kind, background = "", dailyMinutes = 20, attachments = [] }) => {
    const cleanGoal = String(goal || "").trim();
    const learning = kind === "learning";
    const title = String(name || (learning ? cleanGoal.slice(0, 60) : "")).trim(), group = groups.find((item) => item.id === groupId);
    if (!group || !title) return false;
    if (groups.some((item) => item.tasks.includes(title))) { notify("已有同名任务，请换一个名称"); return false; }
    setGroups((all) => all.map((item) => item.id === groupId ? { ...item, tasks: [...item.tasks, title] } : item));
    const learningProfile = learning ? {
      goal: cleanGoal || "明确本次想学会的内容和能够完成的动作。",
      background: String(background || "").trim(),
      dailyMinutes: Math.max(5, Math.min(180, Number(dailyMinutes) || 20)),
    } : null;
    setMeta((all) => ({ ...all, [title]: {
      project: group.name,
      ...(learning ? { kind: "learning", learningProfile } : {}),
      goal: cleanGoal || "补充目标、输入材料和完成条件。",
      question: learning
        ? `我想学习：${learningProfile.goal}\n已有基础：${learningProfile.background || "待补充"}\n每天可用时间：${learningProfile.dailyMinutes} 分钟。`
        : cleanGoal || "开始整理这项任务的上下文。",
      reply: learning
        ? "已建立学习任务。先确认目标、基础和可用时间，再整理学习路径；学习中产生的图解、练习和小结会保存在这个任务中。"
        : "已建立任务。可以继续补充代码、日志或具体问题，再选择下一步检查方向。当前尚无运行证据。",
      status: "waiting",
    } }));
    saveConversationScroll(); updateTask(title, { attachments: storedAttachments(attachments) }); setSelectedTask(title); setOpenedGroups((all) => all.includes(groupId) ? all : [...all, groupId]); setQuery(""); setFilterScope("all"); setActionView(null); setDialog(null); notify("任务已创建"); return true;
  };
  const startConversation = () => {
    cancelReply(selectedTask);
    scrollConversationToTop.current = selectedTask;
    patchSession((old) => ({ history: [{ id: uid(), title: old.showIntro ? "初始诊断对话" : (old.messages.find((item) => item.role === "user")?.text.slice(0, 24) || "任务对话"), time: timeNow(), showIntro: old.showIntro, messages: old.messages }, ...old.history], showIntro: false, messages: [{ id: uid(), role: "assistant", text: "已开始新对话。当前任务的证据和核对记录仍可在右侧查看。你可以继续提出具体的检查目标。" }], draft: "", attachments: [], replying: false }));
    setMenu(null); draftRef.current?.focus();
  };
  const restoreConversation = (id) => { const item = session.history.find((entry) => entry.id === id); if (item) { cancelReply(selectedTask); scrollConversationToTop.current = selectedTask; patchSession({ showIntro: item.showIntro, messages: item.messages, replying: false }); } setDialog(null); };
  const attachCode = ({ name, content }) => { const file = { id: uid(), name, content, type: "code", size: content.length, receivedOrder: ++attachmentOrder.current }; patchSession((old) => ({ attachments: [...old.attachments, file] })); setDialog(null); notify("代码片段已加入当前任务"); };
  const readFiles = async (event, type) => {
    const taskName = selectedTask, input = event.target, files = Array.from(input.files || []);
    const incoming = await Promise.all(files.map(async (file) => {
      const receivedOrder = ++attachmentOrder.current;
      return { id: uid(), name: file.name, type, size: file.size, receivedOrder, content: type === "file" && /\.(cpp|h|py|txt|log|csv|json|md)$/i.test(file.name) && file.size < 131072 ? await file.text() : "" };
    }));
    updateTask(taskName, (old) => ({ attachments: [...old.attachments, ...incoming] })); input.value = ""; if (incoming.length) notify("已关联 " + incoming.length + " 个附件");
  };
  const useCapability = (id) => { const item = capabilities.find((capability) => capability.id === id); if (!item) return; patchSession((old) => ({ capabilityIds: old.capabilityIds.includes(id) ? old.capabilityIds : [...old.capabilityIds, id], draft: item.prompt })); setDialog(null); draftRef.current?.focus(); notify("能力已加入当前任务"); };
  const addRecord = (record, taskName = selectedTask) => { const entry = { ...record, id: uid(), time: timeNow() }; updateTask(taskName, (old) => ({ unreadReply: old.unreadReply || activeConversationTask.current !== taskName, records: [...old.records, entry], messages: [...old.messages, { id: uid(), role: "assistant", text: "已保存「" + record.title + "」。\n\n" + record.summary, isDemo: record.isDemo }] })); addNotification(record.title + "已保存", taskName); notify("记录已保存到当前任务"); };
  const confirmRoute = () => { if (session.selectedRoute === "retry") { setRetryRequested(true); openDialog("models"); } else setActionView(session.selectedRoute === "tail" ? "code" : "precision"); };
  const chooseModel = (id) => {
    setSelectedModel(id); const label = modelOptions.find((item) => item.id === id)?.label;
    if (retryRequested) { const text = cleanReply(buildAssistantReply({ text: "重新评估根因和证据", taskName: selectedTask, modelLabel: label, records: session.records })); patchSession((old) => ({ messages: [...old.messages, { id: uid(), role: "assistant", text: "当前证据与已尝试动作已保留。\n\n" + text, model: label, isDemo: true }] })); notify("已保留现场并生成演示评估"); } else notify("已切换为" + label);
    setDialog(null); setMenu(null); setRetryRequested(false);
  };
  const runAutomation = (id) => {
    const entry = automations.find((item) => item.id === id); if (!entry || automationTimers.current.has(id)) return;
    const taskName = selectedTask;
    setAutomations((all) => all.map((item) => item.id === id ? { ...item, running: true, lastRun: "正在生成检查清单…" } : item));
    const timer = setTimeout(() => {
      automationTimers.current.delete(id);
      setAutomations((all) => all.map((item) => item.id === id ? { ...item, running: false, lastRun: timeNow() + " · 演示完成" } : item));
      addRecord({ title: entry.name, summary: "已整理任务目标、已知现场与待补充条件。请核对环境版本、原始日志和逐元素误差；尚未执行设备检查。", kind: "automation", isDemo: true }, taskName);
    }, 600);
    automationTimers.current.set(id, timer);
  };
  const attachmentCode = [...session.messages.flatMap((item) => item.attachments || []), ...session.attachments]
    .filter((file) => file.content && (file.type === "code" || /\.(cpp|h|py)$/i.test(file.name)))
    .sort((a, b) => (a.receivedOrder || 0) - (b.receivedOrder || 0)).at(-1);
  const attempts = [...(isMainTask ? [{ title: "修改编译参数", summary: "错误仍在 custom_op.cpp:128，未新增定位信号。", time: "已知现场" }] : []), ...session.records.filter((item) => item.kind === "attempt")];
  return { getSession: (name) => sessions[name] || blank(), getTask: (name) => meta[name] || { goal: "补充目标和材料。" }, groups, task, session, query, setQuery, filterScope, setFilterScope, openedGroups, setOpenedGroups, selectedTask, rationaleOpen, setRationaleOpen, actionView, setActionView, menu, setMenu, menuRef, openMenu, dialog, dialogData, openDialog, closeDialog, selectedModel, model, automations, setAutomations, notifications, toast, notify, conversationRef, draftRef, fileRef, imageRef, currentGroup, isMainTask, visibleGroups, patchSession, toggleGroup, selectTask, setSelectedRoute, setDraft, prepareTaskSuggestion, copyText, conversationText, exportTask, resetTask, sendMessage, handleConversationScroll, showLatestReply, askFromExplanation, addExchange, createTask, startConversation, restoreConversation, attachCode, readFiles, useCapability, addRecord, confirmRoute, chooseModel, runAutomation, attachmentCode, attempts };
}
