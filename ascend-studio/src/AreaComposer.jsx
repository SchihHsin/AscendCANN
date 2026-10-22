import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconMicrophone, IconMicrophoneOff, IconPointer2, IconSend, IconX } from "@tabler/icons-react";

const describeSpeechError = (code) => {
  if (code === "not-allowed" || code === "service-not-allowed") return "麦克风权限未开启";
  if (code === "no-speech") return "没有识别到语音，再试一次";
  if (code === "audio-capture") return "未检测到可用麦克风";
  return "语音输入暂不可用";
};

const isFnKey = (event) => event.key === "Fn" || event.code === "Fn";

export function AreaComposer({ context, disabled = false, onSend, onDismiss }) {
  const composerRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const draftRef = useRef("");
  const listeningRef = useRef(false);
  const voiceBaseRef = useRef("");
  const [draft, setDraft] = useState("");
  const [position, setPosition] = useState({ left: 12, top: 12 });
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  const updateDraft = (value) => {
    draftRef.current = value;
    setDraft(value);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop?.();
  };

  const startVoice = () => {
    if (listeningRef.current) return;
    setVoiceError("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("当前浏览器不支持语音识别");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;
    listeningRef.current = true;
    voiceBaseRef.current = draftRef.current.trim();
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join("").trim();
      if (transcript) updateDraft([voiceBaseRef.current, transcript].filter(Boolean).join(" "));
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") setVoiceError(describeSpeechError(event.error));
      listeningRef.current = false;
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      listeningRef.current = false;
      setListening(false);
      recognitionRef.current = null;
    };
    try {
      recognition.start();
    } catch {
      listeningRef.current = false;
      setListening(false);
      recognitionRef.current = null;
      setVoiceError("语音输入暂不可用");
    }
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

  useEffect(() => {
    const stopOnRelease = (event) => {
      if (isFnKey(event) && listeningRef.current) stopVoice();
    };
    const stopWhenHidden = () => {
      if (document.visibilityState === "hidden" && listeningRef.current) stopVoice();
    };
    window.addEventListener("keyup", stopOnRelease);
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => {
      window.removeEventListener("keyup", stopOnRelease);
      document.removeEventListener("visibilitychange", stopWhenHidden);
      recognitionRef.current?.abort?.();
      recognitionRef.current = null;
    };
  }, []);

  const handleKeyDown = (event) => {
    if (!isFnKey(event) || event.repeat || event.nativeEvent?.isComposing) return;
    event.preventDefault();
    startVoice();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = draftRef.current.trim();
    if (!text || disabled || !onSend) return;
    if (onSend(text, context)) updateDraft("");
  };

  return <form ref={composerRef} className="composer tw-area-composer" style={{ left: position.left, top: position.top }} onSubmit={handleSubmit} onKeyDown={handleKeyDown} aria-label="描述选中的工作区区域">
    <div className="composer-context-chips">
      <span className="attachment-chip point-context-chip"><IconPointer2 size={13} /><span>工作区区域 · {context.label}</span><button type="button" aria-label="取消区域输入" onClick={onDismiss}><IconX size={12} /></button></span>
    </div>
    <textarea ref={textareaRef} value={draft} onChange={(event) => updateDraft(event.target.value)} onBlur={() => { if (listeningRef.current) stopVoice(); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); handleSubmit(event); } }} placeholder="描述你希望我关注这个区域的什么…" aria-label="描述选中的工作区区域" rows={1} />
    <div className="composer-toolbar">
      <div className="composer-tools">
        <span className={`tw-area-voice-hint${listening ? " is-listening" : ""}`} role="status">
          {listening ? <><IconMicrophoneOff size={13} />松开 <kbd>Fn</kbd> 结束语音输入</> : voiceError ? voiceError : <><IconMicrophone size={13} />按住 <kbd>Fn</kbd> 语音输入</>}
        </span>
      </div>
      <div className="composer-submit">
        <button className="send-button" type="submit" aria-label="发送区域描述" disabled={disabled || !draft.trim()}><IconSend size={17} /></button>
      </div>
    </div>
  </form>;
}

export default AreaComposer;
