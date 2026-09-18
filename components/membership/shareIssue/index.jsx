"use client";

import { useTranslation } from "react-i18next";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
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
import TextareaField from "@/common/formFields/TextareaField";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import ShareLedger from "@/common/ledger/shareLedger/ShareLedger";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import DropdownField from "@/common/formFields/DropdownField";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import ShareIssueReceipt from "./ShareIssueReceipt";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";

const ShareIssue = ({
  loading,
  getMemberDataLoading,
  postShareIssueLoading,
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
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  voucherMode,
  totalAmt,
  savings,
  bank,
  insufficientBalanceDisable,
  showLedger,
  handleShowLedger,
  showLedgerDialog,
  setShowLedgerDialog,
  ledgerHeaderData,
  ledgerTableData,
  totalRefund,
  totalIssue,
  userName,
  currentDate,
  currentTime,
  fromDate,
  getLedgerLoading,
  resetTrigger,
  isReceiptOpen,
  setIsReceiptOpen,
  shareIssueReceiptData,
  handleGenerateShareIssueReceipt,
}) => {
  const { t } = useTranslation();

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


  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  console.log("savingsAccountData=", savingsAccountData);

  const branchId = getCookieData("userBranchId");

  useEffect(() => {
    console.log("useEffect triggered - savings:", savings);
    console.log("savingsAccountData:", savingsAccountData);

    if (savings) {
      const foundAccount = savingsAccountData?.find(
        (account) => account?.Id === savings,
      );
      console.log("foundAccount:", foundAccount);

      if (foundAccount) {
        form.setValue("savingsName", foundAccount.Full_Name || "");
        // Force form to update
        form.trigger("savingsName");
      }
    } else {
      console.log("No savings selected, clearing savingsName");
      form.setValue("savingsName", "");
      form.trigger("savingsName");
    }
  }, [savings, savingsAccountData, form]);

  console.log("Current savingsName:", form.getValues("savingsName"));

  return (
    <div className="w-full h-full flex justify-between p-1  bg-[#fefefe] rounded-lg">
      <div className="w-full h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 px-2 sm:px-10  gap-2 min-h-0 overflow-hidden">
        <div className="w-full">
          <MemberSearchForm
            handleSubmit={handleMemberFormSubmit}
            loading={getMemberDataLoading}
            showDate
            label={t("membership.shareIssue.fields.transactionDate")}
            resetTrigger={resetTrigger}
            formLabel={t("membership.shareIssue.title")}
            showLedger={showLedger}
            handleShowLedger={handleShowLedger}
            showDateFix={true}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => console.log("Share Issue validation errors:", errors))}
            className="w-full flex-1 min-h-0 overflow-y-scroll"
            autoComplete="off"
          >
            <div className="grid lg:grid-cols-[7fr_3fr] gap-2 lg:h-full lg:min-h-0">
              {visibleBlock && (
                <>
                  <div className="w-full flex flex-col flex-1 min-h-0 border border-primary rounded-lg p-5 py-2 gap-2">
                    <h2 className="text-lg text-center font-semibold">
                      {t("membership.shareIssue.sections.accountDetails")}
                    </h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <div className=" w-full flex flex-col gap-2">
                        {getMemberDataLoading ? (
                          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
                            <div className="w-full flex flex-col gap-[10px]">
                              <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                              <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                            </div>
                            <div className="w-full flex flex-col gap-[10px]">
                              <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                              <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                            </div>
                            <div className="w-full flex flex-col gap-[10px]">
                              <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                              <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                            </div>
                            <div className="w-full flex flex-col gap-[10px]">
                              <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                              <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                            </div>
                            <div className="w-full flex flex-col gap-[10px]">
                              <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                              <Skeleton className="h-20 w-full rounded-md bg-secondary" />
                            </div>
                            <div className="w-full flex flex-col gap-[10px]">
                              <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                              <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                            <InputField
                              control={form.control}
                              name="memberNo"
                              label={t("membership.shareIssue.fields.memberNo")}
                              placeholder={t("membership.shareIssue.placeholders.memberNo")}
                              readOnly
                            />
                            <InputField
                              control={form.control}
                              name="cifNo"
                              label={t("membership.shareIssue.fields.cifNo")}
                              placeholder={t("membership.shareIssue.placeholders.cifNo")}
                              readOnly
                            />
                            <InputField
                              control={form.control}
                              name="memberName"
                              label={t("membership.shareIssue.fields.memberName")}
                              placeholder={t("membership.shareIssue.placeholders.memberName")}
                              readOnly
                            />
                            <InputField
                              control={form.control}
                              name="gurdianName"
                              label={t("membership.shareIssue.fields.gurdianName")}
                              placeholder={t("membership.shareIssue.placeholders.gurdianName")}
                              readOnly
                            />
                            <TextareaField
                              control={form.control}
                              name="address"
                              label={t("membership.shareIssue.fields.address")}
                              placeholder={t("membership.shareIssue.placeholders.address")}
                              className="resize-none"
                              readOnly
                            />

                            <InputField
                              control={form.control}
                              name="mobile"
                              label={t("membership.shareIssue.fields.mobileNo")}
                              placeholder={t("membership.shareIssue.placeholders.mobileNo")}
                              readOnly
                            />
                            <InputField
                              control={form.control}
                              name="branchName"
                              label={t("membership.shareIssue.fields.branchName")}
                              placeholder={t("membership.shareIssue.placeholders.branchName")}
                              readOnly
                              className={`${branchId === form.getValues("BranchId") ? "" : "text-red-700"}`}
                            />

                            <InputField
                              control={form.control}
                              name="ledgerFolio"
                              label={t("membership.shareIssue.fields.ledgerFolio")}
                              placeholder={t("membership.shareIssue.placeholders.ledgerFolio")}
                              readOnly
                            />

                            <InputField
                              control={form.control}
                              name="availableBal"
                              label={t("membership.shareIssue.fields.availableBalance")}
                              placeholder={t("membership.shareIssue.placeholders.availableBalance")}
                              readOnly
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col flex-1 min-h-0 border border-primary rounded-lg p-5 py-2 gap-2">
                    <h2 className="text-lg text-center font-semibold">
                      {t("membership.shareIssue.sections.transactionDetails")}
                    </h2>
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                      <div className=" w-full flex flex-col gap-2">
                        {getMemberDataLoading ? (
                          <div className="w-full flex flex-col gap-y-3 ">
                            {Array.from({ length: 3 }).map((_, index) => (
                              <div
                                key={index}
                                className="w-full flex flex-col gap-[10px]"
                              >
                                <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                                <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="w-full flex flex-col gap-y-3 ">
                              <InputField
                                control={form.control}
                                name="noOfShare"
                                label={t("membership.shareIssue.fields.noOfShare")}
                                placeholder={t("membership.shareIssue.placeholders.noOfShare")}
                                type="number"
                                autoFocus
                                formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                formMessageClassName="col-span-2"
                              />

                              <InputField
                                control={form.control}
                                name="ratePerShare"
                                label={t("membership.shareIssue.fields.rateOfShare")}
                                placeholder={t("membership.shareIssue.placeholders.rateOfShare")}
                                type="number"
                                readOnly
                                formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                formMessageClassName="col-span-2"
                              />

                              <InputField
                                control={form.control}
                                name="totalAmt"
                                label={t("membership.shareIssue.fields.total")}
                                placeholder={t("membership.shareIssue.placeholders.total")}
                                type="number"
                                readOnly
                                formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                formMessageClassName="col-span-2"
                              />

                              <TextareaField
                                control={form.control}
                                name="totalAmtInWords"
                                placeholder={t("membership.shareIssue.placeholders.totalAmountInWords")}
                                className="text-red-500 text-base resize-none"
                                readOnly
                              />
                            </div>
                            <div className="w-full flex flex-col gap-y-3 ">
                              <FormField
                                control={form.control}
                                name="voucherMode"
                                render={({ field }) => (
                                  <FormItem className="flex  border border-input rounded-md pl-3 py-3 w-full">
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-2 w-full"
                                      >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="cash" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {t("membership.shareIssue.fields.cash")}
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="bank" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {t("membership.shareIssue.fields.bank")}
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="savings" />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {t("membership.shareIssue.fields.savings")}
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <InputField
                                control={form.control}
                                name="refVouchNo"
                                placeholder={t("membership.shareIssue.placeholders.refVouchNo")}
                              />
                              {voucherMode === "cash" ? (
                                isActiveDenom ? (
                                  <DoubleCashDenomTable
                                    notes={notes}
                                    inDenominators={inDenominators}
                                    outDenominators={outDenominators}
                                    totalInAmount={cashInTransactionTotal}
                                    totalOutAmount={cashOutTransactionTotal}
                                    cashInTransactionGrandTotal={
                                      cashInTransactionGrandTotal
                                    }
                                    cashOutTransactionGrandTotal={
                                      cashOutTransactionGrandTotal
                                    }
                                    handleInDenominatorChange={
                                      handleInDenominatorChange
                                    }
                                    handleOutDenominatorChange={
                                      handleOutDenominatorChange
                                    }
                                  />
                                ) : null
                              ) : voucherMode === "bank" ? (
                                <DropdownField
                                  control={form.control}
                                  name="bank"
                                  label={t("membership.shareIssue.fields.bank")}
                                  options={bankAccountData}
                                  optionLabelKey="Bank_Name"
                                  placeholder={t("membership.shareIssue.placeholders.bank")}
                                  searchPlaceholder={t("membership.shareIssue.placeholders.searchBank")}
                                />
                              ) : (
                                <>
                                  <DropdownField
                                    control={form.control}
                                    name="savings"
                                    label={t("membership.shareIssue.fields.savings")}
                                    options={savingsAccountData}
                                    optionLabelKey="Account_No"
                                    placeholder={t("membership.shareIssue.placeholders.savings")}
                                    searchPlaceholder={t("membership.shareIssue.placeholders.searchSavings")}
                                  />
                                  <InputField
                                    control={form.control}
                                    name="savingsName"
                                    label={t("membership.shareIssue.fields.accountHolderName")}
                                    placeholder={t("membership.shareIssue.placeholders.accountHolderName")}
                                    readOnly
                                  />
                                  <InputField
                                    control={form.control}
                                    name="savingsBalance"
                                    label={t("membership.shareIssue.fields.availableBalance")}
                                    placeholder={t("membership.shareIssue.placeholders.balance")}
                                    readOnly
                                  />
                                </>
                              )}
                            </div>
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={
                                postShareIssueLoading ||
                                insufficientBalanceDisable ||
                                !Number(totalAmt) ||
                                (voucherMode === "cash" &&
                                  isActiveDenom &&
                                  Number(cashInTransactionGrandTotal) -
                                    Number(cashOutTransactionGrandTotal) !==
                                    Number(totalAmt)) ||
                                (voucherMode === "bank" &&
                                  !bank) ||
                                (voucherMode === "savings" &&
                                  !savings)
                              }
                            >
                              {postShareIssueLoading ? (
                                <ClipLoader
                                  color="#d7e6f4"
                                  size={20}
                                  speedMultiplier={0.7}
                                />
                              ) : (
                                t("common.buttons.save")
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </Form>
      </div>
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
        showNextButton={true}
        handleNextButton={handleGenerateShareIssueReceipt}
        nextLabel={t("membership.shareIssue.printReceipt")}
      />

      <ShareLedger
        showLedger={showLedgerDialog}
        setShowLedger={setShowLedgerDialog}
        fromDate={fromDate}
        toDate={form.getValues("date")}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalRefund={totalRefund}
        totalIssue={totalIssue}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
        loading={getLedgerLoading}
      />

      {!showSuccessMessage && (
        <ShareIssueReceipt
          isOpen={isReceiptOpen}
          setIsOpen={setIsReceiptOpen}
          shareIssueReceiptData={shareIssueReceiptData}
        />
      )}
    </div>
  );
};
export default ShareIssue;
