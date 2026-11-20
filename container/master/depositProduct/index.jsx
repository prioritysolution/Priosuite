"use client";

import DepositProduct from "@/components/master/depositProduct";
import { useDepositProduct } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const DepositProductContainer = () => {
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
    getDepositProductListApiCall,
    getDepositTypeApiCall,
    loadMasterDropdowns,
    currentPage,
    setCurrentPage,
    lastPage,
    pageLimit,
  } = useDepositProduct();

  // Load master dropdowns once on mount (cached via masterLoadedRef in Hooks)
  useEffect(() => {
    const token = getCookieData("prioBankClientToken");
    const orgId = getCookieData("orgId");
    if (token && orgId) {
      loadMasterDropdowns(orgId);
    }
  }, [loadMasterDropdowns]);

  // Load product list on mount & page/limit change
  useEffect(() => {
    const token = getCookieData("prioBankClientToken");
    const orgId = getCookieData("orgId");
    if (token && orgId) {
      getDepositProductListApiCall(orgId, currentPage, pageLimit);
    }
  }, [currentPage, pageLimit]);

  return (
    <DepositProduct
      getLoading={getLoading}
      postLoading={postLoading}
      updateLoading={updateLoading}
      openDialouge={openDialouge}
      setOpenDialouge={setOpenDialouge}
      form={form}
      handleSubmit={handleSubmit}
      editData={editData}
      handleEditData={handleEditData}
      getDepositTypeApiCall={getDepositTypeApiCall}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      pageLimit={pageLimit}
    />
  );
};

export default DepositProductContainer;
