// Prepare a reviewable learning outline from the user's actual project documents.
export function buildProjectRulesPlan(files, prompt = "") {
  const sections = [];
  for (const file of files) {
    const lines = String(file.content || "").split(/\r?\n/);
    let section = { title: file.name, lines: [], file: file.name };
    const push = () => {
      const excerpt = section.lines.join(" ").replace(/\s+/g, " ").trim();
      if (excerpt) sections.push({ ...section, excerpt: excerpt.slice(0, 240) });
    };
    for (const line of lines) {
      const match = line.match(/^#{1,4}\s+(.+)/);
      if (match) { push(); section = { title: match[1].trim(), lines: [], file: file.name }; }
      else if (line.trim() && !/^\s*(```|\|[- :|]+\|)/.test(line)) section.lines.push(line.trim());
    }
    push();
  }
  const matching = sections.filter(section => /昇腾|ascend|cann|训练|推理|模型|算子|环境|部署|项目|规则|架构|构建|测试|开发/i.test(`${section.title} ${section.excerpt}`));
  const chosen = [...matching, ...sections.filter(section => !matching.includes(section))].slice(0, 6);
  if (!chosen.length) return null;
  const goalTitle = "结合项目规则理解昇腾开发";
  return {
    sourceKind: "project-rules", title: `${goalTitle} · 学习路径`, goalTitle,
    description: "从上传文件中提取的章节和原文片段，可结合近期提问继续学习。",
    prompt: prompt.trim() || "请结合我近期的昇腾开发问题和上传的项目文件，整理需要学习的内容。",
    sourceFieldCount: files.length, connectionPath: [],
    steps: chosen.map((section, index) => ({ id: `rule-${index}`, number: index + 1, title: section.title, description: section.excerpt, tone: "blue", fields: [{ id: `source-${index}`, title: `${section.file} · 文件原文`, tone: "blue" }] })),
  };
}
