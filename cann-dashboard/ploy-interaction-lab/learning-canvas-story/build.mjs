import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {stories} from './story-data.mjs';
import {introPages,introCSS} from './intro.mjs';
import {sharedInteractionPages,sharedInteractionCSS,sharedInteractionRuntime} from './shared-interaction-pages.mjs';
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
.story-deck .problem-wrap{width:min(100%,1100px);display:flex;flex-direction:column;gap:0;align-items:flex-start}
.story-deck .problem-title{font-size:clamp(34px,4vw,68px);line-height:1.18;letter-spacing:-.04em;max-width:none;white-space:nowrap;color:var(--ink)}
.story-deck .problem-copy{font-size:var(--fs-h2);line-height:1.7;color:var(--ink-2);max-width:34em;margin-top:1.5vh}
.story-deck .problem-bottom{width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:1.2vw;border-top:1px solid #cfd4dc;padding-top:2.2vh;margin-top:5vh;color:#7561cf;font-size:var(--fs-body)}
.story-deck .problem-bottom span{border:1px solid #c8c1e7;background:rgba(255,255,255,.62);border-radius:12px;padding:1.6vh 1.2vw;line-height:1.45}
.story-deck .problem-bottom span:last-child{background:#7561cf;border-color:#7561cf;color:#fff}
.story-deck .problem-bottom::before{content:'→';display:flex;align-items:center;justify-content:center;width:2.5vw;height:2.5vw;min-width:30px;min-height:30px;border-radius:50%;background:#e8e2ff;color:#7561cf;font-size:1.5em;font-weight:650}
.story-deck .s-cover .cv-bg{background:linear-gradient(90deg,rgba(8,6,18,.97) 0%,rgba(8,6,18,.87) 44%,rgba(8,6,18,.45)),url('images/A1.png') center/cover}
.story-deck .s-cover .cv-logo{height:5vh;width:auto;filter:brightness(0) invert(1)}
.story-deck .s-cover .cv-name{font-size:clamp(42px,4.4vw,76px);line-height:1.14;max-width:18ch;letter-spacing:-.03em}
.story-deck .s-cover .cv-name span{display:block;color:#c4b3ff}
.story-deck .s-cover .cv-name .cv-line{display:block;color:#fff;white-space:nowrap}
.story-deck .s-cover .cv-lead{font-size:var(--fs-h2);max-width:31em;line-height:1.7}
.story-deck .cover-links{display:flex;gap:1vw;margin-top:3vh}
.story-deck .cover-links a{border:1px solid #827896;background:rgba(255,255,255,.07);padding:1vh 1.3vw;border-radius:99px;color:#f0eaff;text-decoration:none;font-size:var(--fs-body)}
.story-deck .cover-links a:hover{background:#6551a9}
.story-deck #lightbox{position:fixed;inset:0;width:100vw;height:100vh;max-width:none;max-height:none;background:#09090dee;border:0;padding:56px 2vw 24px;z-index:9999;color:#fff}
.story-deck #lightbox::backdrop{background:#09090d}
.story-deck #lightbox[open]{display:flex;align-items:center;justify-content:center}
.story-deck #lightbox .lightbox-visual{position:relative;display:block;max-width:96vw;max-height:calc(100dvh - 96px)}
.story-deck #lightbox img{display:block;max-width:96vw;max-height:calc(100dvh - 96px);object-fit:contain}
.story-deck #lightbox .capture-annotations{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.story-deck #lightbox .capture-annotations rect{fill:none;stroke:#9ba7ff;stroke-width:2;vector-effect:non-scaling-stroke}
.story-deck #lightbox .capture-annotations text{fill:#fff;stroke:none;font:700 15px sans-serif;text-anchor:middle}.story-deck #lightbox .capture-annotations circle{fill:#666db2;stroke:none}
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
const detail=(story,s,i)=>`<section class="slide s-glow detail-step" data-template="glow-design-point" data-title="${s.id} · ${esc(s.stage)} · 设计说明"><div class="glow"></div><div class="chrome"><span>${esc(story.name)} · ${s.id} 设计说明</span><span>交互说明已更新 · 配图为早期提案</span></div>
<div class="inner"><div><h1 class="h-title">${esc(s.stage)}<span class="light"> · 用户如何接着做</span></h1><p class="body"><b>用户：</b>${esc(s.action)}</p>
<div class="points">${s.points.map((p,j)=>`<div class="point"><h2 class="pt-title">${j+1}. ${esc(p[0])}</h2><p class="pt-desc">${esc(p[1])}</p></div>`).join('')}</div>
<p class="continuity"><b>内容管理</b><br>${esc(s.canvas)}</p><p class="continuity"><b>下一步</b><br>${esc(s.next)}</p></div>
<button class="detail-image shot" data-enlarge="images/${s.id}.png" aria-label="放大${s.id}界面"><img src="images/${s.id}.png" alt="${esc(s.response)}"></button></div></section>`;
const extraHero=()=>`<section class="slide s-glow hero-step" data-template="glow-design-point" data-title="B6 · 任务中试改 · 大图"><div class="glow"></div><div class="hero-inner"><header class="hero-heading"><div><div class="step-meta">开发中学习 / B6 / 任务中试改</div><h1>在原任务现场先试改，再决定是否继续</h1></div><a href="#30">本步设计说明 →</a></header><button class="hero-shot" data-enlarge="images/B6-task-try.png" aria-label="查看 B6 任务中试改原图"><img src="images/B6-task-try.png" alt="在原任务现场先试改，再决定是否继续" decoding="async"></button><div class="hero-foot"><span>选中代码 · 参数试改 · 运行练习 · 结果关联</span><span>设计示意 · 点击图片放大</span></div></div></section>`;
const extraDetail=()=>`<section class="slide s-glow detail-step" data-template="glow-design-point" data-title="B6 · 任务中试改 · 设计说明"><div class="glow"></div><div class="chrome"><span>开发中学习 · B6 设计说明</span><span>交互说明更新 · 配图为早期提案</span></div><div class="inner"><div><h1 class="h-title">任务中试改<span class="light"> · 不离开原现场</span></h1><p class="body"><b>用户：</b>围绕当前输入维度问题，在图解中调整通道顺序或 batch，直接观察本次示例结果。</p><div class="points"><div class="point"><h2 class="pt-title">1. 图解内直接调参</h2><p class="pt-desc">少量参数直接出现在图解中，并关联当前代码行；不用先点击“试一下”或打开画布。</p></div><div class="point"><h2 class="pt-title">2. 结果同步可见</h2><p class="pt-desc">参数变化后，图形、形状对照、代码示例与本次结果就地更新，用户能直接看见变化。</p></div><div class="point"><h2 class="pt-title">3. 任务内容可管理</h2><p class="pt-desc">试算只影响当前示例／隔离副本；代码、图解与结果归属同一次尝试，项目修改仍经 Diff 审阅确认。</p></div></div><p class="continuity"><b>内容管理</b><br>普通内容即可承载解释与试改；自由画布仅按整理需求打开，阅读位置保持稳定。</p><p class="continuity"><b>下一步</b><br>用户表达“采用、检查”时直接接续对应操作；示例结果与原任务验证分别呈现。</p></div><button class="detail-image shot" data-enlarge="images/B6-task-try.png" aria-label="放大 B6 任务中试改界面"><img src="images/B6-task-try.png" alt="任务中试改界面"></button></div></section>`;
const cover=`<section class="slide s-cover" data-title="让学习在合适的时机发生"><div class="cv-bg"></div><div class="cv-overlay"></div><div class="cv-inner"><div class="cv-top"><img class="cv-logo" src="../../../Ascendlogo.svg" alt="昇腾"></div><div class="cv-main"><div class="cv-kicker">SPATIAL LEARNING WORKSPACE</div><h1 class="cv-name"><span class="cv-line">让学习在合适的时机</span><span>发生</span></h1><p class="cv-lead">主动学习与开发中学习的两条完整故事线<br>每一步：用户操作 · 界面响应 · 设计点 · 内容管理</p><div class="cover-links"><a href="#7">主动学习 →</a><a href="#18">开发中学习 →</a><a href="#31">共用机制 →</a></div></div><div class="cv-bot"><span>11 张故事图 · 6 组实拍状态 · 31 页</span></div></div></section>`;
const problem=`<section class="slide s-gray" data-title="AI 加速了开发，也带来了知识内化的新问题"><div class="head"><div class="head-l"><div class="brand"><span class="ttl">AI 加速了开发，也带来了知识内化的新问题</span></div><div class="subttl">问题陈述</div></div>${chapterTabs('P')}</div><div class="body-area"><div class="problem-wrap"><h1 class="problem-title">代码完成了，知识不一定留下</h1><p class="problem-copy">从“查找—理解—实践”的传统路径，到“描述目标—生成—验证”的 AI 开发方式，学习发生的方式正在变化。我们需要重新设计知识进入任务的时机。</p><div class="problem-bottom"><span>从“完成当前任务”到“形成可迁移的理解”</span><span>接下来：让学习进入任务过程</span></div></div></div><div class="foot">设计背景 · 学习不应只发生在任务之外</div></section>`;
const sections=[cover,problem,...introPages(chapterTabs)];
for(const story of stories){sections.push(journey(story));story.steps.forEach((s,i)=>sections.push(hero(story,s,i),detail(story,s,i)));}
sections.push(extraHero(),extraDetail());
sections.push(...sharedInteractionPages(chapterTabs));
sections[0]=sections[0].replace("31 页",`${sections.length} 页`);
template=template.replace('<title>汇报 PPT 模板</title>','<title>空间画布学习体验 · 两条完整故事线</title>').replace('<body>','<body class="story-deck">');
const start=template.indexOf('<div id="deck">');
const end=template.indexOf('<!-- 调色面板',start);
template=template.slice(0,start)+`<div id="deck">\n${sections.join('\n')}\n</div>\n`+template.slice(end);
template=template.replace('class="cv-inner"','class="cv-content"').replace('class="cv-main"','class="cv-center"');
template=template.replace('</style>',theme+introCSS+sharedInteractionCSS+'\n</style>');
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
const extra=`<dialog id="lightbox" aria-label="界面大图"><button id="closeLightbox" aria-label="关闭大图">关闭 ×</button><a id="originalImage" target="_blank" rel="noopener">打开原始图片 ↗</a><span class="lightbox-visual"><img id="largeImage" alt="学习 Workspace 界面大图"><svg class="capture-annotations" id="largeAnnotations" viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true"></svg></span></dialog>
<script>
${sharedInteractionRuntime}
const lightbox=document.getElementById('lightbox');let imageTrigger;
document.addEventListener('click',e=>{const b=e.target.closest('[data-enlarge]');if(!b||document.body.classList.contains('overview'))return;imageTrigger=b;const src=b.dataset.enlarge;document.getElementById('largeImage').src=src;document.getElementById('largeImage').alt=b.querySelector('img')?.alt||'完整界面截图';document.getElementById('originalImage').href=src;const svg=document.getElementById('largeAnnotations');const viewport=(b.dataset.viewport||'1280 720').split(/\\s+/);svg.setAttribute('viewBox','0 0 '+(Number(viewport[0])||1280)+' '+(Number(viewport[1])||720));svg.replaceChildren();try{const items=JSON.parse(b.dataset.highlights||'[]');items.forEach((h,i)=>{const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.setAttribute('x',h.x);rect.setAttribute('y',h.y);rect.setAttribute('width',h.width);rect.setAttribute('height',h.height);rect.setAttribute('rx','5');svg.append(rect);const marker=document.createElementNS('http://www.w3.org/2000/svg','circle');marker.setAttribute('cx',Number(h.x)+13);marker.setAttribute('cy',Number(h.y)+13);marker.setAttribute('r','11');svg.append(marker);const text=document.createElementNS('http://www.w3.org/2000/svg','text');text.setAttribute('x',Number(h.x)+13);text.setAttribute('y',Number(h.y)+18);text.textContent=String(i+1);svg.append(text);});}catch{}lightbox.showModal();});
document.getElementById('closeLightbox').onclick=()=>lightbox.close();
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
lightbox.addEventListener('close',()=>imageTrigger?.focus({preventScroll:true}));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{if(document.body.classList.contains('overview'))return;const n=parseInt(a.hash.slice(1),10);if(Number.isFinite(n)){e.preventDefault();go(n-1);}}));
</script>`;
template=template.replace('</body>',extra+'\n</body>');
await writeFile(root+'index.html',template);
console.log(`Built ${sections.length} slides from Report PPT runtime.`);
