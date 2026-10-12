/**
 * Content index for the task overview. This module only describes content that
 * was visited, produced, or explicitly opened on the canvas; it does not create
 * task materials or infer a diagnosis.
 */

export const CONTENT_CATEGORIES = Object.freeze([
  { id: "explain", label: "图解与解释" },
  { id: "experiment", label: "试验与试改" },
  { id: "check", label: "检查与结果" },
  { id: "change", label: "修改与交付" },
  { id: "reference", label: "资料与来源" },
]);

const ADD_CUSTOM_GROUPS = Object.freeze([
  { id: "range", title: "尾块访问与范围", description: "参数、索引范围算例及其修改和复核。尾块只是待核查线索，根因尚未确认。" },
  { id: "precision", title: "输出误差与核对", description: "逐元素误差、检查观察与待补证据。" },
  { id: "reference", title: "相关代码与资料", description: "代码、任务现场和参考来源；可被其他内容作为上下文引用。" },
]);

const IMAGE_GROUPS = Object.freeze([
  { id: "input", title: "图像与模型输入", description: "图像预处理、输入形状及相关试验和核对。" },
  { id: "image-reference", title: "相关代码与资料", description: "只读代码与参考来源，可作为输入核对的上下文。" },
]);

export function getContentGroups(taskId) {
  return isImageTask(taskId) ? IMAGE_GROUPS.map((group) => ({ ...group })) : ADD_CUSTOM_GROUPS.map((group) => ({ ...group }));
}

const isImageTask = (taskId) => String(taskId || "").includes("图像推理");
const asArray = (value) => Array.isArray(value) ? value : [];
const asObject = (value) => value && typeof value === "object" ? value : {};
const present = (value) => value !== null && value !== undefined && value !== false && value !== "";
const short = (value, limit = 150) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
};

const MAIN_META = {
  source: { title: "索引范围示例", type: "code", category: "reference", groupId: "range", summary: "只读示例代码；用于对照循环与访问范围，不代表真实项目实现。" },
  draft: { title: "示例工作副本", type: "code", category: "change", groupId: "range", summary: "浏览器内的示例草案；不会写入真实项目文件。" },
  evidence: { title: "现场与判断", type: "preview", category: "check", groupId: "range", summary: "保留当前线索和待补证据；尾块范围仍需结合实际代码核对。" },
  explanation: { title: "线索解释", type: "preview", category: "explain", groupId: "range", summary: "解释索引范围与尾块算例；不据此预设根因。" },
  parameters: { title: "参数与范围策略", type: "preview", category: "experiment", groupId: "range", summary: "当前示例参数与访问范围策略。" },
  attempts: { title: "尝试记录", type: "preview", category: "experiment", groupId: "range" },
  diff: { title: "示例修改预览", type: "diff", category: "change", groupId: "range" },
  validation: { title: "示例范围复核", type: "preview", category: "check", groupId: "range" },
  precision: { title: "误差核对", type: "preview", category: "check", groupId: "precision" },
  review: { title: "复核记录", type: "preview", category: "check", groupId: "precision" },
  reference: { title: "Ascend C 文档", type: "browser", category: "reference", groupId: "reference", summary: "参考资料；版本适用性与真实项目结论仍需核对。" },
  "task-brief": { title: "任务简报", type: "preview", category: "reference", groupId: "reference", summary: "本地演示任务及待补充的环境、代码和运行证据。" },
};

const IMAGE_META = {
  "image-source": { title: "preprocess.py · 只读示例", type: "code", category: "reference", groupId: "input", summary: "只读预处理示例；原项目文件未接入，真实模型签名待核对。" },
  "image-explanation": { title: "图像与张量图解", type: "preview", category: "explain", groupId: "input", summary: "解释 RGB 通道、维度顺序与 batch 输入约定。" },
  "image-practice": { title: "预处理练习副本", type: "code", category: "experiment", groupId: "input", summary: "浏览器示例参数与代码副本；没有执行 Python 或模型推理。" },
  "image-attempts": { title: "形状检查与尝试", type: "result", category: "experiment", groupId: "input" },
  "image-diff": { title: "预处理修改预览", type: "diff", category: "change", groupId: "input" },
  "image-validation": { title: "返回任务核对", type: "result", category: "check", groupId: "input" },
};

function summarizeMainAttempts(flow, historyCount = 0) {
  const attempts = asArray(flow.attempts);
  if (!attempts.length) return `当前范围尝试结果暂不可用；${historyCount ? `保留 ${historyCount} 条历史记录` : "历史记录"}在相关记录中，打开不会重新生成。`;
  const latest = attempts.at(-1);
  const snapshot = asObject(latest.snapshot);
  const rows = snapshot.rows ?? latest.rows;
  const columns = snapshot.columns ?? latest.columns;
  const tileSize = snapshot.tileSize ?? latest.tileSize;
  const detail = [present(rows) && present(columns) ? `输入 [${rows},${columns}]` : "", present(tileSize) ? `块大小 ${tileSize}` : "", latest.bounds === "valid" ? "有效元素范围" : latest.bounds === "full" ? "完整块范围" : "", latest.result || ""].filter(Boolean).join("；");
  return `${attempts.length} 次浏览器范围算例${detail ? `；最近一次：${short(detail, 115)}` : ""}。未编译 C++，未验证精度、根因或 NPU。`;
}

function summarizeMainDiff(flow, historyCount = 0) {
  if (flow.appliedCode && flow.appliedCode === flow.proposedCode) return "这份提案已应用到浏览器示例副本；保留修改依据和历史，真实项目未修改。";
  if (!flow.proposedCode) return `${String(flow.notice || "").includes("取消") ? "当前提案已取消" : "当前提案暂不可用"}；${historyCount ? `保留 ${historyCount} 条提案及操作记录` : "暂无历史提案快照"}，打开不会重新生成。`;
  const code = String(flow.proposedCode);
  const baseline = String(flow.proposalBaseline || "");
  const changed = baseline && baseline !== code;
  return `${changed ? "已生成示例代码修改提案" : "已生成示例代码预览"}；仅浏览器副本，真实项目根因仍待确认。`;
}

function summarizeMainValidation(flow, historyCount = 0) {
  const validation = asObject(flow.validation);
  if (!present(flow.appliedCode) && !present(validation.id)) return `当前复核结果暂不可用；${historyCount ? `保留 ${historyCount} 条历史复核快照` : "暂无历史复核快照"}，打开不会重新生成。`;
  if (!present(validation.id)) return "示例副本已应用，尚无复核结果；真实项目与 NPU 仍待验证。";
  return `${short(validation.summary || validation.notice || (validation.passed ? "浏览器范围复核完成" : "浏览器范围复核仍有范围外索引"), 110)} 真实项目、精度与 NPU 仍待验证。`;
}

function summarizePrecision(context, historyCount = 0) {
  if (!context) return historyCount
    ? `当前逐元素误差结果暂不可用；保留 ${historyCount} 条历史核对记录，打开不会重新生成。`
    : "逐元素误差结果尚不可用；需要输出数据与容差依据。";
  const rows = asArray(context.rows);
  const count = context.count ?? rows.length;
  const failed = context.failed ?? rows.filter((row) => row && row.passed === false).length;
  const demo = context.isDemo === true;
  return `${present(count) ? `${count} 项误差核对` : "误差核对结果已保留"}${present(failed) ? `，${failed} 项超差` : ""}${present(context.atol) ? `；atol ${context.atol}` : ""}${present(context.rtol) ? `，rtol ${context.rtol}` : ""}。${demo ? "演示数据，真实精度待核对。" : "数据来源与真实精度仍待核对。"}`;
}

function summarizeImageAttempts(state, historyCount = 0) {
  const attempts = asArray(state.attempts);
  if (!attempts.length) return `当前形状检查结果暂不可用；${historyCount ? `保留 ${historyCount} 条历史记录` : "历史记录"}在相关记录中，打开不会重新生成。`;
  const latest = attempts.at(-1);
  const dimensions = asArray(latest.dimensions);
  const detail = dimensions.length ? `最近输出 [${dimensions.join(",")}]` : latest.snapshot ? `轴顺序 ${asArray(latest.snapshot.axes).join(",")}，${latest.snapshot.batch ? "含 batch" : "不含 batch"}` : "";
  return `${attempts.length} 次浏览器形状检查${detail ? `；${detail}` : ""}。未执行 Python、模型或 NPU 推理。`;
}

function summarizeImageDiff(state, historyCount = 0) {
  if (!state.proposal) return `${String(state.notice || "").includes("取消") ? "当前图像预处理提案已取消" : "当前图像预处理提案暂不可用"}；${historyCount ? `保留 ${historyCount} 条提案及操作记录` : "暂无历史提案快照"}，打开不会重新生成。`;
  const attempt = asObject(state.proposal.attempt);
  const dimensions = asArray(attempt.dimensions);
  return `已生成浏览器示例修改预览${dimensions.length ? `；输出 [${dimensions.join(",")}]` : ""}。原项目未修改，未执行模型推理。`;
}

function summarizeImageValidation(state, historyCount = 0) {
  if (!state.applied && !state.validation) return `当前图像核对结果暂不可用；${historyCount ? `保留 ${historyCount} 条历史核对快照` : "暂无历史核对快照"}，打开不会重新生成。`;
  if (!state.validation) return "浏览器示例副本已应用，尚未保存核对结果；模型签名与真实推理待核对。";
  const dimensions = asArray(state.validation.dimensions);
  return `浏览器形状核对${state.validation.passed ? "符合" : "不符合"}示例约定${dimensions.length ? ` [${dimensions.join(",")}]` : ""}。未执行 Python、模型或 NPU；真实模型签名待核对。`;
}

function childFromRecord(record) {
  const data = asObject(record.data);
  const snapshot = asObject(data.attempt?.snapshot || data.snapshot);
  const conditions = [
    present(data.atol) ? `atol ${data.atol}，rtol ${data.rtol}` : "",
    present(snapshot.rows) ? `输入 [${snapshot.rows},${snapshot.columns}]，每块 ${snapshot.tileSize}，${snapshot.bounds === "valid" ? "仅有效元素" : "整块访问"}` : "",
    Array.isArray(snapshot.axes) ? `轴顺序 ${snapshot.axes.join(",")}，${snapshot.batch ? "含 batch" : "无 batch"}` : "",
  ].filter(Boolean).join("；");
  const id = String(record.id || "");
  return {
    id: id.startsWith("snapshot:") || id.startsWith("record:") ? id : `record:${id}`,
    title: record.title || "复核记录",
    summary: short([conditions, record.summary || "已保留本次任务记录。"].filter(Boolean).join("。"), 190),
    time: record.time || "",
  };
}

function targetForRecord(record, image) {
  const parents = image
    ? new Set(["image-attempts", "image-diff", "image-validation"])
    : new Set(["attempts", "diff", "validation", "precision", "review"]);
  if (parents.has(record.parentId)) return record.parentId;
  const kind = String(record.kind || "").toLowerCase();
  if (image) {
    if (["image-diff-snapshot", "image-apply"].includes(kind)) return "image-diff";
    if (["image-validation", "image-validation-snapshot"].includes(kind)) return "image-validation";
    if (["image-trial", "image-attempt", "image-attempt-snapshot"].includes(kind)) return "image-attempts";
    if (["validation", "validation-snapshot"].includes(kind)) return "image-validation";
    if (["diff-snapshot", "apply", "undo-apply"].includes(kind)) return "image-diff";
    if (["review"].includes(kind)) return "image-validation";
    if (["trial", "range", "precision", "precision-snapshot"].includes(kind)) return "image-attempts";
  } else {
    if (["validation", "validation-snapshot"].includes(kind)) return "validation";
    if (["precision", "precision-snapshot"].includes(kind)) return "precision";
    if (["diff-snapshot", "apply", "undo-apply"].includes(kind)) return "diff";
    if (kind === "review") return "review";
    if (["trial", "range"].includes(kind)) return "attempts";
  }
  const text = `${record.kind || ""} ${record.title || ""} ${record.summary || ""}`.toLowerCase();
  if (image) {
    if (/diff|提案|应用示例修改/.test(text)) return "image-diff";
    if (/返回任务核对|应用示例修改|image-validation|核对.*模型|模型.*核对|validation/.test(text)) return "image-validation";
    return "image-attempts";
  }
  if (/precision|误差|精度|容差/.test(text)) return "precision";
  if (/review|复核/.test(text)) return "review";
  if (/validation|范围复核|返回任务核对|核对.*范围/.test(text)) return "validation";
  return "attempts";
}

function isProduced(id, flow, inference, precisionContext) {
  if (id === "attempts") return asArray(flow.attempts).length > 0;
  if (id === "diff") return present(flow.proposedCode);
  if (id === "validation") return present(flow.appliedCode) || present(asObject(flow.validation).id);
  if (id === "precision") return Boolean(precisionContext);
  if (id === "image-attempts") return asArray(inference.attempts).length > 0;
  if (id === "image-diff") return Boolean(inference.proposal);
  if (id === "image-validation") return Boolean(inference.applied || inference.validation);
  return false;
}

function itemSummary(id, image, flow, inference, precisionContext, count, hasRecord) {
  if (id === "attempts") return summarizeMainAttempts(flow, count);
  if (id === "diff") return summarizeMainDiff(flow, count);
  if (id === "validation") return summarizeMainValidation(flow, count);
  if (id === "precision") return summarizePrecision(precisionContext, count);
  if (id === "review") return hasRecord ? `${count} 条复核记录已保留；观察与待补证据仍需结合真实项目核对。` : "复核工作区曾被访问；真实项目结论仍需证据支持。";
  if (id === "image-attempts") return summarizeImageAttempts(inference, count);
  if (id === "image-diff") return summarizeImageDiff(inference, count);
  if (id === "image-validation") return summarizeImageValidation(inference, count);
  return (image ? IMAGE_META : MAIN_META)[id]?.summary || "已保留在本任务中，可继续查看。";
}

function statusFor(id, produced, precisionContext, flow, inference) {
  if (!produced && ["attempts", "diff", "validation", "precision", "image-attempts", "image-diff", "image-validation"].includes(id)) {
    if ((id === "diff" && String(flow.notice || "").includes("取消")) || (id === "image-diff" && String(inference.notice || "").includes("取消"))) return "已取消 · 历史保留";
    return "当前结果暂不可用";
  }
  if (id === "precision" && precisionContext) return "本地计算 · 数据来源待核对";
  if (id === "attempts") return "浏览器范围演算 · 根因待确认";
  if (id === "image-attempts") return "示例形状检查 · 真实模型待核对";
  if (id === "diff") return flow.appliedCode && flow.appliedCode === flow.proposedCode ? "已应用示例 · 真实项目待验证" : "示例提案 · 未改真实项目";
  if (id === "validation") return "示例范围复核 · 真实项目待核对";
  if (id === "image-diff") return "示例预览 · 未执行模型";
  if (id === "image-validation") return "示例形状复核 · 真实推理待核对";
  if (id === "review") return "复核记录 · 根因待确认";
  return "已访问";
}

function recordBucket(record, image) {
  return targetForRecord(record, image);
}

export function buildTaskContentItems({
  taskId,
  visited = [],
  materials = [],
  flowState = {},
  inferenceState = {},
  records = [],
  precisionContext = null,
  canvasCards = [],
} = {}) {
  const image = isImageTask(taskId);
  const flow = asObject(flowState);
  const inference = asObject(inferenceState);
  const allRecords = asArray(records);
  const recordList = allRecords.filter(record => !(record.kind === "validation" && allRecords.some(snapshot => snapshot.kind === "validation-snapshot" && snapshot.time === record.time && snapshot.summary === record.summary)));
  const materialList = asArray(materials);
  const canvasList = asArray(canvasCards);
  const metadata = image ? IMAGE_META : MAIN_META;
  const visitedList = asArray(visited).filter((entry) => entry && (typeof entry === "string" || typeof entry.id === "string"));
  const visitedById = new Map();
  visitedList.forEach((entry) => {
    const item = typeof entry === "string" ? { id: entry } : entry;
    if (item.id && item.id !== "canvas") visitedById.set(item.id, { ...(visitedById.get(item.id) || {}), ...item });
  });

  const canvasById = new Map();
  canvasList.filter((card) => card && card.opened && card.id && card.id !== "canvas" && !/^(record:|snapshot:)/.test(String(card.id))).forEach((card) => canvasById.set(card.id, card));
  const candidateIds = new Set([...visitedById.keys()].filter((id) => !/^(record:|snapshot:)/.test(id)));
  Object.keys(metadata).forEach((id) => { if (isProduced(id, flow, inference, precisionContext)) candidateIds.add(id); });
  canvasById.forEach((_card, id) => candidateIds.add(id));
  recordList.forEach((record) => candidateIds.add(recordBucket(record, image)));
  visitedById.forEach((_entry, id) => {
    if (!/^(record:|snapshot:)/.test(id)) return;
    const rawId = id.startsWith("record:") ? id.slice("record:".length) : id;
    const record = recordList.find((item) => String(item.id) === rawId || `record:${item.id}` === id);
    candidateIds.add(record ? recordBucket(record, image) : (image ? "image-attempts" : "review"));
  });

  const materialById = new Map(materialList.map((material) => [material.id, material]));
  const itemsById = new Map();
  const result = [];

  for (const id of candidateIds) {
    if (/^(record:|snapshot:)/.test(String(id)) || id === "canvas") continue;
    const meta = metadata[id];
    const material = materialById.get(id) || {};
    const visitedEntry = visitedById.get(id) || {};
    const canvasCard = canvasById.get(id) || {};
    const knownType = meta?.type || material.type || visitedEntry.type || canvasCard.type || "preview";
    const title = canvasCard.title || material.title || visitedEntry.title || meta?.title || id;
    const produced = isProduced(id, flow, inference, precisionContext);
    const matchingRecords = recordList.filter((record) => recordBucket(record, image) === id);
    const shouldShow = Boolean(visitedEntry.id || canvasCard.id || produced || matchingRecords.length);
    if (!shouldShow) continue;

    let available = true;
    if (id === "attempts") available = asArray(flow.attempts).length > 0;
    else if (id === "diff") available = Boolean(flow.proposedCode);
    else if (id === "validation") available = Boolean(flow.appliedCode || asObject(flow.validation).id);
    else if (id === "image-attempts") available = asArray(inference.attempts).length > 0;
    else if (id === "image-diff") available = Boolean(inference.proposal);
    else if (id === "image-validation") available = Boolean(inference.applied || inference.validation);
    else if (id === "precision") available = Boolean(precisionContext);
    else if (material.available === false && !produced) available = false;

    const historyCount = matchingRecords.length;
    const countLabel = id === "attempts" ? `${asArray(flow.attempts).length} 次尝试${historyCount ? ` · ${historyCount} 条历史记录` : ""}`
      : id === "image-attempts" ? `${asArray(inference.attempts).length} 次尝试${historyCount ? ` · ${historyCount} 条历史记录` : ""}`
        : id === "precision" && precisionContext ? `${precisionContext.count ?? asArray(precisionContext.rows).length} 项${historyCount ? ` · ${historyCount} 条历史记录` : ""}`
          : historyCount ? `${historyCount} 条历史记录` : "";
    const item = {
      id,
      title,
      type: knownType,
      category: meta?.category || (knownType === "diff" || /draft|practice/.test(id) ? "change" : "reference"),
      groupId: meta?.groupId || (image ? "image-reference" : "reference"),
      summary: itemSummary(id, image, flow, inference, precisionContext, matchingRecords.length, matchingRecords.length > 0),
      statusLabel: statusFor(id, produced, precisionContext, flow, inference),
      countLabel,
      unread: Boolean(visitedEntry.unread),
      closed: Boolean(visitedEntry.closed),
      children: [],
      available,
    };
    itemsById.set(id, item);
    result.push(item);
  }

  const childIds = new Set();
  for (const record of recordList) {
    const parentId = recordBucket(record, image);
    const parent = itemsById.get(parentId);
    if (!parent) continue;
    const child = childFromRecord(record);
    if (childIds.has(child.id)) continue;
    childIds.add(child.id);
    parent.children.push(child);
  }

  for (const [visitedId, entry] of visitedById) {
    if (!/^(record:|snapshot:)/.test(visitedId)) continue;
    const rawId = visitedId.startsWith("record:") ? visitedId.slice("record:".length) : visitedId;
    if (childIds.has(visitedId)) continue;
    const record = recordList.find((item) => String(item.id) === rawId);
    const parentId = record ? recordBucket(record, image) : (image ? "image-attempts" : "review");
    const parent = itemsById.get(parentId);
    if (!parent) continue;
    childIds.add(visitedId);
    parent.children.push({
      id: visitedId,
      title: entry.title || record?.title || "复核记录",
      summary: short(entry.summary || record?.summary || "已访问的记录；原记录内容暂不可用。", 190),
      time: entry.time || record?.time || "",
    });
  }

  // Keep record-bearing containers available when an old record exists, even
  // if the corresponding transient result state has since been cleared.
  return result.map((item) => ({ ...item, children: item.children.slice() }));
}
