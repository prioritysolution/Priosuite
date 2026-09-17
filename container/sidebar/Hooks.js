"use client";

import toast from "react-hot-toast";
import { getSidebarDataAPI } from "./SidebarApis";
import { useDispatch } from "react-redux";
import { getSidebarData } from "./SidebarReducer";
import { useState } from "react";

export const useSidebar = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const getSidebarDataApiCall = async (orgId) => {
    console.log("orgId in sidebar hook", orgId);
    setLoading(true);

    try {
      const res = await getSidebarDataAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getSidebarData(res.Data));
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
  };

  return {
    loading,
    getSidebarDataApiCall,
  };
};
