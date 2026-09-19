"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSelector } from "react-redux";
import DetailedListTable from "./DetailedListTable";
import InvestmentLedger from "@/common/ledger/investmentLedger/InvestmentLedger";
import { ClipLoader } from "react-spinners";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import DetailedListPreview from "./DetailedListPreview";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const InvestmentReport = ({
  loading,
  form,
  handleSubmit,
  tableData,
  toDate,
  showData,
  handleShowLedger,
  showLedger,
  setShowLedger,
  getLedgerLoading,
  ledgerHeaderData,
  ledgerTableData,
  totalLedgerWithdrawn,
  totalLedgerDeposit,
  userName,
  currentDate,
  currentTime,
  fromDate,
}) => {
  const { t } = useTranslation();
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const reportTypeData = useSelector(
    (state) => state?.memberReport?.reportTypeData,
  );

  const printDetailedListRef = useRef(null);
  const printHostRef = useRef(null);

  const generateDetailedListPrint = useReactToPrint({
    contentRef: printDetailedListRef,
    documentTitle: `InvestmentDetailedList-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const formatReportDate = (value) =>
    value ? format(value, "dd-MM-yyyy") : "";

  const waitNextFrame = () =>
    new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

  const handleDownloadPDF = async () => {
    let element = null;
    let docTitle = "InvestmentReport";

    if (showData === "114") {
      element = printDetailedListRef.current;
      docTitle = `InvestmentDetailedList-${formatReportDate(fromDate)}-${formatReportDate(toDate)}`;
    }

    const host = printHostRef.current;

    if (!element) {
      toast.error("Nothing to download. Please generate the report first.");
      return;
    }

    if (!(tableData?.length > 0)) {
      toast.error("No investment report data to download.");
      return;
    }

    const pageWidth = 210;
    const pageHeight = 297;
    const prevHostStyle = host?.getAttribute("style") || "";

    try {
      setPdfLoading(true);

      if (host) {
        host.setAttribute(
          "style",
          "position:fixed;left:-10000px;top:0;width:210mm;background:#ffffff;pointer-events:none;z-index:-1;opacity:1;",
        );
      }
      await waitNextFrame();

      const pageNodes = Array.from(
        element.querySelectorAll("[data-print-page='true']"),
      );
      const pagesToCapture = pageNodes.length > 0 ? pageNodes : [element];

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const captureScale = Math.max(2, window.devicePixelRatio || 1);
      let pagesAdded = 0;

      for (let i = 0; i < pagesToCapture.length; i += 1) {
        const pageEl = pagesToCapture[i];

        const canvas = await html2canvas(pageEl, {
          scale: captureScale,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          scrollX: 0,
          scrollY: 0,
          width: pageEl.scrollWidth,
          height: pageEl.scrollHeight,
          windowWidth: pageEl.scrollWidth,
          windowHeight: pageEl.scrollHeight,
          onclone: (clonedDoc) => {
            clonedDoc.querySelectorAll("*").forEach((node) => {
              if (!(node instanceof HTMLElement)) return;
              const tag = node.tagName;
              if (
                [
                  "TABLE",
                  "THEAD",
                  "TBODY",
                  "TFOOT",
                  "TR",
                  "TH",
                  "TD",
                  "COL",
                  "COLGROUP",
                ].includes(tag)
              ) {
                return;
              }
              node.style.overflow = "visible";
              node.style.boxShadow = "none";
              node.style.transform = "none";
            });
          },
        });

        if (!canvas?.width || !canvas?.height) continue;

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const renderHeight = Math.min(imgHeight, pageHeight);

        if (pagesAdded > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, renderHeight);
        pagesAdded += 1;
      }

      if (pagesAdded < 1) {
        toast.error("Failed to capture report for PDF.");
        return;
      }

      pdf.save(`${docTitle}.pdf`);
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
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden sm:px-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-10 justify-between"
            autoComplete="off"
          >
            <div className="w-full flex flex-col border border-primary rounded-lg overflow-hidden">
              <div
                className={cn(
                  "flex items-center justify-between p-5  py-2 bg-primary/10",
                  {
                    "border-b border-primary transition-all duration-300 ":
                      showReportForm,
                  },
                )}
              >
                <div />
                <h3 className="text-xl font-semibold ">
                  {t("investment.investmentReport")}
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
                  name="fromDate"
                  label={t("common.fromDate")}
                  startYear={2000}
                  endYear={2050}
                />

                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label={t("common.toDate")}
                  startYear={2000}
                  endYear={2050}
                />

                <DropdownField
                  control={form.control}
                  name="reportType"
                  label={t("common.reportType")}
                  options={reportTypeData}
                  optionLabelKey="Option_Value"
                  placeholder={t("common.selectReportType")}
                  searchPlaceholder={t("common.searchReportType")}
                />

                <DropdownField
                  control={form.control}
                  name="branch"
                  label={t("common.branch")}
                  options={branchData}
                  optionLabelKey="Branch_Name"
                  placeholder={t("common.selectBranch")}
                  searchPlaceholder={t("common.searchBranch")}
                />

                <div className="w-full flex items-center gap-5 self-end">
                  <Button className="w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center">
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
                      if (tableData?.length > 0)
                        showData === "114" ? generateDetailedListPrint() : null;
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          tableData?.length > 0
                        ),
                      },
                    )}
                  >
                    <HiMiniPrinter />
                  </div>
                  <div
                    onClick={() => {
                      if (tableData?.length > 0 && !pdfLoading)
                        handleDownloadPDF();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ":
                          !(tableData?.length > 0) || pdfLoading,
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

        {showData && showData.length > 0 && (
          <div className="w-full border border-primary overflow-hidden rounded-lg">
            <div className="w-full h-full flex flex-col overflow-x-scroll">
              {showData === "114" ? (
                <DetailedListTable
                  tableData={tableData}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
      <InvestmentLedger
        loading={getLedgerLoading}
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalWithdrawn={totalLedgerWithdrawn}
        totalDeposit={totalLedgerDeposit}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
      />

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
            {showData === "114" ? (
              <DetailedListPreview
                printRef={printDetailedListRef}
                tableData={tableData}
                fromDate={fromDate}
                toDate={toDate}
              />
            ) : (
              <></>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};
export default InvestmentReport;
