import { IconArchive, IconArrowBackUp, IconArrowRight, IconFileText, IconPin, IconX } from "@tabler/icons-react";
import "./canvas-index.css";

export function CanvasIndex({ canvas, flow, records, onClose, onLocate, onOpenRecord }) {
  const available = (id) => id === "attempts" || id === "diff" ? flow.state.attempts.length > 0 : id === "validation" ? Boolean(flow.state.appliedCode) : true;
  return <section className="cidx" aria-label="画布内容索引">
    <header><div><h3>本任务内容</h3><span>定位内容，或恢复原来的摆放</span></div><button type="button" aria-label="关闭画布内容索引" onClick={onClose}><IconX size={15}/></button></header>
    <div className="cidx-scroll">
      <h4>画布内容</h4>
      <div className="cidx-list">{canvas.state.cards.filter(card => !card.id.startsWith("record:")).map(card => <div className={"cidx-row" + (card.id === canvas.state.selectedCardId ? " is-selected" : "")} key={card.id}>
        <button type="button" className="cidx-locate" aria-label={"定位" + card.title} disabled={!available(card.id)} onClick={() => onLocate(card.id)}><IconFileText size={15}/><span><strong>{card.title}</strong><small>{card.visible ? card.collapsed ? "已折叠" : "画布中" : card.opened ? "已收纳" : "待展开"}{card.pinned && " · 已固定"}</small></span><IconArrowRight size={13}/></button>
        {card.visible && <button className="cidx-archive" type="button" aria-label={"收纳" + card.title} onClick={() => canvas.actions.hideCard(card.id)}><IconArchive size={13}/></button>}
      </div>)}</div>
      {canvas.state.lastHiddenId && <button className="cidx-undo" type="button" onClick={() => canvas.actions.restore()}><IconArrowBackUp size={14}/>撤销最近收纳</button>}
      <h4>核对记录 <span>{records.length}</span></h4>
      {records.length ? <div className="cidx-list">{records.map(record => <button className="cidx-record" type="button" key={record.id} onClick={() => onOpenRecord(record)}><IconFileText size={15}/><span><strong>{record.title}</strong><small>{record.time} · {record.isDemo ? "示例记录" : "待验证"}</small></span><IconArrowRight size={13}/></button>)}</div> : <p className="cidx-empty">完成核对后，记录会保留在当前任务。</p>}
    </div>
    <footer>收纳保留位置和内容，恢复同一份材料。</footer>
  </section>;
}
