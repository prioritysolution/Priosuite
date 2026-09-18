"use client";

import { useTranslation } from "react-i18next";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

const LoanProductForm = ({
  postLoading,
  updateLoading,
  form,
  handleSubmit,
  editData,
  onCancel,
}) => {
  const { t } = useTranslation();
  const productTypeData = useSelector(
    (state) => state?.loanProduct?.productTypeData,
  );
  const loanTypeData = useSelector((state) => state?.loanProduct?.loanTypeData);
  const durationUnitData = useSelector(
    (state) => state?.loanProduct?.durationUnitData,
  );
  const memberTypeData = useSelector(
    (state) => state?.loanProduct?.memberTypeData,
  );
  const ledgerData = useSelector((state) => state?.loanProduct?.ledgerData);
  const secureProductData = useSelector(
    (state) => state?.loanProduct?.secureProductData,
  );
  const overdueOnData = useSelector(
    (state) => state?.loanProduct?.overdueOnData,
  );
  const graceOnData = useSelector((state) => state?.loanProduct?.graceOnData);
  const financeTypeData = useSelector(
    (state) => state?.loanProduct?.financeTypeData,
  );
  const yesNoData = useSelector((state) => state?.loanProduct?.yesNoData);

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
            name="productType"
            label={t("master.loanProduct.fields.productType")}
            options={productTypeData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.productType")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchProductType")}
            isRequired
          />

          <DropdownField
            control={form.control}
            name="loanType"
            label={t("master.loanProduct.fields.loanType")}
            options={loanTypeData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.loanType")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchLoanType")}
            isRequired
          />

          <InputField
            control={form.control}
            name="productName"
            label={t("master.loanProduct.fields.productName")}
            placeholder={t("master.loanProduct.placeholders.productName")}
            isRequired
          />

          <InputField
            control={form.control}
            name="prodShName"
            label={t("master.loanProduct.fields.shortName")}
            placeholder={t("master.loanProduct.placeholders.shortName")}
            onInput={(e) => {
              if (e.target.value.length > 10) {
                e.target.value = e.target.value.slice(0, 10);
              }
            }}
            isRequired
          />

          <InputField
            control={form.control}
            name="minAmt"
            label={t("master.loanProduct.fields.minAmount")}
            placeholder={t("master.loanProduct.placeholders.minAmount")}
            type="number"
            isRequired
          />

          <InputField
            control={form.control}
            name="maxAmt"
            label={t("master.loanProduct.fields.maxAmount")}
            placeholder={t("master.loanProduct.placeholders.maxAmount")}
            type="number"
            isRequired
          />

          <InputField
            control={form.control}
            name="minDur"
            label={t("master.loanProduct.fields.minDuration")}
            placeholder={t("master.loanProduct.placeholders.minDuration")}
            type="number"
            isRequired
          />

          <InputField
            control={form.control}
            name="maxDur"
            label={t("master.loanProduct.fields.maxDuration")}
            placeholder={t("master.loanProduct.placeholders.maxDuration")}
            type="number"
            isRequired
          />

          <DropdownField
            control={form.control}
            name="durUnit"
            label={t("master.loanProduct.fields.durationUnit")}
            options={durationUnitData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.durationUnit")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchDurationUnit")}
            isRequired
          />

          <InputField
            control={form.control}
            name="roi"
            label={t("master.loanProduct.fields.roi")}
            placeholder={t("master.loanProduct.placeholders.roi")}
            type="number"
            isRequired
          />

          <DropdownField
            control={form.control}
            name="prnCurrGl"
            label={t("master.loanProduct.fields.principalCurrentGl")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.loanProduct.placeholders.principalCurrentGl")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchLedger")}
            isRequired
          />

          <DropdownField
            control={form.control}
            name="prnOdGl"
            label={t("master.loanProduct.fields.principalOverdueGl")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.loanProduct.placeholders.principalOverdueGl")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchLedger")}
            isRequired
          />

          <DropdownField
            control={form.control}
            name="inttCurrGl"
            label={t("master.loanProduct.fields.interestCurrentGl")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.loanProduct.placeholders.interestCurrentGl")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchLedger")}
            isRequired
          />

          <DropdownField
            control={form.control}
            name="inttOdGl"
            label={t("master.loanProduct.fields.interestOverdueGl")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.loanProduct.placeholders.interestOverdueGl")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchLedger")}
            isRequired
          />

          <DropdownField
            control={form.control}
            name="isOverdue"
            label={t("master.loanProduct.fields.overdueApplicable")}
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.overdueApplicable")}
            searchPlaceholder={t("master.loanProduct.placeholders.search")}
          />

          <DropdownField
            control={form.control}
            name="overdueOn"
            label={t("master.loanProduct.fields.overdueOn")}
            options={overdueOnData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.overdueOn")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchOverdueOn")}
          />

          <InputField
            control={form.control}
            name="overdueCount"
            label={t("master.loanProduct.fields.overdueCount")}
            placeholder={t("master.loanProduct.placeholders.overdueCount")}
            type="number"
          />

          <InputField
            control={form.control}
            name="overdurRate"
            label={t("master.loanProduct.fields.overdueRate")}
            placeholder={t("master.loanProduct.placeholders.overdueRate")}
            type="number"
          />

          <InputField
            control={form.control}
            name="graceDays"
            label={t("master.loanProduct.fields.graceDays")}
            placeholder={t("master.loanProduct.placeholders.graceDays")}
            type="number"
          />

          <DropdownField
            control={form.control}
            name="graceOn"
            label={t("master.loanProduct.fields.graceOn")}
            options={graceOnData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.graceOn")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchGraceOn")}
          />

          <DropdownField
            control={form.control}
            name="isNpa"
            label={t("master.loanProduct.fields.npaApplicable")}
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.npaApplicable")}
            searchPlaceholder={t("master.loanProduct.placeholders.search")}
          />

          <InputField
            control={form.control}
            name="npaAfter"
            label={t("master.loanProduct.fields.npaAfter")}
            placeholder={t("master.loanProduct.placeholders.npaAfter")}
            type="number"
          />

          <DropdownField
            control={form.control}
            name="secureProdId"
            label={t("master.loanProduct.fields.securedDepositProduct")}
            options={secureProductData || []}
            optionLabelKey="Product_Name"
            placeholder={t("master.loanProduct.placeholders.securedProduct")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchProduct")}
          />

          <InputField
            control={form.control}
            name="maxAllowed"
            label={t("master.loanProduct.fields.maxAllowed")}
            placeholder={t("master.loanProduct.placeholders.maxAllowed")}
            type="number"
          />

          <DropdownField
            control={form.control}
            name="memberType"
            label={t("master.loanProduct.fields.memberType")}
            options={memberTypeData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.memberType")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchMemberType")}
          />

          <DropdownField
            control={form.control}
            name="financeType"
            label={t("master.loanProduct.fields.financeType")}
            options={financeTypeData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.financeType")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchFinanceType")}
          />

          <DropdownField
            control={form.control}
            name="isProject"
            label={t("master.loanProduct.fields.projectLoan")}
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.projectLoan")}
            searchPlaceholder={t("master.loanProduct.placeholders.search")}
          />

          <DropdownField
            control={form.control}
            name="isMortg"
            label={t("master.loanProduct.fields.mortgageRequired")}
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.mortgageRequired")}
            searchPlaceholder={t("master.loanProduct.placeholders.search")}
          />

          <DropdownField
            control={form.control}
            name="isGurr"
            label={t("master.loanProduct.fields.guarantorRequired")}
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder={t("master.loanProduct.placeholders.guarantorRequired")}
            searchPlaceholder={t("master.loanProduct.placeholders.search")}
          />

          <DropdownField
            control={form.control}
            name="provCurGl"
            label={t("master.loanProduct.fields.provisionCurrentGl")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.loanProduct.placeholders.provisionCurrentGl")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchLedger")}
          />

          <DropdownField
            control={form.control}
            name="provOdGl"
            label={t("master.loanProduct.fields.provisionOverdueGl")}
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder={t("master.loanProduct.placeholders.provisionOverdueGl")}
            searchPlaceholder={t("master.loanProduct.placeholders.searchLedger")}
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

export default LoanProductForm;
