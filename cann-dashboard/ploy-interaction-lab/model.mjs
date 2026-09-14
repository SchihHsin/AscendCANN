export const initialNodes=()=>[
 {id:'concept',title:'理解 ONNX 到昇腾推理的流程',type:'视频理解',minutes:20,done:false,locked:false,optional:false,requires:[]},
 {id:'env',title:'准备 310P 首跑环境',type:'动手跟练',minutes:35,done:false,locked:false,optional:false,requires:['concept']},
 {id:'convert',title:'转换模型并检查输入规格',type:'动手跟练',minutes:40,done:false,locked:false,optional:false,requires:['env']},
 {id:'run',title:'运行推理并核对输出',type:'运行验证',minutes:30,done:false,locked:false,optional:false,requires:['convert']},
 {id:'serve',title:'封装一个可调用的推理服务',type:'扩展实践',minutes:60,done:false,locked:false,optional:true,requires:['run']}
];
export function propose(nodes,selected,prompt){
 const scope=nodes.filter(n=>!n.done&&!n.locked&&(!selected.length||selected.includes(n.id)));
 let changes=[];
 if(/云|环境|修复|兼容/.test(prompt)){
  const target=scope.find(n=>n.id==='env'||n.id==='run');
  if(target){if(target.id==='env')changes.push({kind:'replace',id:'env',before:target.title,after:'在云端体验环境中完成首跑准备',minutes:20});
  else if(!nodes.some(n=>n.id==='repair'))changes.push({kind:'insert',id:'repair',beforeId:'run',after:'核对 ATC 输入规格并重新转换',minutes:15});}
 }else if(/增加|补充|加.*练习/.test(prompt)){
  const target=scope.find(n=>n.id==='convert');if(target&&!nodes.some(n=>n.id==='extra'))changes.push({kind:'insert',id:'extra',beforeId:'convert',after:'练习：辨认模型的输入张量',minutes:15});
 }else if(/三天|3天|缩短|精简|暂缓|部署|服务/.test(prompt)){
  scope.filter(n=>n.optional).forEach(n=>changes.push({kind:'defer',id:n.id,before:n.title}));
 }
 return {prompt,scope:scope.map(n=>n.id),changes};
}
export function applyChanges(nodes,proposal){
 let next=structuredClone(nodes);
 for(const c of proposal.changes){
  if(c.kind==='defer')next=next.filter(n=>n.id!==c.id||n.done||n.locked);
  if(c.kind==='replace')next=next.map(n=>n.id===c.id&&!n.done&&!n.locked?{...n,title:c.after,minutes:c.minutes}:n);
  if(c.kind==='insert'){
   const pos=next.findIndex(n=>n.id===c.beforeId);if(pos<0||next.some(n=>n.id===c.id)||next[pos].done||next[pos].locked)continue;
   const requires=[...next[pos].requires]; next[pos].requires=[...requires,c.id];
   next.splice(pos,0,{id:c.id,title:c.after,type:'补充跟练',minutes:c.minutes,done:false,locked:false,optional:false,requires});
  }
 }
 return next;
}
export function validOrder(nodes){const seen=new Set();return nodes.every(n=>{const ok=n.requires.every(id=>seen.has(id));seen.add(n.id);return ok;});}
export function restoreProgress(snapshot,current){
 const done=new Set(current.filter(n=>n.done).map(n=>n.id));
 const restored=snapshot.map(n=>({...n,done:n.done||done.has(n.id)}));
 current.forEach((n,i)=>{if(!n.done||restored.some(r=>r.id===n.id))return;const next=current.slice(i+1).find(x=>restored.some(r=>r.id===x.id));const pos=next?restored.findIndex(r=>r.id===next.id):restored.length;restored.splice(pos,0,structuredClone(n));});
 return restored;
}
