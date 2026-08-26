"use client";

import OperationalArea from "@/components/master/operationalArea";
import { useOperationalArea } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";

const OperationalAreaContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    stateIdInBlock,
    stateIdInPolice,
    stateIdInPost,
    stateIdInVillage,
    districtId,
    activeForm,
    setActiveForm,
    getLoading,
    postLoading,
    updateLoading,
    openDialouge,
    setOpenDialouge,
    masterOperationStateForm,
    masterOperationDistrictForm,
    masterOperationBlockForm,
    masterOperationPoliceStationForm,
    masterOperationPostOfficeForm,
    masterOperationVillageForm,
    masterOperationUnitForm,
    handleMasterOperationStateSubmit,
    handleMasterOperationDistrictSubmit,
    handleMasterOperationBlockSubmit,
    handleMasterOperationPoliceStationSubmit,
    handleMasterOperationPostOfficeSubmit,
    handleMasterOperationVillageSubmit,
    handleMasterOperationUnitSubmit,
    getMasterOperationalStateDataApiCall,
    getMasterOperationalDistrictDataApiCall,
    getMasterOperationalBlockDataApiCall,
    getMasterOperationalPoliceStationApiCall,
    getMasterOperationalPostOfficeApiCall,
    getMasterOperationalVillageDataApiCall,
    getMasterOperationalUnitDataApiCall,
    getMasterOperationalDistrictUnderStateDataApiCall,
    getMasterOperationalBlockUnderDistrictDataApiCall,
    editStateData,
    editDistrictData,
    editBlockData,
    editPoliceStationData,
    editPostOfficeData,
    editVillageData,
    editUnitData,
    handleEditStateData,
    handleEditDistrictData,
    handleEditBlockData,
    handleEditPoliceStationData,
    handleEditPostOfficeData,
    handleEditVillageData,
    handleEditUnitData,
    currentDistrictPage,
    setCurrentDistrictPage,
    lastDistrictPage,
    currentBlockPage,
    setCurrentBlockPage,
    lastBlockPage,
    currentPoliceStationPage,
    setCurrentPoliceStationPage,
    lastPoliceStationPage,
    currentPostOfficePage,
    setCurrentPostOfficePage,
    lastPostOfficePage,
    currentVillagePage,
    setCurrentVillagePage,
    lastVillagePage,
    currentUnitPage,
    setCurrentUnitPage,
    lastUnitPage,
  } = useOperationalArea();

  useEffect(() => {
    if (token && orgId) {
      switch (activeForm) {
        case 0:
          getMasterOperationalStateDataApiCall(orgId);
          break;
        case 1:
          getMasterOperationalStateDataApiCall(orgId);
          getMasterOperationalDistrictDataApiCall(orgId, currentDistrictPage);
          break;
        case 2:
          getMasterOperationalBlockDataApiCall(orgId, currentBlockPage);
          getMasterOperationalStateDataApiCall(orgId);
          if (stateIdInBlock)
            getMasterOperationalDistrictUnderStateDataApiCall(
              stateIdInBlock,
              orgId
            );
          !editBlockData && masterOperationBlockForm.setValue("districtId", "");

          break;
        case 3:
          getMasterOperationalStateDataApiCall(orgId);
          getMasterOperationalPoliceStationApiCall(
            orgId,
            currentPoliceStationPage
          );
          if (stateIdInPolice)
            getMasterOperationalDistrictUnderStateDataApiCall(
              stateIdInPolice,
              orgId
            );
          !editPoliceStationData &&
            masterOperationPoliceStationForm.setValue("districtId", "");
          break;
        case 4:
          getMasterOperationalStateDataApiCall(orgId);
          getMasterOperationalPostOfficeApiCall(orgId, currentPostOfficePage);
          if (stateIdInPost)
            getMasterOperationalDistrictUnderStateDataApiCall(
              stateIdInPost,
              orgId
            );
          !editPostOfficeData &&
            masterOperationPostOfficeForm.setValue("districtId", "");
          break;
        case 5:
          getMasterOperationalStateDataApiCall(orgId);
          getMasterOperationalVillageDataApiCall(orgId, currentVillagePage);
          if (stateIdInVillage)
            getMasterOperationalDistrictUnderStateDataApiCall(
              stateIdInVillage,
              orgId
            );
          if (districtId && stateIdInVillage) {
            getMasterOperationalBlockUnderDistrictDataApiCall(
              orgId,
              districtId,
              stateIdInVillage
            );
            !editVillageData &&
              masterOperationVillageForm.setValue("blockId", "");
          }
          break;
        case 6:
          getMasterOperationalUnitDataApiCall(
            orgId,
            currentUnitPage,
            "",
            "TABLE"
          );
          break;
      }
    }
  }, [
    token,
    orgId,
    activeForm,
    stateIdInBlock,
    stateIdInPolice,
    stateIdInPost,
    stateIdInVillage,
    districtId,
  ]);

  useEffect(() => {
    !editVillageData && masterOperationVillageForm.setValue("districtId", "");
  }, [stateIdInVillage, editVillageData, masterOperationVillageForm]);

  useEffect(() => {
    if (activeForm === 1 && orgId && token)
      getMasterOperationalDistrictDataApiCall(orgId, currentDistrictPage);
  }, [currentDistrictPage, activeForm, orgId, token]);

  useEffect(() => {
    if (activeForm === 2 && orgId && token)
      getMasterOperationalBlockDataApiCall(orgId, currentBlockPage);
  }, [currentBlockPage, activeForm, orgId, token]);

  useEffect(() => {
    if (activeForm === 3 && orgId && token)
      getMasterOperationalPoliceStationApiCall(orgId, currentPoliceStationPage);
  }, [currentPoliceStationPage, activeForm, orgId, token]);

  useEffect(() => {
    if (activeForm === 4 && orgId && token)
      getMasterOperationalPostOfficeApiCall(orgId, currentPostOfficePage);
  }, [currentPostOfficePage, activeForm, orgId, token]);

  useEffect(() => {
    if (activeForm === 5 && orgId && token)
      getMasterOperationalVillageDataApiCall(orgId, currentVillagePage);
  }, [currentVillagePage, activeForm, orgId, token]);

  useEffect(() => {
    if (activeForm === 6 && orgId && token)
      getMasterOperationalUnitDataApiCall(orgId, currentUnitPage, "", "TABLE");
  }, [currentUnitPage, activeForm, orgId, token]);

  return (
    <OperationalArea
      activeForm={activeForm}
      setActiveForm={setActiveForm}
      getLoading={getLoading}
      postLoading={postLoading}
      updateLoading={updateLoading}
      openDialouge={openDialouge}
      setOpenDialouge={setOpenDialouge}
      masterOperationStateForm={masterOperationStateForm}
      masterOperationDistrictForm={masterOperationDistrictForm}
      masterOperationBlockForm={masterOperationBlockForm}
      masterOperationPoliceStationForm={masterOperationPoliceStationForm}
      masterOperationPostOfficeForm={masterOperationPostOfficeForm}
      masterOperationVillageForm={masterOperationVillageForm}
      masterOperationUnitForm={masterOperationUnitForm}
      handleMasterOperationStateSubmit={handleMasterOperationStateSubmit}
      handleMasterOperationDistrictSubmit={handleMasterOperationDistrictSubmit}
      handleMasterOperationBlockSubmit={handleMasterOperationBlockSubmit}
      handleMasterOperationPoliceStationSubmit={
        handleMasterOperationPoliceStationSubmit
      }
      handleMasterOperationPostOfficeSubmit={
        handleMasterOperationPostOfficeSubmit
      }
      handleMasterOperationVillageSubmit={handleMasterOperationVillageSubmit}
      handleMasterOperationUnitSubmit={handleMasterOperationUnitSubmit}
      editStateData={editStateData}
      editDistrictData={editDistrictData}
      editBlockData={editBlockData}
      editPoliceStationData={editPoliceStationData}
      editPostOfficeData={editPostOfficeData}
      editVillageData={editVillageData}
      editUnitData={editUnitData}
      handleEditStateData={handleEditStateData}
      handleEditDistrictData={handleEditDistrictData}
      handleEditBlockData={handleEditBlockData}
      handleEditPoliceStationData={handleEditPoliceStationData}
      handleEditPostOfficeData={handleEditPostOfficeData}
      handleEditVillageData={handleEditVillageData}
      handleEditUnitData={handleEditUnitData}
      currentDistrictPage={currentDistrictPage}
      setCurrentDistrictPage={setCurrentDistrictPage}
      lastDistrictPage={lastDistrictPage}
      currentBlockPage={currentBlockPage}
      setCurrentBlockPage={setCurrentBlockPage}
      lastBlockPage={lastBlockPage}
      currentPoliceStationPage={currentPoliceStationPage}
      setCurrentPoliceStationPage={setCurrentPoliceStationPage}
      lastPoliceStationPage={lastPoliceStationPage}
      currentPostOfficePage={currentPostOfficePage}
      setCurrentPostOfficePage={setCurrentPostOfficePage}
      lastPostOfficePage={lastPostOfficePage}
      currentVillagePage={currentVillagePage}
      setCurrentVillagePage={setCurrentVillagePage}
      lastVillagePage={lastVillagePage}
      currentUnitPage={currentUnitPage}
      setCurrentUnitPage={setCurrentUnitPage}
      lastUnitPage={lastUnitPage}
    />
  );
};
export default OperationalAreaContainer;
