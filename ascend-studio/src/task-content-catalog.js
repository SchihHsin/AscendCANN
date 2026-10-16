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
const GENERIC_GROUPS = Object.freeze([
  { id: "content", title: "任务内容", description: "本任务中已打开、保存或生成的内容与记录。" },
]);
const GENERIC_META = Object.freeze({
  records: { title: "任务记录", type: "result", category: "reference", groupId: "content", summary: "本任务中已保留的记录与上下文。" },
});

export function getContentGroups(taskId) {
  const groups = isImageTask(taskId) ? IMAGE_GROUPS : isMainTask(taskId) ? ADD_CUSTOM_GROUPS : GENERIC_GROUPS;
  return groups.map((group) => ({ ...group }));
}

const isImageTask = (taskId) => String(taskId || "") === "图像推理调试";
const isMainTask = (taskId) => String(taskId || "") === "AddCustom 精度异常";
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
  if (flow.appliedCode && !flow.proposedCode) return `浏览器示例副本已有应用内容；${historyCount ? `保留 ${historyCount} 条提案及操作记录` : "提案操作记录仍可查看"}。真实项目未修改，尚未完成项目或 NPU 验证。`;
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
  if (state.applied && !state.proposal) return `浏览器示例副本已有应用内容；${historyCount ? `保留 ${historyCount} 条提案及操作记录` : "提案操作记录仍可查看"}。原项目未修改，模型推理尚未运行。`;
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
    parentId: record.parentId || "",
    type: record.kind || "record",
    typeLabel: recordTypeLabel(record.kind),
    title: record.title || "复核记录",
    summary: short([conditions, record.summary || "已保留本次任务记录。"].filter(Boolean).join("。"), 190),
    contextLabel: short(conditions, 90),
    time: record.time || "",
  };
}

function attemptChildrenFor(taskId, flow, inference) {
  const image = taskId === "image-attempts";
  const attempts = image ? asArray(inference.attempts) : asArray(flow.attempts);
  const seen = new Set();
  return attempts.filter((attempt) => attempt && attempt.id && !seen.has(attempt.id) && seen.add(attempt.id)).map((attempt) => {
    const snapshot = asObject(attempt.snapshot);
    if (image) {
      const contextLabel = [
        `轴顺序 ${asArray(snapshot.axes).join(",")}`,
        snapshot.batch ? "含 batch" : "不含 batch",
      ].join(" · ");
      const result = asArray(attempt.dimensions).length
        ? `输出 [${attempt.dimensions.join(",")}]${attempt.valid === false ? "；轴顺序无效" : attempt.passed === true ? "；符合示例约定" : attempt.passed === false ? "；不符合示例约定" : ""}`
        : attempt.valid === false ? "轴顺序无效" : "形状结果已保存";
      return {
        id: `attempt:${attempt.id}`,
        parentId: taskId,
        type: "image-attempt",
        typeLabel: "形状尝试",
        title: "形状尝试",
        time: attempt.time || "",
        contextLabel,
        summary: short(`${contextLabel}；${result}。仅浏览器形状检查，未执行 Python、模型或 NPU 推理。`, 190),
      };
    }
    const contextLabel = attemptContext(snapshot, "");
    const result = attempt.result || "范围算例已保存";
    return {
      id: `attempt:${attempt.id}`,
      parentId: taskId,
      type: "attempt",
      typeLabel: "范围尝试",
      title: "范围尝试",
      time: attempt.time || "",
      contextLabel,
      summary: short(`${contextLabel ? `${contextLabel}；` : ""}${result}。仅浏览器范围算例，未编译 C++，未验证精度、根因或 NPU。`, 190),
    };
  });
}

function recordTypeLabel(type) {
  const labels = {
    trial: "尝试记录", range: "尝试记录", "image-trial": "尝试记录", "image-attempt": "尝试记录", "image-attempt-snapshot": "尝试记录",
    "diff-snapshot": "修改记录", "image-diff-snapshot": "修改记录", apply: "应用记录", "image-apply": "应用记录", "undo-apply": "撤销记录",
    validation: "核对记录", "validation-snapshot": "核对记录", "image-validation": "核对记录", "image-validation-snapshot": "核对记录",
    precision: "误差记录", "precision-snapshot": "误差记录", review: "复核记录", "image-practice": "练习记录",
  };
  return labels[type] || "任务记录";
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

function recordBucket(record, image, generic = false) {
  return generic ? "records" : targetForRecord(record, image);
}

function isProduced(id, flow, inference, precisionContext) {
  if (id === "attempts") return asArray(flow.attempts).length > 0;
  if (id === "diff") return present(flow.proposedCode) || present(flow.appliedCode);
  if (id === "validation") return present(flow.appliedCode) || present(asObject(flow.validation).id);
  if (id === "precision") return Boolean(precisionContext);
  if (id === "image-attempts") return asArray(inference.attempts).length > 0;
  if (id === "image-diff") return Boolean(inference.proposal || inference.applied);
  if (id === "image-validation") return Boolean(inference.applied || inference.validation);
  return false;
}

function itemSummary(id, image, flow, inference, precisionContext, count, hasRecord) {
  if (id === "records") return `${count} 条本任务记录已保留；打开只回看记录，不会重新执行。`;
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
  if (id === "diff") return flow.appliedCode && (!flow.proposedCode || flow.appliedCode === flow.proposedCode) ? "已应用示例 · 真实项目待验证" : "示例提案 · 未改真实项目";
  if (id === "validation") return "示例范围复核 · 真实项目待核对";
  if (id === "image-diff") return inference.applied && !inference.proposal ? "已应用示例 · 未执行模型" : "示例预览 · 未执行模型";
  if (id === "image-validation") return "示例形状复核 · 真实推理待核对";
  if (id === "review") return "复核记录 · 根因待确认";
  if (id === "records") return "任务记录已保留";
  return "";
}

const KIND_LABELS = Object.freeze({
  explain: "图解", code: "代码", diff: "修改", result: "结果", browser: "资料", preview: "资料",
});

function kindLabelFor(id, type, category, title) {
  if (["explanation", "image-explanation"].includes(id)) return "图解";
  if (["source", "draft", "image-source", "image-practice"].includes(id)) return "代码";
  if (["diff", "image-diff"].includes(id)) return "修改";
  if (["attempts", "validation", "precision", "review", "image-attempts", "image-validation", "evidence"].includes(id)) return id === "evidence" || id === "review" ? "记录" : "结果";
  if (["reference", "task-brief"].includes(id)) return "资料";
  if (KIND_LABELS[type]) return KIND_LABELS[type];
  if (category === "explain") return "图解";
  if (category === "experiment") return "记录";
  if (category === "change") return "修改";
  if (/代码|源码|脚本/.test(String(title || ""))) return "代码";
  if (/结果|核对|检查/.test(String(title || ""))) return "结果";
  return "资料";
}

function attemptById(attempts, id) {
  return asArray(attempts).find((attempt) => attempt && attempt.id === id) || null;
}

function mainContextFor(id, flow, precisionContext) {
  if (["explanation", "parameters", "draft"].includes(id)) return attemptContext(flow, "当前示例");
  if (id === "attempts") return attemptContext(asArray(flow.attempts).at(-1)?.snapshot, "最近一次尝试");
  if (id === "diff") {
    const attemptId = flow.proposedCode ? flow.selectedAttemptId : flow.appliedAttemptId;
    const attempt = attemptById(flow.attempts, attemptId);
    return attemptContext(attempt?.snapshot, flow.proposedCode && flow.appliedCode !== flow.proposedCode ? "提案条件" : flow.appliedCode ? "已应用条件" : "");
  }
  if (id === "validation") {
    const validation = asObject(flow.validation);
    const attempt = attemptById(flow.attempts, validation.attemptId);
    const current = validation.attemptId && validation.attemptId === flow.appliedAttemptId
      && validation.code === flow.appliedCode && (!flow.proposedCode || validation.code === flow.proposedCode);
    return attemptContext(attempt?.snapshot, current ? "复核条件" : "旧复核条件");
  }
  if (id === "precision" && precisionContext) {
    const context = precisionContext;
    const bits = [present(context.count ?? asArray(context.rows).length) ? `${context.count ?? asArray(context.rows).length} 项数据` : "", present(context.atol) ? `atol ${context.atol}` : "", present(context.rtol) ? `rtol ${context.rtol}` : ""].filter(Boolean);
    return bits.join("；");
  }
  return "";
}

function attemptContext(snapshot, prefix = "") {
  if (!snapshot || typeof snapshot !== "object") return "";
  const bits = [
    prefix,
    present(snapshot.rows) && present(snapshot.columns) ? `输入 [${snapshot.rows},${snapshot.columns}]` : "",
    present(snapshot.tileSize) ? `块大小 ${snapshot.tileSize}` : "",
    snapshot.bounds === "valid" ? "有效元素范围" : snapshot.bounds === "full" ? "完整块范围" : "",
  ].filter(Boolean);
  return bits.join(" · ");
}

function imageContextFor(id, state) {
  let snapshot = null;
  let prefix = "";
  if (["image-explanation", "image-practice"].includes(id)) { snapshot = state; prefix = "当前示例"; }
  if (id === "image-attempts") { snapshot = asArray(state.attempts).at(-1)?.snapshot; prefix = "最近一次尝试"; }
  if (id === "image-diff") { snapshot = state.proposal?.attempt?.snapshot || state.applied?.snapshot; prefix = state.applied && !state.proposal ? "已应用条件" : "提案条件"; }
  if (id === "image-validation") {
    snapshot = state.validation?.snapshot;
    const current = state.validation?.attemptId && state.validation.attemptId === state.applied?.id
      && (!state.proposal || state.proposal.attempt?.id === state.applied?.id);
    prefix = current ? "复核条件" : "旧复核条件";
  }
  if (!snapshot) return "";
  return [prefix, `轴顺序 ${asArray(snapshot.axes).join(",")}`, snapshot.batch ? "含 batch" : "不含 batch"].filter(Boolean).join(" · ");
}

function taskStateFor(id, produced, precisionContext, flow, inference, fallbackDetail = "") {
  let detail = statusFor(id, produced, precisionContext, flow, inference);
  let label = "";
  let tone = "neutral";
  if (id === "validation" && flow.validation?.id) {
    const current = flow.validation.attemptId && flow.validation.attemptId === flow.appliedAttemptId
      && flow.validation.code === flow.appliedCode
      && (!flow.proposedCode || flow.validation.code === flow.proposedCode);
    label = !current ? "旧条件结果" : flow.validation.passed === true ? "示例范围通过" : "范围复核待处理";
    tone = !current ? "neutral" : flow.validation.passed === true ? "success" : "warning";
    if (!current) detail = `${detail}；对应旧条件，不代表当前提案结果。`;
  } else if (id === "image-validation" && inference.validation) {
    const current = inference.validation.attemptId && inference.validation.attemptId === inference.applied?.id
      && (!inference.proposal || inference.proposal.attempt?.id === inference.applied?.id);
    label = !current ? "旧条件结果" : inference.validation.passed === true ? "示例形状符合" : "示例形状未符合";
    tone = !current ? "neutral" : inference.validation.passed === true ? "success" : "warning";
    if (!current) detail = `${detail}；对应旧条件，不代表当前提案结果。`;
  } else if (id === "precision" && precisionContext) {
    const rows = asArray(precisionContext.rows);
    const failed = precisionContext.failed ?? rows.filter((row) => row && row.passed === false).length;
    label = "误差已计算";
    tone = failed > 0 ? "warning" : "neutral";
  } else if (id === "diff" && flow.proposedCode) {
    label = flow.appliedCode === flow.proposedCode ? "示例已应用" : "待应用";
  } else if (id === "diff" && flow.appliedCode || id === "image-diff" && inference.applied && !inference.proposal) {
    label = "示例已应用";
  } else if (id === "image-diff" && inference.proposal) {
    label = inference.proposal.attempt?.id && inference.proposal.attempt.id === inference.applied?.id ? "示例已应用" : "待应用";
  } else if (id === "attempts" && asArray(flow.attempts).length || id === "image-attempts" && asArray(inference.attempts).length) {
    label = "已尝试";
  }
  return { label, tone, detail: label ? detail : fallbackDetail };
}

function relationsFor(id, flow, inference) {
  const relations = [];
  const add = (targetId, label, title) => relations.push({ id: targetId, label, title });
  if (id === "explanation") add("source", "示例来源", "索引范围示例");
  if (id === "source") add("explanation", "用于图解", "线索解释");
  if (id === "image-explanation") add("image-source", "示例来源", "preprocess.py · 只读示例");
  if (id === "image-source") add("image-explanation", "用于图解", "图像与张量图解");
  if (["explanation", "parameters", "draft"].includes(id) && asArray(flow.attempts).length) add("attempts", "尝试记录", "范围尝试");
  if (["image-explanation", "image-practice"].includes(id) && asArray(inference.attempts).length) add("image-attempts", "尝试记录", "形状尝试");
  if (id === "attempts" && flow.proposedCode && attemptById(flow.attempts, flow.selectedAttemptId)) add("diff", "提案依据", "示例修改预览");
  if (id === "diff") {
    const attempt = attemptById(flow.attempts, flow.proposedCode ? flow.selectedAttemptId : flow.appliedAttemptId);
    const diffMatchesApplied = Boolean(flow.appliedCode && (!flow.proposedCode || flow.proposedCode === flow.appliedCode));
    if (attempt && (flow.proposedCode || diffMatchesApplied)) add("attempts", flow.proposedCode ? "提案依据" : "应用依据", "尝试记录");
    const validationCurrent = flow.validation?.id && flow.validation.attemptId && flow.validation.attemptId === flow.appliedAttemptId
      && flow.validation.code === flow.appliedCode && (!flow.proposedCode || flow.validation.code === flow.proposedCode);
    if (validationCurrent && diffMatchesApplied) add("validation", "后续复核", "示例范围复核");
  }
  if (id === "validation" && flow.validation?.id && flow.validation.attemptId && flow.validation.attemptId === flow.appliedAttemptId
    && flow.validation.code === flow.appliedCode && (!flow.proposedCode || flow.validation.code === flow.proposedCode)) {
    if (flow.appliedCode) add("diff", "复核对象", "示例修改预览");
  }
  if (id === "image-attempts" && inference.proposal?.attempt?.id) add("image-diff", "提案引用", "预处理修改预览");
  if (id === "image-diff") {
    const attemptId = inference.proposal?.attempt?.id || inference.applied?.id;
    if (attemptId) add("image-attempts", "依据尝试", "形状检查与尝试");
    if (inference.validation && inference.validation.attemptId === inference.applied?.id && (!inference.proposal || inference.proposal.attempt?.id === inference.applied?.id)) add("image-validation", "后续核对", "返回任务核对");
  }
  if (id === "image-validation" && inference.validation && inference.validation.attemptId === inference.applied?.id
    && (!inference.proposal || inference.proposal.attempt?.id === inference.applied?.id)) add("image-diff", "核对对象", "预处理修改预览");
  return relations;
}

function staticContextFor(id) {
  if (id === "source") return "教学示例来源 · 原项目代码未接入";
  if (id === "explanation") return "教学图解 · 不代表真实项目根因";
  if (id === "image-source") return "教学示例来源 · 原项目文件未接入";
  if (id === "image-explanation") return "教学图解 · 真实模型签名待核对";
  if (id === "reference") return "官方文档参考 · 适用版本待核对";
  return "";
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
  const generic = !image && !isMainTask(taskId);
  const flow = asObject(flowState);
  const inference = asObject(inferenceState);
  const allRecords = asArray(records);
  const recordList = allRecords.filter(record => {
    if (record.kind === "validation" && allRecords.some(snapshot => snapshot.kind === "validation-snapshot" && snapshot.time === record.time && snapshot.summary === record.summary)) return false;
    if (image && ["image-validation", "image-practice"].includes(record.kind) && (record.kind === "image-validation" || String(record.title || "").includes("返回任务核对"))) {
      const matching = allRecords.some(snapshot => snapshot.kind === "validation-snapshot" && snapshot.parentId === "image-validation"
        && (record.data?.attemptId ? snapshot.data?.attemptId === record.data.attemptId : snapshot.time === record.time && Array.isArray(snapshot.data?.dimensions) && String(record.summary || "").includes(`[${snapshot.data.dimensions.join(",")}]`)));
      if (matching) return false;
    }
    if (isMainTask(taskId) && asArray(flow.attempts).length && record.kind === "trial") return false;
    if (image && asArray(inference.attempts).length && record.kind === "image-practice" && String(record.title || "").includes("形状尝试")) return false;
    return true;
  });
  const materialList = asArray(materials);
  const canvasList = asArray(canvasCards);
  const metadata = image ? IMAGE_META : generic ? GENERIC_META : MAIN_META;
  const visitedList = asArray(visited).filter((entry) => entry && (typeof entry === "string" || typeof entry.id === "string"));
  const visitedById = new Map();
  visitedList.forEach((entry) => {
    const item = typeof entry === "string" ? { id: entry } : entry;
    if (item.id && item.id !== "canvas") visitedById.set(item.id, { ...(visitedById.get(item.id) || {}), ...item });
  });

  const canvasById = new Map();
  canvasList.filter((card) => card && card.opened && card.id && card.id !== "canvas" && !/^(record:|snapshot:|attempt:)/.test(String(card.id))).forEach((card) => canvasById.set(card.id, card));
  const candidateIds = new Set([...visitedById.keys()].filter((id) => !/^(record:|snapshot:|attempt:)/.test(id)));
  const relatedStaticIds = new Set();
  Object.keys(metadata).forEach((id) => { if (isProduced(id, flow, inference, precisionContext)) candidateIds.add(id); });
  if (candidateIds.has("explanation")) { candidateIds.add("source"); relatedStaticIds.add("source"); }
  if (candidateIds.has("source")) { candidateIds.add("explanation"); relatedStaticIds.add("explanation"); }
  if (candidateIds.has("image-explanation")) { candidateIds.add("image-source"); relatedStaticIds.add("image-source"); }
  if (candidateIds.has("image-source")) { candidateIds.add("image-explanation"); relatedStaticIds.add("image-explanation"); }
  canvasById.forEach((_card, id) => candidateIds.add(id));
  recordList.forEach((record) => candidateIds.add(recordBucket(record, image, generic)));
  visitedById.forEach((_entry, id) => {
    if (id.startsWith("attempt:")) {
      candidateIds.add(image ? "image-attempts" : generic ? "records" : "attempts");
      return;
    }
    if (!/^(record:|snapshot:)/.test(id)) return;
    const rawId = id.startsWith("record:") ? id.slice("record:".length) : id;
    const record = recordList.find((item) => String(item.id) === rawId || `record:${item.id}` === id);
    candidateIds.add(record ? recordBucket(record, image, generic) : (generic ? "records" : image ? "image-attempts" : "review"));
  });

  const materialById = new Map(materialList.map((material) => [material.id, material]));
  const itemsById = new Map();
  const result = [];

  for (const id of candidateIds) {
    if (/^(record:|snapshot:|attempt:)/.test(String(id)) || id === "canvas") continue;
    const meta = metadata[id];
    const material = materialById.get(id) || {};
    const visitedEntry = visitedById.get(id) || {};
    const canvasCard = canvasById.get(id) || {};
    const knownType = meta?.type || material.type || visitedEntry.type || canvasCard.type || "preview";
    const title = canvasCard.title || material.title || visitedEntry.title || meta?.title || id;
    const produced = isProduced(id, flow, inference, precisionContext);
    const matchingRecords = recordList.filter((record) => recordBucket(record, image, generic) === id);
    const attemptHistoryParent = image ? "image-attempts" : generic ? "records" : "attempts";
    const hasVisitedAttempt = id === attemptHistoryParent && [...visitedById.keys()].some((visitedId) => visitedId.startsWith("attempt:"));
    const shouldShow = Boolean(visitedEntry.id || canvasCard.id || produced || matchingRecords.length || relatedStaticIds.has(id) || hasVisitedAttempt);
    if (!shouldShow) continue;

    let available = true;
    if (id === "attempts") available = asArray(flow.attempts).length > 0;
    else if (id === "diff") available = Boolean(flow.proposedCode || flow.appliedCode);
    else if (id === "validation") available = Boolean(flow.appliedCode || asObject(flow.validation).id);
    else if (id === "image-attempts") available = asArray(inference.attempts).length > 0;
    else if (id === "image-diff") available = Boolean(inference.proposal || inference.applied);
    else if (id === "image-validation") available = Boolean(inference.applied || inference.validation);
    else if (id === "precision") available = Boolean(precisionContext);
    else if (material.available === false && !produced) available = false;

    const historyCount = matchingRecords.length;
    const attemptChildren = id === "attempts" || id === "image-attempts" ? attemptChildrenFor(id, flow, inference) : [];
    const countLabel = id === "attempts" || id === "image-attempts" ? `${attemptChildren.length} 次尝试${historyCount ? ` · ${historyCount} 条历史记录` : ""}`
        : id === "precision" && precisionContext ? `${precisionContext.count ?? asArray(precisionContext.rows).length} 项${historyCount ? ` · ${historyCount} 条历史记录` : ""}`
          : historyCount ? `${historyCount} 条历史记录` : "";
    const item = {
      id,
      title,
      type: knownType,
      kindLabel: kindLabelFor(id, knownType, meta?.category || material.category || visitedEntry.category, title),
      category: meta?.category || (knownType === "diff" || /draft|practice/.test(id) ? "change" : "reference"),
      groupId: meta?.groupId || (generic ? "content" : image ? "image-reference" : "reference"),
      summary: generic
        ? short(canvasCard.summary || material.summary || visitedEntry.summary || meta?.summary || `${title}已在本任务中保留，可继续查看。`, 190)
        : itemSummary(id, image, flow, inference, precisionContext, matchingRecords.length, matchingRecords.length > 0),
      statusLabel: generic ? (matchingRecords.length ? "任务记录已保留" : "任务内容已打开") : statusFor(id, produced, precisionContext, flow, inference),
      state: generic
        ? { label: matchingRecords.length ? "内容记录已保留" : "内容可查看", tone: "neutral", detail: "通用任务内容；不套用其他业务场景的诊断或验证结论。" }
        : taskStateFor(id, produced, precisionContext, flow, inference, material.summary || visitedEntry.summary || canvasCard.summary || meta?.summary || ""),
      viewState: {
        label: visitedEntry.closed ? "已收起" : visitedEntry.unread ? "有更新" : visitedEntry.id || canvasCard.id ? "已查看" : "未查看",
        unread: Boolean(visitedEntry.unread),
        closed: Boolean(visitedEntry.closed),
      },
      contextLabel: short((generic ? "" : image ? imageContextFor(id, inference) : mainContextFor(id, flow, precisionContext)) || material.contextLabel || visitedEntry.contextLabel || canvasCard.contextLabel || staticContextFor(id), 110),
      relations: generic ? [] : relationsFor(id, flow, inference),
      countLabel,
      unread: Boolean(visitedEntry.unread),
      closed: Boolean(visitedEntry.closed),
      children: attemptChildren,
      available,
    };
    itemsById.set(id, item);
    result.push(item);
  }

  const childIds = new Set(result.flatMap((item) => item.children.map((child) => child.id)));
  for (const record of recordList) {
    const parentId = recordBucket(record, image, generic);
    const parent = itemsById.get(parentId);
    if (!parent) continue;
    const child = { ...childFromRecord(record), parentId };
    if (childIds.has(child.id)) continue;
    childIds.add(child.id);
    parent.children.push(child);
  }

  for (const [visitedId, entry] of visitedById) {
    if (!/^(record:|snapshot:|attempt:)/.test(visitedId)) continue;
    const rawId = visitedId.replace(/^(record:|snapshot:|attempt:)/, "");
    if (childIds.has(visitedId)) continue;
    const record = recordList.find((item) => String(item.id) === rawId);
    const isAttemptHistory = visitedId.startsWith("attempt:");
    const parentId = isAttemptHistory ? (image ? "image-attempts" : generic ? "records" : "attempts")
      : record ? recordBucket(record, image, generic) : (generic ? "records" : image ? "image-attempts" : "review");
    const parent = itemsById.get(parentId);
    if (!parent) continue;
    childIds.add(visitedId);
    parent.children.push({
      id: visitedId,
      parentId,
      type: isAttemptHistory ? (image ? "image-attempt" : "attempt") : record?.kind || entry.type || "record",
      typeLabel: isAttemptHistory ? (image ? "形状尝试" : "范围尝试") : recordTypeLabel(record?.kind || entry.type),
      title: entry.title || record?.title || (isAttemptHistory ? image ? "形状尝试" : "范围尝试" : "复核记录"),
      summary: short(entry.summary || record?.summary || "已访问的记录；原记录内容暂不可用。", 190),
      contextLabel: short(entry.contextLabel || "", 90),
      time: entry.time || record?.time || "",
    });
  }

  // Keep record-bearing containers available when an old record exists, even
  // if the corresponding transient result state has since been cleared.
  const attemptParent = itemsById.get(image ? "image-attempts" : "attempts");
  const associatedIds = image ? ["image-explanation", "image-practice"] : ["explanation", "parameters", "draft"];
  return result.map(item => ({ ...item,
    children: item.children.map(child => ({ ...child, parentTitle: item.title })),
    relatedHistory: associatedIds.includes(item.id) && attemptParent ? attemptParent.children.map(child => ({ ...child, parentTitle: attemptParent.title })) : [],
  }));
}
