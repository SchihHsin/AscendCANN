import { compositionFields } from "./home-composition.js";

const fieldById = new Map(compositionFields.map(field => [field.id, field]));

function unique(items) {
  return [...new Set(items)];
}

function fallbackStep(field, index) {
  return {
    id: field.id,
    title: field.pathTitle || field.title,
    description: field.pathDescription || field.hint,
    tone: field.tone,
    order: index,
  };
}

export function buildCompositionLearningPlan({ fieldIds = [], connectionPath = [], prompt = "" } = {}) {
  const orderedIds = unique([...connectionPath, ...fieldIds]);
  const fields = orderedIds.map(id => fieldById.get(id)).filter(Boolean);
  const topics = fields.filter(field => field.role === "topic");
  const goals = fields.filter(field => field.role === "goal");
  const selectedContent = new Set(fields.filter(field => field.role === "content").map(field => field.id));
  const inferredTopicId = goals[0]?.topicId || fields.find(field => field.role === "content")?.topicId;
  const firstField = fields[0];
  const mainTopic = firstField?.role === "topic"
    ? firstField
    : fieldById.get(firstField?.topicId || inferredTopicId) || topics[0];

  const pathOwners = goals.length
    ? goals
    : topics.length
      ? topics
      : [fields.find(field => field.goalId && fieldById.has(field.goalId))]
        .map(field => field ? fieldById.get(field.goalId) : null)
        .filter(Boolean);

  const defaultSteps = [];
  const seenStepIds = new Set();
  pathOwners.forEach(owner => {
    (owner.defaultSteps || []).forEach(step => {
      const stepId = step.id || `${owner.id}-${defaultSteps.length}`;
      if (seenStepIds.has(stepId)) return;
      seenStepIds.add(stepId);
      defaultSteps.push(step);
    });
  });
  const pathSteps = defaultSteps.length
    ? defaultSteps
    : fields.filter(field => field.role === "content").map((field, index) => fallbackStep(field, index));

  const steps = pathSteps.map((stepDefinition, index) => {
    const source = fieldById.get(stepDefinition.id);
    const selectedSource = source && selectedContent.has(source.id) ? source : null;
    return {
      id: stepDefinition.id || `learning-step-${index + 1}`,
      title: stepDefinition.title || source?.title || "继续学习",
      description: stepDefinition.description || source?.hint || "沿着当前方向继续探索，并通过实践核对结果。",
      tone: stepDefinition.tone || source?.tone || "blue",
      fields: selectedSource
        ? [{ id: selectedSource.id, title: selectedSource.title, tone: selectedSource.tone }]
        : [],
    };
  });

  const goalTitle = goals.length
    ? unique(goals.map(field => field.title)).join(" · ")
    : mainTopic?.title || fields[0]?.title || "学习方向";
  const linkedTopics = topics
    .filter(field => field.id !== mainTopic?.id)
    .map(field => field.title);
  const description = linkedTopics.length
    ? `从${mainTopic?.title || goalTitle}开始，继续连接${linkedTopics.join("、")}，形成一条跨主题学习路径。`
    : `沿着${goalTitle}展开，从核心概念逐步走向实践与验证。`;

  return {
    title: `${goalTitle} · 学习路径`,
    goalTitle,
    description,
    prompt: String(prompt || "").trim(),
    sourceFieldCount: fields.length,
    connectionPath: orderedIds,
    steps: steps.map(({ order, ...step }, index) => ({ ...step, number: index + 1 })),
  };
}
