"use client";

import MembershipReport from "@/components/membership/report";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useMemberReport } from "./Hooks";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useShareProduct } from "@/container/master/shareProduct/Hooks";

const MembershipReportContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    tableData,
    toDate,
    totalAdmFees,
    totalIssue,
    totalRelease,
    totalAmount,
    totalOpening,
    totalClosing,
    totalDividend,
    totalBalance,
    getMemberReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedger,
    setShowLedger,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalRefund,
    totalLedgerIssue,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
    handleGenerateShareReceipt,
    isOpenShareReceipt,
    setIsOpenShareReceipt,
    shareIssueReceiptData,
  } = useMemberReport();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();
  const { getMemberTypeDataApiCall } = useShareProduct();

  useEffect(() => {
    if (token && orgId) {
      getMemberReportTypeApiCall();
      getMemberTypeDataApiCall(orgId);
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [token, orgId]);

  return (
    <MembershipReport
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      tableData={tableData}
      toDate={toDate}
      totalAdmFees={totalAdmFees}
      totalIssue={totalIssue}
      totalRelease={totalRelease}
      totalAmount={totalAmount}
      totalOpening={totalOpening}
      totalClosing={totalClosing}
      totalDividend={totalDividend}
      totalBalance={totalBalance}
      showData={showData}
      handleShowLedger={handleShowLedger}
      showLedger={showLedger}
      setShowLedger={setShowLedger}
      getLedgerLoading={getLedgerLoading}
      ledgerHeaderData={ledgerHeaderData}
      ledgerTableData={ledgerTableData}
      totalRefund={totalRefund}
      totalLedgerIssue={totalLedgerIssue}
      userName={ledgerUserName}
      currentDate={currentLedgerDate}
      currentTime={currentLedgerTime}
      fromDate={fromDate}
      handleGenerateShareReceipt={handleGenerateShareReceipt}
      isOpenShareReceipt={isOpenShareReceipt}
      setIsOpenShareReceipt={setIsOpenShareReceipt}
      shareIssueReceiptData={shareIssueReceiptData}
    />
  );
};
export default MembershipReportContainer;
