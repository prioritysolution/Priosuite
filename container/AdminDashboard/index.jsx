"use client";

import React, { useEffect } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { useAdminDashboard } from "./Hook";
import { useDispatch, useSelector } from "react-redux";
import getCookieData from "@/utils/getCookieData";
import { getOpeningLedgerBranchAPI } from "@/container/AdminDashboard/adminApi";
import { setOpeningLedgerBranchData } from "./adminReducer";

const AdminDashboardContainer = () => {
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const token = getCookieData("prioBankClientToken");

  const dispatch = useDispatch();

  const { form } = useAdminDashboard();

  const openingLedgerBranchData = useSelector(
    (state) => state.adminDashboard.openingLedgerBranchData,
  );

  console.log("openingLedgerBranchData", openingLedgerBranchData);

  console.log("orgId=", orgId);
  console.log("branchId=", branchId);

  useEffect(() => {
    const fetchData = async () => {
      if (orgId && branchId && token) {
        const res = await getOpeningLedgerBranchAPI(orgId, branchId);
        dispatch(setOpeningLedgerBranchData(res.details));
      }
    };

    fetchData();
  }, [orgId, branchId, token]);

  return (
    <AdminDashboard
      form={form}
      openingLedgerBranchData={openingLedgerBranchData}
    />
  );
};

export default AdminDashboardContainer;
