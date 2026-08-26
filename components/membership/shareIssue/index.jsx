"use client";
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
            label="Transaction Date"
            resetTrigger={resetTrigger}
            formLabel="Share Issue"
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
                      Account Details
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
                            <TextareaField
                              control={form.control}
                              name="address"
                              label="Address"
                              placeholder="Enter address"
                              className="resize-none"
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
                              name="branchName"
                              label="Branch Name"
                              placeholder="Enter branch name"
                              readOnly
                              className={`${branchId === form.getValues("BranchId") ? "" : "text-red-700"}`}
                            />

                            <InputField
                              control={form.control}
                              name="ledgerFolio"
                              label="Ledger Folio"
                              placeholder="Enter ledger folio"
                              readOnly
                            />

                            <InputField
                              control={form.control}
                              name="availableBal"
                              label="Available Balance"
                              placeholder="Enter available balance"
                              readOnly
                            />
                          </div>
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
                                label="No. of Share"
                                placeholder="Enter number of share"
                                type="number"
                                autoFocus
                                formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                formMessageClassName="col-span-2"
                              />

                              <InputField
                                control={form.control}
                                name="ratePerShare"
                                label="Rate of Share"
                                placeholder="Enter rate per share"
                                type="number"
                                readOnly
                                formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                formMessageClassName="col-span-2"
                              />

                              <InputField
                                control={form.control}
                                name="totalAmt"
                                label="Total"
                                placeholder="Enter total amount"
                                type="number"
                                readOnly
                                formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                formMessageClassName="col-span-2"
                              />

                              <TextareaField
                                control={form.control}
                                name="totalAmtInWords"
                                placeholder="Total amount in words"
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
        handleNextButton={handleGenerateShareIssueReceipt}
        nextLabel="Print Receipt"
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
