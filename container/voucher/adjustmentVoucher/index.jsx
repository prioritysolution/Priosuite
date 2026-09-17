"use client";

import AdjustmentVoucher from "@/components/voucher/adjustmentVoucher";
import getCookieData from "@/utils/getCookieData";
import { useAdjustmentVoucher } from "./Hooks";
import { useEffect } from "react";

const AdjustmentVoucherContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getAdjustmentVoucherLedgerListApiCall,
    tableData,
    totalCredit,
    totalDebit,
    handleDeleteTableData,
    handlePostAdjustmentVoucher,
  } = useAdjustmentVoucher();

  useEffect(() => {
    if (token && orgId) {
      getAdjustmentVoucherLedgerListApiCall();
    }
  }, [token, orgId]);

  return (
    <AdjustmentVoucher
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      tableData={tableData}
      totalCredit={totalCredit}
      totalDebit={totalDebit}
      handleDeleteTableData={handleDeleteTableData}
      handlePostAdjustmentVoucher={handlePostAdjustmentVoucher}
    />
  );
};
export default AdjustmentVoucherContainer;
