"use client";

import DepositInterestSetup from "@/components/master/depositInterestSetup";
import { useDepositInterestSetup } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useOpenDepositAccount } from "@/container/deposit/openDepositAccount/Hooks";

const DepositInterestMasterContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getDepositInterestProductApiCall,
    handleSubmit,
    handleAddTableData,
    handleRemoveTableData,
    handleFormAction,
    openSlabListModal,
    setOpenSlabListModal,
    getSlabListLoading,
    editingSlab,
    handleEditSlab,
    handleCancelEdit,
    getDepositIntSlabListApiCall,
    slabCurrentPage,
    setSlabCurrentPage,
    slabLastPage,
    slabPageLimit,
    filterProductId,
    setFilterProductId,
    form,
    tableData,
  } = useDepositInterestSetup();

  const { getDurationTypeDataApiCall } = useOpenDepositAccount();

  useEffect(() => {
    if (token && orgId) {
      getDepositInterestProductApiCall(orgId);
      getDurationTypeDataApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <DepositInterestSetup
      loading={loading}
      handleSubmit={handleSubmit}
      handleAddTableData={handleAddTableData}
      handleRemoveTableData={handleRemoveTableData}
      handleFormAction={handleFormAction}
      openSlabListModal={openSlabListModal}
      setOpenSlabListModal={setOpenSlabListModal}
      getSlabListLoading={getSlabListLoading}
      editingSlab={editingSlab}
      handleEditSlab={handleEditSlab}
      handleCancelEdit={handleCancelEdit}
      getDepositIntSlabListApiCall={getDepositIntSlabListApiCall}
      slabCurrentPage={slabCurrentPage}
      setSlabCurrentPage={setSlabCurrentPage}
      slabLastPage={slabLastPage}
      slabPageLimit={slabPageLimit}
      filterProductId={filterProductId}
      setFilterProductId={setFilterProductId}
      form={form}
      tableData={tableData}
      orgId={orgId}
    />
  );
};
export default DepositInterestMasterContainer;
