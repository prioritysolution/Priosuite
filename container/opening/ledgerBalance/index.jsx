"use client";

import LedgerBalance from "@/components/opening/ledgerBalance";
import { useLedgerBalance } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const LedgerBalanceContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    getLedgerLoading,
    getSubHeadLoading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getOpeningLedgerBranchApiCall,
    getOpeningLedgerMainHeadApiCall,
  } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
      getOpeningLedgerMainHeadApiCall();
    }
  }, [orgId, branchId, token]);

  return (
    <LedgerBalance
      loading={loading}
      getLedgerLoading={getLedgerLoading}
      getSubHeadLoading={getSubHeadLoading}
      form={form}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
    />
  );
};
export default LedgerBalanceContainer;
