import { useState } from "react";

// Cue state survives material switches while the app remains mounted, but a
// full page reload returns cues to their initial state. A dismissed event
// never expands itself on a rerender.
export function useProactiveCues(scope) {
  const [events, setEvents] = useState({});
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
