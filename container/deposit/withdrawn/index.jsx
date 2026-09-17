"use client";

import Withdrawn from "@/components/deposit/withdrawn";
import getCookieData from "@/utils/getCookieData";
import { useWithdrawn } from "./Hooks";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useEffect } from "react";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const WithdrawnContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getWithdrawnLoading,
    getSpecimenLoading,
    postWithdrawnLoading,
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
    handleSeeSpecimen,
    photoLink,
    signatureLink,
    transMode,
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
    disableInstrument,
    getLedgerLoading,
  } = useWithdrawn();

  const { getNoteDenomApiCall } = useIssueMembership();
  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId) {
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <Withdrawn
      loading={loading}
      getWithdrawnLoading={getWithdrawnLoading}
      getSpecimenLoading={getSpecimenLoading}
      postWithdrawnLoading={postWithdrawnLoading}
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
      handleSeeSpecimen={handleSeeSpecimen}
      photoLink={photoLink}
      signatureLink={signatureLink}
      transMode={transMode}
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
      getLedgerLoading={getLedgerLoading}
    />
  );
};
export default WithdrawnContainer;
