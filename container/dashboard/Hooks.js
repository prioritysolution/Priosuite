"use client";

import getCookieData from "@/utils/getCookieData";
import toast from "react-hot-toast";
import { formatDateForApi } from "@/utils/dateHelpers";
import { getDashboardItemAPI, updateDayBeginAPI } from "./DashboardApis";
import { useState } from "react";
import Cookies from "@/utils/secureCookieHelper";
import { useDispatch } from "react-redux";
import { beg_date } from "@/container/auth/login/LoginReducer";

export const useDashboard = () => {
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");
  const dispatch = useDispatch();

  // console.log("beg_date=>", getCookieData("beg_date"));
  // console.log("branch_id=>", getCookieData("branch_id"));
  // console.log("fin_end_date=>", getCookieData("fin_end_date"));
  // console.log("fin_start_date=>", getCookieData("fin_start_date"));
  // console.log("finId=>", getCookieData("finId"));
  // console.log("orgId=>", getCookieData("orgId"));
  // console.log("userBranchId=>", getCookieData("userBranchId"));
  // console.log("prioBankClientToken=>", getCookieData("prioBankClientToken"));

  const [loading, setLoading] = useState(false);
  const [updateDayBeginLoading, setUpdateDayBeginLoading] = useState(false);
  const [dashboardItemData, setDashboardItemData] = useState(null);

  const getDashboardItemApiCall = async () => {
    setLoading(true);

    const data = {
      org_id: orgId,
      branch_id: branchId,
      date: formatDateForApi(new Date()),
    };

    try {
      const res = await getDashboardItemAPI(data);
      console.log(res);
      if (res.message === "Data Found") {
        setDashboardItemData(res.details[0]);
      } else {
        setDashboardItemData(null);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setDashboardItemData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateDayBeginApiCall = async (newBeginDate, onSuccess) => {
    const apiDate = formatDateForApi(newBeginDate);
    if (!newBeginDate || !apiDate) {
      toast.error("Please select a new begin date.");
      return;
    }
    setUpdateDayBeginLoading(true);
    const payload = {
      org_id: orgId,
      year_id: getCookieData("year_id"),
      branch_id: branchId,
      date: apiDate,
    };
    try {
      const res = await updateDayBeginAPI(payload);
      if (res?.message === "Success") {
        const newDate = res.details;
        Cookies.set("beg_date", newDate);
        const parsedNewDate = new Date(newDate);
        dispatch(
          beg_date(
            isNaN(parsedNewDate.getTime())
              ? newDate
              : parsedNewDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
          ),
        );
        toast.success("Day Begin Date updated successfully!");
        if (onSuccess) onSuccess();
        window.location.reload();
      } else {
        toast.error(res?.details || "Failed to update Day Begin Date");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setUpdateDayBeginLoading(false);
    }
  };

  return {
    loading,
    getDashboardItemApiCall,
    dashboardItemData,
    updateDayBeginLoading,
    updateDayBeginApiCall,
  };
};
