"use client";

import { useTranslation } from "react-i18next";
import SuccessMessage from "@/common/dialog/SuccessMessage";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import RadioField from "@/common/formFields/RadioField";
import SearchDropdownField from "@/common/formFields/SearchDropdownField";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import TextareaField from "@/common/formFields/TextareaField";

const PERMANENT_NAMES = {
  address: "address",
  stateId: "stateId",
  districtId: "districtId",
  blockId: "blockId",
  villageId: "villageId",
  policeStationId: "policeStationId",
  postOfficeId: "postOfficeId",
};

const PRESENT_NAMES = {
  address: "presentAddress",
  stateId: "presentStateId",
  districtId: "presentDistrictId",
  blockId: "presentBlockId",
  villageId: "presentVillageId",
  policeStationId: "presentPoliceStationId",
  postOfficeId: "presentPostOfficeId",
};

const AddressSectionFields = ({
  form,
  names,
  disabled = false,
  stateData,
  districtData,
  blockData,
  villageData,
  policeStationData,
  postOfficeData,
  getStateLoading,
  getDistrictLoading,
  getBlockLoading,
  getVillageLoading,
  getPoliceStationLoading,
  getPostOfficeLoading,
  addressLabel = "Address",
}) => {
  const { t } = useTranslation();

  const stateId = form.watch(names.stateId);
  const districtId = form.watch(names.districtId);
  const blockId = form.watch(names.blockId);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-2 gap-y-3">
      <TextareaField
        control={form.control}
        name={names.address}
        label={addressLabel === "Address" ? t("membership.memberProfile.fields.address") : addressLabel}
        placeholder={t("membership.memberProfile.placeholders.address")}
        rows={3}
        isRequired
        disabled={disabled}
        readOnly={disabled}
      />

      <DropdownField
        control={form.control}
        name={names.stateId}
        label={t("membership.memberProfile.fields.state")}
        options={stateData}
        optionLabelKey="State_Name"
        disabled={disabled || getStateLoading}
        loading={getStateLoading}
        isRequired
      />

      <DropdownField
        control={form.control}
        name={names.districtId}
        label={t("membership.memberProfile.fields.district")}
        options={districtData}
        optionLabelKey="Dist_Name"
        loading={getDistrictLoading}
        disabled={
          disabled ||
          !districtData ||
          !(districtData.length > 0) ||
          !stateId ||
          getDistrictLoading
        }
        isRequired
      />

      <DropdownField
        control={form.control}
        name={names.blockId}
        label={t("membership.memberProfile.fields.blockMunicipality")}
        options={blockData}
        optionLabelKey="Block_Name"
        loading={getBlockLoading}
        disabled={
          disabled ||
          !blockData ||
          !(blockData.length > 0) ||
          !districtId ||
          getBlockLoading
        }
        isRequired
      />

      <DropdownField
        control={form.control}
        name={names.villageId}
        label={t("membership.memberProfile.fields.village")}
        options={villageData}
        optionLabelKey="Vill_Name"
        loading={getVillageLoading}
        disabled={
          disabled ||
          !villageData ||
          !(villageData.length > 0) ||
          !blockId ||
          getVillageLoading
        }
      />

      <DropdownField
        control={form.control}
        name={names.policeStationId}
        label={t("membership.memberProfile.fields.policeStation")}
        options={policeStationData}
        optionLabelKey="STation_Name"
        loading={getPoliceStationLoading}
        disabled={
          disabled ||
          !policeStationData ||
          !(policeStationData.length > 0) ||
          !districtId ||
          getPoliceStationLoading
        }
      />

      <DropdownField
        control={form.control}
        name={names.postOfficeId}
        label={t("membership.memberProfile.fields.postOffice")}
        options={postOfficeData}
        optionLabelKey="Post_Off_Name"
        loading={getPostOfficeLoading}
        disabled={
          disabled ||
          !postOfficeData ||
          !(postOfficeData.length > 0) ||
          !districtId ||
          getPostOfficeLoading
        }
      />
    </div>
  );
};

const MemberProfile = ({
  form,
  loading,
  getRelationLoading,
  getGenderLoading,
  getCasteLoading,
  getReligionLoading,
  getStateLoading,
  getDistrictLoading,
  getBlockLoading,
  getPoliceStationLoading,
  getPostOfficeLoading,
  getVillageLoading,
  getUnitLoading,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  handleSearchUnit,
  handleScrollUnit,
  unitInput,
  setUnitInput,
  handleShowForm,
  handleResetForm,
  showForm,
  resetTrigger,
  getMemberDataLoading,
  handleMemberFormSubmit,
  memberType,
  getMemberTypeLoading,
  presentDistrictData = [],
  presentBlockData = [],
  presentVillageData = [],
  presentPoliceStationData = [],
  presentPostOfficeData = [],
  presentGetDistrictLoading,
  presentGetBlockLoading,
  presentGetVillageLoading,
  presentGetPoliceStationLoading,
  presentGetPostOfficeLoading,
}) => {
  const { t } = useTranslation();

  const relationTypeData = useSelector(
    (state) => state?.memberProfile?.relationTypeData,
  );

  const genderData = useSelector((state) => state?.memberProfile?.genderData);

  const casteData = useSelector((state) => state?.memberProfile?.casteData);

  const religionData = useSelector(
    (state) => state?.memberProfile?.religionData,
  );

  const stateData = useSelector((state) => state?.operationalArea?.stateData);

  console.log("stateData", stateData);

  const districtData = useSelector(
    (state) => state?.operationalArea?.districtUnderStateData,
  );

  const blockData = useSelector(
    (state) => state?.operationalArea?.blockUnderDistrict,
  );

  const villageData = useSelector(
    (state) => state?.operationalArea?.villageUnderBlockData,
  );

  const policeStationData = useSelector(
    (state) => state?.operationalArea?.policeStationUnderDistrict,
  );

  const postOfficeData = useSelector(
    (state) => state?.operationalArea?.postOfficeUnderDistrict,
  );

  const unitData = useSelector((state) => state?.operationalArea?.unitData);
  const sameAsPermanent = form.watch("sameAsPermanent") === "Y";

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold ">{t("membership.memberProfile.title")}</h3>
        <ScrollArea className="w-full p-2 sm:px-10 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-2 "
              autoComplete="off"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-5 gap-y-3 ">
                {/* radiofield section */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <RadioField
                      value={field.value}
                      onChange={field.onChange}
                      customStyle
                      options={[
                        {
                          value: "A",
                          label: t("membership.memberProfile.modes.addNew"),
                        },
                        {
                          value: "U",
                          label: t("membership.memberProfile.modes.updateExisting"),
                        },
                      ]}
                      className="border border-default-200 rounded-md px-3 h-10 flex items-center"
                      disabled={showForm}
                    />
                  )}
                />

                    {/* reset and next button */}
                {showForm ? (
                  <div
                    className="self-end h-10 w-32 text-white bg-primary rounded-md flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResetForm();
                    }}
                  >
                    {t("common.buttons.reset")}
                  </div>
                ) : (
                  <div
                    className="self-end h-10 w-32 text-white bg-primary rounded-md flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      handleShowForm();
                    }}
                  >
                    {t("memberSearch.next")}
                  </div>
                )}
              </div>

              {showForm && form.getValues("type") === "U" && (
                <div className="w-full">
                  <MemberSearchForm
                    handleSubmit={handleMemberFormSubmit}
                    loading={getMemberDataLoading}
                    resetTrigger={resetTrigger}
                  />
                </div>
              )}

              {showForm && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-2 gap-y-3 border border-primary rounded-md py-2 px-5">
                  <InputField
                    control={form.control}
                    name="memberNo"
                    label={t("membership.memberProfile.fields.memberNo")}
                    placeholder={t("membership.memberProfile.placeholders.memberNo")}
                    onInput={(e) => {
                      if (e.target.value.length > 5) {
                        e.target.value = e.target.value.slice(0, 5);
                      }
                    }}
                  />

                  <DropdownField
                    control={form.control}
                    name="memberType"
                    label={t("membership.memberProfile.fields.customerType")}
                    options={memberType}
                    optionLabelKey="Option_Value"
                    disabled={getMemberTypeLoading}
                    loading={getMemberTypeLoading}
                    isRequired={true}
                  />

                  <InputField
                    control={form.control}
                    name="firstName"
                    label={t("membership.memberProfile.fields.firstName")}
                    placeholder={t("membership.memberProfile.placeholders.firstName")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="middleName"
                    label={t("membership.memberProfile.fields.middleName")}
                    placeholder={t("membership.memberProfile.placeholders.middleName")}
                  />

                  <InputField
                    control={form.control}
                    name="lastName"
                    label={t("membership.memberProfile.fields.lastName")}
                    placeholder={t("membership.memberProfile.placeholders.lastName")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="relationName"
                    label={t("membership.memberProfile.fields.relationName")}
                    placeholder={t("membership.memberProfile.placeholders.relationName")}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="relationType"
                    label={t("membership.memberProfile.fields.relationType")}
                    options={relationTypeData}
                    optionLabelKey="Option_Value"
                    disabled={getRelationLoading}
                    loading={getRelationLoading}
                    isRequired={true}
                  />

                  <DatePickerField
                    control={form.control}
                    name="dob"
                    label={t("membership.memberProfile.fields.dateOfBirth")}
                    disabledDateAfter={new Date()}
                    isRequired={true}
                  />

                  <DropdownField
                    control={form.control}
                    name="gender"
                    label={t("membership.memberProfile.fields.gender")}
                    options={genderData}
                    optionLabelKey="Option_Value"
                    disabled={getGenderLoading}
                    loading={getGenderLoading}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="caste"
                    label={t("membership.memberProfile.fields.caste")}
                    options={casteData}
                    optionLabelKey="Option_Value"
                    disabled={getCasteLoading}
                    loading={getCasteLoading}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="religion"
                    label={t("membership.memberProfile.fields.religion")}
                    options={religionData}
                    optionLabelKey="Option_Value"
                    disabled={getReligionLoading}
                    loading={getReligionLoading}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="mobile"
                    label={t("membership.memberProfile.fields.mobileNo")}
                    placeholder={t("membership.memberProfile.placeholders.mobileNo")}
                    type="number"
                    onInput={(e) => {
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                  />

                  <InputField
                    control={form.control}
                    name="email"
                    label={t("membership.memberProfile.fields.email")}
                    placeholder={t("membership.memberProfile.placeholders.email")}
                    type="email"
                  />
                </div>
              )}

              {showForm && (
                <div className="w-full border border-primary rounded-md py-3 px-5 flex flex-col gap-3">
                  <h4 className="text-base font-semibold text-slate-800">
                    {t("membership.memberProfile.sections.permanentAddress")}
                  </h4>
                  <AddressSectionFields
                    form={form}
                    names={PERMANENT_NAMES}
                    stateData={stateData}
                    districtData={districtData}
                    blockData={blockData}
                    villageData={villageData}
                    policeStationData={policeStationData}
                    postOfficeData={postOfficeData}
                    getStateLoading={getStateLoading}
                    getDistrictLoading={getDistrictLoading}
                    getBlockLoading={getBlockLoading}
                    getVillageLoading={getVillageLoading}
                    getPoliceStationLoading={getPoliceStationLoading}
                    getPostOfficeLoading={getPostOfficeLoading}
                    addressLabel={t("membership.memberProfile.fields.address")}
                  />
                </div>
              )}

              {showForm && (
                <div className="w-full border border-primary rounded-md py-3 px-5 flex flex-col gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-base font-semibold text-slate-800">
                      {t("membership.memberProfile.sections.presentAddress")}
                    </h4>
                    <FormField
                      control={form.control}
                      name="sameAsPermanent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value === "Y"}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? "Y" : "N")
                              }
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer">
                            {t("membership.memberProfile.sameAsPermanent")}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <AddressSectionFields
                    form={form}
                    names={PRESENT_NAMES}
                    disabled={sameAsPermanent}
                    stateData={stateData}
                    districtData={sameAsPermanent ? districtData : presentDistrictData}
                    blockData={sameAsPermanent ? blockData : presentBlockData}
                    villageData={sameAsPermanent ? villageData : presentVillageData}
                    policeStationData={
                      sameAsPermanent
                        ? policeStationData
                        : presentPoliceStationData
                    }
                    postOfficeData={
                      sameAsPermanent ? postOfficeData : presentPostOfficeData
                    }
                    getStateLoading={getStateLoading}
                    getDistrictLoading={
                      sameAsPermanent
                        ? getDistrictLoading
                        : presentGetDistrictLoading
                    }
                    getBlockLoading={
                      sameAsPermanent ? getBlockLoading : presentGetBlockLoading
                    }
                    getVillageLoading={
                      sameAsPermanent
                        ? getVillageLoading
                        : presentGetVillageLoading
                    }
                    getPoliceStationLoading={
                      sameAsPermanent
                        ? getPoliceStationLoading
                        : presentGetPoliceStationLoading
                    }
                    getPostOfficeLoading={
                      sameAsPermanent
                        ? getPostOfficeLoading
                        : presentGetPostOfficeLoading
                    }
                    addressLabel={t("membership.memberProfile.fields.address")}
                  />
                </div>
              )}

              {showForm && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-2 gap-y-3 border border-primary rounded-md py-2 px-5">
                  <InputField
                    control={form.control}
                    name="aadhaarNo"
                    label={t("membership.memberProfile.fields.aadhaarNo")}
                    placeholder={t("membership.memberProfile.placeholders.aadhaarNo")}
                    type="number"
                    onInput={(e) => {
                      if (e.target.value.length > 12) {
                        e.target.value = e.target.value.slice(0, 12);
                      }
                    }}
                  />

                  <InputField
                    control={form.control}
                    name="voterId"
                    label={t("membership.memberProfile.fields.voterId")}
                    placeholder={t("membership.memberProfile.placeholders.voterId")}
                    onChange={(e) => {
                      form.setValue("voterId", e.target.value.toUpperCase(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />

                  <InputField
                    control={form.control}
                    name="rationNo"
                    label={t("membership.memberProfile.fields.rationCard")}
                    placeholder={t("membership.memberProfile.placeholders.rationCard")}
                    onChange={(e) => {
                      form.setValue("rationNo", e.target.value.toUpperCase(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />

                  <InputField
                    control={form.control}
                    name="panNo"
                    label={t("membership.memberProfile.fields.panCard")}
                    placeholder={t("membership.memberProfile.placeholders.panCard")}
                    onChange={(e) => {
                      form.setValue("panNo", e.target.value.toUpperCase(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </div>
              )}

              {showForm && (
                <Button
                  type="submit"
                  className="w-full md:w-1/5 self-end"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : form.getValues("type") === "A" ? (
                    t("common.buttons.add")
                  ) : (
                    t("common.buttons.update")
                  )}
                </Button>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default MemberProfile;
