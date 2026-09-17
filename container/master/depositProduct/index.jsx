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
    loadMasterDropdowns,
    currentPage,
    setCurrentPage,
    lastPage,
    pageLimit,
  } = useDepositProduct();

  // Read cookies inside effects so SSR null values don't skip the fetch
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
      getDepositProductListApiCall(orgId, currentPage, pageLimit);
    }
  }, [currentPage, pageLimit]);

  // Refresh masters when opening add/edit so dropdowns always have data
  useEffect(() => {
    if (!openDialouge) return;
    const token = getCookieData("prioBankClientToken");
    const orgId = getCookieData("orgId");
    if (token && orgId) {
      loadMasterDropdowns(orgId);
    }
  }, [openDialouge]);

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
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      lastPage={lastPage}
      pageLimit={pageLimit}
    />
  );
};

export default DepositProductContainer;
