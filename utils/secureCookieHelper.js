import CookiesJS from "js-cookie";
import { AES, Utf8 } from "crypto-es";

const SECRET_KEY = process.env.NEXT_PUBLIC_COOKIE_SECRET_KEY;

const encryptVal = (value) => {
  if (value === undefined || value === null) return "";
  const stringVal =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  return AES.encrypt(stringVal, SECRET_KEY).toString();
};

const decryptVal = (cipherText) => {
  if (!cipherText) return null;
  try {
    const bytes = AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(Utf8);
    if (!decrypted) {
      // Allow plaintext date cookies written by older js-cookie calls
      if (
        /^\d{4}-\d{2}-\d{2}/.test(cipherText) ||
        /^\d{2}[-/]\d{2}[-/]\d{4}/.test(cipherText)
      ) {
        return cipherText;
      }
      return null;
    }
    return decrypted;
  } catch (e) {
    console.error("Cookie decryption failed", e);
    return null;
  }
};

const Cookies = {
  set: (key, value, options = {}) => {
    const encrypted = encryptVal(value);
    const mergedOptions = {
      sameSite: "strict",
      path: "/",
      ...options,
      secure: true,
    };
    if (mergedOptions.sameSite) {
      const ss = String(mergedOptions.sameSite).toLowerCase();
      mergedOptions.sameSite = ss.charAt(0).toUpperCase() + ss.slice(1);
    }
    CookiesJS.set(key, encrypted, mergedOptions);
  },
  get: (key) => {
    const val = CookiesJS.get(key);
    if (!val) return undefined;
    const decrypted = decryptVal(val);
    return decrypted === null ? undefined : decrypted;
  },
  remove: (key, options = {}) => {
    CookiesJS.remove(key, { path: "/", ...options });
  },
};

export default Cookies;
