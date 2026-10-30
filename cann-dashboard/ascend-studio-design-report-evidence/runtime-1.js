
const rModal=document.querySelector('.r-modal');
const liveDialog=document.querySelector('.r-live-demo');
const liveFrame=liveDialog.querySelector('iframe');
let rFocus=null;
function drawService(){
  if(document.body.classList.contains('overview'))return;
  const w=document.querySelector('.r-service'),svg=w.querySelector('svg'),wr=w.getBoundingClientRect();
  const box=e=>{const r=e.getBoundingClientRect();return {x:r.left-wr.left,y:r.top-wr.top,w:r.width,h:r.height};};
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
const phoneImage=document.querySelector('.r-phone-stage>img');
const phoneCaption=document.querySelector('.r-phone-caption');
const phoneSources=[...document.querySelectorAll('[data-phone-source]')];
document.querySelectorAll('[data-phone-state]').forEach(button=>button.addEventListener('click',()=>{
  const source=phoneSources[Number(button.dataset.phoneState)];
  if(!source||!phoneImage)return;
  phoneImage.src=source.src;phoneImage.alt=source.alt;
  phoneCaption.textContent=source.dataset.phoneDescription||source.alt;
  document.querySelectorAll('[data-phone-state]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
document.querySelectorAll('.r-demo-launch').forEach(button=>button.addEventListener('click',()=>{
  const url=button.dataset.demoUrl, fallback=button.dataset.demoFallback;
  liveDialog.querySelector('h1').textContent=button.dataset.demoTitle;
  liveDialog.querySelector('#r-demo-new-window').href=url;
  const local=liveDialog.querySelector('#r-demo-fallback');local.hidden=!fallback;if(fallback)local.href=fallback;
  liveFrame.src=url;liveDialog.showModal();
}));
liveDialog.querySelector('.r-demo-close').addEventListener('click',()=>liveDialog.close());
liveDialog.addEventListener('close',()=>{liveFrame.src='about:blank';});
liveDialog.addEventListener('click',e=>{if(e.target===liveDialog)liveDialog.close();});
