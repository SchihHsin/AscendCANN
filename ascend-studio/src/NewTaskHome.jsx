import { useState } from "react";
import { IconSparkles } from "@tabler/icons-react";
import "./new-task-home.css";

const modes = [
  { id: "learning", label: "学习", placeholder: "描述你的学习目标、遇到的问题或想掌握的主题…", action: "生成学习路径" },
  { id: "development", label: "开发", placeholder: "描述你要实现的功能、遇到的问题或希望修改的代码…", action: "开始开发任务" },
];

export function NewTaskHome({ onCreateTask }) {
  const [mode, setMode] = useState("learning");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const activeMode = modes.find((item) => item.id === mode) || modes[0];

  const submit = (event) => {
    event.preventDefault();
    const cleanGoal = goal.trim();
    if (!cleanGoal) {
      setError("先写下你想学习或开发的目标。");
      return;
    }
    const created = onCreateTask?.({ goal: cleanGoal, kind: mode === "learning" ? "learning" : "development" });
    if (!created) setError("任务没有创建成功，请调整目标后重试。");
  };

  return (
    <section className="new-task-home" aria-label="新建任务">
      <img className="new-task-home__ambient" src={`${import.meta.env.BASE_URL}assets/dialog-exchange-ambient.png`} alt="" aria-hidden="true" draggable={false} />
      <div className="new-task-home__content">
        <h1>开始一个新任务</h1>
        <p className="new-task-home__subtitle">选学习或开发，描述目标即可开始</p>
        <div className="new-task-home__mode" role="group" aria-label="任务类型">
          {modes.map((item) => (
            <button
              key={item.id}
              className={"new-task-home__mode-button" + (item.id === mode ? " is-active" : "")}
              type="button"
              aria-pressed={item.id === mode}
              onClick={() => { setMode(item.id); setError(""); }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <form className="new-task-home__form" onSubmit={submit}>
          <label className="new-task-home__field">
            <span className="new-task-home__sr-only">{activeMode.label}目标</span>
            <textarea
              value={goal}
              onChange={(event) => { setGoal(event.target.value); setError(""); }}
              placeholder={activeMode.placeholder}
              maxLength={2000}
              rows={4}
              aria-label={activeMode.label + "目标"}
              aria-describedby="new-task-home-count"
            />
            <span className="new-task-home__count" id="new-task-home-count">{goal.length} / 2000</span>
          </label>
          {error && <p className="new-task-home__error" role="alert">{error}</p>}
          <button className="new-task-home__submit" type="submit" disabled={!goal.trim()}>
            <IconSparkles size={16} aria-hidden="true" />
            {activeMode.action}
          </button>
        </form>
      </div>
    </section>
  );
}
