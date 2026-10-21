import { LEARNING_NODES } from "./learning-data.js";
import { proposeLearningPathChanges } from "./learning-path-collaboration.js";

export function createPathGenerationDemoDraft() {
  const proposalId = "demo-image-preprocessing-path";
  const path = LEARNING_NODES.map(node => ({ id: node.id, skipped: false }));
  const proposal = proposeLearningPathChanges(
    path,
    "请补充图像推理前处理重点：图像尺寸调整、归一化，以及 NCHW 输入形状检查。",
    proposalId,
  );
  return {
    draftPath: proposal.path,
    draftSource: "goal",
    pathChanges: proposal.changes,
    pathProposalId: proposalId,
    notice: "AI 已整理出路径草案；请审阅建议并调整，确认前不会开始学习。",
  };
}
