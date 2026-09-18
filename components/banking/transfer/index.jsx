"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import BankLedger from "@/common/ledger/bankLedger/BankLedger";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { getYear } from "date-fns";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import getCookieData from "@/utils/getCookieData";
import { useTranslation } from "react-i18next";

const Transfer = ({
  loading,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  sendersAvailableBalance,
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
}) => {
  const { t } = useTranslation();

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-black p-5 gap-5 overflow-hidden">
      <h3 className="text-2xl font-semibold text-center">
        {t("bank.bankTransfer")}
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
                {/* Transfer Date */}
                <DatePickerField
                  control={form.control}
                  name="transferDate"
                  label={t("bank.transferDate")}
                  disabled
                />

                {/* Sender Bank Account */}
                <div className="flex flex-col gap-1 w-full">
                  <FormField
                    control={form.control}
                    name="senderBankAccount"
                    render={({ field }) => (
                      <DropdownField
                        label={t("bank.senderBankAccount")}
                        value={field.value}
                        onChange={field.onChange}
                        options={bankAccountData}
                        optionLabelKey="Bank_Name"
                        placeholder={t("bank.selectBankAccount")}
                        searchPlaceholder={t("bank.searchBankAccount")}
                      />
                    )}
                  />

                  {sendersAvailableBalance !== null && (
                    <span className="text-xs font-semibold text-slate-500 mt-1">
                      {t("bank.availableBalance")}:{" "}
                      <span className="text-green-600">
                        {sendersAvailableBalance}
                      </span>
                    </span>
                  )}
                </div>

                {/* Receiver Bank Account */}
                <FormField
                  control={form.control}
                  name="receiverBankAccount"
                  render={({ field }) => (
                    <DropdownField
                      label={t("bank.receiverBankAccount")}
                      value={field.value}
                      onChange={field.onChange}
                      options={
                        bankAccountData && bankAccountData.length > 0
                          ? bankAccountData.filter(
                              ({ Id }) =>
                                Id.toString() !==
                                form.getValues("senderBankAccount"),
                            )
                          : []
                      }
                      optionLabelKey="Bank_Name"
                      placeholder={t("bank.selectBankAccount")}
                      searchPlaceholder={t("bank.searchBankAccount")}
                      disabled={!form.getValues("senderBankAccount")}
                    />
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="transferAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common.amount")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("bank.enterAmount")}
                          type="number"
                          readOnly={!form.getValues("senderBankAccount")}
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Total Amount In Words */}
                <FormField
                  control={form.control}
                  name="totalTransferInWords"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        {t("bank.totalAmountInWords")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("bank.totalAmountInWordsPlaceholder")}
                          readOnly
                          {...field}
                          className="h-10 text-red-500 font-medium text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Action */}
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-40 h-10 font-semibold"
                  disabled={
                    loading ||
                    (sendersAvailableBalance &&
                      Number(sendersAvailableBalance) <= 0)
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
        toDate={form.getValues("transferDate")}
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

export default Transfer;
