import { ICON_SIZE } from "./icon-system.js";
import { useEffect, useRef, useState } from "react";
import { IconMicrophone, IconMicrophoneOff } from "@tabler/icons-react";

function VoiceWaveIcon() {
  return <svg className="voice-wave-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 8v4M6.5 5v10M10 3v14M13.5 6v8M17 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}

const errorMessage = (code) => {
  if (code === "not-allowed" || code === "service-not-allowed") return "麦克风权限未开启";
  if (code === "no-speech") return "没有识别到语音，再试一次";
  if (code === "audio-capture") return "未检测到可用麦克风";
  return "语音输入暂不可用";
};

export function VoiceCaptureButton({ label = "语音输入", activeLabel = "停止", className = "", onStart, onTranscript, onStop, onListeningChange, waveform = false, iconOnly = false }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    recognitionRef.current?.abort?.();
    recognitionRef.current = null;
    onListeningChange?.(false);
  }, [onListeningChange]);

  const updateListening = (value) => {
    setListening(value);
    onListeningChange?.(value);
  };

  const stop = () => {
    recognitionRef.current?.stop?.();
    onStop?.();
  };

  const start = () => {
    setError("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("当前浏览器不支持语音识别");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    onStart?.();
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join("").trim();
      if (transcript) onTranscript?.(transcript);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") setError(errorMessage(event.error));
      updateListening(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      updateListening(false);
      recognitionRef.current = null;
    };
    try {
      recognition.start();
      updateListening(true);
    } catch {
      setError("语音输入暂不可用");
      updateListening(false);
      recognitionRef.current = null;
    }
  };

  return <>
    <button className={`${className} voice-capture-button${listening ? " is-listening" : ""}`.trim()} type="button" aria-label={listening ? activeLabel : label} aria-pressed={listening} onClick={listening ? stop : start} title={listening ? "停止语音识别" : label}>
      {listening ? <IconMicrophoneOff size={ICON_SIZE.inline} /> : waveform ? <VoiceWaveIcon /> : <IconMicrophone size={ICON_SIZE.inline} />}
      {!iconOnly && (listening ? activeLabel : label)}
    </button>
    {error && <span className="voice-capture-hint" role="status">{error}</span>}
  </>;
}

export default VoiceCaptureButton;
