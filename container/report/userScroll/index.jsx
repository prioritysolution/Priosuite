"use client";

import UserScroll from "@/components/report/userScroll";
import { useUserScroll } from "./Hooks";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const UserScrollContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    getScrollUserListApiCall,
    form,
    handleSubmit,
    userList,
    reportData,
    asOnDate,
    user,
  } = useUserScroll();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
      getScrollUserListApiCall(orgId, branchId);
    }
  }, [orgId, branchId, token]);

  return (
    <UserScroll
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      userList={userList}
      reportData={reportData}
      asOnDate={asOnDate}
      user={user}
    />
  );
};
export default UserScrollContainer;
