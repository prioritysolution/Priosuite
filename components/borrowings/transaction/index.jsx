"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import BorrowingLedger from "@/common/ledger/borrowingsLedger/BorrowingLedger";
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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const parseDateHelper = (dStr) => {
  if (!dStr) return null;
  if (dStr instanceof Date) return dStr;

  if (typeof dStr === "string" && (dStr.includes("-") || dStr.includes("/"))) {
    const parts = dStr.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
      if (parts[2].split("T")[0].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? null : d;
};

const Transaction = ({
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
  mode,
  transMode,
  handleShowLedger,
  showLedger,
  setShowLedger,
  ledgerHeaderData,
  ledgerTableData,
  totalDisburse,
  totalPrincipalRefund,
  totalInterestRefund,
  userName,
  currentDate,
  currentTime,
  fromDate,
  toDate,
  getLedgerLoading,
}) => {
  const [isActiveDenom, setIsActiveDenom] = useState(false);
  const [showInfoBlock, setShowInfoBlock] = useState(true);
  const beg_date = getCookieData("beg_date");
  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  const accountData = useSelector(
    (state) => state?.borrowingTransaction?.borrowingAccountData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Transaction</h3>

        <ScrollArea className="w-full h-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-3 justify-between"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                {/* <h3 className="w-full text-center text-xl font-semibold">
                  Operation Block
                </h3> */}
                <div className="w-full flex flex-col lg:flex-row gap-x-10 gap-y-3 ">
                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col md:flex-row md:col-span-3 items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full mt-5 h-fit self-end">
                        <FormLabel>Select mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 gap-x-5"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="disburse" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Disburse
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="repayment" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Repayment
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="account"
                    render={({ field }) => (
                      <div className="flex items-start gap-5 w-full ">
                        <DropdownField
                          label="Account"
                          value={field.value}
                          onChange={field.onChange}
                          options={accountData}
                          optionLabelKey="Account_No"
                          placeholder="Select account"
                          searchPlaceholder="Search account..."
                          isRequired
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
                                      !form.getValues("account"),
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
                </div>
              </div>
              {/* info block */}

              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="flex justify-between items-center w-full">
                  <h3 className="text-xl font-semibold w-full text-center pl-6">
                    Account Info Block
                  </h3>
                  <div
                    onClick={() => setShowInfoBlock(!showInfoBlock)}
                    className="cursor-pointer text-2xl text-primary hover:text-primary/80 transition-colors"
                  >
                    {showInfoBlock ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>

                {showInfoBlock && (
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="productName"
                      label="Product Name"
                      placeholder="Enter product name"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="bankName"
                      label="Bank Name"
                      placeholder="Enter bank name"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="disburseDate"
                      label="Disburse Date"
                      placeholder="Enter disburse date"
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
                      name="overdueRate"
                      label="Overdue Rate"
                      placeholder="Enter overdue rate"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="dueDate"
                      label="Due Date"
                      placeholder="Enter due date"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="balance"
                      label="Balance"
                      placeholder="Enter balance"
                      readOnly
                    />
                  </div>
                )}
              </div>

              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <h3 className="w-full text-center text-xl font-semibold">
                  {mode === "disburse" ? "Disburse" : "Repayment"} Block
                </h3>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <DatePickerField
                    control={form.control}
                    name="date"
                    label={`${
                      mode === "disburse" ? "Disburse" : "Repayment"
                    } Date`}
                    disabled={true}
                    defaultValue={parseDateHelper(beg_date) || new Date()}
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

                  <InputField
                    control={form.control}
                    name="principal"
                    label={`${
                      mode === "disburse" ? "Disburse" : "Principal"
                    } Amount`}
                    placeholder={`Enter ${
                      mode === "disburse" ? "Disburse" : "Principal"
                    } amount`}
                    isRequired
                  />

                  {mode !== "disburse" && (
                    <>
                      {" "}
                      <InputField
                        control={form.control}
                        name="interest"
                        label="Interest Amount"
                        placeholder="Enter interest amount"
                        isRequired={form.getValues("mode") === "repayment"}
                      />
                      <InputField
                        control={form.control}
                        name="total"
                        label="Total Amount"
                        placeholder="Enter total amount"
                        readOnly
                      />{" "}
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="transMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col md:flex-row md:col-span-2 items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full mt-5">
                        <FormLabel>Select transanction mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 gap-x-5"
                          >
                            {mode !== "disburse" && (
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="cash" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Cash
                                </FormLabel>
                              </FormItem>
                            )}
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
                  />
                </div>
                {mode !== "disburse" && transMode === "cash" ? (
                  isActiveDenom ? (
                    <div className="w-full h-full flex flex-col md:col-span-2 gap-5 p-2 md:p-5 rounded-md border border-primary">
                      <CashDenomTable
                        notes={notes}
                        denominators={denominators}
                        totalAmount={cashTransactionTotal}
                        cashTransactionGrandTotal={cashTransactionGrandTotal}
                        handleDenominatorChange={handleDenominatorChange}
                        amountTobePaid={Number(form.getValues("total"))}
                        outTable={true}
                        tableType="in"
                      />
                    </div>
                  ) : null
                ) : (
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2">
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
                        />
                      )}
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className=" w-full md:w-1/3 self-end"
                disabled={
                  loading ||
                  !Number(form.getValues("total")) ||
                  (mode !== "disburse" &&
                    transMode === "cash" &&
                    isActiveDenom &&
                    cashTransactionGrandTotal !==
                      Number(form.getValues("total")))
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

      <BorrowingLedger
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalDisburse={totalDisburse}
        totalPrincipalRefund={totalPrincipalRefund}
        totalInterestRefund={totalInterestRefund}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
        loading={getLedgerLoading}
      />
    </div>
  );
};
export default Transaction;
