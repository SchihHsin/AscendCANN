import "./composition-learning-path-canvas.css";

export function CompositionLearningPathCanvas({ plan }) {
  return <section className="composition-learning-path canvas-surface" aria-label="根据兴趣关联生成的学习路径">
    <header className="composition-learning-path__header">
      <span>学习路径草案</span>
      <h1>从「{plan.goalTitle}」开始</h1>
      <p>{plan.description}</p>
    </header>
    <ol className="composition-learning-path__steps">
      {plan.steps.map((step, index) => <li className="composition-learning-path__step" key={step.id}>
        <span className={`composition-learning-path__marker is-${step.tone}`} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <article className="composition-learning-path__node">
          <h2>{step.title}</h2>
          <p>{step.description}</p>
          {step.fields.length > 0 && <div className="composition-learning-path__sources" aria-label="关联字段">
            {step.fields.map(field => <span key={field.id} className={`is-${field.tone}`}>{field.title}</span>)}
          </div>}
        </article>
      </li>)}
    </ol>
    <footer className="composition-learning-path__footer">{plan.sourceFieldCount} 个关联线索 · {plan.steps.length} 个学习节点</footer>
  </section>;
}
