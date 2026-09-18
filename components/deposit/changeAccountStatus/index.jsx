"use client";


import { useTranslation } from "react-i18next";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import DropdownField from "@/common/formFields/DropdownField";
import AccountSearchForm from "@/common/forms/AccountSearchForm";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipLoader } from "react-spinners";

const ChangeAccountStatus = ({
  loading,
  getDepositLoading,
  updateAccountStatusLoading,
  form,
  handleSubmit,
  handleAccountFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  depositProduct,
  resetTrigger,
  statusListData,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold ">{t("deposit.changeAccountStatus.title")}</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10">
          <div className="w-full mb-2">
            <AccountSearchForm
              loading={getDepositLoading}
              handleSubmit={handleAccountFormSubmit}
              resetTrigger={resetTrigger}
              allowAlphanumeric
            />
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-2 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("deposit.sections.accountDetails")}
                  </h3>
                  {getDepositLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
                      {Array.from({ length: 13 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-col gap-[10px]"
                        >
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
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
                        label={t("deposit.fields.cifNo")}
                        placeholder={t("deposit.placeholders.cifNo")}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="accountNo"
                        label={t("deposit.fields.accountNo")}
                        placeholder={t("deposit.placeholders.accountNo")}
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
                        name="gurdianName"
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
                        name="currentStatus"
                        label={t("deposit.changeAccountStatus.currentStatus")}
                        placeholder={t("deposit.placeholders.memberNo")}
                        readOnly
                      />

                      <DropdownField
                        control={form.control}
                        name="newStatus"
                        label={t("deposit.changeAccountStatus.newStatus")}
                        options={statusListData}
                        optionLabelKey="Option_Value"
                        placeholder={t("deposit.changeAccountStatus.selectNewStatus")}
                        searchPlaceholder={t("deposit.changeAccountStatus.selectNewStatus")}
                        isRequired
                      />
                    </div>
                  )}
                </div>
              )}
              {visibleBlock && (
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={updateAccountStatusLoading}
                >
                  {updateAccountStatusLoading ? (
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
export default ChangeAccountStatus;
