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
import PreviewModal from "./PreviewModal";
import { useReactToPrint } from "react-to-print";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";

const TrailBalance = ({
  loading,
  form,
  handleSubmit,
  ledgerAssetsTableData,
  ledgerLiablitiesTableData,
  fromDate,
  toDate,
}) => {
  const [showReportForm, setShowReportForm] = useState(true);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const printRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `TrailBalance-${fromDate}-${toDate}`,
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
      pdf.save(`TrailBalance-${toDate}.pdf`);
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
                <h3 className="text-xl font-semibold ">Trial Balance Report</h3>
                <div
                  onClick={() => setShowReportForm((prev) => !prev)}
                  className="text-primary text-xl cursor-pointer"
                >
                  {showReportForm ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 px-5",
                  showReportForm
                    ? "max-h-[1000px] py-2"
                    : "max-h-0 py-0 pointer-events-none opacity-0",
                )}
              >
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
                        ledgerAssetsTableData?.groupedData?.length > 0 ||
                        ledgerLiablitiesTableData?.groupedData?.length > 0
                      )
                        generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          ledgerAssetsTableData?.groupedData?.length > 0 ||
                          ledgerLiablitiesTableData?.groupedData?.length > 0
                        ),
                      },
                    )}
                  >
                    <HiMiniPrinter />
                  </div>
                  <div
                    onClick={() => {
                      if (
                        ledgerAssetsTableData?.groupedData?.length > 0 ||
                        ledgerLiablitiesTableData?.groupedData?.length > 0
                      )
                        handleDownloadPDF();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          ledgerAssetsTableData?.groupedData?.length > 0 ||
                          ledgerLiablitiesTableData?.groupedData?.length > 0
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
          <div className="py-4 w-full flex flex-col gap-5  px-3 lg:px-0 overflow-y-hidden">
            <Table className="border border-primary">
              <TableHeader>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead colSpan={6} className=" text-white text-center">
                    LIABLITIES & INCOME
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead rowSpan={2} className="text-white text-center">
                    Head Of Account
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Opening Balance
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Total Debit
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Total Credit
                  </TableHead>
                  <TableHead
                    colSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Closing
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead className="text-white border-l border-white text-center">
                    Break Up
                  </TableHead>
                  <TableHead className="text-white border-l border-white text-center">
                    Balance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                      </TableRow>
                    ))
                  : ledgerLiablitiesTableData &&
                    ledgerLiablitiesTableData.groupedData &&
                    ledgerLiablitiesTableData.groupedData.map(
                      (group, index) => (
                        <Fragment key={index}>
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="font-semibold border border-secondary bg-gray-50"
                            >
                              {group.headName}
                            </TableCell>
                          </TableRow>
                          {/* Rows for each group */}
                          {group.transactions.map((data, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="border border-secondary">
                                {data.Ledgare_Name}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data.Opening} {data.Opening_Type}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data.Debit}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data.Credit}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data.Closing} {data.Closing_Type}
                              </TableCell>
                              <TableCell className="border border-secondary"></TableCell>
                            </TableRow>
                          ))}

                          {/* Subtotal row for each group */}
                          <TableRow className="border-t-2 border-t-black border-dashed">
                            <TableCell
                              colSpan={5}
                              className=" border-l border-secondary"
                            ></TableCell>
                            <TableCell className="font-medium border-r border-secondary">
                              {group.subtotalClosing.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      ),
                    )}

                {/* Grand total row */}
                {!loading && (
                  <TableRow className="border-t-2 border-black">
                    <TableCell className="font-semibold border border-secondary">
                      Grand Total
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerLiablitiesTableData &&
                        ledgerLiablitiesTableData.grandTotals &&
                        ledgerLiablitiesTableData.grandTotals
                          .grandTotalOpening &&
                        ledgerLiablitiesTableData.grandTotals.grandTotalOpening.toFixed(
                          2,
                        )}
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerLiablitiesTableData &&
                        ledgerLiablitiesTableData.grandTotals &&
                        ledgerLiablitiesTableData.grandTotals.grandTotalDebit &&
                        ledgerLiablitiesTableData.grandTotals.grandTotalDebit.toFixed(
                          2,
                        )}
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerLiablitiesTableData &&
                        ledgerLiablitiesTableData.grandTotals &&
                        ledgerLiablitiesTableData.grandTotals
                          .grandTotalCredit &&
                        ledgerLiablitiesTableData.grandTotals.grandTotalCredit.toFixed(
                          2,
                        )}
                    </TableCell>
                    <TableCell className=""></TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerLiablitiesTableData &&
                        ledgerLiablitiesTableData.grandTotals &&
                        ledgerLiablitiesTableData.grandTotals
                          .grandTotalClosing &&
                        ledgerLiablitiesTableData.grandTotals.grandTotalClosing.toFixed(
                          2,
                        )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <p>ASSETS & EXPENDITURE</p>
            <Table className="border border-primary">
              <TableHeader>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead colSpan={6} className=" text-white text-center">
                    ASSETS & EXPENDITURE
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead rowSpan={2} className="text-white text-center">
                    Head Of Account
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Opening Balance
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Total Debit
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Total Credit
                  </TableHead>
                  <TableHead
                    colSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Closing
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead className="text-white border-l border-white text-center">
                    Break Up
                  </TableHead>
                  <TableHead className="text-white border-l border-white text-center">
                    Balance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                      </TableRow>
                    ))
                  : ledgerAssetsTableData &&
                    ledgerAssetsTableData.groupedData &&
                    ledgerAssetsTableData.groupedData.map((group, index) => (
                      <Fragment key={index}>
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="font-semibold border border-secondary bg-gray-50"
                          >
                            {group.headName}
                          </TableCell>
                        </TableRow>
                        {/* Rows for each group */}
                        {group.transactions.map((data, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="border border-secondary">
                              {data.Ledgare_Name}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data.Opening} {data.Opening_Type}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data.Debit}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data.Credit}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data.Closing} {data.Closing_Type}
                            </TableCell>
                            <TableCell className="border border-secondary"></TableCell>
                          </TableRow>
                        ))}

                        {/* Subtotal row for each group */}
                        <TableRow className="border-t-2 border-t-black border-dashed">
                          <TableCell
                            colSpan={5}
                            className=" border-l border-secondary"
                          ></TableCell>
                          <TableCell className="font-medium border-r border-secondary">
                            {group.subtotalClosing.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    ))}

                {/* Grand total row */}
                {!loading && (
                  <TableRow className="border-t-2 border-black">
                    <TableCell className="font-semibold border border-secondary">
                      Grand Total
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerAssetsTableData &&
                        ledgerAssetsTableData.grandTotals &&
                        ledgerAssetsTableData.grandTotals.grandTotalOpening &&
                        ledgerAssetsTableData.grandTotals.grandTotalOpening.toFixed(
                          2,
                        )}
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerAssetsTableData &&
                        ledgerAssetsTableData.grandTotals &&
                        ledgerAssetsTableData.grandTotals.grandTotalDebit &&
                        ledgerAssetsTableData.grandTotals.grandTotalDebit.toFixed(
                          2,
                        )}
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerAssetsTableData &&
                        ledgerAssetsTableData.grandTotals &&
                        ledgerAssetsTableData.grandTotals.grandTotalCredit &&
                        ledgerAssetsTableData.grandTotals.grandTotalCredit.toFixed(
                          2,
                        )}
                    </TableCell>
                    <TableCell className=""></TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerAssetsTableData &&
                        ledgerAssetsTableData.grandTotals &&
                        ledgerAssetsTableData.grandTotals.grandTotalClosing &&
                        ledgerAssetsTableData.grandTotals.grandTotalClosing.toFixed(
                          2,
                        )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <PreviewModal
          printRef={printRef}
          ledgerLiablitiesTableData={ledgerLiablitiesTableData}
          ledgerAssetsTableData={ledgerAssetsTableData}
          fromDate={fromDate}
          toDate={toDate}
        />
      </div>
    </div>
  );
};
export default TrailBalance;
