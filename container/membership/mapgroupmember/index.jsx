"use client";

import { useState } from "react";
import MapGroupMember from "@/components/membership/mapgroupmember";

import { useMapGroupMember } from "./Hooks";

const MapGroupMemberContainer = () => {
  const {
    handleMemberFormSubmit,
    getGroupLoading,

    form,
    handleMapGroupSubmit,
    resetForm,
    handleAddMember,
    handleRemoveMember,
    handleEditMember,
    handleUpdateMember,
    addedMembers,
    resetTrigger,
    isAddMemberDisabled,
    visibleBlock,
    showForm,
    getMemberDataLoading,
    designationData,
    ecsAccountData,
    mapGroupMemberLoading,
    handleMapSubmit,
    successMessage,
    showSuccessMessage,
    setShowSuccessMessage,
    setSuccessMessage,
    handelDeleteMember,
    selectedOption,
    setSelectedOption,
  } = useMapGroupMember();

  return (
    <MapGroupMember
      form={form}
      handleMemberFormSubmit={handleMemberFormSubmit}
      handleMapGroupSubmit={handleMapGroupSubmit}
      getGroupLoading={getGroupLoading}
      getMemberDataLoading={getMemberDataLoading}
      visibleBlock={visibleBlock}
      showForm={showForm}
      resetForm={resetForm}
      handleAddMember={handleAddMember}
      handleRemoveMember={handleRemoveMember}
      handleEditMember={handleEditMember}
      handleUpdateMember={handleUpdateMember}
      addedMembers={addedMembers}
      resetTrigger={resetTrigger}
      isAddMemberDisabled={isAddMemberDisabled}
      designationData={designationData}
      ecsAccountData={ecsAccountData}
      mapGroupMemberLoading={mapGroupMemberLoading}
      handleMapSubmit={handleMapSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      setShowSuccessMessage={setShowSuccessMessage}
      setSuccessMessage={setSuccessMessage}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      handelDeleteMember={handelDeleteMember}
    />
  );
};

export default MapGroupMemberContainer;
