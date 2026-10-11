import { useState } from "react";

// Session-only cue state, keyed by task/reset and meaningful event, survives
// material switches. A dismissed event never expands itself on a rerender.
export function useProactiveCues(scope) {
  const [events, setEvents] = useState({});
  const keyFor = (id) => `${scope}:${id}`;
  const patch = (id, values) => setEvents(previous => ({ ...previous, [keyFor(id)]: { ...previous[keyFor(id)], ...values } }));
  return {
    settle: id => patch(id, { collapsed: true, seen: true }),
    forCue: id => {
      const event = events[keyFor(id)] || {};
      return {
        id: keyFor(id), collapsed: Boolean(event.collapsed), animate: !event.seen,
        onDismiss: () => patch(id, { collapsed: true, seen: true }),
        onExpand: () => patch(id, { collapsed: false, seen: true }),
        onSeen: () => patch(id, { seen: true }),
      };
    },
  };
}
