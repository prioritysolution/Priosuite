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

const BankDeposit = ({
  loading,
  getBankLoading,
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
  const transMode = form.watch("transMode");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold self-center">
          {t("bank.bankDeposit")}
        </h3>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-3 pb-4"
              autoComplete="off"
            >
              <div className="w-full flex flex-col flex-1 min-h-0 border border-primary rounded-lg p-3 sm:p-5 gap-3">
                <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                  <h2 className="text-base sm:text-lg text-center font-bold text-[#00264d] tracking-wide">
                    {t("deposit.sections.accountDetails")}
                  </h2>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                  <FormField
                    control={form.control}
                    name="bankAccount"
                    render={({ field }) => (
                      <div className="flex gap-3 items-end w-full">
                        <div className="flex-1 min-w-0">
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
                              <button
                                type="button"
                                onClick={handleShowLedger}
                                className={cn(
                                  "p-2.5 px-4 text-xl bg-primary text-white rounded-md cursor-pointer flex items-center justify-center h-10 shrink-0 transition-colors hover:brightness-95",
                                  {
                                    "bg-gray-400 cursor-not-allowed hover:brightness-100":
                                      !form.getValues("bankAccount") ||
                                      !form.getValues("depositDate"),
                                  },
                                )}
                              >
                                <IoPrint />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("bank.viewLedger")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  />

                  <DatePickerField
                    control={form.control}
                    name="depositDate"
                    label={t("bank.depositDate")}
                    startYear={getYear(new Date(startDate))}
                    disabledDateAfter={
                      new Date(endDate) > new Date()
                        ? new Date()
                        : new Date(endDate)
                    }
                    endYear={getYear(new Date(endDate))}
                    isRequired
                    disabled
                  />

                  <InputField
                    control={form.control}
                    name="availableBalance"
                    label={t("bank.availableBalance")}
                    placeholder={t("bank.enterAvailableBalance")}
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="depositAmount"
                    label={t("bank.depositAmount")}
                    placeholder={t("bank.enterDepositAmount")}
                    type="number"
                    readOnly={
                      form.getValues("transMode") === "transfer" &&
                      subLedgerListData.length > 0
                    }
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="refVouchNo"
                    label={t("bank.refVouchNo")}
                    placeholder={t("bank.enterRefVouchNo")}
                  />

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
                            className="flex gap-x-6 h-10 items-center border border-input rounded-md px-3"
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

                <div className="w-full lg:w-1/2 xl:w-1/3">
                  <InputField
                    control={form.control}
                    name="totalDepositInWords"
                    label={t("bank.totalAmountInWords")}
                    placeholder={t("bank.totalAmountInWordsPlaceholder")}
                    className="text-red-500 font-medium text-sm"
                    readOnly
                  />
                </div>

                {transMode === "cash" && isActiveDenom && (
                  <>
                    <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3 mt-2">
                      <h2 className="text-base sm:text-lg text-center font-bold text-[#00264d] tracking-wide">
                        {t("bank.cashDenomination")}
                      </h2>
                    </div>
                    <CashDenomTable
                      notes={notes}
                      denominators={denominators}
                      totalAmount={cashTransactionTotal}
                      cashTransactionGrandTotal={cashTransactionGrandTotal}
                      handleDenominatorChange={handleDenominatorChange}
                      amountTobePaid={Number(form.getValues("depositAmount"))}
                      outTable={false}
                    />
                  </>
                )}

                {transMode === "transfer" && (
                  <>
                    <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3 mt-2">
                      <h2 className="text-base sm:text-lg text-center font-bold text-[#00264d] tracking-wide">
                        {t("bank.transferDetails")}
                      </h2>
                    </div>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                      <InputField
                        control={form.control}
                        name="narration"
                        label={t("bank.narration")}
                        placeholder={t("bank.enterNarration")}
                        isRequired={transMode === "transfer"}
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
                            isRequired={transMode === "transfer"}
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
                          <Button
                            type="button"
                            onClick={handleAddTransferTable}
                            className="w-full h-10"
                          >
                            {t("bank.addToTable")}
                          </Button>
                        </div>
                      )}
                    </div>

                    {subLedgerListData.length > 0 &&
                      transferTableData.length > 0 && (
                        <div className="border border-primary rounded-lg overflow-hidden mt-2">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[80px]">
                                  {t("common.slNo")}
                                </TableHead>
                                <TableHead>{t("bank.subLedger")}</TableHead>
                                <TableHead>{t("bank.narration")}</TableHead>
                                <TableHead>{t("common.amount")}</TableHead>
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
                                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors inline-flex items-center"
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
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={
                    loading ||
                    !Number(form.getValues("depositAmount")) ||
                    (transMode === "cash" &&
                      isActiveDenom &&
                      Number(cashTransactionGrandTotal) !==
                        Number(form.getValues("depositAmount")))
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
          toDate={form.getValues("depositDate")}
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
    </div>
  );
};

export default BankDeposit;
