"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import getCookieData from "@/utils/getCookieData";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getYear } from "date-fns";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const BorrowingsOpening = ({
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

  const startDate = getCookieData("fin_start_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("opening.borrowingsOpening.title")}
        </h3>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                  <InputField
                    control={form.control}
                    name="productName"
                    label={t("opening.borrowingsOpening.fields.productName")}
                    placeholder={t("opening.borrowingsOpening.placeholders.productName",
                    )}
                    isRequired
                  />

                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <DropdownField
                        label={t("opening.borrowingsOpening.fields.productType")}
                        value={field.value}
                        onChange={field.onChange}
                        options={productTypeData}
                        optionLabelKey="Option_Value"
                        placeholder={t("opening.borrowingsOpening.placeholders.productType",
                        )}
                        searchPlaceholder={t("opening.borrowingsOpening.placeholders.searchProductType",
                        )}
                        isRequired
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="repaymentMode"
                    render={({ field }) => (
                      <DropdownField
                        label={t("opening.borrowingsOpening.fields.repaymentMode")}
                        value={field.value}
                        onChange={field.onChange}
                        options={repayModeData}
                        optionLabelKey="Option_Value"
                        placeholder={t("opening.borrowingsOpening.placeholders.repaymentMode",
                        )}
                        searchPlaceholder={t("opening.borrowingsOpening.placeholders.searchRepaymentMode",
                        )}
                        isRequired
                      />
                    )}
                  />

                  <InputField
                    control={form.control}
                    name="bankName"
                    label={t("opening.borrowingsOpening.fields.bankName")}
                    placeholder={t("opening.borrowingsOpening.placeholders.bankName")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="accountNo"
                    label={t("opening.borrowingsOpening.fields.accountNo")}
                    placeholder={t("opening.borrowingsOpening.placeholders.accountNo")}
                    type="number"
                    maxLength={15}
                    isRequired
                  />

                  <DatePickerField
                    control={form.control}
                    name="issueDate"
                    label={t("opening.borrowingsOpening.fields.issueDate")}
                    endYear={getYear(new Date(startDate))}
                    disabledDateAfter={new Date(startDate).setDate(
                      new Date(startDate).getDate() - 1,
                    )}
                    isBackDate={true}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="amount"
                    label={t("opening.borrowingsOpening.fields.amount")}
                    placeholder={t("opening.borrowingsOpening.placeholders.amount")}
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="rateOfInterest"
                    label={t("opening.borrowingsOpening.fields.rateOfInterest")}
                    placeholder={t("opening.borrowingsOpening.placeholders.rateOfInterest",
                    )}
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="overdueRate"
                    label={t("opening.borrowingsOpening.fields.overdueRate")}
                    placeholder={t("opening.borrowingsOpening.placeholders.overdueRate",
                    )}
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="duration"
                    label={t("opening.borrowingsOpening.fields.duration")}
                    placeholder={t("opening.borrowingsOpening.placeholders.duration")}
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="dueDate"
                    label={t("opening.borrowingsOpening.fields.dueDate")}
                    placeholder={t("opening.borrowingsOpening.placeholders.dueDate")}
                    readOnly
                  />

                  <FormField
                    control={form.control}
                    name="principalLedger"
                    render={({ field }) => (
                      <DropdownField
                        label={t("opening.borrowingsOpening.fields.principalLedger")}
                        value={field.value}
                        onChange={field.onChange}
                        options={principalLedgerData}
                        optionLabelKey="Ledger_Name"
                        placeholder={t("opening.borrowingsOpening.placeholders.principalLedger",
                        )}
                        searchPlaceholder={t("opening.borrowingsOpening.placeholders.searchPrincipalLedger",
                        )}
                        isRequired
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interestLedger"
                    render={({ field }) => (
                      <DropdownField
                        label={t("opening.borrowingsOpening.fields.interestLedger")}
                        value={field.value}
                        onChange={field.onChange}
                        options={interestLedgerData}
                        optionLabelKey="Ledger_Name"
                        placeholder={t("opening.borrowingsOpening.placeholders.interestLedger",
                        )}
                        searchPlaceholder={t("opening.borrowingsOpening.placeholders.searchInterestLedger",
                        )}
                        isRequired
                      />
                    )}
                  />

                  <InputField
                    control={form.control}
                    name="outstandingBalance"
                    label={t("opening.borrowingsOpening.fields.outstandingBalance")}
                    placeholder={t("opening.borrowingsOpening.placeholders.outstandingBalance",
                    )}
                    type="number"
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
                  <ClipLoader
                    color="#d7e6f4"
                    size={20}
                    speedMultiplier={0.7}
                  />
                ) : (
                  t("opening.borrowingsOpening.buttons.add")
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
export default BorrowingsOpening;
