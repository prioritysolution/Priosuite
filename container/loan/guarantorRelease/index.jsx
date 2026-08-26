"use client";

import GuarantorRealease from "@/components/loan/guarantorRelease";
import { useGuarantorRealease } from "./Hooks";

const GuarantorRealeaseContainer = () => {
  const {
    loading,
    deleteGuarantorLoading,
    form,
    handleAccountFormSubmit,
    visibleBlock,
    guarantorDetails,
    handleShowDeleteDialog,
    handleCancelDelete,
    handleConfirmDelete,
    showDeleteDialog,
    setShowDeleteDialog,
  } = useGuarantorRealease();

  return (
    <GuarantorRealease
      loading={loading}
      deleteGuarantorLoading={deleteGuarantorLoading}
      form={form}
      handleAccountFormSubmit={handleAccountFormSubmit}
      visibleBlock={visibleBlock}
      guarantorDetails={guarantorDetails}
      handleShowDeleteDialog={handleShowDeleteDialog}
      handleCancelDelete={handleCancelDelete}
      handleConfirmDelete={handleConfirmDelete}
      showDeleteDialog={showDeleteDialog}
      setShowDeleteDialog={setShowDeleteDialog}
    />
  );
};
export default GuarantorRealeaseContainer;
