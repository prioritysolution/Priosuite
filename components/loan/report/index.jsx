"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSelector } from "react-redux";
import DisburseRegisterTable from "./DisburseRegisterTable";
import RepayRegisterTable from "./RepayRegisterTable";
import DetailedListTable from "./DetailedListTable";
import LoanLedger from "@/common/ledger/loanLedger/LoanLedger";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { ClipLoader } from "react-spinners";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import DisburseRegisterPreview from "./DisburseRegisterPreview";
import DetailedListPreview from "./DetailedListPreview";
import { useState } from "react";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import RepaymentRegisterPreview from "./RepaymentRegisterPreview";
import CollectionReceipt from "../repayment/CollectionReceipt";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const LoanReport = ({
  loading,
  form,
  handleSubmit,
  tableData,
  toDate,
  totalDisburseAmount,
  totalShareAmount,
  totalInsAmount,
  totalMisAmount,
  totalNetDisburse,
  totalOpening,
  totalDisburse,
  totalPrn,
  totalIntt,
  totalAmount,
  totalCurrOuts,
  totalOdOuts,
  totalCurrIntt,
  totalOdIntt,
  showData,
  handleShowLedger,
  showLedger,
  setShowLedger,
  getLedgerLoading,
  ledgerHeaderData,
  ledgerTableData,
  totalLedgerDisburse,
  totalPrincipalRefund,
  totalInterestRefund,
  userName,
  currentDate,
  currentTime,
  fromDate,
  handleGenerateCollectionReceipt,
  isOpenCollectionReceipt,
  setIsOpenCollectionReceipt,
  collectionReceiptData,
}) => {
  const { t } = useTranslation();

  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const productTypeData = useSelector(
    (state) => state?.loanReport?.loanProductList,
  );

  console.log("productTypeData= ", productTypeData);

  const reportTypeData = useSelector(
    (state) => state?.memberReport?.reportTypeData,
  );

  const printDisburseRegisterRef = useRef(null);
  const printRepaymentRegisterRef = useRef(null);
  const printDetailedListRef = useRef(null);
  const printHostRef = useRef(null);

  const generateDisburseRegisterPrint = useReactToPrint({
    contentRef: printDisburseRegisterRef,
    documentTitle: `LoanDisburseRegister-${fromDate}-${
      toDate && format(toDate, "dd-MM-yyyy")
    }`,
  });
  const generateRepaymentRegisterPrint = useReactToPrint({
    contentRef: printRepaymentRegisterRef,
    documentTitle: `LoanRepaymentRegister-${fromDate}-${
      toDate && format(toDate, "dd-MM-yyyy")
    }`,
  });
  const generateDetailedListPrint = useReactToPrint({
    contentRef: printDetailedListRef,
    documentTitle: `LoanDetailedList-${fromDate}-${
      toDate && format(toDate, "dd-MM-yyyy")
    }`,
  });

  const formatReportDate = (value) =>
    value ? format(value, "dd-MM-yyyy") : "";

  const waitNextFrame = () =>
    new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

  const handleDownloadPDF = async () => {
    let element = null;
    let docTitle = "LoanReport";

    if (showData === "110") {
      element = printDisburseRegisterRef.current;
      docTitle = `LoanDisburseRegister-${formatReportDate(fromDate)}-${formatReportDate(toDate)}`;
    } else if (showData === "111") {
      element = printRepaymentRegisterRef.current;
      docTitle = `LoanRepaymentRegister-${formatReportDate(fromDate)}-${formatReportDate(toDate)}`;
    } else if (showData === "112") {
      element = printDetailedListRef.current;
      docTitle = `LoanDetailedList-${formatReportDate(fromDate)}-${formatReportDate(toDate)}`;
    }

    const host = printHostRef.current;

    if (!element) {
      toast.error(t("loan.nothingToDownload"));
      return;
    }

    if (!(tableData?.length > 0)) {
      toast.error(t("loan.noLoanReportData"));
      return;
    }

    const prevHostStyle = host?.getAttribute("style") || "";

    try {
      setPdfLoading(true);

      if (host) {
        host.setAttribute(
          "style",
          "position:fixed;left:-10000px;top:0;width:297mm;background:#ffffff;pointer-events:none;z-index:-1;opacity:1;",
        );
      }
      await waitNextFrame();

      const pageNodes = Array.from(
        element.querySelectorAll("[data-print-page='true']"),
      );
      const pagesToCapture = pageNodes.length > 0 ? pageNodes : [element];

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const pageWidth = 297;
      const pageHeight = 210;
      const captureScale = Math.max(2.5, window.devicePixelRatio || 1);
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
        toast.error(t("loan.failedToCaptureReport"));
        return;
      }

      pdf.save(`${docTitle}.pdf`);
      toast.success(t("loan.pdfDownloaded"));
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
    <div className="w-full h-full min-h-0 min-w-0 flex p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full min-h-0 min-w-0 flex flex-col items-stretch border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        {/* Form stays fixed — does not scroll with the page */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full shrink-0"
            autoComplete="off"
          >
            <div className="w-full flex flex-col border border-primary rounded-lg overflow-hidden">
              <div
                className={cn(
                  "flex items-center justify-between p-3 sm:p-5 py-2 bg-primary/10",
                  {
                    "border-b border-primary transition-all duration-300 ":
                      showReportForm,
                  },
                )}
              >
                <div />
                <h3 className="text-lg sm:text-xl font-semibold">{t("loan.loanReport")}</h3>
                <div
                  onClick={() => setShowReportForm((prev) => !prev)}
                  className="text-primary text-xl cursor-pointer"
                >
                  {showReportForm ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 xl:gap-x-10 gap-y-3 px-3 sm:px-5",
                  showReportForm
                    ? "max-h-[1000px] py-2"
                    : "max-h-0 py-0 pointer-events-none opacity-0",
                )}
              >
                <DatePickerField
                  control={form.control}
                  name="fromDate"
                  label={t("loan.fromDate")}
                  // startYear={2000}
                  // endYear={2050}
                  isManualInput={true}

                />

                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label={t("loan.toDate")}
                  // startYear={2000}
                  // endYear={2050}
                  isManualInput={true}
                />

                <DropdownField
                  control={form.control}
                  name="productType"
                  label={t("loan.loanProduct")}
                  options={productTypeData}
                  optionLabelKey="Product_Name"
                  placeholder={t("loan.selectLoanProduct")}
                  searchPlaceholder={t("loan.searchLoanProduct")}
                />

                <DropdownField
                  control={form.control}
                  name="reportType"
                  label={t("loan.reportType")}
                  options={reportTypeData}
                  optionLabelKey="Option_Value"
                  placeholder={t("loan.selectReportType")}
                  searchPlaceholder={t("loan.searchReportType")}
                />

                <DropdownField
                  control={form.control}
                  name="branch"
                  label={t("loan.branch")}
                  options={branchData}
                  optionLabelKey="Branch_Name"
                  placeholder={t("loan.selectBranch")}
                  searchPlaceholder={t("loan.searchBranch")}
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
                      if (loading || pdfLoading) return;
                      if (tableData?.length > 0)
                        showData === "110"
                          ? generateDisburseRegisterPrint()
                          : showData === "111"
                            ? generateRepaymentRegisterPrint()
                            : showData === "112"
                              ? generateDetailedListPrint()
                              : null;
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ":
                          loading ||
                          pdfLoading ||
                          !(tableData?.length > 0),
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
                      handleDownloadPDF();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (loading || pdfLoading) return;
                        handleDownloadPDF();
                      }
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ":
                          loading ||
                          pdfLoading ||
                          !(tableData?.length > 0),
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

        {/* Only the table area scrolls */}
        {showData && showData.length > 0 && (
          <div className="flex-1 min-h-0 min-w-0 rounded-md border border-primary overflow-auto">
            <div className="py-4 min-w-max px-2 sm:px-3">
              {showData === "110" ? (
                <DisburseRegisterTable
                  loading={loading}
                  tableData={tableData}
                  totalDisburseAmount={totalDisburseAmount}
                  totalShareAmount={totalShareAmount}
                  totalInsAmount={totalInsAmount}
                  totalMisAmount={totalMisAmount}
                  totalNetDisburse={totalNetDisburse}
                  handleShowLedger={handleShowLedger}
                />
              ) : showData === "111" ? (
                <RepayRegisterTable
                  loading={loading}
                  tableData={tableData}
                  totalPrn={totalPrn}
                  totalIntt={totalIntt}
                  totalAmount={totalAmount}
                  handleShowLedger={handleShowLedger}
                  handleGenerateCollectionReceipt={
                    handleGenerateCollectionReceipt
                  }
                />
              ) : showData === "112" ? (
                <DetailedListTable
                  loading={loading}
                  tableData={tableData}
                  totalOpening={totalOpening}
                  totalDisburse={totalDisburse}
                  totalPrn={totalPrn}
                  totalIntt={totalIntt}
                  totalCurrOuts={totalCurrOuts}
                  totalOdOuts={totalOdOuts}
                  totalCurrIntt={totalCurrIntt}
                  totalOdIntt={totalOdIntt}
                  handleShowLedger={handleShowLedger}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
      <LoanLedger
        loading={getLedgerLoading}
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalDisburse={totalLedgerDisburse}
        totalPrincipalRefund={totalPrincipalRefund}
        totalInterestRefund={totalInterestRefund}
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
              width: "297mm",
              background: "#ffffff",
              pointerEvents: "none",
              zIndex: -1,
            }}
          >
            {showData === "110" ? (
              <DisburseRegisterPreview
                printRef={printDisburseRegisterRef}
                tableData={tableData}
                totalDisburseAmount={totalDisburseAmount}
                totalShareAmount={totalShareAmount}
                totalInsAmount={totalInsAmount}
                totalMisAmount={totalMisAmount}
                totalNetDisburse={totalNetDisburse}
                fromDate={fromDate}
                toDate={toDate}
              />
            ) : showData === "111" ? (
              <RepaymentRegisterPreview
                printRef={printRepaymentRegisterRef}
                tableData={tableData}
                fromDate={fromDate}
                toDate={toDate}
              />
            ) : showData === "112" ? (
              <DetailedListPreview
                printRef={printDetailedListRef}
                tableData={tableData}
                totalOpening={totalOpening}
                totalDisburse={totalDisburse}
                totalPrn={totalPrn}
                totalIntt={totalIntt}
                totalCurrOuts={totalCurrOuts}
                totalOdOuts={totalOdOuts}
                totalCurrIntt={totalCurrIntt}
                totalOdIntt={totalOdIntt}
                fromDate={fromDate}
                toDate={toDate}
              />
            ) : (
              <></>
            )}
          </div>,
          document.body,
        )}

      {showData === "111" ? (
        <CollectionReceipt
          isOpen={isOpenCollectionReceipt}
          setIsOpen={setIsOpenCollectionReceipt}
          collectionReceiptData={collectionReceiptData}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
export default LoanReport;
