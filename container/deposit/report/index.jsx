"use client";

import DepositReport from "@/components/deposit/report";
import getCookieData from "@/utils/getCookieData";
import { useDepositReport } from "./Hooks";
import { useEffect } from "react";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";

const DepositReportContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    tableData,
    toDate,
    totalDeposit,
    totalWithdrawn,
    totalInterest,
    totalOpening,
    totalClosing,
    totalPaidIntt,
    totalDueIntt,
    totalAmount,
    getDepositReportProductTypeApiCall,
    getDepositReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedgerDialog,
    setShowLedgerDialog,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalLedgerDeposit,
    totalLedgerWithdrawn,
    totalLedgerInterest,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
    handleGenerateDepositReceipt,
    isOpenDepositReceipt,
    setIsOpenDepositReceipt,
    depositReceiptData,
  } = useDepositReport();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (token && orgId) {
      getDepositReportTypeApiCall();
      getOpeningLedgerBranchApiCall(orgId, branchId);
      getDepositReportProductTypeApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <DepositReport
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      tableData={tableData}
      toDate={toDate}
      totalDeposit={totalDeposit}
      totalWithdrawn={totalWithdrawn}
      totalInterest={totalInterest}
      totalOpening={totalOpening}
      totalClosing={totalClosing}
      totalPaidIntt={totalPaidIntt}
      totalDueIntt={totalDueIntt}
      totalAmount={totalAmount}
      showData={showData}
      handleShowLedger={handleShowLedger}
      showLedger={showLedgerDialog}
      setShowLedger={setShowLedgerDialog}
      getLedgerLoading={getLedgerLoading}
      ledgerHeaderData={ledgerHeaderData}
      ledgerTableData={ledgerTableData}
      totalLedgerDeposit={totalLedgerDeposit}
      totalLedgerWithdrawn={totalLedgerWithdrawn}
      totalLedgerInterest={totalLedgerInterest}
      userName={ledgerUserName}
      currentDate={currentLedgerDate}
      currentTime={currentLedgerTime}
      fromDate={fromDate}
      handleGenerateDepositReceipt={handleGenerateDepositReceipt}
      isOpenDepositReceipt={isOpenDepositReceipt}
      setIsOpenDepositReceipt={setIsOpenDepositReceipt}
      depositReceiptData={depositReceiptData}
    />
  );
};
export default DepositReportContainer;
