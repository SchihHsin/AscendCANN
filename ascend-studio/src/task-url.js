import { LEARNING_PATH_GENERATION_TASK, LEARNING_TASK } from "./learning-data";
import { OFFICIAL_LEARNING_TASK } from "./official-learning-data";
import { LOG_DIAGNOSTIC_TASK } from "./prototype-data";
import { IMAGE_TASK } from "./useImageInference";

const TASK_URL_IDS = new Map([
  ["AddCustom 精度异常", "addcustom"],
  [LOG_DIAGNOSTIC_TASK, "log-triage"],
  ["Add batch dimension", "add-batch-dimension"],
  [IMAGE_TASK, "image-inference"],
  [LEARNING_PATH_GENERATION_TASK, "image-preprocessing-path"],
  [LEARNING_TASK, "image-preprocessing"],
  [OFFICIAL_LEARNING_TASK, "resnet50"],
  ["Model preprocessing", "model-preprocessing"],
  ["Vision model test", "vision-model-test"],
  ["Android", "android"],
  ["Super assistant", "super-assistant"],
  ["Maestro", "maestro"],
]);
const TASK_NAMES_BY_URL_ID = new Map([...TASK_URL_IDS].map(([taskName, urlId]) => [urlId, taskName]));
const LEGACY_TASK_ALIASES = Object.freeze({
  learning: LEARNING_TASK,
  development: IMAGE_TASK,
});

export function resolveTaskUrlValue(value, taskNames) {
  if (typeof value !== "string" || !value) return null;
  const names = taskNames instanceof Set ? taskNames : new Set(taskNames || []);
  const taskName = LEGACY_TASK_ALIASES[value] || TASK_NAMES_BY_URL_ID.get(value) || value;
  return names.has(taskName) ? taskName : null;
}

export function taskUrlIdentifier(taskName) {
  return TASK_URL_IDS.get(taskName) || taskName;
}
