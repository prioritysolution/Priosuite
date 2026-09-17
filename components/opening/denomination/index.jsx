"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import CashDenomTable from "@/common/tables/CashDenomTable";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const Denomination = ({
  loading,
  notes,
  denominators,
  //   cashTransactionTotal,
  //   cashTransactionGrandTotal,
  handleDenominatorChange,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
}) => {
  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Denomination</h3>

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
                    name="date"
                    label="Date"
                    
                    disabled
                  />

                  <FormField
                    control={form.control}
                    name="branchId"
                    render={({ field }) => (
                      <DropdownField
                        label="Branch"
                        value={field.value}
                        onChange={field.onChange}
                        options={branchData}
                        optionLabelKey="Branch_Name" // Specify the key for label
                        placeholder="Select branch"
                        searchPlaceholder="Search branch..."
                        isRequired
                      />
                    )}
                  />
                </div>

                <div className="w-full p-3 border border-input rounded-md">
                  <h3 className="text-center font-semibold text-xl mb-5">
                    Denomination Table
                  </h3>
                  <CashDenomTable
                    notes={notes}
                    denominators={denominators}
                    totalAmount={0}
                    cashTransactionGrandTotal={0}
                    handleDenominatorChange={handleDenominatorChange}
                    amountTobePaid={0}
                    outTable={false}
                    tableType="In"
                    onlyDenom
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-1/5 self-end"
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
export default Denomination;
