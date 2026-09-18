"use client";

import { useTranslation } from "react-i18next";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const DemandMaster = ({ loading }) => {
  const { t } = useTranslation();

  const form = useForm();
  const handleSubmit = () => {};
  const successMessage = "";
  const showSuccessMessage = false;
  const handleCloseSuccessMessage = () => {};

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData
  );

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">{t("master.demandMaster.title")}</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between items-center"
              autoComplete="off"
            >
              <div className="w-full xl:w-1/2 h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <DropdownField
                  control={form.control}
                  name="loanProduct"
                  label={t("master.demandMaster.fields.loanProduct")}
                  options={bankAccountData}
                  optionLabelKey="Bank_Name"
                  placeholder={t("master.demandMaster.placeholders.loanProduct")}
                  searchPlaceholder={t("master.demandMaster.placeholders.searchLoanProduct")}
                />

                <DropdownField
                  control={form.control}
                  name="depositProduct"
                  label={t("master.demandMaster.fields.depositProduct")}
                  options={bankAccountData}
                  optionLabelKey="Bank_Name"
                  placeholder={t("master.demandMaster.placeholders.depositProduct")}
                  searchPlaceholder={t("master.demandMaster.placeholders.searchDepositProduct")}
                />

                <Button
                  type="submit"
                  className="w-full"
                  // disabled={
                  //   Number(cashInTransactionGrandTotal) -
                  //     Number(cashOutTransactionGrandTotal) !==
                  //   Number(form.getValues("openingAmount"))
                  // }
                >
                  {t("master.demandMaster.buttons.add")}
                </Button>
              </div>
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
export default DemandMaster;
