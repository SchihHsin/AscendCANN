import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const evidence = path.join(here, 'evidence/ux-design-work-20261013');
const templatePath = process.argv[2] || '/Users/hsin/.codex/skills/report-ppt-skill/assets/deck-template.html';
const template = fs.readFileSync(templatePath, 'utf8');
const sandbox = JSON.parse(fs.readFileSync(path.join(evidence, 'sandbox-snapshot.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const anchor = (href, label) => `<a href="${escape(href)}" target="_blank" rel="noopener">${label}</a>`;
const evidenceLink = (file, label) => anchor(`evidence/ux-design-work-20261013/${file}`, label);
const chapters = ['任务变化', '体验成因', '沙盘发力', '设计工作', '验证行动'];
const tabs = current => `<nav class="section-tabs" aria-label="章节">${chapters.map((name, i) => `<span class="${current === i ? 'active' : ''}">${String(i + 1).padStart(2, '0')} ${name}</span>`).join('')}</nav>`;
const titleHead = (title, chapter, kind) => `<header class="head"><div class="head-l"><div class="brand"><h1 class="ttl">${title}${kind ? `<span class="ux-kind">${kind}</span>` : ''}</h1></div></div>${tabs(chapter)}</header>`;
const band = (title, text, tone = '') => `<div class="ux-band ${tone}"><b>${title}</b><p>${text}</p></div>`;
const conclusion = (label, text) => `<div class="cx-concl"><span class="ck">${label}</span><span class="cv">${text}</span></div>`;
const node = (title, text, tone = '') => `<div class="ux-node ${tone}"><b>${title}</b><p>${text}</p></div>`;
const chain = nodes => `<div class="ux-chain" style="--nodes:${nodes.length}">${nodes.map((n, i) => `${i ? '<span class="ux-arrow" aria-hidden="true">→</span>' : ''}${node(...n)}`).join('')}</div>`;
const decision = (label, text) => `<div class="ux-decision"><span>${label}</span><b>${text}</b></div>`;
const footer = html => `<footer class="foot">${html}</footer>`;
const slides = [];
function slide(title, chapter, body, foot, options = {}) {
  slides.push(`<section class="slide s-gray ux-slide ${options.className || ''}" data-title="${escape(title)}" data-chapter-name="${escape(chapters[chapter])}" data-template="${options.pattern || 'sm2-figure-text'}">${titleHead(title, chapter, options.kind)}<main class="body-area ux-main">${body}</main>${footer(foot)}</section>`);
}

const work = [
  {id:'rules', row:0, group:0, name:'项目规则 / 持久上下文', question:'哪些约束应持续生效？', intervention:'设计作用域、冲突优先级、更新与失效条件；让已确认事实可以纠正。', output:'规则作用域图＋冲突与失效用例', test:'跨目录／任务切换后，约束是否正确继承或停止', owner:'领域 Owner 确认规则；工程实现加载与隔离'},
  {id:'knowledge', row:1, group:0, name:'领域知识库 / 检索源', question:'什么信息适用于当前任务？', intervention:'组织版本、硬件、来源与适用范围；定义缺项补问和冲突处理。', output:'知识单元规范＋适用性与引用规范', test:'旧版本、缺条件、矛盾资料是否被识别', owner:'资料 Owner 维护真实性；检索与数据团队实现'},
  {id:'skill', row:3, group:1, name:'Skill / Workflow', question:'何时采用什么方法？', intervention:'从任务状态定义触发、输入、判断分支、停止／升级与产物。', output:'方法流程＋Skill 行为规格＋场景集', test:'适用时正确进入；不适用时拒绝或换路', owner:'领域专家提供方法；工程实现脚本与工具'},
  {id:'command', row:4, group:1, name:'Command / Prompt', question:'一句指令委派了什么？', intervention:'明确意图、范围、默认值、歧义追问及动作预览。', output:'命令意图表＋补问与确认规则', test:'模糊指令不越权，修改意图能及时生效', owner:'产品共同定义范围；工程实现解析与路由'},
  {id:'mcp', row:5, group:2, name:'MCP / Connector', question:'如何安全地取得事实和执行动作？', intervention:'定义参数补全、授权时机、可理解的输出、失败与下一动作。', output:'调用体验合同＋状态与错误语义', test:'超时、权限不足、部分结果可理解且可继续', owner:'服务团队实现能力；安全团队确定权限'},
  {id:'plugin', row:6, group:2, name:'Plugin / Extension', question:'能力如何被发现、交付和更新？', intervention:'明确包内能力、依赖、安装后的生效与关闭／升级行为。', output:'能力交付蓝图＋版本与兼容体验规范', test:'安装／更新／关闭后，状态和可用能力一致', owner:'平台与发布团队实现包、兼容和生命周期'},
  {id:'agent', row:7, group:3, name:'Custom Agent / Subagent', question:'谁负责什么，怎样交接与复核？', intervention:'定义任务边界、最小上下文、证据回传、分歧解决与责任。', output:'分工蓝图＋委派与交接合同', test:'子任务不越界，分歧按证据解决，失败可回主任务', owner:'工程实现委派；领域专家定义复核标准'},
  {id:'hook', row:8, group:3, name:'Hook / Lifecycle', question:'哪些动作需要固定检查关口？', intervention:'设计触发事件、检查理由、阻断／放行与恢复路径。', output:'事件关口图＋拒绝与恢复规则', test:'必要检查不会漏；无关事件不反复打断', owner:'工程实现事件与门禁；安全／测试确认约束'},
  {id:'runtime', row:2, group:4, name:'Harness / Agent Runtime', question:'交互要求由运行时怎样兑现？', intervention:'定义用户可理解的状态、控制需求、连续性与异常验收。', output:'体验验收要求＋与工程共同定义的状态合同', test:'任务状态与实际执行一致，中断后保留现场', owner:'工程拥有运行时／接口实现；UX联合验证体验'},
  {id:'loop', row:9, group:4, name:'Agent Loop · 任务内', question:'何时继续、重试、停止或交还控制？', intervention:'制定进展判据、重复失败处理、预算与停止／验收条件。', output:'循环与退出规则＋异常轨迹用例', test:'无进展不无限重试；模型结束不冒充业务完成', owner:'工程编排循环；领域／业务定义完成条件'}
];
const groups = [
  {label:'目标与条件', ids:['rules','knowledge'], rows:[0,1], finding:'可配置的规则和知识，让设计师可以介入目标、条件与信息连续性。', deliver:'作用域、适用性、缺项补问与失效规则'},
  {label:'方法与发起', ids:['skill','command'], rows:[3,4], finding:'任务方法与显式指令承接不同委派时刻，需要明确何时启动及做到哪里。', deliver:'方法分支、命令意图、停止与升级条件'},
  {label:'动作与交付', ids:['mcp','plugin'], rows:[5,6], finding:'工具连接与安装包装，让体验延伸到参数、权限、输出和能力生效。', deliver:'调用合同、错误语义、兼容与生效规范'},
  {label:'协作与关口', ids:['agent','hook'], rows:[7,8], finding:'委派和事件关口提供分工与检查位置；各平台实现形式并不相同。', deliver:'交接合同、复核责任、事件与恢复规则'},
  {label:'运行与连续', ids:['runtime','loop'], rows:[2,9], finding:'内置运行时决定执行连续性；UX 通过可实现要求和联合验证影响它。', deliver:'任务状态、中断续接、无进展与验收规则'}
];
const sandboxFocus = [
  {label:'共通接入',rows:[0,1,3,5],finding:'既有六平台沙盘归纳了项目规则、知识／检索、Skill、MCP／Connector四类对应面。建设原则是统一领域内容与方法，再适配入口。',deliver:'规则、可判定知识、任务方法、实时事实与受控动作'},
  {label:'差异装配',rows:[4,6,7,8],finding:'既有结论要求Command、Plugin、专职Agent和Hook按平台装配方式适配，复用同一内容内核。',deliver:'任务发起、交付包装、角色交接、事件关口的适配规格'},
  {label:'平台内核',rows:[2,9],finding:'Harness与任务内Loop由平台运行；领域侧提供约束、状态和验收要求，通过公开入口与工程实现。',deliver:'连续性、停止与恢复要求；业务验收保持在任务层'}
];

slides.push(`<section class="slide s-cover ux-cover" data-title="Agent 时代，UX 设计师应设计什么"><div class="cv-bg"></div><div class="cv-shade"></div><div class="cv-content"><div class="cv-top"><span class="cv-meta">EXPERIENCE DESIGN RESEARCH</span><span class="cv-meta">2026.10</span></div><div class="cv-center"><div class="cv-kicker">人 · AI · 方法 · 工具 · 协作</div><h1 class="ux-cover-title">Agent 时代<br>UX 设计师应设计什么</h1><p class="cv-lead">从开发任务与运行机制出发，识别体验设计的介入点、交付物与验证方法。</p><div class="ux-cover-line"><span>任务变化</span><i>→</i><span>体验成因</span><i>→</i><span>沙盘发力</span><i>→</i><span>设计工作</span></div></div><div class="cv-bot"><span class="cv-meta">研究综合 · 设计建议</span>${anchor('index.html','既有研究资料 ↗')}</div></div></section>`);
slides.push(`<section class="slide s-gray contents-slide ux-slide" data-title="目录" data-template="contents-directory"><header class="head"><div class="head-l"><div class="brand"><h1 class="ttl">目录</h1></div></div></header><main class="body-area ux-main"><div class="contents-directory contents-5">${[
  ['任务变化','TASKS','分工与用户原声','定位新增判断与负担'],
  ['体验成因','CAUSES','界面、行为与系统','找到真正可干预的位置'],
  ['沙盘发力','INTERVENTIONS','完整十项能力／机制','推导各处的设计工作'],
  ['设计工作','DELIVERABLES','规则、蓝图与界面','明确产出及协作边界'],
  ['验证行动','EVALUATION','场景、对照与任务验收','检验建议并安排试点']
].map((a,i)=>`<article class="directory-card" style="--dir:var(--c-${['indigo','blue','teal','green','pink'][i]})"><div class="directory-no">0${i+1}</div><h2 class="directory-name">${a[0]}</h2><div class="directory-en">${a[1]}</div><div class="directory-items"><span>${a[2]}</span></div><div class="directory-note">${a[3]}</div></article>`).join('')}</div></main>${footer('研究对象：UX 设计工作的对象、介入方式、交付与评价。')}</section>`);

slide('执行被委派之后，人的判断与系统行为共同影响体验',0,`
  <div class="ux-mode-map">
    <div class="ux-stage-labels"><span></span><b>确定目标</b><b>获取条件</b><b>执行与纠错</b><b>判断与验收</b></div>
    <div class="ux-mode-row"><div class="ux-mode-name">人工操作<small>人主执行</small></div>${['人拆解任务','人找资料与环境','人操作工具并排错','人检查并交付'].map(t=>`<div class="ux-person">${t}</div>`).join('')}</div>
    <div class="ux-mode-row"><div class="ux-mode-name">AI 辅助<small>局部建议</small></div><div class="ux-person">人提出局部问题</div><div class="ux-shared">AI 建议 · 人选用</div><div class="ux-shared">AI 生成 · 人操作</div><div class="ux-person">人核验建议与产物</div></div>
    <div class="ux-mode-row"><div class="ux-mode-name">Agent 委派<small>部分任务执行</small></div><div class="ux-person">人给目标与边界</div><div class="ux-system">系统读取与补问</div><div class="ux-system">行动 · 反馈 · 再规划</div><div class="ux-shared">证据回传 · 人与规则验收</div></div>
  </div>
  ${conclusion('设计对象','需要同时设计委派范围、行动行为和验收关系；具体分工随任务风险与用户能力变化。')}`,
  `任务对照示意，不是三类用户发生率。${evidenceLink('reuse-ledger.md','访谈与任务证据')} · ${anchor('../agent-tool-calling-reference.html','运行机制依据')}`,{pattern:'layered-architecture'});

slide('生成产物之后，判断、验证与理解仍需要人参与',0,`
  <div class="voc-wall ux-voc">
    <article class="voc-card card"><div class="qm open">“</div><h2>判断下一步</h2><blockquote class="voc-q">你的经验判断，他可以顺着你的经验判断走一条新的分支。</blockquote><div class="voc-meta">文件1 · 00:15:53–00:16:06</div><p class="ux-voc-reading">设计线索：允许人依据错误事实改变诊断方向。</p></article>
    <article class="voc-card card accent"><div class="qm open">“</div><h2>补足验证范围</h2><blockquote class="voc-q">你需要让他考虑一些特殊的边界条件，特殊的输入输出。</blockquote><div class="voc-meta">文件1 · 00:18:14</div><p class="ux-voc-reading">设计线索：典型输入通过之后，仍要明确未覆盖条件。</p></article>
    <article class="voc-card card hl"><div class="qm open">“</div><h2>保留学习参与</h2><blockquote class="voc-q">搜索的过程其实是一种学习的强化过程。</blockquote><div class="voc-meta">文件2 · 00:08:00–00:08:44</div><p class="ux-voc-reading">设计线索：任务完成与用户获得理解分别评价。</p></article>
  </div>
  ${conclusion('研究推论','用户需要的支持涉及决策依据、执行规则和理解过程，界面只是承载这些支持的一种方式。')}`,
  `2026-08-02，同一受访者的一次访谈，分两份逐字稿；没有录音听校。原声为节选。${evidenceLink('reuse-ledger.md','逐字核对与证据范围')}`,{pattern:'voc-wall'});

slide('先追溯体验成因，才能判断 UX 应在哪里介入',1,`
  <div class="ux-cause-map">
    <div class="ux-cause-signal"><span class="ux-eyebrow">同一用户困扰</span><h2>“为什么又让我解释一次？”</h2><p>仅凭表面感受，无法直接决定改哪个界面或机制。</p></div>
    <div class="ux-cause-branches">
      ${band('当前条件不可见','用户无法发现或纠正已有假设。<em>设计介入：条件表达与就地修改。</em>')}
      ${band('信息传递或失效规则有误','已确认信息丢失，或旧条件被继续使用。<em>设计介入：作用域、交接与更新规则。</em>','accent')}
      ${band('模型或工程未满足要求','信息虽已提供，系统仍未正确使用或保存。<em>联合介入：执行证据、能力修复与回归场景。</em>','ink')}
    </div>
  </div>
  ${conclusion('归因方法','沿一次任务记录意图、已知条件、行动与结果，区分呈现问题、行为规则问题及实现问题。')}`,
  `原因分支为待验证分析示例；已有任务记录提供条件与证据字段。${anchor('evidence/case-corpus-20260818.json','15个公开案例原始语料')} · ${evidenceLink('primary-sources.md','Human–AI 设计方法')}`,
  {pattern:'sm2-figure-text'});

const sandboxGrid = `<div class="psb-grid"><div class="psb-head"><b>能力 / 机制</b><span>接入或内置行为</span></div>${sandbox.platforms.map(p=>`<div class="psb-head"><b>${escape(p.name)}</b><span>${escape(p.category)}</span></div>`).join('')}${sandbox.rows.map((r,i)=>`<div class="psb-rowhead" data-row="${i}"><b>${escape(r.title)}</b><span>${escape(r.description)}</span></div>${r.cells.map(c=>`<div class="psb-cell ${escape(c.status)}" data-row="${i}"><b>${escape(c.title)}</b><span>${escape(c.description)}</span></div>`).join('')}`).join('')}</div>`;
slide('完整沙盘把可装配入口与运行机制放在同一视野',2,`
  <div class="spot-wrap ux-sandbox">
    <div class="spot-note"><div class="psb-statuses">${Object.entries(sandbox.status_legend).map(([k,v])=>`<span><i class="psb-dot ${k}"></i>${escape(v)}</span>`).join('')}</div><div class="ux-spot-controls"><button data-focus="-1" aria-pressed="true">全貌</button>${sandboxFocus.map((g,i)=>`<button data-focus="${i}" aria-pressed="false">${g.label}</button>`).join('')}</div></div>
    <div class="spot-card card ux-sandbox-card"><div class="ux-sandbox-scroll">${sandboxGrid}</div><aside id="sandboxCallout" class="spot-callout" hidden></aside></div><div id="sandboxRings" class="spot-rings" aria-hidden="true"></div>
  </div>`,
  `六平台既有沙盘快照，保留“未确认”与实现差异；本轮没有重新验证各平台最新支持。${evidenceLink('sandbox-snapshot.json','原始60格')} · ${anchor('../ai-development-behavior-system-report.html#14','原沙盘材料')}`,
  {className:'ux-sandbox-slide',pattern:'evidence-spotlight-matrix'});

slide('沿用沙盘的建设结论：统一领域内核，按平台装配',2,`
  <div class="ux-inherited-supply"><div class="ux-supply-core card"><div class="ux-eyebrow">原建设优先项</div><h2>项目规则 · 可引用知识 · MCP连接</h2><p>以项目约束、版本化事实和实时状态为基础供给；沉淀可重复方法与代码配置，支持首跑、纠错和验证。</p><div class="ux-supply-assets"><span>项目约束</span><span>事实与方法</span><span>模板／脚手架</span><span>状态与动作</span></div></div><div class="ux-supply-adapter"><h2>按平台适配</h2><p>同一内容内核按平台包装为Skill、Command、Plugin、专职Agent或Hook。六平台都有Skill对应面，仍需适配发现、安装和调用。</p><div class="ux-supply-assets"><span>发现／加载</span><span>授权／执行</span><span>反馈／交接</span></div></div></div>
  ${conclusion('建设边界','领域侧提供约束、方法和真实证据；平台提供运行机制。UX负责把调用前、中、后的要求设计清楚并共同验证。')}`,
  `继承既有“通用入口优先、增强入口适配”与资产分流结论。五平台旧版与六平台后续快照分开。${anchor('../operator-ai-journey-deck/index.html','原建设结论')} · ${anchor('../ai-development-behavior-system-report.html','六平台归纳与领域建设')}`,
  {pattern:'layered-architecture'});

slide('建设项已经明确，接下来把要求写成可检查的规格',2,`
  <div class="derive ux-derive">
    ${[
      ['既定建设项','signal',[['领域内容与方法','规则、事实单元、可重复方法、实时能力。'],['平台装配与协作','Command、Plugin、专职任务与事件检查。'],['状态与验证闭环','任务现场、证据回执、恢复和完成判断。']]],
      ['体验要求','cause',[['被正确选择','何时适用、缺什么条件、何时不用。'],['可理解与可控制','委派范围、权限、影响、交接和取消。'],['能判断与能继续','成功、部分、阻断、未知及下一动作。']]],
      ['规格设计','move',[['发现／执行合同','用途、条件、输入、授权与判断分支。'],['回执／恢复合同','产物、证据、原因、保留现场与升级。'],['完成合同','预期信号、未覆盖项、停止与任务验收。']]],
      ['共同交付','result',[['内容与调用规格','领域Owner确认方法；UX形成行为原型。'],['适配与异常回放','工程实现入口；UX验证前、中、后体验。'],['真实任务验证','测试和业务确认技术结果与用户收益。']]]
    ].map(([t,c,items],gi)=>`<div class="dgroup"><h2 class="dh">${t}</h2><div class="dcol ${c}"><div class="dseq">${items.map(([a,b],ri)=>`<div class="ditem" data-rel="derive-${gi}-${ri}"><span class="ux-rel-dot"></span><div><strong>${a}</strong><p>${b}</p></div></div>`).join('')}</div></div></div>`).join('')}
    <svg class="drel" aria-hidden="true"></svg>
  </div>`,
  `承接既有五类合同建议。${anchor('../ai-development-behavior-system-report.html','原合同分析')} · ${evidenceLink('design-contract-examples.md','五类规格样例')} · ${evidenceLink('sandbox-notes.md','十项映射')}`,
  {pattern:'derivation-column-flow',className:'derive-slide'});

function pairWorkPage(group, title, diagram, extra, foot) {
  const items = group.ids.map(id => work.find(w => w.id === id));
  slide(title,2,`<div class="ux-pair-layout"><div class="ux-pair-diagram card"><div class="ux-eyebrow">${group.label}</div>${diagram}${extra || ''}</div><div class="ux-pair-work">${items.map(w=>`<article class="ux-work-entry"><h2>${w.name}</h2><h3>${w.question}</h3><p>${w.intervention}</p><dl><div><dt>交付</dt><dd>${w.output}</dd></div><div><dt>验证</dt><dd>${w.test}</dd></div><div><dt>协作</dt><dd>${w.owner}</dd></div></dl></article>`).join('')}</div></div>`,foot,{pattern:'sm2-figure-text',kind:'建议'});
}
pairWorkPage(groups[0],'规则与知识：把任务条件变成可持续、可纠正的依据',`
  ${chain([['用户目标','任务约束与完成条件'],['适用依据','版本、来源与作用域'],['进入行动','条件匹配后选择方法']])}
  <div class="ux-feedback-line">新条件／矛盾信息 → 更新、失效或补问 → 回到适用判断</div>`,
  `${decision('规则决定','什么条件持续生效，何时被新决定取代？')}${decision('知识决定','这份资料是否适用于当前版本和环境？')}`,
  `既有检索研究支持信息连续性的任务级观察。${anchor('evidence/ai-usability/ai-usability-run-20260818.md','三任务记录')} · ${evidenceLink('sandbox-notes.md','逐项推导')}`);

pairWorkPage(groups[1],'方法与命令：设计任务如何启动、分支与结束',`
  ${chain([['显式发起','目标、范围和允许动作'],['采用方法','适用条件与缺项检查'],['执行分支','依据观察调整步骤']])}
  <div class="ux-method-gate">到达预期结果？<span>有证据 → 候选交付</span><span>无进展／不适用 → 停止、换路或升级</span></div>`,
  `${decision('同一意图','“帮我看看”与“修改并测试”需要不同授权范围。')}${decision('方法规格','条件、分支和退出标准比堆叠提示词更可检查。')}`,
  `方法及授权规则为设计建议，技术步骤由领域 Owner 确认。${evidenceLink('reuse-ledger.md','领域方法需求原声')} · ${anchor('../agent-tool-calling-reference.html','加载与作用域边界')}`);

pairWorkPage(groups[2],'工具与集成：让能力从发现到返回结果保持一致',`
  ${chain([['交付与发现','包内容、依赖、版本、生效'],['发起调用','输入、授权、成本与范围'],['解释返回','证据、产物、错误与下一步']])}
  <div class="ux-output-states"><span>有结果</span><span>部分完成</span><span>被阻断</span><span>仍未知</span></div>`,
  `${decision('接入不是使用','安装／连接成功之后，仍需核对实际可用能力。')}${decision('工具不是验收','调用返回成功之后，仍需检查任务条件与证据。')}`,
  `四种返回状态为任务层设计建议，不是 MCP 协议规定的通用状态枚举。${evidenceLink('primary-sources.md','MCP工具协议原文')} · ${evidenceLink('sandbox-notes.md','逐项推导')}`);

pairWorkPage(groups[3],'分工与关口：设计谁接手、凭什么放行与如何返回',`
  <div class="ux-team-graph"><div class="ux-team-source">任务负责人<br><small>目标 · 范围 · 现场</small></div><div class="ux-team-specialists"><div>诊断角色<small>返回线索与依据</small></div><div>实现角色<small>返回变更与条件</small></div><div>复核角色<small>返回覆盖与未决项</small></div></div><div class="ux-team-end">汇合与检查<br><small>证据冲突时保留分歧</small></div></div>
  <div class="ux-feedback-line">关口未满足 → 保留现场与原因 → 回负责人；必要时携证据升级人工专家</div>`,
  `${decision('协作设计','子任务返回事实与产物；不能靠“多数同意”代替验证。')}${decision('事件设计','动作前／后与停止时的关口，按风险与任务要求设置。')}`,
  `角色分工为示意；Expert Team 不等同可自定义 Subagent，人工专家另为升级路径。${evidenceLink('sandbox-notes.md','平台差异与角色边界')} · ${anchor('../agent-tool-calling-reference.html','生命周期与委派机制')}`);

pairWorkPage(groups[4],'运行与循环：把继续、停止和恢复变成可检查要求',`
  ${chain([['形成现场','目标、约束、权限与历史'],['行动与观察','执行工具并回填事实'],['继续或停止','进展、预算与用户介入']])}
  <div class="ux-feedback-line">观察回到下一轮；中断保存现场；结束之后另做业务验收</div>`,
  `${decision('运行体验要求','状态不冒充结果；用户改意图后，后续动作要更新。')}${decision('退出规则','重复失败、缺条件、超范围或无证据时怎样处理？')}`,
  `Harness 实现由工程负责；UI、规则和接口共同表达运行要求。任务内 Loop 不等于定时任务。${anchor('../agent-tool-calling-reference.html','API／Host／Task边界')}`);

slide('UI 的设计价值落在必要的表达、判断与控制时刻',3,`
  <div class="ux-touchline"><div class="ux-touch"><span>发起</span><h2>表达目标</h2><p>可编辑的条件与假设，明确委派范围。</p></div><i>→</i><div class="ux-touch hot"><span>执行中</span><h2>理解与介入</h2><p>进展、阻塞、影响范围；可以改意图或交还控制。</p></div><i>→</i><div class="ux-touch"><span>结果</span><h2>审查与采用</h2><p>Diff、来源、适用条件、已验证范围和未决项。</p></div></div>
  <div class="ux-result-example card"><div><span class="ux-eyebrow">结果的证据表达示例</span><h3>每项判断都能回到具体依据</h3></div><div><b>来源</b><p>原文与版本锚点</p></div><div><b>适用</b><p>条件匹配／缺条件</p></div><div><b>验证</b><p>实际检查／未覆盖项</p></div></div>
  ${conclusion('设计结论','对话、结构化产物和直接操作应围绕任务接续；证据标签只是其中一项，不替代行为与验证。')}`,
  `表达与控制需与任务规则、证据一致；具体界面仍需用户验证。${evidenceLink('primary-sources.md','公开监督研究与协议要求')} · ${evidenceLink('reuse-ledger.md','判断与补测证据')}`,
  {pattern:'sm2-figure-text'});

slide('一段纠错过程，需要同时设计判断、试改、验收与学习',3,`
  <div class="ux-case-flow">${chain([['定位事实','错误、已试动作、未知项'],['比较下一步','依据、代价与可逆性'],['试改与审阅','隔离尝试，检查具体变更'],['验证或继续','实际证据与未覆盖条件']])}</div>
  <div class="ux-case-design"><div class="ux-case-conditions"><h2>关键行为规则</h2>${band('需要解释时','在当前错误现场按需解释与试算；回到原任务时保留条件。')}${band('用户明确应用时','应用与检查分开；试改结果不冒充真实项目通过。','accent')}</div><div class="ux-case-artifact card"><div class="ux-eyebrow">设计交付示例</div><h2>行为状态与验收规格</h2><div class="ux-state-track"><span>候选修改</span><i>→</i><span>已应用</span><i>→</i><span class="pending">待验证</span></div><p>“已应用”不能自动变为“已验证”。每次结果保留输入、修改与检查范围；用户可取消、补测或继续理解。</p><div class="ux-tags"><span>对应问题02</span><span>对应问题03</span><span>对应问题04</span></div></div></div>`,
  `学习画布／Studio 只验证本地示例交互，尚非真实 AI 或 NPU 成效。${anchor('../ploy-interaction-lab/learning-canvas-story/proactive-interaction-review.md','既有交互与状态规格')} · ${evidenceLink('reuse-ledger.md','访谈依据')}`,
  {pattern:'sm2-figure-text',kind:'建议'});

slide('任务的连续性延伸到团队交接与公共经验复用',3,`
  <div class="ux-continuity-map"><div class="ux-continuity-origin"><span class="ux-eyebrow">当前任务</span><h2>决策与执行现场</h2><p>目标、版本、已试动作、变更、证据、未决风险。</p></div><div class="ux-continuity-paths"><div class="ux-continuity-lane"><span>团队交接</span>${chain([['带变更交接','保留选择理由和未决项'],['评审与接手','重建成本、追问与验证']])}<b>设计：交接合同与复核责任</b></div><div class="ux-continuity-lane public"><span>公共沉淀</span>${chain([['授权整理草稿','选择可共享内容与适用范围'],['发布与后续复用','引用、版本、维护与失效']])}<b>设计：分享流程与知识生命周期</b></div></div></div>`,
  `公开案例证明经验可以跨时间复用；AI 导致回流下降仍为待验证假设。${anchor('../ai-development-behavior-system-report-evidence/problem-screenshots/public-knowledge-scope-evidence-20260928.md','公开经验与后来者证据')} · ${evidenceLink('reuse-ledger.md','问题05／06证据范围')}`,
  {pattern:'sm2-figure-text'});

slide('设计工作的变化体现为交付对象与方法的扩展',3,`
  <div class="ux-work-map"><div class="ux-work-map-head"><b>既有能力</b><b>需要强化的工作</b><b>可评审的交付</b></div>${[
    ['用户研究与任务分析','观察委派、介入、误采纳与恢复','任务轨迹＋关键决策点'],
    ['交互与服务设计','定义系统主动性、权限及跨工具接续','行为规则＋服务／交接蓝图'],
    ['信息与内容设计','组织适用条件、来源、上下文与失效','知识与上下文规格'],
    ['视觉与界面设计','表达状态、后果、证据与直接操作','必要UI＋产物表达规范'],
    ['可用性与评测','覆盖不确定结果、异常及真实验收','场景集＋评测协议']
  ].map(([a,b,c])=>`<div class="ux-work-map-row"><b>${a}</b><span>${b}</span><strong>${c}</strong></div>`).join('')}</div>
  ${conclusion('岗位判断','这些是建议的工作扩展与协作方式；需要实际项目检验分工和价值，不能直接宣布为行业岗位标准。')}`,
  `原有研究、服务和界面能力持续适用；本版提出可验证的工作扩展。${anchor('../ai-era-interface-value-shift-report.html#10','早期职责框架')} · ${evidenceLink('primary-sources.md','公开方法依据')}`,
  {pattern:'sm2-figure-text'});

slide('体验要求要与工程、安全和领域标准一起进入实现',3,`
  <div class="ux-collaboration"><div class="ux-collab-top"><span>UX</span><h2>定义用户需要、行为和可检查的体验标准</h2><p>什么时刻问、做、停、交接；用户应能理解、控制与判断什么。</p></div><div class="ux-collab-bridge">共同评审：任务范围 · 行为规格 · 实现约束 · 验收场景</div><div class="ux-collab-bottom"><div><b>产品／业务</b><p>确定价值、范围和业务完成条件。</p></div><div><b>工程／平台</b><p>实现工具、上下文、状态与运行可靠性。</p></div><div><b>领域／测试</b><p>确认知识、方法、测试与技术正确性。</p></div><div><b>安全／隐私</b><p>确定权限、数据使用与风险约束。</p></div></div></div>
  ${conclusion('共同交付','一份行为规格同时说明用户目标、实现接口、责任人和验收条件，避免停留在视觉交接。')}`,
  `这是建议协作方式，尚未开展设计团队职责访谈。${anchor('../ai-coding-platform-mechanism-report-leadership.html','既有任务与供给职责建议')} · ${anchor('../agent-tool-calling-reference.html','运行与验收边界')}`,
  {pattern:'layered-architecture'});

slide('设计流程要覆盖多种执行结果，并保留可回溯的规则',4,`
  ${chain([['观察任务','人、AI、工具的实际轨迹'],['提出要求','行为、状态、信息与权限'],['形成原型','规则／工具合同／UI一起试'],['场景回放','正常、冲突、失败与恢复']])}
  <div class="ux-scenario-strip"><h2>同一个目标，至少检查四类变化</h2><div><b>信息缺失</b><span>必要补问，不重复已知事实</span></div><div><b>条件改变</b><span>旧假设失效，后续行动更新</span></div><div><b>行动失败</b><span>保留现场，有据地换路或升级</span></div><div><b>证据不足</b><span>保留未知与补测，不提前结束</span></div></div>
  ${conclusion('交付方式','除界面原型之外，保存触发条件、状态变化、异常轨迹和预期行为，作为联合验收材料。')}`,
  `场景回放为设计建议；监督共创方法来自 arXiv 预印本，发表／同行评审状态未确认。${evidenceLink('primary-sources.md','原文与限制')}`,
  {pattern:'sm2-figure-text'});

slide('分别检验表达与行为设计，才能解释改善来自哪里',4,`
  <div class="ux-evaluation"><div class="ux-eval-grid"><div class="ux-eval-axis">界面表达增强 →</div><div class="ux-eval-cell"><span>A</span><h2>现有表达＋现有行为</h2><p>记录判断、失败与恢复的基线。</p></div><div class="ux-eval-cell"><span>B</span><h2>增强表达＋现有行为</h2><p>观察信息组织与控制呈现的贡献。</p></div><div class="ux-eval-cell"><span>C</span><h2>现有表达＋增强行为</h2><p>观察上下文、触发、停止与交接规则。</p></div><div class="ux-eval-cell accent"><span>D</span><h2>增强表达＋增强行为</h2><p>检查两类设计能否共同改善任务。</p></div><div class="ux-eval-y">系统行为增强 ↓</div></div><div class="ux-eval-metrics"><h2>评价用户与任务结果</h2>${band('判断质量','是否有依据地选下一步；是否错误采用结果。')}${band('控制与连续性','是否理解授权；是否重复解释；中断后恢复成本。')}${band('完成与学习','实际验收是否通过；是否能解释并迁移到新条件。')}</div></div>`,
  `拟议对照，尚未执行。尽量固定任务、模型、资料、权限与环境；真人交互与真实任务证据分别采集。`,
  {pattern:'sm2-figure-text',kind:'待验证'});

slide('下一步用真实任务检验工作交付，再确定持续投入',4,`
  <div class="ux-action-path">${[
    ['01','选任务','沿既有建设顺序，先以一个首跑任务连通知识、方法、模板、工具和验证，再扩展故障与协作。'],
    ['02','交规格','形成对应行为、上下文、方法、调用或交接规格，配必要的界面表达。'],
    ['03','做回放','记录实际规则、工具执行、人工判断与失败；与现状或匹配方案比较。'],
    ['04','定工作','按用户收益、实现代价与维护要求决定保留、调整或扩大设计工作。']
  ].map(([n,t,d])=>`<div class="ux-action"><span>${n}</span><h2>${t}</h2><p>${d}</p></div>`).join('')}</div>
  <div class="ux-action-deliverables"><b>首批可评审产出</b><span>完整十项设计映射</span><span>行为／信息规格</span><span>场景集与任务回放</span><span>职责与验证记录</span></div>
  ${conclusion('研究落点','UX 团队参与决定任务怎样被理解、推进、接手与验收，并用证据判断哪些工作值得投入。')}`,
  `优先级尚需具体任务与团队能力判断；没有装配收益、长期能力或真实 NPU 的新实验结果。${evidenceLink('analysis-map.md','分析推导与后续验证')}`,
  {pattern:'sm2-figure-text'});

slide('旧证据、机制事实与新设计建议各自承担不同作用',4,`
  <div class="ux-evidence-map">${[
    ['已有任务证据','单次访谈、公开案例、三任务检索','说明用户困难及条件；不直接证明岗位变化。','reuse-ledger.md'],
    ['机制与沙盘事实','六平台历史快照、工具协议与运行边界','说明干预位置与实现依赖；不证明有效性。','sandbox-notes.md'],
    ['公开研究与协议','人类监督共创研究、MCP规范','提供方法参考与实现约束；不替代本地验证。','primary-sources.md'],
    ['本轮研究综合','十项设计工作、协作、场景与评测','为可评审建议；职责与收益仍需实际项目验证。','analysis-map.md']
  ].map(([a,b,c,d])=>`<div class="ux-evidence-row"><b>${a}</b><div><h2>${b}</h2><p>${c}</p></div>${evidenceLink(d,'查看依据 ↗')}</div>`).join('')}</div>
  ${conclusion('证据边界','15个公开案例与15个模型模拟案例分开；模拟通过不等于用户收益，检索评分不等于答案正确率。')}`,
  `公开案例分类按原始语料5／6／4核对，不沿用旧页5／5／5；过往未核验调查比例不进入本版正文。`,
  {pattern:'sm2-figure-text'});

slide('研究资料保留可追溯的原声、记录与方法来源',4,`
  <div class="ux-source-list">
    <div><span>01</span><h2>任务与用户证据</h2><p>${evidenceLink('reuse-ledger.md','访谈摘录与复用台账')} · ${anchor('evidence/case-corpus-20260818.json','公开案例语料')} · ${anchor('evidence/ai-usability/ai-usability-run-20260818.md','三任务检索记录')}</p></div>
    <div><span>02</span><h2>沙盘与运行依据</h2><p>${evidenceLink('sandbox-snapshot.json','完整沙盘快照')} · ${evidenceLink('sandbox-notes.md','十项设计映射')} · ${anchor('../agent-tool-calling-reference.html','协议与运行机制')}</p></div>
    <div><span>03</span><h2>公开方法与研究综合</h2><p>${evidenceLink('primary-sources.md','一手来源、摘录与限制')} · ${evidenceLink('analysis-map.md','章节推导与待验证项')} · ${anchor('../ai-era-interface-value-shift-report.html','早期设计工作框架')}</p></div>
    <div><span>04</span><h2>原型与既有分析</h2><p>${anchor('../ploy-interaction-lab/learning-canvas-story/demo-implementation-status.md','原型实际范围')} · ${anchor('index.html','原研究材料')} · ${anchor('../ai-development-behavior-system-report-concise.html','六问题与原设计提案')}</p></div>
  </div>`,
  `资料整理：2026-10-13。公开方法用于分析与建议，不宣称已完成设计师岗位访谈或本轮真人对照。`,
  {pattern:'sm2-figure-text'});

const css = `
/* UX research edition — content-specific styles, report runtime retained. */
.ux-slide .head{gap:2vw;align-items:flex-start;margin-bottom:3vh}.ux-slide .head-l{min-width:0;flex:1}.ux-slide .ttl{line-height:1.25;font-size:var(--fs-h1);font-weight:800}.ux-slide .brand{min-width:0}.ux-slide .ux-kind{display:inline-flex;vertical-align:middle;margin-left:.8em;padding:.35em .7em;border-radius:999px;background:#e0e2fb;color:#494d9d;font-size:var(--fs-sm);white-space:nowrap}.ux-main{padding-bottom:4vh;gap:2vh;min-height:0;min-width:0;justify-content:center}.ux-main>*{min-height:0;min-width:0}.ux-slide .foot{font-size:var(--fs-sm);line-height:1.4;left:4vw;right:4vw;bottom:2vh;max-width:92vw;color:#6c7380}.ux-slide a{color:#4d55b0;text-decoration:underline;text-underline-offset:3px}.ux-slide a:focus-visible,.ux-slide button:focus-visible{outline:2px solid #5360cf;outline-offset:3px}.ux-main h2{font-size:var(--fs-h2);line-height:1.3}.ux-main h3{font-size:var(--fs-h3);line-height:1.35}.ux-main p{font-size:var(--fs-body);line-height:1.6;color:var(--ink-2)}.ux-main b,.ux-main strong{font-weight:750}.ux-eyebrow{font:600 var(--fs-sm)/1.3 'HarmonyOS Sans SC',sans-serif;color:#6b7390;margin-bottom:1.4vh}.ux-main .cx-concl{display:flex;align-items:center;gap:1vw;padding:1.6vh 1.5vw;flex:0 0 auto;background:var(--g-ink);border-radius:12px;color:#fff}.ux-main .cx-concl .ck{display:inline-flex;align-self:center;width:fit-content;flex:none;font-size:var(--fs-sm);padding:.4em .7em;background:#fff;color:#252a33;border-radius:999px;font-weight:800}.ux-main .cx-concl .cv{font-size:var(--fs-body);line-height:1.5}.ux-cover .cv-content{padding:5vh 5vw;z-index:1;position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between}.ux-cover .cv-center{margin:auto 0;width:84%}.ux-cover-title{font-size:clamp(42px,5.1vw,88px);font-weight:700;line-height:1.17;letter-spacing:-.035em;color:#fff;margin:2.5vh 0}.ux-cover .cv-lead{font-size:var(--fs-h2);line-height:1.7;max-width:48em;color:#c5c7da}.ux-cover .cv-bg{background:radial-gradient(ellipse at 75% 30%,#36466f,transparent 54%),radial-gradient(ellipse at 80% 85%,#2e245d,transparent 50%),#0b1020}.ux-cover-line{display:flex;align-items:center;gap:1.3vw;margin-top:4vh;color:#b3bed8;font-size:var(--fs-body)}.ux-cover-line i{font-style:normal;color:#747f9f}.ux-cover .cv-bot a{font-size:var(--fs-sm);color:#b7c2e0}.ux-slide .contents-directory{width:100%;max-width:1250px}.contents-directory.contents-5{grid-template-columns:repeat(5,minmax(0,1fr))}.ux-slide .directory-card{min-height:32vh}.ux-slide .directory-note{line-height:1.6}.ux-slide .directory-items{margin-bottom:3vh}
.ux-chain{display:grid;grid-template-columns:repeat(calc(var(--nodes) * 2 - 1),minmax(0,1fr));align-items:stretch;gap:.4vw}.ux-chain .ux-node{grid-column:span 1;padding:2vh 1vw;background:#fff;border:1px solid #dce1ea;border-radius:12px;display:flex;flex-direction:column;justify-content:center;min-height:12vh;min-width:0}.ux-chain{grid-template-columns:repeat(var(--nodes),minmax(0,1fr));gap:1.7vw;position:relative}.ux-chain .ux-arrow{position:absolute;display:none}.ux-chain .ux-node:not(:last-child)::after{content:'→';position:absolute;left:calc(100% + .35vw);top:50%;transform:translateY(-50%);color:#8792a5;font-size:var(--fs-h2)}.ux-chain .ux-node{position:relative}.ux-node b{font-size:var(--fs-h3);line-height:1.4;margin-bottom:.6vh}.ux-node p{line-height:1.5}.ux-node.accent{background:#e6e8fa}.ux-node.ink{background:var(--g-ink);color:#fff}.ux-node.ink p{color:#cad1e0}.ux-band{padding:1.8vh 1.3vw;background:#f8f9fc;border:1px solid #e2e5ee;border-radius:12px}.ux-band b{display:block;font-size:var(--fs-h3);margin-bottom:.5vh}.ux-band p{line-height:1.5}.ux-band em{display:block;font-style:normal;font-weight:650;color:#505fa0;margin-top:.65vh}.ux-band.accent{background:#e6e8fa;border-color:#ccd1f0}.ux-band.ink{background:var(--g-ink);border-color:#333b49;color:#fff}.ux-band.ink p,.ux-band.ink em{color:#d3dae9}
.ux-mode-map{display:grid;gap:1.7vh}.ux-stage-labels,.ux-mode-row{display:grid;grid-template-columns:1.05fr repeat(4,minmax(0,1fr));gap:1vw;align-items:stretch}.ux-stage-labels b{text-align:center;font-size:var(--fs-h3);color:#727c90}.ux-mode-name{display:flex;flex-direction:column;justify-content:center;font-size:var(--fs-h2);font-weight:800}.ux-mode-name small{font-size:var(--fs-sm);font-weight:500;color:#788090;margin-top:.5vh}.ux-mode-row>div:not(:first-child){min-height:12vh;display:flex;align-items:center;justify-content:center;padding:1.2vh 1vw;border-radius:12px;font-size:var(--fs-body);line-height:1.5}.ux-person{background:rgba(255,255,255,.7);border:1px solid #fff}.ux-system{background:#dfe5f7;border:1px solid #bdc9e9;color:#3d557c}.ux-shared{background:var(--g-ink);color:#fff}.ux-voc{column-count:3;column-gap:1.6vw;flex:0 1 auto;min-height:0}.ux-voc .voc-card{break-inside:avoid;display:flex;flex-direction:column;padding:3vh 1.7vw;gap:1.3vh;margin:0}.ux-voc .voc-q{font-size:var(--fs-h3);line-height:1.65;font-weight:500}.ux-voc .voc-meta{font-size:var(--fs-sm);color:#858c9c;margin-top:1.8vh}.ux-voc .ux-voc-reading{font-size:var(--fs-body);line-height:1.55;border-top:1px solid #dae0ea;padding-top:1.8vh}.ux-voc .accent{background:var(--g-accent);color:#fff}.ux-voc .hl{background:var(--g-ink);color:#fff}.ux-voc .accent .voc-q,.ux-voc .hl .voc-q,.ux-voc .accent .ux-voc-reading,.ux-voc .hl .ux-voc-reading{color:#fff}.ux-voc .accent .voc-meta,.ux-voc .hl .voc-meta{color:#d0d5ec}.ux-voc .qm{font:700 62px/.65 Georgia;opacity:.4;color:#8d96cf}.ux-cause-map{display:grid;grid-template-columns:.85fr 1.6fr;gap:2.5vw;align-items:center}.ux-cause-signal h2{font-size:clamp(26px,2.4vw,42px);line-height:1.4;margin-bottom:2vh}.ux-cause-branches{display:grid;gap:1.3vh}
.ux-sandbox-slide .ux-main{justify-content:center;gap:0;padding-bottom:3vh}.ux-sandbox{position:relative;min-width:0;min-height:0;max-height:75vh}.ux-sandbox .spot-note{display:flex;justify-content:space-between;align-items:center;gap:1vw;margin-bottom:1.2vh;flex-wrap:wrap}.psb-statuses{display:flex;gap:.8vw;flex-wrap:wrap;font-size:var(--fs-xs);color:#6e788b}.psb-statuses span{display:inline-flex;align-items:center;gap:.3em}.psb-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#6069c1}.psb-dot.install{background:#39a583}.psb-dot.limit{background:#d99b4b}.psb-dot.none{background:#dc6470}.psb-dot.unverified{background:#8f98a9}.ux-spot-controls{display:flex;gap:.35vw;flex-wrap:wrap}.ux-spot-controls button{border:1px solid #ced4e1;border-radius:999px;background:#f5f7fb;color:#606c82;font-size:var(--fs-sm);padding:.5em .7em;cursor:pointer}.ux-spot-controls button[aria-pressed=true]{background:#293344;color:#fff;border-color:#293344}.ux-sandbox-card{position:relative;padding:0;overflow:visible}.ux-sandbox-scroll{overflow:auto;border-radius:14px;max-height:62vh}.psb-grid{display:grid;grid-template-columns:1.34fr repeat(6,minmax(0,1fr));min-width:970px;min-height:0;border:1px solid rgba(255,255,255,.88);border-radius:14px;background:rgba(255,255,255,.56)}.psb-grid>div{min-width:0;min-height:0;padding:.5vh .6vw;border-right:1px solid rgba(120,130,150,.14);border-bottom:1px solid rgba(120,130,150,.14);transition:opacity .2s,background .2s}.psb-head{display:flex;min-height:4.8vh;flex-direction:column;justify-content:center;background:#252f3e;color:#fff}.psb-head b{font-size:var(--fs-sm);line-height:1.2}.psb-head span{color:#b8c1ce;font-size:var(--fs-xs);margin-top:.2vh}.psb-rowhead{display:flex;min-height:4.8vh;flex-direction:column;justify-content:center;background:#f4f6fa}.psb-rowhead b{font-size:var(--fs-sm);line-height:1.3}.psb-rowhead span{font-size:var(--fs-xs);color:#7a8597;line-height:1.25;margin-top:.25vh}.psb-cell{position:relative;display:flex;flex-direction:column;justify-content:center;padding-left:1.25vw!important;min-height:4.8vh}.psb-cell::before{content:'';position:absolute;top:50%;left:.4vw;width:6px;height:6px;border-radius:50%;transform:translateY(-50%);background:#5e69be}.psb-cell b{font-size:var(--fs-xs);line-height:1.3;color:#39475c}.psb-cell span{font-size:var(--fs-xs);line-height:1.3;color:#7c8799;margin-top:.3vh}.psb-cell.direct{background:#eff0fb}.psb-cell.install{background:#ecf6f1}.psb-cell.install::before{background:#39a583}.psb-cell.limit{background:#fcf3e6}.psb-cell.limit::before{background:#d99b4b}.psb-cell.none{background:#faeeee}.psb-cell.none::before{background:#dc6470}.psb-cell.unverified{background:#f0f2f5}.psb-cell.unverified::before{background:#8f98a9}.ux-sandbox-card.is-spot .psb-grid>div:not(.psb-head):not(.spot-on){opacity:.2}.ux-sandbox-card .spot-on{background:#e0e7f6!important}.spot-callout{position:absolute;z-index:3;width:min(430px,35vw);padding:2vh 1.5vw;background:#fff;border:1px solid #c4cce2;border-radius:12px;box-shadow:0 14px 40px rgba(35,45,75,.14)}.spot-callout h2{font-size:var(--fs-h2);margin-bottom:.8vh}.spot-callout p{font-size:var(--fs-body);line-height:1.5}.spot-callout b{display:block;font-size:var(--fs-body);margin-top:1vh;color:#4b5e9d}.spot-rings{position:absolute;inset:0;pointer-events:none}.spot-ring{position:absolute;border:2px dotted #606d90;border-radius:7px;background:transparent}.spot-callout[hidden]{display:none}
.ux-derive{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.7vw;min-height:0;height:51vh}.ux-derive .dgroup{display:grid;grid-template-rows:auto minmax(0,1fr);gap:1.1vh;min-height:0;min-width:0}.ux-derive .dh{font-size:var(--fs-h3);padding-left:1vw}.ux-derive .dcol{border-radius:13px;padding:0 1.7vw;min-height:0;min-width:0}.ux-derive .signal{background:rgba(255,255,255,.7)}.ux-derive .cause{background:var(--g-ink);color:#fff}.ux-derive .move{background:var(--g-accent);color:#fff}.ux-derive .result{background:#e1e4f7}.ux-derive .dseq{display:flex;flex-direction:column;height:100%;min-height:0}.ux-derive .ditem{display:grid;grid-template-columns:10px 1fr;gap:.7vw;position:relative}.ux-rel-dot{height:7px;width:7px;background:currentColor;border-radius:50%;margin-top:.6em;opacity:.5}.ux-derive strong{font-size:var(--fs-h3);line-height:1.4}.ux-derive p{font-size:var(--fs-sm);line-height:1.6;margin-top:.5vh}.ux-derive .cause p,.ux-derive .move p{color:#d8ddf0}.ux-derive .drel{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.ux-inherited-supply{display:grid;grid-template-columns:1.4fr 1fr;gap:2vw;align-items:stretch}.ux-supply-core,.ux-supply-adapter{padding:3vh 2vw;display:flex;flex-direction:column;justify-content:center;gap:2vh}.ux-supply-adapter{background:var(--g-accent);color:#fff;border-radius:15px}.ux-supply-adapter p{color:#dce3f6}.ux-supply-assets{display:flex;gap:.7vw;flex-wrap:wrap;margin-top:1vh}.ux-supply-assets span{font-size:var(--fs-body);padding:.6em .8em;border:1px solid #cfd8e6;border-radius:9px;background:#edf1f9}.ux-supply-adapter .ux-supply-assets span{color:#fff;background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22)}
.ux-pair-layout{display:grid;grid-template-columns:1.02fr 1fr;gap:2.2vw;align-items:stretch}.ux-pair-diagram{padding:2.3vh 1.7vw;display:flex;flex-direction:column;justify-content:center;gap:2vh}.ux-pair-diagram .ux-chain{gap:1.3vw}.ux-pair-diagram .ux-node{min-height:14vh;padding:1.4vh .8vw}.ux-feedback-line{font-size:var(--fs-body);line-height:1.5;padding:1.3vh .8vw;background:#e7ebf6;border:1px dashed #abb9d4;border-radius:10px;color:#536585}.ux-decision{display:grid;grid-template-columns:auto 1fr;gap:.9vw;align-items:start;border-top:1px solid #dbe0eb;padding-top:1.4vh;font-size:var(--fs-body);line-height:1.5}.ux-decision span{font-size:var(--fs-sm);color:#748099;padding-top:.2em}.ux-decision b{font-weight:550}.ux-pair-work{display:grid;gap:2vh}.ux-work-entry{padding:1.8vh 1.4vw;background:rgba(255,255,255,.57);border:1px solid rgba(255,255,255,.92);border-radius:13px;min-width:0}.ux-work-entry h2{color:#5260a0;font-size:var(--fs-h3);margin-bottom:.4vh}.ux-work-entry h3{margin-bottom:.65vh}.ux-work-entry p{margin-bottom:1.2vh;line-height:1.5}.ux-work-entry dl{display:grid;gap:.6vh}.ux-work-entry dl>div{display:grid;grid-template-columns:2.5em 1fr;gap:.7em;line-height:1.5;font-size:var(--fs-body)}.ux-work-entry dt{color:#8a92a2;font-size:var(--fs-sm);padding-top:.15em}.ux-work-entry dd{margin:0}.ux-method-gate{background:var(--g-ink);color:#fff;border-radius:12px;padding:1.5vh 1.2vw;font-size:var(--fs-h3)}.ux-method-gate span{display:block;color:#d1dbf1;font-size:var(--fs-body);line-height:1.5;margin-top:.6vh}.ux-output-states{display:grid;grid-template-columns:repeat(4,1fr);gap:.5vw}.ux-output-states span{padding:.8vh .4vw;text-align:center;border-radius:7px;font-size:var(--fs-sm);background:#e4eee8;color:#537760}.ux-output-states span:nth-child(2){background:#edf0f7;color:#5c6b85}.ux-output-states span:nth-child(3){background:#fae9e5;color:#9a5f59}.ux-output-states span:nth-child(4){background:#f4eedf;color:#8b7751}.ux-team-graph{display:grid;grid-template-columns:1fr 1.35fr 1fr;gap:1.7vw;align-items:center}.ux-team-source,.ux-team-end{padding:2.2vh 1vw;border:1px solid #c9d4e8;border-radius:12px;background:#e9eef9;font-size:var(--fs-h3);line-height:1.5;text-align:center;position:relative}.ux-team-source::after,.ux-team-specialists::after{content:'→';position:absolute;left:calc(100% + .3vw);top:50%;transform:translateY(-50%);color:#8291ab;font-size:var(--fs-h2)}.ux-team-specialists{display:grid;gap:1.4vh;position:relative}.ux-team-specialists>div{padding:1.3vh .8vw;background:#fff;border:1px solid #dce2ed;border-radius:10px;text-align:center;font-size:var(--fs-h3)}.ux-team-graph small{display:block;font-size:var(--fs-sm);color:#76839a;line-height:1.5;margin-top:.4vh}
.ux-touchline{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:1.5vw;align-items:stretch}.ux-touch{background:rgba(255,255,255,.7);border-radius:16px;padding:3vh 2vw}.ux-touch>span{font-size:var(--fs-sm);color:#7c8799}.ux-touch h2{font-size:clamp(23px,2.4vw,40px);margin:1.4vh 0}.ux-touch.hot{background:var(--g-accent);color:#fff}.ux-touch.hot>span,.ux-touch.hot p{color:#e0e3fb}.ux-touchline>i{align-self:center;font-style:normal;color:#8892a6;font-size:var(--fs-h2)}.ux-result-example{display:grid;grid-template-columns:1.6fr repeat(3,1fr);gap:1vw;padding:2vh 1.5vw;align-items:center}.ux-result-example>div{min-width:0}.ux-result-example>div:not(:first-child){border-left:1px solid #d5dce7;padding-left:1.1vw}.ux-result-example b{font-size:var(--fs-h3)}.ux-result-example p{margin-top:.6vh}.ux-case-design{display:grid;grid-template-columns:1fr 1fr;gap:2vw;align-items:stretch}.ux-case-conditions{display:grid;gap:1.1vh}.ux-case-artifact{padding:2vh 1.5vw}.ux-state-track{display:flex;align-items:center;gap:.6vw;flex-wrap:wrap;margin:2.5vh 0}.ux-state-track span{padding:.65em .7em;background:#e3ebf8;border-radius:8px;font-size:var(--fs-body);font-weight:650}.ux-state-track span.pending{background:#f7ecd5;color:#897042}.ux-state-track i{font-style:normal;color:#8692a8}.ux-tags{display:flex;gap:.5vw;flex-wrap:wrap;margin-top:2vh}.ux-tags span{border:1px solid #ced5e2;border-radius:999px;padding:.4em .7em;font-size:var(--fs-sm);color:#798398}
.ux-continuity-map{display:grid;grid-template-columns:.7fr 1.65fr;gap:3vw;align-items:center}.ux-continuity-origin{background:var(--g-ink);color:#fff;padding:3vh 2vw;border-radius:15px}.ux-continuity-origin .ux-eyebrow{color:#a5b6dd}.ux-continuity-origin p{color:#c2cde0;margin-top:1.6vh}.ux-continuity-paths{display:grid;gap:2vh}.ux-continuity-lane{background:rgba(255,255,255,.7);padding:2vh 1.5vw;border-radius:15px}.ux-continuity-lane>span{display:block;font-size:var(--fs-h3);font-weight:750;margin-bottom:1.1vh;color:#5366a4}.ux-continuity-lane.public{background:#e5f0ed}.ux-continuity-lane>b{display:block;font-size:var(--fs-body);margin-top:1.5vh;color:#657b78}.ux-continuity-lane .ux-node{min-height:10vh}
.ux-work-map{display:grid;gap:.9vh}.ux-work-map-head,.ux-work-map-row{display:grid;grid-template-columns:1fr 1.5fr 1.4fr;gap:2vw;align-items:center;min-width:0}.ux-work-map-head{font-size:var(--fs-sm);color:#8a93a3;padding:0 1.5vw;margin-bottom:.6vh}.ux-work-map-row{padding:1.5vh 1.5vw;background:rgba(255,255,255,.7);border-radius:11px;font-size:var(--fs-body);line-height:1.5}.ux-work-map-row b{font-size:var(--fs-h3)}.ux-work-map-row strong{color:#536aa0;font-weight:600}.ux-collaboration{display:grid;gap:2vh}.ux-collab-top{background:var(--g-accent);color:#fff;border-radius:15px;padding:2.6vh 2vw}.ux-collab-top>span{font:500 var(--fs-h2)/1.2 Inter;color:#b6beed;display:block;margin-bottom:1vh}.ux-collab-top p{color:#dde3f9;margin-top:1vh}.ux-collab-bridge{text-align:center;font-size:var(--fs-body);color:#6a7a97;padding:.5vh}.ux-collab-bottom{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2vw;background:rgba(255,255,255,.6);border-radius:15px;padding:2vh 1.7vw}.ux-collab-bottom>div:not(:last-child){border-right:1px solid #d5dce8;padding-right:1vw}.ux-collab-bottom b{font-size:var(--fs-h3)}.ux-collab-bottom p{margin-top:1vh}.ux-scenario-strip{padding:2vh 1.5vw;border-radius:13px;background:rgba(255,255,255,.7);display:grid;grid-template-columns:repeat(4,1fr);gap:1.3vw}.ux-scenario-strip h2{grid-column:1/-1;margin-bottom:.5vh}.ux-scenario-strip>div{display:flex;flex-direction:column;gap:.8vh;padding-top:1vh;border-top:1px solid #d7dfeb}.ux-scenario-strip b{font-size:var(--fs-h3)}.ux-scenario-strip span{font-size:var(--fs-body);line-height:1.6;color:#717d92}
.ux-evaluation{display:grid;grid-template-columns:1.1fr 1fr;gap:3vw;align-items:center}.ux-eval-grid{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:1.2vw;padding:3vh 0 3vh 2vw}.ux-eval-axis{position:absolute;top:-1vh;left:2vw;font-size:var(--fs-sm);color:#7c88a0}.ux-eval-y{position:absolute;left:-3vh;top:50%;writing-mode:vertical-rl;transform:translateY(-50%);font-size:var(--fs-sm);color:#7c88a0}.ux-eval-cell{background:rgba(255,255,255,.7);border-radius:15px;padding:2vh 1.4vw;min-height:16vh}.ux-eval-cell>span{font:300 46px/1 Inter;color:#a6b0c3;display:block;margin-bottom:1.2vh}.ux-eval-cell h2{font-size:var(--fs-h3);margin-bottom:.6vh}.ux-eval-cell.accent{background:var(--g-accent);color:#fff}.ux-eval-cell.accent>span{color:#b8c2ef}.ux-eval-cell.accent p{color:#d6def7}.ux-eval-metrics{display:grid;gap:1.3vh}
.ux-action-path{display:grid;grid-template-columns:repeat(4,1fr);gap:2vw}.ux-action{padding:2vh 1.4vw;border-top:2px solid #a5b6d4;position:relative}.ux-action>span{font:300 58px/1 'Barlow Condensed',sans-serif;color:#6b82ae}.ux-action h2{margin:1.6vh 0}.ux-action-deliverables{display:flex;align-items:center;gap:1.2vw;flex-wrap:wrap;padding:1.8vh 1.4vw;background:#e2e9f5;border-radius:10px;font-size:var(--fs-body)}.ux-action-deliverables>span{border-left:1px solid #b9c7df;padding-left:1vw}.ux-evidence-map{display:grid;gap:1.3vh}.ux-evidence-row{display:grid;grid-template-columns:.7fr 2.2fr .6fr;gap:2vw;align-items:center;background:rgba(255,255,255,.7);border-radius:12px;padding:1.7vh 1.5vw}.ux-evidence-row>b{font-size:var(--fs-h3);color:#6e7fa0}.ux-evidence-row h2{font-size:var(--fs-h3);margin-bottom:.45vh}.ux-evidence-row a{font-size:var(--fs-sm)}.ux-source-list{display:grid;gap:1.9vh}.ux-source-list>div{position:relative;padding:1.5vh 1.5vw 1.5vh 5.5vw;border-bottom:1px solid #ccd5e3}.ux-source-list>div>span{position:absolute;left:1.3vw;top:1.5vh;font:300 38px/1 Inter;color:#93a3bf}.ux-source-list p{margin-top:1.1vh;line-height:1.9}
body.overview .ux-slide .slide-inner{display:flex;flex-direction:column;padding:5vh 4vw}body.overview .ux-cover .slide-inner{padding:0}body.overview .ux-main{overflow:hidden!important}body.overview .ux-sandbox-scroll{overflow:hidden!important}
@media(max-width:1100px){.ux-slide .head{flex-direction:column;gap:1.5vh;margin-bottom:2.2vh}.ux-slide .section-tabs{margin-left:0}.ux-slide .section-tabs span{padding:.4em .6em}.ux-pair-layout{grid-template-columns:1fr 1fr;gap:1.5vw}.ux-work-entry{padding:1.5vh 1.3vw}.spot-callout{width:36vw}.ux-slide .foot{font-size:var(--fs-sm)}}
@media(max-width:800px){.ux-main{overflow:auto;justify-content:flex-start;flex:1;padding-bottom:1vh}.ux-slide .head{flex:0 0 auto}.ux-slide .foot{position:static;flex:0 0 auto;max-width:none;margin-top:1.5vh}.ux-slide{padding:3vh 4vw}.ux-cover-title{font-size:clamp(36px,6vw,65px)}.ux-cover .cv-center{width:100%}.ux-cover-line{gap:1.7vw;flex-wrap:wrap}.ux-mode-map{min-width:660px}.ux-voc{column-count:1;overflow:visible;flex:none}.ux-voc .voc-card{margin-bottom:2vh}.ux-cause-map,.ux-pair-layout,.ux-case-design,.ux-continuity-map,.ux-evaluation{grid-template-columns:1fr}.ux-pair-work{grid-template-columns:1fr 1fr}.ux-chain .ux-node{min-height:12vh}.ux-touchline{grid-template-columns:1fr;gap:1vh}.ux-touchline>i{display:none}.ux-touch h2{font-size:var(--fs-h2)}.ux-result-example{grid-template-columns:1fr 1fr}.ux-derive{min-width:660px;height:58vh}.ux-sandbox{max-height:none}.ux-sandbox-scroll{max-height:48vh}.spot-callout{position:relative!important;left:auto!important;top:auto!important;width:auto;margin:1vh;padding:2vh 3vw}.ux-evidence-row{grid-template-columns:1fr}.ux-action-path{grid-template-columns:repeat(2,1fr)}.ux-collab-bottom{grid-template-columns:1fr 1fr}.contents-directory.contents-5{min-width:680px}.ux-source-list>div{padding-left:10vw}.ux-work-map{min-width:660px}.ux-scenario-strip{grid-template-columns:1fr 1fr}.ux-mode-name small{font-size:var(--fs-sm)}.ux-sandbox .spot-rings{display:none}.ux-output-states{gap:1vw}.ux-slide .ux-kind{margin-top:.4em}}
@media(prefers-reduced-motion:reduce){html,body{scroll-behavior:auto}.psb-grid>div{transition:none}}
`;

const interactionScript = `
const sandboxSlide=document.querySelector('.ux-sandbox-slide');
const sandboxCard=sandboxSlide.querySelector('.ux-sandbox-card');
const sandboxWrap=sandboxSlide.querySelector('.spot-wrap');
const sandboxCallout=document.getElementById('sandboxCallout');
const sandboxRings=document.getElementById('sandboxRings');
const sandboxGroups=${JSON.stringify(sandboxFocus).replace(/</g,'\\u003c')};
const sandboxIndex=slides.indexOf(sandboxSlide);
let sandboxStep=-1;
function positionSandbox(){
 sandboxRings.replaceChildren();if(sandboxStep<0||document.body.classList.contains('overview'))return;
 const wr=sandboxWrap.getBoundingClientRect(),cr=sandboxCard.getBoundingClientRect();
 const boxes=sandboxGroups[sandboxStep].rows.map(row=>{const cells=[...sandboxCard.querySelectorAll('[data-row="'+row+'"]')];const rects=cells.map(e=>e.getBoundingClientRect());return {left:Math.min(...rects.map(r=>r.left)),right:Math.max(...rects.map(r=>r.right)),top:Math.min(...rects.map(r=>r.top)),bottom:Math.max(...rects.map(r=>r.bottom))};});
 for(const b of boxes){const ring=document.createElement('div');ring.className='spot-ring';Object.assign(ring.style,{left:(b.left-wr.left-3)+'px',top:(b.top-wr.top-3)+'px',width:(b.right-b.left+6)+'px',height:(b.bottom-b.top+6)+'px'});sandboxRings.appendChild(ring);}
 const cw=sandboxCallout.offsetWidth,ch=sandboxCallout.offsetHeight;
 const blankRows=[...sandboxCard.querySelectorAll('.psb-rowhead:not(.spot-on)')].map(e=>e.getBoundingClientRect());
 const highTop=Math.min(...boxes.map(b=>b.top)),highBottom=Math.max(...boxes.map(b=>b.bottom));
 let y=highBottom-cr.top+10;if(y+ch>cr.height-8)y=highTop-cr.top-ch-10;
 if(y<8){const candidate=blankRows.find(r=>r.top-cr.top>=8&&r.top+ch<cr.bottom-8);y=candidate?candidate.top-cr.top:8;}
 Object.assign(sandboxCallout.style,{left:Math.max(8,cr.width-cw-12)+'px',top:Math.min(Math.max(8,y),Math.max(8,cr.height-ch-8))+'px'});
}
function setSandboxStep(step,sync=true){sandboxStep=step;sandboxCard.classList.toggle('is-spot',step>=0);sandboxCard.querySelectorAll('[data-row]').forEach(e=>e.classList.toggle('spot-on',step>=0&&sandboxGroups[step].rows.includes(Number(e.dataset.row))));sandboxSlide.querySelectorAll('[data-focus]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.focus)===step)));sandboxCallout.hidden=step<0;if(step>=0){const g=sandboxGroups[step];sandboxCallout.innerHTML='<h2>'+g.label+'</h2><p>'+g.finding+'</p><b>设计交付：'+g.deliver+'</b>';}requestAnimationFrame(positionSandbox);if(sync&&idx===sandboxIndex)syncDeckHash();}
sandboxSlide.querySelectorAll('[data-focus]').forEach(b=>b.addEventListener('click',()=>setSandboxStep(Number(b.dataset.focus))));
sandboxCard.querySelector('.ux-sandbox-scroll').addEventListener('scroll',positionSandbox,{passive:true});
function deckHash(){return '#'+(idx+1)+(idx===sandboxIndex&&sandboxStep>=0?'-spot'+(sandboxStep+1):'');}
function syncDeckHash(){try{history.replaceState(null,'',deckHash());}catch{}}
function restoreHash(){const m=location.hash.match(/^#(\\d+)(?:-spot([1-3]))?$/);const page=m?Math.min(slides.length-1,Math.max(0,Number(m[1])-1)):0;setSandboxStep(page===sandboxIndex&&m&&m[2]?Number(m[2])-1:-1,false);if(CTRL){setActive(page);updateCurrent(page);}else{updateCurrent(page);slides[page].scrollIntoView({block:'start',behavior:'auto'});}}
const originalUpdateCurrent=updateCurrent;updateCurrent=function(i){originalUpdateCurrent(i);syncDeckHash();};
addEventListener('hashchange',restoreHash);
document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||document.body.classList.contains('overview')||idx!==sandboxIndex||['INPUT','TEXTAREA','SELECT','BUTTON'].includes(e.target.tagName))return;const dir=['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)?1:['ArrowUp','ArrowLeft','PageUp'].includes(e.key)?-1:0;if(!dir)return;const next=sandboxStep+dir;if(next>=-1&&next<sandboxGroups.length){e.preventDefault();e.stopImmediatePropagation();setSandboxStep(next);}},true);
const originalExitOverview=exitOverview;exitOverview=function(){originalExitOverview();updateCurrent(idx);setTimeout(()=>{positionSandbox();balanceDeriveColumns();renderDeriveRelations();},35);};
function balanceDeriveColumns(){document.querySelectorAll('.ux-derive .dseq').forEach(stack=>{const items=[...stack.children];Object.assign(stack.style,{paddingTop:'0px',paddingBottom:'0px',gap:'0px'});const total=items.reduce((a,e)=>a+e.getBoundingClientRect().height,0);const unit=Math.max(0,(stack.clientHeight-total)/(items.length+1));Object.assign(stack.style,{paddingTop:unit+'px',paddingBottom:unit+'px',gap:unit+'px'});});}
function renderDeriveRelations(){document.querySelectorAll('.ux-derive').forEach(flow=>{const r=flow.getBoundingClientRect(),svg=flow.querySelector('.drel');svg.setAttribute('viewBox','0 0 '+r.width+' '+r.height);svg.replaceChildren();for(let g=0;g<3;g++){for(let i=0;i<3;i++){const a=flow.querySelector('[data-rel="derive-'+g+'-'+i+'"]'),b=flow.querySelector('[data-rel="derive-'+(g+1)+'-'+i+'"]');const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();const x1=ar.right-r.left+3,x2=br.left-r.left-3,y1=ar.top+ar.height/2-r.top,y2=br.top+br.height/2-r.top;const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d','M '+x1+' '+y1+' C '+(x1+10)+' '+y1+' '+(x2-10)+' '+y2+' '+x2+' '+y2);p.setAttribute('fill','none');p.setAttribute('stroke',g===1?'#b3b9e2':'#abb5c6');p.setAttribute('stroke-width','1');svg.appendChild(p);}}});}
addEventListener('resize',()=>{positionSandbox();balanceDeriveColumns();renderDeriveRelations();});
document.fonts.ready.then(()=>{balanceDeriveColumns();renderDeriveRelations();positionSandbox();});
setSandboxStep(-1,false);requestAnimationFrame(()=>{restoreHash();balanceDeriveColumns();renderDeriveRelations();});
`;

let html = template;
html = html.replace('<title>汇报 PPT 模板</title>', '<title>Agent时代，UX设计师应设计什么 · 研究副本</title>');
const deckStart = html.indexOf('<div id="deck">');
const deckEnd = html.indexOf('<!-- 调色面板', deckStart);
if (deckStart < 0 || deckEnd < 0) throw new Error('Template deck markers unavailable');
html = html.slice(0, deckStart) + '<div id="deck">\n' + slides.join('\n\n') + '\n</div>\n\n' + html.slice(deckEnd);
html = html.replace('</head>', `<style>${css}</style>\n</head>`);
// The template initialization precedes restoration; preserve the incoming hash before it runs.
html = html.replace('<script>\nconst root=', '<script>\nconst incomingHash=location.hash;\nconst root=');
html = html.replace('updateCurrent(0);\nif(CTRL) setActive(0);', 'updateCurrent(0);\nif(CTRL) setActive(0);\n' + interactionScript);
const out = path.join(here, 'ux-design-work-in-agent-era.html');
fs.writeFileSync(out, html);

const map = `# Agent 时代 UX 工作研究：分析推导与复用记录\n\n日期：2026-10-13。副本：ux-design-work-in-agent-era.html。原研究 index.html 及两份行为报告保持原状态。\n\n## 核心问题\n\nAgent参与更多执行之后，UX设计师应介入哪些体验决定、交付什么，以及怎样与工程和领域团队验证？以既有沙盘建设结论为起点，展开各建设项怎样做。UI保持为必要交付之一。\n\n## 既有建设结论与继承关系\n\n- operator-ai-journey-deck/index.html:252–255原结论：先覆盖项目规则、可引用知识、MCP通用供给，再为Skill/Workflow、Command、Plugin/Extension、Custom/Subagent、Hook按平台装配适配。五平台口径不改写成当前市场验证。\n- ai-development-behavior-system-report.html:2330、3082–3084六平台后续沙盘：四类共通对应面、四类差异装配、平台Runtime/Loop内核。入口共通不等于同级建设优先级。\n- deck:307–309既有方法/知识/实时能力规格、320资产分流、375–376首跑先接知识+Skill+模板+MCP+验证再扩故障/协作、381–382体验与Owner分工，作为本轮怎么做的依据。\n- report:2227–2235既有发现、执行、回执、恢复、完成五份可移植合同，本版展开成具体体验字段、行为规则、场景与协作。\n- 用户举例仅表达分析深度，不作为范围或重点。完整十项均保留映射，但不重新将十项排成相同优先级或宣布都要从零建设。现有资产须核对已有条件/流程/产物，缺什么补什么。\n\n## 叙事地图\n\n| 章节 | 回答的问题 | 依据 | 本轮分析/建议 | 下一章 |\n|---|---|---|---|---|\n| 任务变化 | 人、AI和工具怎样分工？ | 单次访谈、既有任务、运行机制 | 人工/辅助/委派对照是概念分析，非频率统计 | 找体验决定因素 |\n| 体验成因 | 哪些问题由表达、行为、信息或实现产生？ | 公开任务条件、监督共创研究 | 同一表面问题按任务轨迹归因 | 承接既有建设取舍 |\n| 沙盘发力 | 已决定建设的东西具体如何做？ | 原建设结论、六平台历史60格、协议参考 | 用行为与五类合同细化内容内核和平台适配 | 定设计工作 |\n| 设计工作 | 交付什么，谁共同实现？ | 原型规则、早期工作框架、公开研究 | 行为、知识、调用、交接与UI规格；职责为建议 | 设计评测 |\n| 验证行动 | 如何证明有用并决定投入？ | 既有首跑顺序、记录口径、公开方法 | 可选对照、真实任务/用户回放 | 下一轮验证 |\n\n## 完整沙盘的工作映射\n\n| 能力/机制 | 体验问题 | UX介入 | 候选交付 | 验证 | 协作 |\n|---|---|---|---|---|---|\n${work.map(w=>`| ${w.name} | ${w.question} | ${w.intervention} | ${w.output} | ${w.test} | ${w.owner} |`).join('\n')}\n\nRuntime/Loop普遍内置不等于UX不能提出体验要求，也不等于UX直接装配或保证正确。模板/脚手架是原资产分流里的代码配置形态，Command只是可能的发起面；Plugin不是必经层。\n\n## 复用与新分析\n\n- 复用：访谈、15条公开语料、三项检索记录、原建设结论、沙盘状态、三层边界、原型触发/恢复规则。\n- 重释：六题作为任务案例，名称保持；平台产品形态与职业头衔不自动沿用为UX结论。\n- 新增综合：体验归因、既定建设项的具体规格/交付/验证、协作关系与表达/行为贡献对照。这些为分析和待验证建议。\n- 一手资料见primary-sources.md，支持研究方法与机制，不证明UX独占职责。HAX/PAIR未取得可核对正文，不作为本轮证据。\n- 尚未完成：设计团队访谈、真人/真实任务对照、长期学习/社区回流数据、真实接入/NPU收益。\n\n## 固定问题身份\n\n01 可装配能力难以按任务选配并有效使用；02 开发者难以判断和选择下一步行动；03 生成结果的可信性难以验证；04 任务完成不等于开发者能力增长；05 团队难以共享完整的决策背景；06 从论坛发帖到与 AI 对话，问题与解答不再自然沉淀于社区。\n\n## 页面清单\n\n${slides.map((s,i)=>`${i+1}. ${s.match(/data-title="([^"]+)"/)[1]}`).join('\n')}\n\n## 验收要求\n\n- 承接原建设项/取舍，展开如何做；完整映射并非重定优先级。\n- 证据/建议、公开案例/模拟分开；不使用旧分类或未核验比例。\n- 结论回答UX工作，保留与工程/领域的责任界限。\n- 完整deck runtime和沙盘聚焦hash恢复。\n- 原本地file浏览器读取被策略拒绝，不重开被拒原页；新副本先静态验证，正常发布后审阅独立HTTPS交付。\n`;
fs.writeFileSync(path.join(evidence, 'analysis-map.md'), map);
console.log(`Built ${slides.length} slides: ${out}`);
