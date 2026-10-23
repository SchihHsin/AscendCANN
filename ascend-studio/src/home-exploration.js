// A curated capability map, not a personalized diagnosis or telemetry feed.
const choice = (id, label, hint, prompt, children = [], kind = "development", tone = "") => ({
  id, label, hint, prompt, children, kind, ...(tone ? { tone } : {}),
});

const trainingPerformance = "我想提升昇腾上的训练效率。请先确认训练框架、硬件、任务规模和基线，再制定分析与对照验证方案。";
const multiCard = "我在昇腾上进行多卡训练，增加卡数后的吞吐提升不明显。请先帮助我定位瓶颈，告诉我需要提供哪些环境信息和性能数据，再给出调优与对照验证步骤。";

export const explorationTopics = [
  {
    ...choice("training", "训练与调优", "从跑通训练，到理解收敛与提升效率", "我想在昇腾上开展模型训练。请先帮我明确训练目标、环境要求和下一步。", [
      choice("efficiency", "提升训练效率", "先明确现象，再寻找需要检查的环节", trainingPerformance, [
        choice("multi-card", "多卡收益不明显", "增加卡数后，训练吞吐提升有限", multiCard, [
          choice("diagnose", "先定位瓶颈", "确定要采集的证据，不预设根因", `${multiCard}\n请优先列出数据加载、计算和通信三个环节需要采集的指标，以及比较方法。`, [], "development", "blue"),
          choice("compare", "设计对照实验", "控制变量，比较改动前后的结果", `${multiCard}\n请帮我设计单卡与多卡的对照实验，记录全局 batch、每卡 batch、吞吐、单步耗时及结果可比性。`, [], "development", "sand"),
          choice("understand", "先理解并行训练", "弄懂数据并行、通信和扩展效率", "我想理解昇腾多卡训练中数据并行、梯度同步与扩展效率的关系。请用一个训练案例讲解，并给出可逐步练习和检查理解的学习路径。", [], "learning", "violet"),
        ], "development", "coral"),
        choice("single-card", "单卡吞吐偏低", "先建立可比较的单卡性能基线", "我在昇腾上训练时单卡吞吐偏低。请先确认环境与任务规模，指导我采集数据加载、设备计算利用率和单步耗时，再设计可复核的调优实验。", [], "development", "blue"),
        choice("step-time", "每步耗时波动", "区分持续低效与间歇性等待", "我的昇腾训练任务每步耗时波动较大。请先说明需要提供的日志和时间线，指导我检查数据加载、同步等待和检查点保存等可能因素，不预先判定根因。", [], "development", "sand"),
        choice("baseline", "还没有性能基线", "先知道测什么，再决定优化什么", "我想为昇腾训练任务建立性能基线。请帮我确定吞吐、单步耗时、设备内存、有效 batch 等指标及记录方式，并说明如何进行公平的调优前后对照。", [], "development", "violet"),
      ], "development", "blue"),
      choice("stability", "排查训练异常", "从你观察到的现象开始", "我的昇腾训练任务出现异常。请先帮我整理环境、日志和复现条件，再制定检查顺序。", [
        choice("loss", "Loss 不稳定", "检查曲线、数据和训练配置", "我的训练 Loss 波动较大。请先询问模型、数据、学习率、有效 batch、精度配置和异常发生阶段，再指导我保留基线、控制变量排查，不直接给出未经验证的根因。"),
        choice("memory", "设备内存不足", "确认发生时机与内存占用", "我的昇腾训练任务出现设备内存不足。请先确认模型、序列长度、batch、精度和报错阶段，指导我采集内存信息，再比较可行的调整方案与代价。"),
        choice("interrupt", "训练中途退出", "用日志和复现条件缩小范围", "我的昇腾训练任务中途退出。请告诉我需要保留哪些环境信息、日志与复现条件，并按证据制定检查顺序。"),
      ], "development", "coral"),
      choice("first-run", "跑通训练流程", "准备环境、最小运行与结果检查", "我想在昇腾上跑通一个最小训练任务。请先确认模型类型、框架、硬件和软件版本，再给出环境预检、最小运行、预期结果和失败恢复步骤。", [], "development", "green"),
      choice("training-learn", "理解训练方法", "把概念与可检查的练习连接起来", "我想学习昇腾模型训练与调优。请先确认我的基础与目标，再围绕训练循环、Loss、batch、混合精度和并行训练组织渐进学习路径，每一步给出练习和验证方式。", [], "learning", "violet"),
    ]),
    icon: "training", keywords: "吞吐 · 收敛 · 并行", tone: "violet",
  },
  {
    ...choice("deployment", "模型部署", "从模型到可运行的服务", "我想在昇腾上部署模型。请先确认模型、框架、硬件及服务目标，再制定可验证的部署步骤。", [
      choice("deploy-run", "跑通一个模型", "从环境预检到最小运行", "我想在昇腾上跑通一个模型。请先确认模型来源、框架与硬件版本，给出最小部署步骤、预期结果和失败恢复方式。"),
      choice("deploy-service", "搭建推理服务", "明确接口、负载与运行条件", "我想在昇腾上搭建模型推理服务。请先确认模型、并发与延迟目标、软硬件环境，再组织部署、请求测试和服务验收步骤。"),
      choice("deploy-check", "核对部署条件", "检查版本与依赖兼容性", "请帮我核对昇腾模型部署条件，先收集硬件、驱动、CANN、框架和模型版本，再检查兼容性与缺失依赖。"),
    ]),
    icon: "deployment", keywords: "模型 · 服务 · 运行", tone: "blue",
  },
  {
    ...choice("operator", "算子开发", "实现、构建和验证一个算子", "我想开发昇腾自定义算子。请先确认算子定义、输入输出、硬件与CANN版本，再给出实现和验证路径。", [
      choice("operator-build", "实现一个算子", "先定义输入输出与正确性标准", "我想实现一个昇腾自定义算子。请先确认算子数学定义、输入输出、数据类型、形状范围及环境，再给出最小实现、构建和正确性验证步骤。"),
      choice("operator-error", "排查编译错误", "结合命令、日志和版本定位", "请帮我排查昇腾算子编译错误。先告诉我需要提供哪些命令、完整错误日志和版本信息，再按证据缩小问题范围。"),
      choice("operator-learn", "理解算子流程", "从实现到测试的完整链路", "我想学习昇腾自定义算子的实现、构建和测试流程。请根据我的基础组织学习步骤，给出最小案例和验证方式。", [], "learning"),
    ]),
    icon: "operator", keywords: "实现 · 编译 · 验证", tone: "sand",
  },
  {
    ...choice("migration", "迁移适配", "把已有工程带到昇腾环境", "我想将现有工程迁移到昇腾。请先确认原环境、目标环境和验收条件，再制定迁移与回归检查步骤。", [
      choice("migration-check", "评估迁移工作", "先找依赖、差异与验收范围", "我想评估现有工程迁移到昇腾的工作量。请先收集框架、依赖、关键API和运行目标，列出兼容性检查及待验证项。"),
      choice("migration-framework", "适配训练工程", "保留基线，逐步替换和复核", "我想把现有训练工程适配到昇腾。请先确认源环境与目标版本，再设计最小迁移、正确性回归和训练结果对照步骤。"),
      choice("migration-precision", "核对结果差异", "明确数据、误差标准和对照条件", "迁移到昇腾后我需要核对结果差异。请先帮我固定输入、随机性、精度配置和误差标准，再组织对照验证。"),
    ]),
    icon: "migration", keywords: "工程 · 框架 · 兼容", tone: "coral",
  },
  {
    ...choice("environment", "环境与工具", "准备一个明确、可复现的现场", "请帮我准备昇腾开发环境，先确认硬件、操作系统、驱动、CANN与框架版本，再说明安装与预检方法。", [
      choice("env-setup", "准备开发环境", "明确硬件和软件版本", "我需要准备昇腾开发环境。请先确认硬件、操作系统、驱动和框架要求，再给出兼容版本、安装与验证步骤。"),
      choice("env-logs", "整理日志与材料", "让问题可以被复现与检查", "请帮我整理昇腾任务的问题诊断材料，明确环境版本、复现命令、预期与实际结果、已尝试动作和需要保留的日志。"),
      choice("env-profile", "学习性能分析", "理解采集、阅读和对照", "我想学习昇腾训练性能分析工具。请先确认环境与目标，再说明如何采集和阅读性能数据，用练习建立正确的对照方法。", [], "learning"),
    ]),
    icon: "environment", keywords: "版本 · 日志 · 工具", tone: "green",
  },
  {
    ...choice("learning", "学习一个主题", "从你的目标与已有基础出发", "我想学习昇腾相关知识。请先问清我的目标、已有基础和可用时间，再组织带练习和检查的学习路径。", [
      choice("learn-training", "训练与调优入门", "理解训练过程，再动手验证", "我想入门昇腾训练与调优。请先确认我的编程和机器学习基础、可用环境及学习时间，再给出渐进路径、最小练习和预期结果。", [], "learning"),
      choice("learn-parallel", "弄懂并行策略", "连接数据并行、模型并行与通信", "我想弄懂数据并行、模型并行和梯度累积的关系。请用训练情境解释适用条件与代价，并设计检查理解的练习。", [], "learning"),
      choice("learn-custom", "梳理我的学习目标", "先对话，再决定学习内容", "请通过简短对话帮我明确昇腾学习目标、已有基础和可用时间，再一起确定需要学习的内容与完成标准。", [], "learning"),
    ], "learning"),
    icon: "learning", keywords: "概念 · 路径 · 实践", tone: "violet",
  },
];

export function resolveExplorationPath(ids) {
  const result = [];
  let options = explorationTopics;
  for (const id of ids) {
    const node = options.find((item) => item.id === id);
    if (!node) break;
    result.push(node);
    options = node.children;
  }
  return result;
}

export function explorationRequest(ids) {
  const path = resolveExplorationPath(ids);
  const last = path.at(-1);
  return { goal: last?.prompt || "", kind: last?.kind || "development", path };
}
