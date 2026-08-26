"use client";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useRef } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import PreviewModal from "./PreviewModal";
import { cn } from "@/lib/utils";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";

const PlAppropiation = ({
  loading,
  form,
  handleSubmit,
  ledgerExpenditureTableData,
  ledgerIncomeTableData,
  totalExpenditure,
  totalIncome,
  asOnDate,
}) => {
  const [showReportForm, setShowReportForm] = useState(true);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const printRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `PLAppropiation-${asOnDate}`,
  });

    const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      const isLandscape = false;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF(isLandscape ? "l" : "p", "mm", "a4");
      const imgWidth = isLandscape ? 297 : 210;
      const pageHeight = isLandscape ? 210 : 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 15) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`ProfitLoss-${toDate}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-10 justify-between"
            autoComplete="off"
          >
            <div className="w-full flex flex-col border border-primary rounded-lg overflow-hidden">
              <div
                className={cn(
                  "flex items-center justify-between p-5 py-2 bg-primary/10",
                  {
                    "border-b border-primary transition-all duration-300 ":
                      showReportForm,
                  },
                )}
              >
                <div />
                <h3 className="text-xl font-semibold ">
                  PL Appropiation Report
                </h3>
                <div
                  onClick={() => setShowReportForm((prev) => !prev)}
                  className="text-primary text-xl cursor-pointer"
                >
                  {showReportForm ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 px-5",
                  showReportForm
                    ? "max-h-[1000px] py-2"
                    : "max-h-0 py-0 pointer-events-none opacity-0",
                )}
              >
                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label="As On Date"
                  startYear={2000}
                  endYear={2050}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <DropdownField
                      label="Branch"
                      value={field.value}
                      onChange={field.onChange}
                      options={branchData}
                      optionLabelKey="Branch_Name" // Specify the key for label
                      placeholder="Select branch"
                      searchPlaceholder="Search branch..."
                    />
                  )}
                />

                <div className="w-full flex items-center gap-5 self-end">
                  <Button
                    disabled={loading}
                    className="w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center"
                  >
                    {loading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      <PiFileMagnifyingGlassBold />
                    )}
                  </Button>
                  <div
                    onClick={() => {
                      if (
                        ledgerExpenditureTableData?.length > 0 ||
                        ledgerIncomeTableData?.length > 0
                      )
                        generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          ledgerExpenditureTableData?.length > 0 ||
                          ledgerIncomeTableData?.length > 0
                        ),
                      },
                    )}
                  >
                    <HiMiniPrinter />
                  </div>
                  <div
                    onClick={() => {
                      if (
                        ledgerExpenditureTableData?.length > 0 ||
                        ledgerIncomeTableData?.length > 0
                      )
                        handleDownloadPDF();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          ledgerExpenditureTableData?.length > 0 ||
                          ledgerIncomeTableData?.length > 0
                        ),
                      },
                    )}
                  >
                    <FiDownload />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>

        <ScrollArea className=" rounded-md border w-[300px] sm:w-full overflow-y-hidden">
          <div className="py-4 w-full flex  gap-5  px-3 lg:px-0 overflow-y-hidden">
            <div className=" w-full">
              <Table className="border border-primary">
                <TableHeader>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className="text-white text-center">
                      Expenditure
                    </TableHead>

                    <TableHead className="text-white border-l border-white text-center">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerExpenditureTableData &&
                    ledgerExpenditureTableData.length > 0 &&
                    ledgerExpenditureTableData.map((data, index) => (
                      <Fragment key={index}>
                        {data?.Heading_Name && (
                          <TableRow>
                            <TableCell className="font-semibold border border-secondary bg-gray-50">
                              {data.Heading_Name}
                            </TableCell>
                            <TableCell className="font-semibold border border-secondary bg-gray-50">
                              {data.Amount}
                            </TableCell>
                          </TableRow>
                        )}
                        {/* Rows for each group */}
                        {data.Ledger_Name && (
                          <TableRow>
                            <TableCell className="border border-secondary">
                              {data.Ledger_Name}
                            </TableCell>

                            <TableCell className="border border-secondary">
                              {data.Amount}
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Subtotal row for each group */}
                      </Fragment>
                    ))}

                  <TableRow className="">
                    <TableCell className="font-semibold border border-secondary">
                      Grand Total
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {totalExpenditure.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className=" w-full">
              <Table className="border border-primary">
                <TableHeader>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className="text-white text-center">
                      Income
                    </TableHead>

                    <TableHead className="text-white border-l border-white text-center">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerIncomeTableData &&
                    ledgerIncomeTableData.length > 0 &&
                    ledgerIncomeTableData.map((data, index) => (
                      <Fragment key={index}>
                        {data?.Heading_Name && (
                          <TableRow>
                            <TableCell className="font-semibold border border-secondary bg-gray-50">
                              {data.Heading_Name}
                            </TableCell>
                            <TableCell className="font-semibold border border-secondary bg-gray-50">
                              {data.Amount}
                            </TableCell>
                          </TableRow>
                        )}
                        {/* Rows for each group */}
                        {data.Ledger_Name && (
                          <TableRow>
                            <TableCell className="border border-secondary">
                              {data.Ledger_Name}
                            </TableCell>

                            <TableCell className="border border-secondary">
                              {data.Amount}
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Subtotal row for each group */}
                      </Fragment>
                    ))}

                  <TableRow className="">
                    <TableCell className="font-semibold border border-secondary">
                      Grand Total
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {totalIncome.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <PreviewModal
          printRef={printRef}
          ledgerTableExpenditureData={ledgerExpenditureTableData}
          ledgerTableIncomeData={ledgerIncomeTableData}
          totalExpenditure={totalExpenditure}
          totalIncome={totalIncome}
          asOnDate={asOnDate}
        />
      </div>
    </div>
  );
};
export default PlAppropiation;
