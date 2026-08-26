"use client";

import CashAccount from "@/components/report/cashAccount";
import { useCashAccount } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";

const CashAccountContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    ledgerTableReceiptData,
    ledgerTablePaymentData,
    // generatePDF,
    toDate,
    fromDate,
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
    denomData,
  } = useCashAccount();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [orgId, branchId, token]);

  return (
    <CashAccount
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      ledgerTableReceiptData={ledgerTableReceiptData}
      ledgerTablePaymentData={ledgerTablePaymentData}
      // generatePDF={generatePDF}
      fromDate={fromDate}
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
      denomData={denomData}
    />
  );
};
export default CashAccountContainer;
