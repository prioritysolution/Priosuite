"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import getCookieData from "@/utils/getCookieData";
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
import { getYear } from "date-fns";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const NewApplication = ({
  loading,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
}) => {
  const { t } = useTranslation();

  const productTypeData = useSelector(
    (state) => state.borrowingsNewApplication.productTypeData,
  );

  const repayModeData = useSelector(
    (state) => state.borrowingsNewApplication.repayModeData,
  );

  const principalLedgerData = useSelector(
    (state) => state.borrowingsNewApplication.principalLedgerData,
  );
  const interestLedgerData = useSelector(
    (state) => state.borrowingsNewApplication.interestLedgerData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");
  const beg_date = getCookieData("beg_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold text-center">
          {t("borrowings.borrowingsNewApplication")}
        </h3>

        <ScrollArea className="w-full h-full px-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-4 justify-start items-center"
              autoComplete="off"
            >
              {/* Basic Details Section */}
              <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                  <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                    {t("borrowings.basicDetails")}
                  </h4>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-3">
                  <InputField
                    control={form.control}
                    name="productName"
                    label={t("borrowings.productName")}
                    placeholder={t("borrowings.enterProductName")}
                    isRequired
                  />

                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <DropdownField
                        label={t("borrowings.productType")}
                        value={field.value}
                        onChange={field.onChange}
                        options={productTypeData}
                        optionLabelKey="Option_Value"
                        placeholder={t("borrowings.selectProductType")}
                        searchPlaceholder={t("borrowings.searchProductType")}
                        isRequired
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="repaymentMode"
                    render={({ field }) => (
                      <DropdownField
                        label={t("borrowings.repaymentMode")}
                        value={field.value}
                        onChange={field.onChange}
                        options={repayModeData}
                        optionLabelKey="Option_Value"
                        placeholder={t("borrowings.selectRepaymentMode")}
                        searchPlaceholder={t("borrowings.searchRepaymentMode")}
                        isRequired
                      />
                    )}
                  />

                  <InputField
                    control={form.control}
                    name="bankName"
                    label={t("common.bankName")}
                    placeholder={t("borrowings.enterBankName")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="accountNo"
                    label={t("common.accountNo")}
                    placeholder={t("borrowings.enterAccountNo")}
                    type="number"
                    isRequired
                  />
                  <DatePickerField
                    control={form.control}
                    name="issueDate"
                    label={t("borrowings.disbDate")}
                    startYear={
                      startDate
                        ? getYear(new Date(startDate))
                        : getYear(new Date())
                    }
                    disabledDateBefore={
                      startDate ? new Date(startDate) : undefined
                    }
                    disabledDateAfter={
                      beg_date ? new Date(beg_date) : new Date()
                    }
                    endYear={
                      beg_date
                        ? getYear(new Date(beg_date))
                        : getYear(new Date())
                    }
                    isRequired={true}
                  />

                  <InputField
                    control={form.control}
                    name="amount"
                    label={t("common.amount")}
                    placeholder={t("borrowings.enterAmount")}
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="rateOfInterest"
                    label={t("borrowings.rateOfInterest")}
                    placeholder={t("borrowings.enterRateOfInterest")}
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="overdueRate"
                    label={t("borrowings.overdueRate")}
                    placeholder={t("borrowings.enterOverdueRate")}
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="duration"
                    label={t("borrowings.durationInMonth")}
                    placeholder={t("borrowings.enterDuration")}
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="dueDate"
                    label={t("borrowings.dueDate")}
                    placeholder={t("borrowings.enterDueDate")}
                    readOnly
                  />
                  <FormField
                    control={form.control}
                    name="principalLedger"
                    render={({ field }) => (
                      <DropdownField
                        label={t("borrowings.principalLedger")}
                        value={field.value}
                        onChange={field.onChange}
                        options={principalLedgerData}
                        optionLabelKey="Ledger_Name"
                        placeholder={t("borrowings.selectLedger")}
                        searchPlaceholder={t("borrowings.searchLedger")}
                        isRequired
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interestLedger"
                    render={({ field }) => (
                      <DropdownField
                        label={t("borrowings.interestLedger")}
                        value={field.value}
                        onChange={field.onChange}
                        options={interestLedgerData}
                        optionLabelKey="Ledger_Name"
                        placeholder={t("borrowings.selectLedger")}
                        searchPlaceholder={t("borrowings.searchLedger")}
                        isRequired
                      />
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="transMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-col md:flex-row md:col-span-2 items-center space-y-0 gap-x-10 gap-y-5 border border-input rounded-md px-3 pr-10 py-3 w-full md:w-fit">
                        <FormLabel>{t("common.selectTransactionMode")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 gap-x-5"
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
                  /> */}
                </div>
              </div>

              {/* Voucher Details Section */}
              <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                  <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                    {t("common.voucherDetails")}
                  </h4>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-3">
                  <DatePickerField
                    control={form.control}
                    name="voucherDate"
                    label={t("common.voucherDate")}
                    disabled={true}
                    isRequired
                  />
                  <InputField
                    control={form.control}
                    name="particulars"
                    label={t("common.particulars")}
                    placeholder={t("common.enterParticulars")}
                    isRequired
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
                    placeholder={t("borrowings.selectBank")}
                    searchPlaceholder={t("borrowings.searchBank")}
                    isRequired
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-1/5 self-end"
                disabled={loading}
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
    </div>
  );
};
export default NewApplication;
