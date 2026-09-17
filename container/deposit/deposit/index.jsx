"use client";

import Deposit from "@/components/deposit/deposit";
import { useDeposit } from "./Hooks";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useEffect } from "react";
import getCookieData from "@/utils/getCookieData";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const DepositContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getDepositLoading,
    postDepositLoading,
    cashDenomData,
    inDenominators,
    outDenominators,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    showLedger,
    transMode,
    insufficientBalanceDisable,
    handleShowLedger,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalDeposit,
    totalWithdrawn,
    totalInterest,
    userName,
    currentDate,
    currentTime,
    fromDate,
    resetTrigger,
    isReceiptOpen,
    setIsReceiptOpen,
    depositReceiptData,
    handleGenerateDepositReceipt,
    depositProduct,
    getLedgerLoading,
  } = useDeposit();

  const { getNoteDenomApiCall } = useIssueMembership();
  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId) {
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <Deposit
      loading={loading}
      getDepositLoading={getDepositLoading}
      postDepositLoading={postDepositLoading}
      notes={cashDenomData}
      inDenominators={inDenominators}
      outDenominators={outDenominators}
      cashInTransactionTotal={cashInTransactionTotal}
      cashOutTransactionTotal={cashOutTransactionTotal}
      cashInTransactionGrandTotal={cashInTransactionGrandTotal}
      cashOutTransactionGrandTotal={cashOutTransactionGrandTotal}
      handleInDenominatorChange={handleInDenominatorChange}
      handleOutDenominatorChange={handleOutDenominatorChange}
      form={form}
      handleSubmit={handleSubmit}
      handleAccountFormSubmit={handleAccountFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      showLedger={showLedger}
      transMode={transMode}
      insufficientBalanceDisable={insufficientBalanceDisable}
      handleShowLedger={handleShowLedger}
      showLedgerDialog={showLedgerDialog}
      setShowLedgerDialog={setShowLedgerDialog}
      ledgerHeaderData={ledgerHeaderData}
      ledgerTableData={ledgerTableData}
      totalDeposit={totalDeposit}
      totalWithdrawn={totalWithdrawn}
      totalInterest={totalInterest}
      userName={userName}
      currentDate={currentDate}
      currentTime={currentTime}
      fromDate={fromDate}
      resetTrigger={resetTrigger}
      isReceiptOpen={isReceiptOpen}
      setIsReceiptOpen={setIsReceiptOpen}
      depositReceiptData={depositReceiptData}
      handleGenerateDepositReceipt={handleGenerateDepositReceipt}
      depositProduct={depositProduct}
      getLedgerLoading={getLedgerLoading}
    />
  );
};
export default DepositContainer;
