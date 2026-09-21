"use client";

import toast from "react-hot-toast";
import { getSidebarDataAPI } from "./SidebarApis";
import { useDispatch } from "react-redux";
import { getSidebarData } from "./SidebarReducer";
import { useCallback, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import {
  getStoredUserDashboard,
  setStoredUserDashboard,
} from "@/utils/userDashboardStorage";
import { getDashboardApiLang } from "@/i18n";

export const useSidebar = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getSidebarDataApiCall = useCallback(
    async (orgId, options = {}) => {
      const { force = false, language } = options;
      const lang = getDashboardApiLang(language);
      const userName = getCookieData("userName");

      if (!force) {
        const cached = getStoredUserDashboard(orgId, userName, lang);
        if (cached) {
          dispatch(getSidebarData(cached));
          return;
        }
      }

      setLoading(true);

      try {
        const res = await getSidebarDataAPI(orgId, lang);
        if (res.message === "Data Found") {
          const data = res.Data || res.details || [];
          dispatch(getSidebarData(data));
          setStoredUserDashboard(orgId, userName, data, lang);
        } else {
          dispatch(getSidebarData([]));
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        dispatch(getSidebarData([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  return {
    loading,
    getSidebarDataApiCall,
  };
};
