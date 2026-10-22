const UNKNOWN_ENVIRONMENT = [
  "操作系统版本：未提供",
  "CANN 版本：未提供",
  "Python 版本：未提供",
  "设备型号与固件版本：未提供",
  "其他相关依赖信息：未提供",
].join("\n");

export function createCommunityDraft({ taskId, task, session, completion }) {
  let problem = String(task.question || task.goal || "请补充本次任务中遇到的问题。").trim();
  let approach = "本次对话已整理问题背景与下一步核对方向；当前没有可确认的项目运行结果。建议补充复现步骤、实际输出和环境信息后再提交。";
  let verification = "尚未进行真实项目或 NPU 实测。当前草稿根据本次任务对话生成；如后续完成验证，可在此补充实际运行情况、输出结果或性能表现。";

  if (task.kind === "learning" && completion?.id) {
    const dimensions = completion.dimensions?.join(", ") || "1, 3, 224, 224";
    problem = "图像预处理示例的输入为 HWC [224,224,3]，目标约定为 NCHW [1,3,224,224]。需要明确通道轴如何调整，以及 batch 维度应放在哪里。";
    approach = `先用 transpose(${completion.snapshot?.axes?.join(",") || "2,0,1"}) 将 HWC 转为 CHW，再增加 N=1 的 batch 维度，得到 NCHW [${dimensions}]。本次练习与输入形状检查均已完成并保存；过程来自浏览器中的示例交互。`;
    verification = `已保存完成记录，包含 ${completion.attemptCount || 1} 次跟练尝试、当前形状 [${dimensions}] 及对应输入检查。这里只核对本地示例形状规则，没有执行真实 Python、模型或 NPU；模型签名、颜色顺序、归一化与实际推理结果仍需在对应环境确认。`;
  } else if (taskId === "图像推理调试" && completion?.id) {
    problem = "在图像推理测试过程中，示例模型要求输入张量为 NCHW [1,3,224,224]，但当前预处理输出的图像张量为 NHWC [1,224,224,3]，两者通道顺序不一致。需要理解这种差异，以及如何在不修改原文件的情况下调整。";
    const axes = completion.snapshot?.axes || [2, 0, 1];
    const dimensions = completion.dimensions?.join(", ") || "1, 3, 224, 224";
    approach = `在隔离的浏览器示例副本中，将 HWC 轴按 transpose(${axes.join(",")}) 调整为 CHW，并加入 batch 维度；示例输出为 NCHW [${dimensions}]。原项目文件保持只读。`;
    verification = `本次开发任务的示例形状检查通过，记录输出为 [${dimensions}]。这只验证浏览器副本中的预设形状规则，没有写回项目文件，也没有运行真实 Python、模型或 NPU；真实模型签名、dtype、颜色顺序、归一化和推理结果仍需在对应环境核对。`;
  } else if (taskId === "图像推理调试") {
    problem = "在图像推理测试过程中，示例模型要求输入张量为 NCHW [1,3,224,224]，但当前预处理输出的图像张量为 NHWC [1,224,224,3]，两者通道顺序不一致。需要理解这种差异，以及如何在不修改原文件的情况下调整。";
    approach = "先对照图像与示例约定：图像以 HWC 读入，示例模型约定为 NCHW。可以在隔离的浏览器示例副本中调整轴顺序与 batch，观察形状变化；原项目文件保持只读。";
    verification = "还没有完成示例形状复核。当前只建立问题背景；真实模型签名、归一化和推理结果也需要在对应环境核对。";
  } else if (taskId === "AddCustom 精度异常" && completion?.kind === "addcustom-precision-resolution") {
    const precision = completion.precision || {};
    const count = Number.isFinite(precision.count) ? precision.count : "未记录";
    problem = "AddCustom 算子在输入 [16,32] 时通过、[17,33] 时出现 precision mismatch，错误位置为 custom_op.cpp:128。任务已由开发者确认在目标环境修复并复测通过；具体复现条件仍应结合实际项目版本补全。";
    approach = `开发者确认问题已在目标环境解决并复测通过。本次提交的逐元素对照包含 ${count} 项，${precision.failed ?? 0} 项超出所设容差（atol ${precision.atol ?? "未记录"}，rtol ${precision.rtol ?? "未记录"}）。当前对话与工作区没有记录实际修改点或根因，草稿不会推断修复方法；请在发布前从代码变更或任务记录中补全。`;
    verification = `开发者确认目标环境复测通过；本次逐元素数据 ${count} 项、${precision.failed ?? 0} 项超差。容差：atol ${precision.atol ?? "未记录"}，rtol ${precision.rtol ?? "未记录"}。Demo 未独立连接 NPU，也未核验数据来源；CANN、芯片、驱动与固件版本尚未提供。`;
  } else if (taskId === "AddCustom 精度异常") {
    problem = "AddCustom 算子在输入 [16,32] 时通过、[17,33] 时失败，报错为 precision mismatch，位置在 custom_op.cpp:128。修改编译参数后，错误仍出现在同一位置。需要继续核对失败条件与误差证据，目前不能确认根因。";
    approach = "现有对话将尾块边界列为优先核查线索，并建议只读检查对应循环的索引范围和有效元素数；若未发现边界异常，再补充两次运行条件与逐元素误差。当前没有修改真实项目文件，也没有据此认定根因。";
    verification = "当前没有真实 NPU 验证结果。已知记录仅包含两组输入形状、通过/失败状态和错误位置；两次运行条件与逐元素误差仍待补充。";
  } else if (session.showIntro && task.reply) {
    const firstReply = String(task.reply).split("\n\n").filter(Boolean).slice(0, 2).join("\n\n");
    approach = `本次对话整理出的方向：\n${firstReply}\n\n这些内容来自任务对话，不代表项目已完成运行验证。`;
  }

  const followUp = (session.messages || []).filter(message => message.role === "user").map(message => message.text).filter(Boolean);
  if (followUp.length && taskId !== "图像推理调试" && taskId !== "AddCustom 精度异常") {
    problem = `${problem}\n\n补充对话：${followUp.slice(-2).join("；")}`;
  }

  return {
    id: crypto.randomUUID(),
    ...(completion?.id ? { completionId: completion.id } : {}),
    status: "review",
    open: true,
    generatedAt: Date.now(),
    problem,
    approach,
    environment: UNKNOWN_ENVIRONMENT,
    verification,
  };
}
