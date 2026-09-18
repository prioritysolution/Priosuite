"use client";

import { useTranslation } from "react-i18next";

import DropdownField from "@/common/formFields/DropdownField";
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
import TextareaField from "@/common/formFields/TextareaField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const DepositAgent = ({ loading, handleSubmit, form }) => {
  const { t } = useTranslation();

  const paymentTypeData = useSelector(
    (state) => state?.depositAgent?.paymentTypeData
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold">{t("master.depositAgent.title")}</h3>
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
                    name="agentName"
                    label={t("master.depositAgent.fields.agentName")}
                    placeholder={t("master.depositAgent.placeholders.agentName")}
                  />

                  <TextareaField
                    control={form.control}
                    name="address"
                    label={t("master.depositAgent.fields.address")}
                    placeholder={t("master.depositAgent.placeholders.address")}
                    className="resize-none"
                  />

                  <InputField
                    control={form.control}
                    name="mobile"
                    label={t("master.depositAgent.fields.mobileNo")}
                    placeholder={t("master.depositAgent.placeholders.mobileNo")}
                    type="number"
                    onInput={(e) => {
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }}
                  />

                  <InputField
                    control={form.control}
                    name="email"
                    label={t("master.depositAgent.fields.email")}
                    placeholder={t("master.depositAgent.placeholders.email")}
                    type="email"
                  />

                  <InputField
                    control={form.control}
                    name="depositAmount"
                    label={t("master.depositAgent.fields.depositAmount")}
                    placeholder={t("master.depositAgent.placeholders.depositAmount")}
                    type="number"
                  />

                  <InputField
                    control={form.control}
                    name="maximumDays"
                    label={t("master.depositAgent.fields.maximumDays")}
                    placeholder={t("master.depositAgent.placeholders.maximumDays")}
                    type="number"
                  />

                  <InputField
                    control={form.control}
                    name="maximumDeposit"
                    label={t("master.depositAgent.fields.maximumDeposit")}
                    placeholder={t("master.depositAgent.placeholders.maximumDeposit")}
                    type="number"
                  />

                  <DropdownField
                    control={form.control}
                    name="paymentType"
                    label={t("master.depositAgent.fields.paymentType")}
                    options={paymentTypeData}
                    optionLabelKey="Option_Value"
                    placeholder={t("master.depositAgent.placeholders.paymentType")}
                    searchPlaceholder={t("master.depositAgent.placeholders.searchPaymentType")}
                  />

                  <InputField
                    control={form.control}
                    name="payoutAmount"
                    label={t("master.depositAgent.fields.payoutAmount")}
                    placeholder={t("master.depositAgent.placeholders.payoutAmount")}
                    type="number"
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
                  t("master.depositAgent.buttons.add")
                )}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
};
export default DepositAgent;
