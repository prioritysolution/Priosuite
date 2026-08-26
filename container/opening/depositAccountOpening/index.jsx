"use client";

import DepositAccountOpening from "@/components/opening/depositAccountOpening";
import { useDepositAccountOpening } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useMemberProfile } from "@/container/membership/memberProfile/Hooks";

const DepositAccountOpeningContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getDepositProductLoading,
    addDepositAccountLoading,
    getDepositAccountTypeDataApiCall,
    getDurationTypeDataApiCall,
    getMaturityInstructionDataApiCall,
    getOperationModeDataApiCall,
    getPayoutModeDataApiCall,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleJointAccountAdd,
    handleJointAccountDelete,
    jointMemberDialougeOpen,
    deleteJointMemberDialougeOpen,
    checkDepositAmountDisable,
    checkDepositAmountMessage,
    checkDepositDurationDisable,
    checkDepositDurationMessage,
    openJointDialog,
    setOpenJointDialog,
    resetTrigger,
  } = useDepositAccountOpening();

  const { getRelationTypeDataApiCall } = useMemberProfile();

  useEffect(() => {
    if (token && orgId) {
      getDepositAccountTypeDataApiCall(orgId);
      getDurationTypeDataApiCall(orgId);
      getRelationTypeDataApiCall();
      getMaturityInstructionDataApiCall(orgId);
      getOperationModeDataApiCall(orgId);
      getPayoutModeDataApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <DepositAccountOpening
      loading={loading}
      addDepositAccountLoading={addDepositAccountLoading}
      form={form}
      handleSubmit={handleSubmit}
      handleMemberFormSubmit={handleMemberFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      handleJointAccountAdd={handleJointAccountAdd}
      handleJointAccountDelete={handleJointAccountDelete}
      jointMemberDialougeOpen={jointMemberDialougeOpen}
      deleteJointMemberDialougeOpen={deleteJointMemberDialougeOpen}
      checkDepositAmountDisable={checkDepositAmountDisable}
      checkDepositAmountMessage={checkDepositAmountMessage}
      checkDepositDurationDisable={checkDepositDurationDisable}
      checkDepositDurationMessage={checkDepositDurationMessage}
      getDepositProductLoading={getDepositProductLoading}
      openJointDialog={openJointDialog}
      setOpenJointDialog={setOpenJointDialog}
      resetTrigger={resetTrigger}
    />
  );
};
export default DepositAccountOpeningContainer;
