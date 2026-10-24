export const OFFICIAL_VIDEO_DURATION = 45;

// The video frame, chapter navigation and accompanying lesson share this timeline.
export const OFFICIAL_VIDEO_CHAPTERS = [
  {
    id: "runtime", start: 0, title: "准备运行资源", pipeline: "准备资源",
    summary: "初始化 ACL、选择设备，再准备本次推理所需的运行资源。",
    body: "推理开始前，先确定应用使用的设备，并准备上下文、流等运行资源。画面中的高亮代码对应这一准备阶段。",
    points: ["先完成 ACL 初始化与设备选择，再继续模型加载。", "记录本次创建的资源，后面按对应关系完成清理。", "上下文与流的创建方式以所选样例为准。"],
    code: "aclInit(nullptr);\naclrtSetDevice(deviceId);\n// 按样例创建上下文、流等运行资源",
    screenLines: ["aclInit(nullptr);", "aclrtSetDevice(deviceId);"],
  },
  {
    id: "input", start: 11, title: "加载模型与输入", pipeline: "模型与输入",
    summary: "加载模型，读取图像，并按模型要求准备输入数据。",
    body: "模型文件与输入图片是两个不同对象。加载模型后，先核对输入的尺寸、类型和布局，再把预处理后的图像放入对应输入数据对象。",
    points: ["模型提供计算结构与输入输出约定，图片提供本次待分类的数据。", "按模型签名核对 shape、dtype、颜色及布局。", "完成预处理和数据准备后，再进入模型执行阶段。"],
    code: "auto model = loadModel(modelPath);\nauto image = readImage(inputPath);\nauto input = prepareInput(image);",
    screenLines: ["auto model = loadModel(modelPath);", "auto input = prepareInput(image);"],
  },
  {
    id: "execute", start: 22, title: "执行模型", pipeline: "执行推理",
    summary: "将准备好的输入交给模型执行，等待输出数据就绪。",
    body: "模型和输入准备完成后，应用发起推理调用。此时得到的是模型输出数据，尚需等待执行完成并经过后处理，才能展示可读的分类结果。",
    points: ["执行调用引用已加载的模型与已准备好的输入数据。", "同步方式和返回状态应结合当前样例确认。", "先确认输出就绪，再解析类别；资源清理在使用结束后进行。"],
    code: "auto result = model.infer(input);\nwaitForInference();\n// 输出就绪后，再进入结果解析",
    screenLines: ["auto result = model.infer(input);", "waitForInference();"],
  },
  {
    id: "output", start: 33, title: "读取输出与释放", pipeline: "输出与收尾",
    summary: "解析模型输出、展示分类结果，再按依赖关系释放资源。",
    body: "推理完成后，按输出定义排序分数并映射类别标签。结果使用结束后，沿退出路径清理模型、输入输出及运行资源，完成本次推理。",
    points: ["按模型输出定义完成 Top-K 排序和标签映射。", "核对分类结果与本次输入图片的对应关系。", "根据实际创建的对象清理模型、流、上下文和设备等资源。"],
    code: "showTopResults(result);\nreleaseModel(model);\nreleaseResources();",
    screenLines: ["showTopResults(result);", "releaseResources();"],
  },
];

export function officialVideoChapterIndex(time) {
  const seconds = Math.max(0, Math.min(OFFICIAL_VIDEO_DURATION, Number(time) || 0));
  return OFFICIAL_VIDEO_CHAPTERS.reduce((active, chapter, index) => seconds >= chapter.start ? index : active, 0);
}
