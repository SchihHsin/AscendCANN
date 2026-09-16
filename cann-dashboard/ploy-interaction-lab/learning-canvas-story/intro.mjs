// Evidence-first introduction. Product evidence and proposed learning GUI are explicitly separated.
export const introCSS=`
.story-deck .intro-page .sm2{display:grid;grid-template-columns:.62fr 1.38fr;gap:2.4vw;align-items:stretch;width:100%}
.story-deck .intro-page .sm2-left{display:flex;flex-direction:column;justify-content:center;gap:2vh}
.story-deck .intro-page h2{font-size:var(--fs-h1);line-height:1.3}
.story-deck .intro-page p{font-size:var(--fs-body);line-height:1.7;color:var(--ink-2)}
.story-deck .intro-page .cx-concl{background:var(--g-ink);color:white;border-radius:12px;padding:1.7vh 1.4vw;font-size:var(--fs-body);line-height:1.6}
.story-deck .intro-media{display:flex;flex-direction:column;justify-content:center;gap:1.2vh}
.story-deck .intro-shot{border:1px solid #d7d9e2;border-radius:14px;background:#fff;overflow:hidden;display:block;width:100%;height:53vh;cursor:zoom-in;padding:0}
.story-deck .intro-shot img,.story-deck .intro-shot svg{width:100%;height:100%;object-fit:contain;display:block}
.story-deck .intro-caption{font-size:var(--fs-sm);line-height:1.6;color:var(--ink-2)}
.story-deck .intro-labels{display:flex;gap:.7vw;flex-wrap:wrap}
.story-deck .intro-labels span{font-size:var(--fs-sm);padding:.6vh .8vw;background:#fff;border-radius:8px;color:var(--ink)}
.story-deck .intro-page .foot{font-size:var(--fs-sm);letter-spacing:0;left:4vw;right:4vw}
`;
export function introPages(tabs){
const img=(src,alt)=>`<button class="intro-shot" data-enlarge="${src}" aria-label="放大：${alt}"><img src="${src}" alt="${alt}"></button>`;
const page=(title,headline,body,conclusion,visual,caption,labels,footer)=>`<section class="slide s-gray intro-page" data-title="${title}" data-template="image-text-sm2"><div class="head"><div class="head-l"><div class="brand"><span class="ttl">${title}</span></div><div class="subttl">主动交互 · 从产品观察到设计选择</div></div>${tabs('P')}</div><div class="body-area"><div class="sm2"><div class="sm2-left"><h2>${headline}</h2>${body}<div class="cx-concl">${conclusion}</div></div><div class="intro-media">${visual}<div class="intro-labels">${labels.map(x=>`<span>${x}</span>`).join('')}</div><div class="intro-caption">${caption}</div></div></div></div><div class="foot">${footer}</div></section>`;
const product='../evidence/product-frames/company-42m27.png';
const overview=[[145,'流量下降：Needs input'],[521,'高参与度访问：Opportunity']].map(([y,label],i)=>`<button class="intro-shot" style="height:24vh" data-enlarge="${product}" aria-label="放大 ${label}"><svg viewBox="472 ${y} 397 117" role="img" aria-label="${label}，包含理由、Why this、Run Ploy 和关闭按钮"><defs><clipPath id="intro-crop-${i}"><rect x="472" y="${y}" width="397" height="117"/></clipPath></defs><image href="${product}" width="1228" height="768" clip-path="url(#intro-crop-${i})"/></svg></button>`).join('');
return [
page('Ploy 将观察到的变化，变成用户可以接手的行动','主动交互的起点：<br>AI 先发现值得处理的事',
'<p><b>出现时有情境：</b>Overview 将流量下降列为 Needs input，将高参与度访问列为 Opportunity。用户先看到“发生了什么”，再决定是否介入。</p><p><b>建议带着依据：</b>Persona 建议同时写出访问和事件行为，并以 Why this 标注关联对象。理由、对象与行动入口留在同一张卡片。</p><p><b>用户可以接住或关闭：</b>Run Ploy 紧贴建议，右上角有关闭入口。主动发现转化为可选择的行动，而非要求用户重新组织提示词。</p>',
'设计启发：用“变化 → 原因 → 下一步”组织主动建议，让用户能当场判断是否值得继续。',overview,
'官方演示 42:27 · 放大实际建议区域，点击查看完整原帧。画面显示建议及入口，未证明点击后的执行结果。',
['Needs input / Opportunity：区分性质','Why this：关联依据','Run Ploy / ×：行动与关闭'],
'H · 官方演示可见状态 · <a href="https://www.youtube.com/watch?v=jMrT76x2RM8&t=2547s" target="_blank" rel="noopener">观看对应视频 ↗</a> · 演示数字不代表实际业务收益'),
page('主动推进到哪里，由用户理解并控制','把“先做准备”和<br>“正式生效”分开',
'<p><b>持续服务有明确范围：</b>Agent permissions 直接说明该站点有哪些动作可以无需确认。主动性与授权放在同一套交互里。</p><p><b>预览可以先行：</b>Preview only 允许产出预览，并明确写出生产发布仍需确认。用户可委托准备工作，保留正式生效前的决定权。</p><p><b>更大权限说明后果：</b>Preview + Production 旁直接交代无需确认上线，黄色提示贴近选项。用户在选择时就能理解影响。</p>',
'迁移原则：准备学习材料、隔离练习、修改原项目分别表达范围；正式修改前展示 Diff 并确认。',
img('../evidence/visual-sample/01-publishing-scope-official.webp','Ploy 站点 Agent permissions：预览与生产发布权限'),
'官方文档产品截图 · 当前选中 Preview only，不表示首次默认值。点击查看完整大图；本轮未登录操作或执行发布。',
['站点级委托','预览 / 生产分层','后果紧邻选项'],
'H · <a href="https://docs.ploy.ai/publishing" target="_blank" rel="noopener">Publishing 官方说明 ↗</a> · 学习迁移为设计提案'),
page('任务型 Workspace，为主动协作保留连续现场','从围绕文件编辑，<br>扩展到围绕任务协作',
'<p>随着 AI 编码普及，开发环境正在探索将<b>目标表达、执行过程、产物审阅和反馈</b>组织在持续的任务中。IDE 仍承载专业编辑与调试，两种形态可以融合。</p><p><b>本方案选择：</b>左侧保留任务，中间延续对话，右侧呈现文件、日志与结果。用户与 AI 讨论的对象可见，新的建议能关联到具体现场。</p><p><b>对学习的意义：</b>开发遇到问题时，可以在同一任务里理解、练习，再回到原项目；主动学习也能使用相同的协作方式。</p>',
'Workspace 提供上下文连续性；主动建议仍需要可用信号、授权范围与用户介入点。',
img('images/B1.png','我们的 Workspace 提案：任务列表、对话、原文件和错误日志'),
'我们的界面提案（模拟），用于解释设计选择；并非 Ploy 或真实 IDE 截图，也不是开发者迁移比例的证据。',
['任务：持续上下文','对话：协商下一步','产物：共同检查'],
'设计判断 · 不宣称 IDE 被替代或所有开发者已迁移 · 后续两条故事线验证同一交互机制'),
page('让主动建议就近展开，学习内容按需组织','AI 提出下一步，<br>用户决定怎样展开',
'<p><b>情境中的邀请：</b>遇到输入维度错误后，AI 提出“解释并跟练”，同时保留“直接看修复”和关闭。用户决定此刻是否进入学习。</p><p><b>画布承接多种内容：</b>接受建议后，图解、视频或练习围绕当前对象展开；相关内容轻分组，需要比较时进入临时对照。</p><p><b>结束后回到任务：</b>完成的学习组可折叠、收纳和原位恢复；练习成果经 Diff 确认后用于项目，检查结果与原任务关联。</p>',
'主动交互负责把握介入时机；自由画布负责材料的展开、对照与收纳。两者在任务中衔接。',
img('images/A3.png','我们的学习画布：视频与图解、固定参考及收纳入口'),
'我们的界面提案（模拟）· 图示为接受学习后展开材料的状态。阅读时不自动重排；收纳与对照由用户触发。',
['接受后展开','相关材料轻分组','对照 / 收纳 / 恢复'],
'L · 学习迁移方案，非 Ploy 已有教学能力 · <a href="#6">进入主动学习故事线 →</a> · <a href="#17">进入开发中学习故事线 →</a>')
];
}
