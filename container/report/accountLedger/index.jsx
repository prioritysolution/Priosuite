"use client";

import getCookieData from "@/utils/getCookieData";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";
import { useAccountLedger } from "./Hooks";
import AccountLedger from "@/components/report/accountLedger";

const AccountLedgerContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    ledgerTableData,
    toDate,
    fromDate,
    ledger,
    totalDebit,
    totalCredit,
    showVoucherDetails,
    setShowVoucherDetails,
    handleShowVoucherDetails,
    totalDrAmount,
    totalCrAmount,
    getAccountLedgerDataApiCall,
  } = useAccountLedger();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branchId && token) {
      getOpeningLedgerBranchApiCall(orgId, branchId);
      getAccountLedgerDataApiCall();
    }
  }, [orgId, branchId, token]);

  return (
    <AccountLedger
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      ledgerTableData={ledgerTableData}
      fromDate={fromDate}
      toDate={toDate}
      ledgerId={ledger}
      totalDebit={totalDebit}
      totalCredit={totalCredit}
      showVoucherDetails={showVoucherDetails}
      setShowVoucherDetails={setShowVoucherDetails}
      handleShowVoucherDetails={handleShowVoucherDetails}
      totalDrAmount={totalDrAmount}
      totalCrAmount={totalCrAmount}
    />
  );
};
export default AccountLedgerContainer;
