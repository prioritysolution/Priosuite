const STORAGE_KEY = "prioBankDeviceId";
const FIXED_ID_PREFIX = "devf_";

const canUseStorage = () => typeof window !== "undefined";

/** Stable hex digest. Same input always returns the same id. */
const hashString = (value) => {
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ 0x01000193;

  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code;
    h2 = Math.imul(h2, 0x01000193);
  }

  const hex = (n) => (n >>> 0).toString(16).padStart(8, "0");
  return `${hex(h1)}${hex(h2)}`;
};

/**
 * Device facts that do not change with the date, the browser, or the screen size.
 */
const getStableDeviceKey = () =>
  [
    getOsName(),
    String(navigator.hardwareConcurrency || 0),
    String(navigator.maxTouchPoints || 0),
    String(screen?.colorDepth || 0),
  ].join("|");

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

/**
 * Fixed id for this physical device.
 * Created once, then returned unchanged on every later visit.
 */
export const getDeviceId = () => {
  if (!canUseStorage()) return "";

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && existing.startsWith(FIXED_ID_PREFIX)) return existing;
  } catch (error) {
    console.error(error);
  }

  const id = `${FIXED_ID_PREFIX}${hashString(getStableDeviceKey())}`;

  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch (error) {
    console.error(error);
  }

  return id;
};
