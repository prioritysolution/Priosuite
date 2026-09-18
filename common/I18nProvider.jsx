"use client";

import { useEffect } from "react";
import {
  getStoredLanguage,
  setAppLanguage,
  syncI18nResources,
} from "@/i18n";

export default function I18nProvider({ children }) {
  useEffect(() => {
    syncI18nResources();
    setAppLanguage(getStoredLanguage());
  }, []);

  return children;
}
