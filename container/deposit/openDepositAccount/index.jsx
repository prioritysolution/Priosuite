"use client";

import OpenDepositAccount from "@/components/deposit/openDepositAccount";
import { useOpenDepositAccount } from "./Hooks";
import { useEffect } from "react";
import getCookieData from "@/utils/getCookieData";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useMemberProfile } from "@/container/membership/memberProfile/Hooks";
import { useBankDeposit } from "@/container/banking/bankDeposit/Hooks";
import { useSelector } from "react-redux";

const OpenDepositAccountContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  // Access beg_date from Redux store
  const begDate = useSelector((state) => state?.login?.beg_date);

  const {
    loading,
    getDepositProductLoading,
    postOpenDepositLoading,
    getOpenDepositLoading,
    accountType,
    depositProduct,
    openingDate,
    openingAmount,
    duration,
    durationUnit,
    payoutMode,
    rateOfInterest,
    operationMode,
    isAvailEcs,
    ecsAccount,
    isPayoutInterest,
    transMode,
    payoutAmount,
    savings,
    savingsBalance,
    cashDenomData,
    inDenominators,
    outDenominators,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    getDepositAccountTypeDataApiCall,
    getDurationTypeDataApiCall,
    getMaturityInstructionDataApiCall,
    getOperationModeDataApiCall,
    getPayoutModeDataApiCall,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    admissionDisable,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleJointAccountAdd,
    handleJointAccountDelete,
    handleAddNominee,
    handleDeleteNominee,
    jointMemberDialougeOpen,
    setJointMemberDialougeOpen,
    specialJointDialogOpen,
    setSpecialJointDialogOpen,
    deleteJointMemberDialougeOpen,
    setDeleteJointMemberDialougeOpen,
    grpInstMemberData,
    grpInstMemberLoading,
    GetGrpInstMemberApiCall,
    checkDepositAmountDisable,
    checkDepositAmountMessage,
    checkDepositDurationDisable,
    checkDepositDurationMessage,
    resetTrigger,
    isReceiptOpen,
    setIsReceiptOpen,
    depositReceiptData,
    handleGenerateDepositReceipt,
    insufficientBalanceDisable,
    allowProcessDeposit,
  } = useOpenDepositAccount();

  const { getNoteDenomApiCall } = useIssueMembership();

  const { getBankAccountApiCall } = useBankDeposit();

  const { getRelationTypeDataApiCall } = useMemberProfile();

  useEffect(() => {
    if (token && orgId) {
      getNoteDenomApiCall();
      getBankAccountApiCall(orgId);
      getDepositAccountTypeDataApiCall(orgId);
      getDurationTypeDataApiCall(orgId);
      getRelationTypeDataApiCall();
      getMaturityInstructionDataApiCall(orgId);
      getOperationModeDataApiCall(orgId);
      getPayoutModeDataApiCall(orgId);
    }
  }, [token, orgId]);

  console.log("Deposit Account - Begin Date:", begDate);

  return (
    <OpenDepositAccount
      loading={loading}
      getDepositProductLoading={getDepositProductLoading}
      getOpenDepositLoading={getOpenDepositLoading}
      accountType={accountType}
      depositProduct={depositProduct}
      openingDate={openingDate}
      openingAmount={openingAmount}
      duration={duration}
      durationUnit={durationUnit}
      payoutMode={payoutMode}
      rateOfInterest={rateOfInterest}
      operationMode={operationMode}
      isAvailEcs={isAvailEcs}
      ecsAccount={ecsAccount}
      isPayoutInterest={isPayoutInterest}
      transMode={transMode}
      payoutAmount={payoutAmount}
      savings={savings}
      savingsBalance={savingsBalance}
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
      handleJointAccountAdd={handleJointAccountAdd}
      handleJointAccountDelete={handleJointAccountDelete}
      handleAddNominee={handleAddNominee}
      handleDeleteNominee={handleDeleteNominee}
      deleteJointMemberDialougeOpen={deleteJointMemberDialougeOpen}
      setDeleteJointMemberDialougeOpen={setDeleteJointMemberDialougeOpen}
      checkDepositAmountDisable={checkDepositAmountDisable}
      checkDepositAmountMessage={checkDepositAmountMessage}
      checkDepositDurationDisable={checkDepositDurationDisable}
      checkDepositDurationMessage={checkDepositDurationMessage}
      jointMemberDialougeOpen={jointMemberDialougeOpen}
      setJointMemberDialougeOpen={setJointMemberDialougeOpen}
      specialJointDialogOpen={specialJointDialogOpen}
      setSpecialJointDialogOpen={setSpecialJointDialogOpen}
      grpInstMemberData={grpInstMemberData}
      grpInstMemberLoading={grpInstMemberLoading}
      GetGrpInstMemberApiCall={GetGrpInstMemberApiCall}
      resetTrigger={resetTrigger}
      isReceiptOpen={isReceiptOpen}
      setIsReceiptOpen={setIsReceiptOpen}
      depositReceiptData={depositReceiptData}
      handleGenerateDepositReceipt={handleGenerateDepositReceipt}
      insufficientBalanceDisable={insufficientBalanceDisable}
      allowProcessDeposit={allowProcessDeposit}
      begDate={begDate}
    />
  );
};
export default OpenDepositAccountContainer;
