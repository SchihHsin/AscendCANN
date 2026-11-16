(() => {
  // This browser-side Skill contract sends constrained planning instructions to the existing AI Worker.
  // It does not execute a locally installed Codex Skill.
  const endpoint = 'https://ascend-cann.10xinyu0901.workers.dev';

  function buildRequest({ goal, role, level, format, resources }) {
    const catalog = resources.map((item) => ({
      id: item.id,
      title: item.title,
      section: item.category,
      description: item.description.slice(0, 160),
      availability: item.status || '查看资源页确认',
    }));

    return {
      endpoint,
      system: `你正在执行 CANN Learning Path Planner Skill。你是 CANN 学习路径规划专家，只能从给定的 resources 目录中选择真实课程或资源，按先修关系和目标顺序组织 3–6 个步骤。不得编造课程、学习时长、在线能力、资源状态或链接；只输出 JSON，不加 Markdown 代码围栏。格式：{"title":"路径名","summary":"一句话说明","steps":[{"resourceId":"目录中给定的 id","reason":"为什么此步适合当前目标，不超过40字"}]}。resourceId 必须逐字来自目录。若某资源标为建设中或待建设，不要把它写成可立即实践的前置步骤。零基础用户优先包含 CANN 基础。`,
      user: JSON.stringify({
        goal,
        role: role || '尚未确定',
        currentLevel: level,
        learningPreference: format,
        resources: catalog,
      }),
      max_tokens: 850,
    };
  }

  function parseResponse(raw, resources) {
    const text = String(raw || '').replace(/```(?:json)?/gi, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start < 0 || end <= start) throw new Error('路径规划结果格式异常');
    const parsed = JSON.parse(text.slice(start, end + 1));
    const byId = new Map(resources.map((item) => [String(item.id), item]));
    const steps = Array.isArray(parsed.steps) ? parsed.steps : [];
    const usedIds = new Set();
    const validSteps = steps.map((step) => {
      const resource = byId.get(String(step.resourceId || step.resource_id || ''));
      if (!resource || usedIds.has(resource.id)) return null;
      usedIds.add(resource.id);
      return {
        resource,
        reason: String(step.reason || '').slice(0, 160),
      };
    }).filter(Boolean).slice(0, 6);
    if (validSteps.length < 2) throw new Error('没有匹配到足够的课程资源');
    return {
      title: String(parsed.title || '为你规划的昇腾学习路径').slice(0, 80),
      summary: String(parsed.summary || '').slice(0, 220),
      steps: validSteps,
    };
  }

  window.CANNLearningSkills = window.CANNLearningSkills || {};
  window.CANNLearningSkills.learningPathPlanner = { buildRequest, parseResponse };
})();
