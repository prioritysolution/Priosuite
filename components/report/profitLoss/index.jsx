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
import { Fragment, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import PreviewModal from "./PreviewModal";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const ProfitLoss = ({
  loading,
  form,
  handleSubmit,
  ledgerExpenditureTableData,
  ledgerIncomeTableData,
  netData,
  fromDate,
  toDate,
}) => {
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const printRef = useRef(null);
  const printHostRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `ProfitLoss-${fromDate}-${toDate}`,
  });

  const hasReportData =
    ledgerExpenditureTableData?.groupedData?.length > 0 ||
    ledgerIncomeTableData?.groupedData?.length > 0;

  const waitNextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(resolve));

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const host = printHostRef.current;

    if (!element) {
      toast.error("Nothing to download. Please generate the report first.");
      return;
    }

    if (!hasReportData) {
      toast.error("No profit & loss data to download.");
      return;
    }

    const prevHostStyle = host?.getAttribute("style") || "";

    try {
      setPdfLoading(true);

      if (host) {
        host.setAttribute(
          "style",
          "position:fixed;left:0;top:0;width:210mm;background:#ffffff;pointer-events:none;z-index:2147483646;opacity:0.01;",
        );
      }
      await waitNextFrame();

      const pageNodes = Array.from(
        element.querySelectorAll("[data-print-page='true']"),
      );
      const pagesToCapture = pageNodes.length > 0 ? pageNodes : [element];

      const captureOptions = {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 0,
        removeContainer: true,
        foreignObjectRendering: false,
      };

      const BATCH_SIZE = 3;
      const pageImages = [];

      for (let i = 0; i < pagesToCapture.length; i += BATCH_SIZE) {
        const batch = pagesToCapture.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(async (pageEl) => {
            const canvas = await html2canvas(pageEl, captureOptions);
            if (!canvas?.width || !canvas?.height) return null;
            return canvas.toDataURL("image/jpeg", 0.75);
          }),
        );
        pageImages.push(...batchResults);
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const pageWidth = 210;
      const pageHeight = 297;
      let pagesAdded = 0;

      for (let i = 0; i < pageImages.length; i += 1) {
        const imgData = pageImages[i];
        if (!imgData) continue;

        if (pagesAdded > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
        pagesAdded += 1;
      }

      if (pagesAdded < 1) {
        toast.error("Failed to capture report for PDF.");
        return;
      }

      pdf.save(`ProfitLoss-${toDate || "report"}.pdf`);
      toast.success("PDF downloaded");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",
      );
    } finally {
      if (host) host.setAttribute("style", prevHostStyle);
      setPdfLoading(false);
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
                  Profit &amp; Loss Report
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
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (hasReportData) generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400": !hasReportData,
                      },
                    )}
                  >
                    <HiMiniPrinter />
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (loading || pdfLoading) return;
                      if (hasReportData) handleDownloadPDF();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (loading || pdfLoading) return;
                        if (hasReportData) handleDownloadPDF();
                      }
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400":
                          pdfLoading || loading || !hasReportData,
                      },
                    )}
                  >
                    {pdfLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      <FiDownload />
                    )}
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
                      Break Up
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Balance
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerExpenditureTableData &&
                    ledgerExpenditureTableData?.groupedData &&
                    ledgerExpenditureTableData?.groupedData.map(
                      (group, index) => (
                        <Fragment key={index}>
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              className="font-semibold border border-secondary bg-gray-50"
                            >
                              {group.headName}
                            </TableCell>
                            <TableCell className="font-semibold border border-secondary bg-gray-50">
                              {group.subtotalAmount &&
                                group.subtotalAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          {/* Rows for each group */}
                          {group.transactions.map((data, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="border border-secondary">
                                {data.Ledger_Name}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data.Amount}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data.Debit}
                              </TableCell>
                            </TableRow>
                          ))}

                          {/* Subtotal row for each group */}
                        </Fragment>
                      ),
                    )}

                  {/* Grand total row */}
                  <TableRow className="border-t-2 border-black">
                    <TableCell
                      colSpan={2}
                      className="font-semibold border border-secondary"
                    >
                      Sub Total
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerExpenditureTableData &&
                        ledgerExpenditureTableData?.grandTotals &&
                        ledgerExpenditureTableData?.grandTotals
                          .grandTotalAmount &&
                        ledgerExpenditureTableData?.grandTotals.grandTotalAmount.toFixed(
                          2,
                        )}
                    </TableCell>
                  </TableRow>
                  {netData &&
                    netData.length > 0 &&
                    netData[0].Position === "L" && (
                      <TableRow className="">
                        <TableCell
                          colSpan={2}
                          className="font-semibold border border-secondary"
                        >
                          {netData &&
                            netData.length > 0 &&
                            netData[0].Head_Name}
                        </TableCell>
                        <TableCell className="font-semibold border border-secondary">
                          {netData &&
                            netData.length > 0 &&
                            netData[0].Amount &&
                            parseFloat(netData[0].Amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                  <TableRow className="">
                    <TableCell
                      colSpan={2}
                      className="font-semibold border border-secondary"
                    >
                      Grand Total
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {(
                        (ledgerExpenditureTableData &&
                        ledgerExpenditureTableData.grandTotals &&
                        ledgerExpenditureTableData.grandTotals.grandTotalAmount
                          ? parseFloat(
                              ledgerExpenditureTableData.grandTotals
                                .grandTotalAmount,
                            )
                          : 0) +
                        (netData &&
                        netData.length > 0 &&
                        netData[0].Position === "L" &&
                        netData[0].Amount
                          ? parseFloat(netData[0].Amount)
                          : 0)
                      ).toFixed(2)}
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
                      Break Up
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Balance
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerIncomeTableData &&
                    ledgerIncomeTableData?.groupedData &&
                    ledgerIncomeTableData?.groupedData.map((group, index) => (
                      <Fragment key={index}>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="font-semibold border border-secondary bg-gray-50"
                          >
                            {group.headName}
                          </TableCell>
                          <TableCell className="font-semibold border border-secondary bg-gray-50">
                            {group.subtotalAmount &&
                              group.subtotalAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        {/* Rows for each group */}
                        {group.transactions.map((data, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="border border-secondary">
                              {data.Ledger_Name}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data.Amount}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data.Debit}
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Subtotal row for each group */}
                      </Fragment>
                    ))}

                  {/* Grand total row */}
                  <TableRow className="border-t-2 border-black">
                    <TableCell
                      colSpan={2}
                      className="font-semibold border border-secondary"
                    >
                      Sub Total
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {ledgerIncomeTableData &&
                        ledgerIncomeTableData?.grandTotals &&
                        ledgerIncomeTableData?.grandTotals.grandTotalAmount &&
                        ledgerIncomeTableData?.grandTotals.grandTotalAmount.toFixed(
                          2,
                        )}
                    </TableCell>
                  </TableRow>
                  {netData &&
                    netData.length > 0 &&
                    netData[0].Position === "R" && (
                      <TableRow className="">
                        <TableCell
                          colSpan={2}
                          className="font-semibold border border-secondary"
                        >
                          {netData &&
                            netData.length > 0 &&
                            netData[0].Head_Name}
                        </TableCell>
                        <TableCell className="font-semibold border border-secondary">
                          {netData &&
                            netData.length > 0 &&
                            parseFloat(netData[0].Amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                  <TableRow className="">
                    <TableCell
                      colSpan={2}
                      className="font-semibold border border-secondary"
                    >
                      Grand Total
                    </TableCell>
                    <TableCell className="font-semibold border border-secondary">
                      {(
                        (ledgerIncomeTableData &&
                        ledgerIncomeTableData.grandTotals &&
                        ledgerIncomeTableData.grandTotals.grandTotalAmount
                          ? parseFloat(
                              ledgerIncomeTableData.grandTotals
                                .grandTotalAmount,
                            )
                          : 0) +
                        (netData &&
                        netData.length > 0 &&
                        netData[0].Position === "R" &&
                        netData[0].Amount
                          ? parseFloat(netData[0].Amount)
                          : 0)
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <div
            ref={printHostRef}
            aria-hidden
            style={{
              position: "fixed",
              left: "-10000px",
              top: 0,
              width: "210mm",
              background: "#ffffff",
              pointerEvents: "none",
              zIndex: -1,
            }}
          >
            <PreviewModal
              printRef={printRef}
              ledgerTableExpenditureData={ledgerExpenditureTableData}
              ledgerTableIncomeData={ledgerIncomeTableData}
              netData={netData}
              fromDate={fromDate}
              toDate={toDate}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};
export default ProfitLoss;
