const PREFIX = "ascend-studio.session.v1";
const VERSION = 1;
const failedKeys = new Set();
export const sessionSaveAvailable = () => failedKeys.size === 0;
function markSave(key, success) {
  const before = sessionSaveAvailable();
  if (success) failedKeys.delete(key); else failedKeys.add(key);
  if (before !== sessionSaveAvailable() && typeof window !== "undefined") window.dispatchEvent(new Event("ascstudio-save-status"));
}

export function readSession(key, fallback) {
  try {
    const raw = globalThis.localStorage?.getItem(`${PREFIX}:${key}`);
    if (!raw) return fallback;
    const stored = JSON.parse(raw);
    return stored?.version === VERSION && Object.hasOwn(stored, "value") ? stored.value : fallback;
  } catch {
    return fallback;
  }
}

export function writeSession(key, value) {
  try {
    const storage = globalThis.localStorage;
    if (!storage || value === undefined) { markSave(key, false); return false; }
    if (JSON.stringify(value) === undefined) return false;
    const serialized = JSON.stringify({ version: VERSION, value });
    storage.setItem(`${PREFIX}:${key}`, serialized);
    markSave(key, true);
    return true;
  } catch {
    markSave(key, false);
    return false;
  }
}
