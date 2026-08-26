"use client";

import Denomination from "@/components/opening/denomination";
import { useDenomination } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useVoucherEntry } from "@/container/voucher/voucherEntry/Hooks";
import { useLedgerBalance } from "../ledgerBalance/Hooks";

const DenominationContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    cashDenomData,
    denominators,
    // cashTransactionTotal,
    // cashTransactionGrandTotal,
    handleDenominatorChange,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
  } = useDenomination();

  const { getNoteDenomApiCall } = useIssueMembership();
  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
      getNoteDenomApiCall();
    }
  }, [orgId]);

  return (
    <Denomination
      loading={loading}
      notes={cashDenomData}
      denominators={denominators}
      //   cashTransactionTotal={cashTransactionTotal}
      //   cashTransactionGrandTotal={cashTransactionGrandTotal}
      handleDenominatorChange={handleDenominatorChange}
      form={form}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
    />
  );
};
export default DenominationContainer;
