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
export const getOsName = () => {
  if (!canUseStorage()) return "Unknown";
  const platform = String(navigator.platform || "").toLowerCase();
  const agent = String(navigator.userAgent || "").toLowerCase();
  if (platform.includes("win")) return "Windows";
  if (/iphone|ipod|ipad/.test(platform) || /iphone|ipod|ipad/.test(agent)) return "iOS";
  if (platform.includes("mac")) return "MacOS";
  if (/android/.test(platform) || /android/.test(agent)) return "Android";
  if (platform.includes("linux")) return "Linux";
  return "Unknown";
};

/** Browser/device details for the machine running this webapp. */
export const collectDeviceInfo = () => {
  if (!canUseStorage()) return { user_device_id: "", user_device: "Unknown" };

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  return {
    user_device_id: getDeviceId(),
    user_device: getOsName(),
    user_ip: "",
    userAgent: navigator.userAgent || "",
    language: navigator.language || "",
    languages: navigator.languages || [],
    platform: navigator.platform || "",
    vendor: navigator.vendor || "",
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
    deviceMemory: navigator.deviceMemory ?? null,
    maxTouchPoints: navigator.maxTouchPoints ?? null,
    cookieEnabled: navigator.cookieEnabled ?? null,
    onLine: navigator.onLine ?? null,
    screen: {
      width: screen?.width ?? null,
      height: screen?.height ?? null,
      availWidth: screen?.availWidth ?? null,
      availHeight: screen?.availHeight ?? null,
      colorDepth: screen?.colorDepth ?? null,
      pixelDepth: screen?.pixelDepth ?? null,
    },
    devicePixelRatio: window.devicePixelRatio ?? null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    timezoneOffset: new Date().getTimezoneOffset(),
    connection: connection
      ? {
          effectiveType: connection.effectiveType || "",
          downlink: connection.downlink ?? null,
          rtt: connection.rtt ?? null,
          saveData: connection.saveData ?? null,
        }
      : null,
  };
};

export const fetchClientIp = async () => {
  const response = await fetch("https://api-bdc.net/data/client-ip");
  const data = await response.json();
  return data?.ipString || "";
};

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
