"use client";

import PlAppropiation from "@/components/report/plAppropiation";
import getCookieData from "@/utils/getCookieData";
import { usePlAppropiation } from "./Hooks";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";

const PlAppropiationContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    ledgerExpenditureTableData,
    ledgerIncomeTableData,
    totalExpenditure,
    totalIncome,
    asOnDate,
  } = usePlAppropiation();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [orgId, branchId, token]);

  return (
    <PlAppropiation
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      ledgerExpenditureTableData={ledgerExpenditureTableData}
      ledgerIncomeTableData={ledgerIncomeTableData}
      totalExpenditure={totalExpenditure}
      totalIncome={totalIncome}
      asOnDate={asOnDate}
    />
  );
};
export default PlAppropiationContainer;
