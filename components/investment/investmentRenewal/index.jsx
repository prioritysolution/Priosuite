"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InvestmentLedger from "@/common/ledger/investmentLedger/InvestmentLedger";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getYear } from "date-fns";
import { IoPrint, IoCalculator } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import getCookieData from "@/utils/getCookieData";

const InvestmentRenewal = ({
  loading,
  form,
  handleSubmit,
  handleCalculateMatureAmount,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  disableRenwal,
  isTdsEnabled,
  handleShowLedger,
  showLedger,
  setShowLedger,
  ledgerHeaderData,
  ledgerTableData,
  totalWithdrawn,
  totalDeposit,
  userName,
  currentDate,
  currentTime,
  fromDate,
  toDate,
  getLedgerLoading,
}) => {
  const investmentAccountData = useSelector(
    (state) => state?.investmentInterest?.investmentAccountData,
  );

  const interestTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentInterestTypeData,
  );

  const durationTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentDurationData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");
  const matureAmountValue = form.watch("matureAmount");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Investment Renewal</h3>

        <ScrollArea className="w-full h-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              <div className="w-full flex items-center justify-start border border-primary rounded-lg p-5 gap-5">
                <div className="flex items-center gap-5 w-1/2">
                  <DropdownField
                    control={form.control}
                    name="accountNo"
                    label="Account No."
                    options={investmentAccountData}
                    optionLabelKey="Accout_No"
                    placeholder="Select account no."
                    searchPlaceholder="Search account no...."
                  />

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={handleShowLedger}
                          className={cn(
                            "p-2 px-5 text-2xl bg-primary rounded-md text-white cursor-pointer mt-8",
                            {
                              "bg-gray-500 cursor-not-allowed":
                                !form.getValues("accountNo"),
                            },
                          )}
                        >
                          <IoPrint />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Ledger</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <h3 className="w-full text-center text-xl font-semibold">
                  Basic Info Block
                </h3>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <InputField
                    control={form.control}
                    name="openingDate"
                    label="Open Date"
                    placeholder="Enter open date"
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="investmentAmount"
                    label="Investment Amount"
                    placeholder="Enter investment amount"
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="rateOfInterest"
                    label="Rate Of Interest"
                    placeholder="Enter rate of interest"
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="maturityDate"
                    label="Maturity Date"
                    placeholder="Enter maturity date"
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="maturityAmount"
                    label="Maturity Amount"
                    placeholder="Enter maturity amount"
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="interestAmount"
                    label="Interest Amount"
                    placeholder="Enter interest amount"
                    readOnly
                  />
                </div>
              </div>

              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <h3 className="w-full text-center text-xl font-semibold">
                  Renewal Info Block
                </h3>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <DatePickerField
                    control={form.control}
                    name="renewalDate"
                    label="Renewal Date"
                    disabled={true}
                  />

                  <InputField
                    control={form.control}
                    name="effectDate"
                    label="Effect Date"
                    placeholder="Enter effect date"
                    readOnly
                  />

                  <DropdownField
                    control={form.control}
                    name="interestType"
                    label="Interest Type"
                    options={interestTypeData}
                    optionLabelKey="Option_Value"
                    placeholder="Select interest type"
                    searchPlaceholder="Search interest type..."
                  />

                  <InputField
                    control={form.control}
                    name="duration"
                    label="Duration"
                    placeholder="Enter duration"
                    type="number"
                    min={0}
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
                    name="newRateOfInterest"
                    label="Rate Of Interest"
                    placeholder="Enter rate of interest"
                    type="number"
                  />

                  <InputField
                    control={form.control}
                    name="tdsAmount"
                    label="TDS Amount"
                    placeholder="Enter tds amount"
                    type="number"
                    disabled={!isTdsEnabled}
                  />

                  <InputField
                    control={form.control}
                    name="newInvestmentAmount"
                    label="Investment Amount"
                    placeholder="Enter investment amount"
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="matureDate"
                    label="Mature Date"
                    placeholder="Mature date"
                    readOnly
                    displayValue={form.watch("matureDate") || ""}
                  />

                  <FormField
                    control={form.control}
                    name="matureAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Mature Amount
                          <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <Input
                              placeholder="Enter mature amount"
                              type="number"
                              name={field.name}
                              ref={field.ref}
                              onBlur={field.onBlur}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    onClick={handleCalculateMatureAmount}
                                    className="p-2 text-2xl bg-primary rounded-md text-white cursor-pointer"
                                  >
                                    <IoCalculator />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Calculate Mature Amount</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className=" w-full md:w-1/3 self-end"
                disabled={
                  disableRenwal ||
                  loading ||
                  !(Number(matureAmountValue) > 0)
                }
              >
                {loading ? (
                  <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
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

      <InvestmentLedger
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalWithdrawn={totalWithdrawn}
        totalDeposit={totalDeposit}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
        loading={getLedgerLoading}
      />
    </div>
  );
};
export default InvestmentRenewal;
