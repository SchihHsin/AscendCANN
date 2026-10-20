import {capturedInteractionPages,captureCSS,captureRuntime,capturePageCount} from './shared-interaction-captures.mjs';
import {interactionFrameworkPages,frameworkCSS,frameworkPageCount} from './shared-interaction-framework.mjs';
export {capturePageCount,frameworkPageCount};
export {captureRuntime as sharedInteractionRuntime};
// Formal HTML design rules. Implementation notes remain in content-management-design.md.
export const sharedInteractionCSS = captureCSS + frameworkCSS + `
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
    ...interactionFrameworkPages(chapterTabs),
    ...capturedInteractionPages(chapterTabs),

    slide('cases','AddCustom 与图像推理，共用同一组操作预期',`<div class="rule-full"><p>业务解释、参数和核对范围各不相同；内容身份、查看、历史、收起与返回遵守同一规则。</p><div class="rule-figure rule-scroll">${table(['共通动作','AddCustom','图像推理'],[
      ['按意图出现','问尾块访问原因时呈现相关图解；只报错时先给线索入口。','问模型输入如何转换时呈现 RGB／布局图解；形状异常时先给依据。'],
      ['原对象内试改','调整访问范围，更新索引演示；有价值的尝试保存为历史。','调整轴顺序或 batch，更新形状预览；保存输入与转换条件。'],
      ['独立产物与检查','需采用时生成关联尝试的 Diff；明确检查才保存浏览器演示结果。','需采用时形成转换提案；明确核对才保存输入形状记录。'],
      ['查看与找回','总览、记录、对照、收起再唤醒，返回同一对象与尝试。','沿用相同入口，保留参数、旧条件结果与任务内记录。'],
      ['结论边界','索引范围演示不等于真实编译、精度或 NPU 验证。','图像与张量预览不等于真实模型推理或部署成功。']
    ],'rule-case-table')}</div><div class="rule-conclusion">网页可侧重来源与阅读位置；视频可侧重时间点与关联图解。仅在业务确实需要时提供试改、采用或检查。</div></div>`),

    slide('delivery','共通管理已进入 Demo，后续场景仍需逐项补齐',`<div class="rule-full"><div class="rule-figure rule-scroll">${table(['范围','当前可演示','实际限制'],[
      ['界面架构','公共标题栏、按内容出现的专属工具、单份正文；问题分组目录、总览管理层和临时对照。','两任务沿用同一外壳；新业务仍需配置对象、分组和正文，不承诺任意自动归类。'],
      ['共通管理','明确关联自动画线；100%／70%／40%语义缩放；历史、对照、收起与找回。','主题仍为两案例预置；只按显式ID关联，不做AI语义归组。同来源保存，无跨设备同步。'],
      ['条件与执行','提案、已应用内容与核对各自标明来源尝试；应用不自动检查，历史只读。','旧记录缺少精确归属时不猜测；仍为浏览器演示，未接真实工程写入和执行。'],
      ['主动交互','已有四种意图规则及 AddCustom 局部演示；后台登记不抢焦点。','任意自然语言识别、图像专属主动提示、真实后台并发时序尚未完整验证。'],
      ['后续场景','已演示图解与动态片段、网页容器；学习起步、能力匹配、官网／GitCode协作继续沿此架构适配。','尚未补齐上述完整业务流程；网页是否能嵌入仍受原站限制。']
    ],'rule-status-table')}</div><p><b>建议本轮评审：</b>先看第31–40页的界面分区、容器与层级，再在 Demo 中切换正文、进入全部内容、临时对照，以及收起后继续阅读。</p><div class="rule-links"><a class="rule-screen-link" href="${demo}" target="_blank" rel="noopener">打开 Ascend Studio Demo ↗</a><a class="rule-screen-link" href="#31">回到界面架构 ↗</a><a class="rule-screen-link" href="../../../ascend-studio/evidence/20261019-content-map/06-image-version-summary.png" target="_blank" rel="noopener">历史条件取证 ↗</a><a class="rule-screen-link" href="../../ai-development-behavior-system-report-concise.html" target="_blank" rel="noopener">返回六问题报告 ↗</a></div><p>已做两案例往返与宽窄栏操作检查；属于本地演示观察，不是用户效果研究，也不证明 AI、模型或 NPU 的真实能力。</p></div>`,'交互规格与Demo状态 · 2026-10-20 · 前30页保留早期提案；公共外壳以界面架构章为准')
  ];
}
