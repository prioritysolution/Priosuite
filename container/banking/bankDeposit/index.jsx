"use client";

import BankDeposit from "@/components/banking/bankDeposit";
import { useBankDeposit } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useVoucherEntry } from "@/container/voucher/voucherEntry/Hooks";

const BankDepositContainer = () => {
  const orgId = getCookieData("orgId");
  const token = getCookieData("prioBankClientToken");

  const {
    loading,
    cashDenomData,
    denominators,
    cashTransactionTotal,
    cashTransactionGrandTotal,
    handleDenominatorChange,
    form,
    handleSubmit,
    getBankAccountApiCall,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleShowLedger,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalWithdrawn,
    totalDeposit,
    userName,
    currentDate,
    currentTime,
    fromDate,
    getBankLoading,
    subLedgerInput,
    setSubLedgerInput,
    gl,
    handleAddTransferTable,
    transferTableData,
    handleDeleteTransferTable,
  } = useBankDeposit();

  const {
    currentSubLedgerPage,
    setCurrentSubLedgerPage,
    lastSubLedgerPage,
    getVoucherLedgerListApiCall,
    getVoucherSubLedgerListApiCall,
  } = useVoucherEntry();

  const { getNoteDenomApiCall } = useIssueMembership();

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
        subLedgerInput
      );
  }, [currentSubLedgerPage, orgId]);

  useEffect(() => {
    if (orgId && gl) getVoucherSubLedgerListApiCall(orgId, gl, 1, "");
    setCurrentSubLedgerPage(1);
    setSubLedgerInput("");
  }, [gl, orgId]);

  useEffect(() => {
    if (orgId && token) {
      getVoucherLedgerListApiCall();
      getBankAccountApiCall(orgId);
      getNoteDenomApiCall();
    }
  }, [orgId]);

  return (
    <BankDeposit
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
      handleShowLedger={handleShowLedger}
      showLedger={showLedger}
      setShowLedger={setShowLedger}
      ledgerHeaderData={ledgerHeaderData}
      ledgerTableData={ledgerTableData}
      totalWithdrawn={totalWithdrawn}
      totalDeposit={totalDeposit}
      userName={userName}
      currentDate={currentDate}
      currentTime={currentTime}
      fromDate={fromDate}
      getBankLoading={getBankLoading}
      handleSearchSubLedger={handleSearchSubLedger}
      handleScrollSubLedger={handleScrollSubLedger}
      subLedgerInput={subLedgerInput}
      setSubLedgerInput={setSubLedgerInput}
      handleAddTransferTable={handleAddTransferTable}
      transferTableData={transferTableData}
      handleDeleteTransferTable={handleDeleteTransferTable}
    />
  );
};
export default BankDepositContainer;
