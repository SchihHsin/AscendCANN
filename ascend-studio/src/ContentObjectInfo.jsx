import { ICON_SIZE } from "./icon-system.js";
import { useLayoutEffect, useRef } from "react";
import { IconArrowRight, IconHistory, IconLayoutColumns, IconLink, IconX } from "@tabler/icons-react";

/** The same identity, context and history controls are used for every viewer. */
export function ContentObjectInfo({ item, history, onClose, onOpen, onCompare, selectedId }) {
  const heading = useRef(null);
  useLayoutEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  const relations = item?.relations || [];
  const records = [...new Map([...(item?.children || []), ...(item?.relatedHistory || [])].map(record => [record.id, record])).values()].reverse();
  return <section className="tw-object-sheet" aria-label="内容信息与历史">
    <header><div><span>{history ? "只读历史" : item?.kindLabel || "内容信息"}</span><h3 tabIndex={-1} ref={heading}>{history?.title || item?.title || "当前内容"}</h3></div><button type="button" aria-label="关闭内容信息与历史" onClick={onClose}><IconX size={ICON_SIZE.control} /></button></header>
    <div className="tw-object-sheet-body">
      {history ? <div className="tw-object-context"><strong>记录于 {history.time || "当时"}</strong><p>{history.summary}</p><button type="button" className="tw-object-link" onClick={() => onOpen(item.id)}>回到当前内容<IconArrowRight size={ICON_SIZE.inline} /></button></div> : <div className="tw-object-context">
        {item?.state?.label && <span className={`tw-object-status tone-${item.state.tone || "neutral"}`}>{item.state.label}</span>}
        {item?.contextLabel && <p className="tw-object-condition">{item.contextLabel}</p>}
        <p>{item?.state?.detail || item?.summary || "查看与切换不会运行任务。"}</p>
      </div>}
      {!history && relations.length > 0 && <section className="tw-object-section"><h4><IconLink size={ICON_SIZE.inline} />关联内容</h4><ul>{relations.map(relation => <li key={`${relation.id}:${relation.label}`}><button type="button" className="tw-object-row" onClick={() => onOpen(relation.id)}><span><small>{relation.label}</small><strong>{relation.title}</strong></span><IconArrowRight size={ICON_SIZE.inline} /></button></li>)}</ul></section>}
      <section className="tw-object-section"><h4><IconHistory size={ICON_SIZE.inline} />历史记录 <span>{records.length}</span></h4>{records.length ? <ul>{records.map(record => <li key={record.id} className={record.id === selectedId ? "is-current" : ""}>
        <button type="button" className="tw-object-row" onClick={() => onOpen(record.id)} aria-current={record.id === selectedId ? "true" : undefined}><span><small>{record.time || "历史"} · 只读记录</small><strong>{record.title}</strong><p>{record.contextLabel || record.summary}</p></span><IconArrowRight size={ICON_SIZE.inline} /></button>
        {onCompare && record.id !== selectedId && <button className="tw-object-compare" type="button" aria-label={`将${record.title}（${record.time || "历史"}）与当前内容对照`} onClick={() => onCompare(record.id)}><IconLayoutColumns size={ICON_SIZE.inline} />对照</button>}
      </li>)}</ul> : <p className="tw-object-no-history">尚无历史记录；查看内容不会新建记录。</p>}</section>
    </div>
  </section>;
}
