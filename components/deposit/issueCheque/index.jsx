"use client";

import { useTranslation } from "react-i18next";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import AccountSearchForm from "@/common/forms/AccountSearchForm";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormMessage } from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ClipLoader } from "react-spinners";

const IssueCheque = ({
  loading,
  getAccountLoading,
  postIssueChequeLoading,
  form,
  handleSubmit,
  handleAccountFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  resetTrigger,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">{t("deposit.issueCheque.title")}</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <div className="w-full mb-10">
            <AccountSearchForm
              loading={getAccountLoading}
              handleSubmit={handleAccountFormSubmit}
              resetTrigger={resetTrigger}
              allowAlphanumeric
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("deposit.sections.accountDetails")}
                  </h3>
                  <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="accountNo"
                      label={t("deposit.fields.accountNo")}
                      placeholder={t("deposit.placeholders.accountNo")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="refAccountNo"
                      label={t("deposit.fields.refAccountNo")}
                      placeholder={t("deposit.placeholders.refAccountNo")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="memberNo"
                      label={t("deposit.fields.memberNo")}
                      placeholder={t("deposit.placeholders.memberNo")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="cifNo"
                      label={t("deposit.fields.cifNoDot")}
                      placeholder={t("deposit.placeholders.cifNo")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="memberName"
                      label={t("deposit.fields.memberName")}
                      placeholder={t("deposit.placeholders.memberName")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="guardianName"
                      label={t("deposit.fields.guardianName")}
                      placeholder={t("deposit.placeholders.guardianName")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="mobile"
                      label={t("deposit.fields.mobileNo")}
                      placeholder={t("deposit.placeholders.mobileNo")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="availableBalance"
                      label={t("deposit.fields.availableBalance")}
                      placeholder={t("deposit.placeholders.availableBalance")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="operationMode"
                      label={t("deposit.fields.operationMode")}
                      placeholder={t("deposit.placeholders.operationMode")}
                      readOnly
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("deposit.sections.chequeDetails")}
                  </h3>
                  <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="fromNo"
                      label={t("deposit.fields.fromNo")}
                      placeholder={t("deposit.placeholders.fromNo")}
                      type="number"
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="toNo"
                      label={t("deposit.fields.toNo")}
                      placeholder={t("deposit.placeholders.toNo")}
                      type="number"
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="noOfLeaves"
                      label={t("deposit.fields.noOfLeaves")}
                      placeholder={t("deposit.placeholders.noOfLeaves")}
                      readOnly
                    />
                    <InputField
                      control={form.control}
                      name="chargeAmount"
                      label={t("deposit.fields.chargeAmount")}
                      placeholder={t("deposit.placeholders.chargeAmount")}
                      type="number"
                    />

                    <TextareaField
                      control={form.control}
                      name="amountInWords"
                      label={t("deposit.fields.amountInWords")}
                      placeholder={t("deposit.placeholders.totalAmount")}
                      className="text-red-500 text-base resize-none"
                      readOnly
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <Button type="submit" className="w-full sm:w-1/5 self-end">
                  {postIssueChequeLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("common.buttons.save")
                  )}
                </Button>
              )}
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
export default IssueCheque;
