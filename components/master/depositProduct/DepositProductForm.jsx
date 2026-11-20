"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

const DepositProductForm = ({
  postLoading,
  updateLoading,
  form,
  handleSubmit,
  editData,
  getDepositTypeApiCall,
  onCancel,
}) => {
  const { t } = useTranslation();
  const orgId = getCookieData("orgId");
  const [depTypeLoading, setDepTypeLoading] = useState(false);
  const productTypeData = useSelector(
    (state) => state?.depositProduct?.productTypeData,
  );
  const depTypeData = useSelector(
    (state) => state?.depositProduct?.depTypeData,
  );
  const interestTypeData = useSelector(
    (state) => state?.depositProduct?.interestTypeData,
  );
  const durationUnitData = useSelector(
    (state) => state?.depositProduct?.durationUnitData,
  );
  const memberTypeData = useSelector(
    (state) => state?.depositProduct?.memberTypeData,
  );
  const ledgerData = useSelector((state) => state?.depositProduct?.ledgerData);
  const payoutModeData = useSelector(
    (state) => state?.depositProduct?.payoutModeData,
  );
  const fineOnData = useSelector((state) => state?.depositProduct?.fineOnData);

  const watchedPrdType = useWatch({
    control: form.control,
    name: "prdType",
  });
  const watchedDepType = useWatch({
    control: form.control,
    name: "depType",
  });
  const watchedWithdrawalAllocated = useWatch({
    control: form.control,
    name: "withdrawalAllocated",
  });
  const watchedInterestPayout = useWatch({
    control: form.control,
    name: "interestPayout",
  });

  const prevPrdTypeRef = useRef();
  const fetchedPrdTypeRef = useRef();

  // Visibility logic based on depType:
  // depType === 1: hide Duration unit, Lock-in Days, Default Fine, Fine on, Fine Ledger, Interest Payout
  // depType in (2, 5): hide Withdrawal Allocated, Interest Payout
  // other depType: hide Withdrawal Allocated, Fine on, Default Fine, Fine Ledger
  const depTypeStr =
    watchedDepType !== null &&
    watchedDepType !== undefined &&
    watchedDepType !== ""
      ? String(watchedDepType)
      : "";

  const isDepType1 = depTypeStr === "1";
  const isDepType2or5 = depTypeStr === "2" || depTypeStr === "5";
  const isDepTypeOther = depTypeStr !== "" && !isDepType1 && !isDepType2or5;

  const showDurationUnit = !isDepType1;
  const showLockDays = !isDepType1;
  const showDefaultFine = !isDepType1 && !isDepTypeOther;
  const showFineOn = !isDepType1 && !isDepTypeOther;
  const showFineLedg = !isDepType1 && !isDepTypeOther;
  const showWithdrawalAllocated = !isDepType2or5 && !isDepTypeOther;
  const showInterestPayout = !isDepType1 && !isDepType2or5;

  // Fetch deposit type options whenever product type changes
  useEffect(() => {
    let isCancelled = false;

    if (
      watchedPrdType &&
      orgId &&
      typeof getDepositTypeApiCall === "function"
    ) {
      // Avoid duplicate API call if we already fetched for this exact orgId and prdType
      const cacheKey = `${orgId}_${watchedPrdType}`;
      if (fetchedPrdTypeRef.current !== cacheKey) {
        fetchedPrdTypeRef.current = cacheKey;
        setDepTypeLoading(true);
        Promise.resolve(getDepositTypeApiCall(orgId, watchedPrdType)).finally(
          () => {
            if (!isCancelled) {
              setDepTypeLoading(false);
            }
          },
        );
      }
    } else {
      fetchedPrdTypeRef.current = null;
      setDepTypeLoading(false);
    }

    // If product type changed by user, reset deposit type selection
    if (
      prevPrdTypeRef.current !== undefined &&
      prevPrdTypeRef.current !== watchedPrdType &&
      prevPrdTypeRef.current !== ""
    ) {
      form.setValue("depType", "");
    }
    prevPrdTypeRef.current = watchedPrdType;

    return () => {
      isCancelled = true;
    };
  }, [watchedPrdType, orgId, getDepositTypeApiCall, form]);

  const isEdit = editData && Object.keys(editData).length > 0;
  const isBusy = postLoading || updateLoading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="h-full min-h-0 flex flex-col"
        autoComplete="off"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
            <DropdownField
              control={form.control}
              name="prdType"
              label={t("master.depositProduct.fields.productType")}
              options={productTypeData || []}
              optionLabelKey="Option_Value"
              placeholder={t("master.depositProduct.placeholders.productType")}
              searchPlaceholder={t(
                "master.depositProduct.placeholders.searchProductType",
              )}
              isRequired
            />

            <DropdownField
              control={form.control}
              name="depType"
              label={t("master.depositProduct.fields.depositType")}
              options={depTypeData || []}
              optionLabelKey="Option_Name"
              placeholder={
                !watchedPrdType
                  ? t(
                      "master.depositProduct.placeholders.selectProductTypeFirst",
                      "Select Product Type first",
                    )
                  : t("master.depositProduct.placeholders.depositType")
              }
              searchPlaceholder={t(
                "master.depositProduct.placeholders.searchDepositType",
              )}
              disabled={!watchedPrdType || depTypeLoading}
              loading={depTypeLoading}
              isRequired
            />

            <InputField
              control={form.control}
              name="productName"
              label={t("master.depositProduct.fields.productName")}
              placeholder={t("master.depositProduct.placeholders.productName")}
              isRequired
            />

            <InputField
              control={form.control}
              name="prdShName"
              label={t("master.depositProduct.fields.shortName")}
              placeholder={t("master.depositProduct.placeholders.shortName")}
              onInput={(e) => {
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
              isRequired
            />

            <DropdownField
              control={form.control}
              name="interestType"
              label={t("master.depositProduct.fields.interestType")}
              options={interestTypeData || []}
              optionLabelKey="Option_Value"
              placeholder={t("master.depositProduct.placeholders.interestType")}
              searchPlaceholder={t(
                "master.depositProduct.placeholders.searchInterestType",
              )}
              isRequired
            />

            <InputField
              control={form.control}
              name="minAmt"
              label={t("master.depositProduct.fields.minAmount")}
              placeholder={t("master.depositProduct.placeholders.minAmount")}
              type="number"
              isRequired
            />

            <InputField
              control={form.control}
              name="roi"
              label={t("master.depositProduct.fields.roi")}
              placeholder={t("master.depositProduct.placeholders.roi")}
              type="number"
              isRequired
            />

            <InputField
              control={form.control}
              name="minDur"
              label={t("master.depositProduct.fields.minDuration")}
              placeholder={t("master.depositProduct.placeholders.minDuration")}
              type="number"
            />

            {showDurationUnit && (
              <DropdownField
                control={form.control}
                name="durUnit"
                label={t("master.depositProduct.fields.durationUnit")}
                options={durationUnitData || []}
                optionLabelKey="Option_Value"
                placeholder={t(
                  "master.depositProduct.placeholders.durationUnit",
                )}
                searchPlaceholder={t(
                  "master.depositProduct.placeholders.searchDurationUnit",
                )}
              />
            )}

            {showLockDays && (
              <InputField
                control={form.control}
                name="lockDays"
                label={t("master.depositProduct.fields.lockInDays")}
                placeholder={t("master.depositProduct.placeholders.lockInDays")}
                type="number"
              />
            )}

            {showDefaultFine && (
              <InputField
                control={form.control}
                name="defaultFine"
                label={t("master.depositProduct.fields.defaultFine")}
                placeholder={t(
                  "master.depositProduct.placeholders.defaultFine",
                )}
                type="number"
              />
            )}

            {showFineOn && (
              <DropdownField
                control={form.control}
                name="fineOn"
                label={t("master.depositProduct.fields.fineOn")}
                options={fineOnData || []}
                optionLabelKey="Option_Value"
                placeholder={t("master.depositProduct.placeholders.fineOn")}
                searchPlaceholder={t(
                  "master.depositProduct.placeholders.searchFineOn",
                  "Search fine on...",
                )}
              />
            )}

            <InputField
              control={form.control}
              name="inOperMonth"
              label={t("master.depositProduct.fields.inoperativeMonths")}
              placeholder={t(
                "master.depositProduct.placeholders.inoperativeMonths",
              )}
              type="number"
            />

            <InputField
              control={form.control}
              name="inDorMonth"
              label={t("master.depositProduct.fields.dormantMonths")}
              placeholder={t(
                "master.depositProduct.placeholders.dormantMonths",
              )}
              type="number"
            />

            <DropdownField
              control={form.control}
              name="memberType"
              label={t("master.depositProduct.fields.memberType")}
              options={memberTypeData || []}
              optionLabelKey="Option_Value"
              placeholder={t("master.depositProduct.placeholders.memberType")}
              searchPlaceholder={t(
                "master.depositProduct.placeholders.searchMemberType",
              )}
            />

            <DropdownField
              control={form.control}
              name="prnLedg"
              label={t("master.depositProduct.fields.principalLedger")}
              options={ledgerData || []}
              optionLabelKey="Ledger_Name"
              placeholder={t(
                "master.depositProduct.placeholders.principalLedger",
              )}
              searchPlaceholder={t(
                "master.depositProduct.placeholders.searchLedger",
              )}
              isRequired
            />

            <DropdownField
              control={form.control}
              name="inttLedg"
              label={t("master.depositProduct.fields.interestLedger")}
              options={ledgerData || []}
              optionLabelKey="Ledger_Name"
              placeholder={t(
                "master.depositProduct.placeholders.interestLedger",
              )}
              searchPlaceholder={t(
                "master.depositProduct.placeholders.searchLedger",
              )}
              isRequired
            />

            <DropdownField
              control={form.control}
              name="provLedg"
              label={t("master.depositProduct.fields.provisionLedger")}
              options={ledgerData || []}
              optionLabelKey="Ledger_Name"
              placeholder={t(
                "master.depositProduct.placeholders.provisionLedger",
              )}
              searchPlaceholder={t(
                "master.depositProduct.placeholders.searchLedger",
              )}
              isRequired
            />

            {showFineLedg && (
              <DropdownField
                control={form.control}
                name="fineLedg"
                label={t("master.depositProduct.fields.fineLedger")}
                options={ledgerData || []}
                optionLabelKey="Ledger_Name"
                placeholder={t("master.depositProduct.placeholders.fineLedger")}
                searchPlaceholder={t(
                  "master.depositProduct.placeholders.searchLedger",
                )}
                isRequired
              />
            )}

            {/* Additional Features Section */}
            {(showWithdrawalAllocated || showInterestPayout) && (
              <div className="col-span-full border-t border-[#e8eef5] pt-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
                  {/* 1) Withdrawal allocated group */}
                  {showWithdrawalAllocated && (
                    <div className="flex flex-col gap-2">
                      <FormLabel className="text-sm font-medium text-foreground invisible select-none">
                        Withdrawal
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="withdrawalAllocated"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2.5 space-y-0 rounded-md border border-slate-200 bg-slate-50/60 p-3 h-10">
                            <FormControl>
                              <Checkbox
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  if (!checked) {
                                    form.setValue("noOfWithdrawalInYear", "");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                              {t(
                                "master.depositProduct.fields.withdrawalAllocated",
                                "Withdrawal Allocated",
                              )}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* 2) No. of withdrawal in a year */}
                  {showWithdrawalAllocated && (
                    watchedWithdrawalAllocated ? (
                      <InputField
                        control={form.control}
                        name="noOfWithdrawalInYear"
                        label={t(
                          "master.depositProduct.fields.noOfWithdrawalInYear",
                          "No. of withdrawal in a year",
                        )}
                        placeholder={t(
                          "master.depositProduct.placeholders.noOfWithdrawalInYear",
                          "Enter no. of withdrawals",
                        )}
                        type="number"
                        isRequired
                      />
                    ) : (
                      <div className="hidden lg:block" />
                    )
                  )}

                  {/* Spacer for 3-column row alignment if only 1 item visible */}
                  {showWithdrawalAllocated && !watchedWithdrawalAllocated && (
                    <div className="hidden lg:block" />
                  )}

                  {/* 3) Interest Payout group */}
                  {showInterestPayout && (
                    <div className="flex flex-col gap-2">
                      <FormLabel className="text-sm font-medium text-foreground invisible select-none">
                        Interest
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="interestPayout"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2.5 space-y-0 rounded-md border border-slate-200 bg-slate-50/60 p-3 h-10">
                            <FormControl>
                              <Checkbox
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  if (!checked) {
                                    form.setValue("payoutMode", "");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                              {t(
                                "master.depositProduct.fields.interestPayout",
                                "Interest Payout",
                              )}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* 4) Payout Mode */}
                  {showInterestPayout && (
                    watchedInterestPayout ? (
                      <DropdownField
                        control={form.control}
                        name="payoutMode"
                        label={t(
                          "master.depositProduct.fields.payoutMode",
                          "Payout Mode",
                        )}
                        options={payoutModeData || []}
                        optionLabelKey="Option_Value"
                        placeholder={t(
                          "master.depositProduct.placeholders.payoutMode",
                          "Select payout mode",
                        )}
                        searchPlaceholder={t(
                          "master.depositProduct.placeholders.searchPayoutMode",
                          "Search payout mode...",
                        )}
                        isRequired
                      />
                    ) : (
                      <div className="hidden lg:block" />
                    )
                  )}

                  {/* Spacer for 3-column row alignment if only 1 item visible */}
                  {showInterestPayout && !watchedInterestPayout && (
                    <div className="hidden lg:block" />
                  )}
                </div>
              </div>
            )}

            {/* Agent Allocated */}
            <div className="col-span-full border-t border-[#e8eef5] pt-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
                <div className="flex flex-col justify-start">
                  <FormField
                    control={form.control}
                    name="agentAllocated"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2.5 space-y-0 rounded-md border border-slate-200 bg-slate-50/60 p-3 h-10">
                        <FormControl>
                          <Checkbox
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                          {t(
                            "master.depositProduct.fields.agentAllocated",
                            "Agent Allocated",
                          )}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-[#e8eef5] bg-background px-5 py-4 sm:px-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto min-w-28"
            onClick={onCancel}
            disabled={isBusy}
          >
            {t("common.buttons.cancel")}
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto min-w-28"
            disabled={isBusy}
          >
            {isBusy ? (
              <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
            ) : isEdit ? (
              t("common.buttons.update")
            ) : (
              t("common.buttons.add")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DepositProductForm;
