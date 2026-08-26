"use client";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import getCookieData from "@/utils/getCookieData";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getYear } from "date-fns";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const BankOpening = ({ loading, form, handleSubmit }) => {
  const accountTypeData = useSelector(
    (state) => state?.openBankAccount?.bankAccountTypeData
  );

  const bankGlData = useSelector((state) => state?.openBankAccount?.bankGlData);

  const startDate = getCookieData("fin_start_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Bank Account Opening</h3>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                  <DatePickerField
                    control={form.control}
                    name="openingDate"
                    label="Opening Date"
                    endYear={getYear(new Date(startDate))}
                    disabledDateAfter={new Date(startDate).setDate(
                      new Date(startDate).getDate() - 1
                    )}
                    isBackDate={true}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="bankName"
                    label="Bank Name"
                    placeholder="Enter bank name"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="bankBranch"
                    label="Bank Branch"
                    placeholder="Enter bank branch"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="ifscCode"
                    label="IFSC Code"
                    placeholder="Enter ifsc code"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="accountNo"
                    label="Account No."
                    placeholder="Enter account no."
                    type="number"
                    maxLength={15}
                    isRequired
                  />

                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <DropdownField
                        label="Account Type"
                        value={field.value}
                        onChange={field.onChange}
                        options={accountTypeData}
                        optionLabelKey="Option_Value" // Specify the key for label
                        placeholder="Select account type"
                        searchPlaceholder="Search account type..."
                        isRequired
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankGl"
                    render={({ field }) => (
                      <DropdownField
                        label="Bank GL."
                        value={field.value}
                        onChange={field.onChange}
                        options={bankGlData}
                        optionLabelKey="Ledger_Name" // Specify the key for label
                        placeholder="Select bank gl."
                        searchPlaceholder="Search bank gl...."
                        isRequired
                      />
                    )}
                  />

                  <InputField
                    control={form.control}
                    name="openingBalance"
                    label="Opening Balance"
                    placeholder="Enter opening balance"
                    type="number"
                    isRequired
                  />
                </div>
              </div>

              <Button type="submit" className="w-full sm:w-1/5 self-end" disabled={loading}>
                {loading ? (
                  <ClipLoader
                    color="#d7e6f4"
                    size={20}
                    speedMultiplier={0.7}
                  />
                ) : (
                  "Add"
                )}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
};
export default BankOpening;
