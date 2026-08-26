"use client";

import Disburse from "@/components/loan/disburse";
import getCookieData from "@/utils/getCookieData";
import { useDisburse } from "./Hooks";
import { useEffect } from "react";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const DisburseContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    loading,
    getDisburseListLoading,
    cashDenomData,
    inDenominators,
    outDenominators,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getDisburseListApiCall,
    transMode,
    showForm,
    handleOpenForm,
    handleBackToTable,
    showSuccessDialog,
    postDisburseLoading,
    deductions,
  } = useDisburse();

  const { getNoteDenomApiCall } = useIssueMembership();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId && branchId) getDisburseListApiCall(orgId, branchId);
  }, [token, orgId, branchId]);

  useEffect(() => {
    if (token && orgId) {
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <Disburse
      loading={loading}
      getDisburseListLoading={getDisburseListLoading}
      notes={cashDenomData}
      inDenominators={inDenominators}
      outDenominators={outDenominators}
      cashInTransactionTotal={cashInTransactionTotal}
      cashOutTransactionTotal={cashOutTransactionTotal}
      cashInTransactionGrandTotal={cashInTransactionGrandTotal}
      cashOutTransactionGrandTotal={cashOutTransactionGrandTotal}
      handleInDenominatorChange={handleInDenominatorChange}
      handleOutDenominatorChange={handleOutDenominatorChange}
      form={form}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      transMode={transMode}
      showForm={showForm}
      handleOpenForm={handleOpenForm}
      handleBackToTable={handleBackToTable}
      showSuccessDialog={showSuccessDialog}
      postDisburseLoading={postDisburseLoading}
      deductions={deductions}
    />
  );
};
export default DisburseContainer;
