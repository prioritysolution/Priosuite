"use client";

import MembershipOpening from "@/components/opening/membershipOpening";
import { useMembershipOpening } from "./Hooks";
import { useShareProduct } from "@/container/master/shareProduct/Hooks";
import { useMemberProfile } from "@/container/membership/memberProfile/Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";

const MembershipOpeningContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    addOpeningLoading,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    resetTrigger,
  } = useMembershipOpening();

  const { getMemberTypeDataApiCall } = useShareProduct();

  const { getRelationTypeDataApiCall } = useMemberProfile();

  useEffect(() => {
    if (token && orgId) {
      getMemberTypeDataApiCall(orgId);
      getRelationTypeDataApiCall();
    }
  }, [token, orgId]);

  return (
    <MembershipOpening
      loading={loading}
      addOpeningLoading={addOpeningLoading}
      form={form}
      handleSubmit={handleSubmit}
      handleMemberFormSubmit={handleMemberFormSubmit}
      visibleBlock={visibleBlock}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      resetTrigger={resetTrigger}
    />
  );
};
export default MembershipOpeningContainer;
