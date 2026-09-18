"use client";

import { useTranslation } from "react-i18next";

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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { t } = useTranslation();

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
      label: t("master.operationalArea.tabs.state"),
      form: (
        <StateForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationStateForm}
          handleSubmit={handleMasterOperationStateSubmit}
          editData={editStateData}
          onCancel={() => setOpenDialouge(false)}
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
      label: t("master.operationalArea.tabs.district"),
      form: (
        <DistrictForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationDistrictForm}
          handleSubmit={handleMasterOperationDistrictSubmit}
          editData={editDistrictData}
          stateData={stateListData}
          onCancel={() => setOpenDialouge(false)}
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
      label: t("master.operationalArea.tabs.block"),
      form: (
        <BlockForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationBlockForm}
          handleSubmit={handleMasterOperationBlockSubmit}
          editData={editBlockData}
          stateData={stateListData}
          districtData={districtListUnderStateData}
          onCancel={() => setOpenDialouge(false)}
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
      label: t("master.operationalArea.tabs.policeStation"),
      form: (
        <PoliceStationForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationPoliceStationForm}
          handleSubmit={handleMasterOperationPoliceStationSubmit}
          editData={editPoliceStationData}
          stateData={stateListData}
          districtData={districtListUnderStateData}
          onCancel={() => setOpenDialouge(false)}
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
      label: t("master.operationalArea.tabs.postOffice"),
      form: (
        <PostOfficeForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationPostOfficeForm}
          handleSubmit={handleMasterOperationPostOfficeSubmit}
          editData={editPostOfficeData}
          stateData={stateListData}
          districtData={districtListUnderStateData}
          onCancel={() => setOpenDialouge(false)}
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
      label: t("master.operationalArea.tabs.village"),
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
          onCancel={() => setOpenDialouge(false)}
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
      label: t("master.operationalArea.tabs.unit"),
      form: (
        <UnitForm
          postLoading={postLoading}
          updateLoading={updateLoading}
          form={masterOperationUnitForm}
          handleSubmit={handleMasterOperationUnitSubmit}
          editData={editUnitData}
          onCancel={() => setOpenDialouge(false)}
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

  return (
    <div className="flex h-full w-full rounded-lg bg-[#fefefe] p-3 sm:p-4">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border-2 border-primary p-3 sm:p-4">
        <Tabs
          value={String(activeForm)}
          onValueChange={(value) => setActiveForm(Number(value))}
          className="flex h-full min-h-0 w-full flex-col"
        >
          <TabsList className="h-auto w-full shrink-0 flex-wrap justify-start gap-1 rounded-lg bg-muted/60 p-1">
            {formList.map((item, id) => (
              <TabsTrigger
                key={item.label}
                value={String(id)}
                className="min-w-[96px] flex-1 text-xs transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm sm:text-sm"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {formList.map((item, id) => (
            <TabsContent
              key={item.label}
              value={String(id)}
              className="mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-hidden data-[state=inactive]:hidden"
            >
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-[#163A5F] sm:text-xl">
                  {t("master.operationalArea.heading", { name: item.label })}
                </h2>
                <Button
                  className="h-10 shrink-0 px-5 text-sm sm:h-11 sm:px-6 sm:text-base"
                  onClick={() => setOpenDialouge(true)}
                >
                  {t("master.operationalArea.addItem", { name: item.label })}
                </Button>
              </div>

              <div className="min-h-0 flex-1 overflow-auto">
                {item.table}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={openDialouge}>
          <DialogContent
            hideClose
            className="w-[calc(100vw-1.5rem)] max-w-[640px] gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-[0_20px_50px_rgba(22,58,95,0.18)] sm:max-w-[680px] sm:rounded-2xl"
          >
            <DialogHeader className="border-b border-[#e8eef5] bg-[#F7FAFD] px-5 py-4 text-left sm:px-6 sm:py-5">
              <DialogTitle className="text-lg font-semibold text-[#163A5F] sm:text-xl">
                {editStateData ||
                editDistrictData ||
                editBlockData ||
                editPoliceStationData ||
                editPostOfficeData ||
                editVillageData ||
                editUnitData
                  ? t("common.buttons.update")
                  : t("common.buttons.add")}{" "}
                {formList[activeForm].label}
              </DialogTitle>
              <DialogDescription className="mt-1 text-[13px] text-[#7A93B0]">
                {editStateData ||
                editDistrictData ||
                editBlockData ||
                editPoliceStationData ||
                editPostOfficeData ||
                editVillageData ||
                editUnitData
                  ? t("master.operationalArea.dialogUpdate", {
                      name: formList[activeForm].label.toLowerCase(),
                    })
                  : t("master.operationalArea.dialogAdd", {
                      name: formList[activeForm].label.toLowerCase(),
                    })}
              </DialogDescription>
            </DialogHeader>
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              {formList[activeForm].form}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OperationalArea;
