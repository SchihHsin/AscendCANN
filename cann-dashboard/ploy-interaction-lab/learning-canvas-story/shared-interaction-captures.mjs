// Actual states captured by operating a separate session of the current Demo.
// Keep proposed behavior distinct from what these screenshots demonstrate.
const dir = 'images/shared-states-20261019/';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const states = [
  {
    key:'object', title:'业务内容可以不同，管理动作保持一致',
    heading:'正文因任务而变，<br>操作预期保持一致',
    lead:'图解与 Diff 共用管理方式，各自保留对象身份；历史属于原对象。下面三步来自同一条图像推理任务。',
    rule:'关联帮助定位，不直接代表因果。没有检查环节的资料，不强加“待验证”；查看状态与业务状态分别记录。',
    context:'image-context-updated', contextAlt:'图像推理任务的项目、对话与按需内容三栏',
    steps:[
      ['image-tensor-correct','图解内理解与试改','RGB、轴顺序与 batch 在真实图解中联动；正文按业务组合。','轴 2,0,1 · 含 batch → [1,3,224,224]'],
      ['image-proposal','独立审阅修改','独立 Diff 保留来源尝试与条件，明确作用于浏览器示例副本。','图解中的试改 → 修改预览；确认后才应用'],
      ['image-current-info','找来源、关联与历史','统一小入口按需展开条件、来源与两条历史，不额外占据常驻区域。','当前条件：不含 batch；历史仍保留各自条件']
    ]
  },
  {
    key:'intent', title:'建议贴着当前问题出现，处理后收回摘要',
    heading:'先给必要依据，<br>再接上对应图解',
    lead:'这里实拍的是“报告失败”分支：回答先说明线索与证据缺口，再提供就近行动入口。',
    rule:'问“为什么”时回答与图解一起出现；阅读或编辑时保留现场；明确说“试改、采用、检查”时接续动作。当前是固定规则的局部演示，尚未接任意自然语言识别。',
    context:'addcustom-context', contextAlt:'AddCustom任务的对话及右侧尾块图解',
    steps:[
      ['addcustom-prompt','就近提供行动','浅蓝紫提示面贴着回答出现，说明建议的依据，并保留“根因尚未确认”。','黑色主按钮 · 轻色提示面 · 不循环闪烁'],
      ['addcustom-prompt-collapsed','收回成一行摘要','用户可收起建议，原对话继续阅读；短提示不新建一份内容。','收起提示保留再次展开入口'],
      ['addcustom-explanation','定位相关图解','从原建议定位尾块图解，参数、访问过程与代码关系在原任务内查看。','用户明确进入后，才接上可持续查看的内容']
    ]
  },
  {
    key:'navigation', title:'看全部、收起与唤醒，仍能找到刚才那份',
    heading:'一个默认查看面，<br>需要时看全部',
    lead:'总览与分类下拉复用同一份任务内容。整区收起只隐藏查看面，参数和历史仍保留。',
    rule:'打开、切换、返回和收起都是查看动作，不生成、不应用、不检查；后台结果不会自动重新打开右区。',
    context:'addcustom-context', contextAlt:'AddCustom任务在三栏中的位置',
    steps:[
      ['addcustom-overview','按问题看已有内容','总览露出主题、摘要、状态与关联；不用先选择解释类或检查类。','两案例使用预置主题映射；尚未自动形成关系地图'],
      ['navigation-collapsed','收起右侧继续对话','整区收起后，对话获得空间；顶栏“打开内容”负责再次唤醒。','收起前查看：10:27 的只读范围尝试'],
      ['navigation-restored','恢复同一份记录','再次打开，仍是 10:27 的只读尝试；没有误回当前参数或生成新记录。','原记录、原条件、阅读现场继续保留']
    ]
  },
  {
    key:'history', title:'主题帮助定位，历史留在原对象下面',
    heading:'保存有价值的尝试，<br>不铺满每次调用',
    lead:'两次形状尝试分别保留含 batch 与不含 batch 的条件。当前图解、尝试记录和修改提案可以互相定位。',
    rule:'历史在卡片行后跨整行展开，不把相邻卡片一起撑高；查看旧记录只读，不重新执行。当前主题是预置映射，关系自动排列仍待补齐。',
    context:'image-context-updated', contextAlt:'图像推理任务的主题总览',
    steps:[
      ['image-overview','先扫主题和摘要','同一主题聚合图解、尝试、提案与核对，类型只作为辅助信息。','摘要中可见历史数量、适用条件与关联入口'],
      ['image-history-expanded','在原对象下回看历史','两条历史跨整行展示，每条保留时间、条件、结论和对照入口。','10:29 含 batch；10:31 不含 batch'],
      ['image-history-readonly','打开一份只读快照','10:29 仍显示 [1,3,224,224]；后来的参数改动不会覆盖这份记录。','返回当前内容可继续试改；历史不会自动变成新尝试']
    ]
  },
  {
    key:'conditions', title:'应用不自动检查，新条件不沿用旧结果',
    heading:'看清这份结果，<br>对应哪一次条件',
    lead:'同一演示先采用含 batch 的修改，明确复核后，再取消 batch 生成新提案。三步分别保留业务状态。',
    rule:'检查携带输入、参数、版本与覆盖范围。示例预览、采用和检查各自可见；局部符合不代表真实工程或完整任务通过。',
    context:'image-context-updated', contextAlt:'图像推理任务中新提案与旧条件核对并存',
    steps:[
      ['image-check-pending','应用以后仍待复核','确认应用到示例副本，只改变采用状态；形状约定仍显示“待复核”。','应用 ≠ 检查；不因打开核对面就生成结果'],
      ['image-check-complete','明确操作才保存核对','发起“复核示例形状并带回对话”后，才保存含 batch 的单项符合记录。','仅浏览器形状示例；未执行 Python、模型或 NPU'],
      ['image-conditions-overview','新提案与旧核对分开','取消 batch 后的新提案标“待应用”；先前核对仍标“旧条件结果”。','新提案 [3,224,224]；旧核对 [1,3,224,224]']
    ]
  },
  {
    key:'compare', title:'宽栏并排，窄栏完整看一份，结束回原处',
    heading:'对照是临时动作，<br>双方条件始终清楚',
    lead:'从 10:29 记录选择与 10:31 对照。拖动三栏分隔线只改变布局，不改变对象、参数或版本。',
    rule:'右区 ≤620px 切换双方，宽栏并排；结束后回到进入对照前的内容或总览。固定参考供后续操作持续保留，与临时对照分开。',
    context:'compare-wide-context', contextAlt:'实际拖宽右区后的两份记录并排对照',
    steps:[
      ['compare-wide','宽栏同时比较','实际右区约 809px，两份记录并排，并列标明时间、batch 与输出形状。','同一对照关系；没有重新运行两份记录'],
      ['compare-narrow-current','窄栏完整看当前','实际右区约 505px，以分段切换选择一份，每份保留完整可读宽度。','当前：10:29 · 含 batch · [1,3,224,224]'],
      ['compare-narrow-reference','切换看另一份','切到 10:31，仍是同一组只读记录；无需返回总览再找一次。','对照：10:31 · 不含 batch · [3,224,224]'],
      ['compare-ended','结束回到原记录','结束对照，回到最初进入时的 10:29 记录，而非默认图解或最新尝试。','结束对照 ≠ 关闭内容；继续保留原现场']
    ]
  }
];

export function capturedInteractionPages(chapterTabs) {
  return states.map(page => `<section class="slide s-gray shared-rules captured-rules" data-rule="${page.key}" data-title="${esc(page.title)}" data-capture-sequence="${page.key}">
    <div class="head"><div class="head-l"><div class="brand"><span class="ttl">${page.title}</span></div><div class="subttl">共用机制 · Demo 连续状态</div></div>${chapterTabs('C')}</div>
    <div class="body-area"><div class="capture-layout">
      <div class="capture-copy"><h2>${page.heading}</h2><p>${page.lead}</p>
        <div class="capture-steps" role="group" aria-label="${esc(page.title)}的关键状态">${page.steps.map((step,index)=>`<button type="button" class="capture-step${index===0?' is-active':''}" data-capture-step="${index}" aria-pressed="${index===0}" aria-controls="capture-stage-${page.key}"><span class="capture-index">${String(index+1).padStart(2,'0')}</span><span><strong>${step[1]}</strong><span>${step[2]}</span></span></button>`).join('')}</div>
        <p class="capture-rule">${page.rule}</p>
        <button type="button" class="capture-context" data-enlarge="${dir+page.context}.png" aria-label="放大${esc(page.contextAlt)}"><img src="${dir+page.context}.png" alt="${esc(page.contextAlt)}" loading="lazy"><span>查看完整三栏位置 <span aria-hidden="true">↗</span></span></button>
      </div>
      <div class="capture-stage" id="capture-stage-${page.key}">${page.steps.map((step,index)=>`<figure class="capture-frame" data-capture-frame="${index}"${index?' hidden':''}><button type="button" class="capture-image" data-enlarge="${dir+step[0]}.png" aria-label="放大${esc(step[1])}的实际界面"><img src="${dir+step[0]}.png" alt="${esc(step[1]+'：'+step[2])}" decoding="async"${index?' loading="lazy"':''}></button><figcaption><span>${String(index+1).padStart(2,'0')} / ${String(page.steps.length).padStart(2,'0')}</span><strong>${step[1]}</strong><p>${step[3]}</p></figcaption></figure>`).join('')}<div class="capture-hint">点击步骤切换实际状态 · 点击界面查看原图</div></div>
    </div></div>
    <div class="foot">当前 Demo 操作实拍 · 2026-10-19 · 独立演示会话 · 本地浏览器示例，不代表真实工程执行</div>
  </section>`);
}

export const captureCSS = `
.story-deck .captured-rules .body-area{padding-bottom:3vh}
.story-deck .capture-layout{width:100%;display:grid;grid-template-columns:minmax(0,.88fr) minmax(0,1.12fr);gap:4vw;align-items:center}
.story-deck .capture-copy{display:grid;gap:1.6vh;align-content:center}
.story-deck .capture-copy h2{font-size:var(--fs-h1);line-height:1.25;letter-spacing:-.025em;font-weight:750;color:var(--ink)}
.story-deck .capture-copy>p{margin:0;font-size:var(--fs-body);line-height:1.6;color:var(--ink-2)}
.story-deck .capture-steps{display:grid;gap:.65vh}
.story-deck .capture-step{appearance:none;display:grid;grid-template-columns:2.2em minmax(0,1fr);gap:.7vw;align-items:start;width:100%;padding:1.1vh .9vw;text-align:left;border:1px solid transparent;border-radius:10px;color:var(--ink-2);background:transparent;cursor:pointer;font:inherit;transition:background .18s ease,border-color .18s ease}
.story-deck .capture-step .capture-index{font-size:var(--fs-sm);padding-top:.1em;color:var(--ink-3);font-variant-numeric:tabular-nums}
.story-deck .capture-step strong{display:block;font-size:var(--fs-body);line-height:1.45;font-weight:650;color:var(--ink)}
.story-deck .capture-step>span>span{display:block;margin-top:.35vh;font-size:var(--fs-body);line-height:1.5;color:var(--ink-2)}
.story-deck .capture-step.is-active{background:rgba(255,255,255,.9);border-color:#fff;box-shadow:0 4px 14px #25283a05}
.story-deck .capture-step.is-active .capture-index{color:#55506b;font-weight:700}
.story-deck .capture-step:hover{background:#ffffff70}
.story-deck .capture-step:focus-visible,.story-deck .capture-image:focus-visible,.story-deck .capture-context:focus-visible{outline:2px solid #7f7ca2;outline-offset:3px}
.story-deck .capture-copy .capture-rule{font-size:var(--fs-body);line-height:1.6;color:var(--ink-3);padding-top:1.1vh;border-top:1px solid #cfd4df}
.story-deck .capture-context{display:flex;align-items:center;gap:1vw;justify-self:start;width:fit-content;max-width:100%;border:0;padding:0;background:none;cursor:zoom-in;color:var(--ink-3);font-size:var(--fs-sm);text-align:left}
.story-deck .capture-context img{display:block;width:7.2vw;max-height:5vh;object-fit:contain;border:1px solid #d1d5dd;border-radius:4px}
.story-deck .capture-context>span{display:block;line-height:1.5}
.story-deck .capture-stage{margin:0;display:grid;gap:1.2vh;justify-items:center;align-items:center;min-width:0}
.story-deck .capture-frame{margin:0;width:100%;display:grid;gap:1.2vh;justify-items:center}
.story-deck .capture-frame[hidden]{display:none}
.story-deck .capture-image{appearance:none;padding:0;border:0;border-radius:12px;display:flex;align-items:center;justify-content:center;width:100%;height:60vh;background:transparent;cursor:zoom-in;overflow:hidden}
.story-deck .capture-image img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;border:1px solid #d5d8e0;border-radius:10px;box-shadow:0 15px 45px -25px #46516b40}
.story-deck .capture-frame figcaption{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.4vh .7vw;width:100%;max-width:620px;align-items:baseline}
.story-deck .capture-frame figcaption>span{color:var(--ink-3);font-size:var(--fs-sm);font-variant-numeric:tabular-nums}
.story-deck .capture-frame figcaption>strong{font-size:var(--fs-body);line-height:1.4;color:var(--ink);font-weight:650}
.story-deck .capture-frame figcaption>p{grid-column:2;margin:0;font-size:var(--fs-body);line-height:1.5;color:var(--ink-2)}
.story-deck .capture-hint{font-size:var(--fs-sm);line-height:1.5;color:var(--ink-3)}
body.overview.story-deck .capture-step,body.overview.story-deck .capture-image,body.overview.story-deck .capture-context{pointer-events:none}
@media(max-height:730px) and (min-width:641px){.story-deck .capture-copy{gap:1.1vh}.story-deck .capture-step{padding:.8vh .7vw}.story-deck .capture-image{height:57vh}.story-deck .capture-context img{max-height:4vh}}
@media(max-width:900px) and (min-width:641px){.story-deck .capture-layout{grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);gap:2.5vw}.story-deck .capture-copy h2{font-size:var(--fs-h2)}}
@media(max-width:640px){.story-deck .capture-layout{grid-template-columns:1fr;gap:3vh;flex:0 0 auto}.story-deck .captured-rules .body-area{display:block;padding-top:2vh}.story-deck .capture-copy{gap:1.5vh}.story-deck .capture-copy h2{font-size:var(--fs-h2)}.story-deck .capture-step{gap:2vw;padding:1.1vh 2vw}.story-deck .capture-context img{width:18vw;max-height:6vh}.story-deck .capture-stage{padding-bottom:2vh}.story-deck .capture-image{height:auto;max-height:none}.story-deck .capture-image img{width:auto;max-width:100%;max-height:70vh}.story-deck .capture-frame figcaption{gap:.5vh 2vw}.story-deck .capture-hint{font-size:var(--fs-sm)}}
@media(prefers-reduced-motion:reduce){.story-deck .capture-step{transition:none}}
@media print{.story-deck .capture-context,.story-deck .capture-hint{display:none}}
`;

export const captureRuntime = `
// Change photographed states without mutating the embedded Demo or the deck page.
document.querySelectorAll('[data-capture-sequence]').forEach(sequence=>{
  const buttons=[...sequence.querySelectorAll('[data-capture-step]')];
  const frames=[...sequence.querySelectorAll('[data-capture-frame]')];
  const select=index=>{
    buttons.forEach((button,i)=>{button.classList.toggle('is-active',i===index);button.setAttribute('aria-pressed',String(i===index));});
    frames.forEach((frame,i)=>frame.hidden=i!==index);
  };
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>select(index));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();event.stopPropagation();
      const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
      select(next);buttons[next].focus({preventScroll:true});
    });
  });
});
`;
