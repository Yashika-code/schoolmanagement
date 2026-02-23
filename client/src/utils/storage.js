const AUTH_KEY = "sms_auth";

const isBrowser = () => typeof window !== "undefined";

export const loadAuth = () => {
  if (!isBrowser()) return { user: null, token: null };
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return { user: null, token: null };
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Failed to parse cached auth", error);
    return { user: null, token: null };
  }
};

export const saveAuth = (payload) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
};

export const clearAuth = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(AUTH_KEY);
};

export const getToken = () => loadAuth().token;
