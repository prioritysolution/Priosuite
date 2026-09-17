"use client";

import InvestmentOpenAccount from "@/components/investment/investmentOpenAccount";
import getCookieData from "@/utils/getCookieData";
import { useInvestmentOpenAccount } from "./Hooks";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useEffect } from "react";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const InvestmentOpenAccountContainer = () => {
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
    getInvestmentTypeApiCall,
    getInvestmentAccountTypeApiCall,
    getInvestmentInterestTypeApiCall,
    getInvestmentPrincipalLedgerApiCall,
    getInvestmentInterestLedgerApiCall,
    transMode,
    handleCalculateMatureAmount,
    getInvestmentDurationApiCall
  } = useInvestmentOpenAccount();

  const { getNoteDenomApiCall } = useIssueMembership();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (orgId && token) {
      getInvestmentTypeApiCall();
      getInvestmentAccountTypeApiCall();
      getInvestmentInterestTypeApiCall();
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
      getInvestmentDurationApiCall(orgId);
    }
  }, [orgId, token]);

  return (
    <InvestmentOpenAccount
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
      handleCalculateMatureAmount={handleCalculateMatureAmount}
    />
  );
};
export default InvestmentOpenAccountContainer;
