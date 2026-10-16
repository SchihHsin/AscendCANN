import { Fragment, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  IconArrowUpRight,
  IconChevronDown,
  IconChevronRight,
  IconDots,
  IconHistory,
  IconSearch,
  IconGitCompare,
} from "@tabler/icons-react";
import "./task-content-overview.css";

const asIds = (value) => Array.isArray(value) ? value : [];
const shortCategory = (id, label) => ({ explain: "解释", experiment: "试改", check: "检查", change: "修改", reference: "来源" }[id] || label || "其他");
const recordsOf = item => [...new Map([...(item.children || []), ...(item.relatedHistory || [])].map(record => [record.id, record])).values()];
const conciseSummary = (value = "") => String(value).replace(/\s+/g, " ").trim().split(/[；。]/)[0] || "已保留，可继续查看";
const matches = (item, query) => {
  if (!query) return true;
  const needle = query.toLocaleLowerCase();
  return [item.title, item.summary, ...(item.children || []).flatMap((child) => [child.title, child.summary])]
    .some((value) => String(value || "").toLocaleLowerCase().includes(needle));
};

function GroupMenu({ group, onEditGroup }) {
  const [title, setTitle] = useState(group.title || "");
  const menuRef = useRef(null);
  useEffect(() => setTitle(group.title || ""), [group.title]);
  return <details className="tco-more-menu" ref={menuRef}>
    <summary aria-label={`更多组操作：${group.title}`} title="更多"><IconDots size={16} aria-hidden="true" /></summary>
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
    <summary aria-label={`调整归属和用途：${item.title}`} title="更多"><IconDots size={16} aria-hidden="true" /></summary>
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
    <IconGitCompare size={13} aria-hidden="true" />对照
  </button>;
}

function OverviewCard({ item, categoryLabel, current, historyOpen, onToggleHistory, onOpen, groups, categories, onEditItem, selectedId, onCompare }) {
  const titleId = useId();
  const children = recordsOf(item);
  const historicalCount = children.length || Number(item.countLabel?.match(/(\d+)\s*条历史记录/)?.[1]) || 0;
  const state = item.state && typeof item.state === "object" ? item.state : null;
  const stateLabel = state ? state.label || "" : item.statusLabel || "";
  const kindLabel = item.kindLabel || (categoryLabel ? shortCategory(item.category, categoryLabel) : "");
  const applicability = item.contextLabel || item.applicability || item.applicableWhen || "";
  return <article className={`tco-card${current ? " is-current" : ""}`} aria-labelledby={titleId}>
    <div className="tco-card-main">
      <button className="tco-card-title" id={titleId} type="button" onClick={() => onOpen?.(item.id)} aria-label={`打开${item.title}`} aria-current={current ? "true" : undefined}>
        <strong title={item.title || "未命名内容"}>{item.title || "未命名内容"}</strong>
        <IconArrowUpRight size={14} aria-hidden="true" />
      </button>
      <div className="tco-card-identity">
        {kindLabel && <span className="tco-card-kind">{kindLabel}</span>}
        {stateLabel && <span className={`tco-status${state?.tone ? ` is-${state.tone}` : ""}`} title={state?.detail || stateLabel}>{stateLabel}</span>}
        {item.unread && <span className="tco-unread" title="有更新">有更新</span>}
        {(current || item.closed) && <span className="tco-view-state">{current ? "上次查看" : "已收起"}</span>}
      </div>
      <p className="tco-card-summary" title={item.summary || "已保留在本任务中，可继续查看。"}>{conciseSummary(item.summary || "已保留在本任务中，可继续查看。")}</p>
      {applicability && <p className="tco-card-applicability"><span>适用</span>{applicability}</p>}
      {Array.isArray(item.relations) && item.relations.length > 0 && <div className="tco-card-relations" aria-label="关联内容">
        <span className="tco-relations-label">关联</span>
        {item.relations.map((relation, index) => <button key={relation.id || `${relation.label}-${index}`} type="button" onClick={() => onOpen?.(relation.id)} title={relation.title || relation.label || "查看关联内容"}>
          {relation.label || relation.title || "关联内容"}{(relation.unread || relation.isNew || relation.updated) && <i aria-label="有更新" title="有更新" />}
        </button>)}
      </div>}
      <div className="tco-card-actions">
        {historicalCount > 0 && <button className={`tco-history-toggle${historyOpen ? " is-open" : ""}`} type="button" aria-expanded={historyOpen} onClick={() => onToggleHistory(item.id)}>
          <IconHistory size={13} aria-hidden="true" />{historyOpen ? "收起历史" : `历史 ${historicalCount}`}
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

export function TaskContentOverview({ taskId, items = [], categories = [], groups = [], viewState = {}, onViewChange, onOpen, onArrange, renderPreview, visible = true, selectedId = null, onEditGroup, onEditItem, onCompare }) {
  const rootRef = useRef(null);
  const [columnCount, setColumnCount] = useState(2);
  const scrollRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const pendingScrollRef = useRef(null);
  const previousFitTickRef = useRef(viewState.fitTick);
  const onViewChangeRef = useRef(onViewChange);
  onViewChangeRef.current = onViewChange;
  const instanceId = useId();
  const [searchOpen, setSearchOpen] = useState(Boolean(viewState.query) || (viewState.category || "all") !== "all");
  const query = viewState.query || "";
  const category = viewState.category || "all";
  const collapsedGroups = asIds(viewState.collapsedGroups);
  const safeItems = Array.isArray(items) ? items : [];
  const safeGroups = Array.isArray(groups) ? groups : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  useEffect(() => {
    if (query || category !== "all") setSearchOpen(true);
  }, [query, category]);
  const categoryLabels = useMemo(() => new Map(safeCategories.map((entry) => [entry.id, entry.label])), [safeCategories]);

  const filteredItems = useMemo(() => {
    const matching = safeItems.filter((item) => (category === "all" || item.category === category) && matches(item, query));
    const historyItem = safeItems.find(item => item.id === viewState.historyId);
    if (historyItem && !matching.some(item => item.id === historyItem.id)) matching.unshift(historyItem);
    return matching.sort((a, b) => {
    if (!query) return 0;
    return (Number(b.lastAccessAt) || Date.parse(b.lastAccessAt || "") || 0) - (Number(a.lastAccessAt) || Date.parse(a.lastAccessAt || "") || 0);
    });
  }, [safeItems, category, query, viewState.historyId]);
  const orderedGroups = useMemo(() => {
    const result = safeGroups.map((group) => ({ ...group, items: filteredItems.filter((item) => item.groupId === group.id) }))
      .filter((group) => group.items.length > 0);
    const assigned = new Set(safeGroups.map((group) => group.id));
    const unassigned = filteredItems.filter((item) => !assigned.has(item.groupId));
    if (unassigned.length) result.push({ id: "__other__", title: "其他内容", description: "尚未归入主题区的本任务内容。", items: unassigned });
    return result;
  }, [safeGroups, filteredItems]);

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element || !visible) return undefined;
    const measure = () => {
      const grid = element.querySelector(".tco-group-cards");
      if (!grid) return;
      const count = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
      if (count > 0) setColumnCount(previous => previous === count ? previous : count);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [visible, safeItems.length, collapsedGroups.length]);

  const patch = (value) => onViewChange?.(value);
  const toggleGroup = (id) => {
    patch({ collapsedGroups: collapsedGroups.includes(id) ? collapsedGroups.filter((value) => value !== id) : [...collapsedGroups, id] });
  };
  const showAll = () => {
    patch({ query: "", category: "all", collapsedGroups: [] });
    setSearchOpen(false);
    scrollRef.current?.scrollTo({ top: 0 });
  };
  const clearFilters = () => patch({ query: "", category: "all" });
  const toggleHistory = (id) => patch({ historyId: viewState.historyId === id ? null : id });
  const hasFilter = Boolean(query) || category !== "all";
  const collapsedCount = collapsedGroups.filter((id) => safeGroups.some((group) => group.id === id)).length;
  const flushScroll = () => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = null;
    if (pendingScrollRef.current !== null) {
      onViewChangeRef.current?.({ scrollTop: pendingScrollRef.current });
      pendingScrollRef.current = null;
    }
  };
  useLayoutEffect(() => {
    if (visible && scrollRef.current) scrollRef.current.scrollTop = Number(viewState.scrollTop) || 0;
  }, [visible, taskId]);
  useEffect(() => {
    if (previousFitTickRef.current !== viewState.fitTick) {
      previousFitTickRef.current = viewState.fitTick;
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      pendingScrollRef.current = null;
      scrollRef.current?.scrollTo({ top: 0 });
    }
  }, [viewState.fitTick]);
  useEffect(() => {
    const onPageHide = () => flushScroll();
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      flushScroll();
    };
  }, []);
  const handleScroll = (event) => {
    pendingScrollRef.current = event.currentTarget.scrollTop;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(flushScroll, 200);
  };

  return <section className="tco-root" ref={rootRef} data-task-id={taskId || undefined} hidden={!visible} aria-label="任务内容总览">
    <header className="tco-toolbar">
      <div className="tco-overview-count"><strong>{safeItems.length}</strong><span>项内容</span></div>
      <div className="tco-toolbar-actions">
        {collapsedCount > 0 && <button className="tco-show-all" type="button" onClick={showAll}>看全部</button>}
        <button className={`tco-search-toggle${searchOpen ? " is-open" : ""}`} type="button" aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)}>
          <IconSearch size={14} aria-hidden="true" />查找内容<IconChevronDown size={13} aria-hidden="true" />
        </button>
      </div>
    </header>
    {searchOpen && <div className="tco-search-panel">
      <label className="tco-search"><IconSearch size={14} aria-hidden="true" /><span className="tco-sr-only">搜索内容及相关记录</span><input value={query} onChange={(event) => patch({ query: event.target.value })} placeholder="搜索标题、摘要或历史记录" /></label>
      {safeCategories.length > 0 && <div className="tco-categories" aria-label="按用途筛选">
        <button type="button" className={category === "all" ? "is-selected" : ""} aria-pressed={category === "all"} onClick={() => patch({ category: "all" })}>全部</button>
        {safeCategories.map((entry) => <button type="button" key={entry.id} className={category === entry.id ? "is-selected" : ""} aria-pressed={category === entry.id} onClick={() => patch({ category: entry.id })}>{entry.label}</button>)}
      </div>}
      {hasFilter && <button className="tco-clear-filters" type="button" onClick={clearFilters}>清除搜索与筛选</button>}
    </div>}
    {safeItems.length === 0 ? <div className="tco-empty"><strong>本任务尚无内容</strong><p>使用或产生的内容会按主题显示在这里。</p></div> : filteredItems.length === 0 ? <div className="tco-empty"><strong>没有匹配的内容</strong><p>调整关键词或用途，继续查找本任务的内容。</p><button type="button" onClick={clearFilters}>清除搜索与筛选</button></div> : <div className="tco-scroll" ref={scrollRef} onScroll={handleScroll}>
      <div className="tco-map">
        {orderedGroups.map((group) => {
          const isCollapsed = collapsedGroups.includes(group.id);
          const historyItem = group.items.find(item => item.id === viewState.historyId);
          const historyRowEnd = historyItem ? Math.min(group.items.length - 1, (Math.floor(group.items.indexOf(historyItem) / columnCount) + 1) * columnCount - 1) : -1;
          const groupHeadingId = `${instanceId}-group-${String(group.id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
          return <section className={`tco-group${isCollapsed ? " is-collapsed" : ""}`} key={group.id} aria-labelledby={groupHeadingId}>
            <header className="tco-group-header">
              <button className="tco-group-toggle" type="button" aria-expanded={!isCollapsed} aria-label={`${isCollapsed ? "展开" : "收起"}主题：${group.title}`} onClick={() => toggleGroup(group.id)}>
                {isCollapsed ? <IconChevronRight size={15} /> : <IconChevronDown size={15} />}
              </button>
              <div className="tco-group-heading" title={group.description || group.title}><h3 id={groupHeadingId}>{group.title}</h3>{group.description && <p>{group.description}</p>}</div>
              <span className="tco-group-count">{group.items.length}</span>
              {onEditGroup && <GroupMenu group={group} onEditGroup={onEditGroup} />}
            </header>
            {isCollapsed ? <ul className="tco-group-outline">{group.items.map((item) => <li key={item.id}><button type="button" onClick={() => onOpen?.(item.id)} aria-label={`打开${item.title}`} aria-current={selectedId === item.id ? "true" : undefined}><span className="tco-outline-title">{item.title || "未命名内容"}<em>{categoryLabels.get(item.category) || "内容"}</em></span><small>{item.summary || "已保留在本任务中，可继续查看。"}</small></button></li>)}</ul> : <>
              <div className="tco-group-cards">{group.items.map((item, index) => <Fragment key={item.id}><OverviewCard item={item} categoryLabel={categoryLabels.get(item.category)} current={selectedId === item.id || item.children?.some(child => child.id === selectedId)} historyOpen={viewState.historyId === item.id} onToggleHistory={toggleHistory} onOpen={onOpen} groups={safeGroups} categories={safeCategories} onEditItem={onEditItem} selectedId={selectedId} onCompare={onCompare} />{historyItem && index === historyRowEnd && <HistoryPanel item={historyItem} onOpen={onOpen} selectedId={selectedId} onCompare={onCompare} />}</Fragment>)}</div>
            </>}
          </section>;
        })}
      </div>
    </div>}
  </section>;
}

export default TaskContentOverview;
