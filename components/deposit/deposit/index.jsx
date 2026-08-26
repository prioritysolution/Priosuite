"use client";

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
            formLabel="Deposit"
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
                      Account Details
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
                                label="Member No."
                                placeholder="Enter member no."
                                readOnly
                              />
                              <InputField
                                control={form.control}
                                name="cifNo"
                                label="CIF No."
                                placeholder="Enter cif no."
                                readOnly
                              />
                              <InputField
                                control={form.control}
                                name="accountNo"
                                label="Account No."
                                placeholder="Enter account no."
                                readOnly
                              />
                              <InputField
                                control={form.control}
                                name="refAcNo"
                                label="Manual / REF. Account No."
                                placeholder="Enter manual / ref. account no."
                                readOnly
                              />
                              <InputField
                                control={form.control}
                                name="memberName"
                                label="Member Name"
                                placeholder="Enter member name"
                                readOnly
                              />
                              <InputField
                                control={form.control}
                                name="gurdianName"
                                label="Gurdian Name"
                                placeholder="Enter gurdian name"
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="mobile"
                                label="Mobile No."
                                placeholder="Enter mobile no."
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="panNo"
                                label="Pan No."
                                placeholder="Enter pan no."
                                readOnly
                              />

                              {form.getValues("lastDepositDate") && (
                                <InputField
                                  control={form.control}
                                  name="lastDepositDate"
                                  label={
                                    depositProduct?.Prod_Type === 3
                                      ? "Paid Upto"
                                      : "Last Deposit Date"
                                  }
                                  placeholder="Enter last deposit date"
                                  readOnly
                                />
                              )}

                              {form.getValues("lastDepositAmount") && (
                                <InputField
                                  control={form.control}
                                  name="lastDepositAmount"
                                  label="Last Deposit Amount"
                                  placeholder="Enter last deposit amount"
                                  readOnly
                                />
                              )}

                              {form.getValues("installmentAmount") &&
                                Number(form.getValues("installmentAmount")) >
                                  0 && (
                                  <InputField
                                    control={form.control}
                                    name="installmentAmount"
                                    label="Installment Amount"
                                    placeholder="Enter installment amount"
                                    readOnly
                                  />
                                )}

                              {form.getValues("maturityDate") && (
                                <InputField
                                  control={form.control}
                                  name="maturityDate"
                                  label="Maturity Date"
                                  placeholder="Enter maturity date"
                                  readOnly
                                />
                              )}

                              {form.getValues("maturityAmount") && (
                                <InputField
                                  control={form.control}
                                  name="maturityAmount"
                                  label="Maturity Amount"
                                  placeholder="Enter maturity Amount"
                                  readOnly
                                />
                              )}

                              <InputField
                                control={form.control}
                                name="availableBalance"
                                label="Available Balance"
                                placeholder="Enter available balance"
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="operationMode"
                                label="Operation Mode"
                                placeholder="Enter operation mode"
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="chequeFacility"
                                label="Cheque Facility"
                                placeholder="Enter cheque facility"
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
                                name="branchName"
                                label="Branch Name"
                                placeholder="Enter branch name"
                                readOnly
                                className={`${branchId === form.getValues("BranchId") ? "" : "text-red-700"}`}
                              />
                            </div>
                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
                              {form.getValues("joint1") && (
                                <InputField
                                  control={form.control}
                                  name="joint1"
                                  label="Joint 1"
                                  placeholder="Enter joint 1"
                                  readOnly
                                />
                              )}
                              {form.getValues("joint2") && (
                                <InputField
                                  control={form.control}
                                  name="joint2"
                                  label="Joint 2"
                                  placeholder="Enter joint 2"
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
                      Transaction Details
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
                                label="Amount"
                                placeholder="Enter deposit amount"
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
                                  label="Paid Upto"
                                  horizonLabel={true}
                                />
                              )}

                              {form.getValues("fineAmount") && (
                                <InputField
                                  control={form.control}
                                  name="fineAmount"
                                  label="Fine"
                                  placeholder="Enter fine amount"
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
                                  label="Total"
                                  placeholder="Enter total amount"
                                  type="number"
                                  readOnly
                                  className="col-span-2"
                                  containerClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                />
                              )}

                              <TextareaField
                                control={form.control}
                                name="totalAmountInWords"
                                placeholder="Total amount in words"
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
                                placeholder="Enter ref. vouch no."
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
                                  label="Bank"
                                  options={bankAccountData}
                                  optionLabelKey="Bank_Name"
                                  placeholder="Select bank"
                                  searchPlaceholder="Search bank..."
                                />
                              ) : (
                                <>
                                  <DropdownField
                                    control={form.control}
                                    name="savings"
                                    label="Savings"
                                    options={savingsAccountData}
                                    optionLabelKey="Account_No"
                                    placeholder="Select savings"
                                    searchPlaceholder="Search savings..."
                                  />
                                  <InputField
                                    control={form.control}
                                    name="savingsName"
                                    label="Account Holder Name"
                                    placeholder="Enter name"
                                    readOnly
                                  />
                                  <InputField
                                    control={form.control}
                                    name="savingsBalance"
                                    label="Available Balance"
                                    placeholder="Enter balance"
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
                                "Save"
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
