import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const EXPLANATION_TITLE = "元素分块与尾块范围";
export const EXPLANATION_DURATION = 60;
export const EXPLANATION_SNAPSHOT = Object.freeze({ rows: "17", columns: "33", tileSize: "32", bounds: "full" });
export const EXPLANATION_SEGMENTS = [
  { time: 0, end: 20, focus: "total", title: "总元素如何分块", subtitle: "17 × 33 是 561 个元素。按每块 32 个元素分组，需要 18 个块。", concept: "总元素与分块", note: "17 个完整块，最后一个块留给剩余元素。" },
  { time: 20, end: 40, focus: "tail", title: "最后一块还剩多少", subtitle: "前 17 块覆盖 544 个元素。最后一块只有 17 个有效元素，不是 32 个。", concept: "尾块有效元素", note: "尾块从索引 544 开始，有效范围到 560。" },
  { time: 40, end: 60, focus: "access", title: "访问范围需要核对", subtitle: "如果最后一块仍访问 32 个元素，会涉及 15 个范围外索引。这个算例不能确认真实项目的根因。", concept: "访问边界", note: "图中比较整块访问与有效元素范围，真实循环仍需核对。" },
];

export function explanationSegmentAt(time) {
  return EXPLANATION_SEGMENTS.find((item) => time >= item.time && time < item.end) || EXPLANATION_SEGMENTS.at(-1);
}

const initialState = () => ({ focus: "total", videoOpen: false, playing: false, time: 0, mode: "read", pinned: false, pinnedSnapshot: null, pinnedFocus: "total" });
const knownFocus = (focus) => EXPLANATION_SEGMENTS.some((item) => item.focus === focus);
const safeTime = (time) => Math.max(0, Math.min(EXPLANATION_DURATION, Number.isFinite(Number(time)) ? Number(time) : 0));

export function useExplanationSession({ resetVersion = 0, visible = true } = {}) {
  const [state, setState] = useState(initialState);
  const lastReset = useRef(resetVersion);

  useEffect(() => {
    if (lastReset.current === resetVersion) return;
    lastReset.current = resetVersion;
    setState(initialState());
  }, [resetVersion]);

  useEffect(() => {
    if (!visible) setState((previous) => previous.playing ? { ...previous, playing: false } : previous);
  }, [visible]);

  useEffect(() => {
    if (!visible || !state.playing || !state.videoOpen || state.mode !== "lesson") return undefined;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const elapsed = (now - last) / 1000;
      last = now;
      setState((previous) => {
        if (!previous.playing || previous.mode !== "lesson") return previous;
        const time = safeTime(previous.time + elapsed);
        const segment = explanationSegmentAt(time);
        return { ...previous, time, focus: segment.focus, playing: time < EXPLANATION_DURATION };
      });
    }, 150);
    return () => clearInterval(timer);
  }, [visible, state.playing, state.videoOpen, state.mode]);

  const openAt = useCallback(({ focus, time, video = false } = {}) => {
    setState((previous) => {
      const selectedFocus = knownFocus(focus) ? focus : previous.focus;
      const nextTime = time === undefined ? (video ? EXPLANATION_SEGMENTS.find((item) => item.focus === selectedFocus)?.time ?? previous.time : previous.time) : safeTime(time);
      return { ...previous, focus: time === undefined ? selectedFocus : explanationSegmentAt(nextTime).focus, time: nextTime, videoOpen: Boolean(video), playing: false, mode: video ? "lesson" : "read" };
    });
  }, []);

  const focusConcept = useCallback((focus) => {
    if (!knownFocus(focus)) return;
    setState((previous) => {
      if (previous.pinned && previous.mode !== "explore") return { ...previous, pinnedFocus: focus };
      return { ...previous, focus, ...(previous.mode === "lesson" ? { time: EXPLANATION_SEGMENTS.find((item) => item.focus === focus).time, playing: false } : {}) };
    });
  }, []);
  const openVideo = useCallback(() => setState((previous) => {
    const focus = previous.pinned ? previous.pinnedFocus : previous.focus;
    const segment = EXPLANATION_SEGMENTS.find((item) => item.focus === focus);
    const time = explanationSegmentAt(previous.time).focus === focus ? previous.time : segment?.time ?? previous.time;
    return { ...previous, videoOpen: true, mode: "lesson", playing: false, time, focus };
  }), []);
  const closeVideo = useCallback(() => setState((previous) => ({ ...previous, videoOpen: false, playing: false, mode: previous.mode === "explore" ? "explore" : "read" })), []);
  const playPause = useCallback(() => setState((previous) => {
    if (previous.playing) return { ...previous, playing: false };
    const time = previous.time >= EXPLANATION_DURATION ? 0 : previous.time;
    return { ...previous, videoOpen: true, mode: "lesson", time, focus: explanationSegmentAt(time).focus, playing: true };
  }), []);
  const seek = useCallback((value) => {
    const time = safeTime(value);
    setState((previous) => ({ ...previous, time, mode: "lesson", videoOpen: true, focus: explanationSegmentAt(time).focus, playing: time < EXPLANATION_DURATION && previous.playing }));
  }, []);
  const pin = useCallback((snapshot) => setState((previous) => previous.pinned && previous.mode !== "explore"
    ? { ...previous, pinned: false, pinnedSnapshot: null }
    : { ...previous, pinned: true, pinnedSnapshot: { ...snapshot }, pinnedFocus: previous.focus }), []);
  const startExplore = useCallback(() => setState((previous) => ({ ...previous, mode: "explore", playing: false, focus: previous.pinned ? previous.pinnedFocus : previous.focus })), []);
  const returnToLesson = useCallback(() => setState((previous) => ({ ...previous, mode: "lesson", videoOpen: true, playing: false, focus: explanationSegmentAt(previous.time).focus })), []);

  const actions = useMemo(() => ({ openAt, focusConcept, openVideo, closeVideo, playPause, seek, pin, startExplore, returnToLesson }), [openAt, focusConcept, openVideo, closeVideo, playPause, seek, pin, startExplore, returnToLesson]);
  return { state, actions, visible };
}

export default useExplanationSession;
