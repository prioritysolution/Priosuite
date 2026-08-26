"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const Provision = ({
  loading,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
}) => {
  const ledgerListData = useSelector(
    (state) => state?.voucherEntry?.ledgerList
  );

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" flex border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              <div className="w-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <h3 className="w-full text-center text-xl font-semibold">
                  Provision
                </h3>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <DatePickerField
                    control={form.control}
                    name="date"
                    label="Date"
                    // startYear={2000}
                    // endYear={2050}
                    disabled
                  />

                  <FormField
                    control={form.control}
                    name="ledger"
                    render={({ field }) => (
                      <DropdownField
                        label="Ledger"
                        value={field.value}
                        onChange={field.onChange}
                        options={ledgerListData || []}
                        optionLabelKey="Ledger_Name" // Specify the key for label
                        placeholder="Select ledger"
                        searchPlaceholder="Search ledger..."
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provisionType"
                    render={({ field }) => (
                      <DropdownField
                        label="Provision Type"
                        value={field.value}
                        onChange={field.onChange}
                        options={[
                          { Id: "C", Label: "Cr" },
                          { Id: "D", Label: "Dr" },
                        ]}
                        optionLabelKey="Label" // Specify the key for label
                        placeholder="Select provision type"
                        searchPlaceholder="Search provision type..."
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="percent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provision Percent</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter provision percent"
                            type="number"
                            {...field}
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
                        <FormLabel>Provision Amount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter provision amount"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button className="self-end w-full sm:w-1/5" type="submit">
                {loading ? (
                  <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
                ) : (
                  "Post"
                )}
              </Button>
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
export default Provision;
