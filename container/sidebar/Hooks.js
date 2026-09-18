"use client";

import toast from "react-hot-toast";
import { getSidebarDataAPI } from "./SidebarApis";
import { useDispatch, useSelector } from "react-redux";
import { getSidebarData } from "./SidebarReducer";
import { useCallback, useRef, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import {
  getStoredUserDashboard,
  setStoredUserDashboard,
} from "@/utils/userDashboardStorage";

export const useSidebar = () => {
  const dispatch = useDispatch();
  const sidebarData = useSelector((state) => state.sidebar.sidebarData);
  const sidebarDataRef = useRef(sidebarData);
  sidebarDataRef.current = sidebarData;

  const [loading, setLoading] = useState(false);

  const getSidebarDataApiCall = useCallback(
    async (orgId) => {
      if (Array.isArray(sidebarDataRef.current) && sidebarDataRef.current.length > 0) {
        return;
      }

      const userName = getCookieData("userName");
      const cached = getStoredUserDashboard(orgId, userName);
      if (cached) {
        dispatch(getSidebarData(cached));
        return;
      }

      setLoading(true);

      try {
        const res = await getSidebarDataAPI(orgId);
        if (res.message === "Data Found") {
          const data = res.Data || res.details || [];
          dispatch(getSidebarData(data));
          setStoredUserDashboard(orgId, userName, data);
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
