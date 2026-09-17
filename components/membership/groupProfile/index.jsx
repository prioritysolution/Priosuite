"use client";
import { useSelector } from "react-redux";
import SuccessMessage from "../../../common/dialog/SuccessMessage";
import { DatePickerField } from "../../../common/formFields/DatePickerField";
import DropdownField from "../../../common/formFields/DropdownField";
import RadioField from "../../../common/formFields/RadioField";
import SearchDropdownField from "../../../common/formFields/SearchDropdownField";
import MemberSearchForm from "../../../common/forms/MemberSearchForm";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import InputField from "../../../common/formFields/InputField";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { cn } from "../../../lib/utils";
import { ClipLoader } from "react-spinners";
import TextareaField from "../../../common/formFields/TextareaField";
import getCookieData from "@/utils/getCookieData";

const GroupProfile = ({
  form,
  loading,
  getGroupTypeLoading,
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
}) => {
  const groupTypeData = useSelector(
    (state) => state?.groupProfile?.groupTypeData,
  );

  // console.log("groupTypeData", groupTypeData);

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

  const unitData = useSelector((state) => state?.operationalArea?.unitData);

  const beg_date = getCookieData("beg_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Group KYC</h3>
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
                    loading={getMemberDataLoading}
                    resetTrigger={resetTrigger}
                    fieldLabel="CIF No."
                  />
                </div>
              )}

              {showForm && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-2 gap-y-3 border border-primary rounded-md py-2 px-5">
                  <InputField
                    control={form.control}
                    name="group_no"
                    label="Group No."
                    placeholder="Enter group no."
                    onInput={(e) => {
                      if (e.target.value.length > 5) {
                        e.target.value = e.target.value.slice(0, 5);
                      }
                    }}
                  />

                  <DropdownField
                    control={form.control}
                    name="cust_type"
                    label="Group Type"
                    options={groupTypeData}
                    optionLabelKey="Option_Value"
                    disabled={getGroupTypeLoading}
                    loading={getGroupTypeLoading}
                    isRequired={true}
                  />

                  <InputField
                    control={form.control}
                    name="grp_name"
                    label="Group Name"
                    placeholder="Enter group name"
                    isRequired={true}
                  />

                  <DatePickerField
                    control={form.control}
                    name="gerp_dob"
                    label="Date of Formation"
                    defaultValue={new Date(beg_date)}
                    isRequired={true}
                    disabled={true}
                  />

                  <InputField
                    control={form.control}
                    name="grp_ben"
                    label="No Of Beneficiary"
                    placeholder="Enter no of beneficiary"
                    isRequired={true}
                  />

                  <InputField
                    control={form.control}
                    name="grp_mob"
                    label="Mobile No."
                    placeholder="Enter mobile no."
                    type="number"
                    onInput={(e) => {
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                  />

                  {/* <InputField
                    control={form.control}
                    name="grp_add"
                    label="Address"
                    placeholder="Enter address"
                    isRequired={true}
                   
                  /> */}
                  <TextareaField
                    control={form.control}
                    name="grp_add"
                    label="Address"
                    placeholder="Enter Address"
                    rows={3}
                    isRequired={true}
                  />

                  <DropdownField
                    control={form.control}
                    name="stateId"
                    label="State"
                    options={stateData}
                    optionLabelKey="State_Name"
                    disabled={getStateLoading}
                    loading={getStateLoading}
                    isRequired={true}
                  />

                  <DropdownField
                    control={form.control}
                    name="districtId"
                    label="District"
                    options={districtData}
                    optionLabelKey="Dist_Name"
                    loading={getDistrictLoading}
                    disabled={
                      !districtData ||
                      !(districtData.length > 0) ||
                      !form.getValues("stateId") ||
                      getDistrictLoading
                    }
                    isRequired={true}
                  />

                  <DropdownField
                    control={form.control}
                    name="blockId"
                    label="Block/Municipality"
                    options={blockData}
                    optionLabelKey="Block_Name"
                    loading={getBlockLoading}
                    disabled={
                      !blockData ||
                      !(blockData.length > 0) ||
                      !form.getValues("districtId") ||
                      getBlockLoading
                    }
                    isRequired={true}
                  />

                  <DropdownField
                    control={form.control}
                    name="villageId"
                    label="Village"
                    options={villageData}
                    optionLabelKey="Vill_Name"
                    loading={getVillageLoading}
                    disabled={
                      !villageData ||
                      !(villageData.length > 0) ||
                      !form.getValues("blockId") ||
                      getVillageLoading
                    }
                  />

                  <DropdownField
                    control={form.control}
                    name="policeStationId"
                    label="Police Station"
                    options={policeStationData}
                    optionLabelKey="STation_Name"
                    loading={getPoliceStationLoading}
                    disabled={
                      !policeStationData ||
                      !(policeStationData.length > 0) ||
                      !form.getValues("districtId") ||
                      getPoliceStationLoading
                    }
                  />

                  <DropdownField
                    control={form.control}
                    name="postOfficeId"
                    label="Post Office"
                    options={postOfficeData}
                    optionLabelKey="Post_Off_Name"
                    loading={getPostOfficeLoading}
                    disabled={
                      !postOfficeData ||
                      !(postOfficeData.length > 0) ||
                      !form.getValues("districtId") ||
                      getPostOfficeLoading
                    }
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
export default GroupProfile;
