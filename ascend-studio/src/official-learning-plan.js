import { OFFICIAL_LEARNING_STAGES } from "./official-learning-data.js";

const object = value => value && typeof value === "object" && !Array.isArray(value);

export function officialPathOrder(stages = OFFICIAL_LEARNING_STAGES) {
  return Object.fromEntries(stages.map(stage => [stage.id, stage.children.map(node => node.id)]));
}

export function normalizeOfficialPersonalPlan(saved, stages = OFFICIAL_LEARNING_STAGES) {
  if (!object(saved) || !["draft", "confirmed"].includes(saved.status)) return null;
  const current = officialPathOrder(stages);
  const savedOrder = object(saved.orderByStage) ? saved.orderByStage : {};
  const orderByStage = Object.fromEntries(stages.map(stage => {
    const allowed = new Set(current[stage.id]);
    const retained = Array.isArray(savedOrder[stage.id]) ? savedOrder[stage.id].filter(id => allowed.has(id)) : [];
    const unique = [...new Set(retained)];
    return [stage.id, [...unique, ...current[stage.id].filter(id => !unique.includes(id))]];
  }));
  return { status: saved.status, orderByStage };
}

export function moveOfficialLearningStep(plan, stageId, sourceId, targetId, stages = OFFICIAL_LEARNING_STAGES) {
  const stage = stages.find(item => item.id === stageId);
  if (!stage || sourceId === targetId || !stage.children.some(item => item.id === sourceId) || !stage.children.some(item => item.id === targetId)) return null;
  const normalized = normalizeOfficialPersonalPlan(plan, stages);
  if (!normalized || normalized.status !== "draft") return null;
  const order = [...normalized.orderByStage[stageId]];
  const sourceIndex = order.indexOf(sourceId);
  const targetIndex = order.indexOf(targetId);
  if (sourceIndex < 0 || targetIndex < 0) return null;
  order.splice(sourceIndex, 1);
  order.splice(targetIndex, 0, sourceId);
  if (order.every((id, index) => id === normalized.orderByStage[stageId][index])) return null;
  return { ...normalized, orderByStage: { ...normalized.orderByStage, [stageId]: order } };
}
