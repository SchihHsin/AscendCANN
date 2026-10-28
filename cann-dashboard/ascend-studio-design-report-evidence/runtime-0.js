
const root=document.documentElement;
const deck=document.getElementById('deck');
const slides=[...document.querySelectorAll('.slide')];
let idx=0; let rOverviewTransition=false;

/* ===== 翻页过渡（可切换）：slide(默认) | fade | cut | slide-h | magic =====
   改默认改这行兜底值；或地址加 ?t=fade / ?t=cut / ?t=slide-h / ?t=magic 临时切换、不用改代码 */
const TRANSITION = (new URLSearchParams(location.search).get('t')) || 'slide';
const CTRL = TRANSITION!=='slide';
if(CTRL){ document.body.classList.add('ctrl'); document.body.dataset.transition=TRANSITION; }
const TDUR=600;
function setActive(i){ slides.forEach((s,k)=>{s.classList.toggle('active',k===i);s.classList.remove('leaving');s.style.transform='';s.style.opacity='';}); }
function showSlide(i,dir){
  const cur=slides.find(s=>s.classList.contains('active'));
  const nxt=slides[i]; if(!nxt||nxt===cur)return; dir=dir||'fwd';
  if(TRANSITION==='magic'&&cur){ magicMove(cur,nxt); return; }
  if(TRANSITION==='slide-h'){
    nxt.style.transition='none'; nxt.style.visibility='visible'; nxt.style.opacity='1';
    nxt.style.transform='translateX('+(dir==='fwd'?'100%':'-100%')+')';
    void nxt.offsetWidth; nxt.style.transition=''; nxt.classList.add('active'); nxt.style.transform='';
    if(cur){ cur.classList.remove('active'); cur.classList.add('leaving');
      cur.style.transform='translateX('+(dir==='fwd'?'-100%':'100%')+')';
      const c=cur; setTimeout(()=>{c.classList.remove('leaving');c.style.transform='';},TDUR); }
  } else {
    if(cur){ cur.classList.remove('active'); cur.classList.add('leaving'); const c=cur; setTimeout(()=>c.classList.remove('leaving'),TDUR); }
    nxt.classList.add('active');
  }
}
/* Keynote 式神奇移动：相邻两页中 data-key 相同的元素 FLIP 位移/缩放（用 Web Animations API）*/
function magicMove(cur,nxt){
  const out={}; cur.querySelectorAll('[data-key]').forEach(el=>{out[el.dataset.key]=el.getBoundingClientRect();});
  cur.classList.remove('active'); cur.classList.add('leaving'); nxt.classList.add('active');
  nxt.querySelectorAll('[data-key]').forEach(el=>{
    const o=out[el.dataset.key]; if(!o)return; const n=el.getBoundingClientRect(); if(!n.width||!n.height)return;
    const dx=o.left-n.left, dy=o.top-n.top, sx=o.width/n.width, sy=o.height/n.height;
    if(Math.abs(dx)<1&&Math.abs(dy)<1&&Math.abs(sx-1)<.02&&Math.abs(sy-1)<.02)return;
    el.style.zIndex='3';
    el.animate([{transformOrigin:'top left',transform:'translate('+dx+'px,'+dy+'px) scale('+sx+','+sy+')'},
                {transformOrigin:'top left',transform:'none'}],
               {duration:620,easing:'cubic-bezier(.4,0,.2,1)'}).onfinish=()=>{el.style.zIndex='';};
  });
  const c=cur; setTimeout(()=>c.classList.remove('leaving'),TDUR);
}

/* ===== 黑底光晕：每章一组色值，可调 + localStorage 持久记忆 ===== */
const chapters={'1':{h:234,gap:57,sat:95,light:40,spread:35,cint:68,wint:58}};
const GLOW_KEY='deck-glow-chapters';
try{const sv=localStorage.getItem(GLOW_KEY);if(sv){const o=JSON.parse(sv);Object.keys(o).forEach(k=>{if(chapters[k])Object.assign(chapters[k],o[k]);});}}catch(e){}
function saveChapters(){try{localStorage.setItem(GLOW_KEY,JSON.stringify(chapters));}catch(e){}}
function curChap(){return chapters[slides[idx].dataset.chapter];}
const S={h:'s-h',gap:'s-gap',sat:'s-sat',light:'s-light',spread:'s-spread',cint:'s-cint',wint:'s-wint'};
const V={h:'v-h',gap:'v-gap',sat:'v-sat',light:'v-light',spread:'v-spread',cint:'v-cint',wint:'v-wint'};
function paintSlide(s){const c=chapters[s.dataset.chapter];if(!c)return;
  s.style.setProperty('--glow-h',c.h);s.style.setProperty('--glow-h2',(c.h+c.gap)%360);
  s.style.setProperty('--glow-sat',c.sat+'%');s.style.setProperty('--glow-light',c.light+'%');
  s.style.setProperty('--glow-spread',c.spread);s.style.setProperty('--glow-color-int',(c.cint/100).toFixed(2));
  s.style.setProperty('--glow-white-int',(c.wint/100).toFixed(2));}
function apply(){slides.forEach(paintSlide);saveChapters();const c=curChap();if(!c)return;
  root.style.setProperty('--glow-h',c.h);root.style.setProperty('--glow-h2',(c.h+c.gap)%360);}
function syncPanel(){const c=curChap();if(!c)return;
  for(const k in S){const el=document.getElementById(S[k]),v=document.getElementById(V[k]);if(!el)continue;el.value=c[k];
    v.textContent=(k==='sat'||k==='light')?c[k]+'%':k==='spread'?c[k]+'vh':k==='gap'?c[k]+'°':(k==='cint'||k==='wint')?(c[k]/100).toFixed(2):c[k];}}
for(const k in S){const el=document.getElementById(S[k]);if(el)el.addEventListener('input',()=>{const c=curChap();if(!c)return;c[k]=+el.value;
  const v=document.getElementById(V[k]);v.textContent=(k==='sat'||k==='light')?el.value+'%':k==='spread'?el.value+'vh':k==='gap'?el.value+'°':(k==='cint'||k==='wint')?(el.value/100).toFixed(2):el.value;apply();});}
document.querySelectorAll('.preset').forEach(p=>p.onclick=()=>{const c=curChap();if(!c)return;const[h,sat,light]=p.dataset.p.split(',').map(Number);Object.assign(c,{h,sat,light});apply();syncPanel();});
function setPanelOpen(open){const p=document.getElementById('panel');if(p)p.style.display=open?'block':'none';}
document.addEventListener('click',e=>{const panel=document.getElementById('panel'),toggle=document.getElementById('toggle');if(!panel||!toggle)return;
  if(toggle.contains(e.target)){setPanelOpen(panel.style.display!=='block');syncPanel();return;}
  if(panel.contains(e.target))return; setPanelOpen(false);});

/* ===== 纵向 scroll-snap 翻页 + 右侧点 + 控制栏 + 总览 + 全屏 ===== */
if('scrollRestoration' in history) history.scrollRestoration='manual';
/* 滚动条默认隐藏，滚动时淡入、停 700ms 后淡出（body 是滚动容器，事件挂 body 不是 window；wheel 兜底）*/
let scrollbarTimer;
function flashScrollbar(){document.body.classList.add('scrolling');clearTimeout(scrollbarTimer);scrollbarTimer=setTimeout(()=>document.body.classList.remove('scrolling'),700);}
document.body.addEventListener('scroll',flashScrollbar,{passive:true});
addEventListener('scroll',flashScrollbar,{passive:true});
addEventListener('wheel',flashScrollbar,{passive:true});
const navDots=document.getElementById('navDots'), controls=document.getElementById('controls'), counter=document.getElementById('counter');
const prevBtn=document.getElementById('prevBtn'), nextBtn=document.getElementById('nextBtn'), ovBtn=document.getElementById('ovBtn'), fsBtn=document.getElementById('fsBtn');
const pad=n=>String(n).padStart(2,'0');
const dots=slides.map((s,i)=>{const b=document.createElement('button');b.className='nav-dot';b.title=pad(i+1)+' / '+pad(slides.length);b.onclick=()=>go(i);navDots.appendChild(b);return b;});

function updateCurrent(i){
  idx=i; const s=slides[idx];
  dots.forEach((d,k)=>d.classList.toggle('active',k===idx));
  counter.textContent=pad(idx+1)+' / '+pad(slides.length);
  if(!document.body.classList.contains('overview')) history.replaceState(null,'','#'+(idx+1));
  prevBtn.disabled=idx<=0; nextBtn.disabled=idx>=slides.length-1;
  document.body.classList.toggle('on-dark', s.classList.contains('s-cover')||s.classList.contains('s-glow'));
  const panel=document.getElementById('panel'),toggle=document.getElementById('toggle');
  if(s.dataset.chapter && s.classList.contains('chapter-cover')){ if(panel)s.appendChild(panel); if(toggle){s.appendChild(toggle);toggle.style.display='flex';} setPanelOpen(false); apply(); syncPanel(); }
  else if(toggle){ toggle.style.display='none'; setPanelOpen(false); }
}
/* slide 模式：谁滚进视口 ≥55% 谁就是当前页。受控模式无滚动，不用 IO */
if(!CTRL){
  const io=new IntersectionObserver(es=>{if(document.body.classList.contains('overview')||rOverviewTransition)return;es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=0.55){const i=slides.indexOf(e.target);if(i>=0&&i!==idx)updateCurrent(i);}});},{threshold:[0.55]});
  slides.forEach(s=>io.observe(s));
}

function go(n){ if(document.body.classList.contains('overview'))return; const i=Math.max(0,Math.min(slides.length-1,n));
  if(CTRL){ const dir=i>idx?'fwd':'back'; showSlide(i,dir); updateCurrent(i); }
  else slides[i].scrollIntoView({behavior:'smooth',block:'start'});
}
function next(){go(idx+1);} function prev(){go(idx-1);}
prevBtn.onclick=prev; nextBtn.onclick=next;
/* 受控模式：滚轮 / 触控板翻页（无原生滚动，需拦截 + 节流）*/
if(CTRL){
  let wlock=false;
  addEventListener('wheel',e=>{ if(document.body.classList.contains('overview'))return; e.preventDefault();
    if(wlock||Math.abs(e.deltaY)<6)return; wlock=true; setTimeout(()=>wlock=false,620);
    if(e.deltaY>0)next(); else prev();
  },{passive:false});
}

document.addEventListener('keydown',e=>{
  if(e.target.closest('input,textarea,select,[contenteditable=true]')||document.querySelector('.r-modal.open'))return;
  if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();next();}
  else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();prev();}
  else if(e.key==='Home'){e.preventDefault();go(0);}
  else if(e.key==='End'){e.preventDefault();go(slides.length-1);}
  else if(e.key==='o'||e.key==='O'){toggleOverview();}
  else if(e.key==='f'||e.key==='F'){toggleFullscreen();}
  else if(e.key==='Escape'){ if(document.body.classList.contains('overview')) exitOverview(); }
});

/* 全屏（进入后图标变退出全屏）*/
const ICON_MAX='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
const ICON_MIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M16 21v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>';
function syncFsIcon(){const fs=!!document.fullscreenElement;fsBtn.innerHTML=fs?ICON_MIN:ICON_MAX;fsBtn.title=fs?'退出全屏 F':'全屏 F';}
function toggleFullscreen(){ if(!document.fullscreenElement){document.documentElement.requestFullscreen().catch(()=>{});}else{document.exitFullscreen();} }
fsBtn.onclick=toggleFullscreen;
function reanchor(){ if(CTRL||document.body.classList.contains('overview'))return; slides[idx].scrollIntoView({block:'start',behavior:'auto'}); }
document.addEventListener('fullscreenchange',()=>{syncFsIcon();setTimeout(reanchor,90);});
syncFsIcon();

/* 总览 Overview：每页包进 .slide-inner 缩放成缩略图，排网格（按当前视窗比例）*/
function applyOverviewScale(){if(!document.body.classList.contains('overview'))return;const cellW=slides[0].getBoundingClientRect().width,scale=cellW/window.innerWidth;slides.forEach(s=>{s.style.height=(window.innerHeight*scale)+'px';const inner=s.querySelector(':scope>.slide-inner');if(inner)inner.style.transform='scale('+scale+')';});}
function enterOverview(){rOverviewTransition=true;slides.forEach(s=>{if(!s.querySelector(':scope>.slide-inner')){const w=document.createElement('div');w.className='slide-inner';while(s.firstChild)w.appendChild(s.firstChild);s.appendChild(w);}});document.body.classList.add('overview');requestAnimationFrame(applyOverviewScale);}
function exitOverview(){slides.forEach(s=>{const w=s.querySelector(':scope>.slide-inner');if(w){while(w.firstChild)s.insertBefore(w.firstChild,w);w.remove();}s.style.height='';});document.body.classList.remove('overview');updateCurrent(idx);balanceHeads();const destination=idx;if(CTRL){setActive(destination);rOverviewTransition=false;}else setTimeout(()=>{slides[destination].scrollIntoView({block:'start',behavior:'instant'});updateCurrent(destination);requestAnimationFrame(()=>{rOverviewTransition=false;});},20);}
function toggleOverview(){document.body.classList.contains('overview')?exitOverview():enterOverview();}
ovBtn.onclick=toggleOverview;
document.body.addEventListener('click',e=>{if(!document.body.classList.contains('overview'))return;const sl=e.target.closest('.slide');if(sl){const i=slides.indexOf(sl);if(i>=0){idx=i;exitOverview();}}});
addEventListener('resize',()=>{if(document.body.classList.contains('overview'))applyOverviewScale();else reanchor();balanceHeads();});

/* ===== 居中型页竖向平衡：直接量"页眉下沿→内容"和"内容→页脚上沿"两个可见空白，让它们相等 =====
   ⚠️ 别拿页眉高度当 padding-bottom（试过，会系统性补过头）：页眉的留白已经是它自己的 margin-bottom，
   不需要重复补；真正缺的只是页脚那一截（.foot 绝对定位、不占流式空间，但视觉上离底边有自己的 inset）。
   两个空白差是 P 的线性函数、斜率恰为 -1（justify-content:center 对称分担），所以不用试错：
   newPad = 当前 padding-bottom + (topGap − botGap)，一步算出让两个空白相等的正确值。
   只作用于标了 .vc 的居中型页；填满型页不动 */
function balanceHeads(){
  if(document.body.classList.contains('overview'))return;
  document.querySelectorAll('.body-area.vc').forEach(function(ba){
    var head=ba.parentElement.querySelector('.head');
    var foot=ba.parentElement.querySelector('.foot');
    var kids=ba.children; if(!head||!foot||!kids.length)return;
    var firstTop=kids[0].getBoundingClientRect().top;
    var lastBottom=kids[kids.length-1].getBoundingClientRect().bottom;
    var topGap=firstTop-head.getBoundingClientRect().bottom;
    var botGap=foot.getBoundingClientRect().top-lastBottom;
    var curPad=parseFloat(getComputedStyle(ba).paddingBottom)||0;
    ba.style.paddingBottom=Math.max(0,curPad+(topGap-botGap))+'px';
  });
}
requestAnimationFrame(balanceHeads);

/* 底部控制栏 / 右侧导航点各自独立显隐：移到底部出底部栏、移到右侧出右侧点，离开该区即淡出 */
document.addEventListener('mousemove',e=>{
  controls.classList.toggle('show', e.clientY > window.innerHeight - 120);
  navDots.classList.toggle('show', e.clientX > window.innerWidth - 120);
});
document.addEventListener('mouseleave',()=>{ controls.classList.remove('show'); navDots.classList.remove('show'); });

const initialPage=Math.min(slides.length,Math.max(1,parseInt(location.hash.slice(1),10)||1))-1;
slides.forEach(paintSlide);
updateCurrent(initialPage);
if(CTRL) setActive(initialPage);
else requestAnimationFrame(()=>slides[initialPage].scrollIntoView({block:'start',behavior:'instant'}));
addEventListener('hashchange',()=>{const n=parseInt(location.hash.slice(1),10);if(n>=1&&n<=slides.length)go(n-1);});
document.fonts.ready.then(()=>{balanceHeads();reanchor();});
