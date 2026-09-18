"use client";

import { useTranslation } from "react-i18next";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

const DepositProductForm = ({
  postLoading,
  updateLoading,
  form,
  handleSubmit,
  editData,
  onCancel,
}) => {
  const { t } = useTranslation();
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
            searchPlaceholder={t("master.depositProduct.placeholders.searchProductType")}
            isRequired
          />

          <DropdownField
            control={form.control}
            name="depType"
            label={t("master.depositProduct.fields.depositType")}
            options={depTypeData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.depositProduct.placeholders.depositType")}
            searchPlaceholder={t("master.depositProduct.placeholders.searchDepositType")}
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
            searchPlaceholder={t("master.depositProduct.placeholders.searchInterestType")}
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
            name="maxAmt"
            label={t("master.depositProduct.fields.maxAmount")}
            placeholder={t("master.depositProduct.placeholders.maxAmount")}
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

          <InputField
            control={form.control}
            name="maxDur"
            label={t("master.depositProduct.fields.maxDuration")}
            placeholder={t("master.depositProduct.placeholders.maxDuration")}
            type="number"
          />

          <DropdownField
            control={form.control}
            name="durUnit"
            label={t("master.depositProduct.fields.durationUnit")}
            options={durationUnitData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.depositProduct.placeholders.durationUnit")}
            searchPlaceholder={t("master.depositProduct.placeholders.searchDurationUnit")}
          />

          <InputField
            control={form.control}
            name="lockDays"
            label={t("master.depositProduct.fields.lockInDays")}
            placeholder={t("master.depositProduct.placeholders.lockInDays")}
            type="number"
          />

          <InputField
            control={form.control}
            name="passbookFees"
            label={t("master.depositProduct.fields.passbookFees")}
            placeholder={t("master.depositProduct.placeholders.passbookFees")}
            type="number"
          />

          <InputField
            control={form.control}
            name="defaultFine"
            label={t("master.depositProduct.fields.defaultFine")}
            placeholder={t("master.depositProduct.placeholders.defaultFine")}
            type="number"
          />

          <InputField
            control={form.control}
            name="fineOn"
            label={t("master.depositProduct.fields.fineOn")}
            placeholder={t("master.depositProduct.placeholders.fineOn")}
            type="number"
          />

          <InputField
            control={form.control}
            name="inOperMonth"
            label={t("master.depositProduct.fields.inoperativeMonths")}
            placeholder={t("master.depositProduct.placeholders.inoperativeMonths")}
            type="number"
          />

          <InputField
            control={form.control}
            name="inDorMonth"
            label={t("master.depositProduct.fields.dormantMonths")}
            placeholder={t("master.depositProduct.placeholders.dormantMonths")}
            type="number"
          />

          <DropdownField
            control={form.control}
            name="memberType"
            label={t("master.depositProduct.fields.memberType")}
            options={memberTypeData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.depositProduct.placeholders.memberType")}
            searchPlaceholder={t("master.depositProduct.placeholders.searchMemberType")}
          />

          <DropdownField
            control={form.control}
            name="prnLedg"
            label={t("master.depositProduct.fields.principalLedger")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.depositProduct.placeholders.principalLedger")}
            searchPlaceholder={t("master.depositProduct.placeholders.searchLedger")}
            isRequired
          />

          <DropdownField
            control={form.control}
            name="inttLedg"
            label={t("master.depositProduct.fields.interestLedger")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.depositProduct.placeholders.interestLedger")}
            searchPlaceholder={t("master.depositProduct.placeholders.searchLedger")}
            isRequired
          />

          <DropdownField
            control={form.control}
            name="provLedg"
            label={t("master.depositProduct.fields.provisionLedger")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.depositProduct.placeholders.provisionLedger")}
            searchPlaceholder={t("master.depositProduct.placeholders.searchLedger")}
            isRequired
          />

          <DropdownField
            control={form.control}
            name="fineLedg"
            label={t("master.depositProduct.fields.fineLedger")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.depositProduct.placeholders.fineLedger")}
            searchPlaceholder={t("master.depositProduct.placeholders.searchLedger")}
            isRequired
          />
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
