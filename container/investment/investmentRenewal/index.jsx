"use client";

import InvestmentRenewal from "@/components/investment/investmentRenewal";
import getCookieData from "@/utils/getCookieData";
import { useInvestmentRenewal } from "./Hooks";
import { useInvestmentInterestPosting } from "../investmentInterest/Hooks";
import { useEffect } from "react";
import { useInvestmentOpenAccount } from "../investmentOpenAccount/Hooks";

const InvestmentRenewalContainer = () => {
  const orgId = getCookieData("orgId");
  const token = getCookieData("prioBankClientToken");

  const {
    loading,
    form,
    handleSubmit,
    handleCalculateMatureAmount,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    disableRenwal,
    isTdsEnabled,
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
  } = useInvestmentRenewal();

  const { getInvestmentAccountApiCall } = useInvestmentInterestPosting();

  const { getInvestmentInterestTypeApiCall, getInvestmentDurationApiCall } =
    useInvestmentOpenAccount();

  useEffect(() => {
    if (orgId && token) {
      getInvestmentAccountApiCall(orgId, 3);
      getInvestmentInterestTypeApiCall();
      getInvestmentDurationApiCall(orgId);
    }
  }, [orgId]);

  return (
    <InvestmentRenewal
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      handleCalculateMatureAmount={handleCalculateMatureAmount}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      disableRenwal={disableRenwal}
      isTdsEnabled={isTdsEnabled}
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
export default InvestmentRenewalContainer;
