/* Task workspace prototype. All AI replies, code changes and results are simulated. */
(()=>{
const q=new URLSearchParams(location.search),scene=q.get('scene');
if(q.get('view')==='code'||!['ide','experiment','handoff'].includes(scene))return;
window.vsConceptActive=true;window.workspaceActive=true;
let tab=scene==='experiment'?'experiment':scene==='handoff'?'resume':'visual',stage=0,swapped=false,history=[],draft='',timer,codeFrame;
const app=document.getElementById('pcApp');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const b=(label,a,cls='')=>'<button class="'+cls+'" data-ws="'+a+'">'+label+'</button>';
const names={visual:'维度可视化',experiment:'验证实验',code:'代码编辑器',result:'运行结果',resume:'任务接续',lesson:'学习材料'};
function visual(){
return '<div class="ws-page"><div class="ws-eyebrow">输入布局 · 当前文件 preprocess.py:6</div><h2>看见通道如何移动</h2><p>图片读取后的顺序是 H × W × C，模型需要 N × C × H × W。</p><div class="ws-visual"><div class="ws-image"><div class="ws-pixels"></div><small>示例 RGB 图像<br>224 × 224 × 3</small></div><div class="ws-dimensions '+(swapped?'is-swapped':'')+'"><span data-axis="N"><b>N</b><small>1 张</small></span><span data-axis="H"><b>H</b><small>224 高</small></span><span data-axis="W"><b>W</b><small>224 宽</small></span><span data-axis="C"><b>C</b><small>3 通道</small></span></div></div><div class="ws-shape"><span>当前预演</span><code>'+(swapped?'[1, 3, 224, 224]':'[1, 224, 224, 3]')+'</code><span>模型要求</span><code>[1, 3, 224, 224]</code></div><div class="ws-actions">'+b(swapped?'还原维度':'播放维度变换','transpose','primary')+b('用这个方案准备实验','prepare')+'</div><p class="ws-caution">代码推演 · 动画只说明维度变化，尚未执行测试。</p></div>';
}
function experiment(){
return '<div class="ws-page"><div class="ws-eyebrow">实验草案 · experiment/shape-check</div><h2>先验证这一处修改</h2><p>输入一张样例图片，仅验证张量形状；主项目保持原样。</p><div class="ws-diff"><small>preprocess.py · 待审修改</small><pre class="removed">− input_data = image[None, ...]</pre><pre class="added">+ chw = image.transpose(2, 0, 1)\n+ input_data = chw[None, ...]</pre></div><div class="ws-test"><b>验证条件</b><code>assert input_data.shape == (1, 3, 224, 224)</code><span>预期：维度一致　/　实际：'+(stage>=2?'查看本次模拟回执':'尚未运行')+'</span></div><div class="ws-actions">'+b(stage>=1?'运行隔离测试':'接受到隔离分支',stage>=1?'run':'accept','primary')+b('在代码编辑器中查看','code')+b('撤销草案','undo')+'</div><p class="ws-caution">所有修改与运行均为模拟；接受草案不代表验证通过。</p></div>';
}
function result(){
return '<div class="ws-page"><div class="ws-eyebrow">运行记录 · '+(stage>=2?'实验 #02':'原始运行 #01')+'</div><h2>'+(stage>=2?'形状已匹配，保留这次证据':'输入布局不一致')+'</h2><div class="ws-compare"><div><small>修改前 · 模拟日志</small><strong>NHWC</strong><code>[1,224,224,3]</code><p>与模型签名不匹配</p></div><div class="'+(stage>=2?'passed':'')+'"><small>'+(stage>=2?'修改后 · 模拟测试':'修改后 · 尚未运行')+'</small><strong>'+(stage>=2?'NCHW':'—')+'</strong><code>'+(stage>=2?'[1,3,224,224]':'等待确认实验')+'</code><p>'+(stage>=2?'输入维度断言通过':'没有可用的验证结果')+'</p></div></div><pre class="ws-log">'+(stage>=2?'$ python tests/test_input.py\nPASS · input shape matches\n1 passed · 演示回执':'AssertionError: Input shape mismatch\nexpected: [1, 3, 224, 224]\nreceived: [1, 224, 224, 3]')+'</pre><div class="ws-actions">'+(stage>=2?b('保存回执并继续下一节点','advance','primary')+b('撤销修改','undo'):b('查看维度差异','visual','primary'))+'</div><p class="ws-caution">此回执仅覆盖输入维度，不代表模型精度或 NPU 推理验证。</p></div>';
}
function resume(){
return '<div class="ws-page"><div class="ws-eyebrow">image-inference · 昨天 18:42</div><h2>从上次停下的地方继续</h2><p>任务、学习位置和实验记录一起保留。后台仅整理已授权信息。</p><div class="ws-resume"><div><small>当前学习节点</small><h3>'+(stage===3?'04 · 执行模型推理':'03 · 理解与验证输入布局')+'</h3><p>课程位置 06:42 · preprocess.py 第 6 行</p></div><div><small>需要你决定</small><h3>课程与本地环境存在差异</h3><p>课程快照 v2 / 本地快照 v3。已准备适配说明，未修改本地环境。</p></div></div><div class="ws-actions">'+b('保留本地环境，继续任务','continue','primary')+b('先查看学习材料','lesson')+'</div></div>';
}
function lesson(){
if(stage===3)return '<div class="ws-page"><div class="ws-eyebrow">节点 04 · 执行模型推理</div><h2>把已验证的输入送入模型</h2><p>上一节点的输入维度回执已带入。接下来学习模型加载、输入绑定与输出读取。</p><div class="ws-course"><small>下一节点 · 学习材料示意</small><h3>输入张量 → 模型执行 → 输出结果</h3><p>本节点将进一步区分形状匹配、模型执行成功与预测结果正确。</p></div><div class="ws-actions">'+b('回看输入验证结果','result','primary')+b('查看当前代码','code')+'</div><p class="ws-caution">当前原型演示至节点承接；未连接真实模型与 NPU。</p></div>';
return '<div class="ws-page"><div class="ws-eyebrow">节点 03 · 课程 06:42 / 15:20</div><h2>为什么模型需要 NCHW？</h2><div class="ws-course"><small>课程画面示意 · 非真实视频播放器</small><div class="ws-course-shape">N <span>×</span> C <span>×</span> H <span>×</span> W</div><p>将一张图片的三个颜色通道，放到空间维度之前。</p></div><div class="ws-actions">'+b('用当前代码可视化解释','visual','primary')+b('进入本节点实验','prepare')+'</div><p>学习材料、文件和实验属于同一个任务；查看解释后仍可回到当前课程位置。</p></div>';
}
function render(){
document.body.classList.add('ws-mode');
// Recreate the editor from the shared task state; detached iframes reload.
codeFrame=null;
const content=tab==='visual'?visual():tab==='experiment'?experiment():tab==='result'?result():tab==='lesson'?lesson():tab==='resume'?resume():'<div class="ws-code-mount"></div>';
app.innerHTML='<div class="ws-shell"><header class="ws-header"><span class="ws-brand">Ascend / Workspace</span><b>跑通图像推理</b><span class="ws-sim">交互提案 · 全部执行为模拟</span></header><div class="ws-body"><aside class="ws-chat"><div class="ws-chat-title">任务协作 <small>image-inference</small></div><details class="ws-path"><summary>学习路径 · '+(stage===3?'节点 04':'节点 03')+'</summary><div>01 环境准备 · 已完成</div><div>02 模型与输入 · 已完成</div><div>03 输入布局 · '+(stage===3?'已完成':'当前')+'</div><div>04 执行推理 · '+(stage===3?'当前':'待开始')+'</div></details><div class="ws-messages"><div class="ws-user">'+(scene==='handoff'?'继续昨天的推理任务。':'这次输入报错，帮我看懂原因，再让我自己确认修改。')+'</div><div class="ws-ai"><b>学习伙伴</b><p>已关联当前文件和错误日志。通道顺序可能不一致，我准备了一份维度解释。</p>'+b('打开可视化解释','visual')+'<small>引用：preprocess.py:6 · 运行 #01</small></div>'+history.map(m=>'<div class="'+(m.role==='user'?'ws-user':'ws-ai')+'">'+esc(m.text)+'</div>').join('')+'</div><div class="ws-composer"><div class="ws-context">已带入：节点 03 · 当前文件 · 运行日志</div><form><textarea aria-label="向学习伙伴提出要求" placeholder="围绕当前任务继续讨论…">'+esc(draft)+'</textarea><button class="primary" type="submit">发送</button></form><small>演示支持：解释、实验、代码、结果、继续</small></div></aside><main class="ws-artifacts"><nav class="ws-tabs" aria-label="任务材料">'+Object.entries(names).map(([k,v])=>b(v,k,tab===k?'selected':'')).join('')+'</nav><div class="ws-content">'+content+'</div></main></div></div>';
if(tab==='code'){if(!codeFrame){codeFrame=document.createElement('iframe');codeFrame.className='ws-code-frame';codeFrame.title='任务中的代码编辑器';codeFrame.src='proactive-concepts.html?scene=experiment&view=code&wsState='+(stage>=2?4:stage===1?3:2);}app.querySelector('.ws-code-mount').append(codeFrame);}
app.querySelector('.ws-messages').scrollTop=app.querySelector('.ws-messages').scrollHeight;
document.getElementById('pcSceneLabel').textContent='任务 Workspace · 对话与材料相互引用 · 非真实 AI / NPU 执行';
}
function act(a){
draft=app.querySelector('textarea')?.value||draft;
if(a in names)tab=a;
if(a==='transpose'){swapped=!swapped;const box=app.querySelector('.ws-dimensions');box.classList.toggle('is-swapped',swapped);app.querySelector('.ws-shape code').textContent=swapped?'[1, 3, 224, 224]':'[1, 224, 224, 3]';app.querySelector('[data-ws="transpose"]').textContent=swapped?'还原维度':'播放维度变换';return;}
if(a==='prepare'){tab='experiment';history.push({text:'已准备最小修改与维度断言。先审阅草案，再决定是否在隔离分支运行。'});}
if(a==='accept'){codeFrame=null;stage=1;history.push({text:'已接受到隔离分支（模拟），主项目未改。下一步运行输入测试。'});}
if(a==='run'){if(stage>=1){codeFrame=null;stage=2;tab='result';history.push({text:'模拟测试已完成。输入维度断言通过，回执已关联实验 #02。'});}}
if(a==='undo'){codeFrame=null;stage=0;tab='experiment';history.push({text:'已撤回草案；历史对比仅作记录，当前没有已接受的修改。'});}
if(a==='continue'){tab=stage===3?'lesson':'visual';history.push({text:stage===3?'继续节点 04，已携带输入维度验证回执。':'保留本地环境。继续节点 03，并携带课程位置、文件和原始运行记录。'});}
if(a==='advance'&&stage>=2){stage=3;tab='lesson';history.push({text:'已保存模拟回执，路径推进到节点 04：执行模型推理。'});}
render();
}
function reset(){tab=scene==='experiment'?'experiment':scene==='handoff'?'resume':'visual';stage=0;swapped=false;history=[];draft='';codeFrame=null;render();}
document.addEventListener('click',e=>{const el=e.target.closest('[data-ws]');if(el){clearInterval(timer);act(el.dataset.ws);}});
document.addEventListener('submit',e=>{if(!e.target.closest('.ws-composer'))return;e.preventDefault();clearInterval(timer);const text=app.querySelector('textarea').value.trim();if(!text)return;history.push({role:'user',text});draft='';const match=/代码|编辑/.test(text)?'code':/结果|日志/.test(text)?'result':/实验|修改|验证/.test(text)?'prepare':/继续|昨天/.test(text)?'continue':/解释|维度|可视化/.test(text)?'visual':null;app.querySelector('textarea').value='';history.push({text:match?'已按你的要求打开对应任务材料。':'这是交互演示，尚未接入模型。可以试试“解释维度”“准备实验”“打开代码”或“查看结果”。'});if(match)act(match);else render();});
document.getElementById('pcReset').onclick=()=>{clearInterval(timer);reset();};
addEventListener('message',e=>{if(e.origin!==location.origin)return;if(codeFrame&&e.source===codeFrame.contentWindow&&Number.isInteger(e.data?.wsCodeState)){const next=e.data.wsCodeState>=4?2:e.data.wsCodeState>=3?1:0;stage=stage===3&&next===2?3:next;return;}if(e.source!==parent)return;clearInterval(timer);if(e.data?.concept==='reset')reset();if(e.data?.concept==='play'){reset();const seq=['visual','transpose','prepare','accept','run'];let i=0;timer=setInterval(()=>{act(seq[i++]);if(i===seq.length)clearInterval(timer);},2600);}});
render();
})();
