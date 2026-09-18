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
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const ShareProduct = ({ loading, form, handleSubmit }) => {
  const { t } = useTranslation();

  const memberTypeData = useSelector(
    (state) => state?.shareProduct?.memberTypeData,
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold">{t("master.shareProduct.title")}</h3>
        <div className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                  <DropdownField
                    control={form.control}
                    name="memberType"
                    label={t("master.shareProduct.fields.memberType")}
                    options={memberTypeData}
                    optionLabelKey="Option_Value"
                    placeholder={t("master.shareProduct.placeholders.memberType")}
                    searchPlaceholder={t("master.shareProduct.placeholders.searchMemberType")}
                  />

                  <InputField
                    control={form.control}
                    name="admissionFees"
                    label={t("master.shareProduct.fields.admissionFees")}
                    placeholder={t("master.shareProduct.placeholders.admissionFees")}
                    type="number"
                  />

                  <InputField
                    control={form.control}
                    name="ratePerShare"
                    label={t("master.shareProduct.fields.ratePerShare")}
                    placeholder={t("master.shareProduct.placeholders.ratePerShare")}
                    type="number"
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
                    t("master.shareProduct.buttons.add")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default ShareProduct;
