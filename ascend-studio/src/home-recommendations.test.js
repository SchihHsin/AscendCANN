import test from "node:test";
import assert from "node:assert/strict";
import { buildHomeSuggestions } from "./home-recommendations.js";

const learningTask = extra => ({ name: "学会图像输入预处理", project: "模型推理", kind: "learning", goal: "理解图像输入预处理", learningProfile: { goal: "学会图像输入预处理" }, ...extra });
const developmentTask = extra => ({ name: "AddCustom 精度异常", project: "CANN 自定义算子", kind: "development", ...extra });

test("学习与开发候选池相互隔离", () => {
  const tasks = [learningTask({}), developmentTask({})];
  const learning = buildHomeSuggestions({ tasks, mode: "learning" });
  const development = buildHomeSuggestions({ tasks, mode: "development" });
  assert.ok(learning.length && learning.every(item => item.mode === "learning" && item.taskName === "学会图像输入预处理"));
  assert.ok(development.length && development.every(item => item.mode === "development" && item.taskName === "AddCustom 精度异常"));
  assert.notEqual(learning[0].action.type, development[0].action.type);
});

test("事实不足时用明确标注的演示建议补足现存任务入口", () => {
  const tasks = [
    { name: "普通开发任务", kind: "development", goal: "整理构建条件", records: [{ title: "刚刚完成", summary: "已处理" }] },
  ];
  const suggestions = buildHomeSuggestions({ tasks, mode: "development" });
  assert.equal(suggestions.length, 3);
  assert.ok(suggestions.every(item => item.taskName === "普通开发任务" && /演示建议/.test(item.reason)));
  assert.ok(suggestions.every(item => item.evidence.some(fact => /演示场景候选/.test(fact.title))));
  assert.ok(suggestions.some(item => item.action.type === "task-create"));
  assert.ok(suggestions.filter(item => item.action.type === "development-material").every(item => item.action.materialId === "task-brief"));
});

test("已有诊断候选排在补位演示建议之前", () => {
  const task = developmentTask({});
  const suggestions = buildHomeSuggestions({ tasks: [task], mode: "development" });
  assert.equal(suggestions.length, 4);
  assert.equal(suggestions[0].type, "development-troubleshoot");
  assert.ok(suggestions.slice(1).every(item => item.priority <= 2));
});

test("首页默认因果线索引用近期结构化状态，演示候选明确说明未记录操作", () => {
  const [failure] = buildHomeSuggestions({ tasks: [learningTask({
    learningState: {
      path: [{ id: "channels" }, { id: "practice" }],
      profile: { goal: "学会图像输入预处理" },
      pathProfile: { goal: "学会图像输入预处理" },
      axes: [2, 0, 1], batch: true, understood: ["channels"],
      attempts: [{ id: "attempt-fail", snapshot: { axes: [2, 0, 1], batch: true }, profile: { goal: "学会图像输入预处理" }, path: [{ id: "channels" }, { id: "practice" }], passed: false, valid: true, dimensions: [1, 3, 224, 224], time: "10:30" }],
      checks: [], summaries: [],
    },
  })], mode: "learning" });
  assert.equal(failure.type, "learning-practice");
  assert.match(failure.activity, /最近跟练未通过.*1,3,224,224/);

  const demo = buildHomeSuggestions({ tasks: [developmentTask({})], mode: "development" }).find(item => item.type.startsWith("demo-"));
  assert.match(demo.activity, /依据现存目标「AddCustom 精度异常」/);
  assert.match(demo.activity, /近期操作、完成与验证状态未记录/);
});

test("无路径的学习推荐与纯补位卡明确展示已设定/现存目标", () => {
  const goal = "学会图像输入预处理";
  const task = learningTask({ goal, learningProfile: { goal } });
  const suggestions = buildHomeSuggestions({ tasks: [task], mode: "learning" });
  const path = suggestions.find(item => item.type === "learning-path");
  assert.match(path.activity, new RegExp(`已设定目标「${goal}」；尚无匹配的已确认路径`));

  const fill = suggestions.find(item => item.type.startsWith("demo-"));
  assert.match(fill.activity, new RegExp(`依据现存目标「${goal}」`));
  assert.match(fill.activity, /近期操作、完成与验证状态未记录/);
  assert.doesNotMatch(fill.activity, /刚刚|最近操作/);
});

test("通过练习待核对、开发快照变更和图像形状尝试显示具体触发状态", () => {
  const base = summarizedLearningTask();
  const learning = { ...base.learningState, understood: ["channels"], summaries: [], transfer: null, checks: [] };
  const pendingCheck = buildHomeSuggestions({ tasks: [{ ...base, learningState: learning, records: [] }], mode: "learning" }).find(item => item.type === "learning-practice");
  assert.match(pendingCheck.activity, /最近跟练已通过.*尚未关联输入检查.*1,3,224,224/);

  const attempted = { snapshot: { rows: "17", columns: "33", tileSize: "32", bounds: "full" }, code: "old" };
  const development = buildHomeSuggestions({ tasks: [developmentTask({ flowState: {
    rows: "18", columns: "33", tileSize: "32", bounds: "full", draftCode: "new draft", appliedCode: "new applied",
    attempts: [{ ...attempted, id: "old", time: "10:00" }], appliedAttempt: { ...attempted, id: "old" }, appliedAttemptId: "old",
  } })], mode: "development" });
  assert.match(development.find(item => item.type === "development-change-review").activity, /最近代码草案与既有尝试代码不同/);

  const image = buildHomeSuggestions({ tasks: [{ name: "图像推理调试", kind: "development", imageState: {
    axes: [0, 1, 2], batch: true, attempts: [{ id: "image-attempt", snapshot: { axes: [0, 1, 2], batch: true }, valid: true }],
  } }], mode: "development" }).find(item => item.type === "development-validation");
  assert.match(image.activity, /最近已尝试图像形状.*0,1,2.*batch 开启/);
});

test("AddCustom 静态演示背景不伪装成用户近期尝试，真实尝试优先显示", () => {
  const [fixture] = buildHomeSuggestions({ tasks: [developmentTask({})], mode: "development" });
  assert.match(fixture.activity, /演示依据：预置/);
  assert.doesNotMatch(fixture.activity, /最近示例尝试/);

  const [recorded] = buildHomeSuggestions({ tasks: [developmentTask({ flowState: {
    attempts: [{ id: "trial-17-33", snapshot: { rows: "17", columns: "33", tileSize: "32", bounds: "full" }, passed: false, time: "10:30" }],
  } })], mode: "development" });
  assert.match(recorded.activity, /最近示例尝试 \[17,33\].*未通过/);
});

test("首页保留三张以外的候选，暂缓后可继续补位", () => {
  const tasks = [
    learningTask({}),
    { ...learningTask({}), name: "协同生成图像推理前处理学习路径", goal: "围绕图像推理前处理目标整理学习路径。" },
  ];
  const suggestions = buildHomeSuggestions({ tasks, mode: "learning" });
  assert.equal(suggestions.length, 6);
  assert.equal(new Set(suggestions.map(item => item.id)).size, 6);
});

test("后续同条件成功抵消旧的失败练习", () => {
  const path = [{ id: "channels", skipped: false }, { id: "practice", skipped: false }];
  const profile = { goal: "输入维度", background: "Python", dailyMinutes: 20 };
  const snapshot = { axes: [2, 0, 1], batch: true };
  const task = learningTask({ learningState: {
    path, profile, pathProfile: { ...profile }, understood: ["channels"], axes: snapshot.axes, batch: snapshot.batch,
    attempts: [
      { id: "fail", snapshot, profile, path, passed: false, valid: true, dimensions: [1, 3, 224, 224] },
      { id: "pass", snapshot, profile, path, passed: true, valid: true, dimensions: [1, 3, 224, 224] },
    ], checks: [], summaries: [],
  } });
  const suggestions = buildHomeSuggestions({ tasks: [task], mode: "learning" });
  assert.ok(!suggestions.some(item => item.type === "learning-practice"));
});

test("AddCustom 示例通过结论对代码版本敏感", () => {
  const snapshot = { rows: "17", columns: "33", tileSize: "32", bounds: "full", mode: "inline" };
  const task = developmentTask({ flowState: {
    attempts: [{ id: "a1", snapshot, code: "old code", time: "10:00" }],
    appliedAttempt: { id: "a1", snapshot, code: "old code", time: "10:00" },
    draftCode: "new code", appliedCode: "new code", appliedAttemptId: "a1", validation: null,
  } });
  const suggestions = buildHomeSuggestions({ tasks: [task], mode: "development" });
  assert.ok(!suggestions.some(item => item.type === "development-validation"));
  assert.ok(suggestions.some(item => item.type === "development-troubleshoot"));
});

test("来源和原因指向结构化事实，示例结论带清楚边界", () => {
  const [suggestion] = buildHomeSuggestions({ tasks: [developmentTask({})], mode: "development" });
  assert.equal(suggestion.taskName, "AddCustom 精度异常");
  assert.match(suggestion.reason, /演示中/);
  assert.match(suggestion.reason, /根因未定/);
  assert.ok(suggestion.evidence.some(item => /固定演示背景/.test(item.summary)));
  assert.equal(suggestion.action.type, "development-material");
  assert.ok(suggestion.reason.length <= 32);
});

function summarizedLearningTask({ axes = [2, 0, 1], batch = true, transferAttempts = [] } = {}) {
  const path = [{ id: "channels", skipped: false }, { id: "practice", skipped: false }, { id: "check", skipped: false }];
  const profile = { goal: "学会图像输入预处理", background: "有 Python 基础", dailyMinutes: 30 };
  const snapshot = { axes, batch };
  const attempt = { id: "attempt-1", snapshot, profile, path, passed: true, valid: true, dimensions: [1, 3, 224, 224] };
  const check = { id: "check-1", attemptId: attempt.id, snapshot, passed: true };
  const summary = { id: "summary-1", attemptId: attempt.id, checkId: check.id, snapshot, path, profile };
  const sourceSignature = JSON.stringify({ attemptId: summary.attemptId, checkId: summary.checkId, profile: summary.profile, path: summary.path, dimensions: summary.dimensions });
  return learningTask({ learningState: { path, profile, pathProfile: profile, axes, batch, understood: ["channels"], attempts: [attempt], checks: [check], summaries: [summary], transfer: { sourceSummaryId: "summary-1", sourceSignature, snapshot: null, attempts: transferAttempts } }, records: [{ id: "summary-record", kind: "learning-summary", title: "学习小结", summary: "当前有效小结", data: summary }] });
}

test("当前迁移快照通过后撤下建议，当前输入变化后重新提示", () => {
  const base = summarizedLearningTask();
  const transferState = structuredClone(base.learningState);
  const transferSnapshot = { dimensions: [128, 256, 3], axes: [2, 0, 1], batch: true };
  transferState.transfer.snapshot = transferSnapshot;
  transferState.transfer.attempts = [{ sourceSummaryId: "summary-1", snapshot: transferSnapshot, passed: true }];
  assert.ok(!buildHomeSuggestions({ tasks: [{ ...base, learningState: transferState }], mode: "learning" }).some(item => item.type === "learning-transfer"));
  const changedAxes = [0, 2, 1];
  const changedSnapshot = { axes: changedAxes, batch: true };
  const changedPath = base.learningState.path;
  const changedProfile = base.learningState.profile;
  const changedAttempt = { ...base.learningState.attempts[0], id: "attempt-2", snapshot: changedSnapshot };
  const changedCheck = { ...base.learningState.checks[0], id: "check-2", attemptId: changedAttempt.id, snapshot: changedSnapshot };
  const changedSummary = { ...base.learningState.summaries[0], id: "summary-2", attemptId: changedAttempt.id, checkId: changedCheck.id, snapshot: changedSnapshot };
  const changed = { ...base, learningState: { ...base.learningState, axes: changedAxes, attempts: [changedAttempt], checks: [changedCheck], summaries: [changedSummary], transfer: { ...transferState.transfer, attempts: [{ sourceSummaryId: "summary-1", snapshot: transferSnapshot, passed: true }] } }, records: [{ id: "summary-record-2", kind: "learning-summary", title: "学习小结", summary: "当前有效小结", data: changedSummary }] };
  assert.ok(buildHomeSuggestions({ tasks: [changed], mode: "learning" }).some(item => item.type === "learning-transfer"));
});

test("通过输入检查后推荐保存小结，保存后再出现迁移挑战", () => {
  const base = summarizedLearningTask();
  const learningState = { ...base.learningState, summaries: [], transfer: null };
  const records = base.records.filter(record => record.kind !== "learning-summary");
  const [suggestion] = buildHomeSuggestions({ tasks: [{ ...base, learningState, records }], mode: "learning" });
  assert.equal(suggestion.type, "learning-summary");
  assert.equal(suggestion.action.type, "learning-summary");
  assert.equal(suggestion.actionLabel, "保存学习小结");
  assert.match(suggestion.reason, /尚未保存/);
});

test("跟练通过但理解节点未完成时，先提示补足理解", () => {
  const base = summarizedLearningTask();
  const learningState = { ...base.learningState, understood: [], summaries: [], transfer: null };
  const suggestions = buildHomeSuggestions({ tasks: [{ ...base, learningState, records: [] }], mode: "learning" });
  assert.ok(suggestions.some(item => item.type === "learning-lesson"));
  assert.ok(!suggestions.some(item => item.type === "learning-summary" || item.type === "learning-transfer"));
});

test("迁移结果仅在来源小结和当前迁移参数都匹配时完成", () => {
  const base = summarizedLearningTask();
  const transferSnapshot = { dimensions: [128, 256, 3], axes: [2, 0, 1], batch: true };
  const staleParams = { ...base.learningState, transfer: { ...base.learningState.transfer, snapshot: { ...transferSnapshot, axes: [0, 2, 1] }, attempts: [{ sourceSummaryId: "summary-1", snapshot: transferSnapshot, passed: true }] } };
  assert.ok(buildHomeSuggestions({ tasks: [{ ...base, learningState: staleParams }], mode: "learning" }).some(item => item.type === "learning-transfer"));
  const staleSource = { ...base.learningState, transfer: { ...base.learningState.transfer, sourceSummaryId: "old-summary", snapshot: transferSnapshot, attempts: [{ sourceSummaryId: "old-summary", snapshot: transferSnapshot, passed: true }] } };
  assert.ok(buildHomeSuggestions({ tasks: [{ ...base, learningState: staleSource }], mode: "learning" }).some(item => item.type === "learning-transfer"));
});

test("D3 对代码与参数变化提示旧快照失效", () => {
  const snapshot = { rows: "17", columns: "33", tileSize: "32", bounds: "full", mode: "inline" };
  const task = developmentTask({ flowState: {
    rows: "18", columns: "33", tileSize: "32", bounds: "full", draftCode: "new draft", appliedCode: "new applied",
    attempts: [{ id: "old", snapshot, code: "old code", time: "10:00" }],
    appliedAttempt: { id: "old", snapshot, code: "old code", time: "10:00" }, appliedAttemptId: "old",
  } });
  const item = buildHomeSuggestions({ tasks: [task], mode: "development" }).find(suggestion => suggestion.type === "development-change-review");
  assert.ok(item);
  assert.match(item.reason, /旧快照/);
  assert.equal(item.action.materialId, "draft");
  assert.ok(item.reason.length <= 32);
});

test("未应用示例和未应用图像副本不路由到不可用验证材料", () => {
  const addFlow = { rows: "17", columns: "33", tileSize: "32", bounds: "full", draftCode: "sample", attempts: [{ id: "a", snapshot: { rows: "17", columns: "33", tileSize: "32", bounds: "full", mode: "inline" }, code: "sample" }] };
  const add = buildHomeSuggestions({ tasks: [developmentTask({ flowState: addFlow })], mode: "development" }).find(item => item.type === "development-validation");
  assert.equal(add?.action.materialId, "parameters");
  const image = buildHomeSuggestions({ tasks: [{ name: "图像推理调试", kind: "development", imageState: { axes: [0, 1, 2], batch: true, attempts: [{ id: "i", snapshot: { axes: [0, 1, 2], batch: true }, valid: true }] } }], mode: "development" }).find(item => item.type === "development-validation");
  assert.equal(image?.action.materialId, "image-practice");
});
