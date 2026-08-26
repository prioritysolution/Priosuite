"use client";

// import { useMemberProfile } from "./Hooks";
import { useEffect } from "react";
import getCookieData from "../../../utils/getCookieData";
import { useOperationalArea } from "../../master/operationalArea/Hooks";
// import GroupProfile from "../../components/membership/groupProfile";
import { useGroupProfile } from "./Hooks";
import GroupProfile from "@/components/membership/groupProfile";

const GroupProfileContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    stateId,
    districtId,
    blockId,
    getGroupTypeDataApiCall,
    form,
    loading,
    getGroupTypeLoading,
    groupTypeData,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleShowForm,
    handleResetForm,
    showForm,
    resetTrigger,
    getMemberDataLoading,
    handleMemberFormSubmit,
    isLoadingMemberData,
  } = useGroupProfile();

  const {
    getMasterOperationalStateDataApiCall,
    getMasterOperationalDistrictUnderStateDataApiCall,
    getMasterOperationalBlockUnderDistrictDataApiCall,
    getMasterOperationalPoliceStationUnderDistrictDataApiCall,
    getMasterOperationalPostOfficeUnderDistrictDataApiCall,
    getMasterOperationalVillageUnderBlockDataApiCall,
    getMasterOperationalUnitDataApiCall,
    getStateLoading,
    getDistrictLoading,
    getBlockLoading,
    getPoliceStationLoading,
    getPostOfficeLoading,
    getVillageLoading,
    getUnitLoading,
    unitInput,
    setUnitInput,
    currentUnitPage,
    setCurrentUnitPage,
    lastUnitPage,
  } = useOperationalArea();

  useEffect(() => {
    if (token) {
      getGroupTypeDataApiCall();
    }
  }, [token]);

  useEffect(() => {
    if (token && orgId && !isLoadingMemberData) {
      getMasterOperationalStateDataApiCall(orgId);
      if (stateId) {
        getMasterOperationalDistrictUnderStateDataApiCall(stateId, orgId);
        if (districtId) {
          getMasterOperationalBlockUnderDistrictDataApiCall(
            orgId,
            districtId,
            stateId,
          );
          getMasterOperationalPoliceStationUnderDistrictDataApiCall(
            orgId,
            districtId,
          );
          getMasterOperationalPostOfficeUnderDistrictDataApiCall(
            orgId,
            districtId,
          );
          if (blockId) {
            getMasterOperationalVillageUnderBlockDataApiCall(orgId, blockId);
          }
        }
      }
      getMasterOperationalUnitDataApiCall(orgId, 1, "", "DROPDOWN");
    }
  }, [token, orgId, stateId, districtId, blockId, isLoadingMemberData]);

  const handleSearchUnit = () => {
    setCurrentUnitPage(1);
    if (orgId)
      getMasterOperationalUnitDataApiCall(orgId, 1, unitInput, "DROPDOWN");
  };

  const handleScrollUnit = () => {
    setCurrentUnitPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (orgId && currentUnitPage > 1 && currentUnitPage <= lastUnitPage)
      getMasterOperationalUnitDataApiCall(
        orgId,
        currentUnitPage,
        unitInput,
        "DROPDOWN",
      );
  }, [currentUnitPage, orgId]);

  useEffect(() => {
    if (!isLoadingMemberData && !form.getValues("districtId")) {
      form.setValue("districtId", "");
    }
  }, [stateId, isLoadingMemberData, form]);

  useEffect(() => {
    if (!isLoadingMemberData && !form.getValues("blockId")) {
      form.setValue("blockId", "");
      form.setValue("policeStationId", "");
      form.setValue("postOfficeId", "");
      form.setValue("villageId", "");
    }
  }, [districtId, isLoadingMemberData, form]);

  useEffect(() => {
    if (!isLoadingMemberData && !form.getValues("villageId")) {
      form.setValue("villageId", "");
    }
  }, [blockId, isLoadingMemberData, form]);
  return (
    <GroupProfile
      form={form}
      loading={loading}
      getGroupTypeLoading={getGroupTypeLoading}
      groupTypeData={groupTypeData}
      getStateLoading={getStateLoading}
      getDistrictLoading={getDistrictLoading}
      getBlockLoading={getBlockLoading}
      getPoliceStationLoading={getPoliceStationLoading}
      getPostOfficeLoading={getPostOfficeLoading}
      getVillageLoading={getVillageLoading}
      getUnitLoading={getUnitLoading}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      showSuccessMessage={showSuccessMessage}
      handleCloseSuccessMessage={handleCloseSuccessMessage}
      handleSearchUnit={handleSearchUnit}
      handleScrollUnit={handleScrollUnit}
      unitInput={unitInput}
      setUnitInput={setUnitInput}
      handleShowForm={handleShowForm}
      handleResetForm={handleResetForm}
      showForm={showForm}
      resetTrigger={resetTrigger}
      getMemberDataLoading={getMemberDataLoading}
      handleMemberFormSubmit={handleMemberFormSubmit}
    />
  );
};
export default GroupProfileContainer;
