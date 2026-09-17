"use client";

import PassbookPrint from "@/components/loan/passbookPrint";
import { usePassbookPrint } from "./Hooks";

const PassbookPrintContainer = () => {
  const {
    loading,
    form,
    handleSubmit,
    handleSelectAccount,
    dialougeOpen,
    setDialougeOpen,
    pageParameter,
    pageData,
    showPage,
    showLine,
    handleUpdateTrans,
  } = usePassbookPrint();

  return (
    <PassbookPrint
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      handleSelectAccount={handleSelectAccount}
      dialougeOpen={dialougeOpen}
      setDialougeOpen={setDialougeOpen}
      pageParameter={pageParameter}
      pageData={pageData}
      showPage={showPage}
      showLine={showLine}
      handleUpdateTrans={handleUpdateTrans}
    />
  );
};
export default PassbookPrintContainer;
