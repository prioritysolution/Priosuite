"use client";

import { useTranslation } from "react-i18next";

import DropdownField from "@/common/formFields/DropdownField";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import getCookieData from "@/utils/getCookieData";

const DepositAgent = ({
  loading,
  getMemberDataLoading,
  visibleBlock,
  resetTrigger,
  handleSubmit,
  handleMemberFormSubmit,
  form,
}) => {
  const { t } = useTranslation();
  const branchId = getCookieData("userBranchId");
  const memberBranchId = form.watch("BranchId");
  const isDifferentBranch =
    memberBranchId != null &&
    String(memberBranchId).trim() !== "" &&
    String(memberBranchId) !== String(branchId ?? "");

  const paymentTypeData = useSelector(
    (state) => state?.depositAgent?.paymentTypeData
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <div className="w-full">
          <MemberSearchForm
            handleSubmit={handleMemberFormSubmit}
            loading={getMemberDataLoading}
            resetTrigger={resetTrigger}
            formLabel={t("master.depositAgent.title")}
            // showDateFix={true}
          />
        </div>
        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("membership.issueMembership.sections.basicInfoBlock")}
                    </h4>
                  </div>
                  {getMemberDataLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="w-full flex flex-col gap-2.5">
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                      <InputField
                        control={form.control}
                        name="memberNo"
                        label={t("membership.issueMembership.fields.memberNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="cifNo"
                        label={t("membership.issueMembership.fields.cifNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="memberName"
                        label={t("membership.issueMembership.fields.memberName")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label={t("membership.issueMembership.fields.gurdianName")}
                        readOnly
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("membership.issueMembership.fields.address")}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="resize-none"
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <InputField
                        control={form.control}
                        name="mobile"
                        label={t("membership.issueMembership.fields.mobileNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="branchName"
                        label={t("membership.issueMembership.fields.branchName")}
                        readOnly
                        className={
                          isDifferentBranch
                            ? "border-red-500 bg-red-50 [&_input]:text-red-600"
                            : ""
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("master.depositAgent.sections.agentDetails")}
                    </h4>
                  </div>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
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
              )}
              {visibleBlock && (
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
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
};
export default DepositAgent;
