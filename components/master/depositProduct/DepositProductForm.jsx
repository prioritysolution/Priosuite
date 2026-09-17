"use client";

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
        className="flex flex-col gap-5"
        autoComplete="off"
      >
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
          <DropdownField
            control={form.control}
            name="prdType"
            label="Product Type"
            options={productTypeData || []}
            optionLabelKey="Option_Value"
            placeholder="Select product type"
            searchPlaceholder="Search product type..."
            isRequired
          />

          <DropdownField
            control={form.control}
            name="depType"
            label="Deposit Type"
            options={depTypeData || []}
            optionLabelKey="Option_Value"
            placeholder="Select deposit type"
            searchPlaceholder="Search deposit type..."
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
            name="prdShName"
            label="Short Name"
            placeholder="Enter short name"
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
            label="Interest Type"
            options={interestTypeData || []}
            optionLabelKey="Option_Value"
            placeholder="Select interest type"
            searchPlaceholder="Search interest type..."
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
            name="roi"
            label="Rate of Interest"
            placeholder="Enter ROI"
            type="number"
            isRequired
          />

          <InputField
            control={form.control}
            name="minDur"
            label="Minimum Duration"
            placeholder="Enter minimum duration"
            type="number"
          />

          <InputField
            control={form.control}
            name="maxDur"
            label="Maximum Duration"
            placeholder="Enter maximum duration"
            type="number"
          />

          <DropdownField
            control={form.control}
            name="durUnit"
            label="Duration Unit"
            options={durationUnitData || []}
            optionLabelKey="Option_Value"
            placeholder="Select duration unit"
            searchPlaceholder="Search duration unit..."
          />

          <InputField
            control={form.control}
            name="lockDays"
            label="Lock-in Days"
            placeholder="Enter lock-in days"
            type="number"
          />

          <InputField
            control={form.control}
            name="passbookFees"
            label="Passbook Fees"
            placeholder="Enter passbook fees"
            type="number"
          />

          <InputField
            control={form.control}
            name="defaultFine"
            label="Default Fine"
            placeholder="Enter default fine"
            type="number"
          />

          <InputField
            control={form.control}
            name="fineOn"
            label="Fine On"
            placeholder="Enter fine on"
            type="number"
          />

          <InputField
            control={form.control}
            name="inOperMonth"
            label="Inoperative Months"
            placeholder="Enter inoperative months"
            type="number"
          />

          <InputField
            control={form.control}
            name="inDorMonth"
            label="Dormant Months"
            placeholder="Enter dormant months"
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
            name="prnLedg"
            label="Principal Ledger"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select principal ledger"
            searchPlaceholder="Search ledger..."
            isRequired
          />

          <DropdownField
            control={form.control}
            name="inttLedg"
            label="Interest Ledger"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select interest ledger"
            searchPlaceholder="Search ledger..."
            isRequired
          />

          <DropdownField
            control={form.control}
            name="provLedg"
            label="Provision Ledger"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select provision ledger"
            searchPlaceholder="Search ledger..."
            isRequired
          />

          <DropdownField
            control={form.control}
            name="fineLedg"
            label="Fine Ledger"
            options={ledgerData || []}
            optionLabelKey="Ledger_Name"
            placeholder="Select fine ledger"
            searchPlaceholder="Search ledger..."
            isRequired
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

export default DepositProductForm;
