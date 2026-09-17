"use client";

import InvestmentReport from "@/components/investment/report";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useInvestmentReport } from "./Hooks";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";

const InvestmentReportContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    tableData,
    toDate,
    getInvestmentReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedger,
    setShowLedger,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalLedgerWithdrawn,
    totalLedgerDeposit,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
  } = useInvestmentReport();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (token && orgId) {
      getInvestmentReportTypeApiCall();
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [token, orgId]);

  return (
    <InvestmentReport
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      tableData={tableData}
      toDate={toDate}
      showData={showData}
      handleShowLedger={handleShowLedger}
      showLedger={showLedger}
      setShowLedger={setShowLedger}
      getLedgerLoading={getLedgerLoading}
      ledgerHeaderData={ledgerHeaderData}
      ledgerTableData={ledgerTableData}
      totalLedgerWithdrawn={totalLedgerWithdrawn}
      totalLedgerDeposit={totalLedgerDeposit}
      userName={ledgerUserName}
      currentDate={currentLedgerDate}
      currentTime={currentLedgerTime}
      fromDate={fromDate}
    />
  );
};
export default InvestmentReportContainer;
