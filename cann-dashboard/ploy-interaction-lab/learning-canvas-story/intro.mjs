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
const overview=img('images/ploy-overview-user.png','用户提供的 Ploy Overview：For you 主动建议、Recents、Scheduled Ploybooks');
const crop=(file,box,id,alt)=>`<button class="intro-shot" data-enlarge="../evidence/${file}" aria-label="放大：${alt}"><svg viewBox="${box}" role="img" aria-label="${alt}"><defs><clipPath id="${id}"><rect x="${box.split(' ')[0]}" y="${box.split(' ')[1]}" width="${box.split(' ')[2]}" height="${box.split(' ')[3]}"/></clipPath></defs><image href="../evidence/${file}" width="1228" height="768" clip-path="url(#${id})"/></svg></button>`;
return [
page('Ploy 将观察到的变化，变成用户可以接手的行动','主动交互的起点：<br>AI 先发现值得处理的事',
'<p><b>返回即看见待处理事项：</b>For you 主动列出广告追踪缺失、流量下降等情况。Recents 与 Scheduled Ploybooks 同屏，区分近期工作与未来安排。</p><p><b>建议带着依据：</b>Google Ads 卡片解释已连接服务但未检测到追踪标签，并说明对转化归因的影响；Why this 标注关联来源。</p><p><b>用户可以接住或关闭：</b>Run Ploy 紧贴建议，右上角有关闭入口。理由、对象与下一步集中呈现，用户可当场决定是否继续。</p>',
'设计启发：用“变化 → 原因 → 下一步”组织主动建议，让用户能当场判断是否值得继续。',overview,
'用户提供的完整产品截图 · 点击放大。Scheduled 表示计划安排；截图未证明任务已执行或通知已送达。',
['For you：待处理事项','Why this：关联依据','Run Ploy / ×：行动与关闭'],
'可见界面观察 · <a href="images/ploy-overview-user.png" target="_blank">用户提供原图 ↗</a> · <a href="https://www.youtube.com/watch?v=jMrT76x2RM8" target="_blank" rel="noopener">相关官方演示 ↗</a> · 此图时间点未核定'),
page('主动推进到哪里，由用户理解并控制','把“先做准备”和<br>“正式生效”分开',
'<p><b>持续服务有明确范围：</b>Agent permissions 直接说明该站点有哪些动作可以无需确认。主动性与授权放在同一套交互里。</p><p><b>预览可以先行：</b>Preview only 允许产出预览，并明确写出生产发布仍需确认。用户可委托准备工作，保留正式生效前的决定权。</p><p><b>更大权限说明后果：</b>Preview + Production 旁直接交代无需确认上线，黄色提示贴近选项。用户在选择时就能理解影响。</p>',
'迁移原则：准备学习材料、隔离练习、修改原项目分别表达范围；正式修改前展示 Diff 并确认。',
img('../evidence/visual-sample/01-publishing-scope-official.webp','Ploy 站点 Agent permissions：预览与生产发布权限'),
'官方文档产品截图 · 当前选中 Preview only，不表示首次默认值。点击查看完整大图；本轮未登录操作或执行发布。',
['站点级委托','预览 / 生产分层','后果紧邻选项'],
'H · <a href="https://docs.ploy.ai/publishing" target="_blank" rel="noopener">Publishing 官方说明 ↗</a> · 学习迁移为设计提案'),
page('Workspace 将任务对话与产物放在同一现场','边讨论目标，<br>边检查实际产物',
'<p><b>产品观察：</b>Ploy 的 Getting Started 对话保留导入过程和后续意图选项，右侧同时展示实际页面预览。用户可以结合产物继续表达目标。</p><p><b>协作重心扩展：</b>在 AI 参与执行的工作方式中，目标表达、过程反馈与产物审阅成为连续活动。Workspace 可以承接这类任务协作，IDE 仍有专业编辑与调试价值。</p><p><b>对学习的启发：</b>解释所围绕的对象保持可见，用户可在对话与产物之间核对理解。这为任务中插入学习提供空间，而非要求先离开任务。</p>',
'分析判断：Workspace 的价值在于让讨论与工作对象持续关联；此例不代表开发者迁移比例。',
crop('ready-06m26.png','350 161 868 455','workspace-ref','Ploy 对话、意图选项与页面预览同屏'),
'Ploy 官方演示 06:26 · 产品区域局部，点击查看完整视频帧。图中产品为 Ploy，未冒充 Codex。',
['过程：留在对话','意图：继续选择','产物：同屏预览'],
'H · 可见布局；学习启发为推论 · <a href="https://www.youtube.com/watch?v=jMrT76x2RM8&t=386s" target="_blank" rel="noopener">对应官方演示 ↗</a>'),
page('在具体对象上表达意图，减少反复描述','从“说哪一处”，<br>到直接指向那一处',
'<p><b>直接指认对象：</b>Ploy 演示中，页面正文被选中并高亮，意见输入浮层出现在附近。用户可以指着产物补充要求。</p><p><b>局部输入接回对话：</b>浮层提供 Add 和 Send to chat；左侧保留任务名、既有修改摘要与对话。局部操作和连续协作有可见连接。</p><p><b>学习交互的机会：</b>代码、图解或结果中的疑问同样需要指向具体对象。可借鉴就地表达与上下文关联；自由分组、收纳恢复则需要在后续方案中另行验证。</p>',
'分析收束：主动建议帮助发现下一步，对象级交互帮助说清具体问题；二者共同减少上下文重建。',
crop('annotation-11m25.png','292 147 924 529','object-ref','Ploy 页面元素选区、就地意见浮层、Send to chat 与任务对话'),
'Ploy 官方演示 11:25 · 产品区域局部，点击查看完整视频帧。此图支持对象标注与对话关联，不作为自由画布能力证据。',
['选区：明确对象','浮层：就地表达','对话：延续上下文'],
'H · <a href="https://www.youtube.com/watch?v=jMrT76x2RM8&t=685s" target="_blank" rel="noopener">对应官方演示 ↗</a> · <a href="#6">接下来：目标用户旅程 →</a>')
];
}
