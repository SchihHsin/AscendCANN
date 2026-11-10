import { compositionFields } from "./home-composition.js";

const actionsByRole = {
  issue: "理解问题现象",
  context: "梳理训练条件",
  metric: "建立评估基线",
  constraint: "明确优化边界",
  focus: "学习瓶颈定位",
  strategy: "理解调优策略",
  verification: "设计对照验证",
};

const fieldById = new Map(compositionFields.map(field => [field.id, field]));

function unique(items) {
  return [...new Set(items)];
}

export function buildCompositionLearningPlan({ fieldIds = [], connectionPath = [], prompt = "" } = {}) {
  const orderedIds = unique([...connectionPath, ...fieldIds]);
  const fields = orderedIds.map(id => fieldById.get(id)).filter(Boolean);
  const goalField = fields.find(field => field.role === "goal");
  const goalTitle = goalField?.title || "训练调优";
  const selectedSteps = [];
  fields.filter(field => field.role !== "goal").forEach(field => {
    const previous = selectedSteps.at(-1);
    if (previous?.role === field.role) {
      previous.fields.push({ id: field.id, title: field.title, tone: field.tone });
      previous.title = `${actionsByRole[field.role] || "继续探索"}：${previous.fields.map(item => item.title).join("、")}`;
      previous.description = `${previous.description}；${field.hint}`;
      return;
    }
    selectedSteps.push({
      id: field.id,
      role: field.role,
      title: `${actionsByRole[field.role] || "继续探索"}：${field.title}`,
      description: field.hint,
      fields: [{ id: field.id, title: field.title, tone: field.tone }],
      tone: field.tone,
      sourceIndex: orderedIds.indexOf(field.id),
    });
  });

  const steps = [
    {
      id: "learning-goal",
      title: `明确学习目标：${goalTitle}`,
      description: goalField?.hint || "先说清希望提升的训练表现，以及想掌握的分析与优化方法。",
      fields: goalField ? [{ id: goalField.id, title: goalField.title, tone: goalField.tone }] : [],
      tone: goalField?.tone || "blue",
      sourceIndex: -1,
    },
    ...selectedSteps,
  ];

  if (!selectedSteps.length) {
    steps.push({
      id: "training-basics",
      title: "认识训练效率的关键影响因素",
      description: "从训练循环、数据供给与设备执行过程建立调优所需的基础认识。",
      fields: [],
      tone: "teal",
      sourceIndex: Number.MAX_SAFE_INTEGER - 1,
    });
  }

  if (!fields.some(field => field.role === "verification")) {
    const measures = fields.filter(field => ["metric", "constraint", "strategy"].includes(field.role));
    steps.push({
      id: "contrast-validation",
      title: "设计对照实验，检查优化效果",
      description: measures.length
        ? `围绕${measures.map(field => field.title).join("、")}设置可比较的训练条件，判断优化是否达到目标。`
        : "固定训练条件，比较优化前后的指标变化，并保留精度与收敛约束。",
      fields: [],
      tone: "coral",
      sourceIndex: Number.MAX_SAFE_INTEGER,
    });
  }

  const orderedSteps = [steps[0], ...steps.slice(1).sort((a, b) => a.sourceIndex - b.sourceIndex)];
  return {
    title: `${goalTitle} · 学习路径`,
    goalTitle,
    prompt: String(prompt || "").trim(),
    sourceFieldCount: fields.length,
    connectionPath: orderedIds,
    steps: orderedSteps.map(({ sourceIndex, ...step }, index) => ({ ...step, number: index + 1 })),
  };
}
