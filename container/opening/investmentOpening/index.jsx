"use client";

import InvestmentOpening from "@/components/opening/investmentOpening";
import getCookieData from "@/utils/getCookieData";
import { useInvestmentOpening } from "./Hooks";
import { useEffect } from "react";
import { useInvestmentOpenAccount } from "@/container/investment/investmentOpenAccount/Hooks";

const InvestmentOpeningContainer = () => {
  const orgId = getCookieData("orgId");
  const token = getCookieData("prioBankClientToken");

  const {
    loading,
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
    handleCalculateMatureAmount,
  } = useInvestmentOpening();

 const{ getInvestmentDurationApiCall
} = useInvestmentOpenAccount();

  useEffect(() => {
    if (orgId && token) {
      getInvestmentTypeApiCall();
      getInvestmentAccountTypeApiCall();
      getInvestmentInterestTypeApiCall();
      getInvestmentDurationApiCall(orgId);
    }
  }, [orgId, token]);

  return (
    <InvestmentOpening
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      handleCalculateMatureAmount={handleCalculateMatureAmount}
    />
  );
};
export default InvestmentOpeningContainer;
