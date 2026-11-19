import { useMemo, useRef, useState } from "react";
import data from "./knowledge/graph.json";
import "./knowledge-graph.css";

const W = 1180;
const H = 760;
const WEIGHT_NAME = { 3: "核心瓶颈", 2: "关键机制", 1: "常规细节", 0: "原子实操" };
const SIZE = {
  3: { h: 26, fs: 10.6, pad: 12, fw: 700 },
  2: { h: 22, fs: 10.2, pad: 11, fw: 600 },
  1: { h: 20, fs: 9.6, pad: 10, fw: 500 },
  0: { h: 18, fs: 9.2, pad: 9, fw: 500 },
};

const byId = Object.fromEntries(data.nodes.map((node) => [node.id, node]));
const domById = Object.fromEntries(data.domains.map((dom) => [dom.id, dom]));
const dlgByN = Object.fromEntries(data.dialogues.map((d) => [d.n, d]));

function measureText() {
  const ctx = document.createElement("canvas").getContext("2d");
  return (text, fs) => {
    ctx.font = `600 ${fs}px Inter, "Noto Sans SC", sans-serif`;
    return ctx.measureText(text).width;
  };
}

function buildLayout() {
  let seed = 20260901;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const measure = measureText();
  const nodes = data.nodes.map((node) => {
    const size = SIZE[node.w];
    const dom = domById[node.dom];
    const angle = rnd() * Math.PI * 2;
    const radius = 30 + rnd() * 110;
    return {
      ...node,
      w2: Math.ceil(measure(node.name, size.fs) + size.pad * 2),
      h2: size.h,
      fs: size.fs,
      fw: size.fw,
      x: dom.cx + Math.cos(angle) * radius,
      y: dom.cy + Math.sin(angle) * radius,
    };
  });
  const map = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const links = data.links
    .map(([a, b, kind]) => ({ a: map[a], b: map[b], kind }))
    .filter((link) => link.a && link.b);

  for (let step = 0; step < 240; step += 1) {
    const k = 1 - step / 260;
    nodes.forEach((a) => {
      let fx = 0;
      let fy = 0;
      const dom = domById[a.dom];
      fx += (dom.cx - a.x) * 0.08;
      fy += (dom.cy - a.y) * 0.08;
      for (let i = 0; i < nodes.length; i += 1) {
        const b = nodes[i];
        if (a === b) continue;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        if (dx === 0 && dy === 0) { dx = 0.01; dy = 0.01; }
        const d2 = dx * dx + dy * dy;
        if (d2 > 90000) continue;
        const d = Math.sqrt(d2);
        const f = 3200 / d2;
        fx -= (dx / d) * f;
        fy -= (dy / d) * f;
        const pad = 10;
        const ox = (a.w2 + b.w2) / 2 + pad - Math.abs(dx);
        const oy = (a.h2 + b.h2) / 2 + pad - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          if (ox < oy) fx -= ox * 0.5 * (dx >= 0 ? 1 : -1);
          else fy -= oy * 0.5 * (dy >= 0 ? 1 : -1);
        }
      }
      a.x += fx * k;
      a.y += fy * k;
    });
    links.forEach(({ a, b, kind }) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.max(1, Math.hypot(dx, dy));
      const rest = kind === "parent" ? 58 : 118;
      const f = (d - rest) * (kind === "parent" ? 0.012 : 0.004) * k;
      const ux = dx / d;
      const uy = dy / d;
      a.x += ux * f; a.y += uy * f;
      b.x -= ux * f; b.y -= uy * f;
    });
  }

  const pad = 9;
  for (let round = 0; round < 160; round += 1) {
    let moved = false;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const ox = (a.w2 + b.w2) / 2 + pad - Math.abs(dx);
        const oy = (a.h2 + b.h2) / 2 + pad - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        if (ox < oy) {
          const p = ox * 0.5 * (dx >= 0 ? 1 : -1);
          a.x -= p; b.x += p;
        } else {
          const p = oy * 0.5 * (dy >= 0 ? 1 : -1);
          a.y -= p; b.y += p;
        }
        moved = true;
      }
    }
    if (!moved) break;
  }

  nodes.forEach((n) => {
    n.x = Math.max(n.w2 / 2 + 20, Math.min(W - n.w2 / 2 - 20, n.x));
    n.y = Math.max(n.h2 / 2 + 40, Math.min(H - n.h2 / 2 - 20, n.y));
  });

  return { nodes, links };
}

export function KnowledgeGraphPage() {
  const layout = useMemo(buildLayout, []);
  const [query, setQuery] = useState("");
  const [scene, setScene] = useState("all");
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const frameRef = useRef(null);

  const neighbors = useMemo(() => {
    const map = new Map(layout.nodes.map((n) => [n.id, new Set()]));
    layout.links.forEach(({ a, b }) => {
      map.get(a.id).add(b.id);
      map.get(b.id).add(a.id);
    });
    return map;
  }, [layout]);

  const focus = hovered || selected;
  const sceneSet = useMemo(() => {
    const found = data.scenes.find((s) => s.id === scene);
    return new Set(found ? found.ds : []);
  }, [scene]);

  const terms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? [q] : [];
  }, [query]);

  const isHit = (node) => {
    if (!terms.length) return true;
    return terms.some((q) => `${node.name} ${node.def} ${node.pit}`.toLowerCase().includes(q));
  };

  const selectedNode = selected ? byId[selected] : null;
  const selectedSources = selectedNode
    ? selectedNode.turns.map((turn) => {
        const round = data.rounds.find((r) => r.c === turn.c && r.r === turn.t);
        return {
          key: `${turn.c}-${turn.t}`,
          dialogue: dlgByN[turn.c]?.t || `第 ${turn.c} 段`,
          round: turn.t,
          text: round?.a || "",
        };
      })
    : [];

  return (
    <section className="kg-page" aria-label="知识图谱">
      <header className="kg-header">
        <div className="kg-title">
          <h1>知识图谱</h1>
          <p>
            {data.nodes.length} 个知识点 · {data.dialogues.length} 段原声对话 ·{" "}
            {data.links.length} 条关系
          </p>
        </div>
        <label className="kg-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.6-3.6" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索知识点"
            aria-label="搜索知识点"
          />
          {query && (
            <button type="button" className="kg-clear" onClick={() => setQuery("")} aria-label="清除搜索">
              ×
            </button>
          )}
        </label>
      </header>

      <div className="kg-scenes">
        {data.scenes.map((item) => (
          <button
            key={item.id}
            type="button"
            className={"kg-chip" + (scene === item.id ? " is-on" : "")}
            onClick={() => setScene(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="kg-body">
        <div className="kg-canvas" ref={frameRef}>
          <svg viewBox={`-34 -28 ${W + 68} ${H + 84}`} role="img" aria-label="知识点关系图">
            <g className="kg-edges">
              {layout.links.map(({ a, b, kind }, index) => {
                const active = focus && (a.id === focus || b.id === focus);
                const dim =
                  (focus && !active) ||
                  !isHit(a) ||
                  !isHit(b) ||
                  !sceneSet.has(a.refs[0] ?? 0) && scene !== "all" && !a.refs.some((r) => sceneSet.has(r));
                const inScene = scene === "all" || a.refs.some((r) => sceneSet.has(r)) || b.refs.some((r) => sceneSet.has(r));
                return (
                  <line
                    key={`${a.id}-${b.id}-${index}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className={`kg-edge kg-edge--${kind || "dep"}`}
                    style={{
                      opacity: focus ? (active ? 0.9 : 0.06) : inScene ? (a && b && isHit(a) && isHit(b) ? 0.32 : 0.08) : 0.04,
                    }}
                  />
                );
              })}
            </g>
            <g className="kg-nodes">
              {layout.nodes.map((node) => {
                const dom = domById[node.dom];
                const active = focus === node.id;
                const nb = focus && neighbors.get(focus)?.has(node.id);
                const hit = isHit(node);
                const inScene = scene === "all" || node.refs.some((r) => sceneSet.has(r));
                const opacity = focus ? (active ? 1 : nb ? 0.85 : 0.14) : hit && inScene ? 1 : 0.16;
                const fill =
                  node.w === 3
                    ? dom.color
                    : node.w === 2
                      ? `${dom.color}33`
                      : "#ffffff";
                const stroke = node.w >= 2 ? dom.color : node.w === 1 ? `${dom.color}99` : "#dfe3ea";
                const color = node.w >= 2 ? "#23252b" : node.w === 1 ? "#4b4f58" : "#7b7f88";
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x},${node.y})`}
                    className="kg-node"
                    style={{ opacity }}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(node.id)}
                  >
                    <rect
                      x={-(node.w2 / 2 + 5)}
                      y={-(node.h2 / 2 + 4)}
                      width={node.w2 + 10}
                      height={node.h2 + 8}
                      rx={(node.h2 + 8) / 2}
                      fill={dom.color}
                      opacity={active ? 0.26 : nb ? 0.18 : 0.08}
                    />
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
                    <text y={node.fs * 0.36} fontSize={node.fs} fontWeight={node.fw} fill={color} textAnchor="middle">
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="kg-legend">
            {data.domains.map((dom) => (
              <span key={dom.id}>
                <i style={{ background: dom.color }} />
                {dom.name}
              </span>
            ))}
          </div>
        </div>

        <aside className={"kg-detail" + (selectedNode ? " is-open" : "")}>
          {selectedNode ? (
            <>
              <header>
                <span className="kg-dot" style={{ background: domById[selectedNode.dom].color }} />
                <span>
                  {domById[selectedNode.dom].name} · {WEIGHT_NAME[selectedNode.w]}
                </span>
                <button type="button" className="kg-close" onClick={() => setSelected(null)} aria-label="关闭">
                  ×
                </button>
              </header>
              <h2>{selectedNode.name}</h2>
              <p className="kg-def">{selectedNode.def}</p>
              {selectedNode.pit && <p className="kg-pit">误区：{selectedNode.pit}</p>}
              <h3>出处</h3>
              <ul className="kg-sources">
                {selectedSources.map((source) => (
                  <li key={source.key}>
                    <button
                      type="button"
                      onClick={() => {
                        const round = data.rounds.find((r) => r.c + "-" + r.r === source.key);
                        if (round) {
                          setHovered(null);
                        }
                      }}
                    >
                      <strong>{source.dialogue}</strong>
                      <span>第 {source.round} 轮</span>
                      <em>{source.text.slice(0, 46)}…</em>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="kg-empty">点一个节点，看它的结论、误区与出处。</p>
          )}
        </aside>
      </div>
    </section>
  );
}
