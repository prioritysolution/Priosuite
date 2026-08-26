import DropdownField from "@/common/formFields/DropdownField";
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
import { ClipLoader } from "react-spinners";

const SubLedgerForm = ({
  postLoading,
  updateLoading,
  form,
  handleSubmit,
  editData,
  headListData,
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-3 py-5"
        autoComplete="off"
      >
        <InputField
          control={form.control}
          name="ledgerName"
          label="Ledger Name"
          placeholder="Enter ledger name"
        />

        {/* <div onFocus={handleStopPropagation} onClick={handleStopPropagation}> */}
        <DropdownField
          control={form.control}
          name="underHead"
          label="Under Head"
          options={headListData || []}
          optionLabelKey="Ledger_Name"
          placeholder="Select under head"
          searchPlaceholder="Search under head..."
        />

        <InputField
          control={form.control}
          name="openingBalance"
          label="Opening Balance"
          placeholder="Enter opening balance"
          type="number"
        />

        <div className="w-full flex items-center justify-end">
          <Button
            type="submit"
            className="w-1/4"
            disabled={postLoading || updateLoading}
          >
            {postLoading || updateLoading ? (
              <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
            ) : editData && Object.keys(editData).length > 0 ? (
              "Edit"
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default SubLedgerForm;
