"use client";

import LoanOpening from "@/components/opening/loanOpening";
import { useLoanOpening } from "./Hooks";

const LoanOpeningContainer = () => {
  const {
    loading,
    addLoanAccountLoading,
    checkLoanEligibleLoading,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    amountErrorMessage,
    showEmi,
    loanEligible,
    resetTrigger,
  } = useLoanOpening();

  return (
    <LoanOpening
      loading={loading}
      checkLoanEligibleLoading={checkLoanEligibleLoading}
      addLoanAccountLoading={addLoanAccountLoading}
      form={form}
      handleSubmit={handleSubmit}
      handleMemberFormSubmit={handleMemberFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      amountErrorMessage={amountErrorMessage}
      showEmi={showEmi}
      loanEligible={loanEligible}
      resetTrigger={resetTrigger}
    />
  );
};
export default LoanOpeningContainer;
