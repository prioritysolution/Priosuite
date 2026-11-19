"use client";

import MemberSearchForm from "@/common/forms/MemberSearchForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { useTranslation } from "react-i18next";

const Membership = ({
  loading,
  getMemberDataLoading,
  postMembershipLoading,
  form,
  handleSubmit,
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  resetTrigger,
}) => {
  const { t } = useTranslation();

  const rectifyTypeData = useSelector(
    (state) => state?.rectifyMembership?.rectifyTypeData
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("membership.rectifyMembership")}
        </h3>

        <ScrollArea className="w-full h-full">
          <div className="flex flex-col gap-4 px-1 sm:px-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full flex flex-col gap-4"
                autoComplete="off"
              >
                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("membership.rectifyType")}
                    </h4>
                  </div>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                    <DropdownField
                      control={form.control}
                      name="rectifyTypeId"
                      label={t("membership.rectifyType")}
                      options={rectifyTypeData}
                      optionLabelKey="Option_Value"
                      placeholder={t("membership.selectRectifyType")}
                      searchPlaceholder={t("membership.searchRectifyType")}
                      isRequired
                    />
                  </div>
                </div>
              </form>
            </Form>

            <div className="w-full">
              <MemberSearchForm
                handleSubmit={handleMemberFormSubmit}
                loading={getMemberDataLoading}
                resetTrigger={resetTrigger}
              />
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full flex flex-col gap-4"
                autoComplete="off"
              >
                {visibleBlock && (
                  <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                    <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                      <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                        {t("membership.basicInfoBlock")}
                      </h4>
                    </div>

                    {getMemberDataLoading ? (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div key={index} className="w-full flex flex-col gap-[10px]">
                            <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                            <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                        <DatePickerField
                          control={form.control}
                          name="transDate"
                          label={t("common.transactionDate")}
                          disabled
                        />

                        <InputField
                          control={form.control}
                          name="memberName"
                          label={t("membership.memberName")}
                          placeholder={t("membership.enterMemberName")}
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="gurdianName"
                          label={t("membership.gurdianName")}
                          placeholder={t("membership.enterGurdianName")}
                          readOnly
                        />

                        <TextareaField
                          control={form.control}
                          name="address"
                          label={t("common.address")}
                          placeholder={t("membership.enterAddress")}
                          readOnly
                          rows={2}
                        />

                        <InputField
                          control={form.control}
                          name="transMode"
                          label={t("common.transMode")}
                          placeholder={t("membership.enterTransMode")}
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="amount"
                          label={t("common.amount")}
                          placeholder={t("membership.enterAmount")}
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                )}

                {visibleBlock && (
                  <Button
                    type="submit"
                    className="w-full sm:w-1/5 self-end"
                    disabled={postMembershipLoading}
                  >
                    {postMembershipLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      t("membership.rectify")
                    )}
                  </Button>
                )}
              </form>
            </Form>
          </div>
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
export default Membership;
