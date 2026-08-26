"use client";
import PassbookPrint from "@/components/membership/passbookPrint";
import { usePassbookPrint } from "./Hooks";

const PassbookPrintContainer = () => {
  const {
    loading,
    form,
    handleSubmit,
    handleSelectMember,
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
      handleSelectMember={handleSelectMember}
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
