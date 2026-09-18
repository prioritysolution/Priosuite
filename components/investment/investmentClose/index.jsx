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
import { IoCalculator, IoPrint } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const InvestmentClose = ({
  loading,
  form,
  handleSubmit,
  handleCalculateClosingInterest,
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
  toDate,
  getLedgerLoading,
}) => {
  const { t } = useTranslation();

  const investmentAccountData = useSelector(
    (state) => state?.investmentInterest?.investmentAccountData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("investment.investmentClose")}
        </h3>

        <ScrollArea className="w-full h-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              {/* Select account no. Block */}
              <div className="w-full flex items-center justify-start border border-primary rounded-xl p-6 shadow-sm">
                <div className="flex items-end gap-3 w-full max-w-md">
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
                        <Button
                          type="button"
                          onClick={handleShowLedger}
                          disabled={!form.getValues("accountNo")}
                          className={cn(
                            "h-10 px-4 bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-all",
                            {
                              "bg-gray-400 hover:bg-gray-400 cursor-not-allowed":
                                !form.getValues("accountNo"),
                            },
                          )}
                        >
                          <IoPrint className="text-xl" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("common.viewLedger")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-3">
                <h3 className="w-full text-center text-xl font-semibold">
                  {t("investment.basicInfoBlock")}
                </h3>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <InputField
                    control={form.control}
                    name="openingDate"
                    label={t("investment.openDate")}
                    placeholder={t("investment.enterOpenDate")}
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="investmentAmount"
                    label={t("investment.investmentAmount")}
                    placeholder={t("investment.enterInvestmentAmount")}
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="rateOfInterest"
                    label={t("investment.rateOfInterest")}
                    placeholder={t("investment.enterRateOfInterest")}
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="maturityDate"
                    label={t("investment.maturityDate")}
                    placeholder={t("investment.enterMaturityDate")}
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="maturityAmount"
                    label={t("investment.maturityAmount")}
                    placeholder={t("investment.enterMaturityAmount")}
                    readOnly
                  />
                </div>
              </div>

              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-3">
                <h3 className="w-full text-center text-xl font-semibold">
                  {t("investment.closingInfoBlock")}
                </h3>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <DatePickerField
                    control={form.control}
                    name="closingDate"
                    label={t("investment.closingDate")}
                    disabled={true}
                  />

                  <InputField
                    control={form.control}
                    name="newInvestmentAmount"
                    label={t("investment.investmentAmount")}
                    placeholder={t("investment.enterInvestmentAmount")}
                    readOnly
                  />

                  <InputField
                    control={form.control}
                    name="closingInterest"
                    label={t("investment.closingInterest")}
                    placeholder={t("investment.enterClosingInterest")}
                    type="number"
                    endContent={
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              onClick={handleCalculateClosingInterest}
                              className="p-1.5 text-xl bg-primary rounded-md text-white cursor-pointer"
                            >
                              <IoCalculator />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("investment.calculateMatureAmount")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    }
                  />

                  <InputField
                    control={form.control}
                    name="tdsAmount"
                    label={t("investment.tdsAmount")}
                    placeholder={t("investment.enterTdsAmount")}
                    type="number"
                  />

                  <InputField
                    control={form.control}
                    name="totalPayble"
                    label={t("investment.totalPayble")}
                    placeholder={t("investment.enterTotalPayble")}
                    readOnly
                  />

                  <FormField
                    control={form.control}
                    name="transMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full lg:w-fit h-fit self-end">
                        <FormLabel>
                          {t("investment.selectTransactionMode")}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bank" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t("common.bank")}
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
                    label={t("common.refVouchNo")}
                    placeholder={t("common.enterRefVouchNo")}
                  />
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
              </div>

              <Button
                type="submit"
                className="w-full sm:w-1/5 self-end"
                disabled={loading || !form.getValues("bank")}
              >
                {loading ? (
                  <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
                ) : (
                  t("common.add")
                )}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </div>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />

      <InvestmentLedger
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
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
export default InvestmentClose;
