import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import TextareaField from "@/common/formFields/TextareaField";
import { ClipLoader } from "react-spinners";

const RejectReasonModal = ({
  isOpen,
  onClose,
  form,
  onSubmit,
  actionLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Reject Application</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <TextareaField
              control={form.control}
              name="remarks"
              label="Reason for Rejection"
              placeholder="Please enter the reason..."
              className="resize-none h-24"
              rules={{ required: "Remarks is required for rejection" }}
              isRequired={true}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ClipLoader size={20} color="#ffffff" />
                ) : (
                  "Confirm Reject"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RejectReasonModal;
