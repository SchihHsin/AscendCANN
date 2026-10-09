import { useEffect, useRef, useState } from "react";

export const FLOW_SOURCE = "https://schihhsin.github.io/AscendCANN/cann-dashboard/ploy-interaction-lab/learning-canvas-story/index.html#19";

const PHASES = ["understand", "try", "diff", "validate"];
const MODES = ["inline", "isolated"];
const PARAMETER_NAMES = ["rows", "columns", "tileSize"];
const uid = () => crypto.randomUUID();
const now = () => new Date().toLocaleTimeString("zh-CN", {
  hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Shanghai",
});

function sampleCode({ rows, columns, tileSize, bounds }) {
  const valid = bounds === "valid";
  return [
    "// 示例工作副本：仅用于说明索引范围，不代表项目源码。",
    `const int rows = ${rows};`,
    `const int columns = ${columns};`,
    `const int tileSize = ${tileSize};`,
    "const int total = rows * columns;",
    "const int blocks = (total + tileSize - 1) / tileSize;",
    "",
    "for (int block = 0; block < blocks; ++block) {",
    "  const int baseIndex = block * tileSize;",
    ...(valid ? ["  const int validCount = std::min(tileSize, total - baseIndex);"] : []),
    `  for (int offset = 0; offset < ${valid ? "validCount" : "tileSize"}; ++offset) {`,
    "    const int index = baseIndex + offset;",
    "    // 此处仅展示读写索引，不实现或验证 AddCustom 的计算。",
    "  }",
    "}",
  ].join("\n");
}

export const SAMPLE_ORIGINAL_CODE = sampleCode({ rows: "17", columns: "33", tileSize: "32", bounds: "full" });

const initialState = () => ({
  resetVersion: 0,
  phase: "understand",
  mode: "inline",
  rows: "17",
  columns: "33",
  tileSize: "32",
  bounds: "full",
  explanationOpen: true,
  pinned: false,
  compare: false,
  attempts: [],
  selectedAttemptId: null,
  draftCode: SAMPLE_ORIGINAL_CODE,
  proposedCode: null,
  proposalBaseline: null,
  appliedCode: null,
  appliedAttemptId: null,
  canUndoApply: false,
  validation: null,
  archived: false,
  collapsed: false,
  busy: false,
  error: "",
  notice: "",
});

function inputSnapshot(state) {
  return { rows: state.rows, columns: state.columns, tileSize: state.tileSize, bounds: state.bounds, mode: state.mode };
}

function editableSnapshot(state) {
  return { rows: state.rows, columns: state.columns, tileSize: state.tileSize, bounds: state.bounds, draftCode: state.draftCode };
}

function validParameters(snapshot) {
  const parameters = PARAMETER_NAMES.map((name) => Number(snapshot[name]));
  if (PARAMETER_NAMES.some((name) => !/^\d+$/.test(String(snapshot[name]).trim())) ||
      parameters.some((value) => !Number.isSafeInteger(value) || value < 1)) {
    return "请输入大于 0 的整数行数、列数和块大小。";
  }
  const [rows, columns, tileSize] = parameters;
  const total = rows * columns;
  if (!Number.isSafeInteger(total) || !Number.isSafeInteger(Math.ceil(total / tileSize) * tileSize)) {
    return "输入过大，无法在浏览器中准确表示索引；请使用较小的算例。";
  }
  return "";
}

function rangeCheck(snapshot) {
  const rows = Number(snapshot.rows);
  const columns = Number(snapshot.columns);
  const tileSize = Number(snapshot.tileSize);
  const total = rows * columns;
  const blocks = Math.ceil(total / tileSize);
  const tail = total % tileSize;
  const covered = snapshot.bounds === "valid" ? total : blocks * tileSize;
  const outOfRange = covered - total;
  const passed = outOfRange === 0;
  return {
    rows: String(snapshot.rows),
    columns: String(snapshot.columns),
    tileSize: String(snapshot.tileSize),
    bounds: snapshot.bounds,
    total,
    blocks,
    tail,
    maxIndex: covered - 1,
    outOfRange,
    passed,
    result: passed ? "浏览器范围检查通过" : `浏览器范围检查发现 ${outOfRange} 个索引超出有效范围`,
    isDemo: true,
  };
}

export function useTaskFlow({ onRecord } = {}) {
  const [state, setState] = useState(initialState);
  const latest = useRef(state);
  const timer = useRef(null);
  const proposalAttempt = useRef(null);
  const appliedAttempt = useRef(null);
  const applicationHistory = useRef([]);
  const modeDrafts = useRef({ inline: editableSnapshot(initialState()), isolated: null });
  const recordCallback = useRef(onRecord);
  recordCallback.current = onRecord;

  const update = (change) => {
    const previous = latest.current;
    const next = { ...previous, ...(typeof change === "function" ? change(previous) : change) };
    latest.current = next;
    setState(next);
  };
  const cancelPending = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  const record = (title, summary, kind) => recordCallback.current?.(title, summary, kind, true);
  const schedule = (callback) => {
    if (timer.current !== null || latest.current.busy) return;
    update({ busy: true, error: "", notice: "" });
    timer.current = setTimeout(() => {
      timer.current = null;
      callback();
    }, 250);
  };

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  const open = (phase) => {
    if (!PHASES.includes(phase)) return;
    update({ phase, archived: false, collapsed: false, error: "", notice: "" });
  };
  const setMode = (mode) => {
    if (!MODES.includes(mode) || latest.current.mode === mode) return;
    const current = latest.current;
    modeDrafts.current[current.mode] = editableSnapshot(current);
    const target = modeDrafts.current[mode] || { ...editableSnapshot(current) };
    modeDrafts.current[mode] = target;
    update({ ...target, mode, error: "", notice: mode === "isolated" ? "已打开隔离示例副本，参数与草案独立保留；尝试和示例应用记录仍属于本任务。" : "已恢复当前任务内的参数与草案；隔离示例副本继续保留，真实项目未被修改。" });
  };
  const setParameter = (name, value) => {
    if (!PARAMETER_NAMES.includes(name)) return;
    const previous = latest.current;
    const next = { ...previous, [name]: String(value) };
    const generated = !previous.draftCode || previous.draftCode === sampleCode(inputSnapshot(previous));
    update({ [name]: String(value), draftCode: generated ? sampleCode(inputSnapshot(next)) : previous.draftCode, error: "", notice: "" });
  };
  const setBounds = (bounds) => {
    if (bounds !== "full" && bounds !== "valid") return;
    const previous = latest.current;
    const next = { ...previous, bounds };
    const generated = !previous.draftCode || previous.draftCode === sampleCode(inputSnapshot(previous));
    update({ bounds, draftCode: generated ? sampleCode(inputSnapshot(next)) : previous.draftCode, error: "", notice: "" });
  };
  const toggleExplanation = () => update((previous) => ({ explanationOpen: !previous.explanationOpen }));
  const togglePin = () => update((previous) => ({ pinned: !previous.pinned }));
  const toggleCompare = () => update((previous) => ({ compare: !previous.compare }));

  const runTrial = () => {
    if (latest.current.busy) return;
    const snapshot = inputSnapshot(latest.current);
    const error = validParameters(snapshot);
    if (error) { update({ error, phase: "try" }); return; }
    const code = latest.current.draftCode || sampleCode(snapshot);
    schedule(() => {
      const attempt = { id: uid(), time: now(), snapshot, mode: snapshot.mode, code, ...rangeCheck(snapshot) };
      proposalAttempt.current = null;
      update((previous) => ({ phase: "try", attempts: [...previous.attempts, attempt], selectedAttemptId: attempt.id, draftCode: previous.draftCode || code, proposedCode: null, busy: false, notice: `${attempt.result}。仅按输入参数与范围策略演算；未编译 C++，未验证精度或根因。` }));
      record("示例索引范围检查", `[${snapshot.rows},${snapshot.columns}]，块大小 ${snapshot.tileSize}，${snapshot.bounds === "valid" ? "有效元素范围" : "完整块范围"}：${attempt.result}。仅浏览器算例，未验证真实项目或 NPU。`, "trial");
    });
  };

  const selectAttempt = (id) => {
    if (!latest.current.attempts.some((attempt) => attempt.id === id)) return;
    proposalAttempt.current = null;
    update({ selectedAttemptId: id, proposedCode: null, error: "", notice: "已选择这次尝试，可对照当时的参数、代码和结果。" });
  };
  const prepareDiff = () => {
    if (latest.current.busy) return;
    const attempt = latest.current.attempts.find((item) => item.id === latest.current.selectedAttemptId) || latest.current.attempts.at(-1);
    if (!attempt) { update({ phase: "try", error: "请先运行一次示例范围检查，再查看这次尝试的修改建议。" }); return; }
    proposalAttempt.current = attempt;
    update({ phase: "diff", selectedAttemptId: attempt.id, proposalBaseline: latest.current.appliedCode || SAMPLE_ORIGINAL_CODE, proposedCode: sampleCode(attempt.snapshot), error: "", notice: attempt.bounds === "full" ? "所选尝试保留整块访问策略，尚未形成范围修正。提案仅对应示例，真实项目根因仍未知。" : "示例提案根据所选尝试的参数与范围策略生成；不会修改用户附件或真实项目文件。" });
  };
  const editDraft = (code) => {
    cancelPending();
    proposalAttempt.current = null;
    appliedAttempt.current = null;
    applicationHistory.current = [];
    update({ draftCode: String(code), proposedCode: null, appliedCode: null, appliedAttemptId: null, canUndoApply: false, validation: null, busy: false, error: "", notice: "代码草稿已更新。原提案与示例应用状态已失效；范围演算仍由参数和范围策略决定，不执行编辑的 C++。" });
  };
  const confirmApply = () => {
    if (latest.current.busy) return;
    const attempt = proposalAttempt.current;
    if (!latest.current.proposedCode || !attempt) { update({ error: "请先生成并审阅示例 Diff。" }); return; }
    const code = latest.current.proposedCode;
    if (code === (latest.current.appliedCode || SAMPLE_ORIGINAL_CODE)) { update({ error: "提案没有新增改动，请返回继续试改。" }); return; }
    applicationHistory.current.push({
      appliedCode: latest.current.appliedCode,
      appliedAttemptId: latest.current.appliedAttemptId,
      validation: latest.current.validation,
      attempt: appliedAttempt.current,
    });
    appliedAttempt.current = { ...attempt, code, snapshot: { ...attempt.snapshot } };
    update({ phase: "validate", appliedCode: code, appliedAttemptId: attempt.id, canUndoApply: true, validation: null, error: "", notice: "已写入浏览器中的示例工作副本。用户附件与真实项目文件没有被修改；项目和 NPU 验证仍待执行。" });
    record("确认应用示例修改", `已将尝试 ${attempt.time} 的示例提案应用到浏览器工作副本，输入 [${attempt.rows},${attempt.columns}]。未写入真实项目。`, "apply");
  };
  const undoApply = () => {
    const previous = applicationHistory.current.pop();
    if (!previous) return;
    cancelPending();
    appliedAttempt.current = previous.attempt;
    const summary = previous.appliedCode
      ? "已撤销最近一次示例应用，恢复上一份浏览器工作副本、对应尝试和已有范围复核记录。草稿与尝试历史仍保留；真实项目没有被修改。"
      : "已撤销最近一次示例应用，浏览器工作副本恢复为尚未应用的状态。草稿与尝试历史仍保留；真实项目没有被修改。";
    update({ phase: previous.appliedCode ? "validate" : "diff", appliedCode: previous.appliedCode, appliedAttemptId: previous.appliedAttemptId, validation: previous.validation, canUndoApply: applicationHistory.current.length > 0, busy: false, error: "", notice: summary });
    record("撤销示例应用", summary, "undo-apply");
  };
  const cancelDiff = () => {
    proposalAttempt.current = null;
    update({ phase: "try", proposedCode: null, error: "", notice: "已取消这次示例提案，草稿与尝试记录仍保留。" });
  };
  const runValidation = () => {
    if (latest.current.busy) return;
    const applied = appliedAttempt.current;
    if (!latest.current.appliedCode || !applied) { update({ phase: "diff", error: "请先确认应用示例修改，再检查示例工作副本。" }); return; }
    const code = latest.current.appliedCode;
    const snapshot = { ...applied.snapshot };
    schedule(() => {
      const checks = [
        { label: "对照输入 [16,32]", ...rangeCheck({ ...snapshot, rows: "16", columns: "32" }) },
        { label: `本次输入 [${snapshot.rows},${snapshot.columns}]`, ...rangeCheck(snapshot) },
      ];
      const passed = checks.every((check) => check.passed);
      const summary = `${passed ? "两组示例输入的索引范围均通过" : "示例输入仍存在超出范围的索引"}。仅浏览器范围演算；未编译或执行 C++，未检查精度，真实项目与 NPU 仍待运行。`;
      const validation = { id: uid(), time: now(), attemptId: applied.id, code, bounds: snapshot.bounds, passed, checks, summary, isDemo: true };
      update({ phase: "validate", validation, busy: false, error: "", notice: summary });
      record("示例工作副本范围复核", summary, "validation");
    });
  };
  const archive = () => update({ archived: true, notice: "已收纳当前任务内容；参数、尝试、提案和验证记录仍可恢复。" });
  const restore = () => update({ archived: false, notice: "已恢复同一份任务内容及状态。" });
  const toggleCollapse = () => update((previous) => ({ collapsed: !previous.collapsed }));
  const reset = () => {
    cancelPending();
    proposalAttempt.current = null;
    appliedAttempt.current = null;
    applicationHistory.current = [];
    modeDrafts.current = { inline: editableSnapshot(initialState()), isolated: null };
    update({ ...initialState(), resetVersion: latest.current.resetVersion + 1 });
  };

  return {
    state,
    actions: { open, setMode, setParameter, setBounds, toggleExplanation, togglePin, toggleCompare, runTrial, selectAttempt, prepareDiff, editDraft, confirmApply, undoApply, cancelDiff, runValidation, archive, restore, toggleCollapse, reset },
  };
}
