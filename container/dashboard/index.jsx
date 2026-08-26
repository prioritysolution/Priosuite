"use client";

import Dashboard from "@/components/dashboard";
import { useDashboard } from "./Hooks";
import { useAdminDashboard } from "@/container/AdminDashboard/Hook";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOpeningLedgerBranchAPI } from "@/container/AdminDashboard/adminApi";
import { setOpeningLedgerBranchData } from "@/container/AdminDashboard/adminReducer";

const DashboardContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const isMainDash = Number(getCookieData("Is_Main_Dash"));

  // Access beg_date from Redux store
  const begDate = useSelector((state) => state?.login?.beg_date);

  // AdminDashboard specific state
  const dispatch = useDispatch();
  const openingLedgerBranchData = useSelector(
    (state) => state.adminDashboard.openingLedgerBranchData,
  );

  const {
    getDashboardItemApiCall,
    dashboardItemData,
    updateDayBeginLoading,
    updateDayBeginApiCall,
  } = useDashboard();
  const { form } = useAdminDashboard();

  useEffect(() => {
    if (orgId && branchId && token) {
      getDashboardItemApiCall();

      // Also fetch AdminDashboard data if needed
      if (isMainDash === 1) {
        const fetchAdminData = async () => {
          const res = await getOpeningLedgerBranchAPI(orgId, branchId);
          dispatch(setOpeningLedgerBranchData(res.details));
        };
        fetchAdminData();
      }
    }
  }, [orgId, branchId, token, isMainDash, dispatch]);

  console.log("Begin Date from Redux:", begDate);

  return (
    <Dashboard
      dashboardItemData={dashboardItemData}
      begDate={begDate}
      form={form}
      openingLedgerBranchData={openingLedgerBranchData}
      updateDayBeginLoading={updateDayBeginLoading}
      updateDayBeginApiCall={updateDayBeginApiCall}
    />
  );
};

export default DashboardContainer;
