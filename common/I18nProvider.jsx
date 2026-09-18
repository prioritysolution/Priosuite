"use client";

import { useEffect } from "react";
import "@/i18n";
import { getStoredLanguage, setAppLanguage } from "@/i18n";

export default function I18nProvider({ children }) {
  useEffect(() => {
    setAppLanguage(getStoredLanguage());
  }, []);

  return children;
}
