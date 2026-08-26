"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import DropdownField from "@/common/formFields/DropdownField";
import AccountSearchForm from "@/common/forms/AccountSearchForm";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipLoader } from "react-spinners";

const ChangeAccountStatus = ({
  loading,
  getDepositLoading,
  updateAccountStatusLoading,
  form,
  handleSubmit,
  handleAccountFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  depositProduct,
  resetTrigger,
  statusListData,
}) => {
  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Change Account Status</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10">
          <div className="w-full mb-2">
            <AccountSearchForm
              loading={getDepositLoading}
              handleSubmit={handleAccountFormSubmit}
              resetTrigger={resetTrigger}
              allowAlphanumeric
            />
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-2 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Account Details
                  </h3>
                  {getDepositLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
                      {Array.from({ length: 13 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-col gap-[10px]"
                        >
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="memberNo"
                        label="Member No."
                        placeholder="Enter member no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="cifNo"
                        label="CIF No."
                        placeholder="Enter cif no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="accountNo"
                        label="Account No."
                        placeholder="Enter account no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="memberName"
                        label="Member Name"
                        placeholder="Enter member name"
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label="Gurdian Name"
                        placeholder="Enter gurdian name"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="mobile"
                        label="Mobile No."
                        placeholder="Enter mobile no."
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="availableBalance"
                        label="Available Balance"
                        placeholder="Enter available balance"
                        readOnly
                      />

                      <InputField
                        control={form.control}
                        name="currentStatus"
                        label="Current Status"
                        placeholder="Enter current status"
                        readOnly
                      />

                      <DropdownField
                        control={form.control}
                        name="newStatus"
                        label="New Status"
                        options={statusListData}
                        optionLabelKey="Option_Value"
                        placeholder="Select new status"
                        searchPlaceholder="Search news status..."
                        isRequired
                      />
                    </div>
                  )}
                </div>
              )}
              {visibleBlock && (
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={updateAccountStatusLoading}
                >
                  {updateAccountStatusLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Save"
                  )}
                </Button>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default ChangeAccountStatus;
