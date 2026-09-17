"use client";

import PassbookSettings from "@/components/master/passbookSettings";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { usePassbookSettings } from "./Hooks";

const PassbookSettingsContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const { getModuleDataApiCall, loading, form, handleSubmit } =
    usePassbookSettings();

  useEffect(() => {
    if (token && orgId) {
      getModuleDataApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <PassbookSettings
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
    />
  );
};
export default PassbookSettingsContainer;
