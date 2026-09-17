"use client";

import InstallmentDeposit from "@/components/investment/installmentDeposit";
import getCookieData from "@/utils/getCookieData";
import { useInvestmentInstallmentDeposit } from "./Hooks";
import { useInvestmentInterestPosting } from "../investmentInterest/Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";
import { useEffect } from "react";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";

const InstallmentDepositContainer = () => {
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
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    transMode,
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
    getLedgerLoading,
  } = useInvestmentInstallmentDeposit();

  const { getInvestmentAccountApiCall } = useInvestmentInterestPosting();

  const { getNoteDenomApiCall } = useIssueMembership();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (orgId && token) {
      getInvestmentAccountApiCall(orgId, 2);
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
    }
  }, [orgId]);

  return (
    <InstallmentDeposit
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
      transMode={transMode}
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
      getLedgerLoading={getLedgerLoading}
    />
  );
};
export default InstallmentDepositContainer;
