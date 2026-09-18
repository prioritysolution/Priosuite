"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import SearchDropdownField from "@/common/formFields/SearchDropdownField";
import BankLedger from "@/common/ledger/bankLedger/BankLedger";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import getCookieData from "@/utils/getCookieData";
import { getYear } from "date-fns";
import { useEffect, useState } from "react";
import { IoPrint } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const BankWithdrawn = ({
  loading,
  notes,
  denominators,
  cashTransactionTotal,
  cashTransactionGrandTotal,
  handleDenominatorChange,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  handleShowLedger,
  showLedger,
  setShowLedger,
  ledgerHeaderData,
  ledgerTableData,
  totalWithdrawn,
  totalDeposit,
  userName,
  currentDate,
  currentTime,
  fromDate,
  getBankLoading,
  handleSearchSubLedger,
  handleScrollSubLedger,
  subLedgerInput,
  setSubLedgerInput,
  handleAddTransferTable,
  transferTableData,
  handleDeleteTransferTable,
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

  const startDate = getCookieData("fin_start_date");

  const ledgerListData = useSelector(
    (state) => state?.voucherEntry?.ledgerList,
  );

  const subLedgerListData = useSelector(
    (state) => state?.voucherEntry?.subLedgerList,
  );

  const endDate = getCookieData("fin_end_date");

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-black p-5 gap-5 overflow-hidden">
      <h3 className="text-2xl font-semibold text-center">
        {t("bank.bankWithdrawn")}
      </h3>

      <ScrollArea className="w-full h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col items-center pb-6"
            autoComplete="off"
          >
            <div className="w-full bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bank Account */}
                <FormField
                  control={form.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <div className="flex gap-3 items-end w-full">
                      <div className="flex-1">
                        <DropdownField
                          label={t("bank.bankAccount")}
                          value={field.value}
                          onChange={field.onChange}
                          options={bankAccountData}
                          optionLabelKey="Bank_Name"
                          placeholder={t("bank.selectBankAccount")}
                          searchPlaceholder={t("bank.searchBankAccount")}
                          isRequired
                        />
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              onClick={handleShowLedger}
                              className={cn(
                                "p-2.5 px-4 text-xl bg-primary text-white rounded-lg cursor-pointer flex items-center justify-center h-10 mb-[2px] transition-colors hover:brightness-95",
                                {
                                  "bg-gray-400 cursor-not-allowed hover:brightness-100":
                                    !form.getValues("bankAccount") ||
                                    !form.getValues("withdrawnDate"),
                                },
                              )}
                            >
                              <IoPrint />
                            </div>
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>{t("bank.viewLedger")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                />

                {/* Withdrawn Date */}
                <DatePickerField
                  control={form.control}
                  name="withdrawnDate"
                  label={t("bank.withdrawnDate")}
                  isRequired
                  disabled
                />

                {/* Available Balance */}
                <InputField
                  control={form.control}
                  name="availableBalance"
                  label={t("bank.availableBalance")}
                  placeholder={t("bank.enterAvailableBalance")}
                  readOnly
                />

                {/* Withdrawn Amount */}
                <InputField
                  control={form.control}
                  name="withdrawnAmount"
                  label={t("bank.withdrawnAmount")}
                  placeholder={t("bank.enterWithdrawnAmount")}
                  type="number"
                  readOnly={subLedgerListData.length > 0}
                  isRequired
                />

                {/* Ref Vouch No */}
                <InputField
                  control={form.control}
                  name="refVouchNo"
                  label={t("bank.refVouchNo")}
                  placeholder={t("bank.enterRefVouchNo")}
                />

                {/* Transaction Mode */}
                <FormField
                  control={form.control}
                  name="transMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end h-full">
                      <FormLabel className="mb-2">
                        {t("bank.transactionMode")}
                      </FormLabel>

                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-x-6 h-10 items-center border border-input rounded-lg px-3 bg-slate-50"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>

                            <FormLabel className="font-normal cursor-pointer">
                              {t("common.cash")}
                            </FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="transfer" />
                            </FormControl>

                            <FormLabel className="font-normal cursor-pointer">
                              {t("common.transfer")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Amount in Words */}
              <div className="w-full md:w-1/2">
                <InputField
                  control={form.control}
                  name="totalWithdrawnInWords"
                  label={t("bank.totalAmountInWords")}
                  placeholder={t("bank.totalAmountInWordsPlaceholder")}
                  className="text-red-500 font-medium text-sm"
                  readOnly
                />
              </div>

              {/* Cash Denominations Table */}
              {form.getValues("transMode") === "cash" && isActiveDenom && (
                <div className="w-full border border-slate-100 rounded-xl p-4 bg-slate-50/50 mt-2">
                  <h5 className="text-sm font-semibold text-slate-700 mb-3">
                    {t("bank.cashDenomination")}
                  </h5>

                  <CashDenomTable
                    notes={notes}
                    denominators={denominators}
                    totalAmount={cashTransactionTotal}
                    cashTransactionGrandTotal={cashTransactionGrandTotal}
                    handleDenominatorChange={handleDenominatorChange}
                    amountTobePaid={Number(form.getValues("withdrawnAmount"))}
                    outTable={false}
                    tableType="out"
                  />
                </div>
              )}

              {/* Transfer Details Grid & Table */}
              {form.getValues("transMode") === "transfer" && (
                <div className="w-full border border-slate-200 rounded-xl p-5 bg-slate-50/30 flex flex-col gap-5 mt-2">
                  <div className="border-b border-slate-100 pb-2">
                    <h5 className="text-sm font-semibold text-slate-700">
                      {t("bank.transferDetails")}
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <InputField
                      control={form.control}
                      name="narration"
                      label={t("bank.narration")}
                      placeholder={t("bank.enterNarration")}
                      isRequired={form.getValues("transMode") === "transfer"}
                    />

                    <FormField
                      control={form.control}
                      name="gl"
                      render={({ field }) => (
                        <DropdownField
                          label={t("common.gl")}
                          value={field.value}
                          onChange={field.onChange}
                          options={ledgerListData}
                          optionLabelKey="Ledger_Name"
                          placeholder={t("bank.selectGl")}
                          searchPlaceholder={t("bank.searchGl")}
                          disabled={transferTableData.length > 0}
                          isRequired={
                            form.getValues("transMode") === "transfer"
                          }
                        />
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subGl"
                      render={({ field }) => (
                        <SearchDropdownField
                          label={t("bank.subLedger")}
                          value={field.value}
                          onChange={field.onChange}
                          options={subLedgerListData}
                          placeholder={t("bank.selectSubLedger")}
                          optionLabelKey="Ledger_Name"
                          disabled={
                            !form.getValues("gl") ||
                            !(
                              subLedgerListData &&
                              subLedgerListData.length > 0
                            )
                          }
                          input={subLedgerInput}
                          setInput={setSubLedgerInput}
                          handleSearch={handleSearchSubLedger}
                          loadMore={handleScrollSubLedger}
                        />
                      )}
                    />

                    {subLedgerListData.length > 0 && (
                      <InputField
                        control={form.control}
                        name="subGlBalance"
                        label={t("bank.availableBalance")}
                        placeholder={t("bank.enterBalance")}
                        readOnly
                      />
                    )}

                    {subLedgerListData.length > 0 && (
                      <InputField
                        control={form.control}
                        name="subLedgerNarration"
                        label={t("bank.subledgerNarration")}
                        placeholder={t("bank.enterNarration")}
                      />
                    )}

                    {subLedgerListData.length > 0 && (
                      <InputField
                        control={form.control}
                        name="ledgerAmount"
                        label={t("common.amount")}
                        placeholder={t("bank.enterAmount")}
                        type="number"
                      />
                    )}

                    {subLedgerListData.length > 0 && (
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddTransferTable}
                          className="w-full flex items-center justify-center text-white bg-primary rounded-lg h-10 font-medium transition-colors hover:brightness-95 text-sm cursor-pointer"
                        >
                          {t("bank.addToTable")}
                        </button>
                      </div>
                    )}
                  </div>

                  {subLedgerListData.length > 0 &&
                    transferTableData.length > 0 && (
                      <div className="border border-slate-100 rounded-lg overflow-hidden mt-2 bg-white">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead className="w-[80px]">
                                {t("common.slNo")}
                              </TableHead>

                              <TableHead>
                                {t("bank.subLedger")}
                              </TableHead>

                              <TableHead>
                                {t("bank.narration")}
                              </TableHead>

                              <TableHead>
                                {t("common.amount")}
                              </TableHead>

                              <TableHead className="text-right">
                                {t("common.action")}
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {transferTableData.map((data, i) => (
                              <TableRow key={i}>
                                <TableCell className="font-medium">
                                  {i + 1}
                                </TableCell>

                                <TableCell>{data?.subGlName}</TableCell>

                                <TableCell>{data?.narration}</TableCell>

                                <TableCell>{data?.amount}</TableCell>

                                <TableCell className="text-right">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteTransferTable(data.subGlId)
                                    }
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                                  >
                                    <MdDeleteForever className="text-xl" />
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                </div>
              )}

              {/* Submit Action */}
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-40 h-10 font-semibold"
                  disabled={
                    loading ||
                    !Number(form.getValues("withdrawnAmount")) ||
                    (form.getValues("transMode") === "cash" &&
                      isActiveDenom &&
                      Number(cashTransactionGrandTotal) !==
                        Number(form.getValues("withdrawnAmount"))) ||
                    (form.getValues("availableBalance") &&
                      Number(form.getValues("availableBalance")) <= 0)
                  }
                >
                  {loading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("common.add")
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </ScrollArea>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />

      <BankLedger
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={form.getValues("withdrawnDate")}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalWithdrawn={totalWithdrawn}
        totalDeposit={totalDeposit}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
        loading={getBankLoading}
      />
    </div>
  );
};

export default BankWithdrawn;
