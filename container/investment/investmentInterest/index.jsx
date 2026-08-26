"use client";

import InvestmentInterest from "@/components/investment/investmentInterest";
import getCookieData from "@/utils/getCookieData";
import { useInvestmentInterestPosting } from "@/container/investment/investmentInterest/Hooks";
import {} from "@/container/investment/investmentInterest/Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";
import { useEffect } from "react";

const InvestmentInterestContainer = () => {
  const orgId = getCookieData("orgId");
  const token = getCookieData("prioBankClientToken");

  const {
    loading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getInvestmentAccountApiCall,
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
  } = useInvestmentInterestPosting();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (orgId && token) {
      getInvestmentAccountApiCall(orgId, 1);
      getBankAccountApiCall(orgId);
    }
  }, [orgId]);

  return (
    <InvestmentInterest
      loading={loading}
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
      getLedgerLoading={getLedgerLoading}
    />
  );
};
export default InvestmentInterestContainer;
