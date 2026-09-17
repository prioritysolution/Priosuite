"use client";

import OpenBankAccount from "@/components/banking/openBankAccount";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useOpenBankAccount } from "./Hooks";

const OpenBankAccountContainer = () => {
  const orgId = getCookieData("orgId");

  const {
    loading,
    form,
    handleSubmit,
    getBankAccountTypeApiCall,
    getBankGlApiCall,
  } = useOpenBankAccount();

  const accountType = form.watch("accountType");

  useEffect(() => {
    if (orgId) {
      getBankAccountTypeApiCall();
    }
  }, [orgId]);

  useEffect(() => {
    if (accountType && orgId) {
      getBankGlApiCall(orgId, accountType);
    }
  }, [accountType, orgId]);

  return (
    <OpenBankAccount
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
    />
  );
};
export default OpenBankAccountContainer;
