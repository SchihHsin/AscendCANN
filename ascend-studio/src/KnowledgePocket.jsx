import { IconBookmark, IconCheck, IconClock, IconExternalLink, IconTrash, IconDeviceMobileMessage } from "@tabler/icons-react";
import "./knowledge-pocket.css";

const statusCopy = {
  saved: ["待安排", "neutral"],
  scheduled: ["已加入定期速览", "scheduled"],
  sent: ["已送到微信", "sent"],
  read: ["已在手机打开", "sent"],
  understood: ["已理解", "understood"],
};

export function KnowledgePocketPage({ items = [], selectedId, onSelect, onSendNow, onSchedule, onSignal, onRemove }) {
  const ordered = [...items].sort((a, b) => b.createdAt - a.createdAt);
  const selected = ordered.find(item => item.id === selectedId) || ordered[0] || null;
  const scheduledCount = ordered.filter(item => item.status === "scheduled").length;
  const deliveredCount = ordered.filter(item => ["sent", "read", "understood"].includes(item.status)).length;

  return <section className="management-page knowledge-pocket-page" aria-labelledby="knowledge-pocket-title">
    <header className="management-page-header">
      <div className="management-page-title">
        <span className="management-page-eyebrow">跨设备学习 · 我的收藏</span>
        <h1 id="knowledge-pocket-title">知识口袋</h1>
        <p>先把有用的回答和知识点收好，再决定何时在微信里继续看。</p>
      </div>
      <div className="management-page-summary" aria-label={`${ordered.length} 条知识，${scheduledCount} 条已加入速览`}>
        <strong>{ordered.length}</strong><span>条知识</span><i /><strong>{scheduledCount}</strong><span>条已排入速览</span>
      </div>
    </header>
    <main className="management-page-content pocket-content">
      {!ordered.length ? <div className="pocket-empty">
        <span className="pocket-empty-icon"><IconBookmark size={20} /></span>
        <h2>把想继续看的，先收进口袋</h2>
        <p>在 Agent 回答下方，或当前学习节点里选择「收进知识口袋」。收好后，再从这里安排微信送达。</p>
      </div> : <>
        <div className="pocket-list" role="listbox" aria-label="知识口袋内容" aria-activedescendant={selected ? `pocket-item-${selected.id}` : undefined}>
          {ordered.map(item => {
            const [label, tone] = statusCopy[item.status] || statusCopy.saved;
            const active = item.id === selected?.id;
            return <article className={`pocket-item${active ? " is-selected" : ""}`} role="option" aria-selected={active} key={item.id} id={`pocket-item-${item.id}`}>
              <button type="button" className="pocket-item-select" onClick={() => onSelect(item.id)} aria-pressed={active}>
                <span className="pocket-item-icon"><IconBookmark size={16} /></span>
                <span className="pocket-item-copy"><strong>{item.title}</strong><span>{item.summary}</span><small>{item.sourceLabel} · {item.sourceType}</small></span>
                <span className={`pocket-status is-${tone}`}>{label}</span>
              </button>
              <button type="button" className="pocket-item-remove" aria-label={`从知识口袋移除：${item.title}`} title="移除" onClick={() => onRemove(item.id)}><IconTrash size={15} /></button>
            </article>;
          })}
        </div>
        {selected && <section className="pocket-delivery" aria-labelledby="pocket-delivery-title">
          <div className="pocket-delivery-copy">
            <span className="pocket-delivery-kicker">当前选中</span>
            <h2 id="pocket-delivery-title">{selected.title}</h2>
            <p>{selected.summary || "把这一条发到微信立即阅读，或放进之后的定期速览。"}</p>
            <div className="pocket-signal" role="group" aria-label="这条内容对我的意义">
              <span>这条内容</span>
              <button type="button" className={selected.signal === "interested" ? "is-active" : ""} onClick={() => onSignal(selected, "interested")} aria-pressed={selected.signal === "interested"}>感兴趣</button>
              <button type="button" className={selected.signal === "question" ? "is-active" : ""} onClick={() => onSignal(selected, "question")} aria-pressed={selected.signal === "question"}>还没弄懂</button>
            </div>
          </div>
          <div className="pocket-delivery-actions">
            <button type="button" className="pocket-schedule-button" onClick={() => onSchedule(selected)} aria-pressed={selected.status === "scheduled"}>
              {selected.status === "scheduled" ? <IconCheck size={15} /> : <IconClock size={15} />}
              {selected.status === "scheduled" ? "已加入定期速览" : "加入定期速览"}
            </button>
            <button type="button" className="pocket-send-button" onClick={() => onSendNow(selected)}>
              <IconDeviceMobileMessage size={16} />发到微信，现在看<IconExternalLink size={14} />
            </button>
          </div>
        </section>}
      <p className="pocket-footer-note">{deliveredCount ? `${deliveredCount} 条已送达手机；手机端的阅读状态会回到口袋。` : "现在看会在微信消息列表样机中生成一条通知；定期速览会优先带上已安排的内容。"}</p>
      </>}
    </main>
  </section>;
}
