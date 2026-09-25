"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/** Always read English copy, even when the app language changes. */
export const useEnglishOnly = () => {
  const { i18n } = useTranslation();
  const t = useMemo(() => i18n.getFixedT("en"), [i18n]);
  return { t, i18n };
};
