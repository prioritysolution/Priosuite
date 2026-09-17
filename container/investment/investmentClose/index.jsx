"use client";

import InvestmentClose from "@/components/investment/investmentClose";
import getCookieData from "@/utils/getCookieData";
import { useInvestmentInterestPosting } from "../investmentInterest/Hooks";
import { useInvestmentClose } from "./Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";
import { useEffect } from "react";

const InvestmentCloseContainer = () => {
  const orgId = getCookieData("orgId");
  const token = getCookieData("prioBankClientToken");

  const { getInvestmentAccountApiCall } = useInvestmentInterestPosting();

  const { getBankAccountApiCall } = useBankDeposit();

  const {
    loading,
    form,
    handleSubmit,
    handleCalculateClosingInterest,
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
    toDate,
    getLedgerLoading,
  } = useInvestmentClose();

  useEffect(() => {
    if (orgId && token) {
      getInvestmentAccountApiCall(orgId, 4);
      getBankAccountApiCall(orgId);
    }
  }, [orgId]);

  return (
    <InvestmentClose
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      handleCalculateClosingInterest={handleCalculateClosingInterest}
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
      toDate={toDate}
      getLedgerLoading={getLedgerLoading}
    />
  );
};
export default InvestmentCloseContainer;
