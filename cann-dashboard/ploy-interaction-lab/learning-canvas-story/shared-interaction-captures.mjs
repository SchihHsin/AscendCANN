// Actual states captured by operating a separate session of the current Demo.
// Each state is a separate deck page; photographs retain their complete viewport.
import {readFile} from 'node:fs/promises';
const dir = 'images/shared-full-states-20261019/';
let manifest={}, viewport={width:1280,height:720};
try { const data=JSON.parse(await readFile(new URL('./images/shared-full-states-20261019/manifest.json',import.meta.url),'utf8')); manifest=Object.fromEntries((data.captures||[]).map(item=>[item.name,item.highlights||[]])); if(Number(data.viewport?.width)>0&&Number(data.viewport?.height)>0)viewport={width:Number(data.viewport.width),height:Number(data.viewport.height)}; } catch {}
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const states = [
  {
    key:'object', label:'对象与统一管理',
    steps:[
      {
        key:'image-tensor-correct', action:'图解内理解与试改', title:'参数在原图解中试改，形状随条件联动',
        trigger:'调整轴顺序为 2,0,1，并保留 batch。',
        response:'图解同步解释 RGB、轴顺序与输出形状 [1,3,224,224]。',
        contract:'试改保留在当前任务与对象内，正文按业务需要组合。',
        note:'轴 2,0,1 · 含 batch → [1,3,224,224]'
      },
      {
        key:'image-proposal', action:'独立审阅修改', title:'试改先形成独立提案，审阅后再确认应用',
        trigger:'从当前图解生成转换修改预览。',
        response:'独立 Diff 保留来源尝试与条件，明确作用于浏览器示例副本。',
        contract:'生成、审阅与应用是分开的动作；确认后才改变采用状态。',
        note:'图解中的试改 → 修改预览；确认后才应用'
      },
      {
        key:'image-current-info', action:'找来源、关联与历史', title:'条件、来源与历史共用一个按需入口',
        trigger:'在当前图解打开内容信息。',
        response:'统一入口展开适用条件、来源、关联和两条历史。',
        contract:'历史属于原对象，各自保留条件；关联帮助定位，不代表因果。',
        note:'当前条件：不含 batch；历史仍保留各自条件'
      }
    ]
  },
  {
    key:'intent', label:'就近建议与摘要',
    steps:[
      {
        key:'addcustom-prompt', action:'就近提供行动', title:'先说明失败线索，再在回答旁提供行动',
        trigger:'用户报告 AddCustom 失败，尚未提供完整根因证据。',
        response:'浅蓝紫提示面贴着回答出现，交代建议依据与图解入口。',
        contract:'保留“根因尚未确认”；当前按固定意图规则演示。',
        note:'黑色主按钮 · 轻色提示面 · 不循环闪烁'
      },
      {
        key:'addcustom-prompt-collapsed', action:'收回成一行摘要', title:'建议收起后保留摘要，让原对话继续阅读',
        trigger:'用户收起回答中的建议面。',
        response:'建议缩成原位的一行摘要，保留再次展开入口。',
        contract:'收起只改变呈现，不新建内容，也不改变当前任务。',
        note:'收起提示保留再次展开入口'
      },
      {
        key:'addcustom-explanation', action:'定位相关图解', title:'明确进入后，图解接续当前问题与上下文',
        trigger:'用户从原建议打开尾块访问图解。',
        response:'右区展示相关参数、访问过程及其与代码的关系。',
        contract:'在原任务内持续查看与试改；阅读动作保留当前现场。',
        note:'用户明确进入后，才接上可持续查看的内容'
      }
    ]
  },
  {
    key:'navigation', label:'语义缩放与现场恢复',
    steps:[
      {
        key:'addcustom-map-topics', action:'缩小看全部主题', title:'缩小时收成主题，内容名称与状态仍可读',
        trigger:'在内容总览缩小至 40%。',
        response:'七项内容归入三个主题，主题内直接列出名称与状态。',
        contract:'缩放改变信息层级，字号保持可读；无需另选分类视图。',
        note:'40% 主题概览 · 七项内容归属三个主题'
      },
      {
        key:'addcustom-map-summary', action:'放大看关系与来源', title:'放大后展开摘要，来源与关系在同一总览中可见',
        trigger:'从主题概览放大至 70%。',
        response:'内容摘要自动排列，并呈现已记录的来源和关联线。',
        contract:'连线仅取明确关联；查看与缩放不生成、不应用、不检查。',
        note:'70% 内容摘要 · 连线不表示已确认因果'
      },
      {
        key:'map-navigation-before', action:'打开要保留的记录', title:'收起前明确当前记录，恢复才有确定落点',
        trigger:'打开尝试 1 · 12:01 的记录。',
        response:'右区展示输入 [17,33] 对应的只读范围快照。',
        contract:'保留正在查看的对象与记录身份，查看不会重新执行。',
        note:'收起前：尝试 1 · 12:01 · 输入 [17,33]'
      },
      {
        key:'map-navigation-collapsed', action:'收起继续当前对话', title:'右区收起后归还宽度，顶栏保留找回入口',
        trigger:'查看 12:01 记录时收起右区。',
        response:'对话获得完整宽度，顶栏“打开内容”负责再次唤醒。',
        contract:'收起是查看动作；原记录与阅读现场继续保留。',
        note:'收起前查看：尝试 1 · 12:01 的只读范围记录'
      },
      {
        key:'map-navigation-restored', action:'唤醒恢复同一记录', title:'重新打开回到同一记录，继续先前的阅读现场',
        trigger:'从顶栏点击“打开内容”。',
        response:'右区仍打开尝试 1 · 12:01 的只读记录。',
        contract:'唤醒恢复原对象，不产生新的尝试；回总览保留原缩放与位置。',
        note:'收起是查看动作，不停止、删除或重新执行'
      }
    ]
  },
  {
    key:'history', label:'主题与历史',
    steps:[
      {
        key:'image-overview', action:'先扫主题和摘要', title:'按任务主题组织内容，摘要先交代条件与状态',
        trigger:'回到图像推理任务的内容总览。',
        response:'同一主题聚合图解、尝试、提案与核对，摘要展示历史数量和条件。',
        contract:'类型作为辅助信息；主题帮助定位，历史仍归原对象。',
        note:'摘要中可见历史数量、适用条件与关联入口'
      },
      {
        key:'image-history-expanded', action:'在原对象下回看历史', title:'历史在原对象下跨行展开，每次条件分别保留',
        trigger:'展开形状尝试对象的两条历史。',
        response:'11:51 与 11:52 跨整行显示时间、条件、结论和对照入口。',
        contract:'历史不撑高相邻卡片；含 batch 与不含 batch 各自记录。',
        note:'11:51 含 batch；11:52 不含 batch'
      },
      {
        key:'image-history-readonly', action:'打开一份只读快照', title:'旧尝试保持只读，后续参数不会覆盖历史',
        trigger:'打开 11:51 的含 batch 历史。',
        response:'快照继续显示当时的条件与输出 [1,3,224,224]。',
        contract:'查看历史不重新执行；返回当前内容后才继续试改。',
        note:'返回当前内容可继续试改；历史不会自动变成新尝试'
      }
    ]
  },
  {
    key:'conditions', label:'条件与核对状态',
    steps:[
      {
        key:'image-check-pending', action:'应用以后仍待复核', title:'确认应用只改变采用状态，形状约定仍待复核',
        trigger:'确认将含 batch 的修改应用到示例副本。',
        response:'采用状态变为已应用，形状约定仍显示“待复核”。',
        contract:'应用与检查分别记录；打开核对面不会生成核对结果。',
        note:'应用 ≠ 检查；不因打开核对面就生成结果'
      },
      {
        key:'image-check-complete', action:'明确操作才保存核对', title:'明确发起复核后，才保存对应条件与覆盖范围',
        trigger:'点击“复核示例形状并带回对话”。',
        response:'保存含 batch 条件下的单项符合记录，并带回当前对话。',
        contract:'结果仅覆盖浏览器形状示例，未执行 Python、模型或 NPU。',
        note:'仅浏览器形状示例；未执行 Python、模型或 NPU'
      },
      {
        key:'image-conditions-overview', action:'新提案与旧核对分开', title:'条件改变后新提案待应用，旧核对继续标明旧条件',
        trigger:'取消 batch，生成第二次尝试的转换提案。',
        response:'新提案 [3,224,224] 标为待应用；原核对仍属于含 batch 的尝试。',
        contract:'新条件不沿用旧结果；来源尝试、采用与核对各自可见。',
        note:'新提案 [3,224,224]；旧核对 [1,3,224,224]'
      }
    ]
  },
  {
    key:'compare', label:'临时对照与返回',
    steps:[
      {
        key:'compare-wide', action:'宽栏同时比较', title:'宽栏并排两份记录，时间与条件始终在场',
        trigger:'从 11:51 记录选择与 11:52 对照，并拉宽右区。',
        response:'实际约 638px 的右区并排展示两份记录及 batch、输出形状。',
        contract:'拖动分隔线只改变布局，不改变对象、参数或版本。',
        note:'同一对照关系；没有重新运行两份记录'
      },
      {
        key:'compare-narrow-current', action:'窄栏完整看当前', title:'窄栏一次完整显示一份，保留当前记录的可读宽度',
        trigger:'将对照右区收窄到约 447px。',
        response:'以分段切换选择一份，当前展示 11:51 的含 batch 记录。',
        contract:'右区 ≤620px 使用单份视图；双方记录与对照关系继续保留。',
        note:'当前：11:51 · 含 batch · [1,3,224,224]'
      },
      {
        key:'compare-narrow-reference', action:'切换看另一份', title:'窄栏切换仍在同一对照中，另一份条件完整呈现',
        trigger:'在同一对照中切到 11:52。',
        response:'显示不含 batch 的记录及输出 [3,224,224]。',
        contract:'切换只改变正在阅读的一方，无需回总览重找，也不重新执行。',
        note:'对照：11:52 · 不含 batch · [3,224,224]'
      },
      {
        key:'compare-ended', action:'结束回到原记录', title:'结束临时对照后，返回进入前的原记录',
        trigger:'结束 11:51 与 11:52 的对照。',
        response:'右区回到最初进入时的 11:51 只读记录。',
        contract:'结束对照保留原现场；固定参考作为另一种持续保留动作。',
        note:'结束对照 ≠ 关闭内容；继续保留原现场'
      }
    ]
  }
];

// Stable identities allow the deck builder to assign page numbers independently.
export const capturePagesIndex = states.flatMap(group => group.steps.map((state,index) => ({
  pageId:`state-${group.key}-${state.key}`, group:group.key, groupLabel:group.label,
  state:state.key, title:state.title, action:state.action, groupIndex:index+1, groupCount:group.steps.length
})));
export const capturePageCount = capturePagesIndex.length;

export function capturedInteractionPages(chapterTabs) {
  const annotationsFor=key=>manifest[key]||[];
  const overlay=key=>{const items=annotationsFor(key);return items.length?`<svg class="capture-annotations" viewBox="0 0 ${viewport.width} ${viewport.height}" preserveAspectRatio="none" aria-hidden="true">${items.map((h,i)=>`<rect x="${h.x}" y="${h.y}" width="${h.width}" height="${h.height}" rx="5"/><circle cx="${h.x+13}" cy="${h.y+13}" r="11"/><text x="${h.x+13}" y="${h.y+18}">${i+1}</text>`).join('')}</svg>`:''};
  return states.flatMap(group => group.steps.map((state,index) => {
    const pageId=`state-${group.key}-${state.key}`;
    return `<section class="slide s-gray shared-rules captured-rules" id="${pageId}" data-page-id="${pageId}" data-rule="${group.key}" data-state="${state.key}" data-title="${esc(state.title)}" data-capture-sequence="${group.key}">
    <div class="head"><div class="head-l"><div class="brand"><span class="ttl">${esc(state.title)}</span></div><div class="subttl">共用机制 · ${esc(group.label)} · ${esc(state.action)}</div></div>${chapterTabs('C')}</div>
    <div class="body-area"><div class="capture-layout">
      <div class="capture-copy"><dl class="capture-notes">
        <div><dt>触发</dt><dd>${esc(state.trigger)}</dd></div>
        <div><dt>系统响应</dt><dd>${esc(state.response)}</dd></div>
        <div><dt>交互约定</dt><dd>${esc(state.contract)}</dd></div>
      </dl></div>
      <div class="capture-stage"><figure class="capture-frame"><button type="button" class="capture-image" data-enlarge="${dir+state.key}.jpg" data-highlights="${esc(JSON.stringify(annotationsFor(state.key)))}" data-viewport="${viewport.width} ${viewport.height}" aria-label="放大${esc(state.action)}的实际界面"><span class="capture-visual"><img src="${dir+state.key}.jpg" alt="${esc(state.action+'：'+state.response)}" decoding="async" loading="lazy">${overlay(state.key)}</span></button><figcaption><strong>${esc(state.action)}</strong><p>${esc(state.note)}</p><div class="capture-labels">${annotationsFor(state.key).map((h,i)=>`<small class="capture-label">${i+1}. ${esc(h.label||'关键区域')}</small>`).join('')}</div></figcaption></figure><div class="capture-hint">完整界面保留位置关系 · 细框标出重点 · 点击放大</div></div>
    </div></div>
    <div class="foot"><span>${esc(group.label)} · ${index+1} / ${group.steps.length}</span><span>当前 Demo 操作实拍 · 2026-10-19 · 浏览器示例，不代表真实工程执行</span></div>
  </section>`;
  }));
}

export const captureCSS = `
.story-deck .shared-rules.captured-rules .head{gap:2vw;margin-bottom:2.4vh}
.story-deck .shared-rules.captured-rules .body-area{padding-bottom:3vh}
.story-deck .capture-layout{width:100%;display:grid;grid-template-columns:minmax(0,.27fr) minmax(0,.73fr);gap:2vw;align-items:center}
.story-deck .capture-copy{min-width:0;min-height:0}
.story-deck .capture-notes{display:grid;gap:2.2vh;margin:0}
.story-deck .capture-notes>div{display:grid;gap:.65vh;padding-top:1.4vh;border-top:1px solid #cfd4df}
.story-deck .capture-notes>div:first-child{padding-top:0;border-top:0}
.story-deck .capture-notes dt{font-size:var(--fs-sm);line-height:1.4;font-weight:700;color:var(--ink-3);letter-spacing:.04em}
.story-deck .capture-notes dd{margin:0;font-size:var(--fs-body);line-height:1.6;color:var(--ink-2);overflow-wrap:anywhere}
.story-deck .capture-notes>div:nth-child(2) dd{color:var(--ink)}
.story-deck .capture-image:focus-visible{outline:2px solid #7f7ca2;outline-offset:3px}
.story-deck .capture-stage{margin:0;display:grid;gap:.9vh;justify-items:center;align-items:center;min-width:0}
.story-deck .capture-frame{margin:0;width:100%;display:grid;gap:1vh;justify-items:center}
.story-deck .capture-image{appearance:none;padding:0;border:0;border-radius:12px;display:flex;align-items:center;justify-content:center;width:100%;height:auto;background:transparent;cursor:zoom-in;overflow:visible}
.story-deck .capture-visual{position:relative;display:block;width:fit-content;height:fit-content;max-width:100%;max-height:100%}
.story-deck .capture-image img{display:block;max-width:100%;max-height:63vh;width:auto;height:auto;object-fit:contain;border:1px solid #d5d8e0;border-radius:10px;box-shadow:0 15px 45px -25px #46516b40}
.story-deck .capture-annotations{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.story-deck .capture-annotations rect{fill:none;stroke:#737bcd;stroke-width:2;vector-effect:non-scaling-stroke}
.story-deck .capture-annotations text{fill:#fff;stroke:none;font:700 15px sans-serif;text-anchor:middle}.story-deck .capture-annotations circle{fill:#666db2;stroke:none}
.story-deck .capture-frame figcaption{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.45vh 1vw;width:100%;align-items:baseline}
.story-deck .capture-frame figcaption>strong{font-size:var(--fs-body);line-height:1.4;color:var(--ink);font-weight:650}
.story-deck .shared-rules.captured-rules .capture-frame figcaption>p{margin:0;font-size:var(--fs-body);line-height:1.45;color:var(--ink-2)}
.story-deck .capture-labels{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:.3em 1.4em;min-width:0}
.story-deck .capture-label{font-size:var(--fs-sm);line-height:1.4;color:#66709b}
.story-deck .capture-hint{font-size:var(--fs-sm);line-height:1.4;color:var(--ink-3)}
.story-deck .shared-rules.captured-rules .foot{display:flex;justify-content:space-between;gap:2vw;font-size:var(--fs-sm);line-height:1.4;letter-spacing:0;left:4vw;right:4vw}
.story-deck .shared-rules.captured-rules .foot>span:first-child{flex:none;font-variant-numeric:tabular-nums}
body.overview.story-deck .capture-image{pointer-events:none}
@media(max-height:730px) and (min-width:641px){.story-deck .capture-notes{gap:1.6vh}.story-deck .capture-notes>div{padding-top:1.1vh}.story-deck .capture-image img{max-height:62vh}}
@media(max-width:900px) and (min-width:641px){.story-deck .capture-layout{gap:1.6vw}.story-deck .capture-notes{gap:1.5vh}.story-deck .capture-frame figcaption{grid-template-columns:1fr}.story-deck .capture-labels{grid-column:1}}
@media(max-width:640px){.story-deck .capture-layout{grid-template-columns:1fr;gap:2.5vh;flex:0 0 auto}.story-deck .shared-rules.captured-rules .body-area{display:block;overflow-y:auto;overscroll-behavior:contain;padding-top:1vh;padding-bottom:5vh}.story-deck .capture-notes{gap:1.6vh}.story-deck .capture-notes>div{padding-top:1.1vh}.story-deck .capture-stage{padding-bottom:2vh}.story-deck .capture-image img{max-width:100%;max-height:none;width:auto;height:auto}.story-deck .capture-frame figcaption{grid-template-columns:1fr;gap:.6vh}.story-deck .capture-labels{grid-column:1}.story-deck .shared-rules.captured-rules .foot{flex-wrap:wrap;gap:.4vh 2vw}}
@media print{.story-deck .capture-hint{display:none}}
`;

// The deck owns previous/next navigation; captured states have no local switcher.
export const captureRuntime = '';
