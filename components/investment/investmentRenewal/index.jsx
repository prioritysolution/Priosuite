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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getYear } from "date-fns";
import { IoPrint, IoCalculator } from "react-icons/io5";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import getCookieData from "@/utils/getCookieData";
import { useTranslation } from "react-i18next";

const InvestmentRenewal = ({
  loading,
  form,
  handleSubmit,
  handleCalculateMatureAmount,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  disableRenwal,
  isTdsEnabled,
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

  const interestTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentInterestTypeData,
  );

  const durationTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentDurationData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");
  const matureAmountValue = form.watch("matureAmount");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("investment.investmentRenewal")}
        </h3>

        <ScrollArea className="w-full h-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              <div className="w-full flex items-center justify-start border border-primary rounded-lg p-5 gap-5">
                <div className="flex items-center gap-5 w-1/2">
                  <DropdownField
                    control={form.control}
                    name="accountNo"
                    label={t("common.accountNo")}
                    options={investmentAccountData}
                    optionLabelKey="Accout_No"
                    placeholder={t("investment.selectAccountNo")}
                    searchPlaceholder={t("investment.searchAccountNo")}
                  />

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={handleShowLedger}
                          className={cn(
                            "p-2 px-5 text-2xl bg-primary rounded-md text-white cursor-pointer mt-8",
                            {
                              "bg-gray-500 cursor-not-allowed":
                                !form.getValues("accountNo"),
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
              </div>

              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
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

                  <InputField
                    control={form.control}
                    name="interestAmount"
                    label={t("investment.interestAmount")}
                    placeholder={t("investment.enterInterestAmount")}
                    readOnly
                  />
                </div>
              </div>

              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <h3 className="w-full text-center text-xl font-semibold">
                  {t("investment.renewalInfoBlock")}
                </h3>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <DatePickerField
                    control={form.control}
                    name="renewalDate"
                    label={t("investment.renewalDate")}
                    disabled={true}
                  />

                  <InputField
                    control={form.control}
                    name="effectDate"
                    label={t("investment.effectDate")}
                    placeholder={t("investment.enterEffectDate")}
                    readOnly
                  />

                  <DropdownField
                    control={form.control}
                    name="interestType"
                    label={t("investment.interestType")}
                    options={interestTypeData}
                    optionLabelKey="Option_Value"
                    placeholder={t("investment.selectInterestType")}
                    searchPlaceholder={t("investment.searchInterestType")}
                  />

                  <InputField
                    control={form.control}
                    name="duration"
                    label={t("investment.duration")}
                    placeholder={t("investment.enterDuration")}
                    type="number"
                    min={0}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="durtype"
                    label={t("investment.durationType")}
                    options={durationTypeData}
                    optionLabelKey="Option_Value"
                    placeholder={t("investment.selectDurationType")}
                    searchPlaceholder={t("investment.searchDurationType")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="newRateOfInterest"
                    label={t("investment.rateOfInterest")}
                    placeholder={t("investment.enterRateOfInterest")}
                    type="number"
                  />

                  <InputField
                    control={form.control}
                    name="tdsAmount"
                    label={t("investment.tdsAmount")}
                    placeholder={t("investment.enterTdsAmount")}
                    type="number"
                    disabled={!isTdsEnabled}
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
                    name="matureDate"
                    label={t("investment.matureDate")}
                    placeholder={t("investment.matureDatePlaceholder")}
                    readOnly
                    displayValue={form.watch("matureDate") || ""}
                  />

                  <FormField
                    control={form.control}
                    name="matureAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("investment.matureAmount")}
                          <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <Input
                              placeholder={t("investment.enterMatureAmount")}
                              type="number"
                              name={field.name}
                              ref={field.ref}
                              onBlur={field.onBlur}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    onClick={handleCalculateMatureAmount}
                                    className="p-2 text-2xl bg-primary rounded-md text-white cursor-pointer"
                                  >
                                    <IoCalculator />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t("investment.calculateMatureAmount")}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className=" w-full md:w-1/3 self-end"
                disabled={
                  disableRenwal ||
                  loading ||
                  !(Number(matureAmountValue) > 0)
                }
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
export default InvestmentRenewal;
