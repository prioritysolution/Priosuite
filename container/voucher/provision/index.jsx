"use client";

import Provision from "@/components/voucher/provision";
import getCookieData from "@/utils/getCookieData";
import { useProvision } from "./Hooks";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useEffect } from "react";
import { useAdjustmentVoucher } from "../adjustmentVoucher/Hooks";

const ProvisionContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
  } = useProvision();

  const { getAdjustmentVoucherLedgerListApiCall } = useAdjustmentVoucher();

  useEffect(() => {
    if (token && orgId) {
      getAdjustmentVoucherLedgerListApiCall();
    }
  }, [token, orgId]);

  return (
    <Provision
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
    />
  );
};
export default ProvisionContainer;
