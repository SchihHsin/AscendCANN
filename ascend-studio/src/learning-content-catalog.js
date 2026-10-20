import { LEARNING_MATERIALS } from "./learning-data";

export function buildLearningContentItems({ journey, workspaceState, records = [] }) {
  const { state, currentAttempt, currentCheck, summaryCurrent } = journey;
  const available = id => ["learning-goal", "learning-path"].includes(id) || id === "learning-summary" ? id !== "learning-summary" || Boolean(state.summaries.length) : Boolean(state.path);
  const produced = id => id === "learning-path" ? Boolean(state.path || state.draftPath) : id === "learning-practice" ? state.attempts.length > 0 : id === "learning-check" ? state.checks.length > 0 : id === "learning-summary" ? state.summaries.length > 0 : id === "learning-goal";
  const relations = {
    "learning-path": [{ id: "learning-goal", label: "目标与基础", title: "学习目标与基础" }],
    "learning-lesson": [{ id: "learning-path", label: "所属路径", title: "我的学习路径" }],
    "learning-practice": [{ id: "learning-lesson", label: "关联讲解", title: "图像与输入维度讲解" }],
    "learning-check": currentCheck ? [{ id: `attempt:learning:${currentCheck.attemptId}`, label: "本次核对的尝试", title: `尝试 ${state.attempts.findIndex(item => item.id === currentCheck.attemptId) + 1}` }] : [{ id: "learning-practice", label: "核对跟练输入", title: "维度转换跟练" }],
    "learning-summary": state.summaries.length ? [{ id: `snapshot:learning-check:${state.summaries.at(-1).checkId}`, label: "完成依据", title: "已保存的输入检查" }] : [],
  };
  return LEARNING_MATERIALS.filter(material => workspaceState.visitedTabs.some(tab => tab.id === material.id) || produced(material.id)).map(material => {
    const visited = workspaceState.visitedTabs.find(tab => tab.id === material.id);
    const children = material.id === "learning-practice" ? state.attempts.map((attempt, index) => ({ id: `attempt:learning:${attempt.id}`, title: `跟练尝试 ${index + 1}`, time: attempt.time, summary: attempt.passed ? "示例形状符合" : "示例形状需调整", contextLabel: `transpose(${attempt.snapshot.axes.join(",")}) · batch ${attempt.snapshot.batch ? "有" : "无"}`, readOnly: true }))
      : material.id === "learning-check" ? state.checks.map((check, index) => ({ id: `snapshot:learning-check:${check.id}`, title: `输入检查 ${index + 1}`, time: check.time, summary: `保存形状 [${check.dimensions.join(",")}]；对应尝试 ${state.attempts.findIndex(item => item.id === check.attemptId) + 1}`, readOnly: true }))
        : material.id === "learning-summary" ? state.summaries.map((summary, index) => ({ id: `snapshot:learning-summary:${summary.id}`, title: `学习记录 ${index + 1}`, time: summary.time, summary: summary.profile.goal, readOnly: true }))
          : material.id === "learning-path" ? records.filter(record => record.kind === "learning-path").map(record => ({ id: `record:${record.id}`, title: record.title, time: record.time, summary: record.summary, readOnly: true })) : [];
    const label = material.id === "learning-path" ? state.draftPath ? "草案待确认" : state.path ? journey.pathCurrent ? "已确认" : "目标变化 · 待审阅" : "尚未生成"
      : material.id === "learning-lesson" ? state.understood.includes("channels") ? "已记录理解" : "待理解"
        : material.id === "learning-practice" ? currentAttempt ? currentAttempt.passed ? "当前示例通过" : "当前尝试需调整" : state.attempts.length ? "参数已变 · 待重试" : "待跟练"
          : material.id === "learning-check" ? currentCheck ? "当前输入已核对" : state.checks.length ? "旧条件记录 · 当前待核对" : "待检查"
            : material.id === "learning-summary" ? summaryCurrent ? "学习记录已保存" : "保存记录 · 当前条件已变" : "可编辑";
    return { ...material, kindLabel: material.type === "code" ? "代码与练习" : "学习内容", available: available(material.id), children: children.map(child => ({ ...child, parentId: material.id, parentTitle: material.title, type: "preview" })), relatedHistory: [], relations: relations[material.id] || [], provenance: [], summary: material.id === "learning-goal" ? state.profile.goal : material.id === "learning-practice" ? `${state.attempts.length} 次尝试；结果按保存时的参数保留。` : material.id === "learning-path" ? `${(state.draftPath || state.path || []).filter(node => !node.skipped).length} 个学习节点，按理解、跟练与检查继续。` : material.id === "learning-lesson" ? "RGB 通道、HWC → CHW 与 batch；讲解片段可带回对话。" : material.id === "learning-check" ? "输入检查关联到确切尝试；历史条件与当前状态分别保留。" : `保存 ${state.summaries.length} 份学习成果，包含目标、代码与检查依据。`, statusLabel: label, state: { label, tone: currentAttempt?.passed && material.id === "learning-practice" || currentCheck && material.id === "learning-check" ? "success" : "neutral", detail: "学习示例与结果保留在本任务；未运行真实模型。" }, contextLabel: `每天 ${state.profile.dailyMinutes} 分钟 · 图像输入预处理示例`, countLabel: children.length ? `${children.length} 条记录` : "", viewState: { label: visited?.closed ? "已收起" : visited?.unread ? "有更新" : visited ? "已查看" : "未查看", closed: Boolean(visited?.closed), unread: Boolean(visited?.unread) }, closed: Boolean(visited?.closed), unread: Boolean(visited?.unread), lastAccessAt: visited?.lastAccessAt || 0, ...workspaceState.overview.itemOverrides?.[material.id] };
  });
}
