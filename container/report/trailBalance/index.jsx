"use client";

import TrailBalance from "@/components/report/trailBalance";
import { useTrailBalance } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";

const TrailBalanceContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    ledgerAssetsTableData,
    ledgerLiablitiesTableData,
    toDate,
    fromDate,
  } = useTrailBalance();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [orgId, branchId, token]);

  return (
    <TrailBalance
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      ledgerAssetsTableData={ledgerAssetsTableData}
      ledgerLiablitiesTableData={ledgerLiablitiesTableData}
      fromDate={fromDate}
      toDate={toDate}
    />
  );
};
export default TrailBalanceContainer;
