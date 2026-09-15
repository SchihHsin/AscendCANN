/* VS Code-shaped learning concept; no real filesystem or process execution. */
(()=>{
if(window.workspaceActive)return;
const scene=new URLSearchParams(location.search).get('scene');
if(!['ide','experiment','handoff'].includes(scene))return;
window.vsConceptActive=true;
let state=scene==='experiment'?2:0,muted=false,note='',timer;
const workspaceState=new URLSearchParams(location.search).get('wsState');
if(workspaceState!==null&&['0','1','2','3','4'].includes(workspaceState))state=Number(workspaceState);
const app=document.getElementById('pcApp');
const button=(text,action)=>'<button data-vs="'+action+'">'+text+'</button>';
function render(){
document.body.classList.add('vs-mode');
const applied=state>=3,done=state===4;
const lines=['import numpy as np','from PIL import Image','','def preprocess(path):','    image = np.asarray(Image.open(path).resize((224, 224)))',...(applied?['    chw = image.transpose(2, 0, 1)','    input_data = chw[None, ...].astype(np.float32)']:['    input_data = image[None, ...].astype(np.float32)']),'    return input_data','','input_data = preprocess("samples/cat.jpg")','assert input_data.shape == (1, 3, 224, 224)'];
const code=state===2?'<div class="vs-diff-title">preprocess.py · 修改预览 <span>尚未应用</span></div><div class="vs-code"><div>  5  image = np.asarray(Image.open(path).resize((224, 224)))</div><div class="vs-deleted">− 6  input_data = image[None, ...].astype(np.float32)</div><div class="vs-added">+ 6  chw = image.transpose(2, 0, 1)</div><div class="vs-added">+ 7  input_data = chw[None, ...].astype(np.float32)</div><div>  8  return input_data</div></div><div class="vs-inline"><b>仅调整输入布局</b><p>模型文件和环境保持不变；接受后再运行维度测试。</p>'+button('接受修改','accept')+button('拒绝','reject')+'</div>':
'<div class="vs-code">'+lines.map((line,i)=>'<div class="'+(i===5&&!applied?'vs-error':'')+'"><span class="vs-number">'+(i+1)+'</span>'+line+'</div>'+(i===5&&state===1?'<div class="vs-inline"><b>学习伙伴 · 输入维度线索</b><p>模型期望 NCHW，当前输入为 NHWC。第 6 行只增加了 batch 维，没有移动通道。</p><small>依据：本次断言的 expected / received；仅使用当前文件和日志。</small><p>'+button('查看最小修改','diff')+button('我自己检查 / 收起','close')+'</p></div>':'')).join('')+'</div>';
app.innerHTML='<div class="vs-shell"><div class="vs-title"><b>&lt;&gt;</b><span>文件　编辑　选择　查看　运行　终端</span><div class="vs-command">⌕　image-inference</div><small>VS Code 布局 · 交互模拟</small></div><div class="vs-work"><aside class="vs-activity"><span class="vs-activity-icon is-active" role="img" aria-label="资源管理器" title="资源管理器"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" > <path d="M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" /> <path d="M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z" /> <path d="M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" /> </svg></span><span class="vs-activity-icon" role="img" aria-label="搜索" title="搜索"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" > <path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" /> </svg></span><span class="vs-activity-icon" role="img" aria-label="源代码管理" title="源代码管理"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" > <path d="M15 6a9 9 0 0 0-9 9V3" /> <circle cx="18" cy="6" r="3" /> <circle cx="6" cy="18" r="3" /> </svg></span><span class="vs-activity-icon" role="img" aria-label="运行与调试" title="运行与调试"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" > <path d="M10 19.655A6 6 0 0 1 6 14v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 3.97" /> <path d="M14 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z" /> <path d="M14.12 3.88 16 2" /> <path d="M21 5a4 4 0 0 1-3.55 3.97" /> <path d="M3 21a4 4 0 0 1 3.81-4" /> <path d="M3 5a4 4 0 0 0 3.55 3.97" /> <path d="M6 13H2" /> <path d="m8 2 1.88 1.88" /> <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" /> </svg></span><span class="vs-activity-icon" role="img" aria-label="扩展" title="扩展"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" > <path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" /> <rect x="14" y="2" width="8" height="8" rx="1" /> </svg></span></aside><aside class="vs-explorer"><header>资源管理器　···</header><p>⌄ IMAGE-INFERENCE</p><div>⌄ src</div><div class="vs-selected">　<span>Py</span> preprocess.py</div><div>　<span>Py</span> inference.py</div><div>› models</div><div>› samples</div><div>› tests</div><div>　requirements.txt</div><div>　README.md</div><footer>› 大纲<br><br>› 时间线</footer></aside><div class="vs-main"><div class="vs-tabs"><span>Py　preprocess.py '+(applied?'●':'×')+'</span><span>test_input.py　×</span>'+button('▷ 运行测试','run')+'</div><div class="vs-breadcrumb">src › preprocess.py › preprocess</div><div class="vs-editor">'+code+'</div><div class="vs-terminal"><header>问题 '+(done?'0':'1')+'　 输出　 调试控制台　 <b>终端</b><span>python　＋　⌄</span></header><pre>(.venv) developer@workspace % python tests/test_input.py\n'+(done?'PASS input layout: (1, 3, 224, 224)\n1 passed · 0.03s · 模拟结果':applied?'修改已接受，等待重新运行输入维度测试。':'Traceback (most recent call last):\n  File "tests/test_input.py", line 10\nAssertionError: Input shape mismatch\n  expected: [1, 3, 224, 224]\n  received: [1, 224, 224, 3]')+'</pre>'+
(state===0&&!muted?'<div class="vs-suggestion"><b>学习伙伴</b>　输入通道顺序可能不一致<div>'+button('查看线索 · 定位第 6 行','explain')+button('稍后','later')+button('关闭此类提示','mute')+'</div></div>':'')+
(applied?'<div class="vs-result">'+(done?'输入维度断言通过；未验证 NPU 推理。':'代码已更新，验证尚未运行。')+'<div>'+button('运行输入测试','run')+button('撤销本次修改','undo')+'</div></div>':'')+'</div></div></div><div class="vs-status"><span>⑂ learn/shape-check　　'+(done?'✓ 0':'× 1')+'　△ 0</span><span>Ln 6, Col 5　 Spaces: 4　 UTF-8　 Python 3.11　 节点 03</span></div>'+
(note?'<div class="vs-toast" role="status">'+note+button('关闭','dismiss')+'</div>':'')+
(scene==='handoff'&&state===0&&!muted?'<div class="vs-handoff"><b>已从课程带入实践现场</b><p>节点 03 · 输入布局 / 分支 learn/shape-check</p><p>课程环境 v2 → 本地 v3；保留本地环境，适配说明。</p>'+button('在当前文件继续','continue')+'</div>':'')+'</div>';
document.getElementById('pcSceneLabel').textContent='VS Code 交互提案 · 代码、修改与测试均为模拟';
if(state===1){const ed=app.querySelector('.vs-editor'),hint=app.querySelector('.vs-inline');ed.scrollTop=hint.offsetTop-ed.offsetTop-24;}
if(scene==='experiment'){
 const branch=app.querySelector('.vs-status span');branch.textContent=branch.textContent.replace('learn/shape-check','experiment/shape-check');
 const title=app.querySelector('.vs-diff-title');if(title)title.innerHTML='隔离分支 · preprocess.py 修改预览 <span>主项目保持不变</span>';
 const accept=app.querySelector('[data-vs="accept"]');if(accept)accept.textContent='接受到隔离分支';
 const result=app.querySelector('.vs-result');if(result)result.insertAdjacentHTML('afterbegin','<b>隔离实验 · 主项目未修改</b><br>');
}
if(new URLSearchParams(location.search).get('view')==='code')parent.postMessage({wsCodeState:state},location.origin);
}
function act(a){
note='';
if(a==='explain')state=1;
if(a==='diff')state=2;
if(a==='accept')state=3;
if(a==='run'){if(state>=3)state=4;else note='输入测试仍失败，请核对第 6 行的通道顺序。';}
if(['reject','close','undo'].includes(a)){state=0;muted=false;if(a==='undo')note='已恢复原代码；当前显示原测试失败记录。';}
if(['later','mute','continue'].includes(a)){muted=true;note=a==='mute'?'已关闭此类主动提示。':a==='later'?'已暂存提示，编辑位置保留。':'学习节点与环境差异已记录，可继续编辑和运行。';}
render();
}
function reset(){state=scene==='experiment'?2:0;muted=false;note='';render();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-vs]');if(b){clearInterval(timer);act(b.dataset.vs);}});
document.getElementById('pcReset').onclick=()=>{clearInterval(timer);reset();};
addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;clearInterval(timer);if(e.data?.concept==='reset')reset();if(e.data?.concept==='play'){reset();const seq=scene==='experiment'?['accept','run','undo']:['explain','diff','accept','run'];let i=0;timer=setInterval(()=>{act(seq[i++]);if(i===seq.length)clearInterval(timer);},2800);}});
render();
})();
