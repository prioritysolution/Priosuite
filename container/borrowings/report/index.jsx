"use client";

import BorrowingsReport from "@/components/borrowings/report";
import getCookieData from "@/utils/getCookieData";
import { useBorrowingsReport } from "./Hooks";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";

const BorrowingsReportContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    tableData,
    toDate,
    getBorrowingsReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedger,
    setShowLedger,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
  } = useBorrowingsReport();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (token && orgId) {
      getBorrowingsReportTypeApiCall();
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [token, orgId]);

  return (
    <BorrowingsReport
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
      totalDisburse={totalDisburse}
      totalPrincipalRefund={totalPrincipalRefund}
      totalInterestRefund={totalInterestRefund}
      userName={ledgerUserName}
      currentDate={currentLedgerDate}
      currentTime={currentLedgerTime}
      fromDate={fromDate}
    />
  );
};
export default BorrowingsReportContainer;
