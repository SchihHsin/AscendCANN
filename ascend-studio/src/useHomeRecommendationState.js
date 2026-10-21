import { useCallback, useMemo, useState } from "react";

const STORAGE_KEY = "ascend-studio.home-recommendations.snoozed.v1";

function readSnoozed() {
  try {
    const value = JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

/** Keeps dismissals scoped to an item's current evidence revision. */
export function useHomeRecommendationState(items = []) {
  const [snoozed, setSnoozed] = useState(readSnoozed);
  const visibleSuggestions = useMemo(
    () => items.filter((item) => snoozed[item.id] !== item.revision).slice(0, 3),
    [items, snoozed],
  );

  const snooze = useCallback((item) => {
    if (!item?.id) return;
    setSnoozed((current) => {
      const next = { ...current, [item.id]: item.revision };
      try { globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage may be unavailable. */ }
      return next;
    });
  }, []);

  return { suggestions: visibleSuggestions, snooze };
}

export default useHomeRecommendationState;
