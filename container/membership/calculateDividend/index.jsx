"use client";

import { useCalculateDividend } from "./Hooks";
import { useEffect } from "react";
import getCookieData from "@/utils/getCookieData";
import CalculateDividend from "@/components/membership/calculateDividend";

const CalculateDividendContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    form,
    handleSubmit,
    tableData,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleCalculateDividend,
    getLastDividendPaidDateApiCall,
  } = useCalculateDividend();

  useEffect(() => {
    if (token && orgId) {
      getLastDividendPaidDateApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <CalculateDividend
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      tableData={tableData}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      handleCalculateDividend={handleCalculateDividend}
    />
  );
};
export default CalculateDividendContainer;
