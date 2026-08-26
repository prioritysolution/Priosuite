"use client";

import Balancing from "@/components/report/balancing";
import { useBalancing } from "./Hooks";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const BalancingContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    depositList,
    loanList,
    shareList,
    investmentList,
    borrowingsList,
    asOnDate,
  } = useBalancing();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [orgId, branchId, token]);

  return (
    <Balancing
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      depositList={depositList}
      loanList={loanList}
      shareList={shareList}
      investmentList={investmentList}
      borrowingsList={borrowingsList}
      asOnDate={asOnDate}
    />
  );
};
export default BalancingContainer;
