import { useEffect, useState } from "react";
import { readSession, writeSession } from "./session-storage";

// Saved cue state, keyed by task/reset and meaningful event, survives
// material switches. A dismissed event never expands itself on a rerender.
export function useProactiveCues(scope) {
  const [events, setEvents] = useState(() => readSession("proactive-cues", {}));
  useEffect(() => { writeSession("proactive-cues", events); }, [events]);
  const keyFor = (id) => `${scope}:${id}`;
  const patch = (id, values) => setEvents(previous => ({ ...previous, [keyFor(id)]: { ...previous[keyFor(id)], ...values } }));
  return {
    settle: id => patch(id, { collapsed: true, seen: true, resolved: true }),
    forCue: id => {
      const event = events[keyFor(id)] || {};
      return {
        id: keyFor(id), collapsed: Boolean(event.collapsed), animate: !event.seen,
        resolved: Boolean(event.resolved),
        onDismiss: () => patch(id, { collapsed: true, seen: true }),
        onExpand: () => patch(id, { collapsed: false, seen: true }),
        onSeen: () => patch(id, { seen: true }),
      };
    },
  };
}
