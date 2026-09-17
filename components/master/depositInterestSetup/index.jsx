"use client";

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
import InputField from "@/common/formFields/InputField";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const DepositInterestSetup = ({
  loading,
  handleSubmit,
  handleAddTableData,
  form,
  tableData,
}) => {
  const depositInterestProductData = useSelector(
    (state) => state?.depositInterestSetup?.depositInterestProductData,
  );

  const durationUnitData = useSelector(
    (state) => state?.openDepositAccount?.durationTypeData,
  );

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold">Deposit Interest Setup</h3>
        <ScrollArea className="w-full h-full">
          <div className="w-full h-full flex flex-col gap-5 py-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddTableData)}
                className="w-full h-full"
                autoComplete="off"
              >
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                    <DropdownField
                      control={form.control}
                      name="productId"
                      label="Product"
                      options={depositInterestProductData}
                      optionLabelKey="Prd_SH_Name"
                      placeholder="Select product"
                      searchPlaceholder="Search product..."
                    />

                    <DatePickerField
                      control={form.control}
                      name="effectFrom"
                      label="Effect From Date"
                      startYear={2000}
                      disabledDateAfter={new Date()}
                    />

                    <InputField
                      control={form.control}
                      name="minimumDuration"
                      label="Minimum Duration"
                      placeholder="Enter minimum duration"
                      type="number"
                    />

                    <InputField
                      control={form.control}
                      name="maximumDuration"
                      label="Maximum Duration"
                      placeholder="Enter maximum duration"
                      type="number"
                    />

                    <DropdownField
                      control={form.control}
                      name="durationUnit"
                      label="Duration Unit"
                      options={durationUnitData}
                      optionLabelKey="Option_Value"
                      placeholder="Select duration unit"
                      searchPlaceholder="Search duration unit..."
                    />

                    <InputField
                      control={form.control}
                      name="rateOfInterest"
                      label="Rate Of Interest"
                      placeholder="Enter rate of interest"
                      type="number"
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-1/5 self-end">Add</Button>
                </div>
              </form>
            </Form>

            <div className="w-full border border-primary rounded-md">
              <ScrollArea className="w-full">
                <Table>
                  {tableData && tableData.length !== 0 && (
                    <TableCaption className="mb-5">
                      A list of your deposit interest of product.
                    </TableCaption>
                  )}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        Product Name
                      </TableHead>
                      <TableHead className="text-center">Effect From</TableHead>
                      <TableHead className="text-center">
                        Rate Of Interest
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData && tableData.length !== 0 ? (
                      tableData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">
                            {data.productName}
                          </TableCell>
                          <TableCell className="text-center">
                            {data.effect_frm}
                          </TableCell>
                          <TableCell className="text-center">
                            {data.roi}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="h-24 text-center text-gray-500"
                        >
                          No data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full sm:w-1/5 self-end"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default DepositInterestSetup;
