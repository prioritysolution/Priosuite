"use client";

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
import AccountSearchForm from "@/common/forms/AccountSearchForm";
import { useTranslation } from "react-i18next";

const Deposit = ({
  loading,
  getDepositDataLoading,
  postDepositLoading,
  form,
  handleSubmit,
  handleDepositFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  resetTrigger,
  rectifyTypeId,
}) => {
  const { t } = useTranslation();

  const rectifyTypeData = useSelector(
    (state) => state?.rectifyDeposit?.rectifyTypeData
  );

  const productTypeData = useSelector(
    (state) => state?.depositReport?.productTypeData
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("deposit.rectifyDeposit")}
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
                      {t("deposit.rectifyType")}
                    </h4>
                  </div>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                    <DropdownField
                      control={form.control}
                      name="rectifyTypeId"
                      label={t("deposit.rectifyType")}
                      options={rectifyTypeData}
                      optionLabelKey="Option_Value"
                      placeholder={t("deposit.selectRectifyType")}
                      searchPlaceholder={t("deposit.searchRectifyType")}
                      isRequired
                    />

                    {(rectifyTypeId === "124" || rectifyTypeId === "127") && (
                      <DropdownField
                        control={form.control}
                        name="depositProductId"
                        label={t("deposit.depositProduct")}
                        options={productTypeData}
                        optionLabelKey="Prd_SH_Name"
                        placeholder={t("deposit.selectDepositProduct")}
                        searchPlaceholder={t("deposit.searchDepositProduct")}
                      />
                    )}
                  </div>
                </div>
              </form>
            </Form>

            <div className="w-full">
              <AccountSearchForm
                handleSubmit={handleDepositFormSubmit}
                loading={getDepositDataLoading}
                resetTrigger={resetTrigger}
                showDate={false}
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
                        {t("deposit.basicInfoBlock")}
                      </h4>
                    </div>

                    {getDepositDataLoading ? (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
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
                          label={t("deposit.memberName")}
                          placeholder={t("deposit.enterMemberName")}
                          readOnly
                        />

                        <InputField
                          control={form.control}
                          name="gurdianName"
                          label={t("deposit.gurdianName")}
                          placeholder={t("deposit.enterGurdianName")}
                          readOnly
                        />

                        <TextareaField
                          control={form.control}
                          name="accountNo"
                          label={t("deposit.accountNo")}
                          placeholder={t("deposit.enterAccountNo")}
                          readOnly
                          rows={2}
                        />

                        <InputField
                          control={form.control}
                          name="amount"
                          label={t("common.amount")}
                          placeholder={t("deposit.enterAmount")}
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
                    disabled={postDepositLoading}
                  >
                    {postDepositLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      t("deposit.rectify")
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
export default Deposit;
