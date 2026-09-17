"use client";

import Deposit from "@/components/rectify/deposit";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useDeposit } from "./Hooks";
import { useDepositReport } from "@/container/deposit/report/Hooks";

const DepositContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getDepositDataLoading,
    postDepositLoading,
    getRectifyTypeApiCall,
    form,
    handleSubmit,
    handleDepositFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    resetTrigger,
    rectifyTypeId,
  } = useDeposit();

  const { getDepositReportProductTypeApiCall } = useDepositReport();

  useEffect(() => {
    if (token && orgId) {
      getRectifyTypeApiCall();
      getDepositReportProductTypeApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <Deposit
      loading={loading}
      getDepositDataLoading={getDepositDataLoading}
      postDepositLoading={postDepositLoading}
      form={form}
      handleSubmit={handleSubmit}
      handleDepositFormSubmit={handleDepositFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      resetTrigger={resetTrigger}
      rectifyTypeId={rectifyTypeId}
    />
  );
};
export default DepositContainer;
