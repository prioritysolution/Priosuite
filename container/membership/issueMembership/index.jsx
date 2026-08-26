"use client";
import IssueMembership from "@/components/membership/issueMembership";
import { useIssueMembership } from "./Hooks";
import { useEffect } from "react";
import { useShareProduct } from "@/container/master/shareProduct/Hooks";
import getCookieData from "@/utils/getCookieData";
import { useMemberProfile } from "../memberProfile/Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";

const IssueMembershipContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getMemberDataLoading,
    postIssueMembershipLoading,
    cashDenomData,
    inDenominators,
    outDenominators,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    getNoteDenomApiCall,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    admissionDisable,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    transMode,
    insufficientBalanceDisable,
    resetTrigger,
    isReceiptOpen,
    setIsReceiptOpen,
    shareIssueReceiptData,
    handleGenerateShareIssueReceipt,
  } = useIssueMembership();

  const { getMemberTypeDataApiCall } = useShareProduct();

  const { getRelationTypeDataApiCall } = useMemberProfile();

  const { getBankAccountApiCall } = useBankDeposit();

  useEffect(() => {
    if (token && orgId) {
      getMemberTypeDataApiCall(orgId);
      getNoteDenomApiCall();
      getRelationTypeDataApiCall();
      getBankAccountApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <IssueMembership
      loading={loading}
      getMemberDataLoading={getMemberDataLoading}
      postIssueMembershipLoading={postIssueMembershipLoading}
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
      handleMemberFormSubmit={handleMemberFormSubmit}
      visibleBlock={visibleBlock}
      admissionDisable={admissionDisable}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      transMode={transMode}
      insufficientBalanceDisable={insufficientBalanceDisable}
      resetTrigger={resetTrigger}
      isReceiptOpen={isReceiptOpen}
      setIsReceiptOpen={setIsReceiptOpen}
      shareIssueReceiptData={shareIssueReceiptData}
      handleGenerateShareIssueReceipt={handleGenerateShareIssueReceipt}
    />
  );
};
export default IssueMembershipContainer;
