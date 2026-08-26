"use client";

import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useMature } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import Mature from "@/components/deposit/mature";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const MatureContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getMatureLoading,
    getSpecimenLoading,
    postMatureLoading,
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
    handleSeeSpecimen,
    photoLink,
    signatureLink,
    optionForm,
    handleOptionFormSubmit,
    showSearchAccountForm,
    disableOperationTypeForm,
    transMode,
    handleSearchAccountListByMemberNo,
    handleSearchAccountListByName,
    handleSelectClick,
    dialougeOpen,
    setDialougeOpen,
    handleFetchData,
    savingsAccountFullName,
    savingsAccountBalance,
    showMatureDialog,
    setShowMatureDialog,
    handleCancelPremature,
    handleResetOperation,
    handleCalculateMaturityInterest,
    isInterestCalculated,
    getDepositMaturityInterestApiCall,
    getDepositMaturityBonusInterestApiCall,
    showBonusDialog,
    setShowBonusDialog,
    showPayoutInterestDialog,
    setShowPayoutInterestDialog,
    resetTrigger,
    currentSavingsPage,
    setCurrentSavingsPage,
    lastSavingsPage,
    activeTab,
    setActiveTab,
    getLedgerLoading,
  } = useMature();

  const { getNoteDenomApiCall } = useIssueMembership();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId) {
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
    }
  }, [token]);

  return (
    <Mature
      loading={loading}
      getMatureLoading={getMatureLoading}
      getSpecimenLoading={getSpecimenLoading}
      postMatureLoading={postMatureLoading}
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
      handleSeeSpecimen={handleSeeSpecimen}
      photoLink={photoLink}
      signatureLink={signatureLink}
      optionForm={optionForm}
      handleOptionFormSubmit={handleOptionFormSubmit}
      showSearchAccountForm={showSearchAccountForm}
      disableOperationTypeForm={disableOperationTypeForm}
      transMode={transMode}
      handleSearchAccountListByMemberNo={handleSearchAccountListByMemberNo}
      handleSearchAccountListByName={handleSearchAccountListByName}
      handleSelectClick={handleSelectClick}
      dialougeOpen={dialougeOpen}
      setDialougeOpen={setDialougeOpen}
      handleFetchData={handleFetchData}
      savingsAccountFullName={savingsAccountFullName}
      savingsAccountBalance={savingsAccountBalance}
      showMatureDialog={showMatureDialog}
      setShowMatureDialog={setShowMatureDialog}
      handleCancelPremature={handleCancelPremature}
      handleResetOperation={handleResetOperation}
      handleCalculateMaturityInterest={handleCalculateMaturityInterest}
      isInterestCalculated={isInterestCalculated}
      getDepositMaturityInterestApiCall={getDepositMaturityInterestApiCall}
      getDepositMaturityBonusInterestApiCall={
        getDepositMaturityBonusInterestApiCall
      }
      showBonusDialog={showBonusDialog}
      setShowBonusDialog={setShowBonusDialog}
      showPayoutInterestDialog={showPayoutInterestDialog}
      setShowPayoutInterestDialog={setShowPayoutInterestDialog}
      resetTrigger={resetTrigger}
      currentSavingsPage={currentSavingsPage}
      setCurrentSavingsPage={setCurrentSavingsPage}
      lastSavingsPage={lastSavingsPage}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      getLedgerLoading={getLedgerLoading}
    />
  );
};
export default MatureContainer;
