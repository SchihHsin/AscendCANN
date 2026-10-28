/**
 * Shared semantic vocabulary for task and learning canvas objects.
 * Domain adapters map existing records into this vocabulary; they must never
 * infer business meaning from canvas coordinates or array/render order.
 */

export const CANVAS_NODE_TYPE = Object.freeze({
  GOAL: "goal", STEP: "step", MATERIAL: "material", EVIDENCE: "evidence",
  ACTION: "action", RESULT: "result", NOTE: "note",
});

export const CANVAS_CONTENT_TYPE = Object.freeze({
  CODE: "code", DOCUMENT: "document", DIAGRAM: "diagram", VIDEO: "video",
  DIFF: "diff", CHECKLIST: "checklist", NOTE: "note", DRAWING: "drawing",
  SUMMARY: "summary", LESSON: "lesson", INTERACTIVE: "interactive",
});

export const CANVAS_STATUS = Object.freeze({
  AVAILABLE: "available", IN_PROGRESS: "in-progress", PROPOSED: "proposed",
  COMPLETED: "completed", NEEDS_REVIEW: "needs-review", BLOCKED: "blocked",
  OUTDATED: "outdated", ARCHIVED: "archived",
});

export const CANVAS_RELATION_TYPE = Object.freeze({
  CONTAINS: "contains", PRECEDES: "precedes", DERIVED_FROM: "derived-from",
  SUPPORTS: "supports", CHECKS: "checks", SUPERSEDES: "supersedes",
  REFERENCES: "references", RELATED_TO: "related-to",
});

export const CANVAS_NODE_TYPES = Object.freeze(Object.values(CANVAS_NODE_TYPE));
export const CANVAS_CONTENT_TYPES = Object.freeze(Object.values(CANVAS_CONTENT_TYPE));
export const CANVAS_STATUSES = Object.freeze(Object.values(CANVAS_STATUS));
export const CANVAS_RELATION_TYPES = Object.freeze(Object.values(CANVAS_RELATION_TYPE));

const nodeTypeSet = new Set(CANVAS_NODE_TYPES);
const contentTypeSet = new Set(CANVAS_CONTENT_TYPES);
const statusSet = new Set(CANVAS_STATUSES);
const relationTypeSet = new Set(CANVAS_RELATION_TYPES);
const STATUS_ALIASES = Object.freeze({
  "not-started": "available",
  "not_started": "available",
  "in_progress": "in-progress",
  "needs_review": "needs-review",
  done: "completed",
});

const contentTypeFromLegacy = Object.freeze({
  code: "code",
  document: "document",
  browser: "document",
  diagram: "diagram",
  video: "video",
  diff: "diff",
  checklist: "checklist",
  note: "note",
  drawing: "drawing",
  result: "summary",
  summary: "summary",
  lesson: "lesson",
  interactive: "interactive",
  preview: "summary",
});

const categoryToNodeType = Object.freeze({
  explain: "material",
  experiment: "action",
  check: "result",
  change: "result",
  reference: "material",
});

const categoryToContentType = Object.freeze({
  explain: "diagram",
  experiment: "interactive",
  check: "checklist",
  change: "summary",
  reference: "document",
});

const ADD_CUSTOM_NODE_MAP = Object.freeze({
  "task-brief": { nodeType: "goal", contentType: "summary" },
  source: { nodeType: "material", contentType: "code" },
  evidence: { nodeType: "evidence", contentType: "summary" },
  reference: { nodeType: "material", contentType: "document" },
  explanation: { nodeType: "material", contentType: "diagram" },
  parameters: { nodeType: "action", contentType: "interactive" },
  attempts: { nodeType: "result", contentType: "summary" },
  draft: { nodeType: "action", contentType: "code" },
  diff: { nodeType: "result", contentType: "diff" },
  validation: { nodeType: "result", contentType: "checklist" },
  precision: { nodeType: "result", contentType: "checklist" },
  review: { nodeType: "result", contentType: "summary" },
});

const IMAGE_NODE_MAP = Object.freeze({
  "image-source": { nodeType: "material", contentType: "code" },
  "image-explanation": { nodeType: "material", contentType: "diagram" },
  "image-practice": { nodeType: "action", contentType: "interactive" },
  "image-attempts": { nodeType: "result", contentType: "summary" },
  "image-diff": { nodeType: "result", contentType: "diff" },
  "image-validation": { nodeType: "result", contentType: "checklist" },
});

const LEARNING_NODE_MAP = Object.freeze({
  "learning-goal": { nodeType: "goal", contentType: "summary" },
  "learning-path": { nodeType: "step", contentType: "summary" },
  "learning-lesson": { nodeType: "material", contentType: "lesson" },
  "learning-practice": { nodeType: "action", contentType: "interactive" },
  "learning-check": { nodeType: "result", contentType: "checklist" },
  "learning-summary": { nodeType: "result", contentType: "summary" },
});

const RESNET50_NODE_MAP = Object.freeze({
  "learning-official-stage-chain": { nodeType: "step", contentType: "summary" },
  "learning-official-stage-environment": { nodeType: "step", contentType: "summary" },
  "learning-official-stage-input": { nodeType: "step", contentType: "summary" },
  "learning-official-stage-execution": { nodeType: "step", contentType: "summary" },
  "learning-official-stage-result": { nodeType: "step", contentType: "summary" },
});

const DOMAIN_ALIASES = Object.freeze({
  addcustom: "addcustom",
  "add-custom": "addcustom",
  "addcustom-task": "addcustom",
  "addcustom 精度异常": "addcustom",
  image: "image-inference",
  "image-inference": "image-inference",
  "图像推理调试": "image-inference",
  learning: "learning",
  "image-learning": "learning",
  "学会图像输入预处理": "learning",
  resnet: "resnet50",
  resnet50: "resnet50",
  "resnet50-learning": "resnet50",
  "resnet50 离线推理初体验": "resnet50",
});

export const CANVAS_NODE_ADAPTERS = Object.freeze({
  addcustom: Object.freeze({ nodeMap: ADD_CUSTOM_NODE_MAP, prefixes: Object.freeze({
    "attempt:": { nodeType: "result", contentType: "summary" },
    "snapshot:": { nodeType: "result", contentType: "diff" },
    "record:": { nodeType: "result", contentType: "summary" },
    "note:": { nodeType: "note", contentType: "note" },
    "drawing-card:": { nodeType: "note", contentType: "drawing" },
  }) }),
  "image-inference": Object.freeze({ nodeMap: IMAGE_NODE_MAP, prefixes: Object.freeze({
    "attempt:": { nodeType: "result", contentType: "summary" },
    "snapshot:": { nodeType: "result", contentType: "diff" },
    "record:": { nodeType: "result", contentType: "summary" },
    "note:": { nodeType: "note", contentType: "note" },
    "drawing-card:": { nodeType: "note", contentType: "drawing" },
  }) }),
  learning: Object.freeze({ nodeMap: LEARNING_NODE_MAP, prefixes: Object.freeze({
    "attempt:": { nodeType: "result", contentType: "summary" },
    "snapshot:": { nodeType: "result", contentType: "summary" },
    "record:": { nodeType: "result", contentType: "summary" },
    "note:": { nodeType: "note", contentType: "note" },
    "drawing-card:": { nodeType: "note", contentType: "drawing" },
  }) }),
  resnet50: Object.freeze({ nodeMap: RESNET50_NODE_MAP, suffixes: Object.freeze({
    ":diagram": { nodeType: "material", contentType: "diagram" },
    ":lesson": { nodeType: "material", contentType: "video" },
    ":explanation": { nodeType: "material", contentType: "lesson" },
    ":practice": { nodeType: "action", contentType: "interactive" },
    ":check": { nodeType: "action", contentType: "interactive" },
  }), prefixes: Object.freeze({
    "learning-official-step-": { nodeType: "step", contentType: "lesson" },
    "record:": { nodeType: "result", contentType: "summary" },
    "note:": { nodeType: "note", contentType: "note" },
    "drawing-card:": { nodeType: "note", contentType: "drawing" },
  }) }),
});

const asText = value => typeof value === "string" ? value.trim() : "";
const asRecord = value => value && typeof value === "object" && !Array.isArray(value) ? value : {};

function canonicalDomain(domain) {
  const raw = asText(domain).toLowerCase();
  return DOMAIN_ALIASES[raw] || raw;
}

/** Map task-specific status spellings to the stable canvas status vocabulary. */
export function normalizeCanvasStatus(value) {
  const raw = asText(value).toLowerCase();
  const status = STATUS_ALIASES[raw] || raw;
  return statusSet.has(status) ? status : undefined;
}

function adapterFor(domain) {
  return CANVAS_NODE_ADAPTERS[canonicalDomain(domain)] || null;
}

function explicitMapping(node, domain) {
  const adapter = adapterFor(domain);
  const id = asText(node.id);
  if (adapter?.nodeMap?.[id]) return adapter.nodeMap[id];
  if (adapter) {
    for (const [suffix, mapping] of Object.entries(adapter.suffixes || {})) {
      if (id.endsWith(suffix)) return mapping;
    }
    for (const [prefix, mapping] of Object.entries(adapter.prefixes || {})) {
      if (id.startsWith(prefix)) return mapping;
    }
  }

  // ResNet stage aliases returned by getOfficialLearningNode carry this marker.
  if (canonicalDomain(domain) === "resnet50" && node.kind === "course") {
    return { nodeType: "step", contentType: "summary" };
  }
  return null;
}

function legacyContentType(node) {
  const raw = asText(node.contentType || node.type || node.kind).toLowerCase();
  if (contentTypeSet.has(raw)) return raw;
  if (contentTypeFromLegacy[raw]) return contentTypeFromLegacy[raw];
  const category = asText(node.category).toLowerCase();
  return categoryToContentType[category] || undefined;
}

function legacyNodeType(node, contentType) {
  const raw = asText(node.nodeType).toLowerCase();
  if (nodeTypeSet.has(raw)) return raw;
  const kind = asText(node.kind).toLowerCase();
  if (kind === "note" || kind === "drawing") return "note";
  const category = asText(node.category).toLowerCase();
  if (categoryToNodeType[category]) return categoryToNodeType[category];
  if (["code", "document", "browser", "diagram", "video"].includes(asText(node.type).toLowerCase())) return "material";
  if (contentType === "diff" || contentType === "checklist") return "result";
  return undefined;
}

/** Normalize one legacy or domain-specific node without dropping its fields. */
export function normalizeCanvasNode(rawNode, domain) {
  const node = asRecord(rawNode);
  const id = asText(node.id);
  if (!id) return null;

  const mapping = explicitMapping(node, domain) || {};
  const contentType = mapping.contentType || legacyContentType(node);
  const nodeType = mapping.nodeType || legacyNodeType(node, contentType);
  const status = normalizeCanvasStatus(node.status || node.state?.status);
  const summary = asText(node.summary) || asText(node.description) || undefined;
  const provenance = normalizeProvenance(node.provenance);
  const viewState = normalizeViewState(node);
  const parentId = asText(node.parentId) || undefined;
  const relations = (Array.isArray(node.relations) ? node.relations : []).map(relation => {
    const normalized = normalizeCanvasRelation(relation, id);
    if (normalized) return normalized;
    // Keep legacy navigation references available to the content index while
    // stripping any ambiguous or invalid direction so it cannot become an edge.
    const legacy = asRecord(relation);
    const linkedId = asText(legacy.id || legacy.toId || legacy.targetId);
    if (!linkedId) return null;
    return {
      id: linkedId,
      ...(asText(legacy.label) ? { label: asText(legacy.label) } : {}),
      ...(asText(legacy.title) ? { title: asText(legacy.title) } : {}),
      navigationOnly: true,
    };
  }).filter(Boolean);

  const normalized = {
    ...node,
    id,
    ...(asText(node.title) ? { title: asText(node.title) } : {}),
    ...(nodeType && nodeTypeSet.has(nodeType) ? { nodeType } : {}),
    ...(contentType && contentTypeSet.has(contentType) ? { contentType } : {}),
    ...(summary ? { summary } : {}),
    ...(asText(node.statusLabel || node.state?.label) ? { statusLabel: asText(node.statusLabel || node.state?.label) } : {}),
    ...(parentId ? { parentId } : {}),
    ...(asText(node.groupId) ? { groupId: asText(node.groupId) } : {}),
    ...(provenance ? { provenance } : {}),
    ...(viewState ? { viewState } : {}),
    ...(adapterFor(domain) ? { domain: canonicalDomain(domain) } : {}),
    relations,
  };
  if (status) normalized.status = status;
  else delete normalized.status;
  return normalized;
}

function normalizeProvenance(raw) {
  if (typeof raw === "string" && raw.trim()) return [{ label: "来源", value: raw.trim() }];
  if (Array.isArray(raw)) {
    const entries = raw.map(item => {
      if (typeof item === "string" && item.trim()) return { label: "来源", value: item.trim() };
      const entry = asRecord(item);
      return Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== undefined && value !== null && value !== ""));
    }).map(entry => {
      if (entry.label || entry.value || entry.recordId) return entry;
      const [label, value] = Object.entries(entry)[0] || [];
      return label && value != null ? { label, value: String(value) } : entry;
    }).filter(entry => Object.keys(entry).length);
    return entries.length ? entries : undefined;
  }
  const provenance = asRecord(raw);
  const entries = Object.entries(provenance)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([label, value]) => typeof value === "object" && !Array.isArray(value)
      ? { label, ...value }
      : { label, value: String(value) });
  return entries.length ? entries : undefined;
}

function normalizeViewState(node) {
  const source = asRecord(node.viewState);
  const viewState = { ...source };
  for (const key of ["collapsed", "pinned", "selected", "hidden", "closed", "unread"]) {
    if (typeof node[key] === "boolean") viewState[key] = node[key];
    else if (typeof source[key] === "boolean") viewState[key] = source[key];
  }
  if (typeof node.visible === "boolean") viewState.visible = node.visible;
  else if (typeof node.hidden === "boolean") viewState.visible = !node.hidden;
  else if (typeof source.visible === "boolean") viewState.visible = source.visible;
  const x = Number.isFinite(node.x) ? node.x : Number.isFinite(source.position?.x) ? source.position.x : undefined;
  const y = Number.isFinite(node.y) ? node.y : Number.isFinite(source.position?.y) ? source.position.y : undefined;
  if (x !== undefined && y !== undefined) viewState.position = { x, y };
  const width = Number.isFinite(node.width) ? node.width : Number.isFinite(source.size?.width) ? source.size.width : undefined;
  const height = Number.isFinite(node.height) ? node.height : Number.isFinite(source.size?.height) ? source.size.height : undefined;
  if (width !== undefined && height !== undefined) viewState.size = { width, height };
  return Object.keys(viewState).length ? viewState : undefined;
}

/**
 * Normalize a declared relation. The legacy `id` field is treated as its
 * explicit destination only when a caller provides `fromId`; no relation is
 * created from proximity, order, matching titles, or shared groups.
 */
export function normalizeCanvasRelation(rawRelation, fromId) {
  const relation = asRecord(rawRelation);
  const ownerId = asText(fromId);
  const direction = asText(relation.direction).toLowerCase();
  const declaredTarget = asText(relation.id);
  const source = asText(relation.fromId || relation.sourceId || (direction === "from-owner" ? ownerId : direction === "to-owner" ? declaredTarget : ""));
  const target = asText(relation.toId || relation.targetId || (direction === "from-owner" ? declaredTarget : direction === "to-owner" ? ownerId : ""));
  if (!source || !target || source === target) return null;

  const rawType = asText(relation.relationType || relation.type).toLowerCase();
  const relationAliases = {
    related: "related-to",
    related_to: "related-to",
    "derived_from": "derived-from",
    contains: "contains",
    precedes: "precedes",
    "derived-from": "derived-from",
    supports: "supports",
    checks: "checks",
    supersedes: "supersedes",
    references: "references",
    "related-to": "related-to",
  };
  const relationType = relationAliases[rawType];
  const label = asText(relation.label || relation.title);
  const evidence = asText(relation.evidence || relation.reason);

  // A label or evidence is the minimum explicit basis for legacy untyped edges.
  if (rawType && !relationType) return null;
  if (!relationType && !label && !evidence) return null;
  // Untyped legacy relations with a visible explanation remain explicit but
  // deliberately weak; they are not upgraded to evidence/supporting claims.
  const normalizedType = relationType || "related-to";
  if (normalizedType === "related-to" && !label && !evidence) return null;
  if (!relationTypeSet.has(normalizedType)) return null;

  const conditions = asRecord(relation.conditions);
  return {
    ...relation,
    id: asText(relation.id) || `${source}:${normalizedType}:${target}`,
    fromId: source,
    toId: target,
    relationType: normalizedType,
    ...(label ? { label } : {}),
    ...(evidence ? { evidence } : {}),
    ...(Object.keys(conditions).length ? { conditions: { ...conditions } } : {}),
  };
}

/** Normalize a list of nodes and their explicitly declared edges. */
export function normalizeCanvasNodes(rawNodes, domain) {
  if (!Array.isArray(rawNodes)) return [];
  const normalized = rawNodes.map(rawNode => {
    const node = normalizeCanvasNode(rawNode, domain);
    if (!node) return null;
    return Array.isArray(node.children)
      ? { ...node, children: normalizeCanvasNodes(node.children, domain) }
      : node;
  }).filter(Boolean);

  return normalized.map(node => {
    // Keep explicit links to history snapshots even when the target is not a
    // visible canvas node. Their target identity is meaningful to navigation.
    const explicit = node.relations;
    // parentId is a declared structural relationship, so it can safely yield
    // a contains edge. This never uses the input array or canvas coordinates.
    const parentRelation = node.parentId
      ? normalizeCanvasRelation({
        fromId: node.parentId,
        toId: node.id,
        relationType: "contains",
        label: "所属步骤",
        id: node.parentId,
        title: node.parentTitle,
        evidence: "显式 parentId",
      })
      : null;
    const relations = [...explicit];
    if (parentRelation && !relations.some(item => item.fromId === parentRelation.fromId && item.toId === parentRelation.toId && item.relationType === "contains")) {
      relations.push(parentRelation);
    }
    return { ...node, relations };
  });
}
