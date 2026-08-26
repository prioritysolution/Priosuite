"use client";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getYear } from "date-fns";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import getCookieData from "@/utils/getCookieData";

const OpenBankAccount = ({ loading, form, handleSubmit }) => {
  const accountTypeData = useSelector(
    (state) => state?.openBankAccount?.bankAccountTypeData,
  );

  const bankGlData = useSelector((state) => state?.openBankAccount?.bankGlData);

  const beg_date = getCookieData("beg_date");
  console.log("beg_date OpenBankAccount=", beg_date);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-black p-5 gap-5 overflow-hidden">
      <h3 className="text-2xl font-semibold text-center">Open Bank Account</h3>

      <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full h-full flex flex-col gap-5 justify-between"
            autoComplete="off"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <DatePickerField
                control={form.control}
                name="openingDate"
                label="Opening Date"
                defaultValue={new Date(beg_date)}
                disabled={true}
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
                maxLength={11}
                isUpper={true}
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
                    optionLabelKey="Option_Value"
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
                    label="Bank GL"
                    value={field.value}
                    onChange={field.onChange}
                    options={bankGlData}
                    optionLabelKey="Ledger_Name"
                    optionValueKey="Id"
                    placeholder="Select bank gl"
                    searchPlaceholder="Search bank gl..."
                    isRequired
                  />
                )}
              />
            </div>

            <div className="w-full flex justify-end mt-4">
              <Button
                type="submit"
                className="w-full md:w-auto min-w-[150px]"
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
                ) : (
                  "Add"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
};
export default OpenBankAccount;
