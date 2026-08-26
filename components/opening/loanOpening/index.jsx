"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import getCookieData from "@/utils/getCookieData";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { getYear } from "date-fns";

const LoanOpening = ({
  loading,
  addLoanAccountLoading,
  checkLoanEligibleLoading,
  form,
  handleSubmit,
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  amountErrorMessage,
  showEmi,
  loanEligible,
  resetTrigger,
}) => {
  const [showBasicInfo, setShowBasicInfo] = useState(true);
  const productData = useSelector(
    (state) => state?.newApplication?.loanProductData,
  );

  const durationUnitData = useSelector(
    (state) => state?.newApplication?.durationUnitData,
  );

  const repaymentModeData = useSelector(
    (state) => state?.newApplication?.repaymentModeData,
  );

  const startDate = getCookieData("fin_start_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Loan Opening</h3>

        <ScrollArea className="w-full h-full">
          <div className="w-full mb-5">
            <MemberSearchForm
              handleSubmit={handleMemberFormSubmit}
              showDate
              loanDateRange={startDate}
              loading={loading}
              resetTrigger={resetTrigger}
              endYear={getYear(new Date(startDate))}
              disabledDateAfter={new Date(startDate).setDate(
                new Date(startDate).getDate() - 1,
              )}
              onPopover={false}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <div className="w-full flex justify-between items-center">
                    <div className="w-5" />
                    <h3 className="text-xl font-semibold text-center flex-grow">
                      Basic Info Block
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowBasicInfo(!showBasicInfo)}
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      {showBasicInfo ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {showBasicInfo && (
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
                        className="resize-none"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="mobile"
                        label="Mobile No."
                        placeholder="Enter mobile no."
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="memberType"
                        label="Member Type"
                        placeholder="Enter member type"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="shareBalance"
                        label="Share Balance"
                        placeholder="Enter share balance"
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Application Info Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <DatePickerField
                      control={form.control}
                      name="applicationDate"
                      label="Application Date"
                      disabled
                    />

                    <InputField
                      control={form.control}
                      name="applicationNo"
                      label="Manual Application No."
                      placeholder="Enter application no."
                    />

                    <InputField
                      control={form.control}
                      name="accountNo"
                      label="Manual Account No."
                      placeholder="Enter account no."
                      type="number"
                      maxLength={4}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="ledgerFolio"
                      label="Ledger Folio"
                      placeholder="Enter ledger folio"
                    />

                    <DropdownField
                      control={form.control}
                      name="productId"
                      label="Product"
                      options={productData}
                      optionLabelKey="Prod_Sh_Name"
                      loading={checkLoanEligibleLoading}
                      isRequired
                    />

                    <div className="w-full flex flex-col gap-1.5">
                      <InputField
                        control={form.control}
                        name="applicationAmount"
                        label="Application Amount"
                        placeholder="Enter application amount"
                        type="number"
                        readOnly={!loanEligible}
                        isRequired
                      />
                      {amountErrorMessage && (
                        <p className="text-destructive text-sm mt-1">
                          {amountErrorMessage}
                        </p>
                      )}
                    </div>

                    <InputField
                      control={form.control}
                      name="rateOfInterest"
                      label="Rate Of Interest"
                      placeholder="Enter rate of interest"
                      type="number"
                      readOnly
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="duration"
                      label="Duration"
                      placeholder="Enter duration"
                      type="number"
                      readOnly={!loanEligible}
                      isRequired
                    />

                    <DropdownField
                      control={form.control}
                      name="durationUnit"
                      label="Duration Unit"
                      options={durationUnitData}
                      optionLabelKey="Option_Value"
                      placeholder="Select duration unit"
                      searchPlaceholder="Search duration unit..."
                      disabled={!form.getValues("productId") && !loanEligible}
                      isRequired
                    />

                    <DropdownField
                      control={form.control}
                      name="repaymentMode"
                      label="Repayment Mode"
                      options={repaymentModeData}
                      optionLabelKey="Option_Value"
                      placeholder="Select repayment mode"
                      searchPlaceholder="Search repayment mode..."
                      disabled={!form.getValues("productId") && !loanEligible}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="finalRepaymentDate"
                      label="Final Repayment Date"
                      placeholder="Enter final repayment date"
                      readOnly
                    />

                    {showEmi && (
                      <InputField
                        control={form.control}
                        name="emiAmount"
                        label="EMI Amount"
                        placeholder="Enter emi amount"
                        readOnly
                      />
                    )}

                    <InputField
                      control={form.control}
                      name="outstandingBalance"
                      label="Outstanding Balance"
                      placeholder="Enter outstanding balance"
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="dueInterest"
                      label="Due Interest"
                      placeholder="Enter due interest"
                      isRequired
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={!loanEligible || addLoanAccountLoading}
                >
                  {addLoanAccountLoading ? (
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
export default LoanOpening;
