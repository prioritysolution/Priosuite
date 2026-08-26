"use client";

import Repayment from "@/components/loan/repayment";
import { useRepayment } from "./Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";

const RepaymentContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    postRepaymentLoading,
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
    transMode,
    insufficientBalanceDisable,
    showLedger,
    handleShowLedger,
    showLedgerDialog,
    setShowLedgerDialog,
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
    resetTrigger,
    isOpen,
    setIsOpen,
    collectionReceiptData,
    handleGenerateCollectionReceipt,
    getLoanLedgerLoading,
    handleSearchAccountListByMemberNo,
    handleSearchAccountListByName,
    handleSelectClick,
    dialougeOpen,
    setDialougeOpen,
    handleFetchData,
    savingsAccountFullName,
    savingsAccountBalance,
    currentSavingsPage,
    setCurrentSavingsPage,
    lastSavingsPage,
    activeTab,
    setActiveTab,
    handleGetGuarantorSecurity,
    showGuarantorSecurityDialog,
    setShowGuarantorSecurityDialog,
    guarantorSecurityDetails,
  } = useRepayment();

  const { getNoteDenomApiCall } = useIssueMembership();
  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId) {
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <Repayment
      loading={loading}
      postRepaymentLoading={postRepaymentLoading}
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
      transMode={transMode}
      insufficientBalanceDisable={insufficientBalanceDisable}
      showLedger={showLedger}
      handleShowLedger={handleShowLedger}
      showLedgerDialog={showLedgerDialog}
      setShowLedgerDialog={setShowLedgerDialog}
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
      resetTrigger={resetTrigger}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      collectionReceiptData={collectionReceiptData}
      handleGenerateCollectionReceipt={handleGenerateCollectionReceipt}
      getLoanLedgerLoading={getLoanLedgerLoading}
      handleSearchAccountListByMemberNo={handleSearchAccountListByMemberNo}
      handleSearchAccountListByName={handleSearchAccountListByName}
      handleSelectClick={handleSelectClick}
      dialougeOpen={dialougeOpen}
      setDialougeOpen={setDialougeOpen}
      handleFetchData={handleFetchData}
      savingsAccountFullName={savingsAccountFullName}
      savingsAccountBalance={savingsAccountBalance}
      currentSavingsPage={currentSavingsPage}
      setCurrentSavingsPage={setCurrentSavingsPage}
      lastSavingsPage={lastSavingsPage}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleGetGuarantorSecurity={handleGetGuarantorSecurity}
      showGuarantorSecurityDialog={showGuarantorSecurityDialog}
      setShowGuarantorSecurityDialog={setShowGuarantorSecurityDialog}
      guarantorSecurityDetails={guarantorSecurityDetails}
    />
  );
};
export default RepaymentContainer;
