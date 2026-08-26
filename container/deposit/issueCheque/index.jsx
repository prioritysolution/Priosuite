"use client";

import { useIssueCheque } from "./Hooks";
import IssueCheque from "@/components/deposit/issueCheque";

const IssueChequeContainer = () => {
  const {
    loading,
    getAccountLoading,
    postIssueChequeLoading,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    resetTrigger,
  } = useIssueCheque();

  return (
    <IssueCheque
      loading={loading}
      getAccountLoading={getAccountLoading}
      postIssueChequeLoading={postIssueChequeLoading}
      form={form}
      handleSubmit={handleSubmit}
      handleAccountFormSubmit={handleAccountFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      resetTrigger={resetTrigger}
    />
  );
};
export default IssueChequeContainer;
