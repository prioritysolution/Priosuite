"use client";

import MemberSearchForm from "@/common/forms/MemberSearchForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import SuccessMessage from "@/common/dialog/SuccessMessage";

const Membership = ({
  loading,
  getMemberDataLoading,
  postMembershipLoading,
  form,
  handleSubmit,
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  resetTrigger,
}) => {
  const rectifyTypeData = useSelector(
    (state) => state?.rectifyMembership?.rectifyTypeData
  );

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Rectify Membership</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between mb-10"
              autoComplete="off"
            >
              <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                  <FormField
                    control={form.control}
                    name="rectifyTypeId"
                    render={({ field }) => (
                      <DropdownField
                        label="Rectify Type"
                        value={field.value}
                        onChange={field.onChange}
                        options={rectifyTypeData}
                        optionLabelKey="Option_Value" // Specify the key for label
                        placeholder="Select rectify type"
                        searchPlaceholder="Search rectify type..."
                      />
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>

          <div className="w-full mb-10">
            <MemberSearchForm
              handleSubmit={handleMemberFormSubmit}
              loading={getMemberDataLoading}
              resetTrigger={resetTrigger}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Basic Info Block
                  </h3>

                  {getMemberDataLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-20 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <DatePickerField
                        control={form.control}
                        name="transDate"
                        label="Transaction Date"
                        disabled
                      />

                      <FormField
                        control={form.control}
                        name="memberName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Member Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter member name"
                                {...field}
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gurdianName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gurdian Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter gurdian name"
                                {...field}
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter address"
                                {...field}
                                className="resize-none"
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="transMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trans Mode</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter trans mode"
                                {...field}
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter amount"
                                readOnly
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={
                    postMembershipLoading
                    // insufficientBalanceDisable ||
                    // !Number(form.getValues("totalAmt")) ||
                    // Number(cashInTransactionGrandTotal) -
                    //   Number(cashOutTransactionGrandTotal) !==
                    //   Number(form.getValues("totalAmt"))
                  }
                >
                  {postMembershipLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Rectify"
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
export default Membership;
