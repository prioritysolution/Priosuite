"use client";

import Daybook from "@/components/report/daybook";
import { useDaybook } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";

const DaybookContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    getVoucherListLoading,
    getVoucherDetailsLoading,
    form,
    handleSubmit,
    ledgerTableReceiptData,
    ledgerTablePaymentData,
    denomData,
    // generatePDF,
    toDate,
    totalCashReceived,
    totalTranferReceived,
    totalReceived,
    totalCashPayment,
    totalTranferPayment,
    totalPayment,
    cashBalanceData,
    showVoucherList,
    setShowVoucherList,
    handleShowVoucherList,
    showVoucherDetails,
    setShowVoucherDetails,
    handleShowVoucherDetails,
    totalDrAmount,
    totalCrAmount,
    currentPage,
    setCurrentPage,
    lastPage,
  } = useDaybook();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [orgId, branchId, token]);

  return (
    <Daybook
      loading={loading}
      getVoucherListLoading={getVoucherListLoading}
      getVoucherDetailsLoading={getVoucherDetailsLoading}
      form={form}
      handleSubmit={handleSubmit}
      ledgerTableReceiptData={ledgerTableReceiptData}
      ledgerTablePaymentData={ledgerTablePaymentData}
      denomData={denomData}
      // generatePDF={generatePDF}
      toDate={toDate}
      totalCashReceived={totalCashReceived}
      totalTranferReceived={totalTranferReceived}
      totalReceived={totalReceived}
      totalCashPayment={totalCashPayment}
      totalTranferPayment={totalTranferPayment}
      totalPayment={totalPayment}
      cashBalanceData={cashBalanceData}
      showVoucherList={showVoucherList}
      setShowVoucherList={setShowVoucherList}
      handleShowVoucherList={handleShowVoucherList}
      showVoucherDetails={showVoucherDetails}
      setShowVoucherDetails={setShowVoucherDetails}
      handleShowVoucherDetails={handleShowVoucherDetails}
      totalDrAmount={totalDrAmount}
      totalCrAmount={totalCrAmount}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
    />
  );
};
export default DaybookContainer;
