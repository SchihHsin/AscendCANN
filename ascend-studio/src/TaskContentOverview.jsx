import { useId, useMemo, useRef } from "react";
import {
  IconArrowUpRight,
  IconChevronDown,
  IconChevronRight,
  IconLayoutGrid,
  IconListDetails,
  IconSearch,
  IconTargetArrow,
} from "@tabler/icons-react";
import "./task-content-overview.css";

const asIds = (value) => Array.isArray(value) ? value : [];
const matches = (item, query) => {
  if (!query) return true;
  const needle = query.toLocaleLowerCase();
  return [item.title, item.summary, ...(item.children || []).flatMap((child) => [child.title, child.summary])]
    .some((value) => String(value || "").toLocaleLowerCase().includes(needle));
};

function OverviewCard({ item, categoryLabel, compact, current, historyOpen, onCloseHistory, renderPreview, onOpen, onArrange, onToggleCompact }) {
  const titleId = useId();
  const preview = !compact ? renderPreview?.(item.id) : null;
  const children = Array.isArray(item.children) ? item.children : [];
  return <article className={`tco-card${compact ? " is-compact" : ""}${current ? " is-current" : ""}`} aria-labelledby={titleId}>
    <div className="tco-card-main">
      <button className="tco-card-title" id={titleId} type="button" onClick={() => onOpen?.(item.id)} aria-label={`打开${item.title}`}>
        <span className="tco-card-type">{categoryLabel || "其他"}</span>
        <strong>{item.title || "未命名内容"}</strong>
        <IconArrowUpRight size={14} aria-hidden="true" />
      </button>
      <div className="tco-card-summary-row">
        <p className="tco-card-summary">{item.summary || "已保留在本任务中，可继续查看。"}</p>
        <div className="tco-card-meta">
          {item.statusLabel && <span className="tco-status">{item.statusLabel}</span>}
          {item.countLabel && <span>{item.countLabel}</span>}
          {item.unread && <span className="tco-unread">有更新</span>}
          {item.closed && <span>已收起</span>}
        </div>
      </div>
      {!compact && preview && <div className="tco-preview">{preview}</div>}
      {children.length > 0 && <details className="tco-children" open={historyOpen || undefined} onToggle={event => { if (historyOpen && !event.currentTarget.open) onCloseHistory?.(); }}>
        <summary><IconListDetails size={13} />相关记录 <span>{children.length}</span></summary>
        <ul>{children.map((child, index) => <li key={child.id || `${child.title}-${index}`}>
          <button type="button" onClick={() => onOpen?.(child.id)} aria-label={`打开记录：${child.title}`}>
            <span><strong>{child.title || "相关记录"}</strong>{child.summary && <small>{child.summary}</small>}</span>
            {child.time && <time>{child.time}</time>}
          </button>
        </li>)}</ul>
      </details>}
      <div className="tco-card-actions">
        {!compact && <>
          <button className="tco-primary" type="button" onClick={() => onOpen?.(item.id)} aria-label={`展开操作：${item.title}`}>展开操作</button>
          <button className="tco-text-action" type="button" onClick={() => onArrange?.([item.id])} aria-label={`在画布中定位：${item.title}`}><IconTargetArrow size={13} />在画布中定位</button>
        </>}
        <button className="tco-text-action tco-compact-toggle" type="button" onClick={() => onToggleCompact(item.id)} aria-label={compact ? `展开${item.title}概要` : `收起${item.title}为概要`}>
          {compact ? <IconChevronDown size={13} /> : <IconChevronRight size={13} />}{compact ? "展开概要" : "收起为概要"}
        </button>
      </div>
    </div>
  </article>;
}

export function TaskContentOverview({ taskId, items = [], categories = [], groups = [], viewState = {}, onViewChange, onOpen, onArrange, renderPreview, visible = true, selectedId = null }) {
  const scrollRef = useRef(null);
  const instanceId = useId();
  const query = viewState.query || "";
  const category = viewState.category || "all";
  const collapsedGroups = asIds(viewState.collapsedGroups);
  const compactIds = asIds(viewState.compactIds);
  const safeItems = Array.isArray(items) ? items : [];
  const safeGroups = Array.isArray(groups) ? groups : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const categoryLabels = useMemo(() => new Map(safeCategories.map((entry) => [entry.id, entry.label])), [safeCategories]);

  const filteredItems = useMemo(() => safeItems.filter((item) =>
    (category === "all" || item.category === category) && matches(item, query)
  ), [safeItems, category, query]);
  const categoryCounts = useMemo(() => {
    const counts = new Map();
    safeItems.forEach((item) => counts.set(item.category, (counts.get(item.category) || 0) + 1));
    return counts;
  }, [safeItems]);
  const orderedGroups = useMemo(() => {
    const result = safeGroups.map((group) => ({ ...group, items: filteredItems.filter((item) => item.groupId === group.id) }))
      .filter((group) => group.items.length > 0);
    const assigned = new Set(safeGroups.map((group) => group.id));
    const unassigned = filteredItems.filter((item) => !assigned.has(item.groupId));
    if (unassigned.length) result.push({ id: "__other__", title: "其他内容", description: "尚未归入主题区的本任务内容。", items: unassigned });
    return result;
  }, [safeGroups, filteredItems]);

  const patch = (value) => onViewChange?.(value);
  const toggleId = (key, id) => {
    const current = asIds(viewState[key]);
    patch({ [key]: current.includes(id) ? current.filter((value) => value !== id) : [...current, id] });
  };
  const showAll = () => patch({ query: "", category: "all", collapsedGroups: [] });
  const hasFilter = Boolean(query) || category !== "all";
  const collapsedCount = compactIds.filter((id) => safeItems.some((item) => item.id === id)).length;

  return <section className="tco-root" data-task-id={taskId || undefined} hidden={!visible} aria-label="任务内容分组总览">
    <header className="tco-toolbar">
      <div className="tco-overview-count"><IconLayoutGrid size={15} aria-hidden="true" /><strong>{safeItems.length}</strong><span>项内容</span><i aria-hidden="true" />{collapsedCount > 0 && <span>已收起 {collapsedCount} 项</span>}</div>
      <button className="tco-fit-summary" type="button" onClick={() => { patch({ compactIds: safeItems.map(item => item.id), collapsedGroups: safeGroups.map(group => group.id) }); scrollRef.current?.scrollTo({ top: 0 }); }}>概要总览</button>
      <label className="tco-search"><IconSearch size={14} aria-hidden="true" /><span className="tco-sr-only">搜索内容及相关记录</span><input value={query} onChange={(event) => patch({ query: event.target.value })} placeholder="搜索内容或相关记录" /></label>
    </header>
    <nav className="tco-categories" aria-label="按内容用途筛选">
      <button type="button" className={category === "all" ? "is-selected" : ""} aria-pressed={category === "all"} onClick={() => patch({ category: "all" })}>全部 <span>{safeItems.length}</span></button>
      {safeCategories.map((entry) => <button type="button" key={entry.id} className={category === entry.id ? "is-selected" : ""} aria-pressed={category === entry.id} onClick={() => patch({ category: entry.id })}>{entry.label} <span>{categoryCounts.get(entry.id) || 0}</span></button>)}
      {hasFilter && <button className="tco-show-all" type="button" onClick={showAll}>显示全部</button>}
    </nav>
    {safeItems.length === 0 ? <div className="tco-empty"><strong>本任务尚无内容</strong><p>使用或产生的内容会按主题显示在这里。</p></div> : filteredItems.length === 0 ? <div className="tco-empty"><strong>没有匹配的内容</strong><p>试试其他关键词或用途筛选。</p><button type="button" onClick={showAll}>清除筛选</button></div> : <div className="tco-scroll" ref={scrollRef}>
      <div className="tco-map">
        {orderedGroups.map((group) => {
          const isCollapsed = collapsedGroups.includes(group.id);
          const groupHeadingId = `${instanceId}-group-${String(group.id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
          return <section className={`tco-group${isCollapsed ? " is-collapsed" : ""}`} key={group.id} aria-labelledby={groupHeadingId}>
            <header className="tco-group-header">
              <button className="tco-group-toggle" type="button" aria-expanded={!isCollapsed} aria-label={`${isCollapsed ? "展开" : "收起"}主题：${group.title}`} onClick={() => toggleId("collapsedGroups", group.id)}>
                {isCollapsed ? <IconChevronRight size={15} /> : <IconChevronDown size={15} />}
              </button>
              <div className="tco-group-heading"><h3 id={groupHeadingId}>{group.title}</h3>{group.description && <p>{group.description}</p>}</div>
              <span className="tco-group-count">{group.items.length}</span>
            </header>
            {isCollapsed ? <ul className="tco-group-outline">{group.items.map((item) => <li key={item.id}><button type="button" onClick={() => onOpen?.(item.id)} aria-label={`打开${item.title}`} aria-current={selectedId === item.id ? "true" : undefined}><span className="tco-outline-title">{item.title}{(item.children?.length || item.countLabel) && <em>{item.children?.length ? `${item.children.length} 条历史` : item.countLabel.split(" · ")[0]}</em>}</span><small>{item.summary || categoryLabels.get(item.category) || "本任务内容"}</small></button></li>)}</ul> : <div className="tco-group-cards">{group.items.map((item) => <OverviewCard key={item.id} item={item} categoryLabel={categoryLabels.get(item.category)} compact={compactIds.includes(item.id)} current={selectedId === item.id} historyOpen={viewState.historyId === item.id} onCloseHistory={() => patch({ historyId: null })} renderPreview={renderPreview} onOpen={onOpen} onArrange={onArrange} onToggleCompact={(id) => toggleId("compactIds", id)} />)}</div>}
          </section>;
        })}
      </div>
    </div>}
  </section>;
}

export default TaskContentOverview;
