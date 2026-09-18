"use client";


import { useTranslation } from "react-i18next";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import AccountSearchForm from "@/common/forms/AccountSearchForm";
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
import TextareaField from "@/common/formFields/TextareaField";
import InputField from "@/common/formFields/InputField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import DepositReceipt from "./DepositReceipt";
import { Textarea } from "@/components/ui/textarea";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";

const Deposit = ({
  loading,
  getDepositLoading,
  postDepositLoading,
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
  transMode,
  insufficientBalanceDisable,
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
  resetTrigger,
  isReceiptOpen,
  setIsReceiptOpen,
  depositReceiptData,
  handleGenerateDepositReceipt,
  depositProduct,
  getLedgerLoading,
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

  const operateProductData = useSelector(
    (state) => state?.deposit?.operateProductData,
  );

  const branchId = getCookieData("userBranchId");

  console.log("productId=", form.watch("productId"));

  return (
    <div className="w-full h-full flex justify-between p-1  bg-[#fefefe] rounded-lg">
      <div className="w-full h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 px-2 sm:px-10  gap-2 min-h-0 overflow-hidden">
        <div className="w-full">
          <AccountSearchForm
            loading={getDepositLoading}
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
            toDate={form.getValues("depositDate")}
            resetTrigger={resetTrigger}
            allowAlphanumeric
            formLabel={t("deposit.depositTxn.title")}
            showDateFix={true}
            operateProductData={operateProductData}
            showProduct={true}
            getLedgerLoading={getLedgerLoading}
          />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex-1 min-h-0 overflow-y-scroll"
            autoComplete="off"
          >
            <div className="grid lg:grid-cols-[7fr_3fr] gap-2 lg:h-full lg:min-h-0">
              {visibleBlock && (
                <>
                  <div className="w-full flex flex-col flex-1 min-h-0 border border-primary rounded-lg p-5 py-2 gap-2">
                    <h2 className="text-lg text-center font-semibold">
                      {t("deposit.sections.accountDetails")}
                    </h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <div className=" w-full flex flex-col gap-2">
                        {getDepositLoading ? (
                          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
                            {Array.from({ length: 13 }).map((_, index) => (
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
                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
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
                                name="accountNo"
                                label={t("deposit.fields.accountNo")}
                                placeholder={t("deposit.placeholders.accountNo")}
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

                              {form.getValues("lastDepositDate") && (
                                <InputField
                                  control={form.control}
                                  name="lastDepositDate"
                                  label={
                                    depositProduct?.Prod_Type === 3
                                      ? "Paid Upto"
                                      : t("deposit.fieldsExtra.lastDepositDate")
                                  }
                                  placeholder={t("deposit.placeholders.lastDepositAmount")}
                                  readOnly
                                />
                              )}

                              {form.getValues("lastDepositAmount") && (
                                <InputField
                                  control={form.control}
                                  name="lastDepositAmount"
                                  label={t("deposit.fields.lastDepositAmount")}
                                  placeholder={t("deposit.placeholders.lastDepositAmount")}
                                  readOnly
                                />
                              )}

                              {form.getValues("installmentAmount") &&
                                Number(form.getValues("installmentAmount")) >
                                  0 && (
                                  <InputField
                                    control={form.control}
                                    name="installmentAmount"
                                    label={t("deposit.fields.installmentAmount")}
                                    placeholder={t("deposit.placeholders.installmentAmount")}
                                    readOnly
                                  />
                                )}

                              {form.getValues("maturityDate") && (
                                <InputField
                                  control={form.control}
                                  name="maturityDate"
                                  label={t("deposit.fields.maturityDate")}
                                  placeholder={t("deposit.placeholders.maturityDate")}
                                  readOnly
                                />
                              )}

                              {form.getValues("maturityAmount") && (
                                <InputField
                                  control={form.control}
                                  name="maturityAmount"
                                  label={t("deposit.fields.maturityAmount")}
                                  placeholder={t("deposit.placeholders.maturityAmount")}
                                  readOnly
                                />
                              )}

                              <InputField
                                control={form.control}
                                name="availableBalance"
                                label={t("deposit.fields.availableBalance")}
                                placeholder={t("deposit.placeholders.availableBalance")}
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="operationMode"
                                label={t("deposit.fields.operationMode")}
                                placeholder={t("deposit.placeholders.operationMode")}
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="chequeFacility"
                                label={t("deposit.fields.chequeFacility")}
                                placeholder={t("deposit.placeholders.chequeFacility")}
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="rateOfInterest"
                                label={t("deposit.fields.rateOfInterest")}
                                placeholder={t("deposit.placeholders.rateOfInterest")}
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="branchName"
                                label={t("deposit.fields.branchName")}
                                placeholder={t("deposit.placeholders.branchName")}
                                readOnly
                                className={`${branchId === form.getValues("BranchId") ? "" : "text-red-700"}`}
                              />
                            </div>
                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
                              {form.getValues("joint1") && (
                                <InputField
                                  control={form.control}
                                  name="joint1"
                                  label={t("deposit.fields.joint1")}
                                  placeholder={t("deposit.placeholders.joint1")}
                                  readOnly
                                />
                              )}
                              {form.getValues("joint2") && (
                                <InputField
                                  control={form.control}
                                  name="joint2"
                                  label={t("deposit.fields.joint2")}
                                  placeholder={t("deposit.placeholders.joint2")}
                                  readOnly
                                />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col flex-1 min-h-0 border border-primary rounded-lg p-5 py-2 gap-2">
                    <h2 className="text-lg text-center font-semibold">
                      {t("deposit.sections.transactionDetails")}
                    </h2>
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                      <div className=" w-full flex flex-col gap-2">
                        {getDepositLoading ? (
                          <div className="w-full  ">
                            {Array.from({ length: 13 }).map((_, index) => (
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
                            <div className="w-full space-y-3 ">
                              <InputField
                                control={form.control}
                                name="depositAmount"
                                label={t("deposit.fields.amount")}
                                placeholder={t("deposit.placeholders.depositAmount")}
                                type="number"
                                autoFocus
                                className="col-span-2"
                                containerClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                isRequired
                              />

                              {depositProduct?.Prod_Type === 3 && (
                                <DatePickerField
                                  control={form.control}
                                  name="paidUpto"
                                  label={t("deposit.fields.paidUpto")}
                                  horizonLabel={true}
                                />
                              )}

                              {form.getValues("fineAmount") && (
                                <InputField
                                  control={form.control}
                                  name="fineAmount"
                                  label={t("deposit.fields.fine")}
                                  placeholder={t("deposit.placeholders.findAmount")}
                                  type="number"
                                  readOnly
                                  className="col-span-2"
                                  containerClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                />
                              )}

                              {form.getValues("fineAmount") && (
                                <InputField
                                  control={form.control}
                                  name="totalAmount"
                                  label={t("deposit.fields.total")}
                                  placeholder={t("deposit.placeholders.totalAmount")}
                                  type="number"
                                  readOnly
                                  className="col-span-2"
                                  containerClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                />
                              )}

                              <TextareaField
                                control={form.control}
                                name="totalAmountInWords"
                                placeholder={t("deposit.placeholders.totalAmount")}
                                className="text-red-500 text-base resize-none"
                                readOnly
                                containerClassName="col-span-2"
                              />
                            </div>

                            {/* transMode section */}
                            <div className="w-full flex flex-col gap-2">
                              <FormField
                                control={form.control}
                                name="transMode"
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
                                placeholder={t("deposit.placeholders.refVoucherNo")}
                              />
                              {transMode === "cash" ? (
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
                              ) : transMode === "bank" ? (
                                <DropdownField
                                  control={form.control}
                                  name="bank"
                                  label={t("deposit.fields.bank")}
                                  options={bankAccountData}
                                  optionLabelKey="Bank_Name"
                                  placeholder={t("deposit.placeholders.selectBank")}
                                  searchPlaceholder={t("deposit.placeholders.searchBank")}
                                />
                              ) : (
                                <>
                                  <DropdownField
                                    control={form.control}
                                    name="savings"
                                    label={t("deposit.fields.savings")}
                                    options={savingsAccountData}
                                    optionLabelKey="Account_No"
                                    placeholder={t("deposit.placeholders.selectSavings")}
                                    searchPlaceholder={t("deposit.placeholders.searchSavings")}
                                  />
                                  <InputField
                                    control={form.control}
                                    name="savingsName"
                                    label={t("deposit.fields.accountHolderName")}
                                    placeholder={t("deposit.placeholders.memberName")}
                                    readOnly
                                  />
                                  <InputField
                                    control={form.control}
                                    name="savingsBalance"
                                    label={t("deposit.fields.availableBalance")}
                                    placeholder={t("deposit.placeholders.availableBalance")}
                                    readOnly
                                  />
                                </>
                              )}
                            </div>
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={
                                postDepositLoading ||
                                !Number(form.getValues("depositAmount")) ||
                                (transMode === "cash" &&
                                  isActiveDenom &&
                                  Number(cashInTransactionGrandTotal) -
                                    Number(cashOutTransactionGrandTotal) !==
                                    Number(form.getValues("depositAmount"))) ||
                                (transMode === "bank" &&
                                  !form.getValues("bank")) ||
                                (transMode === "savings" &&
                                  !form.getValues("savings"))
                              }
                            >
                              {postDepositLoading ? (
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
        handleNextButton={handleGenerateDepositReceipt}
        nextLabel="Print Receipt"
      />

      {!showSuccessMessage && (
        <DepositReceipt
          isOpen={isReceiptOpen}
          setIsOpen={setIsReceiptOpen}
          depositReceiptData={depositReceiptData}
        />
      )}
    </div>
  );
};
export default Deposit;
