"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import getCookieData from "@/utils/getCookieData";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { getYear } from "date-fns";

const LoanOpening = ({
  loading,
  addLoanAccountLoading,
  checkLoanEligibleLoading,
  form,
  handleSubmit,
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  amountErrorMessage,
  showEmi,
  loanEligible,
  resetTrigger,
}) => {
  const { t } = useTranslation();
  const [showBasicInfo, setShowBasicInfo] = useState(true);
  const productData = useSelector(
    (state) => state?.newApplication?.loanProductData,
  );

  const durationUnitData = useSelector(
    (state) => state?.newApplication?.durationUnitData,
  );

  const repaymentModeData = useSelector(
    (state) => state?.newApplication?.repaymentModeData,
  );

  const startDate = getCookieData("fin_start_date");

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("opening.loanOpening.title")}
        </h3>

        <ScrollArea className="w-full h-full">
          <div className="w-full mb-5">
            <MemberSearchForm
              handleSubmit={handleMemberFormSubmit}
              showDate
              loanDateRange={startDate}
              loading={loading}
              resetTrigger={resetTrigger}
              endYear={getYear(new Date(startDate))}
              disabledDateAfter={new Date(startDate).setDate(
                new Date(startDate).getDate() - 1,
              )}
              onPopover={false}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-5 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <div className="w-full flex justify-between items-center">
                    <div className="w-5" />
                    <h3 className="text-xl font-semibold text-center flex-grow">
                      {t("opening.loanOpening.basicInfo.title")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowBasicInfo(!showBasicInfo)}
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      {showBasicInfo ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {showBasicInfo && (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="memberName"
                        label={t("opening.loanOpening.basicInfo.memberName")}
                        placeholder={t("opening.loanOpening.basicInfo.memberNamePlaceholder",
                        )}
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label={t("opening.loanOpening.basicInfo.guardianName")}
                        placeholder={t("opening.loanOpening.basicInfo.guardianNamePlaceholder",
                        )}
                        readOnly
                      />
                      <TextareaField
                        control={form.control}
                        name="address"
                        label={t("opening.loanOpening.basicInfo.address")}
                        placeholder={t("opening.loanOpening.basicInfo.addressPlaceholder",
                        )}
                        className="resize-none"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="mobile"
                        label={t("opening.loanOpening.basicInfo.mobile")}
                        placeholder={t("opening.loanOpening.basicInfo.mobilePlaceholder",
                        )}
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="memberType"
                        label={t("opening.loanOpening.basicInfo.memberType")}
                        placeholder={t("opening.loanOpening.basicInfo.memberTypePlaceholder",
                        )}
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="shareBalance"
                        label={t("opening.loanOpening.basicInfo.shareBalance")}
                        placeholder={t("opening.loanOpening.basicInfo.shareBalancePlaceholder",
                        )}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("opening.loanOpening.application.title")}
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <DatePickerField
                      control={form.control}
                      name="applicationDate"
                      label={t("opening.loanOpening.application.applicationDate")}
                      disabled
                    />

                    <InputField
                      control={form.control}
                      name="applicationNo"
                      label={t("opening.loanOpening.application.applicationNo")}
                      placeholder={t("opening.loanOpening.application.applicationNoPlaceholder",
                      )}
                    />

                    <InputField
                      control={form.control}
                      name="accountNo"
                      label={t("opening.loanOpening.application.accountNo")}
                      placeholder={t("opening.loanOpening.application.accountNoPlaceholder",
                      )}
                      type="number"
                      maxLength={4}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="ledgerFolio"
                      label={t("opening.loanOpening.application.ledgerFolio")}
                      placeholder={t("opening.loanOpening.application.ledgerFolioPlaceholder",
                      )}
                    />

                    <DropdownField
                      control={form.control}
                      name="productId"
                      label={t("opening.loanOpening.application.product")}
                      options={productData}
                      optionLabelKey="Prod_Sh_Name"
                      placeholder={t("opening.loanOpening.application.productPlaceholder",
                      )}
                      loading={checkLoanEligibleLoading}
                      isRequired
                    />

                    <div className="w-full flex flex-col gap-1.5">
                      <InputField
                        control={form.control}
                        name="applicationAmount"
                        label={t("opening.loanOpening.application.applicationAmount")}
                        placeholder={t("opening.loanOpening.application.applicationAmountPlaceholder",
                        )}
                        type="number"
                        readOnly={!loanEligible}
                        isRequired
                      />
                      {amountErrorMessage && (
                        <p className="text-destructive text-sm mt-1">
                          {amountErrorMessage}
                        </p>
                      )}
                    </div>

                    <InputField
                      control={form.control}
                      name="rateOfInterest"
                      label={t("opening.loanOpening.application.rateOfInterest")}
                      placeholder={t("opening.loanOpening.application.rateOfInterestPlaceholder",
                      )}
                      type="number"
                      readOnly
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="duration"
                      label={t("opening.loanOpening.application.duration")}
                      placeholder={t("opening.loanOpening.application.durationPlaceholder",
                      )}
                      type="number"
                      readOnly={!loanEligible}
                      isRequired
                    />

                    <DropdownField
                      control={form.control}
                      name="durationUnit"
                      label={t("opening.loanOpening.application.durationUnit")}
                      options={durationUnitData}
                      optionLabelKey="Option_Value"
                      placeholder={t("opening.loanOpening.application.durationUnitPlaceholder",
                      )}
                      searchPlaceholder={t("opening.loanOpening.application.durationUnitSearch",
                      )}
                      disabled={!form.getValues("productId") && !loanEligible}
                      isRequired
                    />

                    <DropdownField
                      control={form.control}
                      name="repaymentMode"
                      label={t("opening.loanOpening.application.repaymentMode")}
                      options={repaymentModeData}
                      optionLabelKey="Option_Value"
                      placeholder={t("opening.loanOpening.application.repaymentModePlaceholder",
                      )}
                      searchPlaceholder={t("opening.loanOpening.application.repaymentModeSearch",
                      )}
                      disabled={!form.getValues("productId") && !loanEligible}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="finalRepaymentDate"
                      label={t("opening.loanOpening.application.finalRepaymentDate")}
                      placeholder={t("opening.loanOpening.application.finalRepaymentDatePlaceholder",
                      )}
                      readOnly
                    />

                    {showEmi && (
                      <InputField
                        control={form.control}
                        name="emiAmount"
                        label={t("opening.loanOpening.application.emiAmount")}
                        placeholder={t("opening.loanOpening.application.emiAmountPlaceholder",
                        )}
                        readOnly
                      />
                    )}

                    <InputField
                      control={form.control}
                      name="outstandingBalance"
                      label={t("opening.loanOpening.application.outstandingBalance")}
                      placeholder={t("opening.loanOpening.application.outstandingBalancePlaceholder",
                      )}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="dueInterest"
                      label={t("opening.loanOpening.application.dueInterest")}
                      placeholder={t("opening.loanOpening.application.dueInterestPlaceholder",
                      )}
                      isRequired
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={!loanEligible || addLoanAccountLoading}
                >
                  {addLoanAccountLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("opening.loanOpening.buttons.add")
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
export default LoanOpening;
