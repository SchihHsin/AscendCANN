import { ICON_SIZE } from "./icon-system.js";
import { Fragment, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  IconArrowUpRight,
  IconChevronDown,
  IconChevronRight,
  IconDots,
  IconHistory,
  IconSearch,
  IconGitCompare,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { buildContentMap, summarizeContentMapItem } from "./task-content-map";
import { CanvasFitIcon } from "./shared/canvas/index.jsx";
import "./task-content-overview.css";
import "./task-content-map.css";

const asIds = (value) => Array.isArray(value) ? value : [];
const shortCategory = (id, label) => ({ explain: "解释", experiment: "试改", check: "检查", change: "修改", reference: "来源" }[id] || label || "其他");
const recordsOf = item => [...new Map([...(item.children || []), ...(item.relatedHistory || [])].map(record => [record.id, record])).values()];
const conciseSummary = (value = "") => String(value).replace(/\s+/g, " ").trim().split(/[；。]/)[0] || "已保留，可继续查看";
const matches = (item, query) => {
  if (!query) return true;
  const needle = query.toLocaleLowerCase();
  return [item.title, item.summary, item.contextLabel, ...(item.provenance || []).map(entry=>entry.value), ...(item.children || []).flatMap((child) => [child.title, child.summary, child.contextLabel])]
    .some((value) => String(value || "").toLocaleLowerCase().includes(needle));
};

function GroupMenu({ group, onEditGroup }) {
  const [title, setTitle] = useState(group.title || "");
  const menuRef = useRef(null);
  useEffect(() => setTitle(group.title || ""), [group.title]);
  return <details className="tco-more-menu" ref={menuRef}>
    <summary aria-label={`更多组操作：${group.title}`} title="更多"><IconDots size={ICON_SIZE.control} aria-hidden="true" /></summary>
    <form onSubmit={(event) => { event.preventDefault(); onEditGroup?.(group.id, title.trim()); menuRef.current?.removeAttribute("open"); }}>
      <label>组名称<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <button type="submit" disabled={!title.trim() || title.trim() === group.title}>保存</button>
    </form>
  </details>;
}

function ItemMenu({ item, groups, categories, onEditItem }) {
  const [groupId, setGroupId] = useState(item.groupId || "");
  const [category, setCategory] = useState(item.category || "");
  const menuRef = useRef(null);
  useEffect(() => { setGroupId(item.groupId || ""); setCategory(item.category || ""); }, [item.groupId, item.category]);
  return <details className="tco-more-menu" ref={menuRef}>
    <summary aria-label={`调整归属和用途：${item.title}`} title="更多"><IconDots size={ICON_SIZE.control} aria-hidden="true" /></summary>
    <form onSubmit={(event) => { event.preventDefault(); onEditItem?.(item.id, { groupId, category }); menuRef.current?.removeAttribute("open"); }}>
      <label>所属组<select value={groupId} onChange={(event) => setGroupId(event.target.value)}><option value="">未分组</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}</select></label>
      <label>用途<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">其他</option>{categories.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></label>
      <button type="submit" disabled={groupId === (item.groupId || "") && category === (item.category || "")}>保存</button>
    </form>
  </details>;
}

function CompareButton({ id, selectedId, onCompare }) {
  if (!onCompare) return null;
  const sameObject = id === selectedId;
  if (sameObject) return null;
  return <button className="tco-compare" type="button" disabled={!selectedId || sameObject} onClick={() => onCompare(id)} title={sameObject ? "当前内容不能与自身对照" : selectedId ? "与当前内容对照" : "先打开一项内容，再选择对照"}>
    <IconGitCompare size={ICON_SIZE.inline} aria-hidden="true" />对照
  </button>;
}

function OverviewCard({ item, categoryLabel, current, historyOpen, onToggleHistory, onOpen, groups, categories, onEditItem, selectedId, onCompare, linked, spotlight }) {
  const titleId = useId();
  const children = recordsOf(item);
  const historicalCount = children.length || Number(item.countLabel?.match(/(\d+)\s*条历史记录/)?.[1]) || 0;
  const state = item.state && typeof item.state === "object" ? item.state : null;
  const stateLabel = state ? state.label || "" : item.statusLabel || "";
  const kindLabel = item.kindLabel || (categoryLabel ? shortCategory(item.category, categoryLabel) : "");
  const applicability = item.contextLabel || item.applicability || item.applicableWhen || "";
  return <article className={`tco-card${current ? " is-current" : ""}${linked ? " is-linked" : ""}${spotlight ? " is-spotlight" : ""}`} data-map-node={item.id} aria-labelledby={titleId}>
    <div className="tco-card-main">
      <button className="tco-card-title" id={titleId} type="button" onClick={() => onOpen?.(item.id)} aria-label={`打开${item.title}`} aria-current={current ? "true" : undefined}>
        <strong title={item.title || "未命名内容"}>{item.title || "未命名内容"}</strong>
        <IconArrowUpRight size={ICON_SIZE.inline} aria-hidden="true" />
      </button>
      <div className="tco-card-identity">
        {kindLabel && <span className="tco-card-kind">{kindLabel}</span>}
        {stateLabel && <span className={`tco-status${state?.tone ? ` is-${state.tone}` : ""}`} title={state?.detail || stateLabel}>{stateLabel}</span>}
        {item.unread && <span className="tco-unread" title="有更新">有更新</span>}
        {(current || item.closed) && <span className="tco-view-state">{current ? "上次查看" : "已收起"}</span>}
      </div>
      <p className="tco-card-summary" title={item.summary || "已保留在本任务中，可继续查看。"}>{conciseSummary(item.summary || "已保留在本任务中，可继续查看。")}</p>
      {applicability && <p className="tco-card-applicability"><span>适用</span>{applicability}</p>}
      {item.provenance?.length > 0 && <dl className="tco-card-provenance">{item.provenance.map((entry,index)=><div key={entry.label+index}><dt>{entry.label}</dt><dd>{entry.recordId ? <button type="button" onClick={()=>onOpen?.(entry.recordId)}>{entry.value}</button> : entry.value}</dd></div>)}</dl>}
      {Array.isArray(item.relations) && item.relations.length > 0 && <div className="tco-card-relations" aria-label="关联内容">
        <span className="tco-relations-label">关联</span>
        {item.relations.map((relation, index) => <button key={relation.id || `${relation.label}-${index}`} type="button" onClick={() => onOpen?.(relation.id)} title={relation.title || relation.label || "查看关联内容"}>
          {relation.label || relation.title || "关联内容"}{(relation.unread || relation.isNew || relation.updated) && <i aria-label="有更新" title="有更新" />}
        </button>)}
      </div>}
      <div className="tco-card-actions">
        {historicalCount > 0 && <button className={`tco-history-toggle${historyOpen ? " is-open" : ""}`} type="button" aria-expanded={historyOpen} onClick={() => onToggleHistory(item.id)}>
          <IconHistory size={ICON_SIZE.inline} aria-hidden="true" />{historyOpen ? "收起历史" : `历史 ${historicalCount}`}
        </button>}
        <CompareButton id={item.id} selectedId={selectedId} onCompare={onCompare} />
        {onEditItem && <ItemMenu item={item} groups={groups} categories={categories} onEditItem={onEditItem} />}
      </div>
    </div>
  </article>;
}

function HistoryPanel({ item, onOpen, selectedId, onCompare }) {
  const children = recordsOf(item);
  return <section className="tco-history-panel" aria-label={`${item.title || "内容"}的历史记录`}>
    <header><div><span>历史记录</span><strong>{item.title || "未命名内容"}</strong></div><button type="button" onClick={() => onOpen?.(item.id)}>打开当前内容</button></header>
    <ol>{children.map((child, index) => <li key={child.id || `${child.title}-${index}`}>
      <div className="tco-history-entry">
        <button className="tco-history-title" type="button" onClick={() => onOpen?.(child.id)} title={`查看历史记录：${child.title || "相关记录"}`}>
          <strong>{child.title || "相关记录"}</strong><span>{child.typeLabel === child.title ? "只读" : child.typeLabel || child.kindLabel || "只读记录"}</span>
        </button>
        {child.time && <time>{child.time}</time>}
        {child.summary && <p>{child.summary}</p>}
        {(child.condition || child.contextLabel) && <p className="tco-history-condition"><span>条件</span>{child.condition || child.contextLabel}</p>}
        {child.parentId && <p className="tco-history-parent"><span>所属</span>{child.parentTitle || item.title || "当前内容"}</p>}
        <CompareButton id={child.id} selectedId={selectedId} onCompare={onCompare} />
      </div>
    </li>)}</ol>
  </section>;
}

function SummaryNode({ item, current, onOpen, linked, spotlight }) {
  const summary = summarizeContentMapItem(item);
  return <button type="button" className={`tco-summary-node${current ? " is-current" : ""}${linked ? " is-linked" : ""}${spotlight ? " is-spotlight" : ""}`} data-map-node={item.id} onClick={()=>onOpen?.(item.id)} aria-label={`打开${item.title}`} aria-current={current ? "true" : undefined}>
    <span className="tco-summary-heading"><strong>{item.title}</strong><IconArrowUpRight size={ICON_SIZE.inline} aria-hidden="true" /></span>
    <span className="tco-summary-conclusion">{conciseSummary(summary.conclusion)}</span>
    {item.provenance?.map((entry,index)=><span className="tco-summary-provenance" key={entry.label+index}>{entry.label} · {entry.value}</span>)}
    <span className="tco-summary-meta">{item.state?.label && <span className={`tco-status is-${item.state.tone || "neutral"}`}>{item.state.label}</span>}{summary.historyCount>0 && <span>{summary.historyCount} 条历史</span>}{item.unread && <span className="tco-unread">有更新</span>}</span>
  </button>;
}

// Routes stay in the spaces between cards and around the cluster, never across
// their text. These are neutral association lines, not inferred causal arrows.
function MapConnections({ gridRef, edges, highlightedId, visible, layoutKey }) {
  const [drawing,setDrawing]=useState({width:0,height:0,paths:[]});
  useEffect(()=>{
    const grid=gridRef.current;
    if(!grid || !visible)return undefined;
    let frame;
    const measure=()=>{
      const bounds=grid.getBoundingClientRect();
      if(!bounds.width || !bounds.height)return;
      const nodes=new Map([...grid.querySelectorAll('[data-map-node]')].map(node=>{
        const r=node.getBoundingClientRect();
        return [node.dataset.mapNode,{x:r.left-bounds.left,y:r.top-bounds.top,w:r.width,h:r.height}];
      }));
      const seen=new Set();
      const paths=[];
      for(const edge of edges){
        const a=nodes.get(edge.sourceId),b=nodes.get(edge.targetId);
        if(!a || !b || edge.sourceId===edge.targetId)continue;
        const pair=[edge.sourceId,edge.targetId].sort().join('\u001f');
        if(seen.has(pair))continue;
        seen.add(pair);
        const ay=a.y+a.h/2,by=b.y+b.h/2;
        let d;
        if(Math.abs(a.y-b.y)<3 && Math.abs(a.x-b.x)>3){
          const left=a.x<b.x?a:b,right=a.x<b.x?b:a;
          const sy=left.y+left.h/2,ty=right.y+right.h/2,mid=(left.x+left.w+right.x)/2;
          d=`M ${left.x+left.w} ${sy} C ${mid} ${sy}, ${mid} ${ty}, ${right.x} ${ty}`;
        }else if(Math.abs(a.x-b.x)<3){
          const right=a.x>bounds.width/2;
          const x=right?Math.max(a.x+a.w,b.x+b.w)+10:Math.min(a.x,b.x)-10;
          d=`M ${right?a.x+a.w:a.x} ${ay} H ${x} V ${by} H ${right?b.x+b.w:b.x}`;
        }else{
          const aright=a.x>b.x;
          const left=aright?b:a,right=aright?a:b;
          const middle=(left.x+left.w+right.x)/2;
          const history=grid.querySelector('.tco-history-panel')?.getBoundingClientRect();
          const crossesHistory=history && history.top-bounds.top<Math.max(ay,by) && history.bottom-bounds.top>Math.min(ay,by);
          if(!crossesHistory){
            d=`M ${aright?a.x:a.x+a.w} ${ay} H ${middle} V ${by} H ${aright?b.x+b.w:b.x}`;
          }else{
            const ax=aright?a.x+a.w:a.x,bx=aright?b.x:b.x+b.w;
            const outsideA=aright?bounds.width-6:6,outsideB=aright?6:bounds.width-6;
            const top=5+(paths.length%3)*4;
            d=`M ${ax} ${ay} H ${outsideA} V ${top} H ${outsideB} V ${by} H ${bx}`;
          }
        }
        paths.push({id:pair,d,sourceId:edge.sourceId,targetId:edge.targetId});
      }
      const next={width:bounds.width,height:bounds.height,paths};
      setDrawing(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
    };
    const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
    const observer=new ResizeObserver(schedule);observer.observe(grid);
    [...grid.querySelectorAll('[data-map-node]')].forEach(node=>observer.observe(node));
    measure();return()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[visible,edges,gridRef,layoutKey]);
  return <svg className="tco-connection-layer" width={drawing.width} height={drawing.height} viewBox={`0 0 ${drawing.width||1} ${drawing.height||1}`} aria-hidden="true">{drawing.paths.map(path=><path key={path.id} d={path.d} className={`tco-map-edge${highlightedId && [path.sourceId,path.targetId].includes(highlightedId)?" is-highlighted":""}`} />)}</svg>;
}

function ContentCluster({ group, edges, level, collapsed, onToggleGroup, onOpen, onZoomGroup, selectedId, categoryLabels, historyId, onToggleHistory, groups, categories, onEditItem, onEditGroup, onCompare, highlightedId, spotlightId, onHighlight, visible, instanceId }) {
  const gridRef=useRef(null);
  const [columns,setColumns]=useState(2);
  const historyItem=level===2?group.items.find(item=>item.id===historyId):null;
  const historyRowEnd=historyItem?Math.min(group.items.length-1,(Math.floor(group.items.indexOf(historyItem)/columns)+1)*columns-1):-1;
  const groupHeadingId=`${instanceId}-group-${encodeURIComponent(group.id)}`;
  const ids=new Set(group.items.map(item=>item.id));
  const localEdges=edges.filter(edge=>ids.has(edge.sourceId)&&ids.has(edge.targetId));
  const linkedIds=new Set(localEdges.filter(edge=>[edge.sourceId,edge.targetId].includes(highlightedId)).flatMap(edge=>[edge.sourceId,edge.targetId]));
  useLayoutEffect(()=>{
    const grid=gridRef.current;if(!grid||collapsed||!visible)return undefined;
    const measure=()=>{const count=getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;if(count)setColumns(previous=>previous===count?previous:count);};
    const observer=new ResizeObserver(measure);observer.observe(grid);measure();return()=>observer.disconnect();
  },[visible,collapsed,level]);
  return <section className={`tco-group${collapsed?" is-collapsed":""}`} data-map-group={group.id} aria-labelledby={groupHeadingId}>
    <header className="tco-group-header"><button className="tco-group-toggle" type="button" aria-expanded={!collapsed} aria-label={`${collapsed?"展开":"收起"}主题：${group.title}`} onClick={()=>onToggleGroup(group.id)}>{collapsed?<IconChevronRight size={ICON_SIZE.control}/>:<IconChevronDown size={ICON_SIZE.control}/>}</button><div className="tco-group-heading" title={group.description||group.title}><h3 id={groupHeadingId}>{group.title}</h3></div><span className="tco-group-count">{group.items.length}</span>{onEditGroup&&<GroupMenu group={group} onEditGroup={onEditGroup}/>}</header>
    {collapsed?<ul className="tco-group-outline">{group.items.map(item=><li key={item.id}><button type="button" onClick={()=>onOpen?.(item.id)} aria-label={`打开${item.title}`}><span className="tco-outline-title">{item.title}<em>{item.state?.label||item.kindLabel}</em></span></button></li>)}</ul>:<div className="tco-map-surface"><div className="tco-group-cards tco-connected-grid" ref={gridRef} onMouseLeave={()=>onHighlight(null)} onFocusCapture={event=>onHighlight(event.target.closest('[data-map-node]')?.dataset.mapNode||null)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))onHighlight(null);}}>
      <MapConnections gridRef={gridRef} edges={localEdges} highlightedId={highlightedId} visible={visible} layoutKey={`${level}:${historyId}:${columns}`}/>
      {group.items.map((item,index)=><Fragment key={item.id}><div className="tco-map-node-wrap" onMouseEnter={()=>onHighlight(item.id)}>{level===1?<SummaryNode item={item} current={selectedId===item.id||item.children?.some(child=>child.id===selectedId)} onOpen={onOpen} linked={linkedIds.has(item.id)} spotlight={spotlightId===item.id}/>:<OverviewCard item={item} categoryLabel={categoryLabels.get(item.category)} current={selectedId===item.id||item.children?.some(child=>child.id===selectedId)} historyOpen={historyId===item.id} onToggleHistory={onToggleHistory} onOpen={onOpen} groups={groups} categories={categories} onEditItem={onEditItem} selectedId={selectedId} onCompare={onCompare} linked={linkedIds.has(item.id)} spotlight={spotlightId===item.id}/>}</div>{historyItem&&index===historyRowEnd&&<HistoryPanel item={historyItem} onOpen={onOpen} selectedId={selectedId} onCompare={onCompare}/>}</Fragment>)}
    </div></div>}
  </section>;
}

function TopicNode({ group, edges, onZoomGroup, onOpen, selectedId }) {
  const uniqueHistory=new Set(group.items.flatMap(item=>recordsOf(item).map(record=>record.id)));
  const unread=group.items.filter(item=>item.unread).length;
  const important=group.items.find(item=>item.state?.tone==='warning')||group.items.find(item=>item.state?.label)||group.items[0];
  const groupEdges=edges.filter(edge=>group.items.some(item=>item.id===edge.sourceId));
  return <section className="tco-topic-node" data-map-group={group.id}>
    <button className="tco-topic-open" type="button" onClick={()=>onZoomGroup(group.id)} aria-label={`展开主题：${group.title}`}><strong>{group.title}</strong><span className="tco-topic-count">{group.items.length} 项</span><IconChevronRight size={ICON_SIZE.inline}/></button>
    <p className="tco-topic-summary">{conciseSummary(important?.summary||group.description)}</p>
    <ul className="tco-topic-items">{group.items.map(item=><li key={item.id}><button type="button" onClick={()=>onOpen?.(item.id)} aria-label={`打开${item.title}`} aria-current={selectedId===item.id||item.children?.some(child=>child.id===selectedId)?'true':undefined}><span>{item.title}</span><small>{item.unread?'有更新':item.state?.label||item.kindLabel}</small></button></li>)}</ul>
    <div className="tco-topic-stats">{uniqueHistory.size>0&&<span>{uniqueHistory.size} 条历史</span>}{groupEdges.length>0&&<span>{groupEdges.length} 条关联</span>}{unread>0&&<span className="tco-unread">{unread} 项更新</span>}</div>
  </section>;
}

const LEVEL_NAMES=['topics','summary','detail'];
const LEVEL_PERCENT=[40,70,100];
export function TaskContentOverview({ taskId, items = [], categories = [], groups = [], viewState = {}, onViewChange, onOpen, visible = true, selectedId = null, onEditGroup, onEditItem, onCompare }) {
  const rootRef=useRef(null),scrollRef=useRef(null),scrollTimerRef=useRef(null),pendingScrollRef=useRef(null);
  const onViewChangeRef=useRef(onViewChange);onViewChangeRef.current=onViewChange;
  const previousFitTickRef=useRef(viewState.fitTick),fitRequested=useRef(false),pendingAnchor=useRef(null),stableAnchor=useRef(null);
  const instanceId=useId();
  const [searchOpen,setSearchOpen]=useState(Boolean(viewState.query)||(viewState.category||'all')!=='all');
  const [highlightedId,setHighlightedId]=useState(null),[spotlightId,setSpotlightId]=useState(null);
  const query=viewState.query||'',category=viewState.category||'all',collapsedGroups=asIds(viewState.collapsedGroups);
  const level=Number.isInteger(viewState.mapLevel)?Math.max(0,Math.min(2,viewState.mapLevel)):2;
  const safeItems=Array.isArray(items)?items:[],safeGroups=Array.isArray(groups)?groups:[],safeCategories=Array.isArray(categories)?categories:[];
  const patch=value=>onViewChangeRef.current?.(value);
  const categoryLabels=useMemo(()=>new Map(safeCategories.map(entry=>[entry.id,entry.label])),[safeCategories]);
  const filteredItems=safeItems.filter(item=>(category==='all'||item.category===category)&&matches(item,query));
  const model=buildContentMap(filteredItems,safeGroups),orderedGroups=model.groups.filter(group=>group.items.length);
  const ownerById=new Map(safeItems.flatMap(item=>[[item.id,item.id],...recordsOf(item).map(record=>[record.id,record.parentId||item.id])]));
  const selectedOwner=ownerById.get(selectedId)||selectedId;
  const hasFilter=Boolean(query)||category!=='all',unreadItems=safeItems.filter(item=>item.unread);
  const layoutKey=JSON.stringify([level,query,category,viewState.historyId,collapsedGroups,safeItems.map(item=>[item.id,item.groupId,item.summary,item.state?.label,item.contextLabel,item.children?.length,item.provenance])]);
  const getAnchor=()=>{
    const viewport=scrollRef.current;if(!viewport)return null;
    const bounds=viewport.getBoundingClientRect();
    const candidates=[...viewport.querySelectorAll(level===0?'[data-map-group]':'[data-map-node]')];
    const target=candidates.find(node=>{const r=node.getBoundingClientRect();return r.bottom>bounds.top+8&&r.top<bounds.bottom;});
    if(!target)return {scrollTop:viewport.scrollTop};
    return {id:target.dataset.mapNode||null,groupId:target.closest('[data-map-group]')?.dataset.mapGroup||target.dataset.mapGroup,offset:target.getBoundingClientRect().top-bounds.top,scrollTop:viewport.scrollTop};
  };
  const restoreAnchor=anchor=>{
    const viewport=scrollRef.current;if(!viewport||!anchor)return;
    const nodes=[...viewport.querySelectorAll('[data-map-node],[data-map-group]')];
    const target=nodes.find(node=>anchor.id&&node.dataset.mapNode===anchor.id)||nodes.find(node=>node.dataset.mapGroup===anchor.groupId);
    if(target){const top=target.getBoundingClientRect().top-viewport.getBoundingClientRect().top;viewport.scrollTop+=top-(anchor.offset||0);}
    else viewport.scrollTop=anchor.scrollTop||0;
  };
  const zoomTo=(next,groupId)=>{
    pendingAnchor.current=groupId?{groupId,offset:8}:getAnchor();fitRequested.current=false;
    patch({mapLevel:Math.max(0,Math.min(2,next)),mapInitialized:true});
  };
  const fitAll=()=>{pendingAnchor.current=null;stableAnchor.current=null;fitRequested.current=true;patch({mapLevel:2,mapInitialized:true,mapFitTick:(viewState.mapFitTick||0)+1,collapsedGroups:[]});};
  const toggleGroup=id=>{pendingAnchor.current=getAnchor();patch({collapsedGroups:collapsedGroups.includes(id)?collapsedGroups.filter(value=>value!==id):[...collapsedGroups,id]});};
  const toggleHistory=id=>{pendingAnchor.current=getAnchor();patch({historyId:viewState.historyId===id?null:id});};
  const flushScroll=()=>{
    if(scrollTimerRef.current)clearTimeout(scrollTimerRef.current);scrollTimerRef.current=null;
    if(pendingScrollRef.current!==null){patch({scrollTop:pendingScrollRef.current});pendingScrollRef.current=null;}
  };
  const handleScroll=event=>{
    stableAnchor.current=getAnchor();pendingScrollRef.current=event.currentTarget.scrollTop;
    if(scrollTimerRef.current)clearTimeout(scrollTimerRef.current);scrollTimerRef.current=setTimeout(flushScroll,200);
  };
  useEffect(()=>{if(query||category!=='all')setSearchOpen(true);},[query,category]);
  useLayoutEffect(()=>{
    if(!visible||!scrollRef.current)return undefined;
    const target=Number(viewState.scrollTop)||0;
    const restore=()=>{if(!scrollRef.current)return;scrollRef.current.scrollTop=target;stableAnchor.current=getAnchor();};
    // The workspace measures its own height during mounting. Restore again
    // after those measurements so an early, too-tall viewport cannot clamp it.
    restore();let secondFrame;const frame=requestAnimationFrame(()=>{secondFrame=requestAnimationFrame(restore);});
    return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(secondFrame);};
  },[visible,taskId]);
  useEffect(()=>{if(!visible)flushScroll();},[visible]);
  useLayoutEffect(()=>{
    if(!visible||!scrollRef.current)return;
    if(previousFitTickRef.current!==viewState.fitTick){previousFitTickRef.current=viewState.fitTick;fitRequested.current=true;}
    if(!viewState.mapInitialized){fitRequested.current=true;patch({mapInitialized:true,mapLevel:2});return;}
    const viewport=scrollRef.current;
    if(fitRequested.current){
      viewport.scrollTop=0;
      if(viewport.scrollHeight>viewport.clientHeight+2&&level>0){patch({mapLevel:level-1});return;}
      fitRequested.current=false;pendingAnchor.current=null;stableAnchor.current=getAnchor();patch({scrollTop:0});
    }else{
      restoreAnchor(pendingAnchor.current||stableAnchor.current);pendingAnchor.current=null;stableAnchor.current=getAnchor();
    }
  },[visible,layoutKey,viewState.mapInitialized,viewState.mapFitTick,viewState.mapNavigationTick,viewState.fitTick]);
  useEffect(()=>{
    if(!visible||!scrollRef.current)return undefined;
    const element=scrollRef.current;
    const onWheel=event=>{if(!event.ctrlKey&&!event.metaKey)return;event.preventDefault();if(Math.abs(event.deltaY)<3)return;zoomTo(level+(event.deltaY<0?1:-1));};
    element.addEventListener('wheel',onWheel,{passive:false});return()=>element.removeEventListener('wheel',onWheel);
  },[visible,level,viewState.mapInitialized]);
  useEffect(()=>{const onPageHide=()=>flushScroll();window.addEventListener('pagehide',onPageHide);return()=>{window.removeEventListener('pagehide',onPageHide);flushScroll();};},[]);
  useEffect(()=>{if(!spotlightId)return undefined;const timer=setTimeout(()=>setSpotlightId(null),1600);return()=>clearTimeout(timer);},[spotlightId]);
  const locateUpdate=()=>{
    const item=unreadItems[0];if(!item)return;
    pendingAnchor.current={id:item.id,groupId:item.groupId,offset:16};setSpotlightId(item.id);fitRequested.current=false;
    patch({query:"",category:"all",mapLevel:Math.max(1,level),mapInitialized:true,mapNavigationTick:(viewState.mapNavigationTick||0)+1,collapsedGroups:collapsedGroups.filter(id=>id!==item.groupId)});
  };
  return <section className="tco-root" ref={rootRef} data-task-id={taskId||undefined} data-map-level={LEVEL_NAMES[level]} hidden={!visible} aria-label="任务内容总览">
    <header className="tco-toolbar"><div className="tco-overview-count"><strong>{safeItems.length}</strong><span>项内容</span>{unreadItems.length>0&&<button type="button" className="tco-update-locator" onClick={locateUpdate}>{unreadItems.length} 项更新</button>}</div><div className="tco-toolbar-actions">
      <div className="tco-zoom-tools" role="group" aria-label="总览缩放"><button type="button" aria-label="缩小总览，显示更简洁的信息" title="缩小：内容 → 摘要 → 主题" disabled={level===0} onClick={()=>zoomTo(level-1)}><IconMinus size={ICON_SIZE.inline}/></button><span className="tco-zoom-value" title={`缩放 ${LEVEL_PERCENT[level]}%，${['主题概览','内容摘要','内容详情'][level]}`}>{LEVEL_PERCENT[level]}%</span><button type="button" aria-label="放大总览，显示更多内容细节" title="放大" disabled={level===2} onClick={()=>zoomTo(level+1)}><IconPlus size={ICON_SIZE.inline}/></button><button type="button" className="tco-zoom-fit" aria-label={hasFilter?'适应筛选结果':'适应全部内容'} title={hasFilter?'适应筛选结果':'适应全部内容'} onClick={fitAll}><CanvasFitIcon size={ICON_SIZE.inline}/></button></div>
      <button className={`tco-search-toggle${searchOpen?' is-open':''}`} type="button" aria-expanded={searchOpen} aria-label="查找内容" onClick={()=>setSearchOpen(open=>!open)}><IconSearch size={ICON_SIZE.inline}/><span className="tco-search-label">查找</span></button>
    </div></header>
    {searchOpen&&<div className="tco-search-panel"><label className="tco-search"><IconSearch size={ICON_SIZE.inline}/><span className="tco-sr-only">搜索内容及相关记录</span><input value={query} onChange={event=>{pendingAnchor.current=null;stableAnchor.current=null;patch({query:event.target.value,scrollTop:0});}} placeholder="搜索标题、条件或历史记录"/></label>{safeCategories.length>0&&<div className="tco-categories" aria-label="按用途筛选"><button type="button" className={category==='all'?'is-selected':''} aria-pressed={category==='all'} onClick={()=>patch({category:'all'})}>全部</button>{safeCategories.map(entry=><button type="button" key={entry.id} className={category===entry.id?'is-selected':''} aria-pressed={category===entry.id} onClick={()=>patch({category:entry.id})}>{entry.label}</button>)}</div>}{hasFilter&&<button className="tco-clear-filters" type="button" onClick={()=>patch({query:'',category:'all'})}>清除搜索与筛选</button>}</div>}
    {safeItems.length===0?<div className="tco-empty"><strong>本任务尚无内容</strong><p>使用或产生的内容会保留在对应主题中。</p></div>:filteredItems.length===0?<div className="tco-empty"><strong>没有匹配的内容</strong><p>调整关键词或用途，继续查找本任务的内容。</p><button type="button" onClick={()=>patch({query:'',category:'all'})}>清除搜索与筛选</button></div>:<div className="tco-scroll" ref={scrollRef} onScroll={handleScroll}><div className={`tco-map${level===0?' tco-topic-map':''}`}>
      {level===0?orderedGroups.map(group=><TopicNode key={group.id} group={group} edges={model.edges} onZoomGroup={groupId=>zoomTo(1,groupId)} onOpen={onOpen} selectedId={selectedId}/>):orderedGroups.map(group=><ContentCluster key={group.id} group={group} edges={model.edges} level={level} collapsed={collapsedGroups.includes(group.id)} onToggleGroup={toggleGroup} onOpen={onOpen} onZoomGroup={groupId=>zoomTo(1,groupId)} selectedId={selectedOwner} categoryLabels={categoryLabels} historyId={viewState.historyId} onToggleHistory={toggleHistory} groups={safeGroups} categories={safeCategories} onEditItem={onEditItem} onEditGroup={onEditGroup} onCompare={onCompare} highlightedId={highlightedId||selectedOwner} spotlightId={spotlightId} onHighlight={setHighlightedId} visible={visible} instanceId={instanceId}/>)}
      {level>0&&model.edges.some(edge=>safeItems.find(item=>item.id===edge.sourceId)?.groupId!==safeItems.find(item=>item.id===edge.targetId)?.groupId)&&<div className="tco-cross-relations" aria-label="跨主题关联">{model.edges.filter(edge=>safeItems.find(item=>item.id===edge.sourceId)?.groupId!==safeItems.find(item=>item.id===edge.targetId)?.groupId).map(edge=><button type="button" key={edge.id} onClick={()=>onOpen?.(edge.targetRecordId)}>{safeItems.find(item=>item.id===edge.sourceId)?.title} · {edge.label} → {safeItems.find(item=>item.id===edge.targetId)?.title}</button>)}</div>}
    </div></div>}
    <footer className="tco-map-status"><span>{['主题概览 · 点主题展开，点内容直接查看','内容摘要 · 保留结论、状态与来源','内容详情 · 查看条件、关联与历史'][level]}</span>{level>0&&model.edges.length>0&&<span className="tco-relation-legend">连线表示已记录的关联</span>}</footer>
  </section>;
}

export default TaskContentOverview;
