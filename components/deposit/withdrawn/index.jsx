"use client";


import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
            formLabel={t("deposit.withdrawn.title")}
            showDateFix={true}
            operateProductData={operateProductData}
            showProduct={true}
            getLedgerLoading={getLedgerLoading}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={
              visibleBlock
                ? "w-full flex-1 min-h-0 overflow-y-auto"
                : "w-full overflow-hidden"
            }
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
                                label={t("deposit.fields.memberNo")}
                                placeholder={t("deposit.placeholders.memberNo")}
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
                                name="cifNo"
                                label={t("deposit.fields.cifNo")}
                                placeholder={t("deposit.placeholders.cifNo")}
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
                                name="lastWithdrawnDate"
                                label={t("deposit.fields.lastWithdrawnDate")}
                                placeholder={t("deposit.placeholders.lastWithdrawnDate")}
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="lastWithdrawnAmount"
                                label={t("deposit.fields.lastWithdrawnAmount")}
                                placeholder={t("deposit.placeholders.lastWithdrawnAmount")}
                                readOnly
                              />

                              <InputField
                                control={form.control}
                                name="availableBalance"
                                label={t("deposit.fields.availableBalance")}
                                placeholder={t("deposit.placeholders.availableBalance")}
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
                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                              <div className="flex flex-col h-full items-center gap-2 text-center font-semibold">
                                <h2 className=" font-semibold">{t("deposit.withdrawn.profile")}</h2>
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
                                <h2 className=" font-semibold">{t("deposit.common.signature")}</h2>
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
                      {t("deposit.withdrawn.withdrawnDetails")}
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
                                label={t("deposit.fields.amount")}
                                placeholder={t("deposit.placeholders.amount")}
                                type="number"
                                autoFocus
                                containerClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                              />

                              {form.getValues("chequeFacility") === "Yes" && (
                                <InputField
                                  control={form.control}
                                  name="instrumentNo"
                                  label={t("deposit.fields.instrumentNo")}
                                  placeholder={t("deposit.placeholders.instrumentNo")}
                                  type="number"
                                  containerClassName="grid grid-cols-[3fr_7fr] items-center gap-2"
                                />
                              )}

                              <TextareaField
                                control={form.control}
                                name="totalWithdrawnInWords"
                                placeholder={t("deposit.placeholders.totalAmount")}
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
                              ) : (
                                <DropdownField
                                  control={form.control}
                                  name="bank"
                                  label={t("deposit.fields.bank")}
                                  options={bankAccountData}
                                  optionLabelKey="Bank_Name"
                                  placeholder={t("deposit.placeholders.selectBank")}
                                  searchPlaceholder={t("deposit.placeholders.searchBank")}
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
