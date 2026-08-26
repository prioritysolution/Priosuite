"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InvestmentLedger from "@/common/ledger/investmentLedger/InvestmentLedger";
import CashDenomTable from "@/common/tables/CashDenomTable";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import getCookieData from "@/utils/getCookieData";
import { getYear } from "date-fns";
import { useEffect, useState } from "react";
import { IoPrint } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const InstallmentDeposit = ({
  loading,
  notes,
  denominators,
  cashTransactionTotal,
  cashTransactionGrandTotal,
  handleDenominatorChange,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  transMode,
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
  getLedgerLoading,
}) => {
  const [isActiveDenom, setIsActiveDenom] = useState(false);
  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  const investmentAccountData = useSelector(
    (state) => state?.investmentInterest?.investmentAccountData,
  );

  console.log("investmentAccountData", investmentAccountData);

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  console.log("bankAccountData", bankAccountData);

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-black p-5 gap-5 overflow-hidden">
      <h3 className="text-2xl font-semibold text-center">
        Installment Deposit
      </h3>

      <ScrollArea className="w-full h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col items-center pb-6"
            autoComplete="off"
          >
            <div className="w-full  bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                {/* Account No */}
                <div className="flex gap-3 items-end w-full">
                  <div className="flex-1">
                    <DropdownField
                      control={form.control}
                      name="accountNo"
                      label="Account No."
                      options={investmentAccountData}
                      optionLabelKey="Accout_No"
                      placeholder="Select account no."
                      searchPlaceholder="Search account no...."
                    />
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={handleShowLedger}
                          className={cn(
                            "p-2.5 px-4 text-xl bg-primary text-white rounded-lg cursor-pointer flex items-center justify-center h-10 mb-[2px] transition-colors hover:brightness-95",
                            {
                              "bg-gray-400 cursor-not-allowed hover:brightness-100":
                                !form.watch("accountNo") ||
                                !form.watch("postingDate"),
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

                {/* Posting Date */}
                <DatePickerField
                  control={form.control}
                  name="postingDate"
                  label="Posting Date"
                  disabled={true}
                />

                {/* Installment Amount */}
                <InputField
                  control={form.control}
                  name="installmentAmount"
                  label="Installment Amount"
                  placeholder="Enter installment amount"
                  type="number"
                />

                {/* Transaction Mode */}
                <FormField
                  control={form.control}
                  name="transMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2 border border-input rounded-md px-3 py-2 w-full h-10 justify-center">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-x-5"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel className="font-normal text-sm cursor-pointer">
                              Cash
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="bank" />
                            </FormControl>
                            <FormLabel className="font-normal text-sm cursor-pointer">
                              Bank
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ref Vouch No */}
                <InputField
                  control={form.control}
                  name="refVouchNo"
                  label="Ref. Vouch No."
                  placeholder="Enter ref. vouch no."
                />

                {/* Bank dropdown if transMode is bank */}
                {transMode !== "cash" && (
                  <DropdownField
                    control={form.control}
                    name="bank"
                    label="Bank"
                    options={bankAccountData}
                    optionLabelKey="Bank_Name"
                    placeholder="Select bank"
                    searchPlaceholder="Search bank..."
                  />
                )}
              </div>

              {/* Denominations table for Cash transactions */}
              {transMode === "cash" && isActiveDenom && (
                <div className="w-full flex flex-col gap-5 p-4 md:p-6 rounded-xl border border-slate-200 bg-slate-50 mt-4">
                  <h4 className="text-sm font-semibold text-slate-700">
                    Denomination Details
                  </h4>
                  <CashDenomTable
                    notes={notes}
                    denominators={denominators}
                    totalAmount={cashTransactionTotal}
                    cashTransactionGrandTotal={cashTransactionGrandTotal}
                    handleDenominatorChange={handleDenominatorChange}
                    amountTobePaid={Number(form.getValues("installmentAmount"))}
                    outTable={true}
                    tableType="in"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="w-full flex justify-end mt-4">
                <Button
                  type="submit"
                  className="w-full md:w-fit px-10 h-10"
                  disabled={
                    loading ||
                    (transMode === "cash"
                      ? isActiveDenom &&
                        Number(cashTransactionGrandTotal) !==
                          Number(form.getValues("installmentAmount"))
                      : !form.getValues("bank"))
                  }
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
              </div>
            </div>
          </form>
        </Form>
      </ScrollArea>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />

      <InvestmentLedger
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={form.getValues("postingDate")}
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
export default InstallmentDeposit;
