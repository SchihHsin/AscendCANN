import { ICON_SIZE } from "./icon-system.js";
import { IconArrowLeft, IconBook, IconCode, IconLayoutBoard, IconPhoto } from "@tabler/icons-react";
import OfficialLearningVisuals from "./OfficialLearningVisuals";
import { OfficialLesson, OfficialPractice, OfficialSources } from "./OfficialLearningActivities";
import "./official-learning-material.css";

const hasPractice = node => ["preprocess", "contract", "execution", "summary"].includes(node?.visual);

export function OfficialLearningMaterial({ node, journey, onAsk, onCopy, onReturnToCanvas }) {
  if (!node || node.kind !== "step") return null;
  return <article className="og-full-material" aria-label={`${node.title}完整内容`}>
    <header className="og-full-material-header">
      <div>
        <span className="og-full-material-path">{node.courseTitle || "ResNet50 图像推理"}</span>
        <h2>{node.title}</h2>
        <p>{node.summary}</p>
      </div>
      <button className="og-full-return" type="button" onClick={onReturnToCanvas}>
        <IconArrowLeft size={ICON_SIZE.inline} />返回学习画布<IconLayoutBoard size={ICON_SIZE.inline} />
      </button>
    </header>
    <div className="og-full-material-sections">
      <section className="og-full-material-section" aria-label="节点图解">
        <header><IconPhoto size={ICON_SIZE.heading} /><h3>图解</h3></header>
        <OfficialLearningVisuals node={node} journey={journey} />
      </section>
      <section className="og-full-material-section" aria-label="视频讲解与理解检查">
        <header><IconBook size={ICON_SIZE.heading} /><h3>讲解与理解检查</h3></header>
        <OfficialLesson node={node} journey={journey} onAsk={onAsk} onCopy={onCopy} />
        <OfficialSources node={node} journey={journey} />
      </section>
      {hasPractice(node) && <section className="og-full-material-section" aria-label="动手练习与检查">
        <header><IconCode size={ICON_SIZE.heading} /><h3>{node.visual === "summary" ? "学习记录与成果" : "动手练习与本次检查"}</h3></header>
        <OfficialPractice node={node} journey={journey} onCopy={onCopy} />
      </section>}
    </div>
  </article>;
}

export default OfficialLearningMaterial;
