export const PERSIST_KEY = "gtp:prefs:v1";

export function loadPrefs() {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("loadPrefs error", e);
    return null;
  }
}

export function savePrefs(data) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(PERSIST_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("savePrefs error", e);
  }
}
