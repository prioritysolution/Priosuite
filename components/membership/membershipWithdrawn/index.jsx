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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IoPrint, IoEye, IoEyeOff } from "react-icons/io5";
import { useSelector } from "react-redux";
import ShareLedger from "@/common/ledger/shareLedger/ShareLedger";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import DropdownField from "@/common/formFields/DropdownField";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";

const MembershipWithdrawn = ({
  loading,
  getMemberDataLoading,
  postMembershipWithdrawnLoading,
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
  transMode,
  savings,
  bank,
  shareBalance,
  divBalance,
  handleShowLedger,
  showLedger,
  setShowLedger,
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
}) => {
  const { t } = useTranslation();

  const [isActiveDenom, setIsActiveDenom] = useState(false);
  const [showBasicInfo, setShowBasicInfo] = useState(true);
  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  console.log("showLedger=", showLedger);

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const branchId = getCookieData("userBranchId");

  return (
    <div className="w-full h-full flex justify-between p-1  bg-[#fefefe] rounded-lg">
      <div className="w-full h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 px-2 sm:px-10  gap-2 min-h-0 overflow-hidden">
        <div className="w-full mb-5">
          <MemberSearchForm
            handleSubmit={handleMemberFormSubmit}
            loading={getMemberDataLoading}
            showDate
            label={t("membership.withdrawn.fields.transactionDate")}
            resetTrigger={resetTrigger}
            showLedger={showLedger}
            handleShowLedger={handleShowLedger}
            formLabel={t("membership.withdrawn.title")}
            showDateFix={true}
          />
        </div>
        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) =>
                console.log("Membership Withdrawn validation errors:", errors),
              )}
              className="w-full h-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <div className="grid grid-cols-3">
                    <div />
                    <h3 className="w-full text-center text-xl font-semibold">
                      {t("membership.withdrawn.sections.basicInfoBlock")}
                    </h3>
                    <div className=" w-full flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setShowBasicInfo(!showBasicInfo)}
                        className="text-primary hover:opacity-80 transition-opacity text-2xl"
                      >
                        {showBasicInfo ? <IoEye /> : <IoEyeOff />}
                      </button>
                    </div>
                  </div>
                  {showBasicInfo && (
                    getMemberDataLoading ? (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
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
                          label={t("membership.withdrawn.fields.memberNo")}
                          placeholder={t("membership.withdrawn.placeholders.memberNo")}
                          readOnly
                        />
                        <InputField
                          control={form.control}
                          name="cifNo"
                          label={t("membership.withdrawn.fields.cifNo")}
                          placeholder={t("membership.withdrawn.placeholders.cifNo")}
                          readOnly
                        />
                        <InputField
                          control={form.control}
                          name="memberName"
                          label={t("membership.withdrawn.fields.memberName")}
                          placeholder={t("membership.withdrawn.placeholders.memberName")}
                          readOnly
                        />
                        <InputField
                          control={form.control}
                          name="gurdianName"
                          label={t("membership.withdrawn.fields.gurdianName")}
                          placeholder={t("membership.withdrawn.placeholders.gurdianName")}
                          readOnly
                        />
                        <TextareaField
                          control={form.control}
                          name="address"
                          label={t("membership.withdrawn.fields.address")}
                          placeholder={t("membership.withdrawn.placeholders.address")}
                          className="resize-none"
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="mobile"
                          label={t("membership.withdrawn.fields.mobileNo")}
                          placeholder={t("membership.withdrawn.placeholders.mobileNo")}
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="branchName"
                          label={t("membership.withdrawn.fields.branchName")}
                          placeholder={t("membership.withdrawn.placeholders.branchName")}
                          readOnly
                          className={`${branchId === form.getValues("BranchId") ? "" : "text-red-700"}`}
                        />
                      </div>
                    )
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("membership.withdrawn.sections.nomineeBlock")}
                  </h3>
                  {getMemberDataLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
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
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="nomineeName"
                        label={t("membership.withdrawn.fields.nomineeName")}
                        placeholder={t("membership.withdrawn.placeholders.nomineeName")}
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="nomineeRelation"
                        label={t("membership.withdrawn.fields.nomineeRelation")}
                        placeholder={t("membership.withdrawn.placeholders.nomineeRelation")}
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="nomineeAge"
                        label={t("membership.withdrawn.fields.nomineeAge")}
                        placeholder={t("membership.withdrawn.placeholders.nomineeAge")}
                        type="number"
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("membership.withdrawn.sections.withdrawDetailsBlock")}
                  </h3>
                  {getMemberDataLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-col gap-[10px]"
                        >
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      ))}
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-20 w-full rounded-md bg-secondary" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                      <InputField
                        control={form.control}
                        name="ledgerFolio"
                        label={t("membership.withdrawn.fields.ledgerFolio")}
                        placeholder={t("membership.withdrawn.placeholders.ledgerFolio")}
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="shareBalance"
                        label={t("membership.withdrawn.fields.shareBalance")}
                        placeholder={t("membership.withdrawn.placeholders.shareBalance")}
                        type="number"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="divBalance"
                        label={t("membership.withdrawn.fields.dividendBalance")}
                        placeholder={t("membership.withdrawn.placeholders.dividendBalance")}
                        type="number"
                        readOnly
                      />

                      <TextareaField
                        control={form.control}
                        name="reason"
                        label={t("membership.withdrawn.fields.withdrawReason")}
                        placeholder={t("membership.withdrawn.placeholders.withdrawReason")}
                        type="number"
                        className="resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 sm:p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("membership.withdrawn.sections.transanctionBlock")}
                  </h3>
                  {getMemberDataLoading ? (
                    <div className="w-full border border-primary rounded-md p-2 sm:p-5 mb-5 flex flex-col gap-3">
                      <Skeleton className=" h-10 w-full lg:w-[500px] bg-secondary " />
                      <div className="w-48 flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full border border-primary rounded-md p-2 sm:p-5 mb-5 flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="transMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full lg:w-fit">
                            <FormLabel>{t("membership.withdrawn.fields.selectTransanctionMode")}</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
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
                      <InputField
                        control={form.control}
                        name="refVouchNo"
                        label={t("membership.withdrawn.fields.refVouchNo")}
                        placeholder={t("membership.withdrawn.placeholders.refVouchNo")}
                        formItemClassName="w-fit"
                      />
                    </div>
                  )}
                  {transMode === "cash" ? (
                    isActiveDenom ? (
                      <div className="w-1/2 flex flex-col lg:flex-row gap-10">
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
                          handleInDenominatorChange={handleOutDenominatorChange}
                          handleOutDenominatorChange={handleInDenominatorChange}
                          primaryInput="out"
                        />
                      </div>
                    ) : null
                  ) : transMode === "bank" ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2">
                      <DropdownField
                        control={form.control}
                        name="bank"
                        label={t("membership.withdrawn.fields.bank")}
                        options={bankAccountData}
                        optionLabelKey="Bank_Name"
                        placeholder={t("membership.withdrawn.placeholders.bank")}
                        searchPlaceholder={t("membership.withdrawn.placeholders.searchBank")}
                      />
                    </div>
                  ) : (
                    <div className="w-full grid lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                      <DropdownField
                        control={form.control}
                        name="savings"
                        label={t("membership.withdrawn.fields.savings")}
                        options={savingsAccountData}
                        optionLabelKey="Account_No"
                        placeholder={t("membership.withdrawn.placeholders.savings")}
                        searchPlaceholder={t("membership.withdrawn.placeholders.searchSavings")}
                      />
                      <InputField
                        control={form.control}
                        name="savingsName"
                        label={t("membership.withdrawn.fields.accountHolderName")}
                        placeholder={t("membership.withdrawn.placeholders.accountHolderName")}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={
                    postMembershipWithdrawnLoading ||
                    (transMode === "cash" &&
                      isActiveDenom &&
                      Number(cashOutTransactionGrandTotal) -
                        Number(cashInTransactionGrandTotal) !==
                        Number(shareBalance || 0) + Number(divBalance || 0)) ||
                    (transMode === "bank" && !bank) ||
                    (transMode === "savings" && !savings)
                  }
                >
                  {postMembershipWithdrawnLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("common.buttons.add")
                  )}
                </Button>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
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
    </div>
  );
};
export default MembershipWithdrawn;
