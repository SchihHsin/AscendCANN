import {
  IconBinary,
  IconBrackets,
  IconCode,
  IconCpu,
  IconGridDots,
  IconMathFunction,
} from "@tabler/icons-react";
import "./home-compute-backdrop.css";

const computeMarks = [
  { className: "is-matrix", Icon: IconGridDots, size: 32, label: "矩阵" },
  { className: "is-binary", Icon: IconBinary, size: 27, label: "二进制" },
  { className: "is-function", Icon: IconMathFunction, size: 30, label: "算子" },
  { className: "is-chip", Icon: IconCpu, size: 34, label: "计算芯片" },
  { className: "is-brackets", Icon: IconBrackets, size: 28, label: "张量结构" },
  { className: "is-code", Icon: IconCode, size: 25, label: "代码" },
];

export function HomeComputeBackdrop() {
  return (
    <div className="new-task-home__dot-field home-compute-backdrop" aria-hidden="true">
      {computeMarks.map(({ className, Icon, size, label }) => (
        <span className={`home-compute-backdrop__mark ${className}`} key={className}>
          <Icon size={size} stroke={1.45} aria-label={label} />
        </span>
      ))}
      <span className="home-compute-backdrop__token is-index">[2, 0, 1]</span>
      <span className="home-compute-backdrop__token is-sum">a + b</span>
    </div>
  );
}
