"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const Provision = ({
  loading,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
}) => {
  const { t } = useTranslation();

  const ledgerListData = useSelector(
    (state) => state?.voucherEntry?.ledgerList
  );

  const provisionTypeOptions = [
    { Id: "C", Option_Value: "Cr" },
    { Id: "D", Option_Value: "Dr" },
  ];

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="w-full text-center text-2xl font-semibold">
          {t("provision.provision")}
        </h3>
        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-4 justify-between"
              autoComplete="off"
            >
              <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                  <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                    {t("provision.provision")}
                  </h3>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <DatePickerField
                    control={form.control}
                    name="date"
                    label={t("common.date")}
                    disabled
                    isRequired={true}
                  />

                  <DropdownField
                    control={form.control}
                    name="ledger"
                    label={t("common.ledger")}
                    options={ledgerListData || []}
                    optionLabelKey="Ledger_Name"
                    placeholder={t("provision.selectLedger")}
                    searchPlaceholder={t("provision.searchLedger")}
                    isRequired={true}
                  />

                  <DropdownField
                    control={form.control}
                    name="provisionType"
                    label={t("provision.provisionType")}
                    options={provisionTypeOptions}
                    placeholder={t("provision.selectProvisionType")}
                    searchPlaceholder={t("provision.searchProvisionType")}
                    isRequired={true}
                  />

                  <InputField
                    control={form.control}
                    name="percent"
                    label={t("provision.provisionPercent")}
                    placeholder={t("provision.enterProvisionPercent")}
                    type="number"
                  />

                  <InputField
                    control={form.control}
                    name="amount"
                    label={t("provision.provisionAmount")}
                    placeholder={t("provision.enterProvisionAmount")}
                    type="number"
                  />
                </div>
              </div>
              <Button className="self-end w-full sm:w-1/5" type="submit">
                {loading ? (
                  <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
                ) : (
                  t("common.post")
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
export default Provision;
