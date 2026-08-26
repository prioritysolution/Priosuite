"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
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

const BorrowingsOpening = ({
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

  const startDate = getCookieData("fin_start_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Borrowings Account Openings</h3>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
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
                        optionLabelKey="Option_Value" // Specify the key for label
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
                        optionLabelKey="Option_Value" // Specify the key for label
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
                    maxLength={15}
                    isRequired
                  />

                  <DatePickerField
                    control={form.control}
                    name="issueDate"
                    label="Issue Date"
                    endYear={getYear(new Date(startDate))}
                    disabledDateAfter={new Date(startDate).setDate(
                      new Date(startDate).getDate() - 1,
                    )}
                    isBackDate={true}
                    isRequired
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
                        optionLabelKey="Ledger_Name" // Specify the key for label
                        placeholder="Select principal ledger"
                        searchPlaceholder="Search principal ledger..."
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
                        optionLabelKey="Ledger_Name" // Specify the key for label
                        placeholder="Select interest ledger"
                        searchPlaceholder="Search interest ledger..."
                        isRequired
                      />
                    )}
                  />

                  <InputField
                    control={form.control}
                    name="outstandingBalance"
                    label="Outstanding Balance"
                    placeholder="Enter outstanding balance"
                    type="number"
                    isRequired
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-1/5 self-end"
                disabled={loading}
              >
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
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default BorrowingsOpening;
