import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  IconArrowUpRight,
  IconChevronDown,
  IconChevronRight,
  IconDots,
  IconListDetails,
  IconSearch,
} from "@tabler/icons-react";
import "./task-content-overview.css";

const asIds = (value) => Array.isArray(value) ? value : [];
const shortCategory = (id, label) => ({ explain: "解释", experiment: "试改", check: "检查", change: "修改", reference: "来源" }[id] || label || "其他");
const shortStatus = (value = "") => {
  if (/已应用/.test(value)) return "已应用";
  if (/取消/.test(value)) return "已取消";
  if (/暂不可用/.test(value)) return "不可用";
  if (/演算|算例/.test(value)) return "算例";
  if (/形状检查/.test(value)) return "形状检查";
  if (/提案|修改预览|未改真实项目/.test(value)) return "提案";
  if (/范围复核|形状复核/.test(value)) return "已复核";
  if (/误差|精度/.test(value)) return "误差核对";
  if (/复核记录/.test(value)) return "已记录";
  if (/本地计算/.test(value)) return "本地计算";
  return value ? "已访问" : "";
};
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

function OverviewCard({ item, categoryLabel, current, historyOpen, onCloseHistory, onOpen, groups, categories, onEditItem }) {
  const titleId = useId();
  const children = Array.isArray(item.children) ? item.children : [];
  const historicalCount = children.length || Number(item.countLabel?.match(/(\d+)\s*条历史记录/)?.[1]) || 0;
  return <article className={`tco-card${current ? " is-current" : ""}`} aria-labelledby={titleId}>
    <div className="tco-card-main">
      <button className="tco-card-title" id={titleId} type="button" onClick={() => onOpen?.(item.id)} aria-label={`打开${item.title}`} aria-current={current ? "true" : undefined}>
        <strong title={item.title || "未命名内容"}>{item.title || "未命名内容"}</strong>
        <IconArrowUpRight size={14} aria-hidden="true" />
      </button>
      <p className="tco-card-summary" title={item.summary || "已保留在本任务中，可继续查看。"}>{conciseSummary(item.summary || "已保留在本任务中，可继续查看。")}</p>
      <div className="tco-card-meta">
        {categoryLabel && <span className="tco-card-type" title={categoryLabel}>{shortCategory(item.category, categoryLabel)}</span>}
        {item.statusLabel && <span className="tco-status" title={item.statusLabel}>{shortStatus(item.statusLabel)}</span>}
        {historicalCount > 0 && <details className="tco-children" open={historyOpen || undefined} onToggle={event => { if (historyOpen && !event.currentTarget.open) onCloseHistory?.(); }}>
          <summary title="查看历史时间、条件和记录"><IconListDetails size={13} aria-hidden="true" />历史 {historicalCount}</summary>
          <ul>{children.map((child, index) => <li key={child.id || `${child.title}-${index}`}>
            <button type="button" onClick={() => onOpen?.(child.id)} aria-label={`打开记录：${child.title}`}>
              <span><strong>{child.title || "相关记录"}</strong>{child.summary && <small>{child.summary}</small>}</span>
              {child.time && <time>{child.time}</time>}
            </button>
          </li>)}</ul>
        </details>}
        {item.unread && <span className="tco-unread" title="有更新">更新</span>}
        {onEditItem && <ItemMenu item={item} groups={groups} categories={categories} onEditItem={onEditItem} />}
      </div>
    </div>
  </article>;
}

export function TaskContentOverview({ taskId, items = [], categories = [], groups = [], viewState = {}, onViewChange, onOpen, onArrange, renderPreview, visible = true, selectedId = null, onEditGroup, onEditItem }) {
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

  const filteredItems = useMemo(() => safeItems.filter((item) =>
    (category === "all" || item.category === category) && matches(item, query)
  ).sort((a, b) => {
    if (!query) return 0;
    return (Number(b.lastAccessAt) || Date.parse(b.lastAccessAt || "") || 0) - (Number(a.lastAccessAt) || Date.parse(a.lastAccessAt || "") || 0);
  }), [safeItems, category, query]);
  const orderedGroups = useMemo(() => {
    const result = safeGroups.map((group) => ({ ...group, items: filteredItems.filter((item) => item.groupId === group.id) }))
      .filter((group) => group.items.length > 0);
    const assigned = new Set(safeGroups.map((group) => group.id));
    const unassigned = filteredItems.filter((item) => !assigned.has(item.groupId));
    if (unassigned.length) result.push({ id: "__other__", title: "其他内容", description: "尚未归入主题区的本任务内容。", items: unassigned });
    return result;
  }, [safeGroups, filteredItems]);

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

  return <section className="tco-root" data-task-id={taskId || undefined} hidden={!visible} aria-label="任务内容总览">
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
            {isCollapsed ? <ul className="tco-group-outline">{group.items.map((item) => <li key={item.id}><button type="button" onClick={() => onOpen?.(item.id)} aria-label={`打开${item.title}`} aria-current={selectedId === item.id ? "true" : undefined}><span className="tco-outline-title">{item.title || "未命名内容"}<em>{categoryLabels.get(item.category) || "内容"}</em></span><small>{item.summary || "已保留在本任务中，可继续查看。"}</small></button></li>)}</ul> : <div className="tco-group-cards">{group.items.map((item) => <OverviewCard key={item.id} item={item} categoryLabel={categoryLabels.get(item.category)} current={selectedId === item.id} historyOpen={viewState.historyId === item.id} onCloseHistory={() => patch({ historyId: null })} onOpen={onOpen} groups={safeGroups} categories={safeCategories} onEditItem={onEditItem} />)}</div>}
          </section>;
        })}
      </div>
    </div>}
  </section>;
}

export default TaskContentOverview;
