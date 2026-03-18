const ACCESSIBILITY_MODE_STORAGE_KEY = "campus-carbon-accessibility-mode";
const ACCESSIBILITY_MODE_EVENT = "campus-carbon-accessibility-mode-change";

export function getAccessibilityMode() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ACCESSIBILITY_MODE_STORAGE_KEY) === "true";
}

export function setAccessibilityMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESSIBILITY_MODE_STORAGE_KEY, enabled ? "true" : "false");
  window.dispatchEvent(
    new CustomEvent(ACCESSIBILITY_MODE_EVENT, { detail: { enabled } })
  );
}

export function subscribeToAccessibilityMode(callback: (enabled: boolean) => void) {
  if (typeof window === "undefined") return () => {};

  function handleCustomEvent(event: Event) {
    const customEvent = event as CustomEvent<{ enabled?: boolean }>;
    callback(Boolean(customEvent.detail?.enabled));
  }

  function handleStorageEvent(event: StorageEvent) {
    if (event.key !== ACCESSIBILITY_MODE_STORAGE_KEY) return;
    callback(event.newValue === "true");
  }

  window.addEventListener(ACCESSIBILITY_MODE_EVENT, handleCustomEvent as EventListener);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(
      ACCESSIBILITY_MODE_EVENT,
      handleCustomEvent as EventListener
    );
    window.removeEventListener("storage", handleStorageEvent);
  };
}
