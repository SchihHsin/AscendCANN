/**
 * Derive an overview map from the task content catalog's explicit records.
 * This module does not infer causal links or task outcomes.
 */
import { normalizeCanvasRelation } from "./shared/canvas/node-semantics.js";

const asArray = value => Array.isArray(value) ? value : [];
const asText = value => String(value ?? "").replace(/\s+/g, " ").trim();

function itemHistoryIds(item) {
  const ids = new Set();
  for (const child of asArray(item?.children)) {
    if (child?.id != null) ids.add(String(child.id));
  }
  for (const history of asArray(item?.relatedHistory)) {
    if (history?.id != null) ids.add(String(history.id));
  }
  return ids;
}

/** Return a short, field-backed description for a map card. */
export function summarizeContentMapItem(item = {}) {
  const conclusion = asText(item.summary || item.contextLabel || item.title);
  const status = asText(item.statusLabel || item.state?.label || item.state?.detail);
  return {
    conclusion,
    status,
    historyCount: itemHistoryIds(item).size,
  };
}

/**
 * Group catalog items without changing their source order and derive directed
 * edges only from explicit `fromId` / `toId` relationships. A legacy `id`
 * remains a navigation target and is never used to guess edge direction.
 */
export function buildContentMap(items = [], groups = []) {
  const sourceItems = asArray(items).filter(item => item && item.id != null);
  const groupList = asArray(groups).filter(group => group && group.id != null)
    .map(group => ({ ...group, items: [] }));
  const groupById = new Map(groupList.map(group => [String(group.id), group]));
  const ungrouped = { id: "ungrouped", title: "其他内容", description: "未指定分组的任务内容。", items: [] };
  const itemById = new Map();
  const ownerByRecordId = new Map();

  for (const item of sourceItems) {
    const id = String(item.id);
    if (!itemById.has(id)) itemById.set(id, item);
  }

  for (const item of sourceItems) {
    const id = String(item.id);
    if (itemById.get(id) !== item) continue;
    const group = groupById.get(String(item.groupId ?? "")) || ungrouped;
    group.items.push(item);
    for (const child of asArray(item.children)) {
      if (!child || child.id == null) continue;
      const recordId = String(child.id);
      // Prefer the explicit child parent when it points to a real catalog item.
      const parentId = child.parentId != null && itemById.has(String(child.parentId))
        ? String(child.parentId)
        : id;
      ownerByRecordId.set(recordId, parentId);
    }
  }
  // relatedHistory is a lookup reference; it must not reassign a history
  // entry already owned by the container whose children actually include it.
  for (const item of sourceItems) {
    if (itemById.get(String(item.id)) !== item) continue;
    for (const history of asArray(item.relatedHistory)) {
      if (history?.id == null) continue;
      const recordId = String(history.id);
      if (ownerByRecordId.has(recordId)) continue;
      ownerByRecordId.set(recordId, history.parentId != null && itemById.has(String(history.parentId))
        ? String(history.parentId)
        : String(item.id));
    }
  }
  if (ungrouped.items.length) groupList.push(ungrouped);

  const edges = [];
  const edgeKeys = new Set();
  const resolveOwner = endpointId => {
    const id = String(endpointId || "");
    if (!id) return "";
    return itemById.has(id) ? id : ownerByRecordId.get(id) || "";
  };
  for (const item of sourceItems) {
    if (!itemById.has(String(item.id)) || itemById.get(String(item.id)) !== item) continue;
    for (const rawRelation of asArray(item.relations)) {
      const relation = normalizeCanvasRelation(rawRelation, String(item.id));
      if (!relation) continue;
      const fromRecordId = String(relation.fromId || "");
      const toRecordId = String(relation.toId || "");
      if (!fromRecordId || !toRecordId) continue;
      const sourceId = resolveOwner(fromRecordId);
      const targetId = resolveOwner(toRecordId);
      if (!sourceId || !targetId || sourceId === targetId) continue;
      // History snapshots retain their own identities while graph endpoints
      // collapse to the visible catalog card that owns them.
      const label = asText(relation.label || relation.title);
      const type = asText(relation.relationType || relation.type || "related-to");
      const key = [sourceId, targetId, fromRecordId, toRecordId, type].join("\u001f");
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({
        id: `relation:${edges.length + 1}`,
        sourceId,
        targetId,
        label,
        type,
        sourceRecordId: fromRecordId,
        targetRecordId: toRecordId,
        navigationTargetId: String(relation.id || toRecordId),
        evidence: asText(relation.evidence || relation.reason),
        conditions: relation.conditions && typeof relation.conditions === "object" ? relation.conditions : undefined,
      });
    }
  }

  const childCount = sourceItems.reduce((count, item) => count + asArray(item.children).length, 0);
  const historyIds = new Set(sourceItems.flatMap(item => [...itemHistoryIds(item)]));
  return {
    groups: groupList,
    edges,
    counts: {
      groups: groupList.length,
      items: itemById.size,
      children: childCount,
      history: historyIds.size,
      edges: edges.length,
    },
  };
}
