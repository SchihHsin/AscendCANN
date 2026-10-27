export const DESKTOP_URL = "https://schihhsin.github.io/AscendCANN/ascstudio/";
export const TASKS = [
  { id: "training", title: "多卡收益不明显", category: "训练与调优", icon: "layers", tone: "purple", description: "增加卡数后，吞吐提升没有达到预期。先理解如何衡量，再决定检查哪里。", knowledge: ["scaling", "sync", "batch", "parallel", "precision"], question: "我想分析昇腾多卡训练的扩展效率。请先帮我确认硬件、框架、任务规模与基线，再规划需要采集的数据和对照实验。" },
  { id: "operator", title: "从一个自定义算子开始", category: "算子开发", icon: "code", tone: "coral", description: "理解数据如何分块，以及最后一块不足时该怎样处理。", knowledge: ["tail", "layout"], question: "我想学习昇腾自定义算子的分块与尾块处理。请先确认我的基础和环境，再组织最小案例、边界用例与结果核对步骤。" },
  { id: "inference", title: "跑通第一次模型推理", category: "模型推理", icon: "cube", tone: "mint", description: "从模型输入开始，把数据布局、精度和执行过程连接起来。", knowledge: ["layout", "precision"], question: "我想跑通昇腾模型推理。请先确认模型、硬件与软件版本，再指导我检查输入约定、运行最小样例和核对预期结果。" },
];
const distributed = { title: "PyTorch · 分布式训练教程", url: "https://docs.pytorch.org/tutorials/intermediate/ddp_tutorial.html" };
export const WEEKLY_TOPICS = ["昇腾开发", "训练调优", "算子实践", "AI 应用"];
export const WEEKLY_FEATURES = {
  "昇腾开发": { category: "训练与调优", title: "多卡训练想提速，先对齐单卡基线和有效 Batch", summary: "对比单卡与多卡时，把模型、精度、有效 Batch 和统计口径一起记下来。再去看通信与数据等待，避免只凭卡数判断瓶颈。", points: ["先记录同口径的单卡吞吐", "把有效 Batch 和精度一起对齐", "再观察通信、数据加载与同步等待"], source: distributed },
  "训练调优": { category: "训练与调优", title: "多卡训练想提速，先对齐单卡基线和有效 Batch", summary: "对比单卡与多卡时，把模型、精度、有效 Batch 和统计口径一起记下来。再去看通信与数据等待，避免只凭卡数判断瓶颈。", points: ["先记录同口径的单卡吞吐", "把有效 Batch 和精度一起对齐", "再观察通信、数据加载与同步等待"], source: distributed },
  "算子实践": { category: "算子开发", title: "处理尾块时，别让越界元素混进计算", summary: "向量分块的最后一块可能不足一个完整块。先明确有效元素范围，再检查边界输入与结果，避免把补齐位置当作有效数据。", points: ["覆盖刚好整块与多出一个元素", "检查最后一块的有效范围", "对照预期结果核对边界行为"], source: { title: "昇腾 · CANN 文档", url: "https://www.hiascend.com/document" } },
  "AI 应用": { category: "AI 应用开发", title: "模型提出工具调用后，应用还要执行并核对结果", summary: "工具调用描述的是模型希望执行的动作。应用需要校验参数、运行对应工具，再把结果回传给模型，才能继续处理任务。", points: ["解析工具名和参数", "由应用按权限执行工具", "回填结果后再判断下一步"], source: { title: "Anthropic · Implement Tool Use", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use" } },
};
export const KNOWLEDGE = [
  {
    id: "scaling", title: "卡数翻倍，训练为什么没快一倍？", short: "先看懂扩展效率", category: "训练调优", tone: "purple", minutes: 3, visual: "scaling", tags: "扩展效率 吞吐 多卡 性能 并行",
    intro: "卡数增加，计算可以分担，通信和等待也会增加。扩展效率帮你看清：多出的卡，换来了多少吞吐。",
    takeaway: "扩展效率 = 多卡吞吐 ÷（单卡吞吐 × 卡数）。比较时，应保持模型、精度、统计口径等条件一致，并记录有效 Batch。",
    explanation: "例如单卡每秒处理 100 个样本，4 卡每秒处理 332 个样本：加速比是 3.32，扩展效率是 83%。这是一组帮助理解的示例数据。",
    connection: "先分别记录单卡与多卡吞吐，再检查通信、数据加载和同步等待。仅凭效率偏低，还不能判断是哪一个环节出了问题。",
    quiz: { question: "4 卡吞吐没有达到单卡的 4 倍，首先能说明什么？", options: ["通信一定出了故障", "扩展效率未达到 100%，还需要定位耗时", "必须立刻增加卡数"], correct: 1, right: "对。效率描述扩展收益，具体原因还要结合时间线与对照实验判断。", wrong: "先区分现象和原因。扩展收益不足，并不能直接指向某一个故障。" },
    source: distributed,
  },
  {
    id: "sync", title: "梯度同步，在同步什么？", short: "让多张卡朝同一方向更新", category: "训练调优", tone: "mint", minutes: 3, visual: "sync", tags: "梯度 通信 AllReduce 数据并行 多卡",
    intro: "数据并行中，每张卡读取不同的数据、计算本地梯度。更新参数前，各卡需要得到一致的聚合梯度。",
    takeaway: "数据并行同步的是梯度，不是把每张卡的训练图片交换一遍。聚合后，各副本按一致的梯度更新参数。",
    explanation: "图中用一个标量表示梯度：四张卡分别得到 2、4、6、8，平均后都是 5。真实模型会对多个参数的梯度执行相应的聚合。",
    connection: "把通信耗时与计算耗时放在同一条时间线上，才能理解同步等待是否影响了当前任务的扩展收益。",
    quiz: { question: "常规同步数据并行中，更新参数前需要聚合什么？", options: ["每张卡的原始图片", "模型输出的文件名", "各卡计算的梯度"], correct: 2, right: "对。聚合梯度让不同模型副本保持一致的更新方向。", wrong: "回到图解中的三步：本地计算 → 同步梯度 → 更新参数。" }, source: distributed,
  },
  {
    id: "batch", title: "有效 Batch，到底怎么算？", short: "把卡数、累积与 Batch 连起来", category: "训练调优", tone: "blue", minutes: 2, visual: "batch", tags: "batch 梯度累积 批次 显存 多卡",
    intro: "每张卡一次处理多少数据，与一次参数更新总共使用多少数据，是两个不同的量。梯度累积把它们连接起来。",
    takeaway: "常规数据并行中：有效 Batch = 每卡 Batch × 数据并行卡数 × 梯度累积步数。",
    explanation: "例如每卡 Batch 为 4，使用 4 张数据并行卡，累积 2 步再更新：一次更新相当于使用了 32 个样本。",
    connection: "对照单卡与多卡实验时，把有效 Batch 一起记下来。改变它可能影响优化过程，不能只比较吞吐而忽略训练设置。",
    quiz: { question: "每卡 Batch=4，4 张数据并行卡，累积 2 步，有效 Batch 是？", options: ["8", "16", "32"], correct: 2, right: "对，4 × 4 × 2 = 32。卡数这里指数据并行卡数。", wrong: "把三个因子都算进去：每卡 Batch × 数据并行卡数 × 累积步数。" }, source: { title: "PyTorch · 梯度累积示例", url: "https://docs.pytorch.org/docs/stable/notes/amp_examples.html#gradient-accumulation" },
  },
  {
    id: "precision", title: "混合精度，为什么要「混合」？", short: "在效率与数值稳定之间分工", category: "训练调优", tone: "peach", minutes: 3, visual: "precision", tags: "混合精度 FP16 BF16 FP32 内存 推理 训练",
    intro: "部分计算可以采用较低精度，另一些计算需要更高精度来保持稳定。混合精度按运算特点安排不同的数据类型。",
    takeaway: "混合精度不是把所有数据都改成同一种低精度。应按框架与硬件支持选择策略，并核对数值稳定性。",
    explanation: "图解只展示精度分工：矩阵运算可采用受支持的较低精度，敏感操作保留更高精度。具体选择由实际算子、框架和策略决定。",
    connection: "开始对照实验前，先固定精度策略并保留基线。观察吞吐、设备内存与 Loss，确认收益与稳定性。",
    quiz: { question: "混合精度的核心思路是什么？", options: ["按运算特点组合不同精度", "所有运算都使用 FP16", "跳过结果核对"], correct: 0, right: "对。分工比一刀切更重要，具体策略还要与环境匹配。", wrong: "想想「混合」两个字：不同运算对数值精度的需求不同。" }, source: { title: "PyTorch · Automatic Mixed Precision", url: "https://docs.pytorch.org/docs/stable/amp.html" },
  },
  {
    id: "parallel", title: "数据并行和模型并行，怎么选？", short: "先看分的是数据还是模型", category: "训练调优", tone: "purple", minutes: 4, visual: "parallel", tags: "并行策略 数据并行 模型并行 切分 训练 多卡",
    intro: "数据并行复制模型、分配不同数据；模型并行把模型切分到不同设备。选择从模型能否放下、通信成本和任务规模开始。",
    takeaway: "数据并行分数据、各卡保留模型副本；模型并行切分模型。实际训练也可能组合使用多种并行方式。",
    explanation: "当单卡能容纳模型时，数据并行是常见起点。模型太大时，可能需要切分参数、计算或状态；不同方案的通信代价并不相同。",
    connection: "先列出模型大小、设备内存、卡间拓扑与目标吞吐，再用小规模实验比较策略。不要仅凭卡数决定并行方式。",
    quiz: { question: "哪一种方式让各卡保留模型副本、读取不同数据？", options: ["模型并行", "数据并行", "两者都一定如此"], correct: 1, right: "对。模型副本相同，处理的数据不同，再同步梯度。", wrong: "先看图中模型是否被完整复制，还是被切成不同部分。" }, source: distributed,
  },
  {
    id: "tail", title: "最后一块数据不够，怎么办？", short: "用 33 个元素，看懂尾块", category: "算子开发", tone: "coral", minutes: 3, visual: "tail", tags: "算子 分块 尾块 tiling 越界 Ascend C",
    intro: "按固定大小分块时，最后一块可能不足。需要用有效元素数限制访问，并结合实际接口约束处理对齐与搬运。",
    takeaway: "元素总数不一定能被块长整除。处理最后一块时，要明确它的有效范围；边界测试应覆盖块长前后。",
    explanation: "例如块长为 32，33 个元素需要 2 块：第一块 32 个，第二块只有 1 个有效元素。图解演算仅用于理解范围。",
    connection: "把 31、32、33 等边界输入加入用例，再核对真实代码的访问范围与接口要求。这里的范围演算不能替代设备测试。",
    quiz: { question: "块长 32，总共 33 个元素，最后一块有几个有效元素？", options: ["1", "31", "32"], correct: 0, right: "对。33 = 32 + 1，最后一块只有 1 个有效元素。", wrong: "先装满第一块的 32 个位置，再数还剩多少。" }, source: { title: "昇腾 · CANN 文档", url: "https://www.hiascend.com/document" },
  },
  {
    id: "layout", title: "HWC → CHW，数据到底怎么排？", short: "用一张小图，理解三个轴", category: "模型推理", tone: "blue", minutes: 2, visual: "layout", tags: "HWC CHW 布局 图像 张量 预处理 维度",
    intro: "H 是高度，W 是宽度，C 是通道。轴的排列表达数据如何组织，输入前要与模型约定一致。",
    takeaway: "HWC → CHW 是轴重排：原来的第 2 轴移到最前，得到 (2, 0, 1)。它通常不是直接 reshape。",
    explanation: "对于 H=2、W=3、C=3 的图像，HWC 形状是 [2,3,3]，CHW 是 [3,2,3]。实际输入还可能需要 batch 轴，形成 NCHW。",
    connection: "从模型输入签名和样例确认布局、数据类型与尺寸，再组织预处理。不要只凭维度数量猜测布局。",
    quiz: { question: "从 HWC 转为 CHW，应选择哪种轴顺序？", options: ["(0, 1, 2)", "(2, 0, 1)", "(1, 2, 0)"], correct: 1, right: "对。先取原来的 C，再接 H、W，对应 (2,0,1)。", wrong: "把 C 放到最前，同时保持 H 和 W 的相对顺序。" }, source: { title: "NumPy · transpose", url: "https://numpy.org/doc/stable/reference/generated/numpy.transpose.html" },
  },
];
export const taskById = id => TASKS.find(t => t.id === id) || TASKS[0];
export const knowledgeById = id => KNOWLEDGE.find(k => k.id === id);
