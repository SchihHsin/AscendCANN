export const OFFICIAL_LEARNING_TASK = "ResNet50 离线推理初体验";

export const OFFICIAL_LEARNING_PATH_URL = "https://www.hiascend.com/edu/growth/details/2b5bea0dcd854f3b9d22d9e423a75746";
export const OFFICIAL_IMAGE_SAMPLE_URL = "https://www.hiascend.com/document/detail/zh/canncommercial/800/developmentguide/appdevg/aclcppdevg/aclcppdevg_000058.html";

// Four top-level items follow the official growth-path sequence. Child items are
// this Demo's learning breakdowns, not chapter titles claimed by the source site.
export const OFFICIAL_LEARNING_COURSES = [
  {
    id: "learning-official-course-overview",
    title: "AscendCL 概述",
    summary: "先认识 AscendCL 在昇腾应用开发中的位置，以及应用侧会经历的基本生命周期。",
    children: [
      {
        id: "learning-official-step-acl-position",
        title: "AscendCL 在应用栈中的位置",
        summary: "建立应用代码、AscendCL 与昇腾设备能力之间的关系图。",
        objective: "说清 AscendCL 在应用开发中的职责，并区分应用逻辑与设备侧执行。",
        flow: ["应用目标", "AscendCL 接口", "昇腾设备能力"],
        concepts: ["应用层调用", "运行时边界", "设备执行"],
        source: "path",
      },
      {
        id: "learning-official-step-acl-lifecycle",
        title: "应用从初始化到资源释放",
        summary: "沿着初始化、准备资源、执行工作到释放资源理解完整流程。",
        objective: "能按顺序指出应用生命周期中的准备、执行和收尾环节。",
        flow: ["初始化", "准备资源", "执行任务", "释放资源"],
        concepts: ["生命周期", "资源管理", "调用顺序"],
        source: "path",
      },
    ],
  },
  {
    id: "learning-official-course-quickstart",
    title: "AscendCL 快速入门",
    summary: "跟随官方入门材料，把模型加载、输入准备、推理执行和结果读取串起来。",
    children: [
      {
        id: "learning-official-step-acl-init",
        title: "初始化 ACL 与运行资源",
        summary: "识别快速入门样例的初始化顺序与执行上下文。",
        objective: "从样例中找到初始化入口、运行资源准备和对应的清理位置。",
        flow: ["选择设备", "初始化 ACL", "准备上下文与流"],
        concepts: ["初始化", "上下文", "执行资源"],
        source: "path",
      },
      {
        id: "learning-official-step-model-input",
        title: "加载模型并准备输入",
        summary: "跟读模型加载与输入数据准备之间的衔接。",
        objective: "标出模型文件、输入数据和样例代码中各自承担的角色。",
        flow: ["模型文件", "加载模型", "准备输入"],
        concepts: ["模型加载", "输入数据", "数据集"],
        source: "path",
      },
      {
        id: "learning-official-step-inference-output",
        title: "执行推理并读取输出",
        summary: "沿着执行调用追踪输出数据的取得与后续处理。",
        objective: "能在快速入门样例中定位推理执行与输出读取的位置。",
        flow: ["输入数据", "执行推理", "读取输出"],
        concepts: ["执行调用", "输出数据", "结果处理"],
        source: "path",
      },
    ],
  },
  {
    id: "learning-official-course-orange-pi",
    title: "香橙派部署图像分类及目标检测样例",
    summary: "以香橙派上的图像分类和目标检测样例为入口，比较输入、推理与结果呈现。",
    children: [
      {
        id: "learning-official-step-image-classification",
        title: "图像分类样例",
        summary: "追踪单张图像进入分类样例后如何得到分类结果。",
        objective: "在官方样例中对应图像输入、模型调用与类别结果展示。",
        flow: ["输入图像", "分类样例", "类别结果"],
        concepts: ["图像输入", "分类推理", "结果读取"],
        source: "image-sample",
      },
      {
        id: "learning-official-step-object-detection",
        title: "目标检测样例",
        summary: "观察检测样例如何把模型输出转成图像上的检测结果。",
        objective: "区分模型输出与样例后处理、结果绘制等应用环节。",
        flow: ["输入图像", "检测样例", "检测结果"],
        concepts: ["检测输出", "后处理", "结果呈现"],
        source: "image-sample",
      },
    ],
  },
  {
    id: "learning-official-course-resnet50",
    title: "香橙派部署 ResNet50 图像分类应用实验",
    summary: "把前面的 AscendCL 基础放到 ResNet50 图像分类应用中，读懂完整应用链路。",
    children: [
      {
        id: "learning-official-step-resnet-input",
        title: "准备 ResNet50 图像输入",
        summary: "对照实验材料找出图片输入与预处理在应用中的位置。",
        objective: "把示例图片、预处理代码和模型输入约定对应起来；具体形状以官方样例为准。",
        flow: ["示例图片", "预处理", "模型输入"],
        concepts: ["样例数据", "图像预处理", "模型输入约定"],
        source: "image-sample",
      },
      {
        id: "learning-official-step-resnet-inference",
        title: "串起 ResNet50 推理链",
        summary: "沿着应用代码观察 AscendCL 调用、推理执行与输出接收。",
        objective: "从样例中标出模型加载、执行推理与读取输出的对应代码位置。",
        flow: ["加载 ResNet50", "AscendCL 推理", "读取模型输出"],
        concepts: ["应用调用", "推理执行", "输出数据"],
        source: "path",
      },
      {
        id: "learning-official-step-resnet-result",
        title: "理解分类结果与部署验证",
        summary: "把输出结果和部署实验的验证条件放在一起检查。",
        objective: "说明样例输出代表什么，并记录部署环境、输入样本和可观察结果。",
        flow: ["模型输出", "类别解析", "样例结果"],
        concepts: ["分类结果", "部署环境", "验证信号"],
        source: "path",
      },
    ],
  },
];

export const OFFICIAL_LEARNING_MATERIALS = OFFICIAL_LEARNING_COURSES.flatMap(course => [
  { id: course.id, title: course.title, type: "preview", category: "reference", groupId: "learning-official", description: course.summary },
  ...course.children.map(child => ({ id: child.id, title: child.title, type: "preview", category: "explain", groupId: "learning-official", description: child.summary, parentId: course.id, parentTitle: course.title })),
]);

export function getOfficialLearningNode(nodeId) {
  for (const course of OFFICIAL_LEARNING_COURSES) {
    if (course.id === nodeId) return { ...course, kind: "course", courseId: course.id };
    const child = course.children.find(item => item.id === nodeId);
    if (child) return { ...child, kind: "step", courseId: course.id, courseTitle: course.title };
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

export function buildOfficialLearningContentItems({ state, workspaceState } = {}) {
  const statuses = state?.statuses || {};
  const visited = workspaceState?.visitedTabs || [];
  const labelFor = id => officialStatusLabel(getOfficialLearningStatus(id, statuses));
  return OFFICIAL_LEARNING_COURSES.map(course => {
    const courseVisit = visited.find(item => item.id === course.id);
    const children = course.children.map(child => {
      const childVisit = visited.find(item => item.id === child.id);
      const label = labelFor(child.id);
      return { id: child.id, title: child.title, type: "preview", parentId: course.id, parentTitle: course.title, summary: child.summary, contextLabel: label, statusLabel: label, state: { label, tone: statuses[child.id] === "completed" ? "success" : "neutral", detail: "由学习者自行记录；不代表已完成设备运行验证。" }, readOnly: false, closed: Boolean(childVisit?.closed), unread: Boolean(childVisit?.unread), viewState: { label: childVisit?.closed ? "已收起" : childVisit?.unread ? "有更新" : childVisit ? "已查看" : "未查看", closed: Boolean(childVisit?.closed), unread: Boolean(childVisit?.unread) } };
    });
    const statusLabel = labelFor(course.id);
    const completed = course.children.filter(child => statuses[child.id] === "completed").length;
    return { id: course.id, title: course.title, type: "preview", kindLabel: "官网课程", groupId: "learning-official", summary: course.summary, statusLabel, contextLabel: `${completed}/${course.children.length} 个拆解节点已标记学完`, state: { label: statusLabel, tone: statusLabel === "已学完" ? "success" : "neutral", detail: "课程进度汇总自下方拆解节点；不代表官网学习平台或 NPU 已验证。" }, children, relatedHistory: [], relations: [], provenance: [], countLabel: `${course.children.length} 个学习拆解`, closed: Boolean(courseVisit?.closed), unread: Boolean(courseVisit?.unread), viewState: { label: courseVisit?.closed ? "已收起" : courseVisit?.unread ? "有更新" : courseVisit ? "已查看" : "未查看", closed: Boolean(courseVisit?.closed), unread: Boolean(courseVisit?.unread) } };
  });
}
