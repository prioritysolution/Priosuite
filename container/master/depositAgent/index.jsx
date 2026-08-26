"use client";

import DepositAgent from "@/components/master/depositAgent";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useDepositAgent } from "./Hooks";

const DepositAgentContainer = () => {
  const orgId = getCookieData("orgId");

  const { form, handleSubmit, loading, getPaymentTypeDataApiCall } =
    useDepositAgent();

  useEffect(() => {
    if (orgId) getPaymentTypeDataApiCall(orgId);
  }, [orgId]);

  return (
    <DepositAgent form={form} handleSubmit={handleSubmit} loading={loading} />
  );
};
export default DepositAgentContainer;
