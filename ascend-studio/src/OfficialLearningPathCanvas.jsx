import { useEffect, useMemo, useRef, useState } from "react";
import { IconArrowRight, IconBook2, IconCheck, IconChevronDown, IconCode, IconCube, IconDeviceDesktop, IconPhoto, IconPointer, IconRoute, IconSearch } from "@tabler/icons-react";
import { OFFICIAL_LEARNING_STAGES, getOfficialCourseStatus, getOfficialLearningNode, officialStatusLabel } from "./official-learning-data";
import LearningCanvasToolbar from "./LearningCanvasToolbar";
import LearningCanvasCard from "./LearningCanvasCard";
import OfficialLearningVisuals from "./OfficialLearningVisuals";
import { OfficialLesson, OfficialPractice, OfficialSources } from "./OfficialLearningActivities";
import "./learning-hierarchy-canvas.css";
import "./official-learning-canvas.css";

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const icons = [IconRoute, IconDeviceDesktop, IconPhoto, IconCube, IconSearch];
function makeTree(layout, personalPlan) {
  let offset = 0;
  const horizontal = layout === "horizontal";
  const groups = OFFICIAL_LEARNING_STAGES.map((stage, i) => {
    const rect = horizontal ? { x: 0, y: offset, width: 258, height: 72 } : { x: i * 320, y: 0, width: 292, height: 72 };
    const order = personalPlan?.orderByStage?.[stage.id] || [];
    const children = [...stage.children].sort((a, b) => {
      const aIndex = order.indexOf(a.id), bIndex = order.indexOf(b.id);
      return (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex);
    }).map((child, j) => ({ ...child, rect: horizontal ? { x: 32, y: offset + 82 + j * 55, width: 226, height: 47 } : { x: i * 320 + 20, y: 88 + j * 55, width: 272, height: 47 } }));
    offset += 95 + children.length * 55;
    return { ...stage, index: i, rect, children };
  });
  return { groups, width: horizontal ? 258 : groups.length * 320 - 28, height: horizontal ? offset - 20 : 310 };
}

function Hierarchy({ tree, layout, node, statuses, onSelect, onDrag, editing = false, onMoveStep }) {
  const horizontal = layout === "horizontal";
  const pointerDrag = useRef(null);
  const [draggedStep, setDraggedStep] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropNotice, setDropNotice] = useState("");
  const suppressClick = useRef(false);
  const finishStepDrag = (event, allowDrop = true) => {
    const drag = pointerDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    pointerDrag.current = null;
    if (!drag.active) return;
    const target = allowDrop ? document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-official-stage]") : null;
    const targetStage = target?.getAttribute("data-official-stage"), targetStep = target?.getAttribute("data-official-step");
    if (targetStage === drag.stageId && targetStep && targetStep !== drag.stepId) onMoveStep?.(drag.stageId, drag.stepId, targetStep);
    else if (targetStage && targetStage !== drag.stageId) { setDropNotice("官方阶段顺序存在依赖；个人计划仅支持同一阶段内换序。"); window.setTimeout(() => setDropNotice(""), 2600); }
    suppressClick.current = true;
    window.setTimeout(() => { suppressClick.current = false; }, 0);
    setDraggedStep(null); setDropTarget(null);
  };
  return <div className={`lh-hierarchy is-${layout}`} style={{ width: tree.width, height: tree.height }}>{dropNotice && <div className="lh-reorder-hint" role="status">{dropNotice}</div>}
    <div className="lh-tree-grab" role="button" tabIndex={0} aria-label="移动完整学习层级" title="拖动学习层级" onPointerDown={onDrag} onKeyDown={event=>{const d={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[event.key];if(d){event.preventDefault();onDrag(null,d);}}}><IconPointer size={12} />学习路径</div>
    <svg className="lh-tree-lines" width={tree.width + 20} height={tree.height + 20} aria-hidden="true"><defs><marker id="og-tree-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8" /></marker></defs>{tree.groups.map((stage, index) => {
      const next = tree.groups[index + 1], r = stage.rect;
      return <g key={stage.id}>{next && <path className="lh-stage-line" markerEnd="url(#og-tree-arrow)" d={horizontal ? `M${r.x + 18},${r.y + r.height} V${next.rect.y - 8}` : `M${r.x + r.width},${r.y + 34} H${next.rect.x - 8}`} />}{stage.children.map(child => <path key={child.id} className={`lh-child-line${node.id === child.id ? " is-current" : ""}`} d={`M${r.x + 18},${r.y + r.height} V${child.rect.y + 23} H${child.rect.x}`} />)}</g>;
    })}</svg>
    {tree.groups.map(stage => { const Icon = icons[stage.index]; const status = getOfficialCourseStatus(stage, statuses); return <div key={stage.id}>
      <button type="button" data-official-stage={stage.id} className={`lh-tree-node lh-stage-node${node.courseId === stage.id ? " is-selected" : ""}`} style={{left:stage.rect.x,top:stage.rect.y,width:stage.rect.width,height:stage.rect.height}} onClick={() => onSelect(stage.children.find(child => statuses[child.id] !== "completed")?.id || stage.children[0].id)} aria-pressed={node.courseId === stage.id}><span className={`lh-node-icon${status === "completed" ? " is-done" : ""}`}>{status === "completed" ? <IconCheck size={19} /> : <Icon size={20} />}</span><span><strong>{String(stage.index + 1).padStart(2,"0")}　{stage.title}</strong><small>{stage.children.filter(child => statuses[child.id] === "completed").length}/{stage.children.length} 已完成 · 建议 {stage.minutes} 分钟</small></span><em className={`og-stage-status is-${status}`}>{officialStatusLabel(status)}</em></button>
      {stage.children.map((child,index) => <button type="button" key={child.id} data-official-stage={stage.id} data-official-step={child.id} className={`lh-tree-node lh-step-node${node.id === child.id ? " is-selected" : ""}${draggedStep?.stepId === child.id ? " is-dragging" : ""}${dropTarget?.stageId === stage.id && dropTarget.stepId === child.id ? " is-drop-target" : ""}${editing ? " is-plan-editable" : ""}`} style={{left:child.rect.x,top:child.rect.y,width:child.rect.width,height:child.rect.height}} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } onSelect(child.id); }} aria-pressed={node.id === child.id} aria-label={editing ? `${child.title}；可在个人计划草案中拖动调整顺序，也可按 Alt 加方向键移动` : child.title} title={editing ? "拖动调整个人计划顺序；键盘可按 Alt + ↑ / ↓ 调整" : "选择学习节点"} onPointerDown={event => { if (!editing || event.button !== 0 || pointerDrag.current) return; pointerDrag.current = { stageId: stage.id, stepId: child.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, active: false }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={event => { const drag = pointerDrag.current; if (!drag || drag.pointerId !== event.pointerId) return; if (!drag.active && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return; if (!drag.active) { drag.active = true; setDraggedStep({ stageId: drag.stageId, stepId: drag.stepId }); } event.preventDefault(); const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-official-stage][data-official-step]"); const targetStage = target?.getAttribute("data-official-stage"), targetStep = target?.getAttribute("data-official-step"); const nextTarget = targetStage === drag.stageId && targetStep ? { stageId: targetStage, stepId: targetStep } : null; setDropTarget(current => current?.stageId === nextTarget?.stageId && current?.stepId === nextTarget?.stepId ? current : nextTarget); }} onPointerUp={event => finishStepDrag(event)} onPointerCancel={event => finishStepDrag(event, false)} onKeyDown={event => { if (!editing || !event.altKey || !["ArrowUp", "ArrowDown"].includes(event.key)) return; const target = stage.children[index + (event.key === "ArrowUp" ? -1 : 1)]; if (!target) return; event.preventDefault(); onMoveStep?.(stage.id, child.id, target.id); }}><span className="lh-step-index">{stage.index + 1}.{index + 1}</span><span><strong>{child.title}</strong><small>{child.concepts.slice(0,2).join(" · ")}</small></span><i className={`og-step-status is-${statuses[child.id] || "not-started"}`} aria-label={officialStatusLabel(statuses[child.id])}>{statuses[child.id] === "completed" ? <IconCheck size={10} /> : null}</i></button>)}
    </div>; })}
  </div>;
}

export function OfficialLearningPathCanvas({ journey, view, visible = true, onAsk, onCopy, onOpenPreprocessing }) {
  const { state, actions } = journey;
  const { state: canvas, actions: canvasActions } = view;
  const host = useRef(null), gesture = useRef(null), latest = useRef(null), previousNode = useRef(state.selectedNodeId);
  const [size,setSize] = useState({width:0,height:0});
  const [hand,setHand] = useState(false);
  const [heights,setHeights] = useState({});
  const personalPlan = state.personalPlan;
  const editingPersonalPlan = personalPlan?.status === "draft";
  const tree = useMemo(() => makeTree(canvas.layout, personalPlan), [canvas.layout, personalPlan]);
  const selected = getOfficialLearningNode(state.selectedNodeId);
  const node = selected?.kind === "step" ? selected : getOfficialLearningNode(OFFICIAL_LEARNING_STAGES[0].children[0].id);
  const stage = tree.groups.find(item => item.id === node.courseId) || tree.groups[0];
  const step = stage.children.find(item => item.id === node.id) || stage.children[0];
  const horizontal = canvas.layout === "horizontal";
  const treePoint = canvas.positions.hierarchy || {x:42,y:100};
  const diagramWidth = 780, lessonWidth = 700;
  const baseY = horizontal ? treePoint.y + stage.rect.y : treePoint.y + tree.height + 75;
  const contentX = horizontal ? treePoint.x + 308 : Math.max(45,Math.min(treePoint.x + stage.rect.x,treePoint.x + tree.width - diagramWidth));
  const keyFor = kind => `${node.id}:${kind}`;
  const diagramHeight = heights[`${node.id}:diagram`] || 370;
  const practiceHeight = heights[`${node.id}:practice`] || 460;
  const defaultPoint = kind => ({x:contentX,y:baseY + (kind === "diagram" ? 0 : kind === "practice" ? diagramHeight + 28 : diagramHeight + 28 + (["preprocess","contract","execution","summary"].includes(node.visual) ? practiceHeight + 28 : 0))});
  const position = kind => canvas.positions[keyFor(kind)] || defaultPoint(kind);
  const viewport = canvas.viewport;
  const expanded = canvas.expanded;
  const hidden = kind => !expanded || canvas.hidden.includes(keyFor(kind));
  const practice = ["preprocess","contract","execution","summary"].includes(node.visual);
  const world = {width:Math.max(1500,tree.width + 100,contentX + 870),height:Math.max(tree.height + 200,baseY + 1750)};
  const done = Object.values(state.statuses).filter(value => value === "completed").length;
  const total = OFFICIAL_LEARNING_STAGES.reduce((sum,item) => sum + item.children.length,0);
  const fitBounds = (bounds, padding = 28, min = .35) => {
    const top = size.width < 650 ? 132 : 86;
    const scale = clamp(Math.min((size.width-padding*2)/bounds.width,(size.height-top-22)/bounds.height),min,1.1);
    canvasActions.setViewport({scale,x:padding-bounds.x*scale,y:top-bounds.y*scale});
  };
  const fitContext = () => {
    const p=position("diagram");
    if (horizontal) {
      const narrow=size.width<720;
      fitBounds({x:narrow?p.x-82:Math.min(treePoint.x,p.x),y:p.y-8,width:narrow?diagramWidth+100:p.x+diagramWidth-treePoint.x+15,height:660},24,narrow?.55:.45);
    } else fitBounds({x:Math.max(15,contentX-90),y:treePoint.y-18,width:diagramWidth+190,height:tree.height+520},24,.4);
  };
  const fitPath = () => {canvasActions.setFocused(false);fitBounds({x:treePoint.x-10,y:treePoint.y-35,width:horizontal?1120:tree.width+35,height:horizontal?tree.height+60:tree.height+590},26,.25);};
  const focus = () => {
    if(canvas.focused){canvasActions.setFocused(false);return;}
    canvasActions.setFocused(true);
    canvasActions.revealObject(keyFor("diagram"));
    fitBounds({...position("diagram"),width:diagramWidth,height:460},24,.45);
  };
  latest.current={viewport,canvasActions};
  useEffect(()=>{
    const element=host.current;if(!element)return undefined;
    const observer=new ResizeObserver(entries=>{const{width,height}=entries[0].contentRect;if(width>0&&height>0)setSize({width,height});});
    observer.observe(element);return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const cards=host.current?.querySelectorAll(".lh-card");
    if(!cards?.length)return;
    const observer=new ResizeObserver(entries=>setHeights(previous=>{
      const next={...previous};let changed=false;
      for(const entry of entries){const id=entry.target.dataset.objectId;const height=entry.borderBoxSize?.[0]?.blockSize || entry.target.offsetHeight;if(id&&Math.abs((previous[id]||0)-height)>.5){next[id]=height;changed=true;}}
      return changed?next:previous;
    }));cards.forEach(card=>observer.observe(card));return()=>observer.disconnect();
  },[node.id,canvas.hidden,canvas.expanded]);
  useEffect(()=>{
    if(!visible||size.width<50)return;
    if(!canvas.initialized||previousNode.current!==node.id||!canvas.canvasSize||Math.abs(size.width-canvas.canvasSize.width)>40||Math.abs(size.height-canvas.canvasSize.height)>80){
      if(canvas.focused)fitBounds({...position("diagram"),width:diagramWidth,height:460},24,.45);else fitContext();
      canvasActions.markInitialized();canvasActions.rememberSize(size);previousNode.current=node.id;
    }
  },[visible,size.width,size.height,node.id,canvas.layout,canvas.initialized,canvas.canvasSize]);
  useEffect(()=>{
    const element=host.current;if(!element)return undefined;
    const wheel=event=>{
      if(event.target.closest("input,textarea,select,summary,a"))return;
      event.preventDefault();const {viewport:old,canvasActions:a}=latest.current;
      if(event.ctrlKey||event.metaKey){const r=element.getBoundingClientRect(),x=event.clientX-r.left,y=event.clientY-r.top;const scale=clamp(old.scale*Math.exp(-event.deltaY*.002),.25,1.6);a.setViewport({scale,x:x-(x-old.x)*scale/old.scale,y:y-(y-old.y)*scale/old.scale});}
      else a.setViewport({x:old.x-event.deltaX,y:old.y-event.deltaY});
    };
    element.addEventListener("wheel",wheel,{passive:false});return()=>element.removeEventListener("wheel",wheel);
  },[]);
  const zoom=delta=>{const scale=clamp(viewport.scale+delta,.25,1.6);canvasActions.setViewport({scale,x:size.width/2-(size.width/2-viewport.x)*scale/viewport.scale,y:size.height/2-(size.height/2-viewport.y)*scale/viewport.scale});};
  const select=id=>{const selectedNode=getOfficialLearningNode(id);if(!selectedNode)return;actions.selectNode(id);canvasActions.select(selectedNode.courseId,selectedNode.id);canvasActions.revealObject(`${selectedNode.id}:diagram`);canvasActions.revealObject(`${selectedNode.id}:lesson`);};
  const beginObjectDrag=(event,id,point)=>{
    if(canvas.pinned.includes(id))return;
    if(!event){canvasActions.moveObject(id,point);return;}
    if(event.button!==0)return;event.preventDefault();event.stopPropagation();gesture.current={id,startX:event.clientX,startY:event.clientY,original:point};host.current.setPointerCapture(event.pointerId);
  };
  const cardProps=kind=>({id:keyFor(kind),point:position(kind),width:kind==="diagram"?diagramWidth:lessonWidth,pinned:canvas.pinned.includes(keyFor(kind)),onDrag:beginObjectDrag,onTogglePin:id=>{if(!canvas.pinned.includes(id))canvasActions.moveObject(id,position(kind));canvasActions.togglePin(id);},onCollapse:()=>canvasActions.hideObject(keyFor(kind))});
  const restorePill=(kind,title)=><button type="button" className="lh-restore-material" style={{left:position(kind).x,top:position(kind).y}} onClick={()=>{canvasActions.setExpanded(true);canvasActions.revealObject(keyFor(kind));}}><IconBook2 size={18}/><span>材料已收起<strong>恢复{title}</strong></span><IconChevronDown size={16}/></button>;
  const start={x:treePoint.x+step.rect.x+step.rect.width,y:treePoint.y+step.rect.y+step.rect.height/2};
  const p=position("diagram");
  const connection=horizontal?`M${start.x},${start.y} H${treePoint.x+tree.width+22} V${p.y+26} H${p.x}`:`M${start.x},${start.y} H${treePoint.x+stage.rect.x+stage.rect.width+14} V${treePoint.y+tree.height+32} H${p.x+60} V${p.y}`;
  return <div ref={host} className={`learning-hierarchy-canvas goal-learning-canvas${hand?" is-hand":""}`} aria-label="可移动的 ResNet50 学习层级与内容画布" onPointerDown={event=>{
    if(event.button!==0||event.target.closest("button,input,textarea,select,summary,a,.lh-card,.lh-tree-node"))return;
    gesture.current={id:"viewport",startX:event.clientX,startY:event.clientY,original:viewport};event.currentTarget.setPointerCapture(event.pointerId);
  }} onPointerMove={event=>{const drag=gesture.current;if(!drag)return;const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;if(drag.id==="viewport")canvasActions.setViewport({x:drag.original.x+dx,y:drag.original.y+dy});else canvasActions.moveObject(drag.id,{x:drag.original.x+dx/viewport.scale,y:drag.original.y+dy/viewport.scale});}} onPointerUp={()=>{gesture.current=null;}} onPointerCancel={()=>{gesture.current=null;}}>
    <div className={`lh-canvas-title${editingPersonalPlan?" is-draft-path":""}`}><IconBook2 size={22}/><div>{personalPlan&&<div className="og-plan-state">{editingPersonalPlan?<><i/>个人计划草案 · 尚未确认</>:"我的学习计划 · 基于官方路径"}</div>}<h2>跑通一次 ResNet50 图像推理</h2><p>{editingPersonalPlan?"拖动同一阶段内的节点调整个人顺序；官方路径与学习进度不变":`${personalPlan?"个人计划":"官方目标学习路径"} · ${done}/${total} 个学习动作已完成`}</p></div></div>
    <LearningCanvasToolbar layout={canvas.layout} scale={viewport.scale} hand={hand} focused={canvas.focused} canEditPath={!editingPersonalPlan} onEditPath={actions.startPersonalPlan} onLayout={next=>{if(canvas.focused)canvasActions.setFocused(false);canvasActions.setLayout(next);}} onZoom={zoom} onResetZoom={()=>canvasActions.setViewport({scale:1})} onHand={()=>setHand(value=>!value)} onFit={fitPath} onFocus={focus}/>
    <div className="lh-world" style={{width:world.width,height:world.height,transform:`translate(${viewport.x}px,${viewport.y}px) scale(${viewport.scale})`}}>
      {!hidden("diagram")&&<svg className="lh-material-lines" width={world.width} height={world.height} aria-hidden="true"><path d={connection}/><circle cx={start.x} cy={start.y} r="4"/></svg>}
      <div className="lh-tree-position" style={{left:treePoint.x,top:treePoint.y}}><Hierarchy tree={tree} layout={canvas.layout} node={node} statuses={state.statuses} onSelect={select} editing={editingPersonalPlan} onMoveStep={actions.movePersonalPlanStep} onDrag={(event,delta)=>beginObjectDrag(event,"hierarchy",delta?{x:treePoint.x+delta[0],y:treePoint.y+delta[1]}:treePoint)}/></div>
      {!hidden("diagram")?<LearningCanvasCard {...cardProps("diagram")} title={node.title} icon={node.visual==="image"?IconPhoto:IconCube}><OfficialLearningVisuals key={node.id} node={node} journey={journey}/>{["image","preprocess","contract"].includes(node.visual)&&<div className="og-related"><button type="button" className="lh-text-button" onClick={onOpenPreprocessing}>回看已有的图像输入预处理图解<IconArrowRight size={13}/></button></div>}</LearningCanvasCard>:restorePill("diagram","图解")}
      {practice&&(!hidden("practice")?<LearningCanvasCard {...cardProps("practice")} title={node.visual==="summary"?"学习记录与成果":"动手练习与本次检查"} icon={IconCode}><OfficialPractice node={node} journey={journey} onCopy={onCopy}/></LearningCanvasCard>:restorePill("practice","练习"))}
      {!hidden("lesson")?<LearningCanvasCard {...cardProps("lesson")} title="讲解、视频与理解检查" icon={IconBook2}><OfficialLesson node={node} journey={journey} onAsk={onAsk} onCopy={onCopy}/><OfficialSources node={node} journey={journey}/>{state.statuses[node.id]==="completed"&&<div className="og-next"><span><IconCheck size={14}/>当前学习动作已完成</span><button type="button" className="lh-button" onClick={()=>{const all=personalPlan?.status==="confirmed"?tree.groups.flatMap(item=>item.children):OFFICIAL_LEARNING_STAGES.flatMap(item=>item.children);const next=all[all.findIndex(item=>item.id===node.id)+1];if(next)select(next.id);else select("learning-official-step-save-summary");}}>继续下一步<IconArrowRight size={13}/></button></div>}</LearningCanvasCard>:restorePill("lesson","视频与讲解")}
    </div>
    {editingPersonalPlan && <div className="lh-draft-controls og-personal-plan-controls" aria-label="个人学习计划操作"><span className="og-personal-plan-status"><i />个人计划草案 · 不改变官方路径</span><button type="button" className="lh-button og-plan-confirm" onClick={actions.confirmPersonalPlan}>确认个人计划</button><button type="button" className="lh-button" disabled={!state.personalPlanUndo?.length} onClick={actions.undoPersonalPlanStep}>撤销</button><button type="button" className="lh-button" onClick={actions.cancelPersonalPlanEdit}>取消</button></div>}
    {state.notice&&<div className="lh-canvas-notice" role="status">{state.notice}</div>}
    <div className="lh-minimap"><svg viewBox={`0 0 ${world.width} ${world.height}`} aria-label="学习画布小地图，点击定位" role="button" tabIndex={0} onClick={event=>{const r=event.currentTarget.getBoundingClientRect();const x=(event.clientX-r.left)/r.width*world.width,y=(event.clientY-r.top)/r.height*world.height;canvasActions.setViewport({x:size.width/2-x*viewport.scale,y:size.height/2-y*viewport.scale});}} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();fitPath();}}}><rect className="lh-mini-bg" width={world.width} height={world.height}/>{tree.groups.map(item=><rect className={item.id===node.courseId?"is-current":""} key={item.id} x={treePoint.x+item.rect.x} y={treePoint.y+item.rect.y} width={item.rect.width} height={item.rect.height} rx="8"/>)}<rect x={p.x} y={p.y} width={diagramWidth} height="380" rx="8"/><rect className="lh-mini-viewport" x={-viewport.x/viewport.scale} y={-viewport.y/viewport.scale} width={size.width/viewport.scale} height={size.height/viewport.scale}/></svg><button type="button" onClick={fitPath}>适应路径</button></div>
  </div>;
}
