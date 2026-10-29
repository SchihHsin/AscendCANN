import { useEffect, useRef } from "react";
import "./log-triage-workspace.css";

const FORMAT_LAB_LIGHT_URL = "./format-lab/index.html?theme=light";
const FORMAT_LAB_INTERACTION = "ascend-format-lab-interaction";

export const INITIAL_LOG_TRIAGE_STATE = Object.freeze({ diagramInteracted: false, experienceReady: false });

export function LogTriageWorkspace({ state = INITIAL_LOG_TRIAGE_STATE, onStateChange = () => {}, onCommunityExperienceReady, communityReady = false }) {
  const { diagramInteracted = false, experienceReady = false } = { ...INITIAL_LOG_TRIAGE_STATE, ...state };
  const frameRef = useRef(null);
  const experienceOffered = useRef(Boolean(diagramInteracted || experienceReady || communityReady));

  useEffect(() => {
    if (diagramInteracted || experienceReady || communityReady) {
      experienceOffered.current = true;
      return undefined;
    }

    const handleMessage = event => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.type !== FORMAT_LAB_INTERACTION ||
        experienceOffered.current
      ) return;

      experienceOffered.current = true;
      onStateChange(previous => ({ ...INITIAL_LOG_TRIAGE_STATE, ...previous, diagramInteracted: true, experienceReady: true }));
      onCommunityExperienceReady?.({
        id: "demo-addcustom-log-diagnostic-exploration",
        kind: "addcustom-log-diagnostic-exploration",
        demoFixture: true,
        rows: 17,
        columns: 33,
        tileSize: 32,
        completionText: "已查看并操作浅色 Format Lab 图解。它提供排查方向；真实根因、代码修改与目标环境验证仍待补充。",
      });
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [diagramInteracted, experienceReady, communityReady, onCommunityExperienceReady, onStateChange]);

  return <section className="log-triage-shell" aria-label="交互式 Format Lab">
    <iframe
      ref={frameRef}
      className="log-triage-format-lab-frame"
      src={FORMAT_LAB_LIGHT_URL}
      title="Format Lab · Layout Model（浅色模式）"
      loading="eager"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  </section>;
}

export default LogTriageWorkspace;
