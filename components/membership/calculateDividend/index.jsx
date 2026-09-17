"use client";
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
import { DatePickerField } from "@/common/formFields/DatePickerField";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef } from "react";
import PreviewModal from "./PreviewModal";
import { useReactToPrint } from "react-to-print";
import { cn } from "@/lib/utils";

const CalculateDividend = ({
  loading,
  form,
  handleSubmit,
  tableData,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  handleCalculateDividend,
}) => {
  const printRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Dividend List",
  });

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 sm:px-10 2xl:px-10">
        <h3 className="text-2xl font-semibold">Calculate Dividend</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-2 justify-between h-full overflow-hidden"
            autoComplete="off"
          >
            {/* ---------------- Account Info Block (Fixed) ---------------- */}
            <div className="w-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2 flex-none">
              <h3 className="w-full text-center text-xl font-semibold">
                Account Info Block
              </h3>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                <DatePickerField
                  control={form.control}
                  name="fromDate"
                  label="From Date"
                />

                <DatePickerField
                  control={form.control}
                  name="uptoDate"
                  label="Upto Date"
                />

                <InputField
                  control={form.control}
                  name="dividendRate"
                  label="Dividend Rate"
                  placeholder="Enter rate"
                  type="number"
                />

                <div
                  onClick={handleCalculateDividend}
                  className="w-full py-2 h-fit self-end text-center text-white bg-primary rounded-md cursor-pointer"
                >
                  Calculate Dividend
                </div>
                <div
                  onClick={() => {
                    if (tableData && tableData.length > 0) generatePrint();
                  }}
                  className={cn(
                    "w-full py-2 text-center text-white bg-primary rounded-md cursor-pointer",
                    {
                      "bg-primary/70 cursor-not-allowed":
                        !tableData || tableData.length < 1,
                    },
                  )}
                >
                  Preview
                </div>
              </div>
            </div>

            {/* ---------------- Scrollable Section (Table + Posting Block scroll together) ---------------- */}
            <div className="flex flex-col border border-primary rounded-lg p-2 w-full gap-2 flex-1 overflow-y-auto">
              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Sl.</TableHead>
                    <TableHead>Member Code</TableHead>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Guardian Name</TableHead>
                    <TableHead>Village</TableHead>
                    <TableHead>Share Balance</TableHead>
                    <TableHead className="text-right">
                      Dividend Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.CIF_No}</TableCell>
                      <TableCell>{data?.Full_Name}</TableCell>
                      <TableCell>{data?.Relation_Name}</TableCell>
                      <TableCell>{data?.Village}</TableCell>
                      <TableCell>{data?.Balance}</TableCell>
                      <TableCell className="text-right">
                        {data?.Dividend}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6}>Total</TableCell>
                    <TableCell className="text-right">
                      {tableData?.reduce((sum, item) => sum + item.Dividend, 0)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>

              <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                <DatePickerField
                  control={form.control}
                  name="postingDate"
                  label="Posting Date"
                />

                <Button
                  type="submit"
                  className="w-full self-end"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Post Payble"
                  )}
                </Button>
              </div>

              {/* Posting Block (scrolls together with table) */}
            </div>
          </form>
        </Form>
      </div>

      {/* Hidden print preview */}
      <div className="hidden">
        <PreviewModal tableData={tableData} printRef={printRef} />
      </div>

      {/* Success message dialog */}
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default CalculateDividend;
