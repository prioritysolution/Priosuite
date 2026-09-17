"use client";

import DepositInterestSetup from "@/components/master/depositInterestSetup";
import { useDepositInterestSetup } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useOpenDepositAccount } from "@/container/deposit/openDepositAccount/Hooks";

const DepositInterestMasterContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getDepositInterestProductApiCall,
    handleSubmit,
    handleAddTableData,
    form,
    tableData,
  } = useDepositInterestSetup();

  const { getDurationTypeDataApiCall } = useOpenDepositAccount();

  useEffect(() => {
    if (token && orgId) {
      getDepositInterestProductApiCall(orgId);
      getDurationTypeDataApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <DepositInterestSetup
      loading={loading}
      handleSubmit={handleSubmit}
      handleAddTableData={handleAddTableData}
      form={form}
      tableData={tableData}
    />
  );
};
export default DepositInterestMasterContainer;
