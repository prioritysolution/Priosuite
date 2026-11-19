"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import BankLedger from "@/common/ledger/bankLedger/BankLedger";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
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

  const senderBankAccount = form.watch("senderBankAccount");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold self-center">
          {t("bank.bankTransfer")}
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
                  <DatePickerField
                    control={form.control}
                    name="transferDate"
                    label={t("bank.transferDate")}
                    disabled
                  />

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
                        disabled={!senderBankAccount}
                      />
                    )}
                  />

                  <InputField
                    control={form.control}
                    name="transferAmount"
                    label={t("common.amount")}
                    placeholder={t("bank.enterAmount")}
                    type="number"
                    readOnly={!senderBankAccount}
                  />

                  <div className="lg:col-span-2">
                    <InputField
                      control={form.control}
                      name="totalTransferInWords"
                      label={t("bank.totalAmountInWords")}
                      placeholder={t("bank.totalAmountInWordsPlaceholder")}
                      className="text-red-500 font-medium text-sm"
                      readOnly
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
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
    </div>
  );
};

export default Transfer;
