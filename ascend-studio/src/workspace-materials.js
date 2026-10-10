import { IMAGE_MATERIALS } from "./useImageInference";

export const MATERIAL_DEFINITIONS = Object.freeze({
  ...Object.fromEntries(IMAGE_MATERIALS.map(item => [item.id, item])),
  source: { id: "source", type: "code", title: "索引范围示例" },
  draft: { id: "draft", type: "code", title: "示例工作副本" },
  evidence: { id: "evidence", type: "preview", title: "现场与判断" },
  explanation: { id: "explanation", type: "preview", title: "线索解释" },
  parameters: { id: "parameters", type: "preview", title: "参数与范围策略" },
  attempts: { id: "attempts", type: "preview", title: "尝试记录" },
  diff: { id: "diff", type: "diff", title: "示例修改预览" },
  validation: { id: "validation", type: "preview", title: "示例范围复核" },
  precision: { id: "precision", type: "preview", title: "误差核对" },
  review: { id: "review", type: "preview", title: "复核记录" },
  reference: { id: "reference", type: "browser", title: "Ascend C 文档" },
  "task-brief": { id: "task-brief", type: "preview", title: "任务简报" },
  canvas: { id: "canvas", type: "canvas", title: "画布" },
});

export function getMaterialMeta(id, options = {}) {
  const materialId = typeof id === "string" ? id.trim() : "";
  const defined = MATERIAL_DEFINITIONS[materialId];
  const title = typeof options.title === "string" && options.title.trim()
    ? options.title.trim()
    : defined?.title || (materialId.startsWith("record:") ? "复核记录" : "任务材料");
  const allowedTypes = ["code", "preview", "browser", "diff"];
  const type = materialId === "canvas" ? "canvas"
    : allowedTypes.includes(options.type) ? options.type : defined?.type || "preview";
  return { id: materialId, title, type };
}
