export const initialGroups = [
  {
    id: "operator",
    name: "CANN 自定义算子",
    tasks: ["AddCustom 精度异常", "Add batch dimension"],
  },
  {
    id: "inference",
    name: "模型推理",
    tasks: ["Image inference debugging", "Model preprocessing", "Vision model test"],
  },
  {
    id: "other",
    name: "其他项目",
    tasks: ["Android", "Super assistant", "Maestro"],
  },
];

export const taskDetails = {
  "AddCustom 精度异常": {
    project: "CANN 自定义算子",
    goal: "定位不同输入形状下的精度差异，保留判断依据并选择下一步检查。",
    question: "为什么 [16,32] 通过，[17,33] 失败？我改过编译参数，还是在 custom_op.cpp:128 报错。",
    reply: "目前确认：[16,32] 可以通过，[17,33] 失败；报错为 precision mismatch，位置在 custom_op.cpp:128。修改编译参数后，错误仍出现在同一位置。\n\n现有信息只能说明失败与非整块输入同时出现。尾块边界是值得核对的线索，但还不能据此认定根因；也可能与索引范围或精度计算有关。\n\n编译参数的调整没有带来新的定位信号。下一步应从重复尝试配置转向核对代码路径和误差证据；尾块判断目前只决定排查顺序，不能当作结论。\n\n还需要核对两次运行除输入形状外的条件是否一致，并查看失败元素的逐项误差。当前没有这些记录，所以判断暂时停在“优先核查尾块路径”，不归因到具体实现。\n\n建议先只读检查对应循环的索引范围和有效元素数；如果没有发现边界异常，再补充逐元素误差证据。当前还没有真实 NPU 验证结果。",
    status: "active",
  },
  "Add batch dimension": {
    project: "CANN 自定义算子",
    goal: "明确 Add 算子的批量维度约定和需要覆盖的输入形状。",
    question: "给 Add 算子增加 batch dimension，先帮我整理需要确认的设计条件。",
    reply: "先约定 batch dimension 的位置、输入与输出形状、是否允许广播，以及各维度的有效范围。随后可以列出最小输入、整块输入和非整块输入的检查清单。\n\n这里还没有算子代码或运行记录，当前只建立任务简报；实现是否正确需要后续代码与验证证据。",
    status: "waiting",
  },
  "Image inference debugging": {
    project: "模型推理",
    goal: "区分图像推理问题来自输入处理、模型转换还是推理执行。",
    question: "图像推理结果不符合预期，先从哪里检查？",
    reply: "先保留一张可复现的输入图像、预期输出和实际输出，再对齐预处理、模型版本及运行环境。应分别记录每个阶段的输入形状、数据类型和报错，避免把不同阶段的问题混在一起。\n\n尚未提供本任务的运行结果，因此目前可以整理排查顺序，不能确认故障位置。",
    status: "waiting",
  },
  "Model preprocessing": {
    project: "模型推理",
    goal: "对齐模型要求的尺寸、颜色通道、归一化和数据类型。",
    question: "帮我确认模型预处理需要哪些信息。",
    reply: "需要模型的输入约定，以及当前 resize、通道顺序、归一化、布局和数据类型设置。用同一张图像保存各步骤的中间结果，才能比较实现是否符合约定。\n\n当前没有模型文件或预处理记录，先补齐这些条件，再形成可检查的步骤。",
    status: "waiting",
  },
  "Vision model test": {
    project: "模型推理",
    goal: "整理视觉模型的样本、输出判据和版本条件。",
    question: "为视觉模型准备一份可复查的验证计划。",
    reply: "先定义任务类型与输出判据，固定模型、环境和预处理条件，再列出代表性样本、边界样本及失败样本。每条记录应保存输入、预期输出、实际输出和适用条件。\n\n这里的计划尚未执行，不能由计划推断模型已经通过验证。",
    status: "waiting",
  },
  Android: {
    project: "其他项目",
    goal: "整理 Android 项目的目标、环境和待解决问题。",
    question: "先帮我整理 Android 任务的上下文。",
    reply: "先补充目标功能、项目入口、系统与工具版本，以及当前阻碍。若已有错误，保存复现步骤、完整报错和已尝试动作，再决定下一步。\n\n本任务目前只有简报，没有构建或设备运行证据。",
    status: "waiting",
  },
  "Super assistant": {
    project: "其他项目",
    goal: "定义助手任务的输入、权限和完成条件。",
    question: "我想整理一个助手任务，应该先明确什么？",
    reply: "先明确用户目标、可用资料、允许执行的动作和完成条件，再决定是否需要连接外部工具。若涉及跨项目内容，应说明每份资料的来源和可用范围。\n\n当前只建立任务上下文，尚未连接外部服务或执行实际操作。",
    status: "waiting",
  },
  Maestro: {
    project: "其他项目",
    goal: "记录项目目标和下一步需要的材料。",
    question: "帮我建立 Maestro 项目的任务简报。",
    reply: "请先描述这个项目要完成什么、当前有哪些文件和已经遇到什么问题。可以从一项具体动作开始，为它记录输入、预期产物和判断完成的方法。\n\n项目名称不足以确定技术栈或运行方式，暂不推断实现细节。",
    status: "waiting",
  },
};

export const capabilities = [
  {
    id: "environment",
    name: "环境指纹",
    category: "上下文",
    description: "整理芯片、CANN、驱动、系统与框架版本，核对两次运行条件。",
    prompt: "整理环境指纹，列出两次运行需要核对的版本与环境条件。",
  },
  {
    id: "index-range",
    name: "循环范围核对",
    category: "只读检查",
    description: "围绕循环起止、有效元素数和输入形状建立检查步骤。",
    prompt: "核对 custom_op.cpp:128 附近的循环索引范围和有效元素数。",
  },
  {
    id: "error-distribution",
    name: "误差分布整理",
    category: "精度证据",
    description: "记录失败元素、实际值、参考值、误差和容差。",
    prompt: "整理逐元素误差分布，说明还需要哪些精度证据。",
  },
  {
    id: "evidence",
    name: "证据整理",
    category: "任务记录",
    description: "把已知事实、已尝试动作和待确认线索整理到当前任务。",
    prompt: "整理当前证据，区分已知事实、尝试记录与尚未确认的判断。",
  },
  {
    id: "reproduction",
    name: "最小复现简报",
    category: "任务记录",
    description: "记录最小输入、复现步骤、预期输出与实际现象。",
    prompt: "根据当前信息整理一份最小复现简报，并列出缺少的材料。",
  },
];

export const initialAutomations = [
  {
    id: "evidence-review",
    name: "任务证据回顾",
    cadence: "每天 09:00 · 仅演示",
    enabled: false,
    lastRun: "尚未运行 · 未连接实际调度",
  },
  {
    id: "context-review",
    name: "环境与版本核对",
    cadence: "每周一 10:00 · 仅演示",
    enabled: false,
    lastRun: "尚未运行 · 未连接实际调度",
  },
];

export const modelOptions = [
  { id: "general", label: "通用助手", description: "整理目标、上下文和下一步材料。" },
  { id: "diagnostic", label: "诊断助手", description: "关注复现条件、错误证据和检查顺序。" },
  { id: "reasoning", label: "推理助手", description: "对照候选解释与仍缺少的证据。" },
];

const asText = (value) => typeof value === "string" ? value : "";
const attachmentNames = (attachments) => (Array.isArray(attachments) ? attachments : [])
  .map((item) => typeof item === "string" ? item : asText(item?.name))
  .filter(Boolean)
  .slice(0, 5);

function recordsSummary(records) {
  const items = Array.isArray(records) ? records : [];
  return items.map((record) => {
    if (typeof record === "string") return record;
    const summary = asText(record?.summary);
    if (summary) return [asText(record?.title), summary].filter(Boolean).join("：");
    return asText(record?.text) || asText(record?.description) || asText(record?.title) || asText(record?.name);
  }).filter(Boolean).slice(0, 4);
}

export function buildAssistantReply({ text, taskName, modelLabel, attachments, records } = {}) {
  const input = asText(text).trim();
  const currentTask = asText(taskName).trim() || "当前任务";
  const isPrecisionTask = currentTask === "AddCustom 精度异常";
  const files = attachmentNames(attachments);
  const savedRecords = recordsSummary(records);
  let reply;

  if (/根因|原因|归因|为什么|why|cause/i.test(input) && isPrecisionTask) {
    reply = "目前的证据还不能确认根因。已知 [16,32] 通过、[17,33] 失败，precision mismatch 位于 custom_op.cpp:128；修改编译参数后错误位置未变。\n\n尾块处理只是候选线索。先确认两次运行的环境与输入内容是否可对照，再核对循环索引和有效元素数；若范围符合预期，应继续比较逐元素误差与计算路径。";
  } else if (/索引|尾块|循环|边界|范围|有效元素|index|tail|loop/i.test(input)) {
    reply = isPrecisionTask
      ? "先围绕 custom_op.cpp:128 做只读检查：记录循环起点、结束条件、步长、当前块的有效元素数，以及实际读写的索引范围。将 [16,32] 与 [17,33] 的对应路径放在一起比较。\n\n需要查看相关代码才能判断是否存在范围异常。非整块输入失败本身不能证明越界，也不能证明尾块处理就是根因。"
      : "可以先建立索引检查清单：输入形状、循环起止、步长、有效元素数与实际读写范围。请提供对应代码片段和预期范围，再对照具体实现；当前没有足够材料确认边界问题。";
  } else if (/误差|容差|精度|实际值|参考值|precision|tolerance|error distribution/i.test(input)) {
    reply = "先整理一份逐元素记录：元素索引、实际值、参考值、绝对误差、相对误差，以及采用的容差判据。同时记录输入形状和数据类型。\n\n观察误差是否集中在末尾、跨块位置或整个输出，可以帮助选择下一步检查路径；当前没有逐元素数据，不能推断误差分布或确认计算问题。";
  } else if (/编译|参数|配置|compile|flag/i.test(input)) {
    reply = isPrecisionTask
      ? "已知修改编译参数后，precision mismatch 仍出现在 custom_op.cpp:128。仅靠这一现象，还不能判断某个编译参数有效或无效。\n\n先保存修改前后的参数与运行条件，并固定输入；随后将注意力放到对应代码路径及误差证据。再次调整参数前，应明确希望观察到哪种变化。"
      : "先记录当前编译命令、工具版本、完整错误和已修改参数。每次只变更一个条件并保留结果，才能对照变化；目前没有构建日志，不能确认参数是否导致问题。";
  } else if (/环境|版本|芯片|驱动|指纹|environment|version/i.test(input)) {
    reply = "可以把环境条件整理为：芯片型号、CANN 版本、驱动与固件版本、系统与架构、框架及 Python 版本、编译命令。对比两次运行时还应保存输入内容、数据类型和随机种子。\n\n当前没有实际环境指纹；这份清单用于补齐上下文，不代表已经检查过设备。";
  } else if (/证据|记录|复现|简报|evidence|reproduce/i.test(input)) {
    reply = isPrecisionTask
      ? "当前简报可分为三部分：\n已知事实：[16,32] 通过；[17,33] 失败；precision mismatch 位于 custom_op.cpp:128。\n已尝试动作：修改编译参数，错误位置未变。\n待确认：运行条件是否一致、循环与有效元素范围、逐元素误差及容差。\n\n尾块边界仍是待检查线索，任务暂时不能标记为已定位。"
      : `先为「${currentTask}」记录目标、环境、最小输入、复现步骤、预期输出和实际现象；再单独记录已尝试动作及结果。缺少材料应保留为待补充，避免将候选解释写成事实。`;
  } else if (files.length || /附件|截图|文件|上传|attachment|screenshot/i.test(input)) {
    reply = files.length
      ? `已将附件关联到「${currentTask}」：${files.join("、")}。\n\n文本片段可以在消息附件中查看，当前没有自动分析代码、图片或日志。可以把关键报错和预期结果补充到消息中，再根据这些文字整理检查步骤。`
      : "请关联相关代码、截图或日志，并在消息中说明需要关注的位置与预期结果。当前没有附件内容可供判断，不能由文件入口推断新的诊断结论。";
  } else if (!input) {
    reply = "可以先描述本次要做的动作，或者补充一段代码与错误记录。选择检查方向后，再确认所需材料和预期产物。";
  } else {
    const goal = taskDetails[currentTask]?.goal;
    reply = `已围绕「${currentTask}」记录这次请求。${goal ? `当前目标是：${goal}` : "先明确目标、输入材料和完成条件，便于后续检查。"}\n\n接下来可以说明希望核对的代码或现象，并提供预期结果与实际结果。当前信息不足以确认原因或完成状态。`;
  }

  if (files.length && !reply.includes("没有自动分析")) {
    reply += `\n\n关联附件：${files.join("、")}。文本片段可在消息附件中查看，尚未自动分析文件内容。`;
  }
  if (savedRecords.length && /证据|记录|复现|简报|evidence|reproduce/i.test(input)) {
    reply += `\n\n任务中另有 ${savedRecords.length} 条记录可供对照：\n${savedRecords.join("\n\n")}\n\n这些是当前会话记录，不能替代实际运行证据。`;
  }
  if (modelLabel === "推理助手") {
    reply += "\n\n判断时把观察与解释分开：先列出能支持或排除每个候选原因的证据，再决定检查顺序。";
  } else if (modelLabel === "诊断助手") {
    reply += "\n\n下一步检查应保留输入、具体动作和结果，便于回查同一条排查路径。";
  }
  return `${reply}\n\n演示答复 · 未调用真实 AI 或硬件。`;
}
