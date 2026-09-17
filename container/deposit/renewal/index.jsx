"use client";

import Renewal from "@/components/deposit/renewal";
import { useRenewal } from "./Hooks";
import { useEffect } from "react";
import getCookieData from "@/utils/getCookieData";
import { useOpenDepositAccount } from "../openDepositAccount/Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const RenewalContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getRenewalLoading,
    postRenewalLoading,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    checkDepositDurationDisable,
    checkDepositDurationMessage,
    resetTrigger,
  } = useRenewal();

  const { getDurationTypeDataApiCall } = useOpenDepositAccount();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId) {
      getDurationTypeDataApiCall(orgId);
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <Renewal
      loading={loading}
      getRenewalLoading={getRenewalLoading}
      postRenewalLoading={postRenewalLoading}
      form={form}
      handleSubmit={handleSubmit}
      handleAccountFormSubmit={handleAccountFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      checkDepositDurationDisable={checkDepositDurationDisable}
      checkDepositDurationMessage={checkDepositDurationMessage}
      resetTrigger={resetTrigger}
    />
  );
};
export default RenewalContainer;
