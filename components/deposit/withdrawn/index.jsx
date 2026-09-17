"use client";

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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import DropdownField from "@/common/formFields/DropdownField";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import TextareaField from "@/common/formFields/TextareaField";
import InputField from "@/common/formFields/InputField";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Withdrawn = ({
  loading,
  getWithdrawnLoading,
  getSpecimenLoading,
  postWithdrawnLoading,
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
  handleSeeSpecimen,
  photoLink,
  signatureLink,
  transMode,
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
  getLedgerLoading,
}) => {
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [activeImageURL, setActiveImageURL] = useState("");

  const branchId = getCookieData("userBranchId");

  const handleOpenImageDialog = (type, url) => {
    setOpenImageDialog(true);
    setActiveImage(type);
    setActiveImageURL(url);
  };

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const operateProductData = useSelector(
    (state) => state?.deposit?.operateProductData,
  );

  const [isActiveDenom, setIsActiveDenom] = useState(false);
  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  return (
    <div className="w-full h-full flex justify-between p-1  bg-[#fefefe] rounded-lg">
      <div className="w-full h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 px-2 sm:px-10  gap-2 min-h-0 overflow-hidden">
        <div className="w-full">
          <AccountSearchForm
            handleSubmit={handleAccountFormSubmit}
            showLedger={showLedger}
            loading={getWithdrawnLoading}
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
            toDate={form.getValues("withdrawnDate")}
            resetTrigger={resetTrigger}
            formLabel="Withdrawn"
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
                        {getWithdrawnLoading ? (
                          <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                            {Array.from({ length: 10 }).map((_, index) => (
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
                                name="lastWithdrawnDate"
                                label="Last Withdrawn date"
                                placeholder="Enter last withdrawn date"
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="lastWithdrawnAmount"
                                label="Last Withdrawn Amount"
                                placeholder="Enter last withdrawn amount"
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="availableBalance"
                                label="Available Balance"
                                placeholder="Enter available balance"
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
                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                              <div className="flex flex-col h-full items-center gap-2 text-center font-semibold">
                                <h2 className=" font-semibold">Profile</h2>
                                <div
                                  onClick={() =>
                                    handleOpenImageDialog("photo", photoLink)
                                  }
                                  className=" w-full aspect-square  border border-primary mx-auto relative flex items-center justify-center"
                                >
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
                              <div className="flex flex-col h-full items-center gap-2 text-center font-semibold">
                                <h2 className=" font-semibold">Signature</h2>
                                <div
                                  onClick={() =>
                                    handleOpenImageDialog(
                                      "signature",
                                      signatureLink,
                                    )
                                  }
                                  className="w-full aspect-[4/1]  border border-primary mx-auto relative flex items-center justify-center"
                                >
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
                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
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
                      Withdrawn Details
                    </h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <div className=" w-full flex flex-col gap-2">
                        {getWithdrawnLoading ? (
                          <div className="w-full flex flex-col gap-y-3 ">
                            {Array.from({ length: 2 }).map((_, index) => (
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
                                name="withdrawnAmount"
                                label="Amount"
                                placeholder="Enter withdrawn amount"
                                type="number"
                                autoFocus
                                containerClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                              />

                              {form.getValues("chequeFacility") === "Yes" && (
                                <InputField
                                  control={form.control}
                                  name="instrumentNo"
                                  label="Instrument No."
                                  placeholder="Enter instrument no."
                                  type="number"
                                  containerClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                />
                              )}

                              <TextareaField
                                control={form.control}
                                name="totalWithdrawnInWords"
                                placeholder="Total amount in words"
                                className="text-red-500 text-base resize-none"
                                readOnly
                              />
                            </div>
                            <div className="w-full  flex flex-col gap-2">
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
                              ) : (
                                <DropdownField
                                  control={form.control}
                                  name="bank"
                                  label="Bank"
                                  options={bankAccountData}
                                  optionLabelKey="Bank_Name"
                                  placeholder="Select bank"
                                  searchPlaceholder="Search bank..."
                                />
                              )}
                            </div>
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={
                                postWithdrawnLoading ||
                                !Number(form.getValues("withdrawnAmount")) ||
                                (transMode === "cash" &&
                                  isActiveDenom &&
                                  Number(cashInTransactionGrandTotal) -
                                    Number(cashOutTransactionGrandTotal) !==
                                    Number(
                                      form.getValues("withdrawnAmount"),
                                    )) ||
                                (transMode === "bank" &&
                                  !form.getValues("bank")) ||
                                (transMode === "savings" &&
                                  !form.getValues("savings"))
                              }
                            >
                              {postWithdrawnLoading ? (
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
      <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[825px]">
          <DialogHeader className={`w-full flex items-center justify-center`}>
            <DialogTitle className="capitalize">{activeImage}</DialogTitle>
          </DialogHeader>
          <div
            className={`w-full max-w-[400px] border relative mx-auto ${
              activeImage === "photo" ? "h-[400px]" : "h-[100px]"
            }`}
          >
            <Image fill alt={activeImage} src={activeImageURL || ""} />
          </div>
        </DialogContent>
      </Dialog>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default Withdrawn;
