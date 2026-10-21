export const LEARNING_TASK = "学会图像输入预处理";
export const DEFAULT_LEARNING_PROFILE = { goal: LEARNING_TASK, background: "有 Python 基础，第一次接触模型输入", dailyMinutes: 30 };
export const LEARNING_NODES = [
  { id: "environment", title: "准备学习环境", minutes: 5, description: "了解示例的输入与运行边界", optional: true },
  { id: "channels", title: "理解 RGB 与输入维度", minutes: 8, description: "看懂 HWC、CHW 与 batch 的含义" },
  { id: "practice", title: "跟练维度转换", minutes: 12, description: "调整轴顺序，保留失败与成功的尝试" },
  { id: "check", title: "核对输入并保存", minutes: 5, description: "明确核对本次输入，留下可恢复的学习记录" },
];
export const LEARNING_MATERIALS = [
  { id: "learning-goal", title: "学习目标与基础", type: "preview", category: "reference", groupId: "learning" },
  { id: "learning-path", title: "我的学习路径", type: "preview", category: "reference", groupId: "learning" },
  { id: "learning-lesson", title: "图像与输入维度讲解", type: "preview", category: "explain", groupId: "learning" },
  { id: "learning-practice", title: "维度转换跟练", type: "code", category: "experiment", groupId: "learning" },
  { id: "learning-check", title: "本次输入检查", type: "preview", category: "check", groupId: "learning" },
  { id: "learning-summary", title: "学习记录与成果", type: "preview", category: "change", groupId: "learning" },
];
export const LEARNING_SEGMENTS = [
  { time: 0, focus: "channels", title: "RGB 通道", caption: "彩色图像的每个像素包含 R、G、B 三个值，读入形状为 HWC [224,224,3]。" },
  { time: 20, focus: "layout", title: "HWC → CHW", caption: "轴 0、1、2 分别为 H、W、C；transpose(2,0,1) 将通道移到最前，得到 CHW [3,224,224]。" },
  { time: 40, focus: "batch", title: "加入 batch", caption: "在 CHW 前加入样本维度 N=1，得到示例所需的 NCHW [1,3,224,224]。" },
];
export function getLearningShape({ axes = [0, 1, 2], batch = false } = {}) {
  const valid = axes.length === 3 && axes.every(axis => [0, 1, 2].includes(axis)) && new Set(axes).size === 3;
  const dimensions = valid ? [...(batch ? [1] : []), ...axes.map(axis => [224, 224, 3][axis])] : [];
  const labels = valid ? [...(batch ? ["N"] : []), ...axes.map(axis => ["H", "W", "C"][axis])] : [];
  return { valid, dimensions, labels, passed: valid && batch && axes.join(",") === "2,0,1" };
}
export function getTransferShape({ dimensions = [128, 256, 3], axes = [0, 1, 2], batch = false } = {}) {
  const valid = dimensions.length === 3 && dimensions.every(value => Number.isFinite(value) && value > 0) && axes.length === 3 && axes.every(axis => [0, 1, 2].includes(axis)) && new Set(axes).size === 3;
  const outputDimensions = valid ? [...(batch ? [1] : []), ...axes.map(axis => dimensions[axis])] : [];
  const labels = valid ? [...(batch ? ["N"] : []), ...axes.map(axis => ["H", "W", "C"][axis])] : [];
  return { valid, dimensions: outputDimensions, labels, passed: valid && axes.join(",") === "2,0,1" && batch };
}
export function getTransferCode({ dimensions = [128, 256, 3], axes = [2, 0, 1], batch = true } = {}) {
  return [`# 输入：RGB 图像，HWC [${dimensions.join(", ")}]`, "import numpy as np", `image = np.zeros((${dimensions.join(", ")}), dtype=np.float32)`, `transformed = image.transpose(${axes.join(", ")})`, `input_data = ${batch ? "transformed[None, ...]" : "transformed"}`, "print(input_data.shape)", `# 目标输出：(${batch ? "1, " : ""}${dimensions[2]}, ${dimensions[0]}, ${dimensions[1]})`].join("\n");
}
export function getLearningCode({ axes = [0, 1, 2], batch = false } = {}) {
  return ["# 输入：RGB 图像，HWC [224,224,3]", "import numpy as np", "image = np.zeros((224, 224, 3), dtype=np.float32)", `transformed = image.transpose(${axes.join(", ")})`, `input_data = ${batch ? "transformed[None, ...]" : "transformed"}`, "print(input_data.shape)", "# 目标输出：(1, 3, 224, 224)"].join("\n");
}
