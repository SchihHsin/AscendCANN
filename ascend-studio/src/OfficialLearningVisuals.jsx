import { useState } from "react";
import { IconArrowDown, IconArrowRight, IconBinaryTree2, IconBraces, IconCheck, IconCpu, IconDatabase, IconDeviceDesktop, IconFileCode, IconFileTypeJpg, IconFolder, IconLayersIntersect, IconPhoto, IconServer, IconStack2 } from "@tabler/icons-react";
import { ChannelPhoto, TensorShape } from "./LearningHierarchyCanvas";
import { OFFICIAL_LEARNING_STAGES } from "./official-learning-data";
import { OFFICIAL_VIDEO_CHAPTERS, officialVideoChapterIndex } from "./official-learning-video";

const asset = name => `${import.meta.env.BASE_URL}assets/${name}`;
const scoreRows = [{ title: "猫", value: 86 }, { title: "虎", value: 9 }, { title: "狗", value: 5 }];
const stepIndex = (journey, count) => Math.min(count - 1, Math.floor(journey.state.time / 45 * count));

function Device({ active }) {
  return <div className={`og-chip${active ? " is-active" : ""}`}><div className="og-chip-pins" /><IconCpu size={38} stroke={1.15} /><strong>Ascend Device</strong><div className="og-chip-matrix">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ "--cell": i }} />)}</div></div>;
}

function Classification({ node, journey }) {
  const [top, setTop] = useState(3);
  const detection = node.id.includes("object-detection");
  const current = stepIndex(journey, 3);
  return <div className="og-classification">
    <div className="og-visual-path"><div className={`og-image-input${current === 0 ? " is-active" : ""}`}><img src={asset("inference-input-cat.png")} alt="图像分类教学示例中的猫" />{detection && <div className="og-detection-box"><span>猫 · 位置示意</span></div>}<span>01 · 一张输入图片</span></div><div className="og-data-arrow"><span>图像数据</span><IconArrowRight size={26} /></div><button type="button" className={`og-model-visual${current === 1 ? " is-active" : ""}`} onClick={() => journey.actions.seek(15)} aria-label="查看分类模型在链路中的作用"><div className="og-feature-maps">{[0, 1, 2, 3].map(i => <span key={i} style={{ "--plane": i }} />)}</div><strong>{detection ? "检测模型" : "ResNet50"}</strong><small>{detection ? "目标定位 → 类别判断" : "特征提取 → 分类输出"}</small></button><div className="og-data-arrow"><span>输出数据</span><IconArrowRight size={26} /></div><div className={`og-score-output${current === 2 ? " is-active" : ""}`}><span className="og-diagram-label">{detection ? "类别 + 位置" : "分类输出示意"}</span>{scoreRows.slice(0, top).map(row => <div className="og-score-row" key={row.title}><span>{row.title}</span><i><b style={{ width: `${row.value}%` }} /></i><code>{row.value}</code></div>)}<div className="og-inline-options"><button type="button" aria-pressed={top === 1} onClick={() => setTop(1)}>Top 1</button><button type="button" aria-pressed={top === 3} onClick={() => setTop(3)}>Top 3</button></div></div></div>
    <p className="og-diagram-caption">{detection ? "分类判断整图类别；目标检测还需要给出目标位置。框与数值均为概念示意。" : "图像、模型和分类结果构成一条完整链路。右侧使用示意分数讲解结果含义。"}</p>
  </div>;
}

function Architecture({ journey }) {
  const active = stepIndex(journey, 3);
  const explanations = ["应用决定处理哪张图片、使用哪个模型，以及怎样解释结果。", "AscendCL 提供资源、内存与模型执行等接口，将应用调用连接到设备能力。", "设备执行计算；输入数据和输出数据仍由应用按模型约定管理。"];
  return <><div className="og-architecture"><div className="og-host"><span className="og-zone-label"><IconDeviceDesktop size={15} />Host · 应用侧</span><button type="button" className={`og-app-block${active === 0 ? " is-active" : ""}`} onClick={() => journey.actions.seek(0)}><IconBraces size={28} /><div><strong>图像分类应用</strong><small>读取图片 · 控制流程 · 展示结果</small></div></button><IconArrowDown className="og-down" size={22} /><button type="button" className={`og-acl-bridge${active === 1 ? " is-active" : ""}`} onClick={() => journey.actions.seek(15)}><strong>AscendCL</strong><div><span>运行资源</span><span>内存与数据</span><span>模型执行</span></div></button></div><div className={`og-transport${journey.state.playing ? " is-playing" : ""}`}><span>输入数据 / 执行调用</span><div><i /><IconArrowRight size={28} /></div><div><IconArrowRight size={28} className="og-return-arrow" /><i /></div><span>输出数据 / 执行状态</span></div><button type="button" className="og-device-zone" onClick={() => journey.actions.seek(30)} aria-label="查看昇腾设备的职责"><Device active={active === 2} /><small>计算与设备内存</small></button></div><div className="og-visual-explanation"><span>{String(active + 1).padStart(2, "0")}</span>{explanations[active]}</div></>;
}

function Environment({ journey }) {
  const [selected, setSelected] = useState(2);
  const layers = [{ title: "样例应用与模型", subtitle: "代码、模型和输入文件", icon: IconFileCode, command: "查看官方样例的 README 与模型说明" }, { title: "CANN / AscendCL", subtitle: "工具包与运行时版本", icon: IconStack2, command: "核对 toolkit / runtime 与样例要求" }, { title: "驱动、固件与系统", subtitle: "设备可见性与系统架构", icon: IconServer, command: "npu-smi info" }];
  return <div className="og-environment"><div className="og-layer-stack">{layers.map((item, i) => { const Icon = item.icon; return <button key={item.title} type="button" aria-pressed={selected === i} className={selected === i ? "is-active" : ""} onClick={() => { setSelected(i); journey.actions.seek(i * 15); }}><Icon size={23} /><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><i>{i + 1}</i></button>; })}<div className="og-hardware-base"><IconCpu size={23} /><span>目标昇腾设备</span></div></div><div className="og-environment-note"><span className="og-diagram-label">选中层的检查入口</span><h3>{layers[selected].title}</h3><p>先把实际版本与适用条件对上，再进入样例。点击左侧不同层查看它在环境中的位置。</p><pre><code>{layers[selected].command}</code></pre><small>此处是检查指引，尚未读取你的设备。</small></div></div>;
}

function Files() {
  const [selected, setSelected] = useState(1);
  const files = [{ name: "README / 运行说明", icon: IconFileCode, label: "复现入口", detail: "先看适用环境、依赖、构建和运行步骤，把实际目录与参数对上。" }, { name: "model / 模型文件", icon: IconDatabase, label: "推理模型", detail: "核对模型来源、格式和输入输出说明；模型文件与程序代码分别承担不同职责。" }, { name: "data / 输入图片", icon: IconFileTypeJpg, label: "这次推理的输入", detail: "同一张输入图片贯穿预处理、执行和结果核对，便于复查。" }, { name: "src / 应用代码", icon: IconFileCode, label: "应用控制流程", detail: "在代码中找到初始化、模型加载、输入准备、执行与收尾位置。" }];
  return <div className="og-files"><div className="og-file-tree"><div><IconFolder size={18} /><strong>官方样例 · 目录结构示意</strong></div>{files.map((file, i) => { const Icon = file.icon; return <button type="button" key={file.name} className={selected === i ? "is-active" : ""} onClick={() => setSelected(i)}><Icon size={19} /><span>{file.name}</span><IconArrowRight size={14} /></button>; })}</div><div className="og-file-preview"><IconFolder size={42} stroke={1.25} /><span className="og-diagram-label">{files[selected].label}</span><h3>{files[selected].name}</h3><p>{files[selected].detail}</p><small>实际文件名与目录以所选官方样例为准。</small></div></div>;
}

function ImageInput({ journey, node }) {
  const [channel, setChannel] = useState("all");
  const active = stepIndex(journey, 3);
  const exercise = ["preprocess","contract"].includes(node.visual);
  const axes = exercise ? journey.state.input.axes : [2,0,1];
  const batch = exercise ? journey.state.input.batch : true;
  const valid = axes.length === 3 && new Set(axes).size === 3 && axes.every(i => [0,1,2].includes(i));
  const dims = valid ? [...(batch ? [1] : []), ...axes.map(i => [224,224,3][i])] : [];
  return <><div className="og-input-diagram"><figure className="lh-source-image"><img src={asset("inference-input-cat.png")} alt="用于理解图像预处理的猫照片" /><div className="lh-channel-images">{["R","G","B"].map((c, i) => <button type="button" key={c} aria-label={`查看${c}通道`} aria-pressed={channel === c} onClick={() => { setChannel(channel === c ? "all" : c); journey.actions.seek(0); }}><ChannelPhoto channel={i} /><span>{c}</span></button>)}</div><figcaption>教学图片 · RGB / HWC</figcaption></figure><div className="og-tensor-path"><TensorShape kind="hwc" label="HWC" dimensions="[224, 224, 3]" active={active === 0} /><button className={`og-transform${active === 1 ? " is-active" : ""}`} type="button" onClick={() => journey.actions.seek(15)}><code>transpose</code><b>({axes.join(", ")})</b>{batch && <small>+ batch N=1</small>}<IconArrowRight size={24} /></button><TensorShape kind={axes.join(",") === "0,1,2" ? "hwc" : batch ? "nchw" : "chw"} label={valid ? `${batch ? "N" : ""}${axes.map(i => ["H","W","C"][i]).join("")}` : "待调整"} dimensions={valid ? `[${dims.join(", ")}]` : "轴顺序待调整"} active={active === 2} /></div></div><div className="og-visual-explanation"><IconPhoto size={17} />{channel === "all" ? "同一张照片的三个颜色通道组成像素；调整练习参数时，右侧形状同步变化。" : `${channel} 通道展示这张图片在对应颜色分量上的像素。`}</div><p className="og-diagram-caption">此图复用原路径的 RGB 维度教学示例；ResNet50 实验的颜色、布局与类型另按所选模型核对。{node.visual === "contract" ? " 逐项核对：颜色 / 尺寸 / 布局 / 数据类型。" : ""}</p></>;
}

const apiSteps = [
  { title:"准备运行资源", api:"aclInit / aclrtSetDevice", detail:"初始化运行环境，再按样例建立执行所需资源。" },
  { title:"加载模型与输入", api:"aclmdlLoadFromFile", detail:"把模型文件与准备好的输入数据放到对应的模型/数据对象。" },
  { title:"执行模型", api:"aclmdlExecute", detail:"在输入与输出数据对象就绪后提交模型执行。" },
  { title:"读取输出与释放", api:"输出解析 / 资源清理", detail:"解释模型输出，并在退出路径清理实际创建的资源。" },
];
function Execution({ node, journey }) {
  const selected = officialVideoChapterIndex(journey.state.time);
  const lifecycle = node.visual === "lifecycle";
  return <><div className="og-execution"><div className="og-api-lane"><span className="og-zone-label"><IconDeviceDesktop size={15} />应用调用与数据流</span>{apiSteps.map((step, i) => <button className={i === selected ? "is-active" : ""} type="button" key={step.title} onClick={() => journey.actions.seek(OFFICIAL_VIDEO_CHAPTERS[i].start)}><i>{lifecycle && i === 3 ? <IconCheck size={14} /> : i + 1}</i><span><strong>{step.title}</strong><code>{step.api}</code></span>{i < 3 && <IconArrowDown size={16} />}</button>)}</div><div className="og-execution-device"><div className="og-model-file"><IconDatabase size={27} /><span>模型 + 输入数据</span></div><div className={`og-execution-wire${journey.state.playing ? " is-playing" : ""}`}><i /><IconArrowDown size={28} /></div><Device active={selected === 2} /><div className="og-output-buffer"><IconLayersIntersect size={21} /><span>{lifecycle && selected === 3 ? "对应释放已创建的资源" : "输出缓冲区 → 后处理"}</span></div></div></div><div className="og-visual-explanation"><span>{String(selected + 1).padStart(2,"0")}</span>{apiSteps[selected].detail}</div></>;
}

function Results({ journey }) {
  const [showRaw, setShowRaw] = useState(false);
  return <><Classification node={{id:"result"}} journey={journey} /><div className="og-result-decoder"><button type="button" aria-pressed={showRaw} onClick={() => setShowRaw(!showRaw)}><IconBinaryTree2 size={18} />{showRaw ? "查看类别映射" : "查看输出如何变成类别"}<IconArrowRight size={16} /></button><code>{showRaw ? "输出向量 → 排序得到索引 → 读取标签映射 → 类别" : "模型输出经过后处理，才成为用户可读的分类结果。"}</code></div></>;
}

function Summary({ journey }) {
  return <div className="og-progress-map">{OFFICIAL_LEARNING_STAGES.map((stage, i) => { const complete = stage.children.filter(node => journey.state.statuses[node.id] === "completed").length; return <div key={stage.id}><span className={`og-progress-circle${complete === stage.children.length ? " is-complete" : ""}`} style={{"--progress": `${complete / stage.children.length * 100}%`}}><b>{complete === stage.children.length ? <IconCheck size={22} /> : i + 1}</b></span><strong>{stage.title}</strong><small>{complete} / {stage.children.length} 个学习动作</small></div>; })}</div>;
}

export default function OfficialLearningVisuals({ node, journey }) {
  let content;
  if (node.visual === "classification") content = <Classification node={node} journey={journey} />;
  else if (node.visual === "architecture") content = <Architecture journey={journey} />;
  else if (node.visual === "environment") content = <Environment journey={journey} />;
  else if (node.visual === "files") content = <Files />;
  else if (["image","preprocess","contract"].includes(node.visual)) content = <ImageInput node={node} journey={journey} />;
  else if (node.visual === "results") content = <Results journey={journey} />;
  else if (node.visual === "summary") content = <Summary journey={journey} />;
  else content = <Execution node={node} journey={journey} />;
  return <div className="og-visual-body" aria-label={`${node.title}图解`}>{content}</div>;
}
