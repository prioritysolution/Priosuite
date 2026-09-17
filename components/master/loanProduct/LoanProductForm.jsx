"use client";

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
        className="flex flex-col gap-5"
        autoComplete="off"
      >
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
          <DropdownField
            control={form.control}
            name="productType"
            label="Product Type"
            options={productTypeData || []}
            optionLabelKey="Option_Value"
            placeholder="Select product type"
            searchPlaceholder="Search product type..."
            isRequired
          />

          <DropdownField
            control={form.control}
            name="loanType"
            label="Loan Type"
            options={loanTypeData || []}
            optionLabelKey="Option_Value"
            placeholder="Select loan type"
            searchPlaceholder="Search loan type..."
            isRequired
          />

          <InputField
            control={form.control}
            name="productName"
            label="Product Name"
            placeholder="Enter product name"
            isRequired
          />

          <InputField
            control={form.control}
            name="prodShName"
            label="Short Name"
            placeholder="Enter short name"
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
            label="Minimum Amount"
            placeholder="Enter minimum amount"
            type="number"
            isRequired
          />

          <InputField
            control={form.control}
            name="maxAmt"
            label="Maximum Amount"
            placeholder="Enter maximum amount"
            type="number"
            isRequired
          />

          <InputField
            control={form.control}
            name="minDur"
            label="Minimum Duration"
            placeholder="Enter minimum duration"
            type="number"
            isRequired
          />

          <InputField
            control={form.control}
            name="maxDur"
            label="Maximum Duration"
            placeholder="Enter maximum duration"
            type="number"
            isRequired
          />

          <DropdownField
            control={form.control}
            name="durUnit"
            label="Duration Unit"
            options={durationUnitData || []}
            optionLabelKey="Option_Value"
            placeholder="Select duration unit"
            searchPlaceholder="Search duration unit..."
            isRequired
          />

          <InputField
            control={form.control}
            name="roi"
            label="Rate of Interest"
            placeholder="Enter ROI"
            type="number"
            isRequired
          />

          <DropdownField
            control={form.control}
            name="prnCurrGl"
            label="Principal Current GL"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select principal current GL"
            searchPlaceholder="Search ledger..."
            isRequired
          />

          <DropdownField
            control={form.control}
            name="prnOdGl"
            label="Principal Overdue GL"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select principal overdue GL"
            searchPlaceholder="Search ledger..."
            isRequired
          />

          <DropdownField
            control={form.control}
            name="inttCurrGl"
            label="Interest Current GL"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select interest current GL"
            searchPlaceholder="Search ledger..."
            isRequired
          />

          <DropdownField
            control={form.control}
            name="inttOdGl"
            label="Interest Overdue GL"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select interest overdue GL"
            searchPlaceholder="Search ledger..."
            isRequired
          />

          <DropdownField
            control={form.control}
            name="isOverdue"
            label="Overdue Applicable"
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder="Select overdue applicable"
            searchPlaceholder="Search..."
          />

          <DropdownField
            control={form.control}
            name="overdueOn"
            label="Overdue On"
            options={overdueOnData || []}
            optionLabelKey="Option_Value"
            placeholder="Select overdue on"
            searchPlaceholder="Search overdue on..."
          />

          <InputField
            control={form.control}
            name="overdueCount"
            label="Overdue Count"
            placeholder="Enter overdue count"
            type="number"
          />

          <InputField
            control={form.control}
            name="overdurRate"
            label="Overdue Rate"
            placeholder="Enter overdue rate"
            type="number"
          />

          <InputField
            control={form.control}
            name="graceDays"
            label="Grace Days"
            placeholder="Enter grace days"
            type="number"
          />

          <DropdownField
            control={form.control}
            name="graceOn"
            label="Grace On"
            options={graceOnData || []}
            optionLabelKey="Option_Value"
            placeholder="Select grace on"
            searchPlaceholder="Search grace on..."
          />

          <DropdownField
            control={form.control}
            name="isNpa"
            label="NPA Applicable"
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder="Select NPA applicable"
            searchPlaceholder="Search..."
          />

          <InputField
            control={form.control}
            name="npaAfter"
            label="NPA After (Months)"
            placeholder="Enter NPA after months"
            type="number"
          />

          <DropdownField
            control={form.control}
            name="secureProdId"
            label="Secured Deposit Product"
            options={secureProductData || []}
            optionLabelKey="Product_Name"
            placeholder="Select secured product"
            searchPlaceholder="Search product..."
          />

          <InputField
            control={form.control}
            name="maxAllowed"
            label="Max Allowed"
            placeholder="Enter max allowed"
            type="number"
          />

          <DropdownField
            control={form.control}
            name="memberType"
            label="Member Type"
            options={memberTypeData || []}
            optionLabelKey="Option_Value"
            placeholder="Select member type"
            searchPlaceholder="Search member type..."
          />

          <DropdownField
            control={form.control}
            name="financeType"
            label="Finance Type"
            options={financeTypeData || []}
            optionLabelKey="Option_Value"
            placeholder="Select finance type"
            searchPlaceholder="Search finance type..."
          />

          <DropdownField
            control={form.control}
            name="isProject"
            label="Project Loan"
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder="Select project loan"
            searchPlaceholder="Search..."
          />

          <DropdownField
            control={form.control}
            name="isMortg"
            label="Mortgage Required"
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder="Select mortgage required"
            searchPlaceholder="Search..."
          />

          <DropdownField
            control={form.control}
            name="isGurr"
            label="Guarantor Required"
            options={yesNoData || []}
            optionLabelKey="Option_Value"
            placeholder="Select guarantor required"
            searchPlaceholder="Search..."
          />

          <DropdownField
            control={form.control}
            name="provCurGl"
            label="Provision Current GL"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select provision current GL"
            searchPlaceholder="Search ledger..."
          />

          <DropdownField
            control={form.control}
            name="provOdGl"
            label="Provision Overdue GL"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select provision overdue GL"
            searchPlaceholder="Search ledger..."
          />
        </div>

        <div className="w-full flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-[#e8eef5]">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto min-w-28"
            onClick={onCancel}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto min-w-28"
            disabled={isBusy}
          >
            {isBusy ? (
              <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
            ) : isEdit ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoanProductForm;
