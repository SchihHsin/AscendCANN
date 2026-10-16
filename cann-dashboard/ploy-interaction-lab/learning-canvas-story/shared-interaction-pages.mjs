// Formal HTML design rules. Implementation notes remain in content-management-design.md.
export const sharedInteractionCSS = `
.story-deck .shared-rules .body-area{padding-bottom:4vh}
.story-deck .shared-rules .rule-layout{width:100%;display:grid;grid-template-columns:minmax(0,.64fr) minmax(0,1.36fr);gap:2.6vw;align-items:center}
.story-deck .shared-rules .rule-copy{display:grid;gap:1.8vh;align-content:center}
.story-deck .shared-rules .rule-copy h2{font-size:var(--fs-h1);line-height:1.3;font-weight:750;letter-spacing:-.025em}
.story-deck .shared-rules p,.story-deck .shared-rules li{font-size:var(--fs-body);line-height:1.6;color:var(--ink-2)}
.story-deck .shared-rules .rule-copy p b{color:var(--ink);background:linear-gradient(transparent 62%,#dcdcf6 0)}
.story-deck .shared-rules .rule-conclusion{background:var(--g-ink);color:white;border-radius:12px;padding:1.5vh 1.2vw;font-size:var(--fs-body);line-height:1.5}
.story-deck .shared-rules .rule-figure{display:grid;gap:1.4vh;padding:2.3vh 1.8vw;border:1px solid #fff;border-radius:18px;background:rgba(255,255,255,.6);box-shadow:0 18px 55px -40px #647086}
.story-deck .shared-rules .rule-figure h3{font-size:var(--fs-h3);line-height:1.4;font-weight:650}
.story-deck .shared-rules .rule-figure small,.story-deck .shared-rules .rule-label{font-size:var(--fs-sm);line-height:1.5;color:var(--ink-3)}
.story-deck .shared-rules .rule-label{letter-spacing:.04em}
.story-deck .shared-rules .rule-row{display:flex;gap:.6vw;align-items:center;flex-wrap:wrap}
.story-deck .shared-rules .rule-tag{display:inline-flex;align-self:flex-start;width:fit-content;max-width:100%;padding:.35vh .6vw;border:1px solid #dde0e7;border-radius:99px;background:#f4f5f7;font-size:var(--fs-sm);line-height:1.4;color:#606777}
.story-deck .shared-rules .rule-tag.active{background:#24252c;color:white;border-color:#24252c}
.story-deck .shared-rules .rule-tag.pending{background:#f4f0e5;color:#8a6a25;border-color:#e9dfc7}
.story-deck .shared-rules .rule-object{border:1px solid #dce0e8;border-radius:12px;background:#fff;padding:1.6vh 1.1vw;display:grid;gap:1vh}
.story-deck .shared-rules .rule-object h3{font-size:var(--fs-h3)}
.story-deck .shared-rules .rule-object p{margin:0}
.story-deck .shared-rules .rule-meta{font-size:var(--fs-body);line-height:1.6;color:#657082}
.story-deck .shared-rules .rule-module{border:1px dashed #cecfdf;border-radius:9px;padding:1.8vh 1vw;background:linear-gradient(120deg,#f0f0fb,#f5f8fc);font-size:var(--fs-body);line-height:1.6;text-align:center;color:#596278}
.story-deck .shared-rules .rule-actions{display:flex;gap:.7vw;align-items:center;flex-wrap:wrap;border-top:1px solid #e9ebef;padding-top:1vh}
.story-deck .shared-rules .rule-action{display:inline-block;padding:.55vh .8vw;border-radius:7px;background:#f1f2f5;color:#4c5262;font-size:var(--fs-body);line-height:1.4}
.story-deck .shared-rules .rule-action.primary{background:#24252c;color:#fff}
.story-deck .shared-rules .rule-caption{font-size:var(--fs-body);line-height:1.5;color:var(--ink-2);margin:0}
.story-deck .shared-rules .rule-table{width:100%;border-collapse:collapse;table-layout:fixed}
.story-deck .shared-rules .rule-table th,.story-deck .shared-rules .rule-table td{text-align:left;padding:1.3vh .8vw;font-size:var(--fs-body);line-height:1.55;vertical-align:top;border-bottom:1px solid #dfe3eb;overflow-wrap:anywhere}
.story-deck .shared-rules .rule-table th{font-weight:650;color:#424958}
.story-deck .shared-rules .rule-table td{color:#606a7b}
.story-deck .shared-rules .rule-table tr:last-child td{border-bottom:0}
.story-deck .shared-rules .rule-table th:first-child,.story-deck .shared-rules .rule-table td:first-child{width:25%;color:#2e3442}
.story-deck .shared-rules .rule-prompt{border:1px solid #d8d9ee;border-radius:10px;background:linear-gradient(110deg,#eeeefd,#f3f5fc);padding:1.4vh 1vw;display:grid;gap:.8vh}
.story-deck .shared-rules .rule-prompt strong{font-size:var(--fs-body);font-weight:600;color:#4f5078}
.story-deck .shared-rules .rule-prompt p{margin:0}
.story-deck .shared-rules .rule-state-flow{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:.65vw}
.story-deck .shared-rules .rule-state{display:grid;gap:.8vh;padding:1.6vh .8vw;border:1px solid #d9dee7;border-radius:11px;background:#fff;text-align:center;align-content:center}
.story-deck .shared-rules .rule-state.current{border-color:#bfc2e6;background:linear-gradient(120deg,#f0f0fc,#fff)}
.story-deck .shared-rules .rule-state strong{font-size:var(--fs-h3);font-weight:650}
.story-deck .shared-rules .rule-state p{font-size:var(--fs-body);line-height:1.45;margin:0}
.story-deck .shared-rules .rule-arrow{font-size:var(--fs-h3);color:#8e96a7;text-align:center}
.story-deck .shared-rules .rule-return{border:1px dashed #c7ccdb;border-radius:10px;padding:1.3vh 1vw;text-align:center;font-size:var(--fs-body);line-height:1.5;color:#687286}
.story-deck .shared-rules .rule-history{display:grid;gap:.75vh;padding-left:1.2vw;border-left:1px solid #d8ddea;margin:.6vh 0 .2vh .5vw}
.story-deck .shared-rules .rule-history-item{display:flex;gap:1vw;align-items:center;justify-content:space-between;padding:1vh .8vw;background:#f3f4f7;border-radius:8px;font-size:var(--fs-body);line-height:1.45;color:#5f6878}
.story-deck .shared-rules .rule-related{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:.8vw}
.story-deck .shared-rules .rule-condition{padding:1.3vh 1vw;border:1px solid #dfe2eb;border-radius:10px;background:#f7f8fa;font-size:var(--fs-body);line-height:1.6;color:#667082}
.story-deck .shared-rules .rule-compare{display:grid;grid-template-columns:1fr 1fr;gap:1vw}
.story-deck .shared-rules .rule-narrow{width:75%;margin:auto;display:grid;gap:.8vh;border:1px solid #d9dce6;border-radius:11px;padding:1.2vh 1vw;background:#fff}
.story-deck .shared-rules .rule-segments{display:flex;background:#eeeff3;border-radius:7px;padding:.3vh .2vw;gap:.2vw}
.story-deck .shared-rules .rule-segments span{flex:1;text-align:center;font-size:var(--fs-body);line-height:1.4;padding:.4vh .5vw;color:#778091}
.story-deck .shared-rules .rule-segments .selected{background:white;color:#363d4c;border-radius:5px;box-shadow:0 1px 3px #c7cbd5}
.story-deck .shared-rules .rule-screen-link{font-size:var(--fs-body);line-height:1.5;color:#6465a7;text-decoration:underline;text-underline-offset:3px}
.story-deck .shared-rules .rule-links{display:flex;flex-wrap:wrap;gap:1vh 1.2vw}
.story-deck .shared-rules .rule-full{display:grid;gap:2vh;width:100%}
.story-deck .shared-rules .rule-case-table th:first-child,.story-deck .shared-rules .rule-case-table td:first-child{width:18%}
.story-deck .shared-rules .rule-status-table th:first-child,.story-deck .shared-rules .rule-status-table td:first-child{width:20%}
@media(max-width:900px){.story-deck .shared-rules .rule-layout{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:2vw}.story-deck .shared-rules .rule-copy h2{font-size:var(--fs-h2)}.story-deck .shared-rules .rule-figure{padding:1.7vh 1.4vw}}
@media(max-width:640px){.story-deck .shared-rules .head{flex-direction:column;align-items:flex-start;gap:1.3vh}.story-deck .shared-rules .head-l{width:100%}.story-deck .shared-rules .section-tabs{margin-left:0}.story-deck .shared-rules .rule-layout,.story-deck .shared-rules .rule-full{flex:0 0 auto}.story-deck .shared-rules .rule-layout{grid-template-columns:1fr;align-items:start;gap:2.5vh}.story-deck .shared-rules .body-area{margin-bottom:3vh}.story-deck .shared-rules .foot{font-size:var(--fs-sm);line-height:1.4}.story-deck .shared-rules .body-area{justify-content:flex-start;overflow-y:auto;overscroll-behavior:contain;padding-top:2vh;padding-bottom:5vh}.story-deck .shared-rules .rule-copy{gap:1vh}.story-deck .shared-rules .rule-copy h2{font-size:var(--fs-h2)}.story-deck .shared-rules .rule-figure{padding:2vh 2vw}.story-deck .shared-rules .rule-table th,.story-deck .shared-rules .rule-table td{padding:1.2vh 1.4vw}.story-deck .shared-rules .rule-case-table,.story-deck .shared-rules .rule-status-table{min-width:700px}.story-deck .shared-rules .rule-scroll{overflow-x:auto}.story-deck .shared-rules .rule-narrow{width:95%}.story-deck .shared-rules .section-tabs{gap:0}.story-deck .shared-rules .section-tabs span{padding:.4vh .5vw}}
`;

const copy = (title, paragraphs, conclusion) => `<div class="rule-copy"><h2>${title}</h2>${paragraphs.map(p=>`<p>${p}</p>`).join('')}<div class="rule-conclusion">${conclusion}</div></div>`;
const rows = data => data.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
const table = (headers, data, cls='') => `<table class="rule-table ${cls}"><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows(data)}</tbody></table>`;
const tag = (text,cls='') => `<span class="rule-tag ${cls}">${text}</span>`;
const figure = body => `<div class="rule-figure">${body}</div>`;
const demo = '../../../ascstudio/';

export function sharedInteractionPages(chapterTabs) {
  const slide = (key,title,body,foot='交互规则 · 2026-10-16 · 结构图为设计说明，Demo实施范围见本章最后一页') => `<section class="slide s-gray shared-rules" data-rule="${key}" data-title="${title}"><div class="head"><div class="head-l"><div class="brand"><span class="ttl">${title}</span></div><div class="subttl">共用机制</div></div>${chapterTabs('C')}</div><div class="body-area">${body}</div><div class="foot">${foot}</div></section>`;
  return [
    slide('object','业务内容可以不同，管理动作保持一致',`<div class="rule-layout">${copy('一张内容卡，<br>多种业务正文',[
      '以<b>能独立回看、操作或引用的内容</b>作为对象。图解、代码、网页、Diff、视频都沿用同一外壳。',
      '统一身份、摘要、适用条件与就近操作；正文按内容组合。没有检查环节的资料，不强加“待验证”。',
      '总览、分类下拉与当前内容指向同一对象；展开和收起保留参数与阅读现场。'
    ],'统一的是操作预期；业务决定正文和必要动作。')}${figure(`<div class="rule-label">共通卡片结构示意</div><div class="rule-object"><div class="rule-row">${tag('图解')}${tag('当前示例')}${tag('未保存尝试')}</div><h3>图像如何成为模型输入</h3><p>用通道、轴顺序和 batch 解释输入变化。</p><div class="rule-meta">条件：RGB · 224 × 224 · 轴 2,0,1<br>来源：当前任务的输入转换代码</div><div class="rule-module">可组合正文模块<br>图解 ／ 视频与章节 ／ 代码 ／ 网页 ／ Diff ／ 结果</div><div class="rule-actions"><span class="rule-action primary">查看内容</span><span class="rule-action">来源、关联与历史</span><span class="rule-action">收起</span></div></div><p class="rule-caption">“展开中／已收起／有更新”是查看状态；“待应用／已应用／检查结果”是业务状态。两者分别记录。</p>`)}</div>`),

    slide('intent','主动出现的程度，取决于用户当下的意图',`<div class="rule-layout">${copy('有需要时直接接上，<br>专注时保持现场',[
      '建议贴近当前问题、代码或回答出现。短提示留在原处；需要持续查看和操作的内容才进入右侧。',
      '关键提示用<b>浅蓝紫提示面＋关联对象一次强调</b>；处理后收回摘要。主按钮保持黑色。',
      '不循环闪烁，不靠动效单独传达状态；减少动态效果时保留文字提示。'
    ],'明确的理解与操作意图可直接接续；后台更新保留轻提示。')}${figure(`${table(['用户此刻的意图','界面如何回应'],[
      ['“为什么、怎么理解”','回答与关联图解一起出现，不再多问一次是否学习。'],
      ['只报告失败、要求修复','先给简短依据；在问题旁提供深入解释入口。'],
      ['正在阅读或编辑','保留内容与位置；新建议只做轻提示。'],
      ['“试一下、采用、检查”','接续对应动作；按既有授权与修改范围处理。']
    ])}<div class="rule-prompt"><strong>示例：只报告失败后的就近提示</strong><p>当前输入带有余数，尾块访问范围值得核对；根因尚未确认。</p><div class="rule-row"><span class="rule-action primary">查看访问图解</span><span class="rule-meta">可继续当前排查</span></div></div>`)}</div>`),

    slide('navigation','看当前、看全部、对照，都能回到刚才',`<div class="rule-layout">${copy('按需打开右侧，<br>保留一个默认入口',[
      '默认呈现当前需要的内容；右侧不是常驻自由画布。标题下拉保留已选的四类归组，供主动查找。',
      '<b>看全部</b>展示同一任务的概要、状态、关联和历史入口；选择对象回到可读的详细内容。',
      '收起整区只隐藏查看面，保留后台工作与内容。唤醒恢复原现场；停止、删除、取消另有独立动作。'
    ],'打开、切换、返回、收起都是查看动作，不生成、不应用、不检查。')}${figure(`<div class="rule-row">${tag('当前名称 ▾','active')}<span class="rule-meta">图解与说明 · 代码与修改 · 网页与资料 · 核对与记录</span></div><div class="rule-state-flow"><div class="rule-state current"><strong>当前内容</strong><p>正文与就近操作</p></div><div class="rule-arrow">↔</div><div class="rule-state"><strong>看全部</strong><p>概要与关联</p></div><div class="rule-arrow">↔</div><div class="rule-state"><strong>临时对照</strong><p>明确选定双方</p></div></div><div class="rule-return">当前内容也可直接进入对照；结束后回到进入前的内容或总览。</div><div class="rule-arrow">↓ 收起　／　↑ 唤醒</div><div class="rule-state"><strong>右侧收起，任务现场保留</strong><p>更新数留在唤醒入口；新结果不会自动把右侧打开。</p></div><p class="rule-caption">三种查看范围通过内容动作进入，不增加一排日常模式开关；自由空间整理仍是按需能力。</p>`)}</div>`),

    slide('history','按主题找内容，历史留在原对象下面',`<div class="rule-layout">${copy('分类帮助定位，<br>不让用户先做分类',[
      '系统按当前目标、概念或具体问题聚合内容。用户打开总览即可看见归属，无需先选择一种管理视图。',
      '同一图解调参更新原对象；<b>有回看价值的尝试</b>嵌入其历史，不把每次调用和每个参数值铺成新卡。',
      '独立可审阅、引用或操作的产物再建对象，并保留来源、条件和关联。关联本身不代表因果。'
    ],'后台更新只标记相关对象；不覆盖编辑、旧快照，不重排当前阅读位置。')}${figure(`<div class="rule-label">同一任务中的内容与历史 · 结构示意</div><div class="rule-object"><div class="rule-row">${tag('输入布局')}${tag('有更新')}</div><h3>图像与张量讲解</h3><p>当前参数仍在原图解中；保存的尝试在下方回看。</p><div class="rule-history"><div class="rule-history-item"><span>12:01 · 轴 2,0,1 · 含 batch</span><span>只读</span></div><div class="rule-history-item"><span>12:12 · 轴 2,0,1 · 不含 batch</span><span>只读</span></div></div></div><div class="rule-related"><div class="rule-object"><h3>修改提案</h3><p>独立审阅的 Diff</p></div><div class="rule-arrow">← 来源于</div><div class="rule-object"><h3>12:12 尝试</h3><p>同一历史记录</p></div></div><p class="rule-caption">展开历史占用当前卡片之后的整行；不会把相邻卡片一起撑高。分类下拉、总览和关联链接复用同一记录。</p>`)}</div>`),

    slide('conditions','结果跟随实际条件，理解、应用与检查各有边界',`<div class="rule-layout">${copy('看清这份结果，<br>到底说明了什么',[
      '参数变化先更新标明为示例的图解、形状与代码预览；它不代表真实工程运行。',
      '查看历史只读。采用作用于明确的目标与版本；检查按明确操作单独发起，<b>应用不自动检查</b>。',
      '每份检查记录携带对象、输入、参数或代码版本及覆盖范围。条件变了，旧结果仍属于旧条件。'
    ],'没有检查步骤的文档与视频，不补造验证阶段。')}${figure(`<div class="rule-object"><div class="rule-row">${tag('当前提案')}${tag('待应用','pending')}</div><h3>取消 batch 维度</h3><div class="rule-condition">来源：12:12 尝试<br>输出预览：[3, 224, 224]<br>项目状态：尚未采用当前提案</div></div><div class="rule-object"><div class="rule-row">${tag('历史核对')}${tag('旧条件结果')}</div><h3>12:01 · 输入形状核对</h3><p>核对对象包含 batch，形状为 [1, 3, 224, 224]。该结果不适用于上方新提案。</p></div><div class="rule-row"><span class="rule-action">查看只读快照</span><span class="rule-meta">不重新运行；结论不迁移到新条件</span></div><p class="rule-caption">示例预览、修改采用、范围检查分别可见；尾块线索不等于根因已确认，局部通过不等于完整任务完成。</p>`)}</div>`),

    slide('compare','宽栏并排，窄栏完整看一份，结束回原处',`<div class="rule-layout">${copy('对照是临时动作，<br>固定参考可以延续',[
      '对照由用户明确选择内容与版本；两侧标明名称、时间与条件。结束返回进入前的内容、总览和焦点。',
      '<b>固定参考</b>用于后续操作仍需保留的原文件或结果；它不会随下一步自动收起。',
      '三栏拖宽只改变布局。内容保持可读；窄栏切换对照双方，不把整个正文缩成缩略图。'
    ],'当前 Demo：右区 ≤620px 切换双方；拖宽不会改变对象、参数或版本。')}${figure(`<div class="rule-label">宽栏：同时对照两份</div><div class="rule-compare"><div class="rule-object"><h3>当前 · 12:12</h3><p>不含 batch<br>[3, 224, 224]</p></div><div class="rule-object"><h3>参考 · 12:01</h3><p>包含 batch<br>[1, 3, 224, 224]</p></div></div><div class="rule-label">窄栏：切换双方，每份占完整宽度</div><div class="rule-narrow"><div class="rule-segments"><span>当前 · 12:12</span><span class="selected">参考 · 12:01</span></div><div class="rule-object"><h3>包含 batch</h3><p>[1, 3, 224, 224]<br>保留同一份只读记录与阅读位置</p></div></div><div class="rule-return">看参考 → 看全部 → 回到刚才：仍看同一参考<br>结束对照 → 回到进入对照之前的现场</div>`)}</div>`),

    slide('cases','AddCustom 与图像推理，共用同一组操作预期',`<div class="rule-full"><p>业务解释、参数和核对范围各不相同；内容身份、查看、历史、收起与返回遵守同一规则。</p><div class="rule-figure rule-scroll">${table(['共通动作','AddCustom','图像推理'],[
      ['按意图出现','问尾块访问原因时呈现相关图解；只报错时先给线索入口。','问模型输入如何转换时呈现 RGB／布局图解；形状异常时先给依据。'],
      ['原对象内试改','调整访问范围，更新索引演示；有价值的尝试保存为历史。','调整轴顺序或 batch，更新形状预览；保存输入与转换条件。'],
      ['独立产物与检查','需采用时生成关联尝试的 Diff；明确检查才保存浏览器演示结果。','需采用时形成转换提案；明确核对才保存输入形状记录。'],
      ['查看与找回','总览、记录、对照、收起再唤醒，返回同一对象与尝试。','沿用相同入口，保留参数、旧条件结果与任务内记录。'],
      ['结论边界','索引范围演示不等于真实编译、精度或 NPU 验证。','图像与张量预览不等于真实模型推理或部署成功。']
    ],'rule-case-table')}</div><div class="rule-conclusion">网页可侧重来源与阅读位置；视频可侧重时间点与关联图解。仅在业务确实需要时提供试改、采用或检查。</div></div>`),

    slide('delivery','共通管理已进入 Demo，后续场景仍需逐项补齐',`<div class="rule-full"><div class="rule-figure rule-scroll">${table(['范围','当前可演示','实际限制'],[
      ['共通管理','两任务共用卡片结构、稳定记录、关联与历史；总览、对照、收起、找回。','两案例主题为预置映射；同来源本地保存、任务隔离，无跨设备同步。'],
      ['条件与执行','应用不自动检查；历史只读；新提案与旧条件结果分开。','参数、提案、核对均为演示；未接真实工程写入和执行。'],
      ['主动交互','已有四种意图规则及 AddCustom 局部演示；后台登记不抢焦点。','任意自然语言识别、图像专属主动提示、真实后台并发时序尚未完整验证。'],
      ['后续场景','学习起步、视频与图解、浏览器、能力匹配、官网／GitCode协作按同一规则展开。','以上场景仍需补齐具体内容和交互，不能视作全部已经实现。']
    ],'rule-status-table')}</div><p><b>建议本轮评审：</b>任选任务 → 看全部 → 图解记录 → 回到当前 → 选择版本对照 → 结束 → 整区收起再唤醒；切换另一任务复用同一组动作。</p><div class="rule-links"><a class="rule-screen-link" href="${demo}" target="_blank" rel="noopener">打开 Ascend Studio Demo ↗</a><a class="rule-screen-link" href="../../../ascend-studio/evidence/20261016-shared-interactions/11-final-overview.png" target="_blank" rel="noopener">AddCustom 操作取证 ↗</a><a class="rule-screen-link" href="../../../ascend-studio/evidence/20261016-shared-interactions/04-image-overview.png" target="_blank" rel="noopener">图像推理操作取证 ↗</a><a class="rule-screen-link" href="../../ai-development-behavior-system-report-concise.html" target="_blank" rel="noopener">返回六问题报告 ↗</a></div><p>已做两案例往返与窄栏操作检查；属于本地演示观察，不是用户效果研究，也不证明 AI、模型或 NPU 的真实能力。</p></div>`,'交互规格与Demo状态 · 2026-10-16 · 原有故事配图保留早期提案；共通行为以本章说明为准')
  ];
}
