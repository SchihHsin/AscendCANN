import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {stories} from './story-data.mjs';
import {introPages,introCSS} from './intro.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let template=await readFile(root+'source/deck-template.html','utf8');
const journeyTemplate=await readFile(root+'source/user-journey-template.html','utf8');
const journeyCSS=journeyTemplate.split('<style>')[1].split('</style>')[0];
// Keep the component CSS, not its document-level demo theme.
const jcss=journeyCSS.slice(journeyCSS.indexOf('.jrn-wrap'),journeyCSS.indexOf('.foot{'));
const theme=`
/* Story deck additions are scoped; complete Report PPT runtime remains below. */
.story-deck *{min-width:0;min-height:0}
html:has(body.story-deck.overview){scroll-snap-type:none;scroll-behavior:auto}
body.story-deck.overview{scroll-behavior:auto}
.story-deck .s-glow{--glow-color-int:.22;--glow-white-int:.08}
.story-deck .hero-step{padding:0}
.story-deck .hero-inner{position:absolute;inset:2.4vh 3vw 2vh;display:grid;grid-template-rows:6.8vh minmax(0,1fr) 2.6vh;gap:1vh;z-index:1}
.story-deck .hero-heading{display:flex;align-items:center;justify-content:space-between;gap:2vw}
.story-deck .hero-heading h1{font-size:var(--fs-h1);line-height:1.2;color:#e5dcff;font-weight:650}
.story-deck .step-meta{font-size:var(--fs-sm);color:#a5a0b4;margin-bottom:.35vh}
.story-deck .hero-heading a,.story-deck .hero-foot a{color:#c4b8f9;text-decoration:none;font-size:var(--fs-sm)}
.story-deck .hero-shot{border:0;background:none;display:flex;align-items:center;justify-content:center;cursor:zoom-in;width:100%;height:83vh;padding:0}
.story-deck .hero-shot img{display:block;max-width:100%;width:auto;height:100%;object-fit:contain;border-radius:9px}
.story-deck .hero-foot{display:flex;justify-content:space-between;align-items:center;color:#95919f;font-size:var(--fs-sm)}
.story-deck .detail-step{padding:8vh 3vw 4vh}
.story-deck .detail-step .chrome{top:3vh;left:3vw;right:3vw;font-size:var(--fs-sm);letter-spacing:.04em}
.story-deck .detail-step .inner{grid-template-columns:.52fr 1.48fr;gap:2vw;align-items:center}
.story-deck .detail-step .h-title{font-size:var(--fs-h1);line-height:1.32}
.story-deck .detail-step .body{font-size:var(--fs-body);margin-bottom:2vh;line-height:1.6}
.story-deck .detail-step .points{gap:1.5vh}
.story-deck .detail-step .point{display:block}
.story-deck .detail-step .pt-title{font-size:var(--fs-h3);font-weight:650;margin-bottom:.35vh}
.story-deck .detail-step .pt-desc{font-size:var(--fs-body);line-height:1.55;color:#bbb7c7}
.story-deck .detail-step .shot{aspect-ratio:auto;width:100%;height:78vh;overflow:hidden;background:none;border:0;box-shadow:none}
.story-deck .detail-step .shot img{position:static;max-width:100%;width:100%;height:100%;object-fit:contain}
.story-deck .detail-step .continuity{border-top:1px solid #393540;margin-top:1.8vh;padding-top:1.3vh;font-size:var(--fs-body);line-height:1.5;color:#aaa6b7}
.story-deck .detail-step .continuity b{color:#ddd5f4;font-weight:600}
.story-deck .detail-step .detail-image{width:100%;border:0;background:none;cursor:zoom-in}
.story-deck .journey-slide .head{margin-bottom:1.2vh}
.story-deck .journey-body{height:76vh;display:flex;align-items:center}
${jcss}
.story-deck .jrn-wrap{width:100%;--jrn-cols:5}
.story-deck .jrn-ph{min-height:8vh;padding:1.1vh .9vw}
.story-deck .jrn-ph .pt{min-height:0;font-size:var(--fs-h3);margin-top:.4vh}
.story-deck .jrn-tc{min-height:8vh}
.story-deck .jrn-touch,.story-deck .jrn-fl,.story-deck .jrn-text,.story-deck .jrn-ot{font-size:var(--fs-body);line-height:1.4}
.story-deck .jrn-fc{min-height:21vh}
.story-deck .jrn-scr{height:12vh;border:0;background:none}
.story-deck .jrn-scr img{width:100%;height:100%;object-fit:contain}
.story-deck .jrn-grid.je{height:6vh}
.story-deck .jrn-ec{display:flex;align-items:center;justify-content:center;color:var(--ink-3);font-size:var(--fs-sm)}
.story-deck .jrn-pc,.story-deck .jrn-oc{min-height:9vh}
.story-deck .jrn-rn{font-size:var(--fs-sm)}
.story-deck .journey-sub{font-size:var(--fs-body);color:var(--ink-2);max-width:76ch;line-height:1.55}
.story-deck .journey-slide .foot{font-size:var(--fs-sm);letter-spacing:0;left:4vw;right:4vw}
.story-deck .summary-wrap{display:grid;gap:2vh;width:100%;align-content:center}
.story-deck .summary-table{border-collapse:separate;border-spacing:0;width:100%;background:rgba(255,255,255,.65);border:1px solid #fff;border-radius:14px;overflow:hidden}
.story-deck .summary-table th,.story-deck .summary-table td{text-align:left;padding:1.7vh 1.3vw;font-size:var(--fs-body);line-height:1.5;border-bottom:1px solid #dce0e7}
.story-deck .summary-table th{background:#22262f;color:#fff;font-weight:500}
.story-deck .summary-table td:first-child{font-weight:650;white-space:nowrap}
.story-deck .summary-table tr:last-child td{border-bottom:0}
.story-deck .summary-note{font-size:var(--fs-body);line-height:1.65;color:var(--ink-2)}
.story-deck .problem-wrap{width:min(100%,1100px);display:grid;grid-template-columns:auto minmax(0,1fr);gap:1.5vh 1.4vw;align-items:start}
.story-deck .problem-mark{grid-row:1 / span 3;color:#7561cf;font:650 clamp(18px,2vw,30px)/1.1 ui-monospace,monospace;padding-top:.7vh}
.story-deck .problem-title{font-size:clamp(34px,4vw,68px);line-height:1.18;letter-spacing:-.04em;max-width:18ch;color:var(--ink)}
.story-deck .problem-copy{font-size:var(--fs-h2);line-height:1.7;color:var(--ink-2);max-width:34em;margin-top:1.5vh}
.story-deck .problem-bottom{grid-column:2;display:flex;justify-content:space-between;gap:2vw;border-top:1px solid #cfd4dc;padding-top:1.5vh;margin-top:3vh;color:#7561cf;font-size:var(--fs-body)}
.story-deck .s-cover .cv-bg{background:linear-gradient(90deg,rgba(8,6,18,.97) 0%,rgba(8,6,18,.87) 44%,rgba(8,6,18,.45)),url('images/A1.png') center/cover}
.story-deck .s-cover .cv-logo{height:5vh;width:auto;filter:brightness(0) invert(1)}
.story-deck .s-cover .cv-name{font-size:clamp(42px,4.4vw,76px);line-height:1.14;max-width:18ch;letter-spacing:-.03em}
.story-deck .s-cover .cv-name span{display:block;color:#c4b3ff}
.story-deck .s-cover .cv-name .cv-line{display:block;color:#fff;white-space:nowrap}
.story-deck .s-cover .cv-lead{font-size:var(--fs-h2);max-width:31em;line-height:1.7}
.story-deck .cover-links{display:flex;gap:1vw;margin-top:3vh}
.story-deck .cover-links a{border:1px solid #827896;background:rgba(255,255,255,.07);padding:1vh 1.3vw;border-radius:99px;color:#f0eaff;text-decoration:none;font-size:var(--fs-body)}
.story-deck .cover-links a:hover{background:#6551a9}
.story-deck #lightbox{position:fixed;inset:0;width:100vw;height:100vh;max-width:none;max-height:none;background:#09090dee;border:0;padding:4vh 2vw;z-index:9999;color:#fff}
.story-deck #lightbox::backdrop{background:#09090d}
.story-deck #lightbox[open]{display:flex;align-items:center;justify-content:center}
.story-deck #lightbox img{max-width:96vw;max-height:92vh;object-fit:contain}
.story-deck #lightbox button{position:absolute;top:1vh;right:2vw;background:#292532;color:#fff;border:1px solid #666;border-radius:9px;padding:.8vh 1vw;font-size:var(--fs-body);cursor:pointer}
.story-deck #lightbox a{position:absolute;top:1.5vh;left:2vw;color:#ddd;font-size:var(--fs-sm)}
body.overview.story-deck .hero-step .slide-inner{padding:0}
body.overview.story-deck .detail-step .slide-inner{padding:8vh 3vw 4vh}
body.overview.story-deck .hero-shot,body.overview.story-deck .detail-image{pointer-events:none}
@media print{body.story-deck{overflow:visible;height:auto;background:#fff}.story-deck #controls,.story-deck #navDots{display:none}.story-deck .slide{break-after:page;height:100vh}.story-deck #lightbox{display:none}}
`;
const chapterTabs=active=>`<div class="section-tabs"><span class="${active==='P'?'active':''}">主动交互</span><span class="${active==='A'?'active':''}">主动学习</span><span class="${active==='B'?'active':''}">开发中学习</span><span class="${active==='C'?'active':''}">共用机制</span></div>`;
const phaseStart={A:8,B:19};
const journey = story => {
  const cells=story.steps;
  const row=(name,en,cls,inner)=>`<div class="jrn-grid ${cls}"><div class="jrn-rl"><div class="jrn-rn">${name}</div><div class="jrn-re">${en}</div></div>${cells.map(inner).join('')}</div>`;
  return `<section class="slide s-gray journey-slide" data-title="${esc(story.name)} · 目标旅程" data-template="user-journey">
  <div class="head"><div class="head-l"><div class="brand"><span class="ttl">${esc(story.title)}</span></div><div class="subttl">${esc(story.name)} · 目标体验提案</div></div>${chapterTabs(story.id)}</div>
  <p class="journey-sub">${esc(story.scope)}</p><div class="journey-body"><div class="jrn-wrap">
  ${row('阶段','STEP','',(s,i)=>`<div class="jrn-pw" style="--stage:#7561cf"><div class="jrn-ph"><div class="pn">${s.id}</div><div class="pt">${esc(s.stage)}</div></div></div>`)}
  ${row('触点','TOUCH','',s=>`<div class="jrn-tw"><div class="jrn-tc"><div class="jrn-touch">${esc(s.touch)}</div></div></div>`)}
  ${row('行为','ACTION','',(s,i)=>`<div class="jrn-fw"><div class="jrn-fc"><a class="jrn-scr" href="#${phaseStart[story.id]+i*2}"><img src="images/${s.id}.png" alt="${esc(s.stage)}状态图"></a><div class="jrn-fl">${esc(s.action)}</div></div></div>`)}
  ${row('情绪','EMOTION','je',()=>'<div class="jrn-ew"><div class="jrn-ec">待用户回放验证</div></div>')}
  ${row('风险','PAIN','',s=>`<div class="jrn-pw2"><div class="jrn-pc"><div class="jrn-text">${esc(s.pain)}</div></div></div>`)}
  ${row('设计响应','RESPONSE','',s=>`<div class="jrn-ow"><div class="jrn-oc"><div class="jrn-ot">${esc(s.opportunity)}</div></div></div>`)}
  </div></div><div class="foot">目标旅程，不代表实测行为或情绪数据。点击阶段缩略图进入大图；每一步后附设计说明。</div></section>`;
};
const hero=(story,s,i)=>`<section class="slide s-glow hero-step" data-template="glow-design-point" data-title="${s.id} · ${esc(s.stage)} · 大图">
<div class="glow"></div><div class="hero-inner"><header class="hero-heading"><div><div class="step-meta">${esc(story.name)} / ${s.id} / ${esc(s.stage)}</div><h1>${esc(s.title)}</h1></div><a href="#${phaseStart[story.id]+i*2+1}">本步设计说明 →</a></header>
<button class="hero-shot" data-enlarge="images/${s.id}.png" aria-label="查看${s.id}原图"><img src="images/${s.id}.png" alt="${esc(s.title)}" decoding="async"></button>
<div class="hero-foot"><span>${esc(s.points.map(p=>p[0]).join(' · '))}</span><span>设计示意 · 点击图片放大</span></div></div></section>`;
const detail=(story,s,i)=>`<section class="slide s-glow detail-step" data-template="glow-design-point" data-title="${s.id} · ${esc(s.stage)} · 设计说明"><div class="glow"></div><div class="chrome"><span>${esc(story.name)} · ${s.id} 设计说明</span><span>界面提案 / 非实际运行</span></div>
<div class="inner"><div><h1 class="h-title">${esc(s.stage)}<span class="light"> · 用户如何接着做</span></h1><p class="body"><b>用户：</b>${esc(s.action)}</p>
<div class="points">${s.points.map((p,j)=>`<div class="point"><h2 class="pt-title">${j+1}. ${esc(p[0])}</h2><p class="pt-desc">${esc(p[1])}</p></div>`).join('')}</div>
<p class="continuity"><b>画布管理</b><br>${esc(s.canvas)}</p><p class="continuity"><b>下一步</b><br>${esc(s.next)}</p></div>
<button class="detail-image shot" data-enlarge="images/${s.id}.png" aria-label="放大${s.id}界面"><img src="images/${s.id}.png" alt="${esc(s.response)}"></button></div></section>`;
const extraHero=()=>`<section class="slide s-glow hero-step" data-template="glow-design-point" data-title="B6 · 任务中试改 · 大图"><div class="glow"></div><div class="hero-inner"><header class="hero-heading"><div><div class="step-meta">开发中学习 / B6 / 任务中试改</div><h1>在原任务现场先试改，再决定是否继续</h1></div><a href="#30">本步设计说明 →</a></header><button class="hero-shot" data-enlarge="images/B6-task-try.png" aria-label="查看 B6 任务中试改原图"><img src="images/B6-task-try.png" alt="在原任务现场先试改，再决定是否继续" decoding="async"></button><div class="hero-foot"><span>选中代码 · 参数试改 · 运行练习 · 结果关联</span><span>设计示意 · 点击图片放大</span></div></div></section>`;
const extraDetail=()=>`<section class="slide s-glow detail-step" data-template="glow-design-point" data-title="B6 · 任务中试改 · 设计说明"><div class="glow"></div><div class="chrome"><span>开发中学习 · B6 设计说明</span><span>界面提案 / 非实际运行</span></div><div class="inner"><div><h1 class="h-title">任务中试改<span class="light"> · 不离开原现场</span></h1><p class="body"><b>用户：</b>在当前项目中定位输入维度问题，先在选中的代码行上调整通道顺序，再运行本步练习观察结果。</p><div class="points"><div class="point"><h2 class="pt-title">1. 就地修改</h2><p class="pt-desc">参数控件紧贴选中的代码行，用户可以先试改，不必跳出当前任务重建上下文。</p></div><div class="point"><h2 class="pt-title">2. 结果同步可见</h2><p class="pt-desc">运行练习后，代码、张量形状对照与可视化结果保持在同一画布中，便于理解修改带来的变化。</p></div><div class="point"><h2 class="pt-title">3. 任务内容可管理</h2><p class="pt-desc">“本任务内容”保留当前代码、图解和练习的关联；固定、对照、收纳等操作不改变原项目文件。</p></div></div><p class="continuity"><b>画布管理</b><br>只对当前任务内容做局部试改；原文件、练习结果与后续修改建议保持状态区分。</p><p class="continuity"><b>下一步</b><br>进入隔离练习或查看修改建议，再决定是否回到项目应用修改。</p></div><button class="detail-image shot" data-enlarge="images/B6-task-try.png" aria-label="放大 B6 任务中试改界面"><img src="images/B6-task-try.png" alt="任务中试改界面"></button></div></section>`;
const cover=`<section class="slide s-cover" data-title="让学习在合适的时机发生"><div class="cv-bg"></div><div class="cv-overlay"></div><div class="cv-inner"><div class="cv-top"><img class="cv-logo" src="../../../Ascendlogo.svg" alt="昇腾"></div><div class="cv-main"><div class="cv-kicker">SPATIAL LEARNING WORKSPACE</div><h1 class="cv-name"><span class="cv-line">让学习在合适的时机</span><span>发生</span></h1><p class="cv-lead">主动学习与开发中学习的两条完整故事线<br>每一步：用户操作 · 界面响应 · 设计点 · 画布管理</p><div class="cover-links"><a href="#7">主动学习 →</a><a href="#14">开发中学习 →</a><a href="#31">共用机制 →</a></div></div><div class="cv-bot"><span>10 张关键状态图 · 31 页 · 大图与设计说明配对</span></div></div></section>`;
const problem=`<section class="slide s-gray" data-title="AI 让开发更快，但知识未必留下"><div class="head"><div class="head-l"><div class="brand"><span class="ttl">AI 让开发更快，但知识未必留下</span></div><div class="subttl">问题陈述</div></div>${chapterTabs('P')}</div><div class="body-area"><div class="problem-wrap"><div class="problem-mark">01</div><h1 class="problem-title">AI 可以帮助开发者快速生成和修改代码，却不一定让知识留下。</h1><p class="problem-copy">当开发者依赖 AI 完成一次任务时，结果可能很快产生，但背后的原理、判断依据与排障方法未必被理解和记住。任务完成了，能力却不一定同步积累。</p><div class="problem-bottom"><span>从“完成当前任务”到“形成可迁移的理解”</span><span>接下来：让学习进入任务过程</span></div></div></div><div class="foot">设计背景 · 学习不应只发生在任务之外</div></section>`;
const rules=[
 ['自由展开','从当前问题或路径节点打开内容','新内容在相关对象附近展开；拖动／缩放由用户控制','A1、A3、B1、B2'],
 ['轻分组','同一段学习包含多个对象','保留组名和关联；内部对象可自由排放','A3、B2'],
 ['临时聚焦','用户选择需要并排对照的对象','仅选中内容进入对照；退出恢复原位置','A4、B3'],
 ['固定参考','操作时需要保留原文件或结果','参考留在可见位置，不随下一步被自动收起','A3、B2–B4'],
 ['折叠／收纳','完成当前活动或主动整理','折叠在画布留摘要；收纳移出画布但保留索引','A5、B4、B5'],
 ['恢复／撤销','需要复习，或刚才收错内容','返回同一组及其关系、原位置；当前内容不被替换','A5、B5']
];
const summary=`<section class="slide s-gray" data-title="一套画布管理动作，贯穿两条学习故事线"><div class="head"><div class="head-l"><div class="brand"><span class="ttl">一套画布管理动作，贯穿两条学习故事线</span></div><div class="subttl">共用机制</div></div>${chapterTabs('C')}</div><div class="body-area"><div class="summary-wrap"><table class="summary-table"><thead><tr><th>交互</th><th>何时发生</th><th>用户能看见与控制什么</th><th>对应步骤</th></tr></thead><tbody>${rules.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="summary-note"><b>稳定性规则：</b>阅读时不自动移动对象；完成、继续、退出对照或手动整理后才调整布局。收纳不等于删除，确认路径不等于应用项目代码。<br><b>验证重点：</b>用户能否找到原文件、区分副本与正式修改、恢复收纳内容，以及说清当前通过的是哪一项检查。</p></div></div><div class="foot">设计提案 · 尚未实现自由画布运行时 · <a href="../proactive-research.html#17">返回 Ploy 研究材料</a></div></section>`;
const sections=[cover,problem,...introPages(chapterTabs)];
for(const story of stories){sections.push(journey(story));story.steps.forEach((s,i)=>sections.push(hero(story,s,i),detail(story,s,i)));}
sections.push(extraHero(),extraDetail());
sections.push(summary);
template=template.replace('<title>汇报 PPT 模板</title>','<title>空间画布学习体验 · 两条完整故事线</title>').replace('<body>','<body class="story-deck">');
const start=template.indexOf('<div id="deck">');
const end=template.indexOf('<!-- 调色面板',start);
template=template.slice(0,start)+`<div id="deck">\n${sections.join('\n')}\n</div>\n`+template.slice(end);
template=template.replace('class="cv-inner"','class="cv-content"').replace('class="cv-main"','class="cv-center"');
template=template.replace('</style>',theme+introCSS+'\n</style>');
// The distributed template lacks the documented hash hook. Extend its existing runtime.
template=template.replace('idx=i; const s=slides[idx];','idx=i; const s=slides[idx];\n  if(!document.body.classList.contains("overview")) history.replaceState(null,"","#"+(idx+1));');
template=template.replace('let idx=0;','let idx=0;let restoringSlide=false;');
template=template.replace('if(e.isIntersecting&&e.intersectionRatio>=0.55)','if(!restoringSlide&&!document.body.classList.contains("overview")&&e.isIntersecting&&e.intersectionRatio>=0.55&&Math.abs(e.target.getBoundingClientRect().top)<innerHeight*.45)');
template=template.replace(/function exitOverview\(\)\{[^\n]+\}/,`function exitOverview(){const target=idx;restoringSlide=true;slides.forEach(s=>{const w=s.querySelector(':scope>.slide-inner');if(w){while(w.firstChild)s.insertBefore(w.firstChild,w);w.remove();}s.style.height='';});document.body.classList.remove('overview');balanceHeads();if(CTRL)setActive(target);else slides[target].scrollIntoView({block:'start',behavior:'instant'});updateCurrent(target);requestAnimationFrame(()=>requestAnimationFrame(()=>{restoringSlide=false;}));}`);
template=template.replace("document.addEventListener('keydown',e=>{","document.addEventListener('keydown',e=>{\n  if(document.getElementById('lightbox').open)return;");
template=template.replace("if(i>=0){idx=i;exitOverview();}","if(i>=0){idx=i;exitOverview();updateCurrent(i);}");
template=template.replace('window.scrollTo(0,0);\nslides.forEach(paintSlide);\nupdateCurrent(0);\nif(CTRL) setActive(0);',`const initial=Math.max(0,Math.min(slides.length-1,(parseInt(location.hash.slice(1),10)||1)-1));
window.scrollTo(0,0);slides.forEach(paintSlide);updateCurrent(initial);
if(CTRL) setActive(initial);else requestAnimationFrame(()=>slides[initial].scrollIntoView({block:'start',behavior:'instant'}));
addEventListener('hashchange',()=>{const n=parseInt(location.hash.slice(1),10);if(n>=1&&n<=slides.length)go(n-1);});`);
const extra=`<dialog id="lightbox" aria-label="界面大图"><button id="closeLightbox" aria-label="关闭大图">关闭 ×</button><a id="originalImage" target="_blank" rel="noopener">打开原始图片 ↗</a><img id="largeImage" alt="学习 Workspace 界面大图"></dialog>
<script>
const lightbox=document.getElementById('lightbox');let imageTrigger;
document.addEventListener('click',e=>{const b=e.target.closest('[data-enlarge]');if(!b||document.body.classList.contains('overview'))return;imageTrigger=b;document.getElementById('largeImage').src=b.dataset.enlarge;document.getElementById('originalImage').href=b.dataset.enlarge;lightbox.showModal();});
document.getElementById('closeLightbox').onclick=()=>lightbox.close();
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
lightbox.addEventListener('close',()=>imageTrigger?.focus({preventScroll:true}));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{if(document.body.classList.contains('overview'))return;const n=parseInt(a.hash.slice(1),10);if(Number.isFinite(n)){e.preventDefault();go(n-1);}}));
</script>`;
template=template.replace('</body>',extra+'\n</body>');
await writeFile(root+'index.html',template);
console.log(`Built ${sections.length} slides from Report PPT runtime.`);
