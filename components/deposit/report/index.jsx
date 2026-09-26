

"use client";

import { useTranslation } from "react-i18next";
import { useEnglishOnly } from "@/i18n/useEnglishOnly";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useSelector } from "react-redux";
import OpeningRegisterTable from "./OpeningRegisterTable";
import TransactionRegisterTable from "./TransactionRegisterTable";
import CloseRegisterTable from "./CloseRegisterTable";
import DetailedListTable from "./DetailedListTable";
import InterestListTable from "./InterestListTable";
import DepositLedger from "@/common/ledger/depositLedger/DepositLedger";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { ClipLoader } from "react-spinners";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import OpeningRegisterPreview from "./OpeningRegisterPreview";
import { cn } from "@/lib/utils";
import CloseRegisterPreview from "./CloseRegisterPreview";
import InterestListPreview from "./InterestListPreview";
import DetailedListPreview from "./DetailedListPreview";
import TransactionRegisterPreview from "./TransactionRegisterPreview";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import DepositReceipt from "../deposit/DepositReceipt";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { downloadDepositReportPdf } from "./buildDepositReportPdf";

const DepositReport = ({
  loading,
  form,
  handleSubmit,
  tableData,
  toDate,
  totalDeposit,
  totalWithdrawn,
  totalInterest,
  totalOpening,
  totalClosing,
  totalPaidIntt,
  totalDueIntt,
  totalAmount,
  showData,
  handleShowLedger,
  showLedger,
  setShowLedger,
  getLedgerLoading,
  ledgerHeaderData,
  ledgerTableData,
  totalLedgerDeposit,
  totalLedgerWithdrawn,
  totalLedgerInterest,
  ledgerUserName,
  currentLedgerDate,
  currentLedgerTime,
  fromDate,
  handleGenerateDepositReceipt,
  isOpenDepositReceipt,
  setIsOpenDepositReceipt,
  depositReceiptData,
}) => {
  const { t } = useTranslation();
  const { t: tEn } = useEnglishOnly();

  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const productTypeData = useSelector(
    (state) => state?.depositReport?.productTypeData,
  );

  const reportTypeData = useSelector(
    (state) => state?.memberReport?.reportTypeData,
  );

  const printOpeningRegisterRef = useRef(null);
  const printTransactionRegisterRef = useRef(null);
  const printClosingRegisterRef = useRef(null);
  const printDetailedListRef = useRef(null);
  const printInterestListRef = useRef(null);
  const printHostRef = useRef(null);

  const generateOpeningRegisterPrint = useReactToPrint({
    contentRef: printOpeningRegisterRef,
    documentTitle: `AcountOpeningRegister-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateTransactionRegisterPrint = useReactToPrint({
    contentRef: printTransactionRegisterRef,
    documentTitle: `TransactionRegister-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateClosingRegisterPrint = useReactToPrint({
    contentRef: printClosingRegisterRef,
    documentTitle: `AcountClosingRegister-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateDetailedListPrint = useReactToPrint({
    contentRef: printDetailedListRef,
    documentTitle: `DetailedList-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateInterestListPrint = useReactToPrint({
    contentRef: printInterestListRef,
    documentTitle: `InterestLedger-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const formatReportDate = (value) =>
    value ? format(value, "dd-MM-yyyy") : "";

  const handleDownloadPDF = async () => {
    const titles = {
      105: "AcountOpeningRegister",
      106: "TransactionRegister",
      107: "AcountClosingRegister",
      108: "DetailedList",
      109: "InterestLedger",
    };

    if (!titles[showData]) {
      toast.error("Nothing to download. Please generate the report first.");
      return;
    }

    if (!(tableData?.length > 0)) {
      toast.error("No deposit report data to download.");
      return;
    }

    const docTitle = `${titles[showData]}-${formatReportDate(fromDate)}-${formatReportDate(toDate)}`;
    const toastId = toast.loading("Preparing PDF…");

    try {
      setPdfLoading(true);
      await downloadDepositReportPdf({
        showData,
        tableData,
        fromDate,
        toDate,
        docTitle,
        t: tEn,
        totals: {
          totalOpening,
          totalDeposit,
          totalWithdrawn,
          totalClosing,
          totalPaidIntt,
          totalDueIntt,
          totalAmount,
        },
        onProgress: (done, total) => {
          toast.loading(`Writing rows ${done} / ${total}`, { id: toastId });
        },
      });
      toast.success("PDF downloaded", { id: toastId });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",
        { id: toastId },
      );
    } finally {
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
                  "flex items-center justify-between p-5 py-2  bg-primary/10",
                  {
                    "border-b border-primary transition-all duration-300 ":
                      showReportForm,
                  },
                )}
              >
                <div />
                <h3 className="text-xl font-semibold ">{tEn("deposit.report.title")}</h3>
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
                  label={t("deposit.fields.fromDate")}
                  isManualInput={true}
                />

                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label={t("deposit.fields.toDate")}
                  isManualInput={true}
                />

                <DropdownField
                  control={form.control}
                  name="productType"
                  label={t("deposit.fields.productType")}
                  options={productTypeData}
                  optionLabelKey="Prd_SH_Name"
                  placeholder={t("deposit.report.placeholders.productType")}
                  searchPlaceholder={t("deposit.report.placeholders.searchProductType")}
                />

                <DropdownField
                  control={form.control}
                  name="reportType"
                  label={t("deposit.report.fields.reportType")}
                  options={reportTypeData}
                  optionLabelKey="Option_Value"
                  placeholder={t("deposit.report.placeholders.reportType")}
                  searchPlaceholder={t("deposit.report.placeholders.searchReportType")}
                />

                <DropdownField
                  control={form.control}
                  name="branch"
                  label={t("deposit.report.fields.branch")}
                  options={branchData}
                  optionLabelKey="Branch_Name"
                  placeholder={t("deposit.report.placeholders.branch")}
                  searchPlaceholder={t("deposit.report.placeholders.searchBranch")}
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
                        showData === "105"
                          ? generateOpeningRegisterPrint()
                          : showData === "106"
                            ? generateTransactionRegisterPrint()
                            : showData === "107"
                              ? generateClosingRegisterPrint()
                              : showData === "108"
                                ? generateDetailedListPrint()
                                : showData === "109"
                                  ? generateInterestListPrint()
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

        {showData && showData.length > 0 && (
          <div className="w-full border border-primary overflow-hidden rounded-lg">
            <div className="w-full h-full flex flex-col overflow-x-scroll">
              {showData === "105" ? (
                <OpeningRegisterTable
                  tableData={tableData}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : showData === "106" ? (
                <TransactionRegisterTable
                  tableData={tableData}
                  totalDeposit={totalDeposit}
                  totalWithdrawn={totalWithdrawn}
                  totalInterest={totalInterest}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                  handleGenerateDepositReceipt={handleGenerateDepositReceipt}
                />
              ) : showData === "107" ? (
                <CloseRegisterTable
                  tableData={tableData}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : showData === "108" ? (
                <DetailedListTable
                  tableData={tableData}
                  totalOpening={totalOpening}
                  totalDeposit={totalDeposit}
                  totalWithdrawn={totalWithdrawn}
                  totalClosing={totalClosing}
                  totalPaidIntt={totalPaidIntt}
                  totalDueIntt={totalDueIntt}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : showData === "109" ? (
                <InterestListTable
                  tableData={tableData}
                  totalAmount={totalAmount}
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

      <DepositLedger
        loading={getLedgerLoading}
        showLedgerDialog={showLedger}
        setShowLedgerDialog={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
        currentDate={currentLedgerDate}
        currentTime={currentLedgerTime}
        userName={ledgerUserName}
        totalDeposit={totalLedgerDeposit}
        totalWithdrawn={totalLedgerWithdrawn}
        totalInterest={totalLedgerInterest}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
      />

      {mounted && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={printHostRef}
            aria-hidden
            style={{
              position: "fixed",
              left: "-10000px",
              top: 0,
              width: showData === "109" ? "210mm" : "297mm",
              background: "#ffffff",
              pointerEvents: "none",
              zIndex: -1,
            }}
          >
            {showData === "105" ? (
              <OpeningRegisterPreview
                printRef={printOpeningRegisterRef}
                tableData={tableData}
                fromDate={fromDate}
                toDate={toDate}
              />
            ) : showData === "106" ? (
              <TransactionRegisterPreview
                printRef={printTransactionRegisterRef}
                tableData={tableData}
                fromDate={fromDate}
                toDate={toDate}
              />
            ) : showData === "107" ? (
              <CloseRegisterPreview
                printRef={printClosingRegisterRef}
                tableData={tableData}
                fromDate={fromDate}
                toDate={toDate}
              />
            ) : showData === "108" ? (
              <DetailedListPreview
                printRef={printDetailedListRef}
                tableData={tableData}
                totalOpening={totalOpening}
                totalDeposit={totalDeposit}
                totalWithdrawn={totalWithdrawn}
                totalClosing={totalClosing}
                totalPaidIntt={totalPaidIntt}
                totalDueIntt={totalDueIntt}
                fromDate={fromDate}
                toDate={toDate}
              />
            ) : showData === "109" ? (
              <InterestListPreview
                printRef={printInterestListRef}
                tableData={tableData}
                totalAmount={totalAmount}
                fromDate={fromDate}
                toDate={toDate}
              />
            ) : (
              <></>
            )}
          </div>,
          document.body,
        )}

      {showData === "106" ? (
        <DepositReceipt
          isOpen={isOpenDepositReceipt}
          setIsOpen={setIsOpenDepositReceipt}
          depositReceiptData={depositReceiptData}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
export default DepositReport;
