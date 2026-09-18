"use client";


import { useTranslation } from "react-i18next";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import AccountSearchForm from "@/common/forms/AccountSearchForm";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import getCookieData from "@/utils/getCookieData";
import { format, getYear } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const InterestPayout = ({
  loading,
  postInterestPayoutLoading,
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
  handleBulkAccountSubmit,
  handleAccountFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  optionForm,
  handleOptionFormSubmit,
  showSearchAccountForm,
  showBulkAccountTable,
  disablePayoutTypeForm,
  transMode,
  postingType,
  resetTrigger,
}) => {
  const { t } = useTranslation();

  const [isActiveDenom, setIsActiveDenom] = useState(false);
  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  const singleAccountData = useSelector(
    (state) => state?.interestPayout?.singleAccountData
  );

  const bulkAccountData = useSelector(
    (state) => state?.interestPayout?.bulkAccountData
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData
  );

  const monthList = [
    { Id: "1", label: t("deposit.months.january") },
    { Id: "2", label: t("deposit.months.february") },
    { Id: "3", label: t("deposit.months.march") },
    { Id: "4", label: t("deposit.months.april") },
    { Id: "5", label: t("deposit.months.may") },
    { Id: "6", label: t("deposit.months.june") },
    { Id: "7", label: t("deposit.months.july") },
    { Id: "8", label: t("deposit.months.august") },
    { Id: "9", label: t("deposit.months.september") },
    { Id: "10", label: t("deposit.months.october") },
    { Id: "11", label: t("deposit.months.november") },
    { Id: "12", label: t("deposit.months.december") },
  ];

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">{t("deposit.interestPayout.title")}</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <div className="flex flex-col  w-full ">
            <Form {...optionForm}>
              <form
                onSubmit={optionForm.handleSubmit(handleOptionFormSubmit)}
                className="w-full flex items-center justify-center mb-10"
                autoComplete="off"
              >
                <div className="w-full border border-primary rounded-lg p-5 gap-5">
                  <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-5">
                    <FormField
                      control={optionForm.control}
                      name="payoutOn"
                      render={({ field }) => (
                        <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full">
                          <FormLabel>{t("deposit.interestPayout.selectPayoutOn")}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              // disabled={disablePayoutTypeForm}
                              className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="fixed" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  On fixed Deposit
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="mis" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  On MIS Deposit
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={optionForm.control}
                      name="postingType"
                      render={({ field }) => (
                        <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full">
                          <FormLabel>{t("deposit.interestPayout.selectPostingType")}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              // disabled={disablePayoutTypeForm}
                              className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="single" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Single Account
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="bulk" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Bulk Account
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {postingType === "bulk" ? (
                      <>
                        <DatePickerField
                          control={optionForm.control}
                          name="payoutDate"
                          label={t("deposit.fields.payoutDate")}
                          startYear={getYear(new Date(startDate))}
                          disabledDateAfter={
                            new Date(endDate) > new Date()
                              ? new Date()
                              : new Date(endDate)
                          }
                          endYear={getYear(new Date(endDate))}
                        />
                        <DropdownField
                          control={optionForm.control}
                          name="month"
                          label={t("deposit.fields.month")}
                          options={monthList}
                          optionLabelKey="label"
                          placeholder={t("deposit.placeholders.selectMonth")}
                          searchPlaceholder={t("deposit.placeholders.searchMonth")}
                        />
                        <InputField
                          control={optionForm.control}
                          name="year"
                          label={t("deposit.fields.year")}
                          placeholder={t("deposit.placeholders.year")}
                          type="number"
                          min={1900}
                          max={2100}
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    <div
                      className={cn(`w-full flex items-end justify-end`, {
                        "xl:col-span-2": postingType === "single",
                      })}
                    >
                      <Button
                        type="submit"
                        className="w-full sm:w-1/3"
                        // disabled={disablePayoutTypeForm}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>

            {showBulkAccountTable && (
              <div className="w-full h-full flex flex-col border border-primary rounded-lg py-5 gap-5">
                <h3 className="w-full text-center text-xl font-semibold">
                  {t("deposit.interestPayout.interestDetails")}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">{t("deposit.interestPayout.serialNo")}</TableHead>
                      <TableHead>{t("deposit.interestPayout.name")}</TableHead>
                      <TableHead>{t("deposit.fields.accountNo")}</TableHead>
                      <TableHead>{t("deposit.interestPayout.date")}</TableHead>
                      <TableHead>{t("deposit.fields.amount")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <TableCell key={index}>
                              <Skeleton className="w-full h-5 bg-secondary" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : bulkAccountData.length > 0 ? (
                      bulkAccountData.map((data, index) => (
                        <TableRow key={data.Id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data.Full_Name}</TableCell>
                          <TableCell>{data.Account_No}</TableCell>
                          <TableCell>
                            {format(data.Due_Date, "dd-MM-yyyy")}
                          </TableCell>
                          <TableCell>{data.Ins_Amount}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                    {bulkAccountData.length > 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>{t("deposit.interestPayout.total")}</TableCell>
                        <TableCell>
                          {bulkAccountData
                            ?.reduce((total, item) => {
                              return total + Number(item.Ins_Amount);
                            }, 0)
                            ?.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <></>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {showSearchAccountForm && (
              <>
                <div className="w-full h-full mb-10">
                  <AccountSearchForm
                    handleSubmit={handleAccountFormSubmit}
                    resetTrigger={resetTrigger}
                  />
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full h-full flex flex-col gap-10 justify-between"
                    autoComplete="off"
                  >
                    {visibleBlock && (
                      <div className="w-full h-full flex flex-col border border-primary rounded-lg py-5 gap-5">
                        <h3 className="w-full text-center text-xl font-semibold">
                          {t("deposit.interestPayout.interestDetails")}
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">
                                {t("deposit.interestPayout.serialNo")}
                              </TableHead>
                              <TableHead>{t("deposit.interestPayout.name")}</TableHead>
                              <TableHead>{t("deposit.fields.accountNo")}</TableHead>
                              <TableHead>{t("deposit.interestPayout.date")}</TableHead>
                              <TableHead>{t("deposit.fields.amount")}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {loading ? (
                              Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <TableCell key={index}>
                                      <Skeleton className="w-full h-5 bg-secondary" />
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))
                            ) : singleAccountData.length > 0 ? (
                              singleAccountData.map((data, index) => (
                                <TableRow key={data?.Id}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{data?.Full_Name}</TableCell>
                                  <TableCell>{data?.Account_No}</TableCell>
                                  <TableCell>
                                    {format(data?.Due_Date, "dd-MM-yyyy")}
                                  </TableCell>
                                  <TableCell>{data?.Ins_Amount}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className=" text-center">
                                  No results.
                                </TableCell>
                              </TableRow>
                            )}
                            {singleAccountData.length > 0 ? (
                              <TableRow>
                                <TableCell colSpan={4}>{t("deposit.interestPayout.total")}</TableCell>
                                <TableCell>
                                  {singleAccountData
                                    ?.reduce((total, item) => {
                                      return total + Number(item?.Ins_Amount);
                                    }, 0)
                                    ?.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ) : (
                              <></>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {visibleBlock && (
                      <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                        <h3 className="w-full text-center text-xl font-semibold">
                          {t("deposit.sections.payoutInfo")}
                        </h3>
                        <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                          <DatePickerField
                            control={form.control}
                            name="paidDate"
                            label={t("deposit.fields.paidDate")}
                            disabled
                          />

                          <InputField
                            control={form.control}
                            name="interestAmount"
                            label={t("deposit.fields.interestAmount")}
                            placeholder={t("deposit.placeholders.interestAmount")}
                            readOnly
                          />
                        </div>
                      </div>
                    )}

                    {visibleBlock && (
                      <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 sm:p-5 gap-5">
                        <h3 className="w-full text-center text-xl font-semibold">
                          {t("deposit.sections.transaction")}
                        </h3>
                        <div className="w-full border border-primary rounded-md p-5 mb-5 flex flex-col gap-3">
                          <FormField
                            control={form.control}
                            name="transMode"
                            render={({ field }) => (
                              <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full lg:w-fit">
                                <FormLabel>{t("deposit.common.selectTransanctionMode")}</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
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
                          <InputField
                            control={form.control}
                            name="refVouchNo"
                            label={t("deposit.fields.refVoucherNo")}
                            placeholder={t("deposit.placeholders.refVoucherNo")}
                            className="w-fit"
                          />
                        </div>
                        {transMode === "cash" ? (
                          isActiveDenom ? (
                            <div className="w-1/2 flex flex-col lg:flex-row gap-10">
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
                            </div>
                          ) : null
                        ) : transMode === "bank" ? (
                          <div className="w-full grid grid-cols-1 lg:grid-cols-2">
                            <DropdownField
                              control={form.control}
                              name="bank"
                              label={t("deposit.fields.bank")}
                              options={bankAccountData}
                              optionLabelKey="Bank_Name"
                              placeholder={t("deposit.placeholders.selectBank")}
                              searchPlaceholder={t("deposit.placeholders.searchBank")}
                            />
                          </div>
                        ) : (
                          <div className="w-full grid grid-cols-1 lg:grid-cols-2">
                            <DropdownField
                              control={form.control}
                              name="savings"
                              label={t("deposit.fields.savings")}
                              options={savingsAccountData}
                              optionLabelKey="Account_No"
                              placeholder={t("deposit.placeholders.selectSavings")}
                              searchPlaceholder={t("deposit.placeholders.searchSavings")}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {visibleBlock && (
                      <Button
                        type="submit"
                        className="w-full sm:w-1/5 self-end"
                        disabled={
                          postInterestPayoutLoading ||
                          !Number(form.getValues("interestAmount")) ||
                          (transMode === "cash" &&
                            isActiveDenom &&
                            Number(cashInTransactionGrandTotal) -
                              Number(cashOutTransactionGrandTotal) !==
                              Number(form.getValues("interestAmount")))
                        }
                      >
                        {postInterestPayoutLoading ? (
                          <ClipLoader
                            color="#d7e6f4"
                            size={20}
                            speedMultiplier={0.7}
                          />
                        ) : (
                          "Process Payout"
                        )}
                      </Button>
                    )}
                  </form>
                </Form>
              </>
            )}

            {showBulkAccountTable && (
              <Button
                onClick={handleBulkAccountSubmit}
                className="w-full sm:w-1/5 self-end mt-5"
                disabled={postInterestPayoutLoading || !(bulkAccountData.length > 0)}
              >
                {postInterestPayoutLoading ? (
                  <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
                ) : (
                  "Process To Post"
                )}
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default InterestPayout;
