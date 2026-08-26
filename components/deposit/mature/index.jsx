"use client";

import AccountSearchForm from "@/common/forms/AccountSearchForm";
import AccountSearchTable from "@/common/tables/AccountSearchTable";
import CashDenomTable from "@/common/tables/CashDenomTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import getCookieData from "@/utils/getCookieData";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Mature = ({
  loading,
  getMatureLoading,
  getSpecimenLoading,
  postMatureLoading,
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
  handleSeeSpecimen,
  photoLink,
  signatureLink,
  optionForm,
  handleOptionFormSubmit,
  showSearchAccountForm,
  disableOperationTypeForm,
  transMode,
  handleSearchAccountListByMemberNo,
  handleSearchAccountListByName,
  handleSelectClick,
  dialougeOpen,
  setDialougeOpen,
  handleFetchData,
  savingsAccountFullName,
  savingsAccountBalance,
  showMatureDialog,
  setShowMatureDialog,
  handleCancelPremature,
  handleResetOperation,
  handleCalculateMaturityInterest,
  isInterestCalculated,
  getDepositMaturityInterestApiCall,
  getDepositMaturityBonusInterestApiCall,
  showBonusDialog,
  setShowBonusDialog,
  showPayoutInterestDialog,
  setShowPayoutInterestDialog,
  resetTrigger,
  currentSavingsPage,
  setCurrentSavingsPage,
  lastSavingsPage,
  activeTab,
  setActiveTab,
  getLedgerLoading,
}) => {

  // console.log("depositReceiptData=", depositReceiptData);

  const [bonusInterest, setBonusInterest] = useState("");
  const [payoutInterest, setPayoutInterest] = useState("");
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

  const accountListData = useSelector(
    (state) => state?.deposit?.searchAccountData,
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const operateProductData = useSelector(
    (state) => state?.mature?.operateProductData,
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Close / Mature</h3>

        <Form {...optionForm}>
          <form
            onSubmit={optionForm.handleSubmit(handleOptionFormSubmit)}
            className="w-full flex items-center justify-center px-2 sm:px-10"
            autoComplete="off"
          >
            <div className="w-full border border-primary rounded-lg p-5 py-2 gap-2">
              <div className="w-full flex items-center justify-center gap-10">
                {/* operation Type radio button */}
                <FormField
                  control={optionForm.control}
                  name="operationType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full">
                      <FormLabel>Operation Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={disableOperationTypeForm}
                          className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="close" />
                            </FormControl>
                            <FormLabel className="font-normal">Close</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="mature" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Mature
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {disableOperationTypeForm ? (
                    <Button
                      type="button"
                      className="w-full sm:w-24 bg-primary text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        handleResetOperation();
                      }}
                    >
                      Reset
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full sm:w-24">
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>

        {showSearchAccountForm ? (
          <ScrollArea className="w-full h-full px-2 sm:px-10">
            <div className="w-full mb-2">
              <AccountSearchForm
                loading={getMatureLoading}
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
                toDate={form.getValues("closeDate")}
                resetTrigger={resetTrigger}
                allowAlphanumeric
                formLabel={
                  optionForm.getValues("operationType") === "close"
                    ? "Close"
                    : "Mature"
                }
                showDateFix={true}
                operateProductData={operateProductData}
                showProduct={true}
                getLedgerLoading={getLedgerLoading}
              />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full flex flex-col gap-2 justify-between"
                autoComplete="off"
              >
                {visibleBlock && (
                  <div className="w-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                    <h3 className="w-full text-center text-xl font-semibold">
                      Basic Info Block
                    </h3>
                    {getMatureLoading ? (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                        {Array.from({
                          length:
                            optionForm.getValues("operationType") === "close"
                              ? 8
                              : 10,
                        }).map((_, index) => (
                          <div
                            key={index}
                            className="w-full flex flex-col gap-[10px]"
                          >
                            <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                            <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                          </div>
                        ))}
                        <Skeleton className="h-10 w-full rounded-md bg-secondary self-end" />
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

                        <InputField
                          control={form.control}
                          name="rateOfInterest"
                          label="Rate Of Interest"
                          placeholder="Enter rate of interest"
                          readOnly
                        />

                        {optionForm.getValues("operationType") !== "close" && (
                          <>
                            <InputField
                              control={form.control}
                              name="maturityDate"
                              label="Maturity Date"
                              placeholder="Enter maturity date"
                              readOnly
                            />

                            <InputField
                              control={form.control}
                              name="maturityAmount"
                              label="Maturity Amount"
                              placeholder="Enter maturity amount"
                              readOnly
                            />
                          </>
                        )}

                        <InputField
                          control={form.control}
                          name="availableBalance"
                          label="Available Balance"
                          placeholder="Enter available balance"
                          readOnly
                        />

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={handleSeeSpecimen}
                              className="self-end"
                            >
                              See Specimen
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[925px]">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                              <div className="flex flex-col items-center gap-2 text-center font-semibold">
                                <h3>Photo</h3>

                                <div className=" w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] xl:w-[400px] xl:h-[400px] border border-primary mx-auto relative flex items-center justify-center">
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
                              <div className="flex flex-col items-center gap-2 text-center font-semibold">
                                <h3>Signature</h3>

                                <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] xl:w-[400px] xl:h-[400px] border border-primary mx-auto relative flex items-center justify-center">
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
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                )}

                {visibleBlock && (
                  <div className="w-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                    <h3 className="w-full text-center text-xl font-semibold">
                      Close Info Block
                    </h3>
                    {getMatureLoading ? (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                        {Array.from({
                          length: 5,
                        }).map((_, index) => (
                          <div
                            key={index}
                            className="w-full flex flex-col gap-[10px]"
                          >
                            <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                            <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                          </div>
                        ))}
                        <Skeleton className="h-10 w-full rounded-md bg-secondary self-end" />
                      </div>
                    ) : (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 items-end">
                        <DatePickerField
                          control={form.control}
                          name="closeDate"
                          label="Close Date"
                          startYear={2000}
                          endYear={2050}
                          disabled
                        />

                        <InputField
                          control={form.control}
                          name="amount"
                          label="Princpal Amount"
                          placeholder="Enter amount"
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="interest"
                          label="Interest"
                          placeholder="Enter interest"
                          type="number"
                          className="w-full"
                          containerClassName="w-full"
                          disabled={true}
                        />

                        {optionForm.getValues("operationType") === "mature" ? (
                          <InputField
                            control={form.control}
                            name="bonusInterest"
                            label="Bonus Interest"
                            placeholder="Enter bonus interest"
                            className="w-full"
                            containerClassName="w-full"
                          />
                        ) : (
                          <></>
                        )}

                        {optionForm.getValues("operationType") === "mature" && (
                          <InputField
                            control={form.control}
                            name="findAmount"
                            label="Find Amount"
                            placeholder="Enter find amount"
                            type="number"
                            className="w-full"
                            containerClassName="w-full"
                          />
                        )}

                        <InputField
                          control={form.control}
                          name="totalAmount"
                          label={
                            optionForm.getValues("operationType") === "mature"
                              ? "Total Amount ( - Find Amount)"
                              : "Total Amount"
                          }
                          placeholder="Enter total amount"
                          className="w-full"
                          containerClassName="w-full"
                          readOnly
                        />

                        <div
                          className={`text-nowrap px-3 py-2 rounded-md h-fit text-center select-none transition-all ${
                            isInterestCalculated
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-primary text-white cursor-pointer"
                          }`}
                          onClick={
                            !isInterestCalculated
                              ? handleCalculateMaturityInterest
                              : undefined
                          }
                        >
                          <p>Calculate Interest</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {visibleBlock && (
                  <div className="w-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                    <h3 className="w-full text-center text-xl font-semibold">
                      Transanction Block
                    </h3>
                    {getMatureLoading ? (
                      <div className="w-full border border-primary rounded-md p-2 sm:p-5 mb-5 flex flex-col gap-3">
                        <Skeleton className=" h-10 w-full lg:w-[500px] bg-secondary " />
                        <div className="w-48 flex flex-col gap-[10px]">
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col gap-3">
                        <FormField
                          control={form.control}
                          name="transMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full lg:w-fit">
                              <FormLabel>Select transanction mode</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
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
                        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3">
                          <InputField
                            control={form.control}
                            name="refVouchNo"
                            label="Ref. Vouch No."
                            placeholder="Enter ref. vouch no."
                          />
                          {transMode === "cash" ? (
                            isActiveDenom ? (
                              <div className="lg:w-1/2 w-full flex flex-col lg:flex-row gap-10 col-span-2">
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
                                  handleInDenominatorChange={
                                    handleOutDenominatorChange
                                  }
                                  handleOutDenominatorChange={
                                    handleInDenominatorChange
                                  }
                                  primaryInput="out"
                                />
                              </div>
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
                          ) : transMode === "savings" ? (
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
                                        {optionForm.getValues(
                                          "operationType",
                                        ) !== "close" && (
                                          <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                              <RadioGroupItem value="own" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              Own Account
                                            </FormLabel>
                                          </FormItem>
                                        )}
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
                                  <FormField
                                    control={form.control}
                                    name="savingsAccountNo"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Account No.</FormLabel>

                                        <FormControl>
                                          <div className="flex flex-col sm:flex-row items-end gap-5">
                                            <div className="w-full">
                                              <div className="relative w-full">
                                                <Input
                                                  placeholder="Enter account no."
                                                  className="w-full "
                                                  type="number"
                                                  // onInput={(e) => {
                                                  //   if (e.target.value.length > 5) {
                                                  //     e.target.value = e.target.value.slice(0, 5);
                                                  //   }
                                                  // }}
                                                  readOnly
                                                  {...field}
                                                />

                                                <div className="absolute right-0 top-0 py-3 px-3">
                                                  <DialogTrigger
                                                    asChild
                                                    className="cursor-pointer text-lg"
                                                  >
                                                    <IoSearch />
                                                  </DialogTrigger>
                                                </div>
                                              </div>
                                              <FormMessage />
                                            </div>
                                            <div
                                              onClick={handleFetchData}
                                              className="px-5 py-2 bg-primary rounded-md text-white font-medium text-nowrap"
                                            >
                                              Fetch Details
                                            </div>
                                          </div>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />

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
                                            <FormField
                                              control={form.control}
                                              name="dialougeMemberNo"
                                              render={({ field }) => (
                                                <FormItem className="w-full">
                                                  <FormLabel>
                                                    Member No.
                                                  </FormLabel>
                                                  <FormControl>
                                                    <Input
                                                      autoComplete="off"
                                                      placeholder="Search by enter member no."
                                                      {...field}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
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
                                            <FormField
                                              control={form.control}
                                              name="dialougeAccountName"
                                              render={({ field }) => (
                                                <FormItem className="w-full">
                                                  <FormLabel>Name</FormLabel>
                                                  <FormControl>
                                                    <Input
                                                      autoComplete="off"
                                                      placeholder="Search by enter name"
                                                      {...field}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
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
                                <DropdownField
                                  control={form.control}
                                  name="savings"
                                  label="Savings"
                                  options={savingsAccountData}
                                  optionLabelKey="Account_No"
                                  placeholder="Select savings"
                                  searchPlaceholder="Search savings..."
                                />
                              )}

                              {form.getValues("savingsAccountType") ===
                              "own" ? (
                                <InputField
                                  control={form.control}
                                  name="savingsName"
                                  label="Account Name"
                                  placeholder="Enter name"
                                  className="w-full"
                                  containerClassName="w-full"
                                  readOnly
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
                                  className="w-full"
                                  containerClassName="w-full"
                                  readOnly
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
                                  value={savingsAccountFullName}
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
                                  value={savingsAccountBalance}
                                  readOnly
                                />
                              ) : (
                                <></>
                              )}
                            </>
                          ) : null}
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
                      postMatureLoading ||
                      !Number(form.getValues("totalAmount")) ||
                      (transMode === "cash" &&
                        isActiveDenom &&
                        (optionForm.getValues("operationType") === "close"
                          ? Number(cashInTransactionGrandTotal) -
                              Number(cashOutTransactionGrandTotal) !==
                            Number(form.getValues("totalAmount"))
                          : Number(cashInTransactionGrandTotal) -
                              Number(cashOutTransactionGrandTotal) !==
                            Number(form.getValues("totalAmount")))) ||
                      (transMode === "bank" && !form.getValues("bank")) ||
                      (transMode === "savings" &&
                        (form.getValues("savingsAccountType") === "own"
                          ? !form.getValues("savings")
                          : !form.getValues("savingsAccountNo")))
                    }
                  >
                    {postMatureLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : optionForm.getValues("operationType") === "close" ? (
                      "Process To Close"
                    ) : (
                      "Process To Mature"
                    )}
                  </Button>
                )}
              </form>
            </Form>
          </ScrollArea>
        ) : (
          <></>
        )}
      </div>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />

      <Dialog open={showMatureDialog} onOpenChange={setShowMatureDialog}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
          <DialogTitle className="w-full text-center">
            Mature Date Exceeds
          </DialogTitle>
          <div className="w-full flex flex-col gap-5 items-center justify-center">
            <p className="w-full text-center">
              Your maturity date is{" "}
              <span className="font-semibold">
                {form.getValues("maturityDate")}.
              </span>{" "}
              Do you want to pre-mature this account ?
            </p>
            <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <Button
                className="w-full sm:w-auto px-6 bg-destructive hover:bg-destructive/90"
                onClick={handleCancelPremature}
              >
                No
              </Button>
              <Button
                className="w-full sm:w-auto px-6"
                onClick={() => setShowMatureDialog(false)}
              >
                Yes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBonusDialog} onOpenChange={setShowBonusDialog}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
          <DialogTitle className="w-full text-center">
            Bonus Interest
          </DialogTitle>
          <div className="w-full flex flex-col gap-5 items-center justify-center">
            <p className="w-full text-center">
              Your maturity date is{" "}
              <span className="font-semibold">
                {form.getValues("closeDate") &&
                  format(form.getValues("closeDate"), "dd-MM-yyyy")}
                .
              </span>
              Do you want bonus interest to this account ?
            </p>
            <Input
              placeholder="Enter bonus interest"
              type="number"
              value={bonusInterest}
              onChange={(e) => setBonusInterest(e.target.value)}
            />

            <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <Button
                className="w-full sm:w-auto px-6 bg-destructive hover:bg-destructive/90"
                onClick={() => setShowBonusDialog(false)}
              >
                No
              </Button>
              <Button
                className="w-full sm:w-auto px-6"
                onClick={() =>
                  getDepositMaturityBonusInterestApiCall(bonusInterest)
                }
              >
                Yes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPayoutInterestDialog}
        onOpenChange={setShowPayoutInterestDialog}
      >
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
          <DialogTitle className="w-full text-center">
            Payout Interest
          </DialogTitle>
          <div className="w-full flex flex-col gap-5 items-center justify-center">
            <p className="w-full text-center">
              This Is a premature account, please enter payout interest.
            </p>
            <Input
              placeholder="Enter payout interest"
              type="number"
              value={payoutInterest}
              onChange={(e) => setPayoutInterest(e.target.value)}
            />

            <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <Button
                className="w-full sm:w-auto px-6 bg-destructive hover:bg-destructive/90"
                onClick={() => setShowPayoutInterestDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto px-6"
                onClick={() =>
                  getDepositMaturityInterestApiCall(payoutInterest)
                }
              >
                Next
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Mature;
