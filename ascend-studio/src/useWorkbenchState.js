import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { initialGroups, taskDetails, capabilities, initialAutomations, modelOptions, buildAssistantReply } from "./prototype-data";

export const MAIN_TASK = "AddCustom 精度异常";
export const evidenceDetails = [
  { title: "[16,32] 通过", body: "已知的通过样本。仍需补充输入内容、数据类型和环境版本，才能作完整对照。", log: "input_shape: [16,32]\nprecision_check: PASS\n环境与容差记录：待补充" },
  { title: "[17,33] 失败", body: "已知的失败样本。非整块输入与失败同时出现，仅能作为核查线索。", log: "input_shape: [17,33]\nprecision_check: FAIL\n逐元素误差：待补充" },
  { title: "precision mismatch · custom_op.cpp:128", body: "错误位置标记了检查入口，尚未定位到具体实现原因。", log: "precision mismatch\nlocation: custom_op.cpp:128\n尝试：修改编译参数\n结果：错误位置未变" },
];
const blank = () => ({ showIntro: true, messages: [], draft: "", attachments: [], records: [], capabilityIds: [], history: [], selectedRoute: "tail", feedback: null, replying: false });
const uid = () => crypto.randomUUID();
const timeNow = () => new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Shanghai" });
const cleanReply = (text) => text.replace(/\n\n演示答复 · 未调用真实 AI 或硬件。$/, "");

export function useWorkbenchState() {
  const [groups, setGroups] = useState(initialGroups);
  const [meta, setMeta] = useState(taskDetails);
  const [query, setQuery] = useState("");
  const [filterScope, setFilterScope] = useState("all");
  const [openedGroups, setOpenedGroups] = useState(["operator", "inference"]);
  const [selectedTask, setSelectedTask] = useState(MAIN_TASK);
  const [sessions, setSessions] = useState({ [MAIN_TASK]: blank() });
  const [rationaleOpen, setRationaleOpen] = useState(false);
  const [actionView, setActionView] = useState(null);
  const [menu, setMenu] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [dialogData, setDialogData] = useState({});
  const [selectedModel, setSelectedModel] = useState("general");
  const [retryRequested, setRetryRequested] = useState(false);
  const [automations, setAutomations] = useState(initialAutomations);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const replyTimers = useRef(new Map());
  const automationTimers = useRef(new Map());
  const attachmentOrder = useRef(0);
  const conversationRef = useRef(null);
  const draftRef = useRef(null);
  const fileRef = useRef(null);
  const imageRef = useRef(null);
  const menuRef = useRef(null);
  const session = sessions[selectedTask] || blank();
  const conversationScrollState = useRef({ task: selectedTask, messages: session.messages });
  const conversationScrollPositions = useRef(new Map());
  const previousConversationTask = useRef(selectedTask);
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
  const saveConversationScroll = () => conversationScrollPositions.current.set(selectedTask, conversationRef.current?.scrollTop || 0);
  const selectTask = (name) => { if (name !== selectedTask) saveConversationScroll(); if (!sessions[name]) updateTask(name, {}); setSelectedTask(name); setActionView(null); setMenu(null); };
  const toggleGroup = (id) => setOpenedGroups((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const setSelectedRoute = (id) => { patchSession({ selectedRoute: id }); setActionView(null); };
  const setDraft = (draft) => patchSession({ draft });
  const addNotification = (text, taskName = selectedTask) => setNotifications((items) => [{ id: uid(), text, taskName, time: timeNow() }, ...items].slice(0, 10));

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
  const sendMessage = (event) => {
    event?.preventDefault();
    const text = session.draft.trim() || (session.attachments.length ? "请结合这些附件整理下一步检查。" : "");
    if (!text || session.replying || replyTimers.current.has(selectedTask)) return;
    const taskName = selectedTask, attachments = session.attachments, records = session.records, modelLabel = model.label;
    const pending = { timer: null };
    replyTimers.current.set(taskName, pending);
    updateTask(taskName, (old) => ({ draft: "", attachments: [], replying: true, messages: [...old.messages, { id: uid(), role: "user", text, attachments }] }));
    pending.timer = setTimeout(() => {
      if (replyTimers.current.get(taskName) !== pending) return;
      replyTimers.current.delete(taskName);
      updateTask(taskName, (old) => ({ replying: false, messages: [...old.messages, { id: uid(), role: "assistant", text: cleanReply(buildAssistantReply({ text, taskName, modelLabel, attachments, records })), model: modelLabel, isDemo: true }] }));
    }, 650);
  };
  const askFromExplanation = (context) => {
    if (session.replying || replyTimers.current.has(selectedTask)) { notify("当前答复完成后可以继续解释这句。"); return; }
    if (context.kind === "image") {
      const focus = ["channels", "layout", "batch"].includes(context.focus) ? context.focus : "layout";
      const seconds = Math.max(0, Math.min(60, Number(context.time) || 0));
      const stamp = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
      const sourceContext = { ...context, focus, time: seconds, stamp, isDemo: true };
      const text = { channels: "每个像素包含 R、G、B 三个数值，HWC 的最后一维 C=3。分层张量图帮助区分通道，透视示意不表示真实内存结构。", layout: "HWC 输入的轴 0、1、2 分别对应 H、W、C。transpose(2,0,1) 改成 C、H、W，得到 [3,224,224]。图解里的尺寸随轴一起移动。", batch: "CHW [3,224,224] 前增加样本数 N=1，就成为 NCHW [1,3,224,224]。这里只核对示例输入约定，真实模型签名、dtype 和归一化仍需确认。" }[focus];
      updateTask(selectedTask, old => ({ messages: [...old.messages, { id: uid(), role: "user", text: `请解释 ${stamp} 这句：“${context.subtitle}”`, sourceContext }, { id: uid(), role: "assistant", text, isDemo: true, sourceContext }] }));
      return;
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
  };
  const createTask = ({ name, groupId, goal }) => {
    const title = name.trim(), group = groups.find((item) => item.id === groupId);
    if (!group || !title) return false;
    if (groups.some((item) => item.tasks.includes(title))) { notify("已有同名任务，请换一个名称"); return false; }
    setGroups((all) => all.map((item) => item.id === groupId ? { ...item, tasks: [...item.tasks, title] } : item));
    setMeta((all) => ({ ...all, [title]: { project: group.name, goal: goal.trim() || "补充目标、输入材料和完成条件。", question: goal.trim() || "开始整理这项任务的上下文。", reply: "已建立任务。可以继续补充代码、日志或具体问题，再选择下一步检查方向。当前尚无运行证据。", status: "waiting" } }));
    saveConversationScroll(); updateTask(title, {}); setSelectedTask(title); setOpenedGroups((all) => all.includes(groupId) ? all : [...all, groupId]); setQuery(""); setFilterScope("all"); setActionView(null); setDialog(null); notify("任务已创建"); return true;
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
  const addRecord = (record, taskName = selectedTask) => { const entry = { ...record, id: uid(), time: timeNow() }; updateTask(taskName, (old) => ({ records: [...old.records, entry], messages: [...old.messages, { id: uid(), role: "assistant", text: "已保存「" + record.title + "」。\n\n" + record.summary, isDemo: record.isDemo }] })); addNotification(record.title + "已保存", taskName); notify("记录已保存到当前任务"); };
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
  return { getSession: (name) => sessions[name] || blank(), getTask: (name) => meta[name] || { goal: "补充目标和材料。" }, groups, task, session, query, setQuery, filterScope, setFilterScope, openedGroups, setOpenedGroups, selectedTask, rationaleOpen, setRationaleOpen, actionView, setActionView, menu, setMenu, menuRef, openMenu, dialog, dialogData, openDialog, closeDialog, selectedModel, model, automations, setAutomations, notifications, toast, notify, conversationRef, draftRef, fileRef, imageRef, currentGroup, isMainTask, visibleGroups, patchSession, toggleGroup, selectTask, setSelectedRoute, setDraft, copyText, conversationText, exportTask, resetTask, sendMessage, askFromExplanation, createTask, startConversation, restoreConversation, attachCode, readFiles, useCapability, addRecord, confirmRoute, chooseModel, runAutomation, attachmentCode, attempts };
}
