"use client";

import UploadSpecimen from "@/components/deposit/uploadSpecimen";
import { useUploadSpecimen } from "./Hooks";

const UploadSpecimenContainer = () => {
  const {
    loading,
    getUploadSpecimenLoading,
    postUploadSpecimenLoading,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    photoLink,
    signatureLink,
    resetTrigger,
  } = useUploadSpecimen();

  return (
    <UploadSpecimen
      loading={loading}
      getUploadSpecimenLoading={getUploadSpecimenLoading}
      postUploadSpecimenLoading={postUploadSpecimenLoading}
      form={form}
      handleSubmit={handleSubmit}
      handleAccountFormSubmit={handleAccountFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      photoLink={photoLink}
      signatureLink={signatureLink}
      resetTrigger={resetTrigger}
    />
  );
};
export default UploadSpecimenContainer;
