import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconMicrophone, IconMicrophoneOff, IconPointer2, IconSend, IconX } from "@tabler/icons-react";

const isFnKey = (event) => event.key === "Fn" || event.code === "Fn";
const isControlKey = (event) => event.key === "Control" || event.code === "ControlLeft" || event.code === "ControlRight";
const DEMO_TRANSCRIPT = "结合我选中的区域，解释一下这里的内容，并告诉我下一步该关注什么。";
const VOICE_WAVE_HEIGHTS = [9, 15, 22, 12, 27, 18, 31, 15, 24, 34, 18, 28, 14, 25, 17, 30, 12, 21, 10];

export const getAreaVoiceShortcutLabel = () => {
  if (typeof navigator === "undefined") return "Ctrl";
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  return /mac|iphone|ipad/i.test(platform) ? "Fn" : "Ctrl";
};

export function AreaComposer({ context, sourceRef, disabled = false, onSend, onDismiss }) {
  const composerRef = useRef(null);
  const textareaRef = useRef(null);
  const thumbnailRef = useRef(null);
  const voiceTimerRef = useRef(null);
  const voiceIndexRef = useRef(0);
  const draftRef = useRef("");
  const listeningRef = useRef(false);
  const disabledRef = useRef(disabled);
  const voiceBaseRef = useRef("");
  const [draft, setDraft] = useState("");
  const [position, setPosition] = useState({ left: 12, top: 12 });
  const [listening, setListening] = useState(false);
  const voiceShortcut = getAreaVoiceShortcutLabel();
  disabledRef.current = disabled;

  const updateDraft = (value) => {
    draftRef.current = value;
    setDraft(value);
  };

  const stopVoice = () => {
    if (voiceTimerRef.current !== null) {
      window.clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    if (listeningRef.current) {
      listeningRef.current = false;
      setListening(false);
    }
  };

  const startVoice = () => {
    if (listeningRef.current || disabledRef.current) return;
    listeningRef.current = true;
    setListening(true);
    const existingDraft = draftRef.current.trimEnd();
    voiceBaseRef.current = existingDraft ? `${existingDraft} ` : "";
    voiceIndexRef.current = 0;
    voiceTimerRef.current = window.setInterval(() => {
      const nextIndex = Math.min(voiceIndexRef.current + 1, DEMO_TRANSCRIPT.length);
      voiceIndexRef.current = nextIndex;
      updateDraft(`${voiceBaseRef.current}${DEMO_TRANSCRIPT.slice(0, nextIndex)}`);
      if (nextIndex >= DEMO_TRANSCRIPT.length && voiceTimerRef.current !== null) {
        window.clearInterval(voiceTimerRef.current);
        voiceTimerRef.current = null;
      }
    }, 45);
  };

  useLayoutEffect(() => {
    const composer = composerRef.current;
    const stage = composer?.offsetParent;
    if (!composer || !stage) return undefined;

    const placeNearSelection = () => {
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;
      const width = composer.offsetWidth;
      const height = composer.offsetHeight;
      const selection = context.selection;
      if (!stageWidth || !stageHeight || !selection) return;

      const leftEdge = selection.left * stageWidth;
      const rightEdge = (selection.left + selection.width) * stageWidth;
      const topEdge = selection.top * stageHeight;
      const bottomEdge = (selection.top + selection.height) * stageHeight;
      const left = Math.max(12, Math.min(stageWidth - width - 12, (leftEdge + rightEdge - width) / 2));
      const belowSpace = stageHeight - bottomEdge - 10;
      const aboveSpace = topEdge - 10;
      const preferredTop = belowSpace >= height || belowSpace >= aboveSpace
        ? bottomEdge + 10
        : topEdge - height - 10;
      const top = Math.max(8, Math.min(stageHeight - height - 8, preferredTop));
      setPosition((current) => current.left === left && current.top === top ? current : { left, top });
    };

    placeNearSelection();
    const frame = window.requestAnimationFrame(() => textareaRef.current?.focus({ preventScroll: true }));
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(placeNearSelection);
    observer?.observe(stage);
    observer?.observe(composer);
    window.addEventListener("resize", placeNearSelection);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", placeNearSelection);
    };
  }, [context]);

  useLayoutEffect(() => {
    const thumbnail = thumbnailRef.current;
    const source = sourceRef?.current;
    const selection = context?.selection;
    const sourceRect = source?.getBoundingClientRect();
    if (!thumbnail || !source || !selection || !sourceRect?.width || !sourceRect?.height) return undefined;

    const thumbnailWidth = Math.max(1, thumbnail.clientWidth);
    const thumbnailHeight = Math.max(1, thumbnail.clientHeight);
    const cropWidth = sourceRect.width * selection.width;
    const cropHeight = sourceRect.height * selection.height;
    if (!cropWidth || !cropHeight) return undefined;

    const workspaceSnapshot = source.parentElement?.cloneNode(false);
    const stageSnapshot = source.cloneNode(true);
    if (!workspaceSnapshot || !stageSnapshot) return undefined;

    const sourceElements = [source, ...source.querySelectorAll("*")];
    const snapshotElements = [stageSnapshot, ...stageSnapshot.querySelectorAll("*")];
    sourceElements.forEach((element, index) => {
      const snapshot = snapshotElements[index];
      if (!snapshot) return;
      snapshot.scrollTop = element.scrollTop;
      snapshot.scrollLeft = element.scrollLeft;
      if (element instanceof HTMLInputElement && snapshot instanceof HTMLInputElement) {
        snapshot.checked = element.checked;
        if (element.type !== "file") snapshot.value = element.value;
      } else if (element instanceof HTMLTextAreaElement && snapshot instanceof HTMLTextAreaElement) {
        snapshot.value = element.value;
      } else if (element instanceof HTMLSelectElement && snapshot instanceof HTMLSelectElement) {
        snapshot.selectedIndex = element.selectedIndex;
      } else if (element instanceof HTMLCanvasElement && snapshot instanceof HTMLCanvasElement) {
        snapshot.width = element.width;
        snapshot.height = element.height;
        try { snapshot.getContext("2d")?.drawImage(element, 0, 0); } catch { /* Keep the surrounding UI if a canvas cannot be copied. */ }
      }
    });

    stageSnapshot.querySelectorAll(".tw-area-select-layer, .tw-area-selection-preview, .tw-area-composer, .tw-area-mode-hint, script, [hidden]").forEach((element) => element.remove());
    workspaceSnapshot.replaceChildren(stageSnapshot);
    workspaceSnapshot.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    workspaceSnapshot.setAttribute("aria-hidden", "true");
    workspaceSnapshot.inert = true;

    const scale = Math.min(thumbnailWidth / cropWidth, thumbnailHeight / cropHeight);
    const offsetX = (thumbnailWidth - cropWidth * scale) / 2 - sourceRect.width * selection.left * scale;
    const offsetY = (thumbnailHeight - cropHeight * scale) / 2 - sourceRect.height * selection.top * scale;
    Object.assign(workspaceSnapshot.style, {
      position: "absolute",
      left: `${offsetX}px`,
      top: `${offsetY}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`,
      minWidth: "0",
      minHeight: "0",
      overflow: "hidden",
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      pointerEvents: "none",
      userSelect: "none",
    });
    thumbnail.replaceChildren(workspaceSnapshot);
    return () => thumbnail.replaceChildren();
  }, [context, sourceRef]);

  useEffect(() => {
    const isVoiceShortcut = (event) => isFnKey(event) || (voiceShortcut === "Ctrl" && isControlKey(event));
    const startOnPress = (event) => {
      if (!isVoiceShortcut(event) || event.repeat || event.isComposing) return;
      event.preventDefault();
      startVoice();
    };
    const stopOnRelease = (event) => {
      if (isVoiceShortcut(event) && listeningRef.current) stopVoice();
    };
    const stopWhenHidden = () => {
      if (document.visibilityState === "hidden" && listeningRef.current) stopVoice();
    };
    const stopWhenBlurred = () => {
      if (listeningRef.current) stopVoice();
    };
    window.addEventListener("keydown", startOnPress, true);
    window.addEventListener("keyup", stopOnRelease, true);
    window.addEventListener("blur", stopWhenBlurred);
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => {
      window.removeEventListener("keydown", startOnPress, true);
      window.removeEventListener("keyup", stopOnRelease, true);
      window.removeEventListener("blur", stopWhenBlurred);
      document.removeEventListener("visibilitychange", stopWhenHidden);
      if (voiceTimerRef.current !== null) window.clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
      listeningRef.current = false;
    };
  }, [voiceShortcut]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = draftRef.current.trim();
    if (!text || disabled || !onSend) return;
    stopVoice();
    if (onSend(text, context)) updateDraft("");
  };

  return <form ref={composerRef} className="composer tw-area-composer" style={{ left: position.left, top: position.top }} onSubmit={handleSubmit} aria-label="描述选中的工作区区域">
    <div className="composer-context-chips">
      <span className="attachment-chip point-context-chip"><span ref={thumbnailRef} className="point-context-thumbnail" role="img" aria-label={`已选区域缩略图${context.contentTitle ? `：${context.contentTitle}` : ""}`} title={context.contentTitle || "已选区域"} /><span className="point-context-label">已选区域</span><button type="button" aria-label="移除已选区域" onClick={onDismiss}><IconX size={12} /></button></span>
    </div>
    <textarea ref={textareaRef} value={draft} onChange={(event) => updateDraft(event.target.value)} onBlur={() => { if (listeningRef.current) stopVoice(); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); handleSubmit(event); } }} placeholder="描述你希望我关注这个区域的什么…" aria-label="描述选中的工作区区域" rows={1} />
    <div className="composer-toolbar">
      <div className="composer-tools">
        <span className={`tw-area-voice-hint${listening ? " is-listening" : ""}`} role="status">
          {listening ? <><IconMicrophoneOff size={13} />松开 <kbd>{voiceShortcut}</kbd> 结束语音输入</> : <><IconMicrophone size={13} />按住 <kbd>{voiceShortcut}</kbd> 语音输入</>}
        </span>
      </div>
      <div className="composer-submit">
        <button className="send-button" type="submit" aria-label="发送区域描述" disabled={disabled || !draft.trim()}><IconSend size={17} /></button>
      </div>
    </div>
    {listening && typeof document !== "undefined" && createPortal(
      <div className="tw-voice-wave-capsule" role="status" aria-label="语音输入中" aria-live="polite">
        <div className="tw-voice-wave" aria-hidden="true">
          {VOICE_WAVE_HEIGHTS.map((height, index) => <span key={index} style={{ height, "--wave-delay": `${(index % 7) * -0.11}s` }} />)}
        </div>
      </div>,
      document.body,
    )}
  </form>;
}

export default AreaComposer;
