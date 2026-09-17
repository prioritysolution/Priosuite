"use client";

import SubLedger from "@/components/master/subLedger";
import { useSubLedger } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const SubLedgerContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    getLoading,
    postLoading,
    updateLoading,
    openDialouge,
    setOpenDialouge,
    form,
    handleSubmit,
    getSubLedgerApiCall,
    getSubLedgerHeadApiCall,
    editData,
    handleEditData,
    currentPage,
    setCurrentPage,
    lastPage,
  } = useSubLedger();

  useEffect(() => {
    if (token) {
      getSubLedgerHeadApiCall();
    }
  }, [token]);

  useEffect(() => {
    if (orgId && branchId && token)
      getSubLedgerApiCall(orgId, branchId, "TABLE", currentPage, "");
  }, [currentPage, orgId, branchId, token]);

  return (
    <SubLedger
      getLoading={getLoading}
      postLoading={postLoading}
      updateLoading={updateLoading}
      openDialouge={openDialouge}
      setOpenDialouge={setOpenDialouge}
      form={form}
      handleSubmit={handleSubmit}
      editData={editData}
      handleEditData={handleEditData}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
    />
  );
};
export default SubLedgerContainer;
