"use client";

import BankOpening from "@/components/opening/bankOpening";
import getCookieData from "@/utils/getCookieData";
import { useBankOpening } from "./Hooks";
import { useEffect } from "react";

const BankOpeningContainer = () => {
  const orgId = getCookieData("orgId");

  const {
    loading,
    form,
    handleSubmit,
    getBankAccountTypeApiCall,
    getBankGlApiCall,
  } = useBankOpening();

  const accountType = form.watch("accountType");

  useEffect(() => {
    if (orgId) {
      getBankAccountTypeApiCall();
    }
  }, [orgId]);

  useEffect(() => {
    if (orgId && accountType) {
      getBankGlApiCall(orgId, accountType);
    }
  }, [accountType]);

  return (
    <BankOpening loading={loading} form={form} handleSubmit={handleSubmit} />
  );
};
export default BankOpeningContainer;
