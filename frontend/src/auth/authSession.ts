export type AuthUser = {
  user_id: string;
  username: string;
  display_name: string | null;
  role: string | null;
  group_id: string | null;
};

const STORAGE_KEY = "auth_user";
const AUTH_EVENT = "auth-user-changed";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function emitAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

export function setAuthUser(user: AuthUser) {
  if (!canUseBrowserStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  emitAuthChange();
}

export function getAuthUser(): AuthUser | null {
  if (!canUseBrowserStorage()) return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthUserId(): string | null {
  return getAuthUser()?.user_id || null;
}

export function clearAuthUser() {
  if (!canUseBrowserStorage()) return;
  localStorage.removeItem(STORAGE_KEY);
  emitAuthChange();
}

export function subscribeAuthUser(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  const handleAuthChange = () => {
    listener();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_EVENT, handleAuthChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_EVENT, handleAuthChange);
  };
}
