import { useEffect, useId, useRef, useState } from "react";
import {
  IconArrowRight,
  IconChevronDown,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import "./proactive-cue.css";

/**
 * A contextual, user-controlled action cue. State and all resulting actions
 * stay with the parent; this component never navigates, scrolls, or executes.
 */
export default function ProactiveCue({
  id,
  title,
  description,
  evidence,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onDismiss,
  collapsed = false,
  onExpand,
  animate = false,
  onSeen,
  emphasisRef,
  busy = false,
  children,
}) {
  const generatedId = useId();
  const contentId = `${id || "proactive-cue"}-${generatedId}`;
  const isCollapsed = Boolean(collapsed);
  const root = useRef(null);
  const seenCallback = useRef(onSeen);
  const emphasisAnimation = useRef(null);
  const [entering, setEntering] = useState(false);
  seenCallback.current = onSeen;
  useEffect(() => {
    setEntering(false);
    if (!animate || isCollapsed || !root.current) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) seenCallback.current?.();
      else {
        setEntering(true);
        emphasisAnimation.current?.cancel();
        // A single local emphasis; it does not move or focus the related object.
        if (emphasisRef?.current) emphasisAnimation.current = emphasisRef.current.animate([
          { boxShadow: "0 0 0 0 rgba(105, 96, 170, 0)" },
          { boxShadow: "0 0 0 2px rgba(105, 96, 170, .25)", offset: .3 },
          { boxShadow: "0 0 0 0 rgba(105, 96, 170, 0)" },
        ], { duration: 700, easing: "ease-out" });
      }
    }, { threshold: 0.2 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [contentId, animate, isCollapsed, emphasisRef]);
  useEffect(() => () => emphasisAnimation.current?.cancel(), []);

  return (
    <section
      ref={root}
      className={`proactive-cue${isCollapsed ? " is-collapsed" : ""}${entering ? " is-entering" : ""}`}
      onAnimationEnd={event => {
        if (event.target !== event.currentTarget) return;
        setEntering(false);
        seenCallback.current?.();
      }}
      aria-labelledby={`${contentId}-title`}
      aria-busy={busy || undefined}
    >
      <div className="proactive-cue-heading">
        <span className="proactive-cue-icon" aria-hidden="true">
          <IconInfoCircle size={17} stroke={1.8} />
        </span>
        <div className="proactive-cue-heading-copy">
          <h3 id={`${contentId}-title`}>{title}</h3>
          {evidence && <p className="proactive-cue-evidence"><span>依据</span>{evidence}</p>}
        </div>
        <div className="proactive-cue-heading-actions">
          {isCollapsed && (
            <button
              className="proactive-cue-expand"
              type="button"
              aria-expanded="false"
              aria-controls={`${contentId}-body`}
              onClick={onExpand}
            >
              展开<IconChevronDown size={15} aria-hidden="true" />
            </button>
          )}
          {onDismiss && !isCollapsed && (
            <button
              className="proactive-cue-dismiss"
              type="button"
              aria-label="收起建议"
              onClick={onDismiss}
            >
              <IconX size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="proactive-cue-body" id={`${contentId}-body`} hidden={isCollapsed}>
        {description && <p className="proactive-cue-description">{description}</p>}
        {children && <div className="proactive-cue-extra">{children}</div>}
        {(primaryLabel || secondaryLabel) && (
          <div className="proactive-cue-actions">
            {primaryLabel && (
              <button
                className="proactive-cue-primary"
                type="button"
                onClick={onPrimary}
                disabled={busy || !onPrimary}
              >
                {primaryLabel}<IconArrowRight size={15} aria-hidden="true" />
              </button>
            )}
            {secondaryLabel && (
              <button
                className="proactive-cue-secondary"
                type="button"
                onClick={onSecondary}
                disabled={busy || !onSecondary}
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
