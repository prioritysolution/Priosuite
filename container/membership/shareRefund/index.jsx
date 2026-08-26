"use client";

import ShareRefund from "@/components/membership/shareRefund";
import getCookieData from "@/utils/getCookieData";
import { useShareRefund } from "./Hooks";
import { useEffect } from "react";
import { useIssueMembership } from "../issueMembership/Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const ShareRefundContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getMemberDataLoading,
    postShareRefundLoading,
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
    transMode,
    refundAmt,
    savings,
    bank,
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
  } = useShareRefund();

  const { getNoteDenomApiCall } = useIssueMembership();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId) {
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <ShareRefund
      loading={loading}
      getMemberDataLoading={getMemberDataLoading}
      postShareRefundLoading={postShareRefundLoading}
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
      transMode={transMode}
      refundAmt={refundAmt}
      savings={savings}
      bank={bank}
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
    />
  );
};
export default ShareRefundContainer;
