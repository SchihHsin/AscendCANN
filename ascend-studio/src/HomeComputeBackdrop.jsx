import { useEffect, useRef } from "react";
import {
  IconBinary,
  IconBrackets,
  IconCode,
  IconCpu,
  IconGridDots,
  IconMathFunction,
} from "@tabler/icons-react";
import "./home-compute-backdrop.css";

const GRID = 24;
const RADIUS = 180;
const MAX_SHIFT = 10;
const computeMarks = [
  { className: "is-matrix", Icon: IconGridDots, size: 32, label: "矩阵" },
  { className: "is-binary", Icon: IconBinary, size: 27, label: "二进制" },
  { className: "is-function", Icon: IconMathFunction, size: 30, label: "算子" },
  { className: "is-chip", Icon: IconCpu, size: 34, label: "计算芯片" },
  { className: "is-brackets", Icon: IconBrackets, size: 28, label: "张量结构" },
  { className: "is-code", Icon: IconCode, size: 25, label: "代码" },
];

function makeDots(width, height) {
  const columns = Math.ceil(width / GRID) + 1;
  const rows = Math.ceil(height / GRID) + 1;
  const dots = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      dots.push({ x: column * GRID, y: row * GRID });
    }
  }
  return dots;
}

export function HomeComputeBackdrop() {
  const fieldRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const field = fieldRef.current;
    const svg = svgRef.current;
    if (!field || !svg) return undefined;
    const eventTarget = field.parentElement;
    if (!eventTarget) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    let width = 0;
    let height = 0;
    let pointer = null;
    let frame = 0;
    let dots = [];
    let dotNodes = [];
    let marks = [];
    let lastNow = 0;

    const rebuild = () => {
      const bounds = field.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1 || (bounds.width === width && bounds.height === height)) return;
      width = bounds.width;
      height = bounds.height;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      dots = makeDots(width, height);
      svg.querySelector(".home-compute-backdrop__dots")?.replaceChildren(
        ...dots.map(({ x, y }) => {
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circle.setAttribute("class", "home-compute-backdrop__dot");
          circle.setAttribute("cx", x);
          circle.setAttribute("cy", y);
          circle.setAttribute("r", "1.05");
          return circle;
        }),
      );
      dotNodes = [...svg.querySelectorAll(".home-compute-backdrop__dot")];
      marks = [...svg.querySelectorAll(".home-compute-backdrop__mark")];
      const placements = {
        "is-matrix": [0.09, 0.12], "is-binary": [0.88, 0.19],
        "is-function": [0.07, 0.67], "is-chip": [0.92, 0.81],
        "is-brackets": [0.81, 0.76], "is-code": [0.22, 0.84],
        "is-index": [0.055, 0.34], "is-sum": [0.94, 0.49],
      };
      marks.forEach((group) => {
        const [x, y] = placements[[...group.classList].find((name) => placements[name])];
        group.dataset.x = String(width * x);
        group.dataset.y = String(height * y);
        group.setAttribute("transform", `translate(${width * x} ${height * y})`);
      });
      resetImmediately();
    };

    const render = (now) => {
      frame = 0;
      if (now - lastNow < 16) {
        frame = window.requestAnimationFrame(render);
        return;
      }
      lastNow = now;
      const active = pointer && !motionQuery.matches && !coarseQuery.matches;
      const [px, py] = active ? pointer : [-10000, -10000];
      let moving = false;

      for (let i = 0; i < dots.length; i += 1) {
        const { x, y } = dots[i];
        const dx = x - px;
        const dy = y - py;
        const distance = Math.hypot(dx, dy);
        const influence = active ? Math.max(0, 1 - distance / RADIUS) : 0;
        const shift = influence * MAX_SHIFT;
        const direction = distance > 0.01 ? 1 / distance : 0;
        const dot = dotNodes[i];
        if (!dot) continue;
        const targetX = dx * direction * shift;
        const targetY = dy * direction * shift;
        const currentX = Number(dot.dataset.shiftX || 0);
        const currentY = Number(dot.dataset.shiftY || 0);
        const nextX = currentX + (targetX - currentX) * 0.2;
        const nextY = currentY + (targetY - currentY) * 0.2;
        const targetOpacity = 0.17 + influence * 0.23;
        const previousOpacity = Number(dot.style.opacity || 0.17);
        const nextOpacity = previousOpacity + (targetOpacity - previousOpacity) * 0.2;
        dot.dataset.shiftX = String(nextX);
        dot.dataset.shiftY = String(nextY);
        dot.setAttribute("transform", `translate(${nextX} ${nextY})`);
        dot.style.opacity = `${nextOpacity}`;
        if (Math.abs(targetX - nextX) > 0.05 || Math.abs(targetY - nextY) > 0.05 || Math.abs(targetOpacity - nextOpacity) > 0.005) moving = true;
      }

      for (const group of marks) {
        const x = Number(group.dataset.x);
        const y = Number(group.dataset.y);
        const dx = x - px;
        const dy = y - py;
        const distance = Math.hypot(dx, dy);
        const influence = active ? Math.max(0, 1 - distance / RADIUS) : 0;
        const shift = influence * MAX_SHIFT * 0.72;
        const direction = distance > 0.01 ? 1 / distance : 0;
        const targetX = dx * direction * shift;
        const targetY = dy * direction * shift;
        const currentX = Number(group.dataset.shiftX || 0);
        const currentY = Number(group.dataset.shiftY || 0);
        const nextX = currentX + (targetX - currentX) * 0.2;
        const nextY = currentY + (targetY - currentY) * 0.2;
        const targetOpacity = 0.13 + influence * 0.29;
        const previousOpacity = Number(group.style.opacity || 0.13);
        const nextOpacity = previousOpacity + (targetOpacity - previousOpacity) * 0.2;
        group.dataset.shiftX = String(nextX);
        group.dataset.shiftY = String(nextY);
        group.setAttribute("transform", `translate(${x + nextX} ${y + nextY})`);
        group.style.opacity = `${nextOpacity}`;
        if (Math.abs(targetX - nextX) > 0.05 || Math.abs(targetY - nextY) > 0.05 || Math.abs(targetOpacity - nextOpacity) > 0.005) moving = true;
      }
      if (moving) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const resetImmediately = () => {
      pointer = null;
      for (const dot of dotNodes) {
        dot.dataset.shiftX = "0";
        dot.dataset.shiftY = "0";
        dot.setAttribute("transform", "translate(0 0)");
        dot.style.opacity = "0.17";
      }
      for (const group of marks) {
        group.dataset.shiftX = "0";
        group.dataset.shiftY = "0";
        group.setAttribute("transform", `translate(${group.dataset.x} ${group.dataset.y})`);
        group.style.opacity = "0.13";
      }
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const onPointerMove = (event) => {
      if (event.pointerType === "touch" || motionQuery.matches || coarseQuery.matches) return;
      const bounds = field.getBoundingClientRect();
      pointer = [event.clientX - bounds.left, event.clientY - bounds.top];
      schedule();
    };
    const onPointerLeave = (event) => {
      if (event.pointerType === "touch") return;
      pointer = null;
      schedule();
    };
    const onMotionChange = () => {
      if (motionQuery.matches) {
        resetImmediately();
        return;
      }
      schedule();
    };
    const onWindowBlur = () => resetImmediately();

    rebuild();
    const observer = new ResizeObserver(rebuild);
    observer.observe(field);
    eventTarget.addEventListener("pointermove", onPointerMove, { passive: true });
    eventTarget.addEventListener("pointerleave", onPointerLeave, { passive: true });
    eventTarget.addEventListener("pointercancel", onPointerLeave, { passive: true });
    window.addEventListener("blur", onWindowBlur);
    motionQuery.addEventListener?.("change", onMotionChange);
    coarseQuery.addEventListener?.("change", onMotionChange);
    return () => {
      observer.disconnect();
      eventTarget.removeEventListener("pointermove", onPointerMove);
      eventTarget.removeEventListener("pointerleave", onPointerLeave);
      eventTarget.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("blur", onWindowBlur);
      motionQuery.removeEventListener?.("change", onMotionChange);
      coarseQuery.removeEventListener?.("change", onMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={fieldRef} className="new-task-home__dot-field home-compute-backdrop" aria-hidden="true">
      <svg ref={svgRef} className="home-compute-backdrop__svg" preserveAspectRatio="none">
        <g className="home-compute-backdrop__dots" />
        {computeMarks.map(({ className, Icon, size }) => (
          <g
            className={`home-compute-backdrop__mark ${className}`}
            key={className}
          >
            <Icon x={-size / 2} y={-size / 2} size={size} stroke={1.45} />
          </g>
        ))}
        <g className="home-compute-backdrop__mark is-index">
          <text className="home-compute-backdrop__token" x="0" y="14">[2, 0, 1]</text>
        </g>
        <g className="home-compute-backdrop__mark is-sum">
          <text className="home-compute-backdrop__token" x="0" y="14">a + b</text>
        </g>
      </svg>
    </div>
  );
}
