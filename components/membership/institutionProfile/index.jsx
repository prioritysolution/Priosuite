"use client";
import { useSelector } from "react-redux";
import SuccessMessage from "../../../common/dialog/SuccessMessage";
import { DatePickerField } from "../../../common/formFields/DatePickerField";
import DropdownField from "../../../common/formFields/DropdownField";
import RadioField from "../../../common/formFields/RadioField";
import MemberSearchForm from "../../../common/forms/MemberSearchForm";
import { Button } from "../../ui/button";
import { Form, FormField } from "../../ui/form";
import InputField from "../../../common/formFields/InputField";
import { ScrollArea } from "../../ui/scroll-area";
import { ClipLoader } from "react-spinners";
import TextareaField from "@/common/formFields/TextareaField";

const REGISTER_NAMES = {
  address: "inst_add",
  stateId: "stateId",
  districtId: "districtId",
  blockId: "blockId",
  villageId: "villageId",
  policeStationId: "policeStationId",
  postOfficeId: "postOfficeId",
};

const OFFICE_NAMES = {
  address: "officeAddress",
  stateId: "officeStateId",
  districtId: "officeDistrictId",
  blockId: "officeBlockId",
  villageId: "officeVillageId",
  policeStationId: "officePoliceStationId",
  postOfficeId: "officePostOfficeId",
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
  const stateId = form.watch(names.stateId);
  const districtId = form.watch(names.districtId);
  const blockId = form.watch(names.blockId);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-2 gap-y-3">
      <TextareaField
        control={form.control}
        name={names.address}
        label={addressLabel}
        placeholder="Enter address"
        rows={3}
        isRequired
        disabled={disabled}
        readOnly={disabled}
      />

      <DropdownField
        control={form.control}
        name={names.stateId}
        label="State"
        options={stateData}
        optionLabelKey="State_Name"
        disabled={disabled || getStateLoading}
        loading={getStateLoading}
        isRequired
      />

      <DropdownField
        control={form.control}
        name={names.districtId}
        label="District"
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
        label="Block"
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
        label="Village"
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
        label="Police Station"
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
        label="Post Office"
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

const InstitutionProfile = ({
  form,
  loading,
  getStateLoading,
  getDistrictLoading,
  getBlockLoading,
  getPoliceStationLoading,
  getPostOfficeLoading,
  getVillageLoading,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  handleShowForm,
  handleResetForm,
  showForm,
  resetTrigger,
  getInstitutionLoading,
  handleMemberFormSubmit,
  officeDistrictData = [],
  officeBlockData = [],
  officeVillageData = [],
  officePoliceStationData = [],
  officePostOfficeData = [],
  officeGetDistrictLoading,
  officeGetBlockLoading,
  officeGetVillageLoading,
  officeGetPoliceStationLoading,
  officeGetPostOfficeLoading,
}) => {
  const stateData = useSelector((state) => state?.operationalArea?.stateData);

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

  const sameAsRegister = form.watch("sameAsRegister") === "Y";

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold "> Institution KYC</h3>
        <ScrollArea className="w-full p-2 sm:px-10 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-2 "
              autoComplete="off"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-5 gap-y-3 ">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <RadioField
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        {
                          value: "A",
                          label: "Add New Profile",
                        },
                        {
                          value: "U",
                          label: "Update Existing Profile",
                        },
                      ]}
                      className="border border-default-200 rounded-md px-3 h-10 flex items-center"
                      disabled={showForm}
                    />
                  )}
                />

                {showForm ? (
                  <div
                    className="self-end h-10 w-32 text-white bg-primary rounded-md flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResetForm();
                    }}
                  >
                    Reset
                  </div>
                ) : (
                  <div
                    className="self-end h-10 w-32 text-white bg-primary rounded-md flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      handleShowForm();
                    }}
                  >
                    Next
                  </div>
                )}
              </div>

              {showForm && form.getValues("type") === "U" && (
                <div className="w-full">
                  <MemberSearchForm
                    handleSubmit={handleMemberFormSubmit}
                    loading={getInstitutionLoading}
                    resetTrigger={resetTrigger}
                    fieldLabel="CIF No."
                  />
                </div>
              )}

              {showForm && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-2 gap-y-3 border border-primary rounded-md py-2 px-5">
                  <InputField
                    control={form.control}
                    name="inst_name"
                    label="Institution Name"
                    placeholder="Enter institution name"
                    isRequired={true}
                  />

                  <DatePickerField
                    control={form.control}
                    name="inst_dob"
                    label="Date of Formation"
                    disabledDateAfter={new Date()}
                    isRequired={true}
                  />

                  <InputField
                    control={form.control}
                    name="inst_ben"
                    label="No Of Beneficiary"
                    placeholder="Enter no of beneficiary"
                    isRequired={true}
                  />

                  <InputField
                    control={form.control}
                    name="inst_mob"
                    label="Mobile No."
                    placeholder="Enter mobile no."
                    type="number"
                    onInput={(e) => {
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                  />

                  <InputField
                    control={form.control}
                    name="int_doc"
                    label="Reg. / Docoument No"
                    placeholder="Enter Registration / Document No"
                    isRequired={true}
                  />
                </div>
              )}

              {showForm && (
                <div className="w-full border border-primary rounded-md py-3 px-5 flex flex-col gap-3">
                  <h4 className="text-base font-semibold text-slate-800">
                    Register Address
                  </h4>
                  <AddressSectionFields
                    form={form}
                    names={REGISTER_NAMES}
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
                    addressLabel="Register Address"
                  />
                </div>
              )}

              {showForm && (
                <div className="w-full border border-primary rounded-md py-3 px-5 flex flex-col gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-base font-semibold text-slate-800">
                      Office Address
                    </h4>
                    <FormField
                      control={form.control}
                      name="sameAsRegister"
                      render={({ field }) => (
                        <RadioField
                          label="Same as Register Address"
                          value={field.value}
                          onChange={field.onChange}
                          options={[
                            { value: "Y", label: "Yes" },
                            { value: "N", label: "No" },
                          ]}
                          className="mt-0 w-auto"
                        />
                      )}
                    />
                  </div>
                  <AddressSectionFields
                    form={form}
                    names={OFFICE_NAMES}
                    disabled={sameAsRegister}
                    stateData={stateData}
                    districtData={
                      sameAsRegister ? districtData : officeDistrictData
                    }
                    blockData={sameAsRegister ? blockData : officeBlockData}
                    villageData={
                      sameAsRegister ? villageData : officeVillageData
                    }
                    policeStationData={
                      sameAsRegister
                        ? policeStationData
                        : officePoliceStationData
                    }
                    postOfficeData={
                      sameAsRegister ? postOfficeData : officePostOfficeData
                    }
                    getStateLoading={getStateLoading}
                    getDistrictLoading={
                      sameAsRegister
                        ? getDistrictLoading
                        : officeGetDistrictLoading
                    }
                    getBlockLoading={
                      sameAsRegister ? getBlockLoading : officeGetBlockLoading
                    }
                    getVillageLoading={
                      sameAsRegister
                        ? getVillageLoading
                        : officeGetVillageLoading
                    }
                    getPoliceStationLoading={
                      sameAsRegister
                        ? getPoliceStationLoading
                        : officeGetPoliceStationLoading
                    }
                    getPostOfficeLoading={
                      sameAsRegister
                        ? getPostOfficeLoading
                        : officeGetPostOfficeLoading
                    }
                    addressLabel="Office Address"
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
                    "Add"
                  ) : (
                    "Update"
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
export default InstitutionProfile;
