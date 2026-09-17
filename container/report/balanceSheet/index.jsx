"use client";

import BalanceSheet from "@/components/report/balanceSheet";
import getCookieData from "@/utils/getCookieData";
import { useBalanceSheet } from "./Hooks";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";

const BalanceSheetContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    ledgerAssetsTableData,
    ledgerLiablitiesTableData,
    asOnDate,
  } = useBalanceSheet();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [orgId, branchId, token]);

  return (
    <BalanceSheet
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      ledgerAssetsTableData={ledgerAssetsTableData}
      ledgerLiablitiesTableData={ledgerLiablitiesTableData}
      asOnDate={asOnDate}
    />
  );
};
export default BalanceSheetContainer;
