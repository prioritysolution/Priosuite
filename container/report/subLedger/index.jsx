"use client";

import getCookieData from "@/utils/getCookieData";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";
import { useSubLedgerReport } from "./Hooks";
import SubLedger from "@/components/report/subLedger";
import { useSubLedger } from "@/container/master/subLedger/Hooks";

const SubLedgerContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    form,
    handleSubmit,
    subLedgerTableData,
    toDate,
    fromDate,
    subLedger,
    totalDebit,
    totalCredit,
    showVoucherDetails,
    setShowVoucherDetails,
    handleShowVoucherDetails,
    totalDrAmount,
    totalCrAmount,
    branch,
  } = useSubLedgerReport();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (orgId && branch && token) {
      getOpeningLedgerBranchApiCall(orgId, branch);
    }
  }, [orgId, branch, token]);

  const {
    getSubLedgerApiCall,
    currentPage: currentSubLedgerPage,
    setCurrentPage: setCurrentSubLedgerPage,
    lastPage: lastSubLedgerPage,
    subLedgerInput,
    setSubLedgerInput,
  } = useSubLedger();

  const handleSearchSubLedger = () => {
    setCurrentSubLedgerPage(1);
    if (orgId && branch)
      getSubLedgerApiCall(orgId, branch, "INPUT", 1, subLedgerInput);
  };

  const handleScrollSubLedger = () => {
    setCurrentSubLedgerPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      orgId &&
      branch &&
      currentSubLedgerPage > 1 &&
      currentSubLedgerPage <= lastSubLedgerPage
    )
      getSubLedgerApiCall(
        orgId,
        branch,
        "INPUT",
        currentSubLedgerPage,
        subLedgerInput,
      );
  }, [currentSubLedgerPage, orgId]);

  useEffect(() => {
    if (orgId && branch) getSubLedgerApiCall(orgId, branch, "INPUT", 1, "");
    setCurrentSubLedgerPage(1);
    setSubLedgerInput("");
  }, [branch, orgId]);

  return (
    <SubLedger
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      subLedgerTableData={subLedgerTableData}
      fromDate={fromDate}
      toDate={toDate}
      subLedgerId={subLedger}
      totalDebit={totalDebit}
      totalCredit={totalCredit}
      showVoucherDetails={showVoucherDetails}
      setShowVoucherDetails={setShowVoucherDetails}
      handleShowVoucherDetails={handleShowVoucherDetails}
      totalDrAmount={totalDrAmount}
      totalCrAmount={totalCrAmount}
      handleSearchSubLedger={handleSearchSubLedger}
      handleScrollSubLedger={handleScrollSubLedger}
      subLedgerInput={subLedgerInput}
      setSubLedgerInput={setSubLedgerInput}
    />
  );
};
export default SubLedgerContainer;
