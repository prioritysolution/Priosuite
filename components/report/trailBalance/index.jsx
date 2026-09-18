"use client";
import { useTranslation } from "react-i18next";
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
import PreviewModal from "./PreviewModal";
import { useReactToPrint } from "react-to-print";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const TrailBalance = ({
  loading,
  form,
  handleSubmit,
  ledgerAssetsTableData,
  ledgerLiablitiesTableData,
  fromDate,
  toDate,
}) => {
  const { t } = useTranslation();
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const printRef = useRef(null);
  const printHostRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `TrailBalance-${fromDate}-${toDate}`,
  });

  const hasReportData =
    ledgerAssetsTableData?.groupedData?.length > 0 ||
    ledgerLiablitiesTableData?.groupedData?.length > 0;

  const waitNextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(resolve));

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const host = printHostRef.current;

    if (!element) {
      toast.error(t("report.trialBalance.nothingToDownload"));
      return;
    }

    if (!hasReportData) {
      toast.error(t("report.trialBalance.noTrialBalanceData"));
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
        toast.error(t("report.trialBalance.failedToCapturePdf"));
        return;
      }

      pdf.save(`TrailBalance-${toDate || "report"}.pdf`);
      toast.success(t("report.trialBalance.pdfDownloaded"));
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? t("report.trialBalance.failedToDownloadPdfWithError", {
              error: error.message,
            })
          : t("report.trialBalance.failedToDownloadPdf"),
      );
    } finally {
      if (host) host.setAttribute("style", prevHostStyle);
      setPdfLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-between  bg-[#fefefe] rounded-lg ">
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
                <h3 className="text-xl font-semibold ">{t("report.trialBalance.trialBalanceReport")}</h3>
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
                  label={t("common.fromDate")}                 
                  disabled
                  allowClear={false}
                />

                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label={t("common.toDate")}                  
                  disabled
                  allowClear={false}
                />

                

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <DropdownField
                      label={t("common.branch")}
                      value={field.value}
                      onChange={field.onChange}
                      options={branchData}
                      optionLabelKey="Branch_Name" // Specify the key for label
                      placeholder={t("common.selectBranch")}
                      searchPlaceholder={t("common.searchBranch")}
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
          <div className="py-4 w-full flex flex-col gap-5  px-3 lg:px-0 overflow-y-hidden">
            <Table className="border border-primary">
              <TableHeader>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead colSpan={6} className=" text-white text-center">
                    {t("report.trialBalance.liabilitiesAndIncome")}
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead rowSpan={2} className="text-white text-center">
                    {t("common.headOfAccount")}
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.openingBalance")}
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.totalDebit")}
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.totalCredit")}
                  </TableHead>
                  <TableHead
                    colSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.closing")}
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead className="text-white border-l border-white text-center">
                    {t("common.breakUp")}
                  </TableHead>
                  <TableHead className="text-white border-l border-white text-center">
                    {t("common.balance")}
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
                      {t("common.grandTotal")}
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
            <p>{t("report.trialBalance.assetsAndExpenditure")}</p>
            <Table className="border border-primary">
              <TableHeader>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead colSpan={6} className=" text-white text-center">
                    {t("report.trialBalance.assetsAndExpenditure")}
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead rowSpan={2} className="text-white text-center">
                    {t("common.headOfAccount")}
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.openingBalance")}
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.totalDebit")}
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.totalCredit")}
                  </TableHead>
                  <TableHead
                    colSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.closing")}
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead className="text-white border-l border-white text-center">
                    {t("common.breakUp")}
                  </TableHead>
                  <TableHead className="text-white border-l border-white text-center">
                    {t("common.balance")}
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
                      {t("common.grandTotal")}
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
              ledgerLiablitiesTableData={ledgerLiablitiesTableData}
              ledgerAssetsTableData={ledgerAssetsTableData}
              fromDate={fromDate}
              toDate={toDate}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};
export default TrailBalance;
