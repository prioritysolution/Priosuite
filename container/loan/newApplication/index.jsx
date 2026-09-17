"use client";

import { NewApplication } from "@/components/loan/newApplication";
import { useNewApplication } from "./Hooks";
import { useState } from "react";
import getCookieData from "@/utils/getCookieData";

const NewApplicationContainer = () => {
  const {
    loading,
    form,
    externalSecurityTypes,
    FormhandleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    amountErrorMessage,
    showEmi,
    loanEligible,
    handleAddSecurityTable,
    handleAddExternalSecurityTable,
    handleDeleteSecurityTable,
    securityTable,
    resetTrigger,
    postNewLoanLoading,
    disableSecurityType,
    handleGuaranteeMemberSearch,
    handleAddGuaranteeTable,
    resetGuaranteeMember,
    guaranteeTable,
    handleDeleteGuaranteeTable,
    guaranteeMemberDetails,
    handleJointAccountAdd,
    handleJointAccountDelete,
    getProdTypeDataApiCall,
    getLoanPurposeAPICall,
    getLoanProductDataApiCall,
    setLoading,
    isAvailEcs,
    ecsAccount,
    ecsAccountData,
    getCheckLoanSecurityApiCall,
    getCheckLoanEligibleApiCall,
    setSecurityTable,
    loanMemberProduct,
    productId,
    transMode,
    savings,
    savingsBalance,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    cashDenomData,
    getNoteDenomApiCall,
    inDenominators,
    outDenominators,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    postCheckLoanAmountApiCall,
    getCheckLoanDurationUnitDataApiCall,
    getCheckBalanceApiCall,
    getDeductionListApiCall,
    deductionList,
    bankAccountData,
    insufficientBalanceDisable,
    // operationMode,
    jointHolderDetails,
    cashInDenomArray,
    cashOutDenomArray,
  } = useNewApplication();

  const [selectedOption, setSelectedOption] = useState("project");

  const prioBankClientToken = getCookieData("prioBankClientToken");
  console.log("prioBankClientToken=", prioBankClientToken);

  return (
    <NewApplication
      loading={loading}
      externalSecurityTypes={externalSecurityTypes}
      // operationMode={operationMode}
      jointHolderDetails={jointHolderDetails}
      cashInDenomArray={cashInDenomArray}
      cashOutDenomArray={cashOutDenomArray}
      postNewLoanLoading={postNewLoanLoading}
      form={form}
      FormhandleSubmit={FormhandleSubmit}
      handleMemberFormSubmit={handleMemberFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      amountErrorMessage={amountErrorMessage}
      showEmi={showEmi}
      loanEligible={loanEligible}
      handleAddSecurityTable={handleAddSecurityTable}
      handleAddExternalSecurityTable={handleAddExternalSecurityTable}
      handleDeleteSecurityTable={handleDeleteSecurityTable}
      securityTable={securityTable}
      resetTrigger={resetTrigger}
      disableSecurityType={disableSecurityType}
      handleGuaranteeMemberSearch={handleGuaranteeMemberSearch}
      handleAddGuaranteeTable={handleAddGuaranteeTable}
      resetGuaranteeMember={resetGuaranteeMember}
      guaranteeTable={guaranteeTable}
      handleDeleteGuaranteeTable={handleDeleteGuaranteeTable}
      guaranteeMemberDetails={guaranteeMemberDetails}
      handleJointAccountAdd={handleJointAccountAdd}
      handleJointAccountDelete={handleJointAccountDelete}
      getProdTypeDataApiCall={getProdTypeDataApiCall}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      getLoanPurposeAPICall={getLoanPurposeAPICall}
      getLoanProductDataApiCall={getLoanProductDataApiCall}
      setLoading={setLoading}
      isAvailEcs={isAvailEcs}
      ecsAccount={ecsAccount}
      ecsAccountData={ecsAccountData}
      // checkDepositAmountDisable={checkDepositAmountDisable}
      // allowProcessDeposit={allowProcessDeposit}

      getCheckLoanSecurityApiCall={getCheckLoanSecurityApiCall}
      getCheckLoanEligibleApiCall={getCheckLoanEligibleApiCall}
      setSecurityTable={setSecurityTable}
      loanMemberProduct={loanMemberProduct}
      productId={productId}
      transMode={transMode}
      savings={savings}
      savingsBalance={savingsBalance}
      cashInTransactionTotal={cashInTransactionTotal}
      cashOutTransactionTotal={cashOutTransactionTotal}
      cashInTransactionGrandTotal={cashInTransactionGrandTotal}
      cashOutTransactionGrandTotal={cashOutTransactionGrandTotal}
      cashDenomData={cashDenomData}
      getNoteDenomApiCall={getNoteDenomApiCall}
      inDenominators={inDenominators}
      outDenominators={outDenominators}
      handleInDenominatorChange={handleInDenominatorChange}
      handleOutDenominatorChange={handleOutDenominatorChange}
      postCheckLoanAmountApiCall={postCheckLoanAmountApiCall}
      getCheckLoanDurationUnitDataApiCall={getCheckLoanDurationUnitDataApiCall}
      getCheckBalanceApiCall={getCheckBalanceApiCall}
      getDeductionListApiCall={getDeductionListApiCall}
      deductionList={deductionList}
      bankAccountData={bankAccountData}
      insufficientBalanceDisable={insufficientBalanceDisable}
    />
  );
};
export default NewApplicationContainer;
