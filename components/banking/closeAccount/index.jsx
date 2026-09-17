"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import BankLedger from "@/common/ledger/bankLedger/BankLedger";
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

const CloseAccount = ({
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
  getBankLoading,
}) => {
  const [isActiveDenom, setIsActiveDenom] = useState(false);
  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  console.log("bankAccountData=", bankAccountData);

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-black p-5 gap-5 overflow-hidden">
      <h3 className="text-2xl font-semibold text-center">Close Account</h3>

      <ScrollArea className="w-full h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col items-center pb-6"
            autoComplete="off"
          >
            <div className="w-full bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bank Account */}
                <FormField
                  control={form.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <div className="flex gap-3 items-end w-full">
                      <div className="flex-1">
                        <DropdownField
                          label="Bank Account"
                          value={field.value}
                          onChange={field.onChange}
                          options={bankAccountData}
                          optionLabelKey="Bank_Name"
                          placeholder="Select bank account"
                          searchPlaceholder="Search bank account..."
                          isRequired
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
                                    !form.getValues("bankAccount") ||
                                    !form.getValues("closingDate"),
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
                  )}
                />

                {/* Closing Date */}
                <DatePickerField
                  control={form.control}
                  name="closingDate"
                  label="Closing Date"
               
                  isRequired
                  disabled
                />

                {/* Available Balance */}
                <InputField
                  control={form.control}
                  name="availableBalance"
                  label="Available Balance"
                  placeholder="Enter available balance"
                  readOnly
                />

                {/* Closing Amount */}
                <InputField
                  control={form.control}
                  name="closingAmount"
                  label="Closing Amount"
                  placeholder="Enter closing amount"
                  type="number"
                  isRequired
                />

                {/* Ref Vouch No */}
                <InputField
                  control={form.control}
                  name="refVouchNo"
                  label="Ref. Vouch No."
                  placeholder="Enter ref. vouch no."
                />

                {/* Transaction Mode */}
                <FormField
                  control={form.control}
                  name="transMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end h-full">
                      <FormLabel className="mb-2">Transaction Mode</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-x-6 h-10 items-center border border-input rounded-lg px-3 bg-slate-50"
                        >
                          {!(
                            !Number.isInteger(
                              parseFloat(form.getValues("availableBalance")),
                            ) &&
                            !form.getValues("availableBalance").endsWith(".00")
                          ) && (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cash" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Cash
                              </FormLabel>
                            </FormItem>
                          )}
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="bank" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Bank
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Conditional Bank Dropdown or Cash Denomination Table */}
              {!(
                !Number.isInteger(
                  parseFloat(form.getValues("availableBalance")),
                ) && !form.getValues("availableBalance").endsWith(".00")
              ) && transMode === "cash" ? (
                isActiveDenom && (
                  <div className="w-full border border-slate-100 rounded-xl p-4 bg-slate-50/50 mt-2">
                    <h5 className="text-sm font-semibold text-slate-700 mb-3">
                      Cash Denomination
                    </h5>
                    <CashDenomTable
                      notes={notes}
                      denominators={denominators}
                      totalAmount={cashTransactionTotal}
                      cashTransactionGrandTotal={cashTransactionGrandTotal}
                      handleDenominatorChange={handleDenominatorChange}
                      amountTobePaid={Number(form.getValues("closingAmount"))}
                      outTable={false}
                      tableType="out"
                    />
                  </div>
                )
              ) : (
                <div className="w-full md:w-1/3">
                  <FormField
                    control={form.control}
                    name="bank"
                    render={({ field }) => (
                      <DropdownField
                        label="Bank"
                        value={field.value}
                        onChange={field.onChange}
                        options={
                          bankAccountData && bankAccountData.length > 0
                            ? bankAccountData.filter(
                                (item) =>
                                  item.Id.toString() !==
                                  form.getValues("bankAccount"),
                              )
                            : []
                        }
                        disabled={!form.getValues("bankAccount")}
                        optionLabelKey="Bank_Name"
                        placeholder="Select bank"
                        searchPlaceholder="Search bank..."
                        isRequired
                      />
                    )}
                  />
                </div>
              )}

              {/* Submit Action */}
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-40 h-10 font-semibold"
                  disabled={
                    (transMode === "cash" &&
                      isActiveDenom &&
                      Number(cashTransactionGrandTotal) !==
                        Number(form.getValues("closingAmount"))) ||
                    (transMode === "bank" && !form.getValues("bank")) ||
                    (form.getValues("availableBalance") &&
                      Number(form.getValues("availableBalance")) <= 0)
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

      <BankLedger
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={form.getValues("closingDate")}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalWithdrawn={totalWithdrawn}
        totalDeposit={totalDeposit}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
        loading={getBankLoading}
      />

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default CloseAccount;
