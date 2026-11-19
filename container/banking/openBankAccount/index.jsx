"use client";

import OpenBankAccount from "@/components/banking/openBankAccount";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useOpenBankAccount } from "./Hooks";
import { getBankGlData } from "./OpenBankAccountReducer";

const OpenBankAccountContainer = () => {
  const orgId = getCookieData("orgId");
  const dispatch = useDispatch();

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
    form.setValue("bankGl", "");
    if (accountType && orgId) {
      getBankGlApiCall(orgId, accountType);
    } else {
      dispatch(getBankGlData([]));
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
