"use client";

import LoginPasswordPolicy from "@/components/tools/loginPasswordPolicy";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useLoginPasswordPolicy } from "./Hooks";

const LoginPasswordPolicyContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const { form, handleSubmit, loading, saving, getPolicyApiCall } =
    useLoginPasswordPolicy();

  useEffect(() => {
    if (token && orgId) getPolicyApiCall(orgId);
  }, [token, orgId]);

  return (
    <LoginPasswordPolicy
      form={form}
      handleSubmit={handleSubmit}
      loading={loading}
      saving={saving}
    />
  );
};

export default LoginPasswordPolicyContainer;
