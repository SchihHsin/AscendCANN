import { useEffect, useMemo, useRef, useState } from "react";
import { IconArrowRight, IconBook2, IconCheck, IconFocus2, IconHandStop, IconLayoutColumns, IconLayoutRows, IconMaximize, IconMinus, IconPlus, IconRefresh, IconTargetArrow } from "@tabler/icons-react";
import { OFFICIAL_IMAGE_SAMPLE_URL, OFFICIAL_LEARNING_COURSES, OFFICIAL_LEARNING_PATH_URL, getOfficialCourseStatus, getOfficialLearningNode, officialStatusLabel } from "./official-learning-data";
import "./official-learning-canvas.css";

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const courseStatus = (course, statuses) => getOfficialCourseStatus(course, statuses);
const stepStatus = (step, statuses) => statuses[step.id] || "not-started";

function graphFor(layout) {
  if (layout === "vertical") {
    const rowHeight = 188;
    const groups = OFFICIAL_LEARNING_COURSES.map((course, index) => {
      const y = 54 + index * rowHeight;
      const parent = { x: 42, y: y + 52, width: 240, height: 72 };
      const children = course.children.map((child, childIndex) => ({ ...child, rect: { x: 340, y: y + 5 + childIndex * 55, width: 260, height: 52 } }));
      return { ...course, index, rect: parent, children };
    });
    return { groups, width: 630, height: 54 + OFFICIAL_LEARNING_COURSES.length * rowHeight - 10 };
  }
  const columnWidth = 286;
  const groups = OFFICIAL_LEARNING_COURSES.map((course, index) => {
    const x = 42 + index * columnWidth;
    const parent = { x, y: 49, width: 252, height: 78 };
    const children = course.children.map((child, childIndex) => ({ ...child, rect: { x: x + 7, y: 154 + childIndex * 66, width: 265, height: 58 } }));
    return { ...course, index, rect: parent, children };
  });
  return { groups, width: 42 + (OFFICIAL_LEARNING_COURSES.length - 1) * columnWidth + 272, height: 154 + 2 * 66 + 58 + 20 };
}
function NodeStatus({ status }) {
  return <span className={`ol-status is-${status}`}><i />{officialStatusLabel(status)}</span>;
}

function WorkflowLines({ graph, layout, selectedNodeId }) {
  const selected = getOfficialLearningNode(selectedNodeId);
  return <svg className="ol-lines" width={graph.width} height={graph.height} aria-hidden="true">
    <defs><marker id="ol-arrow-main" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" /></marker><marker id="ol-arrow-child" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8Z" /></marker></defs>
    {graph.groups.map((course, index) => {
      const next = graph.groups[index + 1];
      const currentCourse = selected?.courseId === course.id;
      const parent = course.rect;
      const main = next && (layout === "horizontal"
        ? `M${parent.x + parent.width},${parent.y + parent.height / 2} C${parent.x + parent.width + 26},${parent.y + parent.height / 2} ${next.rect.x - 26},${next.rect.y + next.rect.height / 2} ${next.rect.x},${next.rect.y + next.rect.height / 2}`
        : `M${parent.x + parent.width / 2},${parent.y + parent.height} C${parent.x + parent.width / 2},${parent.y + parent.height + 25} ${next.rect.x + next.rect.width / 2},${next.rect.y - 25} ${next.rect.x + next.rect.width / 2},${next.rect.y}`);
      const branch = layout === "horizontal"
        ? `M${parent.x + 25},${parent.y + parent.height} V${course.children[0]?.rect.y - 22}`
        : `M${parent.x + parent.width},${parent.y + parent.height / 2} H${course.children[0]?.rect.x - 34} V${course.children[0]?.rect.y + course.children[0]?.rect.height / 2}`;
      return <g key={course.id} className={currentCourse ? "is-current" : ""}>
        {main && <path className="ol-main-link" d={main} markerEnd="url(#ol-arrow-main)" />}
        {layout === "horizontal" && course.children.length > 0 && <path className="ol-branch" d={branch} />}
        {layout === "vertical" && course.children.length > 0 && <path className="ol-branch" d={`M${parent.x + parent.width},${parent.y + parent.height / 2} H${course.children[0].rect.x - 24} V${course.children.at(-1).rect.y + course.children.at(-1).rect.height / 2}`} />}
        {course.children.map(child => {
          const target = child.rect;
          const d = layout === "horizontal"
            ? `M${parent.x + 25},${parent.y + parent.height} V${target.y + target.height / 2} H${target.x}`
            : `M${target.x - 24},${target.y + target.height / 2} H${target.x}`;
          return <path key={child.id} className={`ol-child-link${selectedNodeId === child.id ? " is-selected" : ""}`} d={d} markerEnd="url(#ol-arrow-child)" />;
        })}
      </g>;
    })}
  </svg>;
}

function FlowDiagram({ items }) {
  return <div className="ol-flow" aria-label="当前节点流程示意">{items.map((item, index) => <div className="ol-flow-item" key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < items.length - 1 && <IconArrowRight size={15} />}</div>)}</div>;
}

function NodeDetail({ node, state, actions }) {
  const isStep = node.kind === "step";
  const status = isStep ? stepStatus(node, state.statuses) : courseStatus(OFFICIAL_LEARNING_COURSES.find(item => item.id === node.id), state.statuses);
  const parentCourse = !isStep ? OFFICIAL_LEARNING_COURSES.find(item => item.id === node.id) : null;
  const parentIndex = parentCourse ? OFFICIAL_LEARNING_COURSES.indexOf(parentCourse) : -1;
  const firstStep = parentCourse?.children[0];
  const link = node.source === "image-sample" ? OFFICIAL_IMAGE_SAMPLE_URL : OFFICIAL_LEARNING_PATH_URL;
  const linkLabel = node.source === "image-sample" ? "官方图像处理样例参考" : "打开昇腾开发者成长路径";
  return <section className="ol-detail" aria-live="polite">
    <div className="ol-detail-head"><div><span>{isStep ? `学习拆解 · ${node.courseTitle}` : "官网课程节点"}</span><h3>{node.title}</h3></div><NodeStatus status={status} /></div>
    <p className="ol-objective">{isStep ? node.objective : node.summary}</p>
    {isStep ? <>
      <FlowDiagram items={node.flow} />
      <div className="ol-concepts"><span>本节点关注</span>{node.concepts.map(concept => <i key={concept}>{concept}</i>)}</div>
      <div className="ol-detail-actions">
        {status === "not-started" && <button type="button" className="ol-primary" onClick={() => actions.startNode(node.id)}>开始这个节点<IconArrowRight size={14} /></button>}
        {status === "in-progress" && <button type="button" className="ol-primary" onClick={() => actions.completeNode(node.id)}><IconCheck size={14} />我已学完</button>}
        {status === "completed" && <button type="button" className="ol-secondary" onClick={() => actions.startNode(node.id)}><IconRefresh size={14} />重新学习</button>}
        <a href={link} target="_blank" rel="noreferrer">{linkLabel}<IconArrowRight size={13} /></a>
      </div>
    </> : <>
      <div className="ol-course-progress"><span>此课程下的学习拆解</span><strong>{node.children.filter(child => state.statuses[child.id] === "completed").length} / {node.children.length} 已标记学完</strong></div>
      <div className="ol-course-steps">{node.children.map((child, index) => <button type="button" key={child.id} onClick={() => actions.selectNode(child.id)}><span>{parentIndex + 1}.{index + 1}</span><strong>{child.title}</strong><NodeStatus status={stepStatus(child, state.statuses)} /><IconArrowRight size={13} /></button>)}</div>
      {firstStep && <button type="button" className="ol-primary ol-course-cta" onClick={() => actions.startNode(firstStep.id)}>从第一个拆解节点开始<IconArrowRight size={14} /></button>}
      <a className="ol-course-source" href={OFFICIAL_LEARNING_PATH_URL} target="_blank" rel="noreferrer">打开昇腾开发者成长路径<IconArrowRight size={13} /></a>
    </>}
    <p className="ol-note">进度由学习者手动记录；子节点是 Demo 的学习拆解，不是官网章节，也不代表已完成设备运行验证。</p>
  </section>;
}

export function OfficialLearningPathCanvas({ journey, visible = true }) {
  const { state, actions } = journey;
  const host = useRef(null);
  const gesture = useRef(null);
  const current = useRef(null);
  const [graphSize, setGraphSize] = useState({ width: 0, height: 0 });
  const [hand, setHand] = useState(false);
  const [focused, setFocused] = useState(false);
  const graph = useMemo(() => graphFor(state.layout), [state.layout]);
  const node = getOfficialLearningNode(state.selectedNodeId) || getOfficialLearningNode(OFFICIAL_LEARNING_COURSES[0].children[0].id);
  const viewport = state.viewport;
  const done = Object.values(state.statuses).filter(status => status === "completed").length;
  const total = OFFICIAL_LEARNING_COURSES.reduce((sum, course) => sum + course.children.length, 0);
  const graphBounds = state.layout === "horizontal" ? { x: 20, y: 18, width: graph.width - 18, height: graph.height - 18 } : { x: 18, y: 18, width: graph.width - 12, height: graph.height - 18 };
  const setViewport = actions.setViewport;
  const fitPath = (padding = 26) => {
    const width = graphSize.width;
    const height = graphSize.height;
    if (width < 50 || height < 50) return;
    const scale = clamp(Math.min((width - padding * 2) / graphBounds.width, (height - padding * 2) / graphBounds.height), .2, 1.1);
    setViewport({ scale, x: padding + Math.max(0, (width - padding * 2 - graphBounds.width * scale) / 2) - graphBounds.x * scale, y: padding + Math.max(0, (height - padding * 2 - graphBounds.height * scale) / 2) - graphBounds.y * scale });
    setFocused(false);
  };
  current.current = { viewport, setViewport };

  useEffect(() => {
    const element = host.current?.querySelector(".ol-graph-viewport");
    if (!element) return undefined;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setGraphSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || state.initialized || graphSize.width < 50 || graphSize.height < 50) return;
    fitPath();
    actions.markInitialized();
  }, [visible, state.initialized, state.layout, graph.width, graph.height, graphSize.width, graphSize.height]);
  useEffect(() => {
    const element = host.current;
    if (!element) return undefined;
    const wheel = event => {
      if (event.target.closest("button,a,input,textarea,select,.ol-detail")) return;
      event.preventDefault();
      const { viewport: old, setViewport: set } = current.current;
      if (event.ctrlKey || event.metaKey) {
        const rect = element.querySelector(".ol-graph-viewport").getBoundingClientRect();
        const x = event.clientX - rect.left, y = event.clientY - rect.top;
        const scale = clamp(old.scale * Math.exp(-event.deltaY * .002), .2, 1.6);
        set({ scale, x: x - (x - old.x) * scale / old.scale, y: y - (y - old.y) * scale / old.scale });
      } else set({ x: old.x - event.deltaX, y: old.y - event.deltaY });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, []);

  const zoom = delta => {
    const scale = clamp(viewport.scale + delta, .2, 1.6);
    const centerX = graphSize.width / 2, centerY = graphSize.height / 2;
    setViewport({ scale, x: centerX - (centerX - viewport.x) * scale / viewport.scale, y: centerY - (centerY - viewport.y) * scale / viewport.scale });
  };
  const focusNode = () => {
    if (focused) { fitPath(); return; }
    const target = node.kind === "course"
      ? graph.groups.find(item => item.id === node.id)?.rect
      : graph.groups.flatMap(item => item.children).find(item => item.id === node.id)?.rect;
    if (!target) return;
    const scale = clamp(Math.min((graphSize.width - 90) / (target.width + 270), (graphSize.height - 70) / (target.height + 190)), .28, 1.35);
    setViewport({ scale, x: graphSize.width / 2 - (target.x + target.width / 2) * scale, y: graphSize.height / 2 - (target.y + target.height / 2) * scale });
    setFocused(true);
  };
  const select = id => actions.selectNode(id);
  const selectedCourseId = node.kind === "course" ? node.id : node.courseId;
  const currentCourseIndex = Math.max(0, OFFICIAL_LEARNING_COURSES.findIndex(course => course.id === selectedCourseId));
  const rectFor = id => id === selectedCourseId ? graph.groups[currentCourseIndex]?.rect : graph.groups.flatMap(course => course.children).find(child => child.id === id)?.rect;
  const activeRect = rectFor(node.id);

  return <div ref={host} className={`learning-hierarchy-canvas official-learning-canvas${hand ? " is-hand" : ""}`} aria-label="AscendCL 与 ResNet50 官网学习路径画布" onPointerDown={event => {
    if (event.button !== 0 || event.target.closest("button,a,input,textarea,select,.ol-detail,.ol-node")) return;
    gesture.current = { x: event.clientX, y: event.clientY, origin: viewport };
    event.currentTarget.setPointerCapture(event.pointerId);
  }} onPointerMove={event => {
    if (!gesture.current) return;
    setViewport({ x: gesture.current.origin.x + event.clientX - gesture.current.x, y: gesture.current.origin.y + event.clientY - gesture.current.y });
  }} onPointerUp={() => { gesture.current = null; }} onPointerCancel={() => { gesture.current = null; }}>
    <header className="ol-heading"><div className="ol-title-icon"><IconBook2 size={19} /></div><div><h2>AscendCL → ResNet50 离线推理</h2><p>官网成长路径 · 约 2 小时 · 计算机基础、机器学习</p></div><div className="ol-progress" aria-label={`已标记完成 ${done} 个拆解节点，共 ${total} 个`}><span><b>{done}</b> / {total}</span><small>节点已学完</small></div></header>
    <div className="ol-toolbar" role="toolbar" aria-label="学习路径画布工具"><div className="lh-layout-toggle" role="group" aria-label="路径布局方向"><button type="button" title="左右布局" aria-label="左右布局" aria-pressed={state.layout === "horizontal"} onClick={() => actions.setLayout("horizontal")}><IconLayoutColumns size={17} /></button><button type="button" title="上下布局" aria-label="上下布局" aria-pressed={state.layout === "vertical"} onClick={() => actions.setLayout("vertical")}><IconLayoutRows size={17} /></button></div><div className="lh-zoom-controls"><button type="button" aria-label="缩小学习路径" onClick={() => zoom(-.1)}><IconMinus size={15} /></button><button type="button" className="lh-zoom-value" title="恢复 100%" onClick={() => setViewport({ scale: 1 })}>{Math.round(viewport.scale * 100)}%</button><button type="button" aria-label="放大学习路径" onClick={() => zoom(.1)}><IconPlus size={15} /></button></div><button type="button" className="lh-tool-button" title="拖动画布" aria-label="拖动画布" aria-pressed={hand} onClick={() => setHand(value => !value)}><IconHandStop size={17} /></button><button type="button" className="lh-tool-button" title="适应完整学习路径" aria-label="适应完整学习路径" onClick={() => fitPath()}><IconMaximize size={17} /></button><button type="button" className={`lh-tool-button${focused ? " is-active" : ""}`} title={focused ? "显示完整路径" : "聚焦当前节点"} aria-label={focused ? "显示完整路径" : "聚焦当前节点"} onClick={focusNode}><IconFocus2 size={17} /></button></div>
    <div className="ol-source-chip"><IconTargetArrow size={13} /><span>官网课程主线</span><i /> <span>学习拆解子节点</span></div>
    <div className="ol-graph-viewport">
      <div className="lh-world ol-world" style={{ width: graph.width, height: graph.height, transform: `translate(${viewport.x}px,${viewport.y}px) scale(${viewport.scale})` }}>
        <WorkflowLines graph={graph} layout={state.layout} selectedNodeId={state.selectedNodeId} />
        {graph.groups.map((course, index) => <div className="ol-course-group" key={course.id}>
          <button type="button" className={`ol-node ol-course-node${selectedCourseId === course.id && node.kind === "course" ? " is-selected" : ""}`} style={{ left: course.rect.x, top: course.rect.y, width: course.rect.width, height: course.rect.height }} onClick={() => select(course.id)} aria-pressed={state.selectedNodeId === course.id}>
            <span className="ol-node-kicker"><span>官网路径 {String(index + 1).padStart(2, "0")}</span><NodeStatus status={courseStatus(course, state.statuses)} /></span><strong>{course.title}</strong><small>{course.children.length} 个学习拆解</small>
          </button>
          {course.children.map((child, childIndex) => <button type="button" key={child.id} className={`ol-node ol-step-node${state.selectedNodeId === child.id ? " is-selected" : ""}`} style={{ left: child.rect.x, top: child.rect.y, width: child.rect.width, height: child.rect.height }} onClick={() => select(child.id)} aria-pressed={state.selectedNodeId === child.id}>
            <span className="ol-step-number">{index + 1}.{childIndex + 1}</span><span className="ol-step-copy"><strong>{child.title}</strong><small>{child.summary}</small></span><NodeStatus status={stepStatus(child, state.statuses)} />
          </button>)}
        </div>)}
      </div>
      {activeRect && <svg className="ol-focus-mark" aria-hidden="true"><circle cx={viewport.x + (activeRect.x + activeRect.width / 2) * viewport.scale} cy={viewport.y + (activeRect.y + activeRect.height / 2) * viewport.scale} r={Math.max(4, 7 * viewport.scale)} /></svg>}
    </div>
    <NodeDetail node={node} state={state} actions={actions} />
    <footer className="ol-footer"><span>路径顺序与课程名来自昇腾开发者成长计划</span><a href={OFFICIAL_LEARNING_PATH_URL} target="_blank" rel="noreferrer">查看官方路径<IconArrowRight size={12} /></a><span className="ol-footer-divider" /><a href={OFFICIAL_IMAGE_SAMPLE_URL} target="_blank" rel="noreferrer">图像处理样例参考<IconArrowRight size={12} /></a></footer>
  </div>;
}
