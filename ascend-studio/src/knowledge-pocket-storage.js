export const KNOWLEDGE_POCKET_KEY = "ascstudio.knowledge-pocket.v1";

const cleanItem = item => ({
  id: String(item?.id || ""),
  sourceKey: String(item?.sourceKey || ""),
  title: String(item?.title || "未命名知识点").slice(0, 100),
  summary: String(item?.summary || "").slice(0, 600),
  content: String(item?.content || item?.summary || "").slice(0, 5000),
  sourceLabel: String(item?.sourceLabel || "Ascend Studio").slice(0, 160),
  sourceType: String(item?.sourceType || "学习内容").slice(0, 40),
  taskId: String(item?.taskId || "").slice(0, 120),
  signal: ["interested", "question"].includes(item?.signal) ? item.signal : "",
  status: ["saved", "scheduled", "sent", "read", "understood"].includes(item?.status) ? item.status : "saved",
  createdAt: Number.isFinite(item?.createdAt) ? item.createdAt : Date.now(),
  scheduledAt: Number.isFinite(item?.scheduledAt) ? item.scheduledAt : null,
  sentAt: Number.isFinite(item?.sentAt) ? item.sentAt : null,
  readAt: Number.isFinite(item?.readAt) ? item.readAt : null,
});

export function readKnowledgePocket() {
  try {
    const saved = JSON.parse(globalThis.localStorage?.getItem(KNOWLEDGE_POCKET_KEY) || "null");
    return {
      items: Array.isArray(saved?.items) ? saved.items.map(cleanItem).filter(item => item.id) : [],
      lastNotificationId: typeof saved?.lastNotificationId === "string" ? saved.lastNotificationId : "",
    };
  } catch {
    return { items: [], lastNotificationId: "" };
  }
}

export function writeKnowledgePocket(value) {
  try {
    const normalized = {
      items: Array.isArray(value?.items) ? value.items.map(cleanItem).filter(item => item.id).slice(-100) : [],
      lastNotificationId: typeof value?.lastNotificationId === "string" ? value.lastNotificationId : "",
    };
    globalThis.localStorage?.setItem(KNOWLEDGE_POCKET_KEY, JSON.stringify({ version: 1, ...normalized }));
    return normalized;
  } catch {
    return null;
  }
}

export function announceKnowledgePocketChange() {
  try {
    globalThis.window?.dispatchEvent(new Event("ascstudio-knowledge-pocket-change"));
  } catch {
    // Storage remains the source of truth when custom events are unavailable.
  }
}
