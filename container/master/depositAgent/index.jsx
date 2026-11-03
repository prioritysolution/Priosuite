"use client";

import DepositAgent from "@/components/master/depositAgent";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useDepositAgent } from "./Hooks";

const DepositAgentContainer = () => {
  const orgId = getCookieData("orgId");

  const {
    form,
    handleSubmit,
    handleMemberFormSubmit,
    loading,
    getMemberDataLoading,
    visibleBlock,
    resetTrigger,
    getPaymentTypeDataApiCall,
  } = useDepositAgent();

  useEffect(() => {
    if (orgId) getPaymentTypeDataApiCall(orgId);
  }, [orgId]);

  return (
    <DepositAgent
      form={form}
      handleSubmit={handleSubmit}
      handleMemberFormSubmit={handleMemberFormSubmit}
      loading={loading}
      getMemberDataLoading={getMemberDataLoading}
      visibleBlock={visibleBlock}
      resetTrigger={resetTrigger}
    />
  );
};
export default DepositAgentContainer;
