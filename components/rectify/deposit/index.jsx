"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
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
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("deposit.rectifyDeposit")}
        </h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between mb-10"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                  <FormField
                    control={form.control}
                    name="rectifyTypeId"
                    render={({ field }) => (
                      <DropdownField
                        label={t("deposit.rectifyType")}
                        value={field.value}
                        onChange={field.onChange}
                        options={rectifyTypeData}
                        optionLabelKey="Option_Value" // Specify the key for label
                        placeholder={t("deposit.selectRectifyType")}
                        searchPlaceholder={t("deposit.searchRectifyType")}
                      />
                    )}
                  />

                  {rectifyTypeId === "124" || rectifyTypeId === "127" ? (
                    <FormField
                      control={form.control}
                      name="depositProductId"
                      render={({ field }) => (
                        <DropdownField
                          label={t("deposit.depositProduct")}
                          value={field.value}
                          onChange={field.onChange}
                          options={productTypeData}
                          optionLabelKey="Prd_SH_Name" // Specify the key for label
                          placeholder={t("deposit.selectDepositProduct")}
                          searchPlaceholder={t("deposit.searchDepositProduct")}
                        />
                      )}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </form>
          </Form>

          <div className="w-full mb-10">
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
              className="w-full h-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("deposit.basicInfoBlock")}
                  </h3>

                  {getDepositDataLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <DatePickerField
                        control={form.control}
                        name="transDate"
                        label={t("common.transactionDate")}
                        disabled
                      />

                      <FormField
                        control={form.control}
                        name="memberName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("deposit.memberName")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("deposit.enterMemberName")}
                                {...field}
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gurdianName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("deposit.gurdianName")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("deposit.enterGurdianName")}
                                {...field}
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accountNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("deposit.accountNo")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("deposit.enterAccountNo")}
                                {...field}
                                className="resize-none"
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common.amount")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("deposit.enterAmount")}
                                readOnly
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={
                    postDepositLoading
                    // insufficientBalanceDisable ||
                    // !Number(form.getValues("totalAmt")) ||
                    // Number(cashInTransactionGrandTotal) -
                    //   Number(cashOutTransactionGrandTotal) !==
                    //   Number(form.getValues("totalAmt"))
                  }
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
