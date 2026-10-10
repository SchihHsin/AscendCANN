import { useEffect, useRef, useState } from "react";

export const IMAGE_TASK = "图像推理调试";
export const IMAGE_MATERIALS = [
  { id: "image-source", type: "code", title: "preprocess.py · 只读示例" },
  { id: "image-explanation", type: "preview", title: "图像与张量图解" },
  { id: "image-practice", type: "code", title: "预处理练习副本" },
  { id: "image-attempts", type: "result", title: "形状检查与尝试" },
  { id: "image-diff", type: "diff", title: "预处理修改预览" },
  { id: "image-validation", type: "result", title: "返回任务核对" },
];
export const IMAGE_LESSON = [
  { time: 0, focus: "channels", title: "像素与三个通道", caption: "一张 RGB 图像由红、绿、蓝三个通道组成。每个像素都包含三个通道的值。" },
  { time: 20, focus: "layout", title: "维度顺序的变化", caption: "HWC 的形状是 [224,224,3]。transpose(2,0,1) 将通道轴移到前面，得到 CHW [3,224,224]。" },
  { time: 40, focus: "batch", title: "加入 batch 维度", caption: "在 CHW 前增加一个 batch 维度，得到 NCHW [1,3,224,224]，符合这个示例的输入约定。" },
];
export const imageSegmentAt = time => IMAGE_LESSON.findLast(item => time >= item.time) || IMAGE_LESSON[0];
const original = { axes: [0, 1, 2], batch: true };
export function imageShape(snapshot) {
  const valid = Array.isArray(snapshot.axes) && snapshot.axes.length === 3 && new Set(snapshot.axes).size === 3 && snapshot.axes.every(value => [0, 1, 2].includes(value));
  const axes = valid ? snapshot.axes : [0, 1, 2];
  const dimensions = axes.map(index => [224, 224, 3][index]);
  const labels = axes.map(index => ["H", "W", "C"][index]);
  return { valid, dimensions: snapshot.batch ? [1, ...dimensions] : dimensions, labels: snapshot.batch ? ["N", ...labels] : labels, passed: valid && snapshot.batch && axes.join() === "2,0,1" };
}
export function imageCode(snapshot = original) {
  return ["# 预处理示例 · 原项目文件未接入", "import numpy as np", "from PIL import Image", "", "image = np.asarray(Image.open(path).convert('RGB').resize((224, 224)))", `transformed = image.transpose(${snapshot.axes.join(", ")})`, snapshot.batch ? "input_data = transformed[None, ...]" : "input_data = transformed", "print(input_data.shape)"].join("\n");
}
const start = () => ({ ...original, axes: [...original.axes], attempts: [], selectedId: null, proposal: null, applied: null, undo: null, validation: null, focus: "layout", channel: "all", time: 0, playing: false, lessonOpen: false, exploring: false, pinned: null, notice: "", resetVersion: 0 });

export function useImageInference({ visible, onRecord }) {
  const [state, setState] = useState(start);
  const current = useRef(state);
  const callback = useRef(onRecord); callback.current = onRecord;
  current.current = state;
  const patch = change => setState(old => ({ ...old, ...(typeof change === "function" ? change(old) : change) }));
  useEffect(() => { if (!visible) patch({ playing: false }); }, [visible]);
  useEffect(() => {
    if (!visible || !state.playing || !state.lessonOpen) return;
    const timer = setInterval(() => patch(old => {
      const time = Math.min(60, old.time + .2);
      return { time, focus: imageSegmentAt(time).focus, playing: time < 60 };
    }), 200);
    return () => clearInterval(timer);
  }, [visible, state.playing, state.lessonOpen]);
  const record = (title, summary) => callback.current?.({ title, summary, kind: "image-practice", isDemo: true });
  const run = () => {
    const old = current.current;
    const snapshot = { axes: [...old.axes], batch: old.batch };
    const result = imageShape(snapshot);
    const attempt = { id: crypto.randomUUID(), time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Shanghai" }), snapshot, ...result, code: imageCode(snapshot) };
    patch(previous => ({ attempts: [...previous.attempts, attempt], selectedId: attempt.id, proposal: null, notice: result.valid ? "这次形状检查已保存。未执行 Python 或模型推理。" : "轴顺序必须包含 0、1、2，且每个轴只出现一次。已保留这次尝试。" }));
    return attempt;
  };
  const prepare = () => {
    const old = current.current;
    const attempt = old.attempts.find(item => item.id === old.selectedId) || old.attempts.at(-1);
    if (!attempt?.valid) { patch({ notice: "先完成一次有效轴顺序的形状检查，再查看修改预览。" }); return; }
    patch({ proposal: { attempt, baseline: old.applied?.snapshot || original }, notice: "提案对应所选尝试，仅应用到浏览器示例副本。" });
  };
  const apply = () => {
    const old = current.current;
    if (!old.proposal || imageCode(old.proposal.baseline) === old.proposal.attempt.code) return;
    patch({ applied: old.proposal.attempt, proposal: null, undo: { applied: old.applied, validation: old.validation }, validation: null, notice: "浏览器副本已更新；原项目未修改，模型推理尚未运行。" });
    record("图像预处理 · 应用示例修改", `轴顺序 ${old.proposal.attempt.snapshot.axes.join(",")}；形状 [${old.proposal.attempt.dimensions.join(",")} ]。仅浏览器副本，未写入项目。`);
  };
  const validate = () => {
    const old = current.current;
    if (!old.applied) return;
    const validation = { ...imageShape(old.applied.snapshot), snapshot: old.applied.snapshot, attemptId: old.applied.id };
    patch({ validation, notice: "已复核示例形状。模型文件、数据类型、归一化和设备推理仍需项目证据。" });
    record("图像推理 · 返回任务核对", `示例输入 [${validation.dimensions.join(",")}]，${validation.passed ? "符合" : "不符合"}示例约定 NCHW [1,3,224,224]。未执行 Python、模型或 NPU；需要核对真实模型签名与预处理。`);
  };
  return { state, actions: {
    axis: (index, value) => patch(old => ({ axes: old.axes.map((axis, i) => i === index ? Number(value) : axis), notice: "", playing: false, exploring: true, focus: "layout" })),
    batch: value => patch({ batch: value, notice: "", playing: false, exploring: true, focus: "batch" }),
    focus: focus => patch({ focus, playing: false }), channel: channel => patch({ channel, focus: "channels" }),
    correct: () => patch({ axes: [2, 0, 1], batch: true, focus: "layout", playing: false, exploring: true }),
    lesson: () => patch(old => ({ lessonOpen: !old.lessonOpen, playing: false, exploring: false })),
    seek: value => { const time = Math.max(0, Math.min(60, Number(value))); patch({ time, focus: imageSegmentAt(time).focus, exploring: false }); },
    play: () => patch(old => ({ playing: !old.playing, time: old.time >= 60 ? 0 : old.time, lessonOpen: true, exploring: false })),
    explore: () => patch({ playing: false, exploring: true }),
    pin: () => patch(old => ({ pinned: old.pinned ? null : { axes: old.lessonOpen && !old.exploring ? old.focus === "channels" ? [0, 1, 2] : [2, 0, 1] : [...old.axes], batch: old.lessonOpen && !old.exploring ? old.focus === "batch" : old.batch, focus: old.focus } })),
    run, select: selectedId => patch({ selectedId, proposal: null }), prepare, apply, validate,
    cancel: () => patch({ proposal: null, notice: "提案已取消，练习与尝试仍保留。" }),
    undo: () => { const old = current.current; if (old.undo) patch({ ...old.undo, undo: null, notice: "已撤销最近一次示例应用。" }); },
    save: attempt => record("图像预处理 · 形状尝试", `轴顺序 ${attempt.snapshot.axes.join(",")}；${attempt.valid ? `[${attempt.dimensions.join(",")}]，${attempt.passed ? "符合" : "不符合"}示例约定` : "轴顺序无效"}。仅形状演算，未执行推理。`),
    reset: () => setState(old => ({ ...start(), resetVersion: old.resetVersion + 1 })),
  } };
}
