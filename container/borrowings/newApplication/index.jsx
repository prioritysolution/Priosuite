"use client";

import NewApplication from "@/components/borrowings/newApplication";
import { useBorrowingsNewApplication } from "./Hooks";
import { useEffect } from "react";
import getCookieData from "@/utils/getCookieData";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const NewApplicationContainer = () => {
  const orgId = getCookieData("orgId");
  const token = getCookieData("prioBankClientToken");

  const {
    loading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getBorrowingsProductTypeApiCall,
    getBorrowingsRepayModeApiCall,
    getBorrowingsPrincipalLedgerApiCall,
    getBorrowingsInterestLedgerApiCall,
  } = useBorrowingsNewApplication();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId) {
      getBorrowingsProductTypeApiCall(orgId);
      getBorrowingsRepayModeApiCall(orgId);
      getBorrowingsPrincipalLedgerApiCall(orgId);
      getBorrowingsInterestLedgerApiCall(orgId);
      getBankAccountApiCall(orgId);
    }
  }, [orgId]);

  return (
    <NewApplication
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
    />
  );
};
export default NewApplicationContainer;
