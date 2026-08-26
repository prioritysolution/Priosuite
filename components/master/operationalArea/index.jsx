"use client";

import OperationalAreaCard from "@/common/cards/OperationalAreaCard";
import { Button } from "@/components/ui/button";
import StateForm from "./state/StateForm";
import StateTable from "./state/StateTable";
import DistrictForm from "./district/DistrictForm";
import BlockForm from "./block/BlockForm";
import PoliceStationForm from "./policeStation/PoliceStationForm";
import PostOfficeForm from "./postOffice/PostOfficeForm";
import VillageForm from "./village/VillageForm";
import UnitForm from "./unit/UnitForm";
import { useSelector } from "react-redux";
import DistrictTable from "./district/DistrictTable";
import BlockTable from "./block/BlockTable";
import PoliceStationTable from "./policeStation/PoliceStationTable";
import PostOfficeTable from "./postOffice/PostOfficeTable";
import UnitTable from "./unit/UnitTable";
import VillageTable from "./village/VillageTable";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

const OperationalArea = ({
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
}) => {
  const stateListData = useSelector(
    (state) =>
      state.operationalArea.stateData && state.operationalArea.stateData,
  );

  const districtListData = useSelector(
    (state) =>
      state.operationalArea.districtData && state.operationalArea.districtData,
  );

  const blockListData = useSelector(
    (state) =>
      state.operationalArea.blockData && state.operationalArea.blockData,
  );

  const policeStationListData = useSelector(
    (state) =>
      state.operationalArea.policeStationData &&
      state.operationalArea.policeStationData,
  );

  const postOfficeListData = useSelector(
    (state) =>
      state.operationalArea.postOfficeData &&
      state.operationalArea.postOfficeData,
  );

  const villageListData = useSelector(
    (state) =>
      state.operationalArea.villageData && state.operationalArea.villageData,
  );

  const unitListData = useSelector(
    (state) => state.operationalArea.unitData && state.operationalArea.unitData,
  );

  const districtListUnderStateData = useSelector(
    (state) =>
      state.operationalArea.districtUnderStateData &&
      state.operationalArea.districtUnderStateData,
  );

  const blockListUnderDistrictData = useSelector(
    (state) =>
      state.operationalArea.blockUnderDistrict &&
      state.operationalArea.blockUnderDistrict,
  );

  const formList = [
    {
      label: "State",
      form: (
        <StateForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationStateForm}
          handleSubmit={handleMasterOperationStateSubmit}
          editData={editStateData}
        />
      ),
      table: (
        <StateTable
          data={stateListData ? stateListData : []}
          handleEditData={handleEditStateData}
          loading={getLoading}
        />
      ),
    },
    {
      label: "District",
      form: (
        <DistrictForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationDistrictForm}
          handleSubmit={handleMasterOperationDistrictSubmit}
          editData={editDistrictData}
          stateData={stateListData}
        />
      ),
      table: (
        <DistrictTable
          data={districtListData ? districtListData : []}
          handleEditData={handleEditDistrictData}
          loading={getLoading}
          currentDistrictPage={currentDistrictPage}
          setCurrentDistrictPage={setCurrentDistrictPage}
          lastDistrictPage={lastDistrictPage}
        />
      ),
    },
    {
      label: "Block",
      form: (
        <BlockForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationBlockForm}
          handleSubmit={handleMasterOperationBlockSubmit}
          editData={editBlockData}
          stateData={stateListData}
          districtData={districtListUnderStateData}
        />
      ),
      table: (
        <BlockTable
          data={blockListData ? blockListData : []}
          handleEditData={handleEditBlockData}
          loading={getLoading}
          currentBlockPage={currentBlockPage}
          setCurrentBlockPage={setCurrentBlockPage}
          lastBlockPage={lastBlockPage}
        />
      ),
    },
    {
      label: "Police Station",
      form: (
        <PoliceStationForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationPoliceStationForm}
          handleSubmit={handleMasterOperationPoliceStationSubmit}
          editData={editPoliceStationData}
          stateData={stateListData}
          districtData={districtListUnderStateData}
        />
      ),
      table: (
        <PoliceStationTable
          data={policeStationListData ? policeStationListData : []}
          handleEditData={handleEditPoliceStationData}
          loading={getLoading}
          currentPoliceStationPage={currentPoliceStationPage}
          setCurrentPoliceStationPage={setCurrentPoliceStationPage}
          lastPoliceStationPage={lastPoliceStationPage}
        />
      ),
    },
    {
      label: "Post Office",
      form: (
        <PostOfficeForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationPostOfficeForm}
          handleSubmit={handleMasterOperationPostOfficeSubmit}
          editData={editPostOfficeData}
          stateData={stateListData}
          districtData={districtListUnderStateData}
        />
      ),
      table: (
        <PostOfficeTable
          data={postOfficeListData ? postOfficeListData : []}
          handleEditData={handleEditPostOfficeData}
          loading={getLoading}
          currentPostOfficePage={currentPostOfficePage}
          setCurrentPostOfficePage={setCurrentPostOfficePage}
          lastPostOfficePage={lastPostOfficePage}
        />
      ),
    },
    {
      label: "Village",
      form: (
        <VillageForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationVillageForm}
          handleSubmit={handleMasterOperationVillageSubmit}
          editData={editVillageData}
          stateData={stateListData}
          districtData={districtListUnderStateData}
          blockData={blockListUnderDistrictData}
        />
      ),
      table: (
        <VillageTable
          data={villageListData ? villageListData : []}
          handleEditData={handleEditVillageData}
          loading={getLoading}
          currentVillagePage={currentVillagePage}
          setCurrentVillagePage={setCurrentVillagePage}
          lastVillagePage={lastVillagePage}
        />
      ),
    },
    {
      label: "Unit",
      form: (
        <UnitForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationUnitForm}
          handleSubmit={handleMasterOperationUnitSubmit}
          editData={editUnitData}
        />
      ),
      table: (
        <UnitTable
          data={unitListData ? unitListData : []}
          handleEditData={handleEditUnitData}
          loading={getLoading}
          currentUnitPage={currentUnitPage}
          setCurrentUnitPage={setCurrentUnitPage}
          lastUnitPage={lastUnitPage}
        />
      ),
    },
  ];

  const handleFormClick = (id) => {
    setActiveForm(id);
  };

  return (
    <div className="w-full h-full flex justify-between p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col lg:flex-row items-center lg:items-start justify-center border-primary rounded-lg border-[2px] p-5 w-full gap-5 xl:gap-20 overflow-hidden">
        <div className="h-fit lg:h-full w-full lg:w-1/5 flex">
          <div
            className="w-full flex flex-wrap lg:flex-nowrap lg:items-stretch lg:flex-col  gap-5 lg:gap-2
          lg:justify-between overflow-y-scroll py-1"
          >
            {formList.map((item, id) => (
              <div key={id} onClick={() => handleFormClick(id)}>
                <OperationalAreaCard
                  label={item.label}
                  active={id === activeForm}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="h-full w-full text-center flex flex-col items-center gap-5 overflow-y-scroll">
          <h2 className="text-lg sm:text-2xl font-semibold">
            Operational Area {formList[activeForm].label}
          </h2>
          <div className="w-full flex items-center justify-end">
            <Button
              className="px-10 py-6 text-lg"
              onClick={() => setOpenDialouge(true)}
            >
              Add {formList[activeForm].label}
            </Button>
            <Dialog open={openDialouge} onOpenChange={setOpenDialouge}>
              <DialogContent className="w-[calc(100vw-1rem)] max-w-md">
                <DialogHeader>
                  {editStateData ||
                  editDistrictData ||
                  editBlockData ||
                  editPoliceStationData ||
                  editPostOfficeData ||
                  editVillageData ||
                  editUnitData
                    ? "Update"
                    : "Add"}{" "}
                  {formList[activeForm].label}
                </DialogHeader>
                <div className="py-4">{formList[activeForm].form}</div>
              </DialogContent>
            </Dialog>
          </div>
          <div className=" w-[300px] sm:w-full h-full sm:overflow-y-scroll">
            {formList[activeForm].table && formList[activeForm].table}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OperationalArea;
