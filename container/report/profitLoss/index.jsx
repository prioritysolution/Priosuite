"use client";

import ProfitLoss from "@/components/report/profitLoss";
import getCookieData from "@/utils/getCookieData";
import { useProfitLoss } from "./Hooks";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";

const ProfitLossContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    ledgerExpenditureTableData,
    ledgerIncomeTableData,
    netData,
    toDate,
    fromDate,
  } = useProfitLoss();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [orgId, branchId, token]);

  return (
    <ProfitLoss
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      ledgerExpenditureTableData={ledgerExpenditureTableData}
      ledgerIncomeTableData={ledgerIncomeTableData}
      netData={netData}
      fromDate={fromDate}
      toDate={toDate}
    />
  );
};
export default ProfitLossContainer;
