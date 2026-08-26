"use client";

import DefaulterList from "@/components/loan/defaulterList";
import { useDefaulterList } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useLedgerBalance } from "@/container/opening/ledgerBalance/Hooks";
import { useEffect } from "react";
import { useNewApplication } from "../newApplication/Hooks";
import { useLoanReport } from "../report/Hooks";

const DefaulterListContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    form,
    handleSubmit,
    tableData,
    asOnDate,
    productType,
    reportType,
  } = useDefaulterList();

  const { getLoanReportTypeApiCall } = useLoanReport();

  const { getLoanProductDataApiCall } = useNewApplication();

  const { getOpeningLedgerBranchApiCall } = useLedgerBalance();

  useEffect(() => {
    if (token && orgId) {
      getLoanReportTypeApiCall();
      getLoanProductDataApiCall(orgId);
      getOpeningLedgerBranchApiCall(orgId, branchId);
    }
  }, [token, orgId]);

  return (
    <DefaulterList
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      tableData={tableData}
      asOnDate={asOnDate}
      productType={productType}
      reportType={reportType}
    />
  );
};
export default DefaulterListContainer;
