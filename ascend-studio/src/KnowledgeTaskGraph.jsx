import { useMemo, useState } from "react";
import data from "./knowledge/graph.json";
import "./knowledge-task-graph.css";

const W = 440;
const H = 560;
const WEIGHT = { 3: 11, 2: 10, 1: 9, 0: 8 };

const byId = Object.fromEntries(data.nodes.map((node) => [node.id, node]));
const domById = Object.fromEntries(data.domains.map((dom) => [dom.id, dom]));
const dlgByC = Object.fromEntries(data.dialogues.map((d) => [d.n, d]));

function measure(text, fs) {
  const ctx = measure.ctx || (measure.ctx = document.createElement("canvas").getContext("2d"));
  ctx.font = `600 ${fs}px Inter, "Noto Sans SC", sans-serif`;
  return ctx.measureText(text).width;
}

function buildLayout(ids) {
  const nodes = ids
    .map((id) => byId[id])
    .filter(Boolean)
    .map((node) => {
      const fs = WEIGHT[node.w] || 9;
      return {
        ...node,
        fs,
        w2: Math.ceil(measure(node.name, fs) + 22),
        h2: node.w >= 2 ? 22 : 19,
      };
    });

  const n = Math.max(1, nodes.length);
  const ring = 92 + n * 6;
  nodes.forEach((node, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    node.x = W / 2 + Math.cos(angle) * ring;
    node.y = H / 2 + Math.sin(angle) * ring * 0.86;
  });

  for (let pass = 0; pass < 80; pass += 1) {
    let moved = false;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const ox = (a.w2 + b.w2) / 2 + 8 - Math.abs(dx);
        const oy = (a.h2 + b.h2) / 2 + 8 - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        if (ox < oy) {
          const p = ox * 0.5 * (dx >= 0 ? 1 : -1);
          a.x -= p;
          b.x += p;
        } else {
          const p = oy * 0.5 * (dy >= 0 ? 1 : -1);
          a.y -= p;
          b.y += p;
        }
        moved = true;
      }
    }
    if (!moved) break;
  }

  nodes.forEach((node) => {
    node.x = Math.max(node.w2 / 2 + 10, Math.min(W - node.w2 / 2 - 10, node.x));
    node.y = Math.max(node.h2 / 2 + 12, Math.min(H - node.h2 / 2 - 12, node.y));
  });

  const idset = new Set(nodes.map((node) => node.id));
  const links = data.links
    .filter(([a, b]) => idset.has(a) && idset.has(b))
    .map(([a, b, kind], i) => ({ a: nodes.find((n) => n.id === a), b: nodes.find((n) => n.id === b), kind, i }));

  return { nodes, links };
}

function focusRound(dialogueId, round) {
  const target = document.querySelector(`[data-knowledge-round="${dialogueId}-${round}"]`);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.classList.add("is-knowledge-focus");
  window.setTimeout(() => target.classList.remove("is-knowledge-focus"), 1800);
}

export function KnowledgeTaskGraph({ task }) {
  const ids = useMemo(() => task?.nodeIds || [], [task]);
  const { nodes, links } = useMemo(() => buildLayout(ids), [ids]);
  const [hover, setHover] = useState(null);
  const neighbours = useMemo(() => {
    const map = new Map(nodes.map((node) => [node.id, new Set()]));
    links.forEach(({ a, b }) => {
      map.get(a.id)?.add(b.id);
      map.get(b.id)?.add(a.id);
    });
    return map;
  }, [nodes, links]);

  const openNode = (id) => {
    const round = (task.dialogue || []).find((item) => (item.nodes || []).includes(id));
    if (round) focusRound(task.dialogueId, round.r);
  };

  if (!nodes.length) {
    return (
      <div className="ktg-empty">
        <p>这段对话还没有关联知识点。</p>
      </div>
    );
  }

  return (
    <div className="ktg">
      <header className="ktg-head">
        <div>
          <h3>知识图谱</h3>
          <p>
            本段对话涉及 {nodes.length} 个知识点 · {task.dialogue?.length || 0} 轮原声
          </p>
        </div>
      </header>

      <div className="ktg-canvas">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="本段对话涉及的知识点">
          <g>
            {links.map(({ a, b, kind, i }) => {
              const active = hover && (a.id === hover || b.id === hover);
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  className={`ktg-edge ktg-edge--${kind || "dep"}`}
                  style={{ opacity: hover ? (active ? 0.8 : 0.08) : 0.28 }}
                />
              );
            })}
          </g>
          <g>
            {nodes.map((node) => {
              const dom = domById[node.dom];
              const neighbour = hover && neighbours.get(hover)?.has(node.id);
              const dim = hover && hover !== node.id && !neighbour;
              const fill = node.w === 3 ? dom.color : node.w === 2 ? `${dom.color}33` : "#fff";
              const stroke = node.w >= 2 ? dom.color : node.w === 1 ? `${dom.color}99` : "#dfe3ea";
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  className="ktg-node"
                  style={{ opacity: dim ? 0.25 : 1 }}
                  onMouseEnter={() => setHover(node.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => openNode(node.id)}
                >
                  <rect
                    x={-node.w2 / 2}
                    y={-node.h2 / 2}
                    width={node.w2}
                    height={node.h2}
                    rx={node.h2 / 2}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={node.w >= 3 ? 0 : 1}
                  />
                  <text y={node.fs * 0.36} fontSize={node.fs} fontWeight={600} fill="#23252b" textAnchor="middle">
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <p className="ktg-hint">点一个知识点，对话会跳到提到它的那一轮。</p>
    </div>
  );
}
