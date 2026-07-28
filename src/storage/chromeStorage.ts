/**
 * Thin wrapper around chrome.storage.local. Falls back to window.localStorage
 * when the chrome extension APIs aren't present (e.g. `npm run dev` in a
 * plain browser tab), so the app is fully usable outside the packed extension.
 */
function hasChromeStorage(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local;
}

export async function storageGet<T>(key: string): Promise<T | undefined> {
  if (hasChromeStorage()) {
    const result = await chrome.storage.local.get(key);
    return result[key] as T | undefined;
  }

  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : undefined;
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  if (hasChromeStorage()) {
    await chrome.storage.local.set({ [key]: value });
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}
