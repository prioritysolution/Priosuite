"use client";
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

const BankOpening = ({ loading, form, handleSubmit }) => {
  const { t } = useTranslation();
  const accountTypeData = useSelector(
    (state) => state?.openBankAccount?.bankAccountTypeData
  );

  const bankGlData = useSelector((state) => state?.openBankAccount?.bankGlData);

  const startDate = getCookieData("fin_start_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("opening.bankOpening.title")}
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
                  <DatePickerField
                    control={form.control}
                    name="openingDate"
                    label={t("opening.bankOpening.fields.openingDate")}
                    endYear={getYear(new Date(startDate))}
                    disabledDateAfter={new Date(startDate).setDate(
                      new Date(startDate).getDate() - 1
                    )}
                    isBackDate={true}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="bankName"
                    label={t("opening.bankOpening.fields.bankName")}
                    placeholder={t("opening.bankOpening.placeholders.bankName")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="bankBranch"
                    label={t("opening.bankOpening.fields.bankBranch")}
                    placeholder={t("opening.bankOpening.placeholders.bankBranch")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="ifscCode"
                    label={t("opening.bankOpening.fields.ifscCode")}
                    placeholder={t("opening.bankOpening.placeholders.ifscCode")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="accountNo"
                    label={t("opening.bankOpening.fields.accountNo")}
                    placeholder={t("opening.bankOpening.placeholders.accountNo")}
                    type="number"
                    // maxLength={15}
                    isRequired
                  />

                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <DropdownField
                        label={t("opening.bankOpening.fields.accountType")}
                        value={field.value}
                        onChange={field.onChange}
                        options={accountTypeData}
                        optionLabelKey="Option_Value"
                        placeholder={t("opening.bankOpening.placeholders.accountType")}
                        searchPlaceholder={t("opening.bankOpening.placeholders.searchAccountType"
                        )}
                        isRequired
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankGl"
                    render={({ field }) => (
                      <DropdownField
                        label={t("opening.bankOpening.fields.bankGl")}
                        value={field.value}
                        onChange={field.onChange}
                        options={bankGlData}
                        optionLabelKey="Ledger_Name"
                        placeholder={t("opening.bankOpening.placeholders.bankGl")}
                        searchPlaceholder={t("opening.bankOpening.placeholders.searchBankGl"
                        )}
                        isRequired
                      />
                    )}
                  />

                  <InputField
                    control={form.control}
                    name="openingBalance"
                    label={t("opening.bankOpening.fields.openingBalance")}
                    placeholder={t("opening.bankOpening.placeholders.openingBalance")}
                    type="number"
                    isRequired
                  />
                </div>
              </div>

              <Button type="submit" className="w-full sm:w-1/5 self-end" disabled={loading}>
                {loading ? (
                  <ClipLoader
                    color="#d7e6f4"
                    size={20}
                    speedMultiplier={0.7}
                  />
                ) : (
                  t("opening.bankOpening.buttons.add")
                )}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
};
export default BankOpening;
