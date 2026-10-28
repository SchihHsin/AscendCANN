import { IconBookmark, IconCheck, IconClock, IconExternalLink, IconTrash, IconDeviceMobileMessage, IconChevronDown } from "@tabler/icons-react";
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
  const selected = selectedId === "" ? null : ordered.find(item => item.id === selectedId) || ordered[0] || null;
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
        <div className="pocket-list" aria-label="知识口袋内容">
          {ordered.map(item => {
            const [label, tone] = statusCopy[item.status] || statusCopy.saved;
            const active = item.id === selected?.id;
            const paragraphs = String(item.content || item.summary || "").split(/\n+/).map(value => value.trim()).filter(Boolean).slice(0, 3);
            return <article className={`pocket-item${active ? " is-expanded" : ""}`} key={item.id} id={`pocket-item-${item.id}`}>
              <div className="pocket-item-row">
                <button type="button" className="pocket-item-select" onClick={() => onSelect(active ? "" : item.id)} aria-expanded={active} aria-controls={`pocket-details-${item.id}`}>
                  <span className="pocket-item-icon"><IconBookmark size={16} /></span>
                  <span className="pocket-item-copy"><strong>{item.title}</strong><span>{item.summary}</span><small>{item.sourceLabel} · {item.sourceType}</small></span>
                  <span className={`pocket-status is-${tone}`}>{label}</span>
                  <IconChevronDown className="pocket-item-chevron" size={16} />
                </button>
                <button type="button" className="pocket-item-remove" aria-label={`从知识口袋移除：${item.title}`} title="移除" onClick={() => onRemove(item.id)}><IconTrash size={15} /></button>
              </div>
              {active && <section className="pocket-item-expanded" id={`pocket-details-${item.id}`} aria-label={`${item.title}的展开内容`}>
                <div className="pocket-expanded-content">
                  <span className="pocket-expanded-label">展开内容 · {item.sourceLabel || "来自电脑端"}</span>
                  <div className="pocket-expanded-text">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
                  {item.taskId && <small className="pocket-expanded-task">关联任务 · {item.taskId}</small>}
                </div>
                <div className="pocket-expanded-actions">
                  <div className="pocket-signal" role="group" aria-label="这条内容对我的意义">
                    <span className="pocket-signal-heading">学习标记</span>
                    <span className="pocket-signal-help">只影响后续速览推荐，不会发送；可再次点按取消。</span>
                    <div className="pocket-signal-buttons">
                      <button type="button" className={item.signal === "interested" ? "is-active" : ""} onClick={() => onSignal(item, "interested")} aria-pressed={item.signal === "interested"}>感兴趣</button>
                      <button type="button" className={item.signal === "question" ? "is-active" : ""} onClick={() => onSignal(item, "question")} aria-pressed={item.signal === "question"}>还没弄懂</button>
                    </div>
                  </div>
                  <div className="pocket-delivery-actions" aria-label="选择送达方式">
                    <button type="button" className="pocket-schedule-button" onClick={() => onSchedule(item)} aria-pressed={item.status === "scheduled"}>
                      {item.status === "scheduled" ? <IconCheck size={15} /> : <IconClock size={15} />}
                      {item.status === "scheduled" ? "已加入定期速览" : "加入定期速览"}
                    </button>
                    <button type="button" className="pocket-send-button" onClick={() => onSendNow(item)}>
                      <IconDeviceMobileMessage size={16} />发到微信，现在看<IconExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </section>}
            </article>;
          })}
        </div>
      <p className="pocket-footer-note">{deliveredCount ? `${deliveredCount} 条已送达手机；手机端的阅读状态会回到口袋。` : "现在看会在微信消息列表样机中生成一条通知；定期速览会优先带上已安排的内容。"}</p>
      </>}
    </main>
  </section>;
}
