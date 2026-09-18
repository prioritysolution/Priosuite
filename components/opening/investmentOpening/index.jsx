"use client";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoCalculator } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const InvestmentOpening = ({
  loading,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  handleCalculateMatureAmount,
}) => {
  const { t } = useTranslation();
  const investmentTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentTypeData
  );

  const accountTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentAccountTypeData
  );

  const interestTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentInterestTypeData
  );

  const principalLedgerData = useSelector(
    (state) => state.investmentOpenAccount.investmentPrincipalLedgerData
  );
  const interestLedgerData = useSelector(
    (state) => state.investmentOpenAccount.investmentInterestLedgerData
  );

  const durationTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentDurationData,
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold ">
          {t("opening.investmentOpening.title")}
        </h3>

        <ScrollArea className="w-full h-full">
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
                    name="investmentType"
                    label={t("opening.investmentOpening.fields.investmentType")}
                    options={investmentTypeData}
                    optionLabelKey="Option_Value"
                    placeholder={t("opening.investmentOpening.placeholders.investmentType"
                    )}
                    searchPlaceholder={t("opening.investmentOpening.placeholders.searchInvestmentType"
                    )}
                    isRequired
                  />
                  <DropdownField
                    control={form.control}
                    name="accountType"
                    label={t("opening.investmentOpening.fields.accountType")}
                    options={accountTypeData}
                    optionLabelKey="Option_Value"
                    placeholder={t("opening.investmentOpening.placeholders.accountType"
                    )}
                    searchPlaceholder={t("opening.investmentOpening.placeholders.searchAccountType"
                    )}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="bankName"
                    label={t("opening.investmentOpening.fields.bankName")}
                    placeholder={t("opening.investmentOpening.placeholders.bankName")}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="accountNo"
                    label={t("opening.investmentOpening.fields.accountNo")}
                    placeholder={t("opening.investmentOpening.placeholders.accountNo")}
                    type="number"
                    maxLength={15}
                    isRequired
                  />

                  <DatePickerField
                    control={form.control}
                    name="openingDate"
                    label={t("opening.investmentOpening.fields.openingDate")}
                    isBackDate={true}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="amount"
                    label={t("opening.investmentOpening.fields.amount")}
                    placeholder={t("opening.investmentOpening.placeholders.amount")}
                    type="number"
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="rateOfInterest"
                    label={t("opening.investmentOpening.fields.rateOfInterest")}
                    placeholder={t("opening.investmentOpening.placeholders.rateOfInterest"
                    )}
                    type="number"
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="interestType"
                    label={t("opening.investmentOpening.fields.interestType")}
                    options={interestTypeData}
                    optionLabelKey="Option_Value"
                    placeholder={t("opening.investmentOpening.placeholders.interestType"
                    )}
                    searchPlaceholder={t("opening.investmentOpening.placeholders.searchInterestType"
                    )}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="duration"
                    label={t("opening.investmentOpening.fields.duration")}
                    placeholder={t("opening.investmentOpening.placeholders.duration")}
                    type="number"
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="durtype"
                    label={t("opening.investmentOpening.fields.durationType")}
                    options={durationTypeData}
                    optionLabelKey="Option_Value"
                    placeholder={t("opening.investmentOpening.placeholders.durationType"
                    )}
                    searchPlaceholder={t("opening.investmentOpening.placeholders.searchDurationType"
                    )}
                    isRequired
                  />

                  <InputField
                    control={form.control}
                    name="matureDate"
                    label={t("opening.investmentOpening.fields.matureDate")}
                    placeholder={t("opening.investmentOpening.placeholders.matureDate"
                    )}
                    readOnly
                    isRequired
                    displayValue={form.watch("matureDate") || ""}
                  />

                  <div className="w-full flex flex-col gap-1.5">
                    <InputField
                      control={form.control}
                      name="matureAmount"
                      label={t("opening.investmentOpening.fields.matureAmount")}
                      placeholder={t("opening.investmentOpening.placeholders.matureAmount"
                      )}
                      type="number"
                      endContent={
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={handleCalculateMatureAmount}
                                className="p-2 text-xl bg-primary rounded-md text-white cursor-pointer h-full flex items-center"
                              >
                                <IoCalculator />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {t("opening.investmentOpening.tooltips.calculateMatureAmount"
                                )}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      }
                      isRequired
                    />
                  </div>

                  <DropdownField
                    control={form.control}
                    name="principalLedger"
                    label={t("opening.investmentOpening.fields.principalLedger")}
                    options={principalLedgerData}
                    optionLabelKey="Ledger_Name"
                    placeholder={t("opening.investmentOpening.placeholders.principalLedger"
                    )}
                    searchPlaceholder={t("opening.investmentOpening.placeholders.searchPrincipalLedger"
                    )}
                    isRequired
                  />

                  <DropdownField
                    control={form.control}
                    name="interestLedger"
                    label={t("opening.investmentOpening.fields.interestLedger")}
                    options={interestLedgerData}
                    optionLabelKey="Ledger_Name"
                    placeholder={t("opening.investmentOpening.placeholders.interestLedger"
                    )}
                    searchPlaceholder={t("opening.investmentOpening.placeholders.searchInterestLedger"
                    )}
                    isRequired
                  />
                </div>
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
                  t("opening.investmentOpening.buttons.add")
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
export default InvestmentOpening;
