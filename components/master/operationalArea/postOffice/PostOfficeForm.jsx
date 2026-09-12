import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ClipLoader } from "react-spinners";

const PostOfficeForm = ({
  postLoading,
  updateLoading,
  form,
  handleSubmit,
  editData,
  stateData,
  districtData,
  onCancel,
}) => {
  const isEdit = editData && Object.keys(editData).length > 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
        autoComplete="off"
      >
        <InputField
          control={form.control}
          name="name"
          label="Post Office Name"
          placeholder="Enter post office name"
          isRequired
        />
        <InputField
          control={form.control}
          name="pin"
          label="Pin Code"
          placeholder="Enter pin code"
          isRequired
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
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-[110px] rounded-lg px-5"
            onClick={onCancel}
            disabled={postLoading || updateLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-10 min-w-[120px] rounded-lg px-6"
            disabled={postLoading || updateLoading}
          >
            {postLoading || updateLoading ? (
              <ClipLoader color="#fff" size={18} speedMultiplier={0.7} />
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

export default PostOfficeForm;
