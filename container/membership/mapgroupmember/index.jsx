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
    groupResetTrigger,
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
    handleSelectedOptionChange,
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
      groupResetTrigger={groupResetTrigger}
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
      handleSelectedOptionChange={handleSelectedOptionChange}
      handelDeleteMember={handelDeleteMember}
    />
  );
};

export default MapGroupMemberContainer;
