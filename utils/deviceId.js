const STORAGE_KEY = "prioBankDeviceId";

const canUseStorage = () => typeof window !== "undefined";

const createUuid = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === "x" ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
};

/** Lightweight fingerprint of the current browser/device. */
const getDeviceFingerprint = () => {
  if (!canUseStorage()) return "server";

  const parts = [
    navigator.userAgent || "",
    navigator.language || "",
    navigator.platform || "",
    String(navigator.hardwareConcurrency || ""),
    String(screen?.width || ""),
    String(screen?.height || ""),
    String(screen?.colorDepth || ""),
    String(new Date().getTimezoneOffset()),
  ];

  let hash = 0;
  const raw = parts.join("|");
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }

  return `fp_${Math.abs(hash).toString(16)}`;
};

/**
 * Device id for the browser/device where this webapp is running.
 * Created once per device/browser and reused on later logins.
 */
export const getDeviceId = () => {
  if (!canUseStorage()) return "";

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && existing.trim()) return existing.trim();

    // Unique per install on this device/browser
    const next = `${getDeviceFingerprint()}_${createUuid()}`;
    window.localStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch (error) {
    console.error(error);
    return `${getDeviceFingerprint()}_${createUuid()}`;
  }
};
