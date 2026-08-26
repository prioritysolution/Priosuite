"use client";
import ShareIssue from "@/components/membership/shareIssue";
import { useIssueMembership } from "../issueMembership/Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useShareIssue } from "./Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const ShareIssueContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    totalAmt,
    savings,
    bank,
    loading,
    getMemberDataLoading,
    postShareIssueLoading,
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
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    voucherMode,
    insufficientBalanceDisable,
    showLedger,
    handleShowLedger,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalRefund,
    totalIssue,
    userName,
    currentDate,
    currentTime,
    fromDate,
    getLedgerLoading,
    resetTrigger,
    isReceiptOpen,
    setIsReceiptOpen,
    shareIssueReceiptData,
    handleGenerateShareIssueReceipt,
  } = useShareIssue();

  const { getNoteDenomApiCall } = useIssueMembership();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId) {
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <ShareIssue
      loading={loading}
      getMemberDataLoading={getMemberDataLoading}
      postShareIssueLoading={postShareIssueLoading}
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
      handleMemberFormSubmit={handleMemberFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      voucherMode={voucherMode}
      totalAmt={totalAmt}
      savings={savings}
      bank={bank}
      insufficientBalanceDisable={insufficientBalanceDisable}
      showLedger={showLedger}
      handleShowLedger={handleShowLedger}
      showLedgerDialog={showLedgerDialog}
      setShowLedgerDialog={setShowLedgerDialog}
      ledgerHeaderData={ledgerHeaderData}
      ledgerTableData={ledgerTableData}
      totalRefund={totalRefund}
      totalIssue={totalIssue}
      userName={userName}
      currentDate={currentDate}
      currentTime={currentTime}
      fromDate={fromDate}
      getLedgerLoading={getLedgerLoading}
      resetTrigger={resetTrigger}
      isReceiptOpen={isReceiptOpen}
      setIsReceiptOpen={setIsReceiptOpen}
      shareIssueReceiptData={shareIssueReceiptData}
      handleGenerateShareIssueReceipt={handleGenerateShareIssueReceipt}
    />
  );
};
export default ShareIssueContainer;
