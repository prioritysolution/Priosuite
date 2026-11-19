"use client";


import { useTranslation } from "react-i18next";
import AccountSearchForm from "@/common/forms/AccountSearchForm";
import AccountSearchTable from "@/common/tables/AccountSearchTable";
import CashDenomTable from "@/common/tables/CashDenomTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import getCookieData from "@/utils/getCookieData";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  premiumFieldTrigger,
  premiumTabsList,
  premiumTabsTrigger,
} from "@/common/formFields/fieldStyles";

const Mature = ({
  loading,
  getMatureLoading,
  getSpecimenLoading,
  postMatureLoading,
  notes,
  inDenominators,
  outDenominators,
  cashInTransactionTotal,
  cashOutTransactionTotal,
  cashInTransactionGrandTotal,
  cashOutTransactionGrandTotal,
  handleInDenominatorChange,
  handleOutDenominatorChange,
  form,
  handleSubmit,
  handleAccountFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  showLedger,
  handleShowLedger,
  showLedgerDialog,
  setShowLedgerDialog,
  ledgerHeaderData,
  ledgerTableData,
  totalDeposit,
  totalWithdrawn,
  totalInterest,
  userName,
  currentDate,
  currentTime,
  fromDate,
  handleSeeSpecimen,
  photoLink,
  signatureLink,
  optionForm,
  handleOptionFormSubmit,
  showSearchAccountForm,
  disableOperationTypeForm,
  transMode,
  bank,
  refVouchNo,
  handleSearchAccountListByMemberNo,
  handleSearchAccountListByName,
  handleSelectClick,
  dialougeOpen,
  setDialougeOpen,
  handleFetchData,
  savingsAccountFullName,
  savingsAccountBalance,
  showMatureDialog,
  setShowMatureDialog,
  handleCancelPremature,
  handleResetOperation,
  handleCalculateMaturityInterest,
  isInterestCalculated,
  getDepositMaturityInterestApiCall,
  getDepositMaturityBonusInterestApiCall,
  showBonusDialog,
  setShowBonusDialog,
  showPayoutInterestDialog,
  setShowPayoutInterestDialog,
  resetTrigger,
  currentSavingsPage,
  setCurrentSavingsPage,
  lastSavingsPage,
  activeTab,
  setActiveTab,
  getLedgerLoading,
}) => {
  const { t } = useTranslation();


  // console.log("depositReceiptData=", depositReceiptData);

  const [bonusInterest, setBonusInterest] = useState("");
  const [payoutInterest, setPayoutInterest] = useState("");
  const [isActiveDenom, setIsActiveDenom] = useState(false);
  const [isInterestEditable, setIsInterestEditable] = useState(false);
  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
      setIsInterestEditable(Number(getCookieData("is_open")) === 1);
    }
  }, []);

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const accountListData = useSelector(
    (state) => state?.deposit?.searchAccountData,
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const operateProductData = useSelector(
    (state) => state?.mature?.operateProductData,
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold ">{t("deposit.mature.title")}</h3>

        <Form {...optionForm}>
          <form
            onSubmit={optionForm.handleSubmit(handleOptionFormSubmit)}
            className="w-full flex items-center justify-center px-2 sm:px-10"
            autoComplete="off"
          >
            <div className="w-full border border-primary rounded-lg p-3 sm:p-5 flex flex-col gap-3">
              <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                  {t("deposit.mature.operationType")}
                </h3>
              </div>

              <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                <FormField
                  control={optionForm.control}
                  name="operationType"
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-0">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={disableOperationTypeForm}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                          {[
                            {
                              value: "close",
                              label: t("deposit.mature.close"),
                            },
                            {
                              value: "mature",
                              label: t("deposit.mature.mature"),
                            },
                          ].map((option) => {
                            const isSelected = field.value === option.value;
                            return (
                              <FormItem key={option.value} className="space-y-0">
                                <FormLabel
                                  className={`flex items-center gap-3 rounded-md border px-4 py-3 cursor-pointer transition-colors ${
                                    isSelected
                                      ? "border-primary bg-primary/5 text-primary"
                                      : "border-input bg-white hover:border-primary/40"
                                  } ${
                                    disableOperationTypeForm
                                      ? "opacity-70 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  <FormControl>
                                    <RadioGroupItem value={option.value} />
                                  </FormControl>
                                  <span className="text-sm font-medium">
                                    {option.label}
                                  </span>
                                </FormLabel>
                              </FormItem>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex sm:justify-end">
                  {disableOperationTypeForm ? (
                    <Button
                      type="button"
                      className="w-full sm:w-28"
                      onClick={(e) => {
                        e.preventDefault();
                        handleResetOperation();
                      }}
                    >
                      {t("deposit.buttons.reset")}
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full sm:w-28">
                      {t("deposit.buttons.next")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>

        {showSearchAccountForm ? (
          <ScrollArea className="w-full h-full px-2 sm:px-10">
            <div className="w-full mb-2">
              <AccountSearchForm
                loading={getMatureLoading}
                handleSubmit={handleAccountFormSubmit}
                showLedger={showLedger}
                handleShowLedger={handleShowLedger}
                showLedgerDialog={showLedgerDialog}
                setShowLedgerDialog={setShowLedgerDialog}
                ledgerHeaderData={ledgerHeaderData}
                ledgerTableData={ledgerTableData}
                totalDeposit={totalDeposit}
                totalWithdrawn={totalWithdrawn}
                totalInterest={totalInterest}
                userName={userName}
                currentDate={currentDate}
                currentTime={currentTime}
                fromDate={fromDate}
                toDate={form.getValues("closeDate")}
                resetTrigger={resetTrigger}
                allowAlphanumeric
                formLabel={
                  optionForm.getValues("operationType") === "close"
                    ? t("deposit.mature.close")
                    : t("deposit.mature.mature")
                }
                // showDateFix={true}
                operateProductData={operateProductData}
                showProduct={true}
                getLedgerLoading={getLedgerLoading}
              />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full flex flex-col gap-2 justify-between"
                autoComplete="off"
              >
                {visibleBlock && (
                  <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-3">
                    <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                      <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                        {t("deposit.sections.basicInfo")}
                      </h3>
                    </div>
                    {getMatureLoading ? (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                        {Array.from({
                          length:
                            optionForm.getValues("operationType") === "close"
                              ? 8
                              : 10,
                        }).map((_, index) => (
                          <div
                            key={index}
                            className="w-full flex flex-col gap-[10px]"
                          >
                            <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                            <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                          </div>
                        ))}
                        <Skeleton className="h-10 w-full rounded-md bg-secondary self-end" />
                      </div>
                    ) : (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                        <InputField
                          control={form.control}
                          name="memberNo"
                          label={t("deposit.fields.memberNo")}
                          placeholder={t("deposit.placeholders.memberNo")}
                          readOnly
                        />
                        <InputField
                          control={form.control}
                          name="cifNo"
                          label={t("deposit.fields.cifNo")}
                          placeholder={t("deposit.placeholders.cifNo")}
                          readOnly
                        />
                        <InputField
                          control={form.control}
                          name="refAcNo"
                          label={t("deposit.fields.manualRefAccountNo")}
                          placeholder={t("deposit.placeholders.manualRefAccountNo")}
                          readOnly
                        />
                        <InputField
                          control={form.control}
                          name="memberName"
                          label={t("deposit.fields.memberName")}
                          placeholder={t("deposit.placeholders.memberName")}
                          readOnly
                        />
                        <InputField
                          control={form.control}
                          name="gurdianName"
                          label={t("deposit.fields.guardianName")}
                          placeholder={t("deposit.placeholders.guardianName")}
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="mobile"
                          label={t("deposit.fields.mobileNo")}
                          placeholder={t("deposit.placeholders.mobileNo")}
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="panNo"
                          label={t("deposit.fields.panNo")}
                          placeholder={t("deposit.placeholders.panNo")}
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="rateOfInterest"
                          label={t("deposit.fields.rateOfInterest")}
                          placeholder={t("deposit.placeholders.rateOfInterest")}
                          readOnly
                        />

                        {optionForm.getValues("operationType") !== "close" && (
                          <>
                            <InputField
                              control={form.control}
                              name="maturityDate"
                              label={t("deposit.fields.maturityDate")}
                              placeholder={t("deposit.placeholders.maturityDate")}
                              readOnly
                            />

                            <InputField
                              control={form.control}
                              name="maturityAmount"
                              label={t("deposit.fields.maturityAmount")}
                              placeholder={t("deposit.placeholders.maturityAmount")}
                              readOnly
                            />
                          </>
                        )}

                        <InputField
                          control={form.control}
                          name="availableBalance"
                          label={t("deposit.fields.availableBalance")}
                          placeholder={t("deposit.placeholders.availableBalance")}
                          readOnly
                        />

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={handleSeeSpecimen}
                              className="self-end"
                            >
                              {t("deposit.buttons.seeSpecimen")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[925px]">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                              <div className="flex flex-col items-center gap-2 text-center font-semibold">
                                <h3>{t("deposit.common.photo")}</h3>

                                <div className=" w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] xl:w-[400px] xl:h-[400px] border border-primary mx-auto relative flex items-center justify-center">
                                  {getSpecimenLoading ? (
                                    <ClipLoader
                                      color="#00264d"
                                      size={50}
                                      speedMultiplier={0.7}
                                    />
                                  ) : (
                                    <Image
                                      fill
                                      alt="Photo"
                                      src={photoLink || ""}
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-2 text-center font-semibold">
                                <h3>{t("deposit.common.signature")}</h3>

                                <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] xl:w-[400px] xl:h-[400px] border border-primary mx-auto relative flex items-center justify-center">
                                  {getSpecimenLoading ? (
                                    <ClipLoader
                                      color="#00264d"
                                      size={50}
                                      speedMultiplier={0.7}
                                    />
                                  ) : (
                                    <Image
                                      fill
                                      alt="Signature"
                                      src={signatureLink || ""}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                )}

                {visibleBlock && (
                  <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-3">
                    <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                      <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                        {t("deposit.sections.closeInfo")}
                      </h3>
                    </div>
                    {getMatureLoading ? (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                        {Array.from({
                          length: 5,
                        }).map((_, index) => (
                          <div
                            key={index}
                            className="w-full flex flex-col gap-[10px]"
                          >
                            <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                            <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                          </div>
                        ))}
                        <Skeleton className="h-10 w-full rounded-md bg-secondary self-end" />
                      </div>
                    ) : (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 items-end">
                        <DatePickerField
                          control={form.control}
                          name="closeDate"
                          label={t("deposit.fields.closeDate")}
                          startYear={2000}
                          endYear={2050}
                          disabled
                        />

                        <InputField
                          control={form.control}
                          name="amount"
                          label={t("deposit.fields.principalAmount")}
                          placeholder={t("deposit.placeholders.amount")}
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="interest"
                          label={t("deposit.fields.interest")}
                          placeholder={t("deposit.placeholders.interest")}
                          type="number"
                          className="w-full"
                          containerClassName="w-full"
                          disabled={!isInterestEditable}
                          onInput={(e) => {
                            if (Number(e.target.value) < 0) e.target.value = "0";
                          }}
                        />

                        {optionForm.getValues("operationType") === "mature" ? (
                          <InputField
                            control={form.control}
                            name="bonusInterest"
                            label={t("deposit.fields.bonusInterest")}
                            placeholder={t("deposit.placeholders.bonusInterest")}
                            className="w-full"
                            containerClassName="w-full"
                            type="number"
                            onInput={(e) => {
                              if (Number(e.target.value) < 0) e.target.value = "0";
                            }}
                          />
                        ) : (
                          <></>
                        )}

                        {optionForm.getValues("operationType") === "mature" && (
                          <InputField
                            control={form.control}
                            name="findAmount"
                            label={t("deposit.fields.findAmount")}
                            placeholder={t("deposit.placeholders.findAmount")}
                            type="number"
                            className="w-full"
                            containerClassName="w-full"
                            onInput={(e) => {
                              if (Number(e.target.value) < 0) e.target.value = "0";
                            }}
                          />
                        )}

                        <InputField
                          control={form.control}
                          name="totalAmount"
                          label={
                            optionForm.getValues("operationType") === "mature"
                              ? "Total Amount ( - Find Amount)"
                              : "Total Amount"
                          }
                          placeholder={t("deposit.placeholders.totalAmount")}
                          className="w-full"
                          containerClassName="w-full"
                          readOnly
                        />

                        <div
                          className={`text-nowrap px-3 py-2 rounded-md h-fit text-center select-none transition-all ${
                            isInterestCalculated
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-primary text-white cursor-pointer"
                          }`}
                          onClick={
                            !isInterestCalculated
                              ? handleCalculateMaturityInterest
                              : undefined
                          }
                        >
                          <p>{t("deposit.buttons.calculateInterest")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {visibleBlock && (
                  <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-3">
                    <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                      <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                        {t("deposit.sections.transaction")}
                      </h3>
                    </div>
                    {getMatureLoading ? (
                      <div className="w-full border border-primary rounded-md p-2 sm:p-5 mb-5 flex flex-col gap-3">
                        <Skeleton className=" h-10 w-full lg:w-[500px] bg-secondary " />
                        <div className="w-48 flex flex-col gap-[10px]">
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col gap-3">
                        <FormField
                          control={form.control}
                          name="transMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full lg:w-fit">
                              <FormLabel>{t("deposit.common.selectTransanctionMode")}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="cash" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Cash
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="bank" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Bank
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="savings" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Savings
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3">
                          <InputField
                            control={form.control}
                            name="refVouchNo"
                            label={t("deposit.fields.refVoucherNo")}
                            placeholder={t("deposit.placeholders.refVoucherNo")}
                            isRequired={transMode === "bank"}
                          />
                          {transMode === "cash" ? (
                            isActiveDenom ? (
                              <div className="lg:w-1/2 w-full flex flex-col lg:flex-row gap-10 col-span-2">
                                <DoubleCashDenomTable
                                  notes={notes}
                                  inDenominators={outDenominators}
                                  outDenominators={inDenominators}
                                  totalInAmount={cashOutTransactionTotal}
                                  totalOutAmount={cashInTransactionTotal}
                                  cashInTransactionGrandTotal={
                                    cashOutTransactionGrandTotal
                                  }
                                  cashOutTransactionGrandTotal={
                                    cashInTransactionGrandTotal
                                  }
                                  handleInDenominatorChange={
                                    handleOutDenominatorChange
                                  }
                                  handleOutDenominatorChange={
                                    handleInDenominatorChange
                                  }
                                  primaryInput="out"
                                />
                              </div>
                            ) : null
                          ) : transMode === "bank" ? (
                            <DropdownField
                              control={form.control}
                              name="bank"
                              label={t("deposit.fields.bank")}
                              options={bankAccountData}
                              optionLabelKey="Bank_Name"
                              placeholder={t("deposit.placeholders.selectBank")}
                              searchPlaceholder={t("deposit.placeholders.searchBank")}
                              isRequired
                            />
                          ) : transMode === "savings" ? (
                            <>
                              <FormField
                                control={form.control}
                                name="savingsAccountType"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full">
                                    <FormLabel>{t("deposit.fields.accountType")}</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                                      >
                                        {optionForm.getValues(
                                          "operationType",
                                        ) !== "close" && (
                                          <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                              <RadioGroupItem value="own" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              Own Account
                                            </FormLabel>
                                          </FormItem>
                                        )}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="other" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            Other Account
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {form.getValues("savingsAccountType") ===
                              "other" ? (
                                <Dialog
                                  open={dialougeOpen}
                                  onOpenChange={setDialougeOpen}
                                >
                                  <div className="flex flex-col sm:flex-row items-end gap-3 sm:gap-5 w-full">
                                    <div className="w-full">
                                      <InputField
                                        control={form.control}
                                        name="savingsAccountNo"
                                        label={t("deposit.fields.accountNo")}
                                        placeholder={t(
                                          "deposit.placeholders.accountNo",
                                        )}
                                        type="number"
                                        readOnly
                                        endContent={
                                          <DialogTrigger
                                            asChild
                                            className="cursor-pointer text-lg text-muted-foreground hover:text-primary transition-colors"
                                          >
                                            <span>
                                              <IoSearch />
                                            </span>
                                          </DialogTrigger>
                                        }
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      onClick={handleFetchData}
                                      className="w-full sm:w-auto px-5 h-10 font-medium text-nowrap"
                                    >
                                      Fetch Details
                                    </Button>
                                  </div>

                                  <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[825px]">
                                    <DialogHeader
                                      className={`w-full flex items-center justify-center`}
                                    >
                                      <DialogTitle>{t("deposit.common.searchAccount")}</DialogTitle>
                                    </DialogHeader>
                                    <div className="w-full overflow-y-scroll">
                                      <div className="w-full ">
                                        <Tabs
                                          defaultValue="account"
                                          value={activeTab}
                                          onValueChange={setActiveTab}
                                          className="w-full flex items-center justify-center flex-col"
                                        >
                                          <TabsList
                                            className={premiumTabsList(
                                              "w-full sm:w-[70%]",
                                            )}
                                          >
                                            <TabsTrigger
                                              value="memberNo"
                                              className={premiumTabsTrigger()}
                                            >
                                              By Member No.
                                            </TabsTrigger>
                                            <TabsTrigger
                                              value="name"
                                              className={premiumTabsTrigger()}
                                            >
                                              By Name
                                            </TabsTrigger>
                                          </TabsList>
                                          <TabsContent
                                            value="memberNo"
                                            className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-x-4"
                                          >
                                            <InputField
                                              control={form.control}
                                              name="dialougeMemberNo"
                                              label={t(
                                                "deposit.fields.memberNo",
                                              )}
                                              autoComplete="off"
                                              placeholder={t(
                                                "deposit.placeholders.searchByMemberNo",
                                              )}
                                              formItemClassName="w-full min-w-0"
                                            />
                                            <Button
                                              type="button"
                                              className="w-full sm:w-auto px-10 shrink-0"
                                              onClick={
                                                handleSearchAccountListByMemberNo
                                              }
                                            >
                                              Search
                                            </Button>
                                          </TabsContent>
                                          <TabsContent
                                            value="name"
                                            className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-x-4"
                                          >
                                            <InputField
                                              control={form.control}
                                              name="dialougeAccountName"
                                              label={t("deposit.common.name")}
                                              autoComplete="off"
                                              placeholder={t(
                                                "deposit.placeholders.searchByName",
                                              )}
                                              formItemClassName="w-full min-w-0"
                                            />
                                            <Button
                                              type="button"
                                              className="w-full sm:w-auto px-10 shrink-0"
                                              onClick={
                                                handleSearchAccountListByName
                                              }
                                            >
                                              Search
                                            </Button>
                                          </TabsContent>
                                        </Tabs>
                                      </div>
                                      <div className="w-full max-h-[400px] overflow-y-scroll">
                                        <AccountSearchTable
                                          data={accountListData}
                                          handleSelectData={handleSelectClick}
                                          currentAccountPage={
                                            currentSavingsPage
                                          }
                                          setCurrentAccountPage={
                                            setCurrentSavingsPage
                                          }
                                          lastAccountPage={lastSavingsPage}
                                        />
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <DropdownField
                                  control={form.control}
                                  name="savings"
                                  label={t("deposit.fields.savings")}
                                  options={savingsAccountData}
                                  optionLabelKey="Account_No"
                                  placeholder={t("deposit.placeholders.selectSavings")}
                                  searchPlaceholder={t("deposit.placeholders.searchSavings")}
                                />
                              )}

                              {form.getValues("savingsAccountType") ===
                              "own" ? (
                                <InputField
                                  control={form.control}
                                  name="savingsName"
                                  label={t("deposit.fields.accountName")}
                                  placeholder={t("deposit.placeholders.memberName")}
                                  className="w-full"
                                  containerClassName="w-full"
                                  readOnly
                                />
                              ) : (
                                <></>
                              )}

                              {form.getValues("savingsAccountType") ===
                              "own" ? (
                                <InputField
                                  control={form.control}
                                  name="savingsBalance"
                                  label={t("deposit.fields.accountBalance")}
                                  placeholder={t("deposit.placeholders.availableBalance")}
                                  className="w-full"
                                  containerClassName="w-full"
                                  readOnly
                                />
                              ) : (
                                <></>
                              )}

                              {savingsAccountFullName &&
                              form.getValues("savingsAccountType") ===
                                "other" ? (
                                <InputField
                                  control={form.control}
                                  name="savingsAccountName"
                                  label={t("deposit.fields.memberName")}
                                  placeholder={t("deposit.placeholders.memberName")}
                                  value={savingsAccountFullName}
                                  readOnly
                                />
                              ) : (
                                <></>
                              )}

                              {savingsAccountBalance &&
                              form.getValues("savingsAccountType") ===
                                "other" ? (
                                <InputField
                                  control={form.control}
                                  name="savingsAccountBalance"
                                  label={t("deposit.fields.accountBalance")}
                                  placeholder={t("deposit.placeholders.availableBalance")}
                                  value={savingsAccountBalance}
                                  readOnly
                                />
                              ) : (
                                <></>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {visibleBlock && (
                  <Button
                    type="submit"
                    className="w-full sm:w-1/5 self-end"
                    disabled={
                      postMatureLoading ||
                      !Number(form.getValues("totalAmount")) ||
                      (transMode === "cash" &&
                        isActiveDenom &&
                        (optionForm.getValues("operationType") === "close"
                          ? Number(cashInTransactionGrandTotal) -
                              Number(cashOutTransactionGrandTotal) !==
                            Number(form.getValues("totalAmount"))
                          : Number(cashInTransactionGrandTotal) -
                              Number(cashOutTransactionGrandTotal) !==
                            Number(form.getValues("totalAmount")))) ||
                      (transMode === "bank" &&
                        (!bank || !String(refVouchNo || "").trim())) ||
                      (transMode === "savings" &&
                        (form.getValues("savingsAccountType") === "own"
                          ? !form.getValues("savings")
                          : !form.getValues("savingsAccountNo")))
                    }
                  >
                    {postMatureLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : optionForm.getValues("operationType") === "close" ? (
                      t("deposit.mature.processToClose")
                    ) : (
                      t("deposit.mature.processToMature")
                    )}
                  </Button>
                )}
              </form>
            </Form>
          </ScrollArea>
        ) : (
          <></>
        )}
      </div>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />

      <Dialog open={showMatureDialog} onOpenChange={setShowMatureDialog}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
          <DialogTitle className="w-full text-center">
            {t("deposit.mature.maturityDateExceeds")}
          </DialogTitle>
          <div className="w-full flex flex-col gap-5 items-center justify-center">
            <p className="w-full text-center">
              {t("deposit.mature.maturityDateMessage")}{" "}
              <span className="font-semibold">
                {form.getValues("maturityDate")}.
              </span>{" "}
              {t("deposit.mature.prematureConfirm")}
            </p>
            <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <Button
                className="w-full sm:w-auto px-6 bg-destructive hover:bg-destructive/90"
                onClick={handleCancelPremature}
              >
                {t("deposit.buttons.no")}
              </Button>
              <Button
                className="w-full sm:w-auto px-6"
                onClick={() => setShowMatureDialog(false)}
              >
                {t("deposit.buttons.yes")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBonusDialog} onOpenChange={setShowBonusDialog}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
          <DialogTitle className="w-full text-center">
            {t("deposit.mature.bonusInterestTitle")}
          </DialogTitle>
          <div className="w-full flex flex-col gap-5 items-center justify-center">
            <p className="w-full text-center">
              {t("deposit.mature.maturityDateMessage")}{" "}
              <span className="font-semibold">
                {form.getValues("closeDate") &&
                  format(form.getValues("closeDate"), "dd-MM-yyyy")}
                .
              </span>
              {t("deposit.mature.bonusInterestQuestion")}
            </p>
            <Input
              placeholder={t("deposit.placeholders.bonusInterest")}
              type="number"
              min="0"
              value={bonusInterest}
              onChange={(e) => {
                const value = e.target.value;
                setBonusInterest(Number(value) < 0 ? "0" : value);
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
              className={premiumFieldTrigger()}
            />

            <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <Button
                className="w-full sm:w-auto px-6 bg-destructive hover:bg-destructive/90"
                onClick={() => setShowBonusDialog(false)}
              >
                {t("deposit.buttons.no")}
              </Button>
              <Button
                className="w-full sm:w-auto px-6"
                onClick={() =>
                  getDepositMaturityBonusInterestApiCall(bonusInterest)
                }
              >
                {t("deposit.buttons.yes")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPayoutInterestDialog}
        onOpenChange={setShowPayoutInterestDialog}
      >
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
          <DialogTitle className="w-full text-center">
            {t("deposit.mature.payoutInterest")}
          </DialogTitle>
          <div className="w-full flex flex-col gap-5 items-center justify-center">
            <p className="w-full text-center">
              {t("deposit.mature.prematureMessage")}
            </p>
            <Input
              placeholder={t("deposit.placeholders.interest")}
              type="number"
              min="0"
              value={payoutInterest}
              onChange={(e) => {
                const value = e.target.value;
                setPayoutInterest(Number(value) < 0 ? "0" : value);
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
              className={premiumFieldTrigger()}
            />

            <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <Button
                className="w-full sm:w-auto px-6 bg-destructive hover:bg-destructive/90"
                onClick={() => setShowPayoutInterestDialog(false)}
              >
                {t("deposit.buttons.cancel")}
              </Button>
              <Button
                className="w-full sm:w-auto px-6"
                onClick={() =>
                  getDepositMaturityInterestApiCall(payoutInterest)
                }
              >
                {t("deposit.buttons.next")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Mature;
