const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const SUPPORT_KEYS = {
  token: "supportToken",
  phone: "supportPhone",
  domain: "supportDomain",
  savedAt: "supportTokenSavedAt",
  unread: "supportUnread",
  notices: "supportNotices",
};

const read = (key) => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) || "";
};

export const saveSupportSession = ({ domain, phone, token }) => {
  if (typeof window === "undefined" || !domain || !phone || !token) return;
  localStorage.setItem(SUPPORT_KEYS.token, token);
  localStorage.setItem(SUPPORT_KEYS.phone, phone);
  localStorage.setItem(SUPPORT_KEYS.domain, domain);
  localStorage.setItem(SUPPORT_KEYS.savedAt, String(Date.now()));
  window.dispatchEvent(new Event("support-session-saved"));
};

export const readSupportToken = (domain, phone) => {
  const token = read(SUPPORT_KEYS.token);
  const savedPhone = read(SUPPORT_KEYS.phone);
  const savedDomain = read(SUPPORT_KEYS.domain);
  const savedAt = Number(read(SUPPORT_KEYS.savedAt) || 0);
  if (!token || savedPhone !== String(phone || "") || savedDomain !== String(domain || "")) {
    return "";
  }
  if (savedAt && Date.now() - savedAt > THIRTY_DAYS) {
    clearSupportToken();
    return "";
  }
  return token;
};

export const readLastSupportPhone = (domain) => {
  if (read(SUPPORT_KEYS.domain) !== String(domain || "")) return "";
  return read(SUPPORT_KEYS.phone);
};

export const readSupportSession = () => {
  const domain = read(SUPPORT_KEYS.domain);
  const phone = read(SUPPORT_KEYS.phone);
  const token = readSupportToken(domain, phone);
  return { domain, phone, token };
};

export const clearSupportToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SUPPORT_KEYS.token);
  localStorage.removeItem(SUPPORT_KEYS.phone);
  localStorage.removeItem(SUPPORT_KEYS.domain);
  localStorage.removeItem(SUPPORT_KEYS.savedAt);
};

export const readJsonList = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "");
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

export const clearSupportBrowserSession = () => {
  if (typeof window === "undefined") return;
  Object.values(SUPPORT_KEYS).forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new Event("support-signout"));
};
