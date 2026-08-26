"use client";

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
            formLabel="Loan Repayment"
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
                    <h2 className="text-lg text-center font-semibold">
                      Account Details
                    </h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <div className=" w-full flex flex-col gap-2">
                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
                          <FormField
                            control={form.control}
                            name="accountNo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account No.</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter account no."
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
                                <FormLabel>Member Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter member name"
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
                                <FormLabel>Gurdian Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter gurdian name"
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
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter address"
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
                                <FormLabel>Mobile No.</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter mobile no."
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
                                <FormLabel>Account Type</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter account type"
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
                                <FormLabel>Disburse Date</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter disburse date"
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
                                <FormLabel>Disburse Amount</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter disburse amount"
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
                                <FormLabel>Rate Of Interest</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter rate of interest"
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
                                <FormLabel>Final Repay Date</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter final repay date"
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
                                <FormLabel>Repay Mode</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter repay mode"
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
                                <FormLabel>Installment Amount</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter installment amount"
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
                                <FormLabel>Last Repay Date</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter last repay date"
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
                                <FormLabel>Last Repay Principal</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter last repay principal"
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
                                <FormLabel>Last Repay Interest</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter last repay interest"
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
                                <FormLabel>Outstanding Balance</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter outstanding balance"
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
                                <FormLabel>Current Days</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter current days"
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
                                <FormLabel>Overdue Days</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter overdue days"
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
                                <FormLabel>Current Interest</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter current interest"
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
                                <FormLabel>Overdue Interest</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter overdue interest"
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
                                <FormLabel>Previous Due Interest</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter previous due interest"
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
                                <FormLabel>Demand Principal</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter demand principal"
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
                    <h2 className="text-lg text-center font-semibold">
                      Transaction Details
                    </h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <div className="w-full flex flex-col gap-5">
                        <div className="w-full flex flex-col gap-3">
                          <InputField
                            control={form.control}
                            name="principalAmount"
                            label="Principal"
                            placeholder="Enter principal amount"
                            type="number"
                            // isBlurUpdate={"true"}
                            // readOnly
                            formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2 space-y-0"
                          />

                          <InputField
                            control={form.control}
                            name="interestAmount"
                            label="Interest"
                            placeholder="Enter interest amount"
                            type="number"
                            // isBlurUpdate={"true"}
                            // readOnly
                            formItemClassName="grid grid-cols-[3fr_7fr] items-center gap-2 space-y-0"
                          />

                          <InputField
                            control={form.control}
                            name="totalAmount"
                            label="Total"
                            placeholder="Enter total amount"
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
                                    placeholder="Total amount in words"
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
                            <FormField
                              control={form.control}
                              name="bank"
                              render={({ field }) => (
                                <DropdownField
                                  label="Bank"
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={bankAccountData}
                                  optionLabelKey="Bank_Name" // Specify the key for label
                                  placeholder="Select bank"
                                  searchPlaceholder="Search bank..."
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
                                    <FormLabel>Account Type</FormLabel>
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
                                          <FormLabel className="font-normal">
                                            Own Account
                                          </FormLabel>
                                        </FormItem>
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
                                  <div className="flex flex-col sm:flex-row items-end gap-5">
                                    <InputField
                                      control={form.control}
                                      name="savingsAccountNo"
                                      label="Account No."
                                      placeholder="Enter account no."
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
                                      <DialogTitle>Search Account</DialogTitle>
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
                                              label="Member No."
                                              autoComplete="off"
                                              placeholder="Search by enter member no."
                                              formItemClassName="w-full"
                                            />
                                            <Button
                                              className="w-full sm:w-auto px-10"
                                              onClick={
                                                handleSearchAccountListByMemberNo
                                              }
                                            >
                                              Search
                                            </Button>
                                          </TabsContent>
                                          <TabsContent
                                            value="name"
                                            className="w-full flex flex-col sm:flex-row items-end gap-2 gap-x-10 "
                                          >
                                            <InputField
                                              control={form.control}
                                              name="dialougeAccountName"
                                              label="Name"
                                              autoComplete="off"
                                              placeholder="Search by enter name"
                                              formItemClassName="w-full"
                                            />
                                            <Button
                                              className="w-full sm:w-auto px-10"
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
                                <FormField
                                  control={form.control}
                                  name="savings"
                                  render={({ field }) => (
                                    <DropdownField
                                      label="Savings"
                                      value={field.value}
                                      onChange={field.onChange}
                                      options={savingsAccountData}
                                      optionLabelKey="Account_No" // Specify the key for label
                                      placeholder="Select savings"
                                      searchPlaceholder="Search savings..."
                                    />
                                  )}
                                />
                              )}

                              {form.getValues("savingsAccountType") ===
                              "own" ? (
                                <InputField
                                  control={form.control}
                                  name="savingsName"
                                  label="Account Name"
                                  placeholder="Enter name"
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
                                  label="Account Balance"
                                  placeholder="Enter balance"
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
                                  label="Name"
                                  placeholder="Enter name"
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
                                  label="Balance"
                                  placeholder="Enter balance"
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
                            "Save"
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
            <DialogTitle>Guarantor / Security Details</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col gap-5 overflow-y-scroll">
            {guarantorSecurityDetails?.SecurityDetails &&
            guarantorSecurityDetails?.SecurityDetails?.length > 0 ? (
              <div className="w-full">
                <h3 className="w-full text-center ">Security Details</h3>
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead align="center" className="text-center">
                        Sl. No.
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        Security Type
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        Certificate Type
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        Certificate No
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        Issue Date
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        Maturity Date
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        Deposit Balance
                      </TableHead>
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
                <h3 className="w-full text-center ">Guarantor Details</h3>
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead align="center" className="text-center">
                        Sl. No.
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        Guarantor Name
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        Guardian Name
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        Member No.
                      </TableHead>
                      <TableHead align="center" className="text-center">
                        CIF. No.
                      </TableHead>
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
