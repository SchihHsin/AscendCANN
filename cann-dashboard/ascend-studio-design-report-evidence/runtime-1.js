
const rModal=document.querySelector('.r-modal');
let rFocus=null;
function drawService(){
  if(document.body.classList.contains('overview'))return;
  const w=document.querySelector('.r-service'),svg=w.querySelector('svg'),wr=w.getBoundingClientRect();
  const box=e=>{const r=e.getBoundingClientRect();return {x:r.left-wr.left,y:r.top-wr.top,w:r.width,h:r.height};};
  const left=[...w.querySelectorAll('.r-service-col:first-of-type .r-service-item')];
  const cols=w.querySelectorAll('.r-service-col');
  const inputs=[...cols[0].querySelectorAll('.r-service-item')],outputs=[...cols[1].querySelectorAll('.r-service-item')],core=box(w.querySelector('.r-service-core'));
  svg.setAttribute('viewBox','0 0 '+wr.width+' '+wr.height);
  let paths='<defs><marker id="supply-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="#a4a0bd" stroke-width="1.3"/></marker></defs>';
  for(const input of inputs){const b=box(input),x1=b.x+b.w+3,y1=b.y+b.h/2,x2=core.x-5,y2=core.y+core.h/2;paths+='<path d="M'+x1+' '+y1+' C'+(x1+(x2-x1)*.5)+' '+y1+' '+(x1+(x2-x1)*.5)+' '+y2+' '+x2+' '+y2+'" fill="none" stroke="#b3b2c7" stroke-width="1.5" marker-end="url(#supply-arrow)"/>';}
  for(const output of outputs){const b=box(output),x1=core.x+core.w+3,y1=core.y+core.h/2,x2=b.x-5,y2=b.y+b.h/2;paths+='<path d="M'+x1+' '+y1+' C'+(x1+(x2-x1)*.5)+' '+y1+' '+(x1+(x2-x1)*.5)+' '+y2+' '+x2+' '+y2+'" fill="none" stroke="#b3b2c7" stroke-width="1.5" marker-end="url(#supply-arrow)"/>';}
  const a=box(outputs[2]),b=box(inputs[1]),y=wr.height-45;
  paths+='<path d="M'+(a.x+a.w/2)+' '+(a.y+a.h+5)+' V'+y+' H'+(b.x+b.w/2)+' V'+(b.y+b.h+5)+'" fill="none" stroke="#7da896" stroke-width="1.5" stroke-dasharray="5 5" marker-end="url(#supply-arrow)"/>';
  svg.innerHTML=paths;
}
document.fonts.ready.then(drawService);addEventListener('resize',drawService);
function closeFigure(){rModal.classList.remove('open');rModal.setAttribute('aria-hidden','true');document.getElementById('deck').inert=false;document.getElementById('controls').inert=false;document.getElementById('navDots').inert=false;if(rFocus)rFocus.focus();}
document.querySelectorAll('.r-enlarge').forEach(b=>b.addEventListener('click',()=>{rFocus=b;rModal.querySelector('img').src=b.parentElement.querySelector('img').src;rModal.classList.add('open');rModal.setAttribute('aria-hidden','false');document.getElementById('deck').inert=true;document.getElementById('controls').inert=true;document.getElementById('navDots').inert=true;rModal.querySelector('button').focus();}));
rModal.querySelector('button').addEventListener('click',closeFigure);
rModal.addEventListener('click',e=>{if(e.target===rModal)closeFigure();});
document.addEventListener('keydown',e=>{if(rModal.classList.contains('open')&&e.key==='Escape')closeFigure();if(rModal.classList.contains('open')&&e.key==='Tab'){e.preventDefault();rModal.querySelector('button').focus();}});
document.querySelector('.r-send').addEventListener('click',()=>{const t=document.querySelector('.r-prompt-box textarea').value.trim();document.querySelector('.r-prompt-feedback').textContent=t?'已发送此页演示草稿；可以继续修改并再次体验。':'请先写下希望发送的目标。';});
