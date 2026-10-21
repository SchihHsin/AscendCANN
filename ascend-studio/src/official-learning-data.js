export const OFFICIAL_LEARNING_TASK = "ResNet50 离线推理初体验";

export const OFFICIAL_LEARNING_PATH_URL = "https://www.hiascend.com/edu/growth/details/2b5bea0dcd854f3b9d22d9e423a75746";
export const OFFICIAL_IMAGE_SAMPLE_URL = "https://www.hiascend.com/document/detail/zh/canncommercial/800/developmentguide/appdevg/aclcppdevg/aclcppdevg_000058.html";

export const OFFICIAL_LEARNING_SOURCES = {
  growth: { id: "growth", title: "昇腾开发者成长路径", type: "path", url: OFFICIAL_LEARNING_PATH_URL },
  overview: { id: "overview", title: "AscendCL 概述", type: "course", url: "https://www.hiascend.com/developer/courses/detail/1676860115159470081" },
  quickstart: { id: "quickstart", title: "AscendCL 快速入门", type: "course", url: "https://www.hiascend.com/developer/courses/detail/1676864664357150722" },
  resnet: { id: "resnet", title: "ResNet50 C&C++ 应用课程", type: "course", url: "https://www.hiascend.com/developer/courses/detail/1679410425112403970" },
  python: { id: "python", title: "ResNet50 Python 应用课程", type: "course", url: "https://www.hiascend.com/zh/developer/courses/detail/1687390499876962306" },
  "image-sample": { id: "image-sample", title: "CANN 8.0 图像处理样例", type: "document", url: OFFICIAL_IMAGE_SAMPLE_URL },
  resources: { id: "resources", title: "昇腾开发者官方学习资源", type: "article", url: "https://www.hiascend.com/developer/techArticles/20230817-1?envFlag=1" },
};

const VISUAL_LESSONS = {
  classification: ["输入是一张待判断类别的图片；分类不需要为每个目标画位置框。", "应用读取图像，按照模型约定准备数据，再调用模型完成计算。", "输出分数经过排序和标签映射后，才成为用户能读懂的类别。"],
  architecture: ["应用负责图片来源、模型选择、控制流程与结果展示。", "AscendCL 提供资源、数据和模型执行等接口，连接应用与设备能力。", "设备负责计算；输入格式和输出解释仍需由应用按模型约定管理。"],
  environment: ["记录目标设备、操作系统和架构，确认官方样例支持的运行条件。", "核对驱动、固件与 CANN 工具包版本；版本相近也不能直接视为兼容。", "从样例 README 确认依赖和执行入口，再把待确认项留在记录中。"],
  files: ["README 给出适用条件、准备步骤与运行入口，先从这里确认复现方法。", "模型、输入图片和应用代码是三个不同对象，不应相互替代。", "沿构建与运行说明找到实际文件路径；图中的目录只是角色示意。"],
  image: ["图像文件先被应用读取，文件格式与模型张量格式属于不同层次。", "解码、缩放和颜色处理应按所选样例与模型签名确定。", "把实际输入的尺寸、颜色、布局和类型记录下来，再与模型逐项对照。"],
  preprocess: ["先确认原始图片的颜色和尺寸；此处使用 RGB HWC 的独立教学示例。", "transpose 只改变轴顺序：原轴 2、0、1 对应 C、H、W。", "增加 N=1 表示一个样本；真实模型还要核对类型与归一化。"],
  contract: ["从样例说明读取实际输入处理方式，不能只凭模型名字假设参数。", "再核对模型签名中的 shape、dtype 和布局，区分动态和固定维度。", "教学示例目标为 NCHW [1,3,224,224]；它不代替真实模型输入契约。"],
  resources: ["先初始化 ACL 并选择目标设备，明确这次应用的运行位置。", "按照当前样例创建上下文、流等资源；并非所有样例创建的对象都相同。", "创建资源时同时查找对应释放位置，正常退出和失败退出都要考虑。"],
  model: ["模型文件描述待执行计算；图片文件只是本次推理的输入。", "应用先加载模型，并读取或核对输入输出定义。", "准备输入缓冲区和数据对象，再把预处理后的数据交给执行接口。", "执行后读取输出，按模型定义进行后处理；随后清理本次创建的资源。"],
  execution: ["模型和执行资源先准备好，执行调用才能引用正确的对象。", "输入数据需要满足模型要求，并关联到对应输入数据对象。", "执行模型后取得输出；同步方式和错误处理按当前样例确认。", "对输出进行解析和标签映射，再完成资源清理。"],
  lifecycle: ["记录每个资源由谁创建、在哪条流程中使用。", "在退出路径中找到对应释放操作，不遗漏错误分支。", "按实际依赖关系清理模型、流、上下文和设备等资源；以当前样例为准。"],
  results: ["模型输出可能是向量或缓冲区，不能直接把它当成标签文本。", "按输出定义排序并取得类别索引，再读取对应标签。", "对照同一张输入图片检查结果；示意分数不代表设备实测。"],
  summary: ["保留官方来源与所选课程、样例入口，方便重新核对。", "记录环境和输入约定，以及当前理解题与教学检查结果。", "把实际观察、尚未验证的部分和下一步写清楚，再保存本次记录。"],
};
const COURSE_FOR_VISUAL = { classification:"overview", architecture:"overview", environment:"quickstart", files:"resnet", image:"resnet", preprocess:"resnet", contract:"resnet", summary:"resnet" };
const makeNode = (id, title, summary, objective, visual, flow, concepts, sourceIds, mediaId, lesson, question, options, answer, explanation) => ({
  id, title, summary, objective, visual, focus: visual, flow: ["resources","model","execution","lifecycle"].includes(visual) ? ["准备运行资源","加载模型与输入","执行模型","读取输出与释放"] : flow, concepts, sourceIds,
  mediaId: OFFICIAL_LEARNING_SOURCES[mediaId]?.type === "course" ? mediaId : COURSE_FOR_VISUAL[visual] || "quickstart",
  lesson: { title, body: summary, points: VISUAL_LESSONS[visual] || concepts, ...lesson },
  checkpoint: { question, options: options.map(([optionId, label]) => ({ id: optionId, label })), answer, explanation },
});

export const OFFICIAL_LEARNING_STAGES = [
  {
    id: "learning-official-stage-chain", title: "认识图像推理链路", summary: "从图像分类任务出发，建立应用、AscendCL 与设备执行之间的整体认识。", minutes: 12,
    children: [
      makeNode("learning-official-step-image-classification", "认识图像分类任务", "追踪单张图像如何经过分类应用并形成类别结果。", "说清输入图像、推理应用和类别结果各自的位置。", "classification", ["输入图像", "分类应用", "类别结果"], ["图像输入", "分类推理", "结果读取"], ["growth", "image-sample"], "image-sample", {}, "分类任务的目标是什么？", [["a", "为图像中的每个目标生成位置框"], ["b", "为整张图像判断类别"], ["c", "只转换图像文件格式"]], "b", "图像分类为整张图像给出类别判断；检测还要定位图中目标。"),
      makeNode("learning-official-step-acl-position", "定位 AscendCL 的职责", "把应用逻辑、AscendCL 接口与昇腾设备能力放进同一条链路。", "能区分应用侧调用与设备侧实际执行的职责。", "architecture", ["应用目标", "AscendCL 接口", "昇腾设备能力"], ["应用层调用", "运行时边界", "设备执行"], ["overview", "resources"], "overview", {}, "AscendCL 在这条链路中的作用是什么？", [["a", "承接应用对昇腾能力的调用"], ["b", "替代应用定义业务目标"], ["c", "自动保证所有模型输入正确"]], "a", "AscendCL 提供应用调用昇腾能力的接口；任务目标和输入约定仍需由应用与模型确定。"),
      makeNode("learning-official-step-object-detection", "补充：分类与检测的差别", "用目标检测样例对照分类结果，理解定位信息属于另一类任务输出。", "能指出分类结果与检测框、目标类别等信息的差别。", "classification", ["输入图像", "检测推理", "位置与类别"], ["检测输出", "后处理", "结果呈现"], ["image-sample", "resources"], "image-sample", {}, "目标检测结果相对图像分类增加了什么？", [["a", "图像文件的来源"], ["b", "目标在图中的位置等信息"], ["c", "AscendCL 初始化步骤"]], "b", "检测应用通常还要处理目标位置等信息；本节点仅作概念比较。"),
    ],
  },
  {
    id: "learning-official-stage-environment", title: "准备环境与样例", summary: "核对课程入口、运行环境记录、官方样例与模型文件各自的作用。", minutes: 15,
    children: [
      makeNode("learning-official-step-environment-check", "记录环境条件", "先记录目标设备、CANN 版本、系统与配套组件，供后续按官方要求核对。", "形成一份可用于对照官方样例适用条件的环境记录。", "environment", ["设备与系统", "CANN 版本", "样例适用条件"], ["环境指纹", "版本匹配", "记录待核对项"], ["growth", "resources"], "resources", {}, "开始复现官方样例前，哪项做法最有助于判断适用性？", [["a", "记录实际环境并对照样例要求"], ["b", "假定所有版本和设备均兼容"], ["c", "先把模型参数改成常见值"]], "a", "环境与版本需要按官方材料逐项核对；本题不代表已在设备上检查。"),
      makeNode("learning-official-step-sample-files", "定位官方样例文件", "从图像处理样例和课程资料中辨认代码、图片及运行说明。", "能说明样例代码和图片文件在推理流程中的用途。", "files", ["官方资料入口", "样例代码与图片", "运行说明"], ["样例目录", "输入文件", "说明文档"], ["image-sample", "resources"], "image-sample", {}, "样例图片在推理流程中首先充当什么？", [["a", "模型文件"], ["b", "应用输入数据"], ["c", "设备运行时"]], "b", "图片是应用输入数据；模型文件与运行环境是不同对象。"),
      makeNode("learning-official-step-model-file", "确认模型文件角色", "区分模型文件、输入图片和应用程序，按所选样例核对文件来源与要求。", "能够分别指出模型、图片和应用代码的角色。", "model", ["模型文件", "输入图片", "应用程序"], ["模型载入", "样例输入", "应用调用"], ["quickstart", "resnet"], "resnet", {}, "模型文件在推理链路中的主要作用是什么？", [["a", "描述可供推理执行的模型"], ["b", "保存环境版本记录"], ["c", "替代输入图片"]], "a", "模型文件供推理应用加载使用；其格式与路径按所选官方样例核对。"),
    ],
  },
  {
    id: "learning-official-stage-input", title: "理解并准备图像输入", summary: "沿着原始图片、样例预处理与模型输入约定检查数据准备过程。", minutes: 18,
    children: [
      makeNode("learning-official-step-resnet-input", "认识 ResNet50 图像输入", "从官方 ResNet50 应用材料中找到输入图片进入应用的位置。", "描述图片从文件到应用输入的路径，并标记待核对的样例约定。", "image", ["输入图片", "应用读取", "样例输入数据"], ["图像文件", "读取流程", "输入来源"], ["resnet", "image-sample"], "resnet", {}, "输入图片具体如何被模型使用，应依据什么来确定？", [["a", "只依据常见图像模型习惯"], ["b", "按所选样例和模型签名核对"], ["c", "固定使用任意 RGB 图片"]], "b", "输入要求需按所选样例与模型签名核对，不能套用未经核实的固定形状。"),
      makeNode("learning-official-step-preprocess", "追踪样例预处理", "辨认样例中的图像解码、变换或格式处理环节，并记录其实际约定。", "能在所选材料中定位预处理环节及其输入输出说明。", "preprocess", ["原始图片", "样例预处理", "待核对输入"], ["读取", "预处理", "格式约定"], ["image-sample", "resnet"], "image-sample", {}, "预处理操作应如何确定？", [["a", "按所选样例和模型签名核对"], ["b", "一律假设 RGB 转 NCHW"], ["c", "省略对输入格式的检查"]], "a", "具体预处理和输入布局需以样例及模型签名为准。"),
      makeNode("learning-official-step-input-contract", "核对输入契约", "把数据类型、布局、尺寸等要求作为检查项，逐一对照样例和模型签名。", "形成输入契约检查清单，避免把常见约定误当成当前模型事实。", "contract", ["样例说明", "模型签名", "输入检查清单"], ["数据类型", "布局与尺寸", "契约核对"], ["resnet", "quickstart"], "resnet", {}, "尚未查到模型输入参数时，合理的下一步是什么？", [["a", "直接写入熟悉的固定参数"], ["b", "按所选样例和模型签名核对"], ["c", "跳过输入准备"]], "b", "应查阅当前所选模型与样例的输入约定；此处不预设形状或数值。"),
    ],
  },
  {
    id: "learning-official-stage-execution", title: "执行 ResNet50 推理", summary: "依次追踪资源初始化、模型与输入关联、推理执行和资源生命周期。", minutes: 22,
    children: [
      makeNode("learning-official-step-acl-init", "初始化 ACL 与运行资源", "在官方快速入门中定位初始化、设备选择及上下文或流等资源准备步骤。", "能按所选样例标出初始化入口及资源准备位置。", "resources", ["选择设备", "初始化 ACL", "准备运行资源"], ["初始化", "上下文", "执行资源"], ["quickstart", "overview"], "quickstart", { code: "// 顺序示意：具体接口与错误处理请以官方样例为准\naclInit(...);\naclrtSetDevice(...);\naclrtCreateContext(...);\naclrtCreateStream(...);" }, "这些调用在示意链路中属于哪个阶段？", [["a", "资源初始化与准备"], ["b", "分类结果解析"], ["c", "图像文件编码"]], "a", "示意代码只表达常见调用顺序，实际接口和参数须以当前官方样例为准。"),
      makeNode("learning-official-step-model-input", "关联模型与输入数据", "阅读样例中模型加载、输入缓冲区准备和数据传入之间的关系。", "区分模型加载和输入数据准备，并找到样例对应代码位置。", "model", ["模型文件", "加载模型", "准备输入数据"], ["模型加载", "输入缓冲区", "样例接口"], ["quickstart", "resnet"], "quickstart", { code: "// 顺序示意：模型与输入接口按所选样例核对\nloadModel(...);\nprepareInput(...);\ncopyInputData(...);" }, "输入数据的格式和尺寸应依据什么确定？", [["a", "此示意代码中的省略号"], ["b", "所选样例与模型签名"], ["c", "任意固定 NCHW 形状"]], "b", "示意代码不是完整工程或参数规范，输入契约以样例与模型签名为准。"),
      makeNode("learning-official-step-inference-output", "执行推理并取得输出", "定位样例中的推理执行调用及输出数据接收位置。", "能指出执行入口与输出取得的先后关系。", "execution", ["准备好的输入", "执行推理", "取得模型输出"], ["执行调用", "输出数据", "样例处理"], ["quickstart", "resnet"], "quickstart", { code: "// 顺序示意：仅说明执行与取回输出\nexecuteModel(...);\nreadModelOutput(...);" }, "取得模型输出后，是否已经等同于用户可读的分类标签？", [["a", "是，输出必然是标签文本"], ["b", "需按模型输出定义继续解析"], ["c", "不需要读取输出"]], "b", "模型输出的含义和解析方式需结合模型定义及样例后处理确认。"),
      makeNode("learning-official-step-acl-lifecycle", "核对资源释放顺序", "回看应用退出路径中的模型、流、上下文、设备和 ACL 清理位置。", "理解资源生命周期，并能在样例中定位对应收尾步骤。", "lifecycle", ["推理完成", "释放相关资源", "应用收尾"], ["资源所有权", "释放顺序", "错误路径清理"], ["overview", "quickstart"], "overview", { code: "// 收尾顺序示意：按样例实际创建的资源对应释放\nreleaseModel(...);\naclrtDestroyStream(...);\naclrtDestroyContext(...);\naclrtResetDevice(...);\naclFinalize();" }, "资源释放学习时最可靠的检查方法是什么？", [["a", "假设每个程序资源相同"], ["b", "按样例实际创建的资源核对对应清理"], ["c", "只关注推理调用"]], "b", "应结合实际创建的资源与样例退出路径检查清理；示意不构成完整工程。"),
    ],
  },
  {
    id: "learning-official-stage-result", title: "解读结果并复盘", summary: "区分模型输出、样例解析结果和验证记录，为后续复现留下依据。", minutes: 10,
    children: [
      makeNode("learning-official-step-resnet-result", "解读分类结果", "根据模型输出定义和官方样例后处理，辨认最终展示结果的来源。", "区分原始输出与应用解析后的类别结果。", "results", ["模型输出", "样例后处理", "类别展示"], ["输出含义", "类别解析", "结果呈现"], ["resnet", "image-sample"], "resnet", {}, "何时可以把输出称为最终分类结果？", [["a", "取得任意输出缓冲区后"], ["b", "按模型定义和样例完成解析后"], ["c", "初始化 ACL 后"]], "b", "输出需要按模型定义和样例处理后才能解释为类别结果。"),
      makeNode("learning-official-step-save-summary", "保存检查记录", "记录来源、环境条件、输入约定、执行观察和未验证事项，便于复盘与求助。", "整理可复核的学习记录，不把阅读或模拟题结果写成设备验证。", "summary", ["资料来源", "环境与输入检查", "观察与待办"], ["证据记录", "适用条件", "验证边界"], ["growth", "resources", "resnet"], "resources", {}, "学习记录中，哪种表述能准确区分阅读理解与设备验证？", [["a", "阅读样例即表示已在 NPU 跑通"], ["b", "注明观察来源并单列未验证事项"], ["c", "省略环境和版本信息"]], "b", "记录来源和验证边界，避免将材料阅读或理解题误报为真实运行。"),
    ],
  },
];

// Kept as the legacy public name consumed by the existing canvas.
export const OFFICIAL_LEARNING_COURSES = OFFICIAL_LEARNING_STAGES;
export const OFFICIAL_NODE_ALIASES = {
  "learning-official-course-overview": "learning-official-stage-chain",
  "learning-official-course-quickstart": "learning-official-stage-execution",
  "learning-official-course-orange-pi": "learning-official-stage-environment",
  "learning-official-course-resnet50": "learning-official-stage-input",
};

export const OFFICIAL_LEARNING_MATERIALS = OFFICIAL_LEARNING_STAGES.flatMap(stage => [
  { id: stage.id, title: stage.title, type: "preview", category: "reference", groupId: "learning-official", description: stage.summary },
  ...stage.children.map(child => ({ id: child.id, title: child.title, type: "preview", category: "explain", groupId: "learning-official", description: child.summary, parentId: stage.id, parentTitle: stage.title })),
]);

export function getOfficialLearningNode(nodeId) {
  const resolvedId = OFFICIAL_NODE_ALIASES[nodeId] || nodeId;
  for (const stage of OFFICIAL_LEARNING_STAGES) {
    if (stage.id === resolvedId) return { ...stage, kind: "course", courseId: stage.id };
    const child = stage.children.find(item => item.id === resolvedId);
    if (child) return { ...child, kind: "step", courseId: stage.id, courseTitle: stage.title };
  }
  return null;
}

export function getOfficialCourseStatus(course, statuses = {}) {
  const children = course.children.map(child => statuses[child.id] || "not-started");
  if (children.length && children.every(status => status === "completed")) return "completed";
  if (children.some(status => status === "in-progress" || status === "completed")) return "in-progress";
  return statuses[course.id] || "not-started";
}

export function getOfficialLearningStatus(nodeId, statuses = {}) {
  const node = getOfficialLearningNode(nodeId);
  if (!node) return "not-started";
  return node.kind === "course" ? getOfficialCourseStatus(node, statuses) : statuses[nodeId] || "not-started";
}

export function officialStatusLabel(status) {
  return status === "completed" ? "已学完" : status === "in-progress" ? "学习中" : "待开始";
}

export function buildOfficialLearningContentItems({ state, workspaceState, records = [] } = {}) {
  const statuses = state?.statuses || {};
  const visited = workspaceState?.visitedTabs || [];
  const labelFor = id => officialStatusLabel(getOfficialLearningStatus(id, statuses));
  const items = OFFICIAL_LEARNING_STAGES.map(stage => {
    const stageVisit = visited.find(item => item.id === stage.id);
    const children = stage.children.map(child => {
      const childVisit = visited.find(item => item.id === child.id);
      const label = labelFor(child.id);
      return { id: child.id, title: child.title, type: "preview", parentId: stage.id, parentTitle: stage.title, summary: child.summary, contextLabel: label, statusLabel: label, state: { label, tone: statuses[child.id] === "completed" ? "success" : "neutral", detail: "结合理解记录、当前理解题与所需练习更新；不代表设备验证。" }, readOnly: false, closed: Boolean(childVisit?.closed), unread: Boolean(childVisit?.unread), viewState: { label: childVisit?.closed ? "已收起" : childVisit?.unread ? "有更新" : childVisit ? "已查看" : "未查看", closed: Boolean(childVisit?.closed), unread: Boolean(childVisit?.unread) } };
    });
    const statusLabel = labelFor(stage.id);
    const completed = stage.children.filter(child => statuses[child.id] === "completed").length;
    return { id: stage.id, title: stage.title, type: "preview", kindLabel: "目标阶段", groupId: "learning-official", summary: stage.summary, statusLabel, contextLabel: `${completed}/${stage.children.length} 个学习动作已完成`, state: { label: statusLabel, tone: statusLabel === "已学完" ? "success" : "neutral", detail: "阶段进度汇总自下方学习动作与检查记录；不代表 NPU 已验证。" }, children, relatedHistory: [], relations: [], provenance: [], countLabel: `${stage.children.length} 个学习动作`, closed: Boolean(stageVisit?.closed), unread: Boolean(stageVisit?.unread), viewState: { label: stageVisit?.closed ? "已收起" : stageVisit?.unread ? "有更新" : stageVisit ? "已查看" : "未查看", closed: Boolean(stageVisit?.closed), unread: Boolean(stageVisit?.unread) } };
  });
  return [...items, ...records.filter(record => record.kind === "official-learning-summary").map(record => ({ id:`record:${record.id}`, title:record.title, summary:record.summary, type:"preview", groupId:"learning-official", kindLabel:"学习记录", contextLabel:record.time, readOnly:true, state:{label:"已保存",tone:"neutral",detail:"保存时的本地学习记录"} }))];
}
