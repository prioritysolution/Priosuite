"use client";

import VoucherEntry from "@/components/voucher/voucherEntry";
import getCookieData from "@/utils/getCookieData";
import { useVoucherEntry } from "./Hooks";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useEffect } from "react";

const VoucherEntryContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    postVoucherLoading,
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
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    subLedgerBalance,
    getVoucherLedgerListApiCall,
    voucherType,
    tableData,
    totalCredit,
    totalDebit,
    handleDeleteTableData,
    handlePostVoucherEntry,
    getVoucherSubLedgerListApiCall,
    gl,
    glData,
    currentSubLedgerPage,
    setCurrentSubLedgerPage,
    lastSubLedgerPage,
    subLedgerInput,
    setSubLedgerInput,
    handleGenerateReceipt,
    isReceiptOpen,
    setIsReceiptOpen,
    receiptData,
    isDateChecked,
    setIsDateChecked,
    getSubHeadApiCall,
  } = useVoucherEntry();

  const { getNoteDenomApiCall } = useIssueMembership();

  const subHead = form.watch("subHead");

  const handleSearchSubLedger = () => {
    setCurrentSubLedgerPage(1);
    if (orgId && gl)
      getVoucherSubLedgerListApiCall(orgId, gl, 1, subLedgerInput);
  };

  const handleScrollSubLedger = () => {
    setCurrentSubLedgerPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      gl &&
      currentSubLedgerPage > 1 &&
      currentSubLedgerPage <= lastSubLedgerPage
    )
      getVoucherSubLedgerListApiCall(
        orgId,
        gl,
        currentSubLedgerPage,
        subLedgerInput,
      );
  }, [currentSubLedgerPage, orgId]);

  useEffect(() => {
    if (orgId && gl) getVoucherSubLedgerListApiCall(orgId, gl, 1, "");
    setCurrentSubLedgerPage(1);
    setSubLedgerInput("");
    form.setValue("subLedger", "");
  }, [gl, orgId]);

  useEffect(() => {
    if (token && orgId) {
      getNoteDenomApiCall();
      getSubHeadApiCall(orgId);
    }
  }, [token, orgId]);

  useEffect(() => {
    if (orgId && subHead) {
      getVoucherLedgerListApiCall(orgId, subHead);
    }
  }, [subHead, orgId]);

  return (
    <VoucherEntry
      loading={loading}
      postVoucherLoading={postVoucherLoading}
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
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      subLedgerBalance={subLedgerBalance}
      voucherType={voucherType}
      tableData={tableData}
      totalCredit={totalCredit}
      totalDebit={totalDebit}
      handleDeleteTableData={handleDeleteTableData}
      handlePostVoucherEntry={handlePostVoucherEntry}
      handleSearchSubLedger={handleSearchSubLedger}
      handleScrollSubLedger={handleScrollSubLedger}
      subLedgerInput={subLedgerInput}
      setSubLedgerInput={setSubLedgerInput}
      handleGenerateReceipt={handleGenerateReceipt}
      isReceiptOpen={isReceiptOpen}
      setIsReceiptOpen={setIsReceiptOpen}
      receiptData={receiptData}
      isDateChecked={isDateChecked}
      setIsDateChecked={setIsDateChecked}
      glData={glData}
    />
  );
};
export default VoucherEntryContainer;
