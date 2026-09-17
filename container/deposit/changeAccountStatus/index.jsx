"use client";

import ChangeAccountStatus from "@/components/deposit/changeAccountStatus";
import { useChangeAccountStatus } from "./Hooks";
import { useEffect } from "react";

const ChangeAccountStatusContainer = () => {
  const {
    loading,
    getDepositLoading,
    updateAccountStatusLoading,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    resetTrigger,
    depositProduct,
    getStatusListApiCall,
    statusListData,
  } = useChangeAccountStatus();

  useEffect(() => {
    getStatusListApiCall();
  }, []);

  return (
    <ChangeAccountStatus
      loading={loading}
      getDepositLoading={getDepositLoading}
      updateAccountStatusLoading={updateAccountStatusLoading}
      form={form}
      handleSubmit={handleSubmit}
      handleAccountFormSubmit={handleAccountFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      resetTrigger={resetTrigger}
      depositProduct={depositProduct}
      statusListData={statusListData}
    />
  );
};
export default ChangeAccountStatusContainer;
