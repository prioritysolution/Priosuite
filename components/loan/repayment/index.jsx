"use client";


import { useTranslation } from "react-i18next";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import LoanAccountSearchForm from "@/common/forms/LoanAccountSearchForm";
import LoanLedger from "@/common/ledger/loanLedger/LoanLedger";
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
import { Textarea } from "@/components/ui/textarea";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import CollectionReceipt from "./CollectionReceipt";
import { ClipLoader } from "react-spinners";
import AccountSearchTable from "@/common/tables/AccountSearchTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const Repayment = ({
  loading,
  postRepaymentLoading,
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
  transMode,
  insufficientBalanceDisable,
  showLedger,
  handleShowLedger,
  showLedgerDialog,
  setShowLedgerDialog,
  ledgerHeaderData,
  ledgerTableData,
  totalDisburse,
  totalPrincipalRefund,
  totalInterestRefund,
  userName,
  currentDate,
  currentTime,
  fromDate,
  toDate,
  resetTrigger,
  isOpen,
  setIsOpen,
  collectionReceiptData,
  handleGenerateCollectionReceipt,
  getLoanLedgerLoading,
  handleSearchAccountListByMemberNo,
  handleSearchAccountListByName,
  handleSelectClick,
  dialougeOpen,
  setDialougeOpen,
  handleFetchData,
  savingsAccountFullName,
  savingsAccountBalance,
  currentSavingsPage,
  setCurrentSavingsPage,
  lastSavingsPage,
  activeTab,
  setActiveTab,
  handleGetGuarantorSecurity,
  showGuarantorSecurityDialog,
  setShowGuarantorSecurityDialog,
  guarantorSecurityDetails,
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

  const accountListData = useSelector(
    (state) => state?.deposit?.searchAccountData,
  );

  return (
    <div className="w-full h-full flex justify-between  bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2  w-full gap-2 overflow-hidden">
        <div className="w-full">
          <LoanAccountSearchForm
            handleSubmit={handleAccountFormSubmit}
            resetTrigger={resetTrigger}
            showLedger={showLedger}
            handleShowLedger={handleShowLedger}
            formLabel={t("loan.loanRepayment")}
            showDateFix={true}
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
                    <h2 className="text-lg text-center font-semibold">{t("loan.accountDetails")}</h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <div className=" w-full flex flex-col gap-2">
                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
                          <FormField
                            control={form.control}
                            name="accountNo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.accountNo")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterAccountNo")}
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                {<FormMessage />}
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="memberName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.memberName")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterMemberName")}
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="gurdianName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.gurdianName")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterGurdianName")}
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.address")}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={t("loan.enterAddress")}
                                    {...field}
                                    className="resize-none"
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.mobileNo")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterMobileNo")}
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* <div
                            onClick={handleGetGuarantorSecurity}
                            className="bg-primary text-white w-full h-10 rounded-md flex items-center justify-center text-center lg: mt-8 text-sm cursor-pointer"
                          >
                            View Guarantor / Security Details
                          </div> */}
                        </div>
                        <div className="w-full grid grid-cols-1  lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-3 ">
                          <FormField
                            control={form.control}
                            name="accountType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.accountType")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterAccountType")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="disburseDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.disburseDate")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterDisburseDate")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="disburseAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.disburseAmount")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterDisburseAmount")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="roi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.rateOfInterest")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterRateOfInterest")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="finalRepayDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.finalRepayDate")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterFinalRepayDate")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="repayMode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.repayMode")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterRepayMode")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="installmentAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.installmentAmount")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterInstallmentAmount")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lastRepayDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.lastRepayDate")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterLastRepayDate")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastRepayPrincipal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.lastRepayPrincipal")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterLastRepayPrincipal")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="LastRepayInterest"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.lastRepayInterest")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterLastRepayInterest")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="currentBalance"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.outstandingBalance")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterOutstandingBalance")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="w-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-3 ">
                          <FormField
                            control={form.control}
                            name="currentDays"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.currentDays")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterCurrentDays")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="overdueDays"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.overdueDays")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterOverdueDays")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="currentAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.currentAmount")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterCurrentAmount")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="overdueAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.overdueAmount")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterOverdueAmount")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="currentInterest"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.currentInterest")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterCurrentInterest")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="overdueInterest"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.overdueInterest")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterOverdueInterest")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="prevDueInterest"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.previousDueInterest")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterPreviousDueInterest")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="totalInterest"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.totalInterest")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterTotalInterest")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="demandPrincipal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("loan.demandPrincipal")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("loan.enterDemandPrincipal")}
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col flex-1 min-h-0 border border-primary rounded-lg p-5 py-2 gap-2">
                    <h2 className="text-lg text-center font-semibold">{t("loan.transactionDetails")}</h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <div className="w-full flex flex-col gap-5">
                        <div className="w-full flex flex-col gap-3">
                          <InputField
                            control={form.control}
                            name="principalAmount"
                            label={t("loan.principal")}
                            placeholder={t("loan.enterPrincipalAmount")}
                            type="number"
                            // isBlurUpdate={"true"}
                            // readOnly
                            formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2 space-y-0"
                          />

                          <InputField
                            control={form.control}
                            name="interestAmount"
                            label={t("loan.interest")}
                            placeholder={t("loan.enterInterestAmount")}
                            type="number"
                            // isBlurUpdate={"true"}
                            // readOnly
                            formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2 space-y-0"
                          />

                          <InputField
                            control={form.control}
                            name="totalAmount"
                            label={t("loan.total")}
                            placeholder={t("loan.enterTotalAmount")}
                            type="number"
                            formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2 space-y-0"
                          />

                          <FormField
                            control={form.control}
                            name="totalAmountInWords"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder={t("loan.totalAmountInWords")}
                                    className="text-red-500 text-base resize-none"
                                    readOnly
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="w-full  flex flex-col gap-3">
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
                                      <FormLabel className="font-normal">{t("loan.cash")}</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="bank" />
                                      </FormControl>
                                      <FormLabel className="font-normal">{t("loan.bank")}</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="savings" />
                                      </FormControl>
                                      <FormLabel className="font-normal">{t("loan.savings")}</FormLabel>
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
                            placeholder={t("loan.enterRefVouchNo")}
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
                            <FormField
                              control={form.control}
                              name="bank"
                              render={({ field }) => (
                                <DropdownField
                                  label={t("loan.bank")}
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={bankAccountData}
                                  optionLabelKey="Bank_Name" // Specify the key for label
                                  placeholder={t("loan.selectBank")}
                                  searchPlaceholder={t("loan.searchBank")}
                                />
                              )}
                            />
                          ) : (
                            <>
                              <FormField
                                control={form.control}
                                name="savingsAccountType"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full">
                                    <FormLabel>{t("loan.accountType")}</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                                      >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="own" />
                                          </FormControl>
                                          <FormLabel className="font-normal">{t("loan.ownAccount")}</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem value="other" />
                                          </FormControl>
                                          <FormLabel className="font-normal">{t("loan.otherAccount")}</FormLabel>
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
                                  <div className="flex flex-col sm:flex-row items-end gap-5">
                                    <InputField
                                      control={form.control}
                                      name="savingsAccountNo"
                                      label={t("loan.accountNo")}
                                      placeholder={t("loan.enterAccountNo")}
                                      type="number"
                                      readOnly
                                      endContent={
                                        <DialogTrigger
                                          asChild
                                          className="cursor-pointer text-lg"
                                        >
                                          <IoSearch />
                                        </DialogTrigger>
                                      }
                                    />
                                    <div
                                      onClick={handleFetchData}
                                      className="px-5 py-2 bg-primary rounded-md text-white font-medium text-nowrap cursor-pointer"
                                    >
                                      Fetch Details
                                    </div>
                                  </div>

                                  <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[825px]">
                                    <DialogHeader
                                      className={`w-full flex items-center justify-center`}
                                    >
                                      <DialogTitle>{t("loan.searchAccount")}</DialogTitle>
                                    </DialogHeader>
                                    <div className="w-full overflow-y-scroll">
                                      <div className="w-full ">
                                        <Tabs
                                          defaultValue="account"
                                          value={activeTab}
                                          onValueChange={setActiveTab}
                                          className="w-full flex items-center justify-center flex-col"
                                        >
                                          <TabsList className="w-full sm:w-[70%]">
                                            <TabsTrigger
                                              value="memberNo"
                                              className="w-full"
                                            >
                                              By Member No.
                                            </TabsTrigger>
                                            <TabsTrigger
                                              value="name"
                                              className="w-full"
                                            >
                                              By Name
                                            </TabsTrigger>
                                          </TabsList>
                                          <TabsContent
                                            value="memberNo"
                                            className="w-full flex flex-col sm:flex-row items-end gap-2 gap-x-10 "
                                          >
                                            <InputField
                                              control={form.control}
                                              name="dialougeMemberNo"
                                              label={t("loan.memberNo2")}
                                              autoComplete="off"
                                              placeholder={t("loan.searchByEnterMemberNo")}
                                              formItemClassName="w-full"
                                            />
                                            <Button
                                              className="w-full sm:w-auto px-10"
                                              onClick={
                                                handleSearchAccountListByMemberNo
                                              }
                                            >{t("loan.search")}</Button>
                                          </TabsContent>
                                          <TabsContent
                                            value="name"
                                            className="w-full flex flex-col sm:flex-row items-end gap-2 gap-x-10 "
                                          >
                                            <InputField
                                              control={form.control}
                                              name="dialougeAccountName"
                                              label={t("loan.name")}
                                              autoComplete="off"
                                              placeholder={t("loan.searchByEnterName")}
                                              formItemClassName="w-full"
                                            />
                                            <Button
                                              className="w-full sm:w-auto px-10"
                                              onClick={
                                                handleSearchAccountListByName
                                              }
                                            >{t("loan.search")}</Button>
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
                                <FormField
                                  control={form.control}
                                  name="savings"
                                  render={({ field }) => (
                                    <DropdownField
                                      label={t("loan.savings")}
                                      value={field.value}
                                      onChange={field.onChange}
                                      options={savingsAccountData}
                                      optionLabelKey="Account_No" // Specify the key for label
                                      placeholder={t("loan.selectSavings")}
                                      searchPlaceholder={t("loan.searchSavings")}
                                    />
                                  )}
                                />
                              )}

                              {form.getValues("savingsAccountType") ===
                              "own" ? (
                                <InputField
                                  control={form.control}
                                  name="savingsName"
                                  label={t("loan.accountName")}
                                  placeholder={t("loan.enterName")}
                                  readOnly
                                  formItemClassName="w-full"
                                />
                              ) : (
                                <></>
                              )}

                              {form.getValues("savingsAccountType") ===
                              "own" ? (
                                <InputField
                                  control={form.control}
                                  name="savingsBalance"
                                  label={t("loan.accountBalance")}
                                  placeholder={t("loan.enterBalance")}
                                  readOnly
                                  formItemClassName="w-full"
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
                                  label={t("loan.name")}
                                  placeholder={t("loan.enterName")}
                                  displayValue={savingsAccountFullName}
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
                                  label={t("loan.balance")}
                                  placeholder={t("loan.enterBalance")}
                                  displayValue={savingsAccountBalance}
                                  readOnly
                                />
                              ) : (
                                <></>
                              )}
                            </>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={
                            postRepaymentLoading ||
                            insufficientBalanceDisable ||
                            !Number(form.getValues("totalAmount")) ||
                            (transMode === "cash" &&
                              isActiveDenom &&
                              Number(cashInTransactionGrandTotal) -
                                Number(cashOutTransactionGrandTotal) !==
                                Number(form.getValues("totalAmount"))) ||
                            (transMode === "bank" && !form.getValues("bank")) ||
                            (transMode === "savings" &&
                              (form.getValues("savingsAccountType") === "own"
                                ? !form.getValues("savings")
                                : !form.getValues("savingsAccountNo")))
                          }
                        >
                          {postRepaymentLoading ? (
                            <ClipLoader
                              color="#d7e6f4"
                              size={20}
                              speedMultiplier={0.7}
                            />
                          ) : (
                            t("loan.save")
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </Form>
      </div>

      <Dialog
        open={showGuarantorSecurityDialog}
        onOpenChange={setShowGuarantorSecurityDialog}
      >
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[825px] max-h-[90dvh]">
          <DialogHeader className={`w-full flex items-center justify-center`}>
            <DialogTitle>{t("loan.guarantorSecurityDetails")}</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col gap-5 overflow-y-scroll">
            {guarantorSecurityDetails?.SecurityDetails &&
            guarantorSecurityDetails?.SecurityDetails?.length > 0 ? (
              <div className="w-full">
                <h3 className="w-full text-center ">{t("loan.securityDetails")}</h3>
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead align="center" className="text-center">{t("loan.slNoDot")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.securityType")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.certificateType")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.certificateNo")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.issueDate")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.maturityDate")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.depositBalance")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guarantorSecurityDetails?.SecurityDetails.map(
                      (item, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Sec_Type || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Cert_Type || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Cert_No || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Issue_Date
                              ? format(item.Issue_Date, "dd-MM-yyyy")
                              : ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Matyrity_Date
                              ? format(item.Matyrity_Date, "dd-MM-yyyy")
                              : ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Deposit_Bal || ""}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : null}
            {guarantorSecurityDetails?.GurrantorDetails &&
            guarantorSecurityDetails?.GurrantorDetails?.length > 0 ? (
              <div className="w-full">
                <h3 className="w-full text-center ">{t("loan.guarantorDetails")}</h3>
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead align="center" className="text-center">{t("loan.slNoDot")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.guarantorName")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.guardianName")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.memberNo2")}</TableHead>
                      <TableHead align="center" className="text-center">{t("loan.cIFNo2")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guarantorSecurityDetails?.GurrantorDetails.map(
                      (item, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Full_Name || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Relation_Name || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Member_No || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.CIF_No || ""}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
        showNextButton={true}
        handleNextButton={handleGenerateCollectionReceipt}
        nextLabel="Print Receipt"
      />

      <LoanLedger
        showLedger={showLedgerDialog}
        setShowLedger={setShowLedgerDialog}
        fromDate={fromDate}
        toDate={toDate}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalDisburse={totalDisburse}
        totalPrincipalRefund={totalPrincipalRefund}
        totalInterestRefund={totalInterestRefund}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
        loading={getLoanLedgerLoading}
      />

      {!showSuccessMessage && (
        <CollectionReceipt
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          collectionReceiptData={collectionReceiptData}
        />
      )}
    </div>
  );
};

export default Repayment;
