"use client";

import Membership from "@/components/rectify/membership";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useMembership } from "./Hooks";

const MembershipContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    loading,
    getMemberDataLoading,
    postMembershipLoading,
    getRectifyTypeApiCall,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    resetTrigger,
  } = useMembership();

  useEffect(() => {
    if (token && orgId) {
      getRectifyTypeApiCall();
    }
  }, [token, orgId]);

  return (
    <Membership
      loading={loading}
      getMemberDataLoading={getMemberDataLoading}
      postMembershipLoading={postMembershipLoading}
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
export default MembershipContainer;
