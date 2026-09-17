"use client";

import Transaction from "@/components/borrowings/transaction";
import getCookieData from "@/utils/getCookieData";
import { useBorrowingsTransaction } from "./Hooks";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";
import { useEffect } from "react";

const TransactionContainer = () => {
  const orgId = getCookieData("orgId");
  const token = getCookieData("prioBankClientToken");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    cashDenomData,
    denominators,
    cashTransactionTotal,
    cashTransactionGrandTotal,
    handleDenominatorChange,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    mode,
    transMode,
    getBorrowingsAccountApiCall,
    handleShowLedger,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    userName,
    currentDate,
    currentTime,
    fromDate,
    toDate,
    getLedgerLoading,
  } = useBorrowingsTransaction();

  const { getNoteDenomApiCall } = useIssueMembership();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (orgId && token) {
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
      getBorrowingsAccountApiCall(orgId,branchId);
    }
  }, [orgId]);

  return (
    <Transaction
      loading={loading}
      notes={cashDenomData}
      denominators={denominators}
      cashTransactionTotal={cashTransactionTotal}
      cashTransactionGrandTotal={cashTransactionGrandTotal}
      handleDenominatorChange={handleDenominatorChange}
      form={form}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      mode={mode}
      transMode={transMode}
      handleShowLedger={handleShowLedger}
      showLedger={showLedger}
      setShowLedger={setShowLedger}
      ledgerHeaderData={ledgerHeaderData}
      ledgerTableData={ledgerTableData}
      totalDisburse={totalDisburse}
      totalPrincipalRefund={totalPrincipalRefund}
      totalInterestRefund={totalInterestRefund}
      userName={userName}
      currentDate={currentDate}
      currentTime={currentTime}
      fromDate={fromDate}
      toDate={toDate}
      getLedgerLoading={getLedgerLoading}
    />
  );
};
export default TransactionContainer;
