"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoCalculator } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const InvestmentOpening = ({
  loading,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  handleCalculateMatureAmount,
}) => {
  const investmentTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentTypeData
  );

  const accountTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentAccountTypeData
  );

  const interestTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentInterestTypeData
  );

  const principalLedgerData = useSelector(
    (state) => state.investmentOpenAccount.investmentPrincipalLedgerData
  );
  const interestLedgerData = useSelector(
    (state) => state.investmentOpenAccount.investmentInterestLedgerData
  );

  const durationTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentDurationData,
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Open Investment Account</h3>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                  <DropdownField
                    control={form.control}
                    name="investmentType"
                    label="Investment Type"
                    options={investmentTypeData}
                    optionLabelKey="Option_Value"
                    placeholder="Select investment type"
                    searchPlaceholder="Search investment type..."
                    isRequired
                  />
                  <DropdownField
                    control={form.control}
                    name="accountType"
                    label="Account Type"
                    options={accountTypeData}
                    optionLabelKey="Option_Value"
                    placeholder="Select account type"
                    searchPlaceholder="Search account type..."
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
                    name="accountNo"
                    label="Account No."
                    placeholder="Enter account no."
                    type="number"
                    maxLength={15}
                    isRequired
                  />

                  <DatePickerField
                    control={form.control}
                    name="openingDate"
                    label="Opening Date"
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

                  <DropdownField
                    control={form.control}
                    name="interestType"
                    label="Interest Type"
                    options={interestTypeData}
                    optionLabelKey="Option_Value"
                    placeholder="Select interest type"
                    searchPlaceholder="Search interest type..."
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="duration"
                    label="Duration"
                    placeholder="Enter duration"
                    type="number"
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="durtype"
                    label="Duration Type"
                    options={durationTypeData}
                    optionLabelKey="Option_Value"
                    placeholder="Select duration type"
                    searchPlaceholder="Search duration type..."
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="matureDate"
                    label="Mature Date"
                    placeholder="Mature date"
                    readOnly
                    isRequired
                    displayValue={form.watch("matureDate") || ""}
                  />

                  <div className="w-full flex flex-col gap-1.5">
                    <InputField
                      control={form.control}
                      name="matureAmount"
                      label="Mature Amount"
                      placeholder="Enter mature amount"
                      type="number"
                      endContent={
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={handleCalculateMatureAmount}
                                className="p-2 text-xl bg-primary rounded-md text-white cursor-pointer h-full flex items-center"
                              >
                                <IoCalculator />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Calculate Mature Amount</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      }
                      isRequired
                    />
                  </div>

                  <DropdownField
                    control={form.control}
                    name="principalLedger"
                    label="Principal Ledger"
                    options={principalLedgerData}
                    optionLabelKey="Ledger_Name"
                    placeholder="Select principal ledger"
                    searchPlaceholder="Search principal ledger..."
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="interestLedger"
                    label="Interest Ledger"
                    options={interestLedgerData}
                    optionLabelKey="Ledger_Name"
                    placeholder="Select interest ledger"
                    searchPlaceholder="Search interest ledger..."
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
export default InvestmentOpening;
