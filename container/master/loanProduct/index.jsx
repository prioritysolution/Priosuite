"use client";

import LoanProduct from "@/components/master/loanProduct";
import { useLoanProduct } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const LoanProductContainer = () => {
  const {
    getLoading,
    postLoading,
    updateLoading,
    openDialouge,
    setOpenDialouge,
    form,
    handleSubmit,
    editData,
    handleEditData,
    getLoanProductListApiCall,
    loadMasterDropdowns,
    currentPage,
    setCurrentPage,
    lastPage,
    pageLimit,
  } = useLoanProduct();

  useEffect(() => {
    const token = getCookieData("prioBankClientToken");
    const orgId = getCookieData("orgId");
    if (token && orgId) {
      loadMasterDropdowns(orgId);
    }
  }, []);

  useEffect(() => {
    const token = getCookieData("prioBankClientToken");
    const orgId = getCookieData("orgId");
    if (token && orgId) {
      getLoanProductListApiCall(orgId, currentPage, pageLimit);
    }
  }, [currentPage, pageLimit]);

  useEffect(() => {
    if (!openDialouge) return;
    const token = getCookieData("prioBankClientToken");
    const orgId = getCookieData("orgId");
    if (token && orgId) {
      loadMasterDropdowns(orgId);
    }
  }, [openDialouge]);

  return (
    <LoanProduct
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
      pageLimit={pageLimit}
    />
  );
};

export default LoanProductContainer;
