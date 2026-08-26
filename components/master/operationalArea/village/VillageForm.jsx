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

const VillageForm = ({
  postLoading,
  updateLoading,
  form,
  handleSubmit,
  editData,
  stateData,
  districtData,
  blockData,
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
          name="name"
          label="Village Name"
          placeholder="Enter village name"
        />

        <DropdownField
          control={form.control}
          name="stateId"
          label="State"
          options={stateData}
          optionLabelKey="State_Name"
          placeholder="Select state"
          searchPlaceholder="Search state..."
        />

        <DropdownField
          control={form.control}
          name="districtId"
          label="District"
          options={districtData}
          optionLabelKey="Dist_Name"
          placeholder="Select district"
          searchPlaceholder="Search district..."
          disabled={
            !districtData ||
            !(districtData.length > 0) ||
            !form.getValues("stateId")
          }
        />

        <DropdownField
          control={form.control}
          name="blockId"
          label="Block"
          options={blockData}
          optionLabelKey="Block_Name"
          placeholder="Select block"
          searchPlaceholder="Search block..."
          disabled={
            !blockData ||
            !(blockData.length > 0) ||
            !form.getValues("districtId")
          }
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
export default VillageForm;
