"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
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
import getCookieData from "@/utils/getCookieData";
import { getYear } from "date-fns";
import { useEffect, useState } from "react";
import { IoCalculator } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const InvestmentOpenAccount = ({
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
  handleCalculateMatureAmount,
}) => {
  const { t } = useTranslation();
  const [isActiveDenom, setIsActiveDenom] = useState(false);
  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  const investmentTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentTypeData,
  );

  const accountTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentAccountTypeData,
  );

  const interestTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentInterestTypeData,
  );

  const principalLedgerData = useSelector(
    (state) => state.investmentOpenAccount.investmentPrincipalLedgerData,
  );
  const interestLedgerData = useSelector(
    (state) => state.investmentOpenAccount.investmentInterestLedgerData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

 

  const durationTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentDurationData,
  );

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-black p-5 gap-5 overflow-hidden">
      <h3 className="text-2xl font-semibold text-center">
        {t("investment.openInvestmentAccount")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DropdownField
                  control={form.control}
                  name="investmentType"
                  label={t("investment.investmentType")}
                  options={investmentTypeData}
                  optionLabelKey="Option_Value"
                  placeholder={t("investment.selectInvestmentType")}
                  searchPlaceholder={t("investment.searchInvestmentType")}
                  isRequired={true}
                />

                <DropdownField
                  control={form.control}
                  name="accountType"
                  label={t("investment.accountType")}
                  options={accountTypeData}
                  optionLabelKey="Option_Value"
                  placeholder={t("investment.selectAccountType")}
                  searchPlaceholder={t("investment.searchAccountType")}
                  isRequired={true}
                />

                <InputField
                  control={form.control}
                  name="bankName"
                  label={t("common.bankName")}
                  placeholder={t("investment.enterBankName")}
                  isRequired={true}
                />

                <InputField
                  control={form.control}
                  name="accountNo"
                  label={t("common.accountNo")}
                  placeholder={t("investment.enterAccountNo")}
                  type="number"
                  // onInput={(e) => {
                  //   if (e.target.value.length > 12) {
                  //     e.target.value = e.target.value.slice(0, 12);
                  //   }
                  // }}
                  isRequired={true}
                />

                <DatePickerField
                  control={form.control}
                  name="openingDate"
                  label={t("investment.openingDate")}
                  // startYear={
                  //   startDate
                  //     ? getYear(new Date(startDate))
                  //     : getYear(new Date())
                  // }
                  // disabledDateBefore={
                  //   startDate ? new Date(startDate) : undefined
                  // }
                  // disabledDateAfter={beg_date ? new Date(beg_date) : new Date()}
                  // endYear={
                  //   beg_date ? getYear(new Date(beg_date)) : getYear(new Date())
                  // }
                  isRequired={true}
                  disabled={true}
                />

                <InputField
                  control={form.control}
                  name="amount"
                  label={t("common.amount")}
                  placeholder={t("investment.enterAmount")}
                  type="number"
                  isRequired={true}
                />

                <InputField
                  control={form.control}
                  name="rateOfInterest"
                  label={t("investment.rateOfInterest")}
                  placeholder={t("investment.enterRateOfInterest")}
                  type="number"
                  isRequired={true}
                />

                <DropdownField
                  control={form.control}
                  name="interestType"
                  label={t("investment.interestType")}
                  options={interestTypeData}
                  optionLabelKey="Option_Value"
                  placeholder={t("investment.selectInterestType")}
                  searchPlaceholder={t("investment.searchInterestType")}
                  isRequired={true}
                />

                <InputField
                  control={form.control}
                  name="duration"
                  label={t("investment.duration")}
                  placeholder={t("investment.enterDuration")}
                  type="number"
                  isRequired={true}
                />

                <DropdownField
                  control={form.control}
                  name="durtype"
                  label={t("investment.durationType")}
                  options={durationTypeData}
                  optionLabelKey="Option_Value"
                  placeholder={t("investment.selectDurationType")}
                  searchPlaceholder={t("investment.searchDurationType")}
                  isRequired={true}
                />

                <InputField
                  control={form.control}
                  name="matureDate"
                  label={t("investment.matureDate")}
                  placeholder={t("investment.matureDate")}
                  readOnly
                  displayValue={form.watch("matureDate") || ""}
                />

                <FormField
                  control={form.control}
                  name="matureAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("investment.matureAmount")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Input
                            placeholder={t("investment.enterMatureAmount")}
                            type="number"
                            {...field}
                            className="h-10"
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  onClick={handleCalculateMatureAmount}
                                  className="p-2.5 text-xl bg-primary rounded-lg text-white cursor-pointer h-10 flex items-center justify-center transition-colors hover:brightness-95"
                                >
                                  <IoCalculator />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("investment.calculateMatureAmount")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DropdownField
                  control={form.control}
                  name="principalLedger"
                  label={t("investment.principalLedger")}
                  options={principalLedgerData}
                  optionLabelKey="Ledger_Name"
                  placeholder={t("investment.selectLedger")}
                  searchPlaceholder={t("investment.searchLedger")}
                  isRequired={true}
                />

                <DropdownField
                  control={form.control}
                  name="interestLedger"
                  label={t("investment.interestLedger")}
                  options={interestLedgerData}
                  optionLabelKey="Ledger_Name"
                  placeholder={t("investment.selectLedger")}
                  searchPlaceholder={t("investment.searchLedger")}
                  isRequired={true}
                />
              </div>
            </div>

            <div className="w-full bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6 shadow-sm mt-6">
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-lg font-semibold text-slate-700">
                  {t("investment.voucherDetails")}
                </h4>
                <p className="text-xs text-slate-500">
                  {t("investment.voucherDetailsDescription")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField
                  control={form.control}
                  name="particulars"
                  label={t("common.particulars")}
                  placeholder={t("investment.enterParticulars")}
                  isRequired={true}
                />
                <InputField
                  control={form.control}
                  name="refVouchNo"
                  label={t("investment.refVouchNo")}
                  placeholder={t("investment.enterRefVouchNo")}
                />

                {/* Transaction Mode */}
                <FormField
                  control={form.control}
                  name="transMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end h-full">
                      <FormLabel className="mb-2">
                        {t("common.transactionMode")}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-x-6 h-10 items-center border border-input rounded-lg px-3 bg-slate-50"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t("common.cash")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="bank" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
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

              {/* Conditional Bank Dropdown or Cash Denomination Table */}
              {transMode === "cash" ? (
                isActiveDenom && (
                  <div className="w-full border border-slate-100 rounded-xl p-4 bg-slate-50/50 mt-2">
                    <h5 className="text-sm font-semibold text-slate-700 mb-3">
                      {t("investment.cashDenomination")}
                    </h5>
                    <CashDenomTable
                      notes={notes}
                      denominators={denominators}
                      totalAmount={cashTransactionTotal}
                      cashTransactionGrandTotal={cashTransactionGrandTotal}
                      handleDenominatorChange={handleDenominatorChange}
                      amountTobePaid={Number(form.getValues("amount"))}
                      outTable={true}
                      tableType="in"
                    />
                  </div>
                )
              ) : (
                <div className="w-full md:w-1/3">
                  <DropdownField
                    control={form.control}
                    name="bank"
                    label={t("common.bank")}
                    options={bankAccountData}
                    optionLabelKey="Bank_Name"
                    placeholder={t("investment.selectBank")}
                    searchPlaceholder={t("investment.searchBank")}
                    isRequired={transMode === "bank"}
                  />
                </div>
              )}

              {/* Submit Action */}
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-40 h-10 font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("common.add")
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
    </div>
  );
};

export default InvestmentOpenAccount;
