"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import RadioField from "@/common/formFields/RadioField";
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
import { useTranslation } from "react-i18next";

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
  bank,
  refVouchNo,
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
  const { t } = useTranslation();
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
        <h3 className="text-2xl font-semibold ">
          {t("borrowings.transaction")}
        </h3>

        <ScrollArea className="w-full h-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-3 justify-between"
              autoComplete="off"
            >
              <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                  <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                    {t("borrowings.operationBlock", "Operation")}
                  </h4>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-10 gap-y-3 items-end">
                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <RadioField
                        value={field.value}
                        onChange={field.onChange}
                        label={t("borrowings.selectMode")}
                        options={[
                          {
                            value: "disburse",
                            label: t("borrowings.disburse"),
                          },
                          {
                            value: "repayment",
                            label: t("borrowings.repayment"),
                          },
                        ]}
                        className="mt-0"
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="account"
                    render={({ field }) => (
                      <div className="flex items-end gap-2 w-full min-w-0">
                        <div className="flex-1 min-w-0">
                          <DropdownField
                            label={t("common.account")}
                            value={field.value}
                            onChange={field.onChange}
                            options={accountData}
                            optionLabelKey="Account_No"
                            placeholder={t("borrowings.selectAccount")}
                            searchPlaceholder={t("borrowings.searchAccount")}
                            isRequired
                          />
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                size="icon"
                                onClick={handleShowLedger}
                                disabled={!form.getValues("account")}
                                className="h-10 w-10 shrink-0 rounded-md"
                              >
                                <IoPrint className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("common.viewLedger")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  />
                </div>
              </div>
              {/* info block */}
              <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                <div className="flex justify-between items-center w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                  <div className="w-6" />
                  <h3 className="text-base sm:text-lg font-bold text-[#00264d] tracking-wide text-center">
                    {t("borrowings.accountInfoBlock")}
                  </h3>
                  <div
                    onClick={() => setShowInfoBlock(!showInfoBlock)}
                    className="cursor-pointer text-xl text-[#00264d] hover:opacity-80 transition-opacity"
                  >
                    {showInfoBlock ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>

                {showInfoBlock && (
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="productName"
                      label={t("borrowings.productName")}
                      placeholder={t("borrowings.enterProductName")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="bankName"
                      label={t("common.bankName")}
                      placeholder={t("borrowings.enterBankName")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="disburseDate"
                      label={t("borrowings.disburseDate")}
                      placeholder={t("borrowings.enterDisburseDate")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="rateOfInterest"
                      label={t("borrowings.rateOfInterest")}
                      placeholder={t("borrowings.enterRateOfInterest")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="overdueRate"
                      label={t("borrowings.overdueRate")}
                      placeholder={t("borrowings.enterOverdueRate")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="dueDate"
                      label={t("common.dueDate")}
                      placeholder={t("borrowings.enterDueDate")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="balance"
                      label={t("common.balance")}
                      placeholder={t("borrowings.enterBalance")}
                      readOnly
                    />
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                  <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                    {mode === "disburse"
                      ? `${t("borrowings.disburse")} ${t("borrowings.block")}`
                      : `${t("borrowings.repayment")} ${t("borrowings.block")}`}
                  </h3>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <DatePickerField
                    control={form.control}
                    name="date"
                    label={`${
                      mode === "disburse"
                        ? t("borrowings.disburse")
                        : t("borrowings.repayment")
                    } ${t("common.date")}`}
                    disabled={true}
                    defaultValue={parseDateHelper(beg_date) || new Date()}
                    isRequired
                  />
                  <InputField
                    control={form.control}
                    name="particulars"
                    label={t("common.particulars")}
                    placeholder={t("common.enterParticulars")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="refVouchNo"
                    label={t("common.refVouchNo")}
                    placeholder={t("common.enterRefVouchNo")}
                    isRequired={transMode === "bank"}
                  />

                  <InputField
                    control={form.control}
                    name="principal"
                    label={`${
                      mode === "disburse"
                        ? t("borrowings.disburse")
                        : t("borrowings.principal")
                    } ${t("common.amount")}`}
                    placeholder={`${t("common.enter")} ${
                      mode === "disburse"
                        ? t("borrowings.disburse")
                        : t("borrowings.principal")
                    } ${t("common.amount").toLowerCase()}`}
                    isRequired
                  />

                  {mode !== "disburse" && (
                    <>
                      {" "}
                      <InputField
                        control={form.control}
                        name="interest"
                        label={t("borrowings.interestAmount")}
                        placeholder={t("borrowings.enterInterestAmount")}
                        isRequired={form.getValues("mode") === "repayment"}
                      />
                      <InputField
                        control={form.control}
                        name="total"
                        label={t("common.totalAmount")}
                        placeholder={t("borrowings.enterTotalAmount")}
                        readOnly
                      />{" "}
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="transMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col md:flex-row md:col-span-2 items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full mt-5">
                        <FormLabel>
                          {t("common.selectTransactionMode")}
                        </FormLabel>
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
                                  {t("common.cash")}
                                </FormLabel>
                              </FormItem>
                            )}
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bank" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t("common.bank")}
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
                    <div className="w-full flex flex-col md:col-span-2 border border-primary rounded-lg p-3 sm:p-5 gap-4">
                      <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                        <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                          {t("common.cashDenomination") || "Cash Denomination"}
                        </h4>
                      </div>
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
                          label={t("common.bank")}
                          value={field.value}
                          onChange={field.onChange}
                          options={bankAccountData}
                          optionLabelKey="Bank_Name"
                          placeholder={t("borrowings.selectBank")}
                          searchPlaceholder={t("borrowings.searchBank")}
                          isRequired
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
                      Number(form.getValues("total"))) ||
                  (transMode === "bank" &&
                    (!bank || !String(refVouchNo || "").trim()))
                }
              >
                {loading ? (
                  <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
                ) : (
                  t("common.add")
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
