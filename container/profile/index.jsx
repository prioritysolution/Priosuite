"use client";

import Profile from "@/components/profile";
import getCookieData from "@/utils/getCookieData";
import { useProfile } from "./Hooks";
import { useEffect } from "react";

const ProfileContainer = () => {
  const token = getCookieData("prioBankClientToken");

  const {
    loading,
    updateUserDetailsLoading,
    getUserProfileDetailsApiCall,
    userDetails,
    form,
    handleSubmit,
    showEditDialog,
    setShowEditDialog,
  } = useProfile();

  useEffect(() => {
    if (token) {
      getUserProfileDetailsApiCall();
    }
  }, [token]);

  return (
    <Profile
      loading={loading}
      updateUserDetailsLoading={updateUserDetailsLoading}
      userDetails={userDetails}
      form={form}
      handleSubmit={handleSubmit}
      showEditDialog={showEditDialog}
      setShowEditDialog={setShowEditDialog}
    />
  );
};
export default ProfileContainer;
