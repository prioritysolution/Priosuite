"use client";


import { useTranslation } from "react-i18next";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getYear } from "date-fns";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import ShareIssueReceipt from "./ShareIssueReceipt";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { get } from "http";

const IssueMembership = ({
  loading,
  getMemberDataLoading,
  postIssueMembershipLoading,
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
  admissionDisable,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  transMode,
  insufficientBalanceDisable,
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

  const beg_date = getCookieData("beg_date");

  const memberTypeData = useSelector(
    (state) => state?.shareProduct?.memberTypeData,
  );

  const relationTypeData = useSelector(
    (state) => state?.memberProfile?.relationTypeData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const branchId = getCookieData("userBranchId");

  // Set Admission Date to beg_date when component loads
  useEffect(() => {
    if (beg_date) {
      form.setValue("date", new Date(beg_date));
    }
  }, [beg_date, form]);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <div className="w-full mb-2">
          <MemberSearchForm
            handleSubmit={handleMemberFormSubmit}
            loading={getMemberDataLoading}
            resetTrigger={resetTrigger}
            formLabel={t("membership.issueMembership.title")}
            showDateFix={true}
          />
        </div>
        <ScrollArea className="w-full h-full px-2 sm:px-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-2 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("membership.issueMembership.sections.basicInfoBlock")}
                  </h3>
                  {getMemberDataLoading ? (
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
                    <div className="w-full grid md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="memberNo"
                        label={t("membership.issueMembership.fields.memberNo")}
                        placeholder={t("membership.issueMembership.placeholders.memberNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="cifNo"
                        label={t("membership.issueMembership.fields.cifNo")}
                        placeholder={t("membership.issueMembership.placeholders.cifNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="memberName"
                        label={t("membership.issueMembership.fields.memberName")}
                        placeholder={t("membership.issueMembership.placeholders.memberName")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label={t("membership.issueMembership.fields.gurdianName")}
                        placeholder={t("membership.issueMembership.placeholders.gurdianName")}
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("membership.issueMembership.fields.address")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("membership.issueMembership.placeholders.address")}
                                {...field}
                                className="resize-none"
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <InputField
                        control={form.control}
                        name="mobile"
                        label={t("membership.issueMembership.fields.mobileNo")}
                        placeholder={t("membership.issueMembership.placeholders.mobileNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="branchName"
                        label={t("membership.issueMembership.fields.branchName")}
                        placeholder={t("membership.issueMembership.placeholders.branchName")}
                        readOnly
                        className={`${branchId === form.getValues("BranchId") ? "" : "text-red-700"}`}
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("membership.issueMembership.sections.admissionBlock")}
                  </h3>
                  {getMemberDataLoading ? (
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                      {Array.from({ length: 8 }).map((_, index) => (
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
                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 items-start">
                      <DropdownField
                        control={form.control}
                        name="memberType"
                        label={t("membership.issueMembership.fields.memberType")}
                        options={memberTypeData}
                        optionLabelKey="Option_Value"
                        placeholder={t("membership.issueMembership.placeholders.memberType")}
                        searchPlaceholder={t("membership.issueMembership.placeholders.searchMemberType")}
                        isRequired={true}
                      />

                      {/* Admission Date */}
                      <DatePickerField
                        control={form.control}
                        name="date"
                        label={t("membership.issueMembership.fields.admissionDate")}
                        startYear={getYear(new Date(startDate))}
                        disabledDateAfter={
                          new Date(endDate) > new Date()
                            ? new Date()
                            : new Date(endDate)
                        }
                        endYear={getYear(new Date(endDate))}
                        disabled={admissionDisable}
                        onPopover={true}
                        isRequired={true}
                      />

                      <InputField
                        control={form.control}
                        name="admissionNo"
                        label={t("membership.issueMembership.fields.admissionNo")}
                        placeholder={t("membership.issueMembership.placeholders.admissionNo")}
                        type="number"
                        onInput={(e) => {
                          if (e.target.value.length > 5) {
                            e.target.value = e.target.value.slice(0, 5);
                          }
                        }}
                        readOnly={admissionDisable}
                      />

                      <InputField
                        control={form.control}
                        name="ledgerFolio"
                        label={t("membership.issueMembership.fields.ledgerFolio")}
                        placeholder={t("membership.issueMembership.placeholders.ledgerFolio")}
                        readOnly={admissionDisable}
                      />

                      <InputField
                        control={form.control}
                        name="admissionFees"
                        label={t("membership.issueMembership.fields.admissionFees")}
                        placeholder={t("membership.issueMembership.placeholders.admissionNo")}
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="noOfShare"
                        label={t("membership.issueMembership.fields.numberOfShare")}
                        placeholder={t("membership.issueMembership.placeholders.numberOfShare")}
                        type="number"
                        readOnly={admissionDisable}
                        isRequired={true}
                      />

                      <InputField
                        control={form.control}
                        name="ratePerShare"
                        label={t("membership.issueMembership.fields.ratePerShare")}
                        placeholder={t("membership.issueMembership.placeholders.ratePerShare")}
                        type="number"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="totalAmt"
                        label={t("membership.issueMembership.fields.totalAmount")}
                        placeholder={t("membership.issueMembership.placeholders.totalAmount")}
                        type="number"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="totalAmtInWords"
                        label={t("membership.issueMembership.fields.totalAmountInWords")}
                        placeholder={t("membership.issueMembership.placeholders.totalAmountInWords")}
                        className="text-red-500 text-base"
                        readOnly
                        formItemClassName="lg:col-span-2 xl:col-span-2"
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("membership.issueMembership.sections.nomineeBlock")}
                  </h3>
                  {getMemberDataLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      {Array.from({ length: 4 }).map((_, index) => (
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
                        label={t("membership.issueMembership.fields.nomineeName")}
                        placeholder={t("membership.issueMembership.placeholders.nomineeName")}
                      />

                      <DropdownField
                        control={form.control}
                        name="nomineeRelation"
                        label={t("membership.issueMembership.fields.nomineeRelation")}
                        options={relationTypeData}
                        optionLabelKey="Option_Value"
                        placeholder={t("membership.issueMembership.placeholders.nomineeRelation")}
                        searchPlaceholder={t("membership.issueMembership.placeholders.searchNomineeRelation")}
                      />

                      <InputField
                        control={form.control}
                        name="nomineeAddress"
                        label={t("membership.issueMembership.fields.nomineeAddress")}
                        placeholder={t("membership.issueMembership.placeholders.nomineeAddress")}
                      />

                      <InputField
                        control={form.control}
                        name="nomineeAge"
                        label={t("membership.issueMembership.fields.nomineeAge")}
                        placeholder={t("membership.issueMembership.placeholders.nomineeAge")}
                        type="number"
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("membership.issueMembership.sections.transanctionBlock")}
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
                    //
                    <div className="w-full rounded-md mb-2 flex flex-col gap-3">
                      <FormField
                        control={form.control}
                        name="transMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full lg:w-fit">
                            <FormLabel>
                              {t("membership.issueMembership.fields.selectTransanctionMode")}
                              <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
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
                      <div className="w-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                        <InputField
                          control={form.control}
                          name="refVouchNo"
                          label={t("membership.issueMembership.fields.refVouchNo")}
                          placeholder={t("membership.issueMembership.placeholders.refVouchNo")}
                          formItemClassName="col-span-1"
                        />
                        {transMode === "cash" ? (
                          isActiveDenom ? (
                            <div className="lg:w-1/2 w-full flex flex-col lg:flex-row gap-10 col-span-2">
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
                            </div>
                          ) : null
                        ) : transMode === "bank" ? (
                          <DropdownField
                            control={form.control}
                            name="bank"
                            label={t("membership.issueMembership.fields.bank")}
                            options={bankAccountData}
                            optionLabelKey="Bank_Name"
                            placeholder={t("membership.issueMembership.placeholders.bank")}
                            searchPlaceholder={t("membership.issueMembership.placeholders.searchBank")}
                          />
                        ) : (
                          <>
                            <DropdownField
                              control={form.control}
                              name="savings"
                              label={t("membership.issueMembership.fields.savings")}
                              options={savingsAccountData}
                              optionLabelKey="Account_No"
                              placeholder={t("membership.issueMembership.placeholders.savings")}
                              searchPlaceholder={t("membership.issueMembership.placeholders.searchSavings")}
                            />
                            <InputField
                              control={form.control}
                              name="savingsName"
                              label={t("membership.issueMembership.fields.accountHolderName")}
                              placeholder={t("membership.issueMembership.placeholders.accountHolderName")}
                              readOnly
                            />
                            <InputField
                              control={form.control}
                              name="savingsBalance"
                              label={t("membership.issueMembership.fields.availableBalance")}
                              placeholder={t("membership.issueMembership.placeholders.availableBalance")}
                              readOnly
                            />
                          </>
                        )}
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
                    postIssueMembershipLoading ||
                    insufficientBalanceDisable ||
                    admissionDisable ||
                    !Number(form.getValues("totalAmt")) ||
                    (transMode === "cash" &&
                      isActiveDenom &&
                      Number(cashInTransactionGrandTotal) -
                        Number(cashOutTransactionGrandTotal) !==
                        Number(form.getValues("totalAmt"))) ||
                    (transMode === "bank" && !form.getValues("bank")) ||
                    (transMode === "savings" && !form.getValues("savings"))
                  }
                >
                  {postIssueMembershipLoading ? (
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
        showNextButton={true}
        handleNextButton={handleGenerateShareIssueReceipt}
        nextLabel={t("membership.issueMembership.printReceipt")}
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
export default IssueMembership;
