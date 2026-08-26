"use client";

import LoanReport from "@/components/loan/report";
import { useLoanReport } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";
import { useNewApplication } from "../newApplication/Hooks";

const LoanReportContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    tableData,
    toDate,
    totalDisburseAmount,
    totalShareAmount,
    totalInsAmount,
    totalMisAmount,
    totalNetDisburse,
    totalOpening,
    totalDisburse,
    totalPrn,
    totalIntt,
    totalAmount,
    totalCurrOuts,
    totalOdOuts,
    totalCurrIntt,
    totalOdIntt,
    getLoanReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedger,
    setShowLedger,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalLedgerDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
    handleGenerateCollectionReceipt,
    isOpenCollectionReceipt,
    setIsOpenCollectionReceipt,
    collectionReceiptData,
    getLoanProductListApiCall,
  } = useLoanReport();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (token && orgId) {
      getLoanReportTypeApiCall();
      getLoanProductListApiCall(orgId);
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [token, orgId]);

  return (
    <LoanReport
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      tableData={tableData}
      toDate={toDate}
      totalDisburseAmount={totalDisburseAmount}
      totalShareAmount={totalShareAmount}
      totalInsAmount={totalInsAmount}
      totalMisAmount={totalMisAmount}
      totalNetDisburse={totalNetDisburse}
      totalOpening={totalOpening}
      totalDisburse={totalDisburse}
      totalPrn={totalPrn}
      totalIntt={totalIntt}
      totalAmount={totalAmount}
      totalCurrOuts={totalCurrOuts}
      totalOdOuts={totalOdOuts}
      totalCurrIntt={totalCurrIntt}
      totalOdIntt={totalOdIntt}
      showData={showData}
      handleShowLedger={handleShowLedger}
      showLedger={showLedger}
      setShowLedger={setShowLedger}
      getLedgerLoading={getLedgerLoading}
      ledgerHeaderData={ledgerHeaderData}
      ledgerTableData={ledgerTableData}
      totalLedgerDisburse={totalLedgerDisburse}
      totalPrincipalRefund={totalPrincipalRefund}
      totalInterestRefund={totalInterestRefund}
      userName={ledgerUserName}
      currentDate={currentLedgerDate}
      currentTime={currentLedgerTime}
      fromDate={fromDate}
      handleGenerateCollectionReceipt={handleGenerateCollectionReceipt}
      isOpenCollectionReceipt={isOpenCollectionReceipt}
      setIsOpenCollectionReceipt={setIsOpenCollectionReceipt}
      collectionReceiptData={collectionReceiptData}
    />
  );
};
export default LoanReportContainer;
