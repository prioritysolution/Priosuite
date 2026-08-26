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

const StateForm = ({
  postLoading,
  updateLoading,
  form,
  handleSubmit,
  editData,
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 py-5"
        autoComplete="off"
      >
        <InputField
          control={form.control}
          name="name"
          label="State Name"
          placeholder="Enter state name"
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
export default StateForm;
