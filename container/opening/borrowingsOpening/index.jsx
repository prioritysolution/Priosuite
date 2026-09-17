"use client";

import BorrowingsOpening from "@/components/opening/borrowingsOpening";
import getCookieData from "@/utils/getCookieData";
import { useBorrowingsOpening } from "./Hooks";
import { useEffect } from "react";

const BorrowingsOpeningContainer = () => {
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
  } = useBorrowingsOpening();

  useEffect(() => {
    if (token && orgId) {
      getBorrowingsProductTypeApiCall(orgId);
      getBorrowingsRepayModeApiCall(orgId);
      getBorrowingsPrincipalLedgerApiCall(orgId);
      getBorrowingsInterestLedgerApiCall(orgId);
    }
  }, [orgId]);
  return (
    <BorrowingsOpening
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
    />
  );
};
export default BorrowingsOpeningContainer;
