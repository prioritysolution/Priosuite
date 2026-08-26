"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import InterestDetailsTable from "@/common/tables/InterestDetailsTable";
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
import { useForm } from "react-hook-form";

const InterestPosting = () => {
  const form = useForm();
  const visibleBlock = true;
  const successMessage = "";
  const showSuccessMessage = false;
  const handleCloseSuccessMessage = () => {};
  const handleSubmit = () => {};

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Interest Posting</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Interest Info Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <DropdownField
                      control={form.control}
                      name="productId"
                      label="Product"
                      options={[]}
                      optionLabelKey="Option_Value"
                      placeholder="Select product"
                      searchPlaceholder="Search product..."
                    />

                    <DatePickerField
                      control={form.control}
                      name="fromDate"
                      label="From Date"
                      startYear={2000}
                      endYear={2050}
                    />

                    <DatePickerField
                      control={form.control}
                      name="toDate"
                      label="To Date"
                      startYear={2000}
                      endYear={2050}
                    />
                  </div>
                  <div className="w-full mt-5">
                    <InterestDetailsTable
                      data={[]}
                      handleClickData={() => {}}
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Amount Block
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <DatePickerField
                      control={form.control}
                      name="postingDate"
                      label="Posting Date"
                      startYear={2000}
                      endYear={2050}
                    />

                    <InputField
                      control={form.control}
                      name="interestAmount"
                      label="Interest Amount"
                      placeholder="Enter interest amount"
                    />
                  </div>
                </div>
              )}

              {visibleBlock && (
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  // disabled={
                  //   Number(cashInTransactionGrandTotal) -
                  //     Number(cashOutTransactionGrandTotal) !==
                  //   Number(form.getValues("refundAmt"))
                  // }
                >
                  Add
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
export default InterestPosting;
