"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InvestmentLedger from "@/common/ledger/investmentLedger/InvestmentLedger";
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getYear } from "date-fns";
import { IoPrint } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import getCookieData from "@/utils/getCookieData";
import { useTranslation } from "react-i18next";

const InvestmentInterest = ({
  loading,
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
  getLedgerLoading,
}) => {
  const { t } = useTranslation();

  const investmentAccountData = useSelector(
    (state) => state?.investmentInterest?.investmentAccountData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-black p-5 gap-5 overflow-hidden">
      <h3 className="text-2xl font-semibold text-center">
        {t("investment.interestPosting")}
      </h3>

      <ScrollArea className="w-full h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col items-center pb-6"
            autoComplete="off"
          >
            <div className="w-full  bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Account No */}
                <div className="flex gap-3 items-end w-full">
                  <div className="flex-1">
                    <DropdownField
                      control={form.control}
                      name="accountNo"
                      label={t("common.accountNo")}
                      options={investmentAccountData}
                      optionLabelKey="Accout_No"
                      placeholder={t("investment.selectAccountNo")}
                      searchPlaceholder={t("investment.searchAccountNo")}
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
                                !form.getValues("accountNo") ||
                                !form.getValues("interestDate"),
                            },
                          )}
                        >
                          <IoPrint />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("common.viewLedger")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Interest Date */}
                <DatePickerField
                  control={form.control}
                  name="interestDate"
                  label={t("investment.interestDate")}
                  disabled={true}
                />

                {/* Interest Amount */}
                <InputField
                  control={form.control}
                  name="interestAmount"
                  label={t("investment.interestAmount")}
                  placeholder={t("investment.enterInterestAmount")}
                  type="number"
                />

                {/* Ref Vouch No */}
                <InputField
                  control={form.control}
                  name="refVouchNo"
                  label={t("common.refVouchNo")}
                  placeholder={t("common.enterRefVouchNo")}
                />

                {/* Transaction Mode */}
                <FormField
                  control={form.control}
                  name="transMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end h-full">
                      <FormLabel className="mb-2">
                        {t("common.transactionMode")}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-x-6 h-10 items-center border border-input rounded-lg px-3 bg-slate-50 w-full"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="bank" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t("common.bank")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bank */}
                <DropdownField
                  control={form.control}
                  name="bank"
                  label={t("common.bank")}
                  options={bankAccountData}
                  optionLabelKey="Bank_Name"
                  placeholder={t("investment.selectBank")}
                  searchPlaceholder={t("investment.searchBank")}
                />
              </div>

              {/* Submit Action */}
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-40 h-10 font-semibold"
                  disabled={!form.getValues("bank") || loading}
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

      <InvestmentLedger
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={form.getValues("interestDate")}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalWithdrawn={totalWithdrawn}
        totalDeposit={totalDeposit}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
        loading={getLedgerLoading}
      />
    </div>
  );
};

export default InvestmentInterest;
