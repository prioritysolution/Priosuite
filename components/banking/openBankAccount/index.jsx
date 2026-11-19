"use client";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import getCookieData from "@/utils/getCookieData";
import { useTranslation } from "react-i18next";

const OpenBankAccount = ({ loading, form, handleSubmit }) => {
  const { t } = useTranslation();
  const accountTypeData = useSelector(
    (state) => state?.openBankAccount?.bankAccountTypeData,
  );

  const bankGlData = useSelector((state) => state?.openBankAccount?.bankGlData);

  const beg_date = getCookieData("beg_date");
  const accountType = form.watch("accountType");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold self-center">
          {t("bank.openBankAccount")}
        </h3>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-3"
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
                    name="openingDate"
                    label={t("bank.openingDate")}
                    defaultValue={new Date(beg_date)}
                    disabled={true}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="bankName"
                    label={t("bank.bankName")}
                    placeholder={t("bank.enterBankName")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="bankBranch"
                    label={t("bank.bankBranch")}
                    placeholder={t("bank.enterBankBranch")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="ifscCode"
                    label={t("bank.ifscCode")}
                    placeholder={t("bank.enterIfscCode")}
                    maxLength={11}
                    isUpper={true}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="accountNo"
                    label={t("bank.accountNo")}
                    placeholder={t("bank.enterAccountNo")}
                    type="number"
                    maxLength={15}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="accountType"
                    label={t("bank.accountType")}
                    options={accountTypeData}
                    optionLabelKey="Option_Value"
                    placeholder={t("bank.selectAccountType")}
                    searchPlaceholder={t("bank.searchAccountType")}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="bankGl"
                    label={t("bank.bankGl")}
                    options={bankGlData}
                    optionLabelKey="Ledger_Name"
                    optionValueKey="Id"
                    placeholder={t("bank.selectBankGl")}
                    searchPlaceholder={t("bank.searchBankGl")}
                    disabled={
                      !accountType || !(bankGlData && bankGlData.length > 0)
                    }
                    isRequired
                  />
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
                    t("common.add")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
};

export default OpenBankAccount;
