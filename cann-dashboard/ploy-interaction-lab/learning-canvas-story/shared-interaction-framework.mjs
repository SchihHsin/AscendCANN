// Framework rules precede the photographed examples. Screenshots illustrate
// locations; a static frame is not evidence of arbitrary intent or concurrency.
const dir = 'images/shared-full-states-20261019/';
const architectureDir = 'images/interface-architecture-20261020/';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const framework = [
  {
    key:'task-boundary', title:'项目与任务、对话、内容工作区构成完整界面',
    thesis:'三栏各司其职，<br>围绕同一项任务协作',
    lead:'项目与任务确定工作范围；对话承接目标和过程；右侧内容工作区呈现当前需要查看的材料。学习、理解、试改与核对都落在具体任务里。',
    facts:[['左栏｜项目与任务','定位正在处理的任务；切换任务后回到各自的对话和工作现场。'],['中栏｜任务对话','表达目标、查看解释、讨论方案并接续行动。'],['右栏｜内容工作区','查看当前对象的正文和专属工具；需要时展开，不需要时收起以腾出对话空间。']],
    imagePath:'12-image-task.png', caption:'完整三栏界面：左侧定位任务，中间推进工作，右侧查看任务内容。',
    highlights:[{x:0,y:58,width:286,height:662,label:'左栏：项目与任务范围'},{x:286,y:58,width:494,height:662,label:'中栏：任务对话与过程'},{x:780,y:58,width:500,height:662,label:'右栏：内容工作区'}],
    principle:'三栏不是三种并列模式；它们是同一任务中相互衔接的工作区域。',
    evidence:'完整界面实拍与分区框选。'
  },
  {
    key:'intent-and-attention', title:'右侧工作区：公共标题栏、专属工具与正文',
    thesis:'管理位置保持稳定，<br>内容与工具按对象变化',
    lead:'右侧工作区由公共外壳、专属工具和正文构成。切换对象时外壳不变；元信息和操作随对象需要出现，正文默认聚焦一份内容。',
    facts:[['公共标题栏','一行承载“当前对象 ▾ / 全部内容 / 收起”，统一用于切换、管理和收起工作区。'],['专属工具区','讲解开关、复制、网页导航等工具跟随对象出现；不相关工具不占位。'],['正文容器','呈现当前对象的完整主体；试改、应用和核对贴着相关内容，给决策保留上下文。']],
    imagePath:'09-before-collapse.png', caption:'完整工作区实拍：标题栏、对象专属工具和正文各有清楚层级。',
    highlights:[{x:780,y:58,width:500,height:36,label:'公共标题栏'},{x:780,y:94,width:500,height:39,label:'当前对象专属工具'},{x:780,y:133,width:500,height:587,label:'单份当前内容的正文区域'}],
    principle:'当前对象元信息按需显示；右侧正文默认只有一份当前内容。',
    evidence:'完整界面实拍；主动提示不抢阅读或编辑焦点是交互规则，不由此图声称并发状态。'
  },
  {
    key:'workspace-navigation', title:'目录菜单按问题分组，类型只作内容标记',
    thesis:'快速切换当前对象，<br>按需进入更多内容',
    lead:'当前对象菜单直接列出已有材料，并按具体问题分组；类型用于辨认内容。目录不要求用户先选类别，更多工具通过“打开其他内容”按需进入。',
    facts:[['按问题分组','示例中的“尾块访问与范围”分组下列出线索解释、尝试记录、索引范围示例。'],['关联资料','“相关代码与资料”单独承接已有的 Ascend C 文档。'],['按需扩展','当前菜单只列出已有四项；其他工具从“打开其他内容”进入，不预先铺满界面。']],
    imagePath:'04-switcher.png', caption:'当前对象菜单：已有材料分组呈现，类型辅助辨认，不要求先选择类别。',
    highlights:[{x:833.7,y:58,width:446.3,height:36,label:'当前对象切换入口'},{x:833.7,y:94,width:446.3,height:249,label:'按问题分组的四项已有内容与“打开其他内容”'}],
    principle:'分组服务于具体问题；不承诺任意内容可自动归类。',
    evidence:'完整菜单实拍，示例仅包含当前已有四项内容。'
  },
  {
    key:'content-identity', title:'代码正文保留代码阅读与来源操作',
    thesis:'代码是正文，<br>工具围绕代码出现',
    lead:'代码对象保留语法阅读、行号和滚动结构。来源复制、关联讲解等操作靠近代码，不把代码压成一张通用信息卡。',
    facts:[['对象信息','标题栏标出当前代码对象；来源与只读说明位于正文上方。'],['代码阅读','行号、缩进和代码区域构成主要正文，便于浏览完整片段。'],['相关操作','复制来源、前往关联讲解等入口依附当前代码对象。']],
    imagePath:'02-code.png', caption:'代码型正文实拍：保留代码阅读结构及对象相关操作。',
    highlights:[{x:833.7,y:58,width:446.3,height:75,label:'当前代码对象和来源信息'},{x:850,y:150,width:412,height:365,label:'代码正文与行号'}],
    principle:'对象类型决定正文的阅读方式和专属工具。', evidence:'完整代码正文实拍。'
  },
  {
    key:'browser-content', title:'浏览器正文呈现实际页面与导航状态',
    thesis:'网页仍是网页，<br>来源和边界清楚可见',
    lead:'浏览器型内容保留地址栏、页面导航和网页自身的阅读结构。当前截图中的页面是本地已有参考页；原站拒绝官方 HiAscend iframe 加载。',
    facts:[['浏览器外壳','地址栏显示当前访问地址，正文区承载浏览器页面。'],['页面来源','本例打开仓库已有的 agent-tool-calling-reference.html 页面。'],['加载边界','官方 HiAscend iframe 被原站拒绝；截图只展示网页容器，不代表官方页面已载入。']],
    imagePath:'03-browser.png', caption:'浏览器型正文实拍：页面容器已打开本地参考页，未加载官方 HiAscend 内容。',
    highlights:[{x:833.7,y:94,width:446.3,height:626,label:'浏览器导航、地址栏与实际页面容器'}],
    principle:'页面容器的存在不代表其中目标站点已成功加载。', evidence:'完整浏览器状态实拍；当前内容是本地参考页，官方 iframe 加载被拒绝。'
  },
  {
    key:'diff-content', title:'Diff 正文呈现提案差异与明确操作',
    thesis:'差异可读，<br>应用动作清楚分开',
    lead:'Diff 型对象直接展示新增与删除内容，并在正文后提供应用或取消入口。查看提案与实际应用是两件不同的事。',
    facts:[['对象身份','标题区标出示例修改预览，并显示关联状态。'],['差异正文','删除行与新增行在同一代码上下文中对照阅读。'],['明确选择','用户可以应用到示例工作副本或取消提案；截图不代表真实项目已验证。']],
    imagePath:'05-diff.png', caption:'Diff 型正文实拍：提案变更与应用入口在同一对象中呈现。',
    highlights:[{x:833.7,y:58,width:446.3,height:105,label:'Diff 对象标题与提案状态'},{x:850,y:263,width:412,height:290,label:'删除与新增行的差异正文'},{x:850,y:570,width:412,height:72,label:'应用或取消提案的明确入口'}],
    principle:'审阅提案不等于应用；应用也不等于真实项目或 NPU 验证。', evidence:'完整 Diff 界面实拍，内容为示例工作副本。'
  },
  {
    key:'content-overview', title:'全部内容总览用于查找和管理已有对象',
    thesis:'总览帮助定位，<br>点选后回到正文',
    lead:'“全部内容”展示任务中的对象与关联，按问题分组；它是管理层，不是日常正文或常驻并列模式。用户可从此返回具体正文。',
    facts:[['问题分组','尾块访问与范围下列出相关图解、尝试记录、代码示例和修改预览。'],['资料分区','关联代码与资料独立分组，避免与问题对象混成一类。'],['回到正文','从总览选择具体对象，回到单对象内容工作区继续阅读。']],
    imagePath:'06-overview.png', caption:'完整总览实拍：任务内容按问题组织，并提供“返回正文”入口。',
    highlights:[{x:833.7,y:58,width:446.3,height:662,label:'全部内容管理层：分组、对象卡片与返回正文入口'}],
    principle:'总览是找内容的管理层；类型只作标记，不要求用户先选类别。', evidence:'完整总览实拍；当前为预置内容，不代表自动分类能力。'
  },
  {
    key:'temporary-and-return', title:'临时对照从当前对象发起，结束后返回原处',
    thesis:'需要时并排核对，<br>结束后回到原内容',
    lead:'对照只在需要比较两份材料时临时打开。宽区可以并排；窄区改为上下查看。对照不是与正文、总览并列常驻的模式。',
    facts:[['宽区并排','两份对象各自保留标题和正文，便于横向核对。'],['窄区适配','空间不足时采用上下排列，每份正文分别滚动；后续独立状态页展示窄栏。'],['返回起点','结束对照回到发起前的对象和阅读位置。']],
    imagePath:'08-compare-wide.png', caption:'宽区临时对照实拍：两份内容并列展示，工具和阅读位置分别保留。',
    highlights:[{x:564,y:58,width:716,height:36,label:'当前对象与临时对照顶栏'},{x:564,y:94,width:716,height:39,label:'本次对照对象选择和结束入口'},{x:564,y:133,width:358,height:587,label:'左侧对象正文'},{x:922,y:133,width:358,height:587,label:'右侧对象正文'}],
    principle:'对照有明确进入和退出位置；离开后继续原对象。', evidence:'完整宽栏对照实拍；后续独立状态页展示窄栏上下排列。'
  },
  {
    key:'workspace-collapsed', title:'收起内容工作区，归还对话空间',
    thesis:'收起右侧内容，<br>不丢当前工作位置',
    lead:'收起后右侧正文隐藏，对话区域获得空间；顶部“打开内容”入口保留。主动更新时不自动唤醒工作区，避免打断阅读或编辑。',
    facts:[['对话空间','原右侧区域收起，中央对话可继续使用。'],['恢复入口','“打开内容”位于界面右上角，保持可发现。'],['主动更新','更新可以提示存在，但不改变当前焦点；该规则不以此静态截图冒充并发实测。']],
    imagePath:'10-collapsed.png', caption:'整区收起实拍：对话空间恢复，右上保留“打开内容”入口。',
    highlights:[{x:286,y:58,width:994,height:662,label:'右侧收起后归还的工作空间'},{x:920,y:14,width:76,height:34,label:'右上角“打开内容”恢复入口'}],
    principle:'收起改变工作区显示，不替用户切换任务或内容。', evidence:'完整收起状态实拍；主动更新不抢焦点是交互规则说明。'
  },
  {
    key:'updates-without-interruption', title:'重新打开后恢复原参数与阅读位置',
    thesis:'恢复同一工作现场，<br>继续刚才的阅读',
    lead:'重新打开内容工作区后，当前对象、参数和滚动位置回到收起前状态。更新提示可以被发现，但不覆盖当前内容，也不自动切换对象。',
    facts:[['参数恢复','行数 17、列数 33、每块元素 32 保持原值。'],['阅读位置','接续收起前的同一份线索解释，本例回到先前阅读的正文开头。'],['焦点归属','提示变化与当前对象分开处理；由用户决定是否查看更新。']],
    imagePath:'11-restored.png', caption:'重新打开后，仍是同一份图解、同一组参数与原阅读位置。',
    highlights:[{x:800,y:502,width:462,height:218,label:'恢复后的参数值：17 / 33 / 32'},{x:780,y:133,width:500,height:333,label:'恢复原对象的阅读现场'}],
    principle:'恢复对象、参数和阅读位置；主动更新不夺取当前焦点。', evidence:'完整恢复状态实拍；本轮另核对图像图解的非零阅读位置恢复。'
  }
];
export const frameworkPageCount = framework.length;
export const frameworkPagesIndex = framework.map(item=>({key:item.key,title:item.title}));


const frame = page => `<figure class="framework-frame"><button type="button" class="capture-image" data-enlarge="${page.imagePath ? architectureDir+page.imagePath : dir+page.image+'.jpg'}" data-highlights="${esc(JSON.stringify(page.highlights))}" data-viewport="1280 720" aria-label="放大框架：${esc(page.title)}"><span class="capture-visual"><img src="${page.imagePath ? architectureDir+page.imagePath : dir+page.image+'.jpg'}" alt="${esc(page.caption)}" loading="lazy" decoding="async"><svg class="capture-annotations" viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true">${page.highlights.map((h,i)=>`<rect x="${h.x}" y="${h.y}" width="${h.width}" height="${h.height}" rx="5"/><circle cx="${h.x+13}" cy="${h.y+13}" r="11"/><text x="${h.x+13}" y="${h.y+18}">${i+1}</text>`).join('')}</svg></span></button><figcaption><strong>${page.caption}</strong><div class="framework-legend">${page.highlights.map((h,i)=>`<span>${i+1}. ${esc(h.label)}</span>`).join('')}</div><small>完整界面位置说明 · 点击放大</small></figcaption></figure>`;

export function interactionFrameworkPages(chapterTabs) {
  return framework.map((page,index)=>`<section class="slide s-gray shared-rules framework-rules" id="framework-${page.key}" data-framework="${page.key}" data-title="${page.title}"><div class="head"><div class="head-l"><div class="brand"><span class="ttl">${page.title}</span></div><div class="subttl">界面架构说明 · ${index+1} / ${framework.length}</div></div>${chapterTabs('C')}</div><div class="body-area"><div class="framework-layout"><div class="framework-copy"><h2>${page.thesis}</h2><p>${page.lead}</p><dl>${page.facts.map(([label,text])=>`<div><dt>${label}</dt><dd>${text}</dd></div>`).join('')}</dl><p class="framework-principle">${page.principle}</p></div>${frame(page)}</div></div></section>`);
}

export const frameworkCSS = `
.story-deck .framework-layout{display:grid;grid-template-columns:minmax(0,.3fr) minmax(0,.7fr);gap:2vw;width:100%;align-items:center}
.story-deck .framework-copy{display:grid;gap:1.5vh;align-content:center}
.story-deck .framework-copy h2{font-size:var(--fs-h2);font-weight:750;line-height:1.28;letter-spacing:-.025em}
.story-deck .shared-rules .framework-copy>p{margin:0;font-size:var(--fs-body);line-height:1.55}
.story-deck .framework-copy dl{display:grid;gap:1.4vh;margin:0}
.story-deck .framework-copy dl>div{display:grid;gap:.4vh}
.story-deck .framework-copy dt{font-size:var(--fs-body);line-height:1.4;font-weight:650;color:var(--ink)}
.story-deck .framework-copy dd{margin:0;font-size:var(--fs-body);line-height:1.55;color:var(--ink-2);overflow-wrap:anywhere}
.story-deck .shared-rules .framework-copy .framework-principle{border-top:1px solid #cfd4df;padding-top:1.2vh;color:#62658b}
.story-deck .framework-frame{display:grid;gap:1.1vh;margin:0;min-width:0}
.story-deck .framework-frame .capture-image img{max-height:62vh}
.story-deck .framework-frame figcaption{display:grid;gap:.7vh}
.story-deck .framework-frame figcaption>strong{font-size:var(--fs-body);font-weight:600;line-height:1.5;color:var(--ink-2)}
.story-deck .framework-legend{display:flex;flex-wrap:wrap;gap:.5vh 1.2vw;font-size:var(--fs-sm);line-height:1.4;color:#66709b}
.story-deck .framework-frame figcaption>small{font-size:var(--fs-sm);line-height:1.4;color:var(--ink-3)}
@media(max-height:730px) and (min-width:641px){.story-deck .framework-copy{gap:1vh}.story-deck .framework-copy dl{gap:1vh}.story-deck .framework-frame .capture-image img{max-height:57vh}}
@media(max-width:900px) and (min-width:641px){.story-deck .framework-layout{grid-template-columns:minmax(0,.34fr) minmax(0,.66fr);gap:1.5vw}}
@media(max-width:640px){.story-deck .framework-layout{grid-template-columns:1fr;gap:2.6vh;flex:0 0 auto}.story-deck .framework-rules .body-area{display:block;overflow-y:auto;overscroll-behavior:contain;padding-top:1vh;padding-bottom:5vh}.story-deck .framework-copy{gap:1.4vh}.story-deck .framework-copy dl{gap:1.4vh}.story-deck .framework-frame .capture-image img{max-height:none}.story-deck .framework-legend{gap:.6vh 2vw}}
`;
