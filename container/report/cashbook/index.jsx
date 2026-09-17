"use client";

import Cashbook from "@/components/report/cashbook";
import { useCashbook } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";

const CashbookContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    getVoucherDetailsLoading,
    form,
    handleSubmit,
    ledgerTableReceiptData,
    ledgerTablePaymentData,
    totalReceived,
    totalPayment,
    // generatePDF,
    toDate,
    cashBalanceData,
    showVoucherDetails,
    setShowVoucherDetails,
    handleShowVoucherDetails,
    totalDrAmount,
    totalCrAmount,
    denomData,
  } = useCashbook();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [orgId, branchId, token]);

  return (
    <Cashbook
      loading={loading}
      getVoucherDetailsLoading={getVoucherDetailsLoading}
      form={form}
      handleSubmit={handleSubmit}
      ledgerTableReceiptData={ledgerTableReceiptData}
      ledgerTablePaymentData={ledgerTablePaymentData}
      totalReceived={totalReceived}
      totalPayment={totalPayment}
      // generatePDF={generatePDF}
      toDate={toDate}
      cashBalanceData={cashBalanceData}
      showVoucherDetails={showVoucherDetails}
      setShowVoucherDetails={setShowVoucherDetails}
      handleShowVoucherDetails={handleShowVoucherDetails}
      totalDrAmount={totalDrAmount}
      totalCrAmount={totalCrAmount}
      denomData={denomData}
    />
  );
};
export default CashbookContainer;
