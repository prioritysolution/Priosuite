"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import getCookieData from "@/utils/getCookieData";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getYear } from "date-fns";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const MembershipOpening = ({
  loading,
  addOpeningLoading,
  form,
  handleSubmit,
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  resetTrigger,
}) => {
  const memberTypeData = useSelector(
    (state) => state?.shareProduct?.memberTypeData,
  );

  const relationTypeData = useSelector(
    (state) => state?.memberProfile?.relationTypeData,
  );

  const startDate = getCookieData("fin_start_date");

  return (
    <div className="w-full h-full flex justify-between  bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Membership Opening</h3>

        <ScrollArea className="w-full h-full   ">
          <div className="w-full mb-10">
            <MemberSearchForm
              handleSubmit={handleMemberFormSubmit}
              loading={loading}
              resetTrigger={resetTrigger}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Basic Info Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="memberName"
                      label="Member Name"
                      placeholder="Enter member name"
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="gurdianName"
                      label="Gurdian Name"
                      placeholder="Enter gurdian name"
                      readOnly
                    />
                    <TextareaField
                      control={form.control}
                      name="address"
                      label="Address"
                      placeholder="Enter address"
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="mobile"
                      label="Mobile No."
                      placeholder="Enter mobile no."
                      readOnly
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Admission Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <DatePickerField
                      control={form.control}
                      name="date"
                      label="Admission Date"
                      // startYear={2000}
                      endYear={getYear(new Date(startDate))}
                      disabledDateAfter={new Date(startDate).setDate(
                        new Date(startDate).getDate() - 1,
                      )}
                      isBackDate={true}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="admissionNo"
                      label="Admission No."
                      placeholder="Enter admission no."
                    />

                    <InputField
                      control={form.control}
                      name="ledgerFolio"
                      label="Ledger Folio"
                      placeholder="Enter ledger folio"
                    />

                    <FormField
                      control={form.control}
                      name="memberType"
                      render={({ field }) => (
                        <DropdownField
                          label="Member Type"
                          value={field.value}
                          onChange={field.onChange}
                          options={memberTypeData}
                          optionLabelKey="Option_Value" // Specify the key for label
                          placeholder="Select member type"
                          searchPlaceholder="Search member type..."
                          isRequired
                        />
                      )}
                    />

                    <InputField
                      control={form.control}
                      name="nomineeName"
                      label="Nominee Name"
                      placeholder="Enter nominee name"
                    />

                    <FormField
                      control={form.control}
                      name="nomineeRelation"
                      render={({ field }) => (
                        <DropdownField
                          label="Nominee Relation"
                          value={field.value}
                          onChange={field.onChange}
                          options={relationTypeData}
                          optionLabelKey="Option_Value" // Specify the key for label
                          placeholder="Select relation"
                          searchPlaceholder="Search relation..."
                        />
                      )}
                    />

                    <InputField
                      control={form.control}
                      name="nomineeAge"
                      label="Nominee Age"
                      placeholder="Enter nominee age"
                      type="number"
                    />

                    <InputField
                      control={form.control}
                      name="nomineeAddress"
                      label="Nominee Address"
                      placeholder="Enter nominee address"
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Share Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="openingShare"
                      label="Opening Share Value"
                      placeholder="Enter opening share value"
                      type="number"
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="openingDividend"
                      label="Opening Dividend Value"
                      placeholder="Enter opening dividend value"
                      type="number"
                      isRequired
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <Button
                  disabled={addOpeningLoading}
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                >
                  {addOpeningLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Add"
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
export default MembershipOpening;
