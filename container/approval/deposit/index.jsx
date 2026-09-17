"use client";
import React from "react";
import DepositApproval from "@/components/approval/deposit";
import { useDepositApproval } from "./Hooks";
import SuccessMessage from "@/common/dialog/SuccessMessage";

const DepositApprovalContainer = () => {
  const {
    depositList,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    paginate,
    handleView,
    openModal,
    setOpenModal,
    selectedDetails,
    detailsLoading,
    handleApprove,
    handleRejectSubmit,
    actionLoading,

    showSuccessModal,
    successMessageText,
    handleCloseSuccessMessage,
  } = useDepositApproval();

  const pagination = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  };

  console.log("selectedDetails =", selectedDetails);

  return (
    <>
      <DepositApproval
        depositList={depositList}
        loading={loading}
        actionLoading={actionLoading || detailsLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        pagination={pagination}
        handlePageChange={paginate}
        isDetailsModalOpen={openModal}
        toggleDetailsModal={setOpenModal}
        selectedDeposit={selectedDetails}
        handleView={handleView}
        handleApprove={handleApprove}
        handleRejectSubmit={handleRejectSubmit}
      />

      <SuccessMessage
        showSuccessMessage={showSuccessModal}
        successMessage={successMessageText}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </>
  );
};

export default DepositApprovalContainer;
