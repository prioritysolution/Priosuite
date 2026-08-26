"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import getCookieData from "@/utils/getCookieData";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getYear } from "date-fns";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const NewApplication = ({
  loading,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
}) => {
  const productTypeData = useSelector(
    (state) => state.borrowingsNewApplication.productTypeData,
  );

  const repayModeData = useSelector(
    (state) => state.borrowingsNewApplication.repayModeData,
  );

  const principalLedgerData = useSelector(
    (state) => state.borrowingsNewApplication.principalLedgerData,
  );
  const interestLedgerData = useSelector(
    (state) => state.borrowingsNewApplication.interestLedgerData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");
  const beg_date = getCookieData("beg_date");

  return (
    <div className="w-full h-full flex flex-col  bg-white rounded-xl border border-black p-5 gap-5 overflow-hidden">
      <h3 className="text-2xl font-bold tracking-tight text-gray-800 text-center">
        Borrowings New Application
      </h3>

      <ScrollArea className="w-full h-full px-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-6 justify-start items-center"
            autoComplete="off"
          >
            <div className="w-full flex flex-col gap-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
              {/* Basic Details Section */}
              <div className="flex flex-col gap-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Basic Details
                </h4>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <InputField
                    control={form.control}
                    name="productName"
                    label="Product Name"
                    placeholder="Enter product name"
                    isRequired
                  />

                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <DropdownField
                        label="Product Type"
                        value={field.value}
                        onChange={field.onChange}
                        options={productTypeData}
                        optionLabelKey="Option_Value"
                        placeholder="Select product type"
                        searchPlaceholder="Search product type..."
                        isRequired
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="repaymentMode"
                    render={({ field }) => (
                      <DropdownField
                        label="Repayment Mode"
                        value={field.value}
                        onChange={field.onChange}
                        options={repayModeData}
                        optionLabelKey="Option_Value"
                        placeholder="Select repayment mode"
                        searchPlaceholder="Search repayment mode..."
                        isRequired
                      />
                    )}
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
                    name="accountNo"
                    label="Account No."
                    placeholder="Enter account no."
                    type="number"
                    isRequired
                  />
                  <DatePickerField
                    control={form.control}
                    name="issueDate"
                    label="Disb Date"
                    startYear={
                      startDate
                        ? getYear(new Date(startDate))
                        : getYear(new Date())
                    }
                    disabledDateBefore={
                      startDate ? new Date(startDate) : undefined
                    }
                    disabledDateAfter={
                      beg_date ? new Date(beg_date) : new Date()
                    }
                    endYear={
                      beg_date
                        ? getYear(new Date(beg_date))
                        : getYear(new Date())
                    }
                    isRequired={true}
                  />

                  <InputField
                    control={form.control}
                    name="amount"
                    label="Amount"
                    placeholder="Enter amount"
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="rateOfInterest"
                    label="Rate Of Interest"
                    placeholder="Enter rate of interest"
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="overdueRate"
                    label="Overdue Rate"
                    placeholder="Enter overdue rate"
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="duration"
                    label="Duration (In Month)"
                    placeholder="Enter duration"
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="dueDate"
                    label="Due Date"
                    placeholder="Enter due date"
                    readOnly
                  />
                  <FormField
                    control={form.control}
                    name="principalLedger"
                    render={({ field }) => (
                      <DropdownField
                        label="Principal Ledger"
                        value={field.value}
                        onChange={field.onChange}
                        options={principalLedgerData}
                        optionLabelKey="Ledger_Name"
                        placeholder="Select ledger"
                        searchPlaceholder="Search ledger..."
                        isRequired
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interestLedger"
                    render={({ field }) => (
                      <DropdownField
                        label="Interest Ledger"
                        value={field.value}
                        onChange={field.onChange}
                        options={interestLedgerData}
                        optionLabelKey="Ledger_Name"
                        placeholder="Select ledger"
                        searchPlaceholder="Search ledger..."
                        isRequired
                      />
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="transMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col md:flex-row md:col-span-2 items-center space-y-0 gap-x-10 gap-y-5 border border-input rounded-md px-3 pr-10 py-3 w-full md:w-fit">
                        <FormLabel>Select transanction mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 gap-x-5"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bank" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Bank
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
              </div>

              {/* Voucher Details Section */}
              <div className="flex flex-col gap-4 mt-2">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Voucher Details
                </h4>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <DatePickerField
                    control={form.control}
                    name="voucherDate"
                    label="Voucher Date"
                    disabled={true}
                    isRequired
                  />
                  <InputField
                    control={form.control}
                    name="particulars"
                    label="Particulars"
                    placeholder="Enter particulars"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="refVouchNo"
                    label="Ref. Vouch No."
                    placeholder="Enter ref. vouch no."
                  />
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 mt-2">
                  <FormField
                    control={form.control}
                    name="bank"
                    render={({ field }) => (
                      <DropdownField
                        label="Bank"
                        value={field.value}
                        onChange={field.onChange}
                        options={bankAccountData}
                        optionLabelKey="Bank_Name"
                        placeholder="Select bank"
                        searchPlaceholder="Search bank..."
                        isRequired
                      />
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full md:w-1/3 self-end"
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

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default NewApplication;
