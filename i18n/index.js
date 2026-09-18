"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import bn from "./locales/bn";
import hi from "./locales/hi";
import or from "./locales/or";

const SUPPORTED_LANGS = ["en", "bn", "hi", "or"];

export const getStoredLanguage = () => {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem("prioBankLanguage");
    if (stored === "ur") return "or";
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  } catch {
    // ignore storage errors
  }
  return "en";
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en,
      bn,
      hi,
      or,
    },
    lng: getStoredLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export const setAppLanguage = (language) => {
  const normalized = language === "ur" ? "or" : language;
  const next = SUPPORTED_LANGS.includes(normalized) ? normalized : "en";
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("prioBankLanguage", next);
    } catch {
      // ignore storage errors
    }
  }
  return i18n.changeLanguage(next);
};

export default i18n;
