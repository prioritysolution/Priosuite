"use client";

import Sidebar from "../../components/sidebar";
import getCookieData from "../../utils/getCookieData";
import { useLayoutEffect } from "react";
import { useSidebar } from "./Hooks";
import { useTranslation } from "react-i18next";

const SidebarContainer = ({ onClose }) => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const { i18n } = useTranslation();

  const { loading, getSidebarDataApiCall } = useSidebar();

  useLayoutEffect(() => {
    if (token && orgId) {
      getSidebarDataApiCall(orgId, { language: i18n.language });
    }
  }, [token, orgId, getSidebarDataApiCall, i18n.language]);

  return <Sidebar loading={loading} onClose={onClose} />;
};

export default SidebarContainer;
